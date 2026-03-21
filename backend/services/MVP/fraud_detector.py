"""
Fraud Detection - MVP Testnet

Fraud detection algorithms for transaction monitoring.

@reference docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md Section 4
@reference SRS v2.0 EPIC-7

@notice MVP TESTNET: This is a testnet deployment. No real funds.

Algorithms Implemented:
- ALG-07-01-01: Anomaly Detection (Isolation Forest)
- ALG-07-02-01: Wash Trading Detection (Rule-based for MVP)
- ALG-07-03-01: Structuring Detection (Rule-based)
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from decimal import Decimal
from enum import Enum
import statistics


class AlertSeverity(Enum):
    """Alert severity levels"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class AlertType(Enum):
    """Alert types"""
    ANOMALY = "ANOMALY"
    WASH_TRADING = "WASH_TRADING"
    STRUCTURING = "STRUCTURING"
    VELOCITY = "VELOCITY"
    AMOUNT_SPIKE = "AMOUNT_SPIKE"


@dataclass
class Transaction:
    """Transaction data for fraud detection"""
    tx_id: str
    wallet: str
    amount: float
    timestamp: datetime
    tx_type: str  # BUY, SELL, TRANSFER, DEPOSIT, WITHDRAWAL
    counterparty: Optional[str] = None
    ip_address: Optional[str] = None
    device_id: Optional[str] = None
    geolocation: Optional[Tuple[float, float]] = None


@dataclass
class UserBehavior:
    """User behavior profile"""
    wallet: str
    avg_amount: float = 0.0
    std_amount: float = 0.0
    avg_frequency_per_day: float = 0.0
    typical_hours: List[int] = field(default_factory=list)
    typical_days: List[int] = field(default_factory=list)
    typical_counterparties: set = field(default_factory=set)
    total_transactions: int = 0


@dataclass
class FraudAlert:
    """Fraud detection alert"""
    alert_id: str
    alert_type: AlertType
    severity: AlertSeverity
    wallet: str
    transaction_ids: List[str]
    description: str
    risk_score: float  # 0-1, higher = more risky
    detected_at: str
    details: Dict = field(default_factory=dict)


