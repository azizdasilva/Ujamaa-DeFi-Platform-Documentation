/**
 * uLP (Liquidity Provider) Token Monitoring Page
 *
 * Displays uLP token holdings, NAV, and yield data.
 * Each investor sees ONLY their own holdings.
 * Admin sees ALL investors' holdings with aggregated metrics.
 *
 * Route: /invest/ulp-monitoring
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getULPDashboard, getULPHoldings, ULPSummary, ULPHolding } from '../../../api/ulpMonitoring';
import MVPBanner from '../../components/MVPBanner';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const ULPMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<ULPSummary | null>(null);
  const [ulpHoldings, setUlpHoldings] = useState<ULPHolding[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryData, ulpData] = await Promise.all([
        getULPDashboard(),
        getULPHoldings(),
      ]);
      setSummary(summaryData);
      setUlpHoldings(ulpData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching uLP data:', err);
      setError(err.response?.data?.detail || 'Failed to load uLP data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (num: number) => num.toLocaleString();

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6ED] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-[#103b5b] mb-2">Loading uLP Data...</p>
          <p className="text-[#8b5b3d]">Fetching token balances and NAV</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">uLP Token Monitoring</h1>
              <p className="text-[#8b5b3d] mt-1">
                Liquidity Provider token balances, NAV, and yield
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={fetchData} variant="secondary" size="sm">
                🔄 Refresh
              </Button>
              <Button onClick={() => navigate(-1)} variant="secondary" size="sm">
                ← Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        {summary && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <div className="text-center">
                  <p className="text-sm text-[#8b5b3d]">uLP Balance</p>
                  <p className="text-3xl font-bold text-[#023D7A] mt-2">
                    {formatNumber(summary.total_ulp_balance)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">uLP tokens</p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <p className="text-sm text-[#8b5b3d]">Position Value</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {formatCurrency(summary.total_position_value)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Current NAV value</p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <p className="text-sm text-[#8b5b3d]">Yield Earned</p>
                  <p className="text-3xl font-bold text-teal-600 mt-2">
                    {formatCurrency(summary.total_yield_earned)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Accrued to date</p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <p className="text-sm text-[#8b5b3d]">NAV per Share</p>
                  <p className="text-3xl font-bold text-[#103b5b] mt-2">
                    €{summary.nav_per_share.toFixed(4)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {summary.last_nav_update
                      ? new Date(summary.last_nav_update).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </Card>
            </div>

            {/* Global Pool Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <div className="text-center">
                  <p className="text-sm text-[#8b5b3d]">Global uLP Supply</p>
                  <p className="text-2xl font-bold text-[#023D7A]">
                    {formatNumber(summary.global_total_supply)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{summary.global_total_holders} holders</p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <p className="text-sm text-[#8b5b3d]">Total Pool Value</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(summary.global_pool_value)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All pools combined</p>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <p className="text-sm text-[#8b5b3d]">UGT Collateral (Global)</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {formatCurrency(summary.total_collateral_value)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{summary.active_ugt_count} active NFTs</p>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* uLP Holdings Table */}
        <Card header={
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#103b5b]">uLP Holdings</h3>
            <Badge variant="info" size="sm">{ulpHoldings.length} holding(s)</Badge>
          </div>
        }>
          {ulpHoldings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl mb-2">No uLP holdings found</p>
              <p className="text-sm">Invest in a pool to start earning yield</p>
              <Button onClick={() => navigate('/institutional/pools')} className="mt-4">
                Browse Pools
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {summary?.investor_id === null && (
                      <th className="text-left p-3 text-sm font-semibold text-[#8b5b3d]">Investor</th>
                    )}
                    <th className="text-left p-3 text-sm font-semibold text-[#8b5b3d]">Pool</th>
                    <th className="text-right p-3 text-sm font-semibold text-[#8b5b3d]">uLP Balance</th>
                    <th className="text-right p-3 text-sm font-semibold text-[#8b5b3d]">NAV/Share</th>
                    <th className="text-right p-3 text-sm font-semibold text-[#8b5b3d]">Position Value</th>
                    <th className="text-right p-3 text-sm font-semibold text-[#8b5b3d]">Yield Earned</th>
                    <th className="text-right p-3 text-sm font-semibold text-[#8b5b3d]">Deposited</th>
                    <th className="text-right p-3 text-sm font-semibold text-[#8b5b3d]">Redeemed</th>
                    <th className="text-left p-3 text-sm font-semibold text-[#8b5b3d]">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {ulpHoldings.map((h) => (
                    <tr key={h.id} className="border-b border-gray-100 hover:bg-gray-50">
                      {summary?.investor_id === null && (
                        <td className="p-3 text-sm font-medium text-[#103b5b]">{h.investor_name}</td>
                      )}
                      <td className="p-3 text-sm">{h.pool_name || 'N/A'}</td>
                      <td className="p-3 text-sm text-right font-semibold">{formatNumber(h.ulp_balance)}</td>
                      <td className="p-3 text-sm text-right">€{h.nav_per_share.toFixed(4)}</td>
                      <td className="p-3 text-sm text-right font-bold text-green-600">
                        {formatCurrency(h.position_value)}
                      </td>
                      <td className="p-3 text-sm text-right text-teal-600">
                        {formatCurrency(h.total_yield_earned)}
                      </td>
                      <td className="p-3 text-sm text-right">{formatCurrency(h.total_deposited)}</td>
                      <td className="p-3 text-sm text-right">{formatCurrency(h.total_redeemed)}</td>
                      <td className="p-3 text-xs text-gray-500">{formatDate(h.last_updated)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Quick Links */}
        <Card header={<h3 className="text-lg font-bold text-[#103b5b]">Quick Links</h3>}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/investor/returns')}
              className="p-4 bg-white border border-[#103b5b]/20 rounded-lg hover:bg-gray-50 text-left"
            >
              <p className="font-semibold text-[#103b5b]">💰 Returns & Yield</p>
              <p className="text-sm text-[#8b5b3d] mt-1">View detailed yield history</p>
            </button>
            <button
              onClick={() => navigate('/invest/ugt-monitoring')}
              className="p-4 bg-white border border-[#103b5b]/20 rounded-lg hover:bg-gray-50 text-left"
            >
              <p className="font-semibold text-[#103b5b]">🛡️ UGT Collateral</p>
              <p className="text-sm text-[#8b5b3d] mt-1">View guarantee tokens</p>
            </button>
            <a
              href="/investors-room/reinvestment-settings"
              className="p-4 bg-white border border-[#103b5b]/20 rounded-lg hover:bg-gray-50 text-left"
            >
              <p className="font-semibold text-[#103b5b]">⚙️ Reinvestment Settings</p>
              <p className="text-sm text-[#8b5b3d] mt-1">Configure yield preferences</p>
            </a>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ULPMonitoring;
