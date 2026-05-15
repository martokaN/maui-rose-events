<script lang="ts">
  import { Check } from "lucide-svelte";

  interface Addon {
    id: string;
    name: string;
    note?: string;
    price: string;
    amount: number;
    pkgs?: string[];
  }

  let {
    selectedPkgId,
    addons,
    checkedAddonIds,
    onToggle,
  }: {
    selectedPkgId: string | null;
    addons: Addon[];
    checkedAddonIds: Set<string>;
    onToggle: (id: string) => void;
  } = $props();
</script>

<section class="addons">
  <div class="container--narrow">
    <div class="section-header">
      <h2 class="fs-h2">Optional Add-ons</h2>
      <span
        class="label"
        style="font-family: var(--ff-heading); font-style: italic;"
        >Elevate Your Stay</span
      >
    </div>

    {#if !selectedPkgId}
      <p class="addons__hint">
        Select a package above to see available add-ons
      </p>
    {:else}
      <ul class="addons__grid" role="list">
        {#each addons as addon}
          {@const checked = checkedAddonIds.has(addon.id)}
          <li class="addons__item-wrapper">
            <button
              type="button"
              class="addons__item"
              class:addons__item--selected={checked}
              onclick={() => onToggle(addon.id)}
              role="checkbox"
              aria-checked={checked}
            >
              <span
                class="addons__check"
                class:addons__check--checked={checked}
                aria-hidden="true"
              >
                {#if checked}<Check size={10} strokeWidth={2.5} />{/if}
              </span>
              <div class="addons__info">
                <span class="addons__name">{addon.name}</span>
                {#if addon.note}<span class="addons__note">— {addon.note}</span
                  >{/if}
              </div>
              <span class="addons__price">{addon.price}</span>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>

<style>
  .addons {
    padding-bottom: var(--section-gap);
    background-color: var(--bg-main);
  }
  .addons .section-header {
    margin-bottom: calc(2 * var(--spacing));
  }
  .addons__hint {
    font-family: var(--ff-heading);
    font-style: italic;
    color: var(--txt-light);
    font-size: var(--fs-small);
    margin-bottom: calc(2 * var(--spacing));
  }

  .addons__grid {
    display: grid;
    grid-template-columns: 1fr;
  }
  @media (min-width: 48em) {
    .addons__grid {
      grid-template-columns: 1fr 1fr;
      column-gap: calc(4 * var(--spacing));
    }
  }

  .addons__item {
    display: flex;
    align-items: flex-start;
    padding-block: 1.25rem;
    border-bottom: 1px solid var(--clr-border);
    cursor: pointer;
    outline: none;
    transition: padding-left var(--transition-fast);
    width: 100%;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    text-align: left;
  }
  .addons__item:hover {
    padding-left: 0.5rem;
  }
  .addons__item:focus-visible {
    outline: 2px solid var(--clr-primary);
    outline-offset: 2px;
  }

  .addons__check {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 2px;
    margin-right: 0.75rem;
    border: 1.5px solid var(--clr-border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: transparent;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      color var(--transition-fast);
  }
  .addons__check--checked {
    background-color: var(--clr-primary);
    border-color: var(--clr-primary);
    color: #fff;
  }

  .addons__info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
  }
  .addons__name {
    font-family: var(--ff-heading);
    font-size: var(--fs-body);
    color: var(--txt-main);
  }
  .addons__note {
    font-family: var(--ff-body);
    font-size: var(--fs-label);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--txt-light);
  }
  .addons__price {
    font-family: var(--ff-heading);
    font-size: var(--fs-small);
    color: var(--txt-muted);
    white-space: nowrap;
    margin-left: 1rem;
  }
</style>
