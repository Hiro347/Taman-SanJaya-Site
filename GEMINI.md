# GEMINI.md — Project Guide & Context for AI Assistants

This document provides complete architectural context, brand guidelines, color palettes, and operational rules for **Taman San Jaya (成功之园)**. Any AI assistant working on this codebase should read and adhere to the guidelines established here.

---

## 1. 🌿 Project Overview & Business Domain

* **Business Name**: Taman San Jaya (Mandarin signature: **成功之园** — *Garden of Success*)
* **Industry**: Landscape Architecture, Garden Design & Construction, Hardscaping, Routine Plant Maintenance, and Botanical Nursery.
* **Academic Heritage**: Founded by **Ergoputra Kusuma Sanjaya**, alumnus of **Proteksi Tanaman (Plant Protection), Fakultas Pertanian IPB University**.
* **Core Value Proposition**: Science-backed plant health, 100% growth guarantee (*Garansi Tumbuh 100%*), custom 2D/3D landscape planning, and turnkey execution.

### ⚠️ CRITICAL NEGATIVE CONSTRAINT (MUST NEVER VIOLATE)
> **ABSOLUTELY NO KOI / IKAN KOI / KOLAM KOI**:  
> Taman San Jaya **DOES NOT** provide koi fish or koi pond services. Never suggest, add, or generate "kolam koi", "ikan koi", or koi pond references anywhere in the copy, schemas, portfolio, or UI. Any water feature is strictly limited to natural rock waterfalls, tiered stone fountains (*air mancur relief batu alam*), and garden water features.

---

## 2. 🎨 Official Brand Color Palette & Design System

The brand visual language is inspired by high-end architectural monographs, organic earth tones, and traditional Indonesian-Chinese garden heritage.

### Color Tokens & Palette Reference

| Token Name | Hex Code | Tailwind Class | Role & Usage Guidelines |
| :--- | :--- | :--- | :--- |
| **Warm Sand** *(Primary Canvas)* | `#D8CDAE` | `bg-brand-sand`, `text-brand-sand` | Main elevated canvas container, soft border tints, and warm backgrounds. |
| **Sand Light** | `#F4EFE2` | `bg-brand-sand-light` | Subtle background highlights, input fills, hover backgrounds. |
| **Sand Dark** | `#C5B791` | `border-brand-sand-dark` | Outline borders for the sand container, subtle divider lines. |
| **Crimson Maroon** *(Vocal Accent)* | `#990633` | `bg-brand-crimson`, `text-brand-crimson` | Primary Call-to-Action (CTA WhatsApp), active tab pills, badge accents, key italic serif highlights. |
| **Crimson Hover** | `#7D052A` | `hover:bg-brand-crimson-hover` | Hover state for buttons and interactive primary elements. |
| **Crimson Light** | `#FDF2F4` | `bg-brand-crimson-light` | Soft pill badge backgrounds, alert tints. |
| **Ocean Navy** *(Scientific / Water)* | `#174A73` | `bg-brand-navy`, `text-brand-navy` | IPB heritage credentials, secondary icons, botanical science tags. |
| **Navy Dark** | `#0F324E` | `bg-brand-navy-dark` | Deep contrast accents and dark text highlights. |
| **Navy Light** | `#EBF2F8` | `bg-brand-navy-light` | Soft tinted card backgrounds for technical details. |
| **Warm Dark Wood / Earth** | `#5C4033` | `bg-brand-earth`, `text-brand-earth` | Architectural headings, primary body copy, dark footer containers, brand story cards. |
| **Earth Light** | `#7D5847` | `text-brand-earth-light` | Subtitle text, muted metadata descriptions. |
| **Earth Dark** | `#3E2B22` | `bg-brand-earth-dark` | Deepest shadow tones and footer groundings. |

