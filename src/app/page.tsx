import Link from 'next/link'
import NavBar from './components/NavBar'
import DotsLayer from './components/DotsLayer'

type Platform = {
  key: string
  title: string
  subtitle: string
  href: string
  gradient: string
  backGradient?: string
  description: string
}

const PLATFORMS: Platform[] = [
  {
    key: 'hugin',
    title: 'Hugin',
    subtitle: 'Real time market research',
    href: '/platforms#hugin',
    gradient: 'from-red-500/80 to-red-700/80',
    description:
      'Real time market research. Indexes internet data to provide real time insights about your market.',
  },
  {
    key: 'munin',
    title: 'Munin',
    subtitle: 'Secure data and analytics',
    href: '/platforms#munin',
    gradient: 'from-sky-300/80 to-sky-500/80',
    description:
      'Secure data storage and powerful analytics to drive smarter business decisions.',
  },
  {
    key: 'odin',
    title: 'Odin',
    subtitle: 'Executive metrics dashboard',
    href: '/platforms#odin',
    gradient: 'from-gray-800/80 to-gray-950/80',
    backGradient: 'from-gray-500/70 to-gray-600/70',
    description:
      'An executive dashboard offering a unified view of your company’s key metrics in real time.',
  },
]

function PlatformStack({
  title,
  subtitle,
  href = '#',
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
      href={href}
      aria-label={`${title} platform`}
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

export default function Home() {
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
        className="relative flex items-center justify-center min-h-[70vh] md:min-h-[85vh] p-4 md:p-8 overflow-hidden"
      >
        <div className="relative z-10 max-w-2xl w-full text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Allvitr
          </h1>
          <p className="text-base md:text-lg text-gray-400 mb-8">
            We turn information overload into clarity, building software that
            amplifies human insight and enables autonomous decision-making.
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
                {PLATFORMS.map(({ key, title, description }) => (
                  <div key={key}>
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <p className="text-gray-300">{description}</p>
                  </div>
                ))}
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
                {PLATFORMS.map(({ key, title, subtitle, href, gradient, backGradient }) => (
                  <PlatformStack
                    key={key}
                    title={title}
                    subtitle={subtitle}
                    href={href}
                    gradient={gradient}
                    backGradient={backGradient}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer to ensure navbar is dark in the space between section 1 and 2 */}
      <div data-nav-theme="dark" aria-hidden className="w-full h-20 md:h-28" />

      {/* Section 2: Mission */}
      <section
        data-nav-theme="light"
        className="min-h-[60vh] flex items-center justify-center py-10 md:py-15 bg-gray-300"
      >
        <div className="container-95">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="text-center pl-4 md:pl-18">
              <h2 className="text-5xl md:text-8xl text-left font-extrabold text-transparent mb-6 flex flex-col gap-2 md:gap-15 heading-outline-dark">
                <span>Age</span>
                <span>Of</span>
                <span>Autonomy</span>
              </h2>
            </div>
            <div className="flex justify-center">
              <div className="text-left text-gray-700 max-w-xl md:max-w-2xl w-100">
                <p className="text-lg md:text-xl font-bold">Autonomy is inevitable.</p>
                <p className="text-lg md:text-xl mt-8 md:mt-12 mb-8 md:mb-12 font-bold">Deploy now, advance tomorrow.</p>
                <p className="text-lg md:text-xl">
                We deploy autonomous platforms<br />that deliver AI-powered insights: enabling rapid, clear, and autonomous decision-making.
                </p>
              </div>
            </div>
          </div>
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
          className="relative h-[52vh] md:h-[68vh] container-95 overflow-hidden border border-gray-950"
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
                  <h2 className="text-4xl md:text-6xl font-extrabold text-transparent leading-tight text-center gap-4 md:gap-6 heading-outline-light">
                    AI Integration
                  </h2>
                </div>
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="text-left text-white font-semibold leading-snug text-lg md:text-4xl space-y-1">
                    <div>Clarity</div>
                    <div>Speed</div>
                    <div>Execution</div>
                    <div className="text-red-600/80">Evolution</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: CTA */}
      <section data-nav-theme="light" className="py-4 md:py-6 bg-gray-300">
        <div className="w-full flex justify-center">
          <div className="inline-block text-center py-8 md:py-12">
            <h2 className="text-3xl md:text-9xl font-extrabold text-transparent heading-outline-dark mb-10 md:mb-12">
              Let&apos;s Get To Work
            </h2>
            <div className="mt-6 flex justify-end">
              <div className="flex flex-col items-end gap-4 w-56 md:w-64">
                <Link href="/contact" className="btn btn-primary w-full">
                  Demo Request
                </Link>
                <Link href="/platforms" className="btn btn-outline w-full">
                  Explore Platforms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}