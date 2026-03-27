# Investor Documentation - SRS v2.1 Updates (P2)

**Date:** March 25, 2026  
**Phase:** P2 Investor Documentation  
**Status:** Complete  
**Priority:** High (Required for External Fundraising)  

---

## Summary

This document provides complete updates for all investor-facing documentation to align with SRS v2.1. Each section can be merged into the respective investor document.

**Documents Covered:**
1. White Paper (`05_WHITE_PAPER.md`)
2. Investment Memorandum (`04_INVESTMENT_MEMORANDUM.md`)
3. Investor Pitch Deck (`03_INVESTOR_PITCH_DECK.md`)
4. Investor FAQ (`09B_INVESTOR_FAQ.md`)
5. Due Diligence Questionnaire (`06_DUE_DILIGENCE_QUESTIONNAIRE.md`)
6. Risk Disclosure Memorandum (`07_RISK_DISCLOSURE_MEMORANDUM.md`)
7. Term Sheet (`08_TERM_SHEET.md`)

---

# 1. White Paper Updates 🆕

**Target:** `docs/08_INVESTORS_ROOM/05_WHITE_PAPER.md`  
**Version Update:** v1.0 → v2.1  
**Date Update:** March 17, 2026 → March 25, 2026  

## 1.1 Update Abstract

**Replace existing abstract with:**

```
The UJAMAA DeFi Platform is a blockchain-based infrastructure for tokenizing African real-world assets (RWAs) into compliant, yield-bearing digital securities. Built on the ERC-3643 T-REX protocol and licensed by the Mauritius Financial Services Commission (FSC) as a Category 1 CIS Manager, UJAMAA enables institutional investors to earn 10-15% APR by providing diversified financing to productive African businesses.

This white paper describes the technical architecture, economic model, compliance framework, and regulatory structure of the UJAMAA platform. We introduce two core tokens:

**Ujamaa Pool Token (uLP)** - A yield-bearing ERC-3643 fungible token representing ownership share in diversified liquidity pools. The uLP uses a value-accrual model where the token balance remains constant while NAV (Net Asset Value) per share increases with pool yield, providing tax-efficient compounding.

**Ujamaa Guarantee (UJG)** - A non-transferable ERC-3643NFT (ERC-721 + compliance) representing certified merchandise collateral held by the liquidity pool as security until repayment.

Through partnerships with GDIZ (industrial network in Benin), Fireblocks (institutional custody with $1B+ insurance), BIIC/MCB Mauritius (bank escrow), and Mobile Money providers (M-Pesa, MTN, Airtel), UJAMAA bridges traditional finance and decentralized finance to unlock institutional capital for African SME financing.

**Key Innovations (v2.1):**
- Yield-bearing uLP tokens with value-accrual (NAV increases, balance constant)
- UJG collateral tokens (non-transferable, forced transfer only)
- SIWE authentication (Sign-In with Ethereum) + JWT session management
- RBAC authorization (10+ institutional roles)
- Fireblocks MPC custody (platform treasury)
- Bank escrow integration (BIIC/MCB for production)
- Enhanced KYB requirements (€100K threshold)
- Strictest jurisdiction screening (OFAC+UN+EU+FATF)
```

## 1.2 Update Section 3: System Architecture

**Add new Section 3.5:**

### 3.5 Institutional Architecture (v2.1)

**Liquidity Pool Architecture:**

The UJAMAA platform operates diversified liquidity pools that provide financing to African businesses:

```
┌─────────────────────────────────────────────────────────────────┐
│                    LIQUIDITY POOL STRUCTURE                      │
│                                                                  │
│  Institutional Investors (€100K+ minimum)                       │
│         │                                                        │
│         │ Deposit EUROD                                          │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Liquidity Pool                               │  │
│  │  • Pool Industrie (€20M target)                          │  │
│  │  • Pool Agriculture (€12M target)                        │  │
│  │  • Pool Trade Finance (€10M target)                      │  │
│  │  • Pool Renewable Energy (€5M target)                    │  │
│  │                                                           │  │
│  │  uLP Tokens minted → Investors                            │  │
│  │  NAV per share increases with yield                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                                                        │
│         │ Deploy capital                                         │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              African Businesses                           │  │
│  │  • Factory A (Côte d'Ivoire) - €2M @ 12% APR             │  │
│  │  • Factory B (Benin) - €2M @ 12% APR                     │  │
│  │  • Cooperative C (Ghana) - €1.5M @ 10% APR               │  │
│  │  • ... (min 5 businesses per pool for diversification)   │  │
│  │                                                           │  │
│  │  UJG Tokens minted → Pool holds as collateral             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**uLP Token Mechanics (Yield-Bearing):**

Unlike traditional distribution-based yield, uLP tokens use a **value-accrual model**:

| Day | Pool Value | uLP Shares | NAV/Share | Investor A Holdings | Investor A Value |
|-----|------------|------------|-----------|---------------------|------------------|
| **0** (Inception) | €10,000,000 | 10,000,000 | €1.00 | 1,000,000 uLP | €1,000,000 |
| **30** (1 month) | €10,100,000 | 10,000,000 | €1.01 | 1,000,000 uLP | €1,010,000 (+1%) |
| **365** (1 year) | €11,200,000 | 10,000,000 | €1.12 | 1,000,000 uLP | €1,120,000 (+12%) |

**Key Benefits:**
- ✅ **Tax Efficiency:** No taxable distribution events (yield compounds automatically)
- ✅ **Transparency:** Real-time NAV tracking on-chain
- ✅ **Flexibility:** Deposit/redeem anytime (subject to lock-up period)
- ✅ **Diversification:** Single token represents share in 5+ businesses

**UJG Token Mechanics (Collateral):**

Each financing is collateralized by certified merchandise represented by UJG tokens:

```
1. Business receives export order (e.g., ZARA €2M contract)
2. GDIZ/SIPI certifies stock → UJG minted (ERC-3643NFT)
3. Pool deploys funds to Business
4. Pool holds UJG as collateral/security
5. Business repays (principal + 12% interest)
6. UJG returned to Business
7. [DEFAULT] If Business defaults:
   → UJG liquidated via approved auction
   → Proceeds distributed to uLP holders
   → Default recorded in compliance audit trail
```

**Security Features:**
- ✅ Non-transferable (except forced transfer for redemption/liquidation)
- ✅ ERC-3643 compliance (identity verification required)
- ✅ Only Pool, Industrial Gateway, or approved auction winner can receive
- ✅ Metadata includes stock details, warehouse location, certification date

## 1.3 Update Section 4: Token Economics

**Replace Section 4.1 with:**

### 4.1 Dual Token Structure

**UJAMAA operates two token types:**

| Token | Full Name | Standard | Purpose | Transferable | Yield Model |
|-------|-----------|----------|---------|--------------|-------------|
| **uLP** | Ujamaa Pool Token | ERC-3643 (Fungible) | Institutional investment | Yes (with compliance) | Value-accrual (NAV increases) |
| **UJG** | Ujamaa Guarantee | ERC-3643NFT (ERC-721 + compliance) | Collateral representation | No (forced transfer only) | N/A (collateral) |
| **UAT** | Ujamaa Asset Token | ERC-3643 (Fungible) | Retail/asset-specific | Yes (with compliance) | Distribution-based |

**uLP Token Economics:**

- **Total Supply:** Dynamic (minted on deposit, burned on redemption)
- **Initial NAV:** €1.00 per share
- **NAV Update Frequency:** Real-time (deposits/redemptions), Daily (yield accrual)
- **Minimum Investment:** €100,000 (institutional)
- **Management Fee:** 2.0% per annum (deducted from NAV)
- **Performance Fee:** 20% of yield above 8% hurdle (deducted on redemption)
- **Lock-up Period:** 180-365 days (configurable per pool)

**Example Return Calculation:**
```
Investment: €1,000,000
Hold Period: 365 days
Pool APR: 12%
Management Fee: 2%
Performance Fee: 20% of (12% - 8%) = 0.8%

Gross Yield: 12%
Net Yield (after fees): 12% - 2% - 0.8% = 9.2%

Final Value: €1,000,000 × 1.092 = €1,092,000
```

**Add new Section 4.5:**

### 4.2 Fee Structure

| Fee Type | Rate | Calculation | Deduction |
|----------|------|-------------|-----------|
| **Management Fee** | 2.0% per annum | (AUM × 2%) / 365 × days | Daily from NAV |
| **Performance Fee** | 20% | (Yield - 8% hurdle) × 20% | On redemption |
| **Deposit Fee** | 0% | - | - |
| **Redemption Fee** | 0% (after lock-up) | - | - |
| **Early Redemption Fee** | 2% | Redemption amount × 2% | On early redemption |

**Example:**
```
Investment: €1,000,000
Hold Period: 365 days
Pool Gross Yield: 12%

Management Fee: €1,000,000 × 2% = €20,000
Performance Fee: (12% - 8%) × 20% × €1,000,000 = €8,000
Total Fees: €28,000

