/**
 * Ujamaa DeFi Platform - Frontend Configuration
 * MVP Testnet Release
 * 
 * @reference 04_DESIGN_SYSTEM_SPECIFICATION.md
 */

export const config = {
  // Application
  APP_NAME: 'Ujamaa DeFi Platform',
  APP_VERSION: '2.0.0-mvp',
  APP_ENV: 'testnet',
  
  // Network
  NETWORK: {
    NAME: 'Polygon Amoy',
    CHAIN_ID: 80002,
    RPC_URL: 'https://rpc-amoy.polygon.technology/',
    BLOCK_EXPLORER: 'https://amoy.polygonscan.com/',
    NATIVE_TOKEN: 'MATIC',
  },
  
  // Testnet Flags
  IS_TESTNET: true,
  IS_MVP: true,
  
  // Mock Services
  MOCK: {
    BANK: true,
    ESCROW: true,
    GDIZ: true,
    FIAT_RAMP: true,
    KYB: true,
  },
  
  // Investment Limits (EUROD)
  LIMITS: {
    MIN_DEPOSIT: 1_000,
    MAX_DEPOSIT: 1_000_000,
    DAILY_WITHDRAWAL: 500_000,
    INSTITUTIONAL_MIN: 100_000,
    RETAIL_MAX: 99_999,
  },
  
  // Pool Families
  POOLS: {
    POOL_INDUSTRY: {
      id: 'POOL_INDUSTRY',
      name: 'Pool Industry',
      targetYieldMin: 10,
      targetYieldMax: 12,
      lockupDays: 365,
      riskLevel: 'medium',
    },
    POOL_AGRICULTURE: {
      id: 'POOL_AGRICULTURE',
      name: 'Pool Agriculture',
      targetYieldMin: 12,
      targetYieldMax: 15,
      lockupDays: 180,
      riskLevel: 'medium',
    },
    POOL_TRADE_FINANCE: {
      id: 'POOL_TRADE_FINANCE',
      name: 'Pool Trade Finance',
      targetYieldMin: 8,
      targetYieldMax: 10,
      lockupDays: 90,
      riskLevel: 'low',
    },
    POOL_RENEWABLE_ENERGY: {
      id: 'POOL_RENEWABLE_ENERGY',
      name: 'Pool Renewable Energy',
      targetYieldMin: 9,
      targetYieldMax: 11,
      lockupDays: 730,
      riskLevel: 'low',
    },
    POOL_REAL_ESTATE: {
      id: 'POOL_REAL_ESTATE',
      name: 'Pool Real Estate',
      targetYieldMin: 8,
      targetYieldMax: 12,
      lockupDays: 1095,
      riskLevel: 'medium',
    },
  },
  
  // Compliance
  COMPLIANCE: {
    BLOCKED_JURISDICTIONS: [
      'KP', 'IR', 'SY', 'CU', 'MM', 'BY', 'RU', 'VE', 'SD', 'YE', 'ML', 'BF',
    ],
    ALLOWED_AFRICAN: ['NG', 'KE', 'ZA', 'GH', 'MU', 'CI', 'SN', 'TG', 'BJ'],
    ALLOWED_INTERNATIONAL: ['EU', 'UK', 'UAE', 'SG', 'US'],
  },
  
  // Fees
  FEES: {
    MANAGEMENT_FEE: 2, // 2% annual
    PERFORMANCE_FEE: 20, // 20% of yield above hurdle
    HURDLE_RATE: 5, // 5% minimum
    FX_FEE: 2, // 2% on FX conversion
  },
  
  // Disclaimer Text
  DISCLAIMER: {
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
• Real bank escrow (BIIC/MCB)
• Real fiat on/off ramps
• Mainnet Polygon (Chain ID: 137)
    `.trim(),
  },
  
  // API Configuration
  API: {
    BASE_URL: 'http://localhost:8000',
    VERSION: 'v2',
    RATE_LIMIT_PUBLIC: 100, // per minute
    RATE_LIMIT_AUTHENTICATED: 1000, // per hour
  },
  
  // Demo Mode
  DEMO: {
    ENABLED: true,
    INSTITUTIONAL_BALANCE: 10_000_000, // 10M EUROD
    RETAIL_BALANCE: 50_000, // 50K EUROD
    ORIGINATOR_BALANCE: 1_000_000, // 1M EUROD
  },
} as const;

export default config;
