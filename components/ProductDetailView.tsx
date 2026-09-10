'use client';

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  X,
} from 'lucide-react';
import { TokopediaIcon, ShopeeIcon } from '@/components/MarketplaceIcons';
import { Product, SiteSettings } from '@/lib/types';

interface ProductDetailViewProps {
  product: Product;
  otherProducts: Product[];
  settings: SiteSettings;
}

export default function ProductDetailView({
  product,
  otherProducts,
  settings,
}: ProductDetailViewProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Combine primary image and gallery images into a unique list
  const galleryList = React.useMemo(() => {
    const list: string[] = [];
    if (product.image_url) list.push(product.image_url);
    if (product.gallery_images && Array.isArray(product.gallery_images)) {
      product.gallery_images.forEach((img) => {
        if (img && !list.includes(img)) {
          list.push(img);
        }
      });
    }
    return list.length > 0 ? list : ['/images/lidah-mertua.jpg'];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const thumbnailItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handlePrev = React.useCallback(() => {
    setActiveImageIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
  }, [galleryList.length]);

  const handleNext = React.useCallback(() => {
    setActiveImageIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
  }, [galleryList.length]);

  const scrollThumbnails = React.useCallback((direction: 'left' | 'right') => {
    if (thumbnailScrollRef.current) {
      const scrollAmount = 180;
      thumbnailScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  // Selalu pastikan halaman detail produk dimulai dari paling atas saat dibuka
  React.useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = (window as unknown as { lenis?: { scrollTo: (target: number, opts?: object) => void } }).lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, []);

  // Auto-scroll active thumbnail into view when index changes
  React.useEffect(() => {
    const activeBtn = thumbnailItemRefs.current[activeImageIndex];
    if (activeBtn && thumbnailScrollRef.current) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeImageIndex]);

  // Lock body scroll when lightbox modal is open
  React.useEffect(() => {
    if (isLightboxOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isLightboxOpen]);

  // Keyboard navigation for smooth photo browsing and lightbox closing
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen && e.key === 'Escape') {
        setIsLightboxOpen(false);
        return;
      }
      if (galleryList.length <= 1) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, galleryList.length, handlePrev, handleNext]);

  const currentPhoto = galleryList[activeImageIndex] || product.image_url;

  const tokopediaLink =
    product.tokopedia_url && product.tokopedia_url.trim() !== ''
      ? product.tokopedia_url
      : `https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(product.name)}`;

  const shopeeLink =
    product.shopee_url && product.shopee_url.trim() !== ''
      ? product.shopee_url
      : `https://shopee.co.id/search?keyword=${encodeURIComponent(product.name)}`;

  const waOrderUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    `Halo Taman San Jaya, saya tertarik memesan produk tanaman "${product.name}" (${
      product.price_display || 'Rp ' + product.price.toLocaleString('id-ID')
    }). Apakah stok di nursery tersedia dan bisa dibantu pengiriman atau konsultasi perawatannya?`
  )}`;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-20">
      {/* 1. TOP BAR: TOMBOL BACK ICON */}
      <div className="flex items-center justify-between mb-5 sm:mb-7">
        <Link
          href="/#catalog"
          aria-label="Kembali ke Katalog Tanaman"
          className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-brand-earth hover:text-brand-crimson border border-brand-earth/15 shadow-xs hover:shadow-md transition-all duration-200 group active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        </Link>
      </div>

      {/* 2. MAIN 2-COLUMN PRODUCT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: SHOPEE / TOKOPEDIA PRODUCT MEDIA VIEWER                     */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-4">
          {/* A. Panggung Foto Utama (Large Primary Stage) */}
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-white border border-brand-earth/15 shadow-md group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhoto}
                initial={{ opacity: 0.6, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.6 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="relative w-full h-full cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              >
                <Image
                  src={currentPhoto}
                  alt={`${product.name} - Foto ${activeImageIndex + 1}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </motion.div>
            </AnimatePresence>

            {/* Counter Badge */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-mono font-bold tracking-wider border border-white/20 pointer-events-none">
              {activeImageIndex + 1} / {galleryList.length}
            </div>

            {/* Zoom Button */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              aria-label="Perbesar Foto"
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-transform active:scale-95"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Navigasi Panah Kiri-Kanan pada Foto Besar */}
            {galleryList.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="Foto Sebelumnya"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Foto Berikutnya"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* B. Deretan Thumbnail Kecil Bawah (Gaya Shopee / Tokopedia) */}
          {galleryList.length > 1 && (
            <div className="relative flex items-center gap-2 pt-1">
              <button
                onClick={() => scrollThumbnails('left')}
                aria-label="Gulir thumbnail kiri"
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-brand-earth border border-brand-earth/20 flex-shrink-0 flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div
                ref={thumbnailScrollRef}
                className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1 px-1 scroll-smooth w-full"
              >
                {galleryList.map((img, idx) => {
                  const isSelected = idx === activeImageIndex;
                  return (
                    <button
                      key={idx}
                      ref={(el) => {
                        thumbnailItemRefs.current[idx] = el;
                      }}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      aria-label={`Pilih foto ${idx + 1}`}
                      className={`relative w-18 h-18 sm:w-20 sm:h-20 aspect-square rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-200 cursor-pointer focus:outline-hidden ${
                        isSelected
                          ? 'border-2 border-brand-crimson ring-2 ring-brand-crimson/25 shadow-md scale-105'
                          : 'border border-brand-earth/20 opacity-70 hover:opacity-100 hover:border-brand-crimson/50'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        loading="lazy"
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => scrollThumbnails('right')}
                aria-label="Gulir thumbnail kanan"
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-brand-earth border border-brand-earth/20 flex-shrink-0 flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: INFORMASI PRODUK & TOMBOL MARKETPLACE                       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-sand text-brand-earth border border-brand-earth/15">
                {product.category}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border ${
                  product.in_stock
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {product.in_stock ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tersedia</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Stok Terbatas / Pre-Order</span>
                  </>
                )}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-earth tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="mt-4 p-4 rounded-2xl bg-white/70 border border-brand-earth/15 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-brand-crimson">
                {product.price_display || `Rp ${product.price.toLocaleString('id-ID')}`}
              </span>
              <span className="text-xs text-brand-earth/60 font-semibold">
                (Harga per pot / polybag siap pajang)
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-earth/70">
              Deskripsi Tanaman
            </h3>
            <p className="text-sm sm:text-base text-brand-earth/85 leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          {/* Direct Purchase Action Buttons */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-earth/70 block">
              Beli Langsung / Marketplace
            </span>

            {/* Dual Marketplace Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={tokopediaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#03AC0E] hover:bg-[#029B0D] text-white font-bold py-3.5 px-4 rounded-2xl shadow-xs hover:shadow-md transition-all active:scale-[0.98] text-sm"
              >
                <TokopediaIcon className="w-5 h-5 text-white flex-shrink-0" />
                <span>Beli di Tokopedia</span>
              </a>

              <a
                href={shopeeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#EE4D2D] hover:bg-[#D73211] text-white font-bold py-3.5 px-4 rounded-2xl shadow-xs hover:shadow-md transition-all active:scale-[0.98] text-sm"
              >
                <ShopeeIcon className="w-5 h-5 text-white flex-shrink-0" />
                <span>Beli di Shopee</span>
              </a>
            </div>

            {/* WhatsApp Direct Order Button */}
            <a
              href={waOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-brand-crimson hover:bg-brand-crimson-hover text-white font-bold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] text-sm sm:text-base"
            >
              <MessageCircle className="w-5 h-5 fill-current flex-shrink-0" />
              <span>Pesan via WhatsApp (Konsultasi Bebas Biaya)</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. KOLEKSI TANAMAN PILIHAN LAINNYA (RELATED PRODUCTS) */}
      {otherProducts.length > 0 && (
        <div className="mt-16 sm:mt-20 pt-10 border-t border-brand-earth/15">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-earth tracking-tight">
                Koleksi Tanaman Pilihan Lainnya
              </h2>
              <p className="text-xs sm:text-sm text-brand-earth/75 mt-1">
                Jelajahi varietas tanaman hias eksotis dan berkualitas lainnya dari nursery kami.
              </p>
            </div>
            <Link
              href="/#catalog"
              className="text-xs sm:text-sm font-bold text-brand-crimson hover:underline"
            >
              Lihat Semua Katalog →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherProducts.map((other) => {
              const otherTokopedia =
                other.tokopedia_url && other.tokopedia_url.trim() !== ''
                  ? other.tokopedia_url
                  : `https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(other.name)}`;

              const otherShopee =
                other.shopee_url && other.shopee_url.trim() !== ''
                  ? other.shopee_url
                  : `https://shopee.co.id/search?keyword=${encodeURIComponent(other.name)}`;

              return (
                <div
                  key={other.id}
                  className="bg-white rounded-3xl overflow-hidden border border-brand-earth/15 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Pencet Foto Langsung Masuk ke Detail Produk Terkait */}
                    <Link
                      href={`/katalog/${other.slug || other.id}`}
                      className="block relative w-full h-48 overflow-hidden bg-brand-sand/20 cursor-pointer"
                    >
                      <Image
                        src={other.image_url}
                        alt={other.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span
                        className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs ${
                          other.in_stock
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {other.in_stock ? 'Tersedia' : 'Pre-Order'}
                      </span>
                    </Link>

                    <div className="p-4">
                      <h3 className="font-bold text-base text-brand-earth line-clamp-1">
                        <Link
                          href={`/katalog/${other.slug || other.id}`}
                          className="hover:text-brand-crimson transition-colors"
                        >
                          {other.name}
                        </Link>
                      </h3>
                      <div className="mt-1 text-brand-crimson font-extrabold text-base">
                        {other.price_display || `Rp ${other.price.toLocaleString('id-ID')}`}
                      </div>
                      <p className="mt-1.5 text-xs text-brand-earth/70 line-clamp-2 leading-relaxed">
                        {other.description}
                      </p>
                    </div>
                  </div>

                  {/* Marketplace CTAs */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <a
                      href={otherTokopedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 bg-[#03AC0E] hover:bg-[#029B0D] text-white text-xs font-bold py-2 px-1.5 rounded-xl transition-all"
                    >
                      <TokopediaIcon className="w-3.5 h-3.5 text-white flex-shrink-0" />
                      <span className="truncate">Tokopedia</span>
                    </a>
                    <a
                      href={otherShopee}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-xs font-bold py-2 px-1.5 rounded-xl transition-all"
                    >
                      <ShopeeIcon className="w-3.5 h-3.5 text-white flex-shrink-0" />
                      <span className="truncate">Shopee</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. LIGHTBOX MODAL (POPUP PREVIEW PERBESAR FOTO - PORTAL KE BODY AGAR BEBAS DARI STACKING CONTEXT & SVG MERAMBAT) */}
      {mounted &&
        isLightboxOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
              aria-label="Tutup perbesar foto"
              className="absolute top-5 right-5 z-[100000] p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>

            <div
              className="relative w-full max-w-4xl max-h-[85vh] aspect-square rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentPhoto}
                alt={product.name}
                fill
                priority
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {galleryList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="Foto Sebelumnya"
                  className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 z-[100000]"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Foto Berikutnya"
                  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 z-[100000]"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
