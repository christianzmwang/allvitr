import NavBar from '../components/NavBar'

export default function AlphaPage() {
  return (
    <div className="page">
      <NavBar />
      <main className="flex-1 pad-section py-12 md:py-16">
        <div className="container-80">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Alpha
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl">
            Welcome to the Alpha program. Work in progress. <br /> Stay tuned!
          </p>
        </div>
      </main>
    </div>
  )
}
