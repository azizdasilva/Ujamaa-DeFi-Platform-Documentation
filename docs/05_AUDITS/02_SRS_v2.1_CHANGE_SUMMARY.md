# SRS v2.1 Change Summary

## Ujamaa DeFi Platform - Software Requirements Specification v2.1

**Document Purpose:** This document summarizes all changes introduced in SRS v2.1 and provides a migration guide for updating all related documentation.

**Author:** Aziz Da Silva - Lead Architect  
**Version:** 1.0  
**Date:** March 25, 2026  
**Classification:** Internal / Engineering  
**Audience:** Documentation Teams, Smart Contract Developers, Backend Engineers, Compliance Officers

---

## Executive Summary

SRS v2.1 introduces **institutional-grade architecture** with yield-bearing liquidity pool tokens (uLP), collateral representation tokens (UJG), enhanced authentication (SIWE + JWT), role-based access control (RBAC), and OWASP Top 10 mitigations.

This is a **major revision** from v1.3 (development) and v2.0 (initial institutional architecture). All documentation must be updated for consistency.

---

## 1. Major Changes Summary

### 1.1 Token Architecture Changes

| Token | Standard | Purpose | Transferability | Key Change |
|-------|----------|---------|-----------------|------------|
| **Ujamaa Pool Token (uLP)** | ERC-3643 (Fungible) | Investor's share in liquidity pool | Yes (with compliance) | 🆕 **Yield-bearing via value-accrual** |
| **Ujamaa Guarantee (UJG)** | ERC-3643NFT (ERC-721 + compliance) | Pool's collateral representation | No (forced transfer only) | 🆕 **New collateral token** |
| **Ujamaa Asset Token (UAT)** | ERC-3643 (Fungible) | Asset-specific tokenization | Yes (with compliance) | ℹ️ **Rebranded from "UjamaaToken"** |

**Key Distinction:**
- **uLP** = Yield-bearing investment token (like fund shares)
- **UJG** = Non-transferable collateral token (like warehouse receipt)
- **UAT** = Asset-specific token (legacy/retail model)

### 1.2 Authentication & Authorization

**New Authentication Method:**
- **SIWE (Sign-In with Ethereum)** + **JWT (JSON Web Tokens)**
- Replaces: Ad-hoc wallet signature verification

**Session Management:**
- Idle timeout: 15 minutes
- Absolute timeout: 8 hours
- Max concurrent sessions: 5 per wallet

**Authorization Model:**
- **RBAC (Role-Based Access Control)** with explicit permission matrix
- 10+ roles defined (Enterprise Partner, Investor, Pool Manager, Compliance Officer, Regulator, Auditor, etc.)

### 1.3 Security Enhancements

**OWASP Top 10 (2025) Mitigations:**
- A01: Broken Access Control → RBAC + RLS
- A03: Injection → Parameterized queries + Pydantic validators
- A05: Security Misconfiguration → CIS benchmarks + Terraform validation
- A07: Authentication Failures → SIWE + rate limiting + MFA
- A08: Software/Data Integrity → Signed upgrades + HSM keys
- A09: Logging/Monitoring → Centralized logging + alerting
- A10: SSRF → Egress filtering + allowlists

**Input Validation:**
- Explicit validation rules for all input types (text, email, amounts, wallet addresses, national IDs, files, dates)

### 1.4 Institutional Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Fireblocks Custody** | Institutional-grade MPC custody | Platform treasury only |
| **Bank Escrow** | BIIC/MCB escrow accounts | Production only |
| **Mobile Money** | M-Pesa, MTN, Airtel integration | Production only |
| **KYB Threshold** | €100,000 enhanced due diligence | Mandatory |
| **Institutional Minimum** | €1,000,000 investment minimum | Platform policy |
| **Strictest Jurisdiction List** | OFAC + UN + EU + FATF High-Risk | Blocked |

### 1.5 Yield Model

**Value-Accrual Model (uLP):**
```
NAV_per_share(t) = Total_Pool_Value(t) / Total_uLP_Shares
Investor_Value(t) = uLP_Balance × NAV_per_share(t)
```
- Token balance remains constant
- NAV per token increases with yield
- No manual distribution required (automatic accrual)

