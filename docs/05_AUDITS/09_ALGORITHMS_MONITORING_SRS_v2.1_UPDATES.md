# Algorithm Specifications & Monitoring - SRS v2.1 Updates

**Date:** March 25, 2026  
**Phase:** P1 Complete  
**Status:** Ready for Implementation  

---

# Part 1: Algorithm Specifications 🆕

**Target:** `docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md`  
**Version Update:** v1.0 → v2.1  

## Summary

This document adds institutional architecture algorithms to the existing Algorithm Specifications document.

---

## 10. Pool Management Algorithms 🆕 (SRS v2.1)

### ALG-10-01-01: NAV Per Share Calculation

**Purpose:** Calculate Net Asset Value (NAV) per uLP share  

**Formula:**
```
NAV_per_share(t) = Total_Pool_Value(t) / Total_uLP_Shares
```

**Implementation:**
```python
from decimal import Decimal, ROUND_DOWN

def calculate_nav_per_share(
    total_pool_value: Decimal,
    total_shares: Decimal
) -> Decimal:
    """
    Calculate NAV per uLP share with 18 decimal precision.
    
    Args:
        total_pool_value: Total value of pool assets in EUROD (18 decimals)
        total_shares: Total uLP shares outstanding (18 decimals)
    
    Returns:
        NAV per share (18 decimals, rounded down)
    """
    if total_shares == 0:
        return Decimal("1.000000000000000000")  # Initial NAV
    
    nav = total_pool_value / total_shares
    
    # Round down to 18 decimals (conservative for investors)
    return nav.quantize(Decimal("0.000000000000000001"), rounding=ROUND_DOWN)

# Example usage:
# Pool Value: €10,523,456.70
# Total Shares: 10,000,000 uLP
# NAV = 10,523,456.70 / 10,000,000 = €1.05234567 per share
```

**Complexity:** O(1)  
**Precision:** 18 decimals (1e18)  
**Update Frequency:** Real-time (on deposits/redemptions), Daily (yield accrual)

---

### ALG-10-01-02: Daily Yield Accrual

**Purpose:** Calculate daily yield accrual for pool  

**Formula:**
```
daily_yield = principal × (APR / 365)
```

**Implementation:**
```python
from decimal import Decimal

def calculate_daily_yield(
    principal: Decimal,
    apr: Decimal  # Annual Percentage Rate (e.g., 0.12 for 12%)
) -> Decimal:
    """
    Calculate daily yield accrual.
    
    Args:
        principal: Total pool value in EUROD
        apr: Annual Percentage Rate (decimal)
    
    Returns:
        Daily yield in EUROD (2 decimals)
    """
    daily_rate = apr / Decimal("365")
    daily_yield = principal * daily_rate
    
    # Round to 2 decimals (euro cents)
    return daily_yield.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

# Example:
# Principal: €10,000,000
# APR: 12% (0.12)
# Daily Yield = 10,000,000 × (0.12 / 365) = €3,287.67
```

**Complexity:** O(1)  
**Precision:** 2 decimals (euro cents)  
**Update Frequency:** Daily (midnight UTC)

---

### ALG-10-02-01: uLP Deposit Calculation

**Purpose:** Calculate uLP tokens to mint on deposit  

**Formula:**
```
uLP_minted = (deposit_amount × 1e18) / NAV_per_share
```

**Implementation:**
```python
from decimal import Decimal

def calculate_ulp_minted(
    deposit_amount: Decimal,  # In EUROD (2 decimals)
    nav_per_share: Decimal    # In EUR (18 decimals)
) -> Decimal:
    """
    Calculate uLP tokens to mint for deposit.
    
    Args:
        deposit_amount: Amount of EUROD to deposit (2 decimals)
        nav_per_share: Current NAV per share (18 decimals)
    
    Returns:
        uLP tokens to mint (18 decimals)
    """
    # Convert deposit to 18 decimals for calculation
    deposit_wei = deposit_amount * Decimal("1e18")
    
    ulp_minted = deposit_wei / nav_per_share
    
    # Round down to 18 decimals (conservative for investor)
    return ulp_minted.quantize(Decimal("0.000000000000000001"), rounding=ROUND_DOWN)

# Example:
# Deposit: €1,000,000
# NAV: €1.05234567
# uLP Minted = (1,000,000 × 1e18) / 1.05234567 = 950,226.217421120000 uLP
```