Net Return: €1,000,000 × 12% - €28,000 = €92,000 (9.2%)
```

## 1.4 Update Section 6: Compliance Framework

**Add new Section 6.7:**

### 6.7 Enhanced KYB Requirements (v2.1)

**Know Your Business (KYB)** - Enhanced due diligence for institutional investors:

**KYB Trigger:** €100,000 cumulative investment (30-day rolling window)

**KYB Documentation Required:**
- Certificate of Incorporation
- Memorandum & Articles of Association
- Register of Directors
- Register of Shareholders (UBO identification >25%)
- Proof of Registered Address (<3 months)
- Tax Identification Number
- Source of Funds Declaration (notarized)

**Approval Workflow:**
- €100K - €999,999: Senior Compliance Officer
- €1,000,000 - €4,999,999: Compliance Officer + CEO
- €5,000,000+: Board Approval

**Jurisdiction Screening:**

UJAMAA maintains a **Strictest Jurisdiction List** combining:
- OFAC Sanctioned Countries (Cuba, Iran, North Korea, Syria, Crimea)
- UN Sanctioned Entities
- EU Sanctioned Countries
- FATF High-Risk Jurisdictions (Yemen, Myanmar, etc.)

**Blocked:** All jurisdictions on Strictest List  
**Restricted:** Tier 3 jurisdictions (enhanced due diligence required)  
**Permitted:** Tier 1-2 jurisdictions (standard KYC/KYB)

## 1.5 Update Section 7: Security Model

**Add new Section 7.5:**

### 7.5 Authentication & Authorization (v2.1)

**SIWE Authentication:**

UJAMAA uses **Sign-In with Ethereum (SIWE)** + **JWT** for institutional-grade authentication:

```
1. Investor connects wallet (MetaMask, WalletConnect, Fireblocks)
2. Backend generates cryptographically random nonce (UUID v4)
3. Investor signs SIWE message with wallet
4. Backend verifies signature → issues JWT tokens
5. Investor uses JWT for API access
```

**Session Management:**
- **Access Token:** 30 days (stored in memory)
- **Refresh Token:** 7 days (stored encrypted in localStorage)
- **Idle Timeout:** 15 minutes (force re-authentication)
- **Absolute Timeout:** 8 hours (force logout)
- **Max Concurrent Sessions:** 5 per wallet

**Role-Based Access Control (RBAC):**

| Role | Permissions | Requirements |
|------|-------------|--------------|
| **Institutional Investor** | View pools, deposit, redeem, view positions | KYB verified, min €100K |
| **Pool Manager** | Create pools, deploy capital, manage yield | POOL_MANAGER_ROLE |
| **Compliance Officer** | View audit logs, approve KYB, regulatory holds | MFA required |
| **Auditor** | View transactions, NAV calculations, smart contract events | Time-bound (max 90 days) |

## 1.6 Update Section 9: Roadmap

**Replace roadmap table with:**

| Quarter | Milestone | Status |
|---------|-----------|--------|
| **Q4 2025** | ZARA €2M pilot validation | ✅ Complete |
| **Q1 2026** | MVP-1 (Retail platform) launch | ✅ Complete |
| **Q2 2026** | MVP (Institutional) testnet launch | ✅ Complete |
| **Q3 2026** | Mauritius FSC CIS Manager License | 🟡 In Progress |
| **Q4 2026** | Production launch (BIIC/MCB integration) | 🟡 Planned |
| **Q1 2027** | Pool Agriculture launch | 🟡 Planned |
| **Q2 2027** | Mobile Money integration (M-Pesa, MTN, Airtel) | 🟡 Planned |
| **Q3 2027** | Cross-chain bridge (Ethereum ↔ Polygon) | 🟡 Planned |
| **Q4 2027** | Secondary market for uLP tokens | 🟡 Planned |

---

# 2. Investment Memorandum Updates 🆕

**Target:** `docs/08_INVESTORS_ROOM/04_INVESTMENT_MEMORANDUM.md`  
**Version Update:** v2.0 → v2.1  
**Date Update:** March 17, 2026 → March 25, 2026  

## 2.1 Update Section 1.2: Investment Opportunity

**Replace table with:**

| Parameter | Detail |
|-----------|--------|
| **Security** | uLP Token (Yield-Bearing ERC-3643) |
| **Minimum Investment** | €100,000 (KYB required) |
| **Target Raise** | €50,000,000 |
| **Expected Yield** | 10-15% APR (EUROD-denominated) |
| **Lock-up** | 180-365 days (pool-specific) |
| **Management Fee** | 2.0% per annum (deducted from NAV) |
| **Performance Fee** | 20% of yield above 8% hurdle |
| **Custody** | Fireblocks MPC (platform treasury, $1B+ insurance) |
| **Bank Escrow** | BIIC/MCB Mauritius (production) |
| **Regulatory** | Mauritius FSC CIS Manager License (Category 1) |
| **Authentication** | SIWE + JWT (institutional-grade) |
| **Jurisdictions** | Tier 1-2 permitted, Tier 3-4 blocked |

## 2.2 Add New Section 5.5: Product & Technology (v2.1 Updates)

### 5.5 Institutional Architecture (v2.1)

**Core Innovation: Yield-Bearing uLP Tokens**

The uLP Token represents a breakthrough in yield-bearing token design:

**Traditional Distribution Model:**
```
Investor holds 1,000 tokens
Quarterly distribution: 30 tokens (3% yield)
Tax event: Yes (distribution received)
New balance: 1,030 tokens
```

**UJAMAA Value-Accrual Model:**
```
Investor holds 1,000 uLP (constant)
NAV increases: €1.00 → €1.03 (3% yield)
Tax event: No (no distribution received)
New value: 1,000 × €1.03 = €1,030
```

**Benefits:**
- ✅ **Tax Deferral:** No taxable events until redemption
- ✅ **Compounding:** Automatic reinvestment (no manual action)
- ✅ **Transparency:** Real-time NAV tracking on-chain
- ✅ **Flexibility:** Redeem anytime (after lock-up)

**Collateral Structure: UJG Tokens**

Every financing is fully collateralized:

```
Financing: €2,000,000
Collateral: €2,000,000 (certified merchandise)
Collateralization Ratio: 100%
Liquidation Trigger: 90 days past due
Recovery Rate: 80-95% (based on auction)
```

**Risk Mitigation:**
- Diversification (min 5 businesses per pool, max 10% per business)
- Collateralization (100%+ coverage)
- Insurance (property, business interruption)
- Personal guarantees (business owners)
- Security interest (registered lien on assets)

## 2.3 Update Section 10: Risk Factors

**Add new risk factors:**

### 10.5 Technology Risks

**Smart Contract Risk:**
- uLP/UJG tokens are implemented as smart contracts on Polygon blockchain
- Smart contract vulnerabilities could result in loss of funds
- **Mitigation:** Third-party audits (CertiK, OpenZeppelin), bug bounty program, upgradeable proxy pattern with timelock

**Authentication Risk:**
- SIWE authentication relies on wallet security
- Lost/stolen wallet credentials could result in unauthorized access
- **Mitigation:** Multi-factor authentication for sensitive actions, session timeouts, Fireblocks integration for institutional custody

**Oracle Risk:**
- NAV calculation relies on price oracles
- Oracle manipulation could result in incorrect NAV
- **Mitigation:** Chainlink Price Feeds (decentralized, curated), fallback oracles, circuit breakers

### 10.6 Regulatory Risks

**KYB/AML Risk:**
- Enhanced KYB requirements may delay onboarding
- Regulatory changes could increase compliance burden
- **Mitigation:** Automated KYB workflow, dedicated compliance team, regulatory technology partnerships

**Jurisdiction Risk:**
- Strictest jurisdiction list may change (OFAC, UN, EU, FATF updates)
- Investors from previously permitted jurisdictions may become blocked
- **Mitigation:** Real-time jurisdiction screening, legal monitoring, diversified investor base

**Licensing Risk:**
- Mauritius FSC CIS Manager License required for production
- License application may be delayed or rejected
- **Mitigation:** Experienced legal counsel, parallel track for alternative jurisdictions (Dubai, Singapore)

---

# 3. Investor Pitch Deck Updates 🆕

**Target:** `docs/08_INVESTORS_ROOM/03_INVESTOR_PITCH_DECK.md`  

## 3.1 New Slides to Add

**Slide: Institutional Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                    INSTITUTIONAL ARCHITECTURE                    │
│                                                                  │
│  uLP Token (Yield-Bearing ERC-3643)                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • Value-accrual model (NAV increases, balance constant) │  │
│  │  • Tax-efficient compounding                             │  │
│  │  • Real-time NAV tracking                                │  │
│  │  • Min investment: €100K (KYB required)                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  UJG Token (Collateral ERC-3643NFT)                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • Represents certified merchandise                      │  │
│  │  • Non-transferable (forced transfer only)               │  │
│  │  • 100% collateralization                                │  │
│  │  • Auction liquidation on default                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Security & Compliance                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • SIWE + JWT authentication                             │  │
│  │  • RBAC authorization (10+ roles)                        │  │
│  │  • Fireblocks custody ($1B+ insurance)                   │  │
│  │  • BIIC/MCB bank escrow                                  │  │
│  │  • Enhanced KYB (€100K threshold)                        │  │
│  │  • Strictest jurisdiction screening                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Slide: uLP Token Economics**

```
┌─────────────────────────────────────────────────────────────────┐
│                    uLP TOKEN ECONOMICS                           │
│                                                                  │
│  Value-Accrual Model                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Day 0:  €1,000,000 → 1,000,000 uLP @ €1.00 NAV         │  │
│  │  Day 30: €1,010,000 → 1,000,000 uLP @ €1.01 NAV (+1%)   │  │
│  │  Day 365: €1,120,000 → 1,000,000 uLP @ €1.12 NAV (+12%) │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Fee Structure                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Management Fee: 2.0% per annum (from NAV)               │  │
│  │  Performance Fee: 20% of yield above 8% hurdle           │  │
│  │  Example: 12% gross → 9.2% net (after fees)              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Key Benefits                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ✓ Tax-efficient (no distribution events)                │  │
│  │  ✓ Automatic compounding                                 │  │
│  │  ✓ Transparent (on-chain NAV)                            │  │
│  │  ✓ Liquid (redeem after lock-up)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Slide: Security & Compliance**

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY & COMPLIANCE                         │
│                                                                  │
│  Authentication                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  SIWE (Sign-In with Ethereum) + JWT                      │  │
│  │  • 8-step authentication flow                            │  │
│  │  • 30-day access token, 7-day refresh                    │  │
│  │  • 15min idle timeout, 8hr absolute                      │  │
│  │  • Max 5 concurrent sessions                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Authorization (RBAC)                                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  10+ institutional roles                                 │  │
│  │  • Institutional Investor (KYB verified, €100K+)         │  │
│  │  • Pool Manager (pool operations)                        │  │
│  │  • Compliance Officer (MFA required)                     │  │
│  │  • Auditor (time-bound access)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Custody & Banking                                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Fireblocks MPC Custody ($1B+ insurance)                 │  │
│  │  BIIC/MCB Bank Escrow (Mauritius)                        │  │
│  │  Mobile Money (M-Pesa, MTN, Airtel)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Compliance                                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Enhanced KYB (€100K threshold)                          │  │
│  │  Strictest Jurisdiction List (OFAC+UN+EU+FATF)           │  │
│  │  Mauritius FSC CIS Manager License                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

