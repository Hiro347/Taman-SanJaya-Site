'use client';

import React, { useState } from 'react';
import { Phone, MapPin, Clock, MessageCircle, Instagram, Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { SiteSettings } from '@/lib/types';

interface ContactSectionProps {
  settings: SiteSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    serviceType: 'Jasa Pembuatan Taman',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Halo Taman San Jaya, saya ${formData.name} dari ${formData.location || 'Indonesia'}. Saya tertarik untuk konsultasi mengenai *${formData.serviceType}*. Catatan: ${formData.notes || '-'}`;
    const url = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="contact" className="pt-12 sm:pt-16 pb-6 sm:pb-8 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Decorative gradient border wrap using brand palette */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="p-[1.5px] rounded-[34px] sm:rounded-[46px] bg-gradient-to-br from-brand-crimson/35 via-brand-earth/20 to-brand-navy/35 shadow-xl shadow-brand-earth/5"
      >
        <div className="bg-gradient-to-br from-white/95 via-brand-sand/45 to-white/90 backdrop-blur-md rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Left: Contact Info with Staggered Motion */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-5 flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-crimson/10 border border-brand-crimson/20 text-brand-crimson text-xs font-black tracking-widest uppercase mb-4 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Konsultasi & Survei Gratis</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-brand-earth leading-tight">
                  Wujudkan Taman Impian Bersama Kami
                </h2>
                <p className="mt-3.5 text-brand-earth/80 text-sm sm:text-base leading-relaxed">
                  Ingin mentransformasi halaman rumah atau kantor menjadi oase hijau yang menenangkan? Diskusikan ide dan anggaran Anda bersama tim ahli kami tanpa biaya awal.
                </p>

                <div className="mt-8 space-y-3.5">
                  <motion.a
                    href={`https://wa.me/${settings.whatsapp_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-start gap-3.5 bg-white/90 p-4 rounded-2xl shadow-xs border border-brand-earth/10 hover:border-brand-crimson/30 transition-all cursor-pointer group"
                  >
                    <div className="p-2.5 bg-brand-crimson/10 rounded-xl text-brand-crimson group-hover:bg-brand-crimson group-hover:text-white transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-brand-earth/70 font-semibold block">WhatsApp & Telepon Resmi</span>
                      <span className="text-sm sm:text-base font-bold text-brand-earth group-hover:text-brand-crimson transition-colors">
                        +{settings.whatsapp_number}
                      </span>
                    </div>
                  </motion.a>

                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-start gap-3.5 bg-white/90 p-4 rounded-2xl shadow-xs border border-brand-earth/10 transition-all"
                  >
                    <div className="p-2.5 bg-brand-navy/10 rounded-xl text-brand-navy">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-brand-earth/70 font-semibold block">Alamat Nursery & Workshop</span>
                      <span className="text-xs sm:text-sm font-bold text-brand-earth leading-relaxed">
                        {settings.address}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-start gap-3.5 bg-white/90 p-4 rounded-2xl shadow-xs border border-brand-earth/10 transition-all"
                  >
                    <div className="p-2.5 bg-brand-earth/10 rounded-xl text-brand-earth">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-brand-earth/70 font-semibold block">Jam Operasional Survei</span>
                      <span className="text-xs sm:text-sm font-bold text-brand-earth">
                        {settings.opening_hours}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {settings.instagram_url && (
                <div className="mt-8 pt-6 border-t border-brand-earth/15 flex items-center justify-between">
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-brand-earth hover:text-brand-crimson transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-brand-crimson" />
                    <span>Ikuti Portofolio di Instagram</span>
                  </a>
                  <span className="text-xs font-bold text-brand-crimson">@tamansanjaya</span>
                </div>
              )}
            </motion.div>

            {/* Right: Quick Consultation Form */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-7"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-md border border-brand-earth/10">
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-black text-brand-earth">
                    Formulir Rencana Proyek
                  </h3>
                  <p className="text-brand-earth/70 text-xs sm:text-sm mt-1">
                    Isi data singkat berikut, tim kami akan segera merespons dan membuatkan simulasi RAB.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                      Nama Lengkap Anda
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Bapak Hendra / Ibu Linda"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-brand-earth/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 focus:border-brand-crimson transition-all text-brand-earth placeholder:text-brand-earth/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                      Kota / Wilayah Lokasi Lahan
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: BSD City, Kebayoran Baru, Cibubur, dll"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-brand-earth/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 focus:border-brand-crimson transition-all text-brand-earth placeholder:text-brand-earth/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                      Layanan yang Dibutuhkan
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-brand-earth/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 focus:border-brand-crimson transition-all text-brand-earth bg-white"
                    >
                      <option value="Jasa Pembuatan Taman (Konstruksi & Hardscape)">
                        1. Jasa Pembuatan Taman (Konstruksi & Hardscape)
                      </option>
                      <option value="Jasa Perencanaan & Desain Lanskap 3D">
                        2. Jasa Perencanaan & Desain Lanskap 3D
                      </option>
                      <option value="Jasa Perawatan (Maintenance) Taman Berkala">
                        3. Jasa Perawatan (Maintenance) Taman Berkala
                      </option>
                      <option value="Pembuatan Relief Tebing & Air Mancur Alami">
                        4. Pembuatan Relief Tebing & Air Mancur Alami
                      </option>
                      <option value="Pemesanan Tanaman Hias & Pohon Peneduh">
                        5. Pemesanan Tanaman Hias & Pohon Peneduh
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                      Perkiraan Luas Lahan & Catatan Ide
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Contoh: Luas lahan sekitar 6x5m, ingin gaya tropis minimalis dengan rumput jepang dan pohon peneduh..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-brand-earth/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 focus:border-brand-crimson transition-all text-brand-earth placeholder:text-brand-earth/40"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.015, y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    className="w-full flex items-center justify-center gap-2.5 bg-brand-crimson hover:bg-brand-crimson-hover text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-brand-crimson/25 transition-all text-sm sm:text-base group cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-brand-crimson transition-transform group-hover:rotate-12" />
                    <span>Kirim Rencana ke WhatsApp Resmi</span>
                  </motion.button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
