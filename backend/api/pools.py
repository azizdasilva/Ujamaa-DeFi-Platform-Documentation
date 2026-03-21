"""
Pool Manager API - MVP Testnet

FastAPI endpoints for liquidity pool management.

@reference SRS v2.0 Section 5.12
@reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md Section 5

@notice MVP TESTNET: This is a testnet deployment. No real funds.
"""

from fastapi import APIRouter, HTTPException, Depends, Query, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
import uuid

from services.MVP.mock_bank import get_bank_service, MockBankService
from services.MVP.mock_gdiz import get_gdiz_service, MockGDIZService
from services.MVP.yield_calculator import YieldCalculator, PoolYield
from config.MVP_config import mvp_config, get_pool_config

# Router
router = APIRouter(prefix="/api/v2/pools", tags=["Pools"])
security = HTTPBearer(auto_error=False)


# =============================================================================
# PYDANTIC MODELS
# =============================================================================

class PoolInfo(BaseModel):
    """Pool information response"""
    id: str
    name: str
    family: str
    target_yield_min: float
    target_yield_max: float
    lockup_days: int
    is_active: bool
    total_value: int
    total_value_formatted: str
    nav_per_share: int
    apy: float


class PoolStats(BaseModel):
    """Pool statistics"""
    pool_id: str
    total_value: int
    deployed_amount: int
    available_amount: int
    total_yield: int
    financing_count: int
    nav_per_share: int
    apy: float


class FinancingInfo(BaseModel):
    """Financing information"""
    id: int
    pool_family: str
    asset_class: str
    industrial: str
    principal: int
    interest_rate: int
    start_date: str
    maturity_date: str
    amount_repaid: int
    is_repaid: bool
    is_defaulted: bool


class InvestmentRequest(BaseModel):
    """Investment request"""
    pool_id: str
    amount: int = Field(..., gt=0, description="Investment amount (18 decimals)")
    investor_id: str


class RedemptionRequest(BaseModel):
    """Redemption request"""
    pool_id: str
    shares: int = Field(..., gt=0, description="Shares to redeem (18 decimals)")
    investor_id: str


class FinancingRequest(BaseModel):
    """Create financing request"""
    pool_family: str
    asset_class: str
    industrial: str
    principal: int
    interest_rate: int
    duration_days: int


class YieldStatement(BaseModel):
    """Yield statement for investor"""
    statement_id: str
    investor_id: str
    pool_id: str
    period_start: str
    period_end: str
    principal: int
    yield_earned: int
    management_fee: int
    performance_fee: int
    net_yield: int
    nav_start: int
    nav_end: int
    generated_at: str


class PortfolioPosition(BaseModel):
    """Investor portfolio position"""
    pool_id: str
    pool_name: str
    shares: int
    shares_formatted: str
    value: int
    value_formatted: str
    nav_per_share: int
    yield_earned: int
    apy: float


class PortfolioResponse(BaseModel):
    """Investor portfolio response"""
    investor_id: str
    total_value: int
    total_value_formatted: str
    positions: List[PortfolioPosition]
    total_yield_earned: int


# =============================================================================
# MOCK DATA
# =============================================================================