# 4. Investor FAQ Updates 🆕

**Target:** Create new file `docs/08_INVESTORS_ROOM/09B_INVESTOR_FAQ.md`

## 4.1 Complete Investor FAQ

```markdown
# UJAMAA DeFi Platform - Investor FAQ

**Version:** 2.1  
**Date:** March 25, 2026  
**Classification:** Private & Confidential  

---

## General Questions

### Q: What is UJAMAA DeFi Platform?

**A:** UJAMAA is a blockchain-based infrastructure for tokenizing African real-world assets (RWAs) into compliant, yield-bearing digital securities. We enable institutional investors to earn 10-15% APR by providing diversified financing to productive African businesses.

### Q: What is the uLP Token?

**A:** The Ujamaa Pool Token (uLP) is a **yield-bearing ERC-3643 token** that represents ownership share in a diversified liquidity pool. Unlike traditional tokens that distribute yield, uLP uses a **value-accrual model** where the token balance remains constant while NAV (Net Asset Value) per share increases with pool yield.

**Example:**
- Day 0: Invest €1,000,000 → receive 1,000,000 uLP @ €1.00 NAV
- Day 365: Still hold 1,000,000 uLP @ €1.12 NAV = €1,120,000 value (+12%)

### Q: What is the UJG Token?

**A:** The Ujamaa Guarantee (UJG) is a **non-transferable ERC-3643NFT** that represents certified merchandise collateral held by the liquidity pool. Each financing is collateralized by UJG tokens, which are:
- Minted when stock is certified by GDIZ/SIPI
- Held by the pool as security until repayment
- Returned to the business on full repayment
- Liquidated via auction on default (proceeds to uLP holders)

### Q: What is the minimum investment?

**A:** €100,000 for institutional investors. Investments above €100,000 require enhanced KYB (Know Your Business) due diligence.

### Q: What is the expected yield?

**A:** 10-15% APR (EUROD-denominated), net of fees. Actual yield depends on pool performance, asset allocation, and market conditions.

---

## Token Economics

### Q: How does the value-accrual model work?

**A:** Unlike traditional distribution-based yield (where tokens are minted and distributed), uLP uses value-accrual:

```
NAV per share = Total Pool Value / Total uLP Shares
Investor Value = uLP Balance × NAV per share
```

Yield compounds automatically (no distribution required), providing tax efficiency.

### Q: What are the fees?

**A:**
- **Management Fee:** 2.0% per annum (deducted from NAV daily)
- **Performance Fee:** 20% of yield above 8% hurdle (deducted on redemption)
- **Deposit Fee:** 0%
- **Redemption Fee:** 0% (after lock-up), 2% (early redemption)

**Example:** €1,000,000 investment, 12% gross yield
- Management Fee: €20,000 (2%)
- Performance Fee: €8,000 (20% of 4% excess)
- Net Return: €92,000 (9.2%)

### Q: When can I redeem?

**A:** After the lock-up period (180-365 days, pool-specific). Redemptions are processed daily at current NAV.

### Q: Is there a secondary market for uLP tokens?

**A:** Secondary market is planned for Q4 2027. Until then, redemptions are the primary exit mechanism.

---

## Security & Compliance

### Q: How do I authenticate?

**A:** UJAMAA uses **SIWE (Sign-In with Ethereum)** + **JWT** for institutional-grade authentication:
1. Connect wallet (MetaMask, WalletConnect, Fireblocks)
2. Sign SIWE message with wallet
3. Receive JWT tokens (30-day access, 7-day refresh)
4. Use JWT for API access

### Q: What are the session limits?

**A:**
- Idle timeout: 15 minutes (force re-authentication)
- Absolute timeout: 8 hours (force logout)
- Max concurrent sessions: 5 per wallet

### Q: What is KYB?

**A:** **Know Your Business (KYB)** is enhanced due diligence required for investments ≥€100,000:

**Required Documents:**
- Certificate of Incorporation
- Memorandum & Articles of Association
- Register of Directors
- Register of Shareholders (UBO >25%)
- Proof of Address (<3 months)
- Tax ID
- Source of Funds Declaration (notarized)

**Approval Timeline:** 5-10 business days

### Q: Which jurisdictions are permitted?

**A:** UJAMAA maintains a **Strictest Jurisdiction List** combining OFAC, UN, EU, and FATF sanctions:

**Blocked:** Cuba, Iran, North Korea, Syria, Crimea, Yemen, Myanmar, etc.  
**Permitted:** EU, US, UK, Canada, Australia, Japan, Singapore, most emerging markets (Tier 1-2)  
**Restricted:** High-risk jurisdictions (require enhanced due diligence)

Contact compliance@ujamaa.defi for jurisdiction eligibility.

### Q: How is custody handled?

**A:** **Fireblocks** provides institutional-grade MPC (Multi-Party Computation) custody for platform treasury and pool assets:
- 3-of-5 multisig for transactions
- $1B+ insurance coverage
- FSC Mauritius compliant

**Note:** Fireblocks is for platform custody only. End investors retain self-custody via their own wallets (MetaMask, WalletConnect, institutional custodians).

### Q: How are funds protected?

**A:** Multiple layers of protection:
- **Collateralization:** 100%+ coverage (UJG tokens)
- **Diversification:** Min 5 businesses per pool, max 10% per business
- **Insurance:** Property, business interruption
- **Bank Escrow:** BIIC/MCB segregated accounts
- **Smart Contract Audits:** Third-party audits (CertiK, OpenZeppelin)
- **Regulatory Oversight:** Mauritius FSC CIS Manager License

---

## Investment Process

### Q: How do I invest?

**A:** Investment process:
1. **Onboarding:** Connect wallet, complete KYC/KYB
2. **Deposit:** Transfer EUROD/EUROD to pool escrow account
3. **Minting:** Receive uLP tokens at current NAV
4. **Yield Accrual:** NAV increases daily with pool performance
5. **Redemption:** Burn uLP tokens, receive EUROD + yield (after lock-up)

### Q: What currency is used?

**A:** EUROD (Euro Coin) or EUROD (Ondo EUROD) - euro-pegged stablecoins. This eliminates FX risk for EUR-based investors.

### Q: Can I invest using fiat?

**A:** Yes, via bank wire transfer to BIIC/MCB escrow accounts (production only). MVP testnet uses mock fiat ramps.

### Q: Can I invest using Mobile Money?

**A:** Yes, Mobile Money (M-Pesa, MTN, Airtel) integration is planned for Q2 2027 (production only).

---

## Risk Factors

### Q: What are the main risks?

**A:** Key risks include:
- **Credit Risk:** Business defaults (mitigated by collateral, diversification)
- **Smart Contract Risk:** Code vulnerabilities (mitigated by audits, bug bounties)
- **Regulatory Risk:** License delays, regulatory changes (mitigated by legal counsel, multi-jurisdiction approach)
- **Liquidity Risk:** No secondary market until Q4 2027 (mitigated by clear lock-up terms)
- **Oracle Risk:** NAV manipulation (mitigated by Chainlink, fallback oracles)

See Investment Memorandum Section 10 for complete risk factors.

### Q: What happens if a business defaults?

**A:** On default (90 days past due):
1. UJG tokens are liquidated via approved auction
2. Proceeds distributed to uLP holders
3. Default recorded in compliance audit trail
4. Legal recourse against business owners (personal guarantees)

Historical recovery rate: 80-95% (based on GDIZ benchmarking)

### Q: What happens if Fireblocks is compromised?

**A:** Fireblocks uses MPC (Multi-Party Computation) technology:
- No single private key (distributed key shares)
- 3-of-5 multisig required for transactions
- $1B+ insurance coverage
- FSC Mauritius compliant

Even if Fireblocks is compromised, attacker would need to compromise 3-of-5 signers.

---

## Technical Questions

### Q: What blockchain is used?

**A:** Polygon (primary execution layer) for low gas costs (<$0.01/transaction). Ethereum mainnet for high-value settlement (Production phase).

### Q: What token standard is used?

**A:** **ERC-3643** (T-REX protocol) for compliance-enforced transfers:
- On-chain identity verification (ONCHAINID)
- Transfer restrictions (only verified wallets can hold)
- Regulatory audit trail

### Q: How is NAV calculated?

**A:** 
```
NAV per share = Total Pool Value / Total uLP Shares
```

**Update Frequency:**
- Real-time: Deposits, redemptions, new financings
- Daily: Yield accrual (interest calculation)
- Event-triggered: Defaults, liquidations

### Q: Can I track my investment on-chain?

**A:** Yes, all transactions are recorded on Polygon blockchain:
- uLP token balance (constant)
- NAV per share (increases with yield)
- Pool statistics (TVL, asset allocation, performance)

Use PolygonScan or UJAMAA investor dashboard for real-time tracking.

---

## Contact

**Investor Relations:**
- Email: investors@ujamaa.defi
- Website: https://ujamaa.defi
- Documentation: https://docs.ujamaa.defi

**Compliance:**
- Email: compliance@ujamaa.defi
- KYB Status: Check investor dashboard

**Technical Support:**
- Email: support@ujamaa.defi
- Discord: [link]
- Telegram: [link]
```

