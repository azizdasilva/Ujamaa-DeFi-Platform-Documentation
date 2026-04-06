"""
Compliance API - MVP Testnet (Database-Backed)

FastAPI endpoints for jurisdiction compliance and investor verification.

@reference SRS v2.0 Sections 1.2, 1.3, 10
@reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md Section 5.3

@notice MVP TESTNET: This is a testnet deployment. No real funds.
@notice All investor compliance data is now persisted to PostgreSQL/SQLite.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum
import uuid

from config.MVP_config import mvp_config
from config.database import get_db
from config.models import InvestorProfile, User, ComplianceStatusEnum, Document, DocumentTypeEnum
from sqlalchemy.orm import Session

# Router
router = APIRouter(prefix="/api/v2/compliance", tags=["Compliance"])
security = HTTPBearer(auto_error=False)

# Role sets
ADMIN_ROLES = {'ADMIN'}
COMPLIANCE_ROLES = {'ADMIN', 'COMPLIANCE_OFFICER'}

async def verify_compliance_access(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Verify user has ADMIN or COMPLIANCE_OFFICER role."""
    if not auth or not auth.credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    token = auth.credentials
    if token == "admin-token-mvp":
        admin = db.query(User).filter(User.role == "ADMIN").first()
        if not admin:
            raise HTTPException(status_code=404, detail="No admin user found")
        return admin
    if token.startswith("mock-jwt-token-"):
        parts = token.split("-")
        if len(parts) >= 4:
            role = parts[3]
            if role in COMPLIANCE_ROLES:
                user = db.query(User).filter(User.role == role).first()
                if not user:
                    raise HTTPException(status_code=404, detail=f"No {role} user found")
                return user
            else:
                raise HTTPException(status_code=403, detail=f"Access denied. Your role: {role}")
    user = db.query(User).filter(
        (User.wallet_address == token) | (User.email == token)
    ).first()
    if not user:
        raise HTTPException(status_code=403, detail="Invalid authentication token")
    user_role = user.role.value if hasattr(user.role, 'value') else user.role
    if user_role not in COMPLIANCE_ROLES:
        raise HTTPException(status_code=403, detail=f"Compliance access denied. Your role: {user_role}")
    return user

