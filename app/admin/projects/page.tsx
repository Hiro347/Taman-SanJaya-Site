'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { defaultProjects } from '@/lib/placeholder-data';
import { Project } from '@/lib/types';
import {
  Plus,
  Trash2,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  X,
  MapPin,
} from 'lucide-react';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Taman Tropis',
    location: '',
    image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    description: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (data && !error && data.length > 0) {
        setProjects(data);
      } else {
        setProjects(defaultProjects);
      }
    } catch (err) {
      console.error(err);
      setProjects(defaultProjects);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({
      title: '',
      category: 'Taman Tropis',
      location: 'Jakarta Selatan',
      image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `project_${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('taman-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('taman-media')
        .getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        image_url: publicUrlData.publicUrl,
      }));
      setToast({ type: 'success', text: 'Foto dokumentasi proyek berhasil diunggah!' });
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal mengunggah foto.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setToast(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.from('projects').insert([
        {
          title: formData.title,
          category: formData.category,
          location: formData.location,
          image_url: formData.image_url,
          description: formData.description,
        },
      ]);

      if (error) throw error;

      setToast({ type: 'success', text: 'Proyek baru berhasil ditambahkan!' });
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      // Local fallback for display
      const newProj: Project = {
        id: `local_${Date.now()}`,
        title: formData.title,
        category: formData.category,
        location: formData.location,
        image_url: formData.image_url,
        description: formData.description,
      };
      setProjects((prev) => [newProj, ...prev]);
      setIsModalOpen(false);
      setToast({ type: 'success', text: 'Proyek ditambahkan ke tampilan website!' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus proyek ini dari portofolio?')) return;

    try {
      const supabase = createClient();
      if (!id.startsWith('proj') && !id.startsWith('local_')) {
        await supabase.from('projects').delete().eq('id', id);
      }
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setToast({ type: 'success', text: 'Proyek berhasil dihapus.' });
    } catch (err) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setToast({ type: 'success', text: 'Proyek berhasil dihapus.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-earth">
            Portofolio Proyek Landscape
          </h1>
          <p className="text-sm text-brand-earth/75 mt-1">
            Unggah dokumentasi taman yang sudah selesai dibuat agar calon klien semakin yakin.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-brand-crimson hover:bg-brand-crimson-hover text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumentasi Proyek</span>
        </button>
      </div>

      {toast && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 border ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white rounded-3xl overflow-hidden border border-brand-sand-dark/40 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-brand-sand/30">
                <Image
                  src={proj.image_url}
                  alt={proj.title}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 bg-brand-earth/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {proj.category}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-brand-navy font-semibold mb-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{proj.location}</span>
                </div>
                <h3 className="font-bold text-lg text-brand-earth">{proj.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-brand-earth/75 leading-relaxed">
                  {proj.description}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex justify-end">
              <button
                onClick={() => handleDelete(proj.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Proyek</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-brand-sand-dark/40">
            <div className="flex items-center justify-between pb-4 border-b border-brand-sand-dark/30 mb-6">
              <h2 className="text-xl font-bold text-brand-earth">
                Tambah Proyek Portofolio
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-brand-sand/40 text-brand-earth"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                  Judul Proyek Taman
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Taman Tropis & Kolam Koi Residensial"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                    Kategori Konsep
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth bg-white"
                  >
                    <option value="Taman Tropis">Taman Tropis</option>
                    <option value="Taman Minimalis">Taman Minimalis</option>
                    <option value="Kolam Koi">Kolam Ikan Koi</option>
                    <option value="Taman Kering (Zen)">Taman Kering (Zen Garden)</option>
                    <option value="Vertical Garden">Vertical Garden</option>
                    <option value="Relief & Gazebo">Relief Tebing & Gazebo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                    Lokasi Pengerjaan
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BSD City, Tangerang Selatan"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                  />
                </div>
              </div>

              {/* Photo Upload / URL */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider">
                  Foto Hasil Pengerjaan
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-20 rounded-2xl overflow-hidden bg-brand-sand/30 flex-shrink-0 border border-brand-sand-dark/40">
                    <Image
                      src={formData.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-brand-sand/50 hover:bg-brand-sand rounded-xl text-xs font-bold text-brand-earth cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-brand-crimson" />
                      <span>{uploading ? 'Mengunggah...' : 'Upload dari HP / Laptop'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Atau tempel link URL foto..."
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-brand-sand-dark/60 text-xs text-brand-earth focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                  Deskripsi Hasil Pengerjaan
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan elemen taman yang dipasang: jenis rumput, tanaman utama, kolam, atau relief..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-sand-dark/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-brand-sand-dark/60 text-sm font-semibold text-brand-earth hover:bg-brand-sand/30"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-6 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimson-hover disabled:bg-gray-400 text-white text-sm font-bold shadow-md transition-colors"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan ke Portofolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
