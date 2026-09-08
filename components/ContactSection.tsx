'use client';

import React, { useState } from 'react';
import { Phone, MapPin, Clock, Send, MessageCircle, Instagram } from 'lucide-react';
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
    <section id="contact" className="py-16 sm:py-20 px-3 sm:px-6 max-w-7xl mx-auto">
      <div className="bg-brand-sand/50 border border-brand-sand-dark/50 rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="inline-block text-xs font-bold tracking-widest text-brand-crimson uppercase bg-white px-4 py-1.5 rounded-full mb-3 shadow-xs">
                Hubungi Kami
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-earth">
                Mulai Konsultasi Taman Anda Sekarang
              </h2>
              <p className="mt-3 text-brand-earth/80 text-sm sm:text-base leading-relaxed">
                Ingin mengubah halaman menjadi oase hijau yang menenangkan? Diskusikan kebutuhan Anda dengan tim ahli kami secara gratis.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl shadow-xs border border-brand-sand-dark/30">
                  <div className="p-2 bg-brand-crimson/10 rounded-xl text-brand-crimson">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-brand-earth/70 font-semibold block">WhatsApp & Telepon</span>
                    <span className="text-sm font-bold text-brand-earth">+{settings.whatsapp_number}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl shadow-xs border border-brand-sand-dark/30">
                  <div className="p-2 bg-brand-navy/10 rounded-xl text-brand-navy">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-brand-earth/70 font-semibold block">Alamat Nursery & Workshop</span>
                    <span className="text-sm font-bold text-brand-earth">{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl shadow-xs border border-brand-sand-dark/30">
                  <div className="p-2 bg-brand-earth/10 rounded-xl text-brand-earth">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-brand-earth/70 font-semibold block">Jam Operasional</span>
                    <span className="text-sm font-bold text-brand-earth">{settings.opening_hours}</span>
                  </div>
                </div>
              </div>
            </div>

            {settings.instagram_url && (
              <div className="mt-6 pt-6 border-t border-brand-sand-dark/40 flex items-center gap-3">
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-brand-earth hover:text-brand-crimson transition-colors"
                >
                  <Instagram className="w-4 h-4 text-brand-crimson" />
                  <span>Ikuti Galeri di Instagram</span>
                </a>
              </div>
            )}
          </div>

          {/* Right: Quick Consultation Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-brand-sand-dark/30">
              <h3 className="text-xl sm:text-2xl font-bold text-brand-earth mb-2">
                Formulir Rencana Proyek
              </h3>
              <p className="text-brand-earth/70 text-xs sm:text-sm mb-6">
                Isi data singkat berikut, Anda akan langsung terhubung ke WhatsApp resmi kami.
              </p>

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
                    className="w-full px-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 transition-all text-brand-earth"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                    Kota / Wilayah Lokasi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jakarta Selatan, BSD, Bekasi, dll"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 transition-all text-brand-earth"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                    Layanan yang Diminati
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 transition-all text-brand-earth bg-white"
                  >
                    <option value="Jasa Pembuatan Taman Baru">Jasa Pembuatan Taman Baru</option>
                    <option value="Jasa Perencanaan & Desain 3D">Jasa Perencanaan & Desain 3D</option>
                    <option value="Pembuatan Kolam Ikan Koi & Relief">Pembuatan Kolam Ikan Koi & Relief</option>
                    <option value="Jasa Perawatan (Maintenance) Berkala">Jasa Perawatan (Maintenance) Berkala</option>
                    <option value="Pemesanan Tanaman Hias / Pohon">Pemesanan Tanaman Hias / Pohon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                    Catatan / Luas Lahan (Opsional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Luas lahan sekitar 5x4 meter, ingin gaya minimalis dengan rumput jepang..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 transition-all text-brand-earth"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-brand-crimson hover:bg-brand-crimson-hover text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Kirim Konsultasi ke WhatsApp</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
