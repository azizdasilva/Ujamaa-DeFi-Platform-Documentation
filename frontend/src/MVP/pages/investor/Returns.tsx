/**
 * Investor Returns Page
 * 
 * Display investor's returns, distributions, and yield history.
 * 
 * Route: /investor/returns
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import StatsCard from '../../components/StatsCard';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const InvestorReturns: React.FC = () => {
  const navigate = useNavigate();
  // Mock returns data
  const returns = {
    totalDistributions: 12450,
    ytdReturn: 18200,
    projectedAnnual: 27500,
    averageYield: 11.2,
  };

  const distributions = [
    { id: 1, pool: 'Pool Industry - Manufacturing #12', amount: 1580, date: '2026-03-15', type: 'quarterly', status: 'paid' },
    { id: 2, pool: 'Pool Agriculture - Coffee Export #8', amount: 2450, date: '2026-03-01', type: 'quarterly', status: 'paid' },
    { id: 3, pool: 'Pool Trade Finance - Invoice Pool #5', amount: 950, date: '2026-02-28', type: 'monthly', status: 'paid' },
    { id: 4, pool: 'Pool Renewable Energy - Solar #3', amount: 2180, date: '2026-02-15', type: 'quarterly', status: 'paid' },
    { id: 5, pool: 'Pool Real Estate - Commercial #1', amount: 5290, date: '2026-01-15', type: 'final', status: 'paid' },
    { id: 6, pool: 'Pool Industry - Manufacturing #12', amount: 1520, date: '2025-12-15', type: 'quarterly', status: 'paid' },
    { id: 7, pool: 'Pool Agriculture - Coffee Export #8', amount: 2380, date: '2025-12-01', type: 'quarterly', status: 'paid' },
  ];

  const upcomingDistributions = [
    { pool: 'Pool Trade Finance - Invoice Pool #5', estimatedAmount: 1000, expectedDate: '2026-03-31', confidence: 'high' },
    { pool: 'Pool Renewable Energy - Solar #3', estimatedAmount: 2200, expectedDate: '2026-05-15', confidence: 'medium' },
    { pool: 'Pool Agriculture - Coffee Export #8', estimatedAmount: 2500, expectedDate: '2026-06-01', confidence: 'high' },
  ];

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
              <h1 className="text-3xl font-bold text-[#103b5b]">Returns & Distributions</h1>
              <p className="text-[#8b5b3d] mt-1">Track your yield and distributions</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/investors-room/reinvestment-settings')}
            className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Reinvestment Settings</h3>
                <p className="text-sm text-gray-600">Configure yield distributions</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => navigate('/investor/recurring-investment')}
            className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Recurring Investment</h3>
                <p className="text-sm text-gray-600">Set up automated DCA</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => navigate('/investor/portfolio')}
            className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Portfolio</h3>
                <p className="text-sm text-gray-600">View holdings</p>
              </div>
            </div>
          </button>
        </div>

        {/* Returns Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Total Distributions"
            value={formatCurrency(returns.totalDistributions)}
            color="success"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            label="YTD Returns"
            value={formatCurrency(returns.ytdReturn)}
            color="info"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            label="Projected Annual"
            value={formatCurrency(returns.projectedAnnual)}
            color="secondary"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              </svg>
            }
            label="Average Yield"
            value={`${returns.averageYield}%`}
            color="warning"
            subValue="APY"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Distribution History */}
          <div className="lg:col-span-2">
            <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Distribution History</h2>}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#103b5b]/20">
                      <th className="text-left py-3 px-2 font-semibold text-[#103b5b]">Pool</th>
                      <th className="text-left py-3 px-2 font-semibold text-[#103b5b]">Type</th>
                      <th className="text-left py-3 px-2 font-semibold text-[#103b5b]">Date</th>
                      <th className="text-left py-3 px-2 font-semibold text-[#103b5b]">Amount</th>
                      <th className="text-left py-3 px-2 font-semibold text-[#103b5b]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributions.map((dist) => (
                      <tr key={dist.id} className="border-b border-[#103b5b]/10">
                        <td className="py-3 px-2">
                          <p className="font-medium text-[#103b5b]">{dist.pool}</p>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant="info" size="sm">{dist.type}</Badge>
                        </td>
                        <td className="py-3 px-2 text-[#8b5b3d]">{dist.date}</td>
                        <td className="py-3 px-2 font-semibold text-green-600">+{formatCurrency(dist.amount)}</td>
                        <td className="py-3 px-2">
                          <Badge variant="success" size="sm">{dist.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Upcoming Distributions */}
          <div>
            <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Upcoming Distributions</h2>}>
              <div className="space-y-4">
                {upcomingDistributions.map((upcoming, idx) => (
                  <div key={idx} className="p-4 bg-[#F3F8FA] rounded-lg border border-[#023D7A]/20">
                    <p className="font-medium text-[#103b5b] mb-2">{upcoming.pool}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-[#8b5b3d]">Estimated</p>
                        <p className="font-semibold text-green-600">{formatCurrency(upcoming.estimatedAmount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#8b5b3d]">Expected</p>
                        <p className="font-medium text-[#103b5b]">{upcoming.expectedDate}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge 
                        variant={upcoming.confidence === 'high' ? 'success' : 'warning'} 
                        size="sm"
                      >
                        {upcoming.confidence === 'high' ? 'High Confidence' : 'Medium Confidence'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Distribution Schedule</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Distributions are typically paid quarterly. Trade Finance pools may distribute monthly.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvestorReturns;
