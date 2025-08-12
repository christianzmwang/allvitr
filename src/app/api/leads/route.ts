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

    let results = leads.map((l) => ({
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

    if (results.length === 0) {
      const mock = [
        {
          id: 'mock-1',
          name: 'Kafé Aurora',
          category: 'Kafé',
          website: 'https://kafeaurora.no',
          city: 'Oslo',
          zip: '0150',
          phone: '+47 22 33 44 55',
          email: 'post@kafeaurora.no',
          signals: { rating: 4.5, reviews: 132, hiring: false, ads: true, new: false },
          score: 78,
          source: 'mock',
        },
        {
          id: 'mock-2',
          name: 'Sentrum Tannlege',
          category: 'Tannlege',
          website: 'https://sentrumtannlege.no',
          city: 'Bergen',
          zip: '5014',
          phone: '+47 55 12 34 56',
          email: 'post@sentrumtannlege.no',
          signals: { rating: 4.8, reviews: 89, hiring: true, ads: false, new: false },
          score: 84,
          source: 'mock',
        },
        {
          id: 'mock-3',
          name: 'Trio Frisør',
          category: 'Frisør',
          website: 'https://triofrisor.no',
          city: 'Trondheim',
          zip: '7013',
          phone: '+47 73 45 67 89',
          email: 'post@triofrisor.no',
          signals: { rating: 4.2, reviews: 57, hiring: false, ads: false, new: true },
          score: 71,
          source: 'mock',
        },
      ]

      // simple filter logic for mock
      results = mock.filter((m) => {
        if (category && !m.category.toLowerCase().includes(category.toLowerCase())) return false
        if (keywords) {
          const hay = `${m.name} ${m.city} ${m.website}`.toLowerCase()
          if (!hay.includes(keywords.toLowerCase())) return false
        }
        if (typeof hiring === 'boolean' && m.signals.hiring !== hiring) return false
        if (typeof ads === 'boolean' && m.signals.ads !== ads) return false
        if (typeof newlyOpened === 'boolean' && m.signals.new !== newlyOpened) return false
        if (typeof minRating === 'number' && (m.signals.rating ?? 0) < minRating) return false
        if (typeof minReviews === 'number' && (m.signals.reviews ?? 0) < minReviews) return false
        return true
      })
    }

    return NextResponse.json({ results })
  } catch (err) {
    console.error('POST /api/leads error', { msg: (err as Error).message })
    return NextResponse.json({ error: 'Serverfeil' }, { status: 500 })
  }
}
