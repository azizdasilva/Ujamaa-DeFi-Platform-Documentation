/**
 * Admin - Bank Account Management Page
 *
 * Manage investor bank accounts and escrow balances for testing.
 * Allows admin to increase/reduce escrow amounts for testing purposes.
 *
 * Route: /admin/bank-accounts
 *
 * @notice MVP TESTNET: This is for testing purposes only - no real bank accounts
 */

import React, { useState, useEffect } from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import adminAPI, { type InvestorBankData } from '../../../api/admin';

const BankAccountManagement: React.FC = () => {
  const [investors, setInvestors] = useState<InvestorBankData[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorBankData | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<string>('');
  const [adjustmentType, setAdjustmentType] = useState<'escrow' | 'available' | 'locked'>('escrow');
  const [operation, setOperation] = useState<'increase' | 'decrease'>('increase');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load investor data from backend API
  useEffect(() => {
    loadInvestors();
  }, []);

  const loadInvestors = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading investors from API...');
      const data = await adminAPI.getAllInvestorsBankAccounts();
      console.log('Investors loaded:', data);
      setInvestors(data);
      setNotification(null);
    } catch (err: any) {
      console.error('Failed to load investors:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to load investor data.';
      console.error('Error message:', errorMsg);
      setError(errorMsg);
      setNotification({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle adjustment
  const handleAdjustment = async () => {
    if (!selectedInvestor || !adjustmentAmount) {
      showNotification('error', 'Please select an investor and enter an amount');
      return;
    }

    const amount = parseFloat(adjustmentAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotification('error', 'Please enter a valid positive amount');
      return;
    }

    try {
      const response = await adminAPI.updateInvestorBankAccount(selectedInvestor.id, {
        balance_type: adjustmentType,
        operation: operation,
        amount: amount,
        reason: 'Admin adjustment via Bank Management page'
      });

      showNotification('success', response.message);
      
      // Reload investors to get updated data
      await loadInvestors();
      
      setShowModal(false);
      setAdjustmentAmount('');
      setSelectedInvestor(null);
    } catch (error: any) {
      console.error('Failed to update balance:', error);
      showNotification('error', error.response?.data?.detail || 'Failed to update balance');
    }
  };

  // Toggle investor status
  const toggleStatus = async (investorId: number) => {
    const investor = investors.find(inv => inv.id === investorId);
    const newStatus = investor?.status === 'active' ? 'suspended' : 'active';
    
    try {
      const response = await adminAPI.updateInvestorStatus(investorId, newStatus);
      showNotification('success', response.message);
      
      // Reload investors to get updated data
      await loadInvestors();
    } catch (error: any) {
      console.error('Failed to update status:', error);
      showNotification('error', error.response?.data?.detail || 'Failed to update status');
    }
  };

  // Filter investors by search query
  const filteredInvestors = investors.filter(inv => {
    const searchLower = searchQuery.toLowerCase();
    const name = (inv.full_name || inv.email).toLowerCase();
    const email = (inv.email || '').toLowerCase();
    const role = (inv.role || '').toLowerCase();
    
    return name.includes(searchLower) || email.includes(searchLower) || role.includes(searchLower);
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'error';
      case 'pending': return 'warning';
      default: return 'info';
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F8FA]">
      <MVPBanner />

      {/* Notification */}
      {notification && (
        <div className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-lg shadow-lg animate-slideIn ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#023D7A]">Bank Account Management</h1>
              <p className="text-gray-600 mt-1">Manage investor bank accounts and escrow balances</p>
            </div>
            <div className="flex items-center gap-3">
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Investors</p>
              <p className="text-3xl font-bold text-[#023D7A]">{investors.length}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Escrow Balance</p>
              <p className="text-3xl font-bold text-[#00A8A8]">
                {formatCurrency(investors.reduce((sum, inv) => sum + (inv.escrow_balance || 0), 0))}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Available</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(investors.reduce((sum, inv) => sum + (inv.available_balance || 0), 0))}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Locked</p>
              <p className="text-3xl font-bold text-amber-600">
                {formatCurrency(investors.reduce((sum, inv) => sum + (inv.locked_amount || 0), 0))}
              </p>
            </div>
          </Card>
        </div>

        {/* Test Mode Notice */}
        <Card className="mb-6 bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white">
          <div className="flex items-start gap-4">
            <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">🧪 Test Mode - Mock Bank Accounts</h3>
              <p className="text-sm text-white/90 mb-3">
                This page allows you to simulate bank account operations for testing purposes.
                You can adjust investor escrow balances, available balances, and locked amounts.
              </p>
              <ul className="text-xs text-white/80 space-y-1">
                <li>• Changes are persisted to the database</li>
                <li>• No real bank accounts or funds are involved</li>
                <li>• Use this to test different balance scenarios</li>
                <li>• Requires Admin role to make changes</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Search Bar */}
        <Card className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search investors by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8] focus:border-transparent"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </Card>

        {/* Loading State */}
        {loading ? (
          <Card>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <svg className="animate-spin h-8 w-8 text-[#00A8A8] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <p className="text-gray-600">Loading investor data...</p>
              </div>
            </div>
          </Card>
        ) : error && investors.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-semibold text-gray-900 mb-2">Unable to load investor records</p>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadInvestors}
                className="px-4 py-2 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </Card>
        ) : investors.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg font-semibold text-gray-900 mb-2">No investors found</p>
              <p className="text-gray-600">No investor records exist in the database yet.</p>
            </div>
          </Card>
        ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Account</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Escrow Balance</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Locked</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvestors.map((investor) => (
                  <tr key={investor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{investor.full_name}</p>
                        <p className="text-xs text-gray-500">{investor.email}</p>
                        <p className="text-xs text-gray-400 mt-1">{investor.role.replace(/_/g, ' ')}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-mono text-gray-700">{investor.bank_account_number || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{investor.bank_name || 'No bank account'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <p className="text-sm font-bold text-[#023D7A]">{formatCurrency(investor.escrow_balance)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <p className="text-sm font-bold text-green-600">{formatCurrency(investor.available_balance)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <p className="text-sm font-bold text-amber-600">{formatCurrency(investor.locked_amount)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge variant={getStatusColor(investor.status)} size="md">
                        {investor.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedInvestor(investor);
                            setShowModal(true);
                          }}
                          className="px-3 py-1.5 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white text-sm font-bold rounded transition-colors"
                        >
                          Adjust
                        </button>
                        <button
                          onClick={() => toggleStatus(investor.id)}
                          className={`px-3 py-1.5 text-sm font-bold rounded transition-colors ${
                            investor.status === 'active'
                              ? 'bg-red-100 hover:bg-red-200 text-red-700'
                              : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }`}
                        >
                          {investor.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        )}

        {/* Adjustment Modal */}
        {showModal && selectedInvestor && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
              
              <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 animate-scaleIn">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#023D7A]">Adjust Balance</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">{selectedInvestor.full_name}</p>
                  <p className="text-xs text-gray-500">{selectedInvestor.email}</p>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">Escrow</p>
                      <p className="font-bold text-[#023D7A]">{formatCurrency(selectedInvestor.escrow_balance)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Available</p>
                      <p className="font-bold text-green-600">{formatCurrency(selectedInvestor.available_balance)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Locked</p>
                      <p className="font-bold text-amber-600">{formatCurrency(selectedInvestor.locked_amount)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Balance Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setAdjustmentType('escrow')}
                        className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors ${
                          adjustmentType === 'escrow'
                            ? 'bg-[#023D7A] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Escrow
                      </button>
                      <button
                        onClick={() => setAdjustmentType('available')}
                        className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors ${
                          adjustmentType === 'available'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Available
                      </button>
                      <button
                        onClick={() => setAdjustmentType('locked')}
                        className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors ${
                          adjustmentType === 'locked'
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Locked
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Operation</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setOperation('increase')}
                        className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors ${
                          operation === 'increase'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        ⬆️ Increase
                      </button>
                      <button
                        onClick={() => setOperation('decrease')}
                        className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors ${
                          operation === 'decrease'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        ⬇️ Decrease
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (EUR)</label>
                    <input
                      type="number"
                      value={adjustmentAmount}
                      onChange={(e) => setAdjustmentAmount(e.target.value)}
                      placeholder="Enter amount..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8] focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAdjustment}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00A8A8] to-[#023D7A] text-white font-bold rounded-lg hover:from-[#0D7A7A] hover:to-[#034F9A] transition-all shadow-lg"
                    >
                      Confirm Adjustment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BankAccountManagement;
