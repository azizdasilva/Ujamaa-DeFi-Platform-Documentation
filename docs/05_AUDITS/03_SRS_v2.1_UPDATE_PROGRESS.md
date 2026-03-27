# SRS v2.1 Documentation Update Progress Report

**Date:** March 25, 2026  
**Author:** Architecture Team  
**Status:** In Progress (P0 Complete, P1/P2 Pending)  

---

## Executive Summary

This document tracks the progress of updating all UJAMAA DeFi Platform documentation to align with **SRS v2.1** (Software Requirements Specification v2.1).

### Completion Status

| Priority | Documents | Status | Completion |
|----------|-----------|--------|------------|
| **P0** | Architecture Specification | ✅ Complete | 100% |
| **P0** | Smart Contract Specification | 🟡 In Progress | 0% |
| **P0** | API Specification | ⏳ Pending | 0% |
| **P0** | MVP Specification | ⏳ Pending | 0% |
| **P0** | Compliance Framework | ⏳ Pending | 0% |
| **P1** | Technical Guides (5 docs) | ⏳ Pending | 0% |
| **P1** | Algorithm Specifications | ⏳ Pending | 0% |
| **P1** | Monitoring Specification | ⏳ Pending | 0% |
| **P2** | Investor Documentation (20+ docs) | ⏳ Pending | 0% |

**Overall Progress:** 10% (1/10 P0 documents complete)

---

## P0 Critical Updates - COMPLETED

### ✅ 1. Architecture Specification (02_ARCHITECTURE_SPECIFICATION.md)

**Status:** ✅ **COMPLETE**  
**Version Updated:** v1.1 → v2.1 (SRS v2.1 Institutional Architecture)  
**Lines Added:** ~600 lines of new content  

#### Changes Made:

**1. Architecture Updates Summary (NEW Section)**
- Added institutional architecture additions table
- Documented uLP/UJG token model
- SIWE + JWT authentication
- RBAC authorization matrix
- Fireblocks custody integration
- Bank escrow (BIIC/MCB)

**2. Liquidity Pool Layer (NEW Section 4.2)**
- Complete liquidity pool architecture
- uLP Token mechanics (yield-bearing ERC-3643)
  - Value-accrual model explained
  - NAV calculation formula
  - Example flows (Day 0, Day 30, Day 365)
  - Solidity implementation example
- UJG Token mechanics (collateral ERC-3643NFT)
  - Lifecycle (8 steps from minting to redemption/liquidation)
  - Technical implementation with code
  - Forced transfer mechanism
- Pool risk management
  - Diversification rules (max 10% per industrial, min 5 assets)
  - NAV update frequency (real-time, daily, event-triggered)

**3. Smart Contract Layer Updates (Section 4.3)**
- Updated contract architecture diagram
- Separated institutional contracts (uLP, UJG, LiquidityPool) from retail contracts (UAT)
- Added SRS v2.1 reference

**4. Authentication & Authorization Layer (NEW Section 4.4)**
- **SIWE Authentication Flow** (8-step detailed flow)
  - SIWE message format
  - Nonce generation and validation
  - Signature verification
  - JWT token generation
- **JWT Token Structure**
  - Complete claims (sub, iat, exp, jti, role, kyc_status, kyc_expires, wallet)
  - Token specifications table (access vs refresh)
- **Session Management**
  - Idle timeout: 15 minutes
  - Absolute timeout: 8 hours
  - Max concurrent sessions: 5
  - Session revocation mechanism
  - Re-authentication triggers (>€1M redemption, PII decryption, compliance change)
- **Security Measures**
  - Nonce expiry (5 minutes)
  - SIWE anti-phishing (domain, issued-at, expiration-time)
  - JWT RS256 signing (HSM-stored key)
  - Refresh token rotation
  - Rate limiting (5 failed logins/hour)