# Mock pools database
mock_pools: Dict[str, Dict] = {
    "POOL_INDUSTRIE": {
        "id": "POOL_INDUSTRIE",
        "name": "Pool Industrie",
        "family": "INDUSTRIE",
        "target_yield_min": 10.0,
        "target_yield_max": 12.0,
        "lockup_days": 365,
        "is_active": True,
        "total_value": 50_000_000 * 10**18,  # 50M UJEUR
        "total_shares": 50_000_000 * 10**18,
        "nav_per_share": 10**18,
        "apy": 0.11,
        "financings": []
    },
    "POOL_AGRICULTURE": {
        "id": "POOL_AGRICULTURE",
        "name": "Pool Agriculture",
        "family": "AGRICULTURE",
        "target_yield_min": 12.0,
        "target_yield_max": 15.0,
        "lockup_days": 180,
        "is_active": True,
        "total_value": 30_000_000 * 10**18,
        "total_shares": 30_000_000 * 10**18,
        "nav_per_share": 10**18,
        "apy": 0.135,
        "financings": []
    },
    "POOL_TRADE_FINANCE": {
        "id": "POOL_TRADE_FINANCE",
        "name": "Pool Trade Finance",
        "family": "TRADE_FINANCE",
        "target_yield_min": 8.0,
        "target_yield_max": 10.0,
        "lockup_days": 90,
        "is_active": True,
        "total_value": 25_000_000 * 10**18,
        "total_shares": 25_000_000 * 10**18,
        "nav_per_share": 10**18,
        "apy": 0.09,
        "financings": []
    },
    "POOL_RENEWABLE_ENERGY": {
        "id": "POOL_RENEWABLE_ENERGY",
        "name": "Pool Renewable Energy",
        "family": "RENEWABLE_ENERGY",
        "target_yield_min": 9.0,
        "target_yield_max": 11.0,
        "lockup_days": 730,
        "is_active": True,
        "total_value": 40_000_000 * 10**18,
        "total_shares": 40_000_000 * 10**18,
        "nav_per_share": 10**18,
        "apy": 0.10,
        "financings": []
    },
    "POOL_REAL_ESTATE": {
        "id": "POOL_REAL_ESTATE",
        "name": "Pool Real Estate",
        "family": "REAL_ESTATE",
        "target_yield_min": 8.0,
        "target_yield_max": 12.0,
        "lockup_days": 1095,
        "is_active": True,
        "total_value": 60_000_000 * 10**18,
        "total_shares": 60_000_000 * 10**18,
        "nav_per_share": 10**18,
        "apy": 0.10,
        "financings": []
    }
}

# Mock investor positions
mock_positions: Dict[str, Dict[str, int]] = {}

# Mock financings
mock_financings: List[Dict] = []

# Yield calculator instance
yield_calculator = YieldCalculator()


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

