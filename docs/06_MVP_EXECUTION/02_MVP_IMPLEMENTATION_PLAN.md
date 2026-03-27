# MVP Implementation Plan

## Ujamaa DeFi Platform - Institutional Architecture Prototype

**Author:** Aziz Da Silva - Lead Architect

**IMPORTANT:** This Implementation Plan is derived from the master **SRS v2.0** document. All technical specifications, smart contract interfaces, and API endpoints MUST align with SRS v2.0. In case of any discrepancy, **SRS v2.0 takes precedence**.

**Source of Truth:**
1. `docs/01_SPECIFICATIONS/01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` (SRS v2.0 - 6,054 lines)
2. `docs/01_SPECIFICATIONS/04_DESIGN_SYSTEM_SPECIFICATION.md` (Design System - 2,000+ lines) ⭐ **UPDATED**
3. `docs/06_MVP_EXECUTION/04_MVP_MOCKING_AND_TESTNET_STRATEGY.md` (Mocking Strategy - 1,750+ lines)
4. `docs/06_MVP_EXECUTION/09_DEEP_DIVE_INVESTORS_ROOM.md` (Deep Dive & Investors Room - 300+ lines)

**MVP Relationship to SRS v2.0:**
- ✅ MVP = Subset of SRS v2.0 (testnet implementation)
- ✅ SRS v2.0 = Complete production specification
- ✅ All MVP features traceable to SRS v2.0 sections
- ✅ MVP mock services → Production services (per SRS v2.0 Section 4.3)
- ✅ **Design System** = Reusable, content-agnostic UI/UX blueprint (per Design System Spec)

**Author:** Aziz Da Silva - Lead Architect
**Version:** 6.0 (COMPREHENSIVE - All Role Workflows)
**Date:** March 19, 2026
**Timeline:** 12 weeks (with ALL role workflows)
**Budget:** $185K-$285K (with all role workflows)

