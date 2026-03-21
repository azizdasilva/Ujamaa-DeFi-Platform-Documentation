/**
 * Pool Marketplace - Enhanced with Advanced Filters
 *
 * Browse and filter all available liquidity pools.
 * Features: Advanced filters, separate Invest/Details modals
 *
 * Route: /institutional/pools
 */

import React, { useState, useMemo } from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import MockDataBadge from '../../components/MockDataBadge';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

interface Pool {
  id: string;
  name: string;
  family: string;
  targetYieldMin: number;
  targetYieldMax: number;
  lockupDays: number;
  totalValue: number;
  apy: number;
  assetClasses: string[];
  riskLevel: 'low' | 'medium' | 'high';
  minInvestment: number;
  maxInvestment: number;
}

const pools: Pool[] = [
  {
    id: 'POOL_INDUSTRY',
    name: 'Pool Industry',
    family: 'INDUSTRY',
    targetYieldMin: 10,
    targetYieldMax: 12,
    lockupDays: 365,
    totalValue: 50_000_000,
    apy: 11,
    assetClasses: ['Manufacturing', 'GDIZ Partners', 'Production Facilities'],
    riskLevel: 'medium',
    minInvestment: 100_000,
    maxInvestment: 5_000_000,
  },
  {
    id: 'POOL_AGRICULTURE',
    name: 'Pool Agriculture',
    family: 'AGRICULTURE',
    targetYieldMin: 12,
    targetYieldMax: 15,
    lockupDays: 180,
    totalValue: 30_000_000,
    apy: 13.5,
    assetClasses: ['Coffee', 'Cocoa', 'Cotton', 'Cashews', 'Food Crops'],
    riskLevel: 'medium',
    minInvestment: 50_000,
    maxInvestment: 3_000_000,
  },
  {
    id: 'POOL_TRADE_FINANCE',
    name: 'Pool Trade Finance',
    family: 'TRADE_FINANCE',
    targetYieldMin: 8,
    targetYieldMax: 10,
    lockupDays: 90,
    totalValue: 25_000_000,
    apy: 9,
    assetClasses: ['Invoice Tokenization', 'Receivables', 'Commercial Paper'],
    riskLevel: 'low',
    minInvestment: 25_000,
    maxInvestment: 2_000_000,
  },
  {
    id: 'POOL_RENEWABLE_ENERGY',
    name: 'Pool Renewable Energy',
    family: 'RENEWABLE_ENERGY',
    targetYieldMin: 9,
    targetYieldMax: 11,
    lockupDays: 730,
    totalValue: 40_000_000,
    apy: 10,
    assetClasses: ['Solar', 'Wind', 'Hydroelectric'],
    riskLevel: 'low',
    minInvestment: 100_000,
    maxInvestment: 4_000_000,
  },
  {
    id: 'POOL_REAL_ESTATE',
    name: 'Pool Real Estate',
    family: 'REAL_ESTATE',
    targetYieldMin: 8,
    targetYieldMax: 12,
    lockupDays: 1095,
    totalValue: 60_000_000,
    apy: 10,
    assetClasses: ['Commercial Office', 'Retail Space', 'Industrial/Warehouse', 'Residential', 'Mixed-Use'],
    riskLevel: 'medium',
    minInvestment: 100_000,
    maxInvestment: 5_000_000,
  },
];

interface FilterState {
  searchQuery: string;
  selectedFamily: string;
  minYield: number;
  maxYield: number;
  maxLockup: number;
  riskLevels: string[];
  sortBy: 'apy' | 'yield' | 'lockup' | 'value';
}

