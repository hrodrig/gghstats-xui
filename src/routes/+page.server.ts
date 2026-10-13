import { getIndexClones, getRepos, UpstreamError } from '$lib/api/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const sort = url.searchParams.get('sort') ?? 'total_views';
	const dir = url.searchParams.get('dir') ?? 'desc';
	const q = url.searchParams.get('q') ?? '';
	const page = url.searchParams.get('page') ?? '1';

	try {
		const [repos, chart] = await Promise.all([
			getRepos({ sort, dir, q, page, per_page: 25 }, fetch),
			getIndexClones(q, fetch)
		]);
		return { repos, chart, sort, dir, q, error: null as string | null };
	} catch (e) {
		const message =
			e instanceof UpstreamError
				? `${e.status}: ${e.body || e.message}`
				: e instanceof Error
					? e.message
					: 'Failed to load repositories';
		return {
			repos: null,
			chart: null,
			sort,
			dir,
			q,
			error: message
		};
	}
};
