'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sparkles, MessageSquare } from 'lucide-react';
import { Project, SiteSettings } from '@/lib/types';

interface ProjectSectionProps {
  projects: Project[];
  settings: SiteSettings;
}

export default function ProjectSection({ projects, settings }: ProjectSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('Semua');

  const categories = ['Semua', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter(
    (p) => activeTab === 'Semua' || p.category === activeTab
  );

  return (
    <section id="project" className="py-16 sm:py-20 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-block text-xs font-bold tracking-widest text-brand-crimson uppercase bg-brand-sand px-4 py-1.5 rounded-full mb-3">
          Portofolio Karya & Dedikasi
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-earth tracking-tight">
          Koleksi Proyek Taman San Jaya
        </h2>
        <p className="mt-4 text-brand-earth/80 text-base sm:text-lg">
          Inspirasi nyata dari proyek taman hunian privat, villa, kawasan publik, dan relief tebing alami yang telah kami selesaikan dengan kepuasan pelanggan.
        </p>

        {/* Category Filters with animated tab pill */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {categories.map((cat) => {
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-brand-earth hover:text-brand-crimson bg-white/70 hover:bg-white border border-brand-earth/15'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeProjectTab"
                    className="absolute inset-0 bg-brand-crimson rounded-full -z-0 shadow-md shadow-brand-crimson/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid with AnimatePresence & Staggered Reveal */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => {
            const projectWaUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
              `Halo Taman San Jaya, saya melihat proyek "${project.title}" di website dan tertarik membuat konsep serupa untuk rumah saya.`
            )}`;

            return (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 35, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[28px] sm:rounded-3xl overflow-hidden border border-brand-earth/15 shadow-sm hover:shadow-2xl transition-shadow duration-500 group flex flex-col justify-between"
              >
                <div>
                  {/* Project Image with Zoom & Floating Pill */}
                  <div className="relative w-full h-64 sm:h-80 overflow-hidden bg-brand-sand/30">
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-70 group-hover:opacity-85 transition-opacity" />
                    
                    <div className="absolute top-4 left-4 bg-brand-earth/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border border-white/20">
                      <Sparkles className="w-3.5 h-3.5 text-brand-sand" />
                      <span>{project.category}</span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6 sm:p-7">
                    <div className="flex items-center gap-1.5 text-xs text-brand-navy font-bold mb-2.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-crimson" />
                      <span>{project.location}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-brand-earth group-hover:text-brand-crimson transition-colors leading-snug">
                      {project.title}
                    </h3>

                    <p className="mt-3 text-brand-earth/80 text-sm sm:text-base leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-6 sm:p-7 pt-0">
                  <a
                    href={projectWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-brand-sand/50 hover:bg-brand-crimson hover:text-white text-brand-earth font-bold text-sm py-3.5 px-5 rounded-2xl border border-brand-earth/15 hover:border-transparent transition-all shadow-xs group/btn"
                  >
                    <MessageSquare className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                    <span>Konsultasikan Konsep Serupa</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
