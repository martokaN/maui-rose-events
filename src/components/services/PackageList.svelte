<script lang="ts">
  import { Users, Clock, ChevronDown, Check } from "lucide-svelte";

  interface PriceTier {
    guests: string;
    amount: string;
  }
  interface Addon {
    id: string;
    name: string;
    note?: string;
    price: string;
    amount: number;
    pkgs?: string[];
  }
  interface Package {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    basePrice: number;
    body: string;
    includes: string[];
    capacity?: string;
    duration?: string;
    featured?: boolean;
    priceTiers?: PriceTier[];
    addons?: Addon[];
    imageSrc: string;
    imageAlt: string;
  }

  let {
    packages,
    selectedPkgId,
    openTiersId,
    onSelect,
    onToggleTiers,
  }: {
    packages: Package[];
    selectedPkgId: string | null;
    openTiersId: string | null;
    onSelect: (id: string) => void;
    onToggleTiers: (id: string) => void;
  } = $props();
</script>

<section class="pkg-editorial">
  <div class="container">
    <div class="pkg-editorial__header section-header">
      <h2 class="pkg-editorial__heading">An experience for every occasion</h2>
      <span class="label italic-heading">Curated Packages</span>
    </div>

    <ol class="pkg-editorial__list" role="list">
      {#each packages as pkg, i}
        {@const selected = selectedPkgId === pkg.id}
        {@const tiersOpen = openTiersId === pkg.id}

        <li
          class="pkg-editorial__item"
          class:pkg-editorial__item--featured={pkg.featured}
          class:pkg-editorial__item--selected={selected}
          onclick={() => onSelect(pkg.id)}
          role="option"
          aria-selected={selected}
          tabindex="0"
          onkeydown={(e) => e.key === "Enter" && onSelect(pkg.id)}
        >
          <div class="pkg-editorial__media">
            <img
              src={pkg.imageSrc}
              alt={pkg.imageAlt}
              class="pkg-editorial__image"
            />
            <span class="badge pkg-editorial__price">{pkg.price}</span>
          </div>

          <div class="pkg-editorial__content">
            <div class="pkg-editorial__meta">
              <span class="pkg-editorial__number" aria-hidden="true"
                >0{i + 1}</span
              >
              <div class="pkg-editorial__meta-right">
                <div class="pkg-select-indicator">
                  <span
                    class="pkg-select-indicator__circle"
                    class:pkg-select-indicator__circle--checked={selected}
                  >
                    {#if selected}<Check size={10} strokeWidth={2.5} />{/if}
                  </span>
                  <span class="pkg-select-indicator__label">
                    {selected ? "Selected" : "Select"}
                  </span>
                </div>
              </div>
            </div>

            <h3 class="pkg-editorial__title">{pkg.title}</h3>
            <p class="pkg-editorial__subtitle">{pkg.subtitle}</p>

            <div class="pkg-editorial__specs">
              {#if pkg.capacity}
                <div class="pkg-editorial__spec">
                  <Users size={16} class="spec-icon" />
                  <div class="pkg-editorial__spec-info">
                    <span class="label">Capacity</span>
                    <span class="value">{pkg.capacity}</span>
                  </div>
                </div>
              {/if}
              {#if pkg.duration}
                <div class="pkg-editorial__spec">
                  <Clock size={16} class="spec-icon" />
                  <div class="pkg-editorial__spec-info">
                    <span class="label">Duration</span>
                    <span class="value">{pkg.duration}</span>
                  </div>
                </div>
              {/if}
            </div>

            <p class="pkg-editorial__body">{pkg.body}</p>

            <ul class="pkg-editorial__includes" role="list">
              {#each pkg.includes as point}
                <li class="pkg-editorial__include">
                  <span class="pkg-editorial__dash" aria-hidden="true">—</span>
                  {point}
                </li>
              {/each}
            </ul>

            {#if pkg.priceTiers && pkg.priceTiers.length > 0}
              <div class="pkg-editorial__tiers">
                <button
                  class="pkg-editorial__tiers-toggle"
                  aria-expanded={tiersOpen}
                  onclick={(e) => {
                    e.stopPropagation();
                    onToggleTiers(pkg.id);
                  }}
                >
                  <span class="label">View pricing by group size</span>
                  <span
                    class="chevron"
                    class:chevron--open={tiersOpen}
                    aria-hidden="true"
                  >
                    <ChevronDown size={18} />
                  </span>
                </button>

                <div
                  class="pkg-editorial__tiers-panel"
                  class:pkg-editorial__tiers-panel--open={tiersOpen}
                >
                  <div class="pkg-editorial__tiers-inner">
                    <ul class="pkg-editorial__tiers-list">
                      {#each pkg.priceTiers as tier}
                        <li class="pkg-editorial__tier">
                          <span class="tier-label"
                            ><Users size={12} /> {tier.guests}</span
                          >
                          <span class="tier-price">{tier.amount}</span>
                        </li>
                      {/each}
                    </ul>
                  </div>
                </div>
              </div>
            {/if}

            <div class="pkg-editorial__footer">
              <span class="pkg-editorial__price-inline">{pkg.price}</span>
            </div>
          </div>
        </li>
      {/each}
    </ol>
  </div>
</section>

<style>
  .pkg-editorial {
    padding-block: var(--section-gap);
  }
  .pkg-editorial__header {
    border-bottom: none;
    margin-bottom: 0;
  }
  .pkg-editorial__heading {
    font-family: var(--ff-heading);
    font-weight: 400;
  }
  .italic-heading {
    font-family: var(--ff-heading);
    font-style: italic;
  }
  .pkg-editorial__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .pkg-editorial__item {
    display: grid;
    grid-template-columns: 1fr;
    border-top: 1px solid var(--clr-border);
    padding-block: calc(4 * var(--spacing));
    gap: calc(4 * var(--spacing));
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      padding-left var(--transition-fast);
    outline: none;
  }
  .pkg-editorial__item:last-child {
    border-bottom: 1px solid var(--clr-border);
  }
  .pkg-editorial__item:focus-visible {
    outline: 2px solid var(--clr-primary);
    outline-offset: 2px;
  }
  .pkg-editorial__item--selected {
    background-color: color-mix(in srgb, var(--clr-primary) 5%, transparent);
    padding-left: calc(0.5 * var(--spacing));
  }

  @media (min-width: 48em) {
    .pkg-editorial__item {
      grid-template-columns: 1fr 1fr;
      align-items: start;
    }
    .pkg-editorial__item:nth-child(even) :global(.pkg-editorial__media) {
      order: 2;
    }
    .pkg-editorial__item:nth-child(even) :global(.pkg-editorial__content) {
      order: 1;
    }
    .pkg-editorial__item--selected {
      padding-left: calc(1 * var(--spacing));
    }
  }

  .pkg-editorial__media {
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
  }
  .pkg-editorial__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
    display: block;
    object-position: center bottom;
  }
  .pkg-editorial__item:hover .pkg-editorial__image {
    transform: scale(1.02);
  }
  .pkg-editorial__price {
    position: absolute;
    bottom: 1.5rem;
    left: 1.5rem;
  }

  .pkg-editorial__content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .pkg-editorial__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .pkg-editorial__meta-right {
    display: flex;
    align-items: center;
    gap: 3rem;
  }
  .pkg-editorial__number {
    font-family: var(--ff-heading);
    font-style: italic;
    font-size: 2.5rem;
    opacity: 0.15;
  }

  .pkg-editorial__title {
    font-family: var(--ff-heading);
    font-style: italic;
    font-size: clamp(2rem, 5vw, 3rem);
    line-height: 1;
  }
  .pkg-editorial__subtitle {
    color: var(--txt-muted);
  }

  .pkg-select-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--txt-light);
    transition: color var(--transition-fast);
  }
  .pkg-editorial__item--selected .pkg-select-indicator {
    color: var(--clr-primary);
  }
  .pkg-select-indicator__circle {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1.5px solid var(--clr-border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: transparent;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      color var(--transition-fast);
  }
  .pkg-select-indicator__circle--checked {
    background-color: var(--clr-primary);
    border-color: var(--clr-primary);
    color: #fff;
  }
  .pkg-select-indicator__label {
    font-size: var(--fs-label);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .pkg-editorial__specs {
    display: flex;
    gap: 3rem;
  }
  .pkg-editorial__spec {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .pkg-editorial__spec :global(svg) {
    color: var(--clr-primary);
    flex-shrink: 0;
  }
  .pkg-editorial__spec-info {
    display: flex;
    flex-direction: column;
  }
  .pkg-editorial__spec-info .label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--txt-light);
  }
  .pkg-editorial__spec-info .value {
    font-size: 0.9rem;
    font-weight: 500;
  }

  .pkg-editorial__body {
    color: var(--txt-muted);
    line-height: 1.7;
    max-width: 50ch;
  }
  .pkg-editorial__includes {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 0.5rem;
  }
  .pkg-editorial__include {
    display: flex;
    gap: 0.75rem;
    font-size: 0.85rem;
    color: var(--txt-muted);
  }
  .pkg-editorial__dash {
    color: var(--clr-primary);
  }

  .pkg-editorial__tiers {
    border-block: 1px solid var(--clr-border);
  }
  .pkg-editorial__tiers-toggle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-block: 1rem;
    background: none;
    border: none;
    cursor: pointer;
  }
  .chevron {
    display: flex;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .chevron--open {
    transform: rotate(180deg);
  }
  .pkg-editorial__tiers-panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .pkg-editorial__tiers-panel--open {
    grid-template-rows: 1fr;
  }
  .pkg-editorial__tiers-inner {
    overflow: hidden;
  }
  .pkg-editorial__tiers-list {
    list-style: none;
    padding: 0 0 1.5rem 0;
    margin: 0;
    display: grid;
    gap: 0.75rem;
  }
  .pkg-editorial__tier {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--bg-surface);
  }
  .tier-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    color: var(--txt-light);
  }
  .tier-label :global(svg) {
    flex-shrink: 0;
  }
  .tier-price {
    font-family: var(--ff-heading);
    font-style: italic;
    font-size: 1.25rem;
  }
  .pkg-editorial__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .pkg-editorial__price-inline {
    font-family: var(--ff-heading);
    font-style: italic;
    font-size: 1.5rem;
  }
</style>
