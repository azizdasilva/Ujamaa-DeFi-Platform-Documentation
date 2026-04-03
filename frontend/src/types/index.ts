/**
 * Type Definitions - Ujamaa DeFi Platform
 * MVP Testnet Release
 * 
 * @reference SRS v2.0
 * @reference 04_DESIGN_SYSTEM_SPECIFICATION.md
 */

// =============================================================================
// POOL TYPES
// =============================================================================

export type PoolFamily =
  | 'POOL_INDUSTRIE'
  | 'POOL_AGRICULTURE'
  | 'POOL_TRADE_FINANCE'
  | 'POOL_RENEWABLE_ENERGY'
  | 'POOL_REAL_ESTATE';

export type RiskLevel = 'low' | 'medium' | 'high';

export type FinancingStatus = 'PENDING' | 'ACTIVE' | 'REPAYING' | 'REPAID' | 'DEFAULTED' | 'CANCELLED';

export interface Pool {
  id: string;
  name: string;
  family: PoolFamily;
  targetYieldMin: number;
  targetYieldMax: number;
  lockupDays: number;
  totalValue: string;  // String to preserve uint256 precision
  apy: number;
  assetClasses: string[];
  riskLevel: RiskLevel;
  isActive: boolean;
}

export interface PoolStats {
  poolId: string;
  totalValue: string;  // String for uint256
  deployedAmount: string;  // String for uint256
  availableAmount: string;  // String for uint256
  totalYield: string;  // String for uint256
  financingCount: number;
  navPerShare: string;  // String for uint256
  apy: number;
}

export interface PoolPosition {
  poolId: string;
  poolName: string;
  shares: string;  // String for uint256
  value: string;  // String for uint256
  apy: number;
  yieldEarned: string;  // String for uint256
  ulpTokens?: string;  // String for uint256 - uLP token count for tracking
}

// =============================================================================
// INVESTMENT TYPES
// =============================================================================

