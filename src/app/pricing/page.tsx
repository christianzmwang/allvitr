import NavBar from '../components/NavBar'

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col relative pt-24">
      <NavBar />
      <main className="flex-1 px-6 md:px-8 py-12 md:py-16">
        <div className="w-[95%] md:max-w-[80%] mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Pricing</h1>
          <p className="text-lg text-gray-400 max-w-3xl">
            Choose the plan that fits your needs. This is a placeholder page. Add your pricing details here.
          </p>
        </div>
      </main>
    </div>
  )
}


