"""
Compliance API - KYC/KYB Document Review with 24h Window

Endpoints for compliance officers to review and approve/reject documents.
Implements 24-hour review window requirement.

@notice: MVP TESTNET - Mock implementation for demo
"""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import uuid

router = APIRouter(prefix="/api/v2/compliance", tags=["Compliance"])

# =============================================================================
# MOCK DATABASE (Replace with SQLAlchemy models when DB is connected)
# =============================================================================

# Mock documents storage
documents_db: Dict[str, Dict[str, Any]] = {
    "doc-001": {
        "id": "doc-001",
        "investor_id": "inv-001",
        "investor_name": "John Doe",
        "document_type": "kyc_id",
        "document_name": "National ID",
        "file_path": "/uploads/kyc/doc-001_id.pdf",
        "file_hash": "0x" + uuid.uuid4().hex,
        "upload_status": "uploaded",
        "verification_status": "pending",
        "submitted_at": datetime.utcnow().isoformat(),
        "deadline_at": (datetime.utcnow() + timedelta(hours=24)).isoformat(),
        "reviewed_by": None,
        "reviewed_at": None,
        "review_notes": None,
    },
    "doc-002": {
        "id": "doc-002",
        "investor_id": "inv-001",
        "investor_name": "John Doe",
        "document_type": "kyc_address",
        "document_name": "Proof of Address",
        "file_path": "/uploads/kyc/doc-002_address.pdf",
        "file_hash": "0x" + uuid.uuid4().hex,
        "upload_status": "uploaded",
        "verification_status": "pending",
        "submitted_at": datetime.utcnow().isoformat(),
        "deadline_at": (datetime.utcnow() + timedelta(hours=24)).isoformat(),
        "reviewed_by": None,
        "reviewed_at": None,
        "review_notes": None,
    },
    "doc-003": {
        "id": "doc-003",
        "investor_id": "inst-001",
        "investor_name": "Logic Capital Ltd",
        "document_type": "kyb_incorporation",
        "document_name": "Certificate of Incorporation",
        "file_path": "/uploads/kyb/doc-003_incorporation.pdf",
        "file_hash": "0x" + uuid.uuid4().hex,
        "upload_status": "uploaded",
        "verification_status": "pending",
        "submitted_at": (datetime.utcnow() - timedelta(hours=12)).isoformat(),
        "deadline_at": (datetime.utcnow() + timedelta(hours=12)).isoformat(),
        "reviewed_by": None,
        "reviewed_at": None,
        "review_notes": None,
    },
}

# Mock compliance activities log
compliance_activities_db: List[Dict[str, Any]] = []

# =============================================================================
# PYDANTIC MODELS
# =============================================================================

class DocumentResponse(BaseModel):
    id: str
    investor_id: str
    investor_name: str
    document_type: str
    document_name: str
    file_path: str
    file_hash: str
    upload_status: str
    verification_status: str
    submitted_at: str
    deadline_at: str
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[str] = None
    review_notes: Optional[str] = None
    time_remaining_hours: Optional[float] = None


class ReviewRequest(BaseModel):
    action: str = Field(..., description="approve or reject")
    notes: Optional[str] = Field(None, description="Review notes")


class ComplianceActivityResponse(BaseModel):
    id: str
    user_id: str
    activity_type: str
    target_id: str
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

def calculate_time_remaining(deadline_at: str) -> float:
    """Calculate hours remaining until deadline"""
    deadline = datetime.fromisoformat(deadline_at)
    now = datetime.utcnow()
    remaining = deadline - now
    return max(0, remaining.total_seconds() / 3600)


def check_overdue_documents():
    """Check and flag overdue documents"""
    overdue = []
    for doc_id, doc in documents_db.items():
        if doc["verification_status"] == "pending":
            time_remaining = calculate_time_remaining(doc["deadline_at"])
            if time_remaining <= 0:
                overdue.append(doc_id)
                # Auto-flag as requiring review
                doc["review_notes"] = f"⚠️ OVERDUE - Not reviewed within 24h window"
    return overdue


