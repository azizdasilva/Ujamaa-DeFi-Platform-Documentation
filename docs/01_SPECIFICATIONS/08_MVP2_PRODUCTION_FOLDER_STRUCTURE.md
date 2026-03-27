# UJAMAA DeFi Platform - MVP Production Folder Structure

**Author:** Aziz Da Silva - Lead Architect
**Version:** 2.0 (MVP with Production Quality)
**Date:** March 19, 2026
**Purpose:** Production-ready folder structure WITH MVP naming (testnet/mock services preserved)

---

## Overview

This document defines the **MVP folder structure** for the UJAMAA DeFi Platform. This is a **hybrid approach**:

- ✅ **Production-quality code** (clean architecture, testing, documentation)
- ✅ **MVP naming preserved** (clear testnet/mock identification)
- ✅ **Mock services explicit** (easy to swap for production later)
- ✅ **Ready for investor demo** (Logic Capital presentation)

**Key Principle:** MVP is **NOT throwaway code** - it's production-quality code with mock services that will be swapped for real integrations in production.

---

## Frontend Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   └── assets/
│       ├── images/
│       ├── fonts/
│       └── icons/
│
├── src/
│   ├── MVP/                       # MVP specific code (production quality)
│   │   │
│   │   ├── components/             # MVP UI components
│   │   │   ├── MVPBanner.tsx              # Testnet banner (all pages)
│   │   │   ├── TestnetNotice.tsx           # First-time visitor modal
│   │   │   ├── MockDataBadge.tsx           # Mock data indicator
│   │   │   ├── DisclaimerModal.tsx         # 10-second auto-dismiss
│   │   │   ├── PoolCard.tsx                # Pool display card
│   │   │   ├── YieldChart.tsx              # Yield visualization
│   │   │   ├── ReserveWidget.tsx           # Proof of reserve display
│   │   │   └── index.ts
│   │   │
│   │   ├── pages/                  # MVP pages (by role)
│   │   │   ├── institutional/      # Institutional investor (€100K+)
│   │   │   │   ├── InstitutionalDashboard.tsx
│   │   │   │   ├── YieldStatement.tsx
│   │   │   │   └── index.ts
│   │   │   ├── retail/             # Retail investor (<€100K)
│   │   │   │   ├── RetailDashboard.tsx
│   │   │   │   ├── SimplifiedPortfolio.tsx
│   │   │   │   └── index.ts
│   │   │   ├── originator/         # Asset originators
│   │   │   │   ├── OriginatorDashboard.tsx
│   │   │   │   ├── AssetSubmission.tsx
│   │   │   │   ├── CapitalRaiseTracker.tsx
│   │   │   │   ├── ProductionNotarization.tsx
│   │   │   │   └── index.ts
│   │   │   ├── compliance/         # Compliance officers
│   │   │   │   ├── ComplianceDashboard.tsx
│   │   │   │   ├── KYCApprovalQueue.tsx
│   │   │   │   ├── AccreditationManager.tsx
│   │   │   │   ├── RegulatoryReporting.tsx
│   │   │   │   └── index.ts
│   │   │   ├── admin/              # Administrators
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── UserManagement.tsx
│   │   │   │   ├── AssetApproval.tsx
│   │   │   │   └── index.ts
│   │   │   ├── regulator/          # Regulators (read-only)
│   │   │   │   ├── RegulatorDashboard.tsx
│   │   │   │   ├── ComplianceMetrics.tsx
│   │   │   │   ├── TransactionMonitor.tsx
│   │   │   │   └── index.ts
│   │   │   ├── diaspora/           # Diaspora investors
│   │   │   │   ├── DiasporaDashboard.tsx
│   │   │   │   ├── OverseasKYC.tsx
│   │   │   │   ├── DualCurrencyDistribution.tsx
│   │   │   │   └── index.ts
│   │   │   ├── mobile/             # Mobile money users
│   │   │   │   ├── MobileMoneyConnect.tsx
│   │   │   │   ├── USSDInterface.tsx
│   │   │   │   └── index.ts
│   │   │   ├── pools/              # Pool marketplace
│   │   │   │   ├── PoolMarketplace.tsx
│   │   │   │   ├── PoolDetail.tsx
│   │   │   │   ├── PoolPerformance.tsx
│   │   │   │   └── index.ts
│   │   │   ├── portfolio/          # Portfolio management
│   │   │   │   ├── Portfolio.tsx
│   │   │   │   ├── TransactionHistory.tsx
│   │   │   │   └── index.ts
│   │   │   ├── onboarding/         # Onboarding flows
│   │   │   │   ├── InvestorOnboarding.tsx
│   │   │   │   ├── OriginatorOnboarding.tsx
│   │   │   │   └── index.ts
│   │   │   ├── documentation/      # Documentation
│   │   │   │   ├── DeepDive.tsx
│   │   │   │   ├── InvestorsRoom.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── hooks/                  # MVP custom hooks
│   │   │   ├── useMVPMode.ts              # MVP mode flag
│   │   │   ├── useMockBank.ts              # Mock bank service
│   │   │   ├── useMockGDIZ.ts              # Mock GDIZ service
│   │   │   ├── useuLPToken.ts              # uLP token operations
│   │   │   ├── usePools.ts                 # Pool operations
│   │   │   ├── useKYC.ts                   # KYC operations
│   │   │   ├── useCompliance.ts            # Compliance operations
│   │   │   └── index.ts
│   │   │
│   │   ├── contexts/               # MVP React contexts
│   │   │   ├── MVPModeContext.tsx         # MVP mode (testnet/prod)
│   │   │   ├── MockServicesContext.tsx     # Mock service configuration
│   │   │   └── index.ts
│   │   │
│   │   ├── services/               # MVP API clients
│   │   │   ├── mockBankService.ts          # Mock bank API
│   │   │   ├── mockGDIZService.ts          # Mock GDIZ API
│   │   │   ├── poolService.ts              # Pool API
│   │   │   ├── investorService.ts          # Investor API
│   │   │   ├── originatorService.ts        # Originator API
│   │   │   ├── complianceService.ts        # Compliance API
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/                  # MVP utilities
│   │   │   ├── mockData.ts                 # Mock data generators
│   │   │   ├── MVPConfig.ts               # MVP configuration
│   │   │   ├── navCalculator.ts            # NAV calculations
│   │   │   ├── yieldCalculator.ts          # Yield calculations
│   │   │   └── index.ts
│   │   │
│   │   ├── constants/              # MVP constants
│   │   │   ├── MVPAddresses.ts            # Contract addresses (testnet)
│   │   │   ├── mockDataConstants.ts        # Mock data constants
│   │   │   └── index.ts
│   │   │
│   │   ├── types/                  # MVP TypeScript types
│   │   │   ├── pool.ts
│   │   │   ├── investor.ts
│   │   │   ├── originator.ts
│   │   │   ├── compliance.ts
│   │   │   ├── mockServices.ts
│   │   │   └── index.ts
│   │   │
│   │   └── styles/                 # MVP specific styles
│   │       ├── MVP-components.css
│   │       ├── testnet-indicators.css
│   │       └── index.css
│   │
│   ├── components/                 # Shared components (MVP-1 + MVP)
│   │   ├── common/                 # Base components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── layout/                 # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── hooks/                      # Shared hooks
│   │   ├── useWallet.ts
│   │   └── index.ts
│   │
│   ├── contexts/                   # Shared contexts
│   │   ├── WalletContext.tsx
│   │   └── index.ts
│   │
│   ├── services/                   # Shared API clients
│   │   ├── api.ts
│   │   └── index.ts
│   │
│   ├── utils/                      # Shared utilities
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── index.ts
│   │
│   ├── types/                      # Shared types
│   │   ├── common.ts
│   │   └── index.ts
│   │
│   ├── config/                     # Configuration
│   │   ├── network.ts
│   │   ├── contracts.ts
│   │   └── index.ts
│   │
│   ├── contracts/                  # Contract ABIs
│   │   ├── uLPToken.json
│   │   ├── LiquidityPool.json
│   │   ├── MockEscrow.json
│   │   ├── MockFiatRamp.json
│   │   └── index.ts
│   │
│   ├── App.tsx                     # Main application
│   ├── App.css                     # App styles
│   ├── index.css                   # Global styles
│   └── main.tsx                    # Entry point
│
├── tests/                          # Test files
│   ├── MVP/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│   └── shared/
│
├── .env                            # Environment variables
├── .env.MVP                       # MVP environment
├── .env.production                 # Production environment (future)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## Backend Structure

