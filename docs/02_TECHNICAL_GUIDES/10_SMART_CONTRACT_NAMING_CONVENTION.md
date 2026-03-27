# UJAMAA Smart Contract Naming Convention Reference

**Document Type:** Technical Reference  
**Version:** 1.0  
**Date:** March 18, 2026  
**Author:** Aziz Da Silva - Lead Architect  
**Purpose:** Define and document smart contract naming patterns for future reference

---

## **1. Overview**

UJAMAA smart contracts follow **consistent naming patterns** based on their function and the type of token they create. This document serves as the authoritative reference for all smart contract naming conventions.

---

## **2. Naming Patterns by Category**

### **2.1 Asset Tokenizer Contracts**

**Pattern:** `[Asset]Tokenizer.sol`  
**Purpose:** Mint asset-specific fungible tokens (UAT series)  
**Standard:** ERC-3643

| Contract | Token Produced | Symbol | Status |
|----------|----------------|--------|--------|
| `UjamaaAssetTokenizer.sol` | Ujamaa Asset Token | `UAT-XXX` | ✅ Active |
| `IndustryTokenizer.sol` | Ujamaa Industry Token | `UAT-IND-XXX` | ✅ Active |
| `AgricultureTokenizer.sol` | Ujamaa Agriculture Token | `UAT-AGR-XXX` | ✅ Active |
| `MiningTokenizer.sol` | Ujamaa Mining Token | `UAT-MIN-XXX` | ✅ Active |
| `EnergyTokenizer.sol` | Ujamaa Energy Token | `UAT-ENER-XXX` | ✅ Active |
| `RealEstateTokenizer.sol` | Ujamaa Real Estate Token | `UAT-RE-XXX` | ✅ Active |
| `InfrastructureTokenizer.sol` | Ujamaa Infrastructure Token | `UAT-INFRA-XXX` | ✅ Active |
| `TradeFinanceTokenizer.sol` | Ujamaa Trade Finance Token | `UAT-TRD-XXX` | 🆕 Planned |
| `ReceivablesTokenizer.sol` | Ujamaa Receivables Token | `UAT-REC-XXX` | 🆕 Planned |

**Key Characteristic:** All contracts with **"Tokenizer"** in the name mint **UAT series tokens** (asset-specific, fungible).

---

### **2.2 Pool Token Contracts**

**Pattern:** `[Name]Token.sol`  
**Purpose:** Mint pool-based fungible tokens (uLP series)  
**Standard:** ERC-3643

| Contract | Token Produced | Symbol | Status |
|----------|----------------|--------|--------|
| `ULPToken.sol` | Ujamaa Pool Token | `uLP-XXX` | ✅ Active |

**Pool Families Supported:**
- `uLP-IND` - Industrial
- `uLP-HRV` - Harvest (Agriculture)
- `uLP-TRD` - Trade Finance
- `uLP-GRN` - Green (Renewable Energy)
- `uLP-PRP` - Property (Real Estate)

**Key Characteristic:** Pool token contracts use **"Token"** suffix (not "Tokenizer").

---

### **2.3 NFT Contracts**

**Pattern:** `[Name]NFT.sol` or `[Name]Token.sol`  
**Purpose:** Mint non-fungible tokens  
**Standard:** ERC-3643NFT (ERC-721 + ERC-3643 compliance)

| Contract | NFT Type | Token ID Pattern | Status |
|----------|----------|------------------|--------|
| `UjamaaNFT.sol` | Deeds, Invoices, Art | `UJDEED-XXX-###`, `UJINV-###`, `UJART-###` | ✅ Active |
| `GuaranteeToken.sol` | Collateral NFTs | `UJG-XXX-###` | ✅ Active |

**Key Characteristic:** NFT contracts contain either **"NFT"** or **"Token"** in name.

---

### **2.4 Gateway Contracts (Oracle Integration)**

**Pattern:** `[Function]Gateway.sol` or `[Source]Adapter.sol`  
**Purpose:** Connect smart contracts to off-chain data (Chainlink, banks, industrial systems)  
**Standard:** Custom with Chainlink integration

