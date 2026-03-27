# UJAMAA DeFi Platform - Production Folder Structure

**Author:** Aziz Da Silva - Lead Architect
**Version:** 3.0 (Clean Structure + Mock Services)
**Date:** March 19, 2026
**Purpose:** Production-ready folder structure WITHOUT mvp/MVP prefixes, WITH mock services preserved

---

## Overview

This document defines the **production folder structure** for the UJAMAA DeFi Platform:

- ✅ **NO `mvp/` or `MVP/` prefixes** in folder names
- ✅ **KEEP all mock naming** (`MockEscrow`, `mockBankService`, etc.)
- ✅ **Production-quality code** (testing, documentation, linting)
- ✅ **Clear testnet identification** (via mock naming, not folder prefixes)
- ✅ **Ready for investor demo** (Logic Capital presentation)
- ✅ **Ready for production swap** (mock → real services)

**Key Principle:** Mock services are identified by their **service names** (`MockEscrow`, `mockBankService`), not by folder prefixes (`MVP/`).

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
│   ├── components/                 # Shared UI components
│   │   ├── common/                 # Base components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── index.ts
│   │   ├── layout/                 # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── index.ts
│   │   ├── testnet/                # Testnet indicators (NEW)
│   │   │   ├── TestnetBanner.tsx           # Testnet banner (all pages)
│   │   │   ├── TestnetNotice.tsx           # First-time visitor modal
│   │   │   ├── MockDataBadge.tsx           # Mock data indicator
│   │   │   ├── DisclaimerModal.tsx         # 10-second auto-dismiss
│   │   │   └── index.ts
│   │   ├── dashboard/              # Dashboard components
│   │   │   ├── KPICard.tsx
│   │   │   ├── PortfolioChart.tsx
│   │   │   ├── YieldChart.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   └── index.ts
│   │   ├── pools/                  # Pool components
│   │   │   ├── PoolCard.tsx
│   │   │   ├── PoolList.tsx
│   │   │   ├── PoolDetail.tsx
│   │   │   ├── ReserveWidget.tsx
│   │   │   └── index.ts
│   │   ├── compliance/             # Compliance components
│   │   │   ├── KYCStatus.tsx
│   │   │   ├── AccreditationBadge.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── pages/                      # Page components (by role)
│   │   ├── home/                   # Landing page
│   │   │   ├── Landing.tsx
│   │   │   └── index.ts
│   │   ├── dashboard/              # Dashboards
│   │   │   ├── InstitutionalDashboard.tsx
│   │   │   ├── RetailDashboard.tsx
│   │   │   ├── OriginatorDashboard.tsx
│   │   │   ├── ComplianceDashboard.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── index.ts
│   │   ├── pools/                  # Pool pages
│   │   │   ├── PoolMarketplace.tsx
│   │   │   ├── PoolDetail.tsx
│   │   │   └── index.ts
│   │   ├── portfolio/              # Portfolio pages
│   │   │   ├── Portfolio.tsx
│   │   │   └── index.ts
│   │   ├── onboarding/             # Onboarding flows
│   │   │   ├── InvestorOnboarding.tsx
│   │   │   ├── OriginatorOnboarding.tsx
│   │   │   └── index.ts
│   │   ├── originator/             # Originator features
│   │   │   ├── OriginatorDashboard.tsx
│   │   │   ├── AssetSubmission.tsx
│   │   │   ├── CapitalRaiseTracker.tsx
│   │   │   ├── ProductionNotarization.tsx
│   │   │   └── index.ts
│   │   ├── compliance/             # Compliance features
│   │   │   ├── ComplianceDashboard.tsx
│   │   │   ├── KYCApprovalQueue.tsx
│   │   │   ├── AccreditationManager.tsx
│   │   │   ├── RegulatoryReporting.tsx
│   │   │   └── index.ts
│   │   ├── regulator/              # Regulator features
│   │   │   ├── RegulatorDashboard.tsx
│   │   │   ├── ComplianceMetrics.tsx
│   │   │   ├── TransactionMonitor.tsx
│   │   │   └── index.ts
│   │   ├── diaspora/               # Diaspora features
│   │   │   ├── DiasporaDashboard.tsx
│   │   │   ├── OverseasKYC.tsx
│   │   │   ├── DualCurrencyDistribution.tsx
│   │   │   └── index.ts
│   │   ├── mobile/                 # Mobile money features
│   │   │   ├── MobileMoneyConnect.tsx
│   │   │   ├── USSDInterface.tsx
│   │   │   └── index.ts
│   │   ├── documentation/          # Documentation pages
│   │   │   ├── DeepDive.tsx
│   │   │   ├── InvestorsRoom.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── useWallet.ts
│   │   ├── usePools.ts
│   │   ├── usePortfolio.ts
│   │   ├── useKYC.ts
│   │   ├── useCompliance.ts
│   │   ├── useMockBank.ts                  # Mock bank hook
│   │   ├── useMockGDIZ.ts                  # Mock GDIZ (Benin) hook
│   │   ├── useTestnetMode.ts               # Testnet mode flag
│   │   └── index.ts
│   │
│   ├── contexts/                   # React contexts
│   │   ├── WalletContext.tsx
│   │   ├── UserContext.tsx
│   │   ├── TestnetModeContext.tsx          # Testnet mode context
│   │   └── index.ts
│   │
│   ├── services/                   # API clients
│   │   ├── api.ts
│   │   ├── poolService.ts
│   │   ├── investorService.ts
│   │   ├── originatorService.ts
│   │   ├── complianceService.ts
│   │   ├── mockBankService.ts              # Mock bank service
│   │   ├── mockGDIZService.ts              # Mock GDIZ (Benin) service
│   │   └── index.ts
│   │
│   ├── utils/                      # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   ├── mockData.ts                     # Mock data generators
│   │   ├── calculations.ts
│   │   └── index.ts
│   │
│   ├── types/                      # TypeScript types
│   │   ├── pool.ts
│   │   ├── investor.ts
│   │   ├── originator.ts
│   │   ├── compliance.ts
│   │   ├── mockServices.ts                 # Mock service types
│   │   └── index.ts
│   │
│   ├── styles/                     # Global styles
│   │   ├── globals.css
│   │   ├── components.css
│   │   ├── testnet.css                   # Testnet indicator styles
│   │   └── index.css
│   │
│   ├── config/                     # Configuration
│   │   ├── network.ts
│   │   ├── contracts.ts
│   │   ├── testnet.ts                    # Testnet configuration
│   │   └── index.ts
│   │
│   ├── contracts/                  # Contract ABIs
│   │   ├── uLPToken.json
│   │   ├── LiquidityPool.json
│   │   ├── MockEscrow.json               # Mock escrow (testnet)
│   │   ├── MockFiatRamp.json             # Mock fiat ramp (testnet)
│   │   └── index.ts
│   │
│   ├── assets/                     # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   ├── logos/
│   │   └── illustrations/
│   │
│   ├── App.tsx                     # Main application
│   ├── App.test.tsx                # App tests
│   ├── index.css                   # Global styles
│   ├── index.tsx                   # Entry point
│   └── react-app-env.d.ts          # Type declarations
│
├── tests/                          # Test files
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   └── utils/
│
├── .env                            # Environment variables
├── .env.testnet                    # Testnet environment
├── .env.production                 # Production environment
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── .eslintrc.json
├── .prettierrc
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
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── assets.py
│   │   │   ├── compliance.py
│   │   │   └── auth.py
│   │   │
│   │   └── v2/                     # New API endpoints
│   │       ├── __init__.py
│   │       ├── pools.py
│   │       ├── investors.py
│   │       ├── originators.py
│   │       ├── compliance.py
│   │       ├── regulator.py
│   │       ├── mock_bank.py                # Mock bank API
│   │       ├── mock_gdiz.py                # Mock GDIZ (Benin) API
│   │       └── docs.py
│   │
│   ├── services/
│   │   ├── pool_service.py
│   │   ├── investor_service.py
│   │   ├── originator_service.py
│   │   ├── compliance_service.py
│   │   ├── mock_bank_service.py            # Mock bank service
│   │   ├── mock_gdiz_service.py            # Mock GDIZ (Benin) service
│   │   ├── yield_calculation.py
│   │   └── __init__.py
│   │
│   ├── models/
│   │   ├── pool.py
│   │   ├── investor.py
│   │   ├── originator.py
│   │   ├── compliance.py
│   │   ├── transaction.py
│   │   └── __init__.py
│   │
│   ├── schemas/
│   │   ├── pool.py
│   │   ├── investor.py
│   │   ├── originator.py
│   │   ├── compliance.py
│   │   └── __init__.py
│   │
│   ├── db/
│   │   ├── session.py
│   │   ├── crud.py
│   │   └── base.py
│   │
│   ├── utils/
│   │   ├── security.py
│   │   ├── validators.py
│   │   ├── formatters.py
│   │   ├── mock_data.py                    # Mock data generators
│   │   └── __init__.py
│   │
│   └── middleware/
│       ├── auth.py
│       ├── cors.py
│       └── rate_limit.py
│
├── tests/
│   ├── test_pools.py
│   ├── test_investors.py
│   ├── test_originators.py
│   ├── test_compliance.py
│   ├── test_mock_bank.py
│   └── test_mock_gdiz.py
│
├── scripts/
│   ├── deploy.sh
│   ├── migrate.py
│   └── seed_mock_data.py
│
├── .env
├── .env.testnet
├── .env.production
├── requirements.txt
├── alembic.ini
└── README.md
```

---

## Smart Contracts Structure

```
contracts/
├── core/
│   ├── uLPToken.sol
│   ├── LiquidityPool.sol
│   ├── MockEscrow.sol              # Mock escrow (testnet)
│   ├── MockFiatRamp.sol            # Mock fiat ramp (testnet)
│   └── index.ts
│
├── interfaces/
│   ├── IuLPToken.sol
│   ├── ILiquidityPool.sol
│   ├── IMockEscrow.sol
│   ├── IMockFiatRamp.sol
│   ├── IBankService.sol            # Interface for real bank
│   ├── IFiatRamp.sol               # Interface for real ramp
│   └── index.ts
│
├── libraries/
│   ├── Math.sol
│   ├── SafeERC20.sol
│   └── index.ts
│
├── scripts/
│   ├── deploy.ts
│   ├── verify.ts
│   └── interact.ts
│
├── tests/
│   ├── uLPToken.test.ts
│   ├── LiquidityPool.test.ts
│   ├── MockEscrow.test.ts
│   └── MockFiatRamp.test.ts
│
├── deployments/
│   ├── testnet/
│   │   ├── uLPToken.json
│   │   ├── LiquidityPool.json
│   │   ├── MockEscrow.json
│   │   └── MockFiatRamp.json
│   │
│   └── mainnet/
│       └── [to be deployed]
│
├── hardhat.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Key Naming Conventions

