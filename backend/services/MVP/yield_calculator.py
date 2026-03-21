"""
Yield Calculator - MVP-2 Testnet

Real financial math for yield calculation (not mocked).
Used by both testnet and production.

@reference SRS v2.0 Section 4.3
@reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md Section 2.2
@reference docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md

@notice This module uses REAL MATH, not simulated values.
"""

from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP
from enum import Enum


class YieldFrequency(Enum):
    """Yield accrual frequency"""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    ANNUALLY = "annually"


@dataclass
class YieldStatement:
    """Yield statement for an investor"""
    statement_id: str
    investor_id: str
    pool_id: str
    period_start: str
    period_end: str
    principal: int  # 18 decimals
    yield_earned: int  # 18 decimals
    management_fee: int  # 18 decimals
    performance_fee: int  # 18 decimals
    net_yield: int  # 18 decimals
    nav_start: int  # 18 decimals
    nav_end: int  # 18 decimals
    generated_at: str


@dataclass
class PoolYield:
    """Pool yield calculation result"""
    pool_id: str
    period_start: str
    period_end: str
    total_value_start: int  # 18 decimals
    total_value_end: int  # 18 decimals
    total_yield: int  # 18 decimals
    management_fee: int  # 18 decimals
    performance_fee: int  # 18 decimals
    net_yield_to_investors: int  # 18 decimals
    nav_start: int  # 18 decimals
    nav_end: int  # 18 decimals
    apy: float  # Annual percentage yield


