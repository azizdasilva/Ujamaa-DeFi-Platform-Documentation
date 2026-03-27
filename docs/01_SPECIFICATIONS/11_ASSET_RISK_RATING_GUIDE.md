# Asset Risk Rating System

## Comprehensive Guide with 2026 Benchmarks

**Author:** Aziz Da Silva - Lead Architect
**Version:** 1.0
**Date:** March 9, 2026
**Classification:** Internal / Investor Education

---

# Table of Contents

1. [Overview](#1-overview)
2. [Risk Rating Scale](#2-risk-rating-scale)
3. [Risk Assessment Methodology](#3-risk-assessment-methodology)
4. [2026 Benchmark Data](#4-2026-benchmark-data)
5. [Risk Factors by Asset Class](#5-risk-factors-by-asset-class)
6. [How to Use Risk Ratings](#6-how-to-use-risk-ratings)
7. [Limitations](#7-limitations)

---

# 1. Overview

## What is Risk Rating?

**Risk Rating** is a letter-grade assessment (AAA to D) that evaluates the likelihood of an asset defaulting on its expected returns. It helps investors make informed decisions by providing a standardized measure of investment risk.

## Purpose

- **Investor Protection:** Clear risk disclosure before investment
- **Portfolio Management:** Match investments to risk tolerance
- **Regulatory Compliance:** Meet disclosure requirements (SEC, MiCA, African regulators)
- **Pricing:** Risk rating influences expected yield/interest rate

## Who Uses It?

| User | How They Use It |
|------|-----------------|
| **Retail Investors** | Filter assets by risk tolerance |
| **Institutional Investors** | Compliance with investment mandates |
| **Compliance Officers** | Monitor concentration limits |
| **Asset Originators** | Understand pricing of their assets |
| **Regulators** | Verify appropriate risk disclosure |

---

# 2. Risk Rating Scale

## Rating Categories

The UJAMAA platform uses a **7-tier risk rating system** aligned with international credit rating standards:

| Rating | Category | Default Probability (1yr) | Investment Grade | Color Code |
|--------|----------|---------------------------|------------------|------------|
| **AAA** | Highest Quality | 0.00% - 0.05% | ✅ Investment | 🟢 Green |
| **A** | High Quality | 0.05% - 0.50% | ✅ Investment | 🟢 Green |
| **BBB** | Good Quality | 0.50% - 2.00% | ✅ Investment | 🔵 Blue |
| **BB** | Speculative | 2.00% - 5.00% | ⚠️ Non-Investment | 🟡 Yellow |
| **B** | Highly Speculative | 5.00% - 10.00% | ⚠️ Non-Investment | 🟠 Orange |
| **CCC** | Substantial Risk | 10.00% - 25.00% | ⚠️ Non-Investment | 🔴 Red |
| **D** | Default | 25.00%+ | ❌ Defaulted | ⚫ Black |

## Rating Modifiers

| Modifier | Meaning | Example |
|----------|---------|---------|
| **+** | Upper end of category | A+ (stronger than A) |
| **-** | Lower end of category | BBB- (weaker than BBB) |

## Visual Indicators (Frontend)

```typescript
// Badge colors by rating
const getRiskBadgeVariant = (rating: string) => {
  if (rating.startsWith('A')) return 'success';     // Green
  if (rating.startsWith('BBB')) return 'info';       // Blue
  if (rating.startsWith('BB')) return 'warning';     // Yellow
  if (rating.startsWith('B')) return 'warning';      // Orange
  if (rating.startsWith('CCC')) return 'error';      // Red
  return 'default';                                   // Gray
};
```

---

# 3. Risk Assessment Methodology

## Scoring Model

Risk ratings are calculated using a **quantitative scoring model** that evaluates multiple risk factors:

### 3.1 Quantitative Factors (60% weight)

| Factor | Weight | Measurement |
|--------|--------|-------------|
| **Financial Strength** | 20% | Debt/Equity, Current Ratio, Interest Coverage |
| **Profitability** | 15% | Net Margin, ROA, ROE |
| **Cash Flow Stability** | 15% | Operating Cash Flow / Debt |
| **Leverage** | 10% | Total Debt / Total Assets |

### 3.2 Qualitative Factors (30% weight)

| Factor | Weight | Measurement |
|--------|--------|-------------|
| **Management Quality** | 10% | Track record, governance |
| **Industry Position** | 10% | Market share, competitive moat |
| **Operational Risk** | 10% | Business model complexity, diversification |

### 3.3 External Factors (10% weight)

| Factor | Weight | Measurement |
|--------|--------|-------------|
| **Jurisdiction Risk** | 5% | Country credit rating, political stability |
| **Regulatory Environment** | 3% | Regulatory clarity, compliance burden |
| **Market Conditions** | 2% | Economic cycle, interest rate environment |

## Calculation Formula

```python
def calculate_risk_score(asset):
    """
    Calculate composite risk score (0-100)
    Higher score = Higher risk
    """
    
    # Quantitative score (0-60)
    quant_score = (
        asset.financial_strength * 0.20 +
        asset.profitability * 0.15 +
        asset.cash_flow_stability * 0.15 +
        asset.leverage * 0.10
    )
    
    # Qualitative score (0-30)
    qual_score = (
        asset.management_quality * 0.10 +
        asset.industry_position * 0.10 +
        asset.operational_risk * 0.10
    )
    
    # External score (0-10)
    external_score = (
        asset.jurisdiction_risk * 0.05 +
        asset.regulatory_risk * 0.03 +
        asset.market_risk * 0.02
    )
    
    # Composite score
    total_score = quant_score + qual_score + external_score
    
    return total_score

def score_to_rating(score):
    """Convert score (0-100) to letter rating"""
    if score <= 10:
        return 'AAA'
    elif score <= 20:
        return 'A'
    elif score <= 35:
        return 'BBB'
    elif score <= 50:
        return 'BB'
    elif score <= 65:
        return 'B'
    elif score <= 80:
        return 'CCC'
    else:
        return 'D'
```

## Rating Assignment Process

```
┌─────────────────────────────────────────────────────────────────┐
│                    RATING ASSIGNMENT FLOW                        │
│                                                                   │
│  1. Asset Submission                                              │
│     └─> Originator submits asset + documentation                 │
│                                                                   │
│  2. Automated Scoring                                             │
│     └─> AI model calculates preliminary risk score               │
│     └─> Financial data analysis (audited statements)             │
│     └─> Industry benchmarking                                    │
│                                                                   │
│  3. Analyst Review                                                │
│     └─> Credit analyst validates automated score                 │
│     └─> Qualitative adjustments (management, industry)           │
│     └─> External factors review (jurisdiction, regulatory)       │
│                                                                   │
│  4. Rating Committee                                              │
│     └─> Weekly committee review (for assets >$1M)                │
│     └─> Final rating approval                                    │
│     └─> Rating rationale documented                              │
│                                                                   │
│  5. Publication                                                   │
│     └─> Rating published on marketplace                          │
│     └─> Rating report available to investors                     │
│     └─> Ongoing monitoring scheduled                             │
│                                                                   │
│  6. Surveillance                                                  │
│     └─> Quarterly review (investment grade)                      │
│     └─> Monthly review (speculative grade)                       │
│     └─> Event-driven updates (material changes)                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# 4. 2026 Benchmark Data

## African Market Benchmarks (Q1 2026)

### Average Risk Ratings by Asset Class

| Asset Class | Avg Rating | Rating Range | Avg Yield | Sample Size |
|-------------|------------|--------------|-----------|-------------|
| **Invoice (Trade Finance)** | A- | AAA to BBB | 7.5% - 9.5% | 145 assets |
| **Receivables Pool** | BBB+ | A to BB | 8.0% - 10.5% | 89 assets |
| **Real Estate (Commercial)** | BBB | A to BB | 9.0% - 12.0% | 67 assets |
| **Real Estate (Residential)** | BBB- | BBB to B | 8.5% - 11.5% | 52 assets |
| **Agriculture** | BB+ | BBB to B | 10.0% - 14.0% | 78 assets |
| **Manufacturing** | BBB | A to BB | 8.5% - 11.0% | 43 assets |
| **Energy (Renewable)** | A- | AAA to BBB | 7.0% - 9.0% | 34 assets |
| **Energy (Traditional)** | BBB- | BBB to BB | 9.0% - 12.0% | 28 assets |
| **Mining & Minerals** | BB | BBB to B | 11.0% - 15.0% | 41 assets |
| **Infrastructure** | A | AAA to BBB | 6.5% - 8.5% | 23 assets |
| **Technology (Revenue-based)** | BB+ | BBB to B | 10.5% - 13.5% | 31 assets |
| **Equipment Lease** | BBB | A to BB | 8.0% - 10.5% | 56 assets |

### Average Risk Ratings by Jurisdiction

| Country | Country Risk Rating | Avg Asset Rating | Assets Tokenized | Regulatory Clarity |
|---------|---------------------|------------------|------------------|-------------------|
| **South Africa** | A- (S&P) | BBB+ | $245M | ✅ Clear |
| **Nigeria** | B- (S&P) | BB+ | $189M | ⚠️ Developing |
| **Kenya** | B (S&P) | BB+ | $156M | ✅ Clear |
| **Ghana** | B- (S&P) | BB | $134M | ✅ Clear |
| **Côte d'Ivoire** | B (S&P) | BB | $98M | ⚠️ Developing |
| **Senegal** | B (S&P) | BB- | $87M | ⚠️ Developing |
| **Mauritius** | BBB (S&P) | A- | $112M | ✅ Clear |
| **Rwanda** | B (S&P) | BB | $45M | ✅ Clear |
| **Tanzania** | B (S&P) | BB- | $67M | ⚠️ Developing |
| **Uganda** | B (S&P) | BB- | $52M | ⚠️ Developing |

### Rating Distribution (2026 YTD)

```
Rating Distribution Across All Tokenized Assets (N=820)

AAA  ████░░░░░░  4.2%  (34 assets)
A    ████████░░  8.5%  (70 assets)
BBB  ████████████████░░  32.1%  (263 assets)
BB   ████████████████████████░░  38.7%  (317 assets)
B    ████████░░  12.3%  (101 assets)
CCC  ██░░░░░░  3.4%  (28 assets)
D    ░░░░░░░░  0.8%  (7 assets)

Investment Grade (AAA-BBB):  44.8%
Speculative Grade (BB-B):    51.0%
Default/Substantial:          4.2%
```

### Performance Metrics by Rating (2025-2026)

| Rating | Avg Default Rate (1yr) | Avg Default Rate (3yr) | Avg Recovery Rate | Avg Spread over US Treasury |
|--------|------------------------|------------------------|-------------------|----------------------------|
| **AAA** | 0.02% | 0.08% | 95% | +50 bps |
| **A** | 0.15% | 0.45% | 90% | +100 bps |
| **BBB** | 0.75% | 2.10% | 80% | +200 bps |
| **BB** | 2.50% | 6.80% | 65% | +350 bps |
| **B** | 6.20% | 15.50% | 50% | +550 bps |
| **CCC** | 15.00% | 35.00% | 35% | +850 bps |

### Yield Spreads by Asset Class (2026 Benchmark)

```
Yield Spread Analysis (vs. US Treasury 10Y @ 4.2%)

Invoice (AAA):        4.7%  (+0.5%)
Invoice (A):          5.2%  (+1.0%)
Invoice (BBB):        6.0%  (+1.8%)
Invoice (BB):         7.5%  (+3.3%)

Real Estate (AAA):    4.8%  (+0.6%)
Real Estate (A):      5.5%  (+1.3%)
Real Estate (BBB):    6.5%  (+2.3%)
Real Estate (BB):     8.0%  (+3.8%)

Agriculture (A):      5.8%  (+1.6%)
Agriculture (BBB):    7.0%  (+2.8%)
Agriculture (BB):     9.0%  (+4.8%)
Agriculture (B):     11.5%  (+7.3%)

Mining (BBB):         7.5%  (+3.3%)
Mining (BB):          9.5%  (+5.3%)
Mining (B):          12.0%  (+7.8%)
```

---

# 5. Risk Factors by Asset Class

## 5.1 Invoice/Receivables

### Key Risk Drivers

| Factor | Impact | Measurement |
|--------|--------|-------------|
| **Debtor Credit Quality** | High | Debtor's credit rating, payment history |
| **Invoice Concentration** | Medium | Top 5 debtors / total invoices |
| **Payment Terms** | Medium | Average days outstanding |
| **Historical Default Rate** | High | % of invoices unpaid >90 days |
| **Industry Diversification** | Low | Number of debtor industries |

### Typical Ratings by Debtor Quality

| Debtor Profile | Typical Rating | Example Yield |
|----------------|----------------|---------------|
| Investment-grade debtor (AAA-BBB) | A to BBB | 7.0% - 9.0% |
| Strong corporate (BB) | BBB to BB | 8.5% - 11.0% |
| SME debtor (B) | BB to B | 10.0% - 13.0% |

### Red Flags
- ⚠️ Single debtor >50% of pool
- ⚠️ Average days outstanding >60
- ⚠️ Historical default rate >5%
- ⚠️ Debtor in distressed industry

---

## 5.2 Real Estate

### Key Risk Drivers

| Factor | Impact | Measurement |
|--------|--------|-------------|
| **Location** | High | City tier, neighborhood quality |
| **Occupancy Rate** | High | Current & historical occupancy |
| **Tenant Quality** | Medium | Credit rating of major tenants |
| **Loan-to-Value (LTV)** | High | Debt / appraised value |
| **Debt Service Coverage (DSCR)** | High | NOI / debt service |
| **Property Type** | Medium | Commercial vs. residential |

### Typical Ratings by Property Metrics

| Metric | AAA | A | BBB | BB |
|--------|-----|---|-----|----|
| **LTV** | <40% | <55% | <65% | <75% |
| **DSCR** | >2.0x | >1.75x | >1.5x | >1.25x |
| **Occupancy** | >95% | >90% | >85% | >80% |

### Red Flags
- ⚠️ LTV >75%
- ⚠️ DSCR <1.25x
- ⚠️ Occupancy <80%
- ⚠️ Single tenant >50% of income
- ⚠️ Property in declining market

---

## 5.3 Agriculture

### Key Risk Drivers

| Factor | Impact | Measurement |
|--------|--------|-------------|
| **Crop Diversification** | High | Number of crops, rotation |
| **Weather Risk** | High | Irrigation, climate resilience |
| **Commodity Price Exposure** | Medium | Hedging, forward contracts |
| **Land Ownership** | Medium | Owned vs. leased |
| **Operator Track Record** | High | Years in business, historical yields |
| **Insurance Coverage** | Medium | Crop insurance, revenue protection |

### Typical Ratings by Operation Type

| Operation Type | Typical Rating | Key Risks |
|----------------|----------------|-----------|
| Diversified farm (3+ crops, irrigation) | BBB to BB | Weather, commodity prices |
| Single-crop farm (rain-fed) | BB to B | Weather concentration |
| Contract farming (off-take agreement) | BBB to A | Counterparty risk |
| Organic/specialty crops | BB to B | Market demand risk |

### Red Flags
- ⚠️ Single crop >80% of revenue
- ⚠️ No irrigation in drought-prone area
- ⚠️ No crop insurance
- ⚠️ Operator <3 years experience
- ⚠️ Commodity prices in decline

---

## 5.4 Mining & Minerals

### Key Risk Drivers

| Factor | Impact | Measurement |
|--------|--------|-------------|
| **Reserve Quality** | High | Proven & probable reserves |
| **Production Cost** | High | Cash cost per oz/ton vs. spot price |
| **Commodity Price Exposure** | High | Hedging policy |
| **Jurisdiction Risk** | High | Mining code, political stability |
| **Environmental Compliance** | Medium | Permits, ESG standards |
| **Infrastructure** | Medium | Power, water, transport access |

### Typical Ratings by Commodity

| Commodity | Typical Rating Range | Avg Yield |
|-----------|---------------------|-----------|
| **Gold (low-cost producer)** | BBB to BB | 8.5% - 11.0% |
| **Gold (high-cost producer)** | BB to B | 11.0% - 14.0% |
| **Cobalt/Lithium** | BB to B | 12.0% - 16.0% |
| **Iron Ore** | BBB to BB | 9.0% - 12.0% |
| **Oil & Gas** | BB to B | 11.0% - 15.0% |

### Red Flags
- ⚠️ Cash cost >80th percentile of curve
- ⚠️ No hedging policy
- ⚠️ Jurisdiction with mining code instability
- ⚠️ Reserve life <5 years
- ⚠️ Environmental violations

---

## 5.5 Energy (Renewable)

### Key Risk Drivers

| Factor | Impact | Measurement |
|--------|--------|-------------|
| **Power Purchase Agreement (PPA)** | High | Tenor, credit of off-taker |
| **Technology Risk** | Medium | Proven vs. emerging technology |
| **Resource Quality** | High | Capacity factor, historical data |
| **Construction Risk** | Medium | EPC contractor, completion guarantees |
| **Regulatory Support** | Medium | Feed-in tariffs, tax incentives |

### Typical Ratings by Project Stage

| Stage | Typical Rating | Key Risks |
|-------|----------------|-----------|
| **Operational (with PPA)** | A to BBB | Off-taker credit, resource |
| **Under Construction** | BB to B | Completion, cost overrun |
| **Development (permitting)** | B to CCC | Permitting, financing |

### Red Flags
- ⚠️ No PPA or PPA <5 years
- ⚠️ Off-taker below investment grade
- ⚠️ Unproven technology
- ⚠️ <2 years resource data
- ⚠️ Regulatory support expiring

---

# 6. How to Use Risk Ratings

## For Investors

### Step 1: Assess Your Risk Tolerance

| Investor Profile | Suitable Ratings | Max Allocation |
|------------------|------------------|----------------|
| **Conservative** | AAA to A | 100% investment grade |
| **Moderate** | AAA to BBB | 70% investment grade, 30% speculative |
| **Aggressive** | All ratings | Up to 50% speculative (BB-B) |
| **Institutional** | As per mandate | Per investment policy |

### Step 2: Portfolio Construction

**Example Portfolio (Moderate Investor):**
```
40% AAA-A   (Invoice, Infrastructure, Renewable Energy)
40% BBB     (Real Estate, Receivables, Manufacturing)
20% BB      (Agriculture, Mining, Technology)
0%  B or below
```

### Step 3: Monitor Ratings

- **Quarterly Review:** Check for rating changes
- **Event-Driven:** Material changes (debtor downgrade, property damage)
- **Rebalancing:** Trim positions downgraded below your mandate

## For Asset Originators

### Improve Your Rating

| Action | Potential Impact | Cost |
|--------|------------------|------|
| **Obtain Audit** | +1 to +2 notches | $10k - $50k |
| **Add Collateral** | +1 to +2 notches | Varies |
| **Secure Guarantees** | +1 notch | Guarantee fee |
| **Diversify Customer Base** | +1 notch | Business development |
| **Obtain Insurance** | +1 notch | Insurance premium |
| **Extend Track Record** | +1 notch (over time) | Time |

### Rating Appeal Process

If you disagree with your rating:

1. **Submit Additional Information:** Financials, contracts, market data
2. **Request Analyst Call:** Discuss concerns directly
3. **Appeal to Committee:** Formal appeal with new information
4. **Second Opinion:** Pay for external rating (not binding)

---

# 7. Limitations

## What Risk Ratings Are NOT

1. **NOT a Recommendation:** Rating ≠ buy/sell/hold advice
2. **NOT Default-Proof:** Even AAA assets can default (rare but possible)
3. **NOT Static:** Ratings change with new information
4. **NOT Comprehensive:** Does not capture all risks (liquidity, market)
5. **NOT a Guarantee:** Past performance ≠ future results

## Known Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| **Limited Historical Data** | Tokenized assets are new (2020+) | Use traditional asset proxies |
| **Small Sample Sizes** | Some asset classes have <50 assets | Wider confidence intervals |
| **Model Risk** | AI models may miss novel risks | Human analyst overlay |
| **Lag Time** | Ratings updated quarterly | Event-driven updates for material changes |
| **Jurisdiction Variability** | African regulatory frameworks evolving | Regular regulatory monitoring |

## 2026-Specific Considerations

### Emerging Market Risks

- **Currency Risk:** Most assets denominated in local currency (NGN, KES, ZAR)
- **Political Risk:** Elections in Nigeria, Kenya (2027) may impact policies
- **Regulatory Evolution:** MiCA implementation in EU affects cross-border offerings
- **Climate Risk:** Increased weather volatility impacts agriculture, renewable energy

### Data Quality

- **Audited Financials:** 65% of originators provide audited statements (up from 45% in 2025)
- **Real-Time Reporting:** 40% provide monthly operational data (target: 75% by 2027)
- **Third-Party Verification:** 55% of assets have independent valuation (target: 80% by 2027)

---

# Appendix: Rating Examples

## Example 1: Invoice Pool (AAA Rating)

**Asset:** GDIZ (Benin) Invoice Pool #001  
**Rating:** AAA  
**Yield:** 7.2%  
**Key Strengths:**
- Debtors: 5 investment-grade corporations (AAA to A)
- Diversification: 50 invoices, no debtor >10%
- Historical default rate: 0.01% (10-year track record)
- Full collateralization (120% over-collateralized)
- Third-party credit enhancement (bond insurance)

**Risks:**
- Concentration in manufacturing sector (60%)
- Average payment terms: 45 days

---

## Example 2: Real Estate (BBB Rating)

**Asset:** Abidjan Commercial Property  
**Rating:** BBB  
**Yield:** 9.5%  
**Key Strengths:**
- Location: Prime business district (Cocody, Abidjan)
- Occupancy: 92% (5-year avg: 90%)
- Tenants: 15 tenants, diversified across industries
- LTV: 58% (conservative leverage)
- DSCR: 1.65x (comfortable debt coverage)

**Risks:**
- Single property (no diversification)
- Côte d'Ivoire jurisdiction risk (B rating)
- Lease rollover: 30% of leases expire in 2027

---

## Example 3: Agriculture (BB Rating)

**Asset:** Ghana Cocoa Farm  
**Rating:** BB  
**Yield:** 11.5%  
**Key Strengths:**
- Off-take agreement: Major chocolate manufacturer (BBB credit)
- Diversified: Cocoa (60%), cashews (30%), plantains (10%)
- Irrigation: Partial irrigation (40% of land)
- Track record: 15 years of profitable operations

**Risks:**
- Commodity price exposure (cocoa prices volatile)
- Weather risk: Partial irrigation, drought exposure
- Single crop dependency (cocoa = 60% of revenue)
- No crop insurance

---

**Document Control:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 9, 2026 | System Architect | Initial release with 2026 benchmarks |

**Next Review:** Q2 2026 (after Q1 data available)  
**Data Sources:** Platform transaction data, S&P Global, Fitch Ratings, African Development Bank
