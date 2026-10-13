<script lang="ts">
	import { fmtCompact, fmtNumber, splitRepo } from '$lib/format';

	let { data } = $props();
</script>

<section class="anim-fade-up">
	<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="font-mono text-[11px] tracking-[0.18em] text-ink-faint uppercase">Showcase</p>
			<h2 class="font-display text-3xl font-semibold tracking-tight text-ink">Featured</h2>
			<p class="mt-2 max-w-xl text-sm text-ink-muted">
				Catalog metadata from gghstats Featured — not filtered by report traffic visibility.
			</p>
		</div>
		<form method="GET" class="flex gap-2">
			<input type="hidden" name="sort" value={data.sort} />
			<input type="hidden" name="dir" value={data.dir} />
			<input
				class="w-52 rounded-sm border border-line bg-white/70 px-3 py-2 font-mono text-xs outline-none focus:border-teal"
				type="search"
				name="q"
				value={data.q}
				placeholder="Search featured"
			/>
			<button
				class="rounded-sm border border-line bg-white/80 px-3 py-2 font-mono text-xs tracking-wide uppercase hover:border-teal"
				type="submit">Filter</button
			>
		</form>
	</div>

	{#if data.error}
		<div class="rounded-sm border border-coral/30 bg-coral-soft/60 px-4 py-3 font-mono text-sm text-coral">
			{data.error}
		</div>
	{:else if data.featured}
		<p class="mb-6 font-mono text-xs text-ink-faint">
			{data.featured.total_count} featured
		</p>
		{#if data.featured.items.length === 0}
			<p class="py-16 text-center font-mono text-sm text-ink-faint">No featured repositories.</p>
		{:else}
			<ul class="anim-stagger divide-y divide-line border-y border-line">
				{#each data.featured.items as item (item.name)}
					{@const local = splitRepo(item.name)}
					<li class="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:justify-between">
						<div>
							<a
								class="font-medium text-ink no-underline hover:text-teal"
								href="/{local.owner}/{local.repo}"
							>
								{item.name}
							</a>
							{#if item.upstream_full_name && item.upstream_full_name !== item.name}
								<p class="mt-0.5 font-mono text-xs text-ink-faint">
									upstream · {item.upstream_full_name}
								</p>
							{/if}
							{#if item.upstream_description}
								<p class="mt-1 max-w-2xl text-sm text-ink-muted">{item.upstream_description}</p>
							{/if}
						</div>
						<div class="font-mono text-xs text-ink-muted" title={fmtNumber(item.upstream_stars ?? 0)}>
							★ {fmtCompact(item.upstream_stars ?? 0)}
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</section>