**5. RBAC Authorization Matrix (NEW)**
- Complete 10+ role permission table
  - Enterprise Partner
  - Investor (Retail)
  - Institutional Investor
  - Pool Manager
  - Compliance Officer
  - Regulator
  - Auditor
  - DevOps Engineer
  - Developer
- Permission enforcement mechanisms
- FastAPI RBAC middleware implementation example

**6. OWASP Top 10 (2025) Mitigations (NEW)**
- Complete mitigation table for 7 OWASP categories
- Input validation specification table
  - Text, Email, Investment Amount, Wallet Address, National ID, File Upload, Date

**7. Fireblocks Custody Integration (NEW)**
- Integration architecture diagram
- Transaction flow (5 steps)
- Scope clarification (platform treasury only, NOT end-user custody)

**8. Bank Escrow Integration (NEW)**
- MVP vs Production comparison
- BIIC/MCB account structure
- Mobile Money integration (M-Pesa, MTN, Airtel)

#### Files Modified:
- `docs/01_SPECIFICATIONS/02_ARCHITECTURE_SPECIFICATION.md` (2202 → 2497 lines)

#### Traceability to SRS v2.1:
- ✅ Section 1.2.1 (Authentication Specification)
- ✅ Section 1.2.2 (Authorization Matrix)
- ✅ Section 1.2.3 (OWASP Top 10 Mitigations)
- ✅ Section 1.2 (uLP Token, Liquidity Pool, Fireblocks, Bank Escrow)
- ✅ Section 2.1 (Ecosystem Position - Fireblocks, BIIC/MCB)

---

## P0 Critical Updates - PENDING

### 🟡 2. Smart Contract Specification (05_SMART_CONTRACT_SPECIFICATION.md)

**Status:** 🟡 **IN PROGRESS**  
**Target Version:** v1.0 → v2.1  
**Estimated Effort:** 4-6 hours  

#### Required Changes:

**1. Contract Inventory (UPDATE Table)**
```markdown
| Contract | Standard | Chain | Purpose |
|----------|----------|-------|---------|
| `UjamaaPoolToken (uLP)` | ERC-3643 + ERC-20 | Ethereum, Polygon | Yield-bearing LP token 🆕 |
| `GuaranteeToken (UJG)` | ERC-3643NFT (ERC-721 + compliance) | Ethereum, Polygon | Collateral NFT 🆕 |
| `LiquidityPool` | Custom | Polygon | Pool management 🆕 |
| `UjamaaToken (UAT)` | ERC-3643 + ERC-20 | Ethereum, Polygon | Asset-specific token (unchanged) |
```

**2. Add New Sections:**
- **Section 4.5: Ujamaa Pool Token (uLP)**
  - Yield-bearing mechanics
  - Value-accrual model
  - NAV calculation interface
  - Deposit/redeem functions
  
- **Section 4.6: Guarantee Token (UJG)**
  - ERC-3643NFT standard (ERC-721 base + compliance)
  - Non-transferable design
  - Forced transfer mechanism
  - Lifecycle (mint, redeem, liquidate)
  
- **Section 5.5: LiquidityPool Contract**
  - Pool creation and management
  - Asset allocation tracking
  - Diversification rules
  - NAV update mechanism

**3. Update Existing Sections:**
- Section 2 (Token Standards): Add ERC-3643NFT specification
- Section 6 (Compliance Modules): Add uLP/UJG compliance rules
- Section 10 (Deployment Configuration): Add uLP/UJG deployment parameters

#### Files to Modify:
- `docs/01_SPECIFICATIONS/05_SMART_CONTRACT_SPECIFICATION.md`

#### Traceability to SRS v2.1:
- SRS Section 1.2 (uLP Token, UJG Token)
- SRS Section 5 (System Architecture - Smart Contracts)
- SRS Section 7 (Security Requirements - Token Security)

---

### ⏳ 3. API Specification (06_API_SPECIFICATION.md)

**Status:** ⏳ **PENDING**  
**Target Version:** v1.0 → v2.1  
**Estimated Effort:** 3-4 hours  

#### Required Changes:

**1. New Endpoints (ADD Section 2.7):**
```yaml
/auth/nonce:
  GET /api/v1/auth/nonce?wallet={wallet}
  Response: { nonce: "uuid-v4", expiresAt: "ISO8601" }

/auth/login:
  POST /api/v1/auth/login
  Body: { wallet, signature, nonce }
  Response: { accessToken, refreshToken, expiresAt }

/auth/refresh:
  POST /api/v1/auth/refresh
  Body: { refreshToken }
  Response: { accessToken, refreshToken }

/auth/logout:
  POST /api/v1/auth/logout
  Headers: { Authorization: Bearer <token> }

/pools:
  GET /api/v1/pools
  GET /api/v1/pools/{id}
  POST /api/v1/pools (Pool Manager only)
  
/pools/{id}/nav:
  GET /api/v1/pools/{id}/nav
  Response: { navPerShare, totalPoolValue, totalShares, timestamp }

/pools/{id}/deposit:
  POST /api/v1/pools/{id}/deposit
  Body: { amount, uJPAddress }
  
/pools/{id}/redeem:
  POST /api/v1/pools/{id}/redeem
  Body: { uLPAmount }

/guarantees:
  GET /api/v1/guarantees
  POST /api/v1/guarantees (Industrial Gateway only)
  
/guarantees/{id}/liquidate:
  POST /api/v1/guarantees/{id}/liquidate (Pool Manager only)
```

**2. Update Section 9 (Authentication & Authorization):**
- Replace wallet signature section with SIWE + JWT
- Add session management specification
- Add RBAC middleware documentation

**3. Update Error Handling (Section 10):**
- Add authentication errors (401 Unauthorized)
- Add authorization errors (403 Forbidden)
- Add session errors (419 Session Expired)

#### Files to Modify:
- `docs/01_SPECIFICATIONS/06_API_SPECIFICATION.md`

#### Traceability to SRS v2.1:
- SRS Section 1.2.1 (Authentication Specification)
- SRS Section 1.2.2 (Authorization Matrix)
- SRS Section 4 (External Interface Requirements - APIs)

---

### ⏳ 4. MVP Specification (01_MVP_SPECIFICATION.md)

**Status:** ⏳ **PENDING**  
**Target Version:** v1.0 (SRS v2.0 reference) → v2.1 (SRS v2.1 reference)  
**Estimated Effort:** 2-3 hours  

#### Required Changes:

**1. Update References:**
- Change "SRS v2.0" to "SRS v2.1" throughout document
- Update version history table

**2. Update Section 1.2 (MVP vs Production):**
```markdown
**MVP-1 (Current):** Retail tokenization platform
**MVP (Institutional):** Liquidity pool architecture with uLP/UJG 🆕
**Production:** Full institutional platform with real bank integration
```

**3. Update Section 2.2 (In Scope - MVP):**
Add:
- uLP Token contract (yield-bearing ERC-3643)
- UJG Token contract (ERC-3643NFT)
- LiquidityPool contract
- MockEscrow (testnet)
- SIWE authentication
- RBAC implementation

**4. Update Section 3.1 (System Architecture):**
- Add uLP/UJG contracts to architecture diagram
- Add SIWE authentication flow
- Add RBAC middleware

**5. Update Section 3.2 (Data Flow):**
- Add uLP deposit/redeem flow
- Add UJG minting/liquidation flow

#### Files to Modify:
- `docs/06_MVP_EXECUTION/01_MVP_SPECIFICATION.md`

#### Traceability to SRS v2.1:
- SRS Section 1.2 (MVP Testnet Clarification)
- SRS Section 1.2.1 (Authentication Specification)
- SRS Section 3 (System Features - EPIC 10: Liquidity Pool Management)

---

### ⏳ 5. Compliance Framework (10_COMPLIANCE_FRAMEWORK.md)

**Status:** ⏳ **PENDING**  
**Target Version:** v1.0 → v2.1  
**Estimated Effort:** 3-4 hours  

#### Required Changes:

