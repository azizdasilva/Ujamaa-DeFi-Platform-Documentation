"""
Risk Scorer - MVP Testnet

Asset risk score calculation engine (ALG-04-01-01, ALG-04-01-02).

@reference docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md Section 3
@reference SRS v2.0 EPIC-4, User Story 4.1

@notice MVP TESTNET: This is a testnet deployment. No real funds.
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from decimal import Decimal, ROUND_DOWN
from enum import Enum
import json


class RiskRating(Enum):
    """Asset risk rating"""
    AAA = "AAA"
    A = "A"
    BBB = "BBB"
    BB = "BB"
    B = "B"
    CCC = "CCC"
    D = "D"


@dataclass
class AssetRiskFactors:
    """Asset risk factor scores (0-100)"""
    financial_strength: float  # 20% weight
    profitability: float  # 15% weight
    cash_flow_stability: float  # 15% weight
    leverage: float  # 10% weight
    management_quality: float  # 10% weight
    industry_position: float  # 10% weight
    operational_risk: float  # 10% weight
    jurisdiction_risk: float  # 5% weight
    regulatory_risk: float  # 3% weight
    market_risk: float  # 2% weight


@dataclass
class RiskAssessment:
    """Risk assessment result"""
    asset_id: str
    composite_score: float  # 0-100
    rating: RiskRating
    rating_with_modifier: str
    percentile_rank: Optional[float] = None
    assessed_at: str = ""


class RiskScorer:
    """
    Asset risk scoring engine.

    Implements algorithms from:
    - ALG-04-01-01: Risk Score Calculation
    - ALG-04-01-02: Rating Modifier Calculation
    - ALG-04-04-01: Benchmark Comparison

    Reference: docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md Section 3
    """

    # Weights for risk factors (must sum to 1.0)
    WEIGHTS = {
        # Quantitative factors (60%)
        'financial_strength': 0.20,
        'profitability': 0.15,
        'cash_flow_stability': 0.15,
        'leverage': 0.10,
        # Qualitative factors (30%)
        'management_quality': 0.10,
        'industry_position': 0.10,
        'operational_risk': 0.10,
        # External factors (10%)
        'jurisdiction_risk': 0.05,
        'regulatory_risk': 0.03,
        'market_risk': 0.02,
    }

    # Rating thresholds (score <= threshold = rating)
    RATING_THRESHOLDS = {
        RiskRating.AAA: 10,
        RiskRating.A: 20,
        RiskRating.BBB: 35,
        RiskRating.BB: 50,
        RiskRating.B: 65,
        RiskRating.CCC: 80,
        RiskRating.D: 100,
    }

    # Rating ranges for modifier calculation
    RATING_RANGES = {
        'AAA': (0, 10),
        'A': (10, 20),
        'BBB': (20, 35),
        'BB': (35, 50),
        'B': (50, 65),
        'CCC': (65, 80),
        'D': (80, 100),
    }

    def __init__(self):
        """Initialize risk scorer"""
        self.benchmarks = self._load_default_benchmarks()

    def calculate_risk_score(self, factors: AssetRiskFactors) -> float:
        """
        Calculate composite risk score (0-100).

        Higher score = Higher risk of default.

        Args:
            factors: Asset risk factors (all normalized 0-100)

        Returns:
            Composite risk score (0-100)

        Algorithm: ALG-04-01-01
        Reference: docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md Section 3.1

        Example:
            factors = AssetRiskFactors(
                financial_strength=80,      # Strong
                profitability=70,           # Good
                cash_flow_stability=75,     # Stable
                leverage=40,                # Moderate
                management_quality=65,      # Average
                industry_position=60,       # Competitive
                operational_risk=50,        # Moderate
                jurisdiction_risk=30,       # Low risk jurisdiction
                regulatory_risk=25,         # Stable regulation
                market_risk=35              # Moderate market
            )
            score = scorer.calculate_risk_score(factors)
            # Expected: ~62.5 (B rating)
        """
        # Validate inputs
        self._validate_factors(factors)

        # Quantitative factors (60% total weight)
        quantitative_score = (
            factors.financial_strength * self.WEIGHTS['financial_strength'] +
            factors.profitability * self.WEIGHTS['profitability'] +
            factors.cash_flow_stability * self.WEIGHTS['cash_flow_stability'] +
            factors.leverage * self.WEIGHTS['leverage']
        )

        # Qualitative factors (30% total weight)
        qualitative_score = (
            factors.management_quality * self.WEIGHTS['management_quality'] +
            factors.industry_position * self.WEIGHTS['industry_position'] +
            factors.operational_risk * self.WEIGHTS['operational_risk']
        )

        # External factors (10% total weight)
        external_score = (
            factors.jurisdiction_risk * self.WEIGHTS['jurisdiction_risk'] +
            factors.regulatory_risk * self.WEIGHTS['regulatory_risk'] +
            factors.market_risk * self.WEIGHTS['market_risk']
        )

        # Composite score
        total_score = quantitative_score + qualitative_score + external_score

        # Clamp to 0-100
        return min(100.0, max(0.0, total_score))

    def score_to_rating(self, score: float) -> RiskRating:
        """
        Convert risk score to letter rating.

        Args:
            score: Risk score (0-100)

        Returns:
            RiskRating enum value

        Algorithm: ALG-04-01-01 Section 3.1.3
        Reference: docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md Section 3.1.3

        Rating Scale:
        - AAA: 0-10 (Lowest risk)
        - A: 10-20
        - BBB: 20-35 (Investment grade)
        - BB: 35-50 (Speculative)
        - B: 50-65
        - CCC: 65-80 (High risk)
        - D: 80-100 (Default/near default)
        """
        score = min(100.0, max(0.0, score))

        for rating, threshold in self.RATING_THRESHOLDS.items():
            if score <= threshold:
                return rating

        return RiskRating.D

    def calculate_rating_modifier(self, score: float, rating: RiskRating) -> str:
        """
        Calculate rating modifier (+, -, or none).

        Args:
            score: Risk score (0-100)
            rating: Base letter rating

        Returns:
            Rating with modifier (e.g., 'A+', 'BBB-')

        Algorithm: ALG-04-01-02
        Reference: docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md Section 3.2

        Modifier Logic:
        - Lower 33% of range: + (stronger)
        - Middle 33%: no modifier
        - Upper 33%: - (weaker)
        """
        if rating in [RiskRating.AAA, RiskRating.D]:
            # No modifiers for extreme ratings
            return rating.value

        min_score, max_score = self.RATING_RANGES[rating.value]
        range_size = max_score - min_score

        if range_size == 0:
            return rating.value

        # Position within range (0.0 = bottom, 1.0 = top)
        position = (score - min_score) / range_size

        if position < 0.33:
            return f"{rating.value}+"
        elif position > 0.67:
            return f"{rating.value}-"
        else:
            return rating.value

    def assess_asset(
        self,
        asset_id: str,
        factors: AssetRiskFactors,
        benchmark_data: Optional[Dict] = None
    ) -> RiskAssessment:
        """
        Perform complete asset risk assessment.

        Args:
            asset_id: Asset identifier
            factors: Risk factors
            benchmark_data: Optional benchmark data for percentile calculation

        Returns:
            RiskAssessment with score, rating, and modifiers

        Algorithm: Combined ALG-04-01-01, ALG-04-01-02, ALG-04-04-01
        """
        from datetime import datetime

        # Calculate composite score
        composite_score = self.calculate_risk_score(factors)

        # Determine base rating
        rating = self.score_to_rating(composite_score)

        # Calculate modifier
        rating_with_modifier = self.calculate_rating_modifier(
            composite_score, rating
        )

        # Calculate percentile rank if benchmark data provided
        percentile_rank = None
        if benchmark_data:
            percentile_rank = self._calculate_percentile_rank(
                composite_score, benchmark_data
            )

        return RiskAssessment(
            asset_id=asset_id,
            composite_score=round(composite_score, 2),
            rating=rating,
            rating_with_modifier=rating_with_modifier,
            percentile_rank=percentile_rank,
            assessed_at=datetime.utcnow().isoformat()
        )

    def _calculate_percentile_rank(
        self,
        score: float,
        benchmark_scores: List[float]
    ) -> float:
        """
        Calculate percentile rank within benchmark data.

        Args:
            score: Asset's risk score
            benchmark_scores: List of benchmark scores

        Returns:
            Percentile rank (0-100)
        """
        if not benchmark_scores:
            return None

        # Count scores worse than this asset (higher = more risky)
        worse_count = sum(1 for s in benchmark_scores if s > score)

        # Percentile = (worse / total) * 100
        percentile = (worse_count / len(benchmark_scores)) * 100

        return round(percentile, 2)

    def _validate_factors(self, factors: AssetRiskFactors):
        """Validate risk factor scores are in valid range"""
        fields = [
            'financial_strength', 'profitability', 'cash_flow_stability',
            'leverage', 'management_quality', 'industry_position',
            'operational_risk', 'jurisdiction_risk', 'regulatory_risk',
            'market_risk'
        ]

        for field in fields:
            value = getattr(factors, field)
            if value < 0 or value > 100:
                raise ValueError(
                    f"Risk factor '{field}' must be between 0 and 100, got {value}"
                )

    def _load_default_benchmarks(self) -> Dict:
        """Load default benchmark data"""
        # Mock benchmark data for MVP
        # In production, this would load from PostgreSQL
        return {
            'INVOICE': {
                'scores': [25, 30, 35, 40, 45, 50, 55, 60],
                'mean': 42.5,
                'std_dev': 11.18
            },
            'REAL_ESTATE': {
                'scores': [20, 25, 30, 35, 40, 45],
                'mean': 32.5,
                'std_dev': 8.66
            },
            'MANUFACTURING': {
                'scores': [30, 35, 40, 45, 50, 55, 60],
                'mean': 45,
                'std_dev': 10
            },
            'AGRICULTURE': {
                'scores': [40, 45, 50, 55, 60, 65, 70],
                'mean': 55,
                'std_dev': 10
            }
        }

    def get_benchmark_percentile(
        self,
        score: float,
        asset_class: str
    ) -> Dict:
        """
        Get asset's percentile within asset class benchmark.

        Args:
            score: Asset's risk score
            asset_class: Asset class (INVOICE, REAL_ESTATE, etc.)

        Returns:
            Dictionary with percentile information

        Algorithm: ALG-04-04-01
        Reference: docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md Section 3.3
        """
        if asset_class not in self.benchmarks:
            return {
                'asset_class': asset_class,
                'percentile': None,
                'error': f'No benchmark data for asset class: {asset_class}'
            }

        benchmark = self.benchmarks[asset_class]
        percentile = self._calculate_percentile_rank(score, benchmark['scores'])

        return {
            'asset_class': asset_class,
            'percentile': percentile,
            'benchmark_mean': benchmark['mean'],
            'benchmark_std_dev': benchmark['std_dev'],
            'score_vs_mean': score - benchmark['mean'],
            'interpretation': self._interpret_percentile(percentile)
        }

    def _interpret_percentile(self, percentile: float) -> str:
        """Interpret percentile rank"""
        if percentile is None:
            return "Unknown"
        if percentile >= 75:
            return "Lower risk than 75% of peers (Good)"
        elif percentile >= 50:
            return "Lower risk than 50% of peers (Average)"
        elif percentile >= 25:
            return "Higher risk than 50% of peers (Below Average)"
        else:
            return "Higher risk than 75% of peers (Poor)"


# =============================================================================
# FACTORY FUNCTIONS
# =============================================================================

def create_risk_factors_from_data(data: Dict) -> AssetRiskFactors:
    """
    Create AssetRiskFactors from dictionary data.

    Args:
        data: Dictionary with risk factor keys and values

    Returns:
        AssetRiskFactors object
    """
    return AssetRiskFactors(
        financial_strength=float(data.get('financial_strength', 50)),
        profitability=float(data.get('profitability', 50)),
        cash_flow_stability=float(data.get('cash_flow_stability', 50)),
        leverage=float(data.get('leverage', 50)),
        management_quality=float(data.get('management_quality', 50)),
        industry_position=float(data.get('industry_position', 50)),
        operational_risk=float(data.get('operational_risk', 50)),
        jurisdiction_risk=float(data.get('jurisdiction_risk', 50)),
        regulatory_risk=float(data.get('regulatory_risk', 50)),
        market_risk=float(data.get('market_risk', 50))
    )


def format_risk_assessment(assessment: RiskAssessment) -> Dict:
    """
    Format risk assessment for API response.

    Args:
        assessment: RiskAssessment object

    Returns:
        Dictionary formatted for API response
    """
    return {
        'asset_id': assessment.asset_id,
        'composite_score': assessment.composite_score,
        'rating': assessment.rating.value,
        'rating_with_modifier': assessment.rating_with_modifier,
        'percentile_rank': assessment.percentile_rank,
        'assessed_at': assessment.assessed_at,
        'risk_level': _get_risk_level(assessment.rating),
        'investment_grade': assessment.rating in [
            RiskRating.AAA, RiskRating.A, RiskRating.BBB
        ]
    }


def _get_risk_level(rating: RiskRating) -> str:
    """Get human-readable risk level"""
    if rating in [RiskRating.AAA, RiskRating.A]:
        return "Low Risk"
    elif rating == RiskRating.BBB:
        return "Moderate Risk (Investment Grade)"
    elif rating in [RiskRating.BB, RiskRating.B]:
        return "Speculative (High Risk)"
    else:
        return "Very High Risk (Near Default)"


# =============================================================================
# DEMO / TEST FUNCTIONS
# =============================================================================

def generate_demo_assessment() -> Dict:
    """
    Generate demo risk assessment for testing.

    Returns:
        Dictionary with demo assessment data
    """
    scorer = RiskScorer()

    # Demo asset: Manufacturing company
    factors = AssetRiskFactors(
        financial_strength=75,      # Strong
        profitability=65,           # Good
        cash_flow_stability=70,     # Stable
        leverage=45,                # Moderate
        management_quality=60,      # Average
        industry_position=55,       # Competitive
        operational_risk=50,        # Moderate
        jurisdiction_risk=25,       # Low risk (Germany)
        regulatory_risk=30,         # Stable
        market_risk=40              # Moderate
    )

    assessment = scorer.assess_asset(
        asset_id="DEMO-ASSET-001",
        factors=factors,
        benchmark_data=scorer.benchmarks.get('MANUFACTURING', {}).get('scores')
    )

    benchmark_info = scorer.get_benchmark_percentile(
        score=assessment.composite_score,
        asset_class='MANUFACTURING'
    )

    return {
        'assessment': format_risk_assessment(assessment),
        'benchmark': benchmark_info,
        'factors': {
            'quantitative_avg': (
                factors.financial_strength +
                factors.profitability +
                factors.cash_flow_stability +
                factors.leverage
            ) / 4,
            'qualitative_avg': (
                factors.management_quality +
                factors.industry_position +
                factors.operational_risk
            ) / 3,
            'external_avg': (
                factors.jurisdiction_risk +
                factors.regulatory_risk +
                factors.market_risk
            ) / 3
        }
    }


if __name__ == "__main__":
    # Demo usage
    import json

    print("Risk Scorer Demo - ALG-04-01-01, ALG-04-01-02")
    print("=" * 60)

    demo = generate_demo_assessment()
    print(json.dumps(demo, indent=2))
