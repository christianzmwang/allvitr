import NavBar from '../components/NavBar'

export default function AlphaPage() {
  return (
    <div className="">
      <NavBar />
      <main className="flex-1 pad-section min-h-screen flex items-center justify-center">
        <div className="container-80">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center w-full gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                Alpha
              </h1>
            </div>
            <div className="text-center md:text-left">
              <p className="text-lg text-gray-400 max-w-3xl">
                Welcome to the Alpha program. Work in progress. <br /> Stay tuned!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
