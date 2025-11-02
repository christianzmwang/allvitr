import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Allvitr',
  description: 'Building from Oslo and California.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-black font-times min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  )
}
