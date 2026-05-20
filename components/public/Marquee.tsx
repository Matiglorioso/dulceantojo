"use client";

import * as React from "react";
import { Clock, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type AnnouncementItem = {
  icon: LucideIcon;
  label: string;
};

const DEFAULT_ITEMS: AnnouncementItem[] = [
  { icon: Package, label: "Envíos a Córdoba capital" },
  { icon: Clock, label: "Pedidos con 48 h de anticipación" },
];

type MarqueeProps = {
  items?: AnnouncementItem[];
};

function AnnouncementTrack({ items }: { items: AnnouncementItem[] }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 px-10 text-[11px] font-medium leading-none text-primary-foreground sm:text-xs">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <React.Fragment key={item.label}>
            {index > 0 ? (
              <span className="px-1 font-normal text-primary-foreground/45" aria-hidden>
                |
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 shrink-0 text-primary-foreground/85" aria-hidden />
              <span>{item.label}</span>
            </span>
          </React.Fragment>
        );
      })}
      <span className="px-6 font-normal text-primary-foreground/45" aria-hidden>
        |
      </span>
    </span>
  );
}

export function Marquee({ items = DEFAULT_ITEMS }: MarqueeProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  const label = items.map((item) => item.label).join(" | ");

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      if (el.offsetWidth > 0) setReady(true);
    });
    ro.observe(el);
    if (el.offsetWidth > 0) setReady(true);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div
      ref={ref}
      className="border-b border-primary-foreground/10 bg-primary-hover text-primary-foreground"
      role="region"
      aria-label={label}
      style={{
        paddingLeft: "max(0px, env(safe-area-inset-left))",
        paddingRight: "max(0px, env(safe-area-inset-right))",
      }}
    >
      {ready ? (
        reducedMotion ? (
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-1.5 text-center text-[11px] font-medium leading-snug sm:gap-x-2.5 sm:text-xs">
            {items.map((item, index) => {
              const Icon = item.icon;
              return (
                <span key={item.label} className="inline-flex items-center gap-1.5">
                  {index > 0 ? (
                    <span className="px-0.5 font-normal text-primary-foreground/45" aria-hidden>
                      |
                    </span>
                  ) : null}
                  <Icon className="h-3.5 w-3.5 shrink-0 text-primary-foreground/85" aria-hidden />
                  <span>{item.label}</span>
                </span>
              );
            })}
          </p>
        ) : (
          <div
            className="overflow-hidden py-1.5"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            <div
              className={cn(
                "flex w-max animate-da-marquee motion-reduce:animate-none",
                paused && "![animation-play-state:paused]"
              )}
            >
              <AnnouncementTrack items={items} />
              <span aria-hidden>
                <AnnouncementTrack items={items} />
              </span>
            </div>
          </div>
        )
      ) : (
        <div className="h-7" aria-hidden />
      )}
    </div>
  );
}
