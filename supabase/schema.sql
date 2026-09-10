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
  hero_subtitle TEXT NOT NULL DEFAULT 'Solusi profesional landscape design, pembuatan taman minimalis modern, tropis, air mancur relief batu alam, hingga perawatan berkala dan penyediaan tanaman hias berkualitas.',
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
  tokopedia_url TEXT,
  shopee_url TEXT,
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
  gallery_images JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- INDEXES UNTUK OPTIMASI QUERY (SORTING & FILTERING)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_order_index ON public.projects (order_index ASC);
CREATE INDEX IF NOT EXISTS idx_products_order_index ON public.products (order_index ASC);
CREATE INDEX IF NOT EXISTS idx_services_order_index ON public.services (order_index ASC);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Publik bisa membaca (SELECT), hanya user terautentikasi (Admin) yang bisa mutasi
-- Kebijakan dipisah per aksi (INSERT, UPDATE, DELETE) agar evaluasi SELECT optimal
-- ==============================================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy Site Settings
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin insert site_settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update site_settings" ON public.site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete site_settings" ON public.site_settings FOR DELETE TO authenticated USING (true);

-- Policy Products
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update products" ON public.products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete products" ON public.products FOR DELETE TO authenticated USING (true);

-- Policy Services
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admin insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update services" ON public.services FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete services" ON public.services FOR DELETE TO authenticated USING (true);

-- Policy Projects
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update projects" ON public.projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete projects" ON public.projects FOR DELETE TO authenticated USING (true);

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
  'Layanan lengkap landscape design, pengerjaan taman hunian & komersial, air mancur relief batu alam, serta katalog tanaman hias terpilih.',
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
  'Eksekusi menyeluruh pembuatan taman baru, hardscaping, air mancur relief batu alam, vertical garden, dan hamparan rumput hijau.',
  'Dikerjakan oleh tukang taman berpengalaman dengan teknik tanam tepat agar vegetasi tumbuh subur dan tahan cuaca. Bergaransi tumbuh untuk kenyamanan Anda.',
  'Hammer',
  '["Pengerjaan Hardscape & Softscape", "Pembuatan Air Mancur & Relief Batu Alam", "Tebing Alami & Air Terjun Minimalis", "Pemasangan Rumput & Sistem Drainase", "Garansi Tumbuh Tanaman"]'::jsonb,
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

