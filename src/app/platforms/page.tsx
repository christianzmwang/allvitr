import NavBar from '../components/NavBar'
import Image from 'next/image'
import wave from '../../../public/wave.png'

// Reusable components to reduce duplication
function SignalCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="bg-gray-600 p-8 border-1 border-red-600 transition-all duration-200 hover:shadow-[inset_0_0_100px_rgba(255,0,0,0.8)]">
      <h4 className="text-xl font-semibold text-white mb-4">{title}</h4>
      <p className="text-gray-300 text-base">{description}</p>
    </div>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="bg-white/5 p-6 border border-white/10">
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}

function ProcessStep({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="bg-white/5 p-6 border border-white/10 text-center flex-1">
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  )
}

function BenefitCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div
      className={`bg-black border-1 border-red-600 p-6`}
    >
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  )
}

export default function PlatformsPage() {
  return (
    <div className="page">
      <NavBar />

      {/* Hero */}
      <section
        data-nav-theme="dark"
        className="min-h-screen flex items-center justify-center bg-gray-600"
      >
        <div className="container-95 h-full flex items-center">
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

      {/* Hugin - Overview Section */}
      <section
        id="hugin"
        data-nav-theme="dark"
        className="scroll-mt-32 min-h-screen bg-black overflow-hidden border-t border-red-600"
      >
        <div className="min-h-[80vh] flex items-center py-20 md:py-32">
          <div className="container-95">
            {/* Header + Image two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-36">
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
              <div className="order-2 md:order-2 text-left mt-12 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center gap-3">
                  <span>Hugin</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-widest px-2.5 py-1 border-1 border-red-600 bg-gray-600 text-white ml-5">
                    powered by AI-Agents
                  </span>
                </h2>
                <p className="text-lg text-gray-300 mb-8 max-w-prose">
                  We cut through the noise with real-time market research,
                  indexing the web and trusted data to surface only the signals
                  that matter.
                </p>
              </div>
            </div>

            {/* Core Benefits Grid */}
            <div className="bg-gray-600 p-10 md:p-16 mb-24 border-1 border-red-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                {/* Left: Human Connection - Heading at top, text at bottom */}
                <div className="text-left flex flex-col justify-between h-full">
                  {/* Top: Human Connection Heading */}
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
                      Human connection
                    </h3>
                  </div>

                  {/* Bottom: Descriptive Text */}
                  <div className="mt-auto">
                    <p className="text-lg text-gray-300 max-w-prose">
                      Automate what should be automated.
                    </p>
                    <p className="text-lg text-gray-300 max-w-prose mt-6">
                      Spend time building relationships, <br />
                      as you always should&apos;ve.
                    </p>
                  </div>
                </div>

                {/* Right: Stacked Benefit Cards */}
                <div className="space-y-8">
                  <BenefitCard
                    title="Prioritize Outreach"
                    description="Focus on accounts actively evaluating your solutions, not just a static ICP list."
                    
                  />
                  <BenefitCard
                    title="Shorten Cycles"
                    description="Start with context. Tailor messaging and speed up qualification."
                  />
                  <BenefitCard
                    title="Increase Win Rate"
                    description="Engage when the need is fresh and budgets are available."
                  />
                </div>
              </div>
            </div>

            {/* Signal Types Section */}
            <div className="min-h-screen flex items-center py-20 md:py-32">
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {/* Left: Signal Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SignalCard
                      title="New Product Launch"
                      description="Signals investment in growth and supporting tools."
                    />
                    <SignalCard
                      title="Executive Hire"
                      description="New leaders bring new strategies and stacks."
                    />
                    <SignalCard
                      title="Geographic Expansion"
                      description="New markets require partners and local insights."
                    />
                    <SignalCard
                      title="Integration Mentions"
                      description="Connecting systems often precedes software adoption."
                    />
                    <SignalCard
                      title="Increased Hiring"
                      description="Headcount surges hint at new initiatives needing tooling."
                    />
                    <SignalCard
                      title="Regulatory Changes"
                      description="Compliance shifts drive tech adoption and process change."
                    />
                  </div>

                  {/* Right: Signal Types Text and Content */}
                  <div className="flex flex-col h-full">
                    {/* Top: Signal Types + First Text */}
                    <div className="space-y-6 mb-12">
                      <h3 className="text-3xl md:text-4xl font-bold text-white">
                        Signals
                      </h3>
                      <p className="text-lg text-gray-300 max-w-prose">
                        These are some of the signals we monitor to help you identify the best opportunities for engagement.
                      </p>
                    </div>

                    {/* Vertically Centered: Second Text + Button */}
                    <div className="flex-1 flex flex-col justify-center space-y-8">
                      <p className="text-lg text-gray-300 max-w-prose">
                        Get in touch with us, and we will add the signals you wish to monitor.
                      </p>
                                              <a 
                          href="/contact" 
                          className="btn border-2 border-white hover:border-green-500 text-white bg-transparent relative overflow-hidden group"
                        >
                          <span className="relative z-10">Get in touch</span>
                          <div className="absolute top-1/2 left-48 right-12 h-1 bg-white -translate-y-1/2" 
                               style={{backgroundImage: 'repeating-linear-gradient(to right, white 0, white 4px, transparent 4px, transparent 8px)'}}>
                            <div className="absolute top-0 left-0 w-0 h-full bg-green-500 group-hover:w-full transition-all duration-1000 ease-in"></div>
                          </div>
                        </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-gradient-to-r from-red-950/50 to-black/50 border border-white/10 p-10 md:p-16">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <ProcessStep
                  title="Monitor"
                  description="Track web sources and data feeds"
                />

                <div className="hidden md:block w-20 h-px border-t-2 border-dotted border-white/30"></div>

                <ProcessStep
                  title="Detect"
                  description="Identify relevant signals in real-time"
                />

                <div className="hidden md:block w-20 h-px border-t-2 border-dotted border-white/30"></div>

                <ProcessStep
                  title="Analyze"
                  description="Score and prioritize opportunities"
                />

                <div className="hidden md:block w-20 h-px border-t-2 border-dotted border-white/30"></div>

                <ProcessStep
                  title="Act"
                  description="Engage with perfect timing"
                />
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
            The following sections showcase our upcoming platforms currently in
            development
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
              <FeatureCard
                title="Unified Knowledge"
                description="Connect sources into a single, searchable system."
              />
              <FeatureCard
                title="Access Controls"
                description="Fine-grained permissions, governance, and audit history."
              />
              <FeatureCard
                title="Analytics & AI"
                description="Usage analytics and retrieval-augmented generation."
              />
              <FeatureCard
                title="Customer Support"
                description="Deflect tickets with accurate, approved answers."
              />
              <FeatureCard
                title="Engineering Enablement"
                description="Reduce onboarding time with a shared context hub."
              />
              <FeatureCard
                title="Sales Playbooks"
                description="Keep discovery and competitive intel current."
              />
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
                <FeatureCard
                  title="Real-time Pipelines"
                  description="Stream from your warehouse, product events, and CRM."
                />
                <FeatureCard
                  title="Executive Views"
                  description="Curated dashboards for leadership teams."
                />
                <FeatureCard
                  title="Alerts & Anomalies"
                  description="Proactive notifications when goals drift or trends shift."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard
                  title="Revenue"
                  description="Pipeline health, conversion, and forecast accuracy."
                />
                <FeatureCard
                  title="Product"
                  description="Activation, engagement, retention, adoption."
                />
                <FeatureCard
                  title="Operations"
                  description="SLAs, incident trends, and efficiency improvements."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
