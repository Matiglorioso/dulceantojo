"use client";

import * as React from "react";
import { DollarSign, Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { buildWhatsAppOrderUrl, cartTotal, type OrderFormData } from "@/lib/cart";
import { formatPriceAr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/use-cart";

type CartModalProps = {
  whatsappNumber: string;
};

const emptyForm: OrderFormData = {
  delivery: "Retiro",
  payment: "Efectivo",
  address: "",
  name: "",
  phone: "",
  notes: "",
};

export function CartModal({ whatsappNumber }: CartModalProps) {
  const items = useCartStore((s) => s.items);
  const cartOpen = useCartStore((s) => s.cartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const showThankYou = useCartStore((s) => s.showThankYou);

  const [form, setForm] = React.useState<OrderFormData>(emptyForm);
  const [submitting, setSubmitting] = React.useState(false);

  const whatsappDigits = whatsappNumber.replace(/\D/g, "");
  const total = cartTotal(items);
  const isShipping = form.delivery === "Envío";

  React.useEffect(() => {
    if (!cartOpen) return;
    setForm(emptyForm);
  }, [cartOpen]);

  React.useEffect(() => {
    if (items.length === 0 && cartOpen) {
      closeCart();
    }
  }, [items.length, cartOpen, closeCart]);

  const onOpenChange = (open: boolean) => {
    if (!open) closeCart();
  };

  const updateField = <K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!whatsappDigits) {
      alert("WhatsApp no configurado. Contactanos por Instagram.");
      return;
    }

    if (items.length === 0) return;

    const name = form.name.trim();
    const phone = form.phone.trim();

    if (name.length < 3) {
      alert("El nombre debe tener al menos 3 caracteres");
      return;
    }
    if (!/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(name)) {
      alert("El nombre solo puede contener letras y espacios");
      return;
    }
    if (!/^[0-9]+$/.test(phone)) {
      alert("El WhatsApp solo puede contener números");
      return;
    }
    if (phone.length < 7) {
      alert("Por favor ingresa un número de WhatsApp válido");
      return;
    }
    if (isShipping && !form.address.trim()) {
      alert("Por favor ingresa la dirección de entrega");
      return;
    }

    const summary = items.map((item) => ({
      name: item.name,
      qty: item.qty,
      total: item.price * item.qty,
    }));

    const url = buildWhatsAppOrderUrl(whatsappDigits, items, form);

    setSubmitting(true);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => setSubmitting(false), 1500);

    clearCart();
    showThankYou(summary, total);
  };

  return (
    <Dialog open={cartOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92dvh,720px)] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="shrink-0 border-b border-border px-5 pb-3 pt-5 text-center">
          <DialogTitle className="font-display text-xl">Tu pedido</DialogTitle>
          <DialogDescription className="sr-only">
            Revisá los productos y completá tus datos para enviar el pedido por WhatsApp
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPriceAr(item.price)} × {item.qty} ={" "}
                      <span className="font-medium text-foreground">
                        {formatPriceAr(item.price * item.qty)}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-l-full text-primary hover:bg-muted"
                        aria-label={`Disminuir ${item.name}`}
                        onClick={() => setQty(item.id, item.qty - 1)}
                      >
                        <Minus className="h-4 w-4" aria-hidden />
                      </button>
                      <span className="w-8 text-center text-sm font-medium tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-r-full text-primary hover:bg-muted"
                        aria-label={`Aumentar ${item.name}`}
                        onClick={() => setQty(item.id, item.qty + 1)}
                      >
                        <Plus className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                      aria-label={`Eliminar ${item.name} del pedido`}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <Separator className="my-4" />

            <div className="flex items-center gap-3 rounded-xl bg-secondary/60 px-4 py-3">
              <DollarSign className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Total</p>
                <p className="text-xl font-semibold tabular-nums text-primary">
                  {formatPriceAr(total)}
                </p>
              </div>
            </div>

            <fieldset className="mt-6 space-y-3">
              <legend className="text-sm font-semibold text-foreground">
                Información de entrega
              </legend>
              <div className="flex flex-wrap gap-3">
                {(["Retiro", "Envío"] as const).map((value) => (
                  <label
                    key={value}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                      form.delivery === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={value}
                      checked={form.delivery === value}
                      onChange={() => updateField("delivery", value)}
                      className="sr-only"
                    />
                    {value}
                  </label>
                ))}
              </div>
              {isShipping ? (
                <Input
                  name="address"
                  placeholder="Calle, número, barrio, referencias"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  required
                  autoComplete="street-address"
                />
              ) : null}
            </fieldset>

            <fieldset className="mt-6 space-y-3">
              <legend className="text-sm font-semibold text-foreground">Datos de contacto</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="cart-name" className="sr-only">
                    Nombre
                  </Label>
                  <Input
                    id="cart-name"
                    name="name"
                    placeholder="Ej: María García"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    minLength={3}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cart-phone" className="sr-only">
                    WhatsApp
                  </Label>
                  <Input
                    id="cart-phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="Ej: 3511234567"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, ""))}
                    required
                    autoComplete="tel"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="mt-6 space-y-3">
              <legend className="text-sm font-semibold text-foreground">Forma de pago</legend>
              <div className="flex flex-wrap gap-3">
                {(["Efectivo", "Transferencia"] as const).map((value) => (
                  <label
                    key={value}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                      form.payment === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={form.payment === value}
                      onChange={() => updateField("payment", value)}
                      className="sr-only"
                    />
                    {value}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-6 space-y-2 pb-2">
              <legend className="text-sm font-semibold text-foreground">
                Aclaraciones (opcional)
              </legend>
              <textarea
                id="cart-notes"
                name="notes"
                rows={3}
                placeholder="Sin azúcar, dedicatoria, timbre, etc."
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </fieldset>
          </div>

          <div className="shrink-0 border-t border-border bg-background px-5 py-4">
            <Button
              type="submit"
              className="h-12 w-full rounded-full text-base"
              disabled={submitting || items.length === 0}
            >
              {submitting ? "Enviando…" : "Enviar pedido por WhatsApp"}
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Pedidos con 48 hs de anticipación · Envíos a Córdoba capital
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
