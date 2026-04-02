/**
 * Authentication API
 * Ujamaa DeFi Platform
 */

import apiClient from './client';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role: 'INSTITUTIONAL_INVESTOR' | 'RETAIL_INVESTOR' | 'INDUSTRIAL_OPERATOR' | 'COMPLIANCE_OFFICER' | 'REGULATOR';
  jurisdiction: string;
  company_name?: string;
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    role: string;
    wallet_address?: string;
  };
  token: string;
  investor_profile?: {
    id: number;
    kyc_status: string;
    kyb_status: string;
  };
}

export interface RegisterResponse {
  user: {
    id: number;
    email: string;
    role: string;
  };
  investor_profile: {
    id: number;
    kyc_status: string;
  };
}

// API functions
export const authAPI = {
  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (userId: number) => {
    const response = await apiClient.get(`/db/users/${userId}/profile`);
    return response.data;
  },

  /**
   * Logout (client-side only for now)
   */
  logout: () => {
    sessionStorage.removeItem('ujamaa_user');
  },
};

export default authAPI;
