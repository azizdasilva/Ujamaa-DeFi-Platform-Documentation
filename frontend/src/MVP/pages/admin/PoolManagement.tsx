/**
 * Admin - Pool Management Page
 *
 * Manage liquidity pools, configurations, and settings.
 *
 * Route: /admin/pools
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { poolsAPI, Pool } from '../../../api/pools';

const PoolManagement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pools, setPools] = useState<Pool[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching pools from API...');
      const poolData = await poolsAPI.getAllPools();
      console.log('✅ Pools loaded:', poolData);
      setPools(poolData);
    } catch (err: any) {
      console.error('❌ Error fetching pools:', err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to load pools. Please check your connection.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const poolList = pools;

  const stats = {
    total: poolList.length,
    active: poolList.filter(p => p.is_active !== false).length, // Default to true if not provided
    totalValue: poolList.reduce((sum, p) => sum + p.total_value, 0),
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
              <h1 className="text-3xl font-bold text-[#103b5b]">Pool Management</h1>
              <p className="text-[#8b5b3d] mt-1">Manage liquidity pools and configurations</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => alert('Create Pool — Coming soon. Use the database directly or the Pool Configure page for existing pools.')}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Pool
              </Button>
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-500">
            <div className="flex items-center justify-between">
              <p className="text-red-600 font-semibold">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchPools} className="text-red-600 border-red-600">
                Retry
              </Button>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total Pools</p>
            <p className="text-2xl font-bold text-[#103b5b]">{loading ? '-' : stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Active Pools</p>
            <p className="text-2xl font-bold text-green-600">{loading ? '-' : stats.active}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total Value Locked</p>
            <p className="text-2xl font-bold text-[#00A8A8]">{loading ? '-' : formatCurrency(stats.totalValue)}</p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-[#00A8A8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#103b5b] font-semibold">Loading pools...</p>
          </div>
        )}

        {/* Pools Grid */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {poolList.length === 0 ? (
              <Card className="col-span-2">
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No pools found</p>
                </div>
              </Card>
            ) : (
              poolList.map((pool) => (
                <Card key={pool.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#103b5b]">{pool.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{pool.name.replace('Pool ', '')}</p>
                    </div>
                    <Badge variant={pool.is_active !== false ? 'success' : 'error'} size="md">
                      {pool.is_active !== false ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">APY</p>
                      <p className="text-lg font-bold text-[#00A8A8]">{pool.apy.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Value</p>
                      <p className="text-lg font-bold text-[#103b5b]">{formatCurrency(pool.total_value)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Min Investment</p>
                      <p className="text-sm font-semibold text-gray-700">{formatCurrency(pool.target_yield_min)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Lockup Period</p>
                      <p className="text-sm font-semibold text-gray-700">{pool.lockup_days} days</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button
                      variant="primary"
                      size="md"
                      className="flex-1"
                      onClick={() => navigate(`/admin/pools/${pool.id}/configure`)}
                    >
                      Configure
                    </Button>
                    <Button
                      variant="secondary"
                      size="md"
                      className="flex-1"
                      onClick={() => setSelectedPool(selectedPool?.id === pool.id ? null : pool)}
                    >
                      {selectedPool?.id === pool.id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>

                  {/* Expanded Details */}
                  {selectedPool?.id === pool.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-[#103b5b] mb-3">Pool Details</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Pool ID</p>
                          <p className="font-mono text-gray-700">{pool.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Family</p>
                          <p className="text-gray-700 capitalize">{pool.name.replace('Pool ', '')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Target Yield Range</p>
                          <p className="text-gray-700">{pool.target_yield_min}% - {pool.target_yield_max}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <p className="text-gray-700">{pool.is_active !== false ? 'Active' : 'Inactive'}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => navigate(`/admin/pools/${pool.id}/configure`)}
                      >
                        Go to Configuration
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PoolManagement;
