'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Box, Sparkles, Layers, Eye, ShieldCheck, Waves, Trees, Compass } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface ThreeDShowcaseProps {
  settings: SiteSettings;
}

interface Hotspot {
  id: number;
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  x: string; // percentage
  y: string; // percentage
}

export default function ThreeDShowcase({ settings }: ThreeDShowcaseProps) {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Spring Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    damping: 25,
    stiffness: 200,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    damping: 25,
    stiffness: 200,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const hotspots: Hotspot[] = [
    {
      id: 1,
      title: 'Water Feature & Ornamen Air Alami',
      category: 'Aquatic Landscape',
      description: 'Sirkulasi air mengalir alami dengan sistem filtrasi tersembunyi agar gemercik air senantiasa jernih dan menyejukkan taman.',
      icon: <Waves className="w-4 h-4 text-cyan-400" />,
      x: '52%',
      y: '72%',
    },
    {
      id: 2,
      title: 'Dinding Relief Air Terjun Andesit',
      category: 'Hardscaping Relief',
      description: 'Susunan batu alam andesit bertekstur kasar dengan sirkulasi pompa tersembunyi menghasilkan gemercik air yang menenangkan.',
      icon: <Layers className="w-4 h-4 text-amber-400" />,
      x: '24%',
      y: '34%',
    },
    {
      id: 3,
      title: 'Decking Kayu Ulin & Warm Lighting',
      category: 'Outdoor Living',
      description: 'Lantai kayu ulin kalimantan tahan cuaca dan rayap dipadu instalasi strip LED warm white 3000K untuk suasana malam yang hangat.',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      x: '72%',
      y: '55%',
    },
    {
      id: 4,
      title: 'Vegetasi Tropis Terkurasi',
      category: 'Horticultural Science',
      description: 'Pohon pisang kipas, palem, dan monstera yang dikurasi dengan perlakuan tanah khusus tahan penyakit dari Proteksi Tanaman IPB.',
      icon: <Trees className="w-4 h-4 text-lime-400" />,
      x: '43%',
      y: '22%',
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-crimson uppercase bg-white px-4 py-1.5 rounded-full mb-3 shadow-xs">
          <Box className="w-3.5 h-3.5" />
          Interactive 3D Landscape Diorama
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-earth tracking-tight">
          Visualisasi 3D Konsep Taman Modern
        </h2>
        <p className="mt-3 text-brand-earth/80 text-sm sm:text-base">
          Gerakkan kursor pada model 3D di bawah ini untuk merasakan perspektif ruang, lalu klik titik interaktif untuk mempelajari rekayasa arsitektural kami.
        </p>
      </div>

      {/* 3D Interactive Card Container with Perspective */}
      <div
        style={{ perspective: 1200 }}
        className="relative max-w-5xl mx-auto"
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl sm:rounded-[40px] overflow-hidden shadow-2xl border-2 border-white/60 bg-black cursor-grab active:cursor-grabbing group transition-shadow duration-300 hover:shadow-[0_25px_60px_-15px_rgba(92,64,51,0.35)]"
        >
          {/* Main 3D Rendered Diorama Image */}
          <Image
            src="/images/3d-garden-diorama.jpg"
            alt="3D Landscape Architecture Diorama"
            fill
            className="object-cover pointer-events-none select-none"
            priority
          />

          {/* Glare / Sheen Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Interactive Hotspots */}
          {hotspots.map((spot) => (
            <div
              key={spot.id}
              style={{ left: spot.x, top: spot.y, transform: 'translate(-50%, -50%) translateZ(40px)' }}
              className="absolute z-20"
            >
              <button
                onClick={() => setActiveHotspot(activeHotspot?.id === spot.id ? null : spot)}
                aria-label={spot.title}
                className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full backdrop-blur-md border shadow-lg transition-all transform hover:scale-125 focus:outline-none ${
                  activeHotspot?.id === spot.id
                    ? 'bg-brand-crimson text-white border-white scale-125'
                    : 'bg-black/70 text-white border-white/40 hover:bg-brand-crimson'
                }`}
              >
                <span className="absolute inset-0 rounded-full bg-brand-crimson animate-ping opacity-40" />
                <span className="text-xs font-bold relative z-10">{spot.id}</span>
              </button>
            </div>
          ))}

          {/* Top Label */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-semibold border border-white/20 pointer-events-none">
            <Compass className="w-3.5 h-3.5 text-brand-sand animate-spin-slow" />
            <span>Interactive 3D Model • 360° Tilt</span>
          </div>
        </motion.div>

        {/* Selected Hotspot Detail Card */}
        {activeHotspot && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15 }}
            className="mt-6 p-6 bg-white rounded-3xl border border-brand-sand-dark/40 shadow-xl max-w-xl mx-auto flex items-start gap-4"
          >
            <div className="p-3 bg-brand-sand/60 rounded-2xl flex-shrink-0">
              {activeHotspot.icon}
            </div>
            <div className="flex-1">
              <span className="text-[11px] uppercase font-bold tracking-widest text-brand-crimson block">
                {activeHotspot.category}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-brand-earth mt-0.5">
                {activeHotspot.title}
              </h4>
              <p className="text-xs sm:text-sm text-brand-earth/80 mt-1.5 leading-relaxed">
                {activeHotspot.description}
              </p>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-brand-earth/50 hover:text-brand-earth text-xs font-bold p-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </div>

      {/* CTA under 3D model */}
      <div className="mt-10 text-center">
        <a
          href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
            'Halo Taman San Jaya, saya tertarik merancang visualisasi 3D untuk rencana taman rumah saya.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-navy-dark text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-md transition-all hover:scale-105"
        >
          <Compass className="w-4 h-4 text-brand-sand" />
          <span>Buat Desain 3D Khusus untuk Lahan Anda</span>
        </a>
      </div>
    </section>
  );
}
