"use client";

import * as React from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { cartItemCount } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/use-cart";

type SiteHeaderProps = {
  announcement: string;
};

type NavId = "inicio" | "productos" | "quienes-somos";

const NAV_ITEMS: { id: NavId; label: string; hash: string }[] = [
  { id: "inicio", label: "Inicio", hash: "#inicio" },
  { id: "productos", label: "Productos", hash: "#productos" },
  { id: "quienes-somos", label: "Quiénes somos", hash: "#quienes-somos" },
];

function scrollToHash(hash: string) {
  if (hash === "#inicio") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.querySelector(hash);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function SiteHeader({ announcement }: SiteHeaderProps) {
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  const totalItems = cartItemCount(items);
  const [activeNav, setActiveNav] = React.useState<NavId>("inicio");

  React.useEffect(() => {
    const sectionIds: NavId[] = ["inicio", "quienes-somos", "productos"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const onScroll = () => {
      if (window.scrollY < 120) {
        setActiveNav("inicio");
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < 120) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveNav(visible[0].target.id as NavId);
        }
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: [0, 0.2, 0.45] }
    );

    window.addEventListener("scroll", onScroll, { passive: true });
    elements.forEach((el) => observer.observe(el));
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const onNavClick = (id: NavId, hash: string) => {
    setActiveNav(id);
    scrollToHash(hash);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Barra superior — envíos / anticipación */}
      <div
        className="rounded-t-2xl bg-primary px-4 py-2.5 text-center text-[11px] font-bold uppercase leading-snug tracking-[0.14em] text-primary-foreground sm:text-xs sm:tracking-[0.18em]"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <p>{announcement}</p>
      </div>

      {/* Barra principal */}
      <div
        className="border-b border-border/70 bg-background/98 shadow-soft backdrop-blur-sm"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <div className="mx-auto max-w-6xl py-3 md:py-3.5">
          {/* Desktop */}
          <div className="hidden items-center gap-6 md:grid md:grid-cols-[1fr_auto_1fr]">
            <button
              type="button"
              onClick={() => onNavClick("inicio", "#inicio")}
              className="justify-self-start font-display text-2xl font-semibold leading-none text-primary transition-opacity hover:opacity-80 lg:text-[1.65rem]"
            >
              Dulce Antojo
            </button>

            <div className="flex flex-col items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavClick("inicio", "#inicio")}
                className="rounded-full ring-1 ring-primary/15 transition-transform hover:scale-[1.03]"
                aria-label="Ir al inicio"
              >
                <Image
                  src="/dulceantojo.jpeg"
                  alt=""
                  width={52}
                  height={52}
                  className="h-12 w-12 rounded-full object-cover lg:h-[52px] lg:w-[52px]"
                  priority
                />
              </button>
              <nav
                className="flex items-center gap-1 lg:gap-2"
                aria-label="Secciones principales"
              >
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.id}
                    label={item.label}
                    active={activeNav === item.id}
                    onClick={() => onNavClick(item.id, item.hash)}
                  />
                ))}
              </nav>
            </div>

            <CartButton
              totalItems={totalItems}
              onOpen={openCart}
              className="justify-self-end"
            />
          </div>

          {/* Mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <button
                type="button"
                onClick={() => onNavClick("inicio", "#inicio")}
                className="justify-self-start text-left font-display text-xl font-semibold leading-tight text-primary"
              >
                Dulce
                <br />
                Antojo
              </button>

              <button
                type="button"
                onClick={() => onNavClick("inicio", "#inicio")}
                className="rounded-full ring-1 ring-primary/15"
                aria-label="Ir al inicio"
              >
                <Image
                  src="/dulceantojo.jpeg"
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                  priority
                />
              </button>

              <CartButton totalItems={totalItems} onOpen={openCart} className="justify-self-end" />
            </div>

            <nav
              className="flex items-center justify-center gap-1 border-t border-border/50 pt-3"
              aria-label="Secciones principales"
            >
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.id}
                  label={item.label}
                  active={activeNav === item.id}
                  onClick={() => onNavClick(item.id, item.hash)}
                  compact
                />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  label,
  active,
  onClick,
  compact = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-md px-2.5 py-1.5 text-sm font-medium text-primary/75 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        compact && "px-2 py-1 text-[13px]",
        active && "font-semibold text-primary"
      )}
      aria-current={active ? "page" : undefined}
    >
      {label}
      {active ? (
        <span
          className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-primary"
          aria-hidden
        />
      ) : null}
    </button>
  );
}

function CartButton({
  totalItems,
  onOpen,
  className,
}: {
  totalItems: number;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      aria-label={
        totalItems > 0
          ? `Carrito, ${totalItems} producto${totalItems === 1 ? "" : "s"}`
          : "Carrito vacío"
      }
      onClick={() => {
        if (totalItems > 0) {
          onOpen();
        } else {
          toast("Tu carrito está vacío. Agregá productos desde el menú.");
        }
      }}
    >
      <ShoppingCart className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      {totalItems > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      ) : null}
    </button>
  );
}
