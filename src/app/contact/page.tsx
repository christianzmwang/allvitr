import NavBar from '../components/NavBar'
import { sendContactToSlack } from '../actions/sendContactToSlack'
import Script from 'next/script'

export const metadata = {
  title: 'Contact Us - Request a Demo',
  description: 'Get in touch with Allvitr for a personalized demo of our AI-powered business intelligence platforms. Contact our team to discuss how we can automate your market research and data analytics.',
  keywords: ['contact allvitr', 'demo request', 'business intelligence demo', 'market research consultation', 'AI platform demo'],
  openGraph: {
    title: 'Contact Allvitr - Request a Demo',
    description: 'Get in touch with Allvitr for a personalized demo of our AI-powered business intelligence platforms.',
    url: 'https://allvitr.com/contact',
    type: 'website',
  },
  twitter: {
    title: 'Contact Allvitr - Request a Demo',
    description: 'Get in touch with Allvitr for a personalized demo of our AI-powered business intelligence platforms.',
  },
  alternates: {
    canonical: 'https://allvitr.com/contact',
  },
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = await searchParams
  const isSent = (resolvedSearchParams?.sent || '') === '1'

  return (
    <div className="bg-black">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
      <NavBar />
    <section
      id="contact"
      data-nav-theme="dark"
      className="pad-section bg-black scroll-mt-24 md:scroll-mt-32 min-h-screen flex"
    >
        <div className="container-95 flex flex-col justify-center py-24 md:py-32">
          <div className="max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Contact</h1>
          </div>
          {isSent && (
      <div className="mt-4 mb-2 rounded-md border border-green-500/30 bg-green-900/30 text-green-200 p-3 max-w-xl">Your message was sent. We’ll be in touch shortly.</div>
          )}
          <form
            action={sendContactToSlack}
            className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"
          >
            <input type="hidden" name="origin" value="/contact" />
            <div className="md:col-span-4">
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full bg-transparent border-0 border-b border-gray-500 text-gray-200 placeholder-gray-500 px-0 py-3 focus:outline-none focus:ring-0 focus:border-red-600/90 hover:border-red-600/90 transition-colors"
                placeholder="Name"
              />
            </div>
            <div className="md:col-span-8">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-transparent border-0 border-b border-gray-500 text-gray-200 placeholder-gray-500 px-0 py-3 focus:outline-none focus:ring-0 focus:border-red-600/90 hover:border-red-600/90 transition-colors"
                placeholder="Email"
              />
            </div>
      <div className="md:col-span-4">
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full bg-transparent border-0 border-b border-gray-500 text-gray-200 placeholder-gray-500 px-0 py-3 focus:outline-none focus:ring-0 focus:border-red-600/90 hover:border-red-600/90 transition-colors"
                placeholder="Phone"
              />
            </div>
      <div className="md:col-span-8">
              <input
                id="company"
                name="company"
                type="text"
                className="w-full bg-transparent border-0 border-b border-gray-500 text-gray-200 placeholder-gray-500 px-0 py-3 focus:outline-none focus:ring-0 focus:border-red-600/90 hover:border-red-600/90 transition-colors"
                placeholder="Company"
              />
            </div>
            <div className="md:col-span-8">
              <input
                id="title"
                name="title"
                type="text"
                className="w-full bg-transparent border-0 border-b border-gray-500 text-gray-200 placeholder-gray-500 px-0 py-3 focus:outline-none focus:ring-0 focus:border-red-600/90 hover:border-red-600/90 transition-colors"
                placeholder="Job Title"
              />
            </div>
            <div className="md:col-span-4">
              <input
                id="country"
                name="country"
                type="text"
                className="w-full bg-transparent border-0 border-b border-gray-500 text-gray-200 placeholder-gray-500 px-0 py-3 focus:outline-none focus:ring-0 focus:border-red-600/90 hover:border-red-600/90 transition-colors"
                placeholder="Country"
              />
            </div>
            <div className="md:col-span-12 mt-4">
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full bg-transparent border border-gray-500 text-gray-200 placeholder-gray-500 px-3 py-3 focus:outline-none focus:ring-0 focus:border-red-600/90 hover:border-red-600/90 transition-colors"
                placeholder="What parts of your business would you like to automate?"
              />
            </div>
            <div className="md:col-span-12 flex justify-start">
              {/* Cloudflare Turnstile Invisible Widget */}
              <div
                className="cf-turnstile"
                data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                data-size="invisible"
                data-theme="dark"
              />
              <button
                type="submit"
                className="px-6 py-3 font-semibold border border-gray-500 text-gray-500 hover:border-red-600/90 hover:text-red-600/90 focus:border-red-600/90 focus:text-red-600/90 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