**Complexity:** O(1)  
**Precision:** 18 decimals  
**Use Case:** Investor deposits EUROD → receives uLP

---

### ALG-10-02-02: uLP Redemption Calculation

**Purpose:** Calculate EUROD received on redemption  

**Formula:**
```
redemption_value = (uLP_amount × NAV_per_share) / 1e18
```

**Implementation:**
```python
from decimal import Decimal

def calculate_redemption_value(
    ulp_amount: Decimal,    # uLP tokens (18 decimals)
    nav_per_share: Decimal  # NAV per share (18 decimals)
) -> Decimal:
    """
    Calculate EUROD received on redemption.
    
    Args:
        ulp_amount: Amount of uLP to redeem (18 decimals)
        nav_per_share: Current NAV per share (18 decimals)
    
    Returns:
        EUROD received (2 decimals)
    """
    redemption_wei = ulp_amount * nav_per_share
    
    # Convert from 18 decimals to 2 decimals (euro cents)
    redemption_value = redemption_wei / Decimal("1e18")
    
    # Round down to 2 decimals (conservative for pool)
    return redemption_value.quantize(Decimal("0.01"), rounding=ROUND_DOWN)

# Example:
# Redeem: 100,000 uLP
# NAV: €1.05234567
# Redemption = (100,000 × 1.05234567) / 1 = €105,234.57
```

**Complexity:** O(1)  
**Precision:** 2 decimals (euro cents)  
**Use Case:** Investor redeems uLP → receives EUROD + yield

---

### ALG-10-03-01: Pool Diversification Check

**Purpose:** Verify pool meets diversification requirements  

**Rules:**
- Max 10% per single industrial
- Min 5 assets in pool
- Max 25% in single geography

**Implementation:**
```python
from decimal import Decimal
from typing import List, Dict

def check_diversification(
    pool_id: str,
    industrial: str,
    new_amount: Decimal,
    current_allocations: Dict[str, Decimal],  # industrial -> amount
    total_pool_value: Decimal
) -> tuple[bool, str]:
    """
    Check if new deployment meets diversification rules.
    
    Args:
        pool_id: Pool identifier
        industrial: Industrial identifier
        new_amount: Amount to deploy
        current_allocations: Current allocations by industrial
        total_pool_value: Total pool value
    
    Returns:
        (is_valid, error_message)
    """
    # Rule 1: Max 10% per industrial
    current_allocation = current_allocations.get(industrial, Decimal("0"))
    new_allocation = current_allocation + new_amount
    allocation_pct = (new_allocation * 100) / total_pool_value
    
    if allocation_pct > Decimal("10"):
        return (
            False,
            f"Would exceed 10% per industrial (current: {allocation_pct:.2f}%)"
        )
    
    # Rule 2: Min 5 assets (check after deployment)
    num_assets = len(current_allocations)
    if current_allocation == 0:  # New industrial
        num_assets += 1
    
    if num_assets < 5:
        return (
            False,
            f"Pool must have minimum 5 assets (current: {num_assets})"
        )
    
    # Rule 3: Max 25% per geography (requires geography mapping)
    # geography_allocations = get_geography_allocations(pool_id)
    # ... similar check
    
    return (True, "Diversification check passed")
```

**Complexity:** O(n) where n = number of industrials  
**Precision:** 2 decimals for percentages  
**Use Case:** Pool Manager deploys capital to industrial

---

### ALG-10-03-02: Concentration Risk Calculation

**Purpose:** Calculate pool concentration risk metric  

**Formula:**
```
Herfindahl-Hirschman Index (HHI) = Σ (allocation_pct_i)²
```

