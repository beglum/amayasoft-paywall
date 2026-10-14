import type { LastPurchaseResponse } from '#shared/types'
import { isOfferId } from '../data/offers'

interface Row {
  id: string
  offer_id: string
  device_id: string
  created_at: Date
}

export default defineEventHandler(async (event): Promise<LastPurchaseResponse> => {
  await applyDemoFlags(event)
  const { deviceId } = getQuery(event)
  if (typeof deviceId !== 'string' || !deviceId.trim() || deviceId.length > 128) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid deviceId' })
  }

  const sql = useDb()
  const [row] = await sql<Row[]>`
    SELECT id, offer_id, device_id, created_at FROM purchases
    WHERE device_id = ${deviceId.trim()}
    ORDER BY created_at DESC, id DESC LIMIT 1`
  if (!row || !isOfferId(row.offer_id)) return { purchase: null }

  return {
    purchase: { id: Number(row.id), offerId: row.offer_id, deviceId: row.device_id, createdAt: row.created_at.toISOString() },
  }
})
