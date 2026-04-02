/**
 * Custom Wallet Modal - Ujamaa DeFi Platform
 * Compact, responsive modal for wallet connection
 */

import React from 'react';
import { useConnect, useDisconnect, useAccount } from '../../hooks/useWallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * WalletModal Component
 * Compact, responsive modal for wallet connection
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
        aria-hidden="true"
      />

      {/* Modal - Compact, centered, responsive */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[280px] z-[9999] px-4 sm:max-w-[320px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
      >
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden animate-scaleIn border border-gray-200">
          {/* Header - Compact */}
          <div className="bg-gradient-to-r from-[#00A8A8] to-[#023D7A] px-3 py-2">
            <div className="flex items-center justify-between">
              <h2 
                id="wallet-modal-title"
                className="text-xs font-bold text-white"
              >
                {isConnected ? '✅ Connected' : '🔗 Connect Wallet'}
              </h2>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="Close modal"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <p className="text-[9px] text-gray-600 mb-0.5">Wallet Address</p>
                  <p className="text-[10px] font-mono font-bold text-[#023D7A] break-all">{addressShort}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDisconnect}
                    className="flex-1 px-2 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-[9px] min-h-[28px]"
                  >
                    Disconnect
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 px-2 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors text-[9px] min-h-[28px]"
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
                  className="w-full px-3 py-2 bg-gradient-to-r from-[#00A8A8] to-[#023D7A] hover:from-[#0D7A7A] hover:to-[#034F9A] text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[10px] min-h-[36px]"
                >
                  <svg className="w-3 h-3" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M29.96 8.06a2.9 2.9 0 00-1.67-1.36l-3.28-.86-1.35-3.12a2.93 2.93 0 00-5.32 0l-1.35 3.12-3.28.86a2.9 2.9 0 00-1.67 1.36L2.04 12.6a2.9 2.9 0 001.67 4.14l3.28.86 1.35 3.12a2.93 2.93 0 005.32 0l1.35-3.12 3.28-.86a2.9 2.9 0 001.67-4.14l-3.28-4.54zM16 21.5a5.5 5.5 0 110-11 5.5 5.5 0 010 11z"/>
                  </svg>
                  {isConnecting ? (
                    <span className="flex items-center gap-1">
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Connecting...
                    </span>
                  ) : (
                    'Connect MetaMask'
                  )}
                </button>
                <p className="text-[8px] text-gray-500 text-center">
                  Secure connection via MetaMask
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletModal;
