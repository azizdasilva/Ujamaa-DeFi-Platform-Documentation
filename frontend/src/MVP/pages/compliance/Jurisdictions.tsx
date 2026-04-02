/**
 * Compliance - Jurisdictions Management Page
 *
 * Manage allowed and blocked jurisdictions for investor onboarding.
 *
 * Route: /compliance/jurisdictions
 */

import React, { useState } from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const Jurisdictions: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'allowed' | 'blocked'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock jurisdiction data
  const jurisdictions = [
    { code: 'MU', name: 'Mauritius', status: 'allowed', category: 'africa', notes: 'Primary jurisdiction, full access' },
    { code: 'KE', name: 'Kenya', status: 'allowed', category: 'africa', notes: 'East African Community member' },
    { code: 'NG', name: 'Nigeria', status: 'allowed', category: 'africa', notes: 'Largest African economy' },
    { code: 'ZA', name: 'South Africa', status: 'allowed', category: 'africa', notes: 'Advanced financial markets' },
    { code: 'GH', name: 'Ghana', status: 'allowed', category: 'africa', notes: 'Stable democracy' },
    { code: 'RW', name: 'Rwanda', status: 'allowed', category: 'africa', notes: 'Business-friendly reforms' },
    { code: 'TZ', name: 'Tanzania', status: 'allowed', category: 'africa', notes: 'East African Community member' },
    { code: 'UG', name: 'Uganda', status: 'allowed', category: 'africa', notes: 'East African Community member' },
    { code: 'ET', name: 'Ethiopia', status: 'allowed', category: 'africa', notes: 'Fast-growing economy' },
    { code: 'GB', name: 'United Kingdom', status: 'allowed', category: 'international', notes: 'Major financial center' },
    { code: 'FR', name: 'France', status: 'allowed', category: 'international', notes: 'EU member state' },
    { code: 'DE', name: 'Germany', status: 'allowed', category: 'international', notes: 'EU member state' },
    { code: 'AE', name: 'United Arab Emirates', status: 'allowed', category: 'international', notes: 'Middle East hub' },
    { code: 'SG', name: 'Singapore', status: 'allowed', category: 'international', notes: 'Asian financial hub' },
    { code: 'US', name: 'United States', status: 'blocked', category: 'blocked', notes: 'SEC regulations - not available', sanctionsList: 'N/A - Regulatory' },
    { code: 'KP', name: 'North Korea', status: 'blocked', category: 'blocked', notes: 'UN sanctions', sanctionsList: 'UN Sanctions List' },
    { code: 'IR', name: 'Iran', status: 'blocked', category: 'blocked', notes: 'OFAC sanctions', sanctionsList: 'OFAC SDN List' },
    { code: 'SY', name: 'Syria', status: 'blocked', category: 'blocked', notes: 'EU sanctions', sanctionsList: 'EU Sanctions List' },
    { code: 'CU', name: 'Cuba', status: 'blocked', category: 'blocked', notes: 'US OFAC sanctions', sanctionsList: 'OFAC SDN List' },
    { code: 'RU', name: 'Russia', status: 'blocked', category: 'blocked', notes: 'International sanctions', sanctionsList: 'Multiple Sanctions Lists' },
    { code: 'BY', name: 'Belarus', status: 'blocked', category: 'blocked', notes: 'EU/US sanctions', sanctionsList: 'EU/US Sanctions Lists' },
    { code: 'MM', name: 'Myanmar', status: 'blocked', category: 'blocked', notes: 'Targeted sanctions', sanctionsList: 'OFAC SDN List' },
    { code: 'VE', name: 'Venezuela', status: 'blocked', category: 'blocked', notes: 'US OFAC sanctions', sanctionsList: 'OFAC SDN List' },
    { code: 'SD', name: 'Sudan', status: 'blocked', category: 'blocked', notes: 'US OFAC sanctions', sanctionsList: 'OFAC SDN List' },
  ];

  const filteredJurisdictions = jurisdictions.filter(j => {
    if (filter === 'all') return true;
    if (filter === 'allowed') return j.status === 'allowed';
    if (filter === 'blocked') return j.status === 'blocked';
    return true;
  });

  const stats = {
    total: jurisdictions.length,
    allowed: jurisdictions.filter(j => j.status === 'allowed').length,
    blocked: jurisdictions.filter(j => j.status === 'blocked').length,
    africa: jurisdictions.filter(j => j.category === 'africa' && j.status === 'allowed').length,
    international: jurisdictions.filter(j => j.category === 'international' && j.status === 'allowed').length,
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Jurisdiction Management</h1>
              <p className="text-[#8b5b3d] mt-1">Manage allowed and blocked jurisdictions</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowAddModal(true)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Jurisdiction
              </Button>
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total</p>
            <p className="text-2xl font-bold text-[#103b5b]">{stats.total}</p>
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
            <p className="text-sm text-[#8b5b3d]">Africa</p>
            <p className="text-2xl font-bold text-[#00A8A8]">{stats.africa}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">International</p>
            <p className="text-2xl font-bold text-[#023D7A]">{stats.international}</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-[#023D7A] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({jurisdictions.length})
              </button>
              <button
                onClick={() => setFilter('allowed')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'allowed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Allowed ({stats.allowed})
              </button>
              <button
                onClick={() => setFilter('blocked')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'blocked'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Blocked ({stats.blocked})
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search jurisdictions..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
              />
              <button className="p-2 bg-[#023D7A] hover:bg-[#0d3352] text-white rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </Card>

        {/* Jurisdictions Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#103b5b]/20">
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Sanctions List</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Notes</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJurisdictions.map((jurisdiction) => (
                  <tr key={jurisdiction.code} className="border-b border-[#103b5b]/10 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs font-bold text-[#103b5b]">{jurisdiction.code}</td>
                    <td className="py-3 px-4 font-semibold text-[#103b5b]">{jurisdiction.name}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-gray-600 capitalize">{jurisdiction.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={jurisdiction.status === 'allowed' ? 'success' : 'danger'}
                        size="sm"
                      >
                        {jurisdiction.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {jurisdiction.sanctionsList ? (
                        <Badge variant="error" size="sm">LISTED</Badge>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-xs text-gray-600">
                      {jurisdiction.notes}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-[#023D7A] hover:bg-[#0d3352] text-white text-xs font-bold rounded transition-colors">
                          Edit
                        </button>
                        {jurisdiction.status === 'blocked' ? (
                          <button
                            onClick={() => alert(`🚀 MVP TESTNET: Unblock ${jurisdiction.name}\n\nIn production, this will:\n• Update JurisdictionCompliance smart contract\n• Allow investors from this jurisdiction\n• Log compliance event`)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded transition-colors"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => alert(`🚀 MVP TESTNET: Block ${jurisdiction.name}\n\nIn production, this will:\n• Update JurisdictionCompliance smart contract\n• Block investors from this jurisdiction\n• Log compliance event`)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-colors"
                          >
                            Block
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Information Notice */}
        <Card className="mt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#023D7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-[#103b5b] mb-2">Jurisdiction Management Guidelines</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>African jurisdictions:</strong> Prioritized for inclusion per Ujamaa's mission</li>
                <li>• <strong>International jurisdictions:</strong> Added based on regulatory compliance and demand</li>
                <li>• <strong>Blocked jurisdictions:</strong> Must be on recognized sanctions lists or have regulatory restrictions</li>
                <li>• <strong>Changes require:</strong> Senior compliance officer approval and documentation</li>
                <li>• <strong>Smart contract updates:</strong> Jurisdiction changes update the JurisdictionCompliance contract</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Sanctions Lists Reference */}
        <Card className="mt-6">
          <h3 className="font-bold text-[#103b5b] mb-4">Sanctions Lists Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-[#103b5b] mb-2">UN Sanctions List</h4>
              <p className="text-sm text-gray-600">United Nations Security Council Consolidated List</p>
              <a href="#" className="text-xs text-[#00A8A8] hover:text-[#0D7A7A] mt-2 inline-block">View List →</a>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-[#103b5b] mb-2">OFAC SDN List</h4>
              <p className="text-sm text-gray-600">US Treasury Office of Foreign Assets Control - Specially Designated Nationals</p>
              <a href="#" className="text-xs text-[#00A8A8] hover:text-[#0D7A7A] mt-2 inline-block">View List →</a>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-[#103b5b] mb-2">EU Sanctions List</h4>
              <p className="text-sm text-gray-600">European Union Financial Sanctions Database</p>
              <a href="#" className="text-xs text-[#00A8A8] hover:text-[#0D7A7A] mt-2 inline-block">View List →</a>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-[#103b5b] mb-2">UK Sanctions List</h4>
              <p className="text-sm text-gray-600">UK Office of Financial Sanctions Implementation</p>
              <a href="#" className="text-xs text-[#00A8A8] hover:text-[#0D7A7A] mt-2 inline-block">View List →</a>
            </div>
          </div>
        </Card>
      </main>

      {/* Add Jurisdiction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
          <div className="bg-white rounded-2xl max-w-lg w-full mx-4 p-6 animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#103b5b]">Add Jurisdiction</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country Code</label>
                <input
                  type="text"
                  placeholder="e.g., MU"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country Name</label>
                <input
                  type="text"
                  placeholder="e.g., Mauritius"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]">
                  <option value="africa">Africa</option>
                  <option value="international">International</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]">
                  <option value="allowed">Allowed</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <textarea
                  placeholder="Additional information about this jurisdiction..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8] min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setShowAddModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  alert('🚀 MVP TESTNET: Add jurisdiction feature\n\nIn production, this will:\n• Add jurisdiction to database\n• Update JurisdictionCompliance contract\n• Log compliance event');
                  setShowAddModal(false);
                }}
                className="flex-1"
              >
                Add Jurisdiction
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jurisdictions;
