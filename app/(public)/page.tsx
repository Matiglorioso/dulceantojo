import type { Metadata } from "next";

import { CategoryTabs } from "@/components/public/CategoryTabs";
import { HeroCarousel } from "@/components/public/HeroCarousel";
import { getSiteUrl } from "@/lib/site-url";
import type { HeroSlide } from "@/lib/types";
import { getCategories, getProductsByCategory, getSettings } from "@/lib/queries";

export const revalidate = 60;

const DEFAULT_HERO: HeroSlide[] = Array.from({ length: 4 }, (_, i) => ({
  image: null,
  alt: `Especialidades de la casa — slide ${i + 1}`,
  title: "¡Conocé nuestros productos!",
  subtitle: "ESPECIALIDADES DE LA CASA",
  cta: "Ver más",
}));

function normalizeHeroSlides(raw: unknown): HeroSlide[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return DEFAULT_HERO;
  }
  const slides: HeroSlide[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const o = item as Record<string, unknown>;
    slides.push({
      image: typeof o.image === "string" ? o.image : null,
      alt: typeof o.alt === "string" ? o.alt : "Dulce Antojo",
      title: typeof o.title === "string" ? o.title : "¡Conocé nuestros productos!",
      subtitle:
        typeof o.subtitle === "string" ? o.subtitle : "ESPECIALIDADES DE LA CASA",
      cta: typeof o.cta === "string" ? o.cta : "Ver más",
    });
  }
  return slides.length > 0 ? slides : DEFAULT_HERO;
}

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteUrl();
  const title = "Inicio";
  const description =
    "Pastelería artesanal en Córdoba. Tartas, tortas y budines con envío a Córdoba capital. Pedidos con 48 horas de anticipación.";

  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title: `Dulce Antojo — ${title}`,
      description,
      url: site,
      siteName: "Dulce Antojo",
      locale: "es_AR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Dulce Antojo — ${title}`,
      description,
    },
  };
}

export default async function HomePage() {
  const [categories, heroRaw, businessLocation, whatsappNumber] = await Promise.all([
    getCategories(),
    getSettings("hero_slides"),
    getSettings("business_location"),
    getSettings("whatsapp_number"),
  ]);

  const wa = whatsappNumber ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  const heroSlides = normalizeHeroSlides(heroRaw);

  const productsBySlug = Object.fromEntries(
    await Promise.all(
      categories.map((c) =>
        getProductsByCategory(c.slug).then((products) => [c.slug, products] as const),
      ),
    ),
  );

  const tabCategories = categories.map((c) => ({ slug: c.slug, name: c.name }));

  const phoneDigits = wa.replace(/\D/g, "");
  const telephone = phoneDigits.length > 0 ? `+${phoneDigits}` : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: "Dulce Antojo",
    description: "Pastelería artesanal en Córdoba.",
    url: getSiteUrl(),
    address: {
      "@type": "PostalAddress",
      addressLocality: businessLocation?.city ?? "Córdoba",
      addressCountry: businessLocation?.country ?? "AR",
    },
    ...(telephone ? { telephone } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pb-8">
        <h1 className="sr-only">Dulce Antojo — Pastelería artesanal en Córdoba</h1>

        <HeroCarousel slides={heroSlides} />

        <div id="productos" className="mt-10 scroll-mt-24">
          <CategoryTabs categories={tabCategories} productsBySlug={productsBySlug} />
        </div>
      </div>
    </>
  );
}
