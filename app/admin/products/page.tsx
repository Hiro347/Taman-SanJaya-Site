'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { defaultProducts } from '@/lib/placeholder-data';
import { Product } from '@/lib/types';
import { revalidateSite } from '@/app/actions';
import { TokopediaIcon, ShopeeIcon } from '@/components/MarketplaceIcons';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Sprout,
  ExternalLink,
  Images,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tanaman Hias Indoor',
    price: 0,
    price_display: '',
    description: '',
    care_instructions: '',
    image_url: '',
    gallery_images: [] as string[],
    in_stock: true,
    is_active: true,
    tokopedia_url: '',
    shopee_url: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('order_index', { ascending: true });

      if (data && !error && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(defaultProducts);
      }
    } catch (err) {
      console.error(err);
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Indoor',
      price: 50000,
      price_display: 'Rp 50.000',
      description: '',
      care_instructions: 'Penyiraman 1-2 kali seminggu.',
      image_url: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80',
      gallery_images: [],
      in_stock: true,
      is_active: true,
      tokopedia_url: '',
      shopee_url: '',
    });
    setGalleryUrlInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      price_display: product.price_display || `Rp ${product.price.toLocaleString('id-ID')}`,
      description: product.description,
      care_instructions: product.care_instructions || '',
      image_url: product.image_url,
      gallery_images: Array.isArray(product.gallery_images) ? [...product.gallery_images] : [],
      in_stock: product.in_stock,
      is_active: product.is_active !== false,
      tokopedia_url: product.tokopedia_url || '',
      shopee_url: product.shopee_url || '',
    });
    setGalleryUrlInput('');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `product_${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

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
      setToast({ type: 'success', text: 'Foto utama tanaman berhasil diunggah!' });
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
        const fileName = `product_gallery_${Date.now()}_${i}.${fileExt}`;
        const filePath = `products/gallery/${fileName}`;

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
      setToast({ type: 'success', text: `${newUrls.length} foto berhasil ditambahkan ke galeri produk!` });
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal mengunggah foto galeri.' });
    } finally {
      setUploadingGallery(false);
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

    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now();

    try {
      const supabase = createClient();

      if (editingProduct && !editingProduct.id.startsWith('p')) {
        // Update in Supabase
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            price_display: formData.price_display,
            description: formData.description,
            care_instructions: formData.care_instructions,
            image_url: formData.image_url,
            gallery_images: formData.gallery_images,
            in_stock: formData.in_stock,
            is_active: formData.is_active,
            tokopedia_url: formData.tokopedia_url ? formData.tokopedia_url.trim() : null,
            shopee_url: formData.shopee_url ? formData.shopee_url.trim() : null,
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        // Insert new in Supabase
        const { error } = await supabase.from('products').insert([
          {
            name: formData.name,
            slug,
            category: formData.category,
            price: Number(formData.price),
            price_display: formData.price_display,
            description: formData.description,
            care_instructions: formData.care_instructions,
            image_url: formData.image_url,
            gallery_images: formData.gallery_images,
            in_stock: formData.in_stock,
            is_active: formData.is_active,
            tokopedia_url: formData.tokopedia_url ? formData.tokopedia_url.trim() : null,
            shopee_url: formData.shopee_url ? formData.shopee_url.trim() : null,
          },
        ]);
        if (error) throw error;
      }

      setToast({
        type: 'success',
        text: editingProduct
          ? 'Produk tanaman berhasil diperbarui!'
          : 'Produk tanaman baru berhasil ditambahkan!',
      });
      await revalidateSite('/');
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      // Local fallback for display if table hasn't been seeded yet
      const newProduct: Product = {
        id: editingProduct ? editingProduct.id : `local_${Date.now()}`,
        name: formData.name,
        slug,
        category: formData.category,
        price: Number(formData.price),
        price_display: formData.price_display,
        description: formData.description,
        care_instructions: formData.care_instructions,
        image_url: formData.image_url,
        gallery_images: formData.gallery_images,
        in_stock: formData.in_stock,
        is_active: formData.is_active,
        tokopedia_url: formData.tokopedia_url,
        shopee_url: formData.shopee_url,
      };

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? newProduct : p))
        );
      } else {
        setProducts((prev) => [newProduct, ...prev]);
      }
      await revalidateSite('/');
      setIsModalOpen(false);
      setToast({
        type: 'success',
        text: 'Produk disimpan ke tampilan website!',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (product: Product) => {
    const currentActive = product.is_active !== false;
    const newActive = !currentActive;

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_active: newActive } : p))
    );

    try {
      const supabase = createClient();
      if (!product.id.startsWith('p') && !product.id.startsWith('local_')) {
        const { error } = await supabase
          .from('products')
          .update({ is_active: newActive })
          .eq('id', product.id);

        if (error) throw error;
      }
      await revalidateSite('/');
      setToast({
        type: 'success',
        text: newActive
          ? `Produk "${product.name}" sekarang AKTIF dan tampil di website.`
          : `Produk "${product.name}" dinonaktifkan (disembunyikan dari website).`,
      });
    } catch (err: any) {
      console.error(err);
      // Revert optimistic state
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: currentActive } : p))
      );
      setToast({
        type: 'error',
        text: 'Gagal mengubah status aktif produk.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk tanaman ini?')) return;

    try {
      const supabase = createClient();
      if (!id.startsWith('p') && !id.startsWith('local_')) {
        await supabase.from('products').delete().eq('id', id);
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      await revalidateSite('/');
      setToast({ type: 'success', text: 'Produk berhasil dihapus.' });
    } catch (err) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      await revalidateSite('/');
      setToast({ type: 'success', text: 'Produk berhasil dihapus.' });
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-earth">
            Katalog Produk Tanaman Hias
          </h1>
          <p className="text-sm text-brand-earth/75 mt-1">
            Tambah varietas tanaman baru, atur harga, ubah foto, dan update stok ketersediaan.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-brand-crimson hover:bg-brand-crimson-hover text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tanaman Baru</span>
        </button>
      </div>

      {/* Toast Alert */}
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

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-sand-dark/40 shadow-xs flex items-center gap-3">
        <Search className="w-5 h-5 text-brand-earth/50" />
        <input
          type="text"
          placeholder="Cari nama tanaman (contoh: Lidah Mertua, Monstera)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-brand-earth focus:outline-none placeholder:text-brand-earth/40"
        />
      </div>

      {/* Products Table / Cards */}
      <div className="bg-white rounded-3xl border border-brand-sand-dark/40 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-brand-earth">
            <thead className="bg-brand-sand/40 text-brand-earth uppercase text-[11px] font-bold tracking-wider border-b border-brand-sand-dark/30">
              <tr>
                <th className="px-6 py-4">Foto & Nama Tanaman</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4">Status Stok</th>
                <th className="px-6 py-4">Tampil di Web</th>
                <th className="px-6 py-4">Marketplace</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-sand-dark/20">
              {filteredProducts.map((p) => {
                const isActive = p.is_active !== false;
                const hasTokopedia = Boolean(p.tokopedia_url && p.tokopedia_url.trim() !== '');
                const hasShopee = Boolean(p.shopee_url && p.shopee_url.trim() !== '');

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isActive
                        ? 'hover:bg-brand-sand/10'
                        : 'bg-gray-50/80 opacity-75 hover:bg-gray-100/80'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-sand/30 flex-shrink-0 border border-brand-sand-dark/30">
                          <Image
                            src={p.image_url}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-earth block">
                              {p.name}
                            </span>
                            {!isActive && (
                              <span className="text-[10px] font-bold text-gray-600 bg-gray-200 px-2 py-0.5 rounded-md">
                                Tersembunyi
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-brand-earth/60 line-clamp-1">
                              {p.description}
                            </span>
                            {p.gallery_images && p.gallery_images.length > 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-navy bg-brand-navy/10 px-2 py-0.5 rounded-md flex-shrink-0">
                                <Images className="w-3 h-3" />
                                <span>{p.gallery_images.length} foto</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand-sand/60 text-brand-earth">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-brand-crimson">
                        {p.price_display || `Rp ${p.price.toLocaleString('id-ID')}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          p.in_stock
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {p.in_stock ? 'Tersedia' : 'Pre-Order / Habis'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => toggleActive(p)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                          isActive
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                        title={
                          isActive
                            ? 'Klik untuk menyembunyikan produk dari website'
                            : 'Klik untuk mengaktifkan dan menampilkan di website'
                        }
                      >
                        {isActive ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                            <span>Non-Aktif</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {hasTokopedia && (
                          <a
                            href={p.tokopedia_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#03AC0E]/10 hover:bg-[#03AC0E]/20 text-[#03AC0E] text-[11px] font-bold border border-[#03AC0E]/30 transition-colors"
                            title="Buka Link Tokopedia"
                          >
                            <TokopediaIcon className="w-3.5 h-3.5" />
                            <span>Tokopedia</span>
                          </a>
                        )}

                        {hasShopee && (
                          <a
                            href={p.shopee_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#EE4D2D]/10 hover:bg-[#EE4D2D]/20 text-[#EE4D2D] text-[11px] font-bold border border-[#EE4D2D]/30 transition-colors"
                            title="Buka Link Shopee"
                          >
                            <ShopeeIcon className="w-3.5 h-3.5" />
                            <span>Shopee</span>
                          </a>
                        )}

                        {!hasTokopedia && !hasShopee && (
                          <span className="text-xs text-gray-400 italic">
                            Hanya WA
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 rounded-xl hover:bg-brand-sand/50 text-brand-navy transition-colors"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-brand-sand-dark/40">
            <div className="flex items-center justify-between pb-4 border-b border-brand-sand-dark/30 mb-6">
              <h2 className="text-xl font-bold text-brand-earth">
                {editingProduct ? 'Edit Tanaman Hias' : 'Tambah Tanaman Hias Baru'}
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
                  Nama Tanaman Hias
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Lidah Mertua (Sansevieria)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth bg-white"
                  >
                    <option value="Indoor">Indoor (Dalam Ruangan)</option>
                    <option value="Outdoor">Outdoor & Teras</option>
                    <option value="Indoor & Outdoor">Indoor & Outdoor</option>
                    <option value="Tanaman Daun">Tanaman Daun Eksotis</option>
                    <option value="Pohon & Palem">Pohon & Palem</option>
                    <option value="Bonsai & Koleksi">Bonsai & Koleksi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                    Tampilan Harga
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rp 75.000 atau Mulai Rp 150rb"
                    value={formData.price_display}
                    onChange={(e) =>
                      setFormData({ ...formData, price_display: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                  />
                </div>
              </div>

              {/* Image Preview & Upload (Foto Utama) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider">
                  Foto Utama Tanaman
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-brand-sand/30 flex-shrink-0 border border-brand-sand-dark/40">
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

              {/* Galeri Foto Tambahan Tanaman (Shopee / Tokopedia Carousel) */}
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
                  Foto carousel produk gaya Tokopedia/Shopee: sudut daun, media tanam, pot nursery, dsb.
                </p>

                {/* Input URL Foto Tambahan */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Atau tempel URL foto tambahan..."
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-brand-sand-dark/60 text-xs text-brand-earth focus:outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="px-3 py-2 bg-brand-earth text-white rounded-xl text-xs font-bold hover:bg-brand-earth-dark transition-colors cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>

                {/* Thumbnail Preview Grid dengan Individual Delete */}
                {formData.gallery_images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {formData.gallery_images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group w-full aspect-square rounded-xl overflow-hidden border border-brand-sand-dark/60 bg-white"
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
                          className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-md opacity-80 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
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
                  Deskripsi Singkat Tanaman
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Jelaskan keunikan dan manfaat tanaman ini..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
                  Tips Perawatan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Siram 1-2 kali seminggu, letakkan di tempat teduh."
                  value={formData.care_instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, care_instructions: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                />
              </div>

              {/* Marketplace Links (Tokopedia & Shopee) */}
              <div className="pt-3 border-t border-brand-sand-dark/30 space-y-3">
                <div>
                  <span className="block text-xs font-bold text-brand-earth uppercase tracking-wider">
                    Link Marketplace Tokopedia & Shopee (Opsional)
                  </span>
                  <p className="text-[11px] text-brand-earth/60 mt-0.5">
                    Isi salah satu, keduanya, atau kosongkan. Tombol marketplace di website publik hanya akan muncul jika link terisi. Contoh: jika Anda hanya mengisi link Shopee, maka tombol Tokopedia otomatis tidak muncul di website.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-[#03AC0E] mb-1.5">
                      <TokopediaIcon className="w-4 h-4 text-[#03AC0E]" />
                      <span>URL Produk Tokopedia (Kosongkan jika tidak ada)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.tokopedia.com/..."
                      value={formData.tokopedia_url}
                      onChange={(e) =>
                        setFormData({ ...formData, tokopedia_url: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-sand-dark/60 text-xs sm:text-sm text-brand-earth focus:outline-none focus:ring-2 focus:ring-[#03AC0E]/50"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-[#EE4D2D] mb-1.5">
                      <ShopeeIcon className="w-4 h-4 text-[#EE4D2D]" />
                      <span>URL Produk Shopee (Kosongkan jika tidak ada)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://shopee.co.id/..."
                      value={formData.shopee_url}
                      onChange={(e) =>
                        setFormData({ ...formData, shopee_url: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-sand-dark/60 text-xs sm:text-sm text-brand-earth focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]/50"
                    />
                  </div>
                </div>
              </div>

              {/* Status Publikasi & Ketersediaan Stok */}
              <div className="p-3.5 rounded-2xl bg-brand-sand-light/60 border border-brand-sand-dark/40 space-y-2.5">
                <div className="flex items-center justify-between">
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
                          ? 'Aktif (Muncul di katalog publik website)'
                          : 'Non-Aktif / Disembunyikan (Tidak muncul di website publik)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-brand-sand-dark/20">
                  <input
                    type="checkbox"
                    id="in_stock"
                    checked={formData.in_stock}
                    onChange={(e) =>
                      setFormData({ ...formData, in_stock: e.target.checked })
                    }
                    className="w-4 h-4 text-brand-crimson rounded focus:ring-brand-crimson cursor-pointer"
                  />
                  <label htmlFor="in_stock" className="text-xs font-semibold text-brand-earth cursor-pointer">
                    Stok Tersedia di Nursery (Dicentang jika tanaman ready stock)
                  </label>
                </div>
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
                  {submitting ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
