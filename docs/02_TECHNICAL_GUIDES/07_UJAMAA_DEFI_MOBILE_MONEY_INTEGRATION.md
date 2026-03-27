# UJAMAA DEFI PLATFORM — Mobile Money Payment Integration
## Technical Specification & Implementation Guide

**Version:** 2.0 (SRS v2.0 Aligned)  
**Date:** March 17, 2026  
**Author:** Aziz Da Silva - Lead Architect  
**Classification:** Technical  
**Audience:** Backend Engineers, Smart Contract Developers, Integration Partners

**Aligned with:** SRS v2.0 Section 4.3 (Software Interfaces - Mobile Money APIs)

---

## 1. Overview & Rationale

UJAMAA DEFI PLATFORM is an institutional-grade tokenization platform enabling fractional ownership of African real-world assets (RWAs) through **ERC-3643 compliant blockchain-based digital securities**. To maximize financial inclusion across African markets, the platform supports two parallel payment rails:

- **Web3 wallets** with stablecoins (USDC/USDT/EUROD) for crypto-native users
- **Mobile money** for the majority of African users who do not hold a Web3 wallet but actively use MTN MoMo, Orange Money, Airtel Money, M-Pesa, and similar services

Mobile money is the dominant financial infrastructure across Sub-Saharan Africa, accounting for nearly 50% of global mobile money accounts and $2.5 billion in daily transactions. Supporting it is not optional — it is the primary gateway to financial inclusion at scale.

### 1.1 Alignment with SRS v2.0

This document aligns with the **Software Requirements Specification (SRS) v2.0** and integrates with the following platform components:

| SRS v2.0 Component | Specification Reference | Implementation |
|---------------|------------------------|----------------|
| **Token Standard** | ERC-3643 (T-REX Protocol) | `Ujamaa Asset Token (UAT)` contract |
| **Identity System** | ONCHAINID | `IdentityRegistry` contract |
| **Compliance Layer** | ERC-3643 Compliance Modules | `ComplianceModule` contract |
| **Blockchain** | Polygon Amoy (testnet) / Polygon Mainnet | EVM-compatible L2 |
| **Stablecoin** | USDC (Ondo Finance), EUROD | Native Polygon USDC/EUROD |
| **Industrial Gateway** | Production data notarization | `IndustrialGateway` contract |
| **Mobile Money APIs** | Section 4.3 | M-Pesa, MTN, Airtel integration |

---

## 2. Technology Stack

| Layer | Technology | Specification | Rationale |
|---|---|---|---|
| **Mobile Money Collection** | Flutterwave | REST API v3 | Pan-African coverage, 30+ currencies, bidirectional payments |
| **Mobile Money Operators** | MTN MoMo, Orange Money, Airtel Money, M-Pesa, Vodafone Cash | Operator APIs via Flutterwave | Direct integration through unified API |
| **Fiat → Stablecoin On-ramp** | Onafriq + Ondo Finance | USDC on Polygon | 1B+ wallets connected, regulatory compliance |
| **Blockchain Layer** | Polygon | EVM-compatible L2 | Low fees (<$0.01), high throughput, institutional credibility |
| **Token Standard** | **ERC-3643 (T-REX)** | `UjamaaTokenizer` contract | Regulatory-compliant security token with identity verification |
| **Smart Contracts** | Solidity 0.8.20 | UUPS Upgradeable Proxy | Security, upgradeability, gas optimization |
| **Identity Verification** | ONCHAINID | Claim-based identity | GDPR-compliant, no PII on-chain |
| **Stablecoin** | USDC (Ondo Finance) | Native Polygon deployment | Regulatory compliance, institutional trust |
| **Custodial Wallet** | Fireblocks / In-house | MPC custody | Abstracts Web3 complexity from mobile money users |
| **Backend Framework** | FastAPI (Python 3.11) | Async webhook processing | High-performance, type-safe |
| **Database** | PostgreSQL 15 | Partitioned tables | GDPR compliance, audit trails |
| **Node Provider** | Alchemy / Infura | Polygon RPC | Reliable blockchain access |
| **User Interface** | React 18 + TypeScript | Mobile-first PWA | No Web3 UX exposed to mobile money users |

---

## 3. Why Flutterwave

