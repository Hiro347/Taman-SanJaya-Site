'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Droplets } from 'lucide-react';
import { Product, SiteSettings } from '@/lib/types';

interface CatalogSectionProps {
  products: Product[];
  settings: SiteSettings;
}

export default function CatalogSection({ products, settings }: CatalogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ['Semua', ...cats];
  }, [products]);

  // Filter products based on selected category & search query
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        selectedCategory === 'Semua' ||
        p.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <section id="catalog" className="py-16 sm:py-20 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Outer Sand Background Canvas */}
      <div className="bg-brand-sand/40 border border-brand-sand-dark/40 rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 lg:p-12">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest text-brand-crimson uppercase bg-white px-4 py-1.5 rounded-full mb-3 shadow-xs">
              Koleksi Nursery & Tanaman Hias
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-earth tracking-tight">
              Katalog Tanaman Pilihan
            </h2>
            <p className="mt-3 text-brand-earth/80 text-base sm:text-lg max-w-2xl">
              Aneka tanaman hias indoor, outdoor, pohon peneduh eksotis, hingga bonsai berkualitas terbaik siap menghiasi hunian Anda.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-earth/60" />
            <input
              type="text"
              placeholder="Cari nama tanaman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-brand-sand-dark/60 text-sm text-brand-earth placeholder:text-brand-earth/50 focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Category Pills with animated active indicator */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'bg-white/70 text-brand-earth hover:bg-white hover:text-brand-crimson border border-brand-earth/15'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCatalogCategory"
                    className="absolute inset-0 bg-brand-crimson rounded-full -z-0 shadow-md shadow-brand-crimson/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Product Grid with Staggered Fade & Hover Lift */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => {
              const productWaUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
                `Halo Taman San Jaya, saya tertarik memesan tanaman hias "${product.name}" (${product.price_display || `Rp ${product.price.toLocaleString('id-ID')}`}). Apakah stok tersedia?`
              )}`;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  key={product.id}
                  className="bg-white rounded-3xl overflow-hidden border border-brand-earth/15 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-brand-sand/20">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Category Tag */}
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[11px] font-bold text-brand-navy px-2.5 py-1 rounded-lg shadow-xs">
                        {product.category}
                      </span>

                      {/* Stock Tag */}
                      <span
                        className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs ${
                          product.in_stock
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {product.in_stock ? 'Tersedia' : 'Pre-Order'}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-brand-earth group-hover:text-brand-crimson transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="mt-1.5 flex items-baseline gap-2">
                        <span className="text-brand-crimson font-extrabold text-lg sm:text-xl">
                          {product.price_display || `Rp ${product.price.toLocaleString('id-ID')}`}
                        </span>
                      </div>

                      <p className="mt-2.5 text-brand-earth/75 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Care Tip */}
                      {product.care_instructions && (
                        <div className="mt-3.5 pt-3 border-t border-brand-earth/10 flex items-start gap-1.5 text-[11px] text-brand-earth/70">
                          <Droplets className="w-3.5 h-3.5 text-brand-navy flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{product.care_instructions}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order via WhatsApp Button */}
                  <div className="p-5 pt-0">
                    <a
                      href={productWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-brand-crimson hover:bg-brand-crimson-hover text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Pesan / Tanya Stok</span>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-brand-earth/70 text-base">
              Tidak ada tanaman yang sesuai dengan pencarian "{searchQuery}".
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
