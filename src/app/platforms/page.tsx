import NavBar from '../components/NavBar'
import Image from 'next/image'

export default function PlatformsPage() {
  return (
    <div className="page">
      <NavBar />

      {/* Hero */}
      <section
        data-nav-theme="dark"
        className="min-h-screen flex items-center justify-center bg-black">
        <div className=" container-95 h-full flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center w-full">
            <div className="text-center pl-4 md:pl-18">
              <h1 className="text-5xl md:text-8xl text-left font-extrabold text-transparent mb-6 flex flex-col gap-2 md:gap-15 heading-outline-light">
                <span>Allvitr</span>
                <span>Platforms</span>
              </h1>
            </div>
            <div className="flex justify-center">
              <div className="text-left text-white max-w-xl md:max-w-2xl w-100">
                <p className="text-lg md:text-xl font-bold">
                  A suite of tools to discover signals, unify knowledge, and
                  drive decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hugin - Overview Section */}
      <section
        id="hugin"
        data-nav-theme="dark"
        className="scroll-mt-32 min-h-screen pad-section bg-gradient-to-b from-transparent via-black/100 via-20% to-black md:-mt-[10vh] -mt-0 overflow-hidden"
      >
        <div className="mt-[10vh] min-h-[80vh] flex items-center py-20 md:py-36">
          <div className="container-95">
            {/* Main headline and description */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Hugin
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Real-time market research. Index the public web and third-party
                data to surface timely signals on prospects and markets.
              </p>
            </div>

            {/* Why Signals Matter - Large feature box */}
            <div className="bg-gradient-to-r from-sky-500/10 to-purple-500/10 border border-sky-400/30 p-8 md:p-12 mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Why Signals Matter
                  </h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Timing is everything. Act when budgets, urgency, and
                    momentum align. Hugin finds those moments—consistently.
                  </p>
                  <div className="mt-6 flex items-center space-x-2">
                    <div className="w-3 h-3 bg-sky-400 animate-pulse"></div>
                    <span className="text-sky-400 font-medium">
                      Real-time monitoring
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square w-full bg-gradient-to-br from-sky-500/20 to-purple-500/20 border border-sky-400/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">⚡</div>
                      <div className="text-sky-400 font-semibold">
                        Live Signals
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-white/5 p-8 border border-white/10 hover:border-sky-400/30 transition-colors">
                <div className="text-3xl mb-4">🎯</div>
                <h4 className="text-xl font-semibold text-white mb-3">
                  Prioritize Outreach
                </h4>
                <p className="text-gray-300">
                  Focus on accounts actively evaluating solutions, not just a
                  static ICP list.
                </p>
              </div>
              <div className="bg-white/5 p-8 border border-white/10 hover:border-sky-400/30 transition-colors">
                <div className="text-3xl mb-4">⏱️</div>
                <h4 className="text-xl font-semibold text-white mb-3">
                  Shorten Cycles
                </h4>
                <p className="text-gray-300">
                  Start with context. Tailor messaging and speed up
                  qualification.
                </p>
              </div>
              <div className="bg-white/5 p-8 border border-white/10 hover:border-sky-400/30 transition-colors">
                <div className="text-3xl mb-4">🏆</div>
                <h4 className="text-xl font-semibold text-white mb-3">
                  Increase Win Rate
                </h4>
                <p className="text-gray-300">
                  Engage when the need is fresh and budgets are available.
                </p>
              </div>
            </div>

            {/* Signal Types Section */}
            <div className="mb-16">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                Signal Types
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 border border-green-400/30">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    New Product Launch
                  </h4>
                  <p className="text-gray-300">
                    Signals investment in growth and supporting tools.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-6 border border-blue-400/30">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Executive Hire
                  </h4>
                  <p className="text-gray-300">
                    New leaders bring new strategies and stacks.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 border border-purple-400/30">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Geographic Expansion
                  </h4>
                  <p className="text-gray-300">
                    New markets require partners and local insights.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 border border-orange-400/30">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Integration Mentions
                  </h4>
                  <p className="text-gray-300">
                    Connecting systems often precedes software adoption.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 p-6 border border-teal-400/30">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Increased Hiring
                  </h4>
                  <p className="text-gray-300">
                    Headcount surges hint at new initiatives needing tooling.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 p-6 border border-yellow-400/30">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Regulatory Changes
                  </h4>
                  <p className="text-gray-300">
                    Compliance shifts drive tech adoption and process change.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-white/10 p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                How Hugin Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-sky-500/20 border border-sky-400/30 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Monitor
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Track web sources and data feeds
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 border border-purple-400/30 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Detect
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Identify relevant signals in real-time
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 border border-green-400/30 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Analyze
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Score and prioritize opportunities
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/20 border border-orange-400/30 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Act</h4>
                  <p className="text-gray-300 text-sm">
                    Engage with perfect timing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div
        data-nav-theme="dark"
        aria-hidden
        className="mx-auto w-[100%] md:max-w-[100%] h-16 md:h-24"
      />

      {/* Munin (dark, homepage style) */}
      <section
        id="munin"
        data-nav-theme="dark"
        className="scroll-mt-32 min-h-screen pad-section bg-gradient-to-b from-transparent via-black/100 via-20% to-black overflow-hidden"
      >
        <div className="mt-[10vh] min-h-[80vh] flex items-center py-20 md:py-36">
          <div className="container-95">
            {/* Header + Image two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
              {/* Right: Headline and description */}
              <div className="md:col-span-3 order-2 md:order-2">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Munin
                </h2>
                <p className="text-lg text-gray-300 mb-8 max-w-prose">
                  Secure company knowledge base and analytics. Unify documents,
                  notes, tickets, and data with governance and search that
                  scales.
                </p>
                <div className="hidden md:block text-gray-400 text-sm">
                  Centralize institutional knowledge while maintaining strict
                  access controls and auditability.
                </div>
              </div>

              {/* Left: Product image */}
              <div className="md:col-span-2 order-1 md:order-1">
                <div className="relative group max-w-[420px] mx-auto md:mx-0">
                  <div
                    className="absolute -inset-2 bg-gradient-to-b from-white/10 to-transparent blur-2xl opacity-60 group-hover:opacity-80 transition"
                    aria-hidden
                  />
                  <div className="relative aspect-[1/1] w-full overflow-hidden border-4 md:border-8 border-dashed border-sky-400">
                    <Image
                      src="/glassSquare.png"
                      alt="Munin visualization"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 900px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature cards */}
            <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Unified Knowledge
                </h4>
                <p className="text-gray-300">
                  Connect sources into a single, searchable system.
                </p>
              </div>
              <div className="bg-white/5 p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Access Controls
                </h4>
                <p className="text-gray-300">
                  Fine-grained permissions, governance, and audit history.
                </p>
              </div>
              <div className="bg-white/5 p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Analytics & AI
                </h4>
                <p className="text-gray-300">
                  Usage analytics and retrieval-augmented generation.
                </p>
              </div>
              <div className="bg-white/5 p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Customer Support
                </h4>
                <p className="text-gray-300">
                  Deflect tickets with accurate, approved answers.
                </p>
              </div>
              <div className="bg-white/5 p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Engineering Enablement
                </h4>
                <p className="text-gray-300">
                  Reduce onboarding time with a shared context hub.
                </p>
              </div>
              <div className="bg-white/5 p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Sales Playbooks
                </h4>
                <p className="text-gray-300">
                  Keep discovery and competitive intel current.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div
        data-nav-theme="dark"
        aria-hidden
        className="glass-spacer mx-auto w-[100%] md:max-w-[100%] h-16 md:h-24"
      />

      {/* Odin (dark, homepage style) */}
      <section
        id="odin"
        data-nav-theme="dark"
        className="scroll-mt-32 min-h-screen pad-section bg-gradient-to-b from-transparent via-black/100 via-20% to-black overflow-hidden"
      >
        <div className="mt-[10vh] min-h-[80vh] flex items-center py-20 md:py-36">
          <div className="container-95 grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
            <div className="md:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Odin
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-prose">
                Executive dashboard for real-time KPIs. A single pane of glass
                across revenue, product, and operations—always up to date.
              </p>
            </div>
            <div className="md:col-span-3 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Real-time Pipelines
                  </h4>
                  <p className="text-gray-300">
                    Stream from your warehouse, product events, and CRM.
                  </p>
                </div>
                <div className="bg-white/5 p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Executive Views
                  </h4>
                  <p className="text-gray-300">
                    Curated dashboards for leadership teams.
                  </p>
                </div>
                <div className="bg-white/5 p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Alerts & Anomalies
                  </h4>
                  <p className="text-gray-300">
                    Proactive notifications when goals drift or trends shift.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Revenue
                  </h4>
                  <p className="text-gray-300">
                    Pipeline health, conversion, and forecast accuracy.
                  </p>
                </div>
                <div className="bg-white/5 p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Product
                  </h4>
                  <p className="text-gray-300">
                    Activation, engagement, retention, adoption.
                  </p>
                </div>
                <div className="bg-white/5 p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Operations
                  </h4>
                  <p className="text-gray-300">
                    SLAs, incident trends, and efficiency improvements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
