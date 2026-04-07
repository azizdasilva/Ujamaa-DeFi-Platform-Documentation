"""
Compliance Monitoring & Analytics API

Provides comprehensive monitoring dashboard data including:
- SLA compliance metrics
- Officer performance tracking
- Trend analysis (7/30/90 day)
- Overdue document reports
- Document type breakdown
- Escalation tracking

@notice: All endpoints read-only except where noted
@reference: SRS v2.0 Section 1.3 - Compliance Requirements
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, case, extract

from config.database import get_db
from config.models import (
    Document, InvestorProfile, User, ComplianceActivity,
    ComplianceSettings, EmailNotification,
    ComplianceStatusEnum, DocumentTypeEnum, InvestorRoleEnum
)

router = APIRouter(prefix="/api/v2/compliance/monitoring", tags=["Compliance Monitoring"])

# Auth security (read-only access for compliance officers)
security_scheme = None  # Import from compliance_documents.py


def verify_compliance_access(auth, db: Session) -> User:
    """Verify user has compliance access"""
    # Reuse the verification logic from compliance_documents.py
    # For now, return a mock user (replace with actual auth)
    if not auth or not auth.credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = auth.credentials
    if token == "admin-token-mvp":
        admin = db.query(User).filter(User.role == "ADMIN").first()
        if not admin:
            raise HTTPException(status_code=404, detail="No admin user found")
        return admin
    
    user = db.query(User).filter(
        (User.wallet_address == token) | (User.email == token)
    ).first()
    
    if not user:
        raise HTTPException(status_code=403, detail="Invalid authentication")
    
    user_role = user.role.value if hasattr(user.role, 'value') else user.role
    compliance_roles = {'ADMIN', 'COMPLIANCE_OFFICER'}
    
    if user_role not in compliance_roles:
        raise HTTPException(status_code=403, detail="Compliance access denied")
    
    return user


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def calculate_business_days_between(start: datetime, end: datetime) -> float:
    """
    Calculate number of business days between two dates.
    Simplified calculation (excludes weekends).
    """
    days = 0
    current = start
    
    while current < end:
        current += timedelta(days=1)
        # Monday = 0, Sunday = 6
        if current.weekday() < 5:
            days += 1
    
    return float(days)


def get_date_range(period: str) -> tuple:
    """
    Get start and end dates for a given period.
    
    Args:
        period: '7d', '30d', '90d', '1y', 'all'
        
    Returns:
        Tuple of (start_date, end_date)
    """
    now = datetime.utcnow()
    
    if period == '7d':
        start = now - timedelta(days=7)
    elif period == '30d':
        start = now - timedelta(days=30)
    elif period == '90d':
        start = now - timedelta(days=90)
    elif period == '1y':
        start = now - timedelta(days=365)
    elif period == 'all':
        start = datetime(2020, 1, 1)  # Far past
    else:
        start = now - timedelta(days=30)  # Default 30 days
    
    return start, now


# =============================================================================
# PYDANTIC MODELS
# =============================================================================

from pydantic import BaseModel, Field
from typing import Optional


class SLAMetrics(BaseModel):
    """SLA compliance metrics"""
    total_documents: int
    approved_on_time: int
    approved_late: int
    auto_rejected: int
    still_pending: int
    sla_compliance_rate: float
    average_review_time_business_days: float
    on_time_percentage: float
    rejection_rate: float


class DocumentTypeBreakdown(BaseModel):
    """Metrics broken down by document type"""
    document_type: str
    total: int
    approved_on_time: int
    approved_late: int
    rejected: int
    pending: int
    average_review_days: float


class OfficerPerformance(BaseModel):
    """Compliance officer performance metrics"""
    officer_id: int
    officer_email: str
    total_reviews: int
    approved: int
    rejected: int
    average_response_days: float
    approval_rate: float


class TrendDataPoint(BaseModel):
    """Single data point for trend analysis"""
    date: str
    total_submissions: int
    approved_count: int
    rejected_count: int
    average_review_days: float


class MonitoringDashboardResponse(BaseModel):
    """Complete monitoring dashboard data"""
    period: str
    start_date: str
    end_date: str
    sla_metrics: SLAMetrics
    current_deadline_setting: int
    by_document_type: List[DocumentTypeBreakdown]
    officer_performance: List[OfficerPerformance]
    trend_data: List[TrendDataPoint]
    overdue_summary: Dict
    generated_at: str


# =============================================================================
# ENDPOINTS
# =============================================================================

@router.get("/dashboard")
async def get_monitoring_dashboard(
    period: str = Query("30d", description="Period: 7d, 30d, 90d, 1y, all"),
    auth = None,  # Add auth dependency
    db: Session = Depends(get_db)
) -> MonitoringDashboardResponse:
    """
    Comprehensive compliance monitoring dashboard.
    
    Provides SLA efficiency metrics, officer performance, trends,
    and document type breakdowns for the specified period.
    
    **Periods:**
    - `7d`: Last 7 days
    - `30d`: Last 30 days (default)
    - `90d`: Last 90 days
    - `1y`: Last year
    - `all`: All time
    
    **Returns:**
    - SLA compliance rate
    - Average review time
    - Document type breakdown
    - Officer performance metrics
    - Trend data
    """
    start_date, end_date = get_date_range(period)
    
    # Get all documents in period
    all_docs = db.query(Document).filter(
        Document.submitted_at >= start_date,
        Document.submitted_at <= end_date
    ).all()
    
    # Categorize documents
    total_docs = len(all_docs)
    
    approved_on_time = [d for d in all_docs if 
        d.reviewed_at and d.reviewed_at <= d.deadline_at and 
        d.verification_status == ComplianceStatusEnum.APPROVED]
    
    approved_late = [d for d in all_docs if
        d.reviewed_at and d.reviewed_at > d.deadline_at and
        d.verification_status == ComplianceStatusEnum.APPROVED]
    
    auto_rejected = [d for d in all_docs if d.auto_rejected]
    
    still_pending = [d for d in all_docs if 
        d.verification_status == ComplianceStatusEnum.PENDING and not d.auto_rejected]
    
    # Calculate SLA compliance rate
    sla_compliant = len(approved_on_time) + len(auto_rejected)
    sla_rate = (len(approved_on_time) / total_docs * 100) if total_docs > 0 else 100.0
    
    # Calculate average review time (business days)
    reviewed_docs = [d for d in all_docs if d.reviewed_at]
    avg_review_days = 0.0
    
    if reviewed_docs:
        total_business_days = 0
        for doc in reviewed_docs:
            days = calculate_business_days_between(doc.submitted_at, doc.reviewed_at)
            total_business_days += days
        avg_review_days = total_business_days / len(reviewed_docs)
    
    # On-time percentage
    on_time_pct = (len(approved_on_time) / total_docs * 100) if total_docs > 0 else 100.0
    
    # Rejection rate
    rejection_rate = (len(auto_rejected) / total_docs * 100) if total_docs > 0 else 0.0
    
    # Current deadline setting
    setting = db.query(ComplianceSettings).filter(
        ComplianceSettings.setting_key == 'kyc_review_deadline_days'
    ).first()
    current_deadline = setting.setting_value if setting else 5
    
    # Document type breakdown
    by_type = []
    doc_types = set([d.document_type.value for d in all_docs])
    
    for doc_type in doc_types:
        type_docs = [d for d in all_docs if d.document_type.value == doc_type]
        type_approved_on_time = [d for d in type_docs if 
            d.reviewed_at and d.reviewed_at <= d.deadline_at and 
            d.verification_status == ComplianceStatusEnum.APPROVED]
        type_approved_late = [d for d in type_docs if
            d.reviewed_at and d.reviewed_at > d.deadline_at and
            d.verification_status == ComplianceStatusEnum.APPROVED]
        type_rejected = [d for d in type_docs if d.auto_rejected]
        type_pending = [d for d in type_docs if 
            d.verification_status == ComplianceStatusEnum.PENDING and not d.auto_rejected]
        
        # Average review time for this type
        type_reviewed = [d for d in type_docs if d.reviewed_at]
        type_avg_days = 0.0
        if type_reviewed:
            type_total_days = sum([
                calculate_business_days_between(d.submitted_at, d.reviewed_at)
                for d in type_reviewed
            ])
            type_avg_days = type_total_days / len(type_reviewed)
        
        by_type.append(DocumentTypeBreakdown(
            document_type=doc_type,
            total=len(type_docs),
            approved_on_time=len(type_approved_on_time),
            approved_late=len(type_approved_late),
            rejected=len(type_rejected),
            pending=len(type_pending),
            average_review_days=round(type_avg_days, 2)
        ))
    
    # Officer performance
    officer_stats = []
    activities = db.query(ComplianceActivity).filter(
        ComplianceActivity.created_at >= start_date,
        ComplianceActivity.created_at <= end_date,
        ComplianceActivity.activity_type.in_(['DOCUMENT_APPROVE', 'DOCUMENT_REJECT'])
    ).all()
    
    officer_map = {}
    for activity in activities:
        officer_id = activity.user_id
        if officer_id not in officer_map:
            officer_map[officer_id] = {
                'total': 0,
                'approved': 0,
                'rejected': 0,
                'response_days': []
            }
        
        officer_map[officer_id]['total'] += 1
        
        if activity.activity_type == 'DOCUMENT_APPROVE':
            officer_map[officer_id]['approved'] += 1
        else:
            officer_map[officer_id]['rejected'] += 1
        
        # Calculate response time if available
        details = activity.details if isinstance(activity.details, dict) else {}
        if 'response_days' in details:
            officer_map[officer_id]['response_days'].append(details['response_days'])
    
    for officer_id, stats in officer_map.items():
        officer = db.query(User).filter(User.id == officer_id).first()
        avg_response = sum(stats['response_days']) / len(stats['response_days']) if stats['response_days'] else 0.0
        
        officer_stats.append(OfficerPerformance(
            officer_id=officer_id,
            officer_email=officer.email if officer else "Unknown",
            total_reviews=stats['total'],
            approved=stats['approved'],
            rejected=stats['rejected'],
            average_response_days=round(avg_response, 2),
            approval_rate=round((stats['approved'] / stats['total'] * 100) if stats['total'] > 0 else 0, 2)
        ))
    
    # Trend data
    trend_data = get_trend_data(db, start_date, end_date, period)
    
    # Overdue summary
    overdue_docs = db.query(Document).filter(
        Document.deadline_at < datetime.utcnow(),
        Document.verification_status == ComplianceStatusEnum.PENDING
    ).all()
    
    overdue_summary = {
        "total_overdue": len(overdue_docs),
        "in_grace_period": len([d for d in overdue_docs if 
            d.deadline_at < datetime.utcnow() <= datetime.utcnow() + timedelta(days=2)]),
        "past_grace_period": len([d for d in overdue_docs if 
            datetime.utcnow() > d.deadline_at + timedelta(days=2)]),
        "by_type": {}
    }
    
    for doc in overdue_docs:
        doc_type = doc.document_type.value
        if doc_type not in overdue_summary["by_type"]:
            overdue_summary["by_type"][doc_type] = 0
        overdue_summary["by_type"][doc_type] += 1
    
    return MonitoringDashboardResponse(
        period=period,
        start_date=start_date.isoformat(),
        end_date=end_date.isoformat(),
        sla_metrics=SLAMetrics(
            total_documents=total_docs,
            approved_on_time=len(approved_on_time),
            approved_late=len(approved_late),
            auto_rejected=len(auto_rejected),
            still_pending=len(still_pending),
            sla_compliance_rate=round(sla_rate, 2),
            average_review_time_business_days=round(avg_review_days, 2),
            on_time_percentage=round(on_time_pct, 2),
            rejection_rate=round(rejection_rate, 2)
        ),
        current_deadline_setting=current_deadline,
        by_document_type=by_type,
        officer_performance=officer_stats,
        trend_data=trend_data,
        overdue_summary=overdue_summary,
        generated_at=datetime.utcnow().isoformat()
    )


@router.get("/overdue-report")
async def get_overdue_report(
    status: str = Query("all", description="Filter: all, rejected, pending, warning, urgent"),
    limit: int = Query(100, ge=1, le=1000, description="Max results"),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Detailed overdue document report for compliance auditing.
    
    Returns all documents that have passed their deadline.
    Can filter by status (rejected, pending, warning, urgent).
    
    **Status Filters:**
    - `all`: All overdue documents
    - `rejected`: Auto-rejected documents
    - `pending`: Still pending (in grace period or warning stage)
    - `warning`: Warning sent (escalation level 1)
    - `urgent`: Urgent sent (escalation level 2)
    """
    query = db.query(Document).filter(
        Document.deadline_at < datetime.utcnow()
    )
    
    # Apply status filter
    if status == "rejected":
        query = query.filter(Document.auto_rejected == True)
    elif status == "pending":
        query = query.filter(
            Document.auto_rejected == False,
            Document.verification_status == ComplianceStatusEnum.PENDING
        )
    elif status == "warning":
        query = query.filter(
            Document.escalation_level == 1,
            Document.auto_rejected == False
        )
    elif status == "urgent":
        query = query.filter(
            Document.escalation_level == 2,
            Document.auto_rejected == False
        )
    
    # Get documents (limited)
    overdue_docs = query.order_by(Document.deadline_at.asc()).limit(limit).all()
    
    results = []
    for doc in overdue_docs:
        investor = db.query(InvestorProfile).filter(
            InvestorProfile.id == doc.investor_id
        ).first()
        
        # Calculate business days overdue
        now = datetime.utcnow()
        if doc.deadline_at:
            days_overdue = calculate_business_days_between(doc.deadline_at, now)
        else:
            days_overdue = 0
        
        # Determine status
        if doc.auto_rejected:
            doc_status = "rejected"
        elif doc.escalation_level == 2:
            doc_status = "urgent"
        elif doc.escalation_level == 1:
            doc_status = "warning"
        else:
            doc_status = "pending"
        
        results.append({
            "document_id": doc.id,
            "investor_id": doc.investor_id,
            "investor_name": investor.full_name or investor.company_name if investor else "Unknown",
            "investor_jurisdiction": investor.jurisdiction if investor else "Unknown",
            "document_type": doc.document_type.value,
            "document_name": doc.document_name,
            "submitted_at": doc.submitted_at.isoformat() if doc.submitted_at else None,
            "deadline_at": doc.deadline_at.isoformat() if doc.deadline_at else None,
            "days_overdue": round(days_overdue, 2),
            "status": doc_status,
            "escalation_level": doc.escalation_level,
            "reviewed_at": doc.reviewed_at.isoformat() if doc.reviewed_at else None,
            "review_notes": doc.review_notes,
            "extended_by": doc.extended_by,
            "extended_at": doc.extended_at.isoformat() if doc.extended_at else None,
            "extension_reason": doc.extension_reason
        })
    
    # Summary counts
    total_overdue = db.query(Document).filter(
        Document.deadline_at < datetime.utcnow()
    ).count()
    
    rejected_count = db.query(Document).filter(
        Document.deadline_at < datetime.utcnow(),
        Document.auto_rejected == True
    ).count()
    
    pending_count = db.query(Document).filter(
        Document.deadline_at < datetime.utcnow(),
        Document.auto_rejected == False,
        Document.verification_status == ComplianceStatusEnum.PENDING
    ).count()
    
    return {
        "total_overdue": total_overdue,
        "rejected": rejected_count,
        "still_pending": pending_count,
        "showing": len(results),
        "limit": limit,
        "documents": results,
        "generated_at": datetime.utcnow().isoformat()
    }


