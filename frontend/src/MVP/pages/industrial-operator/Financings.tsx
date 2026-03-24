/**
 * Industrial Operator - Financings Page
 * 
 * Display all financings for an industrial operator.
 * 
 * Route: /industrial-operator/financings
 */

import React from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import StatsCard from '../../components/StatsCard';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const IndustrialOperatorFinancings: React.FC = () => {
  // Mock financings data
  const stats = {
    totalFinanced: 3500000,
    outstanding: 2000000,
    repaid: 1500000,
    activeFinancings: 3,
    averageRate: 11.5,
  };

  const financings = [
    {
      id: 1,
      pool: 'Pool Industry',
      assetType: 'Manufacturing Equipment',
      amount: 2000000,
      raised: 2000000,
      rate: 11.5,
      status: 'active',
      startDate: '2025-09-21',
      maturityDate: '2026-09-21',
      progress: 100,
      repaymentsMade: 8,
      totalRepayments: 12,
    },
    {
      id: 2,
      pool: 'Pool Agriculture',
      assetType: 'Coffee Export Inventory',
      amount: 1500000,
      raised: 750000,
      rate: 13.0,
      status: 'fundraising',
      startDate: '2026-03-01',
      maturityDate: '2026-09-01',
      progress: 50,
      repaymentsMade: 0,
      totalRepayments: 6,
    },
    {
      id: 3,
      pool: 'Pool Trade Finance',
      assetType: 'Invoice Receivables',
      amount: 500000,
      raised: 500000,
      rate: 9.5,
      status: 'completed',
      startDate: '2025-06-01',
      maturityDate: '2026-01-01',
      progress: 100,
      repaymentsMade: 7,
      totalRepayments: 7,
    },
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
              <h1 className="text-3xl font-bold text-[#103b5b]">My Financings</h1>
              <p className="text-[#8b5b3d] mt-1">Track your asset financings and repayments</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Total Financed"
            value={formatCurrency(stats.totalFinanced)}
            color="green"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Outstanding"
            value={formatCurrency(stats.outstanding)}
            color="amber"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Repaid"
            value={formatCurrency(stats.repaid)}
            color="blue"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            label="Active"
            value={stats.activeFinancings}
            color="purple"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              </svg>
            }
            label="Avg Rate"
            value={`${stats.averageRate}%`}
            color="green"
            subValue="APR"
          />
        </div>

        {/* Financings List */}
        <Card header={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#103b5b]">All Financings</h2>
            <a href="/industrial-operator/assets/submit">
              <Button variant="primary" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Financing
              </Button>
            </a>
          </div>
        }>
          <div className="space-y-4">
            {financings.map((financing) => (
              <div key={financing.id} className="p-4 bg-[#F9F6ED] rounded-lg border border-[#103b5b]/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-[#103b5b]">Financing #{financing.id}</h3>
                      <Badge 
                        variant={
                          financing.status === 'active' ? 'success' :
                          financing.status === 'fundraising' ? 'warning' :
                          'secondary'
                        }
                        size="sm"
                      >
                        {financing.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#8b5b3d]">{financing.pool} • {financing.assetType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#8b5b3d]">Amount</p>
                    <p className="font-bold text-[#103b5b]">{formatCurrency(financing.amount)}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#8b5b3d]">
                      {financing.status === 'fundraising' ? 'Fundraising Progress' : 'Repayment Progress'}
                    </span>
                    <span className="font-medium text-[#103b5b]">{financing.progress}%</span>
                  </div>
                  <div className="w-full bg-[#103b5b]/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        financing.status === 'fundraising' ? 'bg-[#00A8A8]' :
                        financing.status === 'completed' ? 'bg-green-500' :
                        'bg-[#d57028]'
                      }`}
                      style={{ width: `${financing.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-[#8b5b3d]">Interest Rate</p>
                    <p className="font-semibold text-[#103b5b]">{financing.rate}% APR</p>
                  </div>
                  <div>
                    <p className="text-[#8b5b3d]">Start Date</p>
                    <p className="font-medium text-[#103b5b]">{financing.startDate}</p>
                  </div>
                  <div>
                    <p className="text-[#8b5b3d]">Maturity</p>
                    <p className="font-medium text-[#103b5b]">{financing.maturityDate}</p>
                  </div>
                  <div>
                    <p className="text-[#8b5b3d]">Repayments</p>
                    <p className="font-medium text-[#103b5b]">{financing.repaymentsMade}/{financing.totalRepayments}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  {financing.status === 'active' && (
                    <a href={`/industrial-operator/repayments/${financing.id}`}>
                      <Button variant="primary" size="sm">Make Repayment</Button>
                    </a>
                  )}
                  {financing.status === 'fundraising' && (
                    <a href={`/industrial-operator/financings/${financing.id}`}>
                      <Button variant="secondary" size="sm">View Details</Button>
                    </a>
                  )}
                  {financing.status === 'completed' && (
                    <a href={`/industrial-operator/certificates/${financing.id}`}>
                      <Button variant="secondary" size="sm">View Certificate</Button>
                    </a>
                  )}
                  <a href={`/industrial-operator/financings/${financing.id}/details`}>
                    <Button variant="outline" size="sm">Full Details</Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default IndustrialOperatorFinancings;
