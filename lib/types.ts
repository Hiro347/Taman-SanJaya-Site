export interface SiteSettings {
  id?: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  whatsapp_number: string;
  whatsapp_message?: string;
  address?: string;
  google_maps_url?: string;
  instagram_url?: string;
  opening_hours?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  price_display?: string;
  description: string;
  care_instructions?: string;
  image_url: string;
  in_stock: boolean;
  featured?: boolean;
  order_index?: number;
  tokopedia_url?: string;
  shopee_url?: string;
  created_at?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_desc: string;
  full_desc?: string;
  icon_name: string;
  features: string[];
  image_url?: string;
  order_index?: number;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  image_url: string;
  before_image_url?: string;
  description: string;
  order_index?: number;
  created_at?: string;
}
