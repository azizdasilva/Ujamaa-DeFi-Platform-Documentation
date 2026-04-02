/**
 * Pools API
 * Ujamaa DeFi Platform
 */

import apiClient from './client';

// Types
export interface Pool {
  id: string;
  name: string;
  family: string;
  apy: number;
  total_value: number;
  target_yield_min: number;
  target_yield_max: number;
  lockup_days: number;
  is_active: boolean;
}

export interface PoolKPIs {
  pool_id: string;
  calculated_at: string;
  financial: {
    net_apy: number;
    nav_per_share: number;
    yield_variance: number;
    expense_ratio: number;
  };
  liquidity: {
    tvl: number;
    utilization_rate: number;
    cash_drag: number;
    redemption_liquidity: number;
  };
  risk: {
    default_rate: number;
    concentration_risk: number;
    credit_rating: string;
    collateralization_ratio: number;
  };
  compliance: {
    kyc_coverage: number;
    whitelisted_wallets: number;
    jurisdiction_count: number;
  };
  impact: {
    industrial_growth: number;
    value_add_ratio: number;
    jobs_per_million: number;
  };
}

// API functions
export const poolsAPI = {
  /**
   * Get all investment pools
   */
  getAllPools: async (): Promise<Pool[]> => {
    const response = await apiClient.get<Pool[]>('/db/pools');
    return response.data;
  },

  /**
   * Get specific pool by ID
   */
  getPoolById: async (poolId: string): Promise<Pool> => {
    const response = await apiClient.get<Pool>(`/db/pools/${poolId}`);
    return response.data;
  },

  /**
   * Get pool statistics
   */
  getPoolStats: async (poolId: string) => {
    const response = await apiClient.get(`/db/pools/${poolId}/stats`);
    return response.data;
  },

  /**
   * Get all 18 KPIs for pool
   */
  getPoolKPIs: async (poolId: string, poolFamily: string = 'all'): Promise<PoolKPIs> => {
    const response = await apiClient.get<PoolKPIs>(`/api/v1/pool/kpis?pool_id=${poolId}&pool_family=${poolFamily}`);
    return response.data;
  },

  /**
   * Get pool health status
   */
  getPoolHealth: async (poolId: string) => {
    const response = await apiClient.get(`/api/v1/pool/health?pool_id=${poolId}`);
    return response.data;
  },
};

export default poolsAPI;
