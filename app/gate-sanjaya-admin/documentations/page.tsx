'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { defaultDocumentations } from '@/lib/placeholder-data';
import { Documentation } from '@/lib/types';
import { revalidateSite } from '@/app/actions';
import {
  validateImageFile,
  generateSafeFileName,
} from '@/lib/validators';
import ConfirmModal from '@/components/admin/ConfirmModal';
import ToastNotification from '@/components/admin/ToastNotification';
import {
  Plus,
  Trash2,
  Upload,
  Pencil,
  X,
  Images,
  ChevronUp,
  ChevronDown,
  EyeOff,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const MAX_DESC_WORDS = 15;

const countWords = (text: string) => {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
};

export default function AdminDocumentationsPage() {
  const [mounted, setMounted] = useState(false);
  const [documentations, setDocumentations] = useState<Documentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Reordering state
  const [isReordering, setIsReordering] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Documentation | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '/images/Perawatan.jpg',
    order_index: 0,
    is_active: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Modal ESC key press & body scroll lock
  useEffect(() => {
    if (!isModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting && !uploading) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, submitting, uploading]);

  useEffect(() => {
    fetchDocumentations();
  }, []);

  const fetchDocumentations = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('documentations')
        .select('*')
        .order('order_index', { ascending: true });

      if (data && !error && data.length > 0) {
        setDocumentations(data);
      } else if (data && !error) {
        setDocumentations([]);
      } else {
        setDocumentations(defaultDocumentations);
      }
    } catch (err) {
      console.error(err);
      setDocumentations(defaultDocumentations);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      image_url: '/images/Perawatan.jpg',
      order_index: documentations.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (doc: Documentation) => {
    setEditingId(doc.id);
    setFormData({
      title: doc.title,
      description: doc.description,
      image_url: doc.image_url,
      order_index: doc.order_index ?? 0,
      is_active: doc.is_active !== false,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = await validateImageFile(file);
    if (!validation.valid) {
      setToast({ type: 'error', text: validation.error || 'Format berkas tidak valid.' });
      return;
    }

    try {
      setUploading(true);
      const supabase = createClient();
      const fileName = generateSafeFileName('doc', file.name);
      const filePath = `documentations/${fileName}`;

      const { data, error } = await supabase.storage
        .from('taman-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('taman-media')
        .getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        image_url: publicUrlData.publicUrl,
      }));

      setToast({ type: 'success', text: 'Foto berhasil diunggah ke storage!' });
    } catch (err: any) {
      console.error(err);
      setToast({
        type: 'error',
        text: err.message || 'Gagal mengunggah foto. Periksa hak akses storage.',
      });
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (doc: Documentation) => {
    const currentActive = doc.is_active !== false;
    const newActive = !currentActive;
    const oldDocs = [...documentations];

    // Optimistic UI update
    setDocumentations((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, is_active: newActive } : d))
    );

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('documentations')
        .update({ is_active: newActive })
        .eq('id', doc.id);

      if (error) throw error;

      await revalidateSite('/');
      setToast({
        type: 'success',
        text: newActive
          ? `"${doc.title}" sekarang aktif tayang di website.`
          : `"${doc.title}" berhasil disembunyikan dari website.`,
      });
    } catch (err: any) {
      console.error(err);
      setDocumentations(oldDocs);
      setToast({
        type: 'error',
        text: err.message || 'Gagal mengubah status publikasi dokumentasi.',
      });
    }
  };

  const handleReorder = async (docId: string, direction: 'up' | 'down') => {
    const currentIndex = documentations.findIndex((d) => d.id === docId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= documentations.length) return;

    const newDocs = [...documentations];
    const temp = newDocs[currentIndex];
    newDocs[currentIndex] = newDocs[targetIndex];
    newDocs[targetIndex] = temp;

    // Recalculate order_index sequentially
    const updatedDocs = newDocs.map((item, index) => ({
      ...item,
      order_index: index + 1,
    }));

    setDocumentations(updatedDocs);
    setIsReordering(true);

    try {
      const supabase = createClient();
      const updates = updatedDocs.map((item) =>
        supabase
          .from('documentations')
          .update({ order_index: item.order_index })
          .eq('id', item.id)
      );

      await Promise.all(updates);
      await revalidateSite('/');
      setToast({ type: 'success', text: 'Urutan dokumentasi berhasil diperbarui!' });
    } catch (err: any) {
      console.error(err);
      setToast({ type: 'error', text: 'Gagal memperbarui urutan dokumentasi.' });
      fetchDocumentations();
    } finally {
      setIsReordering(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setToast({ type: 'error', text: 'Judul dokumentasi wajib diisi.' });
      return;
    }
    if (!formData.description.trim()) {
      setToast({ type: 'error', text: 'Deskripsi dokumentasi wajib diisi.' });
      return;
    }
    if (countWords(formData.description) > MAX_DESC_WORDS) {
      setToast({
        type: 'error',
        text: `Deskripsi terlalu panjang. Maksimal ${MAX_DESC_WORDS} kata agar tampilan di website tetap proporsional & rapi.`,
      });
      return;
    }
    if (!formData.image_url || !formData.image_url.trim()) {
      setToast({ type: 'error', text: 'Silakan pilih dan unggah foto dokumentasi dari HP atau laptop Anda.' });
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();

      if (editingId) {
        const { error } = await supabase
          .from('documentations')
          .update({
            title: formData.title.trim(),
            description: formData.description.trim(),
            image_url: formData.image_url.trim(),
            order_index: formData.order_index,
            is_active: formData.is_active,
          })
          .eq('id', editingId);

        if (error) throw error;
        setToast({ type: 'success', text: 'Dokumentasi berhasil diperbarui!' });
      } else {
        const { error } = await supabase.from('documentations').insert([
          {
            title: formData.title.trim(),
            description: formData.description.trim(),
            image_url: formData.image_url.trim(),
            order_index: formData.order_index || documentations.length + 1,
            is_active: formData.is_active,
          },
        ]);

        if (error) throw error;
        setToast({ type: 'success', text: 'Dokumentasi baru berhasil ditambahkan!' });
      }

      await revalidateSite('/');
      setIsModalOpen(false);
      fetchDocumentations();
    } catch (err: any) {
      console.error(err);
      setToast({ type: 'error', text: err.message || 'Gagal menyimpan dokumentasi.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('documentations')
        .delete()
        .eq('id', deleteTarget.id);

      if (error) throw error;

      await revalidateSite('/');
      setToast({ type: 'success', text: `Dokumentasi "${deleteTarget.title}" berhasil dihapus!` });
      setDeleteTarget(null);
      fetchDocumentations();
    } catch (err: any) {
      console.error(err);
      setToast({ type: 'error', text: err.message || 'Gagal menghapus dokumentasi.' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-earth">
            Pengaturan Dokumentasi Aktivitas
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-brand-crimson hover:bg-brand-crimson-hover active:scale-[0.98] text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumentasi</span>
        </button>
      </div>

      {/* List / Table of Documentations */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-brand-earth/60 border border-brand-sand-dark/40 shadow-xs">
          Memuat data dokumentasi aktivitas...
        </div>
      ) : documentations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-brand-sand-dark/40 shadow-xs space-y-3">
          <Images className="w-12 h-12 text-brand-earth/30 mx-auto" />
          <h3 className="text-lg font-bold text-brand-earth">Belum Ada Dokumentasi</h3>
          <p className="text-sm text-brand-earth/70 max-w-md mx-auto">
            Klik tombol &quot;Tambah Dokumentasi&quot; untuk menambahkan foto kegiatan nursery dan pengerjaan lapangan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {documentations.map((doc, index) => {
            const isHidden = doc.is_active === false;

            return (
              <div
                key={doc.id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                  isHidden
                    ? 'border-gray-300 opacity-80 bg-gray-50/70'
                    : 'border-brand-sand-dark/40'
                }`}
              >
                <div>
                  {/* Image Preview Stage */}
                  <div className="relative w-full aspect-[16/10] bg-brand-sand/30 overflow-hidden">
                    <Image
                      src={doc.image_url}
                      alt={doc.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />

                    {/* Order Badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/55 backdrop-blur-md text-white text-xs font-mono font-bold border border-white/20">
                      0{index + 1}
                    </span>

                    {/* Status Badge (like in Proyek: only show badge if hidden) */}
                    {isHidden && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span className="bg-gray-800/85 backdrop-blur-md text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20 shadow-xs">
                          <EyeOff className="w-3 h-3" />
                          <span>Tersembunyi</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-extrabold text-base sm:text-lg text-brand-earth line-clamp-1">
                      {doc.title}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-brand-earth/80 font-normal leading-relaxed line-clamp-3">
                      {doc.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-brand-sand/20 border-t border-brand-sand-dark/30 flex items-center justify-between gap-3 flex-wrap">
                  {/* Switch Toggle Status Publikasi (Konsisten ON / OFF seperti Proyek) */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!isHidden}
                      onClick={() => toggleActive(doc)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-crimson/30 ${
                        !isHidden ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                      title={
                        !isHidden
                          ? 'Aktif: Klik untuk menyembunyikan dari website (OFF)'
                          : 'Nonaktif: Klik untuk menampilkan di website (ON)'
                      }
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          !isHidden ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span
                      className={`text-xs font-bold select-none ${
                        !isHidden ? 'text-emerald-700' : 'text-gray-400'
                      }`}
                    >
                      {!isHidden ? 'Aktif' : 'Disembunyikan'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Reorder Buttons */}
                    <button
                      onClick={() => handleReorder(doc.id, 'up')}
                      disabled={index === 0 || isReordering}
                      className="p-2 rounded-lg text-brand-earth hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-brand-sand-dark/40"
                      title="Geser ke kiri / urutan sebelumnya"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReorder(doc.id, 'down')}
                      disabled={index === documentations.length - 1 || isReordering}
                      className="p-2 rounded-lg text-brand-earth hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-brand-sand-dark/40"
                      title="Geser ke kanan / urutan selanjutnya"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => openEditModal(doc)}
                      className="p-2 rounded-lg bg-white border border-brand-sand-dark/40 text-brand-earth hover:text-brand-crimson hover:border-brand-crimson/50 shadow-xs transition-colors"
                      title="Edit dokumentasi"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setDeleteTarget(doc)}
                      className="p-2 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 shadow-xs transition-colors"
                      title="Hapus dokumentasi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL TAMBAH & EDIT DOKUMENTASI                                     */}
      {/* =================================================================== */}
      {mounted && isModalOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/70 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget && !submitting && !uploading) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl p-5 sm:p-7 md:p-8 shadow-2xl border border-brand-sand-dark/40 max-h-[92vh] sm:max-h-[90vh] flex flex-col my-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-brand-sand-dark/30 mb-5 sm:mb-6 flex-shrink-0">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-brand-earth">
                  {editingId ? 'Edit Dokumentasi Aktivitas' : 'Tambah Dokumentasi Aktivitas'}
                </h2>
                <p className="text-xs text-brand-earth/70 mt-0.5">
                  Isi judul, deskripsi, dan foto dokumentasi kegiatan nursery / pengerjaan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Tutup form dokumentasi"
                className="p-2 rounded-lg hover:bg-brand-sand/40 text-brand-earth/70 hover:text-brand-earth transition-colors cursor-pointer active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 overflow-y-auto pr-1 sm:pr-2 flex-1 scrollbar-thin">
              {/* Judul */}
              <div>
                <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                  Judul Dokumentasi <span className="text-brand-crimson">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Aklimatisasi Bibit Unggul di Nursery Bogor"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                />
              </div>

              {/* Deskripsi Singkat */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider">
                    Deskripsi Singkat <span className="text-brand-crimson">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full transition-colors ${
                      countWords(formData.description) > MAX_DESC_WORDS
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-brand-sand/40 text-brand-earth/80'
                    }`}
                  >
                    {countWords(formData.description)} / {MAX_DESC_WORDS} kata
                  </span>
                </div>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: Landscape design, maintenance, vertical garden"
                  value={formData.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    const words = val.trim() ? val.trim().split(/\s+/) : [];
                    if (words.length > MAX_DESC_WORDS) {
                      setFormData({
                        ...formData,
                        description: words.slice(0, MAX_DESC_WORDS).join(' '),
                      });
                      setToast({
                        type: 'error',
                        text: `Maksimal ${MAX_DESC_WORDS} kata agar tampilan dokumentasi tetap proporsional & rapi.`,
                      });
                    } else {
                      setFormData({ ...formData, description: val });
                    }
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth leading-relaxed transition-colors ${
                    countWords(formData.description) > MAX_DESC_WORDS
                      ? 'border-red-400 bg-red-50/20'
                      : 'border-brand-sand-dark/60'
                  }`}
                />
                <p className="mt-1 text-[11px] text-brand-earth/65">
                  Maksimal {MAX_DESC_WORDS} kata deskripsi ringkas (contoh: <em>Landscape design, maintenance, vertical garden</em>).
                </p>
              </div>

              {/* Foto Dokumentasi */}
              <div>
                <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                  Foto Dokumentasi <span className="text-brand-crimson">*</span>
                </label>

                {/* Preview Frame */}
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-brand-sand-dark/60 bg-brand-sand/20 mb-3">
                  <Image
                    src={formData.image_url}
                    alt="Preview Dokumentasi"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Upload File Button from HP / Laptop */}
                <div className="space-y-2">
                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-dark active:scale-[0.98] text-white text-xs sm:text-sm font-bold cursor-pointer transition-all shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? 'Mengunggah dari Perangkat...' : 'Pilih Foto dari HP / Laptop'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </label>
                  <p className="text-[11px] text-brand-earth/65">
                    Format yang didukung: JPG, JPEG, PNG, WebP (Maksimal ukuran file 5 MB).
                  </p>
                </div>
              </div>

              {/* Status Publikasi Switch Toggle */}
              <div className="p-3.5 rounded-xl bg-brand-sand-light/60 border border-brand-sand-dark/40 space-y-2.5">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.is_active ? 'bg-emerald-600' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={formData.is_active}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        formData.is_active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <div>
                    <span className="text-xs font-bold text-brand-earth uppercase tracking-wider block">
                      Status Publikasi di Website
                    </span>
                    <span className="text-[11px] text-brand-earth/70">
                      {formData.is_active
                        ? 'Aktif (Langsung tampil pada carousel seksi About Us)'
                        : 'Non-Aktif / Disembunyikan (Tidak muncul di website publik)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-sand-dark/30 flex-shrink-0 mt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-4 sm:px-5 py-2.5 rounded-lg border border-brand-sand-dark/60 text-xs sm:text-sm font-semibold text-brand-earth hover:bg-brand-sand/30 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 sm:px-6 py-2.5 rounded-lg bg-brand-crimson hover:bg-brand-crimson-hover disabled:bg-gray-400 text-white text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Menyimpan...' : editingId ? 'Perbarui Dokumentasi' : 'Simpan Dokumentasi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* =================================================================== */}
      {/* CONFIRM MODAL HAPUS                                                 */}
      {/* =================================================================== */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Dokumentasi Aktivitas?"
        message={`Apakah Anda yakin ingin menghapus dokumentasi "${deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
