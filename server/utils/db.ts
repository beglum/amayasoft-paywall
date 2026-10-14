import postgres from 'postgres'

let client: postgres.Sql | null = null

export function useDb(): postgres.Sql {
  if (client) return client
  const url = useRuntimeConfig().databaseUrl || process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  client = postgres(url, { max: 5, idle_timeout: 30 })
  return client
}
