import type { Metadata } from "next";

import { CategoryTabs } from "@/components/public/CategoryTabs";
import { HeroCarousel } from "@/components/public/HeroCarousel";
import { HowToOrder } from "@/components/public/HowToOrder";
import { HERO_IMAGE_FALLBACKS } from "@/lib/product-images";
import { getSiteUrl } from "@/lib/site-url";
import type { HeroSlide } from "@/lib/types";
import { getCategories, getProductsByCategory, getSettings } from "@/lib/queries";

export const revalidate = 60;

const HERO_COPY = [
  {
    title: "Tartas artesanales",
    subtitle: "Masa sablée con rellenos únicos",
    cta: "Ver tartas",
  },
  {
    title: "Tortas de ocasión",
    subtitle: "Diseñadas especialmente para vos",
    cta: "Ver tortas",
  },
  {
    title: "Budines de autor",
    subtitle: "Recetas con ingredientes seleccionados",
    cta: "Ver budines",
  },
  {
    title: "Especialidades de la casa",
    subtitle: "Lo mejor de nuestra pastelería",
    cta: "Ver todo",
  },
] as const;

const DEFAULT_HERO: HeroSlide[] = Array.from({ length: 4 }, (_, i) => ({
  image: HERO_IMAGE_FALLBACKS[i] ?? null,
  alt: `${HERO_COPY[i]?.title ?? "Dulce Antojo"} — slide ${i + 1}`,
  title: HERO_COPY[i]?.title ?? "Especialidades de la casa",
  subtitle: HERO_COPY[i]?.subtitle ?? "Lo mejor de nuestra pastelería",
  cta: HERO_COPY[i]?.cta ?? "Ver todo",
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
    const index = slides.length;
    const fallback = HERO_IMAGE_FALLBACKS[index] ?? null;
    const copy = HERO_COPY[index] ?? HERO_COPY[3];
    slides.push({
      image: typeof o.image === "string" ? o.image : fallback,
      alt: typeof o.alt === "string" ? o.alt : copy.title,
      title: copy.title,
      subtitle: copy.subtitle,
      cta: copy.cta,
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
        getProductsByCategory(c.slug).then((products) => [c.slug, products] as const)
      )
    )
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

        <HowToOrder />

        <div id="productos" className="scroll-mt-24 py-12 md:py-16">
          <CategoryTabs categories={tabCategories} productsBySlug={productsBySlug} />
        </div>
      </div>
    </>
  );
}
