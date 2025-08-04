'use client';

import { Menu, X } from 'lucide-react'; // icons
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 mt-4">
      <nav
        className="
          glass mx-auto flex w-[95%] md:max-w-[80%] items-center justify-between
          rounded-full px-6 py-2
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
          <div className="md:hidden relative">
            <Image
              src="/globe.svg"
              alt="Allvitr Logo"
              width={24}
              height={24}
              className={`w-6 h-6 absolute inset-0 transition-all duration-250 ease-in-out ${
                scrolled ? 'opacity-100 scale-100 delay-125' : 'opacity-0 scale-75'
              }`}
            />
            <span className={`transition-all duration-250 ease-in-out ${
              scrolled ? 'opacity-0 scale-75' : 'opacity-100 scale-100 delay-125'
            }`}>
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
          {/* Get Started button - show on both mobile and desktop */}
          <button
            className="
              rounded-full border border-black/70
              bg-white px-5 py-1.5 text-sm font-semibold
              transition-all duration-300 ease-in-out hover:bg-[#1f1f1f] hover:text-white hover:border-[#1f1f1f]
            "
          >
            Get&nbsp;Started
          </button>

          {/* Hamburger / close - show on both mobile and desktop */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen(!open)}
            className="
              grid w-10 h-8 place-items-center rounded-full border
              border-white bg-white text-black transition-all duration-300 ease-in-out hover:bg-[#1f1f1f] hover:text-white hover:border-[#1f1f1f]
            "
          >
            {open ? <X className="w-4" /> : <Menu className="w-4" />}
          </button>
        </div>
      </nav>

      {/* Slide-down menu (ultra-simple) */}
      {open && (
        <div className="glass mx-auto w-[95%] md:max-w-[80%] mt-3 rounded-xl p-6 space-y-4">
          <Link href="#product" className="block text-white">Product</Link>
          <Link href="#solutions" className="block text-white">Solutions</Link>
          <Link href="#pricing" className="block text-white">Pricing</Link>
          <Link href="#contact" className="block text-white">Contact</Link>
        </div>
      )}
    </header>
  );
} 