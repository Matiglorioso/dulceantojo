"use client";

import { CartModal } from "@/components/public/cart/CartModal";
import { ThankYouDialog } from "@/components/public/cart/ThankYouDialog";

type CartUiProps = {
  whatsappNumber: string;
};

export function CartUi({ whatsappNumber }: CartUiProps) {
  return (
    <>
      <CartModal whatsappNumber={whatsappNumber} />
      <ThankYouDialog />
    </>
  );
}
