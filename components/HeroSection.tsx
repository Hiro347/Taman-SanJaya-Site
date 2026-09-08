'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  MessageCircle,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
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
    <section id="home" className="w-full pt-6 sm:pt-10 lg:pt-14 pb-0 flex flex-col justify-between overflow-hidden relative">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ y: heroParallax, opacity: heroOpacity }}
          className="flex flex-col items-center text-center"
        >
          {/* Top Pill Kicker Badge (Like reference: "We just Raised 20M 🚀") */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-brand-earth/15 text-brand-earth text-xs font-bold tracking-wide shadow-xs mb-6 sm:mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span className="text-brand-crimson font-black tracking-widest uppercase">
              成功之园
            </span>
            <span className="text-brand-earth/30">•</span>
            <span className="text-brand-earth font-semibold">
              Proteksi Tanaman IPB Heritage
            </span>
          </motion.div>

          {/* Editorial Clean Headline (Matching reference typography) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 sm:mt-7 text-brand-earth/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto font-normal"
          >
            {settings.hero_subtitle}
          </motion.p>

          {/* Call to Action Suite */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto"
          >
            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-crimson hover:bg-brand-crimson-hover text-white font-bold text-base px-8 py-4 rounded-full shadow-xl shadow-brand-crimson/20 transition-all group"
            >
              <MessageCircle className="w-5 h-5 fill-white text-brand-crimson transition-transform group-hover:rotate-12" />
              <span>Konsultasi Desain (WhatsApp)</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              href="#project"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-brand-earth font-semibold text-base px-7 py-4 rounded-full border border-brand-earth/20 shadow-sm backdrop-blur-md transition-all hover:border-brand-crimson/40"
            >
              <Sparkles className="w-4 h-4 text-brand-navy" />
              <span>Lihat Portofolio Proyek</span>
            </motion.a>
          </motion.div>

          {/* Social Proof & Guarantee Badges (Like reference: "Partnered with...") */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 sm:gap-x-8 text-xs sm:text-sm text-brand-earth/85 font-medium"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-600">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i} className="text-sm font-bold">★</span>
                ))}
              </div>
              <span className="font-extrabold text-brand-earth">4.9/5</span>
              <span className="text-brand-earth/65">(120+ Klien)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-crimson flex-shrink-0" />
              <span>Garansi Tumbuh 100% (IPB)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-navy flex-shrink-0" />
              <span>Survei & Estimasi RAB Gratis</span>
            </div>
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
