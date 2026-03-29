/**
 * Smart Contract ABIs for Ujamaa Monitor
 * 
 * Minimal ABIs focused on read-only functions needed for the monitor dashboard
 */

// ULPToken ABI - Yield-bearing ERC-3643 token
export const ULPTOKEN_ABI = [
  {
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ type: 'address', name: 'account' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'navPerShare',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastNavUpdate',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'investor', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'ulpMinted', type: 'uint256' },
    ],
    name: 'DepositReceived',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'investor', type: 'address' },
      { indexed: false, name: 'ulpBurned', type: 'uint256' },
      { indexed: false, name: 'eurodAmount', type: 'uint256' },
    ],
    name: 'RedemptionRequested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'navPerShare', type: 'uint256' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'NAVUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'YieldAccrued',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const;

// LiquidityPool ABI
export const LIQUIDITY_POOL_ABI = [
  {
    inputs: [],
    name: 'getPoolBalance',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getActiveFinancingsCount',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDefaultRate',
    outputs: [{ type: 'uint256' }], // Basis points (100 = 1%)
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUtilizationRate',
    outputs: [{ type: 'uint256' }], // Basis points (8700 = 87%)
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getYieldAccrued24h',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalValueLocked',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'industrial', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'guaranteeId', type: 'uint256' },
    ],
    name: 'FinancingApproved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'industrial', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
    name: 'FinancingRepaid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'industrial', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'guaranteeId', type: 'uint256' },
    ],
    name: 'FinancingDefaulted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'investor', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
    name: 'PoolDeposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'investor', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
    name: 'PoolWithdrawal',
    type: 'event',
  },
] as const;

// GuaranteeToken ABI (ERC-3643NFT)
export const GUARANTEE_TOKEN_ABI = [
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ type: 'uint256', name: 'tokenId' }],
    name: 'getGuarantee',
    outputs: [{
      type: 'tuple',
      components: [
        { type: 'uint256', name: 'certificateId' },
        { type: 'uint256', name: 'merchandiseValue' },
        { type: 'uint256', name: 'expiryDate' },
        { type: 'address', name: 'industrial' },
        { type: 'bool', name: 'isRedeemed' },
        { type: 'bool', name: 'isDefaulted' },
        { type: 'bytes32', name: 'stockHash' },
      ],
    }],
    stateMutability: 'view',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: true, name: 'industrial', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'GuaranteeMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: true, name: 'industrial', type: 'address' },
    ],
    name: 'GuaranteeRedeemed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: true, name: 'buyer', type: 'address' },
      { indexed: false, name: 'price', type: 'uint256' },
    ],
    name: 'GuaranteeLiquidated',
    type: 'event',
  },
] as const;

// IndustrialGateway ABI
export const INDUSTRIAL_GATEWAY_ABI = [
  {
    inputs: [],
    name: 'getRegisteredIndustrialsCount',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPendingApprovalsCount',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'industrial', type: 'address' },
      { indexed: false, name: 'companyName', type: 'string' },
    ],
    name: 'IndustrialRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'industrial', type: 'address' },
      { indexed: false, name: 'certificateId', type: 'bytes32' },
    ],
    name: 'IndustrialVerified',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'industrial', type: 'address' },
      { indexed: false, name: 'guaranteeId', type: 'uint256' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'StockCertified',
    type: 'event',
  },
] as const;

// Export all ABIs as a map for easy access
export const CONTRACT_ABIS = {
  ulpToken: ULPTOKEN_ABI,
  liquidityPool: LIQUIDITY_POOL_ABI,
  guaranteeToken: GUARANTEE_TOKEN_ABI,
  industrialGateway: INDUSTRIAL_GATEWAY_ABI,
} as const;