class YieldCalculator:
    """
    Real yield calculation engine.
    
    This module uses REAL MATHEMATICAL FORMULAS for yield calculation.
    Not mocked - same implementation for testnet and production.
    
    Formulas:
    - Daily yield: yield_daily = principal × (APY / 365)
    - NAV per share: NAV = total_pool_value / total_shares
    - Management fee: fee = principal × (fee_rate × days / 365)
    - Performance fee: fee = (yield_earned - hurdle_yield) × performance_rate
    
    Reference: docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md
    """
    
    # Constants
    SECONDS_PER_DAY = 86400
    DAYS_PER_YEAR = 365
    BASIS_POINTS = 10000
    DECIMALS = 18  # Token decimals
    
    def __init__(
        self,
        management_fee_rate: float = 0.02,  # 2% annual
        performance_fee_rate: float = 0.20,  # 20% of yield above hurdle
        hurdle_rate: float = 0.05  # 5% minimum return
    ):
        """
        Initialize yield calculator.
        
        Args:
            management_fee_rate: Annual management fee (default 2%)
            performance_fee_rate: Performance fee rate (default 20%)
            hurdle_rate: Hurdle rate for performance fee (default 5%)
        """
        self.management_fee_rate = management_fee_rate
        self.performance_fee_rate = performance_fee_rate
        self.hurdle_rate = hurdle_rate
    
    def calculate_daily_yield(
        self,
        principal: int,
        apy: float
    ) -> int:
        """
        Calculate daily yield accrual.
        
        Formula: yield_daily = principal × (APY / 365)
        
        Args:
            principal: Principal amount (18 decimals)
            apy: Annual percentage yield (e.g., 0.10 for 10%)
            
        Returns:
            Daily yield (18 decimals, rounded down)
            
        Example:
            principal = 1,000,000 UJEUR (1e24 with 18 decimals)
            apy = 0.10 (10%)
            daily_yield = 1e24 × (0.10 / 365) = 273,972,602,739,726,027
        """
        if principal <= 0:
            return 0
        
        if apy <= 0:
            return 0
        
        # Convert to Decimal for precision
        principal_d = Decimal(principal)
        apy_d = Decimal(str(apy))
        days_d = Decimal(self.DAYS_PER_YEAR)
        
        # Calculate: principal × (APY / 365)
        daily_yield = (principal_d * apy_d / days_d).to_integral_value(
            rounding=ROUND_HALF_UP
        )
        
        return int(daily_yield)
    
    def calculate_period_yield(
        self,
        principal: int,
        apy: float,
        days: int
    ) -> int:
        """
        Calculate yield for a specific period.
        
        Formula: yield = principal × APY × (days / 365)
        
        Args:
            principal: Principal amount (18 decimals)
            apy: Annual percentage yield
            days: Number of days
            
        Returns:
            Period yield (18 decimals)
        """
        if principal <= 0 or apy <= 0 or days <= 0:
            return 0
        
        principal_d = Decimal(principal)
        apy_d = Decimal(str(apy))
        days_d = Decimal(days)
        year_d = Decimal(self.DAYS_PER_YEAR)
        
        # Calculate: principal × APY × (days / 365)
        period_yield = (principal_d * apy_d * days_d / year_d).to_integral_value(
            rounding=ROUND_HALF_UP
        )
        
        return int(period_yield)
    
    def calculate_nav_per_share(
        self,
        total_pool_value: int,
        total_shares: int
    ) -> int:
        """
        Calculate Net Asset Value per share.
        
        Formula: NAV_per_share = Total_Pool_Value / Total_Shares
        
        Args:
            total_pool_value: Total pool value (18 decimals)
            total_shares: Total shares outstanding (18 decimals)
            
        Returns:
            NAV per share (18 decimals)
            
        Note:
            Returns 1e18 (1.00) if no shares exist (initial NAV)
        """
        if total_shares == 0:
            return 10**18  # Initial NAV = 1.00
        
        total_value_d = Decimal(total_pool_value)
        total_shares_d = Decimal(total_shares)
        
        nav = (total_value_d / total_shares_d).to_integral_value(
            rounding=ROUND_HALF_UP
        )
        
        return int(nav)
    
    def calculate_investor_value(
        self,
        shares: int,
        nav_per_share: int
    ) -> int:
        """
        Calculate investor's total value.
        
        Formula: Value = shares × NAV_per_share
        
        Args:
            shares: Investor's shares (18 decimals)
            nav_per_share: NAV per share (18 decimals)
            
        Returns:
            Total value (18 decimals)
        """
        shares_d = Decimal(shares)
        nav_d = Decimal(nav_per_share)
        decimals_d = Decimal(10**18)
        
        # Value = shares × NAV / 1e18 (to maintain 18 decimals)
        value = (shares_d * nav_d / decimals_d).to_integral_value(
            rounding=ROUND_HALF_UP
        )
        
        return int(value)
    
    def calculate_management_fee(
        self,
        principal: int,
        days: int,
        fee_rate: Optional[float] = None
    ) -> int:
        """
        Calculate management fee.
        
        Formula: fee = principal × (fee_rate × days / 365)
        
        Args:
            principal: Principal amount (18 decimals)
            days: Number of days
            fee_rate: Annual fee rate (default: self.management_fee_rate)
            
        Returns:
            Management fee (18 decimals)
        """
        if principal <= 0 or days <= 0:
            return 0
        
        rate = fee_rate if fee_rate is not None else self.management_fee_rate
        
        principal_d = Decimal(principal)
        rate_d = Decimal(str(rate))
        days_d = Decimal(days)
        year_d = Decimal(self.DAYS_PER_YEAR)
        
        # Calculate: principal × (fee_rate × days / 365)
        fee = (principal_d * rate_d * days_d / year_d).to_integral_value(
            rounding=ROUND_HALF_UP
        )
        
        return int(fee)
    
    def calculate_performance_fee(
        self,
        yield_earned: int,
        principal: int,
        days: int,
        hurdle_rate: Optional[float] = None,
        performance_rate: Optional[float] = None
    ) -> int:
        """
        Calculate performance fee on yield above hurdle rate.
        
        Formula:
            hurdle_yield = principal × (hurdle_rate × days / 365)
            excess_yield = yield_earned - hurdle_yield
            performance_fee = excess_yield × performance_rate
            
        Args:
            yield_earned: Total yield earned (18 decimals)
            principal: Principal amount (18 decimals)
            days: Number of days
            hurdle_rate: Hurdle rate (default: self.hurdle_rate)
            performance_rate: Performance fee rate (default: self.performance_fee_rate)
            
        Returns:
            Performance fee (18 decimals)
        """
        if yield_earned <= 0 or principal <= 0 or days <= 0:
            return 0
        
        hurdle = hurdle_rate if hurdle_rate is not None else self.hurdle_rate
        perf_rate = performance_rate if performance_rate is not None else self.performance_fee_rate
        
        principal_d = Decimal(principal)
        yield_d = Decimal(yield_earned)
        hurdle_d = Decimal(str(hurdle))
        perf_rate_d = Decimal(str(perf_rate))
        days_d = Decimal(days)
        year_d = Decimal(self.DAYS_PER_YEAR)
        
        # Calculate hurdle yield
        hurdle_yield = (principal_d * hurdle_d * days_d / year_d).to_integral_value(
            rounding=ROUND_HALF_UP
        )
        
        # Calculate excess yield
        excess_yield = yield_d - Decimal(hurdle_yield)
        
        # No performance fee if yield doesn't exceed hurdle
        if excess_yield <= 0:
            return 0
        
        # Calculate performance fee
        fee = (excess_yield * perf_rate_d).to_integral_value(
            rounding=ROUND_HALF_UP
        )
        
        return int(fee)
    
    def calculate_net_yield(
        self,
        gross_yield: int,
        principal: int,
        days: int
    ) -> Tuple[int, int, int]:
        """
        Calculate net yield after fees.
        
        Args:
            gross_yield: Gross yield earned (18 decimals)
            principal: Principal amount (18 decimals)
            days: Number of days
            
        Returns:
            Tuple of (management_fee, performance_fee, net_yield)
        """
        management_fee = self.calculate_management_fee(principal, days)
        performance_fee = self.calculate_performance_fee(
            gross_yield, principal, days
        )
        net_yield = gross_yield - management_fee - performance_fee
        
        return (management_fee, performance_fee, net_yield)
    
    def calculate_apy(
        self,
        principal: int,
        yield_earned: int,
        days: int
    ) -> float:
        """
        Calculate Annual Percentage Yield from actual returns.
        
        Formula: APY = (yield / principal) × (365 / days) × 100
        
        Args:
            principal: Principal amount (18 decimals)
            yield_earned: Yield earned (18 decimals)
            days: Number of days
            
        Returns:
            APY as decimal (e.g., 0.10 for 10%)
        """
        if principal <= 0 or days <= 0:
            return 0.0
        
        principal_d = Decimal(principal)
        yield_d = Decimal(yield_earned)
        days_d = Decimal(days)
        year_d = Decimal(self.DAYS_PER_YEAR)
        
        # Calculate: (yield / principal) × (365 / days)
        apy = (yield_d / principal_d) * (year_d / days_d)
        
        return float(apy)
    
    def calculate_pool_yield(
        self,
        pool_id: str,
        total_value_start: int,
        total_value_end: int,
        total_shares: int,
        days: int
    ) -> PoolYield:
        """
        Calculate comprehensive pool yield.
        
        Args:
            pool_id: Pool identifier
            total_value_start: Pool value at period start (18 decimals)
            total_value_end: Pool value at period end (18 decimals)
            total_shares: Total shares outstanding (18 decimals)
            days: Period in days
            
        Returns:
            PoolYield object with all calculations
        """
        # Calculate total yield
        total_yield = total_value_end - total_value_start
        
        # Calculate fees
        management_fee = self.calculate_management_fee(
            total_value_start, days
        )
        performance_fee = self.calculate_performance_fee(
            total_yield, total_value_start, days
        )
        net_yield = total_yield - management_fee - performance_fee
        
        # Calculate NAV
        nav_start = self.calculate_nav_per_share(
            total_value_start, total_shares
        )
        nav_end = self.calculate_nav_per_share(
            total_value_end, total_shares
        )
        
        # Calculate APY
        apy = self.calculate_apy(total_value_start, total_yield, days)
        
        now = datetime.utcnow()
        period_start = (now - timedelta(days=days)).isoformat()
        period_end = now.isoformat()
        
        return PoolYield(
            pool_id=pool_id,
            period_start=period_start,
            period_end=period_end,
            total_value_start=total_value_start,
            total_value_end=total_value_end,
            total_yield=total_yield,
            management_fee=management_fee,
            performance_fee=performance_fee,
            net_yield_to_investors=net_yield,
            nav_start=nav_start,
            nav_end=nav_end,
            apy=apy
        )
    
    def generate_yield_statement(
        self,
        investor_id: str,
        pool_id: str,
        shares: int,
        nav_start: int,
        nav_end: int,
        days: int
    ) -> YieldStatement:
        """
        Generate yield statement for investor.
        
        Args:
            investor_id: Investor identifier
            pool_id: Pool identifier
            shares: Investor's shares (18 decimals)
            nav_start: NAV at period start (18 decimals)
            nav_end: NAV at period end (18 decimals)
            days: Period in days
            
        Returns:
            YieldStatement object
        """
        # Calculate principal (value at start)
        principal = self.calculate_investor_value(shares, nav_start)
        
        # Calculate value at end
        value_end = self.calculate_investor_value(shares, nav_end)
        
        # Calculate yield
        yield_earned = value_end - principal
        
        # Calculate fees
        management_fee, performance_fee, net_yield = self.calculate_net_yield(
            yield_earned, principal, days
        )
        
        now = datetime.utcnow()
        period_start = (now - timedelta(days=days)).isoformat()
        period_end = now.isoformat()
        
        return YieldStatement(
            statement_id=f"YIELD-STMT-{investor_id[:8]}-{int(now.timestamp())}",
            investor_id=investor_id,
            pool_id=pool_id,
            period_start=period_start,
            period_end=period_end,
            principal=principal,
            yield_earned=yield_earned,
            management_fee=management_fee,
            performance_fee=performance_fee,
            net_yield=net_yield,
            nav_start=nav_start,
            nav_end=nav_end,
            generated_at=now.isoformat()
        )


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def format_token_amount(amount: int, decimals: int = 18, symbol: str = "UJEUR") -> str:
    """
    Format token amount with symbol.
    
    Args:
        amount: Amount in smallest unit (18 decimals)
        decimals: Number of decimal places
        symbol: Token symbol
        
    Returns:
        Formatted string (e.g., "1,000,000.00 UJEUR")
    """
    formatted = amount / 10**decimals
    return f"{formatted:,.2f} {symbol}"