---

## 2. Documentation Migration Checklist

### 2.1 Critical Documents (Must Update Immediately)

| Document | Status | Priority | Key Changes Required |
|----------|--------|----------|---------------------|
| **01_ARCHITECTURE_SPECIFICATION.md** | ⚠️ Pending | P0 | Add uLP/UJG architecture, Fireblocks integration, SIWE auth flow |
| **05_SMART_CONTRACT_SPECIFICATION.md** | ⚠️ Pending | P0 | Add uLP (ERC-3643) and UJG (ERC-3643NFT) contract specs, yield mechanics |
| **06_API_SPECIFICATION.md** | ⚠️ Pending | P0 | Add SIWE endpoints, RBAC middleware, session management |
| **10_COMPLIANCE_FRAMEWORK.md** | ⚠️ Pending | P0 | Add KYB requirements, enhanced due diligence, strictest jurisdiction list |
| **01_MVP_SPECIFICATION.md** | ⚠️ Pending | P0 | Update to reference SRS v2.1 (not v2.0), add uLP/UJG specs |

### 2.2 Technical Guides (Update Within Sprint)

| Document | Status | Priority | Key Changes Required |
|----------|--------|----------|---------------------|
| **01_DEPLOYMENT_GUIDE.md** | ⚠️ Pending | P1 | Add Fireblocks setup, bank escrow config |
| **03_BACKEND_INTEGRATION_GUIDE.md** | ⚠️ Pending | P1 | Add SIWE implementation, RBAC patterns |
| **05_SMART_CONTRACT_INTEGRATION_GUIDE.md** | ⚠️ Pending | P1 | Add uLP/UJG integration examples |
| **09_NOMENCLATURE_NAMES.md** | ⚠️ Pending | P1 | Update token naming (uLP, UJG, UAT) |
| **10_SMART_CONTRACT_NAMING_CONVENTION.md** | ⚠️ Pending | P1 | Add GuaranteeToken, LiquidityPool naming |

### 2.3 Investor Documentation (Update Before External Comms)

| Document | Status | Priority | Key Changes Required |
|----------|--------|----------|---------------------|
| **05_WHITE_PAPER.md** | ⚠️ Pending | P1 | Update token economics (uLP yield model), add UJG explanation |
| **04_INVESTMENT_MEMORANDUM.md** | ⚠️ Pending | P1 | Update investment structure (uLP shares) |
| **03_INVESTOR_PITCH_DECK.md** | ⚠️ Pending | P2 | Add uLP/UJG slides |
| **09_INVESTOR_FAQ.md** | ⚠️ Pending | P2 | Add uLP yield questions, UJG collateral questions |

### 2.4 Algorithm Specifications (Update for Implementation)

| Document | Status | Priority | Key Changes Required |
|----------|--------|----------|---------------------|
| **01_ALGORITHM_SPECIFICATIONS.md** | ⚠️ Pending | P1 | Add NAV calculation algorithms, yield accrual algorithms |
| **05_SRS_ALGORITHM_CROSS_REFERENCE.md** | ⚠️ Pending | P2 | Update cross-reference for uLP/UJG |

### 2.5 Operations Documentation (Update Before Production)

| Document | Status | Priority | Key Changes Required |
|----------|--------|----------|---------------------|
| **01_MONITORING_SPECIFICATION.md** | ⚠️ Pending | P1 | Add uLP NAV monitoring, Fireblocks vault monitoring |
| **02_OPERATIONAL_RUNBOOKS.md** | ⚠️ Pending | P1 | Add uLP redemption runbook, UJG liquidation runbook |

---

## 3. Terminology Changes

### 3.1 Deprecated Terms

| Deprecated Term | Replacement | Context |
|-----------------|-------------|---------|
| "UjamaaToken" | **Ujamaa Asset Token (UAT)** or **ERC-3643 fungible token** | Generic token references |
| "AssetProof" | **Industrial Gateway** | Stock certification system |
| "asset_proofs" (table) | **industrial_gateway_certificates** | Database table name |
| "yield distribution" | **yield accrual** (for uLP) | uLP uses value-accrual, not distribution |