### ✅ Clean Folder Names (No MVP prefixes)

| Folder | Purpose |
|--------|---------|
| `components/` | All UI components |
| `pages/` | All page components |
| `services/` | All API clients |
| `hooks/` | All custom hooks |
| `contracts/` | All contract ABIs |

### ✅ Mock Services (Keep Mock naming)

| Service/File | Name | Why |
|--------------|------|-----|
| Bank Service | `mockBankService.ts` | Clear mock identification |
| GDIZ (Benin) Service | `mockGDIZService.ts` | Clear mock identification |
| Escrow Contract | `MockEscrow.sol` | Clear testnet contract |
| Fiat Ramp Contract | `MockFiatRamp.sol` | Clear testnet contract |
| Data Generator | `mockData.ts` | Clear mock data |
| Hook | `useMockBank.ts` | Clear mock hook |

### ✅ Testnet Indicators (Clear identification)

| Component | Name | Purpose |
|-----------|------|---------|
| Banner | `TestnetBanner.tsx` | Testnet banner on all pages |
| Notice | `TestnetNotice.tsx` | First-time visitor modal |
| Badge | `MockDataBadge.tsx` | Mock data indicator |
| Modal | `DisclaimerModal.tsx` | Testnet disclaimer |
| Context | `TestnetModeContext.tsx` | Testnet mode state |
| Config | `testnet.ts` | Testnet configuration |

