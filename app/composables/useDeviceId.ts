const COOKIE_NAME = 'device_id'
const ONE_YEAR = 60 * 60 * 24 * 365
const MAX_LENGTH = 128

function fromQuery(value: unknown): string | null {
  return typeof value === 'string' && value.trim() && value.length <= MAX_LENGTH ? value.trim() : null
}

/** deviceId: из ?deviceId= (приходит из приложения), иначе UUID в cookie `device_id`. */
export function useDeviceId() {
  const route = useRoute()
  const cookie = useCookie<string | null>(COOKIE_NAME, { maxAge: ONE_YEAR, sameSite: 'lax', default: () => null })

  // Cookie выдаём сразу (в т.ч. при SSR), чтобы id был стабилен между визитами
  if (!fromQuery(route.query.deviceId) && !cookie.value) cookie.value = crypto.randomUUID()

  return computed<string>(() => fromQuery(route.query.deviceId) ?? cookie.value ?? '')
}
