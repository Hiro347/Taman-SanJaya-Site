'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { defaultProducts } from '@/lib/placeholder-data';
import { Product } from '@/lib/types';
import { revalidateSite } from '@/app/actions';
import { TokopediaIcon, ShopeeIcon } from '@/components/MarketplaceIcons';
import {
  isValidTokopediaUrl,
  isValidShopeeUrl,
  normalizeMarketplaceUrl,
  validateImageFile,
  MAX_GALLERY_IMAGES,
} from '@/lib/validators';
import ConfirmModal from '@/components/admin/ConfirmModal';
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
  ChevronUp,
  ChevronDown,
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
  const [reordering, setReordering] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  // Validasi real-time URL marketplace Tokopedia & Shopee
  const isTokopediaValid = isValidTokopediaUrl(formData.tokopedia_url);
  const isShopeeValid = isValidShopeeUrl(formData.shopee_url);

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
        const sorted = [...data].sort((a, b) => {
          const orderA = typeof a.order_index === 'number' ? a.order_index : 9999;
          const orderB = typeof b.order_index === 'number' ? b.order_index : 9999;
          return orderA - orderB;
        });
        setProducts(sorted);
      } else {
        const sorted = [...defaultProducts].sort((a, b) => {
          const orderA = typeof a.order_index === 'number' ? a.order_index : 9999;
          const orderB = typeof b.order_index === 'number' ? b.order_index : 9999;
          return orderA - orderB;
        });
        setProducts(sorted);
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

    // Validasi ukuran maksimal 5 MB & tipe file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setToast({ type: 'error', text: validation.error || 'Ukuran foto melebihi 5 MB.' });
      e.target.value = '';
      return;
    }

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

    // Batasan maksimal 5 foto galeri
    const currentCount = formData.gallery_images.length;
    if (currentCount >= MAX_GALLERY_IMAGES) {
      setToast({
        type: 'error',
        text: `Galeri foto produk sudah mencapai batas maksimal (${MAX_GALLERY_IMAGES} foto).`,
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

    // Validasi setiap file dalam galeri (maks 5 MB)
    for (let i = 0; i < files.length; i++) {
      const validation = validateImageFile(files[i]);
      if (!validation.valid) {
        setToast({ type: 'error', text: validation.error || 'Ada foto yang melebihi batas 5 MB.' });
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

    if (formData.gallery_images.length >= MAX_GALLERY_IMAGES) {
      setToast({
        type: 'error',
        text: `Galeri foto produk sudah mencapai batas maksimal (${MAX_GALLERY_IMAGES} foto).`,
      });
      return;
    }

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

    // Validasi URL Marketplace Tokopedia & Shopee Resmi
    if (!isValidTokopediaUrl(formData.tokopedia_url)) {
      setToast({
        type: 'error',
        text: 'Link Tokopedia tidak valid! Pastikan link berasal dari domain resmi Tokopedia (tokopedia.com, tokopedia.link, atau tkp.me).',
      });
      setSubmitting(false);
      return;
    }

    if (!isValidShopeeUrl(formData.shopee_url)) {
      setToast({
        type: 'error',
        text: 'Link Shopee tidak valid! Pastikan link berasal dari domain resmi Shopee (shopee.co.id, shp.ee, atau shopee.com).',
      });
      setSubmitting(false);
      return;
    }

    const cleanTokopediaUrl = normalizeMarketplaceUrl(formData.tokopedia_url);
    const cleanShopeeUrl = normalizeMarketplaceUrl(formData.shopee_url);

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
            tokopedia_url: cleanTokopediaUrl,
            shopee_url: cleanShopeeUrl,
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        // Insert new in Supabase
        const maxOrder = products.reduce((max, p) => Math.max(max, p.order_index ?? 0), 0);
        const nextOrderIndex = maxOrder + 1;

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
            order_index: nextOrderIndex,
            tokopedia_url: cleanTokopediaUrl,
            shopee_url: cleanShopeeUrl,
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
      const maxOrder = products.reduce((max, p) => Math.max(max, p.order_index ?? 0), 0);
      const nextOrderIndex = maxOrder + 1;

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
        order_index: editingProduct ? (editingProduct.order_index ?? 1) : nextOrderIndex,
        tokopedia_url: cleanTokopediaUrl || '',
        shopee_url: cleanShopeeUrl || '',
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

  const handleToggleStock = async (product: Product) => {
    const newStock = !product.in_stock;

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, in_stock: newStock } : p))
    );

    try {
      const supabase = createClient();
      if (!product.id.startsWith('p') && !product.id.startsWith('local_')) {
        const { error } = await supabase
          .from('products')
          .update({ in_stock: newStock })
          .eq('id', product.id);

        if (error) throw error;
      }
      await revalidateSite('/');
      setToast({
        type: 'success',
        text: 'Status stok produk diperbarui',
      });
    } catch (err: any) {
      console.error(err);
      // Revert optimistic state
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, in_stock: product.in_stock } : p))
      );
      setToast({
        type: 'error',
        text: 'Gagal memperbarui status stok produk.',
      });
    }
  };

  const handleReorder = async (productId: string, direction: 'up' | 'down') => {
    const currentIndex = products.findIndex((p) => p.id === productId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;

    const currentItem = products[currentIndex];
    const targetItem = products[targetIndex];

    // Determine new indices: swap order_index if distinct, or assign based on target/current positions
    let newIndex1: number;
    let newIndex2: number;

    if (
      typeof currentItem.order_index === 'number' &&
      typeof targetItem.order_index === 'number' &&
      currentItem.order_index !== targetItem.order_index
    ) {
      newIndex1 = targetItem.order_index;
      newIndex2 = currentItem.order_index;
    } else {
      newIndex1 = targetIndex + 1;
      newIndex2 = currentIndex + 1;
    }

    // Optimistic UI update
    const updatedProducts = [...products];
    const updatedCurrent = { ...currentItem, order_index: newIndex1 };
    const updatedTarget = { ...targetItem, order_index: newIndex2 };

    updatedProducts[currentIndex] = updatedTarget;
    updatedProducts[targetIndex] = updatedCurrent;

    // Ensure list stays sorted by order_index
    updatedProducts.sort((a, b) => {
      const orderA = typeof a.order_index === 'number' ? a.order_index : 9999;
      const orderB = typeof b.order_index === 'number' ? b.order_index : 9999;
      return orderA - orderB;
    });

    setProducts(updatedProducts);
    setReordering(true);

    try {
      const supabase = createClient();
      const isMockCurrent = currentItem.id.startsWith('p') || currentItem.id.startsWith('local_');
      const isMockTarget = targetItem.id.startsWith('p') || targetItem.id.startsWith('local_');

      if (!isMockCurrent && !isMockTarget) {
        await Promise.all([
          supabase.from('products').update({ order_index: newIndex1 }).eq('id', currentItem.id),
          supabase.from('products').update({ order_index: newIndex2 }).eq('id', targetItem.id),
        ]);
      } else {
        const updates = [];
        if (!isMockCurrent) {
          updates.push(supabase.from('products').update({ order_index: newIndex1 }).eq('id', currentItem.id));
        }
        if (!isMockTarget) {
          updates.push(supabase.from('products').update({ order_index: newIndex2 }).eq('id', targetItem.id));
        }
        if (updates.length > 0) {
          await Promise.all(updates);
        }
      }

      await revalidateSite('/');
      setToast({
        type: 'success',
        text: `Urutan produk "${currentItem.name}" berhasil diperbarui.`,
      });
    } catch (err: any) {
      console.error(err);
      // Revert if error
      setProducts(products);
      setToast({
        type: 'error',
        text: 'Gagal memperbarui urutan produk.',
      });
    } finally {
      setReordering(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const targetId = deleteTarget.id;
    const targetName = deleteTarget.name;

    try {
      const supabase = createClient();
      if (!targetId.startsWith('p') && !targetId.startsWith('local_')) {
        const { error } = await supabase.from('products').delete().eq('id', targetId);
        if (error) throw error;
      }
      setProducts((prev) => prev.filter((p) => p.id !== targetId));
      await revalidateSite('/');
      setToast({ type: 'success', text: `Produk "${targetName}" berhasil dihapus.` });
    } catch (err: any) {
      console.error(err);
      setProducts((prev) => prev.filter((p) => p.id !== targetId));
      await revalidateSite('/');
      setToast({ type: 'success', text: `Produk "${targetName}" berhasil dihapus.` });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
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
          className="inline-flex items-center gap-2 bg-brand-crimson hover:bg-brand-crimson-hover text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tanaman Baru</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 border ${
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
      <div className="bg-white p-4 rounded-xl border border-brand-sand-dark/40 shadow-xs flex items-center gap-3">
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
      <div className="bg-white rounded-xl border border-brand-sand-dark/40 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-brand-earth">
            <thead className="bg-brand-sand/40 text-brand-earth uppercase text-[11px] font-bold tracking-wider border-b border-brand-sand-dark/30">
              <tr>
                <th className="px-4 py-4 whitespace-nowrap text-center min-w-[90px]">Urutan</th>
                <th className="px-5 py-4 min-w-[260px]">Foto & Nama Tanaman</th>
                <th className="px-5 py-4 whitespace-nowrap min-w-[140px]">Kategori</th>
                <th className="px-5 py-4 whitespace-nowrap min-w-[120px]">Harga</th>
                <th className="px-5 py-4 whitespace-nowrap min-w-[130px]">Status Stok</th>
                <th className="px-5 py-4 whitespace-nowrap min-w-[130px]">Tampil di Web</th>
                <th className="px-5 py-4 whitespace-nowrap min-w-[160px]">Marketplace</th>
                <th className="px-5 py-4 whitespace-nowrap text-right min-w-[110px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-sand-dark/20">
              {filteredProducts.map((p) => {
                const isActive = p.is_active !== false;
                const hasTokopedia = Boolean(p.tokopedia_url && p.tokopedia_url.trim() !== '');
                const hasShopee = Boolean(p.shopee_url && p.shopee_url.trim() !== '');
                const productIndex = products.findIndex((prod) => prod.id === p.id);
                const isFirst = productIndex === 0;
                const isLast = productIndex === products.length - 1;
                const isFiltered = search.trim() !== '';

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isActive
                        ? 'hover:bg-brand-sand/10'
                        : 'bg-gray-50/80 opacity-75 hover:bg-gray-100/80'
                    }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-1.5 bg-brand-sand/30 border border-brand-sand-dark/40 px-2.5 py-1 rounded-xl shadow-2xs">
                        <span className="font-mono font-bold text-xs text-brand-earth tracking-tight">
                          #{p.order_index ?? (productIndex + 1)}
                        </span>
                        <div className="flex flex-col -space-y-0.5">
                          <button
                            type="button"
                            disabled={isFirst || isFiltered || reordering}
                            onClick={() => handleReorder(p.id, 'up')}
                            className="p-0.5 rounded text-brand-earth/60 hover:text-brand-crimson hover:bg-white/70 disabled:opacity-20 disabled:hover:text-brand-earth/60 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                            title={
                              isFiltered
                                ? 'Hapus pencarian untuk mengubah urutan'
                                : isFirst
                                ? 'Sudah di posisi teratas'
                                : 'Pindah ke atas (Naik)'
                            }
                            aria-label="Pindah ke atas"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={isLast || isFiltered || reordering}
                            onClick={() => handleReorder(p.id, 'down')}
                            className="p-0.5 rounded text-brand-earth/60 hover:text-brand-crimson hover:bg-white/70 disabled:opacity-20 disabled:hover:text-brand-earth/60 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                            title={
                              isFiltered
                                ? 'Hapus pencarian untuk mengubah urutan'
                                : isLast
                                ? 'Sudah di posisi terbawah'
                                : 'Pindah ke bawah (Turun)'
                            }
                            aria-label="Pindah ke bawah"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-sand/30 flex-shrink-0 border border-brand-sand-dark/30">
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
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-sand/50 text-brand-earth border border-brand-sand-dark/40 shadow-2xs whitespace-nowrap">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-brand-crimson tabular-nums whitespace-nowrap">
                        {p.price_display || `Rp ${p.price.toLocaleString('id-ID')}`}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(p)}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ${
                          p.in_stock
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300'
                        }`}
                        title={`Klik untuk ubah status ke: ${p.in_stock ? 'Pre-Order / Habis' : 'Tersedia'}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.in_stock ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                          }`}
                        />
                        <span>{p.in_stock ? 'Tersedia' : 'Pre-Order / Habis'}</span>
                      </button>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isActive}
                          onClick={() => toggleActive(p)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-crimson/30 ${
                            isActive ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}
                          title={
                            isActive
                              ? 'Aktif: Klik untuk menyembunyikan dari website (OFF)'
                              : 'Nonaktif: Klik untuk menampilkan di website (ON)'
                          }
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              isActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span
                          className={`text-xs font-bold select-none ${
                            isActive ? 'text-emerald-700' : 'text-gray-400'
                          }`}
                        >
                          {isActive ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
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
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/katalog/${p.slug || p.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-brand-sand/50 text-brand-earth/70 hover:text-brand-crimson transition-colors inline-flex items-center justify-center"
                          title="Lihat di Website Publik"
                          aria-label="Lihat di Website Publik"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-2 rounded-lg hover:bg-brand-sand/50 text-brand-navy transition-colors"
                          title="Edit Produk"
                          aria-label="Edit Produk"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                          title="Hapus Produk"
                          aria-label="Hapus Produk"
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
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-brand-sand-dark/40">
            <div className="flex items-center justify-between pb-4 border-b border-brand-sand-dark/30 mb-6">
              <h2 className="text-xl font-bold text-brand-earth">
                {editingProduct ? 'Edit Tanaman Hias' : 'Tambah Tanaman Hias Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-brand-sand/40 text-brand-earth"
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
                  className="w-full px-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth font-medium"
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
                    className="w-full px-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth bg-white"
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
                    className="w-full px-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
                  />
                </div>
              </div>

              {/* Image Preview & Upload (Foto Utama) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider">
                  Foto Utama Tanaman
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-brand-sand/30 flex-shrink-0 border border-brand-sand-dark/40">
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
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-brand-earth/60">Maks. 5 MB (JPG, PNG, WebP)</span>
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

              {/* Galeri Foto Tambahan Tanaman (Shopee / Tokopedia Carousel) */}
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
                        accept="image/*"
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
                  Foto carousel produk gaya Tokopedia/Shopee (Maksimal 5 foto pendukung, @ maks 5 MB).
                </p>

                {/* Input URL Foto Tambahan */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    disabled={formData.gallery_images.length >= MAX_GALLERY_IMAGES}
                    placeholder={
                      formData.gallery_images.length >= MAX_GALLERY_IMAGES
                        ? 'Batas maksimal 5 foto galeri telah tercapai'
                        : 'Atau tempel URL foto tambahan...'
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

                {/* Thumbnail Preview Grid dengan Individual Delete */}
                {formData.gallery_images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {formData.gallery_images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group w-full aspect-square rounded-lg overflow-hidden border border-brand-sand-dark/60 bg-white"
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
                  className="w-full px-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
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
                  className="w-full px-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
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
                      <span>URL Produk Tokopedia (Opsional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.tokopedia.com/... atau https://tokopedia.link/..."
                      value={formData.tokopedia_url}
                      onChange={(e) =>
                        setFormData({ ...formData, tokopedia_url: e.target.value })
                      }
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm text-brand-earth focus:outline-none transition-colors ${
                        formData.tokopedia_url && !isTokopediaValid
                          ? 'border-red-500 bg-red-50/50 focus:ring-2 focus:ring-red-500/50'
                          : formData.tokopedia_url && isTokopediaValid
                          ? 'border-[#03AC0E] bg-emerald-50/30 focus:ring-2 focus:ring-[#03AC0E]/50'
                          : 'border-brand-sand-dark/60 focus:ring-2 focus:ring-[#03AC0E]/50'
                      }`}
                    />
                    {formData.tokopedia_url && !isTokopediaValid && (
                      <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Link tidak valid. Wajib link resmi Tokopedia (tokopedia.com, tokopedia.link, atau tkp.me).</span>
                      </p>
                    )}
                    {formData.tokopedia_url && isTokopediaValid && (
                      <p className="text-[11px] text-[#03AC0E] flex items-center gap-1 mt-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Link Tokopedia resmi terverifikasi</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-[#EE4D2D] mb-1.5">
                      <ShopeeIcon className="w-4 h-4 text-[#EE4D2D]" />
                      <span>URL Produk Shopee (Opsional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://shopee.co.id/... atau https://shp.ee/..."
                      value={formData.shopee_url}
                      onChange={(e) =>
                        setFormData({ ...formData, shopee_url: e.target.value })
                      }
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm text-brand-earth focus:outline-none transition-colors ${
                        formData.shopee_url && !isShopeeValid
                          ? 'border-red-500 bg-red-50/50 focus:ring-2 focus:ring-red-500/50'
                          : formData.shopee_url && isShopeeValid
                          ? 'border-[#EE4D2D] bg-orange-50/30 focus:ring-2 focus:ring-[#EE4D2D]/50'
                          : 'border-brand-sand-dark/60 focus:ring-2 focus:ring-[#EE4D2D]/50'
                      }`}
                    />
                    {formData.shopee_url && !isShopeeValid && (
                      <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Link tidak valid. Wajib link resmi Shopee (shopee.co.id, shp.ee, atau shopee.com).</span>
                      </p>
                    )}
                    {formData.shopee_url && isShopeeValid && (
                      <p className="text-[11px] text-[#EE4D2D] flex items-center gap-1 mt-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Link Shopee resmi terverifikasi</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Publikasi & Ketersediaan Stok */}
              <div className="p-3.5 rounded-xl bg-brand-sand-light/60 border border-brand-sand-dark/40 space-y-2.5">
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
                  className="px-5 py-2.5 rounded-lg border border-brand-sand-dark/60 text-sm font-semibold text-brand-earth hover:bg-brand-sand/30"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading || !isTokopediaValid || !isShopeeValid}
                  className="px-6 py-2.5 rounded-lg bg-brand-crimson hover:bg-brand-crimson-hover disabled:bg-gray-400 text-white text-sm font-bold shadow-md transition-colors"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Hapus Produk Tanaman"
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.name}" dari katalog tanaman? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />
    </div>
  );
}
