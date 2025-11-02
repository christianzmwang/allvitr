import Link from 'next/link'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-white text-black flex flex-col min-h-screen">
        {/* Top Row */}
        <div className="flex justify-between items-start px-4 py-4 md:px-8 md:py-8">
          <div className="text-2xl font-bold">ALLVITR</div>
          <Link href="/contact" className="text-xl hover:underline">
            Contact
          </Link>
        </div>

        {/* Bottom Row */}
        <div className="flex justify-between items-end px-4 py-4 md:px-8 md:py-8 mt-auto">
          <div className="text-xl">Building...</div>
          <div className="text-xl text-right">From Oslo and California</div>
        </div>
      </section>

      {/* Current Project Section */}
      <a 
        href="https://hugin.allvitr.no/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-[#ff3131] text-black py-6 transition-colors duration-300 hover:bg-[#cc1f1f] cursor-pointer block"
      >
        <div className="text-center text-xl">Hugin</div>
      </a>

      <Footer />
    </main>
  )
}
