/**
 * Mock Data Service for Ujamaa Monitor
 * 
 * Simulates live blockchain data for testing and development
 * Toggle USE_MOCK_DATA in config/monitor.ts to switch between mock and live
 */

import type { Address } from 'viem';

// Mock contract addresses (matching config)
const MOCK_ADDRESSES = {
  ulpToken: '0x0000000000000000000000000000000000000001',
  liquidityPool: '0x0000000000000000000000000000000000000002',
  guaranteeToken: '0x0000000000000000000000000000000000000003',
  industrialGateway: '0x0000000000000000000000000000000000000004',
} as const;

// Base values that will have slight variations on each call
let baseNavPerShare = 1023400000000000000n; // 1.0234 (18 decimals)
let basePoolBalance = 2543210000000000000000000n; // €2.54M (18 decimals)
let baseYieldAccrued = 1234000000000000000000n; // €1,234 (18 decimals)

// Helper to add small random variation
const varyValue = (baseValue: bigint, variancePercent: number): bigint => {
  const variance = (baseValue * BigInt(Math.floor(Math.random() * variancePercent * 2))) / 100n;
  const sign = Math.random() > 0.5 ? 1n : -1n;
  return baseValue + (variance * sign);
};

// Helper to generate random address
const randomAddress = (): Address => {
  const chars = '0123456789abcdef';
  let addr = '0x';
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr as Address;
};

// Mock event data
const mockEventDescriptions = [
  { type: 'DepositReceived', prefix: '📥', templates: ['Investor deposited €{amount}', 'New investment of €{amount}'] },
  { type: 'FinancingApproved', prefix: '✅', templates: ['€{amount} to {industrial}', 'Financing approved: €{amount}'] },
  { type: 'GuaranteeMinted', prefix: '🏭', templates: ['UJG #{tokenId} minted for stock', 'Collateral NFT #{tokenId} created'] },
  { type: 'YieldAccrued', prefix: '📈', templates: ['+€{amount} yield (24h)', 'Yield accrued: €{amount}'] },
  { type: 'FinancingRepaid', prefix: '💰', templates: ['Repayment of €{amount} received', 'Loan repaid: €{amount}'] },
  { type: 'IndustrialRegistered', prefix: '🏢', templates: ['New industrial registered', 'Company onboarded'] },
] as const;

const mockIndustrialNames = [
  'SIPI Cotton',
  'GDIZ Textiles',
  'Benin Cashews',
  'Togo Cocoa',
  'Ghana Gold Mining',
  'Nigeria Manufacturing',
  'Kenya Coffee Co',
  'Ethiopia Textiles',
];

// Generate mock events
const generateMockEvents = (count: number = 20) => {
  const events: Array<{
    type: string;
    description: string;
    timestamp: Date;
    txHash: string;
    amount?: number;
    industrial?: string;
    tokenId?: number;
  }> = [];

  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const eventTemplate = mockEventDescriptions[Math.floor(Math.random() * mockEventDescriptions.length)];
    const amount = Math.floor(Math.random() * 500000) + 50000; // €50K - €550K
    const industrial = mockIndustrialNames[Math.floor(Math.random() * mockIndustrialNames.length)];
    const tokenId = Math.floor(Math.random() * 100) + 1;
    
    const template = eventTemplate.templates[Math.floor(Math.random() * eventTemplate.templates.length)];
    const description = template
      .replace('{amount}', (amount / 1000).toFixed(1) + 'K')
      .replace('{industrial}', industrial)
      .replace('{tokenId}', tokenId.toString());

    events.push({
      type: eventTemplate.type,
      description,
      timestamp: new Date(now - Math.random() * 24 * 60 * 60 * 1000), // Last 24 hours
      txHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      amount,
      industrial,
      tokenId,
    });
  }

  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Main mock data object
