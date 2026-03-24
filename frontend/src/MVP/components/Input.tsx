/**
 * Input Component
 * 
 * Form input with label, error state, and helper text.
 * Follows Design System Specification v2.0 Section 4.4
 * 
 * @reference 04_DESIGN_SYSTEM_SPECIFICATION.md Section 4.4
 */

import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input label
   */
  label?: string;
  
  /**
   * Error message
   */
  error?: string;
  
  /**
   * Helper text
   */
  helperText?: string;
  
  /**
   * Full width input
   */
  fullWidth?: boolean;
  
  /**
   * Left addon (icon or text)
   */
  leftAddon?: React.ReactNode;
  
  /**
   * Right addon (icon or text)
   */
  rightAddon?: React.ReactNode;
  
  /**
   * Custom className
   */
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  fullWidth = false,
  leftAddon,
  rightAddon,
  className = '',
  disabled,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseStyles = `
    block w-full
    px-4 py-2
    border rounded-lg
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-gray-100 disabled:cursor-not-allowed
  `;

  const stateStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-[#00A8A8] focus:ring-[#00A8A8]/20';

  return (
    <div className={clsx(fullWidth && 'w-full', className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Addon */}
        {leftAddon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftAddon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            baseStyles,
            stateStyles,
            leftAddon && 'pl-10',
            rightAddon && 'pr-10'
          )}
          disabled={disabled}
          {...props}
        />

        {/* Right Addon */}
        {rightAddon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightAddon}
          </div>
        )}
      </div>

      {/* Error or Helper Text */}
      {(error || helperText) && (
        <p className={clsx('mt-1 text-sm', error ? 'text-red-600' : 'text-gray-500')}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
