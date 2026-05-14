import { Instagram, MessageCircle } from "lucide-react";
import Link from "next/link";

const INSTAGRAM_URL = "https://www.instagram.com/dulceantojo.paste";

type SiteFooterProps = {
  whatsappNumber: string;
};

export function SiteFooter({ whatsappNumber }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const whatsappDigits = whatsappNumber.replace(/\D/g, "");
  const whatsappHref = whatsappDigits ? `https://wa.me/${whatsappDigits}` : null;

  return (
    <footer className="mt-16 border-t border-primary-foreground/15 bg-primary px-4 py-10 text-primary-foreground sm:px-6 md:py-12">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl font-semibold">Dulce Antojo</p>
          <p className="mt-2 text-sm leading-relaxed text-primary-foreground/90">
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
            className="inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline"
            aria-label="Instagram Dulce Antojo"
          >
            <Instagram className="h-5 w-5 shrink-0" aria-hidden />
            Instagram
          </Link>
          {whatsappHref ? (
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline"
            >
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
              WhatsApp
            </Link>
          ) : (
            <p>WhatsApp</p>
          )}
        </div>

        <div className="flex flex-col gap-3 text-sm text-primary-foreground/95">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/70">
            Pedidos
          </h2>
          <p>48hs de anticipación</p>
          <p>Envíos a Córdoba capital</p>
          <p className="text-primary-foreground/80">© {year} Dulce Antojo</p>
        </div>
      </div>
    </footer>
  );
}
