import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase para lecturas públicas en servidor sin `cookies()`.
 * Útil dentro de `unstable_cache` (no se puede usar `cookies()` ahí).
 * Misma clave publishable y mismas políticas RLS que el usuario anónimo.
 */
export function createAnonymousServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
