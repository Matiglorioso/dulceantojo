"use client";

import * as React from "react";
import Image from "next/image";
import { Minus, Plus, Star, Utensils } from "lucide-react";

import type { ProductRow } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPriceAr } from "@/lib/format";
import { PRODUCT_IMAGE_BY_SLUG } from "@/lib/product-images";
import { showAddedToCartToast } from "@/lib/cart-toast";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/use-cart";

type ProductCardProps = {
  product: ProductRow;
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [qty, setQty] = React.useState(1);
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [controlsOpen, setControlsOpen] = React.useState(false);
  const out = product.is_out_of_stock;
  const imageUrl = product.image_url ?? PRODUCT_IMAGE_BY_SLUG[product.slug];
  const hasImage = Boolean(imageUrl);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(20, q + 1));

  const onAdd = () => {
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    if (isMobile && !controlsOpen) {
      setControlsOpen(true);
      return;
    }

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      qty,
    });

    showAddedToCartToast(
      { name: product.name, price: product.price },
      qty,
      openCart
    );

    if (isMobile) {
      setControlsOpen(false);
      setQty(1);
    }
  };

  return (
    <article className="shadow-soft flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {hasImage && imageUrl ? (
          <>
            {!imgLoaded && <Skeleton className="absolute inset-0 z-[1] rounded-none" />}
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={cn(
                "object-cover transition-opacity",
                imgLoaded ? "opacity-100" : "opacity-0"
              )}
              placeholder={product.image_blur_data ? "blur" : "empty"}
              blurDataURL={product.image_blur_data ?? undefined}
              onLoad={() => setImgLoaded(true)}
            />
          </>
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-primary/10"
            aria-hidden
          >
            <Utensils className="h-10 w-10 text-primary/30" />
            <span className="text-xs text-muted-foreground">Imagen próximamente</span>
          </div>
        )}

        {product.badges.length > 0 && (
          <div className="absolute left-2 top-2 z-[2] flex flex-wrap gap-1 md:left-0 md:top-4">
            {product.badges.map((b) => (
              <Badge
                key={b}
                variant="secondary"
                className="gap-1 border-0 bg-amber-400 font-bold text-amber-900 shadow-md ring-1 ring-white/60 md:rounded-l-none md:rounded-r-full md:pl-3 md:pr-4"
              >
                <Star className="h-3 w-3 fill-current" aria-hidden />
                {b}
              </Badge>
            ))}
          </div>
        )}

        {out && (
          <div className="absolute inset-0 z-[2] flex items-center justify-center bg-background/70 text-sm font-semibold uppercase tracking-wide text-foreground">
            Agotado
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex min-w-0 items-baseline justify-between gap-2">
          <h3 className="min-w-0 flex-1 truncate font-display text-lg font-semibold text-foreground">
            {product.name}
          </h3>
          <p className="shrink-0 text-lg font-semibold tabular-nums text-primary">
            {formatPriceAr(product.price)}
          </p>
        </div>
        {product.description ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        ) : null}

        <div className="mt-auto flex flex-col gap-2 pb-1 pt-4 sm:flex-row sm:flex-wrap sm:items-center">
          <div
            className={cn(
              "grid overflow-hidden transition-all duration-200 sm:block",
              controlsOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0 sm:opacity-100"
            )}
          >
            <div className="flex min-h-0 items-center rounded-full border border-border bg-background">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-l-full text-primary hover:bg-muted"
                aria-label="Disminuir cantidad"
                onClick={dec}
                disabled={out}
              >
                <Minus className="h-4 w-4" aria-hidden />
              </button>
              <Input
                readOnly
                value={qty}
                tabIndex={-1}
                className="h-11 w-12 border-0 bg-transparent p-0 text-center text-sm font-medium tabular-nums focus-visible:ring-0"
                aria-label="Cantidad"
              />
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-r-full text-primary hover:bg-muted"
                aria-label="Aumentar cantidad"
                onClick={inc}
                disabled={out}
              >
                <Plus className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
          <Button
            type="button"
            className="h-11 min-w-[7.5rem] flex-1 rounded-full sm:flex-initial"
            disabled={out}
            onClick={onAdd}
            aria-expanded={controlsOpen}
          >
            Agregar
          </Button>
        </div>
      </div>
    </article>
  );
}
