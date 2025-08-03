'use client';

import { Menu, Search, X } from 'lucide-react'; // icons
import { useState } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 mt-4">
      <nav
        className="
          glass mx-auto flex max-w-[80%] items-center justify-between
          rounded-full px-6 py-2
        "
      >
        {/* Brand "search bar" */}
        <Link
          href="/"
          className="
            flex items-center gap-2 text-lg font-medium text-white
            before:content-['🦅'] before:mr-2
          "
        >
          Allvitr
        </Link>

        {/* Right-hand actions */}
        <div className="flex items-center gap-3">
          <button
            className="
              hidden md:inline rounded-full border border-black/70
              bg-white px-5 py-1.5 text-sm font-semibold
              transition-all duration-300 ease-in-out hover:bg-gray-800 hover:text-white hover:border-gray-800
            "
          >
            Get&nbsp;Started
          </button>

          {/* Search button (circle) */}
          <button
            aria-label="Site search"
            className="
              grid w-10 h-8 place-items-center rounded-full border
              border-white bg-white text-black transition-all duration-300 ease-in-out hover:bg-gray-800 hover:text-white hover:border-gray-800
            "
          >
            <Search className="w-4" />
          </button>

          {/* Hamburger / close */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen(!open)}
            className="
              grid size-10 place-items-center rounded-md border
              border-white/50 bg-white/10 transition hover:bg-white/20
              md:hidden
            "
          >
            {open ? <X className="w-4" /> : <Menu className="w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile slide-down (ultra-simple) */}
      {open && (
        <div className="md:hidden glass mx-4 mt-3 rounded-xl p-6 space-y-4">
          <Link href="#product" className="block text-white">Product</Link>
          <Link href="#solutions" className="block text-white">Solutions</Link>
          <Link href="#pricing" className="block text-white">Pricing</Link>
          <Link href="#contact" className="block text-white">Contact</Link>
        </div>
      )}
    </header>
  );
} 