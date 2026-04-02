/**
 * Web3 Configuration - MetaMask & Polygon Testnet
 * 
 * @notice MVP TESTNET: Polygon Amoy Testnet (Chain ID: 80002)
 */

export const web3Config = {
  // Network Configuration
  NETWORK: {
    NAME: 'Polygon Amoy Testnet',
    CHAIN_ID: '0x13882', // 80002 in hex
    CHAIN_ID_DECIMAL: 80002,
    RPC_URL: 'https://rpc-amoy.polygon.technology/',
    BLOCK_EXPLORER: 'https://amoy.polygonscan.com/',
    NATIVE_TOKEN: {
      SYMBOL: 'POL',
      NAME: 'Polygon',
      DECIMALS: 18,
    },
  },

  // MetaMask Configuration
  METAMASK: {
    DETECTED: typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined',
    DOWNLOAD_URL: 'https://metamask.io/download/',
  },

  // Contract Addresses (Polygon Amoy Testnet - DEPLOYED & VERIFIED)
  // Deployed via Foundry - All contracts verified on Polygon Amoy Scan
  // Updated: 2026-04-02
  CONTRACTS: {
    ULP_TOKEN: '0xb6062A6e63a07C3598629A65ed19021445fB3b26', // ✅ Deployed
    UAT_TOKEN: '0x0000000000000000000000000000000000000000', // TODO: Deploy
    UGT_TOKEN: '0x081fb064eac4597befbb2e1d36d9a78d63a33958', // ✅ Deployed (Guarantee Token) - UPDATED
    LIQUIDITY_POOL: '0x36e27C0b63103863a8a31a6EadEadEa0a0cDc2cfec', // ✅ Deployed
    INDUSTRIAL_GATEWAY: '0x882071de6689ec1716bd7e162acf50707ac68930', // ✅ Deployed - UPDATED
    JURISDICTION_COMPLIANCE: '0x4eb4c7f57e62a342ac7f322b87a31a7cd54d453c', // ✅ Deployed
    MOCK_FIAT_RAMP: '0xDC4eFb44fED26593b54cBEEEE9F8b359BAA75A9a', // ✅ Deployed
    MOCK_ESCROW: '0x8d446994fcD9906c573500959cDc8A8271a9485F', // ✅ Deployed
    NAV_GATEWAY: '0x99712f923e3519B4305CEDAd402904299F29A0', // ✅ Deployed
    MOCK_EUROD: '0xe42253d8bd95f73f1fc2fbdcc15fe498632dd4fc', // ✅ Deployed - UPDATED
  },

  // Testnet Faucets
  FAUCETS: {
    POLYGON_AMOY: 'https://faucet.polygon.technology/',
    ALTERNATIVE: 'https://amoyfaucet.com/',
  },

  // Wallet Connection Settings
  WALLET: {
    AUTO_CONNECT: true,
    RECONNECT_ON_REFRESH: true,
    SHOW_BALANCE: true,
    SUPPORT_CHAINS: [80002], // Polygon Amoy only for MVP
  },

  // Transaction Settings
  TRANSACTIONS: {
    GAS_LIMIT_BUFFER: 1.2, // 20% buffer
    DEFAULT_GAS_PRICE: '20000000000', // 20 Gwei
    MAX_RETRIES: 3,
    CONFIRMATIONS_REQUIRED: 1,
  },

  // Error Messages
  ERRORS: {
    WALLET_NOT_CONNECTED: 'Wallet not connected. Please connect MetaMask.',
    WRONG_NETWORK: 'Wrong network. Please switch to Polygon Amoy Testnet.',
    USER_REJECTED: 'Transaction rejected by user.',
    INSUFFICIENT_BALANCE: 'Insufficient POL balance for gas fees.',
    CONTRACT_NOT_DEPLOYED: 'Contract not deployed yet.',
    METAMASK_NOT_INSTALLED: 'MetaMask not installed. Please install from metamask.io',
  },

  // Testnet Disclaimer
  DISCLAIMER: `
🚀 MVP TESTNET - Polygon Amoy

• This is a TESTNET deployment
• NO REAL MONEY is involved
• All tokens are TEST TOKENS only
• Get test POL from: https://faucet.polygon.technology/
• Chain ID: 80002
  `.trim(),
} as const;

// Type definitions
export type Web3Config = typeof web3Config;
export type NetworkConfig = typeof web3Config.NETWORK;
export type ContractAddresses = typeof web3Config.CONTRACTS;

export default web3Config;
