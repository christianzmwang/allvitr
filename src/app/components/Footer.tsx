import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 overflow-hidden">
      <div className="px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-left">
            <h3 className="text-2xl font-bold mb-2">
              <Link href="/" aria-label="Go to homepage" className="hover:text-gray-300 transition-colors">
                Allvitr
              </Link>
            </h3>
            <div className="text-gray-400 text-sm space-y-2">
              <p className="flex flex-wrap items-center gap-12">
                <Link href="/privacy-policy" className="text-gray-400 hover:text-red-600/90 transition-colors">
                  Privacy Policy
                </Link>
                <a href="mailto:info@allvitr.com" className="text-gray-400 hover:text-red-600/90 transition-colors">
                  info@allvitr.com
                </a>
                <a
                  href="https://www.linkedin.com/company/allvitr/"
                  className="text-gray-400 hover:text-red-600/90 transition-colors"
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Allvitr. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
