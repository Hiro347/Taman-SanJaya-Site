'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Compass, Hammer, Scissors, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import { Service, SiteSettings } from '@/lib/types';

interface ServicesSectionProps {
  services: Service[];
  settings: SiteSettings;
}

const iconMap: Record<string, React.ReactNode> = {
  Compass: <Compass className="w-6 h-6 text-brand-crimson" />,
  Hammer: <Hammer className="w-6 h-6 text-brand-navy" />,
  Scissors: <Scissors className="w-6 h-6 text-brand-earth" />,
};

export default function ServicesSection({ services, settings }: ServicesSectionProps) {
  return (
    <section id="service" className="py-16 sm:py-20 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <span className="inline-block text-xs font-bold tracking-widest text-brand-crimson uppercase bg-brand-sand px-4 py-1.5 rounded-full mb-3">
          Layanan Profesional Kami
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-earth tracking-tight">
          Solusi Terpadu Keindahan Taman & Alam
        </h2>
        <p className="mt-4 text-brand-earth/80 text-base sm:text-lg">
          Dari perencanaan konsep visual, pengerjaan konstruksi taman idaman, hingga perawatan rutin agar taman Anda selalu mempesona.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => {
          const serviceWaUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
            `Halo Taman San Jaya, saya ingin bertanya dan konsultasi tentang ${service.title}.`
          )}`;

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white rounded-3xl overflow-hidden border border-brand-sand-dark/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Service Image */}
              {service.image_url && (
                <div className="relative w-full h-56 sm:h-60 overflow-hidden">
                  <Image
                    src={service.image_url}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-sm">
                    {iconMap[service.icon_name] || <Compass className="w-6 h-6 text-brand-crimson" />}
                  </div>
                </div>
              )}

              {/* Service Content */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-earth group-hover:text-brand-crimson transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-brand-earth/75 text-sm sm:text-base leading-relaxed">
                    {service.short_desc}
                  </p>

                  {/* Feature Checklist */}
                  {service.features && service.features.length > 0 && (
                    <ul className="mt-5 space-y-2.5">
                      {service.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-earth/90">
                          <CheckCircle2 className="w-4 h-4 text-brand-crimson flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Consultation Button */}
                <div className="mt-7 pt-5 border-t border-gray-100">
                  <a
                    href={serviceWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full bg-brand-sand/60 hover:bg-brand-crimson hover:text-white text-brand-earth font-bold text-sm px-5 py-3 rounded-2xl transition-all group/btn"
                  >
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Konsultasi Jasa Ini</span>
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
