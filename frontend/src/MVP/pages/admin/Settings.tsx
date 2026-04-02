/**
 * Admin - Settings Page
 *
 * Platform configuration and settings.
 *
 * Route: /admin/settings
 */

import React, { useState } from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'fees' | 'limits' | 'compliance'>('general');

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Platform Settings</h1>
              <p className="text-[#8b5b3d] mt-1">Configure platform parameters</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <Card className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'general'
                  ? 'text-[#00A8A8] border-b-2 border-[#00A8A8]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'fees'
                  ? 'text-[#00A8A8] border-b-2 border-[#00A8A8]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Fees
            </button>
            <button
              onClick={() => setActiveTab('limits')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'limits'
                  ? 'text-[#00A8A8] border-b-2 border-[#00A8A8]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Limits
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'compliance'
                  ? 'text-[#00A8A8] border-b-2 border-[#00A8A8]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Compliance
            </button>
          </div>
        </Card>

        {/* Tab Content */}
        {activeTab === 'general' && (
          <Card>
            <h3 className="text-xl font-bold text-[#103b5b] mb-6">General Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Platform Name</label>
                <input
                  type="text"
                  defaultValue="Ujamaa DeFi Platform"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Support Email</label>
                <input
                  type="email"
                  defaultValue="support@ujamaa-defi.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Network</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]">
                  <option value="testnet">Polygon Amoy Testnet</option>
                  <option value="mainnet">Polygon Mainnet</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Current: Testnet Mode (No Real Funds)</p>
              </div>
              <div className="pt-4">
                <Button variant="primary" size="lg">Save Changes</Button>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'fees' && (
          <Card>
            <h3 className="text-xl font-bold text-[#103b5b] mb-6">Fee Configuration</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Management Fee (%)</label>
                <input
                  type="number"
                  defaultValue="2.0"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                />
                <p className="text-xs text-gray-500 mt-1">Annual management fee charged on AUM</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Performance Fee (%)</label>
                <input
                  type="number"
                  defaultValue="20.0"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                />
                <p className="text-xs text-gray-500 mt-1">Performance fee on returns above hurdle rate</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hurdle Rate (%)</label>
                <input
                  type="number"
                  defaultValue="5.0"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum return before performance fee applies</p>
              </div>
              <div className="pt-4">
                <Button variant="primary" size="lg">Save Fee Settings</Button>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'limits' && (
          <Card>
            <h3 className="text-xl font-bold text-[#103b5b] mb-6">Investment Limits</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Deposit (€)</label>
                <input
                  type="number"
                  defaultValue="1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Deposit (€)</label>
                <input
                  type="number"
                  defaultValue="1000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Withdrawal Limit (€)</label>
                <input
                  type="number"
                  defaultValue="100000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Institutional Minimum (€)</label>
                <input
                  type="number"
                  defaultValue="100000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                />
              </div>
              <div className="pt-4">
                <Button variant="primary" size="lg">Save Limits</Button>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'compliance' && (
          <Card>
            <h3 className="text-xl font-bold text-[#103b5b] mb-6">Compliance Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">KYC Required</p>
                  <p className="text-sm text-gray-500">Require KYC verification for all investors</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-[#00A8A8]" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Accreditation Required</p>
                  <p className="text-sm text-gray-500">Require accreditation for institutional investors</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-[#00A8A8]" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Auto-approve Low Risk</p>
                  <p className="text-sm text-gray-500">Automatically approve low-risk jurisdictions</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-[#00A8A8]" />
              </div>
              <div className="pt-4">
                <Button variant="primary" size="lg">Save Compliance Settings</Button>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Settings;