**Implementation:**
```python
from decimal import Decimal
from typing import List

def calculate_concentration_risk(
    allocations: List[Decimal]  # List of allocation percentages
) -> tuple[Decimal, str]:
    """
    Calculate concentration risk using HHI.
    
    Args:
        allocations: List of allocation percentages (sum to 100)
    
    Returns:
        (HHI, risk_level)
    
    HHI Interpretation:
        < 1000: Low concentration (diversified)
        1000-1800: Moderate concentration
        > 1800: High concentration
    """
    hhi = sum((pct ** 2) for pct in allocations)
    
    if hhi < 1000:
        risk_level = "LOW"
    elif hhi < 1800:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"
    
    return (hhi, risk_level)

# Example:
# Allocations: [20%, 20%, 20%, 20%, 20%]
# HHI = 20² + 20² + 20² + 20² + 20² = 2000
# Risk Level: HIGH (concentrated)
```

**Complexity:** O(n)  
**Precision:** 2 decimals  
**Use Case:** Risk monitoring, regulatory reporting

---

## 11. Compliance & Suitability Algorithms 🆕

### ALG-04-01-03: KYB Threshold Check

**Purpose:** Determine if KYB is required based on investment amount  

**Implementation:**
```python
from decimal import Decimal

KYB_THRESHOLD = Decimal("100000.00")  # €100K
INSTITUTIONAL_MINIMUM = Decimal("1000000.00")  # €1M

def check_kyb_requirement(
    investment_amount: Decimal,
    cumulative_30d: Decimal
) -> dict:
    """
    Check KYB requirements for investment.
    
    Args:
        investment_amount: Current investment amount
        cumulative_30d: Cumulative investments in last 30 days
    
    Returns:
        Dictionary with KYB requirements
    """
    total_exposure = investment_amount + cumulative_30d
    
    requires_kyb = total_exposure >= KYB_THRESHOLD
    requires_board_approval = total_exposure >= INSTITUTIONAL_MINIMUM
    
    return {
        "requires_kyb": requires_kyb,
        "requires_board_approval": requires_board_approval,
        "kyc_only": not requires_kyb,
        "tier": get_investor_tier(total_exposure)
    }

def get_investor_tier(total_exposure: Decimal) -> str:
    if total_exposure < KYB_THRESHOLD:
        return "RETAIL"
    elif total_exposure < INSTITUTIONAL_MINIMUM:
        return "INSTITUTIONAL"
    else:
        return "LARGE_INSTITUTIONAL"
```

**Complexity:** O(1)  
**Use Case:** Investor onboarding, compliance checks

---

### ALG-04-01-04: Jurisdiction Eligibility Check

**Purpose:** Verify if investor jurisdiction is allowed  

**Implementation:**
```python
STRICTEST_JURISDICTION_LIST = {
    "CU",  # Cuba - OFAC
    "IR",  # Iran - OFAC
    "KP",  # North Korea - OFAC
    "SY",  # Syria - OFAC
    "YE",  # Yemen - FATF High-Risk
    "MM",  # Myanmar - FATF High-Risk
    # ... (dynamic list)
}

TIER_1_JURISDICTIONS = {
    "DE", "FR", "IT", "ES",  # EU
    "US", "CA",  # North America
    "GB",  # UK
    "JP", "SG",  # Asia
    "AU", "NZ",  # Oceania
}

def check_jurisdiction_eligibility(
    country_code: str,
    product_type: str  # "ULP", "UAT"
) -> tuple[bool, str]:
    """
    Check if jurisdiction is eligible for product.
    
    Args:
        country_code: ISO 3166-1 alpha-2 country code
        product_type: Product type
    
    Returns:
        (is_eligible, reason)
    """
    country_code = country_code.upper()
    
    # Check strictest list (always blocked)
    if country_code in STRICTEST_JURISDICTION_LIST:
        return (False, "Jurisdiction is on blocked list")
    
    # Product-specific restrictions
    if product_type == "ULP":
        # uLP: Tier 3+4 blocked
        if not is_tier_1_or_2(country_code):
            return (False, "Jurisdiction not eligible for institutional product")
    
    return (True, "Jurisdiction eligible")
```

