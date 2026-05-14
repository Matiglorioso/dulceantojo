"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingWhatsAppButtonProps = {
  whatsappNumber: string;
};

export function FloatingWhatsAppButton({ whatsappNumber }: FloatingWhatsAppButtonProps) {
  const [showLabel, setShowLabel] = React.useState(true);
  const [footerVisible, setFooterVisible] = React.useState(false);
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

  React.useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(Boolean(entry?.isIntersecting)),
      {
        threshold: 0.05,
      }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (!digits) {
    return null;
  }

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group fixed bottom-24 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-green-500 p-4 text-white shadow-lg transition-all duration-200 hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 md:bottom-6",
        footerVisible ? "pointer-events-none translate-y-3 opacity-0" : "translate-y-0 opacity-100"
      )}
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
