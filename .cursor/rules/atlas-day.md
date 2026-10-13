---
description: Atlas Day design system for gghstats-xui — always apply when changing UI
globs: src/**/*.{svelte,css,html}
alwaysApply: true
---

# Atlas Day — cartógrafo de tráfico

gghstats-xui is an editorial daylight dashboard for GitHub traffic (api-only BFF). Elevate craft; do not turn it into a marketing landing or dark SaaS shell.

## Signature
Mist cartography + Fraunces display + mono data. Dual theme: **Atlas Day** (light) and **Atlas Night** (deep slate, not purple SaaS). Toggle cycles System → Day → Night. Memorable moment: chart series reveal on overview load. Charts read CSS tokens via `getAtlas()`.

## Tokens (source of truth: `src/routes/layout.css`)
- Display: Fraunces
- Body: DM Sans
- Data: IBM Plex Mono
- Ink `#0f172a`, muted `#475569`, faint `#94a3b8`
- Mist `#e8eef2` / soft `#f7f9fb`, paper `#ffffff`
- Teal `#0d7377`, coral `#e85d4c`, lines `#d5dee6`
- Spacing/radius/type scales: CSS variables `--atlas-space-*`, `--atlas-radius-*`, `--atlas-text-*`
- Motion: `--atlas-ease`, `anim-fade-up`, `anim-reveal`, `anim-chart-in`; honor `prefers-reduced-motion`

## Rules
- No Inter/Roboto/Arial, no purple glow, no cream+terracotta default, no broadsheet hairline newspaper look
- No decorative cards in hero/shell; cards only for real interactions
- Brand `gghstats` stays hero-level in the shell first viewport
- Empty/error/loading states required and consistent (coral soft for errors, mono captions)
- Skills `landing-page-design` and `redesign-existing` are methodology only — their dark/fixed palettes do not apply here
