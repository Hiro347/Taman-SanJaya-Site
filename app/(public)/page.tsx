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
    <div className="w-full space-y-4">
      <HeroSection settings={settings} />
      <ServicesSection services={services} settings={settings} />
      <ProjectSection projects={projects} settings={settings} />
      <CatalogSection products={products} settings={settings} />
      <AboutSection settings={settings} />
      <ContactSection settings={settings} />
    </div>
  );
}
