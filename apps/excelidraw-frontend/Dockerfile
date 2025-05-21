FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy only the frontend package and any shared packages it depends on
COPY apps/excelidraw-frontend ./apps/excelidraw-frontend
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the application
RUN pnpm --filter excelidraw-frontend build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["pnpm", "--filter", "excelidraw-frontend", "start"]