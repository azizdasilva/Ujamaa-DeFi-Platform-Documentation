/**
 * Compliance API
 * Ujamaa DeFi Platform
 */

import apiClient from './client';

// Types
export interface Document {
  id: number;
  investor_id: number;
  investor_name?: string;
  investor_jurisdiction?: string;
  document_type: string;
  document_name: string;
  file_path?: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  deadline_at: string;
  time_remaining_hours?: number;
  is_overdue?: boolean;
  review_notes?: string;
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
  notes: string;
  reviewer_id: number;
}

export interface Transaction {
  id: number;
  investor_id: number;
  investor_name?: string;
  investor_jurisdiction?: string;
  transaction_type: string;
  amount: number;
  currency: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  is_flagged: boolean;
  flag_reason?: string;
  flagged_at?: string;
  status: string;
  review_action?: 'cleared' | 'blocked' | 'escalated';
  reviewed_by?: number;
  reviewed_at?: string;
  review_notes?: string;
  created_at: string;
}

export interface ReviewTransactionRequest {
  action: 'clear' | 'block';
  notes: string;
  reviewer_id: number;
}

export interface Jurisdiction {
  code: string;
  name: string;
  status: 'allowed' | 'blocked';
  category: 'africa' | 'international' | 'blocked';
  notes?: string;
  sanctions_list?: string;
}

export interface JurisdictionCheck {
  code: string;
  name: string;
  is_allowed: boolean;
  status: string;
  category: string;
  notes?: string;
  sanctions_list?: string;
  message: string;
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
   * Get pending documents for compliance review
   */
  getPendingDocuments: async (includeOverdueOnly?: boolean): Promise<Document[]> => {
    const params = new URLSearchParams();
    if (includeOverdueOnly) params.append('include_overdue_only', 'true');
    
    const response = await apiClient.get<Document[]>(`/db/documents/pending?${params}`);
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
   * Get all documents for an investor
   */
  getInvestorDocuments: async (investorId: number): Promise<Document[]> => {
    const response = await apiClient.get<Document[]>(`/db/investors/${investorId}/documents`);
    return response.data;
  },

  /**
   * Upload a new document
   */
  uploadDocument: async (data: {
    investor_id: number;
    document_type: string;
    document_name: string;
    file_path: string;
    file_hash?: string;
  }) => {
    const response = await apiClient.post('/db/documents', data);
    return response.data;
  },

  /**
   * Review document (approve/reject)
   */
  reviewDocument: async (documentId: number, data: ReviewDocumentRequest) => {
    const response = await apiClient.post(`/db/documents/${documentId}/review`, data);
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
   * Get flagged transactions for compliance review
   */
  getFlaggedTransactions: async (status?: string, riskLevel?: string): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (riskLevel) params.append('risk_level', riskLevel);
    
    const response = await apiClient.get<Transaction[]>(`/db/transactions/flagged?${params}`);
    return response.data;
  },

  /**
   * Review transaction (clear/block)
   */
  reviewTransaction: async (transactionId: number, data: ReviewTransactionRequest) => {
    const response = await apiClient.post(`/db/transactions/${transactionId}/review`, data);
    return response.data;
  },

  /**
   * Get all transactions
   */
  getTransactions: async (investorId?: number, transactionType?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (investorId) params.append('investor_id', investorId.toString());
    if (transactionType) params.append('transaction_type', transactionType);
    if (limit) params.append('limit', limit.toString());
    
    const response = await apiClient.get(`/db/transactions?${params}`);
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
  checkJurisdiction: async (jurisdiction: string): Promise<JurisdictionCheck> => {
    const response = await apiClient.get<JurisdictionCheck>(`/db/jurisdictions/check/${jurisdiction}`);
    return response.data;
  },

  /**
   * Get all jurisdictions
   */
  getJurisdictions: async (status?: string, category?: string): Promise<Jurisdiction[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    
    const response = await apiClient.get<Jurisdiction[]>(`/db/jurisdictions?${params}`);
    return response.data;
  },

  /**
   * Add new jurisdiction
   */
  addJurisdiction: async (data: {
    code: string;
    name: string;
    status: 'allowed' | 'blocked';
    category: 'africa' | 'international' | 'blocked';
    notes?: string;
    sanctions_list?: string;
  }) => {
    const response = await apiClient.post('/db/jurisdictions', data);
    return response.data;
  },

  /**
   * Update jurisdiction
   */
  updateJurisdiction: async (code: string, data: {
    status?: 'allowed' | 'blocked';
    notes?: string;
    sanctions_list?: string;
    category?: string;
  }) => {
    const response = await apiClient.put(`/db/jurisdictions/${code}`, data);
    return response.data;
  },

  /**
   * Delete jurisdiction
   */
  deleteJurisdiction: async (code: string) => {
    const response = await apiClient.delete(`/db/jurisdictions/${code}`);
    return response.data;
  },
};

export default complianceAPI;
