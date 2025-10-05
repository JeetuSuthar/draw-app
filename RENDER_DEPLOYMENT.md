# Render Deployment Guide

## Quick Setup for Render

### Option 1: Using render.yaml (Recommended)

The `render.yaml` file is already configured in the root. Render will automatically detect and use it.

**Before deploying, make sure to:**

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Fix workspace dependencies and build process"
   git push
   ```

2. In Render Dashboard:
   - Go to your service settings
   - Set the following environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `JWT_SECRET`: Your JWT secret key
   - The build and start commands are already configured in `render.yaml`

### Option 2: Manual Configuration

If you prefer manual setup, use these settings:

#### For HTTP Backend Service:

**Build Command:**
```bash
pnpm install && pnpm run db:generate && pnpm run build:backend
```

**Start Command:**
```bash
pnpm run start:backend
```

**Environment Variables:**
- `NODE_VERSION`: `20.18.0`
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: Your secret key

#### For WebSocket Backend Service:

**Build Command:**
```bash
pnpm install && pnpm run db:generate && pnpm run build:ws
```

**Start Command:**
```bash
pnpm run start:websocket
```

**Environment Variables:**
- `NODE_VERSION`: `20.18.0`
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: Your secret key

---

## What Was Fixed

### 1. Workspace Configuration
- ✅ Updated `package.json` to include `packages/*` in workspaces
- ✅ Ensured `pnpm-workspace.yaml` includes all packages

### 2. Dependency Management
- ✅ Moved workspace dependencies (`@repo/*`) from `devDependencies` to `dependencies`
- ✅ This ensures they're available during production builds

### 3. Build Process
- ✅ Added `build:backend` and `build:ws` scripts that build packages in correct order:
  1. Build `@repo/backend-common`
  2. Build `@repo/common`
  3. Build `@repo/db`
  4. Build the app (`http-backend` or `ws-backend`)

### 4. Type Definitions
- ✅ Added `@types/node` to all packages that need it

### 5. Docker Configuration
- ✅ Updated `Dockerfile.backend` to build workspace packages before the app

---

## Troubleshooting

### If you still get module resolution errors:

1. **Clear Render's build cache:**
   - In Render dashboard: Settings → "Clear build cache & deploy"

2. **Verify environment variables:**
   - Make sure `DATABASE_URL` and `JWT_SECRET` are set

3. **Check Node version:**
   - The `.nvmrc` file ensures Node 20.18.0 is used

4. **Build logs:**
   - Check that packages build in this order:
     ```
     @repo/backend-common → @repo/common → @repo/db → http-backend
     ```

### Local Testing

Test the exact build process that Render will use:

```bash
# Clean everything
rm -rf node_modules packages/*/node_modules apps/*/node_modules
rm -rf packages/*/dist apps/*/dist

# Install and build
pnpm install
pnpm run db:generate
pnpm run build:backend

# Start the server
pnpm run start:backend
```

---

## Key Changes Summary

| File | Change |
|------|--------|
| `package.json` | Added `packages/*` to workspaces, added build scripts |
| `apps/http-backend/package.json` | Moved workspace deps to `dependencies` |
| `apps/ws-backend/package.json` | Moved workspace deps to `dependencies` |
| `turbo.json` | Added `dist/**` to outputs |
| `render.yaml` | Created with proper build/start commands |
| `.nvmrc` | Added to specify Node 20.18.0 |
| `Dockerfile.backend` | Added package build steps |

---

## Success Checklist

- [x] Workspace packages included in root `package.json`
- [x] `@types/node` installed in all packages
- [x] Workspace dependencies in `dependencies` (not `devDependencies`)
- [x] Build scripts that build packages in correct order
- [x] `render.yaml` configured
- [x] `.nvmrc` created
- [x] Local build tested successfully

Your project is now ready to deploy on Render! 🚀