### Typography Guidelines
* **Sans-serif (Modern UI)**: `Plus Jakarta Sans` (`font-sans`) — used for clean navigation, data labels, body paragraphs, and architectural readability.
* **Serif (Signature Luxury)**: `Times New Roman / Garamond` (`font-serif italic`) — used as a focal accent on key headline words (e.g. `Wujudkan <span className="font-serif italic font-bold text-brand-crimson">Taman Asri</span> Impian Anda`).

---

## 3. 🛠️ Tech Stack & Dependencies

* **Framework**: Next.js 14 (App Router, React 18, TypeScript)
* **Styling**: Tailwind CSS 3.4
* **Animations**: Framer Motion 11 (spring physics, directional layout transitions, scroll parallax, AnimatePresence)
* **Smooth Scrolling**: Lenis (`lenis`) for luxury momentum scrolling & inertia physics
* **3D Graphics**: Three.js (`three` + `@types/three`) with `GLTFLoader` for WebGL rendering of `/models/LogoTamanSanjaya.glb`
* **Icons**: Lucide React (`lucide-react`)
* **Backend & Database**: Supabase (`@supabase/ssr`, `@supabase/supabase-js`) PostgreSQL database with full fallback to `lib/placeholder-data.ts`
* **Deployment Target**: Vercel (Production-optimized, bundle size ~15kB route first-load JS)

---

## 4. 📐 Page Layout & Key Component Behaviors

```
┌────────────────────────────────────────────────────────┐
│ Ambient Blurred Background (fixed, hero-garden.jpg)     │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Elevated #D8CDAE Card Container (rounded-[36px])  │  │
│  │  [image 13.svg Ivy Bush clinging at top-right]    │  │
│  │  [ScrollRotatingLogo3D - Active at #project]      │  │
│  │  [Navbar with brand logo & WhatsApp CTA]          │  │
│  │  [HeroSection (Widescreen auto-sliding gallery)]  │  │
│  │  [Group 1.svg Full-width Natural Plant Divider]   │  │
│  │  [ServicesSection - 3 Core Pillars Accordion]     │  │
│  │  [ProjectSection - Architectural Portfolio Grid]  │  │
│  │  [FloralDivider (group-3.svg Garland)]            │  │
│  │  [CatalogSection - Plant Catalog + Care Guides]   │  │
│  │  [AboutSection - Founder Ergoputra Kusuma IPB]    │  │
│  │  [ContactSection - Direct WhatsApp Form]          │  │
│  │  [Group 2.svg Wildflower Meadow Divider]          │  │
│  │  [Footer with navigation, workshop address]       │  │
│  └──────────────────────────────────────────────────┘  │
│ FloatingWhatsApp widget (bottom-right pulse)           │
└────────────────────────────────────────────────────────┘
```

### Component Breakdown & Rules

1. **`app/(public)/layout.tsx`**:
   - Wrapped with `<SmoothScroll />` powered by **Lenis** for continuous momentum physics.
   - Ambient background uses pre-rendered `/images/background-blur.webp` for zero CPU blur filter lag.
   - Renders the outer elevated sand canvas (`bg-[#D8CDAE] rounded-[28px] sm:rounded-[36px] lg:rounded-[44px]`).
   - Top-right corner features the clinging ivy bush: [`image-13.webp`](/images/image-13.webp) with fallback to [`image-13.svg`](/images/image-13.svg).
   - Hosts `<ScrollRotatingLogoWrapper />` which dynamically lazy-loads Three.js and the 3D model only upon user scroll or idle, eliminating initial bundle weight.

2. **`components/ScrollRotatingLogo3D.tsx` & `components/ScrollRotatingLogoWrapper.tsx`**:
   - **Crucial Rule**: The 3D GLB logo model is **hidden (`opacity-0`)** at the top of the page (Hero & Services).
   - Wrapped by `ScrollRotatingLogoWrapper` with Next.js dynamic import (`ssr: false`) and scroll-intent trigger. Three.js runtime and GLB file are deferred from first paint.
   - It **only fades in and begins rotating when the user scrolls down to the Project Section (`#project`)**.
   - If user scrolls back up above `#project`, it smoothly fades back to `opacity-0`.

