import Image from "next/image";
import Link from "next/link";
import { Instagram, MessageCircle, Truck, UtensilsCrossed } from "lucide-react";

import type { BusinessLocation } from "@/lib/types";

const INSTAGRAM_URL = "https://www.instagram.com/dulceantojo.paste";
const INSTAGRAM_HANDLE = "@dulceantojo.paste";

const NAV_LINKS = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Productos", href: "/#productos" },
  { label: "Quiénes somos", href: "/#quienes-somos" },
] as const;

const ORDER_STEPS = [
  { icon: UtensilsCrossed, text: "Elegí del catálogo" },
  { icon: MessageCircle, text: "Armá tu carrito" },
  { icon: Truck, text: "Envíos a Córdoba capital" },
] as const;

const sectionTitleClass =
  "text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground/65";

const footerLinkClass =
  "text-sm text-primary-foreground/90 transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/60 rounded-sm";

type SiteFooterProps = {
  whatsappNumber: string;
  businessLocation?: BusinessLocation | null;
};

function formatLocationLine(location?: BusinessLocation | null) {
  const city = location?.city?.trim() || "Córdoba";
  return `${city} · envíos a capital`;
}

export function SiteFooter({ whatsappNumber, businessLocation }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const whatsappDigits = whatsappNumber.replace(/\D/g, "");
  const whatsappHref = whatsappDigits ? `https://wa.me/${whatsappDigits}` : null;
  const locationLine = formatLocationLine(businessLocation);

  return (
    <footer id="site-footer" className="mt-16 border-t border-accent/30 text-primary-foreground">
      <div className="bg-primary px-4 py-8 sm:px-6 md:py-10">
        <div className="mx-auto grid max-w-6xl gap-8 sm:gap-10 lg:grid-cols-12 lg:items-start lg:gap-8">
          {/* Marca + redes */}
          <div className="lg:col-span-4">
            <Link
              href="/#inicio"
              className="inline-flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70"
              aria-label="Ir al inicio — Dulce Antojo"
            >
              <Image
                src="/dulceantojo.jpeg"
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-primary-foreground/20"
              />
              <span className="font-display text-2xl font-semibold leading-none sm:text-[1.65rem]">
                Dulce Antojo
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-foreground/75">
              Tartas, tortas y budines hechos a mano. Cada pedido con el cuidado de una receta
              casera.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={footerLinkClass}
                aria-label="Instagram de Dulce Antojo"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Instagram className="h-4 w-4 shrink-0" aria-hidden />
                  {INSTAGRAM_HANDLE}
                </span>
              </Link>
              {whatsappHref ? (
                <Link
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                  aria-label="WhatsApp de Dulce Antojo"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                    WhatsApp
                  </span>
                </Link>
              ) : null}
            </div>
          </div>

          {/* Navegación */}
          <nav className="lg:col-span-2" aria-label="Secciones del sitio">
            <h2 className={sectionTitleClass}>Navegación</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Cómo pedir */}
          <div className="lg:col-span-4">
            <h2 className={sectionTitleClass}>Cómo pedir</h2>
            <ol className="mt-3 flex flex-col gap-2.5">
              {ORDER_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.text}
                    className="flex items-center gap-2.5 text-sm text-primary-foreground/90"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10">
                      <Icon className="h-3.5 w-3.5 text-primary-foreground" aria-hidden />
                    </span>
                    <span>
                      <span className="sr-only">Paso {index + 1}: </span>
                      {step.text}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 text-xs text-primary-foreground/60">
              Pedidos con 48 horas de anticipación
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 lg:col-span-2 lg:items-stretch lg:pt-6">
            <Link
              href="/#productos"
              className="inline-flex min-h-10 items-center justify-center rounded-full border-2 border-primary-foreground/90 bg-transparent px-5 py-2 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70"
            >
              Ver productos
            </Link>
            <Link
              href="/#inicio"
              className="text-center text-xs text-primary-foreground/65 underline-offset-4 transition-colors hover:text-primary-foreground/90 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/60"
            >
              Volver arriba
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-primary-hover px-4 py-3.5 text-xs text-primary-foreground/75 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 text-center sm:flex-row sm:flex-wrap sm:gap-x-2 sm:gap-y-1">
          <span>© {year} Dulce Antojo</span>
          <span className="hidden text-primary-foreground/40 sm:inline" aria-hidden>
            ·
          </span>
          <Link
            href="/privacidad"
            className="underline-offset-4 transition-colors hover:text-primary-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/60"
          >
            Privacidad
          </Link>
          <span className="hidden text-primary-foreground/40 sm:inline" aria-hidden>
            ·
          </span>
          <span>{locationLine}</span>
          <span className="hidden text-primary-foreground/40 sm:inline" aria-hidden>
            ·
          </span>
          <span>48 hs de anticipación</span>
        </div>
      </div>
    </footer>
  );
}