export interface Investment {
  id: string;
  poolId: string;
  investorId: string;
  amount: string;  // String for uint256
  shares: string;  // String for uint256
  nav: string;  // String for uint256
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface Redemption {
  id: string;
  poolId: string;
  investorId: string;
  shares: string;  // String for uint256
  amount: string;  // String for uint256
  nav: string;  // String for uint256
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface Financing {
  id: number;
  poolFamily: PoolFamily;
  assetClass: string;
  industrial: string;
  principal: string;  // String for uint256
  interestRate: number;  // basis points
  startDate: string;
  maturityDate: string;
  amountRepaid: string;  // String for uint256
  isRepaid: boolean;
  isDefaulted: boolean;
}

// =============================================================================
// INVESTOR TYPES
// =============================================================================

export type InvestorType = 'retail' | 'institutional' | 'originator';

export type InvestorRole =
  | 'INSTITUTIONAL_INVESTOR'
  | 'RETAIL_INVESTOR'
  | 'INDUSTRIAL_OPERATOR'
  | 'COMPLIANCE_OFFICER'
  | 'ADMIN'
  | 'REGULATOR';

export interface Investor {
  id: string;
  name: string;
  type: InvestorType;
  role: InvestorRole;
  jurisdiction: string;
  walletAddress: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  accreditationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface InvestorPortfolio {
  investorId: string;
  totalValue: number;
  totalYieldEarned: number;
  positions: PoolPosition[];
}

export interface InvestorStats {
  totalInvested: number;
  totalYieldEarned: number;
  activePositions: number;
  completedInvestments: number;
  avgAPY: number;
}

// =============================================================================
// COMPLIANCE TYPES
// =============================================================================

// Jurisdiction permission states (different from document compliance states)
export type JurisdictionStatus = 'ALLOWED' | 'BLOCKED' | 'REVIEW_REQUIRED';

// Document/KYC/KYB lifecycle states (matches backend ComplianceStatusEnum)
export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'review_required';

// Document types (matches backend DocumentTypeEnum)
export type DocumentType =
  | 'kyc_id'
  | 'kyc_address'
  | 'kyc_selfie'
  | 'kyb_incorporation'
  | 'kyb_tax'
  | 'kyb_ubo'
  | 'kyb_resolution'
  | 'kyb_license'
  | 'kyb_aml'
  | 'other';

export interface Jurisdiction {
  code: string;
  name: string;
  isBlocked: boolean;
  reason?: string;
  sanctionsList?: string;
}

export interface ComplianceCheck {
  jurisdiction: string;
  jurisdictionName: string;
  status: JurisdictionStatus;
  isAllowed: boolean;
  isBlocked: boolean;
  requiresReview: boolean;
  reason?: string;
  sanctionsList?: string;
  checkedAt: string;
}

export interface InvestorCompliance {
  investorId: string;
  jurisdiction: string;
  jurisdictionName: string;
  status: JurisdictionStatus;
  isApproved: boolean;
  kycStatus: string;
  accreditationStatus: string;
  approvedBy?: string;
  approvedAt?: string;
}

// =============================================================================
// YIELD TYPES
// =============================================================================

export interface YieldStatement {
  statementId: string;
  investorId: string;
  poolId: string;
  periodStart: string;
  periodEnd: string;
  principal: number;
  yieldEarned: number;
  managementFee: number;
  performanceFee: number;
  netYield: number;
  navStart: number;
  navEnd: number;
  generatedAt: string;
}

export interface YieldStats {
  totalYield: number;
  managementFees: number;
  performanceFees: number;
  netYield: number;
  apy: number;
}

// =============================================================================
// TRANSACTION TYPES
// =============================================================================

export type TransactionType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'WIRE_TRANSFER'
  | 'INCOMING_WIRE'
  | 'OUTGOING_WIRE'
  | 'INVESTMENT'
  | 'REDEMPTION'
  | 'YIELD_DISTRIBUTION';

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  timestamp: string;
  description: string;
  poolId?: string;
  investorId?: string;
}

// =============================================================================
// DOCUMENT TYPES (Investors Room)
// =============================================================================

export type DocumentCategory = 
  | 'onboarding'
  | 'offerings'
  | 'reporting'
  | 'legal'
  | 'educational'
  | 'templates';

export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  description: string;
  date: string;
  size: string;
  tags: string[];
  isFeatured: boolean;
  downloadUrl?: string;
}

// =============================================================================
// UI TYPES
// =============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export type StatsCardColor = 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'teal';

export interface Trend {
  value: number | string;
  direction: 'up' | 'down' | 'neutral';
}

// =============================================================================
// API TYPES
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// =============================================================================
// CONFIG TYPES
// =============================================================================

export interface MVPConfig {
  IS_MVP: boolean;
  IS_TESTNET: boolean;
  NETWORK: {
    NAME: string;
    CHAIN_ID: number;
    RPC_URL: string;
    BLOCK_EXPLORER: string;
  };
  MOCK: {
    BANK: boolean;
    ESCROW: boolean;
    GDIZ_BENIN: boolean;
    FIAT_RAMP: boolean;
    KYB: boolean;
  };
  LIMITS: {
    MIN_DEPOSIT: number;
    MAX_DEPOSIT: number;
    DAILY_WITHDRAWAL: number;
    INSTITUTIONAL_MIN: number;
    RETAIL_MAX: number;
  };
  POOLS: Record<string, Pool>;
  COMPLIANCE: {
    BLOCKED_JURISDICTIONS: string[];
    ALLOWED_AFRICAN: string[];
    ALLOWED_INTERNATIONAL: string[];
  };
  FEES: {
    MANAGEMENT_FEE: number;
    PERFORMANCE_FEE: number;
    HURDLE_RATE: number;
    FX_FEE: number;
  };
  DISCLAIMER: {
    HEADER: string;
    FOOTER: string;
    MODAL: string;
  };
}

// =============================================================================
// WEB3 TYPES
// =============================================================================

export interface WalletConnection {
  address: string;
  isConnected: boolean;
  chainId: number;
  chainName: string;
}

export interface ContractAddresses {
  ULPTokenizer: string;
  LiquidityPool: string;
  JurisdictionCompliance: string;
  MockEscrow: string;
  MockFiatRamp: string;
}

// =============================================================================
// ACTIVITY FEED TYPES
// =============================================================================

export interface Activity {
  id: string;
  type: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
  color: string;
}

// =============================================================================
// NOTIFICATION TYPES
// =============================================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}
