<script lang="ts">
	let {
		page = 1,
		perPage = 25,
		totalPages = 1,
		totalCount,
		sort,
		dir,
		q = '',
		/** Path for folio links (e.g. `/` or `/featured`). */
		basePath = '/'
	}: {
		page?: number;
		perPage?: number;
		totalPages?: number;
		totalCount: number;
		sort: string;
		dir: string;
		q?: string;
		basePath?: string;
	} = $props();

	const safePage = $derived(Math.max(1, page ?? 1));
	const safePerPage = $derived(Math.max(1, perPage ?? 25));
	const safeTotalPages = $derived(Math.max(1, totalPages ?? 1));

	const rangeStart = $derived(
		totalCount === 0 ? 0 : (safePage - 1) * safePerPage + 1
	);
	const rangeEnd = $derived(Math.min(safePage * safePerPage, totalCount));

	const hasPrev = $derived(safePage > 1);
	const hasNext = $derived(safePage < safeTotalPages);

	function hrefFor(targetPage: number): string {
		const params = new URLSearchParams();
		params.set('sort', sort);
		params.set('dir', dir);
		if (q) params.set('q', q);
		if (targetPage > 1) params.set('page', String(targetPage));
		const qs = params.toString();
		const path = !basePath || basePath === '/' ? '/' : basePath.replace(/\/$/, '');
		if (!qs) return path;
		return path === '/' ? `/?${qs}` : `${path}?${qs}`;
	}

	type Mark = number | 'gap-start' | 'gap-end';

	function folioMarks(current: number, total: number): Mark[] {
		if (total <= 1) return [1];
		if (total <= 9) {
			return Array.from({ length: total }, (_, i) => i + 1);
		}

		const markNums: number[] = [1, total, current];
		for (let d = -1; d <= 1; d++) {
			const n = current + d;
			if (n >= 1 && n <= total) markNums.push(n);
		}
		if (current <= 3) {
			markNums.push(2, 3, 4);
		}
		if (current >= total - 2) {
			markNums.push(total - 1, total - 2, total - 3);
		}

		const unique: number[] = [];
		for (const n of markNums) {
			if (!unique.includes(n)) unique.push(n);
		}
		const sorted = unique.sort((a, b) => a - b);
		const out: Mark[] = [];
		for (let i = 0; i < sorted.length; i++) {
			const n = sorted[i];
			if (i > 0 && n - sorted[i - 1] > 1) {
				out.push(sorted[i - 1] === 1 ? 'gap-start' : 'gap-end');
			}
			out.push(n);
		}
		return out;
	}

	const marks = $derived(folioMarks(safePage, safeTotalPages));
</script>

