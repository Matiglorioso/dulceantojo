"use client";

import * as React from "react";

type MarqueeProps = {
  message: string;
};

export function Marquee({ message }: MarqueeProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);

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

  const track = (
    <span className="inline-flex shrink-0 items-center gap-10 px-6 text-xs font-medium uppercase tracking-[0.2em] text-primary">
      {message}
    </span>
  );

  return (
    <div ref={ref} className="border-b border-border bg-accent/40 text-primary">
      {ready ? (
        <div className="overflow-hidden py-2.5">
          <div className="flex w-max animate-da-marquee">
            {track}
            <span className="inline-flex shrink-0 items-center gap-10 px-6 text-xs font-medium uppercase tracking-[0.2em] text-primary" aria-hidden>
              {message}
            </span>
          </div>
        </div>
      ) : (
        <div className="h-10" aria-hidden />
      )}
    </div>
  );
}
