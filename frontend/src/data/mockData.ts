/**
 * Centralized Mock Data Store
 * Ujamaa DeFi Platform - MVP Testnet
 * 
 * SINGLE SOURCE OF TRUTH for all mock data
 * Values MATCH database seeds from backend/setup_database.py
 * 
 * @notice All amounts in EUR (18 decimals for token amounts)
 * @notice Use this for demo mode, switch to API for production
 */

// ============================================================================
// USER PROFILES (Demo Accounts) - MATCHES setup_database.py
// ============================================================================

export const USER_PROFILES = {
  INSTITUTIONAL_INVESTOR: {
    id: 1,  // Match database ID
    name: 'Logic Capital Ltd',
    email: 'institutional@ujamaa-defi.com',
    role: 'INSTITUTIONAL_INVESTOR' as const,
    jurisdiction: 'MU',
    kycStatus: 'approved' as const,
    kybStatus: 'approved' as const,
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    // Portfolio data - MATCHES database pool_positions
    portfolioValue: 800_000,  // Sum of positions below
    totalYield: 94_600,  // Total yield earned
    positions: [
      { poolId: 'POOL_INDUSTRIE', poolName: 'Pool Industrie', shares: 500_000, value: 500_000, apy: 11.0 },
      { poolId: 'POOL_AGRICULTURE', poolName: 'Pool Agriculture', shares: 300_000, value: 300_000, apy: 13.2 },
    ],
    recentActivity: [
      { id: 1, type: 'investment', pool: 'Pool Industrie', amount: 500_000, date: '2026-03-20', status: 'completed' },
      { id: 2, type: 'yield', pool: 'Pool Agriculture', amount: 39_600, date: '2026-03-18', status: 'accrued' },
      { id: 3, type: 'investment', pool: 'Pool Agriculture', amount: 300_000, date: '2026-03-15', status: 'completed' },
    ],
  },
  RETAIL_INVESTOR: {
    id: 2,  // Match database ID
    name: 'John Doe',
    email: 'retail@ujamaa-defi.com',
    role: 'RETAIL_INVESTOR' as const,
    jurisdiction: 'KE',
    kycStatus: 'approved' as const,
    walletAddress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    // Portfolio data - MATCHES database pool_positions
    portfolioValue: 25_000,  // €25K
    totalYield: 2_300,  // €2,300 earned
    positions: [
      { poolId: 'POOL_TRADE_FINANCE', poolName: 'Pool Trade Finance', shares: 25_000, value: 25_000, apy: 9.2 },
    ],
    recentActivity: [
      { id: 1, type: 'investment', pool: 'Pool Trade Finance', amount: 25_000, date: '2026-03-19', status: 'completed' },
      { id: 2, type: 'yield', pool: 'Pool Trade Finance', amount: 2_300, date: '2026-03-17', status: 'accrued' },
    ],
    investmentLimits: {
      minimum: 1_000,
      maximum: 50_000,
      dailyWithdrawal: 500_000,
    },
  },
  INDUSTRIAL_OPERATOR: {
    id: 3,  // Match database ID
    name: 'Green Cotton SA',
    email: 'operator@ujamaa-defi.com',
    role: 'INDUSTRIAL_OPERATOR' as const,
    jurisdiction: 'BJ',
    kycStatus: 'approved' as const,
    kybStatus: 'approved' as const,
    walletAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    // Company data - MATCHES database investor_profiles
    totalInvested: 0,  // Database: total_invested = 0 (not set for operator)
    ultTokens: 0,  // Database: ult_tokens = 0 (not set for operator)
    // Credit data - from business logic (not in database directly)
    creditLimit: 5_000_000,
    outstanding: 10_000_000,  // Sum of ALL 3 financings from database
    availableCapacity: 0,
    utilizationRate: 100,
    // Financings - MATCHES database financings table (3 records)
    financings: [
      { 
        id: 1, 
        pool: 'Pool Industrie', 
        poolId: 'POOL_INDUSTRIE',
        amount: 5_000_000,  // Database: principal = 5000000
        raised: 5_000_000, 
        status: 'active', 
        progress: 100,
        interestRate: 12.0,  // Database: interest_rate = 12.0
        startDate: '2025-10-03',  // Database: now - 180 days
        maturityDate: '2026-10-03',  // Database: now + 185 days
        amountRepaid: 2_500_000,  // Database: amount_repaid = 2500000
        nextRepayment: { amount: 50_000, dueDate: '2026-04-15' },
      },
      { 
        id: 2, 
        pool: 'Pool Agriculture', 
        poolId: 'POOL_AGRICULTURE',
        amount: 3_000_000,  // Database: principal = 3000000
        raised: 3_000_000, 
        status: 'active', 
        progress: 100,
        interestRate: 13.5,  // Database: interest_rate = 13.5
        startDate: '2025-12-03',  // Database: now - 90 days
        maturityDate: '2026-06-01',  // Database: now + 90 days
        amountRepaid: 1_500_000,  // Database: amount_repaid = 1500000
        nextRepayment: null,
      },
      { 
        id: 3, 
        pool: 'Pool Trade Finance', 
        poolId: 'POOL_TRADE_FINANCE',
        amount: 2_000_000,  // Database: principal = 2000000
        raised: 2_000_000, 
        status: 'active', 
        progress: 100,
        interestRate: 9.5,  // Database: interest_rate = 9.5
        startDate: '2025-12-18',  // Database: now - 45 days
        maturityDate: '2026-05-17',  // Database: now + 45 days
        amountRepaid: 1_000_000,  // Database: amount_repaid = 1000000
        nextRepayment: null,
      },
    ],
    certifiedAssets: [
      { id: 'CERT-001', description: 'Cotton bales, Grade A', value: 500_000, status: 'certified' },
    ],
  },
  COMPLIANCE_OFFICER: {
    id: 4,  // Match database ID
    name: 'Sarah Johnson',
    email: 'compliance@ujamaa-defi.com',
    role: 'COMPLIANCE_OFFICER' as const,
    jurisdiction: 'EU',
    walletAddress: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    // Dashboard stats - MATCHES database compliance_metrics
    pendingKYC: 3,
    pendingKYB: 1,
    flaggedTransactions: 0,
    approvedToday: 0,
    pendingApprovals: [
      { id: 'INV-001', name: 'Logic Capital Ltd', type: 'KYB', jurisdiction: 'MU', submitted: '2026-04-02' },
      { id: 'INV-002', name: 'John Doe', type: 'KYC', jurisdiction: 'KE', submitted: '2026-04-02' },
      { id: 'INV-003', name: 'Green Cotton SA', type: 'KYB', jurisdiction: 'BJ', submitted: '2026-04-02' },
    ],
    flaggedTransactionsList: [],
  },
  ADMIN: {
    id: 5,  // Match database ID
    name: 'Platform Admin',
    email: 'admin@ujamaa-defi.com',
    role: 'ADMIN' as const,
    jurisdiction: 'EU',
    walletAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    // Full platform stats - MATCHES database totals
    totalUsers: 6,
    totalPools: 5,
    totalValueLocked: 50_000_000,
    totalInvestments: 3,
    pendingKYC: 3,
    pendingKYB: 1,
  },
  REGULATOR: {
    id: 6,  // Match database ID
    name: 'Regulatory Authority',
    email: 'regulator@ujamaa-defi.com',
    role: 'REGULATOR' as const,
    jurisdiction: 'EU',
    walletAddress: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
    // Oversight data
    totalPlatforms: 1,
    totalInvestors: 6,
    totalVolume: 50_000_000,
    complianceScore: 100,
  },
};