const PoolMarketplace: React.FC = () => {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedFamily: 'all',
    minYield: 8,
    maxYield: 15,
    maxLockup: 1095,
    riskLevels: [],
    sortBy: 'apy',
  });

  const [investmentAmount, setInvestmentAmount] = useState('');

  const filteredPools = useMemo(() => {
    return pools
      .filter((pool) => {
        if (filters.selectedFamily !== 'all' && pool.family !== filters.selectedFamily) {
          return false;
        }
        if (filters.searchQuery && !pool.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
          return false;
        }
        if (pool.apy < filters.minYield || pool.apy > filters.maxYield) {
          return false;
        }
        if (pool.lockupDays > filters.maxLockup) {
          return false;
        }
        if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(pool.riskLevel)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'apy':
            return b.apy - a.apy;
          case 'yield':
            return b.targetYieldMax - a.targetYieldMax;
          case 'lockup':
            return a.lockupDays - b.lockupDays;
          case 'value':
            return b.totalValue - a.totalValue;
          default:
            return 0;
        }
      });
  }, [filters]);

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `€${(value / 1_000_000).toFixed(1)}M`;
    }
    return `€${(value / 1_000).toFixed(0)}K`;
  };

  const formatFullCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-[#00A8A8]/10 text-[#00A8A8]';
      case 'medium':
        return 'bg-[#D57028]/10 text-[#D57028]';
      case 'high':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleRiskLevel = (level: string) => {
    setFilters(prev => ({
      ...prev,
      riskLevels: prev.riskLevels.includes(level)
        ? prev.riskLevels.filter(l => l !== level)
        : [...prev.riskLevels, level],
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      selectedFamily: 'all',
      minYield: 8,
      maxYield: 15,
      maxLockup: 1095,
      riskLevels: [],
      sortBy: 'apy',
    });
  };

  const handleInvestClick = (pool: Pool, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPool(pool);
    setShowInvestModal(true);
  };

  const handleDetailsClick = (pool: Pool, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPool(pool);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F3F8FA]">
      {/* MVP Banner */}
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-[#48A9F0]/30 pt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#023D7A]">Pool Marketplace</h1>
              <p className="text-[#333333] mt-1">
                Browse {filteredPools.length} of {pools.length} Pools • Total Value: €205M
              </p>
            </div>
            <div className="flex items-center gap-3">
              <TestnetNotice variant="badge" />
              <MockDataBadge />
            </div>
          </div>

          {/* Search and Filter Toggle */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search pools by name..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full px-4 py-3 pl-12 border border-[#48A9F0]/30 rounded-xl bg-[#F3F8FA] focus:ring-2 focus:ring-[#00A8A8] focus:border-transparent transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Advanced Filters - Always Visible */}
          <div className="bg-[#F3F8FA] rounded-xl p-6 border border-[#48A9F0]/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Pool Family */}
                <div>
                  <label className="block text-sm font-semibold text-[#023D7A] mb-2">Pool Family</label>
                  <select
                    value={filters.selectedFamily}
                    onChange={(e) => setFilters(prev => ({ ...prev, selectedFamily: e.target.value }))}
                    className="w-full px-4 py-2 border border-[#48A9F0]/30 rounded-lg bg-white focus:ring-2 focus:ring-[#00A8A8]"
                  >
                    <option value="all">All Families</option>
                    {pools.map(pool => (
                      <option key={pool.id} value={pool.family}>{pool.family.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                {/* Yield Range */}
                <div>
                  <label className="block text-sm font-semibold text-[#023D7A] mb-2">
                    APY Range: {filters.minYield}% - {filters.maxYield}%
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="8"
                      max="15"
                      value={filters.minYield}
                      onChange={(e) => setFilters(prev => ({ ...prev, minYield: Number(e.target.value) }))}
                      className="w-full accent-[#00A8A8]"
                    />
                    <input
                      type="range"
                      min="8"
                      max="15"
                      value={filters.maxYield}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxYield: Number(e.target.value) }))}
                      className="w-full accent-[#00A8A8]"
                    />
                  </div>
                </div>

                {/* Lockup Period */}
                <div>
                  <label className="block text-sm font-semibold text-[#023D7A] mb-2">
                    Max Lockup: {filters.maxLockup} days
                  </label>
                  <input
                    type="range"
                    min="90"
                    max="1095"
                    step="30"
                    value={filters.maxLockup}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxLockup: Number(e.target.value) }))}
                    className="w-full accent-[#00A8A8]"
                  />
                </div>

                {/* Risk Level */}
                <div>
                  <label className="block text-sm font-semibold text-[#023D7A] mb-2">Risk Level</label>
                  <div className="space-y-2">
                    {['low', 'medium', 'high'].map(level => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.riskLevels.includes(level)}
                          onChange={() => toggleRiskLevel(level)}
                          className="w-4 h-4 accent-[#00A8A8]"
                        />
                        <span className="text-sm text-[#333333] capitalize">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sort and Clear */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#48A9F0]/30">
                <div>
                  <label className="block text-sm font-semibold text-[#023D7A] mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="px-4 py-2 border border-[#48A9F0]/30 rounded-lg bg-white focus:ring-2 focus:ring-[#00A8A8]"
                  >
                    <option value="apy">Highest APY</option>
                    <option value="yield">Highest Yield</option>
                    <option value="lockup">Shortest Lockup</option>
                    <option value="value">Largest Pool</option>
                  </select>
                </div>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {filteredPools.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[#333333] mb-4">No pools found matching your criteria</p>
              <Button variant="primary" onClick={clearFilters}>Clear Filters</Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPools.map((pool) => (
              <Card
                key={pool.id}
                hover
                className="cursor-pointer"
                onClick={() => { setSelectedPool(pool); setShowDetailsModal(true); }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#023D7A]">{pool.name}</h3>
                    <p className="text-sm text-[#333333] mt-1">{pool.assetClasses.length} Asset Classes</p>
                  </div>
                  <Badge variant={pool.riskLevel === 'low' ? 'success' : 'warning'} size="sm">
                    {pool.riskLevel.toUpperCase()}
                  </Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-[#023D7A]/10 rounded-lg">
                    <p className="text-xs text-[#023D7A] font-medium">Target Yield</p>
                    <p className="text-lg font-bold text-[#023D7A]">
                      {pool.targetYieldMin}-{pool.targetYieldMax}%
                    </p>
                  </div>
                  <div className="p-3 bg-[#00A8A8]/10 rounded-lg">
                    <p className="text-xs text-[#00A8A8] font-medium">Lock-up</p>
                    <p className="text-lg font-bold text-[#00A8A8]">{pool.lockupDays}d</p>
                  </div>
                  <div className="p-3 bg-[#48A9F0]/10 rounded-lg">
                    <p className="text-xs text-[#48A9F0] font-medium">Total Value</p>
                    <p className="text-lg font-bold text-[#48A9F0]">{formatCurrency(pool.totalValue)}</p>
                  </div>
                </div>

                {/* Asset Classes */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-[#023D7A] mb-2">Asset Classes</p>
                  <div className="flex flex-wrap gap-2">
                    {pool.assetClasses.slice(0, 4).map((assetClass) => (
                      <span
                        key={assetClass}
                        className="px-2 py-1 bg-[#F3F8FA] text-[#333333] rounded text-xs border border-[#48A9F0]/30"
                      >
                        {assetClass}
                      </span>
                    ))}
                    {pool.assetClasses.length > 4 && (
                      <span className="px-2 py-1 bg-[#F3F8FA] text-[#333333] rounded text-xs border border-[#48A9F0]/30">
                        +{pool.assetClasses.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* APY and Risk */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#333333]">Current APY:</span>
                    <Badge variant="success" size="md">{pool.apy}%</Badge>
                  </div>
                  <span className={`text-sm font-medium ${getRiskColor(pool.riskLevel)}`}>
                    Risk: {pool.riskLevel.toUpperCase()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-[#48A9F0]/30">
                  <Button 
                    variant="primary" 
                    onClick={(e) => handleInvestClick(pool, e)}
                  >
                    Invest Now
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={(e) => handleDetailsClick(pool, e)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Investment Modal */}
      {selectedPool && showInvestModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowInvestModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#48A9F0]/30">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="primary" size="sm">{selectedPool.family}</Badge>
                  <h2 className="text-2xl font-bold text-[#023D7A] mt-3">Invest in {selectedPool.name}</h2>
                </div>
                <button
                  onClick={() => setShowInvestModal(false)}
                  className="p-2 hover:bg-[#F3F8FA] rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-[#023D7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Investment Amount */}
              <div>
                <label className="block text-sm font-semibold text-[#023D7A] mb-2">
                  Investment Amount (EUR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#023D7A] font-semibold">€</span>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 border border-[#48A9F0]/30 rounded-xl bg-[#F3F8FA] focus:ring-2 focus:ring-[#00A8A8] text-lg font-semibold"
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-[#333333]">
                  <span>Min: {formatFullCurrency(selectedPool.minInvestment)}</span>
                  <span>Max: {formatFullCurrency(selectedPool.maxInvestment)}</span>
                </div>
              </div>

              {/* Quick Amounts */}
              <div className="flex gap-2">
                {[100_000, 250_000, 500_000, 1_000_000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setInvestmentAmount(amount.toString())}
                    className="flex-1 px-3 py-2 bg-[#F3F8FA] hover:bg-[#00A8A8]/10 border border-[#48A9F0]/30 rounded-lg text-sm font-medium text-[#023D7A] transition-colors"
                  >
                    {amount >= 1_000_000 ? '€1M' : `€${amount/1000}K`}
                  </button>
                ))}
              </div>

              {/* Expected Returns */}
              {investmentAmount && (
                <div className="bg-gradient-to-r from-[#00A8A8]/10 to-[#023D7A]/10 rounded-xl p-4 border border-[#00A8A8]/30">
                  <h3 className="text-sm font-semibold text-[#023D7A] mb-3">Expected Returns (1 Year)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#333333]">Conservative ({selectedPool.targetYieldMin}%)</p>
                      <p className="text-lg font-bold text-[#00A8A8]">
                        {formatFullCurrency(Number(investmentAmount) * (1 + selectedPool.targetYieldMin / 100))}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#333333]">Target ({selectedPool.targetYieldMax}%)</p>
                      <p className="text-lg font-bold text-[#023D7A]">
                        {formatFullCurrency(Number(investmentAmount) * (1 + selectedPool.targetYieldMax / 100))}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms */}
              <div className="bg-[#F3F8FA] rounded-xl p-4 border border-[#48A9F0]/30">
                <h3 className="text-sm font-semibold text-[#023D7A] mb-2">Investment Terms</h3>
                <ul className="space-y-1 text-sm text-[#333333]">
                  <li>• Lock-up period: {selectedPool.lockupDays} days</li>
                  <li>• Expected APY: {selectedPool.apy}%</li>
                  <li>• Yield distributed monthly</li>
                  <li>• Early withdrawal penalty: 2%</li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-[#48A9F0]/30 bg-[#F3F8FA] rounded-b-2xl">
              <Button 
                variant="primary" 
                fullWidth 
                size="lg"
                disabled={!investmentAmount || Number(investmentAmount) < selectedPool.minInvestment}
              >
                Confirm Investment
              </Button>
              <p className="text-xs text-[#333333] mt-3 text-center">
                🚀 MVP TESTNET: Investment is simulated for testnet
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pool Details Modal */}
      {selectedPool && showDetailsModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#48A9F0]/30 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="primary" size="sm">{selectedPool.family}</Badge>
                  <h2 className="text-2xl font-bold text-[#023D7A] mt-3">{selectedPool.name}</h2>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-[#F3F8FA] rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-[#023D7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-[#00A8A8]/10 rounded-xl border border-[#00A8A8]/30">
                  <p className="text-xs text-[#00A8A8] font-medium">Target Yield</p>
                  <p className="text-xl font-bold text-[#00A8A8] mt-1">
                    {selectedPool.targetYieldMin}-{selectedPool.targetYieldMax}%
                  </p>
                </div>
                <div className="p-4 bg-[#48A9F0]/10 rounded-xl border border-[#48A9F0]/30">
                  <p className="text-xs text-[#48A9F0] font-medium">Lock-up</p>
                  <p className="text-xl font-bold text-[#48A9F0] mt-1">{selectedPool.lockupDays} days</p>
                </div>
                <div className="p-4 bg-[#023D7A]/10 rounded-xl border border-[#023D7A]/30">
                  <p className="text-xs text-[#023D7A] font-medium">Pool Value</p>
                  <p className="text-xl font-bold text-[#023D7A] mt-1">{formatCurrency(selectedPool.totalValue)}</p>
                </div>
                <div className="p-4 bg-[#D57028]/10 rounded-xl border border-[#D57028]/30">
                  <p className="text-xs text-[#D57028] font-medium">Current APY</p>
                  <p className="text-xl font-bold text-[#D57028] mt-1">{selectedPool.apy}%</p>
                </div>
              </div>

              {/* Asset Classes */}
              <div>
                <h3 className="text-sm font-semibold text-[#023D7A] mb-3">Asset Classes</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPool.assetClasses.map((assetClass) => (
                    <span
                      key={assetClass}
                      className="px-3 py-2 bg-[#F3F8FA] text-[#333333] rounded-lg text-sm border border-[#48A9F0]/30"
                    >
                      {assetClass}
                    </span>
                  ))}
                </div>
              </div>

              {/* Investment Limits */}
              <div>
                <h3 className="text-sm font-semibold text-[#023D7A] mb-3">Investment Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#F3F8FA] rounded-lg border border-[#48A9F0]/30">
                    <p className="text-xs text-[#333333]">Minimum</p>
                    <p className="text-lg font-bold text-[#023D7A]">{formatFullCurrency(selectedPool.minInvestment)}</p>
                  </div>
                  <div className="p-3 bg-[#F3F8FA] rounded-lg border border-[#48A9F0]/30">
                    <p className="text-xs text-[#333333]">Maximum</p>
                    <p className="text-lg font-bold text-[#023D7A]">{formatFullCurrency(selectedPool.maxInvestment)}</p>
                  </div>
                  <div className="p-3 bg-[#F3F8FA] rounded-lg border border-[#48A9F0]/30">
                    <p className="text-xs text-[#333333]">Daily Withdrawal</p>
                    <p className="text-lg font-bold text-[#023D7A]">€500,000</p>
                  </div>
                </div>
              </div>

              {/* Diversification */}
              <div>
                <h3 className="text-sm font-semibold text-[#023D7A] mb-3">Diversification Rules</h3>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-[#F3F8FA] rounded-lg border border-[#48A9F0]/30">
                    <span className="text-sm text-[#333333]">Per Industrial Limit</span>
                    <span className="text-sm font-semibold text-[#023D7A]">20%</span>
                  </div>
                  <div className="flex justify-between p-3 bg-[#F3F8FA] rounded-lg border border-[#48A9F0]/30">
                    <span className="text-sm text-[#333333]">Per Asset Class Limit</span>
                    <span className="text-sm font-semibold text-[#023D7A]">40%</span>
                  </div>
                </div>
              </div>

              {/* Risk Disclosure */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <h3 className="text-sm font-semibold text-amber-800 mb-2">⚠️ Risk Disclosure</h3>
                <p className="text-sm text-amber-700">
                  Investments in digital assets carry risks. Past performance does not guarantee future results. 
                  You may lose some or all of your invested capital. This is a testnet deployment - no real funds are handled.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-[#48A9F0]/30 bg-[#F3F8FA] rounded-b-2xl sticky bottom-0">
              <div className="flex gap-3">
                <Button 
                  variant="primary" 
                  onClick={() => { setShowDetailsModal(false); setShowInvestModal(true); }}
                  fullWidth
                >
                  Invest Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-[#48A9F0]/30 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-[#333333]">
            🚀 MVP: Institutional Architecture - Testnet Release • 5 Pool Families • €205M Total Value
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PoolMarketplace;
