# UAT vs UPT vs UGT - Complete Token Comparison Guide

## Understanding All UJAMAA Token Types

**Document Type:** Investor Education
**Version:** 2.0
**Date:** March 21, 2026
**Author:** Aziz Da Silva - Lead Architect
**Audience:** Investors, Financial Advisors, Family Offices, Originators

---

## **Quick Answer**

| Token | What It Is | Best For |
|-------|------------|----------|
| **UAT** | Single asset investment (like buying one stock) | Sophisticated investors who want specific asset exposure |
| **UPT** | Diversified pool investment (like an ETF) | Most investors who want diversified, lower-risk exposure |
| **UGT** | Collateral token representing certified merchandise | Originators securing financing (NOT an investment token) |

---

## **1. What Are UAT, UPT, and UGT Tokens?**

### **UAT — Ujamaa Asset Token**

**Definition:** A token that represents ownership in a **single, specific asset**.

**Examples:**
- `UAT-LGREIT` → Lagos Commercial REIT (one property)
- `UAT-COCOA` → Ivory Coast Cocoa Bond (one crop financing)
- `UAT-GOLDREV` → Ghana Gold Revenue (one mining operation)

**Think of it like:** Buying shares in one specific company (e.g., Apple stock only)

**Who Holds It:** Investors (you own this as an investment)

---

### **UPT — Ujamaa Pool Token**

**Definition:** A token that represents ownership in a **diversified pool of many assets**.

**Examples:**
- `UPT-IND` → Industrial Pool (50+ factories)
- `UPT-HRV` → Harvest Pool (100+ farms)
- `UPT-TRD` → Trade Finance Pool (200+ invoices)

**Think of it like:** Buying an ETF or index fund (diversified across many companies)

**Who Holds It:** Investors (you own this as an investment)

---

### **UGT — Ujamaa Guarantee Token**

**Definition:** An ERC-721 NFT that represents **certified merchandise/collateral** backing a financing operation.

**Examples:**
- `UGT-001` → 1,000 cotton bales certified at GDIZ Warehouse, Lomé
- `UGT-002` → €500K worth of cocoa beans in Abidjan port
- `UGT-003` → Industrial equipment collateral in Cotonou

**Think of it like:** A digital warehouse receipt or collateral certificate (NOT an investment)

**Who Holds It:** Originators/Industrials (as proof of collateral), then Liquidity Pool (as security)

---

## **2. Key Differences at a Glance**

| Feature | UAT | UPT | UGT |
|---------|-----|-----|-----|
| **Full Name** | Ujamaa Asset Token | Ujamaa Pool Token | Ujamaa Guarantee Token |
| **Token Standard** | ERC-3643 (fungible) | ERC-3643 (fungible) | ERC-721 + ERC-3643 (NFT) |
| **Symbol** | `UAT-XXX` | `UPT-XXX` | `UGT-XXX` |
| **What You Own** | Share in ONE asset | Share in MANY assets | Certified collateral (merchandise) |
| **Diversification** | ❌ None (single asset) | ✅ Yes (multiple assets) | ❌ N/A (collateral, not investment) |
| **Risk Level** | Higher (concentrated) | Lower (diversified) | N/A (not an investment token) |
| **Expected Return** | 8-15% (varies by asset) | 8-12% APR (averaged) | N/A (collateral security) |
| **Minimum Investment** | Varies by asset | €1,000 (standard) | N/A (not for investment) |
| **Who Can Hold** | Verified investors | Verified investors | Originators, Pools (not investors) |
| **Transferable** | ✅ Yes (with compliance) | ✅ Yes (with compliance) | ⚠️ Limited (Pool ↔ Originator only) |
| **Purpose** | Investment | Investment | Collateral/Security |

---

## **3. Visual Comparison**

