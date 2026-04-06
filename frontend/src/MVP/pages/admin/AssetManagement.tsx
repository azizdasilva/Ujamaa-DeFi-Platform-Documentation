/**
 * Admin - Asset Management Page
 *
 * Manage tokenized assets and financings.
 *
 * Route: /admin/assets
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import apiClient from '../../../api/client';

interface Financing {
  id: number;
  pool_family: string;
  asset_class: string;
  industrial: string;
  industrial_id: number | null;
  principal: number;
  interest_rate: number;
  duration_days: number;
  start_date: string;
  maturity_date: string;
  amount_repaid: number;
  is_repaid: boolean;
  status: string;
  description: string | null;
}

const AssetManagement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [financings, setFinancings] = useState<Financing[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [selectedFinancing, setSelectedFinancing] = useState<Financing | null>(null);

  useEffect(() => {
    fetchFinancings();
  }, []);

  const fetchFinancings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/db/financings');
      setFinancings(response.data);
    } catch (error) {
      console.error('Error fetching financings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFinancings = financings.filter(f => {
    if (filter === 'all') return true;
    if (filter === 'active') return f.status === 'ACTIVE' || f.status === 'REPAYING';
    if (filter === 'pending') return f.status === 'PENDING';
    if (filter === 'repaid') return f.status === 'REPAID';
    return true;
  });

  const stats = {
    total: financings.length,
    active: financings.filter(f => f.status === 'ACTIVE' || f.status === 'REPAYING').length,
    pending: financings.filter(f => f.status === 'PENDING').length,
    repaid: financings.filter(f => f.status === 'REPAID').length,
    totalValue: financings.reduce((sum, f) => sum + f.principal, 0),
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'REPAYING':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REPAID':
        return 'info';
      case 'DEFAULTED':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Asset Management</h1>
              <p className="text-[#8b5b3d] mt-1">Manage tokenized assets and financings</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total Assets</p>
            <p className="text-2xl font-bold text-[#103b5b]">{loading ? '-' : stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Active</p>
            <p className="text-2xl font-bold text-green-600">{loading ? '-' : stats.active}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Pending Approval</p>
            <p className="text-2xl font-bold text-amber-600">{loading ? '-' : stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Repaid</p>
            <p className="text-2xl font-bold text-blue-600">{loading ? '-' : stats.repaid}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total Value</p>
            <p className="text-2xl font-bold text-[#00A8A8]">{loading ? '-' : formatCurrency(stats.totalValue)}</p>
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
                All Assets
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('repaid')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'repaid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Repaid
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchFinancings}
              className="text-[#00A8A8] border-[#00A8A8] hover:bg-[#F3F8FA]"
            >
              🔄 Refresh
            </Button>
          </div>
        </Card>

        {/* Assets Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#103b5b]/20">
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Asset Class</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Pool</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Industrial</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Principal</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Interest Rate</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">Loading assets...</td>
                  </tr>
                ) : filteredFinancings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">No assets found</td>
                  </tr>
                ) : (
                  filteredFinancings.map((financing) => (
                    <React.Fragment key={financing.id}>
                      <tr className="border-b border-[#103b5b]/10 hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-xs">#{financing.id}</td>
                        <td className="py-3 px-4">
                          <Badge variant="info" size="sm">{financing.asset_class}</Badge>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#103b5b] capitalize">{financing.pool_family.replace(/_/g, ' ')}</td>
                        <td className="py-3 px-4 text-gray-600">{financing.industrial}</td>
                        <td className="py-3 px-4 font-semibold text-[#103b5b]">{formatCurrency(financing.principal)}</td>
                        <td className="py-3 px-4 font-medium text-[#103b5b]">{financing.interest_rate}%</td>
                        <td className="py-3 px-4">
                          <Badge variant={getStatusBadge(financing.status)} size="sm">
                            {financing.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedFinancing(selectedFinancing?.id === financing.id ? null : financing)}
                            className="text-[#d57028] hover:text-[#c05a1e] text-sm font-medium"
                          >
                            {selectedFinancing?.id === financing.id ? 'Hide' : 'View'} →
                          </button>
                        </td>
                      </tr>
                      {selectedFinancing?.id === financing.id && (
                        <tr className="bg-gray-50 border-t border-gray-200">
                          <td colSpan={7} className="py-4 px-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">Pool Family</p>
                                <p className="font-semibold text-[#103b5b] capitalize">{financing.pool_family.replace(/_/g, ' ')}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Asset Class</p>
                                <p className="font-semibold text-[#103b5b]">{financing.asset_class}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Duration</p>
                                <p className="font-semibold text-[#103b5b]">{financing.duration_days} days</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Start → Maturity</p>
                                <p className="font-semibold text-[#103b5b]">{financing.start_date} → {financing.maturity_date}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Amount Repaid</p>
                                <p className="font-semibold text-[#103b5b]">{formatCurrency(financing.amount_repaid)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Repaid</p>
                                <p className="font-semibold text-[#103b5b]">{financing.is_repaid ? 'Yes' : 'No'}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-xs text-gray-500">Description</p>
                                <p className="text-[#103b5b]">{financing.description || 'No description'}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AssetManagement;
