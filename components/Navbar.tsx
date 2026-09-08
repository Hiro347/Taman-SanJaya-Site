'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, PhoneCall } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface NavbarProps {
  settings: SiteSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Service', href: '#service' },
    { name: 'Project', href: '#project' },
    { name: 'Catalog', href: '#catalog' },
    { name: 'About Us', href: '#about' },
  ];

  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    settings.whatsapp_message || 'Halo Taman San Jaya, saya ingin konsultasi mengenai jasa taman.'
  )}`;

  return (
    <header className="w-full px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-4">
      <div className="flex items-center justify-between">
        {/* Brand Logo matching Figma mockup */}
        <Link href="#home" className="flex items-center gap-3.5 group">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="Logo Taman San Jaya"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif italic font-bold tracking-wider text-brand-earth text-lg sm:text-xl leading-tight group-hover:text-brand-crimson transition-colors">
              TAMAN SAN JAYA
            </span>
            <span className="text-xs sm:text-[13px] tracking-widest text-brand-earth/80 font-medium font-sans">
              成功之园
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-brand-earth hover:text-brand-crimson font-medium text-sm lg:text-[16px] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brand-crimson hover:after:w-full after:transition-all after:duration-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-brand-crimson hover:bg-brand-crimson-hover text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Konsultasi</span>
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-brand-earth hover:bg-black/5 transition-colors focus:outline-none"
            aria-label="Buka Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden pt-4 pb-3 border-t border-brand-earth/15 mt-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-brand-earth hover:text-brand-crimson font-medium text-base px-3 py-2 rounded-xl hover:bg-white/40 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-brand-crimson text-white font-semibold text-sm py-2.5 px-4 rounded-full shadow"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Konsultasi WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
