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
        description: 'Real-time market research platform with AI-powered insights'
      },
      {
        '@type': 'Service', 
        name: 'Munin',
        description: 'Secure data storage and analytics platform'
      },
      {
        '@type': 'Service',
        name: 'Odin', 
        description: 'Executive metrics dashboard for real-time KPIs'
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
