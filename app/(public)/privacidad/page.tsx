import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Información básica de privacidad de Dulce Antojo.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-foreground sm:px-6 md:py-16">
      <h1 className="font-display text-4xl font-semibold text-primary">Privacidad</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          En Dulce Antojo usamos los datos que nos compartís únicamente para responder consultas,
          coordinar pedidos y organizar entregas.
        </p>
        <p>
          Si nos contactás por WhatsApp o Instagram, la conversación queda sujeta también a las
          políticas de esas plataformas.
        </p>
        <p>No vendemos ni compartimos tus datos personales con terceros para fines comerciales.</p>
      </div>
    </main>
  );
}
