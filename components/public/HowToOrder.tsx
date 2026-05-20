import Link from "next/link";

const STEPS = [
  { n: 1, label: "Elegí del catálogo", href: "/#productos" },
  { n: 2, label: "Armá tu carrito", href: "/#productos" },
  { n: 3, label: "Confirmá por WhatsApp" },
] as const;

function StepBadge({ n }: { n: number }) {
  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold leading-none text-primary-foreground"
      aria-hidden
    >
      {n}
    </span>
  );
}

function StepContent({ step }: { step: (typeof STEPS)[number] }) {
  const inner = (
    <>
      <StepBadge n={step.n} />
      <span>{step.label}</span>
    </>
  );

  if ("href" in step && step.href) {
    return (
      <Link
        href={step.href}
        className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {inner}
      </Link>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
      {inner}
    </span>
  );
}

export function HowToOrder() {
  return (
    <section
      className="mt-5 bg-background px-4 pb-1 pt-2 md:mt-7 md:pb-2"
      aria-label="Cómo pedir"
    >
      <ol className="mx-auto flex max-w-4xl list-none flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-x-2 sm:gap-y-2">
        {STEPS.map((step, index) => (
          <li key={step.n} className="flex items-center gap-2 sm:gap-2.5">
            <StepContent step={step} />
            {index < STEPS.length - 1 ? (
              <span
                className="hidden text-base font-medium text-primary/35 sm:inline"
                aria-hidden
              >
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
