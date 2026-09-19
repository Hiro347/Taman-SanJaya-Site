'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Images } from 'lucide-react';
import { Project, SiteSettings } from '@/lib/types';

interface ProjectSectionProps {
  projects: Project[];
  settings?: SiteSettings;
}

export default function ProjectSection({ projects }: ProjectSectionProps) {
  return (
    <section id="project" className="pt-0 sm:pt-2 pb-2 sm:pb-4 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-earth tracking-tight">
          Proyek Kami
        </h2>
        <span className="block text-sm sm:text-base font-medium text-brand-earth/70 tracking-[0.2em] uppercase mt-1">
          我们项目
        </span>
      </div>

      {/* Projects Grid or Empty State */}
      {projects.length === 0 ? (
        <div className="text-center py-20 sm:py-28 lg:py-36 flex flex-col items-center justify-center">
          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-earth tracking-tight">
            Dokumentasi Portofolio Sedang Dalam Tahap Kurasi
          </p>
          <p className="text-sm sm:text-base md:text-lg text-brand-earth/75 font-medium mt-2 sm:mt-3 max-w-xl mx-auto">
            Galeri foto hasil pengerjaan taman tropis &amp; lanskap arsitektural terbaru akan segera ditampilkan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project, index) => {
            const isFeatured = index === 0;
            const galleryCount = (project.gallery_images?.length || 0) + (project.image_url ? 1 : 0);

            return (
              <motion.div
                key={project.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-brand-earth/15 shadow-sm hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between h-full ${
                  isFeatured ? 'md:col-span-2' : ''
                }`}
              >
                {/* Image Container with Zoom Effect - Pencet Foto Langsung Masuk ke Tab Proyek */}
                <Link
                  href={`/proyek/${project.slug || project.id}`}
                  aria-label={`Buka detail dan galeri proyek ${project.title}`}
                  className={`block relative w-full overflow-hidden bg-brand-sand/20 cursor-pointer ${
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
                    priority={isFeatured}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Subtle dark vignette on hover (pointer-events-none agar klik foto tidak terhalang) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

                  {/* Project Index Number */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-white text-xs font-mono font-bold tracking-wider border border-white/20 pointer-events-none">
                    0{index + 1}
                  </div>

                  {/* Gallery photo count badge on hover/display */}
                  <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-white text-xs font-medium tracking-wide border border-white/20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Images className="w-3.5 h-3.5" />
                    <span>{galleryCount > 1 ? `${galleryCount} Foto` : 'Lihat Detail'}</span>
                  </div>
                </Link>

                {/* Project Details */}
                <div className="p-5 sm:p-7 flex flex-col justify-between flex-1">
                  <div>
                    {/* Category & Location Meta */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-brand-crimson text-white">
                        {project.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-brand-earth/70">
                        <MapPin className="w-3.5 h-3.5 text-brand-earth/80 flex-shrink-0" />
                        <span>{project.location}</span>
                      </span>
                    </div>

                    {/* Title - Juga dapat diklik menuju detail proyek */}
                    <h3
                      className={`font-black text-brand-earth leading-snug tracking-tight ${
                        isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                      }`}
                    >
                      <Link
                        href={`/proyek/${project.slug || project.id}`}
                        className="hover:text-brand-crimson transition-colors duration-200"
                      >
                        {project.title}
                      </Link>
                    </h3>

                    {/* Description */}
                    <p className="mt-2.5 text-brand-earth/90 text-sm sm:text-base leading-relaxed font-medium line-clamp-3 sm:line-clamp-none">
                      {project.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}

