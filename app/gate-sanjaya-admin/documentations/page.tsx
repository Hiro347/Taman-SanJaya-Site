'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { defaultDocumentations } from '@/lib/placeholder-data';
import { Documentation } from '@/lib/types';
import { revalidateSite } from '@/app/actions';
import {
  validateImageFile,
  generateSafeFileName,
  isValidSafeImageUrl,
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
  Eye,
  EyeOff,
  Camera,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Perawatan & Greenhouse', url: '/images/Perawatan.jpg' },
  { label: 'Perencanaan & Survei', url: '/images/Perencanaan.jpg' },
  { label: 'Pembuatan & Konstruksi', url: '/images/Pembuatan.jpg' },
  { label: 'Lanskap Tropis Villa', url: '/images/proyek-2.jpg' },
  { label: 'Taman Asri & Gazebo', url: '/images/proyek-3.jpg' },
  { label: 'Minimalis & Bonsai', url: '/images/proyek-4.avif' },
];

export default function AdminDocumentationsPage() {
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
      const fileName = generateSafeFileName(file.name, 'doc');

      const { data, error } = await supabase.storage
        .from('taman-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('taman-media')
        .getPublicUrl(fileName);

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
    const newActive = doc.is_active === false;
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
          ? `"${doc.title}" sekarang ditampilkan di About Us.`
          : `"${doc.title}" berhasil disembunyikan dari About Us.`,
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
    if (!isValidSafeImageUrl(formData.image_url)) {
      setToast({ type: 'error', text: 'URL foto tidak valid atau tidak aman.' });
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

  const activeCount = documentations.filter((d) => d.is_active !== false).length;
  const hiddenCount = documentations.length - activeCount;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-earth">
              Pengaturan Dokumentasi Aktivitas
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/20">
              About Us Carousel
            </span>
          </div>
          <p className="text-sm text-brand-earth/75 mt-1">
            Kelola foto, judul, dan deskripsi kegiatan nursery &amp; di balik layar yang tampil pada carousel seksi About Us.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-brand-crimson hover:bg-brand-crimson-hover active:scale-[0.98] text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumentasi</span>
        </button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-brand-sand-dark/40 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-brand-sand/40 border border-brand-sand-dark/40 flex items-center justify-center text-brand-earth flex-shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-brand-earth/65 font-medium block">Total Dokumentasi</span>
            <span className="text-xl font-black text-brand-earth">{documentations.length} Item</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-brand-sand-dark/40 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-emerald-800/70 font-medium block">Aktif Tayang di Web</span>
            <span className="text-xl font-black text-emerald-700">{activeCount} Item</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-brand-sand-dark/40 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-amber-800/70 font-medium block">Disembunyikan</span>
            <span className="text-xl font-black text-amber-700">{hiddenCount} Item</span>
          </div>
        </div>
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

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {isHidden ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/95 text-white shadow-xs backdrop-blur-md border border-white/20">
                          <EyeOff className="w-3 h-3" />
                          <span>Tersembunyi</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600/95 text-white shadow-xs backdrop-blur-md border border-white/20">
                          <Eye className="w-3 h-3" />
                          <span>Tayang</span>
                        </span>
                      )}
                    </div>
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
                <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-brand-sand/20 border-t border-brand-sand-dark/30 flex items-center justify-between gap-2">
                  {/* Switch Toggle Visibility */}
                  <button
                    onClick={() => toggleActive(doc)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isHidden
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                    }`}
                    title={isHidden ? 'Klik untuk tampilkan di web' : 'Klik untuk sembunyikan'}
                  >
                    {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isHidden ? 'Disembunyikan' : 'Aktif Tayang'}</span>
                  </button>

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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-brand-sand-dark/40 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-brand-sand-dark/30 bg-brand-sand/15">
              <div>
                <h2 className="text-lg font-bold text-brand-earth">
                  {editingId ? 'Edit Dokumentasi Aktivitas' : 'Tambah Dokumentasi Aktivitas'}
                </h2>
                <p className="text-xs text-brand-earth/70 mt-0.5">
                  Isi judul, deskripsi, dan foto dokumentasi kegiatan nursery / pengerjaan.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-brand-earth/60 hover:text-brand-earth hover:bg-brand-sand/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
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
                  className="w-full px-3.5 py-2.5 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                  Deskripsi Kegiatan <span className="text-brand-crimson">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan ringkas aktivitas yang dilakukan, tujuan, dan metode ilmiah yang diterapkan..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth leading-relaxed"
                />
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

                {/* Upload File Button & URL Input */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-navy hover:bg-brand-navy-dark text-white text-xs font-bold cursor-pointer transition-colors shadow-xs">
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? 'Mengunggah...' : 'Unggah Foto Baru'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                    </label>
                    <span className="text-xs text-brand-earth/60 font-medium">atau pilih foto preset:</span>
                  </div>

                  {/* Preset Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        type="button"
                        key={preset.url}
                        onClick={() => setFormData({ ...formData, image_url: preset.url })}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border transition-all ${
                          formData.image_url === preset.url
                            ? 'bg-brand-crimson text-white border-brand-crimson'
                            : 'bg-white text-brand-earth/80 border-brand-sand-dark/50 hover:bg-brand-sand/30'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom URL Input */}
                  <input
                    type="text"
                    required
                    placeholder="Atau tempel URL gambar langsung (/images/... atau https://...)"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-brand-sand-dark/60 text-xs focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth mt-1 font-mono"
                  />
                </div>
              </div>

              {/* Status Publikasi Switch Toggle */}
              <div className="bg-brand-sand/20 rounded-xl p-3.5 border border-brand-sand-dark/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-earth block">
                    Status Publikasi di Website
                  </span>
                  <span className="text-[11px] text-brand-earth/70 block mt-0.5">
                    {formData.is_active
                      ? 'Dokumentasi akan langsung tampil di carousel About Us.'
                      : 'Dokumentasi akan disembunyikan sementara dari pengunjung.'}
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-crimson" />
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-sand-dark/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-lg border border-brand-sand-dark/60 text-xs font-bold text-brand-earth hover:bg-brand-sand/30 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-lg bg-brand-crimson hover:bg-brand-crimson-hover disabled:bg-gray-400 text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Menyimpan...' : 'Simpan Dokumentasi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
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
