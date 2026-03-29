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
// Deployed: 2026-03-29 (Complete deployment with Gateway contracts)
// Naming convention: Gateway = bi-directional data flow (per nomenclature)
export const CONTRACT_ADDRESSES = {
  ulpToken: '0x64a2FD95A9fed63e45aaF10243858aC7d53AdFbB', // ULPToken.sol
  liquidityPool: '0x23554F5dF29D86e50580205EEBa0D44f90139ff8', // LiquidityPool.sol
  guaranteeToken: '0x8E612531A801d2Aa7C87BBe2431B0f0A45e0cD99', // GuaranteeToken.sol
  industrialGateway: '0x70Bb787c93140fa3201eAdf0D49Cb973a2cE11B7', // IndustrialGateway.sol
  jurisdictionCompliance: '0x670F8F25b818dbd2404c54DEbd870b1bEFCfeB47', // JurisdictionCompliance.sol
  mockEscrow: '0xE72101D1F46aA245AcD4D3D1301323A67286CbC7', // MockEscrow.sol
  mockFiatRamp: '0xe0B927De189Fb243A2357ecc400bB4Fe9aD511BB', // MockFiatRamp.sol
  navGateway: '0xfe4685FC18A3991D520E04292F45fACb507181DB', // NavGateway.sol (was NavOracle)
  mockEUROD: '0xd631ccebA96E166E18f6143d57A5f2622eC3c9c9', // MockEUROD.sol (was MockUJEUR)
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
