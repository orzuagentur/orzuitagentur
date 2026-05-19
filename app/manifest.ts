import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OrzuIT",
    short_name: "OrzuIT",
    description:
      "Individuelle Software, KI-Automatisierung und moderne Webloesungen.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#7dd3fc",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
