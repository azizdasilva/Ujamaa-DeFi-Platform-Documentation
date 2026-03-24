/**
 * Badge Component
 * 
 * Status badge with multiple variants.
 * Follows Design System Specification v2.0 Section 4.2
 * 
 * @reference 04_DESIGN_SYSTEM_SPECIFICATION.md Section 4.2
 */

import React from 'react';
import clsx from 'clsx';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'blue' | 'purple';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  /**
   * Badge variant style
   */
  variant?: BadgeVariant;
  
  /**
   * Badge size
   */
  size?: BadgeSize;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Children content
   */
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}) => {
  const baseStyles = `
    inline-flex items-center
    font-medium rounded-full
    whitespace-nowrap
  `;

  const variantStyles = {
    primary: 'bg-[#023D7A]/10 text-[#023D7A]',
    secondary: 'bg-[#00A8A8]/10 text-[#00A8A8]',
    success: 'bg-[#00A8A8]/10 text-[#00A8A8]',
    warning: 'bg-[#D57028]/10 text-[#D57028]',
    error: 'bg-red-100 text-red-800',
    info: 'bg-[#48A9F0]/20 text-[#023D7A]',
    blue: 'bg-[#48A9F0]/20 text-[#023D7A]',
    purple: 'bg-purple-100 text-purple-800',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
