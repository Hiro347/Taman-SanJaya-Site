'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { defaultSiteSettings } from '@/lib/placeholder-data';
import { SiteSettings } from '@/lib/types';
import { revalidateSite } from '@/app/actions';
import {
  Save,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  MapPin,
  Clock,
  Instagram,
} from 'lucide-react';

export default function AdminHeroPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (data && !error) {
        setSettings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMsg(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `hero_${Date.now()}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('taman-media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('taman-media')
        .getPublicUrl(filePath);

      setSettings((prev) => ({
        ...prev,
        hero_image_url: publicUrlData.publicUrl,
      }));

      setStatusMsg({
        type: 'success',
        text: 'Foto baru berhasil diunggah! Jangan lupa klik "Simpan Perubahan" di bawah.',
      });
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Gagal mengunggah foto ke storage Supabase.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const supabase = createClient();
      const payload = {
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        hero_image_url: settings.hero_image_url,
        whatsapp_number: settings.whatsapp_number,
        whatsapp_message: settings.whatsapp_message,
        address: settings.address,
        opening_hours: settings.opening_hours,
        instagram_url: settings.instagram_url,
        updated_at: new Date().toISOString(),
      };

      // Check if existing record exists
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await supabase
          .from('site_settings')
          .update(payload)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([payload]);
        if (error) throw error;
      }

      await revalidateSite('/');

      setStatusMsg({
        type: 'success',
        text: 'Semua perubahan berhasil disimpan ke website!',
      });
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Gagal menyimpan perubahan ke database.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-brand-earth/60">
        Memuat data pengaturan...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-earth">
          Pengaturan Banner Hero & Kontak
        </h1>
        <p className="text-sm text-brand-earth/75 mt-1">
          Ubah foto beranda taman, judul tulisan promosi, dan nomor WhatsApp resmi Taman San Jaya tanpa coding.
        </p>
      </div>

      {/* Status Notification */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 border ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Hero Banner Image */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand-dark/40 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-brand-earth">
            1. Foto Banner Hero (Pemandangan Taman)
          </h2>

          {/* Current Image Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-brand-earth/70 uppercase">
              Pratinjau Foto Saat Ini
            </label>
            <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-brand-sand/30 border border-brand-sand-dark/40">
              <Image
                src={settings.hero_image_url}
                alt="Pratinjau Hero"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Upload Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-2">
                Unggah File Foto dari HP / Laptop
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-brand-sand-dark hover:border-brand-crimson rounded-2xl p-6 cursor-pointer bg-brand-sand/20 hover:bg-brand-sand/40 transition-colors">
                <Upload className="w-8 h-8 text-brand-crimson mb-2" />
                <span className="text-xs font-bold text-brand-earth">
                  {uploading ? 'Sedang Mengunggah...' : 'Pilih Foto Baru'}
                </span>
                <span className="text-[11px] text-brand-earth/60 mt-1">
                  JPG, PNG, atau WebP
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-2">
                Atau Tempel URL Gambar Langsung
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-earth/50" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={settings.hero_image_url}
                  onChange={(e) =>
                    setSettings({ ...settings, hero_image_url: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-sand-dark/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                />
              </div>
              <p className="text-[11px] text-brand-earth/60 mt-2">
                Jika Anda memiliki foto di internet (Unsplash, Google Drive, dll), tempel linknya di sini.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Headline & Tagline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand-dark/40 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-brand-earth">
            2. Teks Promosi & Headline Beranda
          </h2>

          <div>
            <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
              Judul Utama (Headline Besar)
            </label>
            <input
              type="text"
              required
              value={settings.hero_title}
              onChange={(e) =>
                setSettings({ ...settings, hero_title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
              Subheadline / Penjelasan Singkat
            </label>
            <textarea
              rows={3}
              required
              value={settings.hero_subtitle}
              onChange={(e) =>
                setSettings({ ...settings, hero_subtitle: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth leading-relaxed"
            />
          </div>
        </div>

        {/* Section 3: WhatsApp & Contacts */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand-dark/40 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-brand-earth">
            3. Nomor WhatsApp & Informasi Kontak
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                Nomor WhatsApp (Awali 62 tanpa tanda +)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-earth/50" />
                <input
                  type="text"
                  required
                  placeholder="6281234567890"
                  value={settings.whatsapp_number}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsapp_number: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                Jam Operasional
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-earth/50" />
                <input
                  type="text"
                  placeholder="Senin - Minggu: 08.00 - 18.00 WIB"
                  value={settings.opening_hours || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, opening_hours: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
              Alamat Workshop & Nursery
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-earth/50" />
              <textarea
                rows={2}
                value={settings.address || ''}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
              Link Instagram (Opsional)
            </label>
            <div className="relative">
              <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-earth/50" />
              <input
                type="url"
                placeholder="https://instagram.com/tamansanjaya"
                value={settings.instagram_url || ''}
                onChange={(e) =>
                  setSettings({ ...settings, instagram_url: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
              />
            </div>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="sticky bottom-6 z-30">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-brand-crimson hover:bg-brand-crimson-hover disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-2xl shadow-xl transition-all"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Menyimpan Perubahan...' : 'Simpan Semua Perubahan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