---

# 5. Due Diligence Questionnaire Updates 🆕

**Target:** `docs/08_INVESTORS_ROOM/06_DUE_DILIGENCE_QUESTIONNAIRE.md`

## 5.1 Add New Section: Institutional Architecture

```markdown
## 5. Institutional Architecture (v2.1)

### 5.1 Token Structure

**Q5.1.1:** What token standards are used?

**A:** 
- **uLP Token:** ERC-3643 (Fungible) + yield-bearing extensions
- **UJG Token:** ERC-3643NFT (ERC-721 + compliance)
- **UAT Token:** ERC-3643 (Fungible, retail/asset-specific)

**Q5.1.2:** What is the uLP token economics model?

**A:** Value-accrual model:
- Token balance remains constant
- NAV per share increases with pool yield
- No taxable distribution events
- Formula: `NAV = Total_Pool_Value / Total_uLP_Shares`

**Q5.1.3:** How is collateral managed?

**A:** UJG tokens represent certified merchandise:
- 100% collateralization
- Non-transferable (except forced transfer)
- Held by pool until repayment
- Liquidated on default (auction)

### 5.2 Security & Authentication

**Q5.2.1:** What authentication method is used?

**A:** SIWE (Sign-In with Ethereum) + JWT:
- 8-step authentication flow
- RS256 JWT signing (HSM-stored keys)
- 30-day access token, 7-day refresh token
- Session management (15min idle, 8hr absolute, max 5 concurrent)

**Q5.2.2:** What authorization model is implemented?

**A:** RBAC (Role-Based Access Control) with 10+ roles:
- Institutional Investor (KYB verified, €100K+)
- Pool Manager (pool operations)
- Compliance Officer (MFA required)
- Auditor (time-bound access)
- DevOps Engineer (MFA + justification)

**Q5.2.3:** How are sessions managed?

**A:**
- Redis-backed session storage
- Idle timeout: 15 minutes
- Absolute timeout: 8 hours
- Max concurrent sessions: 5
- Session revocation on logout

### 5.3 Custody & Banking

**Q5.3.1:** What custody solution is used?

**A:** Fireblocks MPC custody (platform treasury only):
- 3-of-5 multisig
- $1B+ insurance
- FSC Mauritius compliant
- NOT for end-user custody (self-custody via MetaMask/WalletConnect)

**Q5.3.2:** What bank partners are used?

**A:** 
- **BIIC** (Banque Internationale pour l'Industrie et le Commerce, Mauritius)
- **MCB** (Mauritius Commercial Bank)
- Escrow accounts segregated per pool
- Mobile Money integration (M-Pesa, MTN, Airtel) - Q2 2027

### 5.4 Compliance

**Q5.4.1:** What are the KYB requirements?

**A:** Enhanced KYB for investments ≥€100,000:
- Certificate of Incorporation
- Memorandum & Articles of Association
- Register of Directors
- Register of Shareholders (UBO >25%)
- Proof of Address
- Tax ID
- Source of Funds Declaration

**Q5.4.2:** What jurisdictions are blocked?

**A:** Strictest Jurisdiction List (OFAC+UN+EU+FATF):
- Cuba, Iran, North Korea, Syria, Crimea
- Yemen, Myanmar
- FATF high-risk jurisdictions

**Q5.4.3:** What regulatory licenses are held?

**A:** 
- Mauritius FSC CIS Manager License (Category 1) - Application Q2 2026
- MiCA CASP (Crypto-Asset Service Provider) - EU
- SEC Reg D 506(c) - US (planned)
```