```
┌─────────────────────────────────────────────────────────────────┐
│                    UAT vs UPT vs UGT STRUCTURE                   │
│                                                                  │
│  UAT (Ujamaa Asset Token)                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  UAT-LGREIT (Ujamaa Asset Token - Lagos REIT)              │ │
│  │         ↓ backed by                                        │ │
│  │  [LAGOS COMMERCIAL PROPERTY #001] ← SINGLE ASSET           │ │
│  │         ↓                                                  │ │
│  │  INVESTOR holds UAT → Earns returns from THIS asset        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  UPT (Ujamaa Pool Token)                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  UPT-IND (Ujamaa Pool Token - Industrial)                  │ │
│  │         ↓ backed by                                        │ │
│  │  [Factory A] + [Factory B] + [Factory C] + ... [50+]       │ │
│  │  ← DIVERSIFIED POOL                                        │ │
│  │         ↓                                                  │ │
│  │  INVESTOR holds UPT → Earns returns from 50+ factories     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  UGT (Ujamaa Guarantee Token)                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  UGT-001 (Ujamaa Guarantee Token #001)                     │ │
│  │         ↓ represents                                       │ │
│  │  [1,000 COTTON BALES @ GDIZ WAREHOUSE, LOMÉ] ← COLLATERAL  │ │
│  │         ↓                                                  │ │
│  │  ORIGINATOR mints UGT → Pool holds UGT as security         │ │
│  │  (NOT an investment - it's collateral for financing)       │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## **4. Token Lifecycle Comparison**

### **UAT Lifecycle (Investment Token)**

```
1. Asset Originator tokenizes single asset
2. Investor completes KYC/KYB
3. Investor buys UAT tokens
4. Asset generates income → distributions to UAT holders
5. Investor sells UAT on secondary market OR holds to maturity
```

**Who Profits:** Investor (from asset returns)

---

### **UPT Lifecycle (Investment Token)**

```
1. Pool manager creates diversified pool
2. Investor completes KYC/KYB
3. Investor buys UPT tokens
4. Pool assets generate income → quarterly distributions to UPT holders
5. Investor redeems UPT (after lock-up) OR sells on secondary market
```

**Who Profits:** Investor (from pooled returns)

---

### **UGT Lifecycle (Collateral Token)**

```
1. Industrial has merchandise (e.g., 1,000 cotton bales)
2. Industrial Gateway certifies the merchandise
3. UGT (NFT) minted representing the certified collateral
4. Industrial receives financing from Pool
5. Pool holds UGT as security/collateral
6. Industrial repays financing + interest
7. UGT returned to Industrial
   OR (if default) UGT liquidated to recover funds
