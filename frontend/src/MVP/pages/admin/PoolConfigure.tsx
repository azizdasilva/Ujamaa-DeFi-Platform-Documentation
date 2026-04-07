/**
 * Admin - Pool Configuration Page
 *
 * Configure a specific liquidity pool including:
 * - APY, target yield range, lockup period
 * - Total Value / NAV per Share (manually adjustable)
 * - Active/inactive status
 *
 * Route: /admin/pools/:id/configure
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { poolsAPI, Pool } from '../../../api/pools';
import apiClient from '../../../api/client';

const PoolConfigure: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pool, setPool] = useState<Pool | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [totalShares, setTotalShares] = useState<number>(0);
  const [currentNav, setCurrentNav] = useState<number>(1.0);

  // Form state
  const [formData, setFormData] = useState({
    apy: 0,
    total_value: 0,
    nav_per_share: 1.0,
    target_yield_min: 0,
    target_yield_max: 0,
    lockup_days: 0,
    is_active: true,
  });

  // Editing mode for NAV vs Total Value
  const [editMode, setEditMode] = useState<'nav' | 'total'>('nav');

  useEffect(() => {
    if (id) fetchPool();
  }, [id]);

  const fetchPool = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await poolsAPI.getPoolById(id!);
      setPool(data);

      // Fetch total shares for this pool to compute NAV
      try {
        const portfolioResp = await apiClient.get(`/db/pools/${id!}/positions`);
        const positions = portfolioResp.data?.positions || portfolioResp.data || [];
        const shares = positions.reduce((sum: number, p: any) => sum + (p.shares || 0), 0);
        setTotalShares(shares);

        // Compute NAV from actual data: total_value / total_shares
        if (shares > 0 && data.total_value > 0) {
          const computedNav = data.total_value / shares;
          setCurrentNav(computedNav);
        } else {
          setCurrentNav(1.0);
        }
      } catch {
        setTotalShares(0);
        setCurrentNav(1.0);
      }

      const nav = totalShares > 0 ? data.total_value / totalShares : 1.0;
      setFormData({
        apy: data.apy,
        total_value: data.total_value,
        nav_per_share: nav,
        target_yield_min: data.target_yield_min,
        target_yield_max: data.target_yield_max,
        lockup_days: data.lockup_days,
        is_active: data.is_active !== false,
      });
    } catch (err: any) {
      console.error('Error fetching pool:', err);
      setError(err.response?.data?.detail || 'Failed to load pool configuration');
    } finally {
      setLoading(false);
    }
  }, [id, totalShares]);

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // When NAV is edited, recalculate total_value
      if (field === 'nav_per_share' && editMode === 'nav' && totalShares > 0) {
        updated.total_value = (value as number) * totalShares;
      }

      // When total_value is edited, recalculate NAV
      if (field === 'total_value' && editMode === 'total' && totalShares > 0) {
        updated.nav_per_share = (value as number) / totalShares;
      }

      return updated;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess(null);
      setError(null);
      await poolsAPI.updatePool(id!, {
        apy: formData.apy,
        total_value: formData.total_value,
        target_yield_min: formData.target_yield_min,
        target_yield_max: formData.target_yield_max,
        lockup_days: formData.lockup_days,
        is_active: formData.is_active,
      });
      setSuccess('✓ Configuration saved successfully');
      fetchPool();
    } catch (err: any) {
      console.error('Error saving pool:', err);
      setError(err.response?.data?.detail || 'Failed to save pool configuration');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6ED]">
        <MVPBanner />
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-[#00A8A8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#103b5b] font-semibold">Loading pool configuration...</p>
        </div>
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="min-h-screen bg-[#F9F6ED]">
        <MVPBanner />
        <Card className="max-w-2xl mx-auto mt-8">
          <div className="text-center py-8">
            <p className="text-red-600">{error || 'Pool not found'}</p>
            <Button variant="primary" className="mt-4" onClick={() => navigate('/admin/pools')}>
              Back to Pools
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-[#103b5b]/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" onClick={() => navigate('/admin/pools')}>
                  ← Back
                </Button>
                <h1 className="text-2xl font-bold text-[#103b5b]">{pool.name}</h1>
              </div>
              <p className="text-[#8b5b3d] mt-1 ml-14 capitalize">{pool.name.replace('Pool ', '').replace(/_/g, ' ')}</p>
            </div>
            <Badge variant={formData.is_active ? 'success' : 'error'} size="md">
              {formData.is_active ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <div className="text-center">
              <p className="text-xs text-[#8b5b3d]">Current NAV/Share</p>
              <p className="text-xl font-bold text-[#023D7A]">€{currentNav.toFixed(4)}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-xs text-[#8b5b3d]">Total Shares</p>
              <p className="text-xl font-bold text-[#103b5b]">{totalShares.toLocaleString()}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-xs text-[#8b5b3d]">Current APY</p>
              <p className="text-xl font-bold text-[#00A8A8]">{pool.apy.toFixed(1)}%</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-xs text-[#8b5b3d]">Total Value</p>
              <p className="text-lg font-bold text-[#103b5b]">{formatCurrency(pool.total_value)}</p>
            </div>
          </Card>
        </div>

        {/* Edit Mode Toggle */}
        <Card>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-semibold text-[#103b5b]">Edit Mode:</span>
            <button
              onClick={() => setEditMode('nav')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                editMode === 'nav'
                  ? 'bg-[#023D7A] text-white'
                  : 'bg-white text-[#8b5b3d] border border-gray-200 hover:bg-gray-100'
              }`}
            >
              📊 NAV per Share → auto-calculate Total Value
            </button>
            <button
              onClick={() => setEditMode('total')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                editMode === 'total'
                  ? 'bg-[#023D7A] text-white'
                  : 'bg-white text-[#8b5b3d] border border-gray-200 hover:bg-gray-100'
              }`}
            >
              💰 Total Value → auto-calculate NAV
            </button>
          </div>
          <p className="text-xs text-[#8b5b3d]">
            {editMode === 'nav'
              ? 'Enter the NAV per share value. Total Value will be calculated as NAV × Total Shares.'
              : 'Enter the Total Value. NAV per share will be calculated as Total Value ÷ Total Shares.'}
          </p>
        </Card>

        {/* Configuration Form */}
        <Card>
          <h2 className="text-xl font-bold text-[#103b5b] mb-6">Pool Configuration</h2>

          <div className="space-y-6">
            {/* NAV per Share (primary editor) */}
            {editMode === 'nav' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="block text-sm font-bold text-[#023D7A] mb-2">
                  📊 NAV per Share (€)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.nav_per_share.toFixed(4)}
                  onChange={(e) => handleChange('nav_per_share', parseFloat(e.target.value) || 1.0)}
                  className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-[#023D7A] focus:border-transparent font-mono text-lg"
                />
                <p className="text-xs text-blue-700 mt-2">
                  This is the value per share investors receive on redemption. Total Value auto-calculates to{' '}
                  <strong>{formatCurrency(formData.total_value)}</strong> ({formData.nav_per_share.toFixed(4)} × {totalShares.toLocaleString()} shares).
                </p>
              </div>
            )}

            {/* Total Value (primary editor) */}
            {editMode === 'total' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="block text-sm font-bold text-[#023D7A] mb-2">
                  💰 Total Pool Value (€)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={formData.total_value}
                  onChange={(e) => handleChange('total_value', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-[#023D7A] focus:border-transparent font-mono text-lg"
                />
                <p className="text-xs text-blue-700 mt-2">
                  Total value of all assets in the pool. NAV per share auto-calculates to{' '}
                  <strong>€{formData.nav_per_share.toFixed(4)}</strong> ({formatCurrency(formData.total_value)} ÷ {totalShares.toLocaleString()} shares).
                </p>
              </div>
            )}

            {/* Secondary display (non-editable) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-[#8b5b3d]">NAV per Share</p>
                <p className="text-lg font-bold text-[#023D7A] font-mono">€{formData.nav_per_share.toFixed(4)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-[#8b5b3d]">Total Value</p>
                <p className="text-lg font-bold text-[#103b5b] font-mono">{formatCurrency(formData.total_value)}</p>
              </div>
            </div>

            {/* APY */}
            <div>
              <label className="block text-sm font-semibold text-[#103b5b] mb-2">
                APY (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.apy}
                onChange={(e) => handleChange('apy', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8A8] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Annual percentage yield offered to investors</p>
            </div>

            {/* Target Yield Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#103b5b] mb-2">
                  Min Target Yield (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.target_yield_min}
                  onChange={(e) => handleChange('target_yield_min', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8A8] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#103b5b] mb-2">
                  Max Target Yield (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.target_yield_max}
                  onChange={(e) => handleChange('target_yield_max', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8A8] focus:border-transparent"
                />
              </div>
            </div>

            {/* Lockup Period */}
            <div>
              <label className="block text-sm font-semibold text-[#103b5b] mb-2">
                Lockup Period (days)
              </label>
              <input
                type="number"
                value={formData.lockup_days}
                onChange={(e) => handleChange('lockup_days', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8A8] focus:border-transparent"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-[#103b5b]">Pool Status</p>
                <p className="text-sm text-gray-500">Toggle pool active/inactive status</p>
              </div>
              <button
                onClick={() => handleChange('is_active', !formData.is_active)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.is_active ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.is_active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={saving}
              className="flex-1"
            >
              {saving ? 'Saving...' : '💾 Save Changes'}
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/admin/pools')}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </Card>

        {/* Pool Info */}
        <Card>
          <h2 className="text-xl font-bold text-[#103b5b] mb-4">Pool Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500">Pool ID</p>
              <p className="font-mono text-gray-700">{pool.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Family</p>
              <p className="text-gray-700 capitalize">{pool.name.replace('Pool ', '').replace(/_/g, ' ')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Lockup Days</p>
              <p className="font-bold text-gray-700">{pool.lockup_days} days</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Target Range</p>
              <p className="font-bold text-gray-700">{pool.target_yield_min}% – {pool.target_yield_max}%</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PoolConfigure;
