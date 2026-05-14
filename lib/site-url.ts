const DEFAULT_SITE_URL = "https://dulceantojo.vercel.app";
const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeHttpUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    return normalizeHttpUrl(configured) ?? DEFAULT_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return normalizeHttpUrl(`https://${process.env.VERCEL_URL}`) ?? DEFAULT_SITE_URL;
  }

  return process.env.NODE_ENV === "development" ? LOCAL_SITE_URL : DEFAULT_SITE_URL;
}
