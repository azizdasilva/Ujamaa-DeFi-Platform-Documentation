/**
 * Enhanced Connect Wallet Component
 * Beautiful wallet connection with full features
 *
 * @notice MVP TESTNET: Polygon Amoy Testnet (Chain ID: 80002)
 */

import React, { useState, useCallback } from 'react';
import { useWallet } from '../../../hooks/useWallet';
import { polygonAmoy } from 'wagmi/chains';

interface ConnectWalletProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'outline' | 'ghost' | 'glass';
  showBalance?: boolean;
}

/**
 * ConnectWallet Component
 * Enhanced wallet connection with beautiful UI
 */
const ConnectWallet: React.FC<ConnectWalletProps> = ({
  onConnect,
  onDisconnect,
  size = 'md',
  variant = 'primary',
  showBalance = true,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const {
    isConnected,
    isConnecting,
    isWrongNetwork,
    isDisconnected,
    address,
    addressShort,
    balanceFormatted,
    balanceSymbol,
    connect,
    disconnect,
    switchToPolygonAmoy,
    chainConfig,
    faucets,
  } = useWallet();

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  // Variant classes
  const variantClasses = {
    primary: `bg-gradient-to-r from-[#00A8A8] via-[#023D7A] to-[#00A8A8] bg-[length:200%_100%] text-white 
              hover:bg-[length:300%_100%] hover:shadow-[0_0_30px_rgba(0,168,168,0.4)] 
              active:scale-95 transition-all duration-500 ease-out
              border border-white/20 backdrop-blur-sm`,
    outline: 'bg-transparent border-2 border-[#00A8A8] text-[#00A8A8] hover:bg-[#00A8A8]/10',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
  };

  // Copy address to clipboard
  const copyAddress = useCallback(async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [address]);

  // Handle connect click
  const handleConnectClick = () => {
    if (isConnected) {
      setShowModal(true);
    } else {
      connect();
    }
  };

  // Handle successful connection
  React.useEffect(() => {
    if (isConnected && onConnect) {
      onConnect(addressShort || '');
      setShowModal(false);
    }
  }, [isConnected, onConnect, addressShort]);

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect();
    setShowModal(false);
    if (onDisconnect) {
      onDisconnect();
    }
  };

  // Get testnet POL from faucet
  const openFaucet = () => {
    window.open(faucets.POLYGON_AMOY, '_blank');
  };

  // View on block explorer
  const viewOnExplorer = () => {
    if (address) {
      window.open(`${chainConfig.BLOCK_EXPLORER}/address/${address}`, '_blank');
    }
  };

  // Button content based on state
  const getButtonContent = () => {
    if (isConnecting) {
      return (
        <>
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="hidden sm:inline font-semibold">Connecting...</span>
        </>
      );
    }

    if (isWrongNetwork) {
      return (
        <>
          <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span className="hidden sm:inline font-semibold">Wrong Network</span>
        </>
      );
    }

    if (isConnected) {
      return (
        <>
          <div className="flex items-center gap-2.5">
            {/* Status Indicator */}
            <div className="relative">
              <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            
            {/* Address */}
            <div className="hidden sm:flex flex-col items-start">
              <span className="font-mono font-bold text-sm tracking-wide">{addressShort}</span>
              {showBalance && balanceFormatted && (
                <span className="text-xs text-white/80 font-medium">
                  {Number(balanceFormatted).toFixed(4)} {balanceSymbol}
                </span>
              )}
            </div>
          </div>
          
          {/* Chevron */}
          <svg className="w-5 h-5 ml-2 hidden sm:block opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </>
      );
    }

    return (
      <>
        <div className="flex items-center gap-2.5">
          {/* Wallet Icon with Glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-lg blur-md" />
            <svg className="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          
          {/* Text */}
          <span className="hidden sm:inline font-bold tracking-wide">Connect Wallet</span>
          <span className="sm:hidden font-bold">Connect</span>
        </div>
        
        {/* Animated Arrow */}
        <svg className="w-5 h-5 ml-1 hidden sm:block animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </>
    );
  };

  return (
    <>
      {/* Connect Button */}
      <button
        onClick={handleConnectClick}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          rounded-2xl
          transition-all duration-300
          flex items-center gap-2
          ${isWrongNetwork ? '!bg-gradient-to-r !from-red-500 !via-red-600 !to-red-500 hover:!shadow-[0_0_30px_rgba(239,68,68,0.4)]' : ''}
          ${isConnected ? '!bg-gradient-to-r !from-green-500 !via-green-600 !to-green-500 hover:!shadow-[0_0_30px_rgba(34,197,94,0.4)]' : ''}
          hover:scale-105 active:scale-95
          shadow-lg hover:shadow-xl
        `}
      >
        {getButtonContent()}
      </button>

      {/* Enhanced Wallet Modal */}
      {showModal && isConnected && (
        <div className="fixed inset-0 z-[10001]">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Container */}
          <div className="absolute top-20 right-4 md:right-8 w-full max-w-md animate-scaleIn">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Header with Logo */}
              <div className="relative bg-gradient-to-br from-[#023D7A] via-[#00A8A8] to-[#023D7A] px-6 py-6 overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(Ondo Finance at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                  }} />
                </div>
                
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                {/* Logo and Brand */}
                <div className="relative flex flex-col items-center">
                  {/* Logo Container */}
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3 shadow-xl border border-white/30">
                    <img
                      src="/assets/images/logo-transparent.png"
                      alt="Ujamaa DeFi"
                      className="w-16 h-16 object-contain"
                    />
                  </div>

                  {/* Brand Name */}
                  <h3 className="text-white font-bold text-[1px] tracking-wide text-center w-full">Ujamaa DeFi Platform</h3>
                  <p className="text-white/80 text-xs mt-0.5 font-medium text-center w-full">Institutional DeFi for African Real-World Assets</p>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Connection Status Bar */}
              <div className={`px-4 py-2 flex items-center justify-center gap-2 ${
                isWrongNetwork
                  ? 'bg-red-50 border-b border-red-100'
                  : 'bg-green-50 border-b border-green-100'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isWrongNetwork ? 'bg-red-500' : 'bg-green-500'
                } animate-pulse`} />
                <span className={`text-xs font-bold ${
                  isWrongNetwork ? 'text-red-700' : 'text-green-700'
                }`}>
                  {isWrongNetwork ? '⚠️ Wrong Network' : '✅ Connected'}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Address Card */}
                <div className="mb-3 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 font-semibold">Wallet Address</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 bg-white px-2.5 py-2 rounded-lg border border-gray-200">
                      <div className="w-6 h-6 bg-gradient-to-br from-[#00A8A8] to-[#023D7A] rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <code className="text-xs text-[#023D7A] font-mono flex-1">{addressShort}</code>
                    </div>
                    <button
                      onClick={copyAddress}
                      className="p-2 bg-white hover:bg-[#F3F8FA] border border-gray-200 rounded-lg transition-colors group"
                      title="Copy address"
                    >
                      {copied ? (
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-600 group-hover:text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-[10px] text-green-600 mt-1 ml-1 flex items-center gap-1">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </p>
                  )}
                </div>

                {/* Balance & Network Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {/* Balance */}
                  <div className="p-2.5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-1.5 mb-1">
                      <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-[15px] text-green-700 font-semibold">Balance</p>
                    </div>
                    <p className="text-base font-bold text-green-800">
                      {balanceFormatted ? `${Number(balanceFormatted).toFixed(4)}` : '0.0000'}
                    </p>
                    <p className="text-[10px] text-green-600">{balanceSymbol}</p>
                  </div>

                  {/* Network */}
                  <div className={`p-2.5 rounded-xl border ${
                    isWrongNetwork
                      ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-100'
                      : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
                  }`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <svg className={`w-3.5 h-3.5 ${isWrongNetwork ? 'text-red-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <p className={`text-[15px] font-semibold ${isWrongNetwork ? 'text-red-700' : 'text-blue-700'}`}>Network</p>
                    </div>
                    <p className={`text-xs font-bold ${isWrongNetwork ? 'text-red-800' : 'text-blue-800'}`}>
                      {isWrongNetwork ? 'Wrong' : 'Amoy'}
                    </p>
                    <p className={`text-[9px] mt-0.5 ${isWrongNetwork ? 'text-red-600' : 'text-blue-600'}`}>
                      80002
                    </p>
                  </div>
                </div>

                {/* Network Switch Warning */}
                {isWrongNetwork && (
                  <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-red-800">Wrong Network Detected</p>
                        <p className="text-xs text-red-600 mt-1">Please switch to Polygon Amoy to continue</p>
                      </div>
                    </div>
                    <button
                      onClick={switchToPolygonAmoy}
                      className="w-full mt-3 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Switch to Polygon Amoy
                    </button>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={openFaucet}
                      className="flex items-center gap-2 px-4 py-3 bg-gradient-to-br from-[#00A8A8]/10 to-[#023D7A]/10 hover:from-[#00A8A8]/20 hover:to-[#023D7A]/20 border border-[#00A8A8]/30 rounded-xl transition-all group"
                    >
                      <svg className="w-5 h-5 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span className="text-sm font-bold text-[#00A8A8]">Get Test POL</span>
                    </button>
                    <button
                      onClick={viewOnExplorer}
                      className="flex items-center gap-2 px-4 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-xl transition-all group"
                    >
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="text-sm font-bold text-blue-600">Explorer</span>
                    </button>
                  </div>
                </div>

                {/* Disconnect Button */}
                <button
                  onClick={handleDisconnect}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border-2 border-red-200 hover:border-red-300 text-red-600 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
                >
                  <svg className="w-5 h-5 text-red-600 group-hover:text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectWallet;
