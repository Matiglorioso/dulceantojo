import { toast } from "sonner";

import { formatPriceAr } from "@/lib/format";

export function showAddedToCartToast(
  product: { name: string; price: number },
  quantity: number,
  onViewCart: () => void
) {
  const subtotal = product.price * quantity;
  const detail =
    quantity > 1
      ? `${product.name} · Cantidad ${quantity} · ${formatPriceAr(subtotal)}`
      : `${product.name} · ${formatPriceAr(subtotal)}`;

  toast.success("¡Agregado al carrito!", {
    description: detail,
    duration: 4000,
    action: {
      label: "Ver carrito",
      onClick: onViewCart,
    },
  });
}
