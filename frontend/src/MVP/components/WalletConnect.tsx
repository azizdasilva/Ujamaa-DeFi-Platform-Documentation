/**
 * WalletConnect Component
 * 
 * MetaMask connection button with network switching and balance display.
 * 
 * @notice MVP TESTNET: Polygon Amoy (Chain ID: 80002)
 */

import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { web3Config } from '../config/web3';

interface WalletConnectProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  className?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onDisconnect,
  className = '',
}) => {
  const {
    isConnected,
    address,
    chainId,
    balance,
    isConnecting,
    error,
    connect,
    disconnect,
    switchNetwork,
  } = useWallet();

  const handleConnect = async () => {
    await connect();
    onConnect?.();
  };

  const handleDisconnect = () => {
    disconnect();
    onDisconnect?.();
  };

  // Format address for display
  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Check if on correct network
  const isCorrectNetwork = chainId === web3Config.NETWORK.CHAIN_ID_DECIMAL;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isConnected ? (
        <div className="flex items-center gap-2">
          {/* Network Status */}
          {!isCorrectNetwork && (
            <button
              onClick={switchNetwork}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              title="Switch to Polygon Amoy Testnet"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="hidden sm:inline">Switch Network</span>
            </button>
          )}

          {/* Wallet Info */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 border border-green-200 rounded-lg">
            {/* Status Indicator */}
            <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-amber-500'}`} />
            
            {/* Address */}
            <span className="text-sm font-mono font-medium text-gray-700">
              {formatAddress(address)}
            </span>

            {/* Balance */}
            {balance && isCorrectNetwork && (
              <span className="text-sm font-bold text-green-600">
                {balance} POL
              </span>
            )}
          </div>

          {/* Disconnect Button */}
          <button
            onClick={handleDisconnect}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Disconnect Wallet"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              {/* MetaMask Fox Icon */}
              <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
                <path d="M29.033 15.358c-.314-2.112-2.85-4.67-5.128-5.828.165-.67.44-1.828.177-2.494-.366-.927-1.52-1.238-2.23-1.397-.96-.215-1.94-.17-2.89.12-.66-1.126-1.67-2.156-3.005-2.538C14.406 2.77 12.806 3.13 11.52 4.1c-.77.58-1.37 1.34-1.77 2.19-.96-.33-1.98-.43-2.98-.27-.71.11-1.87.38-2.27 1.3-.3.68-.06 1.86.08 2.54-2.33 1.1-4.96 3.64-5.34 5.82-.4 2.27.5 4.7 2.3 6.16.3.24.62.46.95.65-.06.36-.1.73-.1 1.1 0 3.86 3.14 7 7 7h13.2c3.86 0 7-3.14 7-7 0-.34-.03-.67-.08-1 .37-.2.72-.44 1.04-.7 1.8-1.46 2.7-3.89 2.3-6.16zM12.17 5.8c.97-.73 2.13-1 3.17-.7.86.25 1.54.87 1.96 1.68.14.27.03.6-.24.74-.27.14-.6.03-.74-.24-.28-.55-.72-.96-1.27-1.12-.7-.2-1.48 0-2.15.5-.24.18-.59.13-.77-.11-.18-.24-.13-.59.11-.77.04-.03.09-.06.13-.08zm-6.4 4.5c.26-1.18.94-2.16 1.88-2.76.26-.17.6-.09.77.17.17.26.09.6-.17.77-.67.43-1.16 1.14-1.36 2.04-.07.3-.37.48-.67.42-.3-.07-.48-.37-.42-.67.01-.01.01-.02.02-.03-.02.02-.03.04-.05.06zm20.46 11.3c-1.37 1.1-3.1 1.7-4.9 1.7H10.67c-3.31 0-6-2.69-6-6 0-.43.05-.85.14-1.26.14-.62.76-1.02 1.38-.88.62.14 1.02.76.88 1.38-.05.23-.08.47-.08.71 0 2.21 1.79 4 4 4h13.2c2.21 0 4-1.79 4-4 0-.26-.03-.52-.09-.77-.15-.62.23-1.24.85-1.39.62-.15 1.24.23 1.39.85.11.47.17.95.17 1.44 0 1.8-.63 3.53-1.78 4.92-.23.28-.5.54-.79.78-.01.01-.02.02-.03.02z"/>
              </svg>
              <span>Connect MetaMask</span>
            </>
          )}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 mt-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg shadow-lg z-50">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-900">Wallet Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              {!isMetaMaskInstalled && (
                <a
                  href={web3Config.METAMASK.DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-red-600 hover:underline mt-2 inline-block"
                >
                  Install MetaMask →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Testnet Badge */}
      {isConnected && isCorrectNetwork && (
        <div className="px-2 py-1 bg-green-100 border border-green-200 rounded text-xs font-bold text-green-700">
          TESTNET
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
