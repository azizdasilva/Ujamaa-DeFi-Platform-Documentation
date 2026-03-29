/**
 * Ujamaa DeFi Platform Blockchain Monitor Dashboard
 *
 * Main dashboard page for monitoring Ujamaa smart contracts on Polygon testnet
 * Phase 1: Basic KPI cards with live data
 */

import React from 'react';
import { useDashboardData } from './hooks/useMonitorData';
import {
  KpiCard,
  HealthScoreGauge,
  ActivityFeed,
  SectionHeader,
  LoadingSpinner,
  ErrorDisplay,
} from './components/KpiCard';
import { isMockDataEnabled } from '../../config/monitor';

export const MonitorDashboard: React.FC = () => {
  const { ulp, pool, guarantee, industrial, events, loading, error } = useDashboardData();
  const useMock = isMockDataEnabled();

  // Refresh handler
  const handleRefresh = () => {
    ulp.refresh();
    pool.refresh();
    guarantee.refresh();
    industrial.refresh();
  };

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <ErrorDisplay message={error} onRetry={handleRefresh} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔍</span>
                <div>
                  <h1 className="text-xl font-bold text-white">Ujamaa DeFi Platform Blockchain Monitor</h1>
                  <p className="text-xs text-slate-400">
                    Polygon Testnet Dashboard {useMock && <span className="text-yellow-500">(Mock Data)</span>}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Last updated */}
              <div className="text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live updates</span>
                </div>
              </div>
              
              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pool Health Section */}
        <section className="mb-8">
          <SectionHeader
            title="Pool Health Overview"
            subtitle="Real-time health metrics for Ujamaa liquidity pools"
            icon="📊"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Health Score Gauge */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 h-full flex items-center justify-center">
                <HealthScoreGauge score={pool.healthScore || 75} size="lg" />
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <KpiCard
                label="Total Value Locked"
                value={pool.formattedKpis.tvl.value}
                formattedValue={pool.formattedKpis.tvl.formattedValue}
                status="green"
                tooltip="Total value of assets deposited in the liquidity pool"
                icon="💰"
                loading={pool.loading}
              />
              
              <KpiCard
                label="NAV per Share"
                value={ulp.formattedKpis.navPerShare.value}
                formattedValue={ulp.formattedKpis.navPerShare.formattedValue}
                status="neutral"
                tooltip="Net Asset Value per uLP token - like a stock price for the pool"
                icon="📈"
                loading={ulp.loading}
              />
              
              <KpiCard
                label="Yield Accrued (24h)"
                value={pool.formattedKpis.yieldAccrued24h.value}
                formattedValue={pool.formattedKpis.yieldAccrued24h.formattedValue}
                status="green"
                tooltip="Total yield generated by the pool in the last 24 hours"
                icon="📊"
                loading={pool.loading}
              />
              
              <KpiCard
                label="Pool Utilization"
                value={pool.formattedKpis.utilizationRate.value}
                formattedValue={pool.formattedKpis.utilizationRate.formattedValue}
                status={pool.formattedKpis.utilizationRate.status}
                tooltip="Percentage of pool funds currently deployed. 80-95% is optimal"
                icon="⚡"
                loading={pool.loading}
              />
            </div>
          </div>
        </section>

        {/* ULP Token Metrics */}
        <section className="mb-8">
          <SectionHeader
            title="Ujamaa Pool Token (uLP)"
            subtitle="Yield-bearing token metrics"
            icon="🪙"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Total Supply"
              value={ulp.formattedKpis.totalSupply.value}
              formattedValue={ulp.formattedKpis.totalSupply.formattedValue}
              status="neutral"
              tooltip="Total number of uLP tokens in circulation"
              loading={ulp.loading}
            />
            
            <KpiCard
              label="Total Holders"
              value={ulp.formattedKpis.totalHolders.value}
              formattedValue={ulp.formattedKpis.totalHolders.formattedValue}
              status="green"
              tooltip="Number of unique wallets holding uLP tokens"
              loading={ulp.loading}
            />
            
            <KpiCard
              label="Pool Balance"
              value={pool.formattedKpis.poolBalance.value}
              formattedValue={pool.formattedKpis.poolBalance.formattedValue}
              status="neutral"
              tooltip="Current balance of the liquidity pool in EUROD"
              loading={pool.loading}
            />
            
            <KpiCard
              label="Default Rate"
              value={pool.formattedKpis.defaultRate.value}
              formattedValue={pool.formattedKpis.defaultRate.formattedValue}
              status={pool.formattedKpis.defaultRate.status}
              tooltip="Percentage of financings that have defaulted. Lower is better"
              loading={pool.loading}
            />
          </div>
        </section>

        {/* Collateral & Industrials */}
        <section className="mb-8">
          <SectionHeader
            title="Collateral & Industrials"
            subtitle="Guarantee tokens and registered companies"
            icon="🏭"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <KpiCard
              label="Guarantee Tokens (UJG)"
              value={guarantee.formattedKpis.guaranteeCount.value}
              formattedValue={guarantee.formattedKpis.guaranteeCount.formattedValue}
              status="neutral"
              tooltip="Collateral NFTs backing the pool. Active = held as collateral, Redeemed = returned"
              icon="🎫"
              loading={guarantee.loading}
            />
            
            <KpiCard
              label="Collateral Value"
              value={guarantee.formattedKpis.collateralValue.value}
              formattedValue={guarantee.formattedKpis.collateralValue.formattedValue}
              status="neutral"
              tooltip="Total value of collateral (UJG NFTs) held by the pool"
              loading={guarantee.loading}
            />
            
            <KpiCard
              label="Registered Industrials"
              value={industrial.formattedKpis.industrials.value}
              formattedValue={industrial.formattedKpis.industrials.formattedValue}
              status={industrial.formattedKpis.industrials.status}
              tooltip="Companies approved to receive financing. Pending = awaiting approval"
              icon="🏢"
              loading={industrial.loading}
            />
          </div>
        </section>

        {/* Activity Feed */}
        <section>
          <SectionHeader
            title="Recent Activity"
            subtitle="Live feed of contract events"
            icon="📜"
          />
          
          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
            <ActivityFeed events={events.events} loading={events.loading} limit={10} />
          </div>
        </section>

        {/* Info Banner */}
        {useMock && (
          <div className="mt-8 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <h3 className="font-medium text-yellow-400">Mock Data Mode</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Currently displaying simulated data for testing. To view live blockchain data, set{' '}
                  <code className="px-2 py-1 bg-slate-800 rounded text-xs">USE_MOCK_DATA = false</code> in{' '}
                  <code className="px-2 py-1 bg-slate-800 rounded text-xs">config/monitor.ts</code> and update
                  the contract addresses.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              <strong className="text-slate-400">Ujamaa DeFi Platform</strong> - Monitor Dashboard
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <a
                href="https://amoy.polygonscan.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-400 transition-colors"
              >
                PolygonScan Amoy →
              </a>
              <span>•</span>
              <span>Chain ID: 80002</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MonitorDashboard;
