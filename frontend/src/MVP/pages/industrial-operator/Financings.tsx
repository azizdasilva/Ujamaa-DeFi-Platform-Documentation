/**
 * Industrial Operator - Financings Page
 *
 * View and manage financing requests.
 *
 * Route: /industrial-operator/financings
 */

import React from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const Financings: React.FC = () => {
  const financings = [
    { id: 'FIN-001', asset: 'Cotton Bales #001', amount: 500000, rate: 8.5, startDate: '2026-01-15', maturityDate: '2026-07-15', repaid: 250000, status: 'active' },
    { id: 'FIN-002', asset: 'Solar Equipment #001', amount: 1200000, rate: 7.2, startDate: '2026-02-01', maturityDate: '2027-02-01', repaid: 180000, status: 'active' },
    { id: 'FIN-003', asset: 'Trade Finance Pool #001', amount: 750000, rate: 9.0, startDate: '2025-10-01', maturityDate: '2026-04-01', repaid: 750000, status: 'completed' },
    { id: 'FIN-004', asset: 'Warehouse Receipt #012', amount: 300000, rate: 8.0, startDate: '2026-03-01', maturityDate: '2026-09-01', repaid: 0, status: 'pending' },
  ];

  const stats = {
    total: financings.length,
    active: financings.filter(f => f.status === 'active').length,
    completed: financings.filter(f => f.status === 'completed').length,
    pending: financings.filter(f => f.status === 'pending').length,
    totalRaised: financings.reduce((sum, f) => sum + f.amount, 0),
    totalRepaid: financings.reduce((sum, f) => sum + f.repaid, 0),
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Financing Management</h1>
              <p className="text-[#8b5b3d] mt-1">View and manage your financing requests</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="primary" size="md">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Financing
              </Button>
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total Financings</p>
            <p className="text-2xl font-bold text-[#103b5b]">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Completed</p>
            <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-bold text-[#103b5b] mb-4">Total Raised</h3>
            <p className="text-4xl font-bold text-[#00A8A8]">€{(stats.totalRaised / 1000).toFixed(0)}K</p>
            <p className="text-sm text-gray-500 mt-2">Across all financing rounds</p>
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-[#103b5b] mb-4">Total Repaid</h3>
            <p className="text-4xl font-bold text-green-600">€{(stats.totalRepaid / 1000).toFixed(0)}K</p>
            <p className="text-sm text-gray-500 mt-2">{((stats.totalRepaid / stats.totalRaised) * 100).toFixed(1)}% of total</p>
          </Card>
        </div>

        {/* Financings Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#103b5b]/20">
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Asset</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Rate</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Start Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Maturity</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Repaid</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {financings.map((financing) => (
                  <tr key={financing.id} className="border-b border-[#103b5b]/10 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs">{financing.id}</td>
                    <td className="py-3 px-4 font-semibold text-[#103b5b]">{financing.asset}</td>
                    <td className="py-3 px-4 font-semibold text-[#103b5b]">€{financing.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">{financing.rate}%</td>
                    <td className="py-3 px-4 text-gray-600">{financing.startDate}</td>
                    <td className="py-3 px-4 text-gray-600">{financing.maturityDate}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-[#103b5b]">€{financing.repaid.toLocaleString()}</p>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(financing.repaid / financing.amount) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={financing.status === 'active' ? 'success' : financing.status === 'completed' ? 'info' : 'warning'}
                        size="sm"
                      >
                        {financing.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-[#023D7A] hover:bg-[#0d3352] text-white text-xs font-bold rounded transition-colors">
                          View
                        </button>
                        {financing.status === 'active' && (
                          <button
                            onClick={() => alert('🚀 MVP TESTNET: Make Repayment\n\nIn production, this will open the repayment interface.')}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded transition-colors"
                          >
                            Repay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Financings;
