"use client";

import * as React from "react";
import { Clock, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ROTATE_MS = 4500;
const SLIDE_MS = 500;

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

function AnnouncementSlide({ item }: { item: AnnouncementItem }) {
  const Icon = item.icon;
  return (
    <div className="flex w-full shrink-0 items-center justify-center gap-1.5 px-4 text-[11px] font-medium leading-none text-primary-foreground sm:text-xs">
      <Icon className="h-3.5 w-3.5 shrink-0 text-primary-foreground/85" aria-hidden />
      <span>{item.label}</span>
    </div>
  );
}

export function Marquee({ items = DEFAULT_ITEMS }: MarqueeProps) {
  const [index, setIndex] = React.useState(0);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  const active = items[index] ?? items[0];
  const label = items.map((item) => item.label).join(" | ");

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    if (items.length <= 1 || paused) return;

    const delay = reducedMotion ? ROTATE_MS : ROTATE_MS + SLIDE_MS;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, delay);

    return () => window.clearInterval(id);
  }, [items.length, paused, reducedMotion]);

  return (
    <div
      className="border-b border-primary-foreground/10 bg-primary-hover text-primary-foreground"
      role="region"
      aria-label={label}
      style={{
        paddingLeft: "max(0px, env(safe-area-inset-left))",
        paddingRight: "max(0px, env(safe-area-inset-right))",
      }}
    >
      <div
        className="overflow-hidden py-1.5"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {reducedMotion ? (
          <div
            className="flex items-center justify-center px-4"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnnouncementSlide item={active!} />
          </div>
        ) : (
          <div
            className="relative h-5 sm:h-[1.375rem]"
            aria-live="polite"
            aria-atomic="true"
          >
            <div
              className="flex h-full transition-transform duration-500 ease-in-out motion-reduce:transition-none"
              style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
            >
              {items.map((item) => (
                <AnnouncementSlide key={item.label} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
