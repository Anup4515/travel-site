# ngrok Setup Guide for Travel Site

## The Problem
ngrok couldn't access the Next.js app on localhost:3000 due to:
1. NEXTAUTH_URL hardcoded to localhost
2. WebSocket HMR (Hot Module Replacement) blocked from ngrok domain
3. Next.js 16 security blocking cross-origin dev resource access

## The Solution

### Step 1: Update `.env.local`
Change `NEXTAUTH_URL` from localhost to your ngrok URL:
```env
NEXTAUTH_URL=https://your-ngrok-domain.ngrok-free.dev
NEXTAUTH_SECRET=e3b7f2c1a9d4e6f0b5c3d7a8f9e0b1c2d3f4a5b6c7d8e9f0a1b2c3d4e5f6a79b
NEXTAUTH_URL_INTERNAL=http://localhost:3000
MONGODB_URI=mongodb+srv://lakshaymris2004_db_user:75itQVeJmaAXT7Dp@aureotravels.8xaleyj.mongodb.net/?appName=AureoTravels
GOOGLE_PLACES_API_KEY=bbbd8a28998f466bee69657b6d6036f925fa55df98ce6953e76df63387e9356f
ADMIN_EMAIL=admin12@gmail.com
ADMIN_PASSWORD=admin
```

### Step 2: Update `next.config.ts`
Add `allowedDevOrigins` to allow access from ngrok domain:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  turbopack: {
    resolveAlias: {},
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  allowedDevOrigins: ['your-ngrok-domain.ngrok-free.dev'],
};

export default nextConfig;
```

### Step 3: Restart Dev Server
```bash
npm run dev
```

### Step 4: Access via ngrok
Open: `https://your-ngrok-domain.ngrok-free.dev/`

## Key Points
- **NEXTAUTH_URL** = Public ngrok domain (for browser requests)
- **allowedDevOrigins** = Allows ngrok to access Next.js dev resources (HMR, webpack-hmr)
- **NEXTAUTH_URL_INTERNAL** = Optional, can use localhost for internal server connections
- Restart the dev server after any env or config changes
- Each time ngrok generates a new domain, update both `.env.local` and `next.config.ts`

## Gotchas to Avoid
❌ Forgetting to restart `npm run dev` after env changes
❌ Using `--ws` flag (not supported in older ngrok versions)
❌ Not realizing the issue was HMR, not NEXTAUTH_URL alone
❌ Using webpack config instead of turbopack config for Next.js 16+
