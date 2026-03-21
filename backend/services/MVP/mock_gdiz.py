"""
Mock GDIZ Service - MVP Testnet

Simulates GDIZ (Grand Défi Industriel de Zinc) industrial gateway integration.
Interface compatible with production GDIZGateway.

@reference SRS v2.0 Section 5.3
@reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md Section 5.4

@notice MVP TESTNET: This is a testnet deployment. No real funds.
"""

from typing import Dict, List, Optional
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum
import uuid
import random


class AssetClass(Enum):
    """Supported asset classes"""
    MANUFACTURING = "MANUFACTURING"
    AGRICULTURE = "AGRICULTURE"
    MINING = "MINING"
    TRADE = "TRADE"
    SERVICES = "SERVICES"
    ENERGY = "ENERGY"
    REAL_ESTATE = "REAL_ESTATE"
    TECHNOLOGY = "TECHNOLOGY"


class CertificateStatus(Enum):
    """Certificate status enum"""
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"


class StockStatus(Enum):
    """Stock certification status"""
    CERTIFIED = "CERTIFIED"
    IN_WAREHOUSE = "IN_WAREHOUSE"
    SHIPPED = "SHIPPED"
    SOLD = "SOLD"


@dataclass
class IndustrialPartner:
    """Industrial partner data structure"""
    partner_id: str
    name: str
    asset_class: AssetClass
    jurisdiction: str
    kyc_status: str
    accreditation_status: str
    created_at: str
    is_active: bool
    gdiz_certified: bool


@dataclass
class StockCertificate:
    """Stock certificate data structure"""
    certificate_id: str
    partner_id: str
    asset_class: str
    description: str
    quantity: int
    unit: str
    value: int  # 18 decimals (UJEUR)
    warehouse_location: str
    certification_date: str
    expiry_date: str
    status: CertificateStatus
    stock_hash: str  # IPFS hash of stock documents
    verifier: str


@dataclass
class FinancingRequest:
    """Financing request from industrial partner"""
    request_id: str
    partner_id: str
    certificate_id: str
    amount: int  # 18 decimals
    duration_days: int
    interest_rate: int  # Basis points
    purpose: str
    status: str
    created_at: str


@dataclass
class YieldReport:
    """Yield report from industrial operations"""
    report_id: str
    partner_id: str
    financing_id: str
    period_start: str
    period_end: str
    revenue: int  # 18 decimals
    expenses: int  # 18 decimals
    net_yield: int  # 18 decimals
    yield_rate: float  # Percentage
    submitted_at: str


class IGDIZService:
    """
    Abstract interface for GDIZ services.
    
    Production implementation (GDIZGateway) must implement this interface.
    Mock implementation (MockGDIZService) used for testnet.
    """
    
    def register_partner(self, partner_data: Dict) -> str:
        """Register industrial partner"""
        raise NotImplementedError
    
    def certify_stock(self, certificate_data: Dict) -> str:
        """Certify stock/merchandise"""
        raise NotImplementedError
    
    def get_certificate(self, certificate_id: str) -> StockCertificate:
        """Get stock certificate details"""
        raise NotImplementedError
    
    def submit_financing_request(self, request_data: Dict) -> str:
        """Submit financing request"""
        raise NotImplementedError
    
    def submit_yield_report(self, report_data: Dict) -> str:
        """Submit yield report"""
        raise NotImplementedError
    
    def get_partner_details(self, partner_id: str) -> IndustrialPartner:
        """Get partner details"""
        raise NotImplementedError


