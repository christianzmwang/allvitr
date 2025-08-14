import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function buildPgbouncerSafeUrl(url?: string): string | undefined {
  if (!url) return undefined
  try {
    const parsed = new URL(url)
    if (!parsed.searchParams.has('pgbouncer')) {
      parsed.searchParams.set('pgbouncer', 'true')
    }
    return parsed.toString()
  } catch {
    return url
  }
}

const datasourceUrl = buildPgbouncerSafeUrl(process.env.DATABASE_URL)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ['query'],
    datasources: { db: { url: datasourceUrl } },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
