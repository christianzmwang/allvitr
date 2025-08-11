import NavBar from '../components/NavBar'

export default function PlatformsPage() {
  return (
    <div className="page">
      <NavBar />

      {/* Hero */}
      <section
        data-nav-theme="dark"
        className="relative flex items-center justify-center min-h-[50vh] md:min-h-[60vh] p-6 md:p-8 overflow-hidden"
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

      {/* Sections */}
      <main className="flex-1 pad-section py-12 md:py-16">
        <div className="container-80 space-y-24">
          {/* Hugin */}
          <section id="hugin" data-nav-theme="dark" className="scroll-mt-32">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8 md:p-12 bg-gradient-to-br from-red-500/10 via-black/30 to-black/60">
              <div className="max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Hugin
                </h2>
                <p className="text-gray-300 text-lg">
                  Real-time market research. Index the public web and
                  third-party data to surface timely signals on prospects and
                  markets.
                </p>
              </div>

              {/* Moved from Home - Section 2: Why Signals Matter (dark themed) */}
              <div className="mt-12">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                  Why Signals Matter
                </h3>
                <p className="text-base md:text-lg text-gray-300 text-center max-w-3xl mx-auto mb-10">
                  Timing is everything. Acting on the right signal lets you
                  start conversations when teams have the budget, urgency, and
                  momentum. Hugin helps you identify those moments—consistently.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Prioritize Outreach
                    </h4>
                    <p className="text-gray-300">
                      Focus your team on accounts that are actively evaluating
                      solutions, not just a static ICP list.
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Shorten Cycles
                    </h4>
                    <p className="text-gray-300">
                      Start with context. Use signals to tailor messaging and
                      speed up qualification.
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Increase Win Rate
                    </h4>
                    <p className="text-gray-300">
                      Engage when the need is fresh and budgets are
                      available—improving conversion at every stage.
                    </p>
                  </div>
                </div>
              </div>

              {/* Moved from Home - Section 4: Example Signals */}
              <div className="mt-16">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                  Example Signals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-white/5 p-6 rounded-lg text-center border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-2">
                      New Product Launch
                    </h4>
                    <p className="text-gray-300">
                      A company launching a new product is a strong signal that
                      they are investing in growth and may need new tools and
                      services to support their launch.
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-lg text-center border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-2">
                      Executive Hire
                    </h4>
                    <p className="text-gray-300">
                      A new executive, especially in a key role like marketing
                      or sales, often brings in new tools and strategies.
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-lg text-center border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-2">
                      Geographic Expansion
                    </h4>
                    <p className="text-gray-300">
                      Expansion into a new market signals a need to understand
                      the local landscape and find partners.
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-lg text-center border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-2">
                      Mention of &quot;Integration&quot;
                    </h4>
                    <p className="text-gray-300">
                      References to integration in earnings calls indicate a
                      focus on connecting systems and adopting new software
                      solutions.
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-lg text-center border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-2">
                      Increased Hiring
                    </h4>
                    <p className="text-gray-300">
                      A surge in hiring within a department can signal a new
                      focus that may require new tools.
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-lg text-center border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-2">
                      Regulatory Changes
                    </h4>
                    <p className="text-gray-300">
                      New regulations can force companies to adopt technologies
                      and processes to ensure compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Munin */}
          <section id="munin" data-nav-theme="dark" className="scroll-mt-32">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8 md:p-12 bg-gradient-to-br from-sky-400/10 via-black/30 to-black/60">
              <div className="max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Munin
                </h2>
                <p className="text-gray-300 text-lg">
                  Secure company knowledge base and analytics. Bring your
                  documents, notes, and data together with governance and search
                  that scales.
                </p>
              </div>
            </div>
          </section>

          {/* Odin */}
          <section id="odin" data-nav-theme="dark" className="scroll-mt-32">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8 md:p-12 bg-gradient-to-br from-gray-400/10 via-black/30 to-black/60">
              <div className="max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Odin
                </h2>
                <p className="text-gray-300 text-lg">
                  Executive dashboard for real-time KPIs. A single pane of glass
                  across revenue, product, and operations—updated continuously.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