class FraudDetector:
    """
    Fraud detection engine.

    Implements algorithms from:
    - ALG-07-01-01: Anomaly Detection
    - ALG-07-02-01: Wash Trading Detection
    - ALG-07-03-01: Structuring Detection

    Reference: docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md Section 4

    MVP Note: Uses rule-based detection (simpler than ML models).
    Production: Will use Scikit-learn Isolation Forest and PyTorch LSTM.
    """

    # Thresholds
    STRUCTURING_THRESHOLD = 3000  # Below CTR threshold
    STRUCTURING_TOTAL_THRESHOLD = 10000  # Total structuring amount
    STRUCTURING_WINDOW_HOURS = 24
    WASH_TRADING_WINDOW_HOURS = 24
    VELOCITY_THRESHOLD_PER_HOUR = 10
    AMOUNT_SPIKE_SIGMAS = 3.0

    def __init__(self):
        """Initialize fraud detector"""
        self.user_profiles: Dict[str, UserBehavior] = {}
        self.transaction_history: List[Transaction] = []
        self.alerts: List[FraudAlert] = []
        self.alert_counter = 0

    def update_user_profile(self, transaction: Transaction):
        """
        Update user behavior profile with new transaction.

        Args:
            transaction: New transaction
        """
        wallet = transaction.wallet

        if wallet not in self.user_profiles:
            self.user_profiles[wallet] = UserBehavior(wallet=wallet)

        profile = self.user_profiles[wallet]

        # Update transaction count
        profile.total_transactions += 1

        # Update amount statistics
        amounts = [t.amount for t in self.transaction_history if t.wallet == wallet]
        if amounts:
            profile.avg_amount = statistics.mean(amounts)
            if len(amounts) > 1:
                profile.std_amount = statistics.stdev(amounts)

        # Update frequency
        profile.avg_frequency_per_day = profile.total_transactions / max(
            1, (datetime.now() - min(
                t.timestamp for t in self.transaction_history if t.wallet == wallet
            )).days
        )

        # Update typical hours and days
        profile.typical_hours.append(transaction.timestamp.hour)
        profile.typical_days.append(transaction.timestamp.weekday())

        # Keep only recent data (last 100)
        if len(profile.typical_hours) > 100:
            profile.typical_hours = profile.typical_hours[-100:]
            profile.typical_days = profile.typical_days[-100:]

        # Update counterparties
        if transaction.counterparty:
            profile.typical_counterparties.add(transaction.counterparty)

    def add_transaction(self, transaction: Transaction) -> List[FraudAlert]:
        """
        Add transaction and run all fraud detection checks.

        Args:
            transaction: Transaction to analyze

        Returns:
            List of fraud alerts (if any)
        """
        # Add to history
        self.transaction_history.append(transaction)

        # Update user profile
        self.update_user_profile(transaction)

        # Run detection algorithms
        alerts = []

        # 1. Anomaly Detection (ALG-07-01-01)
        anomaly_alert = self.detect_anomaly(transaction)
        if anomaly_alert:
            alerts.append(anomaly_alert)

        # 2. Structuring Detection (ALG-07-03-01)
        structuring_alerts = self.detect_structuring(transaction.wallet)
        alerts.extend(structuring_alerts)

        # 3. Velocity Check
        velocity_alert = self.detect_velocity_violation(transaction)
        if velocity_alert:
            alerts.append(velocity_alert)

        # 4. Amount Spike Detection
        spike_alert = self.detect_amount_spike(transaction)
        if spike_alert:
            alerts.append(spike_alert)

        # Store alerts
        self.alerts.extend(alerts)

        return alerts

    def detect_anomaly(self, transaction: Transaction) -> Optional[FraudAlert]:
        """
        Detect anomalous transactions using statistical methods.

        MVP: Simplified statistical anomaly detection.
        Production: Will use Scikit-learn Isolation Forest.

        Algorithm: ALG-07-01-01
        Reference: docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md Section 4.1

        Args:
            transaction: Transaction to analyze

        Returns:
            FraudAlert if anomalous, None otherwise
        """
        wallet = transaction.wallet
        profile = self.user_profiles.get(wallet)

        if not profile or profile.total_transactions < 5:
            # Not enough history
            return None

        # Check amount anomaly
        if profile.std_amount > 0:
            z_score = (transaction.amount - profile.avg_amount) / profile.std_amount

            if abs(z_score) > self.AMOUNT_SPIKE_SIGMAS:
                self.alert_counter += 1
                return FraudAlert(
                    alert_id=f"ANOMALY-{self.alert_counter:06d}",
                    alert_type=AlertType.ANOMALY,
                    severity=AlertSeverity.MEDIUM,
                    wallet=wallet,
                    transaction_ids=[transaction.tx_id],
                    description=f"Unusual transaction amount (z-score: {z_score:.2f})",
                    risk_score=min(1.0, abs(z_score) / 5.0),
                    detected_at=datetime.utcnow().isoformat(),
                    details={
                        'z_score': z_score,
                        'transaction_amount': transaction.amount,
                        'user_avg_amount': profile.avg_amount,
                        'user_std_amount': profile.std_amount
                    }
                )

        # Check time anomaly
        typical_hours = profile.typical_hours[-20:]
        if typical_hours:
            avg_hour = statistics.mean(typical_hours)
            hour_diff = abs(transaction.timestamp.hour - avg_hour)

            # Handle wraparound (23 -> 0)
            if hour_diff > 12:
                hour_diff = 24 - hour_diff

            if hour_diff > 8:  # Very unusual hour
                self.alert_counter += 1
                return FraudAlert(
                    alert_id=f"ANOMALY-{self.alert_counter:06d}",
                    alert_type=AlertType.ANOMALY,
                    severity=AlertSeverity.LOW,
                    wallet=wallet,
                    transaction_ids=[transaction.tx_id],
                    description=f"Transaction at unusual hour ({transaction.timestamp.hour}:00)",
                    risk_score=0.3,
                    detected_at=datetime.utcnow().isoformat(),
                    details={
                        'transaction_hour': transaction.timestamp.hour,
                        'user_avg_hour': avg_hour
                    }
                )

        return None

    def detect_structuring(self, wallet: str) -> List[FraudAlert]:
        """
        Detect transaction structuring (smurfing).

        Pattern: Multiple transactions below reporting threshold
        totaling above threshold within time window.

        Algorithm: ALG-07-03-01
        Reference: docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md Section 4.3

        Args:
            wallet: Wallet to check

        Returns:
            List of structuring alerts
        """
        alerts = []

        # Get recent transactions
        now = datetime.utcnow()
        window_start = now - timedelta(hours=self.STRUCTURING_WINDOW_HOURS)

        recent_txs = [
            tx for tx in self.transaction_history
            if tx.wallet == wallet and tx.timestamp >= window_start
        ]

        if len(recent_txs) < 2:
            return alerts

        # Look for structuring pattern
        # Group transactions by amount ranges
        suspicious_amounts = [
            tx for tx in recent_txs
            if self.STRUCTURING_THRESHOLD * 0.5 <= tx.amount <= self.STRUCTURING_THRESHOLD
        ]

        if len(suspicious_amounts) >= 2:
            total = sum(tx.amount for tx in suspicious_amounts)

            if total > self.STRUCTURING_TOTAL_THRESHOLD:
                self.alert_counter += 1
                alerts.append(FraudAlert(
                    alert_id=f"STRUCT-{self.alert_counter:06d}",
                    alert_type=AlertType.STRUCTURING,
                    severity=AlertSeverity.HIGH,
                    wallet=wallet,
                    transaction_ids=[tx.tx_id for tx in suspicious_amounts],
                    description=(
                        f"Potential structuring: {len(suspicious_amounts)} transactions "
                        f"totaling ${total:,.2f} within {self.STRUCTURING_WINDOW_HOURS}h"
                    ),
                    risk_score=min(1.0, total / (self.STRUCTURING_TOTAL_THRESHOLD * 2)),
                    detected_at=datetime.utcnow().isoformat(),
                    details={
                        'transaction_count': len(suspicious_amounts),
                        'total_amount': total,
                        'window_hours': self.STRUCTURING_WINDOW_HOURS,
                        'threshold': self.STRUCTURING_TOTAL_THRESHOLD
                    }
                ))

        return alerts

    def detect_velocity_violation(self, transaction: Transaction) -> Optional[FraudAlert]:
        """
        Detect unusual transaction velocity.

        Args:
            transaction: Transaction to check

        Returns:
            FraudAlert if velocity violation detected
        """
        wallet = transaction.wallet
        window_start = transaction.timestamp - timedelta(hours=1)

        # Count transactions in last hour
        recent_count = sum(
            1 for tx in self.transaction_history
            if tx.wallet == wallet and tx.timestamp >= window_start
        )

        if recent_count > self.VELOCITY_THRESHOLD_PER_HOUR:
            self.alert_counter += 1
            return FraudAlert(
                alert_id=f"VELOCITY-{self.alert_counter:06d}",
                alert_type=AlertType.VELOCITY,
                severity=AlertSeverity.MEDIUM,
                wallet=wallet,
                transaction_ids=[transaction.tx_id],
                description=f"High transaction velocity: {recent_count} txs in 1 hour",
                risk_score=min(1.0, recent_count / (self.VELOCITY_THRESHOLD_PER_HOUR * 2)),
                detected_at=datetime.utcnow().isoformat(),
                details={
                    'transaction_count': recent_count,
                    'threshold': self.VELOCITY_THRESHOLD_PER_HOUR,
                    'window': '1 hour'
                }
            )

        return None

    def detect_amount_spike(self, transaction: Transaction) -> Optional[FraudAlert]:
        """
        Detect sudden large amount increase.

        Args:
            transaction: Transaction to check

        Returns:
            FraudAlert if spike detected
        """
        wallet = transaction.wallet
        profile = self.user_profiles.get(wallet)

        if not profile or profile.total_transactions < 3:
            return None

        # Check if amount is significantly higher than average
        if profile.avg_amount > 0:
            ratio = transaction.amount / profile.avg_amount

            if ratio > 5:  # 5x average
                self.alert_counter += 1
                return FraudAlert(
                    alert_id=f"SPIKE-{self.alert_counter:06d}",
                    alert_type=AlertType.AMOUNT_SPIKE,
                    severity=AlertSeverity.MEDIUM,
                    wallet=wallet,
                    transaction_ids=[transaction.tx_id],
                    description=f"Amount spike: ${transaction.amount:,.2f} ({ratio:.1f}x average)",
                    risk_score=min(1.0, ratio / 10),
                    detected_at=datetime.utcnow().isoformat(),
                    details={
                        'transaction_amount': transaction.amount,
                        'user_avg_amount': profile.avg_amount,
                        'ratio': ratio
                    }
                )

        return None

    def detect_wash_trading(self, wallet: str) -> List[FraudAlert]:
        """
        Detect wash trading patterns.

        MVP: Simplified rule-based detection.
        Production: Will use PyTorch LSTM.

        Algorithm: ALG-07-02-01
        Reference: docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md Section 4.2

        Detection Rules:
        - Same wallet buys and sells same asset within 24h
        - Circular trading between related wallets
        - Price matching >80%

        Args:
            wallet: Wallet to check

        Returns:
            List of wash trading alerts
        """
        alerts = []
        now = datetime.utcnow()
        window_start = now - timedelta(hours=self.WASH_TRADING_WINDOW_HOURS)

        # Get recent transactions
        recent_txs = [
            tx for tx in self.transaction_history
            if tx.wallet == wallet and tx.timestamp >= window_start
        ]

        # Look for buy-sell patterns
        buys = [tx for tx in recent_txs if tx.tx_type == 'BUY']
        sells = [tx for tx in recent_txs if tx.tx_type == 'SELL']

        for buy in buys:
            for sell in sells:
                if sell.timestamp > buy.timestamp:
                    # Check if similar amount (within 20%)
                    if abs(buy.amount - sell.amount) / max(buy.amount, sell.amount) < 0.2:
                        self.alert_counter += 1
                        alerts.append(FraudAlert(
                            alert_id=f"WASH-{self.alert_counter:06d}",
                            alert_type=AlertType.WASH_TRADING,
                            severity=AlertSeverity.HIGH,
                            wallet=wallet,
                            transaction_ids=[buy.tx_id, sell.tx_id],
                            description="Potential wash trading: buy-sell pattern within 24h",
                            risk_score=0.8,
                            detected_at=datetime.utcnow().isoformat(),
                            details={
                                'buy_amount': buy.amount,
                                'sell_amount': sell.amount,
                                'time_diff_hours': (
                                    sell.timestamp - buy.timestamp
                                ).total_seconds() / 3600
                            }
                        ))

        return alerts

    def get_alerts(
        self,
        wallet: Optional[str] = None,
        alert_type: Optional[AlertType] = None,
        severity: Optional[AlertSeverity] = None
    ) -> List[FraudAlert]:
        """
        Get filtered alerts.

        Args:
            wallet: Filter by wallet
            alert_type: Filter by alert type
            severity: Filter by severity

        Returns:
            List of filtered alerts
        """
        filtered = self.alerts

        if wallet:
            filtered = [a for a in filtered if a.wallet == wallet]
        if alert_type:
            filtered = [a for a in filtered if a.alert_type == alert_type]
        if severity:
            filtered = [a for a in filtered if a.severity == severity]

        return filtered

    def get_risk_score(self, wallet: str) -> float:
        """
        Calculate overall risk score for wallet.

        Args:
            wallet: Wallet address

        Returns:
            Risk score (0-1, higher = more risky)
        """
        wallet_alerts = [a for a in self.alerts if a.wallet == wallet]

        if not wallet_alerts:
            return 0.0

        # Weight by severity
        severity_weights = {
            AlertSeverity.LOW: 0.2,
            AlertSeverity.MEDIUM: 0.5,
            AlertSeverity.HIGH: 0.8,
            AlertSeverity.CRITICAL: 1.0
        }

        weighted_sum = sum(
            severity_weights[a.severity] * a.risk_score
            for a in wallet_alerts
        )

        return min(1.0, weighted_sum / len(wallet_alerts))


