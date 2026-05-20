"use client";

import * as React from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Marquee } from "@/components/public/Marquee";
import { cartItemCount } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/use-cart";

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

export function SiteHeader() {
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

  const goHome = () => onNavClick("inicio", "#inicio");

  return (
    <>
      {/* Fuera del sticky: aviso estático; al hacer scroll sale con la página */}
      <Marquee />

      <header className="sticky top-0 z-50">
      <div
        className="border-b border-border/70 bg-background/98 shadow-soft backdrop-blur-sm"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <div className="mx-auto max-w-6xl">
          {/* Desktop: una sola fila */}
          <div className="relative hidden h-14 items-center md:flex">
            <BrandLockup onClick={goHome} size="md" className="relative z-10" />

            <nav
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-label="Secciones principales"
            >
              <div className="pointer-events-auto flex items-center gap-0.5 lg:gap-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.id}
                    label={item.label}
                    active={activeNav === item.id}
                    onClick={() => onNavClick(item.id, item.hash)}
                  />
                ))}
              </div>
            </nav>

            <CartButton
              totalItems={totalItems}
              onOpen={openCart}
              className="relative z-10 ml-auto"
            />
          </div>

          {/* Mobile: marca + carrito; nav compacta debajo */}
          <div className="md:hidden">
            <div className="flex h-12 items-center justify-between gap-2">
              <BrandLockup onClick={goHome} size="sm" className="min-w-0 shrink" />
              <CartButton totalItems={totalItems} onOpen={openCart} className="shrink-0" />
            </div>
            <nav
              className="flex items-center justify-center gap-0 border-t border-border/40 py-1.5"
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
    </>
  );
}

function BrandLockup({
  onClick,
  size = "md",
  className,
}: {
  onClick: () => void;
  size?: "sm" | "md";
  className?: string;
}) {
  const logoClass = size === "md" ? "h-10 w-10 lg:h-11 lg:w-11" : "h-8 w-8";
  const textClass =
    size === "md"
      ? "text-xl lg:text-2xl"
      : "text-lg leading-none";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 font-display font-semibold text-primary transition-opacity hover:opacity-85 sm:gap-2",
        className
      )}
      aria-label="Ir al inicio — Dulce Antojo"
    >
      <span className={cn("whitespace-nowrap md:hidden", textClass)}>Dulce</span>
      <Image
        src="/dulceantojo.jpeg"
        alt=""
        width={40}
        height={40}
        className={cn("shrink-0 rounded-full object-cover ring-1 ring-primary/15", logoClass)}
        priority
      />
      <span className={cn("whitespace-nowrap md:hidden", textClass)}>Antojo</span>
    </button>
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
        "relative rounded-md px-2 py-1 text-sm font-medium text-primary/75 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        compact && "px-1.5 text-[12px]",
        active && "font-semibold text-primary"
      )}
      aria-current={active ? "page" : undefined}
    >
      {label}
      {active ? (
        <span
          className="absolute inset-x-1.5 -bottom-0.5 h-0.5 rounded-full bg-primary"
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
        "relative flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold leading-none text-primary-foreground">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      ) : null}
    </button>
  );
}