**Complexity:** O(1)  
**Use Case:** Investor onboarding, transfer validation

---

# Part 2: Monitoring Specification 🆕

**Target:** `docs/03_OPERATIONS/01_MONITORING_SPECIFICATION.md`  
**Version Update:** v1.0 → v2.1  

## Summary

This document adds institutional architecture metrics to the existing Monitoring Specification.

---

## 13. Institutional Architecture Metrics 🆕

### 13.1 uLP Token Metrics

**NAV Metrics:**
```prometheus
# HELP ulp_nav_per_share Current NAV per uLP share
# TYPE gauge
ulp_nav_per_share{pool_id="pool_industrie_001"} 1.05234567

# HELP ulp_total_shares Total uLP shares outstanding
# TYPE gauge
ulp_total_shares{pool_id="pool_industrie_001"} 10000000.00000000

# HELP ulp_total_pool_value Total pool value in EUROD
# TYPE gauge
ulp_total_pool_value{pool_id="pool_industrie_001"} 10523456.70

# HELP ulp_nav_last_update_timestamp Timestamp of last NAV update
# TYPE gauge
ulp_nav_last_update_timestamp 1711382400
```

**Deposit/Redeem Metrics:**
```prometheus
# HELP ulp_deposit_total Total EUROD deposited
# TYPE counter
ulp_deposit_total{pool_id="pool_industrie_001"} 15000000.00

# HELP ulp_deposit_count Number of deposits
# TYPE counter
ulp_deposit_count{pool_id="pool_industrie_001"} 25

# HELP ulp_redemption_total Total EUROD redeemed
# TYPE counter
ulp_redemption_total{pool_id="pool_industrie_001"} 5000000.00

# HELP ulp_redemption_count Number of redemptions
# TYPE counter
ulp_redemption_count{pool_id="pool_industrie_001"} 8

# HELP ulp_net_flow Net flow (deposits - redemptions)
# TYPE gauge
ulp_net_flow{pool_id="pool_industrie_001"} 10000000.00
```

**Yield Metrics:**
```prometheus
# HELP ulp_yield_accrued_total Total yield accrued since inception
# TYPE counter
ulp_yield_accrued_total{pool_id="pool_industrie_001"} 523456.70

# HELP ulp_yield_daily Daily yield accrual
# TYPE gauge
ulp_yield_daily{pool_id="pool_industrie_001"} 3287.67

# HELP ulp_apr_current Current Annual Percentage Rate
# TYPE gauge
ulp_apr_current{pool_id="pool_industrie_001"} 0.1234

# HELP ulp_yield_investor_total Total yield earned by investor
# TYPE counter
ulp_yield_investor_total{investor="0x742d..."} 52345.67
```

---

### 13.2 UJG Token Metrics

**Minting Metrics:**
```prometheus
# HELP ujg_total_minted Total UJG tokens minted
# TYPE counter
ujg_total_minted 15

# HELP ujg_total_value_minted Total value of UJG minted (EUR)
# TYPE counter
ujg_total_value_minted 30000000.00

# HELP ujg_outstanding_count UJG tokens currently outstanding (not redeemed)
# TYPE gauge
ujg_outstanding_count 10

# HELP ujg_outstanding_value Total value of outstanding UJG (EUR)
# TYPE gauge
ujg_outstanding_value 20000000.00
```

**Redemption/Liquidation Metrics:**
```prometheus
# HELP ujg_total_redeemed Total UJG tokens redeemed
# TYPE counter
ujg_total_redeemed 5

# HELP ujg_total_liquidated Total UJG tokens liquidated (default)
# TYPE counter
ujg_total_liquidated 0

# HELP ujg_default_rate Default rate (liquidated / minted)
# TYPE gauge
ujg_default_rate 0.00

# HELP ujg_average_time_to_redeem Average days to redemption
# TYPE gauge
ujg_average_time_to_redeem 365
```

