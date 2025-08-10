'use client'

import { Menu, X } from 'lucide-react' // icons
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [useDarkGlass, setUseDarkGlass] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Set page as loaded after a brief delay to trigger the animation
    const timer = setTimeout(() => {
      setPageLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
      // Re-evaluate background under navbar on scroll
      evaluateBackground()
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
    window.addEventListener('resize', evaluateBackground)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', evaluateBackground)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  // Decide whether content behind navbar is light or dark
  const evaluateBackground = () => {
    const header = navRef.current
    if (!header) return
    const rect = header.getBoundingClientRect()
    const sampleX = Math.round(rect.left + rect.width / 2)
    // Bias sampling closer to the top edge on small screens to avoid
    // early transitions before the background has actually changed
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const sampleYOffsetFactor = isMobile ? 0.2 : 0.5
    const sampleY = Math.max(0, Math.round(rect.top + rect.height * sampleYOffsetFactor))
    const elements = document.elementsFromPoint(sampleX, sampleY)

    for (const el of elements) {
      if (el === header || header.contains(el)) continue
      const theme = (el as HTMLElement).dataset?.navTheme
      if (theme === 'light') {
        setUseDarkGlass(true)
        return
      }
      if (theme === 'dark' || theme === 'dark-contrast') {
        setUseDarkGlass(false)
        return
      }
    }
  }

  useEffect(() => {
    evaluateBackground()
  }, [])

  return (
    <header ref={navRef} className="fixed inset-x-0 top-0 z-50 mt-4">
      <nav
        className={`
          ${useDarkGlass ? 'glass-dark' : 'glass'} mx-auto flex w-[95%] md:max-w-[80%] items-center justify-between
          rounded-full px-6 py-2 shadow-md transition-colors duration-300
        `}
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
              className={`w-6 h-6 absolute transition-all duration-500 ease-in-out ${
                scrolled
                  ? 'opacity-100 scale-100 delay-[1000ms]'
                  : 'opacity-0 scale-75'
              }`}
            />
            <span
              key={scrolled ? 'scrolled' : 'not-scrolled'}
              className={`${scrolled ? 'allvitr-typing-disappear' : 'allvitr-typing-appear'}`}>
              Allvitr
            </span>
          </div>

          {/* Always show text on desktop */}
          <span className={`hidden md:inline transition-all duration-300 ease-in-out ${
            pageLoaded ? 'allvitr-typing-appear' : ''
          }`}>
            Allvitr
          </span>
        </Link>

        {/* Centered navigation links for desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="#product"
            className="text-white transition-colors duration-200 hover:text-red-600"
          >
            Platforms
          </Link>
          <Link
            href="#solutions"
            className="text-white transition-colors duration-200 hover:text-red-600"
          >
            Mission
          </Link>
          <Link
            href="#pricing"
            className="text-white transition-colors duration-200 hover:text-red-600"
          >
            Pricing
          </Link>
        </div>

        {/* Right-hand actions */}
        <div className="flex items-center gap-3">
          {/* Demo button - show on both mobile and desktop */}
          <button
            className="
              rounded-full text-red-600 px-5 py-1.5 text-sm font-semibold border-2 border-red
              transition-all duration-300 ease-in-out hover:border-white hover:text-white
            "
          >
            Demo
          </button>

          {/* Hamburger / close - show only on mobile */}
          <button
            ref={buttonRef}
            aria-label="Open menu"
            onClick={() => setOpen(!open)}
            className="
              grid w-10 h-8 place-items-center rounded-full
              bg-white text-black transition-all duration-300 ease-in-out hover:bg-[#1f1f1f] hover:text-white
              md:hidden
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

      {/* Slide-down menu for mobile */}
      <div
        ref={menuRef}
        className={`
          ${useDarkGlass ? 'glass-dark' : 'glass'} mx-auto w-[95%] md:max-w-[80%] mt-3 rounded-xl p-6 space-y-4
          transition-all duration-300 ease-in-out transform origin-top
          md:hidden
          ${
            open
              ? 'opacity-100 scale-y-100 translate-y-0'
              : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
          }
        `}
      >
        <Link
          href="#product"
          className="block mix-blend-difference text-white transition-colors duration-200 hover:text-red-400"
        >
          Platforms
        </Link>
        <Link
          href="#solutions"
          className="block mix-blend-difference text-white transition-colors duration-200 hover:text-red-400"
        >
          Alpha
        </Link>
        <Link
          href="#pricing"
          className="block mix-blend-difference text-white transition-colors duration-200 hover:text-red-400"
        >
          Pricing
        </Link>
      </div>
    </header>
  )
}