def format_percentage(value: float, decimals: int = 2) -> str:
    """
    Format percentage value.
    
    Args:
        value: Decimal value (e.g., 0.10 for 10%)
        decimals: Decimal places
        
    Returns:
        Formatted percentage string
    """
    return f"{value * 100:.{decimals}f}%"


def calculate_compound_yield(
    principal: int,
    apy: float,
    days: int,
    compound_frequency: YieldFrequency = YieldFrequency.DAILY
) -> int:
    """
    Calculate compound yield.
    
    Formula: A = P × (1 + r/n)^(n×t)
    
    Args:
        principal: Principal amount (18 decimals)
        apy: Annual percentage yield
        days: Number of days
        compound_frequency: Compounding frequency
        
    Returns:
        Total value after compound yield (18 decimals)
    """
    principal_d = Decimal(principal)
    apy_d = Decimal(str(apy))
    days_d = Decimal(days)
    year_d = Decimal(365)
    
    # Compounding periods per year
    if compound_frequency == YieldFrequency.DAILY:
        n = 365
    elif compound_frequency == YieldFrequency.WEEKLY:
        n = 52
    elif compound_frequency == YieldFrequency.MONTHLY:
        n = 12
    elif compound_frequency == YieldFrequency.QUARTERLY:
        n = 4
    else:  # ANNUALLY
        n = 1
    
    n_d = Decimal(n)
    t_d = days_d / year_d  # Time in years
    
    # Calculate: P × (1 + r/n)^(n×t)
    rate_per_period = apy_d / n_d
    periods = n_d * t_d
    
    # Using logarithm for power calculation
    base = Decimal(1) + rate_per_period
    multiplier = base ** periods
    
    total = (principal_d * multiplier).to_integral_value(
        rounding=ROUND_HALF_UP
    )
    
    return int(total)


