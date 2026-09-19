'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Droplets } from 'lucide-react';
import { TokopediaIcon, ShopeeIcon } from '@/components/MarketplaceIcons';
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

        {/* Product Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 sm:py-28 lg:py-36 flex flex-col items-center justify-center">
            {searchQuery.trim() ? (
              <>
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-earth tracking-tight">
                  Tanaman &quot;{searchQuery}&quot; Tidak Ditemukan
                </p>
                <p className="text-sm sm:text-base md:text-lg text-brand-earth/75 font-medium mt-2 sm:mt-3 max-w-xl mx-auto">
                  Varietas ini belum tersedia di katalog online. Coba gunakan kata kunci lain atau periksa kembali ejaan nama tanaman.
                </p>
              </>
            ) : (
              <>
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-earth tracking-tight">
                  Koleksi Tanaman Nursery Sedang Diperbarui
                </p>
                <p className="text-sm sm:text-base md:text-lg text-brand-earth/75 font-medium mt-2 sm:mt-3 max-w-xl mx-auto">
                  Katalog tanaman hias dan bibit unggul pilihan sedang dalam masa aklimatisasi dan kurasi berkala.
                </p>
              </>
            )}
          </div>
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
