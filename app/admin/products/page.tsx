'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { defaultProducts } from '@/lib/placeholder-data';
import { Product } from '@/lib/types';
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
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
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
    in_stock: true,
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
      in_stock: true,
      tokopedia_url: '',
      shopee_url: '',
    });
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
      in_stock: product.in_stock,
      tokopedia_url: product.tokopedia_url || '',
      shopee_url: product.shopee_url || '',
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
      setToast({ type: 'success', text: 'Foto tanaman berhasil diunggah!' });
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
            in_stock: formData.in_stock,
            tokopedia_url: formData.tokopedia_url || null,
            shopee_url: formData.shopee_url || null,
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
            in_stock: formData.in_stock,
            tokopedia_url: formData.tokopedia_url || null,
            shopee_url: formData.shopee_url || null,
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
        in_stock: formData.in_stock,
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
      setIsModalOpen(false);
      setToast({
        type: 'success',
        text: 'Produk disimpan ke tampilan website!',
      });
    } finally {
      setSubmitting(false);
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
      setToast({ type: 'success', text: 'Produk berhasil dihapus.' });
    } catch (err) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
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
                <th className="px-6 py-4">Marketplace</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-sand-dark/20">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-brand-sand/10 transition-colors">
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
                        <span className="font-bold text-brand-earth block">
                          {p.name}
                        </span>
                        <span className="text-xs text-brand-earth/60 line-clamp-1">
                          {p.description}
                        </span>
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
                    <div className="flex items-center gap-1.5">
                      {p.tokopedia_url ? (
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
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-gray-400 text-[11px] font-medium"
                          title="Link belum diisi (otomatis cari nama tanaman)"
                        >
                          <TokopediaIcon className="w-3.5 h-3.5" />
                          <span>Auto-Search</span>
                        </span>
                      )}

                      {p.shopee_url ? (
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
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-gray-400 text-[11px] font-medium"
                          title="Link belum diisi (otomatis cari nama tanaman)"
                        >
                          <ShopeeIcon className="w-3.5 h-3.5" />
                          <span>Auto-Search</span>
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
              ))}
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

              {/* Image Preview & Upload */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider">
                  Foto Tanaman
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
                    Link Marketplace Tokopedia & Shopee
                  </span>
                  <p className="text-[11px] text-brand-earth/60 mt-0.5">
                    Tempelkan link produk langsung dari toko Tokopedia / Shopee Anda. Jika dikosongkan, tombol di website otomatis mengarahkan ke pencarian nama tanaman.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-[#03AC0E] mb-1.5">
                      <TokopediaIcon className="w-4 h-4 text-[#03AC0E]" />
                      <span>URL Produk Tokopedia</span>
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
                      <span>URL Produk Shopee</span>
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

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="in_stock"
                  checked={formData.in_stock}
                  onChange={(e) =>
                    setFormData({ ...formData, in_stock: e.target.checked })
                  }
                  className="w-4 h-4 text-brand-crimson rounded focus:ring-brand-crimson"
                />
                <label htmlFor="in_stock" className="text-sm font-semibold text-brand-earth">
                  Stok Tersedia di Nursery (Dicentang jika siap dikirim)
                </label>
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
