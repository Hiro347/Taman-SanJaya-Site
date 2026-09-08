'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Sparkles, MoveHorizontal } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface BeforeAfterSliderProps {
  settings: SiteSettings;
}

export default function BeforeAfterSlider({ settings }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const clamped = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(clamped);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-crimson uppercase bg-white px-4 py-1.5 rounded-full mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          Transformasi Nyata
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-earth tracking-tight">
          Sebelum vs Sesudah Sentuhan San Jaya
        </h2>
        <p className="mt-3 text-brand-earth/80 text-sm sm:text-base">
          Geser garis pemisah ke kiri dan kanan untuk melihat keajaiban transformasi dari lahan kosong biasa menjadi hunian asri bernilai tinggi.
        </p>
      </div>

      {/* Interactive Slider Canvas */}
      <div className="max-w-5xl mx-auto">
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl sm:rounded-[40px] overflow-hidden shadow-2xl border border-black/10 select-none cursor-ew-resize"
        >
          {/* AFTER Image (Full background) */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/hero-garden.jpg"
              alt="Sesudah: Taman Tropis San Jaya"
              fill
              className="object-cover pointer-events-none"
              priority
            />
            <span className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-brand-crimson/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md pointer-events-none">
              SESUDAH (Taman San Jaya)
            </span>
          </div>

          {/* BEFORE Image (Clipped by slider position) */}
          <div
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src="https://images.unsplash.com/photo-1592417817098-8f3d6ef2c569?auto=format&fit=crop&w=1200&q=80"
              alt="Sebelum: Lahan Kosong"
              fill
              className="object-cover filter grayscale-[40%] contrast-95 pointer-events-none"
              priority
            />
            <span className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md pointer-events-none">
              SEBELUM (Lahan Kosong)
            </span>
          </div>

          {/* Divider Handle Line */}
          <div
            style={{ left: `${sliderPosition}%` }}
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          >
            {/* Center Draggable Circle */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white text-brand-earth rounded-full shadow-2xl border-2 border-brand-crimson flex items-center justify-center">
              <MoveHorizontal className="w-5 h-5 text-brand-crimson animate-pulse" />
            </div>
          </div>
        </div>

        {/* Quick Hint */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-earth/60 font-medium">
          <MoveHorizontal className="w-4 h-4 text-brand-crimson" />
          <span>Tahan & geser garis lingkaran untuk membandingkan</span>
        </div>
      </div>
    </section>
  );
}
