export type OfferId = 'year' | 'month'

export interface Offer {
  id: OfferId
  title: string
  price: number
  currency: 'RUB'
  period: 'year' | 'month'
  perMonth?: number
  badge?: string
  note?: string
}

export interface Purchase {
  id: number
  offerId: OfferId
  deviceId: string
  createdAt: string
}

export interface PurchaseRequest {
  offerId: OfferId
  deviceId: string
}

export interface LastPurchaseResponse {
  purchase: Purchase | null
}
