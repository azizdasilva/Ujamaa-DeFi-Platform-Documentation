# 📊 UJAMAA Pool KPI Implementation Strategy

**Author:** Aziz Da Silva - Lead Architect
**Document ID:** UJAMAA-KPI-IMPL-001
**Date:** March 21, 2026
**Status:** 🔄 Implementation Plan

---

## Executive Summary

This document outlines the implementation strategy for **18 Key Performance Indicators (KPIs)** across 5 categories for the Ujamaa DeFi Platform Liquidity Pool. The KPIs provide comprehensive visibility into financial performance, liquidity management, risk exposure, compliance status, and impact measurement.

---

## KPI Framework Overview

| Category | KPI Count | Priority | Implementation Phase |
|----------|-----------|----------|---------------------|
| **Financial** | 4 | 🔴 Critical | Phase 1 |
| **Liquidity** | 4 | 🔴 Critical | Phase 1 |
| **Risk** | 4 | 🟡 High | Phase 2 |
| **Compliance** | 3 | 🟡 High | Phase 2 |
| **Impact/ESG** | 3 | 🟢 Medium | Phase 3 |
| **TOTAL** | **18** | - | - |

---

## Detailed KPI Specifications

### 1. Financial KPIs (Phase 1)

| KPI | Formula | Data Source | Update Frequency |
|-----|---------|-------------|------------------|
| **Net APY** | `(Gross Yield - Management Fee - Performance Fee) / TVL × 365 / days` | ULPToken.sol | Daily |
| **NAV per Share** | `Total Pool Value / Total Shares Outstanding` | ULPToken.getNAV() | Real-time |
| **Yield Variance** | `|Projected Yield - Actual Yield| / Projected Yield × 100` | Backend Calculation | Weekly |
| **Expense Ratio** | `(Management Fee + Performance Fee) / TVL × 100` | ULPToken.sol | Monthly |

**Targets:**
- Net APY: 8-12% (pool dependent)
- NAV: Initial 1.00, growing >1.0
- Yield Variance: <±0.5%
- Expense Ratio: <2.5% annualized

---

### 2. Liquidity KPIs (Phase 1)

| KPI | Formula | Data Source | Update Frequency |
|-----|---------|-------------|------------------|
| **TVL** | `Sum of all EUROD in pool (deposited + deployed)` | LiquidityPool.sol | Real-time |
| **Utilization Rate** | `Deployed Amount / Total Pool Value × 100` | LiquidityPool.sol | Daily |
| **Cash Drag** | `(Undeployed Capital × Target APY) / TVL × 100` | Backend Calculation | Daily |
| **Redemption Liquidity** | `Available EUROD / Total TVL × 100` | LiquidityPool.sol | Real-time |

**Targets:**
- TVL: €10M - €100M+
- Utilization: 85-92%
- Cash Drag: <0.75% yield impact
- Redemption Liquidity: 5-10% of TVL

---

### 3. Risk KPIs (Phase 2)

| KPI | Formula | Data Source | Update Frequency |
|-----|---------|-------------|------------------|
| **Default Rate (NPL)** | `Defaulted Amount / Total Deployed × 100` | LiquidityPool.financings | Weekly |
| **Concentration Risk** | `Largest Industrial Exposure / TVL × 100` | LiquidityPool.allocationPerIndustrial | Daily |
| **Avg. Credit Rating** | `Σ(Credit Score × Principal) / ΣPrincipal` | RiskEngine | Monthly |
| **Collateralization %** | `UGT Token Value / Deployed Funds × 100` | GuaranteeToken.sol | Daily |

**Targets:**
- Default Rate: <2.0%
- Concentration: <15% per industrial
- Credit Rating: BBB+ or higher
- Collateralization: >125%

---

### 4. Compliance KPIs (Phase 2)

| KPI | Formula | Data Source | Update Frequency |
|-----|---------|-------------|------------------|
| **KYC/KYB Coverage** | `Verified Investors / Total Investors × 100` | Backend DB | Real-time |
| **Whitelisted Wallets** | `COUNT(DISTINCT verified_wallets)` | Backend DB | Daily |
| **Jurisdiction Diversity** | `COUNT(DISTINCT allowed_countries)` | Backend DB | Weekly |

**Targets:**
- KYC/KYB: 100% (hard requirement)
- Whitelisted: 20+ per pool
- Jurisdictions: >5 countries

---

### 5. Impact/ESG KPIs (Phase 3)

| KPI | Formula | Data Source | Update Frequency |
|-----|---------|-------------|------------------|
| **Industrial Growth** | `(Current Capacity - Initial Capacity) / Initial × 100` | Industrial Gateway | Quarterly |
| **Value-Add %** | `Processed Goods Value / Raw Commodity Value` | Industrial Gateway | Quarterly |
| **Job Creation** | `Jobs Supported / (€1M Financing)` | Impact Database | Quarterly |

