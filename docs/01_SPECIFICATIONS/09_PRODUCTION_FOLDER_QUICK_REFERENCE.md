# Production Folder Structure - Quick Reference

**Author:** Aziz Da Silva - Lead Architect
**For:** UJAMAA DeFi Platform Development Team
**Date:** March 19, 2026
**Version:** 1.0 (Production-Ready)

---

## Quick Start: Where to Create Files

### Adding a New Component

```bash
# Base component (Button, Card, Input)
src/components/common/NewComponent.tsx

# Dashboard component (charts, KPIs)
src/components/dashboard/NewComponent.tsx

# Pool component (pool cards, lists)
src/components/pools/NewComponent.tsx
```

### Adding a New Page

```bash
# Dashboard page
src/pages/dashboard/NewDashboard.tsx

# Feature page
src/pages/pools/NewPage.tsx

# Onboarding flow
src/pages/onboarding/NewFlow.tsx
```

### Adding a New Hook

```bash
src/hooks/useNewFeature.ts
```

### Adding a New Service

```bash
src/services/newService.ts
```

---

## Complete Structure (Condensed)

```
src/
├── components/          # UI components (reusable)
│   ├── common/         # Button, Card, Input, Badge
│   ├── layout/         # Header, Footer, Sidebar
│   ├── dashboard/      # KPICard, Charts
│   ├── pools/          # PoolCard, PoolList
│   └── compliance/     # KYCStatus, Badges
│
├── pages/              # Full pages (routes)
│   ├── home/           # Landing page
│   ├── dashboard/      # 6 dashboards (by role)
│   ├── pools/          # Marketplace, detail
│   ├── portfolio/      # Portfolio view
│   ├── onboarding/     # 3 onboarding flows
│   ├── originator/     # Originator features
│   ├── compliance/     # Compliance features
│   ├── regulator/      # Regulator features
│   ├── diaspora/       # Diaspora features
│   ├── mobile/         # Mobile money
│   └── documentation/  # Deep Dive, Investors Room
│
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── services/           # API clients
├── utils/              # Helper functions
├── types/              # TypeScript types
├── styles/             # CSS files
├── config/             # Config files
├── contracts/          # Contract ABIs
└── assets/             # Images, fonts, icons
```

---

## No MVP/MVP Prefixes

**❌ Don't Use:**
- `MVP/` folder
- `MVPComponent.tsx`
- `mock_feature.ts`
- `testnet_config.ts`

**✅ Use Instead:**
- `components/`
- `Component.tsx`
- `feature.ts` (with feature flags)
- `config.ts` (with environment variables)

---

## Environment-Based Features

Use environment variables, not folder names:

```typescript
// ✅ Good
if (process.env.VITE_FEATURE_DIASPORA === 'true') {
  <DiasporaDashboard />
}

// ❌ Bad
if (IS_MVP) {
  <MVPDashboard />
}
```

---

## File Naming Examples

| Purpose | ✅ Good | ❌ Bad |
|---------|---------|--------|
| Button component | `Button.tsx` | `MVPButton.tsx` |
| Pool card | `PoolCard.tsx` | `TestnetPoolCard.tsx` |
| KYC status | `KYCStatus.tsx` | `MockKYCStatus.tsx` |
| Dashboard | `InstitutionalDashboard.tsx` | `MVPDashboard.tsx` |
| Service | `poolService.ts` | `MVP_pool_service.ts` |
| Hook | `usePools.ts` | `useMVPPools.ts` |
| Config | `network.ts` | `testnet_config.ts` |

---

## Production Deployment

### Frontend

```bash
# Build for production
npm run build

# Output: dist/
# Deploy to: Vercel, Netlify, or AWS S3 + CloudFront
```

### Backend

```bash
# Deploy with Docker
docker build -t ujamaa-backend .
docker run -p 8000:8000 ujamaa-backend

# Or deploy to: Heroku, AWS ECS, GCP Cloud Run
```

### Contracts

```bash
# Deploy to Polygon mainnet
npx hardhat run scripts/deploy.ts --network polygon

# Verify on Polygonscan
npx hardhat verify --network polygon DEPLOYED_CONTRACT_ADDRESS
```

---

## Key Points

1. **No MVP prefixes** - Production-ready names only
2. **Role-based organization** - Easy to find by user type
3. **Environment configuration** - Features controlled by `.env`
4. **Clean separation** - Components, pages, services, utils
5. **Scalable** - Easy to add new features

---

**Full Documentation:** `docs/01_SPECIFICATIONS/07_PRODUCTION_FOLDER_STRUCTURE.md`

---

**END OF QUICK REFERENCE**
