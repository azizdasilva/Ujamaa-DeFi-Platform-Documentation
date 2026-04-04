/**
 * Admin - Transaction Monitor Page
 *
 * Monitor and review flagged transactions for AML/KYC compliance.
 *
 * Route: /compliance/transactions
 */

import React, { useState, useEffect } from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import apiClient from '../../../api/client';

interface Transaction {
  id: number;
  investor_id: number;
  investor_name?: string;
  investor_jurisdiction?: string;
  transaction_type: string;
  amount: number;
  currency: string;
  risk_level?: string;
  is_flagged: boolean;
  flag_reason?: string;
  flagged_at?: string;
  status: string;
  review_action?: string;
  reviewed_by?: number;
  reviewed_at?: string;
  review_notes?: string;
  created_at: string;
  transaction_hash?: string;
}

const TransactionMonitor: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'flagged' | 'reviewed'>('flagged');
  const [riskFilter, setRiskFilter] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const complianceOfficerId = 4;

  useEffect(() => { fetchTransactions(); }, [filter, riskFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let txns: Transaction[];
      if (filter === 'flagged') {
        const r = await apiClient.get('/db/transactions/flagged', {
          params: { status: 'pending', risk_level: riskFilter || undefined }
        });
        txns = r.data;
      } else if (filter === 'reviewed') {
        const r = await apiClient.get('/db/transactions/flagged', {
          params: { status: 'cleared', risk_level: riskFilter || undefined }
        });
        txns = r.data;
      } else {
        const r = await apiClient.get('/db/transactions', {
          params: { limit: 100 }
        });
        txns = r.data;
      }
      setTransactions(txns || []);
    } catch (e: any) {
      console.error('Error fetching transactions:', e);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (action: 'clear' | 'block') => {
    if (!selectedTxn) return;
    setReviewing(true);
    try {
      await apiClient.post(`/db/transactions/${selectedTxn.id}/review`, {
        action,
        notes: reviewNotes || `Transaction ${action}ed via compliance review`,
        reviewer_id: complianceOfficerId
      });
      alert(`✅ Transaction ${action === 'clear' ? 'cleared' : 'blocked'} successfully`);
      setReviewNotes('');
      setSelectedTxn(null);
      await fetchTransactions();
    } catch (e: any) {
      alert(`✗ Error: ${e.response?.data?.detail || e.message}`);
    } finally {
      setReviewing(false);
    }
  };

  const getRiskBadgeColor = (riskLevel: string | null | undefined): 'error' | 'warning' | 'success' | 'info' => {
    const level = (riskLevel || 'unknown').toLowerCase();
    switch (level) {
      case 'critical': case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'info';
    }
  };

  const stats = {
    flagged: filter === 'flagged' ? transactions.length : transactions.filter(t => !t.review_action).length,
    reviewed: filter === 'reviewed' ? transactions.length : transactions.filter(t => t.review_action).length,
    total: transactions.length,
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Transaction Monitor</h1>
              <p className="text-[#8b5b3d] mt-1">Review flagged transactions for AML/KYC compliance</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Flagged</p>
            <p className="text-2xl font-bold text-red-600">{loading ? '-' : stats.flagged}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Reviewed</p>
            <p className="text-2xl font-bold text-green-600">{loading ? '-' : stats.reviewed}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total</p>
            <p className="text-2xl font-bold text-[#103b5b]">{loading ? '-' : stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Risk Filter</p>
            <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)}
              className="w-full mt-1 px-3 py-1 border border-gray-300 rounded-lg text-sm">
              <option value="">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Filter Tabs */}
        <Card className="mb-6">
          <div className="flex gap-2">
            {([
              { key: 'flagged' as const, label: 'Flagged', count: stats.flagged },
              { key: 'reviewed' as const, label: 'Reviewed', count: stats.reviewed },
              { key: 'all' as const, label: 'All', count: stats.total },
            ]).map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === f.key ? 'bg-[#023D7A] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </Card>

        {/* Transactions Table */}
        <Card>
          {loading ? <p className="text-center py-8 text-gray-500">Loading transactions...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#103b5b]/20">
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Investor</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Risk</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-gray-500">No transactions found</td></tr>
                ) : (
                  transactions.map(txn => (
                    <tr key={txn.id}
                      onClick={() => setSelectedTxn(selectedTxn?.id === txn.id ? null : txn)}
                      className={`border-b border-[#103b5b]/10 cursor-pointer transition-colors ${
                        selectedTxn?.id === txn.id ? 'bg-[#023D7A]/5' : 'hover:bg-gray-50'
                      }`}>
                      <td className="py-3 px-4 font-mono text-xs">#{txn.id}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#103b5b]">{txn.investor_name || `Investor #${txn.investor_id}`}</p>
                        <p className="text-xs text-gray-500">{txn.investor_jurisdiction || 'Unknown'}</p>
                      </td>
                      <td className="py-3 px-4 font-semibold">€{(txn.amount || 0).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge variant="info" size="sm">{(txn.transaction_type || '').replace(/_/g, ' ')}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getRiskBadgeColor(txn.risk_level)} size="sm">
                          {(txn.risk_level || 'unknown').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={txn.review_action ? 'success' : 'warning'} size="sm">
                          {txn.review_action || 'PENDING'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {!txn.review_action ? (
                          <button onClick={e => { e.stopPropagation(); setSelectedTxn(txn); }}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded">
                            Review
                          </button>
                        ) : <span className="text-xs text-gray-500">Done</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          )}
        </Card>

        {/* Detail Panel */}
        {selectedTxn && (
          <Card className="mt-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-[#103b5b]">Transaction Details: #{selectedTxn.id}</h3>
              <button onClick={() => setSelectedTxn(null)} className="text-gray-500 hover:text-gray-700 text-lg font-bold">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-[#103b5b] mb-3">Transaction Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-semibold">€{(selectedTxn.amount || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Type</span><span>{(selectedTxn.transaction_type || '').replace(/_/g, ' ')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Status</span><span>{(selectedTxn.status || '').toUpperCase()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{selectedTxn.created_at ? new Date(selectedTxn.created_at).toLocaleDateString() : '—'}</span></div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-[#103b5b] mb-3">Investor</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Name</span><span>{selectedTxn.investor_name || `Investor #${selectedTxn.investor_id}`}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Jurisdiction</span><span>{selectedTxn.investor_jurisdiction || 'Unknown'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Risk</span><Badge variant={getRiskBadgeColor(selectedTxn.risk_level)} size="sm">{(selectedTxn.risk_level || 'unknown').toUpperCase()}</Badge></div>
                </div>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold text-[#103b5b] mb-3">Flag Reason</h4>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-700">{selectedTxn.flag_reason || 'No reason provided'}</p>
                </div>
              </div>
            </div>

            {!selectedTxn.review_action ? (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Review Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea value={reviewNotes} onChange={e => setReviewNotes(e.target.value)}
                  placeholder="Enter findings and justification..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A]" rows={3} />
                <div className="flex gap-3 mt-4">
                  <button onClick={() => handleReview('clear')} disabled={reviewing}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg disabled:opacity-50">
                    ✓ Clear Transaction
                  </button>
                  <button onClick={() => handleReview('block')} disabled={reviewing}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg disabled:opacity-50">
                    ✗ Block Transaction
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-gray-200 bg-green-50 border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-900 mb-2">✓ Transaction {selectedTxn.review_action === 'cleared' ? 'Cleared' : 'Blocked'}</p>
                <p className="text-xs text-green-700">
                  <strong>Reviewed by:</strong> Officer #{selectedTxn.reviewed_by || 'N/A'}<br/>
                  <strong>Date:</strong> {selectedTxn.reviewed_at ? new Date(selectedTxn.reviewed_at).toLocaleDateString() : 'N/A'}<br/>
                  <strong>Notes:</strong> {selectedTxn.review_notes || 'No notes'}
                </p>
              </div>
            )}
          </Card>
        )}
      </main>
    </div>
  );
};

export default TransactionMonitor;