# =============================================================================
# FACTORY FUNCTIONS
# =============================================================================

def create_fraud_detector() -> FraudDetector:
    """Create fraud detector instance"""
    return FraudDetector()


def format_alert(alert: FraudAlert) -> Dict:
    """Format alert for API response"""
    return {
        'alert_id': alert.alert_id,
        'alert_type': alert.alert_type.value,
        'severity': alert.severity.value,
        'wallet': alert.wallet,
        'transaction_ids': alert.transaction_ids,
        'description': alert.description,
        'risk_score': alert.risk_score,
        'detected_at': alert.detected_at,
        'details': alert.details
    }


# =============================================================================
# DEMO / TEST FUNCTIONS
# =============================================================================

def generate_demo_alerts() -> List[Dict]:
    """
    Generate demo fraud alerts for testing.

    Returns:
        List of formatted demo alerts
    """
    detector = FraudDetector()

    # Create demo transactions
    now = datetime.utcnow()

    # Normal user
    for i in range(5):
        tx = Transaction(
            tx_id=f"TX-NORMAL-{i:06d}",
            wallet="0xNormalUser123",
            amount=1000 + i * 100,
            timestamp=now - timedelta(hours=i),
            tx_type="TRANSFER"
        )
        detector.add_transaction(tx)

    # Suspicious user (structuring)
    for i in range(4):
        tx = Transaction(
            tx_id=f"TX-STRUCT-{i:06d}",
            wallet="0xSuspiciousUser456",
            amount=2500,  # Just below threshold
            timestamp=now - timedelta(hours=i * 2),
            tx_type="DEPOSIT"
        )
        detector.add_transaction(tx)

    # Get alerts
    alerts = detector.get_alerts(alert_type=AlertType.STRUCTURING)

    return [format_alert(a) for a in alerts]


if __name__ == "__main__":
    # Demo usage
    import json

    print("Fraud Detection Demo - ALG-07-01-01, ALG-07-03-01")
    print("=" * 60)

    alerts = generate_demo_alerts()
    print(json.dumps(alerts, indent=2))
