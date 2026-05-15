export function AboutSection() {
  return (
    <section
      id="quienes-somos"
      className="scroll-mt-32 border-y border-border/60 bg-secondary/30 px-4 py-14 md:py-20"
      aria-labelledby="quienes-somos-title"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Quiénes somos
        </p>
        <h2
          id="quienes-somos-title"
          className="mt-3 font-display text-3xl font-semibold text-primary md:text-4xl"
        >
          Pastelería artesanal en Córdoba
        </h2>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          En Dulce Antojo elaboramos tartas, tortas y budines a mano, con ingredientes
          seleccionados y el cuidado de una receta casera. Trabajamos pedidos con anticipación
          para que cada entrega llegue fresca y como la imaginaste.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Envíos a Córdoba capital · Pedidos con 48 horas de anticipación
        </p>
      </div>
    </section>
  );
}
