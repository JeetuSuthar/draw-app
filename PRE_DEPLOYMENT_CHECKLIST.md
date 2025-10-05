# Pre-Deployment Checklist for Render

## ✅ Files Updated

- [x] `package.json` - Workspace configuration and build scripts
- [x] `apps/http-backend/package.json` - Dependencies moved to production
- [x] `apps/ws-backend/package.json` - Dependencies moved to production  
- [x] `turbo.json` - Build outputs configured
- [x] `render.yaml` - Render configuration created
- [x] `.nvmrc` - Node version specified
- [x] `docker/Dockerfile.backend` - Build steps added
- [x] All packages have `@types/node` installed

## ✅ Local Tests Passed

- [x] Clean build works: `pnpm run build:backend`
- [x] All `dist` folders generated correctly
- [x] No TypeScript errors
- [x] Backend can start locally

## 🚀 Ready to Deploy

### Step 1: Commit and Push

```bash
git add .
git commit -m "Fix Render deployment: workspace deps and build order"
git push origin main
```

### Step 2: Configure Render

**Option A: Use render.yaml (Automatic)**
- Render will auto-detect the `render.yaml` file
- Just set these environment variables in Render dashboard:
  - `DATABASE_URL`
  - `JWT_SECRET`

**Option B: Manual Setup**

For HTTP Backend:
```
Build Command: pnpm install && pnpm run db:generate && pnpm run build:backend
Start Command: pnpm run start:backend
```

For WebSocket Backend:
```
Build Command: pnpm install && pnpm run db:generate && pnpm run build:ws
Start Command: pnpm run start:websocket
```

### Step 3: Environment Variables

Set in Render Dashboard:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: Your secret key
- `NODE_VERSION`: 20.18.0 (optional, .nvmrc handles this)

### Step 4: Deploy

1. Clear Render's build cache if redeploying
2. Trigger deployment
3. Watch logs to verify:
   - ✓ Packages install
   - ✓ Prisma generates
   - ✓ Packages build in order: backend-common → common → db → app
   - ✓ Server starts

## 🐛 If Deployment Fails

1. **Check build logs** for the exact error
2. **Clear build cache** in Render: Settings → Clear build cache & deploy
3. **Verify environment variables** are set correctly
4. **Check Node version** - should be 20.18.0

## 📝 Build Order

The build must happen in this exact order:
1. `@repo/backend-common` (JWT_SECRET config)
2. `@repo/common` (types)
3. `@repo/db` (Prisma client)
4. `http-backend` or `ws-backend` (the apps)

This is automatically handled by the `build:backend` and `build:ws` scripts.

---

**Everything is configured! You're ready to deploy.** 🎉
