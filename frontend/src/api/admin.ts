/**
 * Admin API - Complete User & System Management
 * Ujamaa DeFi Platform
 */

import apiClient from './client';

// =============================================================================
// Types
// =============================================================================

export interface UserData {
  id: number;
  email: string;
  role: string;
  wallet_address: string | null;
  is_active: boolean;
  has_password: boolean;
  created_at: string | null;
  full_name: string | null;
  kyc_status: string | null;
  bank_balance: number | null;
  bank_account_id: string | null;
}

export interface UserListResponse {
  users: UserData[];
  total: number;
}

export interface UserCreateRequest {
  email: string;
  password?: string;
  role: string;
  wallet_address?: string;
  full_name?: string;
}

export interface UserUpdateRequest {
  email?: string;
  role?: string;
  wallet_address?: string;
  full_name?: string;
  is_active?: boolean;
}

export interface InvestorBankData {
  id: number;
  user_id: number;
  email: string;
  full_name: string;
  role: string;
  bank_account_id: string | null;
  bank_account_number: string | null;
  bank_name: string | null;
  escrow_balance: number;
  available_balance: number;
  locked_amount: number;
  balance: number;
  status: string;
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

export interface AuditActivity {
  id: number;
  user_id: number;
  activity_type: string;
  target_id: number | null;
  target_type: string | null;
  details: any;
  ip_address: string | null;
  created_at: string | null;
}

export interface AuditResponse {
  activities: AuditActivity[];
  total: number;
}

export interface DashboardStats {
  total_users: number;
  active_users: number;
  total_investors: number;
  total_bank_accounts: number;
  total_platform_balance: number;
  total_investments: number;
  total_transactions: number;
  pending_documents: number;
  pool_count: number;
}

export interface AdminWhitelistedWallet {
  id: number;
  investor_id: number;
  wallet_address: string;
  label: string | null;
  jurisdiction: string;
  is_approved: boolean;
  risk_level: string | null;
  created_at: string | null;
  approved_at: string | null;
}

export interface UploadedDocument {
  id: number;
  investor_id: number;
  document_type: string;
  document_name: string;
  upload_status: string;
  verification_status: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
}

// =============================================================================
// User Management
// =============================================================================

export const listUsers = async (params?: {
  role?: string;
  is_active?: boolean;
  search?: string;
}): Promise<UserListResponse> => {
  const response = await apiClient.get('/admin/users', { params });
  return response.data;
};

export const getUser = async (userId: number): Promise<UserData> => {
  const response = await apiClient.get(`/admin/users/${userId}`);
  return response.data;
};

export const createUser = async (data: UserCreateRequest): Promise<UserData> => {
  const response = await apiClient.post('/admin/users', data);
  return response.data;
};

export const updateUser = async (
  userId: number,
  data: UserUpdateRequest
): Promise<UserData> => {
  const response = await apiClient.put(`/admin/users/${userId}`, data);
  return response.data;
};

export const deleteUser = async (userId: number): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete(`/admin/users/${userId}`);
  return response.data;
};

export const resetPassword = async (
  userId: number,
  newPassword: string = 'password123'
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post(`/admin/users/${userId}/reset-password`, {
    new_password: newPassword,
  });
  return response.data;
};

export const toggleUserActive = async (
  userId: number
): Promise<{ success: boolean; message: string; is_active: boolean }> => {
  const response = await apiClient.post(`/admin/users/${userId}/toggle-active`);
  return response.data;
};

// =============================================================================
// Investor Bank Accounts
// =============================================================================

export const getAllInvestorsBankAccounts = async (): Promise<InvestorBankData[]> => {
  const response = await apiClient.get('/admin/investors/bank-accounts');
  return response.data;
};

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

export const updateInvestorStatus = async (
  investorId: number,
  status: 'active' | 'suspended'
): Promise<{ success: boolean; message: string; new_status: string }> => {
  const response = await apiClient.post(`/admin/investors/${investorId}/status`, {
    status,
  });
  return response.data;
};

// =============================================================================
// Documents
// =============================================================================

export const listDocuments = async (status?: string): Promise<{ documents: UploadedDocument[]; total: number }> => {
  const response = await apiClient.get('/admin/documents', { params: { status } });
  return response.data;
};

export const reviewDocument = async (
  docId: number,
  verificationStatus: string,
  reviewNotes?: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.put(`/admin/documents/${docId}/review`, {
    verification_status: verificationStatus,
    review_notes: reviewNotes,
  });
  return response.data;
};

