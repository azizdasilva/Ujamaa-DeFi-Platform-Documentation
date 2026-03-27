# MVP Specification: Institutional Architecture Prototype

## Ujamaa DeFi Platform - Second Iteration

**IMPORTANT:** This MVP Specification is an **EXTRACTION** from the master **SRS v2.1** document. **SRS v2.1** is the **PRODUCTION BASELINE** and authoritative specification. MVP contains only the subset of SRS v2.1 features required for the institutional architecture prototype (testnet).

**Source Document:** `docs/01_SPECIFICATIONS/01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` (SRS v2.1 - 7,386 lines)

**Author:** Aziz Da Silva - Lead Architect  
**Version:** 2.1 (SRS v2.1 Institutional Architecture)  
**Date:** March 25, 2026  
**Classification:** Internal / Development  
**Audience:** Development Team, Investors, Stakeholders  

---

## Document Updates Summary (v2.1)

**Updated to align with SRS v2.1:**
- ✅ uLP Token specification (yield-bearing, value-accrual model)
- ✅ UJG Token specification (collateral ERC-3643NFT)
- ✅ SIWE authentication (replacing ad-hoc wallet signature)
- ✅ RBAC authorization matrix (10+ roles)
- ✅ Fireblocks custody integration (platform treasury)
- ✅ Bank escrow integration (BIIC (Banque Internationale pour l'Industrie et le Commerce)/MCB, mock for MVP)
- ✅ KYB threshold (€100K enhanced due diligence)

**New Sections:**
- Section 4.4: UJG Token (Guarantee Token) specification
- Section 6.4: SIWE Authentication architecture
- Section 6.5: RBAC implementation
- Section 8.3: Fireblocks mock service
- Section 8.4: Bank escrow mock service

**SRS Traceability:**
- SRS v2.1 Section 1.2 (uLP, UJG, Fireblocks, Bank Escrow)
- SRS v2.1 Section 1.2.1 (Authentication Specification)
- SRS v2.1 Section 1.2.2 (Authorization Matrix)
- SRS v2.1 Section 3 (System Features - EPIC 10: Liquidity Pool)

---

# Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [MVP Mission & Scope](#2-MVP-mission--scope)
3. [Architecture Overview](#3-architecture-overview)
4. [Core Features](#4-core-features)
5. [Technical Stack](#5-technical-stack)
6. [Smart Contract Architecture](#6-smart-contract-architecture)
7. [Backend Services](#7-backend-services)
8. [Frontend Components](#8-frontend-components)
9. [Success Metrics](#9-success-metrics)
10. [Timeline & Milestones](#10-timeline--milestones)
11. [Risk Management](#11-risk-management)
12. [MVP → Production Path](#12-MVP--production-path)

---

# 1. Executive Summary

## 1.1 Product Vision

MVP is the **second iteration** of the Ujamaa DeFi Platform, introducing institutional-grade architecture for liquidity pool management and yield-bearing token (uLP) functionality.

**MVP-1 (Current):** Retail tokenization platform
- Direct asset purchase (Ujamaa Asset Token (UAT))
- Basic KYC/AML
- 3 role dashboards

**MVP (Institutional):** Liquidity pool architecture
- Yield-bearing uLP tokens
- Pool-based financing
- Institutional dashboard
- Mock banking (testnet-only)

**Production:** Full institutional platform
- Real bank integration (BIIC (Banque Internationale pour l'Industrie et le Commerce)/MCB)
- Mauritius entity (CIS Manager License)
- OHADA compliance
- Mainnet deployment

## 1.2 Strategic Rationale

**Why MVP?**

1. **Investor Demand:** Institutional investors (€1M+) require different architecture than retail (€1K-€100K)
2. **Token Economics:** Yield-bearing tokens (uLP) better represent fund shares than asset-specific tokens
3. **Banking Integration:** Escrow accounts required for regulatory compliance
4. **Testnet-First:** Validate architecture before mainnet deployment

**MVP is NOT:**
- ❌ A "demo" or "prototype"
- ❌ Throwaway code
- ❌ Fake functionality

**MVP IS:**
- ✅ Production-quality code
- ✅ Testnet deployment only (regulatory pending)
- ✅ Swappable mock services (ready for real banks)
- ✅ Investor-presentable architecture

## 1.3 Key Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| **Development Time** | 10 weeks | Weeks 1-10 (includes Frontend Spec + Mocking Strategy integration) |
| **Budget** | $150K-$240K | Development only (accounts for Frontend Spec additions) |
| **Testnet Deployment** | Polygon Amoy | Week 10 |
| **Code Coverage** | >90% | All new code |
| **Security Review** | 0 critical bugs | Pre-deployment |
| **Investor Ready** | Logic Capital presentation | Week 10 |

---

# 2. MVP Mission & Scope

## 2.1 Mission Statement

**Deliver a functional, institutional-grade liquidity pool architecture on testnet that demonstrates:**

1. **Ujamaa Pool Token (uLP) Mechanics** - Yield-bearing token with correct NAV calculation
2. **Pool Management** - Multiple financings, diversification, risk tracking
3. **Mock Banking** - Swappable interfaces for real bank integration
4. **Institutional UX** - Real-time dashboard, yield statements, transparency

## 2.2 In Scope (MVP)

| Component | Description | Priority |
|-----------|-------------|----------|
| **uLPToken Contract** | Yield-bearing LP token (ERC-3643) | P0 |
| **LiquidityPool Contract** | Pool management, multiple financings | P0 |
| **MockEscrow Contract** | Simulated escrow accounts | P0 |
| **MockFiatRamp Contract** | Simulated fiat on/off ramp | P1 |
| **Yield Calculation** | Real math, simulated data | P0 |
| **Pool Manager API** | Backend for pool operations | P0 |
| **Institutional Dashboard** | Frontend for investors | P0 |
| **uLP Deposit/Redeem** | User flow for uLP tokens | P0 |
| **Mock Bank Service** | Interface for real bank later | P0 |
| **Mock GDIZ (Benin) Service** | Interface for GDIZ (Benin) later | P1 |

## 2.3 Out of Scope (MVP)

| Component | Reason | Phase |
|-----------|--------|-------|
| **Real Bank Integration** | Requires banking partnership | Production |
| **Mauritius Entity** | Legal setup (6-8 weeks) | Parallel track |
| **OHADA Compliance** | Legal framework | Production |
| **Mainnet Deployment** | Regulatory approval needed | Production |
| **Secondary Market for uLP** | Liquidity pool focus | MVP-3 |
| **Mobile Apps** | Web-first approach | MVP-3 |
| **Multi-language** | English + French only | MVP-1 (done) |
| **Cross-Chain Bridge** | Requires 5-of-9 multisig setup | Production |
| **Ujamaa Guarantee (UJG) Auction** | Default scenario complex | Production (optional mock) |
| **Mobile Money Integration** | Partnership required | Production (MockFiatRamp in MVP) |

## 2.4 Design Principles

### 1. Non-Breaking Changes

✅ **DO NOT** modify MVP-1 contracts (Ujamaa Asset Token (UAT), IdentityRegistry, ComplianceModule)
✅ **DO** add new features in separate folders (`MVP/` prefix)
✅ **DO** use feature flags for MVP mode

### 2. Clear Separation

✅ **DO** keep mock services clearly separated from real services
✅ **DO** use dependency injection for easy swapping
✅ **DO** label all MVP components with `MVP` prefix

### 3. Production Quality

✅ **DO** write tests for all new code (>90% coverage)
✅ **DO** use TypeScript types for all interfaces
✅ **DO** add comprehensive documentation
✅ **DO** use ESLint + Prettier consistently

### 4. Transparency

✅ **DO** add disclaimers on every MVP page
✅ **DO** never hide that this is testnet-only
✅ **DO** use testnet only (Polygon Amoy)
✅ **DO** document all mock services

---

# 3. Architecture Overview

## 3.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MVP ARCHITECTURE                                    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                      USER ACCESS LAYER                                  │ │
│  │                                                                        │ │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │ │
│  │  │  Institutional   │  │  Retail          │  │  Admin           │    │ │
│  │  │  Dashboard       │  │  Dashboard       │  │  Dashboard       │    │ │
│  │  │  (MVP)         │  │  (MVP-1)         │  │  (MVP-1)         │    │ │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                         │
│                                   ▼ HTTPS/WSS (TLS 1.3)                     │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                      API GATEWAY LAYER                                  │ │
│  │         Kong/Nginx: Rate Limiting │ Auth │ Routing │ CORS              │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                         │
│                                   ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                   MICROSERVICES LAYER (FastAPI)                         │ │
│  │                                                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │ │
│  │  │  MVP-1       │  │  MVP       │  │  Shared      │                │ │
│  │  │  Services    │  │  Services    │  │  Services    │                │ │
│  │  │              │  │              │  │              │                │ │
│  │  │  • Assets    │  │  • Pools     │  │  • Auth      │                │ │
│  │  │  • Investors │  │  • uLP       │  │  • Config    │                │ │
│  │  │  • Trades    │  │  • Mock Bank │  │  • Logging   │                │ │
│  │  │  • Fraud     │  │  • Mock GDIZ (Benin) │  │              │                │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                         │
│                  ┌────────────────┼────────────────┐                        │
│                  ▼                ▼                ▼                        │
│          ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                │
│          │  PostgreSQL  │ │    Redis     │ │    Mock      │                │
│          │  (Primary)   │ │   (Cache)    │ │    Data      │                │
│          └──────────────┘ └──────────────┘ └──────────────┘                │
│                                   │                                         │
│                                   ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                  BLOCKCHAIN LAYER (Polygon Amoy)                        │ │
│  │                                                                        │ │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │ │
│  │  │  MVP-1 Contracts │  │  MVP Contracts │  │  Mock Contracts  │    │ │
│  │  │                  │  │                  │  │                  │    │ │
│  │  │  • Ujamaa Asset Token (UAT)  │  │  • uLPToken      │  │  • MockEscrow    │    │ │
│  │  │  • Identity      │  │  • LiquidityPool │  │  • MockFiatRamp  │    │ │
│  │  │  • Compliance    │  │                  │  │                  │    │ │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Data Flow: Institutional Investment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INSTITUTIONAL INVESTMENT FLOW                              │
│                                                                              │
│  1. Investor Onboarding                                                      │
│     ┌──────────────┐                                                         │
│     │  Investor    │                                                         │
│     │  (Logic Cap) │                                                         │
│     └──────┬───────┘                                                         │
│            │                                                                  │
│            │ 1. Connect wallet (MetaMask)                                    │
│            ▼                                                                  │
│     ┌──────────────┐                                                         │
│     │  KYB Check   │  (Mock for MVP, real for production)                 │
│     └──────┬───────┘                                                         │
│            │                                                                  │
│            │ 2. Whitelist address                                            │
│            ▼                                                                  │
│     ┌──────────────┐                                                         │
│     │  Approved    │                                                         │
│     └──────────────┘                                                         │
│                                                                              │
│  2. Deposit → uLP Minting                                                    │
│            │                                                                  │
│            │ 3. Deposit testnet Ondo EUROD (EUROD) (faucet or swap)                        │
│            ▼                                                                  │
│     ┌──────────────┐                                                         │
│     │  Mock Bank   │  (Simulates wire transfer)                              │
│     └──────┬───────┘                                                         │
│            │                                                                  │
│            │ 4. Convert to stablecoin                                        │
│            ▼                                                                  │
│     ┌──────────────┐                                                         │
│     │  MockEscrow  │  (Simulates escrow account)                             │
│     └──────┬───────┘                                                         │
│            │                                                                  │
│            │ 5. Mint uLP tokens                                              │
│            ▼                                                                  │
│     ┌──────────────┐                                                         │
│     │  uLPToken    │  (Yield-bearing LP token)                               │
│     └──────┬───────┘                                                         │
│            │                                                                  │
│            │ 6. Receive uLP (1:1 at inception)                               │
│            ▼                                                                  │
│     ┌──────────────┐                                                         │
│     │  Investor    │  (Holds uLP tokens)                                     │
│     │  Wallet      │                                                         │
│     └──────────────┘                                                         │
│                                                                              │
│  3. Yield Accrual                                                            │
│            │                                                                  │
│            │ 7. Deploy to industrial financing                               │
│            ▼                                                                  │
│     ┌──────────────┐                                                         │
│     │ LiquidityPool│  (Manages multiple financings)                          │
│     └──────┬───────┘                                                         │
│            │                                                                  │
│            │ 8. Industrial repays with interest                              │
│            ▼                                                                  │
│     ┌──────────────┐                                                         │
│     │  Mock GDIZ (Benin)   │  (Simulates industrial repayment)                       │
│     └──────┬───────┘                                                         │
│            │                                                                  │
│            │ 9. Add yield to pool                                            │
│            ▼                                                                  │
│     ┌──────────────┐                                                         │
│     │  uLPToken    │  (Value per share increases)                            │
│     └──────┬───────┘                                                         │
│            │                                                                  │
│            │ 10. NAV updates (e.g., 1.00 → 1.10 Ondo EUROD (EUROD))                        │
│            ▼                                                                  │
│     ┌──────────────┐                                                         │
│     │  Dashboard   │  (Shows increased value)                                │
│     └──────────────┘                                                         │
│                                                                              │
│  4. Redemption                                                               │
│            │                                                                  │
│            │ 11. Request redemption                                          │
│            ▼                                                                  │
│     ┌──────────────┐                                                         │
│     │  uLPToken    │  (Burn uLP tokens)                                      │
│     └──────┬───────┘                                                         │
│            │                                                                  │
│            │ 12. Receive Ondo EUROD (EUROD) (principal + yield)                            │
│            ▼                                                                  │
│     ┌──────────────┐                                                         │
│     │ MockFiatRamp │  (Simulates fiat withdrawal)                            │
│     └──────┬───────┘                                                         │
│            │                                                                  │
│            │ 13. Fiat to bank account                                        │
│            ▼                                                                  │
│     ┌──────────────┐                                                         │
│     │  Investor    │  (Profit realized)                                      │
│     │  Bank        │                                                         │
│     └──────────────┘                                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 4. Core Features

## 4.1 uLPToken (Yield-Bearing LP Token)

### Description

ERC-3643 compliant yield-bearing token representing ownership in liquidity pool.

### Token Mechanics

**Value-Accrual Model:**
- Token balance stays constant
- Value per token increases with yield
- NAV calculated on-chain

**Example:**
```
Initial: Investor deposits 10M Ondo EUROD (EUROD)
→ Receives 10M uLP tokens (NAV = 1.00 Ondo EUROD (EUROD) per uLP)

After 1 year (10% yield):
→ Still holds 10M uLP tokens (balance unchanged)
→ NAV = 1.10 Ondo EUROD (EUROD) per uLP
→ Total value = 11M Ondo EUROD (EUROD)
```

### Functions

| Function | Description | Gas Estimate |
|----------|-------------|--------------|
| `deposit(uint256 eurcAmount)` | Deposit Ondo EUROD (EUROD), receive uLP | ~85,000 |
| `redeem(uint256 shares)` | Burn uLP, receive Ondo EUROD (EUROD) | ~65,000 |
| `getValue(address)` | Get current value in Ondo EUROD (EUROD) | ~2,500 |
| `getValuePerShare()` | Get NAV per Ujamaa Pool Token (uLP) | ~2,500 |
| `addYield(uint256)` | Add yield to pool (admin) | ~45,000 |

### Security Features

- ✅ ERC-3643 compliance (transfer restrictions)
- ✅ IS_PRODUCTION = false (testnet safety)
- ✅ Max deposit limit (1M Ondo EUROD (EUROD) for demo)
- ✅ Role-based access control

---

## 4.2 LiquidityPool (Pool Management)

### Description

Manages pool of funds for industrial financing with diversification and risk tracking.

### Pool Mechanics

**Multiple Financings:**
- Pool can deploy to multiple industrials
- Each financing has: amount, interest rate, due date
- Diversification tracking (by asset, by industrial, by geography)

**Example:**
```
Pool: "Ujamaa Industrial Finance Pool I"
Total Value: 10M Ondo EUROD (EUROD)
├── Deployed: 7M Ondo EUROD (EUROD) (70%)
│   ├── GDIZ (Benin) Cotton #1: 2M Ondo EUROD (EUROD) @ 12% (due: 90 days)
│   ├── GDIZ (Benin) Soy #1: 3M Ondo EUROD (EUROD) @ 11% (due: 120 days)
│   └── GDIZ (Benin) Coffee #1: 2M Ondo EUROD (EUROD) @ 13% (due: 60 days)
└── Available: 3M Ondo EUROD (EUROD) (30%)
```

### Functions

| Function | Description | Gas Estimate |
|----------|-------------|--------------|
| `createPool(string name)` | Create new pool | ~150,000 |
| `deployToIndustrial(...)` | Deploy funds to industrial | ~120,000 |
| `recordRepayment(...)` | Record repayment + interest | ~85,000 |
| `getPoolStats(uint256)` | Get pool statistics | ~5,000 |
| `getFinancing(...)` | Get financing details | ~3,000 |

---

## 4.3 MockEscrow (Bank Simulation)

### Description

Simulates escrow accounts for testnet. Interface designed for easy swap with real bank API.

### Mock vs Real

**MVP (Mock):**
- In-memory account balances
- Simulated wire transfers
- No real money moves

**Production (Real):**
- BIIC (Banque Internationale pour l'Industrie et le Commerce)/MCB API integration
- Real escrow accounts
- Actual wire transfers

### Interface Design

```python
# MVP Interface (same for mock and real)
class BankService(ABC):
    @abstractmethod
    def create_escrow_account(self, investor_id: str) -> str:
        pass

    @abstractmethod
    def record_wire_transfer(self, from_account: str, to_account: str, amount: int) -> str:
        pass

    @abstractmethod
    def get_balance(self, account_id: str) -> int:
        pass

# MVP Implementation (mock)
class MockBankService(BankService):
    def create_escrow_account(self, investor_id: str) -> str:
        # Mock implementation

# Production Implementation (real)
class BIICBankService(BankService):
    def create_escrow_account(self, investor_id: str) -> str:
        # Real BIIC (Banque Internationale pour l'Industrie et le Commerce) API integration
```

---

## 4.4 Institutional Dashboard

### Description

Real-time dashboard for institutional investors showing:
- uLP holdings and current value
- Yield accrued over time
- Pool allocation (by asset, by industrial)
- Transaction history
- Downloadable yield statements

### Key Components

| Component | Description | Status |
|-----------|-------------|--------|
| **Portfolio Summary** | Total invested, current value, yield earned | MVP |
| **uLP Holdings** | Token balance, NAV per share, value | MVP |
| **Yield Chart** | Historical NAV chart (line graph) | MVP |
| **Pool Allocation** | Pie chart: Cotton, Soy, Coffee, etc. | MVP |
| **Transaction History** | Deposits, redemptions, yield distributions | MVP |
| **Yield Statement** | Downloadable PDF for accounting | MVP |

---

## 4.5 Yield Calculation

### Description

Real financial math for yield accrual, using simulated data for MVP.

### Calculation Logic

```python
# Simplified example
def calculate_nav_per_share(pool_value, total_shares):
    """Calculate Net Asset Value per uLP share."""
    if total_shares == 0:
        return 1e18  # Initial NAV: 1.0
    return (pool_value * 1e18) / total_shares

def calculate_yield_accrual(principal, annual_rate, days_elapsed):
    """Calculate yield accrued over time."""
    daily_rate = annual_rate / 365
    accrued = principal * daily_rate * days_elapsed
    return accrued

# Example:
# Principal: 10M Ondo EUROD (EUROD)
# Annual rate: 10%
# Days elapsed: 365
# Accrued yield: 10M * 0.10 / 365 * 365 = 1M Ondo EUROD (EUROD)
# New pool value: 11M Ondo EUROD (EUROD)
# New NAV per share: 1.10 Ondo EUROD (EUROD)
```

### Accuracy

- ✅ Math verified by unit tests
- ✅ Matches traditional finance formulas
- ✅ Auditable calculation logic

---

# 5. Technical Stack

## 5.1 Smart Contracts

| Component | Technology | Version |
|-----------|------------|---------|
| **Framework** | **ApeWorX** | 0.7+ (Python-based) |
| **Language** | Solidity | 0.8.20+ |
| **Testing** | **ApeWorX + Pytest** | Python 3.11 |
| **Coverage** | **ApeWorX Coverage** | >95% required |
| **Security** | Slither + Mythril + Audit | Critical paths |
| **Token Standard** | **ERC-3643 (T-REX Protocol v3.0)** | Tokeny reference implementation |
| **Network** | Polygon Amoy (testnet) | Chain ID: 80002 |

**⚠️ CRITICAL COMPLIANCE REQUIREMENT:** Per SRS v1.3 Section 4.2.3, smart contract development **MUST** use ApeWorX framework (no Hardhat, no Truffle). All tokens **MUST** implement ERC-3643 T-REX protocol for regulatory compliance.

## 5.2 Backend

| Component | Technology | Version |
|-----------|------------|---------|
| **Framework** | FastAPI | 0.109+ |
| **Language** | Python | 3.11+ |
| **Validation** | Pydantic | 2.x |
| **Database** | PostgreSQL | 17 (latest) |
| **Cache** | Redis | 8.x |
| **Testing** | pytest + coverage | >90% |

## 5.3 Frontend

| Component | Technology | Version |
|-----------|------------|---------|
| **Framework** | React | 19.x |
| **Language** | TypeScript | 6.0+ |
| **Build Tool** | Vite | 7.x |
| **Web3** | Wagmi + Viem | Latest |
| **Wallet UI** | RainbowKit | Latest |
| **Styling** | Tailwind CSS | 3.x |
| **Charts** | Recharts | 2.x |
| **Testing** | Vitest + React Testing Library | Latest |

---

# 6. Smart Contract Architecture

## 6.1 Contract Inventory

```
contracts/
├── MVP/                          # NEW - MVP contracts
│   ├── uLPToken.sol               # Yield-bearing LP token
│   ├── LiquidityPool.sol          # Pool management
│   ├── MockEscrow.sol             # Bank simulation
│   ├── MockFiatRamp.sol           # Fiat on/off ramp
│   └── interfaces/
│       ├── IBankService.sol       # Bank interface (for swap)
│       └── IFiatRamp.sol          # Fiat ramp interface
│
├── tokens/                        # EXISTING - MVP-1
│   └── Ujamaa Asset Token (UAT).sol           # Asset-specific token
│
├── compliance/                    # EXISTING - MVP-1
    ├── IdentityRegistry.sol       # Identity verification
    └── ComplianceModule.sol       # Transfer restrictions
```

## 6.2 Contract Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      MVP SMART CONTRACTS                                    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                         uLPToken.sol                                     ││
│  │                                                                          ││
│  │  • Yield-bearing LP token                                               ││
│  │  • Value-accrual model (balance constant, NAV increases)                ││
│  │  • ERC-3643 compliant (transfer restrictions)                           ││
│  │  • deposit() / redeem() functions                                       ││
│  └────────────────────┬────────────────────────────────────────────────────┘│
│                       │                                                       │
│                       │ Calls addYield() when interest received              │
│                       ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                     LiquidityPool.sol                                    ││
│  │                                                                          ││
│  │  • Manages pool of funds                                                ││
│  │  • Deploys to multiple industrials                                      ││
│  │  • Records repayments (principal + interest)                            ││
│  │  • Tracks diversification                                               ││
│  └────────────────────┬────────────────────────────────────────────────────┘│
│                       │                                                       │
│                       │ Uses MockEscrow for simulated bank                  │
│                       ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                      MockEscrow.sol                                      ││
│  │                                                                          ││
│  │  • Simulates escrow accounts                                            ││
│  │  • Interface designed for real bank swap                                ││
│  │  • In-memory balances (no real money)                                   ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 6.3 Deployment Order

1. **uLPToken** (base token contract)
2. **LiquidityPool** (depends on uLPToken)
3. **MockEscrow** (standalone)
4. **MockFiatRamp** (standalone)

---

# 7. Backend Services

## 7.1 Service Inventory

```
backend/
├── services/
│   ├── MVP/                      # NEW - MVP services
│   │   ├── yield_calculation.py   # Real math, simulated data
│   │   ├── pool_manager.py        # Pool operations
│   │   ├── mock_bank.py           # Bank simulation
│   │   ├── mock_gdiz.py           # GDIZ (Benin) simulation
│   │   └── __init__.py
│   └── mvp1/                      # EXISTING - MVP-1 services
│       └── fraud_detection.py
│
├── api/
│   ├── MVP/                      # NEW - MVP API routes
│   │   ├── pools.py               # Pool endpoints
│   │   ├── uLP.py                 # uLP endpoints
│   │   └── __init__.py
│   └── mvp1/                      # EXISTING - MVP-1 routes
│       └── assets.py
│
└── models/
    ├── MVP/                      # NEW - MVP models
    │   ├── pool.py                # Pool data models
    │   ├── uLP.py                 # uLP models
    │   └── __init__.py
    └── mvp1/                      # EXISTING - MVP-1 models
```

## 7.2 API Endpoints

### Pools API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v2/pools/` | POST | Create new pool |
| `/api/v2/pools/` | GET | List all pools |
| `/api/v2/pools/{pool_id}` | GET | Get pool details |
| `/api/v2/pools/{pool_id}/stats` | GET | Get pool statistics |
| `/api/v2/pools/{pool_id}/financings` | GET | Get pool financings |
| `/api/v2/pools/{pool_id}/deploy` | POST | Deploy to industrial |

### uLP API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v2/uLP/deposit` | POST | Deposit Ondo EUROD (EUROD), receive uLP |
| `/api/v2/uLP/redeem` | POST | Burn uLP, receive Ondo EUROD (EUROD) |
| `/api/v2/uLP/{address}/balance` | GET | Get uLP balance |
| `/api/v2/uLP/{address}/value` | GET | Get current value |
| `/api/v2/uLP/{address}/statement` | GET | Generate yield statement |

---

# 8. Frontend Components

## 8.1 Page Inventory

```
frontend/src/pages/
├── MVP/                          # NEW - MVP pages
│   ├── pools/
│   │   ├── PoolList.tsx           # Browse liquidity pools
│   │   ├── PoolDetail.tsx         # Pool details & stats
│   │   ├── PoolPerformance.tsx    # Historical NAV chart
│   │   └── PoolAllocation.tsx     # Allocation breakdown
│   ├── uLP/
│   │   ├── Deposit.tsx            # Deposit Ondo EUROD (EUROD) → receive uLP
│   │   ├── Redeem.tsx             # Burn uLP → receive Ondo EUROD (EUROD)
│   │   └── MyHoldings.tsx         # View uLP holdings & yield
│   └── institutional/
│       ├── Dashboard.tsx          # Institutional portfolio
│       └── YieldStatement.tsx     # Download yield report
│
├── dashboard/                     # EXISTING - MVP-1
│   ├── InvestorDashboard.tsx
│   ├── IndustrialDashboard.tsx
│   └── AdminDashboard.tsx
│
└── marketplace/                   # EXISTING - MVP-1
    ├── AssetBrowse.tsx
    └── AssetDetail.tsx
```

## 8.2 Navigation Structure

```
Header Navigation:
├── Home
├── Marketplace (MVP-1)
├── Pools (MVP) ← NEW
├── Dashboard
│   ├── Retail (MVP-1)
│   └── Institutional (MVP) ← NEW
└── About

Footer Navigation:
├── Documentation
├── MVP-1 Info
├── MVP Info ← NEW
├── Testnet Notice
└── Contact
```

---

# 9. Success Metrics

## 9.1 Functional Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **uLPToken Deployed** | ✅ On Polygon Amoy | Block explorer verification |
| **LiquidityPool Deployed** | ✅ On Polygon Amoy | Block explorer verification |
| **Deposit Flow** | ✅ Ondo EUROD (EUROD) → uLP working | User testing |
| **Redeem Flow** | ✅ uLP → Ondo EUROD (EUROD) working | User testing |
| **Yield Accrual** | ✅ NAV increases correctly | Verified by tests |
| **Dashboard Loads** | ✅ <3s load time | Lighthouse |

## 9.2 Code Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Test Coverage (SC)** | >90% | solidity-coverage |
| **Test Coverage (BE)** | >90% | pytest --cov |
| **Test Coverage (FE)** | >90% | Vitest coverage |
| **Critical Bugs** | 0 | Slither + manual review |
| **TypeScript Errors** | 0 | tsc --noEmit |
| **ESLint Errors** | 0 | eslint --max-warnings 0 |

## 9.3 Investor Readiness

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Demo Flow** | Complete in <10 min | User testing |
| **Disclaimers** | Clear on every page | Manual review |
| **Documentation** | Complete + accurate | Technical writer review |
| **Presentation** | Investor-ready | Demo day sign-off |

---

# 10. Timeline & Milestones

## 10.1 Week-by-Week Breakdown

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MVP TIMELINE (6-8 WEEKS)                            │
│                                                                              │
│  Week 1-2: Smart Contracts                                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Week 1                                                                │ │
│  │  ├── uLPToken.sol (implementation)                                     │ │
│  │  ├── uLPToken.test.ts (unit tests)                                     │ │
│  │  ├── LiquidityPool.sol (implementation)                                │ │
│  │  └── LiquidityPool.test.ts (unit tests)                                │ │
│  │                                                                        │ │
│  │  Week 2                                                                │ │
│  │  ├── MockEscrow.sol (implementation)                                   │ │
│  │  ├── MockFiatRamp.sol (implementation)                                 │ │
│  │  ├── Integration tests                                                 │ │
│  │  ├── Security review (Slither)                                         │ │
│  │  └── Testnet deployment (Polygon Amoy)                                 │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Week 3-4: Backend Services                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Week 3                                                                │ │
│  │  ├── yield_calculation.py (implementation)                             │ │
│  │  ├── yield_calculation_test.py (tests)                                 │ │
│  │  ├── pool_manager.py (implementation)                                  │ │
│  │  ├── pool_manager_test.py (tests)                                      │ │
│  │  ├── mock_bank.py (implementation)                                     │ │
│  │  └── mock_bank_test.py (tests)                                         │ │
│  │                                                                        │ │
│  │  Week 4                                                                │ │
│  │  ├── mock_gdiz.py (implementation)                                     │ │
│  │  ├── API endpoints (pools, uLP)                                        │ │
│  │  ├── Integration tests                                                 │ │
│  │  ├── Database schema (PostgreSQL)                                      │ │
│  │  └── API documentation (OpenAPI)                                       │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Week 5-6: Frontend                                                          │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Week 5                                                                │ │
│  │  ├── PoolList.tsx (browse pools)                                       │ │
│  │  ├── PoolDetail.tsx (pool stats)                                       │ │
│  │  ├── PoolPerformance.tsx (NAV chart)                                   │ │
│  │  ├── PoolAllocation.tsx (allocation pie)                               │ │
│  │  └── Deposit.tsx (Ondo EUROD (EUROD) → uLP flow)                                     │ │
│  │                                                                        │ │
│  │  Week 6                                                                │ │
│  │  ├── Redeem.tsx (uLP → Ondo EUROD (EUROD) flow)                                      │ │
│  │  ├── MyHoldings.tsx (uLP portfolio)                                    │ │
│  │  ├── InstitutionalDashboard.tsx                                        │ │
│  │  ├── YieldStatement.tsx (PDF download)                                 │ │
│  │  └── Integration with smart contracts                                  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Week 7-8: Testing + Polish                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Week 7                                                                │ │
│  │  ├── End-to-end testing (full flow)                                    │ │
│  │  ├── Bug fixes                                                         │ │
│  │  ├── Performance optimization                                          │ │
│  │  └── Documentation                                                     │ │
│  │                                                                        │ │
│  │  Week 8                                                                │ │
│  │  ├── Security review (final)                                           │ │
│  │  ├── Investor demo preparation                                         │ │
│  │  ├── Disclaimers review                                                │ │
│  │  └── MVP launch (testnet)                                            │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 10.2 Milestones

| Milestone | Date | Deliverables | Success Criteria |
|-----------|------|--------------|------------------|
| **Smart Contracts Complete** | Week 2 | uLPToken, LiquidityPool, MockEscrow, MockFiatRamp | All tests pass, Slither review clean |
| **Backend Complete** | Week 4 | All services + API endpoints | API documentation complete, tests pass |
| **Frontend Complete** | Week 6 | All MVP pages | All flows functional, Lighthouse >90 |
| **Integration Complete** | Week 7 | End-to-end testing | Full flow works in <10 min |
| **MVP Launch** | Week 8 | Testnet deployment | Public demo available |

---

# 11. Risk Management

## 11.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Smart contract bugs | Medium | HIGH | Extensive testing, Slither review, manual audit |
| Yield calculation errors | Low | HIGH | Unit tests, peer review, comparison with traditional finance |
| Frontend integration issues | Medium | MEDIUM | Early integration testing, component testing |
| Mock service complexity | Low | MEDIUM | Clean interfaces, dependency injection |

## 11.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Misunderstood as "demo" | High | MEDIUM | Clear branding as "MVP", not "demo" |
| Investor confusion | Medium | MEDIUM | Clear disclaimers, documentation, demo script |
| Timeline slippage | Medium | HIGH | Buffer in schedule, weekly check-ins |
| Budget overrun | Low | MEDIUM | Fixed-price contracts, scope management |

## 11.3 Regulatory Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Misunderstood as securities offering | Medium | HIGH | Clear disclaimers: "Testnet only, no real money" |
| Premature mainnet deployment | Low | CRITICAL | Governance approval required for mainnet |
| Compliance gaps | Medium | HIGH | Legal review before mainnet, parallel legal track |

---

# 12. MVP → Production Path

## 12.1 What Changes

| Component | MVP | Production | Effort |
|-----------|-------|------------|--------|
| **uLPToken** | Testnet deployment | Mainnet deployment + audit | 1 week |
| **LiquidityPool** | Testnet deployment | Mainnet deployment + audit | 1 week |
| **MockEscrow** | Mock bank service | Real BIIC (Banque Internationale pour l'Industrie et le Commerce)/MCB API | 2-3 weeks |
| **MockFiatRamp** | Mock fiat service | Real Ondo Finance/bank API | 2-3 weeks |
| **Mock GDIZ (Benin)** | Mock service | Real GDIZ (Benin) integration | 2-3 weeks |
| **Yield Calculation** | Same (real math) | Same (real data) | 0 weeks |
| **Frontend** | Same UI/UX | Same UI/UX | 0 weeks |

## 12.2 What Stays the Same

- ✅ uLPToken logic (yield-bearing mechanics)
- ✅ LiquidityPool logic (pool management)
- ✅ Yield calculation math
- ✅ Frontend UI/UX
- ✅ Dashboard components
- ✅ API structure (same endpoints)

## 12.3 Production Requirements

Before mainnet deployment:

1. ✅ **Security Audit** - Third-party audit (CertiK/Trail of Bits)
2. ✅ **Mauritius Entity** - CIS Manager License
3. ✅ **Bank Partnerships** - BIIC (Banque Internationale pour l'Industrie et le Commerce)/MCB escrow accounts
4. ✅ **Legal Review** - OHADA compliance, securities law
5. ✅ **Compliance Officers** - AML/CFT officer appointed
6. ✅ **Governance Approval** - Multi-sig for mainnet deployment

## 12.4 Transition Timeline

```
MVP (Testnet)                    Production (Mainnet)
─────────────────                  ────────────────────
Week 8: MVP launch               Week 9-16: Parallel tracks
                                   ├── Legal (Mauritius entity)
                                   ├── Banking (BIIC (Banque Internationale pour l'Industrie et le Commerce)/MCB partnership)
                                   ├── Audit (third-party security)
                                   └── Compliance (officers hired)

                                   Week 17-20: Production deployment
                                   ├── Deploy audited contracts
                                   ├── Integrate real bank APIs
                                   ├── Mainnet launch
                                   └── Onboard first institutional investor
```

---

# Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Ujamaa Pool Token (uLP)** | Ujamaa Liquidity Provider token - yield-bearing LP token |
| **NAV** | Net Asset Value - value per Ujamaa Pool Token (uLP) |
| **Yield-Bearing** | Token that appreciates in value over time |
| **Value-Accrual** | Model where balance stays constant, value increases |
| **Mock Service** | Simulated service (bank, GDIZ (Benin)) for testnet |
| **Escrow** | Regulated bank account holding investor funds |
| **Pool** | Liquidity pool managing multiple financings |
| **MVP** | Second iteration: Institutional architecture |

---

# Appendix B: Quick Start Commands

## Smart Contracts

**⚠️ IMPORTANT:** Per SRS v2.0 Section 5.1, all smart contract development **MUST** use **ApeWorX** framework (no Hardhat, no Truffle).

```bash
# Install ApeWorX dependencies
pip install eth-ape
ape plugins install solidity
ape plugins install foundry

# Compile contracts
ape compile

# Run tests
ape test

# Run tests with coverage
ape test --coverage

# Deploy to testnet (Polygon Amoy)
ape run scripts/MVP/deploy_MVP.py --network polygon-amoy

# Deploy to local node
ape run scripts/MVP/deploy_MVP.py --network localhost

# Console for interactive development
ape console --network polygon-amoy
```

## Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Run tests
pytest backend/services/MVP/ --cov

# Start server
uvicorn backend.main:app --reload
```

## Frontend

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start dev server
npm run dev

# Build for production
npm run build
```

---

**Document Control:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 17, 2026 | Aziz Da Silva | Initial MVP specification |

**Next Review:** After MVP launch (Week 8)

**Related Documents:**
- `docs/01_SPECIFICATIONS/01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` - Full SRS
- `docs/02_MVP_EXECUTION/02_MVP_4WEEK_PLAN_V1.1.md` - MVP-1 plan
- `docs/13_NEXT/04_CONSOLIDATED_AUDIT_SUMMARY.md` - Gap analysis
- `docs/13_NEXT/06_DEMO_IMPLEMENTATION_PLAN.md` - Original demo plan


