<script lang="ts">
	import { onMount } from 'svelte';
	import { getSync, postSync } from '$lib/api/client';
	import type { SyncStatus } from '$lib/api/types';

	let {
		repo = ''
	}: {
		repo?: string;
	} = $props();

	let status = $state<SyncStatus | null>(null);
	let busy = $state(false);
	let error = $state('');
	let timer: ReturnType<typeof setInterval> | undefined;

	async function refresh() {
		try {
			status = await getSync();
			error = '';
			const running =
				status.running === true ||
				status.status === 'started' ||
				status.status === 'running' ||
				status.status === 'in_progress';
			if (!running && timer) {
				clearInterval(timer);
				timer = undefined;
				busy = false;
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'sync status failed';
		}
	}

	async function trigger() {
		busy = true;
		error = '';
		try {
			status = await postSync(repo || undefined);
			if (!timer) {
				timer = setInterval(() => {
					void refresh();
				}, 1500);
			}
			await refresh();
		} catch (e) {
			error = e instanceof Error ? e.message : 'sync failed';
			busy = false;
		}
	}

	onMount(() => {
		void refresh();
		return () => {
			if (timer) clearInterval(timer);
		};
	});
</script>

<div class="flex flex-wrap items-center gap-3">
	<button
		type="button"
		class="rounded-sm bg-ink px-3.5 py-2 font-mono text-xs font-medium tracking-wide text-mist-soft transition hover:bg-teal disabled:cursor-wait disabled:opacity-60"
		disabled={busy}
		onclick={() => void trigger()}
	>
		{busy ? 'Syncing…' : repo ? `Sync ${repo}` : 'Sync all'}
	</button>
	{#if status}
		<span class="font-mono text-xs text-ink-muted">
			{status.status}{status.scope ? ` · ${status.scope}` : ''}
		</span>
	{/if}
	{#if error}
		<span class="font-mono text-xs text-coral">{error}</span>
	{/if}
</div>