// ============================================================================
// POOL DATA (CONSISTENT across all dashboards) - MATCHES setup_database.py
// ============================================================================

export const POOLS = {
  POOL_INDUSTRIE: {
    id: 'POOL_INDUSTRIE',
    name: 'Pool Industrie',
    family: 'industrie',
    icon: '🏭',
    targetYieldMin: 10.0,
    targetYieldMax: 12.0,
    lockupDays: 365,
    totalValue: 15_000_000,  // €15M - MATCHES database
    apy: 11.0,
    navPerShare: 1.0,
    utilizationRate: 87.5,
    isActive: true,
    color: 'from-blue-600 to-blue-800',
  },
  POOL_AGRICULTURE: {
    id: 'POOL_AGRICULTURE',
    name: 'Pool Agriculture',
    family: 'agriculture',
    icon: '🌱',
    targetYieldMin: 12.0,
    targetYieldMax: 15.0,
    lockupDays: 180,
    totalValue: 12_000_000,  // €12M - MATCHES database
    apy: 13.2,
    navPerShare: 1.0,
    utilizationRate: 88.5,
    isActive: true,
    color: 'from-green-600 to-green-800',
  },
  POOL_TRADE_FINANCE: {
    id: 'POOL_TRADE_FINANCE',
    name: 'Pool Trade Finance',
    family: 'trade_finance',
    icon: '📦',
    targetYieldMin: 8.0,
    targetYieldMax: 10.0,
    lockupDays: 90,
    totalValue: 10_000_000,  // €10M - MATCHES database
    apy: 9.2,
    navPerShare: 1.0,
    utilizationRate: 95.0,
    isActive: true,
    color: 'from-purple-600 to-purple-800',
  },
  POOL_RENEWABLE_ENERGY: {
    id: 'POOL_RENEWABLE_ENERGY',
    name: 'Pool Renewable Energy',
    family: 'renewable_energy',
    icon: '⚡',
    targetYieldMin: 9.0,
    targetYieldMax: 11.0,
    lockupDays: 730,
    totalValue: 8_000_000,  // €8M - MATCHES database
    apy: 10.1,
    navPerShare: 1.0,
    utilizationRate: 82.0,
    isActive: true,
    color: 'from-cyan-600 to-cyan-800',
  },
  POOL_REAL_ESTATE: {
    id: 'POOL_REAL_ESTATE',
    name: 'Pool Real Estate',
    family: 'real_estate',
    icon: '🏢',
    targetYieldMin: 8.0,
    targetYieldMax: 12.0,
    lockupDays: 1095,
    totalValue: 5_000_000,  // €5M - MATCHES database
    apy: 9.8,
    navPerShare: 1.0,
    utilizationRate: 78.0,
    isActive: true,
    color: 'from-amber-600 to-amber-800',
  },
};

