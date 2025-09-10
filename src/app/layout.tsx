import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'
import Footer from './components/Footer'

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Allvitr - AI-Powered Business Intelligence & Market Research',
    template: '%s | Allvitr'
  },
  description: 'Amplifying Human Insight with AI-powered platforms for real-time market research, secure data analytics, and executive dashboards. Turn information overload into clarity.',
  keywords: ['AI', 'business intelligence', 'market research', 'data analytics', 'executive dashboard', 'automation', 'real-time insights', 'Hugin', 'Munin', 'Odin'],
  authors: [{ name: 'Allvitr' }],
  creator: 'Allvitr',
  publisher: 'Allvitr',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: { 
    icon: '/favicon.ico',
    apple: '/favicon.ico'
  },
  metadataBase: new URL('https://allvitr.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://allvitr.com',
    siteName: 'Allvitr',
    title: 'Allvitr - AI-Powered Business Intelligence & Market Research',
    description: 'Turn information overload into clarity with AI-powered platforms for real-time market research, secure data analytics, and executive dashboards.',
    images: [
      {
        url: '/WebAllvitr.png',
        width: 1200,
        height: 630,
        alt: 'Allvitr - AI-Powered Business Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@allvitr',
    creator: '@allvitr',
    title: 'Allvitr - AI-Powered Business Intelligence & Market Research',
    description: 'Turn information overload into clarity with AI-powered platforms for real-time market research, secure data analytics, and executive dashboards.',
    images: ['/WebAllvitr.png'],
  },
  alternates: {
    canonical: 'https://allvitr.com',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Allvitr',
    url: 'https://allvitr.com',
    logo: 'https://allvitr.com/WebAllvitr.png',
    description: 'AI-powered business intelligence and market research platforms that turn information overload into clarity.',
    foundingDate: '2024',
    sameAs: [
      'https://twitter.com/allvitr',
      'https://linkedin.com/company/allvitr'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: 'https://allvitr.com/contact'
    },
    offers: [
      {
        '@type': 'Service',
        name: 'Hugin',
        serviceType: 'Real-time market research & signal detection',
        url: 'https://allvitr.com/platforms#hugin',
        description: 'Real-time market research platform that indexes trusted sources and the public web to surface only high-signal market, product, and buying intent events.',
        areaServed: 'Global',
        termsOfService: 'https://allvitr.com/privacy-policy'
      },
      {
        '@type': 'Service',
        name: 'Munin',
        serviceType: 'Secure knowledge base & analytics',
        url: 'https://allvitr.com/platforms#munin',
        description: 'Secure data & knowledge consolidation with governed access, RAG-ready search, and analytics.',
        areaServed: 'Global',
        termsOfService: 'https://allvitr.com/privacy-policy'
      },
      {
        '@type': 'Service',
        name: 'Odin',
        serviceType: 'Executive KPI dashboard',
        url: 'https://allvitr.com/platforms#odin',
        description: 'Executive metrics & anomaly detection with unified revenue, product, and operations visibility.',
        areaServed: 'Global',
        termsOfService: 'https://allvitr.com/privacy-policy'
      }
    ],
    hasPart: [
      { '@type': 'WebPage', '@id': 'https://allvitr.com/platforms', name: 'Platforms' },
      { '@type': 'WebPage', '@id': 'https://allvitr.com/pricing', name: 'Pricing' },
      { '@type': 'WebPage', '@id': 'https://allvitr.com/contact', name: 'Contact' }
    ]
  }

  // Minimal BreadcrumbList (root level) – page-level breadcrumbs can extend this if needed
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://allvitr.com'
      }
    ]
  }

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} ${inter.variable} font-mono bg-black`}
      >
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
