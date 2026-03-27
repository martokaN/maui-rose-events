// @ts-check
import { defineConfig, fontProviders } from "astro/config";

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
});
