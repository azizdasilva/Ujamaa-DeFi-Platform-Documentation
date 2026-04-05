/**
 * Industrial Operator - Financings Page
 *
 * View and manage financing requests. Connected to real backend API.
 *
 * Route: /industrial-operator/financings
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import apiClient from '../../../api/client';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

interface Financing {
  id: number;
  pool_family: string;
  asset_class: string;
  industrial: string;
  principal: number;
  interest_rate: number;
  start_date: string;
  maturity_date: string;
  amount_repaid: number;
  is_repaid: boolean;
  is_defaulted: boolean;
  status: string;
  transaction_id?: string;
  explorer_url?: string;
}

const Financings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [financings, setFinancings] = useState<Financing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFinancing, setSelectedFinancing] = useState<Financing | null>(null);
  const [repayAmount, setRepayAmount] = useState('');
  const [repaying, setRepaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = {
    total: financings.length,
    active: financings.filter(f => !f.is_repaid && !f.is_defaulted).length,
    completed: financings.filter(f => f.is_repaid).length,
    pending: financings.filter(f => f.status === 'PENDING').length,
    totalRaised: financings.reduce((sum, f) => sum + (f.principal || 0), 0),
    totalRepaid: financings.reduce((sum, f) => sum + (f.amount_repaid || 0), 0),
  };

  // Load financings from backend
  useEffect(() => {
    const loadFinancings = async () => {
      try {
        setLoading(true);
        // Load from all pools
        const pools = ['POOL_INDUSTRIE', 'POOL_AGRICULTURE', 'POOL_TRADE_FINANCE', 'POOL_RENEWABLE_ENERGY', 'POOL_REAL_ESTATE'];
        const results = await Promise.all(
          pools.map(async (poolId) => {
            try {
              const res = await apiClient.get(`/pools/${poolId}/financings`);
              return res.data || [];
            } catch {
              return [];
            }
          })
        );
        
        const allFinancings = results.flat();
        setFinancings(allFinancings);
      } catch (err) {
        console.error('Failed to load financings:', err);
        setError('Failed to load financings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadFinancings();
  }, []);

  const handleRepay = async (financing: Financing) => {
    if (!repayAmount || parseFloat(repayAmount) <= 0) {
      setError('Enter a valid repayment amount');
      return;
    }

    setRepaying(true);
    setError(null);

    try {
      const poolId = `POOL_${financing.pool_family.toUpperCase()}`;
      const res = await apiClient.post(`/pools/${poolId}/repayments`, null, {
        params: {
          financing_id: financing.id,
          amount: parseFloat(repayAmount),
        },
      });

      if (res.data.success) {
        // Refresh list
        const pools = ['POOL_INDUSTRIE', 'POOL_AGRICULTURE', 'POOL_TRADE_FINANCE', 'POOL_RENEWABLE_ENERGY', 'POOL_REAL_ESTATE'];
        const results = await Promise.all(
          pools.map(async (poolId) => {
            try {
              const res = await apiClient.get(`/pools/${poolId}/financings`);
              return res.data || [];
            } catch { return []; }
          })
        );
        setFinancings(results.flat());
        setRepayAmount('');
        setSelectedFinancing(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Repayment failed');
    } finally {
      setRepaying(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
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
              <Button variant="primary" size="md" onClick={() => navigate('/industrial-operator/asset-submission')}>
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
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total Financings</p>
            <p className="text-2xl font-bold text-[#103b5b]">{loading ? '...' : stats.total}</p>
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
            <p className="text-4xl font-bold text-[#00A8A8]">{formatCurrency(stats.totalRaised)}</p>
            <p className="text-sm text-gray-500 mt-2">Across all financing rounds</p>
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-[#103b5b] mb-4">Total Repaid</h3>
            <p className="text-4xl font-bold text-green-600">{formatCurrency(stats.totalRepaid)}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.totalRaised > 0 ? ((stats.totalRepaid / stats.totalRaised) * 100).toFixed(1) : 0}% of total
            </p>
          </Card>
        </div>

        {/* Financings Table */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#103b5b] mx-auto mb-4"></div>
              <p className="text-gray-500">Loading financings...</p>
            </div>
          ) : financings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No financings yet</p>
              <Button variant="primary" onClick={() => navigate('/industrial-operator/asset-submission')}>
                Submit Your First Asset
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#103b5b]/20">
                    <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Asset Class</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Rate</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Repaid</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {financings.map((financing) => (
                    <tr key={financing.id} className="border-b border-[#103b5b]/10 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-xs">#{financing.id}</td>
                      <td className="py-3 px-4 font-semibold text-[#103b5b]">{financing.asset_class}</td>
                      <td className="py-3 px-4 font-semibold text-[#103b5b]">{formatCurrency(financing.principal)}</td>
                      <td className="py-3 px-4">{financing.interest_rate / 100}%</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-[#103b5b]">{formatCurrency(financing.amount_repaid)}</p>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${financing.principal > 0 ? (financing.amount_repaid / financing.principal) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={financing.is_repaid ? 'info' : financing.is_defaulted ? 'error' : financing.status === 'PENDING' ? 'warning' : 'success'}
                          size="sm"
                        >
                          {financing.is_repaid ? 'REPaid' : financing.is_defaulted ? 'DEFAULTED' : financing.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button onClick={() => setSelectedFinancing(selectedFinancing?.id === financing.id ? null : financing)}
                                  className="px-3 py-1 bg-[#023D7A] hover:bg-[#0d3352] text-white text-xs font-bold rounded transition-colors">
                            View
                          </button>
                          {!financing.is_repaid && !financing.is_defaulted && financing.status !== 'PENDING' && (
                            <button onClick={() => setSelectedFinancing(financing)}
                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded transition-colors">
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
          )}
        </Card>

        {/* Detail Panel */}
        {selectedFinancing && (
          <Card className="mt-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-[#103b5b]">Financing Details: #{selectedFinancing.id}</h3>
              <button onClick={() => { setSelectedFinancing(null); setRepayAmount(''); }} 
                      className="text-gray-500 hover:text-gray-700 text-lg font-bold">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-[#103b5b] mb-3">Loan Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Asset Class</span><span className="text-[#103b5b] font-semibold">{selectedFinancing.asset_class}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-semibold">{formatCurrency(selectedFinancing.principal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Rate</span><span>{selectedFinancing.interest_rate / 100}%</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Status</span><Badge variant={selectedFinancing.is_repaid ? 'info' : 'success'} size="sm">{selectedFinancing.is_repaid ? 'REPaid' : 'ACTIVE'}</Badge></div>
                  {selectedFinancing.transaction_id && (
                    <div className="flex justify-between"><span className="text-gray-500">TX Hash</span><code className="text-xs bg-gray-100 px-1 rounded">{selectedFinancing.transaction_id.slice(0, 10)}...</code></div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-[#103b5b] mb-3">Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Start Date</span><span>{selectedFinancing.start_date ? new Date(selectedFinancing.start_date).toLocaleDateString() : 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Maturity</span><span>{selectedFinancing.maturity_date ? new Date(selectedFinancing.maturity_date).toLocaleDateString() : 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Repaid</span><span className="font-semibold">{formatCurrency(selectedFinancing.amount_repaid)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Remaining</span><span className="font-semibold">{formatCurrency(selectedFinancing.principal - selectedFinancing.amount_repaid)}</span></div>
                  <div className="mt-2">
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${selectedFinancing.principal > 0 ? (selectedFinancing.amount_repaid / selectedFinancing.principal) * 100 : 0}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{selectedFinancing.principal > 0 ? ((selectedFinancing.amount_repaid / selectedFinancing.principal) * 100).toFixed(1) : 0}% repaid</p>
                  </div>
                </div>

                {/* Repayment Form */}
                {!selectedFinancing.is_repaid && !selectedFinancing.is_defaulted && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-[#103b5b] mb-3">Make Repayment</h4>
                    <div className="flex gap-3">
                      <input type="number" value={repayAmount} onChange={(e) => setRepayAmount(e.target.value)}
                             className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                             placeholder="Amount (EUR)" min="0" />
                      <button onClick={() => handleRepay(selectedFinancing)} disabled={repaying}
                              className={`px-6 py-2 rounded-lg font-medium text-white ${
                                repaying ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                              }`}>
                        {repaying ? 'Processing...' : 'Repay'}
                      </button>
                    </div>
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

export default Financings;
