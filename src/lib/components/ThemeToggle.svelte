<script lang="ts">
	import { onMount } from 'svelte';
	import {
		THEME_EVENT,
		cyclePreference,
		getPreference,
		preferenceLabel,
		resolveTheme,
		type ThemePreference
	} from '$lib/theme';

	let preference = $state<ThemePreference>('system');
	let resolved = $state<'light' | 'dark'>('light');

	function sync() {
		preference = getPreference();
		resolved = resolveTheme(preference);
	}

	function toggle() {
		preference = cyclePreference(preference);
		resolved = resolveTheme(preference);
	}

	onMount(() => {
		sync();
		const onTheme = () => sync();
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const onMq = () => {
			if (getPreference() === 'system') sync();
		};
		document.addEventListener(THEME_EVENT, onTheme);
		mq.addEventListener('change', onMq);
		return () => {
			document.removeEventListener(THEME_EVENT, onTheme);
			mq.removeEventListener('change', onMq);
		};
	});
</script>

<button
	type="button"
	class="atlas-btn shrink-0"
	onclick={toggle}
	aria-label="Theme: {preferenceLabel(preference)}. Click to cycle system, day, night."
	title="Theme · {preferenceLabel(preference)}"
>
	{#if resolved === 'dark'}
		Night
	{:else}
		Day
	{/if}
	<span class="text-ink-faint">· {preferenceLabel(preference)}</span>
</button>
