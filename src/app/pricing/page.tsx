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
    <div className="">
      <NavBar />
      <main className="flex-1 pad-section min-h-screen flex items-center justify-start">
        <div className="container-80 text-left">
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
