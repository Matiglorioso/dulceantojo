import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { Marquee } from "@/components/public/Marquee";
import { Toaster } from "@/components/ui/sonner";
import { getSettings } from "@/lib/queries";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const opening =
    (await getSettings("opening_message")) ??
    "ENVÍOS A CÓRDOBA CAPITAL · PEDIDOS CON 48HS DE ANTICIPACIÓN";

  return (
    <>
      <SiteHeader />
      <Marquee message={opening} />
      {children}
      <SiteFooter />
      <div role="status" aria-live="polite" className="sr-only" />
      <Toaster position="top-center" />
    </>
  );
}