```
backend/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   │
│   ├── api/
│   │   ├── v1/                     # MVP-1 API (unchanged)
│   │   │   ├── __init__.py
│   │   │   ├── assets.py
│   │   │   ├── compliance.py
│   │   │   └── auth.py
│   │   │
│   │   └── MVP/                   # MVP API (NEW)
│   │       ├── __init__.py
│   │       ├── pools.py                    # Pool operations
│   │       ├── investors.py                # Investor operations
│   │       ├── originators.py              # Originator operations
│   │       ├── compliance.py               # Compliance operations
│   │       ├── regulator.py                # Regulator operations
│   │       ├── mock_bank.py                # Mock bank API
│   │       ├── mock_gdiz.py                # Mock GDIZ API
│   │       └── docs.py                     # Documentation
│   │
│   ├── services/
│   │   ├── MVP/                   # MVP services (NEW)
│   │   │   ├── __init__.py
│   │   │   ├── pool_service.py             # Pool management
│   │   │   ├── yield_calculation.py        # Yield calculations
│   │   │   ├── mock_bank_service.py        # Mock bank service
│   │   │   ├── mock_gdiz_service.py        # Mock GDIZ service
│   │   │   ├── investor_service.py         # Investor management
│   │   │   ├── originator_service.py       # Originator management
│   │   │   ├── compliance_service.py       # Compliance operations
│   │   │   └── regulator_service.py        # Regulator operations
│   │   │
│   │   └── [existing MVP-1 services - UNTOUCHED]
│   │
│   ├── models/
│   │   ├── MVP/                   # MVP models (NEW)
│   │   │   ├── __init__.py
│   │   │   ├── pool.py
│   │   │   ├── investor.py
│   │   │   ├── originator.py
│   │   │   ├── compliance.py
│   │   │   └── transaction.py
│   │   │
│   │   └── [existing MVP-1 models - UNTOUCHED]
│   │
│   ├── schemas/
│   │   ├── MVP/                   # MVP schemas (NEW)
│   │   │   ├── __init__.py
│   │   │   ├── pool.py
│   │   │   ├── investor.py
│   │   │   ├── originator.py
│   │   │   └── compliance.py
│   │   │
│   │   └── [existing - UNTOUCHED]
│   │
│   ├── db/
│   │   ├── session.py
│   │   ├── crud.py
│   │   └── base.py
│   │
│   ├── utils/
│   │   ├── security.py
│   │   ├── validators.py
│   │   └── formatters.py
│   │
│   └── middleware/
│       ├── auth.py
│       ├── cors.py
│       └── rate_limit.py
│
├── tests/
│   ├── MVP/
│   │   ├── test_pools.py
│   │   ├── test_investors.py
│   │   ├── test_originators.py
│   │   ├── test_compliance.py
│   │   ├── test_mock_bank.py
│   │   └── test_mock_gdiz.py
│   └── [existing - UNTOUCHED]
│
├── scripts/
│   ├── deploy_MVP.sh
│   ├── migrate_MVP.py
│   └── seed_mock_data.py
│
├── .env
├── .env.MVP
├── .env.production
├── requirements.txt
├── alembic.ini
└── README.md
```

