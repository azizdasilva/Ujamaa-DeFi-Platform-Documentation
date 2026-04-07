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
// UPDATED: 2026-04-06 - Full redeployment with ERC-3643NFT GuaranteeTokenizer
export const CONTRACT_ADDRESSES = {
  ulpToken: '0x8F8615bc8ebD885Ee5212d9F3faEC2C9A560C4c8',
  liquidityPool: '0x465CCDe6d2B228278eEB5c36606058D03859F67A',
  guaranteeToken: '0x7600C0b36F73028f866081823Fa691fF4688CeE0',
  industrialGateway: '0xf1119462800d2f038aF0c61D874B52521bF22459',
  jurisdictionCompliance: '0xB4885b421Bef3112eD15e625581bA03CA0419e4e',
  mockEscrow: '0xF372Aa2E48B74d584eD1A3ECfC65b93046D8Efcb',
  mockFiatRamp: '0x9E3e2037C3F743a9e1527B6e52f9Bc620215f088',
  navGateway: '0x01dF9667F68505d2561d890A8314fAac54eE1073',
  mockEUROD: '0xAf5904C33723026a5D79a1879A8455047916bd1B',
  identityRegistry: '0x085a788194625e95f8060f9B561f4358aD1b3Ed7',
  compliance: '0x11a4c694e07e14F5231cf4Db0b483B65018b2583',
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
