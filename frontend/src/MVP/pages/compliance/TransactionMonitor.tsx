/**
 * Compliance - Transaction Monitor Page
 *
 * Monitor and review flagged transactions for AML/KYC compliance.
 *
 * Route: /compliance/transactions
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import complianceAPI, { Transaction } from '../../../api/compliance';

const TransactionMonitor: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'reviewed'>('flagged');
  const [riskFilter, setRiskFilter] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Current user (compliance officer)
  const complianceOfficerId = 4;

  useEffect(() => {
    fetchTransactions();
  }, [filter, riskFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let txns;
      
      if (filter === 'flagged') {
        txns = await complianceAPI.getFlaggedTransactions('pending', riskFilter || undefined);
      } else if (filter === 'reviewed') {
        txns = await complianceAPI.getFlaggedTransactions('cleared', riskFilter || undefined);
      } else {
        txns = await complianceAPI.getTransactions(undefined, undefined, 100);
      }
      
      setTransactions(txns);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (action: 'clear' | 'block') => {
    if (!selectedTxn) return;

    try {
      await complianceAPI.reviewTransaction(selectedTxn.id, {
        action,
        notes: reviewNotes || `Transaction ${action}ed via compliance review`,
        reviewer_id: complianceOfficerId
      });

      alert(`✓ Transaction ${action}ed successfully!`);
      setReviewNotes('');
      setSelectedTxn(null);
      
      // Refresh the list
      fetchTransactions();
      
      // Navigate to dashboard to show updated stats
      navigate('/compliance/dashboard');
    } catch (error: any) {
      console.error('Error reviewing transaction:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to review transaction';
      alert(`✗ Error: ${errorMsg}`);
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'danger';
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'info';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'INVESTMENT': '💰',
      'REDEMPTION': '💸',
      'YIELD': '📈',
      'DEPOSIT': '📥',
      'WITHDRAWAL': '📤',
      'TRANSFER': '🔄',
    };
    return icons[type] || '📋';
  };

  const stats = {
    total: transactions.length,
    flagged: filter === 'flagged' ? transactions.length : transactions.filter(t => !t.review_action).length,
    reviewed: filter === 'reviewed' ? transactions.length : transactions.filter(t => t.review_action).length,
    highRisk: transactions.filter(t => t.risk_level === 'high' || t.risk_level === 'critical').length,
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Transaction Monitor</h1>
              <p className="text-[#8b5b3d] mt-1">AML/KYC Transaction Surveillance</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total Transactions</p>
            <p className="text-2xl font-bold text-[#103b5b]">{loading ? '-' : stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Flagged</p>
            <p className="text-2xl font-bold text-red-600">{loading ? '-' : stats.flagged}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Reviewed</p>
            <p className="text-2xl font-bold text-green-600">{loading ? '-' : stats.reviewed}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">High Risk</p>
            <p className="text-2xl font-bold text-red-600">{loading ? '-' : stats.highRisk}</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-[#023D7A] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Transactions
              </button>
              <button
                onClick={() => setFilter('flagged')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'flagged'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Flagged Only
              </button>
              <button
                onClick={() => setFilter('reviewed')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'reviewed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Reviewed
              </button>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023D7A]"
              >
                <option value="">All Risk Levels</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTransactions}
                className="text-[#00A8A8] border-[#00A8A8] hover:bg-[#F3F8FA]"
              >
                🔄 Refresh
              </Button>
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card>
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
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Reason</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">Loading transactions...</td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">No transactions found 🎉</td>
                  </tr>
                ) : (
                  transactions.map((txn) => (
                    <tr
                      key={txn.id}
                      onClick={() => setSelectedTxn(selectedTxn?.id === txn.id ? null : txn)}
                      className={`border-b border-[#103b5b]/10 cursor-pointer transition-colors ${
                        selectedTxn?.id === txn.id ? 'bg-[#023D7A]/5' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-xs">#{txn.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-[#103b5b]">{txn.investor_name || `Investor #${txn.investor_id}`}</p>
                          <p className="text-xs text-gray-500">{txn.investor_jurisdiction || 'Unknown'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#103b5b]">€{txn.amount.toLocaleString()}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span>{getTransactionTypeIcon(txn.transaction_type)}</span>
                          <Badge variant="info" size="sm">
                            {txn.transaction_type}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getRiskBadgeColor(txn.risk_level)} size="sm">
                          {txn.risk_level.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={txn.review_action ? 'success' : 'warning'}
                          size="sm"
                        >
                          {txn.review_action || 'PENDING'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-xs text-gray-600">
                        {txn.flag_reason || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {txn.review_action ? (
                            <span className="text-xs text-gray-500">
                              Reviewed
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTxn(txn);
                                }}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded transition-colors"
                              >
                                Review
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Transaction Details Panel */}
        {selectedTxn && (
          <Card className="mt-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-[#103b5b]">Transaction Details: #{selectedTxn.id}</h3>
              <button
                onClick={() => setSelectedTxn(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-[#103b5b] mb-3">Transaction Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="font-mono text-[#103b5b]">#{selectedTxn.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-semibold text-[#103b5b]">€{selectedTxn.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="text-[#103b5b]">{selectedTxn.transaction_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Currency</span>
                    <span className="text-[#103b5b]">{selectedTxn.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="text-[#103b5b]">{new Date(selectedTxn.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[#103b5b] mb-3">Investor Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Investor</span>
                    <span className="text-[#103b5b]">{selectedTxn.investor_name || `Investor #${selectedTxn.investor_id}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Jurisdiction</span>
                    <span className="text-[#103b5b]">{selectedTxn.investor_jurisdiction || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Risk Level</span>
                    <Badge variant={getRiskBadgeColor(selectedTxn.risk_level)} size="sm">
                      {selectedTxn.risk_level}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <h4 className="font-semibold text-[#103b5b] mb-3">Compliance Review</h4>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-amber-900 mb-2">Flag Reason:</p>
                  <p className="text-sm text-amber-700">{selectedTxn.flag_reason || 'No reason provided'}</p>
                </div>

                {!selectedTxn.review_action ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-[#103b5b] mb-2">
                        Review Notes <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Enter your review notes, findings, and justification..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A] focus:border-transparent"
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReview('clear')}
                        className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                      >
                        ✓ Clear Transaction
                      </button>
                      <button
                        onClick={() => handleReview('block')}
                        className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                      >
                        ✗ Block Transaction
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-green-900 mb-2">
                      ✓ Transaction {selectedTxn.review_action === 'cleared' ? 'Cleared' : 'Blocked'}
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Reviewed by:</strong> Compliance Officer #{selectedTxn.reviewed_by}<br/>
                      <strong>Date:</strong> {selectedTxn.reviewed_at ? new Date(selectedTxn.reviewed_at).toLocaleString() : 'N/A'}<br/>
                      <strong>Notes:</strong> {selectedTxn.review_notes || 'No notes provided'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default TransactionMonitor;
