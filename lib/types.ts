/** JSON compatible con columnas `jsonb` de Supabase. */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Fila `categories` (lectura pública). */
export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/** Fila `products` (lectura pública). */
export type ProductRow = {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  image_blur_data: string | null;
  badges: string[];
  allergens: string[];
  portions: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_out_of_stock: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

/** Fila `settings`. */
export type SettingsRow = {
  id: string;
  key: string;
  value: Json;
  updated_at: string;
};

export type HeroSlide = {
  image: string | null;
  alt: string;
  title: string;
  subtitle: string;
  cta: string;
};

export type ShippingInfo = {
  zones: Json[];
  default_cost: number;
  free_above: number | null;
};

export type PaymentInfo = {
  alias: string;
  cbu: string;
  titular: string;
};

export type BusinessLocation = {
  city: string;
  country: string;
};

export type SettingsKey =
  | "whatsapp_number"
  | "hero_slides"
  | "opening_message"
  | "shipping_info"
  | "payment_info"
  | "anticipation_hours"
  | "business_location";

export type SettingsValueMap = {
  whatsapp_number: string;
  hero_slides: HeroSlide[];
  opening_message: string;
  shipping_info: ShippingInfo;
  payment_info: PaymentInfo;
  anticipation_hours: number;
  business_location: BusinessLocation;
};
