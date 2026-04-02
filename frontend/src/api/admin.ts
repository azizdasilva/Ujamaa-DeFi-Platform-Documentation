/**
 * Admin API - Bank Account Management
 * Ujamaa DeFi Platform
 */

import apiClient from './client';

export interface InvestorBankData {
  id: number;
  user_id: number;
  email: string;
  full_name: string;
  role: string;
  bank_account_number: string | null;
  bank_name: string | null;
  escrow_balance: number;
  available_balance: number;
  locked_amount: number;
  status: 'active' | 'suspended' | 'pending';
  created_at: string | null;
}

export interface BankUpdateRequest {
  balance_type: 'escrow' | 'available' | 'locked';
  operation: 'increase' | 'decrease';
  amount: number;
  reason: string;
}

export interface BankUpdateResponse {
  success: boolean;
  message: string;
  investor_id: number;
  investor_email: string;
  balance_type: string;
  operation: string;
  amount: number;
  previous_balance: number;
  new_balance: number;
  updated_at: string;
}

/**
 * Get all investors with bank account information
 */
export const getAllInvestorsBankAccounts = async (): Promise<InvestorBankData[]> => {
  const response = await apiClient.get('/admin/investors/bank-accounts');
  return response.data;
};

/**
 * Update investor bank account balance
 */
export const updateInvestorBankAccount = async (
  investorId: number,
  request: BankUpdateRequest
): Promise<BankUpdateResponse> => {
  const response = await apiClient.post(
    `/admin/investors/${investorId}/bank-account/update`,
    request
  );
  return response.data;
};

/**
 * Update investor status
 */
export const updateInvestorStatus = async (
  investorId: number,
  status: 'active' | 'suspended'
): Promise<{ success: boolean; message: string; new_status: string }> => {
  const response = await apiClient.post(
    `/admin/investors/${investorId}/status`,
    { status }
  );
  return response.data;
};

export default {
  getAllInvestorsBankAccounts,
  updateInvestorBankAccount,
  updateInvestorStatus,
};
