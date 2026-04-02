"""
Database Models - Ujamaa DeFi Platform

SQLAlchemy models for all database entities.
Supports both SQLite (development) and PostgreSQL (production).

@notice: Models designed for easy migration between SQLite and PostgreSQL
"""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Boolean, Text,
    ForeignKey, Enum as SQLEnum, JSON, Numeric, UniqueConstraint
)
from sqlalchemy.orm import relationship, declarative_base
import enum

Base = declarative_base()


# =============================================================================
# ENUMS
# =============================================================================

class InvestorRoleEnum(enum.Enum):
    INSTITUTIONAL_INVESTOR = "INSTITUTIONAL_INVESTOR"
    RETAIL_INVESTOR = "RETAIL_INVESTOR"
    INDUSTRIAL_OPERATOR = "INDUSTRIAL_OPERATOR"
    COMPLIANCE_OFFICER = "COMPLIANCE_OFFICER"
    ADMIN = "ADMIN"
    REGULATOR = "REGULATOR"


class ComplianceStatusEnum(enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    REVIEW_REQUIRED = "review_required"


class TransactionStatusEnum(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    FAILED = "failed"
    SIMULATED = "simulated"


class DocumentTypeEnum(enum.Enum):
    KYC_ID = "kyc_id"
    KYC_ADDRESS = "kyc_address"
    KYC_SELFIE = "kyc_selfie"
    KYB_INCORPORATION = "kyb_incorporation"
    KYB_TAX = "kyb_tax"
    KYB_UBO = "kyb_ubo"
    KYB_RESOLUTION = "kyb_resolution"
    KYB_LICENSE = "kyb_license"
    KYB_AML = "kyb_aml"
    OTHER = "other"


class TransactionTypeEnum(enum.Enum):
    """Transaction type for bank transactions"""
    DEPOSIT = "DEPOSIT"
    WITHDRAWAL = "WITHDRAWAL"
    WIRE_TRANSFER = "WIRE_TRANSFER"
    INCOMING_WIRE = "INCOMING_WIRE"
    OUTGOING_WIRE = "OUTGOING_WIRE"
    INVESTMENT = "INVESTMENT"
    REDEMPTION = "REDEMPTION"
    YIELD_DISTRIBUTION = "YIELD_DISTRIBUTION"


class AccountStatusEnum(enum.Enum):
    """Account status enum"""
    ACTIVE = "ACTIVE"
    FROZEN = "FROZEN"
    CLOSED = "CLOSED"
    PENDING = "PENDING"


class FinancingStatusEnum(enum.Enum):
    """Financing status enum"""
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    REPAYING = "REPAYING"
    REPAYED = "REPAYED"
    DEFAULTED = "DEFAULTED"
    CANCELLED = "CANCELLED"


class AssetClassEnum(enum.Enum):
    """Asset class enum for financings"""
    RECEIVABLES = "RECEIVABLES"
    INVENTORY = "INVENTORY"
    EQUIPMENT = "EQUIPMENT"
    REAL_ESTATE = "REAL_ESTATE"
    WORKING_CAPITAL = "WORKING_CAPITAL"
    PROJECT_FINANCE = "PROJECT_FINANCE"


class RiskGradeEnum(enum.Enum):
    """Risk grade enum"""
    AAA = "AAA"
    AA = "AA"
    A = "A"
    BBB = "BBB"
    BB = "BB"
    B = "B"
    CCC = "CCC"
    CC = "CC"
    C = "C"
    D = "D"


# =============================================================================
# USER & AUTHENTICATION MODELS
# =============================================================================

class User(Base):
    """User account model for authentication"""
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)  # Null for wallet-only auth
    wallet_address = Column(String(42), unique=True, nullable=True, index=True)
    role = Column(SQLEnum(InvestorRoleEnum), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    investor_profile = relationship("InvestorProfile", back_populates="user", uselist=False)
    compliance_activities = relationship("ComplianceActivity", back_populates="user")


class InvestorProfile(Base):
    """Investor profile with KYC/KYB information"""
    __tablename__ = 'investor_profiles'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True)
    full_name = Column(String(255), nullable=True)
    company_name = Column(String(255), nullable=True)
    jurisdiction = Column(String(2), nullable=False)
    kyc_status = Column(SQLEnum(ComplianceStatusEnum), default=ComplianceStatusEnum.PENDING)
    kyb_status = Column(SQLEnum(ComplianceStatusEnum), default=ComplianceStatusEnum.PENDING)
    accreditation_status = Column(SQLEnum(ComplianceStatusEnum), default=ComplianceStatusEnum.PENDING)
    wallet_address = Column(String(42), nullable=True)

    # Investment tracking (18 decimals precision for token amounts)
    total_invested = Column(Numeric(26, 18), default=0)
    ult_tokens = Column(Numeric(26, 18), default=0)  # uLT tokens held (18 decimals)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="investor_profile")
    documents = relationship("Document", back_populates="investor", cascade="all, delete-orphan")
    investments = relationship("Investment", back_populates="investor", cascade="all, delete-orphan")
    ult_transactions = relationship("ULTTransaction", back_populates="investor", cascade="all, delete-orphan")
    pool_positions = relationship("PoolPosition", back_populates="investor", cascade="all, delete-orphan")
    bank_accounts = relationship("BankAccount", back_populates="investor", cascade="all, delete-orphan")
    whitelisted_wallets = relationship("WhitelistedWallet", back_populates="investor", cascade="all, delete-orphan")


# =============================================================================
# DOCUMENT MODELS (KYC/KYB)
# =============================================================================

class Document(Base):
    """Document model for KYC/KYB submissions"""
    __tablename__ = 'documents'

    id = Column(Integer, primary_key=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey('investor_profiles.id', ondelete='CASCADE'), nullable=False)
    document_type = Column(SQLEnum(DocumentTypeEnum), nullable=False)
    document_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)  # Path to stored file
    file_hash = Column(String(64), nullable=True)  # SHA256 hash for integrity
    upload_status = Column(String(50), default='uploaded')
    verification_status = Column(SQLEnum(ComplianceStatusEnum), default=ComplianceStatusEnum.PENDING)

    # Compliance review
    reviewed_by = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    review_notes = Column(Text, nullable=True)

    # 24h window tracking
    submitted_at = Column(DateTime, default=datetime.utcnow)
    deadline_at = Column(DateTime, nullable=True)  # submitted_at + 24h

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    investor = relationship("InvestorProfile", back_populates="documents")
    reviewer = relationship("User")


