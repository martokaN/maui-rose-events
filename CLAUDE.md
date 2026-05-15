# CLAUDE.md – Astro + TS + CSS + Svelte

---

## Astro docs – always check first

Do not rely on memory for Astro APIs. Verify before writing:

- Overview + index: https://docs.astro.build/llms.txt
- Compact docs: https://docs.astro.build/llms-small.txt
- API reference: https://docs.astro.build/_llms-txt/api-reference.txt
- Recipes: https://docs.astro.build/_llms-txt/how-to-recipes.txt

---

## Stack

Astro (static-first) · TypeScript strict · Custom CSS · Svelte for complex islands · `astro-icon` + Lucide · Astro Font API · Nanostores (cross-island state) · Prettier

Use `@/` alias for `src/` (defined in `tsconfig.json`).

---

## Order of actions

astro.config.mts – fonts, integrations
src/styles/reset.css + global.css – tokens, utilities
src/layouts/Layout.astro – base layout
src/content/config.ts – Collection schemas (if needed)
src/assets/data/ – repeatable content files
Sections/components – top of page downward
src/actions/ – forms last, once markup exists

---

## Astro – prefer native APIs

| Need                             | Solution                               |
| -------------------------------- | -------------------------------------- |
| Images                           | `<Image />` from `astro:assets`        |
| Fonts                            | Astro Font API – never `<link>` or CDN |
| Forms & mutations                | Astro Actions + Zod                    |
| Structured content               | Content Collections                    |
| Icons                            | `<Icon name="lucide:…" />`             |
| Slow/personalized server content | `server:defer` (Server Island)         |

**Assets:** everything that needs optimization goes in `src/assets/`. Use `public/` only for files that must stay as-is (robots.txt, favicon, OG images).

**Output:** static by default. Astro pre-renders to HTML with zero JS – add interactivity only where needed via islands.

### Content Collections

Always define schemas with Zod in `src/content/config.ts`:

```ts
import { defineCollection, z } from "astro:content";

export const collections = {
  posts: defineCollection({
    schema: z.object({
      title: z.string(),
      publishDate: z.date(),
      tags: z.array(z.string()),
    }),
  }),
};
```

### Astro Actions

Always handle errors with `isInputError` / `isActionError`:

```ts
// src/actions/index.ts
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  contactForm: defineAction({
    input: z.object({
      email: z.string().email(),
      message: z.string().min(10),
    }),
    handler: async (input) => {
      /* server logic */
    },
  }),
};
```

```ts
// client
import { actions, isInputError, isActionError } from "astro:actions";

const result = await actions.contactForm(formData);
if (isInputError(result.error)) {
  /* validation errors */
}
if (isActionError(result.error)) {
  /* server errors */
}
```

---

## CSS

**Reset:** Andy Bell CSS reset – always first import.

**Design tokens:** All values (colors, typography, spacing, radius, transitions) as CSS custom properties in `:root`. No hardcoded values.

**Layout utilities – use these, don't reinvent:**

| Class              | Purpose                          |
| ------------------ | -------------------------------- |
| `.container`       | Centered wrapper with max-width  |
| `.even-columns`    | Auto-fit grid                    |
| `.flow`            | Vertical rhythm between children |
| `.cluster`         | Flex wrap with gap               |
| `.padding-block-*` | Section spacing from neighbours  |

**Spacing inside components:** prefer `flex` + `gap`. Margin is fine when it's the cleaner choice.

**BEM:** max 2 levels (`.card`, `.card__title`, `.card--active`). As few classes as possible. Utilities for section-level layout only, not inside component internals.

**Other:** `clamp()` for fluid scaling · `color-mix()` for overlays · `:focus-visible` not `:focus` · `prefers-reduced-motion` always respected · mobile-first (`min-width: 48em`)

---

## Component structure

```astro
---
import { Image } from "astro:assets";
import { Icon } from "astro-icon/components";
import items from "@/assets/data/items.json";

interface Props {
  title: string;
}
const { title } = Astro.props;
---

<!-- Section comment if purpose isn't obvious -->
<section class="section-name padding-block-lg">
  <div class="container flow">
    <h2>{title}</h2>
    <ul class="even-columns" role="list">
      {
        items.map((item) => (
          <li class="card">
            <Icon name={`lucide:${item.icon}`} />
            <h3 class="card__title">{item.title}</h3>
            <p>{item.body}</p>
          </li>
        ))
      }
    </ul>
  </div>
</section>

<style>
  .card {
    /* BEM */
  }
  .card__title {
  }
</style>

<script>
  /* Vanilla JS only if needed – type-assert DOM elements */
</script>
```

**Repeatable content** → `src/assets/data/` (JSON or TS with interface), never hardcoded in markup.

---

## Svelte islands

Use only for: reactive state with multiple interactions · complex transitions · real-time/client-fetched data · drag & drop.

```astro
<Counter client:load />
<!-- above the fold -->
<Chart client:visible />
<!-- below the fold -->
<Widget client:idle />
<!-- non-critical -->
```

**Cross-island state** → Nanostores (`@nanostores/persistent` if persistence needed).

---

## Hydration decision

```
Static content            → Astro component, zero JS
Slow / personalized data  → server:defer (Server Island)
Complex interactivity     → Svelte + client:*
```

---

## Accessibility

Semantic HTML · correct heading hierarchy · `role="list"` where relevant · `aria-live="polite"` for dynamic feedback · `aria-expanded` on toggles · `:focus-visible` · `prefers-reduced-motion`
