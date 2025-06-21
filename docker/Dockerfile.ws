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
RUN pnpm --filter @repo/db exec prisma generate   

EXPOSE 8081

CMD ["pnpm", "run", "start:websocket"]
