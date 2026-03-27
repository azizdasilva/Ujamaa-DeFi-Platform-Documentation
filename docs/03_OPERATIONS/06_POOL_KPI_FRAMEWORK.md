# Ujamaa Liquidity Pool - Complete KPI Framework

**Author:** Aziz Da Silva - Lead Architect
**Document ID:** UJAMAA-KPI-001
**Version:** 1.0
**Last Updated:** March 21, 2026
**Status:** ✅ Complete Specification

---

## Executive Summary

This document defines all possible Key Performance Indicators (KPIs) for the Ujamaa DeFi Platform Liquidity Pool ecosystem. The KPIs are organized into **6 categories** covering **financial performance**, **pool operations**, **risk management**, **investor metrics**, **impact measurement**, and **platform operations**.

---

## KPI Categories Overview

| Category | KPI Count | Primary Stakeholders | Reporting Frequency |
|----------|-----------|---------------------|---------------------|
| **1. Financial Performance** | 25 | Investors, Management | Daily, Weekly, Monthly |
| **2. Pool Operations** | 20 | Pool Managers, Operations | Daily, Real-time |
| **3. Risk Management** | 18 | Compliance, Risk Officers | Daily, Weekly |
| **4. Investor Metrics** | 15 | Investors, IR Team | Monthly, Quarterly |
| **5. Impact Measurement** | 12 | Impact Committee, Board | Quarterly, Annually |
| **6. Platform Operations** | 15 | Tech Team, Operations | Real-time, Weekly |
| **TOTAL** | **105** | - | - |

---

## 1. FINANCIAL PERFORMANCE KPIs

### 1.1 Pool Value & Growth

| KPI ID | KPI Name | Formula | Unit | Target | Frequency |
|--------|----------|---------|------|--------|-----------|
| **FP-001** | **Total Pool Value (TPV)** | Sum of all assets in pool | EUR (18 decimals) | €50M (Y1) | Real-time |
| **FP-002** | **Net Asset Value (NAV) per Share** | `Total Pool Value / Total Shares Outstanding` | EUR/share | 1.00 → 1.10+ | Real-time |
| **FP-003** | **NAV Growth Rate** | `(NAV_end - NAV_start) / NAV_start × 100` | % | 10-15% APR | Daily |
| **FP-004** | **Assets Under Management (AUM)** | Total market value of all managed assets | EUR | €50M (Y1) | Daily |
| **FP-005** | **Pool Capitalization** | Total uLP supply × NAV per share | EUR | - | Real-time |

### 1.2 Yield & Returns

| KPI ID | KPI Name | Formula | Unit | Target | Frequency |
|--------|----------|---------|------|--------|-----------|
| **FP-006** | **Gross Yield Earned** | Sum of all interest from financings | EUR | 12-15% gross | Daily |
| **FP-007** | **Net Yield to Investors** | `Gross Yield - Management Fee - Performance Fee` | EUR | 10-15% APR | Daily |
| **FP-008** | **Yield Accrual Rate** | `Pending Yield / Time Period` | EUR/day | - | Daily |
| **FP-009** | **Annualized Percentage Yield (APY)** | `(1 + periodic_rate)^periods - 1` | % | 10.5-15.8% | Daily |
| **FP-010** | **Internal Rate of Return (IRR)** | Discount rate making NPV = 0 | % | 12%+ | Monthly |
| **FP-011** | **Return on Investment (ROI)** | `(Current Value - Principal) / Principal × 100` | % | 10-15% | Monthly |
| **FP-012** | **Yield per Share** | `Total Yield / Total Shares` | EUR/share | - | Daily |
| **FP-013** | **Accumulated Yield** | Total yield accrued since inception | EUR | - | Real-time |
| **FP-014** | **Pending Yield** | Yield not yet accrued/fees not calculated | EUR | - | Real-time |
| **FP-015** | **Yield Coverage Ratio** | `Net Yield / Operating Expenses` | Ratio | >2.0x | Monthly |

### 1.3 Fees & Revenue

