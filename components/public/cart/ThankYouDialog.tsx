"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPriceAr } from "@/lib/format";
import { useCartStore } from "@/stores/use-cart";

export function ThankYouDialog() {
  const thankYou = useCartStore((s) => s.thankYou);
  const thankYouTotal = useCartStore((s) => s.thankYouTotal);
  const dismissThankYou = useCartStore((s) => s.dismissThankYou);

  return (
    <Dialog open={thankYou !== null} onOpenChange={(open) => !open && dismissThankYou()}>
      <DialogContent className="max-w-md sm:rounded-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="font-display text-xl">¡Gracias por tu pedido!</DialogTitle>
          <DialogDescription>
            Te redirigimos a WhatsApp para confirmar los detalles con nosotros.
          </DialogDescription>
        </DialogHeader>

        {thankYou && thankYou.length > 0 ? (
          <div className="space-y-2 rounded-xl border border-border bg-secondary/40 p-4">
            <h3 className="text-sm font-semibold text-foreground">Resumen del pedido</h3>
            <ul className="space-y-2 text-sm">
              {thankYou.map((line) => (
                <li key={`${line.name}-${line.qty}`} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    {line.name} ×{line.qty}
                  </span>
                  <span className="shrink-0 font-medium tabular-nums">{formatPriceAr(line.total)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-border pt-2 text-sm font-semibold">
              <span>Total</span>
              <span className="tabular-nums text-primary">{formatPriceAr(thankYouTotal)}</span>
            </div>
          </div>
        ) : null}

        <Button type="button" className="w-full rounded-full" onClick={() => dismissThankYou()}>
          Seguir explorando
        </Button>
      </DialogContent>
    </Dialog>
  );
}
