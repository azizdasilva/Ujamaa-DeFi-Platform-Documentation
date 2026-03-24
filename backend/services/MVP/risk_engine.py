"""
Risk Engine - Pool Risk Assessment

Calculates risk metrics for liquidity pools including:
- Default rate (NPL ratio)
- Concentration risk
- Weighted average credit rating
- Collateralization ratio

@reference docs/03_OPERATIONS/KPI_IMPLEMENTATION_PLAN.md
@reference docs/03_OPERATIONS/POOL_KPI_FRAMEWORK.md
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime


@dataclass
class CreditRating:
    """Credit rating with score"""
    rating: str  # AAA, AA+, AA, etc.
    score: int  # 1-100 (100 = best)
    outlook: str  # Stable, Positive, Negative


@dataclass
class PoolRiskMetrics:
    """Pool risk metrics result"""
    pool_id: str
    calculated_at: str
    
    # Default Risk
    default_rate: float  # % of defaulted financings
    non_performing_ratio: float  # NPL ratio
    provision_coverage: float  # % covered by provisions
    
    # Concentration Risk
    concentration_risk: float  # Largest single exposure %
    top5_concentration: float  # Top 5 exposures %
    herfindahl_index: float  # HHI concentration measure
    
    # Credit Quality
    weighted_credit_rating: str  # Weighted average rating
    credit_score: int  # Weighted average score (1-100)
    rating_distribution: Dict[str, float]  # % per rating bucket
    
    # Collateralization
    collateralization_ratio: float  # UGT value / deployed funds
    collateral_coverage: float  # % of exposure covered
    
    # Overall Risk
    risk_score: int  # 0-100 (100 = riskiest)
    risk_grade: str  # Low, Medium, High, Critical
    is_healthy: bool  # Overall health flag


class RiskEngine:
    """
    Risk assessment engine for liquidity pools.
    
    Calculates various risk metrics to monitor pool health
    and ensure compliance with risk limits.
    """
    
    # Credit rating scores (100 = best, 0 = worst)
    CREDIT_RATING_SCORES = {
        'AAA': 100, 'AA+': 95, 'AA': 90, 'AA-': 85,
        'A+': 80, 'A': 75, 'A-': 70,
        'BBB+': 65, 'BBB': 60, 'BBB-': 55,
        'BB+': 50, 'BB': 45, 'BB-': 40,
        'B+': 35, 'B': 30, 'B-': 25,
        'CCC': 20, 'CC': 15, 'C': 10, 'D': 0
    }
    
    # Risk thresholds
    DEFAULT_RATE_WARNING = 2.0  # %
    DEFAULT_RATE_CRITICAL = 5.0  # %
    CONCENTRATION_WARNING = 15.0  # %
    CONCENTRATION_CRITICAL = 25.0  # %
    COLLATERAL_WARNING = 125.0  # %
    COLLATERAL_CRITICAL = 100.0  # %
    
    def __init__(self):
        """Initialize risk engine"""
        pass
    
    def calculate_default_rate(
        self,
        total_deployed: int,
        defaulted_amount: int
    ) -> float:
        """
        Calculate default rate (NPL ratio).
        
        Formula: Default Rate = Defaulted Amount / Total Deployed × 100
        
        Args:
            total_deployed: Total amount deployed (18 decimals)
            defaulted_amount: Amount in default (18 decimals)
            
        Returns:
            Default rate as percentage
        """
        if total_deployed == 0:
            return 0.0
        
        total_d = Decimal(total_deployed)
        defaulted_d = Decimal(defaulted_amount)
        
        rate_d = (defaulted_d / total_d) * Decimal(100)
        return float(rate_d.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))
    
    def calculate_concentration_risk(
        self,
        total_pool_value: int,
        exposures: List[int]  # List of exposure amounts
    ) -> Tuple[float, float, float]:
        """
        Calculate concentration risk metrics.
        
        Args:
            total_pool_value: Total pool value (18 decimals)
            exposures: List of individual exposure amounts
            
        Returns:
            Tuple of (single_name_concentration, top5_concentration, HHI)
        """
        if total_pool_value == 0 or not exposures:
            return (0.0, 0.0, 0.0)
        
        total_d = Decimal(total_pool_value)
        
        # Sort exposures descending
        sorted_exposures = sorted(exposures, reverse=True)
        
        # Single name concentration (largest exposure)
        largest_d = Decimal(sorted_exposures[0])
        single_concentration = float((largest_d / total_d) * Decimal(100))
        
        # Top 5 concentration
        top5_sum = sum(Decimal(e) for e in sorted_exposures[:5])
        top5_concentration = float((top5_sum / total_d) * Decimal(100))
        
        # Herfindahl-Hirschman Index (HHI)
        hhi = sum((Decimal(e) / total_d) ** 2 for e in exposures)
        hhi_percent = float(hhi * Decimal(10000))  # Scale to 0-10000
        
        return (
            round(single_concentration, 2),
            round(top5_concentration, 2),
            round(hhi_percent, 2)
        )
    
    def calculate_weighted_credit_rating(
        self,
        ratings: List[Tuple[str, int]]  # List of (rating, principal) tuples
    ) -> Tuple[str, int]:
        """
        Calculate weighted average credit rating.
        
        Args:
            ratings: List of (rating_string, principal_amount) tuples
            
        Returns:
            Tuple of (weighted_rating, weighted_score)
        """
        if not ratings:
            return ("N/A", 0)
        
        total_score = 0
        total_principal = 0
        
        for rating, principal in ratings:
            score = self.CREDIT_RATING_SCORES.get(rating, 50)  # Default to BB
            total_score += score * principal
            total_principal += principal
        
        if total_principal == 0:
            return ("N/A", 0)
        
        weighted_score = total_score // total_principal
        
        # Convert score back to rating
        weighted_rating = 'BBB'  # Default
        for rating_name, score_threshold in self.CREDIT_RATING_SCORES.items():
            if weighted_score >= score_threshold:
                weighted_rating = rating_name
                break
        
        return (weighted_rating, weighted_score)
    
    def calculate_collateralization_ratio(
        self,
        collateral_value: int,
        deployed_amount: int
    ) -> float:
        """
        Calculate collateralization ratio.
        
        Formula: Collateralization = Collateral Value / Deployed Amount × 100
        
        Target: >125%
        
        Args:
            collateral_value: Total collateral value (UGT tokens) (18 decimals)
            deployed_amount: Total deployed amount (18 decimals)
            
        Returns:
            Collateralization ratio as percentage
        """
        if deployed_amount == 0:
            return 0.0
        
        collateral_d = Decimal(collateral_value)
        deployed_d = Decimal(deployed_amount)
        
        ratio_d = (collateral_d / deployed_d) * Decimal(100)
        return float(ratio_d.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))
    
    def calculate_risk_grade(
        self,
        default_rate: float,
        concentration: float,
        collateralization: float,
        credit_score: int
    ) -> Tuple[int, str, bool]:
        """
        Calculate overall risk grade.
        
        Args:
            default_rate: Default rate percentage
            concentration: Concentration risk percentage
            collateralization: Collateralization ratio percentage
            credit_score: Weighted credit score (0-100)
            
        Returns:
            Tuple of (risk_score, risk_grade, is_healthy)
        """
        risk_score = 0
        
        # Default rate contribution (0-40 points)
        if default_rate >= self.DEFAULT_RATE_CRITICAL:
            risk_score += 40
        elif default_rate >= self.DEFAULT_RATE_WARNING:
            risk_score += 20
        elif default_rate > 0:
            risk_score += int(default_rate * 10)
        
        # Concentration contribution (0-30 points)
        if concentration >= self.CONCENTRATION_CRITICAL:
            risk_score += 30
        elif concentration >= self.CONCENTRATION_WARNING:
            risk_score += 15
        elif concentration > 0:
            risk_score += int(concentration)
        
        # Collateralization contribution (0-20 points)
        if collateralization < self.COLLATERAL_CRITICAL:
            risk_score += 20
        elif collateralization < self.COLLATERAL_WARNING:
            risk_score += 10
        
        # Credit score contribution (0-10 points, inverted)
        credit_risk = (100 - credit_score) // 10
        risk_score += credit_risk
        
        # Determine grade
        if risk_score <= 20:
            grade = "Low"
            is_healthy = True
        elif risk_score <= 40:
            grade = "Medium"
            is_healthy = True
        elif risk_score <= 60:
            grade = "High"
            is_healthy = False
        else:
            grade = "Critical"
            is_healthy = False
        
        return (risk_score, grade, is_healthy)
    
    def assess_pool_risk(
        self,
        pool_id: str,
        total_deployed: int,
        defaulted_amount: int,
        exposures: List[int],
        credit_ratings: List[Tuple[str, int]],
        collateral_value: int,
        total_pool_value: int
    ) -> PoolRiskMetrics:
        """
        Comprehensive pool risk assessment.
        
        Args:
            pool_id: Pool identifier
            total_deployed: Total deployed amount (18 decimals)
            defaulted_amount: Amount in default (18 decimals)
            exposures: List of individual exposures
            credit_ratings: List of (rating, principal) tuples
            collateral_value: Collateral value (18 decimals)
            total_pool_value: Total pool value (18 decimals)
            
        Returns:
            PoolRiskMetrics with all risk calculations
        """
        # Calculate default rate
        default_rate = self.calculate_default_rate(total_deployed, defaulted_amount)
        
        # Calculate concentration
        single_conc, top5_conc, hhi = self.calculate_concentration_risk(
            total_pool_value, exposures
        )
        
        # Calculate weighted credit rating
        weighted_rating, credit_score = self.calculate_weighted_credit_rating(
            credit_ratings
        )
        
        # Calculate collateralization
        collateralization = self.calculate_collateralization_ratio(
            collateral_value, total_deployed
        )
        
        # Calculate risk grade
        risk_score, risk_grade, is_healthy = self.calculate_risk_grade(
            default_rate, single_conc, collateralization, credit_score
        )
        
        # Rating distribution (simplified)
        rating_dist = {}
        for rating, _ in credit_ratings:
            rating_dist[rating] = rating_dist.get(rating, 0) + 1
        total_ratings = len(credit_ratings)
        if total_ratings > 0:
            rating_dist = {
                k: round(v / total_ratings * 100, 2)
                for k, v in rating_dist.items()
            }
        
        return PoolRiskMetrics(
            pool_id=pool_id,
            calculated_at=datetime.now().isoformat(),
            default_rate=default_rate,
            non_performing_ratio=default_rate,  # Simplified
            provision_coverage=100.0 if default_rate < 2.0 else 80.0,  # Simplified
            concentration_risk=single_conc,
            top5_concentration=top5_conc,
            herfindahl_index=hhi,
            weighted_credit_rating=weighted_rating,
            credit_score=credit_score,
            rating_distribution=rating_dist,
            collateralization_ratio=collateralization,
            collateral_coverage=min(collateralization, 100.0),
            risk_score=risk_score,
            risk_grade=risk_grade,
            is_healthy=is_healthy
        )


# =============================================================================
# DEMO DATA
# =============================================================================

def generate_demo_risk_metrics(pool_id: str = "POOL-001") -> PoolRiskMetrics:
    """Generate demo risk metrics for testing"""
    engine = RiskEngine()
    
    return engine.assess_pool_risk(
        pool_id=pool_id,
        total_deployed=43_000_000 * 10**18,  # €43M deployed
        defaulted_amount=500_000 * 10**18,  # €500K defaulted
        exposures=[
            8_000_000 * 10**18,  # Largest exposure
            6_000_000 * 10**18,
            5_000_000 * 10**18,
            4_000_000 * 10**18,
            3_000_000 * 10**18,
        ],
        credit_ratings=[
            ('BBB+', 10_000_000 * 10**18),
            ('A-', 15_000_000 * 10**18),
            ('BBB', 8_000_000 * 10**18),
            ('A', 10_000_000 * 10**18),
        ],
        collateral_value=55_000_000 * 10**18,  # €55M collateral
        total_pool_value=50_000_000 * 10**18  # €50M TVL
    )


if __name__ == "__main__":
    # Demo usage
    metrics = generate_demo_risk_metrics()
    print("Pool Risk Assessment")
    print("=" * 50)
    print(f"Pool ID: {metrics.pool_id}")
    print(f"Risk Grade: {metrics.risk_grade} (Score: {metrics.risk_score})")
    print(f"Is Healthy: {metrics.is_healthy}")
    print(f"\nDefault Rate: {metrics.default_rate}%")
    print(f"Concentration Risk: {metrics.concentration_risk}%")
    print(f"Credit Rating: {metrics.weighted_credit_rating} (Score: {metrics.credit_score})")
    print(f"Collateralization: {metrics.collateralization_ratio}%")
