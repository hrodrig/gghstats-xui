<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import PlotFrame from '$lib/components/PlotFrame.svelte';
	import { h2hLines } from '$lib/charts/plot';
	import { fmtNumber } from '$lib/format';

	let { data } = $props();

	const clonesBuild = $derived.by(() => {
		const c = data.h2h?.charts;
		return (width: number) => {
			if (!c?.cloneLabels?.length) return null;
			return h2hLines(c.cloneLabels, c.clonesA, c.clonesB, c.repoA, c.repoB, width, 260);
		};
	});

	const viewsBuild = $derived.by(() => {
		const c = data.h2h?.charts;
		return (width: number) => {
			if (!c?.viewLabels?.length) return null;
			return h2hLines(c.viewLabels, c.viewsA, c.viewsB, c.repoA, c.repoB, width, 260);
		};
	});
</script>

<section class="anim-fade-up">
	<div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
		<div>
			<p class="atlas-eyebrow">Compare</p>
			<h2 class="atlas-title mt-1">Head to Head</h2>
			<p class="atlas-lede">
				Weighted share scores (0–100, sum to 100) — same formula as gghstats H2H.
			</p>
		</div>
		<form method="GET" class="flex flex-wrap gap-2">
			<input class="atlas-field w-44" name="a" value={data.a} placeholder="owner/repo A" />
			<input class="atlas-field w-44" name="b" value={data.b} placeholder="owner/repo B" />
			<select class="atlas-field" name="w">
				{#each ['7d', '30d', 'total'] as w (w)}
					<option value={w} selected={data.w === w}>{w}</option>
				{/each}
			</select>
			<button class="atlas-btn-solid" type="submit">Compare</button>
		</form>
	</div>

	{#if data.error}
		<div class="atlas-alert">{data.error}</div>
	{:else if data.h2h}
		{@const r = data.h2h.result}
		<div class="mb-10" use:reveal>
			<div class="mb-3 flex items-end justify-between gap-4">
				<div>
					<p class="font-mono text-xs tracking-wide text-teal uppercase">{r.repo_a}</p>
					<p class="font-display text-5xl font-semibold tracking-tight text-ink">{r.score_a}</p>
				</div>
				<div class="pb-2 text-center font-mono text-xs tracking-wide text-ink-faint uppercase">
					Δ {r.delta_pct}% · {r.interval}
				</div>
				<div class="text-right">
					<p class="font-mono text-xs tracking-wide text-coral uppercase">{r.repo_b}</p>
					<p class="font-display text-5xl font-semibold tracking-tight text-ink">{r.score_b}</p>
				</div>
			</div>
			<div class="flex h-3 overflow-hidden rounded-[var(--atlas-radius-sm)] bg-line">
				<div class="bg-teal transition-all duration-700" style="width: {r.score_a}%"></div>
				<div class="bg-coral transition-all duration-700" style="width: {r.score_b}%"></div>
			</div>
		</div>

		<div class="mb-10 overflow-x-auto" use:reveal>
			<table class="w-full min-w-[520px] border-collapse text-sm">
				<thead>
					<tr class="border-b border-line-strong text-left">
						<th class="py-2 font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase"
							>Metric</th
						>
						<th
							class="py-2 text-right font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase"
							>Weight</th
						>
						<th
							class="py-2 text-right font-mono text-[11px] tracking-[0.14em] text-teal uppercase"
							>A</th
						>
						<th
							class="py-2 text-right font-mono text-[11px] tracking-[0.14em] text-coral uppercase"
							>B</th
						>
					</tr>
				</thead>
				<tbody class="anim-stagger">
					{#each r.rows as row (row.key)}
						<tr class="border-b border-line/80">
							<td class="py-3">{row.label}</td>
							<td class="py-3 text-right font-mono text-xs text-ink-muted">{row.weight_pct}%</td>
							<td
								class="py-3 text-right font-mono text-xs"
								class:font-semibold={row.leads_a && row.value_a !== row.value_b}
								class:text-teal={row.leads_a && row.value_a !== row.value_b}
								>{fmtNumber(row.value_a)}</td
							>
							<td
								class="py-3 text-right font-mono text-xs"
								class:font-semibold={!row.leads_a && row.value_a !== row.value_b}
								class:text-coral={!row.leads_a && row.value_a !== row.value_b}
								>{fmtNumber(row.value_b)}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if r.suggest?.show}
			<p class="mb-8 max-w-2xl border-l-2 border-teal pl-4 text-sm text-ink-muted">
				<span class="font-mono text-[11px] tracking-wide text-teal uppercase"
					>{r.suggest.confidence} confidence</span
				>
				<br />
				{r.suggest.rationale}
			</p>
		{/if}

		<div class="grid gap-10 lg:grid-cols-2">
			<div class="atlas-panel">
				<h3 class="mb-2 font-display text-lg font-semibold">Clones</h3>
				<PlotFrame build={clonesBuild} height={260} />
			</div>
			<div class="atlas-panel">
				<h3 class="mb-2 font-display text-lg font-semibold">Views</h3>
				<PlotFrame build={viewsBuild} height={260} />
			</div>
		</div>
	{/if}
</section>
