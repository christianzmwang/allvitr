import NavBar from '../components/NavBar'
import Image from 'next/image'
import wave from '../../../public/wave.png'

export default function PlatformsPage() {
  return (
    <div className="page">
      <NavBar />

      {/* Hero */}
      <section
        data-nav-theme="dark"
        className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className=" container-95 h-full flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center w-full">
            <div className="text-center pl-4 md:pl-18">
              <h1 className="text-5xl md:text-8xl text-left font-extrabold text-transparent mb-6 flex flex-col gap-2 md:gap-15 heading-outline-light">
                <span>Platforms</span>
              </h1>
            </div>
            <div className="flex justify-center">
              <div className="text-left text-white max-w-xl md:max-w-2xl w-100">
                <p className="text-lg md:text-xl font-bold text-gray-400">
                  Automation of signal discovery, data analysis, and
                  decision-making.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="shadow-[0_0_100px_20px_rgba(255,0,0,0.5)] -mx-[50px]"></div>

      {/* Hugin - Overview Section */}
      <section
        id="hugin"
        data-nav-theme="dark"
        className="scroll-mt-32 min-h-screen bg-black overflow-hidden border-t border-red-600/90  "
      >
        <div className="min-h-[80vh] flex items-center">
          <div className="container-95">
            {/* Header + Image two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
              {/* Left: Wave image */}
              <div className="order-1 md:order-1 flex justify-start">
                <div className="relative w-full max-w-[600px]">
                  <Image
                    src={wave}
                    alt="Hugin wave visualization"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Right: Headline and description */}
              <div className="order-2 md:order-2 text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 flex items-center gap-3">
                  <span>Hugin</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-widest px-2.5 py-1 border-2 border-red-700 bg-white/5 text-gray-300 ml-5">powered by AI-Agents</span>
                </h2>
                <p className="text-lg text-gray-300 mb-8 max-w-prose">
                We cut through the noise with real-time market research, indexing the web and trusted data to surface only the signals that matter. 
                </p>
      
              </div>
            </div>



            {/* Core Benefits Grid */}
            <div className="bg-white/10 p-8 md:p-12 mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Left: Human Connection - Heading at top, text at bottom */}
                <div className="text-left flex flex-col justify-between h-full">
                  {/* Top: Human Connection Heading */}
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                      Human connection
                    </h3>
                  </div>
                  
                  {/* Bottom: Descriptive Text */}
                  <div className="mt-auto">
                    <p className="text-lg text-gray-300 max-w-prose">
                      Automate what should be automated.
                    </p>
                    <p className="text-lg text-gray-300 max-w-prose mt-4">
                      Spend time building relationships, <br/>
                      as you always should&apos;ve.
                    </p>
                  </div>
                </div>
                
                {/* Right: Stacked Benefit Cards */}
                <div className="space-y-6">
                  <div className="bg-black p-6 transform-gpu transition-all duration-500 ease-in-out hover:shadow-[0_0_10px_10px_rgba(239,68,68,0.55)]">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Prioritize Outreach
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Focus on accounts actively evaluating your solutions, not just a
                      static ICP list.
                    </p>
                  </div>
                  <div className="bg-black p-6 transform-gpu transition-all duration-500 ease-in-out hover:shadow-[0_0_10px_10px_rgba(56,189,248,0.55)]">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Shorten Cycles
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Start with context. Tailor messaging and speed up
                      qualification.
                    </p>
                  </div>
                  <div className="bg-black p-6  transform-gpu transition-all duration-500 ease-in-out hover:shadow-[0_0_10px_10px_rgba(34,197,94,0.55)]">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Increase Win Rate
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Engage when the need is fresh and budgets are available.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Signal Types Section */}
            <div className="min-h-screen flex items-center">
              <div className="w-full">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                  Signal Types
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-white/5 p-8 border border-white/10">
                    <h4 className="text-xl font-semibold text-white mb-4">
                      New Product Launch
                    </h4>
                    <p className="text-gray-300 text-base">
                      Signals investment in growth and supporting tools.
                    </p>
                  </div>
                  <div className="bg-white/5 p-8 border border-white/10">
                    <h4 className="text-xl font-semibold text-white mb-4">
                      Executive Hire
                    </h4>
                    <p className="text-gray-300 text-base">
                      New leaders bring new strategies and stacks.
                    </p>
                  </div>
                  <div className="bg-white/5 p-8 border border-white/10">
                    <h4 className="text-xl font-semibold text-white mb-4">
                      Geographic Expansion
                    </h4>
                    <p className="text-gray-300 text-base">
                      New markets require partners and local insights.
                    </p>
                  </div>
                  <div className="bg-white/5 p-8 border border-white/10">
                    <h4 className="text-xl font-semibold text-white mb-4">
                      Integration Mentions
                    </h4>
                    <p className="text-gray-300 text-base">
                      Connecting systems often precedes software adoption.
                    </p>
                  </div>
                  <div className="bg-white/5 p-8 border border-white/10">
                    <h4 className="text-xl font-semibold text-white mb-4">
                      Increased Hiring
                    </h4>
                    <p className="text-gray-300 text-base">
                      Headcount surges hint at new initiatives needing tooling.
                    </p>
                  </div>
                  <div className="bg-white/5 p-8 border border-white/10">
                    <h4 className="text-xl font-semibold text-white mb-4">
                      Regulatory Changes
                    </h4>
                    <p className="text-gray-300 text-base">
                      Compliance shifts drive tech adoption and process change.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-gradient-to-r from-red-950/50 to-black/50 border border-white/10 p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="bg-white/5 p-6 border border-white/10 text-center flex-1">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Monitor
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Track web sources and data feeds
                  </p>
                </div>
                
                <div className="hidden md:block w-16 h-px border-t-2 border-dotted border-white/30"></div>
                
                <div className="bg-white/5 p-6 border border-white/10 text-center flex-1">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Detect
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Identify relevant signals in real-time
                  </p>
                </div>
                
                <div className="hidden md:block w-16 h-px border-t-2 border-dotted border-white/30"></div>
                
                <div className="bg-white/5 p-6 border border-white/10 text-center flex-1">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Analyze
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Score and prioritize opportunities
                  </p>
                </div>
                
                <div className="hidden md:block w-16 h-px border-t-2 border-dotted border-white/30"></div>
                
                <div className="bg-white/5 p-6 border border-white/10 text-center flex-1">
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

      {/* Works in Progress Indicator */}
      <section
        data-nav-theme="dark"
        className="py-16 bg-gradient-to-r from-gray-900/50 to-black/50 border-t border-white/10 border-b border-white/10"
      >
        <div className="container-95 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-300 uppercase tracking-widest">
              Works in Progress
            </span>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            The following sections showcase our upcoming platforms currently in development
          </p>
        </div>
      </section>

      {/* Munin (dark, homepage style) */}
      <section
        id="munin"
        data-nav-theme="dark"
        className="scroll-mt-32 min-h-screen pad-section bg-black overflow-hidden"
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
                 
                 
                  <div className="relative aspect-[1/1] w-full overflow-hidden">
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
        className="scroll-mt-32 min-h-screen pad-section bg-black overflow-hidden"
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
