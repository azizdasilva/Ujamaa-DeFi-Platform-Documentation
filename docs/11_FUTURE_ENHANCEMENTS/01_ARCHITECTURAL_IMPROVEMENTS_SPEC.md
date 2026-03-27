# Architectural Improvements Specification (v1.0)
## UJAMAA DeFi Platform - Post-MVP Institutional Upgrades

**Author:** Aziz Da Silva - Lead Architect
**Date:** March 21, 2026
**Status:** PROPOSED / RESEARCH
**Reference:** SRS v2.0, ERC-3643 (T-REX Protocol)

---

## 1. Executive Summary
This document outlines five strategic architectural improvements designed to enhance the UJAMAA DeFi Platform's capital efficiency, risk mitigation, and institutional appeal. These changes maintain the core mission of African RWA tokenization while introducing advanced TradFi-DeFi hybrid mechanics.

---

## 2. Improvement 1: Automated Default Auction Mechanism

### 2.1 Concept
Automate the liquidation of `Ujamaa Guarantee (UJG)` tokens (collateral NFTs) via an on-chain Dutch Auction if an industrial partner defaults on repayment.

### 2.2 Technical Implementation
- **Contract:** `GuaranteeToken.sol`
- **Logic:** Add a `DutchAuction` module.
    - **Trigger:** `LiquidityPool` calls `startLiquidation(tokenId)` after maturity + grace period.
    - **Price Curve:** Starts at 120% of `merchandiseValue`, drops linearly to a "Floor Price" over 7 days.
    - **Eligibility:** Bidders must be verified in the `IdentityRegistry` (compliance-gated).
- **Backend:** New `AuctionMonitor` service to alert whitelisted "Distressed Asset Buyers."

### 2.3 Documentation Updates
- **SRS v2.0 (Section 4.1.2):** Update "Default Handling" lifecycle to include the "Dutch Auction" stage.
- **Smart Contract Spec (Section 6.2):** Add function definitions for `startAuction()`, `placeBid()`, and `settleAuction()`.
- **API Spec (Section 4):** Add `/api/v2/auctions` endpoints for listing active liquidations.

---

## 3. Improvement 2: IoT-Driven "Dynamic Risk" Oracle

### 3.1 Concept
Link physical asset condition (humidity, temperature, GPS) in GDIZ warehouse (Benin)s directly to the on-chain risk rating of the collateral.

### 3.2 Technical Implementation
- **Contract:** `IndustrialGateway.sol`
- **Logic:** Integrate Chainlink Functions.
    - **Data Ingest:** Periodically fetch warehouse sensor data via API.
    - **On-Chain Trigger:** If sensors exceed safety thresholds (e.g., >60% humidity for cotton), the contract updates the `stockHash` metadata with a "Condition Warning" flag.
- **Economic Impact:** Trigger an automatic increase in the "Interest Buffer" or a partial margin call.

### 3.3 Documentation Updates
- **Architecture Spec (Layer 3: Oracles):** Document the integration of IoT data providers as trusted Oracle sources.
- **Asset Risk Rating Guide:** Update the risk scoring matrix to include "Real-time Environmental Stability" as a 15% weight factor.
- **Technical Guide 08 (Web3 Architecture):** Add a sequence diagram showing IoT Data -> Chainlink -> Smart Contract.

---

## 4. Improvement 3: Atomic OTC Swaps (Secondary Liquidity)

### 3.1 Concept
Enable peer-to-peer (P2P) trading of uLP tokens between whitelisted investors, providing liquidity even when the pool is "fully deployed."

### 4.2 Technical Implementation
- **Contract:** `uLPSwapDesk.sol` (New Contract)
- **Logic:** Escrow-based atomic swap.
    - **Step 1:** Seller creates a "Limit Order" (e.g., Sell 100k uLP for 105k EUROD).
    - **Step 2:** Contract validates both parties via `IdentityRegistry.isVerified()`.
    - **Step 3:** Atomic exchange: uLP transfers to Buyer, EUROD transfers to Seller in one transaction.
- **Compliance:** Transfer is blocked if the Buyer's jurisdiction cap is reached (ERC-3643 `ComplianceModule`).

