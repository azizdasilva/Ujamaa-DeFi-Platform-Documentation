/**
 * Admin - User Management Page
 *
 * Full CRUD: Create, Read, Update, Delete users.
 * Toggle active/suspended, reset passwords, change roles.
 * Real API calls to /api/v2/admin/users.
 *
 * Route: /admin/users
 */

import React, { useState, useEffect, useCallback } from 'react';
import { listUsers, createUser, updateUser, deleteUser, resetPassword, toggleUserActive, UserData } from '../../../api/admin';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const ROLES = [
  'INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'INDUSTRIAL_OPERATOR',
  'COMPLIANCE_OFFICER', 'ADMIN', 'REGULATOR',
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [showResetPwModal, setShowResetPwModal] = useState(false);
  const [resettingUserId, setResettingUserId] = useState<number | null>(null);

  // Form state
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('RETAIL_INVESTOR');
  const [formWallet, setFormWallet] = useState('');
  const [formFullName, setFormFullName] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listUsers();
      setUsers(data.users);
      setError(null);
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const resetForm = () => {
    setFormEmail(''); setFormRole('RETAIL_INVESTOR');
    setFormWallet(''); setFormFullName(''); setFormError('');
  };

  const openAdd = () => { resetForm(); setShowAddModal(true); };
  const openEdit = (u: UserData) => {
    setEditingUser(u);
    setFormEmail(u.email); setFormRole(u.role);
    setFormWallet(u.wallet_address || ''); setFormFullName(u.full_name || '');
    setFormError(''); setShowEditModal(true);
  };
  const openResetPw = (u: UserData) => { setResettingUserId(u.id); setShowResetPwModal(true); };

  const handleAddUser = async () => {
    setFormError('');
    if (!formEmail || !formRole) { setFormError('Email and role are required'); return; }
    try {
      setSubmitting(true);
      await createUser({
        email: formEmail, role: formRole,
        wallet_address: formWallet || undefined,
        full_name: formFullName || undefined,
      });
      setShowAddModal(false); resetForm(); await fetchUsers();
    } catch (e: any) { setFormError(e.response?.data?.detail || 'Failed to create user'); }
    finally { setSubmitting(false); }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    setFormError('');
    if (!formEmail) { setFormError('Email is required'); return; }
    try {
      setSubmitting(true);
      await updateUser(editingUser.id, {
        email: formEmail, role: formRole,
        wallet_address: formWallet || undefined,
        full_name: formFullName || undefined,
      });
      setShowEditModal(false); setEditingUser(null); resetForm(); await fetchUsers();
    } catch (e: any) { setFormError(e.response?.data?.detail || 'Failed to update user'); }
    finally { setSubmitting(false); }
  };

  const handleToggleActive = async (u: UserData) => {
    try {
      await toggleUserActive(u.id);
      await fetchUsers();
    } catch (e: any) { alert('Failed: ' + (e.response?.data?.detail || e.message)); }
  };

  const handleDelete = async (u: UserData) => {
    if (!confirm(`Delete user ${u.email}? This cannot be undone.`)) return;
    try {
      await deleteUser(u.id);
      await fetchUsers();
    } catch (e: any) { alert('Failed: ' + (e.response?.data?.detail || e.message)); }
  };

  const handleResetPw = async () => {
    if (!resettingUserId) return;
    try {
      await resetPassword(resettingUserId, 'password123');
      setShowResetPwModal(false); setResettingUserId(null);
      alert('Password reset to: password123');
    } catch (e: any) { alert('Failed: ' + (e.response?.data?.detail || e.message)); }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'active' && !user.is_active) return false;
    if (filter === 'inactive' && user.is_active) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = (user.full_name || '').toLowerCase();
      if (!user.email.toLowerCase().includes(q) && !name.includes(q) && !(user.wallet_address || '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length,
    investors: users.filter(u => u.role.includes('INVESTOR')).length,
  };

  const roleColor = (role: string) => {
    if (role === 'ADMIN') return 'error';
    if (role === 'COMPLIANCE_OFFICER') return 'warning';
    if (role === 'REGULATOR') return 'info';
    if (role.includes('INSTITUTIONAL')) return 'success';
    if (role.includes('RETAIL')) return 'info';
    return 'default';
  };

  // ── Modal component ──
  const Modal = ({ title, show, onClose, children }: { title: string; show: boolean; onClose: () => void; children: React.ReactNode }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
          <h3 className="text-lg font-bold text-[#103b5b] mb-4">{title}</h3>
          {children}
        </div>
      </div>
    );
  };

  const InputField = ({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
    <div className="mb-3">
      <label className="block text-sm font-semibold text-[#103b5b] mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">User Management</h1>
              <p className="text-[#8b5b3d] mt-1">Manage platform users, roles, and permissions</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.total, color: 'text-[#103b5b]' },
            { label: 'Active', value: stats.active, color: 'text-green-600' },
            { label: 'Inactive', value: stats.inactive, color: 'text-red-600' },
            { label: 'Investors', value: stats.investors, color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
              <p className="text-sm text-[#8b5b3d]">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2">
              {(['all', 'active', 'inactive'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filter === f ? (f === 'active' ? 'bg-green-600 text-white' : f === 'inactive' ? 'bg-red-600 text-white' : 'bg-[#023D7A] text-white')
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  {f === 'all' ? 'All Users' : f === 'active' ? 'Active' : 'Inactive'}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input type="text" placeholder="Search users..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]" />
              <Button variant="primary" size="md" onClick={openAdd}>
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
          {loading ? <p className="text-center py-8 text-gray-500">Loading users...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#103b5b]/20">
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">KYC</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Balance</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} className="border-b border-[#103b5b]/10 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-[#103b5b]">{u.full_name || u.email}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                        {u.wallet_address && <p className="text-xs text-gray-400 font-mono">{u.wallet_address.slice(0, 10)}...{u.wallet_address.slice(-6)}</p>}
                      </div>
                    </td>
                    <td className="py-3 px-4"><Badge variant={roleColor(u.role) as any} size="sm">{u.role.replace(/_/g, ' ')}</Badge></td>
                    <td className="py-3 px-4">
                      {u.kyc_status ? <Badge variant={u.kyc_status === 'APPROVED' ? 'success' : u.kyc_status === 'PENDING' ? 'warning' : 'error'} size="sm">{u.kyc_status}</Badge> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="py-3 px-4"><Badge variant={u.is_active ? 'success' : 'error'} size="sm">{u.is_active ? 'ACTIVE' : 'SUSPENDED'}</Badge></td>
                    <td className="py-3 px-4 text-gray-600">{u.bank_balance != null ? `€${u.bank_balance.toLocaleString()}` : '—'}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        <button onClick={() => openEdit(u)} className="px-2 py-1 bg-[#023D7A] hover:bg-[#0d3352] text-white text-xs font-bold rounded">Edit</button>
                        <button onClick={() => handleToggleActive(u)} className={`px-2 py-1 text-white text-xs font-bold rounded ${u.is_active ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'}`}>{u.is_active ? 'Suspend' : 'Activate'}</button>
                        <button onClick={() => openResetPw(u)} className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded">Reset PW</button>
                        <button onClick={() => handleDelete(u)} className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && <p className="text-center py-8 text-gray-500">No users found</p>}
          </div>
          )}
        </Card>
      </main>

      {/* ── Add User Modal ── */}
      <Modal title="Add New User" show={showAddModal} onClose={() => setShowAddModal(false)}>
        <InputField label="Email" value={formEmail} onChange={setFormEmail} placeholder="user@example.com" />
        <div className="mb-3">
          <label className="block text-sm font-semibold text-[#103b5b] mb-1">Role</label>
          <select value={formRole} onChange={e => setFormRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]">
            {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <InputField label="Full Name" value={formFullName} onChange={setFormFullName} placeholder="John Doe" />
        <InputField label="Wallet Address (optional)" value={formWallet} onChange={setFormWallet} placeholder="0x..." />
        <p className="text-xs text-gray-500 mb-3">Default password: <code className="bg-gray-100 px-1 rounded">password123</code></p>
        {formError && <p className="text-red-600 text-sm mb-3">{formError}</p>}
        <div className="flex gap-2 justify-end">
          <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
          <button onClick={handleAddUser} disabled={submitting} className="px-4 py-2 bg-[#023D7A] text-white rounded-lg disabled:opacity-50">{submitting ? 'Creating...' : 'Create User'}</button>
        </div>
      </Modal>

      {/* ── Edit User Modal ── */}
      <Modal title={`Edit User: ${editingUser?.email}`} show={showEditModal} onClose={() => setShowEditModal(false)}>
        <InputField label="Email" value={formEmail} onChange={setFormEmail} />
        <div className="mb-3">
          <label className="block text-sm font-semibold text-[#103b5b] mb-1">Role</label>
          <select value={formRole} onChange={e => setFormRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]">
            {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <InputField label="Full Name" value={formFullName} onChange={setFormFullName} />
        <InputField label="Wallet Address" value={formWallet} onChange={setFormWallet} placeholder="0x..." />
        {formError && <p className="text-red-600 text-sm mb-3">{formError}</p>}
        <div className="flex gap-2 justify-end">
          <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
          <button onClick={handleUpdateUser} disabled={submitting} className="px-4 py-2 bg-[#023D7A] text-white rounded-lg disabled:opacity-50">{submitting ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </Modal>

      {/* ── Reset Password Modal ── */}
      <Modal title="Reset Password" show={showResetPwModal} onClose={() => setShowResetPwModal(false)}>
        <p className="text-sm text-gray-600 mb-4">Reset password to <code className="bg-gray-100 px-1 rounded">password123</code> for this user?</p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => setShowResetPwModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
          <button onClick={handleResetPw} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Reset Password</button>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
