import type { Purchase } from '#shared/types'
import { isOfferId } from '../data/offers'

interface Row {
  id: string
  offer_id: string
  device_id: string
  created_at: Date
}

export default defineEventHandler(async (event): Promise<Purchase> => {
  await applyDemoFlags(event)
  const body = await readBody<Record<string, unknown> | null>(event).catch(() => null)
  const offerId = body?.offerId
  const deviceId = typeof body?.deviceId === 'string' ? body.deviceId.trim() : ''

  if (!isOfferId(offerId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid offerId' })
  }
  if (!deviceId || deviceId.length > 128) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid deviceId' })
  }

  const sql = useDb()
  const [row] = await sql<Row[]>`
    INSERT INTO purchases (offer_id, device_id) VALUES (${offerId}, ${deviceId})
    RETURNING id, offer_id, device_id, created_at`
  if (!row) throw createError({ statusCode: 500, statusMessage: 'Insert failed' })

  return { id: Number(row.id), offerId, deviceId: row.device_id, createdAt: row.created_at.toISOString() }
})
