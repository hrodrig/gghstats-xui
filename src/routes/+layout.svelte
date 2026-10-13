<script lang="ts">
	import { onMount } from 'svelte';
	import HermesCloud from '$lib/components/HermesCloud.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { HERMES_LIVE, THIS_SKIN } from '$lib/hermes-projects';
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

<div class="relative z-0 flex min-h-dvh flex-col">
	<Nav />
	<main class="atlas-shell relative z-10 flex-1">
		{@render children()}
	</main>
	<footer class="atlas-shell relative z-10 mt-auto">
		<div class="border-t border-line py-5">
			<div
				class="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
			>
				<div class="min-w-0">
					<p class="font-display text-base font-semibold tracking-tight text-ink">{atlasName}</p>
					<p class="mt-1 max-w-md text-sm text-ink-muted" style="line-height: 1.55">
						Mist cartography for gghstats api-only. Token stays on the server.
					</p>
				</div>
				<p
					class="shrink-0 font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase sm:text-right"
				>
					<a
						class="text-teal no-underline hover:text-teal-deep"
						href={THIS_SKIN.href}
						rel="noopener noreferrer"
						target="_blank">{THIS_SKIN.name}</a
					>
					<span> · this skin</span>
				</p>
			</div>

			<div class="mt-5">
				<p class="mb-1 font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase">
					Hermes Projects
					<a
						class="ml-2 text-ink-faint no-underline hover:text-teal"
						href={HERMES_LIVE}
						rel="noopener noreferrer"
						target="_blank">live traffic</a
					>
				</p>
				<HermesCloud />
			</div>
		</div>
	</footer>
</div>
