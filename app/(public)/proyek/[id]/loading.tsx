import React from 'react';

export default function ProjectDetailLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-16 animate-pulse">
      {/* 1. TOP BAR: Back button skeleton */}
      <div className="flex items-center justify-between mb-5 sm:mb-7">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/70 border border-brand-earth/15" />
      </div>

      {/* 2. HERO FOTO UTAMA BESAR SKELETON */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[21/10] md:max-h-[520px] rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden bg-brand-earth/15 border border-brand-earth/20 shadow-md flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/20 animate-ping" />
      </div>

      {/* 3. INFORMASI PROYEK (2 KOLOM SKELETON) */}
      <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Kolom Kiri: Judul & Deskripsi */}
        <div className="lg:col-span-8 space-y-4">
          <div className="h-10 sm:h-12 w-3/4 bg-brand-earth/15 rounded-2xl" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-brand-earth/10 rounded-lg" />
            <div className="h-4 w-5/6 bg-brand-earth/10 rounded-lg" />
            <div className="h-4 w-2/3 bg-brand-earth/10 rounded-lg" />
          </div>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="h-12 bg-white/60 rounded-xl border border-brand-earth/10" />
            <div className="h-12 bg-white/60 rounded-xl border border-brand-earth/10" />
          </div>
        </div>

        {/* Kolom Kanan: Lokasi */}
        <div className="lg:col-span-4 bg-white/80 rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-brand-earth/15 shadow-sm space-y-2">
          <div className="h-3 w-24 bg-brand-earth/10 rounded" />
          <div className="h-7 w-3/4 bg-brand-earth/15 rounded-lg" />
        </div>
      </div>

      {/* 4. GALERI FOTO SKELETON */}
      <div className="mt-14 sm:mt-18 pt-8 border-t border-brand-earth/15">
        <div className="h-8 w-60 bg-brand-earth/15 rounded-xl mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="aspect-[16/11] rounded-xl sm:rounded-2xl bg-white/60 border border-brand-earth/15"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
