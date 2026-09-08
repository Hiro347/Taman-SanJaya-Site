'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
          Inspirasi nyata dari proyek taman hunian privat, villa, perkantoran, dan kolam koi yang telah kami selesaikan dengan kepuasan pelanggan.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === cat
                  ? 'bg-brand-crimson text-white shadow-sm'
                  : 'bg-white text-brand-earth hover:bg-brand-sand border border-brand-sand-dark/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project, index) => {
          const projectWaUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
            `Halo Taman San Jaya, saya melihat proyek "${project.title}" di website dan tertarik membuat konsep serupa untuk rumah saya.`
          )}`;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden border border-brand-sand-dark/30 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Project Image */}
                <div className="relative w-full h-64 sm:h-80 overflow-hidden">
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-brand-earth/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-sand" />
                    <span>{project.category}</span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-1.5 text-xs text-brand-navy font-semibold mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{project.location}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-brand-earth group-hover:text-brand-crimson transition-colors">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-brand-earth/75 text-sm sm:text-base leading-relaxed">
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
                  className="flex items-center justify-center gap-2 w-full bg-brand-sand/70 hover:bg-brand-navy hover:text-white text-brand-earth font-bold text-sm py-3 px-5 rounded-2xl transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Konsultasikan Konsep Seperti Ini</span>
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
