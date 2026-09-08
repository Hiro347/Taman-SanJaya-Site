# Taman San Jaya (成功之园) - Website Landscape & Katalog Tanaman Hias

Website resmi **Taman San Jaya** untuk jasa landscape architecture, pembuatan taman minimalis modern, tropis, relief tebing alami, perawatan berkala, serta katalog ragam tanaman hias. 

Website ini dibangun menggunakan **Next.js (App Router)**, **Tailwind CSS**, **Framer Motion**, dan **Supabase (Database, Auth, Storage)** yang 100% dioptimalkan untuk deployment ke **Vercel**.

---

## 🎨 Identitas Brand & Palet Warna

- **Crimson Maroon** (`#990633`): Identitas logo utama, tombol aksi penting (CTA WhatsApp).
- **Ocean Blue / Navy** (`#174A73`): Aksen judul, badge kategori, dan elemen kontras sejuk.
- **Warm Wood Earth** (`#5C4033`): Warna elemen kayu & teks body natural.
- **Warm Sand Canvas** (`#D8CDAE`): Latar belakang container khas sesuai rancangan desain Figma.
- **Font**: *Plus Jakarta Sans* untuk UI modern dan *Times New Roman Italic* untuk teks logo signature.

---

## 🚀 Fitur Utama

### 1. Halaman Publik (Pengunjung)
- **Hero Section Dinamis**: Banner taman tropis berbingkai rounded elegan (`rounded-3xl`) dengan CTA langsung ke WhatsApp. Foto & teks headline dapat diubah lewat Admin Panel.
- **Layanan Jasa**: Jasa Perencanaan (Desain 2D/3D), Jasa Pembuatan (Hardscape, Relief Tebing, Air Mancur), dan Jasa Perawatan Berkala. Masing-masing dilengkapi tombol konsultasi khusus via WA.
- **Katalog Tanaman Hias**: Dilengkapi pencarian instan (live search), filter kategori (Indoor, Outdoor, Pohon & Palem, Bonsai), info harga, tips perawatan, status stok, serta tombol pemesanan WhatsApp otomatis.
- **Portofolio Proyek**: Dokumentasi hasil karya taman nyata dengan kategori dan lokasi pengerjaan.
- **Tentang Kami & Alur Kerja**: Filosofi brand, 4 pilar keunggulan, serta 4 langkah mudah alur kerja dari konsultasi hingga serah terima garansi.
- **Formulir Konsultasi Interaktif**: Pengunjung mengisi rencana proyek dan langsung terhubung ke chat WhatsApp admin.
- **Floating WhatsApp**: Tombol chat melayang dengan efek animasi denyut di pojok kanan bawah.

### 2. Admin Panel (/admin) - Tanpa Koding
- **Login Khusus Admin**: Terproteksi Supabase Authentication.
- **Dashboard Overview**: Ringkasan jumlah produk katalog, proyek portofolio, dan jalan pintas cepat.
- **Ganti Banner Hero & Info Kontak**: Upload foto banner pemandangan taman baru dari HP/laptop ke Supabase Storage, ubah judul headline, nomor WA, alamat nursery, dan jam kerja.
- **Manajemen Katalog Tanaman**: Tambah tanaman baru, upload foto tanaman, atur harga, kategori, dan ubah status stok (Tersedia / Habis).
- **Manajemen Portofolio**: Upload foto proyek baru beserta nama dan lokasi pengerjaan.

---

## ⚙️ Cara Menjalankan Secara Lokal (Local Development)

1. Pastikan dependensi terinstall:
   ```bash
   npm install
   ```

2. File `.env.local` sudah terkonfigurasi dengan Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://geuoxjhwqztivwbplgbz.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_jJ4V_Fd379Z61Io-g3hcTg_eqbEBHUk
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```
   Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Menyiapkan Database Supabase

1. Buka dashboard Supabase Anda di [https://supabase.com/dashboard/project/geuoxjhwqztivwbplgbz](https://supabase.com/dashboard/project/geuoxjhwqztivwbplgbz).
2. Masuk ke menu **SQL Editor** di sidebar kiri.
3. Buka file `supabase/schema.sql` di proyek ini, copy seluruh kodenya, lalu paste dan klik **Run**.
4. Skrip tersebut otomatis membuat:
   - Tabel `site_settings`, `products`, `services`, `projects`
   - Storage Bucket `taman-media` untuk upload foto
   - Hak akses Row Level Security (RLS)
   - Data awal (seed data)

---

## 👤 Membuat Akun Admin Pertama

1. Di dashboard Supabase, buka menu **Authentication** -> **Users**.
2. Klik tombol **Add User** -> **Create User**.
3. Masukkan Email dan Password pilihan Anda (misal: `admin@tamansanjaya.com`).
4. Buka halaman `/admin/login` di website dan login menggunakan akun tersebut.

---

## 🚢 Panduan Deploy ke VERCEL

1. Push folder project ini ke akun GitHub Anda:
   ```bash
   git init
   git add .
   git commit -m "Initial commit Taman San Jaya Website"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```
2. Buka [https://vercel.com](https://vercel.com) dan login.
3. Klik **Add New Project**, lalu pilih repository GitHub Anda.
4. Di bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://geuoxjhwqztivwbplgbz.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: `sb_publishable_jJ4V_Fd379Z61Io-g3hcTg_eqbEBHUk`
5. Klik **Deploy**! Website akan live dalam waktu 1-2 menit.
