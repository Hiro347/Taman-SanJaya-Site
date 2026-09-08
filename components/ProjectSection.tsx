'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { Project, SiteSettings } from '@/lib/types';

interface ProjectSectionProps {
  projects: Project[];
  settings: SiteSettings;
}

export default function ProjectSection({ projects, settings }: ProjectSectionProps) {
  return (
    <section id="project" className="py-14 sm:py-20 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header - Bersih tanpa tab kategori */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <span className="inline-block text-xs font-bold tracking-widest text-brand-crimson uppercase bg-white/80 border border-brand-earth/15 px-4 py-1.5 rounded-full mb-3 shadow-xs">
          Portofolio Karya & Dedikasi
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-earth tracking-tight">
          Koleksi Proyek Taman San Jaya
        </h2>
        <p className="mt-3.5 sm:mt-4 text-brand-earth/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Dokumentasi karya nyata pengerjaan lanskap hunian privat, villa, kawasan terbuka, dan relief alami bergaransi tumbuh 100%.
        </p>
      </div>

      {/* Projects Grid - Desain Kartu Editorial Bersih & Elegan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {projects.map((project, index) => {
          const isFeatured = index === 0;
          const projectWaUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
            `Halo Taman San Jaya, saya melihat portofolio proyek "${project.title}" di website dan ingin konsultasi pembuatan konsep taman serupa.`
          )}`;

          return (
            <motion.a
              key={project.id}
              href={projectWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className={`group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-earth/15 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between ${
                isFeatured ? 'md:col-span-2' : ''
              }`}
            >
              {/* Image Container with Zoom Effect */}
              <div
                className={`relative w-full overflow-hidden bg-brand-sand/20 ${
                  isFeatured
                    ? 'aspect-[16/10] sm:aspect-[21/10] md:max-h-[440px]'
                    : 'aspect-[16/10] sm:aspect-[16/10]'
                }`}
              >
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  sizes={isFeatured ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle dark vignette on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-25 group-hover:opacity-55 transition-opacity duration-500" />

                {/* Project Index Number */}
                <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-white text-xs font-mono font-bold tracking-wider border border-white/20">
                  0{index + 1}
                </div>

                {/* Floating Interactive Arrow Badge */}
                <div className="absolute top-3.5 right-3.5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md text-brand-earth group-hover:bg-brand-crimson group-hover:text-white flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Project Details */}
              <div className="p-5 sm:p-7 flex flex-col justify-between flex-1">
                <div>
                  {/* Location Meta */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-crimson uppercase tracking-wider mb-2">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{project.location}</span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-black text-brand-earth group-hover:text-brand-crimson transition-colors leading-snug tracking-tight ${
                      isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                    }`}
                  >
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2.5 text-brand-earth/75 text-sm sm:text-base leading-relaxed font-normal">
                    {project.description}
                  </p>
                </div>

                {/* Bottom subtle indicator */}
                <div className="pt-4 mt-4 border-t border-brand-earth/10 flex items-center justify-between text-xs text-brand-earth/60 group-hover:text-brand-crimson transition-colors font-medium">
                  <span>Konsultasi Proyek Ini</span>
                  <span className="inline-flex items-center gap-1 font-bold text-brand-crimson">
                    WhatsApp <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
