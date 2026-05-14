import "./globals.css";
import "sonner/dist/styles.css";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";

import { cn } from "@/lib/utils";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "600", "700"],
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dulce Antojo",
    template: "%s · Dulce Antojo",
  },
  description:
    "Pastelería artesanal en Córdoba. Tartas, tortas y budines. Envíos a Córdoba capital; pedidos con 48 horas de anticipación.",
  icons: {
    icon: [{ url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" }],
    apple: [{ url: "/icon-192.svg", sizes: "180x180", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#6B4A3A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn(display.variable, sans.variable)}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
