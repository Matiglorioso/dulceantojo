"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
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
    <section
      className="relative w-full"
      aria-roledescription="carrusel"
      aria-label="Destacados"
    >
      <div className="flex h-[460px] w-full flex-col overflow-hidden sm:h-[520px] sm:flex-row">
        <div className="flex w-full shrink-0 flex-col items-center justify-center bg-background px-10 py-8 text-center sm:w-[45%] sm:px-12 sm:py-0 md:px-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            PASTELERÍA ARTESANAL · CÓRDOBA
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold leading-tight text-primary sm:text-4xl md:text-5xl">
            Hecho a mano, con <em className="italic">amor</em>.
          </h2>
          <Link
            href="#productos"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Ver productos →
          </Link>
        </div>

        <div className="relative min-h-0 w-full flex-1 sm:w-[55%]">
          <div ref={emblaRef} className="h-full touch-pan-y overflow-hidden">
            <div className="flex h-full">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="relative h-full min-w-0 shrink-0 grow-0 basis-full"
                  aria-hidden={selected !== index}
                >
                  {slide.image ? (
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      sizes="(max-width: 640px) 100vw, 55vw"
                      priority={index === 0}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted" aria-hidden />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-primary/80 p-2 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary sm:flex"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-primary/80 p-2 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary sm:flex"
            aria-label="Slide siguiente"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>

          <div
            className="absolute inset-x-0 bottom-0 z-10 flex justify-center gap-2 pb-3 pt-6 sm:pb-4"
            role="tablist"
            aria-label="Seleccionar slide"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-label={`Ir al slide ${i + 1}`}
                aria-selected={selected === i}
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

          {showSwipeHint ? (
            <div
              className="pointer-events-none absolute right-4 top-1/2 z-20 flex -translate-y-1/2 animate-pulse items-center rounded-full bg-background/90 p-2 text-primary shadow-soft backdrop-blur-sm sm:hidden"
              aria-hidden
            >
              <ChevronRight className="h-5 w-5" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