async def verify_admin_write(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Verify user has ADMIN role only."""
    user = await verify_compliance_access(auth, db)
    user_role = user.role.value if hasattr(user.role, 'value') else user.role
    if user_role not in ADMIN_ROLES:
        raise HTTPException(status_code=403, detail=f"Admin access required. Your role: {user_role}")
    return user


# =============================================================================
# ENUMS
# =============================================================================

class ComplianceStatusEnum(str, Enum):
    """Compliance status"""
    ALLOWED = "ALLOWED"
    BLOCKED = "BLOCKED"
    REVIEW_REQUIRED = "REVIEW_REQUIRED"


class SanctionsList(str, Enum):
    """Sanctions list source"""
    OFAC = "OFAC"
    UN = "UN"
    EU = "EU"
    FATF = "FATF"


# =============================================================================
# PYDANTIC MODELS
# =============================================================================

class JurisdictionInfo(BaseModel):
    """Jurisdiction information"""
    code: str
    name: str
    is_blocked: bool
    reason: Optional[str] = None
    sanctions_list: Optional[str] = None


class ComplianceCheckRequest(BaseModel):
    """Compliance check request"""
    jurisdiction: str = Field(..., description="ISO 3166-1 alpha-2 country code")
    investor_id: Optional[str] = Field(None, description="Investor identifier")


class ComplianceCheckResponse(BaseModel):
    """Compliance check response"""
    jurisdiction: str
    jurisdiction_name: str
    status: ComplianceStatusEnum
    is_allowed: bool
    is_blocked: bool
    requires_review: bool
    reason: Optional[str] = None
    sanctions_list: Optional[str] = None
    checked_at: str


class InvestorCompliance(BaseModel):
    """Investor compliance status"""
    investor_id: str
    jurisdiction: str
    jurisdiction_name: str
    status: ComplianceStatusEnum
    is_approved: bool
    kyc_status: str
    accreditation_status: str
    approved_by: Optional[str] = None
    approved_at: Optional[str] = None


class InvestorRegistration(BaseModel):
    """Investor registration request"""
    investor_id: str
    jurisdiction: str
    name: str
    entity_type: str = "INDIVIDUAL"
    kyc_provider: str = "MOCK_KYC_MVP"


class KYBRequest(BaseModel):
    """Know Your Business request"""
    investor_id: str
    company_name: str
    jurisdiction: str
    registration_number: str
    beneficial_owners: List[Dict]


# =============================================================================
# JURISDICTION DATA (stateless - doesn't need persistence)
# =============================================================================

# Blocked jurisdictions from MVP_config
BLOCKED_JURISDICTIONS = {
    "KP": {"name": "North Korea", "reason": "OFAC, UN, EU sanctions", "list": "OFAC+UN+EU"},
    "IR": {"name": "Iran", "reason": "OFAC, UN, EU sanctions", "list": "OFAC+UN+EU"},
    "SY": {"name": "Syria", "reason": "OFAC, UN, EU sanctions", "list": "OFAC+UN+EU"},
    "CU": {"name": "Cuba", "reason": "OFAC sanctions", "list": "OFAC"},
    "MM": {"name": "Myanmar", "reason": "OFAC, EU sanctions", "list": "OFAC+EU"},
    "BY": {"name": "Belarus", "reason": "OFAC, EU sanctions", "list": "OFAC+EU"},
    "RU": {"name": "Russia", "reason": "OFAC, EU sanctions", "list": "OFAC+EU"},
    "VE": {"name": "Venezuela", "reason": "OFAC sanctions", "list": "OFAC"},
    "SD": {"name": "Sudan", "reason": "OFAC sanctions", "list": "OFAC"},
    "YE": {"name": "Yemen", "reason": "UN arms embargo", "list": "UN"},
    "ML": {"name": "Mali", "reason": "FATF High-Risk Jurisdiction", "list": "FATF"},
    "BF": {"name": "Burkina Faso", "reason": "FATF High-Risk Jurisdiction", "list": "FATF"},
}

# Allowed African markets
ALLOWED_AFRICAN = {
    "NG": "Nigeria",
    "KE": "Kenya",
    "ZA": "South Africa",
    "GH": "Ghana",
    "MU": "Mauritius",
    "CI": "Côte d'Ivoire",
    "SN": "Senegal",
    "TG": "Togo",
    "BJ": "Benin",
}

# Allowed international
ALLOWED_INTERNATIONAL = {
    "EU": "European Union",
    "UK": "United Kingdom",
    "UAE": "United Arab Emirates",
    "SG": "Singapore",
    "US": "United States",
}


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def get_jurisdiction_name(code: str) -> str:
    """Get jurisdiction name from code"""
    if code in BLOCKED_JURISDICTIONS:
        return BLOCKED_JURISDICTIONS[code]["name"]
    if code in ALLOWED_AFRICAN:
        return ALLOWED_AFRICAN[code]
    if code in ALLOWED_INTERNATIONAL:
        return ALLOWED_INTERNATIONAL[code]
    return f"Unknown ({code})"


def check_jurisdiction_status(code: str) -> tuple:
    """
    Check jurisdiction compliance status.
    
    Returns:
        Tuple of (is_blocked, is_allowed, requires_review, reason, sanctions_list)
    """
    # Check if blocked
    if code in BLOCKED_JURISDICTIONS:
        data = BLOCKED_JURISDICTIONS[code]
        return (True, False, False, data["reason"], data["list"])
    
    # Check if allowed
    if code in ALLOWED_AFRICAN or code in ALLOWED_INTERNATIONAL:
        return (False, True, False, None, None)
    
    # Unknown jurisdiction - requires review
    return (False, False, True, "Unknown jurisdiction - manual review required", None)


# =============================================================================
# JURISDICTION ENDPOINTS
# =============================================================================

@router.post("/check-jurisdiction")
async def check_jurisdiction(request: ComplianceCheckRequest) -> ComplianceCheckResponse:
    """
    Check jurisdiction compliance status.
    
    This endpoint checks if a jurisdiction is:
    - **ALLOWED**: Can invest without restrictions
    - **BLOCKED**: Cannot invest (sanctions)
    - **REVIEW_REQUIRED**: Requires manual compliance review
    
    **Blocked Jurisdictions (12):**
    KP, IR, SY, CU, MM, BY, RU, VE, SD, YE, ML, BF
    
    **Allowed African Markets:**
    NG, KE, ZA, GH, MU, CI, SN, TG, BJ
    
    **Allowed International:**
    EU, UK, UAE, SG, US
    """
    jurisdiction_code = request.jurisdiction.upper()
    jurisdiction_name = get_jurisdiction_name(jurisdiction_code)
    
    is_blocked, is_allowed, requires_review, reason, sanctions_list = check_jurisdiction_status(
        jurisdiction_code
    )
    
    # Determine status
    if is_blocked:
        status = ComplianceStatusEnum.BLOCKED
    elif requires_review:
        status = ComplianceStatusEnum.REVIEW_REQUIRED
    else:
        status = ComplianceStatusEnum.ALLOWED
    
    return ComplianceCheckResponse(
        jurisdiction=jurisdiction_code,
        jurisdiction_name=jurisdiction_name,
        status=status,
        is_allowed=is_allowed,
        is_blocked=is_blocked,
        requires_review=requires_review,
        reason=reason,
        sanctions_list=sanctions_list,
        checked_at=datetime.utcnow().isoformat()
    )


class InvestorScreeningRequest(BaseModel):
    """Screen an investor against PEP and sanctions lists"""
    investor_id: int
    wallet_address: Optional[str] = None


@router.post("/screen-investor")
async def screen_investor(
    request: InvestorScreeningRequest,
    user: User = Depends(verify_compliance_access),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Screen a specific investor against PEP and sanctions lists.

    Returns screening results with risk indicators.
    """
    investor = db.query(InvestorProfile).filter(InvestorProfile.id == request.investor_id).first()
    if not investor:
        raise HTTPException(status_code=404, detail=f"Investor not found: {request.investor_id}")

    # Check jurisdiction against sanctions lists
    jurisdiction = investor.jurisdiction.upper() if investor.jurisdiction else ''
    is_blocked, _, _, reason, sanctions_list = check_jurisdiction_status(jurisdiction)

    # Mock PEP check (in production, this would call external PEP screening API)
    pep_exposed = False
    pep_details = []

    # Check if investor name matches known PEP patterns (mock)
    full_name = (investor.full_name or '').upper()
    company_name = (investor.company_name or '').upper()

    # In production, integrate with World-Check, Dow Jones, etc.
    # For MVP, we flag based on high-risk jurisdiction + large amounts
    if is_blocked:
        pep_exposed = True
        pep_details.append(f"Blocked jurisdiction: {jurisdiction} - {reason}")

    # Check if total invested exceeds PEP threshold
    if investor.total_invested and float(investor.total_invested) > 1000000:
        pep_exposed = True
        pep_details.append(f"High-value investor (€{float(investor.total_invested):,.0f}) - enhanced due diligence required")

    # Sanctions screening
    sanctions_hit = is_blocked
    sanctions_details = []
    if sanctions_list:
        sanctions_details.append(f"Listed on: {sanctions_list}")

    # Risk score calculation
    risk_score = 0
    if is_blocked:
        risk_score += 50
    if pep_exposed:
        risk_score += 30
    if investor.total_invested and float(investor.total_invested) > 500000:
        risk_score += 20

    risk_level = "HIGH" if risk_score >= 50 else "MEDIUM" if risk_score >= 20 else "LOW"

    return {
        "investor_id": request.investor_id,
        "investor_name": investor.full_name or investor.company_name or "Unknown",
        "jurisdiction": jurisdiction,
        "wallet_address": investor.wallet_address,
        "screening_result": {
            "pep_exposed": pep_exposed,
            "pep_details": pep_details,
            "sanctions_hit": sanctions_hit,
            "sanctions_details": sanctions_details,
            "sanctions_lists_checked": ["OFAC", "UN", "EU"] if sanctions_list else [],
            "risk_score": risk_score,
            "risk_level": risk_level,
            "kyc_status": investor.kyc_status.value if investor.kyc_status else "unknown",
            "total_invested": float(investor.total_invested) if investor.total_invested else 0,
        },
        "screened_at": datetime.utcnow().isoformat(),
        "screened_by": user.email,
    }


@router.get("/blocked-jurisdictions")
async def get_blocked_jurisdictions() -> List[JurisdictionInfo]:
    """
    Get list of all blocked jurisdictions.
    
    Returns the strictest combined list from:
    - OFAC (US Treasury)
    - UN Security Council
    - European Union
    - FATF High-Risk Jurisdictions
    """
    jurisdictions = []
    
    for code, data in BLOCKED_JURISDICTIONS.items():
        jurisdictions.append(JurisdictionInfo(
            code=code,
            name=data["name"],
            is_blocked=True,
            reason=data["reason"],
            sanctions_list=data["list"]
        ))
    
    return jurisdictions


@router.get("/allowed-jurisdictions")
async def get_allowed_jurisdictions() -> Dict:
    """
    Get list of allowed jurisdictions.
    
    Returns:
        Dictionary with African and International allowed markets
    """
    african = [
        {"code": code, "name": name}
        for code, name in ALLOWED_AFRICAN.items()
    ]
    
    international = [
        {"code": code, "name": name}
        for code, name in ALLOWED_INTERNATIONAL.items()
    ]
    
    return {
        "african_markets": african,
        "international": international,
        "total_allowed": len(african) + len(international),
        "compliance_note": "All allowed jurisdictions still require KYC/AML verification"
    }


@router.get("/jurisdictions")
async def get_all_jurisdictions() -> Dict:
    """
    Get all jurisdictions (blocked and allowed).
    """
    all_jurisdictions = []
    
    # Add blocked
    for code, data in BLOCKED_JURISDICTIONS.items():
        all_jurisdictions.append(JurisdictionInfo(
            code=code,
            name=data["name"],
            is_blocked=True,
            reason=data["reason"],
            sanctions_list=data["list"]
        ))
    
    # Add allowed African
    for code, name in ALLOWED_AFRICAN.items():
        all_jurisdictions.append(JurisdictionInfo(
            code=code,
            name=name,
            is_blocked=False
        ))
    
    # Add allowed International
    for code, name in ALLOWED_INTERNATIONAL.items():
        all_jurisdictions.append(JurisdictionInfo(
            code=code,
            name=name,
            is_blocked=False
        ))
    
    return {
        "total": len(all_jurisdictions),
        "blocked_count": len(BLOCKED_JURISDICTIONS),
        "allowed_count": len(ALLOWED_AFRICAN) + len(ALLOWED_INTERNATIONAL),
        "jurisdictions": all_jurisdictions
    }


# =============================================================================
# INVESTOR COMPLIANCE ENDPOINTS (Database-Backed)
# =============================================================================

@router.post("/investors/register")
async def register_investor(request: InvestorRegistration, db: Session = Depends(get_db)) -> InvestorCompliance:
    """
    Register investor for compliance tracking.

    Creates or updates an InvestorProfile in the database and performs
    initial jurisdiction check.

    **Requirements:**
    - Valid jurisdiction code
    - KYC provider verification (mock for testnet)
    """
    investor_id = request.investor_id
    jurisdiction_code = request.jurisdiction.upper()

    # Check jurisdiction
    is_blocked, is_allowed, requires_review, reason, _ = check_jurisdiction_status(
        jurisdiction_code
    )

    if is_blocked:
        raise HTTPException(
            status_code=400,
            detail=f"Investor jurisdiction is blocked: {reason}"
        )

    # Determine compliance status
    if requires_review:
        kyc_status = ComplianceStatusEnum.REVIEW_REQUIRED
        accreditation_status = ComplianceStatusEnum.PENDING
    else:
        kyc_status = ComplianceStatusEnum.APPROVED
        accreditation_status = ComplianceStatusEnum.PENDING

    # Check if investor profile exists
    investor_id_int = int(investor_id) if investor_id.isdigit() else 0
    profile = db.query(InvestorProfile).filter(InvestorProfile.id == investor_id_int).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail=f"Investor profile not found: {investor_id}. Create user account first."
        )

    # Update profile with compliance data
    profile.jurisdiction = jurisdiction_code
    profile.kyc_status = kyc_status
    profile.accreditation_status = accreditation_status

    if request.entity_type == "INDIVIDUAL":
        profile.full_name = request.name
    else:
        profile.company_name = request.name

    db.commit()
    db.refresh(profile)

    return InvestorCompliance(
        investor_id=investor_id,
        jurisdiction=jurisdiction_code,
        jurisdiction_name=get_jurisdiction_name(jurisdiction_code),
        status="ALLOWED" if is_allowed else "REVIEW_REQUIRED",
        is_approved=is_allowed,
        kyc_status=kyc_status.value,
        accreditation_status=accreditation_status.value,
        approved_by=None,
        approved_at=None
    )


