import type { Offer, OfferId } from './types'

/** Каталог тарифов. Источник для API и для превью состояний (?state=) без сети. */
export const OFFERS: readonly Offer[] = [
  { id: 'year', title: 'Год', price: 1990, currency: 'RUB', period: 'year', perMonth: 166, badge: 'Выгоднее', note: '166 ₽ в месяц' },
  { id: 'month', title: 'Месяц', price: 299, currency: 'RUB', period: 'month', note: 'Отмена в любой момент' },
]

export const DEFAULT_OFFER_ID: OfferId = 'year'

export function isOfferId(value: unknown): value is OfferId {
  return typeof value === 'string' && OFFERS.some((o) => o.id === value)
}

/** 1990 → «1 990 ₽» (неразрывные пробелы, как в макете). */
export function formatPrice(value: number): string {
  return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`
}
