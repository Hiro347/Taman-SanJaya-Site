-- ==============================================================================
-- SKEMA DATABASE SUPABASE - TAMAN SAN JAYA (成功之园)
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda:
-- https://supabase.com/dashboard/project/geuoxjhwqztivwbplgbz/sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PENGATURAN SITUS (HERO BANNER, KONTAK, INFO)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_title TEXT NOT NULL DEFAULT 'Wujudkan Taman Idaman yang Asri, Elegan & Menenangkan',
  hero_subtitle TEXT NOT NULL DEFAULT 'Solusi profesional landscape design, pembuatan taman minimalis modern, tropis, kolam koi, hingga perawatan berkala dan penyediaan tanaman hias berkualitas.',
  hero_image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=80',
  whatsapp_number TEXT NOT NULL DEFAULT '6281234567890',
  whatsapp_message TEXT NOT NULL DEFAULT 'Halo Taman San Jaya, saya ingin konsultasi mengenai jasa landscape taman & tanaman hias.',
  address TEXT NOT NULL DEFAULT 'Jl. Raya Hijau Indah No. 88, Workshop Nursery Taman San Jaya',
  google_maps_url TEXT DEFAULT 'https://maps.google.com',
  instagram_url TEXT DEFAULT 'https://instagram.com',
  opening_hours TEXT DEFAULT 'Senin - Minggu: 08.00 - 18.00 WIB',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABEL KATALOG PRODUK TANAMAN HIAS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'Tanaman Hias',
  price NUMERIC NOT NULL DEFAULT 0,
  price_display TEXT,
  description TEXT,
  care_instructions TEXT,
  image_url TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABEL LAYANAN JASA LANDSCAPING
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_desc TEXT NOT NULL,
  full_desc TEXT,
  icon_name TEXT DEFAULT 'Compass',
  features JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABEL PORTOFOLIO PROYEK TAMAN
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Taman Tropis',
  location TEXT DEFAULT 'Jakarta',
  image_url TEXT NOT NULL,
  before_image_url TEXT,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Publik bisa membaca (SELECT), hanya user terautentikasi (Admin) yang bisa edit
-- ==============================================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy Site Settings
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin update site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policy Products
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin write products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policy Services
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admin write services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policy Projects
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin write projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKET UNTUK UPLOAD MEDIA FOTO
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('taman-media', 'taman-media', true) 
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public view taman-media images"
ON storage.objects FOR SELECT
USING (bucket_id = 'taman-media');

CREATE POLICY "Authenticated users can upload taman-media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'taman-media');

CREATE POLICY "Authenticated users can update taman-media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'taman-media');

CREATE POLICY "Authenticated users can delete taman-media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'taman-media');

-- ==============================================================================
-- DATA AWAL DEFAULT (SEED DATA)
-- ==============================================================================

-- Site Settings awal
INSERT INTO public.site_settings (id, hero_title, hero_subtitle, hero_image_url, whatsapp_number)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Wujudkan Taman Asri & Bernilai Estetika Tinggi',
  'Layanan lengkap landscape design, pengerjaan taman hunian & komersial, kolam ikan koi, relief tebing, serta katalog tanaman hias terpilih.',
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=80',
  '6281234567890'
) ON CONFLICT (id) DO NOTHING;

-- Layanan Jasa
INSERT INTO public.services (title, slug, short_desc, full_desc, icon_name, features, image_url, order_index)
VALUES 
(
  'Jasa Perencanaan Taman (Design & Planning)',
  'jasa-perencanaan',
  'Konsep desain taman 2D & 3D photorealistic yang disesuaikan dengan luas lahan, pencahayaan, dan gaya arsitektur hunian Anda.',
  'Kami membantu merancang layout tata hijau hunian Anda, mulai dari pemilihan jenis vegetasi, instalasi pencahayaan taman (garden lighting), jalur setapak (stepping stone), hingga sirkulasi air sebelum tahap eksekusi.',
  'Compass',
  '["Desain Visual 2D & 3D", "Konsultasi Pemilihan Vegetasi", "Rancangan Anggaran Biaya (RAB) Transparan", "Survei & Pengukuran Lokasi"]'::jsonb,
  'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=800&q=80',
  1
),
(
  'Jasa Pembuatan Taman (Construction & Planting)',
  'jasa-pembuatan',
  'Eksekusi menyeluruh pembuatan taman baru, hardscaping, kolam ikan koi, relief tebing alami, vertical garden, dan rumput hijau.',
  'Dikerjakan oleh tukang taman berpengalaman dengan teknik tanam tepat agar vegetasi tumbuh subur dan tahan cuaca. Bergaransi tumbuh untuk kenyamanan Anda.',
  'Hammer',
  '["Pengerjaan Hardscape & Softscape", "Pembuatan Kolam Minimalis & Koi", "Relief Tebing Alami & Air Terjun", "Pemasangan Rumput & Sistem Drainase", "Garansi Tumbuh Tanaman"]'::jsonb,
  'https://images.unsplash.com/photo-1558904541-efa8c4a5c963?auto=format&fit=crop&w=800&q=80',
  2
),
(
  'Jasa Perawatan Taman (Maintenance)',
  'jasa-perawatan',
  'Perawatan berkala agar keindahan dan kesehatan taman Anda selalu prima: pemangkasan, pemupukan, dan pengendalian hama.',
  'Layanan panggilan rutin mingguan atau bulanan untuk menjaga rumput tetap rapi, pohon terjaga bentuk estetikanya, serta nutrisi tanah tetap optimal.',
  'Scissors',
  '["Pemangkasan Ranting & Pembentukan Tanaman", "Pemupukan Organik & Vitamin Daun", "Pemberantasan Hama & Penyakit Tanaman", "Pembersihan & Penggemburan Tanah Berkala"]'::jsonb,
  'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
  3
) ON CONFLICT (slug) DO NOTHING;