class MockGDIZService(IGDIZService):
    """
    MVP Mock GDIZ Service
    
    Simulates GDIZ industrial gateway for testnet.
    Interface compatible with production GDIZGateway.
    
    Features:
    - Register industrial partners
    - Certify stock/merchandise (mock verification)
    - Submit financing requests
    - Generate mock yield reports
    - Track stock status
    """
    
    def __init__(self):
        """Initialize mock GDIZ service"""
        self.partners: Dict[str, IndustrialPartner] = {}
        self.certificates: Dict[str, StockCertificate] = {}
        self.financing_requests: Dict[str, FinancingRequest] = {}
        self.yield_reports: Dict[str, YieldReport] = {}
        
        # Create demo partners for testing
        self._create_demo_partners()
    
    def _create_demo_partners(self):
        """Create demo industrial partners for testing"""
        demo_partners = [
            {
                "partner_id": "GDIZ-DEMO-001",
                "name": "Zara Textiles Manufacturing (Demo)",
                "asset_class": AssetClass.MANUFACTURING,
                "jurisdiction": "MU",
                "kyc_status": "APPROVED_MVP",
                "accreditation_status": "ACCREDITED_MVP",
                "gdiz_certified": True
            },
            {
                "partner_id": "GDIZ-DEMO-002",
                "name": "Cocoa Cooperative Côte d'Ivoire (Demo)",
                "asset_class": AssetClass.AGRICULTURE,
                "jurisdiction": "CI",
                "kyc_status": "APPROVED_MVP",
                "accreditation_status": "ACCREDITED_MVP",
                "gdiz_certified": True
            },
            {
                "partner_id": "GDIZ-DEMO-003",
                "name": "Solar Energy Kenya (Demo)",
                "asset_class": AssetClass.ENERGY,
                "jurisdiction": "KE",
                "kyc_status": "APPROVED_MVP",
                "accreditation_status": "ACCREDITED_MVP",
                "gdiz_certified": True
            }
        ]
        
        for partner_data in demo_partners:
            partner = IndustrialPartner(
                partner_id=partner_data["partner_id"],
                name=partner_data["name"],
                asset_class=partner_data["asset_class"],
                jurisdiction=partner_data["jurisdiction"],
                kyc_status=partner_data["kyc_status"],
                accreditation_status=partner_data["accreditation_status"],
                created_at=datetime.utcnow().isoformat(),
                is_active=True,
                gdiz_certified=partner_data["gdiz_certified"]
            )
            self.partners[partner_data["partner_id"]] = partner
    
    def register_partner(self, partner_data: Dict) -> str:
        """
        Register industrial partner.
        
        Args:
            partner_data: Dictionary with partner information
                - name: Partner name
                - asset_class: Asset class (MANUFACTURING, AGRICULTURE, etc.)
                - jurisdiction: ISO country code
                - kyc_status: KYC status
                - accreditation_status: Accreditation status
                
        Returns:
            Partner ID in format: GDIZ-{uuid}
        """
        partner_id = f"GDIZ-{uuid.uuid4().hex[:8].upper()}"
        
        asset_class = partner_data.get("asset_class", "MANUFACTURING")
        if isinstance(asset_class, str):
            asset_class = AssetClass[asset_class]
        
        partner = IndustrialPartner(
            partner_id=partner_id,
            name=partner_data.get("name", f"Industrial Partner {partner_id}"),
            asset_class=asset_class,
            jurisdiction=partner_data.get("jurisdiction", "MU"),
            kyc_status=partner_data.get("kyc_status", "PENDING_MVP"),
            accreditation_status=partner_data.get(
                "accreditation_status", "PENDING_MVP"
            ),
            created_at=datetime.utcnow().isoformat(),
            is_active=True,
            gdiz_certified=False
        )
        
        self.partners[partner_id] = partner
        
        return partner_id
    
    def certify_stock(self, certificate_data: Dict) -> str:
        """
        Certify stock/merchandise (mock verification).
        
        Args:
            certificate_data: Dictionary with stock information
                - partner_id: Industrial partner ID
                - asset_class: Asset class
                - description: Stock description
                - quantity: Quantity
                - unit: Unit of measure
                - value: Value in UJEUR (18 decimals)
                - warehouse_location: Warehouse location
                - stock_hash: IPFS hash of documents
                
        Returns:
            Certificate ID in format: CERT-{uuid}
        """
        certificate_id = f"CERT-{uuid.uuid4().hex[:8].upper()}"
        
        partner_id = certificate_data.get("partner_id")
        if partner_id and partner_id not in self.partners:
            raise ValueError(f"Partner not found: {partner_id}")
        
        # Generate mock certification dates
        now = datetime.utcnow()
        certification_date = now.isoformat()
        expiry_date = datetime(
            now.year + 1, now.month, now.day
        ).isoformat()
        
        certificate = StockCertificate(
            certificate_id=certificate_id,
            partner_id=partner_id or "UNKNOWN",
            asset_class=certificate_data.get("asset_class", "GENERAL"),
            description=certificate_data.get(
                "description", "Certified merchandise"
            ),
            quantity=certificate_data.get("quantity", 1000),
            unit=certificate_data.get("unit", "units"),
            value=certificate_data.get("value", 1_000_000 * 10**18),
            warehouse_location=certificate_data.get(
                "warehouse_location", "GDIZ Warehouse A, Lomé"
            ),
            certification_date=certification_date,
            expiry_date=expiry_date,
            status=CertificateStatus.VERIFIED,
            stock_hash=certificate_data.get(
                "stock_hash", 
                f"Qm{uuid.uuid4().hex[:40]}"  # Mock IPFS hash
            ),
            verifier="Mock GDIZ Verifier (MVP Testnet)"
        )
        
        self.certificates[certificate_id] = certificate
        
        # Update partner certification status
        if partner_id and partner_id in self.partners:
            self.partners[partner_id].gdiz_certified = True
        
        return certificate_id
    
    def get_certificate(self, certificate_id: str) -> StockCertificate:
        """
        Get stock certificate details.
        
        Args:
            certificate_id: Certificate ID
            
        Returns:
            StockCertificate object
            
        Raises:
            ValueError: If certificate not found
        """
        if certificate_id not in self.certificates:
            raise ValueError(f"Certificate not found: {certificate_id}")
        
        return self.certificates[certificate_id]
    
    def submit_financing_request(self, request_data: Dict) -> str:
        """
        Submit financing request from industrial partner.
        
        Args:
            request_data: Dictionary with financing information
                - partner_id: Industrial partner ID
                - certificate_id: Stock certificate ID (collateral)
                - amount: Requested amount in UJEUR (18 decimals)
                - duration_days: Financing duration
                - interest_rate: Interest rate (basis points)
                - purpose: Purpose of financing
                
        Returns:
            Request ID in format: FIN-REQ-{uuid}
        """
        request_id = f"FIN-REQ-{uuid.uuid4().hex[:8].upper()}"
        
        partner_id = request_data.get("partner_id")
        if partner_id and partner_id not in self.partners:
            raise ValueError(f"Partner not found: {partner_id}")
        
        request = FinancingRequest(
            request_id=request_id,
            partner_id=partner_id or "UNKNOWN",
            certificate_id=request_data.get("certificate_id", ""),
            amount=request_data.get("amount", 1_000_000 * 10**18),
            duration_days=request_data.get("duration_days", 365),
            interest_rate=request_data.get("interest_rate", 1000),  # 10%
            purpose=request_data.get("purpose", "Working capital"),
            status="PENDING_MVP",
            created_at=datetime.utcnow().isoformat()
        )
        
        self.financing_requests[request_id] = request
        
        return request_id
    
    def submit_yield_report(self, report_data: Dict) -> str:
        """
        Submit yield report from industrial operations.
        
        Args:
            report_data: Dictionary with yield information
                - partner_id: Industrial partner ID
                - financing_id: Financing ID
                - period_start: Period start date
                - period_end: Period end date
                - revenue: Revenue in UJEUR (18 decimals)
                - expenses: Expenses in UJEUR (18 decimals)
                
        Returns:
            Report ID in format: YIELD-RPT-{uuid}
        """
        report_id = f"YIELD-RPT-{uuid.uuid4().hex[:8].upper()}"
        
        partner_id = report_data.get("partner_id")
        revenue = report_data.get("revenue", 0)
        expenses = report_data.get("expenses", 0)
        net_yield = revenue - expenses
        
        # Calculate yield rate (simplified)
        principal = report_data.get("principal", 1_000_000 * 10**18)
        yield_rate = (net_yield / principal) * 100 if principal > 0 else 0
        
        report = YieldReport(
            report_id=report_id,
            partner_id=partner_id or "UNKNOWN",
            financing_id=report_data.get("financing_id", ""),
            period_start=report_data.get(
                "period_start", datetime.utcnow().isoformat()
            ),
            period_end=report_data.get(
                "period_end", datetime.utcnow().isoformat()
            ),
            revenue=revenue,
            expenses=expenses,
            net_yield=net_yield,
            yield_rate=yield_rate,
            submitted_at=datetime.utcnow().isoformat()
        )
        
        self.yield_reports[report_id] = report
        
        return report_id
    
    def get_partner_details(self, partner_id: str) -> IndustrialPartner:
        """
        Get partner details.
        
        Args:
            partner_id: Partner ID
            
        Returns:
            IndustrialPartner object
            
        Raises:
            ValueError: If partner not found
        """
        if partner_id not in self.partners:
            raise ValueError(f"Partner not found: {partner_id}")
        
        return self.partners[partner_id]
    
    def get_partner_certificates(self, partner_id: str) -> List[StockCertificate]:
        """
        Get all certificates for a partner.
        
        Args:
            partner_id: Partner ID
            
        Returns:
            List of StockCertificate objects
        """
        return [
            cert for cert in self.certificates.values()
            if cert.partner_id == partner_id
        ]
    
    def get_partner_financing_requests(
        self,
        partner_id: str
    ) -> List[FinancingRequest]:
        """
        Get all financing requests for a partner.
        
        Args:
            partner_id: Partner ID
            
        Returns:
            List of FinancingRequest objects
        """
        return [
            req for req in self.financing_requests.values()
            if req.partner_id == partner_id
        ]
    
    def generate_mock_yield_report(
        self,
        partner_id: str,
        financing_id: str,
        principal: int,
        days: int = 30
    ) -> YieldReport:
        """
        Generate mock yield report for demo purposes.
        
        Args:
            partner_id: Partner ID
            financing_id: Financing ID
            principal: Principal amount (18 decimals)
            days: Number of days for yield calculation
            
        Returns:
            Generated YieldReport object
        """
        # Generate realistic yield (8-15% APY range)
        base_apy = random.uniform(0.08, 0.15)
        daily_yield = base_apy / 365
        period_yield = daily_yield * days
        
        net_yield = int(principal * period_yield)
        revenue = net_yield + int(principal * 0.02)  # 2% expenses ratio
        expenses = revenue - net_yield
        
        now = datetime.utcnow()
        period_start = datetime(
            now.year, now.month, 1
        ).isoformat()
        period_end = now.isoformat()
        
        report = YieldReport(
            report_id=f"YIELD-RPT-{uuid.uuid4().hex[:8].upper()}",
            partner_id=partner_id,
            financing_id=financing_id,
            period_start=period_start,
            period_end=period_end,
            revenue=revenue,
            expenses=expenses,
            net_yield=net_yield,
            yield_rate=(net_yield / principal) * 100 if principal > 0 else 0,
            submitted_at=now.isoformat()
        )
        
        self.yield_reports[report.report_id] = report
        
        return report
    
    def get_stats(self) -> Dict:
        """
        Get GDIZ service statistics.
        
        Returns:
            Dictionary with statistics
        """
        return {
            "total_partners": len(self.partners),
            "total_certificates": len(self.certificates),
            "total_financing_requests": len(self.financing_requests),
            "total_yield_reports": len(self.yield_reports),
            "service_name": "Mock GDIZ Service (MVP Testnet)",
            "is_testnet": True
        }


