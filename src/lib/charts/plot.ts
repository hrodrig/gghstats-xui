import * as Plot from '@observablehq/plot';

export const atlas = {
	teal: '#0d7377',
	tealSoft: '#d7ecec',
	coral: '#e85d4c',
	ink: '#0f172a',
	inkMuted: '#475569',
	inkFaint: '#94a3b8',
	line: '#d5dee6',
	paper: '#ffffff'
} as const;

export type SeriesPoint = {
	date: Date;
	count: number | null;
	uniques: number | null;
};

export function toDatePoints(
	rows: { date: string; count: number | null; uniques?: number | null }[]
): SeriesPoint[] {
	return rows.map((r) => ({
		date: new Date(`${r.date}T00:00:00Z`),
		count: r.count,
		uniques: r.uniques ?? null
	}));
}

export function areaClones(data: SeriesPoint[], width: number, height = 260): SVGSVGElement {
	return Plot.plot({
		width,
		height,
		marginTop: 16,
		marginRight: 16,
		marginBottom: 36,
		marginLeft: 44,
		style: {
			background: 'transparent',
			fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
			fontSize: '11px',
			color: atlas.inkMuted
		},
		x: { type: 'utc', label: null, ticks: 6 },
		y: { label: null, grid: true, nice: true },
		marks: [
			Plot.ruleY([0], { stroke: atlas.line }),
			Plot.areaY(data, {
				x: 'date',
				y: 'count',
				filter: (d: SeriesPoint) => d.count != null,
				fill: atlas.teal,
				fillOpacity: 0.18,
				curve: 'catmull-rom'
			}),
			Plot.lineY(data, {
				x: 'date',
				y: 'count',
				filter: (d: SeriesPoint) => d.count != null,
				stroke: atlas.teal,
				strokeWidth: 2,
				curve: 'catmull-rom'
			}),
			Plot.lineY(data, {
				x: 'date',
				y: 'uniques',
				filter: (d: SeriesPoint) => d.uniques != null,
				stroke: atlas.coral,
				strokeWidth: 1.5,
				strokeDasharray: '4 3',
				curve: 'catmull-rom'
			}),
			Plot.dot(data, {
				x: 'date',
				y: 'count',
				filter: (d: SeriesPoint) => d.count != null,
				fill: atlas.teal,
				r: 2.2
			})
		]
	}) as SVGSVGElement;
}

export function dualTraffic(
	clones: SeriesPoint[],
	views: SeriesPoint[],
	width: number,
	height = 280
): SVGSVGElement {
	const cloneRows = clones
		.filter((d) => d.count != null)
		.map((d) => ({ date: d.date, value: d.count as number, series: 'Clones' }));
	const viewRows = views
		.filter((d) => d.count != null)
		.map((d) => ({ date: d.date, value: d.count as number, series: 'Views' }));
	const rows = [...cloneRows, ...viewRows];

	return Plot.plot({
		width,
		height,
		marginTop: 28,
		marginRight: 16,
		marginBottom: 36,
		marginLeft: 48,
		style: {
			background: 'transparent',
			fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
			fontSize: '11px',
			color: atlas.inkMuted
		},
		color: {
			domain: ['Clones', 'Views'],
			range: [atlas.teal, atlas.coral],
			legend: true
		},
		x: { type: 'utc', label: null, ticks: 6 },
		y: { label: null, grid: true, nice: true },
		marks: [
			Plot.ruleY([0], { stroke: atlas.line }),
			Plot.areaY(cloneRows, {
				x: 'date',
				y: 'value',
				fill: atlas.teal,
				fillOpacity: 0.12,
				curve: 'catmull-rom'
			}),
			Plot.lineY(rows, {
				x: 'date',
				y: 'value',
				stroke: 'series',
				strokeWidth: 2,
				curve: 'catmull-rom'
			})
		]
	}) as SVGSVGElement;
}

export function starsLine(
	data: { date: Date; total: number }[],
	width: number,
	height = 220
): SVGSVGElement {
	return Plot.plot({
		width,
		height,
		marginTop: 12,
		marginRight: 16,
		marginBottom: 36,
		marginLeft: 48,
		style: {
			background: 'transparent',
			fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
			fontSize: '11px',
			color: atlas.inkMuted
		},
		x: { type: 'utc', label: null },
		y: { label: null, grid: true, nice: true },
		marks: [
			Plot.areaY(data, {
				x: 'date',
				y: 'total',
				fill: atlas.coral,
				fillOpacity: 0.14,
				curve: 'step-after'
			}),
			Plot.lineY(data, {
				x: 'date',
				y: 'total',
				stroke: atlas.coral,
				strokeWidth: 2,
				curve: 'step-after'
			})
		]
	}) as SVGSVGElement;
}

export function h2hLines(
	labels: string[],
	seriesA: number[],
	seriesB: number[],
	nameA: string,
	nameB: string,
	width: number,
	height = 240
): SVGSVGElement {
	const rows = labels.flatMap((label, i) => [
		{ date: new Date(`${label}T00:00:00Z`), value: seriesA[i] ?? 0, series: nameA },
		{ date: new Date(`${label}T00:00:00Z`), value: seriesB[i] ?? 0, series: nameB }
	]);

	return Plot.plot({
		width,
		height,
		marginTop: 28,
		marginRight: 16,
		marginBottom: 36,
		marginLeft: 44,
		style: {
			background: 'transparent',
			fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
			fontSize: '11px',
			color: atlas.inkMuted
		},
		color: {
			domain: [nameA, nameB],
			range: [atlas.teal, atlas.coral],
			legend: true
		},
		x: { type: 'utc', label: null },
		y: { label: null, grid: true, nice: true },
		marks: [
			Plot.ruleY([0], { stroke: atlas.line }),
			Plot.lineY(rows, {
				x: 'date',
				y: 'value',
				stroke: 'series',
				strokeWidth: 2,
				curve: 'catmull-rom'
			})
		]
	}) as SVGSVGElement;
}

export function popularBars(
	items: { name: string; count: number }[],
	width: number,
	height = 220
): SVGSVGElement {
	const data = [...items].slice(0, 8).reverse();
	return Plot.plot({
		width,
		height,
		marginTop: 8,
		marginRight: 24,
		marginBottom: 24,
		marginLeft: Math.min(160, 16 + Math.max(...data.map((d) => d.name.length), 8) * 6.2),
		style: {
			background: 'transparent',
			fontFamily: "'DM Sans', sans-serif",
			fontSize: '11px',
			color: atlas.inkMuted
		},
		x: { label: null, grid: true },
		y: { label: null },
		marks: [
			Plot.barX(data, {
				x: 'count',
				y: 'name',
				fill: atlas.teal,
				fillOpacity: 0.85,
				rx: 2
			}),
			Plot.text(data, {
				x: 'count',
				y: 'name',
				text: (d: { count: number }) => String(d.count),
				dx: 6,
				fill: atlas.inkMuted,
				textAnchor: 'start'
			})
		]
	}) as SVGSVGElement;
}
