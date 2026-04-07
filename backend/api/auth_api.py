"""
Authentication API - Login / Register

Handles user authentication and session management.
"""

import bcrypt
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from config.database import get_db
from config.models import (
    User, InvestorProfile, BankAccount, InvestorRoleEnum, ComplianceStatusEnum
)

router = APIRouter(prefix="/api/v2/auth", tags=["Authentication"])


# =============================================================================
# Pydantic Models
# =============================================================================

class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    user: dict
    token: str
    investor_profile: Optional[dict] = None


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str
    jurisdiction: str = "MU"
    company_name: Optional[str] = None
    wallet_address: Optional[str] = None


class RegisterResponse(BaseModel):
    user: dict
    investor_profile: Optional[dict] = None


# =============================================================================
# Endpoints
# =============================================================================

@router.post("/login", response_model=LoginResponse)
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    """
    Login with email and password.

    Returns user info, investor profile, and mock auth token.
    """
    # Find user by email
    user = db.query(User).filter(User.email == req.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Verify password
    if not user.password_hash:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    try:
        if not bcrypt.checkpw(req.password.encode('utf-8'), user.password_hash.encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid email or password")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Check if user is active
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled. Contact admin.")

    # Get investor profile if exists
    profile = db.query(InvestorProfile).filter(InvestorProfile.user_id == user.id).first()
    profile_data = None
    if profile:
        profile_data = {
            "id": profile.id,
            "kyc_status": profile.kyc_status.value if profile.kyc_status else None,
            "kyb_status": profile.kyb_status.value if profile.kyb_status else None,
            "full_name": profile.full_name,
            "jurisdiction": profile.jurisdiction,
        }

    # Build response
    role_str = user.role.value if hasattr(user.role, 'value') else user.role

    return LoginResponse(
        user={
            "id": user.id,
            "email": user.email,
            "role": role_str,
            "wallet_address": user.wallet_address,
            "is_active": user.is_active,
        },
        token=f"mock-jwt-token-{role_str}-{user.id}-{int(datetime.utcnow().timestamp())}",
        investor_profile=profile_data,
    )


@router.post("/register", response_model=RegisterResponse)
async def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user.

    Creates user, investor profile, and bank account.
    """
    # Validate role
    valid_roles = [r.value for r in InvestorRoleEnum]
    if req.role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {valid_roles}")

    # Check email uniqueness
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already in use")

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
    db.flush()

    # Create investor profile for investor/operator roles
    investor_roles = {'INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'INDUSTRIAL_OPERATOR'}
    profile_data = None
    if req.role in investor_roles:
        is_institutional = req.role == 'INSTITUTIONAL_INVESTOR'
        is_retail = req.role == 'RETAIL_INVESTOR'
        is_operator = req.role == 'INDUSTRIAL_OPERATOR'

        profile = InvestorProfile(
            user_id=user.id,
            full_name=req.full_name,
            company_name=req.company_name,
            jurisdiction=req.jurisdiction,
            wallet_address=req.wallet_address,
            kyc_status=ComplianceStatusEnum.PENDING if is_retail else None,
            kyb_status=ComplianceStatusEnum.PENDING if (is_institutional or is_operator) else None,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(profile)
        db.flush()

        profile_data = {
            "id": profile.id,
            "kyc_status": profile.kyc_status.value if profile.kyc_status else None,
            "kyb_status": profile.kyb_status.value if profile.kyb_status else None,
        }

        # Create bank account
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

    role_str = user.role.value if hasattr(user.role, 'value') else user.role

    return RegisterResponse(
        user={
            "id": user.id,
            "email": user.email,
            "role": role_str,
        },
        investor_profile=profile_data,
    )
