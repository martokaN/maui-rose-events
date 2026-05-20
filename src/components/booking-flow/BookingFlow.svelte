<script lang="ts">
  import { Users, Clock, ChevronDown, Check } from "lucide-svelte";
  import { fly } from "svelte/transition";

  import PackageGrid from "./PackageGrid.svelte";
  import AddonSelector from "./AddonSelector.svelte";
  import BookingBar from "./BookingBar.svelte";

  import type { Package, Addon } from "@/lib/types/booking";

  // ─── Props ──────────────────────────────────────────────────────────────────

  export let packages: Package[] = [];
  export let addons: Addon[] = []; // global addons with pkgs mapping

  // ─── State ──────────────────────────────────────────────────────────────────

  let selectedPkgId: string | null = $state(null);
  let checkedAddonIds: Set<string> = $state(new Set());
  let openTiersId: string | null = $state(null);

  // ─── Derived ────────────────────────────────────────────────────────────────

  const selectedPkg = $derived(
    packages.find((p) => p.id === selectedPkgId) ?? null,
  );

  /**
   * Merge global add-ons with any package-specific ones,
   * then filter to those available for the selected package.
   */
  const visibleAddons = $derived((): Addon[] => {
    if (!selectedPkgId) return [];

    const pkgSpecific = selectedPkg?.addons ?? [];
    const merged = [
      ...addons,
      ...pkgSpecific.filter((a) => !addons.find((g) => g.id === a.id)),
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
    const params = new URLSearchParams({
      package: selectedPkg.id,
      total: String(runningTotal),
    });
    if (checkedAddonIds.size > 0) {
      params.set("addons", [...checkedAddonIds].join(","));
    }
    return `/contact?${params.toString()}`;
  });

  // ─── Handlers ───────────────────────────────────────────────────────────────

  function selectPackage(id: string) {
    if (selectedPkgId === id) {
      // Toggle off
      selectedPkgId = null;
      checkedAddonIds = new Set();
      return;
    }
    selectedPkgId = id;
    // Clear addons that aren't valid for the new package
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

<!-- ─── Packages ────────────────────────────────────────────────────────────── -->

<PackageGrid
  {packages}
  {selectedPkgId}
  onSelect={selectPackage}
  {openTiersId}
  onToggleTiers={toggleTiers}
/>

<!-- ─── Add-ons ─────────────────────────────────────────────────────────────── -->

<AddonSelector
  {addons}
  {selectedPkgId}
  {checkedAddonIds}
  onToggle={toggleAddon}
/>

<!-- ─── Sticky booking bar ──────────────────────────────────────────────────── -->

{#if selectedPkg}
  <div transition:fly={{ y: 50, duration: 350 }}>
    <BookingBar
      {selectedPkg}
      {checkedAddons}
      {runningTotal}
      {inquiryUrl}
      {clearAll}
    />
  </div>
{/if}