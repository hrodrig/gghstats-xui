<script lang="ts">
	import { momentumTone } from '$lib/format';

	let {
		label,
		pct
	}: {
		label: string;
		pct: string;
	} = $props();

	const tone = $derived(momentumTone(pct));
</script>

<div class="inline-flex items-baseline gap-2">
	<span class="text-xs tracking-[0.12em] text-ink-faint uppercase">{label}</span>
	<span
		class="font-mono text-sm font-medium"
		class:text-teal={tone === 'up'}
		class:text-coral={tone === 'down'}
		class:text-ink-muted={tone === 'flat'}
	>
		{pct}
	</span>
</div>