Flutterwave is the chosen payment gateway for UJAMAA for the following reasons:

- **Pan-African coverage** — supports MTN MoMo, Orange Money, Airtel Money, M-Pesa, Vodafone Cash and more through a single unified API, eliminating the need for separate operator agreements
- **Multi-currency** — natively handles XOF, NGN, KES, GHS, ZAR, XAF and 30+ African currencies, enabling local currency investing without manual conversion on the user side
- **Proven infrastructure** — trusted by large enterprises across Africa with built-in KYC/AML compliance that aligns with UJAMAA's regulatory obligations
- **Simple API** — a single REST API call initiates a mobile money charge, keeping backend integration lean and maintainable
- **Bidirectional payments** — Flutterwave handles both collections (investments) and disbursements (dividends, returns) back to mobile money wallets, making it a complete payment loop for an investment platform
- **Webhook Support** — Real-time payment confirmations enable instant token minting on Polygon

### 3.1 Supported Mobile Money Operators

| Operator | Countries | Currency | Integration Status |
|----------|-----------|----------|-------------------|
| **MTN MoMo** | Nigeria, Ghana, Uganda, Rwanda, Cameroon, Côte d'Ivoire, Benin, Togo, Zambia, Liberia | NGN, GHS, UGX, RWF, XAF, XOF, ZMW, LRD | ✅ Via Flutterwave |
| **Orange Money** | Senegal, Côte d'Ivoire, Mali, Burkina Faso, Niger, Cameroon, Guinea, Madagascar | XOF, XAF, GNF, MGA | ✅ Via Flutterwave |
| **Airtel Money** | Nigeria, Kenya, Uganda, Tanzania, Malawi, Zambia, Zimbabwe, DRC, Chad, CAR | NGN, KES, UGX, TZS, MWK, ZMW, ZWL, CDF, XAF | ✅ Via Flutterwave |
| **M-Pesa** | Kenya, Tanzania, Mozambique, DRC, Lesotho, Egypt | KES, TZS, MZN, CDF, LSL, EGP | ✅ Via Flutterwave |
| **Vodafone Cash** | Ghana, Egypt, Tanzania | GHS, EGP, TZS | ✅ Via Flutterwave |

---

## 4. Why Polygon

Polygon is the chosen blockchain layer for UJAMAA for the following reasons:

- **Low transaction fees** — gas fees are fractions of a cent ($0.001-$0.01), making micro-investments economically viable for low-income users across Africa
- **EVM compatibility** — full compatibility with Ethereum smart contract standards, including **ERC-3643** for regulated security tokens
- **High throughput** — capable of handling thousands of transactions per second, providing the scale required for a pan-African user base
- **Institutional credibility** — Mastercard and JP Morgan have both run RWA tokenization pilots on Polygon, providing regulatory and enterprise confidence
- **Native USDC support** — Ondo Finance's USDC is natively deployed on Polygon, eliminating cross-chain bridging complexity and reducing settlement risk
- **African Market Presence** — Polygon has established partnerships with African governments and financial institutions for blockchain adoption

### 4.1 Network Configuration

| Network | Chain ID | RPC URL | Block Explorer | Use Case |
|---------|----------|---------|----------------|----------|
| **Polygon Amoy (Testnet)** | 80002 | `https://rpc-amoy.polygon.technology/` | `https://amoy.polygonscan.com/` | Development & Testing |
| **Polygon Mainnet** | 137 | `https://polygon-rpc.com/` | `https://polygonscan.com/` | Production |

---

## 5. Architecture — The Stablecoin Bridge

The core architectural challenge is converting mobile money payments into on-chain tokenized asset ownership while maintaining **ERC-3643 compliance**. The bridge operates as follows:

