<script setup lang="ts">
import type { LastPurchaseResponse, Offer, OfferId, Purchase } from '#shared/types'
import { DEFAULT_OFFER_ID, OFFERS, formatPrice } from '#shared/offers'
import { PREVIEW_STATES, type PreviewState } from '~/utils/previewStates'

/**
 * Состояния экрана (фреймы Figma): loading, error, default, purchasing, success, restore-empty
 * + restore-success (по аналогии с success).
 * Форс состояния без сети — ?state=<имя> (pixel-diff, прямые ссылки) или демо-панель ⚙ (реактивно).
 * Демо-флаги API: ?fail=1 / ?delay=ms или переключатели панели.
 */
type Notice = 'restore-empty' | 'restore-error' | 'purchase-error' | null

const VALUES = ['120+ развивающих игр для 3–7 лет', 'Новые уровни каждую неделю', 'Без рекламы и случайных покупок']
const SLOW_DELAY_MS = '2000'

const route = useRoute()
const config = useRuntimeConfig()
const deviceId = useDeviceId()

const queryString = (v: unknown) => (typeof v === 'string' ? v : undefined)
/** Состояние из ?state= — только оно отключает анимации (data-preview) и прячет панель. */
const urlPreview: PreviewState | null = PREVIEW_STATES.find((s) => s === route.query.state) ?? null
const preview = ref<PreviewState | null>(urlPreview)
const showDemoPanel = computed(() => String(config.public.demoPanel) !== 'false' && !urlPreview)

const delay = ref(queryString(route.query.delay))
const fail = ref(queryString(route.query.fail))
const slowNet = computed({ get: () => !!delay.value, set: (v: boolean) => { delay.value = v ? SLOW_DELAY_MS : undefined } })
const serverFail = computed({ get: () => !!fail.value, set: (v: boolean) => { fail.value = v ? '1' : undefined } })
const demoQuery = computed(() => ({ fail: fail.value, delay: delay.value }))

// Тарифы грузим на клиенте: в webview сразу виден экран со скелетонами, ?delay растягивает загрузку
const { data, status, refresh } = useFetch<Offer[]>('/api/offers', {
  query: demoQuery,
  server: false,
  lazy: true,
  immediate: urlPreview === null,
  watch: false,
})

/** Перезагрузка тарифов с нуля — чтобы «Медленная сеть» и «Ошибка сервера» были видны сразу. */
function reloadOffers() {
  data.value = undefined
  refresh()
}
watch(demoQuery, () => {
  if (!preview.value) reloadOffers()
})

const offers = computed<readonly Offer[] | null>(() => {
  if (preview.value) return preview.value === 'loading' || preview.value === 'error' ? null : OFFERS
  return data.value ?? null
})
const offersPhase = computed<'loading' | 'error' | 'ready'>(() => {
  if (preview.value === 'loading') return 'loading'
  if (preview.value === 'error') return 'error'
  if (offers.value?.length) return 'ready'
  return status.value === 'error' ? 'error' : 'loading'
})

const previewPurchase = (): Purchase => ({ id: 0, offerId: DEFAULT_OFFER_ID, deviceId: deviceId.value, createdAt: new Date(0).toISOString() })

const selectedId = ref<OfferId>(DEFAULT_OFFER_ID)
const purchasing = ref(urlPreview === 'purchasing')
const restoring = ref(false)
const purchase = ref<Purchase | null>(urlPreview === 'success' || urlPreview === 'restore-success' ? previewPurchase() : null)
const restored = ref(urlPreview === 'restore-success')
const notice = ref<Notice>(urlPreview === 'restore-empty' ? 'restore-empty' : null)

/** Переключение из демо-панели: null — живой режим (сброс форса и загрузка тарифов). */
function setPreview(s: PreviewState | null) {
  preview.value = s
  purchasing.value = s === 'purchasing'
  restoring.value = false
  purchase.value = s === 'success' || s === 'restore-success' ? previewPurchase() : null
  restored.value = s === 'restore-success'
  notice.value = s === 'restore-empty' ? 'restore-empty' : null
  if (s === null) reloadOffers()
}

const selectedOffer = computed(() => offers.value?.find((o) => o.id === selectedId.value) ?? null)
// До загрузки тарифов подпись CTA — по тарифу по умолчанию (как в макетах loading/error)
const ctaPrice = computed(() => formatPrice((selectedOffer.value ?? OFFERS.find((o) => o.id === DEFAULT_OFFER_ID)!).price))

const busy = computed(() => purchasing.value || restoring.value)

const NOTICE_TEXT: Record<Exclude<Notice, null>, string> = {
  'restore-empty': 'Покупок на этом устройстве не найдено',
  'restore-error': 'Не удалось проверить покупки. Попробуйте ещё раз',
  'purchase-error': 'Не удалось оформить покупку. Попробуйте ещё раз',
}

function select(id: OfferId) {
  if (busy.value) return
  selectedId.value = id
}

