"""
Database API - Ujamaa DeFi Platform

REST API endpoints for database operations.
All data is stored in SQLite/PostgreSQL database.

@notice: Replaces mock in-memory data with persistent database storage
"""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from config.database import get_database_url
from config.models import (
    User, InvestorProfile, Pool, Investment, Document,
    ULTTransaction, Transaction, ComplianceStatusEnum
)

router = APIRouter(prefix="/api/v2/db", tags=["Database"])

# Database connection
engine = create_engine(get_database_url())


def get_db():
    """Get database session."""
    from sqlalchemy.orm import sessionmaker
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =============================================================================
# PYDANTIC MODELS (API Schemas)
# =============================================================================

class UserProfileResponse(BaseModel):
    id: int
    email: str
    role: str
    wallet_address: Optional[str]
    full_name: Optional[str]
    company_name: Optional[str]
    jurisdiction: str
    kyc_status: str
    kyb_status: str
    ult_tokens: float
    total_invested: float


class PoolResponse(BaseModel):
    id: str
    name: str
    family: str
    apy: float
    total_value: float
    target_yield_min: float
    target_yield_max: float
    lockup_days: int


class DocumentResponse(BaseModel):
    id: int
    investor_id: int
    document_type: str
    document_name: str
    verification_status: str
    submitted_at: str
    deadline_at: str
    time_remaining_hours: Optional[float]


class InvestmentResponse(BaseModel):
    id: int
    pool_id: str
    amount: float
    ult_tokens: float
    status: str
    created_at: str


# =============================================================================
# USER & PROFILE ENDPOINTS
# =============================================================================

