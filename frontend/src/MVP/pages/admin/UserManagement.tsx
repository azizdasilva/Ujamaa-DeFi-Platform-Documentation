/**
 * Admin - User Management Page
 *
 * Manage platform users, roles, and permissions.
 *
 * Route: /admin/users
 */

import React, { useState } from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const UserManagement: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock user data
  const users = [
    { id: 'USR-001', name: 'John Investor', email: 'john@investor.com', role: 'INSTITUTIONAL_INVESTOR', status: 'active', joined: '2026-01-15', kyc: 'approved' },
    { id: 'USR-002', name: 'Jane Smith', email: 'jane@retail.com', role: 'RETAIL_INVESTOR', status: 'active', joined: '2026-02-20', kyc: 'approved' },
    { id: 'USR-003', name: 'Logic Capital', email: 'compliance@logiccapital.com', role: 'INDUSTRIAL_OPERATOR', status: 'active', joined: '2026-01-10', kyc: 'approved' },
    { id: 'USR-004', name: 'Compliance Officer', email: 'compliance@ujamaa-defi.com', role: 'COMPLIANCE_OFFICER', status: 'active', joined: '2026-01-01', kyc: 'N/A' },
    { id: 'USR-005', name: 'Admin User', email: 'admin@ujamaa-defi.com', role: 'ADMIN', status: 'active', joined: '2026-01-01', kyc: 'N/A' },
    { id: 'USR-006', name: 'Regulator User', email: 'regulator@authority.gov', role: 'REGULATOR', status: 'active', joined: '2026-01-05', kyc: 'N/A' },
    { id: 'USR-007', name: 'Pending User', email: 'pending@example.com', role: 'RETAIL_INVESTOR', status: 'inactive', joined: '2026-03-15', kyc: 'pending' },
    { id: 'USR-008', name: 'Suspended User', email: 'suspended@example.com', role: 'RETAIL_INVESTOR', status: 'inactive', joined: '2026-02-01', kyc: 'rejected' },
  ];

  const filteredUsers = users.filter(user => {
    if (filter === 'active' && user.status !== 'active') return false;
    if (filter === 'inactive' && user.status !== 'inactive') return false;
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.kyc === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">User Management</h1>
              <p className="text-[#8b5b3d] mt-1">Manage platform users and permissions</p>
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
            <p className="text-sm text-[#8b5b3d]">Total Users</p>
            <p className="text-2xl font-bold text-[#103b5b]">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Inactive</p>
            <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Pending KYC</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
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
                All Users
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('inactive')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'inactive'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Inactive
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
              />
              <Button variant="primary" size="md">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add User
              </Button>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#103b5b]/20">
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">KYC Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Joined</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#103b5b]/10 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-[#103b5b]">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400 font-mono">{user.id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="info" size="sm">{user.role.replace(/_/g, ' ')}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={user.kyc === 'approved' ? 'success' : user.kyc === 'pending' ? 'warning' : 'error'}
                        size="sm"
                      >
                        {user.kyc.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.status === 'active' ? 'success' : 'error'} size="sm">
                        {user.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.joined}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-[#023D7A] hover:bg-[#0d3352] text-white text-xs font-bold rounded transition-colors">
                          Edit
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => alert(`🚀 MVP TESTNET: Suspend user ${user.name}\n\nIn production, this will suspend the user account.`)}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded transition-colors"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => alert(`🚀 MVP TESTNET: Activate user ${user.name}\n\nIn production, this will activate the user account.`)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded transition-colors"
                          >
                            Activate
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
      </main>
    </div>
  );
};

export default UserManagement;
