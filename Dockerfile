# ====================================================================
# GENIUSPHERE MULTI-STAGE PRODUCTION DOCKERFILE
# Stage 1: Build Frontend SPA & Backend Bundle
# Stage 2: Hardened, Minimal Non-Root Runtime
# ====================================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Cache dependency manifests
COPY package.json package-lock.json ./
RUN npm ci

# Copy entire source
COPY . .

# Build production assets
RUN npm run build

# ====================================================================
# Runner Stage
# ====================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

# Security: Install curl for healthchecks and drop privileges
RUN apk add --no-cache curl postgresql-client && \
    addgroup -g 1001 -S geniusphere && \
    adduser -u 1001 -S geniusphere -G geniusphere

# Copy production manifests & install production-only dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled frontend and application files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/supabase ./supabase
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/node_modules/tsx ./node_modules/tsx

# Set correct non-root permissions
RUN chown -R geniusphere:geniusphere /app

USER geniusphere

EXPOSE 3001

# Authoritative container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Launch production server
CMD ["node", "--loader", "tsx", "server/index.ts"]
