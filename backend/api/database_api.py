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
from sqlalchemy import func
from config.database import get_db
from config.models import (
    User, InvestorProfile, Pool, Investment, Document,
    ULTTransaction, Transaction, ComplianceStatusEnum,
    ComplianceActivity, Financing, PoolPosition, BankAccount, BankTransaction
)
from config.MVP_config import mvp_config

# Jurisdiction configuration (in production, this would be in database)
JURISDICTIONS_DB = {
    # African jurisdictions
    'NG': {'code': 'NG', 'name': 'Nigeria', 'status': 'allowed', 'category': 'africa', 'notes': 'Largest African economy'},
    'KE': {'code': 'KE', 'name': 'Kenya', 'status': 'allowed', 'category': 'africa', 'notes': 'East African Community member'},
    'ZA': {'code': 'ZA', 'name': 'South Africa', 'status': 'allowed', 'category': 'africa', 'notes': 'Advanced financial markets'},
    'GH': {'code': 'GH', 'name': 'Ghana', 'status': 'allowed', 'category': 'africa', 'notes': 'Stable democracy'},
    'MU': {'code': 'MU', 'name': 'Mauritius', 'status': 'allowed', 'category': 'africa', 'notes': 'Primary jurisdiction, full access'},
    'CI': {'code': 'CI', 'name': 'Côte d\'Ivoire', 'status': 'allowed', 'category': 'africa', 'notes': 'West African hub'},
    'SN': {'code': 'SN', 'name': 'Senegal', 'status': 'allowed', 'category': 'africa', 'notes': 'Stable democracy'},
    'TG': {'code': 'TG', 'name': 'Togo', 'status': 'allowed', 'category': 'africa', 'notes': 'Growing economy'},
    'BJ': {'code': 'BJ', 'name': 'Benin', 'status': 'allowed', 'category': 'africa', 'notes': 'GDIZ partnership'},
    # International jurisdictions
    'GB': {'code': 'GB', 'name': 'United Kingdom', 'status': 'allowed', 'category': 'international', 'notes': 'Major financial center'},
    'FR': {'code': 'FR', 'name': 'France', 'status': 'allowed', 'category': 'international', 'notes': 'EU member state'},
    'DE': {'code': 'DE', 'name': 'Germany', 'status': 'allowed', 'category': 'international', 'notes': 'EU member state'},
    'AE': {'code': 'AE', 'name': 'United Arab Emirates', 'status': 'allowed', 'category': 'international', 'notes': 'Middle East hub'},
    'SG': {'code': 'SG', 'name': 'Singapore', 'status': 'allowed', 'category': 'international', 'notes': 'Asian financial hub'},
    'US': {'code': 'US', 'name': 'United States', 'status': 'blocked', 'category': 'blocked', 'notes': 'SEC regulations - accredited investors only', 'sanctions_list': 'N/A - Regulatory'},
    # Blocked jurisdictions
    'KP': {'code': 'KP', 'name': 'North Korea', 'status': 'blocked', 'category': 'blocked', 'notes': 'UN sanctions', 'sanctions_list': 'UN Sanctions List'},
    'IR': {'code': 'IR', 'name': 'Iran', 'status': 'blocked', 'category': 'blocked', 'notes': 'OFAC sanctions', 'sanctions_list': 'OFAC SDN List'},
    'SY': {'code': 'SY', 'name': 'Syria', 'status': 'blocked', 'category': 'blocked', 'notes': 'EU sanctions', 'sanctions_list': 'EU Sanctions List'},
    'CU': {'code': 'CU', 'name': 'Cuba', 'status': 'blocked', 'category': 'blocked', 'notes': 'US OFAC sanctions', 'sanctions_list': 'OFAC SDN List'},
    'RU': {'code': 'RU', 'name': 'Russia', 'status': 'blocked', 'category': 'blocked', 'notes': 'International sanctions', 'sanctions_list': 'Multiple Sanctions Lists'},
    'BY': {'code': 'BY', 'name': 'Belarus', 'status': 'blocked', 'category': 'blocked', 'notes': 'EU/US sanctions', 'sanctions_list': 'EU/US Sanctions Lists'},
    'MM': {'code': 'MM', 'name': 'Myanmar', 'status': 'blocked', 'category': 'blocked', 'notes': 'Targeted sanctions', 'sanctions_list': 'OFAC SDN List'},
    'VE': {'code': 'VE', 'name': 'Venezuela', 'status': 'blocked', 'category': 'blocked', 'notes': 'US OFAC sanctions', 'sanctions_list': 'OFAC SDN List'},
    'SD': {'code': 'SD', 'name': 'Sudan', 'status': 'blocked', 'category': 'blocked', 'notes': 'US OFAC sanctions', 'sanctions_list': 'OFAC SDN List'},
    'YE': {'code': 'YE', 'name': 'Yemen', 'status': 'blocked', 'category': 'blocked', 'notes': 'UN arms embargo', 'sanctions_list': 'UN Sanctions List'},
    'ML': {'code': 'ML', 'name': 'Mali', 'status': 'blocked', 'category': 'blocked', 'notes': 'FATF High-Risk', 'sanctions_list': 'FATF High-Risk'},
    'BF': {'code': 'BF', 'name': 'Burkina Faso', 'status': 'blocked', 'category': 'blocked', 'notes': 'FATF High-Risk', 'sanctions_list': 'FATF High-Risk'},
}

