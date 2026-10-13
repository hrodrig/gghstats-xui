<script lang="ts">
	import Kpi from '$lib/components/Kpi.svelte';
	import Momentum from '$lib/components/Momentum.svelte';
	import PlotFrame from '$lib/components/PlotFrame.svelte';
	import SyncButton from '$lib/components/SyncButton.svelte';
	import { dualTraffic, popularBars, starsLine, toDatePoints } from '$lib/charts/plot';
	import { fmtNumber } from '$lib/format';

	let { data } = $props();

	const full = $derived(`${data.owner}/${data.repo}`);

	const trafficBuild = $derived((width: number) => {
		if (!data.traffic) return null;
		return dualTraffic(
			toDatePoints(data.traffic.clones),
			toDatePoints(data.traffic.views),
			width,
			300
		);
	});

	const starsBuild = $derived((width: number) => {
		if (!data.stars?.stars?.length) return null;
		const pts = data.stars.stars.map((s) => ({
			date: new Date(`${s.date}T00:00:00Z`),
			total: s.total
		}));
		return starsLine(pts, width, 220);
	});

	const referrersBuild = $derived((width: number) => {
		if (!data.popular?.referrers?.length) return null;
		return popularBars(data.popular.referrers, width, 220);
	});

	const pathsBuild = $derived((width: number) => {
		if (!data.popular?.paths?.length) return null;
		return popularBars(data.popular.paths, width, 220);
	});
</script>

{#if data.error}
	<section class="rounded-sm border border-coral/30 bg-coral-soft/60 px-4 py-3 font-mono text-sm text-coral">
		{data.error}
	</section>
{:else if data.summary}
	<section class="anim-fade-up">
		<div class="mb-2">
			<a class="font-mono text-xs text-ink-faint no-underline hover:text-teal" href="/">← Repos</a>
		</div>
		<div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
			<div>
				<p class="font-mono text-[11px] tracking-[0.18em] text-teal uppercase">{data.owner}</p>
				<h2 class="font-display text-4xl font-semibold tracking-tight text-ink">{data.repo}</h2>
				{#if data.summary.repo.description}
					<p class="mt-2 max-w-2xl text-sm text-ink-muted">{data.summary.repo.description}</p>
				{/if}
				<div class="mt-4 flex flex-wrap gap-5">
					<Momentum label="Momentum 7d" pct={data.summary.momentum_7d_pct} />
					<Momentum label="Momentum 30d" pct={data.summary.momentum_30d_pct} />
				</div>
			</div>
			<div class="flex flex-col items-start gap-3 sm:items-end">
				<form method="GET" class="flex gap-2">
					<select
						class="rounded-sm border border-line bg-white/70 px-2 py-2 font-mono text-xs"
						name="days"
						onchange={(e) => e.currentTarget.form?.requestSubmit()}
					>
						{#each [30, 90, 180, 365, 0] as d (d)}
							<option value={d} selected={data.days === d}>
								{d === 0 ? 'All days' : `${d}d`}
							</option>
						{/each}
					</select>
				</form>
				<SyncButton repo={full} />
			</div>
		</div>

		<div class="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
			<Kpi label="Stars" value={data.summary.repo.stars} />
			<Kpi
				label="Clones"
				value={data.summary.repo.total_clones}
				hint="{fmtNumber(data.summary.repo.clone_uniques)} unique"
				tone="teal"
			/>
			<Kpi
				label="Views"
				value={data.summary.repo.total_views}
				hint="{fmtNumber(data.summary.repo.total_uniques)} unique"
				tone="coral"
			/>
			<Kpi label="30d clones" value={data.summary.repo.clones_30d} />
		</div>

		<div class="mb-12 -mx-4 border-y border-line bg-white/35 px-4 py-4 sm:mx-0 sm:rounded-sm sm:border sm:px-5">
			<h3 class="mb-1 font-display text-xl font-semibold">Traffic</h3>
			<p class="mb-3 text-sm text-ink-muted">
				Dense daily series ({data.traffic?.from} → {data.traffic?.to}). Gaps stay null — not zero-filled.
			</p>
			{#if data.traffic}
				<PlotFrame build={trafficBuild} height={300} />
			{/if}
		</div>

		<div class="mb-12 -mx-4 border-y border-line bg-white/35 px-4 py-4 sm:mx-0 sm:rounded-sm sm:border sm:px-5">
			<h3 class="mb-1 font-display text-xl font-semibold">Star history</h3>
			{#if data.stars?.stars?.length}
				<PlotFrame build={starsBuild} height={220} />
			{:else}
				<p class="py-10 text-center font-mono text-sm text-ink-faint">No star history yet.</p>
			{/if}
		</div>

		<div class="grid gap-10 lg:grid-cols-2">
			<div>
				<h3 class="mb-1 font-display text-xl font-semibold">Referrers</h3>
				<p class="mb-3 text-sm text-ink-muted">Last 14 UTC days</p>
				{#if data.popular?.referrers?.length}
					<PlotFrame build={referrersBuild} height={220} />
				{:else}
					<p class="font-mono text-sm text-ink-faint">No referrers.</p>
				{/if}
			</div>
			<div>
				<h3 class="mb-1 font-display text-xl font-semibold">Popular paths</h3>
				<p class="mb-3 text-sm text-ink-muted">Last 14 UTC days</p>
				{#if data.popular?.paths?.length}
					<PlotFrame build={pathsBuild} height={220} />
				{:else}
					<p class="font-mono text-sm text-ink-faint">No paths.</p>
				{/if}
			</div>
		</div>
	</section>
{/if}
