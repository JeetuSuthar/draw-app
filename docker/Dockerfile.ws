FROM node:22-alpine

# Optional: pass DB URL if needed
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN apk add --no-cache openssl libc6-compat

WORKDIR /usr/src/app

# Copy monorepo structure
COPY ./packages ./packages
COPY ./apps/ws-backend ./apps/ws-backend
COPY ./package.json ./package.json
COPY ./turbo.json ./turbo.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml   
# Install pnpm
RUN npm install -g pnpm

# Install dependencies for all workspaces
RUN pnpm install

# Generate Prisma client from db package
RUN pnpm run db:generate

# Build all packages first (including workspace packages)
RUN pnpm --filter @repo/backend-common build
RUN pnpm --filter @repo/db build

# Build the ws-backend app
RUN pnpm --filter ws-backend build

EXPOSE 8081

CMD ["pnpm", "run", "start:websocket"]
