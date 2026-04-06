/**
 * Compliance - Asset/Financing Review Page
 *
 * Review and approve financing requests from industrial operators.
 *
 * Route: /compliance/assets
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import apiClient from '../../../api/client';

interface Financing {
  id: number;
  pool_family: string;
  asset_class: string;
  industrial: string;
  industrial_id: number | null;
  principal: number;
  interest_rate: number;
  duration_days: number;
  start_date: string;
  maturity_date: string;
  amount_repaid: number;
  is_repaid: boolean;
  status: string;
  description: string | null;
}

const AssetReview: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [financings, setFinancings] = useState<Financing[]>([]);
  const [selectedFinancing, setSelectedFinancing] = useState<Financing | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchFinancings();
  }, []);

  const fetchFinancings = async () => {
    try {
      setLoading(true);
      // Fetch pending financings for compliance review
      const response = await apiClient.get('/db/financings?status=pending');
      setFinancings(response.data);
    } catch (error) {
      console.error('Error fetching financings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (action: 'approve' | 'reject') => {
    if (!selectedFinancing) return;

    try {
      // In production, this would call an API endpoint to update financing status
      await apiClient.post(`/pools/${selectedFinancing.pool_family}/financings/${selectedFinancing.id}/review`, {
        action,
        notes: reviewNotes,
        reviewer_id: 4 // Compliance officer ID
      });

      alert(`✓ Financing ${action}ed successfully!`);
      setShowReviewModal(false);
      setReviewNotes('');
      setSelectedFinancing(null);
      fetchFinancings();
      
      // Navigate to dashboard to show updated stats
      navigate('/compliance/dashboard');
    } catch (error: any) {
      console.error('Error reviewing financing:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to review financing';
      alert(`✗ Error: ${errorMsg}`);
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

  const stats = {
    total: financings.length,
    highValue: financings.filter(f => f.principal > 1000000).length,
    mediumValue: financings.filter(f => f.principal >= 100000 && f.principal <= 1000000).length,
    lowValue: financings.filter(f => f.principal < 100000).length,
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Asset/Financing Review</h1>
              <p className="text-[#8b5b3d] mt-1">Review and approve financing requests</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Pending Review</p>
            <p className="text-2xl font-bold text-[#103b5b]">{loading ? '-' : stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">High Value (€1M+)</p>
            <p className="text-2xl font-bold text-red-600">{loading ? '-' : stats.highValue}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Medium Value (€100K-1M)</p>
            <p className="text-2xl font-bold text-amber-600">{loading ? '-' : stats.mediumValue}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Low Value (&lt;€100K)</p>
            <p className="text-2xl font-bold text-green-600">{loading ? '-' : stats.lowValue}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Financing List */}
          <div className="lg:col-span-1">
            <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Pending Financings</h2>}>
              <div className="space-y-2">
                {loading ? (
                  <p className="text-center text-gray-500 py-8">Loading...</p>
                ) : financings.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No pending financings 🎉</p>
                ) : (
                  financings.map((financing) => (
                    <div
                      key={financing.id}
                      onClick={() => setSelectedFinancing(financing)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedFinancing?.id === financing.id
                          ? 'bg-[#023D7A] text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-semibold text-sm ${
                          selectedFinancing?.id === financing.id ? 'text-white' : 'text-gray-900'
                        }`}>
                          #{financing.id}
                        </p>
                        <Badge
                          variant={
                            financing.principal > 1000000 ? 'error' :
                            financing.principal >= 100000 ? 'warning' : 'success'
                          }
                          size="sm"
                        >
                          {financing.principal > 1000000 ? 'High' : financing.principal >= 100000 ? 'Medium' : 'Low'}
                        </Badge>
                      </div>
                      <p className={`text-xs ${
                        selectedFinancing?.id === financing.id ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        {financing.industrial}
                      </p>
                      <p className={`text-xs ${
                        selectedFinancing?.id === financing.id ? 'text-white/60' : 'text-gray-500'
                      }`}>
                        {formatCurrency(financing.principal)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Financing Details */}
          <div className="lg:col-span-2">
            {selectedFinancing ? (
              <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Financing Details</h2>}>
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-lg font-bold text-[#103b5b]">{selectedFinancing.industrial}</h3>
                      <p className="text-sm text-[#8b5b3d]">{selectedFinancing.asset_class} • {selectedFinancing.pool_family.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="warning" size="lg">PENDING APPROVAL</Badge>
                      <p className="text-xs text-gray-500 mt-1">ID: #{selectedFinancing.id}</p>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#8b5b3d]">Principal Amount</p>
                      <p className="text-2xl font-bold text-[#103b5b]">{formatCurrency(selectedFinancing.principal)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#8b5b3d]">Interest Rate</p>
                      <p className="text-2xl font-bold text-[#103b5b]">{selectedFinancing.interest_rate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#8b5b3d]">Duration</p>
                      <p className="text-lg font-semibold text-[#103b5b]">{selectedFinancing.duration_days} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#8b5b3d]">Start Date</p>
                      <p className="text-lg font-semibold text-[#103b5b]">{new Date(selectedFinancing.start_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#8b5b3d]">Maturity Date</p>
                      <p className="text-lg font-semibold text-[#103b5b]">{new Date(selectedFinancing.maturity_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#8b5b3d]">Description</p>
                      <p className="text-sm text-gray-700">{selectedFinancing.description || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-amber-900 mb-2">⚠️ Compliance Review Required</p>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Verify industrial operator KYB status</li>
                      <li>• Check asset valuation and collateral</li>
                      <li>• Review pool capacity and risk exposure</li>
                      <li>• Ensure regulatory compliance</li>
                    </ul>
                  </div>

                  {/* Review Notes Input */}
                  <div>
                    <label className="block text-sm font-semibold text-[#103b5b] mb-2">
                      Review Notes <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Enter your review notes, findings, and justification..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A] focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleReview('approve')}
                      className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                    >
                      ✓ Approve Financing
                    </button>
                    <button
                      onClick={() => handleReview('reject')}
                      className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                    >
                      ✗ Reject Financing
                    </button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">Select a financing to review</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssetReview;
