/**
 * MVPBanner Component
 * 
 * Required disclaimer banner that must appear on ALL MVP pages.
 * Displays testnet notice and MVP branding.
 * Shows once per session for 10 seconds.
 * 
 * @reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md Section 1.2
 * @reference 05_MVP_FRONTEND_SPECIFICATION.md Section 6.1
 * 
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React, { useState, useEffect } from 'react';

interface MVPBannerProps {
  text?: string;
  className?: string;
  storageKey?: string;
  duration?: number;
}

const MVPBanner: React.FC<MVPBannerProps> = ({
  text = '🚀 MVP: Institutional Architecture - Testnet Release',
  className = '',
  storageKey = 'mvp-banner-shown',
  duration = 10000, // 10 seconds
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem(storageKey);
    
    if (!hasBeenShown) {
      setIsVisible(true);
      sessionStorage.setItem(storageKey, 'true');
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [storageKey, duration]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-[100]
        bg-gradient-to-r from-[#023D7A] to-[#00A8A8]
        text-white
        px-4 py-3
        text-center
        text-sm font-semibold
        shadow-lg
        animate-slideInRight
        ${className}
      `}
      role="alert"
      aria-label="MVP Testnet Notice"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        {/* Rocket Icon */}
        <svg
          className="w-5 h-5 flex-shrink-0 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>

        {/* Banner Text */}
        <span className="flex-1">{text}</span>
        
        {/* Countdown Timer */}
        <div className="flex items-center gap-2 text-xs opacity-80 hidden sm:flex">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Hides in {duration / 1000}s</span>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Dismiss banner"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Footer Subtext */}
      <div className="max-w-7xl mx-auto mt-1 text-xs text-white/80 text-center">
        This is a testnet deployment. No real funds are handled.
      </div>
    </div>
  );
};

export default MVPBanner;
