/**
 * Regulator Dashboard
 * 
 * Read-only dashboard for regulators to monitor platform activity and compliance.
 * 
 * Route: /regulator/dashboard
 * 
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import StatsCard from '../../components/StatsCard';
import Badge from '../../components/Badge';

const RegulatorDashboard: React.FC = () => {
  // Mock data for demo
  const stats = {
    totalVolume: 205_000_000,
    totalInvestors: 156,
    compliantTransactions: 1230,
    flaggedTransactions: 4,
  };

  const complianceMetrics = [
    { name: 'KYC Completion Rate', value: '98.5%', status: 'good' },
    { name: 'KYB Completion Rate', value: '100%', status: 'good' },
    { name: 'Blocked Jurisdictions', value: '0 violations', status: 'good' },
    { name: 'Transaction Monitoring', value: '100% screened', status: 'good' },
  ];

  const recentActivity = [
    { id: 'ACT-001', type: 'investment', description: '€500,000 invested in Pool Industry', timestamp: '2026-03-18 14:30', compliant: true },
    { id: 'ACT-002', type: 'kyc', description: 'KYC approved for Logic Capital', timestamp: '2026-03-18 13:15', compliant: true },
    { id: 'ACT-003', type: 'redemption', description: '€100,000 redeemed from Pool Agriculture', timestamp: '2026-03-18 11:45', compliant: true },
    { id: 'ACT-004', type: 'flagged', description: 'Large transaction flagged for review', timestamp: '2026-03-18 10:20', compliant: false },
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
    <div className="min-h-screen bg-[#F9F6ED]">
      {/* MVP Banner */}
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Regulator Dashboard</h1>
              <p className="text-[#8b5b3d] mt-1">Read-Only Compliance Monitoring</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="info" size="md">👁️ Read-Only Access</Badge>
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </header>

      {/* Read-Only Notice */}
      <div className="bg-[#103b5b]/5 border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#103b5b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-[#8b5b3d]">
              <strong className="text-[#103b5b]">Read-Only Access:</strong> This dashboard provides read-only access to platform data for regulatory oversight. No actions can be performed.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Total Platform Volume"
            value={formatCurrency(stats.totalVolume)}
            color="green"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            label="Total Investors"
            value={stats.totalInvestors}
            color="blue"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Compliant Transactions"
            value={stats.compliantTransactions}
            color="green"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            label="Flagged Transactions"
            value={stats.flaggedTransactions}
            color="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Compliance Metrics */}
            <Card
              header={
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Compliance Metrics</h2>
                  <a href="/regulator/compliance" className="text-[#00A8A8] hover:text-[#0D7A7A] text-sm font-medium">
                    Full Report →
                  </a>
                </div>
              }
            >
              <div className="grid grid-cols-2 gap-4">
                {complianceMetrics.map((metric) => (
                  <div
                    key={metric.name}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="text-sm text-gray-600 mb-2">{metric.name}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <Badge variant={metric.status === 'good' ? 'success' : 'error'} size="sm">
                        ✓
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card
              header={
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Recent Platform Activity</h2>
                  <a href="/regulator/activity" className="text-[#00A8A8] hover:text-[#0D7A7A] text-sm font-medium">
                    View All →
                  </a>
                </div>
              }
            >
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.compliant ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <div>
                        <p className="font-mono text-xs text-gray-500">{activity.id}</p>
                        <p className="font-medium text-gray-900">{activity.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={activity.compliant ? 'success' : 'warning'}
                        size="sm"
                      >
                        {activity.compliant ? 'COMPLIANT' : 'FLAGGED'}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Jurisdiction Analysis */}
            <Card
              header={
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Jurisdiction Analysis</h2>
                  <a href="/regulator/jurisdictions" className="text-[#00A8A8] hover:text-[#0D7A7A] text-sm font-medium">
                    Detailed View →
                  </a>
                </div>
              }
            >
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Allowed Jurisdictions</span>
                    <span className="font-semibold">14 countries</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Blocked Jurisdictions</span>
                    <span className="font-semibold">12 countries</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }} />
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    All transactions are screened against OFAC, UN, EU, and FATF sanctions lists.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Read-Only Notice */}
            <Card>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <div>
                  <h3 className="font-bold text-gray-900">Regulatory Access</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    This portal provides real-time read-only access to platform data for regulatory oversight purposes.
                  </p>
                </div>
              </div>
            </Card>

            {/* Export Options */}
            <Card header={<h2 className="text-xl font-bold text-gray-900">Export Data</h2>}>
              <div className="space-y-3">
                <a
                  href="/regulator/export/transactions"
                  className="block w-full px-4 py-3 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-colors text-center"
                >
                  📊 Export Transactions
                </a>
                <a
                  href="/regulator/export/compliance"
                  className="block w-full px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center"
                >
                  📋 Export Compliance Report
                </a>
                <a
                  href="/regulator/export/investors"
                  className="block w-full px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center"
                >
                  👥 Export Investor List
                </a>
              </div>
            </Card>

            {/* Regulatory Framework */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">Regulatory Framework</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">MiCA (EU)</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">FATF Recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">OFAC Sanctions</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">GDPR Compliance</span>
                </div>
              </div>
            </Card>

            {/* Contact */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-purple-900">Need Assistance?</p>
                  <p className="text-xs text-purple-700 mt-1">
                    Contact the compliance team for detailed reports or investigations.
                  </p>
                  <a
                    href="/regulator/contact"
                    className="inline-block mt-2 text-xs font-medium text-purple-600 hover:text-purple-700 underline"
                  >
                    Contact Compliance →
                  </a>
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
            🚀 MVP: Regulator Portal - Testnet Release • Polygon Amoy (Chain ID: 80002)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RegulatorDashboard;
