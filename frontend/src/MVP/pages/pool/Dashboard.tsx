/**
 * Pool Dashboard - KPI Overview
 *
 * Displays all 18 KPIs across 5 categories for EACH pool family:
 * - Pool Industry (industrie)
 * - Pool Agriculture
 * - Pool Trade Finance
 * - Pool Renewable Energy
 * - Pool Real Estate
 *
 * Route: /pool/dashboard
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import StatsCard from '../../components/StatsCard';
import Badge from '../../components/Badge';
import { poolsAPI } from '../../../api';
import { POOLS as MOCK_POOLS, getPoolKPIs as getMockPoolKPIs } from '../../../data/mockData';

const PoolDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'detail' | 'compare'>('detail');
  const [timePeriod, setTimePeriod] = useState<'24h' | '7d' | '30d' | '90d' | '1y'>('30d');
  const [poolsData, setPoolsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useMockData] = useState(process.env.REACT_APP_USE_MOCK_DATA === 'true');

  // Get pool from URL params, default to 'all'
  const urlPool = searchParams.get('pool') || 'all';
  const [selectedPool, setSelectedPool] = useState<'all' | 'industrie' | 'agriculture' | 'trade' | 'renewable' | 'realestate'>(
    urlPool as any
  );

  // Update URL when pool changes
  useEffect(() => {
    setSearchParams({ pool: selectedPool });
  }, [selectedPool, setSearchParams]);

  // Fetch pools data from API or use mock
  useEffect(() => {
    const fetchPools = async () => {
      setLoading(true);
      try {
        if (useMockData) {
          // Use mock data for demo
          setPoolsData(Object.values(MOCK_POOLS));
        } else {
          // Fetch from backend API
          const pools = await poolsAPI.getAllPools();
          setPoolsData(pools);
        }
      } catch (error) {
        console.error('Failed to fetch pools:', error);
        // Fallback to mock data
        setPoolsData(Object.values(MOCK_POOLS));
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, [useMockData]);

  // Pool configurations
  const pools = [
    { id: 'all', name: 'All Pools', icon: '🏛️', color: 'from-gray-600 to-gray-800' },
    { id: 'industrie', name: 'Pool Industry', icon: '🏭', color: 'from-blue-600 to-blue-800', targetApy: '10-12%', lockup: '365 days' },
    { id: 'agriculture', name: 'Pool Agriculture', icon: '🌱', color: 'from-green-600 to-green-800', targetApy: '12-15%', lockup: '180 days' },
    { id: 'trade', name: 'Pool Trade Finance', icon: '📦', color: 'from-purple-600 to-purple-800', targetApy: '8-10%', lockup: '90 days' },
    { id: 'renewable', name: 'Pool Renewable Energy', icon: '⚡', color: 'from-cyan-600 to-cyan-800', targetApy: '9-11%', lockup: '730 days' },
    { id: 'realestate', name: 'Pool Real Estate', icon: '🏢', color: 'from-amber-600 to-amber-800', targetApy: '8-12%', lockup: '1095 days' },
  ];

  // Get KPI data - use mock for now (backend KPI endpoint not yet available)
  const getPoolKpis = (poolId: string) => getMockPoolKPIs(poolId);

  // Trend data (mock - would come from API)
  const trends = {
    all: { apy: 2.3, tvl: 5.2, utilization: -1.2 },
    industrie: { apy: 3.1, tvl: 8.5, utilization: 2.1 },
    agriculture: { apy: 5.2, tvl: 3.8, utilization: -0.5 },
    trade: { apy: 1.8, tvl: 12.3, utilization: 4.2 },
    renewable: { apy: 2.9, tvl: -2.1, utilization: -3.5 },
    realestate: { apy: 1.2, tvl: 6.7, utilization: 1.8 },
  };

  const kpis = getPoolKpis(selectedPool);
  const currentPool = pools.find(p => p.id === selectedPool);
  const currentTrend = trends[selectedPool] || trends.all; // Fallback to 'all' if undefined

  // Trend indicator component
  const TrendIndicator = ({ value, suffix = '' }: { value: number; suffix?: string }) => (
    <div className={`flex items-center text-sm font-medium ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      <svg className={`w-4 h-4 mr-1 ${value < 0 ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
      {Math.abs(value)}{suffix}
    </div>
  );

  // Pool Health Score calculation
  const getPoolHealth = () => {
    if (!kpis?.risk) return { score: 50, grade: 'Fair', color: 'amber' };
    const riskScore =
      (kpis.risk.defaultRate > 2 ? 40 : kpis.risk.defaultRate * 20) +
      (kpis.risk.concentrationRisk > 15 ? 30 : kpis.risk.concentrationRisk * 2);

    if (riskScore <= 20) return { score: 90, grade: 'Excellent', color: 'green' };
    if (riskScore <= 40) return { score: 75, grade: 'Good', color: 'blue' };
    if (riskScore <= 60) return { score: 50, grade: 'Fair', color: 'amber' };
    return { score: 25, grade: 'Poor', color: 'red' };
  };

  const poolHealth = getPoolHealth();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  };

  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  const getStatusColor = (value: number, warning: number, critical: number, inverted = false) => {
    if (inverted) {
      if (value <= warning) return 'text-green-600';
      if (value <= critical) return 'text-amber-600';
      return 'text-red-600';
    } else {
      if (value >= warning) return 'text-green-600';
      if (value >= critical) return 'text-amber-600';
      return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Pool Dashboard</h1>
              <p className="text-white/80 mt-1">Real-time KPI monitoring & performance analytics</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Time Period Selector */}
              <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                {(['24h', '7d', '30d', '90d', '1y'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(period)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      timePeriod === period
                        ? 'bg-white text-[#023D7A]'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('detail')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'detail'
                      ? 'bg-white text-[#023D7A]'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  📊 Detail
                </button>
                <button
                  onClick={() => setViewMode('compare')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'compare'
                      ? 'bg-white text-[#023D7A]'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  📈 Compare
                </button>
              </div>
              <button
                onClick={() => window.print()}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Export Report"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <TestnetNotice variant="badge" />
            </div>
          </div>

          {/* Pool Selector Pills */}
          {viewMode === 'detail' && (
            <div className="flex items-center gap-2 overflow-x-auto mb-6 pb-2 border-t border-white/20 pt-4">
              {pools.map((pool) => (
                <button
                  key={pool.id}
                  onClick={() => setSelectedPool(pool.id as any)}
                  className={`
                    flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all shadow-sm
                    ${selectedPool === pool.id
                      ? `bg-gradient-to-r ${pool.color} text-white shadow-lg scale-105`
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/30'
                    }
                  `}
                >
                  <span className="text-xl">{pool.icon}</span>
                  <span>{pool.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Hero Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Net APY</span>
                <span className="text-2xl">📈</span>
              </div>
              <div className="text-3xl font-bold">{kpis.financial.netApy}%</div>
              <div className="mt-2">
                <TrendIndicator value={currentTrend.apy} suffix="%" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Total Value Locked</span>
                <span className="text-2xl">💰</span>
              </div>
              <div className="text-3xl font-bold">€{(kpis.liquidity.tvl / 1_000_000).toFixed(1)}M</div>
              <div className="mt-2">
                <TrendIndicator value={currentTrend.tvl} suffix="%" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Utilization Rate</span>
                <span className="text-2xl">⚡</span>
              </div>
              <div className="text-3xl font-bold">{kpis.liquidity.utilizationRate}%</div>
              <div className="mt-2">
                <TrendIndicator value={currentTrend.utilization} suffix="%" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Pool Health</span>
                <span className="text-2xl">💚</span>
              </div>
              <div className="text-3xl font-bold">{getPoolHealth().score}/100</div>
              <div className="mt-2">
                <Badge variant={getPoolHealth().grade === 'Excellent' || getPoolHealth().grade === 'Good' ? 'success' : 'warning'} size="sm">
                  {getPoolHealth().grade}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Comparison View */}
      {viewMode === 'compare' && (
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* APY Comparison Bar Chart */}
          <Card header={<h2 className="text-xl font-bold text-[#103b5b] mb-4">📊 Net APY Comparison</h2>} className="mb-8">
            <div className="space-y-4">
              {pools.filter(p => p.id !== 'all').map((pool) => {
                const kpi = getPoolKpis(pool.id);
                const apy = kpi.financial.netApy;
                const maxWidth = 15; // Max APY for scaling
                const widthPercent = (apy / maxWidth) * 100;
                const isBest = apy === Math.max(...pools.filter(p => p.id !== 'all').map(p => getPoolKpis(p.id).financial.netApy));
                
                return (
                  <div key={pool.id} className="flex items-center gap-4">
                    <div className="w-48 text-sm font-medium text-gray-700">{pool.icon} {pool.name}</div>
                    <div className="flex-1">
                      <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                        <div
                          className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                            isBest ? 'bg-gradient-to-r from-green-400 to-green-600' : `bg-gradient-to-r ${pool.color}`
                          }`}
                          style={{ width: `${widthPercent}%` }}
                        >
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white font-bold text-sm">
                            {apy}%
                          </div>
                        </div>
                      </div>
                    </div>
                    {isBest && <Badge variant="success" size="sm">🏆 Best</Badge>}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* TVL Comparison */}
          <Card header={<h2 className="text-xl font-bold text-[#103b5b] mb-4">💰 Total Value Locked (TVL)</h2>} className="mb-8">
            <div className="space-y-4">
              {pools.filter(p => p.id !== 'all').map((pool) => {
                const kpi = getPoolKpis(pool.id);
                const tvl = kpi.liquidity.tvl / 1_000_000; // In millions
                const maxTvl = 20; // Max TVL for scaling
                const widthPercent = (tvl / maxTvl) * 100;
                const isBest = tvl === Math.max(...pools.filter(p => p.id !== 'all').map(p => getPoolKpis(p.id).liquidity.tvl / 1_000_000));
                
                return (
                  <div key={pool.id} className="flex items-center gap-4">
                    <div className="w-48 text-sm font-medium text-gray-700">{pool.icon} {pool.name}</div>
                    <div className="flex-1">
                      <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                        <div
                          className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                            isBest ? 'bg-gradient-to-r from-blue-400 to-blue-600' : `bg-gradient-to-r ${pool.color}`
                          }`}
                          style={{ width: `${widthPercent}%` }}
                        >
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white font-bold text-sm">
                            €{tvl}M
                          </div>
                        </div>
                      </div>
                    </div>
                    {isBest && <Badge variant="success" size="sm">🏆 Largest</Badge>}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Risk-Return Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Utilization Rate */}
            <Card header={<h2 className="text-xl font-bold text-[#103b5b] mb-4">⚡ Utilization Rate</h2>}>
              <div className="space-y-4">
                {pools.filter(p => p.id !== 'all').map((pool) => {
                  const kpi = getPoolKpis(pool.id);
                  const util = kpi.liquidity.utilizationRate;
                  const isOptimal = util >= 85 && util <= 92;
                  
                  return (
                    <div key={pool.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{pool.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{pool.name}</p>
                          <p className="text-xs text-gray-500">Target: 85-92%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${isOptimal ? 'text-green-600' : 'text-amber-600'}`}>
                          {util}%
                        </p>
                        {isOptimal && <Badge variant="success" size="sm">Optimal</Badge>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Risk Metrics */}
            <Card header={<h2 className="text-xl font-bold text-[#103b5b] mb-4">🛡️ Risk Comparison</h2>}>
              <div className="space-y-4">
                {pools.filter(p => p.id !== 'all').map((pool) => {
                  const kpi = getPoolKpis(pool.id);
                  const defaultRate = kpi.risk.defaultRate;
                  const concentration = kpi.risk.concentrationRisk;
                  const isLowRisk = defaultRate < 1.0 && concentration < 15;
                  
                  return (
                    <div key={pool.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{pool.icon} {pool.name}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>Default: <span className={defaultRate < 1 ? 'text-green-600' : 'text-amber-600'}>{defaultRate}%</span></span>
                          <span>Concentration: <span className={concentration < 15 ? 'text-green-600' : 'text-amber-600'}>{concentration}%</span></span>
                        </div>
                      </div>
                      <Badge variant={isLowRisk ? 'success' : 'warning'} size="sm">
                        {isLowRisk ? 'Low Risk' : 'Medium Risk'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Performance Summary Table */}
          <Card header={<h2 className="text-xl font-bold text-[#103b5b] mb-4">📋 Complete Performance Summary</h2>}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#103b5b]/20">
                    <th className="text-left py-3 px-4 font-bold text-[#103b5b]">Pool</th>
                    <th className="text-left py-3 px-4 font-bold text-[#103b5b]">Net APY</th>
                    <th className="text-left py-3 px-4 font-bold text-[#103b5b]">TVL</th>
                    <th className="text-left py-3 px-4 font-bold text-[#103b5b]">Utilization</th>
                    <th className="text-left py-3 px-4 font-bold text-[#103b5b]">Default Rate</th>
                    <th className="text-left py-3 px-4 font-bold text-[#103b5b]">Credit Rating</th>
                    <th className="text-left py-3 px-4 font-bold text-[#103b5b]">Jobs/€1M</th>
                  </tr>
                </thead>
                <tbody>
                  {pools.filter(p => p.id !== 'all').map((pool) => {
                    const kpi = getPoolKpis(pool.id);
                    return (
                      <tr key={pool.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{pool.icon} {pool.name}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-green-600">{kpi.financial.netApy}%</span>
                        </td>
                        <td className="py-3 px-4">{formatCurrency(kpi.liquidity.tvl)}</td>
                        <td className="py-3 px-4">{kpi.liquidity.utilizationRate}%</td>
                        <td className="py-3 px-4">
                          <span className={kpi.risk.defaultRate < 1 ? 'text-green-600' : 'text-amber-600'}>
                            {kpi.risk.defaultRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="info" size="sm">{kpi.risk.creditRating}</Badge>
                        </td>
                        <td className="py-3 px-4">{kpi.impact.jobsPerMillion}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      )}

      {/* Detail View */}
      {viewMode === 'detail' && (
        <>
          <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Pool Allocation Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-2" header={
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#103b5b]">📊 Pool Allocation</h2>
                <Badge variant="info" size="sm">Total: €50M</Badge>
              </div>
            }>
              <div className="h-[400px]" style={{ minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={pools.filter(p => p.id !== 'all').map((pool) => {
                        const kpi = getPoolKpis(pool.id);
                        return {
                          name: pool.name,
                          value: kpi.liquidity.tvl,
                          icon: pool.icon,
                        };
                      })}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pools.filter(p => p.id !== 'all').map((pool, index) => {
                        const colors = ['#023D7A', '#00A8A8', '#10b981', '#8b5cf6', '#f59e0b'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `€${(value / 1_000_000).toFixed(2)}M`}
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => <span className="text-sm font-medium text-gray-700">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Allocation Details */}
              <div className="mt-6 grid grid-cols-5 gap-4">
                {pools.filter(p => p.id !== 'all').map((pool) => {
                  const kpi = getPoolKpis(pool.id);
                  const tvl = kpi.liquidity.tvl;
                  const totalTvl = 50_000_000;
                  const percentage = (tvl / totalTvl) * 100;
                  const colors = ['from-[#023D7A] to-[#023D7A]', 'from-[#00A8A8] to-[#00A8A8]', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-amber-500 to-amber-600'];
                  const colorIndex = pools.filter(p => p.id !== 'all').findIndex(p => p.id === pool.id);

                  return (
                    <div key={pool.id} className="text-center">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors[colorIndex]} mx-auto mb-2`} />
                      <p className="text-xs font-medium text-gray-600 truncate">{pool.icon} {pool.name.split(' ')[1]}</p>
                      <p className="text-sm font-bold text-gray-900">{percentage.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500">€{(tvl/1_000_000).toFixed(1)}M</p>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card header={<h2 className="text-xl font-bold text-[#103b5b]">⚡ Quick Stats</h2>}>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="text-sm text-green-700 mb-1">Best Performer</div>
                  <div className="text-2xl font-bold text-green-900">🌱 Agriculture</div>
                  <div className="text-sm text-green-700 mt-1">13.2% Net APY</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="text-sm text-blue-700 mb-1">Safest Pool</div>
                  <div className="text-2xl font-bold text-blue-900">🏭 Industrie</div>
                  <div className="text-sm text-blue-700 mt-1">0.8% Default Rate</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="text-sm text-purple-700 mb-1">Most Efficient</div>
                  <div className="text-2xl font-bold text-purple-900">📦 Trade Finance</div>
                  <div className="text-sm text-purple-700 mt-1">95% Utilization</div>
                </div>
              </div>
            </Card>
          </div>
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#103b5b]">Pool Health Score</h2>
            <span className={`text-2xl font-bold ${
              poolHealth.color === 'green' ? 'text-green-600' :
              poolHealth.color === 'blue' ? 'text-blue-600' :
              poolHealth.color === 'amber' ? 'text-amber-600' : 'text-red-600'
            }`}>
              {poolHealth.score}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className={`h-4 rounded-full transition-all ${
                poolHealth.color === 'green' ? 'bg-green-500' :
                poolHealth.color === 'blue' ? 'bg-blue-500' :
                poolHealth.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${poolHealth.score}%` }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Default Rate</p>
              <p className={`font-semibold ${getStatusColor(kpis.risk.defaultRate, 2, 5)}`}>
                {formatPercentage(kpis.risk.defaultRate)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Concentration</p>
              <p className={`font-semibold ${getStatusColor(kpis.risk.concentrationRisk, 15, 25)}`}>
                {formatPercentage(kpis.risk.concentrationRisk)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Collateralization</p>
              <p className={`font-semibold ${getStatusColor(kpis.risk.collateralizationRatio, 125, 100)}`}>
                {formatPercentage(kpis.risk.collateralizationRatio)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Credit Rating</p>
              <p className="font-semibold text-[#103b5b]">{kpis.risk.creditRating}</p>
            </div>
          </div>
        </Card>

        {/* Financial KPIs */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#103b5b] mb-4">Financial Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
              label="Net APY"
              value={formatPercentage(kpis.financial.netApy)}
              color="success"
              subValue="Target: 8-12%"
            />
            <StatsCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="NAV per Share"
              value={kpis.financial.navPerShare.toFixed(4)}
              color="info"
              subValue="Initial: 1.0000"
            />
            <StatsCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              label="Yield Variance"
              value={formatPercentage(kpis.financial.yieldVariance)}
              color="secondary"
              subValue="Target: <±0.5%"
            />
            <StatsCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM3.982 10.5h16.036M3.982 13.5h16.036" />
                </svg>
              }
              label="Expense Ratio"
              value={formatPercentage(kpis.financial.expenseRatio)}
              color="warning"
              subValue="Target: <2.5%"
            />
          </div>
        </section>

        {/* Liquidity KPIs */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#103b5b] mb-4">Liquidity Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="TVL"
              value={formatCurrency(kpis.liquidity.tvl)}
              color="success"
              subValue="Total Value Locked"
            />
            <StatsCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              label="Utilization Rate"
              value={formatPercentage(kpis.liquidity.utilizationRate)}
              color="info"
              subValue="Target: 85-92%"
            />
            <StatsCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Cash Drag"
              value={formatPercentage(kpis.liquidity.cashDrag)}
              color="warning"
              subValue="Target: <0.75%"
            />
            <StatsCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              label="Redemption Liquidity"
              value={formatCurrency(kpis.liquidity.redemptionLiquidity)}
              color="secondary"
              subValue="5-10% of TVL"
            />
          </div>
        </section>

        {/* Risk & Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Risk KPIs */}
          <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Risk Metrics</h2>}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Default Rate (NPL)</p>
                  <p className={`text-lg font-bold ${getStatusColor(kpis.risk.defaultRate, 2, 5)}`}>
                    {formatPercentage(kpis.risk.defaultRate)}
                  </p>
                </div>
                <Badge variant={kpis.risk.defaultRate < 2 ? 'success' : 'warning'} size="sm">
                  Target: &lt;2%
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Concentration Risk</p>
                  <p className={`text-lg font-bold ${getStatusColor(kpis.risk.concentrationRisk, 15, 25)}`}>
                    {formatPercentage(kpis.risk.concentrationRisk)}
                  </p>
                </div>
                <Badge variant={kpis.risk.concentrationRisk < 15 ? 'success' : 'warning'} size="sm">
                  Target: &lt;15%
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Credit Rating</p>
                  <p className="text-lg font-bold text-[#103b5b]">{kpis.risk.creditRating}</p>
                </div>
                <Badge variant="info" size="sm">Target: BBB+</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Collateralization</p>
                  <p className={`text-lg font-bold ${getStatusColor(kpis.risk.collateralizationRatio, 125, 100)}`}>
                    {formatPercentage(kpis.risk.collateralizationRatio)}
                  </p>
                </div>
                <Badge variant={kpis.risk.collateralizationRatio > 125 ? 'success' : 'warning'} size="sm">
                  Target: &gt;125%
                </Badge>
              </div>
            </div>
          </Card>

          {/* Compliance KPIs */}
          <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Compliance Status</h2>}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">KYC/KYB Coverage</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatPercentage(kpis.compliance.kycCoverage)}
                  </p>
                </div>
                <Badge variant="success" size="sm">Required: 100%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Whitelisted Wallets</p>
                  <p className="text-lg font-bold text-[#103b5b]">{kpis.compliance.whitelistedWallets}</p>
                </div>
                <Badge variant={kpis.compliance.whitelistedWallets >= 20 ? 'success' : 'warning'} size="sm">
                  Target: 20+
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Jurisdiction Diversity</p>
                  <p className="text-lg font-bold text-[#103b5b]">{kpis.compliance.jurisdictionCount}</p>
                </div>
                <Badge variant={kpis.compliance.jurisdictionCount > 5 ? 'success' : 'warning'} size="sm">
                  Target: 5+
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Impact KPIs */}
        <section>
          <h2 className="text-xl font-bold text-[#103b5b] mb-4">Impact & ESG</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
              label="Industrial Growth"
              value={formatPercentage(kpis.impact.industrialGrowth)}
              color="success"
              subValue="Target: >20% YoY"
            />
            <StatsCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              }
              label="Value-Add Ratio"
              value={`${kpis.impact.valueAddRatio.toFixed(1)}x`}
              color="info"
              subValue="Target: >2.5x"
            />
            <StatsCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              label="Job Creation"
              value={`${kpis.impact.jobsPerMillion} per €1M`}
              color="secondary"
              subValue="Target: 50-150"
            />
          </div>
        </section>
      </main>
        </>
      )}
    </div>
  );
};

export default PoolDashboard;