### 3.2 New Terms

| Term | Definition | First Used In |
|------|------------|---------------|
| **Ujamaa Pool Token (uLP)** | Yield-bearing ERC-3643 token representing pool ownership | SRS v2.0 |
| **Ujamaa Guarantee (UJG)** | ERC-3643NFT representing certified merchandise collateral | SRS v2.1 |
| **Value-Accrual Model** | Token economics where NAV increases, balance constant | SRS v2.1 |
| **SIWE** | Sign-In with Ethereum authentication | SRS v2.1 |
| **RBAC** | Role-Based Access Control | SRS v2.1 |
| **KYB** | Know Your Business (enhanced due diligence ≥€100K) | SRS v2.1 |
| **Strictest Jurisdiction List** | OFAC + UN + EU + FATF High-Risk | SRS v2.1 |

---

## 4. Smart Contract Changes

### 4.1 New Contracts Required

| Contract | Standard | Purpose | Priority |
|----------|----------|---------|----------|
| **LiquidityPool.sol** | Custom | Pool management, asset allocation | P0 |
| **UjamaaPoolToken.sol** | ERC-3643 + ERC-20 | Yield-bearing uLP token | P0 |
| **GuaranteeToken.sol** | ERC-3643NFT (ERC-721 + compliance) | Collateral NFT | P0 |
| **NavOracle.sol** | Custom | NAV price feed | P1 |
| **YieldDistributor.sol** | Custom | Yield statement generation | P1 |

### 4.2 Contract Interface Changes

**UjamaaPoolToken (uLP):**
```solidity
interface IUjamaaPoolToken {
    // Yield-bearing: balance constant, NAV increases
    function balanceOf(address account) external view returns (uint256);
    function getNAVPerShare() external view returns (uint256);
    function getInvestorValue(address account) external view returns (uint256);
    
    // Deposit/redeem
    function deposit(uint256 amount) external returns (uint256 uLPMinted);
    function redeem(uint256 uLPAmount) external returns (uint256 Ondo EUROD (EUROD)Received);
}
```

**GuaranteeToken (UJG):**
```solidity
interface IGuaranteeToken {
    // Non-transferable (except forced)
    function mintGuarantee(address industrial, uint256 value, bytes32 stockHash) external returns (uint256 tokenId);
    function redeemGuarantee(uint256 tokenId) external;
    function liquidateGuarantee(uint256 tokenId, address winner) external;
    
    // Override transfer to prevent unauthorized transfers
    function transfer(address, uint256) external pure override returns (bool);
    function safeTransferFrom(address from, address to, uint256 tokenId) external override;
}
```

---

## 5. API Changes

### 5.1 New Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/api/v1/auth/nonce` | Request nonce for SIWE | None |
| POST | `/api/v1/auth/login` | SIWE login (signature verification) | None |
| POST | `/api/v1/auth/refresh` | Refresh JWT token | Refresh token |
| POST | `/api/v1/auth/logout` | Invalidate sessions | Access token |
| GET | `/api/v1/pools` | List liquidity pools | Institutional Investor |
| GET | `/api/v1/pools/{id}/nav` | Get NAV per share | Public |
| GET | `/api/v1/pools/{id}/allocations` | Get asset allocation | Institutional Investor |
| POST | `/api/v1/pools/{id}/deposit` | Deposit Ondo EUROD (EUROD) for uLP | Institutional Investor |
| POST | `/api/v1/pools/{id}/redeem` | Redeem uLP for Ondo EUROD (EUROD) + yield | Institutional Investor |
| GET | `/api/v1/guarantees` | List Guarantee Tokens | Pool Manager |
| POST | `/api/v1/guarantees` | Mint Guarantee Token | Industrial Gateway |
| POST | `/api/v1/guarantees/{id}/liquidate` | Liquidate defaulted collateral | Pool Manager |

### 5.2 Authentication Flow

