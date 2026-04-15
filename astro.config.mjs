// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Noto Serif",
      cssVariable: "--font-noto-serif",
      weights: [300, 400, 500, 700],
      styles: ["normal", "italic"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Work Sans",
      cssVariable: "--font-work-sans",
      weights: [300, 400, 500, 700],
      styles: ["normal"],
    },
  ],
  integrations: [icon()],
  adapter: cloudflare({
    imageService: "compile",
  }),
});
