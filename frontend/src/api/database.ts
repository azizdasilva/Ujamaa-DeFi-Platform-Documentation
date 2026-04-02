/**
 * Database API
 * Ujamaa DeFi Platform
 */

import apiClient from './client';

// Types
export interface InvestorProfile {
  id: number;
  email: string;
  role: string;
  wallet_address: string | null;
  full_name: string | null;
  company_name: string | null;
  jurisdiction: string;
  kyc_status: string;
  kyb_status: string;
  total_invested: number;
  ult_tokens: number;
  total_portfolio_value: number;
  pool_positions: Array<{
    pool_id: string;
    shares: number;
    average_nav: number;
    total_yield_earned: number;
  }>;
  recent_transactions: Array<{
    id: number;
    type: string;
    amount: number;
    status: string;
    created_at: string;
  }>;
}

export interface Financing {
  id: number;
  pool_family: string;
  asset_class: string;
  industrial: string;
  industrial_id: number | null;
  principal: number;
  interest_rate: number;
  duration_days: number;
  start_date: string;
  maturity_date: string;
  amount_repaid: number;
  is_repaid: boolean;
  status: string;
  description: string | null;
}

// API functions
export const databaseAPI = {
  /**
   * Get investor profile with positions and transactions
   */
  getInvestorProfile: async (investorId: number): Promise<InvestorProfile> => {
    const response = await apiClient.get<InvestorProfile>(`/db/investors/${investorId}`);
    return response.data;
  },

  /**
   * Get financings with filtering
   */
  getFinancings: async (params?: {
    pool_family?: string;
    industrial_id?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.pool_family) queryParams.append('pool_family', params.pool_family);
    if (params?.industrial_id) queryParams.append('industrial_id', params.industrial_id.toString());
    if (params?.status) queryParams.append('status', params.status);
    
    const response = await apiClient.get<Financing[]>(`/db/financings?${queryParams}`);
    return response.data;
  },
};

export default databaseAPI;
