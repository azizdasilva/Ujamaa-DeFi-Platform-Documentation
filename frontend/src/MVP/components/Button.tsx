/**
 * Button Component - Beautiful Modern Design
 *
 * Enhanced with gradients, shadows, and smooth animations
 * Follows Ujamaa Modern Blue Theme
 */

import React from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonGradient = 'teal' | 'orange' | 'blue' | 'sunset';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  gradient?: ButtonGradient;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  gradient = 'teal',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-bold rounded-xl
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
    shadow-md hover:shadow-xl
    border-0
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-[#00A8A8] to-[#023D7A]
      hover:from-[#0D7A7A] hover:to-[#012d5c]
      text-[#F3F8FA]
      focus:ring-[#00A8A8]
    `,
    secondary: `
      bg-gradient-to-r from-[#D57028] to-[#B85A1E]
      hover:from-[#B85A1E] hover:to-[#A04a19]
      text-[#F3F8FA]
      focus:ring-[#D57028]
    `,
    outline: `
      bg-transparent
      border-2 border-[#023D7A]
      text-[#023D7A]
      hover:bg-[#023D7A] hover:text-white
      focus:ring-[#023D7A]
      shadow-none hover:shadow-md
    `,
    ghost: `
      bg-transparent
      text-[#023D7A]
      hover:bg-[#023D7A]/10
      focus:ring-[#023D7A]
      shadow-none hover:shadow-md
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700
      hover:from-red-700 hover:to-red-800
      text-white
      focus:ring-red-500
    `,
    gradient: `
      bg-gradient-to-r ${
        gradient === 'teal' ? 'from-[#00A8A8] to-[#48A9F0]' :
        gradient === 'orange' ? 'from-[#D57028] to-[#F59E0B]' :
        gradient === 'blue' ? 'from-[#023D7A] to-[#48A9F0]' :
        'from-[#D57028] to-[#8B5CF6]'
      }
      hover:opacity-90
      text-white
      focus:ring-[#00A8A8]
    `,
  };

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 gap-1.5',
    md: 'text-sm px-6 py-3 gap-2',
    lg: 'text-base px-8 py-4 gap-2.5',
    xl: 'text-lg px-10 py-5 gap-3',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
