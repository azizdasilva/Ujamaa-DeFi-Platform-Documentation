/**
 * useWallet Hook - MetaMask Integration
 * 
 * Provides wallet connection, network switching, and transaction signing
 * for Polygon Amoy Testnet.
 * 
 * @notice MVP TESTNET: Polygon Amoy (Chain ID: 80002)
 */

import { useState, useEffect, useCallback } from 'react';
import { web3Config } from '../config/web3';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  isConnecting: boolean;
  error: string | null;
}

interface UseWalletReturn extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (to: string, value: string, data?: string) => Promise<string>;
  refreshBalance: () => Promise<void>;
}

/**
 * Hook for MetaMask wallet connection
 */
export function useWallet(): UseWalletReturn {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    isConnecting: false,
    error: null,
  });

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';

  // Get Ethereum provider
  const getProvider = () => {
    if (!isMetaMaskInstalled) {
      throw new Error(web3Config.ERRORS.METAMASK_NOT_INSTALLED);
    }
    return (window as any).ethereum;
  };

  // Convert hex chainId to number
  const hexToDecimal = (hex: string): number => {
    return parseInt(hex, 16);
  };

  // Format address for display
  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get balance in POL
  const getBalance = useCallback(async (address: string) => {
    try {
      const provider = getProvider();
      const balance = await provider.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      
      // Convert from wei to POL (18 decimals)
      const balanceInPOL = (parseInt(balance, 16) / 1e18).toFixed(4);
      setWalletState(prev => ({ ...prev, balance: balanceInPOL }));
    } catch (error) {
      console.error('Error getting balance:', error);
      setWalletState(prev => ({ ...prev, balance: '0.0000' }));
    }
  }, []);

  // Connect to MetaMask
  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled) {
      window.open(web3Config.METAMASK.DOWNLOAD_URL, '_blank');
      return;
    }

    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const provider = getProvider();
      
      // Request account access
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });

      // Get chain ID
      const chainId = await provider.request({
        method: 'eth_chainId',
      });

      // Check if on correct network
      const chainIdDecimal = hexToDecimal(chainId);
      if (chainIdDecimal !== web3Config.NETWORK.CHAIN_ID_DECIMAL) {
        await switchNetwork();
      }

      // Get balance
      await getBalance(accounts[0]);

      setWalletState({
        isConnected: true,
        address: accounts[0],
        chainId: chainIdDecimal,
        balance: walletState.balance,
        isConnecting: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || web3Config.ERRORS.WALLET_NOT_CONNECTED,
      }));
    }
  }, [getBalance, walletState.balance]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  // Switch to Polygon Amoy network
  const switchNetwork = useCallback(async () => {
    try {
      const provider = getProvider();
      
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3Config.NETWORK.CHAIN_ID }],
      });
    } catch (error: any) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        try {
          const provider = getProvider();
          
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: web3Config.NETWORK.CHAIN_ID,
                chainName: web3Config.NETWORK.NAME,
                nativeCurrency: web3Config.NETWORK.NATIVE_TOKEN,
                rpcUrls: [web3Config.NETWORK.RPC_URL],
                blockExplorerUrls: [web3Config.NETWORK.BLOCK_EXPLORER],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          throw new Error('Failed to add Polygon Amoy network');
        }
      } else {
        console.error('Error switching network:', error);
        throw new Error('Failed to switch network');
      }
    }
  }, []);

  // Sign a message
  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!walletState.isConnected || !walletState.address) {
      throw new Error(web3Config.ERRORS.WALLET_NOT_CONNECTED);
    }

    try {
      const provider = getProvider();
      
      // Convert message to hex
      const hexMessage = '0x' + Buffer.from(message, 'utf-8').toString('hex');
      
      const signature = await provider.request({
        method: 'personal_sign',
        params: [hexMessage, walletState.address],
      });

      return signature;
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error(web3Config.ERRORS.USER_REJECTED);
      }
      throw error;
    }
  }, [walletState.isConnected, walletState.address]);

  // Send a transaction
  const sendTransaction = useCallback(async (
    to: string,
    value: string,
    data?: string
  ): Promise<string> => {
    if (!walletState.isConnected || !walletState.address) {
      throw new Error(web3Config.ERRORS.WALLET_NOT_CONNECTED);
    }

    try {
      const provider = getProvider();
      
      const transaction = {
        from: walletState.address,
        to,
        value,
        data: data || '0x',
        chainId: web3Config.NETWORK.CHAIN_ID_DECIMAL,
      };

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      });

      return txHash;
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error(web3Config.ERRORS.USER_REJECTED);
      }
      if (error.code === -32602) {
        throw new Error(web3Config.ERRORS.INSUFFICIENT_BALANCE);
      }
      throw error;
    }
  }, [walletState.isConnected, walletState.address]);

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (walletState.address) {
      await getBalance(walletState.address);
    }
  }, [walletState.address, getBalance]);

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled) return;

    const provider = getProvider();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== walletState.address) {
        setWalletState(prev => ({
          ...prev,
          address: accounts[0],
          isConnected: true,
        }));
        getBalance(accounts[0]);
      }
    };

    const handleChainChanged = (chainId: string) => {
      const chainIdDecimal = hexToDecimal(chainId);
      setWalletState(prev => ({
        ...prev,
        chainId: chainIdDecimal,
      }));
      
      // Reload page on network change (MetaMask best practice)
      if (chainIdDecimal !== web3Config.NETWORK.CHAIN_ID_DECIMAL) {
        window.location.reload();
      }
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);

    return () => {
      provider.removeListener('accountsChanged', handleAccountsChanged);
      provider.removeListener('chainChanged', handleChainChanged);
    };
  }, [walletState.address, getBalance]);

  // Check existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled) return;

      try {
        const provider = getProvider();
        const accounts = await provider.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          const chainId = await provider.request({
            method: 'eth_chainId',
          });

          setWalletState({
            isConnected: true,
            address: accounts[0],
            chainId: hexToDecimal(chainId),
            balance: null,
            isConnecting: false,
            error: null,
          });

          await getBalance(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();
  }, [getBalance]);

  return {
    ...walletState,
    connect,
    disconnect,
    switchNetwork,
    signMessage,
    sendTransaction,
    refreshBalance,
  };
}

export default useWallet;
