<script lang="ts">
	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { THEME_EVENT, applyTheme, getPreference, resolveTheme } from '$lib/theme';
	import './layout.css';

	let { children } = $props();

	let atlasName = $state('Atlas Day');
	let themeColor = $state('#e8eef2');

	function syncMeta() {
		const dark = resolveTheme() === 'dark';
		atlasName = dark ? 'Atlas Night' : 'Atlas Day';
		themeColor = dark ? '#080c10' : '#e8eef2';
	}

	onMount(() => {
		applyTheme(getPreference());
		syncMeta();
		const onTheme = () => syncMeta();
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const onMq = () => {
			if (getPreference() === 'system') {
				applyTheme('system');
				syncMeta();
			}
		};
		document.addEventListener(THEME_EVENT, onTheme);
		mq.addEventListener('change', onMq);
		return () => {
			document.removeEventListener(THEME_EVENT, onTheme);
			mq.removeEventListener('change', onMq);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>gghstats · {atlasName}</title>
	<meta
		name="description"
		content="{atlasName} — editorial GitHub traffic cartography for gghstats api-only mode."
	/>
	<meta name="theme-color" content={themeColor} />
</svelte:head>

<div class="relative z-0 min-h-dvh pb-20">
	<Nav />
	<main class="atlas-shell relative z-10">
		{@render children()}
	</main>
	<footer class="atlas-shell relative z-10 mt-20">
		<div class="border-t border-line pt-8">
			<p class="font-display text-lg font-semibold tracking-tight text-ink">{atlasName}</p>
			<p class="mt-2 max-w-xl text-sm text-ink-muted" style="line-height: 1.55">
				Mist cartography for
				<a class="text-ink-muted no-underline hover:text-teal" href="https://github.com/hrodrig/gghstats"
					>gghstats</a
				>
				api-only. Upstream token stays on the server — protect the host if public.
			</p>
			<p class="mt-4 font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase">
				gghstats-xui · composed, not cluttered
			</p>
		</div>
	</footer>
</div>
