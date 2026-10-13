"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/etkinlikler', label: 'Etkinlikler' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/#iletisim', label: 'İletişim' },
];

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#F5EEE0]/10 bg-[#94585A]/80 backdrop-blur-md">
      <div className="mx-auto flex h-28 max-w-[1200px] items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex-shrink-0">
          <Image src="/venue/logo-v2.png" alt="Maksat Muhabbet" width={237} height={95} className="h-[95px] w-auto object-contain" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-[0.16em] uppercase">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-[#F5EEE0]/70 hover:text-[#F0D592] transition">
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="/rezervasyon"
          className="hidden md:inline-block border border-[#F0D592] px-5 py-2.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#F5EEE0] hover:bg-[#F0D592] hover:text-[#94585A] transition"
        >
          Rezervasyon
        </Link>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#F5EEE0]">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#94585A]/95 backdrop-blur-md border-t border-[#F5EEE0]/10"
          >
            <div className="flex flex-col items-center gap-5 py-6">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold uppercase tracking-widest text-[#F5EEE0]/70 hover:text-[#F0D592]"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/rezervasyon"
                onClick={() => setMobileOpen(false)}
                className="border border-[#F0D592] px-6 py-2 text-xs font-semibold uppercase tracking-wider"
              >
                Rezervasyon
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
