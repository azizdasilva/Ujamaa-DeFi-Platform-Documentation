/**
 * Wallet Status Component
 * Displays connected wallet information
 *
 * @notice MVP TESTNET: Polygon Amoy Testnet
 */

import React from 'react';
import { useWallet } from '../../../hooks/useWallet';

interface WalletStatusProps {
  showBalance?: boolean;
  showNetwork?: boolean;
  compact?: boolean;
}

/**
 * WalletStatus Component
 * Shows wallet connection status with optional balance and network info
 */
const WalletStatus: React.FC<WalletStatusProps> = ({
  showBalance = true,
  showNetwork = true,
  compact = false,
}) => {
  const {
    isConnecting,
    isWrongNetwork,
    isDisconnected,
    addressShort,
    balanceFormatted,
    balanceSymbol,
  } = useWallet();

  if (isDisconnected || isConnecting) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
        <div className={`w-2 h-2 rounded-full ${isWrongNetwork ? 'bg-red-500' : 'bg-green-500'}`} />
        <span className="text-white font-bold text-sm">{addressShort}</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#023D7A]/90 to-[#00A8A8]/90 rounded-xl p-4 text-white backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-sm uppercase tracking-wider">Wallet Status</h4>
        <div className={`w-2 h-2 rounded-full ${isWrongNetwork ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
      </div>

      {/* Address */}
      <div className="mb-3">
        <p className="text-xs text-white/70 mb-1">Address</p>
        <code className="text-sm font-mono bg-white/10 px-2 py-1 rounded">{addressShort}</code>
      </div>

      {/* Balance */}
      {showBalance && (
        <div className="mb-3">
          <p className="text-xs text-white/70 mb-1">Balance</p>
          <p className="text-lg font-bold">
            {balanceFormatted ? `${Number(balanceFormatted).toFixed(4)}` : '0.0000'} {balanceSymbol}
          </p>
        </div>
      )}

      {/* Network */}
      {showNetwork && (
        <div>
          <p className="text-xs text-white/70 mb-1">Network</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isWrongNetwork ? 'bg-red-500' : 'bg-green-500'}`} />
            <span className="text-sm font-medium">
              {isWrongNetwork ? 'Wrong Network' : 'Polygon Amoy'}
            </span>
          </div>
        </div>
      )}

      {isWrongNetwork && (
        <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-xs text-red-200">
            ⚠️ Please switch to Polygon Amoy testnet
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletStatus;
