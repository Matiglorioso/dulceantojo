import { Instagram, MessageCircle } from "lucide-react";
import Link from "next/link";

const INSTAGRAM_URL = "https://www.instagram.com/dulceantojo.paste";
const linkChipClass =
  "inline-flex min-h-11 items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70";

type SiteFooterProps = {
  whatsappNumber: string;
};

export function SiteFooter({ whatsappNumber }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const whatsappDigits = whatsappNumber.replace(/\D/g, "");
  const whatsappHref = whatsappDigits ? `https://wa.me/${whatsappDigits}` : null;

  return (
    <footer id="site-footer" className="mt-16 text-primary-foreground">
      <div
        className="h-3 bg-gradient-to-r from-accent/80 via-primary/25 to-accent/80"
        aria-hidden="true"
      />
      <div className="bg-primary px-4 py-12 sm:px-6 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3 md:gap-8">
          <div>
            <p className="font-display text-4xl font-semibold leading-none">Dulce Antojo</p>
            <p className="text-primary-foreground/78 mt-3 max-w-xs text-sm leading-relaxed">
              Pastelería artesanal en Córdoba
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-primary-foreground/95">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/70">
              Contacto
            </h2>
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkChipClass}
              aria-label="Abrir Instagram de Dulce Antojo"
            >
              <Instagram className="h-5 w-5 shrink-0" aria-hidden />
              Instagram
            </Link>
            {whatsappHref ? (
              <Link
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={linkChipClass}
                aria-label="Abrir WhatsApp de Dulce Antojo"
              >
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
                WhatsApp
              </Link>
            ) : (
              <p className="text-primary-foreground/75">WhatsApp</p>
            )}
          </div>

          <div className="flex flex-col gap-3 text-sm text-primary-foreground/95">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/70">
              Pedidos
            </h2>
            <p>48 hs de anticipación</p>
            <p>Envíos a Córdoba capital</p>
            {whatsappHref ? (
              <Link
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 w-fit items-center rounded-full bg-primary-foreground px-5 py-2.5 text-sm font-bold text-primary shadow-sm transition-colors hover:bg-primary-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/80"
              >
                Hacer mi pedido por WhatsApp →
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      <div className="text-primary-foreground/82 bg-primary-hover px-4 py-5 text-sm sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 text-center sm:flex-row">
          <span>© {year} Dulce Antojo</span>
          <span className="hidden sm:inline" aria-hidden>
            ·
          </span>
          <Link
            href="/privacidad"
            className="min-h-11 rounded-full px-3 py-2 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70 sm:min-h-0 sm:py-0"
          >
            Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