// Platform totals (sum of all pools) - MATCHES database
export const PLATFORM_TOTALS = {
  totalValueLocked: 50_000_000,  // €50M (sum of all pools)
  totalPools: 5,
  averageApy: 10.66,  // Weighted average
  totalInvestors: 6,
  totalFinancings: 3,
};

// ============================================================================
// POOL KPIs (CONSISTENT with pool data above)
// ============================================================================

export const getPoolKPIs = (poolId: string) => {
  const kpis: Record<string, any> = {
    POOL_INDUSTRIE: {
      financial: { 
        netApy: 11.0,  // Matches POOL_INDUSTRIE.apy
        navPerShare: 1.0289,  // Matches POOL_INDUSTRIE.navPerShare
        yieldVariance: 0.18, 
        expenseRatio: 2.0 
      },
      liquidity: { 
        tvl: 15_000_000,  // Matches POOL_INDUSTRIE.totalValue
        utilizationRate: 92.0,  // Matches POOL_INDUSTRIE.utilizationRate
        cashDrag: 0.32, 
        redemptionLiquidity: 1_200_000 
      },
      risk: { 
        defaultRate: 0.8, 
        concentrationRisk: 14.5, 
        creditRating: 'A-', 
        collateralizationRatio: 142.0 
      },
      compliance: { 
        kycCoverage: 100.0, 
        whitelistedWallets: 12, 
        jurisdictionCount: 5 
      },
      impact: { 
        industrialGrowth: 28.5, 
        valueAddRatio: 3.2, 
        jobsPerMillion: 95 
      },
    },
    POOL_AGRICULTURE: {
      financial: { 
        netApy: 13.2, 
        navPerShare: 1.0412, 
        yieldVariance: 0.31, 
        expenseRatio: 2.3 
      },
      liquidity: { 
        tvl: 12_000_000, 
        utilizationRate: 88.5, 
        cashDrag: 0.51, 
        redemptionLiquidity: 1_380_000 
      },
      risk: { 
        defaultRate: 1.5, 
        concentrationRisk: 11.2, 
        creditRating: 'BBB', 
        collateralizationRatio: 138.0 
      },
      compliance: { 
        kycCoverage: 100.0, 
        whitelistedWallets: 10, 
        jurisdictionCount: 6 
      },
      impact: { 
        industrialGrowth: 32.1, 
        valueAddRatio: 2.9, 
        jobsPerMillion: 120 
      },
    },
    POOL_TRADE_FINANCE: {
      financial: { 
        netApy: 9.2, 
        navPerShare: 1.0156, 
        yieldVariance: 0.15, 
        expenseRatio: 1.9 
      },
      liquidity: { 
        tvl: 10_000_000, 
        utilizationRate: 95.0, 
        cashDrag: 0.22, 
        redemptionLiquidity: 500_000 
      },
      risk: { 
        defaultRate: 0.5, 
        concentrationRisk: 18.3, 
        creditRating: 'A', 
        collateralizationRatio: 128.0 
      },
      compliance: { 
        kycCoverage: 100.0, 
        whitelistedWallets: 8, 
        jurisdictionCount: 4 
      },
      impact: { 
        industrialGrowth: 18.2, 
        valueAddRatio: 2.1, 
        jobsPerMillion: 65 
      },
    },
    POOL_RENEWABLE_ENERGY: {
      financial: { 
        netApy: 10.1, 
        navPerShare: 1.0198, 
        yieldVariance: 0.21, 
        expenseRatio: 2.1 
      },
      liquidity: { 
        tvl: 8_000_000, 
        utilizationRate: 82.0, 
        cashDrag: 0.68, 
        redemptionLiquidity: 1_440_000 
      },
      risk: { 
        defaultRate: 1.0, 
        concentrationRisk: 9.8, 
        creditRating: 'A+', 
        collateralizationRatio: 145.0 
      },
      compliance: { 
        kycCoverage: 100.0, 
        whitelistedWallets: 6, 
        jurisdictionCount: 5 
      },
      impact: { 
        industrialGrowth: 22.8, 
        valueAddRatio: 2.5, 
        jobsPerMillion: 78 
      },
    },
    POOL_REAL_ESTATE: {
      financial: { 
        netApy: 9.8, 
        navPerShare: 1.0167, 
        yieldVariance: 0.19, 
        expenseRatio: 2.2 
      },
      liquidity: { 
        tvl: 5_000_000, 
        utilizationRate: 78.0, 
        cashDrag: 0.89, 
        redemptionLiquidity: 1_100_000 
      },
      risk: { 
        defaultRate: 1.8, 
        concentrationRisk: 15.6, 
        creditRating: 'BBB+', 
        collateralizationRatio: 132.0 
      },
      compliance: { 
        kycCoverage: 100.0, 
        whitelistedWallets: 5, 
        jurisdictionCount: 4 
      },
      impact: { 
        industrialGrowth: 15.6, 
        valueAddRatio: 2.3, 
        jobsPerMillion: 72 
      },
    },
    // Aggregated "all pools" KPIs
    ALL: {
      financial: { 
        netApy: 10.66,  // Weighted average
        navPerShare: 1.0264,  // Weighted average
        yieldVariance: 0.23, 
        expenseRatio: 2.1 
      },
      liquidity: { 
        tvl: 50_000_000,  // Sum of all pools
        utilizationRate: 87.5,  // Weighted average
        cashDrag: 0.45, 
        redemptionLiquidity: 6_250_000 
      },
      risk: { 
        defaultRate: 1.2, 
        concentrationRisk: 12.5, 
        creditRating: 'BBB+', 
        collateralizationRatio: 135.0 
      },
      compliance: { 
        kycCoverage: 100.0, 
        whitelistedWallets: 41,  // Sum
        jurisdictionCount: 7 
      },
      impact: { 
        industrialGrowth: 25.3, 
        valueAddRatio: 2.8, 
        jobsPerMillion: 85 
      },
    },
  };
  return kpis[poolId] || kpis.ALL;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCurrencyPrecise = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

// ============================================================================
// EXPORT ALL DATA
// ============================================================================

export default {
  USER_PROFILES,
  POOLS,
  PLATFORM_TOTALS,
  getPoolKPIs,
  formatCurrency,
  formatCurrencyPrecise,
  formatPercentage,
  formatNumber,
};
