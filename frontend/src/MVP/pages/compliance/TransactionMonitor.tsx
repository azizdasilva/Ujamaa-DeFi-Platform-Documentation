/**
 * Compliance - Transaction Monitor Page
 *
 * Monitor and review flagged transactions for AML/KYC compliance.
 *
 * Route: /compliance/transactions
 */

import React, { useState } from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const TransactionMonitor: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'flagged' | 'reviewed'>('all');
  const [selectedTxn, setSelectedTxn] = useState<string | null>(null);

  // Mock transaction data
  const transactions = [
    {
      id: 'TXN-001',
      investor: 'High Risk Corp',
      investorId: 'INV-045',
      amount: 750000,
      type: 'investment',
      status: 'flagged',
      riskLevel: 'high',
      reason: 'Large amount exceeds threshold',
      date: '2026-03-20 14:32',
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      poolFamily: 'POOL_INDUSTRY',
      jurisdiction: 'MU',
      reviewedBy: null,
    },
    {
      id: 'TXN-002',
      investor: 'Quick Invest Ltd',
      investorId: 'INV-032',
      amount: 200000,
      type: 'investment',
      status: 'flagged',
      riskLevel: 'medium',
      reason: 'Unusual transaction pattern detected',
      date: '2026-03-20 11:15',
      walletAddress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      poolFamily: 'POOL_TRADE_FINANCE',
      jurisdiction: 'KE',
      reviewedBy: null,
    },
    {
      id: 'TXN-003',
      investor: 'New Investor',
      investorId: 'INV-078',
      amount: 95000,
      type: 'investment',
      status: 'flagged',
      riskLevel: 'low',
      reason: 'Near reporting threshold',
      date: '2026-03-19 16:45',
      walletAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
      poolFamily: 'POOL_AGRICULTURE',
      jurisdiction: 'NG',
      reviewedBy: null,
    },
    {
      id: 'TXN-004',
      investor: 'Logic Capital Ltd',
      investorId: 'INV-001',
      amount: 500000,
      type: 'investment',
      status: 'reviewed',
      riskLevel: 'medium',
      reason: 'Large amount - reviewed and cleared',
      date: '2026-03-18 09:20',
      walletAddress: '0xbDA5747bFD65F08deb54cb460eB87D402817AD3a',
      poolFamily: 'POOL_INDUSTRY',
      jurisdiction: 'MU',
      reviewedBy: 'compliance@ujamaa-defi.com',
    },
    {
      id: 'TXN-005',
      investor: 'Green Energy Fund',
      investorId: 'INV-003',
      amount: 1000000,
      type: 'investment',
      status: 'reviewed',
      riskLevel: 'high',
      reason: 'High value - enhanced due diligence completed',
      date: '2026-03-17 13:50',
      walletAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
      poolFamily: 'POOL_RENEWABLE_ENERGY',
      jurisdiction: 'ZA',
      reviewedBy: 'compliance@ujamaa-defi.com',
    },
  ];

  const filteredTransactions = transactions.filter(txn => {
    if (filter === 'all') return true;
    if (filter === 'flagged') return txn.status === 'flagged';
    if (filter === 'reviewed') return txn.status === 'reviewed';
    return true;
  });

  const handleClear = (id: string) => {
    const reason = prompt('Add clearance notes (optional):') || 'No additional notes';
    alert(`✓ Transaction ${id} cleared.\n\nNotes: ${reason}\n\nIn production:\n• Transaction status updated\n• Compliance event logged\n• Investor notified if required`);
  };

  const handleBlock = (id: string) => {
    const reason = prompt('Provide blocking reason (required):');
    if (reason) {
      alert(`⚠ Transaction ${id} blocked.\n\nReason: ${reason}\n\nIn production:\n• Transaction reversed/held\n• Investor account flagged\n• Regulatory report generated\n• Compliance event logged`);
    }
  };

  const stats = {
    total: transactions.length,
    flagged: transactions.filter(t => t.status === 'flagged').length,
    reviewed: transactions.filter(t => t.status === 'reviewed').length,
    highRisk: transactions.filter(t => t.riskLevel === 'high').length,
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
            <p className="text-2xl font-bold text-[#103b5b]">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Flagged</p>
            <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Reviewed</p>
            <p className="text-2xl font-bold text-green-600">{stats.reviewed}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">High Risk</p>
            <p className="text-2xl font-bold text-red-600">{stats.highRisk}</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
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
              <input
                type="text"
                placeholder="Search transactions..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
              />
              <button className="p-2 bg-[#023D7A] hover:bg-[#0d3352] text-white rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
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
                {filteredTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    onClick={() => setSelectedTxn(selectedTxn === txn.id ? null : txn.id)}
                    className={`border-b border-[#103b5b]/10 cursor-pointer transition-colors ${
                      selectedTxn === txn.id ? 'bg-[#023D7A]/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-xs">{txn.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-[#103b5b]">{txn.investor}</p>
                        <p className="text-xs text-gray-500">{txn.investorId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#103b5b]">€{txn.amount.toLocaleString()}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={txn.type === 'investment' ? 'info' : 'warning'} size="sm">
                        {txn.type.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            txn.riskLevel === 'high' ? 'bg-red-500' :
                            txn.riskLevel === 'medium' ? 'bg-amber-500' :
                            'bg-blue-500'
                          }`}
                        />
                        <span className="text-xs font-semibold text-gray-700">{txn.riskLevel.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={txn.status === 'flagged' ? 'warning' : 'success'}
                        size="sm"
                      >
                        {txn.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-xs text-gray-600">
                      {txn.reason}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {txn.status === 'flagged' ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClear(txn.id);
                              }}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded transition-colors"
                            >
                              Clear
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBlock(txn.id);
                              }}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-colors"
                            >
                              Block
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500">
                            Reviewed by {txn.reviewedBy}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Transaction Details Panel */}
        {selectedTxn && (
          <Card className="mt-6">
            {(() => {
              const txn = transactions.find(t => t.id === selectedTxn);
              if (!txn) return null;

              return (
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-[#103b5b]">Transaction Details: {txn.id}</h3>
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
                          <span className="font-mono text-[#103b5b]">{txn.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Amount</span>
                          <span className="font-semibold text-[#103b5b]">€{txn.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Type</span>
                          <span className="text-[#103b5b]">{txn.type.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Date/Time</span>
                          <span className="text-[#103b5b]">{txn.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pool Family</span>
                          <span className="text-[#103b5b]">{txn.poolFamily.replace('POOL_', '')}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#103b5b] mb-3">Investor Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Name</span>
                          <span className="font-semibold text-[#103b5b]">{txn.investor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Investor ID</span>
                          <span className="font-mono text-[#103b5b]">{txn.investorId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Jurisdiction</span>
                          <span className="text-[#103b5b]">{txn.jurisdiction}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Wallet Address</span>
                          <span className="font-mono text-xs text-[#103b5b]">{txn.walletAddress}</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <h4 className="font-semibold text-[#103b5b] mb-3">Risk Assessment</h4>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">Risk Level</span>
                          <Badge
                            variant={txn.riskLevel === 'high' ? 'danger' : txn.riskLevel === 'medium' ? 'warning' : 'info'}
                            size="md"
                          >
                            {txn.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">Flag Reason</span>
                          <span className="text-sm text-[#103b5b]">{txn.reason}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Status</span>
                          <Badge variant={txn.status === 'flagged' ? 'warning' : 'success'} size="md">
                            {txn.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {txn.status === 'flagged' && (
                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => handleClear(txn.id)}
                        className="flex-1"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Clear Transaction
                      </Button>
                      <Button
                        variant="danger"
                        size="lg"
                        onClick={() => handleBlock(txn.id)}
                        className="flex-1"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728-12.728A9 9 0 015.636 18.364" />
                        </svg>
                        Block Transaction
                      </Button>
                    </div>
                  )}
                </div>
              );
            })()}
          </Card>
        )}
      </main>
    </div>
  );
};

export default TransactionMonitor;
