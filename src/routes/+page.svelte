<script lang="ts">
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
	<section class="rounded-sm border border-coral/30 bg-coral-soft/60 px-4 py-3 font-mono text-sm text-coral">
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
				<p class="font-mono text-[11px] tracking-[0.18em] text-ink-faint uppercase">Overview</p>
				<h2 class="font-display text-3xl font-semibold tracking-tight text-ink">Repositories</h2>
			</div>
			<form method="GET" class="flex gap-2">
				{#if data.sort}
					<input type="hidden" name="sort" value={data.sort} />
				{/if}
				{#if data.dir}
					<input type="hidden" name="dir" value={data.dir} />
				{/if}
				<input
					class="w-56 rounded-sm border border-line bg-white/70 px-3 py-2 font-mono text-xs text-ink outline-none focus:border-teal"
					type="search"
					name="q"
					value={data.q}
					placeholder="Filter owner/repo"
				/>
				<button
					class="rounded-sm border border-line bg-white/80 px-3 py-2 font-mono text-xs tracking-wide uppercase hover:border-teal"
					type="submit">Filter</button
				>
			</form>
		</div>

		<div class="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
			<Kpi label="Repos" value={data.repos.total_count} tone="teal" />
			<Kpi
				label="Clone events"
				value={data.repos.total_clones}
				hint="Org totals from API (not unique cloners)"
			/>
			<Kpi
				label="View events"
				value={data.repos.total_views}
				hint="Org totals from API (not unique viewers)"
			/>
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

		<div class="mb-12 -mx-4 border-y border-line bg-white/35 px-4 py-4 sm:mx-0 sm:rounded-sm sm:border sm:px-5">
			{#if data.chart?.series?.length}
				<PlotFrame build={chartBuild} height={280} />
				<div class="mt-2 flex gap-4 font-mono text-[11px] text-ink-faint">
					<span><span class="mr-1 inline-block h-2 w-2 rounded-full bg-teal"></span>count</span>
					<span><span class="mr-1 inline-block h-0.5 w-3 bg-coral align-middle"></span>uniques</span>
				</div>
			{:else}
				<p class="py-16 text-center font-mono text-sm text-ink-faint">No clone series yet.</p>
			{/if}
		</div>

		<RepoTable
			items={data.repos.items}
			totalClones={data.repos.total_clones}
			sort={data.sort}
			dir={data.dir}
			q={data.q}
		/>
	</section>
{/if}
