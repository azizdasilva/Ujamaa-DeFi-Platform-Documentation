/**
 * Institutional Investor Dashboard
 * 
 * Main dashboard for institutional investors showing portfolio summary,
 * pool performance, and recent activity.
 * 
 * Route: /institutional/dashboard
 * 
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import MockDataBadge from '../../components/MockDataBadge';
import Card from '../../components/Card';
import StatsCard from '../../components/StatsCard';
import Badge from '../../components/Badge';

interface PoolPosition {
  poolId: string;
  poolName: string;
  shares: number;
  value: number;
  apy: number;
}

const InstitutionalDashboard: React.FC = () => {
  const navigate = useNavigate();
  // Mock data for demo
  const portfolioValue = 5_000_000; // 5M EUROD
  const totalYield = 125_000; // 125K EUROD
  const positions: PoolPosition[] = [
    { poolId: 'POOL_INDUSTRY', poolName: 'Pool Industry', shares: 2_000_000, value: 2_100_000, apy: 11 },
    { poolId: 'POOL_AGRICULTURE', poolName: 'Pool Agriculture', shares: 1_500_000, value: 1_650_000, apy: 13.5 },
    { poolId: 'POOL_RENEWABLE_ENERGY', poolName: 'Pool Renewable Energy', shares: 1_000_000, value: 1_050_000, apy: 10 },
  ];

  const recentActivity = [
    { id: 1, type: 'investment', pool: 'Pool Industry', amount: 500_000, date: '2026-03-18', status: 'completed' },
    { id: 2, type: 'yield', pool: 'Pool Agriculture', amount: 12_500, date: '2026-03-17', status: 'accrued' },
    { id: 3, type: 'investment', pool: 'Pool Renewable Energy', amount: 1_000_000, date: '2026-03-15', status: 'completed' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* MVP Banner */}
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Institutional Dashboard</h1>
              <p className="text-gray-600 mt-1">Portfolio Overview & Performance</p>
            </div>
            <div className="flex items-center gap-3">
              <TestnetNotice variant="badge" />
              <MockDataBadge />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate('/investors-room/reinvestment-settings')}
            className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-sm truncate">Reinvestment Settings</h3>
                <p className="text-xs text-gray-600 truncate">Yield distribution</p>
              </div>
            </div>
          </button>
          <a
            href="/pool/dashboard"
            className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-sm truncate">Pool Dashboard</h3>
                <p className="text-xs text-gray-600 truncate">View all 18 KPIs</p>
              </div>
            </div>
          </a>
          <a
            href="/investor/portfolio"
            className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-sm truncate">My Portfolio</h3>
                <p className="text-xs text-gray-600 truncate">View holdings</p>
              </div>
            </div>
          </a>
          <a
            href="/institutional/pools"
            className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-sm truncate">Browse Pools</h3>
                <p className="text-xs text-gray-600 truncate">Invest in pools</p>
              </div>
            </div>
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Total Portfolio Value"
            value={formatCurrency(portfolioValue)}
            trend={{ value: 2.5, direction: 'up' }}
            color="navy"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            label="Total Yield Earned"
            value={formatCurrency(totalYield)}
            trend={{ value: 12.3, direction: 'up' }}
            color="orange"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            label="Active Positions"
            value={positions.length}
            color="sand"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Avg. APY"
            value="11.5%"
            trend={{ value: 0.8, direction: 'up' }}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pool Positions */}
          <div className="lg:col-span-2">
            <Card
              header={
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Pool Positions</h2>
                  <button 
                    onClick={() => navigate('/investor/portfolio')}
                    className="text-[#103b5b] hover:text-[#0d3352] text-sm font-medium hover:underline"
                  >
                    View All →
                  </button>
                </div>
              }
            >
              <div className="space-y-4">
                {positions.map((position) => (
                  <div
                    key={position.poolId}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{position.poolName}</h3>
                        <p className="text-sm text-gray-500">{position.shares.toLocaleString()} UPT</p>
                      </div>
                      <Badge variant="success" size="sm">{position.apy}% APY</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(position.value)}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigate(`/institutional/pools?pool=${position.poolId}`)}
                          className="px-4 py-2 bg-[#103b5b] hover:bg-[#0d3352] text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Add
                        </button>
                        <button 
                          onClick={() => {
                            alert(`🚀 MVP TESTNET: Redeem functionality for ${position.poolName} will be available in production. This would initiate a redemption request for your UPT shares.`);
                          }}
                          className="px-4 py-2 border border-[#48A9F0]/30 hover:bg-[#F3F8FA] text-[#023D7A] text-sm font-bold rounded-lg transition-colors"
                        >
                          Redeem
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card header={<h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>}>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'investment'
                          ? 'bg-[#103b5b]/10 text-[#103b5b]'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {activity.type === 'investment' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type === 'investment' ? 'Investment' : 'Yield Accrued'}
                      </p>
                      <p className="text-sm text-gray-500">{activity.pool}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          activity.type === 'investment' ? 'text-gray-900' : 'text-[#103b5b]'
                        }`}
                      >
                        {activity.type === 'investment' ? '-' : '+'}
                        {formatCurrency(activity.amount)}
                      </p>
                      <Badge
                        variant={activity.status === 'completed' ? 'success' : 'info'}
                        size="sm"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            🚀 MVP: Institutional Architecture - Testnet Release • Polygon Amoy (Chain ID: 80002)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default InstitutionalDashboard;
