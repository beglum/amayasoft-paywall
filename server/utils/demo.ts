import type { H3Event } from 'h3'

const MAX_DELAY_MS = 5000

/** Демонстрационные флаги: ?delay=ms (≤5000) и ?fail=1 → 500. */
export async function applyDemoFlags(event: H3Event): Promise<void> {
  const query = getQuery(event)
  const delay = Math.min(Math.max(Number(query.delay) || 0, 0), MAX_DELAY_MS)
  if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay))
  if (query.fail === '1' || query.fail === 'true') {
    throw createError({ statusCode: 500, statusMessage: 'Demo failure' })
  }
}
