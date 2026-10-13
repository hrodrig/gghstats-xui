# syntax=docker/dockerfile:1
# SvelteKit adapter-node BFF → Node runtime (port 3000).
# Selfhosted: ghcr.io/hrodrig/gghstats-xui:v* with HOST=0.0.0.0 PORT=3000
# Runtime env only: GGHSTATS_API_BASE + GGHSTATS_API_TOKEN (never baked in).
#
# Local: docker buildx build --platform linux/amd64 -t gghstats-xui:local .

ARG NODE_VERSION=22
ARG VERSION=0.1.0
ARG REVISION=unknown
ARG BUILDDATE=unknown

FROM node:${NODE_VERSION}-bookworm AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production — adapter-node output is self-contained (node builtins only).
FROM node:${NODE_VERSION}-bookworm-slim

ARG VERSION
ARG REVISION
ARG BUILDDATE

LABEL org.opencontainers.image.title="gghstats-xui" \
	org.opencontainers.image.description="Atlas Day/Night BFF dashboard for gghstats api-only" \
	org.opencontainers.image.source="https://github.com/hrodrig/gghstats-xui" \
	org.opencontainers.image.url="https://github.com/hrodrig/gghstats-xui" \
	org.opencontainers.image.version="${VERSION}" \
	org.opencontainers.image.revision="${REVISION}" \
	org.opencontainers.image.created="${BUILDDATE}" \
	org.opencontainers.image.licenses="MIT"

WORKDIR /app

COPY --from=build --chown=node:node /app/build ./build
COPY --from=build --chown=node:node /app/package.json ./

ENV NODE_ENV=production \
	HOST=0.0.0.0 \
	PORT=3000

USER node
EXPOSE 3000

CMD ["node", "build"]