{#if safeTotalPages > 1 || totalCount > safePerPage}
	<nav class="repo-pager" aria-label="Repository ledger pagination">
		<div class="repo-pager__rail" aria-hidden="true">
			<span class="repo-pager__meridian"></span>
			<span class="repo-pager__meridian repo-pager__meridian--mid"></span>
		</div>

		<div class="repo-pager__ledger">
			<div class="repo-pager__folio-readout">
				<p class="atlas-eyebrow">Folio</p>
				<p class="repo-pager__folio-num font-display">
					<span class="repo-pager__folio-current">{String(safePage).padStart(2, '0')}</span>
					<span class="repo-pager__folio-sep">/</span>
					<span class="repo-pager__folio-total">{String(safeTotalPages).padStart(2, '0')}</span>
				</p>
				<p class="repo-pager__range font-mono">
					{#if totalCount === 0}
						0 entries
					{:else}
						{rangeStart}–{rangeEnd} of {totalCount}
					{/if}
				</p>
			</div>

			<div class="repo-pager__controls">
				{#if hasPrev}
					<a
						class="repo-pager__traverse repo-pager__traverse--west"
						href={hrefFor(safePage - 1)}
						aria-label="Previous folio"
					>
						<span class="repo-pager__traverse-track" aria-hidden="true">
							<span class="repo-pager__traverse-bar"></span>
							<span class="repo-pager__traverse-head repo-pager__traverse-head--west"></span>
						</span>
						<span class="repo-pager__traverse-label">West sheet</span>
					</a>
				{:else}
					<span
						class="repo-pager__traverse repo-pager__traverse--west is-disabled"
						aria-disabled="true"
					>
						<span class="repo-pager__traverse-track" aria-hidden="true">
							<span class="repo-pager__traverse-bar"></span>
							<span class="repo-pager__traverse-head repo-pager__traverse-head--west"></span>
						</span>
						<span class="repo-pager__traverse-label">West sheet</span>
					</span>
				{/if}

				<ol class="repo-pager__marks" aria-label="Folio marks">
					{#each marks as mark (typeof mark === 'number' ? mark : mark)}
						{#if typeof mark === 'number'}
							<li>
								{#if mark === safePage}
									<span class="repo-pager__mark is-current" aria-current="page">
										<span class="repo-pager__mark-notch" aria-hidden="true"></span>
										<span class="repo-pager__mark-num">{mark}</span>
									</span>
								{:else}
									<a class="repo-pager__mark" href={hrefFor(mark)}>
										<span class="repo-pager__mark-notch" aria-hidden="true"></span>
										<span class="repo-pager__mark-num">{mark}</span>
									</a>
								{/if}
							</li>
						{:else}
							<li class="repo-pager__ellipsis" aria-hidden="true">
								<span class="font-mono">···</span>
							</li>
						{/if}
					{/each}
				</ol>

				{#if hasNext}
					<a
						class="repo-pager__traverse repo-pager__traverse--east"
						href={hrefFor(safePage + 1)}
						aria-label="Next folio"
					>
						<span class="repo-pager__traverse-label">East sheet</span>
						<span class="repo-pager__traverse-track" aria-hidden="true">
							<span class="repo-pager__traverse-bar"></span>
							<span class="repo-pager__traverse-head repo-pager__traverse-head--east"></span>
						</span>
					</a>
				{:else}
					<span
						class="repo-pager__traverse repo-pager__traverse--east is-disabled"
						aria-disabled="true"
					>
						<span class="repo-pager__traverse-label">East sheet</span>
						<span class="repo-pager__traverse-track" aria-hidden="true">
							<span class="repo-pager__traverse-bar"></span>
							<span class="repo-pager__traverse-head repo-pager__traverse-head--east"></span>
						</span>
					</span>
				{/if}
			</div>
		</div>
	</nav>
{/if}

<style>
	.repo-pager {
		position: relative;
		margin-top: var(--atlas-space-5);
		padding-top: var(--atlas-space-4);
		border-top: 1px solid var(--color-line-strong);
	}

	.repo-pager__rail {
		position: absolute;
		inset: 0 0 auto 0;
		height: 1px;
		pointer-events: none;
		overflow: visible;
	}

	.repo-pager__meridian {
		position: absolute;
		top: -1px;
		left: 0;
		width: 33%;
		height: 3px;
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in oklab, var(--color-teal) 55%, transparent) 40%,
			transparent
		);
		opacity: 0.85;
		transition: transform 520ms var(--atlas-ease);
	}

	.repo-pager__meridian--mid {
		left: auto;
		right: 0;
		width: 28%;
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in oklab, var(--color-coral) 35%, transparent) 50%,
			transparent
		);
	}

	.repo-pager:hover .repo-pager__meridian {
		transform: translateX(4px);
	}

	.repo-pager:hover .repo-pager__meridian--mid {
		transform: translateX(-4px);
	}

	.repo-pager__ledger {
		display: flex;
		flex-direction: column;
		gap: var(--atlas-space-4);
	}

	@media (min-width: 640px) {
		.repo-pager__ledger {
			flex-direction: row;
			align-items: flex-end;
			justify-content: space-between;
			gap: var(--atlas-space-5);
		}
	}

	.repo-pager__folio-readout {
		min-width: 8rem;
	}

	.repo-pager__folio-num {
		margin-top: 0.15rem;
		font-size: var(--atlas-text-xl);
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.1;
		color: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}

	.repo-pager__folio-current {
		color: var(--color-teal);
	}

	.repo-pager__folio-sep {
		margin-inline: 0.2em;
		font-weight: 400;
		color: var(--color-ink-faint);
	}

	.repo-pager__folio-total {
		font-size: 0.85em;
		font-weight: 500;
		color: var(--color-ink-muted);
	}

	.repo-pager__range {
		margin-top: var(--atlas-space-2);
		font-size: var(--atlas-text-micro);
		letter-spacing: 0.04em;
		color: var(--color-ink-faint);
	}

	.repo-pager__controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		gap: var(--atlas-space-3);
	}

	.repo-pager__traverse {
		display: inline-flex;
		align-items: center;
		gap: var(--atlas-space-2);
		padding: 0.35rem 0.5rem;
		border: 1px solid var(--color-line);
		border-radius: var(--atlas-radius-sm);
		background: color-mix(in oklab, var(--color-paper) 50%, transparent);
		font-family: var(--font-mono);
		font-size: var(--atlas-text-micro);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--color-ink);
		transition:
			border-color 200ms var(--atlas-ease),
			background 200ms var(--atlas-ease),
			transform 320ms var(--atlas-ease);
	}

	.repo-pager__traverse:hover:not(.is-disabled) {
		border-color: var(--color-teal);
		background: color-mix(in oklab, var(--color-teal-soft) 35%, transparent);
	}

	.repo-pager__traverse--west:hover:not(.is-disabled) .repo-pager__traverse-head--west {
		transform: translateX(-3px);
	}

	.repo-pager__traverse--east:hover:not(.is-disabled) .repo-pager__traverse-head--east {
		transform: translateX(3px);
	}

	.repo-pager__traverse.is-disabled {
		opacity: 0.38;
		pointer-events: none;
		cursor: default;
	}

	.repo-pager__traverse-track {
		position: relative;
		display: block;
		width: 1.75rem;
		height: 0.65rem;
	}

	.repo-pager__traverse-bar {
		position: absolute;
		inset: 50% 0 auto 0;
		height: 1px;
		background: var(--color-line-strong);
		transform: translateY(-50%);
		transition: background 200ms var(--atlas-ease);
	}

	.repo-pager__traverse:hover:not(.is-disabled) .repo-pager__traverse-bar {
		background: var(--color-teal);
	}

	.repo-pager__traverse-head {
		position: absolute;
		top: 50%;
		width: 0;
		height: 0;
		border: 4px solid transparent;
		transition: transform 280ms var(--atlas-ease);
	}

	.repo-pager__traverse-head--west {
		left: 0;
		border-right-color: var(--color-teal);
		transform: translate(-2px, -50%);
	}

	.repo-pager__traverse-head--east {
		right: 0;
		border-left-color: var(--color-teal);
		transform: translate(2px, -50%);
	}

	.repo-pager__traverse-label {
		color: var(--color-ink-muted);
	}

	.repo-pager__marks {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: center;
		gap: 0.35rem;
		margin: 0;
		padding: 0;
		list-style: none;
		min-height: 2.25rem;
	}

	.repo-pager__mark {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
		min-width: 1.75rem;
		padding: 0.15rem 0.25rem 0;
		text-decoration: none;
		color: var(--color-ink-muted);
		transition: color 180ms var(--atlas-ease);
	}

	.repo-pager__mark:hover {
		color: var(--color-teal);
	}

	.repo-pager__mark-notch {
		display: block;
		width: 100%;
		height: 3px;
		border-radius: var(--atlas-radius-sm);
		background: var(--color-line);
		transition:
			background 200ms var(--atlas-ease),
			height 200ms var(--atlas-ease);
	}

	.repo-pager__mark:hover .repo-pager__mark-notch {
		background: color-mix(in oklab, var(--color-teal) 70%, var(--color-line));
		height: 4px;
	}

	.repo-pager__mark.is-current .repo-pager__mark-notch {
		height: 5px;
		background: var(--color-teal);
	}

	.repo-pager__mark-num {
		font-family: var(--font-mono);
		font-size: var(--atlas-text-micro);
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.02em;
	}

	.repo-pager__mark.is-current .repo-pager__mark-num {
		color: var(--color-ink);
		font-weight: 500;
	}

	.repo-pager__ellipsis {
		display: flex;
		align-items: flex-end;
		padding-bottom: 0.15rem;
		color: var(--color-ink-faint);
		font-size: var(--atlas-text-micro);
		user-select: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.repo-pager__meridian,
		.repo-pager__traverse,
		.repo-pager__traverse-head,
		.repo-pager__mark-notch {
			transition: none;
		}

		.repo-pager:hover .repo-pager__meridian,
		.repo-pager:hover .repo-pager__meridian--mid {
			transform: none;
		}
	}
</style>
