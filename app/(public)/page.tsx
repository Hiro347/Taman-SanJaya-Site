import React from 'react';
import HeroSection from '@/components/HeroSection';
import MarqueeBanner from '@/components/MarqueeBanner';
import ThreeDShowcase from '@/components/ThreeDShowcase';
import ServicesSection from '@/components/ServicesSection';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import FounderSection from '@/components/FounderSection';
import ProjectSection from '@/components/ProjectSection';
import CatalogSection from '@/components/CatalogSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import { getSiteSettings, getServices, getProducts, getProjects } from '@/lib/data';

// Dynamically fetch live data from Supabase
export const revalidate = 0;

export default async function HomePage() {
  const [settings, services, products, projects] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getProducts(),
    getProjects(),
  ]);

  return (
    <div className="w-full space-y-4 sm:space-y-8">
      {/* 1. Hero Section with 3D Botanical accents & Figma layout */}
      <HeroSection settings={settings} />

      {/* 2. Infinite Kinetic Typography Ribbon */}
      <MarqueeBanner />

      {/* 3. Interactive 3D Diorama Showcase with Tilt Physics */}
      <div id="3d-concept">
        <ThreeDShowcase settings={settings} />
      </div>

      {/* 4. Core Services (Perencanaan, Pembuatan, Perawatan) */}
      <ServicesSection services={services} settings={settings} />

      {/* 5. Interactive Before & After Transformation Slider */}
      <BeforeAfterSlider settings={settings} />

      {/* 6. Founder Spotlight: Ergoputra Kusuma Sanjaya (IPB Proteksi Tanaman) */}
      <FounderSection settings={settings} />

      {/* 7. Real Projects Showcase */}
      <ProjectSection projects={projects} settings={settings} />

      {/* 8. Ornamental Plants Catalog */}
      <CatalogSection products={products} settings={settings} />

      {/* 9. Brand Values & 4-Step Process */}
      <AboutSection settings={settings} />

      {/* 10. Direct WhatsApp Project Form & Contacts */}
      <ContactSection settings={settings} />
    </div>
  );
}