| KPI ID | KPI Name | Formula | Unit | Target | Frequency |
|--------|----------|---------|------|--------|-----------|
| **FP-016** | **Management Fee Revenue** | `AUM × 2.0% × (days/365)` | EUR | 2% p.a. | Daily |
| **FP-017** | **Performance Fee Revenue** | `(Yield - Hurdle) × 20%` (above 8% hurdle) | EUR | Varies | Quarterly |
| **FP-018** | **Total Fee Revenue** | `Management Fee + Performance Fee` | EUR | - | Monthly |
| **FP-019** | **Fee Rate (Effective)** | `Total Fees / Average AUM × 100` | % | 2-4% | Monthly |
| **FP-020** | **High-Water Mark** | Highest NAV achieved (for performance fee calc) | EUR/share | - | Quarterly |

### 1.4 Pool Family Performance

| KPI ID | KPI Name | Formula | Unit | Target | Frequency |
|--------|----------|---------|------|--------|-----------|
| **FP-021** | **Pool Industrie Yield** | Yield from industrial financings | EUR | 10-12% APR | Daily |
| **FP-022** | **Pool Agriculture Yield** | Yield from agriculture financings | EUR | 12-15% APR | Daily |
| **FP-023** | **Pool Trade Finance Yield** | Yield from trade finance | EUR | 8-10% APR | Daily |
| **FP-024** | **Pool Renewable Energy Yield** | Yield from renewable energy projects | EUR | 9-11% APR | Daily |
| **FP-025** | **Pool Real Estate Yield** | Yield from real estate assets | EUR | 8-12% APR | Daily |

---

## 2. POOL OPERATIONS KPIs

### 2.1 Financing Portfolio

| KPI ID | KPI Name | Formula | Unit | Target | Frequency |
|--------|----------|---------|------|--------|-----------|
| **PO-001** | **Total Financings Active** | Count of non-repaid financings | Number | 50+ (Y1) | Real-time |
| **PO-002** | **Total Principal Deployed** | Sum of all financing principals | EUR | 80% of TPV | Real-time |
| **PO-003** | **Available Liquidity** | `Total Pool Value - Deployed Amount` | EUR | 20% of TPV | Real-time |
| **PO-004** | **Deployment Rate** | `Deployed / Available × 100` | % | 75-85% | Weekly |
| **PO-005** | **Average Financing Size** | `Total Principal / Number of Financings` | EUR | €100K-500K | Monthly |
| **PO-006** | **Financing by Pool Family** | Count per pool family | Number | Diversified | Weekly |
| **PO-007** | **Average Interest Rate** | `Σ(Principal × Rate) / ΣPrincipal` | % (bps) | 10-12% | Weekly |
| **PO-008** | **Weighted Average Lock-up** | `Σ(Days × Principal) / ΣPrincipal` | Days | 180-365 | Monthly |
| **PO-009** | **Financing Maturity Schedule** | Financings due per period | Count/EUR | - | Monthly |
| **PO-010** | **Repaid Financings Count** | Count of fully repaid financings | Number | - | Real-time |

### 2.2 Asset Allocation

| KPI ID | KPI Name | Formula | Unit | Limit | Frequency |
|--------|----------|---------|------|-------|-----------|
| **PO-011** | **Per-Industrial Allocation** | Total allocated to single industrial | % of TPV | Max 20% | Real-time |
| **PO-012** | **Per-Asset-Class Allocation** | Total allocated to asset class | % of TPV | Max 40% | Real-time |
| **PO-013** | **Geographic Allocation** | Allocation by country/region | % of TPV | Max 30% | Weekly |
| **PO-014** | **Sector Concentration** | Allocation by industry sector | % of TPV | Max 40% | Weekly |
| **PO-015** | **Diversification Index** | Herfindahl-Hirschman Index | Index (0-1) | <0.15 | Monthly |
| **PO-016** | **Top 5 Exposure** | Sum of top 5 industrials | % of TPV | Max 50% | Weekly |
| **PO-017** | **Asset Class Utilization** | `Allocated / Max Allocation × 100` | % | <100% | Real-time |
| **PO-018** | **Pool Family Distribution** | % allocation per pool family | % | Balanced | Weekly |
| **PO-019** | **Currency Exposure** | Exposure by currency (EUR, USD, etc.) | % | Hedged | Weekly |
| **PO-020** | **Guarantee Token Coverage** | `Financings with UGT / Total Financings` | % | 100% | Real-time |

