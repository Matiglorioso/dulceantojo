const steps = [
  {
    emoji: "🎂",
    number: "01",
    title: "Elegí tus productos",
    description: "Navegá el catálogo y seleccioná lo que más te guste",
  },
  {
    emoji: "💬",
    number: "02",
    title: "Contactanos por WhatsApp",
    description: "Envianos tu pedido con 48hs de anticipación",
  },
  {
    emoji: "🚗",
    number: "03",
    title: "Coordinamos la entrega",
    description: "Envíos a Córdoba capital o retiro en punto acordado",
  },
];

export function HowToOrder() {
  return (
    <section className="px-4 py-12 sm:px-6 md:py-16" aria-labelledby="how-to-order-title">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-border bg-muted/70 px-5 py-8 shadow-card sm:px-8 md:py-10">
        <h2
          id="how-to-order-title"
          className="text-center font-display text-3xl font-semibold text-primary sm:text-4xl"
        >
          ¿Cómo funciona?
        </h2>

        <div className="relative mt-8 grid gap-5 md:grid-cols-3 md:gap-8">
          <div className="absolute left-[16.5%] right-[16.5%] top-10 hidden border-t border-dashed border-primary/35 md:block" />
          {steps.map((step) => (
            <article
              key={step.number}
              className="shadow-soft relative z-10 rounded-2xl border border-border bg-background/85 p-5 text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/55 text-4xl shadow-sm">
                <span aria-hidden="true">{step.emoji}</span>
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-primary/70">
                Paso {step.number}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
