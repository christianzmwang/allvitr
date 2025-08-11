import NavBar from '../components/NavBar'
import ContactForm from '../components/ContactForm'

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
      <main className="flex-1 pad-section py-12 md:py-16">
        <div className="container-80">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Pricing
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl">
            Get in touch with us to discuss your challenges <br />
            and get a tailored solution!
          </p>
        </div>

        <ContactForm origin="/pricing" isSent={isSent} className="mt-12" />
      </main>
    </div>
  )
}
