import { env } from '$env/dynamic/private';
import { UpstreamError } from '$lib/api/errors';
import type { RequestEvent } from '@sveltejs/kit';

export { UpstreamError };

/** Paths the UI actually uses — anything else is rejected. */
const ALLOWED_GET: RegExp[] = [
	/^repos$/,
	/^v1\/healthz$/,
	/^v1\/badge\/.+/,
	/^v1\/charts\/index-clones$/,
	/^v1\/repos\/[^/]+\/[^/]+$/,
	/^v1\/repos\/[^/]+\/[^/]+\/(traffic|stars|popular)$/,
	/^v1\/h2h$/,
	/^v1\/featured$/,
	/^v1\/sync$/
];

const ALLOWED_POST: RegExp[] = [/^v1\/sync$/];

export function upstreamConfig() {
	const base = (env.GGHSTATS_API_BASE ?? '').replace(/\/$/, '');
	const token = env.GGHSTATS_API_TOKEN ?? '';
	return { base, token };
}

function isSafeSegment(segment: string): boolean {
	if (!segment || segment === '.' || segment === '..') return false;
	if (segment.includes('/') || segment.includes('\\') || segment.includes('\0')) return false;
	return true;
}

function pathAllowed(path: string, method: string): boolean {
	const m = method.toUpperCase();
	if (m === 'GET' || m === 'HEAD') return ALLOWED_GET.some((re) => re.test(path));
	if (m === 'POST') return ALLOWED_POST.some((re) => re.test(path));
	return false;
}

export async function proxyToUpstream(
	event: RequestEvent,
	pathSegments: string[]
): Promise<Response> {
	const { base, token } = upstreamConfig();
	if (!base) {
		return Response.json(
			{ error: 'misconfigured', detail: 'GGHSTATS_API_BASE is not set' },
			{ status: 500 }
		);
	}

	if (!pathSegments.every(isSafeSegment)) {
		return Response.json({ error: 'invalid_path', detail: 'illegal path segment' }, { status: 400 });
	}

	const path = pathSegments.map(encodeURIComponent).join('/');
	const isPublic = path === 'v1/healthz' || path.startsWith('v1/badge/');

	if (!pathAllowed(path, event.request.method)) {
		return Response.json(
			{ error: 'forbidden', detail: 'path or method not allowed' },
			{ status: 403 }
		);
	}

	if (!token && !isPublic) {
		return Response.json(
			{ error: 'misconfigured', detail: 'GGHSTATS_API_TOKEN is not set' },
			{ status: 500 }
		);
	}

	const apiRoot = `${base}/api/`;
	const target = new URL(apiRoot + path);
	if (!target.href.startsWith(apiRoot)) {
		return Response.json(
			{ error: 'invalid_path', detail: 'path escaped api root' },
			{ status: 400 }
		);
	}
	target.search = event.url.search;

	const headers = new Headers();
	headers.set('accept', event.request.headers.get('accept') ?? 'application/json');
	if (token) headers.set('x-api-token', token);

	const contentType = event.request.headers.get('content-type');
	if (contentType) headers.set('content-type', contentType);

	const init: RequestInit = {
		method: event.request.method,
		headers
	};

	if (event.request.method !== 'GET' && event.request.method !== 'HEAD') {
		init.body = await event.request.arrayBuffer();
	}

	let upstream: Response;
	try {
		upstream = await fetch(target, init);
	} catch (e) {
		const detail = e instanceof Error ? e.message : 'upstream unreachable';
		return Response.json({ error: 'bad_gateway', detail }, { status: 502 });
	}

	const outHeaders = new Headers();
	const pass = ['content-type', 'content-disposition', 'cache-control'];
	for (const key of pass) {
		const v = upstream.headers.get(key);
		if (v) outHeaders.set(key, v);
	}

	return new Response(upstream.body, {
		status: upstream.status,
		statusText: upstream.statusText,
		headers: outHeaders
	});
}

/** Server-side typed fetch against the local BFF (keeps token off the browser). */
export async function bffFetch<T>(
	fetchFn: typeof fetch,
	path: string,
	init?: RequestInit
): Promise<T> {
	const url = path.startsWith('/') ? path : `/api/${path}`;
	const res = await fetchFn(url, {
		...init,
		headers: {
			accept: 'application/json',
			...(init?.headers ?? {})
		}
	});

	const text = await res.text();
	if (!res.ok) {
		throw new UpstreamError(res.status, text || res.statusText);
	}
	if (!text) return {} as T;
	return JSON.parse(text) as T;
}
