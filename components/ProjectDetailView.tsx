'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Project, SiteSettings } from '@/lib/types';

interface ProjectDetailViewProps {
  project: Project;
  otherProjects: Project[];
  settings: SiteSettings;
}

export default function ProjectDetailView({
  project,
  otherProjects,
  settings,
}: ProjectDetailViewProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/#project');
    }
  };
  // Combine primary image and gallery images into a unique list
  const galleryList = React.useMemo(() => {
    const list: string[] = [];
    if (project.image_url) list.push(project.image_url);
    if (project.gallery_images && Array.isArray(project.gallery_images)) {
      project.gallery_images.forEach((img) => {
        if (img && !list.includes(img)) {
          list.push(img);
        }
      });
    }
    return list.length > 0 ? list : ['/images/proyek-1.jpeg'];
  }, [project]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const handlePrev = React.useCallback(() => {
    setActiveImageIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
  }, [galleryList.length]);

  const handleNext = React.useCallback(() => {
    setActiveImageIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
  }, [galleryList.length]);

  // Selalu pastikan halaman detail proyek dimulai dari paling atas saat dibuka
  React.useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = (window as unknown as { lenis?: { scrollTo: (target: number, opts?: object) => void } }).lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, []);

  // Keyboard navigation for smooth browsing
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (galleryList.length <= 1) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryList.length, handlePrev, handleNext]);

  const currentPhoto = galleryList[activeImageIndex] || project.image_url;

  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    `Halo Taman San Jaya, saya melihat proyek "${project.title}" di ${project.location} dan tertarik untuk konsultasi mengenai konsep lanskap serupa.`
  )}`;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-16">
      {/* 1. TOP BAR: TOMBOL BACK ICON */}
      <div className="flex items-center justify-between mb-5 sm:mb-7">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Kembali ke Koleksi Proyek"
          className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-brand-earth hover:text-brand-crimson border border-brand-earth/15 shadow-xs hover:shadow-md transition-all duration-200 group active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        </button>
      </div>

      {/* 2. HERO FOTO UTAMA BESAR */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[21/10] md:max-h-[520px] rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden bg-black/40 border border-brand-earth/20 shadow-xl group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto}
            initial={{ opacity: 0.8, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative w-full h-full"
          >
            <Image
              src={currentPhoto}
              alt={`${project.title} - Foto ${activeImageIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

        {/* Counter Badge */}
        <div className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-mono font-bold tracking-wider border border-white/20">
          {activeImageIndex + 1} / {galleryList.length}
        </div>

        {/* Navigasi Panah Kiri-Kanan */}
        {galleryList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Foto Sebelumnya"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Foto Berikutnya"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* 3. INFORMASI PROYEK (2 KOLOM RESPOCIK) */}
      <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Kolom Kiri: Judul & Deskripsi Arsitektur */}
        <div className="lg:col-span-8 space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-earth tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-brand-earth/85 text-base sm:text-lg leading-relaxed pt-2 font-normal">
            {project.description}
          </p>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-brand-earth/90 bg-white/60 p-3 rounded-xl border border-brand-earth/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Garansi Tumbuh 100% Bersertifikat</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-brand-earth/90 bg-white/60 p-3 rounded-xl border border-brand-earth/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Perawatan Nutrisi Berbasis Sains IPB</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail Lokasi */}
        <div className="lg:col-span-4 bg-white/80 rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-brand-earth/15 shadow-sm">
          <span className="text-[11px] font-bold text-brand-earth/60 uppercase tracking-widest block mb-1.5">
            Lokasi Pengerjaan
          </span>
          <div className="flex items-start gap-2.5 text-brand-earth font-black text-lg sm:text-xl">
            <MapPin className="w-5 h-5 text-brand-crimson flex-shrink-0 mt-0.5" />
            <span>{project.location}</span>
          </div>
        </div>
      </div>

      {/* 4. GALERI FOTO (THUMBNAILS & DOCUMENTATION GRID) */}
      {galleryList.length > 1 && (
        <div className="mt-14 sm:mt-18 pt-8 border-t border-brand-earth/15">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-earth tracking-tight">
                Galeri Foto Dokumentasi
              </h2>
              <p className="text-xs sm:text-sm text-brand-earth/75 mt-1">
                Klik salah satu foto untuk melihatnya di panggung utama di atas.
              </p>
            </div>
            <span className="text-xs font-bold text-brand-crimson bg-white px-3 py-1 rounded-full border border-brand-earth/10">
              {galleryList.length} Foto
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {galleryList.map((img, idx) => {
              const isSelected = idx === activeImageIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`Lihat foto dokumentasi ${idx + 1}`}
                  className={`relative aspect-[16/11] rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-300 group cursor-pointer focus:outline-hidden ${
                    isSelected
                      ? 'border-brand-crimson ring-4 ring-brand-crimson/20 shadow-md scale-[1.02]'
                      : 'border-white/80 hover:border-brand-crimson/50 opacity-80 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${project.title} Thumbnail ${idx + 1}`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. PROYEK LAINNYA (MATCHING SCREENSHOT REFERENSI) */}
      {otherProjects.length > 0 && (
        <div className="mt-16 sm:mt-20 pt-10 border-t border-brand-earth/15">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-earth tracking-tight">
                Proyek Lainnya
              </h2>
              <p className="text-xs sm:text-sm text-brand-earth/75 mt-1">
                Jelajahi karya lanskap dan taman hijau asri lainnya yang telah kami wujudkan.
              </p>
            </div>
            <Link
              href="/#project"
              className="text-xs sm:text-sm font-bold text-brand-crimson hover:underline"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {otherProjects.map((other) => (
              <div
                key={other.id}
                className="group block bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-earth/15 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Pencet Foto Langsung Masuk ke Tab Proyek Terkait */}
                <Link
                  href={`/proyek/${other.slug || other.id}`}
                  className="block relative w-full aspect-[16/10] overflow-hidden bg-brand-sand/20 cursor-pointer"
                >
                  <Image
                    src={other.image_url}
                    alt={other.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                <div className="p-5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-brand-crimson uppercase tracking-wider mb-1.5">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span>{other.location}</span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-brand-earth group-hover:text-brand-crimson transition-colors line-clamp-1">
                    <Link href={`/proyek/${other.slug || other.id}`} className="hover:text-brand-crimson transition-colors">
                      {other.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-brand-earth/70 line-clamp-2 leading-relaxed">
                    {other.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. BOTTOM CALL TO ACTION */}
      <div className="mt-16 sm:mt-20 bg-brand-earth text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center space-y-4">
        <ShieldCheck className="w-10 h-10 text-brand-sand mx-auto" />
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black">
          Ingin Membangun Taman Asri Serupa di Hunian Anda?
        </h3>
        <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
          Konsultasikan kebutuhan lanskap Anda langsung dengan tim ahli Proteksi Tanaman IPB University. Kami melayani survei lokasi bebas biaya awal.
        </p>
        <div className="pt-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-brand-crimson hover:bg-brand-crimson-hover text-white text-xs sm:text-sm font-bold px-8 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Hubungi WhatsApp Taman San Jaya</span>
          </a>
        </div>
      </div>
    </div>
  );
}
