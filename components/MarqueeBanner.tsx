'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function MarqueeBanner() {
  const items = [
    'LANDSCAPE ARCHITECTURE',
    'PROTEKSI TANAMAN IPB UNIVERSITY',
    '3D VISUAL PLANNING',
    'RELIEF TEBING & AIR MANCUR',
    'TROPICAL & ZEN GARDEN',
    'GARANSI HIDUP TUMBUHAN',
    'ORNAMENTAL BOTANICAL NURSERY',
  ];

  return (
    <div className="w-full py-4 sm:py-5 overflow-hidden border-y border-brand-earth/15 bg-brand-earth text-brand-sand my-8">
      <motion.div
        className="flex items-center gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 22,
        }}
      >
        {/* Double array for infinite seamless looping */}
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-4 text-xs sm:text-sm font-extrabold tracking-widest uppercase font-sans">
            <span>{text}</span>
            <Sparkles className="w-3.5 h-3.5 text-brand-crimson flex-shrink-0" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