### 4.3 Documentation Updates
- **SRS v2.0 (Section 6.5):** Create a new "Secondary Market Mechanics" sub-section.
- **Investor FAQ:** Add "How can I exit my position before the pool maturity?" explaining the OTC desk.
- **API Spec:** Add `/api/v2/market/orders` for order book management.

---

## 5. Improvement 4: Senior/Junior Tranching (Waterfall)

### 5.1 Concept
Segment the Liquidity Pool into two risk classes: **Senior (uLP-A)** for low-risk/lower-yield and **Junior (uLP-B)** for high-risk/higher-yield (first-loss capital).

### 5.2 Technical Implementation
- **Contract:** `LiquidityPool.sol` (Major Refactor)
- **Logic:** Waterfall payment structure.
    - **Distribution:** `addYield()` first fills the Senior Tranche's target (e.g., 8%). Any excess yield flows to the Junior Tranche.
    - **Loss Absorption:** If a default occurs, the Junior Tranche's NAV is reduced first. The Senior Tranche is only affected if the Junior Tranche is wiped out.
- **Tokens:** Issue two separate ERC-3643 tokens per pool.

### 5.3 Documentation Updates
- **White Paper (Economics Section):** Redesign the "Yield Model" to explain the Waterfall mechanism and risk/reward for A vs B tokens.
- **Investment Memorandum:** Update "Risk Factors" to describe the "First-Loss" nature of the Junior Tranche.
- **Token Naming Reference:** Add `uLP-A` (Senior) and `uLP-B` (Junior) nomenclature.

---

## 6. Improvement 5: Chainlink Proof of Reserve (PoR)

### 6.1 Concept
Verify the Euro reserves backing the EUROD stablecoin in real-time to prevent "Stablecoin De-pegging" risks.

### 6.2 Technical Implementation
- **Contract:** `uLPToken.sol`
- **Logic:** Circuit Breaker.
    - **Integration:** Call `latestRoundData()` on a Chainlink PoR feed (e.g., EUROD/EUR).
    - **Safety Check:** If `ReserveAmount < TotalSupply * 0.99`, the `deposit()` function is automatically paused to prevent investors from entering a potentially under-collateralized system.
- **Admin:** Multi-sig can manually override in case of Oracle failure.

### 6.3 Documentation Updates
- **Compliance Framework (Section 8: Audit):** Add "Proof of Reserve Verification" as a mandatory real-time audit requirement.
- **Operational Runbooks:** Add a procedure for "Stablecoin De-peg Incident Response."
- **SRS v2.0 (Section 9: Security):** Document the PoR Circuit Breaker as a core system safeguard.

---

## 7. Implementation Roadmap

| Phase | Enhancement | Target Release | Priority |
| :--- | :--- | :--- | :--- |
| **Phase A** | Proof of Reserve & OTC Swaps | MVP v2.1 | P0 (Safety/Liquidity) |
| **Phase B** | Senior/Junior Tranching | MVP v2.2 | P1 (Capital Attraction) |
| **Phase C** | Automated Dutch Auction | Production v1.0 | P1 (Risk Recovery) |
| **Phase D** | IoT Dynamic Risk | Production v1.1 | P2 (Efficiency) |

---

## 8. Summary of Document Updates (Checklist)

| Document Path | Section to Update | Change Type |
| :--- | :--- | :--- |
| `docs/01_SPECIFICATIONS/01_SRS.md` | 4.1.2, 6.5, 9.2 | Structural / Logical |
| `docs/01_SPECIFICATIONS/03_SMART_CONTRACT.md` | Interface definitions | Technical API |
| `docs/01_SPECIFICATIONS/04_API_SPEC.md` | Endpoints for Auction/OTC | Routing / Schema |
| `docs/08_INVESTORS_ROOM/04_WHITE_PAPER.md` | Economic Model | Marketing / Narrative |
| `docs/08_INVESTORS_ROOM/03_INVEST_MEMO.md` | Risk Factors | Legal / Disclosure |
| `docs/02_TECHNICAL_GUIDES/08_WEB3_ARCH.md` | Oracle / Swap Diagrams | Architectural |