---

## 3. RISK MANAGEMENT KPIs

### 3.1 Credit Risk

| KPI ID | KPI Name | Formula | Unit | Limit | Frequency |
|--------|----------|---------|------|-------|-----------|
| **RM-001** | **Default Rate** | `Defaulted Amount / Total Deployed × 100` | % | <5% | Monthly |
| **RM-002** | **Non-Performing Financing Ratio** | `NPF Count / Total Count × 100` | % | <10% | Weekly |
| **RM-003** | **Provision Coverage Ratio** | `Provisions / Expected Losses` | % | >100% | Monthly |
| **RM-004** | **Expected Credit Loss (ECL)** | `PD × LGD × EAD` (IFRS 9) | EUR | - | Monthly |
| **RM-005** | **Days Past Due (DPD)** | Average days payments are late | Days | <30 | Weekly |
| **RM-006** | **Repayment Performance Rate** | `On-time Repayments / Total Due × 100` | % | >90% | Weekly |
| **RM-007** | **Recovery Rate** | `Recovered / Defaulted Amount × 100` | % | >60% | Quarterly |
| **RM-008** | **Credit Quality Distribution** | Financings by credit rating | % | Investment grade | Monthly |
| **RM-009** | **Watchlist Count** | Number of financings under monitoring | Number | <10% | Weekly |
| **RM-010** | **Concentration Risk Score** | Composite score of concentration | Score (1-10) | <6 | Monthly |

### 3.2 Liquidity Risk

| KPI ID | KPI Name | Formula | Unit | Limit | Frequency |
|--------|----------|---------|------|-------|-----------|
| **RM-011** | **Liquidity Reserve Ratio** | `Liquid Assets / Total Liabilities × 100` | % | >5% | Daily |
| **RM-012** | **Redemption Coverage** | `Available Liquidity / Redemption Requests` | % | >100% | Real-time |
| **RM-013** | **Gate Trigger Monitor** | `Redemption Requests / NAV × 100` | % | 10% trigger | Real-time |
| **RM-014** | **Maturity Mismatch Ratio** | `Short-term Assets / Short-term Liabilities` | Ratio | >1.0 | Weekly |
| **RM-015** | **Cash Drag** | `Idle Cash / Total Pool × 100` | % | <10% | Daily |
| **RM-016** | **Funding Gap** | `Maturing Liabilities - Maturing Assets` | EUR | - | Monthly |
| **RM-017** | **Liquidity Buffer Days** | Days of redemptions covered by liquid assets | Days | >30 | Weekly |
| **RM-018** | **Stressed Liquidity Ratio** | Liquidity under stress scenario | % | >80% | Monthly |

---

## 4. INVESTOR METRICS KPIs

### 4.1 Investor Base

| KPI ID | KPI Name | Formula | Unit | Target | Frequency |
|--------|----------|---------|------|--------|-----------|
| **IM-001** | **Total Investors** | Count of uLP holders | Number | 100+ (Y1) | Daily |
| **IM-002** | **New Investors (Period)** | New uLP holders in period | Number | 20+/month | Monthly |
| **IM-003** | **Investor Concentration** | Top 10 holders / Total supply | % | <50% | Weekly |
| **IM-004** | **Average Investment Size** | `Total AUM / Number of Investors` | EUR | €500K+ | Monthly |
| **IM-005** | **Investor Type Distribution** | % by type (Family Office, Fund, etc.) | % | Diversified | Quarterly |
| **IM-006** | **Geographic Distribution** | % by investor jurisdiction | % | Compliant | Quarterly |
| **IM-007** | **Investor Retention Rate** | `Retained Investors / Total × 100` | % | >80% | Quarterly |
| **IM-008** | **Churn Rate** | `Exited Investors / Total × 100` | % | <10% | Quarterly |

### 4.2 Investor Returns

