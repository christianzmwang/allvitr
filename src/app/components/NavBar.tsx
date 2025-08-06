'use client'

import { Menu, X } from 'lucide-react' // icons
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 mt-4">
      <nav
        className="
          glass mx-auto flex w-[95%] md:max-w-[80%] items-center justify-between
          rounded-full px-6 py-2 shadow-md
        "
      >
        {/* Brand "search bar" */}
        <Link
          href="/"
          className="
            flex items-center gap-2 text-lg font-medium text-white
          "
        >
          {/* Show logo on mobile when scrolled, text otherwise */}
          <div className="md:hidden relative flex items-center">
            <Image
              src="/globe.svg"
              alt="Allvitr Logo"
              width={24}
              height={24}
              className={`w-6 h-6 absolute transition-all duration-250 ease-in-out ${
                scrolled
                  ? 'opacity-100 scale-100 delay-125'
                  : 'opacity-0 scale-75'
              }`}
            />
            <span
              className={`transition-all duration-250 ease-in-out ${
                scrolled
                  ? 'opacity-0 scale-75'
                  : 'opacity-100 scale-100 delay-125'
              }`}
            >
              Allvitr
            </span>
          </div>

          {/* Always show text on desktop */}
          <span className="hidden md:inline transition-all duration-300 ease-in-out">
            Allvitr
          </span>
        </Link>

        {/* Right-hand actions */}
        <div className="flex items-center gap-3">
          {/* Demo button - show on both mobile and desktop */}
          <button
            className="
              rounded-full text-red-600 bg-whtie px-5 py-1.5 text-sm font-semibold border-2 border-red
              transition-all duration-300 ease-in-out hover:border-white hover:text-white
            "
          >
            Demo
          </button>

          {/* Hamburger / close - show on both mobile and desktop */}
          <button
            ref={buttonRef}
            aria-label="Open menu"
            onClick={() => setOpen(!open)}
            className="
              grid w-10 h-8 place-items-center rounded-full
              bg-white text-black transition-all duration-300 ease-in-out hover:bg-[#1f1f1f] hover:text-white
            "
          >
            <div className="relative w-4 h-4">
              <Menu
                className={`w-4 h-4 absolute inset-0 transition-all duration-300 ease-in-out ${
                  open
                    ? 'opacity-0 rotate-90 scale-75'
                    : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <X
                className={`w-4 h-4 absolute inset-0 transition-all duration-300 ease-in-out ${
                  open
                    ? 'opacity-100 rotate-0 scale-100'
                    : 'opacity-0 -rotate-90 scale-75'
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Slide-down menu with smooth transitions */}
      <div
        ref={menuRef}
        className={`
          glass mx-auto w-[95%] md:max-w-[80%] mt-3 rounded-xl p-6 space-y-4
          transition-all duration-300 ease-in-out transform origin-top
          ${
            open
              ? 'opacity-100 scale-y-100 translate-y-0'
              : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
          }
        `}
      >
        <Link
          href="#product"
          className="block mix-blend-difference text-white transition-colors duration-200"
        >
          Product
        </Link>
        <Link
          href="#solutions"
          className="block mix-blend-difference text-white transition-colors duration-200"
        >
          Solutions
        </Link>
        <Link
          href="#pricing"
          className="block mix-blend-difference text-white transition-colors duration-200"
        >
          Pricing
        </Link>
      </div>
    </header>
  )
}