# =============================================================================
# API ENDPOINTS
# =============================================================================

@router.get("/documents", response_model=List[DocumentResponse])
async def get_all_documents(
    status: Optional[str] = None,
    investor_id: Optional[str] = None
):
    """
    Get all documents for review.
    
    - **status**: Filter by verification status (pending, approved, rejected)
    - **investor_id**: Filter by investor ID
    
    @notice: Returns documents with 24h deadline information
    """
    check_overdue_documents()
    
    filtered = []
    for doc in documents_db.values():
        if status and doc["verification_status"] != status:
            continue
        if investor_id and doc["investor_id"] != investor_id:
            continue
        
        doc_response = doc.copy()
        doc_response["time_remaining_hours"] = calculate_time_remaining(doc["deadline_at"])
        filtered.append(doc_response)
    
    # Sort by submission time (oldest first - most urgent)
    filtered.sort(key=lambda x: x["submitted_at"])
    
    return filtered


@router.get("/documents/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str):
    """
    Get a specific document by ID.
    
    Returns document details including file path for viewing.
    """
    if document_id not in documents_db:
        raise HTTPException(status_code=404, detail="Document not found")
    
    doc = documents_db[document_id]
    doc_response = doc.copy()
    doc_response["time_remaining_hours"] = calculate_time_remaining(doc["deadline_at"])
    
    return doc_response


@router.post("/documents/{document_id}/review")
async def review_document(document_id: str, review: ReviewRequest):
    """
    Review and approve/reject a document.
    
    - **action**: "approve" or "reject"
    - **notes**: Optional review notes
    
    @notice: Must be done within 24h of submission
    """
    if document_id not in documents_db:
        raise HTTPException(status_code=404, detail="Document not found")
    
    doc = documents_db[document_id]
    
    # Check if already reviewed
    if doc["verification_status"] != "pending":
        raise HTTPException(
            status_code=400,
            detail=f"Document already {doc['verification_status']}"
        )
    
    # Check if overdue
    time_remaining = calculate_time_remaining(doc["deadline_at"])
    if time_remaining <= 0:
        # Allow review but flag as overdue
        doc["review_notes"] = (doc.get("review_notes") or "") + " ⚠️ Reviewed after 24h deadline"
    
    # Update document
    now = datetime.utcnow().isoformat()
    doc["verification_status"] = "approved" if review.action == "approve" else "rejected"
    doc["reviewed_by"] = "compliance-001"  # Would come from auth context
    doc["reviewed_at"] = now
    doc["review_notes"] = (doc.get("review_notes") or "") + (review.notes or "")
    
    # Log activity
    activity = {
        "id": str(uuid.uuid4()),
        "user_id": "compliance-001",
        "activity_type": f"DOCUMENT_{review.action.upper()}",
        "target_id": document_id,
        "target_type": "DOCUMENT",
        "details": {
            "investor_id": doc["investor_id"],
            "document_type": doc["document_type"],
            "notes": review.notes,
            "time_remaining_hours": time_remaining,
        },
        "created_at": now,
    }
    compliance_activities_db.append(activity)
    
    return {
        "success": True,
        "message": f"Document {review.action}d successfully",
        "document_id": document_id,
        "status": doc["verification_status"],
        "time_remaining_hours": time_remaining,
    }


@router.get("/documents/{document_id}/view")
async def view_document(document_id: str):
    """
    View document content (mock - returns metadata).
    
    In production, this would stream the actual file or return a signed URL.
    """
    if document_id not in documents_db:
        raise HTTPException(status_code=404, detail="Document not found")
    
    doc = documents_db[document_id]
    
    # Mock document viewer URL
    viewer_url = f"https://ujamaa-defi.com/document-viewer/{document_id}?token=mock_jwt_token"
    
    return {
        "document": doc,
        "viewer_url": viewer_url,
        "download_url": f"/api/v2/compliance/documents/{document_id}/download",
        "file_metadata": {
            "type": "PDF",
            "size": "2.4 MB",
            "pages": 3,
            "hash": doc["file_hash"],
        }
    }


@router.get("/stats", response_model=ComplianceStats)
async def get_compliance_stats():
    """
    Get compliance statistics.
    
    Returns counts of pending, approved, rejected, and overdue documents.
    """
    check_overdue_documents()
    
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    pending = 0
    approved_today = 0
    rejected_today = 0
    overdue = 0
    review_times = []
    
    for doc in documents_db.values():
        if doc["verification_status"] == "pending":
            pending += 1
            time_remaining = calculate_time_remaining(doc["deadline_at"])
            if time_remaining <= 0:
                overdue += 1
        elif doc["verification_status"] == "approved":
            if doc["reviewed_at"]:
                reviewed_at = datetime.fromisoformat(doc["reviewed_at"])
                if reviewed_at >= today_start:
                    approved_today += 1
                    # Calculate review time
                    submitted_at = datetime.fromisoformat(doc["submitted_at"])
                    review_time = (reviewed_at - submitted_at).total_seconds() / 3600
                    review_times.append(review_time)
        elif doc["verification_status"] == "rejected":
            if doc["reviewed_at"]:
                reviewed_at = datetime.fromisoformat(doc["reviewed_at"])
                if reviewed_at >= today_start:
                    rejected_today += 1
        
    avg_review_time = sum(review_times) / len(review_times) if review_times else 0
    
    return {
        "pending_count": pending,
        "approved_today": approved_today,
        "rejected_today": rejected_today,
        "overdue_count": overdue,
        "avg_review_time_hours": round(avg_review_time, 2),
    }


@router.get("/activities", response_model=List[ComplianceActivityResponse])
async def get_compliance_activities(limit: int = 50):
    """
    Get compliance activity log.
    
    Returns audit trail of all compliance actions.
    """
    # Sort by creation time (newest first)
    sorted_activities = sorted(
        compliance_activities_db,
        key=lambda x: x["created_at"],
        reverse=True
    )
    return sorted_activities[:limit]


@router.post("/documents/batch-review")
async def batch_review_documents(documents: List[Dict[str, str]]):
    """
    Review multiple documents at once.
    
    Useful for bulk approvals.
    
    Request body:
    ```json
    [
        {"document_id": "doc-001", "action": "approve", "notes": "All documents verified"},
        {"document_id": "doc-002", "action": "reject", "notes": "Document unclear"}
    ]
    ```
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
            review = ReviewRequest(action=action, notes=notes)
            result = await review_document(doc_id, review)
            results.append({
                "document_id": doc_id,
                "success": True,
                "status": result["status"]
            })
        except HTTPException as e:
            results.append({
                "document_id": doc_id,
                "success": False,
                "error": str(e.detail)
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
    investor_id: str,
    investor_name: str,
    document_type: str,
    document_name: str
):
    """
    Demo endpoint to upload a document (for testing).
    
    Creates a mock document with 24h deadline.
    """
    doc_id = f"doc-{str(uuid.uuid4())[:8]}"
    now = datetime.utcnow()
    
    doc = {
        "id": doc_id,
        "investor_id": investor_id,
        "investor_name": investor_name,
        "document_type": document_type,
        "document_name": document_name,
        "file_path": f"/uploads/{document_type}/{doc_id}.pdf",
        "file_hash": "0x" + uuid.uuid4().hex,
        "upload_status": "uploaded",
        "verification_status": "pending",
        "submitted_at": now.isoformat(),
        "deadline_at": (now + timedelta(hours=24)).isoformat(),
        "reviewed_by": None,
        "reviewed_at": None,
        "review_notes": None,
    }
    
    documents_db[doc_id] = doc
    
    return {
        "success": True,
        "document_id": doc_id,
        "deadline_at": doc["deadline_at"],
        "message": "Document uploaded successfully. 24h review window started."
    }
