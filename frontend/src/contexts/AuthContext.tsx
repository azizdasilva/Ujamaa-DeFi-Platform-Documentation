/**
 * Authentication & Role Context
 * Manages user authentication state and role-based access control
 *
 * @notice MVP TESTNET: Mock authentication for demo purposes
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InvestorRole } from '../types';

interface User {
  id: string;
  name: string;
  email: string;
  role: InvestorRole;
  walletAddress?: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  jurisdiction: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: InvestorRole, walletAddress?: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  canAccess: (requiredRole: InvestorRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: Record<InvestorRole, User> = {
  INSTITUTIONAL_INVESTOR: {
    id: 'inst-001',
    name: 'Logic Capital Ltd',
    email: 'compliance@logiccapital.com',
    role: 'INSTITUTIONAL_INVESTOR',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    kycStatus: 'approved',
    jurisdiction: 'MU',
  },
  RETAIL_INVESTOR: {
    id: 'retail-001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: 'RETAIL_INVESTOR',
    walletAddress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    kycStatus: 'approved',
    jurisdiction: 'KE',
  },
  INDUSTRIAL_OPERATOR: {
    id: 'originator-001',
    name: 'Green Cotton SA',
    email: 'finance@greencotton.bj',
    role: 'INDUSTRIAL_OPERATOR',
    walletAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    kycStatus: 'approved',
    jurisdiction: 'BJ',
  },
  COMPLIANCE_OFFICER: {
    id: 'compliance-001',
    name: 'Sarah Johnson',
    email: 'compliance@ujamaa-defi.com',
    role: 'COMPLIANCE_OFFICER',
    walletAddress: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    kycStatus: 'approved',
    jurisdiction: 'EU',
  },
  ADMIN: {
    id: 'admin-001',
    name: 'Platform Admin',
    email: 'admin@ujamaa-defi.com',
    role: 'ADMIN',
    walletAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    kycStatus: 'approved',
    jurisdiction: 'EU',
  },
  REGULATOR: {
    id: 'regulator-001',
    name: 'Regulatory Authority',
    email: 'regulator@gov.example',
    role: 'REGULATOR',
    walletAddress: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
    kycStatus: 'approved',
    jurisdiction: 'EU',
  },
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem('ujamaa_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (role: InvestorRole, walletAddress?: string) => {
    const mockUser = MOCK_USERS[role];
    const userData = {
      ...mockUser,
      walletAddress: walletAddress || mockUser.walletAddress,
      // Mock JWT token for API authentication (MVP testnet)
      token: `mock-jwt-token-${role}-${Date.now()}`,
    };
    setUser(userData);
    sessionStorage.setItem('ujamaa_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('ujamaa_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      // Preserve the token when updating user
      if (!updates.token) {
        updatedUser.token = user.token;
      }
      setUser(updatedUser);
      sessionStorage.setItem('ujamaa_user', JSON.stringify(updatedUser));
    }
  };

  const canAccess = (requiredRole: InvestorRole[]): boolean => {
    if (!user) return false;
    // Admin can access everything
    if (user.role === 'ADMIN') return true;
    return requiredRole.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
