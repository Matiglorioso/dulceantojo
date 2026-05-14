"use client";

import { MessageCircle } from "lucide-react";

type FloatingWhatsAppButtonProps = {
  whatsappNumber: string;
};

export function FloatingWhatsAppButton({ whatsappNumber }: FloatingWhatsAppButtonProps) {
  const digits = whatsappNumber.replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 rounded-full bg-green-500 p-4 text-white shadow-lg transition-colors hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
    </a>
  );
}
