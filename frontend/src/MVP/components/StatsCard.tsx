/**
 * StatsCard Component
 * 
 * Statistics display card with icon, label, value, and optional trend.
 * Follows Design System Specification v2.0 Section 4.5
 * 
 * @reference 03_DESIGN_SYSTEM_SPECIFICATION.md Section 4.5
 */

import React from 'react';
import clsx from 'clsx';

export type StatsCardColor = 'navy' | 'orange' | 'sand' | 'red' | 'purple' | 'blue' | 'green' | 'amber' | 'teal';

interface StatsCardProps {
  /**
   * Card icon
   */
  icon: React.ReactNode;
  
  /**
   * Stat label
   */
  label: string;
  
  /**
   * Stat value (string or number)
   */
  value: string | number;
  
  /**
   * Optional trend indicator
   */
  trend?: {
    value: number | string;
    direction: 'up' | 'down' | 'neutral';
  };
  
  /**
   * Color theme
   */
  color?: StatsCardColor;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Click handler
   */
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  trend,
  color = 'blue',
  className = '',
  onClick,
}) => {
  const colorStyles = {
    navy: 'bg-[#023D7A]/10 text-[#023D7A]',
    orange: 'bg-[#D57028]/10 text-[#D57028]',
    sand: 'bg-[#48A9F0]/20 text-[#023D7A]',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-[#48A9F0]/20 text-[#023D7A]',
    green: 'bg-[#00A8A8]/10 text-[#00A8A8]',
    amber: 'bg-[#D57028]/10 text-[#D57028]',
    teal: 'bg-[#00A8A8]/10 text-[#00A8A8]',
  };

  const trendColors = {
    up: 'text-[#00A8A8]',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div
      className={clsx(
        'bg-[#FFFFFF] rounded-xl p-6 border border-[#48A9F0]/30 shadow-soft',
        onClick && 'cursor-pointer hover:shadow-soft-lg transition-shadow',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-start justify-between">
        {/* Icon Container */}
        <div className={clsx('p-3 rounded-lg', colorStyles[color])}>
          {icon}
        </div>

        {/* Trend */}
        {trend && (
          <div className={clsx('flex items-center text-sm font-bold', trendColors[trend.direction])}>
            {trend.direction === 'up' && (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            )}
            {trend.direction === 'down' && (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
            {trend.direction === 'neutral' && (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
              </svg>
            )}
            <span>{typeof trend.value === 'number' ? `${trend.value > 0 ? '+' : ''}${trend.value}%` : trend.value}</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-4">
        <p className="text-2xl font-bold text-[#023D7A]">{value}</p>
        <p className="text-sm text-[#333333] mt-1">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
