# UJAMAA DEFI PLATFORM — Complete Payment Workflow
## Critical Technical Specification: From Investor to Asset Originator

**Version:** 2.0 (ERC-3643 Aligned)
**Date:** March 15, 2026
**Author:** Aziz Da Silva - Lead Architect
**Classification:** Technical
**Audience:** Backend Engineers, Smart Contract Developers, Compliance Officers, Integration Partners

---

## Executive Summary

**CRITICAL UPDATE:** This document has been revised to align with the **Software Requirements Specification (SRS) v1.3** and **Smart Contract Specification v1.0**. All references to ERC-1400 have been replaced with **ERC-3643 (T-REX Protocol)**, and contract names have been updated to reflect the actual implementation (`UjamaaTokenizer`, `IdentityRegistry`, `ComplianceModule`, `AssetProof`).

### Key Changes from Previous Version

| Aspect | Previous (v1.0) | Updated (v2.0) | Impact |
|--------|-----------------|----------------|--------|
| **Token Standard** | ERC-1400 | **ERC-3643 (T-REX)** | Smart contract code, compliance logic |
| **Token Contract** | `UjamaaToken` | **`UjamaaTokenizer`** | All integration code |
| **Identity System** | Generic KYC | **ONCHAINID** | Compliance architecture |
| **Compliance** | Basic rules | **ERC-3643 Compliance Modules** | Transfer restrictions |
| **Asset Provenance** | Not specified | **AssetProof (SHA-256)** | Audit trail |
| **Document Location** | `docs/` | **`docs/03_TECHNICAL_GUIDES/`** | Information architecture |

---

## 1. Critical Architecture Reframing

Since UJAMAA **is** the tokenization platform (not a broker or aggregator), its role is fundamentally different from traditional financial intermediaries. UJAMAA is simultaneously:

| Role | Function | Smart Contract Implementation |
|------|----------|------------------------------|
| **Arranger** | Structures the tokenization deal with the asset originator | Off-chain (legal structuring) |
| **Issuer** | Creates and deploys SPV, mints ERC-3643 security tokens | `UjamaaTokenizer.mint()` |
| **Transfer Agent** | Manages investor registry, token lifecycle, corporate actions | `IdentityRegistry` + `ComplianceModule` |
| **Distribution Platform** | Onboards investors, collects subscription funds | Frontend + Flutterwave integration |
| **Paying Agent** | Distributes yields and returns to investors | `DistributionManager` contract |
| **Compliance Enforcer** | Ensures regulatory adherence on every transfer | `ComplianceModule.canTransfer()` |
| **Audit Trail Manager** | Maintains immutable record of all transactions | `AssetProof.notarize()` |

**CRITICAL:** This means **every fund flow is governed by ERC-3643 smart contracts and legal documentation** — not by a third-party platform. UJAMAA owns the infrastructure and bears the compliance obligation.

### 1.1 SRS Alignment

This workflow specification aligns with the following SRS v1.3 requirements:

| SRS Section | Requirement | Implementation |
|-------------|-------------|----------------|
| **Section 2.2** | ERC-3643 fungible token minting | `UjamaaTokenizer` contract |
| **Section 3.1** | Identity verification via ONCHAINID | `IdentityRegistry` contract |
| **Section 3.4** | Transfer restriction enforcement | `ComplianceModule` contract |
| **Section 3.6** | Automated repayment distribution | `DistributionManager` contract |
| **Section 5.3** | Blockchain layer (Polygon) | Polygon Amoy/Mainnet |
| **Section 7.1** | ERC-3643 transfer enforcement | Built into every transfer |
| **Section 10.2** | AML/KYC via ONCHAINID | Claim Issuer integration |

---

## 2. The Five Parties in the UJAMAA Ecosystem (Updated)

| Party | Role | Smart Contract Interaction | Custody |
|-------|------|---------------------------|---------|
| **Asset Originator** | African business, developer, or project owner bringing an asset to tokenize | Receives USDC from SPV wallet after round closes | Bank account (fiat) or USDC wallet |
| **UJAMAA Platform** | Tokenizer, issuer, arranger, transfer agent, paying agent, compliance enforcer | Deploys contracts, mints tokens, enforces compliance | Gnosis Safe multisig (4-of-7) |
| **SPV** | Legally isolated entity created by UJAMAA per asset, holds legal title to asset | Receives proceeds from token sale, holds USDC for operations | Dedicated USDC wallet per SPV |
| **Investor** | Retail or institutional — pays via mobile money, bank transfer, or Web3 wallet | Receives ERC-3643 tokens, receives distributions | Self-custody (Web3) or Fireblocks custody (mobile money) |
| **Custodian** | Fireblocks or in-house — holds private keys on behalf of mobile money investors | MPC custody for non-Web3 users | Institutional-grade MPC |

### 2.1 Critical Distinction: Custody Models

| Investor Type | Custody Model | Private Key Holder | Regulatory Implication |
|---------------|---------------|-------------------|----------------------|
| **Web3 Native** | Self-custody | Investor (MetaMask, WalletConnect) | Investor bears key management risk |
| **Mobile Money** | Custodial (Fireblocks) | UJAMAA (MPC custody) | UJAMAA bears fiduciary duty |
| **Institutional** | Qualified custodian | Licensed third-party | Regulatory compliance per jurisdiction |

---

## 3. Pre-Investment: Asset Onboarding by UJAMAA (Critical Path)

