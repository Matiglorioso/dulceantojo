"use client";

import * as React from "react";
import { Instagram, ShoppingCart } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const INSTAGRAM_URL = "https://www.instagram.com/dulceantojo.paste";

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
        scrolled ? "bg-background/85 shadow-soft backdrop-blur-md" : "bg-background/95",
      )}
      style={{
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[44px_1fr_44px] items-center gap-2 py-2.5">
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
              scrolled ? "text-[28px]" : "text-[40px]",
            )}
          >
            Dulce Antojo
          </span>
          <span className="mt-0.5 hidden min-[480px]:block text-xs text-muted-foreground">
            Córdoba, Argentina
          </span>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-primary hover:bg-muted"
          aria-label="Carrito (próximamente)"
          disabled
        >
          <ShoppingCart className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </header>
  );
}
