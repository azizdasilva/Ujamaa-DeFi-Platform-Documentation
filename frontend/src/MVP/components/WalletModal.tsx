/**
 * Custom Wallet Modal - Ujamaa DeFi Platform
 * Compact modal positioned at top of viewport
 */

import React from 'react';
import { useConnect, useDisconnect, useAccount } from '../../hooks/useWallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * WalletModal Component
 * Compact modal for wallet connection at top of screen
 */
const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { connect, isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, addressShort } = useAccount();

  if (!isOpen) return null;

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />
      
      {/* Modal - Compact, at top */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 w-full max-w-xs z-[9999] px-4">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden animate-scaleIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00A8A8] to-[#023D7A] px-4 py-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">
                {isConnected ? '✅ Connected' : '🔗 Connect Wallet'}
              </h2>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content - Compact */}
          <div className="p-3">
            {isConnected ? (
              <div className="space-y-2">
                <div className="text-center">
                  <p className="text-[10px] text-gray-600 mb-0.5">Address</p>
                  <p className="text-xs font-mono font-bold text-[#023D7A]">{addressShort}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDisconnect}
                    className="flex-1 px-2 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-[10px]"
                  >
                    Disconnect
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 px-2 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors text-[10px]"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full px-3 py-2 bg-gradient-to-r from-[#00A8A8] to-[#023D7A] hover:from-[#0D7A7A] hover:to-[#034F9A] text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 text-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M29.96 8.06a2.9 2.9 0 00-1.67-1.36l-3.28-.86-1.35-3.12a2.93 2.93 0 00-5.32 0l-1.35 3.12-3.28.86a2.9 2.9 0 00-1.67 1.36L2.04 12.6a2.9 2.9 0 001.67 4.14l3.28.86 1.35 3.12a2.93 2.93 0 005.32 0l1.35-3.12 3.28-.86a2.9 2.9 0 001.67-4.14l-3.28-4.54zM16 21.5a5.5 5.5 0 110-11 5.5 5.5 0 010 11z"/>
                  </svg>
                  {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletModal;