| KPI ID | KPI Name | Formula | Unit | Target | Frequency |
|--------|----------|---------|------|--------|-----------|
| **IM-009** | **Investor Portfolio Value** | `Balance × NAV per Share` | EUR | - | Real-time |
| **IM-010** | **Unrealized Gain/Loss** | `Current Value - Principal Invested` | EUR | - | Real-time |
| **IM-011** | **Realized Gain/Loss** | `Redemption Value - Principal Redeemed` | EUR | - | Per Redemption |
| **IM-012** | **Total Return (Investor)** | `(Unrealized + Realized) / Principal × 100` | % | 10-15% APR | Monthly |
| **IM-013** | **Distribution Yield** | `Distributions Received / Investment × 100` | % | Quarterly | Quarterly |
| **IM-014** | **Time-Weighted Return** | Geometric mean of periodic returns | % | - | Monthly |
| **IM-015** | **Money-Weighted Return** | IRR for individual investor cash flows | % | - | Monthly |

---

## 5. IMPACT MEASUREMENT KPIs

### 5.1 Economic Impact

| KPI ID | KPI Name | Formula | Unit | Target (Y1) | Frequency |
|--------|----------|---------|------|-------------|-----------|
| **IMP-001** | **SMEs Financed** | Count of SMEs receiving financing | Number | 50+ | Monthly |
| **IMP-002** | **Jobs Created** | Direct jobs from financed SMEs | Number | 1,000+ | Quarterly |
| **IMP-003** | **Jobs Supported** | Indirect jobs in value chain | Number | 2,000+ | Quarterly |
| **IMP-004** | **GDP Contribution** | Economic value added by financed SMEs | EUR | €10M+ | Annually |
| **IMP-005** | **Tax Revenue Generated** | Taxes paid by financed SMEs | EUR | €2M+ | Annually |
| **IMP-006** | **Export Revenue** | Export earnings from financed SMEs | EUR | €5M+ | Quarterly |
| **IMP-007** | **Local Content Ratio** | % local inputs in financed operations | % | >60% | Quarterly |
| **IMP-008** | **SME Revenue Growth** | Average revenue growth of financed SMEs | % | 20%+ | Annually |

### 5.2 Social & Environmental Impact

| KPI ID | KPI Name | Formula | Unit | Target (Y1) | Frequency |
|--------|----------|---------|------|-------------|-----------|
| **IMP-009** | **Women-Led Businesses** | % financed SMEs led by women | % | 30%+ | Quarterly |
| **IMP-010** | **Youth Employment** | % jobs created for youth (<35) | % | 50%+ | Quarterly |
| **IMP-011** | **Renewable Energy Capacity** | MW of renewable energy financed | MW | 10+ MW | Quarterly |
| **IMP-012** | **CO2 Emissions Avoided** | Tonnes CO2 equivalent avoided | tCO2e | 5,000+ | Annually |

### 5.3 SDG Alignment

| KPI ID | KPI Name | Alignment | Target | Frequency |
|--------|----------|-----------|--------|-----------|
| **IMP-013** | **SDG 1 (No Poverty)** | Income generation for low-income | 10,000+ beneficiaries | Annually |
| **IMP-014** | **SDG 5 (Gender Equality)** | Women economic empowerment | 30% women-led | Quarterly |
| **IMP-015** | **SDG 8 (Decent Work)** | Quality jobs created | 1,000+ jobs | Quarterly |
| **IMP-016** | **SDG 9 (Industry)** | Industrial capacity built | 50+ SMEs | Monthly |
| **IMP-017** | **SDG 10 (Reduced Inequalities)** | Inclusive finance access | 40% underserved | Quarterly |
| **IMP-018** | **SDG 13 (Climate Action)** | Green financing | 20% of portfolio | Quarterly |

---

## 6. PLATFORM OPERATIONS KPIs

### 6.1 Smart Contract Operations

| KPI ID | KPI Name | Formula | Unit | Target | Frequency |
|--------|----------|---------|------|--------|-----------|
| **OP-001** | **Contract Gas Efficiency** | Average gas per transaction | Gwei | <500K | Per Tx |
| **OP-002** | **Transaction Success Rate** | `Successful Tx / Total Tx × 100` | % | >99% | Real-time |
| **OP-003** | **Oracle Uptime** | % time oracles providing data | % | >99.9% | Real-time |
| **OP-004** | **NAV Calculation Accuracy** | Deviation from expected NAV | % | <0.01% | Daily |
| **OP-005** | **Yield Distribution Accuracy** | Accuracy of yield calculations | % | 100% | Per Distribution |
| **OP-006** | **Compliance Check Pass Rate** | `Passed Checks / Total Checks × 100` | % | 100% | Real-time |
| **OP-007** | **Identity Verification Rate** | `Verified Users / Total Users × 100` | % | 100% | Daily |
| **OP-008** | **Transfer Restriction Triggers** | Blocked transfers (sanctions, etc.) | Count | - | Real-time |
| **OP-009** | **Guarantee Token Mint Rate** | UGT minted per financing | % | 100% | Per Financing |
| **OP-010** | **Contract Upgrade Readiness** | Proxy upgrade capability status | Status | Ready | Monthly |