// =============================================================================
// Whitelisted Wallets
// =============================================================================

export const listWhitelistedWallets = async (): Promise<{ wallets: AdminWhitelistedWallet[]; total: number }> => {
  const response = await apiClient.get('/admin/whitelisted-wallets');
  return response.data;
};

export const updateWhitelistedWallet = async (
  walletId: number,
  isApproved: boolean,
  riskLevel?: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.put(`/admin/whitelisted-wallets/${walletId}`, {
    is_approved: isApproved,
    risk_level: riskLevel,
  });
  return response.data;
};

// =============================================================================
// Audit Log
// =============================================================================

export const getAuditLog = async (params?: {
  user_id?: number;
  activity_type?: string;
  limit?: number;
}): Promise<AuditResponse> => {
  const response = await apiClient.get('/admin/audit-log', { params });
  return response.data;
};

// =============================================================================
// Dashboard
// =============================================================================

export const getDashboard = async (): Promise<DashboardStats> => {
  const response = await apiClient.get('/admin/dashboard');
  return response.data;
};

// =============================================================================
// KYC/KYB Settings Management
// =============================================================================

export interface KYCDeadlineSetting {
  setting_key: string;
  current_value: number;
  description: string;
  updated_by: string | null;
  updated_at: string | null;
  change_history: Array<{
    old_value: number | null;
    new_value: number | null;
    reason: string;
    changed_by: string;
    changed_at: string;
  }>;
}

export interface SLAMetrics {
  total_documents: number;
  approved_on_time: number;
  approved_late: number;
  auto_rejected: number;
  still_pending: number;
  sla_compliance_rate: number;
  average_review_time_business_days: number;
  on_time_percentage: number;
  rejection_rate: number;
}

export interface DocumentTypeBreakdown {
  document_type: string;
  total: number;
  approved_on_time: number;
  approved_late: number;
  rejected: number;
  pending: number;
  average_review_days: number;
}

export interface OfficerPerformance {
  officer_id: number;
  officer_email: string;
  total_reviews: number;
  approved: number;
  rejected: number;
  average_response_days: number;
  approval_rate: number;
}

export interface TrendDataPoint {
  date: string;
  total_submissions: number;
  approved_count: number;
  rejected_count: number;
  average_review_days: number;
}

export interface MonitoringDashboard {
  period: string;
  start_date: string;
  end_date: string;
  sla_metrics: SLAMetrics;
  current_deadline_setting: number;
  by_document_type: DocumentTypeBreakdown[];
  officer_performance: OfficerPerformance[];
  trend_data: TrendDataPoint[];
  overdue_summary: {
    total_overdue: number;
    in_grace_period: number;
    past_grace_period: number;
    by_type: Record<string, number>;
  };
  generated_at: string;
}

export interface OverdueDocument {
  document_id: number;
  investor_id: number;
  investor_name: string;
  investor_jurisdiction: string;
  document_type: string;
  document_name: string;
  submitted_at: string | null;
  deadline_at: string | null;
  days_overdue: number;
  status: 'rejected' | 'pending' | 'warning' | 'urgent';
  escalation_level: number;
  reviewed_at: string | null;
  review_notes: string | null;
  extended_by: number | null;
  extended_at: string | null;
  extension_reason: string | null;
}

/**
 * Get current KYC deadline setting and change history
 */
export async function getKYCDeadlineSetting() {
  const response = await apiClient.get('/compliance/settings/kyc-deadline');
  return response.data;
}

/**
 * Update KYC deadline setting (business days)
 */
export async function updateKYCDeadline(businessDays: number, reason: string) {
  const response = await apiClient.put('/compliance/settings/kyc-deadline', {
    business_days: businessDays,
    reason,
  });
  return response.data;
}

/**
 * Extend deadline for a specific document
 */
export async function extendDocumentDeadline(
  documentId: number,
  additionalDays: number,
  reason: string
) {
  const response = await apiClient.post(`/compliance/documents/${documentId}/extend-deadline`, {
    additional_days: additionalDays,
    reason,
  });
  return response.data;
}

/**
 * Cancel auto-rejection for a document
 */
export async function cancelDocumentRejection(documentId: number) {
  const response = await apiClient.post(`/compliance/documents/${documentId}/cancel-rejection`);
  return response.data;
}

/**
 * Get comprehensive monitoring dashboard data
 */
export async function getMonitoringDashboard(period: string = '30d') {
  const response = await apiClient.get('/compliance/monitoring/dashboard', {
    params: { period },
  });
  return response.data;
}

