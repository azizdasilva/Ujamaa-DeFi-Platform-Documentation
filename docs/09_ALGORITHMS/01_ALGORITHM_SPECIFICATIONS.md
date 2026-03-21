# Algorithm Specifications

## Ujamaa DeFi Platform - MVP Institutional Architecture

**Version:** 1.0
**Date:** March 17, 2026
**Author:** Aziz Da Silva - Lead Architect
**Classification:** Internal / Engineering

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 17, 2026 | Aziz Da Silva - Lead Architect | Initial release with MVP-2 algorithms |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Algorithm Numbering Convention](#2-algorithm-numbering-convention)
3. [Asset Risk Assessment Algorithms](#3-asset-risk-assessment-algorithms)
4. [Fraud Detection Algorithms](#4-fraud-detection-algorithms)
5. [Yield & NAV Calculation Algorithms](#5-yield--nav-calculation-algorithms)
6. [Asset Tokenization Algorithms](#6-asset-tokenization-algorithms)
7. [Pool Management Algorithms](#7-pool-management-algorithms)
8. [Compliance & Suitability Algorithms](#8-compliance--suitability-algorithms)
9. [Gateway & Pricing Algorithms](#9-gateway--pricing-algorithms)
10. [Bank Escrow & Payment Algorithms](#10-bank-escrow--payment-algorithms)
11. [Cryptographic & Security Algorithms](#11-cryptographic--security-algorithms)
12. [Performance & Optimization Algorithms](#12-performance--optimization-algorithms)

---

## 1. Overview

This document specifies all computational algorithms used in the Ujamaa DeFi Platform MVP-2. Each algorithm is traceable to requirements in the Software Requirements Specification (SRS) v2.0 and follows the platform's numbering convention aligned with the EPIC/User Story structure.

### 1.1 Purpose

This document serves as the authoritative reference for:

- **Backend Engineers** implementing risk scoring, fraud detection, and yield calculation services
- **Smart Contract Developers** implementing on-chain computation in Solidity
- **Data Scientists** training and validating ML models (Scikit-learn, PyTorch, TensorFlow)
- **Compliance Officers** verifying regulatory adherence (MiCA, FATF, SEC)
- **Security Auditors** conducting algorithm audits and validation
- **QA Engineers** writing test cases and validation suites

### 1.2 Scope

**In Scope:**
- All algorithms with computational complexity beyond simple arithmetic
- Machine learning models for fraud detection and risk assessment
- Financial mathematics for yield, NAV, and valuation
- Cryptographic algorithms for security and compliance
- Optimization algorithms for pool management and asset allocation

**Out of Scope:**
- Simple CRUD operations (create, read, update, delete)
- Basic data validation (format checking, null checks)
- UI rendering logic (CSS, layout calculations)
- Infrastructure automation (Terraform, Kubernetes configs)

---

## 2. Algorithm Numbering Convention

Algorithms are numbered to maintain traceability with the SRS EPIC structure:

```
ALG-EPIC-STORY-SEQUENCE

Where:
  EPIC      = Parent EPIC number (1-10)
  STORY     = User Story number within EPIC (1-5)
  SEQUENCE  = Algorithm sequence number (01-99)
```

**Example:** `ALG-04-01-01` = EPIC 4 (Asset Risk Assessment), User Story 4.1, Algorithm 01

### 2.1 Algorithm Categories

| Category | EPIC Range | Description |
|----------|------------|-------------|
| **Risk Assessment** | EPIC 4 | Asset risk scoring, rating calculation, benchmark analysis |
| **Fraud Detection** | EPIC 7 | Anomaly detection, wash trading, structuring detection |
| **Yield & NAV** | EPIC 10 | NAV calculation, yield accrual, distribution |
| **Asset Tokenization** | EPIC 5 | UGT token, Industrial Gateway, asset certification |
| **Pool Management** | EPIC 10 | Diversification, allocation, rebalancing |
| **Compliance** | EPIC 4, 7 | Suitability checks, jurisdiction filtering |
| **Gateway & Pricing** | EPIC 3 | Price feed aggregation, deviation detection |
| **Cryptographic** | EPIC 11 | Hash functions, encryption, Merkle trees |
| **Performance** | EPIC 9 | Caching, optimization, autoscaling |

---

## 3. Asset Risk Assessment Algorithms

### 3.1 Risk Score Calculation

**Algorithm ID:** `ALG-04-01-01`
**SRS Reference:** EPIC 4, User Story 4.1 (Automated Risk Score Calculation)
**Purpose:** Calculate composite risk score (0-100) for tokenized assets
**Implementation:** Python (Scikit-learn), PostgreSQL stored procedures

#### 3.1.1 Input Parameters

| Parameter | Type | Weight | Source |
|-----------|------|--------|--------|
| `financial_strength` | float (0-100) | 20% | Audited financial statements |
| `profitability` | float (0-100) | 15% | Income statements (3-year avg) |
| `cash_flow_stability` | float (0-100) | 15% | Cash flow statements |
| `leverage` | float (0-100) | 10% | Balance sheet ratios |
| `management_quality` | float (0-100) | 10% | Analyst assessment |
| `industry_position` | float (0-100) | 10% | Market share data |
| `operational_risk` | float (0-100) | 10% | Business model analysis |
| `jurisdiction_risk` | float (0-100) | 5% | Sovereign credit ratings |
| `regulatory_risk` | float (0-100) | 3% | Regulatory framework analysis |
| `market_risk` | float (0-100) | 2% | Economic indicators |

#### 3.1.2 Calculation Formula

```python
def calculate_risk_score(asset: Asset) -> float:
    """
    Calculate composite risk score (0-100).
    Higher score = Higher risk of default.

    Args:
        asset: Asset object with normalized factor scores (0-100)

    Returns:
        Composite risk score (0-100)
    """

    # Quantitative factors (60% total weight)
    quantitative_score = (
        asset.financial_strength * 0.20 +
        asset.profitability * 0.15 +
        asset.cash_flow_stability * 0.15 +
        asset.leverage * 0.10
    )

    # Qualitative factors (30% total weight)
    qualitative_score = (
        asset.management_quality * 0.10 +
        asset.industry_position * 0.10 +
        asset.operational_risk * 0.10
    )

    # External factors (10% total weight)
    external_score = (
        asset.jurisdiction_risk * 0.05 +
        asset.regulatory_risk * 0.03 +
        asset.market_risk * 0.02
    )

    # Composite score
    total_score = quantitative_score + qualitative_score + external_score

    return min(100.0, max(0.0, total_score))
```

#### 3.1.3 Rating Assignment

```python
def score_to_rating(score: float) -> str:
    """
    Convert risk score to letter rating.

    Args:
        score: Risk score (0-100)

    Returns:
        Letter rating (AAA, A, BBB, BB, B, CCC, D)
    """
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

#### 3.1.4 Complexity

- **Time Complexity:** O(1) - Fixed number of arithmetic operations
- **Space Complexity:** O(1) - Constant memory usage

---

### 3.2 Rating Modifier Calculation

**Algorithm ID:** `ALG-04-01-02`
**SRS Reference:** EPIC 4, User Story 4.1
**Purpose:** Calculate rating modifiers (+/-) based on score position within rating band

#### 3.2.1 Calculation Logic

```python
def calculate_rating_modifier(score: float, rating: str) -> str:
    """
    Calculate rating modifier (+, -, or none).

    Args:
        score: Risk score (0-100)
        rating: Base letter rating

    Returns:
        Rating with modifier (e.g., 'A+', 'BBB-')
    """
    rating_ranges = {
        'AAA': (0, 10),
        'A': (10, 20),
        'BBB': (20, 35),
        'BB': (35, 50),
        'B': (50, 65),
        'CCC': (65, 80),
        'D': (80, 100)
    }

    min_score, max_score = rating_ranges[rating]
    range_size = max_score - min_score
    position = (score - min_score) / range_size

    if rating == 'AAA' or rating == 'D':
        return rating  # No modifiers for extreme ratings

    if position < 0.33:
        return f"{rating}+"
    elif position > 0.67:
        return f"{rating}-"
    else:
        return rating
```

---

### 3.3 Benchmark Comparison Algorithm

**Algorithm ID:** `ALG-04-04-01`
**SRS Reference:** EPIC 4, User Story 4.4 (Pre-2026 Benchmark Data Collection)
**Purpose:** Compare asset rating against asset class and jurisdiction benchmarks

#### 3.3.1 Calculation

```python
def calculate_benchmark_percentile(
    asset_rating: str,
    asset_class: str,
    jurisdiction: str
) -> dict:
    """
    Calculate asset's percentile rank within benchmarks.

    Args:
        asset_rating: Asset's letter rating
        asset_class: Asset class (INVOICE, REAL_ESTATE, etc.)
        jurisdiction: ISO country code

    Returns:
        Dictionary with percentile ranks
    """
    # Load benchmark data from PostgreSQL
    benchmarks = load_benchmarks(asset_class, jurisdiction)

    # Convert ratings to numeric scores for comparison
    rating_scores = {
        'AAA': 1, 'A': 2, 'BBB': 3, 'BB': 4, 'B': 5, 'CCC': 6, 'D': 7
    }

    asset_score = rating_scores[asset_rating]

    # Calculate percentiles
    asset_class_percentile = calculate_percentile(
        asset_score,
        benchmarks['asset_class_scores']
    )

    jurisdiction_percentile = calculate_percentile(
        asset_score,
        benchmarks['jurisdiction_scores']
    )

    return {
        'asset_class_percentile': asset_class_percentile,
        'jurisdiction_percentile': jurisdiction_percentile,
        'overall_percentile': (asset_class_percentile + jurisdiction_percentile) / 2
    }
```

---

## 4. Fraud Detection Algorithms

### 4.1 Anomaly Detection (Isolation Forest)

**Algorithm ID:** `ALG-07-01-01`
**SRS Reference:** EPIC 7, User Story 7.1 (Anomaly Detection for Suspicious Transactions)
**Purpose:** Detect anomalous transaction patterns using machine learning
**Implementation:** Scikit-learn Isolation Forest

#### 4.1.1 Feature Engineering

```python
def extract_transaction_features(transaction: Transaction) -> np.ndarray:
    """
    Extract features for anomaly detection model.

    Args:
        transaction: Transaction object

    Returns:
        Feature vector (numpy array)
    """
    features = [
        transaction.amount,                      # Absolute amount
        transaction.amount / user.avg_amount,    # Relative to user average
        transaction.frequency_24h,               # Transactions in last 24h
        transaction.counterparty_diversity,      # Unique counterparties
        transaction.hour_of_day,                 # Time feature (0-23)
        transaction.day_of_week,                 # Day feature (0-6)
        transaction.geolocation_distance,        # Distance from usual location
        transaction.device_risk_score,           # Device fingerprint risk
        transaction.ip_risk_score,               # IP address risk
        transaction.velocity_score               # Transaction velocity
    ]

    return np.array(features).reshape(1, -1)
```

#### 4.1.2 Anomaly Scoring

```python
from sklearn.ensemble import IsolationForest

class TransactionAnomalyDetector:
    def __init__(self, contamination: float = 0.01):
        """
        Initialize Isolation Forest model.

        Args:
            contamination: Expected proportion of anomalies (default 1%)
        """
        self.model = IsolationForest(
            n_estimators=100,
            contamination=contamination,
            random_state=42,
            n_jobs=-1
        )

    def fit(self, historical_transactions: List[Transaction]):
        """Train model on historical data."""
        X = np.array([
            extract_transaction_features(tx)
            for tx in historical_transactions
        ])
        self.model.fit(X)

    def score(self, transaction: Transaction) -> float:
        """
        Calculate anomaly score for transaction.

        Args:
            transaction: Transaction to score

        Returns:
            Anomaly score (-1 to 1, lower = more anomalous)
        """
        features = extract_transaction_features(transaction)
        score = self.model.decision_function(features)[0]

        # Convert to 0-1 scale (higher = more anomalous)
        normalized_score = 1 - (score + 1) / 2

        return normalized_score

    def is_anomalous(self, transaction: Transaction, threshold: float = 0.95) -> bool:
        """
        Determine if transaction is anomalous.

        Args:
            transaction: Transaction to check
            threshold: Score threshold (default top 5%)

        Returns:
            True if anomalous
        """
        return self.score(transaction) > threshold
```

#### 4.1.3 Complexity

- **Training Time:** O(n * m * log(n)) where n=samples, m=features
- **Prediction Time:** O(1) per transaction
- **Space Complexity:** O(n * m) for model storage

---

### 4.2 Wash Trading Detection (LSTM)

**Algorithm ID:** `ALG-07-02-01`
**SRS Reference:** EPIC 7, User Story 7.2 (Wash Trading Detection)
**Purpose:** Detect circular trading patterns using deep learning
**Implementation:** PyTorch LSTM

#### 4.2.1 Pattern Detection

```python
import torch
import torch.nn as nn

class WashTradingDetector(nn.Module):
    def __init__(self, input_size: int = 10, hidden_size: int = 64, num_layers: int = 2):
        """
        Initialize LSTM model for wash trading detection.

        Args:
            input_size: Number of input features
            hidden_size: LSTM hidden layer size
            num_layers: Number of LSTM layers
        """
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=0.3
        )
        self.fc = nn.Linear(hidden_size, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass.

        Args:
            x: Input tensor (batch_size, sequence_length, input_size)

        Returns:
            Probability of wash trading (0-1)
        """
        lstm_out, _ = self.lstm(x)
        last_output = lstm_out[:, -1, :]
        probability = self.sigmoid(self.fc(last_output))
        return probability

    def detect_wash_trading(
        self,
        transactions: List[Transaction],
        wallet_cluster: WalletCluster
    ) -> float:
        """
        Detect wash trading in transaction sequence.

        Detection rule: Same wallet (or clustered wallets) buys and sells
        same token within 24 hours with >80% price match.

        Args:
            transactions: Transaction sequence
            wallet_cluster: Wallet cluster analysis

        Returns:
            Wash trading probability (0-1)
        """
        # Extract sequence features
        features = []
        for tx in transactions[-100:]:  # Last 100 transactions
            feature_vector = [
                tx.amount,
                tx.price,
                tx.timestamp_hour,
                1 if tx.type == 'BUY' else 0,
                wallet_cluster.get_cluster_id(tx.wallet),
                tx.token_id,
                # ... additional features
            ]
            features.append(feature_vector)

        # Convert to tensor
        x = torch.FloatTensor(features).unsqueeze(0)

        # Predict
        with torch.no_grad():
            probability = self.forward(x)[0][0].item()

        return probability
```

#### 4.2.2 Cluster Analysis

```python
def identify_wallet_clusters(transactions: List[Transaction]) -> Dict[str, int]:
    """
    Identify wallets controlled by same entity.

    Clustering criteria:
    - Shared funding source
    - Same IP address
    - Same device fingerprint
    - Transaction timing correlation

    Args:
        transactions: Transaction history

    Returns:
        Dictionary mapping wallet -> cluster_id
    """
    # Build graph
    graph = nx.Graph()

    for tx in transactions:
        graph.add_node(tx.wallet)

        # Add edges for shared attributes
        if tx.funding_source:
            graph.add_edge(tx.wallet, f"source:{tx.funding_source}")
        if tx.ip_address:
            graph.add_edge(tx.wallet, f"ip:{tx.ip_address}")
        if tx.device_id:
            graph.add_edge(tx.wallet, f"device:{tx.device_id}")

    # Find connected components (clusters)
    clusters = list(nx.connected_components(graph))

    # Map wallets to cluster IDs
    wallet_to_cluster = {}
    for cluster_id, cluster in enumerate(clusters):
        for wallet in cluster:
            if wallet.startswith('0x'):  # Only actual wallets
                wallet_to_cluster[wallet] = cluster_id

    return wallet_to_cluster
```

---

### 4.3 Structuring Detection (Rule-Based)

**Algorithm ID:** `ALG-07-03-01`
**SRS Reference:** EPIC 7, User Story 7.3 (Structuring Detection / Smurfing)
**Purpose:** Detect transaction structuring to avoid reporting thresholds
**Implementation:** Apache Flink CEP (Complex Event Processing)

#### 4.3.1 Detection Rules

```python
from pyflink.datastream import StreamExecutionEnvironment
from pyflink.table import StreamTableEnvironment

def create_structuring_detection_pattern():
    """
    Define Flink CEP pattern for structuring detection.

    Pattern: Multiple transactions from same wallet totaling >$10,000
    within 24 hours, where each individual transaction <$3,000.
    """
    pattern = (
        Pattern
        .begin('start')
        .where(lambda x: x.amount < 3000)  # Below CTR threshold
        .times(2, 5)  # 2 to 5 transactions
        .within(hours(24))  # Within 24 hours
        .where(lambda x: x.cumulative_sum > 10000)  # Total >$10,000
    )

    return pattern

def detect_structuring(transactions: DataStream) -> DataStream:
    """
    Detect structuring patterns in real-time.

    Args:
        transactions: Transaction data stream

    Returns:
        Alert data stream
    """
    env = StreamExecutionEnvironment.get_execution_environment()
    t_env = StreamTableEnvironment.create(env)

    # Register transaction stream
    t_env.create_temporary_view('transactions', transactions)

    # Apply CEP pattern
    pattern = create_structuring_detection_pattern()

    alerts = CEP.pattern(
        t_env.from_path('transactions'),
        pattern
    ).select(lambda x: {
        'wallet': x['start'].wallet,
        'total_amount': x['cumulative_sum'],
        'transaction_count': x['count'],
        'time_window': x['time_window'],
        'alert_type': 'STRUCTURING',
        'severity': 'HIGH'
    })

    return alerts
```

---

## 5. Yield & NAV Calculation Algorithms

### 5.1 NAV Per Share Calculation

**Algorithm ID:** `ALG-10-01-01`
**SRS Reference:** EPIC 10, User Story 10.1 (Ujamaa Pool Token (UPT) Deposit)
**Purpose:** Calculate Net Asset Value per Ujamaa Pool Token (UPT) share
**Implementation:** Solidity (on-chain), Python (off-chain verification)

#### 5.1.1 On-Chain Calculation (Solidity)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NAVCalculator
 * @dev Calculate NAV per Ujamaa Pool Token (UPT) share (18 decimal precision)
 */
contract NAVCalculator {
    using SafeMath for uint256;

    // Precision: 18 decimals
    uint256 private constant PRECISION = 1e18;

    /**
     * @dev Calculate NAV per share
     *
     * Formula: NAV = Total Pool Value / Total UPT Shares
     *
     * @param totalPoolValue Total value of pool assets (in Ujamaa Euro (UJEUR), 18 decimals)
     * @param totalShares Total UPT tokens in circulation (18 decimals)
     * @return navPerShare Net Asset Value per share (18 decimals)
     */
    function calculateNAVPerShare(
        uint256 totalPoolValue,
        uint256 totalShares
    ) external pure returns (uint256 navPerShare) {
        require(totalShares > 0, "No shares outstanding");

        // NAV = (Total Pool Value * PRECISION) / Total Shares
        navPerShare = totalPoolValue.mul(PRECISION).div(totalShares);

        return navPerShare;
    }

    /**
     * @dev Calculate UPT tokens to mint on deposit
     *
     * Formula: UPT Amount = Ujamaa Euro (UJEUR) Deposit / NAV Per Share
     *
     * @param eurcAmount Ujamaa Euro (UJEUR) deposit amount (18 decimals)
     * @param navPerShare Current NAV per share (18 decimals)
     * @return ulpAmount UPT tokens to mint (18 decimals)
     */
    function calculateULPMintAmount(
        uint256 eurcAmount,
        uint256 navPerShare
    ) external pure returns (uint256 ulpAmount) {
        require(navPerShare > 0, "Invalid NAV");

        // UPT = (Ujamaa Euro (UJEUR) * PRECISION) / NAV
        ulpAmount = eurcAmount.mul(PRECISION).div(navPerShare);

        return ulpAmount;
    }

    /**
     * @dev Calculate Ujamaa Euro (UJEUR) to receive on redemption
     *
     * Formula: Ujamaa Euro (UJEUR) = UPT Shares * NAV Per Share
     *
     * @param ulpAmount UPT tokens to redeem (18 decimals)
     * @param navPerShare Current NAV per share (18 decimals)
     * @return eurcAmount Ujamaa Euro (UJEUR) to receive (18 decimals)
     */
    function calculateEURCRedemption(
        uint256 ulpAmount,
        uint256 navPerShare
    ) external pure returns (uint256 eurcAmount) {
        // Ujamaa Euro (UJEUR) = (UPT * NAV) / PRECISION
        eurcAmount = ulpAmount.mul(navPerShare).div(PRECISION);

        return eurcAmount;
    }
}
```

#### 5.1.2 Off-Chain Verification (Python)

```python
from decimal import Decimal, ROUND_DOWN

PRECISION = Decimal('1e18')

def calculate_nav_per_share(
    total_pool_value: int,
    total_shares: int
) -> int:
    """
    Calculate NAV per Ujamaa Pool Token (UPT) share.

    Args:
        total_pool_value: Total pool value in Ujamaa Euro (UJEUR) (18 decimals)
        total_shares: Total UPT shares outstanding (18 decimals)

    Returns:
        NAV per share (18 decimals)
    """
    if total_shares == 0:
        raise ValueError("No shares outstanding")

    pool_value = Decimal(total_pool_value)
    shares = Decimal(total_shares)

    nav = (pool_value * PRECISION) / shares

    return int(nav.quantize(Decimal('1'), rounding=ROUND_DOWN))


def calculate_ulp_mint_amount(
    eurc_amount: int,
    nav_per_share: int
) -> int:
    """
    Calculate UPT tokens to mint on Ujamaa Euro (UJEUR) deposit.

    Args:
        eurc_amount: Ujamaa Euro (UJEUR) deposit (18 decimals)
        nav_per_share: Current NAV per share (18 decimals)

    Returns:
        UPT tokens to mint (18 decimals)
    """
    if nav_per_share == 0:
        raise ValueError("Invalid NAV")

    Ujamaa Euro (UJEUR) = Decimal(eurc_amount)
    nav = Decimal(nav_per_share)

    UPT = (Ujamaa Euro (UJEUR) * PRECISION) / nav

    return int(UPT.quantize(Decimal('1'), rounding=ROUND_DOWN))


def calculate_eurc_redemption(
    ulp_amount: int,
    nav_per_share: int
) -> int:
    """
    Calculate Ujamaa Euro (UJEUR) to receive on UPT redemption.

    Args:
        ulp_amount: UPT tokens to redeem (18 decimals)
        nav_per_share: Current NAV per share (18 decimals)

    Returns:
        Ujamaa Euro (UJEUR) to receive (18 decimals)
    """
    UPT = Decimal(ulp_amount)
    nav = Decimal(nav_per_share)

    Ujamaa Euro (UJEUR) = (UPT * nav) / PRECISION

    return int(Ujamaa Euro (UJEUR).quantize(Decimal('1'), rounding=ROUND_DOWN))
```

#### 5.1.3 Example Calculation

```
Initial State:
  - Total Pool Value: 1,000,000 Ujamaa Euro (UJEUR) (€1M)
  - Total UPT Shares: 1,000,000 (1M shares)
  - NAV Per Share: 1.000000000000000000 Ujamaa Euro (UJEUR)

After Yield Accrual (5% APY, 1 year):
  - Total Pool Value: 1,050,000 Ujamaa Euro (UJEUR) (€1.05M)
  - Total UPT Shares: 1,000,000 (unchanged)
  - NAV Per Share: 1.050000000000000000 Ujamaa Euro (UJEUR) (+5%)

Investor Redemption:
  - Investor holds: 10,000 UPT shares
  - Ujamaa Euro (UJEUR) Received: 10,000 × 1.05 = 10,500 Ujamaa Euro (UJEUR)
  - Yield Earned: €500 (5% return)
```

---

### 5.2 Yield Accrual Calculation

**Algorithm ID:** `ALG-10-04-01`
**SRS Reference:** EPIC 10, User Story 10.4 (Yield Accrual)
**Purpose:** Calculate yield accrued from industrial repayments
**Implementation:** Python, Solidity

#### 5.2.1 Daily Yield Accrual

```python
from decimal import Decimal
from datetime import datetime, timedelta

def calculate_yield_accrual(
    principal: int,
    annual_rate: Decimal,
    days: int,
    day_count_convention: str = 'ACT/365'
) -> int:
    """
    Calculate yield accrued over time.

    Args:
        principal: Principal amount (18 decimals)
        annual_rate: Annual interest rate (e.g., Decimal('0.08') for 8%)
        days: Number of days for accrual
        day_count_convention: Day count convention (ACT/365, ACT/360, 30/360)

    Returns:
        Accrued yield (18 decimals)
    """
    principal_dec = Decimal(principal)

    # Day count fraction
    if day_count_convention == 'ACT/365':
        year_fraction = Decimal(days) / Decimal('365')
    elif day_count_convention == 'ACT/360':
        year_fraction = Decimal(days) / Decimal('360')
    elif day_count_convention == '30/360':
        year_fraction = Decimal(min(days, 30)) / Decimal('360')
    else:
        raise ValueError(f"Unknown day count convention: {day_count_convention}")

    # Accrued yield = Principal × Rate × Time
    accrued_yield = principal_dec * annual_rate * year_fraction

    return int(accrued_yield.quantize(Decimal('1'), rounding=ROUND_DOWN))


def calculate_pool_yield(
    pool_financings: List[Financing],
    as_of_date: datetime
) -> dict:
    """
    Calculate total yield accrued for liquidity pool.

    Args:
        pool_financings: List of industrial financings in pool
        as_of_date: Calculation date

    Returns:
        Dictionary with yield breakdown
    """
    total_principal = Decimal('0')
    total_accrued_yield = Decimal('0')

    for financing in pool_financings:
        days_accrued = (as_of_date - financing.start_date).days

        principal = Decimal(financing.principal)
        rate = financing.annual_rate

        accrued = calculate_yield_accrual(
            principal=int(principal),
            annual_rate=rate,
            days=days_accrued
        )

        total_principal += principal
        total_accrued_yield += Decimal(accrued)

    # Calculate blended APY
    if total_principal > 0:
        days_total = (as_of_date - min(f.start_date for f in pool_financings)).days
        blended_apr = (total_accrued_yield / total_principal) * (Decimal('365') / Decimal(days_total))
    else:
        blended_apr = Decimal('0')

    return {
        'total_principal': int(total_principal),
        'total_accrued_yield': int(total_accrued_yield),
        'blended_apr': float(blended_apr),
        'financing_count': len(pool_financings)
    }
```

---

### 5.3 Yield Distribution Calculation

**Algorithm ID:** `ALG-10-04-02`
**SRS Reference:** EPIC 10, User Story 10.4
**Purpose:** Calculate pro-rata yield distribution to UPT holders
**Implementation:** Solidity

#### 5.3.1 Distribution Logic

```solidity
/**
 * @dev Distribute yield to UPT holders (via NAV increase)
 *
 * In the value-accrual model, yield is NOT distributed as additional tokens.
 * Instead, NAV per share increases, benefiting all holders proportionally.
 *
 * @param totalYield Total yield to distribute (Ujamaa Euro (UJEUR), 18 decimals)
 * @param totalPoolValue Current total pool value (Ujamaa Euro (UJEUR), 18 decimals)
 * @return newPoolValue Updated pool value after yield addition
 */
function distributeYield(
    uint256 totalYield,
    uint256 totalPoolValue
) external returns (uint256 newPoolValue) {
    // Add yield to pool value
    newPoolValue = totalPoolValue.add(totalYield);

    // Update state
    poolValue = newPoolValue;

    // Emit event
    emit YieldDistributed(totalYield, block.timestamp);

    return newPoolValue;
}

/**
 * @dev Calculate individual investor's yield share
 *
 * @param investorShares Investor's UPT balance (18 decimals)
 * @param totalShares Total UPT shares outstanding (18 decimals)
 * @param navPerShareBefore NAV before yield (18 decimals)
 * @param navPerShareAfter NAV after yield (18 decimals)
 * @return investorYield Investor's share of yield (Ujamaa Euro (UJEUR), 18 decimals)
 */
function calculateInvestorYield(
    uint256 investorShares,
    uint256 totalShares,
    uint256 navPerShareBefore,
    uint256 navPerShareAfter
) external pure returns (uint256 investorYield) {
    // Yield = Shares × (New NAV - Old NAV)
    uint256 navIncrease = navPerShareAfter.sub(navPerShareBefore);
    investorYield = investorShares.mul(navIncrease).div(PRECISION);

    return investorYield;
}
```

---

## 6. Asset Tokenization Algorithms

### 6.1 Ujamaa Guarantee Token (UGT) Specification

**Algorithm ID:** `ALG-05-03-01`
**SRS Reference:** SRS v2.0 Section 1.2, 5.3
**Purpose:** ERC-3643NFT collateral token representing certified merchandise
**Implementation:** Solidity (ERC-721 + ERC-3643 compliance)

#### 6.1.1 Token Properties

| Property | Value |
|----------|-------|
| **Name** | Ujamaa Guarantee Token |
| **Symbol** | UGT |
| **Standard** | ERC-3643NFT (ERC-721 + ERC-3643 compliance) |
| **Purpose** | Collateral/security token representing certified merchandise |
| **Transferable** | No (forced transfer only: Pool ↔ Industrial Gateway ↔ Auction) |
| **Compliance** | ERC-3643 identity verification required |

#### 6.1.2 UGT Data Structure

```solidity
struct Guarantee {
    uint256 certificateId;      // Industrial Gateway certificate
    uint256 merchandiseValue;   // Value in UJEUR (18 decimals)
    uint256 expiryDate;         // When invoice is due
    address industrial;         // Original issuer
    address poolAddress;        // Pool holding collateral
    bool isRedeemed;            // Whether repaid
    bool isDefaulted;           // Whether defaulted
    bytes32 stockHash;          // IPFS hash of stock documents
    string description;         // Stock description
    string warehouseLocation;   // Warehouse location
}
```

#### 6.1.3 UGT Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                    UGT LIFECYCLE                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Industrial receives order (e.g., ZARA €2M contract)     │
│          ↓                                                   │
│  2. Industrial Gateway certifies stock (GDIZ verification)  │
│          ↓                                                   │
│  3. UGT minted (ERC-3643NFT with metadata + compliance)     │
│          ↓                                                   │
│  4. Pool deploys funds to Industrial                        │
│          ↓                                                   │
│  5. Pool holds UGT (collateral/security)                    │
│          ↓                                                   │
│  6. Industrial repays (principal + interest)                │
│          ↓                                                   │
│  7. UGT transferred back to Industrial (forcedTransfer)     │
│          ↓                                                   │
│  8. [DEFAULT SCENARIO] If industrial defaults:              │
│      → UGT liquidated via approved auction                  │
│      → Proceeds distributed to UPT holders                  │
│      → Default recorded in compliance audit trail           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 6.2 UGT Minting Algorithm

**Algorithm ID:** `ALG-05-03-02`
**SRS Reference:** SRS v2.0 Section 5.3
**Purpose:** Mint UGT collateral token for certified assets
**Implementation:** Solidity

#### 6.2.1 Minting Function

**Function:** `mintGuarantee()`

**Inputs:**
- `industrial` - Industrial company address
- `certificateId` - Industrial Gateway certificate ID
- `value` - Merchandise value in UJEUR (18 decimals)
- `expiryDate` - Expiry timestamp
- `stockHash` - IPFS hash of stock documents
- `description` - Stock description
- `warehouseLocation` - Warehouse location

#### 6.2.2 Minting Algorithm

```
1. Validate inputs:
   - value > 0
   - industrial != address(0)
   - certificateId not already used

2. Mint new ERC-3643NFT:
   - tokenId = nextTokenId++
   - _safeMint(industrial, tokenId)

3. Store guarantee data:
   - s_guarantees[tokenId] = Guarantee(...)

4. Update mappings:
   - tokenIdToCertificateId[tokenId] = certificateId
   - certificateIdToTokenId[certificateId] = tokenId

5. Emit event:
   - GuaranteeMinted(tokenId, certificateId, industrial, value)

6. Return tokenId
```

#### 6.2.3 Solidity Implementation

```solidity
function mintGuarantee(
    address industrial,
    uint256 certificateId,
    uint256 value,
    uint256 expiryDate,
    bytes32 stockHash,
    string calldata description,
    string calldata warehouseLocation
) external onlyRole(MINTER_ROLE) returns (uint256) {
    if (value == 0) revert ZeroValue();
    if (industrial == address(0)) revert InvalidIndustrial();

    if (certificateIdToTokenId[certificateId] != 0) {
        return certificateIdToTokenId[certificateId];
    }

    uint256 tokenId = s_nextTokenId++;
    _safeMint(industrial, tokenId);

    s_guarantees[tokenId] = Guarantee({
        certificateId: certificateId,
        merchandiseValue: value,
        expiryDate: expiryDate,
        industrial: industrial,
        poolAddress: address(0),
        isRedeemed: false,
        isDefaulted: false,
        stockHash: stockHash,
        description: description,
        warehouseLocation: warehouseLocation
    });

    tokenIdToCertificateId[tokenId] = certificateId;
    certificateIdToTokenId[certificateId] = tokenId;

    emit GuaranteeMinted(tokenId, certificateId, industrial, value);

    return tokenId;
}
```

---

### 6.3 UGT Redemption Algorithm

**Algorithm ID:** `ALG-05-03-03`
**SRS Reference:** SRS v2.0 Section 5.3
**Purpose:** Transfer UGT back to industrial after financing repayment
**Implementation:** Solidity

#### 6.3.1 Redemption Algorithm

**Function:** `redeemGuarantee()`

**Algorithm:**
```
1. Validate:
   - Token exists
   - Caller has POOL_MANAGER_ROLE
   - Not already redeemed

2. Mark as redeemed:
   - guarantee.isRedeemed = true

3. Transfer to industrial:
   - _safeTransfer(msg.sender, industrial, tokenId)

4. Emit event:
   - GuaranteeRedeemed(tokenId, industrial)
```

---

### 6.4 UGT Liquidation Algorithm

**Algorithm ID:** `ALG-05-03-04`
**SRS Reference:** SRS v2.0 Section 5.3
**Purpose:** Auction UGT when industrial defaults
**Implementation:** Solidity

#### 6.4.1 Liquidation Algorithm

**Function:** `liquidateGuarantee()`

**Algorithm:**
```
1. Validate:
   - Token exists
   - Caller has POOL_MANAGER_ROLE
   - Token is marked as defaulted

2. Transfer to auction winner:
   - _safeTransfer(msg.sender, auctionWinner, tokenId)

3. Emit event:
   - GuaranteeLiquidated(tokenId, auctionWinner, liquidationAmount)

4. Distribute proceeds to UPT holders (via LiquidityPool)
```

---

### 6.5 Industrial Gateway Asset Certification

**Algorithm ID:** `ALG-05-03-05`
**SRS Reference:** SRS v2.0 Section 5.3
**Purpose:** Certify industrial assets/stock before tokenization
**Implementation:** Solidity

#### 6.5.1 Contract Specification

| Property | Value |
|----------|-------|
| **Name** | Industrial Gateway |
| **Former Name** | AssetProof (SRS v2.0 Section 1.3) |
| **Purpose** | Certify industrial assets/stock before tokenization |
| **Role** | Mints certificates → Triggers UGT minting |
| **Verifiers** | GDIZ, SIPI, approved certifiers |

#### 6.5.2 Certificate Data Structure

```solidity
struct Certificate {
    uint256 certificateId;
    address industrial;
    string assetType;         // INVOICE, INVENTORY, PRODUCTION, SHIPMENT, CONTRACT
    uint256 value;            // Value in UJEUR (18 decimals)
    uint256 quantity;
    string unit;              // e.g., "bales", "tons", "units"
    string warehouseLocation;
    uint256 certificationDate;
    uint256 expiryDate;
    bytes32 stockHash;        // IPFS hash
    string description;
    bool isVerified;
    bool isRevoked;
    uint256 guaranteeTokenId; // Linked UGT token ID
}
```

#### 6.5.3 Asset Certification Algorithm

**Function:** `certifyAsset()`

**Inputs:**
- `industrial` - Industrial company address
- `assetType` - Type of asset (INVOICE, INVENTORY, PRODUCTION, SHIPMENT, CONTRACT)
- `value` - Value in UJEUR (18 decimals)
- `quantity` - Quantity of items
- `unit` - Unit of measure
- `warehouseLocation` - Warehouse location
- `stockHash` - IPFS hash of stock documents
- `description` - Asset description
- `validityDays` - Certificate validity period

**Algorithm:**
```
1. Validate inputs:
   - value > 0
   - industrial != address(0)
   - Caller has CERTIFIER_ROLE (GDIZ/SIPI)

2. Create certificate:
   - certificateId = nextCertificateId++
   - certificates[certificateId] = Certificate(...)

3. Auto-verify certificate:
   - cert.isVerified = true
   - cert.certificationDate = block.timestamp
   - cert.expiryDate = block.timestamp + (validityDays * 1 days)

4. Add to industrial's certificates:
   - industrialCertificates[industrial].push(certificateId)

5. Emit events:
   - CertificateCreated(certificateId, industrial, assetType, value)
   - CertificateVerified(certificateId, msg.sender)

6. Return certificateId
```

---

### 6.6 Certificate to UGT Minting Algorithm

**Algorithm ID:** `ALG-05-03-06`
**SRS Reference:** SRS v2.0 Section 5.3
**Purpose:** Mint UGT collateral token for verified certificate
**Implementation:** Solidity

#### 6.6.1 Minting from Certificate

**Function:** `mintGuaranteeToken()`

**Algorithm:**
```
1. Validate certificate:
   - Certificate exists
   - isVerified == true
   - isRevoked == false
   - guaranteeTokenId == 0 (not already minted)

2. Mint UGT:
   - tokenId = guaranteeToken.mintGuarantee(
       cert.industrial,
       certificateId,
       cert.value,
       cert.expiryDate,
       cert.stockHash,
       cert.description,
       cert.warehouseLocation
   )

3. Link certificate to UGT:
   - cert.guaranteeTokenId = tokenId

4. Assign UGT to pool:
   - guaranteeToken.assignToPool(tokenId, msg.sender)

5. Emit event:
   - GuaranteeTokenMinted(certificateId, tokenId)

6. Return tokenId
```

---

### 6.7 Complete Asset Tokenization Flow

**Algorithm ID:** `ALG-05-03-07`
**SRS Reference:** SRS v2.0 Section 1.2, 5.3
**Purpose:** End-to-end asset tokenization from submission to collateral
**Implementation:** Solidity (multi-contract orchestration)

#### 6.7.1 End-to-End Flow

```
┌─────────────────────────────────────────────────────────────┐
│            ASSET TOKENIZATION FLOW                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STEP 1: Asset Submission                                   │
│  ─────────────────────                                       │
│  • Industrial submits asset details to Industrial Gateway   │
│  • Provides: value, quantity, warehouse, IPFS hash          │
│  • Asset types: INVOICE, INVENTORY, PRODUCTION, SHIPMENT    │
│                                                              │
│          ↓                                                   │
│                                                              │
│  STEP 2: Certification (GDIZ/SIPI)                          │
│  ───────────────────────                                     │
│  • Certifier verifies asset existence                       │
│  • Calls: certifyAsset()                                    │
│  • Certificate created with unique ID                       │
│  • Auto-verified by certifier                               │
│                                                              │
│          ↓                                                   │
│                                                              │
│  STEP 3: UGT Minting                                        │
│  ───────────────                                             │
│  • Pool manager calls: mintGuaranteeToken(certificateId)    │
│  • UGT (ERC-3643NFT) minted                                 │
│  • UGT held by Pool as collateral                           │
│  • Certificate linked to UGT token ID                       │
│                                                              │
│          ↓                                                   │
│                                                              │
│  STEP 4: Financing Creation                                 │
│  ──────────────────────                                      │
│  • LiquidityPool.createFinancing() called                   │
│  • Funds deployed to Industrial                             │
│  • UGT assigned to financing                                │
│  • financingToGuaranteeToken[financingId] = tokenId         │
│                                                              │
│          ↓                                                   │
│                                                              │
│  STEP 5: Repayment OR Default                               │
│  ─────────────────────────                                   │
│                                                              │
│  [SCENARIO A: Repayment]                                    │
│  • Industrial repays (principal + interest)                 │
│  • Pool calls: redeemGuarantee(tokenId)                     │
│  • UGT transferred back to Industrial                       │
│  • Certificate marked as redeemed                           │
│                                                              │
│  [SCENARIO B: Default]                                      │
│  • Industrial defaults                                      │
│  • Pool marks UGT as defaulted                              │
│  • Auction conducted                                        │
│  • UGT liquidated to auction winner                         │
│  • Proceeds distributed to UPT holders                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 6.7.2 Integration with LiquidityPool

**Updated createFinancing() Function:**

```solidity
function createFinancing(
    PoolFamily poolFamily,
    string calldata assetClass,
    address industrial,
    uint256 principal,
    uint256 interestRate,
    uint256 durationDays,
    uint256 certificateId  // NEW: For UGT minting
) external nonReentrant returns (uint256) {
    // ... validation ...

    // Create financing
    uint256 financingId = nextFinancingId++;
    financings[financingId] = Financing(...);

    // Mint UGT as collateral if certificate provided
    if (certificateId > 0 && address(guaranteeToken) != address(0)) {
        try guaranteeToken.mintGuaranteeToken(certificateId) returns (uint256 tokenId) {
            financingToGuaranteeToken[financingId] = tokenId;
        } catch {
            // Fallback: continue without UGT (MVP-2)
        }
    }

    // ... rest of logic ...
}
```

---

### 6.8 UGT Compliance & Security

**Algorithm ID:** `ALG-05-03-08`
**SRS Reference:** SRS v2.0 Section 1.2
**Purpose:** ERC-3643 compliance and transfer restrictions
**Implementation:** Solidity

#### 6.8.1 Transfer Restrictions

```solidity
function _update(address to, uint256 tokenId, uint256 auth) internal override returns (address) {
    address from = _ownerOf(tokenId);

    // Allow minting
    if (from == address(0)) {
        return super._update(to, tokenId, auth);
    }

    // Allow transfers to/from Pool or Industrial Gateway only
    Guarantee memory guarantee = s_guarantees[tokenId];
    if (
        to == guarantee.poolAddress ||
        to == guarantee.industrial ||
        hasRole(POOL_MANAGER_ROLE, to)
    ) {
        return super._update(to, tokenId, auth);
    }

    // Revert for unauthorized transfers
    revert("UGT: Transfer not allowed - compliance restriction");
}
```

#### 6.8.2 Identity Verification

- ✅ Only verified entities can hold UGT (ERC-3643)
- ✅ ONCHAINID integration required
- ✅ Transfer validation on every transaction
- ✅ Compliance audit trail maintained

---

### 6.9 MVP-2 Testnet Utilities

**Algorithm ID:** `ALG-05-03-09`
**SRS Reference:** SRS v2.0 Section 5.3
**Purpose:** Testnet utilities for testing UGT functionality
**Implementation:** Solidity

#### 6.9.1 Testnet Minting

```solidity
function mintTestGuarantee(
    address industrial,
    uint256 value,
    string calldata description
) external returns (uint256) {
    require(IS_MVP_TESTNET, "Only on testnet");

    return this.mintGuarantee(
        industrial,
        s_nextTokenId,
        value,
        block.timestamp + (365 days),
        keccak256(abi.encodePacked("test-stock-", s_nextTokenId)),
        description,
        "MVP-2 Test Warehouse"
    );
}
```

#### 6.9.2 Testnet Certificate Creation

```solidity
function createTestCertificate(
    address industrial,
    string calldata assetType,
    uint256 value,
    string calldata description
) external returns (uint256) {
    require(IS_MVP_TESTNET, "Only on testnet");

    return this.certifyAsset(
        industrial,
        assetType,
        value,
        1000, // quantity
        "units",
        "MVP-2 Test Warehouse",
        keccak256(abi.encodePacked("test-", block.timestamp)),
        description,
        365 // validity days
    );
}
```

---

## 7. Pool Management Algorithms

### 7.1 Diversification Limit Check

**Algorithm ID:** `ALG-10-03-01`
**SRS Reference:** EPIC 10, User Story 10.3 (Liquidity Pool Creation)
**Purpose:** Enforce diversification limits per industrial and asset class
**Implementation:** Solidity (on-chain enforcement), Python (pre-validation)

#### 6.1.1 Concentration Check

```solidity
/**
 * @title DiversificationChecker
 * @dev Enforce pool diversification limits
 */
contract DiversificationChecker {
    // Maximum 20% per industrial
    uint256 private constant MAX_INDUSTRIAL_EXPOSURE_BPS = 2000; // 20% = 2000 bps

    // Maximum 40% per asset class
    uint256 private constant MAX_ASSET_CLASS_EXPOSURE_BPS = 4000; // 40% = 4000 bps

    /**
     * @dev Check if new financing violates diversification limits
     *
     * @param poolValue Total pool value (Ujamaa Euro (UJEUR), 18 decimals)
     * @param currentIndustrialExposure Current exposure to industrial (Ujamaa Euro (UJEUR), 18 decimals)
     * @param currentAssetClassExposure Current exposure to asset class (Ujamaa Euro (UJEUR), 18 decimals)
     * @param newFinancingAmount New financing amount (Ujamaa Euro (UJEUR), 18 decimals)
     * @return isValid True if within limits
     * @return violationCode 0=none, 1=industrial, 2=asset_class
     */
    function checkDiversification(
        uint256 poolValue,
        uint256 currentIndustrialExposure,
        uint256 currentAssetClassExposure,
        uint256 newFinancingAmount
    ) external pure returns (bool isValid, uint8 violationCode) {
        uint256 newPoolValue = poolValue.add(newFinancingAmount);
        uint256 newIndustrialExposure = currentIndustrialExposure.add(newFinancingAmount);
        uint256 newAssetClassExposure = currentAssetClassExposure.add(newFinancingAmount);

        // Check industrial limit (20%)
        uint256 industrialExposureBps = newIndustrialExposure
            .mul(10000)
            .div(newPoolValue);

        if (industrialExposureBps > MAX_INDUSTRIAL_EXPOSURE_BPS) {
            return (false, 1);
        }

        // Check asset class limit (40%)
        uint256 assetClassExposureBps = newAssetClassExposure
            .mul(10000)
            .div(newPoolValue);

        if (assetClassExposureBps > MAX_ASSET_CLASS_EXPOSURE_BPS) {
            return (false, 2);
        }

        return (true, 0);
    }
}
```

#### 6.1.2 Herfindahl Index Calculation

```python
def calculate_herfindahl_index(exposures: dict) -> float:
    """
    Calculate Herfindahl-Hirschman Index (HHI) for pool diversification.

    HHI = Sum of squared market shares (0-10,000 scale)
    Lower HHI = More diversified
    Higher HHI = More concentrated

    Args:
        exposures: Dictionary of {industrial_id: exposure_amount}

    Returns:
        HHI (0-10,000)
    """
    total_exposure = sum(exposures.values())

    if total_exposure == 0:
        return 0

    hhi = 0
    for exposure in exposures.values():
        market_share = (exposure / total_exposure) * 10000  # Basis points
        hhi += market_share ** 2

    return hhi


def is_diversified(exposures: dict, threshold: int = 2500) -> bool:
    """
    Check if pool is sufficiently diversified.

    HHI Interpretation:
    - <1500: Unconcentrated (well diversified)
    - 1500-2500: Moderately concentrated
    - >2500: Highly concentrated

    Args:
        exposures: Industrial exposures
        threshold: Maximum acceptable HHI (default 2500)

    Returns:
        True if diversified
    """
    hhi = calculate_herfindahl_index(exposures)
    return hhi < threshold
```

---

### 6.2 Pool Rebalancing Algorithm

**Algorithm ID:** `ALG-10-03-02`
**SRS Reference:** EPIC 10, User Story 10.3
**Purpose:** Calculate optimal rebalancing trades to maintain diversification
**Implementation:** Python (optimization)

#### 6.2.1 Rebalancing Optimization

```python
from scipy.optimize import minimize
import numpy as np

def calculate_optimal_rebalancing(
    current_allocations: dict,
    target_allocations: dict,
    transaction_costs: float = 0.001
) -> dict:
    """
    Calculate optimal rebalancing trades.

    Objective: Minimize tracking error + transaction costs
    Subject to: Diversification constraints

    Args:
        current_allocations: Current pool allocations {industrial: amount}
        target_allocations: Target allocations {industrial: target_pct}
        transaction_costs: Transaction cost as percentage (0.1%)

    Returns:
        Dictionary with rebalancing trades
    """
    industrials = list(current_allocations.keys())
    n = len(industrials)

    current_values = np.array([current_allocations[ind] for ind in industrials])
    target_values = np.array([target_allocations.get(ind, 0) for ind in industrials])

    total_value = sum(current_allocations.values())

    def objective(trades):
        """Minimize tracking error + transaction costs."""
        new_allocations = current_values + trades
        new_weights = new_allocations / total_value

        tracking_error = np.sum((new_weights - target_values) ** 2)
        transaction_cost = np.sum(np.abs(trades)) * transaction_costs / total_value

        return tracking_error + transaction_cost

    # Constraints: Sum of trades = 0 (self-financing)
    constraints = {'type': 'eq', 'fun': lambda trades: np.sum(trades)}

    # Bounds: No short positions
    bounds = [(-current_values[i], None) for i in range(n)]

    # Initial guess: No trades
    initial_trades = np.zeros(n)

    # Optimize
    result = minimize(
        objective,
        initial_trades,
        method='SLSQP',
        bounds=bounds,
        constraints=constraints
    )

    # Build trade list
    trades = {}
    for i, industrial in enumerate(industrials):
        trade_amount = result.x[i]
        if abs(trade_amount) > 100:  # Minimum trade size (€100)
            trades[industrial] = trade_amount

    return {
        'trades': trades,
        'optimization_success': result.success,
        'tracking_error': result.fun,
        'total_turnover': sum(abs(t) for t in trades.values())
    }
```

---

## 8. Compliance & Suitability Algorithms

### 8.1 Investor Suitability Check

**Algorithm ID:** `ALG-04-03-01`
**SRS Reference:** EPIC 4, User Story 4.3 (Investor Suitability Check)
**Purpose:** Prevent investors from purchasing assets above risk tolerance
**Implementation:** Python, Solidity

#### 7.1.1 Suitability Matrix

```python
from enum import Enum

class RiskTolerance(Enum):
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"
    INSTITUTIONAL = "institutional"


class SuitabilityChecker:
    # Maximum allowable rating per risk tolerance
    SUITABILITY_MATRIX = {
        RiskTolerance.CONSERVATIVE: {'AAA', 'A', 'BBB'},
        RiskTolerance.MODERATE: {'AAA', 'A', 'BBB', 'BB'},
        RiskTolerance.AGGRESSIVE: {'AAA', 'A', 'BBB', 'BB', 'B', 'CCC'},
        RiskTolerance.INSTITUTIONAL: {'AAA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D'}
    }

    @classmethod
    def is_suitable(
        cls,
        investor_risk_tolerance: RiskTolerance,
        asset_rating: str
    ) -> bool:
        """
        Check if asset is suitable for investor.

        Args:
            investor_risk_tolerance: Investor's risk tolerance
            asset_rating: Asset's risk rating

        Returns:
            True if suitable
        """
        allowed_ratings = cls.SUITABILITY_MATRIX[investor_risk_tolerance]
        return asset_rating in allowed_ratings

    @classmethod
    def check_and_raise(
        cls,
        investor_risk_tolerance: RiskTolerance,
        asset_rating: str,
        investor_id: str,
        asset_id: str
    ):
        """
        Check suitability and raise exception if unsuitable.

        Args:
            investor_risk_tolerance: Investor's risk tolerance
            asset_rating: Asset's risk rating
            investor_id: Investor identifier
            asset_id: Asset identifier

        Raises:
            SuitabilityException: If asset is unsuitable
        """
        if not cls.is_suitable(investor_risk_tolerance, asset_rating):
            raise SuitabilityException(
                f"Investor {investor_id} (tolerance: {investor_risk_tolerance.value}) "
                f"cannot purchase asset {asset_id} (rating: {asset_rating})"
            )
```

#### 7.1.2 Smart Contract Enforcement

```solidity
/**
 * @dev Check investor suitability before allowing transfer
 *
 * @param investorRiskTolerance Investor's risk tolerance (encoded as uint8)
 * @param assetRating Asset's risk rating (encoded as uint8)
 * @return isSuitable True if suitable
 */
function checkSuitability(
    uint8 investorRiskTolerance,
    uint8 assetRating
) external pure returns (bool isSuitable) {
    // Risk tolerance encoding: 0=Conservative, 1=Moderate, 2=Aggressive, 3=Institutional
    // Rating encoding: 0=AAA, 1=A, 2=BBB, 3=BB, 4=B, 5=CCC, 6=D

    if (investorRiskTolerance == 0) {
        // Conservative: AAA, A, BBB only
        return assetRating <= 2;
    } else if (investorRiskTolerance == 1) {
        // Moderate: AAA to BB
        return assetRating <= 3;
    } else if (investorRiskTolerance == 2) {
        // Aggressive: AAA to CCC
        return assetRating <= 5;
    } else {
        // Institutional: All ratings
        return true;
    }
}
```

---

### 8.2 Jurisdiction Filtering

**Algorithm ID:** `ALG-04-03-02`
**SRS Reference:** EPIC 4, User Story 4.3
**Purpose:** Filter assets based on investor jurisdiction and regulatory restrictions
**Implementation:** Python

#### 7.2.1 Strictest Jurisdiction List

```python
from typing import Set

class JurisdictionFilter:
    # Combined OFAC + UN + EU + FATF High-Risk jurisdictions
    STRICTEST_JURISDICTION_LIST = {
        # OFAC Sanctioned
        'IR',  # Iran
        'KP',  # North Korea
        'SY',  # Syria
        'CU',  # Cuba
        'RU',  # Russia (partial)
        'BY',  # Belarus
        # FATF High-Risk
        'MM',  # Myanmar
        'NG',  # Nigeria (on watchlist)
        'PK',  # Pakistan
        'YE',  # Yemen
        # Additional high-risk
        'AF',  # Afghanistan
        'VE',  # Venezuela
        'ZW',  # Zimbabwe
        'SD',  # Sudan
        'LY',  # Libya
    }

    # EU MiCA compliant jurisdictions
    EU_WHITELIST = {
        'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'LU', 'AT', 'PT', 'IE',
        'FI', 'EE', 'LV', 'LT', 'PL', 'CZ', 'SK', 'SI', 'HR', 'HU',
        'RO', 'BG', 'CY', 'MT', 'GR', 'SE', 'DK', 'IS', 'NO', 'LI',
        'CH', 'GB', 'GI', 'IM', 'JE', 'GG'
    }

    @classmethod
    def is_blocked_jurisdiction(cls, jurisdiction_code: str) -> bool:
        """
        Check if jurisdiction is blocked.

        Args:
            jurisdiction_code: ISO 3166-1 alpha-2 country code

        Returns:
            True if blocked
        """
        return jurisdiction_code.upper() in cls.STRICTEST_JURISDICTION_LIST

    @classmethod
    def is_eu_whitelisted(cls, jurisdiction_code: str) -> bool:
        """
        Check if jurisdiction is EU whitelisted.

        Args:
            jurisdiction_code: ISO 3166-1 alpha-2 country code

        Returns:
            True if whitelisted
        """
        return jurisdiction_code.upper() in cls.EU_WHITELIST

    @classmethod
    def filter_assets(
        cls,
        assets: list,
        investor_jurisdiction: str
    ) -> list:
        """
        Filter assets available to investor based on jurisdiction.

        Args:
            assets: List of assets with jurisdiction_whitelist field
            investor_jurisdiction: Investor's jurisdiction

        Returns:
            Filtered list of available assets
        """
        # Block assets from sanctioned jurisdictions
        available_assets = [
            asset for asset in assets
            if not cls.is_blocked_jurisdiction(asset.jurisdiction)
        ]

        # Check if investor's jurisdiction is allowed for each asset
        filtered = [
            asset for asset in available_assets
            if investor_jurisdiction.upper() in asset.jurisdiction_whitelist
            or '*' in asset.jurisdiction_whitelist  # Wildcard = all allowed
        ]

        return filtered
```

---

## 9. Oracle & Pricing Algorithms

### 9.1 Price Feed Aggregation

**Algorithm ID:** `ALG-03-01-01`
**SRS Reference:** EPIC 3, User Story 3.1 (Price Feed Integration)
**Purpose:** Aggregate multiple oracle price feeds with deviation detection
**Implementation:** Solidity, Python

#### 9.1.1 Median Price Calculation

```solidity
/**
 * @title PriceAggregator
 * @dev Aggregate multiple Gateway price feeds with outlier detection
 */
contract PriceAggregator {
    struct PriceFeed {
        address Gateway;
        int256 price;
        uint256 timestamp;
        bool active;
    }

    mapping(string => PriceFeed[]) private priceFeeds;
    uint256 private constant DEVIATION_THRESHOLD_BPS = 500; // 5%

    /**
     * @dev Calculate median price from multiple Gateways
     *
     * @param pair Price pair (e.g., "ETH/USD")
     * @return medianPrice Median price (18 decimals)
     * @return isValid True if price is valid
     */
    function getMedianPrice(
        string memory pair
    ) external view returns (int256 medianPrice, bool isValid) {
        PriceFeed[] memory feeds = priceFeeds[pair];
        require(feeds.length >= 2, "Insufficient Gateways");

        // Filter active feeds (updated within 1 hour)
        int256[] memory prices = new int256[](feeds.length);
        uint256 activeCount = 0;
        uint256 staleThreshold = block.timestamp - 1 hours;

        for (uint256 i = 0; i < feeds.length; i++) {
            if (feeds[i].active && feeds[i].timestamp > staleThreshold) {
                prices[activeCount] = feeds[i].price;
                activeCount++;
            }
        }

        require(activeCount >= 2, "Insufficient active Gateways");

        // Sort prices (bubble sort for simplicity)
        for (uint256 i = 0; i < activeCount - 1; i++) {
            for (uint256 j = 0; j < activeCount - i - 1; j++) {
                if (prices[j] > prices[j + 1]) {
                    int256 temp = prices[j];
                    prices[j] = prices[j + 1];
                    prices[j + 1] = temp;
                }
            }
        }

        // Calculate median
        if (activeCount % 2 == 0) {
            medianPrice = (prices[activeCount / 2 - 1] + prices[activeCount / 2]) / 2;
        } else {
            medianPrice = prices[activeCount / 2];
        }

        isValid = true;
    }

    /**
     * @dev Check for price deviation from median
     *
     * @param price Gateway price to check
     * @param medianPrice Median price
     * @return isDeviated True if price deviates >5%
     */
    function checkDeviation(
        int256 price,
        int256 medianPrice
    ) external pure returns (bool isDeviated) {
        if (medianPrice <= 0) return false;

        int256 deviation = ((price - medianPrice) * 10000) / medianPrice;

        // Absolute value
        if (deviation < 0) deviation = -deviation;

        return deviation > DEVIATION_THRESHOLD_BPS;
    }
}
```

---

## 10. Bank Escrow & Payment Algorithms

### 10.1 Bank Escrow Logic

**Algorithm ID:** `ALG-10-05-01`
**SRS Reference:** EPIC 10, User Story 10.5 (Bank Escrow Integration)
**Purpose:** Manage escrow account logic for investor funds
**Implementation:** Solidity (MockEscrow for MVP-2), Python (Production bank API)

#### 10.1.1 Escrow Account Management

```python
from decimal import Decimal
from datetime import datetime
from enum import Enum
from typing import Dict, Optional

class EscrowStatus(Enum):
    PENDING = "pending"
    ACTIVE = "active"
    RELEASED = "released"
    REFUNDED = "refunded"

class EscrowAccount:
    def __init__(self, account_id: str, investor_id: str):
        self.account_id = account_id
        self.investor_id = investor_id
        self.balance = Decimal('0')
        self.status = EscrowStatus.PENDING
        self.created_at = datetime.utcnow()
        self.released_at: Optional[datetime] = None
        self.refund_at: Optional[datetime] = None

    def deposit(self, amount: Decimal) -> bool:
        """
        Deposit funds into escrow.

        Args:
            amount: Amount to deposit

        Returns:
            True if successful
        """
        if amount <= 0:
            return False

        self.balance += amount
        self.status = EscrowStatus.ACTIVE
        return True

    def release(self, recipient: str) -> Decimal:
        """
        Release funds to recipient.

        Args:
            recipient: Recipient address

        Returns:
            Amount released
        """
        if self.status != EscrowStatus.ACTIVE:
            raise ValueError("Escrow not active")

        amount = self.balance
        self.balance = Decimal('0')
        self.status = EscrowStatus.RELEASED
        self.released_at = datetime.utcnow()

        # In production: trigger bank wire transfer
        # transfer_bank(recipient, amount)

        return amount

    def refund(self) -> Decimal:
        """
        Refund funds to investor.

        Returns:
            Amount refunded
        """
        if self.status not in [EscrowStatus.ACTIVE, EscrowStatus.PENDING]:
            raise ValueError("Escrow not eligible for refund")

        amount = self.balance
        self.balance = Decimal('0')
        self.status = EscrowStatus.REFUNDED
        self.refund_at = datetime.utcnow()

        # In production: trigger bank refund
        # refund_bank(self.investor_id, amount)

        return amount
```

#### 10.1.2 MVP-2 Testnet Mock

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockEscrow
 * @dev Mock escrow for MVP-2 testnet (no real bank integration)
 */
contract MockEscrow {
    struct Escrow {
        address investor;
        uint256 balance;
        bool isActive;
        uint256 createdAt;
    }

    mapping(bytes32 => Escrow) public escrows;
    mapping(address => bytes32[]) public investorEscrows;

    event EscrowCreated(bytes32 indexed escrowId, address indexed investor, uint256 amount);
    event FundsReleased(bytes32 indexed escrowId, uint256 amount);
    event FundsRefunded(bytes32 indexed escrowId, uint256 amount);

    function createEscrow(address investor, uint256 amount) external returns (bytes32) {
        bytes32 escrowId = keccak256(abi.encodePacked(msg.sender, investor, block.timestamp));

        escrows[escrowId] = Escrow({
            investor: investor,
            balance: amount,
            isActive: true,
            createdAt: block.timestamp
        });

        investorEscrows[investor].push(escrowId);

        emit EscrowCreated(escrowId, investor, amount);

        return escrowId;
    }

    function releaseFunds(bytes32 escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.isActive, "Escrow not active");

        uint256 amount = escrow.balance;
        escrow.balance = 0;
        escrow.isActive = false;

        // Mock transfer - in production would trigger bank wire
        emit FundsReleased(escrowId, amount);
    }

    function refundFunds(bytes32 escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.isActive, "Escrow not active");

        uint256 amount = escrow.balance;
        escrow.balance = 0;
        escrow.isActive = false;

        emit FundsRefunded(escrowId, amount);
    }
}
```

---

## 11. Cryptographic & Security Algorithms

### 11.1 Merkle Tree Construction

**Algorithm ID:** `ALG-11-01-01`
**SRS Reference:** EPIC 11, User Story 10.1 (Immutable Audit Log)
**Purpose:** Build Merkle tree for audit log integrity verification
**Implementation:** Python

#### 11.1.1 Merkle Tree Builder

```python
import hashlib
from typing import List, Optional

class MerkleTree:
    def __init__(self, leaves: List[bytes]):
        """
        Initialize Merkle tree.

        Args:
            leaves: List of leaf data (hashes)
        """
        self.leaves = leaves
        self.tree = self._build_tree()
        self.root = self.tree[-1][0] if self.tree else None

    def _hash(self, data: bytes) -> bytes:
        """SHA-256 hash."""
        return hashlib.sha256(data).digest()

    def _build_tree(self) -> List[List[bytes]]:
        """
        Build Merkle tree from leaves.

        Returns:
            Tree as list of levels (bottom to top)
        """
        if not self.leaves:
            return []

        # Start with leaves
        current_level = [self._hash(leaf) for leaf in self.leaves]
        tree = [current_level]

        # Build up to root
        while len(current_level) > 1:
            next_level = []

            for i in range(0, len(current_level), 2):
                left = current_level[i]
                right = current_level[i + 1] if i + 1 < len(current_level) else left

                # Concatenate and hash
                combined = self._hash(left + right)
                next_level.append(combined)

            tree.append(next_level)
            current_level = next_level

        return tree

    def get_proof(self, index: int) -> List[tuple]:
        """
        Generate Merkle proof for leaf at index.

        Args:
            index: Leaf index

        Returns:
            List of (hash, position) tuples
        """
        if index >= len(self.leaves):
            raise IndexError("Leaf index out of range")

        proof = []
        current_index = index

        for level in range(len(self.tree) - 1):
            # Determine sibling index
            if current_index % 2 == 0:
                sibling_index = current_index + 1
                position = 'right'
            else:
                sibling_index = current_index - 1
                position = 'left'

            # Get sibling hash (or duplicate if odd)
            level_nodes = self.tree[level]
            if sibling_index < len(level_nodes):
                sibling_hash = level_nodes[sibling_index]
            else:
                sibling_hash = level_nodes[current_index]

            proof.append((sibling_hash, position))
            current_index //= 2

        return proof

    def verify_proof(
        self,
        leaf: bytes,
        proof: List[tuple],
        root: bytes
    ) -> bool:
        """
        Verify Merkle proof.

        Args:
            leaf: Original leaf data
            proof: Merkle proof
            root: Expected root hash

        Returns:
            True if proof is valid
        """
        current_hash = self._hash(leaf)

        for sibling_hash, position in proof:
            if position == 'left':
                current_hash = self._hash(sibling_hash + current_hash)
            else:
                current_hash = self._hash(current_hash + sibling_hash)

        return current_hash == root
```

---

## 12. Performance & Optimization Algorithms

### 12.1 Cache Eviction Strategy

**Algorithm ID:** `ALG-09-01-01`
**SRS Reference:** EPIC 9, User Story 9.2 (Kubernetes Autoscaling)
**Purpose:** Implement LRU (Least Recently Used) cache eviction for Redis
**Implementation:** Python, Redis

#### 12.1.1 LRU Cache Implementation

```python
from collections import OrderedDict
import redis
import json
from typing import Any, Optional

class LRUCache:
    def __init__(self, capacity: int, redis_client: Optional[redis.Redis] = None):
        """
        Initialize LRU cache.

        Args:
            capacity: Maximum number of items
            redis_client: Optional Redis client for distributed caching
        """
        self.capacity = capacity
        self.cache = OrderedDict()
        self.redis = redis_client

    def get(self, key: str) -> Optional[Any]:
        """
        Get item from cache.

        Args:
            key: Cache key

        Returns:
            Cached value or None
        """
        if self.redis:
            # Distributed cache
            value = self.redis.get(f"cache:{key}")
            if value:
                # Move to end (most recently used)
                self.redis.move_to_end(f"cache:{key}")
                return json.loads(value)
            return None

        # Local cache
        if key not in self.cache:
            return None

        # Move to end (most recently used)
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: str, value: Any, ttl: int = 300):
        """
        Put item in cache.

        Args:
            key: Cache key
            value: Value to cache
            ttl: Time-to-live in seconds (default 5 minutes)
        """
        if self.redis:
            # Distributed cache with TTL
            self.redis.setex(
                f"cache:{key}",
                ttl,
                json.dumps(value)
            )
        else:
            # Local cache
            if key in self.cache:
                self.cache.move_to_end(key)
            self.cache[key] = value

            # Evict LRU if over capacity
            if len(self.cache) > self.capacity:
                self.cache.popitem(last=False)

    def invalidate(self, key: str):
        """
        Invalidate cached item.

        Args:
            key: Cache key
        """
        if self.redis:
            self.redis.delete(f"cache:{key}")
        else:
            self.cache.pop(key, None)
```

### 12.2 Kubernetes Autoscaling Logic

**Algorithm ID:** `ALG-09-02-01`
**SRS Reference:** EPIC 9, User Story 9.2 (Kubernetes Autoscaling)
**Purpose:** Autoscale backend services based on load metrics
**Implementation:** Kubernetes HPA, Python metrics collector

#### 12.2.1 Autoscaling Decision Logic

```python
from dataclasses import dataclass
from typing import List
from datetime import datetime

@dataclass
class Metrics:
    cpu_percent: float
    memory_percent: float
    requests_per_second: float
    avg_response_time_ms: float

class Autoscaler:
    def __init__(
        self,
        min_replicas: int = 2,
        max_replicas: int = 20,
        target_cpu_percent: int = 70,
        target_memory_percent: int = 80
    ):
        self.min_replicas = min_replicas
        self.max_replicas = max_replicas
        self.target_cpu_percent = target_cpu_percent
        self.target_memory_percent = target_memory_percent

    def calculate_replicas(
        self,
        current_replicas: int,
        metrics_history: List[Metrics]
    ) -> int:
        """
        Calculate desired replica count.

        Args:
            current_replicas: Current replica count
            metrics_history: Last 5 minutes of metrics

        Returns:
            Desired replica count
        """
        if not metrics_history:
            return current_replicas

        # Average metrics over last 5 minutes
        avg_cpu = sum(m.cpu_percent for m in metrics_history) / len(metrics_history)
        avg_memory = sum(m.memory_percent for m in metrics_history) / len(metrics_history)

        # Calculate scaling factor based on CPU
        if avg_cpu > self.target_cpu_percent:
            cpu_scale = avg_cpu / self.target_cpu_percent
        else:
            cpu_scale = 1.0

        # Calculate scaling factor based on memory
        if avg_memory > self.target_memory_percent:
            memory_scale = avg_memory / self.target_memory_percent
        else:
            memory_scale = 1.0

        # Use maximum of both scales
        scale_factor = max(cpu_scale, memory_scale)

        # Calculate desired replicas
        desired = int(current_replicas * scale_factor)

        # Apply bounds
        desired = max(self.min_replicas, min(self.max_replicas, desired))

        return desired
```

---

## 10. Cryptographic & Security Algorithms

### 10.1 Merkle Tree Construction

**Algorithm ID:** `ALG-11-01-01`
**SRS Reference:** EPIC 11, User Story 10.1 (Immutable Audit Log)
**Purpose:** Build Merkle tree for audit log integrity verification
**Implementation:** Python

#### 9.1.1 Merkle Tree Builder

```python
import hashlib
from typing import List, Optional

class MerkleTree:
    def __init__(self, leaves: List[bytes]):
        """
        Initialize Merkle tree.

        Args:
            leaves: List of leaf data (hashes)
        """
        self.leaves = leaves
        self.tree = self._build_tree()
        self.root = self.tree[-1][0] if self.tree else None

    def _hash(self, data: bytes) -> bytes:
        """SHA-256 hash."""
        return hashlib.sha256(data).digest()

    def _build_tree(self) -> List[List[bytes]]:
        """
        Build Merkle tree from leaves.

        Returns:
            Tree as list of levels (bottom to top)
        """
        if not self.leaves:
            return []

        # Start with leaves
        current_level = [self._hash(leaf) for leaf in self.leaves]
        tree = [current_level]

        # Build up to root
        while len(current_level) > 1:
            next_level = []

            for i in range(0, len(current_level), 2):
                left = current_level[i]
                right = current_level[i + 1] if i + 1 < len(current_level) else left

                # Concatenate and hash
                combined = self._hash(left + right)
                next_level.append(combined)

            tree.append(next_level)
            current_level = next_level

        return tree

    def get_proof(self, index: int) -> List[tuple]:
        """
        Generate Merkle proof for leaf at index.

        Args:
            index: Leaf index

        Returns:
            List of (hash, position) tuples
        """
        if index >= len(self.leaves):
            raise IndexError("Leaf index out of range")

        proof = []
        current_index = index

        for level in range(len(self.tree) - 1):
            # Determine sibling index
            if current_index % 2 == 0:
                sibling_index = current_index + 1
                position = 'right'
            else:
                sibling_index = current_index - 1
                position = 'left'

            # Get sibling hash (or duplicate if odd)
            level_nodes = self.tree[level]
            if sibling_index < len(level_nodes):
                sibling_hash = level_nodes[sibling_index]
            else:
                sibling_hash = level_nodes[current_index]

            proof.append((sibling_hash, position))
            current_index //= 2

        return proof

    def verify_proof(
        self,
        leaf: bytes,
        proof: List[tuple],
        root: bytes
    ) -> bool:
        """
        Verify Merkle proof.

        Args:
            leaf: Original leaf data
            proof: Merkle proof
            root: Expected root hash

        Returns:
            True if proof is valid
        """
        current_hash = self._hash(leaf)

        for sibling_hash, position in proof:
            if position == 'left':
                current_hash = self._hash(sibling_hash + current_hash)
            else:
                current_hash = self._hash(current_hash + sibling_hash)

        return current_hash == root
```

---

## 11. Performance & Optimization Algorithms

### 11.1 Cache Eviction Strategy

**Algorithm ID:** `ALG-09-01-01`
**SRS Reference:** EPIC 9, User Story 9.2 (Kubernetes Autoscaling)
**Purpose:** Implement LRU (Least Recently Used) cache eviction for Redis
**Implementation:** Python, Redis

#### 10.1.1 LRU Cache Implementation

```python
from collections import OrderedDict
import redis
import json
from typing import Any, Optional

class LRUCache:
    def __init__(self, capacity: int, redis_client: Optional[redis.Redis] = None):
        """
        Initialize LRU cache.

        Args:
            capacity: Maximum number of items
            redis_client: Optional Redis client for distributed caching
        """
        self.capacity = capacity
        self.cache = OrderedDict()
        self.redis = redis_client

    def get(self, key: str) -> Optional[Any]:
        """
        Get item from cache.

        Args:
            key: Cache key

        Returns:
            Cached value or None
        """
        if self.redis:
            # Distributed cache
            value = self.redis.get(f"cache:{key}")
            if value:
                # Move to end (most recently used)
                self.redis.move_to_end(f"cache:{key}")
                return json.loads(value)
            return None

        # Local cache
        if key not in self.cache:
            return None

        # Move to end (most recently used)
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: str, value: Any, ttl: int = 300):
        """
        Put item in cache.

        Args:
            key: Cache key
            value: Value to cache
            ttl: Time-to-live in seconds (default 5 minutes)
        """
        if self.redis:
            # Distributed cache with TTL
            self.redis.setex(
                f"cache:{key}",
                ttl,
                json.dumps(value)
            )
        else:
            # Local cache
            if key in self.cache:
                self.cache.move_to_end(key)
            self.cache[key] = value

            # Evict LRU if over capacity
            if len(self.cache) > self.capacity:
                self.cache.popitem(last=False)

    def invalidate(self, key: str):
        """
        Invalidate cached item.

        Args:
            key: Cache key
        """
        if self.redis:
            self.redis.delete(f"cache:{key}")
        else:
            self.cache.pop(key, None)
```

---

## Appendix A: Algorithm Complexity Summary

| Algorithm ID | Name | Time Complexity | Space Complexity |
|--------------|------|-----------------|------------------|
| ALG-04-01-01 | Risk Score Calculation | O(1) | O(1) |
| ALG-04-01-02 | Rating Modifier | O(1) | O(1) |
| ALG-04-04-01 | Benchmark Comparison | O(n) | O(n) |
| ALG-07-01-01 | Anomaly Detection | O(1) prediction | O(n*m) model |
| ALG-07-02-01 | Wash Trading Detection | O(n) sequence | O(n*h) LSTM |
| ALG-07-03-01 | Structuring Detection | O(1) streaming | O(w) window |
| ALG-10-01-01 | NAV Calculation | O(1) | O(1) |
| ALG-10-04-01 | Yield Accrual | O(n) financings | O(1) |
| ALG-10-04-02 | Yield Distribution | O(1) | O(1) |
| ALG-05-03-01 | UGT Token Specification | O(1) | O(1) |
| ALG-05-03-02 | UGT Minting | O(1) | O(1) |
| ALG-05-03-03 | UGT Redemption | O(1) | O(1) |
| ALG-05-03-04 | UGT Liquidation | O(1) | O(1) |
| ALG-05-03-05 | Asset Certification | O(1) | O(1) |
| ALG-05-03-06 | Certificate to UGT | O(1) | O(1) |
| ALG-05-03-07 | Asset Tokenization Flow | O(n) steps | O(1) |
| ALG-05-03-08 | UGT Compliance | O(1) | O(1) |
| ALG-05-03-09 | Testnet Utilities | O(1) | O(1) |
| ALG-10-03-01 | Diversification Check | O(1) | O(1) |
| ALG-10-03-02 | Pool Rebalancing | O(n²) optimization | O(n) |
| ALG-04-03-01 | Suitability Check | O(1) | O(1) |
| ALG-04-03-02 | Jurisdiction Filter | O(n) assets | O(1) |
| ALG-03-01-01 | Price Aggregation | O(n log n) sort | O(n) |
| ALG-10-05-01 | Bank Escrow Logic | O(1) | O(n) accounts |
| ALG-11-01-01 | Merkle Tree | O(n log n) build | O(n) |
| ALG-09-01-01 | LRU Cache | O(1) get/put | O(capacity) |
| ALG-09-02-01 | Kubernetes Autoscaling | O(m) metrics | O(1) |

**Total Algorithms:** 27

---

## Appendix B: Implementation Status

**Last Updated:** March 20, 2026
**Overall Progress:** 27/27 Algorithms Identified (100%)
**Implementation Progress:** 20/27 Algorithms Implemented (74%)

| Algorithm ID | Algorithm Name | Status | Implementation | Test Coverage | Audit Status |
|--------------|----------------|--------|----------------|---------------|--------------|
| ALG-04-01-01 | Risk Score Calculation | ✅ Complete | `risk_scorer.py` | 85% | Pending |
| ALG-04-01-02 | Rating Modifier | ✅ Complete | `risk_scorer.py` | 85% | Pending |
| ALG-04-04-01 | Benchmark Comparison | ✅ Complete | `risk_scorer.py` | 80% | Pending |
| ALG-07-01-01 | Anomaly Detection | ✅ MVP-2 | `fraud_detector.py` (rule-based) | 75% | Pending |
| ALG-07-02-01 | Wash Trading Detection | ✅ MVP-2 | `fraud_detector.py` (rule-based) | 75% | Pending |
| ALG-07-03-01 | Structuring Detection | ✅ Complete | `fraud_detector.py` | 85% | Pending |
| ALG-10-01-01 | NAV Calculation | ✅ Complete | `UPTToken.sol`, `yield_calculator.py` | 95% | Pending |
| ALG-10-04-01 | Yield Accrual | ✅ Complete | `UPTToken.sol`, `yield_calculator.py` | 95% | Pending |
| ALG-10-04-02 | Yield Distribution | ✅ Complete | NAV model | 95% | Pending |
| ALG-05-03-01 | UGT Token Specification | ✅ Complete | `GuaranteeToken.sol` | 90% | Pending |
| ALG-05-03-02 | UGT Minting | ✅ Complete | `GuaranteeToken.sol` | 90% | Pending |
| ALG-05-03-03 | UGT Redemption | ✅ Complete | `GuaranteeToken.sol` | 90% | Pending |
| ALG-05-03-04 | UGT Liquidation | ✅ Complete | `GuaranteeToken.sol` | 90% | Pending |
| ALG-05-03-05 | Asset Certification | ✅ Complete | `IndustrialGateway.sol` | 90% | Pending |
| ALG-05-03-06 | Certificate to UGT | ✅ Complete | `IndustrialGateway.sol` | 90% | Pending |
| ALG-05-03-07 | Asset Tokenization Flow | ✅ Complete | Multi-contract | 85% | Pending |
| ALG-05-03-08 | UGT Compliance | ✅ Complete | `GuaranteeToken.sol` | 90% | Pending |
| ALG-05-03-09 | Testnet Utilities | ✅ Complete | Both contracts | 80% | Pending |
| ALG-10-03-01 | Diversification Check | ✅ Complete | `LiquidityPool.sol` | 90% | Pending |
| ALG-10-03-02 | Pool Rebalancing | ⏳ Pending | N/A | 0% | Not Started |
| ALG-04-03-01 | Suitability Check | ✅ Complete | `compliance.py` | 85% | Pending |
| ALG-04-03-02 | Jurisdiction Filter | ✅ Complete | `JurisdictionCompliance.sol`, `compliance.py` | 95% | Pending |
| ALG-03-01-01 | Price Aggregation | ⏳ Pending | N/A | 0% | Not Started |
| ALG-10-05-01 | Bank Escrow Logic | ✅ MVP-2 | `MockEscrow.sol` | 80% | Pending |
| ALG-11-01-01 | Merkle Tree | ⏳ Pending | N/A | 0% | Not Started |
| ALG-09-01-01 | LRU Cache | ⏳ Pending | N/A | 0% | Not Started |
| ALG-09-02-01 | Kubernetes Autoscaling | ⏳ Pending | N/A | 0% | Not Started |

### Implementation Summary by Category

| Category | Total | Complete | MVP-2 | Pending | Coverage |
|----------|-------|----------|-------|---------|----------|
| **Risk Assessment (EPIC-4)** | 4 | 3 | 0 | 1 | 75% |
| **Fraud Detection (EPIC-7)** | 3 | 0 | 3 | 0 | 100% |
| **Yield & NAV (EPIC-10)** | 3 | 3 | 0 | 0 | 100% |
| **Asset Tokenization (EPIC-5)** | 9 | 9 | 0 | 0 | 100% |
| **Pool Management (EPIC-10)** | 2 | 1 | 0 | 1 | 50% |
| **Compliance (EPIC-4,7)** | 2 | 2 | 0 | 0 | 100% |
| **Gateway & Pricing (EPIC-3)** | 1 | 0 | 0 | 1 | 0% |
| **Bank Escrow (EPIC-10)** | 1 | 0 | 1 | 0 | 100% |
| **Cryptographic (EPIC-11)** | 1 | 0 | 0 | 1 | 0% |
| **Performance (EPIC-9)** | 2 | 0 | 0 | 2 | 0% |
| **TOTAL** | **27** | **17** | **4** | **6** | **78%** |

### Legend

- ✅ **Complete**: Implementation and testing complete
- ✅ **MVP-2**: Rule-based MVP-2 implementation (ML versions pending for production)
- ⏳ **Pending**: Not yet started (0% implementation)
- N/A: ML models (audited via validation, not formal audit)

### Files Created (MVP-2)

**Backend Services (Python):**
- `backend/services/MVP/yield_calculator.py` - Yield and NAV calculations
- `backend/services/MVP/risk_scorer.py` - Risk scoring algorithms (NEW)
- `backend/services/MVP/fraud_detector.py` - Fraud detection algorithms (NEW)
- `backend/api/compliance.py` - Compliance API endpoints
- `backend/api/pools.py` - Pool management API

**Smart Contracts (Solidity):**
- `contracts/MVP/GuaranteeToken.sol` - UGT collateral token
- `contracts/MVP/IndustrialGateway.sol` - Asset certification
- `contracts/MVP/UPTToken.sol` - Ujamaa Pool Token
- `contracts/MVP/LiquidityPool.sol` - Multi-pool manager
- `contracts/MVP/JurisdictionCompliance.sol` - Jurisdiction filtering
- `contracts/MVP/MockEscrow.sol` - Bank escrow mock (MVP-2)

---

**Document End**


