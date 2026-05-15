"use client";

import * as React from "react";

import type { CategoryRow, ProductRow } from "@/lib/types";
import { cn } from "@/lib/utils";

import { ProductCard } from "./ProductCard";

const ITEMS_PER_PAGE = 6;

export type CategoryTabItem = Pick<CategoryRow, "slug" | "name">;

type CategoryTabsProps = {
  categories: CategoryTabItem[];
  productsBySlug: Record<string, ProductRow[]>;
};

function scrollToTabs() {
  const tabs = document.getElementById("catalogo-tabs");
  if (!tabs) return;
  tabs.scrollIntoView({ behavior: "smooth", block: "start" });
}

function changePage(
  setPage: React.Dispatch<React.SetStateAction<number>>,
  updater: (p: number) => number
) {
  setPage(updater);
  requestAnimationFrame(() => scrollToTabs());
}

export function CategoryTabs({ categories, productsBySlug }: CategoryTabsProps) {
  const [active, setActive] = React.useState(() => categories[0]?.slug ?? "");
  const [page, setPage] = React.useState(1);
  const [fadeIn, setFadeIn] = React.useState(true);
  const skipFade = React.useRef(true);

  React.useEffect(() => {
    setActive((prev) => {
      const first = categories[0]?.slug ?? "";
      const slugs = new Set(categories.map((c) => c.slug));
      if (prev && slugs.has(prev)) {
        return prev;
      }
      return first;
    });
  }, [categories]);

  React.useEffect(() => {
    setPage(1);
  }, [active]);

  React.useEffect(() => {
    if (skipFade.current) {
      skipFade.current = false;
      return;
    }
    setFadeIn(false);
    const id = window.setTimeout(() => setFadeIn(true), 200);
    return () => window.clearTimeout(id);
  }, [active]);

  const products = productsBySlug[active] ?? [];
  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedProducts = products.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const headingId = `cat-${active}`;
  const activeCategoryName = categories.find((c) => c.slug === active)?.name ?? "Productos";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div
        id="catalogo-tabs"
        className="sticky top-16 z-30 -mx-4 scroll-mt-28 border-b border-border/80 bg-background/90 backdrop-blur-md sm:-mx-6"
      >
        <div
          className="mx-auto flex w-full max-w-3xl justify-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6"
          role="tablist"
          aria-label="Categorías de productos"
        >
          {categories.map((cat) => {
            const isActive = cat.slug === active;
            return (
              <button
                key={cat.slug}
                id={`tab-${cat.slug}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={headingId}
                className={cn(
                  "min-h-[44px] flex-1 rounded-full px-4 py-3 text-sm font-medium transition-colors sm:px-6 sm:text-base",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-foreground hover:bg-muted"
                )}
                onClick={() => {
                  setActive(cat.slug);
                  requestAnimationFrame(() => scrollToTabs());
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={cn("mt-6 transition-opacity duration-200", fadeIn ? "opacity-100" : "opacity-0")}
        role="tabpanel"
        id={headingId}
        aria-labelledby={`tab-${active}`}
      >
        <section>
          <h2 className="sr-only">{activeCategoryName}</h2>
          <div className="mb-6 border-t border-border/40" aria-hidden="true" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {paginatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  changePage(setPage, (p) => p - 1);
                }}
                disabled={safePage === 1}
                className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                ← Anterior
              </button>
              <span className="text-sm text-muted-foreground">
                Página {safePage} de {totalPages}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  changePage(setPage, (p) => p + 1);
                }}
                disabled={safePage === totalPages}
                className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                Siguiente →
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}