```
1. GET /api/v1/auth/nonce?wallet=0x...
   → Returns: { nonce: "uuid-v4", expiresAt: "ISO8601" }

2. User signs SIWE message with wallet

3. POST /api/v1/auth/login
   Body: { wallet, signature, nonce }
   → Returns: { accessToken, refreshToken, expiresAt }

4. Subsequent requests include: Authorization: Bearer <accessToken>

5. Token refresh (before expiry):
   POST /api/v1/auth/refresh
   Body: { refreshToken }
   → Returns: { accessToken, refreshToken } (rotated)
```

---

## 6. Database Schema Changes

### 6.1 New Tables

```sql
-- Liquidity Pools
CREATE TABLE liquidity_pools (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pool_family VARCHAR(50) NOT NULL, -- POOL_INDUSTRIE, POOL_AGRICULTURE, etc.
    total_value_locked DECIMAL(18,2) DEFAULT 0,
    nav_per_share DECIMAL(18,8) DEFAULT 1.0,
    total_shares DECIMAL(18,8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- uLP Positions
CREATE TABLE ulp_positions (
    id UUID PRIMARY KEY,
    investor_wallet VARCHAR(42) NOT NULL,
    pool_id UUID REFERENCES liquidity_pools(id),
    share_balance DECIMAL(18,8) NOT NULL,
    avg_cost_basis DECIMAL(18,8),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Guarantee Tokens
CREATE TABLE guarantee_tokens (
    id UUID PRIMARY KEY,
    token_id DECIMAL(78) NOT NULL, -- NFT token ID
    industrial_wallet VARCHAR(42) NOT NULL,
    pool_id UUID REFERENCES liquidity_pools(id),
    certificate_id VARCHAR(255) NOT NULL,
    merchandise_value DECIMAL(18,2) NOT NULL,
    stock_hash VARCHAR(66) NOT NULL, -- IPFS hash
    expiry_date TIMESTAMP NOT NULL,
    is_redeemed BOOLEAN DEFAULT FALSE,
    is_defaulted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- NAV History
CREATE TABLE nav_history (
    id UUID PRIMARY KEY,
    pool_id UUID REFERENCES liquidity_pools(id),
    nav_per_share DECIMAL(18,8) NOT NULL,
    total_pool_value DECIMAL(18,2) NOT NULL,
    total_shares DECIMAL(18,8) NOT NULL,
    calculated_at TIMESTAMP NOT NULL
);

-- Sessions (for session management)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY,
    wallet_address VARCHAR(42) NOT NULL,
    jwt_jti VARCHAR(255) UNIQUE NOT NULL, -- JWT ID for revocation
    refresh_token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 6.2 Renamed Tables

| Old Table Name | New Table Name | Migration Script |
|----------------|----------------|------------------|
| `asset_proofs` | `industrial_gateway_certificates` | `ALTER TABLE asset_proofs RENAME TO industrial_gateway_certificates;` |

---

## 7. Compliance Changes

### 7.1 KYC/KYB Thresholds

| Investment Amount | Requirement | Approval Required |
|-------------------|-------------|-------------------|
| < €1,000 | **Not permitted** (below minimum) | - |
| €1,000 - €99,999 | Standard KYC | Compliance Officer |
| €100,000 - €999,999 | **Enhanced KYB** + UBO verification | Senior Compliance Officer |
| ≥ €1,000,000 | **Enhanced KYB** + Board approval | Compliance Officer + CEO |

### 7.2 Jurisdiction Filtering

**Blocked Jurisdictions (Strictest List):**
- OFAC Sanctioned Countries: Cuba, Iran, North Korea, Syria, Crimea/Donetsk/Luhansk
- UN Sanctioned Entities: [As per UN Security Council list]
- EU Sanctioned Countries: [As per EU sanctions map]
- FATF High-Risk Jurisdictions: Yemen, Myanmar, Syria, etc. (per FATF public statement)

**Implementation:**
```python
STRICTEST_JURISDICTION_LIST = {
    "CU", "IR", "KP", "SY",  # OFAC
    "YE", "MM",  # FATF High-Risk
    # ... (full list in compliance service)
}

