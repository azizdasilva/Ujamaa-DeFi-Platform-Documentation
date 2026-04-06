/**
 * Admin - Contract Management Page
 *
 * View and manage deployed smart contracts from the database registry.
 *
 * Route: /admin/contracts
 */

import React, { useState, useEffect } from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { listContracts, registerContract, ContractData, ContractCreateRequest } from '../../../api/admin';

const ContractManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ContractCreateRequest>({
    name: '',
    address: '',
    contract_type: '',
    description: '',
    network: 'Polygon Amoy',
    chain_id: 80002,
    verified: false,
  });

  useEffect(() => { fetchContracts(); }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listContracts();
      setContracts(data);
    } catch (err: any) {
      console.error('Error fetching contracts:', err);
      setError(err.response?.data?.detail || 'Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.address || !formData.contract_type) {
      alert('Please fill in Name, Address, and Type');
      return;
    }
    if (!formData.address.startsWith('0x') || formData.address.length !== 42) {
      alert('Invalid contract address format. Must be 0x + 40 hex characters.');
      return;
    }
    try {
      setSaving(true);
      await registerContract(formData);
      setShowForm(false);
      setFormData({ name: '', address: '', contract_type: '', description: '', network: 'Polygon Amoy', chain_id: 80002, verified: false });
      fetchContracts();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to register contract');
    } finally {
      setSaving(false);
    }
  };

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Smart Contract Management</h1>
              <p className="text-[#8b5b3d] mt-1">View and manage deployed contracts</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="primary" size="md" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : '+ Register Contract'}
              </Button>
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Network Info */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#103b5b]">Current Network</h3>
              <p className="text-sm text-gray-600">Polygon Amoy Testnet</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="info" size="lg">Chain ID: 80002</Badge>
              <Badge variant="success" size="lg">{contracts.length} Contracts</Badge>
            </div>
          </div>
        </Card>

        {/* Error */}
        {error && (
          <Card className="mb-6 border-red-500">
            <div className="flex items-center justify-between">
              <p className="text-red-600 font-semibold">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchContracts} className="text-red-600 border-red-600">Retry</Button>
            </div>
          </Card>
        )}

        {/* Registration Form */}
        {showForm && (
          <Card className="mb-6 border-[#00A8A8]">
            <h3 className="text-lg font-bold text-[#103b5b] mb-4">Register New Contract</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#103b5b] mb-1">Contract Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8A8]" placeholder="e.g. ULPTokenizer" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#103b5b] mb-1">Contract Address *</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8A8] font-mono text-sm" placeholder="0x..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#103b5b] mb-1">Contract Type *</label>
                <input type="text" value={formData.contract_type} onChange={e => setFormData({...formData, contract_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8A8]" placeholder="e.g. ERC-20, Pool Management" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#103b5b] mb-1">Description</label>
                <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8A8]" placeholder="Brief description" />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.verified || false} onChange={e => setFormData({...formData, verified: e.target.checked})} />
                  <span className="text-sm text-gray-700">Verified on Explorer</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="primary" onClick={handleSubmit} disabled={saving} className="flex-1">
                {saving ? 'Registering...' : 'Register Contract'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
            </div>
          </Card>
        )}

        {/* Contracts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-[#00A8A8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#103b5b] font-semibold">Loading contracts...</p>
          </div>
        ) : contracts.length === 0 ? (
          <Card><div className="text-center py-12"><p className="text-gray-500 text-lg">No contracts registered yet</p></div></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map((c) => (
              <Card key={c.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[#103b5b] truncate">{c.name}</h3>
                    <p className="text-xs text-gray-500">{c.contract_type}</p>
                  </div>
                  <Badge variant={c.verified ? 'success' : c.status === 'deployed' ? 'info' : 'warning'} size="sm">
                    {c.verified ? 'VERIFIED' : c.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-500">Address</p>
                  <a href={c.explorer_url || `https://amoy.polygonscan.com/address/${c.address}`} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-sm text-[#00A8A8] hover:underline">
                    {formatAddress(c.address)}
                  </a>
                </div>

                {c.description && (
                  <p className="text-xs text-gray-600 mb-3 line-clamp-3">{c.description}</p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-400">{c.network}</span>
                  <a href={c.explorer_url || `https://amoy.polygonscan.com/address/${c.address}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[#00A8A8] hover:underline font-medium">
                    View on Explorer →
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {!loading && contracts.length > 0 && (
          <Card className="mt-6 bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Total Contracts Deployed</h3>
                <p className="text-sm text-white/80">All contracts verified on Polygon Amoy</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">{contracts.length}</p>
                <p className="text-xs text-white/80">Smart Contracts</p>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ContractManagement;
