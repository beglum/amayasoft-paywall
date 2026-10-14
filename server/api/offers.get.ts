import { OFFERS } from '../data/offers'

export default defineEventHandler(async (event) => {
  await applyDemoFlags(event)
  return OFFERS
})