def is_jurisdiction_allowed(country_code: str) -> bool:
    return country_code.upper() not in STRICTEST_JURISDICTION_LIST
```

---

## 8. Testing Requirements

### 8.1 Smart Contract Tests

**uLP Token Tests:**
- [ ] NAV calculation accuracy (18 decimal precision)
- [ ] Deposit mints correct uLP amount
- [ ] Redeem burns uLP and returns correct Ondo EUROD (EUROD) + yield
- [ ] Value accrual over time (simulate yield)
- [ ] ERC-3643 compliance (identity verification on transfer)
- [ ] Forced transfer (regulatory actions)

**UJG Token Tests:**
- [ ] Mint only by Industrial Gateway
- [ ] Transfer blocked (except forced)
- [ ] Redemption by Pool Manager only
- [ ] Liquidation flow (auction winner receives UJG)
- [ ] ERC-3643NFT compliance

**LiquidityPool Tests:**
- [ ] Asset allocation limits (max 10% per industrial)
- [ ] Diversification requirements (min 5 assets)
- [ ] NAV update triggers
- [ ] Yield statement generation

### 8.2 Backend Tests

**Authentication Tests:**
- [ ] SIWE signature verification
- [ ] JWT generation/validation
- [ ] Session timeout (idle + absolute)
- [ ] Concurrent session limit (max 5)
- [ ] Token refresh rotation

**RBAC Tests:**
- [ ] Role-based permission enforcement
- [ ] Row-level security (multi-tenant isolation)
- [ ] Permission denial logging

---

## 9. Migration Timeline

| Phase | Week | Tasks |
|-------|------|-------|
| **Phase 1: Smart Contracts** | Week 1-2 | Implement uLP, UJG, LiquidityPool contracts; Write tests; Security audit |
| **Phase 2: Backend** | Week 2-4 | Implement SIWE auth, RBAC middleware, new API endpoints, database migrations |
| **Phase 3: Frontend** | Week 4-6 | Update investor dashboard for uLP, add institutional features, SIWE integration |
| **Phase 4: Documentation** | Week 6-7 | Update all specs, guides, investor docs |
| **Phase 5: Testing** | Week 7-8 | Integration testing, UAT, security testing |
| **Phase 6: Deployment** | Week 8-9 | Testnet deployment, bug fixes |
| **Phase 7: Production** | Week 10+ | Mainnet deployment, bank integration |

---

## 10. Acceptance Criteria

**SRS v2.1 Compliance:**
- [ ] All documents updated with uLP/UJG terminology
- [ ] Authentication uses SIWE + JWT
- [ ] RBAC implemented per authorization matrix
- [ ] OWASP Top 10 mitigations verified
- [ ] NAV calculation matches formula
- [ ] KYB threshold enforced (€100K)
- [ ] Strictest jurisdiction list implemented
- [ ] Fireblocks integration tested (treasury only)
- [ ] Bank escrow mock implemented (MVP)
- [ ] All tests passing (>90% coverage)

---

## Appendix A: Quick Reference

**Token Quick Reference:**
| Token | Standard | Yield Model | Transferable | Use Case |
|-------|----------|-------------|--------------|----------|
| **uLP** | ERC-3643 | Value-accrual (NAV increases) | Yes (compliance) | Institutional investment |
| **UJG** | ERC-3643NFT | N/A (collateral) | No (forced only) | Collateral representation |
| **UAT** | ERC-3643 | Distribution-based | Yes (compliance) | Retail/asset-specific |

**Auth Quick Reference:**
| Endpoint | Method | Auth | Rate Limit |
|----------|--------|------|------------|
| `/auth/nonce` | GET | None | 10/min |
| `/auth/login` | POST | None | 5/hour |
| `/auth/refresh` | POST | Refresh token | 10/min |
| `/auth/logout` | POST | Access token | 10/min |

**Compliance Quick Reference:**
| Threshold | Requirement |
|-----------|-------------|
| < €1K | Not permitted |
| €1K - €100K | Standard KYC |
| ≥ €100K | Enhanced KYB |
| ≥ €1M | Board approval |

---

**Document End**
