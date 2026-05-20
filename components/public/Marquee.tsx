"use client";

import * as React from "react";

const DEFAULT_ITEMS = [
  "📦 Envíos a Córdoba Capital",
  "⏰ Pedidos con 48hs de anticipación",
];

type MarqueeProps = {
  items?: string[];
};

function MarqueeTrack({ items }: { items: string[] }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-4 px-8 text-[10px] font-bold uppercase leading-none tracking-[0.14em] text-primary-foreground sm:tracking-[0.18em]">
      {items.map((item, index) => (
        <React.Fragment key={item}>
          {index > 0 ? (
            <span className="opacity-40" aria-hidden>
              ·
            </span>
          ) : null}
          <span>{item}</span>
        </React.Fragment>
      ))}
      <span className="px-4 opacity-40" aria-hidden>
        ·
      </span>
    </span>
  );
}

export function Marquee({ items = DEFAULT_ITEMS }: MarqueeProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const ro = new ResizeObserver(() => {
      if (el.offsetWidth > 0) {
        setReady(true);
      }
    });
    ro.observe(el);
    if (el.offsetWidth > 0) {
      setReady(true);
    }
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const label = items.join(" · ");

  return (
    <div
      ref={ref}
      className="bg-primary text-primary-foreground"
      role="region"
      aria-label={label}
      style={{
        paddingLeft: "max(0px, env(safe-area-inset-left))",
        paddingRight: "max(0px, env(safe-area-inset-right))",
      }}
    >
      {ready ? (
        reducedMotion ? (
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-0.5 px-4 py-1 text-center text-[10px] font-bold uppercase leading-none tracking-[0.14em] sm:tracking-[0.18em]">
            {items.map((item, index) => (
              <React.Fragment key={item}>
                {index > 0 ? (
                  <span className="opacity-40" aria-hidden>
                    ·
                  </span>
                ) : null}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </p>
        ) : (
          <div className="overflow-hidden py-1">
            <div className="flex w-max animate-da-marquee">
              <MarqueeTrack items={items} />
              <span aria-hidden>
                <MarqueeTrack items={items} />
              </span>
            </div>
          </div>
        )
      ) : (
        <div className="h-6" aria-hidden />
      )}
    </div>
  );
}
