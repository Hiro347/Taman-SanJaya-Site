'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Project, SiteSettings } from '@/lib/types';

interface ProjectSectionProps {
  projects: Project[];
  settings?: SiteSettings;
}

export default function ProjectSection({ projects }: ProjectSectionProps) {
  return (
    <section id="project" className="pt-14 sm:pt-20 pb-1 sm:pb-2 px-3 sm:px-6 max-w-7xl mx-auto">
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

          return (
            <motion.div
              key={project.id}
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
                    className={`font-black text-brand-earth leading-snug tracking-tight ${
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
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