---

## Smart Contracts Structure

```
contracts/
├── mvp1/                         # MVP-1 contracts (UNTOUCHED)
│   ├── UjamaaAssetToken.sol
│   ├── IdentityRegistry.sol
│   ├── ComplianceModule.sol
│   └── AssetProof.sol
│
├── MVP/                         # MVP contracts (NEW)
│   ├── uLPToken.sol              # Ujamaa Pool Token (yield-bearing)
│   ├── LiquidityPool.sol         # Liquidity Pool management
│   ├── MockEscrow.sol            # Mock bank escrow (testnet)
│   ├── MockFiatRamp.sol          # Mock fiat on/off ramp (testnet)
│   │
│   ├── interfaces/
│   │   ├── IuLPToken.sol
│   │   ├── ILiquidityPool.sol
│   │   ├── IMockEscrow.sol
│   │   ├── IMockFiatRamp.sol
│   │   ├── IBankService.sol      # Interface for real bank (production)
│   │   └── IFiatRamp.sol         # Interface for real ramp (production)
│   │
│   ├── libraries/
│   │   ├── Math.sol
│   │   └── SafeERC20.sol
│   │
│   ├── scripts/
│   │   ├── deploy_MVP.ts
│   │   ├── verify_MVP.ts
│   │   └── interact_MVP.ts
│   │
│   └── tests/
│       ├── uLPToken.test.ts
│       ├── LiquidityPool.test.ts
│       ├── MockEscrow.test.ts
│       └── MockFiatRamp.test.ts
│
├── deployments/
│   ├── amoy/                     # Polygon Amoy (testnet)
│   │   ├── uLPToken.json
│   │   ├── LiquidityPool.json
│   │   ├── MockEscrow.json
│   │   └── MockFiatRamp.json
│   │
│   └── polygon/                  # Polygon mainnet (future production)
│       └── [to be deployed]
│
├── hardhat.config.ts
├── package.json
└── README.md
```

