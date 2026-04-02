/**
 * Admin - Asset Management Page
 *
 * Manage tokenized assets and certificates.
 *
 * Route: /admin/assets
 */

import React from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const AssetManagement: React.FC = () => {
  // Mock asset data
  const assets = [
    { id: 'AST-001', name: 'Cotton Bales #001', type: 'Agriculture', value: 500000, status: 'tokenized', originator: 'Green Fields Ltd', tokenAddress: '0x742d...bEb' },
    { id: 'AST-002', name: 'Solar Equipment #001', type: 'Renewable Energy', value: 1200000, status: 'tokenized', originator: 'SolarTech Inc', tokenAddress: '0x8626...199' },
    { id: 'AST-003', name: 'Trade Finance Pool #003', type: 'Trade Finance', value: 750000, status: 'pending', originator: 'Trade Corp', tokenAddress: 'N/A' },
    { id: 'AST-004', name: 'Warehouse Receipt #012', type: 'Agriculture', value: 300000, status: 'tokenized', originator: 'Storage Co', tokenAddress: '0xdD2F...4C0' },
  ];

  const stats = {
    total: assets.length,
    tokenized: assets.filter(a => a.status === 'tokenized').length,
    pending: assets.filter(a => a.status === 'pending').length,
    totalValue: assets.reduce((sum, a) => sum + a.value, 0),
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Asset Management</h1>
              <p className="text-[#8b5b3d] mt-1">Manage tokenized assets and certificates</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total Assets</p>
            <p className="text-2xl font-bold text-[#103b5b]">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Tokenized</p>
            <p className="text-2xl font-bold text-green-600">{stats.tokenized}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total Value</p>
            <p className="text-2xl font-bold text-[#00A8A8]">€{(stats.totalValue / 1000).toFixed(0)}K</p>
          </div>
        </div>

        {/* Assets Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#103b5b]/20">
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Asset ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Value</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Originator</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Token Address</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id} className="border-b border-[#103b5b]/10 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs">{asset.id}</td>
                    <td className="py-3 px-4 font-semibold text-[#103b5b]">{asset.name}</td>
                    <td className="py-3 px-4">
                      <Badge variant="info" size="sm">{asset.type}</Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#103b5b]">€{asset.value.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-600">{asset.originator}</td>
                    <td className="py-3 px-4">
                      <Badge variant={asset.status === 'tokenized' ? 'success' : 'warning'} size="sm">
                        {asset.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">{asset.tokenAddress}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-[#023D7A] hover:bg-[#0d3352] text-white text-xs font-bold rounded transition-colors">
                          View
                        </button>
                        <button className="px-3 py-1 border border-[#48A9F0]/30 hover:bg-[#F3F8FA] text-[#023D7A] text-xs font-bold rounded transition-colors">
                          Edit
                        </button>
                      </div>
                    </td>
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

export default AssetManagement;
