/**
 * Card Component
 * 
 * Reusable card container with header, body, and footer sections.
 * Follows Design System Specification v2.0 Section 4.3
 * 
 * @reference 03_DESIGN_SYSTEM_SPECIFICATION.md Section 4.3
 */

import React from 'react';
import clsx from 'clsx';

interface CardProps {
  /**
   * Card padding
   */
  padding?: 'sm' | 'md' | 'lg';
  
  /**
   * Enable hover effects
   */
  hover?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Card children
   */
  children: React.ReactNode;
  
  /**
   * Optional header
   */
  header?: React.ReactNode;
  
  /**
   * Optional footer
   */
  footer?: React.ReactNode;
  
  /**
   * Click handler
   */
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  padding = 'md',
  hover = false,
  className = '',
  children,
  header,
  footer,
  onClick,
}) => {
  const baseStyles = `
    bg-[#FFFFFF] rounded-xl
    border border-[#48A9F0]/30
    shadow-soft
  `;

  const hoverStyles = hover
    ? 'hover:shadow-soft-lg hover:border-[#48A9F0]/40 transition-all duration-300 cursor-pointer'
    : '';

  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={clsx(baseStyles, hoverStyles, className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Header */}
      {header && (
        <div className="px-6 py-4 border-b border-[#48A9F0]/20">
          {header}
        </div>
      )}

      {/* Body */}
      <div className={paddingStyles[padding]}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-[#48A9F0]/20 bg-[#F3F8FA] rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
