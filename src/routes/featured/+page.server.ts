import { getFeatured, UpstreamError } from '$lib/api/client';
import type { PageServerLoad } from './$types';

const PER_PAGE = 12;

export const load: PageServerLoad = async ({ url, fetch }) => {
	const sort = url.searchParams.get('sort') ?? 'sort';
	const dir = url.searchParams.get('dir') ?? 'asc';
	const q = url.searchParams.get('q') ?? '';
	const page = Math.max(1, Number(url.searchParams.get('page') ?? '1') || 1);

	try {
		const featured = await getFeatured({ sort, dir, q, page, per_page: PER_PAGE }, fetch);
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
