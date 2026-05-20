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
  const [whatsappNumberRaw, businessLocation] = await Promise.all([
    getSettings("whatsapp_number"),
    getSettings("business_location"),
  ]);
  const whatsappNumber =
    whatsappNumberRaw ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter
        whatsappNumber={whatsappNumber}
        businessLocation={businessLocation}
      />
      <div role="status" aria-live="polite" className="sr-only" />
      <Toaster position="top-center" />
      <CartUi whatsappNumber={whatsappNumber} />
    </>
  );
}
