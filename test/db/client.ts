export * from './automation/reset-database'
import { PrismaClient } from '@prisma/client'

export const baseSchema = 'focvs-test'
export const dbUrl = process.env.TEST_DATABASE_URL

export const baseDbUrl = `${dbUrl}/${baseSchema}`

const prisma = new PrismaClient({
  datasourceUrl: baseDbUrl
})

export default prisma
