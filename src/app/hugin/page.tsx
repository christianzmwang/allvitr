export default function HuginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100 p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-extrabold text-emerald-700 mb-4">
          Hugin
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Welcome to the Hugin page! This is where you can explore advanced features
          and tools for your market research needs.
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            What is Hugin?
          </h2>
          <p className="text-gray-600 mb-6">
            Hugin is a powerful platform designed to help you gather insights, 
            analyze market trends, and make data-driven decisions. Our advanced 
            tools provide comprehensive research capabilities for businesses and 
            individuals alike.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h3 className="font-semibold text-emerald-700 mb-2">Market Analysis</h3>
              <p className="text-sm text-gray-600">Comprehensive market research and trend analysis</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">Data Insights</h3>
              <p className="text-sm text-gray-600">Advanced analytics and reporting tools</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            Back to Home
          </a>
          <a
            href="/features"
            className="px-6 py-3 border border-emerald-600 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-50 transition"
          >
            Explore Features
          </a>
        </div>
      </div>
    </main>
  )
} 