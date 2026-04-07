/**
 * Investor Returns Page
 *
 * Display investor's real returns, distributions, and yield history
 * from pool positions and financing repayments.
 *
 * Route: /investor/returns
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import apiClient from '../../../api/client';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import StatsCard from '../../components/StatsCard';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

interface PoolYield {
  pool_id: string;
  pool_name: string;
  shares: number;
  average_nav: number;
  current_nav: number;
  position_value: number;
  original_value: number;
  yield_earned: number;
  yield_percentage: number;
}

interface YieldStatements {
  investor_id: string;
  total_position_value: number;
  total_yield_earned: number;
  overall_yield_percentage: number;
  pool_yields: PoolYield[];
  generated_at: string;
}

interface PoolPosition {
  pool_id: string;
  shares: number;
  average_nav: number;
  total_yield_earned: number;
}

interface DistributionRecord {
  id: number;
  pool: string;
  pool_id: string;
  amount: number;
  date: string;
  type: string;
  status: string;
  yield_percentage: number;
}

const InvestorReturns: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [yieldData, setYieldData] = useState<YieldStatements | null>(null);
  const [positions, setPositions] = useState<PoolPosition[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReturnsData();
  }, [authUser?.id]);

  const getInvestorId = useCallback((): number => {
    if (authUser?.id?.includes('inst')) return 1; // Logic Capital
    if (authUser?.id?.includes('retail')) return 2; // John Doe
    if (authUser?.id?.includes('originator')) return 3; // Green Cotton
    return authUser?.id ? parseInt(authUser.id) || 1 : 1;
  }, [authUser?.id]);

  const fetchReturnsData = useCallback(async () => {
    try {
      setLoading(true);
      const investorId = getInvestorId();

      // Fetch yield statements
      try {
        const yieldResp = await apiClient.get(`/pools/yield/statements/${investorId}`);
        setYieldData(yieldResp.data);
      } catch (yieldErr) {
        console.warn('Could not fetch yield statements:', yieldErr);
        setYieldData(null);
      }

      // Fetch portfolio positions
      try {
        const posResp = await apiClient.get(`/db/pools/portfolio/${investorId}`);
        const posData = posResp.data?.positions || posResp.data || [];
        setPositions(Array.isArray(posData) ? posData : []);
      } catch (posErr) {
        console.warn('Could not fetch portfolio positions:', posErr);
        setPositions([]);
      }

      setError(null);
    } catch (err: any) {
      console.error('Error fetching returns data:', err);
      setError(err.response?.data?.detail || 'Failed to load returns data');
    } finally {
      setLoading(false);
    }
  }, [getInvestorId]);

  const distributions: DistributionRecord[] = useMemo(() => {
    if (!yieldData?.pool_yields) return [];

    return yieldData.pool_yields.map((py, idx) => {
      // Determine distribution type based on pool lockup (mock dates)
      const poolTypeMap: Record<string, { type: string; days: number }> = {
        POOL_INDUSTRIE: { type: 'quarterly', days: 90 },
        POOL_AGRICULTURE: { type: 'semi-annual', days: 180 },
        POOL_TRADE_FINANCE: { type: 'monthly', days: 30 },
        POOL_RENEWABLE_ENERGY: { type: 'annual', days: 365 },
        POOL_REAL_ESTATE: { type: 'annual', days: 365 },
      };
      const info = poolTypeMap[py.pool_id] || { type: 'quarterly', days: 90 };

      // Generate a mock distribution date based on the pool
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - Math.floor(Math.random() * info.days));

      return {
        id: idx + 1,
        pool: py.pool_name || py.pool_id,
        pool_id: py.pool_id,
        amount: py.yield_earned,
        date: baseDate.toISOString().split('T')[0],
        type: info.type,
        status: py.yield_earned > 0 ? 'accrued' : 'pending',
        yield_percentage: py.yield_percentage,
      };
    });
  }, [yieldData]);

  const upcomingDistributions = useMemo(() => {
    if (!yieldData?.pool_yields) return [];

    return yieldData.pool_yields
      .filter((py) => py.position_value > 0)
      .map((py) => {
        // Estimate next distribution as ~1/4 of annual yield
        const poolTypeMap: Record<string, { days: number }> = {
          POOL_INDUSTRIE: { days: 90 },
          POOL_AGRICULTURE: { days: 180 },
          POOL_TRADE_FINANCE: { days: 30 },
          POOL_RENEWABLE_ENERGY: { days: 365 },
          POOL_REAL_ESTATE: { days: 365 },
        };
        const info = poolTypeMap[py.pool_id] || { days: 90 };
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + info.days);

        return {
          pool: py.pool_name || py.pool_id,
          estimatedAmount: py.yield_earned * 0.25, // Rough quarterly estimate
          expectedDate: nextDate.toISOString().split('T')[0],
          confidence: py.yield_earned > 0 ? 'high' as const : 'medium' as const,
        };
      });
  }, [yieldData]);

  // Summary stats
  const stats = useMemo(() => {
    const totalYield = yieldData?.total_yield_earned || 0;
    const totalValue = yieldData?.total_position_value || 0;
    const overallYieldPct = yieldData?.overall_yield_percentage || 0;

    // Calculate projected annual from current positions
    const projectedAnnual = totalValue * (overallYieldPct / 100);

    return {
      totalPositionValue: totalValue,
      totalYieldEarned: totalYield,
      overallYieldPct,
      projectedAnnual,
      poolCount: yieldData?.pool_yields?.length || 0,
    };
  }, [yieldData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Returns & Distributions</h1>
              <p className="text-[#8b5b3d] mt-1">Track your yield and distributions</p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={fetchReturnsData} variant="secondary" size="sm">
                🔄 Refresh
              </Button>
              <TestnetNotice variant="badge" />
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
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}><div className="text-center py-4"><div className="h-6 bg-gray-200 rounded animate-pulse mb-2" /><div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" /></div></Card>
            ))
          ) : (
            <>
              <StatsCard
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                label="Total Position Value"
                value={formatCurrency(stats.totalPositionValue)}
                color="info"
              />
              <StatsCard
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                }
                label="Total Yield Earned"
                value={formatCurrency(stats.totalYieldEarned)}
                color="success"
              />
              <StatsCard
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  </svg>
                }
                label="Overall Yield"
                value={`${stats.overallYieldPct.toFixed(1)}%`}
                color="warning"
                subValue="APY"
              />
              <StatsCard
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
                label="Projected Annual"
                value={formatCurrency(stats.projectedAnnual)}
                color="secondary"
              />
              <StatsCard
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
                label="Active Pools"
                value={stats.poolCount}
                color="primary"
              />
            </>
          )}
        </div>

        {loading ? (
          <Card><div className="text-center py-12 text-[#8b5b3d]"><p className="text-xl">Loading yield data...</p></div></Card>
        ) : yieldData && yieldData.pool_yields.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Per-Pool Yield Breakdown */}
            <div className="lg:col-span-2">
              <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Yield by Pool</h2>}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-[#103b5b]/20">
                        <th className="text-left py-3 px-2 font-bold text-[#103b5b]">Pool</th>
                        <th className="text-right py-3 px-2 font-bold text-[#103b5b]">Shares</th>
                        <th className="text-right py-3 px-2 font-bold text-[#103b5b]">Avg NAV</th>
                        <th className="text-right py-3 px-2 font-bold text-[#103b5b]">Current NAV</th>
                        <th className="text-right py-3 px-2 font-bold text-[#103b5b]">Position Value</th>
                        <th className="text-right py-3 px-2 font-bold text-green-700">Yield Earned</th>
                        <th className="text-right py-3 px-2 font-bold text-[#023D7A]">Yield %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yieldData.pool_yields.map((py) => (
                        <tr key={py.pool_id} className="border-b border-[#103b5b]/10 hover:bg-gray-50">
                          <td className="py-2.5 px-2 font-medium text-[#103b5b]">{py.pool_name}</td>
                          <td className="py-2.5 px-2 text-right font-mono text-xs">{py.shares.toLocaleString()}</td>
                          <td className="py-2.5 px-2 text-right font-mono text-xs">€{py.average_nav.toFixed(4)}</td>
                          <td className="py-2.5 px-2 text-right font-mono text-xs">€{py.current_nav.toFixed(4)}</td>
                          <td className="py-2.5 px-2 text-right font-bold">{formatCurrency(py.position_value)}</td>
                          <td className={`py-2.5 px-2 text-right font-bold ${py.yield_earned >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {py.yield_earned >= 0 ? '+' : ''}{formatCurrency(py.yield_earned)}
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            <Badge variant={py.yield_percentage >= 5 ? 'success' : py.yield_percentage >= 0 ? 'warning' : 'error'} size="sm">
                              {py.yield_percentage.toFixed(1)}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Distribution History & Upcoming */}
            <div className="space-y-6">
              {/* Distribution History */}
              <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Distribution History</h2>}>
                {distributions.length === 0 ? (
                  <p className="text-center text-[#8b5b3d] py-4">No distributions yet</p>
                ) : (
                  <div className="space-y-3">
                    {distributions.map((dist) => (
                      <div key={dist.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-[#103b5b] text-sm">{dist.pool}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="info" size="sm">{dist.type}</Badge>
                              <Badge variant={dist.status === 'accrued' ? 'success' : 'warning'} size="sm">{dist.status}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">+{formatCurrency(dist.amount)}</p>
                            <p className="text-xs text-[#8b5b3d]">{formatDate(dist.date)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Upcoming Distributions */}
              <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Upcoming Distributions</h2>}>
                {upcomingDistributions.length === 0 ? (
                  <p className="text-center text-[#8b5b3d] py-4">No upcoming distributions</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingDistributions.map((upcoming, idx) => (
                      <div key={idx} className="p-3 bg-[#F3F8FA] rounded-lg border border-[#023D7A]/20">
                        <p className="font-medium text-[#103b5b] text-sm mb-2">{upcoming.pool}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-[#8b5b3d] text-xs">Estimated</p>
                            <p className="font-semibold text-green-600">{formatCurrency(upcoming.estimatedAmount)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[#8b5b3d] text-xs">Expected</p>
                            <p className="font-medium text-[#103b5b] text-xs">{formatDate(upcoming.expectedDate)}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Badge
                            variant={upcoming.confidence === 'high' ? 'success' : 'warning'}
                            size="sm"
                          >
                            {upcoming.confidence === 'high' ? '✓ High Confidence' : '~ Medium Confidence'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-xs font-semibold text-blue-900">Distribution Schedule</p>
                      <p className="text-xs text-blue-700 mt-0.5">
                        Yield accrues daily based on pool performance. Distributions follow pool lockup periods.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <p className="text-2xl text-[#103b5b] mb-2">No yield data yet</p>
              <p className="text-[#8b5b3d] mb-4">Yield will appear once you invest in pools and financings are repaid.</p>
              <Button onClick={() => navigate('/institutional/pools')} variant="primary">
                Browse Pools →
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default InvestorReturns;
