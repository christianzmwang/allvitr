import NavBar from '../components/NavBar'
import { sendContactToSlack } from '../actions/sendContactToSlack'

export const metadata = {
  title: 'Contact | Allvitr',
  description: 'Get in touch with Allvitr',
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = await searchParams
  const isSent = (resolvedSearchParams?.sent || '') === '1'

  return (
    <div className="bg-gray-300">
      <NavBar />
      <section
        id="contact"
        data-nav-theme="light"
        className="pt-28 md:pt-36 pb-16 md:pb-24 pad-section bg-gray-300 scroll-mt-24 md:scroll-mt-32 min-h-screen"
      >
        <div className="container-95">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Get in touch</h2>
            <p className="text-gray-700 mb-6 text-base md:text-lg">
              Have a question or want a demo? We’d love to hear from you.
            </p>
          </div>
          {isSent && (
            <div className="mt-4 mb-2 rounded-md border border-green-600/30 bg-green-100/50 text-green-900 p-3 max-w-xl">
              Thanks! Your message was sent. We’ll be in touch shortly.
            </div>
          )}
          <form
            action={sendContactToSlack}
            className="mt-6 md:mt-8 grid grid-cols-1 gap-6 md:gap-8"
          >
            <input type="hidden" name="origin" value="/contact" />
            <div>
              <label htmlFor="name" className="label">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-underline"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-underline"
                placeholder="jane@company.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="label">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input-underline"
                placeholder="+1 555 123 4567"
              />
            </div>
            <div>
              <label htmlFor="company" className="label">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                className="input-underline"
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <label htmlFor="title" className="label">
                Job Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="input-underline"
                placeholder="Head of Sales"
              />
            </div>
            <div>
              <label htmlFor="country" className="label">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                className="input-underline"
                placeholder="United States"
              />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="message" className="label mb-4">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="textarea-base"
                placeholder="What would you like to explore?"
              />
            </div>
            <div className="md:col-span-3 flex justify-start">
              <button type="submit" className="btn btn-primary hover:border-gray-600">
                Send
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}