3. **`components/HeroSection.tsx`**:
   - **Merged Widescreen Layout**: The background is an automatic sideways-sliding image carousel (`heroSlides`) changing every 4.5 seconds.
   - **No Chinese / IPB badge** on top of the hero (removed per user request).
   - **Copy**:
     - Headline: `TAMAN SAN JAYA` (Majestic uppercase sans)
     - Slogan: *"Taman Tropis Asri & Ruang Hijau Impian"* (Serif italic sand `#D8CDAE`)
     - Subtext: *"Spesialis desain lanskap 3D, pembuatan taman tropis, relief tebing alami, & perawatan bergaransi tumbuh 100%."*
     - Button: Single pill button *"Konsultasi Sekarang"* linking to WhatsApp.
    - **Natural Divider**: The bottom of Hero is framed by [`group-1.webp`](/images/group-1.webp) (with fallback to `group-1.png`) spanning 100% full width from edge to edge, clearly visible on the first fold.

4. **`components/ServicesSection.tsx`**:
   - 3 Pillars:
     1. **Jasa Pembuatan** (Uses `/images/Pembuatan.jpg`)
     2. **Jasa Perencanaan** (Uses `/images/Perencanaan.jpg`)
     3. **Jasa Perawatan** (Uses `/images/Perawatan.jpg`)
   - Interactive 3-column accordion that expands on hover and returns to neutral balance on mouse leave.

5. **`components/ProjectSection.tsx` & Dedicated Detail Page (`/proyek/[id]`)**:
   - **Clean Architectural Monograph Design**:
     - **NO** category filter buttons ("Semua", "Taman Minimalis", etc. — removed per user request).
     - **NO** floating category badges on images.
     - **NO** clunky "Konsultasi Konsep" buttons at the bottom of cards.
   - **Layout & Navigation**:
     - Card 1 (index 0) is a wide featured banner spanning 2 columns (`md:col-span-2`).
     - Cards 2, 3, 4, 5 form a symmetrical 2x2 grid.
     - Clicking any project navigates directly in the main window (no pop-up modal, no new tab) to `/proyek/[id]` with a minimalist circular back arrow icon button.
     - Features index counter (`01`, `02`...), location tag with pin, bold title, photo counter, and refined description.
   - **`components/ProjectDetailView.tsx` (`/proyek/[id]`)**:
     - Dedicated page matching the architectural master design: large featured stage photo with photo counter (`X / N`) and arrows, 2-column project metadata, IPB assurance badges, full documentation photo gallery grid with keyboard navigation, and related projects grid.

6. **`components/CatalogSection.tsx` & Dedicated Detail Page (`/katalog/[id]`)**:
   - Curated 4-plant nursery catalog with live search, direct Tokopedia & Shopee marketplace buttons, and care guides.
   - Clicking a plant photo or title navigates directly in the main window to `/katalog/[id]` with a minimalist circular back arrow icon button.
   - **`components/ProductDetailView.tsx` (`/katalog/[id]`)**:
     - Dedicated e-commerce plant sales detail page matching Shopee/Tokopedia product viewer:
       - **Atas**: Large primary product photo stage with photo counter (`X / N`), prev/next arrow chevrons, and zoom lightbox.
       - **Bawah**: Compact horizontal thumbnail strip with crimson `#990633` active border, carousel arrow buttons, and auto-scroll thumbnail centering.
       - **Constraint**: Strict prohibition of separate documentation galleries below the content; all photos stay within the Shopee/Tokopedia media stage.
     - 2-column e-commerce layout: Plant name, large price display (`Rp XXX.000`), stock badge ("Tersedia"), direct Tokopedia & Shopee buy buttons, WhatsApp direct order CTA, and related plants grid.

7. **`components/AboutSection.tsx`**:
   - Brand story of *Taman San Jaya (成功之园)* and IPB University plant protection science.
   - Founder card of **Ergoputra Kusuma Sanjaya** with `/images/founder.jpg`.

