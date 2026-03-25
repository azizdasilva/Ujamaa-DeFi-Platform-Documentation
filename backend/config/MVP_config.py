"""
MVP Configuration - Testnet Release

This configuration module controls all MVP testnet behavior.
All features are labeled as testnet-only with no real funds.

@reference SRS v2.0 Section 4.3
@reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md Section 3.3
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional
from enum import Enum


class PoolFamily(Enum):
    """5 Pool Families as per SRS v2.0 Section 5.12"""
    POOL_INDUSTRIE = "POOL_INDUSTRIE"
    POOL_AGRICULTURE = "POOL_AGRICULTURE"
    POOL_TRADE_FINANCE = "POOL_TRADE_FINANCE"
    POOL_RENEWABLE_ENERGY = "POOL_RENEWABLE_ENERGY"
    POOL_REAL_ESTATE = "POOL_REAL_ESTATE"


@dataclass
class PoolConfig:
    """Configuration for a single pool family"""
    id: str
    name: str
    asset_classes: List[str]
    target_yield_min: float  # % APY
    target_yield_max: float  # % APY
    lockup_days: int
    max_per_industrial: float = 20.0  # % of pool
    max_per_asset_class: float = 40.0  # % of pool


@dataclass
class Jurisdiction:
    """Jurisdiction with compliance status"""
    code: str
    name: str
    reason: Optional[str] = None


@dataclass
class MVPConfig:
    """
    MVP Configuration Object
    
    All settings for testnet deployment.
    Production swap via factory pattern - no code changes needed.
    """
    
    # =========================================================================
    # MVP MODE FLAGS
    # =========================================================================
    
    IS_MVP: bool = True
    """MVP Mode Flag - enables MVP-specific behavior"""
    
    MVP_TESTNET: bool = True
    """Testnet mode - no real funds"""
    
    # =========================================================================
    # NETWORK CONFIGURATION
    # =========================================================================
    
    NETWORK_NAME: str = "polygon-amoy"
    """Polygon Amoy Testnet"""
    
    CHAIN_ID: int = 80002
    """Polygon Amoy Chain ID"""
    
    RPC_URL: str = "https://rpc-amoy.polygon.technology/"
    """RPC endpoint for Polygon Amoy"""
    
    BLOCK_EXPLORER: str = "https://amoy.polygonscan.com/"
    """Block explorer for transaction verification"""
    
    NATIVE_TOKEN: str = "MATIC"
    """Native token for gas fees"""
    
    # =========================================================================
    # MOCK SERVICE FLAGS
    # =========================================================================
    
    MOCK_BANK: bool = True
    """Use MockBankService vs BIICBankService"""
    
    MOCK_ESCROW: bool = True
    """Use MockEscrow.sol vs Real Bank Escrow"""
    
    MOCK_GDIZ: bool = True
    """Use MockGDIZService vs GDIZGateway"""
    
    MOCK_FIAT_RAMP: bool = True
    """Use MockFiatRamp.sol vs Real Fiat Rails"""
    
    MOCK_KYB: bool = True
    """Use Mock KYB vs Real KYB Provider"""
    
    # =========================================================================
    # SMART CONTRACT ADDRESSES
    # =========================================================================
    
    CONTRACT_UPT_TOKEN: Optional[str] = None
    """UPTToken contract address (set post-deployment)"""
    
    CONTRACT_LIQUIDITY_POOL: Optional[str] = None
    """LiquidityPool contract address"""
    
    CONTRACT_MOCK_ESCROW: Optional[str] = None
    """MockEscrow contract address"""
    
    CONTRACT_MOCK_FIAT_RAMP: Optional[str] = None
    """MockFiatRamp contract address"""
    
    CONTRACT_JURISDICTION_COMPLIANCE: Optional[str] = None
    """JurisdictionCompliance contract address"""
    
    # =========================================================================
    # INVESTMENT LIMITS (Testnet)
    # =========================================================================
    
    MAX_DEPOSIT: int = 1_000_000 * 10 ** 18  # 1M UJEUR (18 decimals)
    """Maximum deposit per transaction"""
    
    MIN_DEPOSIT: int = 1_000 * 10 ** 18  # 1K UJEUR
    """Minimum deposit per transaction"""
    
    DAILY_WITHDRAWAL_LIMIT: int = 500_000 * 10 ** 18  # 500K UJEUR
    """Maximum daily withdrawal"""
    
    INSTITUTIONAL_MIN: int = 100_000 * 10 ** 18  # 100K UJEUR
    """Minimum for institutional investors (KYB threshold)"""

    RETAIL_MAX: int = 99_999 * 10 ** 18  # 99,999 UJEUR
    """Maximum for retail investors"""
    
    # =========================================================================
    # POOL CONFIGURATIONS
    # =========================================================================
    
    POOLS: Dict[str, PoolConfig] = field(default_factory=lambda: {
        "POOL_INDUSTRIE": PoolConfig(
            id="POOL_INDUSTRIE",
            name="Pool Industrie",
            asset_classes=["Manufacturing", "GDIZ Partners", "Production Facilities"],
            target_yield_min=10.0,
            target_yield_max=12.0,
            lockup_days=365,
        ),
        "POOL_AGRICULTURE": PoolConfig(
            id="POOL_AGRICULTURE",
            name="Pool Agriculture",
            asset_classes=["Coffee", "Cocoa", "Cotton", "Cashews", "Food Crops"],
            target_yield_min=12.0,
            target_yield_max=15.0,
            lockup_days=180,
        ),
        "POOL_TRADE_FINANCE": PoolConfig(
            id="POOL_TRADE_FINANCE",
            name="Pool Trade Finance",
            asset_classes=["Invoice Tokenization", "Receivables", "Commercial Paper"],
            target_yield_min=8.0,
            target_yield_max=10.0,
            lockup_days=90,
        ),
        "POOL_RENEWABLE_ENERGY": PoolConfig(
            id="POOL_RENEWABLE_ENERGY",
            name="Pool Renewable Energy",
            asset_classes=["Solar", "Wind", "Hydroelectric"],
            target_yield_min=9.0,
            target_yield_max=11.0,
            lockup_days=730,
        ),
        "POOL_REAL_ESTATE": PoolConfig(
            id="POOL_REAL_ESTATE",
            name="Pool Real Estate",
            asset_classes=[
                "Commercial Office", "Retail Space", "Industrial/Warehouse",
                "Residential Apartments", "Mixed-Use", "Hospitality", "Land Bank"
            ],
            target_yield_min=8.0,
            target_yield_max=12.0,
            lockup_days=1095,
        ),
    })
    
    # =========================================================================
    # FX CONFIGURATION
    # =========================================================================
    
    UJEUR_EUR_PARITY: float = 1.0
    """1 UJEUR = €1.00 (fixed parity)"""
    
    EUR_FCFA_RATE: float = 655.957
    """1 EUR = 655.957 XOF (fixed CFA peg)"""
    
    FX_FEE_INVESTMENT: float = 0.02  # 2%
    """FX fee on EUR→UJEUR→FCFA conversion"""
    
    FX_FEE_REPAYMENT: float = 0.02  # 2%
    """FX fee on FCFA→UJEUR→EUR conversion"""
    
    # =========================================================================
    # YIELD CONFIGURATION
    # =========================================================================
    
    YIELD_MANAGEMENT_FEE: float = 0.02  # 2% annual
    """Annual management fee"""
    
    YIELD_PERFORMANCE_FEE: float = 0.20  # 20%
    """Performance fee on yield above hurdle"""
    
    YIELD_HURDLE_RATE: float = 0.05  # 5%
    """Minimum return before performance fee applies"""
    
    YIELD_ACCRUAL_FREQUENCY: str = "daily"
    """Yield accrual frequency"""
    
    # =========================================================================
    # COMPLIANCE CONFIGURATION
    # =========================================================================
    
    BLOCKED_JURISDICTIONS: List[Jurisdiction] = field(default_factory=lambda: [
        Jurisdiction("KP", "North Korea", "OFAC, UN, EU sanctions"),
        Jurisdiction("IR", "Iran", "OFAC, UN, EU sanctions"),
        Jurisdiction("SY", "Syria", "OFAC, UN, EU sanctions"),
        Jurisdiction("CU", "Cuba", "OFAC sanctions"),
        Jurisdiction("MM", "Myanmar", "OFAC, EU sanctions"),
        Jurisdiction("BY", "Belarus", "OFAC, EU sanctions"),
        Jurisdiction("RU", "Russia", "OFAC, EU sanctions"),
        Jurisdiction("VE", "Venezuela", "OFAC sanctions"),
        Jurisdiction("SD", "Sudan", "OFAC sanctions"),
        Jurisdiction("YE", "Yemen", "UN arms embargo"),
        Jurisdiction("ML", "Mali", "FATF High-Risk"),
        Jurisdiction("BF", "Burkina Faso", "FATF High-Risk"),
    ])
    """12 Blocked jurisdictions (strictest list: OFAC + UN + EU + FATF)"""
    
    ALLOWED_AFRICAN_MARKETS: List[str] = field(default_factory=lambda: [
        "NG", "KE", "ZA", "GH", "MU", "CI", "SN", "TG", "BJ"
    ])
    """Allowed African markets"""
    
    ALLOWED_INTERNATIONAL: List[str] = field(default_factory=lambda: [
        "EU", "UK", "UAE", "SG", "US"
    ])
    """Allowed international jurisdictions"""
    
    KYB_THRESHOLD_EUR: int = 100_000
    """€100K investment threshold triggers enhanced KYB"""
    
    # =========================================================================
    # DISCLAIMER TEXT
    # =========================================================================
    
    DISCLAIMER_HEADER: str = "🚀 MVP: Institutional Architecture - Testnet Release"
    """Header disclaimer for all pages"""
    
    DISCLAIMER_FOOTER: str = "This is a testnet deployment. No real funds are handled."
    """Footer disclaimer"""
    
    DISCLAIMER_MODAL: str = """
