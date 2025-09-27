import NavBar from '../components/NavBar'
import Link from 'next/link'

export default function PlatformsPage() {
  return (
    <div className="page">
      <NavBar />

      {/* Hero */}
      <section
        data-nav-theme="dark"
        className="relative flex items-center justify-center min-h-[25vh] md:min-h-[30vh] p-6 md:p-8 overflow-hidden"
      >
        <div className="relative z-10 max-w-2xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Allvitr Platforms
          </h1>
          <p className="text-md md:text-lg text-gray-400">
            A suite of tools to discover signals, unify knowledge, and drive
            decisions.
          </p>
        </div>
      </section>

      {/* Hugin (dark, homepage style) */}
      <section
        id="hugin"
        data-nav-theme="dark"
        className="scroll-mt-32 min-h-screen pad-section bg-gradient-to-b from-transparent via-black/100 via-20% to-black md:-mt-[10vh] -mt-0 overflow-hidden"
      >
        <div className="mt-[10vh] min-h-[80vh] flex items-center py-20 md:py-36">
          <div className="container-95 grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
            {/* Left: headline + description */}
            <div className="md:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Hugin</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-prose">
                Real-time market research. Index the public web and third-party
                data to surface timely signals on prospects and markets.
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">Why Signals Matter</h3>
                  <p className="text-gray-300 mt-2">
                    Timing is everything. Act when budgets, urgency, and momentum
                    align. Hugin finds those moments—consistently.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Example Signals</h3>
                  <p className="text-gray-300 mt-2">
                    Concrete triggers that indicate readiness to buy and engage.
                  </p>
                </div>
              </div>
              
            </div>

            {/* Right: cards */}
            <div className="md:col-span-3 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Prioritize Outreach</h4>
                  <p className="text-gray-300">Focus on accounts actively evaluating solutions, not just a static ICP list.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Shorten Cycles</h4>
                  <p className="text-gray-300">Start with context. Tailor messaging and speed up qualification.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Increase Win Rate</h4>
                  <p className="text-gray-300">Engage when the need is fresh and budgets are available.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">New Product Launch</h4>
                  <p className="text-gray-300">Signals investment in growth and supporting tools.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Executive Hire</h4>
                  <p className="text-gray-300">New leaders bring new strategies and stacks.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Geographic Expansion</h4>
                  <p className="text-gray-300">New markets require partners and local insights.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Mention of “Integration”</h4>
                  <p className="text-gray-300">Connecting systems often precedes software adoption.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Increased Hiring</h4>
                  <p className="text-gray-300">Headcount surges hint at new initiatives needing tooling.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Regulatory Changes</h4>
                  <p className="text-gray-300">Compliance shifts drive tech adoption and process change.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div data-nav-theme="dark" aria-hidden className="mx-auto w-[100%] md:max-w-[100%] h-16 md:h-24" />

      {/* Munin (dark, homepage style) */}
      <section
        id="munin"
        data-nav-theme="dark"
        className="scroll-mt-32 min-h-screen pad-section bg-gradient-to-b from-transparent via-black/100 via-20% to-black overflow-hidden"
      >
        <div className="mt-[10vh] min-h-[80vh] flex items-center py-20 md:py-36">
          <div className="container-95 grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
            <div className="md:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Munin</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-prose">
                Secure company knowledge base and analytics. Unify documents,
                notes, tickets, and data with governance and search that scales.
              </p>
            </div>
            <div className="md:col-span-3 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Unified Knowledge</h4>
                  <p className="text-gray-300">Connect sources into a single, searchable system.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Access Controls</h4>
                  <p className="text-gray-300">Fine-grained permissions, governance, and audit history.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Analytics & AI</h4>
                  <p className="text-gray-300">Usage analytics and retrieval-augmented generation.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Customer Support</h4>
                  <p className="text-gray-300">Deflect tickets with accurate, approved answers.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Engineering Enablement</h4>
                  <p className="text-gray-300">Reduce onboarding time with a shared context hub.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Sales Playbooks</h4>
                  <p className="text-gray-300">Keep discovery and competitive intel current.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div data-nav-theme="dark" aria-hidden className="glass-spacer mx-auto w-[100%] md:max-w-[100%] h-16 md:h-24" />

      {/* Odin (dark, homepage style) */}
      <section
        id="odin"
        data-nav-theme="dark"
        className="scroll-mt-32 min-h-screen pad-section bg-gradient-to-b from-transparent via-black/100 via-20% to-black overflow-hidden"
      >
        <div className="mt-[10vh] min-h-[80vh] flex items-center py-20 md:py-36">
          <div className="container-95 grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
            <div className="md:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Odin</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-prose">
                Executive dashboard for real-time KPIs. A single pane of glass
                across revenue, product, and operations—always up to date.
              </p>
            </div>
            <div className="md:col-span-3 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Real-time Pipelines</h4>
                  <p className="text-gray-300">Stream from your warehouse, product events, and CRM.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Executive Views</h4>
                  <p className="text-gray-300">Curated dashboards for leadership teams.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Alerts & Anomalies</h4>
                  <p className="text-gray-300">Proactive notifications when goals drift or trends shift.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Revenue</h4>
                  <p className="text-gray-300">Pipeline health, conversion, and forecast accuracy.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Product</h4>
                  <p className="text-gray-300">Activation, engagement, retention, adoption.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Operations</h4>
                  <p className="text-gray-300">SLAs, incident trends, and efficiency improvements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
