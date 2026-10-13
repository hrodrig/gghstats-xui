<script lang="ts">
	import { onMount } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { HERMES_PROJECTS } from '$lib/hermes-projects';

	const reducedMotion = new MediaQuery('(prefers-reduced-motion: reduce)');

	/** Full live catalog — all repos on gghstats.hermesrodriguez.com. */
	const CLOUD = HERMES_PROJECTS;

	/** Golden-angle fibonacci sphere (unit). */
	const GOLDEN = Math.PI * (3 - Math.sqrt(5));
	const PERSPECTIVE = 2.8;
	const RADIUS = 118;
	const IDLE_SPEED = 0.12;

	type BasePoint = {
		x: number;
		y: number;
		z: number;
		name: string;
		href: string;
	};

	type Projected = {
		name: string;
		href: string;
		x: number;
		y: number;
		scale: number;
		opacity: number;
		zIndex: number;
	};

	const n: number = CLOUD.length;
	const basePoints: BasePoint[] = CLOUD.map((project, i) => {
		const y = n <= 1 ? 0 : 1 - (i / (n - 1)) * 2;
		const r = Math.sqrt(Math.max(0, 1 - y * y));
		const theta = GOLDEN * i;
		return {
			x: Math.cos(theta) * r,
			y,
			z: Math.sin(theta) * r,
			name: project.name,
			href: project.href
		};
	});

	let rotX = $state(0.22);
	let rotY = $state(0.35);
	let dragging = $state(false);

	let lastPtrX = 0;
	let lastPtrY = 0;
	let dragMoved = false;

	function project(rx: number, ry: number): Projected[] {
		const cosY = Math.cos(ry);
		const sinY = Math.sin(ry);
		const cosX = Math.cos(rx);
		const sinX = Math.sin(rx);

		return basePoints.map((p) => {
			const x1 = p.x * cosY + p.z * sinY;
			const z1 = -p.x * sinY + p.z * cosY;
			const y1 = p.y * cosX - z1 * sinX;
			const z2 = p.y * sinX + z1 * cosX;

			const depth = (z2 + 1) / 2;
			const persp = PERSPECTIVE / (PERSPECTIVE - z2);

			return {
				name: p.name,
				href: p.href,
				x: x1 * RADIUS * persp,
				y: y1 * RADIUS * persp,
				scale: 0.7 + depth * 0.4,
				opacity: 0.32 + depth * 0.58,
				zIndex: Math.round(10 + depth * 90)
			};
		});
	}

	let projected = $derived(project(rotX, rotY));

	onMount(() => {
		if (reducedMotion.current) return;

		let raf = 0;
		let last = performance.now();

		const tick = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			if (!dragging) {
				rotY += dt * IDLE_SPEED;
			}
			raf = requestAnimationFrame(tick);
		};

		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});

	function onPointerDown(e: PointerEvent) {
		if (reducedMotion.current) return;
		dragging = true;
		dragMoved = false;
		lastPtrX = e.clientX;
		lastPtrY = e.clientY;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		const dx = e.clientX - lastPtrX;
		const dy = e.clientY - lastPtrY;
		if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragMoved = true;
		lastPtrX = e.clientX;
		lastPtrY = e.clientY;
		rotY += dx * 0.009;
		rotX = Math.max(-1.05, Math.min(1.05, rotX + dy * 0.009));
	}

	function onPointerUp() {
		dragging = false;
	}

	function onLinkClick(e: MouseEvent) {
		if (dragMoved) e.preventDefault();
	}
</script>

{#if reducedMotion.current}
	<nav class="flat font-mono text-xs tracking-wide" aria-label="Hermes Projects">
		{#each CLOUD as project, i (project.name)}
			{#if i > 0}
				<span class="sep" aria-hidden="true">·</span>
			{/if}
			<a
				class="label"
				href={project.href}
				rel="noopener noreferrer"
				target="_blank">{project.name}</a
			>
		{/each}
	</nav>
{:else}
	<div
		class="cloud"
		role="presentation"
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
	>
		<svg class="meridian" viewBox="0 0 240 240" aria-hidden="true">
			<ellipse cx="120" cy="120" rx="100" ry="100" />
			<ellipse cx="120" cy="120" rx="100" ry="40" />
			<ellipse cx="120" cy="120" rx="40" ry="100" />
			<line x1="20" y1="120" x2="220" y2="120" />
			<line x1="120" y1="20" x2="120" y2="220" />
		</svg>

		<nav class="sphere" aria-label="Hermes Projects">
			{#each projected as p (p.name)}
				<a
					class="label star"
					href={p.href}
					rel="noopener noreferrer"
					target="_blank"
					style:--x="{p.x}px"
					style:--y="{p.y}px"
					style:--s={p.scale}
					style:--o={p.opacity}
					style:z-index={p.zIndex}
					onclick={onLinkClick}>{p.name}</a
				>
			{/each}
		</nav>
	</div>
{/if}

<style>
	.flat {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.35rem 0.5rem;
		margin-top: 0.35rem;
	}

	.sep {
		color: color-mix(in oklab, var(--atlas-ink-faint) 40%, transparent);
	}

	.cloud {
		position: relative;
		width: min(100%, 420px);
		height: 320px;
		margin-top: 0.25rem;
		touch-action: none;
		user-select: none;
		cursor: grab;
	}

	.cloud:active {
		cursor: grabbing;
	}

	.meridian {
		position: absolute;
		inset: 50% auto auto 50%;
		width: 240px;
		height: 240px;
		transform: translate(-50%, -50%);
		pointer-events: none;
		overflow: visible;
	}

	.meridian ellipse,
	.meridian line {
		fill: none;
		stroke: var(--atlas-teal);
		stroke-opacity: 0.1;
		stroke-width: 1;
	}

	.meridian line {
		stroke-opacity: 0.07;
	}

	.sphere {
		position: absolute;
		inset: 0;
		display: block;
	}

	.label {
		color: var(--atlas-ink-faint);
		text-decoration: none;
		letter-spacing: 0.06em;
		transition: color 0.15s ease;
	}

	.label:hover,
	.label:focus-visible {
		color: var(--atlas-teal);
		outline: none;
	}

	.label:focus-visible {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.star {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(var(--s));
		/* Depth via color-mix — tokens follow Atlas Day/Night; avoid stacking opacity on faint ink */
		color: color-mix(
			in oklab,
			var(--atlas-ink) calc(var(--o) * 85%),
			var(--atlas-ink-faint)
		);
		opacity: 1;
		font-family: var(--font-mono);
		font-size: 0.65rem;
		white-space: nowrap;
		will-change: transform, color;
	}

	.star:hover,
	.star:focus-visible {
		color: var(--atlas-teal);
	}

	/* Meridian contrast per theme */
	:global(:root[data-theme='light']) .meridian ellipse {
		stroke-opacity: 0.16;
	}
	:global(:root[data-theme='light']) .meridian line {
		stroke-opacity: 0.1;
	}
	:global(:root[data-theme='dark']) .meridian ellipse {
		stroke-opacity: 0.14;
	}
	:global(:root[data-theme='dark']) .meridian line {
		stroke-opacity: 0.09;
	}
</style>
