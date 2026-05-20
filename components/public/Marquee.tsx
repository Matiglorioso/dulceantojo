"use client";

import * as React from "react";
import { Clock, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const DISPLAY_MS = 4500;
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
    <div className="flex items-center justify-center gap-1.5 px-3 text-[10px] font-bold uppercase leading-none tracking-[0.14em] text-primary-foreground sm:text-[11px] sm:tracking-[0.16em]">
      <Icon className="h-3.5 w-3.5 shrink-0 text-primary-foreground/85" aria-hidden />
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

  const indexRef = React.useRef(0);
  const active = items[index] ?? items[0];
  const label = items.map((item) => item.label).join(" | ");
  const isAnimating = nextIndex !== null;

  React.useEffect(() => {
    indexRef.current = index;
  }, [index]);

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

  React.useEffect(() => {
    if (items.length <= 1 || paused) return;

    let cancelled = false;
    let waitId = 0;
    let slideId = 0;

    const scheduleCycle = () => {
      waitId = window.setTimeout(() => {
        if (cancelled || paused) return;

        if (reducedMotion) {
          const next = (indexRef.current + 1) % items.length;
          indexRef.current = next;
          setIndex(next);
          scheduleCycle();
          return;
        }

        const next = (indexRef.current + 1) % items.length;
        setEnterReady(false);
        setNextIndex(next);

        slideId = window.setTimeout(() => {
          if (cancelled) return;
          indexRef.current = next;
          setIndex(next);
          setNextIndex(null);
          setEnterReady(false);
          scheduleCycle();
        }, SLIDE_MS);
      }, reducedMotion ? DISPLAY_MS : DISPLAY_MS);
    };

    scheduleCycle();

    return () => {
      cancelled = true;
      window.clearTimeout(waitId);
      window.clearTimeout(slideId);
    };
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
        className="overflow-hidden py-1"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          className="relative h-5 w-full"
          aria-live="polite"
          aria-atomic="true"
        >
          {reducedMotion ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <AnnouncementSlide item={active!} />
            </div>
          ) : (
            <>
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center ease-in-out",
                  isAnimating && "transition-transform duration-500 -translate-x-full"
                )}
              >
                <AnnouncementSlide item={active!} />
              </div>

              {isAnimating && nextIndex !== null ? (
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center ease-in-out transition-transform duration-500",
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