# =============================================================================
# FACTORY PATTERN: SERVICE SELECTION
# =============================================================================

def get_gdiz_service() -> IGDIZService:
    """
    Factory function to get appropriate GDIZ service.
    
    MVP: Returns MockGDIZService
    Production: Returns GDIZGateway (when implemented)
    
    Usage:
        gdiz_service = get_gdiz_service()
        partner_id = gdiz_service.register_partner(partner_data)
    
    Returns:
        IGDIZService implementation
    """
    from config.MVP_config import mvp_config
    
    if mvp_config.MVP_TESTNET and mvp_config.MOCK_GDIZ:
        return MockGDIZService()
    else:
        # Production: from industrial.gdiz_gateway import GDIZGateway
        # return GDIZGateway()
        raise NotImplementedError(
            "Production GDIZ service not yet implemented. "
            "Use MVP_TESTNET mode for MockGDIZService."
        )


# =============================================================================
# TESTNET UTILITIES
# =============================================================================

def create_demo_financing_request(
    partner_id: str,
    certificate_id: str,
    amount: int = 2_000_000 * 10**18,
    duration_days: int = 365,
    interest_rate: int = 1000
) -> str:
    """
    Create demo financing request.
    
    Args:
        partner_id: Partner ID
        certificate_id: Certificate ID (collateral)
        amount: Requested amount (18 decimals, default 2M UJEUR)
        duration_days: Duration in days (default 365)
        interest_rate: Interest rate in basis points (default 10%)
        
    Returns:
        Request ID
    """
    gdiz_service = get_gdiz_service()
    
    request_data = {
        "partner_id": partner_id,
        "certificate_id": certificate_id,
        "amount": amount,
        "duration_days": duration_days,
        "interest_rate": interest_rate,
        "purpose": "Working capital financing"
    }
    
    return gdiz_service.submit_financing_request(request_data)
