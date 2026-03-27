# Ujamaa DeFi Platform - Frontend

**MVP Testnet Release** • Institutional DeFi for African Real-World Assets

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── MVP/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── MVPBanner.tsx    # Required testnet banner
│   │   │   ├── TestnetNotice.tsx # Testnet notice (4 variants)
│   │   │   ├── MockDataBadge.tsx # Mock data indicator
│   │   │   ├── Button.tsx       # Button component (5 variants)
│   │   │   ├── Badge.tsx        # Status badge (6 variants)
│   │   │   ├── Card.tsx         # Card container
│   │   │   ├── Input.tsx        # Form input
│   │   │   ├── StatsCard.tsx    # Statistics display
│   │   │   └── index.ts         # Component exports
│   │   ├── pages/
│   │   │   └── institutional/
│   │   │       ├── Dashboard.tsx       # Institutional dashboard
│   │   │       ├── PoolMarketplace.tsx # Pool browser
│   │   │       ├── DeepDive.tsx        # Technical docs (6 sections)
│   │   │       └── InvestorsRoom.tsx   # Document portal (22 docs)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API services
│   │   └── utils/             # Utility functions
│   ├── components/            # Shared components
│   ├── hooks/                 # Shared hooks
│   ├── lib/
│   │   └── utils.ts           # Utility functions
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   ├── config.ts              # App configuration
│   ├── index.css              # Global styles
│   ├── App.tsx                # Main app component
│   └── main.tsx               # Entry point
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary (Green)** | `#16A34A` | Main brand color, CTAs |
| **Secondary (Teal)** | `#0D9488` | Supporting elements |
| **Accent (Amber)** | `#F59E0B` | Highlights, warnings |
| **Success** | `#10B981` | Success states |
| **Warning** | `#F59E0B` | Warning states |
| **Error** | `#EF4444` | Error states |
| **Info** | `#3B82F6` | Information states |

### Typography

```css
/* Font Families */
--font-family-sans: 'Plus Jakarta Sans', 'Inter', system-ui
--font-family-heading: 'Plus Jakarta Sans', 'Poppins', system-ui
--font-family-mono: 'Fira Code', 'JetBrains Mono', monospace

/* Responsive Font Sizes */
h1: clamp(2.5rem, 5vw, 4.5rem)
h2: clamp(2rem, 4vw, 3.5rem)
h3: clamp(1.5rem, 3vw, 2rem)
```

### Shadows

```css
--shadow-soft: 0 2px 15px -3px rgba(0, 0, 0, 0.07)
--shadow-soft-lg: 0 10px 40px -10px rgba(0, 0, 0, 0.1)
--shadow-glow-primary: 0 0 20px rgba(22, 163, 74, 0.3)
```

### Animations

- `animate-float` — Vertical floating (6s)
- `animate-pulse-slow` — Slow pulse (4s)
- `animate-fadeIn` — Fade in + slide up (0.6s)
- `animate-slideInRight` — Slide from right (0.4s)
- `animate-scaleIn` — Scale in (0.3s)

---

## 🧩 Components

### MVP Disclaimer Components (Required on ALL pages)

```tsx
import { MVPBanner, TestnetNotice, MockDataBadge } from '@/MVP/components';

function Page() {
  return (
    <div>
      <MVPBanner text="🚀 MVP: Institutional Architecture - Testnet Release" />
      <TestnetNotice variant="badge" />
      <MockDataBadge label="MOCK DATA" />
    </div>
  );
}
```

### Button Component

```tsx
import { Button } from '@/MVP/components';

<Button variant="primary" size="lg">Invest Now</Button>
<Button variant="outline" isLoading>Loading</Button>
<Button variant="danger" size="sm">Delete</Button>
```

### StatsCard Component

```tsx
import { StatsCard } from '@/MVP/components';

<StatsCard
  icon={<WalletIcon />}
  label="Total Value"
  value="€5,000,000"
  trend={{ value: 2.5, direction: 'up' }}
  color="green"
/>
```

---

## 📄 Pages

### Deep Dive (`/deep-dive`)

Technical documentation with 6 sections:

1. **Architecture Overview** — System diagram, components, tech stack
2. **Smart Contracts** — Contract hierarchy, code examples
3. **Backend Services** — Service architecture, yield formulas
4. **API Reference** — Endpoints, request/response examples
5. **Security Model** — 4 security layers, blocked jurisdictions
6. **Performance** — Targets, optimization strategies