**Collateral Metrics:**
```prometheus
# HELP ujg_collateral_value Total collateral value (EUR)
# TYPE gauge
ujg_collateral_value 20000000.00

# HELP ujg_collateral_coverage Collateral coverage ratio
# TYPE gauge
ujg_collateral_coverage 2.0

# HELP ujg_expiry_soon Count of UJG expiring within 30 days
# TYPE gauge
ujg_expiry_soon 2
```

---

### 13.3 Pool Management Metrics

**Diversification Metrics:**
```prometheus
# HELP pool_asset_count Number of assets in pool
# TYPE gauge
pool_asset_count{pool_id="pool_industrie_001"} 5

# HELP pool_concentration_max Maximum concentration (single industrial %)
# TYPE gauge
pool_concentration_max{pool_id="pool_industrie_001"} 20.0

# HELP pool_concentration_hhi Herfindahl-Hirschman Index
# TYPE gauge
pool_concentration_hhi{pool_id="pool_industrie_001"} 2000

# HELP pool_geography_concentration Max concentration by geography
# TYPE gauge
pool_geography_concentration{pool_id="pool_industrie_001"} 40.0
```

**Performance Metrics:**
```prometheus
# HELP pool_management_fee_total Total management fees collected
# TYPE counter
pool_management_fee_total{pool_id="pool_industrie_001"} 100000.00

# HELP pool_performance_fee_total Total performance fees collected
# TYPE counter
pool_performance_fee_total{pool_id="pool_industrie_001"} 104691.34

# HELP pool_irr Internal Rate of Return
# TYPE gauge
pool_irr{pool_id="pool_industrie_001"} 0.1234

# HELP pool_moic Multiple on Invested Capital
# TYPE gauge
pool_moic{pool_id="pool_industrie_001"} 1.05
```

---

### 13.4 Authentication Metrics

**SIWE Authentication Metrics:**
```prometheus
# HELP auth_login_success_total Successful login count
# TYPE counter
auth_login_success_total 1250

# HELP auth_login_failure_total Failed login count
# TYPE counter
auth_login_failure_total 45

# HELP auth_login_failure_rate Login failure rate
# TYPE gauge
auth_login_failure_rate 0.035

# HELP auth_nonce_generated_total Nonces generated
# TYPE counter
auth_nonce_generated_total 1500

# HELP auth_nonce_expired_total Expired nonces (not used)
# TYPE counter
auth_nonce_expired_total 250
```

**Session Metrics:**
```prometheus
# HELP auth_active_sessions Current active sessions
# TYPE gauge
auth_active_sessions 342

# HELP auth_sessions_max_concurrent Max concurrent sessions per user
# TYPE gauge
auth_sessions_max_concurrent{wallet="0x742d..."} 3

# HELP auth_session_timeout_idle_total Idle timeout events
# TYPE counter
auth_session_timeout_idle_total 125

# HELP auth_session_timeout_absolute_total Absolute timeout events
# TYPE counter
auth_session_timeout_absolute_total 89
```

**Token Metrics:**
```prometheus
# HELP auth_jwt_issued_total JWT tokens issued
# TYPE counter
auth_jwt_issued_total 2500

# HELP auth_jwt_refreshed_total JWT tokens refreshed
# TYPE counter
auth_jwt_refreshed_total 1800

# HELP auth_jwt_revoked_total JWT tokens revoked (logout)
# TYPE counter
auth_jwt_revoked_total 450

# HELP auth_jwt_validation_failed_total JWT validation failures
# TYPE counter
auth_jwt_validation_failed_total 78
```

---

### 13.5 Fireblocks Custody Metrics

**Vault Metrics:**
```prometheus
# HELP fireblocks_vault_balance Fireblocks vault balance
# TYPE gauge
fireblocks_vault_balance{asset="EUROD",vault="platform_treasury"} 5000000.00

# HELP fireblocks_vault_asset_count Number of assets in vault
# TYPE gauge
fireblocks_vault_asset_count{vault="platform_treasury"} 3
```