```

**Who Profits:** Industrial (gets financing), Pool (has security)
**NOT an investment for external investors**

---

## **5. Risk Comparison**

### **UAT Risk Profile**

| Risk | Level | Why |
|------|-------|-----|
| **Default Risk** | 🔴 High | If the single asset defaults, you could lose everything |
| **Concentration Risk** | 🔴 High | 100% of your investment in one asset |
| **Liquidity Risk** | 🟡 Medium | Depends on market for that specific asset |
| **Valuation Risk** | 🟡 Medium | Asset must be appraised individually |

**Example:** If you buy `UAT-LGREIT` and the Lagos property has problems, your investment is directly affected.

---

### **UPT Risk Profile**

| Risk | Level | Why |
|------|-------|-----|
| **Default Risk** | 🟢 Low | Pool can absorb 1-2 defaults without major impact |
| **Concentration Risk** | 🟢 Low | Spread across many assets |
| **Liquidity Risk** | 🟢 Low | Pool tokens more liquid |
| **Valuation Risk** | 🟢 Low | Pool NAV averages out individual variations |

**Example:** If you buy `UPT-IND` and one factory has problems, the other 50+ factories continue performing.

---

### **UGT Risk Profile (For Originators)**

| Risk | Level | Why |
|------|-------|-----|
| **Collateral Loss** | 🔴 High | If you default, you lose the merchandise (UGT liquidated) |
| **Compliance Risk** | 🟡 Medium | Must maintain certification standards |
| **Valuation Risk** | 🟡 Medium | Collateral must be independently appraised |
| **Redemption Risk** | 🟢 Low | UGT returned when financing repaid |

**Example:** If you mint `UGT-001` for your cotton bales and default on financing, the Pool liquidates your cotton to recover funds.

---

## **6. Return Comparison**

### **UAT Returns (For Investors)**

| Aspect | Description |
|--------|-------------|
| **Expected Return** | 8-15% (varies significantly by asset) |
| **Return Type** | Asset-specific cash flow |
| **Distribution** | When the specific asset generates income |
| **Volatility** | Higher (depends on single asset performance) |

**Example:** `UAT-COCOA` might return 12% if the cocoa harvest is good, or 0% if there's a drought.

---

### **UPT Returns (For Investors)**

| Aspect | Description |
|--------|-------------|
| **Expected Return** | 8-12% APR (stable, averaged) |
| **Return Type** | Pool-level cash flow |
| **Distribution** | Quarterly (from pooled income) |
| **Volatility** | Lower (diversification smooths returns) |

**Example:** `UPT-HRV` returns ~10% consistently because good harvests offset bad ones across 100+ farms.

---

### **UGT "Returns" (For Originators)**

| Aspect | Description |
|--------|-------------|
| **Expected Return** | N/A (not an investment token) |
| **Benefit** | Access to financing using merchandise as collateral |
| **Cost** | Interest on financing (paid to Pool) |
| **Risk** | Lose collateral (merchandise) if default |

**Example:** You mint `UGT-001` for €500K of cotton, receive €400K financing at 10% APR. You repay €440K, get UGT back. No "return" - you got working capital.

---

## **7. Investment Minimums**

| Token | Minimum | Typical Amount |
|-------|---------|----------------|
| **UAT** | Varies by asset (€10K-€100K+) | €50,000+ |
| **UPT** | €1,000 (standard) | €10,000-€100,000 |
| **UGT** | N/A (not for investment) | N/A |

**Why the difference?**
- UAT: Single asset requires larger minimum to make deployment worthwhile
- UPT: Pool structure allows smaller minimums through diversification
- UGT: Not an investment - collateral value matches financing amount

---

## **8. Due Diligence Requirements**

### **UAT Due Diligence (For Investors)**

You (or your advisor) should review:
- ✅ Specific asset financials
- ✅ Asset-specific risks
- ✅ Originator track record with THIS asset type
- ✅ Independent valuation report
- ✅ Legal structure for THIS asset

**Time Required:** 10-20 hours per asset

---

### **UPT Due Diligence (For Investors)**

You (or your advisor) should review:
- ✅ Pool strategy and criteria
- ✅ Pool manager track record
- ✅ Diversification metrics
- ✅ Historical pool performance
- ✅ Risk management framework

**Time Required:** 5-10 hours per pool

---

### **UGT Due Diligence (For Pools)**

Pool managers review:
- ✅ Merchandise authenticity (via Industrial Gateway)
- ✅ Independent appraisal/certification
- ✅ Storage location verification (GDIZ/SIPI warehouse)
- ✅ Insurance coverage
- ✅ Market value of collateral vs. financing amount

**Time Required:** 3-5 hours per UGT (automated via smart contract)

---

## **9. Which Should YOU Choose?**

### **Choose UAT If:**

- ✅ You're a sophisticated/accredited investor
- ✅ You have deep knowledge of a specific asset class
- ✅ You've done thorough due diligence on THIS specific asset
- ✅ You accept higher concentration risk
- ✅ You want potentially higher returns (12-15%)
- ✅ You're comfortable with asset-specific volatility

**Typical UAT Investors:**
- Family offices with sector expertise
- High-net-worth individuals with local knowledge
- Institutional investors with specific mandates

---

### **Choose UPT If:**

- ✅ You want diversified exposure
- ✅ You prefer lower risk through diversification
- ✅ You want stable, predictable returns (8-12% APR)
- ✅ You're a retail or institutional investor
- ✅ You want easier due diligence (pool-level vs. asset-level)
- ✅ You want lower minimum investment (€1,000)

**Typical UPT Investors:**
- Institutional investors (pension funds, insurance companies)
- Family offices (diversified allocation)
- Accredited individuals
- Retail investors (via UPT-HRV with €100 minimum)

---

### **Mint UGT If:**

- ✅ You're an Industrial/Originator with merchandise
- ✅ You need working capital financing
- ✅ You can provide certified collateral
- ✅ You understand you'll lose collateral if you default
- ✅ You want to access Ujamaa liquidity pools

**Typical UGT Users:**
- African SMEs with inventory/merchandise
- Exporters with goods in warehouse
- Manufacturers with raw materials
- NOT for investors

---

## **10. Can I Own Both?**

**Yes!** Many investors use a **barbell approach**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SAMPLE INVESTOR PORTFOLIO                     │
│                                                                  │
│  70% UPT (Core Holdings)                                        │
│  ├── 30% UPT-IND (Industrial Pool)                              │
│  ├── 25% UPT-HRV (Harvest Pool)                                 │
│  └── 15% UPT-TRD (Trade Finance Pool)                           │
│                                                                  │
│  30% UAT (Satellite Holdings)                                   │
│  ├── 15% UAT-LGREIT (Specific Lagos property they know)         │
│  └── 15% UAT-COCOA (Specific cocoa financing they understand)   │
│                                                                  │
│  Result: Diversified core + targeted high-convexity bets        │
└─────────────────────────────────────────────────────────────────┘
```

