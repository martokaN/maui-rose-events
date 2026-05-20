<script lang="ts">
  import type { Package, Addon } from "@/lib/types/booking";

  export let selectedPkg: Package | null = null;
  export let checkedAddons: Addon[] = [];
  export let runningTotal: number = 0;
  export let inquiryUrl: string = "";
  export let clearAll: () => void = () => {};
</script>

<!-- ─── Sticky booking bar ──────────────────────────────────────────────────── -->

<div class="booking-bar" role="region" aria-label="Booking summary">
  <div class="booking-bar__inner container--narrow">
    <div class="booking-bar__summary">
      <p class="booking-bar__package">{selectedPkg?.title ?? ""}</p>
      <p class="booking-bar__addons">
        {#if checkedAddons.length > 0}
          {checkedAddons.map((a) => a.name).join(" · ")}
        {:else}
          No add-ons selected
        {/if}
      </p>
    </div>

    <div class="booking-bar__right">
      <span class="booking-bar__total">
        From ${runningTotal.toLocaleString()}
      </span>
      <button class="booking-bar__clear" type="button" on:click={clearAll}>
        Clear
      </button>
      <a class="btn btn-primary" href={inquiryUrl}> Send Inquiry </a>
    </div>
  </div>
</div>

<style>
  /* ── Sticky booking bar ───────────────────────────────────────────────────── */

  .booking-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200;
    background-color: var(--bg-main);
    border-top: 1px solid var(--clr-border);
    box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.06);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    /* animation removed, transition handled by parent */
  }

  .booking-bar__inner {
    display: flex;
    align-items: center;
    gap: calc(2 * var(--spacing));
    padding-block: calc(1.25 * var(--spacing));
    flex-wrap: wrap;
  }

  @media (min-width: 48em) {
    .booking-bar__inner {
      flex-wrap: nowrap;
    }
  }

  .booking-bar__summary {
    flex: 1;
    min-width: 0;
  }

  .booking-bar__package {
    font-family: var(--ff-heading);
    font-style: italic;
    font-size: var(--fs-h3);
    color: var(--txt-main);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .booking-bar__addons {
    font-size: var(--fs-small);
    color: var(--txt-light);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 0.15rem;
  }

  .booking-bar__right {
    display: flex;
    align-items: center;
    gap: calc(1.5 * var(--spacing));
    flex-shrink: 0;
  }

  .booking-bar__total {
    font-family: var(--ff-heading);
    font-style: italic;
    font-size: var(--fs-h3);
    color: var(--clr-primary);
    white-space: nowrap;
  }

  .booking-bar__clear {
    background: none;
    border: none;
    cursor: pointer;
    font-size: var(--fs-label);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--txt-light);
    transition: color var(--transition-fast);
    padding: 0;
  }

  .booking-bar__clear:hover {
    color: var(--txt-main);
  }
</style>