class ComplianceActivity(Base):
    """Audit log for compliance activities"""
    __tablename__ = 'compliance_activities'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    activity_type = Column(String(100), nullable=False)  # e.g., 'KYC_APPROVED', 'DOCUMENT_REVIEWED'
    target_id = Column(Integer, nullable=True)  # ID of target (document, investor, etc.)
    target_type = Column(String(50), nullable=True)  # e.g., 'DOCUMENT', 'INVESTOR'
    details = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User", back_populates="compliance_activities")


# =============================================================================
# INVESTMENT & POOL MODELS
# =============================================================================

class Pool(Base):
    """Investment pool model"""
    __tablename__ = 'pools'

    id = Column(String(50), primary_key=True)  # e.g., 'POOL_INDUSTRIE'
    name = Column(String(255), nullable=False)
    family = Column(String(100), nullable=False)
    target_yield_min = Column(Float, nullable=False)
    target_yield_max = Column(Float, nullable=False)
    lockup_days = Column(Integer, nullable=False)
    total_value = Column(Numeric(26, 18), default=0)  # 18 decimals precision for token amounts
    apy = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    investments = relationship("Investment", back_populates="pool", cascade="all, delete-orphan")
    positions = relationship("PoolPosition", back_populates="pool", cascade="all, delete-orphan")
    financings = relationship("Financing", back_populates="pool")


class Investment(Base):
    """Investment model"""
    __tablename__ = 'investments'

    id = Column(Integer, primary_key=True, autoincrement=True)
    pool_id = Column(String(50), ForeignKey('pools.id', ondelete='CASCADE'), nullable=False)
    investor_id = Column(Integer, ForeignKey('investor_profiles.id', ondelete='CASCADE'), nullable=False)
    amount = Column(Numeric(26, 18), nullable=False)  # 18 decimals precision for token amounts
    shares = Column(Numeric(26, 18), nullable=False)
    nav = Column(Numeric(26, 18), nullable=False)
    ult_tokens = Column(Numeric(26, 18), default=0)  # uLT tokens for this investment (18 decimals)

    status = Column(String(50), default='completed')
    transaction_hash = Column(String(66), nullable=True)  # On-chain tx hash

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    pool = relationship("Pool", back_populates="investments")
    investor = relationship("InvestorProfile", back_populates="investments")


