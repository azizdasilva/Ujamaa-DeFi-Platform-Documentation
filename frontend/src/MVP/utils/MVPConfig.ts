/**
 * MVP Configuration - Testnet Release
 * 
 * This configuration object controls all MVP testnet behavior.
 * All features are labeled as testnet-only with no real funds.
 * 
 * @reference SRS v2.0 Section 4.3
 * @reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md Section 3.3
 */

export const MVP_CONFIG = {
  /**
   * MVP Mode Flag
   * When true, enables MVP-specific UI and behavior
   */
  IS_MVP: true,

  /**
   * Network Configuration
   * Polygon Amoy Testnet only (no mainnet)
   */
  NETWORK: {
    name: 'Polygon Amoy',
    chainId: 80002,
    rpcUrl: 'https://rpc-amoy.polygon.technology/',
    blockExplorer: 'https://amoy.polygonscan.com/',
    nativeToken: 'MATIC',
  },

  /**
   * Mock Service Flags
   * All services are mocked for testnet
   * Production swap via factory pattern
   */
  MOCK: {
    BANK: true,      // MockBankService vs BIICBankService
    ESCROW: true,    // MockEscrow.sol vs Real Bank Escrow
    GDIZ: true,      // MockGDIZService vs GDIZGateway
    FIAT_RAMP: true, // MockFiatRamp.sol vs Real Fiat Rails
    KYB: true,       // Mock KYB vs Real KYB Provider
  },

  /**
   * Smart Contract Addresses
   * Set post-deployment via deployment script
   * Reference: contracts/MVP/
   */
  CONTRACTS: {
    UPTToken: '',              // Set after deploy
    LiquidityPool: '',         // Set after deploy
    MockEscrow: '',            // Set after deploy
    MockFiatRamp: '',          // Set after deploy
    JurisdictionCompliance: '', // Set after deploy
  },

  /**
   * Investment Limits (Testnet)
   * All values in EUROD (18 decimals)
   */
  LIMITS: {
    MAX_DEPOSIT: 1_000_000n * 10n ** 18n,      // 1M EUROD
    MIN_DEPOSIT: 1_000n * 10n ** 18n,          // 1K EUROD
    DAILY_WITHDRAWAL: 500_000n * 10n ** 18n,   // 500K EUROD
    INSTITUTIONAL_MIN: 100_000n * 10n ** 18n,  // 100K EUROD (KYB threshold)
    RETAIL_MAX: 99_999n * 10n ** 18n,          // 99,999 EUROD
  },

  /**
   * Pool Configuration
   * 5 Pool Families as per SRS v2.0 Section 5.12
   */
  POOLS: {
    POOL_INDUSTRY: {
      id: 'POOL_INDUSTRY',
      name: 'Pool Industry',
      assetClasses: ['Manufacturing', 'GDIZ Partners', 'Production Facilities'],
      targetYield: { min: 10, max: 12 }, // % APY
      lockupDays: 365,
      maxPerIndustrial: 20, // % of pool
      maxPerAssetClass: 40, // % of pool
    },
    POOL_AGRICULTURE: {
      id: 'POOL_AGRICULTURE',
      name: 'Pool Agriculture',
      assetClasses: ['Coffee', 'Cocoa', 'Cotton', 'Cashews', 'Food Crops'],
      targetYield: { min: 12, max: 15 },
      lockupDays: 180,
      maxPerIndustrial: 20,
      maxPerAssetClass: 40,
    },
    POOL_TRADE_FINANCE: {
      id: 'POOL_TRADE_FINANCE',
      name: 'Pool Trade Finance',
      assetClasses: ['Invoice Tokenization', 'Receivables', 'Commercial Paper'],
      targetYield: { min: 8, max: 10 },
      lockupDays: 90,
      maxPerIndustrial: 20,
      maxPerAssetClass: 40,
    },
    POOL_RENEWABLE_ENERGY: {
      id: 'POOL_RENEWABLE_ENERGY',
      name: 'Pool Renewable Energy',
      assetClasses: ['Solar', 'Wind', 'Hydroelectric'],
      targetYield: { min: 9, max: 11 },
      lockupDays: 730,
      maxPerIndustrial: 20,
      maxPerAssetClass: 40,
    },
    POOL_REAL_ESTATE: {
      id: 'POOL_REAL_ESTATE',
      name: 'Pool Real Estate',
      assetClasses: [
        'Commercial Office',
        'Retail Space',
        'Industrial/Warehouse',
        'Residential Apartments',
        'Mixed-Use',
        'Hospitality',
        'Land Bank',
      ],
      targetYield: { min: 8, max: 12 },
      lockupDays: 1095,
      maxPerIndustrial: 20,
      maxPerAssetClass: 40,
    },
  },

  /**
   * FX Configuration
   * EUROD = €1.00 (fixed parity)
   * FCFA: 1 EUR = 655.957 XOF (fixed CFA peg)
   */
  FX: {
    UJEUR_EUR_PARITY: 1.0,      // 1 EUROD = €1.00
    EUR_FCFA_RATE: 655.957,     // 1 EUR = 655.957 XOF
    FX_FEE_INVESTMENT: 0.02,    // 2% fee on EUR→EUROD→FCFA
    FX_FEE_REPAYMENT: 0.02,     // 2% fee on FCFA→EUROD→EUR
  },

  /**
   * Yield Configuration
   * Real math, simulated principal
   */
  YIELD: {
    MANAGEMENT_FEE: 0.02,  // 2% annual
    PERFORMANCE_FEE: 0.20, // 20% of yield above hurdle
    HURDLE_RATE: 0.05,     // 5% minimum return before performance fee
    ACCRUAL_FREQUENCY: 'daily', // Daily yield accrual
  },

  /**
   * Compliance Configuration
   * Strictest jurisdiction list (OFAC + UN + EU + FATF)
   */
  COMPLIANCE: {
    BLOCKED_JURISDICTIONS: [
      { code: 'KP', name: 'North Korea', reason: 'OFAC, UN, EU sanctions' },
      { code: 'IR', name: 'Iran', reason: 'OFAC, UN, EU sanctions' },
      { code: 'SY', name: 'Syria', reason: 'OFAC, UN, EU sanctions' },
      { code: 'CU', name: 'Cuba', reason: 'OFAC sanctions' },
      { code: 'MM', name: 'Myanmar', reason: 'OFAC, EU sanctions' },
      { code: 'BY', name: 'Belarus', reason: 'OFAC, EU sanctions' },
      { code: 'RU', name: 'Russia', reason: 'OFAC, EU sanctions' },
      { code: 'VE', name: 'Venezuela', reason: 'OFAC sanctions' },
      { code: 'SD', name: 'Sudan', reason: 'OFAC sanctions' },
      { code: 'YE', name: 'Yemen', reason: 'UN arms embargo' },
      { code: 'ML', name: 'Mali', reason: 'FATF High-Risk' },
      { code: 'BF', name: 'Burkina Faso', reason: 'FATF High-Risk' },
    ],
    ALLOWED_AFRICAN_MARKETS: [
      'NG', // Nigeria
      'KE', // Kenya
      'ZA', // South Africa
      'GH', // Ghana
      'MU', // Mauritius
      'CI', // Côte d'Ivoire
      'SN', // Senegal
      'TG', // Togo
      'BJ', // Benin
    ],
    ALLOWED_INTERNATIONAL: [
      'EU', // European Union
      'UK', // United Kingdom
      'UAE', // United Arab Emirates
      'SG', // Singapore
      'US', // United States (accredited only)
    ],
    KYB_THRESHOLD_EUR: 100_000, // €100K triggers enhanced KYB
  },

  /**
   * Disclaimer Text
   * Must appear on ALL MVP pages
   */
  DISCLAIMERS: {
    HEADER: '🚀 MVP: Institutional Architecture - Testnet Release',
    FOOTER: 'This is a testnet deployment. No real funds are handled.',
    MODAL: `
      ⚠️ TESTNET DISCLAIMER
      
      This is the Ujamaa DeFi Platform MVP running on Polygon Amoy testnet.
      
      • NO REAL MONEY is involved
      • All tokens are TEST TOKENS only
      • All bank integrations are SIMULATED
      • All yields are SIMULATED using real math
      
      This is for demonstration and testing purposes only.
      
      Production deployment will use:
      • Real EUROD stablecoin (Ondo Finance)
      • Real bank escrow (BIIC (Banque Internationale pour l'Industrie et le Commerce)/MCB)
      • Real fiat on/off ramps
      • Mainnet Polygon (Chain ID: 137)
    `,
  },

  /**
   * Feature Flags
   * Control P0/P1/P2 features
   */
  FEATURES: {
    P0_CORE: true,       // Core investment flows
    P1_ENHANCEMENTS: true, // Deep Dive, Investors Room, Animated Yield
    P2_OPTIONAL: false,   // i18n, Analytics, Before/After Slider
  },

  /**
   * Demo Mode Configuration
   * Pre-filled demo accounts for presentations
   */
  DEMO: {
    ENABLED: true,
    ACCOUNTS: {
      INSTITUTIONAL: {
        address: '0x0000000000000000000000000000000000000001',
        balance: 10_000_000n * 10n ** 18n, // 10M EUROD
        name: 'Logic Capital (Demo)',
      },
      RETAIL: {
        address: '0x0000000000000000000000000000000000000002',
        balance: 50_000n * 10n ** 18n, // 50K EUROD
        name: 'Demo Retail Investor',
      },
      ORIGINATOR: {
        address: '0x0000000000000000000000000000000000000003',
        balance: 1_000_000n * 10n ** 18n, // 1M EUROD
        name: 'GDIZ Industries (Demo)',
      },
    },
  },
} as const;

