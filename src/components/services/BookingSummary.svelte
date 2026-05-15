<script lang="ts">
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
    imageSrc: string;
    imageAlt: string;
  }

  let {
    selectedPkg,
    checkedAddons,
    runningTotal,
    inquiryUrl,
    onClear,
  }: {
    selectedPkg: Package;
    checkedAddons: Addon[];
    runningTotal: number;
    inquiryUrl: string;
    onClear: () => void;
  } = $props();
</script>

<div class="booking-bar" role="region" aria-label="Booking summary">
  <div class="booking-bar__inner container--narrow">
    <div class="booking-bar__summary">
      <p class="booking-bar__package">{selectedPkg.title}</p>
      <p class="booking-bar__addons">
        {#if checkedAddons.length > 0}
          {checkedAddons.map((a) => a.name).join(" · ")}
        {:else}
          No add-ons selected
        {/if}
      </p>
    </div>

    <div class="booking-bar__right">
      <span class="booking-bar__total"
        >From ${runningTotal.toLocaleString()}</span
      >
      <button class="booking-bar__clear" type="button" onclick={onClear}
        >Clear</button
      >
      <a class="btn btn-primary" href={inquiryUrl}>Send Inquiry</a>
    </div>
  </div>
</div>

<style>
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
    animation: slide-up 0.35s cubic-bezier(0.4, 0, 0.2, 1) both;
  }
  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
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
    margin: 0;
  }
  .booking-bar__addons {
    font-size: var(--fs-small);
    color: var(--txt-light);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 0.15rem;
    margin-bottom: 0;
  }

  @media (max-width: 48em) {
    .booking-bar__package,
    .booking-bar__addons {
      display: none;
    }
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
