/**
 * Wagmi Configuration - Ujamaa DeFi Platform
 * Wallet connection setup for Polygon Amoy Testnet
 *
 * @notice MVP TESTNET: Polygon Amoy Testnet (Chain ID: 80002)
 */

import { http, createConfig } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { web3Config } from '../config/web3';

// Get WalletConnect project ID from environment or use default
const walletConnectProjectId = (import.meta as any).env?.VITE_WALLET_CONNECT_PROJECT_ID || 'default';

/**
 * Wagmi Config
 * Configures wallet connectors and network settings
 */
export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [
    // MetaMask (injected provider)
    injected({
      target: 'metaMask',
    }),
    // WalletConnect (for mobile wallets)
    walletConnect({
      projectId: walletConnectProjectId,
      showQrModal: true,
    }),
  ],
  transports: {
    [polygonAmoy.id]: http(web3Config.NETWORK.RPC_URL),
  },
});

// Type exports
export type WagmiConfig = typeof config;

export default config;