**Note:** Investors do NOT hold UGT. UGT is held by:
1. **Originator** (initially, as collateral owner)
2. **Liquidity Pool** (as security during financing)
3. **Back to Originator** (when financing repaid)

---

## **11. Real-World Example**

### **Scenario 1: Investor with €100,000**

#### **Option A: 100% UAT (Single Asset)**
```
Investment: €100,000 in UAT-LGREIT (Lagos Property)

Year 1 Outcomes:
├─ Best Case: Property performs well → 14% return = €14,000
├─ Base Case: Normal performance → 10% return = €10,000
└─ Worst Case: Property vacancy → 0% return = €0

Risk: All eggs in one basket
```

#### **Option B: 100% UPT (Diversified Pool)**
```
Investment: €100,000 in UPT-IND (50+ Factories)

Year 1 Outcomes:
├─ Best Case: Pool performs well → 12% return = €12,000
├─ Base Case: Normal performance → 10% return = €10,000
└─ Worst Case: 1-2 factories struggle → 8% return = €8,000

Risk: Diversified across 50+ assets
```

#### **Option C: 70/30 Split (Balanced)**
```
Investment: €70,000 UPT-IND + €30,000 UAT-LGREIT

Year 1 Outcomes:
├─ Best Case: 12.8% return = €12,800
├─ Base Case: 10% return = €10,000
└─ Worst Case: 5.6% return = €5,600

Risk: Balanced approach
```

---

### **Scenario 2: Originator Needs €400,000 Financing**

```
Industrial: "Cotonou Cotton Co." has 1,000 cotton bales (€500K value)

Step 1: Industrial Gateway certifies cotton → mints UGT-001
Step 2: Pool lends €400,000 to Industrial
Step 3: Pool holds UGT-001 as collateral
Step 4: Industrial uses €400K for operations
Step 5: Industrial repays €440K (€400K + 10% interest)
Step 6: Pool returns UGT-001 to Industrial

Result:
- Industrial got €400K working capital
- Pool earned €40K interest (secured by collateral)
- UGT was NEVER an investment - just collateral
```

---

## **12. Frequently Asked Questions**

### **Q: Can I convert UAT to UPT (or vice versa)?**

**A:** No direct conversion. You would need to:
1. Sell UAT on secondary market (when available)
2. Use proceeds to buy UPT

Or:
1. Redeem UPT (subject to lock-up)
2. Use proceeds to buy UAT

---

### **Q: Can investors buy UGT tokens?**

**A:** **NO.** UGT is NOT an investment token. It's collateral that:
- Is minted by Originators/Industrials
- Is held by Liquidity Pools as security
- Is returned to Originator when financing repaid

Investors buy UAT or UPT for returns, NOT UGT.

---

### **Q: Which is more liquid?**

**A:** UPT tokens are generally more liquid because:
- Larger investor base (lower minimums)
- More standardized (pool vs. unique asset)
- Easier to value (NAV vs. asset appraisal)

UGT is NOT liquid - it's collateral, not tradable.

---

### **Q: Are UAT tokens riskier?**

**A:** Yes, in terms of concentration risk. However:
- UAT allows targeted investment in assets you know well
- UAT can offer higher returns for accepting this risk
- UAT is appropriate for sophisticated investors with sector expertise

---

### **Q: Can I hold UAT and UPT in the same wallet?**

**A:** Yes! Both UAT and UPT are ERC-3643 tokens and can be held in the same compatible wallet.

**Can I hold UGT in my wallet?** Only if you're an Originator with certified merchandise. Investors don't hold UGT.

---

### **Q: Do all tokens have the same compliance requirements?**

**A:** 
- **UAT & UPT:** Yes, both require KYC verification, KYB for investments ≥€100,000, jurisdiction restrictions
- **UGT:** Different - requires Industrial Gateway certification, merchandise verification, warehouse confirmation

---

### **Q: What happens to UGT if the Originator defaults?**

**A:** The Pool liquidates the collateral (merchandise represented by UGT) to recover the financing. This is why UGT is security - it protects the Pool and, indirectly, UPT holders.

