import Link from 'next/link'
import NavBar from './components/NavBar'

export default function NotFound() {
  return (
    <div className="min-h-full flex flex-col">
      <NavBar />

      {/* Content area fills remaining height between navbar and footer */}
      <section
        data-nav-theme="dark"
        className="relative flex flex-1 items-center justify-center pt-16 md:pt-20 px-6 bg-black text-white"
      >
        <div className="container-95 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent mb-4 heading-outline-light">
            404
          </h1>
          <p className="text-base md:text-lg text-gray-400 mb-8">
            The page you are looking for does not exist.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="btn btn-primary">
              Go home
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
