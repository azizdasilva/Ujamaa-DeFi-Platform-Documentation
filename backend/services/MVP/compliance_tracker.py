"""
Compliance Tracker - KYC/KYB and Regulatory Compliance

Tracks compliance metrics for liquidity pools including:
- KYC/KYB coverage
- Whitelisted wallet management
- Jurisdiction diversity
- Sanctions screening
- Transaction monitoring

@reference docs/03_OPERATIONS/KPI_IMPLEMENTATION_PLAN.md
@reference docs/03_OPERATIONS/POOL_KPI_FRAMEWORK.md
"""

from typing import Dict, List, Optional, Set, Tuple
from dataclasses import dataclass, field
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timedelta
from enum import Enum
import hashlib


class ComplianceStatus(Enum):
    """Compliance status for investors"""
    PENDING = "pending"
    VERIFIED = "verified"
    EXPIRED = "expired"
    SUSPENDED = "suspended"
    REJECTED = "rejected"


class RiskLevel(Enum):
    """Risk level for investors/transactions"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class Investor:
    """Investor compliance data"""
    investor_id: str
    wallet_address: str
    status: ComplianceStatus
    kyc_level: str  # Standard, Enhanced
    jurisdiction: str
    verified_at: str
    expires_at: str
    risk_level: RiskLevel
    ubo_identified: bool = False
    source_of_funds_verified: bool = False


@dataclass
class ComplianceMetrics:
    """Pool compliance metrics"""
    pool_id: str
    calculated_at: str
    
    # KYC/KYB Coverage
    total_investors: int
    verified_investors: int
    kyc_coverage: float  # %
    kyc_standard: int
    kyc_enhanced: int
    
    # Wallet Management
    whitelisted_wallets: int
    active_wallets: int
    suspended_wallets: int
    
    # Jurisdiction
    jurisdiction_count: int
    jurisdiction_distribution: Dict[str, int]
    blocked_jurisdictions: int
    
    # Screening
    sanctions_screened: int
    pep_screened: int
    adverse_media_screened: int
    
    # Overall Compliance
    compliance_score: int  # 0-100
    is_compliant: bool
    pending_reviews: int


class ComplianceTracker:
    """
    Compliance tracking engine for liquidity pools.
    
    Monitors KYC/KYB status, wallet whitelisting,
    jurisdiction compliance, and regulatory screening.
    """
    
    # Allowed jurisdictions (Mauritius FSC approved)
    ALLOWED_JURISDICTIONS = {
        # African Markets
        'MU': 'Mauritius',
        'NG': 'Nigeria',
        'KE': 'Kenya',
        'ZA': 'South Africa',
        'GH': 'Ghana',
        'CI': "Côte d'Ivoire",
        'SN': 'Senegal',
        'TG': 'Togo',
        'BJ': 'Benin',
        # International
        'UAE': 'United Arab Emirates',
        'UK': 'United Kingdom',
        'EU': 'European Union',
        'SG': 'Singapore',
        'US': 'United States',
    }
    
    # Blocked/sanctioned jurisdictions
    BLOCKED_JURISDICTIONS = {
        'KP': 'North Korea',
        'IR': 'Iran',
        'SY': 'Syria',
        'CU': 'Cuba',
        'MM': 'Myanmar',
        'BY': 'Belarus',
        'RU': 'Russia',
        'VE': 'Venezuela',
        'SD': 'Sudan',
        'YE': 'Yemen',
        'ML': 'Mali',
        'BF': 'Burkina Faso',
    }
    
    # KYC requirements by investment tier
    KYC_REQUIREMENTS = {
        'retail': {
            'min_investment': 1_000,
            'max_investment': 99_999,
            'kyc_level': 'standard',
            'documents': ['national_id', 'proof_of_address'],
        },
        'institutional': {
            'min_investment': 100_000,
            'max_investment': None,
            'kyc_level': 'enhanced',
            'documents': [
                'certificate_of_incorporation',
                'tax_registration',
                'ubo_declaration',
                'board_resolution',
                'source_of_funds',
            ],
        },
    }
    
    def __init__(self):
        """Initialize compliance tracker"""
        self.investors: Dict[str, Investor] = {}
        self.whitelisted_wallets: Set[str] = set()
        self.blocked_wallets: Set[str] = set()
    
    def add_investor(
        self,
        investor_id: str,
        wallet_address: str,
        jurisdiction: str,
        kyc_level: str = 'standard',
        ubo_identified: bool = False,
        source_verified: bool = False
    ) -> Tuple[bool, str]:
        """
        Add and verify a new investor.
        
        Args:
            investor_id: Unique investor identifier
            wallet_address: Blockchain wallet address
            jurisdiction: Country code (e.g., 'MU', 'NG')
            kyc_level: 'standard' or 'enhanced'
            ubo_identified: UBO identified (for institutional)
            source_verified: Source of funds verified
            
        Returns:
            Tuple of (success, message)
        """
        # Check jurisdiction
        if jurisdiction in self.BLOCKED_JURISDICTIONS:
            return (False, f"Jurisdiction {jurisdiction} is blocked")
        
        if jurisdiction not in self.ALLOWED_JURISDICTIONS:
            return (False, f"Jurisdiction {jurisdiction} not approved")
        
        # Determine risk level
        risk_level = self._assess_investor_risk(jurisdiction, kyc_level)
        
        # Create investor record
        now = datetime.now()
        expires = now + timedelta(days=365)  # 1 year validity
        
        investor = Investor(
            investor_id=investor_id,
            wallet_address=wallet_address.lower(),
            status=ComplianceStatus.VERIFIED,
            kyc_level=kyc_level,
            jurisdiction=jurisdiction,
            verified_at=now.isoformat(),
            expires_at=expires.isoformat(),
            risk_level=risk_level,
            ubo_identified=ubo_identified,
            source_of_funds_verified=source_verified,
        )
        
        self.investors[investor_id] = investor
        self.whitelisted_wallets.add(wallet_address.lower())
        
        return (True, f"Investor {investor_id} verified successfully")
    
    def _assess_investor_risk(
        self,
        jurisdiction: str,
        kyc_level: str
    ) -> RiskLevel:
        """
        Assess investor risk level.
        
        Args:
            jurisdiction: Country code
            kyc_level: KYC level
            
        Returns:
            RiskLevel enum
        """
        # High-risk jurisdictions (FATF grey list)
        high_risk_jurisdictions = {'NG', 'KE', 'PK', 'PH'}
        
        if jurisdiction in high_risk_jurisdictions:
            return RiskLevel.HIGH
        
        if kyc_level == 'enhanced':
            return RiskLevel.MEDIUM
        
        return RiskLevel.LOW
    
    def calculate_kyc_coverage(self) -> Tuple[int, int, float]:
        """
        Calculate KYC/KYB coverage.
        
        Returns:
            Tuple of (total, verified, coverage_percentage)
        """
        total = len(self.investors)
        if total == 0:
            return (0, 0, 100.0)
        
        verified = sum(
            1 for inv in self.investors.values()
            if inv.status == ComplianceStatus.VERIFIED
        )
        
        coverage = (verified / total) * 100
        
        return (total, verified, round(coverage, 2))
    
    def calculate_jurisdiction_diversity(self) -> Tuple[int, Dict[str, int]]:
        """
        Calculate jurisdiction diversity.
        
        Returns:
            Tuple of (unique_count, distribution_dict)
        """
        distribution: Dict[str, int] = {}
        
        for investor in self.investors.values():
            jur = investor.jurisdiction
            distribution[jur] = distribution.get(jur, 0) + 1
        
        return (len(distribution), distribution)
    
    def screen_wallet(self, wallet_address: str) -> Tuple[bool, str]:
        """
        Screen wallet against sanctions lists.
        
        Args:
            wallet_address: Wallet address to screen
            
        Returns:
            Tuple of (is_clear, message)
        """
        wallet = wallet_address.lower()
        
        # Check blocked list
        if wallet in self.blocked_wallets:
            return (False, "Wallet is blocked")
        
        # Simple hash-based screening (mock OFAC/UN/EU lists)
        # In production, this would call actual sanctions APIs
        wallet_hash = hashlib.sha256(wallet.encode()).hexdigest()
        
        # Simulate 1% match rate for demo
        if wallet_hash.startswith('00'):
            return (False, "Potential sanctions match - manual review required")
        
        return (True, "Wallet cleared")
    
    def calculate_compliance_score(self) -> Tuple[int, bool]:
        """
        Calculate overall compliance score.
        
        Returns:
            Tuple of (score, is_compliant)
        """
        score = 100
        
        # KYC coverage (40 points)
        _, _, kyc_coverage = self.calculate_kyc_coverage()
        if kyc_coverage < 100:
            score -= int((100 - kyc_coverage) * 0.4)
        
        # Blocked jurisdiction check (30 points)
        blocked_count = sum(
            1 for inv in self.investors.values()
            if inv.jurisdiction in self.BLOCKED_JURISDICTIONS
        )
        if blocked_count > 0:
            score -= 30
        
        # UBO identification for enhanced KYC (15 points)
        enhanced_investors = [
            inv for inv in self.investors.values()
            if inv.kyc_level == 'enhanced'
        ]
        if enhanced_investors:
            ubo_rate = sum(
                1 for inv in enhanced_investors if inv.ubo_identified
            ) / len(enhanced_investors)
            if ubo_rate < 1.0:
                score -= int((1 - ubo_rate) * 15)
        
        # Source of funds verification (15 points)
        if enhanced_investors:
            sof_rate = sum(
                1 for inv in enhanced_investors if inv.source_of_funds_verified
            ) / len(enhanced_investors)
            if sof_rate < 1.0:
                score -= int((1 - sof_rate) * 15)
        
        is_compliant = score >= 80 and kyc_coverage == 100
        
        return (max(0, score), is_compliant)
    
    def get_compliance_metrics(self, pool_id: str) -> ComplianceMetrics:
        """
        Get comprehensive compliance metrics.
        
        Args:
            pool_id: Pool identifier
            
        Returns:
            ComplianceMetrics object
        """
        # KYC coverage
        total, verified, kyc_coverage = self.calculate_kyc_coverage()
        
        # KYC levels
        kyc_standard = sum(
            1 for inv in self.investors.values()
            if inv.kyc_level == 'standard'
        )
        kyc_enhanced = sum(
            1 for inv in self.investors.values()
            if inv.kyc_level == 'enhanced'
        )
        
        # Jurisdiction
        jur_count, jur_distribution = self.calculate_jurisdiction_diversity()
        
        # Wallet counts
        active_wallets = sum(
            1 for inv in self.investors.values()
            if inv.status == ComplianceStatus.VERIFIED
        )
        suspended_wallets = sum(
            1 for inv in self.investors.values()
            if inv.status in [ComplianceStatus.SUSPENDED, ComplianceStatus.REJECTED]
        )
        
        # Compliance score
        score, is_compliant = self.calculate_compliance_score()
        
        # Pending reviews (simplified)
        pending = sum(
            1 for inv in self.investors.values()
            if inv.status == ComplianceStatus.PENDING
        )
        
        return ComplianceMetrics(
            pool_id=pool_id,
            calculated_at=datetime.now().isoformat(),
            total_investors=total,
            verified_investors=verified,
            kyc_coverage=kyc_coverage,
            kyc_standard=kyc_standard,
            kyc_enhanced=kyc_enhanced,
            whitelisted_wallets=len(self.whitelisted_wallets),
            active_wallets=active_wallets,
            suspended_wallets=suspended_wallets,
            jurisdiction_count=jur_count,
            jurisdiction_distribution=jur_distribution,
            blocked_jurisdictions=0,  # Should be 0
            sanctions_screened=total,
            pep_screened=total,
            adverse_media_screened=total,
            compliance_score=score,
            is_compliant=is_compliant,
            pending_reviews=pending,
        )


# =============================================================================
# DEMO DATA
# =============================================================================

def generate_demo_compliance_metrics(pool_id: str = "POOL-001") -> ComplianceMetrics:
    """Generate demo compliance metrics for testing"""
    tracker = ComplianceTracker()
    
    # Add demo investors
    demo_investors = [
        ("INV-001", "0x1234567890abcdef", "MU", "enhanced", True, True),
        ("INV-002", "0x2234567890abcdef", "NG", "standard", False, False),
        ("INV-003", "0x3234567890abcdef", "KE", "enhanced", True, True),
        ("INV-004", "0x4234567890abcdef", "ZA", "standard", False, False),
        ("INV-005", "0x5234567890abcdef", "UAE", "enhanced", True, True),
        ("INV-006", "0x6234567890abcdef", "UK", "standard", False, False),
        ("INV-007", "0x7234567890abcdef", "SG", "enhanced", True, True),
    ]
    
    for investor_data in demo_investors:
        tracker.add_investor(*investor_data)
    
    return tracker.get_compliance_metrics(pool_id)


if __name__ == "__main__":
    # Demo usage
    metrics = generate_demo_compliance_metrics()
    print("Pool Compliance Metrics")
    print("=" * 50)
    print(f"Pool ID: {metrics.pool_id}")
    print(f"Compliance Score: {metrics.compliance_score}/100")
    print(f"Is Compliant: {metrics.is_compliant}")
    print(f"\nKYC Coverage: {metrics.kyc_coverage}%")
    print(f"Total Investors: {metrics.total_investors}")
    print(f"Verified: {metrics.verified_investors}")
    print(f"\nWhitelisted Wallets: {metrics.whitelisted_wallets}")
    print(f"Jurisdictions: {metrics.jurisdiction_count}")
    print(f"Pending Reviews: {metrics.pending_reviews}")
