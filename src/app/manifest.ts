import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ankooaitelier",
    short_name: "Ankoo",
    description: "Modern fashion, delivered across Nigeria. Order easily on WhatsApp.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#177c4e",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
