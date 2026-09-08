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
    <section id="about" className="py-16 sm:py-20 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Brand Story Box with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-brand-earth text-white rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-brand-sand font-bold text-xs sm:text-sm tracking-widest uppercase mb-3">
              <span>Tentang Taman San Jaya</span>
              <span>•</span>
              <span className="font-serif italic text-base text-brand-crimson-light">成功之园</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white">
              Menghadirkan Ketenangan Alam di Tengah Kesibukan Modern
            </h2>

            <p className="mt-5 text-white/85 text-base sm:text-lg leading-relaxed font-normal">
              <strong>Taman San Jaya</strong> didirikan dengan filosofi bahwa taman bukan sekadar deretan tanaman hijau, melainkan ruang bernapas, tempat memulihkan energi, dan simbol kemakmuran serta keharmonisan bagi setiap pemiliknya.
            </p>

            <p className="mt-3 text-white/80 text-base sm:text-lg leading-relaxed font-normal">
              Diinisiasi oleh <strong>Ergoputra Kusuma Sanjaya</strong> dengan latar belakang keilmuan <strong>Proteksi Tanaman IPB University</strong>, kami memadukan estetika arsitektur lanskap dengan riset kesehatan biologis tanaman agar setiap karya hijau tumbuh subur, tahan hama, dan bergaransi hidup.
            </p>

            {/* Pillar Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <ShieldCheck className="w-6 h-6 text-brand-sand flex-shrink-0" />
                <span className="text-sm font-semibold">Garansi Tumbuh Tanaman</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <HeartHandshake className="w-6 h-6 text-brand-sand flex-shrink-0" />
                <span className="text-sm font-semibold">Survei & Konsultasi Ramah</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <Award className="w-6 h-6 text-brand-sand flex-shrink-0" />
                <span className="text-sm font-semibold">Tanaman Kualitas Nursery A</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <Clock className="w-6 h-6 text-brand-sand flex-shrink-0" />
                <span className="text-sm font-semibold">Pengerjaan Disiplin & Rapi</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative w-full max-w-sm aspect-[4/5] rounded-[32px] overflow-hidden border-4 border-brand-sand/40 shadow-2xl group"
            >
              <Image
                src="/images/founder.jpg"
                alt="Ergoputra Kusuma Sanjaya - Founder Taman San Jaya"
                fill
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-earth/95 via-black/30 to-transparent flex flex-col justify-end p-6">
                <span className="text-brand-sand text-xs font-bold tracking-wider uppercase">Founder & Horticulturalist</span>
                <p className="text-white text-lg font-black mt-0.5">Ergoputra Kusuma Sanjaya</p>
                <p className="text-white/80 text-xs mt-0.5">Departemen Proteksi Tanaman • IPB University</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
