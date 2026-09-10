import { cache } from 'react';
import { createClient } from '@/utils/supabase/server';
import { SiteSettings, Product, Service, Project } from './types';
import {
  defaultSiteSettings,
  defaultServices,
  defaultProducts,
  defaultProjects,
} from './placeholder-data';

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return defaultSiteSettings;
    }
    return data as SiteSettings;
  } catch (err) {
    return defaultSiteSettings;
  }
});

export const getServices = cache(async (): Promise<Service[]> => {
  try {
    const supabase = createClient();
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
});

export const getProducts = cache(async (): Promise<Product[]> => {
  try {
    const supabase = createClient();
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
});

export const getProjects = cache(async (): Promise<Project[]> => {
  try {
    const supabase = createClient();
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
});

export const getProjectById = cache(async (id: string): Promise<Project | null> => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  try {
    const supabase = createClient();

    let query = supabase.from('projects').select('*');
    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      const fallback = defaultProjects.find((p) => p.id === id || p.slug === id);
      return fallback || null;
    }
    return data as Project;
  } catch (err) {
    const fallback = defaultProjects.find((p) => p.id === id || p.slug === id);
    return fallback || null;
  }
});

export const getOtherProjects = cache(async (currentId: string, limit: number = 3): Promise<Project[]> => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentId);

  try {
    const supabase = createClient();
    let query = supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true })
      .limit(limit);

    if (isUuid) {
      query = query.neq('id', currentId);
    } else {
      query = query.neq('slug', currentId);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return defaultProjects
        .filter((p) => p.id !== currentId && p.slug !== currentId)
        .slice(0, limit);
    }
    return data as Project[];
  } catch (err) {
    return defaultProjects
      .filter((p) => p.id !== currentId && p.slug !== currentId)
      .slice(0, limit);
  }
});

export const getProductById = cache(async (id: string): Promise<Product | null> => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  try {
    const supabase = createClient();

    let query = supabase.from('products').select('*');
    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      const fallback = defaultProducts.find((p) => p.id === id || p.slug === id);
      return fallback || null;
    }
    return data as Product;
  } catch (err) {
    const fallback = defaultProducts.find((p) => p.id === id || p.slug === id);
    return fallback || null;
  }
});

export const getOtherProducts = cache(async (currentId: string, limit: number = 4): Promise<Product[]> => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentId);

  try {
    const supabase = createClient();
    let query = supabase
      .from('products')
      .select('*')
      .order('order_index', { ascending: true })
      .limit(limit);

    if (isUuid) {
      query = query.neq('id', currentId);
    } else {
      query = query.neq('slug', currentId);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return defaultProducts
        .filter((p) => p.id !== currentId && p.slug !== currentId)
        .slice(0, limit);
    }
    return data as Product[];
  } catch (err) {
    return defaultProducts
      .filter((p) => p.id !== currentId && p.slug !== currentId)
      .slice(0, limit);
  }
});

export const getDashboardCounts = async (): Promise<{ products: number; projects: number; services: number }> => {
  try {
    const supabase = createClient();
    const [productsRes, projectsRes, servicesRes] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('services').select('*', { count: 'exact', head: true }),
    ]);

    return {
      products: productsRes.count ?? defaultProducts.length,
      projects: projectsRes.count ?? defaultProjects.length,
      services: servicesRes.count ?? defaultServices.length,
    };
  } catch (err) {
    return {
      products: defaultProducts.length,
      projects: defaultProjects.length,
      services: defaultServices.length,
    };
  }
};

