/**
 * Admin - Compliance Monitoring Dashboard (Enhanced with Charts)
 * 
 * Comprehensive monitoring view including:
 * - SLA compliance metrics with gauge chart
 * - Officer performance bar chart
 * - Trend analysis line chart
 * - Document type pie chart
 * - Overdue documents with CSV export
 * - Auto-refresh every 60 seconds
 * - Advanced date filtering
 * 
 * Route: /admin/monitoring
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getMonitoringDashboard,
  getOverdueReport,
  getSLATrends,
  getOfficerLeaderboard,
  MonitoringDashboard,
  OverdueDocument
} from '../../../api/admin';
import {
  SLATrendsChart,
  DocumentVolumeChart,
  DocumentTypePieChart,
  OfficerPerformanceChart,
  SLAComplianceGauge,
  TrendSparkline,
  chartColors
} from '../../components/charts/Charts';
import {
  exportOverdueDocuments,
  exportOfficerPerformance,
  exportDocumentTypeBreakdown,
  exportSLASummary,
  exportFullDashboard
} from '../../../utils/export';
import MVPBanner from '../../components/MVPBanner';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

type PeriodType = '7d' | '30d' | '90d' | '1y' | 'all';

const ComplianceMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodType>('30d');
  const [dashboard, setDashboard] = useState<MonitoringDashboard | null>(null);
  const [overdueDocs, setOverdueDocs] = useState<OverdueDocument[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'overdue' | 'officers' | 'trends'>('overview');
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [overdueFilter, setOverdueFilter] = useState<'all' | 'rejected' | 'pending' | 'warning' | 'urgent'>('all');

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      console.log('Auto-refreshing dashboard data...');
      fetchDashboard();
    }, 60000); // 60 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh, period]);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [dashboardData, overdueData] = await Promise.all([
        getMonitoringDashboard(period),
        getOverdueReport(overdueFilter, 100)
      ]);
      setDashboard(dashboardData);
      setOverdueDocs(overdueData.documents || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      console.error('Error fetching monitoring dashboard:', err);
      setError(err.response?.data?.detail || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [period, overdueFilter]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleExportAll = () => {
    if (!dashboard) return;
    exportFullDashboard(dashboard, overdueDocs);
  };

  const handleExportOverdue = () => {
    exportOverdueDocuments(overdueDocs);
  };

  const handleExportOfficers = () => {
    if (!dashboard) return;
    exportOfficerPerformance(dashboard.officer_performance);
  };

  const handleExportByType = () => {
    if (!dashboard) return;
    exportDocumentTypeBreakdown(dashboard.by_document_type);
  };

  const handleExportSLA = () => {
    if (!dashboard) return;
    exportSLASummary(dashboard.sla_metrics, period);
  };

  const formatNumber = (num: number) => num.toLocaleString();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string, escalationLevel: number) => {
    if (status === 'rejected') {
      return <Badge variant="error" size="sm">❌ Rejected</Badge>;
    } else if (status === 'urgent') {
      return <Badge variant="error" size="sm">🚨 Urgent</Badge>;
    } else if (status === 'warning') {
      return <Badge variant="warning" size="sm">⚠️ Warning</Badge>;
    } else {
      return <Badge variant="info" size="sm">⏳ Pending</Badge>;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'kyc_id': '🆔 KYC ID',
      'kyc_address': '📄 KYC Address',
      'kyc_selfie': '🤳 KYC Selfie',
      'kyb_incorporation': '📜 KYB Incorporation',
      'kyb_tax': '💰 KYB Tax',
      'kyb_ubo': '👥 KYB UBO',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6ED] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-[#103b5b] mb-2">Loading Dashboard...</p>
          <p className="text-[#8b5b3d]">Fetching compliance metrics</p>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Compliance Monitoring</h1>
              <p className="text-[#8b5b3d] mt-1">Track SLA compliance, officer performance, and overdue documents</p>
              {lastUpdated && (
                <p className="text-xs text-gray-500 mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()} 
                  {autoRefresh && ' • Auto-refreshing every 60s'}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}
                title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
              >
                {autoRefresh ? '🔄 Auto-Refresh ON' : '⏸️ Auto-Refresh OFF'}
              </button>
              <button
                onClick={handleExportAll}
                className="px-3 py-2 bg-[#023D7A] text-white rounded-md text-sm font-medium hover:bg-[#012a54] transition-colors"
              >
                📥 Export All
              </button>
              <Button onClick={() => navigate('/admin/kyc-settings')} variant="secondary">
                ⚙️ KYC Settings
              </Button>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#8b5b3d] mr-2">Period:</span>
            {(['7d', '30d', '90d', '1y', 'all'] as PeriodType[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-[#023D7A] text-white'
                    : 'bg-white text-[#8b5b3d] hover:bg-gray-100'
                }`}
              >
                {p === 'all' ? 'All' : p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
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

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { key: 'overview', label: '📊 Overview' },
            { key: 'overdue', label: '⏰ Overdue' },
            { key: 'officers', label: '👥 Officers' },
            { key: 'trends', label: '📈 Trends' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-[#023D7A] text-[#023D7A] font-semibold'
                  : 'border-transparent text-[#8b5b3d] hover:text-[#103b5b]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && dashboard && (
          <div className="space-y-6">
            {/* SLA Metrics Cards with Sparklines */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <div className="text-center">
                  <p className="text-sm text-[#8b5b3d]">SLA Compliance Rate</p>
                  <SLAComplianceGauge
                    value={dashboard.sla_metrics.sla_compliance_rate}
                    label="On-time reviews"
                    size={150}
                  />
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <p className="text-sm text-[#8b5b3d]">Avg Review Time</p>
                  <p className="text-4xl font-bold text-[#023D7A] mt-4">
                    {dashboard.sla_metrics.average_review_time_business_days.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Business days</p>
                  {dashboard.trend_data.length > 0 && (
                    <div className="mt-2">
                      <TrendSparkline
                        data={dashboard.trend_data.map(d => d.average_review_days)}
                        color={chartColors.warning}
                        height={30}
                        width={100}
                      />
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <p className="text-sm text-[#8b5b3d]">Total Documents</p>
                  <p className="text-4xl font-bold text-[#103b5b] mt-4">
                    {formatNumber(dashboard.sla_metrics.total_documents)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">In selected period</p>
                  {dashboard.trend_data.length > 0 && (
                    <div className="mt-2">
                      <TrendSparkline
                        data={dashboard.trend_data.map(d => d.total_submissions)}
                        color={chartColors.primary}
                        height={30}
                        width={100}
                      />
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <p className="text-sm text-[#8b5b3d]">Overdue Documents</p>
                  <p className={`text-4xl font-bold mt-4 ${
                    dashboard.overdue_summary.total_overdue > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {dashboard.overdue_summary.total_overdue}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Requires attention</p>
                </div>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SLA Trends Chart */}
              <Card header={
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#103b5b]">SLA Trends</h3>
                  <Button onClick={handleExportSLA} variant="secondary" size="sm">
                    📥 Export
                  </Button>
                </div>
              }>
                {dashboard.trend_data.length > 0 ? (
                  <SLATrendsChart data={dashboard.trend_data} height={300} />
                ) : (
                  <div className="text-center py-12 text-gray-500">No trend data available</div>
                )}
              </Card>

              {/* Document Volume Chart */}
              <Card header={<h3 className="text-lg font-bold text-[#103b5b]">Document Volume</h3>}>
                {dashboard.trend_data.length > 0 ? (
                  <DocumentVolumeChart data={dashboard.trend_data} height={300} />
                ) : (
                  <div className="text-center py-12 text-gray-500">No volume data available</div>
                )}
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Document Type Distribution */}
              <Card header={
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#103b5b]">Document Type Distribution</h3>
                  <Button onClick={handleExportByType} variant="secondary" size="sm">
                    📥 Export
                  </Button>
                </div>
              }>
                {dashboard.by_document_type.length > 0 ? (
                  <DocumentTypePieChart
                    data={dashboard.by_document_type.map(t => ({
                      name: t.document_type.replace(/_/g, ' ').toUpperCase(),
                      value: t.total
                    }))}
                    height={300}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-500">No document type data available</div>
                )}
              </Card>

              {/* Current Setting */}
              <Card header={<h3 className="text-lg font-bold text-[#103b5b]">Current Deadline Setting</h3>}>
                <div className="text-center py-8">
                  <p className="text-6xl font-bold text-[#023D7A]">{dashboard.current_deadline_setting}</p>
                  <p className="text-xl text-[#8b5b3d] mt-2">Business Days</p>
                  <p className="text-sm text-gray-500 mt-2">Plus 1 day grace period</p>
                  <Button
                    onClick={() => navigate('/admin/kyc-settings')}
                    variant="secondary"
                    className="mt-4"
                  >
                    ⚙️ Change Setting
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Overdue Tab */}
        {activeTab === 'overdue' && (
          <Card header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-[#103b5b]">Overdue Documents</h3>
                <Badge variant="error" size="sm">{overdueDocs.length} documents</Badge>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={overdueFilter}
                  onChange={(e) => setOverdueFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                  <option value="warning">Warning</option>
                  <option value="urgent">Urgent</option>
                </select>
                <Button onClick={handleExportOverdue} variant="secondary" size="sm">
                  📥 Export CSV
                </Button>
              </div>
            </div>
          }>
            {overdueDocs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl text-green-600 mb-2">🎉 All Clear!</p>
                <p className="text-[#8b5b3d]">No overdue documents</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-3 text-sm font-semibold text-[#8b5b3d]">Document</th>
                      <th className="text-left p-3 text-sm font-semibold text-[#8b5b3d]">Investor</th>
                      <th className="text-left p-3 text-sm font-semibold text-[#8b5b3d]">Submitted</th>
                      <th className="text-left p-3 text-sm font-semibold text-[#8b5b3d]">Deadline</th>
                      <th className="text-left p-3 text-sm font-semibold text-[#8b5b3d]">Days Overdue</th>
                      <th className="text-left p-3 text-sm font-semibold text-[#8b5b3d]">Status</th>
                      <th className="text-left p-3 text-sm font-semibold text-[#8b5b3d]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overdueDocs.map((doc) => (
                      <tr key={doc.document_id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3">
                          <p className="font-semibold text-[#103b5b] text-sm">
                            {getDocumentTypeLabel(doc.document_type)}
                          </p>
                          <p className="text-xs text-gray-500">#{doc.document_id}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-medium text-sm">{doc.investor_name}</p>
                          <p className="text-xs text-gray-500">{doc.investor_jurisdiction}</p>
                        </td>
                        <td className="p-3 text-sm">{doc.submitted_at ? formatDate(doc.submitted_at) : 'N/A'}</td>
                        <td className="p-3 text-sm">{doc.deadline_at ? formatDate(doc.deadline_at) : 'N/A'}</td>
                        <td className="p-3">
                          <span className={`font-bold ${doc.days_overdue > 5 ? 'text-red-600' : 'text-amber-600'}`}>
                            {doc.days_overdue.toFixed(1)}
                          </span>
                        </td>
                        <td className="p-3">
                          {getStatusBadge(doc.status, doc.escalation_level)}
                        </td>
                        <td className="p-3">
                          <Button
                            onClick={() => navigate(`/compliance/kyc-review?doc=${doc.document_id}`)}
                            variant="secondary"
                            size="sm"
                          >
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* Officers Tab */}
        {activeTab === 'officers' && dashboard && (
          <div className="space-y-6">
            <Card header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#103b5b]">Officer Performance</h3>
                <Button onClick={handleExportOfficers} variant="secondary" size="sm">
                  📥 Export CSV
                </Button>
              </div>
            }>
              {dashboard.officer_performance.length > 0 ? (
                <div className="mb-6">
                  <OfficerPerformanceChart
                    data={dashboard.officer_performance.map(o => ({
                      officer_email: o.officer_email.split('@')[0],
                      total_reviews: o.total_reviews,
                      approved: o.approved,
                      rejected: o.rejected
                    }))}
                    height={300}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">No performance data available</div>
              )}
            </Card>
            
            {/* Officer Performance Table */}
            <Card>
              {dashboard.officer_performance.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No officer data available</div>
              ) : (
                <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-3 text-sm font-semibold text-[#8b5b3d]">Officer</th>
                      <th className="text-center p-3 text-sm font-semibold text-[#8b5b3d]">Total Reviews</th>
                      <th className="text-center p-3 text-sm font-semibold text-[#8b5b3d]">Approved</th>
                      <th className="text-center p-3 text-sm font-semibold text-[#8b5b3d]">Rejected</th>
                      <th className="text-center p-3 text-sm font-semibold text-[#8b5b3d]">Avg Response</th>
                      <th className="text-center p-3 text-sm font-semibold text-[#8b5b3d]">Approval Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.officer_performance.map((officer) => (
                      <tr key={officer.officer_id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3">
                          <p className="font-medium text-sm text-[#103b5b]">{officer.officer_email}</p>
                          <p className="text-xs text-gray-500">ID: {officer.officer_id}</p>
                        </td>
                        <td className="p-3 text-center font-semibold">{officer.total_reviews}</td>
                        <td className="p-3 text-center text-green-600 font-semibold">{officer.approved}</td>
                        <td className="p-3 text-center text-red-600 font-semibold">{officer.rejected}</td>
                        <td className="p-3 text-center">{officer.average_response_days.toFixed(1)} days</td>
                        <td className="p-3 text-center">
                          <span className={`font-bold ${
                            officer.approval_rate >= 80 ? 'text-green-600' :
                            officer.approval_rate >= 60 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {officer.approval_rate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && dashboard && (
          <div className="space-y-6">
            {/* SLA Trends Chart */}
            <Card header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#103b5b]">SLA Trends</h3>
                <Button onClick={handleExportSLA} variant="secondary" size="sm">
                  📥 Export
                </Button>
              </div>
            }>
              {dashboard.trend_data.length > 0 ? (
                <SLATrendsChart data={dashboard.trend_data} height={300} />
              ) : (
                <div className="text-center py-12 text-gray-500">No trend data available</div>
              )}
            </Card>

            {/* Trend Data Table */}
            <Card header={<h3 className="text-lg font-bold text-[#103b5b]">Trend Data</h3>}>
              {dashboard.trend_data.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No trend data available</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-3 text-sm font-semibold text-[#8b5b3d]">Date</th>
                        <th className="text-center p-3 text-sm font-semibold text-[#8b5b3d]">Submissions</th>
                        <th className="text-center p-3 text-sm font-semibold text-[#8b5b3d]">Approved</th>
                        <th className="text-center p-3 text-sm font-semibold text-[#8b5b3d]">Rejected</th>
                        <th className="text-center p-3 text-sm font-semibold text-[#8b5b3d]">Avg Review Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.trend_data.map((point, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-medium text-sm">{point.date}</td>
                          <td className="p-3 text-center font-semibold">{point.total_submissions}</td>
                          <td className="p-3 text-center text-green-600">{point.approved_count}</td>
                          <td className="p-3 text-center text-red-600">{point.rejected_count}</td>
                          <td className="p-3 text-center">{point.average_review_days.toFixed(1)} days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default ComplianceMonitoring;
