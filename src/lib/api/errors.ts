/** Shared upstream/BFF error — safe for client and server imports. */
export class UpstreamError extends Error {
	status: number;
	body: string;

	constructor(status: number, body: string) {
		super(`Upstream ${status}`);
		this.name = 'UpstreamError';
		this.status = status;
		this.body = body;
	}
}
