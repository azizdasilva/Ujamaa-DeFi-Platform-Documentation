/**
 * MockDataBadge Component
 * 
 * Visual indicator that displayed data is mock/testnet data.
 * Should be placed near any data that is simulated.
 * 
 * @reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md Section 1.2
 * @reference 05_MVP_FRONTEND_SPECIFICATION.md Section 6.3
 * 
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React from 'react';

interface MockDataBadgeProps {
  /**
   * Badge label text
   * Default: "MOCK DATA"
   */
  label?: string;
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Position
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Tooltip text
   */
  tooltip?: string;
}

const MockDataBadge: React.FC<MockDataBadgeProps> = ({
  label = 'MOCK DATA',
  size = 'md',
  position,
  className = '',
  tooltip = 'This data is simulated for testnet purposes only',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  const badge = (
    <span
      className={`
        inline-flex items-center gap-1
        bg-purple-100 text-purple-700
        border border-purple-200
        rounded font-medium
        ${sizeClasses[size]}
        ${className}
      `}
      title={tooltip}
    >
      {/* Database Icon */}
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
        />
      </svg>
      
      {label}
    </span>
  );

  // If position is specified, wrap in positioned container
  if (position) {
    const positionClasses = {
      'top-left': 'absolute top-2 left-2 z-10',
      'top-right': 'absolute top-2 right-2 z-10',
      'bottom-left': 'absolute bottom-2 left-2 z-10',
      'bottom-right': 'absolute bottom-2 right-2 z-10',
    };

    return (
      <div className={`relative ${positionClasses[position]}`}>
        {badge}
      </div>
    );
  }

  return badge;
};

export default MockDataBadge;
