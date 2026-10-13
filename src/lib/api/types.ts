export type SortKey =
	| 'name'
	| 'stars'
	| 'forks'
	| 'total_views'
	| 'total_clones'
	| 'clones_1d'
	| 'clones_7d'
	| 'clones_30d';

export type SortDir = 'asc' | 'desc';

export interface RepoListItem {
	name: string;
	description?: string;
	stars: number;
	forks: number;
	watchers?: number;
	issues?: number;
	prs?: number;
	fork?: boolean;
	archived?: boolean;
	total_views: number;
	total_uniques: number;
	total_clones: number;
	clone_uniques: number;
	clones_1d: number;
	clones_7d: number;
	clones_30d: number;
}

export interface ReposResponse {
	total_count: number;
	total_stars: number;
	total_forks: number;
	total_views: number;
	total_clones: number;
	sort: string;
	dir: string;
	q: string;
	page?: number;
	per_page?: number;
	total_pages?: number;
	items: RepoListItem[];
}

export interface ChartPoint {
	date: string;
	count: number | null;
	uniques: number | null;
}

export interface IndexClonesResponse {
	count: number;
	series: ChartPoint[];
	sort: string;
	dir: string;
	q: string;
}

export interface Freshness {
	metric?: string;
	status?: 'fresh' | 'delayed' | 'missing' | 'failed' | 'never' | string;
	fetched_at?: string;
	latest_observed_day?: string;
	latest_completed_utc_day?: string;
	missing_completed_days?: string[];
	error?: string;
}

export interface RepoSummaryResponse {
	repo: RepoListItem;
	momentum_7d: number;
	momentum_30d: number;
	momentum_7d_pct: string;
	momentum_30d_pct: string;
}

export interface TrafficResponse {
	name: string;
	days: number;
	from: string;
	to: string;
	dense?: boolean;
	clones: ChartPoint[];
	views: ChartPoint[];
	clones_freshness?: Freshness;
	views_freshness?: Freshness;
}

export interface StarPoint {
	date: string;
	total: number;
}

export interface StarsResponse {
	name: string;
	stars: StarPoint[];
}

export interface PopularEntry {
	name: string;
	count: number;
	uniques: number;
}

export interface PopularResponse {
	name: string;
	days: number;
	referrers: PopularEntry[];
	paths: PopularEntry[];
}

export interface H2HRow {
	key: string;
	label: string;
	weight_pct: number;
	value_a: number;
	value_b: number;
	leads_a: boolean;
}

export interface H2HResult {
	interval: string;
	repo_a: string;
	repo_b: string;
	score_a: number;
	score_b: number;
	delta_pct: number;
	leads_a: boolean;
	rows: H2HRow[];
	suggest?: {
		confidence: string;
		rationale: string;
		show: boolean;
	};
}

export interface H2HCharts {
	repoA: string;
	repoB: string;
	showMomentum: boolean;
	cloneLabels: string[];
	clonesA: number[];
	clonesB: number[];
	viewLabels: string[];
	viewsA: number[];
	viewsB: number[];
	momentumLabels: string[];
	momentumA: number[];
	momentumB: number[];
}

export interface H2HResponse {
	a: string;
	b: string;
	interval: string;
	result: H2HResult;
	charts: H2HCharts;
}

export interface FeaturedItem {
	name: string;
	sort: number;
	upstream_full_name?: string;
	upstream_description?: string;
	upstream_stars?: number;
	fork?: boolean;
	parent_full_name?: string;
	meta_updated_at?: string;
}

export interface FeaturedResponse {
	total_count: number;
	sort: string;
	dir: string;
	q: string;
	page: number;
	per_page: number;
	total_pages: number;
	items: FeaturedItem[];
}

export interface SyncStatus {
	status: string;
	scope?: string;
	repo?: string;
	running?: boolean;
	started_at?: string;
	finished_at?: string;
	error?: string;
	[key: string]: unknown;
}

export interface ApiErrorBody {
	error: string;
	[key: string]: unknown;
}
