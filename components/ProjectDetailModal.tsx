'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { Project } from '@/lib/types';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Combine primary image and gallery images into a single deduplicated list
  const galleryList = React.useMemo(() => {
    if (!project) return [];
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

  // Reset active image index when project changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [project]);

  const handlePrev = useCallback(() => {
    if (galleryList.length === 0) return;
    setActiveImageIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
  }, [galleryList.length]);

  const handleNext = useCallback(() => {
    if (galleryList.length === 0) return;
    setActiveImageIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
  }, [galleryList.length]);

  // Keyboard navigation (ESC to close, Left/Right arrow keys for gallery)
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      lenis?.start();
    };
  }, [project, onClose, handlePrev, handleNext]);

  if (!project) return null;

  const currentImage = galleryList[activeImageIndex] || project.image_url;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#171412] text-stone-100 rounded-2xl sm:rounded-3xl border border-stone-800/90 shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Tutup detail proyek"
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 p-2.5 rounded-full bg-black/65 hover:bg-black text-stone-300 hover:text-white backdrop-blur-md border border-white/15 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Modal Content */}
          <div data-lenis-prevent className="overflow-y-auto custom-scrollbar flex-1">
            {/* Top: Single Landscape Photo */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/10] max-h-[460px] bg-stone-950 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentImage}
                    alt={project.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 900px"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Gradient Vignette at Top and Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#171412] via-transparent to-black/40 pointer-events-none" />

              {/* Photo Counter Pill */}
              {galleryList.length > 1 && (
                <div className="absolute bottom-4 left-4 sm:left-6 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-stone-200 text-xs font-mono tracking-wider font-semibold">
                  {activeImageIndex + 1} / {galleryList.length}
                </div>
              )}

              {/* Quick Prev / Next Arrows on Landscape Photo */}
              {galleryList.length > 1 && (
                <div className="absolute inset-y-0 inset-x-2 sm:inset-x-4 flex items-center justify-between pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    aria-label="Foto sebelumnya"
                    className="pointer-events-auto p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-stone-200 hover:text-white backdrop-blur-sm border border-white/15 transition-all duration-200 hover:scale-110 active:scale-90"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    aria-label="Foto berikutnya"
                    className="pointer-events-auto p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-stone-200 hover:text-white backdrop-blur-sm border border-white/15 transition-all duration-200 hover:scale-110 active:scale-90"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              )}
            </div>

            {/* Middle: Project Details */}
            <div className="p-5 sm:p-7 md:p-8">
              {/* Location Tag */}
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-sand mb-2.5">
                <MapPin className="w-4 h-4 text-brand-sand flex-shrink-0" />
                <span>{project.location}</span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {project.title}
              </h3>

              {/* Divider Line */}
              <div className="h-px bg-stone-800/80 my-4" />

              {/* Description */}
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                {project.description}
              </p>

              {/* Bottom: Galeri Foto Section */}
              {galleryList.length > 0 && (
                <div className="mt-8 pt-6 border-t border-stone-800/80">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-stone-200 font-bold text-sm sm:text-base uppercase tracking-wider">
                      <Images className="w-4 h-4 text-brand-sand" />
                      <span>Galeri Foto ({galleryList.length})</span>
                    </div>
                    {galleryList.length > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePrev}
                          aria-label="Geser galeri ke kiri"
                          className="p-1.5 rounded-lg bg-stone-850 hover:bg-stone-750 text-stone-300 hover:text-white border border-stone-750 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleNext}
                          aria-label="Geser galeri ke kanan"
                          className="p-1.5 rounded-lg bg-stone-850 hover:bg-stone-750 text-stone-300 hover:text-white border border-stone-750 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-700">
                    {galleryList.map((imgUrl, idx) => {
                      const isActive = idx === activeImageIndex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative flex-shrink-0 w-24 sm:w-28 md:w-32 aspect-[16/10] rounded-xl overflow-hidden transition-all duration-200 border-2 ${
                            isActive
                              ? 'border-brand-sand ring-2 ring-brand-sand/40 scale-105 opacity-100 shadow-md'
                              : 'border-stone-800/80 hover:border-stone-600 opacity-60 hover:opacity-90'
                          }`}
                        >
                          <Image
                            src={imgUrl}
                            alt={`${project.title} - foto ${idx + 1}`}
                            fill
                            sizes="128px"
                            className="object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