-- Katalog Produk Tanaman Hias Contoh
INSERT INTO public.products (name, slug, category, price, price_display, description, care_instructions, image_url, in_stock, featured, order_index)
VALUES
(
  'Lidah Mertua (Sansevieria Trifasciata)',
  'lidah-mertua-sansevieria',
  'Indoor & Outdoor',
  75000,
  'Rp 75.000',
  'Tanaman hias tangguh yang sangat efektif menyaring polusi dan racun udara di dalam maupun luar ruangan. Tahan kering dan minim perawatan.',
  'Siram 1-2 kali seminggu. Letakkan di tempat dengan sinar matahari tidak langsung hingga terang.',
  'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80',
  true,
  true,
  1
),
(
  'Monstera Deliciosa',
  'monstera-deliciosa',
  'Indoor',
  150000,
  'Rp 150.000',
  'Primadona tanaman hias bernuansa tropis elegan dengan ciri khas daun berlubang artistik. Memberikan aksen mewah di sudut ruang keluarga atau teras.',
  'Siram ketika 2-3 cm lapisan tanah atas kering. Hindari sinar matahari terik langsung.',
  'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
  true,
  true,
  2
),
(
  'Pohon Palem Merah (Cyrtostachys renda)',
  'palem-merah',
  'Pohon & Palem',
  350000,
  'Mulai Rp 350.000',
  'Palem eksotis dengan pelepah daun berwarna merah menyala khas nusantara. Sangat anggun menghiasi gerbang depan rumah atau sudut taman utama.',
  'Suka sinar matahari penuh hingga teduh sebagian. Penyiraman rutin setiap hari.',
  'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80',
  true,
  true,
  3
),
(
  'Aglaonema Suksom Jaipong',
  'aglaonema-suksom-jaipong',
  'Tanaman Hias Daun',
  125000,
  'Rp 125.000',
  'Varian Aglaonema berdaun merah merona hampir tanpa corak hijau. Simbol kemakmuran dan pembawa aura positif di teras rumah.',
  'Cahaya teduh / terfilter, kelembapan cukup, media poros tidak becek.',
  'https://images.unsplash.com/photo-1617173944883-6ffbd35d584d?auto=format&fit=crop&w=800&q=80',
  true,
  true,
  4
),
(
  'Bonsai Beringin Dolar (Ficus microcarpa)',
  'bonsai-beringin-dolar',
  'Bonsai & Koleksi',
  850000,
  'Rp 850.000',
  'Bonsai dengan karakter batang berotot kokoh dan daun bulat tebal mengkilap. Sangat bernilai seni tinggi untuk taman zen atau teras beranda.',
  'Pencahayaan penuh, pemangkasan rutin sebulan sekali untuk menjaga bentuk.',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  true,
  false,
  5
),
(
  'Philodendron Birkin',
  'philodendron-birkin',
  'Indoor',
  95000,
  'Rp 95.000',
  'Tanaman hias dengan garis-garis lurik putih krem yang elegan pada daun hijau gelap. Tumbuh kompak dan sangat cantik dalam pot keramik.',
  'Pencahayaan terang terfilter, media tanam berporositas tinggi.',
  'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80',
  true,
  false,
  6
) ON CONFLICT (slug) DO NOTHING;

-- Portofolio Proyek Contoh
INSERT INTO public.projects (title, category, location, image_url, description, order_index)
VALUES
(
  'Taman Tropis Modern & Gazebo Santai',
  'Taman Tropis',
  'Hunian Residensial Jakarta Selatan',
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
  'Perpaduan rumput jepang rapat, tanaman kamboja fosil, tanaman pakis, serta stepping stone alam yang menyatu dengan decking kayu teras.',
  1
),
(
  'Kolam Ikan Koi Minimalis & Dinding Batu Alam Andesit',
  'Kolam Koi',
  'BSD City, Tangerang Selatan',
  'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1200&q=80',
  'Instalasi kolam koi berfiltrasi modern 4 chamber dengan gemericik air terjun mini dinding relief andesit hitam dan pencahayaan underwater.',
  2
),
(
  'Taman Kering Zen Garden Konsep Jepang',
  'Taman Kering (Zen)',
  'Menteng, Jakarta Pusat',
  'https://images.unsplash.com/photo-1558904541-efa8c4a5c963?auto=format&fit=crop&w=1200&q=80',
  'Konsep taman minimalis low-maintenance dengan kombinasi batu koral putih, tanaman sikas, bambu hias, dan lentera batu khas Jepang.',
  3
),
(
  'Vertical Garden Dinding Hijau Tropis',
  'Vertical Garden',
  'Commercial Cafe & Bistro, Senopati',
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  'Dinding hidup seluas 24m² dengan sistem irigasi otomatis (drip system) berisikan aneka varietas pakis sarang burung, tanduk rusa, dan philodendron.',
  4
);
