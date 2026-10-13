<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import BrandMark from '$lib/components/BrandMark.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { THEME_EVENT, resolveTheme } from '$lib/theme';

	const links = [
		{ href: '/' as const, label: 'Repos' },
		{ href: '/h2h' as const, label: 'H2H' },
		{ href: '/featured' as const, label: 'Featured' }
	];

	let modeLabel = $state('day');

	function active(href: string, pathname: string) {
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}

	onMount(() => {
		const sync = () => {
			modeLabel = resolveTheme() === 'dark' ? 'night' : 'day';
		};
		sync();
		document.addEventListener(THEME_EVENT, sync);
		return () => document.removeEventListener(THEME_EVENT, sync);
	});
</script>

<header class="atlas-shell relative z-10 pt-10 pb-8">
	<div class="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
		<a href={resolve('/')} class="group block no-underline">
			<p class="mb-2 font-mono text-[11px] tracking-[0.22em] text-teal uppercase">
				api-only · atlas {modeLabel} · cartographer
			</p>
			<BrandMark />
			<p
				class="mt-3 max-w-md text-sm text-ink-muted transition group-hover:text-ink"
				style="line-height: 1.55"
			>
				Traffic beyond GitHub’s 14-day window — mapped like weather, not a feed.
			</p>
		</a>

		<div class="flex flex-col items-stretch gap-4 sm:items-end">
			<ThemeToggle />
			<nav
				class="flex flex-wrap gap-0 border-b border-line pb-px sm:min-w-[220px] sm:justify-end"
				aria-label="Primary"
			>
				{#each links as link (link.href)}
					<a
						href={resolve(link.href)}
						class="px-3 py-2.5 font-mono text-xs tracking-[0.14em] uppercase no-underline transition"
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
	</div>
	<div
		class="pointer-events-none mt-8 h-px w-full bg-gradient-to-r from-transparent via-line-strong to-transparent"
		aria-hidden="true"
	></div>
</header>
