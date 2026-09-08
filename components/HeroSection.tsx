'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  MessageCircle,
  Sprout,
  ShieldCheck,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Sparkles,
  Waves,
  Trees,
  ChevronDown,
} from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface HeroSectionProps {
  settings: SiteSettings;
}

interface LandscapeTheme {
  id: string;
  name: string;
  icon: React.ElementType;
  tagline: string;
  location: string;
  badge: string;
  imageUrl: string;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, 60]);
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0.92]);

  const themes: LandscapeTheme[] = [
    {
      id: 'tropical',
      name: 'Taman Tropis',
      icon: Trees,
      tagline: 'Courtyard Sanctuary & Decking Kayu',
      location: 'Residensial Jakarta Selatan',
      badge: 'Signature Style',
      imageUrl: settings.hero_image_url || '/images/hero-garden.jpg',
    },
    {
      id: 'koi',
      name: 'Kolam Koi Modern',
      icon: Waves,
      tagline: 'Filtrasi 4-Chamber & Air Terjun Dinding',
      location: 'BSD City, Tangerang',
      badge: 'Ekosistem Alami',
      imageUrl: '/images/3d-garden-diorama.jpg',
    },
    {
      id: 'zen',
      name: 'Zen Garden Kering',
      icon: Sprout,
      tagline: 'Minimalis Batu Koral & Vegetasi Sikas',
      location: 'Menteng, Jakarta Pusat',
      badge: 'Low Maintenance',
      imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const [activeTheme, setActiveTheme] = useState<LandscapeTheme>(themes[0]);

  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    settings.whatsapp_message ||
      'Halo Taman San Jaya, saya ingin konsultasi mengenai perencanaan & pembuatan taman.'
  )}`;

  return (
    <section id="home" className="w-full pt-2 sm:pt-4 pb-0 flex flex-col justify-between overflow-hidden relative">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12">
        {/* ===================================================================== */}
        {/* UPPER HERO STAGE: Full Viewport Opening Fold with Scroll Parallax     */}
        {/* ===================================================================== */}
        <motion.div
          style={{ y: heroParallax, opacity: heroOpacity }}
          className="min-h-[calc(100vh-6.5rem)] flex flex-col justify-between"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1 my-auto">
            {/* ----------------------------------------------------------------- */}
            {/* Left Column: Narrative, Credibility & High-Converting CTA Suite   */}
            {/* ----------------------------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex flex-col justify-center"
            >
              {/* Kicker Badge with Kanji & IPB University Heritage */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-brand-earth/15 text-brand-earth text-xs font-bold tracking-wide shadow-xs mb-4 sm:mb-5 self-start">
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
              </div>

            {/* Editorial Architectural Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] xl:text-[58px] font-black text-brand-earth tracking-tight leading-[1.14]">
              Wujudkan{' '}
              <span className="text-brand-crimson font-serif italic font-bold">
                Taman Tropis Asri
              </span>{' '}
              & Bernilai Estetika Tinggi
            </h1>

            {/* Subtitle / Value Proposition */}
            <p className="mt-4 sm:mt-5 text-brand-earth/85 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-normal">
              {settings.hero_subtitle}
            </p>

            {/* Action Buttons (Primary WhatsApp + Secondary Catalog) */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              <motion.a
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-brand-crimson hover:bg-brand-crimson-hover text-white font-bold text-base px-7 py-4 rounded-2xl shadow-xl shadow-brand-crimson/25 transition-all group"
              >
                <MessageCircle className="w-5 h-5 fill-white text-brand-crimson transition-transform group-hover:rotate-12" />
                <span>Konsultasi Desain (WhatsApp)</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                href="#catalog"
                className="inline-flex items-center justify-center gap-2.5 bg-white/70 hover:bg-white text-brand-earth font-semibold text-base px-6 py-4 rounded-2xl border border-brand-earth/20 shadow-sm backdrop-blur-md transition-all hover:border-brand-crimson/40"
              >
                <Sparkles className="w-4 h-4 text-brand-navy" />
                <span>Katalog Tanaman Hias</span>
              </motion.a>
            </div>

            {/* Micro Trust & Social Proof Row */}
            <div className="mt-7 pt-5 border-t border-brand-earth/15 flex flex-wrap items-center gap-y-2 gap-x-5 sm:gap-x-7 text-xs sm:text-sm text-brand-earth/90">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-600">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i} className="text-sm font-bold">
                      ★
                    </span>
                  ))}
                </div>
                <span className="font-extrabold text-brand-earth">4.9/5</span>
                <span className="text-brand-earth/65">(120+ Klien)</span>
              </div>

              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-brand-crimson flex-shrink-0" />
                <span>Garansi Tumbuh 100%</span>
              </div>

              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-brand-navy flex-shrink-0" />
                <span>Survei & Estimasi RAB Gratis</span>
              </div>
            </div>
          </motion.div>

          {/* ----------------------------------------------------------------- */}
          {/* Right Column: Visual Stage with Interactive Showcase Card         */}
          {/* ----------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col gap-3.5"
          >
            {/* Main Showcase Frame */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[14/11] lg:aspect-[1/1] xl:aspect-[14/12] rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl border-2 border-white/50 group bg-brand-sand-dark/20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTheme.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeTheme.imageUrl}
                    alt={activeTheme.name}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                  {/* Gentle Cinematic Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />
                </motion.div>
              </AnimatePresence>

              {/* Top Floating Badge: Location & Project Tag */}
              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 right-4 sm:right-5 flex items-center justify-between pointer-events-none">
                <span className="inline-flex items-center gap-1.5 bg-brand-crimson/95 text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-brand-sand" />
                  {activeTheme.badge}
                </span>

                <div className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-brand-earth text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-brand-navy" />
                  <span className="truncate max-w-[140px] sm:max-w-none">
                    {activeTheme.location}
                  </span>
                </div>
              </div>

              {/* Bottom Floating Info Pill */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 bg-black/55 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold truncate">
                      {activeTheme.name}
                    </p>
                    <p className="text-[11px] sm:text-xs text-white/80 truncate">
                      {activeTheme.tagline}
                    </p>
                  </div>
                </div>

                <a
                  href="#project"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-brand-sand hover:text-white transition-colors flex-shrink-0 bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20"
                >
                  <span>Lihat Hasil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Interactive Landscape Theme Switcher (Mini Tabs) */}
            <div className="bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-brand-earth/15 flex items-center justify-between gap-1 shadow-xs">
              {themes.map((theme) => {
                const Icon = theme.icon;
                const isActive = activeTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-earth text-white shadow-sm'
                        : 'text-brand-earth/80 hover:text-brand-earth hover:bg-white/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-sand' : 'text-brand-earth/60'}`} />
                    <span className="truncate">{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Cinematic Scroll Indicator at bottom of the full-screen fold */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="pt-4 pb-2 flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer group select-none self-center"
          onClick={() => {
            document.getElementById('service')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.28em] uppercase text-brand-earth/70 group-hover:text-brand-crimson transition-colors">
            Gulir untuk Menjelajah
          </span>
          <div className="w-5 h-8 sm:w-6 sm:h-9 rounded-full border-2 border-brand-earth/30 flex items-start justify-center p-1 group-hover:border-brand-crimson transition-colors shadow-xs">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-brand-crimson"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>

      {/* ===================================================================== */}
      {/* FULL-WIDTH NATURAL GARDEN SECTION DIVIDER: Group 1 SVG                */}
      {/* Tepat di bawah "Gulir untuk Menjelajah", membentang penuh kanan-kiri  */}
      {/* ===================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative -mt-2 sm:-mt-4 pointer-events-none select-none z-10"
      >
        <img
          src="/images/group-1.svg"
          alt="Pembatas Taman San Jaya - Ornamen Batuan & Bunga Alami"
          className="w-full h-auto block drop-shadow-[0_12px_24px_rgba(92,64,51,0.18)]"
        />
      </motion.div>
    </section>
  );
}