async def verify_auth(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[str]:
    """
    Verify authentication token.
    
    MVP: Simplified auth for testnet
    Production: Full JWT validation
    """
    if credentials is None:
        return None
    
    # MVP: Accept any token for testing
    return credentials.credentials


def format_token_amount(amount: int, decimals: int = 18) -> str:
    """Format token amount"""
    return f"{amount / 10**decimals:,.2f} UJEUR"


# =============================================================================
# POOL ENDPOINTS
# =============================================================================

@router.get("")
async def list_pools(
    family: Optional[str] = Query(None, description="Filter by pool family"),
    active_only: bool = Query(True, description="Only show active pools")
) -> List[PoolInfo]:
    """
    List all liquidity pools.
    
    - **family**: Filter by pool family (INDUSTRIE, AGRICULTURE, etc.)
    - **active_only**: Only show active pools
    
    Returns list of pools with current stats.
    """
    pools = []
    
    for pool_id, pool_data in mock_pools.items():
        if active_only and not pool_data["is_active"]:
            continue
        
        if family and pool_data["family"] != family:
            continue
        
        pools.append(PoolInfo(
            id=pool_data["id"],
            name=pool_data["name"],
            family=pool_data["family"],
            target_yield_min=pool_data["target_yield_min"],
            target_yield_max=pool_data["target_yield_max"],
            lockup_days=pool_data["lockup_days"],
            is_active=pool_data["is_active"],
            total_value=pool_data["total_value"],
            total_value_formatted=format_token_amount(pool_data["total_value"]),
            nav_per_share=pool_data["nav_per_share"],
            apy=pool_data["apy"]
        ))
    
    return pools


@router.get("/{pool_id}")
async def get_pool(pool_id: str) -> PoolInfo:
    """
    Get pool details by ID.
    
    - **pool_id**: Pool identifier (e.g., POOL_INDUSTRIE)
    """
    if pool_id not in mock_pools:
        raise HTTPException(status_code=404, detail=f"Pool not found: {pool_id}")
    
    pool_data = mock_pools[pool_id]
    
    return PoolInfo(
        id=pool_data["id"],
        name=pool_data["name"],
        family=pool_data["family"],
        target_yield_min=pool_data["target_yield_min"],
        target_yield_max=pool_data["target_yield_max"],
        lockup_days=pool_data["lockup_days"],
        is_active=pool_data["is_active"],
        total_value=pool_data["total_value"],
        total_value_formatted=format_token_amount(pool_data["total_value"]),
        nav_per_share=pool_data["nav_per_share"],
        apy=pool_data["apy"]
    )


@router.get("/{pool_id}/stats")
async def get_pool_stats(pool_id: str) -> PoolStats:
    """
    Get pool statistics.
    
    - **pool_id**: Pool identifier
    """
    if pool_id not in mock_pools:
        raise HTTPException(status_code=404, detail=f"Pool not found: {pool_id}")
    
    pool_data = mock_pools[pool_id]
    
    # Calculate deployed amount from financings
    deployed = sum(
        f["principal"] - f["amount_repaid"]
        for f in mock_financings
        if f["pool_family"] == pool_data["family"] and not f["is_repaid"]
    )
    
    return PoolStats(
        pool_id=pool_id,
        total_value=pool_data["total_value"],
        deployed_amount=deployed,
        available_amount=pool_data["total_value"] - deployed,
        total_yield=0,  # Would be calculated from actual yield
        financing_count=len([
            f for f in mock_financings
            if f["pool_family"] == pool_data["family"] and not f["is_repaid"]
        ]),
        nav_per_share=pool_data["nav_per_share"],
        apy=pool_data["apy"]
    )


# =============================================================================
# INVESTMENT ENDPOINTS
# =============================================================================

@router.post("/{pool_id}/invest")
async def invest_in_pool(
    pool_id: str,
    request: InvestmentRequest,
    auth: Optional[str] = Depends(verify_auth)
) -> Dict:
    """
    Invest in a liquidity pool.
    
    - **pool_id**: Pool identifier
    - **amount**: Investment amount in UJEUR (18 decimals)
    - **investor_id**: Investor identifier
    
    Returns UPT shares minted.
    """
    if pool_id not in mock_pools:
        raise HTTPException(status_code=404, detail=f"Pool not found: {pool_id}")
    
    pool_data = mock_pools[pool_id]
    
    if not pool_data["is_active"]:
        raise HTTPException(status_code=400, detail="Pool is not active")
    
    # Check minimum investment
    if request.amount < mvp_config.MIN_DEPOSIT:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum deposit is {format_token_amount(mvp_config.MIN_DEPOSIT)}"
        )
    
    # Check maximum investment
    if request.amount > mvp_config.MAX_DEPOSIT:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum deposit is {format_token_amount(mvp_config.MAX_DEPOSIT)}"
        )
    
    # Calculate shares to mint (1:1 at NAV)
    shares_to_mint = request.amount  # Simplified: 1:1 at NAV 1.00
    
    # Update pool
    pool_data["total_value"] += request.amount
    pool_data["total_shares"] += shares_to_mint
    
    # Update investor position
    if request.investor_id not in mock_positions:
        mock_positions[request.investor_id] = {}
    
    if pool_id not in mock_positions[request.investor_id]:
        mock_positions[request.investor_id][pool_id] = 0
    
    mock_positions[request.investor_id][pool_id] += shares_to_mint
    
    # Create mock bank transaction
    if mvp_config.MVP_TESTNET and mvp_config.MOCK_BANK:
        bank_service = get_bank_service()
        try:
            account_id = bank_service.create_escrow_account(request.investor_id)
        except Exception:
            pass  # Account might already exist
    
    return {
        "success": True,
        "pool_id": pool_id,
        "investor_id": request.investor_id,
        "amount_invested": request.amount,
        "amount_formatted": format_token_amount(request.amount),
        "shares_minted": shares_to_mint,
        "shares_formatted": format_token_amount(shares_to_mint),
        "nav_per_share": pool_data["nav_per_share"],
        "transaction_id": f"MOCK-INVEST-{uuid.uuid4().hex[:12]}",
        "timestamp": datetime.utcnow().isoformat(),
        "is_testnet": mvp_config.IS_MVP
    }


