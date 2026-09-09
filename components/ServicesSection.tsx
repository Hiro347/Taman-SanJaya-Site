'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { Service, SiteSettings } from '@/lib/types';

interface ServicesSectionProps {
  services?: Service[];
  settings: SiteSettings;
}

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
  icon: React.ReactNode;
  slug: string;
}

export default function ServicesSection({ settings }: ServicesSectionProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const serviceItems: ServiceItem[] = [
    {
      id: 'pembuatan',
      title: 'JASA PEMBUATAN',
      desc: 'Pembuatan taman tropis modern, taman minimalis, relief tebing air terjun alami, stepping stone, hardscape, dan penanaman bergaransi tumbuh 100%.',
      imageUrl: '/images/Pembuatan.jpg',
      slug: 'jasa-pembuatan',
      icon: (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-md"
        >
          {/* Construction Foundation Structure */}
          <rect x="12" y="34" width="40" height="20" rx="3" />
          <line x1="12" y1="44" x2="52" y2="44" />
          <line x1="32" y1="34" x2="32" y2="44" />
          <line x1="22" y1="44" x2="22" y2="54" />
          <line x1="42" y1="44" x2="42" y2="54" />
          {/* Sprout emerging from construction stone */}
          <path d="M32 34 C32 20, 24 16, 16 18 C16 26, 22 30, 32 34" />
          <path d="M32 24 C36 16, 44 14, 48 18 C48 25, 42 28, 32 30" />
          {/* Dew drop */}
          <circle cx="32" cy="10" r="2" />
        </svg>
      ),
    },
    {
      id: 'perencanaan',
      title: 'JASA PERENCANAAN',
      desc: 'Visualisasi desain konsep 2D & 3D realistis, survei pengukuran lahan, tata letak vegetasi adaptif, sistem drainase, dan rancangan anggaran biaya (RAB) transparan.',
      imageUrl: '/images/Perencanaan.jpg',
      slug: 'jasa-perencanaan',
      icon: (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-md"
        >
          {/* Drafting Compass Hinge */}
          <circle cx="32" cy="14" r="5" />
          <circle cx="32" cy="14" r="1.5" fill="currentColor" />
          {/* Compass Legs */}
          <line x1="29" y1="18" x2="14" y2="54" />
          <line x1="35" y1="18" x2="50" y2="54" />
          {/* Radial Arc */}
          <path d="M22 36 C28 34, 36 34, 42 36" />
          {/* Blueprint Measurement Dots */}
          <line x1="10" y1="54" x2="54" y2="54" strokeDasharray="3 3" />
          <circle cx="14" cy="54" r="1.5" fill="currentColor" />
          <circle cx="50" cy="54" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'perawatan',
      title: 'JASA PERAWATAN',
      desc: 'Perawatan rutin berkala: pemangkasan dahan pohon, pemupukan nutrisi organik, penggemburan tanah, serta pengendalian hama & jamur berbasis Proteksi Tanaman IPB.',
      imageUrl: '/images/Perawatan.jpg',
      slug: 'jasa-perawatan',
      icon: (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-md"
        >
          {/* Botanical leaf shield */}
          <path d="M32 8 C44 14, 50 20, 50 36 C50 48, 32 56, 32 56 C32 56, 14 48, 14 36 C14 20, 20 14, 32 8 Z" />
          {/* Vein / stem of leaf */}
          <path d="M32 18 L32 46" />
          <path d="M32 26 C38 22, 42 26, 42 30" />
          <path d="M32 34 C26 30, 22 34, 22 38" />
          {/* Health luster sparkle */}
          <path d="M46 12 L48 16 L52 18 L48 20 L46 24 L44 20 L40 18 L44 16 Z" fill="currentColor" opacity="0.8" />
        </svg>
      ),
    },
  ];

  const getWaUrl = (serviceTitle: string) =>
    `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
      `Halo Taman San Jaya, saya ingin bertanya dan konsultasi mengenai layanan ${serviceTitle}.`
    )}`;

  return (
    <section id="service" className="w-full px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        {/* ================================================================= */}
        {/* SECTION TITLE: Clean "Layanan Kami"                               */}
        {/* ================================================================= */}
        <div className="mb-6 sm:mb-8 text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-brand-earth tracking-tight select-none">
            Layanan Kami
          </h2>
        </div>

        {/* ================================================================= */}
        {/* 3-COLUMN EXPANDING ACCORDION GALLERY (Desktop & Tablet)           */}
        {/* Closes to neutral equal columns when cursor leaves container      */}
        {/* ================================================================= */}
        <div
          onMouseLeave={() => setActiveIdx(null)}
          className="hidden md:flex flex-row w-full h-[540px] lg:h-[600px] xl:h-[640px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-black/10 bg-brand-earth"
        >
          {serviceItems.map((item, index) => {
            const isActive = activeIdx === index;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveIdx(index)}
                onClick={() => setActiveIdx(index)}
                className={`relative h-full cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col justify-between p-6 sm:p-7 border-r border-white/15 last:border-r-0 ${
                  isActive ? 'flex-[2] lg:flex-[2.2]' : 'flex-1'
                }`}
              >
                {/* Background Image (Color when Active, Grayscale when Inactive/Closed) */}
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-cover object-center transition-all duration-700 ease-out ${
                    isActive
                      ? 'grayscale-0 brightness-[0.92] scale-105'
                      : activeIdx === null
                      ? 'grayscale brightness-[0.58] contrast-[1.1] hover:brightness-[0.7]'
                      : 'grayscale brightness-[0.4] contrast-[1.2]'
                  }`}
                  priority={index === 0}
                />

                {/* Ambient Dark Gradient Overlays for optimal readability */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                    isActive
                      ? 'bg-gradient-to-t from-black/85 via-black/20 to-black/35'
                      : activeIdx === null
                      ? 'bg-gradient-to-t from-black/85 via-black/30 to-black/45'
                      : 'bg-gradient-to-t from-black/90 via-black/40 to-black/50'
                  }`}
                />

                {/* ----------------------------------------------------------- */}
                {/* Upper Area: Icon & Uppercase Title                          */}
                {/* ----------------------------------------------------------- */}
                <div className="relative z-10 flex flex-col items-center text-center mt-2">
                  <div className="transition-transform duration-500 hover:scale-110 mb-3">
                    {item.icon}
                  </div>

                  <h3 className="text-white font-black tracking-wider text-base sm:text-lg lg:text-xl xl:text-2xl drop-shadow-md uppercase px-1">
                    {item.title}
                  </h3>

                  {/* LIHAT PROYEK Pill Button (Visible when Active) */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 flex flex-col sm:flex-row items-center gap-2"
                      >
                        <a
                          href="#project"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="inline-flex items-center gap-1.5 bg-brand-crimson hover:bg-brand-crimson-hover text-white text-xs font-black px-4 sm:px-5 py-2 rounded-full shadow-lg shadow-brand-crimson/40 transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
                        >
                          <span>LIHAT PROYEK</span>
                        </a>

                        <a
                          href={getWaUrl(item.title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/40 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Konsultasi WA</span>
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ----------------------------------------------------------- */}
                {/* Bottom Area: Description Text                               */}
                {/* ----------------------------------------------------------- */}
                <div className="relative z-10 text-center pb-2">
                  <p
                    className={`text-white/95 text-xs sm:text-[13px] lg:text-sm leading-relaxed drop-shadow transition-opacity duration-500 font-normal px-1 ${
                      isActive ? 'opacity-100 max-w-md mx-auto' : 'opacity-85 line-clamp-3'
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* MOBILE ACCORDION (Interactive Touch Cards for Smartphones)        */}
        {/* ================================================================= */}
        <div className="flex md:hidden flex-col gap-3.5 w-full">
          {serviceItems.map((item, index) => {
            const isActive = activeIdx === index;

            return (
              <div
                key={item.id}
                onClick={() => setActiveIdx(isActive ? null : index)}
                className={`relative w-full rounded-2xl overflow-hidden transition-all duration-500 shadow-lg cursor-pointer ${
                  isActive ? 'h-[290px]' : 'h-[92px]'
                }`}
              >
                {/* Background Image */}
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="100vw"
                  className={`object-cover transition-all duration-500 ${
                    isActive
                      ? 'grayscale-0 brightness-[0.92]'
                      : activeIdx === null
                      ? 'grayscale brightness-[0.58] contrast-[1.1]'
                      : 'grayscale brightness-[0.4] contrast-[1.2]'
                  }`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/40" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-4 text-center">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex-shrink-0">{item.icon}</div>
                      <h3 className="text-white font-black text-base tracking-wide uppercase text-left">
                        {item.title}
                      </h3>
                    </div>

                    {!isActive && (
                      <span className="text-[11px] font-bold text-white/70 bg-white/15 px-2.5 py-1 rounded-full">
                        Buka
                      </span>
                    )}
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center gap-3 pt-2"
                    >
                      <p className="text-white/90 text-xs leading-relaxed max-w-xs">
                        {item.desc}
                      </p>

                      <div className="flex items-center gap-2">
                        <a
                          href="#project"
                          className="inline-flex items-center gap-1.5 bg-brand-crimson hover:bg-brand-crimson-hover text-white text-xs font-black px-4 py-2 rounded-full shadow-md shadow-brand-crimson/40 uppercase tracking-wide transition-all active:scale-95"
                        >
                          <span>LIHAT PROYEK</span>
                        </a>

                        <a
                          href={getWaUrl(item.title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-full border border-white/30"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WA</span>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
