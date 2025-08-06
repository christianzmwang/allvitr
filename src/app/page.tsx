import Link from 'next/link'
import NavBar from './components/NavBar'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-black p-8 py-16">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">Allvitr</h1>
          <p className="text-lg text-gray-400 mb-8">
            Your dedicated platform for market research and insights. Start your
            journey by exploring Hugin and making your first search!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/hugin"
              className="px-6 py-3 bg-gray-400 text-black font-semibold border-3 border-transparent hover:border-white transition duration-300"
            >
              Learn More About Hugin
            </Link>
          </div>
        </div>
      </section>

      {/* Section 1 */}
      <section className="min-h-screen flex items-center justify-center py-16 px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            What are Buying Signals?
          </h2>
          <div className="text-center text-gray-300">
            <p className="text-lg">
              Buying signals are triggers or events that indicate a potential
              customer is ready to make a purchase. These signals can be
              anything from a company announcing a new project, to a key
              executive changing roles. By identifying these signals, you can
              engage with prospects at the perfect time, when they are most
              likely to be receptive to your solution.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="h-[60vh] flex items-center justify-center py-16 px-8 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            How Allvitr Helps You Find Them
          </h2>
          <div className="text-center text-gray-300">
            <p className="text-lg">
              Allvitr provides a powerful search interface that allows you to
              scan a vast array of sources for buying signals. Our platform is
              designed to help you filter out the noise and focus on the
              information that matters. With Allvitr, you can track companies,
              industries, and trends, and get notified when a relevant signal is
              detected.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="min-h-screen flex items-center justify-center py-16 px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Example Signals
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                New Product Launch
              </h3>
              <p className="text-gray-400">
                A company launching a new product is a strong signal that they
                are investing in growth and may need new tools and services to
                support their launch.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                Executive Hire
              </h3>
              <p className="text-gray-400">
                A new executive, especially in a key role like marketing or
                sales, will often look to make their mark by bringing in new
                tools and strategies.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                Geographic Expansion
              </h3>
              <p className="text-gray-400">
                When a company expands into a new market, they will need to
                understand the local landscape, and may be looking for partners
                and services to help them.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                Mention of &quot;Integration&quot; in Earnings Calls
              </h3>
              <p className="text-gray-400">
                This indicates a focus on connecting different systems and can
                be a sign that a company is looking for new software solutions.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                Increased Hiring in a Department
              </h3>
              <p className="text-gray-400">
                A surge in hiring in a specific department can indicate a new
                focus or project that may require new tools and resources.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                Regulatory Changes
              </h3>
              <p className="text-gray-400">
                New regulations can force companies to adopt new technologies
                and processes to ensure compliance, creating opportunities for
                vendors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-8 mt-auto">
        <div className="w-[95%] md:max-w-[80%] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-2">Allvitr</h3>
              <p className="text-gray-300 mb-4">
                Your dedicated platform for market research and insights.
              </p>
              <p className="text-gray-400 text-sm">
                &copy; 2025 Allvitr. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
