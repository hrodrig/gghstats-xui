<script lang="ts">
	import { THEME_EVENT } from '$lib/theme';

	type Builder = (width: number) => SVGSVGElement | null;

	let {
		build,
		height = 260,
		class: className = '',
		reveal = true
	}: {
		build: Builder;
		height?: number;
		class?: string;
		reveal?: boolean;
	} = $props();

	function chart(node: HTMLDivElement, builder: Builder) {
		let current = builder;
		let width = node.clientWidth || 720;

		function paint() {
			const svg = current(Math.max(320, width));
			node.replaceChildren();
			if (svg) {
				svg.style.width = '100%';
				svg.style.maxWidth = '100%';
				svg.style.height = 'auto';
				node.append(svg);
			}
		}

		const ro = new ResizeObserver((entries) => {
			const w = entries[0]?.contentRect.width;
			if (w && Math.abs(w - width) > 1) {
				width = w;
				paint();
			}
		});

		const onTheme = () => paint();

		paint();
		ro.observe(node);
		document.addEventListener(THEME_EVENT, onTheme);

		return {
			update(next: Builder) {
				current = next;
				paint();
			},
			destroy() {
				ro.disconnect();
				document.removeEventListener(THEME_EVENT, onTheme);
				node.replaceChildren();
			}
		};
	}
</script>

<div
	class="atlas-chart {reveal ? 'anim-chart-in' : 'anim-fade-up'} {className}"
	style="min-height: {height}px"
	use:chart={build}
	role="img"
></div>

<style>
	.atlas-chart {
		width: 100%;
		overflow: hidden;
	}

	.atlas-chart :global(svg) {
		display: block;
	}
</style>
