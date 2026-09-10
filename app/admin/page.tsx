import React from 'react';
import Link from 'next/link';
import { getDashboardCounts } from '@/lib/data';
import {
  Image as ImageIcon,
  Sprout,
  Briefcase,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  Database,
  ArrowRight,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const counts = await getDashboardCounts();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand-dark/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-crimson">
            Selamat Datang di Backoffice
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-earth mt-1">
            Panel Pengelola Taman San Jaya
          </h1>
          <p className="text-sm text-brand-earth/75 mt-2 max-w-xl">
            Di sini Anda dapat memperbarui foto banner beranda, menambah koleksi tanaman hias di katalog, dan mengunggah portofolio pengerjaan taman tanpa perlu menyentuh kodingan.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 bg-brand-crimson hover:bg-brand-crimson-hover text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-sm transition-colors whitespace-nowrap"
        >
          <span>Buka Website Publik</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-brand-sand-dark/40 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Sprout className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-earth/70 block">
              Katalog Tanaman Hias
            </span>
            <span className="text-2xl font-black text-brand-earth">
              {counts.products} Produk
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-brand-sand-dark/40 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-brand-navy rounded-2xl">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-earth/70 block">
              Portofolio Proyek
            </span>
            <span className="text-2xl font-black text-brand-earth">
              {counts.projects} Proyek
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-brand-sand-dark/40 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-brand-sand/50 text-brand-crimson rounded-2xl">
            <ImageIcon className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-earth/70 block">
              Layanan Aktif
            </span>
            <span className="text-2xl font-black text-brand-earth">
              {counts.services} Layanan
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div>
        <h2 className="text-lg font-bold text-brand-earth mb-4">
          Aksi Cepat Pengelolaan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Hero Settings */}
          <Link
            href="/admin/hero"
            className="group bg-white rounded-3xl p-6 border border-brand-sand-dark/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-brand-sand/50 w-fit rounded-2xl text-brand-earth group-hover:bg-brand-crimson group-hover:text-white transition-colors mb-4">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-brand-earth group-hover:text-brand-crimson transition-colors">
                Ganti Banner Hero & Kontak
              </h3>
              <p className="text-xs sm:text-sm text-brand-earth/75 mt-1.5 leading-relaxed">
                Ubah gambar pemandangan taman di halaman depan, judul headline, dan nomor WhatsApp pemesanan.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-brand-navy">
              <span>Buka Pengaturan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Products */}
          <Link
            href="/admin/products"
            className="group bg-white rounded-3xl p-6 border border-brand-sand-dark/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-emerald-50 w-fit rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors mb-4">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-brand-earth group-hover:text-emerald-700 transition-colors">
                Kelola Produk Tanaman Hias
              </h3>
              <p className="text-xs sm:text-sm text-brand-earth/75 mt-1.5 leading-relaxed">
                Tambah jenis tanaman baru (Lidah Mertua, Bonsai, Palem), upload foto, atur harga dan status ketersediaan.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <span>Kelola Katalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Projects */}
          <Link
            href="/admin/projects"
            className="group bg-white rounded-3xl p-6 border border-brand-sand-dark/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-blue-50 w-fit rounded-2xl text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-colors mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-brand-earth group-hover:text-brand-navy transition-colors">
                Kelola Portofolio Proyek
              </h3>
              <p className="text-xs sm:text-sm text-brand-earth/75 mt-1.5 leading-relaxed">
                Dokumentasikan hasil karya taman baru yang telah selesai dikerjakan untuk meyakinkan calon klien.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-brand-navy">
              <span>Lihat Portofolio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </div>

      {/* Supabase Integration Card */}
      <div className="bg-brand-sand/30 rounded-3xl p-6 border border-brand-sand-dark/50">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-brand-crimson/10 rounded-xl text-brand-crimson">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-earth">
              Koneksi Database & Storage Supabase
            </h3>
            <p className="text-xs text-brand-earth/70 mt-1 leading-relaxed">
              Website ini terhubung langsung ke proyek Supabase <code>https://geuoxjhwqztivwbplgbz.supabase.co</code>. Skema tabel dan bucket penyimpanan foto telah disiapkan dalam file <code>supabase/schema.sql</code>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
