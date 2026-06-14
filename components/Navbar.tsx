"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 z-50 w-full h-14 bg-black border-b border-[#1e6b3a]"
    >
      <div className="h-full px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Story's Signal Caller Summit"
            width={44}
            height={44}
            className="h-11 w-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/#about"
            className="font-display text-[16px] tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            ABOUT
          </Link>
          <Link
            href="/#sponsors"
            className="font-display text-[16px] tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            SPONSORS
          </Link>
          <Link
            href="/#updates"
            className="font-display text-[16px] tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            UPDATES
          </Link>
          <Link
            href="/register"
            className="bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-display text-[16px] tracking-wider px-6 py-2 transition-colors"
          >
            REGISTER NOW
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-white"
          aria-label="Open menu"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>

      {isMenuOpen && (
        <div
          data-testid="mobile-menu"
          className="md:hidden fixed inset-0 bg-black z-50 flex flex-col"
        >
          <div className="flex justify-end p-4">
            <button
              className="p-2 text-white"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="w-8 h-8" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <Link
              href="/#about"
              data-testid="mobile-about"
              className="font-display text-[48px] text-white tracking-wider hover:text-[#1e6b3a] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link
              href="/#sponsors"
              data-testid="mobile-sponsors"
              className="font-display text-[48px] text-white tracking-wider hover:text-[#1e6b3a] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              SPONSORS
            </Link>
            <Link
              href="/#updates"
              data-testid="mobile-updates"
              className="font-display text-[48px] text-white tracking-wider hover:text-[#1e6b3a] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              UPDATES
            </Link>
            <Link
              href="/book"
              data-testid="mobile-book"
              className="font-display text-[48px] text-white tracking-wider hover:text-[#1e6b3a] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              BOOK CLIFFORD
            </Link>
            <Link
              href="/register"
              data-testid="mobile-register"
              className="mt-8 bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-display text-[24px] tracking-wider px-12 py-4 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              REGISTER NOW
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
