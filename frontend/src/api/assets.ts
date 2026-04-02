/**
 * Assets API (for Industrial Operators)
 * Ujamaa DeFi Platform
 */

import apiClient from './client';

// Types
export interface AssetSubmission {
  id?: number;
  industrial_id: number;
  asset_type: string;
  description: string;
  value: number;
  documents: string[];
  status?: 'pending' | 'certified' | 'rejected';
}

export interface Financing {
  id: number;
  pool_family: string;
  asset_class: string;
  industrial: string;
  principal: number;
  interest_rate: number;
  duration_days: number;
  status: string;
  amount_repaid: number;
  is_repaid: boolean;
}

export interface SubmitAssetRequest {
  industrial_id: number;
  asset_type: string;
  description: string;
  value: number;
  document_paths: string[];
}

// API functions
export const assetsAPI = {
  /**
   * Submit asset for tokenization
   */
  submitAsset: async (data: SubmitAssetRequest) => {
    const response = await apiClient.post('/assets/submit', data);
    return response.data;
  },

  /**
   * Get operator's assets
   */
  getOperatorAssets: async (industrialId: number) => {
    const response = await apiClient.get(`/assets/industrial/${industrialId}`);
    return response.data;
  },

  /**
   * Get asset certificates
   */
  getAssetCertificates: async (industrialId: number) => {
    const response = await apiClient.get(`/assets/${industrialId}/certificates`);
    return response.data;
  },

  /**
   * Get financings
   */
  getFinancings: async (industrialId: number): Promise<Financing[]> => {
    const response = await apiClient.get<Financing[]>(`/financings/industrial/${industrialId}`);
    return response.data;
  },

  /**
   * Create financing request
   */
  createFinancing: async (data: any) => {
    const response = await apiClient.post('/financings', data);
    return response.data;
  },

  /**
   * Record repayment
   */
  recordRepayment: async (financingId: number, amount: number) => {
    const response = await apiClient.post(`/financings/${financingId}/repayments`, { amount });
    return response.data;
  },
};

export default assetsAPI;
