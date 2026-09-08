'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  MessageCircle,
  ArrowUpRight,
} from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface HeroSectionProps {
  settings: SiteSettings;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, 40]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.95]);

  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    settings.whatsapp_message ||
      'Halo Taman San Jaya, saya ingin konsultasi mengenai perencanaan & pembuatan taman.'
  )}`;

  return (
    <section id="home" className="w-full pt-8 sm:pt-14 lg:pt-20 pb-0 flex flex-col justify-between overflow-hidden relative">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6 sm:pb-10 lg:pb-14">
        <motion.div
          style={{ y: heroParallax, opacity: heroOpacity }}
          className="flex flex-col items-center text-center"
        >
          {/* Editorial Clean Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-[68px] xl:text-[76px] font-black text-brand-earth tracking-tight leading-[1.12] max-w-4xl"
          >
            Wujudkan{' '}
            <span className="block sm:inline font-serif italic font-bold text-brand-crimson">
              Taman Tropis Asri
            </span>{' '}
            & Ruang Hijau Impian
          </motion.h1>

          {/* Subtitle Value Proposition */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 sm:mt-7 text-brand-earth/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto font-normal"
          >
            {settings.hero_subtitle}
          </motion.p>

          {/* Call to Action - Consultation Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-10 flex items-center justify-center w-full"
          >
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-brand-crimson hover:bg-brand-crimson-hover text-white font-bold text-base sm:text-lg px-9 py-4 rounded-full shadow-xl shadow-brand-crimson/20 transition-all group"
            >
              <MessageCircle className="w-5 h-5 fill-white text-brand-crimson transition-transform group-hover:rotate-12" />
              <span>Konsultasi Sekarang</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* ===================================================================== */}
      {/* FULL-WIDTH NATURAL GARDEN SECTION DIVIDER: Group 1 SVG                */}
      {/* Membentang penuh di bagian dasar seperti tanaman pada gambar contoh   */}
      {/* ===================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative -mt-4 sm:-mt-8 lg:-mt-12 pointer-events-none select-none z-10"
      >
        <img
          src="/images/group-1.svg"
          alt="Pembatas Taman San Jaya - Ornamen Batuan & Bunga Alami"
          className="w-full h-auto block"
        />
      </motion.div>
    </section>
  );
}
