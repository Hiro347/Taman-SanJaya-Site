import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { getSiteSettings } from '@/lib/data';

import ScrollRotatingLogo3D from '@/components/ScrollRotatingLogo3D';

// Keep page dynamically updated when settings change
export const revalidate = 0;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-brand-crimson selection:text-white">
      {/* ========================================================================= */}
      {/* 1. Ambient Background using the exact Hero Section Image (Soft Focus)      */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none">
        <div
          className="absolute -inset-6 bg-cover bg-center filter blur-[6px] sm:blur-[7px] brightness-[0.98] transition-all duration-500 scale-105"
          style={{
            backgroundImage: `url(${settings.hero_image_url})`,
          }}
        />
        {/* Very subtle tint to blend naturally */}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* ========================================================================= */}
      {/* 2. Main Elevated Card Container (15px top, 24px sides matching Figma)     */}
      {/* ========================================================================= */}
      <div className="relative z-10 pt-[15px] px-3 sm:px-5 md:px-[24px] pb-12 w-full mx-auto">
        <div className="bg-[#D8CDAE] rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] shadow-2xl border border-[#c5b791]/60 overflow-hidden flex flex-col min-h-[92vh] relative">
          {/* 3D Rotating Logo Ambient Background on Scroll */}
          <ScrollRotatingLogo3D />

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

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp settings={settings} />
    </div>
  );
}
