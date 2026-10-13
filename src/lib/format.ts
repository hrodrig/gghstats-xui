const compact = new Intl.NumberFormat('en', {
	notation: 'compact',
	maximumFractionDigits: 1
});

const full = new Intl.NumberFormat('en');

export function fmtCompact(n: number | null | undefined): string {
	if (n == null || Number.isNaN(n)) return '—';
	return compact.format(n);
}

export function fmtNumber(n: number | null | undefined): string {
	if (n == null || Number.isNaN(n)) return '—';
	return full.format(n);
}

export function fmtPct(label: string | null | undefined): string {
	if (!label) return '—';
	return label;
}

export function momentumTone(pct: string | null | undefined): 'up' | 'down' | 'flat' {
	if (!pct || pct === '0%' || pct === '+0%' || pct === '-0%') return 'flat';
	if (pct.startsWith('-')) return 'down';
	return 'up';
}

export function splitRepo(fullName: string): { owner: string; repo: string } {
	const [owner = '', repo = ''] = fullName.split('/');
	return { owner, repo };
}

export function shareOf(value: number, total: number): number {
	if (!total || total <= 0) return 0;
	return Math.max(0, Math.min(100, (value / total) * 100));
}
