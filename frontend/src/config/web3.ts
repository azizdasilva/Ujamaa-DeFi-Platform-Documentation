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
    ULP_TOKEN: '0x8F8615bc8ebD885Ee5212d9F3faEC2C9A560C4c8', // ✅ Deployed - UPDATED 2026-04-06
    UAT_TOKEN: '0x0000000000000000000000000000000000000000', // TODO: Deploy
    UGT_TOKEN: '0x7600C0b36F73028f866081823Fa691fF4688CeE0', // ✅ Deployed ERC-3643NFT - UPDATED 2026-04-06
    LIQUIDITY_POOL: '0x465CCDe6d2B228278eEB5c36606058D03859F67A', // ✅ Deployed - UPDATED 2026-04-06
    INDUSTRIAL_GATEWAY: '0xf1119462800d2f038aF0c61D874B52521bF22459', // ✅ Deployed - UPDATED 2026-04-06
    JURISDICTION_COMPLIANCE: '0xB4885b421Bef3112eD15e625581bA03CA0419e4e', // ✅ Deployed - UPDATED 2026-04-06
    MOCK_FIAT_RAMP: '0x9E3e2037C3F743a9e1527B6e52f9Bc620215f088', // ✅ Deployed - UPDATED 2026-04-06
    MOCK_ESCROW: '0xF372Aa2E48B74d584eD1A3ECfC65b93046D8Efcb', // ✅ Deployed - UPDATED 2026-04-06
    NAV_GATEWAY: '0x01dF9667F68505d2561d890A8314fAac54eE1073', // ✅ Deployed - UPDATED 2026-04-06
    MOCK_EUROD: '0xAf5904C33723026a5D79a1879A8455047916bd1B', // ✅ Deployed - UPDATED 2026-04-06
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