@router.get("/users/{user_id}/profile", response_model=UserProfileResponse)
async def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    """
    Get user profile with investor details.
    
    Returns complete user information including KYC status and uLT balance.
    """
    profile = db.query(InvestorProfile).filter(
        InvestorProfile.user_id == user_id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    user = db.query(User).filter(User.id == user_id).first()
    
    return UserProfileResponse(
        id=user.id,
        email=user.email,
        role=user.role.value,
        wallet_address=user.wallet_address or profile.wallet_address,
        full_name=profile.full_name,
        company_name=profile.company_name,
        jurisdiction=profile.jurisdiction,
        kyc_status=profile.kyc_status.value,
        kyb_status=profile.kyb_status.value,
        ult_tokens=float(profile.ult_tokens),
        total_invested=float(profile.total_invested),
    )


@router.get("/users/{wallet_address}/profile")
async def get_profile_by_wallet(wallet_address: str, db: Session = Depends(get_db)):
    """
    Get user profile by wallet address.
    
    Useful for wallet-based authentication.
    """
    profile = db.query(InvestorProfile).filter(
        InvestorProfile.wallet_address == wallet_address
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    user = db.query(User).filter(User.id == profile.user_id).first()
    
    return {
        'user': {
            'id': user.id,
            'email': user.email,
            'role': user.role.value,
        },
        'profile': {
            'full_name': profile.full_name,
            'company_name': profile.company_name,
            'jurisdiction': profile.jurisdiction,
            'kyc_status': profile.kyc_status.value,
            'ult_tokens': float(profile.ult_tokens),
        }
    }


# =============================================================================
# POOL ENDPOINTS
# =============================================================================

@router.get("/pools", response_model=List[PoolResponse])
async def get_all_pools(db: Session = Depends(get_db)):
    """
    Get all investment pools.
    
    Returns list of all pools with their current KPIs.
    """
    pools = db.query(Pool).filter(Pool.is_active == True).all()
    return pools


@router.get("/pools/{pool_id}", response_model=PoolResponse)
async def get_pool(pool_id: str, db: Session = Depends(get_db)):
    """
    Get specific pool details.
    
    Returns pool information including TVL, APY, and allocation.
    """
    pool = db.query(Pool).filter(Pool.id == pool_id).first()
    
    if not pool:
        raise HTTPException(status_code=404, detail="Pool not found")
    
    return pool


@router.get("/pools/{pool_id}/stats")
async def get_pool_stats(pool_id: str, db: Session = Depends(get_db)):
    """
    Get pool statistics.
    
    Returns detailed KPIs for the pool.
    """
    pool = db.query(Pool).filter(Pool.id == pool_id).first()
    
    if not pool:
        raise HTTPException(status_code=404, detail="Pool not found")
    
    # Calculate stats from investments
    investments = db.query(Investment).filter(
        Investment.pool_id == pool_id
    ).all()
    
    total_invested = sum(inv.amount for inv in investments)
    investor_count = len(set(inv.investor_id for inv in investments))
    
    return {
        'pool_id': pool_id,
        'pool_name': pool.name,
        'tvl': float(pool.total_value),
        'apy': pool.apy,
        'total_invested': float(total_invested),
        'investor_count': investor_count,
        'utilization_rate': float(pool.total_value / (pool.total_value + 10000000) * 100),  # Mock calculation
    }


# =============================================================================
# DOCUMENT ENDPOINTS (KYC/KYB)
# =============================================================================

@router.get("/documents", response_model=List[DocumentResponse])
async def get_documents(
    status: Optional[str] = None,
    investor_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get KYC/KYB documents.
    
    Filters:
    - status: pending, approved, rejected
    - investor_id: Filter by specific investor
    """
    query = db.query(Document)
    
    if status:
        query = query.filter(Document.verification_status == ComplianceStatusEnum(status))
    
    if investor_id:
        query = query.filter(Document.investor_id == investor_id)
    
    documents = query.all()
    
    # Calculate time remaining for each document
    result = []
    for doc in documents:
        doc_dict = {
            'id': doc.id,
            'investor_id': doc.investor_id,
            'document_type': doc.document_type.value,
            'document_name': doc.document_name,
            'verification_status': doc.verification_status.value,
            'submitted_at': doc.submitted_at.isoformat() if doc.submitted_at else None,
            'deadline_at': doc.deadline_at.isoformat() if doc.deadline_at else None,
        }

        # Calculate time remaining
        if doc.deadline_at and doc.verification_status == ComplianceStatusEnum.PENDING:
            deadline = doc.deadline_at
            now = datetime.utcnow()
            remaining = (deadline - now).total_seconds() / 3600
            doc_dict['time_remaining_hours'] = max(0, remaining)

        result.append(doc_dict)

    return result


@router.get("/documents/{document_id}")
async def get_document(document_id: int, db: Session = Depends(get_db)):
    """
    Get specific document details.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Calculate time remaining
    time_remaining = None
    if doc.deadline_at and doc.verification_status == ComplianceStatusEnum.PENDING:
        deadline = doc.deadline_at
        now = datetime.utcnow()
        remaining = (deadline - now).total_seconds() / 3600
        time_remaining = max(0, remaining)

    return {
        'id': doc.id,
        'investor_id': doc.investor_id,
        'document_type': doc.document_type.value,
        'document_name': doc.document_name,
        'file_path': doc.file_path,
        'file_hash': doc.file_hash,
        'verification_status': doc.verification_status.value,
        'submitted_at': doc.submitted_at.isoformat() if doc.submitted_at else None,
        'deadline_at': doc.deadline_at.isoformat() if doc.deadline_at else None,
        'time_remaining_hours': time_remaining,
        'reviewed_by': doc.reviewed_by,
        'reviewed_at': doc.reviewed_at.isoformat() if doc.reviewed_at else None,
        'review_notes': doc.review_notes,
    }


# =============================================================================
# INVESTMENT ENDPOINTS
# =============================================================================

@router.get("/investments", response_model=List[InvestmentResponse])
async def get_investments(
    investor_id: Optional[int] = None,
    pool_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get investments.
    
    Filters:
    - investor_id: Get investments by specific investor
    - pool_id: Get investments in specific pool
    """
    query = db.query(Investment)
    
    if investor_id:
        query = query.filter(Investment.investor_id == investor_id)
    
    if pool_id:
        query = query.filter(Investment.pool_id == pool_id)
    
    investments = query.all()
    
    return [
        InvestmentResponse(
            id=inv.id,
            pool_id=inv.pool_id,
            amount=float(inv.amount),
            ult_tokens=float(inv.ult_tokens),
            status=inv.status,
            created_at=inv.created_at.isoformat() if inv.created_at else None,
        )
        for inv in investments
    ]


@router.post("/investments")
async def create_investment(
    pool_id: str,
    investor_id: int,
    amount: float,
    ult_tokens: float,
    db: Session = Depends(get_db)
):
    """
    Create new investment record.
    
    This is called after blockchain transaction is confirmed.
    """
    # Get pool to verify it exists
    pool = db.query(Pool).filter(Pool.id == pool_id).first()
    if not pool:
        raise HTTPException(status_code=404, detail="Pool not found")
    
    # Create investment
    investment = Investment(
        pool_id=pool_id,
        investor_id=investor_id,
        amount=amount,
        ult_tokens=ult_tokens,
        status='completed',
    )
    
    db.add(investment)
    
    # Update investor profile
    profile = db.query(InvestorProfile).filter(
        InvestorProfile.id == investor_id
    ).first()
    
    if profile:
        profile.total_invested += amount
        profile.ult_tokens += ult_tokens
    
    db.commit()
    db.refresh(investment)
    
    return {
        'success': True,
        'investment_id': investment.id,
        'pool_id': pool_id,
        'amount': amount,
        'ult_tokens': ult_tokens,
    }


# =============================================================================
# ULT TOKEN ENDPOINTS
# =============================================================================

@router.get("/ult/{investor_id}/balance")
async def get_ult_balance(investor_id: int, db: Session = Depends(get_db)):
    """
    Get uLT token balance for investor.
    """
    profile = db.query(InvestorProfile).filter(
        InvestorProfile.id == investor_id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Investor not found")
    
    return {
        'investor_id': investor_id,
        'ult_balance': float(profile.ult_tokens),
        'last_updated': datetime.utcnow().isoformat(),
    }


@router.get("/ult/{investor_id}/transactions")
async def get_ult_transactions(investor_id: int, db: Session = Depends(get_db)):
    """
    Get uLT token transaction history.
    """
    transactions = db.query(ULTTransaction).filter(
        ULTTransaction.investor_id == investor_id
    ).order_by(ULTTransaction.created_at.desc()).limit(50).all()
    
    return [
        {
            'id': tx.id,
            'type': tx.transaction_type,
            'amount': float(tx.amount),
            'balance_before': float(tx.balance_before),
            'balance_after': float(tx.balance_after),
            'transaction_hash': tx.transaction_hash,
            'created_at': tx.created_at.isoformat() if tx.created_at else None,
        }
        for tx in transactions
    ]


# =============================================================================
# DASHBOARD STATS ENDPOINTS
# =============================================================================

@router.get("/stats/overview")
async def get_overview_stats(db: Session = Depends(get_db)):
    """
    Get platform overview statistics.
    
    Used for admin dashboard and analytics.
    """
    # Count totals
    total_users = db.query(User).count()
    total_pools = db.query(Pool).filter(Pool.is_active == True).count()
    total_invested = db.query(Investment).count()
    pending_documents = db.query(Document).filter(
        Document.verification_status == ComplianceStatusEnum.PENDING
    ).count()
    
    # Calculate total value
    total_value_locked = db.query(Pool).with_entities(
        func.sum(Pool.total_value)
    ).scalar() or 0
    
    return {
        'total_users': total_users,
        'total_pools': total_pools,
        'total_investments': total_invested,
        'pending_kyc_kyb': pending_documents,
        'total_value_locked': float(total_value_locked),
        'last_updated': datetime.utcnow().isoformat(),
    }


@router.get("/stats/compliance")
async def get_compliance_stats(db: Session = Depends(get_db)):
    """
    Get compliance statistics.
    
    Used for compliance officer dashboard.
    """
    now = datetime.utcnow()
    
    # Count documents by status
    pending = db.query(Document).filter(
        Document.verification_status == ComplianceStatusEnum.PENDING
    ).count()
    
    # Count overdue (past 24h deadline)
    overdue = db.query(Document).filter(
        Document.verification_status == ComplianceStatusEnum.PENDING,
        Document.deadline_at < now.isoformat()
    ).count()
    
    # Approved today
    approved_today = db.query(Document).filter(
        Document.verification_status == ComplianceStatusEnum.APPROVED,
        Document.reviewed_at >= now.replace(hour=0, minute=0, second=0).isoformat()
    ).count()
    
    return {
        'pending_documents': pending,
        'overdue_documents': overdue,
        'approved_today': approved_today,
        'last_updated': now.isoformat(),
    }
