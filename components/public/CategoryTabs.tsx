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

function getHeaderOffset() {
  const header = document.querySelector("header");
  return (header?.getBoundingClientRect().height ?? 56) + 8;
}

/** Posiciona la vista al inicio del catálogo (tabs + grilla), respetando el header fijo. */
function scrollToCatalogTop() {
  const catalog = document.getElementById("catalogo-tabs");
  if (!catalog) return;

  const offset = getHeaderOffset();
  const top = catalog.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

export function CategoryTabs({ categories, productsBySlug }: CategoryTabsProps) {
  const [active, setActive] = React.useState(() => categories[0]?.slug ?? "");
  const [page, setPage] = React.useState(1);
  const [fadeIn, setFadeIn] = React.useState(true);
  const skipFade = React.useRef(true);
  const scrollAfterPageChange = React.useRef(false);

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

  React.useEffect(() => {
    if (!scrollAfterPageChange.current) return;
    scrollAfterPageChange.current = false;
    const id = window.setTimeout(scrollToCatalogTop, 80);
    return () => window.clearTimeout(id);
  }, [safePage]);

  const paginatedProducts = products.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const headingId = `cat-${active}`;
  const activeCategoryName = categories.find((c) => c.slug === active)?.name ?? "Productos";

  const goToPage = (updater: (p: number) => number) => {
    scrollAfterPageChange.current = true;
    setPage(updater);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div
        id="catalogo-tabs"
        className="-mx-4 border-b border-border/80 bg-background sm:-mx-6"
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
                onClick={() => setActive(cat.slug)}
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
          <div
            id="catalogo-grid"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          >
            {paginatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => goToPage((p) => Math.max(1, p - 1))}
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
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => goToPage((p) => Math.min(totalPages, p + 1))}
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