-- Katalog Produk Tanaman Hias Contoh (4 Produk Aset Pilihan)
INSERT INTO public.products (name, slug, category, price, price_display, description, care_instructions, image_url, in_stock, featured, order_index, tokopedia_url, shopee_url)
VALUES
(
  'Lidah Mertua (Sansevieria Trifasciata)',
  'lidah-mertua-sansevieria',
  'Indoor & Outdoor',
  75000,
  'Rp 75.000',
  'Tanaman hias tangguh penyerap racun udara dan polusi paling efektif. Sangat mudah dirawat dan cocok di sudut ruangan maupun pembatas teras.',
  'Penyiraman 1x seminggu. Tahan di tempat minim cahaya hingga sinar matahari penuh.',
  '/images/lidah-mertua.jpg',
  true,
  true,
  1,
  'https://www.tokopedia.com/search?st=product&q=Lidah+Mertua+Sansevieria',
  'https://shopee.co.id/search?keyword=Lidah+Mertua+Sansevieria'
),
(
  'Monstera Adansonii (Janda Bolong)',
  'monstera-janda-bolong',
  'Indoor',
  85000,
  'Rp 85.000',
  'Tanaman hias tropis merambat populer dengan lubang-lubang artistik alami pada helai daun. Sangat estetik untuk dekorasi meja, ambalan dinding, atau pot gantung.',
  'Siram saat media tanam mulai mengering (2-3 hari sekali). Letakkan di area terang tanpa terkena sinar matahari langsung.',
  '/images/monstera-janda-bolong.jpg',
  true,
  true,
  2,
  'https://www.tokopedia.com/search?st=product&q=Monstera+Janda+Bolong',
  'https://shopee.co.id/search?keyword=Monstera+Janda+Bolong'
),
(
  'Aglaonema (Sri Rejeki)',
  'aglaonema-sri-rejeki',
  'Tanaman Daun',
  125000,
  'Rp 125.000',
  'Ratu tanaman daun dengan corak hijau segar dan semburat artistik memikat. Dipercaya membawa keberuntungan, ketenangan, serta membersihkan udara dalam hunian.',
  'Cahaya teduh terfilter, kelembapan seimbang, penyiraman teratur 2 kali seminggu pada media tanam poros.',
  '/images/aglaonema.jpg',
  true,
  true,
  3,
  'https://www.tokopedia.com/search?st=product&q=Aglaonema+Sri+Rejeki',
  'https://shopee.co.id/search?keyword=Aglaonema+Sri+Rejeki'
),
(
  'Bunga Anggrek Bulan (Phalaenopsis)',
  'bunga-anggrek-bulan',
  'Bunga & Koleksi',
  145000,
  'Rp 145.000',
  'Pesona anggrek nusantara dengan kelopak bunga mekar anggun, elegan, dan tahan lama. Simbol keindahan abadi yang sangat cocok sebagai penghias ruang tamu utama.',
  'Siram semprot halus 2 kali seminggu di akar/media pakis, sirkulasi udara lancar dan sinar pagi tidak langsung.',
  '/images/anggrek.jpg',
  true,
  true,
  4,
  'https://www.tokopedia.com/search?st=product&q=Bunga+Anggrek+Bulan',
  'https://shopee.co.id/search?keyword=Bunga+Anggrek+Bulan'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  description = EXCLUDED.description,
  care_instructions = EXCLUDED.care_instructions,
  image_url = EXCLUDED.image_url,
  order_index = EXCLUDED.order_index,
  tokopedia_url = EXCLUDED.tokopedia_url,
  shopee_url = EXCLUDED.shopee_url;

-- Portofolio Proyek Contoh
INSERT INTO public.projects (title, category, location, image_url, gallery_images, description, order_index)
VALUES
(
  'Taman Minimalis Modern & Rumput Hijau Rapat',
  'Taman Minimalis',
  'Hunian Residensial Mewah',
  '/images/proyek-4.avif',
  '["/images/proyek-4.avif", "/images/proyek-2.jpg", "/images/proyek-1.jpeg", "/images/Pembuatan.jpg"]'::jsonb,
  'Penataan tanaman bonsai peneduh artistik, batuan koral hias, hamparan rumput jepang rapi, dan vegetasi tropis pembatas pagar hunian privat.',
  1
),
(
  'Taman Tropis Alami & Jalan Setapak Villa',
  'Taman Tropis',
  'Kawasan Villa & Hunian Tropis',
  '/images/proyek-2.jpg',
  '["/images/proyek-2.jpg", "/images/proyek-4.avif", "/images/proyek-3.jpg", "/images/Perawatan.jpg"]'::jsonb,
  'Kombinasi pohon kamboja berbunga harum, palem tropis, tanaman puring hias, dan pedestrian paving yang asri serta rindang.',
  2
),
(
  'Perencanaan Desain Lanskap 3D Kawasan & Taman Terbuka',
  'Perencanaan 3D',
  'Masterplan Kawasan Publik & Privat',
  '/images/proyek-1.jpeg',
  '["/images/proyek-1.jpeg", "/images/Perencanaan.jpg", "/images/proyek-4.avif", "/images/proyek-2.jpg"]'::jsonb,
  'Rancangan arsitektural 3D fotorealistis meliputi jalur pejalan kaki, gazebo santai, area hijau terbuka, serta penataan komposisi vegetasi terstruktur.',
  3
),
(
  'Taman Air Mancur Relief Batu Alam & Gazebo Bersantai',
  'Relief Tebing & Air',
  'Courtyard Hunian Tropis',
  '/images/proyek-3.jpg',
  '["/images/proyek-3.jpg", "/images/proyek-2.jpg", "/images/Pembuatan.jpg", "/images/proyek-4.avif"]'::jsonb,
  'Ornamen air mancur bertingkat relief batu alam berpadu dengan gazebo kayu tradisional dan pepohonan tropis yang menyejukkan.',
  4
),
(
  'Konstruksi & Eksekusi Pembuatan Lanskap Riil',
  'Pengerjaan Lanskap',
  'Area Hunian & Komersial',
  '/images/Pembuatan.jpg',
  '["/images/Pembuatan.jpg", "/images/proyek-1.jpeg", "/images/proyek-3.jpg", "/images/Perawatan.jpg"]'::jsonb,
  'Eksekusi fisik pengerjaan lanskap dari olah lahan, seleksi bibit unggul, pemupukan organik, hingga penataan hardscape bergaransi tumbuh 100%.',
  5
);
