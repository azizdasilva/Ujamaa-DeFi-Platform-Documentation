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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useBalance } from 'wagmi';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import StatsCard from '../../components/StatsCard';
import Badge from '../../components/Badge';
import { web3Config } from '../../../config/web3';
import { databaseAPI, InvestorProfile } from '../../../api/database';
import { useAuth } from '../../../contexts/AuthContext';

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const InstitutionalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [investor, setInvestor] = useState<InvestorProfile | null>(null);

  // Get connected wallet address
  const { address: walletAddress, isConnected } = useAccount();

  // Get REAL ULP token balance from blockchain (if wallet connected)
  const { data: ulpBalance, isLoading: balanceLoading } = useBalance({
    address: walletAddress,
    token: web3Config.CONTRACTS.ULP_TOKEN,
    query: {
      enabled: isConnected && !!walletAddress,
    },
  });

  useEffect(() => {
    const fetchInvestorProfile = async () => {
      try {
        setLoading(true);
        // Map auth user to investor profile ID
        let investorId: number;
        
        if (authUser?.id?.includes('retail')) {
          investorId = 2; // John Doe - Retail Investor
        } else if (authUser?.id?.includes('inst')) {
          investorId = 1; // Logic Capital - Institutional
        } else if (authUser?.id?.includes('originator')) {
          investorId = 3; // Green Cotton - Operator
        } else {
          investorId = authUser?.id ? parseInt(authUser.id) || 1 : 1;
        }
        
        const data = await databaseAPI.getInvestorProfile(investorId);
        setInvestor(data);
      } catch (error) {
        console.error('Error fetching investor profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorProfile();
  }, [authUser?.id]);

  // Use real data from API, fallback to blockchain or 0
  const portfolioValue = ulpBalance 
    ? Number(ulpBalance.formatted) 
    : investor?.total_portfolio_value || 0;
  
  const totalYield = investor?.pool_positions.reduce((sum, pos) => sum + pos.total_yield_earned, 0) || 0;
  const positions = investor?.pool_positions || [];

  // Calculate average APY from positions (would need pool data for real APY)
  const averageApy = positions.length > 0 ? 11.0 : 0; // Placeholder

  // Recent activity from API
  const recentActivity = investor?.recent_transactions.map(tx => ({
    id: tx.id,
    type: tx.type.toLowerCase(),
    pool: 'Pool', // Would need to enrich with pool name
    amount: tx.amount,
    date: new Date(tx.created_at).toLocaleDateString(),
    status: tx.status,
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* MVP Banner */}
      <MVPBanner />

      {/* Wallet Connection Notice */}
      {!isConnected && (
        <div className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">🔗 Connect Your Wallet</h3>
                <p className="text-sm text-white/90">
                  Connect MetaMask to view real-time ULP token balances and make investments
                </p>
              </div>
              <button
                onClick={() => document.querySelector('[data-connect-wallet]')?.click()}
                className="px-6 py-2 bg-white text-[#023D7A] font-bold rounded-lg hover:bg-white/90 transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      )}

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
            value={
              loading || balanceLoading
                ? 'Loading...'
                : formatCurrency(portfolioValue)
            }
            trend={{ value: 2.5, direction: 'up' }}
            color="navy"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            label="ULP Token Balance"
            value={
              loading || balanceLoading
                ? 'Loading...'
                : isConnected
                  ? `${ulpBalance?.formatted || '0'} UPT`
                  : investor ? `${investor.ult_tokens.toLocaleString()} uLT` : '0 uLT'
            }
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
            value={loading ? '-' : positions.length}
            color="sand"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Total Yield Earned"
            value={loading ? '-' : formatCurrency(totalYield)}
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
                {loading ? (
                  <p className="text-center text-gray-500 py-8">Loading positions...</p>
                ) : positions.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No active positions</p>
                ) : (
                  positions.map((position, idx) => (
                    <div
                      key={`${position.pool_id}-${idx}`}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{position.pool_id.replace('POOL_', '')}</h3>
                          <p className="text-sm text-gray-500">{position.shares.toLocaleString()} shares</p>
                        </div>
                        <Badge variant="success" size="sm">{position.total_yield_earned > 0 ? 'Active' : 'New'}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(position.shares * position.average_nav)}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/institutional/pools?pool=${position.pool_id}`)}
                            className="px-4 py-2 bg-[#103b5b] hover:bg-[#0d3352] text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => alert(`🚀 MVP TESTNET: Redeem functionality for ${position.pool_id} will be available in production.`)}
                            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                          >
                            Redeem
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card header={<h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>}>
              <div className="space-y-4">
                {loading ? (
                  <p className="text-center text-gray-500 py-8">Loading...</p>
                ) : recentActivity.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No recent activity</p>
                ) : (
                  recentActivity.map((activity) => (
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
                          {activity.type === 'investment' ? 'Investment' : activity.type === 'redemption' ? 'Redemption' : 'Transaction'}
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
                          {activity.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            🚀 MVP: Institutional Architecture - Testnet Release
          </p>
        </div>
      </footer>
    </div>
  );
};

export default InstitutionalDashboard;
