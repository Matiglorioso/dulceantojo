"use client";

import * as React from "react";
import { Instagram, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

const INSTAGRAM_URL = "https://www.instagram.com/dulceantojo.paste";
const categories = ["Tartas", "Tortas", "Budines"];

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/60 transition-[background-color,backdrop-filter,box-shadow]",
        scrolled ? "shadow-soft bg-background/85 backdrop-blur-md" : "bg-background/95"
      )}
      style={{
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[44px_1fr_44px] items-center gap-2 py-2.5 md:grid-cols-[1fr_auto_1fr] md:gap-6">
        <Link
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 w-11 items-center justify-center rounded-full text-primary hover:bg-muted"
          aria-label="Instagram Dulce Antojo"
        >
          <Instagram className="h-5 w-5" aria-hidden />
        </Link>

        <div className="flex min-w-0 flex-col items-center text-center">
          <span
            className={cn(
              "font-display font-semibold leading-none text-primary transition-[font-size]",
              scrolled ? "text-[28px]" : "text-[40px]"
            )}
          >
            Dulce Antojo
          </span>
          <span className="mt-0.5 hidden text-xs text-muted-foreground min-[480px]:block">
            Córdoba, Argentina
          </span>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-primary hover:bg-muted md:hidden"
          aria-label="Carrito (próximamente)"
          onClick={() => toast("Próximamente disponible 🎂")}
        >
          <ShoppingCart className="h-5 w-5" aria-hidden />
        </button>

        <nav
          className="hidden items-center justify-end gap-3 text-sm font-medium text-primary md:flex"
          aria-label="Categorías principales"
        >
          {categories.map((category) => (
            <Link
              key={category}
              href="#productos"
              className="rounded-full px-3 py-2 underline-offset-4 hover:bg-muted hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {category}
            </Link>
          ))}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Carrito (próximamente)"
            onClick={() => toast("Próximamente disponible 🎂")}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden />
          </button>
        </nav>
      </div>
    </header>
  );
}
