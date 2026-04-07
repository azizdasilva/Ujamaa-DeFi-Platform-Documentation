/**
 * uGT (Guarantee Token) Monitoring Page
 *
 * Displays uGT NFT collateral status for industrial operators.
 * Each industrial sees ONLY their own uGT NFTs.
 * Admin sees ALL industrial operators' uGT NFTs.
 *
 * Route: /invest/ugt-monitoring
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUGTHoldings, UGTHolding } from '../../../api/ulpMonitoring';
import MVPBanner from '../../components/MVPBanner';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const UGTMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ugtHoldings, setUgtHoldings] = useState<UGTHolding[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'redeemed' | 'defaulted'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getUGTHoldings();
      setUgtHoldings(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching uGT data:', err);
      setError(err.response?.data?.detail || 'Failed to load uGT data');
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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filtered = ugtHoldings.filter((ugt) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !ugt.is_redeemed && !ugt.is_defaulted;
    if (filter === 'redeemed') return ugt.is_redeemed;
    if (filter === 'defaulted') return ugt.is_defaulted;
    return true;
  });

  const stats = {
    total: ugtHoldings.length,
    active: ugtHoldings.filter((u) => !u.is_redeemed && !u.is_defaulted).length,
    redeemed: ugtHoldings.filter((u) => u.is_redeemed).length,
    defaulted: ugtHoldings.filter((u) => u.is_defaulted).length,
    totalCollateralValue: ugtHoldings
      .filter((u) => !u.is_redeemed && !u.is_defaulted)
      .reduce((sum, u) => sum + (u.merchandise_value || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6ED] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-[#103b5b] mb-2">Loading uGT Data...</p>
          <p className="text-[#8b5b3d]">Fetching guarantee token information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">uGT Collateral Monitoring</h1>
              <p className="text-[#8b5b3d] mt-1">Guarantee Token NFTs — Merchandise collateral status</p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={fetchData} variant="secondary" size="sm">
                🔄 Refresh
              </Button>
              <Button onClick={() => navigate(-1)} variant="secondary" size="sm">
                ← Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-sm text-[#8b5b3d]">Total UGTs</p>
              <p className="text-3xl font-bold text-[#103b5b]">{stats.total}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-[#8b5b3d]">Active Collateral</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-[#8b5b3d]">Redeemed</p>
              <p className="text-3xl font-bold text-gray-500">{stats.redeemed}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-[#8b5b3d]">Collateral Value</p>
              <p className="text-2xl font-bold text-teal-600">{formatCurrency(stats.totalCollateralValue)}</p>
            </div>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[#8b5b3d] mr-2">Filter:</span>
            {[
              { key: 'all', label: `All (${stats.total})`, count: stats.total },
              { key: 'active', label: `Active (${stats.active})`, count: stats.active },
              { key: 'redeemed', label: `Redeemed (${stats.redeemed})`, count: stats.redeemed },
              { key: 'defaulted', label: `Defaulted (${stats.defaulted})`, count: stats.defaulted },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as typeof filter)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === f.key
                    ? 'bg-[#023D7A] text-white'
                    : 'bg-white text-[#8b5b3d] hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Card>

        {/* uGT Cards */}
        {filtered.length === 0 ? (
          <Card>
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl mb-2">
                {filter === 'all' ? 'No uGT collateral found' : `No ${filter} UGTs`}
              </p>
              <p className="text-sm">
                uGT NFTs are minted when financing is created with collateral
              </p>
            </div>
          </Card>
        ) : (
          filtered.map((uGT) => (
            <Card key={uGT.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center text-3xl border border-amber-300">
                    🛡️
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-[#103b5b]">uGT #{uGT.token_id}</h3>
                      {uGT.certificate_id && (
                        <span className="text-sm text-gray-500">Cert #{uGT.certificate_id}</span>
                      )}
                    </div>
                    <p className="text-sm text-[#8b5b3d]">{uGT.description || 'No description'}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    uGT.is_defaulted ? 'error' :
                    uGT.is_redeemed ? 'info' : 'success'
                  }
                  size="md"
                >
                  {uGT.is_defaulted ? '⚠️ Defaulted' : uGT.is_redeemed ? '✓ Redeemed' : '● Active'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Merchandise Value</p>
                  <p className="text-lg font-bold text-[#103b5b]">
                    {uGT.merchandise_value ? formatCurrency(uGT.merchandise_value) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Warehouse</p>
                  <p className="text-sm font-medium">{uGT.warehouse_location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Expiry Date</p>
                  <p className="text-sm font-medium">{formatDate(uGT.expiry_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pool Address</p>
                  <p className="font-mono text-xs text-gray-600 truncate" title={uGT.pool_address || ''}>
                    {uGT.pool_address || 'N/A'}
                  </p>
                </div>
              </div>

              {uGT.stock_hash && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Stock Document Hash (IPFS)</p>
                  <p className="font-mono text-xs text-gray-600 mt-1">{uGT.stock_hash}</p>
                </div>
              )}
            </Card>
          ))
        )}
      </main>
    </div>
  );
};

export default UGTMonitoring;
