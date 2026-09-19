'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Images, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from '@/components/MarketplaceIcons';
import { Project, SiteSettings } from '@/lib/types';

interface ProjectSectionProps {
  projects: Project[];
  settings?: SiteSettings;
}

export default function ProjectSection({ projects, settings }: ProjectSectionProps) {
  return (
    <section id="project" className="pt-0 sm:pt-2 pb-2 sm:pb-4 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-earth tracking-tight">
          Proyek Kami
        </h2>
        <span className="block text-sm sm:text-base font-medium text-brand-earth/70 tracking-[0.2em] uppercase mt-1">
          我们项目
        </span>
      </div>

      {/* Projects Grid or Concept 2: Skeleton Silhouette & Coming Soon Showcase */}
      {projects.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Showcase Card 1: Masterplan & Desain 3D */}
          <div className="border-2 border-dashed border-brand-earth/30 bg-white/75 backdrop-blur-md rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group">
            {/* Top Meta */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/25">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Koleksi Baru Dalam Kurasi</span>
                </span>
                <span className="text-[11px] font-bold text-brand-earth/60 font-mono uppercase tracking-wider">
                  Showcase #01
                </span>
              </div>

              {/* Blueprint Illustration Window */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[21/10] rounded-xl overflow-hidden bg-brand-sand/30 border border-brand-sand-dark/40 flex flex-col items-center justify-center p-6 text-center mb-5">
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#5C4033 1.5px, transparent 1.5px)',
                    backgroundSize: '18px 18px',
                  }}
                />
                
                <div className="relative z-10 w-12 h-12 rounded-full bg-white shadow-sm border border-brand-sand-dark/40 flex items-center justify-center text-brand-navy mb-2.5">
                  <Compass className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
                </div>
                <span className="relative z-10 text-xs font-extrabold text-brand-earth tracking-wide uppercase">
                  Masterplan &amp; 3D Landscape Rendering
                </span>
                <span className="relative z-10 text-[11px] text-brand-earth/70 font-medium mt-0.5">
                  Dokumentasi Foto Lapangan Sedang Dipersiapkan
                </span>
              </div>

              {/* Text & Content */}
              <div className="flex items-center gap-1.5 text-xs text-brand-navy font-bold mb-1.5">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Jabodetabek &amp; Kawasan Residensial</span>
              </div>
              <h3 className="font-extrabold text-xl sm:text-2xl text-brand-earth leading-snug">
                Rancangan Desain 3D &amp; Tata Hijau Hunian Tropis
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-brand-earth/80 leading-relaxed">
                Kami tengah memproses galeri dokumentasi foto fotorealistis untuk proyek perencanaan lanskap kawasan terbaru. Ingin mulai merancang konsep taman impian Anda?
              </p>
            </div>

            {/* Bottom CTA Button */}
            <div className="mt-6 pt-4 border-t border-brand-earth/10 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-[11px] text-brand-earth/70 font-semibold">
                Rancangan 2D &amp; 3D Custom
              </span>
              <a
                href={`https://wa.me/${settings?.whatsapp_number || '6282110998588'}?text=${encodeURIComponent(
                  'Halo Taman San Jaya, saya tertarik untuk konsultasi mengenai rancangan konsep taman lanskap hunian.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-crimson hover:bg-brand-crimson-hover active:scale-[0.98] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Konsultasi Konsep Lanskap</span>
              </a>
            </div>
          </div>

          {/* Showcase Card 2: Konstruksi & Pengerjaan Riil */}
          <div className="border-2 border-dashed border-brand-earth/30 bg-white/75 backdrop-blur-md rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group">
            {/* Top Meta */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-navy/10 text-brand-navy border border-brand-navy/25">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Eksekusi Lapangan &amp; Garansi 100%</span>
                </span>
                <span className="text-[11px] font-bold text-brand-earth/60 font-mono uppercase tracking-wider">
                  Showcase #02
                </span>
              </div>

              {/* Blueprint Illustration Window */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[21/10] rounded-xl overflow-hidden bg-brand-sand/30 border border-brand-sand-dark/40 flex flex-col items-center justify-center p-6 text-center mb-5">
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#5C4033 1.5px, transparent 1.5px)',
                    backgroundSize: '18px 18px',
                  }}
                />

                <div className="relative z-10 w-12 h-12 rounded-full bg-white shadow-sm border border-brand-sand-dark/40 flex items-center justify-center text-brand-crimson mb-2.5">
                  <Images className="w-6 h-6" />
                </div>
                <span className="relative z-10 text-xs font-extrabold text-brand-earth tracking-wide uppercase">
                  Pembuatan Lanskap &amp; Relief Batu Alam
                </span>
                <span className="relative z-10 text-[11px] text-brand-earth/70 font-medium mt-0.5">
                  Eksekusi Fisik Tanaman &amp; Hardscaping Berkala
                </span>
              </div>

              {/* Text & Content */}
              <div className="flex items-center gap-1.5 text-xs text-brand-navy font-bold mb-1.5">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Hunian Privat, Villa &amp; Area Komersial</span>
              </div>
              <h3 className="font-extrabold text-xl sm:text-2xl text-brand-earth leading-snug">
                Pengerjaan Taman Tropis, Tebing Alami &amp; Rumput Sehat
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-brand-earth/80 leading-relaxed">
                Pengerjaan fisik meliputi seleksi bibit bergaransi tumbuh 100% IPB University, pengolahan lahan, dan pembuatan ornamen air mancur relief batu alam alami.
              </p>
            </div>

            {/* Bottom CTA Button */}
            <div className="mt-6 pt-4 border-t border-brand-earth/10 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-[11px] text-brand-earth/70 font-semibold">
                Survei Lokasi &amp; Estimasi Biaya
              </span>
              <a
                href={`https://wa.me/${settings?.whatsapp_number || '6282110998588'}?text=${encodeURIComponent(
                  'Halo Taman San Jaya, saya ingin menjadwalkan survei lahan untuk pembuatan/renovasi taman.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-navy-dark active:scale-[0.98] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Jadwalkan Survei Lokasi</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project, index) => {
            const isFeatured = index === 0;
            const galleryCount = (project.gallery_images?.length || 0) + (project.image_url ? 1 : 0);

            return (
              <motion.div
                key={project.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-brand-earth/15 shadow-sm hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between h-full ${
                  isFeatured ? 'md:col-span-2' : ''
                }`}
              >
                {/* Image Container with Zoom Effect - Pencet Foto Langsung Masuk ke Tab Proyek */}
                <Link
                  href={`/proyek/${project.slug || project.id}`}
                  aria-label={`Buka detail dan galeri proyek ${project.title}`}
                  className={`block relative w-full overflow-hidden bg-brand-sand/20 cursor-pointer ${
                    isFeatured
                      ? 'aspect-[16/10] sm:aspect-[21/10] md:max-h-[440px]'
                      : 'aspect-[16/10] sm:aspect-[16/10]'
                  }`}
                >
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    sizes={isFeatured ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
                    priority={isFeatured}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Subtle dark vignette on hover (pointer-events-none agar klik foto tidak terhalang) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

                  {/* Project Index Number */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-white text-xs font-mono font-bold tracking-wider border border-white/20 pointer-events-none">
                    0{index + 1}
                  </div>

                  {/* Gallery photo count badge on hover/display */}
                  <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-white text-xs font-medium tracking-wide border border-white/20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Images className="w-3.5 h-3.5" />
                    <span>{galleryCount > 1 ? `${galleryCount} Foto` : 'Lihat Detail'}</span>
                  </div>
                </Link>

                {/* Project Details */}
                <div className="p-5 sm:p-7 flex flex-col justify-between flex-1">
                  <div>
                    {/* Category & Location Meta */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-brand-crimson text-white">
                        {project.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-brand-earth/70">
                        <MapPin className="w-3.5 h-3.5 text-brand-earth/80 flex-shrink-0" />
                        <span>{project.location}</span>
                      </span>
                    </div>

                    {/* Title - Juga dapat diklik menuju detail proyek */}
                    <h3
                      className={`font-black text-brand-earth leading-snug tracking-tight ${
                        isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                      }`}
                    >
                      <Link
                        href={`/proyek/${project.slug || project.id}`}
                        className="hover:text-brand-crimson transition-colors duration-200"
                      >
                        {project.title}
                      </Link>
                    </h3>

                    {/* Description */}
                    <p className="mt-2.5 text-brand-earth/90 text-sm sm:text-base leading-relaxed font-medium line-clamp-3 sm:line-clamp-none">
                      {project.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}