| Contract | Data Source | Purpose | Status |
|----------|-------------|---------|--------|
| `ReserveGateway.sol` | Bank APIs (BIIC (Banque Internationale pour l'Industrie et le Commerce)/MCB) | Proof of reserves | ✅ Active |
| `PriceGateway.sol` | Chainlink, GDIZ/SIPI | Price feeds (EUROD, USDC, NAV) | ✅ Active |
| `YieldGateway.sol` | Calculated | uLP yield calculation & publication | ✅ Active |
| `NAVGateway.sol` | Calculated | Net Asset Value per token | ✅ Active |
| `ChainlinkAdapter.sol` | Chainlink Network | Chainlink Price Feeds integration | ✅ Active |
| `BankGateway.sol` | Bank APIs (BIIC (Banque Internationale pour l'Industrie et le Commerce)/MCB) | Banking data (escrow balances) | 🆕 Production |
| `IndustrialGateway.sol` | GDIZ/SIPI Systems | Production data certification | ✅ Active |

**Key Characteristic:** Gateway contracts use **"Gateway"** or **"Adapter"** suffix (not "Tokenizer" or "Token").

**Why "Gateway" and not "Oracle"?**
- **Gateway** = Bi-directional data flow (contract ↔ off-chain)
- **Oracle** = One-directional (off-chain → contract)
- UJAMAA uses **Gateway** terminology for clarity

---

### **2.5 Supporting Infrastructure Contracts**

**Pattern:** `[Function].sol`  
**Purpose:** Platform infrastructure (no direct token minting)

| Contract | Function | Status |
|----------|----------|--------|
| `LiquidityPool.sol` | Pool management | ✅ Active |
| `PoolFactory.sol` | Pool creation | ✅ Active |
| `IdentityRegistry.sol` | Identity verification | ✅ Active |
| `ComplianceModule.sol` | Compliance enforcement | ✅ Active |
| `EscrowManager.sol` | Escrow management | ✅ Active |
| `RepaymentDistributor.sol` | Repayment distribution | ✅ Active |

**Key Characteristic:** Supporting contracts **do not** contain "Token" or "Tokenizer" in name.

---

## **3. Complete Smart Contract Inventory**

### **3.1 By Naming Pattern**

| Pattern | Count | Contracts |
|---------|-------|-----------|
| `[Asset]Tokenizer.sol` | 9 | Asset-specific token factories |
| `[Name]Token.sol` | 2 | Pool tokens, NFTs |
| `[Name]NFT.sol` | 1 | Multi-purpose NFTs |
| `[Function].sol` | 6+ | Supporting infrastructure |

### **3.2 By Token Type Created**

| Token Series | Contract(s) | Type |
|--------------|-------------|------|
| **uLP** (Pool Tokens) | `ULPToken.sol` | Fungible |
| **UAT** (Asset Tokens) | `[Asset]Tokenizer.sol` | Fungible |
| **UJDEED** (Deeds) | `UjamaaNFT.sol` | NFT |
| **UJINV** (Invoices) | `UjamaaNFT.sol` | NFT |
| **UJART** (Art) | `UjamaaNFT.sol` | NFT |
| **UJG** (Guarantees) | `GuaranteeToken.sol` | NFT |

---

## **4. Naming Convention Rules**

### **Rule 1: Tokenizer = Asset-Specific Factory**
- ✅ **Correct:** `IndustryTokenizer.sol` (mints `UAT-IND-XXX`)
- ❌ **Incorrect:** `IndustryToken.sol` (confusing with pool tokens)

### **Rule 2: Token = Pool or NFT Contract**
- ✅ **Correct:** `ULPToken.sol` (mints `uLP-XXX` pool tokens)
- ✅ **Correct:** `GuaranteeToken.sol` (mints `UJG-XXX-###` NFTs)
- ❌ **Incorrect:** `ULPTokenizer.sol` (not an asset-specific factory)

### **Rule 3: NFT = Non-Fungible Token**
- ✅ **Correct:** `UjamaaNFT.sol` (clearly indicates NFT)
- ❌ **Incorrect:** `UjamaaToken.sol` (ambiguous - could be fungible)

### **Rule 4: No Suffix = Infrastructure**
- ✅ **Correct:** `LiquidityPool.sol` (pool management, no minting)
- ❌ **Incorrect:** `LiquidityPoolToken.sol` (misleading - doesn't mint tokens)

---

## **5. Decision Tree for Naming New Contracts**

```
Is the contract minting tokens?
│
├─ NO → Use [Function].sol pattern
│        Example: LiquidityPool.sol, ComplianceModule.sol
│
└─ YES → What type of token?
         │
         ├─ Pool Token (uLP) → Use [Name]Token.sol
         │                     Example: ULPToken.sol
         │
         ├─ Asset-Specific (UAT) → Use [Asset]Tokenizer.sol
         │                         Example: IndustryTokenizer.sol
         │
         └─ NFT → Use [Name]NFT.sol or [Name]Token.sol
                  Example: UjamaaNFT.sol, GuaranteeToken.sol
```

---

## **6. Trade Finance Clarification**

**Question:** Why is there no `TradeFinanceTokenizer.sol`?

**Answer:** Trade Finance uses **two existing contract types**:

| Trade Finance Type | Contract Used | Why No New Tokenizer? |
|--------------------|---------------|----------------------|
| **Pool Financing** | `ULPToken.sol` (Pool Family: `POOL_TRADE_FINANCE`) | Pool tokens already supported |
| **Single Invoice** | `UjamaaNFT.sol` (assetType: "INVOICE") | Invoice NFTs already supported |

**Conclusion:** No dedicated `TradeFinanceTokenizer.sol` needed because:
1. Pool financing → `ULPToken.sol` with `uLP-TRD` tokens
2. Single invoice → `UjamaaNFT.sol` with `UJINV-###` NFTs

---

## **7. References**

- **Token Naming Reference:** `docs/01_SPECIFICATIONS/12_UJAMAA_TOKEN_NAMING_REFERENCE.md`
- **Smart Contract Specification:** `docs/01_SPECIFICATIONS/05_SMART_CONTRACT_SPECIFICATION.md`
- **Nomenclature Guide:** `docs/02_TECHNICAL_GUIDES/09_NOMENCLATURE_NAMES.md`

---

**Last Updated:** March 18, 2026  
**Maintained By:** System Architect  
**Status:** ✅ Approved for Implementation
