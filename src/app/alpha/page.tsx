import Link from 'next/link'
import NavBar from '../components/NavBar'

export const metadata = {
  title: 'Generate Alpha – Autonomous Insight & Compounding Advantage',
  description:
    "How Allvitr helps organizations generate sustainable alpha by turning raw, fast-moving information into autonomous decision support and compounding operational intelligence.",
  openGraph: {
    title: 'Generate Alpha – Allvitr',
    description:
      'From signal ingestion to autonomous decision surfaces—foundations for durable advantage.',
  },
  alternates: { canonical: 'https://allvitr.com/alpha' },
}

const PLATFORM_HIGHLIGHTS = [
  {
    id: 'hugin',
    title: 'Hugin',
    tagline: 'Real‑time market signal extraction',
    copy:
      'Continuously indexes public web + domain sources to surface emerging companies, events, and directional movements before they appear in slow research cycles.',
  },
  {
    id: 'munin',
    title: 'Munin',
    tagline: 'Secure internal + external data fusion',
    copy:
      'Brings structured + unstructured data into a semantic layer so autonomous agents and humans operate from a single evolving source of truth.',
  },
  {
    id: 'odin',
    title: 'Odin',
    tagline: 'Executive operating lens',
    copy:
      'Transforms live streams of operational + market context into prioritized metrics, narratives, and recommended actions.',
  },
]

export default function AlphaPage() {
  return (
  <div className="bg-black text-white relative font-mono">
      <NavBar />

      {/* Hero */}
      <section
        data-nav-theme="dark"
        className="relative min-h-[80vh] flex items-center pt-32 md:pt-40 pb-24 overflow-hidden"
      >
        <div className="container-95 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-7 flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Generate<br className="hidden md:block" /> Autonomous Advantage
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
              Generating alpha isn't about incremental efficiency. It's about
              compounding insight: perceiving change early, fusing internal and
              external context, and compressing the loop from signal → decision → action.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/contact" className="btn btn-primary">Contact Us</Link>
              <Link
                href="/platforms"
                className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Explore Platforms ↗
              </Link>
            </div>
          </div>
          <div className="md:col-span-5 flex items-center">
            <div className="w-full glass-dark p-8 md:p-10 ring-1 ring-white/10">
              <h2 className="text-xl font-semibold mb-4">What It Takes</h2>
              <ul className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <li>Real‑time external awareness</li>
                <li>Secure + granular internal data activation</li>
                <li>Autonomous research agent scaffolds</li>
                <li>Executive decision surfaces & narrative automation</li>
                <li>Ontology + event streams as core primitives</li>
              </ul>
              <p className="mt-6 text-gray-400 text-xs">
                Alpha = durable differentiation through accelerated sense‑making,
                not generic reporting layers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section
        data-nav-theme="dark"
        className="relative py-20 md:py-32 bg-gradient-to-b from-black via-black/70 to-black"
      >
        <div className="container-80 max-w-5xl">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-8">
            From Static Dashboards to Living Systems
          </h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p>
              Most tooling still optimizes for after‑the‑fact reporting. The
              frontier is software that continuously ingests raw signals, fuses
              them with proprietary context, and produces ranked hypotheses and
              suggested actions—without forcing teams through rigid manual
              workflows.
            </p>
            <p>
              Our approach treats events, entities, relationships, and metrics as
              first‑class, streaming objects. This enables agents + humans to
              collaborate over a shared evolving model of markets and operations.
            </p>
            <p>
              We design these primitives with teams that treat information as a
              strategic asset. The outcome: an opinionated system for compounds
              of aligned data, adaptive models, and autonomous assistance—not
              another static analytics layer.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Highlights */}
      <section
        id="alpha-platforms"
        data-nav-theme="dark"
        className="relative py-24 md:py-36"
      >
        <div className="container-95">
          <div className="max-w-3xl mb-14">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
              Core Building Blocks
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Each platform can stand alone, but together they form an adaptive
              stack that accelerates perception → understanding → decision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {PLATFORM_HIGHLIGHTS.map((p) => (
              <Link
                key={p.id}
                href={`/platforms#${p.id}`}
                className="group relative ring-1 ring-white/10 bg-gradient-to-b from-white/5 to-white/0 hover:from-white/10 hover:ring-white/20 transition-colors p-6 flex flex-col"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <div className="text-xs uppercase tracking-wide text-red-500/80 group-hover:text-red-400 mt-1">
                    {p.tagline}
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed flex-1">
                  {p.copy}
                </p>
                <span className="mt-6 inline-block text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                  Learn more ↗
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        data-nav-theme="dark"
        className="relative py-28 md:py-40 bg-gradient-to-t from-black via-black/70 to-black"
      >
        <div className="container-80 flex flex-col items-start">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Start Generating Alpha
          </h2>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl leading-relaxed">
            If you're pushing beyond passive dashboards toward proactive,
            compounding intelligence, we can help architect the foundation:
            ingestion, fusion, narrative surfacing, and action orchestration.
          </p>
          <Link
            href="/contact"
            className="mt-10 px-8 py-4 btn btn-primary text-base font-semibold"
          >
            Contact Us
          </Link>
          <p className="mt-4 text-xs text-gray-500">Let's discuss your data environment & priority decisions.</p>
        </div>
      </section>
    </div>
  )
}
