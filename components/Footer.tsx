import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteSettings } from '@/lib/types';
import { Lock, Phone, MapPin, Clock, ArrowUp } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <div className="w-full relative mt-12 sm:mt-16">
      {/* Ornamen Bunga Liar Alami (Group 2) Membentang Tepat di Atas Footer */}
      <div className="w-full relative -mb-1 sm:-mb-1.5 pointer-events-none select-none z-10">
        <picture>
          <source srcSet="/images/group-2.webp" type="image/webp" />
          <img
            src="/images/group-2.png"
            alt="Ornamen Bunga Liar Alami Taman San Jaya"
            className="w-full h-auto block"
            loading="lazy"
          />
        </picture>
      </div>

      <footer className="w-full bg-brand-earth text-white pt-14 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 bg-white rounded-full p-1 flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Taman San Jaya Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <span className="font-serif italic font-bold tracking-wider text-xl block text-white">
                  TAMAN SAN JAYA
                </span>
                <span className="text-xs tracking-widest text-brand-sand block font-sans">
                  成功之园 • Landscape Architecture & Nursery
                </span>
              </div>
            </div>

            <p className="mt-4 text-white/75 text-sm leading-relaxed max-w-md">
              Penyedia jasa landscape profesional, perencanaan visual taman 2D/3D, pembuatan taman tropis & minimalis, relief tebing alami, perawatan berkala, serta katalog ragam tanaman hias berkualitas tinggi.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-xs text-brand-sand font-medium">Melayani Survei Seluruh Wilayah</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-brand-sand font-bold text-sm tracking-wider uppercase mb-4">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link href="#home" className="hover:text-brand-sand transition-colors">
                  Beranda (Home)
                </Link>
              </li>
              <li>
                <Link href="#service" className="hover:text-brand-sand transition-colors">
                  Layanan & Jasa
                </Link>
              </li>
              <li>
                <Link href="#project" className="hover:text-brand-sand transition-colors">
                  Portofolio Proyek
                </Link>
              </li>
              <li>
                <Link href="#catalog" className="hover:text-brand-sand transition-colors">
                  Katalog Tanaman Hias
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-brand-sand transition-colors">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4">
            <h4 className="text-brand-sand font-bold text-sm tracking-wider uppercase mb-4">
              Kontak & Operasional
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-white/80">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-sand flex-shrink-0 mt-0.5" />
                <span>+{settings.whatsapp_number} (Konsultasi Cepat)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-sand flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-sand flex-shrink-0 mt-0.5" />
                <span>{settings.opening_hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Admin Login Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Taman San Jaya (成功之园). Seluruh hak cipta dilindungi undang-undang.</p>
          
          <div className="flex items-center gap-6">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-white/40 hover:text-brand-sand transition-colors"
              title="Akses Pengelola Situs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </Link>

            <Link
              href="#home"
              className="inline-flex items-center gap-1 text-white/60 hover:text-white transition-colors"
            >
              <span>Ke Atas</span>
              <ArrowUp className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
      </footer>
    </div>
  );
}
