'use client'

import Link from 'next/link'

export default function HuginPage() {
  return (
    <>
      <div className="border-b-2 border-gray-400">
        <div className="container-95 py-5">
          <div className="text-sm md:text-base font-semibold text-white">
            <Link href="/" className="hover:text-gray-300">
              Allvitr
            </Link>{' '}
            / <span className="text-red-600">Hugin</span>
          </div>
        </div>
      </div>
    </>
  )
}