### 6.2 Backend & API Operations

| KPI ID | KPI Name | Formula | Unit | Target | Frequency |
|--------|----------|---------|------|--------|-----------|
| **OP-011** | **API Response Time (P95)** | 95th percentile response time | ms | <200ms | Real-time |
| **OP-012** | **API Availability** | % uptime of API endpoints | % | >99.9% | Real-time |
| **OP-013** | **Database Query Performance** | Average query execution time | ms | <50ms | Real-time |
| **OP-014** | **Error Rate** | `Failed Requests / Total Requests × 100` | % | <0.1% | Real-time |
| **OP-015** | **Data Sync Latency** | Delay between on-chain and DB | Seconds | <30s | Real-time |

### 6.3 Security & Compliance

| KPI ID | KPI Name | Formula | Unit | Target | Frequency |
|--------|----------|---------|------|--------|-----------|
| **OP-016** | **Security Incident Count** | Number of security incidents | Count | 0 | Real-time |
| **OP-017** | **Failed Login Attempts** | Count of failed auth attempts | Count | - | Real-time |
| **OP-018** | **KYC/AML Check Completion** | % users completing checks | % | 100% | Daily |
| **OP-019** | **Sanctions Screening Hits** | Matches against sanctions lists | Count | - | Real-time |
| **OP-020** | **Audit Log Completeness** | % actions logged | % | 100% | Daily |

---

## KPI Dashboard Specifications

### Real-Time Dashboard (Operations)

| KPI Category | Displayed KPIs | Update Frequency |
|--------------|----------------|------------------|
| **Pool Value** | TPV, NAV, Available Liquidity | Real-time |
| **Financings** | Active Count, Deployed Amount | Real-time |
| **Risk Limits** | Per-Industrial, Per-Asset-Class | Real-time |
| **Redemptions** | Requests, Coverage Ratio | Real-time |
| **Compliance** | Verification Rate, Blocked Transfers | Real-time |

### Daily Dashboard (Management)

| KPI Category | Displayed KPIs |
|--------------|----------------|
| **Financial** | NAV Growth, Yield Earned, Fees Accrued |
| **Operations** | Deployment Rate, New Financings |
| **Risk** | Default Rate, Liquidity Reserve, DPD |
| **Investors** | Total Investors, Net Flows |

### Monthly Report (Investors)

| KPI Category | Displayed KPIs |
|--------------|----------------|
| **Returns** | NAV Performance, Total Return, Distribution Yield |
| **Portfolio** | AUM, Financing Count, Pool Distribution |
| **Risk** | Default Rate, Provision Coverage, Concentration |
| **Impact** | SMEs Financed, Jobs Created, SDG Metrics |

### Quarterly Report (Board/Regulators)

| KPI Category | Displayed KPIs |
|--------------|----------------|
| **Financial** | All FP KPIs with trends |
| **Risk** | All RM KPIs with stress tests |
| **Impact** | All IMP KPIs with SDG alignment |
| **Compliance** | Regulatory compliance status |

---

## KPI Calculation Methods

### NAV Calculation

```python
def calculate_nav(total_pool_value: int, total_shares: int) -> int:
    """
    Calculate Net Asset Value per share (18 decimals)
    
    Formula: NAV = Total Pool Value / Total Shares Outstanding
    
    Returns: NAV per share in wei (18 decimals)
    """
    if total_shares == 0:
        return 10**18  # Initial NAV = 1.00
    return total_pool_value // total_shares
```

### Yield Calculation

