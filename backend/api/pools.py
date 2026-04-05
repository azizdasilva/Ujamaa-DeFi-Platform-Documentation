"""
Pool Manager API - MVP Testnet

FastAPI endpoints for liquidity pool management.

@reference SRS v2.0 Section 5.12
@reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md Section 5

@notice MVP TESTNET: This is a testnet deployment. No real funds.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, validator
from sqlalchemy.orm import Session
from sqlalchemy import func
import uuid

from config.database import get_db
from config.models import (
    Pool, Investment, PoolPosition, Financing,
    FinancingStatusEnum, AssetClassEnum,
    InvestorProfile, Document, ComplianceStatusEnum,
    BankAccount, BankTransaction,
    TransactionTypeEnum, TransactionStatusEnum
)
from services.MVP.mock_gdiz import get_gdiz_service, MockGDIZService
from services.MVP.yield_calculator import YieldCalculator, PoolYield
from config.MVP_config import mvp_config
from api.admin import get_threshold, check_threshold

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
    total_value: float
    total_value_formatted: str
    nav_per_share: float
    apy: float

    class Config:
        from_attributes = True


class PoolStats(BaseModel):
    """Pool statistics"""
    pool_id: str
    total_value: float
    deployed_amount: float
    available_amount: float
    total_yield: float
    financing_count: int
    nav_per_share: float
    apy: float


class FinancingInfo(BaseModel):
    """Financing information"""
    id: int
    pool_family: str
    asset_class: str
    industrial: str
    principal: float
    interest_rate: float
    start_date: str
    maturity_date: str
    amount_repaid: float
    is_repaid: bool
    is_defaulted: bool


class InvestmentRequest(BaseModel):
    """Investment request"""
    pool_id: str
    amount: float = Field(..., gt=0, description="Investment amount")
    investor_id: str


class RedemptionRequest(BaseModel):
    """Redemption request"""
    pool_id: str
    shares: float = Field(..., gt=0, description="Shares to redeem")
    investor_id: str


class FinancingRequest(BaseModel):
    """Create financing request"""
    pool_family: str
    asset_class: str
    industrial: str
    principal: float
    interest_rate: float
    duration_days: int


class YieldStatement(BaseModel):
    """Yield statement for investor"""
    statement_id: str
    investor_id: str
    pool_id: str
    period_start: str
    period_end: str
    principal: float
    yield_earned: float
    management_fee: float
    performance_fee: float
    net_yield: float
    nav_start: float
    nav_end: float
    generated_at: str


class PortfolioPosition(BaseModel):
    """Investor portfolio position"""
    pool_id: str
    pool_name: str
    shares: float
    shares_formatted: str
    value: float
    value_formatted: str
    nav_per_share: float
    yield_earned: float
    apy: float


class PortfolioResponse(BaseModel):
    """Investor portfolio response"""
    investor_id: str
    total_value: float
    total_value_formatted: str
    positions: List[PortfolioPosition]
    total_yield_earned: float


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def format_token_amount(amount: float, decimals: int = 2) -> str:
    """Format token amount for display"""
    return f"{amount:,.2f}"


def db_pool_to_pool_info(db_pool: Pool) -> PoolInfo:
    """Convert database Pool model to PoolInfo response"""
    return PoolInfo(
        id=db_pool.id,
        name=db_pool.name,
        family=db_pool.family,
        target_yield_min=db_pool.target_yield_min,
        target_yield_max=db_pool.target_yield_max,
        lockup_days=db_pool.lockup_days,
        is_active=db_pool.is_active,
        total_value=float(db_pool.total_value) if db_pool.total_value else 0,
        total_value_formatted=format_token_amount(float(db_pool.total_value) if db_pool.total_value else 0),
        nav_per_share=float(db_pool.nav_per_share),
        apy=db_pool.apy
    )


# =============================================================================
# POOL ENDPOINTS
# =============================================================================

@router.get("")
async def list_pools(
    family: Optional[str] = Query(None, description="Filter by pool family"),
    active_only: bool = Query(True, description="Only show active pools"),
    db: Session = Depends(get_db)
) -> List[PoolInfo]:
    """
    List all liquidity pools.

    - **family**: Filter by pool family (INDUSTRIE, AGRICULTURE, etc.)
    - **active_only**: Only show active pools

    Returns list of pools with current stats.
    """
    query = db.query(Pool)
    
    if active_only:
        query = query.filter(Pool.is_active == True)
    
    if family:
        query = query.filter(Pool.family == family)
    
    pools = query.all()
    return [db_pool_to_pool_info(pool) for pool in pools]


@router.get("/{pool_id}")
async def get_pool(pool_id: str, db: Session = Depends(get_db)) -> PoolInfo:
    """
    Get pool details by ID.

    - **pool_id**: Pool identifier (e.g., POOL_INDUSTRIE)
    """
    pool = db.query(Pool).filter(Pool.id == pool_id).first()
    if not pool:
        raise HTTPException(status_code=404, detail=f"Pool not found: {pool_id}")
    
    return db_pool_to_pool_info(pool)


@router.get("/{pool_id}/stats")
async def get_pool_stats(pool_id: str, db: Session = Depends(get_db)) -> PoolStats:
    """
    Get pool statistics.

    - **pool_id**: Pool identifier
    """
    pool = db.query(Pool).filter(Pool.id == pool_id).first()
    if not pool:
        raise HTTPException(status_code=404, detail=f"Pool not found: {pool_id}")
    
    # Calculate deployed amount from financings
    deployed = db.query(
        func.sum(Financing.principal - Financing.amount_repaid)
    ).filter(
        Financing.pool_family == pool.family,
        Financing.is_repaid == False
    ).scalar() or 0
    
    # Count active financings
    financing_count = db.query(func.count(Financing.id)).filter(
        Financing.pool_family == pool.family,
        Financing.is_repaid == False
    ).scalar() or 0
    
    total_value = float(pool.total_value) if pool.total_value else 0
    
    return PoolStats(
        pool_id=pool_id,
        total_value=total_value,
        deployed_amount=float(deployed),
        available_amount=total_value - float(deployed),
        total_yield=0,  # Would be calculated from actual yield history
        financing_count=financing_count,
        nav_per_share=1.0,  # Default NAV
        apy=pool.apy
    )


# =============================================================================
# INVESTMENT ENDPOINTS
# =============================================================================

class ComplianceStatus(BaseModel):
    """Investor compliance status"""
    investor_id: int
    kyc_status: str
    kyb_status: str
    is_compliant: bool
    can_invest: bool
    pending_documents: int
    message: str


@router.get("/{pool_id}/compliance-check")
async def check_investor_compliance(
    pool_id: str,
    investor_id: int,
    db: Session = Depends(get_db)
) -> ComplianceStatus:
    """
    Check if investor is compliant and can invest.
    
    - **pool_id**: Pool identifier (to verify pool exists)
    - **investor_id**: Investor identifier
    
    Returns compliance status and whether investor can proceed.
    """
    # Verify pool exists
    pool = db.query(Pool).filter(Pool.id == pool_id).first()
    if not pool:
        raise HTTPException(status_code=404, detail=f"Pool not found: {pool_id}")
    
    # Get investor profile
    investor = db.query(InvestorProfile).filter(
        InvestorProfile.id == investor_id
    ).first()
    
    if not investor:
        raise HTTPException(
            status_code=404,
            detail=f"Investor profile not found: {investor_id}"
        )
    
    # Check compliance status
    kyc_approved = investor.kyc_status == ComplianceStatusEnum.APPROVED
    kyb_approved = investor.kyb_status == ComplianceStatusEnum.APPROVED
    is_compliant = kyc_approved or kyb_approved
    
    # Count pending documents
    pending_docs = db.query(Document).filter(
        Document.investor_id == investor_id,
        Document.verification_status == ComplianceStatusEnum.PENDING
    ).count()
    
    # Determine if can invest
    can_invest = is_compliant
    
    # Generate message
    if can_invest:
        message = "Investor is compliant and can proceed with investment."
    elif pending_docs > 0:
        message = f"Compliance review pending. {pending_docs} document(s) awaiting approval from compliance officer."
    else:
        message = "KYC/KYB verification required. Please upload required documents."
    
    return ComplianceStatus(
        investor_id=investor_id,
        kyc_status=investor.kyc_status.value if investor.kyc_status else "pending",
        kyb_status=investor.kyb_status.value if investor.kyb_status else "pending",
        is_compliant=is_compliant,
        can_invest=can_invest,
        pending_documents=pending_docs,
        message=message
    )


@router.post("/{pool_id}/invest")
async def invest_in_pool(
    pool_id: str,
    request: InvestmentRequest,
    db: Session = Depends(get_db),
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Dict:
    """
    Invest in a liquidity pool.

    - **pool_id**: Pool identifier
    - **amount**: Investment amount
    - **investor_id**: Investor identifier

    Returns shares minted.
    
    @notice COMPLIANCE CHECK: Investor must have approved KYC/KYB before investing.
    """
    pool = db.query(Pool).filter(Pool.id == pool_id).first()
    if not pool:
        raise HTTPException(status_code=404, detail=f"Pool not found: {pool_id}")

    if not pool.is_active:
        raise HTTPException(status_code=400, detail="Pool is not active")

    # =============================================================================
    # COMPLIANCE CHECK - Block investment if KYC/KYB not approved
    # =============================================================================
    investor_id_int = int(request.investor_id) if request.investor_id.isdigit() else 1
    investor = db.query(InvestorProfile).filter(
        InvestorProfile.id == investor_id_int
    ).first()
    
    if not investor:
        raise HTTPException(
            status_code=404,
            detail=f"Investor profile not found: {investor_id_int}"
        )
    
    # Check if investor KYC or KYB is approved
    # (Either KYC for retail OR KYB for institutional is sufficient)
    kyc_approved = investor.kyc_status == ComplianceStatusEnum.APPROVED
    kyb_approved = investor.kyb_status == ComplianceStatusEnum.APPROVED

    if not kyc_approved and not kyb_approved:
        pending_docs = db.query(Document).filter(
            Document.investor_id == investor_id_int,
            Document.verification_status == ComplianceStatusEnum.PENDING
        ).count()

        if pending_docs > 0:
            raise HTTPException(
                status_code=403,
                detail=f"Compliance review pending. You have {pending_docs} document(s) awaiting compliance officer approval."
            )
        else:
            raise HTTPException(
                status_code=403,
                detail="KYC/KYB verification required. Please upload documents and wait for compliance approval."
            )

    # =============================================================================
    # ERC-3643 ON-CHAIN IDENTITY CHECK
    # =============================================================================
    from services.blockchain_service import get_blockchain_service

    blockchain = get_blockchain_service()
    on_chain_verified = True  # Default to True for demo mode

    if investor.wallet_address and not blockchain.is_demo:
        # Check on-chain identity verification
        on_chain_verified = blockchain.is_verified(investor.wallet_address)
        if not on_chain_verified:
            raise HTTPException(
                status_code=403,
                detail=f"Wallet {investor.wallet_address} is not verified on IdentityRegistry. " +
                       "Please complete on-chain identity verification before investing."
            )
    # =============================================================================
    
    # =============================================================================
    # BALANCE CHECK - Verify investor has sufficient funds
    # =============================================================================
    from config.models import BankAccount

    bank_account = db.query(BankAccount).filter(
        BankAccount.user_id == investor_id_int,
        BankAccount.status == 'ACTIVE'
    ).first()
    
    if not bank_account:
        # Create a default bank account with €0 balance if none exists
        # In production, investor would need to fund their account first
        raise HTTPException(
            status_code=400,
            detail="No active bank account found. Please fund your escrow account before investing."
        )
    
    # Check if investor has sufficient balance
    if bank_account.balance < request.amount:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient funds. Available balance: €{bank_account.balance:,.2f}, Investment amount: €{request.amount:,.2f}. " +
                   f"Shortfall: €{request.amount - bank_account.balance:,.2f}"
        )
    
    # Deduct from bank account (MVP - simulated)
    bank_account.balance -= request.amount
    
    # Create bank transaction record for audit trail
    bank_transaction = BankTransaction(
        tx_id=f"TXN-{uuid.uuid4().hex[:8].upper()}",
        account_id=bank_account.account_id,
        transaction_type=TransactionTypeEnum.INVESTMENT,
        amount=request.amount,
        currency="EUR",
        status=TransactionStatusEnum.CONFIRMED,
        description=f"Investment in {pool_id}",
        counterparty_account=f"POOL-{pool_id}",
        timestamp=datetime.utcnow()
    )
    db.add(bank_transaction)
    
    # Update bank account last transaction timestamp
    bank_account.last_transaction_at = datetime.utcnow()
    # =============================================================================

    # Check minimum investment (using dynamic threshold)
    min_deposit = get_threshold("MIN_DEPOSIT")
    if request.amount < min_deposit:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum deposit is €{min_deposit:,}"
        )

    # Check maximum investment (using dynamic threshold)
    max_deposit = get_threshold("MAX_DEPOSIT")
    if request.amount > max_deposit:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum deposit is €{max_deposit:,}"
        )

    # Calculate shares to mint (1:1 at NAV)
    shares_to_mint = request.amount  # Simplified: 1:1 at NAV 1.00

    # Create or update investment record
    investment = Investment(
        pool_id=pool_id,
        investor_id=investor_id_int,
        amount=request.amount,
        shares=shares_to_mint,
        nav=1.0,
        status='completed'
    )
    db.add(investment)
    
    # Update pool total value
    if pool.total_value:
        pool.total_value += request.amount
    else:
        pool.total_value = request.amount
    
    # Get or create pool position
    investor_id_int = int(request.investor_id) if request.investor_id.isdigit() else 1
    position = db.query(PoolPosition).filter(
        PoolPosition.investor_id == investor_id_int,
        PoolPosition.pool_id == pool_id
    ).first()
    
    if not position:
        position = PoolPosition(
            investor_id=investor_id_int,
            pool_id=pool_id,
            shares=shares_to_mint,
            average_nav=1.0
        )
        db.add(position)
    else:
        position.shares += shares_to_mint

    # =============================================================================
    # BLOCKCHAIN INTEGRATION - Call ULPTokenizer.deposit()
    # =============================================================================
    from services.blockchain_service import get_blockchain_service
    from config.models import BlockchainTransaction, BlockchainActionEnum, TransactionStatusEnum as TxStatus

    blockchain = get_blockchain_service()
    tx_hash = None
    explorer_url = None
    blockchain_status = TxStatus.SIMULATED

    try:
        # Get investor wallet address
        investor_wallet = investor.wallet_address

        if investor_wallet and not blockchain.is_demo:
            # Real blockchain: call deposit() on ULPTokenizer
            amount_wei = int(request.amount * 10**18)  # Convert to 18 decimals
            tx_result = blockchain.deposit(investor_wallet, amount_wei)

            tx_hash = tx_result['transaction_hash']
            explorer_url = tx_result.get('explorer_url')
            blockchain_status = TxStatus.CONFIRMED if tx_result['success'] else TxStatus.FAILED
        else:
            # Demo mode: generate properly formatted simulated hash
            import os
            tx_hash = '0x' + os.urandom(32).hex()
            explorer_url = f"{blockchain.config['explorer']}/tx/{tx_hash}"
            blockchain_status = TxStatus.SIMULATED

        # Record blockchain transaction in audit trail
        blockchain_tx = BlockchainTransaction(
            action=BlockchainActionEnum.DEPOSIT,
            contract_name="ULPTokenizer",
            function_name="deposit",
            parameters={"ujeurAmount": request.amount, "pool_id": pool_id},
            simulated_tx_hash=tx_hash if blockchain.is_demo else None,
            real_tx_hash=tx_hash if not blockchain.is_demo else None,
            block_number=None,
            status=blockchain_status,
            investor_id=investor_id_int,
            pool_id=pool_id,
            description=f"Investment of €{request.amount:,.2f} in {pool_id}",
            explorer_url=explorer_url,
        )
        db.add(blockchain_tx)

    except Exception as e:
        # Log error but don't fail the investment (DB is source of truth for MVP)
        print(f"⚠️  Blockchain deposit failed: {e}")
        tx_hash = f"0xERROR-{uuid.uuid4().hex[:58]}"
        explorer_url = None
        blockchain_status = TxStatus.FAILED

        blockchain_tx = BlockchainTransaction(
            action=BlockchainActionEnum.DEPOSIT,
            contract_name="ULPTokenizer",
            function_name="deposit",
            parameters={"ujeurAmount": request.amount, "pool_id": pool_id},
            simulated_tx_hash=tx_hash,
            status=blockchain_status,
            investor_id=investor_id_int,
            pool_id=pool_id,
            error_message=str(e),
            description=f"Investment of €{request.amount:,.2f} in {pool_id} (BLOCKCHAIN FAILED)",
        )
        db.add(blockchain_tx)
    # =============================================================================

    db.commit()

    return {
        "success": True,
        "pool_id": pool_id,
        "investor_id": request.investor_id,
        "amount_invested": request.amount,
        "amount_formatted": format_token_amount(request.amount),
        "shares_minted": shares_to_mint,
        "shares_formatted": format_token_amount(shares_to_mint),
        "nav_per_share": 1.0,
        "transaction_id": tx_hash or f"MOCK-INVEST-{uuid.uuid4().hex[:12]}",
        "explorer_url": explorer_url,
        "on_chain": not blockchain.is_demo,
        "timestamp": datetime.utcnow().isoformat(),
        "is_testnet": mvp_config.IS_MVP
    }


@router.post("/{pool_id}/redeem")
async def redeem_from_pool(
    pool_id: str,
    request: RedemptionRequest,
    db: Session = Depends(get_db),
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Dict:
    """
    Redeem shares for UJEUR.

    - **pool_id**: Pool identifier
    - **shares**: Shares to redeem
    - **investor_id**: Investor identifier

    Returns UJEUR amount received.
    """
    pool = db.query(Pool).filter(Pool.id == pool_id).first()
    if not pool:
        raise HTTPException(status_code=404, detail=f"Pool not found: {pool_id}")
    
    # Check investor has sufficient shares
    investor_id_int = int(request.investor_id) if request.investor_id.isdigit() else 1
    position = db.query(PoolPosition).filter(
        PoolPosition.investor_id == investor_id_int,
        PoolPosition.pool_id == pool_id
    ).first()
    
    if not position:
        raise HTTPException(status_code=400, detail="No position in this pool")
    
    if position.shares < request.shares:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient shares: {position.shares} < {request.shares}"
        )
    
    # Calculate UJEUR to return (at NAV)
    ujeur_amount = request.shares  # Simplified: 1:1 at NAV 1.00

    # Update pool
    if pool.total_value:
        pool.total_value -= ujeur_amount

    # Update investor position
    position.shares -= request.shares

    # =============================================================================
    # BLOCKCHAIN INTEGRATION - Call ULPTokenizer.redeem()
    # =============================================================================
    from services.blockchain_service import get_blockchain_service
    from config.models import BlockchainTransaction, BlockchainActionEnum, TransactionStatusEnum as TxStatus, InvestorProfile

    blockchain = get_blockchain_service()
    tx_hash = None
    explorer_url = None
    blockchain_status = TxStatus.SIMULATED

    try:
        # Get investor wallet address
        investor = db.query(InvestorProfile).filter(InvestorProfile.id == investor_id_int).first()
        investor_wallet = investor.wallet_address if investor else None

        if investor_wallet and not blockchain.is_demo:
            # Real blockchain: call redeem() on ULPTokenizer
            shares_wei = int(request.shares * 10**18)
            tx_result = blockchain.redeem(investor_wallet, shares_wei)

            tx_hash = tx_result['transaction_hash']
            explorer_url = tx_result.get('explorer_url')
            blockchain_status = TxStatus.CONFIRMED if tx_result['success'] else TxStatus.FAILED
        else:
            # Demo mode: generate properly formatted simulated hash
            import os
            tx_hash = '0x' + os.urandom(32).hex()
            explorer_url = f"{blockchain.config['explorer']}/tx/{tx_hash}"
            blockchain_status = TxStatus.SIMULATED

        # Record blockchain transaction in audit trail
        blockchain_tx = BlockchainTransaction(
            action=BlockchainActionEnum.REDEEM,
            contract_name="ULPTokenizer",
            function_name="redeem",
            parameters={"shares": request.shares, "pool_id": pool_id},
            simulated_tx_hash=tx_hash if blockchain.is_demo else None,
            real_tx_hash=tx_hash if not blockchain.is_demo else None,
            block_number=None,
            status=blockchain_status,
            investor_id=investor_id_int,
            pool_id=pool_id,
            description=f"Redemption of {request.shares:,.2f} shares from {pool_id}",
            explorer_url=explorer_url,
        )
        db.add(blockchain_tx)

    except Exception as e:
        print(f"⚠️  Blockchain redeem failed: {e}")
        tx_hash = f"0xERROR-{uuid.uuid4().hex[:58]}"
        explorer_url = None
        blockchain_status = TxStatus.FAILED

        blockchain_tx = BlockchainTransaction(
            action=BlockchainActionEnum.REDEEM,
            contract_name="ULPTokenizer",
            function_name="redeem",
            parameters={"shares": request.shares, "pool_id": pool_id},
            simulated_tx_hash=tx_hash,
            status=blockchain_status,
            investor_id=investor_id_int,
            pool_id=pool_id,
            error_message=str(e),
            description=f"Redemption of {request.shares:,.2f} shares from {pool_id} (BLOCKCHAIN FAILED)",
        )
        db.add(blockchain_tx)
    # =============================================================================

    db.commit()

    return {
        "success": True,
        "pool_id": pool_id,
        "investor_id": request.investor_id,
        "shares_redeemed": request.shares,
        "shares_formatted": format_token_amount(request.shares),
        "ujeur_received": ujeur_amount,
        "ujeur_formatted": format_token_amount(ujeur_amount),
        "nav_per_share": 1.0,
        "transaction_id": tx_hash or f"MOCK-REDEEM-{uuid.uuid4().hex[:12]}",
        "explorer_url": explorer_url,
        "on_chain": not blockchain.is_demo,
        "timestamp": datetime.utcnow().isoformat(),
        "is_testnet": mvp_config.IS_MVP
    }


# =============================================================================
# FINANCING ENDPOINTS
# =============================================================================

@router.get("/{pool_id}/financings")
async def list_pool_financings(
    pool_id: str,
    status: Optional[str] = Query(None, description="Filter by status"),
    db: Session = Depends(get_db)
) -> List[FinancingInfo]:
    """
    List financings for a pool.

    - **pool_id**: Pool identifier
    - **status**: Filter by status (active, repaid, defaulted)
    """
    pool = db.query(Pool).filter(Pool.id == pool_id).first()
    if not pool:
        raise HTTPException(status_code=404, detail=f"Pool not found: {pool_id}")
    
    query = db.query(Financing).filter(Financing.pool_family == pool.family)
    
    if status == "active":
        query = query.filter(Financing.is_repaid == False)
    elif status == "repaid":
        query = query.filter(Financing.is_repaid == True)
    
    financings = query.all()
    
    return [
        FinancingInfo(
            id=f.id,
            pool_family=f.pool_family,
            asset_class=f.asset_class,
            industrial=f.industrial,
            principal=float(f.principal) if f.principal else 0,
            interest_rate=float(f.interest_rate) if f.interest_rate else 0,
            start_date=f.start_date.isoformat() if f.start_date else "",
            maturity_date=f.maturity_date.isoformat() if f.maturity_date else "",
            amount_repaid=float(f.amount_repaid) if f.amount_repaid else 0,
            is_repaid=f.is_repaid,
            is_defaulted=f.is_defaulted
        )
        for f in financings
    ]


@router.post("/{pool_id}/financings")
async def create_financing(
    pool_id: str,
    request: FinancingRequest,
    db: Session = Depends(get_db),
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Dict:
    """
    Create a new financing.

    - **pool_family**: Pool family
    - **asset_class**: Asset class
    - **industrial**: Industrial address/ID
    - **principal**: Principal amount
    - **interest_rate**: Interest rate
    - **duration_days**: Duration in days
    """
    pool = db.query(Pool).filter(Pool.id == pool_id).first()
    if not pool:
        raise HTTPException(status_code=404, detail=f"Pool not found: {pool_id}")
    
    now = datetime.utcnow()
    from datetime import timedelta
    maturity_date = now + timedelta(days=request.duration_days)
    
    financing = Financing(
        pool_family=request.pool_family,
        pool_id=pool_id,
        asset_class=request.asset_class,
        industrial=request.industrial,
        principal=request.principal,
        interest_rate=request.interest_rate,
        duration_days=request.duration_days,
        start_date=now,
        maturity_date=maturity_date,
        amount_repaid=0,
        is_repaid=False,
        is_defaulted=False,
        status=FinancingStatusEnum.PENDING
    )
    db.add(financing)
    db.commit()
    db.refresh(financing)

    # =============================================================================
    # BLOCKCHAIN INTEGRATION - Call LiquidityPool.createFinancing()
    # =============================================================================
    from services.blockchain_service import get_blockchain_service
    from config.models import BlockchainTransaction, BlockchainActionEnum, TransactionStatusEnum as TxStatus

    blockchain = get_blockchain_service()
    tx_hash = None
    explorer_url = None
    blockchain_status = TxStatus.SIMULATED

    try:
        # Map pool_family string to enum value (0=INDUSTRIE, 1=AGRICULTURE, etc.)
        family_map = {
            'POOL_INDUSTRIE': 0,
            'POOL_AGRICULTURE': 1,
            'POOL_TRADE_FINANCE': 2,
            'POOL_RENEWABLE_ENERGY': 3,
            'POOL_REAL_ESTATE': 4,
        }
        pool_family_int = family_map.get(request.pool_family, 0)

        if not blockchain.is_demo:
            # Real blockchain: call createFinancing()
            principal_wei = int(request.principal * 10**18)
            interest_rate_bp = int(request.interest_rate)  # Already in basis points
            tx_result = blockchain.create_financing(
                pool_family=pool_family_int,
                asset_class=request.asset_class,
                industrial=request.industrial,
                principal=principal_wei,
                interest_rate=interest_rate_bp,
                duration_days=request.duration_days,
                certificate_id=0  # No certificate for MVP
            )

            tx_hash = tx_result['transaction_hash']
            explorer_url = tx_result.get('explorer_url')
            blockchain_status = TxStatus.CONFIRMED if tx_result['success'] else TxStatus.FAILED
        else:
            # Demo mode
            import os
            tx_hash = '0x' + os.urandom(32).hex()
            explorer_url = f"{blockchain.config['explorer']}/tx/{tx_hash}"
            blockchain_status = TxStatus.SIMULATED

        # Record in audit trail
        blockchain_tx = BlockchainTransaction(
            action=BlockchainActionEnum.CREATE_FINANCING,
            contract_name="LiquidityPool",
            function_name="createFinancing",
            parameters={
                "pool_family": request.pool_family,
                "asset_class": request.asset_class,
                "industrial": request.industrial,
                "principal": request.principal,
            },
            simulated_tx_hash=tx_hash if blockchain.is_demo else None,
            real_tx_hash=tx_hash if not blockchain.is_demo else None,
            status=blockchain_status,
            financing_id=financing.id,
            pool_id=pool_id,
            description=f"Financing of €{request.principal:,.2f} for {request.industrial}",
            explorer_url=explorer_url,
        )
        db.add(blockchain_tx)

    except Exception as e:
        print(f"⚠️  Blockchain createFinancing failed: {e}")
    # =============================================================================

    db.commit()

    return {
        "success": True,
        "financing_id": financing.id,
        "transaction_id": tx_hash,
        "explorer_url": explorer_url,
        "on_chain": not blockchain.is_demo,
        "financing": {
            "id": financing.id,
            "pool_family": financing.pool_family,
            "asset_class": financing.asset_class,
            "industrial": financing.industrial,
            "principal": float(financing.principal) if financing.principal else 0,
            "interest_rate": float(financing.interest_rate) if financing.interest_rate else 0,
            "start_date": financing.start_date.isoformat() if financing.start_date else "",
            "maturity_date": financing.maturity_date.isoformat() if financing.maturity_date else ""
        },
        "timestamp": now.isoformat()
    }


@router.post("/{pool_id}/repayments")
async def record_repayment(
    pool_id: str,
    financing_id: int,
    amount: float,
    db: Session = Depends(get_db),
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Dict:
    """
    Record a repayment from industrial.

    - **financing_id**: Financing ID
    - **amount**: Repayment amount
    """
    financing = db.query(Financing).filter(Financing.id == financing_id).first()
    if not financing:
        raise HTTPException(status_code=404, detail=f"Financing not found: {financing_id}")

    # Update repayment
    if financing.amount_repaid:
        financing.amount_repaid += amount
    else:
        financing.amount_repaid = amount

    # Check if fully repaid
    total_owed = float(financing.principal) + (
        float(financing.principal) * float(financing.interest_rate) / 10000
    )

    is_fully_repaid = financing.amount_repaid >= total_owed
    if is_fully_repaid:
        financing.is_repaid = True

    # =============================================================================
    # BLOCKCHAIN INTEGRATION - Call LiquidityPool.recordRepayment()
    # =============================================================================
    from services.blockchain_service import get_blockchain_service
    from config.models import BlockchainTransaction, BlockchainActionEnum, TransactionStatusEnum as TxStatus

    blockchain = get_blockchain_service()
    tx_hash = None
    explorer_url = None
    blockchain_status = TxStatus.SIMULATED

    try:
        amount_wei = int(amount * 10**18)

        if not blockchain.is_demo:
            # Real blockchain: call recordRepayment()
            tx_result = blockchain.record_repayment(financing_id, amount_wei)

            tx_hash = tx_result['transaction_hash']
            explorer_url = tx_result.get('explorer_url')
            blockchain_status = TxStatus.CONFIRMED if tx_result['success'] else TxStatus.FAILED
        else:
            # Demo mode
            import os
            tx_hash = '0x' + os.urandom(32).hex()
            explorer_url = f"{blockchain.config['explorer']}/tx/{tx_hash}"
            blockchain_status = TxStatus.SIMULATED

        # Record in audit trail
        blockchain_tx = BlockchainTransaction(
            action=BlockchainActionEnum.RECORD_REPAYMENT,
            contract_name="LiquidityPool",
            function_name="recordRepayment",
            parameters={"financing_id": financing_id, "amount": amount},
            simulated_tx_hash=tx_hash if blockchain.is_demo else None,
            real_tx_hash=tx_hash if not blockchain.is_demo else None,
            status=blockchain_status,
            financing_id=financing_id,
            pool_id=pool_id,
            description=f"Repayment of €{amount:,.2f} for financing #{financing_id}",
            explorer_url=explorer_url,
        )
        db.add(blockchain_tx)

        # If fully repaid, also add yield to ULPTokenizer pool
        if is_fully_repaid and not blockchain.is_demo:
            try:
                yield_amount = float(financing.amount_repaid) - float(financing.principal)
                if yield_amount > 0:
                    yield_wei = int(yield_amount * 10**18)
                    blockchain.add_yield(yield_wei, f"Financing #{financing_id}")
            except Exception as e:
                print(f"⚠️  Failed to add yield: {e}")

    except Exception as e:
        print(f"⚠️  Blockchain recordRepayment failed: {e}")
    # =============================================================================

    db.commit()

    return {
        "success": True,
        "financing_id": financing_id,
        "amount_repaid": amount,
        "total_repaid": float(financing.amount_repaid) if financing.amount_repaid else 0,
        "is_fully_repaid": is_fully_repaid,
        "transaction_id": tx_hash,
        "explorer_url": explorer_url,
        "on_chain": not blockchain.is_demo,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.post("/{pool_family}/financings/{financing_id}/review")
async def review_financing(
    pool_family: str,
    financing_id: int,
    action: str,  # "approve" or "reject"
    db: Session = Depends(get_db)
) -> Dict:
    """
    Compliance officer review for financing request.

    - **action**: "approve" or "reject"
    """
    financing = db.query(Financing).filter(Financing.id == financing_id).first()
    if not financing:
        raise HTTPException(status_code=404, detail=f"Financing not found: {financing_id}")

    if action == "approve":
        financing.status = FinancingStatusEnum.ACTIVE
    elif action == "reject":
        financing.status = FinancingStatusEnum.CANCELLED
    else:
        raise HTTPException(status_code=400, detail="Action must be 'approve' or 'reject'")

    db.commit()

    return {
        "success": True,
        "financing_id": financing_id,
        "status": financing.status.value,
        "timestamp": datetime.utcnow().isoformat()
    }


# =============================================================================
# PORTFOLIO ENDPOINTS
# =============================================================================

@router.get("/portfolio/{investor_id}")
async def get_investor_portfolio(
    investor_id: str,
    db: Session = Depends(get_db)
) -> PortfolioResponse:
    """
    Get investor portfolio.

    - **investor_id**: Investor identifier
    """
    investor_id_int = int(investor_id) if investor_id.isdigit() else 1
    
    # Query positions with joined pool data (avoids N+1)
    positions = db.query(PoolPosition).options(
        joinedload(PoolPosition.pool)
    ).filter(
        PoolPosition.investor_id == investor_id_int
    ).all()
    
    portfolio_positions = []
    total_value = 0
    total_yield = 0
    
    for position in positions:
        if not position.pool:
            continue
        
        # Calculate value (simplified: shares * NAV)
        value = float(position.shares) if position.shares else 0
        total_value += value
        
        portfolio_positions.append(PortfolioPosition(
            pool_id=position.pool_id,
            pool_name=position.pool.name if position.pool else "Unknown",
            shares=float(position.shares) if position.shares else 0,
            shares_formatted=format_token_amount(float(position.shares) if position.shares else 0),
            value=value,
            value_formatted=format_token_amount(value),
            nav_per_share=float(position.average_nav) if position.average_nav else 1.0,
            yield_earned=float(position.total_yield_earned) if position.total_yield_earned else 0,
            apy=position.pool.apy if position.pool else 0
        ))
    
    return PortfolioResponse(
        investor_id=investor_id,
        total_value=total_value,
        total_value_formatted=format_token_amount(total_value),
        positions=portfolio_positions,
        total_yield_earned=total_yield
    )


@router.get("/yield/statements/{investor_id}")
async def get_yield_statements(
    investor_id: str,
    pool_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
) -> List[YieldStatement]:
    """
    Get yield statements for investor.

    - **investor_id**: Investor identifier
    - **pool_id**: Optional pool filter
    """
    # Note: This would query from YieldStatement table in production
    # For now, return empty list as yield statements are generated periodically
    return []


# =============================================================================
# STATS ENDPOINTS
# =============================================================================

@router.get("/overview")
async def get_pools_overview(db: Session = Depends(get_db)) -> Dict:
    """
    Get overview of all pools.
    """
    total_value = db.query(func.sum(Pool.total_value)).scalar() or 0
    total_financings = db.query(func.count(Financing.id)).scalar() or 0
    active_financings = db.query(func.count(Financing.id)).filter(
        Financing.is_repaid == False
    ).scalar() or 0
    
    return {
        "total_pools": db.query(func.count(Pool.id)).scalar() or 0,
        "total_value": float(total_value),
        "total_value_formatted": format_token_amount(float(total_value)),
        "total_financings": total_financings,
        "active_financings": active_financings,
        "is_testnet": mvp_config.IS_MVP,
        "testnet_notice": "🚀 MVP: Institutional Architecture - Testnet Release"
    }
