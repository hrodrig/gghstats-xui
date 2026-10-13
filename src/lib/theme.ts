export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'gghstats-theme';
export const THEME_EVENT = 'atlas:theme';

export function getPreference(): ThemePreference {
	if (typeof localStorage === 'undefined') return 'system';
	const raw = localStorage.getItem(THEME_STORAGE_KEY);
	if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
	return 'system';
}

export function systemPrefersDark(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolveTheme(preference: ThemePreference = getPreference()): ResolvedTheme {
	if (preference === 'system') return systemPrefersDark() ? 'dark' : 'light';
	return preference;
}

export function applyTheme(preference: ThemePreference = getPreference()): ResolvedTheme {
	const resolved = resolveTheme(preference);
	if (typeof document === 'undefined') return resolved;

	document.documentElement.dataset.theme = resolved;
	document.documentElement.style.colorScheme = resolved;

	try {
		localStorage.setItem(THEME_STORAGE_KEY, preference);
	} catch {
		/* private mode */
	}

	document.dispatchEvent(
		new CustomEvent(THEME_EVENT, { detail: { preference, resolved } })
	);
	return resolved;
}

export function cyclePreference(current: ThemePreference = getPreference()): ThemePreference {
	const order: ThemePreference[] = ['system', 'light', 'dark'];
	const next = order[(order.indexOf(current) + 1) % order.length] ?? 'system';
	applyTheme(next);
	return next;
}

export function preferenceLabel(preference: ThemePreference): string {
	if (preference === 'system') return 'System';
	if (preference === 'light') return 'Day';
	return 'Night';
}
