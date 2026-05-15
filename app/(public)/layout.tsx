import { CartUi } from "@/components/public/CartUi";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { Toaster } from "@/components/ui/sonner";
import { getSettings } from "@/lib/queries";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [openingRaw, whatsappNumberRaw] = await Promise.all([
    getSettings("opening_message"),
    getSettings("whatsapp_number"),
  ]);
  const opening =
    openingRaw ?? "ENVÍOS A CÓRDOBA CAPITAL · PEDIDOS CON 48HS DE ANTICIPACIÓN";
  const whatsappNumber =
    whatsappNumberRaw ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  return (
    <>
      <SiteHeader announcement={opening} />
      {children}
      <SiteFooter whatsappNumber={whatsappNumber} />
      <div role="status" aria-live="polite" className="sr-only" />
      <Toaster position="top-center" />
      <CartUi whatsappNumber={whatsappNumber} />
    </>
  );
}
