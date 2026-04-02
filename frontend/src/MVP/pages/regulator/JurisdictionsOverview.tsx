/**
 * Regulator - Jurisdictions Overview Page
 *
 * View jurisdiction compliance and investor distribution.
 *
 * Route: /regulator/jurisdictions
 */

import React from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';

const JurisdictionsOverview: React.FC = () => {
  const jurisdictions = [
    { code: 'MU', name: 'Mauritius', investors: 45, volume: 2500000, status: 'allowed', category: 'africa' },
    { code: 'KE', name: 'Kenya', investors: 32, volume: 1200000, status: 'allowed', category: 'africa' },
    { code: 'NG', name: 'Nigeria', investors: 28, volume: 980000, status: 'allowed', category: 'africa' },
    { code: 'ZA', name: 'South Africa', investors: 22, volume: 1800000, status: 'allowed', category: 'africa' },
    { code: 'GH', name: 'Ghana', investors: 15, volume: 450000, status: 'allowed', category: 'africa' },
    { code: 'RW', name: 'Rwanda', investors: 12, volume: 380000, status: 'allowed', category: 'africa' },
    { code: 'GB', name: 'United Kingdom', investors: 18, volume: 3200000, status: 'allowed', category: 'international' },
    { code: 'FR', name: 'France', investors: 14, volume: 2100000, status: 'allowed', category: 'international' },
    { code: 'AE', name: 'United Arab Emirates', investors: 10, volume: 1500000, status: 'allowed', category: 'international' },
    { code: 'US', name: 'United States', investors: 0, volume: 0, status: 'blocked', category: 'blocked' },
    { code: 'KP', name: 'North Korea', investors: 0, volume: 0, status: 'blocked', category: 'blocked' },
    { code: 'IR', name: 'Iran', investors: 0, volume: 0, status: 'blocked', category: 'blocked' },
  ];

  const stats = {
    totalJurisdictions: jurisdictions.length,
    allowed: jurisdictions.filter(j => j.status === 'allowed').length,
    blocked: jurisdictions.filter(j => j.status === 'blocked').length,
    totalInvestors: jurisdictions.reduce((sum, j) => sum + j.investors, 0),
    totalVolume: jurisdictions.reduce((sum, j) => sum + j.volume, 0),
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Jurisdictions Overview</h1>
              <p className="text-[#8b5b3d] mt-1">Investor distribution and compliance by jurisdiction</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Jurisdictions</p>
            <p className="text-2xl font-bold text-[#103b5b]">{stats.totalJurisdictions}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Allowed</p>
            <p className="text-2xl font-bold text-green-600">{stats.allowed}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Blocked</p>
            <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total Investors</p>
            <p className="text-2xl font-bold text-[#00A8A8]">{stats.totalInvestors}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total Volume</p>
            <p className="text-2xl font-bold text-[#023D7A]">€{(stats.totalVolume / 1000000).toFixed(2)}M</p>
          </div>
        </div>

        {/* Africa Jurisdictions */}
        <Card className="mb-6">
          <h3 className="text-lg font-bold text-[#103b5b] mb-4">African Jurisdictions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#103b5b]/20">
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Country</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Investors</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Volume</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Market Share</th>
                </tr>
              </thead>
              <tbody>
                {jurisdictions.filter(j => j.category === 'africa').map((j) => (
                  <tr key={j.code} className="border-b border-[#103b5b]/10">
                    <td className="py-3 px-4 font-mono text-xs">{j.code}</td>
                    <td className="py-3 px-4 font-semibold text-[#103b5b]">{j.name}</td>
                    <td className="py-3 px-4">
                      <Badge variant="success" size="sm">ALLOWED</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{j.investors}</td>
                    <td className="py-3 px-4 font-semibold text-[#103b5b]">€{(j.volume / 1000).toFixed(0)}K</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#00A8A8] rounded-full"
                            style={{ width: `${(j.volume / stats.totalVolume) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{((j.volume / stats.totalVolume) * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* International Jurisdictions */}
        <Card className="mb-6">
          <h3 className="text-lg font-bold text-[#103b5b] mb-4">International Jurisdictions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#103b5b]/20">
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Country</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Investors</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Volume</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Market Share</th>
                </tr>
              </thead>
              <tbody>
                {jurisdictions.filter(j => j.category === 'international').map((j) => (
                  <tr key={j.code} className="border-b border-[#103b5b]/10">
                    <td className="py-3 px-4 font-mono text-xs">{j.code}</td>
                    <td className="py-3 px-4 font-semibold text-[#103b5b]">{j.name}</td>
                    <td className="py-3 px-4">
                      <Badge variant="success" size="sm">ALLOWED</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{j.investors}</td>
                    <td className="py-3 px-4 font-semibold text-[#103b5b]">€{(j.volume / 1000).toFixed(0)}K</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#023D7A] rounded-full"
                            style={{ width: `${(j.volume / stats.totalVolume) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{((j.volume / stats.totalVolume) * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Blocked Jurisdictions */}
        <Card>
          <h3 className="text-lg font-bold text-[#103b5b] mb-4">Blocked Jurisdictions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#103b5b]/20">
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Country</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Reason</th>
                </tr>
              </thead>
              <tbody>
                {jurisdictions.filter(j => j.category === 'blocked').map((j) => (
                  <tr key={j.code} className="border-b border-[#103b5b]/10">
                    <td className="py-3 px-4 font-mono text-xs">{j.code}</td>
                    <td className="py-3 px-4 font-semibold text-[#103b5b]">{j.name}</td>
                    <td className="py-3 px-4">
                      <Badge variant="error" size="sm">BLOCKED</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">Sanctions / Regulatory restrictions</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default JurisdictionsOverview;