### 5.1 High-Level Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MOBILE MONEY INVESTMENT FLOW                              │
│                                                                              │
│  User (Mobile Money) → Flutterwave Payment Gateway                          │
│          ↓                                                                    │
│  Fiat received in local currency (XOF, NGN, KES, GHS...)                    │
│          ↓                                                                    │
│  Auto-convert to stablecoin (USDC) via Onafriq + Ondo Finance                     │
│          ↓                                                                    │
│  Backend triggers ERC-3643 compliance checks                                │
│          ↓                                                                    │
│  IdentityRegistry verifies user KYC status                                  │
│          ↓                                                                    │
│  ComplianceModule validates transfer rules                                  │
│          ↓                                                                    │
│  UjamaaTokenizer mints tokens to user's custodial wallet                    │
│          ↓                                                                    │
│  AssetProof notarizes investment record (SHA-256 hash)                      │
│          ↓                                                                    │
│  User sees confirmed investment on dashboard (no Web3 knowledge needed)     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Smart Contract Integration

The systems — Flutterwave and Polygon — are connected at the UJAMAA backend layer through smart contracts:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SMART CONTRACT INTEGRATION LAYER                          │
│                                                                              │
│  Flutterwave Webhook (payment confirmed)                                    │
│          ↓                                                                    │
│  UJAMAA Backend (FastAPI + PostgreSQL)                                      │
│          ↓                                                                    │
│  Compliance Check (OFFCHAIN)                                                │
│    • Verify user KYC status in database                                     │
│    • Check investment limits per SRS requirements                           │
│    • Validate jurisdiction restrictions                                     │
│          ↓                                                                    │
│  Polygon RPC Call (via Alchemy/Infura)                                      │
│          ↓                                                                    │
│  Smart Contract Execution:                                                   │
│    1. IdentityRegistry.isVerified(user) → bool                              │
│    2. ComplianceModule.canTransfer(...) → bool                              │
│    3. UjamaaTokenizer.mint(user, amount)                                    │
│    4. AssetProof.notarize(investment_hash)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

Flutterwave fires a webhook the moment a mobile money payment is confirmed. The backend listens, performs off-chain compliance checks, triggers the on-chain transaction on Polygon, and the entire flow is seamless to the end user — they simply see their investment confirmed within seconds.

### 5.3 Contract Addresses (Testnet)

| Contract | Address (Polygon Amoy) | Purpose |
|----------|------------------------|---------|
| `UjamaaTokenizer` | `0x...` (deployed) | ERC-3643 security token for asset pools |
| `IdentityRegistry` | `0x...` (deployed) | Maps wallets to ONCHAINID identities |
| `ComplianceModule` | `0x...` (deployed) | Enforces transfer rules per asset class |
| `AssetProof` | `0x...` (deployed) | Notarizes investment records |

---

## 6. Detailed Payment Flows