---

## Key Naming Conventions

### ✅ Keep MVP Naming

| Component | Name | Why |
|-----------|------|-----|
| Banner | `MVPBanner.tsx` | Clear testnet identification |
| Notice | `TestnetNotice.tsx` | Clear testnet notice |
| Badge | `MockDataBadge.tsx` | Clear mock data indicator |
| Bank Service | `mockBankService.ts` | Clear mock service |
| GDIZ Service | `mockGDIZService.ts` | Clear mock service |
| Escrow Contract | `MockEscrow.sol` | Clear testnet contract |
| Fiat Ramp Contract | `MockFiatRamp.sol` | Clear testnet contract |

### ✅ Production-Quality Code

| Aspect | Standard |
|--------|----------|
| **Testing** | >90% coverage, vitest + playwright |
| **Documentation** | JSDoc, docstrings, NatSpec |
| **Linting** | ESLint, Prettier, Solhint |
| **Type Safety** | Full TypeScript typing |
| **Error Handling** | Comprehensive error boundaries |
| **Accessibility** | WCAG 2.2 AA compliant |
| **Performance** | Lighthouse >90 |

---

## Environment Configuration

### Frontend (.env.MVP)

```env
# MVP Mode
VITE_MVP_MODE=true
VITE_NETWORK=testnet
VITE_CHAIN_ID=80002
VITE_RPC_URL=https://rpc-amoy.polygon.technology/
VITE_BLOCK_EXPLORER=https://amoy.polygonscan.com/

# Contract Addresses (Testnet)
VITE_uLP_TOKEN_ADDRESS=0x...
VITE_LIQUIDITY_POOL_ADDRESS=0x...
VITE_MOCK_ESCROW_ADDRESS=0x...
VITE_MOCK_FIAT_RAMP_ADDRESS=0x...

# Mock Services
VITE_MOCK_BANK_ENABLED=true
VITE_MOCK_GDIZ_ENABLED=true
VITE_MOCK_FIAT_RAMP_ENABLED=true

# API
VITE_API_BASE_URL=http://localhost:8000
VITE_API_V2_BASE_URL=http://localhost:8000/api/MVP

# Features
VITE_FEATURE_INSTITUTIONAL=true
VITE_FEATURE_RETAIL=true
VITE_FEATURE_ORIGINATOR=true
VITE_FEATURE_COMPLIANCE=true
VITE_FEATURE_REGULATOR=true
VITE_FEATURE_DIASPORA=true
VITE_FEATURE_MOBILE_MONEY=true

# Disclaimers
VITE_MVP_DISCLAIMER_ENABLED=true
```