@router.post("/{pool_id}/redeem")
async def redeem_from_pool(
    pool_id: str,
    request: RedemptionRequest,
    auth: Optional[str] = Depends(verify_auth)
) -> Dict:
    """
    Redeem UPT shares for UJEUR.
    
    - **pool_id**: Pool identifier
    - **shares**: Shares to redeem (18 decimals)
    - **investor_id**: Investor identifier
    
    Returns UJEUR amount received.
    """
    if pool_id not in mock_pools:
        raise HTTPException(status_code=404, detail=f"Pool not found: {pool_id}")
    
    pool_data = mock_pools[pool_id]
    
    # Check investor has sufficient shares
    if request.investor_id not in mock_positions:
        raise HTTPException(status_code=400, detail="No positions found")
    
    if pool_id not in mock_positions[request.investor_id]:
        raise HTTPException(status_code=400, detail="No position in this pool")
    
    current_shares = mock_positions[request.investor_id][pool_id]
    if current_shares < request.shares:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient shares: {current_shares} < {request.shares}"
        )
    
    # Calculate UJEUR to return (at NAV)
    ujeur_amount = request.shares  # Simplified: 1:1 at NAV 1.00
    
    # Update pool
    pool_data["total_value"] -= ujeur_amount
    pool_data["total_shares"] -= request.shares
    
    # Update investor position
    mock_positions[request.investor_id][pool_id] -= request.shares
    
    return {
        "success": True,
        "pool_id": pool_id,
        "investor_id": request.investor_id,
        "shares_redeemed": request.shares,
        "shares_formatted": format_token_amount(request.shares),
        "ujeur_received": ujeur_amount,
        "ujeur_formatted": format_token_amount(ujeur_amount),
        "nav_per_share": pool_data["nav_per_share"],
        "transaction_id": f"MOCK-REDEEM-{uuid.uuid4().hex[:12]}",
        "timestamp": datetime.utcnow().isoformat(),
        "is_testnet": mvp_config.IS_MVP
    }


# =============================================================================
# FINANCING ENDPOINTS
# =============================================================================

@router.get("/{pool_id}/financings")
async def list_pool_financings(
    pool_id: str,
    status: Optional[str] = Query(None, description="Filter by status")
) -> List[FinancingInfo]:
    """
    List financings for a pool.
    
    - **pool_id**: Pool identifier
    - **status**: Filter by status (active, repaid, defaulted)
    """
    if pool_id not in mock_pools:
        raise HTTPException(status_code=404, detail=f"Pool not found: {pool_id}")
    
    pool_data = mock_pools[pool_id]
    
    financings = []
    for f in mock_financings:
        if f["pool_family"] != pool_data["family"]:
            continue
        
        if status == "active" and f["is_repaid"]:
            continue
        if status == "repaid" and not f["is_repaid"]:
            continue
        
        financings.append(FinancingInfo(
            id=f["id"],
            pool_family=f["pool_family"],
            asset_class=f["asset_class"],
            industrial=f["industrial"],
            principal=f["principal"],
            interest_rate=f["interest_rate"],
            start_date=f["start_date"],
            maturity_date=f["maturity_date"],
            amount_repaid=f["amount_repaid"],
            is_repaid=f["is_repaid"],
            is_defaulted=f["is_defaulted"]
        ))
    
    return financings


@router.post("/{pool_id}/financings")
async def create_financing(
    pool_id: str,
    request: FinancingRequest,
    auth: Optional[str] = Depends(verify_auth)
) -> Dict:
    """
    Create a new financing.
    
    - **pool_family**: Pool family
    - **asset_class**: Asset class
    - **industrial**: Industrial address/ID
    - **principal**: Principal amount (18 decimals)
    - **interest_rate**: Interest rate (basis points)
    - **duration_days**: Duration in days
    """
    if pool_id not in mock_pools:
        raise HTTPException(status_code=404, detail=f"Pool not found: {pool_id}")
    
    financing_id = len(mock_financings) + 1
    now = datetime.utcnow()
    
    financing = {
        "id": financing_id,
        "pool_family": request.pool_family,
        "asset_class": request.asset_class,
        "industrial": request.industrial,
        "principal": request.principal,
        "interest_rate": request.interest_rate,
        "start_date": now.isoformat(),
        "maturity_date": (now.replace(day=now.day + request.duration_days)).isoformat(),
        "amount_repaid": 0,
        "is_repaid": False,
        "is_defaulted": False
    }
    
    mock_financings.append(financing)
    
    return {
        "success": True,
        "financing_id": financing_id,
        "financing": financing,
        "timestamp": now.isoformat()
    }


