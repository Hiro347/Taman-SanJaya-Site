'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  MessageCircle,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface HeroSectionProps {
  settings: SiteSettings;
}

const heroSlides = [
  {
    id: 1,
    title: 'Taman Tropis Asri & Gazebo Santai',
    category: 'Taman Tropis Modern',
    location: 'Hunian Residensial Jakarta & Bogor',
    image: '/images/hero-garden.jpg',
  },
  {
    id: 2,
    title: 'Kolam Ikan Koi Minimalis & Tebing Andesit',
    category: 'Kolam Koi Modern',
    location: 'BSD City, Tangerang',
    image: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 3,
    title: 'Hamparan Rumput Hijau & Pohon Peneduh',
    category: 'Lanskap Hunian Privat',
    location: 'Sentul City & Puncak',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 4,
    title: 'Zen Garden Kering & Koral Putih Alami',
    category: 'Taman Gaya Jepang',
    location: 'Menteng, Jakarta Pusat',
    image: 'https://images.unsplash.com/photo-1558904541-efa8c4a5c963?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 5,
    title: 'Vertical Garden Tropis & Irigasi Otomatis',
    category: 'Living Green Wall',
    location: 'Area Komersial & Rooftop',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
  },
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    zIndex: 0,
    x: dir < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

export default function HeroSection({ settings }: HeroSectionProps) {
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, 30]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance sideways every 4.5 seconds unless hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [currentIndex, isHovered]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    settings.whatsapp_message ||
      'Halo Taman San Jaya, saya ingin konsultasi mengenai perencanaan & pembuatan taman.'
  )}`;

  return (
    <section id="home" className="w-full pt-4 sm:pt-6 lg:pt-8 pb-0 flex flex-col justify-between overflow-hidden relative">
      <div className="max-w-6xl mx-auto w-full px-3 sm:px-6 lg:px-8">
        <motion.div
          style={{ y: heroParallax }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden shadow-2xl border-2 border-white/60 bg-black/40 ring-1 ring-brand-earth/15 group min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex flex-col justify-between p-5 sm:p-8 lg:p-12"
        >
          {/* ================================================================= */}
          {/* 1. BACKGROUND SLIDING IMAGES (BERGANTI KE SAMPING OTOMATIS)       */}
          {/* ================================================================= */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 260, damping: 26 },
                  opacity: { duration: 0.4 },
                }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={heroSlides[currentIndex].image}
                  alt={heroSlides[currentIndex].title}
                  className="w-full h-full object-cover object-center scale-[1.02] transition-transform duration-1000"
                />
              </motion.div>
            </AnimatePresence>

            {/* Cinematic Gradient Scrim for crisp text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/60 z-[1]" />
          </div>

          {/* ================================================================= */}
          {/* 2. TOP BAR OVERLAY: BADGE KREDENSIAL BRAND                         */}
          {/* ================================================================= */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-brand-sand text-xs font-bold tracking-widest uppercase shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-brand-crimson font-black">成功之园</span>
              <span className="text-white/30">•</span>
              <span className="text-white/90">Proteksi Tanaman IPB</span>
            </div>

            {/* Slide Counter Badge */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/15">
              <span className="text-brand-crimson font-black">0{currentIndex + 1}</span>
              <span className="text-white/40">/</span>
              <span>0{heroSlides.length}</span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 3. CENTER CONTENT: TAMAN SAN JAYA + SLOGAN SINGKAT PENDUKUNG      */}
          {/* ================================================================= */}
          <div className="relative z-10 flex flex-col items-center text-center my-auto py-6 sm:py-8 max-w-4xl mx-auto">
            {/* Main Brand Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-wider leading-[1.08] drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)] uppercase font-sans"
            >
              TAMAN SAN JAYA
            </motion.h1>

            {/* Slogan Singkat Pendukung Produk */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 sm:mt-3 text-xl sm:text-3xl lg:text-4xl font-serif italic font-bold text-brand-sand drop-shadow-md tracking-wide"
            >
              Taman Tropis Asri & Kolam Koi Impian
            </motion.p>

            {/* Ringkasan Produk Pendukung */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 sm:mt-4 text-white/90 text-xs sm:text-base lg:text-lg max-w-2xl mx-auto font-normal drop-shadow leading-relaxed"
            >
              Spesialis pembuatan taman tropis, kolam koi modern, & tanaman hias berkualitas dengan garansi tumbuh 100%.
            </motion.p>

            {/* Call to Action - Consultation Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 sm:mt-8 flex items-center justify-center w-full"
            >
              <motion.a
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-brand-crimson hover:bg-brand-crimson-hover text-white font-bold text-sm sm:text-base lg:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-full shadow-2xl shadow-brand-crimson/50 border border-white/20 transition-all group"
              >
                <MessageCircle className="w-5 h-5 fill-white text-brand-crimson transition-transform group-hover:rotate-12" />
                <span>Konsultasi Sekarang</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </motion.a>
            </motion.div>
          </div>

          {/* ================================================================= */}
          {/* 4. BOTTOM BAR: INFORMASI SLIDE AKTIF & PAGINATION DOTS            */}
          {/* ================================================================= */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-white/15 text-white">
            {/* Info Produk/Lanskap Aktif */}
            <div className="flex items-center gap-2 text-left">
              <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-brand-crimson/95 backdrop-blur-md text-white shadow-sm">
                {heroSlides[currentIndex].category}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-white/85 backdrop-blur-md bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                <MapPin className="w-3 h-3 text-brand-sand" />
                {heroSlides[currentIndex].location}
              </span>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Lihat Foto ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-7 bg-brand-crimson'
                      : 'w-2 bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ================================================================= */}
          {/* 5. SIDE NAVIGATION ARROWS (MANUAL SLIDE)                          */}
          {/* ================================================================= */}
          <button
            onClick={() => paginate(-1)}
            aria-label="Foto Sebelumnya"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={() => paginate(1)}
            aria-label="Foto Berikutnya"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </motion.div>
      </div>

      {/* ===================================================================== */}
      {/* FULL-WIDTH NATURAL GARDEN SECTION DIVIDER: Group 1 SVG                */}
      {/* Membentang penuh di bagian dasar sebagai lantai transisi taman alami  */}
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
