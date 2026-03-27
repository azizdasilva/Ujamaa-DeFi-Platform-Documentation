# UJAMAA DEFI PLATFORM Frontend - Quick Start Guide

## How to Start and Launch the Frontend Application

**Author:** Aziz Da Silva - Lead Architect
**Document Version:** 2.0 (SRS v2.0 Aligned)
**Last Updated:** March 17, 2026
**Framework:** React 19 + Vite 7.x + TypeScript 6.0+

**Aligned with:** SRS v2.0 Section 4.1 (User Interfaces)

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Installation](#2-installation)
3. [Start Development Server](#3-start-development-server)
4. [Access the Application](#4-access-the-application)
5. [Testing Checklist](#5-testing-checklist)
6. [Build for Production](#6-build-for-production)
7. [Deploy to Production](#7-deploy-to-production)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Prerequisites

Ensure you have the following installed:

| Tool | Version | How to Check |
|------|---------|--------------|
| **Node.js** | v18+ | `node --version` |
| **npm** | v9+ | `npm --version` |
| **Git** | Latest | `git --version` |

### Install Node.js (if not installed)

**Windows:**
```bash
# Download from https://nodejs.org/
# Run the installer and follow prompts
```

**Verify Installation:**
```bash
node --version
npm --version
```

---

## 2. Installation

### Step 1: Navigate to Frontend Directory

```bash
cd "C:\Users\aziz_\PycharmProjects\2026\INTELLI_BRIDGE_ANALYTICS\UJAMAA DEFI PLATFORM\frontend"
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected Output:**
```
added 225 packages, and audited 226 packages in 1m

61 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

---

## 3. Start Development Server

### Option A: Foreground (Recommended for Development)

```bash
npm run dev
```

**Expected Output:**
```
  VITE v7.3.1  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Option B: Background (For Testing)

```bash
# Windows (PowerShell)
Start-Process npm -ArgumentList "run","dev" -WindowStyle Hidden

# Or use npm run dev &
```

### Stop the Server

**Foreground:**
- Press `Ctrl + C` in the terminal

**Background:**
```bash
# Find the process
tasklist | findstr node

# Kill the process
taskkill /F /IM node.exe
```

---

## 4. Access the Application

### Open Your Browser

Navigate to:
```
http://localhost:5173
```

### Supported Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 120+ | ✅ Tested |
| Firefox | 120+ | ✅ Tested |
| Edge | 120+ | ✅ Tested |
| Safari | 16+ | ⚠️ Not Tested |

---

## 5. Testing Checklist

### Quick Routes Reference

| Page | Route | Description |
|------|-------|-------------|
| **Homepage** | `/` | Landing page with hero, features, CTA |
| **Marketplace** | `/marketplace` | Browse and filter assets |
| **Investor Onboarding** | `/onboarding/investor` | KYC flow for investors |
| **Industrial Onboarding** | `/onboarding/originator` | KYB flow for companies |
| **Investor Dashboard** | `/dashboard/investor` | Portfolio and investments |
| **Industrial Dashboard** | `/dashboard/originator` | Asset management, notarization |
| **Admin Dashboard** | `/dashboard/admin` | User approval, fraud alerts |

---

### Detailed Testing Steps

#### 1. **Landing Page** (`http://localhost:5173/`)

- [ ] Hero section displays with green gradient background
- [ ] Headline: "Tokenize African Real-World Assets"
- [ ] 3 CTA buttons visible (Browse Assets, Invest Now, Tokenize Assets)
- [ ] Features section shows 4 cards:
  - ERC-3643 Compliance
  - Institutional Security
  - African Market Focus
  - Transparent & Auditable
- [ ] "How It Works" section shows 3 steps
- [ ] Footer with links displays correctly
- [ ] Click "Browse Assets" → navigates to `/marketplace`
- [ ] Click "Invest Now" → navigates to `/onboarding/investor`

#### 2. **Marketplace** (`http://localhost:5173/marketplace`)

- [ ] 6 asset cards display in grid (3 columns on desktop)
- [ ] Each card shows:
  - Asset name and originator
  - Asset class badge
  - Target raise and current raise
  - Expected yield (%)
  - Minimum investment
  - Progress bar
  - "View Details" button
- [ ] Search bar filters assets by name/originator
- [ ] Class dropdown filters by asset type
- [ ] Clear Filters button resets all filters
- [ ] Responsive on mobile (1 column)

#### 3. **Investor Onboarding** (`http://localhost:5173/onboarding/investor`)

- [ ] 3-step onboarding flow visible
- [ ] Step 1: "Connect Wallet" button present
- [ ] Step 2: Email input and jurisdiction dropdown
- [ ] Step 3: KYC document upload area
- [ ] "Continue to Dashboard" button at bottom
- [ ] Form validation works (try submitting empty fields)

#### 4. **Industrial Onboarding** (`http://localhost:5173/onboarding/originator`)

- [ ] Company information form displays
- [ ] Inputs: Company Name, Registration Number
- [ ] Industry dropdown with 8 options:
  - Manufacturing
  - Agriculture
  - Mining
  - Trade
  - Services
  - Energy
  - Real Estate
  - Technology
- [ ] Document upload areas (2 files required)
- [ ] "Submit for Verification" button

#### 5. **Investor Dashboard** (`http://localhost:5173/dashboard/investor`)

- [ ] Portfolio summary cards (4 cards):
  - Total Invested
  - Current Value
  - Total Returns
  - Active Investments
- [ ] Investments table with columns:
  - Asset name
  - Shares
  - Value
  - Returns (%)
  - Status badge
- [ ] Mock data populates correctly
- [ ] "View All" link visible

#### 6. **Industrial Dashboard** (`http://localhost:5173/dashboard/originator`)

- [ ] Stats summary (4 cards):
  - Total Assets
  - Pending Approval
  - Total Raised
  - Proofs Notarized
- [ ] "Deposit New Asset" button visible
- [ ] Your Assets list with progress bars
- [ ] Notarization History table
- [ ] "🔐 Notarize Production Data" button

#### 7. **Admin Dashboard** (`http://localhost:5173/dashboard/admin`)

- [ ] KPI cards (4 cards):
  - Pending Users
  - Pending Assets
  - Fraud Alerts
  - Total AUM
- [ ] Pending Users table with Approve/Reject actions
- [ ] Pending Assets table with Approve/Reject actions
- [ ] Fraud Alerts with severity badges
- [ ] Resolve/Escalate buttons on alerts

---

### Navigation Testing

- [ ] Header logo links to homepage
- [ ] "Marketplace" link in header works
- [ ] Dashboard links appear after wallet connection
- [ ] Footer links are functional
- [ ] Mobile navigation (hamburger menu) works
- [ ] Role-based navigation displays correctly

---

### Responsive Testing

**Desktop (1920x1080):**
- [ ] All layouts display correctly
- [ ] Grid layouts show full columns
- [ ] Header navigation visible

**Tablet (768x1024):**
- [ ] Grid layouts adjust to 2 columns
- [ ] Navigation remains accessible
- [ ] No horizontal scrolling

**Mobile (375x667):**
- [ ] Single column layouts
- [ ] Mobile navigation works
- [ ] All buttons are tappable
- [ ] Text is readable without zoom

---

## 6. Build for Production

### Step 1: Run Production Build

```bash
npm run build
```

**Expected Output:**
```
> frontend@0.0.0 build
> tsc -b && vite build

vite v7.3.1 building client environment for production...
transforming...
✓ 60 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.04 kB │ gzip:  0.53 kB
dist/assets/index-Dv2Yopbj.css    6.43 kB │ gzip:  1.83 kB
dist/assets/index-D-ChvpMS.js   272.61 kB │ gzip: 82.58 kB
✓ built in 2.63s
```

### Step 2: Preview Production Build

```bash
npm run preview
```

**Expected Output:**
```
  VITE v7.3.1  ready in 300 ms

  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
```

Navigate to `http://localhost:4173` to test production build.

---

## 7. Deploy to Production

### Deploy to Vercel (Recommended)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

```bash
# Navigate to frontend directory
cd frontend

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Step 4: Set Environment Variables

In Vercel dashboard, add:
```
NEXT_PUBLIC_POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

### Deploy to Netlify

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Deploy

```bash
netlify deploy --prod
```

#### Step 3: Build Settings

- **Build command:** `npm run build`
- **Publish directory:** `dist`

---

## 8. Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **Port 5173 already in use** | Another Vite server running | Kill process: `taskkill /F /IM node.exe` |
| **`npm install` fails** | Network/cache issue | Run `npm cache clean --force` then retry |
| **Blank page on load** | Build error or missing dependency | Run `npm run build` to check for errors |
| **Styles not loading** | Tailwind CSS not configured | Verify `tailwind.config.js` exists |
| **TypeScript errors** | Type mismatch | Run `npx tsc --noEmit` to see all errors |
| **Module not found** | Import path incorrect | Check relative paths (use `../../` for pages) |
| **Hot reload not working** | Vite cache issue | Restart dev server with `Ctrl+C` then `npm run dev` |

### Debug Commands

**Check Node Version:**
```bash
node --version
```

**Check npm Version:**
```bash
npm --version
```

**List Installed Packages:**
```bash
npm list --depth=0
```

**Clear npm Cache:**
```bash
npm cache clean --force
```

**Reinstall Dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Check:**
```bash
npx tsc --noEmit
```

**Build and Preview:**
```bash
npm run build
npm run preview
```

### Browser Console Debugging

1. Open browser DevTools (`F12`)
2. Go to **Console** tab
3. Look for errors (red text)
4. Check **Network** tab for failed requests
5. Use `console.log()` in components for debugging

### Performance Issues

**Slow Page Load:**
- Check bundle size: `npm run build`
- Enable compression on server
- Use React.lazy() for code splitting

**Slow Hot Reload:**
- Exclude large folders in `vite.config.ts`
- Use `esbuild` for faster transpilation

---

## Appendix: Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit

# Lint (if configured)
npm run lint

# Format (if configured)
npm run format
```

---

## Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Development
VITE_API_URL=http://localhost:8000
VITE_POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
VITE_CHAIN_ID=80002
```

**Note:** Vite requires `VITE_` prefix for environment variables.

---

## Support

For issues or questions:

1. Check this guide first
2. Review error messages in browser console
3. Check terminal output for build errors
4. Contact the development team

---

**Document Control:**
- **Version:** 1.0
- **Created:** March 2, 2026
- **Author:** Aziz Da Silva - Lead Architect
- **Status:** Active

---

*UJAMAA DEFI PLATFORM - Tokenize African Real-World Assets*