**1. Update Section 4 (KYC/AML Framework):**
```markdown
## 4.3 KYB Requirements (NEW)

**Know Your Business (KYB)** - Enhanced due diligence for institutional investors (≥€100K):

**KYB Trigger Threshold:** €100,000 (regulatory requirement)

**KYB Requirements:**
- Certificate of Incorporation
- Memorandum & Articles of Association
- Register of Directors
- Register of Shareholders (UBO identification >25%)
- Proof of Registered Address
- Tax Identification Number
- Source of Funds declaration

**Approval Workflow:**
- €100K - €999,999: Senior Compliance Officer
- ≥€1,000,000: Compliance Officer + CEO
```

**2. Update Section 2.2 (Jurisdiction Controls):**
```markdown
## 2.2 Strictest Jurisdiction List 🆕

**Blocked Jurisdictions:** Combined OFAC + UN + EU + FATF High-Risk

- OFAC Sanctioned: Cuba, Iran, North Korea, Syria, Crimea/Donetsk/Luhansk
- FATF High-Risk: Yemen, Myanmar, etc. (per public statement)
- UN Sanctioned: As per Security Council list
- EU Sanctioned: As per sanctions map

**Implementation:**
```python
STRICTEST_JURISDICTION_LIST = {"CU", "IR", "KP", "SY", "YE", "MM", ...}
```
```

**3. Add Section 6.5 (uLP Token Compliance):**
- uLP as security token (MiCA Article 22)
- Yield-bearing token regulatory treatment
- NAV attestation requirements

**4. Add Section 7.5 (UJG Token Compliance):**
- UJG as collateral token
- Non-transferable design regulatory rationale
- Liquidation compliance requirements

#### Files to Modify:
- `docs/01_SPECIFICATIONS/10_COMPLIANCE_FRAMEWORK.md`

#### Traceability to SRS v2.1:
- SRS Section 1.2 (KYB Threshold, Institutional Minimum)
- SRS Section 1.2 (Strictest Jurisdiction List)
- SRS Section 10 (Compliance & Regulatory Requirements)

---

## P1 High Priority Updates

### 6. Technical Guides (5 documents)

**Status:** ⏳ **PENDING**  
**Estimated Effort:** 8-10 hours total  

#### Documents to Update:

**6.1 Deployment Guide (01_DEPLOYMENT_GUIDE.md)**
- Add Fireblocks setup instructions
- Add bank escrow configuration
- Add uLP/UJG contract deployment
- Update environment variables

**6.2 Technology Stack Reference (02_TECHNOLOGY_STACK_REFERENCE.md)**
- Add SIWE library (@spruceid/siwe)
- Add JWT libraries (python-jose, @panva/jose)
- Add Fireblocks SDK
- Update token standards (ERC-3643NFT)

**6.3 Backend Integration Guide (03_BACKEND_INTEGRATION_GUIDE.md)**
- Add SIWE implementation guide
- Add RBAC middleware setup
- Add session management (Redis)
- Add uLP/UJG backend integration

**6.4 Frontend Quick Start (04_FRONTEND_QUICK_START.md)**
- Update authentication flow (SIWE)
- Add uLP deposit/redeem UI components
- Add institutional dashboard setup

**6.5 Smart Contract Integration Guide (05_SMART_CONTRACT_INTEGRATION_GUIDE.md)**
- Add uLP token integration
- Add UJG token integration
- Add LiquidityPool contract interaction

#### Files to Modify:
- `docs/02_TECHNICAL_GUIDES/01_DEPLOYMENT_GUIDE.md`
- `docs/02_TECHNICAL_GUIDES/02_TECHNOLOGY_STACK_REFERENCE.md`
- `docs/02_TECHNICAL_GUIDES/03_BACKEND_INTEGRATION_GUIDE.md`
- `docs/02_TECHNICAL_GUIDES/04_FRONTEND_QUICK_START.md`
- `docs/02_TECHNICAL_GUIDES/05_SMART_CONTRACT_INTEGRATION_GUIDE.md`

