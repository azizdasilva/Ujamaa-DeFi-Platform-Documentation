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
// Deployed: 2026-03-29 (Fixed: added totalSupply() to GuaranteeToken)
// Naming convention: Gateway = bi-directional data flow (per nomenclature)
export const CONTRACT_ADDRESSES = {
  ulpToken: '0xD0b598bF1a0E4eFB2CD88b15026E571A33C6b663', // ULPToken.sol
  liquidityPool: '0x423D4205b0bdf91fA5378f6225c07498B1E316a3', // LiquidityPool.sol
  guaranteeToken: '0xd6dfEf255b54CB8e57C0C6DF3eD3B8e42882DecF', // GuaranteeToken.sol
  industrialGateway: '0xc119aBeD58C90779889c0A5559E052Ec7dFF8aFB', // IndustrialGateway.sol
  jurisdictionCompliance: '0xE02cec7436cf10198785D3F0314b404B2f4520c1', // JurisdictionCompliance.sol
  mockEscrow: '0xd28A63aD25D031F7F1744198326840ee19810A7f', // MockEscrow.sol
  mockFiatRamp: '0x009E5A7fd96CB34817Dd50aeD6d5ADd3D15F34F3', // MockFiatRamp.sol
  navGateway: '0xe2f539aE563FbF05b12891eA0c45B84047D8C4A2', // NavGateway.sol
  mockEUROD: '0x8128aA88F84253ca94F6ca8EF494D9d66e52c790', // MockEUROD.sol
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