**Targets:**
- Industrial Growth: >20% YoY
- Value-Add: >2.5x
- Job Creation: 50-150 jobs per €1M

---

## Implementation Phases

### Phase 1: Core Financial & Liquidity (Week 1-2) 🔴

**Priority:** Critical for MVP launch

**Backend Changes:**
1. Expand `PoolYield` dataclass in `yield_calculator.py`
2. Add utilization rate calculation
3. Add expense ratio calculation
4. Create daily KPI snapshot service

**Smart Contract Changes:**
1. Add `getUtilizationRate()` to LiquidityPool.sol
2. Add `getAvailableLiquidity()` to LiquidityPool.sol
3. Verify NAV calculation in ULPToken.sol

**Frontend Changes:**
1. Update StatsCard component for new metrics
2. Create Pool Health Dashboard
3. Add real-time TVL display
4. Add utilization rate progress bar

**Files to Modify:**
- `backend/services/MVP/yield_calculator.py`
- `backend/api/pools.py`
- `contracts/MVP/LiquidityPool.sol`
- `contracts/MVP/ULPToken.sol`
- `frontend/src/MVP/components/StatsCard.tsx`
- `frontend/src/MVP/pages/pool/Dashboard.tsx` (new)

---

### Phase 2: Risk & Compliance (Week 3-4) 🟡

**Priority:** High for institutional investors

**Backend Changes:**
1. Create `RiskEngine` service
2. Implement credit rating calculation
3. Add concentration risk monitoring
4. Create compliance tracking service
5. Add default rate calculation

**Smart Contract Changes:**
1. Add `getPoolHealth()` view function
2. Add `getConcentrationRisk()` function
3. Add `getCollateralizationRatio()` function

**Frontend Changes:**
1. Create Risk Dashboard tab
2. Add Compliance Dashboard tab
3. Add credit rating visualization
4. Add concentration risk warnings

**Files to Create:**
- `backend/services/MVP/risk_engine.py`
- `backend/services/MVP/compliance_tracker.py`
- `frontend/src/MVP/pages/pool/RiskDashboard.tsx`
- `frontend/src/MVP/pages/pool/ComplianceDashboard.tsx`

---

### Phase 3: Impact/ESG (Week 5-6) 🟢

**Priority:** Medium for reporting and marketing

**Backend Changes:**
1. Create impact metrics database schema
2. Add Industrial Gateway integration
3. Implement job creation calculation
4. Add value-add ratio calculation

**Smart Contract Changes:**
1. Add impact metrics events to IndustrialGateway.sol

**Frontend Changes:**
1. Create Impact Dashboard tab
2. Add SDG alignment visualization
3. Add job creation counter
4. Add industrial growth charts

**Files to Create:**
- `backend/services/MVP/impact_tracker.py`
- `frontend/src/MVP/pages/pool/ImpactDashboard.tsx`

---

## Technical Architecture

### Backend KPI Calculation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     KPI CALCULATION ENGINE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Blockchain │    │   Backend    │    │   External   │      │
│  │    Reader    │    │     DB       │    │     APIs     │      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                   │                   │               │
│         └───────────────────┼───────────────────┘               │
│                             │                                   │
│                    ┌────────▼────────┐                          │
│                    │  KPI Calculator │                          │
│                    │   (Python)      │                          │
│                    └────────┬────────┘                          │
│                             │                                   │
│         ┌───────────────────┼───────────────────┐              │
│         │                   │                   │               │
│  ┌──────▼───────┐   ┌──────▼───────┐   ┌──────▼───────┐       │
│  │  Financial   │   │    Risk &    │   │   Impact &   │       │
│  │    KPIs      │   │  Compliance  │   │     ESG      │       │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘       │
│         │                   │                   │               │
│         └───────────────────┼───────────────────┘               │
│                             │                                   │
│                    ┌────────▼────────┐                          │
│                    │   KPI Cache     │                          │
│                    │   (Redis)       │                          │
│                    └────────┬────────┘                          │
│                             │                                   │
│                    ┌────────▼────────┐                          │
│                    │   REST API      │                          │
│                    │   Endpoints     │                          │
│                    └─────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

### Smart Contract Integration

```solidity
// LiquidityPool.sol additions
interface IPoolKPIs {
    // Financial
    function getNetAPY() external view returns (uint256);
    function getYieldVariance() external view returns (int256);
    function getExpenseRatio() external view returns (uint256);
    
    // Liquidity
    function getUtilizationRate() external view returns (uint256);
    function getCashDrag() external view returns (uint256);
    function getRedemptionLiquidity() external view returns (uint256);
    
    // Risk
    function getDefaultRate() external view returns (uint256);
    function getConcentrationRisk() external view returns (uint256);
    function getCollateralizationRatio() external view returns (uint256);
    
    // Pool Health (composite)
    function getPoolHealth() external view returns (PoolHealth memory);
}

struct PoolHealth {
    uint256 utilizationRate;
    uint256 defaultRate;
    uint256 collateralization;
    bool isHealthy;
}
```