Before any investor sends a single franc, UJAMAA completes the following steps as the tokenization platform:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: ASSET ORIGINATION                                                 │
│                                                                              │
│  ASSET ORIGINATOR                                                            │
│  (Farmer, Developer, Infrastructure Owner, Factory Owner...)                │
│          │                                                                   │
│          │ 1. Submits asset for tokenization via UJAMAA platform            │
│          │    • Asset details (type, location, value, expected yield)       │
│          │    • Legal documentation (title, permits, insurance)             │
│          │    • Financial projections (3-5 year cash flow model)            │
│          ▼                                                                   │
│  UJAMAA DUE DILIGENCE (OFF-CHAIN)                                           │
│          │                                                                   │
│          │ 2. Legal title verification — CRITICAL GATE                      │
│          │    • Asset must be debt-free and clear of encumbrances          │
│          │    • Title search conducted by local law firm                   │
│          │    • Opinion letter issued: "Title is marketable"               │
│          │                                                                   │
│          │ 3. Independent asset valuation by certified auditor              │
│          │    • Valuation firm must be licensed in asset jurisdiction      │
│          │    • Valuation report includes: DCF, comparables, replacement   │
│          │    • Valid for 12 months from issue date                        │
│          │                                                                   │
│          │ 4. Originator KYB (Know Your Business) and AML screening         │
│          │    • Corporate documents verified (registration, bylaws)        │
│          │    • Beneficial owners identified (>10% ownership)              │
│          │    • Sanctions screening (OFAC, UN, EU, UK HMT)                 │
│          │    • PEP (Politically Exposed Person) screening                 │
│          │    • Adverse media search                                       │
│          ▼                                                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: LEGAL STRUCTURING                                                 │
│                                                                              │
│  UJAMAA LEGAL TEAM + LOCAL COUNSEL                                          │
│          │                                                                   │
│          │ 5. UJAMAA creates a dedicated SPV per asset                      │
│          │    • Jurisdiction selected (Mauritius, Delaware, local LLC)     │
│          │    • SPV is bankruLPcy-remote from UJAMAA and originator        │
│          │    • SPV Operating Agreement drafted                            │
│          │                                                                   │
│          │ 6. Asset title transferred from Originator into SPV              │
│          │    • Legally a "true sale" — isolates asset from originator     │
│          │    • Recorded in local land registry / asset registry           │
│          │    • SPV now holds legal title to the asset                     │
│          │                                                                   │
│          │ 7. UJAMAA drafts offering documents (SEC/MiCA compliant)         │
│          │    • Private Placement Memorandum (PPM)                         │
│          │    • Token Subscription Agreement (ERC-3643 gated)              │
│          │    • SPV Operating Agreement (investor rights)                  │
│          │    • Risk Disclosure Statement (mandatory per jurisdiction)     │
│          │    • Investment Questionnaire (accreditation verification)      │
│          ▼                                                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: SMART CONTRACT DEPLOYMENT (Polygon)                               │
│                                                                              │
│  UJAMAA SMART CONTRACTS                                                     │
│          │                                                                   │
│          │ 8. ERC-3643 security token contract deployed on Polygon          │
│          │    • Contract: UjamaaTokenizer (per-asset deployment)           │
│          │    • Standard: ERC-3643 (T-REX Protocol)                        │
│          │    • Chain: Polygon Mainnet (or Amoy for testnet)               │
│          │                                                                   │
│          │ 9. Token parameters configured in smart contract:                │
│          │    • Total supply: e.g., 1,000,000 tokens                       │
│          │    • Price per token: e.g., $1.00 USDC                          │
│          │    • Minimum investment: e.g., $100 (retail) / $10,000 (inst.)  │
│          │    • Funding target: e.g., $1,000,000 USDC                      │
│          │    • Deadline: e.g., 90 days from listing                       │
│          │    • Yield schedule: e.g., quarterly distributions              │
│          │    • Lock-up period: e.g., 365 days (no transfers before)       │
│          │    • Jurisdiction restrictions: e.g., no US persons             │
│          │                                                                   │
│          │ 10. Compliance configuration in ComplianceModule:                │
│          │    • Max investors: e.g., 200 (Reg D) / 500 (Reg A+)            │
│          │    • Max concentration: e.g., no investor >25% of supply        │
│          │    • Accreditation required: yes/no per asset class             │
│          │    • Restricted jurisdictions: OFAC list + high-risk countries  │
│          │                                                                   │
│          │ 11. Smart contract escrow deployed — no funds released until    │
│          │     target met OR deadline passed                                │
│          │                                                                   │
│          ▼                                                                   │
│  ASSET LISTED ON UJAMAA PLATFORM                                            │
│          │                                                                   │
│          │ 12. Asset goes live for investor subscription                    │
│          │     • Asset page created with full disclosure                    │
│          │     • PPM, risk factors, financials available for download       │
│          │     • Investment calculator: ROI projection                      │
│          │     • "Invest Now" button active                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Critical Compliance Gates

Before an asset can be listed, ALL of the following must be TRUE:

```python
# Pseudocode: Asset listing compliance check
def can_list_asset(asset):
    # Gate 1: Legal title verified
    assert asset.title_verified == True, "Title not verified"
    assert asset.title_opinion_letter == "Marketable", "Title opinion negative"
    
    # Gate 2: Valuation current
    assert asset.valuation_date >= today - timedelta(days=365), "Valuation expired"
    assert asset.valuation_firm.licensed == True, "Valuation firm not licensed"
    
    # Gate 3: Originator KYB passed
    assert asset.originator.kyb_status == "APPROVED", "KYB not approved"
    assert asset.originator.aml_status == "CLEARED", "AML screening failed"
    assert asset.originator.sanctions_check == "CLEAR", "Sanctions match found"
    
    # Gate 4: Legal documents complete
    assert asset.ppm_signed == True, "PPM not signed"
    assert asset.subscription_agreement_template == True, "Subscription agreement missing"
    assert asset.risk_disclosure_published == True, "Risk disclosure missing"
    
    # Gate 5: Smart contract deployed
    assert asset.token_contract_deployed == True, "Token contract not deployed"
    assert asset.token_contract_standard == "ERC-3643", "Wrong token standard"
    assert asset.compliance_module_configured == True, "Compliance not configured"
    
    # Gate 6: Regulatory approval (if required)
    if asset.jurisdiction.requires_regulatory_approval:
        assert asset.regulatory_approval_received == True, "Regulatory approval pending"
    
    return True  # All gates passed - asset can be listed
```

---

## 4. Investment Flow — Path A: Mobile Money (No Web3 Wallet)

