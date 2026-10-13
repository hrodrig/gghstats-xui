<script lang="ts">
	import type { Attachment } from 'svelte/attachments';

	const syncLockupWidth: Attachment<HTMLElement> = (node) => {
		const anchor = node.querySelector('.stats');
		if (!(anchor instanceof HTMLElement)) return;

		const sync = () => {
			node.style.width = `${anchor.getBoundingClientRect().width}px`;
		};

		let cancelled = false;
		sync();
		document.fonts.ready.then(() => {
			if (!cancelled) sync();
		});

		const ro = new ResizeObserver(sync);
		ro.observe(anchor);

		return () => {
			cancelled = true;
			ro.disconnect();
		};
	};
</script>

<h1 class="brand-mark font-display leading-none font-semibold tracking-tight text-ink" aria-label="gghstats xUI">
	<span class="lockup" {@attach syncLockupWidth} aria-hidden="true">
		<span class="line ggh">
			<span>g</span><span>g</span><span>h</span>
		</span>
		<span class="line stats">stats</span>
		<span class="rule bg-teal"></span>
		<span class="line xui font-mono text-teal">
			<span>x</span><span>U</span><span>I</span>
		</span>
	</span>
</h1>

<style>
	.brand-mark {
		margin: 0;
	}

	.lockup {
		display: inline-flex;
		flex-direction: column;
		width: max-content;
		line-height: 0.92;
	}

	.line {
		display: block;
		width: 100%;
	}

	.stats {
		font-size: var(--atlas-text-display);
		letter-spacing: -0.03em;
		font-weight: 700;
	}

	.ggh {
		display: flex;
		justify-content: space-between;
		font-size: var(--atlas-text-display);
		letter-spacing: -0.03em;
		font-weight: 700;
	}

	.rule {
		display: block;
		width: 100%;
		height: 1px;
		opacity: 0.55;
		margin: 0.35rem 0 0.3rem;
	}

	.xui {
		display: flex;
		justify-content: space-between;
		font-size: calc(var(--atlas-text-display) * 0.28);
		font-weight: 500;
	}
</style>