class ULTTransaction(Base):
    """uLT token transaction tracking"""
    __tablename__ = 'ult_transactions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey('investor_profiles.id', ondelete='CASCADE'), nullable=False)
    transaction_type = Column(String(50), nullable=False)  # 'MINT', 'BURN', 'TRANSFER'
    amount = Column(Numeric(26, 18), nullable=False)  # 18 decimals precision
    balance_before = Column(Numeric(26, 18), nullable=False)
    balance_after = Column(Numeric(26, 18), nullable=False)

    # Blockchain reference
    transaction_hash = Column(String(66), nullable=True)
    block_number = Column(Integer, nullable=True)

    status = Column(SQLEnum(TransactionStatusEnum), default=TransactionStatusEnum.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    investor = relationship("InvestorProfile", back_populates="ult_transactions")


# =============================================================================
# TRANSACTION TRACKING (On-chain & Off-chain)
# =============================================================================

class Transaction(Base):
    """Transaction model for tracking all transactions"""
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey('investor_profiles.id', ondelete='SET NULL'), nullable=True, index=True)
    transaction_type = Column(String(50), nullable=False)  # 'INVESTMENT', 'REDEMPTION', 'YIELD', etc.
    amount = Column(Numeric(26, 18), nullable=False)  # 18 decimals precision
    currency = Column(String(10), default='EUR')

    # Blockchain tracking
    is_on_chain = Column(Boolean, default=False)
    transaction_hash = Column(String(66), nullable=True)
    block_number = Column(Integer, nullable=True)
    gas_fee = Column(Numeric(26, 18), nullable=True)

    # Status tracking
    status = Column(SQLEnum(TransactionStatusEnum), default=TransactionStatusEnum.PENDING)
    status_history = Column(JSON, nullable=True)  # Track status changes

    # Compliance tracking (NEW)
    is_flagged = Column(Boolean, default=False)
    risk_level = Column(String(20), nullable=True)  # 'low', 'medium', 'high', 'critical'
    flag_reason = Column(Text, nullable=True)
    flagged_at = Column(DateTime, nullable=True)
    flagged_by = Column(String(50), nullable=True)  # 'auto' or user ID
    
    # Review tracking
    reviewed_by = Column(Integer, ForeignKey('users.id'), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    review_notes = Column(Text, nullable=True)
    review_action = Column(String(20), nullable=True)  # 'cleared', 'blocked', 'escalated'

    # Metadata
    description = Column(Text, nullable=True)
    tx_metadata = Column(JSON, nullable=True)  # Renamed from metadata (reserved word)

    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    confirmed_at = Column(DateTime, nullable=True)

    # Relationships
    investor = relationship("InvestorProfile")
    reviewer = relationship("User")


# =============================================================================
# POOL POSITION & FINANCING MODELS
# =============================================================================

class PoolPosition(Base):
    """
    Pool position model - tracks investor shares in each pool.

    Replaces mock_positions dictionary from pools.py API.
    """
    __tablename__ = 'pool_positions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey('investor_profiles.id', ondelete='CASCADE'), nullable=False)
    pool_id = Column(String(50), ForeignKey('pools.id', ondelete='CASCADE'), nullable=False)

    # Position details
    shares = Column(Numeric(26, 18), default=0, nullable=False)  # UPT shares owned (18 decimals precision)
    average_nav = Column(Numeric(26, 18), nullable=True)  # Average NAV at purchase

    # Yield tracking
    total_yield_earned = Column(Numeric(26, 18), default=0)
    last_yield_distribution = Column(DateTime, nullable=True)

    # Status
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    investor = relationship("InvestorProfile", back_populates="pool_positions")
    pool = relationship("Pool", back_populates="positions")

    # Unique constraint: one position per investor per pool
    __table_args__ = (
        UniqueConstraint('investor_id', 'pool_id', name='uq_investor_pool'),
        {'sqlite_autoincrement': True},
    )


class Financing(Base):
    """
    Financing model - tracks individual loans/assets in pools.
    
    Replaces mock_financings list from pools.py API.
    """
    __tablename__ = 'financings'

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Pool linkage
    pool_family = Column(String(100), nullable=False, index=True)  # INDUSTRIE, AGRICULTURE, etc.
    pool_id = Column(String(50), ForeignKey('pools.id'), nullable=True)
    
    # Asset details
    asset_class = Column(SQLEnum(AssetClassEnum), nullable=False)
    industrial = Column(String(255), nullable=False)  # Industrial company name/ID
    industrial_id = Column(Integer, ForeignKey('investor_profiles.id'), nullable=True)  # If linked to operator
    
    # Financial terms
    principal = Column(Numeric(18, 2), nullable=False)
    interest_rate = Column(Numeric(5, 2), nullable=False)  # Basis points (e.g., 1200 = 12%)
    duration_days = Column(Integer, nullable=False)
    
    # Dates
    start_date = Column(DateTime, nullable=False)
    maturity_date = Column(DateTime, nullable=False)
    
    # Repayment tracking
    amount_repaid = Column(Numeric(18, 2), default=0)
    is_repaid = Column(Boolean, default=False)
    is_defaulted = Column(Boolean, default=False)
    
    # Status
    status = Column(SQLEnum(FinancingStatusEnum), default=FinancingStatusEnum.PENDING)
    
    # Metadata
    description = Column(Text, nullable=True)
    collateral = Column(JSON, nullable=True)  # Collateral details
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    pool = relationship("Pool", back_populates="financings")
    industrial_profile = relationship("InvestorProfile")


# =============================================================================
# YIELD & PERFORMANCE MODELS
# =============================================================================

class YieldStatement(Base):
    """
    Yield statement model - historical yield earned by investors.

    Generated periodically (monthly/quarterly) for each investor position.
    """
    __tablename__ = 'yield_statements'

    id = Column(Integer, primary_key=True, autoincrement=True)
    statement_id = Column(String(50), unique=True, nullable=False)  # e.g., "YS-2026-Q1-001"

    # Links
    investor_id = Column(Integer, ForeignKey('investor_profiles.id', ondelete='CASCADE'), nullable=False)
    pool_id = Column(String(50), ForeignKey('pools.id', ondelete='CASCADE'), nullable=False)
    pool_position_id = Column(Integer, ForeignKey('pool_positions.id', ondelete='CASCADE'), nullable=True)

    # Period
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)

    # Financials (18 decimals precision for token amounts)
    principal = Column(Numeric(26, 18), nullable=False)
    shares_held = Column(Numeric(26, 18), nullable=False)
    yield_earned = Column(Numeric(26, 18), nullable=False)
    management_fee = Column(Numeric(26, 18), default=0)
    performance_fee = Column(Numeric(26, 18), default=0)
    net_yield = Column(Numeric(26, 18), nullable=False)

    # NAV tracking
    nav_start = Column(Numeric(26, 18), nullable=False)
    nav_end = Column(Numeric(26, 18), nullable=False)

    # Status
    status = Column(String(50), default='generated')  # generated, distributed, claimed

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    investor = relationship("InvestorProfile")
    pool = relationship("Pool")
    position = relationship("PoolPosition", foreign_keys=[pool_position_id])


