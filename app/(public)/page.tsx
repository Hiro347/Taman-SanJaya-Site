import React from 'react';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
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
      {/* 1. Hero Section */}
      <HeroSection settings={settings} />

      {/* 2. Services Section (Perencanaan, Pembuatan, Perawatan) */}
      <ServicesSection services={services} settings={settings} />

      {/* 3. Real Projects Showcase */}
      <ProjectSection projects={projects} settings={settings} />

      {/* 4. Ornamental Plants Catalog */}
      <CatalogSection products={products} settings={settings} />

      {/* 5. About Us Section (With Founder Ergoputra Kusuma Sanjaya IPB photo) */}
      <AboutSection settings={settings} />

      {/* 6. Direct WhatsApp Project Form & Contacts */}
      <ContactSection settings={settings} />
    </div>
  );
}
