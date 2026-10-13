<script lang="ts">
	import { page } from '$app/state';

	const links = [
		{ href: '/', label: 'Repos' },
		{ href: '/h2h', label: 'H2H' },
		{ href: '/featured', label: 'Featured' }
	];

	function active(href: string, pathname: string) {
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}
</script>

<header class="atlas-shell relative z-10 pt-8 pb-6">
	<div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
		<a href="/" class="group block no-underline">
			<p class="mb-1 font-mono text-[11px] tracking-[0.22em] text-teal uppercase">
				api-only · atlas day
			</p>
			<h1
				class="font-display text-5xl leading-none font-semibold tracking-tight text-ink sm:text-6xl"
			>
				gghstats
			</h1>
			<p class="mt-2 max-w-md text-sm text-ink-muted transition group-hover:text-ink">
				Traffic beyond GitHub’s 14-day window — composed, not cluttered.
			</p>
		</a>

		<nav class="flex flex-wrap gap-1 border-b border-line pb-px" aria-label="Primary">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="px-3 py-2 font-mono text-xs tracking-wide uppercase no-underline transition"
					class:text-ink={active(link.href, page.url.pathname)}
					class:border-b-2={active(link.href, page.url.pathname)}
					class:border-teal={active(link.href, page.url.pathname)}
					class:text-ink-faint={!active(link.href, page.url.pathname)}
					class:hover:text-ink={!active(link.href, page.url.pathname)}
				>
					{link.label}
				</a>
			{/each}
		</nav>
	</div>
</header>
