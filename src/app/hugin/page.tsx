import Link from 'next/link'
import NavBar from '../components/NavBar'

export default function HuginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4 pt-20">
      <NavBar />
      <div className="max-w-2xl w-full text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Hugin
        </h1>
        <p className="text-base md:text-lg text-gray-400 mb-6 md:mb-8 px-2">
          Welcome to the Hugin page! This is where you can explore advanced
          features and tools for your market research needs.
        </p>
        <div className="bg-gray-900 rounded-lg shadow-lg p-4 md:p-8 mb-6 md:mb-8 border border-gray-700">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
            What is Hugin?
          </h2>
          <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6">
            Hugin is a powerful platform designed to help you gather insights,
            analyze market trends, and make data-driven decisions. Our advanced
            tools provide comprehensive research capabilities for businesses and
            individuals alike.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-left">
            <div className="bg-gray-800 p-3 md:p-4 rounded-lg border border-gray-700">
              <h3 className="font-semibold text-white mb-2 text-sm md:text-base">
                Market Analysis
              </h3>
              <p className="text-xs md:text-sm text-gray-400">
                Comprehensive market research and trend analysis
              </p>
            </div>
            <div className="bg-gray-800 p-3 md:p-4 rounded-lg border border-gray-700">
              <h3 className="font-semibold text-white mb-2 text-sm md:text-base">
                Data Insights
              </h3>
              <p className="text-xs md:text-sm text-gray-400">
                Advanced analytics and reporting tools
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Link
            href="/"
            className="px-4 md:px-6 py-2.5 md:py-3 bg-gray-400 text-black font-semibold border-2 border-transparent hover:border-white transition duration-300 text-sm md:text-base rounded"
          >
            Back to Home
          </Link>
          <Link
            href="/features"
            className="px-4 md:px-6 py-2.5 md:py-3 border-2 border-gray-400 text-gray-400 font-semibold hover:border-white hover:text-white transition duration-300 text-sm md:text-base rounded"
          >
            Explore Features
          </Link>
        </div>
      </div>
    </main>
  )
}