export const mockData = {
  // ULPToken data
  ulpToken: {
    name: 'Ujamaa Pool Token',
    symbol: 'uLP',
    totalSupply: () => varyValue(2487654000000000000000000n, 1), // ~2.48M tokens
    navPerShare: () => varyValue(baseNavPerShare, 0.1), // 1.0234 with tiny variance
    lastNavUpdate: () => BigInt(Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 300)), // Last 5 min
    totalHolders: () => 47 + Math.floor(Math.random() * 5), // 47-52 holders
  },

  // LiquidityPool data
  liquidityPool: {
    poolBalance: () => varyValue(basePoolBalance, 2), // ~€2.54M
    activeFinancingsCount: () => 12n + BigInt(Math.floor(Math.random() * 3)), // 12-14
    defaultRate: () => 80n + BigInt(Math.floor(Math.random() * 40)), // 0.80% - 1.20% (basis points * 100)
    utilizationRate: () => 8500n + BigInt(Math.floor(Math.random() * 400)), // 85% - 89%
    yieldAccrued24h: () => varyValue(baseYieldAccrued, 10), // ~€1,234
    totalValueLocked: () => varyValue(3500000000000000000000000n, 2), // ~€3.5M
  },

  // GuaranteeToken data
  guaranteeToken: {
    totalSupply: () => 23n + BigInt(Math.floor(Math.random() * 5)), // 23-27 NFTs
    activeGuarantees: () => 18n + BigInt(Math.floor(Math.random() * 3)), // 18-20
    redeemedGuarantees: () => 5n + BigInt(Math.floor(Math.random() * 2)), // 5-6
    totalCollateralValue: () => varyValue(987654000000000000000000n, 2), // ~€987K
  },

  // IndustrialGateway data
  industrialGateway: {
    registeredIndustrials: () => 15n + BigInt(Math.floor(Math.random() * 3)), // 15-17
    pendingApprovals: () => 2n + BigInt(Math.floor(Math.random() * 2)), // 2-3
  },

  // Event feed
  events: generateMockEvents(20),

  // Refresh events periodically
  refreshEvents: () => {
    const newEvents = generateMockEvents(Math.floor(Math.random() * 5) + 1);
    mockData.events = [...newEvents, ...mockData.events].slice(0, 50);
    return mockData.events;
  },
};

// Mock data fetchers (mirror the RPC interface)
export const mockReaders = {
  ulpToken: {
    async getName(): Promise<string> {
      return mockData.ulpToken.name;
    },
    async getSymbol(): Promise<string> {
      return mockData.ulpToken.symbol;
    },
    async getTotalSupply(): Promise<bigint> {
      return mockData.ulpToken.totalSupply();
    },
    async getNavPerShare(): Promise<bigint> {
      return mockData.ulpToken.navPerShare();
    },
    async getLastNavUpdate(): Promise<bigint> {
      return mockData.ulpToken.lastNavUpdate();
    },
  },

  liquidityPool: {
    async getPoolBalance(): Promise<bigint> {
      return mockData.liquidityPool.poolBalance();
    },
    async getActiveFinancingsCount(): Promise<bigint> {
      return mockData.liquidityPool.activeFinancingsCount();
    },
    async getDefaultRate(): Promise<bigint> {
      return mockData.liquidityPool.defaultRate();
    },
    async getUtilizationRate(): Promise<bigint> {
      return mockData.liquidityPool.utilizationRate();
    },
    async getYieldAccrued24h(): Promise<bigint> {
      return mockData.liquidityPool.yieldAccrued24h();
    },
    async getTotalValueLocked(): Promise<bigint> {
      return mockData.liquidityPool.totalValueLocked();
    },
  },

  guaranteeToken: {
    async getTotalSupply(): Promise<bigint> {
      return mockData.guaranteeToken.totalSupply();
    },
  },

  industrialGateway: {
    async getRegisteredIndustrialsCount(): Promise<bigint> {
      return mockData.industrialGateway.registeredIndustrials();
    },
    async getPendingApprovalsCount(): Promise<bigint> {
      return mockData.industrialGateway.pendingApprovals();
    },
  },

  events: {
    async getRecent(): Promise<typeof mockData.events> {
      return mockData.events;
    },
  },
};

// Export for easy access
export default mockData;