async function buy() {
  // Защита от двойного нажатия: кнопка disabled + флаг
  if (!selectedOffer.value || busy.value || preview.value) return
  purchasing.value = true
  notice.value = null
  try {
    purchase.value = await $fetch<Purchase>('/api/purchase', {
      method: 'POST',
      query: demoQuery.value,
      body: { offerId: selectedOffer.value.id, deviceId: deviceId.value },
    })
  } catch {
    notice.value = 'purchase-error'
  } finally {
    purchasing.value = false
  }
}

async function restore() {
  if (busy.value || preview.value) return
  restoring.value = true
  notice.value = null
  try {
    const res = await $fetch<LastPurchaseResponse>('/api/purchases', {
      query: { deviceId: deviceId.value, ...demoQuery.value },
    })
    if (res.purchase) {
      purchase.value = res.purchase
      restored.value = true
    } else {
      notice.value = 'restore-empty'
    }
  } catch {
    notice.value = 'restore-error'
  } finally {
    restoring.value = false
  }
}

/** «Начать играть»: сообщаем нативному приложению, что paywall можно закрыть. */
function startPlaying() {
  const message = JSON.stringify({ type: 'paywall:close', purchase: purchase.value })
  const w = window as unknown as {
    ReactNativeWebView?: { postMessage(m: string): void }
    webkit?: { messageHandlers?: { paywall?: { postMessage(m: unknown): void } } }
    Android?: { postMessage?(m: string): void }
  }
  w.ReactNativeWebView?.postMessage(message)
  w.webkit?.messageHandlers?.paywall?.postMessage(message)
  w.Android?.postMessage?.(message)
  window.parent?.postMessage(message, '*')
}
</script>

<template>
  <main class="paywall" :data-preview="urlPreview ?? undefined">
    <DemoPanel v-if="showDemoPanel" :state="preview" @update:state="setPreview" v-model:slow="slowNet" v-model:fail="serverFail" />

    <template v-if="purchase">
      <section class="success">
        <PaywallHeader>Готово! Весь мир Зверят открыт</PaywallHeader>
        <p class="success-text">
          <template v-if="restored">Покупка восстановлена. Все игры и новые уровни снова доступны.</template>
          <template v-else>Все игры и новые уровни уже доступны. Подписку можно отменить в настройках.</template>
        </p>
      </section>
      <footer class="footer">
        <CtaButton @click="startPlaying">Начать играть</CtaButton>
      </footer>
    </template>

    <template v-else>
      <div class="content">
        <PaywallHeader>Откройте весь мир Зверят</PaywallHeader>

        <ul class="values">
          <ValueItem v-for="text in VALUES" :key="text">{{ text }}</ValueItem>
        </ul>

        <div class="plans" :aria-busy="offersPhase === 'loading' || undefined">
          <template v-if="offersPhase === 'loading'">
            <PlanCardSkeleton />
            <PlanCardSkeleton />
          </template>

          <ErrorBlock v-else-if="offersPhase === 'error'" :busy="status === 'pending'" @retry="refresh()" />

          <template v-else>
            <div class="plan-list" role="radiogroup" aria-label="Тариф">
              <PlanCard
                v-for="offer in offers"
                :key="offer.id"
                name="offer"
                :offer="offer"
                :selected="offer.id === selectedId"
                :disabled="busy"
                @select="select(offer.id)"
              />
            </div>
            <InfoBanner v-if="notice">{{ NOTICE_TEXT[notice] }}</InfoBanner>
          </template>
        </div>
      </div>

      <footer class="footer">
        <CtaButton :loading="purchasing" :disabled="offersPhase !== 'ready' || restoring" @click="buy">
          Оформить за {{ ctaPrice }}
        </CtaButton>
        <button class="restore" type="button" :disabled="busy" :aria-busy="restoring || undefined" @click="restore">
          Восстановить покупки
        </button>
        <p class="footnote">Это тестовая покупка — деньги не списываются</p>
      </footer>
    </template>
  </main>
</template>

<style scoped>
.paywall {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  min-height: 100dvh;
  max-width: 480px;
  margin: 0 auto;
  padding:
    max(var(--space-safe-top), env(safe-area-inset-top))
    max(var(--space-screen-x), env(safe-area-inset-right))
    max(var(--space-safe-bottom), env(safe-area-inset-bottom))
    max(var(--space-screen-x), env(safe-area-inset-left));
  background: var(--color-bg);
}

.content { display: flex; flex-direction: column; gap: var(--space-24); padding-top: var(--space-8); }
.values { display: flex; flex-direction: column; gap: var(--space-12); }
.plans, .plan-list { display: flex; flex-direction: column; gap: var(--space-12); }

.footer { display: flex; flex-direction: column; align-items: center; gap: var(--space-4); margin-top: var(--space-24); }

.restore {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--size-touch-min);
  padding: 0 var(--space-16);
  color: var(--color-accent);
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
}
.restore:active { opacity: 0.7; }
.restore[aria-busy] { opacity: 0.64; }

.footnote { align-self: stretch; font-size: 12px; line-height: 16px; font-weight: 400; text-align: center; color: var(--color-text-tertiary); }

.success + .footer { margin-top: 0; }
.success { display: flex; flex: 1; flex-direction: column; justify-content: center; gap: var(--space-16); }
.success-text { font-size: 16px; line-height: 24px; font-weight: 400; text-align: center; color: var(--color-text-secondary); }
</style>
