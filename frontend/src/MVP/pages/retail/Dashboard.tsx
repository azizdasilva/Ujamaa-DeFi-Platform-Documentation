/**
 * Retail Investor Dashboard
 * 
 * Simplified UI for retail investors with educational content and small amount investments.
 * 
 * Route: /retail/dashboard
 * 
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import StatsCard from '../../components/StatsCard';
import Badge from '../../components/Badge';

const RetailDashboard: React.FC = () => {
  // Mock data for demo
  const portfolioValue = 25_000; // €25K
  const totalYield = 1_250; // €1,250
  const positions = [
    { poolId: 'POOL_TRADE_FINANCE', poolName: 'Pool Trade Finance', shares: 10_000, value: 10_500, apy: 9 },
    { poolId: 'POOL_AGRICULTURE', poolName: 'Pool Agriculture', shares: 15_000, value: 15_750, apy: 13.5 },
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
    <div className="min-h-screen bg-[#F3F8FA]">
      {/* MVP Banner */}
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F3F8FA] border-b border-[#48A9F0]/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#023D7A]">Retail Investor Dashboard</h1>
              <p className="text-[#333333] mt-1">Simple Investing for Everyone</p>
            </div>
            <div className="flex items-center gap-3">
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </header>

      {/* Educational Banner */}
      <div className="bg-gradient-to-r from-[#023D7A]/5 to-[#00A8A8]/5 border-b border-[#48A9F0]/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#023D7A]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#023D7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[#023D7A]">New to DeFi?</h3>
              <p className="text-sm text-[#333333] mt-1">
                Start with as little as €1,000. Learn about tokenized real-world assets and earn yield from African industries.
                <a href="/investors-room/defi-basics" className="underline ml-2 font-medium text-[#00A8A8] hover:text-[#D57028]">Learn more →</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Your Portfolio"
            value={formatCurrency(portfolioValue)}
            trend={{ value: 5.2, direction: 'up' }}
            color="green"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            label="Total Yield Earned"
            value={formatCurrency(totalYield)}
            trend={{ value: 8.5, direction: 'up' }}
            color="blue"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Active Investments"
            value={positions.length}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Your Investments */}
          <div className="lg:col-span-2">
            <Card
              header={
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#023D7A]">Your Investments</h2>
                  <a href="/retail/pools" className="text-[#00A8A8] hover:text-[#D57028] text-sm font-medium">
                    Browse Pools →
                  </a>
                </div>
              }
            >
              <div className="space-y-4">
                {positions.map((position) => (
                  <div
                    key={position.poolId}
                    className="p-4 bg-[#F3F8FA] rounded-lg border border-[#48A9F0]/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-[#023D7A]">{position.poolName}</h3>
                        <p className="text-sm text-[#333333]">{position.shares.toLocaleString()} UPT</p>
                      </div>
                      <Badge variant="success" size="sm">{position.apy}% APY</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-[#023D7A]">
                        {formatCurrency(position.value)}
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`/retail/pools?pool=${position.poolId}&action=add`}
                          className="px-4 py-2 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white text-sm font-bold rounded-lg transition-colors"
                        >
                          Add
                        </a>
                        <a
                          href={`/retail/pools?pool=${position.poolId}&action=redeem`}
                          className="px-4 py-2 border border-[#48A9F0]/30 hover:bg-[#F3F8FA] text-[#023D7A] text-sm font-bold rounded-lg transition-colors"
                        >
                          Redeem
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty State Prompt */}
                {positions.length === 0 && (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-[#023D7A]/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-[#333333] mb-4">No investments yet</p>
                    <a
                      href="/retail/pools"
                      className="inline-block px-6 py-3 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-colors"
                    >
                      Start Investing
                    </a>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Actions & Education */}
          <div>
            <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Quick Actions</h2>}>
              <div className="space-y-3">
                <a
                  href="/retail/pools"
                  className="block w-full px-4 py-3 bg-[#103b5b] hover:bg-[#0d3352] text-white !text-white font-bold rounded-lg transition-colors text-center"
                >
                  📈 Browse Pools
                </a>
                <a
                  href="/investors-room/reinvestment-settings"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-colors text-center"
                >
                  💰 Reinvestment Settings
                </a>
                <a
                  href="/investors-room/tokenization"
                  className="block w-full px-4 py-3 border border-[#103b5b]/30 hover:bg-[#F9F6ED] text-[#103b5b] font-medium rounded-lg transition-colors text-center"
                >
                  📚 How Tokenization Works
                </a>
                <a
                  href="/investors-room/fees"
                  className="block w-full px-4 py-3 border border-[#103b5b]/30 hover:bg-[#F9F6ED] text-[#103b5b] font-medium rounded-lg transition-colors text-center"
                >
                  🧮 View Fees & Returns
                </a>
                <a
                  href="/investors-room"
                  className="block w-full px-4 py-3 border border-[#48A9F0]/30 hover:bg-[#F3F8FA] text-[#023D7A] font-bold rounded-lg transition-colors text-center"
                >
                  📄 Documents
                </a>
              </div>
            </Card>

            {/* Investment Limits */}
            <Card className="mt-6">
              <h3 className="font-bold text-gray-900 mb-3">Retail Investment Limits</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Minimum</span>
                  <span className="font-semibold">€1,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Maximum</span>
                  <span className="font-semibold">€50,000</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Daily Withdrawal</span>
                  <span className="font-semibold">€500,000</span>
                </div>
              </div>
            </Card>

            {/* Risk Notice */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Investment Risk</p>
                  <p className="text-xs text-amber-700 mt-1">
                    All investments carry risk. Past performance doesn't guarantee future results. Only invest what you can afford to lose.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            🚀 MVP: Retail Investor Portal - Testnet Release • Polygon Amoy (Chain ID: 80002)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RetailDashboard;