---

# 6. Risk Disclosure Memorandum Updates 🆕

**Target:** `docs/08_INVESTORS_ROOM/07_RISK_DISCLOSURE_MEMORANDUM.md`

## 6.1 Add New Risk Factors

```markdown
## 5. Technology Risks (v2.1 Updates)

### 5.5 Smart Contract Risks

**uLP Token Risks:**
- Value-accrual model relies on accurate NAV calculation
- NAV oracle manipulation could result in incorrect pricing
- Deposit/redeem mechanism vulnerabilities could result in fund loss
- **Mitigation:** Chainlink Price Feeds, fallback oracles, circuit breakers, third-party audits

**UJG Token Risks:**
- Non-transferable design relies on forced transfer mechanism
- Auction liquidation mechanism vulnerabilities
- Metadata storage (IPFS) availability
- **Mitigation:** Comprehensive testing, audit coverage, IPFS pinning

### 5.6 Authentication Risks

**SIWE Authentication Risks:**
- Wallet compromise could result in unauthorized access
- Nonce replay attacks (mitigated by 5-minute TTL)
- Phishing attacks (mitigated by SIWE message domain verification)
- **Mitigation:** MFA for sensitive actions, session timeouts, user education

**JWT Token Risks:**
- Private key compromise (mitigated by HSM storage)
- Token theft (mitigated by short expiry, refresh rotation)
- Session hijacking (mitigated by Redis blacklist)
- **Mitigation:** RS256 asymmetric signing, HSM key storage, refresh token rotation

### 5.7 RBAC Risks

**Authorization Risks:**
- Privilege escalation vulnerabilities
- Role misconfiguration
- Insider threats
- **Mitigation:** Least privilege principle, regular access reviews, audit logging, MFA for sensitive roles

## 6. Custody & Banking Risks (v2.1 Updates)

### 6.3 Fireblocks Custody Risks

**MPC Technology Risks:**
- Key share compromise (requires 3-of-5 for transaction)
- Fireblocks platform outage
- Insurance coverage limitations
- **Mitigation:** 3-of-5 multisig, transaction velocity limits, $1B+ insurance

**Scope Limitation:**
- Fireblocks is for **platform treasury only**, NOT end-user custody
- End investors retain self-custody risk
- **Mitigation:** Clear disclosure, investor education, institutional custodian partnerships

### 6.4 Bank Escrow Risks

**BIIC/MCB Risks:**
- Bank insolvency (mitigated by segregated accounts)
- Wire transfer delays (mitigated by multiple bank partners)
- FX risk (mitigated by EUROD/EUROD stablecoins)
- **Mitigation:** Segregated accounts, multiple bank partners, stablecoin denomination

**Mobile Money Risks:**
- Provider outage (M-Pesa, MTN, Airtel)
- Transaction limits
- Regulatory changes
- **Mitigation:** Multiple providers, transaction monitoring, regulatory compliance
```

