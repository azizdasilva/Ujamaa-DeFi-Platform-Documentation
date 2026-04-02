/**
 * Admin Dashboard
 *
 * Dashboard for platform administrators to manage users, assets, and platform settings.
 *
 * Route: /admin/dashboard
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
import Button from '../../components/Button';
import apiClient from '../../../api/client';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPools: 0,
    totalValue: 0,
    pendingDocuments: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState([
    { name: 'Smart Contracts', status: 'operational', uptime: '100%' },
    { name: 'Backend API', status: 'operational', uptime: '99.9%' },
    { name: 'Database', status: 'operational', uptime: '99.95%' },
    { name: 'Frontend', status: 'operational', uptime: '100%' },
  ]);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      
      // Fetch overview stats
      const statsResponse = await apiClient.get('/db/stats/overview');
      setStats({
        totalUsers: statsResponse.data.total_users || 0,
        totalPools: statsResponse.data.total_pools || 0,
        totalValue: statsResponse.data.total_value_locked || 0,
        pendingDocuments: statsResponse.data.pending_kyc_kyb || 0,
      });

      // Fetch recent users (from database API)
      const usersResponse = await apiClient.get('/db/users');
      setRecentUsers(usersResponse.data.slice(0, 4) || []);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-3xl font-bold text-[#103b5b]">Admin Dashboard</h1>
              <p className="text-[#8b5b3d] mt-1">Platform Management & Settings</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="primary" size="md">Administrator</Badge>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            label="Total Users"
            value={loading ? '...' : stats.totalUsers}
            trend={{ value: 12, direction: 'up' }}
            color="blue"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            label="Total Pools"
            value={loading ? '...' : stats.totalPools}
            color="green"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Total Value Locked"
            value={loading ? '...' : formatCurrency(stats.totalValue)}
            trend={{ value: 8.5, direction: 'up' }}
            color="purple"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Pending KYC/KYB"
            value={loading ? '...' : stats.pendingDocuments}
            color="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Users */}
            <Card
              header={
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#103b5b]">Recent Users</h2>
                  <a href="/admin/users" className="text-[#d57028] hover:text-[#c05a1e] text-sm font-medium">
                    Manage Users →
                  </a>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#103b5b]/20">
                      <th className="text-left py-3 font-semibold text-[#103b5b]">ID</th>
                      <th className="text-left py-3 font-semibold text-[#103b5b]">Name</th>
                      <th className="text-left py-3 font-semibold text-[#103b5b]">Email</th>
                      <th className="text-left py-3 font-semibold text-[#103b5b]">Role</th>
                      <th className="text-left py-3 font-semibold text-[#103b5b]">Status</th>
                      <th className="text-left py-3 font-semibold text-[#103b5b]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">Loading users...</td>
                      </tr>
                    ) : recentUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">No users found</td>
                      </tr>
                    ) : (
                      recentUsers.map((user) => (
                        <tr key={user.id} className="border-b border-[#103b5b]/10">
                          <td className="py-3 font-mono text-xs">#{user.id}</td>
                          <td className="py-3 font-medium text-[#103b5b]">
                            {user.full_name || user.company_name || 'N/A'}
                          </td>
                          <td className="py-3 text-[#8b5b3d]">{user.email}</td>
                          <td className="py-3">
                            <Badge
                              variant={
                                user.role === 'INSTITUTIONAL_INVESTOR' ? 'primary' :
                                user.role === 'INDUSTRIAL_OPERATOR' ? 'secondary' :
                                user.role === 'COMPLIANCE_OFFICER' ? 'warning' :
                                'info'
                              }
                              size="sm"
                            >
                              {user.role.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <Badge variant={user.is_active ? 'success' : 'gray'} size="sm">
                              {user.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => navigate(`/admin/users`)}
                              className="text-[#d57028] hover:text-[#c05a1e] text-sm font-medium"
                            >
                              View →
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pool Management */}
            <Card
              header={
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#023D7A]">Pool Management</h2>
                  <a href="/admin/pools" className="text-[#00A8A8] hover:text-[#0D7A7A] text-sm font-medium">
                    Manage Pools →
                  </a>
                </div>
              }
            >
              <div className="space-y-3">
                {[
                  { id: 'POOL_INDUSTRIE', name: 'Pool Industrie', value: 50_000_000, apy: 11, status: 'active' },
                  { id: 'POOL_AGRICULTURE', name: 'Pool Agriculture', value: 30_000_000, apy: 13.5, status: 'active' },
                  { id: 'POOL_TRADE_FINANCE', name: 'Pool Trade Finance', value: 25_000_000, apy: 9, status: 'active' },
                  { id: 'POOL_RENEWABLE_ENERGY', name: 'Pool Renewable Energy', value: 40_000_000, apy: 10, status: 'active' },
                  { id: 'POOL_REAL_ESTATE', name: 'Pool Real Estate', value: 60_000_000, apy: 10, status: 'active' },
                ].map((pool) => (
                  <div
                    key={pool.id}
                    className="flex items-center justify-between p-3 bg-[#F3F8FA] rounded-lg border border-[#48A9F0]/30"
                  >
                    <div>
                      <p className="font-semibold text-[#023D7A]">{pool.name}</p>
                      <p className="text-xs text-[#666666]">{pool.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#023D7A]">{formatCurrency(pool.value)}</p>
                      <div className="flex items-center gap-2 justify-end mt-1">
                        <Badge variant="success" size="sm">{pool.apy}% APY</Badge>
                        <a
                          href={`/admin/pools/${pool.id}`}
                          className="text-xs text-[#00A8A8] hover:text-[#0D7A7A]"
                        >
                          Manage →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card header={<h2 className="text-xl font-bold text-[#023D7A]">Quick Actions</h2>}>
              <div className="space-y-3">
                <a
                  href="/admin/users"
                  className="block w-full px-4 py-3 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-colors text-center"
                >
                  👥 Manage Users
                </a>
                <a
                  href="/admin/pools"
                  className="block w-full px-4 py-3 border border-[#48A9F0]/30 hover:bg-[#F3F8FA] text-[#023D7A] font-bold rounded-lg transition-colors text-center"
                >
                  🏊 Manage Pools
                </a>
                <a
                  href="/admin/assets"
                  className="block w-full px-4 py-3 border border-[#48A9F0]/30 hover:bg-[#F3F8FA] text-[#023D7A] font-bold rounded-lg transition-colors text-center"
                >
                  📦 Approve Assets
                </a>
                <a
                  href="/admin/settings"
                  className="block w-full px-4 py-3 border border-[#48A9F0]/30 hover:bg-[#F3F8FA] text-[#023D7A] font-bold rounded-lg transition-colors text-center"
                >
                  ⚙️ Platform Settings
                </a>
                <a
                  href="/admin/contracts"
                  className="block w-full px-4 py-3 border border-[#48A9F0]/30 hover:bg-[#F3F8FA] text-[#023D7A] font-bold rounded-lg transition-colors text-center"
                >
                  📜 Contract Management
                </a>
              </div>
            </Card>

            {/* System Health */}
            <Card>
              <h3 className="font-bold text-[#023D7A] mb-4">System Health</h3>
              <div className="space-y-3">
                {systemHealth.map((service) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#00A8A8] rounded-full" />
                      <span className="text-sm text-[#333333]">{service.name}</span>
                    </div>
                    <span className="text-xs text-[#666666]">{service.uptime}</span>
                  </div>
                ))}
              </div>
              <a
                href="/admin/monitoring"
                className="block w-full mt-4 px-4 py-2 bg-[#F3F8FA] hover:bg-[#E2E8F0] text-[#023D7A] text-sm font-bold rounded-lg transition-colors text-center"
              >
                View Monitoring →
              </a>
            </Card>

            {/* Platform Stats */}
            <Card>
              <h3 className="font-bold text-[#023D7A] mb-4">Platform Statistics</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-[#48A9F0]/20">
                  <span className="text-[#666666]">Total Transactions</span>
                  <span className="font-bold text-[#023D7A]">1,234</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#48A9F0]/20">
                  <span className="text-[#666666]">Total Yield Paid</span>
                  <span className="font-bold text-[#023D7A]">€2.5M</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#48A9F0]/20">
                  <span className="text-[#666666]">Avg. APY</span>
                  <span className="font-bold text-[#023D7A]">10.5%</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#666666]">Network</span>
                  <span className="font-bold text-[#023D7A]">Polygon Amoy</span>
                </div>
              </div>
            </Card>

            {/* Recent Alerts */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900">System Notice</p>
                  <p className="text-xs text-blue-700 mt-1">
                    All systems operational. No action required.
                  </p>
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
            🚀 MVP: Admin Portal - Testnet Release • Polygon Amoy (Chain ID: 80002)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
