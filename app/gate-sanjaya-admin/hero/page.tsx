'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { defaultSiteSettings } from '@/lib/placeholder-data';
import { SiteSettings } from '@/lib/types';
import { revalidateSite } from '@/app/actions';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  Clock,
  Instagram,
  MessageSquare,
} from 'lucide-react';
import ToastNotification from '@/components/admin/ToastNotification';

export default function AdminContactPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const supabase = createClient();
      const payload = {
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
        text: 'Perubahan kontak berhasil disimpan!',
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
        Memuat data pengaturan kontak...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-earth">
          Pengaturan Kontak & WhatsApp Resmi
        </h1>
        <p className="text-sm text-brand-earth/75 mt-1">
          Kelola nomor WhatsApp pemesanan, pesan otomatis konsultasi, alamat workshop, dan jam operasional Taman San Jaya.
        </p>
      </div>

      {/* Status Notification */}
      <ToastNotification toast={statusMsg} onClose={() => setStatusMsg(null)} />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* WhatsApp & Contacts Section */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-brand-sand-dark/40 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-brand-earth flex items-center gap-2">
            <Phone className="w-5 h-5 text-brand-crimson" />
            <span>Nomor WhatsApp & Informasi Kontak Resmi</span>
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
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                />
              </div>
              <p className="text-[11px] text-brand-earth/60 mt-1">
                Digunakan untuk tombol &quot;Konsultasi Sekarang&quot; di beranda &amp; floating widget.
              </p>
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
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
              Pesan Pembuka Otomatis WhatsApp
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-earth/50" />
              <textarea
                rows={2}
                value={settings.whatsapp_message || ''}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp_message: e.target.value })
                }
                placeholder="Halo Taman San Jaya, saya ingin konsultasi mengenai perencanaan &amp; pembuatan taman."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
              />
            </div>
            <p className="text-[11px] text-brand-earth/60 mt-1">
              Pesan awal yang otomatis terisi ketika pengunjung mengklik tombol WhatsApp di website.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
              Alamat Workshop &amp; Nursery
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-earth/50" />
              <textarea
                rows={2}
                value={settings.address || ''}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
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
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
              />
            </div>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="sticky bottom-6 z-30">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-brand-crimson hover:bg-brand-crimson-hover disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-xl shadow-xl transition-all"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Kontak'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
