"use client";

import * as React from "react";
import { Clock, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

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
    <div className="flex h-4 w-full shrink-0 items-center justify-center gap-1.5 px-3 text-[9px] font-bold uppercase leading-none tracking-[0.14em] text-primary-foreground sm:text-[10px] sm:tracking-[0.16em]">
      <Icon className="h-3 w-3 shrink-0 text-primary-foreground/85" aria-hidden />
      <span>{item.label}</span>
    </div>
  );
}

export function Marquee({ items = DEFAULT_ITEMS }: MarqueeProps) {
  const [slideIndex, setSlideIndex] = React.useState(0);
  const [noTransition, setNoTransition] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  const slides = React.useMemo(
    () => (items.length > 1 ? [...items, items[0]!] : items),
    [items]
  );

  const logicalIndex = slideIndex >= items.length ? 0 : slideIndex;
  const active = items[logicalIndex] ?? items[0];
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
      if (reducedMotion) {
        setSlideIndex((i) => (i + 1) % items.length);
      } else {
        setSlideIndex((prev) => (prev >= items.length ? prev : prev + 1));
      }
    }, delay);

    return () => window.clearInterval(id);
  }, [items.length, paused, reducedMotion]);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform" || slideIndex !== items.length) return;

    setNoTransition(true);
    setSlideIndex(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setNoTransition(false));
    });
  };

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
        className="overflow-hidden py-0.5"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {reducedMotion ? (
          <div
            className="flex items-center justify-center"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnnouncementSlide item={active!} />
          </div>
        ) : (
          <div className="relative h-4" aria-live="polite" aria-atomic="true">
            <div
              className={cn(
                "flex h-full ease-in-out motion-reduce:transition-none",
                !noTransition && "transition-transform duration-500"
              )}
              style={{ transform: `translate3d(-${slideIndex * 100}%, 0, 0)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {slides.map((item, i) => (
                <AnnouncementSlide
                  key={`${item.label}-${i}`}
                  item={item}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