### 6.1 Investment Flow — Mobile Money → ERC-3643 Token

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP-BY-STEP: MOBILE MONEY INVESTMENT                                      │
│                                                                              │
│  1. User opens the UJAMAA app and selects an asset                         │
│     • Asset displayed with local currency minimum (e.g., 5,000 XOF)        │
│     • ERC-3643 compliance badge visible (regulated security token)         │
│                                                                              │
│  2. User enters investment amount in their local currency                  │
│     • Real-time USDC equivalent displayed                                  │
│     • Token quantity calculated based on NAV per share                     │
│     • Expected annual yield shown in local currency                        │
│                                                                              │
│  3. System performs pre-compliance check (OFFCHAIN)                        │
│     • Verify user KYC status (KYC Level 1/2/3 per SRS)                     │
│     • Check jurisdiction eligibility                                       │
│     • Validate investment limits (min/max per asset class)                 │
│                                                                              │
│  4. Flutterwave initiates a mobile money payment prompt                    │
│     • USSD push to user's registered phone number                          │
│     • Operator logo and brand colors displayed                             │
│     • Amount shown in local currency                                       │
│                                                                              │
│  5. User confirms the payment on their mobile money app                    │
│     • MTN, Orange, Airtel, M-Pesa, etc.                                    │
│     • PIN entry on operator USSD interface                                 │
│                                                                              │
│  6. Flutterwave confirms payment and fires webhook to UJAMAA backend       │
│     • Payment ID, transaction reference, timestamp                         │
│     • Webhook signature verified for authenticity                          │
│                                                                              │
│  7. Backend performs final compliance validation                           │
│     • IdentityRegistry.isVerified(user_wallet)                             │
│     • ComplianceModule.canTransfer(...)                                    │
│     • Investment recorded in PostgreSQL audit table                        │
│                                                                              │
│  8. Backend calls minting function on Polygon                              │
│     • UjamaaTokenizer.mint(user_wallet, token_amount)                      │
│     • Gas fee paid from platform treasury (user doesn't see)               │
│                                                                              │
│  9. AssetProof notarizes investment record                                 │
│     • SHA-256 hash of investment data stored on-chain                      │
│     • Immutable audit trail created                                        │
│                                                                              │
│  10. User sees confirmed investment summary on dashboard                   │
│      • Token quantity received                                             │
│      • Transaction hash (clickable to Polygonscan)                         │
│      • Downloadable investment receipt (PDF)                               │
│      • SMS confirmation sent to registered phone                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Returns Flow — ERC-3643 Token → Mobile Money

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP-BY-STEP: DIVIDEND/DISTRIBUTION PAYMENT                                │
│                                                                              │
│  1. Yield or dividend is generated on-chain via Polygon smart contract     │
│     • DistributionManager calculates pro-rata allocation                   │
│     • USDC transferred to platform distribution wallet                     │
│                                                                              │
│  2. Backend processes distribution list                                    │
│     • Query PostgreSQL for token holders per asset                         │
│     • Calculate each user's share based on token balance                   │
│     • Filter users by payout preference (mobile money vs. wallet)          │
│                                                                              │
│  3. For mobile money users: Convert USDC to local fiat                     │
│     • Ondo Finance API: USDC → USD                                               │
│     • Flutterwave FX: USD → Local currency (XOF, NGN, KES, etc.)           │
│     • Exchange rate locked for 15 minutes                                  │
│                                                                              │
│  4. Flutterwave disburses to user's mobile money wallet                    │
│     • Batch payout API call                                                │
│     • Transaction fee deducted from distribution amount                    │
│                                                                              │
│  5. User receives SMS confirmation from mobile operator                    │
│     • "You received X XOF from UJAMAA DEFI PLATFORM - Investment Return"            │
│     • Transaction reference included                                       │
│                                                                              │
│  6. Backend updates distribution status in PostgreSQL                      │
│     • Mark distribution as paid                                            │
│     • Record transaction hash and timestamp                                │
│     • Emit event for audit trail                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Secondary Market Transfer Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ERC-3643 TRANSFER WITH COMPLIANCE ENFORCEMENT                              │
│                                                                              │
│  1. Seller initiates transfer on UJAMAA marketplace                        │
│     • Selects tokens to sell                                               │
│     • Sets price in local currency or USDC                                 │
│                                                                              │
│  2. Buyer expresses interest                                               │
│     • For mobile money users: Funds held in escrow via Flutterwave         │
│     • For wallet users: USDC escrowed in smart contract                    │
│                                                                              │
│  3. ERC-3643 compliance checks (AUTOMATIC)                                 │
│     • IdentityRegistry.isVerified(buyer) → MUST be true                    │
│     • ComplianceModule.canTransfer(seller, buyer, amount) → MUST pass      │
│     • Check holding period (if applicable per asset class)                 │
│     • Check jurisdiction restrictions                                      │
│     • Check investor concentration limits                                  │
│                                                                              │
│  4. If compliance passes: Execute transfer                                 │
│     • UjamaaTokenizer.transferFrom(seller, buyer, amount)                  │
│     • USDC released to seller (or fiat via Flutterwave)                    │
│     • AssetProof.notarize(transfer_hash)                                   │
│                                                                              │
│  5. If compliance fails: Block transfer                                    │
│     • Transaction reverted with reason code                                │
│     • Funds returned to buyer                                              │
│     • Compliance alert logged for admin review                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. UX/UI Frontend Approach

### 7.1 Design Philosophy

The frontend must serve two distinct user profiles without compromising the experience of either:

- **Web3-native users** comfortable with crypto wallets, stablecoins, and on-chain transactions
- **Mobile-first African users** who use mobile money daily but have never interacted with blockchain

All blockchain complexity must be fully abstracted from the second group. Neither user should feel they are using a product designed for the other.

### 7.2 Onboarding Flow

The first screen after registration presents a single, clear choice: **"How would you like to invest?"**

- **Crypto Wallet** — connects an existing Web3 wallet (MetaMask, WalletConnect, Rainbow)
- **Mobile Money** — pays via MTN, Orange, Airtel, M-Pesa, or other local operators

This choice sets the user's default payment method for all subsequent sessions and can be updated at any time in account settings. No technical jargon appears on this screen.

**KYC Requirement Notice:**
> "Before investing, you must complete identity verification. This is required by financial regulations to protect all investors."

### 7.3 Asset Discovery Screen

The asset browsing experience is identical for both user types and displays:

- Asset name and category (Agriculture, Real Estate, Infrastructure, Mining, Energy, etc.)
- Country and issuer (e.g., "Côte d'Ivoire - Cocoa Cooperative")
- Expected annual yield (%)
- **Minimum investment amount** shown in **local currency** for mobile money users and in **USDC** for wallet users
- Funding progress bar showing the percentage of the offering already filled
- **ERC-3643 Compliance Badge** indicating regulated security token
- A prominent "Invest Now" call to action

Currency display is dynamic — the platform detects the user's payment preference and country and renders all amounts accordingly. A mobile money user in Cotonou sees amounts in XOF, not in USDC.

### 7.4 Mobile Money Investment Flow — Step by Step

**Step 1 — Amount Selection**
The user enters the investment amount in local currency. The interface shows in real time:
- The USDC equivalent (for transparency)
- The number of ERC-3643 tokens to be received (based on current NAV)
- The estimated annual return in local currency
- Any applicable fees (Flutterwave transaction fee, platform fee)

Pre-set quick-select buttons (e.g., 5,000 / 10,000 / 25,000 / 50,000 XOF) reduce typing friction.

**Step 2 — Payment Method Selection**
The user selects their mobile money operator from a dynamically filtered list based on their country. Each operator is displayed with its official logo and brand colors for instant recognition. This list is populated in real time via the Flutterwave API.

| Country | Available Operators |
|---------|---------------------|
| **Benin** | MTN MoMo, Moov Money |
| **Côte d'Ivoire** | Orange Money, MTN MoMo, Moov Money |
| **Senegal** | Orange Money, Wave, Free Money |
| **Nigeria** | MTN MoMo, Airtel Money, M-Pesa |
| **Kenya** | M-Pesa, Airtel Money |
| **Ghana** | MTN MoMo, Vodafone Cash, AirtelTigo Money |

**Step 3 — Mobile Number Confirmation**
The user confirms or enters the mobile money number to be charged. If provided at registration, this field is pre-filled. A plain-language note reads: *"You will receive a payment confirmation on this number."*

**Step 4 — Payment Prompt & Confirmation**
Flutterwave initiates the mobile money charge. The user receives a USSD push or in-app prompt from their operator. The UJAMAA app displays a waiting screen: *"Waiting for your confirmation on [operator name]..."* with a timeout indicator (typically 5 minutes).

**Step 5 — Processing Screen**
Once Flutterwave confirms payment, the backend silently handles:
- Fiat-to-USDC conversion via Onafriq/Ondo Finance
- ERC-3643 compliance verification
- Token minting on Polygon
- AssetProof notarization

The user sees: *"Securing your investment on the blockchain..."* — no technical details are exposed.

**Step 6 — Success Confirmation**
The confirmation screen displays:
- Amount invested in local currency
- Asset name and ERC-3643 token quantity received
- Transaction hash (clickable to Polygonscan)
- Estimated next return date
- A downloadable investment receipt (PDF or image)

An SMS confirmation is simultaneously sent to the user's mobile number.

### 7.5 Web3 Wallet Investment Flow

- User connects wallet via WalletConnect, MetaMask, or Rainbow
- Selects asset and enters amount in USDC
- Reviews transaction details including:
  - Polygon gas fee (typically $0.001-$0.01)
  - Token quantity to receive
  - ERC-3643 compliance notice
- Signs transaction in their wallet
- Confirmation screen displays:
  - Transaction hash with Polygonscan link
  - Token balance updated
  - Downloadable receipt

### 7.6 Portfolio Dashboard

The dashboard adapts its display by payment profile:

- **Mobile money users** see portfolio value in local currency with a USDC secondary display
- **Web3 users** see portfolio value in USDC with a local currency secondary display
- Both profiles see:
  - Total invested
  - Current value (updated with latest NAV)
  - Total returns earned
  - List of held assets with individual performance
  - ERC-3643 token balances per asset
  - Upcoming distribution dates
- A **"Withdraw Returns"** button initiates the reverse flow — for mobile money users, returns are disbursed directly to their mobile money wallet via Flutterwave

### 7.7 Returns & Withdrawal Flow (Mobile Money)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  WITHDRAWAL FLOW: TOKEN RETURNS → MOBILE MONEY                              │
│                                                                              │
│  1. User receives in-app notification and SMS:                             │
│     "Your return of X XOF is ready to withdraw."                           │
│                                                                              │
│  2. User taps "Withdraw to Mobile Money"                                   │
│     • Withdrawal amount displayed in local currency                        │
│     • Exchange rate shown (if converting from USDC)                        │
│     • Transaction fee disclosed                                            │
│                                                                              │
│  3. User confirms their mobile money number                                │
│     • Pre-filled if previously used                                        │
│     • Operator logo displayed                                              │
│                                                                              │
│  4. Backend processes withdrawal                                           │
│     • USDC converted to fiat via Flutterwave                               │
│     • Payout initiated to mobile money wallet                              │
│     • Processing time: 1-5 minutes (typically instant)                     │
│                                                                              │
│  5. User receives operator SMS confirming receipt                          │
│     • "You received X XOF from UJAMAA DEFI PLATFORM"                                │
│     • Transaction reference included                                       │
│                                                                              │
│  6. Withdrawal complete                                                    │
│     • In-app confirmation displayed                                        │
│     • Transaction recorded in audit trail                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

No bank account is required at any step.

---

## 8. KYC/AML Integration

### 8.1 KYC Requirements (Per SRS)

KYC is mandatory before any investment regardless of payment method. The KYC flow is integrated with **ONCHAINID** and includes:

| KYC Level | Requirements | Investment Limit | Use Case |
|-----------|--------------|------------------|----------|
| **Level 1 (Basic)** | • National ID or passport upload<br>• Selfie verification<br>• Phone number verification (OTP) | Up to $1,000 | Retail investors, micro-investments |
| **Level 2 (Enhanced)** | • Level 1 requirements<br>• Proof of address (utility bill)<br>• Source of funds declaration | Up to $10,000 | Accredited retail investors |
| **Level 3 (Institutional)** | • Level 2 requirements<br>• Corporate documents<br>• Beneficial owner disclosure<br>• AML screening | No limit | Institutional investors, family offices |

### 8.2 ONCHAINID Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ONCHAINID IDENTITY VERIFICATION FLOW                                       │
│                                                                              │
│  1. User submits KYC documents via UJAMAA frontend                         │
│     • Documents encrypted and stored off-chain (IPFS/encrypted S3)         │
│     • PII never stored on blockchain                                       │
│                                                                              │
│  2. Licensed KYC provider verifies documents                               │
│     • Third-party provider (e.g., Youverify, Smile Identity, Dojah)        │
│     • Verification completed within 24-48 hours                            │
│                                                                              │
│  3. Claim Issuer signs KYC approval claim                                  │
│     • Claim includes: KYC level, jurisdiction, expiration date             │
│     • Claim hash stored on-chain via IdentityRegistry                      │
│     • User's wallet address linked to ONCHAINID identity                   │
│                                                                              │
│  4. IdentityRegistry updated                                               │
│     • isVerified(user_wallet) → true                                       │
│     • getKycLevel(user_wallet) → 1/2/3                                     │
│     • getJurisdiction(user_wallet) → ISO country code                      │
│                                                                              │
│  5. For mobile money users: Phone number matching                          │
│     • Registered mobile money number matched to KYC phone number           │
│     • Additional identity assurance layer                                  │
│                                                                              │
│  6. User can now invest in ERC-3643 tokens                                 │
│     • Compliance checks automatic on every transfer                        │
│     • Identity verification valid for 12-24 months (per KYC level)         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.3 AML Screening

- **Automated Screening:** All users screened against sanctions lists (OFAC, UN, EU, UK HMT)
- **Ongoing Monitoring:** Transactions monitored for suspicious patterns (structuring, layering)
- **PEP Screening:** Politically Exposed Persons flagged for enhanced due diligence
- **Adverse Media:** News screening for negative associations

---

## 9. Language & Accessibility

- The platform supports **French and English** as primary languages, defaulting based on the user's country
- All amounts respect local **number formatting conventions** (e.g., spaces as thousand separators in francophone Africa: `10 000 XOF`)
- Mobile money flow screens use **simple, conversational language** with no financial or technical jargon
- Font sizes and tap targets are optimized for **mid-range Android devices**, which are dominant across African markets
- Every critical action triggers an **SMS fallback confirmation** for users in low-connectivity environments
- **USSD Support:** For feature phone users, basic investment functions available via USSD codes (e.g., `*123*UJAMAA#`)

---

## 10. Regulatory Context

### 10.1 African Continental Free Trade Area (AfCFTA)

The African Continental Free Trade Area adopted its **Protocol on Digital Trade** in February 2024, introducing harmonized rules for digital payments across member states and calling for interoperability between digital payment systems. This regulatory direction is favorable for a pan-African platform like UJAMAA.

### 10.2 Regional Regulatory Frameworks

| Region | Regulatory Body | Framework | Compliance Status |
|--------|-----------------|-----------|-------------------|
| **UEMOA/WAEMU** | AMF-UEMOA, BCEAO | Harmonized securities regulations | ✅ ERC-3643 compliant |
| **Nigeria** | SEC Nigeria | Digital Assets Rules | ✅ Compliant |
| **Kenya** | CMA Kenya | Virtual Asset Service Providers | ✅ Compliant |
| **Ghana** | SEC Ghana | Digital Assets Regulations | ✅ Compliant |
| **South Africa** | FSCA | Crypto Asset Provider License | ✅ Compliant |
| **Mauritius** | FSC Mauritius | CIS Manager License | ✅ Compliant |

### 10.3 ERC-3643 Compliance

The **ERC-3643 (T-REX) protocol** ensures regulatory compliance by:

- **Identity Verification:** Every token holder must have a verified ONCHAINID identity
- **Transfer Restrictions:** Only verified wallets can hold or transfer tokens
- **Jurisdiction Controls:** Assets can be restricted from certain jurisdictions
- **Investor Caps:** Maximum concentration limits enforced per investor
- **Holding Periods:** Minimum holding periods enforced at contract level
- **Audit Trail:** All transfers recorded on-chain with identity references

---

## 11. Security Considerations

### 11.1 Smart Contract Security

- **Audits:** All contracts audited by third-party firms (e.g., CertiK, Trail of Bits, OpenZeppelin)
- **Bug Bounty:** Immunefi bug bounty program with rewards up to $100,000
- **Upgrade Mechanism:** UUPS proxy pattern with timelock and multisig governance
- **Pause Functionality:** Emergency pause for critical vulnerabilities

### 11.2 Payment Security

- **Webhook Verification:** Flutterwave webhook signatures verified using HMAC-SHA256
- **Encryption:** All sensitive data encrypted at rest (AES-256) and in transit (TLS 1.3)
- **Fraud Detection:** Machine learning models detect suspicious transaction patterns
- **Rate Limiting:** API rate limits prevent abuse

### 11.3 Custody

- **Fireblocks:** MPC (Multi-Party Computation) custody for platform treasury
- **Gnosis Safe:** Multisig (4-of-7) for admin operations
- **Insurance:** Custody insurance up to $100M via Fireblocks

---

## 12. API Reference

### 12.1 Flutterwave Integration

```python
# Initialize Flutterwave payment
POST https://api.flutterwave.com/v3/charges?type=mobile_money_franchise

{
    "amount": 10000,
    "currency": "XOF",
    "email": "user@example.com",
    "phone_number": "+22912345678",
    "network": "MTN",
    "tx_ref": "UJAMAA_INV_12345",
    "redirect_url": "https://ujamaa-defi.com/investment/success",
    "meta": {
        "user_id": "user_123",
        "asset_id": "asset_456",
        "investment_type": "primary"
    }
}

# Response
{
    "status": "success",
    "message": "Payment initiated",
    "data": {
        "authorization_url": "https://checkout.flutterwave.com/...",
        "flw_ref": "FLW-MOMO-12345"
    }
}
```

### 12.2 Smart Contract Interaction

```python
# Mint ERC-3643 tokens (backend call)
from web3 import Web3

# Connect to Polygon
w3 = Web3(Web3.HTTPProvider('https://polygon-rpc.com'))

# Load contract
contract = w3.eth.contract(address=UJAMAA_TOKENIZER_ADDRESS, abi=ABI)

# Mint tokens
tx = contract.functions.mint(
    user_wallet_address,
    token_amount_wei
).build_transaction({
    'from': PLATFORM_WALLET,
    'nonce': w3.eth.get_transaction_count(PLATFORM_WALLET),
    'gas': 200000,
    'gasPrice': w3.eth.gas_price
})

# Sign and send
signed_tx = w3.eth.account.sign_transaction(tx, private_key=PLATFORM_PRIVATE_KEY)
tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

# Wait for confirmation
receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
```

---

## 13. Summary of Key Design Principles

| Principle | Implementation | SRS Reference |
|---|---|---|
| **Currency localization** | All amounts shown in the user's local currency by default | Section 2.1 |
| **Blockchain abstraction** | All on-chain steps hidden from mobile money users | Section 7.1 |
| **Operator recognition** | Mobile money providers shown with official logos and brand colors | Section 7.4 |
| **Real-time feedback** | Live conversion rates and processing states at every step | Section 7.4 |
| **Dual-path design** | Wallet and mobile money flows are parallel and never merged | Section 7.1 |
| **SMS fallback** | Every key action triggers an SMS confirmation | Section 9 |
| **Bidirectional payments** | Flutterwave handles both investment collection and return disbursement | Section 3 |
| **Security token compliance** | **ERC-3643 standard** used for all RWA token issuance on Polygon | Section 2 |
| **Identity verification** | ONCHAINID integration for KYC/AML compliance | Section 8.2 |
| **Custodial wallet** | Fireblocks or in-house custody abstracts key management from mobile money users | Section 11.3 |
| **Accessibility** | French/English support, large tap targets, optimized for mid-range Android | Section 9 |
| **Audit trail** | AssetProof notarizes all investment records | Section 5.1 |

---

## 14. Deployment Checklist

### 14.1 Pre-Deployment

- [ ] All smart contracts audited (Slither, CertiK, OpenZeppelin)
- [ ] Flutterwave sandbox testing complete
- [ ] Mobile money operator testing complete (MTN, Orange, Airtel, M-Pesa)
- [ ] ONCHAINID Claim Issuer configured
- [ ] Backend webhook endpoints secured (HMAC verification)
- [ ] PostgreSQL GDPR compliance configured (encryption, pseudonymization)
- [ ] FastAPI rate limiting configured
- [ ] SMS gateway integration tested (Twilio, Africa's Talking)

### 14.2 Testnet Deployment

- [ ] Contracts deployed to Polygon Amoy
- [ ] Contracts verified on Polygonscan Amoy
- [ ] Test investments completed end-to-end
- [ ] Test distributions completed
- [ ] Secondary market transfers tested
- [ ] Compliance rules tested (holding periods, jurisdiction blocks)

### 14.3 Production Deployment

- [ ] Contracts deployed to Polygon Mainnet
- [ ] Contracts verified on Polygonscan
- [ ] Flutterwave production credentials configured
- [ ] Onafriq/Ondo Finance production integration complete
- [ ] Fireblocks custody configured
- [ ] Gnosis Safe multisig configured (4-of-7)
- [ ] Monitoring and alerting configured (Datadog, PagerDuty)
- [ ] Customer support trained on mobile money flows

---

## 15. Support & Contact

| Function | Contact | Response Time |
|----------|---------|---------------|
| **Technical Support** | `tech@ujamaa-defi.com` | 24 hours |
| **Compliance Queries** | `compliance@ujamaa-defi.com` | 48 hours |
| **Flutterwave Integration** | `developers@flutterwavego.com` | 24 hours |
| **Security Issues** | `security@ujamaa-defi.com` | Immediate |
| **General Inquiries** | `info@ujamaa-defi.com` | 48 hours |

---

**Document Version:** 2.0 (ERC-3643 Aligned)
**Last Updated:** March 15, 2026
**Next Review:** April 15, 2026


