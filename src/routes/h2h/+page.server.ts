import { getH2H, UpstreamError } from '$lib/api/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const a = url.searchParams.get('a') ?? 'hrodrig/gghstats';
	const b = url.searchParams.get('b') ?? 'hrodrig/pgwd';
	const w = url.searchParams.get('w') ?? '7d';

	try {
		const h2h = await getH2H(a, b, w, fetch);
		return { h2h, a, b, w, error: null as string | null };
	} catch (e) {
		const message =
			e instanceof UpstreamError
				? `${e.status}: ${e.body || e.message}`
				: e instanceof Error
					? e.message
					: 'Failed to load H2H';
		return { h2h: null, a, b, w, error: message };
	}
};
