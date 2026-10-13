<script lang="ts">
	import type { RepoListItem, SortDir, SortKey } from '$lib/api/types';
	import { fmtCompact, fmtNumber, shareOf, splitRepo } from '$lib/format';

	let {
		items,
		totalClones,
		sort,
		dir,
		q
	}: {
		items: RepoListItem[];
		totalClones: number;
		sort: string;
		dir: string;
		q: string;
	} = $props();

	const columns: { key: SortKey; label: string; align?: 'right' }[] = [
		{ key: 'name', label: 'Repository' },
		{ key: 'stars', label: 'Stars', align: 'right' },
		{ key: 'total_views', label: 'Views', align: 'right' },
		{ key: 'total_clones', label: 'Clones', align: 'right' },
		{ key: 'clones_7d', label: '7d', align: 'right' },
		{ key: 'clones_30d', label: '30d', align: 'right' }
	];

	function hrefFor(key: SortKey) {
		const nextDir: SortDir = sort === key && dir === 'desc' ? 'asc' : 'desc';
		const params = new URLSearchParams();
		params.set('sort', key);
		params.set('dir', nextDir);
		if (q) params.set('q', q);
		return `/?${params}`;
	}
</script>

<div class="w-full overflow-x-auto">
	<table class="w-full min-w-[720px] border-collapse text-sm">
		<thead>
			<tr class="border-b border-line-strong text-left">
				<th class="py-3 pr-3 font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase"
					>№</th
				>
				{#each columns as col (col.key)}
					<th
						class="py-3 pr-3 font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase"
						class:text-right={col.align === 'right'}
					>
						<a class="no-underline hover:text-teal" href={hrefFor(col.key)}>{col.label}</a>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody class="anim-stagger">
			{#each items as item, i (item.name)}
				{@const { owner, repo } = splitRepo(item.name)}
				{@const share = shareOf(item.total_clones, totalClones)}
				<tr class="group border-b border-line/80 transition hover:bg-white/50">
					<td class="py-3.5 pr-3 font-mono text-xs text-ink-faint">{i + 1}</td>
					<td class="relative py-3.5 pr-3">
						<div
							class="pointer-events-none absolute inset-y-2 left-0 w-full max-w-[220px] rounded-sm bg-teal/10"
							style="width: {Math.max(share, 1.5)}%"
						></div>
						<a
							class="relative font-medium text-ink no-underline group-hover:text-teal"
							href="/{owner}/{repo}"
						>
							<span class="text-ink-muted">{owner}/</span>{repo}
						</a>
						{#if item.description}
							<p class="relative mt-0.5 line-clamp-1 max-w-md text-xs text-ink-faint">
								{item.description}
							</p>
						{/if}
					</td>
					<td class="py-3.5 pr-3 text-right font-mono text-xs" title={fmtNumber(item.stars)}
						>{fmtCompact(item.stars)}</td
					>
					<td
						class="py-3.5 pr-3 text-right font-mono text-xs"
						title="{fmtNumber(item.total_uniques)} / {fmtNumber(item.total_views)}"
					>
						<span class="text-ink-muted">{fmtCompact(item.total_uniques)}</span>
						/ {fmtCompact(item.total_views)}
					</td>
					<td
						class="py-3.5 pr-3 text-right font-mono text-xs"
						title="{fmtNumber(item.clone_uniques)} / {fmtNumber(item.total_clones)}"
					>
						<span class="text-ink-muted">{fmtCompact(item.clone_uniques)}</span>
						/ {fmtCompact(item.total_clones)}
					</td>
					<td class="py-3.5 pr-3 text-right font-mono text-xs">{fmtCompact(item.clones_7d)}</td>
					<td class="py-3.5 pr-3 text-right font-mono text-xs">{fmtCompact(item.clones_30d)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
