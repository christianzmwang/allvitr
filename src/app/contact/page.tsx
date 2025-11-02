import Link from 'next/link'
import Script from 'next/script'
import Footer from '../components/Footer'
import { sendContactToSlack } from '../actions/sendContactToSlack'

export const metadata = {
  title: 'Contact Us - Request a Demo',
  description:
    'Get in touch with Allvitr for a personalized demo of our AI-powered business intelligence platforms.',
}

type ContactPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams
  const isSent = (Array.isArray(params?.sent) ? params?.sent[0] : params?.sent) === '1'

  return (
    <div className="bg-white text-black flex flex-col min-h-screen">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start p-8">
          <Link href="/" className="text-2xl font-bold hover:opacity-70 transition-opacity">
            ALLVITR
          </Link>
          <Link href="/contact" className="text-xl hover:underline">
            Contact
          </Link>
        </div>

        <section className="flex flex-grow overflow-y-auto px-8 pb-12">
          <div className="flex w-full flex-col justify-center gap-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Contact</h1>
              <p className="mt-3 text-base md:text-lg text-neutral-600">
                Reach out to explore how Allvitr can automate your market research and deliver actionable intelligence.
              </p>
            </div>

            {isSent && (
              <div className="rounded-md border border-green-500/40 bg-green-100 text-green-900 px-4 py-3">
                Your message was sent. We’ll be in touch shortly.
              </div>
            )}

            <form className="grid w-full grid-cols-1 gap-6 md:grid-cols-12" action={sendContactToSlack}>
              <input type="hidden" name="origin" value="/contact" />

              <div className="md:col-span-4">
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full border border-neutral-300 bg-white px-3 py-3 text-sm md:text-base focus:border-black focus:outline-none focus:ring-0 transition"
                  placeholder="Name"
                />
              </div>

              <div className="md:col-span-8">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full border border-neutral-300 bg-white px-3 py-3 text-sm md:text-base focus:border-black focus:outline-none focus:ring-0 transition"
                  placeholder="Email"
                />
              </div>

              <div className="md:col-span-4">
                <label htmlFor="phone" className="sr-only">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full border border-neutral-300 bg-white px-3 py-3 text-sm md:text-base focus:border-black focus:outline-none focus:ring-0 transition"
                  placeholder="Phone"
                />
              </div>

              <div className="md:col-span-8">
                <label htmlFor="company" className="sr-only">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className="w-full border border-neutral-300 bg-white px-3 py-3 text-sm md:text-base focus:border-black focus:outline-none focus:ring-0 transition"
                  placeholder="Company"
                />
              </div>

              <div className="md:col-span-8">
                <label htmlFor="title" className="sr-only">
                  Job Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="w-full border border-neutral-300 bg-white px-3 py-3 text-sm md:text-base focus:border-black focus:outline-none focus:ring-0 transition"
                  placeholder="Job Title"
                />
              </div>

              <div className="md:col-span-4">
                <label htmlFor="country" className="sr-only">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  className="w-full border border-neutral-300 bg-white px-3 py-3 text-sm md:text-base focus:border-black focus:outline-none focus:ring-0 transition"
                  placeholder="Country"
                />
              </div>

              <div className="md:col-span-12">
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full border border-neutral-300 bg-white px-3 py-3 text-sm md:text-base focus:border-black focus:outline-none focus:ring-0 transition"
                  placeholder="What parts of your business would you like to automate?"
                />
              </div>

              <div className="md:col-span-12 flex flex-col gap-4">
                <div
                  className="cf-turnstile"
                  data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                  data-size="invisible"
                  data-theme="light"
                />
                <button
                  type="submit"
                  className="px-6 py-3 font-semibold border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
