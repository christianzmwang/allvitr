
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100 p-4">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-5xl font-extrabold text-emerald-700 mb-4">
          Welcome to Huginn
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Your dedicated platform for market research. Get started by exploring our features or make your first search!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/features"
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            Explore Features
          </a>
          <a
            href="/signup"
            className="px-6 py-3 border border-emerald-600 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-50 transition"
          >
            Get Started
          </a>
        </div>
      </div>
    </main>
  );
}