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
    <div className="flex items-center justify-center gap-1.5 px-3 text-[9px] font-bold uppercase leading-none tracking-[0.14em] text-primary-foreground sm:text-[10px] sm:tracking-[0.16em]">
      <Icon className="h-3 w-3 shrink-0 text-primary-foreground/85" aria-hidden />
      <span className="text-center">{item.label}</span>
    </div>
  );
}

export function Marquee({ items = DEFAULT_ITEMS }: MarqueeProps) {
  const [index, setIndex] = React.useState(0);
  const [nextIndex, setNextIndex] = React.useState<number | null>(null);
  const [enterReady, setEnterReady] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  const active = items[index] ?? items[0];
  const label = items.map((item) => item.label).join(" | ");
  const isAnimating = nextIndex !== null;

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    if (nextIndex === null) {
      setEnterReady(false);
      return;
    }
    const id = requestAnimationFrame(() => setEnterReady(true));
    return () => cancelAnimationFrame(id);
  }, [nextIndex]);

  const startTransition = React.useCallback(() => {
    if (items.length <= 1 || isAnimating) return;
    setEnterReady(false);
    setNextIndex((index + 1) % items.length);
  }, [index, items.length, isAnimating]);

  React.useEffect(() => {
    if (items.length <= 1 || paused || isAnimating) return;

    const delay = reducedMotion ? ROTATE_MS : ROTATE_MS + SLIDE_MS;
    const id = window.setInterval(() => {
      if (reducedMotion) {
        setIndex((i) => (i + 1) % items.length);
      } else {
        startTransition();
      }
    }, delay);

    return () => window.clearInterval(id);
  }, [items.length, paused, reducedMotion, isAnimating, startTransition]);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform" || nextIndex === null) return;
    setIndex(nextIndex);
    setNextIndex(null);
    setEnterReady(false);
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
        <div
          className="relative h-4 w-full"
          aria-live="polite"
          aria-atomic="true"
        >
          {reducedMotion ? (
            <AnnouncementSlide item={active!} />
          ) : (
            <>
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center ease-in-out motion-reduce:transition-none",
                  "transition-transform duration-500",
                  isAnimating && "-translate-x-full"
                )}
                onTransitionEnd={isAnimating ? handleTransitionEnd : undefined}
              >
                <AnnouncementSlide item={active!} />
              </div>

              {isAnimating && nextIndex !== null ? (
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out motion-reduce:transition-none",
                    enterReady ? "translate-x-0" : "translate-x-full"
                  )}
                >
                  <AnnouncementSlide item={items[nextIndex]!} />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
