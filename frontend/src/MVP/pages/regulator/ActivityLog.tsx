/**
 * Regulator - Activity Log Page
 *
 * View platform activity and audit trail.
 *
 * Route: /regulator/activity
 */

import React, { useState } from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';

const ActivityLog: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'investment' | 'compliance' | 'user' | 'contract'>('all');

  const activities = [
    { id: 'ACT-001', type: 'investment', action: 'Investment completed', user: 'john@investor.com', details: '€500,000 in Pool Industry', timestamp: '2026-04-02 14:32:15' },
    { id: 'ACT-002', type: 'compliance', action: 'KYC approved', user: 'compliance@ujamaa-defi.com', details: 'Investor INV-045 verified', timestamp: '2026-04-02 13:15:00' },
    { id: 'ACT-003', type: 'user', action: 'New user registered', user: 'newuser@example.com', details: 'Retail investor from Kenya', timestamp: '2026-04-02 12:45:30' },
    { id: 'ACT-004', type: 'contract', action: 'Yield distributed', user: 'system', details: 'Pool Agriculture - €12,500', timestamp: '2026-04-02 10:00:00' },
    { id: 'ACT-005', type: 'investment', action: 'Redemption requested', user: 'jane@retail.com', details: '€25,000 from Pool Trade Finance', timestamp: '2026-04-02 09:30:00' },
    { id: 'ACT-006', type: 'compliance', action: 'Jurisdiction updated', user: 'compliance@ujamaa-defi.com', details: 'Added Rwanda to allowed list', timestamp: '2026-04-01 16:00:00' },
    { id: 'ACT-007', type: 'contract', action: 'Token minted', user: 'system', details: 'UPT tokens for Pool Industry', timestamp: '2026-04-01 14:00:00' },
    { id: 'ACT-008', type: 'user', action: 'User suspended', user: 'admin@ujamaa-defi.com', details: 'USR-008 - Compliance violation', timestamp: '2026-04-01 11:30:00' },
  ];

  const filteredActivities = filter === 'all' ? activities : activities.filter(a => a.type === filter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'investment': return 'blue';
      case 'compliance': return 'green';
      case 'user': return 'purple';
      case 'contract': return 'amber';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Activity Log</h1>
              <p className="text-[#8b5b3d] mt-1">Platform audit trail and activity monitoring</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-[#023D7A] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => setFilter('investment')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'investment'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Investments
            </button>
            <button
              onClick={() => setFilter('compliance')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'compliance'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Compliance
            </button>
            <button
              onClick={() => setFilter('user')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setFilter('contract')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'contract'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Contracts
            </button>
          </div>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className={`w-3 h-3 rounded-full mt-2 bg-${getTypeColor(activity.type)}-500`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                    </div>
                    <Badge variant="info" size="sm">{activity.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">User: {activity.user}</p>
                    <p className="text-xs text-gray-500 font-mono">{activity.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Export Options */}
        <Card className="mt-6">
          <h3 className="text-lg font-bold text-[#103b5b] mb-4">Export Activity Log</h3>
          <div className="flex gap-3">
            <button
              onClick={() => alert('🚀 MVP TESTNET: Export to CSV\n\nIn production, this will download the activity log as CSV.')}
              className="px-4 py-2 bg-[#023D7A] hover:bg-[#0d3352] text-white font-bold rounded-lg transition-colors"
            >
              📥 Export CSV
            </button>
            <button
              onClick={() => alert('🚀 MVP TESTNET: Export to PDF\n\nIn production, this will download the activity log as PDF.')}
              className="px-4 py-2 border border-[#48A9F0]/30 hover:bg-[#F3F8FA] text-[#023D7A] font-bold rounded-lg transition-colors"
            >
              📄 Export PDF
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ActivityLog;