# =============================================================================
# BANKING & ESCROW MODELS
# =============================================================================

class BankAccount(Base):
    """
    Bank escrow account model - tracks investor bank accounts.

    Replaces EscrowAccount from mock_bank.py service.
    """
    __tablename__ = 'bank_accounts'

    account_id = Column(String(50), primary_key=True)  # e.g., "ESC-001-2026"
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, unique=True)

    # Account balances
    escrow_balance = Column(Numeric(18, 2), default=0, nullable=False)
    available_balance = Column(Numeric(18, 2), default=0, nullable=False)
    locked_amount = Column(Numeric(18, 2), default=0, nullable=False)
    
    # Account details
    balance = Column(Numeric(18, 2), default=0, nullable=False)
    currency = Column(String(3), default='EUR', nullable=False)
    status = Column(SQLEnum(AccountStatusEnum), default=AccountStatusEnum.PENDING)

    # Bank details
    bank_name = Column(String(255), nullable=False, default="Mock Bank")
    account_number = Column(String(50), nullable=True)  # Encrypted in production
    iban = Column(String(34), nullable=True)  # Encrypted in production
    swift_code = Column(String(11), nullable=True)

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_transaction_at = Column(DateTime, nullable=True)

    # Relationships
    investor = relationship("InvestorProfile", back_populates="bank_accounts")
    transactions = relationship("BankTransaction", back_populates="account")


