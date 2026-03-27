/**
 * Industrial Operator Dashboard
 *
 * Dashboard for industrial companies to submit assets, track raises, and manage repayments.
 *
 * Route: /originator/dashboard
 *
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import StatsCard from '../../components/StatsCard';
import Badge from '../../components/Badge';

const OriginatorDashboard: React.FC = () => {
  // Mock data for demo
  const company = {
    name: 'GDIZ (Benin) Industries (Demo)',
    jurisdiction: 'MU',
    status: 'VERIFIED',
    creditLimit: 5_000_000,
    outstanding: 2_000_000,
  };

  const financings = [
    { id: 1, pool: 'Pool Industry', amount: 2_000_000, raised: 2_000_000, status: 'active', progress: 100 },
    { id: 2, pool: 'Pool Agriculture', amount: 1_500_000, raised: 750_000, status: 'fundraising', progress: 50 },
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
              <h1 className="text-3xl font-bold text-[#103b5b]">Industrial Operator Dashboard</h1>
              <p className="text-[#8b5b3d] mt-1">GDIZ (Benin) Industries (Demo)</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success" size="md">✓ Verified</Badge>
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Credit Limit"
            value={formatCurrency(company.creditLimit)}
            color="green"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Outstanding"
            value={formatCurrency(company.outstanding)}
            color="amber"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            label="Active Financings"
            value={financings.filter(f => f.status === 'active').length}
            color="blue"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            label="Fundraising"
            value={financings.filter(f => f.status === 'fundraising').length}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Financings */}
            <Card
              header={
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#103b5b]">Active Financings</h2>
                  <a href="/industrial-operator/financings" className="text-[#d57028] hover:text-[#c05a1e] text-sm font-medium">
                    View All →
                  </a>
                </div>
              }
            >
              <div className="space-y-4">
                {financings.map((financing) => (
                  <div
                    key={financing.id}
                    className="p-4 bg-[#F9F6ED] rounded-lg border border-[#103b5b]/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-[#103b5b]">Financing #{financing.id}</h3>
                        <p className="text-sm text-[#8b5b3d]">{financing.pool}</p>
                      </div>
                      <Badge
                        variant={financing.status === 'active' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {financing.status === 'active' ? 'ACTIVE' : 'FUNDRAISING'}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#8b5b3d]">Raised</span>
                        <span className="font-medium text-[#103b5b]">{financing.progress}%</span>
                      </div>
                      <div className="w-full bg-[#103b5b]/10 rounded-full h-2">
                        <div
                          className="bg-[#d57028] h-2 rounded-full transition-all"
                          style={{ width: `${financing.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[#8b5b3d] mt-1">
                        <span>{formatCurrency(financing.raised)} raised</span>
                        <span>{formatCurrency(financing.amount)} target</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`/industrial-operator/financings/${financing.id}`}
                        className="px-4 py-2 bg-[#F3F8FA] border border-[#48A9F0]/30 hover:bg-[#E2E8F0] text-[#023D7A] text-sm font-bold rounded-lg transition-colors"
                      >
                        View Details
                      </a>
                      {financing.status === 'active' && (
                        <a
                          href={`/industrial-operator/financings/${financing.id}/repay`}
                          className="px-4 py-2 bg-[#103b5b] hover:bg-[#0d3352] text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Make Repayment
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Certified Assets */}
            <Card
              header={
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Certified Assets</h2>
                  <a href="/originator/assets" className="text-[#00A8A8] hover:text-[#0D7A7A] text-sm font-medium">
                    Manage →
                  </a>
                </div>
              }
            >
              <div className="space-y-3">
                {[
                  { id: 'CERT-001', description: '1000 cotton bales, Grade A', value: 500_000, status: 'certified' },
                  { id: 'CERT-002', description: '500 tons cocoa beans', value: 350_000, status: 'certified' },
                  { id: 'CERT-003', description: '2000 units manufactured goods', value: 800_000, status: 'pending' },
                ].map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-mono text-sm font-semibold text-gray-900">{asset.id}</p>
                      <p className="text-sm text-gray-600">{asset.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(asset.value)}</p>
                      <Badge
                        variant={asset.status === 'certified' ? 'success' : 'info'}
                        size="sm"
                      >
                        {asset.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card header={<h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>}>
              <div className="space-y-3">
                <a
                  href="/originator/assets/submit"
                  className="block w-full px-4 py-3 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-colors text-center"
                >
                  📦 Submit Asset for Tokenization
                </a>
                <a
                  href="/originator/assets/certificates"
                  className="block w-full px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center"
                >
                  📜 View Certificates & Mint UGT
                </a>
                <a
                  href="/industrial-operator/financings"
                  className="block w-full px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center"
                >
                  💰 My Financings
                </a>
                <button
                  onClick={() => alert('🚀 MVP TESTNET: Make Repayment coming in production. This feature will allow you to make loan repayments directly from your dashboard.')}
                  className="block w-full px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center"
                >
                  💳 Make Repayment
                </button>
              </div>
            </Card>

            {/* Company Info */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">Company Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Company Name</span>
                  <p className="font-medium text-gray-900">{company.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Jurisdiction</span>
                  <p className="font-medium text-gray-900">{company.jurisdiction} (Mauritius)</p>
                </div>
                <div>
                  <span className="text-gray-500">Verification Status</span>
                  <p className="font-medium text-[#00A8A8]">✓ KYB Approved</p>
                </div>
                <div>
                  <span className="text-gray-500">GDIZ (Benin) Certified</span>
                  <p className="font-medium text-[#00A8A8]">✓ Yes</p>
                </div>
              </div>
            </Card>

            {/* Available Capacity */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">Available Capacity</h3>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Used</span>
                  <span className="font-medium">{(company.outstanding / company.creditLimit * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-amber-500 h-3 rounded-full transition-all"
                    style={{ width: `${(company.outstanding / company.creditLimit * 100)}%` }}
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available</span>
                  <span className="font-semibold text-[#00A8A8]">
                    {formatCurrency(company.creditLimit - company.outstanding)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Next Repayment */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900">Next Repayment Due</p>
                  <p className="text-xs text-blue-700 mt-1">
                    <span className="font-semibold">€50,000</span> due on <span className="font-semibold">April 15, 2026</span>
                  </p>
                  <a
                    href="/originator/repayments"
                    className="inline-block mt-2 text-xs font-medium text-blue-600 hover:text-blue-700 underline"
                  >
                    Make payment →
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
            🚀 MVP: Industrial Operator Portal - Testnet Release • Polygon Amoy (Chain ID: 80002)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OriginatorDashboard;
