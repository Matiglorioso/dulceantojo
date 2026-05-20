"use client";

import * as React from "react";
import { Minus, Plus, Star } from "lucide-react";

import type { ProductRow } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPriceAr } from "@/lib/format";
import { showAddedToCartToast } from "@/lib/cart-toast";
import { useCartStore } from "@/stores/use-cart";

type ProductCardProps = {
  product: ProductRow;
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [qty, setQty] = React.useState(1);
  const out = product.is_out_of_stock;

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(20, q + 1));

  const onAdd = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      qty,
    });

    showAddedToCartToast({ name: product.name, price: product.price }, qty, openCart);
    setQty(1);
  };

  return (
    <article className="shadow-soft flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
      <div className="flex flex-1 flex-col gap-2 p-4">
        {(product.badges.length > 0 || out) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {product.badges.map((b) => (
              <Badge
                key={b}
                variant="secondary"
                className="gap-1 border-0 bg-primary font-semibold text-primary-foreground"
              >
                <Star className="h-3 w-3 fill-current" aria-hidden />
                {b}
              </Badge>
            ))}
            {out && (
              <Badge variant="outline" className="font-semibold uppercase tracking-wide">
                Agotado
              </Badge>
            )}
          </div>
        )}

        <div className="flex min-w-0 items-baseline justify-between gap-2">
          <h3 className="min-w-0 flex-1 truncate font-display text-xl font-semibold leading-tight text-foreground">
            {product.name}
          </h3>
          <p className="shrink-0 font-display text-xl font-semibold tabular-nums text-primary">
            {formatPriceAr(product.price)}
          </p>
        </div>
        <div className="min-h-[4.25rem] flex-1">
          {product.description ? (
            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t border-border/40 pt-3 sm:flex-row sm:items-center">
          <div className="flex items-center rounded-full border border-border bg-background">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-l-full text-primary hover:bg-muted"
              aria-label="Disminuir cantidad"
              onClick={dec}
              disabled={out}
            >
              <Minus className="h-3.5 w-3.5" aria-hidden />
            </button>
            <Input
              readOnly
              value={qty}
              tabIndex={-1}
              className="h-9 w-9 border-0 bg-transparent p-0 text-center text-sm font-medium tabular-nums shadow-none focus-visible:shadow-none focus-visible:ring-0"
              aria-label="Cantidad"
            />
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-r-full text-primary hover:bg-muted"
              aria-label="Aumentar cantidad"
              onClick={inc}
              disabled={out}
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
          <Button
            type="button"
            size="sm"
            className="h-9 w-full rounded-full px-4 text-sm sm:flex-1"
            disabled={out}
            onClick={onAdd}
          >
            Agregar
          </Button>
        </div>
      </div>
    </article>
  );
}