---

## Environment Configuration

### Frontend (.env.testnet)

```env
# Network (Testnet)
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
VITE_API_V2_BASE_URL=http://localhost:8000/api/v2

# Features
VITE_FEATURE_INSTITUTIONAL=true
VITE_FEATURE_RETAIL=true
VITE_FEATURE_ORIGINATOR=true
VITE_FEATURE_COMPLIANCE=true
VITE_FEATURE_REGULATOR=true
VITE_FEATURE_DIASPORA=true
VITE_FEATURE_MOBILE_MONEY=true

# Testnet Indicators
VITE_TESTNET_BANNER_ENABLED=true
VITE_TESTNET_DISCLAIMER_ENABLED=true
```

### Backend (.env.testnet)

```env
# Network (Testnet)
NETWORK=testnet
CHAIN_ID=80002
RPC_URL=https://rpc-amoy.polygon.technology/

# Mock Services
MOCK_BANK_ENABLED=true
MOCK_GDIZ_ENABLED=true
MOCK_FIAT_RAMP_ENABLED=true
MOCK_INITIAL_BALANCE=10000000000000000000000000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/ujamaa_testnet

# Redis
REDIS_URL=redis://localhost:6379/0

# API
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=true
```

---

## Production Migration Path

### Current State (Testnet)