---

## API Endpoints

### KPI Endpoints (Phase 1)

```python
# GET /api/v1/pool/kpis
{
    "financial": {
        "net_apy": 10.5,
        "nav_per_share": 1.0234,
        "yield_variance": 0.23,
        "expense_ratio": 2.1
    },
    "liquidity": {
        "tvl": 50000000,
        "utilization_rate": 87.5,
        "cash_drag": 0.45,
        "redemption_liquidity": 6250000
    }
}

# GET /api/v1/pool/health
{
    "is_healthy": true,
    "utilization_rate": 87.5,
    "default_rate": 1.2,
    "collateralization": 135.0,
    "risk_score": "BBB+"
}

# GET /api/v1/pool/kpis/history?days=30
{
    "daily_snapshots": [...]
}
```

---

## Database Schema

### KPI Snapshots Table

```sql
CREATE TABLE pool_kpi_snapshots (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Financial
    net_apy DECIMAL(10, 4),
    nav_per_share DECIMAL(18, 18),
    yield_variance DECIMAL(10, 4),
    expense_ratio DECIMAL(10, 4),
    
    -- Liquidity
    tvl DECIMAL(30, 0),
    utilization_rate DECIMAL(5, 2),
    cash_drag DECIMAL(10, 4),
    redemption_liquidity DECIMAL(30, 0),
    
    -- Risk
    default_rate DECIMAL(5, 2),
    concentration_risk DECIMAL(5, 2),
    credit_rating VARCHAR(10),
    collateralization_ratio DECIMAL(5, 2),
    
    -- Compliance
    kyc_coverage DECIMAL(5, 2),
    whitelisted_wallets INTEGER,
    jurisdiction_count INTEGER,
    
    -- Impact
    industrial_growth DECIMAL(5, 2),
    value_add_ratio DECIMAL(5, 2),
    jobs_per_million INTEGER
);

CREATE INDEX idx_kpi_timestamp ON pool_kpi_snapshots(timestamp);
```

---

## Frontend Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    UJAMAA POOL DASHBOARD                         │
├─────────────────────────────────────────────────────────────────┤
│  [Overview] [Financial] [Liquidity] [Risk] [Compliance] [Impact]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    POOL HEALTH SCORE                      │  │
│  │                    ████████░░ 85% Good                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ TVL         │ │ Net APY     │ │ Utilization │ │ NAV       │ │
│  │ €50.0M      │ │ 10.5%       │ │ 87.5%       │ │ 1.0234    │ │
│  │ 🔹 +2.5%    │ │ 🔹 +0.3%    │ │ 🔸 -1.2%    │ │ 🔹 +2.3%  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
│                                                                  │
│  ┌─────────────────────────────┐ ┌────────────────────────────┐│
│  │   UTILIZATION TREND         │ │   RISK INDICATORS          ││
│  │   [████████████░░] 87.5%    │ │   Default Rate:   1.2% ✓   ││
│  │   Target: 85-92%            │ │   Concentration: 12% ✓     ││
│  │                             │ │   Collateral:   135% ✓     ││
│  └─────────────────────────────┘ └────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │                    ALERTS & NOTIFICATIONS                   ││
│  │  ⚠️ Utilization approaching upper limit (92%)              ││
│  │  ✓ All compliance requirements met (100% KYC)              ││
│  └────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Testing Strategy

### Unit Tests
- [ ] KPI calculation accuracy
- [ ] Edge cases (zero division, overflow)
- [ ] Data validation

### Integration Tests
- [ ] Blockchain data sync
- [ ] API endpoint responses
- [ ] Database persistence

### E2E Tests
- [ ] Dashboard renders correctly
- [ ] Real-time updates work
- [ ] Historical data displays

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **KPI Accuracy** | >99.5% | Comparison with manual calculations |
| **Update Latency** | <5 seconds | Blockchain event to dashboard |
| **Dashboard Load Time** | <2 seconds | Page load to first render |
| **Data Completeness** | 100% | All 18 KPIs populated |

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Oracle manipulation | High | Use Chainlink + backup oracles |
| Calculation errors | High | Double-check with off-chain service |
| Data sync delays | Medium | Implement retry logic + alerts |
| Frontend performance | Medium | Cache KPI data, lazy load |

---

## Next Steps

1. **Review and approve** this implementation plan
2. **Prioritize Phase 1** KPIs for MVP launch
3. **Assign developers** to each workstream
4. **Set up monitoring** for KPI accuracy
5. **Create test cases** for each KPI calculation

---

**Prepared by:** AI Architecture Assistant  
**Date:** March 21, 2026  
**Next Review:** March 28, 2026  
**Target Launch:** Phase 1 - April 4, 2026
