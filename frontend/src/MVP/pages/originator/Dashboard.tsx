/**
 * Industrial Operator Dashboard
 *
 * Dashboard for industrial companies to submit assets, track raises, and manage repayments.
 *
 * Route: /originator/dashboard
 *
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import StatsCard from '../../components/StatsCard';
import Badge from '../../components/Badge';
import { databaseAPI, Financing } from '../../../api/database';
import { assetsAPI } from '../../../api/assets';
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

interface CertifiedAsset {
  id: string;
  description: string;
  value: number;
  status: string;
}

const OriginatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [financings, setFinancings] = useState<Financing[]>([]);
  const [certifiedAssets, setCertifiedAssets] = useState<CertifiedAsset[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Map auth user to operator profile ID
        let industrialId: number;

        if (authUser?.id?.includes('originator')) {
          industrialId = 3; // Green Cotton - Operator
        } else if (authUser?.id?.includes('retail')) {
          industrialId = 2; // John Doe - Retail (no financings)
        } else if (authUser?.id?.includes('inst')) {
          industrialId = 1; // Logic Capital - Institutional (no financings)
        } else {
          industrialId = authUser?.id ? parseInt(authUser.id) || 3 : 3;
        }

        // Fetch financings
        const finData = await databaseAPI.getFinancings({ industrial_id: industrialId });
        setFinancings(finData);

        // Fetch certified assets
        try {
          const assetData = await assetsAPI.getAssetCertificates(industrialId);
          const mapped: CertifiedAsset[] = (assetData || []).map((a: any) => ({
            id: a.id?.toString() || a.certificate_id || `ASSET-${a.asset_id || '?'}`,
            description: a.asset_name || a.description || 'Asset Certificate',
            value: a.value || a.amount || 0,
            status: a.status || 'certified',
          }));
          setCertifiedAssets(mapped);
        } catch (assetErr) {
          console.warn('Could not fetch certified assets, using empty list:', assetErr);
          setCertifiedAssets([]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser?.id]);

  // Calculate stats from real data
  const activeFinancings = financings.filter(f => f.status === 'REPAYING' || f.status === 'ACTIVE');
  const fundraisingFinancings = financings.filter(f => f.status === 'PENDING');
  const totalPrincipal = financings.reduce((sum, f) => sum + f.principal, 0);
  const totalRepaid = financings.reduce((sum, f) => sum + f.amount_repaid, 0);
  const outstanding = totalPrincipal - totalRepaid;
  const creditLimit = 10000000; // Would come from operator profile
  const utilizationRate = (outstanding / creditLimit) * 100;

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
              <p className="text-[#8b5b3d] mt-1">Green Cotton SA</p>
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
            value={loading ? 'Loading...' : formatCurrency(creditLimit)}
            color="green"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Outstanding"
            value={loading ? 'Loading...' : formatCurrency(outstanding)}
            color="amber"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            label="Active Financings"
            value={loading ? '-' : activeFinancings.length}
            color="blue"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            label="Fundraising"
            value={loading ? '-' : fundraisingFinancings.length}
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
                        {financing.interestRate && (
                          <p className="text-xs text-[#8b5b3d]">Interest: {financing.interestRate}%</p>
                        )}
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

                    {/* Next Repayment Info for Active Financings */}
                    {financing.status === 'active' && financing.nextRepayment && (
                      <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-800 font-semibold">Next Repayment Due</p>
                        <p className="text-sm text-amber-700">
                          <span className="font-semibold">{formatCurrency(financing.nextRepayment.amount)}</span> due on <span className="font-semibold">{financing.nextRepayment.dueDate}</span>
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate('/industrial-operator/financings')}
                        className="px-4 py-2 bg-[#F3F8FA] border border-[#48A9F0]/30 hover:bg-[#E2E8F0] text-[#023D7A] text-sm font-bold rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                      {financing.status === 'active' && (
                        <button
                          onClick={() => navigate('/industrial-operator/financings')}
                          className="px-4 py-2 bg-[#103b5b] hover:bg-[#0d3352] text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Make Repayment
                        </button>
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
                  <a href="/originator/assets/certificates" className="text-[#00A8A8] hover:text-[#0D7A7A] text-sm font-medium">
                    Manage →
                  </a>
                </div>
              }
            >
              <div className="space-y-3">
                {certifiedAssets.map((asset) => (
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
                  📜 View Certificates & Mint uGT
                </a>
                <a
                  href="/industrial-operator/financings"
                  className="block w-full px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center"
                >
                  💰 My Financings
                </a>
                <button
                  onClick={() => navigate('/industrial-operator/financings')}
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
                  <p className="font-medium text-gray-900">{company.jurisdiction} (Benin)</p>
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
                  <span className="font-medium">{utilizationRate.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-amber-500 h-3 rounded-full transition-all"
                    style={{ width: `${utilizationRate}%` }}
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available</span>
                  <span className="font-semibold text-[#00A8A8]">
                    {formatCurrency(company.availableCapacity)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Next Repayment */}
            {financings.find(f => f.status === 'active' && f.nextRepayment) && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Next Repayment Due</p>
                    <p className="text-xs text-blue-700 mt-1">
                      <span className="font-semibold">{formatCurrency(financings.find(f => f.status === 'active')!.nextRepayment!.amount)}</span> due on <span className="font-semibold">{financings.find(f => f.status === 'active')!.nextRepayment!.dueDate}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            🚀 MVP: Industrial Operator Portal - Testnet Release
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OriginatorDashboard;
