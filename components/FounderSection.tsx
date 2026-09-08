'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GraduationCap, Award, ShieldCheck, Microscope, Sparkles, MessageCircle, Quote } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface FounderSectionProps {
  settings: SiteSettings;
}

export default function FounderSection({ settings }: FounderSectionProps) {
  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    'Halo Mas Ergoputra Kusuma Sanjaya, saya ingin berkonsultasi mengenai rencana landscape taman dan pemilihan vegetasi.'
  )}`;

  return (
    <section id="founder" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Outer Card with Elevated Editorial Styling */}
      <div className="bg-white rounded-[36px] sm:rounded-[48px] p-6 sm:p-10 lg:p-14 border border-brand-sand-dark/50 shadow-lg relative overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-sand/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Photo of Ergoputra Kusuma Sanjaya */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-sm aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-brand-sand"
            >
              <Image
                src="/images/founder.jpg"
                alt="Ergoputra Kusuma Sanjaya - Founder Taman San Jaya"
                fill
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
                priority
              />

              {/* Floating Badge on Photo */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-white">
                <span className="text-[11px] font-bold text-brand-sand uppercase tracking-wider block">
                  Founder & Landscape Horticulturalist
                </span>
                <span className="text-sm font-black block mt-0.5">
                  Ergoputra Kusuma Sanjaya
                </span>
              </div>
            </motion.div>

            {/* Academic Credential Tag */}
            <div className="mt-5 inline-flex items-center gap-2 bg-brand-sand/50 px-4 py-2 rounded-2xl border border-brand-sand-dark/40 text-brand-earth text-xs font-semibold">
              <GraduationCap className="w-4 h-4 text-brand-crimson" />
              <span>Departemen Proteksi Tanaman • IPB University</span>
            </div>
          </div>

          {/* Right Column: Founder Narrative & Botanical Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-crimson uppercase bg-brand-sand px-4 py-1.5 rounded-full mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                The Mind Behind The Landscape
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-earth tracking-tight leading-tight">
                Sentuhan Ilmiah di Balik Setiap Sudut Hijau
              </h2>
            </div>

            {/* Quote Box */}
            <div className="relative bg-brand-sand/30 p-6 sm:p-7 rounded-3xl border-l-4 border-brand-crimson">
              <Quote className="w-8 h-8 text-brand-crimson/20 absolute top-4 right-4" />
              <p className="italic text-brand-earth/90 text-sm sm:text-base leading-relaxed">
                “Sebuah taman bukan sekadar kumpulan tanaman hias, melainkan ekosistem hidup yang berdialog dengan jiwa penghuninya. Melalui pemahaman ilmiah tentang biologi tanah dan fisiologi tumbuhan, kami memastikan keindahan taman Anda berakar kuat dan lestari.”
              </p>
              <span className="block text-xs font-bold text-brand-earth mt-3">
                — Ergoputra Kusuma Sanjaya
              </span>
            </div>

            {/* Core Botanical Scientific Advantages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FBF9F4] border border-brand-sand-dark/30">
                <div className="flex items-center gap-2.5 text-brand-navy font-bold text-sm mb-1.5">
                  <Microscope className="w-4 h-4 text-brand-crimson" />
                  <span>Diagnosis Patologi Tanaman</span>
                </div>
                <p className="text-xs text-brand-earth/75 leading-relaxed">
                  Analisis struktur tanah, kelembapan, dan pencegahan hama kutu daun atau jamur secara organik sebelum penanaman.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF9F4] border border-brand-sand-dark/30">
                <div className="flex items-center gap-2.5 text-brand-navy font-bold text-sm mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-crimson" />
                  <span>Garansi Tumbuh Berbasis Riset</span>
                </div>
                <p className="text-xs text-brand-earth/75 leading-relaxed">
                  Bukan janji kosong. Setiap bibit dikurasi dari nursery unggulan dengan nutrisi hara yang disesuaikan dengan mikroklimat lahan Anda.
                </p>
              </div>
            </div>

            {/* CTA to Consult directly with founder */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-crimson hover:bg-brand-crimson-hover text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-md transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi Langsung dengan Ergoputra</span>
              </a>

              <span className="text-xs text-brand-earth/60">
                Layanan survei & diskusi konsep tanpa komitmen
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
