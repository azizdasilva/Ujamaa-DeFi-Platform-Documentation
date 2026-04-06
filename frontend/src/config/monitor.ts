/**
 * Ujamaa Monitor Configuration
 *
 * Configuration for the Ujamaa Monitor dashboard - Polygon Testnet monitoring
 */

// Polygon Amoy Testnet RPC
export const POLYGON_AMOY_RPC = 'https://rpc-amoy.polygon.technology/';

// Chain ID for Polygon Amoy
export const POLYGON_AMOY_CHAIN_ID = 80002;

// Polling intervals (in milliseconds)
export const POLLING_INTERVALS = {
  // Critical KPIs - update frequently
  CRITICAL: 5000, // 5 seconds (NAV, pool balance)
  // Standard KPIs - moderate updates
  STANDARD: 30000, // 30 seconds (holder count, financing count)
  // Historical KPIs - slow updates
  HISTORICAL: 300000, // 5 minutes (default rate, utilization)
  // Event feed polling
  EVENTS: 10000, // 10 seconds
} as const;

// Contract addresses (DEPLOYED ON POLYGON AMOY TESTNET - ALL CONTRACTS)
// All addresses verified via cast code check on-chain
export const CONTRACT_ADDRESSES = {
  ulpToken: '0xb6062A6e63a07C3598629A65ed19021445fB3b26', // ULPToken.sol ✅
  liquidityPool: '0x36e27C0b63103863a8a31a6EadEadEa0a0cDc2cf', // LiquidityPool.sol ✅
  guaranteeToken: '0x081fb064eac4597befbb2e1d36d9a78d63a33958', // GuaranteeToken.sol ✅
  industrialGateway: '0x882071de6689ec1716bd7e162acf50707ac68930', // IndustrialGateway.sol ✅
  jurisdictionCompliance: '0x4eb4c7f57e62a342ac7f322b87a31a7cd54d453c', // JurisdictionCompliance.sol ✅
  mockEscrow: '0x8d446994fcD9906c573500959cDc8A8271a9485F', // MockEscrow.sol ✅
  mockFiatRamp: '0xDC4eFb44fED26593b54cBEEEE9F8b359BAA75A9a', // MockFiatRamp.sol ✅
  navGateway: '0x99712f923e3519B4305CEDAd402904299F29A000', // NavGateway.sol ✅
  mockEUROD: '0xe42253d8bd95f73f1fc2fbdcc15fe498632dd4fc', // MockEUROD.sol ✅
  identityRegistry: '0xB3fb5AB654FC270d10338A64fDBC1E151c223283', // IdentityRegistry.sol ✅
  compliance: '0xb303dFf92f56bFE72eeD3b5F8682E4Cf6260C8F2', // Compliance.sol ✅
} as const;

// KPI Thresholds (Green/Amber/Red)
export const KPI_THRESHOLDS = {
  navChange: {
    green: 2, // < 2%
    amber: 5, // 2-5%
    // red: > 5%
  },
  defaultRate: {
    green: 1, // < 1%
    amber: 2, // 1-2%
    // red: > 2%
  },
  poolUtilization: {
    green: { min: 80, max: 95 }, // 80-95%
    amber: { min: 70, max: 100 }, // 70-80% or 95-100%
    // red: < 70% or 100%
  },
  concentration: {
    green: 10, // < 10%
    amber: 15, // 10-15%
    // red: > 15%
  },
  liquidityRatio: {
    green: 10, // > 10%
    amber: 5, // 5-10%
    // red: < 5%
  },
} as const;

// Feature flags
export const MONITOR_FEATURES = {
  // Use mock data instead of live RPC calls (set to false in production)
  USE_MOCK_DATA: false, // Now using LIVE data from deployed contracts!
  // Enable debug logging
  DEBUG: true,
  // Enable toast notifications for live updates
  ENABLE_TOASTS: true,
} as const;

// Dashboard configuration
export const DASHBOARD_CONFIG = {
  // Number of recent events to display
  MAX_EVENTS_DISPLAY: 50,
  // Time range for event history (in hours)
  EVENT_HISTORY_HOURS: 24,
  // Refresh indicator animation duration (ms)
  REFRESH_ANIMATION_DURATION: 1000,
} as const;

// Helper to check if we're using mock data
export const isMockDataEnabled = (): boolean => {
  return MONITOR_FEATURES.USE_MOCK_DATA;
};

// Helper to get contract address by name
export const getContractAddress = (name: keyof typeof CONTRACT_ADDRESSES): string => {
  return CONTRACT_ADDRESSES[name];
};

// Export all as config object for easy import
export const monitorConfig = {
  rpc: POLYGON_AMOY_RPC,
  chainId: POLYGON_AMOY_CHAIN_ID,
  pollingIntervals: POLLING_INTERVALS,
  contracts: CONTRACT_ADDRESSES,
  thresholds: KPI_THRESHOLDS,
  features: MONITOR_FEATURES,
  dashboard: DASHBOARD_CONFIG,
} as const;
