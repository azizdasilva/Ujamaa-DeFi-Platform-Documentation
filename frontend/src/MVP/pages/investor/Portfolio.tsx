/**
 * Investor Portfolio Page
 *
 * Display investor's portfolio with holdings, returns, and performance.
 *
 * Route: /investor/portfolio
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import StatsCard from '../../components/StatsCard';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { databaseAPI } from '../../../api/database';
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

const InvestorPortfolio: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [investor, setInvestor] = useState<any>(null);
  const [pools, setPools] = useState<any[]>([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
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
        
        // Fetch investor profile
        const investorData = await databaseAPI.getInvestorProfile(investorId);
        setInvestor(investorData);
        
        // Fetch pool details for each position
        const poolDetails = await Promise.all(
          investorData.pool_positions.map(async (pos: any) => {
            try {
              const poolRes = await fetch(`/api/v2/db/pools/${pos.pool_id}`);
              const poolData = await poolRes.json();
              return { ...pos, poolData };
            } catch {
              // Format pool_id to readable name (e.g., "POOL_TRADE_FINANCE" → "Trade Finance")
              const formattedName = pos.pool_id
                .replace('POOL_', '')
                .replace(/_/g, ' ');
              return { 
                ...pos, 
                poolData: { 
                  name: formattedName, 
                  apy: 0,
                  family: pos.pool_id.replace('POOL_', '').toLowerCase()
                } 
              };
            }
          })
        );
        
        setPools(poolDetails);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [authUser?.id]);

  // Calculate portfolio metrics from real data
  const portfolio = {
    totalValue: investor?.total_portfolio_value || 0,
    totalInvested: investor?.total_invested || 0,
    totalReturns: investor?.pool_positions.reduce((sum: number, pos: any) => sum + pos.total_yield_earned, 0) || 0,
    unrealizedGain: 0,
    realizedGain: 0,
    averageAPY: 11.2,
  };

  const holdings = pools.map((pos, idx) => ({
    id: idx + 1,
    poolName: pos.poolData?.name || pos.pool_id,
    invested: pos.shares * pos.average_nav,
    currentValue: pos.shares * pos.average_nav + pos.total_yield_earned,
    ulpTokens: pos.shares,
    apy: pos.poolData?.apy || 0,
    status: 'active',
    maturityDate: '2027-03-21',
    progress: 45,
  }));

  const totalUlPTokens = holdings.reduce((sum, h) => sum + h.ulpTokens, 0);

  const recentTransactions = [
    { id: 1, type: 'investment', pool: 'Pool Renewable Energy - Solar #3', amount: 85000, date: '2026-03-15', status: 'completed' },
    { id: 2, type: 'distribution', pool: 'Pool Agriculture - Coffee #8', amount: 2450, date: '2026-03-01', status: 'completed' },
    { id: 3, type: 'investment', pool: 'Pool Trade Finance - Invoice #5', amount: 40000, date: '2026-02-28', status: 'completed' },
    { id: 4, type: 'distribution', pool: 'Pool Industry - Manufacturing #12', amount: 1580, date: '2026-02-15', status: 'completed' },
    { id: 5, type: 'redemption', pool: 'Pool Real Estate - Commercial #1', amount: 57300, date: '2026-01-15', status: 'completed' },
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
              <h1 className="text-3xl font-bold text-[#103b5b]">My Portfolio</h1>
              <p className="text-[#8b5b3d] mt-1">Track your investments and returns</p>
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
            onClick={() => navigate('/investor/returns')}
            className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Returns</h3>
                <p className="text-sm text-gray-600">Distribution history</p>
              </div>
            </div>
          </button>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Total Portfolio Value"
            value={formatCurrency(portfolio.totalValue)}
            color="green"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            label="Total Returns"
            value={formatCurrency(portfolio.totalReturns)}
            color="blue"
            subValue={`+${portfolio.averageAPY}% APY`}
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Unrealized Gain"
            value={formatCurrency(portfolio.unrealizedGain)}
            color="amber"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Realized Gain"
            value={formatCurrency(portfolio.realizedGain)}
            color="green"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            label="uLP Tokens"
            value={totalUlPTokens.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            color="purple"
            subValue="Total Holdings"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Holdings */}
          <div className="lg:col-span-2">
            <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Active Investments</h2>}>
              <div className="space-y-4">
                {holdings.filter(h => h.status === 'active').map((holding) => (
                  <div key={holding.id} className="p-4 bg-[#F9F6ED] rounded-lg border border-[#103b5b]/20">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-[#103b5b]">{holding.poolName}</h3>
                        <p className="text-sm text-[#8b5b3d]">Invested: {formatCurrency(holding.invested)} • <span className="font-medium">{holding.ulpTokens.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} uLP</span></p>
                      </div>
                      <Badge variant="success" size="sm">ACTIVE</Badge>
                    </div>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#8b5b3d]">Progress to maturity</span>
                        <span className="font-medium text-[#103b5b]">{holding.progress}%</span>
                      </div>
                      <div className="w-full bg-[#103b5b]/10 rounded-full h-2">
                        <div
                          className="bg-[#d57028] h-2 rounded-full transition-all"
                          style={{ width: `${holding.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-[#8b5b3d]">Current Value</p>
                        <p className="font-semibold text-[#103b5b]">{formatCurrency(holding.currentValue)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#8b5b3d]">APY</p>
                        <p className="font-semibold text-green-600">{holding.apy}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#8b5b3d]">Maturity</p>
                        <p className="font-medium text-[#103b5b]">{holding.maturityDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div>
            <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Recent Activity</h2>}>
              <div className="space-y-3">
                {recentTransactions.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          txn.type === 'investment' ? 'bg-blue-500' :
                          txn.type === 'distribution' ? 'bg-green-500' :
                          'bg-amber-500'
                        }`} />
                        <p className="font-medium text-gray-900 capitalize">{txn.type}</p>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{txn.pool}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{txn.date}</p>
                    </div>
                    <div className={`font-semibold ${
                      txn.type === 'investment' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {txn.type === 'investment' ? '-' : '+'}{formatCurrency(txn.amount)}
                    </div>
                  </div>
                ))}
              </div>
              <a href="/investor/transactions" className="block text-center mt-4 text-[#00A8A8] hover:text-[#0D7A7A] text-sm font-medium">
                View All Transactions →
              </a>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvestorPortfolio;
