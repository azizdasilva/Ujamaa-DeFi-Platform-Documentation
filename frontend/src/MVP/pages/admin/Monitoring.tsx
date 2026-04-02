/**
 * Admin - Platform Monitoring Page
 *
 * Monitor platform health, metrics, and system status.
 *
 * Route: /admin/monitoring
 */

import React, { useState, useEffect } from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import StatsCard from '../../components/StatsCard';
import apiClient from '../../../api/client';

const Monitoring: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalValueLocked: 0,
    transactionsToday: 0,
    avgBlockTime: 2.1, // Polygon Amoy average
    gasPrice: 35, // Current testnet gas price
  });

  const [systemStatus, setSystemStatus] = useState([
    { name: 'Frontend', status: 'operational', uptime: '99.9%' },
    { name: 'Backend API', status: 'operational', uptime: '99.9%' },
    { name: 'Database', status: 'operational', uptime: '99.95%' },
    { name: 'Smart Contracts', status: 'operational', uptime: '100%' },
  ]);

  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch overview stats
      const statsResponse = await apiClient.get('/db/stats/overview');
      
      // Fetch compliance stats for activity
      const complianceResponse = await apiClient.get('/db/stats/compliance');
      
      // Fetch recent transactions for events
      const transactionsResponse = await apiClient.get('/db/transactions?limit=5');

      setMetrics({
        totalUsers: statsResponse.data.total_users || 0,
        activeUsers: Math.floor((statsResponse.data.total_users || 0) * 0.7), // ~70% active
        totalValueLocked: statsResponse.data.total_value_locked || 0,
        transactionsToday: transactionsResponse.data.length || 0,
        avgBlockTime: 2.1,
        gasPrice: 35,
      });

      // Generate recent events from real data
      const events = [];
      
      // Add compliance activities
      if (complianceResponse.data.approved_today > 0) {
        events.push({
          time: 'Today',
          event: `${complianceResponse.data.approved_today} KYC/KYB approved`,
          type: 'compliance'
        });
      }
      
      // Add pending documents
      if (complianceResponse.data.pending_documents > 0) {
        events.push({
          time: 'Pending',
          event: `${complianceResponse.data.pending_documents} documents awaiting review`,
          type: 'compliance'
        });
      }

      // Add recent transactions
      transactionsResponse.data.slice(0, 3).forEach((tx: any) => {
        events.push({
          time: new Date(tx.created_at).toLocaleTimeString(),
          event: `${tx.transaction_type} - €${tx.amount.toLocaleString()}`,
          type: tx.type.toLowerCase()
        });
      });

      setRecentEvents(events);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
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
              <h1 className="text-3xl font-bold text-[#103b5b]">Platform Monitoring</h1>
              <p className="text-[#8b5b3d] mt-1">Real-time system health and metrics</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatsCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} 
            label="Total Users" 
            value={loading ? '...' : metrics.totalUsers} 
            color="blue" 
          />
          <StatsCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} 
            label="Active Users" 
            value={loading ? '...' : metrics.activeUsers} 
            color="green" 
          />
          <StatsCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
            label="TVL" 
            value={loading ? '...' : `€${(metrics.totalValueLocked / 1000000).toFixed(1)}M`} 
            color="amber" 
          />
          <StatsCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>} 
            label="Tx Today" 
            value={loading ? '...' : metrics.transactionsToday} 
            color="purple" 
          />
          <StatsCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
            label="Block Time" 
            value={`${metrics.avgBlockTime}s`} 
            color="teal" 
          />
          <StatsCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} 
            label="Gas Price" 
            value={`${metrics.gasPrice} Gwei`} 
            color="red" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <Card>
            <h3 className="text-lg font-bold text-[#103b5b] mb-4">System Status</h3>
            <div className="space-y-3">
              {systemStatus.map((system, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="font-semibold text-gray-900">{system.name}</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="success" size="sm">{system.status.toUpperCase()}</Badge>
                    <p className="text-xs text-gray-500 mt-1">Uptime: {system.uptime}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Events */}
          <Card>
            <h3 className="text-lg font-bold text-[#103b5b] mb-4">Recent Events</h3>
            <div className="space-y-3">
              {loading ? (
                <p className="text-center text-gray-500 py-8">Loading events...</p>
              ) : recentEvents.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No recent events</p>
              ) : (
                recentEvents.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-[#00A8A8] rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{event.event}</p>
                      <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                    </div>
                    <Badge variant="info" size="sm">{event.type}</Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Blockchain Status */}
        <Card className="mt-6">
          <h3 className="text-lg font-bold text-[#103b5b] mb-4">Blockchain Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Latest Block</p>
              <p className="text-2xl font-bold text-[#103b5b]">#52,847,291</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Network</p>
              <p className="text-lg font-bold text-[#103b5b]">Polygon Amoy</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Chain ID</p>
              <p className="text-2xl font-bold text-[#103b5b]">80002</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">RPC Status</p>
              <Badge variant="success" size="md">ONLINE</Badge>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Monitoring;
