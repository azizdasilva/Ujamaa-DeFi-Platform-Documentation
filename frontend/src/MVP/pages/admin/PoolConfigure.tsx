/**
 * Admin - Pool Configuration Page
 *
 * Configure a specific liquidity pool.
 *
 * Route: /admin/pools/:id/configure
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { poolsAPI, Pool } from '../../../api/pools';

const PoolConfigure: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pool, setPool] = useState<Pool | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    apy: 0,
    total_value: 0,
    target_yield_min: 0,
    target_yield_max: 0,
    lockup_days: 0,
    is_active: true,
  });

  useEffect(() => {
    if (id) fetchPool();
  }, [id]);

  const fetchPool = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await poolsAPI.getPoolById(id!);
      setPool(data);
      setFormData({
        apy: data.apy,
        total_value: data.total_value,
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
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      setSuccess('Configuration saved successfully');
      fetchPool(); // Refresh data
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
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/admin/pools')}>
                  ← Back
                </Button>
                <h1 className="text-2xl font-bold text-[#103b5b]">{pool.name}</h1>
              </div>
              <p className="text-[#8b5b3d] mt-1 ml-14 capitalize">{pool.name.replace('Pool ', '')}</p>
            </div>
            <Badge variant={formData.is_active ? 'success' : 'error'} size="md">
              {formData.is_active ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Messages */}
        {error && (
          <Card className="mb-6 border-red-500 bg-red-50">
            <p className="text-red-600">{error}</p>
          </Card>
        )}
        {success && (
          <Card className="mb-6 border-green-500 bg-green-50">
            <p className="text-green-600">{success}</p>
          </Card>
        )}

        <Card>
          <h2 className="text-xl font-bold text-[#103b5b] mb-6">Pool Configuration</h2>

          <div className="space-y-6">
            {/* APY */}
            <div>
              <label className="block text-sm font-semibold text-[#103b5b] mb-2">
                APY (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.apy}
                onChange={(e) => handleChange('apy', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8A8] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Annual percentage yield offered to investors</p>
            </div>

            {/* Total Value */}
            <div>
              <label className="block text-sm font-semibold text-[#103b5b] mb-2">
                Total Value ({formatCurrency(formData.total_value)})
              </label>
              <input
                type="range"
                min="0"
                max="10000000"
                step="10000"
                value={formData.total_value}
                onChange={(e) => handleChange('total_value', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>€10M</span>
              </div>
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
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/admin/pools')}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </Card>

        {/* Pool Info */}
        <Card className="mt-6">
          <h2 className="text-xl font-bold text-[#103b5b] mb-4">Pool Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500">Pool ID</p>
              <p className="font-mono text-gray-700">{pool.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Family</p>
              <p className="text-gray-700 capitalize">{pool.name.replace('Pool ', '')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Current APY</p>
              <p className="text-lg font-bold text-[#00A8A8]">{pool.apy.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Value</p>
              <p className="text-lg font-bold text-[#103b5b]">{formatCurrency(pool.total_value)}</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PoolConfigure;
