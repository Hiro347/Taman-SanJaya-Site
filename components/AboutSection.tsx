'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, HeartHandshake, Award, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { SiteSettings, Documentation } from '@/lib/types';

interface AboutSectionProps {
  settings: SiteSettings;
  documentations?: Documentation[];
}

export default function AboutSection({ settings, documentations = [] }: AboutSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [documentations]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  return (
    <section id="about" className="pt-6 sm:pt-14 pb-2 sm:pb-4 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Brand Story Box with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '150px 0px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-brand-earth text-white rounded-2xl sm:rounded-3xl p-5 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-white/10"
      >
        {/* Mobile Header: Tampil di paling atas khusus mobile sebelum foto founder */}
        <div className="lg:hidden flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3.5 mb-4 sm:mb-6">
          <span className="text-brand-sand font-bold text-[11px] sm:text-sm tracking-widest uppercase">
            Tentang
          </span>
          <span className="hidden sm:inline text-brand-sand/40">•</span>
          <div className="flex flex-col">
            <span className="font-serif italic font-bold tracking-wider text-white text-base sm:text-xl leading-tight">
              TAMAN SAN JAYA
            </span>
            <span className="text-[11px] sm:text-[13px] tracking-widest text-brand-sand font-medium font-sans">
              成功之园
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            {/* Desktop Header: Hanya tampil di layar lg ke atas */}
            <div className="hidden lg:flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3.5 mb-3 sm:mb-4">
              <span className="text-brand-sand font-bold text-[11px] sm:text-sm tracking-widest uppercase">
                Tentang
              </span>
              <span className="hidden sm:inline text-brand-sand/40">•</span>
              <div className="flex flex-col">
                <span className="font-serif italic font-bold tracking-wider text-white text-base sm:text-xl lg:text-2xl leading-tight">
                  TAMAN SAN JAYA
                </span>
                <span className="text-[11px] sm:text-[13px] tracking-widest text-brand-sand font-medium font-sans">
                  成功之园
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-4xl lg:text-5xl font-black leading-snug sm:leading-tight text-white">
              Menghadirkan Ketenangan Alam di Tengah Kesibukan Modern
            </h2>

            <p className="mt-3 sm:mt-5 text-white/85 text-xs sm:text-lg leading-relaxed font-normal">
              <strong>Taman San Jaya</strong> berdiri bersama para pembudidaya lokal, tenaga ahli, dan desainer lanskap untuk menciptakan taman yang harmonis, berkelanjutan, dan bermakna. Setiap rancangan memadukan keindahan alam, ketepatan penataan ruang, serta prinsip feng shui agar menghadirkan keseimbangan visual dan energi yang selaras.
            </p>

            <p className="mt-2 sm:mt-3 text-white/80 text-xs sm:text-lg leading-relaxed font-normal">
              <strong>Ergoputra Kusuma Sanjaya</strong>, founder Taman San Jaya, memiliki latar belakang Fitopatologi dan Pengendalian Terpadu. Berlandaskan pendekatan ilmiah terhadap kesehatan tanaman dan filosofi lanskap oriental, ia memiliki visi menghadirkan taman yang tidak hanya indah dipandang, tetapi juga memberi ketenangan, keharmonisan, dan nilai yang bertahan sepanjang waktu.
            </p>

            {/* Pillar Grid - 2 Kolom Kompak di Mobile */}
            <div className="mt-4 sm:mt-8 grid grid-cols-2 gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6 text-brand-sand flex-shrink-0" />
                <span className="text-[11px] sm:text-sm font-semibold leading-tight">Garansi Tumbuh Tanaman</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <HeartHandshake className="w-4 h-4 sm:w-6 sm:h-6 text-brand-sand flex-shrink-0" />
                <span className="text-[11px] sm:text-sm font-semibold leading-tight">Survei & Konsultasi Ramah</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <Award className="w-4 h-4 sm:w-6 sm:h-6 text-brand-sand flex-shrink-0" />
                <span className="text-[11px] sm:text-sm font-semibold leading-tight">Kualitas Nursery A</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-brand-sand flex-shrink-0" />
                <span className="text-[11px] sm:text-sm font-semibold leading-tight">Pengerjaan Disiplin</span>
              </div>
            </div>
          </div>

          {/* Photo Founder: order-1 on mobile, order-2 on desktop */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative w-full max-w-[210px] sm:max-w-[250px] lg:max-w-sm aspect-[4/5] rounded-2xl overflow-hidden border-2 sm:border-4 border-brand-sand/40 shadow-2xl group"
            >
              <Image
                src="/images/founder.jpg"
                alt="Ergoputra Kusuma Sanjaya - Founder Taman San Jaya"
                fill
                sizes="(max-width: 640px) 210px, (max-width: 1024px) 250px, 384px"
                className="object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-earth/95 via-black/20 to-transparent flex flex-col justify-end p-3.5 sm:p-5 lg:p-6">
                <span className="text-brand-sand text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                  Founder & Horticulturalist
                </span>
                <p className="text-white text-sm sm:text-base lg:text-lg font-black mt-0.5">
                  Ergoputra Kusuma Sanjaya
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ===================================================================== */}
      {/* 2. ACTIVITY & BEHIND-THE-SCENES DOCUMENTATION (SWIPEABLE CAROUSEL)    */}
      {/* ===================================================================== */}
      <div className="mt-10 sm:mt-14 lg:mt-20">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] sm:text-xs font-bold tracking-widest text-brand-crimson uppercase">
                Aktivitas &amp; Di Balik Layar
              </span>
              <span className="text-brand-earth/40">•</span>
              <span className="text-[11px] sm:text-xs font-medium tracking-widest text-brand-earth/60 font-sans">
                真实记录
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-earth tracking-tight">
              Dedikasi &amp; Proses Ilmiah Lapangan
            </h3>
            <p className="text-xs sm:text-sm text-brand-earth/75 font-medium mt-1.5 max-w-2xl leading-relaxed">
              Dokumentasi nyata kegiatan pembibitan di nursery Bogor, survei kontur lahan, hingga pengerjaan hardscape berstandar proteksi tanaman IPB.
            </p>
          </div>

          {/* Desktop Arrow Navigation Controls */}
          {documentations.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Geser ke kiri"
                className="w-10 h-10 rounded-full border border-brand-earth/20 bg-white/80 hover:bg-white text-brand-earth disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xs active:scale-95 hover:border-brand-crimson/50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Geser ke kanan"
                className="w-10 h-10 rounded-full border border-brand-earth/20 bg-white/80 hover:bg-white text-brand-earth disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xs active:scale-95 hover:border-brand-crimson/50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Content or Clean Upcoming State */}
        {documentations.length === 0 ? (
          <div className="text-center py-16 sm:py-20 flex flex-col items-center justify-center bg-white/40 rounded-2xl border border-brand-earth/10">
            <p className="text-lg sm:text-xl md:text-2xl font-extrabold text-brand-earth tracking-tight">
              Dokumentasi Aktivitas Segera Hadir
            </p>
            <p className="text-xs sm:text-sm md:text-base text-brand-earth/75 font-medium mt-1.5 max-w-md">
              Sedang dalam proses dokumentasi kebun bibit dan aktivitas lapangan.
            </p>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollability}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {documentations.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="w-[280px] xs:w-[320px] sm:w-[360px] lg:w-[390px] flex-shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-brand-earth/15 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Photo Stage (aspect 16:10) */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-brand-sand/30">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 320px, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle dark vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity" />

                  {/* Order Index Counter Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/45 backdrop-blur-md text-white text-[11px] font-mono font-bold border border-white/20 shadow-xs">
                    0{idx + 1}
                  </span>
                </div>

                {/* Content Box */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-brand-earth group-hover:text-brand-crimson transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-brand-earth/80 font-normal leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-brand-earth/10 flex items-center justify-between text-[11px] text-brand-earth/60 font-semibold">
                    <span className="inline-flex items-center gap-1 text-brand-navy">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-navy inline-block" />
                      Dokumentasi Lapangan
                    </span>
                    <span className="font-mono text-[10px] uppercase text-brand-earth/45">
                      TSJ-DOC-0{idx + 1}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