---

### 7. Algorithm Specifications (01_ALGORITHM_SPECIFICATIONS.md)

**Status:** ⏳ **PENDING**  
**Estimated Effort:** 4-6 hours  

#### Required Changes:

**Add New Algorithms:**

**ALG-10-01-01: NAV Calculation**
```python
def calculate_nav_per_share(pool_id: UUID) -> Decimal:
    total_pool_value = get_total_pool_value(pool_id)
    total_shares = get_total_shares(pool_id)
    nav_per_share = total_pool_value / total_shares
    return nav_per_share.quantize(Decimal('0.00000001'))
```

**ALG-10-01-02: Yield Accrual**
```python
def calculate_daily_yield(pool_id: UUID, principal: Decimal, apr: Decimal) -> Decimal:
    daily_rate = apr / Decimal('365')
    daily_yield = principal * daily_rate
    return daily_yield.quantize(Decimal('0.01'))
```

**ALG-10-02-01: uLP Deposit Calculation**
```python
def calculate_ulp_minted(deposit_amount: Decimal, nav_per_share: Decimal) -> Decimal:
    ulp_minted = deposit_amount / nav_per_share
    return ulp_minted.quantize(Decimal('0.00000001'))
```

**ALG-10-02-02: uLP Redemption Calculation**
```python
def calculate_redemption_value(ulp_amount: Decimal, nav_per_share: Decimal) -> Decimal:
    redemption_value = ulp_amount * nav_per_share
    return redemption_value.quantize(Decimal('0.01'))
```

**ALG-10-03-01: Pool Diversification Check**
```python
def check_diversification(pool_id: UUID, industrial: str, amount: Decimal) -> bool:
    total_value = get_pool_total_value(pool_id)
    current_allocation = get_allocation_by_industrial(pool_id, industrial)
    new_allocation_pct = (current_allocation + amount) * 100 / total_value
    return new_allocation_pct <= 10.0  # MAX_SINGLE_ASSET_PCT
```

#### Files to Modify:
- `docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md`

---

### 8. Monitoring Specification (01_MONITORING_SPECIFICATION.md)

**Status:** ⏳ **PENDING**  
**Estimated Effort:** 3-4 hours  

#### Required Changes:

**Add New Metrics:**

**uLP Metrics:**
- `ulp_nav_per_share` (gauge)
- `ulp_total_shares` (gauge)
- `ulp_total_pool_value` (gauge)
- `ulp_daily_yield` (counter)
- `ulp_deposit_count` (counter)
- `ulp_redemption_count` (counter)

**UJG Metrics:**
- `ujg_total_minted` (counter)
- `ujg_total_redeemed` (counter)
- `ujg_total_liquidated` (counter)
- `ujg_outstanding_value` (gauge)
- `ujg_default_rate` (gauge)

**Pool Metrics:**
- `pool_diversification_ratio` (gauge)
- `pool_asset_count` (gauge)
- `pool_concentration_max` (gauge)
- `pool_yield_apr` (gauge)

**Authentication Metrics:**
- `auth_login_success` (counter)
- `auth_login_failure` (counter)
- `auth_session_count` (gauge)
- `auth_token_refresh_count` (counter)

#### Files to Modify:
- `docs/03_OPERATIONS/01_MONITORING_SPECIFICATION.md`

---

## P2 Medium Priority Updates

### 9. Investor Documentation (20+ documents)

**Status:** ⏳ **PENDING**  
**Estimated Effort:** 15-20 hours total  

#### Key Documents to Update:

**9.1 White Paper (05_WHITE_PAPER.md)**
- Update token economics (uLP yield model)
- Add UJG explanation
- Update institutional architecture section
- Add Fireblocks custody section

**9.2 Investment Memorandum (04_INVESTMENT_MEMORANDUM.md)**
- Update investment structure (uLP shares)
- Add yield calculation examples
- Update risk factors (pool diversification)