/**
 * Get overdue documents report
 */
export async function getOverdueReport(status: string = 'all', limit: number = 100) {
  const response = await apiClient.get('/compliance/monitoring/overdue-report', {
    params: { status, limit },
  });
  return response.data;
}

/**
 * Get SLA trends over time
 */
export async function getSLATrends(months: number = 6) {
  const response = await apiClient.get('/compliance/monitoring/sla-trends', {
    params: { months },
  });
  return response.data;
}

/**
 * Get compliance officer leaderboard
 */
export async function getOfficerLeaderboard(period: string = '30d', limit: number = 10) {
  const response = await apiClient.get('/compliance/monitoring/officer-leaderboard', {
    params: { period, limit },
  });
  return response.data;
}

// =============================================================================
// Contract Types & API
// =============================================================================

export interface ContractData {
  id: number;
  name: string;
  address: string;
  contract_type: string;
  network: string;
  description: string | null;
  status: string;
  verified: boolean;
  explorer_url: string | null;
  tx_hash: string | null;
  created_at: string | null;
}

export interface ContractCreateRequest {
  name: string;
  address: string;
  contract_type: string;
  network?: string;
  chain_id?: number;
  description?: string;
  tx_hash?: string;
  block_number?: number;
  explorer_url?: string;
  verified?: boolean;
}

export const listContracts = (): Promise<ContractData[]> =>
  apiClient.get('/admin/contracts').then(r => r.data);

export const registerContract = (data: ContractCreateRequest): Promise<ContractData> =>
  apiClient.post('/admin/contracts', data).then(r => r.data);

export const updateContract = (id: number, data: ContractCreateRequest): Promise<ContractData> =>
  apiClient.put(`/admin/contracts/${id}`, data).then(r => r.data);

export const deleteContract = (id: number): Promise<void> =>
  apiClient.delete(`/admin/contracts/${id}`).then(r => r.data);

// =============================================================================
// KYC/KYB Monitoring
// =============================================================================

export interface KycKybPeriodStat {
  period: string;
  total_submitted: number;
  approved: number;
  rejected: number;
  pending: number;
  overdue: number;
  average_review_days: number;
}

export interface KycKybStatsResponse {
  doc_category: string;
  granularity: string;
  periods: KycKybPeriodStat[];
  generated_at: string;
}

export interface KycKybSummaryStat {
  total_submitted: number;
  approved: number;
  rejected: number;
  pending: number;
  overdue: number;
  approval_rate: number;
  rejection_rate: number;
  average_review_days: number;
}

export interface KycKybSummaryResponse {
  kyc: KycKybSummaryStat;
  kyb: KycKybSummaryStat;
  generated_at: string;
}

/**
 * Get KYC/KYB statistics grouped by time period
 *
 * @param granularity - 'daily' | 'weekly' | 'monthly' | 'yearly'
 * @param docCategory - 'kyc' | 'kyb' | 'all'
 */
export const getKycKybStats = (
  granularity: string = 'daily',
  docCategory: string = 'all'
): Promise<KycKybStatsResponse> =>
  apiClient.get('/compliance/monitoring/kyc-kyb-stats', {
    params: { granularity, doc_category: docCategory },
  }).then(r => r.data);

/**
 * Get overall KYC vs KYB summary statistics
 */
export const getKycKybSummary = (): Promise<KycKybSummaryResponse> =>
  apiClient.get('/compliance/monitoring/kyc-kyb-summary').then(r => r.data);

// =============================================================================
// Default export (backward compatibility)
// =============================================================================

export default {
  // Users
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  toggleUserActive,
  // Bank accounts
  getAllInvestorsBankAccounts,
  updateInvestorBankAccount,
  updateInvestorStatus,
  // Documents
  listDocuments,
  reviewDocument,
  // KYC Settings
  getKYCDeadlineSetting,
  updateKYCDeadline,
  extendDocumentDeadline,
  cancelDocumentRejection,
  // Compliance Monitoring
  getMonitoringDashboard,
  getOverdueReport,
  getSLATrends,
  getOfficerLeaderboard,
  // KYC/KYB Monitoring
  getKycKybStats,
  getKycKybSummary,
  // Wallets
  listWhitelistedWallets,
  updateWhitelistedWallet,
  // Audit
  getAuditLog,
  // Dashboard
  getDashboard,
  // Contracts
  listContracts,
  registerContract,
  updateContract,
  deleteContract,
};