```typescript
// Frontend
import { mockBankService } from 'services/mockBankService';
import { MockEscrow } from 'contracts/MockEscrow.json';

// Backend
from services.mock_bank_service import MockBankService
```

### Production State (Future)

```typescript
// Frontend
import { biicBankService } from 'services/biicBankService';
import { RealBankEscrow } from 'contracts/RealBankEscrow.json';

// Backend
from services.biic_bank_service import BIICBankService
```

### Swap Process

1. **Find all mock services:**
   ```bash
   grep -r "mockBankService" src/
   grep -r "MockEscrow" src/
   ```

2. **Replace with real services:**
   ```typescript
   // Before
   import { mockBankService } from 'services/mockBankService';
   
   // After
   import { biicBankService } from 'services/biicBankService';
   ```

3. **Update environment:**
   ```env
   # Before (.env.testnet)
   VITE_MOCK_BANK_ENABLED=true
   
   # After (.env.production)
   VITE_MOCK_BANK_ENABLED=false
   VITE_REAL_BANK_ENABLED=true
   ```

---

## Benefits of This Structure

| Benefit | How |
|---------|-----|
| **Clean Folders** | No `mvp/` or `MVP/` prefixes |
| **Clear Mock ID** | `Mock*` naming in service names |
| **Easy Navigation** | Logical organization by function |
| **Production Ready** | No renaming needed for folders |
| **Easy Swap** | Find all `Mock*` services easily |
| **Testnet Clear** | `Testnet*` components for indicators |
| **Scalable** | Easy to add new features |

---

## File Examples

### Component (Clean Name)

```typescript
// ✅ Good
src/components/testnet/TestnetBanner.tsx
src/components/testnet/MockDataBadge.tsx

// ❌ Bad
src/MVP/components/MVPBanner.tsx
src/MVP/components/MVPMockBadge.tsx
```

### Service (Mock Name Preserved)

```typescript
// ✅ Good
src/services/mockBankService.ts
src/services/mockGDIZService.ts

// ❌ Bad
src/MVP/services/bankService.ts  (hides that it's mock)
```

### Contract (Mock Name Preserved)

```typescript
// ✅ Good
contracts/core/MockEscrow.sol
contracts/core/MockFiatRamp.sol

// ❌ Bad
contracts/MVP/MockEscrow.sol
contracts/MVP/Escrow.sol  (hides that it's mock)
```

---

## Summary

**This production folder structure:**
- ✅ **NO `mvp/` or `MVP/` prefixes** in folder names
- ✅ **KEEPS all mock naming** (`MockEscrow`, `mockBankService`)
- ✅ **Clear testnet identification** (`TestnetBanner`, `MockDataBadge`)
- ✅ **Production-quality code** (testing, documentation, linting)
- ✅ **Easy navigation** (logical organization)
- ✅ **Easy production swap** (find all `Mock*` services)
- ✅ **Ready for investor demo** (Logic Capital presentation)

**Developers can:**
- ✅ Find files easily (clean folder names)
- ✅ Identify mock services (by `Mock*` naming)
- ✅ Navigate quickly (logical organization)
- ✅ Deploy confidently (production-ready structure)
- ✅ Swap to production (find all `Mock*` easily)

---

**Related Documents:**
- `02_MVP_IMPLEMENTATION_PLAN.md` - Implementation guide
- `03_MVP_MOCKING_AND_TESTNET_STRATEGY.md` - Mock services & testnet
- `04_MVP_FRONTEND_SPECIFICATION.md` - Frontend design
- `14_MVP_ROLE_WORKFLOW_COVERAGE_ANALYSIS.md` - Role coverage
- `15_MVP_V6_ALL_ROLE_WORKFLOWS_UPDATE.md` - v6.0 update

---

**END OF PRODUCTION FOLDER STRUCTURE**
