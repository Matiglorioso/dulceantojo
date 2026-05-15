import type { HeroSlide } from "@/lib/types";

/** Fotos originales del catálogo (solo fondo; el texto va en el carrusel). */
export const HERO_SLIDE_IMAGES = [
  "/img/tartas/choco.jpeg",
  "/img/tartas/frutilla.jpeg",
  "/img/tortas/cheesecake-ny.png",
  "/img/budines/budines.jpeg",
] as const;

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    image: HERO_SLIDE_IMAGES[0],
    alt: "Chocotorta artesanal en capas",
    eyebrow: "Edición chocolate",
    headlineBefore: "Intensidad ",
    headlineEmphasis: "artesanal",
    headlineAfter: " en cada capa.",
  },
  {
    image: HERO_SLIDE_IMAGES[1],
    alt: "Tarta de frutillas frescas",
    eyebrow: "Frutos de estación",
    headlineBefore: "Frescura ",
    headlineEmphasis: "natural",
    headlineAfter: " seleccionada.",
  },
  {
    image: HERO_SLIDE_IMAGES[2],
    alt: "Cheesecake con topping de frutos rojos",
    eyebrow: "Clásicos infaltables",
    headlineBefore: "Texturas ",
    headlineEmphasis: "suaves",
    headlineAfter: " y delicadas.",
  },
  {
    image: HERO_SLIDE_IMAGES[3],
    alt: "Budines artesanales para compartir",
    eyebrow: "Para compartir",
    headlineBefore: "Momentos ",
    headlineEmphasis: "cotidianos",
    headlineAfter: " elevados.",
  },
];
