'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  MessageCircle,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
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
  const heroParallax = useTransform(scrollY, [0, 500], [0, 25]);

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
    <section id="home" className="w-full pt-0 sm:pt-1 pb-0 flex flex-col justify-between overflow-hidden relative">
      {/* Container diperlebar maksimal melintasi kanvas */}
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <motion.div
          style={{ y: heroParallax }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden shadow-2xl border-2 border-white/60 bg-black/40 ring-1 ring-brand-earth/15 group min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] flex flex-col justify-between p-4 sm:p-6 lg:p-8"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/55 z-[1]" />
          </div>

          {/* ================================================================= */}
          {/* 2. TOP BAR: HANYA SLIDE COUNTER DI KANAN ATAS                      */}
          {/* ================================================================= */}
          <div className="relative z-10 flex items-center justify-end w-full">
            {/* Slide Counter Badge */}
            <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/15">
              <span className="text-brand-crimson font-black">0{currentIndex + 1}</span>
              <span className="text-white/40">/</span>
              <span>0{heroSlides.length}</span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 3. CENTER CONTENT: TAMAN SAN JAYA + SLOGAN SINGKAT PENDUKUNG      */}
          {/* ================================================================= */}
          <div className="relative z-10 flex flex-col items-center text-center my-auto py-2 sm:py-4 max-w-4xl mx-auto">
            {/* Main Brand Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-wider leading-[1.08] drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)] uppercase font-sans"
            >
              TAMAN SAN JAYA
            </motion.h1>

            {/* Slogan Singkat Pendukung Produk */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="mt-1 sm:mt-1.5 text-base sm:text-2xl lg:text-3xl font-serif italic font-bold text-brand-sand drop-shadow-md tracking-wide"
            >
              Taman Tropis Asri & Kolam Koi Impian
            </motion.p>

            {/* Ringkasan Produk Pendukung */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 sm:mt-2.5 text-white/90 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto font-normal drop-shadow leading-relaxed"
            >
              Spesialis pembuatan taman tropis, kolam koi modern, & tanaman hias berkualitas dengan garansi tumbuh 100%.
            </motion.p>

            {/* Call to Action - Consultation Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 sm:mt-6 flex items-center justify-center w-full"
            >
              <motion.a
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-brand-crimson hover:bg-brand-crimson-hover text-white font-bold text-xs sm:text-sm lg:text-base px-7 sm:px-9 py-2.5 sm:py-3.5 rounded-full shadow-2xl shadow-brand-crimson/50 border border-white/20 transition-all group"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-brand-crimson transition-transform group-hover:rotate-12" />
                <span>Konsultasi Sekarang</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </motion.a>
            </motion.div>
          </div>

          {/* ================================================================= */}
          {/* 4. BOTTOM BAR: INFORMASI SLIDE AKTIF & PAGINATION DOTS            */}
          {/* ================================================================= */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 sm:pt-3 border-t border-white/15 text-white">
            {/* Info Produk/Lanskap Aktif */}
            <div className="flex items-center gap-2 text-left">
              <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-brand-crimson/95 backdrop-blur-md text-white shadow-sm">
                {heroSlides[currentIndex].category}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] sm:text-xs text-white/85 backdrop-blur-md bg-black/40 px-2.5 py-0.5 rounded-full border border-white/10">
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
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => paginate(1)}
            aria-label="Foto Berikutnya"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* ===================================================================== */}
      {/* FULL-WIDTH NATURAL GARDEN SECTION DIVIDER: Group 1 SVG                */}
      {/* Dinaikkan agar langsung terlihat jelas tepat di bawah gambar panggung */}
      {/* ===================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative -mt-6 sm:-mt-10 lg:-mt-14 pointer-events-none select-none z-10"
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
