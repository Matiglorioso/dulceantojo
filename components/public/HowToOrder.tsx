import * as React from "react";
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
      id="como-pedir"
      className="mt-6 w-full scroll-mt-32 bg-background py-4 md:mt-8 md:py-5"
      aria-labelledby="como-pedir-title"
    >
      <h2 id="como-pedir-title" className="sr-only">
        Cómo pedir
      </h2>
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <ol className="flex w-full list-none flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.n}>
              <li className="flex w-full justify-center sm:w-auto sm:flex-1">
                <StepContent step={step} />
              </li>
              {index < STEPS.length - 1 ? (
                <li
                  aria-hidden
                  className="hidden shrink-0 items-center justify-center px-1 text-base font-medium text-primary/35 sm:flex"
                >
                  →
                </li>
              ) : null}
            </React.Fragment>
          ))}
        </ol>
      </div>
    </section>
  );
}
