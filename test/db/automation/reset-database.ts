import { execSync } from 'node:child_process'
import prisma, { baseDbUrl, baseSchema } from '../client'

let isInit = false

export async function initDatabase() {
  if (isInit) return

  execSync(`DATABASE_URL=${baseDbUrl} npx prisma migrate reset --force`)

  isInit = true
}

export async function resetDatabase() {
  await initDatabase()

  const tables: {
    tablename: string
  }[] = await prisma.$queryRaw`SELECT tablename 
                              FROM pg_catalog.pg_tables 
                              WHERE schemaname = ${baseSchema};`

  tables.map((table: { tablename: string }) => table.tablename) as string[]

  const queries: string[] = tables.map(
    (table) => `TRUNCATE TABLE "${baseSchema}"."${table}" RESTART IDENTITY CASCADE;`
  )

  for (const query of queries) {
    await prisma.$executeRawUnsafe(query)
  }
}
