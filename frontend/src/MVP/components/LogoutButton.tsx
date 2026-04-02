/**
 * Logout Button Component
 * Handles user logout with confirmation
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LogoutButtonProps {
  variant?: 'button' | 'menu-item' | 'icon';
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'menu-item',
  className = '',
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    setShowConfirm(false);
    navigate('/login');
  };

  const baseClasses = "flex items-center gap-2 transition-colors";
  const variantClasses = {
    button: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg",
    'menu-item': "w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50",
    icon: "p-2 text-red-600 hover:bg-red-50 rounded-lg",
  };

  if (showConfirm) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800 font-semibold mb-2">Confirm logout?</p>
        <div className="flex gap-2">
          <button
            onClick={handleLogout}
            className="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded"
          >
            Yes, Logout
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {variant === 'icon' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {variant === 'button' && 'Logout'}
          {variant === 'menu-item' && 'Sign Out'}
        </>
      )}
    </button>
  );
};

export default LogoutButton;
