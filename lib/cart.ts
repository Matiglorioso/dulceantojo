import { formatPriceAr } from "@/lib/format";

export const CART_STORAGE_KEY = "dulceantojo-cart-v1";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  qty: number;
};

export type ThankYouLine = {
  name: string;
  qty: number;
  total: number;
};

export type OrderFormData = {
  delivery: "Retiro" | "Envío";
  payment: "Efectivo" | "Transferencia";
  address: string;
  name: string;
  phone: string;
  notes: string;
};

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function buildWhatsAppOrderUrl(
  whatsappDigits: string,
  items: CartItem[],
  form: OrderFormData
): string {
  const total = cartTotal(items);
  const productLines = items.map(
    (item) => `• ${item.name} x${item.qty} = ${formatPriceAr(item.price * item.qty)}`
  );

  const lines = [
    "Hola! Quiero hacer un pedido en *Dulce Antojo* 💕",
    ...productLines,
    `• Entrega: ${form.delivery}`,
    form.delivery === "Envío" && form.address.trim()
      ? `• Dirección: ${form.address.trim()}`
      : null,
    `• Nombre: ${form.name.trim()}`,
    `• Mi WhatsApp: ${form.phone.trim()}`,
    `• Forma de pago: ${form.payment}`,
    `• Total: ${formatPriceAr(total)}`,
    form.notes.trim() ? `• Notas: ${form.notes.trim()}` : null,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${whatsappDigits}?text=${text}`;
}
