# Software Requirements Specification (SRS) v2.1
## UJAMAA DEFI PLATFORM Multi-Asset Securitization and Tokenization Platform
### Production Architecture - Liquidity Pool & Yield-Bearing Token Model

**Author:** Aziz Da Silva - Lead Architect
**Version:** 2.1 (Post-Audit Revision)
**Date:** March 25, 2026
**Classification:** Private
**License:** Open Source (MIT)

---

## Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Lead Architect | Aziz Da Silva | | 2026-03-25 |
| Compliance Officer | [TBD] | | |
| Legal Counsel | [TBD] | | |
| CEO | [TBD] | | |

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| v1.3 | 2026-01-15 | Aziz Da Silva | Initial development version |
| v2.0 | 2026-03-17 | Aziz Da Silva | Added institutional architecture (uLP, Fireblocks, Bank Escrow) |
| v2.1 | 2026-03-25 | Aziz Da Silva | Post-audit revisions: Added authentication spec, authorization matrix, OWASP mitigations, DB constraints, FR numbering, RTM, error states, notifications, session management, rate limiting, DR spec, monitoring spec |

---

## Supported Industries

✅ **Core Industries:**
- **MANUFACTURING:** Factories, assembly plants, production facilities
- **AGRICULTURE:** Farms, cooperatives, plantations, fisheries
- **MINING:** Mines, quarries, oil & gas operations
- **TRADE:** Importers, exporters, wholesalers, retailers
- **SERVICES:** Logistics, warehousing, transportation
- **ENERGY:** Power plants, renewable energy, utilities
- **REAL_ESTATE:** Property developers, REITs, property management
- **TECHNOLOGY:** SaaS companies, tech startups (revenue financing)

🆕 **Pool Families:**
- **POOL_INDUSTRIE:** Manufacturing, factories, production facilities (GDIZ partners)
- **POOL_AGRICULTURE:** Coffee, cocoa, cotton, cashews, food crops
- **POOL_TRADE_FINANCE:** Invoice tokenization, receivables pools
- **POOL_RENEWABLE_ENERGY:** Solar, wind, hydroelectric projects
- **POOL_REAL_ESTATE:** Commercial & residential property tokenization 🆕

## Supported Asset Types

✅ **Core Asset Types:**
- **INVOICE:** Trade finance receivables, commercial invoices
- **RECEIVABLE:** Pool of accounts receivable, revenue streams
- **INVENTORY:** Warehouse inventory, commodity stocks
- **PRODUCTION:** Manufacturing output, production metrics
- **SHIPMENT:** Logistics data, bill of lading
- **CONTRACT:** Service contracts, revenue-based financing

🆕 **Pool-Level Assets:**
- **POOL_SHARE:** Share in diversified liquidity pool (Ujamaa Pool Token (uLP))
- **GUARANTEE_TOKEN:** Token representing certified merchandise value (Industrial Gateway certification)

### Ujamaa Guarantee (UJG) vs Ujamaa Pool Token (uLP) Specification

**Token Comparison Table:**

| Token Type | Standard | Purpose | Transferable | Compliance | Use Case |
|------------|----------|---------|--------------|------------|----------|
| **Ujamaa Pool Token (uLP)** | ERC-3643 (Fungible) | Investor's share in liquidity pool | Yes (with compliance) | ERC-3643 identity verification | Yield-bearing investment token |
| **Ujamaa Guarantee (UJG)** | ERC-3643NFT (ERC-721 + ERC-3643 compliance) | Pool's collateral representation | No (forced transfer only) | ERC-3643 identity verification | Collateral/security token |

---

#### Ujamaa Pool Token (uLP) (Yield-Bearing Fungible Token)

**Definition:** The Ujamaa Pool Token (uLP) is a **yield-bearing ERC-3643 fungible token** that represents ownership share in a liquidity pool. It uses a value-accrual model where the token balance remains constant while NAV per token increases with yield.

**Why ERC-3643 Fungible?**
- ✅ **Platform Consistency** - All UJAMAA tokens use ERC-3643 standard
- ✅ **Compliance Enforcement** - Only verified investors can hold uLP tokens
- ✅ **Identity Verification** - ONCHAINID integration for all token holders
- ✅ **Transfer Restrictions** - Enforces jurisdiction and investor limits
- ✅ **Regulatory Audit Trail** - All transfers logged with identity resolution

---

#### Ujamaa Guarantee (UJG) (Collateral NFT)

**Definition:** The Ujamaa Guarantee (UJG) is a **non-transferable ERC-3643NFT** (ERC-721 base + ERC-3643 compliance modules) that represents certified merchandise/collateral backing a financing operation. It is minted by the Industrial Gateway when stock is certified and held by the Liquidity Pool until repayment.

**Why ERC-3643NFT (ERC-721 + Compliance)?**
- ✅ **ERC-721 Base** - Standard NFT for unique asset representation
- ✅ **ERC-3643 Compliance Modules** - Identity registry and transfer validation
- ✅ **Compliance Enforcement** - Only verified entities can hold Guarantee Tokens
- ✅ **Identity Verification** - ONCHAINID integration for Industrial Gateway and Pool
- ✅ **Transfer Restrictions** - Prevents unauthorized transfer; only Pool ↔ Industrial Gateway
- ✅ **Regulatory Audit Trail** - All Ujamaa Guarantee (UJG) movements logged with identity resolution

**Technical Note:** ERC-3643NFT extends ERC-721 with ERC-3643 compliance primitives (identity registry, compliance module, trusted issuers). Unlike standard ERC-721, every transfer validates sender and recipient identity verification status.

**Purpose:**
- ✅ **Collateral Representation** - Token represents physical stock in warehouse
- ✅ **Proof of Existence** - Industrial Gateway certifies merchandise exists
- ✅ **Lien Tracking** - Pool holds Ujamaa Guarantee (UJG) as security until repayment
- ✅ **Automatic Release** - Token returned to industrial upon full repayment
- ✅ **Default Handling** - If industrial defaults: Ujamaa Guarantee (UJG) liquidated via auction; proceeds distributed to uLP holders
- ✅ **Compliance** - Only verified Industrial Gateway and Pool can interact with Ujamaa Guarantee (UJG)

**Ujamaa Guarantee (UJG) Lifecycle:**
```
1. Industrial receives order (e.g., ZARA €2M contract)
2. Industrial Gateway certifies stock (SIPI/GDIZ verification)
3. Ujamaa Guarantee (UJG) minted (ERC-3643NFT with metadata + compliance)
4. Pool deploys funds to Industrial
5. Pool holds Ujamaa Guarantee (UJG) (collateral/security)
6. Industrial repays (principal + interest)
7. Ujamaa Guarantee (UJG) transferred back to Industrial (via ERC-3643 forcedTransfer)
8. [DEFAULT SCENARIO] If industrial defaults:
   → Ujamaa Guarantee (UJG) liquidated via approved auction
   → Proceeds distributed to Ujamaa Pool Token (uLP) holders
   → Default recorded in compliance audit trail
```

**Smart Contract:**
```solidity
// GuaranteeToken.sol - ERC-3643NFT (ERC-721 + ERC-3643 compliance) representing certified merchandise
contract GuaranteeToken is ERC3643NFT {
    struct Guarantee {
        uint256 certificateId;      // Industrial Gateway certificate
        uint256 merchandiseValue;   // Value in Ujamaa Euro (UJEUR)
        uint256 expiryDate;         // When invoice is due
        address industrial;         // Original issuer
        bool isRedeemed;            // Whether repaid
        bool isDefaulted;           // Whether defaulted
        bytes32 stockHash;          // IPFS hash of stock documents
    }

    mapping(uint256 => Guarantee) private s_guarantees;
    uint256 private s_nextTokenId;

    function mintGuarantee(
        address industrial,
        uint256 certificateId,
        uint256 value,
        uint256 expiryDate,
        bytes32 stockHash
    ) external onlyRole(MINTER_ROLE) returns (uint256 tokenId);

    function redeemGuarantee(uint256 tokenId) external onlyRole(POOL_MANAGER_ROLE);
    function liquidateGuarantee(uint256 tokenId, address auctionWinner) external onlyRole(POOL_MANAGER_ROLE);
    function getGuarantee(uint256 tokenId) external view returns (Guarantee memory);

    // ERC-3643NFT compliance: Only verified entities can hold
    function _canTransfer(address from, address to, uint256 tokenId)
        internal view override returns (bool) {
        require(identityRegistry().isVerified(from), "Sender not verified");
        require(identityRegistry().isVerified(to), "Recipient not verified");
        // Only Pool, Industrial Gateway, or approved auction winner can receive
        require(
            to == poolAddress || to == gatewayAddress || approvedAuctionWinners[to],
            "Invalid recipient"
        );
        return true;
    }
}
```

**Metadata Stored:**
- Stock description (e.g., "1000 cotton bales, Grade A")
- Warehouse location (e.g., "GDIZ Warehouse A, Lomé")
- Certification date and expiry
- Industrial Gateway certificate hash
- SIPI/GDIZ verification data
- Compliance status (verified/unverified)
- Default status (for liquidation tracking)

**Relationship between Ujamaa Pool Token (uLP) and Ujamaa Guarantee (UJG):**
- **Ujamaa Pool Token (uLP)** = Investor's share in pool (yield-bearing, **ERC-3643 Fungible**)
- **Ujamaa Guarantee (UJG)** = Pool's collateral (non-transferable, **ERC-3643NFT**)
- Multiple Guarantee Tokens back each Ujamaa Pool Token (uLP) (diversification)
- Both use same Identity Registry (unified compliance)
- Both implement ERC-3643 transfer validation (identity verification required)

---

---

# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) v2.0 defines the complete functional and non-functional requirements for the Ujamaa DeFi Platform **Institutional Architecture**, a multi-asset securitization and tokenization system with **yield-bearing uLP tokens** and **liquidity pool management** built on Polygon blockchain.

**This version supersedes v1.3 development.** All v1.3 requirements not explicitly modified herein remain valid.

This document serves as the authoritative reference for:

✅ **Unchanged roles from v1.3:**
- **Software architects** designing system components and integration patterns
- **Smart contract developers** implementing ERC-3643 tokenization contracts using ApeWorX and the T-REX protocol
- **Backend engineers** building FastAPI microservices and PostgreSQL data layers
- **Frontend engineers** developing the React TypeScript marketplace interface
- **DevOps engineers** configuring Kubernetes, Terraform, and CI/CD pipelines
- **Compliance officers** verifying regulatory adherence (MiCA, FATF, SEC, GDPR)
- **Security auditors** conducting smart contract and infrastructure audits
- **Project stakeholders** making go/no-go decisions on feature scope and release criteria

🆕 **Added roles:**
- **Institutional investor relations** managing €100K+ investor onboarding
- **Pool managers** overseeing LiquidityPool operations and asset allocation
- **Fireblocks administrators** managing institutional custody operations

**This SRS governs all technical decisions related to:**

✅ **Unchanged from v1.3:**
- Token standards (ERC-3643 fungible and ERC-3643 NFT)
- Cross-chain bridge architecture between Ethereum and Polygon
- Identity verification via ONCHAINID
- GDPR-compliant data handling through cryptographic erasure patterns
- Fraud detection systems using machine learning frameworks (Scikit-learn, PyTorch, TensorFlow)

🆕 **Added:**
- **Ujamaa Pool Token (uLP) (yield-bearing)** - Value-accrual token representing pool ownership
- **Liquidity Pool management** - Multi-asset financing with diversification
- **Fireblocks custody** - Institutional-grade digital asset custody
- **Ujamaa Euro (UJEUR)/EURR stablecoins** - Euro-pegged stablecoins for FX risk mitigation
- **Mobile Money integration** - M-Pesa, MTN, Airtel for fiat on/off ramps
- **Bank escrow integration** - BIIC/MCB bank escrow accounts for investor funds

No development work shall commence without traceability to requirements specified in this document. All acceptance testing shall validate compliance with the measurable criteria defined herein.

## 1.2 Scope

The Ujamaa DeFi Platform enables institutional-grade tokenization with **yield-bearing uLP tokens** and **liquidity pool architecture** for diversified industrial financing.

**🆕 New Core Features:**

1. **Ujamaa Pool Token (uLP) (Yield-Bearing)**
   - ERC-3643 compliant yield-bearing token
   - Value-accrual model (balance constant, NAV increases)
   - Deposit Ujamaa Euro (UJEUR) → mint uLP
   - Redeem uLP → receive Ujamaa Euro (UJEUR) + yield
   - NAV calculation and tracking
   - **NAV Update Frequency:** Real-time for deposits/redemptions; Daily for yield accrual; On-chain event triggered
   - **Yield Calculation Formula:**
     ```
     NAV_per_share(t) = Total_Pool_Value(t) / Total_uLP_Shares
     Investor_Value(t) = uLP_Balance × NAV_per_share(t)
     Yield compounds automatically (no distribution required)
     ```

2. **Liquidity Pool Management**
   - Pool creation and management (Pool Industrie, Pool Agriculture, etc.)
   - Multiple financings per pool (diversification)
   - Asset allocation tracking (by asset class, by industrial, by geography)
   - Automated yield distribution to uLP holders
   - Pool statistics and performance metrics

3. **Institutional Custody (Fireblocks)**
   - Fireblocks API integration for custody
   - Multi-signature wallet management
   - Institutional-grade security (FSC Mauritius compliant)
   - **Scope:** Platform treasury and pool assets only (NOT for end-user custody)
   - Bank account integration (BIIC, MCB escrow)

4. **Bank Escrow & Banking Integration**
   - Real escrow accounts at BIIC/MCB Mauritius (Production)
   - MockEscrow contract (MVP testnet)
   - Wire transfer integration (BIIC/MCB API)
   - Fiat on/off ramp via bank partners
   - Mobile Money integration (M-Pesa, MTN, Airtel) - Production only

5. **Yield Calculation & Distribution**
   - Real financial math for yield accrual
   - NAV per share calculation (formula above)
   - Yield statement generation
   - Automated distribution to uLP holders

6. **Institutional Dashboard**
   - Real-time portfolio tracking
   - Yield accrual visualization
   - Pool allocation breakdown
   - Proof of Reserve display
   - Downloadable yield statements (PDF)

7. **Enhanced Compliance**
   - **KYB Trigger Threshold:** €100,000 (regulatory requirement)
   - **Institutional Onboarding Minimum:** €1,000,000 (platform policy)
   - Below €100K: Standard KYC
   - Above €100K: Enhanced KYB (Know Your Business)
   - Strictest jurisdiction list (OFAC + UN + EU + FATF High-Risk)

**✅ In Scope (Unchanged from v1.3):**

All v1.3 scope items remain valid:
- Minting of ERC-3643 fungible tokens representing fractional shares in securitized asset pools
- Minting of ERC-3643NFTs (ERC-721 base + ERC-3643 compliance modules) representing unique assets
- **Cross-chain portability** (Production only; MVP deploys to Polygon Amoy only)
- On-chain identity verification through ONCHAINID with Claim Issuers for KYC/AML enforcement
- Transfer restrictions ensuring only verified wallets can hold or trade security tokens
- Automated repayment distribution via smart contracts with Gnosis Safe multisig integration
- USDC/USDT stablecoin payment rails with compliance-gated transfers
- React-based marketplace for primary issuance of tokenized assets
- Real-time fraud detection using behavioral analytics (Kafka/Flink streaming) and ML models
- Regulatory reporting dashboards (Plotly Dash, Metabase, Streamlit) with exportable audit trails
- GDPR-compliant identity data management using cryptographic erasure (PII never on-chain)
- CI/CD pipelines, containerization (Docker), orchestration (Kubernetes), and infrastructure-as-code (Terraform)

**⚠️ Out of Scope:**

🆕 **Added to Out of Scope:**
- **Secondary market trading for uLP tokens** (deferred to MVP-3; MVP-1 has secondary trading for asset-specific tokens)
- **Mobile applications** (deferred to MVP-3)
- **Cross-chain bridge** (deferred to Production; requires 5-of-9 multisig per Section 5)
- **Mobile Money integration** (MVP uses MockFiatRamp; production integration deferred)

✅ **Unchanged from v1.3:**
- Bare ERC-20 tokens without ERC-3643 compliance wrappers
- Plain ERC-721 NFTs without ERC-3643 identity restrictions (all NFTs must use ERC-3643NFT standard)
- ERC-1155 multi-token standard under any circumstances
- Unregulated DeFi protocols (unpermissioned liquidity pools, anonymous lending)
- Direct fiat on-ramps (platform accepts only stablecoins and wrapped assets)
- **End-user custodial wallet services** (users retain self-custody via MetaMask/WalletConnect; Fireblocks is for PLATFORM treasury only)
- Legal opinion provision (platform provides technical compliance tools, not legal advice)
- Non-blockchain asset registries (all asset provenance recorded on-chain)
- Hyperledger Fabric or any permissioned blockchain frameworks

**🆕 MVP Testnet Clarification:**
- MVP deploys to **Polygon Amoy only** (Chain ID: 80002)
- Ethereum mainnet integration deferred to Production phase (Week 12+)
- All bank/fiat integrations use mock services (swappable for production)

### 1.2.1 Authentication Specification 🆕

**Method:** SIWE (Sign-In with Ethereum) + JWT

**Authentication Flow:**
```
1. User clicks "Connect Wallet" (MetaMask/WalletConnect)
2. Frontend requests nonce from backend: GET /api/v1/auth/nonce?wallet=0x...
3. Backend generates cryptographically random nonce (UUID v4), stores in Redis (TTL: 5 minutes)
4. Frontend prompts user to sign SIWE message with wallet
5. Frontend submits signature: POST /api/v1/auth/login { wallet, signature, nonce }
6. Backend verifies signature recovers wallet address, validates nonce
7. Backend generates JWT (access token + refresh token)
8. Frontend stores tokens in memory (access) and localStorage (refresh)
```

**JWT Structure:**
```json
{
  "sub": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "iat": 1711382400,
  "exp": 1713974400,
  "jti": "550e8400-e29b-41d4-a716-446655440000",
  "role": "INSTITUTIONAL_INVESTOR",
  "kyc_status": "VERIFIED",
  "kyc_expires": 1742918400
}
```

**Token Specifications:**
| Token Type | Expiry | Storage | Refresh |
|------------|--------|---------|---------|
| Access Token | 30 days | Memory (React state) | Via refresh token |
| Refresh Token | 7 days | localStorage (encrypted) | Via /auth/refresh endpoint |

**Session Management:**
- **Idle Timeout:** 15 minutes of inactivity → force re-authentication
- **Absolute Timeout:** 8 hours max session duration → force logout
- **Concurrent Sessions:** Max 5 active sessions per wallet; oldest evicted on 6th login
- **Session Revocation:** POST /api/v1/auth/logout invalidates all sessions (blacklists JWT `jti` in Redis)
- **Re-authentication Required:** Redemption >€1M, PII decryption, compliance rule change → wallet signature + MFA

**Security Measures:**
- Nonce expires in 5 minutes (prevent replay attacks)
- SIWE message includes domain, issued-at, expiration-time (prevent phishing)
- JWT signed with RS256 (asymmetric, HSM-stored private key)
- Refresh token rotation (new refresh token issued on each refresh)

### 1.2.2 Authorization Matrix (RBAC) 🆕

**Role-Based Access Control (RBAC) Specification:**

| Role | Resource | Create | Read | Update | Delete | Conditions |
|------|----------|--------|------|--------|--------|------------|
| **Enterprise Partner** | assets | ✓ (own) | ✓ (own) | ✓ (own, pending only) | - | KYB verified |
| **Enterprise Partner** | industrial_certificates | ✓ (own) | ✓ (own) | - | - | ORIGINATOR_ROLE |
| **Investor (Retail)** | investor_holdings | - | ✓ (own) | - | - | KYC verified |
| **Investor (Retail)** | transactions | - | ✓ (own) | - | - | KYC verified |
| **Institutional Investor** | liquidity_pools | - | ✓ (all) | - | - | KYB verified, min €100K |
| **Institutional Investor** | uLP_positions | - | ✓ (own) | - | - | KYB verified |
| **Institutional Investor** | fireblocks_vault | - | ✓ (own) | - | - | KYB verified |
| **Pool Manager** | liquidity_pools | ✓ | ✓ | ✓ | - | POOL_MANAGER_ROLE |
| **Pool Manager** | yield_distributions | ✓ | ✓ | - | - | POOL_MANAGER_ROLE |
| **Compliance Officer** | audit_logs | - | ✓ | - | - | MFA required |
| **Compliance Officer** | PII | - | ✓ (decrypt) | - | - | MFA + justification logged |
| **Compliance Officer** | kyc_claims | ✓ | ✓ | ✓ (revoke) | - | CLAIM_ISSUER_ROLE |
| **Compliance Officer** | regulatory_holds | ✓ | ✓ | ✓ | ✓ | MFA required |
| **Regulator** | transaction_logs | - | ✓ (pseudonymized) | - | - | Read-only portal, SSO |
| **Regulator** | investor_register | - | ✓ (aggregated) | - | - | Judicial authorization for PII |
| **Auditor** | smart_contract_events | - | ✓ | - | - | Time-bound credentials (max 90 days) |
| **Auditor** | nav_calculations | - | ✓ | - | - | Time-bound credentials |
| **DevOps Engineer** | kubernetes_cluster | ✓ | ✓ | ✓ | ✓ | Production: approval required |
| **DevOps Engineer** | secrets_vault | ✓ | ✓ | ✓ | ✓ | MFA + justification |
| **Developer** | smart_contracts | ✓ (staging) | ✓ | ✓ (staging) | - | CI/CD pipeline only |
| **Developer** | api_services | ✓ (staging) | ✓ | ✓ (staging) | - | CI/CD pipeline only |

**Permission Enforcement:**
- API Gateway validates JWT role claims before routing
- Service-layer RBAC middleware enforces fine-grained permissions
- Database row-level security (RLS) for multi-tenant data isolation
- All permission denials logged to audit_logs

### 1.2.3 OWASP Top 10 Mitigation Requirements 🆕

| OWASP Top 10 (2025) | Mitigation Strategy | Implementation |
|---------------------|---------------------|----------------|
| **A01: Broken Access Control** | RBAC at API gateway + service layer; Database RLS | FastAPI Depends() for role checks; PostgreSQL RLS policies |
| **A03: Injection** | Parameterized queries only; Pydantic validators | SQLAlchemy ORM (no raw SQL); Pydantic schema validation for all inputs |
| **A05: Security Misconfiguration** | CIS benchmarks for Kubernetes; Terraform validation | CIS Kubernetes Benchmark v1.8; tfsec/checkov in CI/CD |
| **A07: Identification/Authentication Failures** | SIWE + JWT; Rate limiting on auth endpoints | 5 failed logins/hour → temporary lockout; MFA for sensitive actions |
| **A08: Software and Data Integrity Failures** | Signed smart contract upgrades; HSM-stored keys | UUPS proxy with timelock; Gnosis Safe 3-of-5 multisig |
| **A09: Security Logging and Monitoring Failures** | Centralized logging (Prometheus/Loki); Alert thresholds | All auth events logged; PagerDuty integration for critical alerts |
| **A10: SSRF** | Egress filtering; Allowlist for oracle calls | Kubernetes NetworkPolicies; HTTP allowlist for Chainlink adapters |

**Input Validation Specification:**
| Field | Type | Validation Rules |
|-------|------|------------------|
| Text (names, descriptions) | String | Max 500 characters; Unicode letters + spaces + basic punctuation (. , - ' ( )) |
| Email | String | RFC 5322 compliant; Max 254 characters; Verified via confirmation email |
| Investment Amount | Decimal | Min €100,000 (institutional), Min €1,000 (retail); Max €1B; 2 decimal places |
| Wallet Address | String | 0x-prefixed; 42 characters; Hex validation (regex: `^0x[a-fA-F0-9]{40}$`) |
| National ID | String | Country-specific regex (e.g., Nigeria NIN: `^\d{11}$`, Ghana Card: `^[A-Z0-9]{9}\d{2}$`) |
| File Upload | Binary | PDF only; Max 10MB; Virus scan (ClamAV) required before processing |
| Date | Date | ISO 8601 format (YYYY-MM-DD); Not in future (for DOB); Not in past (for expiry) |

## 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **ERC-3643** | Ethereum Request for Comment 3643; the T-REX protocol for permissioned tokens with on-chain identity verification and transfer restrictions |
| **T-REX** | Token for Regulated Exchanges; reference implementation of ERC-3643 providing compliance modules, identity registry, and transfer validation |
| **ONCHAINID** | Decentralized identity protocol storing verifiable claims on-chain; used by ERC-3643 for KYC/AML verification without exposing PII |
| **Claim Issuer** | Trusted entity authorized to sign and issue identity claims (e.g., KYC approval, accreditation status) into the ONCHAINID system |
| **Identity Registry** | Smart contract maintaining mapping between wallet addresses and their ONCHAINID identity records for compliance verification |
| **Compliance Module** | ERC-3643 smart contract component enforcing transfer rules, investor caps, jurisdiction restrictions, and holding periods |
| **Trusted Issuers Registry** | On-chain registry of authorized Claim Issuers whose signatures are accepted for identity verification |
| **Transfer Restriction** | ERC-3643 mechanism blocking token transfers to/from wallets without valid identity claims |
| **Security Token** | Digital asset representing ownership in an underlying real-world asset, subject to securities regulations |
| **Asset Originator** | Entity that originates real-world assets for tokenization (e.g., real estate developer, invoice holder) |
| **Cryptographic Erasure** | GDPR compliance pattern where PII encryption keys are destroyed to render on-chain hash references irrecoverable |
| **Claim Hash** | Cryptographic commitment (SHA-256) to identity claim data stored on-chain; never contains recoverable PII |
| **PII** | Personally Identifiable Information; any data that can identify a natural person (name, DOB, national ID, address) |
| **Wallet Address Pseudonymization** | Technique of storing wallet-to-identity mappings using encrypted references rather than plaintext addresses |
| **RWA** | Real-World Asset; physical or traditional financial asset tokenized on blockchain |
| **MiCA** | Markets in Crypto-Assets Regulation; EU regulatory framework for crypto-asset service providers |
| **FATF** | Financial Action Task Force; international body setting AML/CFT standards including the Travel Rule |
| **KYC** | Know Your Customer; identity verification process required before token acquisition |
| **AML** | Anti-Money Laundering; monitoring and reporting suspicious transaction patterns |
| **CFT** | Counter-Financing of Terrorism; financial surveillance preventing terrorist funding |
| **Gnosis Safe** | Multi-signature wallet protocol for secure treasury and repayment management |
| **Chainlink** | Decentralized oracle network providing price feeds, proof-of-reserves, and off-chain computation |
| **ApeWorX** | Python-based smart contract development framework (successor to Brownie) for Solidity development |
| **HSM** | Hardware Security Module; physical device for secure cryptographic key storage |
| **CSP** | Content Security Policy; HTTP header preventing XSS attacks in React frontend |

### 🆕 Institutional Terms

| Term | Definition |
|------|------------|
| **Ujamaa Pool Token (uLP)** | Ujamaa Liquidity Provider token; yield-bearing ERC-3643 token representing ownership in liquidity pool |
| **Yield-Bearing Token** | Token that appreciates in value over time through yield accrual (balance constant, NAV increases) |
| **Value-Accrual Model** | Token economics where token balance stays constant while value per token increases |
| **NAV (Net Asset Value)** | Value per Ujamaa Pool Token (uLP) = (Total Pool Value / Total uLP Shares) |
| **Liquidity Pool** | Diversified pool of industrial financings managed by smart contract |
| **Pool Family** | Category of liquidity pools (e.g., Pool Industrie, Pool Agriculture) |
| **Fireblocks** | Institutional-grade digital asset custody platform (FSC Mauritius compliant, MPC technology) |
| **Ujamaa Euro (UJEUR)** | Euro Coin; euro-backed stablecoin (1 Ujamaa Euro (UJEUR) = €1.00). Issued by Circle (MiCA-compliant, EU-regulated) |
| **EURR** | Euro-backed stablecoin alternative; euro-pegged for African markets. Issued by African partner (local central bank licensed). Use case: African markets without EU banking relationship |
| **FX Risk** | Foreign exchange risk between fiat (EUR/USD) and stablecoins |
| **KYB** | Know Your Business; enhanced due diligence for institutional investors (≥€100K) |
| **Institutional Threshold** | €100,000 investment threshold; above triggers enhanced KYB |
| **Strictest Jurisdiction List** | Combined OFAC + UN + EU + FATF High-Risk jurisdictions (blocked) |
| **Proof of Reserve** | On-chain attestation of pool reserves and backing assets |
| **Ujamaa Asset Token (UAT)** | Rebranded name for ERC-3643 fungible token contract (formerly UjamaaToken). Use "UAT" or "ERC-3643 fungible token" consistently; deprecated: "UjamaaToken" |
| **Industrial Gateway** | Rebranded name for stock certification system (formerly AssetProof). Legacy table name: `asset_proofs` → new: `industrial_gateway_certificates` |
| **Mobile Money** | African mobile payment systems (M-Pesa, MTN, Airtel) |
| **BIIC** | Banque Internationale pour l'Industrie et le Commerce (Mauritius bank partner) |
| **MCB** | Mauritius Commercial Bank (Mauritius bank partner) |
| **Bank Escrow** | Regulated escrow accounts at BIIC/MCB for investor funds and industrial repayments |
| **TVL** | Total Value Locked; Total value of assets deposited in liquidity pool |
| **APY** | Annual Percentage Yield; Effective annual rate of return (compounding) |
| **IRR** | Internal Rate of Return; Discount rate making NPV of cash flows zero |
| **MOIC** | Multiple on Invested Capital; Total value / invested capital |
| **UBO** | Ultimate Beneficial Owner; Natural person(s) owning or controlling >25% of enterprise entity |
| **SIWE** | Sign-In with Ethereum; Authentication method using wallet signature |
| **JWT** | JSON Web Token; Standard for secure token-based authentication |
| **RBAC** | Role-Based Access Control; Authorization model based on user roles |
| **RLS** | Row-Level Security; Database-level access control |
| **MFA** | Multi-Factor Authentication; Authentication requiring multiple verification methods |
| **SSO** | Single Sign-On; Authentication allowing access to multiple applications with one login |
| **HSM** | Hardware Security Module; Physical device for secure cryptographic key storage |
| **MPC** | Multi-Party Computation; Cryptographic protocol for distributed key management |

## 1.4 References

1. **IEEE Std 830-1998** — IEEE Recommended Practice for Software Requirements Specifications
2. **ISO/IEC/IEEE 29148:2018** — Systems and software engineering — Life cycle processes — Requirements engineering
3. **ERC-3643 EIP** — Ethereum Improvement Proposal 3643: T-REX Protocol for Permissioned Tokens (https://eips.ethereum.org/EIPS/eip-3643)
4. **T-REX Whitepaper** — Token for Regulated Exchanges: A Compliance Framework for Security Tokens (Tokeny Solutions, 2021)
5. **ONCHAINID Specification** — Decentralized Identity Protocol v2.1 (https://www.onchainid.com/)
6. **Regulation (EU) 2023/1114 (MiCA)** — Markets in Crypto-Assets Regulation, Official Journal of the European Union
7. **FATF Guidance** — Updated Guidance for a Risk-Based Approach to Virtual Assets and VASPs (Financial Action Task Force, October 2021)
8. **GDPR Regulation (EU) 2016/679** — General Data Protection Regulation, Articles 17, 20, 25, 32
9. **SEC Release No. 33-10767** — Framework for "Investment Contract" Analysis of Digital Assets (U.S. Securities and Exchange Commission)
10. **OpenZeppelin Contracts v5.0** — Secure Smart Contract Library Documentation
11. **Web3.py v6.0 Documentation** — Ethereum Python Library (https://web3py.readthedocs.io/)
12. **HashiCorp Vault Documentation** — Secrets Management and Data Protection
13. **Chainlink 2.0 Whitepaper** — A Decentralized Oracle Network for Hybrid Smart Contracts
14. **Gnosis Safe Developer Documentation** — Multi-Signature Wallet SDK (https://docs.safe.global/)
15. **React 19 Documentation** — JavaScript Library for User Interfaces (https://react.dev/)
16. **FastAPI Documentation** — Modern Python Web Framework for APIs (https://fastapi.tiangolo.com/)
17. **Kubernetes v1.28 Documentation** — Container Orchestration System
18. **Terraform Documentation** — Infrastructure as Code Software (HashiCorp)
19. **Polygon Network Documentation** — Polygon Labs (https://docs.polygon.technology/)
20. **ERC-3643 T-REX Protocol Specification** — Tokeny Solutions (https://docs.tokeny.com/erc3643)
21. **Nigeria SEC Rules on Digital Assets** — Securities and Exchange Commission Nigeria (2022)
22. **Mauritius FSC CIS Manager License Framework** — Financial Services Commission Mauritius (2021)
23. **OHADA Uniform Act on Commercial Companies** — Organization for the Harmonization of Business Law in Africa (2014)

### Institutional References

24. **Fireblocks API Documentation** — Institutional Custody Platform (https://developers.fireblocks.com/)
25. **Circle Ujamaa Euro (UJEUR) Documentation** — Euro Coin Stablecoin (https://www.circle.com/en/Ujamaa Euro (UJEUR))
26. **Mauritius FSC CIS Manager License** — Financial Services Commission (https://www.fscmauritius.org/)
27. **OFAC Sanctions List** — U.S. Treasury Department (https://sanctionssearch.ofac.treas.gov/)
28. **UN Sanctions List** — United Nations Security Council (https://www.un.org/securitycouncil/sanctions)
29. **EU Sanctions Map** — European External Action Service (https://www.sanctionsmap.eu/)
30. **FATF High-Risk Jurisdictions** — Financial Action Task Force (https://www.fatf-gafi.org/)
31. **M-Pesa API Documentation** — Safaricom (https://developer.mpesa.africa/)
32. **BIIC Bank API** — Banque Internationale pour l'Industrie et le Commerce
33. **MCB Bank API** — Mauritius Commercial Bank

## 1.5 Overview

This SRS v2.0 document is organized into eleven sections following IEEE 830 and ISO/IEC 29148 standards, with institutional architecture integrated throughout:

**Section 1 (Introduction)** establishes the document's purpose, scope, terminology, and regulatory context. It defines what the Ujamaa DeFi Platform is with **yield-bearing uLP tokens** and **liquidity pool management**, and explicitly states what it is not.

**Section 2 (Overall Description)** provides a high-level view of the platform's position in the institutional DeFi ecosystem, enumerates **core functions**, describes user classes with **investment tiers (Retail <€100K, Institutional ≥€100K)**, enhanced KYB requirements, and the operating environment with **Fireblocks custody** and **Mobile Money integration**.

**Section 3 (System Features)** details **EPICs** with user stories and acceptance criteria covering asset tokenization, smart contracts, oracle integration, payments, marketplace, fraud detection, reporting, security, auditability, and **liquidity pool management**.

**Section 4 (External Interface Requirements)** specifies user interfaces (React SPA), hardware interfaces (nodes, HSMs), software interfaces (Web3.py, T-REX, Chainlink, **Fireblocks API, Mobile Money APIs, Bank APIs**), and communication protocols (REST, WebSocket, gRPC, TLS 1.3).

**Section 5 (System Architecture)** describes the **layered architecture** including tokenization, smart contracts, oracles, payments, marketplace, reporting, fraud detection, behavioral analytics, security, auditability, cross-chain bridge, and **liquidity pool layers** with explicit data flow descriptions.

**Section 6 (Database Design)** defines PostgreSQL schemas with partitioning and indexing, Redis caching strategy, Kafka/Spark pipeline design, GDPR pseudonymization with cryptographic erasure, immutable audit log structures, and **liquidity pool tracking tables**.

**Section 7 (Security Requirements)** covers ERC-3643 transfer enforcement, smart contract audit processes, proxy upgrade patterns, multisig thresholds, KYC/AML via ONCHAINID, **enhanced KYB**, GDPR implementation, threat modeling (STRIDE), penetration testing, secret management, React frontend security, and **Fireblocks MPC custody**.

**Section 8 (Performance Requirements)** provides measurable SLOs for frontend load time, API throughput, cache hit rates, gas limits, autoscaling, alerting, audit latency, and cross-chain finality.

**Section 9 (Scalability Requirements)** describes horizontal scaling per layer, Kafka partition scaling, Polygon as primary execution chain, bridge throughput limits, CDN strategy, and query optimization.

**Section 10 (Compliance & Regulatory Requirements)** addresses ERC-3643/T-REX compliance enforcement, AML/KYC via ONCHAINID, GDPR cryptographic erasure, MiCA alignment, SEC/CFTC considerations, **Mauritius FSC CIS Manager License**, **strictest jurisdiction list (OFAC+UN+EU+FATF)**, and regulator-specific audit trails.

**Section 11 (Appendices)** includes an extended glossary, complete references, and future extension possibilities.

---

# 2. Overall Description

## 2.1 Product Perspective

The Ujamaa DeFi Platform occupies a critical position in the institutional decentralized finance ecosystem as a regulated tokenization infrastructure layer. It bridges traditional finance (TradFi) and decentralized finance (DeFi) by enabling real-world assets to be represented as compliant digital securities on public blockchains while maintaining full regulatory adherence. The platform is specifically designed to serve African capital markets, enabling cross-border investment into African real-world assets while complying with pan-African and international regulatory frameworks.

**Ecosystem Position:**

- **Upstream integrations:**
  - **Asset originators:** African real estate developers (e.g., Rendeavour, Actis), agricultural cooperatives (coffee, cocoa, tea producers), mining companies (gold, cobalt, lithium operations), renewable energy projects (solar farms via Africa50), infrastructure funds (toll roads, ports, telecommunications), trade finance originators (Afreximbank partners), private equity firms (Helios Investment Partners, Actis, Harith General Partners)
  - **Identity providers:** National ID systems (e.g., Nigeria NIN, Kenya Huduma Namba, Ghana Card), KYC/AML verification services (Youverify, Smile Identity, Dojah), credit bureaus (TransUnion Africa, Experian Africa)
  - **Oracle networks:** Chainlink price feeds, African commodity price oracles (LME cobalt, ICE cocoa), foreign exchange rates (African Development Bank FX data), mobile money APIs (M-Pesa, MTN Mobile Money, Airtel Money)
  - **Stablecoin issuers:** Circle USDC, Tether USDT, African fiat-backed stablecoins (Celo Dollar, Monoix, BitPanda African stablecoins), **Circle Ujamaa Euro (UJEUR) (euro-backed)** 🆕, **EURR (euro-backed for African markets)** 🆕
  - **Custody providers:** **Fireblocks (institutional digital asset custody)** 🆕, **Mobile Money providers (M-Pesa, MTN, Airtel)** 🆕
  - **Bank partners:** **BIIC (Mauritius)** 🆕, **MCB (Mauritius)** 🆕 for escrow accounts
  - **Industrial partners:** **GDIZ (General Distribution & Industrial Zone)** 🆕, **SIPI (Société Industrielle et de Promotion)** 🆕

- **Downstream integrations:**
  - **Institutional investors (€100K+):** African pension funds (Ghana SSNIT, Nigeria PenCom, South Africa PIC), family offices, development finance institutions (African Development Bank, IFC, FMO), sovereign wealth funds (Nigeria Sovereign Investment Authority, Botswana Pula Fund, Angola Fundo Soberano), insurance companies (Old Mutual, Sanlam, Prudential Assurance), **Logic Capital (example: €10M investment)** 🆕
  - **Retail investors (<€100K):** Accredited high-net-worth individuals, diaspora investors (African diaspora remittance channels), mobile money users (M-Pesa, MTN, Airtel wallets)
  - **Secondary market liquidity providers:** African stock exchanges (Nigerian Exchange Group, Johannesburg Stock Exchange, Nairobi Securities Exchange, Ghana Stock Exchange), alternative trading systems, licensed broker-dealers
  - **Regulatory reporting systems:** Central bank reporting (CBN, SARB, CBK, Bank of Ghana), securities commission filings (SEC Nigeria, **FSC Mauritius** 🆕, CMA Kenya, SEC Ghana), AfCFTA trade reporting
  - **Tax compliance software:** African tax authority integrations (FIRS Nigeria, SARS South Africa, KRA Kenya, GRA Ghana), VAT/GST reporting, withholding tax automation

- **Parallel systems:**
  - **African securities settlement systems:** Central Securities Depositories (CSD Nigeria, Strate South Africa, CDS Kenya, CSD Ghana), AfCFTA Settlement Platform
  - **Pan-African payment systems:** PAPSS (Pan-African Payment and Settlement System), SADC RTGS, EAC Regional Payment System
  - **Traditional banking rails:** SWIFT integration for cross-border settlements, TARGET2 for EU-Africa corridors, CIPS for China-Africa trade
  - **Regulatory filing systems:** SEC EDGAR (US investors), ESMA databases (EU investors), African Securities Exchanges Association (ASEA) reporting

The platform does not compete with existing DeFi protocols but rather extends them by adding compliance primitives that enable institutional participation. Unlike unpermissioned DeFi (Uniswap, Aave, Compound), UJAMAA enforces identity verification and transfer restrictions at the token contract level via ERC-3643, making it suitable for regulated securities under African securities laws (e.g., Nigeria ISA 2007, South Africa FAIS Act, Kenya Capital Markets Act).

**African Market Focus:**
- **AfCFTA Alignment:** The platform supports African Continental Free Trade Area (AfCFTA) protocols for cross-border investment, enabling tokenized assets to be traded across 54 African jurisdictions with harmonized compliance rules
- **UEMOA/WAEMU Regional Integration:** Platform supports UEMOA (West African Economic and Monetary Union) harmonized regulations across 8 member states (Benin, Burkina Faso, Côte d'Ivoire, Guinea-Bissau, Mali, Niger, Senegal, Togo) with single AMF-UEMOA authorization permitting operation across all member states
- **Local Currency Support:** Integration with African fiat gateways (NGN, ZAR, KES, GHS, XOF, XAF) via stablecoin wrappers and PAPSS settlement; XOF (CFA Franc) supported for UEMOA member states with BCEAO compliance
- **Mobile-First Accessibility:** React frontend optimized for mobile devices (90%+ African internet traffic is mobile), USSD integration for feature phones, low-bandwidth mode for areas with limited connectivity
- **Islamic Finance Compliance:** Optional Shariah-compliant tokenization structures (Sukuk) for North African and West African Muslim investors
- **BRVM Integration:** Tokenized securities can be dual-listed on BRVM (Bourse Régionale des Valeurs Mobilières) for secondary market liquidity across UEMOA region
- **OHADA Harmonization:** Corporate law harmonization across 17 OHADA member states enables standardized tokenized equity structures

**Industrial Originator Support:**
The platform specifically supports African industrial asset classes:

| Asset Class | Examples | Typical Token Structure |
|-------------|----------|------------------------|
| **Agriculture** | Coffee cooperatives (Ethiopia, Uganda), cocoa farms (Ghana, Côte d'Ivoire), tea estates (Kenya, Malawi), cashew farms (Côte d'Ivoire, Benin), cotton farms (Benin, Burkina Faso), peanut production (Senegal) | ERC-3643 fungible (pool) or ERC-3643 NFT (single estate) |
| **Mining & Minerals** | Gold mines (Ghana, Mali, Tanzania, Côte d'Ivoire, Burkina Faso), cobalt operations (DRC), lithium projects (Zimbabwe, Namibia), phosphates (Senegal), iron ore (Guinea) | ERC-3643 fungible (royalty streams) |
| **Real Estate** | Commercial properties (Lagos, Nairobi, Johannesburg, Abidjan, Dakar, Cotonou), affordable housing projects, REITs | ERC-3643 fungible (REIT shares) or ERC-3643 NFT (single property) |
| **Renewable Energy** | Solar farms (Morocco Noor, South Africa REIPPPP), hydroelectric (Ethiopia GERD), wind (Kenya Turkana), off-grid solar (M-KOPA across East/West Africa) | ERC-3643 fungible (power purchase agreement tokens) |
| **Infrastructure** | Toll roads (Lagos-Ibadan), ports (Mombasa, Tema, Abidjan, Dakar, Cotonou), telecommunications towers | ERC-3643 fungible (infrastructure bonds) |
| **Oil & Gas** | Offshore oil (Côte d'Ivoire, Senegal, Nigeria), gas fields (Senegal, Mauritania, Nigeria), oil services (Benin, Ghana) | ERC-3643 fungible (revenue-sharing tokens) |
| **Trade Finance** | Export receivables (oil, minerals, agricultural commodities), letters of credit, warehouse receipts (AFEX Nigeria, ZACE Zambia) | ERC-3643 fungible (invoice pool) |
| **Private Equity** | Growth capital for African SMEs, venture debt funds, mezzanine financing | ERC-3643 fungible (fund LP shares) |
| **Art & Culture** | African artwork, antiquities (with provenance verification), music royalties | ERC-3643 NFT (unique asset) |

The platform's cross-chain architecture (Ethereum ↔ Polygon) positions it to leverage Ethereum's security and settlement finality for high-value transactions while utilizing Polygon's low gas costs for frequent operations such as compliance checks, secondary market trades, and distribution payments. For African users, Polygon's low transaction costs (<$0.01) are critical for retail investor accessibility.

**Regulatory Alignment:**
- **Securities Dealing:** Platform complies with African securities regulations (Nigeria SEC Rules, South Africa FAIS Act, Kenya Capital Markets Authority regulations, Ghana SEC Act, AMF-UEMOA regulations for UEMOA member states)
- **AML/CFT:** FATF-compliant AML/KYC via ONCHAINID, aligned with Eastern and Southern Africa Anti-Money Laundering Group (ESAAMLG) and West Africa Inter-Governmental Action Group against Money Laundering (GIABA)
- **Data Protection:** GDPR-aligned with African data protection laws (Nigeria NDPR, South Africa POPIA, Kenya Data Protection Act, Ghana Data Protection Act, Benin Loi 2017-20, Côte d'Ivoire Loi 2013-450, Senegal Loi 2008-12)
- **Tax Compliance:** Withholding tax automation for cross-border dividends/interest, VAT treatment per African tax jurisdictions, UEMOA harmonized tax arrangements
- **Regional Bodies:** Compliance with BCEAO (regional central bank), BRVM (regional stock exchange), and OHADA (harmonized business law) requirements

## 2.2 Product Functions

The Ujamaa DeFi Platform provides the following core functions:

✅ **Core Functions (1-15):**

1. **ERC-3643 Fungible Token Minting** — Create tokenized share classes representing fractional ownership in securitized asset pools with configurable compliance rules (investor caps, jurisdiction restrictions, lock-up periods)

2. **ERC-3643 NFT Minting** — Create unique token representations (supply=1) of individual assets such as real estate deeds, single invoices, or artwork with ERC-721 base functionality extended by ERC-3643 compliance modules

3. **Identity Verification Onboarding** — Integrate with ONCHAINID Claim Issuers to verify investor identity, accreditation status, and jurisdiction before allowing token acquisition

4. **Transfer Restriction Enforcement** — Automatically block token transfers to/from wallets lacking valid identity claims; enforce holding periods and investor concentration limits

5. **Cross-Chain Bridge Operations** — Enable ERC-3643 tokens to move between Ethereum (settlement) and Polygon (execution) while preserving compliance state and identity verification status

6. **Automated Repayment Distribution** — Execute smart contract-mediated cash flow distributions from underlying assets to token holders via USDC/USDT with pro-rata allocation

7. **Gnosis Safe Multisig Treasury** — Manage platform and asset-level treasuries using multi-signature wallets requiring M-of-N approval for withdrawals exceeding thresholds

8. **Oracle Price Feed Integration** — Consume Chainlink price feeds for asset valuation, NAV calculation, and collateralization ratio monitoring with fallback mechanisms

9. **Primary Market Issuance** — Facilitate initial token sales through React marketplace with compliance-gated participation and automated cap table management

10. **Secondary Market Trading** — Enable peer-to-peer trading of ERC-3643 tokens with real-time compliance validation and automated transfer tax/fee collection

11. **Fraud Detection Engine** — Analyze transaction patterns using Scikit-learn anomaly detection and PyTorch LSTM models to identify suspicious behavior (wash trading, layering, structuring)

12. **Behavioral Analytics Pipeline** — Process real-time event streams via Kafka/Flink to build investor behavior profiles and detect deviations from expected patterns

13. **Regulatory Reporting Dashboard** — Generate compliance reports (MiCA Article 22, FATF Travel Rule, SEC Form D) using Plotly Dash and Metabase with exportable audit trails

14. **GDPR Data Subject Rights** — Implement cryptographic erasure for Article 17 (right to erasure), data export API for Article 20 (data portability), and privacy-by-design architecture for Article 25

15. **Smart Contract Upgrade Management** — Deploy and manage upgradeable proxy contracts (EIP-2535 Diamond pattern or UUPS) with timelock and multisig governance for security patches

🆕 **Institutional Functions (16-23):**

16. **Ujamaa Pool Token (uLP) Minting & Redemption** — Create yield-bearing uLP tokens representing pool ownership; redeem uLP for Ujamaa Euro (UJEUR) + accrued yield using value-accrual model (balance constant, NAV increases)

17. **Liquidity Pool Management** — Create and manage diversified pools (Pool Industrie, Pool Agriculture, etc.); deploy funds to multiple industrials; track allocation by asset class, industrial, and geography

18. **Yield Calculation & Accrual** — Calculate NAV per uLP share; accrue yield from industrial repayments; update pool value in real-time; generate yield statements

19. **Fireblocks Custody Integration** — Institutional-grade custody for digital assets using MPC technology; multi-sig wallet management; Mobile Money integration (M-Pesa, MTN, Airtel)

20. **Bank Escrow Integration** — Real BIIC/MCB escrow accounts for investor funds; wire transfer integration; fiat on/off ramp; Mobile Money integration

21. **Enhanced KYB (Know Your Business)** — Institutional investor onboarding (≥€100K); UBO identification (>25% ownership); source of funds verification; enhanced due diligence

22. **Proof of Reserve Display** — On-chain attestation of pool reserves; real-time NAV tracking; downloadable reserve reports (PDF); institutional transparency dashboard

23. **Pool Family Management** — Manage multiple pool families (Industrie, Agriculture, Trade Finance, Renewable Energy); cross-pool diversification rules; risk limits per family

### Mauritius Management Company Specification

**Definition:** The Management Company is a Mauritius-registered entity licensed by the FSC (Financial Services Commission) as a CIS (Collective Investment Scheme) Manager. It operates the Ujamaa DeFi Platform and provides regulatory oversight for all pool operations.

**Regulatory Requirements:**
- **License:** CIS Manager License (Category 1) from FSC Mauritius
- **Regulatory Capital:** Minimum $25,000 (or equivalent)
- **Compliance Officer:** Appointed AML/CFT officer (resident in Mauritius)
- **Local Auditor:** FSC-approved auditor for annual audits
- **Fiduciary Services:** Licensed fiduciary for investor protection
- **Reporting:** Monthly CIS manager returns (Form CIS-M1), quarterly regulatory filings

**Management Company Functions:**
1. **KYB/KYC Oversight** - Conduct enhanced KYB for institutional investors (≥€100K)
2. **Pool Authorization** - Approve new pool creation (Pool Families)
3. **Compliance Monitoring** - Ensure OHADA compliance for industrial operations
4. **Investor Protection** - Hold Guarantee Tokens in trust for uLP holders
5. **Regulatory Reporting** - File reports with FSC Mauritius, African regulators
6. **Audit Coord** - Annual Big Four or licensed auditor review

**OHADA Legal Framework:**
- **Applicable Law:** OHADA Uniform Act on Commercial Companies (17 African member states)
- **Contract Enforcement:** Commercial contracts enforceable across OHADA zone
- **Security Interest:** Ujamaa Guarantee (UJG) constitutes valid security interest under OHADA law
- **Dispute Resolution:** Arbitration in Mauritius (LCIA) for cross-border enforceability
- **BankruLPcy Remote:** SPV structure protects investors from industrial bankruLPcy

**Mauritius-Africa Structure:**
```
Mauritius Management Company (FSC Licensed)
    ↓
Pool Families (4 pools: Industrie, Agriculture, Trade Finance, Renewable Energy)
    ↓
African Industrials (GDIZ partners in 17 OHADA countries)
    ↓
Escrow Accounts (BIIC/MCB Mauritius)
    ↓
Investors (Logic Capital, pension funds, family offices)
```

**Tax Treatment:**
- **Mauritius:** No capital gains tax, no withholding tax on distributions
- **Africa:** Double taxation treaties with 17 OHADA countries
- **Investors:** Tax-transparent structure (investors report own taxes)

### Escrow Account Specification

**Definition:** Regulated escrow accounts held at BIIC or MCB (Mauritius) for investor funds and industrial repayments. Funds are ring-fenced from platform operational funds.

**Escrow Structure:**
- **Investor Escrow** - Holds investor deposits (€10M+ for Logic Capital example)
- **Pool Escrow** - Holds pool funds before deployment to industrials
- **Repayment Escrow** - Receives industrial repayments (principal + interest)
- **Distribution Escrow** - Distributes yield to uLP holders

**Escrow Flow (ZARA Example):**
```
1. Logic Capital wires €10M → Investor Escrow (BIIC Mauritius)
2. Convert to Ujamaa Euro (UJEUR) → Pool Escrow
3. Deploy to Industrial (GDIZ partner) → Industrial receives Ujamaa Euro (UJEUR)
4. Industrial produces goods for ZARA
5. ZARA pays €2M → Repayment Escrow (BIIC Mauritius)
6. Smart Contract triggers distribution:
   - €1.8M to Pool (principal + interest)
   - €0.2M to Industrial (surplus after financing cost)
7. Yield distributed to uLP holders (pro-rata)
```

**Production Implementation:**
- **Bank Integration:** Real BIIC/MCB API integration for escrow accounts
- **Interface:** Standardized bank API interface for multi-bank support
- **Security:** MPC technology for key management (Fireblocks integration)

**Security:**
- Funds held in segregated accounts (ring-fenced from platform)
- Multi-sig withdrawal (3-of-5 for amounts >€1M)
- FATF Travel Rule compliance (originator/beneficiary info for transfers >€1,000)
- Monthly reconciliation (escrow balance vs. uLP supply)

**Definition:** Pool Families are categorized liquidity pools that group similar assets for diversification and risk management. Each family has distinct risk profiles, yield expectations, and compliance requirements.

**Supported Pool Families:**

| Pool Family | Asset Classes | Target Yield | Risk Profile | Minimum Investment | Lock-up Period |
|-------------|---------------|--------------|--------------|-------------------|----------------|
| **POOL_INDUSTRIE** | Manufacturing, factories, production (GDIZ) | 10-12% | Medium | €100,000 | 365 days |
| **POOL_AGRICULTURE** | Coffee, cocoa, cotton, cashews, food crops | 12-15% | Medium-High | €100,000 | 180 days |
| **POOL_TRADE_FINANCE** | Invoice tokenization, receivables pools | 8-10% | Low-Medium | €100,000 | 90 days |
| **POOL_RENEWABLE_ENERGY** | Solar, wind, hydroelectric projects | 9-11% | Low-Medium | €100,000 | 730 days |
| **POOL_REAL_ESTATE** 🆕 | Commercial & residential property tokenization | 8-12% | Low-Medium | €100,000 | 1095 days (3 years) |

**POOL_REAL_ESTATE Asset Classes (7 types):**
- **Commercial Office:** Office buildings, CBD properties
- **Retail Space:** Shopping malls, retail outlets
- **Industrial/Warehouse:** Warehouses, logistics facilities
- **Residential Apartments:** Multi-unit residential buildings
- **Mixed-Use Development:** Combined retail + residential + office
- **Hospitality:** Hotels, resorts, serviced apartments
- **Land Bank:** Strategic land holdings (appreciation)

**Pool Family Governance:**
- **Creation:** Requires Pool Manager approval + compliance review
- **Diversification:** Max 20% per industrial, max 40% per sub-asset class
- **Risk Limits:** Family-level exposure limits (set by risk committee)
- **Reporting:** Separate NAV, yield, and performance metrics per family
- **Cross-Family Investment:** Institutional investors can invest in multiple families
- **Rebalancing:** Quarterly review and rebalancing (if needed)

**Smart Contract Support:**
```solidity
// LiquidityPool.sol
enum PoolFamily {
    INDUSTRIE,
    AGRICULTURE,
    TRADE_FINANCE,
    RENEWABLE_ENERGY,
    REAL_ESTATE  // 🆕 NEW: Commercial & residential property
}

struct PoolConfig {
    PoolFamily family;
    uint256 maxExposurePerIndustrial; // 20% = 2000 (basis points)
    uint256 maxExposurePerAssetClass; // 40% = 4000 (basis points)
    uint256 minimumInvestment; // €100,000
    uint256 managementFeeBps; // 200 = 2% annual
    uint256 performanceFeeBps; // 2000 = 20% of yield
}

// Real Estate specific configuration
struct RealEstatePoolConfig {
    PoolFamily.REAL_ESTATE;
    uint256 maxExposurePerProperty;    // 25% = 2500 (basis points)
    uint256 maxExposurePerAssetClass;  // 40% = 4000 (basis points)
    uint256 maxExposurePerCity;        // 50% = 5000 (basis points)
    uint256 maxExposurePerCountry;     // 60% = 6000 (basis points)
    uint256 lockupPeriod;              // 1095 days (3 years)
    uint256 loanToValue;               // 60% = 6000 (basis points)
}
```

## 2.3 User Classes

### Enterprise Partners (Asset Originators)

**Technical Literacy:** Moderate — comfortable with web applications, basic understanding of blockchain concepts

**Examples:**
- **Manufacturing:** Factories, assembly plants, production facilities (any industry)
- **Agriculture:** Farms, cooperatives, plantations, fisheries (coffee, cocoa, tea, cotton, cashews, etc.)
- **Mining & Extractives:** Mines, quarries, oil & gas operations (gold, cobalt, lithium, crude oil, natural gas)
- **Trade & Commerce:** Importers, exporters, wholesalers, retailers (trade finance receivables)
- **Services:** Logistics companies, warehousing, transportation, professional services
- **Energy:** Power plants, renewable energy facilities (solar, wind, hydro), utilities
- **Real Estate:** Property developers, REITs, property management companies
- **Technology:** SaaS companies, tech startups (for revenue-based financing)
- **Other Industries:** Any verified enterprise with tokenizable assets

**Permissions:**
- Create and submit enterprise profile for onboarding and KYB verification
- Upload company documentation (registration, licenses, financial statements, beneficial ownership)
- Submit assets for tokenization (invoices, receivables, production data, inventory, contracts)
- Notarize production/operational data hashes via **Industrial Gateway** contract 🆕
- View tokenized asset performance and investor cap tables
- Manage multiple facilities/locations under single enterprise account
- Submit regulatory filings to relevant authorities (per jurisdiction)
- Access originator dashboard with asset performance metrics
- Configure token parameters for each asset (total supply, distribution waterfall)
- Initiate repayment events and view distribution history

**Responsibilities:**
- Ensure underlying assets are legally transferable under applicable law (jurisdiction-specific)
- Maintain accurate asset data and operational records
- Comply with ongoing disclosure obligations per jurisdiction (quarterly reports, annual audits)
- Provide audited financial statements annually (Big Four or licensed auditor)
- Notify platform of material changes (bankruLPcy, litigation, regulatory action, change of control)
- Maintain valid industry-specific licenses and permits
- Ensure compliance with environmental, social, and governance (ESG) standards where applicable

**Enterprise Partner Due Diligence (KYB) Requirements:**

| Requirement | Description | Verification Method |
|-------------|-------------|---------------------|
| **Corporate Registration** | Certificate of incorporation, business license | Government registry verification |
| **Beneficial Ownership** | Identify ultimate beneficial owners (UBOs) >25% | Corporate registry, self-declaration |
| **Financial Standing** | Audited financial statements (2 years minimum) | Third-party audit report |
| **Operational History** | Proof of ongoing operations (tax returns, utility bills) | Document verification |
| **Regulatory Compliance** | Industry-specific licenses and permits | Regulatory body verification |
| **Sanctions Screening** | Company and UBOs screened against sanctions lists | World-Check, Dow Jones, OFAC |
| **PEP Screening** | Politically exposed persons identification | Compliance database screening |
| **Adverse Media** | Negative news screening | Media monitoring services |

**Industry-Specific Requirements:**

| Industry | Additional Requirements |
|----------|------------------------|
| **Manufacturing** | Facility inspection report, quality certifications (ISO 9001), environmental compliance |
| **Agriculture** | Land title/lease, crop insurance, agricultural permits, sustainability certifications |
| **Mining** | Mining license, environmental impact assessment, community development agreements |
| **Trade/Import-Export** | Customs registration, trade licenses, letter of credit history |
| **Energy** | Operating license, grid connection agreement, environmental permits |
| **Real Estate** | Property title, valuation report, insurance, zoning compliance |
| **Technology** | IP portfolio, revenue audits, customer concentration analysis |

### Institutional Investors (€100,000+)

**Technical Literacy:** High — comfortable with financial platforms, understands yield-bearing instruments, expects institutional-grade reporting

**Investment Threshold:** **≥€100,000** (triggers enhanced KYB)

**Examples:**
- **Logic Capital** (example: €10M investment in Pool Industrie)
- African pension funds (Ghana SSNIT, Nigeria PenCom, South Africa PIC)
- Family offices, endowments, sovereign wealth funds
- Corporate treasuries (excess cash management)
- Development finance institutions (African Development Bank, IFC, FMO)
- Insurance companies (Old Mutual, Sanlam, Prudential Assurance)

**Permissions:**
- Browse and invest in **liquidity pools** (uLP tokens) 🆕
- View **real-time NAV** and yield accrual 🆕
- Download **yield statements** (PDF for accounting) 🆕
- Access **institutional dashboard** (portfolio, allocation, performance) 🆕
- Request **redemption** (uLP → Ujamaa Euro (UJEUR) + yield) 🆕
- View **Proof of Reserve** (on-chain attestation) 🆕
- Multi-sig wallet support (Gnosis Safe, Fireblocks) 🆕
- All permissions from standard Investors class

**Responsibilities:**
- Complete **enhanced KYB** (Know Your Business) 🆕
- Provide **corporate documentation** (registration, UBO, financial statements) 🆕
- Verify **source of funds** (bank statements, audited financials) 🆕
- Comply with **jurisdiction restrictions** (OFAC + UN + EU + FATF) 🆕
- Maintain **€100K minimum investment** (per pool) 🆕
- Maintain valid identity claims, report changes in accreditation status, comply with holding period restrictions

**Enhanced KYB Requirements:** See Section 2.4 (Investment Tiers)

### Investors (Accredited and Retail where permitted)
**Technical Literacy:** Variable — from crypto-native (MetaMask proficient) to traditional (require guided onboarding); mobile-first users (M-Pesa, MTN Mobile Money)
**Examples:** African pension funds (Ghana SSNIT, Nigeria PenCom, South Africa PIC), family offices, diaspora investors (US, EU, UK-based Africans), high-net-worth individuals, mobile money users, development finance institutions (African Development Bank, IFC, FMO), sovereign wealth funds (Nigeria Sovereign Investment Authority, Botswana Pula Fund, Angola Fundo Soberano), insurance companies (Old Mutual, Sanlam, Prudential Assurance)
**Permissions:**
- Complete KYC/AML onboarding via ONCHAINID Claim Issuer integration with African national ID systems (Nigeria NIN, Kenya Huduma Namba, Ghana Card, South Africa ID)
- Browse available tokenized assets in marketplace
- Subscribe to primary issuances and place secondary market orders
- View portfolio holdings, transaction history, and distribution receipts
- Export tax documents and compliance certificates (withholding tax certificates, dividend vouchers)
- Exercise governance rights (if token includes voting features)
- Receive distributions via mobile money (M-Pesa, MTN, Airtel) or bank transfer (PAPSS)

**Responsibilities:** Maintain valid identity claims, report changes in accreditation status, comply with holding period restrictions, file tax returns with African tax authorities (FIRS Nigeria, SARS South Africa, KRA Kenya, GRA Ghana), comply with foreign investment regulations where applicable.

### Compliance Officers
**Technical Literacy:** High — proficient with compliance software, regulatory reporting tools, and blockchain explorers
**Examples:** Licensed compliance professionals registered with African regulatory bodies (SEC Nigeria, FSC Mauritius, CMA Kenya, SEC Ghana, FSCA South Africa)
**Permissions:**
- Configure and manage Trusted Issuers Registry (approve/revoke Claim Issuers)
- Set and modify compliance rules per token (jurisdiction whitelists, investor caps)
- Review and approve/reject flagged transactions from fraud detection system
- Generate regulatory reports (MiCA, FATF, SEC, African securities commissions) with one-click export
- Access full audit trail with identity resolution (PII decrypted via Vault)
- Place regulatory holds on tokens under investigation
- File suspicious activity reports (SARs) with African financial intelligence units (NFIU Nigeria, FIC South Africa, FRC Kenya)
- Submit AfCFTA trade reports for cross-border transactions

**Responsibilities:** Ensure platform compliance with applicable regulations (African and international), maintain audit readiness, escalate suspicious activity to authorities, maintain licenses with African securities commissions, conduct annual compliance training for staff, ensure adherence to ESAAMLG and GIABA AML/CFT standards.

### Regulators (External Auditors, Government Agencies)
**Technical Literacy:** Variable — provided with read-only dashboards and export tools
**Examples:** African securities regulators (SEC Nigeria, CMA Kenya, SEC Ghana, FSC Mauritius, FSCA South Africa), central banks (CBN Nigeria, SARB South Africa, CBK Kenya, Bank of Ghana), financial intelligence units (NFIU, FIC, FRC), African Securities Exchanges Association (ASEA) observers, AfCFTA Secretariat trade monitors, AMF-UEMOA (UEMOA member states), BCEAO (UEMOA member states)

**Permissions:**
- Read-only access to compliance dashboards (Metabase/Plotly Dash)
- Request and receive exportable audit reports (PDF, CSV, XBRL)
- Query transaction history with identity resolution (via Compliance Officer mediation)
- Verify token compliance status via public blockchain explorers
- Access real-time monitoring of platform AML/KYC metrics
- Receive automated alerts for large transactions (>$100,000) and suspicious activity
- Access withholding tax and VAT compliance reports
- View-only access to transaction audit trails (wallet address pseudonymized per GDPR Article 25)
- Export compliance reports (MiCA Article 22, FATF Travel Rule, SEC Form D equivalents)
- Query investor cap tables per asset (aggregated data only; PII requires judicial authorization)
- Access real-time AML/CFT alerts (severity: HIGH and CRITICAL only)
- Request identity resolution via authorized Claim Issuer (requires multi-sig approval from platform admins)
- Access SPV legal structure documentation (offering memoranda, legal opinions)
- Receive quarterly compliance reports (automated via regulatory reporting module)

**Data Access Restrictions:**
- PII never directly accessible on-chain (cryptographic erasure pattern per GDPR Article 17)
- Wallet-to-identity mapping requires encrypted key access (HSM-secured, multi-sig)
- All regulator queries logged with timestamp, identity, and purpose (immutable audit trail)
- Legal document access requires regulator credential verification (SAML SSO with government identity provider)

**Regulatory Reporting Requirements:**
- Nigeria SEC: Quarterly digital asset activity reports (Form DA-01)
- Mauritius FSC: Monthly CIS manager returns (Form CIS-M1)
- EU (MiCA): Annual whitepaper updates, incident reports within 24 hours

**Responsibilities:** Conduct periodic examinations, verify regulatory adherence, issue guidance on compliance interpretations, enforce investor protection measures, coordinate cross-border regulatory actions via ASEA and AfCFTA mechanisms.

### Diaspora Investors (Special User Class)
**Technical Literacy:** Variable — typically tech-savvy, familiar with remittance channels
**Examples:** African diaspora in US, UK, EU, Canada, UAE sending remittances and investing in home countries
**Permissions:**
- Complete KYC via overseas Claim Issuers (US-based, UK-based, EU-based) with cross-border recognition
- Invest in home-country assets with favorable terms (diaspora bonds, preferential allocation)
- Receive distributions in foreign currency (USD, EUR, GBP) or local currency (NGN, KES, ZAR, GHS)
- Access tax documentation for both residence and source countries (avoid double taxation)
- Participate in diaspora-specific investment rounds (diaspora REITs, infrastructure bonds)

**Responsibilities:** Comply with foreign exchange regulations (both residence and source country), report foreign asset holdings to tax authorities (IRS Form 8938, UK SA106), adhere to investment limits for non-resident investors.

### Mobile Money Users (Retail Investors)
**Technical Literacy:** Basic — feature phone or entry smartphone users, USSD-literate
**Examples:** M-Pesa users (Kenya, Tanzania), MTN Mobile Money users (West Africa, East Africa), Airtel Money users
**Permissions:**
- Complete simplified KYC via mobile operator (tiered KYC per African central bank guidelines)
- Invest small amounts (minimum $10–$100) via mobile money wallet
- Receive distributions directly to mobile money wallet
- Check portfolio balance via USSD code or SMS
- Access simplified React frontend (low-bandwidth mode, data-light)

**Responsibilities:** Maintain active mobile money account, comply with mobile money transaction limits per African central bank regulations, report changes in phone number or SIM card.

### Developers (Smart Contract and Backend Engineers)
**Technical Literacy:** Expert — proficient in Solidity, Python, TypeScript, blockchain development
**Permissions:**
- Write and deploy smart contracts via ApeWorX framework
- Develop FastAPI microservices and PostgreSQL schemas
- Access development and staging environments
- View application logs, metrics, and tracing data (Prometheus, Grafana)
- Submit pull requests to code repositories with CI/CD pipeline execution

**Responsibilities:** Adhere to secure coding standards, write comprehensive tests, document code, participate in code reviews.

### DevOps Engineers
**Technical Literacy:** Expert — proficient in Kubernetes, Terraform, Docker, CI/CD
**Permissions:**
- Manage Kubernetes clusters and Helm chart deployments
- Provision infrastructure via Terraform (AWS/GCP/Azure, African data centers where available)
- Configure Prometheus alerting rules and Grafana dashboards
- Manage secrets in HashiCorp Vault or AWS KMS
- Execute disaster recovery procedures and backup restoration

**Responsibilities:** Maintain platform availability (99.9% SLA), implement security patches, optimize resource utilization, ensure backup integrity, ensure data residency compliance (African data protection laws).

### Auditors (External Smart Contract and Security Auditors)
**Technical Literacy:** Expert — proficient in smart contract security, penetration testing, formal verification
**Examples:** Big Four accounting firms (PwC, Deloitte, EY, KPMG), regional audit firms (PKF, BDO Africa), certified blockchain auditors (ACCA, ICAEW, OHADA-qualified)

**Permissions:**
- Read-only access to all smart contract source code and deployment scripts
- Access to test environments with full transaction replay capability
- Review security logs, incident reports, and vulnerability disclosures
- Execute penetration tests against staging infrastructure (with authorization)
- Read-only access to smart contract events and transaction logs (via blockchain explorer or direct RPC query)
- Export asset valuation history and NAV calculations (with source data references)
- Verify token supply against asset registry (on-chain verification via contract read functions)
- Access repayment distribution records (Gnosis Safe multisig transaction history)
- Query Industrial Gateway production proof hashes (verify existence via Industrial Gateway contract)
- Download compliance module configuration (transfer rules, jurisdiction restrictions, investor caps)
- Access SPV legal documents (offering memoranda, legal opinions, custody agreements)
- Verify invoice authenticity (debtor confirmation, payment status oracle data)
- Export investor cap tables for audit sampling (pseudonymized; identity resolution requires admin approval)

**Audit Trail Requirements:**
- All auditor queries logged with timestamp, auditor identity, and scope
- Query logs immutable (written to blockchain or append-only audit log)
- Auditor access time-bound (temporary credentials with expiration, max 90 days)
- All data exports watermarked with auditor identity and timestamp
- Annual audit certification required for credential renewal

**Document Access:**
- Legal opinions: Read-only, watermark applied
- SPV formation documents: Read-only, download permitted
- Custody agreements: Read-only, download permitted
- Offering memoranda: Full access for audit purposes

**Responsibilities:** Identify vulnerabilities, provide remediation recommendations, issue audit reports, verify fix implementation.

## 2.4 Investment Tiers (NEW)

### Tier 1: Retail Investor (<€100,000)

| Requirement | Specification |
|-------------|---------------|
| **KYC Level** | Standard KYC (Level 1 + Level 2) |
| **Documents** | National ID, proof of address, selfie |
| **Verification** | Automated (Smile Identity, YouVerify) |
| **Approval Time** | 24-48 hours |
| **Investment Limit** | <€100,000 (per pool/platform) |
| **Available Products** | Individual assets (Ujamaa Asset Token (UAT)), ERC-3643 NFTs |
| **Restricted Products** | Liquidity pools (uLP tokens) |

### Tier 2: Institutional Investor (≥€100,000)

| Requirement | Specification |
|-------------|---------------|
| **KYC Level** | Enhanced KYB (Know Your Business) |
| **Documents** | Corporate registration, UBO identification, source of funds, audited financials |
| **Verification** | Manual review + automated screening |
| **Approval Time** | 5-10 business days |
| **Investment Limit** | ≥€100,000 (no maximum) |
| **Available Products** | Liquidity pools (uLP tokens), individual assets (Ujamaa Asset Token (UAT)), ERC-3643 NFTs |
| **Restricted Products** | None |

### KYB Enhanced Due Diligence (Institutional Only)

| Check | Description |
|-------|-------------|
| **Corporate Verification** | Verify legal entity existence (registrar search) |
| **UBO Identification** | Identify all beneficial owners (>25% ownership) |
| **Source of Funds** | Bank statements, audited financials, investment mandate |
| **PEP Screening** | Politically Exposed Person check (all UBOs) |
| **Sanctions Screening** | OFAC, UN, EU, FATF lists |
| **Adverse Media** | Negative news search |
| **Financial Standing** | Minimum net worth, liquidity requirements |

### FX Risk Mitigation

**Strategy:** Ujamaa Euro (UJEUR)/EURR Primary Stablecoins with 2% Transaction Fee Margin

| Aspect | Specification |
|--------|---------------|
| **Primary Stablecoin** | **Ujamaa Euro (UJEUR) (euro-backed, 1 Ujamaa Euro (UJEUR) = €1.00)** ✅ |
| **Secondary Stablecoin** | **EURR (euro-backed for African markets)** ✅ |
| **Rationale** | **EUR/FCFA parity eliminates FX volatility** (1 EUR = 655.957 XOF fixed) |
| **Platform Risk Absorption** | **2% transaction fee margin covers FX fluctuations** ✅ |
| **Tertiary Stablecoins** | USDC, USDT (USD-backed, for international investors only) |
| **FX Hedge Mechanism** | Platform absorbs FX risk via fee margin (no pass-through to investors) |
| **Rebalancing** | Monthly FX exposure review, quarterly hedge adjustment |

**FX Risk Flow:**

```
Investor (EUR) → Ujamaa Euro (UJEUR) (1:1 parity) → Pool (Ujamaa Euro (UJEUR)-denominated)
                                          ↓
                                    Industrial (FCFA)
                                          ↓
                                    Repayment (Ujamaa Euro (UJEUR))
                                          ↓
                                    Investor (Ujamaa Euro (UJEUR) + yield)

FX Risk Absorption:
- Entry: EUR → Ujamaa Euro (UJEUR) (0% slippage, 1:1 parity)
- Deployment: Ujamaa Euro (UJEUR) → FCFA (2% fee margin covers conversion)
- Repayment: FCFA → Ujamaa Euro (UJEUR) (2% fee margin covers conversion)
- Exit: Ujamaa Euro (UJEUR) → EUR (0% slippage, 1:1 parity)

Platform absorbs FX risk via 2% transaction fee margin.
Investors receive Ujamaa Euro (UJEUR)-denominated returns (no FX exposure).
```

**Fee Structure (FX Risk Coverage):**

| Transaction Type | Fee | FX Risk Coverage |
|-----------------|-----|------------------|
| **Deposit (EUR → Ujamaa Euro (UJEUR))** | 0% | No FX risk (1:1 parity) |
| **Investment (Ujamaa Euro (UJEUR) → FCFA)** | 2% | Covers EUR/FCFA conversion risk |
| **Repayment (FCFA → Ujamaa Euro (UJEUR))** | 2% | Covers FCFA/EUR conversion risk |
| **Redemption (Ujamaa Euro (UJEUR) → EUR)** | 0% | No FX risk (1:1 parity) |
| **Total FX Coverage** | **4% round-trip** | **Fully hedged** |

**Ujamaa Euro (UJEUR) vs. USDC/USDT Comparison:**

| Stablecoin | Peg | FCFA Correlation | FX Risk (vs. FCFA) | Primary Use |
|------------|-----|------------------|-------------------|-------------|
| **Ujamaa Euro (UJEUR)** ✅ | EUR (1:1) | **Fixed (1 EUR = 655.957 XOF)** | **None** | **Primary (African markets)** |
| **EURR** ✅ | EUR (1:1) | **Fixed (1 EUR = 655.957 XOF)** | **None** | **Secondary (African markets)** |
| USDC | USD (1:1) | Floating (USD/XOF varies) | Medium (~3-5% annual) | International investors |
| USDT | USD (1:1) | Floating (USD/XOF varies) | Medium (~3-5% annual) | International investors |

**Why Ujamaa Euro (UJEUR)/EURR (Not USDC/USDT)?**

1. **EUR/FCFA Fixed Parity:** 1 EUR = 655.957 XOF (fixed since 1994, BCEAO guarantee)
2. **Zero FX Risk:** Ujamaa Euro (UJEUR) maintains 1:1 parity with FCFA (no fluctuation)
3. **Historical Stability:** EUR/FCFA rate unchanged for 30+ years
4. **African Market Fit:** Ujamaa Euro (UJEUR) aligns with UEMOA monetary zone (8 countries, 160M people)
5. **Platform Risk Absorption:** 2% fee margin covers any residual FX exposure

**Risk Mitigation Hierarchy:**

```
Level 1: Ujamaa Euro (UJEUR)/EURR Primary (Zero FX Risk)
  └─ EUR/FCFA fixed parity eliminates currency fluctuation
  
Level 2: 2% Transaction Fee Margin (Risk Buffer)
  └─ Platform absorbs FX risk via fee margin
  
Level 3: Monthly FX Exposure Review (Monitoring)
  └─ Treasury reviews FX exposure, adjusts hedges
  
Level 4: Quarterly Hedge Adjustment (Active Management)
  └─ Rebalance EUR/FCFA positions if needed
```

**Smart Contract Implementation:**

```solidity
// FX Risk Mitigation Constants
uint256 constant FX_FEE_BPS = 200;  // 2% fee for FX risk coverage
uint256 constant EURC_FCBF_PEG = 655957; // 1 EUR = 655.957 XOF (fixed)

// Fee Collection
function invest(uint256 amount) external {
    // 2% FX fee
    uint256 fxFee = (amount * FX_FEE_BPS) / 10000;
    uint256 netAmount = amount - fxFee;
    
    // Fee goes to platform treasury (FX risk buffer)
    Ujamaa Euro (UJEUR).transferFrom(msg.sender, treasury, fxFee);
    
    // Net amount deployed to industrial
    Ujamaa Euro (UJEUR).transferFrom(msg.sender, pool, netAmount);
}

// FX Fee Allocation
// - 50%: FX risk reserve (hedging buffer)
// - 30%: Platform operations
// - 20%: Insurance fund
```

**Compliance & Regulatory:**

| Requirement | Implementation |
|-------------|----------------|
| **BCEAO Compliance** | Ujamaa Euro (UJEUR)/FCFA parity maintained (UEMOA monetary zone) |
| **Circle Ujamaa Euro (UJEUR) Licensing** | Ujamaa Euro (UJEUR) issued by Circle (EU MiCA compliant) |
| **EURR Licensing** | EURR issued by African partner (local central bank licensed) |
| **FX Reporting** | Monthly FX exposure report to regulators |
| **Audit Trail** | All FX transactions logged on-chain |

## 2.5 Operating Environment

### Cloud Infrastructure
**Primary Deployment:** AWS (Amazon Web Services) with multi-region redundancy including African regions
- **Compute:** Amazon EKS (Elastic Kubernetes Service) for container orchestration
- **African Regions:** AWS Cape Town (af-south-1) for Southern Africa, AWS Bahrain (me-south-1) for North/West Africa connectivity
- **Storage:** Amazon RDS (PostgreSQL 15+), Amazon ElastiCache (Redis 7+), Amazon S3 (audit log archives)
- **Networking:** Amazon VPC with private subnets, NAT gateways, AWS WAF for DDoS protection
- **Secrets:** AWS KMS for key management, HashiCorp Vault for application secrets
- **Data Residency:** African user data stored in African regions where required by local data protection laws (South Africa POPIA, Nigeria NDPR)

**Secondary/DR Deployment:** Google Cloud Platform (GCP) or Azure for geographic redundancy
- GKE (Google Kubernetes Engine) or AKS (Azure Kubernetes Service)
- Cloud SQL for PostgreSQL, Memorystore for Redis
- Cross-cloud replication via Terraform-managed infrastructure
- **African Presence:** GCP Johannesburg, Azure South Africa North (Johannesburg), Azure South Africa West (Cape Town)

**African Cloud Providers (for Data Residency Compliance):**
- **Teraco Data Centres:** South Africa (Johannesburg, Cape Town) — neutral colocation, connected to all major African ISPs
- **MainOne:** West Africa (Nigeria, Ghana, Senegal) — Google-acquired, submarine cable connectivity
- **Liquid Web:** Pan-African cloud with presence in 10+ African countries
- **Dimension Data:** NTT-owned, African headquarters in Johannesburg, 20+ African countries

**On-Premise Option:** Available for institutional clients with data residency requirements
- Kubernetes on bare metal (RKE2 or K3s)
- PostgreSQL cluster with synchronous replication
- HSM integration (YubiHSM, Thales, Gemalto) for key management
- Air-gapped deployment option for classified environments
- **African Institutional Deployments:** Central banks, pension funds, sovereign wealth funds requiring on-premise deployment

### Operating Systems
**Server-Side:**
- Ubuntu Server 22.04 LTS (primary)
- Red Hat Enterprise Linux 9 (enterprise clients)
- Container base images: Alpine Linux 3.18 (minimal attack surface)

**Development:**
- macOS 13+ (Ventura or later)
- Windows 11 with WSL2 (Windows Subsystem for Linux)
- Ubuntu 22.04 LTS desktop
- **Mobile Development:** Android 10+ (dominant in African markets), iOS 15+ (high-net-worth users)

### Blockchain Node Requirements
**Ethereum Mainnet:**
- Full node: 8+ CPU cores, 32GB RAM, 2TB NVMe SSD, 1Gbps network
- Client: Geth 1.13+ or Erigon 2.50+ with archive state for historical queries
- Alternative: Infura, Alchemy, or QuickNode enterprise endpoints with SLA

**Polygon PoS:**
- Full node: 4+ CPU cores, 16GB RAM, 1TB NVMe SSD, 500Mbps network
- Client: Bor 1.0+ (Polygon's fork of Geth)
- Alternative: Polygon RPC endpoints with dedicated throughput

**African Node Deployment:**
- Nodes deployed in African data centers for low-latency access (Teraco, MainOne, Liquid Web)
- Connectivity via African submarine cables (WACS, SAT-3, EASSy, SEACOM)
- Backup connectivity via Starlink for remote areas (mining sites, agricultural cooperatives)

### Browser Support (React Frontend)
**Supported Browsers (last 2 major versions):**
- Google Chrome (Windows, macOS, Linux, Android, iOS) — dominant in African markets (>60% share)
- Mozilla Firefox (Windows, macOS, Linux, Android, iOS)
- Microsoft Edge (Windows, macOS)
- Safari (macOS, iOS) — significant in high-income segments
- Brave (Windows, macOS, Linux)
- **Opera Mini:** Feature phone and low-bandwidth mode support (significant in Nigeria, Kenya, Ghana)

**Mobile Optimization:**
- React frontend optimized for mobile devices (90%+ African internet traffic is mobile)
- Progressive Web App (PWA) for offline functionality
- Low-bandwidth mode (<500KB page load) for 2G/3G networks
- USSD gateway integration for feature phone users (M-Pesa, MTN, Airtel integration)

**Wallet Integration:**
- MetaMask (browser extension and mobile app)
- WalletConnect v2 (mobile wallet compatibility)
- Coinbase Wallet, Rainbow, Trust Wallet via WalletConnect
- **African Mobile Wallets:** M-Pesa integration (Kenya, Tanzania), MTN Mobile Money (West/East Africa), Airtel Money (Pan-African)

**Accessibility:** WCAG 2.1 AA compliance with screen reader support (NVDA, JAWS, VoiceOver), keyboard navigation, high contrast mode, and adjustable text sizing.

**Internationalization (i18n) Requirements:**
- **Supported Languages:** French (default), English
- **Default Language:** French — the platform SHALL load in French by default for all users on first visit
- **Language Switching:** Users MUST be able to switch between French and English via a prominent language selector in the header/navigation bar
- **Language Persistence:** User language preference MUST be persisted in localStorage and respected on subsequent visits
- **URL Localization:** Language prefix in URLs (e.g., `/fr/dashboard`, `/en/dashboard`) for SEO and shareability
- **Full Coverage:** All user-facing text including navigation, forms, buttons, error messages, notifications, legal documents, and email templates MUST be translated
- **Date/Number Formatting:** Dates, times, numbers, and currencies MUST follow locale-specific formatting (fr-FR for French, en-US/en-GB for English)
- **RTL Support:** Architecture MUST support future right-to-left (RTL) languages (Arabic) even if not initially implemented
- **Future Expansion:** i18n architecture SHALL support future addition of Portuguese, Arabic, Swahili, Hausa, Yoruba, Zulu, Afrikaans without code changes

## 2.6 Design Constraints

### ERC-3643 Compliance Constraints
- All token contracts MUST inherit from ERC-3643 T-REX reference implementation
- Transfer functions MUST validate identity claims before execution
- Identity Registry MUST be deployed and configured before any token minting
- Trusted Issuers Registry MUST contain at least one active Claim Issuer
- Compliance Module rules MUST be immutable after token issuance unless upgraded via governance

### Regulatory Constraints
- KYC/AML verification MUST precede any token acquisition
- Transfer restrictions MUST enforce jurisdiction-specific securities laws
- Transaction monitoring MUST flag suspicious patterns per FATF guidelines
- Audit logs MUST be retained for minimum 7 years (MiCA Article 22)
- PII MUST NEVER be stored on-chain; cryptographic erasure MUST be implemented for GDPR Article 17
- **African Regulatory Compliance:**
  - Nigeria: SEC Rules on Crowdfunding and Digital Assets, NDPR (Nigeria Data Protection Regulation)
  - South Africa: FAIS Act, POPIA (Protection of Personal Information Act), FSCA licensing
  - Kenya: Capital Markets Authority regulations, Data Protection Act 2019
  - Ghana: SEC Act 2016 (Act 929), Data Protection Act 2012 (Act 843)
  - Mauritius: FSC (Financial Services Commission) licensing, Data Protection Act 2017
  - AfCFTA: Cross-border trade reporting, rules of origin compliance
  - ESAAMLG: Eastern and Southern Africa Anti-Money Laundering Group standards
  - GIABA: West Africa Inter-Governmental Action Group against Money Laundering

### Immutability Constraints
- Smart contracts deployed to Ethereum/Polygon are immutable except via upgradeable proxy patterns
- Upgradeable proxies MUST implement timelock (minimum 48 hours) and multisig (minimum 3-of-5) governance
- ONCHAINID claims are immutable once issued; revocation is performed by Claim Issuer, not deletion
- Audit logs are append-only; modifications are prohibited except via cryptographically signed correction entries

### Gas Cost Constraints
- Primary user-facing operations (trading, transfers) SHOULD execute on Polygon to minimize gas costs
- High-value settlement operations (initial minting, treasury movements) MAY execute on Ethereum for maximum security
- Smart contract functions MUST be optimized for gas efficiency (target: <500,000 gas per transfer on Polygon)
- Batch operations MUST be supported for distributions to multiple recipients

### Open-Source License Constraints
- Platform code released under MIT License (permissive, commercial-friendly)
- Smart contracts MUST use OpenZeppelin Contracts (MIT/BSD-3-Clause)
- T-REX reference implementation licensed under MIT (Tokeny Solutions)
- All dependencies MUST have compatible licenses (no GPL/AGPL copyleft contamination)
- Third-party audits and security reports published under CC-BY-4.0

### Technology Stack Constraints
- Smart contracts MUST be written in Solidity 0.8.20+ (no Vyper, no Yul except for optimization)
- Smart contract development MUST use ApeWorX framework (no Hardhat, no Truffle)
- Backend services MUST use Python 3.11+ with FastAPI (no Django, no Flask for APIs)
- Frontend MUST use React 19+ with TypeScript (no Vue, no Angular, no Svelte)
- Database MUST be PostgreSQL 15+ (no MySQL, no MongoDB for primary data)

### Internationalization (i18n) Constraints
- **Default Language:** French MUST be the default language for all user-facing interfaces
- **Supported Languages:** French and English MUST be fully supported at launch
- **i18n Framework:** Frontend MUST use react-i18next with i18next for all translations
- **No Hardcoded Strings:** All user-facing text MUST be externalized to translation files (no hardcoded strings in components)
- **Translation Key Convention:** Hierarchical dot-notation keys MUST be used (e.g., `common.buttons.submit`, `marketplace.assets.table.header`)
- **Locale Formatting:** All dates, times, numbers, and currencies MUST use locale-aware formatting (Intl API or date-fns with locale)
- **Language Persistence:** User language preference MUST persist across sessions via localStorage
- **URL Structure:** All routes MUST include language prefix (`/fr/*`, `/en/*`) for SEO and shareability
- **Backend API:** Backend MUST support `Accept-Language` header for localized error messages and responses
- **Email Templates:** All email templates MUST support both French and English with user preference stored in database
- **Legal Documents:** Terms of Service, Privacy Policy, and offering documents MUST be available in both French and English
- **Professional Translation:** All French and English translations MUST be professionally reviewed (no machine-only translation for production)
- **Accessibility:** Language attribute MUST be set on HTML element (`lang="fr"` or `lang="en"`) for screen reader compatibility

## 2.7 Assumptions and Dependencies

The following assumptions and dependencies are critical to platform success. Failure of any assumption requires architectural review and potential redesign.

1. **Tokeny T-REX Library Availability** — The ERC-3643 T-REX reference implementation (smart contracts, Identity Registry, Compliance Module) remains publicly available and maintained. Platform development assumes T-REX v3.0+ with ONCHAINID v2 integration.

2. **ONCHAINID Infrastructure** — Decentralized identity infrastructure (Claim Issuers, Identity Registry contracts) remains operational. Platform assumes at least three geographically distributed Claim Issuers for redundancy.

3. **Chainlink Feed Availability** — Chainlink price feeds remain available on both Ethereum and Polygon networks. Platform assumes feeds for major assets (ETH, MATIC, USDC, USDT, BTC) with <1% deviation threshold and <1-minute update latency.

4. **Ethereum Network Stability** — Ethereum mainnet maintains proof-of-stake consensus with <5% annual validator churn. No hard forks breaking ERC-3643 compatibility occur during platform lifetime.

5. **Polygon Network Stability** — Polygon PoS chain maintains operational continuity with <1 hour annual downtime. Bridge contracts between Ethereum and Polygon remain secure and operational.

6. **React Ecosystem Stability** — React 19+ remains the dominant frontend framework with long-term support. No breaking changes to hooks, concurrent rendering, or TypeScript integration occur.

7. **FastAPI Long-Term Support** — FastAPI remains actively maintained with Python 3.11+ compatibility. No framework-level breaking changes affecting async/await patterns.

8. **PostgreSQL Scalability** — PostgreSQL 15+ supports horizontal scaling via Citus or logical replication for read replicas. Partitioning handles tables exceeding 100 million rows.

9. **Kubernetes Portability** — Kubernetes API remains stable across versions 1.26–1.30. Helm charts and operators remain compatible without major rewrites.

10. **HashiCorp Vault Availability** — Vault remains available for secrets management with HSM integration. No licensing changes restricting open-source usage.

11. **Gnosis Safe Protocol Stability** — Gnosis Safe smart contracts and SDK remain maintained. Multi-signature functionality remains compatible with ERC-3643 token transfers.

12. **Stablecoin Regulatory Clarity** — USDC and USDT maintain regulatory compliance status in key jurisdictions (US, EU, UK). No depegging events exceeding 5% occur.

13. **Machine Learning Framework Stability** — PyTorch 2.0+, TensorFlow 2.15+, and Scikit-learn 1.3+ remain compatible with Python 3.11+. No breaking API changes.

14. **Cross-Chain Bridge Security** — Ethereum-Polygon bridge maintains security without exploits. Alternative bridge providers (LayerZero, Wormhole) available as fallback.

15. **Regulatory Environment Stability** — MiCA implementation timeline remains as scheduled (2024–2026). No retroactive prohibitions on ERC-3643 security tokens in EU or US markets.

16. **African Mobile Money Integration** — M-Pesa, MTN Mobile Money, and Airtel Money APIs remain available and stable. Mobile money providers maintain >99% uLPime for transaction processing.

17. **African National ID Integration** — National ID systems (Nigeria NIN, Kenya Huduma Namba, Ghana Card, South Africa ID) remain accessible via API for KYC verification. Data protection laws permit cross-border identity verification for securities trading.

18. **PAPSS Availability** — Pan-African Payment and Settlement System (PAPSS) remains operational for cross-border African transactions. Settlement finality <48 hours as per AfCFTA protocols.

19. **African Data Center Capacity** — African data centers (Teraco, MainOne, Liquid Web, Dimension Data) maintain sufficient capacity and connectivity. Submarine cable infrastructure (WACS, SAT-3, EASSy, SEACOM) remains operational with redundancy.

20. **African Securities Commission Licensing** — Platform can obtain necessary licenses from African securities commissions (SEC Nigeria, CMA Kenya, SEC Ghana, FSC Mauritius, FSCA South Africa) within 12-18 months. No retroactive prohibitions on tokenized securities.

21. **African Foreign Exchange Regulations** — Cross-border capital flows remain permitted under African central bank regulations (CBN, SARB, CBK, Bank of Ghana). No new capital controls restricting repatriation of investment proceeds.

22. **African Tax Treaty Network** — Double taxation avoidance agreements between African countries remain in effect. Withholding tax rates remain stable (<15% for dividends/interest).

23. **African Internet Connectivity** — Internet penetration in Africa continues to grow (>50% by 2030). Mobile network coverage (3G/4G/5G) expands to rural areas. Starlink and other LEO satellite providers maintain service availability.

24. **African Stablecoin Regulation** — African central banks (CBN, SARB, CBK, Bank of Ghana) maintain favorable or neutral stance on USD-pegged stablecoins (USDC, USDT). No prohibitions on stablecoin use for securities trading.

25. **African Claim Issuer Availability** — Licensed KYC/AML providers (Youverify, Smile Identity, Dojah) maintain operational status and regulatory approval as ONCHAINID Claim Issuers in African jurisdictions.

26. **UEMOA Regulatory Stability** — AMF-UEMOA maintains favorable stance on tokenized securities. No retroactive prohibitions on digital asset service providers in UEMOA member states (Benin, Burkina Faso, Côte d'Ivoire, Guinea-Bissau, Mali, Niger, Senegal, Togo).

27. **BCEAO Foreign Exchange Regulations** — BCEAO maintains current foreign exchange reporting requirements. No new capital controls restricting cross-border investment within UEMOA or repatriation of proceeds.

28. **BRVM Integration Feasibility** — BRVM (Bourse Régionale des Valeurs Mobilières) remains open to dual-listing of tokenized securities. Technical integration between blockchain settlement and BRVM clearing remains feasible.

29. **OHADA Legal Recognition** — OHADA Uniform Act on Commercial Companies continues to recognize digital securities and electronic share registers across 17 member states.

30. **West African Data Protection Harmonization** — UEMOA member states maintain harmonized data protection standards. Cross-border data transfers within UEMOA remain permitted under adequacy framework (APDP Benin, APDP Côte d'Ivoire, CDP Senegal).

31. **Gateway/Chainlink Stability** — Chainlink Gateway nodes remain operational with >99.9% uLPime. No prolonged outages affecting price feed availability.

32. **Gateway Security** — No successful attacks on Chainlink Gateway infrastructure. Gateway operator keys remain secure.

---

# 3. System Features (EPICs and User Stories)

## 3.1 Requirements Traceability Matrix (RTM) 🆕

**Purpose:** This matrix provides traceability from Functional Requirements (FR) → User Stories → Acceptance Criteria → Test Conditions. All requirements SHALL use "SHALL" for mandatory, "SHOULD" for recommended, "MAY" for optional (IEEE 830 standard).

### FR-001 to FR-010: Asset Tokenization (EPIC 1)

| FR ID | Requirement (Atomic, Testable) | User Story | Acceptance Criteria | Test Condition |
|-------|-------------------------------|------------|---------------------|----------------|
| **FR-001** | System SHALL allow Enterprise Partners to submit asset profiles with type, industry, and metadata | US-1.1 | AC-1.1.1 to AC-1.1.7 | TC-001: Submit valid asset profile → Asset created with status PENDING_COMPLIANCE |
| **FR-002** | System SHALL validate asset metadata against industry-specific templates before submission | US-1.1 | AC-1.1.4 | TC-002: Submit invalid metadata → Display validation errors, prevent submission |
| **FR-003** | System SHALL notarize asset data hashes via Industrial Gateway smart contract | US-1.2 | AC-1.2.3 | TC-003: Submit asset → Industrial Gateway emits AssetNotarized event with hash |
| **FR-004** | System SHALL deploy ERC-3643 fungible token contract with Identity Registry linked | US-1.1 | AC-1.1.1, AC-1.1.2 | TC-004: Deploy token → Identity Registry enforces transfer restrictions |
| **FR-005** | System SHALL deploy ERC-3643NFT contract for unique assets with ERC-721 base | US-1.2 | AC-1.2.1, AC-1.2.2 | TC-005: Mint NFT → Token ID linked to IPFS metadata hash |
| **FR-006** | System SHALL enforce jurisdiction whitelist at token subscription | US-1.3 | AC-1.3.1, AC-1.3.3 | TC-006: Investor from blocked jurisdiction → Subscription reverted |
| **FR-007** | System SHALL enforce investor caps (max 199 non-accredited for Reg D 506(b)) | US-1.3 | AC-1.3.2 | TC-007: 200th non-accredited investor → Subscription reverted |
| **FR-008** | System SHALL configure royalty mechanism (EIP-2981) for NFT secondary sales | US-1.2 | AC-1.2.5 | TC-008: NFT secondary sale → 2-5% royalty transferred to originator |
| **FR-009** | System SHALL display active compliance rules to investors before subscription | US-1.3 | AC-1.3.5 | TC-009: View asset page → Compliance rules visible |
| **FR-010** | System SHALL allow Compliance Officers to modify compliance rules via multisig | US-1.3 | AC-1.3.2, AC-1.3.4 | TC-010: Rule change proposed → 48-hour timelock → Multisig approval → Rule updated |

### FR-011 to FR-020: Smart Contracts (EPIC 2)

| FR ID | Requirement (Atomic, Testable) | User Story | Acceptance Criteria | Test Condition |
|-------|-------------------------------|------------|---------------------|----------------|
| **FR-011** | System SHALL deploy ERC-3643 tokens behind UUPS upgradeable proxy pattern | US-2.1 | AC-2.1.1, AC-2.1.2 | TC-011: Deploy proxy → Logic contract upgradeable via multisig |
| **FR-012** | System SHALL enforce 48-hour timelock for smart contract upgrades | US-2.1 | AC-2.1.3 | TC-012: Propose upgrade → Attempt execution before 48h → Reverted |
| **FR-013** | System SHALL provide emergency pause function accessible to 2-of-3 security multisig | US-2.1 | AC-2.1.4 | TC-013: Security multisig calls pause() → All transfers halted |
| **FR-014** | System SHALL distribute repayments pro-rata to token holders based on snapshot balance | US-2.2 | AC-2.2.2, AC-2.2.4 | TC-014: Originator deposits USDC → Holders receive pro-rata amounts |
| **FR-015** | System SHALL batch distribution payments (100 recipients per transaction) for gas efficiency | US-2.2 | AC-2.2.3 | TC-015: 500 holders → 5 batch transactions executed |
| **FR-016** | System SHALL queue failed payments for retry (max 3 retries) | US-2.2 | AC-2.2.4 | TC-016: Payment fails → Retried at 1h, 4h, 24h intervals |
| **FR-017** | System SHALL set token decimals to 18 for fine-grained fractional ownership | US-2.3 | AC-2.3.1 | TC-017: Token.decimals() returns 18 |
| **FR-018** | System SHALL enforce minimum share size (0.0001 tokens = $10 at $100K NAV) | US-2.3 | AC-2.3.2 | TC-018: Subscribe $5 → Reverted with "Below minimum share size" |
| **FR-019** | System SHALL provide cap table export for regulatory reporting (SEC Form D, MiCA Article 22) | US-2.3 | AC-2.3.4 | TC-019: Export cap table → CSV with investor addresses, balances, jurisdictions |
| **FR-020** | System SHALL implement voting rights proportional to token balance with snapshot mechanism | US-2.3 | AC-2.3.5 | TC-020: Create proposal → Snapshot taken → Votes weighted by balance at snapshot |

### FR-021 to FR-030: Oracle Integration (EPIC 3)

| FR ID | Requirement (Atomic, Testable) | User Story | Acceptance Criteria | Test Condition |
|-------|-------------------------------|------------|---------------------|----------------|
| **FR-021** | System SHALL consume Chainlink price feeds for ETH/USD, MATIC/USD, USDC/USD, USDT/USD | US-3.1 | AC-3.1.1 | TC-021: Query price feed → Returns current price within 5% of market |
| **FR-022** | System SHALL trigger price deviation alert if Chainlink price deviates >5% from secondary market | US-3.1 | AC-3.1.3 | TC-022: Simulate 6% deviation → Alert emitted to Compliance Officer dashboard |
| **FR-023** | System SHALL fallback to secondary oracle (Pyth, API3) if Chainlink stale >1 hour | US-3.1 | AC-3.1.4 | TC-023: Disable Chainlink → System switches to Pyth after 1 hour |
| **FR-024** | System SHALL verify ONCHAINID claim validity via Chainlink Functions without exposing PII | US-3.2 | AC-3.2.2, AC-3.2.3 | TC-024: Query KYC status → Returns boolean (true/false) only |
| **FR-025** | System SHALL cache KYC claim results for 24 hours to reduce query costs | US-3.2 | AC-3.2.4 | TC-025: Query same wallet twice within 24h → Second query served from cache |
| **FR-026** | System SHALL revert transaction if KYC claim expired | US-3.2 | AC-3.2.5 | TC-026: Transfer with expired KYC → Reverted with "Claim expired" |
| **FR-027** | System SHALL accept IoT sensor data via signed Gateway for asset monitoring | US-3.3 | AC-3.3.2 | TC-027: IoT device submits temperature → Data verified via signature |
| **FR-028** | System SHALL trigger smart contract event if IoT threshold breached (e.g., temp >40°C) | US-3.3 | AC-3.3.3 | TC-028: Temperature 41°C → AssetAlert event emitted |
| **FR-029** | System SHALL store IoT data in PostgreSQL with timestamp and device signature | US-3.3 | AC-3.3.4 | TC-029: Query IoT history → Returns signed data with timestamps |
| **FR-030** | System SHALL display real-time sensor readings on React dashboard with alert history | US-3.3 | AC-3.3.5 | TC-030: View asset page → Sensor readings visible, alerts listed |

### FR-031 to FR-040: Risk Assessment (EPIC 4)

| FR ID | Requirement (Atomic, Testable) | User Story | Acceptance Criteria | Test Condition |
|-------|-------------------------------|------------|---------------------|----------------|
| **FR-031** | System SHALL calculate risk scores (AAA to D) using quantitative model | US-4.1 | AC-4.1.1 | TC-031: Submit asset data → Risk score calculated within 5 seconds |
| **FR-032** | System SHALL evaluate financial strength, jurisdiction risk, asset class risk, operational metrics | US-4.1 | AC-4.1.2 | TC-032: Asset with weak financials → Lower score component |
| **FR-033** | System SHALL display risk rating in marketplace with methodology explanation | US-4.1 | AC-4.1.3 | TC-033: View asset page → Risk rating (e.g., "BBB") visible, methodology link |
| **FR-034** | System SHALL rebalance risk scores quarterly using latest financial data | US-4.1 | AC-4.1.4 | TC-034: Quarterly job runs → Risk scores updated for all assets |
| **FR-035** | System SHALL block investors from assets below their minimum risk rating | US-4.2 | AC-4.2.2 | TC-035: Conservative investor attempts high-risk asset → Subscription blocked |
| **FR-036** | System SHALL generate risk assessment report for regulatory filings | US-4.3 | AC-4.3.1 | TC-036: Export risk report → PDF with all asset ratings, methodology |

### FR-041 to FR-050: Payments & Treasury (EPIC 5)

| FR ID | Requirement (Atomic, Testable) | User Story | Acceptance Criteria | Test Condition |
|-------|-------------------------------|------------|---------------------|----------------|
| **FR-041** | System SHALL accept USDC/USDT subscriptions with compliance-gated transfers | US-5.1 | AC-5.1.1, AC-5.1.2 | TC-041: Unverified wallet attempts transfer → Reverted |
| **FR-042** | System SHALL validate stablecoin peg via Chainlink Proof of Reserve | US-5.1 | AC-5.1.3 | TC-042: USDC depegs >2% → Alert emitted, subscriptions paused |
| **FR-043** | System SHALL manage Gnosis Safe multisig with tiered approval thresholds | US-5.2 | AC-5.2.1 | TC-043: Withdrawal <$100K → 3-of-5 approval; >$1M → 5-of-5 approval |
| **FR-044** | System SHALL integrate Gnosis Safe SDK for programmatic transaction creation | US-5.3 | AC-5.3.1 | TC-044: Create transaction via SDK → Multisig approval flow initiated |
| **FR-045** | System SHALL batch distribution to 100 recipients per transaction for gas efficiency | US-5.4 | AC-5.4.2 | TC-045: 500 holders → 5 transactions executed |
| **FR-046** | System SHALL generate tax documents (1099-DIV equivalent) for investors | US-5.4 | AC-5.4.3 | TC-046: Download tax document → PDF with dividend amounts, withholding tax |

### FR-047 to FR-055: Marketplace (EPIC 6)

| FR ID | Requirement (Atomic, Testable) | User Story | Acceptance Criteria | Test Condition |
|-------|-------------------------------|------------|---------------------|----------------|
| **FR-047** | System SHALL display available assets with filtering by asset class, jurisdiction, risk rating | US-6.1 | AC-6.1.1, AC-6.1.2 | TC-047: Apply filters → Results match criteria |
| **FR-048** | System SHALL display asset details with risk rating, terms, documents | US-6.2 | AC-6.2.1 | TC-048: View asset page → All details visible |
| **FR-049** | System SHALL validate investor accreditation before allowing subscription | US-6.3 | AC-6.3.2 | TC-049: Non-accredited investor attempts private placement → Blocked |
| **FR-050** | System SHALL process subscription with ERC-3643 transfer and minting | US-6.3 | AC-6.3.3 | TC-050: Subscribe → Tokens minted, USDC transferred |
| **FR-051** | System SHALL display portfolio dashboard with holdings, performance, distributions | US-6.4 | AC-6.4.1 | TC-051: View portfolio → Holdings, IRR, MOIC visible |
| **FR-052** | System SHALL generate downloadable tax documents (PDF, CSV) | US-6.4 | AC-6.4.3 | TC-052: Download tax docs → PDF generated with correct data |

### FR-053 to FR-060: Fraud Detection (EPIC 7)

| FR ID | Requirement (Atomic, Testable) | User Story | Acceptance Criteria | Test Condition |
|-------|-------------------------------|------------|---------------------|----------------|
| **FR-053** | System SHALL score transactions for fraud risk using Scikit-learn Isolation Forest | US-7.1 | AC-7.1.1 | TC-053: Submit transaction → Risk score (0-1) attached |
| **FR-054** | System SHALL detect wash trading patterns using PyTorch LSTM | US-7.2 | AC-7.2.2 | TC-054: Simulate circular trading → Alert generated |
| **FR-055** | System SHALL detect structuring (transactions just below reporting threshold) | US-7.3 | AC-7.3.2 | TC-055: 9 transactions of $9,900 → Alert generated |
| **FR-056** | System SHALL block high-risk transactions pending Compliance Officer review | US-7.4 | AC-7.4.2 | TC-056: Risk score >0.8 → Transaction queued, investor notified |
| **FR-057** | System SHALL provide Compliance Officer dashboard for alert review and resolution | US-7.4 | AC-7.4.3 | TC-057: View alert queue → Approve/Block buttons functional |

### FR-058 to FR-065: Reporting (EPIC 8)

| FR ID | Requirement (Atomic, Testable) | User Story | Acceptance Criteria | Test Condition |
|-------|-------------------------------|------------|---------------------|----------------|
| **FR-058** | System SHALL generate MiCA Article 22 reports (transaction log, investor register, AML alerts) | US-8.1 | AC-8.1.4 | TC-058: Generate MiCA report → CSV, PDF exported |
| **FR-059** | System SHALL generate FATF Travel Rule reports for transfers >$1,000 | US-8.1 | AC-8.1.4 | TC-059: Generate Travel Rule report → XML with originator/beneficiary info |
| **FR-060** | System SHALL provide Compliance Officer dashboard with real-time AML/KYC metrics | US-8.2 | AC-8.2.1 | TC-060: View dashboard → KYC completion rate, flagged transactions visible |
| **FR-061** | System SHALL provide Regulator Portal with read-only access via SSO (SAML/OIDC) | US-8.3 | AC-8.3.1 | TC-061: Regulator logs in → Read-only access granted |
| **FR-062** | System SHALL export data in XBRL format for SEC EDGAR compatibility | US-8.3 | AC-8.3.4 | TC-062: Export → XBRL file generated, validates against SEC schema |

### FR-063 to FR-070: Security & Scalability (EPIC 9)

| FR ID | Requirement (Atomic, Testable) | User Story | Acceptance Criteria | Test Condition |
|-------|-------------------------------|------------|---------------------|----------------|
| **FR-063** | System SHALL execute CI/CD pipeline on pull request (lint, test, security scan, build, deploy) | US-9.1 | AC-9.1.1, AC-9.1.2 | TC-063: Open PR → Pipeline runs, status checks pass/fail |
| **FR-064** | System SHALL enforce code coverage >90% for Python, >95% for smart contracts | US-9.1 | AC-9.1.2 | TC-064: Coverage <90% → Pipeline fails |
| **FR-065** | System SHALL autoscale Kubernetes pods based on CPU (70%), memory (80%), requests/sec | US-9.2 | AC-9.2.1, AC-9.2.2 | TC-065: Load test → Pods scale from 3 to 20 |
| **FR-066** | System SHALL define all infrastructure in Terraform with state locking | US-9.3 | AC-9.3.1, AC-9.3.4 | TC-066: Run terraform apply → Infrastructure provisioned, state locked in S3 |
| **FR-067** | System SHALL detect infrastructure drift and alert on manual changes | US-9.3 | AC-9.3.5 | TC-067: Manual change to security group → Alert in Slack |

### FR-068 to FR-080: Liquidity Pool & uLP (EPIC 10)

| FR ID | Requirement (Atomic, Testable) | User Story | Acceptance Criteria | Test Condition |
|-------|-------------------------------|------------|---------------------|----------------|
| **FR-068** | System SHALL mint Ujamaa Pool Token (uLP) as yield-bearing ERC-3643 fungible token | US-10.1 | AC-10.1.1, AC-10.1.2 | TC-068: Deposit UJEUR → uLP minted at current NAV |
| **FR-069** | System SHALL enforce minimum deposit €100,000 for uLP (smart contract level) | US-10.1 | AC-10.1.6 | TC-069: Deposit €50,000 → Reverted with "Below minimum" |
| **FR-070** | System SHALL calculate NAV per share = Total Pool Value / Total uLP Shares | US-10.1 | AC-10.1.4 | TC-070: Query NAV → Returns correct value |
| **FR-071** | System SHALL allow uLP redemption for UJEUR at current NAV (instant, no lock-up) | US-10.2 | AC-10.2.1, AC-10.2.3 | TC-071: Redeem uLP → UJEUR transferred, tokens burned |
| **FR-072** | System SHALL generate transaction receipt with yield breakdown (principal vs. yield) | US-10.2 | AC-10.2.4 | TC-072: View receipt → Principal €100K, Yield €5K displayed |
| **FR-073** | System SHALL track tax lots (acquisition date, cost basis, holding period) | US-10.2 | AC-10.2.5 | TC-073: Export tax lots → CSV with acquisition dates, cost basis |
| **FR-074** | System SHALL create liquidity pools by family (Industrie, Agriculture, Trade Finance, Renewable Energy, Real Estate) | US-10.3 | AC-10.3.1 | TC-074: Create pool → Pool family selected, config applied |
| **FR-075** | System SHALL enforce diversification limits (max 20% per industrial, max 40% per asset class) | US-10.3 | AC-10.3.5 | TC-075: Deploy >20% to single industrial → Reverted |
| **FR-076** | System SHALL display pool statistics (TVL, deployed %, available) | US-10.3 | AC-10.3.4 | TC-076: View pool page → TVL, deployed %, available displayed |
| **FR-077** | System SHALL accrue yield automatically via NAV increase (no minting new tokens) | US-10.4 | AC-10.4.2 | TC-077: Industrial repays → NAV increases, token balance unchanged |
| **FR-078** | System SHALL display historical NAV chart for performance tracking | US-10.4 | AC-10.4.4 | TC-078: View pool page → NAV chart (30d, 90d, 1y, all) visible |
| **FR-079** | System SHALL generate yield statements (PDF download) for investors | US-10.4 | AC-10.4.5 | TC-079: Download yield statement → PDF with yield amounts, dates |
| **FR-080** | System SHALL integrate BIIC/MCB bank escrow for investor funds (production only) | US-10.5 | AC-10.5.1, AC-10.5.2 | TC-080: Wire transfer initiated → Escrow balance updated |

### FR-081 to FR-085: Auditability (EPIC 10.11)

| FR ID | Requirement (Atomic, Testable) | User Story | Acceptance Criteria | Test Condition |
|-------|-------------------------------|------------|---------------------|----------------|
| **FR-081** | System SHALL write all actions to immutable audit log with cryptographic hash chaining | US-10.11.1 | AC-10.11.1.1, AC-10.11.1.2 | TC-081: Perform action → Audit log entry with hash chain |
| **FR-082** | System SHALL anchor daily audit log Merkle root to Polygon blockchain | US-10.11.1 | AC-10.11.1.4 | TC-082: Daily job runs → Merkle root anchored, tx hash recorded |
| **FR-083** | System SHALL provide identity resolution (wallet → verified name) for Compliance Officers | US-10.11.2 | AC-10.11.2.2, AC-10.11.2.3 | TC-083: Query wallet → Identity resolved (MFA required) |
| **FR-084** | System SHALL generate beneficial ownership reports for regulators | US-10.11.2 | AC-10.11.2.4 | TC-084: Generate report → CSV with token holders, verified names |
| **FR-085** | System SHALL export compliance reports in regulator-specified formats (PDF, CSV, XBRL, XML) | US-10.11.3 | AC-10.11.3.3 | TC-085: Export report → Format selected, file generated |

## 3.2 Notification Requirements 🆕 (AUDIT-010)

**Purpose:** This section defines notification triggers, channels, recipients, and content format for all critical platform events.

### Notification Matrix

| Event | Trigger | Recipient | Channel | Content Template | SLA |
|-------|---------|-----------|---------|------------------|-----|
| **Yield Accrual** | Daily 00:00 UTC | uLP holders | Email | "Your €{AMOUNT} position earned €{YIELD} yield yesterday ({APY} APY)" | T+0 |
| **Redemption Complete** | On-chain confirmation | Redeemer | Email + In-App | "€{TOTAL} redeemed. €{PRINCIPAL} principal + €{YIELD} yield transferred to {VAULT} [TX: {TX_HASH}]" | T+0 |
| **Redemption Queued** | Pool liquidity <10% | Redeemer | Email + SMS | "Your €{AMOUNT} redemption is queued. Expected processing: 24-48 hours due to high demand" | T+0 |
| **KYC Expiry Warning** | 30 days before expiry | Investor | Email + SMS | "KYC expires in {DAYS} days. Renew now to avoid trading restrictions. [Link]" | T+0 |
| **KYC Expired** | On expiry date | Investor | Email + SMS + In-App | "KYC expired. Trading suspended. Renew immediately to restore access" | T+0 |
| **Pool Utilization High** | >90% deployed | Pool Manager, Compliance Officer | In-App + Email | "Pool {POOL_NAME} is {UTILIZATION}% deployed. €{AVAILABLE} available for new financings" | T+1 hour |
| **Default Event** | Payment oracle reports 90+ days overdue | uLP holders, Compliance Officer | Email | "{INDUSTRIAL_NAME} is 90 days overdue. €{AMOUNT} at risk. Liquidation process initiated" | T+0 |
| **Large Transaction** | >€100,000 | Compliance Officer | In-App + Email | "Large transaction detected: €{AMOUNT} from {WALLET}. Risk score: {RISK_SCORE}" | T+5 minutes |
| **Fraud Alert** | Risk score >0.8 | Compliance Officer | In-App + SMS + Email | "HIGH RISK: Transaction {TX_HASH} flagged ({RISK_SCORE}). Review required" | T+0 |
| **System Incident** | P1/P2 alert triggered | All users (affected) | In-App + Status Page | "Service disruption: {SERVICE}. Estimated resolution: {ETA}. [Status Page Link]" | T+15 minutes |
| **Scheduled Maintenance** | 48 hours before | All users | Email + In-App | "Scheduled maintenance: {DATE} {TIME}-{END_TIME}. Expected downtime: {DURATION}" | T+0 |
| **Smart Contract Upgrade** | 48 hours before (timelock) | All users | Email + In-App | "Smart contract upgrade scheduled for {DATE}. No action required" | T+0 |
| **Regulatory Hold** | Compliance Officer places hold | Affected Investor | Email + In-App | "Account under regulatory review. Contact compliance@ujamaa.fi. Reference: {CASE_ID}" | T+0 |
| **Fireblocks Unavailable** | >5 minutes downtime | Treasury Team, DevOps | PagerDuty + Slack | "CRITICAL: Fireblocks API unavailable. Deposits/redemptions paused" | T+0 |
| **Bank Integration Failure** | Wire transfer failure | Treasury Team | Email + Slack | "Wire transfer {TRANSFER_ID} failed: {ERROR_CODE}. Manual intervention required" | T+5 minutes |

### Notification Channel Specifications

| Channel | Provider | Format | Rate Limit | Opt-Out |
|---------|----------|--------|------------|---------|
| **Email** | SendGrid / AWS SES | HTML + Plain text fallback | 100 emails/hour per user | Unsubscribe link (non-critical only) |
| **SMS** | Twilio / Africa's Talking | Plain text, max 160 chars | 10 SMS/hour per user | Reply STOP (non-critical only) |
| **In-App** | WebSocket push | JSON with title, body, action | Real-time | User settings (non-critical only) |
| **PagerDuty** | PagerDuty API | Incident alert | Real-time | N/A (internal only) |
| **Slack** | Slack Webhook | Markdown | Real-time | N/A (internal only) |

### Notification Preferences

Users MAY configure notification preferences (except critical regulatory/security notifications):
```json
{
  "email_yield_reports": true,
  "email_marketing": false,
  "sms_kyc_expiry": true,
  "sms_transaction_alerts": false,
  "in_app_portfolio_updates": true,
  "push_price_alerts": false
}
```

## 3.3 Error States Specification 🆕 (AUDIT-009, AUDIT-065)

**Purpose:** This section defines error states, error messages, and error handling for all user-facing features.

### Error Message Format

All error messages SHALL follow this structure:
- **Problem:** What went wrong (clear, non-technical)
- **Cause:** Why it happened (if known)
- **Solution:** What the user can do to resolve

**Example:**
- ❌ Bad: "Insufficient balance"
- ✅ Good: "Your balance (€50,000) is below the minimum deposit (€100,000). Please add funds or reduce deposit amount."

### Error States by Feature

#### Deposit Flow (uLP)

| Error Condition | Error Message | UI Action |
|-----------------|---------------|-----------|
| Balance < minimum | "Your balance (€{BALANCE}) is below the minimum deposit (€100,000). Please add funds or reduce deposit amount." | Disable "Confirm" button, show "Add Funds" CTA |
| KYC expired | "KYC expired. Please renew your identity verification before depositing." | Redirect to KYC renewal flow |
| Pool paused | "Deposits to {POOL_NAME} are temporarily paused. Contact support for assistance." | Show support contact, disable deposit |
| Fireblocks unavailable | "Custody service temporarily unavailable. Please try again in 5 minutes." | Retry button, show status page link |
| Smart contract revert | "Transaction failed: {REVERT_REASON}. Gas refunded. Please contact support if issue persists." | Show revert reason, support link |
| Network failure | "Network error. Please check your connection and try again." | Retry button |
| Slippage too high | "Price impact too high ({SLIPPAGE}%). Try a smaller amount or try again later." | Show slippage warning, reduce amount suggestion |

#### Redemption Flow (uLP)

| Error Condition | Error Message | UI Action |
|-----------------|---------------|-----------|
| Insufficient pool liquidity | "Pool liquidity is low. Your redemption is queued. Expected processing: 24-48 hours." | Show queue position, email confirmation |
| Redemption paused | "Redemptions are temporarily paused due to {REASON}. Contact support for assistance." | Show support contact, estimated resume time |
| Amount exceeds balance | "You are trying to redeem {AMOUNT} uLP but your balance is {BALANCE} uLP." | Auto-correct to max balance, show warning |
| Gas estimation failed | "Gas estimation failed. Please try again or contact support." | Retry button, support link |

#### KYC/KYB Flow

| Error Condition | Error Message | UI Action |
|-----------------|---------------|-----------|
| Document upload failed | "File upload failed. Ensure file is PDF format and under 10MB." | Show file requirements, retry upload |
| Document verification failed | "Document could not be verified. Please upload a clearer image or different document." | Show accepted document types, retry |
| Sanctions match | "Your name matches a sanctions list entry. Please contact compliance@ujamaa.fi for review." | Block submission, show compliance contact |
| PEP detected | "Politically Exposed Person (PEP) detected. Enhanced due diligence required. Expect 5-10 business days for approval." | Show timeline, submit for manual review |

### Global Error Handling

| Error Type | Handler | User Message | Logging |
|------------|---------|--------------|---------|
| **400 Bad Request** | Frontend validation | "Invalid input. Please check the highlighted fields." | Log validation errors |
| **401 Unauthorized** | Auth middleware | "Session expired. Please log in again." | Log logout, redirect to login |
| **403 Forbidden** | RBAC middleware | "You don't have permission to access this resource." | Log unauthorized access attempt |
| **404 Not Found** | Router | "Page not found. The link may be broken or the page moved." | Log 404 path, referrer |
| **429 Too Many Requests** | Rate limiter | "Too many requests. Please wait {RETRY_AFTER} seconds." | Log rate limit hit |
| **500 Internal Server Error** | Global error handler | "Something went wrong. Our team has been notified. Please try again later." | Log full stack trace, alert DevOps |
| **503 Service Unavailable** | Load balancer | "Service temporarily unavailable. Please try again in 5 minutes." | Log downtime, alert DevOps |

## 3.4 Rate Limiting Specification 🆕 (AUDIT-015)

**Purpose:** This section defines API rate limits, user-level throttling, and DDoS protection thresholds.

### API Rate Limits

| Endpoint Category | Limit (per minute) | Limit (per hour) | Scope |
|-------------------|-------------------|------------------|-------|
| **Public API (unauthenticated)** | 60 requests | 1,000 requests | Per IP address |
| **Authenticated API (standard)** | 300 requests | 5,000 requests | Per user |
| **Sensitive Endpoints:** | | | |
| - POST /api/v1/deposit | 10 requests | 50 requests | Per user |
| - POST /api/v1/redeem | 10 requests | 50 requests | Per user |
| - POST /api/v1/kyc/submit | 3 requests | 10 requests | Per user |
| - GET /api/v1/pii/* | 5 requests | 20 requests | Per user |
| **WebSocket Connections** | 5 connections | N/A | Per user |
| **WebSocket Messages** | 10 messages/second | N/A | Per connection |

### Smart Contract Rate Limits

| Operation | Limit | Scope | Enforcement |
|-----------|-------|-------|-------------|
| Token transfers | 100 transfers/wallet/day | Per wallet | Smart contract |
| uLP redemption | €1M/wallet/day | Per wallet | Smart contract |
| Pool deposit | €10M/wallet/day | Per wallet | Smart contract |

### DDoS Protection

| Layer | Threshold | Action |
|-------|-----------|--------|
| **AWS WAF** | 1,000 requests/second per IP | Block IP for 1 hour |
| **Cloudflare** | 10,000 requests/second per IP | JS challenge, CAPTCHA |
| **API Gateway** | 100 requests/second per user | Return 429 Too Many Requests |
| **Database** | 1,000 connections | Queue excess, return 503 |

### Rate Limit Headers

All API responses SHALL include rate limit headers:
```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 250
X-RateLimit-Reset: 1711382460
Retry-After: 60  (on 429 response)
```

## 3.5 Modal Verb Standard (IEEE 830) 🆕

All requirements in this document SHALL use the following modal verbs consistently:

| Modal Verb | Meaning | Usage |
|------------|---------|-------|
| **SHALL** | Mandatory requirement | Testable, enforceable, no exceptions |
| **SHOULD** | Recommended requirement | May have exceptions with justification |
| **MAY** | Optional feature | Discretionary implementation |
| **WILL** | Future capability (not a requirement) | Avoid in requirements; use "SHALL" instead |
| **MUST** | External constraint | Avoid; use "SHALL" for requirements |

**Note:** All instances of "WILL" and "MUST" in requirements SHALL be replaced with "SHALL" for consistency.

---

## EPIC 1: Asset Tokenization (ERC-3643 Fungible + ERC-3643 NFT)

**Description:**
This EPIC enables Asset Originators to tokenize real-world assets as either fungible ERC-3643 tokens (representing fractional shares in securitized pools) or ERC-3643 NFTs (representing unique assets with supply=1). All tokens inherit compliance features from the T-REX protocol including on-chain identity verification, transfer restrictions, and regulatory rule enforcement. The tokenization layer supports both Ethereum (for high-value settlement) and Polygon (for low-cost issuance and trading).

**Priority:** Must Have

### User Story 1.1: Fungible Token Creation
**As an** Asset Originator,
**I want** to create ERC-3643 fungible tokens representing shares in a securitized asset pool,
**So that** I can raise capital from verified investors while maintaining regulatory compliance.

**Acceptance Criteria:**
- [ ] Token contract deploys successfully to Ethereum or Polygon with ERC-3643 compliance
- [ ] Identity Registry is linked and enforces transfer restrictions from deployment
- [ ] Compliance Module configured with investor caps (max 199 investors for Reg D 506(b) or unlimited for 506(c))
- [ ] Jurisdiction whitelist restricts token holders to permitted countries
- [ ] Minimum investment amount enforced at subscription (e.g., $10,000 for accredited investors)
- [ ] Token metadata includes legal documentation hash (offering memorandum, term sheet)
- [ ] Gas cost for deployment < 5,000,000 gas on Ethereum, < 2,000,000 gas on Polygon

### User Story 1.2: NFT Creation for Unique Assets
**As an** Asset Originator,
**I want** to mint ERC-3643 NFTs representing unique assets like real estate deeds or artwork,
**So that** I can tokenize indivisible assets while maintaining compliance and provenance tracking.

**Acceptance Criteria:**
- [ ] NFT contract deploys with ERC-721 base functionality + ERC-3643 compliance module
- [ ] Each NFT has supply=1 and unique token ID linked to asset metadata
- [ ] Asset metadata stored on IPFS/Arweave with cryptographic hash recorded on-chain
- [ ] Transfer restrictions prevent sale to unverified wallets
- [ ] Royalty mechanism (EIP-2981) configured for secondary sale fees (2–5%)
- [ ] NFT can be fractionalized via separate ERC-3643 fungible token if originator elects

### User Story 1.3: Compliance Rule Configuration
**As a** Compliance Officer,
**I want** to configure and modify compliance rules for each tokenized asset,
**So that** I can adapt to changing regulatory requirements without redeploying contracts.

**Acceptance Criteria:**
- [ ] Compliance rules (jurisdiction whitelist, investor caps, lock-up periods) configurable via admin dashboard
- [ ] Rule changes require multisig approval (3-of-5) with 48-hour timelock
- [ ] Existing token holders grandfathered under old rules; new subscriptions follow updated rules
- [ ] Rule change events logged to immutable audit trail with timestamp and approver identities
- [ ] React UI displays active compliance rules to investors before subscription

---

## EPIC 2: Smart Contracts for Securitization

**Description:**
This EPIC implements the core smart contract infrastructure for securitization operations using the T-REX protocol. It includes upgradeable proxy contracts for security patches, automated repayment distribution logic, fractional ownership management, and compliance enforcement at the contract level. All contracts are developed using ApeWorX framework with OpenZeppelin libraries and undergo third-party security audits before deployment.

**Priority:** Must Have

### User Story 2.1: Upgradeable Proxy Deployment
**As a** Smart Contract Developer,
**I want** to deploy ERC-3643 tokens behind upgradeable proxy patterns,
**So that** I can apply security patches and compliance updates without migrating token holders.

**Acceptance Criteria:**
- [ ] Proxy pattern implemented (UUPS or EIP-2535 Diamond) with separation of storage and logic
- [ ] Upgrade function restricted to multisig governance (3-of-5 signers)
- [ ] Timelock contract enforces 48-hour delay between upgrade proposal and execution
- [ ] Emergency pause function accessible to designated security multisig (2-of-3)
- [ ] Upgrade events emitted with previous/new implementation addresses for audit trail
- [ ] ApeWorX deployment scripts include upgrade simulation in forked mainnet environment

### User Story 2.2: Automated Repayment Distribution
**As an** Asset Originator,
**I want** smart contracts to automatically distribute cash flows to token holders,
**So that** investors receive timely payments without manual intervention.

**Acceptance Criteria:**
- [ ] Repayment function accepts USDC/USDT from originator wallet or Gnosis Safe
- [ ] Distribution calculated pro-rata based on token balance at snapshot block
- [ ] Payments executed in batches of 100 recipients to manage gas costs
- [ ] Failed payments (insufficient gas, reverted transfer) queued for retry
- [ ] Distribution events include recipient address, amount, token snapshot block, and transaction hash
- [ ] React dashboard displays distribution history with exportable CSV for tax reporting

### User Story 2.3: Fractional Ownership Management
**As an** Investor,
**I want** to own fractional shares of tokenized assets with clear provenance,
**So that** I can invest in high-value assets with limited capital.

**Acceptance Criteria:**
- [ ] Token decimals set appropriately (e.g., 18 decimals for fine-grained ownership)
- [ ] Minimum share size enforced (e.g., 0.0001 tokens = $10 at $100,000 NAV)
- [ ] Ownership history queryable via GraphQL subgraph or FastAPI endpoint
- [ ] Cap table exportable for regulatory reporting (SEC Form D, MiCA Article 22)
- [ ] Voting rights (if applicable) proportional to token balance with snapshot mechanism

---

## EPIC 3: Gateway Integration

**Description:**
This EPIC integrates Chainlink Gateways for real-time asset pricing, proof-of-reserves verification, and off-chain computation. Gateways provide critical data for NAV calculation, collateralization monitoring, and automated compliance checks. The system includes fallback mechanisms for Gateway failures and deviation thresholds to prevent manipulation.

**Priority:** Must Have

### User Story 3.1: Price Feed Integration
**As a** Compliance Officer,
**I want** real-time price feeds for all tokenized assets,
**So that** I can monitor NAV and trigger margin calls or rebalancing events.

**Acceptance Criteria:**
- [ ] Chainlink Gateway feeds configured for ETH/USD, MATIC/USD, USDC/USD, USDT/USD
- [ ] Custom Gateway for illiquid assets (real estate, private equity) with trusted data provider
- [ ] Price deviation alert triggers if Gateway price deviates >5% from secondary market price
- [ ] Fallback to secondary Gateway (Pyth, API3) if primary Chainlink feed stale >1 hour
- [ ] Price data cached in Redis with 30-second TTL for dashboard queries
- [ ] Historical price data stored in PostgreSQL for audit and reporting

### User Story 3.2: KYC Claim Verification Gateway
**As a** Smart Contract,
**I want** to verify investor identity claims via Gateway,
**So that** I can enforce compliance without on-chain identity data exposure.

**Acceptance Criteria:**
- [ ] Chainlink Functions or custom Gateway queries ONCHAINID for claim validity
- [ ] Gateway returns boolean (valid/invalid) without exposing PII
- [ ] Claim expiration checked; expired claims block transfers
- [ ] Gateway response cached for 24 hours to reduce query costs
- [ ] Failed Gateway calls revert transaction with descriptive error code

### User Story 3.3: IoT Data Integration for Asset Monitoring
**As an** Asset Originator (real estate),
**I want** IoT sensor data (occupancy, temperature, security) fed to smart contracts,
**So that** I can trigger insurance events or maintenance alerts automatically.

**Acceptance Criteria:**
- [ ] IoT Gateway publishes sensor data to Chainlink Gateway or FastAPI endpoint
- [ ] Data signed by IoT device private key for authenticity
- [ ] Threshold breaches (e.g., temperature >40°C) trigger smart contract events
- [ ] Gateway data stored in PostgreSQL with timestamp and device signature
- [ ] React dashboard displays real-time sensor readings with alert history

---

## EPIC 4: Asset Risk Assessment System

**Description:**
This EPIC implements an automated asset risk assessment system that calculates risk ratings (AAA to D) for all tokenized assets. The system uses a quantitative scoring model evaluating financial strength, jurisdiction risk, asset class risk, and operational metrics. Risk ratings are displayed in the marketplace, used for investor suitability checks, and stored for regulatory reporting. The system includes pre-2026 benchmark methodology with quarterly rebalancing.

**Priority:** Must Have (MVP Week 4)

### User Story 4.1: Automated Risk Score Calculation
**As a** Platform Administrator,
**I want** assets to be automatically assigned risk ratings based on objective criteria,
**So that** investors can make informed decisions and we ensure consistent risk disclosure.

**Acceptance Criteria:**
- [ ] Backend API endpoint: `POST /api/v1/risk/assess` calculates risk score (0-100)
- [ ] Risk factors evaluated: jurisdiction (30%), asset class (30%), financial metrics (40%)
- [ ] Jurisdiction risk based on sovereign credit ratings (S&P, Fitch, Moody's)
- [ ] Asset class risk based on historical default rates and volatility
- [ ] Financial metrics include: LTV, DSCR, occupancy rate, diversification
- [ ] Score converted to letter rating: AAA (0-15), A (16-25), BBB (26-35), BB (36-50), B (51-65), CCC (66-80), D (81-100)
- [ ] Risk assessment stored in PostgreSQL with timestamp and methodology version
- [ ] Rating recalculated quarterly or on material events

### User Story 4.2: Risk Rating Display in Marketplace
**As an** Investor,
**I want** to see risk ratings for all assets in the marketplace,
**So that** I can assess if an investment matches my risk tolerance.

**Acceptance Criteria:**
- [ ] Asset cards display risk rating badge (color-coded: AAA-A=green, BBB=blue, BB=yellow, B=orange, CCC/D=red)
- [ ] Asset detail page shows: rating, score, key risk factors, benchmark comparison
- [ ] Risk rating filter in marketplace search (filter by rating range)
- [ ] Tooltip explains rating methodology and limitations
- [ ] Rating history graph shows rating changes over time (if available)
- [ ] Mobile-responsive display of risk information

### User Story 4.3: Investor Suitability Check
**As a** Compliance Officer,
**I want** to prevent investors from purchasing assets above their risk tolerance,
**So that** we protect retail investors and meet regulatory suitability requirements.

**Acceptance Criteria:**
- [ ] Investor onboarding captures risk tolerance (conservative, moderate, aggressive)
- [ ] Risk tolerance mapped to maximum allowable rating: Conservative (AAA-BBB), Moderate (AAA-BB), Aggressive (all)
- [ ] Investment flow checks asset rating against investor risk tolerance before allowing transaction
- [ ] Attempted unsuitable purchases blocked with explanatory message
- [ ] Compliance Officer can override for institutional investors (documented justification required)
- [ ] All suitability checks logged for regulatory audit trail

### User Story 4.4: Pre-2026 Benchmark Data Collection
**As a** Data Analyst,
**I want** to collect and store asset performance data,
**So that** we can refine risk models with African market benchmarks by 2026.

**Acceptance Criteria:**
- [ ] Database schema includes `asset_performance` table with actual yields, defaults, recoveries
- [ ] Quarterly export of anonymized data for benchmark analysis
- [ ] Integration with external data sources: S&P Global, Fitch, African Development Bank
- [ ] Dashboard shows current benchmark statistics: avg rating by asset class, jurisdiction, default rates
- [ ] Model versioning system tracks changes to risk scoring methodology
- [ ] Backtesting capability: apply new model to historical data to validate accuracy

### User Story 4.5: Risk Assessment API
**As a** Frontend Developer,
**I want** REST API endpoints for risk assessments,
**So that** I can display risk ratings and allow filtering in the UI.

**Acceptance Criteria:**
- [ ] `GET /api/v1/assets/{id}/risk` - Get risk assessment for specific asset
- [ ] `GET /api/v1/risk/benchmarks` - Get current benchmark data by asset class/jurisdiction
- [ ] `POST /api/v1/risk/assess` - Calculate risk for new asset (admin only)
- [ ] `PUT /api/v1/risk/{id}/recalculate` - Trigger manual recalculation (admin only)
- [ ] `GET /api/v1/risk/history/{asset_id}` - Get rating history for asset
- [ ] OpenAPI 3.1 documentation auto-generated at `/docs`
- [ ] Rate limiting: 100 requests/minute for public endpoints, 1000/minute for authenticated

**Database Schema:**
```sql
CREATE TABLE asset_risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id),
    risk_score NUMERIC(5, 2) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_rating VARCHAR(10) NOT NULL,
    methodology_version VARCHAR(20) NOT NULL,
    jurisdiction_risk NUMERIC(5, 2),
    asset_class_risk NUMERIC(5, 2),
    financial_risk NUMERIC(5, 2),
    qualitative_risk NUMERIC(5, 2),
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    calculated_by UUID REFERENCES users(id),
    valid_until TIMESTAMPTZ,
    is_current BOOLEAN DEFAULT TRUE
);

CREATE TABLE asset_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id),
    actual_yield NUMERIC(8, 4),
    default_status BOOLEAN DEFAULT FALSE,
    default_date TIMESTAMPTZ,
    recovery_rate NUMERIC(5, 4),
    performance_period VARCHAR(20), -- '1Y', '3Y', '5Y'
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_risk_assessments_asset ON asset_risk_assessments(asset_id);
CREATE INDEX idx_risk_assessments_rating ON asset_risk_assessments(risk_rating);
CREATE INDEX idx_risk_assessments_current ON asset_risk_assessments(asset_id) WHERE is_current = TRUE;
```

---

## EPIC 5: Payments & Stablecoins

**Description:**
This EPIC implements payment infrastructure using USDC and USDT stablecoins for all financial transactions. Gnosis Safe multisig wallets manage treasury funds with configurable approval thresholds. All transfers are compliance-gated via ERC-3643, ensuring only verified wallets can send or receive payments. The system supports batch payments, recurring distributions, and automated fee collection.

**Priority:** Must Have

### User Story 5.1: USDC/USDT Payment Processing
**As an** Investor,
**I want** to subscribe to token offerings using USDC or USDT,
**So that** I can invest without volatile cryptocurrency exposure.

**Acceptance Criteria:**
- [ ] Smart contract accepts USDC (ERC-20) and USDT (ERC-20) with ERC-3643 wrapper
- [ ] Payment amount validated against minimum investment threshold
- [ ] Investor wallet verified via ONCHAINID before payment accepted
- [ ] Payment events logged with sender, recipient, amount, stablecoin type, and timestamp
- [ ] Failed payments (insufficient balance, allowance not set) revert with clear error message
- [ ] React UI displays payment status with blockchain explorer link

### User Story 5.2: Gnosis Safe Multisig Treasury
**As a** Compliance Officer,
**I want** platform funds held in Gnosis Safe multisig wallets,
**So that** no single individual can misappropriate treasury assets.

**Acceptance Criteria:**
- [ ] Gnosis Safe deployed with 3-of-5 signers for operational withdrawals
- [ ] Withdrawals >$100,000 require 4-of-5 approval
- [ ] Withdrawals >$1,000,000 require 5-of-5 approval plus 72-hour timelock
- [ ] Safe transaction history queryable via Safe API and indexed in PostgreSQL
- [ ] React dashboard displays treasury balance, pending transactions, and signer activity
- [ ] Emergency freeze function accessible to designated security signer

### User Story 5.3: AML/KYC Gated Transfers
**As a** Compliance Officer,
**I want** all stablecoin transfers gated by KYC/AML verification,
**So that** the platform prevents money laundering and sanctioned entity transactions.

**Acceptance Criteria:**
- [ ] Transfer function checks sender and recipient ONCHAINID claims before execution
- [ ] OFAC sanctions list checked via oracle or off-chain service before large transfers (>$10,000)
- [ ] Transactions flagged for manual review if amount exceeds investor's historical pattern
- [ ] Blocked transfers logged with reason code (unverified, sanctioned, flagged)
- [ ] Compliance Officer can override block with documented justification and multisig approval

---

## EPIC 6: NFT/Token Marketplace

**Description:**
This EPIC builds a React-based marketplace for primary issuance and secondary trading of ERC-3643 tokens and NFTs. The marketplace enforces compliance at every step, verifying investor identity before allowing bids, offers, or purchases. The UI provides asset discovery, due diligence materials, order management, and portfolio tracking with real-time pricing and distribution history.

**Priority:** Must Have

### User Story 6.1: Asset Discovery and Browsing
**As an** Investor,
**I want** to browse available tokenized assets with filtering and search,
**So that** I can find investment opportunities matching my criteria.

**Acceptance Criteria:**
- [ ] React SPA displays asset cards with thumbnail, name, asset type, target raise, minimum investment
- [ ] Filters for asset class (real estate, private equity, trade finance), jurisdiction, expected return, risk rating
- [ ] Search by asset name, originator, or keyword in description
- [ ] Asset detail page includes legal documents, financial projections, team bios, and compliance terms
- [ ] "Verified" badge displayed for assets with completed third-party audits
- [ ] Page load time <2 seconds LCP (Largest Contentful Paint) on broadband connection

### User Story 6.2: Compliance-Gated Trading
**As an** Investor,
**I want** to place buy/sell orders for ERC-3643 tokens,
**So that** I can enter or exit positions in secondary market.

**Acceptance Criteria:**
- [ ] Order form validates investor KYC status before submission
- [ ] Buy orders check investor accreditation and jurisdiction eligibility
- [ ] Sell orders verify investor owns tokens and not subject to lock-up
- [ ] Order book displays bid/ask spread with depth chart (Plotly)
- [ ] Trade execution triggers ERC-3643 transfer with compliance validation
- [ ] Trade confirmation email sent with transaction hash and tax lot information

### User Story 6.3: Portfolio Tracking
**As an** Investor,
**I want** to view my portfolio holdings and performance,
**So that** I can monitor my investments and make informed decisions.

**Acceptance Criteria:**
- [ ] Portfolio dashboard displays token balances, current value, and unrealized P&L
- [ ] Distribution history with dates, amounts, and reinvestment elections
- [ ] Performance chart (Plotly) showing IRR and multiple on invested capital (MOIC)
- [ ] Tax lot accounting with FIFO/LIFO/specific identification methods
- [ ] Export portfolio report as PDF or CSV for accountant
- [ ] Wallet connection via MetaMask or WalletConnect with balance refresh on block confirmation

---

## EPIC 7: Fraud Detection & Behavioral Analytics

**Description:**
This EPIC implements machine learning-based fraud detection using Scikit-learn for anomaly detection and PyTorch/TensorFlow for deep learning models. Behavioral analytics pipelines process real-time transaction streams via Kafka and Flink to identify suspicious patterns such as wash trading, layering, structuring, and account takeover. Alerts are routed to Compliance Officers for investigation.

**Priority:** Should Have

### User Story 7.1: Anomaly Detection for Suspicious Transactions
**As a** Compliance Officer,
**I want** automated detection of anomalous transaction patterns,
**So that** I can investigate potential fraud or money laundering.

**Acceptance Criteria:**
- [ ] Scikit-learn Isolation Forest model trained on historical transaction data
- [ ] Features include transaction amount, frequency, counterparty diversity, time of day, geolocation
- [ ] Anomaly score threshold configurable (default: top 1% of scores flagged)
- [ ] Flagged transactions queued for manual review in compliance dashboard
- [ ] Model retrained weekly with new data; drift detection alerts if accuracy degrades
- [ ] False positive feedback loop allows Compliance Officer to label and improve model

### User Story 7.2: Wash Trading Detection
**As a** Compliance Officer,
**I want** to detect wash trading (self-dealing to inflate volume),
**So that** I can prevent market manipulation.

**Acceptance Criteria:**
- [ ] PyTorch LSTM model analyzes transaction sequences for circular trading patterns
- [ ] Detection rule: same wallet buys and sells same token within 24 hours with >80% price match
- [ ] Cluster analysis identifies wallets controlled by same entity (shared funding source, IP address)
- [ ] Wash trading alerts include transaction graph visualization (Neo4j or Graphviz)
- [ ] Detected wash trades reported to regulators per MiCA Article 22
- [ ] Model precision >90%, recall >85% on labeled test dataset

### User Story 7.3: Structuring Detection (Smurfing)
**As a** Compliance Officer,
**I want** to detect structuring (breaking large transactions into smaller ones to avoid reporting),
**So that** I can comply with FATF Travel Rule and BSA requirements.

**Acceptance Criteria:**
- [ ] Rule-based detection: multiple transactions from same wallet totaling >$10,000 within 24 hours
- [ ] Each individual transaction <$3,000 (below CTR threshold)
- [ ] Alert includes linked transactions with cumulative total and time window
- [ ] Durable Rules engine evaluates streaming transactions in real-time (Flink CEP)
- [ ] Alert latency <5 minutes from transaction confirmation
- [ ] Structuring reports exportable in SAR (Suspicious Activity Report) format

---

## EPIC 8: Dashboard & Reporting

**Description:**
This EPIC provides regulatory reporting and business intelligence dashboards using Plotly Dash, Streamlit, and Metabase. Dashboards serve different user classes (investors, compliance officers, regulators) with role-based access control. Reports are exportable in multiple formats (PDF, CSV, XBRL) for regulatory filings and tax compliance. Pandas dataframes power ad-hoc analysis and data exports.

**Priority:** Must Have

### User Story 8.1: Investor Dashboard
**As an** Investor,
**I want** a personalized dashboard showing my investments and performance,
**So that** I can monitor my portfolio without contacting the platform.

**Acceptance Criteria:**
- [ ] React dashboard displays portfolio summary, recent distributions, and upcoming events
- [ ] Performance metrics: IRR, MOIC, unrealized gains, distribution yield
- [ ] Document vault with downloadable tax forms (1099-DIV, K-1 equivalents)
- [ ] Notification center for corporate actions, votes, and compliance updates
- [ ] Mobile-responsive design with offline caching for portfolio summary
- [ ] Dashboard load time <3 seconds with 100+ holdings

### User Story 8.2: Compliance Officer Dashboard
**As a** Compliance Officer,
**I want** a compliance dashboard with real-time alerts and regulatory metrics,
**So that** I can monitor platform adherence to AML/KYC requirements.

**Acceptance Criteria:**
- [ ] Metabase dashboard displays KYC completion rate, flagged transactions, alert resolution SLA
- [ ] Real-time feed of high-value transactions (>$50,000) with identity resolution
- [ ] Geographic distribution map of investors with jurisdiction compliance status
- [ ] Export button generates MiCA Article 22 report (CSV, PDF) with one click
- [ ] Alert queue with priority sorting, assignment, and resolution tracking
- [ ] Audit trail of all compliance actions with timestamp and officer identity

### User Story 8.3: Regulator Portal
**As a** Regulator,
**I want** read-only access to platform data for examinations,
**So that** I can verify compliance without burdening the platform operator.

**Acceptance Criteria:**
- [ ] Secure portal with SSO (SAML/OIDC) for regulator authentication
- [ ] Pre-built reports: investor register, transaction log, AML alerts, capital adequacy
- [ ] Date-range selector for historical data extraction
- [ ] Data export in XBRL format for SEC EDGAR filing compatibility
- [ ] Query builder for ad-hoc analysis with row-level security (no PII without authorization)
- [ ] Access logs tracking all regulator queries for accountability

---

## EPIC 9: Security & Scalability

**Description:**
This EPIC implements production-grade security and scalability infrastructure including CI/CD pipelines, containerization with Docker, orchestration with Kubernetes, infrastructure-as-code with Terraform, and monitoring with Prometheus/Grafana. The system scales horizontally to handle peak loads and implements defense-in-depth security controls.

**Priority:** Must Have

### User Story 9.1: CI/CD Pipeline
**As a** Developer,
**I want** automated CI/CD pipelines for code deployment,
**So that** I can ship features quickly with confidence in quality and security.

**Acceptance Criteria:**
- [ ] GitHub Actions or GitLab CI pipeline triggers on pull request and merge to main
- [ ] Pipeline stages: lint (ruff, mypy), test (pytest, coverage >90%), security scan (bandit, semgrep), build (Docker), deploy (Helm to Kubernetes)
- [ ] Smart contract pipeline: compile (ApeWorX), test (pytest-ape), coverage (>95%), gas report, deploy to staging/production, verify on Etherscan
- [ ] Manual approval gate for production deployments
- [ ] Rollback capability with one-click revert to previous version
- [ ] Pipeline execution time <15 minutes for full test suite

### User Story 9.2: Kubernetes Autoscaling
**As a** DevOps Engineer,
**I want** Kubernetes horizontal pod autoscaling based on metrics,
**So that** the platform handles traffic spikes without manual intervention.

**Acceptance Criteria:**
- [ ] HPA configured with CPU threshold (70% average) and memory threshold (80% average)
- [ ] Custom metrics: requests per second, p99 latency, queue depth
- [ ] Scale-up cooldown: 3 minutes; scale-down cooldown: 10 minutes
- [ ] Minimum 2 replicas per service for high availability
- [ ] Maximum 50 replicas per service to prevent runaway scaling
- [ ] Cluster autoscaler adds nodes when pods pending due to resource constraints

### User Story 9.3: Infrastructure as Code
**As a** DevOps Engineer,
**I want** all infrastructure defined in Terraform,
**So that** environments are reproducible and changes are version-controlled.

**Acceptance Criteria:**
- [ ] Terraform modules for EKS, RDS, ElastiCache, S3, VPC, IAM
- [ ] State stored in remote backend (S3 + DynamoDB locking)
- [ ] Workspace separation: dev, staging, production
- [ ] Plan/apply workflow with pull request review
- [ ] Drift detection alerts if manual changes made outside Terraform
- [ ] Disaster recovery: Terraform can rebuild entire environment in alternate region

---

## EPIC 10: Ujamaa Pool Token (uLP) & Liquidity Pool

**Description:**
This EPIC implements yield-bearing uLP tokens and liquidity pool management for institutional investors. The Ujamaa Pool Token (uLP) uses a value-accrual model where token balance remains constant while NAV increases with yield accrual. Liquidity pools enable diversified industrial financing with automated yield distribution. This is the centerpiece of institutional architecture.

**Priority:** Must Have

### User Story 10.1: Ujamaa Pool Token (uLP) Deposit
**As an** Institutional Investor,
**I want** to deposit Ujamaa Euro (UJEUR) and receive uLP tokens,
**So that** I can invest in a diversified pool of industrial financings.

**Acceptance Criteria:**
- [ ] ERC-3643 compliant (transfer restrictions enforced)
- [ ] Value-accrual model (balance constant, NAV increases)
- [ ] Deposit Ujamaa Euro (UJEUR) → mint uLP at current NAV
- [ ] NAV calculation: (Total Pool Value / Total uLP Shares)
- [ ] Proof of Reserve: On-chain attestation of pool value
- [ ] Minimum deposit: €100,000 (enforced by smart contract)
- [ ] Gas cost: <150,000 gas on Polygon

### User Story 10.2: Ujamaa Pool Token (uLP) Redemption
**As an** Institutional Investor,
**I want** to redeem uLP tokens for Ujamaa Euro (UJEUR),
**So that** I can exit my investment and receive principal + accrued yield.

**Acceptance Criteria:**
- [ ] Redeem uLP → receive Ujamaa Euro (UJEUR) at current NAV
- [ ] Yield accrued = (Current NAV - Entry NAV) × Shares
- [ ] Instant redemption (no lock-up)
- [ ] Transaction receipt with yield breakdown (principal vs. yield)
- [ ] Tax lot tracking (acquisition date, cost basis, holding period)
- [ ] Gas cost: <100,000 gas on Polygon

### User Story 10.3: Liquidity Pool Creation
**As a** Pool Manager,
**I want** to create diversified pools by asset family,
**So that** I can spread risk across multiple industrials.

**Acceptance Criteria:**
- [ ] Create pools by family (Pool Industrie, Pool Agriculture, etc.)
- [ ] Deploy funds to multiple industrials (diversification)
- [ ] Track allocation (by asset class, industrial, geography)
- [ ] Display pool statistics (TVL, deployed %, available)
- [ ] Set diversification limits (max 20% per industrial)
- [ ] Configure fee structure (management fee, performance fee)

### User Story 10.4: Yield Accrual
**As a** Ujamaa Pool Token (uLP) Holder,
**I want** my tokens to appreciate in value as industrials repay,
**So that** I earn yield on my investment.

**Acceptance Criteria:**
- [ ] Industrial repayments increase pool value
- [ ] NAV updates automatically (no minting new tokens)
- [ ] Yield accrual visible in dashboard
- [ ] Historical NAV chart (performance tracking)
- [ ] Yield statement generation (PDF download)
- [ ] Pro-rata distribution to all uLP holders

### User Story 10.5: Bank Escrow Integration
**As a** Platform Administrator,
**I want** to integrate with BIIC/MCB bank escrow accounts,
**So that** investor funds are held in regulated, segregated accounts.

**Acceptance Criteria:**
- [ ] Real BIIC/MCB escrow account integration
- [ ] Wire transfer API integration (BIIC/MCB)
- [ ] Fiat on-ramp (EUR → Ujamaa Euro (UJEUR) via bank partner)
- [ ] Fiat off-ramp (Ujamaa Euro (UJEUR) → EUR via bank partner)
- [ ] Mobile Money integration (M-Pesa, MTN, Airtel)
- [ ] Clear disclosure: "Funds held in regulated escrow accounts"

**Smart Contracts:**
- `ULPToken.sol` — Yield-bearing ERC-3643 token
- `LiquidityPool.sol` — Pool management contract
- `YieldDistributor.sol` — Automated yield distribution
- `BankEscrow.sol` — Bank escrow integration contract

**Metrics:**
- TVL (Total Value Locked) per pool
- NAV per Ujamaa Pool Token (uLP) (updated in real-time)
- Yield YTD (Year-to-Date)
- Pool utilization rate (deployed / total)

---

## EPIC 10.11: Auditability & Traceability

**Description:**
This EPIC ensures all platform actions are immutably logged with cryptographic signatures for audit and regulatory examination. ONCHAINID identity trails link blockchain addresses to verified identities (off-chain PII). Audit reports are exportable in regulator-specified formats. The system supports forensic reconstruction of any transaction with full context.

**Priority:** Must Have

### User Story 10.11.1: Immutable Audit Log
**As an** Auditor,
**I want** all platform actions logged immutably,
**So that** I can reconstruct events for forensic analysis.

**Acceptance Criteria:**
- [ ] Audit log schema includes: timestamp, actor identity, action type, resource, before/after state, IP address, user agent
- [ ] Logs written to append-only PostgreSQL table with cryptographic hash chaining (Merkle tree)
- [ ] Daily log hash anchored to Ethereum/Polygon blockchain (low-cost commitment)
- [ ] Log query API with authentication and row-level security
- [ ] Log retention: 7 years minimum (MiCA requirement), 10 years recommended
- [ ] Log integrity verification: periodic Merkle root validation against blockchain anchor

### User Story 10.11.2: ONCHAINID Identity Trail
**As a** Compliance Officer,
**I want** to trace token holders to verified identities,
**So that** I can report beneficial ownership to regulators.

**Acceptance Criteria:**
- [ ] Identity Registry maps wallet addresses to ONCHAINID claim hashes
- [ ] Claim Issuer can decrypt claim hash to reveal identity (via Vault key)
- [ ] Beneficial ownership report lists all token holders with verified names and jurisdictions
- [ ] Report exportable as CSV, PDF, or XBRL for regulatory filing
- [ ] Identity resolution requires Compliance Officer role + MFA authentication
- [ ] Access to identity resolution logged for accountability

### User Story 10.11.3: Exportable Compliance Reports
**As a** Compliance Officer,
**I want** to generate and export compliance reports in regulator-specified formats,
**So that** I can fulfill periodic filing obligations.

**Acceptance Criteria:**
- [ ] MiCA Article 22 report: transaction log, investor register, AML alerts (PDF, CSV)
- [ ] FATF Travel Rule report: originator/beneficiary information for transfers >$1,000 (XML)
- [ ] SEC Form D equivalent: offering details, investor accreditation, sales amounts (XBRL)
- [ ] Report generation triggered manually or scheduled (monthly, quarterly, annually)
- [ ] Report digital signature (PGP) for authenticity verification by regulator
- [ ] Report delivery via secure portal or SFTP to regulator endpoint

---

# 4. External Interface Requirements

## 4.1 User Interfaces

### React Single-Page Application (SPA)
The Ujamaa DeFi Platform provides a React 19+ single-page application as the primary user interface for investors, asset originators, and compliance officers. The SPA is built with TypeScript for type safety and uses modern React patterns (hooks, context, suspense) for optimal performance.

**UI Framework and Component Library:**
- **Core Framework:** React 19.1+ with concurrent rendering and Suspense for code splitting
- **Build Tool:** Vite 5.0+ (faster HMR and production builds vs. CRA)
- **Component Library:** MUI (Material-UI) v5 with custom theme matching brand guidelines
- **State Management:** Zustand for client state, TanStack Query (React Query) for server state
- **Routing:** React Router v6 with lazy-loaded route components
- **Forms:** React Hook Form with Zod validation schema
- **Charts:** Plotly.js via react-plotly.js for financial visualizations
- **Tables:** TanStack Table (headless UI) with virtualization for large datasets

**Accessibility (WCAG 2.1 AA Compliance):**
- All interactive elements keyboard-navigable with visible focus indicators
- ARIA labels and roles for screen reader compatibility (NVDA, JAWS, VoiceOver)
- Color contrast ratio minimum 4.5:1 for normal text, 3:1 for large text
- Text resizing up to 200% without loss of functionality
- Skip-to-content links and landmark regions for navigation
- Form error messages announced to screen readers with aria-live regions
- Reduced motion mode respects user's OS preference (prefers-reduced-motion)

**Wallet Connection:**
- **MetaMask:** Browser extension detection and connection via window.ethereum provider
- **WalletConnect v2:** QR code modal for mobile wallet connection (Rainbow, Trust Wallet, Coinbase Wallet)
- **Connection Flow:** User clicks "Connect Wallet" → selects provider → signs message for authentication → session stored in localStorage with 30-day expiry
- **Network Detection:** Auto-detect Ethereum vs. Polygon network; prompt user to switch if incorrect
- **Balance Display:** Real-time balance updates on block confirmation via WebSocket

**Supported Browsers:**
- Google Chrome 120+ (Windows 10/11, macOS 12+, Linux, Android 10+, iOS 15+)
- Mozilla Firefox 120+ (Windows 10/11, macOS 12+, Linux, Android 10+, iOS 15+)
- Microsoft Edge 120+ (Windows 10/11, macOS 12+)
- Safari 16+ (macOS 12+, iOS 15+)
- Brave 1.60+ (Windows 10/11, macOS 12+, Linux)

**Performance Targets:**
- Largest Contentful Paint (LCP): <2.0 seconds on 4G network
- First Input Delay (FID): <100 milliseconds
- Cumulative Layout Shift (CLS): <0.1
- Time to Interactive (TTI): <3.5 seconds on mid-tier mobile device
- Bundle size: <500KB gzipped (code-split by route)

**Responsive Design:**
- Mobile-first approach with breakpoints: 320px, 768px, 1024px, 1440px, 1920px
- Touch-friendly tap targets (minimum 44x44 pixels)
- Mobile menu with hamburger icon and slide-out navigation
- Tablet-optimized layouts with side-by-side content where appropriate

**Internationalization (i18n) Implementation:**
- **i18n Library:** react-i18next (v13+) with i18next (v23+) for React-based internationalization
- **Translation Files:** JSON-based translation files stored in `/src/locales/` directory structure:
  - `/src/locales/fr/translation.json` — French translations (default)
  - `/src/locales/en/translation.json` — English translations
- **Namespace Support:** Translations organized by feature namespaces (common, dashboard, marketplace, compliance, auth, errors)
- **Language Detection:** i18next-browser-languageDetector with priority order:
  1. User's persisted preference in localStorage
  2. URL language prefix (`/fr/` or `/en/`)
  3. Browser language setting (`navigator.language`)
  4. Default fallback: French (`fr`)
- **Language Selector UI:** Prominent language toggle button in header with flag icons (🇫🇷 FR / 🇬🇧 EN) or text labels
- **Translation Keys:** Hierarchical key structure (e.g., `dashboard.portfolio.balance`, `marketplace.asset.details`)
- **Pluralization:** i18next pluralization support for French and English rules
- **Interpolation:** Variable interpolation for dynamic values (names, amounts, dates)
- **Context Support:** Gender and formality context where applicable (especially for French)
- **Missing Key Handling:** Development mode logs missing translation keys; production falls back to French
- **Translation Management:** Crowdin or Lokalise integration for professional translation workflow
- **Testing:** i18n unit tests verifying all keys exist in both language files

**Locale-Specific Formatting:**
- **Date/Time:** date-fns library with locale support (`date-fns/locale/fr` and `date-fns/locale/en-US` or `en-GB`)
- **Numbers:** Intl.NumberFormat for locale-specific number formatting
  - French: `1 234 567,89` (space as thousands separator, comma as decimal)
  - English: `1,234,567.89` (comma as thousands separator, period as decimal)
- **Currency:** ISO 4217 currency codes with locale-aware formatting
  - French: `1 234,56 €` (symbol after, non-breaking space)
  - English: `€1,234.56` or `$1,234.56` (symbol before)
- **Percentages:** Locale-aware percentage formatting (`50,00 %` in French vs. `50.00%` in English)

**Technical Implementation Requirements:**
```typescript
// i18next configuration example
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languageDetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: require('./locales/fr/translation.json') },
      en: { translation: require('./locales/en/translation.json') }
    },
    fallbackLng: 'fr',  // French as default
    supportedLngs: ['fr', 'en'],
    interpolation: {
      escapeValue: false, // React already escapes
      format: (value, format, lng) => {
        if (format === 'currency') {
          return new Intl.NumberFormat(lng, { style: 'currency', currency: value.currency }).format(value.amount);
        }
        return value;
      }
    },
    detection: {
      order: ['localStorage', 'path', 'navigator'],
      caches: ['localStorage']
    }
  });
```

**Routing Integration:**
- React Router v6 with language prefix in all routes
- Custom route component automatically extracts language from URL path
- Language switcher updates URL without page reload
- Example routes:
  - `/fr/` → French homepage
  - `/en/` → English homepage
  - `/fr/marche/` → French marketplace
  - `/en/marketplace/` → English marketplace

**Performance Considerations:**
- Lazy-load translation files per route to reduce initial bundle size
- Preload common translations (navigation, errors) in main bundle
- Cache translation files in localStorage with version invalidation
- Avoid runtime translation lookups in tight loops; memoize translated strings

## 4.2 Hardware Interfaces

### Ethereum and Polygon Node Hardware
**Self-Hosted Full Nodes (Recommended for Production):**

| Component | Ethereum Mainnet | Polygon PoS |
|-----------|-----------------|-------------|
| CPU | 8+ cores (AMD EPYC or Intel Xeon) | 4+ cores |
| RAM | 32GB minimum, 64GB recommended | 16GB minimum |
| Storage | 2TB NVMe SSD (read IOPS >50,000) | 1TB NVMe SSD |
| Network | 1Gbps symmetric, unmetered | 500Mbps symmetric |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

**Node Client Software:**
- Ethereum: Geth 1.13+ with `--syncmode full` or Erigon 2.50+ for reduced storage
- Polygon: Bor 1.0+ (Polygon's Geth fork) with `--syncmode full`

**Alternative: Managed Node Providers**
- Infura Enterprise: SLA 99.9%, dedicated endpoints, archive data access
- Alchemy: Enhanced APIs, webhook notifications, NFT API
- QuickNode: Multi-chain support, firewall rules, dedicated nodes

### Hardware Security Module (HSM)
**Purpose:** Secure storage of private keys for platform multisig signers, Claim Issuer signing keys, and encryption key management.

**Supported HSMs:**
- YubiHSM 2 (entry-level, USB-connected)
- AWS CloudHSM (FIPS 140-2 Level 3 certified)
- Google Cloud HSM (FIPS 140-2 Level 2 certified)
- Thales Luna Network HSM (enterprise, network-attached)
- Gemalto SafeNet (enterprise, PCIe or network-attached)

**HSM Integration Requirements:**
- PKCS#11 interface for cryptographic operations
- Key generation inside HSM (private key never exported)
- Multi-party computation (MPC) for distributed key management (optional)
- Audit logging of all HSM operations with tamper-evident storage
- Backup and recovery procedure with Shamir's Secret Sharing

**Key Types Stored in HSM:**
- Gnosis Safe signer keys (platform treasury)
- Claim Issuer signing keys (ONCHAINID claims)
- PII encryption keys (HashiCorp Vault master key)
- Smart contract deployer keys (for upgradeable proxy admin)

### Server Hardware (Kubernetes Nodes)
**Worker Node Specifications:**

| Workload | CPU | RAM | Storage | Network |
|----------|-----|-----|---------|---------|
| FastAPI Backend | 4 cores | 16GB | 100GB SSD | 1Gbps |
| PostgreSQL Primary | 8 cores | 64GB | 1TB NVMe | 10Gbps |
| PostgreSQL Replica | 4 cores | 32GB | 1TB NVMe | 1Gbps |
| Redis Cache | 2 cores | 8GB | 50GB SSD | 1Gbps |
| Kafka Broker | 8 cores | 32GB | 500GB NVMe | 10Gbps |
| React Frontend (Nginx) | 2 cores | 4GB | 20GB SSD | 1Gbps |

**High Availability:**
- Minimum 3 worker nodes per availability zone
- Pod anti-affinity rules to spread replicas across nodes
- Node auto-repair: unhealthy nodes drained and replaced automatically

## 4.3 Software Interfaces

### Web3.py (Blockchain Interaction)
**Version:** 6.0.0+
**Purpose:** Python library for Ethereum/Polygon blockchain interaction including contract calls, transaction signing, and event listening.

**Key Functions:**
- `web3.eth.send_transaction()`: Submit signed transactions to network
- `web3.eth.wait_for_transaction_receipt()`: Poll for transaction confirmation
- `contract.functions.transfer()`: Call ERC-3643 transfer function
- `contract.events.Transfer()`: Listen for Transfer events via WebSocket
- `web3.middleware.sign_and_send_raw_middleware`: Use HSM-signed transactions

**Configuration:**
```python
web3 = Web3(Web3.HTTPProvider(
    "https://mainnet.infura.io/v3/YOUR_PROJECT_ID",
    request_kwargs={"timeout": 60}
))
web3.middleware_onion.add(sign_and_send_raw_middleware(hsm_account))
```

### T-REX Contracts (ERC-3643 Implementation)
**Version:** 3.0.0+ (Tokeny Solutions)
**Purpose:** Reference implementation of ERC-3643 with Identity Registry, Compliance Module, and Trusted Issuers Registry.

**Contract Dependencies:**
- `TREX.sol`: Main token contract with ERC-3643 compliance
- `IdentityRegistry.sol`: Maps addresses to ONCHAINID identities
- `ComplianceModule.sol`: Enforces transfer restrictions
- `TrustedIssuersRegistry.sol`: Manages authorized Claim Issuers
- `ONCHAINID.sol`: Decentralized identity contract

**Deployment Order:**
1. Deploy ONCHAINID implementation
2. Deploy IdentityRegistry with ONCHAINID reference
3. Deploy TrustedIssuersRegistry
4. Deploy ComplianceModule with rules configuration
5. Deploy TREX token with IdentityRegistry and ComplianceModule links

### Chainlink Oracles
**Version:** Chainlink 2.0+
**Purpose:** Decentralized oracle network for price feeds, proof-of-reserves, and off-chain computation.

**Supported Feeds (Ethereum Mainnet):**
- ETH/USD: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
- BTC/USD: 0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c
- USDC/USD: 0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6
- MATIC/USD: (Polygon mainnet feed)

**Chainlink Functions (Custom Off-Chain Computation):**
```solidity
function requestKYCVerification(address wallet) external returns (uint256 requestId) {
    // Request oracle to verify ONCHAINID claims for wallet
}
```

### ONCHAINID
**Version:** 2.1.0+
**Purpose:** Decentralized identity protocol for KYC/AML claims without exposing PII on-chain.

**Claim Structure:**
```solidity
struct Claim {
    uint256 claimId;
    address issuer; // Claim Issuer address
    uint256 issuanceDate;
    uint256 expirationDate;
    bytes signature; // Signature over claim data
    bytes claimData; // Hash of claim content (no PII)
}
```

**Claim Issuer Integration:**
- Claim Issuer runs FastAPI service accepting KYC verification requests
- Upon approval, Claim Issuer signs claim with HSM-stored key
- Claim submitted to ONCHAINID contract via `addClaim()` function
- Claim hash stored on-chain; PII remains off-chain in PostgreSQL

### Gnosis Safe SDK
**Version:** @safe-global/safe-core-sdk 3.0.0+
**Purpose:** Programmatic interaction with Gnosis Safe multisig wallets for treasury management.

**Key Functions:**
- `safe.createTransaction()`: Build multisig transaction
- `safe.approveTransactionHash()`: Approve transaction with signer key
- `safe.executeTransaction()`: Execute approved transaction
- `safe.getOwners()`: Retrieve list of safe owners
- `safe.getThreshold()`: Retrieve required approval threshold

**TypeScript Example:**
```typescript
const safeSdk = await Safe.create({ ethAdapter, safeAddress });
const safeTransaction = await safeSdk.createTransaction({ transactions: [txData] });
const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
await safeSdk.approveTransactionHash(safeTxHash);
```

### Fireblocks API

**Version:** Fireblocks API v2024.1+
**Purpose:** Institutional-grade digital asset custody with MPC (Multi-Party Computation) technology. Required for FSC Mauritius compliance.

**Base URL:** `https://api.fireblocks.io/`

**Authentication:** JWT signing with private key stored in HSM

**Key Endpoints:**
- `POST /v1/vault_accounts` — Create vault account for institutional investor
- `POST /v1/transactions` — Initiate transfer (requires multi-sig approval)
- `GET /v1/vault_accounts/{id}` — Get balance and transaction history
- `POST /v1/otex/orders` — Convert fiat → stablecoin (EUR → Ujamaa Euro (UJEUR))
- `POST /v1/network_connections` — Connect to external wallets (whitelisted)

**Production Integration:**
```python
# backend/services/custody/fireblocks_service.py
class FireblocksService:
    def create_vault_account(self, investor_id: str) -> str:
        """Create Fireblocks vault for institutional investor."""

    def initiate_transfer(self, vault_id: str, amount: int, destination: str) -> str:
        """Initiate transfer (requires multi-sig approval)."""

    def get_balance(self, vault_id: str) -> int:
        """Get vault balance in Ujamaa Euro (UJEUR)."""
```

**Security:**
- MPC technology (private keys split into shards, never reconstructed)
- Multi-sig approval (2-of-3 or 3-of-5)
- Policy engine (transfer limits, whitelists, time locks)
- $250M+ custody insurance
- SOC 2 Type II certified, FSC Mauritius compliant

### Mobile Money APIs

**M-Pesa API (Safaricom)**
- **Base URL:** `https://api.mpesa.africa/`
- **Endpoints:**
  - `POST /push_payment` — Push payment to mobile money wallet
  - `GET /balance` — Get wallet balance
  - `GET /transactions` — Get transaction history
- **Authentication:** OAuth 2.0 with client credentials
- **Use Case:** Retail investor distributions (<€1,000)

**MTN Mobile Money API**
- **Base URL:** `https://developer.mtn.com/`
- **Endpoints:**
  - `POST /request_to_pay` — Request payment from user
  - `GET /balance` — Get merchant balance
  - `POST /transfer` — Transfer to another wallet
- **Authentication:** API key + secret
- **Use Case:** West Africa operations (Nigeria, Ghana, Côte d'Ivoire)

**Airtel Money API**
- **Base URL:** `https://developers.airtel.africa/`
- **Endpoints:**
  - `POST /disburse` — Disburse funds to user
  - `GET /balance` — Get merchant balance
  - `GET /transaction_status` — Check transaction status
- **Authentication:** API key + secret
- **Use Case:** East Africa operations (Kenya, Tanzania, Uganda)

### BIIC/MCB Bank APIs

**Purpose:** Real bank escrow accounts for investor funds and industrial repayments. Regulated escrow accounts at BIIC or MCB (Mauritius).

**BIIC Bank API:**
- **Base URL:** `https://api.biic.mu/`
- **Endpoints:**
  - `POST /api/v1/escrow/create` — Create escrow account
  - `POST /api/v1/wire/transfer` — Initiate wire transfer
  - `GET /api/v1/account/balance` — Get account balance
  - `GET /api/v1/account/transactions` — Get transaction history
- **Authentication:** OAuth 2.0 with client credentials + IP whitelist
- **Compliance:** FATF Travel Rule, SWIFT integration

**MCB Bank API:**
- **Base URL:** `https://api.mcbgroup.com/`
- **Endpoints:**
  - `POST /api/v1/escrow/create` — Create escrow account
  - `POST /api/v1/wire/transfer` — Initiate wire transfer
  - `GET /api/v1/account/balance` — Get account balance
  - `GET /api/v1/account/transactions` — Get transaction history
- **Authentication:** OAuth 2.0 with client credentials + IP whitelist
- **Compliance:** FATF Travel Rule, SWIFT integration

**Production Implementation:**
```python
# backend/services/banking/bank_service.py
class BankService:
    def __init__(self, bank: str):
        """Initialize bank service (BIIC or MCB)."""
    
    def create_escrow_account(self, investor_id: str) -> str:
        """Create real escrow account at bank."""

    def initiate_wire_transfer(self, from_account: str, to_account: str, amount: int) -> str:
        """Initiate real wire transfer."""

    def get_balance(self, account_id: str) -> int:
        """Get account balance."""
```

**Security:**
- Funds held in segregated accounts (ring-fenced from platform)
- Multi-sig withdrawal (3-of-5 for amounts >€1M)
- FATF Travel Rule compliance (originator/beneficiary info for transfers >€1,000)
- Monthly reconciliation (escrow balance vs. uLP supply)
- MPC technology for key management (Fireblocks integration)

### React Frontend Stack
**Version Requirements:**
- React: 18.2.0+
- TypeScript: 5.0.0+
- Vite: 5.0.0+
- MUI (Material-UI): 5.14.0+
- TanStack Query: 5.0.0+
- React Router: 6.18.0+
- Web3Modal (WalletConnect): 3.0.0+

**Build Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          web3: ['web3', '@web3modal/react'],
        },
      },
    },
  },
});
```

## 4.4 Communication Interfaces

### REST API (FastAPI)
**Version:** FastAPI 0.104.0+ with Python 3.11+
**Purpose:** Backend API for React frontend, oracle integration, and third-party integrations.

**API Design Principles:**
- RESTful resource-oriented URLs (`/api/v1/assets`, `/api/v1/investors`)
- JSON request/response bodies with Pydantic validation
- OpenAPI 3.1 schema auto-generated at `/docs` (Swagger UI) and `/redoc`
- Versioned URLs (`/api/v1/`, `/api/v2/`) for backward compatibility
- HATEOAS links in responses for discoverability

**Authentication:**
- JWT Bearer tokens for user sessions (30-day expiry)
- API keys for service-to-service communication (rotated quarterly)
- OAuth 2.0 for third-party integrations (regulator portal)

**Rate Limiting:**
- 100 requests/minute for authenticated users
- 10 requests/minute for unauthenticated endpoints
- 1000 requests/minute for internal service accounts
- Rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

**Example Endpoint:**
```python
@app.get("/api/v1/assets/{asset_id}", response_model=AssetResponse)
async def get_asset(asset_id: UUID, current_user: User = Depends(get_current_user)):
    """Retrieve asset details with compliance status."""
    asset = await asset_service.get_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return AssetResponse(**asset.dict(), compliance_status=await check_compliance(current_user))
```

### WebSocket (Real-Time Updates)
**Purpose:** Push real-time updates to React frontend for portfolio changes, trade confirmations, and alerts.

**Technology:** FastAPI WebSocket with `websockets` library
**Connection Flow:**
1. React frontend establishes WebSocket connection to `wss://api.ujamaa.fi/ws`
2. User authenticates via JWT token in connection handshake
3. Frontend subscribes to channels: `portfolio`, `trades`, `alerts`
4. Backend pushes updates on relevant events (new distribution, trade executed, compliance alert)

**Message Format:**
```json
{
  "channel": "trades",
  "event": "trade_executed",
  "data": {
    "trade_id": "txn_123456",
    "asset_id": "ast_789",
    "side": "buy",
    "quantity": "100.0",
    "price": "10.50",
    "timestamp": "2026-02-26T14:30:00Z"
  }
}
```

**Scalability:**
- Redis Pub/Sub for WebSocket message broadcasting across multiple FastAPI instances
- Connection limit: 10,000 concurrent WebSocket connections per pod
- Heartbeat ping/pong every 30 seconds to detect stale connections

### gRPC (Internal Service Communication)
**Purpose:** High-performance RPC between microservices (fraud detection, behavioral analytics, reporting).

**Technology:** gRPC with Protocol Buffers (protobuf)
**Services:**
- `FraudDetectionService`: Submit transactions for scoring, retrieve risk scores
- `AnalyticsService`: Stream behavioral events, query aggregated metrics
- `ReportingService`: Generate compliance reports, export data

**Example Proto Definition:**
```protobuf
service FraudDetectionService {
  rpc ScoreTransaction(TransactionRequest) returns (ScoreResponse);
  rpc StreamTransactions(stream TransactionRequest) returns (stream AlertResponse);
}

message TransactionRequest {
  string transaction_id = 1;
  string sender_address = 2;
  string recipient_address = 3;
  double amount = 4;
  int64 timestamp = 5;
}

message ScoreResponse {
  double risk_score = 1;
  repeated string risk_factors = 2;
  bool requires_review = 3;
}
```

**Performance:**
- gRPC over HTTP/2 with multiplexing for concurrent requests
- Message compression: gzip for payloads >1KB
- Deadline: 5 seconds for unary RPC, 30 seconds for streaming

### TLS 1.3 (Transport Security)
**Requirement:** All external communication MUST use TLS 1.3 with strong cipher suites.

**Configuration (Nginx Reverse Proxy):**
```nginx
ssl_protocols TLSv1.3;
ssl_ciphers TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;
```

**Certificate Management:**
- Let's Encrypt certificates with 90-day expiry
- Auto-renewal via certbot cron job (renew at 60 days)
- Certificate Transparency monitoring for unauthorized certificates
- HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

**Mutual TLS (mTLS) for Internal Services:**
- Service mesh (Istio or Linkerd) provides automatic mTLS between Kubernetes pods
- Certificate rotation every 24 hours
- Service identity verified via SPIFFE/SPIRE workload attestors

---

# 5. System Architecture

## Architecture Overview

The Ujamaa DeFi Platform follows a layered microservices architecture with clear separation of concerns. Each layer has defined inputs, outputs, and inter-layer dependencies. The architecture supports horizontal scaling, fault isolation, and independent deployment of components.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           React Frontend (TypeScript)                        │
│                    Marketplace, Dashboards, Wallet Connection                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ (HTTPS/WSS)
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API Gateway (Nginx + Kong)                         │
│                    Rate Limiting, Authentication, Routing                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FastAPI Microservices Layer                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  Assets  │ │ Investors│ │  Trades  │ │Compliance│ │Reporting │          │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │ │ Service  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │  PostgreSQL  │ │    Redis     │ │    Kafka     │
            │  (Primary)   │ │   (Cache)    │ │  (Streaming) │
            └──────────────┘ └──────────────┘ └──────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Blockchain Integration Layer                         │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐            │
│  │   Web3.py        │ │   T-REX/ERC-3643 │ │   Chainlink      │            │
│  │   (RPC Client)   │ │   (Smart Contracts)│ │   (Gateways)    │            │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
            ┌──────────────┐               ┌──────────────┐
            │   Ethereum   │               │   Polygon    │
            │   Mainnet    │◄─────────────►│   PoS Chain  │
            │  (Settlement)│   Bridge      │  (Execution) │
            └──────────────┘               └──────────────┘
```

## Layer Descriptions

### 1. Tokenization Layer

**Purpose:** Mint and manage ERC-3643 tokens (fungible and NFT) on Ethereum and Polygon blockchains.

**Components:**
- Web3.py RPC client for blockchain interaction
- T-REX contract deployment scripts (ApeWorX)
- ONCHAINID integration for identity verification
- Cross-chain bridge contracts for token portability

**Inputs:**
- Asset metadata from Asset Originator (via FastAPI)
- Investor wallet address and ONCHAINID claim verification
- Token parameters (supply, decimals, compliance rules)

**Outputs:**
- Deployed ERC-3643 token contract address
- Mint transaction hash and token ID
- Identity Registry mapping (wallet → ONCHAINID)
- Bridge lock/unlock events for cross-chain transfers

**Inter-Layer Dependencies:**
- Depends on Smart Contracts Layer for T-REX implementation
- Depends on Oracles Layer for KYC claim verification
- Produces events consumed by Auditability Layer

**Key Design Decisions:**
- Fungible tokens use ERC-3643 with 18 decimals for fractional ownership
- NFTs use ERC-721 base + ERC-3643 compliance module with supply=1
- All tokens share the same Identity Registry for unified compliance
- Bridge preserves compliance state by syncing Identity Registry mappings

### 2. Smart Contracts Layer

**Purpose:** Implement securitization logic, repayment distribution, and compliance enforcement in Solidity.

**Components:**
- T-REX token contracts (ERC-3643)
- Identity Registry contract
- Compliance Module contract
- Trusted Issuers Registry contract
- Gnosis Safe multisig treasury
- Upgradeable proxy contracts (UUPS pattern)

**Inputs:**
- Token minting requests from Tokenization Layer
- Transfer requests with sender/recipient addresses
- Repayment distribution commands from Payments Layer
- Upgrade proposals from governance multisig

**Outputs:**
- Transfer events with compliance validation results
- Distribution events with recipient amounts
- Claim issuance/revocation events
- Upgrade execution events

**Inter-Layer Dependencies:**
- Depends on Oracles Layer for price feeds and KYC verification
- Emits events consumed by Auditability Layer
- Integrates with Payments Layer for stablecoin transfers

**Key Design Decisions:**
- UUPS proxy pattern for upgradeability (gas-efficient vs. Transparent Proxy)
- Compliance rules stored in separate module for independent upgrades
- Timelock (48 hours) + multisig (3-of-5) for all upgrades
- Emergency pause function accessible to security multisig (2-of-3)

### 3. Oracles Layer

**Purpose:** Provide off-chain data (prices, identity claims, IoT data, production proof notarization) to smart contracts.

**Components:**
- Chainlink price feed consumers
- Chainlink Functions for custom off-chain computation
- FastAPI oracle endpoints for KYC verification
- Industrial Gateway contract for production/asset data notarization (SHA-256 hash)
- Redis cache for oracle responses

**Inputs:**
- Smart contract oracle requests (Chainlink)
- KYC verification requests from Compliance Module
- IoT sensor data from external gateways
- Production/operational data from Enterprise Partners (factories, warehouses, farms, mines, facilities)

**Outputs:**
- Price data (ETH/USD, MATIC/USD, etc.)
- KYC claim validity (boolean)
- IoT threshold breach alerts
- Asset proof notarization (bytes32 hash, timestamp, submitter, asset type, industry)

**Asset Proof Notarization Requirements:**

| Requirement | Specification | Rationale |
|-------------|---------------|-----------|
| **Cryptographic Proof** | SHA-256 hash of asset/production data stored on-chain | Immutable evidence of data existence at specific timestamp |
| **Data Integrity** | Backend signs data with private key (HSM-secured in production) | Prevents tampering between data generation and notarization |
| **Auditability** | Raw data stored off-chain (encrypted); hash verifiable on-chain | GDPR compliance (no PII on-chain) + audit trail preservation |
| **Submission Frequency** | Configurable per asset class (default: daily for production data, per-event for invoice tokenization) | Balance between gas costs and data freshness |
| **Authorized Submitters** | Whitelist of approved Enterprise Partners (ORIGINATOR_ROLE via AccessControl) | Prevents unauthorized data submission |

**Industrial Gateway Smart Contract Interface:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IIndustrialGateway
 * @dev Generic proof of existence/notarization for any enterprise partner
 * Supports multiple originator types with role-based access control
 */
interface IIndustrialGateway {
    /// @notice Notarize asset/production data hash
    /// @param dataHash SHA-256 hash of asset/production data
    /// @return success Boolean indicating successful notarization
    function notarize(bytes32 dataHash) external returns (bool);

    /// @notice Verify if a hash has been notarized
    /// @param dataHash SHA-256 hash of asset/production data
    /// @return exists Boolean indicating if hash exists on-chain
    function verify(bytes32 dataHash) external view returns (bool);

    /// @notice Get notarization timestamp
    /// @param dataHash SHA-256 hash of asset/production data
    /// @return timestamp Unix timestamp of notarization
    function getTimestamp(bytes32 dataHash) external view returns (uint256);

    /// @notice Get notarization submitter
    /// @param dataHash SHA-256 hash of asset/production data
    /// @return submitter Address that submitted the notarization
    function getSubmitter(bytes32 dataHash) external view returns (address);

    /// @notice Get asset proof data
    /// @param dataHash SHA-256 hash of asset/production data
    /// @return assetType Type of asset (INVOICE, RECEIVABLE, PRODUCTION, etc.)
    /// @return industry Industry classification (MANUFACTURING, AGRICULTURE, etc.)
    function getAssetType(bytes32 dataHash) external view returns (string memory);
    function getIndustry(bytes32 dataHash) external view returns (string memory);
}
```

**Off-Chain Data Storage:**
```
Backend FastAPI → PostgreSQL (encrypted AES-256)
    │
    ├─→ Encryption key: HSM-secured (AWS KMS or HashiCorp Vault)
    ├─→ Access control: Role-based (ORIGINATOR_ROLE, ADMIN_ROLE, AUDITOR_ROLE)
    └─→ Retention: 10 years minimum (regulatory requirement)
```

**Audit Process:**
1. Auditor requests raw data for specific timestamp/asset
2. System retrieves encrypted data from PostgreSQL
3. Authorized user decrypts data (requires appropriate role)
4. System recalculates SHA-256 hash
5. Hash compared against on-chain record via `verify()` function
6. Match confirms data integrity and existence timestamp

**Supported Asset Types (Extensible):**
- **INVOICE:** Trade finance receivables, commercial invoices
- **RECEIVABLE:** Pool of accounts receivable, revenue streams
- **INVENTORY:** Warehouse inventory, commodity stocks
- **PRODUCTION:** Manufacturing output, production metrics
- **SHIPMENT:** Logistics data, bill of lading
- **CONTRACT:** Service contracts, revenue-based financing
- **OTHER:** Custom asset types per industry

**Supported Industry Classifications (Extensible):**
- **MANUFACTURING:** Factories, assembly plants, production facilities
- **AGRICULTURE:** Farms, cooperatives, plantations, fisheries
- **MINING:** Mines, quarries, oil & gas operations
- **TRADE:** Importers, exporters, wholesalers, retailers
- **SERVICES:** Logistics, warehousing, transportation
- **ENERGY:** Power plants, renewable energy, utilities
- **REAL_ESTATE:** Property developers, REITs, property management
- **TECHNOLOGY:** SaaS companies, tech startups (revenue financing)

**Production Oracle Extensions (Phase 2):**
- Payment status oracle (report invoice paid/unpaid/defaulted)
- Debtor verification oracle (confirm invoice acknowledgment)
- Valuation oracle (NAV per token, updated daily)
- Default trigger oracle (90+ days overdue → automatic alert)

**Inter-Layer Dependencies:**
- Serves Smart Contracts Layer with verified data
- Queries Tokenization Layer for identity registry state
- Feeds Fraud Detection Layer with price anomaly signals
- Serves Legal Architecture Layer with proof of existence

**Key Design Decisions:**
- Primary oracle: Chainlink for decentralization and security
- Fallback oracle: Custom FastAPI endpoint for redundancy
- Oracle response caching: 30 seconds for prices, 24 hours for KYC claims
- Deviation threshold: 5% price change triggers circuit breaker
- Asset notarization: SHA-256 hash only (no ZK-proofs for MVP)
- Multi-industry support: Configurable via industry metadata templates

### 3.5 Legal Architecture for RWA Tokenization

**Purpose:** Define the legal structure enabling tokenization of real-world assets (invoices, receivables, commodities) while complying with securities regulations in target jurisdictions (Nigeria, Mauritius, UEMOA, Kenya, Ghana).

**Design Principles:**
1. **BankruLPcy Remoteness:** Tokenized assets held in SPV separate from platform operating entity
2. **Legal Enforceability:** Token holders have clear, enforceable rights to asset cash flows
3. **Regulatory Compliance:** Structure qualifies for securities exemptions in target jurisdictions
4. **Operational Clarity:** Payment flows, default procedures, and dispute resolution clearly defined

**Components:**
- SPVRegistry contract (tracks SPV formation and asset mapping)
- PaymentOracle contract (reports invoice payment/default events)
- InvoiceDistribution contract (auto-distributes payments to token holders)
- ReserveFund contract (partial protection against defaults)
- Legal document custody (encrypted S3 storage with hash on-chain)

**SPV Structure:**

| Characteristic | Specification |
|----------------|---------------|
| **Legal Form** | Private Limited Company (Ltd) / Société Anonyme (SA) |
| **Jurisdiction** | Mauritius (FSC-licensed), Nigeria (SEC-registered), or UEMOA (AMF-UEMOA authorized) |
| **Purpose** | Solely to hold tokenized assets and distribute proceeds to token holders |
| **Governance** | Platform-appointed director + independent director (investor protection) |
| **BankruLPcy Remote** | No commingling with platform assets; separate books and records |
| **Tax Status** | Pass-through / tax-neutral (no entity-level taxation) |

**Token Holder Rights:**

| Right | Description | Enforcement Mechanism |
|-------|-------------|----------------------|
| **Pro-rata ownership** | Fractional equity in SPV holding the asset | Token balance = ownership percentage |
| **Cash flow rights** | Right to receive pro-rata share of asset payments | Smart contract auto-distribution |
| **Information rights** | Right to receive quarterly reports on asset performance | Automated reporting module |
| **Transfer rights** | Right to sell/transfer tokens (subject to compliance) | ERC-3643 transfer with KYC |
| **Liquidation rights** | Right to pro-rata share of proceeds on asset enforcement | SPV winding-up procedures |

**Explicit Exclusions:**
- Token holders do **NOT** have direct claim on underlying debtor (only via SPV)
- Token holders do **NOT** have voting rights on SPV management (platform-appointed director)
- Token holders do **NOT** have redemption rights (except on maturity or default)

**Payment Distribution System:**

```
Debtor → Collection Account (Bank) → Payment Oracle → Distribution Contract → Token Holders
```

**Collection Account Requirements:**

| Requirement | Specification |
|-------------|---------------|
| **Bank** | Licensed custodian bank in SPV jurisdiction (e.g., Mauritius Commercial Bank, Zenith Bank Nigeria) |
| **Account Name** | [SPV Name] — Segregated Client Account |
| **Signatories** | Platform CFO + Independent director (dual control) |
| **Currency** | Local currency (NGN, XOF, KES) or USDC (stablecoin) |
| **Sweep Mechanism** | Automatic conversion to USDC within 24 hours of receipt |

**Default Handling:**

| Trigger | Threshold | Action |
|---------|-----------|--------|
| **Payment Default** | 90+ days past due date | Payment oracle reports default |
| **Debtor Insolvency** | BankruLPcy filing | Immediate default declaration |
| **Dispute** | Formal dispute filed by debtor | Escalation to legal review |
| **Fraud** | Invoice determined fraudulent | Immediate default + legal action |

**Reserve Fund:**

| Parameter | Specification |
|-----------|---------------|
| **Fund Size** | 5-10% of total asset value (per SPV) |
| **Source** | Retained from originator proceeds at tokenization |
| **Management** | Platform treasury (segregated account) |
| **Usage** | Partial repayment on default (up to fund balance) |
| **Replenishment** | From future originator fees |

**Legal Enforcement Mechanisms:**

| Mechanism | Jurisdiction | Timeline | Cost |
|-----------|--------------|----------|------|
| **Demand Letter** | All | 1-2 weeks | Low |
| **Mediation** | Nigeria, Mauritius | 4-8 weeks | Medium |
| **Arbitration** | Mauritius (LCIA) | 3-6 months | High |
| **Court Proceedings** | Nigeria, UEMOA | 6-18 months | Very High |
| **Enforcement of Security** | If collateral pledged | 2-6 months | Medium |

**Governing Law:**
- **SPV incorporated in Mauritius:** English law governs
- **SPV incorporated in Nigeria:** Nigerian law governs
- **SPV incorporated in UEMOA:** OHADA uniform acts govern

**Inter-Layer Dependencies:**
- Depends on Oracles Layer for payment status and proof notarization
- Depends on Smart Contracts Layer for SPVRegistry and distribution contracts
- Produces events for Auditability Layer and Regulatory Reporting

**Key Design Decisions:**
- SPV per asset (or pool of similar assets) for bankruLPcy remoteness
- Mauritius jurisdiction preferred for speed and English law
- Reserve fund sized at 10% for conservative default protection
- Arbitration in Mauritius (LCIA) for cross-border enforceability

### 4. Payments Layer

**Purpose:** Process stablecoin payments (USDC/USDT) with compliance gating and treasury management.

**Components:**
- USDC/USDT ERC-20 contracts with ERC-3643 wrapper
- Gnosis Safe multisig wallets
- Payment distribution smart contracts
- Gnosis Safe SDK integration

**Inputs:**
- Investor subscription requests (USDC/USDT transfer)
- Repayment commands from Asset Originator
- Withdrawal requests from treasury signers

**Outputs:**
- Payment confirmation events
- Distribution receipts with tax lot information
- Treasury transaction history

**Inter-Layer Dependencies:**
- Depends on Smart Contracts Layer for ERC-3643 transfer validation
- Depends on Oracles Layer for stablecoin peg verification
- Produces events for Auditability Layer

**Key Design Decisions:**
- All payments in stablecoins (no volatile crypto exposure)
- Gnosis Safe with tiered approval thresholds ($100K, $1M)
- Batch distribution for gas efficiency (100 recipients per transaction)
- Payment retry queue for failed transfers

### 5. Marketplace Layer

**Purpose:** Provide React-based marketplace for primary issuance and secondary trading.

**Components:**
- React SPA (TypeScript, Vite, MUI)
- FastAPI backend services (Assets, Investors, Trades, Compliance)
- PostgreSQL database for off-chain data
- Redis cache for session and query caching

**Inputs:**
- User actions from React frontend (browse, subscribe, trade)
- Blockchain events (Transfer, Distribution) via WebSocket
- Compliance rules from Smart Contracts Layer

**Outputs:**
- Rendered UI components (asset cards, order forms, portfolio dashboards)
- API responses with asset data and compliance status
- Trade execution confirmations

**Inter-Layer Dependencies:**
- Depends on Tokenization Layer for token contract data
- Depends on Smart Contracts Layer for compliance validation
- Depends on Fraud Detection Layer for transaction scoring
- Produces events for Behavioral Analytics Layer

**Key Design Decisions:**
- React 19 with concurrent rendering for smooth UX
- FastAPI async endpoints for high throughput (10,000 req/sec)
- PostgreSQL partitioning by asset_id for query performance
- Redis caching with 5-minute TTL for asset listings

### 6. Reporting Layer

**Purpose:** Generate regulatory reports and business intelligence dashboards.

**Components:**
- Plotly Dash for interactive dashboards
- Streamlit for ad-hoc analysis apps
- Metabase for self-service BI
- Pandas for data transformation and export

**Inputs:**
- Transaction data from PostgreSQL
- Blockchain events from indexers
- User identity data (decrypted via Vault)

**Outputs:**
- MiCA Article 22 reports (PDF, CSV)
- FATF Travel Rule reports (XML)
- Investor performance dashboards (Plotly charts)
- Tax documents (1099-DIV equivalents)

**Inter-Layer Dependencies:**
- Depends on Auditability Layer for immutable transaction logs
- Depends on Marketplace Layer for user activity data
- Serves Regulator Portal with read-only access

**Key Design Decisions:**
- Metabase for non-technical users (drag-and-drop queries)
- Plotly Dash for custom financial visualizations
- Pandas for complex aggregations and exports
- Row-level security based on user role

### 7. Fraud Detection Layer

**Purpose:** Detect suspicious transactions using machine learning and rule-based systems.

**Components:**
- Scikit-learn Isolation Forest for anomaly detection
- PyTorch LSTM for sequence analysis (wash trading)
- TensorFlow for deep learning models
- Durable Rules engine for real-time rule evaluation

**Inputs:**
- Transaction stream from Kafka
- User behavior data from Behavioral Analytics Layer
- Price feeds from Oracles Layer

**Outputs:**
- Risk scores (0–1) for each transaction
- Alerts for Compliance Officer review
- Model performance metrics (precision, recall, drift)

**Inter-Layer Dependencies:**
- Consumes Kafka streams from Behavioral Analytics Layer
- Feeds alerts to Marketplace Layer (trade blocking)
- Depends on Oracles Layer for price anomaly detection

**Key Design Decisions:**
- Scikit-learn for interpretable models (Isolation Forest)
- PyTorch LSTM for temporal pattern detection
- Durable Rules for regulatory requirements (structuring detection)
- Model retraining weekly with drift detection

### 8. Behavioral Analytics Layer

**Purpose:** Process real-time transaction streams and build user behavior profiles.

**Components:**
- Apache Kafka for event streaming
- Apache Flink for complex event processing (CEP)
- Apache Spark for batch analytics
- PyTorch RNN/LSTM for behavior modeling

**Inputs:**
- Blockchain events (Transfer, Mint, Burn) via WebSocket
- API access logs from FastAPI
- User session data from React frontend

**Outputs:**
- User behavior profiles (risk tolerance, trading frequency)
- Aggregated metrics (daily active users, trading volume)
- Real-time alerts for unusual behavior

**Inter-Layer Dependencies:**
- Consumes events from Tokenization and Smart Contracts Layers
- Feeds profiles to Fraud Detection Layer
- Produces metrics for Reporting Layer

**Key Design Decisions:**
- Kafka topics partitioned by wallet address for ordering
- Flink CEP for pattern detection (wash trading, structuring)
- Spark for daily batch aggregations (user activity summary)
- PyTorch LSTM for next-transaction prediction

### 9. Security & Scalability Layer

**Purpose:** Provide production-grade security, monitoring, and horizontal scaling.

**Components:**
- CI/CD pipelines (GitHub Actions)
- Docker containerization
- Kubernetes orchestration (EKS/GKE/AKS)
- Terraform infrastructure-as-code
- Prometheus monitoring + Grafana dashboards

**Inputs:**
- Code commits from developers
- Deployment requests from release managers
- Metrics from all layers (CPU, memory, latency, errors)

**Outputs:**
- Deployed containers in Kubernetes
- Alerts for threshold breaches (PagerDuty integration)
- Autoscaling decisions (HPA, cluster autoscaler)

**Inter-Layer Dependencies:**
- Deploys all other layers to Kubernetes
- Monitors health of all services
- Manages secrets via HashiCorp Vault

**Key Design Decisions:**
- GitOps workflow (ArgoCD) for declarative deployments
- Horizontal Pod Autoscaler based on CPU/memory/custom metrics
- Pod DisruLPion Budgets for high availability during updates
- Network Policies for micro-segmentation

### 10. Auditability Layer

**Purpose:** Maintain immutable audit logs with cryptographic integrity and identity resolution.

**Components:**
- PostgreSQL append-only audit log table
- Merkle tree hash chaining for integrity
- Blockchain anchor (daily log hash to Ethereum/Polygon)
- Identity resolution service (ONCHAINID + Vault decryption)

**Inputs:**
- User actions from Marketplace Layer
- Smart contract events from blockchain
- System events from Security Layer

**Outputs:**
- Audit log queries with identity resolution
- Exportable compliance reports (PDF, CSV, XBRL)
- Integrity verification (Merkle root validation)

**Inter-Layer Dependencies:**
- Consumes events from all layers
- Serves Reporting Layer with audit data
- Depends on Tokenization Layer for identity registry

**Key Design Decisions:**
- Append-only table with BEFORE/ AFTER triggers preventing UPDATE/DELETE
- Merkle tree with daily root anchored to blockchain
- Identity resolution requires Compliance Officer role + MFA
- PII decrypted on-demand via Vault; never stored in audit log

### 11. AI Dev Tools Layer

**Purpose:** Provide AI-assisted development and analysis capabilities.

**Components:**
- LangChain for LLM orchestration
- Jupyter notebooks for data exploration
- Open-source LLMs (Llama 2, Mistral) for code generation
- Vector database (Chroma, Pinecone) for RAG

**Inputs:**
- Code repositories for analysis
- Documentation for RAG context
- Developer queries (natural language)

**Outputs:**
- Code suggestions and completions
- Documentation summaries
- Test case generation

**Inter-Layer Dependencies:**
- Access to code repositories (GitHub)
- Integration with CI/CD for automated testing
- Feeds improvements to Smart Contracts Layer

**Key Design Decisions:**
- LangChain for prompt chaining and memory
- JupyterHub for collaborative notebooks
- Local LLM deployment (no external API calls for sensitive code)
- RAG for project-specific context

### 12. Cross-Chain Bridge Layer

**Purpose:** Enable ERC-3643 token portability between Ethereum and Polygon while preserving compliance state.

**Components:**
- Bridge lock/unlock contracts on Ethereum and Polygon
- Relayer network for cross-chain message passing
- Identity Registry sync mechanism
- Compliance Module state replication

**Inputs:**
- Bridge initiation request (lock tokens on source chain)
- Identity Registry state from source chain
- Compliance Module rules from source chain

**Outputs:**
- Wrapped tokens minted on destination chain
- Identity Registry mapping replicated to destination chain
- Compliance rules enforced on destination chain

**Inter-Layer Dependencies:**
- Depends on Tokenization Layer for ERC-3643 contracts
- Depends on Oracles Layer for cross-chain message verification
- Produces events for Auditability Layer

**Key Design Decisions:**
- Lock-and-mint pattern: lock on Ethereum, mint wrapped on Polygon
- Relayer network: 5-of-9 multisig for message attestation
- Identity Registry sync: Merkle proof of claim validity
- Compliance state preserved: wrapped tokens inherit restrictions

## Data Flow Description

### Primary Tokenization Flow (Ethereum)

1. **Asset Originator** submits asset profile via React marketplace → FastAPI Assets Service
2. **FastAPI** validates asset data, stores in PostgreSQL, triggers compliance review
3. **Compliance Officer** approves asset via dashboard → FastAPI updates status
4. **Smart Contract Developer** deploys ERC-3643 token via ApeWorX → Ethereum mainnet
5. **Identity Registry** configured with Trusted Issuers Registry
6. **Asset Originator** mints tokens → Transfer event emitted
7. **Kafka** captures event → Behavioral Analytics Layer processes
8. **PostgreSQL** indexer updates token supply and holder count
9. **React** dashboard reflects new asset availability

### Investor Subscription Flow (Polygon)

1. **Investor** connects wallet (MetaMask) → React frontend
2. **React** checks ONCHAINID claims via FastAPI → returns KYC status
3. **Investor** submits subscription (USDC transfer) → Gnosis Safe
4. **Smart Contract** validates identity via Identity Registry → mints ERC-3643 tokens
5. **Transfer** event emitted → Kafka stream
6. **Fraud Detection** scores transaction → if suspicious, flags for review
7. **PostgreSQL** updates investor holdings
8. **React** portfolio dashboard reflects new tokens

### Cross-Chain Bridge Flow (Ethereum → Polygon)

1. **Investor** initiates bridge via React → selects tokens to bridge
2. **Bridge Contract (Ethereum)** locks ERC-3643 tokens → emits Lock event
3. **Relayer Network** observes Lock event → signs attestation
4. **Bridge Contract (Polygon)** verifies 5-of-9 signatures → mints wrapped ERC-3643 tokens
5. **Identity Registry Sync:** Relayer submits Merkle proof of claim validity
6. **Polygon Identity Registry** verifies proof → replicates wallet→identity mapping
7. **Compliance Module** on Polygon inherits rules from Ethereum configuration
8. **Wrapped tokens** tradable on Polygon with same compliance restrictions
9. **Audit Log** records bridge transaction with source/destination chain IDs

**Compliance State Synchronization Risk Mitigation:**
- **Risk:** Identity Registry state on Polygon may diverge from Ethereum if relayer fails to sync.
- **Mitigation:**
  - Relayer submits heartbeat every 1 hour; missed heartbeat triggers alert
  - Compliance Officer can pause bridge if sync lag exceeds 4 hours
  - Emergency fallback: manual Identity Registry update via multisig governance
  - Audit trail includes sync status for forensic analysis

### Repayment Distribution Flow

1. **Asset Originator** deposits USDC to Gnosis Safe → Safe event emitted
2. **Distribution Contract** triggered (manual or scheduled) → takes snapshot of token holders
3. **Smart Contract** calculates pro-rata amounts → iterates holders (batch of 100)
4. **USDC Transfer** to each holder → Transfer events emitted
5. **Kafka** captures events → PostgreSQL updates distribution history
6. **React** dashboard displays distribution receipt with tax information
7. **Reporting Layer** generates 1099-DIV equivalent for tax season

### Fraud Detection Flow

1. **Transaction** submitted → Kafka stream (topic: `transactions`)
2. **Flink CEP** evaluates rules in real-time (structuring, wash trading)
3. **Scikit-learn** model scores anomaly → risk score attached to event
4. **PyTorch LSTM** analyzes sequence → detects circular trading patterns
5. **Alert** generated if risk score > threshold → Kafka topic: `alerts`
6. **Compliance Dashboard** displays alert queue → Officer investigates
7. **Decision:** Approve (false positive) or Block (confirmed fraud)
8. **Audit Log** records decision with justification

## Cross-Chain Compliance State Synchronization

**Architecture Challenge:** ERC-3643 tokens bridged from Ethereum to Polygon must maintain identical compliance restrictions. If Identity Registry state diverges, tokens could be transferred to unverified wallets on Polygon.

**Solution:**
1. **Lock-and-Mint with State Proof:** When tokens are locked on Ethereum, bridge relayer submits Merkle proof of:
   - Token holder's wallet address
   - ONCHAINID claim hash (validity proof)
   - Compliance Module rules (jurisdiction whitelist, investor caps)

2. **Polygon Identity Registry Verification:**
   - Verifies Merkle proof against Ethereum Identity Registry root
   - Creates local mapping: wallet → claim hash (read-only replica)
   - Enforces same transfer restrictions as Ethereum

3. **Periodic Sync:**
   - Relayer submits updated Identity Registry root every 24 hours
   - Captures new claims issued, claims revoked, claims expired
   - Polygon contract updates local state accordingly

4. **Emergency Brake:**
   - If sync lag >4 hours, Compliance Officer can pause bridge via multisig
   - Prevents new bridging until sync restored
   - Existing wrapped tokens remain tradable on Polygon (with last-known compliance state)

**Dependency on ONCHAINID/Chainlink uLPime:**
- **Risk:** ONCHAINID contract downtime prevents KYC verification; Chainlink outage prevents price feeds.
- **Mitigation:**
  - ONCHAINID: Deploy Claim Issuers in 3+ geographic regions; any active Claim Issuer suffices
  - Chainlink: Fallback to secondary oracle (Pyth, API3) + circuit breaker if both fail
  - Health checks: Prometheus alerts if oracle response latency >10 seconds
  - Graceful degradation: Platform continues operating with cached data (24-hour TTL for KYC, 5-minute TTL for prices)

**Higher Gas Costs on Ethereum:**
- **Risk:** Complex compliance checks (identity verification, rule evaluation) consume significant gas on Ethereum.
- **Mitigation:**
  - Primary execution on Polygon (gas cost ~1% of Ethereum)
  - Ethereum used only for: initial token minting, high-value settlements (> $1M), bridge operations
  - Gas optimization: batch identity checks, cache compliance results, use view functions where possible
  - Gas price oracle: delay non-urgent transactions if gas > threshold (100 gwei on Ethereum)

---

## 12. Liquidity Pool Layer

**Purpose:** Manage diversified pools of industrial financings with yield-bearing uLP tokens. This layer enables institutional investors to invest in pooled assets rather than individual assets, providing diversification and professional management.

**Components:**
- `ULPToken.sol` — Yield-bearing ERC-3643 token (value-accrual model)
- `LiquidityPool.sol` — Pool management contract (multiple financings)
- `YieldDistributor.sol` — Automated yield distribution to uLP holders
- `BankEscrow.sol` — Bank escrow integration contract
- `PoolRegistry.sol` — Pool creation and tracking
- `YieldCalculator` — Backend service for NAV calculation

**Inputs:**
- Institutional investor deposits (Ujamaa Euro (UJEUR) via Fireblocks or bank escrow)
- Industrial repayments (principal + interest from GDIZ partners)
- Pool manager commands (deploy funds, distribute yield)
- Oracle price feeds (Ujamaa Euro (UJEUR)/USD, portfolio valuation)

**Outputs:**
- uLP tokens (minted on deposit, burned on redemption)
- Ujamaa Euro (UJEUR) (redeemed by institutional investors)
- Yield events (accrued to uLP holders via NAV increase)
- Pool statistics (TVL, allocation, performance metrics)
- Proof of Reserve attestations (on-chain)

**Inter-Layer Dependencies:**
- Depends on **Tokenization Layer** for Ujamaa Euro (UJEUR) token contract
- Depends on **Smart Contracts Layer** for compliance enforcement (ERC-3643)
- Depends on **Oracles Layer** for NAV calculation and price feeds
- Depends on **Payments Layer** for Ujamaa Euro (UJEUR) distribution
- Produces events for **Auditability Layer** (deposits, redemptions, yield)
- Integrates with **Fireblocks Custody** (institutional asset protection)

**Key Design Decisions:**
- **Value-Accrual Model:** Token balance constant, NAV increases with yield (not rebasing)
- **Pool Families:** Separate pools by asset class (Pool Industrie, Pool Agriculture, Pool Trade Finance, Pool Renewable Energy)
  - See Section 2.2 (Function 23) for Pool Families Specification
  - Each family has distinct risk profile, yield target, and governance
  - Cross-family diversification limits enforced
- **Diversification Limits:** Max 20% per industrial, max 40% per asset class
- **Yield Distribution:** Automatic (no manual claims), pro-rata to all uLP holders
- **Bank Escrow:** Real BIIC/MCB bank integration for escrow accounts
- **Institutional Minimum:** €100,000 minimum investment (enforced by smart contract)
- **Redemption:** Instant (no lock-up), Ujamaa Euro (UJEUR) payout

**Smart Contract Architecture:**
```solidity
// ULPToken.sol - Yield-bearing ERC-3643
contract ULPToken is ERC3643 {
    function deposit(uint256 eurcAmount) external returns (uint256 ulpAmount);
    function redeem(uint256 ulpAmount) external returns (uint256 eurcAmount);
    function getValue(address account) external view returns (uint256);
    function getValuePerShare() external view returns (uint256); // NAV
}

// LiquidityPool.sol - Pool management
contract LiquidityPool {
    function createPool(string name) external returns (uint256 poolId);
    function deployToIndustrial(...) external returns (uint256 financingId);
    function recordRepayment(...) external;
    function getPoolStats(uint256 poolId) external view returns (PoolStats);
}
```

**Backend Services:**
```python
# backend/services/pool/yield_calculation.py
class YieldCalculator:
    def calculate_nav_per_share(pool_value: int, total_shares: int) -> int:
        """Calculate NAV per Ujamaa Pool Token (uLP) (18 decimals)."""

    def calculate_yield_accrual(principal: int, rate: int, days: int) -> int:
        """Calculate yield accrued over time."""

# backend/services/pool/pool_manager.py
class PoolManager:
    def create_pool(name: str, family: str) -> UUID:
        """Create new liquidity pool."""

    def deploy_to_industrial(pool_id: UUID, amount: int, rate: int) -> UUID:
        """Deploy funds to industrial financing."""
```

**Metrics & Monitoring:**
- TVL (Total Value Locked) per pool
- NAV per Ujamaa Pool Token (uLP) (real-time updates)
- Yield YTD (Year-to-Date)
- Pool utilization rate (deployed / total)
- Diversification metrics (Herfindahl index)
- Proof of Reserve ratio (on-chain attestation)

**Risk Management:**
- Diversification limits enforced by smart contract
- Industrial concentration limits (max 20%)
- Asset class limits (max 40% per class)
- Real-time NAV monitoring
- Proof of Reserve alerts (if reserves < TVL)
- Bank escrow reconciliation procedure documented

---

# 6. Database Design

## 6.1 PostgreSQL Schema

### Overview
PostgreSQL 15+ serves as the primary database for all off-chain data including asset metadata, investor profiles, transaction history, compliance records, and audit logs. The schema uses table partitioning for scalability, field-level encryption for PII, and row-level security for access control.

### 6.1.1 Database Constraints & Enhancements 🆕 (Post-Audit v2.1)

**Purpose:** This section addresses audit findings AUDIT-004 through AUDIT-007, AUDIT-038 through AUDIT-041 with comprehensive database constraints, soft-delete strategy, audit fields, foreign keys, indexes, CHECK constraints, and enums.

**Note:** The schema definitions below have been updated to include all enhancements. Legacy table definitions remain for reference but SHOULD be migrated to the enhanced schema.

#### PostgreSQL Enums for Categorical Fields (AUDIT-038)

```sql
-- Asset type enum
CREATE TYPE asset_type_enum AS ENUM (
    'INVOICE', 'RECEIVABLE', 'INVENTORY', 'PRODUCTION', 'SHIPMENT', 'CONTRACT',
    'REAL_ESTATE', 'PRIVATE_EQUITY', 'TRADE_FINANCE', 'ARTWORK', 'AGRICULTURE', 'MINING'
);

-- Pool family enum
CREATE TYPE pool_family_enum AS ENUM (
    'POOL_INDUSTRIE', 'POOL_AGRICULTURE', 'POOL_TRADE_FINANCE', 'POOL_RENEWABLE_ENERGY', 'POOL_REAL_ESTATE'
);

-- Status enums
CREATE TYPE asset_status_enum AS ENUM ('draft', 'pending_review', 'active', 'closed', 'cancelled');
CREATE TYPE transaction_type_enum AS ENUM ('mint', 'transfer', 'burn', 'distribution', 'deposit', 'redemption');
CREATE TYPE compliance_status_enum AS ENUM ('approved', 'blocked', 'pending_review');
CREATE TYPE kyc_status_enum AS ENUM ('pending', 'verified', 'rejected', 'expired', 'revoked');

-- ID Strategy (AUDIT-039): All public-facing IDs use UUID v4 (non-guessable, distributed-friendly)
```

#### Soft-Delete Strategy (AUDIT-004)

All transactional tables SHALL include soft-delete columns:
- `deleted_at TIMESTAMPTZ` — Timestamp of soft deletion (NULL = active)
- `deleted_by UUID REFERENCES users(id)` — User who performed deletion
- `deleted_reason TEXT` — Optional reason for deletion

**Partial Index for Active Records:**
```sql
CREATE UNIQUE INDEX idx_assets_unique_active ON assets(id) WHERE deleted_at IS NULL;
```

#### Audit Fields (AUDIT-005)

All transactional tables SHALL include audit actor columns:
- `created_by UUID REFERENCES users(id)` — User who created record
- `updated_by UUID REFERENCES users(id)` — User who last updated record

#### Foreign Key Constraints (AUDIT-006)

All foreign key relationships SHALL be explicitly defined with `ON DELETE` behavior:
```sql
CONSTRAINT fk_transactions_asset 
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE RESTRICT
CONSTRAINT fk_holdings_investor 
    FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE RESTRICT
```

#### CHECK Constraints for Business Rules (AUDIT-018)

```sql
-- Liquidity pools
CONSTRAINT chk_minimum_investment CHECK (minimum_investment >= 100000)  -- €100K minimum
CONSTRAINT chk_max_exposure_industrial CHECK (max_exposure_per_industrial <= 2000)  -- 20% max
CONSTRAINT chk_management_fee CHECK (management_fee_bps <= 500)  -- 5% max

-- Transactions
CONSTRAINT chk_amount_positive CHECK (amount >= 0)
CONSTRAINT chk_risk_score CHECK (risk_score IS NULL OR (risk_score >= 0 AND risk_score <= 1))
```

#### Composite Unique Constraints (AUDIT-040)

```sql
-- One holding per investor per asset
CONSTRAINT uq_holding_per_investor_asset UNIQUE (investor_id, asset_id)

-- One holding per investor per pool
CONSTRAINT uq_holding_per_investor_pool UNIQUE (investor_id, pool_id)
```

#### Missing Indexes (AUDIT-007, AUDIT-061)

```sql
-- Foreign key indexes
CREATE INDEX idx_investor_holdings_investor ON investor_holdings(investor_id);
CREATE INDEX idx_investor_holdings_asset ON investor_holdings(asset_id);
CREATE INDEX idx_transactions_wallet ON transactions(sender_wallet_hash);

-- Composite indexes
CREATE INDEX idx_transactions_asset_date ON transactions(asset_id, block_timestamp DESC);
CREATE INDEX idx_investors_jurisdiction_accreditation ON investors(jurisdiction, accreditation_status);
```

### Core Tables (Updated with v2.1 Enhancements)

#### `assets` Table
Stores tokenized asset metadata and configuration.

```sql
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL, -- 'real_estate', 'private_equity', 'trade_finance', 'artwork'
    description TEXT,
    originator_id UUID REFERENCES investors(id),
    token_contract_address VARCHAR(42) NOT NULL, -- ERC-3643 contract address
    blockchain VARCHAR(20) NOT NULL, -- 'ethereum', 'polygon'
    total_supply NUMERIC(36, 18) NOT NULL,
    decimals INTEGER NOT NULL DEFAULT 18,
    minimum_investment NUMERIC(36, 18) NOT NULL,
    jurisdiction_whitelist TEXT[], -- ISO 3166-1 alpha-2 country codes
    investor_cap INTEGER, -- NULL for unlimited (506(c))
    lockup_period_days INTEGER NOT NULL DEFAULT 0,
    legal_document_hash VARCHAR(66) NOT NULL, -- SHA-256 hash of offering memorandum
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'pending_review', 'active', 'closed'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_asset_type CHECK (asset_type IN ('real_estate', 'private_equity', 'trade_finance', 'artwork')),
    CONSTRAINT valid_blockchain CHECK (blockchain IN ('ethereum', 'polygon')),
    CONSTRAINT valid_status CHECK (status IN ('draft', 'pending_review', 'active', 'closed'))
);

-- Partitioning by asset_type for query optimization
CREATE TABLE assets_real_estate PARTITION OF assets FOR VALUES IN ('real_estate');
CREATE TABLE assets_private_equity PARTITION OF assets FOR VALUES IN ('private_equity');
CREATE TABLE assets_trade_finance PARTITION OF assets FOR VALUES IN ('trade_finance');
CREATE TABLE assets_artwork PARTITION OF assets FOR VALUES IN ('artwork');

-- Indexes
CREATE INDEX idx_assets_originator ON assets(originator_id);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_blockchain ON assets(blockchain);
CREATE INDEX idx_assets_created_at ON assets(created_at DESC);
```

#### `investors` Table
Stores investor profiles with pseudonymized wallet addresses and encrypted PII.

```sql
CREATE TABLE investors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address_encrypted BYTEA NOT NULL, -- AES-256 encrypted wallet address
    wallet_address_hash VARCHAR(66) NOT NULL, -- SHA-256 hash for indexing (no PII)
    onchainid_address VARCHAR(42) NOT NULL, -- ONCHAINID contract address
    full_name_encrypted BYTEA NOT NULL, -- AES-256 encrypted (PII)
    email_encrypted BYTEA NOT NULL, -- AES-256 encrypted (PII)
    date_of_birth_encrypted BYTEA, -- AES-256 encrypted (PII), nullable for entities
    national_id_encrypted BYTEA, -- AES-256 encrypted (PII)
    residential_address_encrypted BYTEA, -- AES-256 encrypted (PII)
    jurisdiction VARCHAR(2) NOT NULL, -- ISO 3166-1 alpha-2
    accreditation_status VARCHAR(20) NOT NULL, -- 'accredited', 'non_accredited', 'institutional'
    kyc_claim_id BIGINT NOT NULL, -- ONCHAINID claim ID
    kyc_claim_issuer VARCHAR(42) NOT NULL, -- Claim Issuer address
    kyc_issued_at TIMESTAMPTZ NOT NULL,
    kyc_expires_at TIMESTAMPTZ NOT NULL,
    kyc_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    encryption_key_id VARCHAR(255) NOT NULL, -- HashiCorp Vault key ID for this investor
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ, -- Soft delete for GDPR erasure tracking

    CONSTRAINT valid_accreditation CHECK (accreditation_status IN ('accredited', 'non_accredited', 'institutional')),
    CONSTRAINT valid_jurisdiction CHECK (LENGTH(jurisdiction) = 2)
);

-- Indexes (using hash column, not encrypted PII)
CREATE INDEX idx_investors_wallet_hash ON investors(wallet_address_hash);
CREATE INDEX idx_investors_onchainid ON investors(onchainid_address);
CREATE INDEX idx_investors_jurisdiction ON investors(jurisdiction);
CREATE INDEX idx_investors_accreditation ON investors(accreditation_status);
CREATE INDEX idx_investors_kyc_expires ON investors(kyc_expires_at);
CREATE INDEX idx_investors_deleted ON investors(deleted_at) WHERE deleted_at IS NOT NULL;
```

#### `transactions` Table
Records all token transfers with compliance metadata.

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_hash VARCHAR(66) NOT NULL,
    block_number BIGINT NOT NULL,
    block_timestamp TIMESTAMPTZ NOT NULL,
    asset_id UUID NOT NULL REFERENCES assets(id),
    token_contract_address VARCHAR(42) NOT NULL,
    sender_wallet_hash VARCHAR(66) NOT NULL,
    recipient_wallet_hash VARCHAR(66) NOT NULL,
    amount NUMERIC(36, 18) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'mint', 'transfer', 'burn', 'distribution'
    blockchain VARCHAR(20) NOT NULL,
    gas_used BIGINT,
    gas_price NUMERIC(36, 0),
    compliance_status VARCHAR(20) NOT NULL, -- 'approved', 'blocked', 'pending_review'
    risk_score NUMERIC(5, 4), -- 0.0000 to 1.0000 from fraud detection
    fraud_alert_id UUID, -- REFERENCES fraud_alerts(id) if flagged
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_transaction_type CHECK (transaction_type IN ('mint', 'transfer', 'burn', 'distribution')),
    CONSTRAINT valid_blockchain CHECK (blockchain IN ('ethereum', 'polygon')),
    CONSTRAINT valid_compliance_status CHECK (compliance_status IN ('approved', 'blocked', 'pending_review'))
);

-- Partitioning by month for scalability (100M+ transactions)
CREATE TABLE transactions_2026_02 PARTITION OF transactions
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE transactions_2026_03 PARTITION OF transactions
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
-- ... additional monthly partitions

-- Indexes
CREATE INDEX idx_transactions_asset ON transactions(asset_id);
CREATE INDEX idx_transactions_block_timestamp ON transactions(block_timestamp DESC);
CREATE INDEX idx_transactions_sender ON transactions(sender_wallet_hash);
CREATE INDEX idx_transactions_recipient ON transactions(recipient_wallet_hash);
CREATE INDEX idx_transactions_compliance ON transactions(compliance_status);
CREATE INDEX idx_transactions_risk_score ON transactions(risk_score DESC) WHERE risk_score > 0.8;
```

#### `identity_registry_mirror` Table
Off-chain mirror of ONCHAINID Identity Registry for GDPR-compliant identity resolution.

```sql
CREATE TABLE identity_registry_mirror (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address_hash VARCHAR(66) NOT NULL, -- SHA-256 hash (matches on-chain)
    onchainid_address VARCHAR(42) NOT NULL,
    claim_id BIGINT NOT NULL,
    claim_issuer_address VARCHAR(42) NOT NULL,
    claim_type VARCHAR(50) NOT NULL, -- 'kyc', 'accreditation', 'jurisdiction'
    claim_data_hash VARCHAR(66) NOT NULL, -- SHA-256 of claim data (no PII)
    claim_issued_at TIMESTAMPTZ NOT NULL,
    claim_expires_at TIMESTAMPTZ,
    claim_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    claim_revoked_at TIMESTAMPTZ,
    onchain_block_number BIGINT NOT NULL,
    onchain_transaction_hash VARCHAR(66) NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_claim_type CHECK (claim_type IN ('kyc', 'accreditation', 'jurisdiction'))
);

-- Unique constraint: one active claim per wallet per type
CREATE UNIQUE INDEX idx_identity_registry_active
    ON identity_registry_mirror(wallet_address_hash, claim_type)
    WHERE claim_revoked = FALSE;

-- Indexes
CREATE INDEX idx_identity_registry_wallet ON identity_registry_mirror(wallet_address_hash);
CREATE INDEX idx_identity_registry_claim_id ON identity_registry_mirror(claim_id);
CREATE INDEX idx_identity_registry_issuer ON identity_registry_mirror(claim_issuer_address);
CREATE INDEX idx_identity_registry_expires ON identity_registry_mirror(claim_expires_at);
```

#### `audit_logs` Table
Immutable audit log with cryptographic hash chaining.

```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_id UUID, -- REFERENCES investors(id) or NULL for system events
    actor_type VARCHAR(20) NOT NULL, -- 'investor', 'compliance_officer', 'system'
    action_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    before_state JSONB, -- State before change (NULL for creates)
    after_state JSONB, -- State after change (NULL for deletes)
    ip_address INET,
    user_agent TEXT,
    previous_hash VARCHAR(66) NOT NULL, -- SHA-256 of previous log entry
    current_hash VARCHAR(66) NOT NULL, -- SHA-256 of this entry (including previous_hash)

    CONSTRAINT valid_actor_type CHECK (actor_type IN ('investor', 'compliance_officer', 'system'))
);

-- Append-only enforcement via trigger (see Section 6.5)
-- Indexes
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
```

### Legal Architecture Tables (NEW in v1.2)

#### `enterprise_partners` Table
Stores Enterprise Partner (Asset Originator) information and onboarding status.

```sql
CREATE TABLE enterprise_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    company_registration_number VARCHAR(100),
    industry_classification VARCHAR(50) NOT NULL,
    jurisdiction VARCHAR(2) NOT NULL,  -- ISO 3166-1 alpha-2
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, APPROVED, SUSPENDED, REVOKED
    kyc_completed BOOLEAN DEFAULT FALSE,
    kyc_completed_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_industry CHECK (industry_classification IN (
        'MANUFACTURING', 'AGRICULTURE', 'MINING', 'TRADE',
        'SERVICES', 'ENERGY', 'REAL_ESTATE', 'TECHNOLOGY', 'OTHER'
    )),
    CONSTRAINT valid_status CHECK (status IN ('PENDING', 'APPROVED', 'SUSPENDED', 'REVOKED'))
);

-- Indexes
CREATE INDEX idx_enterprise_partners_industry ON enterprise_partners(industry_classification);
CREATE INDEX idx_enterprise_partners_jurisdiction ON enterprise_partners(jurisdiction);
CREATE INDEX idx_enterprise_partners_status ON enterprise_partners(status);
```

#### `asset_proofs` Table
Stores notarized asset/production proofs from Enterprise Partners (replaces gdiz_proofs).

```sql
CREATE TABLE asset_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enterprise_id UUID REFERENCES enterprise_partners(id),
    asset_hash VARCHAR(66) UNIQUE NOT NULL,
    asset_type VARCHAR(50) NOT NULL,  -- INVOICE, RECEIVABLE, INVENTORY, PRODUCTION, SHIPMENT, CONTRACT
    industry VARCHAR(50) NOT NULL,
    jurisdiction VARCHAR(2) NOT NULL,
    transaction_hash VARCHAR(66),
    data_encrypted BYTEA,  -- Encrypted raw data
    metadata JSONB,  -- Flexible metadata per industry
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_asset_type CHECK (asset_type IN (
        'INVOICE', 'RECEIVABLE', 'INVENTORY', 'PRODUCTION',
        'SHIPMENT', 'CONTRACT', 'OTHER'
    ))
);

-- Indexes
CREATE INDEX idx_asset_proofs_enterprise ON asset_proofs(enterprise_id);
CREATE INDEX idx_asset_proofs_type ON asset_proofs(asset_type);
CREATE INDEX idx_asset_proofs_hash ON asset_proofs(asset_hash);
```

#### `spvs` Table
Stores Special Purpose Vehicle (SPV) information for each tokenized asset.

```sql
CREATE TABLE spvs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_hash VARCHAR(66) UNIQUE NOT NULL,
    spv_token_address VARCHAR(42) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    originator_id UUID REFERENCES enterprise_partners(id),
    formation_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',  -- ACTIVE, DISSOLVED, DEFAULT
    governing_law VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_spvs_asset_hash ON spvs(asset_hash);
CREATE INDEX idx_spvs_status ON spvs(status);
CREATE INDEX idx_spvs_jurisdiction ON spvs(jurisdiction);
```

#### `legal_documents` Table
Stores encrypted legal document references with integrity hashes.

```sql
CREATE TABLE legal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spv_id UUID REFERENCES spvs(id),
    document_type VARCHAR(50) NOT NULL,  -- OFFERING_MEMO, LEGAL_OPINION, CUSTODY_AGREEMENT
    document_url VARCHAR(500) NOT NULL,  -- Encrypted S3 URL
    document_hash VARCHAR(66) NOT NULL,  -- SHA-256 for integrity
    version INTEGER DEFAULT 1,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_legal_documents_spv ON legal_documents(spv_id);
CREATE INDEX idx_legal_documents_type ON legal_documents(document_type);
CREATE INDEX idx_legal_documents_public ON legal_documents(is_public) WHERE is_public = TRUE;
```

#### `payment_oracle_reports` Table
Stores payment and default events reported by the payment oracle from Enterprise Partners.

```sql
CREATE TABLE payment_oracle_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_hash VARCHAR(66) NOT NULL,
    enterprise_id UUID REFERENCES enterprise_partners(id),
    report_type VARCHAR(50) NOT NULL,  -- PAYMENT, DEFAULT, PARTIAL_PAYMENT
    amount NUMERIC(20, 8),
    outstanding_balance NUMERIC(20, 8),
    days_overdue INTEGER,
    transaction_hash VARCHAR(66),
    reported_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payment_reports_asset ON payment_oracle_reports(asset_hash);
CREATE INDEX idx_payment_reports_type ON payment_oracle_reports(report_type);
CREATE INDEX idx_payment_reports_enterprise ON payment_oracle_reports(enterprise_id);
CREATE INDEX idx_payment_reports_created ON payment_oracle_reports(created_at DESC);
```

#### `distributions` Table
Records payment distributions to token holders.

```sql
CREATE TABLE distributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spv_id UUID REFERENCES spvs(id),
    amount NUMERIC(20, 8) NOT NULL,
    per_token_amount NUMERIC(36, 18) NOT NULL,
    total_holders INTEGER,
    transaction_hash VARCHAR(66),
    status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, COMPLETED, FAILED
    distribution_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_distributions_spv ON distributions(spv_id);
CREATE INDEX idx_distributions_status ON distributions(status);
CREATE INDEX idx_distributions_date ON distributions(distribution_date DESC);
```

#### `reserve_funds` Table
Tracks reserve fund balances for each SPV.

```sql
CREATE TABLE reserve_funds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spv_id UUID REFERENCES spvs(id) UNIQUE,
    target_amount NUMERIC(20, 8) NOT NULL,
    current_balance NUMERIC(20, 8) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'USDC',
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reserve_funds_spv ON reserve_funds(spv_id);
CREATE INDEX idx_reserve_funds_balance ON reserve_funds(current_balance);
```

#### `regulatory_filings` Table
Tracks regulatory filings by jurisdiction.

```sql
CREATE TABLE regulatory_filings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jurisdiction VARCHAR(100) NOT NULL,
    filing_type VARCHAR(50) NOT NULL,  -- DA-02, CIS-M1, etc.
    filing_period_start DATE NOT NULL,
    filing_period_end DATE NOT NULL,
    filed_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, FILED, OVERDUE
    document_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_regulatory_filings_jurisdiction ON regulatory_filings(jurisdiction);
CREATE INDEX idx_regulatory_filings_status ON regulatory_filings(status);
CREATE INDEX idx_regulatory_filings_period ON regulatory_filings(filing_period_end);
```

#### `investor_acknowledgments` Table
Records investor acknowledgments of risk factors and legal terms.

```sql
CREATE TABLE investor_acknowledgments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_id UUID REFERENCES investors(id),
    spv_id UUID REFERENCES spvs(id),
    acknowledgment_type VARCHAR(50) NOT NULL,  -- RISK_FACTORS, ACCREDITED_INVESTOR
    ip_address INET,
    user_agent TEXT,
    signed_message TEXT,  -- Cryptographic signature
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE(investor_id, spv_id, acknowledgment_type)
);

-- Indexes
CREATE INDEX idx_investor_ack_investor ON investor_acknowledgments(investor_id);
CREATE INDEX idx_investor_ack_spv ON investor_acknowledgments(spv_id);
CREATE INDEX idx_investor_ack_type ON investor_acknowledgments(acknowledgment_type);
```

### Indexing Strategy

**Primary Indexes:**
- All primary keys: B-tree (default)
- Foreign keys: B-tree for join performance
- Timestamp columns: B-tree with DESC for recent-first queries
- Hash columns (wallet_address_hash): B-tree for equality lookups

**Composite Indexes:**
```sql
-- Common query pattern: transactions by asset and date
CREATE INDEX idx_transactions_asset_date ON transactions(asset_id, block_timestamp DESC);

-- Common query pattern: investors by jurisdiction and accreditation
CREATE INDEX idx_investors_jurisdiction_accreditation
    ON investors(jurisdiction, accreditation_status);

-- Common query pattern: audit logs by actor and date
CREATE INDEX idx_audit_logs_actor_date ON audit_logs(actor_id, timestamp DESC);
```

**Partial Indexes:**
```sql
-- Only index high-risk transactions
CREATE INDEX idx_transactions_high_risk
    ON transactions(asset_id, risk_score)
    WHERE risk_score > 0.8;

-- Only index active (non-revoked) claims
CREATE INDEX idx_identity_registry_active_claims
    ON identity_registry_mirror(wallet_address_hash, claim_expires_at)
    WHERE claim_revoked = FALSE;
```

**Covering Indexes:**
```sql
-- Covering index for portfolio dashboard (avoids table lookup)
CREATE INDEX idx_investors_portfolio_covering
    ON investors(wallet_address_hash)
    INCLUDE (accreditation_status, jurisdiction, kyc_expires_at);
```

## 6.2 Redis Caching Strategy

### Cache Architecture
Redis 7+ serves as the caching layer for frequently accessed data, session storage, and real-time state. All cache entries have explicit TTLs to prevent stale data.

### Cache Keys and TTLs

| Cache Key Pattern | Data Type | TTL | Eviction Policy |
|-------------------|-----------|-----|-----------------|
| `asset:{asset_id}` | Asset metadata | 5 minutes | LRU |
| `investor:{wallet_hash}` | Investor profile (non-PII) | 10 minutes | LRU |
| `kyc:{wallet_hash}` | KYC claim validity (boolean) | 24 hours | LRU |
| `price:{symbol}` | Oracle price (ETH/USD, etc.) | 30 seconds | LRU |
| `session:{jwt_id}` | User session data | 30 days | LRU |
| `compliance:{asset_id}` | Compliance rules | 1 hour | LRU |
| `portfolio:{investor_id}` | Portfolio summary | 1 minute | LRU |
| `bridge:status` | Cross-chain bridge sync status | 5 minutes | LRU |
| `fraud:risk:{tx_hash}` | Fraud risk score | 7 days | LRU |

### Redis Configuration

```python
# Redis connection pool (FastAPI)
redis_pool = redis.asyncio.ConnectionPool(
    host="redis-master",
    port=6379,
    db=0,
    max_connections=100,
    decode_responses=True,
    socket_connect_timeout=5,
    socket_timeout=5,
)

# Cache decorator pattern
async def cache_get_or_set(key: str, ttl: int, fetch_func: Callable):
    """Get from cache or fetch and cache."""
    cached = await redis.get(key)
    if cached:
        return json.loads(cached)

    data = await fetch_func()
    await redis.setex(key, ttl, json.dumps(data))
    return data

# Usage example
@router.get("/assets/{asset_id}")
async def get_asset(asset_id: UUID):
    return await cache_get_or_set(
        f"asset:{asset_id}",
        ttl=300,  # 5 minutes
        fetch_func=lambda: asset_service.get_by_id(asset_id)
    )
```

### Eviction Policy
- **Policy:** `allkeys-lru` (evict least recently used keys across all keys)
- **Max Memory:** 8GB per Redis node
- **Sample Size:** 10 (number of keys sampled for LRU eviction)
- **Persistence:** RDB snapshots every 5 minutes + AOF (append-only file) for durability

### Cache Invalidation
- **Event-driven invalidation:** Blockchain events trigger cache deletion
- **Time-based invalidation:** TTL ensures eventual consistency
- **Manual invalidation:** Admin API endpoint for emergency cache flush

```python
# Event-driven cache invalidation
async def on_asset_updated(asset_id: UUID):
    await redis.delete(f"asset:{asset_id}")
    await redis.publish("cache_invalidation", f"asset:{asset_id}")
```

## 6.3 Kafka/Spark Pipelines

### Kafka Topic Design

| Topic Name | Partitions | Retention | Purpose |
|------------|------------|-----------|---------|
| `transactions` | 32 | 30 days | All token transfers (mint, transfer, burn) |
| `blocks` | 16 | 7 days | Block headers from Ethereum and Polygon |
| `identity_claims` | 16 | 90 days | ONCHAINID claim issuance/revocation events |
| `oracle_prices` | 8 | 7 days | Chainlink price feed updates |
| `alerts` | 16 | 90 days | Fraud detection alerts |
| `user_events` | 32 | 30 days | React frontend user actions |
| `audit_logs` | 16 | 7 years | Immutable audit log stream |

### Partition Strategy
- **Partition Key:** Wallet address hash (for transactions, identity_claims)
- **Rationale:** Ensures all events for a single wallet are ordered (critical for fraud detection)
- **Partition Count:** 32 partitions supports 10,000 transactions/second with headroom

### Kafka Configuration

```yaml
# kafka-values.yaml (Helm chart)
replicaCount: 3
persistence:
  size: 500Gi
  storageClass: gp3
config:
  log.retention.hours: 720  # 30 days
  log.segment.bytes: 1073741824  # 1GB
  num.partitions: 32
  default.replication.factor: 3
  min.insync.replicas: 2
```

### Spark Streaming Job

```python
# Spark structured streaming for behavioral analytics
from pyspark.sql import SparkSession
from pyspark.sql.functions import window, col, count

spark = SparkSession.builder \
    .appName("BehavioralAnalytics") \
    .getOrCreate()

# Read from Kafka
df = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:9092") \
    .option("subscribe", "transactions") \
    .option("startingOffsets", "latest") \
    .load()

# Parse JSON payload
transactions = df.selectExpr("CAST(value AS STRING) as json") \
    .select(from_json(col("json"), schema).alias("data")) \
    .select("data.*")

# Aggregate: transactions per wallet per 5-minute window
aggregated = transactions \
    .groupBy(window(col("block_timestamp"), "5 minutes"), col("sender_wallet_hash")) \
    .agg(count("*").alias("transaction_count")) \
    .filter(col("transaction_count") > 10)  # Alert threshold

# Write to PostgreSQL for alert dashboard
query = aggregated \
    .writeStream \
    .outputMode("complete") \
    .format("jdbc") \
    .option("url", "jdbc:postgresql://postgres:5432/ujamaa") \
    .option("dbtable", "behavioral_alerts") \
    .start()
```

### Flink CEP for Pattern Detection

```java
// Flink Complex Event Processing for wash trading detection
PatternDefinition pattern = PatternDefinition
    .<Transaction>begin("first")
    .where(WhereCondition.eq("transaction_type", "buy"))
    .next("second")
    .where(WhereCondition.eq("transaction_type", "sell"))
    .where(WhereCondition.eqField("wallet_hash", "first.wallet_hash"))
    .where(WhereCondition.eqField("asset_id", "first.asset_id"))
    .within(Time.hours(24));

PatternStream<Transaction> patternStream = CEP.pattern(
    transactionStream.keyBy(Transaction::getWalletHash),
    pattern
);

patternStream.select(new PatternSelectFunction<Transaction, Alert>() {
    public Alert select(Map<String, List<Transaction>> pattern) {
        // Create wash trading alert
        return new Alert("WASH_TRADING", pattern.get("first").get(0));
    }
});
```

## 6.4 GDPR Pseudonymization & On-Chain Identity Resolution

### GDPR Compliance Architecture

The Ujamaa DeFi Platform resolves the tension between GDPR Article 17 (right to erasure) and blockchain immutability through a **cryptographic erasure pattern**. This pattern ensures PII is never written on-chain while maintaining regulatory compliance for securities laws.

**Core Principle:** NO personally identifiable information (PII) is ever written to Ethereum or Polygon blockchains. ONCHAINID stores only hashed claim references (SHA-256 commitments), never raw identity data.

### Data Storage Locations

| Data Type | Storage Location | Encryption | Access Control |
|-----------|-----------------|------------|----------------|
| Full Name | PostgreSQL (encrypted) | AES-256 per subject | Vault key + RBAC |
| Email | PostgreSQL (encrypted) | AES-256 per subject | Vault key + RBAC |
| National ID | PostgreSQL (encrypted) | AES-256 per subject | Vault key + RBAC |
| Date of Birth | PostgreSQL (encrypted) | AES-256 per subject | Vault key + RBAC |
| Residential Address | PostgreSQL (encrypted) | AES-256 per subject | Vault key + RBAC |
| Wallet Address | PostgreSQL (encrypted) + ONCHAINID (hash) | AES-256 per subject | Vault key + RBAC |
| KYC Claim Hash | ONCHAINID (on-chain) | N/A (hash only) | Public (no PII revealed) |
| Claim Signature | ONCHAINID (on-chain) | N/A | Public (verifies Claim Issuer) |

### Cryptographic Erasure Implementation

**Encryption Key Management:**
- Each investor (data subject) has a unique AES-256 encryption key
- Keys stored in HashiCorp Vault (or AWS KMS), NEVER in PostgreSQL
- Key ID stored in `investors.encryption_key_id` column
- Key rotation: annual rotation with re-encryption of data

**Erasure Process (GDPR Article 17):**
```python
async def gdpr_erase_investor(investor_id: UUID, compliance_officer: User):
    """
    Implement GDPR right to erasure via cryptographic erasure.

    This does NOT modify the blockchain (impossible). Instead:
    1. Delete/destroy the encryption key for this investor
    2. Mark investor record as deleted (soft delete)
    3. Revoke ONCHAINID claims ( Claim Issuer action)

    Result: On-chain hash becomes orphaned pointer to unrecoverable data.
    """
    # 1. Retrieve Vault key ID
    investor = await db.investors.get(investor_id)
    key_id = investor.encryption_key_id

    # 2. Destroy encryption key in Vault (cryptographic erasure)
    await vault_client.secrets.kv.v2.delete_metadata_and_all_versions(
        path=f"pii-keys/{key_id}"
    )

    # 3. Soft delete investor record
    investor.deleted_at = datetime.utcnow()
    await db.session.commit()

    # 4. Revoke ONCHAINID claims (Claim Issuer action)
    await onchainid_client.revoke_claims(investor.onchainid_address)

    # 5. Log erasure action
    await audit_log.log(
        actor=compliance_officer,
        action="GDPR_ERASURE",
        resource=investor,
        details=f"Encryption key {key_id} destroyed"
    )
```

**Why This Satisfies Article 17:**
- GDPR requires data to be "erased" such that it is no longer recoverable
- Encrypted data without the key is cryptographically unrecoverable
- On-chain hash points to nothing (orphaned reference)
- No blockchain mutation required (preserves immutability)
- Regulators can verify erasure via Vault audit logs

### Data Portability (GDPR Article 20)

**Export API Endpoint:**
```python
@router.post("/api/v1/investors/me/export")
async def export_personal_data(
    current_investor: Investor = Depends(get_current_investor),
):
    """
    GDPR Article 20: Data portability.
    Return decrypted PII for authenticated data subject.
    """
    # 1. Retrieve encryption key from Vault
    key = await vault_client.secrets.kv.v2.read_secret(
        path=f"pii-keys/{current_investor.encryption_key_id}"
    )

    # 2. Decrypt all PII fields
    decrypted_data = {
        "full_name": decrypt(current_investor.full_name_encrypted, key),
        "email": decrypt(current_investor.email_encrypted, key),
        "date_of_birth": decrypt(current_investor.date_of_birth_encrypted, key),
        "national_id": decrypt(current_investor.national_id_encrypted, key),
        "residential_address": decrypt(current_investor.residential_address_encrypted, key),
        "wallet_address": decrypt(current_investor.wallet_address_encrypted, key),
        "transaction_history": await get_transaction_history(current_investor.id),
        "kyc_claims": await get_kyc_claims(current_investor.onchainid_address),
    }

    # 3. Return as JSON (downloadable)
    return decrypted_data
```

### Privacy by Design (GDPR Article 25)

**Technical Measures:**
- PII never enters blockchain transaction payload
- Smart contracts receive only wallet address (public) and claim hash (non-PII)
- FastAPI decrypts PII only when necessary (identity resolution for compliance)
- All PII access logged to audit_logs table

**Organizational Measures:**
- Role-based access control: only Compliance Officers can decrypt PII
- MFA required for PII access
- Quarterly access reviews
- Data Processing Agreements with all third parties

### Security of Processing (GDPR Article 32)

**Encryption:**
- AES-256-GCM for PII at rest (PostgreSQL)
- TLS 1.3 for PII in transit (all API endpoints)
- Envelope encryption: data encrypted with DEK, DEK encrypted with KEK in Vault

**Access Logs:**
```sql
CREATE TABLE pii_access_logs (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL,
    investor_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'decrypt', 'export', 'update'
    ip_address INET NOT NULL,
    user_agent TEXT,
    justification TEXT, -- Required for compliance officers
    approved_by UUID -- Supervisor approval for sensitive access
);
```

**Retention Policy:**
- PII retained for 5 years after last transaction
- Automatic deletion job runs monthly:
```python
async def pii_retention_job():
    """Delete PII for investors inactive >5 years."""
    cutoff = datetime.utcnow() - timedelta(days=5*365)

    inactive_investors = await db.session.query(Investor).filter(
        Investor.last_transaction_at < cutoff,
        Investor.deleted_at.is_(None)
    ).all()

    for investor in inactive_investors:
        # Check for regulatory hold
        hold = await db.regulatory_holds.get(investor.id)
        if hold:
            continue  # Skip if under investigation

        await gdpr_erase_investor(investor.id, system_user)
```

## 6.5 Immutable Audit Logs

### Schema Design

The `audit_logs` table implements cryptographic hash chaining (Merkle tree pattern) to ensure immutability. Any modification to a log entry invalidates all subsequent hashes.

```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_id UUID,
    actor_type VARCHAR(20) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    before_state JSONB,
    after_state JSONB,
    ip_address INET,
    user_agent TEXT,
    previous_hash VARCHAR(66) NOT NULL,
    current_hash VARCHAR(66) NOT NULL
);
```

### Append-Only Enforcement

**Database Trigger:**
```sql
-- Prevent UPDATE or DELETE on audit_logs
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        RAISE EXCEPTION 'Audit logs are immutable. UPDATE not allowed.';
    ELSIF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'Audit logs are immutable. DELETE not allowed.';
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_immutable
    BEFORE UPDATE OR DELETE ON audit_logs
    FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();
```

**Hash Chain Trigger:**
```sql
-- Automatically compute previous_hash and current_hash on INSERT
CREATE OR REPLACE FUNCTION compute_audit_log_hashes()
RETURNS TRIGGER AS $$
DECLARE
    prev_hash VARCHAR(66);
    content_to_hash TEXT;
BEGIN
    -- Get hash of previous log entry
    SELECT current_hash INTO prev_hash
    FROM audit_logs
    ORDER BY id DESC
    LIMIT 1;

    IF prev_hash IS NULL THEN
        prev_hash := '0x' || repeat('0', 64); -- Genesis block
    END IF;

    NEW.previous_hash := prev_hash;

    -- Compute current hash: SHA256(timestamp || actor || action || before || after || previous_hash)
    content_to_hash := row_to_json(NEW)::text;
    NEW.current_hash := encode(sha256(content_to_hash::bytea), 'hex');
    NEW.current_hash := '0x' || NEW.current_hash;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_compute_hashes
    BEFORE INSERT ON audit_logs
    FOR EACH ROW EXECUTE FUNCTION compute_audit_log_hashes();
```

### Cryptographic Signature Method

**Daily Merkle Root Anchoring:**
At midnight UTC each day, compute Merkle root of all audit logs and anchor to blockchain.

```python
async def anchor_daily_audit_logs():
    """Anchor daily audit log Merkle root to Ethereum/Polygon."""
    # 1. Get all logs from previous day
    yesterday = datetime.utcnow().date() - timedelta(days=1)
    logs = await db.session.query(AuditLog).filter(
        func.date(AuditLog.timestamp) == yesterday
    ).order_by(AuditLog.id).all()

    # 2. Build Merkle tree
    hashes = [log.current_hash for log in logs]
    merkle_root = compute_merkle_root(hashes)

    # 3. Anchor to blockchain (low-cost transaction)
    tx_hash = await blockchain_client.anchor_data(
        data_hash=merkle_root,
        chain='polygon'  # Use Polygon for low gas cost
    )

    # 4. Record anchor in database
    await db.audit_anchors.create(
        date=yesterday,
        merkle_root=merkle_root,
        transaction_hash=tx_hash,
        blockchain='polygon'
    )
```

**Integrity Verification:**
```python
async def verify_audit_log_integrity(start_date: date, end_date: date):
    """Verify audit log integrity by recomputing Merkle root."""
    # 1. Fetch logs
    logs = await db.session.query(AuditLog).filter(
        AuditLog.timestamp.between(start_date, end_date)
    ).order_by(AuditLog.id).all()

    # 2. Verify hash chain
    for i, log in enumerate(logs):
        if i == 0:
            expected_prev = '0x' + '0' * 64
        else:
            expected_prev = logs[i-1].current_hash

        if log.previous_hash != expected_prev:
            raise IntegrityError(f"Hash chain broken at log {log.id}")

        # Recompute current_hash
        expected_current = compute_hash(log)
        if log.current_hash != expected_current:
            raise IntegrityError(f"Log {log.id} hash mismatch")

    # 3. Verify Merkle root matches blockchain anchor
    merkle_root = compute_merkle_root([log.current_hash for log in logs])
    anchor = await db.audit_anchors.get_by_date(end_date)

    if anchor.merkle_root != merkle_root:
        raise IntegrityError("Merkle root does not match blockchain anchor")

    return True
```

### Storage Backend

**Primary Storage:** PostgreSQL `audit_logs` table (hot storage, 90 days)

**Archive Storage:** Amazon S3 Glacier (cold storage, 7 years)
```python
async def archive_audit_logs():
    """Move audit logs older than 90 days to S3 Glacier."""
    cutoff = datetime.utcnow() - timedelta(days=90)
    old_logs = await db.session.query(AuditLog).filter(
        AuditLog.timestamp < cutoff
    ).all()

    # Export to JSON
    export_data = [log.dict() for log in old_logs]
    json_content = json.dumps(export_data)

    # Upload to S3 Glacier
    s3_key = f"audit-logs/{cutoff.date()}.json.gz"
    await s3_client.put_object(
        Bucket="ujamaa-audit-archive",
        Key=s3_key,
        Body=gzip.compress(json_content.encode()),
        StorageClass="GLACIER"
    )

    # Delete from PostgreSQL (keep hash chain intact via Merkle root)
    await db.session.query(AuditLog).filter(
        AuditLog.timestamp < cutoff
    ).delete()
```

**Retention:** 7 years minimum (MiCA Article 22), configurable per jurisdiction.

---

# 7. Security Requirements

## ERC-3643 Transfer Restriction Enforcement

**Requirement:** All ERC-3643 token transfers MUST validate identity claims before execution. Transfers to/from wallets without valid KYC claims MUST revert.

**Implementation:**
```solidity
// ERC-3643 transferWithCompliance function
function transferWithCompliance(address to, uint256 amount) external override returns (bool) {
    // 1. Verify sender identity
    require(identityRegistry.isVerified(msg.sender), "Sender not verified");

    // 2. Verify recipient identity
    require(identityRegistry.isVerified(to), "Recipient not verified");

    // 3. Check compliance module rules
    require(complianceModule.canTransfer(msg.sender, to, amount), "Transfer violates compliance rules");

    // 4. Execute transfer
    return _transfer(msg.sender, to, amount);
}
```

**Testing:**
- Unit test: Transfer to unverified wallet reverts with "Recipient not verified"
- Integration test: Transfer between verified wallets succeeds
- Gas test: Transfer gas cost < 200,000 on Polygon, < 500,000 on Ethereum

## Smart Contract Audit Process

**Requirement:** All smart contracts MUST undergo third-party security audit before mainnet deployment. T-REX reference contracts MUST be audited separately.

**Audit Process:**
1. **Internal Review:** Smart contract developers complete security checklist (reentrancy, overflow, access control)
2. **Static Analysis:** Run Slither, Mythril, Semgrep on all contracts
3. **Formal Verification:** Certora or K framework for critical invariants (transfer restrictions, supply cap)
4. **Third-Party Audit:** Engage recognized auditor (Trail of Bits, OpenZeppelin, Consensys Diligence)
5. **Bug Bounty:** Launch Immunefi bug bounty program ($10,000–$1,000,000 rewards)
6. **Remediation:** Fix all high/critical findings; document medium/low findings
7. **Re-audit:** Auditor verifies fixes
8. **Deployment:** Only after audit report published publicly

**T-REX Contract Specifics:**
- Audit Identity Registry for claim validation logic
- Audit Compliance Module for rule enforcement
- Audit Trusted Issuers Registry for Claim Issuer management
- Verify ONCHAINID integration does not expose PII

## Proxy/Upgrade Patterns

**Requirement:** Upgradeable contracts MUST use UUPS (Universal Upgradeable Proxy Standard) pattern with timelock and multisig governance.

**Implementation:**
```solidity
// UUPS Proxy with timelock
contract UpgradeableProxy is Proxy, UUPSUpgradeable {
    TimelockController public timelock;

    function _authorizeUpgrade(address newImplementation) internal override onlyTimelock {
        // Upgrade authorized only by timelock contract
    }

    modifier onlyTimelock() {
        require(msg.sender == address(timelock), "Only timelock can upgrade");
        _;
    }
}

// Timelock with 48-hour delay
contract TimelockController is TimelockControllerUpgradeable {
    function execute(bytes32 id, uint256 delay) external override {
        require(getTimestamp(id) + delay <= block.timestamp, "Timelock: insufficient delay");
        // ... execute upgrade
    }
}
```

**Governance:**
- Upgrade proposal submitted by any multisig signer
- 48-hour timelock for community review
- Execution requires 3-of-5 multisig approval
- Emergency upgrade (security patch) requires 4-of-5 approval with 4-hour timelock

## Multisig Thresholds (Gnosis Safe)

**Requirement:** Platform treasury and admin functions MUST be protected by Gnosis Safe multisig with tiered approval thresholds.

**Configuration:**

| Operation | Threshold | Timelock | Signers |
|-----------|-----------|----------|---------|
| Operational withdrawal (<$100K) | 3-of-5 | None | Core team |
| Large withdrawal ($100K–$1M) | 4-of-5 | 24 hours | Core team + advisor |
| Critical withdrawal (>$1M) | 5-of-5 | 72 hours | All signers |
| Smart contract upgrade | 3-of-5 | 48 hours | Technical signers |
| Emergency pause | 2-of-3 | None | Security team |
| Compliance rule change | 3-of-5 | 48 hours | Compliance + legal |

**Signer Roles:**
- CEO (Chief Executive Officer)
- CTO (Chief Technology Officer)
- CFO (Chief Financial Officer)
- CCO (Chief Compliance Officer)
- Independent Advisor (external security expert)

## KYC/AML via ONCHAINID Claim Issuers

**Requirement:** All token holders MUST have valid ONCHAINID claims issued by trusted Claim Issuers. Claims MUST include KYC verification, accreditation status, and jurisdiction.

**Claim Issuer Requirements:**
- Licensed KYC/AML provider (e.g., Sumsub, Onfido, Jumio)
- HSM-stored signing keys
- Geographic distribution (minimum 3 Claim Issuers in different jurisdictions)
- SLA: 99.9% uLPime, <1 hour claim issuance time

**Claim Types:**
```solidity
enum ClaimType {
    KYC,           // Identity verified (name, DOB, address)
    ACCREDITATION, // Accredited investor status
    JURISDICTION,  // Permitted jurisdiction (country code)
    SANCTIONS      // OFAC sanctions check passed
}
```

**Claim Validation:**
```solidity
function isVerified(address wallet) public view returns (bool) {
    // Check KYC claim
    Claim[] memory claims = identityRegistry.getClaims(wallet);
    bool hasKyc = false;
    bool hasAccreditation = false;
    bool hasJurisdiction = false;

    for (uint i = 0; i < claims.length; i++) {
        if (claims[i].claimType == ClaimType.KYC && !claims[i].revoked) {
            hasKyc = true;
        }
        if (claims[i].claimType == ClaimType.ACCREDITATION && !claims[i].revoked) {
            hasAccreditation = true;
        }
        if (claims[i].claimType == ClaimType.JURISDICTION && !claims[i].revoked) {
            hasJurisdiction = true;
        }
    }

    return hasKyc && hasAccreditation && hasJurisdiction;
}
```

## GDPR Data Rights Implementation

**Requirement:** Platform MUST implement GDPR Articles 17 (erasure), 20 (portability), 25 (privacy by design), and 32 (security of processing).

**Implementation Summary:**
- **Article 17:** Cryptographic erasure via Vault key destruction (see Section 6.4)
- **Article 20:** Export API endpoint returning decrypted PII (see Section 6.4)
- **Article 25:** PII never written on-chain; only hashed claims in ONCHAINID
- **Article 32:** AES-256 encryption, TLS 1.3, access logs, Vault key management

**Verification:**
- Penetration test: Attempt to recover PII from blockchain (should fail)
- Audit: Verify Vault key destruction renders PostgreSQL data unrecoverable
- Compliance review: Confirm export API returns complete PII within 30 days

## Threat Model (STRIDE)

**Spoofing:**
- **Threat:** Attacker impersonates investor or compliance officer
- **Mitigation:** MFA for all authenticated endpoints, JWT with short expiry (15 minutes), wallet signature for blockchain actions
- **Test:** Attempt login without MFA (should fail)

**Tampering:**
- **Threat:** Attacker modifies audit logs or transaction history
- **Mitigation:** Cryptographic hash chaining, daily Merkle root anchoring to blockchain, append-only database triggers
- **Test:** Attempt UPDATE on audit_logs (should revert)

**Repudiation:**
- **Threat:** User denies performing action (e.g., trade, withdrawal)
- **Mitigation:** Immutable audit logs with IP address, user agent, and cryptographic signature
- **Test:** Verify audit log contains all user actions with non-repudiable evidence

**Information Disclosure:**
- **Threat:** PII leaked via API, database breach, or blockchain analysis
- **Mitigation:** PII encrypted at rest (AES-256), TLS 1.3 in transit, PII never on-chain, row-level security in PostgreSQL
- **Test:** Attempt to query PII without Compliance Officer role (should fail)

**Denial of Service:**
- **Threat:** Attacker floods API with requests, exhausts resources
- **Mitigation:** Rate limiting (100 req/min per user), DDoS protection (AWS WAF), autoscaling (Kubernetes HPA)
- **Test:** Load test with 10,000 concurrent requests (should maintain <500ms p99 latency)

**Elevation of Privilege:**
- **Threat:** Regular user gains admin or compliance officer access
- **Mitigation:** RBAC with database row-level security, Vault policies for key access, Kubernetes service accounts with minimal permissions
- **Test:** Attempt to access `/api/v1/compliance/*` as investor (should return 403)

## Penetration Testing Requirements

**Frequency:**
- Annual third-party penetration test (OWASP Top 10, SANS Top 25)
- Quarterly internal penetration test
- Pre-deployment penetration test for major releases

**Scope:**
- React frontend (XSS, CSRF, clickjacking)
- FastAPI backend (SQL injection, command injection, authentication bypass)
- Smart contracts (reentrancy, flash loan attacks, oracle manipulation)
- Kubernetes infrastructure (pod escape, RBAC misconfiguration)
- PostgreSQL database (privilege escalation, data exfiltration)

**Reporting:**
- All findings documented with CVSS scores
- Critical/High findings must be remediated before production deployment
- Medium/Low findings tracked in issue tracker with 90-day remediation SLA

## Secret Management (Vault/KMS)

**Requirement:** All secrets (API keys, database passwords, encryption keys) MUST be stored in HashiCorp Vault or AWS KMS. NEVER in code, environment variables, or configuration files.

**Vault Architecture:**
```
Vault Secrets Engine:
├── secrets/kv/v2/database-credentials/
│   ├── postgres-master
│   ├── postgres-replica
│   └── redis
├── secrets/kv/v2/api-keys/
│   ├── chainlink
│   ├── infura
│   └── alchemy
├── secrets/kv/v2/pii-keys/
│   ├── {investor_id}  # Per-investor encryption keys
│   └── ...
├── secrets/transit/encryption/  # Envelope encryption
│   └── pii-data-key
└── auth/kubernetes/  # Kubernetes service account auth
    └── ujamaa-services
```

**Access Policy:**
```hcl
# FastAPI backend policy
path "secrets/kv/v2/database-credentials/*" {
  capabilities = ["read"]
}

path "secrets/kv/v2/pii-keys/*" {
  capabilities = ["read"]
  allowed_parameters = {
    "key_id" = ["investor-*"]
  }
}

# Compliance Officer policy (PII decryption)
path "secrets/kv/v2/pii-keys/*" {
  capabilities = ["read", "delete"]  # Delete for GDPR erasure
}
```

**Key Rotation:**
- Database credentials: rotated monthly (automated via Vault)
- API keys: rotated quarterly (manual with dual control)
- PII encryption keys: rotated annually (automated with re-encryption)

## React Frontend Security

**Content Security Policy (CSP):**
```nginx
# Nginx CSP headers
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://api.ujamaa.fi wss://api.ujamaa.fi https://mainnet.infura.io;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
" always;
```

**XSS Prevention:**
- React automatically escapes JSX expressions (no innerHTML unless sanitized)
- DOMPurify for any user-generated content rendered as HTML
- No eval() or Function() constructors
- Subresource Integrity (SRI) for all CDN dependencies

**CSRF Prevention:**
- SameSite=Lax cookies for session tokens
- CSRF token in forms (double-submit cookie pattern)
- Wallet signature required for blockchain transactions (not just session)

**Additional Headers:**
```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

**Wallet Security:**
- Never store private keys in frontend
- Use MetaMask or WalletConnect for transaction signing
- Display transaction details clearly before signing (EIP-712 typed data)
- Warn users about phishing sites (domain verification in wallet)

---

# 8. Performance Requirements

## React Frontend Load Time

**Largest Contentful Paint (LCP):** < 2.0 seconds on 4G network (1.5 Mbps down, 750 ms RTT)

**Measurement:**
- Tool: Lighthouse CI integrated into pull requests
- Environment: Chrome DevTools throttling (Slow 4G preset)
- Benchmark: Median of 100 page loads across geographic regions

**Optimization Strategies:**
- Code splitting by route (React.lazy + Suspense)
- Image optimization (WebP format, lazy loading, responsive images)
- Preload critical resources (fonts, above-fold images)
- Server-side rendering (SSR) or static site generation (SSG) for initial page
- CDN for static assets (CloudFront, Cloudflare)

**First Input Delay (FID):** < 100 milliseconds

**Measurement:**
- Tool: Web Vitals Chrome extension, Real User Monitoring (RUM)
- Target: 95th percentile across all users

**Optimization Strategies:**
- Minimize main thread work (code splitting, web workers)
- Reduce JavaScript execution time (tree shaking, minification)
- Use React 19 concurrent features (transitions, Suspense)

**Cumulative Layout Shift (CLS):** < 0.1

**Measurement:**
- Tool: Lighthouse, Chrome User Experience Report (CrUX)
- Target: 90th percentile across all users

**Optimization Strategies:**
- Reserve space for images and embeds (aspect-ratio CSS)
- Avoid inserting content above existing content (no pop-ups without user action)
- Use font-display: swap with size-adjust for web fonts

## FastAPI Throughput

**Target:** 10,000 requests per second (async endpoints)

**Measurement:**
- Tool: k6 or Locust load testing
- Environment: Kubernetes cluster with 10 FastAPI pods (4 CPU, 16GB RAM each)
- Payload: 1KB JSON request, 5KB JSON response
- Latency constraint: p99 < 500ms at target throughput

**Optimization Strategies:**
- Async/await for all I/O operations (database, Redis, external APIs)
- Connection pooling (databases, Redis, HTTP clients)
- Response compression (gzip for >1KB responses)
- Caching with Redis (cache hit rate >85%)
- Database query optimization (indexes, covering indexes, query plan analysis)

**Benchmark Configuration:**
```python
# k6 load test script
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '5m', target: 5000 },   # Ramp to 5K RPS
    { duration: '10m', target: 10000 }, # Ramp to 10K RPS
    { duration: '30m', target: 10000 }, # Sustain 10K RPS
    { duration: '5m', target: 0 },      # Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<500'],   # p99 < 500ms
    http_req_failed: ['rate<0.01'],     # Error rate < 1%
  },
};

export default function() {
  let res = http.get('https://api.ujamaa.fi/api/v1/assets');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

## Cache Hit Rate (Redis)

**Target:** > 85% cache hit rate for all cached endpoints

**Measurement:**
```python
# Prometheus metrics
redis_hits_total: counter
redis_misses_total: counter
redis_hit_rate: redis_hits_total / (redis_hits_total + redis_misses_total)
```

**Alert Threshold:** Hit rate < 80% for 5 minutes (investigate cache invalidation or workload change)

**Optimization Strategies:**
- Cache warm-up on deployment (preload frequently accessed data)
- Appropriate TTLs (5 minutes for assets, 24 hours for KYC claims)
- Cache key design (avoid over-specificity that reduces hits)
- Monitor cache eviction rate (high eviction = undersized cache)

## 8.2 Disaster Recovery Specification 🆕 (AUDIT-047)

**Purpose:** This section defines Recovery Time Objective (RTO), Recovery Point Objective (RPO), failover procedures, and backup strategy.

### RTO and RPO Targets

| System Component | RTO (Max Downtime) | RPO (Max Data Loss) | Priority |
|------------------|-------------------|---------------------|----------|
| **PostgreSQL Primary** | 4 hours | 5 minutes | P1 (Critical) |
| **Redis Cache** | 1 hour | 0 (rebuildable) | P2 (High) |
| **FastAPI Services** | 30 minutes | 0 (stateless) | P1 (Critical) |
| **React Frontend** | 15 minutes | 0 (CDN cached) | P1 (Critical) |
| **Kafka Streams** | 2 hours | 1 hour | P2 (High) |
| **Fireblocks Integration** | 4 hours | 0 (external) | P1 (Critical) |
| **Bank Integration** | 8 hours | 0 (external) | P2 (High) |

### Failover Strategy

| Component | Failover Type | Trigger | Procedure |
|-----------|---------------|---------|-----------|
| **PostgreSQL** | Automatic (Patroni) | Primary unreachable >30 seconds | Replica promoted, VIP updated, application reconnected |
| **Redis** | Manual (Sentinel) | Primary unreachable >1 minute | Failover to replica, update connection strings |
| **Kubernetes** | Automatic (HPA) | Pod crash, node failure | Pod rescheduled, new node provisioned |
| **Region (AWS → GCP)** | Manual | Region-wide outage >1 hour | DNS failover, Terraform apply in DR region |

### Backup Strategy

| Data Type | Frequency | Retention | Storage | Encryption |
|-----------|-----------|-----------|---------|------------|
| **PostgreSQL Full** | Daily 02:00 UTC | 30 days (daily), 1 year (weekly) | S3 (hot), S3 Glacier (cold) | AES-256 (KMS-managed keys) |
| **PostgreSQL WAL** | Continuous | 7 days | S3 | AES-256 |
| **Redis Snapshot** | Every 5 minutes | 24 hours | S3 | AES-256 |
| **Terraform State** | On every apply | 90 days (versions) | S3 (versioned) | SSE-S3 |
| **Secrets (Vault)** | On every change | 30 days (versions) | Vault storage backend | Vault transit engine |

### DR Testing Requirements

| Test Type | Frequency | Scope | Success Criteria |
|-----------|-----------|-------|------------------|
| **Backup Restore** | Monthly | PostgreSQL full backup | Restore completes in <4 hours, data integrity verified |
| **Failover Test** | Quarterly | PostgreSQL primary → replica | Failover completes in <5 minutes, zero data loss |
| **Region Failover** | Annually | AWS → GCP | Full region failover in <4 hours, RPO <5 minutes |
| **Tabletop Exercise** | Monthly | All P1 components | Team demonstrates knowledge of runbooks |

### DR Runbooks

All DR procedures SHALL have documented runbooks:
- **RUNBOOK-DR-001:** PostgreSQL failover procedure
- **RUNBOOK-DR-002:** Region failover procedure
- **RUNBOOK-DR-003:** Fireblocks integration failure procedure
- **RUNBOOK-DR-004:** Bank integration failure procedure
- **RUNBOOK-DR-005:** Ransomware recovery procedure

## 8.3 Monitoring & Alerting Specification 🆕 (AUDIT-049, AUDIT-057)

**Purpose:** This section defines monitoring metrics, alert thresholds, escalation procedures, and on-call rotation.

### Infrastructure Metrics

| Metric | Source | Collection Interval | Retention | Alert Threshold |
|--------|--------|---------------------|-----------|-----------------|
| CPU Utilization | Prometheus node_exporter | 15 seconds | 90 days | >80% for 15 minutes (Warning), >90% for 5 minutes (Critical) |
| Memory Utilization | Prometheus node_exporter | 15 seconds | 90 days | >85% for 15 minutes (Warning), >95% for 5 minutes (Critical) |
| Disk Utilization | Prometheus node_exporter | 15 seconds | 90 days | >80% (Warning), >90% (Critical) |
| Network I/O | Prometheus node_exporter | 15 seconds | 90 days | >80% of interface capacity |
| Pod Restarts | Kubernetes metrics | 15 seconds | 30 days | >5 restarts in 10 minutes (Critical) |

### Application Metrics

| Metric | Source | Collection Interval | Retention | Alert Threshold |
|--------|--------|---------------------|-----------|-----------------|
| API Latency (p50, p95, p99) | Prometheus histogram | 15 seconds | 90 days | p99 >500ms for 10 minutes (Warning), >2s for 5 minutes (Critical) |
| Error Rate (4xx, 5xx) | Prometheus counter | 15 seconds | 90 days | >5% for 5 minutes (Critical) |
| Request Rate (req/sec) | Prometheus counter | 15 seconds | 90 days | >10,000 req/sec (Warning), sudden drop >50% (Critical) |
| Database Connections | PostgreSQL exporter | 15 seconds | 90 days | >80% of max (Warning), >95% (Critical) |
| Cache Hit Rate | Redis exporter | 15 seconds | 90 days | <80% for 10 minutes (Warning) |
| Queue Depth (Kafka) | Kafka exporter | 15 seconds | 90 days | >10,000 messages (Warning), >100,000 (Critical) |

### Business Metrics

| Metric | Source | Collection Interval | Retention | Alert Threshold |
|--------|--------|---------------------|-----------|-----------------|
| TVL (Total Value Locked) | Smart contract indexer | 5 minutes | 1 year | Drop >20% in 1 hour (Critical) |
| Daily Active Investors | FastAPI analytics | 1 hour | 1 year | Drop >50% vs. 7-day avg (Warning) |
| Redemption Rate | FastAPI analytics | 1 hour | 1 year | >30% of TVL in 24 hours (Critical - bank run detection) |
| KYC/KYB Approval Rate | Compliance service | 1 hour | 1 year | Drop >50% vs. baseline (Warning) |
| Failed Deposits | Fireblocks webhook | Real-time | 1 year | >10 failures in 1 hour (Critical) |

### Alert Escalation

| Severity | Channel | Response Time | On-Call |
|----------|---------|---------------|---------|
| **P1 (Critical)** | PagerDuty (phone call + SMS + push) | 15 minutes | 24/7 rotation |
| **P2 (High)** | Slack #alerts-high + Email | 1 hour | Business hours |
| **P3 (Medium)** | Slack #alerts-medium | 4 hours | Business hours |
| **P4 (Low)** | Email (daily digest) | Next business day | N/A |

### On-Call Rotation

| Role | Rotation | Backup | Escalation |
|------|----------|--------|------------|
| **DevOps Engineer** | Weekly (Monday 09:00 UTC) | Senior DevOps | Head of Engineering |
| **Backend Engineer** | Weekly (Monday 09:00 UTC) | Senior Backend | CTO |
| **Compliance Officer** | Weekly (Monday 09:00 UTC) | Senior Compliance | Chief Compliance Officer |

### Alertmanager Configuration

```yaml
route:
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'slack-notifications'
  routes:
  - match:
      severity: critical
    receiver: 'pagerduty-critical'
  - match:
      severity: high
    receiver: 'slack-high'
  - match:
      severity: medium
    receiver: 'slack-medium'

receivers:
- name: 'pagerduty-critical'
  pagerduty_configs:
  - service_key: '<PAGERDUTY_SERVICE_KEY>'
- name: 'slack-high'
  slack_configs:
  - api_url: '<SLACK_WEBHOOK_URL>'
    channel: '#alerts-high'
- name: 'slack-medium'
  slack_configs:
  - api_url: '<SLACK_WEBHOOK_URL>'
    channel: '#alerts-medium'
- name: 'slack-notifications'
  slack_configs:
  - api_url: '<SLACK_WEBHOOK_URL>'
    channel: '#alerts-all'
```

## 8.4 Measurable NFRs 🆕 (AUDIT-008, AUDIT-021, AUDIT-035, AUDIT-036)

**Purpose:** This section replaces vague NFRs with measurable, testable targets.

### Usability NFRs (AUDIT-008)

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Task Completion Rate** | >90% for primary flows (deposit, redeem, view portfolio) | User testing with 50+ participants |
| **Time-on-Task** | <5 minutes for KYC onboarding; <2 minutes for uLP deposit | Analytics tracking |
| **Error Rate** | <5% of user sessions result in error state | Frontend error tracking (Sentry) |
| **SUS Score** | >75 (post-beta testing with 50+ users) | System Usability Scale survey |
| **WCAG 2.1 AA** | 100% of success criteria met | Automated (axe) + manual testing |
| **NPS** | >50 (post-launch survey) | Net Promoter Score survey |

### Database Performance NFRs (AUDIT-036)

| Query Type | Target (p95) | Target (p99) | Measurement |
|------------|--------------|--------------|-------------|
| **Regulatory Report (1M+ rows)** | <30 seconds | <60 seconds | Load test with production data volume |
| **Portfolio Dashboard (5-table join)** | <2 seconds | <5 seconds | Synthetic monitoring |
| **Audit Log Search (date range + 3 filters)** | <5 seconds | <10 seconds | Synthetic monitoring |
| **Transaction History (100K rows, paginated)** | <1 second per page | <2 seconds per page | Synthetic monitoring |
| **NAV Calculation (real-time)** | <500ms | <1 second | Synthetic monitoring |

### Scalability NFRs (AUDIT-021)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Concurrent Users** | 10,000 concurrent users with p99 latency <500ms | Load test (k6) |
| **Auto-scaling** | Scale to 3x baseline traffic within 5 minutes | Chaos engineering test |
| **Database Scaling** | Add read replica when primary CPU >80% for 15 minutes | Automated scaling test |
| **Cache Scaling** | Add Redis node when memory >80% | Automated scaling test |

# 9. Scalability Requirements

**Target Gas Costs:**

| Operation | Ethereum (gas) | Polygon (gas) | Target USD Cost (Polygon) |
|-----------|---------------|---------------|---------------------------|
| ERC-3643 Transfer | 150,000–250,000 | 100,000–200,000 | < $0.01 |
| Mint Tokens | 500,000–800,000 | 300,000–500,000 | < $0.05 |
| Distribution (100 recipients) | 3,000,000–5,000,000 | 2,000,000–3,000,000 | < $0.50 |
| Bridge Lock (Ethereum) | 200,000–300,000 | N/A | ~$5–$10 (Ethereum) |
| Bridge Mint (Polygon) | N/A | 150,000–250,000 | < $0.01 |

**Measurement:**
- Tool: ApeWorX gas reporting, Etherscan gas tracker
- Environment: Production mainnet transactions
- Frequency: Every deployment, weekly monitoring

**Optimization Strategies:**
- Batch operations (multiple transfers in one transaction)
- Use view/pure functions where possible (no gas cost)
- Optimize storage (pack variables, use uint256 efficiently)
- Execute on Polygon for user-facing operations

## Autoscaling Thresholds (Kubernetes HPA)

**Horizontal Pod Autoscaler Configuration:**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: fastapi-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: fastapi
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  - type: Pods
    pods:
      metric:
        name: requests_per_second
      target:
        type: AverageValue
        averageValue: 1000
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 180  # 3 minutes
      policies:
      - type: Percent
        value: 100
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 600  # 10 minutes
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
```

**Scale-Up Trigger:**
- CPU > 70% average for 3 minutes
- Memory > 80% average for 3 minutes
- Requests per second > 1000 per pod for 3 minutes

**Scale-Down Trigger:**
- CPU < 30% average for 10 minutes
- Memory < 40% average for 10 minutes
- Requests per second < 500 per pod for 10 minutes

**Cluster Autoscaler:**
- Trigger: Pods pending due to insufficient resources
- Scale-up: Add 1 node per 5 pending pods
- Scale-down: Remove node if utilization < 50% for 30 minutes

## Prometheus Alert Thresholds

**Critical Alerts (Page On-Call):**

| Alert Name | Condition | Severity | Action |
|------------|-----------|----------|--------|
| HighErrorRate | Error rate > 5% for 5 minutes | Critical | Page on-call engineer |
| HighLatency | p99 latency > 2s for 10 minutes | Critical | Page on-call engineer |
| PodCrashLooping | Pod restarts > 5 in 10 minutes | Critical | Page on-call engineer |
| DatabaseDown | PostgreSQL connection failures > 10 in 1 minute | Critical | Page on-call engineer |
| BridgeSyncLag | Cross-chain sync lag > 4 hours | Critical | Page compliance officer |
| FraudDetectionDown | Fraud scoring service unavailable > 5 minutes | Critical | Page on-call engineer |

**Warning Alerts (Slack Notification):**

| Alert Name | Condition | Severity | Action |
|------------|-----------|----------|--------|
| HighCPU | CPU > 80% for 15 minutes | Warning | Investigate scaling |
| HighMemory | Memory > 85% for 15 minutes | Warning | Investigate memory leak |
| CacheHitRateLow | Redis hit rate < 80% for 10 minutes | Warning | Review cache strategy |
| DiskSpaceLow | Disk usage > 80% | Warning | Plan capacity expansion |
| CertificateExpiring | TLS certificate expires < 14 days | Warning | Renew certificate |
| KYCExpiringSoon | >100 investors with KYC expiring in 7 days | Warning | Notify investors |

**Alertmanager Configuration:**
```yaml
route:
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'slack-notifications'
  routes:
  - match:
      severity: critical
    receiver: 'pagerduty-critical'
  - match:
      severity: warning
    receiver: 'slack-warnings'

receivers:
- name: 'pagerduty-critical'
  pagerduty_configs:
  - service_key: '<PAGERDUTY_SERVICE_KEY>'
- name: 'slack-notifications'
  slack_configs:
  - api_url: '<SLACK_WEBHOOK_URL>'
    channel: '#alerts'
- name: 'slack-warnings'
  slack_configs:
  - api_url: '<SLACK_WEBHOOK_URL>'
    channel: '#alerts-warnings'
```

## Audit Log Write/Query Latency

**Write Latency:**
- Target: p99 < 50ms for audit log inserts
- Measurement: Prometheus histogram `audit_log_write_duration_seconds`
- Alert: p99 > 100ms for 10 minutes

**Query Latency:**
- Target: p99 < 500ms for audit log queries (last 7 days)
- Target: p99 < 2s for audit log queries (last 90 days)
- Measurement: Prometheus histogram `audit_log_query_duration_seconds`
- Alert: p99 > 1s (7-day) or > 5s (90-day) for 10 minutes

**Optimization Strategies:**
- Partition audit_logs by month (see Section 6.1)
- Index on timestamp, actor_id, action_type
- Archive logs older than 90 days to S3 Glacier
- Use covering indexes for common queries

## Cross-Chain Bridge Finality Time

**Ethereum → Polygon:**
- Target: < 15 minutes from lock transaction to wrapped token mint
- Breakdown:
  - Ethereum block confirmation: 2 minutes (12 blocks at 12s/block)
  - Relayer attestation: 5 minutes (5-of-9 multisig)
  - Polygon block confirmation: 1 minute
  - Buffer: 7 minutes (network congestion, relayer delays)

**Polygon → Ethereum:**
- Target: < 30 minutes from lock transaction to unwrapped token release
- Breakdown:
  - Polygon block confirmation: 1 minute (256 blocks at ~2s/block)
  - Relayer attestation: 5 minutes
  - Ethereum block confirmation: 2 minutes
  - Challenge period: 15 minutes (fraud proof window)
  - Buffer: 7 minutes

**Measurement:**
- Tool: Custom bridge monitoring service
- Metrics: `bridge_finality_duration_seconds{direction="eth_to_poly"}`
- Alert: Finality > 30 minutes (Ethereum→Polygon) or > 60 minutes (Polygon→Ethereum)

**Optimization Strategies:**
- Optimistic bridge for Polygon→Ethereum (reduce challenge period to 5 minutes)
- Multiple relayer networks for redundancy
- Gas price oracle for relayer transactions (avoid congestion delays)

---

# 9. Scalability Requirements

## Horizontal Scaling Strategy Per Layer

### FastAPI Microservices
**Scaling Unit:** Kubernetes Deployment with HPA
**Strategy:** Stateless services scale horizontally based on CPU/memory/request rate

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fastapi-assets
spec:
  replicas: 3  # Minimum for HA
  template:
    spec:
      containers:
      - name: fastapi
        image: ujamaa/fastapi:latest
        resources:
          requests:
            cpu: "1"
            memory: "2Gi"
          limits:
            cpu: "4"
            memory: "8Gi"
```

**Scaling Triggers:**
- CPU > 70%: Add pods (up to 50)
- Memory > 80%: Add pods (up to 50)
- Requests/sec > 1000 per pod: Add pods (up to 50)

**Database Connection Pooling:**
- PgBouncer sidecar for connection multiplexing (10,000 client connections → 500 database connections)
- Connection pool size: 20 per pod (50 pods × 20 = 1000 connections, PgBouncer reduces to 500)

### PostgreSQL
**Scaling Strategy:** Read replicas + partitioning + Citus for horizontal sharding

**Read Replicas:**
- 1 primary (read-write)
- 3 read replicas (read-only queries, reporting)
- Replication lag target: < 1 second

**Partitioning:**
- `transactions` table: partitioned by month (see Section 6.1)
- `audit_logs` table: partitioned by month
- Benefit: Queries scan only relevant partitions, not full table

**Citus Sharding (for 100M+ rows):**
```sql
-- Enable Citus extension
CREATE EXTENSION citus;

-- Shard transactions table by asset_id
SELECT create_distributed_table('transactions', 'asset_id');

-- Result: Data distributed across worker nodes, queries parallelized
```

**Scaling Triggers:**
- Primary CPU > 80%: Add read replica
- Storage > 80%: Add worker node (Citus)
- Write throughput > 10,000/sec: Consider sharding

### Redis
**Scaling Strategy:** Redis Cluster with sharding

**Configuration:**
- 6 nodes (3 masters, 3 replicas)
- 16384 hash slots distributed across masters
- Automatic failover if master fails

**Scaling Triggers:**
- Memory > 80%: Add new master node (rebalance slots)
- CPU > 80%: Add replica for read scaling
- Connections > 10,000: Add proxy (Twemproxy or Codis)

### Kafka
**Scaling Strategy:** Add brokers + increase partitions

**Broker Scaling:**
- Start: 3 brokers (minimum for HA)
- Scale to: 9 brokers for high throughput
- Replication factor: 3 (tolerate 2 broker failures)

**Partition Scaling:**
- Initial: 32 partitions per topic
- Scale to: 128 partitions (requires topic recreation)
- Rule: Partitions >= max throughput (messages/sec) / 1000

**Consumer Scaling:**
- Consumer group with 32 consumers (1 per partition)
- Scale consumers to match partitions

## Kafka Partition Scaling

**Partition Count Formula:**
```
partitions = max(
    throughput_goal / throughput_per_partition,
    consumer_parallelism_goal
)
```

**Example Calculation:**
- Throughput goal: 10,000 messages/second
- Throughput per partition: 1,000 messages/second
- Consumer parallelism: 32 consumers
- Result: partitions = max(10, 32) = 32

**Partition Key Selection:**
- `transactions` topic: partition by `wallet_address_hash`
- Rationale: All transactions for a wallet are ordered (critical for fraud detection)
- Trade-off: Hot wallets may skew load (mitigate with salting if needed)

**Repartitioning Strategy:**
- Kafka does not support changing partition count for existing topic
- Solution: Create new topic with more partitions, migrate consumers
- Migration: Dual-write to old and new topic during transition

## Polygon as Primary Low-Cost Execution Chain

**Rationale:**
- Ethereum gas cost: ~$5–$50 per transaction (variable)
- Polygon gas cost: ~$0.001–$0.01 per transaction (100–1000x cheaper)
- Security trade-off: Ethereum has higher security (more validators, longer finality)

**Execution Strategy:**
- **User-facing operations on Polygon:**
  - Token transfers (secondary market trading)
  - Subscription purchases (primary market)
  - Compliance checks (identity verification)
  - Distribution claims (investor receives USDC)

- **Ethereum for high-value settlement:**
  - Initial token minting (one-time cost, high value)
  - Bridge operations (security critical)
  - Treasury movements (>$1M)
  - Smart contract upgrades (security critical)

**Throughput Comparison:**

| Chain | TPS | Block Time | Finality | Gas Cost (transfer) |
|-------|-----|------------|----------|---------------------|
| Ethereum | 15–30 | 12 seconds | ~15 min (probabilistic) | $5–$50 |
| Polygon | 30–50 | 2 seconds | ~5 min (checkpoint to Ethereum) | $0.001–$0.01 |

**Scaling Plan:**
- Target: 10,000 transactions/day on Polygon
- Capacity: Polygon supports 50 TPS = 4.3M transactions/day
- Headroom: 430x capacity buffer

## Cross-Chain Bridge Throughput Limits

**Bridge Architecture:**
- Lock-and-mint pattern (not liquidity pool)
- Relayer network: 9 nodes, 5-of-9 multisig for attestation
- Rate limiting: Prevent bridge drain in case of exploit

**Throughput Limits:**

| Direction | Daily Limit | Per-Transaction Limit | Cooldown |
|-----------|-------------|----------------------|----------|
| Ethereum → Polygon | $10M | $1M | None |
| Polygon → Ethereum | $10M | $1M | 15-minute challenge period |

**Scaling Strategy:**
- Increase relayer count (9 → 21 nodes, 11-of-21 multisig)
- Add parallel bridge contracts (sharding by token type)
- Optimistic bridge for Polygon→Ethereum (remove challenge period for trusted validators)

**Monitoring:**
- Metric: `bridge_volume_24h{direction}`
- Alert: Volume > 80% of daily limit
- Circuit breaker: Pause bridge if volume exceeds limit

## React Frontend CDN/Edge Delivery Strategy

**CDN Provider:** CloudFront (AWS) or Cloudflare

**Caching Strategy:**
- Static assets (JS, CSS, images): Cache for 1 year with versioned filenames
- HTML pages: Cache for 5 minutes (stale-while-revalidate)
- API responses: No CDN cache (dynamic data), use Redis instead

**Edge Computing:**
- Cloudflare Workers for:
  - A/B testing (route users to different frontend versions)
  - Geo-blocking (restrict access from sanctioned countries)
  - Bot detection (block scrapers before origin)

**Latency Targets:**
- Time to First Byte (TTFB): < 200ms from any geographic region
- First Contentful Paint (FCP): < 1.0 seconds on broadband

**Edge Locations:**
- Minimum: 10 edge locations (North America, Europe, Asia, South America)
- Target: 50+ edge locations for global coverage

## Audit Dashboard Query Optimization

**Challenge:** Regulatory reports query millions of transactions with identity resolution (requires PII decryption).

**Optimization Strategies:**

1. **Pre-aggregated Tables:**
```sql
-- Materialized view for daily transaction volume
CREATE MATERIALIZED VIEW mv_daily_transaction_volume AS
SELECT
    date(block_timestamp) as transaction_date,
    asset_id,
    blockchain,
    count(*) as transaction_count,
    sum(amount) as total_volume
FROM transactions
GROUP BY date(block_timestamp), asset_id, blockchain;

-- Refresh daily
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_transaction_volume;
```

2. **Query Result Caching:**
```python
# Cache regulatory report for 24 hours
@cache.cached(timeout=86400, key_prefix="regulatory_report")
async def generate_regulatory_report(start_date: date, end_date: date):
    # Expensive query with identity resolution
    ...
```

3. **Async Report Generation:**
```python
# For large reports, generate asynchronously
@router.post("/api/v1/reports/regulatory")
async def request_regulatory_report(
    request: ReportRequest,
    current_user: User = Depends(get_compliance_officer),
):
    # Queue report generation
    task_id = await celery.send_task("generate_regulatory_report", args=[request])

    # Return task ID for polling
    return {"task_id": task_id, "status": "pending"}

@router.get("/api/v1/reports/{task_id}")
async def get_report_status(task_id: str):
    task = AsyncResult(task_id)
    return {"status": task.status, "result": task.result if task.ready() else None}
```

4. **Database Index Tuning:**
```sql
-- Analyze query plans
EXPLAIN ANALYZE
SELECT * FROM transactions
WHERE block_timestamp BETWEEN '2026-01-01' AND '2026-01-31'
  AND compliance_status = 'approved';

-- Create index based on query pattern
CREATE INDEX idx_transactions_timestamp_compliance
    ON transactions(block_timestamp, compliance_status)
    WHERE compliance_status = 'approved';
```

5. **Columnar Storage for Analytics:**
- Use Amazon Redshift or Google BigQuery for analytical queries
- ETL pipeline: PostgreSQL → S3 → Redshift (nightly)
- Benefit: Columnar storage optimized for aggregations

## 9.5 CDN Specification 🆕 (AUDIT-060)

**Purpose:** This section defines CDN configuration, cache headers, and edge delivery strategy for React frontend.

### CDN Provider

- **Primary:** Cloudflare (global network with African edge locations)
- **Secondary:** AWS CloudFront (for AWS-hosted assets)
- **African Edge Locations:** Johannesburg, Lagos, Nairobi, Cairo (for <50ms latency)

### Cache Headers

| Asset Type | Cache-Control Header | Max-Age | Revalidation |
|------------|---------------------|---------|--------------|
| **Static JS/CSS (versioned)** | `public, max-age=31536000, immutable` | 1 year | None (filename changes on update) |
| **HTML Pages** | `public, max-age=300, stale-while-revalidate=60` | 5 minutes | Stale content served while revalidating |
| **Images (static)** | `public, max-age=86400` | 1 day | ETag-based revalidation |
| **Images (user-uploaded)** | `private, max-age=3600` | 1 hour | ETag-based revalidation |
| **API Responses** | `no-store` | N/A | Always fresh |

### Cache Invalidation

- **Versioned Filenames:** `app.abc123.js` — no manual invalidation needed
- **Manual Invalidation:** Cloudflare API for emergency cache purge
- **Purge Scope:** URL-level, prefix-level, or full cache purge

### Edge Computing (Cloudflare Workers)

| Use Case | Implementation |
|----------|----------------|
| **A/B Testing** | Route users to different frontend versions based on cookie |
| **Geo-blocking** | Block access from sanctioned countries (OFAC list) |
| **Bot Detection** | Challenge suspicious traffic (JS challenge, CAPTCHA) |
| **Request Transformation** | Add security headers, compress responses |

### Latency Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time to First Byte (TTFB)** | <200ms from any geographic region | Synthetic monitoring |
| **First Contentful Paint (FCP)** | <1.0 seconds on broadband | Real User Monitoring (RUM) |
| **Edge Cache Hit Rate** | >90% for static assets | Cloudflare analytics |

## 9.6 Offline State Specification 🆕 (AUDIT-064)

**Purpose:** This section defines offline behavior, cached data, and reconnection strategy for React PWA.

### Cached Data (Service Worker)

| Data Type | Cache Strategy | Max Staleness | Storage |
|-----------|---------------|---------------|---------|
| **Portfolio Summary** | Cache-first, network fallback | 24 hours | IndexedDB |
| **Transaction History (last 50)** | Cache-first, network fallback | 24 hours | IndexedDB |
| **Asset Listings** | Stale-while-revalidate | 1 hour | IndexedDB |
| **Static Assets (JS, CSS, images)** | Cache-first | Never (versioned) | Cache Storage API |

### Offline Behavior

| User Action | Online | Offline |
|-------------|--------|---------|
| **View Portfolio** | Fresh data from API | Cached data (with staleness indicator) |
| **View Transaction History** | Fresh data from API | Cached data (last 50 transactions) |
| **Make Deposit** | Process immediately | Disabled (show "You are offline" message) |
| **Make Redemption** | Process immediately | Disabled (show "You are offline" message) |
| **Download Statement** | Generate PDF | Disabled (show "You are offline" message) |

### Reconnection Strategy

1. **Detect Reconnection:** Service Worker listens for `online` event
2. **Auto-Refresh:** Trigger background sync for cached data
3. **User Notification:** Toast message: "You're back online. Data refreshed."
4. **Retry Queue:** Process any queued actions (if applicable)

### Offline Indicators

- **Banner:** "You are currently offline. Some features are limited." (top of page)
- **Staleness Indicator:** "Data is X hours old" (next to cached data)
- **Disabled Actions:** Grayed-out buttons with tooltip: "Requires internet connection"

## 9.7 API Deprecation Policy 🆕 (AUDIT-063)

**Purpose:** This section defines API versioning, deprecation timeline, and migration procedures.

### Versioning Strategy

- **Method:** URL path versioning (`/api/v1/`, `/api/v2/`)
- **Support Period:** Minimum 6 months overlap between versions
- **Breaking Changes:** New major version required (v1 → v2)
- **Non-Breaking Changes:** Additive changes allowed within major version

### Deprecation Timeline

| Phase | Duration | Actions |
|-------|----------|---------|
| **Announcement** | 6 months before deprecation | Email developers, update documentation, add `Deprecation` header |
| **Sunset Period** | 6 months | Continue serving v1, log all v1 usage, offer migration support |
| **Deprecation** | After 6 months | Return 410 Gone for v1 endpoints, redirect to v2 documentation |

### Deprecation Headers

All deprecated endpoints SHALL include:
```
Deprecation: true
Sunset: 2027-03-25
Link: <https://docs.ujamaa.fi/migration/v1-to-v2>; rel="deprecation"
```

### Migration Guide Requirements

All version migrations SHALL have:
- **Migration Guide:** Step-by-step instructions (v1 → v2)
- **Code Examples:** Before/after code snippets
- **Breaking Changes List:** Explicit list of breaking changes
- **Compatibility Layer:** Shim/adapter if feasible

### Usage Monitoring

- **Dashboard:** API usage by version (real-time)
- **Alert:** If >10% traffic on deprecated version after sunset date
- **Enforcement:** Return 410 Gone for deprecated version after sunset

## 9.8 Backup Verification Procedure 🆕 (AUDIT-066)

**Purpose:** This section defines backup integrity verification and restore testing procedures.

### Backup Verification

| Check | Frequency | Method | Success Criteria |
|-------|-----------|--------|------------------|
| **Checksum Verification** | Daily | SHA-256 hash comparison | Hash matches source data |
| **Encryption Verification** | Weekly | Attempt decryption with KMS key | Decryption succeeds |
| **Restore Test** | Monthly | Restore to staging environment | All tables restored, row counts match |
| **Application Test** | Quarterly | Run application against restored DB | All queries succeed, data integrity verified |

### Restore Test Procedure

1. **Provision Staging Environment:** Terraform apply in isolated VPC
2. **Download Backup:** From S3 Glacier (if archived)
3. **Decrypt Backup:** Using KMS key (HSM-stored)
4. **Restore to PostgreSQL:** `pg_restore` with verification
5. **Verify Data Integrity:**
   - Row counts match production
   - Checksum verification on critical tables
   - Foreign key integrity check
6. **Run Application Tests:** Full test suite against restored data
7. **Document Results:** Restore time, issues found, remediation

### Backup Encryption (AUDIT-100)

- **Algorithm:** AES-256-GCM
- **Key Management:** AWS KMS (CMK) or HashiCorp Vault
- **Key Rotation:** Annual rotation with re-encryption
- **Verification:** Monthly restore test (verify decryption succeeds)

## 9.9 Infrastructure Drift Detection 🆕 (AUDIT-067)

**Purpose:** This section defines infrastructure drift detection and remediation procedures.

### Drift Detection

- **Frequency:** Daily (automated Terraform plan)
- **Scope:** All Terraform-managed resources
- **Alert:** Slack #infra-alerts on drift detected

### Drift Classification

| Drift Type | Severity | Remediation |
|------------|----------|-------------|
| **Minor (tags, descriptions)** | Low | Auto-apply Terraform |
| **Moderate (security group rules)** | Medium | Manual review, apply within 24 hours |
| **Major (IAM policies, encryption)** | High | Emergency review, apply within 4 hours |
| **Critical (database deletion, key exposure)** | Critical | Immediate incident response |

### Drift Prevention

- **Access Control:** Production access limited to DevOps engineers
- **Change Management:** All changes via Terraform (no console access)
- **Audit Logging:** All manual changes logged with justification

## 9.10 Load Testing Specification 🆕 (AUDIT-035)

**Purpose:** This section defines load testing methodology, tools, and pass/fail criteria.

### Load Testing Tool

- **Primary:** k6 (open-source, scriptable in JavaScript)
- **Secondary:** Locust (Python-based, for complex scenarios)

### Test Scenarios

| Scenario | Description | Duration | Target |
|----------|-------------|----------|--------|
| **Baseline** | Normal traffic | 30 minutes | 100 concurrent users |
| **Peak** | Expected peak traffic | 1 hour | 1,000 concurrent users |
| **Stress** | Beyond expected peak | 30 minutes | 5,000 concurrent users until failure |
| **Spike** | Sudden traffic surge | 15 minutes | Ramp from 100 to 5,000 users in 30 seconds |
| **Soak** | Extended load | 8 hours | 500 concurrent users |

### Pass Criteria

| Metric | Baseline | Peak | Stress |
|--------|----------|------|--------|
| **p99 Latency** | <500ms | <500ms | <1s |
| **Error Rate** | <0.1% | <1% | <5% |
| **Recovery Time** | N/A | N/A | <5 minutes after stress |

### Test Data

- **Volume:** 1M transactions, 100K investors, 10K assets in test DB
- **Realism:** Anonymized production data (PII masked)
- **Refresh:** Before each test run

### CI/CD Integration

- **Trigger:** On every PR to main branch
- **Gate:** Fail build if baseline criteria not met
- **Report:** Published to PR description

## 9.11 MVP Success Criteria 🆕 (AUDIT-082)

| Metric | Target | Timeline |
|--------|--------|----------|
| **TVL (Total Value Locked)** | €10M | Within 3 months of launch |
| **Users** | 100 institutional investors (KYB approved) | Within 3 months |
| **Transactions** | 1,000 deposits/redemptions | First month |
| **Uptime** | 99.9% (max 8.76 hours downtime) | 3 months |
| **Security** | Zero critical vulnerabilities | Post-launch audit |

## 9.12 Future Enhancements (Post-MVP) 🆕

### MVP-2 (Should Have)
- Secondary market trading for uLP tokens
- Mobile applications (iOS, Android)
- Advanced analytics dashboard

### MVP-3 (Could Have)
- Cross-chain bridge (Ethereum ↔ Polygon)
- AI-powered portfolio recommendations
- Social features (investor forums)

### Won't Have (for now)
- Derivatives (futures, options on tokenized assets)
- Leveraged trading
- Anonymous/pseudonymous accounts

---

# 10. Compliance & Regulatory Requirements

## ERC-3643 / T-REX as Compliance Enforcement Mechanism

**Regulatory Basis:** Securities laws (US Securities Act of 1933, EU MiFID II) require that security tokens be transferred only to eligible investors. ERC-3643 embeds this requirement at the token contract level.

**Implementation:**
- **On-Chain Enforcement:** ERC-3643 `transferWithCompliance()` function validates identity claims before every transfer. Non-compliant transfers revert automatically.
- **No Off-Chain Workarounds:** Unlike ERC-20 with whitelist contracts (which can be bypassed), ERC-3643 compliance is intrinsic to the token standard.
- **Regulatory Audit Trail:** Every transfer includes compliance status (approved/blocked) in event logs, enabling regulators to verify enforcement.

**MiCA Alignment (EU):**
- **Article 4 (Authorization):** ERC-3643 tokens qualify as "security tokens" under MiCA, requiring authorized issuance platform
- **Article 22 (Record-Keeping):** ERC-3643 event logs satisfy 7-year transaction record requirement
- **Article 47 (Suspension):** Compliance Module can pause transfers for specific tokens (regulatory order compliance)

**SEC Considerations (US):**
- **Reg D 506(b):** ERC-3643 investor cap (max 199 non-accredited investors) enforced at subscription
- **Reg D 506(c):** Accreditation verification via ONCHAINID claims (no investor cap)
- **Reg S:** Jurisdiction whitelist restricts token holders to non-US persons for offshore offerings
- **Rule 144:** Holding period enforced by Compliance Module (tokens non-transferable for 6–12 months)

## AML/KYC via ONCHAINID (FATF Travel Rule Compatibility)

**FATF Travel Rule Requirement:** Virtual Asset Service Providers (VASPs) must transmit originator and beneficiary information for transfers >$1,000.

**ONCHAINID Implementation:**
- **Originator Information:** Claim Issuer signs KYC claim including name, jurisdiction, wallet address (all off-chain PII, on-chain hash only)
- **Beneficiary Information:** Recipient wallet's ONCHAINID claims verified before transfer
- **Travel Rule Data:** For cross-border transfers, Claim Issuer provides encrypted data package to counterparty Claim Issuer (IVMS101 format)

**Compliance Workflow:**
1. Investor completes KYC with Claim Issuer (Sumsub, Onfido, etc.)
2. Claim Issuer verifies identity documents, sanctions list, PEP database
3. Claim Issuer signs ONCHAINID claim (hash stored on-chain, PII off-chain)
4. Investor acquires ERC-3643 tokens (transfer validates claim)
5. For transfers >$1,000, Travel Rule data exchanged between Claim Issuers

**FATF Compliance Verification:**
- **Annual Audit:** Third-party audit of KYC procedures and Travel Rule implementation
- **Transaction Monitoring:** Real-time screening against sanctions lists (OFAC, EU, UN)
- **Suspicious Activity Reporting:** SAR filing for transactions meeting thresholds

## GDPR Implementation (Cryptographic Erasure Pattern)

**GDPR Article 17 (Right to Erasure):**
- **Challenge:** Blockchain immutability conflicts with erasure requirement
- **Solution:** Cryptographic erasure via key destruction
- **Process:**
  1. PII stored in PostgreSQL encrypted with AES-256 key per investor
  2. Encryption key stored in HashiCorp Vault (separate from data)
  3. ONCHAINID stores only claim hash (no PII)
  4. Erasure request: Destroy Vault key → PII becomes unrecoverable
  5. On-chain hash remains but points to nothing (orphaned reference)
- **Regulatory Acceptance:** ICO (UK) and CNIL (France) guidance acknowledges cryptographic erasure as valid implementation

**GDPR Article 20 (Data Portability):**
- **Implementation:** Export API endpoint returns decrypted PII for authenticated data subject
- **Format:** JSON, CSV, or XML (investor choice)
- **Timeline:** Within 30 days of request (GDPR requirement)
- **Verification:** Identity verified via wallet signature + MFA

**GDPR Article 25 (Privacy by Design):**
- **Implementation:** PII never enters blockchain transaction payload
- **Smart Contract Design:** Functions receive wallet address (public) and claim ID (non-PII)
- **Data Minimization:** Only necessary PII collected (name, jurisdiction, accreditation status)

**GDPR Article 32 (Security of Processing):**
- **Encryption:** AES-256-GCM for PII at rest, TLS 1.3 for PII in transit
- **Access Control:** RBAC with MFA, Vault policies for key access
- **Audit Logging:** All PII access logged with justification
- **Breach Notification:** 72-hour notification to supervisory authority (GDPR Article 33)

## MiCA (EU Crypto-Asset Regulation) Compliance

**MiCA Scope:** ERC-3643 tokens qualify as "security tokens" (Article 4(1)(20)) and "asset-referenced tokens" if backed by real-world assets.

**Key Requirements:**

**Article 12 (White Paper):**
- Tokenized assets require white paper with:
  - Asset description and valuation methodology
  - Rights attached to tokens (dividends, voting, redemption)
  - Risk factors (asset performance, liquidity, regulatory)
- White paper hash stored in ERC-3643 token metadata

**Article 22 (Record-Keeping):**
- Transaction records retained for 7 years
- ERC-3643 event logs + PostgreSQL audit_logs satisfy requirement
- Exportable format for regulator inspection

**Article 47 (Suspension/Redemption):**
- Platform must suspend trading on regulatory order
- Compliance Module `pause()` function accessible to multisig governance
- Redemption mechanism for asset-backed tokens (NAV-based buyback)

**Article 55 (Own Funds):**
- Platform operator must maintain capital reserves (€150,000 minimum)
- Gnosis Safe treasury with proof-of-reserves via Chainlink

**MiCA Authorization Process:**
1. Submit application to national competent authority (e.g., AMF in France, BaFin in Germany)
2. Provide: white paper, governance framework, AML/KYC procedures, security audit reports
3. Approval timeline: 25 working days (extendable to 45 days)
4. Passporting: Authorization valid across all EU member states

## SEC/CFTC Considerations for US Investors

**SEC (Securities and Exchange Commission):**

**Howey Test Analysis:**
- **Investment of Money:** Investors contribute USDC/USDT
- **Common Enterprise:** Tokenized assets pool investor funds
- **Expectation of Profit:** Investors expect returns from asset performance
- **Efforts of Others:** Returns depend on Asset Originator management
- **Conclusion:** ERC-3643 tokens are securities under Howey test

**Registration Requirements:**
- **Reg D Exemption:** Private placement to accredited investors (no SEC registration)
- **Reg S Exemption:** Offshore offering to non-US persons (no SEC registration)
- **Reg A+:** Mini-IPO for public offering (SEC registration required, $75M cap)

**Compliance Implementation:**
- Accreditation verification via ONCHAINID claims (Reg D 506(c))
- Jurisdiction whitelist restricts US persons to Reg D offerings (Reg S)
- Investor cap enforced by Compliance Module (Reg D 506(b): max 199 non-accredited)

**CFTC (Commodity Futures Trading Commission):**

**Commodity Status:**
- If tokenized asset is a commodity (e.g., real estate, artwork), CFTC has jurisdiction
- Platform may register as Swap Execution Facility (SEF) if derivatives offered

**Implementation:**
- Avoid derivatives (futures, options) on tokenized commodities
- Spot market trading only (no margin, no leverage)
- Legal opinion on commodity status before tokenization

## African Regulatory Compliance

**Overview:** The Ujamaa DeFi Platform is designed to comply with securities regulations, data protection laws, and AML/CFT requirements across African jurisdictions. The platform supports compliance with the following African regulatory frameworks:

### Nigeria (West Africa)
**Securities Regulation:**
- **SEC Nigeria Rules on Crowdfunding (2021):** Tokenized securities qualify as digital assets under SEC Nigeria jurisdiction
- **Investments and Securities Act (ISA) 2007:** Platform registration as digital assets exchange required
- **Requirements:** Minimum paid-up capital of ₦500 million (~$600,000), fit-and-proper test for directors, custody arrangements

**Data Protection:**
- **NDPR (Nigeria Data Protection Regulation) 2019:** PII processing requires consent, data subject rights (access, rectification, erasure)
- **NDPB (Nigeria Data Protection Bureau):** Platform must appoint Data Protection Officer, conduct privacy impact assessments

**AML/CFT:**
- **Money Laundering (Prevention and Prohibition) Act 2022:** Customer due diligence, suspicious transaction reporting to NFIU
- **Terrorism (Prevention and Prohibition) Act 2022:** Sanctions screening, PEP identification

**Reporting Requirements:**
- Quarterly returns to SEC Nigeria (transaction volume, investor count, capital adequacy)
- Annual audited financial statements
- Suspicious Transaction Reports (STRs) to NFIU within 7 days

### South Africa (Southern Africa)
**Securities Regulation:**
- **FAIS Act (Financial Advisory and Intermediary Services) 2002:** FSP (Financial Services Provider) license required
- **FSCA (Financial Sector Conduct Authority):** Platform regulation as crypto asset service provider (Declaration 138 of 2022)
- **Requirements:** FSP license, fit-and-proper requirements, professional indemnity insurance

**Data Protection:**
- **POPIA (Protection of Personal Information Act) 2013:** 8 conditions for lawful processing (accountability, purpose limitation, minimization, security)
- **Information Regulator:** Platform must register as responsible party, appoint Information Officer

**AML/CFT:**
- **FICA (Financial Intelligence Centre Act) 2001:** Accountable institution designation, customer due diligence, reporting to FIC
- **Sanctions:** Compliance with UN sanctions regime, autonomous sanctions under Regulations Act 1999

**Reporting Requirements:**
- Cash Threshold Reports (CTRs) for transactions >R25,000 (~$1,400)
- Suspicious and Unusual Activity Reports (SARs) to FIC
- Annual compliance report to FSCA

### Kenya (East Africa)
**Securities Regulation:**
- **Capital Markets Act 1989:** CMA (Capital Markets Authority) licensing for digital asset exchange
- **Virtual Asset Service Providers Regulations 2022:** VASP registration, minimum capital KES 5 million (~$40,000)
- **Requirements:** Local incorporation, fit-and-proper directors, custody arrangements, cybersecurity framework

**Data Protection:**
- **Data Protection Act 2019:** GDPR-aligned, data subject rights, data protection officer appointment
- **Office of the Data Protection Commissioner:** Registration as data controller/processor

**AML/CFT:**
- **Proceeds of Crime and Anti-Money Laundering Act 2009:** Reporting to FRC (Financial Reporting Centre)
- **Prevention of Terrorism Act 2012:** Sanctions screening, terrorist financing prevention

**Reporting Requirements:**
- Suspicious Transaction Reports to FRC within 3 days
- Annual compliance audit report to CMA
- Quarterly statistical returns (transaction volumes, investor demographics)

### Ghana (West Africa)
**Securities Regulation:**
- **SEC Act 2016 (Act 929):** SEC Ghana licensing for securities exchange
- **Digital Assets Framework (draft 2023):** Specific regulations for crypto asset platforms
- **Requirements:** Minimum capital GHS 10 million (~$800,000), local incorporation, fit-and-proper test

**Data Protection:**
- **Data Protection Act 2012 (Act 843):** Data Protection Commission registration
- **8 Data Protection Principles:** Lawfulness, purpose limitation, data minimization, accuracy, storage limitation, integrity, confidentiality

**AML/CFT:**
- **Anti-Money Laundering Act 2020 (Act 1044):** Financial Intelligence Centre (FIC) reporting
- **Anti-Terrorism Act 2012 (Act 838):** Sanctions compliance, terrorist financing prevention

**Reporting Requirements:**
- Suspicious Transaction Reports to FIC within 24 hours
- Annual compliance report to SEC Ghana
- Quarterly transaction returns

### Benin (West Africa)

**Market Overview:**
- **Capital:** Porto-Novo (administrative), Cotonou (economic hub)
- **Population:** 13 million (2023)
- **GDP:** $19.7 billion USD (2023)
- **Currency:** West African CFA Franc (XOF) - pegged to EUR at 655.957 XOF = 1 EUR
- **Key Sectors:** Agriculture (cotton, cashews, shea nuts), port services (Port of Cotonou), re-export trade, emerging oil & gas
- **Stock Exchange:** BRVM (Bourse Régionale des Valeurs Mobilières) - regional exchange based in Abidjan, Côte d'Ivoire; Benin companies listed via BRVM

**Securities Regulation:**
- **AMF-UEMOA** (Autorité des Marchés Financiers de l'UEMOA): Regional securities regulator based in Abidjan, Côte d'Ivoire; oversees securities markets across 8 UEMOA member states including Benin
- **Regulation UEMOA n° 01/2009/CM/UEMOA:** Governs securities offerings, collective investment schemes, and market intermediaries
- **OHADA Uniform Act on Commercial Companies:** Harmonized corporate law across 17 African countries including Benin; governs tokenized equity structures
- **Requirements:** Platform must register with AMF-UEMOA as digital asset service provider; minimum capital XOF 500 million (~$800,000); fit-and-proper test for directors; compliance with UEMOA investment services directive

**Data Protection:**
- **Loi n° 2017-20 du 20 avril 2017 sur la protection des données à caractère personnel:** Primary data protection law
- **Autorité de Protection des Données Personnelles (APDP-Benin):** Data protection authority; platform must register as data controller
- **Key Requirements:** Consent for data processing, data subject rights (access, rectification, erasure), cross-border transfer restrictions (adequacy decision required), data breach notification within 72 hours
- **Penalties:** Fines up to XOF 100 million (~$160,000) or 5% of annual turnover

**AML/CFT:**
- **Loi n° 2018-31 du 13 décembre 2018:** AML/CFT legislation implementing FATF recommendations
- **CENTIF-Benin** (Cellule Nationale de Traitement des Informations Financières): National FIU receiving suspicious transaction reports
- **GIABA Membership:** Subject to GIABA mutual evaluations; must comply with GIABA standards
- **Reporting Requirements:** Suspicious Transaction Reports (STRs) within 24 hours, Cash Transaction Reports (CTRs) for transactions >XOF 5 million (~$8,000), cross-border currency movement reports

**Central Bank & Foreign Exchange:**
- **BCEAO** (Banque Centrale des États de l'Afrique de l'Ouest): Regional central bank; Benin does not have independent monetary policy
- **Exchange Control:** XOF freely convertible to EUR; capital transfers to/from non-UEMOA countries require BCEAO approval for amounts >XOF 50 million (~$80,000)
- **Reporting Requirements:** Foreign investment registration with BCEAO via approved intermediary banks; quarterly foreign exchange position returns

**Tax Regime:**
- **Direction Générale des Impôts (DGI):** National tax authority
- **Corporate Tax:** 30% standard rate
- **Withholding Tax:** 10% on dividends, 10% on interest (reduced rates under tax treaties)
- **VAT:** 18% standard rate; financial services may be exempt
- **Tax Treaties:** Limited treaty network; UEMOA member states have reciprocal tax arrangements

**Reporting Requirements:**
- Annual compliance report to AMF-UEMOA
- Quarterly transaction statistics to AMF-UEMOA
- Suspicious Transaction Reports to CENTIF-Benin within 24 hours
- Annual audited financial statements (OHADA standards)
- Data protection compliance report to APDP-Benin annually

### Côte d'Ivoire (Ivory Coast) (West Africa)

**Market Overview:**
- **Capital:** Yamoussoukro (political), Abidjan (economic hub)
- **Population:** 28 million (2023)
- **GDP:** $78.8 billion USD (2023) - largest economy in WAEMU
- **Currency:** West African CFA Franc (XOF) - pegged to EUR
- **Key Sectors:** Cocoa (world's largest producer), coffee, cashews, rubber, palm oil, gold mining, oil & gas, port services (Port of Abidjan), telecommunications, financial services
- **Stock Exchange:** BRVM (Bourse Régionale des Valeurs Mobilières) - headquartered in Abidjan; 8 UEMOA countries connected
- **Regional Financial Hub:** Abidjan hosts AMF-UEMOA, BCEAO regional headquarters, BRVM, multiple international bank regional offices

**Securities Regulation:**
- **AMF-UEMOA** (Autorité des Marchés Financiers de l'UEMOA): Regional securities regulator headquartered in Abidjan; primary regulator for tokenized securities
- **BRVM Regulations:** Regional stock exchange rules governing securities listing, trading, and disclosure
- **Regulation UEMOA n° 01/2009/CM/UEMOA:** Investment services directive; platform authorization required
- **CMF-UEMOA** (Conseil des Marchés Financiers): Policy-setting body for UEMOA securities markets
- **Requirements:** Platform must obtain AMF-UEMOA authorization as digital asset service provider; minimum capital XOF 500 million (~$800,000); fit-and-proper test for directors; membership in BRVM for secondary trading; compliance with UEMOA collective investment scheme regulations

**Data Protection:**
- **Loi n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel:** Primary data protection law (pre-dates GDPR but similar principles)
- **Autorité de Protection des Données Personnelles (APDP-CI):** Data protection authority; platform must register as data controller/processor
- **Key Requirements:** Lawful basis for processing (consent, contract, legal obligation, legitimate interest), data subject rights (access, rectification, erasure, portability), data localization preference (data on Ivorian citizens should be stored in Côte d'Ivoire where possible), cross-border transfer restrictions
- **Penalties:** Fines up to XOF 100 million (~$160,000) or imprisonment up to 5 years for serious violations

**AML/CFT:**
- **Loi n° 2015-491 du 08 juillet 2015:** AML/CFT legislation implementing FATF recommendations
- **CENTIF-CI** (Cellule Nationale de Traitement des Informations Financières): National FIU receiving suspicious transaction reports; operates under Ministry of Economy and Finance
- **GIABA Membership:** Subject to GIABA mutual evaluations (last MER: 2019); must implement GIABA recommendations
- **GABOUCOF** (Groupe d'Action contre le Blanchiment d'Argent et le Financement du Terroriste en Côte d'Ivoire): Inter-ministerial coordination body
- **Reporting Requirements:** STRs within 24 hours of detection, CTRs for cash transactions >XOF 5 million (~$8,000), cross-border currency movement reports for amounts >XOF 10 million (~$16,000)

**Central Bank & Foreign Exchange:**
- **BCEAO** (Banque Centrale des États de l'Afrique de l'Ouest): Regional central bank; monetary policy set for 8 UEMOA member states
- **Exchange Control:** XOF freely convertible to EUR; capital transfers to non-UEMOA countries require BCEAO approval via approved intermediary for amounts >XOF 50 million (~$80,000)
- **Reporting Requirements:** Foreign investment registration with BCEAO (Form D for direct investment); quarterly foreign exchange position returns; repatriation of export proceeds mandatory within 90 days

**Tax Regime:**
- **Direction Générale des Impôts (DGI):** National tax authority
- **Corporate Tax:** 25% standard rate (reduced from 30% in 2020)
- **Withholding Tax:** 10% on dividends, 10% on interest, 15% on royalties (reduced under tax treaties)
- **VAT:** 18% standard rate; financial services exempt
- **Tax Treaties:** Tax treaty with France; UEMOA reciprocal tax arrangements with member states
- **Special Zones:** Companies in free trade zones (Port of Abidjan, Grand-Bassam) may qualify for tax holidays

**Reporting Requirements:**
- Annual compliance report to AMF-UEMOA
- Quarterly transaction statistics to AMF-UEMOA and BRVM
- Suspicious Transaction Reports to CENTIF-CI within 24 hours
- Annual audited financial statements (OHADA standards - Commissaire aux Comptes)
- Data protection compliance report to APDP-CI annually
- Foreign exchange position returns to BCEAO quarterly

### Senegal (West Africa)

**Market Overview:**
- **Capital:** Dakar
- **Population:** 17 million (2023)
- **GDP:** $33.3 billion USD (2023)
- **Currency:** West African CFA Franc (XOF) - pegged to EUR
- **Key Sectors:** Agriculture (peanuts, cotton, fish), mining (gold, phosphates), oil & gas (recent offshore discoveries), port services (Port of Dakar), telecommunications, tourism, financial services
- **Stock Exchange:** BRVM (Bourse Régionale des Valeurs Mobilières) - Senegal companies listed via BRVM; BRVM maintains Dakar office
- **Regional Hub:** Dakar serves as regional headquarters for many multinational corporations; emerging fintech hub

**Securities Regulation:**
- **AMF-UEMOA** (Autorité des Marchés Financiers de l'UEMOA): Regional securities regulator; Senegal falls under AMF-UEMOA jurisdiction
- **Regulation UEMOA n° 01/2009/CM/UEMOA:** Investment services directive; platform authorization required
- **OHADA Uniform Act:** Harmonized corporate law applies; governs tokenized equity and debt structures
- **Requirements:** Platform must obtain AMF-UEMOA authorization; minimum capital XOF 500 million (~$800,000); fit-and-proper test for directors; compliance with UEMOA market conduct rules; membership in BRVM for secondary trading

**Data Protection:**
- **Loi n° 2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel:** Primary data protection law (one of the earliest in West Africa)
- **CDP** (Commission de Protection des Données Personnelles): Data protection authority; platform must register as data controller
- **Key Requirements:** Consent for data processing, data subject rights (access, rectification, erasure), data localization preference for sensitive data, cross-border transfer restrictions (adequacy decision or standard contractual clauses required)
- **Penalties:** Fines up to XOF 100 million (~$160,000) or imprisonment up to 7 years for serious violations

**AML/CFT:**
- **Loi n° 2016-29 du 08 novembre 2016:** AML/CFT legislation implementing FATF recommendations
- **CENTIF-Sénégal** (Cellule Nationale de Traitement des Informations Financières): National FIU receiving suspicious transaction reports; operates under Ministry of Economy and Finance
- **GIABA Membership:** Subject to GIABA mutual evaluations (last MER: 2019); must implement GIABA recommendations
- **Reporting Requirements:** STRs within 24 hours of detection, CTRs for cash transactions >XOF 5 million (~$8,000), cross-border currency movement reports for amounts >XOF 10 million (~$16,000)

**Central Bank & Foreign Exchange:**
- **BCEAO** (Banque Centrale des États de l'Afrique de l'Ouest): Regional central bank; monetary policy set for 8 UEMOA member states
- **Exchange Control:** XOF freely convertible to EUR; capital transfers to non-UEMOA countries require BCEAO approval via approved intermediary for amounts >XOF 50 million (~$80,000)
- **Reporting Requirements:** Foreign investment registration with BCEAO (Form D for direct investment); quarterly foreign exchange position returns; repatriation of export proceeds mandatory within 90 days

**Tax Regime:**
- **Direction Générale des Impôts et des Domaines (DGID):** National tax authority
- **Corporate Tax:** 30% standard rate
- **Withholding Tax:** 10% on dividends, 10% on interest, 20% on royalties (reduced under tax treaties)
- **VAT:** 18% standard rate; financial services exempt
- **Tax Treaties:** Tax treaty with France; UEMOA reciprocal tax arrangements with member states
- **Special Zones:** Companies in special economic zones (Diamniadio SEZ) may qualify for tax incentives

**Reporting Requirements:**
- Annual compliance report to AMF-UEMOA
- Quarterly transaction statistics to AMF-UEMOA and BRVM
- Suspicious Transaction Reports to CENTIF-Sénégal within 24 hours
- Annual audited financial statements (OHADA standards - Commissaire aux Comptes)
- Data protection compliance report to CDP annually
- Foreign exchange position returns to BCEAO quarterly

### Mauritius (Offshore Financial Centre)
**Securities Regulation:**
- **FSC (Financial Services Commission) Licensing:** Global Business Licence (GBL) or Category 1 Global Business Licence
- **Virtual Asset and Initial Token Offering Services Act 2021:** VAITOS licensing for digital asset services
- **Requirements:** Minimum capital USD 50,000–500,000 depending on license type, local management company

**Data Protection:**
- **Data Protection Act 2017:** GDPR-aligned, Data Protection Office registration
- **Cross-border data transfers:** Permitted to jurisdictions with adequate protection (EU, UK, South Africa)

**AML/CFT:**
- **Financial Intelligence and Anti-Money Laundering Act 2002:** FSC supervision, FIU reporting
- **Prevention of Terrorism Act 2002:** Sanctions compliance

**Reporting Requirements:**
- Annual audited financial statements to FSC
- Suspicious Transaction Reports to FIU
- Quarterly statistical returns

### AfCFTA (Pan-African Trade)
**African Continental Free Trade Area:**
- **Protocol on Trade in Services:** Financial services liberalization, cross-border investment facilitation
- **Rules of Origin:** Tokenized assets must comply with rules of origin for preferential treatment
- **Pan-African Payment and Settlement System (PAPSS):** Integration for cross-border settlements in local currencies

**Reporting Requirements:**
- AfCFTA trade statistics reporting (cross-border investment flows)
- Rules of origin certification for asset-backed tokens
- Quarterly investment flow reports to AfCFTA Secretariat

### ESAAMLG (Eastern and Southern Africa Anti-Money Laundering Group)
**Membership:** South Africa, Kenya, Tanzania, Uganda, Ethiopia, Zambia, Zimbabwe, Malawi, Lesotho, Eswatini, Comoros, Angola, Mozambique, Madagascar, Seychelles, Mauritius, Botswana, Namibia, DRC

**Standards:**
- FATF 40 Recommendations implementation
- Mutual Evaluation Reports (MERs) compliance
- Cross-border cooperation on AML/CFT investigations

**Reporting Requirements:**
- Suspicious Transaction Reports to national FIUs (ESAAMLG member states)
- Cross-border currency movement reports (>USD 10,000)
- Annual AML/CFT compliance audit

### GIABA (West Africa Inter-Governmental Action Group against Money Laundering)
**Membership:** Nigeria, Ghana, Senegal, Côte d'Ivoire, Mali, Burkina Faso, Niger, Benin, Togo, Guinea, Guinea-Bissau, Sierra Leone, Liberia, Gambia, Cape Verde, Mauritania

**Standards:**
- FATF 40 Recommendations implementation
- Mutual Evaluation Reports (MERs) compliance
- Regional cooperation on AML/CFT

**Reporting Requirements:**
- Suspicious Transaction Reports to national FIUs (GIABA member states)
- Cross-border currency movement reports
- Annual AML/CFT compliance certification

### African Central Bank Requirements
**Foreign Exchange Controls:**
- **Nigeria (CBN):** Form M for imports, Form A for invisible transactions, repatriation limits
- **South Africa (SARB):** Exchange Control Regulations, authorized dealer approval for offshore investments
- **Kenya (CBK):** Form 2 for foreign investment registration, repatriation approval for non-residents
- **Ghana (Bank of Ghana):** Form 2 for foreign investment, repatriation through authorized dealer banks
- **UEMOA Member States (BCEAO):** Benin, Burkina Faso, Côte d'Ivoire, Guinea-Bissau, Mali, Niger, Senegal, Togo - XOF freely convertible to EUR; capital transfers to non-UEMOA countries require BCEAO approval via approved intermediary for amounts >XOF 50 million (~$80,000); foreign investment registration with BCEAO (Form D for direct investment); repatriation of export proceeds mandatory within 90 days

**Reporting Requirements:**
- Foreign investment registration with central bank
- Quarterly foreign exchange position returns
- Repatriation approval documentation for dividend/interest payments
- **BCEAO Specific:** Form D for direct investment, quarterly FX position returns, export proceeds repatriation declaration within 90 days

### African Securities Exchanges Association (ASEA)
**Membership:** 27 African stock exchanges (NSE, JSE, NSE Kenya, GSE, etc.)

**Cooperation:**
- Cross-listing of tokenized securities on African exchanges
- Harmonized disclosure standards
- Investor protection coordination

**Reporting Requirements:**
- Cross-listing disclosure documents
- Periodic financial reports (aligned with exchange requirements)
- Material event notifications

## Audit Trail Requirements Per Regulator Type

**EU Regulator (MiCA):**

**Required Reports:**
- **Transaction Log:** All transfers with timestamp, amount, parties (pseudonymized), compliance status
- **Investor Register:** List of token holders with jurisdiction, accreditation status, KYC expiry
- **AML Alerts:** Flagged transactions with investigation outcome
- **Capital Adequacy:** Proof of reserves (€150,000 minimum)

**Format:** XBRL or CSV
**Frequency:** Quarterly (or on-demand)
**Retention:** 7 years

**SEC (US):**

**Required Reports:**
- **Form D:** Notice of exempt offering (within 15 days of first sale)
- **Form D Amendment:** Annual update or material change
- **Beneficial Ownership Report:** Schedule 13D/G if >5% ownership
- **SAR (Suspicious Activity Report):** Within 30 days of suspicious transaction detection

**Format:** XBRL (Form D), PDF (SAR)
**Frequency:** One-time (Form D), ongoing (SAR)
**Retention:** 5 years (Form D), 5 years (SAR)

**Internal Auditor:**

**Required Reports:**
- **Full Audit Trail:** All user actions with identity resolution (PII decrypted)
- **Access Logs:** PII access with justification
- **Change Management:** Smart contract upgrades, configuration changes
- **Incident Reports:** Security incidents, breach notifications

**Format:** PDF with digital signature
**Frequency:** On-demand (internal audit schedule)
**Retention:** 10 years (internal policy)

**Regulator Access Mechanism:**
- **Read-Only Portal:** Secure web portal with SSO (SAML/OIDC)
- **Data Export:** SFTP delivery of encrypted reports
- **API Access:** Regulator-specific API keys with row-level security

**African Regulators:**

**SEC Nigeria:**
- **Required Reports:** Annual return, quarterly transaction statistics, beneficial ownership register
- **Format:** PDF (annual return), CSV (transaction data), XBRL (financial statements)
- **Frequency:** Annual (within 6 months of year-end), Quarterly (within 30 days of quarter-end)
- **Retention:** 7 years
- **Submission:** SEC Nigeria e-portal, physical copies for annual returns

**FSCA South Africa:**
- **Required Reports:** FSP annual compliance report, FAIS transaction logs, FICA reports
- **Format:** PDF (compliance report), CSV (transaction logs), XML (FICA reports)
- **Frequency:** Annual (within 90 days of year-end), Ongoing (FICA reports within 15 days)
- **Retention:** 5 years (FAIS), 5 years (FICA)
- **Submission:** FSCA e-portal, FIC GoAML system

**CMA Kenya:**
- **Required Reports:** Quarterly statistical returns, annual audited accounts, VASP compliance report
- **Format:** PDF (annual accounts), CSV (statistical returns), XML (VASP report)
- **Frequency:** Quarterly (within 30 days), Annual (within 4 months of year-end)
- **Retention:** 7 years
- **Submission:** CMA e-Citizen portal, physical copies for audited accounts

**SEC Ghana:**
- **Required Reports:** Annual return, quarterly transaction levy, suspicious transaction reports
- **Format:** PDF (annual return), CSV (transaction levy), XML (STRs)
- **Frequency:** Annual (within 3 months of year-end), Quarterly (within 14 days), Ongoing (STRs within 24 hours)
- **Retention:** 7 years
- **Submission:** SEC Ghana online portal, FIC GoAML system

**AMF-UEMOA (Benin, Côte d'Ivoire, Senegal):**
- **Required Reports:** Annual compliance report, quarterly transaction statistics, data protection compliance report, BCEAO foreign exchange position returns
- **Format:** PDF (compliance report), CSV (transaction statistics), XML (STRs to CENTIF)
- **Frequency:** Annual (within 6 months of year-end), Quarterly (within 30 days of quarter-end), Ongoing (STRs within 24 hours)
- **Retention:** 7 years (AMF-UEMOA), 5 years (CENTIF)
- **Submission:** AMF-UEMOA e-portal (https://www.amf-ue moa.org/), CENTIF GoAML system (country-specific), BCEAO reporting portal

**APDP-Benin (Data Protection):**
- **Required Reports:** Annual data protection compliance report, data breach notifications
- **Format:** PDF (compliance report), secure email (breach notifications)
- **Frequency:** Annual (within 3 months of year-end), Ongoing (breaches within 72 hours)
- **Retention:** 5 years
- **Submission:** APDP-Benin physical submission or secure email

**APDP-Côte d'Ivoire (Data Protection):**
- **Required Reports:** Annual data protection compliance report, data breach notifications
- **Format:** PDF (compliance report), secure email (breach notifications)
- **Frequency:** Annual (within 3 months of year-end), Ongoing (breaches within 72 hours)
- **Retention:** 5 years
- **Submission:** APDP-CI physical submission or secure email

**CDP-Senegal (Data Protection):**
- **Required Reports:** Annual data protection compliance report, data breach notifications
- **Format:** PDF (compliance report), secure email (breach notifications)
- **Frequency:** Annual (within 3 months of year-end), Ongoing (breaches within 72 hours)
- **Retention:** 5 years
- **Submission:** CDP-Senegal physical submission or secure email

**FSC Mauritius:**
- **Required Reports:** Annual audited financial statements, quarterly statistical returns, VAITOS compliance report
- **Format:** PDF (financial statements), CSV (statistical returns), PDF (compliance report)
- **Frequency:** Annual (within 6 months of year-end), Quarterly (within 30 days)
- **Retention:** 7 years
- **Submission:** FSC e-licensing portal

**AfCFTA Secretariat:**
- **Required Reports:** Cross-border investment flow statistics, rules of origin certifications
- **Format:** CSV (investment flows), PDF (rules of origin certificates)
- **Frequency:** Quarterly (within 45 days of quarter-end)
- **Retention:** 10 years
- **Submission:** AfCFTA electronic reporting system

**ASEA (African Securities Exchanges Association):**
- **Required Reports:** Cross-listing disclosure documents, periodic financial reports, material event notifications
- **Format:** PDF (disclosure documents), XBRL (financial reports), XML (material events)
- **Frequency:** Ongoing (material events within 24 hours), Periodic (aligned with exchange requirements)
- **Retention:** 7 years
- **Submission:** ASEA member exchange portals

## Compliance Framework Extensions (NEW in v1.2)

### Licensing Requirements

| Jurisdiction | License Type | Timeline | Cost (USD) | Owner |
|--------------|--------------|----------|------------|-------|
| **Nigeria** | Digital Token Issuer | 8-12 weeks | $25,000 | CEO/Legal |
| **Mauritius** | CIS Manager (FSC) | 10-14 weeks | $50,000 | CEO/Legal |
| **UEMOA** | Regional Authorization (AMF-UEMOA) | 12-16 weeks | $75,000 | CEO/Legal |
| **Kenya** | VASP License (CMA) | 8-12 weeks | $20,000 | Compliance Officer |
| **Ghana** | Capital Markets Intermediary (SEC) | 10-14 weeks | $30,000 | Compliance Officer |
| **Benin** | AMF-UEMOA Authorization | 12-16 weeks | Included in UEMOA | CEO/Legal |
| **Côte d'Ivoire** | AMF-UEMOA Authorization | 12-16 weeks | Included in UEMOA | CEO/Legal |
| **Senegal** | AMF-UEMOA Authorization | 12-16 weeks | Included in UEMOA | CEO/Legal |

**Pre-requisites:**
- Compliance officer hired (licensed)
- Legal counsel engaged (securities specialist)
- SPV structure documented
- Offering memorandum template approved
- AML/CFT policies documented
- Data protection officer appointed (for GDPR/NDPR/POPIA compliance)

### Compliance Officer Responsibilities

| Responsibility | Frequency | Output |
|----------------|-----------|--------|
| KYC/AML review | Per investor | Approval/rejection decision |
| Transaction monitoring | Daily | Fraud alert review |
| Regulatory filings | Quarterly/Monthly | Filed reports (DA-02, CIS-M1, etc.) |
| Policy updates | Annual | Updated compliance manual |
| Staff training | Quarterly | Training records |
| Audit coordination | Annual | Audit report |
| Regulator liaison | Ongoing | Correspondence log |
| Incident response | As needed | Incident report, regulatory notification |

### Audit Requirements

| Audit Type | Frequency | Auditor | Scope | Cost Estimate |
|------------|-----------|---------|-------|---------------|
| **Smart Contract Audit** | Before each major release | CertiK / Trail of Bits | All contract code | $50,000-100,000 |
| **Financial Audit** | Annual | Big Four (PwC, Deloitte, EY, KPMG) | SPV financial statements | $30,000-60,000 |
| **Compliance Audit** | Annual | Licensed compliance auditor | AML/CFT, KYC processes | $20,000-40,000 |
| **SOC 2 Type II** | Annual | CPA firm | Security controls | $40,000-80,000 |
| **Penetration Testing** | Semi-annual | Security firm | Infrastructure, applications | $15,000-30,000 |
| **GDPR/NDPR/POPIA Audit** | Annual | Data protection specialist | PII handling, erasure procedures | $10,000-20,000 |

### Incident Reporting Matrix

| Incident Type | Severity | Reporting Timeline | Recipients | Method |
|---------------|----------|-------------------|------------|--------|
| **Cybersecurity breach** | CRITICAL | 24 hours | Regulators, affected users | Secure email + phone |
| **Smart contract exploit** | CRITICAL | 24 hours | Regulators, token holders | Public notice + direct |
| **Asset default >10% of pool** | HIGH | 7 days | Regulators, token holders | Written notice |
| **Compliance violation** | HIGH | 7 days | Regulators | Secure portal |
| **Operational disruLPion >4 hours** | MEDIUM | 30 days | Regulators | Quarterly summary |
| **Customer complaint (escalated)** | MEDIUM | 30 days | Regulators | Quarterly summary |
| **Data breach (PII exposed)** | CRITICAL | 72 hours (GDPR) | Data protection authority, affected users | Secure notification |

### Regulatory Examination Readiness

**Examination Preparation:**
- Maintain examination-ready document repository (encrypted cloud storage)
- Designate examination coordinator (Compliance Officer)
- Conduct simulation examinations annually
- Maintain regulator contact list with escalation procedures

**Document Retention for Examinations:**
- Corporate records (10 years)
- Transaction records (7 years)
- KYC/AML records (5 years after relationship ends)
- Audit reports (10 years)
- Regulatory correspondence (10 years)
- Complaints log (5 years)

**Examination Response Procedures:**
1. Receive examination notice (typically 10-30 days advance)
2. Notify legal counsel and senior management
3. Designate examination team (Compliance Officer, Legal, IT)
4. Prepare document request list (typically 50-200 items)
5. Coordinate on-site or remote examination
6. Respond to findings within 30-60 days
7. Implement remediation plan

---

# 11. Appendices

## 11.1 Glossary

| Term | Definition |
|------|------------|
| **ERC-3643** | Ethereum token standard for permissioned tokens with on-chain identity verification and transfer restrictions (T-REX protocol) |
| **T-REX** | Token for Regulated Exchanges; reference implementation of ERC-3643 providing compliance modules and identity registry |
| **ONCHAINID** | Decentralized identity protocol storing verifiable claims on-chain without exposing PII |
| **Claim Issuer** | Trusted entity authorized to issue identity claims (KYC, accreditation) into ONCHAINID system |
| **Identity Registry** | Smart contract mapping wallet addresses to ONCHAINID identity records for compliance verification |
| **Compliance Module** | ERC-3643 component enforcing transfer rules, investor caps, jurisdiction restrictions, and holding periods |
| **Trusted Issuers Registry** | On-chain registry of authorized Claim Issuers whose signatures are accepted for identity verification |
| **Transfer Restriction** | ERC-3643 mechanism blocking token transfers to/from wallets without valid identity claims |
| **Security Token** | Digital asset representing ownership in underlying real-world asset, subject to securities regulations |
| **Enterprise Partner** | Verified entity (company, corporation, cooperative) originating real-world assets for tokenization; can be from any industry (manufacturing, agriculture, mining, trade, services, energy, real estate, technology) |
| **Asset Originator** | Synonym for Enterprise Partner; entity originating assets for tokenization |
| **Industrial Gateway** | Generic smart contract for notarizing asset/production data hashes from any Enterprise Partner (rebranded from AssetProof) |
| **ORIGINATOR_ROLE** | AccessControl role granted to approved Enterprise Partners for asset notarization and submission |
| **KYB** | Know Your Business; enterprise due diligence process including corporate registration, beneficial ownership, financial standing, and sanctions screening |
| **UBO** | Ultimate Beneficial Owner; natural person(s) owning or controlling >25% of enterprise entity |
| **Cryptographic Erasure** | GDPR compliance pattern where PII encryption keys are destroyed to render on-chain hash references irrecoverable |
| **Claim Hash** | Cryptographic commitment (SHA-256) to identity claim data stored on-chain; never contains recoverable PII |
| **PII** | Personally Identifiable Information; any data that can identify a natural person (name, DOB, national ID, address) |
| **Wallet Address Pseudonymization** | Technique of storing wallet-to-identity mappings using encrypted references rather than plaintext addresses |
| **RWA** | Real-World Asset; physical or traditional financial asset tokenized on blockchain |
| **MiCA** | Markets in Crypto-Assets Regulation; EU regulatory framework for crypto-asset service providers |
| **FATF** | Financial Action Task Force; international body setting AML/CFT standards including the Travel Rule |
| **KYC** | Know Your Customer; identity verification process required before token acquisition |
| **AML** | Anti-Money Laundering; monitoring and reporting suspicious transaction patterns |
| **CFT** | Counter-Financing of Terrorism; financial surveillance preventing terrorist funding |
| **Gnosis Safe** | Multi-signature wallet protocol for secure treasury and repayment management |
| **Chainlink** | Decentralized oracle network providing price feeds, proof-of-reserves, and off-chain computation |
| **ApeWorX** | Python-based smart contract development framework (successor to Brownie) for Solidity development |
| **HSM** | Hardware Security Module; physical device for secure cryptographic key storage |
| **CSP** | Content Security Policy; HTTP header preventing XSS attacks in React frontend |
| **UUPS** | Universal Upgradeable Proxy Standard; gas-efficient proxy pattern for upgradeable smart contracts |
| **CEP** | Complex Event Processing; real-time pattern detection in event streams (Flink) |
| **HPA** | Horizontal Pod Autoscaler; Kubernetes mechanism for scaling pods based on metrics |
| **SLO** | Service Level Objective; target performance metric (e.g., p99 latency < 500ms) |
| **SLA** | Service Level Agreement; contractual commitment to SLOs with penalties for violation |
| **AfCFTA** | African Continental Free Trade Area; pan-African trade agreement enabling cross-border investment across 54 African countries |
| **PAPSS** | Pan-African Payment and Settlement System; AfCFTA's centralized financial market infrastructure for instant cross-border payments in African local currencies |
| **ASEA** | African Securities Exchanges Association; umbrella body for 27 African stock exchanges promoting cross-listing and harmonized disclosure standards |
| **ESAAMLG** | Eastern and Southern Africa Anti-Money Laundering Group; FATF-style regional body for AML/CFT standards and mutual evaluations |
| **GIABA** | West Africa Inter-Governmental Action Group against Money Laundering; FATF-style regional body for West African AML/CFT cooperation |
| **NFIU** | Nigerian Financial Intelligence Unit; national FIU receiving suspicious transaction reports under Nigeria AML Act |
| **FIC (South Africa)** | Financial Intelligence Centre; national FIU receiving cash threshold and suspicious activity reports under South Africa FICA |
| **FRC (Kenya)** | Financial Reporting Centre; national FIU receiving suspicious transaction reports under Kenya AML Act |
| **NDPR** | Nigeria Data Protection Regulation 2019; data protection framework administered by Nigeria Data Protection Bureau |
| **POPIA** | Protection of Personal Information Act 2013 (South Africa); GDPR-aligned data protection law with 8 conditions for lawful processing |
| **FAIS Act** | Financial Advisory and Intermediary Services Act 2002 (South Africa); regulatory framework for financial services providers |
| **FSCA** | Financial Sector Conduct Authority (South Africa); regulator overseeing market conduct and crypto asset service providers |
| **VAITOS** | Virtual Asset and Initial Token Offering Services Act 2021 (Mauritius); regulatory framework for digital asset service providers |
| **M-Pesa** | Mobile money service (Safaricom/Vodacom); dominant mobile wallet in East Africa (Kenya, Tanzania) for payments and transfers |
| **MTN Mobile Money** | Mobile money service (MTN Group); dominant mobile wallet in West Africa (Nigeria, Ghana) and East Africa (Uganda, Rwanda) |
| **NIN** | National Identification Number (Nigeria); 11-digit unique identifier issued by NIMC for identity verification |
| **Huduma Namba** | National Integrated Identity Management System (Kenya); biometric-based national ID system |
| **GH Card** | Ghana Card (Ghana); biometric national ID issued by National Identification Authority |
| **CBN** | Central Bank of Nigeria; monetary authority regulating foreign exchange and payment systems |
| **SARB** | South African Reserve Bank; monetary authority with exchange control regulations |
| **CBK** | Central Bank of Kenya; monetary authority regulating payment systems and foreign exchange |
| **FSP** | Financial Services Provider (South Africa); entity licensed under FAIS Act to provide financial services |
| **VASP** | Virtual Asset Service Provider; FATF-defined category including crypto exchanges, wallet providers, and token issuers |
| **STR** | Suspicious Transaction Report; report filed with FIU when transaction suggests money laundering or terrorist financing |
| **CTR** | Cash Threshold Report; report filed for cash transactions exceeding regulatory threshold (e.g., >R25,000 in South Africa) |
| **PEP** | Politically Exposed Person; individual with prominent public function requiring enhanced due diligence under AML regulations |
| **GoAML** | UNODC anti-money laundering platform; used by African FIUs (Nigeria NFIU, South Africa FIC) for suspicious activity reporting |
| **UEMOA/WAEMU** | West African Economic and Monetary Union; 8-member monetary union (Benin, Burkina Faso, Côte d'Ivoire, Guinea-Bissau, Mali, Niger, Senegal, Togo) using CFA Franc (XOF) with common securities regulator (AMF-UEMOA) and central bank (BCEAO) |
| **AMF-UEMOA** | Autorité des Marchés Financiers de l'UEMOA; regional securities regulator based in Abidjan, Côte d'Ivoire, overseeing 8 UEMOA member states |
| **BCEAO** | Banque Centrale des États de l'Afrique de l'Ouest; regional central bank for 8 UEMOA member states, sets monetary policy and foreign exchange regulations |
| **BRVM** | Bourse Régionale des Valeurs Mobilières; regional stock exchange based in Abidjan, Côte d'Ivoire, serving 8 UEMOA member states with connections to national offices in Dakar, Cotonou, and other cities |
| **OHADA** | Organisation for the Harmonization of Business Law in Africa; 17-member organization (including UEMOA states plus Cameroon, CAR, Chad, Comoros, DRC, Congo, Equatorial Guinea, Gabon, Guinea, Madagascar, Mali, Togo) harmonizing commercial law including company law and securities regulations |
| **XOF (CFA Franc)** | West African CFA Franc; currency used by 8 UEMOA member states, pegged to EUR at 655.957 XOF = 1 EUR, issued by BCEAO |
| **CENTIF** | Cellule Nationale de Traitement des Informations Financières; national Financial Intelligence Unit (FIU) in UEMOA member states (CENTIF-Benin, CENTIF-Côte d'Ivoire, CENTIF-Sénégal) receiving suspicious transaction reports |
| **APDP (Benin/Côte d'Ivoire)** | Autorité de Protection des Données Personnelles; data protection authority in Benin and Côte d'Ivoire administering Loi 2017-20 (Benin) and Loi 2013-450 (Côte d'Ivoire) |
| **CDP (Senegal)** | Commission de Protection des Données Personnelles; Senegal data protection authority administering Loi 2008-12 |
| **CREPMF** | Conseil Régional de l'Épargne Publique et des Marchés Financiers; former regional securities council for UEMOA, now integrated into AMF-UEMOA structure |
| **CMF-UEMOA** | Conseil des Marchés Financiers de l'UEMOA; policy-setting body for UEMOA securities markets |
| **GIABA** | West Africa Inter-Governmental Action Group against Money Laundering; FATF-style regional body for West African AML/CFT cooperation (15 member states including Benin, Côte d'Ivoire, Senegal, Nigeria, Ghana) |

## 11.2 References

1. **IEEE Std 830-1998** — IEEE Recommended Practice for Software Requirements Specifications
2. **ISO/IEC/IEEE 29148:2018** — Systems and software engineering — Life cycle processes — Requirements engineering
3. **ERC-3643 EIP** — Ethereum Improvement Proposal 3643: T-REX Protocol for Permissioned Tokens (https://eips.ethereum.org/EIPS/eip-3643)
4. **T-REX Whitepaper v3.0** — Token for Regulated Exchanges: A Compliance Framework for Security Tokens (Tokeny Solutions, 2021)
5. **ONCHAINID Specification v2.1** — Decentralized Identity Protocol (https://www.onchainid.com/)
6. **Regulation (EU) 2023/1114 (MiCA)** — Markets in Crypto-Assets Regulation, Official Journal of the European Union (https://eur-lex.europa.eu/eli/reg/2023/1114)
7. **FATF Guidance** — Updated Guidance for a Risk-Based Approach to Virtual Assets and VASPs (Financial Action Task Force, October 2021)
8. **GDPR Regulation (EU) 2016/679** — General Data Protection Regulation (https://gdpr.eu/)
9. **SEC Release No. 33-10767** — Framework for "Investment Contract" Analysis of Digital Assets (U.S. Securities and Exchange Commission, April 2019)
10. **OpenZeppelin Contracts v5.0** — Secure Smart Contract Library (https://docs.openzeppelin.com/contracts/)
11. **Web3.py v6.0 Documentation** — Ethereum Python Library (https://web3py.readthedocs.io/)
12. **HashiCorp Vault Documentation** — Secrets Management and Data Protection (https://developer.hashicorp.com/vault/docs)
13. **Chainlink 2.0 Whitepaper** — A Decentralized Oracle Network for Hybrid Smart Contracts (https://chain.link/whitepaper)
14. **Gnosis Safe Developer Documentation** — Multi-Signature Wallet SDK (https://docs.safe.global/)
15. **React 19 Documentation** — JavaScript Library for User Interfaces (https://react.dev/)
16. **FastAPI Documentation** — Modern Python Web Framework for APIs (https://fastapi.tiangolo.com/)
17. **Kubernetes v1.28 Documentation** — Container Orchestration System (https://kubernetes.io/docs/)
18. **Terraform Documentation** — Infrastructure as Code Software (https://developer.hashicorp.com/terraform/docs)
19. **Apache Kafka Documentation** — Distributed Event Streaming Platform (https://kafka.apache.org/documentation/)
20. **Apache Flink Documentation** — Stream Processing Framework (https://flink.apache.org/documentation/)
21. **PostgreSQL 15 Documentation** — Relational Database System (https://www.postgresql.org/docs/15/)
22. **Redis 7 Documentation** — In-Memory Data Structure Store (https://redis.io/docs/)
23. **Prometheus Documentation** — Monitoring and Alerting Toolkit (https://prometheus.io/docs/)
24. **OWASP Top 10** — Web Application Security Risks (https://owasp.org/www-project-top-ten/)
25. **NIST SP 800-53** — Security and Privacy Controls for Information Systems (https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)

### African Regulatory References

26. **Investments and Securities Act 2007 (Nigeria)** — Primary legislation governing securities markets in Nigeria (https://sec.gov.ng/)
27. **SEC Nigeria Rules on Crowdfunding 2021** — Regulations for digital asset offerings and crowdfunding platforms (https://sec.gov.ng/)
28. **NDPR 2019 (Nigeria)** — Nigeria Data Protection Regulation administered by Nigeria Data Protection Bureau (https://ndpb.gov.ng/)
29. **Money Laundering (Prevention and Prohibition) Act 2022 (Nigeria)** — AML/CFT legislation with reporting requirements to NFIU
30. **FAIS Act 2002 (South Africa)** — Financial Advisory and Intermediary Services Act regulating financial services providers (https://www.fsca.co.za/)
31. **POPIA 2013 (South Africa)** — Protection of Personal Information Act (https://www.inforegulator.org.za/)
32. **FICA 2001 (South Africa)** — Financial Intelligence Centre Act for AML/CFT reporting (https://www.fic.gov.za/)
33. **Declaration 138 of 2022 (South Africa)** — FSCA declaration regulating crypto asset service providers
34. **Capital Markets Act 1989 (Kenya)** — Primary legislation for capital markets regulation (https://cma.or.ke/)
35. **Virtual Asset Service Providers Regulations 2022 (Kenya)** — VASP licensing and operational requirements
36. **Data Protection Act 2019 (Kenya)** — GDPR-aligned data protection law (https://www.odpc.go.ke/)
37. **Proceeds of Crime and Anti-Money Laundering Act 2009 (Kenya)** — AML/CFT legislation with FRC reporting
38. **SEC Act 2016 (Act 929) (Ghana)** — Securities and Exchange Commission Act (https://sec.gov.gh/)
39. **Data Protection Act 2012 (Act 843) (Ghana)** — Data protection framework (https://dpc.gov.gh/)
40. **Anti-Money Laundering Act 2020 (Act 1044) (Ghana)** — AML/CFT legislation with FIC reporting
41. **FSC Act 2007 (Mauritius)** — Financial Services Commission regulatory framework (https://fsc.ma/)
42. **VAITOS Act 2021 (Mauritius)** — Virtual Asset and Initial Token Offering Services Act
43. **Data Protection Act 2017 (Mauritius)** — GDPR-aligned data protection law
44. **AfCFTA Agreement 2018** — African Continental Free Trade Area Agreement (https://au.int/en/cfta)
45. **AfCFTA Protocol on Trade in Services** — Financial services liberalization framework
46. **PAPSS Framework** — Pan-African Payment and Settlement System operational rules (https://papss.com/)
47. **ESAAMLG Mutual Evaluation Reports** — AML/CFT compliance assessments for Eastern and Southern Africa (https://www.esaamlg.org/)
48. **GIABA Mutual Evaluation Reports** — AML/CFT compliance assessments for West Africa (https://www.giaba.org/)
49. **ASEA Guidelines** — African Securities Exchanges Association cross-listing and disclosure standards (https://www.asea-africa.org/)
50. **African Development Bank Guidelines** — Infrastructure investment and renewable energy financing (https://www.afdb.org/)

### UEMOA Regional Regulatory References

51. **Regulation UEMOA n° 01/2009/CM/UEMOA** — Investment services directive for UEMOA member states (8 countries: Benin, Burkina Faso, Côte d'Ivoire, Guinea-Bissau, Mali, Niger, Senegal, Togo)
52. **AMF-UEMOA Guidelines** — Regional securities regulation guidelines administered by Autorité des Marchés Financiers de l'UEMOA (https://www.amf-ue moa.org/)
53. **BRVM Regulations** — Regional stock exchange listing and trading rules (Bourse Régionale des Valeurs Mobilières, https://www.brvm.org/)
54. **BCEAO Foreign Exchange Regulations** — Regional central bank FX rules for UEMOA member states (https://www.bceao.int/)
55. **OHADA Uniform Act on Commercial Companies** — Harmonized corporate law across 17 member states including UEMOA countries (https://www.ohada.org/)

### Benin Regulatory References

56. **Loi n° 2017-20 du 20 avril 2017 (Benin)** — Law on protection of personal data administered by APDP Benin
57. **Loi n° 2018-31 du 13 décembre 2018 (Benin)** — AML/CFT Act with reporting requirements to CENTIF-Benin
58. **GIABA Mutual Evaluation Report (Benin)** — AML/CFT compliance assessment (https://www.giaba.org/)

### Côte d'Ivoire Regulatory References

59. **Loi n° 2013-450 du 19 juin 2013 (Côte d'Ivoire)** — Law on protection of personal data administered by APDP-CI
60. **Loi n° 2015-491 du 08 juillet 2015 (Côte d'Ivoire)** — AML/CFT Act with reporting requirements to CENTIF-CI
61. **GIABA Mutual Evaluation Report (Côte d'Ivoire)** — AML/CFT compliance assessment (https://www.giaba.org/)

### Senegal Regulatory References

62. **Loi n° 2008-12 du 25 janvier 2008 (Senegal)** — Law on protection of personal data administered by CDP Senegal
63. **Loi n° 2016-29 du 08 novembre 2016 (Senegal)** — AML/CFT Act with reporting requirements to CENTIF-Sénégal
64. **GIABA Mutual Evaluation Report (Senegal)** — AML/CFT compliance assessment (https://www.giaba.org/)

## 11.3 Future Extensions

### DeFi Integrations

**Permissioned Liquidity Pools:**
- Integrate with Aave Arc or Compound Treasury for permissioned lending
- ERC-3643 tokens as collateral (with compliance-gated liquidation)
- Yield generation on idle treasury assets

**Automated Market Maker (AMM):**
- Permissioned AMM (Uniswap v3 fork) with ERC-3643 transfer validation
- Liquidity providers must be verified investors
- Compliance Module enforces jurisdiction restrictions on swaps

**Derivatives:**
- Tokenized options and futures on ERC-3643 underlying assets
- CFTC-compliant structure (no leverage for retail investors)
- Clearing via smart contract escrow

### African Market Extensions

**African Stock Exchange Integration:**
- Direct listing of ERC-3643 tokens on African stock exchanges (NSE Nigeria, JSE South Africa, NSE Kenya, GSE Ghana)
- Dual-listing mechanism: tokenized securities trade on both blockchain and traditional exchange
- Settlement interoperability: blockchain settlement synchronized with African CSDs (CSD Nigeria, Strate, CDS Kenya, CSD Ghana)

**African Central Bank Digital Currency (CBDC) Integration:**
- eNigeria (eNaira) integration for Nigerian naira settlements
- South Africa Reserve Bank Project Khokha for rand settlements
- Bank of Ghana e-Cedi integration for cedi settlements
- Central Bank of Kenya CBDC pilot participation

**African Pension Fund Onboarding:**
- Simplified onboarding for African pension funds (Ghana SSNIT, Nigeria PenCom, South Africa PIC)
- Compliance with African pension fund investment regulations (asset allocation limits, risk ratings)
- Reporting formats aligned with African pension fund regulator requirements

**Diaspora Investment Corridors:**
- Dedicated channels for African diaspora investment (US-Africa, UK-Africa, EU-Africa, UAE-Africa)
- Integration with remittance providers (Western Union, MoneyGram, WorldRemit, Sendy)
- Tax-efficient structures for diaspora investors (double taxation avoidance, withholding tax optimization)

**Islamic Finance (Sukuk) Tokenization:**
- Shariah-compliant tokenization structures for North African and West African Muslim investors
- Sukuk token issuance on ERC-3643 with profit-sharing (Mudarabah) or cost-plus (Murabaha) structures
- Shariah board approval workflow and certification

**African Commodity Exchange Integration:**
- Tokenized warehouse receipts for African commodity exchanges (AFEX Nigeria, ZACE Zambia, ACE Ethiopia)
- Commodity-backed tokens with real-time inventory verification via IoT sensors
- Integration with African commodity trading platforms

**African SME Financing Platform:**
- Tokenized invoice financing for African SMEs (addressing $330 billion SME financing gap)
- Credit scoring integration with African credit bureaus (TransUnion Africa, Experian Africa, XDS Data)
- Partial credit guarantee integration with African development finance institutions (AfDB, IFC, FMO)

**African Renewable Energy Tokenization:**
- Tokenized solar home systems (pay-as-you-go solar via M-KOPA, d.light models)
- Renewable energy certificate (REC) tokenization for African carbon markets
- Power purchase agreement (PPA) tokenization for utility-scale renewable projects

**African Agricultural Value Chain Finance:**
- Tokenized pre-harvest financing for smallholder farmers
- Warehouse receipt tokenization for stored crops (coffee, cocoa, maize)
- Integration with African agricultural commodity exchanges and off-taker platforms

**African Real Estate Investment Trust (REIT) Tokenization:**
- Tokenized African REITs for retail and institutional investors
- Integration with African property registries (title deed verification)
- Rental income distribution automation via smart contracts

### Cross-Chain Bridges Beyond Polygon

**Additional Chains:**
- **Arbitrum/Optimism:** Ethereum L2s for lower gas costs with Ethereum security
- **Avalanche:** High-throughput chain for institutional trading
- **BSC (Binance Smart Chain):** Access to Asian investor base (regulatory permitting)
- **Celo:** Mobile-first blockchain with African focus (M-Pesa integration native)
- **Flare Network:** Oracle-enabled chain for African asset price feeds

**Bridge Protocols:**
- **LayerZero:** Omnichain messaging for native ERC-3643 portability
- **Wormhole:** Generic message passing with attestation network
- **Axelar:** Interchain gateway with built-in compliance modules
- **Hyperlane:** Permissionless bridge infrastructure for African blockchain connectivity

**Interoperability Standards:**
- IBC (Inter-Blockchain Communication) for Cosmos ecosystem
- CCIP (Chainlink Cross-Chain Interoperability Protocol) for secure messaging
- BTP (Blockchain Transmission Protocol) for ICON network integration

### AI-Assisted Underwriting

**Automated Asset Scoring:**
- ML model predicts asset performance based on historical data
- Features: asset type, jurisdiction, originator track record, market conditions
- Output: Risk score (AAA to D) with recommended interest rate

**Document Analysis:**
- NLP model extracts key terms from legal documents (offering memorandum, title deeds)
- Flag unfavorable terms (excessive fees, weak investor protections)
- Summarize documents for compliance review

**Fraud Pattern Recognition:**
- Graph neural network detects complex fraud schemes (circular trading, wash sales)
- Unsupervised learning identifies novel attack vectors
- Federated learning across platforms (share threat intelligence without exposing data)

**African Language Support:**
- NLP models for African languages (Swahili, Hausa, Yoruba, Zulu, Afrikaans, Arabic)
- Document translation and summarization for cross-border investors
- Voice-based KYC verification in African languages

### Secondary Market Liquidity Pools

**Institutional Liquidity:**
- Dark pool for block trades (minimize market impact)
- Request-for-Quote (RFQ) system for large orders
- Market maker incentives (fee rebates, priority access)

**Retail Liquidity:**
- Fractional trading (minimum $100 order size)
- Recurring investment plans (dollar-cost averaging)
- Portfolio rebalancing automation

**Liquidity Aggregation:**
- Aggregate orders across multiple venues (primary marketplace, AMM, dark pool)
- Best execution algorithm (price, speed, compliance)
- Smart order routing with compliance validation at each venue

**African Mobile Money Liquidity:**
- Direct redemption of tokens to M-Pesa, MTN Mobile Money, Airtel Money wallets
- Micro-investment support (minimum $10 transactions via mobile money)
- USSD-based trading interface for feature phone users

### Regulatory Technology (RegTech) Extensions

**Automated Regulatory Filing:**
- Generate and file Form D, MiCA reports automatically
- XBRL tagging for SEC EDGAR submission
- Real-time regulatory dashboard for examiner access
- **African Regulatory Filing:** Automated filing to SEC Nigeria, CMA Kenya, SEC Ghana, FSC Mauritius, FSCA South Africa

**Compliance Monitoring:**
- Real-time investor concentration monitoring (prevent >10% ownership without disclosure)
- Automatic holding period enforcement (Rule 144 compliance)
- Jurisdiction change detection (investor moves to sanctioned country)
- **African Compliance:** AfCFTA rules of origin verification, ESAAMLG/GIABA sanctions screening

**Tax Compliance:**
- Automated withholding tax calculation and remittance for African jurisdictions
- VAT/GST treatment per African tax authority requirements
- Tax treaty optimization for cross-border investments
- **African Tax Authority Integration:** FIRS Nigeria, SARS South Africa, KRA Kenya, GRA Ghana e-filing integration

**Tax Reporting:**
- Automated 1099-DIV, 1099-B generation for US investors
- FATCA/CRS reporting for cross-border holdings
- Tax loss harvesting recommendations

### Enhanced Identity Features

**Decentralized Identity (DID):**
- W3C DID standard integration (did:ethr, did:polygon)
- Verifiable Credentials (VC) for portable KYC status
- Self-sovereign identity (investor controls claim sharing)

**Biometric Verification:**
- Facial recognition for KYC onboarding (liveness detection)
- Voice authentication for high-value transactions
- Behavioral biometrics for continuous authentication

**Corporate Identity:**
- Legal entity verification (LEI code integration)
- Beneficial owner disclosure (corporate veil穿透)
- Authorized signatory management (corporate resolution on-chain)

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | February 28, 2026 | UJAMAA DEFI PLATFORM Architecture Team | Initial release |
| 2.0 | March 17, 2026 | Aziz Da Silva | Added institutional architecture (uLP, Fireblocks, Bank Escrow) |
| 2.1 | March 25, 2026 | Aziz Da Silva | Post-audit revisions: Comprehensive fixes for all 109 audit findings |

**Approval Signatures**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Chief Technology Officer | | | |
| Chief Compliance Officer | | | |
| Lead Smart Contract Architect | | | |
| Security Auditor | | | |

---

# Appendix A: Audit Closure Report 🆕

## A.1 Audit Summary

**Audit Date:** March 25, 2026  
**Document Version:** SRS v2.1  
**Total Findings:** 109  
**Findings Addressed:** 109 (100% closure)

## A.2 Findings Closure Matrix

| Finding ID | Severity | Status | Location of Fix |
|------------|----------|--------|-----------------|
| AUDIT-001 | CRITICAL | ✅ Closed | Section 1.2.1 (Authentication Specification) |
| AUDIT-002 | CRITICAL | ✅ Closed | Section 1.2.2 (Authorization Matrix) |
| AUDIT-003 | CRITICAL | ✅ Closed | Section 1.2.3 (OWASP Top 10 Mitigation) |
| AUDIT-004 | CRITICAL | ✅ Closed | Section 6.1.1 (Soft-Delete Strategy) |
| AUDIT-005 | CRITICAL | ✅ Closed | Section 6.1.1 (Audit Fields) |
| AUDIT-006 | CRITICAL | ✅ Closed | Section 6.1.1 (Foreign Key Constraints) |
| AUDIT-007 | CRITICAL | ✅ Closed | Section 6.1.1 (Missing Indexes) |
| AUDIT-008 | CRITICAL | ✅ Closed | Section 8.4 (Measurable Usability NFRs) |
| AUDIT-009 | CRITICAL | ✅ Closed | Section 3.3 (Error States Specification) |
| AUDIT-010 | CRITICAL | ✅ Closed | Section 3.2 (Notification Requirements) |
| AUDIT-011 | CRITICAL | ✅ Closed | Section 7 (Cryptographic Specification) |
| AUDIT-012 | CRITICAL | ✅ Closed | Section 1.2.1 (Session Management) |
| AUDIT-013 | CRITICAL | ✅ Closed | Section 4.3 (Fireblocks Integration Spec) |
| AUDIT-014 | CRITICAL | ✅ Closed | Section 4.3 (Bank Integration Spec) |
| AUDIT-015 | CRITICAL | ✅ Closed | Section 3.4 (Rate Limiting Specification) |
| AUDIT-016 | CRITICAL | ✅ Closed | Section 3.1 (Requirements Traceability Matrix) |
| AUDIT-017 | CRITICAL | ✅ Closed | Section 3.1 (FR Numbering) |
| AUDIT-018 | CRITICAL | ✅ Closed | Section 6.1.1 (CHECK Constraints) |
| AUDIT-019 | HIGH | ✅ Closed | Section 3.5 (Modal Verb Standard) |
| AUDIT-020 | HIGH | ✅ Closed | Section 3.1 (Atomic Requirements in RTM) |
| AUDIT-021 | HIGH | ✅ Closed | Section 8.4 (Measurable Scalability NFRs) |
| AUDIT-022 | HIGH | ✅ Closed | Section 1.3 (Terminology Standardization) |
| AUDIT-023 | HIGH | ✅ Closed | Section 1.3 (Token Naming Standardization) |
| AUDIT-024 | HIGH | ✅ Closed | Section 1.3 (Industrial Gateway Naming) |
| AUDIT-025 | HIGH | ✅ Closed | Section 1.2 (Scope Clarification) |
| AUDIT-026 | HIGH | ✅ Closed | Section 1.2 (Mobile Scope Clarification) |
| AUDIT-027 | HIGH | ✅ Closed | Section 3.1 (FR-044 for Gnosis Safe SDK) |
| AUDIT-028 | HIGH | ✅ Closed | Section 2.3 (Developer/DevOps User Classes) |
| AUDIT-029 | HIGH | ✅ Closed | Section 3 (Gherkin Conversion Guide) |
| AUDIT-030 | HIGH | ✅ Closed | Section 3.3 (Error States for Redemption) |
| AUDIT-031 | HIGH | ✅ Closed | Section 3.3 (Verifiable Acceptance Criteria) |
| AUDIT-032 | HIGH | ✅ Closed | Section 7 (CSRF Protection Requirements) |
| AUDIT-033 | HIGH | ✅ Closed | Section 1.2.3 (Input Validation Specification) |
| AUDIT-034 | HIGH | ✅ Closed | Section 10 (PCI-DSS Scope Clarification) |
| AUDIT-035 | HIGH | ✅ Closed | Section 9.10 (Load Testing Specification) |
| AUDIT-036 | HIGH | ✅ Closed | Section 8.4 (Database Performance NFRs) |
| AUDIT-037 | HIGH | ✅ Closed | Section 9 (Connection Pool Sizing) |
| AUDIT-038 | HIGH | ✅ Closed | Section 6.1.1 (PostgreSQL Enums) |
| AUDIT-039 | HIGH | ✅ Closed | Section 6.1.1 (ID Strategy Documentation) |
| AUDIT-040 | HIGH | ✅ Closed | Section 6.1.1 (Composite Unique Constraints) |
| AUDIT-041 | HIGH | ✅ Closed | Section 6.1.1 (Data Retention Policy) |
| AUDIT-042 | HIGH | ✅ Closed | Section 4.3 (Internal API Specification) |
| AUDIT-043 | HIGH | ✅ Closed | Section 4.3 (Webhook Specification) |
| AUDIT-044 | HIGH | ✅ Closed | Section 3.3 (Form Validation Rules) |
| AUDIT-045 | HIGH | ✅ Closed | Section 3.3 (Loading State Specification) |
| AUDIT-046 | HIGH | ✅ Closed | Section 3.3 (Empty State Specification) |
| AUDIT-047 | HIGH | ✅ Closed | Section 8.2 (Disaster Recovery Specification) |
| AUDIT-048 | HIGH | ✅ Closed | Section 2.5 (Environment Strategy) |
| AUDIT-049 | HIGH | ✅ Closed | Section 8.3 (Monitoring & Alerting Specification) |
| AUDIT-050 | HIGH | ✅ Closed | Section 1.3 (Glossary Reorganization) |
| AUDIT-051 | MEDIUM | ✅ Closed | Section 3 (IEEE 830 Structure) |
| AUDIT-052 | MEDIUM | ✅ Closed | Section 3.1 (Function-to-EPIC Mapping) |
| AUDIT-053 | MEDIUM | ✅ Closed | Section 3 (Account Recovery User Story) |
| AUDIT-054 | MEDIUM | ✅ Closed | Section 3 (Email Verification FR) |
| AUDIT-055 | MEDIUM | ✅ Closed | Section 3 (Export Functionality Specification) |
| AUDIT-056 | MEDIUM | ✅ Closed | Section 3 (Search and Pagination Specification) |
| AUDIT-057 | MEDIUM | ✅ Closed | Section 8.3 (Security Alerting Requirements) |
| AUDIT-058 | MEDIUM | ✅ Closed | Section 10 (GDPR Breach Notification Procedure) |
| AUDIT-059 | MEDIUM | ✅ Closed | Section 9 (Blockchain Caching Strategy) |
| AUDIT-060 | MEDIUM | ✅ Closed | Section 9.5 (CDN Specification) |
| AUDIT-061 | MEDIUM | ✅ Closed | Section 6.1.1 (FK Indexes) |
| AUDIT-062 | MEDIUM | ✅ Closed | Section 6.1 (TIMESTAMPTZ Usage) |
| AUDIT-063 | MEDIUM | ✅ Closed | Section 9.7 (API Deprecation Policy) |
| AUDIT-064 | MEDIUM | ✅ Closed | Section 9.6 (Offline State Specification) |
| AUDIT-065 | MEDIUM | ✅ Closed | Section 3.3 (Error Message Specification) |
| AUDIT-066 | MEDIUM | ✅ Closed | Section 9.8 (Backup Verification Procedure) |
| AUDIT-067 | MEDIUM | ✅ Closed | Section 9.9 (Infrastructure Drift Detection) |
| AUDIT-068 | MEDIUM | ✅ Closed | Section 1.3 (Missing Acronyms Added) |
| AUDIT-069 | MEDIUM | ✅ Closed | Section 1.2 (MVP Scope Clarification) |
| AUDIT-070 | MEDIUM | ✅ Closed | Section 1.2 (Exit Strategy Clarification) |
| AUDIT-071 | LOW | ✅ Closed | Document Header (Version History Added) |
| AUDIT-072 | LOW | ✅ Closed | Document Header (Approval Section Added) |
| AUDIT-073 | LOW | ✅ Closed | Section 3 (Help Feature User Story) |
| AUDIT-074 | LOW | ✅ Closed | Section 9.12 (Referral Feature Noted) |
| AUDIT-075 | LOW | ✅ Closed | Section 7 (Security Training Requirement) |
| AUDIT-076 | LOW | ✅ Closed | Section 4.1 (Performance Budget Enforcement) |
| AUDIT-077 | LOW | ✅ Closed | Section 6.1.1 (Database Migration Strategy) |
| AUDIT-078 | LOW | ✅ Closed | Section 1.2.1 (API Authentication Specification) |
| AUDIT-079 | LOW | ✅ Closed | Section 9.12 (Dark Mode Noted as Enhancement) |
| AUDIT-080 | LOW | ✅ Closed | Section 6.1 (Log Retention Policy) |
| AUDIT-081 | LOW | ✅ Closed | Section 1.3 (Glossary Consolidation) |
| AUDIT-082 | LOW | ✅ Closed | Section 9.11 (MVP Success Criteria) |
| AUDIT-083 | LOW | ✅ Closed | Section 2.3 (Risk Committee Definition) |
| AUDIT-084 | LOW | ✅ Closed | Section 9.12 (AI Dev Tools Marked Optional) |
| AUDIT-085 | LOW | ✅ Closed | Section 3 (Health Check Endpoints FR) |
| AUDIT-086 | LOW | ✅ Closed | Section 7 (Dependency Scanning Requirement) |
| AUDIT-087 | LOW | ✅ Closed | Section 6.1 (Query Analysis Requirement) |
| AUDIT-088 | LOW | ✅ Closed | Section 4.1 (Favicon Specification) |
| AUDIT-089 | LOW | ✅ Closed | Section 2.5 (SSL/TLS Certificate Management) |
| AUDIT-090 | LOW | ✅ Closed | Section 1 (Platform Name Standardization) |
| AUDIT-091 | LOW | ✅ Closed | Section 1.3 (Stablecoin Differentiation) |
| AUDIT-092 | LOW | ✅ Closed | Section 6.1 (ERD Documentation Requirement) |
| AUDIT-093 | LOW | ✅ Closed | Section 4.3 (GraphQL Noted as Enhancement) |
| AUDIT-094 | LOW | ✅ Closed | Section 4.1 (Print Stylesheet Specification) |
| AUDIT-095 | LOW | ✅ Closed | Section 8.2 (Rollback Testing Requirement) |
| AUDIT-096 | LOW | ✅ Closed | Section 9.12 (Post-MVP Prioritization) |
| AUDIT-097 | LOW | ✅ Closed | Section 3 (Status Page User Story) |
| AUDIT-098 | LOW | ✅ Closed | Section 7 (Bug Bounty Program Specification) |
| AUDIT-099 | LOW | ✅ Closed | Section 9 (WebSocket Scaling Specification) |
| AUDIT-100 | LOW | ✅ Closed | Section 9.8 (Backup Encryption Specification) |
| AUDIT-101 | LOW | ✅ Closed | Section 4.3 (gRPC Usage Clarification) |
| AUDIT-102 | LOW | ✅ Closed | Section 3.3 (404 Page Specification) |
| AUDIT-103 | LOW | ✅ Closed | Section 2.5 (Kubernetes Network Policies) |
| AUDIT-104 | LOW | ✅ Closed | Section 1.3 (Ujamaa Pronunciation Guide) |
| AUDIT-105 | LOW | ✅ Closed | Section 1.2 (Mock Service Deprecation Timeline) |
| AUDIT-106 | LOW | ✅ Closed | Section 1.4 (URL Audit Note) |
| AUDIT-107 | LOW | ✅ Closed | Section 2.2 (Function Numbering Continuation) |
| AUDIT-108 | LOW | ✅ Closed | Section 3 (Feedback Mechanism User Story) |
| AUDIT-109 | LOW | ✅ Closed | Section 2.5 (Physical Security Requirements) |

## A.3 Document Quality Improvements

### Structural Improvements
- ✅ IEEE 830 compliant section organization
- ✅ Requirements Traceability Matrix (RTM) with 85 FRs
- ✅ Modal verb standardization (SHALL/SHOULD/MAY)
- ✅ Document approval section with signatures
- ✅ Version history with change log

### Content Improvements
- ✅ Authentication specification (SIWE + JWT)
- ✅ Authorization matrix (RBAC with 10 roles)
- ✅ OWASP Top 10 mitigation requirements
- ✅ Database constraints (enums, CHECK, FKs, indexes)
- ✅ Error states and notification specifications
- ✅ Rate limiting and DDoS protection
- ✅ Disaster recovery (RTO/RPO targets)
- ✅ Monitoring and alerting specification
- ✅ Measurable NFRs (usability, performance, scalability)

### Technical Improvements
- ✅ Soft-delete strategy for all transactional tables
- ✅ Audit fields (created_by, updated_by) for traceability
- ✅ Foreign key constraints with ON DELETE behavior
- ✅ CHECK constraints for business rules
- ✅ Composite unique constraints
- ✅ Missing indexes for FKs and query patterns
- ✅ PostgreSQL enums for categorical fields
- ✅ Data retention and archiving policy

## A.4 Remaining Recommendations (Post-MVP)

The following items are noted as future enhancements and do not block development:

| Recommendation | Priority | Target Phase |
|----------------|----------|--------------|
| Dark mode for React frontend | Low | MVP-2 |
| GraphQL API for complex queries | Low | MVP-3 |
| AI-powered code generation | Low | Post-MVP |
| Referral/affiliate program | Low | MVP-3 |
| Mobile applications (native) | Medium | MVP-2 |
| Cross-chain bridge | Medium | MVP-3 |

## A.5 Sign-Off

**Audit Closure Certification:**

All 109 audit findings have been addressed in SRS v2.1. The document is now ready for development commencement.

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Lead Architect | Aziz Da Silva | | 2026-03-25 |
| Compliance Officer | [TBD] | | |
| Security Auditor | [TBD] | | |

---

*This document is classified as Private and may be shared with regulators, auditors, and potential investors only under NDA.*

*End of SRS v2.1*


