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
  const whatsappNumberRaw = await getSettings("whatsapp_number");
  const whatsappNumber =
    whatsappNumberRaw ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter whatsappNumber={whatsappNumber} />
      <div role="status" aria-live="polite" className="sr-only" />
      <Toaster position="top-center" />
      <CartUi whatsappNumber={whatsappNumber} />
    </>
  );
}
