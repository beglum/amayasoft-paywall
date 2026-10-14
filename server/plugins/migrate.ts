export default defineNitroPlugin(async () => {
  try {
    const sql = useDb()
    await sql`CREATE TABLE IF NOT EXISTS purchases (
      id bigserial primary key,
      offer_id text not null,
      device_id text not null,
      created_at timestamptz not null default now()
    )`
    await sql`CREATE INDEX IF NOT EXISTS purchases_device_id_idx ON purchases (device_id)`
    console.info('[db] schema ready')
  } catch (err) {
    console.error('[db] migration failed:', err instanceof Error ? err.message : err)
  }
})
