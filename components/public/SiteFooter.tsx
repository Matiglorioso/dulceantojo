import { Instagram } from "lucide-react";
import Link from "next/link";

const INSTAGRAM_URL = "https://www.instagram.com/dulceantojo.paste";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-primary px-4 py-10 text-primary-foreground sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-2xl font-semibold">Dulce Antojo</p>
          <p className="mt-1 text-sm text-primary-foreground/90">Pastelería artesanal</p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-primary-foreground/95">
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
          <p>Pedidos con 48 hs de anticipación</p>
          <p>Envíos a Córdoba capital</p>
          <p className="text-primary-foreground/80">© {year} Dulce Antojo</p>
        </div>
      </div>
    </footer>
  );
}
