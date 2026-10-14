<script setup lang="ts">
import { PREVIEW_STATES, type PreviewState } from '~/utils/previewStates'

/**
 * Служебная демо-панель для ревью: форс состояний экрана и демо-флаги API.
 * Выключается NUXT_PUBLIC_DEMO_PANEL=false; не рендерится при ?state= (pixel-diff).
 */
defineProps<{ state: PreviewState | null }>()
const emit = defineEmits<{ 'update:state': [PreviewState | null] }>()
const slow = defineModel<boolean>('slow', { default: false })
const fail = defineModel<boolean>('fail', { default: false })

const open = ref(false)

function pick(s: PreviewState | null) {
  emit('update:state', s)
  open.value = false
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <button class="demo-toggle" type="button" aria-label="Демо-панель" :aria-expanded="open" @click="open = true">
    <span class="demo-toggle-icon" aria-hidden="true">⚙</span>
  </button>

  <Transition name="demo">
    <div v-if="open" class="demo-backdrop" @click.self="open = false">
      <section class="demo-sheet" role="dialog" aria-modal="true" aria-labelledby="demo-title">
        <header class="demo-head">
          <h2 id="demo-title" class="demo-title">Демо-панель</h2>
          <span class="demo-badge">для ревью</span>
          <button class="demo-close" type="button" aria-label="Закрыть" @click="open = false">✕</button>
        </header>

        <p class="demo-label">Состояние экрана</p>
        <div class="demo-chips">
          <button class="demo-chip demo-chip-live" type="button" :aria-pressed="state === null" @click="pick(null)">
            Живой режим
          </button>
          <button
            v-for="s in PREVIEW_STATES"
            :key="s"
            class="demo-chip"
            type="button"
            :aria-pressed="state === s"
            @click="pick(s)"
          >
            {{ s }}
          </button>
        </div>

        <p class="demo-label">Сеть (живой режим)</p>
        <label class="demo-switch">
          <span>Медленная сеть <small>+2 с к запросам</small></span>
          <input v-model="slow" type="checkbox" role="switch">
        </label>
        <label class="demo-switch">
          <span>Ошибка сервера <small>API отвечает 500</small></span>
          <input v-model="fail" type="checkbox" role="switch">
        </label>
      </section>
    </div>
  </Transition>
</template>

<style scoped>
.demo-toggle {
  position: fixed;
  z-index: 50;
  top: max(var(--space-4), env(safe-area-inset-top));
  right: max(var(--space-4), env(safe-area-inset-right));
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--size-touch-min);
  height: var(--size-touch-min);
  opacity: 0.6;
}
.demo-toggle:active { opacity: 1; }
.demo-toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: var(--size-border) solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1;
}

.demo-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgb(43 33 24 / 0.32);
}

.demo-sheet {
  width: 100%;
  max-width: 480px;
  padding: var(--space-16) var(--space-screen-x) max(var(--space-24), env(safe-area-inset-bottom));
  border-radius: var(--radius-card) var(--radius-card) 0 0;
  background: var(--color-surface);
  font-size: 14px;
  line-height: 20px;
}

.demo-head { display: flex; align-items: center; gap: var(--space-8); }
.demo-title { font-size: 18px; line-height: 24px; font-weight: 800; }
.demo-badge {
  padding: 2px var(--space-8);
  border-radius: var(--radius-badge);
  border: var(--size-border) dashed var(--color-text-tertiary);
  color: var(--color-text-tertiary);
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
}
.demo-close {
  margin-left: auto;
  margin-right: calc(-1 * var(--space-12));
  width: var(--size-touch-min);
  height: var(--size-touch-min);
  color: var(--color-text-secondary);
  font-size: 18px;
}

.demo-label {
  margin: var(--space-16) 0 var(--space-8);
  color: var(--color-text-tertiary);
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.demo-chips { display: flex; flex-wrap: wrap; gap: var(--space-8); }
.demo-chip {
  min-height: 36px;
  padding: 0 var(--space-12);
  border-radius: var(--radius-banner);
  border: var(--size-border) solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-primary);
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 13px;
  font-weight: 600;
}
.demo-chip-live { font-family: var(--font-family); font-size: 14px; font-weight: 700; }
.demo-chip[aria-pressed='true'] {
  border-color: var(--color-accent);
  background: var(--color-accent);
  color: var(--color-on-accent);
}
.demo-chip:active { opacity: 0.7; }

.demo-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  min-height: var(--size-touch-min);
  font-weight: 700;
  cursor: pointer;
}
.demo-switch small { display: block; color: var(--color-text-tertiary); font-size: 12px; line-height: 16px; font-weight: 400; }
.demo-switch input {
  -webkit-appearance: none;
  appearance: none;
  flex: none;
  position: relative;
  width: 44px;
  height: 26px;
  margin: 0;
  border-radius: 13px;
  background: var(--color-border);
  transition: background 0.15s;
}
.demo-switch input::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-surface);
  transition: transform 0.15s;
}
.demo-switch input:checked { background: var(--color-accent); }
.demo-switch input:checked::after { transform: translateX(18px); }

.demo-enter-active, .demo-leave-active { transition: opacity 0.2s; }
.demo-enter-active .demo-sheet, .demo-leave-active .demo-sheet { transition: transform 0.2s; }
.demo-enter-from, .demo-leave-to { opacity: 0; }
.demo-enter-from .demo-sheet, .demo-leave-to .demo-sheet { transform: translateY(100%); }
</style>
