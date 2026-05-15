import { MessageCircle, Truck, UtensilsCrossed } from "lucide-react";

export function HowToOrder() {
  return (
    <section className="border-y border-border/50 bg-muted/60 px-4 py-3 sm:py-4" aria-label="Cómo pedir">
      <ul className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-3 sm:flex-row sm:gap-0 sm:divide-x sm:divide-border/50">
        <li className="flex items-center gap-2 px-6 text-sm font-medium text-muted-foreground">
          <UtensilsCrossed className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          Elegí del catálogo
        </li>
        <li className="flex items-center gap-2 px-6 text-sm font-medium text-muted-foreground">
          <MessageCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          Pedido por WhatsApp
        </li>
        <li className="flex items-center gap-2 px-6 text-sm font-medium text-muted-foreground">
          <Truck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          Envíos a Córdoba capital
        </li>
      </ul>
    </section>
  );
}
