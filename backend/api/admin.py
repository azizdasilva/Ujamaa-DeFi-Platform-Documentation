"""
Admin API - Complete User & System Management

All endpoints require ADMIN role unless noted.
REGULATOR and COMPLIANCE_OFFICER get read-only access on select endpoints.
"""

import bcrypt
from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from datetime import datetime

from config.database import get_database_url, get_db
from config.models import (
    User, InvestorProfile, BankAccount, Document, ComplianceActivity,
    WhitelistedWallet, InvestorRoleEnum, ComplianceStatusEnum,
    Pool, PoolPosition, Investment, Financing, Transaction,
    YieldStatement, GDIZFinancing, RiskMetrics, ComplianceMetrics, ImpactMetrics,
    Contract
)

router = APIRouter(prefix="/api/v2/admin", tags=["Admin"])
security = HTTPBearer(auto_error=False)

# =============================================================================
# Pydantic Models
# =============================================================================

class UserCreateRequest(BaseModel):
    email: str
    password: str = "password123"
    role: str
    wallet_address: Optional[str] = None
    full_name: Optional[str] = None

class UserUpdateRequest(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    wallet_address: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

class PasswordResetRequest(BaseModel):
    new_password: str = "password123"

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    wallet_address: Optional[str]
    is_active: bool
    has_password: bool
    created_at: Optional[str]
    # Profile fields (if investor)
    full_name: Optional[str] = None
    kyc_status: Optional[str] = None
    bank_balance: Optional[float] = None
    bank_account_id: Optional[str] = None

class UserListResponse(BaseModel):
    users: List[UserResponse]
    total: int

class AuditResponse(BaseModel):
    activities: List[Dict[str, Any]]
    total: int

class DocumentReviewRequest(BaseModel):
    verification_status: str  # APPROVED, REJECTED
    review_notes: Optional[str] = None

class WhitelistWalletRequest(BaseModel):
    is_approved: bool
    risk_level: Optional[str] = "low"

# =============================================================================
# Threshold Configuration Model
# =============================================================================

class ThresholdConfig(BaseModel):
    """Threshold configuration model"""
    MIN_DEPOSIT: int = 1000
    MAX_DEPOSIT: int = 1000000
    DAILY_WITHDRAWAL_LIMIT: int = 500000
    INSTITUTIONAL_MIN: int = 100000
    RETAIL_MAX: int = 90000
    KYB_THRESHOLD_EUR: int = 100000
    TXN_FLAG_LARGE: int = 100000
    TXN_FLAG_VERY_LARGE: int = 500000
    STRUCTURING_THRESHOLD: int = 3000
    STRUCTURING_TOTAL_THRESHOLD: int = 10000
    VELOCITY_THRESHOLD_PER_HOUR: int = 10
    DEFAULT_LOCKUP_DAYS: int = 365
    MIN_INVESTMENT_RETURN: int = 1000

class ThresholdUpdateRequest(BaseModel):
    """Request for updating thresholds"""
    thresholds: Dict[str, Any] = Field(..., description="Key-value pairs of thresholds")
    reason: str = Field(..., description="Reason for the change (audit trail)")

# =============================================================================
# In-memory threshold store (loaded from database on startup, saved on update)
# =============================================================================

CURRENT_THRESHOLDS = ThresholdConfig()

def load_thresholds_from_db(db: Session) -> None:
    """Load thresholds from platform_settings table. Falls back to defaults."""
    global CURRENT_THRESHOLDS
    try:
        result = db.execute(text("SELECT key, value FROM platform_settings WHERE category = 'thresholds'"))
        rows = result.fetchall()
        if rows:
            td = CURRENT_THRESHOLDS.dict()
            for key, raw_value in rows:
                if key in td:
                    # Convert TEXT back to correct type
                    td[key] = int(raw_value) if raw_value is not None else td[key]
            CURRENT_THRESHOLDS = ThresholdConfig(**td)
    except Exception:
        pass

def save_thresholds_to_db(db: Session) -> None:
    """Save current thresholds to platform_settings table."""
    try:
        td = CURRENT_THRESHOLDS.dict()
        for key, value in td.items():
            db.execute(text("""
                INSERT INTO platform_settings (category, key, value)
                VALUES ('thresholds', :key, CAST(:value AS TEXT))
                ON CONFLICT (category, key) DO UPDATE SET value = CAST(:value AS TEXT)
            """), {'key': key, 'value': str(value)})
        db.commit()
    except Exception as e:
        print(f"⚠️  Failed to save thresholds to DB: {e}")
        db.rollback()

# =============================================================================
# Threshold utilities (used by pools.py and other modules)
# =============================================================================

def get_threshold(threshold_name: str) -> Any:
    """Get a specific threshold value. Used by other modules to read thresholds."""
    return CURRENT_THRESHOLDS.dict().get(threshold_name)

def check_threshold(threshold_name: str, value: float) -> bool:
    """Check if a value meets a threshold requirement."""
    thresholds = CURRENT_THRESHOLDS.dict()
    if threshold_name not in thresholds:
        return True
    return value >= thresholds[threshold_name]

# =============================================================================
# Dependencies
# =============================================================================

# Roles that can access admin endpoints (ADMIN = full, REGULATOR/COMPLIANCE_OFFICER = read-only)
ADMIN_ROLES = {'ADMIN'}
READONLY_ROLES = {'REGULATOR', 'COMPLIANCE_OFFICER'}
ALL_ADMIN_ACCESS_ROLES = ADMIN_ROLES | READONLY_ROLES

async def verify_admin_readonly(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Verify user has ADMIN, REGULATOR, or COMPLIANCE_OFFICER role.
    Write-only endpoints use verify_admin_write instead."""
    return _resolve_auth_user(auth, db)

async def verify_admin_write(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Verify user has ADMIN role only (for write operations)."""
    user = _resolve_auth_user(auth, db)
    user_role = user.role.value if hasattr(user.role, 'value') else user.role
    if user_role not in ADMIN_ROLES:
        raise HTTPException(status_code=403, detail=f"Admin write access required. Your role: {user_role}")
    return user

def _resolve_auth_user(auth: Optional[HTTPAuthorizationCredentials], db: Session) -> User:
    """Resolve auth token to a User object. Supports mock tokens from frontend."""
    if not auth or not auth.credentials:
        raise HTTPException(status_code=401, detail="Authentication required")

    token = auth.credentials

    # Accept hardcoded admin token for scripts
    if token == "admin-token-mvp":
        admin = db.query(User).filter(User.role == "ADMIN").first()
        if not admin:
            raise HTTPException(status_code=404, detail="No admin user found")
        return admin

    # Mock JWT token from frontend: mock-jwt-token-ROLE-timestamp
    if token.startswith("mock-jwt-token-"):
        parts = token.split("-")
        if len(parts) >= 4:
            role = parts[3]
            if role in ALL_ADMIN_ACCESS_ROLES:
                user = db.query(User).filter(User.role == role).first()
                if not user:
                    raise HTTPException(status_code=404, detail=f"No {role} user found")
                return user
            else:
                raise HTTPException(status_code=403, detail=f"Access denied. Your role: {role}")

    # Try matching by wallet address or email
    user = db.query(User).filter(
        (User.wallet_address == token) | (User.email == token)
    ).first()
    if not user:
        raise HTTPException(status_code=403, detail="Invalid authentication token")
    
    # Normalize role to string for comparison
    user_role = user.role.value if hasattr(user.role, 'value') else user.role
    
    if user_role not in ALL_ADMIN_ACCESS_ROLES:
        raise HTTPException(status_code=403, detail=f"Access denied. Your role: {user_role}")
    return user

# =============================================================================
# USER MANAGEMENT CRUD
# =============================================================================

@router.get("/users", response_model=UserListResponse)
async def list_users(
    role: Optional[str] = Query(None, description="Filter by role"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    search: Optional[str] = Query(None, description="Search email or name"),
    admin: User = Depends(verify_admin_readonly),
    db: Session = Depends(get_db)
):
    """List all users with optional filters. Read-only for REGULATOR/COMPLIANCE_OFFICER."""
    query = db.query(User)

    if role:
        query = query.filter(User.role == role)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    if search:
        search_like = f"%{search}%"
        query = query.filter(
            (User.email.ilike(search_like)) | (User.wallet_address.ilike(search_like))
        )

    users = query.order_by(User.id).all()
    result = []

    for u in users:
        profile = db.query(InvestorProfile).filter(InvestorProfile.user_id == u.id).first()
        bank = db.query(BankAccount).filter(BankAccount.user_id == u.id).first()
        result.append(UserResponse(
            id=u.id,
            email=u.email,
            role=u.role,
            wallet_address=u.wallet_address,
            is_active=u.is_active,
            has_password=u.password_hash is not None,
            created_at=u.created_at.isoformat() if u.created_at else None,
            full_name=profile.full_name if profile else None,
            kyc_status=profile.kyc_status if profile else None,
            bank_balance=float(bank.balance) if bank else None,
            bank_account_id=bank.account_id if bank else None,
        ))

    return UserListResponse(users=result, total=len(result))


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    admin: User = Depends(verify_admin_readonly),
    db: Session = Depends(get_db)
):
    """Get a single user's details. Read-only for REGULATOR/COMPLIANCE_OFFICER."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile = db.query(InvestorProfile).filter(InvestorProfile.user_id == user_id).first()
    bank = db.query(BankAccount).filter(BankAccount.user_id == user_id).first()

    return UserResponse(
        id=user.id,
        email=user.email,
        role=user.role,
        wallet_address=user.wallet_address,
        is_active=user.is_active,
        has_password=user.password_hash is not None,
        created_at=user.created_at.isoformat() if user.created_at else None,
        full_name=profile.full_name if profile else None,
        kyc_status=profile.kyc_status if profile else None,
        bank_balance=float(bank.balance) if bank else None,
        bank_account_id=bank.account_id if bank else None,
    )


@router.post("/users", response_model=UserResponse)
async def create_user(
    req: UserCreateRequest,
    admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
):
    """Create a new user. ADMIN only."""
    # Validate role
    valid_roles = [r.value for r in InvestorRoleEnum]
    if req.role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {valid_roles}")

    # Check email uniqueness
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already in use")

    # Validate wallet address format if provided
    if req.wallet_address:
        if not req.wallet_address.startswith("0x") or len(req.wallet_address) != 42:
            raise HTTPException(status_code=400, detail="Invalid wallet address format")
        # Check wallet uniqueness
        existing_wallet = db.query(User).filter(User.wallet_address == req.wallet_address).first()
        if existing_wallet:
            raise HTTPException(status_code=400, detail="Wallet address already in use")

    # Hash password
    pw_hash = bcrypt.hashpw(req.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    user = User(
        email=req.email,
        password_hash=pw_hash,
        role=req.role,
        wallet_address=req.wallet_address,
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(user)
    db.flush()  # Get user.id

    # Create investor profile for investor/operator roles
    investor_roles = {'INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'INDUSTRIAL_OPERATOR'}
    if req.role in investor_roles:
        profile = InvestorProfile(
            user_id=user.id,
            full_name=req.full_name or req.email.split('@')[0].replace('.', ' ').title(),
            wallet_address=req.wallet_address,
            kyc_status='PENDING',
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(profile)

    # Create bank account for investor/operator roles
    if req.role in investor_roles:
        bank = BankAccount(
            account_id=f"BA-{user.id:04d}",
            user_id=user.id,
            escrow_balance=0,
            available_balance=0,
            locked_amount=0,
            balance=0,
            currency='EUR',
            status='ACTIVE',
            bank_name='BIIC Bank',
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(bank)

    db.commit()
    db.refresh(user)

    return UserResponse(
        id=user.id, email=user.email, role=user.role,
        wallet_address=user.wallet_address, is_active=user.is_active,
        has_password=True, created_at=user.created_at.isoformat() if user.created_at else None,
        full_name=req.full_name, kyc_status='PENDING' if req.role in investor_roles else None,
        bank_balance=0.0 if req.role in investor_roles else None,
        bank_account_id=f"BA-{user.id:04d}" if req.role in investor_roles else None,
    )


@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    req: UserUpdateRequest,
    admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
):
    """Update user details (email, role, wallet, active status). ADMIN only."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if req.email is not None:
        existing = db.query(User).filter(User.email == req.email, User.id != user_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = req.email

    if req.role is not None:
        valid_roles = [r.value for r in InvestorRoleEnum]
        if req.role not in valid_roles:
            raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {valid_roles}")
        user.role = req.role

    if req.wallet_address is not None:
        if not req.wallet_address.startswith("0x") or len(req.wallet_address) != 42:
            raise HTTPException(status_code=400, detail="Invalid wallet address format")
        existing_wallet = db.query(User).filter(
            User.wallet_address == req.wallet_address, User.id != user_id
        ).first()
        if existing_wallet:
            raise HTTPException(status_code=400, detail="Wallet address already in use")
        user.wallet_address = req.wallet_address

    if req.is_active is not None:
        user.is_active = req.is_active

    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)

    profile = db.query(InvestorProfile).filter(InvestorProfile.user_id == user_id).first()
    bank = db.query(BankAccount).filter(BankAccount.user_id == user_id).first()

    return UserResponse(
        id=user.id, email=user.email, role=user.role,
        wallet_address=user.wallet_address, is_active=user.is_active,
        has_password=user.password_hash is not None,
        created_at=user.created_at.isoformat() if user.created_at else None,
        full_name=profile.full_name if profile else None,
        kyc_status=profile.kyc_status if profile else None,
        bank_balance=float(bank.balance) if bank else None,
        bank_account_id=bank.account_id if bank else None,
    )


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
):
    """Delete a user and all related data. ADMIN only. Use with caution."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Can't delete yourself
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    # Delete related data (order matters for FK constraints)
    db.query(WhitelistedWallet).filter(WhitelistedWallet.investor_id == user_id).delete()
    db.query(ComplianceActivity).filter(ComplianceActivity.user_id == user_id).delete()
    db.query(BankAccount).filter(BankAccount.user_id == user_id).delete()
    db.query(InvestorProfile).filter(InvestorProfile.user_id == user_id).delete()
    db.query(User).filter(User.id == user_id).delete()
    db.commit()

    return {"success": True, "message": f"User {user.email} deleted"}


@router.post("/users/{user_id}/reset-password")
async def reset_password(
    user_id: int,
    req: PasswordResetRequest,
    admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
):
    """Reset a user's password. ADMIN only."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    pw_hash = bcrypt.hashpw(req.new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user.password_hash = pw_hash
    user.updated_at = datetime.utcnow()
    db.commit()

    return {"success": True, "message": f"Password reset for {user.email}"}


@router.post("/users/{user_id}/toggle-active")
async def toggle_user_active(
    user_id: int,
    admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
):
    """Toggle a user's active/suspended status. ADMIN only."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = not user.is_active
    user.updated_at = datetime.utcnow()
    db.commit()

    status_str = "active" if user.is_active else "suspended"
    return {"success": True, "message": f"User {user.email} is now {status_str}", "is_active": user.is_active}

# =============================================================================
# DOCUMENT REVIEW
# =============================================================================

@router.get("/documents")
async def list_documents(
    status: Optional[str] = Query(None),
    admin: User = Depends(verify_admin_readonly),
    db: Session = Depends(get_db)
):
    """List all uploaded documents. Read-only for REGULATOR/COMPLIANCE_OFFICER."""
    query = db.query(Document)
    if status:
        query = query.filter(Document.upload_status == status)
    docs = query.order_by(Document.created_at.desc()).all()
    result = []
    for d in docs:
        result.append({
            "id": d.id, "investor_id": d.investor_id, "document_type": d.document_type,
            "document_name": d.document_name, "upload_status": d.upload_status,
            "verification_status": d.verification_status, "submitted_at": d.submitted_at.isoformat() if d.submitted_at else None,
            "reviewed_at": d.reviewed_at.isoformat() if d.reviewed_at else None,
            "review_notes": d.review_notes,
        })
    return {"documents": result, "total": len(result)}


@router.put("/documents/{doc_id}/review")
async def review_document(
    doc_id: int,
    req: DocumentReviewRequest,
    admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
):
    """Review and approve/reject a document. ADMIN only."""
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc.verification_status = req.verification_status
    doc.review_notes = req.review_notes
    doc.reviewed_by = admin.id
    doc.reviewed_at = datetime.utcnow()
    doc.upload_status = 'verified' if req.verification_status == 'APPROVED' else 'rejected'
    db.commit()

    return {"success": True, "message": f"Document {doc_id} marked as {req.verification_status}"}

# =============================================================================
# WHITELISTED WALLET MANAGEMENT
# =============================================================================

@router.get("/whitelisted-wallets")
async def list_whitelisted_wallets(
    admin: User = Depends(verify_admin_readonly),
    db: Session = Depends(get_db)
):
    """List all whitelisted wallets. Read-only for REGULATOR/COMPLIANCE_OFFICER."""
    wallets = db.query(WhitelistedWallet).all()
    result = []
    for w in wallets:
        result.append({
            "id": w.id, "investor_id": w.investor_id, "wallet_address": w.wallet_address,
            "label": w.label, "jurisdiction": w.jurisdiction, "is_approved": w.is_approved,
            "risk_level": w.risk_level, "created_at": w.created_at.isoformat() if w.created_at else None,
            "approved_at": w.approved_at.isoformat() if w.approved_at else None,
        })
    return {"wallets": result, "total": len(result)}


@router.put("/whitelisted-wallets/{wallet_id}")
async def update_whitelisted_wallet(
    wallet_id: int,
    req: WhitelistWalletRequest,
    admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
):
    """Approve/reject a whitelisted wallet. ADMIN only."""
    wallet = db.query(WhitelistedWallet).filter(WhitelistedWallet.id == wallet_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Whitelisted wallet not found")

    wallet.is_approved = req.is_approved
    wallet.risk_level = req.risk_level or wallet.risk_level
    if req.is_approved and not wallet.approved_at:
        wallet.approved_at = datetime.utcnow()
        wallet.approved_by = admin.id
    db.commit()

    return {"success": True, "message": f"Wallet {wallet.wallet_address} updated"}

# =============================================================================
# AUDIT LOG
# =============================================================================

@router.get("/audit-log", response_model=AuditResponse)
async def get_audit_log(
    user_id: Optional[int] = Query(None),
    activity_type: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    admin: User = Depends(verify_admin_readonly),
    db: Session = Depends(get_db)
):
    """Get compliance audit log. Read-only for REGULATOR/COMPLIANCE_OFFICER."""
    query = db.query(ComplianceActivity)
    if user_id:
        query = query.filter(ComplianceActivity.user_id == user_id)
    if activity_type:
        query = query.filter(ComplianceActivity.activity_type == activity_type)
    activities = query.order_by(ComplianceActivity.created_at.desc()).limit(limit).all()
    result = []
    for a in activities:
        result.append({
            "id": a.id, "user_id": a.user_id, "activity_type": a.activity_type,
            "target_id": a.target_id, "target_type": a.target_type,
            "details": a.details, "ip_address": a.ip_address,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        })
    return AuditResponse(activities=result, total=len(result))

# =============================================================================
# INVESTOR BANK ACCOUNT MANAGEMENT (fixed)
# =============================================================================

class InvestorBankResponse(BaseModel):
    id: int
    user_id: int
    email: str
    full_name: str
    role: str
    bank_account_id: Optional[str]
    bank_account_number: Optional[str]
    bank_name: Optional[str]
    escrow_balance: float
    available_balance: float
    locked_amount: float
    balance: float
    status: str
    created_at: Optional[str]

class InvestorBankUpdateRequest(BaseModel):
    balance_type: str = Field(..., description="escrow, available, or locked")
    operation: str = Field(..., description="increase or decrease")
    amount: float = Field(..., gt=0, description="Amount to adjust")
    reason: str = Field(..., description="Reason for the adjustment")


@router.get("/investors/bank-accounts", response_model=List[InvestorBankResponse])
async def get_all_investors_bank_accounts(
    admin: User = Depends(verify_admin_readonly),
    db: Session = Depends(get_db)
):
    """List all investors with bank account info. Read-only for REGULATOR/COMPLIANCE_OFFICER."""
    investors = db.query(User).filter(
        User.role.in_(['RETAIL_INVESTOR', 'INSTITUTIONAL_INVESTOR', 'INDUSTRIAL_OPERATOR'])
    ).all()
    result = []
    for inv in investors:
        profile = db.query(InvestorProfile).filter(InvestorProfile.user_id == inv.id).first()
        bank = db.query(BankAccount).filter(BankAccount.user_id == inv.id).first()
        result.append(InvestorBankResponse(
            id=inv.id, user_id=inv.id, email=inv.email,
            full_name=profile.full_name if profile else inv.email,
            role=inv.role,
            bank_account_id=bank.account_id if bank else None,
            bank_account_number=bank.account_number if bank else None,
            bank_name=bank.bank_name if bank else "Mock Bank",
            escrow_balance=float(bank.escrow_balance) if bank and bank.escrow_balance else 0.0,
            available_balance=float(bank.available_balance) if bank and bank.available_balance else 0.0,
            locked_amount=float(bank.locked_amount) if bank and bank.locked_amount else 0.0,
            balance=float(bank.balance) if bank else 0.0,
            status='active' if inv.is_active else 'suspended',
            created_at=inv.created_at.isoformat() if inv.created_at else None,
        ))
    return result


@router.post("/investors/{investor_id}/bank-account/update")
async def update_investor_bank_account(
    investor_id: int,
    request: InvestorBankUpdateRequest,
    admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
):
    """Update investor bank account balance. ADMIN only."""
    investor = db.query(User).filter(User.id == investor_id).first()
    if not investor:
        raise HTTPException(status_code=404, detail="Investor not found")

    bank = db.query(BankAccount).filter(BankAccount.user_id == investor_id).first()
    if not bank:
        raise HTTPException(status_code=404, detail="Bank account not found")

    valid_types = ['escrow', 'available', 'locked']
    if request.balance_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid balance type. Must be: {valid_types}")

    if request.operation not in ['increase', 'decrease']:
        raise HTTPException(status_code=400, detail="Operation must be 'increase' or 'decrease'")

    balance_field = f"{request.balance_type}_balance"
    current_balance = getattr(bank, balance_field)

    if request.operation == 'increase':
        new_balance = current_balance + request.amount
    else:
        new_balance = current_balance - request.amount
        if new_balance < 0:
            raise HTTPException(status_code=400, detail=f"Cannot reduce {request.balance_type} below zero")

    setattr(bank, balance_field, new_balance)
    # Update total balance
    bank.balance = bank.available_balance + bank.locked_amount
    bank.updated_at = datetime.utcnow()
    db.commit()

    return {
        "success": True,
        "message": f"{request.operation.capitalize()}d {request.balance_type} by €{request.amount:,.2f}",
        "investor_id": investor_id, "investor_email": investor.email,
        "balance_type": request.balance_type, "operation": request.operation,
        "amount": request.amount, "previous_balance": current_balance,
        "new_balance": new_balance, "updated_at": datetime.utcnow().isoformat(),
    }


@router.post("/investors/{investor_id}/status")
async def update_investor_status(
    investor_id: int,
    status_update: dict,
    admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
):
    """Update investor active/suspended status. ADMIN only. FIXED: uses is_active."""
    investor = db.query(User).filter(User.id == investor_id).first()
    if not investor:
        raise HTTPException(status_code=404, detail="Investor not found")

    new_status = status_update.get('status')
    if new_status not in ['active', 'suspended']:
        raise HTTPException(status_code=400, detail="Invalid status. Must be 'active' or 'suspended'")

    investor.is_active = new_status == 'active'
    investor.updated_at = datetime.utcnow()
    db.commit()

    return {
        "success": True,
        "message": f"Updated {investor.email} to {new_status}",
        "investor_id": investor_id, "new_status": new_status,
        "updated_at": datetime.utcnow().isoformat(),
    }

# =============================================================================
# PLATFORM STATS / DASHBOARD
# =============================================================================

@router.get("/dashboard")
async def admin_dashboard(
    admin: User = Depends(verify_admin_readonly),
    db: Session = Depends(get_db)
):
    """Get admin dashboard stats. Read-only for REGULATOR/COMPLIANCE_OFFICER."""
    total_users = db.query(func.count(User.id)).scalar()
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar()
    total_investors = db.query(func.count(User.id)).filter(
        User.role.in_(['RETAIL_INVESTOR', 'INSTITUTIONAL_INVESTOR', 'INDUSTRIAL_OPERATOR'])
    ).scalar()
    total_bank_accounts = db.query(func.count(BankAccount.id)).scalar()
    total_pool_balance = db.query(func.sum(BankAccount.balance)).scalar() or 0
    total_investments = db.query(func.count(Investment.id)).scalar()
    total_transactions = db.query(func.count(Transaction.id)).scalar()
    pending_docs = db.query(func.count(Document.id)).filter(
        Document.verification_status == 'PENDING'
    ).scalar()
    pool_count = db.query(func.count(Pool.id)).scalar()

    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_investors": total_investors,
        "total_bank_accounts": total_bank_accounts,
        "total_platform_balance": float(total_pool_balance),
        "total_investments": total_investments,
        "total_transactions": total_transactions,
        "pending_documents": pending_docs,
        "pool_count": pool_count,
    }

# =============================================================================
# THRESHOLD ENDPOINTS (must be after dependencies)
# =============================================================================

@router.get("/thresholds")
async def get_thresholds_endpoint(admin: User = Depends(verify_admin_readonly), db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Get all current threshold values. Loads from DB if needed. Read-only."""
    load_thresholds_from_db(db)
    return {"thresholds": CURRENT_THRESHOLDS.dict(), "last_updated": datetime.utcnow().isoformat(), "updated_by": "system"}

@router.post("/thresholds")
async def update_thresholds_endpoint(
    request: ThresholdUpdateRequest, admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Update threshold configuration. ADMIN only. Persists to database."""
    global CURRENT_THRESHOLDS
    valid_keys = set(ThresholdConfig.__fields__.keys())
    invalid_keys = set(request.thresholds.keys()) - valid_keys
    if invalid_keys:
        raise HTTPException(status_code=400, detail=f"Invalid threshold keys: {invalid_keys}")
    old_values = CURRENT_THRESHOLDS.dict()
    current_dict = CURRENT_THRESHOLDS.dict()
    current_dict.update(request.thresholds)
    for key, value in current_dict.items():
        if isinstance(value, (int, float)) and value < 0:
            raise HTTPException(status_code=400, detail=f"Threshold {key} cannot be negative")
    CURRENT_THRESHOLDS = ThresholdConfig(**current_dict)
    # Persist to database
    save_thresholds_to_db(db)
    return {"success": True, "message": f"Updated {len(request.thresholds)} threshold(s) — saved to database", "changes": request.thresholds,
            "audit_log": {"changed_by": admin.email, "changed_at": datetime.utcnow().isoformat(),
                           "changes": request.thresholds, "old_values": {k: old_values[k] for k in request.thresholds.keys()},
                           "reason": request.reason}}

@router.get("/thresholds/validate")
async def validate_thresholds(admin: User = Depends(verify_admin_readonly)) -> Dict[str, Any]:
    """Validate current threshold configuration. Read-only."""
    t = CURRENT_THRESHOLDS.dict()
    warnings, errors = [], []
    if t["MIN_DEPOSIT"] > t["MAX_DEPOSIT"]: errors.append("MIN_DEPOSIT cannot be greater than MAX_DEPOSIT")
    if t["RETAIL_MAX"] > t["INSTITUTIONAL_MIN"]: warnings.append("RETAIL_MAX is higher than INSTITUTIONAL_MIN")
    if t["TXN_FLAG_LARGE"] > t["TXN_FLAG_VERY_LARGE"]: errors.append("TXN_FLAG_LARGE cannot be greater than TXN_FLAG_VERY_LARGE")
    return {"valid": len(errors) == 0, "warnings": warnings, "errors": errors, "thresholds": t}

@router.get("/thresholds/export")
async def export_thresholds(admin: User = Depends(verify_admin_readonly)) -> Dict[str, Any]:
    """Export threshold configuration. Read-only."""
    return {"version": "1.0", "exported_at": datetime.utcnow().isoformat(), "exported_by": admin.email, "thresholds": CURRENT_THRESHOLDS.dict()}

@router.post("/thresholds/import")
async def import_thresholds(thresholds: Dict[str, Any], reason: str, admin: User = Depends(verify_admin_write)) -> Dict[str, Any]:
    """Import threshold configuration. ADMIN only."""
    global CURRENT_THRESHOLDS
    valid_keys = set(ThresholdConfig.__fields__.keys())
    invalid_keys = set(thresholds.keys()) - valid_keys
    if invalid_keys:
        raise HTTPException(status_code=400, detail=f"Invalid threshold key: {invalid_keys}")
    CURRENT_THRESHOLDS = ThresholdConfig(**thresholds)
    return {"success": True, "message": f"Imported {len(thresholds)} threshold(s)", "imported_at": datetime.utcnow().isoformat()}

# =============================================================================
# GENERAL SETTINGS ENDPOINTS
# =============================================================================

class GeneralSettingsUpdate(BaseModel):
    platform_name: Optional[str] = None
    support_email: Optional[str] = None
    network: Optional[str] = None

@router.get("/settings/general")
async def get_general_settings(admin: User = Depends(verify_admin_readonly), db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Get general platform settings. Read-only."""
    try:
        r = db.execute(text("SELECT key, value FROM platform_settings WHERE category = 'general'"))
        result = {row[0]: row[1] for row in r.fetchall()}
    except Exception:
        result = {}
    return {
        "platform_name": result.get('platform_name', 'Ujamaa DeFi Platform'),
        "support_email": result.get('support_email', 'support@ujamaa-defi.com'),
        "network": result.get('network', 'testnet'),
    }

@router.put("/settings/general")
async def update_general_settings(
    req: GeneralSettingsUpdate, admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Update general platform settings. ADMIN only."""
    updates = {}
    if req.platform_name is not None: updates['platform_name'] = req.platform_name
    if req.support_email is not None: updates['support_email'] = req.support_email
    if req.network is not None: updates['network'] = req.network
    for key, value in updates.items():
        db.execute(text("""
            INSERT INTO platform_settings (category, key, value)
            VALUES ('general', :key, CAST(:value AS TEXT))
            ON CONFLICT (category, key) DO UPDATE SET value = CAST(:value AS TEXT)
        """), {'key': key, 'value': value})
    db.commit()
    return {"success": True, "message": "General settings saved", "changes": updates}


# =============================================================================
# FEE SETTINGS ENDPOINTS
# =============================================================================

class FeeSettingsUpdate(BaseModel):
    management_fee: Optional[float] = None
    performance_fee: Optional[float] = None
    hurdle_rate: Optional[float] = None

@router.get("/settings/fees")
async def get_fee_settings(admin: User = Depends(verify_admin_readonly), db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Get fee configuration. Read-only."""
    try:
        r = db.execute(text("SELECT key, value FROM platform_settings WHERE category = 'fees'"))
        result = {row[0]: float(row[1]) if row[1] else None for row in r.fetchall()}
    except Exception:
        result = {}
    return {
        "management_fee": result.get('management_fee', 2.0),
        "performance_fee": result.get('performance_fee', 20.0),
        "hurdle_rate": result.get('hurdle_rate', 5.0),
    }

@router.put("/settings/fees")
async def update_fee_settings(
    req: FeeSettingsUpdate, admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Update fee configuration. ADMIN only."""
    updates = {}
    if req.management_fee is not None: updates['management_fee'] = req.management_fee
    if req.performance_fee is not None: updates['performance_fee'] = req.performance_fee
    if req.hurdle_rate is not None: updates['hurdle_rate'] = req.hurdle_rate
    for key, value in updates.items():
        db.execute(text("""
            INSERT INTO platform_settings (category, key, value)
            VALUES ('fees', :key, CAST(:value AS TEXT))
            ON CONFLICT (category, key) DO UPDATE SET value = CAST(:value AS TEXT)
        """), {'key': key, 'value': str(value)})
    db.commit()
    return {"success": True, "message": "Fee settings saved", "changes": req.dict(exclude_none=True)}


# =============================================================================
# COMPLIANCE SETTINGS ENDPOINTS
# =============================================================================

class ComplianceSettingsUpdate(BaseModel):
    kyc_required: Optional[bool] = Field(None, alias='kycRequired')
    accreditation_required: Optional[bool] = Field(None, alias='accreditationRequired')
    auto_approve_low_risk: Optional[bool] = Field(None, alias='autoApproveLowRisk')
    
    model_config = {"populate_by_name": True}

@router.get("/settings/compliance")
async def get_compliance_settings(admin: User = Depends(verify_admin_readonly), db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Get compliance configuration. Read-only."""
    try:
        r = db.execute(text("SELECT key, value FROM platform_settings WHERE category = 'compliance'"))
        result = {row[0]: row[1] for row in r.fetchall()}
    except Exception:
        result = {}
    def to_bool(v):
        if v is None: return True
        if isinstance(v, bool): return v
        s = str(v).strip().lower()
        if s in ('1', 'true', 'yes'): return True
        if s in ('0', 'false', 'no'): return False
        return True
    return {
        "kycRequired": to_bool(result.get('kyc_required')),
        "accreditationRequired": to_bool(result.get('accreditation_required')),
        "autoApproveLowRisk": to_bool(result.get('auto_approve_low_risk')),
    }

@router.put("/settings/compliance")
async def update_compliance_settings(
    req: ComplianceSettingsUpdate, admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Update compliance configuration. ADMIN only."""
    updates = {}
    if req.kyc_required is not None: updates['kyc_required'] = '1' if req.kyc_required else '0'
    if req.accreditation_required is not None: updates['accreditation_required'] = '1' if req.accreditation_required else '0'
    if req.auto_approve_low_risk is not None: updates['auto_approve_low_risk'] = '1' if req.auto_approve_low_risk else '0'
    for key, value in updates.items():
        db.execute(text("""
            INSERT INTO platform_settings (category, key, value)
            VALUES ('compliance', :key, CAST(:value AS TEXT))
            ON CONFLICT (category, key) DO UPDATE SET value = CAST(:value AS TEXT)
        """), {'key': key, 'value': str(value)})
    db.commit()
    return {"success": True, "message": "Compliance settings saved", "changes": req.dict(exclude_none=True)}


# =============================================================================
# CONTRACT MANAGEMENT
# =============================================================================

class ContractResponse(BaseModel):
    id: int
    name: str
    address: str
    contract_type: str
    network: str
    description: Optional[str]
    status: str
    verified: bool
    explorer_url: Optional[str]
    tx_hash: Optional[str]
    created_at: Optional[str]

class ContractCreateRequest(BaseModel):
    name: str
    address: str
    contract_type: str
    network: str = "Polygon Amoy"
    chain_id: int = 80002
    description: Optional[str] = None
    tx_hash: Optional[str] = None
    block_number: Optional[int] = None
    explorer_url: Optional[str] = None
    verified: bool = False


def _seed_default_contracts(db: Session) -> None:
    """Seed default contracts from web3 config if table is empty."""
    if db.query(Contract).count() > 0:
        return

    from config.web3 import web3_config
    wc = web3_config.CONTRACTS
    defaults = [
        {"name": "ULPTokenizer", "address": wc.ULP_TOKEN, "contract_type": "ERC-3643-style Token", "description": "Yield-bearing liquidity pool token with identity verification."},
        {"name": "GuaranteeTokenizer", "address": wc.UGT_TOKEN, "contract_type": "ERC-721 NFT", "description": "NFT collateral token for industrial operator commitments."},
        {"name": "MockEUROD", "address": wc.MOCK_EUROD, "contract_type": "ERC-20 Stablecoin", "description": "Mock Euro stablecoin for testnet."},
        {"name": "LiquidityPool", "address": wc.LIQUIDITY_POOL, "contract_type": "Pool Management", "description": "Multi-asset liquidity pool manager for industrial financing."},
        {"name": "IndustrialGateway", "address": wc.INDUSTRIAL_GATEWAY, "contract_type": "Gateway", "description": "Certifies industrial assets and mints GuaranteeTokens."},
        {"name": "JurisdictionCompliance", "address": wc.JURISDICTION_COMPLIANCE, "contract_type": "Compliance", "description": "Jurisdiction-based compliance with OFAC/UN/EU/FATF sanctions."},
        {"name": "NavGateway", "address": wc.NAV_GATEWAY, "contract_type": "NAV Oracle", "description": "Net Asset Value oracle for uLP token pricing."},
        {"name": "MockEscrow", "address": wc.MOCK_ESCROW, "contract_type": "Escrow", "description": "Mock escrow for fund holding during investor transactions."},
        {"name": "MockFiatRamp", "address": wc.MOCK_FIAT_RAMP, "contract_type": "Fiat Gateway", "description": "Mock fiat on/off ramp for testnet."},
    ]
    for d in defaults:
        try:
            c = Contract(
                name=d["name"],
                address=d["address"],
                contract_type=d["contract_type"],
                network="Polygon Amoy",
                chain_id=80002,
                description=d["description"],
                status="deployed",
                explorer_url=f"https://amoy.polygonscan.com/address/{d['address']}",
                verified=True,
            )
            db.add(c)
        except Exception:
            pass  # skip if contract already exists
    try:
        db.commit()
    except Exception:
        db.rollback()


@router.get("/contracts", response_model=List[ContractResponse])
async def list_contracts(
    admin: User = Depends(verify_admin_readonly),
    db: Session = Depends(get_db)
):
    """List all deployed smart contracts. Read-only for REGULATOR/COMPLIANCE_OFFICER."""
    _seed_default_contracts(db)
    contracts = db.query(Contract).order_by(Contract.id).all()
    return contracts


@router.post("/contracts", response_model=ContractResponse)
async def register_contract(
    req: ContractCreateRequest,
    admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
):
    """Register a new deployed contract. ADMIN only."""
    existing = db.query(Contract).filter(Contract.name == req.name).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Contract '{req.name}' already exists")

    if not req.address.startswith("0x") or len(req.address) != 42:
        raise HTTPException(status_code=400, detail="Invalid contract address format")

    contract = Contract(
        name=req.name,
        address=req.address,
        contract_type=req.contract_type,
        network=req.network,
        chain_id=req.chain_id,
        description=req.description,
        tx_hash=req.tx_hash,
        block_number=req.block_number,
        explorer_url=req.explorer_url,
        status="deployed",
        verified=req.verified,
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)

    return contract


@router.put("/contracts/{contract_id}", response_model=ContractResponse)
async def update_contract(
    contract_id: int,
    req: ContractCreateRequest,
    admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
):
    """Update contract details. ADMIN only."""
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    if req.address:
        if not req.address.startswith("0x") or len(req.address) != 42:
            raise HTTPException(status_code=400, detail="Invalid contract address format")
        contract.address = req.address
    if req.contract_type:
        contract.contract_type = req.contract_type
    if req.description is not None:
        contract.description = req.description
    if req.network:
        contract.network = req.network
    if req.tx_hash:
        contract.tx_hash = req.tx_hash
    if req.block_number:
        contract.block_number = req.block_number
    if req.explorer_url:
        contract.explorer_url = req.explorer_url
    if req.verified is not None:
        contract.verified = req.verified

    contract.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(contract)

    return contract


@router.delete("/contracts/{contract_id}")
async def delete_contract(
    contract_id: int,
    admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
):
    """Delete a contract record. ADMIN only."""
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    db.delete(contract)
    db.commit()
    return {"success": True, "message": f"Contract '{contract.name}' deleted"}
