<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import Kpi from '$lib/components/Kpi.svelte';
	import PlotFrame from '$lib/components/PlotFrame.svelte';
	import RepoTable from '$lib/components/RepoTable.svelte';
	import SyncButton from '$lib/components/SyncButton.svelte';
	import { areaClones, toDatePoints } from '$lib/charts/plot';

	let { data } = $props();

	const chartBuild = $derived.by(() => {
		const series = data.chart?.series;
		return (width: number) => {
			if (!series?.length) return null;
			return areaClones(toDatePoints(series), width, 280);
		};
	});
</script>

{#if data.error}
	<section class="atlas-alert">
		<p class="font-medium">Could not reach gghstats API</p>
		<p class="mt-1 text-xs opacity-90">{data.error}</p>
		<p class="mt-2 text-xs text-ink-muted">
			Set <code>GGHSTATS_API_BASE</code> and <code>GGHSTATS_API_TOKEN</code> in
			<code>.env</code> (see <code>.env.example</code>).
		</p>
	</section>
{:else if data.repos}
	<section class="anim-fade-up">
		<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<p class="atlas-eyebrow">Overview</p>
				<h2 class="atlas-title mt-1">Repositories</h2>
				<p class="atlas-lede">Org totals and the live clone weather map for the current filter.</p>
			</div>
			<form method="GET" class="flex gap-2">
				{#if data.sort}
					<input type="hidden" name="sort" value={data.sort} />
				{/if}
				{#if data.dir}
					<input type="hidden" name="dir" value={data.dir} />
				{/if}
				<input
					class="atlas-field w-56"
					type="search"
					name="q"
					value={data.q}
					placeholder="Filter owner/repo"
				/>
				<button class="atlas-btn" type="submit">Filter</button>
			</form>
		</div>

		<div class="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-4" use:reveal>
			<Kpi label="Repos" value={data.repos.total_count} tone="teal" />
			<Kpi label="Clone events" value={data.repos.total_clones} hint="Org totals from API" />
			<Kpi label="View events" value={data.repos.total_views} hint="Org totals from API" />
			<Kpi label="Stars" value={data.repos.total_stars} />
		</div>

		<div class="mb-3 flex flex-wrap items-end justify-between gap-3">
			<div>
				<h3 class="font-display text-xl font-semibold text-ink">Clones over time</h3>
				<p class="mt-1 max-w-2xl text-sm text-ink-muted">
					Daily clone traffic across the current list and search filter. Solid = count, dashed =
					uniques. Window up to ~120 days.
				</p>
			</div>
			<SyncButton />
		</div>

		<div class="atlas-panel mb-12">
			{#if data.chart?.series?.length}
				<PlotFrame build={chartBuild} height={280} reveal={true} />
				<div class="mt-3 flex gap-4 font-mono text-[11px] tracking-wide text-ink-faint">
					<span><span class="mr-1.5 inline-block h-2 w-2 rounded-full bg-teal"></span>count</span>
					<span
						><span class="mr-1.5 inline-block h-0.5 w-3 bg-coral align-middle"></span>uniques</span
					>
				</div>
			{:else}
				<p class="atlas-empty">No clone series yet.</p>
			{/if}
		</div>

		<div use:reveal>
			<p class="atlas-eyebrow mb-4">Ledger</p>
			<RepoTable
				items={data.repos.items}
				totalClones={data.repos.total_clones}
				sort={data.sort}
				dir={data.dir}
				q={data.q}
			/>
		</div>
	</section>
{/if}
