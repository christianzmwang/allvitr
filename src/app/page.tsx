import Link from 'next/link'
import NavBar from './components/NavBar'
import DotsLayer from './components/DotsLayer'
import ContactForm from './components/ContactForm'

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
      <div
        className={`absolute inset-0 translate-y-4 rotate-3 scale-[0.96] bg-gradient-to-br ${backGradient || gradient} opacity-20 ring-1 ring-white/5 transition-all duration-500 ease-out group-hover:translate-y-8 group-hover:rotate-12 group-hover:scale-100`}
      />

      {/* Middle layer */}
      <div
        className={`absolute inset-0 translate-y-2 -rotate-2 scale-[0.98] bg-gradient-to-br ${backGradient || gradient} opacity-30 ring-1 ring-white/10 transition-all duration-500 ease-out group-hover:translate-y-4 group-hover:-rotate-6 group-hover:scale-[1.02]`}
      />

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

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = await searchParams
  const isSent = (resolvedSearchParams?.sent || '') === '1'
  return (
    <div className="page">
      <DotsLayer
        targetId="section-2"
        showWhenInView={false}
        mode="uniform"
        divisions={20}
        variant="fixed"
        alwaysVisible
      />
      <NavBar />
      {/* Hero Section */}
      <section
        data-nav-theme="dark"
        className="relative flex items-center justify-center min-h-[80vh] md:min-h-[85vh] p-6 md:p-8 overflow-hidden"
      >
        <div className="relative z-10 max-w-2xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Allvitr
          </h1>
          <p className="text-md md:text-lg text-gray-400 mb-8">
            We turn information overload into clarity, building software that
            amplify human insight and enable autonomous decision-making.
          </p>
        </div>
      </section>

      {/* Section 1 */}
      <section
        data-nav-theme="dark"
        className="min-h-screen pad-section bg-gradient-to-b from-transparent via-black/100 via-20% to-black md:-mt-[20vh] -mt-0 overflow-hidden"
      >
        {/* Center within non-gradient area (below top 20% gradient) */}
        <div className="mt-[20vh] min-h-[80vh] flex items-center justify-center py-24 md:py-64">
          <div className="container-95 grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
            {/* Left: Textual content */}
            <div className="text-left md:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-3">
                Our Platforms
              </h2>
              <p className="text-lg text-gray-300 mb-6 max-w-lg">
                Software that turns data into insights.
              </p>
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-semibold text-white">Hugin</h3>
                  <p className="text-gray-300">
                    Real time market research. Indexes internet data to provide
                    real time insights about your market.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Munin</h3>
                  <p className="text-gray-300">
                    Secure data storage and powerful analytics to drive
                    smarter business decisions.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Odin</h3>
                  <p className="text-gray-300">
                    An executive dashboard offering a unified view of your
                    company’s key metrics in real time.
                  </p>
                </div>
              </div>
              <div className="mt-16 md:mt-15">
                <Link href="/platforms" className="btn btn-primary">
                  Explore Platforms
                </Link>
              </div>
            </div>

            {/* Right: Three interactive stacks */}
            <div className="relative md:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 justify-items-center md:justify-items-end">
                <PlatformStack
                  title="Hugin"
                  subtitle="Real time market research"
                  href="/platforms#hugin"
                  gradient="from-red-500/80 to-red-700/80"
                />
                <PlatformStack
                  title="Munin"
                  subtitle="Secure data and analytics"
                  href="/platforms#munin"
                  gradient="from-sky-300/80 to-sky-500/80"
                />
                <PlatformStack
                  title="Odin"
                  subtitle="Executive metrics dashboard"
                  href="/platforms#odin"
                  gradient="from-gray-800/80 to-gray-950/80"
                  backGradient="from-gray-500/70 to-gray-600/70"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer to ensure navbar is dark in the space between section 1 and 2 */}
      <div
        data-nav-theme="dark"
        aria-hidden
        className="glass-spacer mx-auto w-[100%] md:max-w-[100%] h-20 md:h-28"
      />

      {/* Section 2: Mission */}
      <section
        data-nav-theme="light"
        className="min-h-[60vh] flex items-center justify-center py-12 md:py-20 pad-section bg-gray-300"
      >
        <div className="container-80 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We turn information overload into clarity. Our mission is to amplify
            human insight and enable autonomous decision-making by building
            software that transforms raw signals into actionable knowledge.
          </p>
        </div>
      </section>

      {/* Section 3*/}
      <section
        data-nav-theme="light"
        id="section-2"
        className="py-4 px-0 bg-gray-300"
      >
        <div
          data-nav-theme="dark-contrast"
          className="relative h-[60vh] md:h-[68vh] container-95 overflow-hidden border border-gray-950"
        >
          <DotsLayer
            targetId="section-2"
            showWhenInView
            mode="mouse"
            divisions={20}
            variant="section"
          />
          <div className="relative z-10 h-full w-full flex items-center px-6">
            <div className="container-95 w-full">
              <div className="flex flex-col md:flex-row items-center w-full gap-6 md:gap-10">
                <div className="w-full md:w-1/2 flex justify-center">
                  <h2 className="text-4xl md:text-6xl font-extrabold text-white/80 leading-tight md:whitespace-nowrap text-center">
                    AI Integration
                  </h2>
                </div>
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="text-left text-white/80 font-semibold leading-snug text-xl md:text-4xl space-y-1">
                    <div>Clarity</div>
                    <div>Speed</div>
                    <div>Execution</div>
                    <div className="text-red-600">Dominance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactForm origin="/" isSent={isSent} />
    </div>
  )
}
