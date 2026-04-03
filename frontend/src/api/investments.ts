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
  ulp_tokens: number;
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
  ulp_tokens: number;
  transaction_hash?: string;
}

export interface RedemptionRequest {
  pool_id: string;
  shares: number;
  investor_id: number;
}

export interface RedemptionResponse {
  success: boolean;
  pool_id: string;
  investor_id: string;
  shares_redeemed: number;
  shares_formatted: string;
  ujeur_received: number; // EUROD amount received (backend field name)
  ujeur_formatted: string;
  nav_per_share: number;
  transaction_id: string;
  timestamp: string;
  is_testnet: boolean;
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
   * Get uLP token balance
   */
  getULPBalance: async (investorId: number) => {
    const response = await apiClient.get(`/db/ulp/${investorId}/balance`);
    return response.data;
  },

  /**
   * Get uLP transaction history
   */
  getULPTransactions: async (investorId: number) => {
    const response = await apiClient.get(`/db/ulp/${investorId}/transactions`);
    return response.data;
  },

  /**
   * Redeem shares from a pool
   */
  redeemShares: async (data: RedemptionRequest): Promise<RedemptionResponse> => {
    const response = await apiClient.post<RedemptionResponse>(
      `/pools/${data.pool_id}/redeem`,
      {
        pool_id: data.pool_id,
        shares: data.shares,
        investor_id: data.investor_id.toString(),
      }
    );
    return response.data;
  },
};

export default investmentsAPI;
