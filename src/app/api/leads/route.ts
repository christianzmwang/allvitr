import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { LeadsSearchSchema, sanitizeString } from '@/lib/validation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = LeadsSearchSchema.safeParse({
      keywords: sanitizeString(body.keywords),
      category: sanitizeString(body.category),
      location: sanitizeString(body.location),
      radiusKm: body.radiusKm,
      hiring: body.hiring,
      ads: body.ads,
      newlyOpened: body.newlyOpened,
      minRating: body.minRating,
      minReviews: body.minReviews,
      limit: body.limit,
    })

    if (!parsed.success) {
      return NextResponse.json({ error: 'Ugyldig input' }, { status: 400 })
    }

    const {
      keywords,
      category,
      hiring,
      ads,
      newlyOpened,
      minRating,
      minReviews,
      limit,
    } = parsed.data

    // Build Prisma where clause using available filters
    const where: {
      AND: Array<Record<string, unknown>>
    } = {
      AND: [
        category
          ? {
              company: {
                category: { contains: category, mode: 'insensitive' },
              },
            }
          : {},
        keywords
          ? {
              OR: [
                {
                  company: {
                    name: { contains: keywords, mode: 'insensitive' },
                  },
                },
                {
                  company: {
                    city: { contains: keywords, mode: 'insensitive' },
                  },
                },
                {
                  company: {
                    website: { contains: keywords, mode: 'insensitive' },
                  },
                },
              ],
            }
          : {},
        typeof hiring === 'boolean' ? { hiring } : {},
        typeof ads === 'boolean' ? { ads } : {},
        typeof newlyOpened === 'boolean' ? { isNew: newlyOpened } : {},
        typeof minRating === 'number'
          ? { company: { rating: { gte: minRating } } }
          : {},
        typeof minReviews === 'number'
          ? { company: { reviews: { gte: minReviews } } }
          : {},
      ],
    }

    const leads = await prisma.lead.findMany({
      where,
      include: { company: true },
      take: limit ?? 50,
      orderBy: { score: 'desc' },
    })

    const results = leads.map((l) => ({
      id: l.id,
      name: l.company.name,
      category: l.company.category,
      website: l.company.website,
      city: l.company.city,
      zip: l.company.zip,
      phone: l.company.phone,
      email: l.company.email,
      signals: {
        rating: l.company.rating ?? null,
        reviews: l.company.reviews ?? null,
        hiring: l.hiring,
        ads: l.ads,
        new: l.isNew,
      },
      score: l.score,
      source: l.source,
    }))

    return NextResponse.json({ results })
  } catch (err) {
    console.error('POST /api/leads error', { msg: (err as Error).message })
    return NextResponse.json({ error: 'Serverfeil' }, { status: 500 })
  }
}
