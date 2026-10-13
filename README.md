# gghstats-xui

Professional **Atlas Day** dashboard for [gghstats](https://github.com/hrodrig/gghstats) in **API-only** mode.

SvelteKit SPA → same-origin BFF → `gghstats serve` with `GGHSTATS_API_ONLY=true`. The API token never ships to the browser.

## Quick start

```bash
cp .env.example .env
# set GGHSTATS_API_BASE + GGHSTATS_API_TOKEN

npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Backend (api-only)

```bash
export GGHSTATS_API_ONLY=true
export GGHSTATS_API_TOKEN=dev-token
export GGHSTATS_CORS_ORIGINS=http://localhost:5173   # optional; BFF avoids browser CORS
gghstats serve
```

Point `.env` at that instance:

```env
GGHSTATS_API_BASE=http://127.0.0.1:8080
GGHSTATS_API_TOKEN=dev-token
```

Or use a remote demo host you control (token required for `/api/repos` and dogfood routes).

## Surfaces

| Route | Upstream |
|-------|----------|
| `/` | `GET /api/repos`, `GET /api/v1/charts/index-clones` |
| `/[owner]/[repo]` | repo summary, traffic (`dense=1`), stars, popular |
| `/h2h` | `GET /api/v1/h2h` |
| `/featured` | `GET /api/v1/featured` |
| Sync button | `POST/GET /api/v1/sync` |

Proxy: browser calls `/api/*` → server adds `x-api-token` → `GGHSTATS_API_BASE`.

The BFF allowlists paths/methods the UI needs (GET for reads, POST only for `/api/v1/sync`) and rejects path traversal. It does **not** replace deploy auth — put the app behind Cloudflare Access, reverse-proxy basic auth, or similar if the host is public.

## Stack

- SvelteKit 2 + TypeScript + Tailwind CSS v4
- Observable Plot (SVG charts)
- `@sveltejs/adapter-node`

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run check
```

## Design

**Atlas Day** — mist daylight atmosphere, Fraunces + DM Sans + IBM Plex Mono, teal/coral accents. Built to feel clearer and more editorial than typical dark SaaS traffic dashboards.
