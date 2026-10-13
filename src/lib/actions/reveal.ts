/** IntersectionObserver reveal — adds `is-visible` when entering the viewport. */
export function reveal(node: HTMLElement, rootMargin = '0px 0px -8% 0px') {
	if (typeof window === 'undefined') return;

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.classList.add('is-visible');
		return;
	}

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('is-visible');
					io.unobserve(node);
				}
			}
		},
		{ rootMargin, threshold: 0.12 }
	);

	node.classList.add('anim-reveal');
	io.observe(node);

	return {
		destroy() {
			io.disconnect();
		}
	};
}
