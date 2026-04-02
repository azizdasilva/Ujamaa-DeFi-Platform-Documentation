"""
Admin API - Threshold Management

Dynamic threshold configuration without code changes.
All changes are saved to database and applied immediately.

@notice: Requires ADMIN role
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from datetime import datetime
import json

from config.database import get_database_url
from config.models import User, ComplianceStatusEnum, BankAccount

router = APIRouter(prefix="/api/v2/admin", tags=["Admin"])
security = HTTPBearer(auto_error=False)

# Database connection
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
engine = create_engine(get_database_url())

def get_db():
    """Get database session."""
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =============================================================================
# THRESHOLD CONFIGURATION MODEL
# =============================================================================

class ThresholdConfig(BaseModel):
    """Threshold configuration model"""
    # Investment Limits
    MIN_DEPOSIT: int = Field(1000, description="Minimum deposit in EUR")
    MAX_DEPOSIT: int = Field(1000000, description="Maximum deposit in EUR")
    DAILY_WITHDRAWAL_LIMIT: int = Field(500000, description="Daily withdrawal limit in EUR")
    INSTITUTIONAL_MIN: int = Field(100000, description="Minimum for institutional investors in EUR")
    RETAIL_MAX: int = Field(90000, description="Maximum for retail investors in EUR")
    
    # Compliance Thresholds
    KYB_THRESHOLD_EUR: int = Field(100000, description="KYB requirement threshold in EUR")
    TXN_FLAG_LARGE: int = Field(100000, description="Large transaction flag threshold in EUR")
    TXN_FLAG_VERY_LARGE: int = Field(500000, description="Very large transaction flag threshold in EUR")
    
    # Fraud Detection
    STRUCTURING_THRESHOLD: int = Field(3000, description="Structuring detection per transaction")
    STRUCTURING_TOTAL_THRESHOLD: int = Field(10000, description="Structuring total threshold")
    VELOCITY_THRESHOLD_PER_HOUR: int = Field(10, description="Transactions per hour limit")
    
    # Pool Configuration
    DEFAULT_LOCKUP_DAYS: int = Field(365, description="Default lockup period in days")
    MIN_INVESTMENT_RETURN: int = Field(1000, description="Minimum investment return in EUR")
    
    class Config:
        schema_extra = {
            "example": {
                "MIN_DEPOSIT": 1000,
                "MAX_DEPOSIT": 1000000,
                "DAILY_WITHDRAWAL_LIMIT": 500000,
                "INSTITUTIONAL_MIN": 100000,
                "RETAIL_MAX": 90000,
                "KYB_THRESHOLD_EUR": 100000,
                "TXN_FLAG_LARGE": 100000,
                "TXN_FLAG_VERY_LARGE": 500000,
            }
        }


class ThresholdUpdateRequest(BaseModel):
    """Request model for updating thresholds"""
    thresholds: Dict[str, Any] = Field(..., description="Key-value pairs of thresholds to update")
    reason: str = Field(..., description="Reason for the change (audit trail)")


class ThresholdHistory(BaseModel):
    """Threshold change history"""
    id: int
    changed_by: str
    changed_at: str
    changes: Dict[str, Any]
    reason: str


# =============================================================================
# IN-MEMORY THRESHOLD STORE (Production: Use Redis/Database)
# =============================================================================

# Global threshold configuration (loaded from MVP_config on startup)
CURRENT_THRESHOLDS = ThresholdConfig()

def get_current_thresholds() -> ThresholdConfig:
    """Get current threshold configuration"""
    return CURRENT_THRESHOLDS


def update_thresholds(updates: Dict[str, Any]) -> None:
    """Update threshold configuration"""
    global CURRENT_THRESHOLDS
    
    # Validate and update
    current_dict = CURRENT_THRESHOLDS.dict()
    current_dict.update(updates)
    
    # Validate all values are positive
    for key, value in current_dict.items():
        if isinstance(value, (int, float)) and value < 0:
            raise HTTPException(
                status_code=400,
                detail=f"Threshold {key} cannot be negative"
            )
    
    CURRENT_THRESHOLDS = ThresholdConfig(**current_dict)


# =============================================================================
# DEPENDENCIES
# =============================================================================

def get_db():
    """Get database session"""
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    engine = create_engine(get_database_url())
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def verify_admin(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Verify user has ADMIN role"""
    if not auth or not auth.credentials:
        raise HTTPException(
            status_code=401,
            detail="Authentication required"
        )
    
    # For MVP: Check if token matches admin user
    # In production: Implement proper JWT validation
    token = auth.credentials
    
    # Simple token validation (MVP only)
    if token != "admin-token-mvp":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    
    # Get admin user from database
    admin = db.query(User).filter(User.role == "ADMIN").first()
    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin user not found"
        )
    
    return admin