### Backend (.env.MVP)

```env
# MVP Mode
MVP_MODE=true
NETWORK=testnet
CHAIN_ID=80002
RPC_URL=https://rpc-amoy.polygon.technology/

# Mock Services
MOCK_BANK_ENABLED=true
MOCK_GDIZ_ENABLED=true
MOCK_FIAT_RAMP_ENABLED=true
MOCK_INITIAL_BALANCE=10000000000000000000000000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/ujamaa_MVP

# Redis
REDIS_URL=redis://localhost:6379/1

# API
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=true
```

---

## Migration Path to Production

### Phase 1: MVP (Current)
```
✅ Mock services (MockEscrow, MockFiatRamp, MockBank, MockGDIZ)
✅ Testnet deployment (Polygon Amoy)
✅ All role workflows functional
✅ Investor-ready demo
```

### Phase 2: Production Preparation
```
1. Replace MockEscrow → RealBankEscrow (BIIC/MCB integration)
2. Replace MockFiatRamp → RealFiatRamp (Ondo Finance, EURR integration)
3. Replace MockBank → RealBankAPI (BIIC/MCB API)
4. Replace MockGDIZ → RealGDIZGateway (GDIZ API integration)
5. Deploy to Polygon mainnet
6. Regulatory approval (Mauritius FSC)
```

### Phase 3: Production
```
✅ Real bank integration
✅ Real fiat on/off ramp
✅ Mainnet deployment
✅ Live investor funds
```

---

## File Organization Principles

### 1. Clear Separation

```
✅ MVP/ folder for all MVP code
✅ Existing MVP-1 code UNTOUCHED
✅ Easy to find MVP vs MVP-1
```

### 2. Mock Services Explicit

```
✅ mockBankService.ts (clear mock)
✅ MockEscrow.sol (clear mock)
✅ Interface: IBankService.sol (production-ready)
✅ Easy to swap: MockBankService → RealBankService
```

### 3. Role-Based Organization

```
✅ pages/institutional/
✅ pages/retail/
✅ pages/originator/
✅ pages/compliance/
✅ pages/regulator/
✅ Easy to find by user role
```

### 4. Production-Quality Code

```
✅ Full TypeScript typing
✅ Comprehensive tests
✅ Documentation (JSDoc, docstrings)
✅ Linting (ESLint, Prettier)
✅ Accessibility (WCAG 2.2 AA)
```

---

## Summary

**This MVP folder structure:**
- ✅ Uses `MVP/` prefix (clear testnet identification)
- ✅ Keeps `Mock` naming (easy to identify swap targets)
- ✅ Production-quality code (testing, documentation, linting)
- ✅ Role-based organization (easy navigation)
- ✅ Clear separation from MVP-1 (no conflicts)
- ✅ Ready for investor demo (Logic Capital presentation)
- ✅ Ready for production swap (interfaces defined)

**Developers can:**
- ✅ Find MVP files easily (`MVP/` folder)
- ✅ Identify mock services (`Mock` prefix)
- ✅ Understand production path (interfaces defined)
- ✅ Navigate quickly (role-based organization)
- ✅ Deploy confidently (testnet → mainnet path clear)

---

**Related Documents:**
- `02_MVP_IMPLEMENTATION_PLAN.md` - Implementation guide
- `03_MVP_MOCKING_AND_TESTNET_STRATEGY.md` - Mock services & testnet
- `04_MVP_FRONTEND_SPECIFICATION.md` - Frontend design
- `14_MVP_ROLE_WORKFLOW_COVERAGE_ANALYSIS.md` - Role coverage
- `15_MVP_V6_ALL_ROLE_WORKFLOWS_UPDATE.md` - v6.0 update

---

**END OF MVP PRODUCTION FOLDER STRUCTURE**
