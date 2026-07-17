# syntax=docker/dockerfile:1

# ---- Stage 1: build the custom Jellyfin web client ----
FROM node:24-alpine AS web
WORKDIR /src

# Install dependencies first so this layer is cached unless the lockfile changes.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Build the production web client (outputs to /src/dist).
COPY . .
RUN npm run build:production

# ---- Stage 2: Jellyfin server + our custom web UI ----
FROM jellyfin/jellyfin:latest

# Replace the bundled web client with our custom build.
# The official image serves the web client from /jellyfin/jellyfin-web.
RUN rm -rf /jellyfin/jellyfin-web/*
COPY --from=web /src/dist/ /jellyfin/jellyfin-web/
