import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const companies = [
    {
      name: 'Kafé Aurora',
      category: 'Kafé',
      website: 'https://kafeaurora.no',
      city: 'Oslo',
      zip: '0150',
      phone: '+47 22 33 44 55',
      email: 'post@kafeaurora.no',
      rating: 4.5,
      reviews: 132,
      signals: { hiring: false, ads: true, isNew: false },
      score: 78,
      source: 'seed',
    },
    {
      name: 'Sentrum Tannlege',
      category: 'Tannlege',
      website: 'https://sentrumtannlege.no',
      city: 'Bergen',
      zip: '5014',
      phone: '+47 55 12 34 56',
      email: 'post@sentrumtannlege.no',
      rating: 4.8,
      reviews: 89,
      signals: { hiring: true, ads: false, isNew: false },
      score: 84,
      source: 'seed',
    },
    {
      name: 'Trio Frisør',
      category: 'Frisør',
      website: 'https://triofrisor.no',
      city: 'Trondheim',
      zip: '7013',
      phone: '+47 73 45 67 89',
      email: 'post@triofrisor.no',
      rating: 4.2,
      reviews: 57,
      signals: { hiring: false, ads: false, isNew: true },
      score: 71,
      source: 'seed',
    },
    {
      name: 'Nordic Fit',
      category: 'Treningssenter',
      website: 'https://nordicfit.no',
      city: 'Stavanger',
      zip: '4006',
      phone: '+47 51 11 22 33',
      email: 'post@nordicfit.no',
      rating: 4.0,
      reviews: 240,
      signals: { hiring: true, ads: true, isNew: false },
      score: 82,
      source: 'seed',
    },
    {
      name: 'Lille Bakeri',
      category: 'Bakeri',
      website: 'https://lillebakeri.no',
      city: 'Drammen',
      zip: '3015',
      phone: '+47 32 44 55 66',
      email: 'post@lillebakeri.no',
      rating: 4.6,
      reviews: 150,
      signals: { hiring: false, ads: true, isNew: false },
      score: 79,
      source: 'seed',
    },
  ]

  for (const c of companies) {
    const company = await prisma.company.create({
      data: {
        name: c.name,
        category: c.category,
        website: c.website,
        city: c.city,
        zip: c.zip,
        phone: c.phone,
        email: c.email,
        rating: c.rating,
        reviews: c.reviews,
      },
    })

    await prisma.lead.create({
      data: {
        companyId: company.id,
        hiring: c.signals.hiring,
        ads: c.signals.ads,
        isNew: c.signals.isNew,
        score: c.score,
        source: c.source,
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
