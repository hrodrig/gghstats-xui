import { getFeatured, UpstreamError } from '$lib/api/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const sort = url.searchParams.get('sort') ?? 'sort';
	const dir = url.searchParams.get('dir') ?? 'asc';
	const q = url.searchParams.get('q') ?? '';

	try {
		const featured = await getFeatured({ sort, dir, q, page: 1, per_page: 50 }, fetch);
		return { featured, sort, dir, q, error: null as string | null };
	} catch (e) {
		const message =
			e instanceof UpstreamError
				? `${e.status}: ${e.body || e.message}`
				: e instanceof Error
					? e.message
					: 'Failed to load featured';
		return { featured: null, sort, dir, q, error: message };
	}
};
