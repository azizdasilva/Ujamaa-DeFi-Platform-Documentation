"""
Compliance API - KYC/KYB Document Review with 24h Window (Database-Backed)

Endpoints for compliance officers to review and approve/reject documents.
Implements 24-hour review window requirement.

@notice All document data is persisted to PostgreSQL/SQLite.
"""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import uuid

from config.database import get_db
from config.models import (
    Document, ComplianceActivity, InvestorProfile, User,
    ComplianceStatusEnum, DocumentTypeEnum
)
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v2/compliance", tags=["Compliance"])

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
async def review_document(document_id: int, review: ReviewRequest, db: Session = Depends(get_db)):
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
async def batch_review_documents(documents: List[Dict[str, str]], db: Session = Depends(get_db)):
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
