import Link from 'next/link'
import NavBar from '../components/NavBar'

export default async function PricingPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = await searchParams
  const isSent = (resolvedSearchParams?.sent || '') === '1'

  return (
    <div className="page">
      <NavBar />
      <main className="flex-1 pad-section py-10 md:py-16">
        <div className="container-80">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Pricing
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-3xl">
            Get in touch with us to discuss what you want to automate. <br /> We will deploy a demo to your needs.
          </p>
        </div>
        {isSent && (
          <div className="container-80 mt-6">
            <div className="rounded-md border border-green-600/30 bg-green-100/50 text-green-900 p-3 max-w-xl">
              Thanks! Your message was sent. We’ll be in touch shortly.
            </div>
          </div>
        )}
        <div className="container-80 mt-10 md:mt-12">
          <Link href="/contact" className="btn btn-primary px-5 py-3">
            Contact us
          </Link>
        </div>
      </main>
    </div>
  )
}
