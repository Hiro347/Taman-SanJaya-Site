import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { getSiteSettings } from '@/lib/data';

import ScrollRotatingLogoWrapper from '@/components/ScrollRotatingLogoWrapper';
import SmoothScroll from '@/components/SmoothScroll';

// Keep page cached with 60s ISR revalidation
export const revalidate = 60;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <SmoothScroll>
      <div className="relative min-h-screen overflow-x-hidden selection:bg-brand-crimson selection:text-white">
      {/* ========================================================================= */}
      {/* 1. Ambient Background using Pre-blurred Image Asset (Zero CSS Filter Lag)   */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none transform-gpu">
        <Image
          src="/images/background-blur.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover scale-105 brightness-[0.98]"
        />
        {/* Very subtle tint to blend naturally */}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* ========================================================================= */}
      {/* 2. Main Elevated Card Container (15px top, 24px sides matching Figma)     */}
      {/* ========================================================================= */}
      <div className="relative z-10 pt-[15px] px-3 sm:px-5 md:px-[24px] pb-12 w-full mx-auto">
        <div className="relative">
          {/* Hanging Ivy / Bush Clinging at Top-Right Website Corner */}
          <div className="absolute -top-3 sm:-top-5 -right-2 sm:-right-4 lg:-right-6 z-40 pointer-events-none select-none w-20 sm:w-28 md:w-32 lg:w-36 aspect-[63/84]">
            <picture>
              <source srcSet="/images/image-13.webp" type="image/webp" />
              <img
                src="/images/image-13.svg"
                alt="Tanaman Hias Merambat Taman San Jaya"
                className="w-full h-auto block drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)]"
              />
            </picture>
          </div>

          <div className="bg-[#D8CDAE] rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] shadow-2xl border border-[#c5b791]/60 overflow-hidden flex flex-col min-h-[92vh] relative">
            {/* 3D Rotating Logo Ambient Background on Scroll (Lazy-loaded) */}
            <ScrollRotatingLogoWrapper />

          <div className="relative z-10 flex flex-col flex-1">
            {/* Header / Navbar at the top of the card */}
            <Navbar settings={settings} />

            {/* Main Content */}
            <main className="flex-1 w-full">{children}</main>

            {/* Footer at the bottom of the card */}
            <Footer settings={settings} />
          </div>
        </div>
      </div>
    </div>

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp settings={settings} />
    </div>
    </SmoothScroll>
  );
}
