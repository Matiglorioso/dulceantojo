"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingWhatsAppButtonProps = {
  whatsappNumber: string;
};

export function FloatingWhatsAppButton({ whatsappNumber }: FloatingWhatsAppButtonProps) {
  const [showLabel, setShowLabel] = React.useState(true);
  const digits = whatsappNumber.replace(/\D/g, "");

  React.useEffect(() => {
    const timeout = window.setTimeout(() => setShowLabel(false), 3000);
    const onScroll = () => setShowLabel(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!digits) {
    return null;
  }

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-24 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-green-500 p-4 text-white shadow-lg transition-colors hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 md:bottom-6"
      aria-label="Contactar por WhatsApp"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-green-500 opacity-40" />
      <span
        className={cn(
          "max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-200 group-hover:max-w-40 group-hover:opacity-100 group-focus-visible:max-w-40 group-focus-visible:opacity-100",
          showLabel && "max-w-40 opacity-100"
        )}
      >
        Hacer tu pedido →
      </span>
      <MessageCircle className="h-6 w-6" aria-hidden />
    </a>
  );
}
