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
    <span className="inline-flex shrink-0 items-center px-6 text-[13px] font-medium uppercase tracking-[0.2em] text-primary-foreground">
      <span>{message}</span>
      <span className="px-5" aria-hidden>
        ✦
      </span>
    </span>
  );

  return (
    <div ref={ref} className="border-b border-primary/20 bg-primary text-primary-foreground">
      {ready ? (
        <div className="overflow-hidden py-2.5">
          <div className="flex w-max animate-da-marquee">
            {track}
            <span
              className="inline-flex shrink-0 items-center px-6 text-[13px] font-medium uppercase tracking-[0.2em] text-primary-foreground"
              aria-hidden
            >
              <span>{message}</span>
              <span className="px-5">✦</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="h-10" aria-hidden />
      )}
    </div>
  );
}
