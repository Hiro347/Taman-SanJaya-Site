'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, HeartHandshake, Award, Clock, ArrowRight } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface AboutSectionProps {
  settings: SiteSettings;
}

export default function AboutSection({ settings }: AboutSectionProps) {
  return (
    <section id="about" className="pt-6 sm:pt-14 pb-2 sm:pb-4 px-2 sm:px-6 max-w-7xl mx-auto">
      {/* Brand Story Box with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '150px 0px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-brand-earth text-white rounded-[24px] sm:rounded-[44px] p-5 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3.5 mb-3 sm:mb-4">
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
              <strong>Taman San Jaya</strong> didirikan dengan filosofi bahwa taman bukan sekadar deretan tanaman hijau, melainkan ruang bernapas, tempat memulihkan energi, dan simbol kemakmuran serta keharmonisan bagi setiap pemiliknya.
            </p>

            <p className="mt-2 sm:mt-3 text-white/80 text-xs sm:text-lg leading-relaxed font-normal">
              Diinisiasi oleh <strong>Ergoputra Kusuma Sanjaya</strong> dengan latar belakang keilmuan <strong>Proteksi Tanaman IPB University</strong>, kami memadukan estetika arsitektur lanskap dengan riset kesehatan biologis tanaman agar setiap karya hijau tumbuh subur, tahan hama, dan bergaransi hidup.
            </p>

            {/* Pillar Grid - 2 Kolom Kompak di Mobile */}
            <div className="mt-4 sm:mt-8 grid grid-cols-2 gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6 text-brand-sand flex-shrink-0" />
                <span className="text-[11px] sm:text-sm font-semibold leading-tight">Garansi Tumbuh Tanaman</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <HeartHandshake className="w-4 h-4 sm:w-6 sm:h-6 text-brand-sand flex-shrink-0" />
                <span className="text-[11px] sm:text-sm font-semibold leading-tight">Survei & Konsultasi Ramah</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <Award className="w-4 h-4 sm:w-6 sm:h-6 text-brand-sand flex-shrink-0" />
                <span className="text-[11px] sm:text-sm font-semibold leading-tight">Kualitas Nursery A</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-brand-sand flex-shrink-0" />
                <span className="text-[11px] sm:text-sm font-semibold leading-tight">Pengerjaan Disiplin</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative w-full max-w-[280px] sm:max-w-sm aspect-[4/3] sm:aspect-[4/5] rounded-2xl sm:rounded-[32px] overflow-hidden border-2 sm:border-4 border-brand-sand/40 shadow-2xl group"
            >
              <Image
                src="/images/founder.jpg"
                alt="Ergoputra Kusuma Sanjaya - Founder Taman San Jaya"
                fill
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-earth/95 via-black/30 to-transparent flex flex-col justify-end p-3.5 sm:p-6">
                <span className="text-brand-sand text-[10px] sm:text-xs font-bold tracking-wider uppercase">Founder & Horticulturalist</span>
                <p className="text-white text-sm sm:text-lg font-black mt-0.5">Ergoputra Kusuma Sanjaya</p>
                <p className="text-white/80 text-[10px] sm:text-xs mt-0.5">Departemen Proteksi Tanaman • IPB University</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