/**
 * Type definition for MVP Config
 */
export type MVPConfigType = typeof MVP_CONFIG;

/**
 * Helper: Check if mock mode is enabled
 */
export function isMockMode(service: keyof typeof MVP_CONFIG.MOCK): boolean {
  return MVP_CONFIG.MOCK[service];
}

/**
 * Helper: Get pool configuration by ID
 */
export function getPoolConfig(poolId: string): typeof MVP_CONFIG.POOLS[keyof typeof MVP_CONFIG.POOLS] | undefined {
  return Object.values(MVP_CONFIG.POOLS).find(pool => pool.id === poolId);
}

/**
 * Helper: Check if jurisdiction is blocked
 */
export function isJurisdictionBlocked(code: string): boolean {
  return MVP_CONFIG.COMPLIANCE.BLOCKED_JURISDICTIONS.some(
    j => j.code === code
  );
}

/**
 * Helper: Check if jurisdiction is allowed
 */
export function isJurisdictionAllowed(code: string): boolean {
  if (isJurisdictionBlocked(code)) return false;
  
  return (
    MVP_CONFIG.COMPLIANCE.ALLOWED_AFRICAN_MARKETS.includes(code as any) ||
    MVP_CONFIG.COMPLIANCE.ALLOWED_INTERNATIONAL.includes(code as any)
  );
}

/**
 * Helper: Format EUROD with decimals
 */
export function formatUJEUR(amount: bigint, decimals: number = 18): string {
  return (Number(amount) / 10 ** decimals).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default MVP_CONFIG;
