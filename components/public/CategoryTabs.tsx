"use client";

import * as React from "react";

import type { CategoryRow, ProductRow } from "@/lib/types";
import { cn } from "@/lib/utils";

import { ProductCard } from "./ProductCard";

export type CategoryTabItem = Pick<CategoryRow, "slug" | "name">;

type CategoryTabsProps = {
  categories: CategoryTabItem[];
  productsBySlug: Record<string, ProductRow[]>;
};

export function CategoryTabs({ categories, productsBySlug }: CategoryTabsProps) {
  const [active, setActive] = React.useState(() => categories[0]?.slug ?? "");
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
    if (skipFade.current) {
      skipFade.current = false;
      return;
    }
    setFadeIn(false);
    const id = window.setTimeout(() => setFadeIn(true), 200);
    return () => window.clearTimeout(id);
  }, [active]);

  const products = productsBySlug[active] ?? [];
  const headingId = `cat-${active}`;
  const activeCategoryName = categories.find((c) => c.slug === active)?.name ?? "Productos";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="sticky top-16 z-30 -mx-4 border-b border-border/80 bg-background/90 backdrop-blur-md sm:-mx-6">
        <div
          className="scrollbar-hide flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-4 py-2 sm:px-6"
          role="tablist"
          aria-label="Categorías de productos"
        >
          {categories.map((cat) => {
            const isActive = cat.slug === active;
            const count = productsBySlug[cat.slug]?.length ?? 0;
            return (
              <button
                key={cat.slug}
                id={`tab-${cat.slug}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={headingId}
                className={cn(
                  "min-h-[44px] shrink-0 snap-center scroll-mx-4 rounded-full px-[18px] py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-foreground hover:bg-muted"
                )}
                onClick={() => setActive(cat.slug)}
              >
                <span>{cat.name}</span>
                <span className="ml-1 hidden rounded-full bg-background/20 px-1.5 text-xs font-semibold md:inline-flex">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent md:hidden"
          aria-hidden="true"
        />
      </div>

      <div
        className={cn("mt-6 transition-opacity duration-200", fadeIn ? "opacity-100" : "opacity-0")}
        role="tabpanel"
        id={headingId}
        aria-labelledby={`tab-${active}`}
      >
        <section>
          <h2 className="sr-only">{activeCategoryName}</h2>
          <h2
            className="mb-4 font-display text-xl font-semibold text-foreground"
            aria-hidden="true"
          >
            {activeCategoryName}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
