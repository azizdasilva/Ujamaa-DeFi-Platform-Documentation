/**
 * Admin - Pool Management Page
 *
 * Manage liquidity pools, configurations, and settings.
 *
 * Route: /admin/pools
 */

import React, { useState } from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { POOLS } from '../../../data/mockData';

const PoolManagement: React.FC = () => {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);

  const poolList = Object.values(POOLS);

  const stats = {
    total: poolList.length,
    active: poolList.filter(p => p.isActive).length,
    totalValue: poolList.reduce((sum, p) => sum + p.totalValue, 0),
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
              <Button variant="primary" size="md">
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total Pools</p>
            <p className="text-2xl font-bold text-[#103b5b]">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Active Pools</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total Value Locked</p>
            <p className="text-2xl font-bold text-[#00A8A8]">€{(stats.totalValue / 1000000).toFixed(2)}M</p>
          </div>
        </div>

        {/* Pools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {poolList.map((pool) => (
            <Card key={pool.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#103b5b]">{pool.name}</h3>
                  <p className="text-sm text-gray-600">{pool.family.replace('POOL_', '')}</p>
                </div>
                <Badge variant={pool.isActive ? 'success' : 'error'} size="md">
                  {pool.isActive ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">APY</p>
                  <p className="text-lg font-bold text-[#00A8A8]">{pool.apy.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Value</p>
                  <p className="text-lg font-bold text-[#103b5b]">€{(pool.totalValue / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Min Investment</p>
                  <p className="text-sm font-semibold text-gray-700">€{pool.targetYieldMin.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lockup Period</p>
                  <p className="text-sm font-semibold text-gray-700">{pool.lockupDays} days</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Asset Classes</p>
                <div className="flex flex-wrap gap-2">
                  {pool.assetClasses.map((asset, idx) => (
                    <Badge key={idx} variant="info" size="sm">{asset}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button variant="primary" size="md" className="flex-1">
                  Configure
                </Button>
                <Button variant="secondary" size="md" className="flex-1">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PoolManagement;