```python
def calculate_yield(financings: list) -> int:
    """
    Calculate total yield from all financings
    
    Formula: Σ(Principal × Interest Rate × Time)
    
    Returns: Total yield in wei (18 decimals)
    """
    total_yield = 0
    for financing in financings:
        interest = (financing.principal * financing.interest_rate) // 10000
        total_yield += interest
    return total_yield
```

### Fee Calculation

```python
def calculate_fees(
    total_pool_value: int,
    pending_yield: int,
    management_fee_rate: int,
    performance_fee_rate: int,
    hurdle_rate: int,
    time_elapsed: int
) -> tuple:
    """
    Calculate management and performance fees
    
    Returns: (management_fee, performance_fee, net_yield)
    """
    year_in_seconds = 365 * 24 * 60 * 60
    
    # Management fee (annual, pro-rated)
    management_fee = (
        total_pool_value * management_fee_rate * time_elapsed
    ) // (10000 * year_in_seconds)
    
    # Performance fee (on yield above hurdle)
    if pending_yield > (total_pool_value * hurdle_rate // 10000):
        performance_fee = (pending_yield * performance_fee_rate) // 10000
    else:
        performance_fee = 0
    
    net_yield = pending_yield - management_fee - performance_fee
    
    return (management_fee, performance_fee, net_yield)
```

---

## Data Sources

| KPI Category | Primary Data Source | Backup Source |
|--------------|--------------------|---------------|
| **Financial** | ULPToken.sol, LiquidityPool.sol | Backend DB |
| **Operations** | LiquidityPool.sol | Backend DB |
| **Risk** | LiquidityPool.sol, Compliance Oracle | Backend Analytics |
| **Investor** | ULPToken.sol, Backend DB | Blockchain Indexer |
| **Impact** | Backend DB, Manual Input | External APIs |
| **Platform** | Smart Contracts, Backend Logs | Monitoring Tools |

---

## Reporting Schedule

| Report Type | Frequency | Recipients | Key KPIs |
|-------------|-----------|------------|----------|
| **Daily Flash** | Daily | Management | FP-001 to FP-005, PO-001 to PO-004 |
| **Weekly Summary** | Weekly | Management, Board | All FP, PO, RM (summary) |
| **Monthly Investor** | Monthly | Investors | FP, IM, RM (detailed) |
| **Quarterly Board** | Quarterly | Board, Regulators | All categories |
| **Annual Impact** | Annually | Public, Stakeholders | All IMP KPIs |

---

## KPI Governance

### Ownership

| KPI Category | Owner | Reviewer | Approver |
|--------------|-------|----------|----------|
| **Financial** | CFO | CEO | Board |
| **Operations** | COO | CEO | Board |
| **Risk** | CRO | CEO | Board/Risk Committee |
| **Investor** | Head of IR | CFO | CEO |
| **Impact** | Head of Impact | CEO | Board |
| **Platform** | CTO | CEO | Board |

### Review Process

1. **Daily**: Automated monitoring with alerts
2. **Weekly**: Operations review meeting
3. **Monthly**: Management review and investor reporting
4. **Quarterly**: Board review and regulatory reporting
5. **Annually**: External audit and impact verification

---

## Appendix: KPI Definitions Glossary

| Term | Definition |
|------|------------|
| **TPV** | Total Pool Value - Sum of all assets in the liquidity pool |
| **NAV** | Net Asset Value - Value per uLP share |
| **APR** | Annual Percentage Rate - Simple interest rate |
| **APY** | Annual Percentage Yield - Compound interest rate |
| **AUM** | Assets Under Management - Total managed assets |
| **DPD** | Days Past Due - Number of days payment is late |
| **ECL** | Expected Credit Loss - IFRS 9 impairment calculation |
| **LGD** | Loss Given Default - % of exposure lost on default |
| **PD** | Probability of Default - Likelihood of default |
| **EAD** | Exposure at Default - Amount at risk on default |
| **UGT** | Guarantee Token - Collateral token for financings |
| **uLP** | Ujamaa Liquidity Provider Token - Yield-bearing pool token |

---

## Document Control

| Version | Date | Author | Changes | Approved By |
|---------|------|--------|---------|-------------|
| **1.0** | March 21, 2026 | Lead Architect | Initial KPI framework | Board |

---

**© 2026 Ujamaa DeFi Platform. All Rights Reserved.**

**Confidential - Internal Use Only**