**Features:**
- Sticky navigation sidebar
- Smooth scroll between sections
- Code syntax highlighting
- Responsive design

### Investors Room (`/investors-room`)

Document portal with 22 documents across 6 categories:

| Category | Documents |
|----------|-----------|
| Onboarding | 5 docs |
| Asset Offerings | 3 docs |
| Ongoing Reporting | 3 docs |
| Legal & Compliance | 4 docs |
| Educational | 5 docs |
| Templates | 2 docs |

**Features:**
- Full-text search
- Category filtering
- Featured documents
- Document modal with details

### Institutional Dashboard (`/institutional/dashboard`)

Investor dashboard with:
- Portfolio summary stats
- Pool positions
- Recent activity feed
- Quick actions

### Pool Marketplace (`/institutional/pools`)

Browse and invest in pools:
- 5 pool families
- Search and filter
- Pool detail modal
- Investment limits display

---

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
# Network
VITE_NETWORK_NAME=polygon-amoy
VITE_CHAIN_ID=80002
VITE_RPC_URL=https://rpc-amoy.polygon.technology/
VITE_BLOCK_EXPLORER=https://amoy.polygonscan.com/

# API
VITE_API_URL=http://localhost:8000
VITE_API_VERSION=v2

# Mock Services
VITE_MOCK_BANK=true
VITE_MOCK_ESCROW=true
VITE_MOCK_GDIZ=true
VITE_MOCK_FIAT_RAMP=true

# Contract Addresses (set post-deployment)
VITE_CONTRACT_UPT_TOKEN=
VITE_CONTRACT_LIQUIDITY_POOL=
VITE_CONTRACT_MOCK_ESCROW=
VITE_CONTRACT_MOCK_FIAT_RAMP=
```

### App Configuration

```ts
import config from './config';

console.log(config.NETWORK.CHAIN_ID); // 80002
console.log(config.LIMITS.MIN_DEPOSIT); // 1000
console.log(config.DISCLAIMER.HEADER); // "🚀 MVP: Institutional Architecture..."
```

---

## 🪝 Custom Hooks

```tsx
import {
  usePools,
  usePool,
  usePortfolio,
  useInvestment,
  useJurisdictionCheck,
  useNotifications,
  useDarkMode,
  useLocalStorage,
} from '@/hooks';

// Fetch all pools
const { pools, loading, error } = usePools();

// Fetch single pool
const { pool } = usePool('POOL_INDUSTRIE');

// Fetch portfolio
const { portfolio } = usePortfolio('INVESTOR-001');

// Invest in pool
const { invest, loading } = useInvestment();
await invest('POOL_INDUSTRIE', 1000, 'INVESTOR-001');

// Check jurisdiction
const { checkJurisdiction } = useJurisdictionCheck();
const result = await checkJurisdiction('US');

// Notifications
const { success, error } = useNotifications();
success('Success!', 'Investment completed');
```

---

## 🛠️ Utilities

```ts
import {
  formatCurrency,
  formatTokenAmount,
  formatPercentage,
  formatDate,
  truncateMiddle,
  cn,
} from '@/lib/utils';

formatCurrency(1000000); // "€1,000,000.00"
formatTokenAmount(1000000000000000000n); // "1.00 EUROD"
formatPercentage(0.10); // "10.00%"
formatDate('2026-03-19'); // "Mar 19, 2026"
truncateMiddle('0x1234...5678'); // "0x1234...5678"
cn('btn', 'btn-primary'); // "btn btn-primary"
```

---

## 📊 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| First Contentful Paint (FCP) | < 1.5s | ✅ |
| Time to Interactive (TTI) | < 3.5s | ✅ |
| Lighthouse Score | > 90 | ✅ |
| Bundle Size (Initial JS) | < 150KB | ✅ |
| Bundle Size (Total) | < 350KB | ✅ |

---

## ♿ Accessibility

- ✅ WCAG 2.1 AA compliant
- ✅ Semantic HTML elements
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader friendly
- ✅ Color contrast compliance

---

## 🧪 Testing

```bash
# Run tests
npm run test

# Test with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

---

## 📦 Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run analyze
```

---

## 🚀 Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👥 Authors

- **Aziz Da Silva** — Lead Architect
- **Ujamaa DeFi Team**

---

## 🔗 Links

- [Website](https://ujamaa.defi)
- [Documentation](/docs)
- [Deep Dive](/deep-dive)
- [Investors Room](/investors-room)

---

**🚀 MVP TESTNET:** This is a testnet deployment. No real funds are handled.
