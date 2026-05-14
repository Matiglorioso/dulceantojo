import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dulce Antojo",
    short_name: "Dulce Antojo",
    description: "Pastelería artesanal en Córdoba.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF7F3",
    theme_color: "#6B4A3A",
    lang: "es",
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
