<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import RepoPager from '$lib/components/RepoPager.svelte';
	import { fmtCompact, fmtNumber, splitRepo } from '$lib/format';

	let { data } = $props();
</script>

<section class="anim-fade-up">
	<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="atlas-eyebrow">Showcase</p>
			<h2 class="atlas-title mt-1">Featured</h2>
			<p class="atlas-lede">
				Catalog metadata from gghstats Featured — not filtered by report traffic visibility.
			</p>
		</div>
		<form method="GET" class="flex gap-2">
			<input type="hidden" name="sort" value={data.sort} />
			<input type="hidden" name="dir" value={data.dir} />
			<input
				class="atlas-field w-52"
				type="search"
				name="q"
				value={data.q}
				placeholder="Search featured"
			/>
			<button class="atlas-btn" type="submit">Filter</button>
		</form>
	</div>

	{#if data.error}
		<div class="atlas-alert">{data.error}</div>
	{:else if data.featured}
		<p class="mb-6 font-mono text-xs tracking-wide text-ink-faint uppercase">
			{data.featured.total_count} featured
			{#if data.featured.items.length < data.featured.total_count}
				· showing {data.featured.items.length}
			{/if}
		</p>
		{#if data.featured.items.length === 0}
			<p class="atlas-empty">No featured repositories.</p>
		{:else}
			<ul class="anim-stagger divide-y divide-line border-y border-line" use:reveal>
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
			<RepoPager
				page={data.featured.page}
				perPage={data.featured.per_page}
				totalPages={data.featured.total_pages}
				totalCount={data.featured.total_count}
				sort={data.sort}
				dir={data.dir}
				q={data.q}
				basePath="/featured"
			/>
		{/if}
	{/if}
</section>
