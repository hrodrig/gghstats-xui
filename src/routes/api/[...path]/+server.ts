import { proxyToUpstream } from '$lib/server/upstream';
import type { RequestHandler } from './$types';

function segments(path: string | undefined): string[] {
	if (!path) return [];
	return path.split('/').filter(Boolean);
}

export const GET: RequestHandler = async (event) => {
	return proxyToUpstream(event, segments(event.params.path));
};

export const HEAD: RequestHandler = async (event) => {
	return proxyToUpstream(event, segments(event.params.path));
};

export const POST: RequestHandler = async (event) => {
	return proxyToUpstream(event, segments(event.params.path));
};
