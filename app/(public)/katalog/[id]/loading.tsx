import React from 'react';

export default function ProductDetailLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-20 animate-pulse">
      {/* 1. TOP BAR: Back button skeleton */}
      <div className="flex items-center justify-between mb-5 sm:mb-7">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/80 border border-brand-earth/15" />
      </div>

      {/* 2. MAIN 2-COLUMN SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: PANGGUNG FOTO & THUMBNAILS SKELETON */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative w-full aspect-square rounded-3xl bg-white/70 border border-brand-earth/15 shadow-md flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-brand-earth/10 animate-ping" />
          </div>

          {/* Thumbnails Row Skeleton */}
          <div className="flex items-center gap-3 pt-1">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="w-18 h-18 sm:w-20 sm:h-20 aspect-square rounded-2xl bg-white/70 border border-brand-earth/15 flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL PRODUK & MARKETPLACE CTAs SKELETON */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-28 bg-brand-earth/15 rounded-full" />
              <div className="h-6 w-24 bg-brand-earth/15 rounded-full" />
            </div>

            <div className="h-10 sm:h-12 w-4/5 bg-brand-earth/15 rounded-2xl" />

            <div className="h-16 w-3/5 bg-white/70 rounded-2xl border border-brand-earth/15" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2 pt-2">
            <div className="h-4 w-32 bg-brand-earth/10 rounded" />
            <div className="h-4 w-full bg-brand-earth/10 rounded-lg" />
            <div className="h-4 w-5/6 bg-brand-earth/10 rounded-lg" />
            <div className="h-4 w-2/3 bg-brand-earth/10 rounded-lg" />
          </div>

          {/* Marketplace & WhatsApp Buttons Skeleton */}
          <div className="space-y-3 pt-2">
            <div className="h-4 w-40 bg-brand-earth/10 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="h-12 bg-white/70 rounded-2xl border border-brand-earth/15" />
              <div className="h-12 bg-white/70 rounded-2xl border border-brand-earth/15" />
            </div>
            <div className="h-14 bg-brand-crimson/20 rounded-2xl border border-brand-crimson/25" />
          </div>
        </div>
      </div>
    </div>
  );
}