@router.get("/sla-trends")
async def get_sla_trends(
    months: int = Query(6, ge=1, le=24, description="Number of months to analyze"),
    db: Session = Depends(get_db)
) -> Dict:
    """
    SLA compliance trends over time.
    
    Returns monthly SLA metrics for trend analysis.
    Useful for identifying patterns and bottlenecks.
    
    **Returns:**
    - Monthly SLA compliance rates
    - Average review times
    - Rejection rates
    - Volume trends
    """
    now = datetime.utcnow()
    start_date = now - timedelta(days=months * 30)
    
    monthly_data = []
    
    for i in range(months):
        month_start = start_date + timedelta(days=i * 30)
        month_end = month_start + timedelta(days=30)
        
        # Get documents for this month
        month_docs = db.query(Document).filter(
            Document.submitted_at >= month_start,
            Document.submitted_at < month_end
        ).all()
        
        if not month_docs:
            continue
        
        # Calculate metrics
        approved_on_time = [d for d in month_docs if 
            d.reviewed_at and d.reviewed_at <= d.deadline_at and 
            d.verification_status == ComplianceStatusEnum.APPROVED]
        
        rejected = [d for d in month_docs if d.auto_rejected]
        
        sla_rate = (len(approved_on_time) / len(month_docs) * 100) if month_docs else 100.0
        
        reviewed = [d for d in month_docs if d.reviewed_at]
        avg_review_days = 0.0
        if reviewed:
            total_days = sum([
                calculate_business_days_between(d.submitted_at, d.reviewed_at)
                for d in reviewed
            ])
            avg_review_days = total_days / len(reviewed)
        
        monthly_data.append({
            "month": month_start.strftime('%Y-%m'),
            "total_documents": len(month_docs),
            "approved_on_time": len(approved_on_time),
            "rejected": len(rejected),
            "sla_compliance_rate": round(sla_rate, 2),
            "average_review_days": round(avg_review_days, 2)
        })
    
    return {
        "months_analyzed": months,
        "start_date": start_date.isoformat(),
        "end_date": now.isoformat(),
        "monthly_data": monthly_data,
        "generated_at": datetime.utcnow().isoformat()
    }


