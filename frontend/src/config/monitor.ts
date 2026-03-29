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
// Deployed: 2026-03-29 (Fixed: added getRegisteredIndustrialsCount to IndustrialGateway)
// Naming convention: Gateway = bi-directional data flow (per nomenclature)
export const CONTRACT_ADDRESSES = {
  ulpToken: '0xa92Dd4E15F4d535BAb3A586C3F3c17E679b92679', // ULPToken.sol
  liquidityPool: '0xf540D4D0e3088841c08637Be3680fFF0c76bBC25', // LiquidityPool.sol
  guaranteeToken: '0x83e20A9516B82f0B1bd0ee57882ef35F9553B469', // GuaranteeToken.sol
  industrialGateway: '0xC8a86Ca26e855a0b2e3f4A79B52b2E39fCA730c6', // IndustrialGateway.sol
  jurisdictionCompliance: '0x640755367C3bBD99B112324f4Bf0e603aa467257', // JurisdictionCompliance.sol
  mockEscrow: '0x3736e65d3A238d35aD74690279DfAdc9046Af026', // MockEscrow.sol
  mockFiatRamp: '0xcecc9d1869D9bdc03B1666F8a1BAEC10097dBDC5', // MockFiatRamp.sol
  navGateway: '0x3b0DE2895c951a43eA2cbE98F4310a6407A1F07A', // NavGateway.sol
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
