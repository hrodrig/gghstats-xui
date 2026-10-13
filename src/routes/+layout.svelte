<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>gghstats</title>
	<meta
		name="description"
		content="Atlas Day — professional GitHub traffic UI for gghstats api-only mode."
	/>
</svelte:head>

<div class="relative z-0 min-h-dvh pb-16">
	<Nav />
	<main class="atlas-shell relative z-10">
		{@render children()}
	</main>
	<footer class="atlas-shell relative z-10 mt-16 border-t border-line pt-6">
		<p class="font-mono text-[11px] tracking-wide text-ink-faint">
			gghstats-xui · consumes
			<a class="text-ink-muted no-underline hover:text-teal" href="https://github.com/hrodrig/gghstats"
				>gghstats</a
			>
			api-only · upstream token stays server-side · protect the host if public
		</p>
	</footer>
</div>