@router.post("/{pool_id}/repayments")
async def record_repayment(
    pool_id: str,
    financing_id: int,
    amount: int,
    auth: Optional[str] = Depends(verify_auth)
) -> Dict:
    """
    Record a repayment from industrial.
    
    - **financing_id**: Financing ID
    - **amount**: Repayment amount (18 decimals)
    """
    # Find financing
    financing = None
    for f in mock_financings:
        if f["id"] == financing_id:
            financing = f
            break
    
    if not financing:
        raise HTTPException(
            status_code=404,
            detail=f"Financing not found: {financing_id}"
        )
    
    # Update repayment
    financing["amount_repaid"] += amount
    
    # Check if fully repaid
    total_owed = financing["principal"] + (
        financing["principal"] * financing["interest_rate"] / 10000
    )
    
    if financing["amount_repaid"] >= total_owed:
        financing["is_repaid"] = True
    
    return {
        "success": True,
        "financing_id": financing_id,
        "amount_repaid": amount,
        "total_repaid": financing["amount_repaid"],
        "is_fully_repaid": financing["is_repaid"],
        "timestamp": datetime.utcnow().isoformat()
    }


# =============================================================================
# PORTFOLIO ENDPOINTS
# =============================================================================

@router.get("/portfolio/{investor_id}")
async def get_investor_portfolio(
    investor_id: str
) -> PortfolioResponse:
    """
    Get investor portfolio.
    
    - **investor_id**: Investor identifier
    """
    positions = []
    total_value = 0
    total_yield = 0
    
    if investor_id in mock_positions:
        for pool_id, shares in mock_positions[investor_id].items():
            if pool_id not in mock_pools:
                continue
            
            pool_data = mock_pools[pool_id]
            
            # Calculate value
            value = shares  # Simplified: 1:1 at NAV 1.00
            total_value += value
            
            positions.append(PortfolioPosition(
                pool_id=pool_id,
                pool_name=pool_data["name"],
                shares=shares,
                shares_formatted=format_token_amount(shares),
                value=value,
                value_formatted=format_token_amount(value),
                nav_per_share=pool_data["nav_per_share"],
                yield_earned=0,  # Would be calculated from yield history
                apy=pool_data["apy"]
            ))
    
    return PortfolioResponse(
        investor_id=investor_id,
        total_value=total_value,
        total_value_formatted=format_token_amount(total_value),
        positions=positions,
        total_yield_earned=total_yield
    )


@router.get("/yield/statements/{investor_id}")
async def get_yield_statements(
    investor_id: str,
    pool_id: Optional[str] = Query(None)
) -> List[YieldStatement]:
    """
    Get yield statements for investor.
    
    - **investor_id**: Investor identifier
    - **pool_id**: Optional pool filter
    """
    statements = []
    
    if investor_id not in mock_positions:
        return statements
    
    for pid, shares in mock_positions[investor_id].items():
        if pool_id and pid != pool_id:
            continue
        
        if pid not in mock_pools:
            continue
        
        pool_data = mock_pools[pid]
        
        # Generate yield statement
        statement = yield_calculator.generate_yield_statement(
            investor_id=investor_id,
            pool_id=pid,
            shares=shares,
            nav_start=pool_data["nav_per_share"],
            nav_end=int(pool_data["nav_per_share"] * 1.01),  # 1% growth
            days=30
        )
        
        statements.append(YieldStatement(
            statement_id=statement.statement_id,
            investor_id=statement.investor_id,
            pool_id=statement.pool_id,
            period_start=statement.period_start,
            period_end=statement.period_end,
            principal=statement.principal,
            yield_earned=statement.yield_earned,
            management_fee=statement.management_fee,
            performance_fee=statement.performance_fee,
            net_yield=statement.net_yield,
            nav_start=statement.nav_start,
            nav_end=statement.nav_end,
            generated_at=statement.generated_at
        ))
    
    return statements


# =============================================================================
# STATS ENDPOINTS
# =============================================================================

@router.get("")
async def get_pools_overview() -> Dict:
    """
    Get overview of all pools.
    """
    total_value = sum(p["total_value"] for p in mock_pools.values())
    total_financings = len(mock_financings)
    active_financings = len([f for f in mock_financings if not f["is_repaid"]])
    
    return {
        "total_pools": len(mock_pools),
        "total_value": total_value,
        "total_value_formatted": format_token_amount(total_value),
        "total_financings": total_financings,
        "active_financings": active_financings,
        "is_testnet": mvp_config.IS_MVP,
        "testnet_notice": "🚀 MVP: Institutional Architecture - Testnet Release"
    }
