'use client';

import React from 'react';
import { WhatsAppIcon } from '@/components/MarketplaceIcons';
import { SiteSettings } from '@/lib/types';

interface FloatingWhatsAppProps {
  settings: SiteSettings;
}

export default function FloatingWhatsApp({ settings }: FloatingWhatsAppProps) {
  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    settings.whatsapp_message || 'Halo Taman San Jaya, saya ingin konsultasi mengenai jasa taman.'
  )}`;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3">
      {/* Tooltip Badge - Muncul di mobile & desktop */}
      <span className="inline-block bg-white text-brand-earth text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-full shadow-lg border border-brand-sand-dark/40 animate-bounce whitespace-nowrap">
        Konsultasi via WA 👋
      </span>

      {/* Floating Button - Disesuaikan ukurannya di mobile */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi WhatsApp Taman San Jaya"
        className="relative group flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex-shrink-0"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        <WhatsAppIcon className="w-6 h-6 sm:w-8 sm:h-8 relative z-10" />
      </a>
    </div>
  );
}
