/**
 * Network Switcher Component
 * Allows users to switch between networks
 *
 * @notice MVP TESTNET: Polygon Amoy Testnet (Chain ID: 80002)
 */

import React from 'react';
import { useWallet } from '../../../hooks/useWallet';
import { web3Config } from '../../../config/web3';

interface NetworkSwitcherProps {
  onSwitch?: () => void;
}

/**
 * NetworkSwitcher Component
 * Button to switch to Polygon Amoy testnet
 */
const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({ onSwitch }) => {
  const {
    isConnected,
    isWrongNetwork,
    switchToPolygonAmoy,
    chainId,
  } = useWallet();

  const handleSwitch = () => {
    switchToPolygonAmoy();
    if (onSwitch) {
      onSwitch();
    }
  };

  if (!isConnected) {
    return null;
  }

  if (!isWrongNetwork) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-green-200 text-xs font-medium">
          {web3Config.NETWORK.NAME}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg">
        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-red-200 text-xs font-medium">
          Chain ID: {chainId}
        </span>
      </div>

      <button
        onClick={handleSwitch}
        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Switch
      </button>
    </div>
  );
};

export default NetworkSwitcher;
