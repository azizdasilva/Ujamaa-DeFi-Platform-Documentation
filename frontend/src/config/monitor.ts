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
// Deployed: 2026-03-29 (Fixed: added getPendingApprovalsCount to IndustrialGateway)
// Naming convention: Gateway = bi-directional data flow (per nomenclature)
export const CONTRACT_ADDRESSES = {
  ulpToken: '0xb6062a6e63a07c3598629a65ed19021445fb3b26', // ULPToken.sol
  liquidityPool: '0x36e27C0b63103863a8a31a6EadEad0a0cDc2cfec', // LiquidityPool.sol
  guaranteeToken: '0x83e20A9516B82f0B1bd0ee57882ef35F9553B469', // GuaranteeToken.sol
  industrialGateway: '0x882071de6689eC1716BD7e162Acf50707AC68930', // IndustrialGateway.sol
  jurisdictionCompliance: '0x4eB4c7F57E62A342aC7F322B87a31a7cd54D453C', // JurisdictionCompliance.sol
  mockEscrow: '0x8d446994fcD9906c573500959cDc8A8271a9485F', // MockEscrow.sol
  mockFiatRamp: '0xDC4eFb44fED26593b54cBEEEE9F8b359BAA75A9a', // MockFiatRamp.sol
  navGateway: '0x99712f923e3519B4305CEDAd40290428299F29A0', // NavGateway.sol
  mockEUROD: '0x787C5c0365829ABF88a3D8404E9488d1e307eD43', // MockEUROD.sol
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