**CRITICAL:** This flow abstracts all blockchain complexity from the user while maintaining full ERC-3643 compliance.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  MOBILE MONEY INVESTMENT FLOW (ERC-3643 Compliant)                          │
│                                                                              │
│  INVESTOR                                                                    │
│  (MTN MoMo / Orange Money / Airtel Money / M-Pesa)                          │
│          │                                                                   │
│          │ 1. Browses assets on UJAMAA mobile-first web app                 │
│          │    • Asset displayed with local currency minimum                  │
│          │      (e.g., 5,000 XOF for Côte d'Ivoire investor)                │
│          │    • ERC-3643 compliance badge visible                            │
│          │    • Expected yield shown in local currency                       │
│          │                                                                   │
│          │ 2. Selects asset — amount displayed in local currency            │
│          │    (XOF, NGN, KES, GHS, ZAR — auto-detected by country)          │
│          │                                                                   │
│          │ 3. Completes KYC inline (if not already verified)                │
│          │    • National ID or passport upload                              │
│          │    • Selfie verification (liveness check)                        │
│          │    • Phone number verification via OTP                           │
│          │    • For mobile money users: phone number matched to              │
│          │      registered mobile money number (additional assurance)       │
│          │                                                                   │
│          │ 4. KYC submitted to ONCHAINID Claim Issuer                       │
│          │    • Third-party provider (Youverify, Smile Identity, Dojah)     │
│          │    • Verification completed within 24-48 hours                   │
│          │    • Upon approval: Claim issued and stored in                   │
│          │      IdentityRegistry smart contract                             │
│          │    • User wallet address now: isVerified() == true               │
│          ▼                                                                   │
│  FLUTTERWAVE PAYMENT GATEWAY                                                 │
│          │                                                                   │
│          │ 5. Investor enters investment amount in local currency           │
│          │    • Real-time USDC equivalent displayed                         │
│          │    • Token quantity calculated (amount / price per token)        │
│          │    • Estimated annual return shown                               │
│          │                                                                   │
│          │ 6. Investor selects mobile money operator                        │
│          │    • MTN, Orange, Airtel, M-Pesa, Vodafone                       │
│          │    • Operator logo displayed with brand colors                   │
│          │    • List populated dynamically via Flutterwave API              │
│          │                                                                   │
│          │ 7. Investor confirms mobile money number                         │
│          │    • Pre-filled if provided at registration                      │
│          │    • Note: "You will receive a payment prompt on this number"    │
│          │                                                                   │
│          │ 8. Flutterwave sends USSD push / in-app prompt                  │
│          │    • Prompt appears on investor's mobile phone                   │
│          │    • Shows: amount, merchant name (UJAMAA), transaction ref      │
│          │                                                                   │
│          │ 9. Investor approves payment on mobile operator app              │
│          │    • Enters PIN on operator USSD interface                       │
│          │    • Payment authorized                                          │
│          │                                                                   │
│          │ 10. Flutterwave confirms payment — fires webhook to UJAMAA       │
│          │     • Webhook payload:                                           │
│          │       {                                                          │
│          │         "transaction_id": "FLW-MOMO-12345",                      │
│          │         "amount": 10000,                                         │
│          │         "currency": "XOF",                                       │
│          │         "status": "SUCCESS",                                     │
│          │         "phone_number": "+22912345678",                          │
│          │         "network": "MTN"                                         │
│          │       }                                                          │
│          │     • Webhook signature verified via HMAC-SHA256                 │
│          ▼                                                                   │
│  UJAMAA BACKEND (FastAPI + PostgreSQL)                                      │
│          │                                                                   │
│          │ 11. Backend verifies webhook authenticity                        │
│          │     • HMAC signature validation                                  │
│          │     • Transaction ID checked for replay attacks                  │
│          │                                                                   │
│          │ 12. Backend checks KYC clearance in PostgreSQL                   │
│          │     • SELECT kyc_level FROM investors WHERE phone = ...          │
│          │     • Must be KYC Level 1 or higher                              │
│          │                                                                   │
│          │ 13. Backend records subscription in investor registry            │
│          │     • INSERT INTO subscriptions (...)                            │
│          │     • Status: "PAYMENT_RECEIVED"                                 │
│          │     • Audit trail: timestamp, IP address, device fingerprint     │
│          ▼                                                                   │
│  ONAFRIQ + Ondo Finance ON-RAMP                                                    │
│          │                                                                   │
│          │ 14. Fiat (XOF, NGN, KES...) converted to USDC at locked rate     │
│          │     • Rate locked for 15 minutes at payment confirmation         │
│          │     • Onafriq API: POST /convert                                 │
│          │     • Response: USDC amount, Ondo Finance transaction ID               │
│          │                                                                   │
│          │ 15. USDC sent to UJAMAA smart contract escrow on Polygon         │
│          │     • From: Onafriq settlement wallet                            │
│          │     • To: UjamaaTokenizer escrow address                         │
│          │     • Transaction hash recorded in PostgreSQL                    │
│          ▼                                                                   │
│  SMART CONTRACT ESCROW (Polygon)                                             │
│          │                                                                   │
│          │ 16. USDC held in escrow — locked until funding target met        │
│          │     • Escrow balance updated: total_raised += amount            │
│          │     • Event emitted: SubscriptionReceived(investor, amount)      │
│          │                                                                   │
│          │ 17. ERC-3643 compliance check (AUTOMATIC)                        │
│          │     • IdentityRegistry.isVerified(investor_wallet) == true       │
│          │     • ComplianceModule.canTransfer(...) == true                  │
│          │     • If check fails: transaction reverted, funds returned       │
│          │                                                                   │
│          │ 18. ERC-3643 tokens minted to investor's custodial wallet        │
│          │     • UjamaaTokenizer.mint(investor_wallet, token_amount)        │
│          │     • Tokens held in Fireblocks MPC custody                      │
│          │     • Gas fee paid from platform treasury (user doesn't see)     │
│          │                                                                   │
│          │ 19. AssetProof notarizes investment record                       │
│          │     • SHA-256 hash of investment data computed                   │
│          │     • AssetProof.notarize(investment_hash)                       │
│          │     • Immutable audit trail created on Polygon                   │
│          ▼                                                                   │
│  INVESTOR DASHBOARD                                                          │
│          │                                                                   │
│          │ 20. Investor sees token holdings and investment confirmation     │
│          │     • Token quantity: e.g., "10,000 UJAA tokens"                 │
│          │     • Asset name: e.g., "Côte d'Ivoire Cocoa Cooperative"        │
│          │     • Transaction hash (clickable to Polygonscan)                │
│          │     • Expected next distribution date                            │
│          │                                                                   │
│          │ 21. SMS confirmation sent to mobile number                       │
│          │     • "UJAMAA: Investment confirmed. 10,000 tokens acquired.     │
│          │        Ref: FLW-MOMO-12345. View: ujamaa-defi.com/portfolio"     │
│          │                                                                   │
│          │ 22. PDF investment receipt available for download                │
│          │     • Includes: investor details, asset details, token qty,      │
│          │       transaction ref, compliance statements                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Critical Technical Details

#### 4.1.1 Webhook Security

```python
# FastAPI webhook endpoint with HMAC verification
from fastapi import APIRouter, HTTPException, Request
import hmac
import hashlib

router = APIRouter()

@router.post("/webhooks/flutterwave")
async def flutterwave_webhook(request: Request):
    # Get webhook signature from headers
    signature = request.headers.get("X-Flutterwave-Signature")
    if not signature:
        raise HTTPException(status_code=401, detail="Missing signature")
    
    # Read raw payload
    payload = await request.body()
    
    # Verify HMAC-SHA256 signature
    secret = settings.FLUTTERWAVE_WEBHOOK_SECRET
    expected_signature = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected_signature):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    # Check for replay attacks
    data = json.loads(payload)
    if await is_duplicate_transaction(data["transaction_id"]):
        raise HTTPException(status_code=400, detail="Duplicate transaction")
    
    # Process payment
    await process_mobile_money_payment(data)
    
    return {"status": "success"}
```

#### 4.1.2 ERC-3643 Compliance Check

```solidity
// Smart contract: ERC-3643 transfer validation
function _canTransfer(
    address from,
    address to,
    uint256 amount
) internal view override returns (bool) {
    // Check 1: Identity verification (BOTH parties)
    require(
        identityRegistry().isVerified(from),
        "Sender not verified"
    );
    require(
        identityRegistry().isVerified(to),
        "Recipient not verified"
    );
    
    // Check 2: KYC level sufficient
    require(
        identityRegistry().getKycLevel(to) >= requiredKycLevel,
        "KYC level insufficient"
    );
    
    // Check 3: Jurisdiction not restricted
    string memory investorJurisdiction = identityRegistry().getJurisdiction(to);
    require(
        !complianceModule().isJurisdictionRestricted(investorJurisdiction),
        "Jurisdiction restricted"
    );
    
    // Check 4: Holding period (if applicable)
    if (lockupPeriod > 0) {
        require(
            block.timestamp >= firstPurchaseTime[to] + lockupPeriod,
            "Lock-up period not elapsed"
        );
    }
    
    // Check 5: Concentration limit
    uint256 investorBalance = balanceOf(to) + amount;
    uint256 totalSupply = totalSupply();
    require(
        (investorBalance * 100) / totalSupply <= maxConcentration,
        "Concentration limit exceeded"
    );
    
    return true;
}
```

---

## 5. Investment Flow — Path B: Web3 Wallet (Crypto-Native Investor)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  WEB3 WALLET INVESTMENT FLOW (ERC-3643 Compliant)                           │
│                                                                              │
│  INVESTOR                                                                    │
│  (MetaMask / WalletConnect / Rainbow / Trust Wallet)                        │
│          │                                                                   │
│          │ 1. Connects wallet to UJAMAA platform                            │
│          │    • WalletConnect QR code or MetaMask popup                    │
│          │    • Wallet address captured: 0x...                              │
│          │                                                                   │
│          │ 2. Completes KYC (if not already verified)                       │
│          │    • Same KYC flow as mobile money (ID, selfie, OTP)            │
│          │    • Wallet address linked to ONCHAINID identity                │
│          │    • Claim Issuer signs KYC approval claim                      │
│          │    • IdentityRegistry.isVerified(wallet) == true                │
│          │                                                                   │
│          │ 3. Browses assets — amounts shown in USDC                        │
│          │    • Local currency secondary display (optional)                │
│          │    • ERC-3643 compliance badge visible                          │
│          │                                                                   │
│          │ 4. Selects asset and enters amount in USDC                      │
│          │    • Token quantity calculated in real-time                     │
│          │    • Polygon gas fee estimate displayed                         │
│          │    • Compliance notice: "Only verified wallets can hold"        │
│          │                                                                   │
│          │ 5. Pre-compliance check (OFFCHAIN)                               │
│          │    • Backend checks: IdentityRegistry.isVerified(wallet)        │
│          │    • If false: "Please complete KYC before investing"           │
│          │    • If true: Proceed to transaction                            │
│          ▼                                                                   │
│  POLYGON NETWORK                                                             │
│          │                                                                   │
│          │ 6. Investor approves USDC transfer to escrow                     │
│          │    • MetaMask popup: "Approve USDC transfer"                    │
│          │    • Amount: e.g., 1,000 USDC                                   │
│          │    • Spender: UjamaaTokenizer escrow address                    │
│          │    • Gas fee: ~$0.001 (Polygon)                                 │
│          │                                                                   │
│          │ 7. USDC transferred directly to smart contract escrow            │
│          │    • Transaction: USDC.transferFrom(investor, escrow, amount)   │
│          │    • Transaction hash recorded on-chain                         │
│          │    • Event emitted: SubscriptionReceived(investor, amount)      │
│          ▼                                                                   │
│  SMART CONTRACT ESCROW (Polygon)                                             │
│          │                                                                   │
│          │ 8. USDC held in escrow pending funding target                   │
│          │    • Escrow balance updated                                     │
│          │    • Progress bar updated on frontend                           │
│          │                                                                   │
│          │ 9. ERC-3643 tokens minted and sent to investor's wallet          │
│          │    • UjamaaTokenizer.mint(investor, token_amount)               │
│          │    • Tokens held in investor's self-custody wallet              │
│          │    • Event emitted: TokensMinted(investor, amount)              │
│          │                                                                   │
│          │ 10. AssetProof notarizes investment record                       │
│          │     • SHA-256 hash of investment data                            │
│          │     • AssetProof.notarize(investment_hash)                       │
│          ▼                                                                   │
│  INVESTOR DASHBOARD                                                          │
│          │                                                                   │
│          │ 11. Investor sees token holdings + Polygonscan link              │
│          │     • Token balance: e.g., "1,000 UJAA"                          │
│          │     • Transaction hash: 0x... (clickable)                        │
│          │     • Asset details and expected yield                           │
│          │     • Downloadable investment receipt (PDF)                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Investment Flow — Path C: Bank Transfer (Institutional Investor)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  INSTITUTIONAL INVESTMENT FLOW (Bank Transfer / SWIFT)                      │
│                                                                              │
│  INSTITUTIONAL INVESTOR                                                      │
│  (Pension Fund, Family Office, Insurance Company, DFI)                      │
│          │                                                                   │
│          │ 1. Completes enhanced KYC/KYB off-platform                       │
│          │    • Corporate documents (registration, bylaws, AML policy)      │
│          │    • Beneficial owner disclosure (>10% ownership)                │
│          │    • Board resolution authorizing investment                    │
│          │    • Investment mandate documentation                           │
│          │    • Regulatory licenses (if required)                          │
│          │                                                                   │
│          │ 2. Signs Subscription Agreement and PPM acknowledgment          │
│          │    • DocuSign or physical signature                             │
│          │    • Legal review by institutional counsel                      │
│          │    • Accreditation verification (if required by jurisdiction)    │
│          │                                                                   │
│          │ 3. UJAMAA issues bank transfer instruction                       │
│          │    • Unique reference code: "UJAMAA-[ASSET_ID]-[INVESTOR_ID]"   │
│          │    • SPV subscription account details                           │
│          │    • Bank: Regulated partner bank (e.g., Mauritius Commercial)  │
│          │    • Currency: USD, EUR, or local currency                      │
│          │    • SWIFT/BIC code provided                                    │
│          ▼                                                                   │
│  UJAMAA SPV SUBSCRIPTION ACCOUNT                                             │
│  (Regulated Bank — Escrow Account dedicated to this asset's SPV)            │
│          │                                                                   │
│          │ 4. Wire transfer received in SPV account                         │
│          │    • SWIFT MT103 message received                               │
│          │    • Amount verified against subscription                       │
│          │    • Reference code matched to investor                         │
│          │                                                                   │
│          │ 5. UJAMAA compliance team verifies source of funds               │
│          │    • AML screening: source of wealth documentation              │
│          │    • Sanctions check: OFAC, UN, EU, UK HMT                      │
│          │    • PEP screening: beneficial owners                           │
│          │    • Adverse media search                                       │
│          │                                                                   │
│          │ 6. Fiat recorded against investor's subscription                 │
│          │    • PostgreSQL: subscriptions table updated                    │
│          │    • Status: "FUNDS_RECEIVED"                                   │
│          │    • Audit trail: compliance officer sign-off                   │
│          ▼                                                                   │
│  UJAMAA BACKEND                                                              │
│          │                                                                   │
│          │ 7. On-ramp converts fiat → USDC on Polygon                       │
│          │    • Ondo Finance Mint (for institutional amounts >$100K)             │
│          │    • Or OTC desk partner (for large conversions)                │
│          │    • Exchange rate locked at time of conversion                 │
│          │                                                                   │
│          │ 8. USDC deposited into smart contract escrow                     │
│          │    • From: SPV settlement wallet                                │
│          │    • To: UjamaaTokenizer escrow address                         │
│          │    • Transaction hash recorded                                  │
│          ▼                                                                   │
│  SMART CONTRACT ESCROW (Polygon)                                             │
│          │                                                                   │
│          │ 9. USDC held in escrow pending round completion                 │
│          │    • Escrow balance updated                                     │
│          │    • Progress toward funding target                             │
│          │                                                                   │
│          │ 10. ERC-3643 tokens minted to investor's whitelisted wallet      │
│          │     • UjamaaTokenizer.mint(institution_wallet, token_amount)    │
│          │     • Or held in UJAMAA custodial wallet if requested           │
│          │     • Event emitted: TokensMinted(institution, amount)          │
│          ▼                                                                   │
│  INSTITUTIONAL INVESTOR DASHBOARD                                            │
│          │                                                                   │
│          │ 11. Investor sees confirmed token allocation                     │
│          │     • Token quantity and asset details                          │
│          │     • Transaction hash (Polygonscan link)                       │
│          │     • Official confirmation letter (PDF download)               │
│          │     • Investor relations contact information                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Round Closure & Capital Release to Asset Originator (Critical Gate)

**CRITICAL:** This is the most critical gate in the entire flow. **No capital ever reaches the asset originator until the funding round is fully validated by the smart contract AND all compliance checks pass.**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ROUND CLOSURE: SUCCESS SCENARIO                                            │
│                                                                              │
│  SMART CONTRACT ESCROW (Polygon)                                             │
│          │                                                                   │
│          │ [CONDITION A — Funding target reached BEFORE deadline]           │
│          │                                                                   │
│          │ Smart contract continuously monitors:                            │
│          │   if (total_raised >= funding_target &&                          │
│          │       block.timestamp <= deadline) {                             │
│          │       emit FundingTargetReached();                               │
│          │   }                                                              │
│          ▼                                                                   │
│  UJAMAA BACKEND (Automated Trigger)                                          │
│          │                                                                   │
│          │ 1. Smart contract emits FundingTargetReached event              │
│          │    • Backend listener detects event                             │
│          │    • Round closure process initiated                            │
│          │                                                                   │
│          │ 2. UJAMAA compliance performs final AML sweep                    │
│          │    • All subscriptions re-screened against sanctions lists      │
│          │    • Any matches flagged for manual review                      │
│          │    • If match found: subscription frozen, funds quarantined     │
│          │                                                                   │
│          │ 3. Round officially declared closed on-chain                     │
│          │    • UjamaaTokenizer.closeRound() called                        │
│          │    • State changed: is_closed = true                            │
│          │    • Event emitted: RoundClosed(asset_id, total_raised)         │
│          ▼                                                                   │
│  SPV ACCOUNT (Asset-Dedicated Legal Entity)                                  │
│          │                                                                   │
│          │ 4. Smart contract releases USDC from escrow to SPV wallet        │
│          │    • Escrow.transfer(spv_wallet, total_raised)                  │
│          │    • Transaction hash recorded on-chain                         │
│          │                                                                   │
│          │ 5. UJAMAA platform fee deducted automatically                    │
│          │    • Fee percentage encoded in smart contract at issuance       │
│          │    • Example: 2% issuance fee on $1M = $20,000 USDC             │
│          │    • Fee transferred to UJAMAA treasury wallet                  │
│          │    • Transparent: visible on Polygonscan                        │
│          │                                                                   │
│          │ 6. SPV converts USDC → local fiat via banking partner            │
│          │    • For large amounts: OTC desk or Ondo Finance Mint redeem          │
│          │    • For smaller amounts: Flutterwave FX                        │
│          │    • Fiat deposited into SPV operating account                  │
│          ▼                                                                   │
│  ASSET ORIGINATOR                                                            │
│          │                                                                   │
│          │ 7. Originator receives net capital proceeds                      │
│          │    • Bank transfer to originator's operating account            │
│          │    • Amount: total_raised - issuance_fee - conversion_costs     │
│          │                                                                   │
│          │ 8. Capital use governed by SPV Operating Agreement               │
│          │    • Originator contractually bound to stated use of funds      │
│          │    • Misuse = breach of contract = legal recourse               │
│          │    • UJAMAA may require periodic proof of use of funds          │
│          │                                                                   │
│          │ 9. All fund release events recorded immutably on Polygon         │
│          │     • AssetProof.notarize(fund_release_hash)                    │
│          │     • Audit trail: who, what, when, how much                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.1 Critical Compliance: Final AML Sweep

```python
# Pseudocode: Final AML sweep before round closure
async def final_aml_sweep(subscriptions):
    """
    Perform final AML screening on all subscriptions
    before releasing funds to SPV.
    """
    flagged = []
    
    for sub in subscriptions:
        # Screen investor against sanctions lists
        sanctions_result = await screen_sanctions(
            name=sub.investor_name,
            dob=sub.investor_dob,
            nationality=sub.investor_nationality
        )
        
        if sanctions_result.match_found:
            flagged.append({
                'subscription_id': sub.id,
                'reason': f"Sanctions match: {sanctions_result.list_name}",
                'action': 'QUARANTINE_FUNDS'
            })
            continue
        
        # Screen for PEP status
        pep_result = await screen_pep(
            name=sub.investor_name,
            country=sub.investor_country
        )
        
        if pep_result.is_pep:
            # PEPs allowed but require enhanced due diligence
            if not sub.edd_completed:
                flagged.append({
                    'subscription_id': sub.id,
                    'reason': 'PEP without EDD',
                    'action': 'REQUEST_EDD'
                })
        
        # Adverse media check
        adverse_result = await screen_adverse_media(
            name=sub.investor_name
        )
        
        if adverse_result.high_risk:
            flagged.append({
                'subscription_id': sub.id,
                'reason': f"High-risk adverse media: {adverse_result.headline}",
                'action': 'MANUAL_REVIEW'
            })
    
    if flagged:
        # Round closure paused - compliance team must review
        await notify_compliance_team(flagged)
        return False  # Round cannot close yet
    
    return True  # All clear - round can close
```

---

## 8. Failed Round — Automatic Investor Refund

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ROUND CLOSURE: FAILURE SCENARIO (Automatic Refund)                         │
│                                                                              │
│  SMART CONTRACT ESCROW (Polygon)                                             │
│          │                                                                   │
│          │ [CONDITION B — Deadline reached, funding target NOT met]         │
│          │                                                                   │
│          │ Smart contract continuously monitors:                            │
│          │   if (block.timestamp > deadline &&                              │
│          │       total_raised < funding_target) {                           │
│          │       emit RoundFailed();                                        │
│          │   }                                                              │
│          ▼                                                                   │
│  SMART CONTRACT (Automatic Execution)                                        │
│          │                                                                   │
│          │ 1. Contract detects deadline passed with insufficient funds      │
│          │    • No manual action required — automatic by code              │
│          │    • State changed: is_failed = true                            │
│          │                                                                   │
│          │ 2. Refund condition triggered automatically                      │
│          │    • For each subscription in escrow:                           │
│          │      refunds[subscriber] += subscription_amount                 │
│          │                                                                   │
│          │ 3. All minted tokens burned on-chain                             │
│          │    • UjamaaTokenizer.burn(tokens)                               │
│          │    • Event emitted: TokensBurned(holder, amount)                │
│          │    • Tokens cease to exist — no residual value                  │
│          ▼                                                                   │
│          ├─────────────────────────────────────────────┐                    │
│          ▼                                             ▼                    │
│  WEB3 WALLET INVESTORS                     MOBILE MONEY & BANK INVESTORS    │
│          │                                             │                    │
│          │ USDC returned directly                      │ USDC → fiat via    │
│          │ to investor's wallet on-chain               │ Onafriq/Ondo Finance     │
│          │                                             │                    │
│          │ claimRefund() called by investor            │ Flutterwave        │
│          │ or automatically pushed                     │ disburses to       │
│          │                                             │ mobile money       │
│          │ Transaction hash provided                   │ wallet or bank     │
│          │ Polygonscan link included                   │                    │
│          │                                             │ SMS confirmation   │
│          │                                             │ sent               │
│          ▼                                             ▼                    │
│  UJAMAA PLATFORM                                                             │
│          │                                                                   │
│          │ 4. Investor notified via app + SMS + email                       │
│          │     • "Round failed for [Asset Name]. Refund processed."         │
│          │     • Refund amount and transaction details included             │
│          │                                                                   │
│          │ 5. Asset originator notified — round failed                      │
│          │     • Reason provided: "Funding target not met"                  │
│          │     • Option to relist at revised terms (UJAMAA decision)        │
│          │                                                                   │
│          │ 6. Asset may be relisted at revised terms                        │
│          │     • Lower funding target                                       │
│          │     • Extended deadline                                          │
│          │     • Revised token price                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.1 Critical: Refund Claim Mechanism

```solidity
// Smart contract: Refund claim function
function claimRefund() external nonReentrant {
    require(roundFailed, "Round has not failed");
    
    uint256 refundAmount = refunds[msg.sender];
    require(refundAmount > 0, "No refund available");
    
    // Reset refund balance before transfer (reentrancy protection)
    refunds[msg.sender] = 0;
    
    // Transfer refund
    usdcToken.transfer(msg.sender, refundAmount);
    
    emit RefundClaimed(msg.sender, refundAmount);
}

// For mobile money investors (custodial), backend initiates refund
function processCustodialRefund(address investor, uint256 amount) 
    external 
    onlyAdmin 
{
    require(roundFailed, "Round has not failed");
    require(isCustodialInvestor(investor), "Not a custodial investor");
    
    // Burn tokens from custodial wallet
    token.burnFrom(custodialWallet, getCustodialTokenBalance(investor));
    
    // Convert USDC to fiat and disburse via Flutterwave
    uint256 fiatAmount = convertTo Fiat(amount, investor.country);
    flutterwave.disburse(investor.phoneNumber, fiatAmount);
    
    emit CustodialRefundProcessed(investor, amount);
}
```

---

## 9. Yield & Returns Distribution Workflow

**CRITICAL:** Smart contracts automate minting, transfers, and compliance checks — including dividend payouts — executing automatically when predefined conditions are met.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  YIELD DISTRIBUTION FLOW (Automated via Smart Contract)                     │
│                                                                              │
│  REAL-WORLD ASSET                                                            │
│  (Farm revenue / Rental income / Infrastructure fees / Factory output)      │
│          │                                                                   │
│          │ 1. Asset generates revenue in local currency                     │
│          │    • Farm: Crop sales (cocoa, coffee, cashews)                  │
│          │    • Real estate: Monthly rent payments                         │
│          │    • Infrastructure: Toll fees, port charges                    │
│          │    • Factory: Product sales revenue                             │
│          ▼                                                                   │
│  SPV ACCOUNT (Asset-Dedicated Legal Entity)                                  │
│          │                                                                   │
│          │ 2. Revenue received into SPV bank account                        │
│          │    • Local currency (XOF, NGN, KES, etc.)                       │
│          │    • Bank statement imported into UJAMAA accounting system      │
│          │                                                                   │
│          │ 3. Waterfall applied in STRICT ORDER (per SPV Operating Agmt)   │
│          │                                                                   │
│          │    a. Operating expenses paid                                   │
│          │       • Property management fees                                 │
│          │       • Insurance premiums                                       │
│          │       • Maintenance costs                                        │
│          │       • Property taxes / land rates                              │
│          │                                                                   │
│          │    b. Asset maintenance reserve funded                          │
│          │       • Typically 10-20% of revenue                              │
│          │       • Held in reserve for CapEx, repairs, replacements        │
│          │       • Accumulates over time for major expenses                │
│          │                                                                   │
│          │    c. UJAMAA management fee deducted                            │
│          │       • Pre-defined in smart contract (e.g., 1% of AUM/year)    │
│          │       • Transparent: visible on-chain                           │
│          │       • Deducted before investor distributions                  │
│          │                                                                   │
│          │    d. Net yield available for distribution                      │
│          │       • Remaining amount after (a), (b), (c)                    │
│          │       • This is what investors receive                          │
│          ▼                                                                   │
│  UJAMAA SMART CONTRACT (Polygon)                                             │
│          │                                                                   │
│          │ 4. SPV converts net yield fiat → USDC via on-ramp               │
│          │    • Flutterwave FX for smaller amounts                         │
│          │    • Ondo Finance Mint or OTC desk for large amounts                  │
│          │    • Exchange rate locked at time of conversion                 │
│          │                                                                   │
│          │ 5. USDC deposited into UJAMAA distribution contract              │
│          │    • DistributionManager.deposit(asset_id, amount)              │
│          │    • Event emitted: YieldDeposited(asset_id, amount)            │
│          │                                                                   │
│          │ 6. Smart contract calculates each token holder's pro-rata share │
│          │    • Snapshot taken: token balances at block height X           │
│          │    • yield_per_token = net_yield / total_supply                 │
│          │    • individual_payout = yield_per_token × tokens_held          │
│          │                                                                   │
│          │ 7. Distribution event recorded on-chain — publicly auditable     │
│          │    • Event: DistributionDeclared(asset_id, yield_per_token)     │
│          │    • Visible on Polygonscan                                     │
│          │    • Audit trail: who declared, when, how much                  │
│          ▼                                                                   │
│          ├─────────────────────────────────────────────┐                    │
│          ▼                                             ▼                    │
│  WEB3 WALLET INVESTORS                     MOBILE MONEY INVESTORS           │
│          │                                             │                    │
│          │ USDC sent directly to wallet                │ USDC → fiat via    │
│          │ Claimable anytime on-chain                  │ Flutterwave        │
│          │                                             │                    │
│          │ claimDistribution() called                  │ Disbursed directly │
│          │ by investor or auto-push                    │ to mobile money    │
│          │                                             │ wallet             │
│          │ Transaction hash provided                   │                    │
│          │ Polygonscan link included                   │ SMS confirmation   │
│          │                                             │ sent               │
│          ▼                                             ▼                    │
│  INVESTOR DASHBOARD                                                          │
│          │                                                                   │
│          │ 8. Yield received shown in local currency                        │
│          │     • Amount: e.g., "5,000 XOF" or "8.50 USDC"                  │
│          │     • Annualized yield: e.g., "12% APY"                         │
│          │     • Payment date recorded                                     │
│          │                                                                   │
│          │ 9. Full yield history available — every distribution on-chain    │
│          │     • Exportable CSV for tax purposes                           │
│          │     • Transaction hashes linked                                 │
│          │     • Annual tax statement generated                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.1 Critical: Distribution Smart Contract

```solidity
// Smart contract: DistributionManager
contract DistributionManager {
    
    struct Distribution {
        uint256 assetId;
        uint256 yieldPerToken;
        uint256 totalYield;
        uint256 snapshotBlock;
        bool claimed;
        mapping(address => uint256) claims;
    }
    
    mapping(uint256 => Distribution) public distributions;
    uint256 public distributionCount;
    
    /**
     * @notice Declare a distribution for an asset
     * @dev Only callable by authorized distributor (SPV manager)
     */
    function declareDistribution(
        uint256 assetId,
        uint256 totalYield
    ) external onlyRole(DISTRIBUTOR_ROLE) {
        require(totalYield > 0, "Yield must be > 0");
        
        Distribution storage dist = distributions[distributionCount];
        dist.assetId = assetId;
        dist.totalYield = totalYield;
        dist.snapshotBlock = block.number;
        
        // Calculate yield per token
        uint256 totalSupply = token.totalSupply();
        dist.yieldPerToken = (totalYield * 1e18) / totalSupply;
        
        // Record claim for each token holder
        // (In practice, this is done off-chain with Merkle root)
        _recordClaims(assetId, dist.yieldPerToken);
        
        distributionCount++;
        
        emit DistributionDeclared(assetId, dist.yieldPerToken, totalYield);
    }
    
    /**
     * @notice Claim distribution payout
     */
    function claimDistribution(uint256 distributionId) external {
        Distribution storage dist = distributions[distributionId];
        require(dist.claims[msg.sender] > 0, "No claim available");
        
        uint256 amount = dist.claims[msg.sender];
        dist.claims[msg.sender] = 0; // Reset claim
        
        usdcToken.transfer(msg.sender, amount);
        
        emit DistributionClaimed(msg.sender, distributionId, amount);
    }
}
```

---

## 10. UJAMAA Platform Fee Structure (Transparency by Design)

**CRITICAL:** All UJAMAA fees are **encoded in the smart contract at issuance** — visible to every investor before they commit a single franc.

| Fee | When Charged | Mechanism | Typical Rate | Smart Contract Function |
|-----|--------------|-----------|--------------|------------------------|
| **Issuance fee** | At round closure | Deducted from proceeds before release to SPV | 1-3% of total raised | `closeRound()` |
| **Management fee** | On each yield distribution | Deducted from yield waterfall in smart contract | 0.5-2% of AUM/year | `declareDistribution()` |
| **Transaction fee** | On secondary market transfers | Applied via ERC-3643 transfer hook | 0.1-0.5% of transfer value | `_canTransfer()` |
| **Exit fee** (if applicable) | On token redemption at maturity | Deducted from redemption proceeds | 1-2% of redemption value | `redeemTokens()` |
| **Performance fee** (if applicable) | On returns exceeding hurdle rate | Carried interest from excess returns | 10-20% of excess returns | `calculatePerformanceFee()` |

**NO HIDDEN FEES.** No discretionary deductions. Every number is in the contract and visible on Polygonscan.

### 10.1 Fee Transparency Example

```solidity
// Smart contract: Fee configuration (visible on-chain)
struct FeeConfig {
    uint256 issuanceFeeBps;      // 200 = 2.00%
    uint256 managementFeeBps;    // 150 = 1.50% per annum
    uint256 transactionFeeBps;   // 25 = 0.25%
    uint256 exitFeeBps;          // 100 = 1.00%
    uint256 performanceFeeBps;   // 2000 = 20.00% of excess returns
    uint256 hurdleRateBps;       // 800 = 8.00% annual return threshold
}

FeeConfig public fees = FeeConfig({
    issuanceFeeBps: 200,
    managementFeeBps: 150,
    transactionFeeBps: 25,
    exitFeeBps: 100,
    performanceFeeBps: 2000,
    hurdleRateBps: 800
});

// Example: Investor can query fees before investing
// Web3 call: contract.fees()
// Returns: {200, 150, 25, 100, 2000, 800}
// Frontend displays: "Issuance: 2%, Management: 1.5%/yr, Transaction: 0.25%, Exit: 1%, Performance: 20% above 8% hurdle"
```

---

## 11. Complete Flow Summary (ERC-3643 Updated)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  END-TO-END PAYMENT WORKFLOW (ERC-3643 Compliant)                           │
│                                                                              │
│  ASSET ORIGINATOR                                                            │
│          │ Submits asset for tokenization                                   │
│          ▼                                                                   │
│  UJAMAA PLATFORM                                                             │
│  (Due diligence + SPV creation + ERC-3643 token issuance)                   │
│          │                                                                   │
│          │ • Legal title verified                                           │
│          │ • Independent valuation obtained                                 │
│          │ • Originator KYB/AML completed                                   │
│          │ • SPV created (bankruLPcy-remote)                                │
│          │ • Asset transferred to SPV (true sale)                           │
│          │ • UjamaaTokenizer contract deployed on Polygon                   │
│          │ • ComplianceModule configured                                    │
│          │ • IdentityRegistry integrated (ONCHAINID)                        │
│          │                                                                   │
│          │ Lists asset on platform                                          │
│          ▼                                                                   │
│  INVESTOR                                                                    │
│  (Mobile Money / Bank Transfer / Web3 Wallet)                               │
│          │                                                                   │
│          │ Subscribes + pays                                                │
│          │ • KYC completed (ONCHAINID claim issued)                         │
│          │ • Payment made (mobile money, wire, or USDC)                     │
│          │ • Compliance check: IdentityRegistry.isVerified()                │
│          ▼                                                                   │
│  FLUTTERWAVE / BANK / POLYGON                                                │
│  (Payment collection + fiat on-ramp)                                        │
│          │                                                                   │
│          │ Confirms payment                                                 │
│          • Webhook fired to UJAMAA backend                                  │
│          • Fiat converted to USDC (Onafriq/Ondo Finance)                          │
│          • USDC sent to Polygon escrow                                      │
│          ▼                                                                   │
│  SMART CONTRACT ESCROW on POLYGON                                            │
│          │                                                                   │
│          │ Holds USDC until:                                                │
│          │ [A] Target met → Round closes → Mints ERC-3643 tokens           │
│          │ [B] Target missed → Round fails → Auto-refund                   │
│          ▼                                                                   │
│          ├── [Target met] ──→ Releases USDC to SPV → Originator receives   │
│          │   capital (minus fees)                                           │
│          │                                                                  │
│          └── [Target missed] ──→ Auto-refund to all investors              │
│              (USDC → fiat → mobile money/bank)                              │
│              ▼                                                              │
│  SPV                                                                         │
│  (Manages asset operations)                                                  │
│          │                                                                   │
│          │ Generates revenue                                                │
│          • Farm: crop sales                                                 │
│          • Real estate: rent                                                │
│          • Infrastructure: fees                                             │
│          ▼                                                                   │
│  UJAMAA DISTRIBUTION CONTRACT (Polygon)                                      │
│          │                                                                   │
│          │ Calculates + distributes yield                                   │
│          • Waterfall applied (OpEx → Reserve → Fees → Investors)           │
│          • Pro-rata distribution per token held                             │
│          • On-chain record of every distribution                            │
│          ▼                                                                   │
│  INVESTORS RECEIVE RETURNS                                                   │
│  (Mobile money / Wallet / Bank)                                              │
│          │                                                                   │
│          • Web3: USDC to wallet                                             │
│          • Mobile money: Fiat to MoMo wallet                                │
│          • Bank: Wire transfer                                              │
│          • SMS + email confirmation                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Risk Mitigation Matrix (Updated)

| Risk | Who Bears It | Mitigation (Technical + Legal) | SRS Reference |
|------|--------------|-------------------------------|---------------|
| **UJAMAA misusing investor funds** | Investors | Smart contract escrow — UJAMAA cannot access funds unilaterally; funds released only when `total_raised >= funding_target` | Section 3.6 |
| **Originator receiving funds before round completes** | Investors | Hard-coded funding target condition in smart contract; `closeRound()` reverts if target not met | Section 3.6 |
| **Failed round — investor capital trapped** | Investors | Automatic on-chain refund via `claimRefund()`; no manual claim required; code-enforced | Section 3.6 |
| **Originator misusing capital post-release** | Investors / SPV | SPV Operating Agreement legally constrains use of funds; UJAMAA may require proof of use | Legal |
| **Fiat/USDC conversion rate loss** | Investors | Rate locked at time of payment confirmation (15-minute window); Onafriq/Ondo Finance API guarantee | Section 4 |
| **Smart contract exploit** | Platform & Investors | ERC-3643 audited contracts (CertiK, OpenZeppelin); bug bounty ($100K max); UUPS upgradeable with timelock | Section 7.1 |
| **KYC/AML breach** | Regulatory | Inline KYC before any transaction; ONCHAINID claims; Travel Rule compliance via Fireblocks | Section 10.2 |
| **Asset valuation fraud** | Investors | Independent certified auditor required before listing; valuation valid for 12 months only | Section 3 |
| **UJAMAA platform insolvency** | Investors | SPV is legally isolated — UJAMAA insolvency cannot touch investor assets; bankruLPcy-remote | Legal |
| **Regulatory non-compliance per country** | Platform | Per-country legal opinion required before listing; jurisdiction restrictions in `ComplianceModule` | Section 10 |
| **Identity verification failure** | Platform & Investors | ONCHAINID with licensed Claim Issuers; claims expire and must be renewed; `isVerified()` check on every transfer | Section 3.1 |
| **Transfer to unverified wallet** | Platform | ERC-3643 `_canTransfer()` reverts if `!isVerified(to)`; enforced at contract level | Section 3.4 |
| **Mobile money payment failure** | Investors | Flutterwave webhook verification (HMAC-SHA256); idempotency keys prevent double-charging; automatic retry | Section 4 |
| **Oracle manipulation (yield calculation)** | Investors | Multiple data sources for revenue verification; bank statements + third-party attestation; manual override with multisig | Section 3.6 |

---

## 13. Compliance Checklist (Pre-Launch)

Before any asset can accept investments, ALL of the following must be verified:

### 13.1 Smart Contract Compliance

- [ ] `UjamaaTokenizer` contract deployed on Polygon (Amoy for test, Mainnet for production)
- [ ] Contract verified on Polygonscan (source code published)
- [ ] `IdentityRegistry` address configured
- [ ] `ComplianceModule` address configured
- [ ] Fee configuration set and immutable (or governance-protected)
- [ ] Funding target and deadline configured
- [ ] Escrow mechanism tested (target met and target missed scenarios)
- [ ] Distribution mechanism tested (yield calculation and payout)
- [ ] Emergency pause function tested (multisig-controlled)

### 13.2 Legal Compliance

- [ ] PPM signed by all required parties
- [ ] Subscription Agreement template approved by legal
- [ ] Risk Disclosure Statement published
- [ ] SPV Operating Agreement executed
- [ ] Asset title transferred to SPV (registered)
- [ ] Regulatory approval obtained (if required by jurisdiction)
- [ ] Legal opinion obtained (securities law compliance)

### 13.3 Operational Compliance

- [ ] Asset originator KYB completed
- [ ] Beneficial owners identified and screened
- [ ] Sanctions screening passed (OFAC, UN, EU, UK HMT)
- [ ] PEP screening completed
- [ ] Adverse media search cleared
- [ ] Independent valuation obtained (current, <12 months)
- [ ] Title opinion letter obtained ("Marketable")
- [ ] Insurance coverage verified (property, liability)

### 13.4 Technical Integration

- [ ] Flutterwave webhook endpoint live and secured (HMAC verification)
- [ ] Onafriq/Ondo Finance on-ramp integration tested
- [ ] Fireblocks custody configured (for mobile money investors)
- [ ] Gnosis Safe multisig configured (4-of-7 for admin operations)
- [ ] Monitoring and alerting configured (Datadog, PagerDuty)
- [ ] Database backups configured (PostgreSQL, encrypted)
- [ ] API rate limiting configured (prevent abuse)

---

## 14. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Original] | UJAMAA Team | Initial document (ERC-1400) |
| 2.0 | March 15, 2026 | UJAMAA Team | ERC-3643 alignment, contract name updates, SRS compliance |

### Related Documents

- **SRS v1.3:** `docs/01_SPECIFICATIONS/01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md`
- **Smart Contract Spec:** `docs/01_SPECIFICATIONS/05_SMART_CONTRACT_SPECIFICATION.md`
- **Mobile Money Integration:** `docs/03_TECHNICAL_GUIDES/UJAMAA_DeFi_Mobile_Money_Integration.md`
- **Compliance Framework:** `docs/01_SPECIFICATIONS/10_COMPLIANCE_FRAMEWORK.md`

---

**Document Version:** 2.0 (ERC-3643 Aligned)
**Last Updated:** March 15, 2026
**Next Review:** April 15, 2026
**Owner:** UJAMAA DEFI PLATFORM Technical Team

