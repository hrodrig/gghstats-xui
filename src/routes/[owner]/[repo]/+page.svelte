<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import Kpi from '$lib/components/Kpi.svelte';
	import Momentum from '$lib/components/Momentum.svelte';
	import PlotFrame from '$lib/components/PlotFrame.svelte';
	import SyncButton from '$lib/components/SyncButton.svelte';
	import { dualTraffic, popularBars, starsLine, toDatePoints } from '$lib/charts/plot';
	import { fmtNumber } from '$lib/format';

	let { data } = $props();

	const full = $derived(`${data.owner}/${data.repo}`);

	const trafficBuild = $derived.by(() => {
		const traffic = data.traffic;
		return (width: number) => {
			if (!traffic) return null;
			return dualTraffic(
				toDatePoints(traffic.clones),
				toDatePoints(traffic.views),
				width,
				300
			);
		};
	});

	const starsBuild = $derived.by(() => {
		const stars = data.stars?.stars;
		return (width: number) => {
			if (!stars?.length) return null;
			const pts = stars.map((s) => ({
				date: new Date(`${s.date}T00:00:00Z`),
				total: s.total
			}));
			return starsLine(pts, width, 220);
		};
	});

	const referrersBuild = $derived.by(() => {
		const referrers = data.popular?.referrers;
		return (width: number) => {
			if (!referrers?.length) return null;
			return popularBars(referrers, width, 220);
		};
	});

	const pathsBuild = $derived.by(() => {
		const paths = data.popular?.paths;
		return (width: number) => {
			if (!paths?.length) return null;
			return popularBars(paths, width, 220);
		};
	});
</script>

{#if data.error}
	<section class="atlas-alert">{data.error}</section>
{:else if data.summary}
	<section class="anim-fade-up">
		<div class="mb-3">
			<a class="font-mono text-xs tracking-wide text-ink-faint no-underline hover:text-teal" href="/"
				>← Repos</a
			>
		</div>
		<div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
			<div>
				<p class="font-mono text-[11px] tracking-[0.18em] text-teal uppercase">{data.owner}</p>
				<h2 class="font-display mt-1 text-4xl font-semibold tracking-tight text-ink">{data.repo}</h2>
				{#if data.summary.repo.description}
					<p class="atlas-lede">{data.summary.repo.description}</p>
				{/if}
				<div class="mt-4 flex flex-wrap gap-5">
					<Momentum label="Momentum 7d" pct={data.summary.momentum_7d_pct} />
					<Momentum label="Momentum 30d" pct={data.summary.momentum_30d_pct} />
				</div>
			</div>
			<div class="flex flex-col items-start gap-3 sm:items-end">
				<form method="GET" class="flex gap-2">
					<select
						class="atlas-field"
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

		<div class="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-4" use:reveal>
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

		<div class="atlas-panel mb-12" use:reveal>
			<h3 class="mb-1 font-display text-xl font-semibold">Traffic</h3>
			<p class="mb-3 font-mono text-[11px] tracking-wide text-ink-faint uppercase">
				{data.traffic?.from} → {data.traffic?.to} · dense · gaps stay null
			</p>
			{#if data.traffic}
				<PlotFrame build={trafficBuild} height={300} />
			{/if}
		</div>

		<div class="atlas-panel mb-12" use:reveal>
			<h3 class="mb-1 font-display text-xl font-semibold">Star history</h3>
			{#if data.stars?.stars?.length}
				<PlotFrame build={starsBuild} height={220} reveal={false} />
			{:else}
				<p class="atlas-empty">No star history yet.</p>
			{/if}
		</div>

		<div class="grid gap-10 lg:grid-cols-2" use:reveal>
			<div>
				<h3 class="mb-1 font-display text-xl font-semibold">Referrers</h3>
				<p class="mb-3 font-mono text-[11px] tracking-wide text-ink-faint uppercase">
					Last 14 UTC days
				</p>
				{#if data.popular?.referrers?.length}
					<PlotFrame build={referrersBuild} height={220} reveal={false} />
				{:else}
					<p class="font-mono text-sm text-ink-faint">No referrers.</p>
				{/if}
			</div>
			<div>
				<h3 class="mb-1 font-display text-xl font-semibold">Popular paths</h3>
				<p class="mb-3 font-mono text-[11px] tracking-wide text-ink-faint uppercase">
					Last 14 UTC days
				</p>
				{#if data.popular?.paths?.length}
					<PlotFrame build={pathsBuild} height={220} reveal={false} />
				{:else}
					<p class="font-mono text-sm text-ink-faint">No paths.</p>
				{/if}
			</div>
		</div>
	</section>
{/if}
