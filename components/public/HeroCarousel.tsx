"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";

type HeroCarouselProps = {
  slides: HeroSlide[];
};

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const autoplay = React.useMemo(
    () =>
      Autoplay({
        delay: 6000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [autoplay]);
  const [selected, setSelected] = React.useState(0);
  const [showSwipeHint, setShowSwipeHint] = React.useState(true);

  const scrollPrev = React.useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  React.useEffect(() => {
    const id = window.setTimeout(() => setShowSwipeHint(false), 3000);
    return () => window.clearTimeout(id);
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="relative w-full" aria-roledescription="carrusel" aria-label="Destacados">
      <div className="relative w-full overflow-hidden bg-muted">
        <div ref={emblaRef} className="touch-pan-y overflow-hidden">
          <div className="flex">
            {slides.map((slide, index) => (
              <div key={index} className="relative min-w-0 shrink-0 grow-0 basis-full">
                <div className="relative aspect-[16/9] max-h-[min(50vw,420px)] w-full overflow-hidden sm:max-h-[420px]">
                  {slide.image ? (
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      className="object-cover object-top"
                      sizes="100vw"
                      priority={index === 0}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-primary" aria-hidden />
                  )}

                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/25 via-black/5 to-transparent"
                    aria-hidden
                  />

                  <button
                    type="button"
                    onClick={scrollPrev}
                    className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/40 sm:flex"
                    aria-label="Slide anterior"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={scrollNext}
                    className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/40 sm:flex"
                    aria-label="Slide siguiente"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </button>

                  <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center gap-2 pb-3 pt-6 sm:pb-4">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Ir al slide ${i + 1}`}
                        aria-current={selected === i ? "true" : undefined}
                        className="flex h-8 w-8 items-center justify-center"
                        onClick={() => emblaApi?.scrollTo(i)}
                      >
                        <span
                          className={cn(
                            "block rounded-full bg-primary transition-all duration-300",
                            selected === i ? "h-2 w-2" : "h-2 w-2 opacity-35"
                          )}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="absolute inset-y-0 left-0 z-10 flex max-w-xl items-center px-4 sm:px-8 md:px-12 lg:px-14">
                    <div className="max-w-[min(100%,20rem)] rounded-2xl border border-white/60 bg-background/80 p-5 shadow-soft backdrop-blur-md sm:max-w-md sm:p-7">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">
                        {slide.eyebrow}
                      </p>
                      <h2 className="mt-2 text-balance font-display text-2xl font-semibold leading-snug text-primary sm:mt-3 sm:text-[1.75rem] sm:leading-tight md:text-3xl">
                        {slide.headlineBefore}
                        <em className="font-display italic">{slide.headlineEmphasis}</em>
                        {slide.headlineAfter}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showSwipeHint ? (
          <div
            className="pointer-events-none absolute right-4 top-1/2 z-20 flex -translate-y-1/2 animate-pulse items-center rounded-full bg-background/80 p-2 text-primary shadow-soft backdrop-blur-sm md:hidden"
            aria-hidden
          >
            <ChevronRight className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