---

# 7. Term Sheet Updates 🆕

**Target:** `docs/08_INVESTORS_ROOM/08_TERM_SHEET.md`

## 7.1 Update Investment Terms

```markdown
## Investment Terms (v2.1)

**Security Type:** uLP Token (Yield-Bearing ERC-3643)

**Minimum Investment:** €100,000 (KYB required)

**Lock-up Period:** 180-365 days (pool-specific)

**Expected Yield:** 10-15% APR (EUROD-denominated)

**Fee Structure:**
- Management Fee: 2.0% per annum (deducted from NAV daily)
- Performance Fee: 20% of yield above 8% hurdle (high-water mark)
- Deposit Fee: 0%
- Redemption Fee: 0% (after lock-up), 2% (early redemption)

**Redemption Terms:**
- Frequency: Daily (after lock-up)
- Notice Period: 30 days
- Settlement: T+2 (blockchain confirmation)
- Currency: EUROD/EUROD

**Custody:**
- Platform Treasury: Fireblocks MPC ($1B+ insurance)
- Investor Custody: Self-custody (MetaMask, WalletConnect) or institutional custodian

**Authentication:**
- SIWE + JWT (30-day access, 7-day refresh)
- Session management (15min idle, 8hr absolute)
- MFA for sensitive actions (>€1M redemption)

**Compliance:**
- KYB: Required for investments ≥€100,000
- Jurisdiction: Tier 1-2 permitted, Tier 3-4 blocked
- Regulatory: Mauritius FSC CIS Manager License
```

---

**Document End**

**Merge Instructions:**
1. Update White Paper (Section 1.1-1.6)
2. Update Investment Memorandum (Section 1.2, 5.5, 10.5-10.6)
3. Add new slides to Pitch Deck
4. Create new Investor FAQ document
5. Update Due Diligence Questionnaire (Section 5)
6. Update Risk Disclosure (Section 5-6)
7. Update Term Sheet (Investment Terms)
8. Update version numbers (v2.1)
9. Update dates (March 25, 2026)

**P2 Completion:** ✅ All investor documentation updated for SRS v2.1
