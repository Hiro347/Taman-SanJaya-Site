'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageCircle, Sprout, ShieldCheck, Ruler, ArrowUpRight } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface HeroSectionProps {
  settings: SiteSettings;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    settings.whatsapp_message || 'Halo Taman San Jaya, saya ingin konsultasi mengenai pembuatan taman.'
  )}`;

  return (
    <section id="home" className="w-full px-4 sm:px-8 lg:px-12 pt-2 pb-12 sm:pb-16">
      {/* Centered Hero Image Frame matching Figma mockup */}
      <div className="max-w-5xl lg:max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/10] max-h-[580px] rounded-2xl sm:rounded-[32px] overflow-hidden shadow-xl border border-black/10 group"
        >
          <Image
            src={settings.hero_image_url}
            alt="Taman San Jaya Landscape Design"
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-brand-earth text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-crimson" />
              Garansi Tumbuh
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-brand-earth text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              <Ruler className="w-3.5 h-3.5 text-brand-navy" />
              Survei Lokasi
            </span>
          </div>
        </motion.div>
      </div>

      {/* Narrative & High-Converting CTA Box */}
      <div className="mt-8 sm:mt-12 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block text-xs uppercase tracking-widest font-extrabold text-brand-crimson bg-white/80 px-3.5 py-1 rounded-full mb-3 shadow-xs">
              Jasa Landscape & Tanaman Hias Berkualitas
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-brand-earth leading-tight">
              {settings.hero_title}
            </h1>
            <p className="mt-3 sm:mt-4 text-brand-earth/85 text-base sm:text-lg leading-relaxed max-w-3xl">
              {settings.hero_subtitle}
            </p>
          </motion.div>
        </div>

        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 justify-end">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-brand-crimson hover:bg-brand-crimson-hover text-white font-bold text-sm sm:text-base px-6 py-4 rounded-2xl shadow-lg transition-colors group"
          >
            <MessageCircle className="w-5 h-5 text-white animate-pulse" />
            <span>Konsultasi WhatsApp</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#catalog"
            className="inline-flex items-center justify-center gap-2.5 bg-brand-navy hover:bg-brand-navy-dark text-white font-semibold text-sm sm:text-base px-6 py-4 rounded-2xl shadow-md transition-colors"
          >
            <Sprout className="w-5 h-5 text-brand-sand" />
            <span>Lihat Katalog Tanaman</span>
          </motion.a>
        </div>
      </div>

      {/* Quick Highlights / Trust Bar */}
      <div className="mt-8 sm:mt-10 pt-6 border-t border-brand-earth/15 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-brand-earth">
        <div className="flex flex-col">
          <span className="font-extrabold text-2xl sm:text-3xl text-brand-crimson">10+</span>
          <span className="text-xs sm:text-sm text-brand-earth/80 font-medium">Tahun Pengalaman</span>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-2xl sm:text-3xl text-brand-navy">350+</span>
          <span className="text-xs sm:text-sm text-brand-earth/80 font-medium">Proyek Taman Selesai</span>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-2xl sm:text-3xl text-brand-earth">100%</span>
          <span className="text-xs sm:text-sm text-brand-earth/80 font-medium">Tanaman Pilihan Segar</span>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-2xl sm:text-3xl text-brand-crimson">Free</span>
          <span className="text-xs sm:text-sm text-brand-earth/80 font-medium">Konsultasi Awal & Survei</span>
        </div>
      </div>
    </section>
  );
}
