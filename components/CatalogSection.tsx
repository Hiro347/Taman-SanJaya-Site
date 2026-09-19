'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Droplets, SearchX, RotateCcw, Sprout, Sparkles, TreePine } from 'lucide-react';
import { TokopediaIcon, ShopeeIcon, WhatsAppIcon } from '@/components/MarketplaceIcons';
import { Product, SiteSettings } from '@/lib/types';

interface CatalogSectionProps {
  products: Product[];
  settings: SiteSettings;
}

export default function CatalogSection({ products, settings }: CatalogSectionProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [products, searchQuery]);

  return (
    <section id="catalog" className="-mt-16 sm:-mt-24 lg:-mt-32 pb-14 sm:pb-18 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto relative z-20">
      {/* Outer Sand Background Canvas */}
      <div className="bg-brand-sand/40 border border-brand-sand-dark/40 rounded-2xl sm:rounded-3xl p-5 sm:p-9 lg:p-11">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-earth tracking-tight">
              Produk Kami
            </h2>
            <span className="block text-sm sm:text-base font-medium text-brand-earth/70 tracking-[0.2em] uppercase mt-1">
              我们的產品
            </span>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-earth/60" />
            <input
              type="text"
              placeholder="Cari nama tanaman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-brand-sand-dark/60 text-sm text-brand-earth placeholder:text-brand-earth/50 focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Product Grid or Concept 2: Skeleton Silhouette & Coming Soon Showcase */}
        {filteredProducts.length === 0 ? (
          searchQuery.trim() ? (
            /* Search Empty State */
            <div className="border-2 border-dashed border-brand-earth/25 bg-white/75 backdrop-blur-md rounded-2xl p-8 sm:p-10 text-center max-w-xl mx-auto space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-brand-sand/40 border border-brand-sand-dark/40 flex items-center justify-center text-brand-earth/70 mx-auto">
                <SearchX className="w-6 h-6 text-brand-crimson" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl text-brand-earth">
                  Tanaman &quot;{searchQuery}&quot; Tidak Ditemukan
                </h3>
                <p className="text-xs sm:text-sm text-brand-earth/75 mt-1.5 leading-relaxed max-w-md mx-auto">
                  Varietas ini belum terdaftar di katalog online, namun kami memiliki ratusan koleksi tanaman lainnya langsung di kebun nursery kami.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-brand-sand-dark/50 bg-white hover:bg-brand-sand/40 text-brand-earth text-xs font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Pencarian</span>
                </button>
                <a
                  href={`https://wa.me/${settings?.whatsapp_number || '6282110998588'}?text=${encodeURIComponent(
                    `Halo Taman San Jaya, apakah varietas tanaman "${searchQuery}" tersedia di nursery Anda?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-crimson hover:bg-brand-crimson-hover text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Tanyakan ke Nursery</span>
                </a>
              </div>
            </div>
          ) : (
            /* Coming Soon Nursery Skeleton Showcase (Concept 2) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Card 1: Koleksi Tanaman Indoor & Teraklimatisasi */}
              <div className="border-2 border-dashed border-brand-earth/30 bg-white/75 backdrop-blur-md rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Batch Nursery Baru</span>
                    </span>
                    <span className="text-[11px] font-bold text-brand-earth/60 font-mono uppercase tracking-wider">
                      Katalog #01
                    </span>
                  </div>

                  <div className="relative w-full aspect-[16/9] sm:aspect-[21/10] rounded-xl overflow-hidden bg-brand-sand/30 border border-brand-sand-dark/40 flex flex-col items-center justify-center p-6 text-center mb-5">
                    <div
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage: 'radial-gradient(#5C4033 1.5px, transparent 1.5px)',
                        backgroundSize: '18px 18px',
                      }}
                    />
                    <div className="relative z-10 w-12 h-12 rounded-full bg-white shadow-sm border border-brand-sand-dark/40 flex items-center justify-center text-emerald-700 mb-2.5">
                      <Sprout className="w-6 h-6" />
                    </div>
                    <span className="relative z-10 text-xs font-extrabold text-brand-earth tracking-wide uppercase">
                      Tanaman Hias Daun &amp; Indoor
                    </span>
                    <span className="relative z-10 text-[11px] text-brand-earth/70 font-medium mt-0.5">
                      Sedang Dalam Pemeliharaan &amp; Aklimatisasi Khusus
                    </span>
                  </div>

                  <h3 className="font-extrabold text-xl sm:text-2xl text-brand-earth leading-snug">
                    Koleksi Tanaman Hias Eksklusif &amp; Teraklimatisasi
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-brand-earth/80 leading-relaxed">
                    Koleksi Aglaonema, Monstera, Sansevieria, dan tanaman daun eksotis sedang dalam perawatan terpadu proteksi tanaman IPB University di kebun pembibitan kami.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-earth/10 flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-[11px] text-brand-earth/70 font-semibold">
                    Pre-Order &amp; Konsultasi Tanaman
                  </span>
                  <a
                    href={`https://wa.me/${settings?.whatsapp_number || '6282110998588'}?text=${encodeURIComponent(
                      'Halo Taman San Jaya, saya ingin menanyakan ketersediaan koleksi tanaman hias di nursery.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-crimson hover:bg-brand-crimson-hover active:scale-[0.98] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Tanyakan Stok di Nursery</span>
                  </a>
                </div>
              </div>

              {/* Card 2: Pohon Peneduh, Semak & Rumput Lanskap */}
              <div className="border-2 border-dashed border-brand-earth/30 bg-white/75 backdrop-blur-md rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-navy/10 text-brand-navy border border-brand-navy/25">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Kebutuhan Proyek Lanskap</span>
                    </span>
                    <span className="text-[11px] font-bold text-brand-earth/60 font-mono uppercase tracking-wider">
                      Katalog #02
                    </span>
                  </div>

                  <div className="relative w-full aspect-[16/9] sm:aspect-[21/10] rounded-xl overflow-hidden bg-brand-sand/30 border border-brand-sand-dark/40 flex flex-col items-center justify-center p-6 text-center mb-5">
                    <div
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage: 'radial-gradient(#5C4033 1.5px, transparent 1.5px)',
                        backgroundSize: '18px 18px',
                      }}
                    />
                    <div className="relative z-10 w-12 h-12 rounded-full bg-white shadow-sm border border-brand-sand-dark/40 flex items-center justify-center text-brand-navy mb-2.5">
                      <TreePine className="w-6 h-6" />
                    </div>
                    <span className="relative z-10 text-xs font-extrabold text-brand-earth tracking-wide uppercase">
                      Pohon Peneduh, Semak &amp; Rumput Segar
                    </span>
                    <span className="relative z-10 text-[11px] text-brand-earth/70 font-medium mt-0.5">
                      Suplai Vegetasi Langsung Untuk Rumah &amp; Komersial
                    </span>
                  </div>

                  <h3 className="font-extrabold text-xl sm:text-2xl text-brand-earth leading-snug">
                    Suplai Pohon Peneduh, Palem, Bonsai &amp; Rumput
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-brand-earth/80 leading-relaxed">
                    Kami juga menyuplai aneka pohon peneduh besar, tanaman pagar, serta lempengan rumput jepang segar berkualitas tinggi dengan layanan tanam bergaransi.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-earth/10 flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-[11px] text-brand-earth/70 font-semibold">
                    Pesan Vegetasi Lanskap
                  </span>
                  <a
                    href={`https://wa.me/${settings?.whatsapp_number || '6282110998588'}?text=${encodeURIComponent(
                      'Halo Taman San Jaya, saya ingin menanyakan suplai pohon peneduh/rumput untuk area taman saya.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-navy-dark active:scale-[0.98] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Hubungi Tim Vegetasi</span>
                  </a>
                </div>
              </div>
            </div>
          )
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <AnimatePresence>
              {filteredProducts.map((product) => {
                const hasTokopedia = Boolean(
                  product.tokopedia_url && product.tokopedia_url.trim() !== ''
                );
                const hasShopee = Boolean(
                  product.shopee_url && product.shopee_url.trim() !== ''
                );

                return (
                  <motion.div
                    layout
                    key={product.id}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-brand-earth/15 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Box - Pencet Foto Masuk ke Detail Produk */}
                      <Link
                        href={`/katalog/${product.slug || product.id}`}
                        className="block relative w-full aspect-[4/3] sm:aspect-auto sm:h-56 overflow-hidden bg-brand-sand/20 cursor-pointer"
                      >
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        
                        {/* Stock Tag */}
                        <span
                          className={`absolute top-2 right-2 sm:top-3 sm:right-3 text-[9px] sm:text-[11px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg shadow-xs pointer-events-none ${
                            product.in_stock
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {product.in_stock ? 'Tersedia' : 'Pre-Order'}
                        </span>
                      </Link>

                      {/* Product Details */}
                      <div className="p-2.5 sm:p-5">
                        <h3 className="font-bold text-[11px] sm:text-lg text-brand-earth group-hover:text-brand-crimson transition-colors line-clamp-1 leading-snug">
                          <Link href={`/katalog/${product.slug || product.id}`} className="hover:text-brand-crimson transition-colors">
                            {product.name}
                          </Link>
                        </h3>

                        {/* Price */}
                        <div className="mt-0.5 sm:mt-1.5 flex items-baseline gap-2">
                          <span className="text-brand-crimson font-extrabold text-xs sm:text-xl whitespace-nowrap">
                            {product.price_display || `Rp ${product.price.toLocaleString('id-ID')}`}
                          </span>
                        </div>

                        {/* Description - Desktop Only to save mobile space */}
                        <p className="hidden sm:block mt-2.5 text-brand-earth/90 text-xs sm:text-sm font-medium line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Care Tip - Desktop Only to save mobile space */}
                        {product.care_instructions && (
                          <div className="hidden sm:flex mt-3.5 pt-3 border-t border-brand-earth/10 items-start gap-1.5 text-[11px] text-brand-earth/85 font-medium">
                            <Droplets className="w-3.5 h-3.5 text-brand-navy flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{product.care_instructions}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Marketplace Direct Buy Buttons (Tokopedia & Shopee) */}
                    <div className="p-3 pt-0 sm:p-5 sm:pt-0">
                      {hasTokopedia && hasShopee ? (
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                          <a
                            href={product.tokopedia_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 w-full bg-[#03AC0E] hover:bg-[#029B0D] active:scale-[0.98] text-white text-[10px] sm:text-[13px] font-bold py-1.5 sm:py-2.5 px-1 sm:px-2 rounded-lg shadow-xs hover:shadow-md transition-all duration-200"
                            title={`Beli ${product.name} di Tokopedia`}
                          >
                            <TokopediaIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-white" />
                            <span className="truncate">Tokopedia</span>
                          </a>

                          <a
                            href={product.shopee_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 w-full bg-[#EE4D2D] hover:bg-[#D73211] active:scale-[0.98] text-white text-[10px] sm:text-[13px] font-bold py-1.5 sm:py-2.5 px-1 sm:px-2 rounded-lg shadow-xs hover:shadow-md transition-all duration-200"
                            title={`Beli ${product.name} di Shopee`}
                          >
                            <ShopeeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-white" />
                            <span className="truncate">Shopee</span>
                          </a>
                        </div>
                      ) : hasTokopedia ? (
                        <a
                          href={product.tokopedia_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 w-full bg-[#03AC0E] hover:bg-[#029B0D] active:scale-[0.98] text-white text-[10px] sm:text-[13px] font-bold py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg shadow-xs hover:shadow-md transition-all duration-200"
                          title={`Beli ${product.name} di Tokopedia`}
                        >
                          <TokopediaIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-white" />
                          <span className="truncate">Tokopedia</span>
                        </a>
                      ) : hasShopee ? (
                        <a
                          href={product.shopee_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 w-full bg-[#EE4D2D] hover:bg-[#D73211] active:scale-[0.98] text-white text-[10px] sm:text-[13px] font-bold py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg shadow-xs hover:shadow-md transition-all duration-200"
                          title={`Beli ${product.name} di Shopee`}
                        >
                          <ShopeeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-white" />
                          <span className="truncate">Shopee</span>
                        </a>
                      ) : (
                        <Link
                          href={`/katalog/${product.slug || product.id}`}
                          className="flex items-center justify-center gap-1 w-full bg-brand-sand/60 hover:bg-brand-sand text-brand-earth active:scale-[0.98] text-[10px] sm:text-[13px] font-bold py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg shadow-xs hover:shadow-md transition-all duration-200 border border-brand-sand-dark/40"
                          title={`Lihat detail ${product.name}`}
                        >
                          <span>Detail</span>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </section>
  );
}
