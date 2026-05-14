/**
 * Consultas Supabase desde el servidor con caché (`unstable_cache`, revalidate 60s).
 * El cliente anónimo no usa `cookies()` para ser compatible con el cache de Next.
 */
import { unstable_cache } from "next/cache";

import { createAnonymousServerClient } from "@/lib/supabase/anonymous-server";
import type {
  CategoryRow,
  Json,
  ProductRow,
  SettingsKey,
  SettingsValueMap,
} from "@/lib/types";

/** Revalidación ISR-style para datos de catálogo (segundos). */
const REVALIDATE_SECONDS = 60;

const fetchCategories = unstable_cache(
  async (): Promise<CategoryRow[]> => {
    const supabase = createAnonymousServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select(
        "id, slug, name, description, sort_order, is_active, created_at, updated_at",
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`getCategories: ${error.message}`);
    }

    return (data ?? []) as CategoryRow[];
  },
  ["supabase-categories"],
  { revalidate: REVALIDATE_SECONDS },
);

export async function getCategories(): Promise<CategoryRow[]> {
  return fetchCategories();
}

const fetchProductsByCategorySlug = unstable_cache(
  async (slug: string): Promise<ProductRow[]> => {
    const supabase = createAnonymousServerClient();

    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (categoryError) {
      throw new Error(`getProductsByCategory: ${categoryError.message}`);
    }

    if (!category) {
      return [];
    }

    const { data, error } = await supabase
      .from("products")
      .select(
        "id, category_id, slug, name, description, price, image_url, image_blur_data, badges, allergens, portions, is_active, is_featured, is_out_of_stock, sort_order, created_at, updated_at",
      )
      .eq("category_id", category.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`getProductsByCategory: ${error.message}`);
    }

    return (data ?? []) as ProductRow[];
  },
  ["supabase-products-by-category"],
  { revalidate: REVALIDATE_SECONDS },
);

export async function getProductsByCategory(slug: string): Promise<ProductRow[]> {
  return fetchProductsByCategorySlug(slug);
}

async function fetchSettingsValue(key: SettingsKey): Promise<Json | null> {
  return unstable_cache(
    async () => {
      const supabase = createAnonymousServerClient();
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", key)
        .maybeSingle();

      if (error) {
        throw new Error(`getSettings: ${error.message}`);
      }

      return data?.value ?? null;
    },
    [`supabase-settings-${key}`],
    { revalidate: REVALIDATE_SECONDS },
  )();
}

export async function getSettings<K extends SettingsKey>(
  key: K,
): Promise<SettingsValueMap[K] | null> {
  const raw = await fetchSettingsValue(key);
  if (raw === null) {
    return null;
  }
  return raw as SettingsValueMap[K];
}

const fetchFeaturedProducts = unstable_cache(
  async (): Promise<ProductRow[]> => {
    const supabase = createAnonymousServerClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        "id, category_id, slug, name, description, price, image_url, image_blur_data, badges, allergens, portions, is_active, is_featured, is_out_of_stock, sort_order, created_at, updated_at, categories!inner(is_active)",
      )
      .eq("is_featured", true)
      .eq("is_active", true)
      .eq("categories.is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`getFeaturedProducts: ${error.message}`);
    }

    return (data ?? []) as ProductRow[];
  },
  ["supabase-featured-products"],
  { revalidate: REVALIDATE_SECONDS },
);

export async function getFeaturedProducts(): Promise<ProductRow[]> {
  return fetchFeaturedProducts();
}
