/**
 * Compliance - Jurisdictions Management Page
 *
 * Manage allowed and blocked jurisdictions for investor onboarding.
 *
 * Route: /compliance/jurisdictions
 */

import React, { useState, useEffect } from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import complianceAPI, { Jurisdiction } from '../../../api/compliance';

const Jurisdictions: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'allowed' | 'blocked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJurisdiction, setEditingJurisdiction] = useState<Jurisdiction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    status: 'allowed' as 'allowed' | 'blocked',
    category: 'africa' as 'africa' | 'international' | 'blocked',
    notes: '',
    sanctions_list: ''
  });

  useEffect(() => {
    fetchJurisdictions();
  }, [filter, categoryFilter]);

  const fetchJurisdictions = async () => {
    try {
      setLoading(true);
      const data = await complianceAPI.getJurisdictions(
        filter === 'all' ? undefined : filter,
        categoryFilter || undefined
      );
      setJurisdictions(data);
    } catch (error) {
      console.error('Error fetching jurisdictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      code: '',
      name: '',
      status: 'allowed',
      category: 'africa',
      notes: '',
      sanctions_list: ''
    });
    setEditingJurisdiction(null);
    setShowAddModal(true);
  };

  const handleEdit = (jurisdiction: Jurisdiction) => {
    setFormData({
      code: jurisdiction.code,
      name: jurisdiction.name,
      status: jurisdiction.status,
      category: jurisdiction.category,
      notes: jurisdiction.notes || '',
      sanctions_list: jurisdiction.sanctions_list || ''
    });
    setEditingJurisdiction(jurisdiction);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingJurisdiction) {
        await complianceAPI.updateJurisdiction(formData.code, {
          status: formData.status,
          notes: formData.notes,
          sanctions_list: formData.sanctions_list,
          category: formData.category
        });
        alert(`Jurisdiction ${formData.code} updated successfully!`);
      } else {
        await complianceAPI.addJurisdiction(formData);
        alert(`Jurisdiction ${formData.code} added successfully!`);
      }
      
      setShowAddModal(false);
      fetchJurisdictions();
    } catch (error: any) {
      console.error('Error saving jurisdiction:', error);
      alert(`Error: ${error.response?.data?.detail || 'Failed to save jurisdiction'}`);
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm(`Are you sure you want to remove jurisdiction ${code}? This cannot be undone.`)) {
      return;
    }

    try {
      await complianceAPI.deleteJurisdiction(code);
      alert(`Jurisdiction ${code} removed successfully!`);
      fetchJurisdictions();
    } catch (error: any) {
      console.error('Error deleting jurisdiction:', error);
      alert(`Error: ${error.response?.data?.detail || 'Failed to delete jurisdiction'}`);
    }
  };

  const filteredJurisdictions = jurisdictions.filter(j => {
    const matchesSearch = j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         j.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: jurisdictions.length,
    allowed: jurisdictions.filter(j => j.status === 'allowed').length,
    blocked: jurisdictions.filter(j => j.status === 'blocked').length,
    africa: jurisdictions.filter(j => j.category === 'africa' && j.status === 'allowed').length,
    international: jurisdictions.filter(j => j.category === 'international' && j.status === 'allowed').length,
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Jurisdiction Management</h1>
              <p className="text-[#8b5b3d] mt-1">Manage allowed and blocked jurisdictions</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={handleAdd}
              >
                ➕ Add Jurisdiction
              </Button>
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total</p>
            <p className="text-2xl font-bold text-[#103b5b]">{loading ? '-' : stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Allowed</p>
            <p className="text-2xl font-bold text-green-600">{loading ? '-' : stats.allowed}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Blocked</p>
            <p className="text-2xl font-bold text-red-600">{loading ? '-' : stats.blocked}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Africa</p>
            <p className="text-2xl font-bold text-[#023D7A]">{loading ? '-' : stats.africa}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">International</p>
            <p className="text-2xl font-bold text-[#023D7A]">{loading ? '-' : stats.international}</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-[#023D7A] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('allowed')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'allowed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Allowed
              </button>
              <button
                onClick={() => setFilter('blocked')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'blocked'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Blocked
              </button>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023D7A]"
              >
                <option value="">All Categories</option>
                <option value="africa">Africa</option>
                <option value="international">International</option>
                <option value="blocked">Blocked</option>
              </select>
              <input
                type="text"
                placeholder="Search jurisdictions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023D7A]"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={fetchJurisdictions}
                className="text-[#00A8A8] border-[#00A8A8] hover:bg-[#F3F8FA]"
              >
                🔄 Refresh
              </Button>
            </div>
          </div>
        </Card>

        {/* Jurisdictions Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#103b5b]/20">
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Notes</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Sanctions List</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">Loading jurisdictions...</td>
                  </tr>
                ) : filteredJurisdictions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">No jurisdictions found</td>
                  </tr>
                ) : (
                  filteredJurisdictions.map((j) => (
                    <tr key={j.code} className="border-b border-[#103b5b]/10 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-bold text-[#103b5b]">{j.code}</td>
                      <td className="py-3 px-4 font-semibold text-[#103b5b]">{j.name}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={j.status === 'allowed' ? 'success' : 'danger'}
                          size="sm"
                        >
                          {j.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-600">{j.category}</span>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600 max-w-xs truncate">
                        {j.notes || '-'}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600">
                        {j.sanctions_list || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(j)}
                            className="px-3 py-1 bg-[#023D7A] hover:bg-[#0d3352] text-white text-xs font-bold rounded transition-colors"
                          >
                            ✏️ Edit
                          </button>
                          {j.status === 'blocked' && (
                            <button
                              onClick={() => handleDelete(j.code)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-colors"
                            >
                              🗑️ Remove
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#103b5b] mb-4">
              {editingJurisdiction ? `Edit Jurisdiction: ${editingJurisdiction.code}` : 'Add New Jurisdiction'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#103b5b] mb-1">
                  Country Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  disabled={!!editingJurisdiction}
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A] disabled:bg-gray-100"
                  placeholder="e.g., US, KE, MU"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#103b5b] mb-1">
                  Country Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A]"
                  placeholder="e.g., United States, Kenya"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#103b5b] mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A]"
                  >
                    <option value="allowed">Allowed</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#103b5b] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A]"
                  >
                    <option value="africa">Africa</option>
                    <option value="international">International</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#103b5b] mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A]"
                  rows={3}
                  placeholder="Additional notes about this jurisdiction..."
                />
              </div>

              {formData.status === 'blocked' && (
                <div>
                  <label className="block text-sm font-semibold text-[#103b5b] mb-1">
                    Sanctions List Reference
                  </label>
                  <input
                    type="text"
                    value={formData.sanctions_list}
                    onChange={(e) => setFormData({...formData, sanctions_list: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A]"
                    placeholder="e.g., OFAC SDN List, UN Sanctions"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
              >
                💾 Save
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jurisdictions;
