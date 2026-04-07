"""
Compliance API - KYC/KYB Document Review with Configurable Business Days Deadline

Endpoints for compliance officers to review and approve/reject documents.
Implements configurable business day review window with grace period.

@notice All document data is persisted to PostgreSQL/SQLite.
@notice Deadlines calculated using business days (Mon-Fri) excluding holidays.
"""

from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import uuid
import logging

from config.database import get_db
from config.models import (
    Document, ComplianceActivity, InvestorProfile, User, ComplianceSettings,
    ComplianceStatusEnum, DocumentTypeEnum, InvestorRoleEnum
)
from sqlalchemy.orm import Session
from utils.business_days import calculate_kyc_deadline

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v2/compliance", tags=["Compliance"])

# Auth security
security = HTTPBearer(auto_error=False)
ADMIN_ROLES = {'ADMIN'}
COMPLIANCE_ROLES = {'ADMIN', 'COMPLIANCE_OFFICER'}

def _resolve_compliance_user(auth: Optional[HTTPAuthorizationCredentials], db: Session) -> User:
    """Resolve auth token for compliance endpoints."""
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
            all_roles = {r.value for r in InvestorRoleEnum}
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

async def verify_compliance_access(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Verify user has ADMIN or COMPLIANCE_OFFICER role."""
    return _resolve_compliance_user(auth, db)

async def verify_admin_write(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Verify user has ADMIN role only."""
    user = _resolve_compliance_user(auth, db)
    user_role = user.role.value if hasattr(user.role, 'value') else user.role
    if user_role not in ADMIN_ROLES:
        raise HTTPException(status_code=403, detail=f"Admin access required. Your role: {user_role}")
    return user

# =============================================================================
# PYDANTIC MODELS
# =============================================================================

class DocumentResponse(BaseModel):
    id: int
    investor_id: int
    investor_name: str
    document_type: str
    document_name: str
    file_path: str
    file_hash: Optional[str] = None
    upload_status: str
    verification_status: str
    submitted_at: str
    deadline_at: Optional[str] = None
    reviewed_by: Optional[int] = None
    reviewed_at: Optional[str] = None
    review_notes: Optional[str] = None
    time_remaining_hours: Optional[float] = None


class ReviewRequest(BaseModel):
    action: str = Field(..., description="approve or reject")
    notes: Optional[str] = Field(None, description="Review notes")
    reviewer_id: Optional[int] = Field(None, description="Reviewer user ID")


class ComplianceActivityResponse(BaseModel):
    id: int
    user_id: int
    activity_type: str
    target_id: int
    target_type: str
    details: Optional[Dict[str, Any]] = None
    created_at: str


class ComplianceStats(BaseModel):
    pending_count: int
    approved_today: int
    rejected_today: int
    overdue_count: int
    avg_review_time_hours: float


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def calculate_time_remaining(deadline_at: datetime) -> float:
    """Calculate hours remaining until deadline"""
    now = datetime.utcnow()
    remaining = deadline_at - now
    return max(0, remaining.total_seconds() / 3600)


def check_overdue_documents(db: Session):
    """Check and flag overdue documents"""
    now = datetime.utcnow()
    overdue_docs = db.query(Document).filter(
        Document.verification_status == ComplianceStatusEnum.PENDING,
        Document.deadline_at < now
    ).all()

    for doc in overdue_docs:
        if not doc.review_notes or "OVERDUE" not in (doc.review_notes or ""):
            doc.review_notes = (doc.review_notes or "") + " ⚠️ OVERDUE - Not reviewed within 24h window"

    db.commit()
    return len(overdue_docs)


# =============================================================================
# API ENDPOINTS
# =============================================================================

@router.get("/documents", response_model=List[DocumentResponse])
async def get_all_documents(
    status_filter: Optional[str] = None,
    investor_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get all documents for review.

    - **status_filter**: Filter by verification status (pending, approved, rejected)
    - **investor_id**: Filter by investor ID

    @notice: Returns documents with 24h deadline information
    """
    check_overdue_documents(db)

    query = db.query(Document)

    if status_filter:
        query = query.filter(Document.verification_status == ComplianceStatusEnum(status_filter))

    if investor_id:
        query = query.filter(Document.investor_id == investor_id)

    documents = query.order_by(Document.submitted_at.asc()).all()

    result = []
    for doc in documents:
        investor = db.query(InvestorProfile).filter(InvestorProfile.id == doc.investor_id).first()
        time_remaining = None
        if doc.deadline_at and doc.verification_status == ComplianceStatusEnum.PENDING:
            time_remaining = calculate_time_remaining(doc.deadline_at)

        result.append(DocumentResponse(
            id=doc.id,
            investor_id=doc.investor_id,
            investor_name=investor.full_name or investor.company_name or f"Investor #{doc.investor_id}" if investor else f"Investor #{doc.investor_id}",
            document_type=doc.document_type.value if doc.document_type else "unknown",
            document_name=doc.document_name,
            file_path=doc.file_path,
            file_hash=doc.file_hash,
            upload_status=doc.upload_status,
            verification_status=doc.verification_status.value if doc.verification_status else "pending",
            submitted_at=doc.submitted_at.isoformat() if doc.submitted_at else "",
            deadline_at=doc.deadline_at.isoformat() if doc.deadline_at else None,
            reviewed_by=doc.reviewed_by,
            reviewed_at=doc.reviewed_at.isoformat() if doc.reviewed_at else None,
            review_notes=doc.review_notes,
            time_remaining_hours=time_remaining
        ))

    return result


@router.get("/documents/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: int, db: Session = Depends(get_db)):
    """
    Get a specific document by ID.

    Returns document details including file path for viewing.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    investor = db.query(InvestorProfile).filter(InvestorProfile.id == doc.investor_id).first()
    time_remaining = None
    if doc.deadline_at and doc.verification_status == ComplianceStatusEnum.PENDING:
        time_remaining = calculate_time_remaining(doc.deadline_at)

    return DocumentResponse(
        id=doc.id,
        investor_id=doc.investor_id,
        investor_name=investor.full_name or investor.company_name or f"Investor #{doc.investor_id}" if investor else f"Investor #{doc.investor_id}",
        document_type=doc.document_type.value if doc.document_type else "unknown",
        document_name=doc.document_name,
        file_path=doc.file_path,
        file_hash=doc.file_hash,
        upload_status=doc.upload_status,
        verification_status=doc.verification_status.value if doc.verification_status else "pending",
        submitted_at=doc.submitted_at.isoformat() if doc.submitted_at else "",
        deadline_at=doc.deadline_at.isoformat() if doc.deadline_at else None,
        reviewed_by=doc.reviewed_by,
        reviewed_at=doc.reviewed_at.isoformat() if doc.reviewed_at else None,
        review_notes=doc.review_notes,
        time_remaining_hours=time_remaining
    )


@router.post("/documents/{document_id}/review")
async def review_document(
    document_id: int,
    review: ReviewRequest,
    user: User = Depends(verify_compliance_access),
    db: Session = Depends(get_db)
):
    """
    Review and approve/reject a document.

    - **action**: "approve" or "reject"
    - **notes**: Optional review notes

    @notice: Must be done within 24h of submission
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Check if already reviewed
    if doc.verification_status != ComplianceStatusEnum.PENDING:
        raise HTTPException(
            status_code=400,
            detail=f"Document already {doc.verification_status.value}"
        )

    # Check if overdue
    time_remaining = 0.0
    if doc.deadline_at:
        time_remaining = calculate_time_remaining(doc.deadline_at)
        if time_remaining <= 0:
            doc.review_notes = (doc.review_notes or "") + " ⚠️ Reviewed after 24h deadline"

    # Update document
    now = datetime.utcnow()
    new_status = ComplianceStatusEnum.APPROVED if review.action == "approve" else ComplianceStatusEnum.REJECTED
    doc.verification_status = new_status
    doc.reviewed_by = review.reviewer_id or 1  # Default to user 1 if not provided
    doc.reviewed_at = now
    doc.review_notes = (doc.review_notes or "") + (review.notes or "")

    # Log compliance activity
    activity = ComplianceActivity(
        user_id=review.reviewer_id or 1,
        activity_type=f"DOCUMENT_{review.action.upper()}",
        target_id=document_id,
        target_type="DOCUMENT",
        details={
            "investor_id": doc.investor_id,
            "document_type": doc.document_type.value if doc.document_type else "unknown",
            "notes": review.notes,
            "time_remaining_hours": time_remaining,
        },
        created_at=now,
    )
    db.add(activity)
    db.commit()

    return {
        "success": True,
        "message": f"Document {review.action}d successfully",
        "document_id": document_id,
        "status": new_status.value,
        "time_remaining_hours": time_remaining,
    }


@router.get("/documents/{document_id}/view")
async def view_document(document_id: int, db: Session = Depends(get_db)):
    """
    View document metadata.

    In production, this would stream the actual file or return a signed URL.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    investor = db.query(InvestorProfile).filter(InvestorProfile.id == doc.investor_id).first()

    # Mock document viewer URL
    viewer_url = f"https://ujamaa-defi.com/document-viewer/{document_id}?token=mock_jwt_token"

    return {
        "document": {
            "id": doc.id,
            "investor_id": doc.investor_id,
            "investor_name": investor.full_name or investor.company_name if investor else "Unknown",
            "document_type": doc.document_type.value if doc.document_type else "unknown",
            "document_name": doc.document_name,
            "verification_status": doc.verification_status.value if doc.verification_status else "pending",
            "submitted_at": doc.submitted_at.isoformat() if doc.submitted_at else None,
        },
        "viewer_url": viewer_url,
        "download_url": f"/api/v2/compliance/documents/{document_id}/download",
        "file_metadata": {
            "type": "PDF",
            "size": "2.4 MB",
            "pages": 3,
            "hash": doc.file_hash,
        }
    }


@router.get("/stats", response_model=ComplianceStats)
async def get_compliance_stats(db: Session = Depends(get_db)):
    """
    Get compliance statistics.

    Returns counts of pending, approved, rejected, and overdue documents.
    """
    check_overdue_documents(db)

    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    pending_count = db.query(Document).filter(
        Document.verification_status == ComplianceStatusEnum.PENDING
    ).count()

    overdue_count = db.query(Document).filter(
        Document.verification_status == ComplianceStatusEnum.PENDING,
        Document.deadline_at < now
    ).count()

    approved_today = db.query(Document).filter(
        Document.verification_status == ComplianceStatusEnum.APPROVED,
        Document.reviewed_at >= today_start
    ).count()

    rejected_today = db.query(Document).filter(
        Document.verification_status == ComplianceStatusEnum.REJECTED,
        Document.reviewed_at >= today_start
    ).count()

    # Calculate average review time for reviewed documents
    reviewed_docs = db.query(Document).filter(
        Document.verification_status.in_([ComplianceStatusEnum.APPROVED, ComplianceStatusEnum.REJECTED]),
        Document.reviewed_at.isnot(None),
        Document.submitted_at.isnot(None)
    ).all()

    review_times = []
    for doc in reviewed_docs:
        if isinstance(doc.reviewed_at, datetime) and isinstance(doc.submitted_at, datetime):
            review_time = (doc.reviewed_at - doc.submitted_at).total_seconds() / 3600
            review_times.append(review_time)

    avg_review_time = sum(review_times) / len(review_times) if review_times else 0

    return {
        "pending_count": pending_count,
        "approved_today": approved_today,
        "rejected_today": rejected_today,
        "overdue_count": overdue_count,
        "avg_review_time_hours": round(avg_review_time, 2),
    }


@router.get("/activities", response_model=List[ComplianceActivityResponse])
async def get_compliance_activities(limit: int = 50, db: Session = Depends(get_db)):
    """
    Get compliance activity log.

    Returns audit trail of all compliance actions.
    """
    activities = db.query(ComplianceActivity).order_by(
        ComplianceActivity.created_at.desc()
    ).limit(limit).all()

    return [
        ComplianceActivityResponse(
            id=a.id,
            user_id=a.user_id,
            activity_type=a.activity_type,
            target_id=a.target_id,
            target_type=a.target_type,
            details=a.details,
            created_at=a.created_at.isoformat() if a.created_at else ""
        )
        for a in activities
    ]


@router.post("/documents/batch-review")
async def batch_review_documents(
    documents: List[Dict[str, str]],
    user: User = Depends(verify_compliance_access),
    db: Session = Depends(get_db)
):
    """
    Review multiple documents at once.

    Useful for bulk approvals.
    """
    results = []

    for doc_review in documents:
        doc_id = doc_review.get("document_id")
        action = doc_review.get("action")
        notes = doc_review.get("notes", "")

        if not doc_id or not action:
            results.append({
                "document_id": doc_id,
                "success": False,
                "error": "Missing document_id or action"
            })
            continue

        try:
            doc_id_int = int(doc_id)
            review = ReviewRequest(action=action, notes=notes)
            doc = db.query(Document).filter(Document.id == doc_id_int).first()
            if not doc:
                results.append({
                    "document_id": doc_id,
                    "success": False,
                    "error": "Document not found"
                })
                continue

            if doc.verification_status != ComplianceStatusEnum.PENDING:
                results.append({
                    "document_id": doc_id,
                    "success": False,
                    "error": f"Document already {doc.verification_status.value}"
                })
                continue

            now = datetime.utcnow()
            new_status = ComplianceStatusEnum.APPROVED if action == "approve" else ComplianceStatusEnum.REJECTED
            doc.verification_status = new_status
            doc.reviewed_by = 1
            doc.reviewed_at = now
            doc.review_notes = (doc.review_notes or "") + notes

            db.commit()

            results.append({
                "document_id": doc_id,
                "success": True,
                "status": new_status.value
            })
        except Exception as e:
            results.append({
                "document_id": doc_id,
                "success": False,
                "error": str(e)
            })

    return {
        "total": len(results),
        "successful": sum(1 for r in results if r["success"]),
        "failed": sum(1 for r in results if not r["success"]),
        "results": results
    }


# =============================================================================
# DEMO ENDPOINTS (For MVP Testing)
# =============================================================================

@router.post("/demo/upload-document")
async def demo_upload_document(
    investor_id: int,
    document_type: str,
    document_name: str,
    admin: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
):
    """
    Demo endpoint to upload a document (for testing).

    Creates a document record with 24h deadline in the database.
    """
    # Verify investor exists
    investor = db.query(InvestorProfile).filter(InvestorProfile.id == investor_id).first()
    if not investor:
        raise HTTPException(status_code=404, detail=f"Investor {investor_id} not found")

    # Map document type string to enum
    doc_type_map = {
        "kyc_id": DocumentTypeEnum.KYC_ID,
        "kyc_address": DocumentTypeEnum.KYC_ADDRESS,
        "kyb_incorporation": DocumentTypeEnum.KYB_INCORPORATION,
        "kyb_tax": DocumentTypeEnum.KYB_TAX,
        "kyb_ubo": DocumentTypeEnum.KYB_UBO,
    }
    doc_type = doc_type_map.get(document_type, DocumentTypeEnum.OTHER)

    now = datetime.utcnow()
    doc = Document(
        investor_id=investor_id,
        document_type=doc_type,
        document_name=document_name,
        file_path=f"/uploads/{document_type}/{uuid.uuid4().hex[:8]}.pdf",
        file_hash="0x" + uuid.uuid4().hex,
        upload_status="uploaded",
        verification_status=ComplianceStatusEnum.PENDING,
        submitted_at=now,
        deadline_at=now + timedelta(hours=24),
        reviewed_by=None,
        reviewed_at=None,
        review_notes=None,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {
        "success": True,
        "document_id": doc.id,
        "deadline_at": doc.deadline_at.isoformat(),
        "message": "Document uploaded successfully. 24h review window started."
    }


@router.post("/documents/upload-file")
async def upload_document_file(
    investor_id: int = Form(...),
    document_type: str = Form(...),
    document_name: str = Form(...),
    file: UploadFile = File(...),
    user: User = Depends(verify_compliance_access),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Upload a KYC/KYB document file (multipart/form-data).

    Accepts real file uploads, stores files to disk, and creates Document records.
    Deadline calculated using configurable business days + grace period.

    - **investor_id**: Investor profile ID
    - **document_type**: Type (kyc_id, kyc_address, kyb_incorporation, etc.)
    - **document_name**: Human-readable document name
    - **file**: The actual file (PDF, image, etc.)
    """
    import os
    import hashlib

    # Validate file type
    allowed_types = {
        'application/pdf': '.pdf',
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/tiff': '.tiff',
    }
    content_type = file.content_type or ''
    if content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {content_type}. Allowed: PDF, JPEG, PNG, TIFF"
        )

    # Read file content and compute hash
    file_content = await file.read()
    file_hash = hashlib.sha256(file_content).hexdigest()
    file_size = len(file_content)

    if file_size > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")

    # Store file to uploads directory
    uploads_dir = os.path.join(os.getcwd(), 'uploads', 'documents')
    os.makedirs(uploads_dir, exist_ok=True)

    ext = allowed_types[content_type]
    safe_filename = f"investor_{investor_id}_{document_type}_{uuid.uuid4().hex[:12]}{ext}"
    file_path = os.path.join(uploads_dir, safe_filename)

    with open(file_path, 'wb') as f:
        f.write(file_content)

    # Map document type to enum
    doc_type_map = {
        "kyc_id": DocumentTypeEnum.KYC_ID,
        "kyc_address": DocumentTypeEnum.KYC_ADDRESS,
        "kyc_selfie": DocumentTypeEnum.KYC_SELFIE,
        "kyb_incorporation": DocumentTypeEnum.KYB_INCORPORATION,
        "kyb_tax": DocumentTypeEnum.KYB_TAX,
        "kyb_ubo": DocumentTypeEnum.KYB_UBO,
        "kyb_resolution": DocumentTypeEnum.KYB_RESOLUTION,
        "kyb_license": DocumentTypeEnum.KYB_LICENSE,
        "kyb_aml": DocumentTypeEnum.KYB_AML,
    }
    doc_type = doc_type_map.get(document_type, DocumentTypeEnum.OTHER)

    # Get configured business days (default: 5)
    setting = db.query(ComplianceSettings).filter(
        ComplianceSettings.setting_key == 'kyc_review_deadline_days'
    ).first()
    business_days = setting.setting_value if setting else 5
    grace_period_days = 1  # 1 business day grace period

    # Get investor jurisdiction for holiday calculation
    investor = db.query(InvestorProfile).filter(InvestorProfile.id == investor_id).first()
    if not investor:
        raise HTTPException(status_code=404, detail=f"Investor {investor_id} not found")
    
    country_code = investor.jurisdiction or "US"

    # Calculate deadline using business days (async call)
    import asyncio
    now = datetime.utcnow()
    
    try:
        deadline = asyncio.get_event_loop().run_until_complete(
            calculate_kyc_deadline(
                submitted_at=now,
                business_days=business_days,
                country_code=country_code,
                grace_period_days=grace_period_days,
                db_session=db
            )
        )
    except Exception as e:
        logger.error(f"Error calculating deadline: {e}")
        # Fallback to simple calculation (business_days + grace_period) * 24 hours
        deadline = now + timedelta(days=(business_days + grace_period_days) * 1.5)

    # Create Document record
    doc = Document(
        investor_id=investor_id,
        document_type=doc_type,
        document_name=document_name,
        file_path=file_path,
        file_hash=file_hash,
        verification_status=ComplianceStatusEnum.PENDING,
        upload_status='uploaded',
        submitted_at=now,
        deadline_at=deadline,
        original_deadline_at=deadline,  # Will be adjusted if grace period is separate
        deadline_config_days=business_days,
        grace_period_days=grace_period_days,
        reviewed_by=None,
        reviewed_at=None,
        review_notes=None,
        auto_rejected=False,
        escalation_level=0,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    logger.info(
        f"Document uploaded: {doc.id}, Investor {investor_id}, "
        f"Deadline: {deadline.isoformat()} ({business_days} business days + {grace_period_days} grace)"
    )

    return {
        "success": True,
        "document_id": doc.id,
        "file_path": file_path,
        "file_hash": file_hash,
        "file_size": file_size,
        "deadline_at": doc.deadline_at.isoformat(),
        "business_days_configured": business_days,
        "grace_period_days": grace_period_days,
        "message": f"Document uploaded successfully. {business_days}-business-day review window started (plus {grace_period_days} day grace period)."
    }


# =============================================================================
# ADMIN SETTINGS ENDPOINTS
# =============================================================================

class UpdateDeadlineRequest(BaseModel):
    """Request model for updating KYC review deadline"""
    business_days: int = Field(..., ge=1, le=30, description="Number of business days (1-30)")
    reason: str = Field(..., min_length=10, description="Reason for the change")


class ExtendDeadlineRequest(BaseModel):
    """Request model for extending a specific document's deadline"""
    additional_days: int = Field(..., ge=1, le=30, description="Additional business days to add")
    reason: str = Field(..., min_length=10, description="Reason for extension")


@router.put("/settings/kyc-deadline")
async def update_kyc_deadline(
    request: UpdateDeadlineRequest,
    user: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Update KYC/KYB review deadline (business days).
    
    Only affects NEW submissions. Existing documents keep their original deadline.
    
    **Requirements:**
    - ADMIN role only
    - Business days must be between 1 and 30
    - Reason must be provided (min 10 characters)
    
    **Returns:**
    - Success status
    - Old and new values
    - Timestamp of change
    - Admin who made the change
    """
    days = request.business_days
    
    # Validate range
    if days < 1 or days > 30:
        raise HTTPException(
            status_code=400,
            detail="Business days must be between 1 and 30"
        )
    
    # Get current setting
    setting = db.query(ComplianceSettings).filter(
        ComplianceSettings.setting_key == 'kyc_review_deadline_days'
    ).first()
    
    old_value = setting.setting_value if setting else None
    
    # Upsert setting
    if not setting:
        setting = ComplianceSettings(
            setting_key='kyc_review_deadline_days',
            setting_value=days,
            description='Business days for KYC/KYB document review SLA'
        )
        db.add(setting)
    else:
        setting.setting_value = days
        setting.updated_by = user.id
    
    # Log the change
    activity = ComplianceActivity(
        user_id=user.id,
        activity_type='SETTINGS_UPDATE',
        target_id=None,
        target_type='COMPLIANCE_SETTINGS',
        details={
            "setting": "kyc_review_deadline_days",
            "old_value": old_value,
            "new_value": days,
            "reason": request.reason,
            "changed_by": user.email
        }
    )
    db.add(activity)
    db.commit()
    
    logger.info(
        f"KYC deadline updated: {old_value} -> {days} business days "
        f"by {user.email} (Reason: {request.reason})"
    )
    
    return {
        "success": True,
        "setting_key": "kyc_review_deadline_days",
        "old_value": old_value,
        "new_value": days,
        "updated_by": user.email,
        "updated_at": datetime.utcnow().isoformat(),
        "note": "This change only affects NEW document submissions"
    }


@router.get("/settings/kyc-deadline")
async def get_kyc_deadline(
    user: User = Depends(verify_compliance_access),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Get current KYC review deadline setting.
    
    Accessible to all compliance officers (read-only).
    """
    setting = db.query(ComplianceSettings).filter(
        ComplianceSettings.setting_key == 'kyc_review_deadline_days'
    ).first()
    
    # Get change history
    activities = db.query(ComplianceActivity).filter(
        ComplianceActivity.activity_type == 'SETTINGS_UPDATE'
    ).order_by(ComplianceActivity.created_at.desc()).limit(10).all()
    
    history = []
    for activity in activities:
        details = activity.details if isinstance(activity.details, dict) else {}
        history.append({
            "old_value": details.get("old_value"),
            "new_value": details.get("new_value"),
            "reason": details.get("reason"),
            "changed_by": details.get("changed_by"),
            "changed_at": activity.created_at.isoformat()
        })
    
    return {
        "setting_key": "kyc_review_deadline_days",
        "current_value": setting.setting_value if setting else 5,
        "description": setting.description if setting else "Default: 5 business days",
        "updated_by": setting.updater.email if setting and setting.updater else None,
        "updated_at": setting.updated_at.isoformat() if setting and setting.updated_at else None,
        "change_history": history
    }


@router.post("/documents/{document_id}/extend-deadline")
async def extend_document_deadline(
    document_id: int,
    request: ExtendDeadlineRequest,
    user: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Extend deadline for a specific document (admin override).
    
    Adds additional business days to the document's deadline.
    Logs the extension for audit trail.
    
    **Requirements:**
    - ADMIN role only
    - Additional days must be between 1 and 30
    - Reason must be provided
    
    **Returns:**
    - Success status
    - Old and new deadline
    - Extension details
    """
    # Get document
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document {document_id} not found")
    
    if doc.verification_status != ComplianceStatusEnum.PENDING:
        raise HTTPException(
            status_code=400,
            detail="Can only extend deadline for pending documents"
        )
    
    # Store original deadline
    old_deadline = doc.deadline_at
    
    # Calculate new deadline (add business days)
    import asyncio
    from utils.business_days import calculate_kyc_deadline
    
    investor = db.query(InvestorProfile).filter(
        InvestorProfile.id == doc.investor_id
    ).first()
    
    if not investor:
        raise HTTPException(status_code=404, detail="Investor not found")
    
    country_code = investor.jurisdiction or "US"
    
    try:
        # Add additional days to current deadline
        new_deadline = asyncio.get_event_loop().run_until_complete(
            calculate_kyc_deadline(
                submitted_at=doc.deadline_at,  # Start from current deadline
                business_days=request.additional_days,
                country_code=country_code,
                grace_period_days=0,  # No additional grace period
                db_session=db
            )
        )
    except Exception as e:
        logger.error(f"Error extending deadline: {e}")
        # Fallback
        new_deadline = doc.deadline_at + timedelta(days=request.additional_days * 1.5)
    
    # Update document
    doc.deadline_at = new_deadline
    doc.extended_by = user.id
    doc.extended_at = datetime.utcnow()
    doc.extension_reason = request.reason
    
    # Log the extension
    activity = ComplianceActivity(
        user_id=user.id,
        activity_type='DEADLINE_EXTEND',
        target_id=document_id,
        target_type='DOCUMENT',
        details={
            "document_id": document_id,
            "investor_id": doc.investor_id,
            "document_type": doc.document_type.value,
            "old_deadline": old_deadline.isoformat(),
            "new_deadline": new_deadline.isoformat(),
            "additional_days": request.additional_days,
            "reason": request.reason,
            "extended_by": user.email
        }
    )
    db.add(activity)
    db.commit()
    
    logger.info(
        f"Document {document_id} deadline extended: {old_deadline.isoformat()} -> {new_deadline.isoformat()} "
        f"(+{request.additional_days} days) by {user.email}"
    )
    
    return {
        "success": True,
        "document_id": document_id,
        "old_deadline": old_deadline.isoformat(),
        "new_deadline": new_deadline.isoformat(),
        "additional_days": request.additional_days,
        "extended_by": user.email,
        "extended_at": datetime.utcnow().isoformat(),
        "reason": request.reason
    }


@router.post("/documents/{document_id}/cancel-rejection")
async def cancel_auto_rejection(
    document_id: int,
    user: User = Depends(verify_admin_write),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Cancel auto-rejection for a document (admin override).
    
    Reverts document status from REJECTED back to PENDING.
    Sets a new deadline (current time + configured business days).
    
    **Requirements:**
    - ADMIN role only
    - Document must be in auto_rejected state
    
    **Returns:**
    - Success status
    - Document details
    - New deadline
    """
    # Get document
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document {document_id} not found")
    
    if not doc.auto_rejected:
        raise HTTPException(
            status_code=400,
            detail="Document is not in auto-rejected state"
        )
    
    # Revert document status
    doc.verification_status = ComplianceStatusEnum.PENDING
    doc.auto_rejected = False
    doc.rejection_reason = None
    doc.escalation_level = 0
    
    # Set new deadline
    import asyncio
    from utils.business_days import calculate_kyc_deadline
    
    investor = db.query(InvestorProfile).filter(
        InvestorProfile.id == doc.investor_id
    ).first()
    
    if not investor:
        raise HTTPException(status_code=404, detail="Investor not found")
    
    country_code = investor.jurisdiction or "US"
    setting = db.query(ComplianceSettings).filter(
        ComplianceSettings.setting_key == 'kyc_review_deadline_days'
    ).first()
    business_days = setting.setting_value if setting else 5
    
    try:
        new_deadline = asyncio.get_event_loop().run_until_complete(
            calculate_kyc_deadline(
                submitted_at=datetime.utcnow(),
                business_days=business_days,
                country_code=country_code,
                grace_period_days=1,
                db_session=db
            )
        )
    except Exception as e:
        logger.error(f"Error calculating new deadline: {e}")
        new_deadline = datetime.utcnow() + timedelta(days=(business_days + 1) * 1.5)
    
    doc.deadline_at = new_deadline
    doc.submitted_at = datetime.utcnow()  # Reset submission time
    
    # Update investor status back to pending
    investor_profile = db.query(InvestorProfile).filter(
        InvestorProfile.id == doc.investor_id
    ).first()
    
    if investor_profile:
        if doc.document_type.value.startswith('kyc_'):
            investor_profile.kyc_status = ComplianceStatusEnum.PENDING
        elif doc.document_type.value.startswith('kyb_'):
            investor_profile.kyb_status = ComplianceStatusEnum.PENDING
    
    # Log the action
    activity = ComplianceActivity(
        user_id=user.id,
        activity_type='REJECTION_CANCELLED',
        target_id=document_id,
        target_type='DOCUMENT',
        details={
            "document_id": document_id,
            "investor_id": doc.investor_id,
            "document_type": doc.document_type.value,
            "old_status": "rejected",
            "new_status": "pending",
            "new_deadline": new_deadline.isoformat(),
            "cancelled_by": user.email
        }
    )
    db.add(activity)
    db.commit()
    
    logger.info(
        f"Document {document_id} auto-rejection cancelled by {user.email}, "
        f"new deadline: {new_deadline.isoformat()}"
    )
    
    return {
        "success": True,
        "document_id": document_id,
        "status": "pending",
        "new_deadline": new_deadline.isoformat(),
        "cancelled_by": user.email,
        "cancelled_at": datetime.utcnow().isoformat()
    }

