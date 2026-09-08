'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface FloatingWhatsAppProps {
  settings: SiteSettings;
}

export default function FloatingWhatsApp({ settings }: FloatingWhatsAppProps) {
  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    settings.whatsapp_message || 'Halo Taman San Jaya, saya ingin konsultasi mengenai jasa taman.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip Badge */}
      <span className="hidden sm:inline-block bg-white text-brand-earth text-xs font-bold px-3.5 py-2 rounded-full shadow-lg border border-brand-sand-dark/40 animate-bounce">
        Konsultasi Taman via WA 👋
      </span>

      {/* Floating Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi WhatsApp Taman San Jaya"
        className="relative group flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        <MessageCircle className="w-7 h-7 relative z-10" />
      </a>
    </div>
  );
}
