"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
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
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [autoplay]);
  const [selected, setSelected] = React.useState(0);
  const [showSwipeHint, setShowSwipeHint] = React.useState(true);

  React.useEffect(() => {
    const id = window.setTimeout(() => setShowSwipeHint(false), 3000);
    return () => window.clearTimeout(id);
  }, []);

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
    <section className="relative w-full" aria-roledescription="carrusel" aria-label="Destacados">
      <div className="shadow-soft overflow-hidden bg-card">
        <div ref={emblaRef} className="touch-pan-y">
          <div className="flex">
            {slides.map((slide, index) => (
              <div key={index} className="relative min-w-0 shrink-0 grow-0 basis-full">
                <div className="relative aspect-[4/3] max-h-[72vh] w-full overflow-hidden bg-primary sm:aspect-[16/7]">
                  {slide.image ? (
                    <Image
                      src={slide.image}
                      alt={slide.alt || slide.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority={index === 0}
                    />
                  ) : (
                    <div
                      className={cn(
                        "absolute inset-0 flex flex-col items-center justify-center gap-2 bg-primary px-6 text-center text-primary-foreground transition-opacity",
                        selected === index ? "opacity-0" : "opacity-100"
                      )}
                      aria-hidden="true"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 pb-6 text-primary-foreground sm:p-8">
                    <div>
                      <p className="text-balance font-display text-2xl font-semibold leading-tight sm:text-3xl">
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

      {showSwipeHint ? (
        <div
          className="shadow-soft pointer-events-none absolute right-4 top-1/2 z-10 flex -translate-y-1/2 animate-pulse items-center rounded-full bg-background/75 p-2 text-primary backdrop-blur-sm md:hidden"
          aria-hidden="true"
        >
          <ChevronRight className="h-5 w-5" />
        </div>
      ) : null}

      <div className="mt-4 flex justify-center gap-3" role="tablist" aria-label="Seleccionar slide">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={selected === i}
            aria-label={`Ir al slide ${i + 1}`}
            className="flex h-10 w-10 items-center justify-center rounded-full text-primary"
            onClick={() => emblaApi?.scrollTo(i)}
          >
            <span
              className={cn(
                "block h-3 w-3 rounded-full transition-colors",
                selected === i ? "bg-primary" : "bg-muted-foreground/40"
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
