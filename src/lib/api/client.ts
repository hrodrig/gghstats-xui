import { UpstreamError } from './errors';
import type {
	FeaturedResponse,
	H2HResponse,
	IndexClonesResponse,
	PopularResponse,
	ReposResponse,
	RepoSummaryResponse,
	StarsResponse,
	SyncStatus,
	TrafficResponse
} from './types';

export { UpstreamError };

async function parseJson<T>(res: Response): Promise<T> {
	const text = await res.text();
	if (!res.ok) {
		let message = text || res.statusText;
		try {
			const body = JSON.parse(text) as { error?: string; detail?: string };
			message = body.detail ?? body.error ?? message;
		} catch {
			/* keep raw */
		}
		throw new UpstreamError(res.status, message);
	}
	if (!text) return {} as T;
	return JSON.parse(text) as T;
}

/** Browser / universal client — always hits same-origin BFF under /api. */
export async function apiGet<T>(path: string, fetchFn: typeof fetch = fetch): Promise<T> {
	const url = path.startsWith('/api') ? path : `/api/${path.replace(/^\//, '')}`;
	const res = await fetchFn(url, { headers: { accept: 'application/json' } });
	return parseJson<T>(res);
}

export async function apiPost<T>(path: string, fetchFn: typeof fetch = fetch): Promise<T> {
	const url = path.startsWith('/api') ? path : `/api/${path.replace(/^\//, '')}`;
	const res = await fetchFn(url, {
		method: 'POST',
		headers: { accept: 'application/json' }
	});
	return parseJson<T>(res);
}

export function getRepos(
	params: Record<string, string | number | undefined> = {},
	fetchFn?: typeof fetch
) {
	const q = new URLSearchParams();
	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== '') q.set(k, String(v));
	}
	const qs = q.toString();
	return apiGet<ReposResponse>(`/api/repos${qs ? `?${qs}` : ''}`, fetchFn);
}

export function getIndexClones(q = '', fetchFn?: typeof fetch) {
	const qs = q ? `?q=${encodeURIComponent(q)}` : '';
	return apiGet<IndexClonesResponse>(`/api/v1/charts/index-clones${qs}`, fetchFn);
}

export function getRepo(owner: string, repo: string, fetchFn?: typeof fetch) {
	return apiGet<RepoSummaryResponse>(
		`/api/v1/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
		fetchFn
	);
}

export function getTraffic(
	owner: string,
	repo: string,
	days = 90,
	fetchFn?: typeof fetch
) {
	return apiGet<TrafficResponse>(
		`/api/v1/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/traffic?days=${days}&dense=1`,
		fetchFn
	);
}

export function getStars(owner: string, repo: string, fetchFn?: typeof fetch) {
	return apiGet<StarsResponse>(
		`/api/v1/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/stars`,
		fetchFn
	);
}

export function getPopular(owner: string, repo: string, fetchFn?: typeof fetch) {
	return apiGet<PopularResponse>(
		`/api/v1/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/popular`,
		fetchFn
	);
}

export function getH2H(a: string, b: string, w: string = '7d', fetchFn?: typeof fetch) {
	const qs = new URLSearchParams({ a, b, w });
	return apiGet<H2HResponse>(`/api/v1/h2h?${qs}`, fetchFn);
}

export function getFeatured(
	params: Record<string, string | number | undefined> = {},
	fetchFn?: typeof fetch
) {
	const q = new URLSearchParams();
	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== '') q.set(k, String(v));
	}
	const qs = q.toString();
	return apiGet<FeaturedResponse>(`/api/v1/featured${qs ? `?${qs}` : ''}`, fetchFn);
}

export function getSync(fetchFn?: typeof fetch) {
	return apiGet<SyncStatus>('/api/v1/sync', fetchFn);
}

export function postSync(repo?: string, fetchFn?: typeof fetch) {
	const qs = repo ? `?repo=${encodeURIComponent(repo)}` : '';
	return apiPost<SyncStatus>(`/api/v1/sync${qs}`, fetchFn);
}
