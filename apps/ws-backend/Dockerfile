FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy only the backend package and any shared packages it depends on
COPY apps/ws-backend ./apps/ws-backend
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the application
RUN pnpm --filter ws-backend build

# Start the application
CMD ["pnpm", "--filter", "ws-backend", "start"]