**🆕 STATUS:** Version 6.0 approved with ALL role workflows (Institutional, Retail, Originator, Compliance, Admin, Regulator)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Guiding Principles](#2-guiding-principles)
3. [Phase 1: Project Structure Setup (Week 1, Days 1-2)](#3-phase-1-project-structure-setup)
4. [Phase 2: Smart Contracts (Week 1-3)](#4-phase-2-smart-contracts)
5. [Phase 3: Backend Services (Week 3-5)](#5-phase-3-backend-services)
6. [Phase 4: Frontend Implementation (Week 5-9)](#6-phase-4-frontend-implementation)
7. [Phase 5: Integration & Testing (Week 9-10)](#7-phase-5-integration--testing)
8. [Phase 6: Deployment & Demo (Week 10)](#8-phase-6-deployment--demo)
9. [Appendix A: MVP Directory Structure](#9-appendix-a-MVP-directory-structure)
10. [Appendix B: Configuration Reference](#10-appendix-b-configuration-reference)
11. [Appendix C: Mock Service Interfaces](#11-appendix-c-mock-service-interfaces)
12. [Appendix D: Deep Dive Technical Documentation](#12-appendix-d-deep-dive-technical-documentation)
13. [Appendix E: Investors Room Documentation Portal](#13-appendix-e-investors-room-documentation-portal)
14. [Appendix F: Design System Integration](#14-appendix-f-design-system-integration) ⭐ **NEW**
15. [Appendix G: Deep Dive & Investors Room Guide](#15-appendix-g-deep-dive--investors-room-guide) ⭐ **NEW**

---

## 1. Executive Summary

### 1.1 Purpose

This Implementation Plan provides a **step-by-step guide** for building MVP (Institutional Architecture Prototype) over **12 weeks** with **comprehensive role workflow coverage**. It covers:

- ✅ Smart contract development (uLPToken, LiquidityPool, Mock services)
- ✅ Backend services (Yield calculation, Pool manager, Mock bank/GDIZ)
- ✅ **Frontend implementation per MVP Frontend Specification v1.0** (Institutional dashboard, Pool marketplace, uLP operations)
- ✅ **Deep Dive** - Comprehensive technical documentation page
- ✅ **Investors Room** - Investor documentation portal with search
- ✅ **ALL ROLE WORKFLOWS** - Institutional, Retail, Originator, Compliance, Admin, Regulator ⭐ **NEW**
- ✅ Testing and deployment to Polygon Amoy testnet
- ✅ Mock service architecture with production swap capability

### 1.1.1 Design System & Frontend Integration

**UPDATED in v5.1:** This implementation plan now integrates with the comprehensive **Design System Specification** (`04_DESIGN_SYSTEM_SPECIFICATION.md`).

The Design System Specification provides:
- **Reusable Design Tokens** - Color palette, typography, spacing, shadows, animations (content-agnostic)
- **Component Library Patterns** - Button, Badge, Card, Input, DataTable, StatsCard with full API docs
- **Page Templates** - Landing, Dashboard, Detail Page, Multi-step Form layouts
- **Architecture Patterns** - Context hierarchy, state management, routing, domain integration
- **Web3 Integration Pattern** - Provider setup, contract hooks, wallet connection
- **Authentication Pattern** - Role-based access control (project-defined roles)
- **Build Configuration** - Vite, Tailwind, TypeScript configs with code splitting
- **Accessibility & Performance** - WCAG 2.1 checklist, optimization strategies

**Key Principle:** The Design System is **content-agnostic** - it defines HOW to build, not WHAT to build. Your project defines:
- User roles (Investor, Originator, Admin, etc.)
- Business logic (yield calculation, pool management, etc.)
- Domain-specific features (DeFi, NFT, DAO, etc.)

**All frontend development MUST follow the Design System Specification for UI/UX consistency.**

### 1.1.2 Deep Dive & Investors Room Integration

**NEW in v5.1:** Deep Dive and Investors Room are now **first-class features** with dedicated implementation tracking.

**Deep Dive** (`/deep-dive`):
- Comprehensive technical documentation page
- 6 sections: Architecture, Smart Contracts, Backend, API, Security, Performance
- Interactive diagrams and code examples
- Sticky navigation sidebar
- **Implementation:** `frontend/src/MVP/pages/institutional/DeepDive.tsx`
- **Reference:** `09_DEEP_DIVE_INVESTORS_ROOM.md` Section 1

**Investors Room** (`/investors-room`):
- Investor documentation portal with search
- 22 documents across 6 categories
- Featured documents, category filtering, full-text search
- Document modal with details and actions
- **Implementation:** `frontend/src/MVP/pages/institutional/InvestorsRoom.tsx`
- **Reference:** `09_DEEP_DIVE_INVESTORS_ROOM.md` Section 2

**Both features are P1 priority and MUST be implemented in Week 9.**

### 1.1.3 Mocking Strategy Integration

**NEW in v4.1:** This implementation plan now integrates with the **MVP Mocking and Testnet Strategy** (`04_MVP_MOCKING_AND_TESTNET_STRATEGY.md`).

The Mocking Strategy provides:
- **Mock Service Architecture** - Bank, GDIZ, escrow, fiat ramp simulations
- **Testnet Deployment Procedures** - Polygon Amoy deployment, configuration
- **Production Swap Methodology** - Step-by-step mock → production transition
- **Frontend Mock Components** - MVPBanner, TestnetNotice, MockDataBadge
- **Disclaimer Requirements** - Where and how to display testnet notices
- **Mock/Production Toggle** - Demo mode for presentations
- **Testing Strategy** - Mock service tests, frontend component tests

**All mock service development and testnet deployment MUST follow the Mocking Strategy.**

### 1.1.3 Document Relationship

```
┌─────────────────────────────────────────────────────────────┐
│              MVP IMPLEMENTATION PLAN v5.1                  │
│                     (This Document)                          │
│                                                              │
│  References and integrates:                                  │
│  ┌──────────────────────┐  ┌────────────────────────────┐  │
│  │ Design System Spec   │  │ Mocking Strategy v2.0      │  │
│  │ • UI/UX Design       │  │ • Mock Services            │  │
│  │ • Components         │  │ • Testnet Deployment       │  │
│  │ • Page Templates     │  │ • Production Swap          │  │
│  │ • Architecture       │  │ • Frontend Mock Components │  │
│  └──────────────────────┘  └────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────┐  ┌────────────────────────────┐  │
│  │ Deep Dive &          │  │ SRS v2.0                   │  │
│  │ Investors Room       │  │ • Production Baseline      │  │
│  │ • Tech Docs          │  │ • All Features             │  │
│  │ • Investor Portal    │  │ • Authoritative Ref        │  │
│  └──────────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Key Deliverables

#### Core Deliverables (Original)

| Deliverable | Description | Week | Priority |
|-------------|-------------|------|----------|
| **uLPToken Contract** | Yield-bearing ERC-3643 token | 2 | P0 |
| **LiquidityPool Contract** | Pool management with multiple financings | 2 | P0 |
| **MockEscrow Contract** | Simulated bank escrow accounts | 2 | P0 |
| **MockFiatRamp Contract** | Simulated fiat on/off ramp | 2 | P1 |
| **Mock Bank Service** | Backend bank simulation | 4 | P0 |
| **Mock GDIZ Service** | Backend GDIZ simulation | 4 | P1 |
| **Yield Calculator** | Real financial math | 4 | P0 |
| **Pool Manager API** | Pool operations REST API | 5 | P0 |
| **Design System** | Colors, typography, components (per Frontend Spec) | 6 | P0 |
| **Institutional Dashboard** | Frontend for investors (per Frontend Spec) | 7 | P0 |
| **Pool Marketplace** | Browse/filter pools (per Frontend Spec) | 7 | P0 |
| **Subscribe/Redeem Flow** | uLP operations (per Frontend Spec) | 8 | P0 |
| **Portfolio Page** | Position tracking (per Frontend Spec) | 8 | P0 |
| **Deep Dive** | Technical documentation page | 11 | P1 |
| **Investors Room** | Documentation portal with search | 11 | P1 |
| **Testnet Deployment** | Polygon Amoy deployment | 12 | P0 |

#### 🆕 Role Workflow Deliverables (ALL ROLES)

**P0 - Critical Role Workflows:**

| Deliverable | Description | Week | Priority |
|-------------|-------------|------|----------|
| **Institutional Investor Flow** | Complete onboarding → invest → monitor | 7-8 | P0 |
| **Retail Investor Flow** | Simplified UI, small amounts, education | 9 | P0 |
| **Asset Originator Flow** | Onboard → submit asset → track raise → repay | 8-9 | P0 |
| **Compliance Officer Flow** | KYC approval, accreditation, reporting | 9 | P0 |
| **Admin Compliance Tools** | User management, asset approval | 9-10 | P0 |

**P1 - Important Role Workflows:**

| Deliverable | Description | Week | Priority |
|-------------|-------------|------|----------|
| **Regulator View** | Read-only compliance dashboard | 10 | P1 |
| **Diaspora Investor** | Overseas KYC, dual-currency options | 10 | P1 |
| **Mobile Money Mock** | M-Pesa, MTN integration (mock) | 10 | P1 |
| **Guided Product Tour** | Interactive onboarding flow | 10 | P1 |

**P2 - Optional Enhancements:**

| Deliverable | Description | Week | Priority |
|-------------|-------------|------|----------|
| **Animated Yield Counter** | Real-time yield accrual visualization | 8 | P1 |
| **Pool Sunburst Chart** | Interactive diversification visualization | 7 | P1 |
| **Demo Mode Toggle** | Pre-filled demo accounts for presentations | 10 | P1 |
| **Visual Regression Testing** | Percy/Chromatic for UI testing | 11 | P1 |
| **Load Testing** | k6 load testing (100 concurrent users) | 11 | P1 |
| **Error Monitoring (Sentry)** | Production error tracking | 10 | P1 |
| **Before/After Slider** | Industrial impact comparison | 10 | P2 |
| **Live Testnet Ticker** | Real-time transaction ticker | 9 | P2 |
| **i18n Infrastructure** | Multi-language support (EN/FR/PT) | 10 | P2 |
| **Analytics Integration** | PostHog event tracking | 10 | P2 |

### 1.3 Success Criteria

#### Core Success Criteria (Original)

- ✅ All smart contracts deployed to Polygon Amoy
- ✅ End-to-end investment flow functional
- ✅ NAV calculation accurate (verified by tests)
- ✅ Mock services clearly labeled and swappable
- ✅ >90% test coverage
- ✅ Security review passes (0 critical issues)
- ✅ Investor demo ready
- ✅ **Frontend implements Design System per Frontend Specification**
- ✅ **WCAG 2.2 AA accessibility compliance**
- ✅ **Performance metrics met (<1.5s FCP, <3.5s TTI)**
- ✅ Deep Dive documentation complete and accessible
- ✅ Investors Room portal functional with search

#### 🆕 Enhancement Success Criteria (Option C - MAXIMAL)

**Security (P0):**
- ✅ Slither audit: 0 critical, 0 high findings
- ✅ npm/pip audit: 0 high vulnerabilities
- ✅ CSP, HSTS, X-Frame-Options headers configured
- ✅ Rate limiting: 100 req/min (public), 1000 req/hr (authenticated)
- ✅ DDoS protection configured (Cloudflare)
- ✅ Incident response runbook documented

**Performance (P0):**
- ✅ Lighthouse score: >90 (all categories)
- ✅ Bundle size: <150KB initial JS, <350KB total
- ✅ Images optimized: WebP/AVIF format, <300KB per page
- ✅ Code splitting: Route-based lazy loading implemented
- ✅ Service worker: Caching strategy implemented

**Wow Features (P1):**
- ✅ Animated Yield Counter: Real-time accrual visible
- ✅ Pool Sunburst Chart: Interactive, clickable segments
- ✅ Demo Mode: Pre-filled accounts, one-click reset
- ✅ Visual regression tests: All pages covered
- ✅ Load testing: 100 concurrent users, <500ms P95 response
- ✅ Sentry integration: Error tracking active, alerts configured

**Optional Features (P2 - If Time Permits):**
- ✅ Before/After Slider: Impact visualization
- ✅ Live Testnet Ticker: Real-time transactions
- ✅ i18n Infrastructure: EN/FR/PT ready
- ✅ Analytics: PostHog events tracked
- ✅ Guided Tour: 5-step interactive onboarding

### 1.4 Related Documents

| Document | Purpose | Location |
|----------|---------|----------|
| **SRS v2.0** | Production baseline | `docs/01_SPECIFICATIONS/01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` |
| **Design System Spec** | **Reusable UI/UX blueprint (content-agnostic)** | `docs/01_SPECIFICATIONS/04_DESIGN_SYSTEM_SPECIFICATION.md` ⭐ **NEW** |
| **MVP Specification** | Complete feature spec | `01_MVP_SPECIFICATION.md` |
| **Mocking Strategy** | Mock services & testnet | `04_MVP_MOCKING_AND_TESTNET_STRATEGY.md` |
| **Deep Dive & Investors Room** | **Implementation guide for both features** | `09_DEEP_DIVE_INVESTORS_ROOM.md` ⭐ **NEW** |
| **Algorithm Specs** | Computational algorithms | `docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md` |

---

## 2. Guiding Principles

### 2.1 Non-Breaking Changes

✅ **DO NOT** modify existing working contracts:
- `Ujamaa Asset Token (UAT).sol` (MVP-1)
- `IdentityRegistry.sol` (MVP-1)
- `ComplianceModule.sol` (MVP-1)
- `AssetProof.sol` (MVP-1)

✅ **DO NOT** break existing frontend pages:
- Landing page
- MVP-1 Dashboard
- Asset marketplace

✅ **DO** add new features in separate files/folders:
- Use `MVP/` prefix for all new code
- Keep MVP-1 and MVP code separate

✅ **DO** use feature flags for MVP mode:
```typescript
if (config.IS_MVP) {
  // Show MVP features
}
```

### 2.2 Clear Separation (Mock vs Production)

✅ **DO** keep mock services clearly separated:
```
services/
├── MVP/
│   ├── mock_bank.py          # Mock implementation
│   └── mock_gdiz.py
├── banking/
│   └── biic_bank_service.py  # Production (future)
└── industrial/
    └── gdiz_gateway.py       # Production (future)
```

✅ **DO** use dependency injection for easy swapping:
```python
# Factory pattern
def get_bank_service() -> IBankService:
    if settings.MVP_MODE and settings.MOCK_BANK:
        return MockBankService()
    else:
        return BIICBankService()
```

✅ **DO** label all MVP components:
- `MVPBanner.tsx`
- `TestnetNotice.tsx`
- `MOCK-ESCROW-xxx` account IDs
- `COMPLETED_MVP` status flags

✅ **DO** add `MVP_MODE` configuration flag:
```python
class Settings:
    MVP_MODE: bool = True
    MOCK_BANK: bool = True
```

### 2.3 Production Quality

✅ **DO** write tests for all new code:
- Smart contracts: >95% coverage
- Backend: >90% coverage
- Frontend: >85% coverage

✅ **DO** use TypeScript types for all interfaces:
```typescript
interface IBankService {
  createEscrowAccount(investorId: string): Promise<string>;
  // ...
}
```

✅ **DO** add comprehensive documentation:
- NatSpec for Solidity contracts
- Docstrings for Python functions
- JSDoc for TypeScript functions

✅ **DO** use linters consistently:
- ESLint + Prettier (TypeScript)
- Black + isort (Python)
- Solhint (Solidity)

### 2.4 Transparency

✅ **DO** add disclaimers on every MVP page:
```
🚀 MVP: Institutional Architecture - Testnet Release
This is a testnet deployment. No real funds are handled.
```

✅ **DO** never hide that this is testnet-only:
- Clear banners on all pages
- Testnet notice in footer
- Mock data clearly labeled

### 2.5 FX Risk Mitigation (Ondo EUROD (EUROD)/EURR Strategy) 🆕

**Primary Stablecoin:** Ondo EUROD (EUROD) (euro-backed, 1 Ondo EUROD (EUROD) = €1.00)

**Why Ondo EUROD (EUROD) (Not USDC/USDT)?**
- ✅ **EUR/FCFA Fixed Parity:** 1 EUR = 655.957 XOF (fixed since 1994, BCEAO guarantee)
- ✅ **Zero FX Risk:** Ondo EUROD (EUROD) maintains 1:1 parity with FCFA (no fluctuation)
- ✅ **Historical Stability:** EUR/FCFA rate unchanged for 30+ years
- ✅ **African Market Fit:** Ondo EUROD (EUROD) aligns with UEMOA monetary zone (8 countries, 160M people)

**Platform Risk Absorption:**
- **2% transaction fee margin** covers FX fluctuations
- Platform absorbs FX risk (no pass-through to investors)
- Investors receive Ondo EUROD (EUROD)-denominated returns (no FX exposure)

**Fee Structure (FX Risk Coverage):**

| Transaction | Fee | FX Risk Coverage |
|-------------|-----|------------------|
| Deposit (EUR → Ondo EUROD (EUROD)) | 0% | No FX risk (1:1 parity) |
| Investment (Ondo EUROD (EUROD) → FCFA) | 2% | Covers EUR/FCFA conversion |
| Repayment (FCFA → Ondo EUROD (EUROD)) | 2% | Covers FCFA/EUR conversion |
| Redemption (Ondo EUROD (EUROD) → EUR) | 0% | No FX risk (1:1 parity) |
| **Total FX Coverage** | **4% round-trip** | **Fully hedged** |

**Smart Contract Implementation:**

```solidity
// FX Risk Mitigation Constants
uint256 constant FX_FEE_BPS = 200;  // 2% fee for FX risk coverage

// Fee Collection
function invest(uint256 amount) external {
    uint256 fxFee = (amount * FX_FEE_BPS) / 10000;  // 2% fee
    uint256 netAmount = amount - fxFee;

    // Fee → treasury (FX risk buffer)
    Ondo EUROD (EUROD).transferFrom(msg.sender, treasury, fxFee);

    // Net amount → pool
    Ondo EUROD (EUROD).transferFrom(msg.sender, pool, netAmount);
}
```

**MVP Testnet Implementation:**
- Use test Ondo EUROD (EUROD) (mock stablecoin)
- Simulate 2% FX fee collection
- Track FX risk buffer in treasury
- Test EUR → Ondo EUROD (EUROD) → FCFA → Ondo EUROD (EUROD) → EUR flow

**Production Readiness:**
- Ondo Finance Ondo EUROD (EUROD) integration (mainnet)
- EURR partnership (African markets)
- Monthly FX exposure reporting
- Quarterly hedge adjustment

✅ **DO** use testnet only (Polygon Amoy):
- Chain ID: 80002
- RPC: `https://rpc-amoy.polygon.technology/`

✅ **DO** document all mock services:
- See `04_MVP_MOCKING_AND_TESTNET_STRATEGY.md`

---

## 3. Phase 1: Project Structure Setup

**Timeline:** Week 1, Days 1-2
**Owner:** Tech Lead
**Status:** 🔄 Not Started

### 3.1 Create Directory Structure

Create new folders **without modifying existing code**:

```
frontend/src/
├── MVP/                          # NEW - All MVP specific code
│   ├── components/                # MVP UI components
│   │   ├── MVPBanner.tsx
│   │   ├── TestnetNotice.tsx
│   │   ├── MockDataDisplay.tsx
│   │   ├── PoolCard.tsx
│   │   ├── YieldChart.tsx
│   │   └── index.ts
│   ├── pages/                     # MVP pages
│   │   ├── pools/
│   │   │   ├── PoolList.tsx
│   │   │   ├── PoolDetail.tsx
│   │   │   ├── PoolPerformance.tsx
│   │   │   └── PoolAllocation.tsx
│   │   ├── uLP/
│   │   │   ├── Deposit.tsx
│   │   │   ├── Redeem.tsx
│   │   │   └── MyHoldings.tsx
│   │   └── institutional/
│   │       ├── Dashboard.tsx
│   │       └── YieldStatement.tsx
│   ├── hooks/                     # MVP hooks
│   │   ├── useMVPMode.ts
│   │   ├── useMockBank.ts
│   │   ├── useuLPToken.ts
│   │   └── index.ts
│   ├── contexts/                  # MVP contexts
│   │   ├── MVPModeContext.tsx
│   │   └── index.ts
│   ├── utils/                     # MVP utilities
│   │   ├── mockData.ts
│   │   ├── MVPConfig.ts
│   │   ├── navCalculator.ts
│   │   └── index.ts
│   ├── services/                  # MVP API clients
│   │   ├── bankService.ts
│   │   ├── poolService.ts
│   │   └── index.ts
│   └── constants/                 # MVP constants
│       └── MVPAddresses.ts
│
├── contracts/                     # NEW - MVP contract ABIs
│   ├── uLPToken.json
│   ├── LiquidityPool.json
│   ├── MockEscrow.json
│   └── MockFiatRamp.json
│
└── [existing folders - UNTOUCHED]

backend/
├── services/
│   ├── MVP/                      # NEW - MVP services
│   │   ├── yield_calculation.py
│   │   ├── pool_manager.py
│   │   ├── mock_bank.py
│   │   ├── mock_gdiz.py
│   │   └── __init__.py
│   └── [existing - UNTOUCHED]
│
├── api/
│   ├── MVP/                      # NEW - MVP API routes
│   │   ├── pools.py
│   │   ├── uLP.py
│   │   ├── mock_bank.py
│   │   └── __init__.py
│   └── [existing - UNTOUCHED]
│
├── models/
│   ├── MVP/                      # NEW - MVP models
│   │   ├── pool.py
│   │   ├── uLP.py
│   │   └── __init__.py
│   └── [existing - UNTOUCHED]
│
├── config/
│   ├── MVP_config.py             # NEW - MVP configuration
│   └── [existing - UNTOUCHED]
│
└── [existing - UNTOUCHED]

contracts/
├── MVP/                          # NEW - MVP contracts
│   ├── uLPToken.sol
│   ├── LiquidityPool.sol
│   ├── MockEscrow.sol
│   ├── MockFiatRamp.sol
│   ├── interfaces/
│   │   ├── IBankService.sol
│   │   └── IFiatRamp.sol
│   └── scripts/
│       └── deploy_MVP.ts
│
├── tokens/                        # EXISTING - UNTOUCHED
│   └── Ujamaa Asset Token (UAT).sol
│
└── [existing - UNTOUCHED]
```

### 3.2 Configuration Files

**Frontend Configuration:** `frontend/src/MVP/utils/MVPConfig.ts`

```typescript
/**
 * MVP Mode Configuration
 *
 * IMPORTANT: This is a MVP/TESTNET ONLY configuration.
 * DO NOT use in production without proper legal/banking infrastructure.
 *
 * Reference: SRS v2.0 Section 4.3, 04_MVP_MOCKING_AND_TESTNET_STRATEGY.md
 */

export const MVP_CONFIG = {
  /** Is MVP mode enabled? */
  IS_MVP: true,

  /** Blockchain network (testnet only for MVP) */
  NETWORK: {
    name: 'Polygon Amoy',
    chainId: 80002,
    rpcUrl: 'https://rpc-amoy.polygon.technology/',
    blockExplorer: 'https://amoy.polygonscan.com/',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },

  /** Mock service flags */
  MOCK: {
    BANK: true,           // Use mock bank service
    ESCROW: true,         // Use mock escrow
    GDIZ: true,           // Use mock GDIZ integration
    YIELD: false,         // Real yield calculation (with mock data)
  },

  /** Contract addresses (set after deployment) */
  CONTRACTS: {
    uLPToken: '',         // Set after deployment
    LiquidityPool: '',    // Set after deployment
    MockEscrow: '',       // Set after deployment
    MockFiatRamp: '',     // Set after deployment
    Ondo EUROD (EUROD): '',             // Testnet Ondo EUROD (EUROD) address
  },

  /** MVP limits */
  LIMITS: {
    MAX_DEPOSIT: 1_000_000,      // 1M Ondo EUROD (EUROD) (testnet)
    MIN_DEPOSIT: 1_000,          // 1K Ondo EUROD (EUROD)
    MAX_REDEEM_PERCENT: 100,     // 100% can redeem
    DAILY_WITHDRAWAL: 500_000,   // 500K Ondo EUROD (EUROD) daily limit
  },

  /** Disclaimers */
  DISCLAIMERS: {
    HEADER: '🚀 MVP: Institutional Architecture - Testnet Release',
    FOOTER: 'MVP runs on Polygon Amoy testnet. No real funds are handled. Mainnet pending regulatory approval.',
    MODAL: `
      ## MVP Testnet Notice

      This is a **testnet-only** demonstration of the UJAMAA DeFi Platform
      institutional architecture.

      **What is MVP?**
      - Testnet deployment on Polygon Amoy
      - Mock bank services (no real money)
      - Simulated escrow accounts
      - Real yield calculation math

      **What is NOT MVP?**
      - Production-ready platform
      - Real bank integration
      - Regulatory approved
      - Mainnet deployed

      **For Production:** Requires Mauritius FSC license, BIIC (Banque Internationale pour l'Industrie et le Commerce)/MCB partnership
    `,
  },

  /** Feature flags */
  FEATURES: {
    POOL_MARKETPLACE: true,
    ULP_DEPOSIT: true,
    ULP_REDEEM: true,
    YIELD_STATEMENTS: true,
    INSTITUTIONAL_DASHBOARD: true,
  },
} as const;

export type MVPConfig = typeof MVP_CONFIG;
```

**Backend Configuration:** `backend/config/MVP_config.py`

```python
"""
MVP Mode Configuration

IMPORTANT: This is a MVP/TESTNET ONLY configuration.
DO NOT use in production without proper legal/banking infrastructure.

Reference: SRS v2.0 Section 4.3, 04_MVP_MOCKING_AND_TESTNET_STRATEGY.md
"""

from dataclasses import dataclass
from typing import Dict, Optional
from enum import Enum


class NetworkType(str, Enum):
    TESTNET = "polygon-amoy"
    MAINNET = "polygon-mainnet"  # NOT FOR MVP


@dataclass
class MVPConfig:
    """MVP configuration settings."""

    # MVP mode flag
    IS_MVP: bool = True

    # Network configuration
    NETWORK: NetworkType = NetworkType.TESTNET
    RPC_URL: str = "https://rpc-amoy.polygon.technology/"
    CHAIN_ID: int = 80002
    BLOCK_EXPLORER: str = "https://amoy.polygonscan.com/"

    # Mock service flags
    MOCK_BANK: bool = True
    MOCK_ESCROW: bool = True
    MOCK_GDIZ: bool = True
    MOCK_FIAT_RAMP: bool = True

    # Contract addresses (set after deployment)
    CONTRACT_ADDRESSES: Dict[str, str] = None

    # MVP limits (18 decimals)
    MAX_DEPOSIT: int = 1_000_000 * 10**18  # 1M Ondo EUROD (EUROD)
    MIN_DEPOSIT: int = 1_000 * 10**18      # 1K Ondo EUROD (EUROD)
    DAILY_WITHDRAWAL: int = 500_000 * 10**18  # 500K Ondo EUROD (EUROD)

    # Mock initial balance (for demo accounts)
    MOCK_INITIAL_BALANCE: int = 10_000_000 * 10**18  # 10M Ondo EUROD (EUROD)

    # Disclaimers
    DISCLAIMER_HEADER: str = "🚀 MVP: Institutional Architecture - Testnet Release"
    DISCLAIMER_FOOTER: str = (
        "MVP runs on Polygon Amoy testnet. No real funds are handled. "
        "Mainnet pending regulatory approval."
    )

    def __post_init__(self):
        if self.CONTRACT_ADDRESSES is None:
            self.CONTRACT_ADDRESSES = {}

    def is_testnet(self) -> bool:
        """Check if running on testnet."""
        return self.NETWORK == NetworkType.TESTNET

    def is_production(self) -> bool:
        """Check if running on production."""
        return not self.IS_MVP


# Global MVP config instance
MVP_config = MVPConfig()
```

### 3.3 Environment Variables

**Frontend:** `frontend/.env.MVP`

```env
# =============================================================================
# MVP Environment Configuration
# =============================================================================
# IMPORTANT: This is for TESTNET ONLY. Do not use in production.
# Reference: 04_MVP_MOCKING_AND_TESTNET_STRATEGY.md
# =============================================================================

# MVP Mode
VITE_MVP_MODE=true
VITE_NETWORK=testnet
VITE_RPC_URL=https://rpc-amoy.polygon.technology/
VITE_CHAIN_ID=80002
VITE_BLOCK_EXPLORER=https://amoy.polygonscan.com/

# Contract Addresses (UPDATE AFTER DEPLOYMENT)
VITE_ULP_TOKEN_ADDRESS=
VITE_LIQUIDITY_POOL_ADDRESS=
VITE_MOCK_ESCROW_ADDRESS=
VITE_MOCK_FIAT_RAMP_ADDRESS=
VITE_EURC_ADDRESS=

# MVP Limits
VITE_MAX_DEPOSIT=1000000
VITE_MIN_DEPOSIT=1000
VITE_DAILY_WITHDRAWAL=500000

# Feature Flags
VITE_MOCK_BANK=true
VITE_MOCK_ESCROW=true
VITE_MOCK_GDIZ=true
VITE_MOCK_FIAT_RAMP=true

# API Endpoints
VITE_API_BASE_URL=http://localhost:8000
VITE_API_V2_BASE_URL=http://localhost:8000/api/v2

# Wallet Configuration
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id

# Disclaimers
VITE_MVP_DISCLAIMER_ENABLED=true
```

**Backend:** `.env.MVP`

```env
# =============================================================================
# MVP Environment Configuration
# =============================================================================
# IMPORTANT: This is for TESTNET ONLY. Do not use in production.
# Reference: 04_MVP_MOCKING_AND_TESTNET_STRATEGY.md
# =============================================================================

# MVP Mode
MVP_MODE=true
NETWORK=testnet
RPC_URL=https://rpc-amoy.polygon.technology/
CHAIN_ID=80002

# Contract Addresses (UPDATE AFTER DEPLOYMENT)
ULP_TOKEN_ADDRESS=
LIQUIDITY_POOL_ADDRESS=
MOCK_ESCROW_ADDRESS=
MOCK_FIAT_RAMP_ADDRESS=
EURC_ADDRESS=

# Mock Service Configuration
MOCK_BANK_INITIAL_BALANCE=10000000000000000000000000  # 10M test Ondo EUROD (EUROD) (18 decimals)
MOCK_ESCROW_ENABLED=true
MOCK_GDIZ_ENABLED=true
MOCK_FIAT_RAMP_ENABLED=true

# Database (separate from production)
DATABASE_URL=postgresql://user:pass@localhost:5432/ujamaa_MVP

# Redis (separate from production)
REDIS_URL=redis://localhost:6379/1

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=true

# Logging
LOG_LEVEL=DEBUG
LOG_FILE=logs/MVP.log
```

### 3.4 Task Checklist

- [ ] Create `frontend/src/MVP/` directory structure
- [ ] Create `backend/services/MVP/` directory structure
- [ ] Create `contracts/MVP/` directory structure
- [ ] Create `frontend/.env.MVP` file
- [ ] Create `backend/.env.MVP` file
- [ ] Create `frontend/src/MVP/utils/MVPConfig.ts`
- [ ] Create `backend/config/MVP_config.py`
- [ ] Verify existing code is untouched
- [ ] Commit structure to git

---

## 4. Phase 2: Smart Contracts

**Timeline:** Week 1-3
**Owner:** Smart Contract Developer
**Status:** 🔄 Not Started

### 4.1 uLPToken.sol

**File:** `contracts/MVP/uLPToken.sol`
**SRS Reference:** Section 1.2, EPIC-10, User Story 10.1-10.2
**Priority:** P0 (Critical)

**Key Features:**
- Yield-bearing LP token (ERC-3643 compliant)
- Value-accrual model (balance constant, NAV increases)
- Testnet safety (`IS_PRODUCTION = false`)
- Deposit/redeem functionality
- NAV calculation on-chain

**Interface:**
```solidity
interface IULPToken {
    // Deposit Ondo EUROD (EUROD) → mint uLP
    function deposit(uint256 eurcAmount) external returns (uint256 ulpAmount);

    // Redeem uLP → receive Ondo EUROD (EUROD)
    function redeem(uint256 ulpAmount) external returns (uint256 eurcAmount);

    // Get current value in Ondo EUROD (EUROD)
    function getValue(address account) external view returns (uint256);

    // Get NAV per Ujamaa Pool Token (uLP)
    function getValuePerShare() external view returns (uint256);

    // Add yield to pool (admin only)
    function addYield(uint256 amount) external;

    // MVP safety flag
    function IS_MVP_TESTNET() external pure returns (bool);
}
```

**Implementation:** See `04_MVP_MOCKING_AND_TESTNET_STRATEGY.md` Appendix A for full code

**Tests:**
- [ ] Test deposit flow
- [ ] Test redemption flow
- [ ] Test NAV calculation
- [ ] Test yield accrual
- [ ] Test ERC-3643 compliance

### 4.2 LiquidityPool.sol

**File:** `contracts/MVP/LiquidityPool.sol`
**SRS Reference:** Section 5.12, EPIC-10, User Story 10.3
**Priority:** P0 (Critical)

**Key Features:**
- Pool management with **Pool Family support** (POOL_INDUSTRIE, POOL_AGRICULTURE, etc.)
- Multiple financings per pool
- Diversification tracking (by asset, by industrial, by geography)
- Repayment distribution
- Family-level risk limits
- **🆕 Jurisdiction Compliance (OFAC + UN + EU + FATF High-Risk)**

**Pool Families (per SRS v2.0 Section 1.2):**

| Pool Family | Asset Classes | Target Yield | Risk Profile | Lock-up Period |
|-------------|---------------|--------------|--------------|----------------|
| **POOL_INDUSTRIE** | Manufacturing, factories, production (GDIZ) | 10-12% | Medium | 365 days |
| **POOL_AGRICULTURE** | Coffee, cocoa, cotton, cashews, food crops | 12-15% | Medium-High | 180 days |
| **POOL_TRADE_FINANCE** | Invoice tokenization, receivables pools | 8-10% | Low-Medium | 90 days |
| **POOL_RENEWABLE_ENERGY** | Solar, wind, hydroelectric projects | 9-11% | Low-Medium | 730 days |
| **POOL_REAL_ESTATE** 🆕 | Commercial & residential property | 8-12% | Low-Medium | 1095 days (3 years) |

**POOL_REAL_ESTATE Asset Classes (7 types):**
- **Commercial Office:** Office buildings, CBD properties
- **Retail Space:** Shopping malls, retail outlets
- **Industrial/Warehouse:** Warehouses, logistics facilities
- **Residential Apartments:** Multi-unit residential buildings
- **Mixed-Use Development:** Combined retail + residential + office
- **Hospitality:** Hotels, resorts, serviced apartments
- **Land Bank:** Strategic land holdings (appreciation)

**Interface:**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LiquidityPool
 * @notice Manages liquidity pools with Pool Family support
 * @dev Supports POOL_INDUSTRIE, POOL_AGRICULTURE, POOL_TRADE_FINANCE, POOL_RENEWABLE_ENERGY
 */
interface ILiquidityPool {

    // Pool Family enum (per SRS v2.0)
    enum PoolFamily {
        INDUSTRIE,           // Manufacturing, GDIZ partners
        AGRICULTURE,         // Coffee, cocoa, cotton, cashews
        TRADE_FINANCE,       // Invoice tokenization, receivables
        RENEWABLE_ENERGY,    // Solar, wind, hydroelectric
        REAL_ESTATE          // 🆕 NEW: Commercial & residential property
    }

    // Pool configuration
    struct PoolConfig {
        PoolFamily family;
        uint256 maxExposurePerIndustrial; // 20% = 2000 (basis points)
        uint256 maxExposurePerAssetClass; // 40% = 4000 (basis points)
        uint256 minimumInvestment; // €100,000
        uint256 managementFeeBps; // 200 = 2% annual
        uint256 performanceFeeBps; // 2000 = 20% of yield
    }

    // Create new pool with family
    function createPool(
        string memory name,
        PoolFamily family
    ) external returns (uint256 poolId);

    // Deploy funds to industrial
    function deployToIndustrial(
        uint256 poolId,
        address industrial,
        uint256 amount,
        uint256 interestRate,
        uint256 duration
    ) external returns (uint256 financingId);

    // Record repayment
    function recordRepayment(
        uint256 financingId,
        uint256 amount
    ) external;

    // Get pool statistics
    function getPoolStats(uint256 poolId) external view returns (PoolStats memory);

    // Get pool family
    function getPoolFamily(uint256 poolId) external view returns (PoolFamily);

    // Get pool configuration
    function getPoolConfig(uint256 poolId) external view returns (PoolConfig memory);
}

// Pool statistics structure
struct PoolStats {
    string name;
    ILiquidityPool.PoolFamily family;
    uint256 totalValue;
    uint256 deployedValue;
    uint256 availableValue;
    uint256 financingCount;
    uint256 navPerShare;
}
```

**Implementation Notes:**
- ✅ Pool Family set at creation (cannot be changed)
- ✅ Family-specific risk limits enforced
- ✅ Cross-family investment allowed for institutional investors
- ✅ Separate NAV calculation per pool family
- ✅ Family-level reporting and analytics

**Tests:**
- [ ] Test pool creation with family (all 4 families)
- [ ] Test deployment to industrial
- [ ] Test repayment recording
- [ ] Test diversification limits (20% per industrial, 40% per asset class)
- [ ] Test pool statistics by family
- [ ] Test family-level risk limits
- [ ] Test cross-family investment

---

### 4.2.1 🆕 Jurisdiction Compliance (OFAC + UN + EU + FATF)

**SRS Reference:** Section 1.2, 1.3, 10 (Strictest Jurisdiction List)

**Requirement:** Implement the **strictest jurisdiction list** combining OFAC + UN + EU + FATF High-Risk jurisdictions.

**Blocked Jurisdictions (ISO 3166-1 alpha-2):**

| List | Jurisdictions | Count |
|------|---------------|-------|
| **OFAC** | KP, IR, SY, CU, MM, BY, RU (regions), VE, SD | 9 |
| **UN** | KP, IR | 2 |
| **EU** | KP, IR, SY, CU, BY, RU (regions) | 6 |
| **FATF High-Risk** | YE, ML, BF, NG (partial), PK (partial) | 5+ |
| **Total Unique** | **KP, IR, SY, CU, MM, BY, RU, VE, SD, YE, ML, BF** | **12** |

**Smart Contract Addition:**

```solidity
// Add to LiquidityPool.sol or separate ComplianceContract.sol

/**
 * @title JurisdictionCompliance
 * @notice Implements strictest jurisdiction list (OFAC + UN + EU + FATF)
 * @dev SRS v2.0 Section 1.2, 1.3, 10 compliance
 */
contract JurisdictionCompliance {

    // Strictest Jurisdiction List (OFAC + UN + EU + FATF High-Risk)
    mapping(string => bool) public blockedJurisdictions;

    // Event for audit trail
    event JurisdictionListUpdated();
    event JurisdictionChecked(address indexed investor, string jurisdiction, bool blocked);

    /**
     * @notice Initialize blocked jurisdictions list
     * @dev Called once during deployment
     */
    function initializeBlockedJurisdictions() external {
        // OFAC Sanctions
        blockedJurisdictions["KP"] = true;  // North Korea
        blockedJurisdictions["IR"] = true;  // Iran
        blockedJurisdictions["SY"] = true;  // Syria
        blockedJurisdictions["CU"] = true;  // Cuba
        blockedJurisdictions["MM"] = true;  // Myanmar
        blockedJurisdictions["BY"] = true;  // Belarus
        blockedJurisdictions["RU"] = true;  // Russia (certain regions)
        blockedJurisdictions["VE"] = true;  // Venezuela
        blockedJurisdictions["SD"] = true;  // Sudan

        // FATF High-Risk Jurisdictions
        blockedJurisdictions["YE"] = true;  // Yemen
        blockedJurisdictions["ML"] = true;  // Mali
        blockedJurisdictions["BF"] = true;  // Burkina Faso

        emit JurisdictionListUpdated();
    }

    /**
     * @notice Check if jurisdiction is blocked
     * @param jurisdiction ISO 3166-1 alpha-2 country code (e.g., "US", "NG")
     * @return true if blocked (OFAC + UN + EU + FATF), false if allowed
     */
    function isJurisdictionBlocked(string memory jurisdiction)
        external
        view
        returns (bool)
    {
        return blockedJurisdictions[jurisdiction];
    }

    /**
     * @notice Check and log jurisdiction check
     * @param investor Investor address
     * @param jurisdiction ISO 3166-1 alpha-2 code
     * @return true if blocked, false if allowed
     */
    function checkAndLogJurisdiction(address investor, string memory jurisdiction)
        external
        returns (bool)
    {
        bool blocked = blockedJurisdictions[jurisdiction];
        emit JurisdictionChecked(investor, jurisdiction, blocked);
        return blocked;
    }

    /**
     * @notice Get full list of blocked jurisdictions
     * @return Array of blocked ISO codes
     */
    function getBlockedJurisdictions() external view returns (string[] memory) {
        // Implementation returns all blocked codes
        // For gas efficiency, this is typically off-chain
    }
}
```

**Backend Service Addition:**

```python
# backend/services/compliance/jurisdiction_service.py
from typing import List, Set, Dict
from enum import Enum

class SanctionsList(Enum):
    """International sanctions lists."""
    OFAC = "OFAC"  # U.S. Treasury
    UN = "UN"      # United Nations
    EU = "EU"      # European Union
    FATF_HIGH_RISK = "FATF_HIGH_RISK"

class JurisdictionService:
    """
    Strictest Jurisdiction List Manager

    Combines OFAC + UN + EU + FATF High-Risk lists.
    Updated monthly from official sources.

    SRS v2.0 Compliance: Section 1.2, 1.3, 10
    """

    # Static blocked jurisdictions (updated monthly)
    BLOCKED_JURISDICTIONS: Set[str] = {
        # OFAC Sanctions (U.S. Treasury)
        "KP",  # North Korea
        "IR",  # Iran
        "SY",  # Syria
        "CU",  # Cuba
        "MM",  # Myanmar (Burma)
        "BY",  # Belarus
        "RU",  # Russia (certain regions - Crimea, Donetsk, Luhansk)
        "VE",  # Venezuela
        "SD",  # Sudan

        # FATF High-Risk Jurisdictions
        "YE",  # Yemen
        "ML",  # Mali
        "BF",  # Burkina Faso
        # Note: FATF updates quarterly - review and update
    }

    # Allowed jurisdictions for UJAMAA platform
    ALLOWED_JURISDICTIONS: Set[str] = {
        # African Markets (Primary)
        "NG",  # Nigeria
        "KE",  # Kenya
        "ZA",  # South Africa
        "GH",  # Ghana
        "MU",  # Mauritius
        "CI",  # Côte d'Ivoire
        "SN",  # Senegal
        "TG",  # Togo
        "BJ",  # Benin

        # International (Secondary)
        "GB",  # United Kingdom
        "FR",  # France
        "DE",  # Germany
        "AE",  # UAE (Dubai)
        "SG",  # Singapore
    }

    @classmethod
    def is_blocked(cls, jurisdiction_code: str) -> bool:
        """
        Check if jurisdiction is blocked.

        Args:
            jurisdiction_code: ISO 3166-1 alpha-2 code (e.g., "US", "NG")

        Returns:
            True if blocked (OFAC + UN + EU + FATF), False if allowed
        """
        return jurisdiction_code.upper() in cls.BLOCKED_JURISDICTIONS

    @classmethod
    def is_allowed(cls, jurisdiction_code: str) -> bool:
        """
        Check if jurisdiction is explicitly allowed.

        Args:
            jurisdiction_code: ISO 3166-1 alpha-2 code

        Returns:
            True if in allowed list, False otherwise
        """
        return jurisdiction_code.upper() in cls.ALLOWED_JURISDICTIONS

    @classmethod
    def get_blocked_list(cls) -> List[str]:
        """Get full list of blocked jurisdictions."""
        return sorted(list(cls.BLOCKED_JURISDICTIONS))

    @classmethod
    def get_allowed_list(cls) -> List[str]:
        """Get full list of allowed jurisdictions."""
        return sorted(list(cls.ALLOWED_JURISDICTIONS))

    @classmethod
    def check_investor_jurisdiction(
        cls,
        jurisdiction: str,
        investor_type: str
    ) -> Dict:
        """
        Check investor jurisdiction against strictest list.

        Args:
            jurisdiction: Investor's jurisdiction (ISO code)
            investor_type: "RETAIL" or "INSTITUTIONAL"

        Returns:
            dict with status, message, and details
        """
        jurisdiction_upper = jurisdiction.upper()

        # Check blocked list first (CRITICAL)
        if cls.is_blocked(jurisdiction_upper):
            return {
                "status": "BLOCKED",
                "message": f"Jurisdiction {jurisdiction} is blocked",
                "reason": "International sanctions compliance",
                "blocked_lists": ["OFAC", "UN", "EU", "FATF_HIGH_RISK"],
                "appealable": False,
                "details": (
                    "UJAMAA DEFI PLATFORM maintains the strictest jurisdiction list "
                    "(OFAC + UN + EU + FATF High-Risk). This is a regulatory requirement "
                    "we cannot override."
                )
            }

        # Check allowed list
        if cls.is_allowed(jurisdiction_upper):
            return {
                "status": "ALLOWED",
                "message": f"Jurisdiction {jurisdiction} is allowed",
                "investor_type": investor_type,
                "next_step": "Proceed with KYC/KYB verification"
            }

        # Unknown jurisdiction - requires manual review
        return {
            "status": "REVIEW_REQUIRED",
            "message": f"Jurisdiction {jurisdiction} requires manual review",
            "reason": "Not in allowed or blocked lists",
            "appealable": True,
            "next_step": "Compliance officer review required"
        }
```

**API Endpoint Addition:**

```python
# backend/api/compliance.py
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional

router = APIRouter()

class JurisdictionCheckRequest(BaseModel):
    jurisdiction: str = Field(..., description="ISO 3166-1 alpha-2 country code")
    investor_type: str = Field(..., description="RETAIL or INSTITUTIONAL")
    wallet_address: Optional[str] = Field(None, description="Investor wallet address")

class JurisdictionCheckResponse(BaseModel):
    status: str  # ALLOWED, BLOCKED, or REVIEW_REQUIRED
    message: str
    reason: Optional[str]
    blocked_lists: Optional[List[str]]
    appealable: bool
    next_step: str

@router.post(
    "/compliance/check-jurisdiction",
    response_model=JurisdictionCheckResponse,
    tags=["Compliance", "Jurisdiction"]
)
async def check_jurisdiction(request: JurisdictionCheckRequest):
    """
    Check jurisdiction against strictest list (OFAC + UN + EU + FATF).

    This is a **CRITICAL** compliance check. No transfers allowed from
    blocked jurisdictions.

    **SRS v2.0 Reference:** Section 1.2, 1.3, 10

    **Blocked Lists:**
    - OFAC (U.S. Treasury)
    - UN (United Nations)
    - EU (European Union)
    - FATF High-Risk Jurisdictions

    **Returns:**
    - `ALLOWED`: Jurisdiction is permitted
    - `BLOCKED`: Jurisdiction is sanctioned (no appeal)
    - `REVIEW_REQUIRED`: Unknown jurisdiction (manual review)
    """
    result = JurisdictionService.check_investor_jurisdiction(
        request.jurisdiction,
        request.investor_type
    )

    # Log compliance check for audit trail
    await log_compliance_check(
        wallet=request.wallet_address,
        jurisdiction=request.jurisdiction,
        result=result["status"],
        investor_type=request.investor_type
    )

    if result["status"] == "BLOCKED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": "JURISDICTION_BLOCKED",
                "message": result["message"],
                "reason": result["reason"],
                "blocked_lists": result["blocked_lists"],
                "appealable": result["appealable"],
                "details": result["details"]
            }
        )

    return JurisdictionCheckResponse(**result)

@router.get(
    "/compliance/blocked-jurisdictions",
    response_model=List[str],
    tags=["Compliance", "Jurisdiction"]
)
async def get_blocked_jurisdictions():
    """
    Get list of all blocked jurisdictions.

    Returns ISO 3166-1 alpha-2 codes for all blocked jurisdictions
    (OFAC + UN + EU + FATF High-Risk).
    """
    return JurisdictionService.get_blocked_list()

@router.get(
    "/compliance/allowed-jurisdictions",
    response_model=List[str],
    tags=["Compliance", "Jurisdiction"]
)
async def get_allowed_jurisdictions():
    """
    Get list of all allowed jurisdictions.

    Returns ISO 3166-1 alpha-2 codes for all explicitly allowed jurisdictions.
    """
    return JurisdictionService.get_allowed_list()
```

**Tests:**

```python
# tests/compliance/test_jurisdiction_service.py
import pytest
from backend.services.compliance.jurisdiction_service import JurisdictionService

class TestJurisdictionService:
    """Test jurisdiction compliance (OFAC + UN + EU + FATF)."""

    def test_blocked_jurisdictions_ofac(self):
        """Test OFAC sanctioned jurisdictions are blocked."""
        ofac_blocked = ["KP", "IR", "SY", "CU", "MM", "BY", "VE", "SD"]

        for jurisdiction in ofac_blocked:
            assert JurisdictionService.is_blocked(jurisdiction) is True
            assert JurisdictionService.is_blocked(jurisdiction.lower()) is True

    def test_blocked_jurisdictions_fatf(self):
        """Test FATF High-Risk jurisdictions are blocked."""
        fatf_blocked = ["YE", "ML", "BF"]

        for jurisdiction in fatf_blocked:
            assert JurisdictionService.is_blocked(jurisdiction) is True

    def test_allowed_jurisdictions_africa(self):
        """Test African markets are allowed."""
        african_allowed = ["NG", "KE", "ZA", "GH", "MU", "CI", "SN", "TG", "BJ"]

        for jurisdiction in african_allowed:
            assert JurisdictionService.is_allowed(jurisdiction) is True
            result = JurisdictionService.check_investor_jurisdiction(jurisdiction, "RETAIL")
            assert result["status"] == "ALLOWED"

    def test_allowed_jurisdictions_international(self):
        """Test international markets are allowed."""
        international_allowed = ["GB", "FR", "DE", "AE", "SG"]

        for jurisdiction in international_allowed:
            assert JurisdictionService.is_allowed(jurisdiction) is True

    def test_unknown_jurisdiction_requires_review(self):
        """Test unknown jurisdictions require manual review."""
        result = JurisdictionService.check_investor_jurisdiction("XX", "RETAIL")
        assert result["status"] == "REVIEW_REQUIRED"
        assert result["appealable"] is True

    def test_blocked_jurisdiction_no_appeal(self):
        """Test blocked jurisdictions cannot be appealed."""
        result = JurisdictionService.check_investor_jurisdiction("KP", "INSTITUTIONAL")
        assert result["status"] == "BLOCKED"
        assert result["appealable"] is False
        assert "OFAC" in result["blocked_lists"]

    def test_get_blocked_list(self):
        """Test getting full blocked list."""
        blocked = JurisdictionService.get_blocked_list()
        assert isinstance(blocked, list)
        assert len(blocked) > 0
        assert "KP" in blocked
        assert "IR" in blocked

    def test_get_allowed_list(self):
        """Test getting full allowed list."""
        allowed = JurisdictionService.get_allowed_list()
        assert isinstance(allowed, list)
        assert len(allowed) > 0
        assert "NG" in allowed
        assert "KE" in allowed
```

**Frontend UI Addition:**

```tsx
// frontend/src/MVP/pages/onboarding/InvestorOnboarding.tsx
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';

interface JurisdictionStatus {
  status: 'ALLOWED' | 'BLOCKED' | 'REVIEW_REQUIRED';
  message: string;
  reason?: string;
  blocked_lists?: string[];
  appealable: boolean;
  next_step: string;
}

function InvestorOnboarding() {
  const [jurisdiction, setJurisdiction] = useState('');
  const [jurisdictionStatus, setJurisdictionStatus] = useState<JurisdictionStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Country options (ISO 3166-1 alpha-2)
  const COUNTRY_OPTIONS = [
    { value: 'NG', label: 'Nigeria' },
    { value: 'KE', label: 'Kenya' },
    { value: 'ZA', label: 'South Africa' },
    { value: 'GH', label: 'Ghana' },
    { value: 'MU', label: 'Mauritius' },
    // ... more countries
  ];

  // Check jurisdiction on change
  useEffect(() => {
    if (jurisdiction) {
      checkJurisdiction(jurisdiction);
    }
  }, [jurisdiction]);

  const checkJurisdiction = async (jurisdictionCode: string) => {
    setIsChecking(true);
    setJurisdictionStatus(null);

    try {
      const response = await api.post<JurisdictionStatus>(
        '/compliance/check-jurisdiction',
        {
          jurisdiction: jurisdictionCode,
          investor_type: investorType
        }
      );

      setJurisdictionStatus(response.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        // Jurisdiction blocked
        setJurisdictionStatus(error.response.data);
      } else {
        // Other error
        setJurisdictionStatus({
          status: 'REVIEW_REQUIRED',
          message: 'Unable to verify jurisdiction. Please contact support.',
          appealable: true,
          next_step: 'Contact support@ujamaa-defi.com'
        });
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Jurisdiction Selection */}
      <Select
        label="Country of Residence *"
        value={jurisdiction}
        onChange={setJurisdiction}
        options={COUNTRY_OPTIONS}
        placeholder="Select your country"
        required
      />

      {/* Checking Status */}
      {isChecking && (
        <Alert variant="info">
          <AlertTitle>⏳ Checking Jurisdiction...</AlertTitle>
          <AlertDescription>
            Verifying {jurisdiction} against international sanctions lists.
          </AlertDescription>
        </Alert>
      )}

      {/* BLOCKED Status */}
      {jurisdictionStatus?.status === 'BLOCKED' && (
        <Alert variant="destructive" className="border-red-500 bg-red-50">
          <AlertTitle className="flex items-center">
            <span className="text-2xl mr-2">🚫</span>
            Jurisdiction Blocked
          </AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p className="font-semibold">
              Unfortunately, we cannot accept investors from {jurisdiction}.
            </p>
            <p className="text-sm">
              {jurisdictionStatus.message}
            </p>
            <div className="bg-red-100 p-3 rounded text-xs">
              <p className="font-semibold">Blocked by:</p>
              <div className="flex gap-2 mt-1">
                {jurisdictionStatus.blocked_lists?.map(list => (
                  <Badge key={list} variant="destructive">{list}</Badge>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {jurisdictionStatus.details ||
                'UJAMAA DEFI PLATFORM maintains the strictest jurisdiction list ' +
                '(OFAC + UN + EU + FATF High-Risk). This is a regulatory requirement ' +
                'we cannot override.'}
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* ALLOWED Status */}
      {jurisdictionStatus?.status === 'ALLOWED' && (
        <Alert variant="success" className="border-green-500 bg-green-50">
          <AlertTitle className="flex items-center">
            <span className="text-2xl mr-2">✅</span>
            Jurisdiction Allowed
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="font-semibold">
              Investors from {jurisdiction} are eligible to invest.
            </p>
            <p className="text-sm mt-1">
              {jurisdictionStatus.message}
            </p>
            <Badge variant="success" className="mt-2">
              ✓ {jurisdictionStatus.next_step}
            </Badge>
          </AlertDescription>
        </Alert>
      )}

      {/* REVIEW_REQUIRED Status */}
      {jurisdictionStatus?.status === 'REVIEW_REQUIRED' && (
        <Alert variant="warning" className="border-yellow-500 bg-yellow-50">
          <AlertTitle className="flex items-center">
            <span className="text-2xl mr-2">⏳</span>
            Manual Review Required
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="font-semibold">
              {jurisdiction} requires compliance review.
            </p>
            <p className="text-sm mt-1">
              {jurisdictionStatus.message}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Next step: {jurisdictionStatus.next_step}
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Compliance Notice */}
      <Alert variant="info" className="mt-6">
        <AlertTitle className="flex items-center">
          <span className="text-2xl mr-2">🛡️</span>
          Compliance Notice
        </AlertTitle>
        <AlertDescription className="mt-2">
          <p className="text-sm">
            UJAMAA DEFI PLATFORM maintains the <strong>strictest jurisdiction list</strong> in the industry:
          </p>
          <ul className="mt-2 list-disc list-inside text-sm space-y-1">
            <li><strong>OFAC</strong> Sanctions (U.S. Treasury Department)</li>
            <li><strong>UN</strong> Sanctions (United Nations Security Council)</li>
            <li><strong>EU</strong> Sanctions (European Union External Action Service)</li>
            <li><strong>FATF High-Risk</strong> Jurisdictions (Financial Action Task Force)</li>
          </ul>
          <p className="mt-3 text-xs text-gray-500">
            This ensures full regulatory compliance across all jurisdictions and protects
            all investors on the platform.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
```

**Frontend Tests:**

```tsx
// tests/e2e/jurisdiction-compliance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Jurisdiction Compliance (OFAC + UN + EU + FATF)', () => {

  test('should block North Korea (KP) - OFAC sanctioned', async ({ page }) => {
    await page.goto('/onboarding/investor');

    // Select North Korea
    await page.getByLabel('Country of Residence').selectOption('KP');

    // Wait for check to complete
    await page.waitForTimeout(2000);

    // Should show BLOCKED alert
    await expect(page.getByText('🚫 Jurisdiction Blocked')).toBeVisible();
    await expect(page.getByText('OFAC')).toBeVisible();
    await expect(page.getByText('UN')).toBeVisible();
    await expect(page.getByText('EU')).toBeVisible();
  });

  test('should block Iran (IR) - OFAC + UN sanctioned', async ({ page }) => {
    await page.goto('/onboarding/investor');

    await page.getByLabel('Country of Residence').selectOption('IR');
    await page.waitForTimeout(2000);

    await expect(page.getByText('🚫 Jurisdiction Blocked')).toBeVisible();
    await expect(page.getByText('OFAC')).toBeVisible();
    await expect(page.getByText('UN')).toBeVisible();
  });

  test('should block Syria (SY) - OFAC + EU sanctioned', async ({ page }) => {
    await page.goto('/onboarding/investor');

    await page.getByLabel('Country of Residence').selectOption('SY');
    await page.waitForTimeout(2000);

    await expect(page.getByText('🚫 Jurisdiction Blocked')).toBeVisible();
  });

  test('should block Yemen (YE) - FATF High-Risk', async ({ page }) => {
    await page.goto('/onboarding/investor');

    await page.getByLabel('Country of Residence').selectOption('YE');
    await page.waitForTimeout(2000);

    await expect(page.getByText('🚫 Jurisdiction Blocked')).toBeVisible();
    await expect(page.getByText('FATF')).toBeVisible();
  });

  test('should allow Nigeria (NG) - Primary market', async ({ page }) => {
    await page.goto('/onboarding/investor');

    await page.getByLabel('Country of Residence').selectOption('NG');
    await page.waitForTimeout(2000);

    await expect(page.getByText('✅ Jurisdiction Allowed')).toBeVisible();
    await expect(page.getByText('✓ Proceed with KYC')).toBeVisible();
  });

  test('should allow Kenya (KE) - Primary market', async ({ page }) => {
    await page.goto('/onboarding/investor');

    await page.getByLabel('Country of Residence').selectOption('KE');
    await page.waitForTimeout(2000);

    await expect(page.getByText('✅ Jurisdiction Allowed')).toBeVisible();
  });

  test('should show compliance notice with all 4 lists', async ({ page }) => {
    await page.goto('/onboarding/investor');

    // Scroll to compliance notice
    await page.waitForSelector('text=Compliance Notice');

    // Verify all 4 lists are mentioned
    await expect(page.getByText('OFAC')).toBeVisible();
    await expect(page.getByText('UN')).toBeVisible();
    await expect(page.getByText('EU')).toBeVisible();
    await expect(page.getByText('FATF')).toBeVisible();
  });
});
```

### 4.3 MockEscrow.sol

**File:** `contracts/MVP/MockEscrow.sol`
**SRS Reference:** Section 4.3
**Priority:** P0 (Critical)

**Key Features:**
- Simulated escrow accounts
- In-memory balances
- Transaction history
- Clear MVP labeling

**Error Codes:**

```solidity
enum MockEscrowError {
    NONE,                   // No error
    INSUFFICIENT_FUNDS,     // Account balance too low for transfer
    ACCOUNT_NOT_FOUND,      // Specified account does not exist
    TRANSFER_FAILED,        // Transfer execution failed
    INVALID_AMOUNT,         // Amount is zero or exceeds uint256 max
    UNAUTHORIZED,           // Caller not authorized for operation
    ACCOUNT_FROZEN,         // Account temporarily frozen
    DUPLICATE_ACCOUNT,      // Account already exists
    INVALID_ADDRESS,        // Zero address or invalid format
    DAILY_LIMIT_EXCEEDED    // Transfer exceeds daily withdrawal limit
}

// Error messages for revert
error InsufficientFunds();
error AccountNotFound();
error TransferFailed();
error InvalidAmount();
error Unauthorized();
error AccountFrozen();
error DuplicateAccount();
error InvalidAddress();
error DailyLimitExceeded();
```

**Interface:** See `04_MVP_MOCKING_AND_TESTNET_STRATEGY.md` Section 5.1

**Tests:**
- [ ] Test account creation
- [ ] Test wire transfer simulation
- [ ] Test balance queries
- [ ] Test transaction history
- [ ] Test error handling (all error codes)

### 4.4 MockFiatRamp.sol

**File:** `contracts/MVP/MockFiatRamp.sol`
**SRS Reference:** Section 4.3
**Priority:** P1 (High)

**Key Features:**
- Simulated fiat on/off ramp
- Mint test Ondo EUROD (EUROD)
- Burn test Ondo EUROD (EUROD)
- Clear disclaimers

**Tests:**
- [ ] Test on-ramp (EUR → Ondo EUROD (EUROD))
- [ ] Test off-ramp (Ondo EUROD (EUROD) → EUR)
- [ ] Test mint/burn

### 4.5 Deployment Script

**File:** `contracts/MVP/scripts/deploy_MVP.ts`
**Priority:** P0 (Critical)

**Steps:**
1. Deploy uLPToken
2. Initialize uLPToken
3. Deploy LiquidityPool
4. Initialize LiquidityPool
5. Deploy MockEscrow
6. Deploy MockFiatRamp
7. Save addresses to JSON
8. Verify contracts on Polygonscan

**Implementation:** See `04_MVP_MOCKING_AND_TESTNET_STRATEGY.md` Section 4.4

### 4.6 Task Checklist

- [ ] Write uLPToken.sol
- [ ] Write LiquidityPool.sol
- [ ] Write MockEscrow.sol
- [ ] Write MockFiatRamp.sol
- [ ] Write deployment script
- [ ] Write unit tests (>95% coverage)
- [ ] Run Slither analysis
- [ ] Deploy to Polygon Amoy
- [ ] Verify contracts on Polygonscan
- [ ] Save deployment addresses

---

## 7. Phase 5: Security Hardening (NEW - Option C)

**Timeline:** Week 9.5 (Days 1-3 of Week 10)
**Owner:** Security Lead + DevOps
**Status:** 🆕 NEW (Option C)

### 5.1 Security Audit Preparation

**Smart Contract Security:**
- [ ] Run Slither static analysis (0 critical, 0 high required)
- [ ] Run Mythril analysis (0 high severity required)
- [ ] Review access control (onlyRole modifiers)
- [ ] Verify reentrancy guards on all state-changing functions
- [ ] Check integer overflow/underflow (Solidity 0.8+ safe)
- [ ] Audit event emissions (all state changes logged)

**Backend Security:**
- [ ] Run npm audit (0 high vulnerabilities)
- [ ] Run pip-audit (0 high vulnerabilities)
- [ ] Review SQL injection prevention (parameterized queries)
- [ ] Verify XSS prevention (input sanitization)
- [ ] Check CSRF protection (tokens on forms)
- [ ] Review authentication (JWT expiry, refresh rotation)

### 5.2 Infrastructure Security

**Network Security:**
- [ ] Configure Cloudflare DDoS protection
- [ ] Set up WAF rules (OWASP Top 10)
- [ ] Configure rate limiting (Kong gateway)
- [ ] Enable AWS Shield (if using AWS)
- [ ] Set up security groups (least privilege)

**Security Headers:**
- [ ] Content-Security-Policy (CSP)
- [ ] Strict-Transport-Security (HSTS)
- [ ] X-Frame-Options (clickjacking protection)
- [ ] X-Content-Type-Options (MIME sniffing)
- [ ] X-XSS-Protection
- [ ] Referrer-Policy

### 5.3 Secrets Management

**Secrets Rotation:**
- [ ] Rotate all API keys
- [ ] Rotate database passwords
- [ ] Rotate JWT secrets
- [ ] Verify no secrets in code (Vault/Secrets Manager)
- [ ] Audit secret access logs

### 5.4 Incident Response

**Runbook Creation:**
- [ ] Security incident response procedure
- [ ] DDoS attack response procedure
- [ ] Data breach response procedure
- [ ] Smart contract vulnerability response
- [ ] Emergency pause procedure (smart contracts)
- [ ] Communication templates (users, regulators)

### 5.5 Penetration Testing

**External Pen Test:**
- [ ] Hire external security firm (CertiK/Trail of Bits)
- [ ] Scope: Smart contracts, backend APIs, frontend
- [ ] Remediate all critical/high findings
- [ ] Re-test to verify fixes
- [ ] Publish audit report (for investors)

---

## 8. Phase 6: Wow Features Implementation (NEW - Option C)

**Timeline:** Week 8-9 (parallel with core frontend)
**Owner:** Frontend Developer + UI/UX Designer
**Status:** 🆕 NEW (Option C)

### 6.1 Animated Yield Counter

**Implementation:**
```tsx
// LiveYieldCounter.tsx
import { useYieldAccrual } from '@/hooks/useYieldAccrual';

export const LiveYieldCounter: React.FC<{ poolId: string }> = ({ poolId }) => {
  const { currentValue, accruedYield, apy } = useYieldAccrual(poolId);

  return (
    <div className="yield-counter">
      <AnimatedNumber value={currentValue} prefix="€" />
      <div className="accrued-yield">
        +<AnimatedNumber value={accruedYield} /> today
      </div>
      <div className="apy-badge">{apy}% APY</div>
    </div>
  );
};
```

**Tasks:**
- [ ] Create `useYieldAccrual` hook (real-time calculation)
- [ ] Implement `AnimatedNumber` component (Framer Motion)
- [ ] Add to Pool Detail page
- [ ] Add to Dashboard portfolio cards
- [ ] Test performance (60 FPS animation)

**Timeline:** Week 8, Days 1-2
**Effort:** 6 hours

---

### 6.2 Pool Allocation Sunburst Chart

**Implementation:**
```tsx
// SunburstChart.tsx
import { ResponsiveSunburst } from '@nivo/sunburst';

export const PoolSunburst: React.FC<{ poolId: string }> = ({ poolId }) => {
  const { data } = usePoolAllocation(poolId);

  return (
    <ResponsiveSunburst
      data={data}
      interactive={true}
      onClick={(node) => showAllocationDetails(node)}
      colors={{ scheme: 'nivo' }}
      borderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
    />
  );
};
```

**Tasks:**
- [ ] Create `usePoolAllocation` hook
- [ ] Integrate @nivo/sunburst library
- [ ] Add click handlers for drill-down
- [ ] Add tooltips with allocation details
- [ ] Add to Pool Detail page
- [ ] Test accessibility (keyboard navigation)

**Timeline:** Week 7, Days 4-5
**Effort:** 8 hours

---

### 6.3 Demo Mode Toggle

**Implementation:**
```tsx
// DemoModeToggle.tsx
import { useDemoMode } from '@/hooks/useDemoMode';

export const DemoModeToggle: React.FC = () => {
  const { enabled, toggle, prefillData } = useDemoMode();

  return (
    <div className="demo-mode-admin">
      <Switch checked={enabled} onChange={toggle} />
      <Button onClick={prefillData}>Load Demo Data</Button>
      {enabled && <Banner text="🎭 Demo Mode Active" />}
    </div>
  );
};
```

**Tasks:**
- [ ] Create `useDemoMode` hook (localStorage)
- [ ] Create demo data fixtures (pools, transactions)
- [ ] Add admin toggle (hidden route: `/admin/demo`)
- [ ] Add demo mode banner
- [ ] Add one-click reset
- [ ] Document demo mode for investor presentations

**Timeline:** Week 9, Days 3-4
**Effort:** 8 hours

---

### 6.4 Before/After Comparison Slider

**Implementation:**
```tsx
// ComparisonSlider.tsx
import ReactCompareSlider from 'react-compare-slider';

export const ImpactSlider: React.FC<{ before: string; after: string }> = ({
  before,
  after,
}) => (
  <ReactCompareSlider
    itemOne={<img src={before} alt="Before financing" />}
    itemTwo={<img src={after} alt="After financing" />}
    caption="GDIZ Factory - 6 months after UJAMAA financing"
  />
);
```

**Tasks:**
- [ ] Install react-compare-slider
- [ ] Source before/after images from partners
- [ ] Add to Pool Detail (impact section)
- [ ] Add to Deep Dive documentation
- [ ] Test mobile responsiveness

**Timeline:** Week 9, Day 4
**Effort:** 4 hours

---

### 6.5 Live Testnet Ticker

**Implementation:**
```tsx
// TestnetTicker.tsx
import { useRecentTransactions } from '@/hooks/useRecentTransactions';

export const TestnetTicker: React.FC = () => {
  const { transactions } = useRecentTransactions();

  return (
    <div className="testnet-ticker">
      <Marquee speed={30}>
        {transactions.map((tx) => (
          <TransactionBadge key={tx.hash} tx={tx} />
        ))}
      </Marquee>
    </div>
  );
};
```

**Tasks:**
- [ ] Create `useRecentTransactions` hook (The Graph)
- [ ] Install react-fast-marquee
- [ ] Create TransactionBadge component
- [ ] Add to Dashboard footer
- [ ] Add to Deep Dive page
- [ ] Test with high transaction volume

**Timeline:** Week 8, Days 3-4
**Effort:** 6 hours

---

## 9. Phase 7: Testing & Quality (Enhanced - Option C)

**Timeline:** Week 10-11
**Owner:** QA Lead + All Developers
**Status:** 🆕 ENHANCED (Option C)

### 7.1 Visual Regression Testing (NEW)

**Setup:**
```bash
# Install Percy
npm install --save-dev @percy/cli @percy/playwright

# Run visual tests
percy exec -- playwright test
```

**Tasks:**
- [ ] Set up Percy account
- [ ] Configure Percy for Playwright
- [ ] Add visual tests for all pages
- [ ] Set up CI/CD integration
- [ ] Review visual diffs in PRs

**Timeline:** Week 10, Day 1
**Effort:** 6 hours

---

### 7.2 Load Testing (NEW)

**Setup:**
```bash
# Install k6
npm install --save-dev k6

# Run load test
k6 run --vus 100 --duration 30s load-test.js
```

**Load Test Script:**
```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% < 500ms
  },
};

export default function () {
  const res = http.get('https://testnet.ujamaa.defi/api/v2/pools');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
```

**Tasks:**
- [ ] Write load test scripts (pools, subscribe, portfolio)
- [ ] Run load tests (100 concurrent users)
- [ ] Identify bottlenecks
- [ ] Optimize slow endpoints
- [ ] Re-test to verify improvements

**Timeline:** Week 10, Day 2
**Effort:** 6 hours

---

### 7.3 Error Monitoring (NEW)

**Setup:**
```bash
# Install Sentry
npm install @sentry/react @sentry/tracing
```

**Configuration:**
```tsx
// sentry.config.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'testnet',
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
});
```

**Tasks:**
- [ ] Set up Sentry project
- [ ] Configure error tracking
- [ ] Add session replay
- [ ] Set up alerts (critical errors)
- [ ] Add to CI/CD (release tracking)

**Timeline:** Week 9, Day 5
**Effort:** 4 hours

---

## 10. Phase 8: Performance Optimization (NEW - Option C)

**Timeline:** Week 11 (Days 1-3)
**Owner:** Frontend Lead + DevOps
**Status:** 🆕 NEW (Option C)

### 8.1 Performance Budget

| Metric | Budget | Target |
|--------|--------|--------|
| Bundle Size (initial) | <150KB | <120KB |
| Bundle Size (total) | <350KB | <300KB |
| Images (per page) | <300KB | <200KB |
| Fonts | <80KB | <60KB |
| Third-party scripts | <30KB | <20KB |
| Lighthouse Score | >90 | >95 |

### 8.2 Optimization Tasks

**Code Splitting:**
- [ ] Route-based lazy loading (React.lazy)
- [ ] Component-level code splitting
- [ ] Dynamic imports for heavy libraries

**Image Optimization:**
- [ ] Convert to WebP/AVIF format
- [ ] Implement responsive images (srcset)
- [ ] Lazy loading (below fold)
- [ ] CDN delivery (CloudFront)

**Font Optimization:**
- [ ] Subset fonts (only used characters)
- [ ] Use font-display: swap
- [ ] Preload critical fonts

**Tree Shaking:**
- [ ] Remove unused dependencies
- [ ] Configure webpack/rollup tree shaking
- [ ] Audit bundle with webpack-bundle-analyzer

**Caching:**
- [ ] Service worker implementation
- [ ] HTTP caching headers
- [ ] CDN caching strategy
- [ ] API response caching (Redis)

### 8.3 Lighthouse Audit

**Targets:**
- Performance: >95
- Accessibility: >95
- Best Practices: >95
- SEO: >95
- PWA: Pass

**Tasks:**
- [ ] Run Lighthouse CI on all pages
- [ ] Fix all performance issues
- [ ] Verify PWA functionality
- [ ] Document performance metrics

**Timeline:** Week 11, Days 1-3
**Effort:** 16 hours

---

## 11. Phase 9: Optional Features (P2 - If Time Permits)

**Timeline:** Week 9-10 (parallel with other phases)
**Owner:** Frontend Developer
**Status:** 🆕 OPTIONAL (Option C)

### 9.1 i18n Infrastructure

**Setup:**
```bash
npm install react-i18next i18next
```

**Tasks:**
- [ ] Set up react-i18next
- [ ] Create translation files (EN/FR/PT)
- [ ] Add language switcher component
- [ ] Translate all UI text
- [ ] Test RTL languages (future Arabic)

**Timeline:** Week 9, Days 1-2
**Effort:** 12 hours

---

### 9.2 Analytics Integration

**Setup:**
```bash
npm install posthog-js
```

**Events to Track:**
- `wallet_connected`
- `pool_viewed`
- `subscribe_flow_started`
- `subscribe_flow_completed`
- `document_downloaded`
- `investors_room_search`

**Tasks:**
- [ ] Set up PostHog project
- [ ] Add tracking to all key events
- [ ] Create dashboards
- [ ] Set up funnels (subscribe flow)
- [ ] Document analytics for team

**Timeline:** Week 9, Day 5
**Effort:** 6 hours

---

### 9.3 Guided Product Tour

**Setup:**
```bash
npm install react-joyride
```

**Tour Steps:**
1. Welcome & platform overview
2. Dashboard walkthrough
3. Pool marketplace demo
4. Subscribe flow simulation
5. Portfolio tracking demo

**Tasks:**
- [ ] Install react-joyride
- [ ] Create tour steps
- [ ] Add skip/complete handlers
- [ ] Store tour completion (localStorage)
- [ ] Add "Show Tour Again" option

**Timeline:** Week 9, Days 4-5
**Effort:** 8 hours

---

## 12. Phase 10: Integration & Testing (Enhanced)

**Timeline:** Week 10-11 (Enhanced from original Week 9-10)
**Owner:** QA Lead + All Developers
**Status:** 🔄 UPDATED (Option C)

### 10.1 Testing Pyramid (Enhanced)

```
        ┌─────────────┐
        │   E2E       │  Playwright (20 tests)
        ├─────────────┤
        │ Integration │  API + Web3 (50 tests)
        ├─────────────┤
        │   Unit      │  Jest + Pytest (500+ tests)
        └─────────────┘
```

**Tasks:**
- [ ] Unit tests (>90% coverage)
- [ ] Integration tests (API + Web3)
- [ ] E2E tests (Playwright, 20 critical flows)
- [ ] Visual regression tests (Percy)
- [ ] Load tests (k6, 100 concurrent users)
- [ ] Security tests (Slither, npm audit)

---

## 13. Phase 11: Deployment & Demo (Enhanced)

**Timeline:** Week 11.5 (Enhanced from original Week 10)
**Owner:** DevOps Lead + All Team
**Status:** 🔄 UPDATED (Option C)

### 11.1 Testnet Deployment

**Deployment Checklist:**
- [ ] Smart contracts deployed to Polygon Amoy
- [ ] Backend deployed (AWS/GCP)
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Database migrated (PostgreSQL)
- [ ] Redis cache configured
- [ ] CDN configured (CloudFront)
- [ ] Monitoring active (Prometheus + Grafana)
- [ ] Error tracking active (Sentry)
- [ ] Analytics active (PostHog)
- [ ] Security headers configured
- [ ] DDoS protection active
- [ ] Demo mode ready for presentations

### 11.2 Demo Preparation

**Demo Accounts:**
- [ ] Create 3 demo investor accounts
- [ ] Pre-fill with mock portfolios
- [ ] Create demo pool (100% subscribed)
- [ ] Create demo pool (50% subscribed)
- [ ] Create demo pool (0% subscribed)
- [ ] Test all demo flows

**Presentation Mode:**
- [ ] Create presentation script
- [ ] Test demo mode toggle
- [ ] Prepare Q&A document
- [ ] Record demo video (backup)

---

## 14. Updated Timeline (Option C)

| Week | Phase | Key Deliverables |
|------|-------|------------------|
| **Week 1-2** | Smart Contracts | uLPToken, LiquidityPool, Mock contracts |
| **Week 3-4** | Backend Services | Mock Bank, Mock GDIZ, Yield Calculator |
| **Week 5-6** | Frontend Core | Design System, Base Components, Layout |
| **Week 7** | Frontend Pages | Dashboard, Pool Marketplace, Pool Detail |
| **Week 8** | Frontend Flows + Wow | Subscribe Flow, Portfolio, Yield Counter, Ticker |
| **Week 9** | Documentation + P2 | Deep Dive, Investors Room, i18n, Analytics, Tour |
| **Week 9.5** | 🆕 Security Hardening | Audit prep, Pen test, Incident response |
| **Week 10** | Testing | Unit, Integration, E2E, Visual, Load |
| **Week 11** | 🆕 Performance | Code splitting, Optimization, Lighthouse |
| **Week 11.5** | Deployment | Testnet launch, Demo ready |

---

## 15. Updated Budget (Option C)

| Category | Original (v4.4) | Enhanced (v5.0) | Delta |
|----------|-----------------|-----------------|-------|
| **Smart Contracts** | $40K-$60K | $40K-$60K | - |
| **Backend** | $30K-$45K | $30K-$45K | - |
| **Frontend** | $50K-$75K | $60K-$85K | +$10K |
| **Security Audit** | $10K-$15K | $15K-$20K | +$5K |
| **Testing** | $10K-$15K | $15K-$20K | +$5K |
| **DevOps** | $10K-$15K | $10K-$15K | - |
| **Documentation** | $5K-$10K | $5K-$10K | - |
| **Contingency (15%)** | $15K-$20K | $20K-$30K | +$5K-$10K |
| **TOTAL** | **$150K-$240K** | **$170K-$270K** | **+$20K-$30K** |

---

## 16. Document Control (Updated)

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 17, 2026 | Aziz Da Silva | Initial MVP implementation plan |
| 2.0 | March 17, 2026 | Aziz Da Silva | Updated with mocking strategy, enhanced phases |
| 3.0 | March 17, 2026 | Aziz Da Silva | Added Deep Dive + Investors Room |
| 4.0 | March 17, 2026 | Aziz Da Silva | Integrated Frontend Specification v1.0 |
| 4.1 | March 17, 2026 | Aziz Da Silva | Integrated Mocking Strategy v2.0 |
| 4.2 | March 17, 2026 | Aziz Da Silva | Added Wallet Integration (Frontend Spec Section 5.7) |
| 4.3 | March 17, 2026 | Aziz Da Silva | Web3 Architecture Guide compliance verified |
| 4.4 | March 17, 2026 | Aziz Da Silva | Added Proof of Reserve (Frontend Spec Section 5.8) |
| **5.0** | **March 18, 2026** | **Aziz Da Silva** | **🆕 OPTION C APPROVED: All 13 enhancements (P0+P1+P2)** |

### Changes in v5.0:

**New Phases:**
- Phase 5: Security Hardening (P0)
- Phase 6: Wow Features (P1)
- Phase 7: Enhanced Testing (P1)
- Phase 8: Performance Optimization (P0)
- Phase 9: Optional Features (P2)

**New Deliverables (13 total):**
- P0: Security Hardening, Performance Optimization
- P1: Animated Yield Counter, Sunburst Chart, Demo Mode, Visual Testing, Load Testing, Sentry
- P2: Before/After Slider, Live Ticker, i18n, Analytics, Guided Tour

**Timeline Impact:** 10 weeks → 11.5 weeks (+1.5 weeks)
**Budget Impact:** $150K-$240K → $170K-$270K (+$20K-$30K)

**Result:** GOOD → **LEGENDARY MVP**

---

**Approval Status:** ✅ **APPROVED (Option C - MAXIMAL)**

**Next Step:** Begin Week 1, Day 1 tasks (Project Structure Setup)

---

**Related Documents:**

---

## 6. Phase 4: Frontend Implementation (Per Frontend Specification v1.0)

**Timeline:** Week 5-9
**Owner:** Frontend Developer + UI/UX Designer
**Status:** 🔄 Not Started

### 5.1 Mock Bank Service

**File:** `backend/services/MVP/mock_bank.py`
**SRS Reference:** Section 4.3
**Priority:** P0 (Critical)

**Purpose:** Simulates bank operations for MVP

**Key Functions:**
```python
class MockBankService:
    def create_escrow_account(self, investor_id: str) -> str
    def initiate_wire_transfer(self, from_account: str, to_account: str, amount: int) -> str
    def get_balance(self, account_id: str) -> int
    def get_transactions(self, account_id: str) -> List[dict]
    def get_account_details(self, account_id: str) -> dict
```

**Implementation:** See `04_MVP_MOCKING_AND_TESTNET_STRATEGY.md` Section 5.3

**Tests:**
- [ ] Test account creation
- [ ] Test wire transfers
- [ ] Test balance queries
- [ ] Test transaction history

### 5.2 Mock GDIZ Service

**File:** `backend/services/MVP/mock_gdiz.py`
**SRS Reference:** Section 5.3
**Priority:** P1 (High)

**Purpose:** Simulates GDIZ industrial gateway

**Key Functions:**
```python
class MockGDIZService:
    def get_industrial_list(self) -> List[dict]
    def get_industrial_details(self, industrial_id: str) -> dict
    def simulate_production_data(self, industrial_id: str) -> dict
    def simulate_repayment(self, financing_id: str, principal: int, rate: float, days: int) -> dict
```

**Implementation:** See `04_MVP_MOCKING_AND_TESTNET_STRATEGY.md` Section 5.4

### 5.3 Yield Calculation Service

**File:** `backend/services/MVP/yield_calculation.py`
**SRS Reference:** ALG-10-04-01
**Priority:** P0 (Critical)

**Purpose:** Real financial math for yield accrual

**Key Functions:**
```python
class YieldCalculator:
    def calculate_nav_per_share(self, pool_value: int, total_shares: int) -> int
    def calculate_yield_accrual(self, principal: int, rate: float, days: int) -> int
    def calculate_redemption_amount(self, ulp_amount: int, nav_per_share: int) -> int
    def generate_yield_statement(self, investor_id: str) -> dict
```

**Implementation:** See `docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md` Section 5

**Tests:**
- [ ] Test NAV calculation
- [ ] Test yield accrual math
- [ ] Test redemption calculation
- [ ] Verify against manual calculations

### 5.4 Pool Manager API

**File:** `backend/api/MVP/pools.py`
**SRS Reference:** EPIC-10
**Priority:** P0 (Critical)

**Endpoints:**
```python
@router.post("/pools/", response_model=PoolResponse)
async def create_pool(pool: PoolCreate)

@router.get("/pools/", response_model=List[PoolResponse])
async def list_pools()

@router.get("/pools/{pool_id}", response_model=PoolDetail)
async def get_pool(pool_id: UUID)

@router.post("/pools/{pool_id}/deploy")
async def deploy_to_industrial(pool_id: UUID, deployment: DeploymentCreate)

@router.get("/pools/{pool_id}/stats")
async def get_pool_stats(pool_id: UUID)
```

**Tests:**
- [ ] Test all endpoints
- [ ] Test authentication
- [ ] Test input validation
- [ ] Test error handling

### 5.5 Task Checklist

- [ ] Write mock_bank.py
- [ ] Write mock_gdiz.py
- [ ] Write yield_calculation.py
- [ ] Write pools.py API
- [ ] Write uLP.py API
- [ ] Write unit tests (>90% coverage)
- [ ] Write integration tests
- [ ] Document API (OpenAPI)

---

## 6. Phase 4: Frontend (Per Frontend Specification v1.0)

**Timeline:** Week 5-9
**Owner:** Frontend Developer + UI/UX Designer
**Status:** 🔄 Not Started

---

### ⭐ IMPORTANT: Frontend Specification Reference

**All frontend development MUST follow the comprehensive MVP Frontend Specification:**

📄 **Document:** `docs/06_MVP_EXECUTION/05_MVP_FRONTEND_SPECIFICATION.md`
📊 **Size:** 1,400+ lines
📅 **Version:** 1.0 (March 17, 2026)

The Frontend Specification provides complete guidance for:

#### Design System (Section 3)
- **Color Palette** - Primary (navy), Semantic (success/warning/danger), Neutral (grays)
- **Typography** - Inter font, 8-tier scale
- **Spacing** - 8px grid system
- **Border Radius** - 6 levels
- **Shadows** - 5-level elevation system
- **Icons** - Lucide Icons

#### Technology Stack (Section 4)
| Layer | Technology | Version |
|-------|------------|---------|
| Framework | React | 19.x |
| Language | TypeScript | 6.0+ |
| Build Tool | Vite | 7.x |
| Styling | Tailwind CSS | 4.x |
| UI Primitives | Radix UI | Latest |
| Charts | Recharts | 2.x |
| Animations | Framer Motion | 10.x |
| State (Server) | TanStack Query | 5.x |
| State (Client) | Zustand | 4.x |
| Forms | React Hook Form | 7.x |
| Wallet | Wagmi | Latest |
| Web3 | Viem | Latest |

#### Page Specifications (Section 5)
| Page | Route | Priority | Week |
|------|-------|----------|------|
| **Landing Page** | `/` | **P0** | **5** |
| Dashboard Overview | `/dashboard` | P0 | 6 |
| Pool Marketplace | `/pools` | P0 | 7 |
| Pool Detail | `/pools/:id` | P0 | 7 |
| Subscribe Flow | `/pools/:id/subscribe` | P0 | 8 |
| Portfolio | `/portfolio` | P0 | 8 |
| Compliance | `/compliance` | P0 | 8 |
| Deep Dive | `/deep-dive` | P1 | 9 |
| Investors Room | `/investors-room` | P1 | 9 |

#### Component Library (Section 6)
- **Base Components:** Button, Card, Input, Modal, Badge
- **Complex Components:** KPICard, PoolCard, PortfolioPieChart, YieldLineChart
- **Layout Components:** Header, Sidebar, Footer, DashboardLayout

#### Accessibility Requirements (Section 8)
- WCAG 2.2 AA Compliance
- Color contrast: 4.5:1 minimum
- Keyboard navigation: Full Tab support
- Touch targets: 48x48px minimum

#### Performance Requirements (Section 9)
| Metric | Target |
|--------|--------|
| First Contentful Paint | <1.5s |
| Time to Interactive | <3.5s |
| API Response Time (P95) | <500ms |
| Bundle Size (initial) | <200KB JS |

---

### ⭐ 2026 DESIGN TRENDS INTEGRATION - WORLD-CLASS FINTECH UX

**Updated:** March 19, 2026
**Priority:** P0 (Critical for investor confidence)
**Reference:** Industry research from G & Co, Digidop, Gezar (March 2026)

#### Design Philosophy 2026

**Core Principle:** *"More human, clearer, more credible"*

| Pillar | Implementation |
|--------|----------------|
| **Humanization** | Real team photos, founder videos, conversational tone |
| **Transparency** | Clear fee breakdowns, explicit information, no hidden details |
| **Reassurance** | Visual coherence, credibility markers, professional art direction |
| **Security** | Visible compliance badges, AMF/ACPR-style indicators |
| **Interactivity** | Action-driven experiences, investment simulators |
| **Differentiation** | Breaking institutional molds while maintaining trust |

---

#### 🎨 Visual Design Trends 2026

**1. Liquid Glass (Advanced Glassmorphism)**
```css
/* Frosted glass effect with layered depth */
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* For dark mode */
.dark .glass-card {
  background: rgba(17, 24, 39, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

**Best for:** Pricing cards, hero sections, dashboard widgets, modals

**2. Aurora UI (Animated Gradient Meshes)**
```css
/* Animated gradient background */
.aurora-bg {
  position: relative;
  background: linear-gradient(
    125deg,
    #0f172a 0%,
    #1e293b 25%,
    #0f172a 50%,
    #1e3a5f 75%,
    #0f172a 100%
  );
  background-size: 400% 400%;
  animation: aurora 15s ease infinite;
}

@keyframes aurora {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Animated gradient orbs */
.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s infinite;
}
```

**Best for:** Hero sections, landing pages, SaaS product pages
**Tip:** Limit to 2-3 animated orbs; test performance on mobile

**3. Bento Grid Layout**
```css
/* Japanese lunch box-style grid */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, minmax(150px, auto));
  gap: 1.5rem;
}

.bento-item {
  border-radius: 16px;
  overflow: hidden;
}

/* Varying sizes for hierarchy */
.bento-item.large {
  grid-column: span 2;
  grid-row: span 2;
}

.bento-item.wide {
  grid-column: span 2;
}

.bento-item.tall {
  grid-row: span 2;
}
```

**Best for:** Feature sections, service overviews, product categories

**4. Claymorphism (3D Clay-Like Elements)**
```css
/* Playful 3D clay effect */
.clay-card {
  border-radius: 24px;
  background: linear-gradient(
    145deg,
    #ffffff 0%,
    #f0f4ff 100%
  );
  box-shadow:
    8px 8px 16px rgba(166, 180, 255, 0.3),
    -8px -8px 16px rgba(255, 255, 255, 0.8),
    inset 4px 4px 8px rgba(255, 255, 255, 0.5),
    inset -4px -4px 8px rgba(166, 180, 255, 0.2);
}
```

**Best for:** Feature showcases, onboarding steps, CTA cards

**5. Kinetic Typography**
```css
/* Animated text that responds to interaction */
.kinetic-text {
  display: inline-block;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.kinetic-text:hover {
  transform: translateY(-2px) scale(1.02);
  background: linear-gradient(90deg, #16A34A, #0D9488);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

**Best for:** Hero headlines, key value propositions, CTAs

---

#### 🌈 Color Palette 2026 (Enhanced)

**Primary Colors (Trust & Stability):**
```css
--primary-50: #eff6ff;    /* Lightest blue */
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;   /* Primary brand */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;   /* Darkest blue */
```

**Semantic Colors (Clear Communication):**
```css
/* Success - Growth, Positive */
--success: #10b981;
--success-light: #d1fae5;
--success-dark: #059669;

/* Warning - Caution, Pending */
--warning: #f59e0b;
--warning-light: #fef3c7;
--warning-dark: #d97706;

/* Danger - Error, Critical */
--danger: #ef4444;
--danger-light: #fee2e2;
--danger-dark: #dc2626;

/* Info - Neutral Information */
--info: #3b82f6;
--info-light: #dbeafe;
--info-dark: #2563eb;
```

**Dark Mode (Required for 2026):**
```css
/* Deep dark backgrounds (never pure black) */
--dark-900: #0f172a;  /* Primary background */
--dark-800: #1e293b;  /* Card background */
--dark-700: #334155;  /* Borders */
--dark-600: #475569;  /* Secondary text */
--dark-500: #64748b;  /* Muted text */

/* Vivid accents for dark mode */
--dark-accent-1: #6ee7b7;  /* Mint green */
--dark-accent-2: #93c5fd;  /* Light blue */
--dark-accent-3: #c4b5fd;  /* Lavender */
```

---

#### ✒️ Typography System 2026

**Font Stack:**
```css
/* Primary - Clean, professional (Inter) */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Display - Impact headlines (Plus Jakarta Sans) */
--font-display: 'Plus Jakarta Sans', var(--font-sans);

/* Mono - Code, data (JetBrains Mono) */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Scale (8-tier responsive):**
```css
/* Display - Hero headlines */
--text-display: clamp(3rem, 8vw, 6rem); /* 48px - 96px */

/* H1 - Page titles */
--text-h1: clamp(2.5rem, 6vw, 4.5rem); /* 40px - 72px */

/* H2 - Section headers */
--text-h2: clamp(2rem, 4vw, 3rem); /* 32px - 48px */

/* H3 - Subsections */
--text-h3: clamp(1.5rem, 3vw, 2rem); /* 24px - 32px */

/* H4 - Card titles */
--text-h4: clamp(1.25rem, 2vw, 1.5rem); /* 20px - 24px */

/* Body - Main content */
--text-body: clamp(1rem, 1.5vw, 1.125rem); /* 16px - 18px */

/* Small - Secondary text */
--text-sm: clamp(0.875rem, 1vw, 1rem); /* 14px - 16px */

/* XS - Captions, labels */
--text-xs: clamp(0.75rem, 0.8vw, 0.875rem); /* 12px - 14px */
```

**Font Weights:**
```css
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

---

#### 🎯 Landing Page Strategy 2026 (P0 - Critical)

**Above the Fold (First 900px):**

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (Glassmorphism effect)                              │
│  Logo | Navigation | Connect Wallet [CTA]                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  HERO SECTION (Aurora gradient background)                  │
│                                                              │
│  [Badge: "🚀 MVP: Institutional Architecture"]            │
│                                                              │
│  H1: "Tokenize African Real-World Assets"                   │
│      (Kinetic typography, gradient text)                    │
│                                                              │
│  Subtitle: "Institutional-grade DeFi platform for secure,   │
│             compliant investment opportunities."            │
│                                                              │
│  [Primary CTA: "Start Investing"] [Secondary: "Learn More"] │
│                                                              │
│  Trust Badges: [ERC-3643] [Polygon] [Audited]               │
│                                                              │
│  ↓ Scroll indicator (animated)                               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  SOCIAL PROOF (Bento grid)                                  │
│  [Stats: $2.5M TVL] [150+ Investors] [8 Countries]         │
└─────────────────────────────────────────────────────────────┘
```

**Key Elements (Per 2026 Best Practices):**

1. **Founder/Team Visibility:**
   - CEO intro video (30 seconds max)
   - Team photos in "About" section
   - Signed message from founder

2. **Proof Above the Fold:**
   - Key metrics (TVL, investors, countries)
   - Security badges (ERC-3643, audits)
   - Partner logos (Polygon, BIIC (Banque Internationale pour l'Industrie et le Commerce), etc.)

3. **Clear Value Proposition:**
   - Conversational tone (not institutional)
   - Specific numbers (not vague claims)
   - Readable in <5 seconds

4. **Interactive Elements:**
   - Investment calculator
   - Platform preview/demo
   - Live stats ticker (if available)

---

#### 🛡️ Trust Signals (Integrated Throughout)

**Placement Strategy:**

| Location | Trust Element |
|----------|---------------|
| **Header** | Security badge, compliance indicator |
| **Hero** | Audit badges, partner logos |
| **Features** | Security features, encryption |
| **Dashboard** | Real-time alerts, transaction history |
| **Footer** | Licenses, regulatory info, contact |

**Specific Elements:**
```tsx
// Trust Badge Component
<TrustBadge
  icon={Shield}
  label="ERC-3643 Compliant"
  description="Institutional-grade security"
/>

// Security Indicator
<SecurityIndicator
  level="maximum"
  features={[
    "256-bit Encryption",
    "Multi-sig Governance",
    "Audited Smart Contracts",
    "KYC/AML Compliant"
  ]}
/>

// Social Proof
<SocialProof
  stats={{
    totalValueLocked: "$2.5M",
    activeInvestors: "150+",
    countriesServed: "8",
    averageYield: "8.4%"
  }}
/>
```

---

#### 📊 Microinteractions & Visual Feedback

**Button States:**
```css
.btn-primary {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}
```

**Loading States:**
```tsx
// Skeleton loader for cards
<SkeletonCard />

// Progress indicator for transactions
<TransactionProgress
  steps={['Initiating', 'Confirming', 'Processing', 'Complete']}
  currentStep={2}
/>
```

**Success/Error Feedback:**
```tsx
// Toast notifications
<Toast
  type="success"
  title="Investment Successful"
  message="Your investment has been confirmed"
  icon={CheckCircle}
/>

// Inline validation
<Input
  error={errors.amount}
  success={isValid}
  helperText="Minimum investment: $1,000"
/>
```

---

#### 📱 Responsive Design Strategy

**Breakpoints:**
```css
/* Mobile-first approach */
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktops */
--breakpoint-xl: 1280px;  /* Large screens */
--breakpoint-2xl: 1536px; /* Extra large */
```

**Mobile Optimization:**
- Touch targets: 48x48px minimum
- Thumb-friendly navigation
- Reduced animations on mobile
- Fast tap response (<100ms)

**Tablet Optimization:**
- Adaptive layouts (2-column grids)
- Split-view dashboards
- Landscape/portrait support

---

#### ⚡ Performance Optimization

**Critical Rendering Path:**
```html
<!-- Preload critical assets -->
<link rel="preload" href="/fonts/Inter.woff2" as="font" crossorigin>
<link rel="preload" href="/css/critical.css" as="style">

<!-- Defer non-critical -->
<link rel="preload" href="/css/non-critical.css" as="style" media="print" onload="this.media='all'">
```

**Image Optimization:**
```tsx
// Next-gen formats with fallback
<picture>
  <source srcSet="/hero.avif" type="image/avif" />
  <source srcSet="/hero.webp" type="image/webp" />
  <img src="/hero.jpg" alt="Hero" loading="lazy" />
</picture>
```

**Code Splitting:**
```typescript
// Route-based lazy loading
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PoolDetail = lazy(() => import('./pages/PoolDetail'));

// Component-level splitting
const HeavyChart = lazy(() => import('./components/HeavyChart'));
```

---

#### 🎬 Animation Guidelines

**Principles:**
1. **Purpose-driven** - Every animation serves a function
2. **Subtle** - Duration 200-500ms, easing cubic-bezier
3. **Performant** - GPU-accelerated (transform, opacity)
4. **Accessible** - Respect `prefers-reduced-motion`

**Key Animations:**
```css
/* Fade in (standard) */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scale in (modals, cards) */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Slide in (notifications) */
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Pulse (live indicators) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

#### ✅ Design Checklist 2026

**Visual Design:**
- [ ] Glassmorphism effects on cards/modals
- [ ] Aurora gradient background on hero
- [ ] Bento grid layout for features
- [ ] Claymorphism for CTA cards
- [ ] Kinetic typography on headlines
- [ ] Dark mode support (required)
- [ ] Grain/noise textures (optional, premium feel)

**Trust & Credibility:**
- [ ] Security badges visible above fold
- [ ] Team/founder photos
- [ ] Customer testimonials integrated early
- [ ] Key metrics displayed prominently
- [ ] Compliance indicators throughout
- [ ] Partner logos (Polygon, auditors, etc.)

**Interactivity:**
- [ ] Microinteractions on all buttons
- [ ] Loading skeletons for async content
- [ ] Toast notifications for actions
- [ ] Progress indicators for multi-step flows
- [ ] Hover states on all interactive elements
- [ ] Investment calculator/simulator

**Accessibility:**
- [ ] Color contrast ≥4.5:1 (WCAG AA)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Focus indicators visible (3px outline)
- [ ] Touch targets ≥48x48px
- [ ] Screen reader compatible (ARIA labels)
- [ ] Reduced motion support

**Performance:**
- [ ] FCP <1.5s
- [ ] TTI <3.5s
- [ ] Bundle size <200KB initial JS
- [ ] Images in AVIF/WebP format
- [ ] Lazy loading for below-fold content
- [ ] Code splitting by route

---

### 6.1 Implementation Phases

#### Phase 4.1: Design System Setup (Week 5, Days 1-3)

**Tasks:**
- [ ] Configure Tailwind CSS with custom design tokens (per Frontend Spec Section 3)
- [ ] Create global styles (`src/styles/globals.css`)
- [ ] Set up component library structure
- [ ] Configure TypeScript paths
- [ ] **Implement Liquid Glass effects** (glassmorphism utilities)
- [ ] **Create Aurora gradient backgrounds** (animated gradient meshes)
- [ ] **Set up Dark Mode** (toggle + persistence)
- [ ] **Configure Kinetic Typography** (animated text components)

**Reference:** Frontend Spec Section 3 (Visual Design System), Section 4.3 (Project Structure), **2026 Design Trends (this document)**

---

#### Phase 4.2: Base Components (Week 5, Days 4-5)

**Tasks:**
- [ ] Button (variants: default, secondary, outline, ghost, link, destructive)
- [ ] Card (variants: default, elevated, interactive)
- [ ] Input (with label, error, helper text, prefix/suffix)
- [ ] Modal (accessible with focus trap)
- [ ] Badge (status indicators)

**Reference:** Frontend Spec Section 6.1 (Base Components)

---

#### Phase 4.3: Layout Components (Week 6, Days 1-2)

**Tasks:**
- [ ] Header (logo, navigation, wallet connect, notifications)
- [ ] Sidebar (collapsible, navigation with icons)
- [ ] Footer (disclaimers, compliance badges)
- [ ] DashboardLayout (responsive)

**Reference:** Frontend Spec Section 4.3 (Project Structure)

---

#### Phase 4.4: Dashboard Page (Week 6, Days 3-5)

**Tasks:**
- [ ] KPICard component (Total Value, Yield, Active Pools)
- [ ] PortfolioPieChart (Recharts, accessible)
- [ ] YieldLineChart (30-day accrual trend)
- [ ] PoolPositionTable (sortable, with actions)
- [ ] TransactionList (recent 10)
- [ ] ComplianceStatusCard (KYB status, document expiry)
- [ ] Integrate with TanStack Query

**Reference:** Frontend Spec Section 5.1 (Dashboard Overview)

---

#### Phase 4.5: Pool Marketplace (Week 7, Days 1-3)

**Tasks:**
- [ ] PoolCard component (metrics, progress bar, actions)
- [ ] SearchBar (debounced)
- [ ] FilterBar (quick filter chips)
- [ ] AdvancedFilters (modal with detailed filters)
- [ ] ProgressBar (animated)
- [ ] Filtering logic (memoized)

**Reference:** Frontend Spec Section 5.2 (Pool Marketplace)

---

#### Phase 4.6: Pool Detail Page (Week 7, Days 4-5)

**Tasks:**
- [ ] Pool header (name, class, risk rating)
- [ ] Quick stats grid (TVL, APY, NAV, Min Investment)
- [ ] Performance chart (historical NAV)
- [ ] Asset allocation pie chart
- [ ] Financing list table
- [ ] Documents section
- [ ] Subscribe CTA button

**Reference:** Frontend Spec Section 5.3 (Pool Detail Page)

---

#### Phase 4.7: Subscribe Flow (Week 8, Days 1-3)

**Multi-Step Flow:**
- [ ] Step 1: Amount Selection (slider + input, projected uLP)
- [ ] Step 2: Review Terms (lock-up, APY, fees)
- [ ] Step 3: Funding Source (Ondo EUROD (EUROD) wallet or bank escrow)
- [ ] Step 4: Confirmation (summary, sign transaction)
- [ ] Step 5: Progress Tracking (timeline, block confirmations)

**Reference:** Frontend Spec Section 5.4 (Subscribe Flow)

---

#### Phase 4.8: Portfolio Page (Week 8, Days 4-5)

**Tasks:**
- [ ] Portfolio summary (total value, cost basis, gains/losses)
- [ ] Position table (each pool with actions)
- [ ] Performance chart (value over time)
- [ ] Yield Statement generator (PDF download)
- [ ] Transaction history with filters

**Reference:** Frontend Spec Section 5.5 (Portfolio Page)

---

#### Phase 4.9: Compliance Dashboard (Week 9, Days 1-2)

**Tasks:**
- [ ] Compliance status overview
- [ ] KYB/KYC status card
- [ ] Document vault (upload, expiry tracking)
- [ ] Investor list (for pool managers)
- [ ] Audit trail viewer

**Reference:** Frontend Spec Section 5.6 (Compliance Dashboard)

---

#### Phase 4.10: Deep Dive & Investors Room (Week 9, Days 3-5)

**Priority:** P1 (High)
**Timeline:** Week 9, Days 3-5
**Owner:** Frontend Developer
**Reference:** `09_DEEP_DIVE_INVESTORS_ROOM.md` (Complete implementation guide)

**Deep Dive (Technical Documentation Page) - `/deep-dive`:**

**File:** `frontend/src/MVP/pages/institutional/DeepDive.tsx`

**Sections to Implement:**
1. **Architecture Overview** 🏗️
   - [ ] System architecture diagram (interactive)
   - [ ] Core components table (Frontend, Backend, Smart Contracts, Infrastructure)
   - [ ] Technology stack display

2. **Smart Contracts** 📜
   - [ ] Contract hierarchy visualization
   - [ ] uLPToken features (deposit, redeem, NAV calculation)
   - [ ] LiquidityPool families (POOL_INDUSTRIE, POOL_AGRICULTURE, etc.)
   - [ ] Code examples with syntax highlighting

3. **Backend Services** ⚙️
   - [ ] Service architecture diagram
   - [ ] Yield calculation formulas (animated step-by-step)
   - [ ] API endpoints table

4. **API Reference** 🔌
   - [ ] Response format examples
   - [ ] Rate limits display
   - [ ] Error handling documentation

5. **Security Model** 🔒
   - [ ] Defense in depth (4 layers: Smart Contract, Backend, Infrastructure, Compliance)
   - [ ] Blocked jurisdictions list (12 countries: OFAC + UN + EU + FATF)
   - [ ] Compliance requirements

6. **Performance** ⚡
   - [ ] Performance targets (FCP <1.5s, TTI <3.5s, Lighthouse >90)
   - [ ] Optimization strategies (code splitting, lazy loading, caching)

**UI Features:**
- [ ] Sticky navigation sidebar (section switching)
- [ ] Smooth scroll to sections
- [ ] Code syntax highlighting (react-syntax-highlighter)
- [ ] Responsive design (mobile-first)
- [ ] Quick links / table of contents
- [ ] Dark mode support

**Investors Room (Documentation Portal) - `/investors-room`:**

**File:** `frontend/src/MVP/pages/institutional/InvestorsRoom.tsx`

**Features to Implement:**

**Document Categories (6 categories, 22 documents total):**
1. **Onboarding** (5 docs) - KYC/AML, accreditation, jurisdiction
2. **Asset Offerings** (3 docs) - Offering memoranda, term sheets
3. **Ongoing Reporting** (3 docs) - Quarterly/annual reports
4. **Legal & Compliance** (4 docs) - Terms, privacy, risk disclosures
5. **Educational** (5 docs) - How-to guides, FAQs
6. **Templates** (2 docs) - Subscription agreements, forms

**Core Features:**
- [ ] Large search bar with icon (full-text search)
- [ ] Category cards with document counts
- [ ] Featured documents grid (6 highlighted docs with gradient cards)
- [ ] Document table (columns: name, type, size, date, actions)
- [ ] Document modal (detailed view with markdown rendering)
- [ ] Download and preview actions
- [ ] Category filtering (dropdown + "All" option)
- [ ] Combined filtering (category + search query)
- [ ] Empty state with "clear filters" button
- [ ] Responsive design (mobile-friendly)

**Initial Documents (10 minimum for MVP):**
- [ ] DOC-001: Investor Information Memorandum ⭐ (Featured)
- [ ] DOC-002: KYC/AML Guide
- [ ] DOC-003: Accreditation Requirements
- [ ] DOC-004: Jurisdiction Eligibility Guide ⭐ (Featured)
- [ ] DOC-005: Fee Schedule
- [ ] DOC-008: Risk Disclosure Statement ⭐ (Featured)
- [ ] DOC-010: 2025 Annual Report ⭐ (Featured)
- [ ] DOC-012: Terms of Service ⭐ (Featured)
- [ ] DOC-013: Privacy Policy
- [ ] DOC-018: Wallet Setup Guide ⭐ (Featured)

**Search Implementation:**
```typescript
function searchDocuments(query: string, documents: InvestorDocument[]): SearchResult[] {
  // Search in title, description, and tags
  // Sort by relevance
  // Return filtered results
}
```

**Success Criteria:**
- ✅ Deep Dive: All 6 sections complete with interactive elements
- ✅ Deep Dive: Code examples with syntax highlighting
- ✅ Deep Dive: Architecture diagrams rendered
- ✅ Investors Room: 6 document categories implemented
- ✅ Investors Room: 22 documents loaded (minimum 10 for MVP)
- ✅ Investors Room: Full-text search functional
- ✅ Investors Room: Category filtering works
- ✅ Investors Room: Featured documents displayed
- ✅ Both pages: Responsive design
- ✅ Both pages: Dark mode support
- ✅ Both pages: Accessible (WCAG 2.1 AA)

**Integration:**
```typescript
// Add to App.tsx routing
<Route path="/deep-dive" element={<DeepDive />} />
<Route path="/investors-room" element={<InvestorsRoom />} />

// Add to Header navigation
<Link to="/deep-dive">Deep Dive</Link>
<Link to="/investors-room">Investors Room</Link>
```

**Testing:**
- [ ] Test Deep Dive navigation (all sections accessible)
- [ ] Test Investors Room search (various keywords)
- [ ] Test category filtering
- [ ] Test document modal (open/close)
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test accessibility (keyboard navigation, screen reader)

---

---

#### Phase 4.11: Web3 & Wallet Integration (Week 8-9, Parallel)

**Timeline:** Week 8, Days 1-3
**Priority:** P0

**Reference:**
- Frontend Spec Section 5.7 (Wallet Integration) ⭐ **NEW**
- Frontend Spec Section 4.1 (Technology Stack)
- Mocking Strategy Section 6 (Frontend Integration)
- **Web3 Architecture Guide** (`docs/02_TECHNICAL_GUIDES/08_WEB3_ARCHITECTURE_GUIDE.md`) ⭐ **NEW**

**Web3 Architecture Compliance:**
- ✅ **Non-custodial model** - Users hold their own keys
- ✅ **Self-custody** - Backend NEVER accesses private keys
- ✅ **User signs transactions** - Via MetaMask/RainbowKit
- ✅ **Backend off-chain only** - Fraud detection, indexing, metadata
- ✅ **Smart contracts enforce** - On-chain rules, not backend

**Tasks:**

**Wallet Setup:**
- [ ] Configure wagmi + Viem
- [ ] Set up RainbowKit (wallet connection UI)
- [ ] Configure wallet connectors:
  - MetaMask (browser extension)
  - WalletConnect (mobile wallets)
  - Rainbow (mobile app)
- [ ] Set up wallet store (Zustand)

**Wallet Components:**
- [ ] Implement `WalletConnect` component (header)
- [ ] Implement `WalletDisplay` component (address, balance)
- [ ] Implement `WalletVerification` component (signature verification)
- [ ] Implement `ConnectWalletButton` component

**Smart Contract Integration:**
- [ ] Set up contract hooks (`useuLPToken`, `usePools`, `useLiquidityPool`)
- [ ] Create `TransactionStatus` component (pending/success/failed)
- [ ] Implement `BlockExplorerLink` component (Polygonscan)
- [ ] Set up event listeners (Transfer, YieldAccrued)

**Network Management:**
- [ ] Network switcher (Polygon Amoy → Mainnet)
- [ ] Wrong network detection and prompt
- [ ] Chain validation on all transactions

**Testing:**
- [ ] Test wallet connection flow
- [ ] Test wallet verification
- [ ] Test network switching
- [ ] Test transaction signing
- [ ] Test error handling (user rejection, insufficient funds)

**Code Examples:**
```tsx
// Wallet connection - User controls keys
import { WalletConnect } from '@/components/web3/WalletConnect';

// In Header
<WalletConnect />

// Wallet verification - Signature based
import { WalletVerification } from '@/components/web3/WalletVerification';

<WalletVerification
  investorId={investorId}
  onVerified={handleVerified}
/>

// Contract interaction - User signs, not backend
import { useuLPToken } from '@/hooks/useuLPToken';

const { deposit, redeem, balance } = useuLPToken();

// Backend records transaction (off-chain only)
// backend/api/investments.py
# Stores in PostgreSQL - CANNOT modify/reverse transaction
```

**⚠️ Critical Security Rules (Per Web3 Architecture Guide):**

```python
# ❌ NEVER DO THIS - Custodial model (requires MSB license)
private_key = os.getenv("USER_PRIVATE_KEY")
wallet = Account.from_key(private_key)

# ❌ NEVER DO THIS - Backend signing for users
@app.post("/api/v1/invest")
async def invest_for_user(wallet: str, amount: int):
    private_key = os.getenv("MASTER_PRIVATE_KEY")
    # 🚨 This makes you a custodian!
```

```tsx
// ✅ CORRECT - Non-custodial, user holds keys
import { useWriteContract } from 'wagmi';

const { writeContract } = useWriteContract();

// Triggers MetaMask popup - user signs
writeContract({
  address: ULPTOKEN_ADDRESS,
  abi: ULPTOKEN_ABI,
  functionName: 'deposit',
  args: [amount],
});
```

---

#### Phase 4.15: Proof of Reserve Implementation ⭐ **NEW**

**Timeline:** Week 9, Days 3-4
**Priority:** P0

**Reference:**
- Frontend Spec Section 5.8 (Proof of Reserve Dashboard) ⭐ **NEW**
- SRS v2.0 Section 1.2, 3.158, 5.12
- Chainlink Proof of Reserve (for production)

**Purpose:** Provide institutional-grade transparency with real-time on-chain attestation of pool reserves backing uLP tokens.

**Tasks:**

**Smart Contract Integration:**
- [ ] Add `getTotalBackingAssets()` to LiquidityPool contract
- [ ] Add `lastReserveAudit()` to LiquidityPool contract
- [ ] Ensure Ujamaa Pool Token (uLP) has `totalSupply()` view function
- [ ] Test on-chain reserve data retrieval

**Components:**
- [ ] Implement `ProofOfReserveDisplay` component (full display)
- [ ] Implement `ProofOfReserveBadge` component (pool cards)
- [ ] Implement `ReserveRatioChart` component (30-day history)
- [ ] Implement `ReserveWidget` component (dashboard)

**API Endpoints:**
- [ ] `GET /api/v1/pools/reserves` - All pools reserve data
- [ ] `GET /api/v1/pools/{poolId}/reserves` - Single pool reserves
- [ ] Backend to read on-chain data and aggregate

**Dashboard Integration:**
- [ ] Add Reserve Widget to Dashboard
- [ ] Add Reserve Badge to Pool Cards
- [ ] Add Full Reserve Display to Pool Detail page
- [ ] Add Reserve Ratio Chart (optional, P1)

**Features:**
- [ ] Reserve Ratio display (percentage)
- [ ] Total uLP Supply display
- [ ] Total Backing Assets display
- [ ] Surplus/Deficit calculation
- [ ] Last Audit timestamp
- [ ] On-chain verification link (Polygonscan)
- [ ] Alert if under-collateralized (<100%)

**Visual Design:**
- ✅ Fully Backed badge (green, ≥100%)
- ⚠️ Under-Collateralized badge (red, <100%)
- 📊 Reserve ratio chart (area chart with 100% line)
- 🔗 On-chain verification button

**Testing:**
- [ ] Test reserve data accuracy
- [ ] Test badge displays correctly
- [ ] Test alerts for under-collateralized pools
- [ ] Test on-chain verification links

**Code Example:**
```tsx
// Pool Card with Reserve Badge
import { ProofOfReserveBadge } from '@/components/pools/ProofOfReserveBadge';

<PoolCard>
  <CardHeader>
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>{pool.name}</CardTitle>
        <p className="text-sm text-gray-500">{pool.assetClass}</p>
      </div>
      {/* Reserve Badge */}
      <ProofOfReserveBadge reserveRatio={pool.reserveRatio} />
    </div>
  </CardHeader>
</PoolCard>

// Dashboard Widget
import { ReserveWidget } from '@/components/dashboard/ReserveWidget';

<Dashboard>
  <KPICards />
  <ReserveWidget />  {/* Proof of Reserve */}
  <PortfolioChart />
</Dashboard>
```

**Acceptance Criteria:**
- ✅ Reserve ratio displayed on every pool card
- ✅ Full Proof of Reserve on pool detail page
- ✅ Dashboard widget shows total reserves
- ✅ Alert if reserves < 100%
- ✅ Link to verify on Polygonscan
- ✅ Updates every 60 seconds

---

#### Phase 4.12: Testing (Week 9, Ongoing)

**Unit Tests (Vitest + Testing Library):**
- [ ] Test all base components
- [ ] Test complex components
- [ ] Test hooks
- [ ] Test utilities (formatters, validators)
- [ ] Target: >85% coverage

**E2E Tests (Playwright):**
- [ ] Test investor onboarding flow
- [ ] Test pool subscription flow
- [ ] Test redemption flow
- [ ] Test dashboard loading

**Reference:** Frontend Spec Section 11 (Testing Strategy)

---

#### Phase 4.13: Accessibility & Performance Audit (Week 9)

**Accessibility:**
- [ ] WCAG 2.2 AA audit
- [ ] Keyboard navigation testing
- [ ] Screen reader testing (NVDA, VoiceOver)
- [ ] Color contrast verification
- [ ] Focus indicator verification

**Performance:**
- [ ] Lighthouse audit (target: >90 all categories)
- [ ] Bundle size analysis (target: <200KB initial JS)
- [ ] Code splitting optimization
- [ ] Image optimization (WebP/AVIF)
- [ ] Lazy loading implementation

**Reference:** Frontend Spec Section 8 (Accessibility), Section 9 (Performance)

---

#### Phase 4.14: Mock Components & Testnet Indicators ⭐ **NEW**

**Timeline:** Week 9, Days 1-2 (parallel with testing)
**Priority:** P0

**Reference:** `04_MVP_MOCKING_AND_TESTNET_STRATEGY.md` Section 6 (Frontend Integration for Mock Services)

**Tasks:**
- [ ] Implement `MVPBanner` component (sticky top banner on all pages)
- [ ] Implement `TestnetNotice` modal (first-time visitors)
- [ ] Implement `MockDataBadge` component (all mock data displays)
- [ ] Implement `DisclaimerModal` component (10-second auto-dismiss + manual redisplay)
- [ ] Add mock indicators to funding source selection
- [ ] Add testnet badges to transaction history
- [ ] Implement mock/production toggle (settings page)
- [ ] Add disclaimers per Mocking Strategy Section 6.6
- [ ] Ensure accessibility per Mocking Strategy Section 6.7

**Components from Mocking Strategy:**
```tsx
// MVPBanner - Required on all MVP pages
import { MVPBanner } from '@/MVP/components/MVPBanner';

// TestnetNotice - Modal for first-time visitors
import { TestnetNotice } from '@/MVP/components/TestnetNotice';

// MockDataBadge - Next to all mock data
import { MockDataBadge } from '@/MVP/components/MockDataBadge';

// DisclaimerModal - 10-second auto-dismiss + manual redisplay ⭐ NEW
import { DisclaimerModal } from '@/MVP/components/DisclaimerModal';
```

**Visual Design:**
- Mock Badge: Blue background (info-500), "🧪 MOCK" text
- Testnet Badge: Purple background (primary-500)
- Banner: Gradient blue-to-purple, sticky top
- Disclaimer: Info alert component

**Testing:**
- [ ] Mock indicators visible on all pages
- [ ] Disclaimers present and readable
- [ ] Accessibility (screen reader announces "Mock")
- [ ] Color contrast ≥4.5:1

---

#### Phase 4.14.1: Disclaimer Modal Specification ⭐ **NEW**

**Component:** `DisclaimerModal.tsx`
**File:** `frontend/src/MVP/components/DisclaimerModal.tsx`
**Priority:** P0
**Timeline:** Week 9, Day 1

**Behavior:**

1. **Auto-Display on Launch:**
   - Modal appears automatically when app loads
   - Shows for **10 seconds**
   - Auto-dismisses after 10 seconds
   - User can manually dismiss earlier

2. **Manual Redisplay:**
   - Non-intrusive button always available (e.g., in footer or header)
   - Button label: "ℹ️ Testnet Info" or "📋 Disclaimers"
   - Clicking reopens the modal
   - No time limit on manual display

3. **LocalStorage Tracking:**
   - Track if user has seen disclaimer
   - Optional: Don't auto-show again if already dismissed
   - Always available via manual button

**Component API:**
```typescript
interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoCloseDelay?: number;  // Default: 10000ms (10 seconds)
}

interface DisclaimerModalState {
  hasSeenDisclaimer: boolean;
  countdown: number;  // Remaining seconds
}
```

**Features:**
- [ ] Countdown timer display (10, 9, 8, ... 1, 0)
- [ ] Progress bar showing time remaining
- [ ] Manual close button (X in corner)
- [ ] "Don't show again" checkbox (optional)
- [ ] Non-intrusive redisplay button (fixed position)
- [ ] LocalStorage persistence
- [ ] Accessible (keyboard, screen reader)

**UI Layout:**
```tsx
// Modal Content
<div className="DisclaimerModal">
  <h2>🚀 MVP Testnet Notice</h2>

  <div className="countdown-timer">
    <div className="countdown-number">{countdown}s</div>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${countdown * 10}%` }} />
    </div>
  </div>

  <div className="disclaimer-content">
    <p><strong>This is a testnet-only demonstration.</strong></p>
    <ul>
      <li>✅ Testnet deployment on Polygon Amoy</li>
      <li>✅ Mock bank services (no real money)</li>
      <li>✅ Simulated escrow accounts</li>
      <li>✅ Real yield calculation math</li>
    </ul>
    <p className="warning"><strong>NOT for production use.</strong></p>
  </div>

  <button onClick={handleClose}>
    {countdown > 0 ? `Close (${countdown}s)` : 'Close'}
  </button>
</div>

// Redisplay Button (non-intrusive)
<button className="DisclaimerButton" onClick={() => setIsOpen(true)}>
  ℹ️ Testnet Info
</button>
```

**Placement:**
- **Modal:** Center of screen, overlay background
- **Redisplay Button:**
  - Option 1: Footer (next to copyright)
  - Option 2: Header (next to settings/wallet)
  - Option 3: Floating button (bottom-right corner, fixed position)

**Integration Example:**
```tsx
// App.tsx or Layout.tsx
function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [hasSeenDisclaimer, setHasSeenDisclaimer] = useState(
    localStorage.getItem('hasSeenDisclaimer') === 'true'
  );

  useEffect(() => {
    // Auto-show on first visit only
    if (hasSeenDisclaimer) {
      setShowDisclaimer(false);
    } else {
      // Auto-close after 10 seconds
      const timer = setTimeout(() => {
        setShowDisclaimer(false);
        localStorage.setItem('hasSeenDisclaimer', 'true');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenDisclaimer]);

  return (
    <>
      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => {
          setShowDisclaimer(false);
          localStorage.setItem('hasSeenDisclaimer', 'true');
        }}
        autoCloseDelay={10000}
      />

      {/* Non-intrusive redisplay button */}
      <button
        className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-white dark:bg-gray-800
                   border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg
                   hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setShowDisclaimer(true)}
      >
        ℹ️ Testnet Info
      </button>

      <Router>
        <Routes>...</Routes>
      </Router>
    </>
  );
}
```

**Styling:**
```css
/* DisclaimerModal.css */
.DisclaimerModal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.DisclaimerModal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
}

.countdown-timer {
  margin: 1rem 0;
}

.countdown-number {
  font-size: 2rem;
  font-weight: bold;
  color: #16A34A;  /* Primary green */
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #16A34A, #0D9488);
  transition: width 1s linear;
}

.DisclaimerButton {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.DisclaimerButton:hover {
  background: #f9fafb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

**Testing Checklist:**
- [ ] Modal appears on first load
- [ ] Countdown timer counts down from 10
- [ ] Progress bar animates smoothly
- [ ] Modal auto-closes after 10 seconds
- [ ] Manual close works before 10 seconds
- [ ] Redisplay button reopens modal
- [ ] LocalStorage prevents auto-show on subsequent visits
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces modal content
- [ ] Mobile responsive (fits on small screens)
- [ ] Dark mode support

---

### 6.1.1 Role Workflow Implementation ⭐ **NEW v6.0**

**Timeline:** Week 8-11
**Priority:** P0 (Critical for end-to-end investor demo)
**Reference:** `14_MVP_ROLE_WORKFLOW_COVERAGE_ANALYSIS.md`, SRS v2.0 Section 2.3

#### Phase 4.16: Asset Originator Workflow ⭐ **NEW**

**Timeline:** Week 8, Days 1-5
**Priority:** P0 (Critical for end-to-end demo)

**Files to Create:**
- `frontend/src/MVP/pages/originator/Onboarding.tsx`
- `frontend/src/MVP/pages/originator/Dashboard.tsx`
- `frontend/src/MVP/components/originator/AssetSubmissionForm.tsx`
- `frontend/src/MVP/components/originator/ProductionNotarization.tsx`
- `frontend/src/MVP/components/originator/CapitalRaiseTracker.tsx`

**Tasks:**

**1. Originator Onboarding (Days 1-2):**
- [ ] Company registration form (KYB)
- [ ] Industry selection (manufacturing, agriculture, mining, energy, trade, real estate)
- [ ] Document upload (registration, permits, certifications)
- [ ] Wallet connection
- [ ] Approval waiting screen
- [ ] Mock backend integration

**2. Originator Dashboard (Days 3-4):**
- [ ] Asset submission form
- [ ] Capital raise tracking (progress bar, investor count)
- [ ] Production notarization (data hash, transaction history)
- [ ] Repayment submission (principal + interest)

**3. Mock Integration (Day 5):**
- [ ] Submit asset → Mock GDIZ service
- [ ] Notarize production → AssetProof contract
- [ ] Upload documents → Mock document storage

**Testing:**
- [ ] Test onboarding flow
- [ ] Test asset submission
- [ ] Test production notarization
- [ ] Test repayment flow

---

#### Phase 4.17: Compliance Officer Dashboard ⭐ **NEW**

**Timeline:** Week 9, Days 1-5
**Priority:** P0 (Critical for KYC demo)

**Files to Create:**
- `frontend/src/MVP/pages/compliance/Dashboard.tsx`
- `frontend/src/MVP/components/compliance/KYCApprovalQueue.tsx`
- `frontend/src/MVP/components/compliance/AccreditationManager.tsx`
- `frontend/src/MVP/components/compliance/ComplianceConfig.tsx`
- `frontend/src/MVP/components/compliance/RegulatoryReporting.tsx`

**Tasks:**

**1. KYC/KYC Approval Queue (Days 1-2):**
- [ ] Pending applications list
- [ ] Document viewer
- [ ] Approve/Reject buttons
- [ ] Comments/notes field

**2. Accreditation Management (Day 3):**
- [ ] Investor accreditation status
- [ ] Expiry tracking
- [ ] Renewal workflow

**3. Compliance Configuration (Day 4):**
- [ ] Jurisdiction whitelist/blacklist
- [ ] Investor caps per pool
- [ ] Transfer restrictions

**4. Regulatory Reporting (Day 5):**
- [ ] Export investor list (CSV)
- [ ] Generate compliance report (PDF)
- [ ] MiCA, FATF, SEC reporting

**Testing:**
- [ ] Test KYC approval flow
- [ ] Test accreditation management
- [ ] Test compliance configuration

---

#### Phase 4.18: Retail Investor Dashboard ⭐ **NEW**

**Timeline:** Week 9, Days 1-3
**Priority:** P0 (Critical for African market demo)

**Files to Create:**
- `frontend/src/MVP/pages/retail/Dashboard.tsx`
- `frontend/src/MVP/components/retail/SimplifiedPortfolio.tsx`
- `frontend/src/MVP/components/retail/EducationalTooltips.tsx`
- `frontend/src/MVP/components/retail/SmallAmountInvest.tsx`

**Tasks:**

**1. Simplified UI (Day 1):**
- [ ] Larger text, clearer labels
- [ ] Educational tooltips
- [ ] Mobile-first design

**2. Investment Flow (Day 2):**
- [ ] Browse individual assets (UAT tokens)
- [ ] Small-amount investment (€100 minimum)
- [ ] Mobile money option (mock)

**3. Portfolio View (Day 3):**
- [ ] Simple holdings display
- [ ] Distribution history
- [ ] Tax documents

**Testing:**
- [ ] Test simplified UI
- [ ] Test small-amount investment
- [ ] Test mobile money flow

---

#### Phase 4.19: Admin Compliance Tools ⭐ **NEW**

**Timeline:** Week 9, Days 4-5 + Week 10, Days 1-2
**Priority:** P0

**Files to Create:**
- `frontend/src/MVP/pages/admin/ComplianceTools.tsx`
- `frontend/src/MVP/pages/admin/UserManagement.tsx`
- `frontend/src/MVP/pages/admin/AssetApproval.tsx`

**Tasks:**
- [ ] KYC/KYC override
- [ ] User management (suspend/activate, role assignment)
- [ ] Asset approval workflow

---

#### Phase 4.20: Regulator View (Read-Only) ⭐ **NEW**

**Timeline:** Week 10, Days 3-5
**Priority:** P1

**Files to Create:**
- `frontend/src/MVP/pages/regulator/Dashboard.tsx`
- `frontend/src/MVP/components/regulator/ComplianceMetrics.tsx`
- `frontend/src/MVP/components/regulator/TransactionMonitor.tsx`

**Tasks:**
- [ ] Compliance metrics dashboard
- [ ] Transaction monitor (pseudonymized)
- [ ] Report export (PDF, CSV, XBRL)

---

#### Phase 4.21: Diaspora Investor Features ⭐ **NEW**

**Timeline:** Week 10, Days 1-3
**Priority:** P1

**Files to Create:**
- `frontend/src/MVP/pages/diaspora/Dashboard.tsx`
- `frontend/src/MVP/components/diaspora/OverseasKYC.tsx`
- `frontend/src/MVP/components/diaspora/DualCurrencyDistribution.tsx`

**Tasks:**
- [ ] Overseas KYC flow (US/UK/EU)
- [ ] Home-country assets
- [ ] Dual-currency distribution

---

#### Phase 4.22: Mobile Money Mock Integration ⭐ **NEW**

**Timeline:** Week 10, Days 4-5
**Priority:** P1

**Files to Create:**
- `frontend/src/MVP/components/mobile/MobileMoneyConnect.tsx`
- `frontend/src/MVP/components/mobile/USSDInterface.tsx`

**Tasks:**
- [ ] M-Pesa, MTN mock integration
- [ ] USSD simulation
- [ ] Low-bandwidth frontend

---

#### Phase 4.23: Guided Product Tour ⭐ **NEW**

**Timeline:** Week 10, Days 3-5
**Priority:** P2

**Files to Create:**
- `frontend/src/MVP/components/GuidedTour.tsx`
- `frontend/src/MVP/utils/tourConfig.ts`

**Tasks:**
- [ ] Role-specific tour paths
- [ ] Interactive overlays
- [ ] Analytics tracking

---

### 6.2 Frontend Task Summary

| Week | Focus Area | Key Deliverables |
|------|------------|------------------|
| **Week 5** | Foundation | Design system, base components |
| **Week 6** | Layout + Dashboard | Header, Sidebar, Dashboard page |
| **Week 7** | Pool Features | Pool Marketplace, Pool Detail |
| **Week 8** | Investment Flows | Subscribe Flow, Portfolio |
| **Week 9** | Documentation + Polish | Deep Dive, Investors Room, Testing |

---

### 6.3 Old MVP-1 Components (Unchanged)

**Note:** The following existing MVP-1 components remain UNTOUCHED:
- Landing page
- MVP-1 dashboards
- MVP-1 asset marketplace

All MVP components use `MVP/` prefix to avoid conflicts.

### 6.8 Deep Dive - Technical Documentation Page

**File:** `frontend/src/MVP/pages/deep-dive/DeepDive.tsx`
**SRS Reference:** Section 1.5, 5 (Architecture)
**Priority:** P1 (High)
**Timeline:** Week 7

**Description:** A comprehensive technical documentation page that explains how the UJAMAA DeFi platform works. This is an interactive, visually engaging page with diagrams, animations, and detailed technical explanations.

**Features:**
- **Interactive Architecture Diagrams** - Click-through system architecture with layer-by-layer explanations
- **Smart Contract Walkthrough** - Step-by-step explanation of uLPToken, LiquidityPool mechanics
- **Yield Calculation Visualizer** - Animated charts showing NAV accrual over time
- **Mock vs Production Toggle** - Clear explanation of testnet vs production differences
- **Algorithm Explanations** - Links to `docs/09_ALGORITHMS/` with visual representations
- **Code Examples** - Syntax-highlighted Solidity/Python snippets
- **Glossary** - Hover definitions for technical terms

**Directory Structure:**
```
frontend/src/MVP/pages/deep-dive/
├── DeepDive.tsx                    # Main page component
├── sections/
│   ├── ArchitectureSection.tsx     # System architecture
│   ├── SmartContractsSection.tsx   # Contract explanations
│   ├── YieldSection.tsx            # Yield calculation
│   ├── MockSection.tsx             # Mock services explanation
│   └── SecuritySection.tsx         # Security features
├── components/
│   ├── InteractiveDiagram.tsx      # Click-through architecture diagram
│   ├── CodeBlock.tsx               # Syntax-highlighted code
│   ├── YieldVisualizer.tsx         # Animated yield chart
│   └── GlossaryTooltip.tsx         # Hover definitions
└── data/
    ├── architectureData.ts         # Architecture diagram data
    ├── contractData.ts             # Contract explanations
    └── glossaryData.ts             # Technical terms
```

**Key Components:**

```tsx
// DeepDive.tsx - Main page
export const DeepDive: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <HeroSection />
      <ArchitectureSection />
      <SmartContractsSection />
      <YieldSection />
      <MockSection />
      <SecuritySection />
    </div>
  );
};

// YieldVisualizer.tsx - Interactive yield animation
export const YieldVisualizer: React.FC = () => {
  const [nav, setNav] = useState(1.0);
  const [days, setDays] = useState(0);

  // Animate NAV growth over time
  useEffect(() => {
    const interval = setInterval(() => {
      setDays(d => d + 1);
      setNav(1.0 * Math.pow(1.10, days / 365)); // 10% APY
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glassmorphism-card p-6">
      <h3>Yield Accrual Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <Area dataKey="nav" stroke="#3B82F6" fill="#93C5FD" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-3xl font-bold">{nav.toFixed(4)} Ondo EUROD (EUROD)</p>
        <p className="text-sm text-gray-500">NAV per uLP after {days} days</p>
      </div>
    </div>
  );
};
```

**Design System:**
- **Gradient Backgrounds:** `bg-gradient-to-br from-blue-500 to-purple-600`
- **Glassmorphism:** `backdrop-blur-xl bg-white/30 border border-white/20`
- **Animations:** Framer Motion for smooth transitions
- **Dark Mode:** Full dark mode support with `dark:` variants
- **Responsive:** Mobile-first design

**Task Checklist:**
- [ ] Create DeepDive.tsx main page
- [ ] Create ArchitectureSection with interactive diagram
- [ ] Create SmartContractsSection with code examples
- [ ] Create YieldSection with animated visualizer
- [ ] Create MockSection explaining testnet
- [ ] Create SecuritySection
- [ ] Add GlossaryTooltip component
- [ ] Integrate with main navigation
- [ ] Write unit tests
- [ ] Add to sitemap

### 6.9 Investors Room - Documentation Portal

**File:** `frontend/src/MVP/pages/investors-room/InvestorsRoom.tsx`
**SRS Reference:** Section 2.3, 8.1
**Priority:** P1 (High)
**Timeline:** Week 8

**Description:** A dedicated Investor Documentation Portal - a beautiful, modern React web application for browsing UJAMAA DeFi's investor documentation. Connects to markdown files for content rendering.

**Purpose:** A centralized hub for investors to access all legal, compliance, and investment documentation with intelligent search and navigation.

**Key Features:**

1. **Full-Text Search** - Search across titles, descriptions, audience, and related documents with relevance scoring
2. **Status Indicators** - Visual priority system:
   - 🟢 **Required** - Must read before investing
   - 🟡 **Recommended** - Should read for understanding
   - 🔵 **Reference** - Use as needed
   - 🟣 **Per-Offering** - Specific to each investment
   - ⚪ **Template** - For creating new documents
3. **2026 Design** - Gradient backgrounds, glassmorphism, smooth Framer Motion animations
4. **Dark Mode Ready** - Full dark mode support
5. **Responsive** - Works on desktop, tablet, and mobile

**Directory Structure:**
```
frontend/src/MVP/pages/investor-playbook/
├── InvestorsRoom.tsx            # Main portal page
├── components/
│   ├── DocumentGrid.tsx            # Grid of document cards
│   ├── DocumentCard.tsx            # Individual document card
│   ├── SearchBar.tsx               # Full-text search
│   ├── StatusBadge.tsx             # Status indicator badge
│   ├── DocumentModal.tsx           # Markdown content modal
│   ├── CategoryFilter.tsx          # Filter by category
│   └── Sidebar.tsx                 # Navigation sidebar
├── data/
│   ├── documents.ts                # Document metadata
│   └── categories.ts               # Document categories
└── content/                        # Markdown files
    ├── getting-started/
    │   ├── platform-overview.md
    │   ├── how-it-works.md
    │   └── risk-disclosure.md
    ├── legal/
    │   ├── terms-of-service.md
    │   ├── privacy-policy.md
    │   └── kyc-aml-policy.md
    ├── investment/
    │   ├── uLP-token-guide.md
    │   ├── liquidity-pools.md
    │   └── yield-explanation.md
    └── compliance/
        ├── accredited-investor.md
        ├── tax-implications.md
        └── regulatory-framework.md
```

**Document Metadata Structure:**

```typescript
interface InvestorDocument {
  id: string;
  title: string;
  description: string;
  category: 'getting-started' | 'legal' | 'investment' | 'compliance';
  status: 'required' | 'recommended' | 'reference' | 'per-offering' | 'template';
  audience: 'retail' | 'institutional' | 'both';
  readTime: number; // minutes
  contentPath: string; // Path to markdown file
  relatedDocuments: string[]; // IDs of related docs
  lastUpdated: string;
  version: string;
}

const documents: InvestorDocument[] = [
  {
    id: 'platform-overview',
    title: 'Platform Overview',
    description: 'Introduction to UJAMAA DeFi Platform and institutional architecture',
    category: 'getting-started',
    status: 'required',
    audience: 'both',
    readTime: 5,
    contentPath: '/content/getting-started/platform-overview.md',
    relatedDocuments: ['how-it-works', 'uLP-token-guide'],
    lastUpdated: '2026-03-17',
    version: '2.0',
  },
  // ... more documents
];
```

**Key Components:**

```tsx
// InvestorsRoom.tsx - Main portal
export const InvestorsRoom: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<InvestorDocument | null>(null);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50
                    dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <Header />
      <div className="flex">
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <main className="flex-1 p-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <DocumentGrid
            documents={filteredDocs}
            onSelectDoc={setSelectedDoc}
          />
        </main>
      </div>
      {selectedDoc && (
        <DocumentModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
};

// StatusBadge.tsx - Status indicator
export const StatusBadge: React.FC<{ status: InvestorDocument['status'] }> = ({ status }) => {
  const config = {
    required: { color: 'green', icon: '🟢', label: 'Required' },
    recommended: { color: 'yellow', icon: '🟡', label: 'Recommended' },
    reference: { color: 'blue', icon: '🔵', label: 'Reference' },
    'per-offering': { color: 'purple', icon: '🟣', label: 'Per-Offering' },
    template: { color: 'gray', icon: '⚪', label: 'Template' },
  };

  const { color, icon, label } = config[status];

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium
                       bg-${color}-100 text-${color}-800
                       dark:bg-${color}-900 dark:text-${color}-200`}>
      {icon} {label}
    </span>
  );
};

// DocumentCard.tsx - Document card with glassmorphism
export const DocumentCard: React.FC<{ doc: InvestorDocument }> = ({ doc }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="glassmorphism-card p-6 rounded-2xl cursor-pointer
                 backdrop-blur-xl bg-white/30 border border-white/20
                 dark:bg-gray-800/30 dark:border-gray-700/50
                 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <StatusBadge status={doc.status} />
        <span className="text-xs text-gray-500">{doc.readTime} min read</span>
      </div>
      <h3 className="text-xl font-bold mb-2">{doc.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{doc.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">v{doc.version}</span>
        <ArrowRightIcon className="w-5 h-5 text-blue-500" />
      </div>
    </motion.div>
  );
};
```

**Search Implementation:**

```tsx
// SearchBar.tsx - Full-text search with relevance scoring
export const SearchBar: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="relative mb-8">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search documentation (titles, descriptions, content)..."
        className="w-full pl-12 pr-4 py-4 rounded-xl
                   glassmorphism-input
                   bg-white/50 dark:bg-gray-800/50
                   border border-white/30 dark:border-gray-700
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   backdrop-blur-xl
                   transition-all duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center"
        >
          <XIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
};
```

**Sample Markdown Content:**

```markdown
---
title: "Platform Overview"
description: "Introduction to UJAMAA DeFi Platform"
category: "getting-started"
status: "required"
audience: "both"
readTime: 5
---

# UJAMAA DeFi Platform Overview

## What is UJAMAA DeFi?

UJAMAA DeFi is an institutional-grade decentralized finance platform for
tokenizing real-world assets (RWA) on the blockchain.

## Key Features

- **Yield-Bearing uLP Tokens** - Earn yield through industrial financing
- **Liquidity Pools** - Diversified exposure to African industrials
- **ERC-3643 Compliance** - Regulatory-compliant token standard
- **Institutional Custody** - Fireblocks integration

## How It Works

1. Investors deposit Ondo EUROD (EUROD) → receive uLP tokens
2. Pool deploys to industrial financings (GDIZ partners)
3. Industrials repay with interest
4. Yield accrues to uLP holders (NAV increases)
5. Investors redeem uLP → receive Ondo EUROD (EUROD) + yield

## Risk Disclosure

⚠️ **Important:** This is a testnet deployment. No real funds are handled.
Mainnet deployment pending regulatory approval.
```

**Task Checklist:**
- [ ] Create InvestorsRoom.tsx main page
- [ ] Create DocumentGrid component
- [ ] Create DocumentCard component with glassmorphism
- [ ] Create SearchBar component
- [ ] Create StatusBadge component
- [ ] Create DocumentModal for markdown rendering
- [ ] Create CategoryFilter component
- [ ] Create Sidebar navigation
- [ ] Write document metadata (documents.ts)
- [ ] Create markdown content files (8-10 initial docs)
- [ ] Implement full-text search
- [ ] Add Framer Motion animations
- [ ] Implement dark mode
- [ ] Make responsive (mobile/tablet/desktop)
- [ ] Integrate with main navigation
- [ ] Write unit tests
- [ ] Add to sitemap

### 6.10 Task Checklist (Updated)

- [ ] Write MVPBanner.tsx
- [ ] Write TestnetNotice.tsx
- [ ] Write PoolList.tsx
- [ ] Write PoolDetail.tsx
- [ ] Write Deposit.tsx
- [ ] Write Redeem.tsx
- [ ] Write MyHoldings.tsx
- [ ] Write Dashboard.tsx
- [ ] Write YieldStatement.tsx
- [ ] **NEW:** Write DeepDive.tsx (Week 7)
- [ ] **NEW:** Write InvestorsRoom.tsx (Week 8)
- [ ] Integrate with smart contracts (wagmi)
- [ ] Integrate with backend API
- [ ] Write component tests
- [ ] Write E2E tests (Playwright)

---

## 7. Phase 5: Integration & Testing

**Timeline:** Week 7-8
**Owner:** QA Engineer
**Status:** 🔄 Not Started

### 7.1 End-to-End Testing

**Test Flows:**

**Flow 1: Deposit Flow**
```
1. Connect wallet (MetaMask/Rainbow)
2. Get testnet Ondo EUROD (EUROD) (faucet or MockFiatRamp)
3. Navigate to Deposit page
4. Enter deposit amount (e.g., 10,000 Ondo EUROD (EUROD))
5. Approve Ondo EUROD (EUROD) spend
6. Confirm deposit transaction
7. Wait for confirmation
8. Verify uLP balance increased
9. Verify NAV = 1.00 (at inception)
```

**Flow 2: Yield Accrual Flow**
```
1. Admin deploys to industrial (mock)
2. Industrial repays with interest (mock)
3. Pool value increases
4. NAV recalculates (e.g., 1.00 → 1.10)
5. Investor sees increased value
6. Verify yield calculation is correct
```

**Flow 3: Redemption Flow**
```
1. Navigate to Redeem page
2. Enter redemption amount
3. Confirm redemption transaction
4. Burn uLP tokens
5. Receive Ondo EUROD (EUROD) (principal + yield)
6. Verify profit realized
```

### 7.2 Security Review

**Checklist:**
- [ ] Slither analysis passes (0 critical, 0 high)
- [ ] No reentrancy vulnerabilities
- [ ] Access control verified (only admin can add yield)
- [ ] Integer overflow/underflow protected (Solidity 0.8.20+)
- [ ] Reentrancy guards in place
- [ ] Front-running protection
- [ ] Test coverage >90%
- [ ] Manual code review completed

### 7.3 Performance Testing

**Metrics:**
- Frontend load time <3 seconds
- API response time <200ms (p95)
- Smart contract gas costs within estimates
- Concurrent user support (100+ users)

### 7.4 Task Checklist

- [ ] Write E2E test scripts
- [ ] Execute all test flows
- [ ] Run security scan (Slither)
- [ ] Fix all critical/high issues
- [ ] Verify test coverage
- [ ] Performance testing
- [ ] Bug fixes
- [ ] Regression testing

---

## 8. Phase 6: Deployment & Demo

**Timeline:** Week 8
**Owner:** DevOps + Tech Lead
**Status:** 🔄 Not Started

### 8.1 Testnet Deployment

**Steps:**
1. Acquire testnet MATIC (faucet)
2. Run deployment script
3. Verify contracts on Polygonscan
4. Update environment variables
5. Deploy frontend (Vercel/Netlify)
6. Deploy backend (Railway/Heroku)
7. Smoke test deployment

### 8.2 Demo Preparation

**Deliverables:**
- [ ] Demo script written
- [ ] Demo accounts funded
- [ ] Presentation deck ready
- [ ] Video recording (optional)
- [ ] FAQ document

### 8.3 Documentation

**Deliverables:**
- [ ] Smart contract documentation (NatSpec)
- [ ] API documentation (OpenAPI)
- [ ] Frontend component documentation (Storybook)
- [ ] User guide for MVP
- [ ] Investor presentation deck
- [ ] Release notes

### 8.4 Task Checklist

- [ ] Deploy to Polygon Amoy
- [ ] Verify all contracts
- [ ] Update contract addresses in config
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Execute smoke tests
- [ ] Prepare demo
- [ ] Write release notes
- [ ] MVP launch announcement

---

## 9. Appendix A: MVP Directory Structure

See Phase 1, Section 3.1 for complete directory structure.

---

## 10. Appendix B: Configuration Reference

### B.1 Frontend Configuration

See Phase 1, Section 3.2 for `MVPConfig.ts`

### B.2 Backend Configuration

See Phase 1, Section 3.2 for `MVP_config.py`

### B.3 Environment Variables

See Phase 1, Section 3.3 for `.env.MVP` files

---

## 11. Appendix C: Mock Service Interfaces

### C.1 IBankService Interface

```typescript
interface IBankService {
  createEscrowAccount(investorId: string): Promise<string>;
  initiateWireTransfer(from: string, to: string, amount: bigint): Promise<string>;
  getBalance(accountId: string): Promise<bigint>;
  getTransactions(accountId: string): Promise<Transaction[]>;
}
```

### C.2 IGDIZService Interface

```typescript
interface IGDIZService {
  getIndustrialList(): Promise<Industrial[]>;
  getIndustrialDetails(industrialId: string): Promise<Industrial>;
  simulateProductionData(industrialId: string): Promise<ProductionData>;
  simulateRepayment(financingId: string, principal: bigint, rate: number, days: number): Promise<Repayment>;
}
```

**Reference:** `04_MVP_MOCKING_AND_TESTNET_STRATEGY.md` Section 3

---

## 12. Appendix D: Deep Dive Technical Documentation

### D.1 Purpose

The Deep Dive is a comprehensive technical documentation page in the UJAMAA DeFi frontend that explains how the platform works through interactive visualizations, animations, and detailed explanations.

### D.2 Target Audience

- **Technical Investors** - Want to understand the architecture before investing
- **Developers** - Evaluating the platform for integration or contribution
- **Students/Researchers** - Learning about DeFi and tokenization
- **Partners** - Understanding technical capabilities

### D.3 Content Sections

| Section | Content | Visual Elements |
|---------|---------|-----------------|
| **Architecture** | System layers, data flow, components | Interactive diagram, hover explanations |
| **Smart Contracts** | uLPToken, LiquidityPool mechanics | Code snippets, function diagrams |
| **Yield Calculation** | NAV accrual, mathematical formulas | Animated charts, step-by-step breakdown |
| **Mock Services** | Testnet vs production explanation | Comparison tables, swap procedure |
| **Security** | Audits, access control, safeguards | Security badge display, checklist |

### D.4 Technical Implementation

**Dependencies:**
```json
{
  "framer-motion": "^11.0.0",
  "recharts": "^2.0.0",
  "react-syntax-highlighter": "^15.5.0",
  "@heroicons/react": "^2.1.0"
}
```

**Key Design Patterns:**
- Component-based architecture
- Lazy loading for sections
- Smooth scroll navigation
- Responsive design (mobile-first)

### D.5 Content Management

**Markdown Structure:**
```markdown
---
section: "architecture"
title: "System Architecture"
order: 1
---

## Layer 1: Tokenization

The tokenization layer handles ERC-3643 token minting...

[Diagram: Tokenization Flow]
```

### D.6 Success Metrics

- ✅ Page load time <3 seconds
- ✅ All sections interactive
- ✅ Mobile responsive
- ✅ Dark mode support
- ✅ Accessibility (WCAG 2.1 AA)

---

## 13. Appendix E: Investors Room Documentation Portal

### E.1 Purpose

The Investors Room is a dedicated Investor Documentation Portal - a beautiful, modern React web application for browsing UJAMAA DeFi's investor documentation.

### E.2 Mission

Provide a centralized hub for investors to access all legal, compliance, and investment documentation with intelligent search and navigation.

### E.3 Document Categories

| Category | Description | Example Documents |
|----------|-------------|-------------------|
| **Getting Started** | Platform introduction | Platform Overview, How It Works, Risk Disclosure |
| **Legal** | Terms, policies, agreements | Terms of Service, Privacy Policy, KYC/AML Policy |
| **Investment** | Investment guides | Ujamaa Pool Token (uLP) Guide, Liquidity Pools, Yield Explanation |
| **Compliance** | Regulatory information | Accredited Investor, Tax Implications, Regulatory Framework |

### E.4 Status System

| Status | Icon | Color | Description | When to Read |
|--------|------|-------|-------------|--------------|
| **Required** | 🟢 | Green | Must read before investing | Before first investment |
| **Recommended** | 🟡 | Yellow | Should read for understanding | Before significant investment |
| **Reference** | 🔵 | Blue | Use as needed | When needed |
| **Per-Offering** | 🟣 | Purple | Specific to each investment | Per investment decision |
| **Template** | ⚪ | Gray | For creating new documents | Internal use |

### E.5 Search Implementation

**Search Algorithm:**
```typescript
function searchDocuments(query: string, documents: InvestorDocument[]): SearchResult[] {
  const results = documents
    .filter(doc => {
      const titleMatch = doc.title.toLowerCase().includes(query.toLowerCase());
      const descMatch = doc.description.toLowerCase().includes(query.toLowerCase());
      const contentMatch = searchInContent(doc.contentPath, query);
      return titleMatch || descMatch || contentMatch;
    })
    .map(doc => ({
      ...doc,
      relevance: calculateRelevance(doc, query),
    }))
    .sort((a, b) => b.relevance - a.relevance);

  return results;
}
```

### E.6 Initial Document Set (10 Documents)

1. **Platform Overview** (Required, Getting Started)
2. **How It Works** (Required, Getting Started)
3. **Risk Disclosure** (Required, Getting Started)
4. **Terms of Service** (Required, Legal)
5. **Privacy Policy** (Required, Legal)
6. **KYC/AML Policy** (Recommended, Legal)
7. **Ujamaa Pool Token (uLP) Guide** (Recommended, Investment)
8. **Liquidity Pools** (Recommended, Investment)
9. **Yield Explanation** (Recommended, Investment)
10. **Tax Implications** (Reference, Compliance)

### E.7 Technical Requirements

**Performance:**
- Search results in <100ms
- Document load in <500ms
- Lighthouse score >90

**Accessibility:**
- Keyboard navigation
- Screen reader support
- High contrast mode
- Text resizing (up to 200%)

**SEO:**
- Meta tags for each document
- Sitemap.xml
- Structured data (Schema.org)

### E.8 Future Enhancements

- [ ] Multi-language support (French, English)
- [ ] PDF export for documents
- [ ] Print-friendly layouts
- [ ] Document versioning
- [ ] User annotations
- [ ] Reading progress tracking
- [ ] Email document delivery

---

## 14. Appendix F: Frontend Specification Integration

### F.1 Purpose

This appendix provides guidance on how to use the **MVP Frontend Specification** (`05_MVP_FRONTEND_SPECIFICATION.md`) in conjunction with this Implementation Plan.

### F.2 Document Relationship

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOCUMENT HIERARCHY                            │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ SRS v2.0 (Master Specification - 6,054 lines)             │ │
│  │ • Complete production requirements                         │ │
│  │ • All features (testnet + production)                      │ │
│  │ • Authoritative reference                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ MVP Implementation Plan (This Document)                 │ │
│  │ • Step-by-step implementation guide                        │ │
│  │ • Week-by-week timeline                                    │ │
│  │ • Task checklists                                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                   │
│              ┌───────────────┴───────────────┐                  │
│              │                               │                  │
│              ▼                               ▼                  │
│  ┌───────────────────────┐       ┌───────────────────────────┐ │
│  │ Frontend Specification│       │ Other Specifications      │ │
│  │ (1,400+ lines)        │       │ • Smart Contract Spec     │ │
│  │ • Design System       │       │ • API Specification       │ │
│  │ • Component Library   │       │ • Compliance Framework    │ │
│  │ • Page Specifications │       │ • Asset Risk Guide        │ │
│  │ • User Flows          │       │                           │ │
│  │ • Accessibility       │       │                           │ │
│  │ • Performance         │       │                           │ │
│  └───────────────────────┘       └───────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### F.3 How to Use This Together

#### For Frontend Developers:

1. **Start Here:** Read this Implementation Plan Phase 4 (Frontend) for timeline and task overview

2. **Then Go To:** Frontend Specification for detailed implementation guidance:
   - **Section 3:** Visual Design System (colors, typography, spacing)
   - **Section 4:** Technology Stack & Project Structure
   - **Section 5:** Page Specifications (layouts, components, data requirements)
   - **Section 6:** Component Library (API docs, usage examples)
   - **Section 7:** User Flows (step-by-step interaction flows)
   - **Section 8:** Accessibility Requirements
   - **Section 9:** Performance Requirements
   - **Section 10:** Security Requirements
   - **Section 11:** Testing Strategy

3. **Implementation Order:**
   ```
   Week 5:  Frontend Spec Section 3 (Design System)
            Frontend Spec Section 6.1 (Base Components)

   Week 6:  Frontend Spec Section 5.1 (Dashboard)
            Frontend Spec Section 6.2 (Complex Components)

   Week 7:  Frontend Spec Section 5.2 (Pool Marketplace)
            Frontend Spec Section 5.3 (Pool Detail)

   Week 8:  Frontend Spec Section 5.4 (Subscribe Flow)
            Frontend Spec Section 5.5 (Portfolio)
            Frontend Spec Section 4.5 (Web3 Integration)

   Week 9:  Frontend Spec Section 5.6 (Compliance)
            Frontend Spec Section 8 (Accessibility)
            Frontend Spec Section 11 (Testing)
   ```

#### For Designers:

1. **Primary Reference:** Frontend Specification Section 3 (Visual Design System)
2. **Component Designs:** Frontend Specification Section 6 (Component Library)
3. **Page Designs:** Frontend Specification Section 5 (Page Specifications)
4. **Accessibility:** Frontend Specification Section 8 (WCAG 2.2 AA)

#### For QA Engineers:

1. **Test Planning:** Frontend Specification Section 11 (Testing Strategy)
2. **Accessibility Testing:** Frontend Specification Section 8 (Accessibility)
3. **Performance Testing:** Frontend Specification Section 9 (Performance)

### F.4 Key Frontend Specification Highlights

#### Design System (Section 3)

**Color Palette:**
```typescript
// Primary - Trust & Stability (Stripe-inspired)
primary: {
  50: '#F0F7FF', 100: '#E0EFFF', 200: '#B9DFFF',
  300: '#7FC8FF', 400: '#36A8FF', 500: '#0082E6',
  600: '#0066B8', 700: '#005299', 800: '#00407A',
  900: '#0A2540',
}

// Semantic Colors
success: '#10B981',  // Yields, positive changes
warning: '#F59E0B',  // Pending states
danger:  '#EF4444',  // Errors, critical alerts
info:    '#3B82F6',  // Neutral information
```

**Typography:**
- Font: Inter (Google Fonts, free)
- Scale: 8-tier (display, h1, h2, h3, lg, base, sm, xs)
- Weights: normal (400), medium (500), semibold (600), bold (700)

**Spacing:** 8px grid system
- space-1: 4px, space-2: 8px, space-3: 12px, space-4: 16px
- space-6: 24px, space-8: 32px, space-12: 48px, space-16: 64px

#### Component Examples (Section 6)

**Button Component:**
```tsx
import { Button } from '@/components/ui/Button';

// Primary action
<Button onClick={handleSubscribe}>
  Subscribe to Pool
</Button>

// Secondary action
<Button variant="secondary" onClick={handleCancel}>
  Cancel
</Button>

// With loading state
<Button disabled={isLoading}>
  {isLoading ? <Spinner /> : null}
  Processing...
</Button>
```

**KPICard Component:**
```tsx
import { KPICard } from '@/components/dashboard/KPICard';

<KPICard
  title="Total Value"
  value="€2,450,000"
  change={{ value: 2.3, period: '24h' }}
  status="positive"
  live={true}
/>
```

#### Page Layouts (Section 5)

**Dashboard Overview (Section 5.1):**
```
┌─────────────────────────────────────────────────────────┐
│  Header                                                  │
├─────────────────────────────────────────────────────────┤
│  Sidebar │  KPI Cards (Total Value, Yield, Pools)       │
│          │  Portfolio Allocation Chart                  │
│          │  Yield Accrual Chart                         │
│          │  Active Pool Positions Table                 │
│          │  Recent Transactions                         │
│          │  Compliance Status                           │
└─────────────────────────────────────────────────────────┘
```

#### User Flows (Section 7)

**First-Time Institutional Investor:**
1. Landing Page → Get Started
2. Onboarding (email, company, wallet)
3. KYB Submission (documents)
4. Compliance Review
5. Guided Platform Tour
6. First Investment
7. Post-Investment (portfolio tracking)

**Repeat Investment:**
1. Login (connect wallet)
2. Dashboard (view performance)
3. Browse Pools
4. Subscribe (amount → terms → funding → confirm)
5. Confirmation (progress tracking)

### F.5 Cross-References

| Implementation Plan Section | Frontend Spec Section |
|----------------------------|----------------------|
| Phase 4.1: Design System | Section 3 (Visual Design System) |
| Phase 4.2: Base Components | Section 6.1 (Base Components) |
| Phase 4.3: Layout | Section 4.3 (Project Structure) |
| Phase 4.4: Dashboard | Section 5.1 (Dashboard Overview) |
| Phase 4.5: Pool Marketplace | Section 5.2 (Pool Marketplace) |
| Phase 4.6: Pool Detail | Section 5.3 (Pool Detail Page) |
| Phase 4.7: Subscribe Flow | Section 5.4 (Subscribe Flow) |
| Phase 4.8: Portfolio | Section 5.5 (Portfolio Page) |
| Phase 4.9: Compliance | Section 5.6 (Compliance Dashboard) |
| Phase 4.11: Web3 | Section 4.5 (Web3 Integration) |
| Phase 4.12: Testing | Section 11 (Testing Strategy) |
| Phase 4.13: A11y & Perf | Section 8 (Accessibility), Section 9 (Performance) |

### F.6 Compliance Checklist

Before considering frontend complete, verify:

**Design System:**
- [ ] All colors match Frontend Spec Section 3.1
- [ ] Typography follows Section 3.2 scale
- [ ] Spacing uses 8px grid (Section 3.3)
- [ ] Border radius follows Section 3.4
- [ ] Shadows match Section 3.5

**Components:**
- [ ] All base components implemented per Section 6.1
- [ ] Component APIs match specification
- [ ] Variants and sizes implemented
- [ ] Accessibility attributes (ARIA) included

**Pages:**
- [ ] All layouts match Section 5 specifications
- [ ] Required components present
- [ ] Data requirements met
- [ ] User flows follow Section 7

**Accessibility:**
- [ ] WCAG 2.2 AA compliance (Section 8)
- [ ] Color contrast ≥4.5:1
- [ ] Keyboard navigation works
- [ ] Focus indicators visible (3:1 contrast)
- [ ] Touch targets ≥48x48px
- [ ] Screen reader compatible

**Performance:**
- [ ] FCP <1.5s (Section 9)
- [ ] TTI <3.5s
- [ ] API response <500ms (P95)
- [ ] Bundle size <200KB initial JS
- [ ] Lighthouse score >90

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 17, 2026 | Aziz Da Silva | Initial MVP implementation plan |
| 2.0 | March 17, 2026 | Aziz Da Silva | Updated with mocking strategy, enhanced phases |
| 3.0 | March 17, 2026 | Aziz Da Silva | Added Deep Dive + Investors Room |
| 4.0 | March 17, 2026 | Aziz Da Silva | Integrated Frontend Specification v1.0 |
| 4.1 | March 17, 2026 | Aziz Da Silva | Integrated Mocking Strategy v2.0 |
| 4.2 | March 17, 2026 | Aziz Da Silva | Added Wallet Integration (Frontend Spec Section 5.7) |
| 4.3 | March 17, 2026 | Aziz Da Silva | Web3 Architecture Guide compliance verified |
| 4.4 | March 17, 2026 | Aziz Da Silva | Added Proof of Reserve (Frontend Spec Section 5.8) |
| 5.0 | March 19, 2026 | Aziz Da Silva | Integrated Design System Specification + Deep Dive & Investors Room |
| 5.2 | March 19, 2026 | Aziz Da Silva | Added Disclaimer Modal (10-second auto-dismiss + manual redisplay) |
| **5.3** | **March 19, 2026** | **Aziz Da Silva** | **Integrated 2026 Design Trends (World-Class Fintech UX)** |

### Changes in v5.3:

**New Section:**
- **2026 DESIGN TRENDS INTEGRATION** - World-Class Fintech UX (~600 lines)
  - Industry research from G & Co, Digidop, Gezar (March 2026)
  - Visual design trends (Liquid Glass, Aurora UI, Bento Grid, Claymorphism, Kinetic Typography)
  - Enhanced color palette (trust & stability focused)
  - Typography system (8-tier responsive scale)
  - Landing Page Strategy 2026 (P0 - Critical)
  - Trust Signals placement strategy
  - Microinteractions & visual feedback
  - Responsive design strategy
  - Performance optimization
  - Animation guidelines
  - Comprehensive design checklist

**Key Design Trends Added:**

1. **Liquid Glass (Advanced Glassmorphism)**
   - Frosted glass effects with `backdrop-filter: blur(20px)`
   - Layered depth with transparency
   - Best for: Cards, modals, hero sections

2. **Aurora UI (Animated Gradient Meshes)**
   - Animated gradient backgrounds
   - Soft color transitions
   - Best for: Hero sections, landing pages

3. **Bento Grid Layout**
   - Japanese lunch box-style grid
   - Varying card sizes for hierarchy
   - Best for: Features, stats, product categories

4. **Claymorphism (3D Clay-Like Elements)**
   - Playful, tactile appearance
   - Inner shadows + rounded corners
   - Best for: CTA cards, onboarding steps

5. **Kinetic Typography**
   - Animated, reactive text
   - Hover effects with gradients
   - Best for: Headlines, value propositions

**Enhanced Features:**

**Landing Page Strategy (P0 - Critical):**
- Above the fold wireframe (first 900px)
- Founder/team visibility
- Proof elements (metrics, badges, logos)
- Clear value proposition (<5 second read)
- Interactive elements (calculator, demo)

**Trust Signals:**
- Placement strategy (header, hero, features, dashboard, footer)
- Security badges visible above fold
- Customer testimonials integrated early
- Compliance indicators throughout

**Color Palette 2026:**
- Primary: Trust & stability (blue scale)
- Semantic: Success, warning, danger, info
- Dark mode: Deep backgrounds with vivid accents
- Never pure black (#0f172a instead)

**Typography System:**
- 8-tier responsive scale (clamp functions)
- Display: 48px-96px for hero headlines
- Inter + Plus Jakarta Sans + JetBrains Mono

**Microinteractions:**
- Button states (hover, active)
- Loading skeletons
- Toast notifications
- Progress indicators

**Performance Targets:**
- FCP <1.5s
- TTI <3.5s
- Bundle <200KB initial JS
- AVIF/WebP images
- Code splitting by route

**Updated Tasks:**
- Phase 4.1: Added Liquid Glass, Aurora backgrounds, Dark Mode, Kinetic Typography
- Landing Page elevated to P0 priority (Week 5)

**Document Consistency:**

| Document | Status | Notes |
|----------|--------|-------|
| Design System Spec | ✅ Source of Truth | March 19, 2026 |
| Deep Dive & Investors Room | ✅ Fully Aligned | March 19, 2026 |
| Mocking Strategy v2.0 | ✅ Fully Aligned | March 17, 2026 |
| Web3 Architecture Guide | ✅ Source of Truth | March 15, 2026 |
| SRS v2.0 | ✅ Fully Aligned | Production baseline |
| **2026 Design Trends** | ✅ **NEW** | **Industry research (G & Co, Digidop, Gezar)** |

**Approval Required:** Proceed with MVP implementation

**Next Step:** Begin Week 1, Day 1 tasks (Project Structure Setup)

---

**Related Documents:**
- `01_MVP_SPECIFICATION.md` - MVP specification
- `04_MVP_MOCKING_AND_TESTNET_STRATEGY.md` - ⭐ **Mocking Strategy v2.0**
- `09_DEEP_DIVE_INVESTORS_ROOM.md` - ⭐ **Deep Dive & Investors Room Implementation**
- `docs/01_SPECIFICATIONS/01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` - SRS v2.0
- `docs/01_SPECIFICATIONS/04_DESIGN_SYSTEM_SPECIFICATION.md` - ⭐ **Design System Specification (Reusable)**
- `docs/02_TECHNICAL_GUIDES/08_WEB3_ARCHITECTURE_GUIDE.md` - ⭐ **Web3 Architecture (Non-Custodial)**
- `docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md` - Algorithm specifications

---

## 14. Appendix F: Design System Integration ⭐ **NEW**

### F.1 Purpose

This appendix provides guidance on how to use the **Design System Specification** (`docs/01_SPECIFICATIONS/04_DESIGN_SYSTEM_SPECIFICATION.md`) in conjunction with this Implementation Plan.

### F.2 Key Principle

**The Design System is CONTENT-AGNOSTIC:**
- It defines **HOW** to build (UI/UX patterns, components, architecture)
- Your project defines **WHAT** to build (business logic, domain features, user roles)

**Example:**
- Design System: Provides Button, Card, DataTable components
- Your Project: Decides what data to show, what actions to enable

### F.3 Design System Components

**Reusable Patterns:**
- **Color Palette** - Primary, secondary, accent, semantic colors
- **Typography** - Font families, sizes, weights
- **Spacing** - 8px grid system
- **Shadows** - Soft, glow effects
- **Animations** - Fade, float, gradient, carousel

**Component Library:**
- **Base UI** - Button, Badge, Card, Input, StatusBadge
- **Layout** - Header, Footer, Layout (with role-based access)
- **Feature** - DataTable, StatsCard, Chart Panel, ActivityFeed

**Page Templates:**
- Landing Page
- Dashboard
- Detail Page
- Multi-step Form

### F.4 How to Use

**For Frontend Developers:**

1. **Start Here:** Implementation Plan Phase 4 for timeline
2. **Then Go To:** Design System Spec for:
   - Section 2: Design Tokens (colors, typography, spacing)
   - Section 4: Component Library (API docs, examples)
   - Section 5: Page Templates (layouts, structure)
   - Section 10: Build Configuration (Vite, Tailwind, TypeScript)
   - Section 11: Accessibility (WCAG 2.1 checklist)
   - Section 12: Performance (optimization strategies)

**For Designers:**
- Section 2: Design System (colors, typography, shadows)
- Section 4: Component patterns
- Section 5: Page layouts

**For QA:**
- Section 11: Accessibility testing
- Section 12: Performance testing

### F.5 Implementation Order

```
Week 5-6: Design System Spec Section 2 (Design Tokens)
          Design System Spec Section 4.1 (Base Components)

Week 6-7: Design System Spec Section 5.2 (Dashboard Template)
          Design System Spec Section 4.2 (Layout Components)

Week 7-8: Design System Spec Section 5.3 (Detail Page Template)
          Design System Spec Section 4.3 (Feature Components)

Week 8-9: Design System Spec Section 11 (Accessibility)
          Design System Spec Section 12 (Performance)
```

### F.6 Customization Guide

**To adapt the Design System for your project:**

1. **Update Design Tokens:**
   - Replace colors in `tailwind.config.js`
   - Update fonts for your brand
   - Adjust spacing if needed

2. **Define Your Roles:**
   ```typescript
   // Your project defines roles
   type UserRole = 'INVESTOR' | 'ORIGINATOR' | 'ADMIN' | null;
   ```

3. **Replace Domain Logic:**
   ```typescript
   // Replace Web3 domain with your domain
   // DomainProvider instead of Web3Providers
   ```

4. **Keep UI Patterns:**
   - Button variants
   - Card layouts
   - Table structures
   - Form patterns

---

## 15. Appendix G: Deep Dive & Investors Room Guide ⭐ **NEW**

### G.1 Purpose

This appendix provides comprehensive implementation guidance for the **Deep Dive** technical documentation page and **Investors Room** documentation portal.

### G.2 Primary Reference

**Main Guide:** `09_DEEP_DIVE_INVESTORS_ROOM.md` (300+ lines)
- Complete implementation summary
- Feature checklists
- Integration points
- Future enhancements

### G.3 Deep Dive (`/deep-dive`)

**Purpose:** Comprehensive technical documentation for technical users

**Target Audience:**
- Technical investors
- Developers
- Students/researchers
- Partners

**6 Sections:**
1. Architecture Overview (diagram, components, tech stack)
2. Smart Contracts (hierarchy, features, code examples)
3. Backend Services (architecture, formulas, APIs)
4. API Reference (endpoints, responses, errors)
5. Security Model (4 layers, jurisdictions, compliance)
6. Performance (targets, optimizations)

**File:** `frontend/src/MVP/pages/institutional/DeepDive.tsx`

**Implementation:** See Phase 4.10 (this document) + `09_DEEP_DIVE_INVESTORS_ROOM.md` Section 1

### G.4 Investors Room (`/investors-room`)

**Purpose:** Investor documentation portal with search

**Features:**
- 6 document categories (22 documents total)
- Full-text search
- Category filtering
- Featured documents
- Document modal with details

**Document Categories:**
1. Onboarding (5 docs)
2. Asset Offerings (3 docs)
3. Ongoing Reporting (3 docs)
4. Legal & Compliance (4 docs)
5. Educational (5 docs)
6. Templates (2 docs)

**File:** `frontend/src/MVP/pages/institutional/InvestorsRoom.tsx`

**Implementation:** See Phase 4.10 (this document) + `09_DEEP_DIVE_INVESTORS_ROOM.md` Section 2

### G.5 Integration Checklist

- [ ] Add routes to `App.tsx`
- [ ] Add navigation links to Header
- [ ] Create initial documents (10 minimum)
- [ ] Test search functionality
- [ ] Test category filtering
- [ ] Test responsive design
- [ ] Test accessibility

### G.6 Success Criteria

**Deep Dive:**
- ✅ All 6 sections complete
- ✅ Interactive elements working
- ✅ Code syntax highlighting
- ✅ Responsive design

**Investors Room:**
- ✅ 6 categories implemented
- ✅ 22 documents loaded (min 10)
- ✅ Search functional
- ✅ Filtering works
- ✅ Featured docs displayed

---

**Document Hierarchy:**
```
Implementation Plan v5.1 (This Document)
    │
    ├─→ Design System Spec (2,000+ lines) ⭐ NEW
    │   ├─ Reusable UI/UX Patterns
    │   ├─ Component Library (content-agnostic)
    │   ├─ Page Templates
    │   ├─ Architecture Patterns
    │   └─ Build Configuration
    │
    ├─→ Deep Dive & Investors Room (300+ lines) ⭐ NEW
    │   ├─ Deep Dive Implementation
    │   ├─ Investors Room Implementation
    │   ├─ Integration Guide
    │   └─ Success Criteria
    │
    ├─→ Mocking Strategy v2.0 (1,758 lines)
    │   ├─ Mock Services
    │   ├─ Testnet Deployment
    │   ├─ Production Swap
    │   └─ Frontend Mock Components
    │
    └─→ Web3 Architecture Guide (Source of Truth)
        ├─ Non-Custodial Model
        ├─ Self-Custody Principle
        └─ Smart Contract Enforcement
```

---

**END OF DOCUMENT**