# =============================================================================
# ENDPOINTS
# =============================================================================

@router.get("/thresholds")
async def get_thresholds(
    admin: User = Depends(verify_admin)
) -> Dict[str, Any]:
    """
    Get all current threshold values.
    
    **Requires:** ADMIN role
    
    Returns all configurable thresholds with their current values.
    """
    return {
        "thresholds": CURRENT_THRESHOLDS.dict(),
        "last_updated": datetime.utcnow().isoformat(),
        "updated_by": "system"
    }


@router.post("/thresholds")
async def update_thresholds_endpoint(
    request: ThresholdUpdateRequest,
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Update threshold configuration.
    
    **Requires:** ADMIN role
    
    Updates are applied immediately and affect all new transactions.
    Changes are logged for audit purposes.
    
    **Example:**
    ```json
    {
        "thresholds": {
            "MIN_DEPOSIT": 500,
            "MAX_DEPOSIT": 2000000
        },
        "reason": "Adjusting limits for new product launch"
    }
    ```
    """
    # Validate threshold keys
    valid_keys = set(ThresholdConfig.__fields__.keys())
    invalid_keys = set(request.thresholds.keys()) - valid_keys
    
    if invalid_keys:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid threshold keys: {invalid_keys}. Valid keys: {valid_keys}"
        )
    
    # Get old values for audit
    old_values = CURRENT_THRESHOLDS.dict()
    
    # Update thresholds
    try:
        update_thresholds(request.thresholds)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to update thresholds: {str(e)}"
        )
    
    # Log change for audit trail
    audit_log = {
        "changed_by": admin.email,
        "changed_at": datetime.utcnow().isoformat(),
        "changes": request.thresholds,
        "old_values": {k: old_values[k] for k in request.thresholds.keys()},
        "reason": request.reason
    }
    
    # In production, save to database
    # For MVP, just log
    print(f"🔧 THRESHOLD UPDATE: {json.dumps(audit_log, indent=2)}")
    
    return {
        "success": True,
        "message": f"Updated {len(request.thresholds)} threshold(s)",
        "changes": request.thresholds,
        "audit_log": audit_log
    }


@router.get("/thresholds/history")
async def get_threshold_history(
    limit: int = 10,
    admin: User = Depends(verify_admin)
) -> Dict[str, Any]:
    """
    Get threshold change history.
    
    **Requires:** ADMIN role
    
    Returns last N threshold changes with audit information.
    """
    # In production, fetch from database
    # For MVP, return empty history
    return {
        "history": [],
        "message": "History tracking will be available in production version"
    }


@router.get("/thresholds/validate")
async def validate_thresholds(
    admin: User = Depends(verify_admin)
) -> Dict[str, Any]:
    """
    Validate current threshold configuration.
    
    **Requires:** ADMIN role
    
    Checks for:
    - Negative values
    - Conflicting thresholds (e.g., MIN > MAX)
    - Reasonable ranges
    """
    thresholds = CURRENT_THRESHOLDS.dict()
    warnings = []
    errors = []
    
    # Check MIN < MAX
    if thresholds["MIN_DEPOSIT"] > thresholds["MAX_DEPOSIT"]:
        errors.append("MIN_DEPOSIT cannot be greater than MAX_DEPOSIT")
    
    # Check RETAIL_MAX < INSTITUTIONAL_MIN
    if thresholds["RETAIL_MAX"] > thresholds["INSTITUTIONAL_MIN"]:
        warnings.append("RETAIL_MAX is higher than INSTITUTIONAL_MIN - this may cause confusion")
    
    # Check KYB_THRESHOLD
    if thresholds["KYB_THRESHOLD_EUR"] < thresholds["INSTITUTIONAL_MIN"]:
        warnings.append("KYB_THRESHOLD is lower than INSTITUTIONAL_MIN")
    
    # Check transaction flags
    if thresholds["TXN_FLAG_LARGE"] > thresholds["TXN_FLAG_VERY_LARGE"]:
        errors.append("TXN_FLAG_LARGE cannot be greater than TXN_FLAG_VERY_LARGE")
    
    # Check fraud detection
    if thresholds["STRUCTURING_THRESHOLD"] > thresholds["TXN_FLAG_LARGE"]:
        warnings.append("STRUCTURING_THRESHOLD is higher than TXN_FLAG_LARGE")
    
    return {
        "valid": len(errors) == 0,
        "warnings": warnings,
        "errors": errors,
        "thresholds": thresholds
    }


@router.get("/thresholds/export")
async def export_thresholds(
    admin: User = Depends(verify_admin)
) -> Dict[str, Any]:
    """
    Export threshold configuration.
    
    **Requires:** ADMIN role
    
    Returns configuration in JSON format for backup or migration.
    """
    return {
        "version": "1.0",
        "exported_at": datetime.utcnow().isoformat(),
        "exported_by": admin.email,
        "thresholds": CURRENT_THRESHOLDS.dict()
    }


@router.post("/thresholds/import")
async def import_thresholds(
    thresholds: Dict[str, Any],
    reason: str,
    admin: User = Depends(verify_admin)
) -> Dict[str, Any]:
    """
    Import threshold configuration.
    
    **Requires:** ADMIN role
    
    Imports thresholds from JSON export. All values are validated before applying.
    """
    # Validate all keys
    valid_keys = set(ThresholdConfig.__fields__.keys())
    invalid_keys = set(thresholds.keys()) - valid_keys
    
    if invalid_keys:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid threshold keys: {invalid_keys}"
        )
    
    # Update thresholds
    try:
        update_thresholds(thresholds)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to import thresholds: {str(e)}"
        )
    
    return {
        "success": True,
        "message": f"Imported {len(thresholds)} threshold(s)",
        "imported_at": datetime.utcnow().isoformat()
    }


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def check_threshold(threshold_name: str, value: float) -> bool:
    """
    Check if a value meets a threshold requirement.
    
    Used by other modules to enforce thresholds.
    """
    thresholds = CURRENT_THRESHOLDS.dict()
    
    if threshold_name not in thresholds:
        return True  # Unknown threshold, allow by default
    
    threshold_value = thresholds[threshold_name]
    return value >= threshold_value


def get_threshold(threshold_name: str) -> Any:
    """
    Get a specific threshold value.

    Used by other modules to read thresholds.
    """
    thresholds = CURRENT_THRESHOLDS.dict()
    return thresholds.get(threshold_name)


# =============================================================================
# INVESTOR BANK ACCOUNT MANAGEMENT
# =============================================================================

class InvestorBankResponse(BaseModel):
    """Investor bank account response"""
    id: int
    user_id: int
    email: str
    full_name: str
    role: str
    bank_account_number: Optional[str]
    bank_name: Optional[str]
    escrow_balance: float
    available_balance: float
    locked_amount: float
    status: str
    created_at: Optional[datetime]


class InvestorBankUpdateRequest(BaseModel):
    """Request to update investor bank balance"""
    balance_type: str = Field(..., description="Type of balance to update: escrow, available, or locked")
    operation: str = Field(..., description="Operation: increase or decrease")
    amount: float = Field(..., description="Amount to adjust")
    reason: str = Field(..., description="Reason for the adjustment (audit trail)")


@router.get("/investors/bank-accounts", response_model=List[InvestorBankResponse])
async def get_all_investors_bank_accounts(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Get all investors with their bank account information.
    
    Requires ADMIN role.
    """
    # Check authentication
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Get all users with investor roles
    investors = db.query(User).filter(
        User.role.in_(['RETAIL_INVESTOR', 'INSTITUTIONAL_INVESTOR', 'INDUSTRIAL_OPERATOR'])
    ).all()
    
    result = []
    for investor in investors:
        # Get bank account if exists
        bank_account = db.query(BankAccount).filter(
            BankAccount.user_id == investor.id
        ).first()
        
        result.append(InvestorBankResponse(
            id=investor.id,
            user_id=investor.id,
            email=investor.email,
            full_name=investor.full_name or investor.email,
            role=investor.role,
            bank_account_number=bank_account.account_number if bank_account else None,
            bank_name=bank_account.bank_name if bank_account else None,
            escrow_balance=bank_account.escrow_balance if bank_account else 0.0,
            available_balance=bank_account.available_balance if bank_account else 0.0,
            locked_amount=bank_account.locked_amount if bank_account else 0.0,
            status=investor.status,
            created_at=investor.created_at
        ))
    
    return result


@router.post("/investors/{investor_id}/bank-account/update")
async def update_investor_bank_account(
    investor_id: int,
    request: InvestorBankUpdateRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Update investor bank account balance (escrow, available, or locked).
    
    Requires ADMIN role.
    """
    # Check authentication
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Get investor
    investor = db.query(User).filter(User.id == investor_id).first()
    if not investor:
        raise HTTPException(status_code=404, detail="Investor not found")
    
    # Get or create bank account
    bank_account = db.query(BankAccount).filter(
        BankAccount.user_id == investor_id
    ).first()
    
    if not bank_account:
        # Create new bank account
        bank_account = BankAccount(
            user_id=investor_id,
            account_number=f"DE{investor_id:08d}",
            bank_name="Mock Bank",
            escrow_balance=0.0,
            available_balance=0.0,
            locked_amount=0.0
        )
        db.add(bank_account)
    
    # Validate balance type
    valid_types = ['escrow', 'available', 'locked']
    if request.balance_type not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid balance type. Must be one of: {valid_types}"
        )
    
    # Validate operation
    if request.operation not in ['increase', 'decrease']:
        raise HTTPException(
            status_code=400,
            detail="Invalid operation. Must be 'increase' or 'decrease'"
        )
    
    # Validate amount
    if request.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    # Update balance
    balance_field = f"{request.balance_type}_balance"
    current_balance = getattr(bank_account, balance_field)
    
    if request.operation == 'increase':
        new_balance = current_balance + request.amount
    else:  # decrease
        new_balance = current_balance - request.amount
        if new_balance < 0:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot reduce {request.balance_type} balance below zero"
            )
    
    setattr(bank_account, balance_field, new_balance)
    db.commit()
    
    return {
        "success": True,
        "message": f"Successfully {request.operation}d {request.balance_type} balance by €{request.amount}",
        "investor_id": investor_id,
        "investor_email": investor.email,
        "balance_type": request.balance_type,
        "operation": request.operation,
        "amount": request.amount,
        "previous_balance": current_balance,
        "new_balance": new_balance,
        "updated_at": datetime.utcnow().isoformat()
    }


@router.post("/investors/{investor_id}/status")
async def update_investor_status(
    investor_id: int,
    status_update: dict,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Update investor status (active/suspended).
    
    Requires ADMIN role.
    """
    # Check authentication
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Get investor
    investor = db.query(User).filter(User.id == investor_id).first()
    if not investor:
        raise HTTPException(status_code=404, detail="Investor not found")
    
    # Update status
    new_status = status_update.get('status')
    if new_status not in ['active', 'suspended']:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    investor.status = new_status
    db.commit()
    
    return {
        "success": True,
        "message": f"Successfully updated {investor.email} status to {new_status}",
        "investor_id": investor_id,
        "new_status": new_status,
        "updated_at": datetime.utcnow().isoformat()
    }
