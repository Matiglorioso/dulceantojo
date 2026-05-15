import type { HeroSlide } from "@/lib/types";

export const HERO_SLIDE_IMAGES = [
  "/img/hero/slide-chocolate.png",
  "/img/hero/slide-frutilla.png",
  "/img/hero/slide-clasicos.png",
  "/img/hero/slide-compartir.png",
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
