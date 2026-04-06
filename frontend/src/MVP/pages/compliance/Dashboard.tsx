/**
 * Compliance Officer Dashboard
 *
 * Dashboard for compliance officers to manage KYC/KYB approvals, monitor transactions, and generate reports.
 *
 * Route: /compliance/dashboard
 *
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import StatsCard from '../../components/StatsCard';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import complianceAPI, { Document, Transaction } from '../../../api/compliance';

interface ComplianceStats {
  pending_documents: number;
  overdue_documents: number;
  approved_today: number;
}

const ComplianceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ComplianceStats>({
    pending_documents: 0,
    overdue_documents: 0,
    approved_today: 0,
  });
  const [pendingDocuments, setPendingDocuments] = useState<Document[]>([]);
  const [flaggedTransactions, setFlaggedTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchComplianceData = async () => {
      try {
        setLoading(true);
        
        // Fetch compliance stats
        const statsResponse = await complianceAPI.getComplianceStats();
        setStats(statsResponse);
        
        // Fetch pending documents
        const pendingResponse = await complianceAPI.getPendingDocuments();
        setPendingDocuments(pendingResponse.slice(0, 5)); // Show top 5
        
        // Fetch flagged transactions
        const flaggedResponse = await complianceAPI.getFlaggedTransactions('pending');
        setFlaggedTransactions(flaggedResponse.slice(0, 5)); // Show top 5
      } catch (error) {
        console.error('Error fetching compliance data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComplianceData();
  }, []);

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'red';
      case 'high': return 'red';
      case 'medium': return 'warning';
      case 'low': return 'green';
      default: return 'secondary';
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'kyc_id': 'KYC - ID',
      'kyc_address': 'KYC - Address',
      'kyc_selfie': 'KYC - Selfie',
      'kyb_incorporation': 'KYB - Incorporation',
      'kyb_tax': 'KYB - Tax',
      'kyb_ubo': 'KYB - UBO',
      'kyb_resolution': 'KYB - Resolution',
      'kyb_aml': 'KYB - AML',
      'kyb_license': 'KYB - License',
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      {/* MVP Banner */}
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Compliance Officer Dashboard</h1>
              <p className="text-[#8b5b3d] mt-1">KYC/KYB Management & Transaction Monitoring</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="info" size="md">Compliance Portal</Badge>
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Pending Documents"
            value={loading ? '-' : stats.pending_documents}
            color="amber"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            label="Overdue"
            value={loading ? '-' : stats.overdue_documents}
            color="red"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            label="Flagged Transactions"
            value={loading ? '-' : flaggedTransactions.length}
            color="red"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Approved Today"
            value={loading ? '-' : stats.approved_today}
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Approvals */}
            <Card
              header={
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#103b5b]">Pending Approvals</h2>
                  <a href="/compliance/kyc-review" className="text-[#d57028] hover:text-[#c05a1e] text-sm font-medium">
                    View All →
                  </a>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#103b5b]/20">
                      <th className="text-left py-3 font-semibold text-[#103b5b]">Investor</th>
                      <th className="text-left py-3 font-semibold text-[#103b5b]">Document Type</th>
                      <th className="text-left py-3 font-semibold text-[#103b5b]">Jurisdiction</th>
                      <th className="text-left py-3 font-semibold text-[#103b5b]">Time Remaining</th>
                      <th className="text-left py-3 font-semibold text-[#103b5b]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-[#8b5b3d]">Loading pending documents...</td>
                      </tr>
                    ) : pendingDocuments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-[#8b5b3d]">No pending documents 🎉</td>
                      </tr>
                    ) : (
                      pendingDocuments.map((doc) => (
                        <tr key={doc.id} className="border-b border-[#103b5b]/10">
                          <td className="py-3 font-medium text-[#103b5b]">
                            <div>{doc.investor_name || `Investor #${doc.investor_id}`}</div>
                            <div className="text-xs text-gray-500">ID: {doc.investor_id}</div>
                          </td>
                          <td className="py-3">
                            <Badge variant={doc.document_type.startsWith('kyb') ? 'primary' : 'info'} size="sm">
                              {getDocumentTypeLabel(doc.document_type)}
                            </Badge>
                          </td>
                          <td className="py-3 text-[#8b5b3d]">{doc.investor_jurisdiction || 'Unknown'}</td>
                          <td className="py-3">
                            {doc.time_remaining_hours !== undefined ? (
                              doc.is_overdue ? (
                                <Badge variant="danger" size="sm">⚠️ Overdue</Badge>
                              ) : doc.time_remaining_hours < 4 ? (
                                <Badge variant="danger" size="sm">{Math.round(doc.time_remaining_hours)}h left</Badge>
                              ) : (
                                <span className="text-[#8b5b3d]">{Math.round(doc.time_remaining_hours)}h</span>
                              )
                            ) : (
                              <span className="text-[#8b5b3d]">-</span>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => navigate(`/compliance/approvals/${doc.id}/review`)}
                                className="px-3 py-1 bg-[#103b5b] hover:bg-[#0d3352] text-white text-xs font-bold rounded transition-colors"
                              >
                                Review
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Flagged Transactions */}
            <Card
              header={
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Flagged Transactions</h2>
                  <a href="/compliance/transactions" className="text-[#00A8A8] hover:text-[#0D7A7A] text-sm font-medium">
                    View All →
                  </a>
                </div>
              }
            >
              <div className="space-y-3">
                {loading ? (
                  <p className="text-center text-[#8b5b3d] py-8">Loading flagged transactions...</p>
                ) : flaggedTransactions.length === 0 ? (
                  <p className="text-center text-[#8b5b3d] py-8">No flagged transactions 🎉</p>
                ) : (
                  flaggedTransactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            txn.risk_level === 'high' || txn.risk_level === 'critical' ? 'bg-red-500' :
                            txn.risk_level === 'medium' ? 'bg-amber-500' :
                            'bg-blue-500'
                          }`}
                        />
                        <div>
                          <p className="font-mono text-xs text-gray-500">#{txn.id}</p>
                          <p className="font-semibold text-gray-900">{txn.investor_name || `Investor #${txn.investor_id}`}</p>
                          <p className="text-xs text-gray-600">{txn.flag_reason || txn.transaction_type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">€{txn.amount.toLocaleString()}</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => navigate(`/compliance/transactions`)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-colors"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card header={<h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>}>
              <div className="space-y-3">
                <a
                  href="/compliance/kyc-review"
                  className="block w-full px-4 py-3 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-colors text-center"
                >
                  ✓ Review Pending Approvals
                </a>
                <a
                  href="/compliance/transactions"
                  className="block w-full px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center"
                >
                  🔍 Transaction Monitor
                </a>
                <a
                  href="/compliance/jurisdictions"
                  className="block w-full px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center"
                >
                  🌍 Jurisdiction List
                </a>
                <button
                  onClick={() => navigate('/compliance/kyc-review')}
                  className="block w-full px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center"
                >
                  🔍 KYC/KYB Review Queue
                </button>
              </div>
            </Card>

            {/* Jurisdiction Status */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">Jurisdiction Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Blocked</span>
                  <Badge variant="error" size="sm">12</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Allowed (Africa)</span>
                  <Badge variant="success" size="sm">9</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Allowed (Intl)</span>
                  <Badge variant="info" size="sm">5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Review Required</span>
                  <Badge variant="warning" size="sm">0</Badge>
                </div>
              </div>
              <a
                href="/compliance/jurisdictions"
                className="block w-full mt-4 px-4 py-2 bg-[#F3F8FA] hover:bg-[#E2E8F0] text-[#023D7A] text-sm font-bold rounded-lg transition-colors text-center"
              >
                Manage Jurisdictions →
              </a>
            </Card>

            {/* Compliance Calendar */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">Upcoming Deadlines</h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-semibold text-red-800">Today</p>
                  <p className="text-sm text-red-700">Monthly AML Report</p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-semibold text-amber-800">Mar 31, 2026</p>
                  <p className="text-sm text-amber-700">Quarterly Compliance Review</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-semibold text-blue-800">Apr 15, 2026</p>
                  <p className="text-sm text-blue-700">Regulatory Filing</p>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 pb-3 border-b border-gray-100">
                  <svg className="w-4 h-4 text-[#00A8A8] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="text-gray-900">Approved KYB for Logic Capital</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 pb-3 border-b border-gray-100">
                  <svg className="w-4 h-4 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-gray-900">Flagged transaction TXN-001</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-gray-900">Updated jurisdiction list</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            🚀 MVP: Compliance Officer Portal - Testnet Release • Polygon Amoy (Chain ID: 80002)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ComplianceDashboard;
