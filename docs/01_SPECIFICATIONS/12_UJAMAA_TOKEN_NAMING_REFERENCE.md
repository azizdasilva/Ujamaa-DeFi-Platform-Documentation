# UJAMAA Token Naming Reference

## Official Token Nomenclature Standard

**Author:** Aziz Da Silva - Lead Architect
**Document Type:** Reference Standard
**Version:** 1.0
**Date:** March 18, 2026
**Classification:** Public (Investor, Developer, User)
**Naming Scheme:** Hybrid (Professional + Ujamaa Brand Identity)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Naming Philosophy](#2-naming-philosophy)
3. [Fungible Tokens (ERC-3643)](#3-fungible-tokens-erc-3643)
4. [Non-Fungible Tokens (ERC-3643NFT)](#4-non-fungible-tokens-erc-3643nft)
5. [Token Symbol Reference](#5-token-symbol-reference)
6. [Smart Contract Reference](#6-smart-contract-reference)
7. [For Investors](#7-for-investors)
8. [For Developers](#8-for-developers)
9. [For End Users](#9-for-end-users)
10. [Migration Guide](#10-migration-guide)
11. [Appendix: Swahili Terminology](#11-appendix-swahili-terminology)

---

## 1. Executive Summary

### 1.1 Purpose

This document establishes the **official naming convention** for all tokens in the UJAMAA DeFi Platform ecosystem. The hybrid naming scheme balances:

- ✅ **Professional Clarity** - Institutional investors understand token purpose immediately
- ✅ **Brand Consistency** - All tokens carry the "Ujamaa" identity
- ✅ **Technical Precision** - Developers can implement without ambiguity
- ✅ **User Accessibility** - End users can navigate the ecosystem easily

### 1.2 Naming Scheme Overview

| Token Category | Naming Pattern | Symbol Pattern | Example |
|----------------|----------------|----------------|---------|
| **Liquidity Pool** | Ujamaa Pool Token - [Type] | `uLP-XXX` | `uLP-IND` (Industrial) |
| **Asset Token** | Ujamaa Asset Token - [Name] | `UAT-XXX` | `UAT-LGREIT` (Lagos REIT) |
| **Stablecoin** | Ujamaa [Currency] | `UJXXX` | `EUROD` (Euro) |
| **Guarantee NFT** | Ujamaa Guarantee - [Commodity] | `UJG-XXX-###` | `UJG-COTTON-001` |
| **Property NFT** | Ujamaa Deed - [Location] | `UJDEED-XXX-###` | `UJDEED-LGS-001` |
| **Invoice NFT** | Ujamaa Invoice - [ID] | `UJINV-###` | `UJINV-00042` |

### 1.3 Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│                    UJAMAA TOKEN QUICK REFERENCE                  │
├─────────────────────────────────────────────────────────────────┤
│  FUNGIBLE TOKENS (ERC-3643)                                     │
│  ─────────────────────────────────                              │
│  🟢 uLP-IND    = Ujamaa Pool Token - Industrial                 │
│  🟢 uLP-HRV    = Ujamaa Pool Token - Harvest (Agriculture)      │
│  🟢 uLP-TRD    = Ujamaa Pool Token - Trade Finance              │
│  🟢 uLP-GRN    = Ujamaa Pool Token - Green (Renewable Energy)   │
│  🟢 uLP-PRP    = Ujamaa Pool Token - Property (Real Estate)     │
│  🟢 UAT-XXX    = Ujamaa Asset Token - [Specific Asset]          │
│  🟢 EUROD      = Ondo EUROD (Euro-backed stablecoin)           │
│  🟢 UJUSD      = Ujamaa Dollar (USD-backed stablecoin)          │
│                                                                 │
│  NON-FUNGIBLE TOKENS (ERC-3643NFT)                              │
│  ───────────────────────────────────                            │
│  🔵 UJG-XXX-###  = Ujamaa Guarantee - [Commodity] - [ID]        │
│  🔵 UJDEED-XXX-### = Ujamaa Deed - [Location] - [ID]            │
│  🔵 UJINV-###    = Ujamaa Invoice - [ID]                        │
│  🔵 UJART-###    = Ujamaa Art Certificate - [ID]                │
│  🔵 UJWH-###     = Ujamaa Warehouse Receipt - [ID]              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Naming Philosophy

### 2.1 Why "Ujamaa"?

**Ujamaa** (Swahili: اُوجَامَا) means **"familyhood," "community,"** or **"cooperative economics."**

| Aspect | Meaning | Platform Application |
|--------|---------|---------------------|
| **Community** | Collective prosperity | Pool-based investing, shared yields |
| **Cooperation** | Working together | Industrial Gateway + Investor partnership |
| **Economics** | Shared wealth creation | Yield-bearing tokens, fair returns |
| **Familyhood** | Trust and mutual support | Compliance-first, investor protection |

### 2.2 Hybrid Naming Principles

#### Principle 1: Brand First
**Every token name begins with "Ujamaa"** to reinforce brand identity.

✅ **Correct:** `Ujamaa Pool Token - Industrial`  
❌ **Incorrect:** `Industrial Pool Token`

#### Principle 2: Type Clarity
**The token type is immediately obvious** from the name.

✅ **Correct:** `Ujamaa Deed - Lagos` (clearly a property deed)  
❌ **Incorrect:** `Ujamaa Lagos Token` (ambiguous type)

#### Principle 3: Symbol Consistency
**Symbols follow a predictable pattern** for easy recognition.

| Category | Prefix | Suffix | Example |
|----------|--------|--------|---------|
| Pool Tokens | `uLP-` | 3-letter type code | `uLP-IND` |
| Asset Tokens | `UAT-` | Asset abbreviation | `UAT-LGREIT` |
| Stablecoins | `UJ` | Currency code | `EUROD` |
| Guarantee NFTs | `UJG-` | Commodity + ID | `UJG-COTTON-001` |
| Deed NFTs | `UJDEED-` | Location + ID | `UJDEED-LGS-001` |

#### Principle 4: Scalability
**The naming system scales** to hundreds of tokens without confusion.

✅ **Scalable:** `UJG-COTTON-001`, `UJG-COTTON-002`, ... `UJG-COTTON-999`  
❌ **Not Scalable:** `Cotton Guarantee 1`, `Cotton Guarantee 2` (no structure)

---

## 3. Fungible Tokens (ERC-3643)

### 3.1 Ujamaa Pool Tokens (uLP Series)

**Purpose:** Yield-bearing tokens representing ownership share in diversified liquidity pools.

**Token Standard:** ERC-3643 Fungible  
**Value Model:** Value-accrual (balance constant, NAV increases)  
**Compliance:** Identity verification required for all transfers

| Pool Family | Full Name | Symbol | Target Yield | Risk Profile | Min Investment |
|-------------|-----------|--------|--------------|--------------|----------------|
| **Industrial** | Ujamaa Pool Token - Industrial | `uLP-IND` | 10-12% APY | Medium | €1,000 |
| **Harvest** | Ujamaa Pool Token - Harvest | `uLP-HRV` | 8-10% APY | Low-Medium | €100 |
| **Trade** | Ujamaa Pool Token - Trade | `uLP-TRD` | 6-8% APY | Low | €5,000 |
| **Green** | Ujamaa Pool Token - Green | `uLP-GRN` | 7-9% APY | Low-Medium | €1,000 |
| **Property** | Ujamaa Pool Token - Property | `uLP-PRP` | 9-11% APY | Medium | €1,000 |

#### Token Mechanics

```
┌─────────────────────────────────────────────────────────────────┐
│              UJAMAA POOL TOKEN VALUE FLOW                        │
│                                                                  │
│  Investor Deposits EUROD/EUROD                                    │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────┐                                            │
│  │  Mint uLP       │ ← Investor receives uLP tokens              │
│  │  (1:1 at NAV)   │    (e.g., €10,000 → 10,000 uLP @ NAV 1.00) │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │  Pool Deploys   │ ← Funds deployed to industrials             │
│  │  to Industrials │    (cotton, soy, coffee, etc.)              │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │  Industrials    │ ← Interest payments flow back               │
│  │  Repay + Interest│   to pool                                  │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │  NAV Increases  │ ← uLP value appreciates                     │
│  │  (1.00 → 1.10)  │    (balance unchanged, value grows)         │
│  └─────────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘
```

#### Use Cases

| Use Case | Token | Description |
|----------|-------|-------------|
| **Diversified Investment** | `uLP-IND`, `uLP-HRV`, etc. | Exposure to pool of assets (not single asset) |
| **Yield Generation** | All uLP tokens | Automatic yield accrual (no manual claiming) |
| **Institutional Investment** | `uLP-IND`, `uLP-TRD` | €100K+ investments with KYB |
| **Retail Investment** | `uLP-HRV` | €100+ investments with standard KYC |

---

### 3.2 Ujamaa Asset Tokens (UAT Series)

**Purpose:** Tokenized ownership in specific, individual assets (single property, single invoice, etc.).

**Token Standard:** ERC-3643 Fungible  
**Value Model:** Asset-backed (value tied to specific asset performance)  
**Compliance:** Identity verification + asset-specific restrictions

| Asset Type | Full Name Pattern | Symbol Pattern | Tokenizer Contract | Example |
|------------|-------------------|----------------|------------------|---------|
| **Real Estate** | Ujamaa Asset Token - [Location] REIT | `UAT-[LOC]REIT` | `RealEstateTokenizer.sol` | `UAT-LGREIT` (Lagos REIT) |
| **Agriculture** | Ujamaa Asset Token - [Crop] Bond | `UAT-[CROP]BOND` | `AgricultureTokenizer.sol` | `UAT-COCOA` (Cocoa Bond) |
| **Mining** | Ujamaa Asset Token - [Mineral] Revenue | `UAT-[MIN]REV` | `MiningTokenizer.sol` | `UAT-GOLDREV` (Gold Revenue) |
| **Energy** | Ujamaa Asset Token - [Type] Yield | `UAT-[TYPE]YLD` | `EnergyTokenizer.sol` | `UAT-SOLYLD` (Solar Yield) |
| **Infrastructure** | Ujamaa Asset Token - [Project] Fund | `UAT-[PRJ]FUND` | `InfrastructureTokenizer.sol` | `UAT-TOLLFUND` (Toll Road Fund) |
| **Trade Finance** 🆕 | Ujamaa Asset Token - [Invoice] | `UAT-TRD-[INV]` | `TradeFinanceTokenizer.sol` | `UAT-TRD-GDIZ-001` |
| **Receivables Pool** 🆕 | Ujamaa Asset Token - [Receivables] | `UAT-REC-[POOL]` | `ReceivablesTokenizer.sol` | `UAT-REC-COCOA-042` |

#### Token Mechanics

```
┌─────────────────────────────────────────────────────────────────┐
│              UJAMAA ASSET TOKEN STRUCTURE                        │
│                                                                  │
│  Single Asset (e.g., Lagos Commercial Property)                  │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────┐                                            │
│  │  Asset SPV      │ ← Special Purpose Vehicle holds asset       │
│  │  (Legal Owner)  │    (bankruLPcy remote)                      │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │  UAT Tokens     │ ← Tokens represent shares in SPV            │
│  │  (e.g., 10M)    │    (each token = fractional ownership)      │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │  Cash Flow      │ ← Rental income → distributed to            │
│  │  (Rent/Revenue) │    UAT token holders (pro-rata)             │
│  └─────────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.3 Ujamaa Stablecoins (UJ Series)

**Purpose:** Euro and USD-pegged stablecoins for FX risk mitigation.

**Token Standard:** ERC-20 (external) or ERC-3643 (platform-issued)  
**Value Model:** 1:1 peg with fiat currency  
**Compliance:** Standard ERC-20 transfers (platform gates via wrapper)

| Stablecoin | Full Name | Symbol | Peg | Issuer | Use Case |
|------------|-----------|--------|-----|--------|----------|
| **Euro** | Ondo EUROD | `EUROD` | 1 EUROD = €1.00 | Ondo Finance (EUROD) / Platform | Primary pool currency |
| **Dollar** | Ujamaa Dollar | `UJUSD` | 1 UJUSD = $1.00 | Ondo Finance (USDC) / Tether (USDT) | Alternative currency |
| **Test Euro** | Ujamaa Test Euro | `tUJEUR` | 1 tUJEUR = €1.00 (testnet) | MockFiatRamp (testnet only) | MVP testing |

#### FX Risk Mitigation

```
┌─────────────────────────────────────────────────────────────────┐
│              UJAMAA STABLECOIN FX STRATEGY                       │
│                                                                  │
│  EUR/FCFA Fixed Parity (1 EUR = 655.957 XOF)                     │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────┐                                            │
│  │  EUROD          │ ← Zero FX risk vs. FCFA                     │
│  │  (1:1 with EUR) │    (BCEAO guarantee since 1994)             │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │  2% FX Fee      │ ← Platform absorbs FX fluctuations          │
│  │  (Buffer)       │    (no pass-through to investors)           │
│  └─────────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Non-Fungible Tokens (ERC-3643NFT)

### 4.1 Ujamaa Guarantee Tokens (UJG Series)

**Purpose:** Represent certified merchandise/collateral backing financing operations.

**Token Standard:** ERC-3643NFT (ERC-721 + ERC-3643 compliance)  
**Transferability:** Non-transferable (forced transfer only for repayment/default)  
**Compliance:** Identity verification required

| Commodity | Full Name | Token ID Pattern | Example |
|-----------|-----------|------------------|---------|
| **Cotton** | Ujamaa Guarantee - Cotton | `UJG-COTTON-###` | `UJG-COTTON-001` |
| **Soy Beans** | Ujamaa Guarantee - Soy | `UJG-SOY-###` | `UJG-SOY-042` |
| **Coffee** | Ujamaa Guarantee - Coffee | `UJG-COFFEE-###` | `UJG-COFFEE-118` |
| **Cashews** | Ujamaa Guarantee - Cashew | `UJG-CASHEW-###` | `UJG-CASHEW-007` |
| **Electronics** | Ujamaa Guarantee - Goods | `UJG-GOODS-###` | `UJG-GOODS-023` |

#### Token Metadata

```json
{
  "tokenId": "UJG-COTTON-001",
  "name": "Ujamaa Guarantee - Cotton #001",
  "description": "Certified cotton bales collateral for industrial financing",
  "attributes": {
    "commodity": "Cotton",
    "grade": "Grade A",
    "quantity": "1000 bales",
    "weight": "200 metric tons",
    "warehouse": "GDIZ Warehouse A, Lomé",
    "certificationDate": "2026-03-01",
    "expiryDate": "2026-06-01",
    "merchandiseValue": "2000000 EUROD",
    "industrial": "GDIZ Cotton Partners SARL",
    "certificateHash": "0xabc123...",
    "stockHash": "QmX7Kz9...",
    "complianceStatus": "verified"
  }
}
```

#### Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│              UJAMAA GUARANTEE TOKEN LIFECYCLE                    │
│                                                                  │
│  1. Industrial receives order (e.g., ZARA €2M cotton contract)   │
│         │                                                        │
│         ▼                                                        │
│  2. Industrial Gateway certifies stock (SIPI/GDIZ verification)  │
│         │                                                        │
│         ▼                                                        │
│  3. UJG-COTTON-001 minted (ERC-3643NFT)                          │
│         │                                                        │
│         ▼                                                        │
│  4. Pool deploys funds to Industrial                             │
│         │                                                        │
│         ▼                                                        │
│  5. Pool holds UJG-COTTON-001 (collateral/security)              │
│         │                                                        │
│         ▼                                                        │
│  6. Industrial repays (principal + interest)                     │
│         │                                                        │
│         ▼                                                        │
│  7. UJG-COTTON-001 transferred back to Industrial                │
│         │                                                        │
│         ▼                                                        │
│  [DEFAULT SCENARIO]                                              │
│  8. UJG-COTTON-001 liquidated via approved auction               │
│         │                                                        │
│         ▼                                                        │
│  9. Proceeds distributed to uLP token holders                    │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4.2 Ujamaa Deed Tokens (UJDEED Series)

**Purpose:** Tokenized ownership of real estate properties (unique NFTs).

**Token Standard:** ERC-3643NFT  
**Transferability:** Transferable (with compliance)  
**Compliance:** Identity verification + jurisdiction restrictions

| Property Type | Full Name | Token ID Pattern | Example |
|---------------|-----------|------------------|---------|
| **Commercial** | Ujamaa Deed - [Location] Commercial | `UJDEED-[LOC]COM-###` | `UJDEED-LGSCOM-001` (Lagos Commercial) |
| **Residential** | Ujamaa Deed - [Location] Residential | `UJDEED-[LOC]RES-###` | `UJDEED-NSBRES-042` (Nairobi Suburban) |
| **Industrial** | Ujamaa Deed - [Location] Industrial | `UJDEED-[LOC]IND-###` | `UJDEED-TEMIND-007` (Tema Industrial) |
| **Retail** | Ujamaa Deed - [Location] Retail | `UJDEED-[LOC]RET-###` | `UJDEED-ACCRA-RET-001` |

#### Token Metadata

```json
{
  "tokenId": "UJDEED-LGSCOM-001",
  "name": "Ujamaa Deed - Lagos Commercial #001",
  "description": "Prime commercial property in Lagos CBD",
  "attributes": {
    "propertyType": "Commercial Office Building",
    "location": "Victoria Island, Lagos, Nigeria",
    "totalArea": "5000 sqm",
    "floors": 8,
    "occupancyRate": "92%",
    "appraisedValue": "5000000 EUROD",
    "appraisalDate": "2026-01-15",
    "titleDeedHash": "0xdef456...",
    "landRegistryNumber": "NG-LA-VI-001234",
    "annualRentalIncome": "450000 EUROD",
    "yieldBps": 900,
    "originator": "Lagos Property Developers Ltd",
    "complianceStatus": "verified"
  }
}
```

---

### 4.3 Ujamaa Invoice Tokens (UJINV Series)

**Purpose:** Tokenized single invoices for trade finance.

**Token Standard:** ERC-3643NFT  
**Transferability:** Transferable (with compliance)  
**Compliance:** Identity verification + debtor verification

| Invoice Type | Full Name | Token ID Pattern | Example |
|--------------|-----------|------------------|---------|
| **Export Invoice** | Ujamaa Invoice - Export | `UJINV-EXP-###` | `UJINV-EXP-00042` |
| **Import Invoice** | Ujamaa Invoice - Import | `UJINV-IMP-###` | `UJINV-IMP-00118` |
| **Domestic Invoice** | Ujamaa Invoice - Domestic | `UJINV-DOM-###` | `UJINV-DOM-00007` |

#### Token Metadata

```json
{
  "tokenId": "UJINV-EXP-00042",
  "name": "Ujamaa Invoice - Export #00042",
  "description": "Export invoice for cocoa shipment to Belgium",
  "attributes": {
    "invoiceType": "Export",
    "invoiceNumber": "COCOA-2026-00042",
    "creditor": "Ivory Coast Cocoa Cooperative",
    "debtor": "Belgian Chocolate Importers SA",
    "invoiceAmount": "500000 EUROD",
    "financingAmount": "400000 EUROD",
    "issueDate": "2026-02-15",
    "dueDate": "2026-05-15",
    "paymentTerms": "90 days",
    "goodsDescription": "500 metric tons cocoa beans, Grade A",
    "billOfLadingHash": "0xghi789...",
    "insurancePolicyHash": "0xjkl012...",
    "complianceStatus": "verified"
  }
}
```

---

### 4.4 Ujamaa Art Certificate Tokens (UJART Series)

**Purpose:** Tokenized ownership of unique artwork.

**Token Standard:** ERC-3643NFT  
**Transferability:** Transferable (with compliance)  
**Compliance:** Identity verification + provenance verification

| Art Type | Full Name | Token ID Pattern | Example |
|----------|-----------|------------------|---------|
| **Painting** | Ujamaa Art Certificate - Painting | `UJART-PNT-###` | `UJART-PNT-001` |
| **Sculpture** | Ujamaa Art Certificate - Sculpture | `UJART-SCL-###` | `UJART-SCL-042` |
| **Photography** | Ujamaa Art Certificate - Photo | `UJART-PHT-###` | `UJART-PHT-007` |
| **Digital Art** | Ujamaa Art Certificate - Digital | `UJART-DIG-###` | `UJART-DIG-00023` |

---

### 4.5 Ujamaa Warehouse Receipt Tokens (UJWH Series)

**Purpose:** Tokenized commodity lots stored in certified warehouses.

**Token Standard:** ERC-3643NFT  
**Transferability:** Transferable (with compliance)  
**Compliance:** Identity verification + warehouse attestation

| Commodity | Full Name | Token ID Pattern | Example |
|-----------|-----------|------------------|---------|
| **Grain** | Ujamaa Warehouse Receipt - Grain | `UJWH-GRAIN-###` | `UJWH-GRAIN-001` |
| **Metal** | Ujamaa Warehouse Receipt - Metal | `UJWH-METAL-###` | `UJWH-METAL-042` |
| **Energy** | Ujamaa Warehouse Receipt - Energy | `UJWH-ENERGY-###` | `UJWH-ENERGY-007` |

---

## 5. Token Symbol Reference

### 5.1 Complete Symbol Table

| Category | Symbol | Full Name | Type | Standard |
|----------|--------|-----------|------|----------|
| **Pool Tokens** | `uLP-IND` | Ujamaa Pool Token - Industrial | Fungible | ERC-3643 |
| | `uLP-HRV` | Ujamaa Pool Token - Harvest | Fungible | ERC-3643 |
| | `uLP-TRD` | Ujamaa Pool Token - Trade | Fungible | ERC-3643 |
| | `uLP-GRN` | Ujamaa Pool Token - Green | Fungible | ERC-3643 |
| | `uLP-PRP` | Ujamaa Pool Token - Property | Fungible | ERC-3643 |
| **Asset Tokens** | `UAT-XXX` | Ujamaa Asset Token - [Name] | Fungible | ERC-3643 |
| **Stablecoins** | `EUROD` | Ondo EUROD | Fungible | ERC-20/ERC-3643 |
| | `UJUSD` | Ujamaa Dollar | Fungible | ERC-20/ERC-3643 |
| | `tUJEUR` | Ujamaa Test Euro | Fungible | ERC-20 Mock |
| **Guarantee NFTs** | `UJG-COTTON-###` | Ujamaa Guarantee - Cotton | NFT | ERC-3643NFT |
| | `UJG-SOY-###` | Ujamaa Guarantee - Soy | NFT | ERC-3643NFT |
| | `UJG-COFFEE-###` | Ujamaa Guarantee - Coffee | NFT | ERC-3643NFT |
| | `UJG-CASHEW-###` | Ujamaa Guarantee - Cashew | NFT | ERC-3643NFT |
| | `UJG-GOODS-###` | Ujamaa Guarantee - Goods | NFT | ERC-3643NFT |
| **Deed NFTs** | `UJDEED-[LOC]COM-###` | Ujamaa Deed - Commercial | NFT | ERC-3643NFT |
| | `UJDEED-[LOC]RES-###` | Ujamaa Deed - Residential | NFT | ERC-3643NFT |
| | `UJDEED-[LOC]IND-###` | Ujamaa Deed - Industrial | NFT | ERC-3643NFT |
| **Invoice NFTs** | `UJINV-EXP-###` | Ujamaa Invoice - Export | NFT | ERC-3643NFT |
| | `UJINV-IMP-###` | Ujamaa Invoice - Import | NFT | ERC-3643NFT |
| | `UJINV-DOM-###` | Ujamaa Invoice - Domestic | NFT | ERC-3643NFT |
| **Art NFTs** | `UJART-PNT-###` | Ujamaa Art - Painting | NFT | ERC-3643NFT |
| | `UJART-SCL-###` | Ujamaa Art - Sculpture | NFT | ERC-3643NFT |
| | `UJART-PHT-###` | Ujamaa Art - Photo | NFT | ERC-3643NFT |
| | `UJART-DIG-###` | Ujamaa Art - Digital | NFT | ERC-3643NFT |
| **Warehouse NFTs** | `UJWH-GRAIN-###` | Ujamaa Warehouse - Grain | NFT | ERC-3643NFT |
| | `UJWH-METAL-###` | Ujamaa Warehouse - Metal | NFT | ERC-3643NFT |
| | `UJWH-ENERGY-###` | Ujamaa Warehouse - Energy | NFT | ERC-3643NFT |

---

## 6. Smart Contract Reference

### 6.1 Contract Inventory

| Contract File | Token Type | Tokens Issued |
|---------------|------------|---------------|
| `ULPToken.sol` | Fungible | `uLP-IND`, `uLP-HRV`, `uLP-TRD`, `uLP-GRN`, `uLP-PRP` |
| `UjamaaAssetToken.sol` | Fungible | `UAT-XXX` (asset-specific) |
| `GuaranteeToken.sol` | NFT | `UJG-XXX-###` |
| `UjamaaNFT.sol` | NFT | `UJDEED-XXX`, `UJINV-XXX`, `UJART-XXX`, `UJWH-XXX` |
| `MockFiatRamp.sol` | Fungible (Mock) | `tUJEUR` (testnet only) |

### 6.2 Contract Addresses (Production)

| Token | Ethereum Mainnet | Polygon Mainnet | Testnet (Amoy) |
|-------|------------------|-----------------|----------------|
| `uLP-IND` | TBD | TBD | `0x...` (post-deployment) |
| `uLP-HRV` | TBD | TBD | `0x...` (post-deployment) |
| `uLP-TRD` | TBD | TBD | `0x...` (post-deployment) |
| `uLP-GRN` | TBD | TBD | `0x...` (post-deployment) |
| `uLP-PRP` | TBD | TBD | `0x...` (post-deployment) |
| `EUROD` | `0x...` (Ondo EUROD) | `0x...` (Ondo EUROD) | `0x...` (Mock) |
| `UJUSD` | `0x...` (Ondo Finance USDC) | `0x...` (Ondo Finance USDC) | `0x...` (Mock) |

---

## 7. For Investors

### 7.1 How to Identify Tokens

| You Want To... | Look For Token... | Example |
|----------------|-------------------|---------|
| **Invest in diversified pool** | `uLP-XXX` | `uLP-IND` for industrial exposure |
| **Invest in specific asset** | `UAT-XXX` | `UAT-LGREIT` for Lagos property |
| **Hold euro stablecoin** | `EUROD` | Stable value, no yield |
| **Verify collateral** | `UJG-XXX-###` | Check Guarantee Token metadata |
| **Own real estate** | `UJDEED-XXX-###` | Direct property ownership NFT |

### 7.2 Token Risk Profiles

| Token | Risk Level | Expected Return | Lock-up Period |
|-------|------------|-----------------|----------------|
| `uLP-HRV` | Low-Medium | 8-10% APY | 180 days |
| `uLP-TRD` | Low | 6-8% APY | 90 days |
| `uLP-IND` | Medium | 10-12% APY | 365 days |
| `uLP-GRN` | Low-Medium | 7-9% APY | 270 days |
| `uLP-PRP` | Medium | 9-11% APY | 365 days |
| `UAT-XXX` | Varies by asset | Varies | Varies |
| `EUROD` | None (stablecoin) | 0% (no yield) | None |

### 7.3 Compliance Requirements

| Investment Amount | KYC Level | Token Access |
|-------------------|-----------|--------------|
| < €100,000 | Standard KYC | `uLP-HRV`, `uLP-GRN` (retail pools) |
| ≥ €100,000 | Enhanced KYB | All `uLP` tokens, `UAT` tokens |
| ≥ €1,000,000 | Institutional KYB | All tokens + direct pool access |

---

## 8. For Developers

### 8.1 Integration Guide

#### Step 1: Import Token ABIs

```typescript
// Import token ABIs
import uLP_ABI from '@/abis/ULPToken.json';
import UAT_ABI from '@/abis/UjamaaAssetToken.json';
import UJG_ABI from '@/abis/GuaranteeToken.json';
import UJDEED_ABI from '@/abis/UjamaaNFT.json';

// Token addresses (update after deployment)
const TOKEN_ADDRESSES = {
  'uLP-IND': '0x...',
  'uLP-HRV': '0x...',
  'UAT-LGREIT': '0x...',
  'EUROD': '0x...',
} as const;
```

#### Step 2: Token Type Detection

```typescript
// Detect token type from symbol
function getTokenType(symbol: string): TokenType {
  if (symbol.startsWith('uLP-')) return 'POOL';
  if (symbol.startsWith('UAT-')) return 'ASSET';
  if (symbol.startsWith('UJG-')) return 'GUARANTEE_NFT';
  if (symbol.startsWith('UJDEED-')) return 'DEED_NFT';
  if (symbol.startsWith('UJINV-')) return 'INVOICE_NFT';
  if (symbol === 'EUROD' || symbol === 'UJUSD') return 'STABLECOIN';
  throw new Error(`Unknown token type: ${symbol}`);
}
```

#### Step 3: Compliance Check

```typescript
// Check if user can hold token
async function canHoldToken(
  userAddress: string,
  tokenSymbol: string
): Promise<boolean> {
  const tokenContract = new Contract(
    TOKEN_ADDRESSES[tokenSymbol],
    TOKEN_ABI,
    provider
  );

  // ERC-3643 compliance check
  const identityRegistry = await tokenContract.identityRegistry();
  const isVerified = await identityRegistry.isVerified(userAddress);

  return isVerified;
}
```

### 8.2 Event Listening

```typescript
// Listen for uLP token transfers
const uLPContract = new Contract(
  TOKEN_ADDRESSES['uLP-IND'],
  uLP_ABI,
  provider
);

uLPContract.on('Transfer', (from, to, amount, event) => {
  console.log(`uLP-IND transferred: ${from} → ${to}, Amount: ${amount}`);
});

// Listen for UJG NFT minting
const ujgContract = new Contract(
  TOKEN_ADDRESSES['UJG-COTTON-001'],
  UJG_ABI,
  provider
);

ujgContract.on('AssetMinted', (tokenId, owner, metadata, event) => {
  console.log(`UJG NFT minted: Token ID ${tokenId}, Owner: ${owner}`);
});
```

### 8.3 Error Handling

```typescript
// ERC-3643 compliance errors
const ERC3643_ERRORS = {
  'Sender not verified': 'KYC_REQUIRED',
  'Recipient not verified': 'RECIPIENT_KYC_REQUIRED',
  'Compliance check failed': 'COMPLIANCE_FAILED',
  'Invalid recipient': 'JURISDICTION_BLOCKED',
  'Insufficient balance': 'INSUFFICIENT_BALANCE',
  'Transfer amount exceeds allowance': 'ALLOWANCE_EXCEEDED',
};

function handleTransferError(error: any): string {
  const message = error.reason || error.message;
  return ERC3643_ERRORS[message] || 'UNKNOWN_ERROR';
}
```

---

## 9. For End Users

### 9.1 Token Guide (Simple)

#### What is uLP?
**Ujamaa Pool Token (uLP)** = Your share in a diversified investment pool.

- ✅ **Easy:** Buy once, earn yield automatically
- ✅ **Safe:** Diversified across many industrials
- ✅ **Transparent:** See exactly where your money goes

#### What is UAT?
**Ujamaa Asset Token (UAT)** = Your share in a specific asset (one property, one invoice).

- ✅ **Direct:** You own part of a real asset
- ✅ **Income:** Earn from rent, invoice repayment, etc.
- ✅ **Verified:** Asset professionally appraised

#### What is EUROD?
**Ondo EUROD (EUROD)** = Digital euro, always worth €1.00.

- ✅ **Stable:** No price fluctuations
- ✅ **Fast:** Send anywhere, anytime
- ✅ **Secure:** Backed by real euro reserves

### 9.2 How to Get Tokens

```
Step 1: Create Account
   ↓
Step 2: Complete KYC (identity verification)
   ↓
Step 3: Deposit EUR → Receive EUROD
   ↓
Step 4: Choose Pool (uLP) or Asset (UAT)
   ↓
Step 5: Confirm Investment → Receive Tokens
   ↓
Step 6: Watch Your Value Grow! 📈
```

### 9.3 Common Questions

**Q: Can I lose my tokens?**  
A: No. Tokens are in your wallet. Only you control them (with compliance restrictions).

**Q: How do I sell tokens?**  
A: Redeem via the platform (subject to lock-up period) or transfer to another verified investor.

**Q: What if I need money urgently?**  
A: Emergency redemption available (fees may apply, see terms).

**Q: Are tokens insured?**  
A: Platform maintains insurance fund. Individual tokens not separately insured.

---

## 10. Migration Guide

### 10.1 Old → New Name Mapping

**⚠️ IMPORTANT: Tokenizer vs Token Distinction**
- **Tokenizer** = Smart contract factory that mints tokens (e.g., `RWATokenizer.sol`)
- **Token** = Digital asset produced by Tokenizer (what investors hold)

| Old Tokenizer Contract | New Tokenizer Contract | Token Produced | Token Symbol | Action Required |
|----------|----------|----------|------------|-----------------|
| `RWATokenizer.sol` | `UjamaaAssetTokenizer.sol` | Ujamaa Asset Token | `UAT-XXX` | Auto-migrate |
| `IndustryTokenizer.sol` | `UjamaaIndustryTokenizer.sol` | Ujamaa Industry Token | `UAT-IND-XXX` | Rename contract |
| `AgricultureTokenizer.sol` | `UjamaaAgricultureTokenizer.sol` | Ujamaa Agriculture Token | `UAT-AGR-XXX` | Rename contract |
| `TradeFinanceTokenizer.sol` 🆕 | `UjamaaTradeFinanceTokenizer.sol` | Ujamaa Trade Finance Token | `UAT-TRD-XXX` | New contract |
| `ReceivablesTokenizer.sol` 🆕 | `UjamaaReceivablesTokenizer.sol` | Ujamaa Receivables Token | `UAT-REC-XXX` | New contract |

| Old Token Name | New Token Name | Old Symbol | New Symbol | Action Required |
|----------|----------|------------|------------|-----------------|
| uLP-INDUSTRIE | Ujamaa Pool Token - Industrial | `uLP-IND` | `uLP-IND` | Auto-migrate |
| uLP-AGRICULTURE | Ujamaa Pool Token - Harvest | `uLP-AGRI` | `uLP-HRV` | Auto-migrate |
| uLP-TRADE_FINANCE | Ujamaa Pool Token - Trade | `uLP-TRD` | `uLP-TRD` | Auto-migrate |
| uLP-RENEWABLE_ENERGY | Ujamaa Pool Token - Green | `uLP-GRN` | `uLP-GRN` | Auto-migrate |
| uLP-REAL_ESTATE | Ujamaa Pool Token - Property | `uLP-PRP` | `uLP-PRP` | Auto-migrate |
| RWA Token | Ujamaa Asset Token | `RWA-XXX` | `UAT-XXX` | Auto-migrate |
| EUROD | Ondo EUROD | `EUROD` | `EUROD` | Use wrapper |
| GuaranteeToken | Ujamaa Guarantee | `GUARANTEE-XXX` | `UJG-XXX` | Auto-migrate |
| UjamaaNFT (RE) | Ujamaa Deed | `NFT-RE-XXX` | `UJDEED-XXX` | Auto-migrate |
| UjamaaNFT (Invoice) | Ujamaa Invoice | `NFT-INV-XXX` | `UJINV-XXX` | Auto-migrate |

### 10.2 Migration Timeline

| Phase | Date | Action |
|-------|------|--------|
| **Announcement** | March 18, 2026 | This document published |
| **Developer Update** | March 25, 2026 | SDKs, ABIs updated |
| **Frontend Update** | April 1, 2026 | UI shows new names |
| **Auto-Migration** | April 8, 2026 | All tokens renamed on-chain |
| **Legacy Sunset** | April 30, 2026 | Old names deprecated |

---

## 11. Appendix: Swahili Terminology

### 11.1 Token Name Origins

| Swahili Word | Meaning | Token Application |
|--------------|---------|-------------------|
| **Ujamaa** | Familyhood, community | Platform name |
| **Mali** | Wealth, assets | `uLP` = pool of mali |
| **Fa** | Profit, return | Yield from tokens |
| **Sarafu** | Coin, currency | `EUROD` = digital sarafu |
| **Dhamana** | Guarantee, collateral | `UJG` = dhamana token |
| **Hati** | Deed, certificate | `UJDEED` = hati ya mali |
| **Bima** | Insurance | Platform protection |
| **Amana** | Trust, deposit | Investor funds |

### 11.2 Pronunciation Guide

| Word | Pronunciation | Syllables |
|------|---------------|-----------|
| Ujamaa | oo-JAH-mah | 3 |
| Mali | MAH-lee | 2 |
| Sarafu | sah-RAH-foo | 3 |
| Dhamana | dhah-MAH-nah | 3 |
| Hati | HA-tee | 2 |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 18, 2026 | Aziz Da Silva | Initial release (Hybrid naming scheme) |

---

## Related Documents

- **SRS v2.0:** `docs/01_SPECIFICATIONS/01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md`
- **Smart Contract Spec:** `docs/01_SPECIFICATIONS/05_SMART_CONTRACT_SPECIFICATION.md`
- **MVP Spec:** `docs/06_MVP_EXECUTION/01_MVP_SPECIFICATION.md`
- **Compliance Framework:** `docs/01_SPECIFICATIONS/10_COMPLIANCE_FRAMEWORK.md`

---

*UJAMAA DEFI PLATFORM - Token Naming Reference v1.0*  
*"Ujamaa" - Familyhood, Community, Cooperative Economics*
