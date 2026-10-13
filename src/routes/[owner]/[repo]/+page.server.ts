import { getPopular, getRepo, getStars, getTraffic, UpstreamError } from '$lib/api/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

function parseDays(raw: string | null): number {
	if (raw === null || raw === '') return 90;
	const n = Number(raw);
	return Number.isFinite(n) && n >= 0 ? n : 90;
}

export const load: PageServerLoad = async ({ params, url, fetch }) => {
	const owner = params.owner;
	const repo = params.repo;
	const days = parseDays(url.searchParams.get('days'));

	try {
		const [summary, traffic, stars, popular] = await Promise.all([
			getRepo(owner, repo, fetch),
			getTraffic(owner, repo, days, fetch),
			getStars(owner, repo, fetch),
			getPopular(owner, repo, fetch)
		]);
		return { summary, traffic, stars, popular, days, owner, repo, error: null as string | null };
	} catch (e) {
		if (e instanceof UpstreamError && e.status === 404) {
			error(404, 'Repository not found');
		}
		const message =
			e instanceof UpstreamError
				? `${e.status}: ${e.body || e.message}`
				: e instanceof Error
					? e.message
					: 'Failed to load repository';
		return {
			summary: null,
			traffic: null,
			stars: null,
			popular: null,
			days,
			owner,
			repo,
			error: message
		};
	}
};