**Transaction Metrics:**
```prometheus
# HELP fireblocks_transaction_initiated_total Transactions initiated
# TYPE counter
fireblocks_transaction_initiated_total 45

# HELP fireblocks_transaction_completed_total Transactions completed
# TYPE counter
fireblocks_transaction_completed_total 42

# HELP fireblocks_transaction_pending_total Transactions pending approval
# TYPE gauge
fireblocks_transaction_pending_total 3

# HELP fireblocks_transaction_rejected_total Transactions rejected
# TYPE counter
fireblocks_transaction_rejected_total 0

# HELP fireblocks_transaction_value_total Total transaction value
# TYPE counter
fireblocks_transaction_value_total{asset="EUROD"} 8000000.00
```

**Multisig Metrics:**
```prometheus
# HELP fireblocks_multisig_approvals_total Multisig approvals
# TYPE counter
fireblocks_multisig_approvals_total 135

# HELP fireblocks_multisig_avg_approval_time Average approval time (seconds)
# TYPE gauge
fireblocks_multisig_avg_approval_time 7200
```

---

### 13.6 Bank Escrow Metrics

**Account Metrics:**
```prometheus
# HELP bank_escrow_balance Escrow account balance
# TYPE gauge
bank_escrow_balance{bank="BIIC (Banque Internationale pour l'Industrie et le Commerce)",account="investor_escrow"} 10000000.00

# HELP bank_escrow_account_count Number of escrow accounts
# TYPE gauge
bank_escrow_account_count 5
```

**Wire Transfer Metrics:**
```prometheus
# HELP bank_wire_transfer_initiated_total Wire transfers initiated
# TYPE counter
bank_wire_transfer_initiated_total 35

# HELP bank_wire_transfer_completed_total Wire transfers completed
# TYPE counter
bank_wire_transfer_completed_total 32

# HELP bank_wire_transfer_pending_total Wire transfers pending
# TYPE gauge
bank_wire_transfer_pending_total 3

# HELP bank_wire_transfer_value_total Total wire transfer value
# TYPE counter
bank_wire_transfer_value_total{direction="inbound"} 15000000.00
bank_wire_transfer_value_total{direction="outbound"} 5000000.00

# HELP bank_wire_transfer_avg_settlement_time Average settlement time (hours)
# TYPE gauge
bank_wire_transfer_avg_settlement_time 24
```

**Mobile Money Metrics:**
```prometheus
# HELP mobile_money_deposit_total Mobile money deposits
# TYPE counter
mobile_money_deposit_total{provider="M-PESA"} 150

# HELP mobile_money_deposit_value_total Mobile money deposit value
# TYPE counter
mobile_money_deposit_value_total{provider="M-PESA"} 750000.00

# HELP mobile_money_transaction_success_rate Success rate
# TYPE gauge
mobile_money_transaction_success_rate 0.98
```

---

## 14. Alert Rules 🆕

### 14.1 uLP Token Alerts

```yaml
# alerts/ulp_alerts.yaml
groups:
  - name: ulp_token
    rules:
      - alert: ULPPoolValueDeviation
        expr: |
          abs(ulp_total_pool_value - expected_pool_value) / expected_pool_value > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Pool value deviation > 5%"
          description: "Pool {{ $labels.pool_id }} value deviates by {{ $value | humanizePercentage }}"
      
      - alert: ULPNavStale
        expr: |
          (time() - ulp_nav_last_update_timestamp) > 86400
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "NAV not updated in 24 hours"
          description: "Pool {{ $labels.pool_id }} NAV is stale"
      
      - alert: ULPNetFlowNegative
        expr: |
          rate(ulp_net_flow[1h]) < -100000
        for: 30m
        labels:
          severity: warning
        annotations:
          summary: "Large net outflow from pool"
          description: "Pool {{ $labels.pool_id }} experiencing outflows"
```

### 14.2 UJG Token Alerts

