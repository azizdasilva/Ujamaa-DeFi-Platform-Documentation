/**
 * Compliance API
 * Ujamaa DeFi Platform
 */

import apiClient from './client';

// Types
export interface Document {
  id: number;
  investor_id: number;
  document_type: string;
  document_name: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  deadline_at: string;
  time_remaining_hours?: number;
}

export interface WhitelistedWallet {
  id: number;
  investor_id: number;
  wallet_address: string;
  is_approved: boolean;
  risk_level: string;
}

export interface ReviewDocumentRequest {
  action: 'approve' | 'reject';
  notes?: string;
}

// API functions
export const complianceAPI = {
  /**
   * Get all documents for review
   */
  getDocuments: async (status?: string, investorId?: number): Promise<Document[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (investorId) params.append('investor_id', investorId.toString());
    
    const response = await apiClient.get<Document[]>(`/db/documents?${params}`);
    return response.data;
  },

  /**
   * Get specific document
   */
  getDocument: async (documentId: number) => {
    const response = await apiClient.get(`/db/documents/${documentId}`);
    return response.data;
  },

  /**
   * Review document (approve/reject)
   */
  reviewDocument: async (documentId: number, data: ReviewDocumentRequest) => {
    const response = await apiClient.post(`/compliance/documents/${documentId}/review`, data);
    return response.data;
  },

  /**
   * Get compliance statistics
   */
  getComplianceStats: async () => {
    const response = await apiClient.get('/db/stats/compliance');
    return response.data;
  },

  /**
   * Get whitelisted wallets
   */
  getWhitelistedWallets: async (investorId: number): Promise<WhitelistedWallet[]> => {
    const response = await apiClient.get<WhitelistedWallet[]>(`/compliance/wallets/${investorId}`);
    return response.data;
  },

  /**
   * Add wallet to whitelist
   */
  whitelistWallet: async (investorId: number, walletAddress: string) => {
    const response = await apiClient.post('/compliance/wallets', { investor_id: investorId, wallet_address: walletAddress });
    return response.data;
  },

  /**
   * Check jurisdiction
   */
  checkJurisdiction: async (jurisdiction: string) => {
    const response = await apiClient.post('/compliance/check-jurisdiction', { jurisdiction });
    return response.data;
  },
};

export default complianceAPI;
