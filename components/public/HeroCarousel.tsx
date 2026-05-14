"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type HeroCarouselProps = {
  slides: HeroSlide[];
};

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const autoplay = React.useMemo(
    () =>
      Autoplay({
        delay: 5000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [autoplay]);
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) {
      return;
    }
    const onSelect = () => {
      setSelected(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section
      className="relative mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6"
      aria-roledescription="carrusel"
      aria-label="Destacados"
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div ref={emblaRef} className="touch-pan-y">
          <div className="flex">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="relative min-w-0 shrink-0 grow-0 basis-full"
              >
                <div className="relative aspect-[4/3] max-h-[60vh] w-full overflow-hidden bg-primary sm:mx-auto sm:max-w-4xl">
                  {slide.image ? (
                    <Image
                      src={slide.image}
                      alt={slide.alt || slide.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 896px"
                      priority={index === 0}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-primary px-6 text-center text-primary-foreground"
                      role="img"
                      aria-label={slide.alt || slide.title}
                    >
                      <span className="font-display text-2xl font-semibold text-balance sm:text-3xl">
                        {slide.title}
                      </span>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 pb-6 text-primary-foreground sm:p-8">
                    <div>
                      <p className="font-display text-2xl font-semibold leading-tight text-balance sm:text-3xl">
                        {slide.title}
                      </p>
                      <p className="mt-1 text-sm font-medium uppercase tracking-wide text-white/90">
                        {slide.subtitle}
                      </p>
                    </div>
                    <div className="pointer-events-auto">
                      <Button
                        asChild
                        size="lg"
                        className="h-11 min-w-[8rem] rounded-full bg-primary-foreground px-6 text-primary hover:bg-primary-foreground/90"
                      >
                        <a href="#productos">{slide.cta}</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="mt-4 flex justify-center gap-2"
        role="tablist"
        aria-label="Seleccionar slide"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={selected === i}
            aria-label={`Ir al slide ${i + 1}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-primary"
            onClick={() => emblaApi?.scrollTo(i)}
          >
            <span
              className={cn(
                "block h-2.5 w-2.5 rounded-full transition-colors",
                selected === i ? "bg-primary" : "bg-muted-foreground/40",
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