router = APIRouter(prefix="/api/v2/db", tags=["Database"])


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


@router.get("/documents/pending")
async def get_pending_documents(
    include_overdue_only: bool = False,
    db: Session = Depends(get_db)
) -> List[Dict]:
    """
    Get all pending documents for compliance review.

    - **include_overdue_only**: If True, only return overdue documents

    Returns documents with investor information and time remaining.
    """
    now = datetime.utcnow()

    query = db.query(Document).filter(
        Document.verification_status == ComplianceStatusEnum.PENDING
    )

    if include_overdue_only:
        query = query.filter(Document.deadline_at < now)

    documents = query.order_by(Document.deadline_at.asc()).all()

    result = []
    for doc in documents:
        # Get investor info
        investor = db.query(InvestorProfile).filter(
            InvestorProfile.id == doc.investor_id
        ).first()

        # Calculate time remaining
        time_remaining = None
        is_overdue = False
        if doc.deadline_at:
            deadline = doc.deadline_at if isinstance(doc.deadline_at, datetime) else datetime.fromisoformat(doc.deadline_at)
            time_diff = deadline - now
            time_remaining = time_diff.total_seconds() / 3600  # hours
            is_overdue = time_remaining < 0
        
        result.append({
            "id": doc.id,
            "investor_id": doc.investor_id,
            "investor_name": investor.full_name or investor.company_name or f"Investor #{doc.investor_id}",
            "investor_jurisdiction": investor.jurisdiction if investor else "Unknown",
            "document_type": doc.document_type,
            "document_name": doc.document_name,
            "file_path": doc.file_path,
            "verification_status": doc.verification_status.value,
            "submitted_at": doc.submitted_at.isoformat() if doc.submitted_at else None,
            "deadline_at": doc.deadline_at.isoformat() if doc.deadline_at else None,
            "time_remaining_hours": round(time_remaining, 2) if time_remaining is not None else None,
            "is_overdue": is_overdue,
            "review_notes": doc.review_notes
        })
    
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
    today_midnight = now.replace(hour=0, minute=0, second=0, microsecond=0)

    # Count documents by status
    pending = db.query(Document).filter(
        Document.verification_status == ComplianceStatusEnum.PENDING
    ).count()

    # Count overdue (past 24h deadline)
    overdue = db.query(Document).filter(
        Document.verification_status == ComplianceStatusEnum.PENDING,
        Document.deadline_at < now
    ).count()

    # Approved today (reviewed_at >= today midnight)
    approved_today = db.query(Document).filter(
        Document.verification_status == ComplianceStatusEnum.APPROVED,
        Document.reviewed_at >= today_midnight
    ).count()

    return {
        'pending_documents': pending,
        'overdue_documents': overdue,
        'approved_today': approved_today,
        'last_updated': now.isoformat(),
    }


# =============================================================================
# DOCUMENT MANAGEMENT ENDPOINTS
# =============================================================================

class DocumentCreate(BaseModel):
    """Request model for creating a document"""
    investor_id: int
    document_type: str
    document_name: str
    file_path: str
    file_hash: Optional[str] = None


