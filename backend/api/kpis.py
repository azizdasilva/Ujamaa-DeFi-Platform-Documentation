"""
Pool KPI API - All 18 KPIs

Endpoints for pool performance indicators:
- Financial (4 KPIs)
- Liquidity (4 KPIs)
- Risk (4 KPIs)
- Compliance (3 KPIs)
- Impact/ESG (3 KPIs)

@route /api/v1/pool/kpis
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from decimal import Decimal

router = APIRouter(prefix="/api/v1/pool", tags=["Pool KPIs"])

# Import calculation engines
import sys
sys.path.append('services/MVP')
from yield_calculator import (
    PoolYield,
    calculate_pool_kpis,
    calculate_net_apy,
    calculate_utilization_rate,
)
from risk_engine import RiskEngine, PoolRiskMetrics, generate_demo_risk_metrics
from compliance_tracker import ComplianceTracker, generate_demo_compliance_metrics
from impact_tracker import ImpactTracker, generate_demo_impact_metrics


# =============================================================================
# DEMO DATA - Replace with real blockchain data in production
# =============================================================================

def get_demo_pool_data() -> Dict:
    """Get demo pool data for all KPIs"""
    return {
        "pool_id": "POOL-INDUSTRIE-001",
        "total_pool_value": 50_000_000 * 10**18,  # €50M
        "deployed_amount": 43_750_000 * 10**18,  # €43.75M (87.5%)
        "gross_yield": 5_250_000 * 10**18,  # €5.25M
        "management_fee": 1_000_000 * 10**18,  # €1M
        "performance_fee": 500_000 * 10**18,  # €500K
        "total_shares": 48_850_000 * 10**18,  # 48.85M shares
        "days": 365,
        "projected_yield": 5_000_000 * 10**18,  # €5M
        "target_apy": 0.105,  # 10.5%
    }


# =============================================================================
# MAIN KPI ENDPOINT
# =============================================================================

@router.get("/kpis")
async def get_all_kpis(
    pool_id: str = Query("POOL-INDUSTRIE-001", description="Pool identifier"),
    pool_family: str = Query("all", description="Pool family: all, industrie, agriculture, trade, renewable, realestate"),
    include_historical: bool = Query(False, description="Include historical data")
):
    """
    Get all 18 KPIs for a specific pool or all pools.
    
    Pool families:
    - all: Aggregated across all pools
    - industrie: Manufacturing & GDIZ partners
    - agriculture: Coffee, cocoa, cotton, cashews
    - trade: Invoice tokenization
    - renewable: Solar, wind, hydro
    - realestate: Commercial & residential
    
    Returns comprehensive pool performance data across 5 categories:
    - Financial (4 KPIs)
    - Liquidity (4 KPIs)
    - Risk (4 KPIs)
    - Compliance (3 KPIs)
    - Impact/ESG (3 KPIs)
    """
    # Pool-specific demo data
    pool_data_map = {
        "all": {
            "pool_id": "ALL-POOLS",
            "total_pool_value": 50_000_000 * 10**18,
            "deployed_amount": 43_750_000 * 10**18,
            "gross_yield": 5_250_000 * 10**18,
            "management_fee": 1_000_000 * 10**18,
            "performance_fee": 500_000 * 10**18,
            "total_shares": 48_850_000 * 10**18,
            "days": 365,
            "projected_yield": 5_000_000 * 10**18,
            "target_apy": 0.105,
        },
        "industrie": {
            "pool_id": "POOL-INDUSTRIE-001",
            "total_pool_value": 15_000_000 * 10**18,
            "deployed_amount": 13_800_000 * 10**18,
            "gross_yield": 1_650_000 * 10**18,
            "management_fee": 300_000 * 10**18,
            "performance_fee": 150_000 * 10**18,
            "total_shares": 14_650_000 * 10**18,
            "days": 365,
            "projected_yield": 1_575_000 * 10**18,
            "target_apy": 0.11,
        },
        "agriculture": {
            "pool_id": "POOL-AGRICULTURE-001",
            "total_pool_value": 12_000_000 * 10**18,
            "deployed_amount": 10_620_000 * 10**18,
            "gross_yield": 1_584_000 * 10**18,
            "management_fee": 276_000 * 10**18,
            "performance_fee": 180_000 * 10**18,
            "total_shares": 11_520_000 * 10**18,
            "days": 365,
            "projected_yield": 1_440_000 * 10**18,
            "target_apy": 0.132,
        },
        "trade": {
            "pool_id": "POOL-TRADE-001",
            "total_pool_value": 10_000_000 * 10**18,
            "deployed_amount": 9_500_000 * 10**18,
            "gross_yield": 920_000 * 10**18,
            "management_fee": 190_000 * 10**18,
            "performance_fee": 80_000 * 10**18,
            "total_shares": 9_850_000 * 10**18,
            "days": 365,
            "projected_yield": 900_000 * 10**18,
            "target_apy": 0.092,
        },
        "renewable": {
            "pool_id": "POOL-RENEWABLE-001",
            "total_pool_value": 8_000_000 * 10**18,
            "deployed_amount": 6_560_000 * 10**18,
            "gross_yield": 808_000 * 10**18,
            "management_fee": 168_000 * 10**18,
            "performance_fee": 72_000 * 10**18,
            "total_shares": 7_920_000 * 10**18,
            "days": 365,
            "projected_yield": 768_000 * 10**18,
            "target_apy": 0.101,
        },
        "realestate": {
            "pool_id": "POOL-REALESTATE-001",
            "total_pool_value": 5_000_000 * 10**18,
            "deployed_amount": 3_900_000 * 10**18,
            "gross_yield": 490_000 * 10**18,
            "management_fee": 110_000 * 10**18,
            "performance_fee": 45_000 * 10**18,
            "total_shares": 4_915_000 * 10**18,
            "days": 365,
            "projected_yield": 475_000 * 10**18,
            "target_apy": 0.098,
        },
    }
    
    # Get pool data
    pool_data = pool_data_map.get(pool_family, pool_data_map["all"])
    
    # Calculate Phase 1 KPIs (Financial & Liquidity)
    phase1_kpis = calculate_pool_kpis(
        pool_id=pool_id,
        total_pool_value=pool_data["total_pool_value"],
        deployed_amount=pool_data["deployed_amount"],
        gross_yield=pool_data["gross_yield"],
        management_fee=pool_data["management_fee"],
        performance_fee=pool_data["performance_fee"],
        total_shares=pool_data["total_shares"],
        days=pool_data["days"],
        projected_yield=pool_data["projected_yield"],
        target_apy=pool_data["target_apy"],
    )
    
    # Calculate Phase 2 KPIs (Risk)
    risk_engine = RiskEngine()
    risk_metrics = generate_demo_risk_metrics(pool_id)
    
    # Calculate Phase 2 KPIs (Compliance)
    compliance_tracker = ComplianceTracker()
    compliance_metrics = generate_demo_compliance_metrics(pool_id)
    
    # Calculate Phase 3 KPIs (Impact)
    impact_tracker = ImpactTracker()
    impact_metrics = generate_demo_impact_metrics(pool_id)
    
    # Build response
    response = {
        "pool_id": pool_id,
        "calculated_at": datetime.now().isoformat(),
        "reporting_period": "2026-Q1",
        
        # Financial KPIs (4)
        "financial": {
            "net_apy": phase1_kpis.net_apy,
            "nav_per_share": phase1_kpis.nav_end / 10**18,
            "yield_variance": phase1_kpis.yield_variance,
            "expense_ratio": phase1_kpis.expense_ratio,
            "targets": {
                "net_apy": "8-12%",
                "nav_per_share": ">1.0",
                "yield_variance": "<±0.5%",
                "expense_ratio": "<2.5%",
            },
            "status": {
                "net_apy": "on_target" if 8 <= phase1_kpis.net_apy <= 12 else "off_target",
                "yield_variance": "on_target" if phase1_kpis.yield_variance < 0.5 else "warning",
                "expense_ratio": "on_target" if phase1_kpis.expense_ratio < 2.5 else "warning",
            }
        },
        
        # Liquidity KPIs (4)
        "liquidity": {
            "tvl": phase1_kpis.tvl / 10**18,
            "utilization_rate": phase1_kpis.utilization_rate,
            "cash_drag": phase1_kpis.cash_drag,
            "redemption_liquidity": phase1_kpis.redemption_liquidity / 10**18,
            "targets": {
                "tvl": "€10M-€100M+",
                "utilization_rate": "85-92%",
                "cash_drag": "<0.75%",
                "redemption_liquidity": "5-10% of TVL",
            },
            "status": {
                "utilization_rate": "on_target" if 85 <= phase1_kpis.utilization_rate <= 92 else "warning",
                "cash_drag": "on_target" if phase1_kpis.cash_drag < 0.75 else "warning",
            }
        },
        
        # Risk KPIs (4)
        "risk": {
            "default_rate": risk_metrics.default_rate,
            "concentration_risk": risk_metrics.concentration_risk,
            "credit_rating": risk_metrics.weighted_credit_rating,
            "credit_score": risk_metrics.credit_score,
            "collateralization_ratio": risk_metrics.collateralization_ratio,
            "risk_score": risk_metrics.risk_score,
            "risk_grade": risk_metrics.risk_grade,
            "is_healthy": risk_metrics.is_healthy,
            "targets": {
                "default_rate": "<2.0%",
                "concentration_risk": "<15%",
                "credit_rating": "BBB+",
                "collateralization_ratio": ">125%",
            },
            "status": {
                "default_rate": "on_target" if risk_metrics.default_rate < 2.0 else "warning",
                "concentration_risk": "on_target" if risk_metrics.concentration_risk < 15 else "warning",
                "collateralization_ratio": "on_target" if risk_metrics.collateralization_ratio > 125 else "warning",
            }
        },
        
        # Compliance KPIs (3)
        "compliance": {
            "kyc_coverage": compliance_metrics.kyc_coverage,
            "whitelisted_wallets": compliance_metrics.whitelisted_wallets,
            "jurisdiction_count": compliance_metrics.jurisdiction_count,
            "jurisdiction_distribution": compliance_metrics.jurisdiction_distribution,
            "compliance_score": compliance_metrics.compliance_score,
            "is_compliant": compliance_metrics.is_compliant,
            "pending_reviews": compliance_metrics.pending_reviews,
            "targets": {
                "kyc_coverage": "100%",
                "whitelisted_wallets": "20+",
                "jurisdiction_count": "5+",
            },
            "status": {
                "kyc_coverage": "on_target" if compliance_metrics.kyc_coverage == 100 else "critical",
                "whitelisted_wallets": "on_target" if compliance_metrics.whitelisted_wallets >= 20 else "warning",
            }
        },
        
        # Impact/ESG KPIs (3)
        "impact": {
            "industrial_growth": impact_metrics.avg_capacity_increase,
            "value_add_ratio": impact_metrics.value_add_ratio,
            "jobs_per_million": impact_metrics.jobs_per_million,
            "total_direct_jobs": impact_metrics.total_direct_jobs,
            "total_indirect_jobs": impact_metrics.total_indirect_jobs,
            "women_employment_rate": impact_metrics.women_employment_rate,
            "youth_employment_rate": impact_metrics.youth_employment_rate,
            "co2_reduction_tons": impact_metrics.total_co2_reduction,
            "renewable_energy_kwh": impact_metrics.total_renewable_energy,
            "sdg_alignment": impact_metrics.primary_sdg,
            "sdg_coverage": impact_metrics.sdg_coverage,
            "impact_score": impact_metrics.impact_score,
            "impact_grade": impact_metrics.impact_grade,
            "targets": {
                "industrial_growth": ">20% YoY",
                "value_add_ratio": ">2.5x",
                "jobs_per_million": "50-150",
            },
            "status": {
                "industrial_growth": "on_target" if impact_metrics.avg_capacity_increase > 20 else "warning",
                "value_add_ratio": "on_target" if impact_metrics.value_add_ratio > 2.5 else "warning",
            }
        },
        
        # Overall Pool Health
        "pool_health": {
            "score": calculate_pool_health_score(
                phase1_kpis, risk_metrics, compliance_metrics, impact_metrics
            ),
            "grade": calculate_pool_health_grade(
                phase1_kpis, risk_metrics, compliance_metrics, impact_metrics
            ),
            "is_healthy": risk_metrics.is_healthy and compliance_metrics.is_compliant,
        },
    }
    
    # Add historical data if requested
    if include_historical:
        response["historical"] = get_historical_kpis(pool_id)
    
    return response


# =============================================================================
# CATEGORY-SPECIFIC ENDPOINTS
# =============================================================================

@router.get("/kpis/financial")
async def get_financial_kpis(pool_id: str = Query("POOL-INDUSTRIE-001")):
    """Get Financial KPIs only (4 metrics)"""
    pool_data = get_demo_pool_data()
    kpis = calculate_pool_kpis(
        pool_id=pool_id,
        total_pool_value=pool_data["total_pool_value"],
        deployed_amount=pool_data["deployed_amount"],
        gross_yield=pool_data["gross_yield"],
        management_fee=pool_data["management_fee"],
        performance_fee=pool_data["performance_fee"],
        total_shares=pool_data["total_shares"],
        days=pool_data["days"],
        projected_yield=pool_data["projected_yield"],
        target_apy=pool_data["target_apy"],
    )
    
    return {
        "pool_id": pool_id,
        "calculated_at": datetime.now().isoformat(),
        "net_apy": kpis.net_apy,
        "nav_per_share": kpis.nav_end / 10**18,
        "yield_variance": kpis.yield_variance,
        "expense_ratio": kpis.expense_ratio,
    }


@router.get("/kpis/liquidity")
async def get_liquidity_kpis(pool_id: str = Query("POOL-INDUSTRIE-001")):
    """Get Liquidity KPIs only (4 metrics)"""
    pool_data = get_demo_pool_data()
    kpis = calculate_pool_kpis(
        pool_id=pool_id,
        total_pool_value=pool_data["total_pool_value"],
        deployed_amount=pool_data["deployed_amount"],
        gross_yield=pool_data["gross_yield"],
        management_fee=pool_data["management_fee"],
        performance_fee=pool_data["performance_fee"],
        total_shares=pool_data["total_shares"],
        days=pool_data["days"],
    )
    
    return {
        "pool_id": pool_id,
        "calculated_at": datetime.now().isoformat(),
        "tvl": kpis.tvl / 10**18,
        "utilization_rate": kpis.utilization_rate,
        "cash_drag": kpis.cash_drag,
        "redemption_liquidity": kpis.redemption_liquidity / 10**18,
    }


@router.get("/kpis/risk")
async def get_risk_kpis(pool_id: str = Query("POOL-INDUSTRIE-001")):
    """Get Risk KPIs only (4 metrics)"""
    metrics = generate_demo_risk_metrics(pool_id)
    
    return {
        "pool_id": pool_id,
        "calculated_at": metrics.calculated_at,
        "default_rate": metrics.default_rate,
        "concentration_risk": metrics.concentration_risk,
        "credit_rating": metrics.weighted_credit_rating,
        "credit_score": metrics.credit_score,
        "collateralization_ratio": metrics.collateralization_ratio,
        "risk_score": metrics.risk_score,
        "risk_grade": metrics.risk_grade,
        "is_healthy": metrics.is_healthy,
    }


@router.get("/kpis/compliance")
async def get_compliance_kpis(pool_id: str = Query("POOL-INDUSTRIE-001")):
    """Get Compliance KPIs only (3 metrics)"""
    metrics = generate_demo_compliance_metrics(pool_id)
    
    return {
        "pool_id": pool_id,
        "calculated_at": metrics.calculated_at,
        "kyc_coverage": metrics.kyc_coverage,
        "whitelisted_wallets": metrics.whitelisted_wallets,
        "jurisdiction_count": metrics.jurisdiction_count,
        "jurisdiction_distribution": metrics.jurisdiction_distribution,
        "compliance_score": metrics.compliance_score,
        "is_compliant": metrics.is_compliant,
    }


@router.get("/kpis/impact")
async def get_impact_kpis(
    pool_id: str = Query("POOL-INDUSTRIE-001"),
    period: str = Query("2026-Q1", description="Reporting period")
):
    """Get Impact/ESG KPIs only (3 metrics)"""
    metrics = generate_demo_impact_metrics(pool_id)
    
    return {
        "pool_id": pool_id,
        "reporting_period": period,
        "calculated_at": metrics.calculated_at,
        "industrial_growth": metrics.avg_capacity_increase,
        "value_add_ratio": metrics.value_add_ratio,
        "jobs_per_million": metrics.jobs_per_million,
        "total_direct_jobs": metrics.total_direct_jobs,
        "total_indirect_jobs": metrics.total_indirect_jobs,
        "women_employment_rate": metrics.women_employment_rate,
        "youth_employment_rate": metrics.youth_employment_rate,
        "co2_reduction_tons": metrics.total_co2_reduction,
        "renewable_energy_kwh": metrics.total_renewable_energy,
        "sdg_alignment": metrics.primary_sdg,
        "impact_score": metrics.impact_score,
        "impact_grade": metrics.impact_grade,
    }


# =============================================================================
# POOL HEALTH ENDPOINT
# =============================================================================

@router.get("/health")
async def get_pool_health(pool_id: str = Query("POOL-INDUSTRIE-001")):
    """
    Get overall pool health status.
    
    Composite score based on all KPI categories.
    """
    risk_metrics = generate_demo_risk_metrics(pool_id)
    compliance_metrics = generate_demo_compliance_metrics(pool_id)
    pool_data = get_demo_pool_data()
    kpis = calculate_pool_kpis(
        pool_id=pool_id,
        total_pool_value=pool_data["total_pool_value"],
        deployed_amount=pool_data["deployed_amount"],
        gross_yield=pool_data["gross_yield"],
        management_fee=pool_data["management_fee"],
        performance_fee=pool_data["performance_fee"],
        total_shares=pool_data["total_shares"],
        days=pool_data["days"],
    )
    impact_metrics = generate_demo_impact_metrics(pool_id)
    
    score = calculate_pool_health_score(kpis, risk_metrics, compliance_metrics, impact_metrics)
    grade = calculate_pool_health_grade(kpis, risk_metrics, compliance_metrics, impact_metrics)
    
    return {
        "pool_id": pool_id,
        "calculated_at": datetime.now().isoformat(),
        "health_score": score,
        "health_grade": grade,
        "is_healthy": risk_metrics.is_healthy and compliance_metrics.is_compliant,
        "components": {
            "financial": "good" if 8 <= kpis.net_apy <= 12 else "warning",
            "liquidity": "good" if 85 <= kpis.utilization_rate <= 92 else "warning",
            "risk": risk_metrics.risk_grade.lower(),
            "compliance": "compliant" if compliance_metrics.is_compliant else "non-compliant",
            "impact": impact_metrics.impact_grade.lower(),
        },
    }


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def calculate_pool_health_score(
    financial: PoolYield,
    risk: PoolRiskMetrics,
    compliance,
    impact
) -> int:
    """Calculate overall pool health score (0-100)"""
    score = 0
    
    # Financial (25 points)
    if 8 <= financial.net_apy <= 12:
        score += 25
    elif 6 <= financial.net_apy < 8 or 12 < financial.net_apy <= 14:
        score += 15
    
    # Liquidity (25 points)
    if 85 <= financial.utilization_rate <= 92:
        score += 25
    elif 75 <= financial.utilization_rate < 85 or 92 < financial.utilization_rate <= 95:
        score += 15
    
    # Risk (25 points)
    score += max(0, 25 - risk.risk_score // 4)
    
    # Compliance (15 points)
    if compliance.is_compliant:
        score += 15
    elif compliance.compliance_score >= 80:
        score += 10
    
    # Impact (10 points)
    if impact.impact_score >= 60:
        score += 10
    elif impact.impact_score >= 40:
        score += 5
    
    return min(100, score)


def calculate_pool_health_grade(
    financial: PoolYield,
    risk: PoolRiskMetrics,
    compliance,
    impact
) -> str:
    """Calculate overall pool health grade"""
    score = calculate_pool_health_score(financial, risk, compliance, impact)
    
    if score >= 80:
        return "Excellent"
    elif score >= 60:
        return "Good"
    elif score >= 40:
        return "Fair"
    else:
        return "Poor"


def get_historical_kpis(pool_id: str, days: int = 30) -> Dict:
    """Get historical KPI data (mock implementation)"""
    # In production, this would query the database
    return {
        "period": f"Last {days} days",
        "data_points": days,
        "note": "Historical data not yet implemented - requires database integration",
    }
