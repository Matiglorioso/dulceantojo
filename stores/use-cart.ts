"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem, ThankYouLine } from "@/lib/cart";
import { CART_STORAGE_KEY } from "@/lib/cart";

type CartState = {
  items: CartItem[];
  cartOpen: boolean;
  thankYou: ThankYouLine[] | null;
  thankYouTotal: number;
  addItem: (item: CartItem) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  showThankYou: (lines: ThankYouLine[], total: number) => void;
  dismissThankYou: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      cartOpen: false,
      thankYou: null,
      thankYouTotal: 0,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      setQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ cartOpen: true }),

      closeCart: () => set({ cartOpen: false }),

      showThankYou: (lines, total) =>
        set({ thankYou: lines, thankYouTotal: total, cartOpen: false }),

      dismissThankYou: () => set({ thankYou: null, thankYouTotal: 0 }),
    }),
    {
      name: CART_STORAGE_KEY,
      partialize: (state) => ({ items: state.items }),
    }
  )
);