class BankTransaction(Base):
    """
    Bank transaction model - tracks deposits/withdrawals.
    
    Replaces Transaction from mock_bank.py service.
    """
    __tablename__ = 'bank_transactions'

    tx_id = Column(String(50), primary_key=True)  # e.g., "TXN-2026-001"
    account_id = Column(String(50), ForeignKey('bank_accounts.account_id'), nullable=False)
    
    # Transaction details
    transaction_type = Column(SQLEnum(TransactionTypeEnum), nullable=False)
    amount = Column(Numeric(18, 2), nullable=False)
    currency = Column(String(3), default='EUR', nullable=False)
    
    # Status
    status = Column(SQLEnum(TransactionStatusEnum), default=TransactionStatusEnum.PENDING)
    
    # Counterparty
    counterparty_account = Column(String(50), nullable=True)
    counterparty_name = Column(String(255), nullable=True)
    counterparty_bank = Column(String(255), nullable=True)
    
    # Details
    description = Column(Text, nullable=True)
    reference = Column(String(100), nullable=True)  # Bank reference
    wire_details = Column(JSON, nullable=True)  # Wire transfer details
    
    # Timestamps
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    settled_at = Column(DateTime, nullable=True)
    
    # Blockchain linkage (if applicable)
    on_chain_tx_hash = Column(String(66), nullable=True)

    # Relationships
    account = relationship("BankAccount", back_populates="transactions")


# =============================================================================
# GDIZ INTEGRATION MODELS
# =============================================================================