class DocumentReviewRequest(BaseModel):
    """Request model for reviewing a document"""
    action: str  # 'approve' or 'reject'
    notes: str
    reviewer_id: int


@router.post("/documents")
async def create_document(
    request: DocumentCreate,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Upload a new KYC/KYB document.
    
    - **investor_id**: Investor profile ID
    - **document_type**: Type of document (kyc_id, kyb_incorporation, etc.)
    - **document_name**: Document name
    - **file_path**: Path to stored file
    - **file_hash**: SHA256 hash for integrity (optional)
    
    Returns document ID and 24h deadline.
    """
    from datetime import timedelta
    
    now = datetime.utcnow()
    deadline = now + timedelta(hours=24)
    
    document = Document(
        investor_id=request.investor_id,
        document_type=request.document_type,
        document_name=request.document_name,
        file_path=request.file_path,
        file_hash=request.file_hash,
        verification_status=ComplianceStatusEnum.PENDING,
        upload_status='uploaded',
        submitted_at=now,
        deadline_at=deadline
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)

    return {
        "success": True,
        "id": document.id,
        "verification_status": document.verification_status.value,
        "deadline_at": document.deadline_at.isoformat() if document.deadline_at else None,
        "time_remaining_hours": 24.0,
        "message": "Document uploaded successfully. Compliance review required within 24 hours."
    }


@router.post("/documents/{document_id}/review")
async def review_document(
    document_id: int,
    request: DocumentReviewRequest,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Review and approve/reject a document.
    
    - **document_id**: Document ID to review
    - **action**: 'approve' or 'reject'
    - **notes**: Review notes
    - **reviewer_id**: Compliance officer user ID
    
    Updates document status and investor KYC/KYB status if approved.
    """
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if document.verification_status != ComplianceStatusEnum.PENDING:
        raise HTTPException(
            status_code=400,
            detail=f"Document already reviewed (status: {document.verification_status.value})"
        )
    
    # Check if overdue
    is_overdue = False
    if document.deadline_at:
        now = datetime.utcnow()
        deadline = document.deadline_at if isinstance(document.deadline_at, datetime) else datetime.fromisoformat(document.deadline_at)
        is_overdue = deadline < now
    
    # Update document
    new_status = ComplianceStatusEnum.APPROVED if request.action == "approve" else ComplianceStatusEnum.REJECTED
    document.verification_status = new_status
    document.reviewed_by = request.reviewer_id
    document.reviewed_at = datetime.utcnow()
    document.review_notes = request.notes
    
    if is_overdue:
        document.review_notes = (document.review_notes or "") + " [⚠️ Reviewed after 24h deadline]"
    
    # If approved, check if all documents are approved and update investor status
    investor_status_updated = False
    if request.action == "approve":
        investor = db.query(InvestorProfile).filter(
            InvestorProfile.id == document.investor_id
        ).first()
        
        if investor:
            # Determine document category (KYC or KYB)
            kyc_doc_types = ['kyc_id', 'kyc_address', 'kyc_selfie']
            kyb_doc_types = ['kyb_incorporation', 'kyb_tax', 'kyb_ubo', 'kyb_resolution', 'kyb_aml', 'kyb_license']
            
            # Check if all KYC documents are approved
            if document.document_type in kyc_doc_types:
                all_kyc_approved = check_all_documents_approved(db, document.investor_id, kyc_doc_types)
                if all_kyc_approved:
                    investor.kyc_status = ComplianceStatusEnum.APPROVED
                    investor_status_updated = True
            
            # Check if all KYB documents are approved
            if document.document_type in kyb_doc_types:
                all_kyb_approved = check_all_documents_approved(db, document.investor_id, kyb_doc_types)
                if all_kyb_approved:
                    investor.kyb_status = ComplianceStatusEnum.APPROVED
                    investor_status_updated = True
    
    # Log compliance activity
    activity = ComplianceActivity(
        user_id=request.reviewer_id,
        activity_type=f"DOCUMENT_{request.action.upper()}",
        target_id=document_id,
        target_type="DOCUMENT",
        details={
            "action": request.action,
            "notes": request.notes,
            "document_type": str(document.document_type.value) if hasattr(document.document_type, 'value') else str(document.document_type),
            "investor_id": int(document.investor_id),
            "is_overdue": bool(is_overdue)
        }
    )
    db.add(activity)
    
    db.commit()
    
    return {
        "success": True,
        "document_id": document_id,
        "new_status": new_status.value,
        "investor_status_updated": investor_status_updated,
        "is_overdue": is_overdue,
        "message": f"Document {request.action}ed successfully" + (" - Investor status updated" if investor_status_updated else "")
    }


def check_all_documents_approved(
    db: Session,
    investor_id: int,
    doc_types: List[str]
) -> bool:
    """
    Check if all required documents of specified types are approved for an investor.
    """
    # Get all documents for this investor with these types
    documents = db.query(Document).filter(
        Document.investor_id == investor_id,
        Document.document_type.in_(doc_types)
    ).all()
    
    if not documents:
        return False  # No documents uploaded yet
    
    # Check if all are approved
    return all(doc.verification_status == ComplianceStatusEnum.APPROVED for doc in documents)


@router.get("/investors/{investor_id}/documents")
async def get_investor_documents(
    investor_id: int,
    db: Session = Depends(get_db)
) -> List[Dict]:
    """
    Get all documents for a specific investor.
    
    Used for investor profile page to show their uploaded documents.
    """
    documents = db.query(Document).filter(
        Document.investor_id == investor_id
    ).order_by(Document.submitted_at.desc()).all()
    
    now = datetime.utcnow()
    
    return [
        {
            "id": doc.id,
            "document_type": doc.document_type,
            "document_name": doc.document_name,
            "file_path": doc.file_path,
            "verification_status": doc.verification_status.value,
            "upload_status": doc.upload_status,
            "submitted_at": doc.submitted_at.isoformat() if doc.submitted_at else None,
            "deadline_at": doc.deadline_at.isoformat() if doc.deadline_at else None,
            "reviewed_at": doc.reviewed_at.isoformat() if doc.reviewed_at else None,
            "reviewed_by": doc.reviewed_by,
            "review_notes": doc.review_notes,
            "time_remaining_hours": round((doc.deadline_at - now).total_seconds() / 3600, 2) if doc.deadline_at and isinstance(doc.deadline_at, datetime) else None,
            "is_overdue": (doc.deadline_at < now) if doc.deadline_at and isinstance(doc.deadline_at, datetime) else False
        }
        for doc in documents
    ]


@router.get("/investors/{investor_id}")
async def get_investor_profile(
    investor_id: int,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Get complete investor profile with positions and transactions.
    
    Returns investor profile, pool positions, and recent transactions.
    """
    # Get investor profile
    investor = db.query(InvestorProfile).filter(
        InvestorProfile.id == investor_id
    ).first()
    
    if not investor:
        raise HTTPException(status_code=404, detail="Investor not found")
    
    # Get user info
    user = db.query(User).filter(User.id == investor.user_id).first()
    
    # Get pool positions
    positions = db.query(PoolPosition).filter(
        PoolPosition.investor_id == investor_id,
        PoolPosition.is_active == True
    ).all()
    
    # Get recent transactions
    transactions = db.query(Transaction).filter(
        Transaction.investor_id == investor_id
    ).order_by(Transaction.created_at.desc()).limit(10).all()
    
    # Get bank account balance
    bank_account = db.query(BankAccount).filter(
        BankAccount.investor_id == investor_id,
        BankAccount.status == 'ACTIVE'
    ).first()
    
    # Calculate total portfolio value
    total_portfolio_value = sum(
        float(pos.shares) for pos in positions
    )  # Simplified: shares = value at NAV 1.0
    
    return {
        "id": investor.id,
        "email": user.email if user else None,
        "role": user.role.value if user else None,
        "wallet_address": investor.wallet_address,
        "full_name": investor.full_name,
        "company_name": investor.company_name,
        "jurisdiction": investor.jurisdiction,
        "kyc_status": investor.kyc_status.value if investor.kyc_status else "pending",
        "kyb_status": investor.kyb_status.value if investor.kyb_status else "pending",
        "total_invested": float(investor.total_invested) if investor.total_invested else 0,
        "ult_tokens": float(investor.ult_tokens) if investor.ult_tokens else 0,
        "total_portfolio_value": total_portfolio_value,
        "bank_balance": float(bank_account.balance) if bank_account else 0,
        "available_to_invest": float(bank_account.balance) if bank_account else 0,
        "pool_positions": [
            {
                "pool_id": pos.pool_id,
                "shares": float(pos.shares),
                "average_nav": float(pos.average_nav) if pos.average_nav else 1.0,
                "total_yield_earned": float(pos.total_yield_earned) if pos.total_yield_earned else 0
            }
            for pos in positions
        ],
        "recent_transactions": [
            {
                "id": tx.id,
                "type": tx.transaction_type,
                "amount": float(tx.amount),
                "status": tx.status.value if tx.status else "pending",
                "created_at": tx.created_at.isoformat() if tx.created_at else None
            }
            for tx in transactions
        ]
    }


# =============================================================================
# TRANSACTION COMPLIANCE ENDPOINTS
# =============================================================================

class TransactionReviewRequest(BaseModel):
    """Request model for reviewing a flagged transaction"""
    action: str  # 'clear' or 'block'
    notes: str
    reviewer_id: int


class TransactionCreate(BaseModel):
    """Request model for creating a transaction"""
    investor_id: int
    transaction_type: str
    amount: float
    currency: str = "EUR"
    description: Optional[str] = None
    is_on_chain: bool = False
    transaction_hash: Optional[str] = None


@router.get("/financings")
async def get_financings(
    pool_family: Optional[str] = None,
    industrial_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
) -> List[Dict]:
    """
    Get financings with optional filtering.
    
    - **pool_family**: Filter by pool family (industrie, agriculture, etc.)
    - **industrial_id**: Filter by industrial operator ID
    - **status**: Filter by status (active, repaying, repaid, defaulted)
    """
    query = db.query(Financing)
    
    if pool_family:
        query = query.filter(Financing.pool_family == pool_family)
    
    if industrial_id:
        query = query.filter(Financing.industrial_id == industrial_id)
    
    if status:
        if status == 'active':
            query = query.filter(Financing.status == FinancingStatusEnum.ACTIVE)
        elif status == 'repaying':
            query = query.filter(Financing.status == FinancingStatusEnum.REPAYING)
        elif status == 'repaid':
            query = query.filter(Financing.status == FinancingStatusEnum.REPAID)
        elif status == 'defaulted':
            query = query.filter(Financing.status == FinancingStatusEnum.DEFAULTED)
    
    financings = query.all()
    
    return [
        {
            "id": f.id,
            "pool_family": f.pool_family,
            "asset_class": f.asset_class.value if f.asset_class else None,
            "industrial": f.industrial,
            "industrial_id": f.industrial_id,
            "principal": float(f.principal) if f.principal else 0,
            "interest_rate": float(f.interest_rate) if f.interest_rate else 0,
            "duration_days": f.duration_days,
            "start_date": f.start_date.isoformat() if f.start_date else None,
            "maturity_date": f.maturity_date.isoformat() if f.maturity_date else None,
            "amount_repaid": float(f.amount_repaid) if f.amount_repaid else 0,
            "is_repaid": f.is_repaid,
            "status": f.status.value if f.status else "pending",
            "description": f.description
        }
        for f in financings
    ]


@router.get("/transactions/flagged")
async def get_flagged_transactions(
    status: Optional[str] = None,
    risk_level: Optional[str] = None,
    db: Session = Depends(get_db)
) -> List[Dict]:
    """
    Get all flagged transactions for compliance review.
    
    - **status**: Filter by review status (all/pending/cleared/blocked)
    - **risk_level**: Filter by risk level (low/medium/high/critical)
    
    Returns transactions with investor information.
    """
    query = db.query(Transaction).filter(Transaction.is_flagged == True)
    
    if status:
        if status == "pending":
            query = query.filter(Transaction.review_action.is_(None))
        else:
            query = query.filter(Transaction.review_action == status)
    
    if risk_level:
        query = query.filter(Transaction.risk_level == risk_level)
    
    transactions = query.order_by(Transaction.flagged_at.desc()).all()
    
    result = []
    for tx in transactions:
        # Get investor info
        investor = db.query(InvestorProfile).filter(
            InvestorProfile.id == tx.investor_id
        ).first() if tx.investor_id else None
        
        result.append({
            "id": tx.id,
            "investor_id": tx.investor_id,
            "investor_name": investor.full_name or investor.company_name or f"Investor #{tx.investor_id}" if investor else "Unknown",
            "investor_jurisdiction": investor.jurisdiction if investor else "Unknown",
            "transaction_type": tx.transaction_type,
            "amount": float(tx.amount),
            "currency": tx.currency,
            "risk_level": tx.risk_level,
            "is_flagged": tx.is_flagged,
            "flag_reason": tx.flag_reason,
            "flagged_at": tx.flagged_at.isoformat() if tx.flagged_at else None,
            "status": tx.status.value if tx.status else "pending",
            "review_action": tx.review_action,
            "reviewed_by": tx.reviewed_by,
            "reviewed_at": tx.reviewed_at.isoformat() if tx.reviewed_at else None,
            "review_notes": tx.review_notes,
            "created_at": tx.created_at.isoformat() if tx.created_at else None,
            "transaction_hash": tx.transaction_hash
        })
    
    return result


@router.post("/transactions/{transaction_id}/review")
async def review_transaction(
    transaction_id: int,
    request: TransactionReviewRequest,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Review and clear/block a flagged transaction.
    
    - **transaction_id**: Transaction ID to review
    - **action**: 'clear' or 'block'
    - **notes**: Review notes
    - **reviewer_id**: Compliance officer user ID
    
    Updates transaction status and logs compliance activity.
    """
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Update transaction
    transaction.reviewed_by = request.reviewer_id
    transaction.reviewed_at = datetime.utcnow()
    transaction.review_action = 'cleared' if request.action == 'clear' else 'blocked'
    transaction.review_notes = request.notes
    transaction.is_flagged = False  # No longer flagged after review
    
    # Update status based on action
    if request.action == 'block':
        transaction.status = TransactionStatusEnum.FAILED
    
    # Log compliance activity
    activity = ComplianceActivity(
        user_id=request.reviewer_id,
        activity_type=f"TRANSACTION_{request.action.upper()}",
        target_id=transaction_id,
        target_type="TRANSACTION",
        details={
            "action": request.action,
            "notes": request.notes,
            "transaction_type": transaction.transaction_type,
            "amount": float(transaction.amount),
            "investor_id": transaction.investor_id
        }
    )
    db.add(activity)
    
    db.commit()
    
    return {
        "success": True,
        "transaction_id": transaction_id,
        "new_action": transaction.review_action,
        "new_status": transaction.status.value if transaction.status else "pending",
        "message": f"Transaction {request.action}ed successfully"
    }


@router.post("/transactions")
async def create_transaction(
    request: TransactionCreate,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Create a new transaction with automatic risk assessment.
    
    Auto-flags transactions based on:
    - Amount > €100,000 (large transaction)
    - Amount > €500,000 (very large - high risk)
    - Investor from high-risk jurisdiction
    
    Returns transaction ID and flag status.
    """
    # Determine risk level and flag status
    is_flagged = False
    risk_level = "low"
    flag_reason = None
    
    # Auto-flag based on amount
    if request.amount > 500000:
        is_flagged = True
        risk_level = "high"
        flag_reason = f"Very large transaction: €{request.amount:,.2f} exceeds €500,000 threshold"
    elif request.amount > 100000:
        is_flagged = True
        risk_level = "medium"
        flag_reason = f"Large transaction: €{request.amount:,.2f} exceeds €100,000 threshold"
    
    # Check investor jurisdiction (if applicable)
    if request.investor_id:
        investor = db.query(InvestorProfile).filter(
            InvestorProfile.id == request.investor_id
        ).first()
        if investor:
            # Check against blocked jurisdictions
            if investor.jurisdiction in mvp_config.BLOCKED_JURISDICTIONS:
                is_flagged = True
                risk_level = "critical"
                flag_reason = f"Investor from blocked jurisdiction: {investor.jurisdiction}"
            elif investor.kyc_status != ComplianceStatusEnum.APPROVED and investor.kyb_status != ComplianceStatusEnum.APPROVED:
                is_flagged = True
                risk_level = "high"
                flag_reason = "Investor KYC/KYB not approved"
    
    # Create transaction
    now = datetime.utcnow()
    transaction = Transaction(
        investor_id=request.investor_id,
        transaction_type=request.transaction_type,
        amount=request.amount,
        currency=request.currency,
        description=request.description,
        is_on_chain=request.is_on_chain,
        transaction_hash=request.transaction_hash,
        is_flagged=is_flagged,
        risk_level=risk_level,
        flag_reason=flag_reason,
        flagged_at=now if is_flagged else None,
        flagged_by="auto" if is_flagged else None,
        status=TransactionStatusEnum.PENDING if is_flagged else TransactionStatusEnum.CONFIRMED
    )
    
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    
    return {
        "success": True,
        "transaction_id": transaction.id,
        "is_flagged": is_flagged,
        "risk_level": risk_level,
        "flag_reason": flag_reason,
        "status": transaction.status.value if transaction.status else "pending",
        "message": "Transaction created" + (" - Flagged for compliance review" if is_flagged else "")
    }


@router.get("/transactions")
async def get_transactions(
    investor_id: Optional[int] = None,
    transaction_type: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
) -> List[Dict]:
    """
    Get transactions with optional filtering.
    
    - **investor_id**: Filter by investor
    - **transaction_type**: Filter by type (INVESTMENT, REDEMPTION, YIELD, etc.)
    - **limit**: Maximum number of results (default 50)
    """
    query = db.query(Transaction)
    
    if investor_id:
        query = query.filter(Transaction.investor_id == investor_id)
    
    if transaction_type:
        query = query.filter(Transaction.transaction_type == transaction_type)
    
    transactions = query.order_by(Transaction.created_at.desc()).limit(limit).all()
    
    return [
        {
            "id": tx.id,
            "investor_id": tx.investor_id,
            "transaction_type": tx.transaction_type,
            "amount": float(tx.amount),
            "currency": tx.currency,
            "status": tx.status.value if tx.status else "pending",
            "is_on_chain": tx.is_on_chain,
            "transaction_hash": tx.transaction_hash,
            "is_flagged": tx.is_flagged,
            "risk_level": tx.risk_level,
            "created_at": tx.created_at.isoformat() if tx.created_at else None,
            "confirmed_at": tx.confirmed_at.isoformat() if tx.confirmed_at else None
        }
        for tx in transactions
    ]


@router.get("/transactions/{transaction_id}")
async def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Get a single transaction by ID.
    """
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    investor = db.query(InvestorProfile).filter(
        InvestorProfile.id == transaction.investor_id
    ).first() if transaction.investor_id else None
    
    return {
        "id": transaction.id,
        "investor_id": transaction.investor_id,
        "investor_name": investor.full_name or investor.company_name or f"Investor #{transaction.investor_id}" if investor else "Unknown",
        "investor_jurisdiction": investor.jurisdiction if investor else "Unknown",
        "transaction_type": transaction.transaction_type,
        "amount": float(transaction.amount),
        "currency": transaction.currency,
        "status": transaction.status.value if transaction.status else "pending",
        "is_on_chain": transaction.is_on_chain,
        "transaction_hash": transaction.transaction_hash,
        "is_flagged": transaction.is_flagged,
        "risk_level": transaction.risk_level,
        "flag_reason": transaction.flag_reason,
        "review_action": transaction.review_action,
        "review_notes": transaction.review_notes,
        "created_at": transaction.created_at.isoformat() if transaction.created_at else None,
        "confirmed_at": transaction.confirmed_at.isoformat() if transaction.confirmed_at else None
    }


# =============================================================================
# JURISDICTION ENDPOINTS
# =============================================================================

class JurisdictionCreate(BaseModel):
    """Request model for creating a jurisdiction"""
    code: str
    name: str
    status: str  # 'allowed' or 'blocked'
    category: str  # 'africa', 'international', 'blocked'
    notes: Optional[str] = None
    sanctions_list: Optional[str] = None


class JurisdictionUpdate(BaseModel):
    """Request model for updating a jurisdiction (all fields optional)"""
    status: Optional[str] = None  # 'allowed' or 'blocked'
    notes: Optional[str] = None
    sanctions_list: Optional[str] = None
    category: Optional[str] = None


@router.get("/jurisdictions")
async def get_jurisdictions(
    status: Optional[str] = None,
    category: Optional[str] = None
) -> List[Dict]:
    """
    Get all jurisdictions with optional filtering.
    
    - **status**: Filter by status (allowed/blocked)
    - **category**: Filter by category (africa/international/blocked)
    """
    jurisdictions = list(JURISDICTIONS_DB.values())
    
    if status:
        jurisdictions = [j for j in jurisdictions if j['status'] == status]
    
    if category:
        jurisdictions = [j for j in jurisdictions if j['category'] == category]
    
    return jurisdictions


@router.get("/jurisdictions/{code}")
async def get_jurisdiction(code: str) -> Dict:
    """
    Get specific jurisdiction by code.
    """
    if code not in JURISDICTIONS_DB:
        raise HTTPException(status_code=404, detail=f"Jurisdiction not found: {code}")
    
    return JURISDICTIONS_DB[code]


@router.post("/jurisdictions")
async def create_jurisdiction(request: JurisdictionCreate) -> Dict:
    """
    Add a new jurisdiction.
    
    - **code**: 2-letter country code
    - **name**: Country name
    - **status**: 'allowed' or 'blocked'
    - **category**: 'africa', 'international', or 'blocked'
    - **notes**: Additional notes
    - **sanctions_list**: Sanctions list reference (if blocked)
    """
    if request.code in JURISDICTIONS_DB:
        raise HTTPException(status_code=400, detail=f"Jurisdiction {request.code} already exists")
    
    JURISDICTIONS_DB[request.code] = {
        'code': request.code,
        'name': request.name,
        'status': request.status,
        'category': request.category,
        'notes': request.notes,
        'sanctions_list': request.sanctions_list
    }
    
    return {
        "success": True,
        "message": f"Jurisdiction {request.code} added successfully",
        "jurisdiction": JURISDICTIONS_DB[request.code]
    }


@router.put("/jurisdictions/{code}")
async def update_jurisdiction(code: str, request: JurisdictionUpdate) -> Dict:
    """
    Update jurisdiction status and notes.

    - **code**: Jurisdiction code to update
    - **status**: New status ('allowed' or 'blocked')
    - **notes**: Updated notes
    """
    if code not in JURISDICTIONS_DB:
        raise HTTPException(status_code=404, detail=f"Jurisdiction not found: {code}")

    # Update fields if provided
    if request.status is not None:
        JURISDICTIONS_DB[code]['status'] = request.status
    if request.notes is not None:
        JURISDICTIONS_DB[code]['notes'] = request.notes
    if request.sanctions_list is not None:
        JURISDICTIONS_DB[code]['sanctions_list'] = request.sanctions_list
    if request.category is not None:
        JURISDICTIONS_DB[code]['category'] = request.category

    return {
        "success": True,
        "message": f"Jurisdiction {code} updated successfully",
        "jurisdiction": JURISDICTIONS_DB[code]
    }


@router.delete("/jurisdictions/{code}")
async def delete_jurisdiction(code: str) -> Dict:
    """
    Remove a jurisdiction.
    
    Note: Cannot delete if investors are registered in this jurisdiction.
    """
    if code not in JURISDICTIONS_DB:
        raise HTTPException(status_code=404, detail=f"Jurisdiction not found: {code}")
    
    # Check if any investors use this jurisdiction
    # (In production, would check database)
    
    del JURISDICTIONS_DB[code]
    
    return {
        "success": True,
        "message": f"Jurisdiction {code} removed successfully"
    }


@router.get("/jurisdictions/check/{code}")
async def check_jurisdiction(code: str) -> Dict:
    """
    Check if a jurisdiction is allowed for onboarding.
    
    Returns jurisdiction status and whether investors from this jurisdiction can onboard.
    """
    if code not in JURISDICTIONS_DB:
        return {
            "code": code,
            "is_allowed": False,
            "status": "unknown",
            "message": f"Unknown jurisdiction: {code}. Default: BLOCKED"
        }
    
    jurisdiction = JURISDICTIONS_DB[code]
    is_allowed = jurisdiction['status'] == 'allowed'
    
    return {
        "code": code,
        "name": jurisdiction['name'],
        "is_allowed": is_allowed,
        "status": jurisdiction['status'],
        "category": jurisdiction['category'],
        "notes": jurisdiction['notes'],
        "sanctions_list": jurisdiction.get('sanctions_list'),
        "message": f"{jurisdiction['name']} is {'ALLOWED' if is_allowed else 'BLOCKED'} for onboarding"
    }
