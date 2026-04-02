/**
 * Investments API
 * Ujamaa DeFi Platform
 */

import apiClient from './client';

// Types
export interface Investment {
  id: number;
  pool_id: string;
  investor_id: number;
  amount: number;
  ult_tokens: number;
  status: string;
  created_at: string;
}

export interface PoolPosition {
  id: number;
  investor_id: number;
  pool_id: string;
  shares: number;
  average_nav: number;
  total_yield_earned: number;
  is_active: boolean;
}

export interface CreateInvestmentRequest {
  pool_id: string;
  investor_id: number;
  amount: number;
}

export interface CreateInvestmentResponse {
  success: boolean;
  investment_id: number;
  pool_id: string;
  amount: number;
  ult_tokens: number;
  transaction_hash?: string;
}

// API functions
export const investmentsAPI = {
  /**
   * Create new investment
   */
  createInvestment: async (data: CreateInvestmentRequest): Promise<CreateInvestmentResponse> => {
    const response = await apiClient.post<CreateInvestmentResponse>('/db/investments', data);
    return response.data;
  },

  /**
   * Get investments by investor
   */
  getInvestorInvestments: async (investorId: number): Promise<Investment[]> => {
    const response = await apiClient.get<Investment[]>(`/db/investments?investor_id=${investorId}`);
    return response.data;
  },

  /**
   * Get investments by pool
   */
  getPoolInvestments: async (poolId: string): Promise<Investment[]> => {
    const response = await apiClient.get<Investment[]>(`/db/investments?pool_id=${poolId}`);
    return response.data;
  },

  /**
   * Get investor pool positions
   */
  getInvestorPositions: async (investorId: number): Promise<PoolPosition[]> => {
    const response = await apiClient.get<PoolPosition[]>(`/db/investor/${investorId}/positions`);
    return response.data;
  },

  /**
   * Get uLT token balance
   */
  getULTBalance: async (investorId: number) => {
    const response = await apiClient.get(`/db/ult/${investorId}/balance`);
    return response.data;
  },

  /**
   * Get uLT transaction history
   */
  getULTTransactions: async (investorId: number) => {
    const response = await apiClient.get(`/db/ult/${investorId}/transactions`);
    return response.data;
  },
};

export default investmentsAPI;
