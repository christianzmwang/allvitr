import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100 p-8 py-16">
        <div className="max-w-xl w-full text-center">
          <h1 className="text-5xl font-extrabold text-emerald-700 mb-4">
            Welcome to Allvitr
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Your dedicated platform for market research. Get started by exploring
            our features or make your first search!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/hugin"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Learn More About Hugin
            </Link>
          </div>
        </div>
      </section>

      {/* Section 1 */}
      <section className="min-h-screen flex items-center justify-center py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Section 1
          </h2>
          <div className="text-center text-gray-600">
            {/* Content will go here */}
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="min-h-screen flex items-center justify-center py-16 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Section 2
          </h2>
          <div className="text-center text-gray-600">
            {/* Content will go here */}
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="min-h-screen flex items-center justify-center py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Section 3
          </h2>
          <div className="text-center text-gray-600">
            {/* Content will go here */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-8 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Allvitr</h3>
              <p className="text-gray-300">
                Your dedicated platform for market research and insights.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 Allvitr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
