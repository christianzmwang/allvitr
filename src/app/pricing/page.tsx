import NavBar from '../components/NavBar'
import { sendContactToSlack } from '../actions/sendContactToSlack'

export default async function PricingPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = await searchParams
  const isSent = (resolvedSearchParams?.sent || '') === '1'

  return (
    <div className="min-h-screen flex flex-col relative pt-24">
      <NavBar />
      <main className="flex-1 px-6 md:px-8 py-12 md:py-16">
        <div className="w-[95%] md:max-w-[80%] mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Pricing</h1>
          <p className="text-lg text-gray-400 max-w-3xl">
            Get in touch with us to discuss your challenges <br />and get a tailored solution!
          </p>
        </div>

        {/* Contact Section */}
        <section data-nav-theme="light" className="pt-10 md:pt-14 pb-20 md:pb-24 px-4 md:px-8 bg-gray-300 mt-12">
          <div className="w-[95%] md:max-w-[95%] mx-auto">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Get in touch</h2>
              <p className="text-gray-700 mb-6">Have a question or want a demo? We’d love to hear from you.</p>
            </div>
            {isSent && (
              <div className="mt-4 mb-2 rounded-md border border-green-600/30 bg-green-100/50 text-green-900 p-3 max-w-xl">
                Thanks! Your message was sent. We’ll be in touch shortly.
              </div>
            )}
            <form action={sendContactToSlack} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <input type="hidden" name="origin" value="/pricing" />
              <div>
                <label htmlFor="name" className="block text-sm text-gray-700 mb-1">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-none bg-transparent border-0 border-b border-gray-400 text-gray-900 placeholder-gray-500 px-0 py-2 focus:outline-none focus:ring-0 focus:border-black focus:border-b-2"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-none bg-transparent border-0 border-b border-gray-400 text-gray-900 placeholder-gray-500 px-0 py-2 focus:outline-none focus:ring-0 focus:border-black focus:border-b-2"
                  placeholder="jane@company.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm text-gray-700 mb-1">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full rounded-none bg-transparent border-0 border-b border-gray-400 text-gray-900 placeholder-gray-500 px-0 py-2 focus:outline-none focus:ring-0 focus:border-black focus:border-b-2"
                  placeholder="+1 555 123 4567"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm text-gray-700 mb-1">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className="w-full rounded-none bg-transparent border-0 border-b border-gray-400 text-gray-900 placeholder-gray-500 px-0 py-2 focus:outline-none focus:ring-0 focus:border-black focus:border-b-2"
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <label htmlFor="title" className="block text-sm text-gray-700 mb-1">Job Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="w-full rounded-none bg-transparent border-0 border-b border-gray-400 text-gray-900 placeholder-gray-500 px-0 py-2 focus:outline-none focus:ring-0 focus:border-black focus:border-b-2"
                  placeholder="Head of Sales"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm text-gray-700 mb-1">Country</label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  className="w-full rounded-none bg-transparent border-0 border-b border-gray-400 text-gray-900 placeholder-gray-500 px-0 py-2 focus:outline-none focus:ring-0 focus:border-black focus:border-b-2"
                  placeholder="United States"
                />
              </div>
              <div className="md:col-span-3">
                <label htmlFor="message" className="block text-sm text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full rounded-none bg-transparent border border-gray-400 text-gray-900 placeholder-gray-500 px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                  placeholder="What would you like to explore?"
                />
              </div>
              <div className="md:col-span-3 flex justify-start">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gray-400 text-black font-semibold border-3 border-transparent hover:border-white transition duration-300"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}