class GDIZFinancing(Base):
    """
    GDIZ financing request model - tracks GDIZ partnership financings.
    
    Replaces mock GDIZ service data.
    """
    __tablename__ = 'gdiz_financings'

    id = Column(Integer, primary_key=True, autoincrement=True)
    gdiz_reference = Column(String(50), unique=True, nullable=False)  # GDIZ ref number
    
    # Industrial details
    industrial_id = Column(Integer, ForeignKey('investor_profiles.id'), nullable=False)
    industrial_name = Column(String(255), nullable=False)
    industrial_sector = Column(String(100), nullable=False)
    
    # Financing details
    pool_family = Column(String(100), nullable=False)
    asset_class = Column(SQLEnum(AssetClassEnum), nullable=False)
    requested_amount = Column(Numeric(18, 2), nullable=False)
    approved_amount = Column(Numeric(18, 2), nullable=True)
    interest_rate = Column(Numeric(5, 2), nullable=True)
    duration_days = Column(Integer, nullable=True)
    
    # Status tracking
    status = Column(SQLEnum(FinancingStatusEnum), default=FinancingStatusEnum.PENDING)
    gdiz_status = Column(String(50), default='submitted')  # GDIZ internal status
    
    # Dates
    submitted_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime, nullable=True)
    funded_at = Column(DateTime, nullable=True)
    
    # Documents
    application_doc = Column(String(500), nullable=True)
    approval_doc = Column(String(500), nullable=True)
    
    # Linked financing (if approved and funded)
    financing_id = Column(Integer, ForeignKey('financings.id'), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    industrial = relationship("InvestorProfile")
    financing = relationship("Financing")


# =============================================================================
# RISK & COMPLIANCE METRICS HISTORY
# =============================================================================

class RiskMetrics(Base):
    """
    Risk metrics history - periodic risk scores per pool.
    
    Replaces in-memory risk calculations from risk_engine.py.
    """
    __tablename__ = 'risk_metrics'

    id = Column(Integer, primary_key=True, autoincrement=True)
    pool_id = Column(String(50), ForeignKey('pools.id'), nullable=False)
    
    # Risk scores
    default_rate = Column(Numeric(5, 4), nullable=False)  # e.g., 0.0234 = 2.34%
    concentration_risk = Column(Numeric(5, 4), nullable=False)  # Herfindahl index
    credit_score = Column(Integer, nullable=False)  # 0-1000
    credit_rating = Column(String(10), nullable=True)  # e.g., "BBB+"
    collateralization_ratio = Column(Numeric(5, 2), nullable=False)  # e.g., 1.25 = 125%
    
    # Composite
    risk_score = Column(Integer, nullable=False)  # 0-100
    risk_grade = Column(SQLEnum(RiskGradeEnum), nullable=False)
    is_healthy = Column(Boolean, default=True)
    
    # Calculation details
    calculation_method = Column(String(50), default='standard')
    data_points = Column(Integer, nullable=True)
    
    # Period
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    
    calculated_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    pool = relationship("Pool")


class ComplianceMetrics(Base):
    """
    Compliance metrics history - periodic compliance scores per pool.
    
    Replaces in-memory compliance calculations from compliance_tracker.py.
    """
    __tablename__ = 'compliance_metrics'

    id = Column(Integer, primary_key=True, autoincrement=True)
    pool_id = Column(String(50), ForeignKey('pools.id'), nullable=False)
    
    # KYC/AML metrics
    kyc_coverage = Column(Numeric(5, 2), nullable=False)  # 0-100%
    whitelisted_wallets = Column(Integer, nullable=False)
    jurisdiction_count = Column(Integer, nullable=False)
    jurisdiction_distribution = Column(JSON, nullable=True)  # {code: count}
    
    # Compliance score
    compliance_score = Column(Integer, nullable=False)  # 0-100
    is_compliant = Column(Boolean, default=True)
    pending_reviews = Column(Integer, default=0)
    overdue_reviews = Column(Integer, default=0)
    
    # Sanctions screening
    sanctions_hits = Column(Integer, default=0)
    pep_exposures = Column(Integer, default=0)
    
    # Period
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    
    calculated_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    pool = relationship("Pool")


class ImpactMetrics(Base):
    """
    Impact/ESG metrics history - periodic impact scores per pool.
    
    Replaces in-memory impact calculations from impact_tracker.py.
    """
    __tablename__ = 'impact_metrics'

    id = Column(Integer, primary_key=True, autoincrement=True)
    pool_id = Column(String(50), ForeignKey('pools.id'), nullable=False)
    
    # Economic impact
    avg_capacity_increase = Column(Numeric(5, 2), nullable=False)  # % increase
    value_add_ratio = Column(Numeric(5, 2), nullable=False)  # e.g., 2.5x
    jobs_per_million = Column(Numeric(10, 2), nullable=False)  # Jobs per €1M invested
    
    # Employment
    total_direct_jobs = Column(Integer, nullable=False)
    total_indirect_jobs = Column(Integer, nullable=False)
    women_employment_rate = Column(Numeric(5, 2), nullable=False)  # %
    youth_employment_rate = Column(Numeric(5, 2), nullable=False)  # %
    
    # Environmental
    co2_reduction_tons = Column(Numeric(12, 2), nullable=False)  # Tons CO2
    renewable_energy_kwh = Column(Numeric(15, 2), nullable=False)  # kWh
    
    # SDG alignment
    primary_sdg = Column(String(50), nullable=True)  # Main SDG supported
    sdg_coverage = Column(JSON, nullable=True)  # {sdg: score}
    
    # Composite
    impact_score = Column(Integer, nullable=False)  # 0-100
    impact_grade = Column(String(10), nullable=False)  # A+, A, B+, etc.
    
    # Period
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    
    calculated_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    pool = relationship("Pool")


# =============================================================================
# COMPLIANCE & WALLET MANAGEMENT
# =============================================================================

class WhitelistedWallet(Base):
    """
    Whitelisted wallet model - approved wallet addresses per investor.

    Required for compliance tracking.
    """
    __tablename__ = 'whitelisted_wallets'

    id = Column(Integer, primary_key=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey('investor_profiles.id', ondelete='CASCADE'), nullable=False)

    # Wallet details
    wallet_address = Column(String(42), nullable=False, index=True, unique=True)
    label = Column(String(100), nullable=True)  # e.g., "Main Wallet", "Cold Storage"

    # Jurisdiction
    jurisdiction = Column(String(2), nullable=False)
    jurisdiction_verified = Column(Boolean, default=False)

    # Compliance
    is_approved = Column(Boolean, default=False)
    approved_by = Column(Integer, ForeignKey('users.id'), nullable=True)
    approved_at = Column(DateTime, nullable=True)

    # Risk scoring
    risk_score = Column(Integer, nullable=True)  # 0-100
    risk_level = Column(String(20), default='unknown')  # low, medium, high, critical

    # Screening
    sanctions_checked = Column(Boolean, default=False)
    sanctions_checked_at = Column(DateTime, nullable=True)
    pep_checked = Column(Boolean, default=False)
    pep_checked_at = Column(DateTime, nullable=True)

    # Metadata
    first_transaction_at = Column(DateTime, nullable=True)
    last_transaction_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    investor = relationship("InvestorProfile", back_populates="whitelisted_wallets")
    approver = relationship("User")

    # Unique constraint: Prevent duplicate wallet addresses
    __table_args__ = (
        UniqueConstraint('wallet_address', name='uq_wallet_address'),
        {'sqlite_autoincrement': True},
    )


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def init_db(engine):
    """
    Initialize database tables.
    
    Args:
        engine: SQLAlchemy engine instance
    """
    Base.metadata.create_all(engine)


def get_db_session(engine):
    """
    Get database session factory.
    
    Args:
        engine: SQLAlchemy engine instance
        
    Returns:
        Session factory
    """
    from sqlalchemy.orm import sessionmaker
    return sessionmaker(bind=engine)
