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
  const heroParallax = useTransform(scrollY, [0, 500], [0, 30]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.95]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance sideways every 4 seconds unless hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
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
    <section id="home" className="w-full pt-8 sm:pt-14 lg:pt-16 pb-0 flex flex-col justify-between overflow-hidden relative">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
        <motion.div
          style={{ y: heroParallax, opacity: heroOpacity }}
          className="flex flex-col items-center text-center"
        >
          {/* Editorial Clean Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-[68px] xl:text-[74px] font-black text-brand-earth tracking-tight leading-[1.12] max-w-4xl"
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
            className="mt-7 sm:mt-9 flex items-center justify-center w-full"
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

          {/* ================================================================= */}
          {/* AUTOMATIC SIDEWAYS SLIDING IMAGE SHOWCASE CAROUSEL                */}
          {/* ================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-full max-w-5xl mx-auto mt-10 sm:mt-12 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/70 bg-brand-sand/30 ring-1 ring-brand-earth/10 group aspect-[16/10] sm:aspect-[21/10] max-h-[460px]"
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 280, damping: 28 },
                  opacity: { duration: 0.35 },
                }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={heroSlides[currentIndex].image}
                  alt={heroSlides[currentIndex].title}
                  className="w-full h-full object-cover object-center"
                />
                {/* Bottom Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Slide Information Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 lg:p-7 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white pointer-events-none">
                  <div className="flex flex-col gap-1.5 text-left">
                    <div className="inline-flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-brand-crimson/95 backdrop-blur-md text-white shadow-sm">
                        {heroSlides[currentIndex].category}
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1 text-xs text-white/85 backdrop-blur-md bg-black/40 px-2.5 py-0.5 rounded-full border border-white/10">
                        <MapPin className="w-3 h-3 text-brand-sand" />
                        {heroSlides[currentIndex].location}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-white drop-shadow-md">
                      {heroSlides[currentIndex].title}
                    </h3>
                  </div>

                  {/* Counter Badge */}
                  <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/15 self-end">
                    <span className="text-brand-crimson font-black">0{currentIndex + 1}</span>
                    <span className="text-white/40">/</span>
                    <span>0{heroSlides.length}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Left Arrow Navigation Button */}
            <button
              onClick={() => paginate(-1)}
              aria-label="Foto Sebelumnya"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Arrow Navigation Button */}
            <button
              onClick={() => paginate(1)}
              aria-label="Foto Berikutnya"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Bottom Pagination Dots */}
            <div className="absolute bottom-3 sm:bottom-4 right-4 sm:right-6 z-20 flex items-center gap-1.5">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Lihat Slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-7 bg-brand-crimson'
                      : 'w-2 bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </motion.div>
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
