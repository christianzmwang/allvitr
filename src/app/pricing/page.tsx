import Link from 'next/link'
import NavBar from '../components/NavBar'
import Script from 'next/script'

export const metadata = {
  title: 'Pricing - Custom AI Platform Solutions',
  description: 'Get custom pricing for Allvitr\'s AI-powered business intelligence platforms. Contact us to discuss your specific automation needs and get a tailored demo.',
  keywords: ['allvitr pricing', 'AI platform pricing', 'business intelligence cost', 'custom solutions', 'enterprise pricing'],
  openGraph: {
    title: 'Allvitr Pricing - Custom AI Platform Solutions',
    description: 'Get custom pricing for Allvitr\'s AI-powered business intelligence platforms. Contact us for a tailored demo.',
    url: 'https://allvitr.com/pricing',
    type: 'website',
  },
  twitter: {
    title: 'Allvitr Pricing - Custom AI Platform Solutions',
    description: 'Get custom pricing for Allvitr\'s AI-powered business intelligence platforms. Contact us for a tailored demo.',
  },
  alternates: {
    canonical: 'https://allvitr.com/pricing',
  },
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = await searchParams
  const isSent = (resolvedSearchParams?.sent || '') === '1'

  return (
    <div className="">
      <NavBar />
      <main className="flex-1 pad-section min-h-screen flex items-center justify-start">
        <div className="container-80 text-left">
          <Script
            id="pricing-faq-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'How is Allvitr priced?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Pricing is customized based on the mix of platforms (Hugin, Munin, Odin), data volume, seats, and deployment requirements. We scope a tailored demo first.'
                    }
                  },
                  {
                    '@type': 'Question',
                    name: 'Do you offer pilots or proofs of concept?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes. We deploy a targeted pilot aligned to your automation or intelligence use case so you can validate impact quickly.'
                    }
                  },
                  {
                    '@type': 'Question',
                    name: 'Is enterprise security supported?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes. We support secure data handling, governance, and can align to your compliance review process.'
                    }
                  }
                ]
              })
            }}
          />
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Pricing
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-3xl mb-6">
            Get in touch with us to discuss what you want to automate. <br /> We
            will deploy a demo to your needs.
          </p>
          {isSent && (
            <div className="mt-6 mb-6">
              <div className="rounded-md border border-green-600/30 bg-green-100/50 text-green-900 p-3 max-w-xl">
                Thanks! Your message was sent. We&apos;ll be in touch shortly.
              </div>
            </div>
          )}
          <div className="mt-10 md:mt-12">
            <Link href="/contact" className="btn btn-primary px-5 py-3">
              Contact us
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
