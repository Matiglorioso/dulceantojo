import { Clock, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

export function Marquee({ items = DEFAULT_ITEMS }: MarqueeProps) {
  const label = items.map((item) => item.label).join(" | ");

  return (
    <div
      className="border-b border-border/60 bg-secondary text-primary"
      role="region"
      aria-label={label}
      style={{
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-1.5 text-center text-[11px] font-medium leading-snug sm:gap-x-2.5 sm:text-xs">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <span key={item.label} className="inline-flex items-center gap-1.5">
              {index > 0 ? (
                <span className="px-0.5 font-normal text-primary/35" aria-hidden>
                  |
                </span>
              ) : null}
              <Icon className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden />
              <span>{item.label}</span>
            </span>
          );
        })}
      </p>
    </div>
  );
}
