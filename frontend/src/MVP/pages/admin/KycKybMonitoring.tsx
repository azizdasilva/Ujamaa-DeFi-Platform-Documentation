/**
 * Admin - KYC/KYB Monitoring Dashboard
 *
 * Comprehensive KYC (individual investors) and KYB (corporate investors)
 * monitoring with statistics per day, week, month, and year.
 *
 * Features:
 * - Separate KYC and KYB tabs
 * - Time granularity: daily, weekly, monthly, yearly
 * - Submission, approval, rejection, overdue trends
 * - Overall summary cards for each category
 *
 * Route: /admin/kyc-kyb-monitoring
 * Access: ADMIN only
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getKycKybStats,
  getKycKybSummary,
  getKycKybByOfficer,
  KycKybPeriodStat,
  KycKybSummaryStat,
  KycKybSummaryResponse,
  OfficerStat,
} from '../../../api/admin';
import MVPBanner from '../../components/MVPBanner';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

type TabType = 'kyc' | 'kyb' | 'officers';
type Granularity = 'daily' | 'weekly' | 'monthly' | 'yearly';

const KycKybMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('kyc');
  const [granularity, setGranularity] = useState<Granularity>('daily');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<KycKybPeriodStat[]>([]);
  const [summary, setSummary] = useState<KycKybSummaryResponse | null>(null);
  const [officerStats, setOfficerStats] = useState<OfficerStat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab, granularity]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const promises: Promise<any>[] = [
        getKycKybStats(granularity, activeTab !== 'officers' ? activeTab : 'all'),
        getKycKybSummary(),
      ];
      if (activeTab === 'officers') {
        promises.push(getKycKybByOfficer('all'));
      }
      const results = await Promise.all(promises);
      setStats(results[0].periods || []);
      setSummary(results[1]);
      if (results[2]) {
        setOfficerStats(results[2].officers || []);
      }
      setError(null);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Error fetching KYC/KYB stats:', err);
      setError(err.response?.data?.detail || 'Failed to load KYC/KYB statistics');
    } finally {
      setLoading(false);
    }
  }, [activeTab, granularity]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const currentSummary: KycKybSummaryStat | null = useMemo(() => {
    if (!summary) return null;
    return activeTab === 'kyc' ? summary.kyc : summary.kyb;
  }, [summary, activeTab]);

  const maxSubmitted = useMemo(() => {
    if (stats.length === 0) return 0;
    return Math.max(...stats.map((s) => s.total_submitted));
  }, [stats]);

  const totalApproved = useMemo(() => stats.reduce((sum, s) => sum + s.approved, 0), [stats]);
  const totalRejected = useMemo(() => stats.reduce((sum, s) => sum + s.rejected, 0), [stats]);
  const totalOverdue = useMemo(() => stats.reduce((sum, s) => sum + s.overdue, 0), [stats]);

  const tabLabel = activeTab === 'kyc' ? 'KYC (Individual Investors)' : 'KYB (Corporate Investors)';

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">KYC/KYB Monitoring</h1>
              <p className="text-[#8b5b3d] mt-1">Comprehensive verification statistics — approved, rejected, overdue</p>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-xs text-gray-500">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
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
        {/* KYC / KYB / Officers Tabs */}
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              {(['kyc', 'kyb', 'officers'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                    activeTab === tab
                      ? tab === 'kyc'
                        ? 'bg-[#023D7A] text-white'
                        : tab === 'kyb'
                        ? 'bg-[#d57028] text-white'
                        : 'bg-[#103b5b] text-white'
                      : 'bg-white text-[#8b5b3d] hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {tab === 'kyc' ? '🧑 KYC (Individuals)' : tab === 'kyb' ? '🏢 KYB (Corporates)' : '👤 Officer Performance'}
                </button>
              ))}
            </div>
            {activeTab !== 'officers' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#8b5b3d]">Granularity:</span>
                {(['daily', 'weekly', 'monthly', 'yearly'] as Granularity[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGranularity(g)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                      granularity === g
                        ? 'bg-[#103b5b] text-white'
                        : 'bg-white text-[#8b5b3d] hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Summary Cards */}
        {currentSummary && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: 'Total Submitted', value: currentSummary.total_submitted, color: 'text-[#103b5b]' },
              { label: 'Approved', value: currentSummary.approved, color: 'text-green-600' },
              { label: 'Rejected', value: currentSummary.rejected, color: 'text-red-600' },
              { label: 'Pending', value: currentSummary.pending, color: 'text-amber-600' },
              { label: 'Overdue', value: currentSummary.overdue, color: 'text-red-700' },
              { label: 'Approval Rate', value: `${currentSummary.approval_rate}%`, color: 'text-green-600' },
              { label: 'Rejection Rate', value: `${currentSummary.rejection_rate}%`, color: 'text-red-600' },
              { label: 'Avg Review (days)', value: currentSummary.average_review_days.toFixed(1), color: 'text-[#023D7A]' },
            ].map((item) => (
              <Card key={item.label}>
                <div className="text-center">
                  <p className="text-xs text-[#8b5b3d] uppercase tracking-wide">{item.label}</p>
                  <p className={`text-2xl font-bold ${item.color}`}>{loading ? '...' : item.value}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Period Statistics */}
        {loading ? (
          <Card>
            <div className="text-center py-12 text-[#8b5b3d]">
              <p className="text-xl">Loading {tabLabel} statistics...</p>
            </div>
          </Card>
        ) : stats.length === 0 ? (
          <Card>
            <div className="text-center py-12 text-[#8b5b3d]">
              <p className="text-xl mb-2">No {activeTab.toUpperCase()} documents found</p>
              <p className="text-sm">Statistics will appear once documents are submitted</p>
            </div>
          </Card>
        ) : (
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#103b5b]">
                  {activeTab === 'kyc' ? '🧑 KYC' : '🏢 KYB'} — {granularity.charAt(0).toUpperCase() + granularity.slice(1)} Breakdown
                </h3>
                <div className="flex items-center gap-4 text-xs text-[#8b5b3d]">
                  <span>Approved: <strong className="text-green-600">{totalApproved}</strong></span>
                  <span>Rejected: <strong className="text-red-600">{totalRejected}</strong></span>
                  <span>Overdue: <strong className="text-red-700">{totalOverdue}</strong></span>
                </div>
              </div>
            }
          >
            {/* Bar Chart Visualization */}
            <div className="mb-6">
              <div className="flex items-end gap-1 h-32">
                {stats.map((s) => {
                  const height = maxSubmitted > 0 ? (s.total_submitted / maxSubmitted) * 100 : 0;
                  return (
                    <div
                      key={s.period}
                      className="flex-1 min-w-[20px] group relative"
                      title={`${s.period}: ${s.total_submitted} submitted, ${s.approved} approved, ${s.rejected} rejected`}
                    >
                      <div
                        className="w-full bg-gradient-to-t from-[#023D7A] to-[#0a5ea0] rounded-t-sm transition-all hover:from-[#d57028] hover:to-[#e8944a]"
                        style={{ height: `${Math.max(height, 2)}%` }}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-gray-900 text-white text-xs rounded-md px-2 py-1.5 whitespace-nowrap shadow-lg">
                        <p className="font-bold">{s.period}</p>
                        <p>Submitted: {s.total_submitted}</p>
                        <p className="text-green-300">Approved: {s.approved}</p>
                        <p className="text-red-300">Rejected: {s.rejected}</p>
                        <p className="text-amber-300">Pending: {s.pending}</p>
                        <p className="text-red-400">Overdue: {s.overdue}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* X-axis labels */}
              <div className="flex gap-1 mt-2">
                {stats.map((s) => (
                  <div key={s.period} className="flex-1 min-w-[20px] text-center">
                    <span className="text-[10px] text-gray-500 truncate block">
                      {granularity === 'daily' ? s.period.slice(5) : granularity === 'weekly' ? s.period.slice(2) : granularity === 'monthly' ? s.period.slice(2) : s.period.slice(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#103b5b]/20">
                    <th className="text-left py-3 px-2 font-bold text-[#103b5b]">Period</th>
                    <th className="text-right py-3 px-2 font-bold text-[#103b5b]">Submitted</th>
                    <th className="text-right py-3 px-2 font-bold text-green-700">Approved</th>
                    <th className="text-right py-3 px-2 font-bold text-red-700">Rejected</th>
                    <th className="text-right py-3 px-2 font-bold text-amber-700">Pending</th>
                    <th className="text-right py-3 px-2 font-bold text-red-800">Overdue</th>
                    <th className="text-right py-3 px-2 font-bold text-[#023D7A]">Avg Review (days)</th>
                    <th className="text-left py-3 px-2 font-bold text-[#103b5b] w-48">Distribution</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s, idx) => {
                    const total = s.total_submitted || 1;
                    const approvedPct = Math.round((s.approved / total) * 100);
                    const rejectedPct = Math.round((s.rejected / total) * 100);
                    const pendingPct = Math.round((s.pending / total) * 100);
                    return (
                      <tr key={s.period} className={`border-b border-[#103b5b]/10 hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                        <td className="py-2.5 px-2 font-mono text-xs font-bold text-[#103b5b]">{s.period}</td>
                        <td className="py-2.5 px-2 text-right font-bold">{s.total_submitted}</td>
                        <td className="py-2.5 px-2 text-right font-bold text-green-600">{s.approved}</td>
                        <td className="py-2.5 px-2 text-right font-bold text-red-600">{s.rejected}</td>
                        <td className="py-2.5 px-2 text-right font-bold text-amber-600">{s.pending}</td>
                        <td className="py-2.5 px-2 text-right font-bold text-red-700">{s.overdue}</td>
                        <td className="py-2.5 px-2 text-right font-mono text-xs">{s.average_review_days.toFixed(1)}</td>
                        <td className="py-2.5 px-2">
                          <div className="flex h-3 rounded overflow-hidden bg-gray-200">
                            {approvedPct > 0 && (
                              <div className="bg-green-500" style={{ width: `${approvedPct}%` }} title={`Approved: ${approvedPct}%`} />
                            )}
                            {rejectedPct > 0 && (
                              <div className="bg-red-500" style={{ width: `${rejectedPct}%` }} title={`Rejected: ${rejectedPct}%`} />
                            )}
                            {pendingPct > 0 && (
                              <div className="bg-amber-400" style={{ width: `${pendingPct}%` }} title={`Pending: ${pendingPct}%`} />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Officer Performance Tab */}
        {activeTab === 'officers' && (
          loading ? (
            <Card>
              <div className="text-center py-12 text-[#8b5b3d]">
                <p className="text-xl">Loading officer performance data...</p>
              </div>
            </Card>
          ) : officerStats.length === 0 ? (
            <Card>
              <div className="text-center py-12 text-[#8b5b3d]">
                <p className="text-xl mb-2">No officer review data found</p>
                <p className="text-sm">Statistics will appear once compliance officers review documents</p>
              </div>
            </Card>
          ) : (
            <>
              {/* Officer Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Total Officers', value: officerStats.length, color: 'text-[#103b5b]' },
                  { label: 'Total Reviews', value: officerStats.reduce((s, o) => s + o.total_reviewed, 0), color: 'text-[#103b5b]' },
                  { label: 'Avg Approval Rate', value: `${(officerStats.reduce((s, o) => s + o.approval_rate, 0) / officerStats.length).toFixed(1)}%`, color: 'text-green-600' },
                  { label: 'Avg Review Time', value: `${(officerStats.reduce((s, o) => s + o.average_review_days, 0) / officerStats.length).toFixed(1)} days`, color: 'text-[#023D7A]' },
                ].map((item) => (
                  <Card key={item.label}>
                    <div className="text-center">
                      <p className="text-xs text-[#8b5b3d] uppercase tracking-wide">{item.label}</p>
                      <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Officer Performance Table */}
              <Card
                header={
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#103b5b]">
                      👤 Compliance Officer Performance
                    </h3>
                    <span className="text-xs text-[#8b5b3d]">
                      Sorted by most reviews
                    </span>
                  </div>
                }
              >
                {/* Bar Chart — Officer Workload */}
                <div className="mb-6">
                  <div className="flex items-end gap-2 h-32">
                    {officerStats.map((o) => {
                      const maxReviewed = Math.max(...officerStats.map((x) => x.total_reviewed), 1);
                      const height = (o.total_reviewed / maxReviewed) * 100;
                      return (
                        <div
                          key={o.officer_id}
                          className="flex-1 min-w-[40px] group relative"
                          title={`${o.officer_name}: ${o.total_reviewed} reviewed`}
                        >
                          <div
                            className="w-full bg-gradient-to-t from-[#103b5b] to-[#1a5f96] rounded-t-sm transition-all hover:from-[#d57028] hover:to-[#e8944a]"
                            style={{ height: `${Math.max(height, 2)}%` }}
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-gray-900 text-white text-xs rounded-md px-2 py-1.5 whitespace-nowrap shadow-lg">
                            <p className="font-bold">{o.officer_name}</p>
                            <p>Reviewed: {o.total_reviewed}</p>
                            <p className="text-green-300">Approved: {o.approved} ({o.approval_rate}%)</p>
                            <p className="text-red-300">Rejected: {o.rejected} ({o.rejection_rate}%)</p>
                            <p className="text-amber-300">Avg: {o.average_review_days} days</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* X-axis labels */}
                  <div className="flex gap-2 mt-2">
                    {officerStats.map((o) => (
                      <div key={o.officer_id} className="flex-1 min-w-[40px] text-center">
                        <span className="text-[10px] text-gray-500 truncate block" title={o.officer_name}>
                          {o.officer_name.split('@')[0].slice(0, 8)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-[#103b5b]/20">
                        <th className="text-left py-3 px-2 font-bold text-[#103b5b]">Officer</th>
                        <th className="text-right py-3 px-2 font-bold text-[#103b5b]">Role</th>
                        <th className="text-right py-3 px-2 font-bold text-[#103b5b]">Total Reviewed</th>
                        <th className="text-right py-3 px-2 font-bold text-green-700">Approved</th>
                        <th className="text-right py-3 px-2 font-bold text-red-700">Rejected</th>
                        <th className="text-right py-3 px-2 font-bold text-red-800">Overdue</th>
                        <th className="text-right py-3 px-2 font-bold text-green-700">Approval Rate</th>
                        <th className="text-right py-3 px-2 font-bold text-red-700">Rejection Rate</th>
                        <th className="text-right py-3 px-2 font-bold text-[#023D7A]">Avg Review (days)</th>
                        <th className="text-left py-3 px-2 font-bold text-[#103b5b] w-48">Approval vs Rejection</th>
                      </tr>
                    </thead>
                    <tbody>
                      {officerStats.map((o, idx) => {
                        const total = o.total_reviewed || 1;
                        const approvedPct = Math.round((o.approved / total) * 100);
                        const rejectedPct = Math.round((o.rejected / total) * 100);
                        return (
                          <tr key={o.officer_id} className={`border-b border-[#103b5b]/10 hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                            <td className="py-2.5 px-2 font-bold text-[#103b5b] text-xs" title={o.officer_name}>{o.officer_name}</td>
                            <td className="py-2.5 px-2 text-right">
                              <Badge variant={o.officer_role === 'ADMIN' ? 'error' : 'info'} size="sm">
                                {o.officer_role.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-2 text-right font-bold">{o.total_reviewed}</td>
                            <td className="py-2.5 px-2 text-right font-bold text-green-600">{o.approved}</td>
                            <td className="py-2.5 px-2 text-right font-bold text-red-600">{o.rejected}</td>
                            <td className="py-2.5 px-2 text-right font-bold text-red-700">{o.overdue}</td>
                            <td className="py-2.5 px-2 text-right font-bold text-green-600">{o.approval_rate}%</td>
                            <td className="py-2.5 px-2 text-right font-bold text-red-600">{o.rejection_rate}%</td>
                            <td className="py-2.5 px-2 text-right font-mono text-xs">{o.average_review_days.toFixed(1)}</td>
                            <td className="py-2.5 px-2">
                              <div className="flex h-3 rounded overflow-hidden bg-gray-200">
                                {approvedPct > 0 && (
                                  <div className="bg-green-500" style={{ width: `${approvedPct}%` }} title={`Approved: ${approvedPct}%`} />
                                )}
                                {rejectedPct > 0 && (
                                  <div className="bg-red-500" style={{ width: `${rejectedPct}%` }} title={`Rejected: ${rejectedPct}%`} />
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )
        )}

        {/* Comparison Panel — only show for KYC/KYB tabs */}
        {summary && activeTab !== 'officers' && (
          <Card
            header={
              <h3 className="text-lg font-bold text-[#103b5b]">
                📊 KYC vs KYB Comparison
              </h3>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* KYC Column */}
              <div className={`p-4 rounded-lg border-2 ${activeTab === 'kyc' ? 'border-[#023D7A] bg-blue-50/30' : 'border-gray-200'}`}>
                <h4 className="text-lg font-bold text-[#023D7A] mb-3">🧑 KYC — Individual Investors</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Total Submitted', value: summary.kyc.total_submitted },
                    { label: 'Approved', value: summary.kyc.approved, color: 'text-green-600' },
                    { label: 'Rejected', value: summary.kyc.rejected, color: 'text-red-600' },
                    { label: 'Pending', value: summary.kyc.pending, color: 'text-amber-600' },
                    { label: 'Overdue', value: summary.kyc.overdue, color: 'text-red-700' },
                    { label: 'Approval Rate', value: `${summary.kyc.approval_rate}%`, color: 'text-green-600' },
                    { label: 'Avg Review Time', value: `${summary.kyc.average_review_days.toFixed(1)} days`, color: 'text-[#023D7A]' },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-[#8b5b3d]">{row.label}</span>
                      <span className={`font-bold ${row.color || 'text-[#103b5b]'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KYB Column */}
              <div className={`p-4 rounded-lg border-2 ${activeTab === 'kyb' ? 'border-[#d57028] bg-orange-50/30' : 'border-gray-200'}`}>
                <h4 className="text-lg font-bold text-[#d57028] mb-3">🏢 KYB — Corporate Investors</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Total Submitted', value: summary.kyb.total_submitted },
                    { label: 'Approved', value: summary.kyb.approved, color: 'text-green-600' },
                    { label: 'Rejected', value: summary.kyb.rejected, color: 'text-red-600' },
                    { label: 'Pending', value: summary.kyb.pending, color: 'text-amber-600' },
                    { label: 'Overdue', value: summary.kyb.overdue, color: 'text-red-700' },
                    { label: 'Approval Rate', value: `${summary.kyb.approval_rate}%`, color: 'text-green-600' },
                    { label: 'Avg Review Time', value: `${summary.kyb.average_review_days.toFixed(1)} days`, color: 'text-[#d57028]' },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-[#8b5b3d]">{row.label}</span>
                      <span className={`font-bold ${row.color || 'text-[#103b5b]'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default KycKybMonitoring;
