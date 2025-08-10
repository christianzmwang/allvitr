import Link from 'next/link'
import NavBar from './components/NavBar'
import DotsLayer from './components/DotsLayer'

function PlatformStack({
  title,
  subtitle,
  href,
  gradient,
  backGradient,
}: {
  title: string
  subtitle: string
  href?: string
  gradient: string
  backGradient?: string
}) {
  return (
    <Link
      href={href || '#'}
      className="group relative block w-44 md:w-52 h-56 md:h-64 focus:outline-none"
    >
      {/* Glow */}
      <div
        className={`pointer-events-none absolute -inset-2 blur-3xl opacity-50 transition duration-500 ease-out group-hover:opacity-95 group-hover:scale-105 ${gradient}`}
      />

      {/* Bottom layer */}
      <div className={`absolute inset-0 translate-y-4 rotate-3 scale-[0.96] bg-gradient-to-br ${backGradient || gradient} opacity-20 ring-1 ring-white/5 transition-all duration-500 ease-out group-hover:translate-y-8 group-hover:rotate-12 group-hover:scale-100`} />

      {/* Middle layer */}
      <div className={`absolute inset-0 translate-y-2 -rotate-2 scale-[0.98] bg-gradient-to-br ${backGradient || gradient} opacity-30 ring-1 ring-white/10 transition-all duration-500 ease-out group-hover:translate-y-4 group-hover:-rotate-6 group-hover:scale-[1.02]`} />

      {/* Top content card */}
      <div
        className={`relative z-10 h-full p-5 ring-1 ring-white/10 bg-gradient-to-br ${gradient} transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02] shadow-xl shadow-black/30`}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="text-sm text-white/70">Platform</div>
            <h3 className="mt-1 text-xl font-semibold text-white">{title}</h3>
          </div>
          <p className="text-sm text-white/85">{subtitle}</p>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative pt-24">
      <DotsLayer targetId="section-2" showWhenInView={false} mode="uniform" divisions={20} variant="fixed" />
      <NavBar />
      {/* Hero Section */}
      <section data-nav-theme="dark" className="relative flex items-center justify-center min-h-[80vh] md:min-h-[85vh] p-6 md:p-8 overflow-hidden">
        <div className="relative z-10 max-w-2xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Allvitr</h1>
          <p className="text-md md:text-lg text-gray-400 mb-8">
            We turn information overload into clarity,
            building software that amplify human insight and enable autonomous decision-making.
          </p>
          
        </div>
      </section>

      {/* Section 1 */}
      <section data-nav-theme="dark" className="min-h-screen px-4 md:px-8 bg-gradient-to-b from-transparent via-black/100 via-20% to-black md:-mt-[20vh] -mt-0">
        {/* Center within non-gradient area (below top 20% gradient) */}
        <div className="mt-[20vh] min-h-[80vh] flex items-center justify-center py-24 md:py-64">
          <div className="w-[95%] md:max-w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left: Textual content */}
            <div className="text-left">
              <h2 className="text-3xl font-bold text-white mb-4">Our Platforms</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-xl">
                Tools that turn information overload into clarity for every team.
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">Hugin</h3>
                  <p className="text-gray-300">
                    Market research made simple. Indexes internet data to give B2B teams timely, relevant insights about prospects.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Munin</h3>
                  <p className="text-gray-300">
                    Secure company data storage and powerful analytics to drive smarter business decisions.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Odin</h3>
                  <p className="text-gray-300">
                    An executive dashboard offering a unified view of your company’s key metrics in real time.
                  </p>
                </div>
              </div>
              <div className="mt-10 md:mt-12">
                <Link href="/platforms" className="px-6 py-3 bg-gray-400 text-black font-semibold border-3 border-transparent hover:border-white transition duration-300">
                  Explore Platforms
                </Link>
              </div>
            </div>

            {/* Right: Three interactive stacks */}
            <div className="relative flex justify-center md:justify-end">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10">
                <PlatformStack
                  title="Hugin"
                  subtitle="Market research made simple."
                  href="/hugin"
                  gradient="from-red-500/80 to-red-700/80"
                />
                <PlatformStack
                  title="Munin"
                  subtitle="Secure data and analytics."
                  href="#"
                  gradient="from-sky-300/80 to-sky-500/80"
                />
                <PlatformStack
                  title="Odin"
                  subtitle="Executive metrics dashboard."
                  href="#"
                  gradient="from-gray-700/80 to-gray-950/80"
                  backGradient="from-gray-400/60 to-gray-600/60"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Why Signals Matter */}
      <section data-nav-theme="light" className="min-h-screen flex items-center justify-center py-12 md:py-16 px-4 md:px-8 bg-gray-300">
        <div className="w-[95%] md:max-w-[80%] mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Signals Matter
          </h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-12">
            Timing is everything. Acting on the right signal lets you start conversations when teams have the
            budget, urgency, and momentum. Allvitr helps you identify those moments—consistently.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Prioritize Outreach</h3>
              <p className="text-gray-700">
                Focus your team on accounts that are actively evaluating solutions, not just a static ICP list.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Shorten Cycles</h3>
              <p className="text-gray-700">
                Start with context. Use signals to tailor messaging and speed up qualification.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Increase Win Rate</h3>
              <p className="text-gray-700">
                Engage when the need is fresh and budgets are available—improving conversion at every stage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: How Allvitr Helps You Find Them */}
      <section data-nav-theme="light" id="section-2" className="py-4 px-4 bg-gray-300">
        <div data-nav-theme="dark-contrast" className="relative h-[60vh] md:h-[68vh] w-[100%] mx-auto rounded-3xl overflow-hidden border border-gray-950">
          <DotsLayer targetId="section-2" showWhenInView mode="mouse" divisions={20} variant="section" />
          <div className="relative z-10 h-full w-full flex items-center justify-center">
            <div className="max-w-2xl w-full text-center px-6">
          <div className="flex justify-center mb-6">
            <img src="/window.svg" alt="Window" className="w-40 h-40 md:w-64 md:h-64" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Allvitr Helps You Find Them</h2>
          <p className="text-lg text-gray-700">
                Allvitr provides a powerful search interface that allows you to scan a vast array of sources for
                buying signals. Our platform is designed to help you filter out the noise and focus on the information
                that matters. With Allvitr, you can track companies, industries, and trends, and get notified when a
                relevant signal is detected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section data-nav-theme="light" className="min-h-screen flex items-center justify-center py-12 md:py-16 px-4 md:px-8 bg-gray-300">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Example Signals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg text-center border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                New Product Launch
              </h3>
              <p className="text-gray-700">
                A company launching a new product is a strong signal that they
                are investing in growth and may need new tools and services to
                support their launch.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg text-center border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Executive Hire
              </h3>
              <p className="text-gray-700">
                A new executive, especially in a key role like marketing or
                sales, will often look to make their mark by bringing in new
                tools and strategies.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg text-center border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Geographic Expansion
              </h3>
              <p className="text-gray-700">
                When a company expands into a new market, they will need to
                understand the local landscape, and may be looking for partners
                and services to help them.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg text-center border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Mention of &quot;Integration&quot; in Earnings Calls
              </h3>
              <p className="text-gray-700">
                This indicates a focus on connecting different systems and can
                be a sign that a company is looking for new software solutions.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg text-center border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Increased Hiring in a Department
              </h3>
              <p className="text-gray-700">
                A surge in hiring in a specific department can indicate a new
                focus or project that may require new tools and resources.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg text-center border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Regulatory Changes
              </h3>
              <p className="text-gray-700">
                New regulations can force companies to adopt new technologies
                and processes to ensure compliance, creating opportunities for
                vendors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4 md:px-8 mt-auto">
        <div className="w-[95%] md:max-w-[80%] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-2">Allvitr</h3>
              <p className="text-gray-300 mb-4">
                Amplifying Human Insight
              </p>
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Allvitr. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/allvitr/"
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
                href="https://x.com/allvitr"
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
