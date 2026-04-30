import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const pricePackages = defineCollection({
  loader: glob({ base: "./src/content/pricePackages", pattern: "**/*.yaml" }),
  schema: ({ image }) =>
    z.object({
      image: image(),
      imageAlt: z.string(),
      price: z.string(),
      priceTiers: z
        .array(
          z.object({
            guests: z.string(),
            amount: z.string(),
          }),
        )
        .optional(),
      title: z.string(),
      subtitle: z.string(),
      body: z.string(),
      capacity: z.string(),
      duration: z.string().optional(),
      includes: z.array(z.string()),
      featured: z.boolean().default(false),
      order: z.number().default(0),
    }),
});

export const collections = { pricePackages };
