"""
Compliance API - MVP-2 Testnet

FastAPI endpoints for jurisdiction compliance and investor verification.

@reference SRS v2.0 Sections 1.2, 1.3, 10
@reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md Section 5.3

@notice MVP-2 TESTNET: This is a testnet deployment. No real funds.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum
import uuid

from config.MVP_config import mvp_config

# Router
router = APIRouter(prefix="/api/v2/compliance", tags=["Compliance"])
security = HTTPBearer(auto_error=False)


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
    kyc_provider: str = "MOCK_KYC_MVP2"


class KYBRequest(BaseModel):
    """Know Your Business request"""
    investor_id: str
    company_name: str
    jurisdiction: str
    registration_number: str
    beneficial_owners: List[Dict]


# =============================================================================
# MOCK DATA
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

# Mock investor compliance records
mock_investor_compliance: Dict[str, Dict] = {}

# Mock KYC records
mock_kyc_records: Dict[str, Dict] = {}


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
# INVESTOR COMPLIANCE ENDPOINTS
# =============================================================================

@router.post("/investors/register")
async def register_investor(request: InvestorRegistration) -> InvestorCompliance:
    """
    Register investor for compliance tracking.
    
    This creates a compliance record for the investor and performs
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
    
    # Determine status
    if requires_review:
        status = ComplianceStatusEnum.REVIEW_REQUIRED
        kyc_status = "PENDING_REVIEW"
    else:
        status = ComplianceStatusEnum.ALLOWED
        kyc_status = "APPROVED_MVP2"
    
    # Create compliance record
    compliance_record = {
        "investor_id": investor_id,
        "jurisdiction": jurisdiction_code,
        "jurisdiction_name": get_jurisdiction_name(jurisdiction_code),
        "status": status.value,
        "is_approved": not requires_review,
        "kyc_status": kyc_status,
        "accreditation_status": "PENDING_MVP2",
        "name": request.name,
        "entity_type": request.entity_type,
        "kyc_provider": request.kyc_provider,
        "created_at": datetime.utcnow().isoformat(),
        "approved_by": None,
        "approved_at": None
    }
    
    mock_investor_compliance[investor_id] = compliance_record
    
    # Create mock KYC record
    mock_kyc_records[investor_id] = {
        "investor_id": investor_id,
        "provider": request.kyc_provider,
        "status": "APPROVED_MVP2" if is_allowed else "PENDING_REVIEW",
        "verified_at": datetime.utcnow().isoformat(),
        "is_testnet": True
    }
    
    return InvestorCompliance(**compliance_record)


@router.get("/investors/{investor_id}/compliance")
async def get_investor_compliance(investor_id: str) -> InvestorCompliance:
    """
    Get investor compliance status.
    """
    if investor_id not in mock_investor_compliance:
        raise HTTPException(
            status_code=404,
            detail=f"Investor not found: {investor_id}"
        )
    
    record = mock_investor_compliance[investor_id]
    return InvestorCompliance(**record)


@router.post("/investors/{investor_id}/approve")
async def approve_investor(
    investor_id: str,
    approved_by: str = Query(..., description="Compliance officer ID")
) -> Dict:
    """
    Approve investor (compliance officer only).
    
    MVP-2: Simplified approval for testnet
    Production: Requires compliance officer authentication
    """
    if investor_id not in mock_investor_compliance:
        raise HTTPException(
            status_code=404,
            detail=f"Investor not found: {investor_id}"
        )
    
    record = mock_investor_compliance[investor_id]
    
    # Check if jurisdiction is blocked
    if record["jurisdiction"] in BLOCKED_JURISDICTIONS:
        raise HTTPException(
            status_code=400,
            detail="Cannot approve investor from blocked jurisdiction"
        )
    
    # Update record
    record["is_approved"] = True
    record["status"] = ComplianceStatusEnum.ALLOWED.value
    record["kyc_status"] = "APPROVED_MVP2"
    record["accreditation_status"] = "ACCREDITED_MVP2"
    record["approved_by"] = approved_by
    record["approved_at"] = datetime.utcnow().isoformat()
    
    return {
        "success": True,
        "investor_id": investor_id,
        "status": "APPROVED",
        "approved_by": approved_by,
        "approved_at": record["approved_at"],
        "is_testnet": True
    }


@router.post("/investors/{investor_id}/revoke")
async def revoke_investor_approval(
    investor_id: str,
    revoked_by: str = Query(..., description="Compliance officer ID")
) -> Dict:
    """
    Revoke investor approval (compliance officer only).
    """
    if investor_id not in mock_investor_compliance:
        raise HTTPException(
            status_code=404,
            detail=f"Investor not found: {investor_id}"
        )
    
    record = mock_investor_compliance[investor_id]
    
    # Update record
    record["is_approved"] = False
    record["status"] = ComplianceStatusEnum.REVIEW_REQUIRED.value
    record["kyc_status"] = "REVISED"
    record["revoked_by"] = revoked_by
    record["revoked_at"] = datetime.utcnow().isoformat()
    
    return {
        "success": True,
        "investor_id": investor_id,
        "status": "REVOKED",
        "revoked_by": revoked_by,
        "revoked_at": record["revoked_at"],
        "is_testnet": True
    }


# =============================================================================
# KYB ENDPOINTS (Enhanced Due Diligence)
# =============================================================================

@router.post("/kyb/check")
async def perform_kyb_check(request: KYBRequest) -> Dict:
    """
    Perform Know Your Business (KYB) check.
    
    Required for:
    - Institutional investors (≥€100,000)
    - Corporate entities
    - High-risk jurisdictions (review required)
    
    MVP-2: Mock KYB for testnet
    Production: Integration with Sumsub/Onfido
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
    
    # Mock KYB approval for testnet
    return {
        "success": True,
        "investor_id": investor_id,
        "company_name": request.company_name,
        "kyb_status": "APPROVED_MVP2",
        "risk_level": "LOW",
        "beneficial_owners_verified": len(request.beneficial_owners),
        "registration_verified": True,
        "verified_at": datetime.utcnow().isoformat(),
        "is_testnet": True,
        "notice": "Mock KYB check for testnet only"
    }


# =============================================================================
# COMPLIANCE STATS
# =============================================================================

@router.get("/stats")
async def get_compliance_stats() -> Dict:
    """
    Get compliance statistics.
    """
    approved_count = sum(
        1 for r in mock_investor_compliance.values()
        if r["is_approved"]
    )
    
    pending_count = sum(
        1 for r in mock_investor_compliance.values()
        if r["status"] == ComplianceStatusEnum.REVIEW_REQUIRED.value
    )
    
    return {
        "total_investors": len(mock_investor_compliance),
        "approved_investors": approved_count,
        "pending_review": pending_count,
        "blocked_jurisdictions_count": len(BLOCKED_JURISDICTIONS),
        "allowed_jurisdictions_count": len(ALLOWED_AFRICAN) + len(ALLOWED_INTERNATIONAL),
        "kyc_records": len(mock_kyc_records),
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