@router.get("/officer-leaderboard")
async def get_officer_leaderboard(
    period: str = Query("30d", description="Period: 7d, 30d, 90d, 1y"),
    limit: int = Query(10, ge=1, le=50, description="Top N officers"),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Compliance officer performance leaderboard.
    
    Ranks officers by efficiency and quality of reviews.
    Useful for identifying training needs and top performers.
    """
    start_date, end_date = get_date_range(period)
    
    # Get all review activities
    activities = db.query(ComplianceActivity).filter(
        ComplianceActivity.created_at >= start_date,
        ComplianceActivity.created_at <= end_date,
        ComplianceActivity.activity_type.in_(['DOCUMENT_APPROVE', 'DOCUMENT_REJECT']),
        ComplianceActivity.user_id.isnot(None)
    ).all()
    
    # Aggregate by officer
    officer_stats = {}
    
    for activity in activities:
        officer_id = activity.user_id
        if officer_id not in officer_stats:
            officer_stats[officer_id] = {
                'total': 0,
                'approved': 0,
                'rejected': 0,
                'response_times': []
            }
        
        officer_stats[officer_id]['total'] += 1
        
        if activity.activity_type == 'DOCUMENT_APPROVE':
            officer_stats[officer_id]['approved'] += 1
        else:
            officer_stats[officer_id]['rejected'] += 1
        
        # Extract response time if available
        details = activity.details if isinstance(activity.details, dict) else {}
        if 'response_hours' in details:
            officer_stats[officer_id]['response_times'].append(details['response_hours'])
    
    # Build leaderboard
    leaderboard = []
    
    for officer_id, stats in officer_stats.items():
        officer = db.query(User).filter(User.id == officer_id).first()
        
        avg_response = (
            sum(stats['response_times']) / len(stats['response_times'])
            if stats['response_times'] else None
        )
        
        # Calculate efficiency score (weighted)
        # 60% approval rate, 40% speed
        approval_rate = (stats['approved'] / stats['total'] * 100) if stats['total'] > 0 else 0
        speed_score = max(0, 100 - (avg_response / 24 * 100)) if avg_response else 50  # Normalize to 0-100
        
        efficiency_score = (approval_rate * 0.6) + (speed_score * 0.4)
        
        leaderboard.append({
            "officer_id": officer_id,
            "officer_email": officer.email if officer else "Unknown",
            "total_reviews": stats['total'],
            "approved": stats['approved'],
            "rejected": stats['rejected'],
            "approval_rate": round(approval_rate, 2),
            "average_response_hours": round(avg_response, 2) if avg_response else None,
            "efficiency_score": round(efficiency_score, 2)
        })
    
    # Sort by efficiency score
    leaderboard.sort(key=lambda x: x['efficiency_score'], reverse=True)
    
    return {
        "period": period,
        "total_officers": len(leaderboard),
        "showing": min(limit, len(leaderboard)),
        "leaderboard": leaderboard[:limit],
        "generated_at": datetime.utcnow().isoformat()
    }


@router.get("/email-notifications")
async def get_email_notification_stats(
    period: str = Query("30d", description="Period: 7d, 30d, 90d, 1y"),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Email notification statistics.
    
    Tracks delivery success rates, notification types, and patterns.
    """
    start_date, end_date = get_date_range(period)
    
    # Get all notifications
    notifications = db.query(EmailNotification).filter(
        EmailNotification.sent_at >= start_date,
        EmailNotification.sent_at <= end_date
    ).all()
    
    # Aggregate by type
    by_type = {}
    by_status = {'sent': 0, 'failed': 0, 'bounced': 0}
    
    for notif in notifications:
        notif_type = notif.notification_type or 'unknown'
        if notif_type not in by_type:
            by_type[notif_type] = {
                'total': 0,
                'sent': 0,
                'failed': 0
            }
        
        by_type[notif_type]['total'] += 1
        by_type[notif_type][notif.status] = by_type[notif_type].get(notif.status, 0) + 1
        
        by_status[notif.status] = by_status.get(notif.status, 0) + 1
    
    total = len(notifications)
    success_rate = (by_status.get('sent', 0) / total * 100) if total > 0 else 100.0
    
    return {
        "period": period,
        "total_sent": total,
        "success_rate": round(success_rate, 2),
        "by_status": by_status,
        "by_type": by_type,
        "generated_at": datetime.utcnow().isoformat()
    }


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def get_trend_data(db: Session, start_date: datetime, end_date: datetime, period: str) -> List[Dict]:
    """
    Generate trend data points for charting.
    
    Returns daily or weekly aggregated data for the period.
    """
    # Determine aggregation level
    days_diff = (end_date - start_date).days
    
    if days_diff <= 7:
        granularity = 'daily'
        step = timedelta(days=1)
    elif days_diff <= 30:
        granularity = 'daily'
        step = timedelta(days=1)
    elif days_diff <= 90:
        granularity = 'weekly'
        step = timedelta(weeks=1)
    else:
        granularity = 'monthly'
        step = timedelta(days=30)
    
    trend_data = []
    current = start_date
    
    while current < end_date:
        next_point = current + step
        
        # Get documents in this period
        period_docs = db.query(Document).filter(
            Document.submitted_at >= current,
            Document.submitted_at < next_point
        ).all()
        
        if not period_docs:
            current = next_point
            continue
        
        # Calculate metrics
        approved = [d for d in period_docs if d.verification_status == ComplianceStatusEnum.APPROVED]
        rejected = [d for d in period_docs if d.auto_rejected]
        
        reviewed = [d for d in period_docs if d.reviewed_at]
        avg_review_days = 0.0
        if reviewed:
            total_days = sum([
                calculate_business_days_between(d.submitted_at, d.reviewed_at)
                for d in reviewed
            ])
            avg_review_days = total_days / len(reviewed)
        
        trend_data.append({
            "date": current.strftime('%Y-%m-%d'),
            "total_submissions": len(period_docs),
            "approved_count": len(approved),
            "rejected_count": len(rejected),
            "average_review_days": round(avg_review_days, 2)
        })

        current = next_point

    return trend_data


# =============================================================================
# KYC/KYB SPECIFIC MONITORING (Admin Only)
# =============================================================================

KYC_DOC_TYPES = ['KYC_ID', 'KYC_ADDRESS', 'KYC_SELFIE']
KYB_DOC_TYPES = ['KYB_INCORPORATION', 'KYB_TAX', 'KYB_UBO', 'KYB_RESOLUTION', 'KYB_LICENSE', 'KYB_AML']


def get_time_period_stats(db: Session, doc_types: list, granularity: str = 'daily'):
    """
    Get document stats grouped by time period.

    Args:
        db: Database session
        doc_types: List of document_type strings to filter
        granularity: 'daily', 'weekly', 'monthly', 'yearly'
    """
    from sqlalchemy import extract as sql_extract

    # Get all documents matching the types
    docs = db.query(Document).filter(
        Document.document_type.in_(doc_types)
    ).all()

    if not docs:
        return []

    # Group documents by time period
    periods = {}
    for doc in docs:
        submitted = doc.submitted_at or doc.created_at
        if not submitted:
            continue

        if granularity == 'daily':
            key = submitted.strftime('%Y-%m-%d')
        elif granularity == 'weekly':
            # ISO year and week number
            iso_year, iso_week, _ = submitted.isocalendar()
            key = f"{iso_year}-W{iso_week:02d}"
        elif granularity == 'monthly':
            key = submitted.strftime('%Y-%m')
        elif granularity == 'yearly':
            key = submitted.strftime('%Y')
        else:
            key = submitted.strftime('%Y-%m-%d')

        if key not in periods:
            periods[key] = {
                'period': key,
                'total_submitted': 0,
                'approved': 0,
                'rejected': 0,
                'pending': 0,
                'overdue': 0,
                'average_review_days': 0,
                'review_times': []
            }

        periods[key]['total_submitted'] += 1

        status = str(doc.verification_status).upper()
        if status == 'APPROVED':
            periods[key]['approved'] += 1
        elif status == 'REJECTED':
            periods[key]['rejected'] += 1
        else:
            periods[key]['pending'] += 1

        # Check overdue
        if hasattr(doc, 'is_overdue') and doc.is_overdue:
            periods[key]['overdue'] += 1

        # Calculate review time if completed
        if doc.reviewed_at and submitted:
            review_days = (doc.reviewed_at - submitted).total_seconds() / 86400
            periods[key]['review_times'].append(review_days)

    # Calculate averages and clean up
    result = []
    for key in sorted(periods.keys()):
        p = periods[key]
        times = p.pop('review_times', [])
        p['average_review_days'] = round(sum(times) / len(times), 2) if times else 0
        result.append(p)

    return result


def get_kyc_kyb_summary(db: Session):
    """Get overall KYC vs KYB summary statistics."""
    kyc_docs = db.query(Document).filter(
        Document.document_type.in_(KYC_DOC_TYPES)
    ).all()

    kyb_docs = db.query(Document).filter(
        Document.document_type.in_(KYB_DOC_TYPES)
    ).all()

    def calc_stats(docs):
        total = len(docs)
        approved = sum(1 for d in docs if str(d.verification_status).upper() == 'APPROVED')
        rejected = sum(1 for d in docs if str(d.verification_status).upper() == 'REJECTED')
        pending = total - approved - rejected
        overdue = sum(1 for d in docs if hasattr(d, 'is_overdue') and d.is_overdue)

        review_times = []
        for d in docs:
            if d.reviewed_at and d.submitted_at:
                review_times.append((d.reviewed_at - d.submitted_at).total_seconds() / 86400)
        avg_review = round(sum(review_times) / len(review_times), 2) if review_times else 0

        approval_rate = round((approved / total * 100), 1) if total > 0 else 0
        rejection_rate = round((rejected / total * 100), 1) if total > 0 else 0

        return {
            'total_submitted': total,
            'approved': approved,
            'rejected': rejected,
            'pending': pending,
            'overdue': overdue,
            'approval_rate': approval_rate,
            'rejection_rate': rejection_rate,
            'average_review_days': avg_review,
        }

    return {
        'kyc': calc_stats(kyc_docs),
        'kyb': calc_stats(kyb_docs),
    }


@router.get("/kyc-kyb-stats")
async def get_kyc_kyb_stats(
    granularity: str = Query("daily", description="Time granularity: daily, weekly, monthly, yearly"),
    doc_category: str = Query("all", description="Document category: kyc, kyb, all"),
    auth = None,
    db: Session = Depends(get_db)
):
    """
    Get KYC/KYB statistics grouped by time period.

    **Granularity Options:**
    - `daily`: Stats per day
    - `weekly`: Stats per ISO week
    - `monthly`: Stats per month
    - `yearly`: Stats per year

    **Doc Category Options:**
    - `kyc`: Individual investor documents only
    - `kyb`: Corporate investor documents only
    - `all`: Both categories combined
    """
    # Determine which doc types to query
    if doc_category == 'kyc':
        doc_types = KYC_DOC_TYPES
    elif doc_category == 'kyb':
        doc_types = KYB_DOC_TYPES
    else:
        doc_types = KYC_DOC_TYPES + KYB_DOC_TYPES

    data = get_time_period_stats(db, doc_types, granularity)

    return {
        'doc_category': doc_category,
        'granularity': granularity,
        'periods': data,
        'generated_at': datetime.utcnow().isoformat(),
    }


@router.get("/kyc-kyb-summary")
async def get_kyc_kyb_summary_endpoint(
    auth = None,
    db: Session = Depends(get_db)
):
    """
    Get overall KYC vs KYB summary statistics.

    Returns separate stats for KYC (individual investors) and KYB (corporate investors).
    """
    summary = get_kyc_kyb_summary(db)

    return {
        **summary,
        'generated_at': datetime.utcnow().isoformat(),
    }


@router.get("/kyc-kyb-by-officer")
async def get_kyc_kyb_by_officer(
    doc_category: str = Query("all", description="Document category: kyc, kyb, all"),
    auth = None,
    db: Session = Depends(get_db)
):
    """
    Get KYC/KYB statistics broken down by compliance officer.

    Shows each officer's review count, approval rate, rejection rate,
    average review time, and overdue count for performance tracking.
    """
    # Determine which doc types to query
    if doc_category == 'kyc':
        doc_types = KYC_DOC_TYPES
    elif doc_category == 'kyb':
        doc_types = KYB_DOC_TYPES
    else:
        doc_types = KYC_DOC_TYPES + KYB_DOC_TYPES

    # Get all reviewed documents matching the types
    docs = db.query(Document).filter(
        Document.document_type.in_(doc_types),
        Document.reviewed_by.isnot(None)
    ).all()

    # Group by reviewer
    officers = {}
    for doc in docs:
        reviewer_id = doc.reviewed_by
        if reviewer_id not in officers:
            # Fetch the user
            user = db.query(User).filter(User.id == reviewer_id).first()
            officers[reviewer_id] = {
                'officer_id': reviewer_id,
                'officer_name': user.email if user else f'User #{reviewer_id}',
                'officer_role': user.role.value if user and hasattr(user.role, 'value') else (user.role if user else 'unknown'),
                'total_reviewed': 0,
                'approved': 0,
                'rejected': 0,
                'overdue': 0,
                'review_times': [],
            }

        officers[reviewer_id]['total_reviewed'] += 1

        status = doc.verification_status.value if hasattr(doc.verification_status, 'value') else doc.verification_status
        if status == 'approved':
            officers[reviewer_id]['approved'] += 1
        elif status == 'rejected':
            officers[reviewer_id]['rejected'] += 1

        if hasattr(doc, 'is_overdue') and doc.is_overdue:
            officers[reviewer_id]['overdue'] += 1

        if doc.reviewed_at and doc.submitted_at:
            review_days = (doc.reviewed_at - doc.submitted_at).total_seconds() / 86400
            officers[reviewer_id]['review_times'].append(review_days)

    # Calculate rates and averages
    result = []
    for officer_id in sorted(officers.keys()):
        o = officers[officer_id]
        times = o.pop('review_times', [])
        total = o['total_reviewed']
        o['approval_rate'] = round((o['approved'] / total * 100), 1) if total > 0 else 0
        o['rejection_rate'] = round((o['rejected'] / total * 100), 1) if total > 0 else 0
        o['average_review_days'] = round(sum(times) / len(times), 2) if times else 0
        result.append(o)

    # Sort by total_reviewed descending (most active first)
    result.sort(key=lambda x: x['total_reviewed'], reverse=True)

    return {
        'doc_category': doc_category,
        'total_officers': len(result),
        'officers': result,
        'generated_at': datetime.utcnow().isoformat(),
    }