---

## **13. Summary Decision Matrix**

| Your Profile | Recommended | Why |
|--------------|-------------|-----|
| **Retail Investor (<€100K)** | UPT | Lower minimums, diversification |
| **Accredited Investor (€100K-€1M)** | UPT or 70/30 Split | Flexibility based on expertise |
| **Institutional Investor (€1M+)** | UPT (core) + UAT (satellite) | Diversification + targeted bets |
| **Sector Expert** | UAT in your expertise area | Leverage your knowledge |
| **First-Time Investor** | UPT | Easier due diligence, lower risk |
| **Experienced RWA Investor** | Mix based on strategy | Flexibility |
| **Originator with Merchandise** | Mint UGT | Access financing using collateral |
| **Industrial SME** | Mint UGT | Working capital against inventory |

---

## **14. Token Relationship Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                    UJAMAA TOKEN ECOSYSTEM                        │
│                                                                  │
│  INVESTORS                                                       │
│  ├── Buy UAT → Direct investment in single asset                │
│  └── Buy UPT → Diversified investment in pool                   │
│                                                                  │
│  ORIGINATORS/INDUSTRIALS                                         │
│  └── Mint UGT → Collateral for financing (NOT investment)       │
│                                                                  │
│  LIQUIDITY POOLS                                                 │
│  ├── Hold assets from UAT investments                           │
│  ├── Hold diversified assets for UPT                            │
│  └── Hold UGT as collateral security                            │
│                                                                  │
│  FLOW:                                                           │
│  Investor → UAT/UPT → Pool → Financing → Originator             │
│  Originator → UGT (collateral) → Pool → Security                │
└─────────────────────────────────────────────────────────────────┘
```

---

## **15. Next Steps**

### **If You Choose UPT:**
1. Review pool factsheets (UPT-IND, UPT-HRV, UPT-TRD, etc.)
2. Understand pool strategy and diversification
3. Complete KYC/KYB
4. Subscribe via investor portal

### **If You Choose UAT:**
1. Review asset-specific offering documents
2. Conduct asset-level due diligence
3. Review independent valuation
4. Complete KYC/KYB
5. Subscribe via investor portal

### **If You Need to Mint UGT:**
1. Have certified merchandise/inventory
2. Apply via Industrial Gateway (GDIZ/SIPI verification)
3. Receive UGT NFT representing collateral
4. Use UGT to secure financing from Pool
5. Repay financing → Get UGT back

---

## **16. Related Documents**

| Document | Location | Purpose |
|----------|----------|---------|
| **Token Naming Reference** | `docs/01_SPECIFICATIONS/12_UJAMAA_TOKEN_NAMING_REFERENCE.md` | Complete token nomenclature |
| **Smart Contract Naming** | `docs/02_TECHNICAL_GUIDES/10_SMART_CONTRACT_NAMING_CONVENTION.md` | Technical contract reference |
| **How Tokenization Works** | `14_EDUCATIONAL/01_HOW_TOKENIZATION_WORKS.md` | Tokenization basics |
| **Understanding ERC-3643** | `14_EDUCATIONAL/02_UNDERSTANDING_ERC3643.md` | Compliance token standard |
| **Investor FAQ** | `14_EDUCATIONAL/04_INVESTOR_FAQ.md` | General investor questions |
| **Guarantee Token Specs** | `contracts/MVP/GuaranteeToken.sol` | UGT smart contract |

---

## **17. Contact**

**For questions about UAT/UPT (Investments):**
- **Email:** investors@ujamaa.defi
- **Investor Portal:** www.ujamaa.defi/investors
- **Phone:** +230 XXX XXXX

**For questions about UGT (Originator Financing):**
- **Email:** originators@ujamaa.defi
- **Industrial Gateway:** www.ujamaa.defi/originators
- **Phone:** +230 XXX XXX

**Schedule a Call:**
- [Link to Calendly/Meeting Scheduler]

---

**© 2026 UJAMAA DeFi Platform. All Rights Reserved.**

**Last Updated:** March 21, 2026
**Document ID:** UJAMAA-INV-TOKENS-001
**Classification:** Public (Investor Education)

---

*This document is for educational purposes only and does not constitute investment advice. Please consult with your financial advisor before making investment decisions. UGT tokens are NOT investment products and are not available for purchase by investors.*