**9.3 Investor Pitch Deck (03_INVESTOR_PITCH_DECK.md)**
- Add uLP/UJG slides
- Update institutional architecture slide
- Add yield comparison (uLP vs traditional)

**9.4 Investor FAQ (09_INVESTOR_FAQ.md)**
- Add uLP yield questions
- Add UJG collateral questions
- Add SIWE authentication questions
- Add KYB threshold questions

**9.5 Due Diligence Questionnaire (06_DUE_DILIGENCE_QUESTIONNAIRE.md)**
- Add institutional architecture questions
- Add Fireblocks custody questions
- Add bank escrow questions

#### Files to Modify:
- `docs/08_INVESTORS_ROOM/05_WHITE_PAPER.md`
- `docs/08_INVESTORS_ROOM/04_INVESTMENT_MEMORANDUM.md`
- `docs/08_INVESTORS_ROOM/03_INVESTOR_PITCH_DECK.md`
- `docs/08_INVESTORS_ROOM/09_INVESTOR_FAQ.md`
- `docs/08_INVESTORS_ROOM/06_DUE_DILIGENCE_QUESTIONNAIRE.md`
- And 15+ other investor documents...

---

## Migration Checklist

### Smart Contract Migration

- [ ] Deploy uLP token contract (testnet)
- [ ] Deploy UJG token contract (testnet)
- [ ] Deploy LiquidityPool contract (testnet)
- [ ] Write migration tests
- [ ] Document gas costs
- [ ] Security audit (post-deployment)

### Backend Migration

- [ ] Implement SIWE authentication
- [ ] Implement JWT token management
- [ ] Implement RBAC middleware
- [ ] Implement session management (Redis)
- [ ] Implement uLP backend services
- [ ] Implement UJG backend services
- [ ] Write integration tests

### Frontend Migration

- [ ] Implement SIWE login UI
- [ ] Implement institutional dashboard
- [ ] Implement uLP deposit/redeem UI
- [ ] Implement pool statistics UI
- [ ] Write E2E tests

### Database Migration

- [ ] Create migration scripts
  - `liquidity_pools` table
  - `ulp_positions` table
  - `guarantee_tokens` table
  - `nav_history` table
  - `user_sessions` table
- [ ] Rename `asset_proofs` → `industrial_gateway_certificates`
- [ ] Write rollback scripts
- [ ] Test migration on staging

### DevOps Migration

- [ ] Update Kubernetes configs
- [ ] Update Terraform configs
- [ ] Update CI/CD pipelines
- [ ] Update monitoring dashboards
- [ ] Update alert rules

---

## Testing Requirements

### Smart Contract Tests

- [ ] uLP NAV calculation accuracy
- [ ] uLP deposit/redeem correctness
- [ ] uLP value accrual over time
- [ ] UJG minting (Industrial Gateway only)
- [ ] UJG transfer restrictions
- [ ] UJG forced transfer (liquidation)
- [ ] Pool diversification checks
- [ ] Pool asset allocation limits

### Backend Tests

- [ ] SIWE signature verification
- [ ] JWT generation/validation
- [ ] Session timeout (idle + absolute)
- [ ] RBAC permission enforcement
- [ ] Rate limiting (auth endpoints)
- [ ] uLP deposit/redeem API
- [ ] UJG lifecycle API

### Frontend Tests

- [ ] SIWE login flow
- [ ] uLP deposit flow
- [ ] uLP redemption flow
- [ ] Pool statistics display
- [ ] Yield visualization
- [ ] RBAC UI (role-based views)

---

## Timeline