⚠️ TESTNET DISCLAIMER

This is the Ujamaa DeFi Platform MVP running on Polygon Amoy testnet.

• NO REAL MONEY is involved
• All tokens are TEST TOKENS only
• All bank integrations are SIMULATED
• All yields are SIMULATED using real math

This is for demonstration and testing purposes only.

Production deployment will use:
• Real UJEUR stablecoin (Circle)
• Real bank escrow (BIIC/MCB)
• Real fiat on/off ramps
• Mainnet Polygon (Chain ID: 137)
"""
    
    # =========================================================================
    # FEATURE FLAGS
    # =========================================================================
    
    FEATURE_P0_CORE: bool = True
    """Core investment flows (P0)"""
    
    FEATURE_P1_ENHANCEMENTS: bool = True
    """Deep Dive, Investors Room, Animated Yield (P1)"""
    
    FEATURE_P2_OPTIONAL: bool = False
    """i18n, Analytics, Before/After Slider (P2)"""
    
    # =========================================================================
    # DEMO MODE CONFIGURATION
    # =========================================================================
    
    DEMO_ENABLED: bool = True
    """Enable demo mode with pre-filled accounts"""
    
    DEMO_INSTITUTIONAL_BALANCE: int = 10_000_000 * 10 ** 18  # 10M UJEUR
    """Demo institutional investor balance"""
    
    DEMO_RETAIL_BALANCE: int = 50_000 * 10 ** 18  # 50K UJEUR
    """Demo retail investor balance"""
    
    DEMO_ORIGINATOR_BALANCE: int = 1_000_000 * 10 ** 18  # 1M UJEUR
    """Demo industrial operator balance"""
    
    # =========================================================================
    # RATE LIMITING
    # =========================================================================
    
    RATE_LIMIT_PUBLIC: int = 100  # requests per minute
    """Rate limit for public endpoints"""
    
    RATE_LIMIT_AUTHENTICATED: int = 1000  # requests per hour
    """Rate limit for authenticated endpoints"""
    
    # =========================================================================
    # HELPER METHODS
    # =========================================================================
    
    def is_jurisdiction_blocked(self, code: str) -> bool:
        """Check if a jurisdiction is blocked"""
        return any(j.code == code for j in self.BLOCKED_JURISDICTIONS)
    
    def is_jurisdiction_allowed(self, code: str) -> bool:
        """Check if a jurisdiction is allowed"""
        if self.is_jurisdiction_blocked(code):
            return False
        return (
            code in self.ALLOWED_AFRICAN_MARKETS or
            code in self.ALLOWED_INTERNATIONAL
        )
    
    def get_pool_config(self, pool_id: str) -> Optional[PoolConfig]:
        """Get configuration for a specific pool"""
        return self.POOLS.get(pool_id)
    
    def format_ujeur(self, amount: int, decimals: int = 18) -> str:
        """Format UJEUR amount with decimals"""
        return f"{amount / 10 ** decimals:,.2f} UJEUR"
    
    def get_blocked_jurisdictions_list(self) -> List[str]:
        """Get list of blocked jurisdiction codes"""
        return [j.code for j in self.BLOCKED_JURISDICTIONS]


# =============================================================================
# GLOBAL CONFIG INSTANCE
# =============================================================================

# Singleton instance for application-wide access
mvp_config = MVPConfig()


# =============================================================================
# FACTORY PATTERN: SERVICE SELECTION
# =============================================================================

def get_bank_service():
    """
    Factory function to get appropriate bank service.
    
    MVP: Returns MockBankService
    Production: Returns BIICBankService
    
    Usage:
        bank_service = get_bank_service()
        account_id = bank_service.create_escrow_account(investor_id)
    """
    from services.MVP.mock_bank import MockBankService
    
    if mvp_config.MVP_TESTNET and mvp_config.MOCK_BANK:
        return MockBankService()
    else:
        # Production: from banking.biic_bank_service import BIICBankService
        # return BIICBankService()
        raise NotImplementedError("Production bank service not yet implemented")


def get_gdiz_service():
    """
    Factory function to get appropriate GDIZ service.
    
    MVP: Returns MockGDIZService
    Production: Returns GDIZGateway
    
    Usage:
        gdiz_service = get_gdiz_service()
        certificate = gdiz_service.certify_stock(asset_data)
    """
    from services.MVP.mock_gdiz import MockGDIZService
    
    if mvp_config.MVP_TESTNET and mvp_config.MOCK_GDIZ:
        return MockGDIZService()
    else:
        # Production: from industrial.gdiz_gateway import GDIZGateway
        # return GDIZGateway()
        raise NotImplementedError("Production GDIZ service not yet implemented")


# =============================================================================
# YIELD CALCULATION UTILITIES
# =============================================================================

def calculate_daily_yield(principal: int, apy: float) -> float:
    """
    Calculate daily yield accrual.
    
    Formula: yield_daily = principal × (APY / 365)
    
    Args:
        principal: Principal amount in UJEUR (18 decimals)
        apy: Annual percentage yield (e.g., 0.10 for 10%)
    
    Returns:
        Daily yield in UJEUR (float, convert to int for on-chain)
    
    Reference: docs/09_ALGORITHMS/01_ALGORITHM_SPECIFICATIONS.md
    """
    return principal * (apy / 365)


def calculate_nav_per_share(total_pool_value: int, total_shares: int) -> float:
    """
    Calculate Net Asset Value per share.
    
    Formula: NAV_per_share = Total_Pool_Value / Total_Shares
    
    Args:
        total_pool_value: Total pool value in UJEUR (18 decimals)
        total_shares: Total UPT shares outstanding (18 decimals)
    
    Returns:
        NAV per share (float)
    """
    if total_shares == 0:
        return 1.0  # Initial NAV
    return total_pool_value / total_shares


def calculate_management_fee(principal: int, days: int, fee_rate: float = 0.02) -> int:
    """
    Calculate management fee.
    
    Formula: fee = principal × (fee_rate × days / 365)
    
    Args:
        principal: Principal amount in UJEUR (18 decimals)
        days: Number of days
        fee_rate: Annual fee rate (default 2%)
    
    Returns:
        Management fee in UJEUR (int, 18 decimals)
    """
    return int(principal * (fee_rate * days / 365))


def calculate_performance_fee(
    yield_earned: int,
    hurdle_rate: float = 0.05,
    performance_fee_rate: float = 0.20
) -> int:
    """
    Calculate performance fee on yield above hurdle rate.
    
    Formula: fee = (yield_earned - hurdle_yield) × performance_fee_rate
    
    Args:
        yield_earned: Total yield earned in UJEUR (18 decimals)
        hurdle_rate: Minimum return threshold (default 5%)
        performance_fee_rate: Performance fee rate (default 20%)
    
    Returns:
        Performance fee in UJEUR (int, 18 decimals)
    """
    # Note: This is simplified; actual implementation needs principal & time period
    return int(yield_earned * performance_fee_rate)
