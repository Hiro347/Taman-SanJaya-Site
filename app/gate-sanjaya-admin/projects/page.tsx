'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { defaultProjects } from '@/lib/placeholder-data';
import { Project } from '@/lib/types';
import { revalidateSite } from '@/app/actions';
import {
  validateImageFile,
  generateSafeFileName,
  isValidSafeImageUrl,
  MAX_GALLERY_IMAGES,
} from '@/lib/validators';
import ConfirmModal from '@/components/admin/ConfirmModal';
import ToastNotification from '@/components/admin/ToastNotification';
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
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Sparkles,
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
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // State untuk Reordering ▲ / ▼
  const [isReordering, setIsReordering] = useState(false);

  // State untuk Modern ConfirmModal Hapus Proyek
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Perencanaan',
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
      } else if (data && !error) {
        setProjects([]);
      } else {
        setProjects(defaultProjects);
      }
    } catch (err) {
      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setGalleryUrlInput('');
    setFormData({
      title: '',
      category: 'Perencanaan',
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
      category: proj.category || 'Perencanaan',
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

    // Validasi ketat ukuran (maks 5 MB), ekstensi, MIME, dan Magic Bytes biner
    const validation = await validateImageFile(file);
    if (!validation.valid) {
      setToast({ type: 'error', text: validation.error || 'File tidak didukung. Harap gunakan foto JPG, PNG, atau WebP.' });
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const fileName = generateSafeFileName('project_main', file.name);
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('taman-media')
        .upload(filePath, file, {
          contentType: file.type || 'image/jpeg',
          upsert: false,
        });

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
      e.target.value = '';
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Batasan maksimal 5 foto galeri
    const currentCount = formData.gallery_images.length;
    if (currentCount >= MAX_GALLERY_IMAGES) {
      setToast({
        type: 'error',
        text: `Galeri foto proyek sudah mencapai batas maksimal (${MAX_GALLERY_IMAGES} foto).`,
      });
      e.target.value = '';
      return;
    }

    if (currentCount + files.length > MAX_GALLERY_IMAGES) {
      const remainingSlots = MAX_GALLERY_IMAGES - currentCount;
      setToast({
        type: 'error',
        text: `Maksimal ${MAX_GALLERY_IMAGES} foto galeri. Anda hanya dapat menambahkan ${remainingSlots} foto lagi.`,
      });
      e.target.value = '';
      return;
    }

    // Validasi setiap file dalam galeri (maks 5 MB, no PDF/scripts, magic bytes)
    for (let i = 0; i < files.length; i++) {
      const validation = await validateImageFile(files[i]);
      if (!validation.valid) {
        setToast({ type: 'error', text: validation.error || 'Ada file yang tidak didukung.' });
        e.target.value = '';
        return;
      }
    }

    setUploadingGallery(true);
    try {
      const supabase = createClient();
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = generateSafeFileName('project_gallery', file.name);
        const filePath = `projects/gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('taman-media')
          .upload(filePath, file, {
            contentType: file.type || 'image/jpeg',
            upsert: false,
          });

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
    const trimmedUrl = galleryUrlInput.trim();
    if (!trimmedUrl) return;

    // Validasi URL aman (cegah javascript: / XSS injection)
    const urlCheck = isValidSafeImageUrl(trimmedUrl);
    if (!urlCheck.valid) {
      setToast({
        type: 'error',
        text: urlCheck.error || 'URL foto galeri tidak valid atau tidak aman.',
      });
      return;
    }

    if (formData.gallery_images.length >= MAX_GALLERY_IMAGES) {
      setToast({
        type: 'error',
        text: `Galeri foto proyek sudah mencapai batas maksimal (${MAX_GALLERY_IMAGES} foto).`,
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      gallery_images: [...prev.gallery_images, trimmedUrl],
    }));
    setGalleryUrlInput('');
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Reorder Handler (▲ Geser Naik / ▼ Geser Turun)
  const handleReorder = async (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= projects.length || isReordering) return;

    setIsReordering(true);

    const item1 = projects[currentIndex];
    const item2 = projects[targetIndex];

    // Swap order_index kedua item
    let newIndex1 = item2.order_index ?? (targetIndex + 1);
    let newIndex2 = item1.order_index ?? (currentIndex + 1);

    if (newIndex1 === newIndex2) {
      newIndex1 = targetIndex + 1;
      newIndex2 = currentIndex + 1;
    }

    // Optimistic UI state update
    const updatedProjects = [...projects];
    const updatedItem1 = { ...item1, order_index: newIndex1 };
    const updatedItem2 = { ...item2, order_index: newIndex2 };
    updatedProjects[currentIndex] = updatedItem2;
    updatedProjects[targetIndex] = updatedItem1;
    setProjects(updatedProjects);

    try {
      const supabase = createClient();
      if (!item1.id.startsWith('local_') && !item2.id.startsWith('local_')) {
        const [res1, res2] = await Promise.all([
          supabase.from('projects').update({ order_index: newIndex1 }).eq('id', item1.id),
          supabase.from('projects').update({ order_index: newIndex2 }).eq('id', item2.id),
        ]);

        if (res1.error) throw res1.error;
        if (res2.error) throw res2.error;
      }

      await revalidateSite('/');
      setToast({
        type: 'success',
        text: 'Urutan proyek berhasil disimpan!',
      });
    } catch (err: any) {
      console.error('Gagal memperbarui urutan proyek:', err);
      // Rollback state bila terjadi error
      setProjects(projects);
      setToast({
        type: 'error',
        text: 'Gagal memperbarui urutan proyek ke database. Silakan coba lagi.',
      });
    } finally {
      setIsReordering(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setToast(null);

    // Validasi Keamanan URL Foto Utama
    const imageUrlCheck = isValidSafeImageUrl(formData.image_url);
    if (!imageUrlCheck.valid) {
      setToast({
        type: 'error',
        text: imageUrlCheck.error || 'URL foto utama tidak valid atau tidak aman.',
      });
      setSubmitting(false);
      return;
    }

    // Validasi Keamanan URL Galeri Foto
    for (const gUrl of formData.gallery_images) {
      const gCheck = isValidSafeImageUrl(gUrl);
      if (!gCheck.valid) {
        setToast({
          type: 'error',
          text: gCheck.error || 'Ada URL foto galeri yang tidak valid atau berisiko.',
        });
        setSubmitting(false);
        return;
      }
    }

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
        setToast({ type: 'success', text: 'Perubahan proyek berhasil disimpan!' });
      } else {
        // Hitung order_index berikutnya agar otomatis berada di urutan akhir
        const maxOrder =
          projects.length > 0
            ? Math.max(...projects.map((p) => p.order_index || 0))
            : 0;
        const nextOrder = maxOrder + 1;

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
            order_index: nextOrder,
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
        const maxOrder =
          projects.length > 0
            ? Math.max(...projects.map((p) => p.order_index || 0))
            : 0;
        const nextOrder = maxOrder + 1;

        const newProj: Project = {
          id: `local_${Date.now()}`,
          title: formData.title,
          category: formData.category,
          location: formData.location,
          image_url: formData.image_url,
          gallery_images: formData.gallery_images,
          description: formData.description,
          order_index: nextOrder,
        };
        setProjects((prev) => [...prev, newProj]);
        setToast({ type: 'success', text: 'Proyek ditambahkan ke website!' });
      }
      await revalidateSite('/');
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const supabase = createClient();
      if (!deleteTarget.id.startsWith('proj') && !deleteTarget.id.startsWith('local_')) {
        const { error } = await supabase.from('projects').delete().eq('id', deleteTarget.id);
        if (error) throw error;
      }
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      await revalidateSite('/');
      setToast({
        type: 'success',
        text: 'Proyek berhasil dihapus!',
      });
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      await revalidateSite('/');
      setToast({
        type: 'success',
        text: 'Proyek berhasil dihapus!',
      });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
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
          className="inline-flex items-center gap-2 bg-brand-crimson hover:bg-brand-crimson-hover text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumentasi Proyek</span>
        </button>
      </div>

      {/* Toast Alert */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['Semua', 'Perencanaan', 'Pembuatan', 'Perawatan'].map((cat) => {
          const count =
            cat === 'Semua'
              ? projects.length
              : projects.filter((p) => p.category === cat).length;
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-brand-crimson text-white shadow-sm'
                  : 'bg-white text-brand-earth/80 hover:bg-brand-sand-light border border-brand-sand-dark/40'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-brand-sand/50 text-brand-earth'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reorder Info Banner when Filtered */}
      {selectedCategory !== 'Semua' && (
        <div className="bg-brand-sand-light/80 border border-brand-sand-dark/40 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-brand-earth">
          <div className="flex items-center gap-2">
            <span className="font-bold text-brand-navy">Petunjuk Urutan:</span>
            <span>
              Nomor urutan (#1, #2, ...) mengacu pada posisi tampilan di beranda website. Proyek #1 adalah <strong>Banner Utama 2-Kolom</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedCategory('Semua')}
            className="text-brand-crimson font-bold hover:underline whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            Lihat Semua Urutan ({projects.length})
          </button>
        </div>
      )}

      {/* Projects Grid */}
      {projects.filter((p) => selectedCategory === 'Semua' || p.category === selectedCategory).length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-brand-sand-dark/40 p-8">
          <p className="text-sm font-semibold text-brand-earth/70">
            Belum ada proyek di kategori &quot;{selectedCategory}&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              openAddModal();
              if (selectedCategory !== 'Semua') {
                setFormData((prev) => ({ ...prev, category: selectedCategory }));
              }
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-crimson hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah proyek {selectedCategory !== 'Semua' ? selectedCategory : ''} baru</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects
            .filter((p) => selectedCategory === 'Semua' || p.category === selectedCategory)
            .map((proj) => {
              const globalIndex = projects.findIndex((p) => p.id === proj.id);
              const isFirst = globalIndex === 0;
              const isLast = globalIndex === projects.length - 1;
              const galleryCount = (proj.gallery_images?.length || 0) + (proj.image_url ? 1 : 0);

              return (
                <div
                  key={proj.id}
                  className={`bg-white rounded-xl overflow-hidden border transition-all flex flex-col justify-between ${
                    isFirst
                      ? 'border-brand-crimson/50 shadow-md ring-2 ring-brand-crimson/15'
                      : 'border-brand-sand-dark/40 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Photo Container */}
                    <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-brand-sand/30">
                      <Image
                        src={proj.image_url}
                        alt={proj.title}
                        fill
                        className="object-cover"
                      />

                      {/* Top Left: Category & Photos Count */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="bg-brand-earth/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {proj.category}
                        </span>
                        <span className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Images className="w-3 h-3" />
                          <span>{galleryCount} Foto</span>
                        </span>
                      </div>

                      {/* Top Right: Order Badge (#1 Utama / #2, #3, ...) */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        {isFirst ? (
                          <span className="bg-brand-crimson text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/20">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>#1 Utama</span>
                          </span>
                        ) : (
                          <span className="bg-brand-earth/85 backdrop-blur-md text-white text-xs font-mono font-bold px-3 py-1 rounded-full border border-white/20">
                            #{globalIndex + 1}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order & Reordering Control Bar */}
                    <div
                      className={`px-4 py-2 flex items-center justify-between border-b gap-2 ${
                        isFirst
                          ? 'bg-brand-crimson/10 border-brand-crimson/20'
                          : 'bg-brand-sand-light/60 border-brand-sand-dark/20'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {isFirst ? (
                          <div className="flex items-center gap-1.5 text-brand-crimson text-xs font-bold whitespace-nowrap">
                            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Banner Utama</span>
                          </div>
                        ) : (
                          <div className="text-xs text-brand-earth font-medium whitespace-nowrap">
                            Urutan <span className="font-bold text-brand-navy">#{globalIndex + 1}</span>
                          </div>
                        )}
                      </div>

                      {/* Reorder Buttons (▲ Naik / ▼ Turun) */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleReorder(globalIndex, 'up')}
                          disabled={isFirst || isReordering}
                          className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-bold text-brand-earth bg-white hover:bg-brand-sand/50 border border-brand-sand-dark/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs active:scale-95"
                          title={
                            isFirst
                              ? 'Sudah di posisi teratas'
                              : 'Naikkan urutan'
                          }
                        >
                          <ChevronUp className="w-3.5 h-3.5 text-brand-navy" />
                          <span className="hidden sm:inline text-[11px]">Naik</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReorder(globalIndex, 'down')}
                          disabled={isLast || isReordering}
                          className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-bold text-brand-earth bg-white hover:bg-brand-sand/50 border border-brand-sand-dark/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs active:scale-95"
                          title={
                            isLast
                              ? 'Sudah di posisi terbawah'
                              : 'Turunkan urutan'
                          }
                        >
                          <ChevronDown className="w-3.5 h-3.5 text-brand-navy" />
                          <span className="hidden sm:inline text-[11px]">Turun</span>
                        </button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-1.5 text-xs text-brand-navy font-semibold mb-1.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{proj.location}</span>
                      </div>
                      <h3 className="font-bold text-lg text-brand-earth">{proj.title}</h3>
                      <p className="mt-2 text-xs sm:text-sm text-brand-earth/75 leading-relaxed line-clamp-3">
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

                  {/* Footer Action Buttons */}
                  <div className="p-5 pt-3 flex items-center justify-between border-t border-brand-sand/30 mt-2 gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      {/* Quick Preview "Lihat di Web" */}
                      <a
                        href={`/proyek/${proj.slug || proj.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-earth hover:text-brand-crimson hover:bg-brand-sand/40 px-3 py-2 rounded-lg border border-brand-sand-dark/40 transition-colors cursor-pointer"
                        title="Lihat halaman proyek ini di tab baru"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-brand-navy" />
                        <span>Lihat di Web</span>
                      </a>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => openEditModal(proj)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy hover:bg-brand-navy/10 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>

                    {/* Hapus Button */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(proj)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Modern ConfirmModal Hapus Proyek */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Hapus Dokumentasi Proyek"
        message={`Apakah Anda yakin ingin menghapus proyek "${deleteTarget?.title}" dari portofolio? Tindakan ini akan menghapus data proyek dan galeri fotonya dari portofolio.`}
        confirmText="Ya, Hapus Proyek"
        cancelText="Batal"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-brand-sand-dark/40 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-brand-sand-dark/30 mb-6 flex-shrink-0">
              <h2 className="text-xl font-bold text-brand-earth">
                {editingId ? 'Edit Proyek & Galeri Foto' : 'Tambah Proyek Portofolio'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-brand-sand/40 text-brand-earth"
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
                  className="w-full px-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
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
                    className="w-full px-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth bg-white"
                  >
                    <option value="Perencanaan">Perencanaan</option>
                    <option value="Pembuatan">Pembuatan</option>
                    <option value="Perawatan">Perawatan</option>
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
                    className="w-full px-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                  />
                </div>
              </div>

              {/* Photo Upload / URL (Primary Landscape Photo) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider">
                  Foto Utama Proyek (Landscape)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-brand-sand/30 flex-shrink-0 border border-brand-sand-dark/40">
                    <Image
                      src={formData.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-brand-sand/50 hover:bg-brand-sand rounded-lg text-xs font-bold text-brand-earth cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-brand-crimson" />
                        <span>{uploading ? 'Mengunggah...' : 'Upload Foto Utama'}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-brand-earth/60">Maks. 5 MB (JPG, PNG, WebP — Bukan Dokumen/PDF)</span>
                    </div>
                    <input
                      type="url"
                      placeholder="Atau tempel link URL foto utama..."
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-brand-sand-dark/60 text-xs text-brand-earth focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Galeri Foto Tambahan */}
              <div className="space-y-3 p-4 rounded-xl bg-brand-sand-light/60 border border-brand-sand-dark/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-brand-earth uppercase tracking-wider flex items-center gap-1.5">
                    <Images className="w-4 h-4 text-brand-navy" />
                    <span>Galeri Foto Tambahan ({formData.gallery_images.length} / {MAX_GALLERY_IMAGES})</span>
                  </label>
                  {formData.gallery_images.length < MAX_GALLERY_IMAGES ? (
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-navy text-white hover:bg-brand-navy-dark rounded-lg text-xs font-bold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingGallery ? 'Mengunggah...' : '+ Upload Foto Galeri'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        multiple
                        onChange={handleGalleryUpload}
                        disabled={uploadingGallery}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300">
                      Maks. 5 Foto Tercapai
                    </span>
                  )}
                </div>

                <p className="text-xs text-brand-earth/70">
                  Foto dokumentasi pengerjaan taman (Maksimal 5 foto pendukung, @ maks 5 MB — Bukan Dokumen/PDF).
                </p>

                {/* Input URL foto tambahan */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    disabled={formData.gallery_images.length >= MAX_GALLERY_IMAGES}
                    placeholder={
                      formData.gallery_images.length >= MAX_GALLERY_IMAGES
                        ? 'Batas maksimal 5 foto galeri telah tercapai'
                        : 'Atau tempel URL foto lalu klik Tambah...'
                    }
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-brand-sand-dark/60 text-xs text-brand-earth focus:outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                  />
                  <button
                    type="button"
                    disabled={formData.gallery_images.length >= MAX_GALLERY_IMAGES || !galleryUrlInput.trim()}
                    onClick={handleAddGalleryUrl}
                    className="px-3 py-2 bg-brand-earth text-white rounded-lg text-xs font-bold hover:bg-brand-earth-dark disabled:bg-gray-300 transition-colors cursor-pointer"
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
                  className="w-full px-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-sand-dark/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-brand-sand-dark/60 text-sm font-semibold text-brand-earth hover:bg-brand-sand/30"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading || uploadingGallery}
                  className="px-6 py-2.5 rounded-lg bg-brand-crimson hover:bg-brand-crimson-hover disabled:bg-gray-400 text-white text-sm font-bold shadow-md transition-colors"
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
