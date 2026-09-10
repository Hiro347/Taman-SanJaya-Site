import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { SiteSettings, Product, Service, Project } from './types';
import {
  defaultSiteSettings,
  defaultServices,
  defaultProducts,
  defaultProjects,
} from './placeholder-data';

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return defaultSiteSettings;
    }
    return data as SiteSettings;
  } catch (err) {
    return defaultSiteSettings;
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultServices;
    }
    return data as Service[];
  } catch (err) {
    return defaultServices;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultProducts;
    }
    return data as Product[];
  } catch (err) {
    return defaultProducts;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultProjects;
    }
    return data as Project[];
  } catch (err) {
    return defaultProjects;
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    let query = supabase.from('projects').select('*');
    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      const fallback = defaultProjects.find((p) => p.id === id || p.slug === id);
      return fallback || null;
    }
    return data as Project;
  } catch (err) {
    const fallback = defaultProjects.find((p) => p.id === id || p.slug === id);
    return fallback || null;
  }
}

export async function getOtherProjects(currentId: string, limit: number = 3): Promise<Project[]> {
  const allProjects = await getProjects();
  return allProjects
    .filter((p) => p.id !== currentId && p.slug !== currentId)
    .slice(0, limit);
}

export async function getProductById(id: string): Promise<Product | null> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    let query = supabase.from('products').select('*');
    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      const fallback = defaultProducts.find((p) => p.id === id || p.slug === id);
      return fallback || null;
    }
    return data as Product;
  } catch (err) {
    const fallback = defaultProducts.find((p) => p.id === id || p.slug === id);
    return fallback || null;
  }
}

export async function getOtherProducts(currentId: string, limit: number = 4): Promise<Product[]> {
  const allProducts = await getProducts();
  return allProducts
    .filter((p) => p.id !== currentId && p.slug !== currentId)
    .slice(0, limit);
}