| Phase | Week | Tasks | Owner |
|-------|------|-------|-------|
| **P0 Complete** | Week 1 | Architecture Specification | ✅ Done |
| **P0 Smart Contracts** | Week 2 | Smart Contract Specification | Aziz |
| **P0 API** | Week 2-3 | API Specification | Backend Team |
| **P0 MVP** | Week 3 | MVP Specification | Aziz |
| **P0 Compliance** | Week 3 | Compliance Framework | Compliance Team |
| **P1 Technical Guides** | Week 4 | 5 Technical Guides | Dev Team |
| **P1 Algorithms** | Week 4 | Algorithm Specifications | Data Team |
| **P1 Monitoring** | Week 5 | Monitoring Specification | SRE Team |
| **P2 Investor Docs** | Week 5-6 | 20+ Investor Documents | Content Team |
| **Testing** | Week 6-7 | All tests | QA Team |
| **Deployment** | Week 8 | Testnet deployment | DevOps Team |

---

## Quality Assurance

### Documentation Review Checklist

For each updated document:

- [ ] Version number updated (v1.x → v2.1)
- [ ] Date updated (March 25, 2026)
- [ ] SRS v2.1 references added
- [ ] uLP/UJG terminology consistent
- [ ] SIWE authentication documented
- [ ] RBAC matrix included (if applicable)
- [ ] Code examples tested
- [ ] Diagrams updated
- [ ] Cross-references verified
- [ ] Spelling/grammar checked

### Consistency Checks

- [ ] Token names consistent (uLP, UJG, UAT)
- [ ] Authentication flow consistent (SIWE + JWT)
- [ ] RBAC roles consistent across docs
- [ ] NAV formula consistent
- [ ] Yield calculation consistent
- [ ] Bank names consistent (BIIC, MCB)
- [ ] Fireblocks scope consistent (platform treasury only)

---

## Risk Management

### Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Inconsistent terminology | High | Medium | Glossary document, automated checks |
| Missing cross-references | Medium | High | Traceability matrix |
| Outdated diagrams | Medium | Medium | Diagram review checklist |
| Incomplete code examples | High | Low | Code review, testing |
| Regulatory non-compliance | Critical | Low | Legal review, compliance sign-off |

### Mitigation Actions

1. **Terminology Management:**
   - Maintain glossary in SRS v2.1
   - Use find/replace for deprecated terms
   - Automated spell-check for token names

2. **Cross-Reference Tracking:**
   - Maintain traceability matrix
   - Link to SRS v2.1 sections
   - Review before each commit

3. **Diagram Updates:**
   - Use Mermaid.js for version-controlled diagrams
   - Review all diagrams after text updates
   - Ensure consistency with architecture

---

## Appendix A: Quick Reference

### Token Terminology

| Token | Full Name | Standard | Purpose |
|-------|-----------|----------|---------|
| **uLP** | Ujamaa Pool Token | ERC-3643 (Fungible) | Yield-bearing investment token |
| **UJG** | Ujamaa Guarantee | ERC-3643NFT (ERC-721 + compliance) | Collateral representation |
| **UAT** | Ujamaa Asset Token | ERC-3643 (Fungible) | Asset-specific tokenization (retail) |
| **EUROD** | Ondo EUROD | ERC-20 (Stablecoin) | Euro-pegged stablecoin |

### Authentication Endpoints

| Endpoint | Method | Auth | Rate Limit |
|----------|--------|------|------------|
| `/auth/nonce` | GET | None | 10/min |
| `/auth/login` | POST | None | 5/hour |
| `/auth/refresh` | POST | Refresh token | 10/min |
| `/auth/logout` | POST | Access token | 10/min |

### Compliance Thresholds

| Threshold | Amount | Requirement |
|-----------|--------|-------------|
| **Retail Minimum** | €1,000 | Standard KYC |
| **KYB Trigger** | €100,000 | Enhanced KYB |
| **Institutional Minimum** | €1,000,000 | KYB + Board approval |

### Session Parameters

| Parameter | Value |
|-----------|-------|
| Access Token Expiry | 30 days |
| Refresh Token Expiry | 7 days |
| Idle Timeout | 15 minutes |
| Absolute Timeout | 8 hours |
| Max Concurrent Sessions | 5 |

---

**Document End**

**Next Review:** March 29, 2026  
**Distribution:** Architecture Team, Development Team, Compliance Team, Content Team
