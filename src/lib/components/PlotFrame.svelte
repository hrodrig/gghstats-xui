<script lang="ts">
	type Builder = (width: number) => SVGSVGElement | null;

	let {
		build,
		height = 260,
		class: className = ''
	}: {
		build: Builder;
		height?: number;
		class?: string;
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

		paint();
		ro.observe(node);

		return {
			update(next: Builder) {
				current = next;
				paint();
			},
			destroy() {
				ro.disconnect();
				node.replaceChildren();
			}
		};
	}
</script>

<div
	class="atlas-chart anim-fade-up {className}"
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
