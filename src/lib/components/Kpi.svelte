<script lang="ts">
	import { fmtCompact, fmtNumber } from '$lib/format';

	let {
		label,
		value,
		hint = '',
		tone = 'default'
	}: {
		label: string;
		value: number | string;
		hint?: string;
		tone?: 'default' | 'teal' | 'coral';
	} = $props();

	const display = $derived(typeof value === 'number' ? fmtCompact(value) : value);
	const title = $derived(typeof value === 'number' ? fmtNumber(value) : String(value));
</script>

<div
	class="anim-fade-up flex flex-col gap-1.5 border-l-2 pl-4 first:border-l-0 first:pl-0 sm:first:border-l-2 sm:first:pl-4"
	class:border-line={tone === 'default'}
	class:border-teal={tone === 'teal'}
	class:border-coral={tone === 'coral'}
>
	<span class="atlas-eyebrow">{label}</span>
	<span
		class="kpi-value"
		class:text-teal={tone === 'teal'}
		class:text-coral={tone === 'coral'}
		{title}>{display}</span
	>
	{#if hint}
		<span class="font-mono text-xs text-ink-muted">{hint}</span>
	{/if}
</div>
