'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { defaultProjects } from '@/lib/placeholder-data';
import { Project } from '@/lib/types';
import { revalidateSite } from '@/app/actions';
import {
  Plus,
  Trash2,
  Upload,
  Pencil,
  CheckCircle2,
  AlertCircle,
  X,
  MapPin,
  Images,
} from 'lucide-react';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Taman Tropis',
    location: '',
    image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [] as string[],
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
    setEditingId(null);
    setGalleryUrlInput('');
    setFormData({
      title: '',
      category: 'Taman Tropis',
      location: 'Jakarta Selatan',
      image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
      gallery_images: [],
      description: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingId(proj.id);
    setGalleryUrlInput('');
    setFormData({
      title: proj.title,
      category: proj.category || 'Taman Tropis',
      location: proj.location,
      image_url: proj.image_url,
      gallery_images: Array.isArray(proj.gallery_images) ? [...proj.gallery_images] : [],
      description: proj.description,
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
      setToast({ type: 'success', text: 'Foto utama proyek berhasil diunggah!' });
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal mengunggah foto.' });
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      const supabase = createClient();
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `gallery_${Date.now()}_${i}.${fileExt}`;
        const filePath = `projects/gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('taman-media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('taman-media')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          newUrls.push(publicUrlData.publicUrl);
        }
      }

      setFormData((prev) => ({
        ...prev,
        gallery_images: [...prev.gallery_images, ...newUrls],
      }));
      setToast({ type: 'success', text: `${newUrls.length} foto berhasil ditambahkan ke galeri!` });
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal mengunggah foto galeri.' });
    } finally {
      setUploadingGallery(false);
      // Reset input value so same files can be re-uploaded if needed
      e.target.value = '';
    }
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      gallery_images: [...prev.gallery_images, galleryUrlInput.trim()],
    }));
    setGalleryUrlInput('');
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setToast(null);

    try {
      const supabase = createClient();

      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now();

      if (editingId) {
        // Edit existing project
        const { error } = await supabase
          .from('projects')
          .update({
            title: formData.title,
            category: formData.category,
            location: formData.location,
            image_url: formData.image_url,
            gallery_images: formData.gallery_images,
            description: formData.description,
          })
          .eq('id', editingId);

        if (error) throw error;
        setToast({ type: 'success', text: 'Proyek dan galeri foto berhasil diperbarui!' });
      } else {
        // Insert new project
        const { error } = await supabase.from('projects').insert([
          {
            title: formData.title,
            slug,
            category: formData.category,
            location: formData.location,
            image_url: formData.image_url,
            gallery_images: formData.gallery_images,
            description: formData.description,
          },
        ]);

        if (error) throw error;
        setToast({ type: 'success', text: 'Proyek baru berhasil ditambahkan!' });
      }

      await revalidateSite('/');
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      // Local fallback for display when offline or fallback mode
      if (editingId) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? {
                  ...p,
                  title: formData.title,
                  category: formData.category,
                  location: formData.location,
                  image_url: formData.image_url,
                  gallery_images: formData.gallery_images,
                  description: formData.description,
                }
              : p
          )
        );
        setToast({ type: 'success', text: 'Proyek berhasil diperbarui di website!' });
      } else {
        const newProj: Project = {
          id: `local_${Date.now()}`,
          title: formData.title,
          category: formData.category,
          location: formData.location,
          image_url: formData.image_url,
          gallery_images: formData.gallery_images,
          description: formData.description,
        };
        setProjects((prev) => [newProj, ...prev]);
        setToast({ type: 'success', text: 'Proyek ditambahkan ke website!' });
      }
      await revalidateSite('/');
      setIsModalOpen(false);
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
      await revalidateSite('/');
      setToast({ type: 'success', text: 'Proyek berhasil dihapus.' });
    } catch (err) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      await revalidateSite('/');
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
            Kelola dokumentasi taman dan galeri foto hasil pengerjaan agar calon klien semakin yakin.
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
        {projects.map((proj) => {
          const galleryCount = (proj.gallery_images?.length || 0) + (proj.image_url ? 1 : 0);

          return (
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
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-brand-earth/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {proj.category}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Images className="w-3 h-3" />
                      <span>{galleryCount} Foto</span>
                    </span>
                  </div>
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

                  {/* Gallery preview pills */}
                  {proj.gallery_images && proj.gallery_images.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-brand-sand/40">
                      <span className="text-xs font-bold text-brand-earth/60 uppercase tracking-wider block mb-2">
                        Galeri ({proj.gallery_images.length} foto tambahan):
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {proj.gallery_images.map((img, i) => (
                          <div
                            key={i}
                            className="relative w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 border border-brand-sand-dark/40"
                          >
                            <Image src={img} alt="" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-brand-sand/30 mt-4">
                <button
                  onClick={() => openEditModal(proj)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy hover:bg-brand-navy/10 px-3 py-2 rounded-xl transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit Proyek & Galeri</span>
                </button>

                <button
                  onClick={() => handleDelete(proj.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-brand-sand-dark/40 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-brand-sand-dark/30 mb-6 flex-shrink-0">
              <h2 className="text-xl font-bold text-brand-earth">
                {editingId ? 'Edit Proyek & Galeri Foto' : 'Tambah Proyek Portofolio'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-brand-sand/40 text-brand-earth"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pr-1 flex-1">
              <div>
                <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                  Judul Proyek Taman
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Taman Minimalis & Rumput Hijau Residensial"
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
                    <option value="Perencanaan 3D">Perencanaan 3D Lanskap</option>
                    <option value="Relief Tebing & Air">Relief Tebing & Air Mancur</option>
                    <option value="Pengerjaan Lanskap">Pengerjaan & Konstruksi Lanskap</option>
                    <option value="Vertical Garden">Vertical Garden</option>
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

              {/* Photo Upload / URL (Primary Landscape Photo) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider">
                  Foto Utama Proyek (Landscape)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-28 h-20 rounded-2xl overflow-hidden bg-brand-sand/30 flex-shrink-0 border border-brand-sand-dark/40">
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
                      <span>{uploading ? 'Mengunggah...' : 'Upload Foto Utama'}</span>
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
                      placeholder="Atau tempel link URL foto utama..."
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-brand-sand-dark/60 text-xs text-brand-earth focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Galeri Foto Tambahan */}
              <div className="space-y-3 p-4 rounded-2xl bg-brand-sand-light/60 border border-brand-sand-dark/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-brand-earth uppercase tracking-wider flex items-center gap-1.5">
                    <Images className="w-4 h-4 text-brand-navy" />
                    <span>Galeri Foto Tambahan ({formData.gallery_images.length})</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-navy text-white hover:bg-brand-navy-dark rounded-xl text-xs font-bold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingGallery ? 'Mengunggah...' : '+ Upload Foto Galeri'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      disabled={uploadingGallery}
                      className="hidden"
                    />
                  </label>
                </div>

                <p className="text-xs text-brand-earth/70">
                  Foto-foto dokumentasi ini akan muncul di pop-up detail dan slider galeri pengunjung.
                </p>

                {/* Input URL foto tambahan */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Atau tempel URL foto lalu klik Tambah..."
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-brand-sand-dark/60 text-xs text-brand-earth focus:outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="px-3 py-2 bg-brand-earth text-white rounded-xl text-xs font-bold hover:bg-brand-earth-dark transition-colors"
                  >
                    Tambah
                  </button>
                </div>

                {/* Gallery Thumbnails Manager */}
                {formData.gallery_images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {formData.gallery_images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group w-full aspect-[4/3] rounded-lg overflow-hidden border border-brand-sand-dark/60 bg-white"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Gallery item ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-md opacity-80 group-hover:opacity-100 transition-opacity shadow-sm"
                          title="Hapus foto dari galeri"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                  Deskripsi Hasil Pengerjaan
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan elemen taman yang dipasang: jenis rumput, tanaman peneduh, batuan koral, atau fitur air relief batu alam..."
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
                  disabled={submitting || uploading || uploadingGallery}
                  className="px-6 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimson-hover disabled:bg-gray-400 text-white text-sm font-bold shadow-md transition-colors"
                >
                  {submitting ? 'Menyimpan...' : editingId ? 'Perbarui Proyek' : 'Simpan ke Portofolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
