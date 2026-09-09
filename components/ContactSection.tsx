'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { SiteSettings } from '@/lib/types';

interface ContactSectionProps {
  settings: SiteSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    'Halo Taman San Jaya, saya tertarik untuk reservasi survei lokasi dan konsultasi taman.'
  )}`;

  return (
    <section id="contact" className="pt-6 sm:pt-10 pb-2 sm:pb-4 px-4 sm:px-8 max-w-4xl mx-auto text-center">
      {/* Pop-up Spring Entrance when user reaches this section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '100px 0px' }}
        transition={{
          type: 'spring',
          damping: 22,
          stiffness: 240,
          bounce: 0.35,
          duration: 0.7,
        }}
        className="flex flex-col items-center justify-center space-y-6 sm:space-y-8"
      >
        {/* Big Bold Typographic Heading: RESERVASI sekarang juga! */}
        <div className="space-y-1 sm:space-y-2">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-brand-earth tracking-tight leading-[0.95] uppercase">
            RESERVASI
          </h2>
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif italic font-bold text-brand-crimson tracking-normal">
            sekarang juga!
          </div>
        </div>

        {/* Centered Descriptive Copy */}
        <p className="text-brand-earth/80 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl font-normal">
          Jadwalkan survei lokasi langsung ke hunian Anda atau kunjungi nursery kami. Diskusikan konsep lanskap tropis, relief batu alam, dan perawatan tanaman bersama tim ahli bersertifikasi IPB tanpa biaya awal.
        </p>

        {/* Action Button: Big WhatsApp CTA with Pop-up Spring Bounce */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.15,
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className="pt-2 sm:pt-4"
        >
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-3.5 bg-brand-crimson hover:bg-brand-crimson-hover text-white text-base sm:text-lg font-bold px-9 sm:px-12 py-4 sm:py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <MessageCircle className="w-6 h-6 fill-current flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
            <span className="tracking-wide uppercase text-sm sm:text-base">BOOKING SEKARANG</span>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
