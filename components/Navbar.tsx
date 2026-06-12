'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Info, Users, Newspaper, Calendar } from 'lucide-react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 w-full h-14 bg-[#0a0a0a] border-b border-[#1e6b3a]"
    >
      <div className="h-full px-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Story's Signal Caller Summit"
            width={56}
            height={56}
            className="h-12 w-auto md:h-14"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/#about"
            className="text-gray-400 hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="/#sponsors"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Sponsors
          </Link>
          <Link
            href="/#updates"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Updates
          </Link>
          <Link
            href="/register"
            className="bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-medium px-4 py-2 rounded-md min-h-[44px] flex items-center transition-colors"
          >
            Register Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-white"
          aria-label="Open menu"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          data-testid="mobile-menu"
          className="md:hidden absolute top-14 left-0 right-0 bg-[#111] border-b border-[#222]"
        >
          {/* Close button */}
          <div className="flex justify-end p-2">
            <button
              className="p-2 text-white"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Menu links */}
          <Link
            href="/#about"
            data-testid="mobile-about"
            className="flex items-center gap-3 px-4 min-h-[48px] text-gray-400 border-b border-[#222]"
            onClick={() => setIsMenuOpen(false)}
          >
            <Info className="w-5 h-5 text-[#1e6b3a]" aria-hidden="true" />
            About
          </Link>
          <Link
            href="/#sponsors"
            data-testid="mobile-sponsors"
            className="flex items-center gap-3 px-4 min-h-[48px] text-gray-400 border-b border-[#222]"
            onClick={() => setIsMenuOpen(false)}
          >
            <Users className="w-5 h-5 text-[#1e6b3a]" aria-hidden="true" />
            Sponsors
          </Link>
          <Link
            href="/#updates"
            data-testid="mobile-updates"
            className="flex items-center gap-3 px-4 min-h-[48px] text-gray-400 border-b border-[#222]"
            onClick={() => setIsMenuOpen(false)}
          >
            <Newspaper className="w-5 h-5 text-[#1e6b3a]" aria-hidden="true" />
            Updates
          </Link>
          <Link
            href="/book"
            data-testid="mobile-book"
            className="flex items-center gap-3 px-4 min-h-[48px] text-gray-400 border-b border-[#222]"
            onClick={() => setIsMenuOpen(false)}
          >
            <Calendar className="w-5 h-5 text-[#1e6b3a]" aria-hidden="true" />
            Book Clifford
          </Link>

          {/* CTA buttons */}
          <div className="p-4 flex flex-col gap-3">
            <Link
              href="/register"
              data-testid="mobile-register"
              className="bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-medium px-4 py-3 rounded-md text-center min-h-[44px] flex items-center justify-center transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Register Now
            </Link>
            <Link
              href="/book"
              className="border border-[#1e6b3a] text-[#1e6b3a] hover:bg-[#1e6b3a] hover:text-white font-medium px-4 py-3 rounded-md text-center min-h-[44px] flex items-center justify-center transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Clifford
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