8. **`components/Footer.tsx`**:
   - **Wildflower Crown**: Topped seamlessly by [`Group 2.svg`](/images/group-2.svg) spanning 100% full width (`w-full`) edge-to-edge right above the dark earth (`bg-brand-earth`) footer container.
   - Features brand information, page navigation, operational hours, WhatsApp contact, and admin login gateway.

---

## 5. 📁 Asset Catalog & Storage Map

All production-served assets reside in `public/images/`, while original raw sources are preserved in `asset-taman-sanjaya/`.

| File Path in `public/` | Description | Used In |
| :--- | :--- | :--- |
| `/images/proyek-1.jpeg` | Masterplan 3D Landscape Architecture Rendering | ProjectSection, HeroSlider |
| `/images/proyek-2.jpg` | Tropical Villa Walkway Garden with Frangipani | ProjectSection, HeroSlider |
| `/images/proyek-3.jpg` | Natural Tiered Stone Fountain & Courtyard Gazebo | ProjectSection, HeroSlider |
| `/images/proyek-4.avif` | Modern Luxury Residential Minimalist Garden & Bonsai | ProjectSection (Featured), HeroSlider |
| `/images/Pembuatan.jpg` | Landscape Ground Construction & Physical Planting | ServicesSection, ProjectSection |
| `/images/Perencanaan.jpg` | 3D Blueprint & Architectural Landscape Design | ServicesSection |
| `/images/Perawatan.jpg` | Plant Pathology & IPB Horticultural Maintenance | ServicesSection |
| `/images/group-1.webp`, `group-1.png` | Edge-to-edge natural rockery & flower section divider | HeroSection bottom |
| `/images/group-3.webp`, `group-3.png` | Cascading natural bougainvillea floral garland divider | FloralDivider (between Project & Catalog) |
| `/images/group-2.png`, `group-2.webp` | Edge-to-edge natural wildflower meadow section divider | Footer top crown |
| `/images/image-13.svg`, `image-13.webp` | Hanging botanical ivy bush | Top-right corner of layout |
| `/models/LogoTamanSanjaya.glb` | 3D GLB brand logo model (Draco + WebP compressed) | ScrollRotatingLogo3D |
| `/images/logo.png` | Official brand logo | Navbar, Footer |
| `/images/founder.jpg`, `founder.webp` | Founder portrait (Ergoputra Kusuma Sanjaya) | AboutSection |
| `/images/lidah-mertua.jpg` | Sansevieria plant photography | CatalogSection |
| `/images/monstera-janda-bolong.jpg` | Monstera Adansonii photography | CatalogSection |
| `/images/aglaonema.jpg` | Aglaonema plant photography | CatalogSection |
| `/images/anggrek.jpg` | Phalaenopsis orchid flower photography | CatalogSection |

---

## 6. 🗄️ Database & Data Synchronization

The application implements a dual-mode fallback architecture:
* Primary: Dynamic Supabase queries via `lib/data.ts`.
* Secondary / Fallback: `lib/placeholder-data.ts`.

### Golden Rule for Data Edits
When modifying copy, titles, services, or project data, **always synchronize both**:
1. Update `lib/placeholder-data.ts`
2. Update the Supabase database via SQL (`site_settings`, `services`, `projects`)

---

## 7. 🚀 Verification Checklist for Future Changes

Before submitting any code change:
1. **Type & Build Check**: Run `npm run build` — must exit with code 0 without TypeScript or lint errors.
2. **Koi Prohibition**: Ensure no references to koi fish or koi ponds are introduced.
3. **Palette Integrity**: Use only official `#D8CDAE`, `#990633`, `#174A73`, `#5C4033` tokens.
4. **Divider Integrity**: Ensure `group-1.webp` divider remains full-width (`w-full`) at the bottom of the Hero Section and `group-2.webp` remains full-width (`w-full`) crowned above the Footer.
5. **3D Logo Rule**: Ensure `ScrollRotatingLogo3D` remains hidden above `#project`.
