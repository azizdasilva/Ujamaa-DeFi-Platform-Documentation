/**
 * Wallet Hooks - Ujamaa DeFi Platform
 * Custom hooks for wallet connection and management
 *
 * @notice MVP TESTNET: Polygon Amoy Testnet (Chain ID: 80002)
 */

import { useState, useCallback, useEffect } from 'react';
import {
  useAccount as useWagmiAccount,
  useConnect as useWagmiConnect,
  useDisconnect as useWagmiDisconnect,
  useSwitchChain as useWagmiSwitchChain,
  useBalance as useWagmiBalance,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { web3Config } from '../config/web3';

const STORAGE_KEY = 'ujamaa_wallet_connected';

/**
 * useAccount
 * Returns current wallet account information
 */
export function useAccount() {
  const wagmiAccount = useWagmiAccount();

  return {
    address: wagmiAccount.address,
    isConnected: wagmiAccount.isConnected,
    isConnecting: wagmiAccount.isConnecting,
    isDisconnected: wagmiAccount.isDisconnected,
    chainId: wagmiAccount.chainId,
    chain: wagmiAccount.chain,
    addressShort: wagmiAccount.address
      ? `${wagmiAccount.address.slice(0, 6)}...${wagmiAccount.address.slice(-4)}`
      : undefined,
  };
}

/**
 * useConnect
 * Hook for connecting wallet
 */
export function useConnect() {
  const { connect, connectors, status, error } = useWagmiConnect();

  const connectMetaMask = useCallback(() => {
    const metaMaskConnector = connectors.find((c) => c.id === 'metaMask' || c.id === 'injected');
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  }, [connect, connectors]);

  return {
    connect: connectMetaMask,
    connectManual: connect,
    connectors,
    status,
    isConnecting: status === 'pending',
    error,
  };
}

/**
 * useDisconnect
 * Hook for disconnecting wallet
 */
export function useDisconnect() {
  const { disconnect } = useWagmiDisconnect();

  return {
    disconnect,
  };
}

/**
 * useSwitchNetwork
 * Hook for switching to Polygon Amoy testnet
 */
export function useSwitchNetwork() {
  const { switchChain } = useWagmiSwitchChain();

  const switchToPolygonAmoy = useCallback(() => {
    if (switchChain) {
      switchChain({ chainId: polygonAmoy.id });
    }
  }, [switchChain]);

  return {
    switchChain: switchToPolygonAmoy,
    switchChainManual: switchChain,
    isWrongNetwork: true, // Will be calculated in component
  };
}

/**
 * useBalance
 * Hook for fetching wallet balance
 */
export function useBalance(address?: `0x${string}`) {
  const { data, isLoading, error } = useWagmiBalance({
    address: address,
    chainId: polygonAmoy.id,
  });

  // Format balance from bigint to readable string
  const formatBalance = (value: bigint, decimals: number): string => {
    return (Number(value) / Math.pow(10, decimals)).toFixed(4);
  };

  return {
    balance: data?.value,
    balanceFormatted: data?.value && data?.decimals ? formatBalance(data.value, data.decimals) : '0.0000',
    symbol: data?.symbol,
    decimals: data?.decimals,
    isLoading,
    error,
  };
}

/**
 * useWallet
 * Combined hook for wallet management
 * Provides all wallet-related functionality in one hook
 */
export function useWallet() {
  const account = useAccount();
  const { connect, status, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchNetwork();
  const balance = useBalance(account.address as `0x${string}` | undefined);

  const [isConnecting, setIsConnecting] = useState(false);

  // Check if on correct network
  const isOnCorrectNetwork = account.chainId === polygonAmoy.id;
  const isWrongNetwork = account.isConnected && !isOnCorrectNetwork;

  // Persist connection state
  useEffect(() => {
    if (account.isConnected) {
      localStorage.setItem(STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [account.isConnected]);

  // Handle connection with network check
  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    try {
      connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [connect]);

  // Enhanced disconnect with cleanup
  const handleDisconnect = useCallback(() => {
    disconnect();
    localStorage.removeItem(STORAGE_KEY);
  }, [disconnect]);

  // Auto-switch to Polygon Amoy when connected on wrong network
  useEffect(() => {
    if (isWrongNetwork && account.isConnected) {
      switchChain();
    }
  }, [isWrongNetwork, account.isConnected, switchChain]);

  return {
    // Account
    address: account.address,
    addressShort: account.addressShort,
    isConnected: account.isConnected,
    isConnecting: isConnecting || account.isConnecting,
    isDisconnected: account.isDisconnected,

    // Network
    chainId: account.chainId,
    isOnCorrectNetwork,
    isWrongNetwork,

    // Balance
    balance: balance.balance,
    balanceFormatted: balance.balanceFormatted,
    balanceSymbol: balance.symbol,

    // Actions
    connect: handleConnect,
    disconnect: handleDisconnect,
    switchToPolygonAmoy: switchChain,

    // Status
    status,
    error: connectError,

    // Config
    chainConfig: web3Config.NETWORK,
    faucets: web3Config.FAUCETS,
  };
}

/**
 * useContractWrite
 * Hook for writing to smart contracts
 */
export function useContractWrite() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    writeContract,
    hash,
    error,
    isPending,
    isConfirming,
    isSuccess,
    isLoading: isPending || isConfirming,
  };
}

export default useWallet;
