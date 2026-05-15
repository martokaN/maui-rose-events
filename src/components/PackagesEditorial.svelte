<script lang="ts">
  import PackageList from "./services/PackageList.svelte";
  import AddonList from "./services/AddonList.svelte";
  import BookingSummary from "./services/BookingSummary.svelte";

  // ─── Types ─────────────────────────────────────────────────────────
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

  // ─── Props ─────────────────────────────────────────────────────────
  let {
    packages = [],
    globalAddons = [],
  }: {
    packages: Package[];
    globalAddons: Addon[];
  } = $props();

  // ─── State ─────────────────────────────────────────────────────────
  let selectedPkgId: string | null = $state(null);
  let checkedAddonIds: Set<string> = $state(new Set());
  let openTiersId: string | null = $state(null);

  // ─── Derived ───────────────────────────────────────────────────────
  const selectedPkg = $derived(
    packages.find((p) => p.id === selectedPkgId) ?? null,
  );

  const visibleAddons = $derived((): Addon[] => {
    if (!selectedPkgId) return [];
    const pkgSpecific = selectedPkg?.addons ?? [];
    const merged = [
      ...globalAddons,
      ...pkgSpecific.filter((a) => !globalAddons.find((g) => g.id === a.id)),
    ];
    return merged.filter((a) => !a.pkgs || a.pkgs.includes(selectedPkgId!));
  });

  const checkedAddons = $derived(
    visibleAddons().filter((a) => checkedAddonIds.has(a.id)),
  );
  const addonTotal = $derived(
    checkedAddons.reduce((sum, a) => sum + a.amount, 0),
  );
  const runningTotal = $derived(
    selectedPkg ? selectedPkg.basePrice + addonTotal : 0,
  );

  const inquiryUrl = $derived.by(() => {
    if (!selectedPkg) return "/contact";

    // Start with just the package ID
    const params = new URLSearchParams({
      package: selectedPkg.id,
    });

    // Add addons if they exist
    if (checkedAddonIds.size > 0) {
      params.set("addons", [...checkedAddonIds].join(","));
    }

    return `/contact?${params.toString()}`;
  });

  // ─── Handlers ──────────────────────────────────────────────────────
  function selectPackage(id: string) {
    if (selectedPkgId === id) {
      selectedPkgId = null;
      checkedAddonIds = new Set();
      return;
    }
    selectedPkgId = id;
    checkedAddonIds = new Set(
      [...checkedAddonIds].filter((addonId) =>
        visibleAddons().some((a) => a.id === addonId),
      ),
    );
  }

  function toggleAddon(id: string) {
    const next = new Set(checkedAddonIds);
    next.has(id) ? next.delete(id) : next.add(id);
    checkedAddonIds = next;
  }

  function toggleTiers(id: string) {
    openTiersId = openTiersId === id ? null : id;
  }

  function clearAll() {
    selectedPkgId = null;
    checkedAddonIds = new Set();
  }
</script>

<PackageList
  {packages}
  {selectedPkgId}
  {openTiersId}
  onSelect={selectPackage}
  onToggleTiers={toggleTiers}
/>

<AddonList
  {selectedPkgId}
  addons={visibleAddons()}
  {checkedAddonIds}
  onToggle={toggleAddon}
/>

{#if selectedPkg}
  <BookingSummary
    {selectedPkg}
    {checkedAddons}
    {runningTotal}
    {inquiryUrl}
    onClear={clearAll}
  />
{/if}