```yaml
# alerts/ujg_alerts.yaml
groups:
  - name: ujg_token
    rules:
      - alert: UJGExpiringSoon
        expr: |
          ujg_expiry_soon > 0
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "UJG tokens expiring within 30 days"
          description: "{{ $value }} UJG tokens expiring soon"
      
      - alert: UJGDefaultDetected
        expr: |
          rate(ujg_total_liquidated[1d]) > 0
        for: 0m
        labels:
          severity: critical
        annotations:
          summary: "UJG default/liquidation detected"
          description: "{{ $value }} UJG tokens liquidated"
      
      - alert: UJGCollateralCoverageLow
        expr: |
          ujg_collateral_coverage < 1.5
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Collateral coverage below 1.5x"
          description: "Coverage ratio: {{ $value }}"
```

### 14.3 Authentication Alerts

```yaml
# alerts/auth_alerts.yaml
groups:
  - name: authentication
    rules:
      - alert: AuthHighFailureRate
        expr: |
          rate(auth_login_failure_total[1h]) / rate(auth_nonce_generated_total[1h]) > 0.1
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "High authentication failure rate"
          description: "Failure rate: {{ $value | humanizePercentage }}"
      
      - alert: AuthBruteForceDetected
        expr: |
          rate(auth_login_failure_total{wallet="0x742d..."}[5m]) > 10
        for: 0m
        labels:
          severity: critical
        annotations:
          summary: "Possible brute force attack"
          description: "Wallet {{ $labels.wallet }} has {{ $value }} failures in 5m"
      
      - alert: AuthSessionLimitExceeded
        expr: |
          auth_sessions_max_concurrent > 5
        for: 0m
        labels:
          severity: warning
        annotations:
          summary: "User exceeded max concurrent sessions"
          description: "Wallet {{ $labels.wallet }} has {{ $value }} sessions"
```

### 14.4 Fireblocks Alerts

```yaml
# alerts/fireblocks_alerts.yaml
groups:
  - name: fireblocks
    rules:
      - alert: FireblocksTransactionPending
        expr: |
          fireblocks_transaction_pending_total > 5
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Many transactions pending approval"
          description: "{{ $value }} transactions pending"
      
      - alert: FireblocksVaultBalanceLow
        expr: |
          fireblocks_vault_balance{asset="EUROD"} < 1000000
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Fireblocks vault balance low"
          description: "Balance: €{{ $value }}"
```

---

## 15. Grafana Dashboards 🆕

### 15.1 Institutional Dashboard

**Dashboard JSON:**
```json
{
  "dashboard": {
    "title": "Institutional Architecture Overview",
    "panels": [
      {
        "title": "uLP NAV Per Share",
        "targets": [
          {
            "expr": "ulp_nav_per_share",
            "legendFormat": "{{pool_id}}"
          }
        ]
      },
      {
        "title": "Pool Total Value Locked",
        "targets": [
          {
            "expr": "ulp_total_pool_value"
          }
        ]
      },
      {
        "title": "uLP Deposits vs Redemptions",
        "targets": [
          {
            "expr": "rate(ulp_deposit_count[1h])",
            "legendFormat": "Deposits"
          },
          {
            "expr": "rate(ulp_redemption_count[1h])",
            "legendFormat": "Redemptions"
          }
        ]
      },
      {
        "title": "UJG Outstanding",
        "targets": [
          {
            "expr": "ujg_outstanding_count"
          }
        ]
      },
      {
        "title": "Active Sessions",
        "targets": [
          {
            "expr": "auth_active_sessions"
          }
        ]
      }
    ]
  }
}
```

---

**Document End**

**Merge Instructions:**
1. Add algorithms to `01_ALGORITHM_SPECIFICATIONS.md` as Sections 10-11
2. Add monitoring metrics to `01_MONITORING_SPECIFICATION.md` as Sections 13-15
3. Update version numbers (v2.1)
4. Update dates (March 25, 2026)
5. Test all algorithm implementations
6. Deploy Prometheus alert rules