# =============================================================================
# TESTNET DEMO DATA
# =============================================================================

def generate_demo_yield_data() -> Dict:
    """
    Generate demo yield data for testing.
    
    Returns:
        Dictionary with demo yield calculations
    """
    calculator = YieldCalculator()
    
    # Demo investment
    principal = 1_000_000 * 10**18  # 1M UJEUR
    apy = 0.10  # 10%
    days = 30
    
    # Calculate yield
    daily_yield = calculator.calculate_daily_yield(principal, apy)
    period_yield = calculator.calculate_period_yield(principal, apy, days)
    mgmt_fee = calculator.calculate_management_fee(principal, days)
    perf_fee = calculator.calculate_performance_fee(period_yield, principal, days)
    net_yield = period_yield - mgmt_fee - perf_fee
    actual_apy = calculator.calculate_apy(principal, period_yield, days)
    
    return {
        "principal": principal,
        "principal_formatted": format_token_amount(principal),
        "apy_target": apy,
        "apy_target_formatted": format_percentage(apy),
        "days": days,
        "daily_yield": daily_yield,
        "daily_yield_formatted": format_token_amount(daily_yield),
        "period_yield": period_yield,
        "period_yield_formatted": format_token_amount(period_yield),
        "management_fee": mgmt_fee,
        "management_fee_formatted": format_token_amount(mgmt_fee),
        "performance_fee": perf_fee,
        "performance_fee_formatted": format_token_amount(perf_fee),
        "net_yield": net_yield,
        "net_yield_formatted": format_token_amount(net_yield),
        "actual_apy": actual_apy,
        "actual_apy_formatted": format_percentage(actual_apy)
    }


if __name__ == "__main__":
    # Demo usage
    demo_data = generate_demo_yield_data()
    print("Yield Calculator Demo")
    print("=" * 50)
    for key, value in demo_data.items():
        if key.endswith("_formatted"):
            print(f"{key}: {value}")