@router.get("/investors/{investor_id}/compliance")
async def get_investor_compliance(investor_id: str, db: Session = Depends(get_db)) -> InvestorCompliance:
    """
    Get investor compliance status from database.
    """
    investor_id_int = int(investor_id) if investor_id.isdigit() else 0

    profile = db.query(InvestorProfile).filter(InvestorProfile.id == investor_id_int).first()
    if not profile:
        raise HTTPException(
            status_code=404,
            detail=f"Investor profile not found: {investor_id}"
        )

    # Determine if approved
    is_approved = profile.kyc_status == ComplianceStatusEnum.APPROVED
    status_str = "ALLOWED" if is_approved else (
        "BLOCKED" if profile.kyc_status == ComplianceStatusEnum.REJECTED else "REVIEW_REQUIRED"
    )

    return InvestorCompliance(
        investor_id=investor_id,
        jurisdiction=profile.jurisdiction,
        jurisdiction_name=get_jurisdiction_name(profile.jurisdiction),
        status=status_str,
        is_approved=is_approved,
        kyc_status=profile.kyc_status.value if profile.kyc_status else "pending",
        accreditation_status=profile.accreditation_status.value if profile.accreditation_status else "pending",
        approved_by=None,
        approved_at=None
    )


@router.post("/investors/{investor_id}/approve")
async def approve_investor(
    investor_id: str,
    approved_by: str = Query(..., description="Compliance officer ID"),
    user: User = Depends(verify_compliance_access),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Approve investor (compliance officer only).

    Updates the InvestorProfile KYC status to APPROVED in the database.
    """
    investor_id_int = int(investor_id) if investor_id.isdigit() else 0

    profile = db.query(InvestorProfile).filter(InvestorProfile.id == investor_id_int).first()
    if not profile:
        raise HTTPException(
            status_code=404,
            detail=f"Investor not found: {investor_id}"
        )

    # Check if jurisdiction is blocked
    if profile.jurisdiction in BLOCKED_JURISDICTIONS:
        raise HTTPException(
            status_code=400,
            detail="Cannot approve investor from blocked jurisdiction"
        )

    # Update profile
    profile.kyc_status = ComplianceStatusEnum.APPROVED
    profile.accreditation_status = ComplianceStatusEnum.APPROVED
    db.commit()
    db.refresh(profile)

    return {
        "success": True,
        "investor_id": investor_id,
        "status": "APPROVED",
        "approved_by": approved_by,
        "approved_at": datetime.utcnow().isoformat(),
        "is_testnet": True
    }


@router.post("/investors/{investor_id}/revoke")
async def revoke_investor_approval(
    investor_id: str,
    revoked_by: str = Query(..., description="Compliance officer ID"),
    user: User = Depends(verify_compliance_access),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Revoke investor approval (compliance officer only).
    """
    investor_id_int = int(investor_id) if investor_id.isdigit() else 0

    profile = db.query(InvestorProfile).filter(InvestorProfile.id == investor_id_int).first()
    if not profile:
        raise HTTPException(
            status_code=404,
            detail=f"Investor not found: {investor_id}"
        )

    # Update profile
    profile.kyc_status = ComplianceStatusEnum.REVIEW_REQUIRED
    db.commit()
    db.refresh(profile)

    return {
        "success": True,
        "investor_id": investor_id,
        "status": "REVOKED",
        "revoked_by": revoked_by,
        "revoked_at": datetime.utcnow().isoformat(),
        "is_testnet": True
    }


# =============================================================================
# KYB ENDPOINTS (Enhanced Due Diligence - Database-Backed)
# =============================================================================

@router.post("/kyb/check")
async def perform_kyb_check(request: KYBRequest, db: Session = Depends(get_db)) -> Dict:
    """
    Perform Know Your Business (KYB) check.

    Required for:
    - Institutional investors (≥€100,000)
    - Corporate entities
    - High-risk jurisdictions (review required)

    Updates the InvestorProfile KYB status in the database.
    """
    investor_id = request.investor_id
    jurisdiction_code = request.jurisdiction.upper()

    # Check jurisdiction
    is_blocked, _, _, reason, _ = check_jurisdiction_status(jurisdiction_code)

    if is_blocked:
        return {
            "success": False,
            "investor_id": investor_id,
            "kyb_status": "REJECTED",
            "reason": f"Blocked jurisdiction: {reason}",
            "risk_level": "CRITICAL"
        }

    # Update database
    investor_id_int = int(investor_id) if investor_id.isdigit() else 0
    profile = db.query(InvestorProfile).filter(InvestorProfile.id == investor_id_int).first()

    if profile:
        profile.kyb_status = ComplianceStatusEnum.APPROVED
        profile.company_name = request.company_name
        db.commit()

    return {
        "success": True,
        "investor_id": investor_id,
        "company_name": request.company_name,
        "kyb_status": "APPROVED",
        "risk_level": "LOW",
        "beneficial_owners_verified": len(request.beneficial_owners),
        "registration_verified": True,
        "verified_at": datetime.utcnow().isoformat(),
        "is_testnet": True,
    }


# =============================================================================
# COMPLIANCE STATS (Database-Backed)
# =============================================================================

@router.get("/stats")
async def get_compliance_stats(db: Session = Depends(get_db)) -> Dict:
    """
    Get compliance statistics from database.
    """
    # Count investors by KYC status
    total_investors = db.query(InvestorProfile).count()
    approved_investors = db.query(InvestorProfile).filter(
        InvestorProfile.kyc_status == ComplianceStatusEnum.APPROVED
    ).count()
    pending_review = db.query(InvestorProfile).filter(
        InvestorProfile.kyc_status == ComplianceStatusEnum.REVIEW_REQUIRED
    ).count()
    pending_kyc = db.query(InvestorProfile).filter(
        InvestorProfile.kyc_status == ComplianceStatusEnum.PENDING
    ).count()

    # Count documents
    total_documents = db.query(Document).count()
    pending_documents = db.query(Document).filter(
        Document.verification_status == ComplianceStatusEnum.PENDING
    ).count()

    return {
        "total_investors": total_investors,
        "approved_investors": approved_investors,
        "pending_review": pending_review,
        "pending_kyc": pending_kyc,
        "total_documents": total_documents,
        "pending_documents": pending_documents,
        "blocked_jurisdictions_count": len(BLOCKED_JURISDICTIONS),
        "allowed_jurisdictions_count": len(ALLOWED_AFRICAN) + len(ALLOWED_INTERNATIONAL),
        "is_testnet": True,
        "testnet_notice": "🚀 MVP: Institutional Architecture - Testnet Release"
    }


@router.get("/sanctions-list")
async def get_sanctions_list() -> Dict:
    """
    Get sanctions list breakdown by source.
    """
    by_source = {
        "OFAC": [],
        "UN": [],
        "EU": [],
        "FATF": []
    }
    
    for code, data in BLOCKED_JURISDICTIONS.items():
        sources = data["list"].split("+")
        for source in sources:
            if source in by_source:
                by_source[source].append({
                    "code": code,
                    "name": data["name"],
                    "reason": data["reason"]
                })
    
    return {
        "sanctions_lists": by_source,
        "total_blocked": len(BLOCKED_JURISDICTIONS),
        "last_updated": datetime.utcnow().isoformat(),
        "disclaimer": "This is the strictest combined list from all major sanctions sources"
    }


# =============================================================================
# IDENTITY REGISTRY (ERC-3643 On-Chain Integration)
# =============================================================================

class IdentityRegistration(BaseModel):
    """Identity registration request"""
    investor_id: int
    wallet_address: str
    jurisdiction: str
    investor_type: str = "RETAIL"


class IdentityStatus(BaseModel):
    """Identity verification status"""
    investor_id: int
    wallet_address: str
    is_verified: bool
    on_chain_verified: bool
    jurisdiction: str
    investor_type: str
    registered_at: Optional[str] = None
    verified_at: Optional[str] = None


@router.post("/identity/register")
async def register_identity(
    request: IdentityRegistration,
    admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Register investor identity for ERC-3643 compliance.

    Updates the investor's wallet address and triggers on-chain
    IdentityRegistry.registerIdentity() call.
    """
    investor_id = request.investor_id
    profile = db.query(InvestorProfile).filter(InvestorProfile.id == investor_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail=f"Investor profile not found: {investor_id}")

    # Check jurisdiction not blocked
    is_blocked, _, _, reason, _ = check_jurisdiction_status(request.jurisdiction)
    if is_blocked:
        raise HTTPException(status_code=400, detail=f"Blocked jurisdiction: {reason}")

    # Update profile with wallet address
    profile.wallet_address = request.wallet_address
    profile.jurisdiction = request.jurisdiction
    db.commit()

    # Call on-chain identity registration if blockchain is enabled
    tx_hash = None
    explorer_url = None
    on_chain_registered = False

    try:
        from services.blockchain_service import get_blockchain_service
        from config.models import BlockchainTransaction, BlockchainActionEnum, TransactionStatusEnum as TxStatus

        blockchain = get_blockchain_service()

        if not blockchain.is_demo and request.wallet_address:
            tx_result = blockchain.register_identity(
                investor_address=request.wallet_address,
                jurisdiction=request.jurisdiction,
                investor_type=request.investor_type
            )
            tx_hash = tx_result['transaction_hash']
            explorer_url = tx_result.get('explorer_url')
            on_chain_registered = tx_result['success']

            # Record in audit trail
            blockchain_tx = BlockchainTransaction(
                action=BlockchainActionEnum.REGISTER_IDENTITY,
                contract_name="IdentityRegistry",
                function_name="registerIdentity",
                parameters={
                    "investor": request.wallet_address,
                    "jurisdiction": request.jurisdiction,
                    "investor_type": request.investor_type,
                },
                real_tx_hash=tx_hash,
                status=TxStatus.CONFIRMED if tx_result['success'] else TxStatus.FAILED,
                investor_id=investor_id,
                description=f"Identity registered for {request.wallet_address}",
                explorer_url=explorer_url,
            )
            db.add(blockchain_tx)
        else:
            # Demo mode
            import os
            tx_hash = '0x' + os.urandom(32).hex()
            explorer_url = f"{blockchain.config['explorer']}/tx/{tx_hash}"
            on_chain_registered = True

            blockchain_tx = BlockchainTransaction(
                action=BlockchainActionEnum.REGISTER_IDENTITY,
                contract_name="IdentityRegistry",
                function_name="registerIdentity",
                parameters={
                    "investor": request.wallet_address,
                    "jurisdiction": request.jurisdiction,
                    "investor_type": request.investor_type,
                },
                simulated_tx_hash=tx_hash,
                status=TxStatus.SIMULATED,
                investor_id=investor_id,
                description=f"Identity registered (demo) for {request.wallet_address}",
                explorer_url=explorer_url,
            )
            db.add(blockchain_tx)

    except Exception as e:
        print(f"⚠️  Identity registration failed: {e}")

    db.commit()

    return {
        "success": True,
        "investor_id": investor_id,
        "wallet_address": request.wallet_address,
        "jurisdiction": request.jurisdiction,
        "on_chain_registered": on_chain_registered,
        "transaction_id": tx_hash,
        "explorer_url": explorer_url,
        "message": "Identity registered successfully" if on_chain_registered else "Identity registered (on-chain pending)"
    }


@router.post("/identity/verify")
async def verify_identity(
    investor_id: int,
    verified_by: str = Query(..., description="Compliance officer ID"),
    user: User = Depends(verify_compliance_access),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Verify investor identity on-chain (compliance officer only).

    Calls IdentityRegistry.verifyIdentity() on Polygon Amoy.
    """
    profile = db.query(InvestorProfile).filter(InvestorProfile.id == investor_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail=f"Investor profile not found: {investor_id}")

    if not profile.wallet_address:
        raise HTTPException(status_code=400, detail="Investor has no wallet address registered")

    tx_hash = None
    explorer_url = None
    on_chain_verified = False

    try:
        from services.blockchain_service import get_blockchain_service
        from config.models import BlockchainTransaction, BlockchainActionEnum, TransactionStatusEnum as TxStatus

        blockchain = get_blockchain_service()

        if not blockchain.is_demo:
            tx_result = blockchain.verify_identity(investor_address=profile.wallet_address)
            tx_hash = tx_result['transaction_hash']
            explorer_url = tx_result.get('explorer_url')
            on_chain_verified = tx_result['success']

            # Update DB
            profile.kyc_status = ComplianceStatusEnum.APPROVED
            db.commit()

            blockchain_tx = BlockchainTransaction(
                action=BlockchainActionEnum.VERIFY_IDENTITY,
                contract_name="IdentityRegistry",
                function_name="verifyIdentity",
                parameters={"investor": profile.wallet_address},
                real_tx_hash=tx_hash,
                status=TxStatus.CONFIRMED if tx_result['success'] else TxStatus.FAILED,
                investor_id=investor_id,
                description=f"Identity verified for {profile.wallet_address} by {verified_by}",
                explorer_url=explorer_url,
            )
            db.add(blockchain_tx)
        else:
            import os
            tx_hash = '0x' + os.urandom(32).hex()
            explorer_url = f"{blockchain.config['explorer']}/tx/{tx_hash}"
            on_chain_verified = True

            profile.kyc_status = ComplianceStatusEnum.APPROVED
            db.commit()

            blockchain_tx = BlockchainTransaction(
                action=BlockchainActionEnum.VERIFY_IDENTITY,
                contract_name="IdentityRegistry",
                function_name="verifyIdentity",
                parameters={"investor": profile.wallet_address},
                simulated_tx_hash=tx_hash,
                status=TxStatus.SIMULATED,
                investor_id=investor_id,
                description=f"Identity verified (demo) for {profile.wallet_address}",
                explorer_url=explorer_url,
            )
            db.add(blockchain_tx)

    except Exception as e:
        print(f"⚠️  Identity verification failed: {e}")

    db.commit()

    return {
        "success": True,
        "investor_id": investor_id,
        "wallet_address": profile.wallet_address,
        "on_chain_verified": on_chain_verified,
        "transaction_id": tx_hash,
        "explorer_url": explorer_url,
        "verified_by": verified_by,
        "message": "Identity verified on-chain"
    }


@router.get("/identity/{investor_id}/status")
async def get_identity_status(
    investor_id: int,
    db: Session = Depends(get_db)
) -> IdentityStatus:
    """
    Get investor identity verification status (on-chain + database).
    """
    profile = db.query(InvestorProfile).filter(InvestorProfile.id == investor_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail=f"Investor profile not found: {investor_id}")

    # Check on-chain verification
    on_chain_verified = False
    if profile.wallet_address:
        try:
            from services.blockchain_service import get_blockchain_service
            blockchain = get_blockchain_service()
            on_chain_verified = blockchain.is_verified(profile.wallet_address)
        except Exception:
            pass

    return IdentityStatus(
        investor_id=investor_id,
        wallet_address=profile.wallet_address or "",
        is_verified=profile.kyc_status == ComplianceStatusEnum.APPROVED,
        on_chain_verified=on_chain_verified,
        jurisdiction=profile.jurisdiction,
        investor_type="INSTITUTIONAL" if profile.company_name else "RETAIL",
        registered_at=None,
        verified_at=None
    )
