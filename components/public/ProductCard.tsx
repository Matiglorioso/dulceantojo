"use client";

import * as React from "react";
import Image from "next/image";
import { Minus, Plus, Utensils } from "lucide-react";

import type { ProductRow } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPriceAr } from "@/lib/format";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: ProductRow;
};

export function ProductCard({ product }: ProductCardProps) {
  const [qty, setQty] = React.useState(1);
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const out = product.is_out_of_stock;
  const hasImage = Boolean(product.image_url);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(20, q + 1));

  const onAdd = () => {
    console.log({ productId: product.id, slug: product.slug, qty });
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {hasImage && product.image_url ? (
          <>
            {!imgLoaded && <Skeleton className="absolute inset-0 z-[1] rounded-none" />}
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={cn("object-cover transition-opacity", imgLoaded ? "opacity-100" : "opacity-0")}
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
          <div className="absolute left-2 top-2 z-[2] flex flex-wrap gap-1">
            {product.badges.map((b) => (
              <Badge
                key={b}
                variant="secondary"
                className="border-0 bg-accent font-bold text-accent-foreground shadow-md ring-1 ring-white/60"
              >
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
          <p className="shrink-0 text-base font-bold tabular-nums text-primary">
            {formatPriceAr(product.price)}
          </p>
        </div>
        {product.description ? (
          <p className="line-clamp-3 text-sm text-muted-foreground">{product.description}</p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 pb-1 pt-4">
          <div className="flex items-center rounded-full border border-border bg-background">
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
          <Button
            type="button"
            className="h-11 min-w-[7.5rem] flex-1 rounded-full sm:flex-initial"
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
