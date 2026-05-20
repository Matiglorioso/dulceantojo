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

const AnnouncementLine = React.forwardRef<
  HTMLSpanElement,
  {
    items: AnnouncementItem[];
    trailingSeparator?: boolean;
    className?: string;
    "aria-hidden"?: boolean;
  }
>(function AnnouncementLine(
  { items, trailingSeparator = false, className, "aria-hidden": ariaHidden },
  ref
) {
  return (
    <span
      ref={ref}
      aria-hidden={ariaHidden}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 text-[11px] font-medium leading-none text-primary-foreground sm:text-xs",
        className
      )}
    >
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
      {trailingSeparator ? (
        <span className="px-6 font-normal text-primary-foreground/45" aria-hidden>
          |
        </span>
      ) : null}
    </span>
  );
});

export function Marquee({ items = DEFAULT_ITEMS }: MarqueeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [ready, setReady] = React.useState(false);
  const [needsMarquee, setNeedsMarquee] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  const label = items.map((item) => item.label).join(" | ");
  const showScroll = needsMarquee && !reducedMotion;

  const measure = React.useCallback(() => {
    const container = containerRef.current;
    const track = measureRef.current;
    if (!container || !track) return;

    setNeedsMarquee(track.scrollWidth > container.clientWidth + 1);
    setReady(true);
  }, []);

  React.useLayoutEffect(() => {
    measure();
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [measure, items]);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
        ref={containerRef}
        className={cn(
          "relative overflow-hidden py-1.5",
          ready && !showScroll && "flex justify-center px-4"
        )}
        onMouseEnter={() => showScroll && setPaused(true)}
        onMouseLeave={() => showScroll && setPaused(false)}
        onFocusCapture={() => showScroll && setPaused(true)}
        onBlurCapture={() => showScroll && setPaused(false)}
      >
        <AnnouncementLine
          ref={measureRef}
          items={items}
          className="pointer-events-none absolute left-0 top-0 -z-10 opacity-0"
          aria-hidden
        />

        {!ready ? (
          <div className="h-5" aria-hidden />
        ) : reducedMotion || !needsMarquee ? (
          <AnnouncementLine items={items} />
        ) : (
          <div
            className={cn(
              "flex w-max animate-da-marquee motion-reduce:animate-none",
              paused && "![animation-play-state:paused]"
            )}
          >
            <AnnouncementLine items={items} trailingSeparator className="px-10" />
            <AnnouncementLine
              items={items}
              trailingSeparator
              className="px-10"
              aria-hidden
            />
          </div>
        )}
      </div>
    </div>
  );
}
