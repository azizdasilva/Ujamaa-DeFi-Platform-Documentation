/**
 * Admin - KYC/KYB Settings Page
 * 
 * Allows administrators to configure KYC/KYB review deadlines
 * and view change history.
 * 
 * Route: /admin/kyc-settings
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKYCDeadlineSetting, updateKYCDeadline, KYCDeadlineSetting } from '../../../api/admin';
import MVPBanner from '../../components/MVPBanner';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

const KYCSettings: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [setting, setSetting] = useState<KYCDeadlineSetting | null>(null);
  const [newBusinessDays, setNewBusinessDays] = useState(5);
  const [changeReason, setChangeReason] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSetting();
  }, []);

  const fetchSetting = async () => {
    try {
      setLoading(true);
      const data = await getKYCDeadlineSetting();
      setSetting(data);
      setNewBusinessDays(data.current_value);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching KYC deadline setting:', err);
      setError(err.response?.data?.detail || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = () => {
    if (newBusinessDays < 1 || newBusinessDays > 30) {
      setError('Business days must be between 1 and 30');
      return;
    }
    if (changeReason.trim().length < 10) {
      setError('Please provide a reason with at least 10 characters');
      return;
    }
    if (newBusinessDays === setting?.current_value) {
      setError('New value must be different from current value');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleUpdateConfirm = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      await updateKYCDeadline(newBusinessDays, changeReason);
      
      setSuccess(`✓ Deadline updated to ${newBusinessDays} business days`);
      setShowConfirmModal(false);
      setChangeReason('');
      await fetchSetting();
    } catch (err: any) {
      console.error('Error updating KYC deadline:', err);
      setError(err.response?.data?.detail || 'Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">KYC/KYB Settings</h1>
              <p className="text-[#8b5b3d] mt-1">Configure review deadlines and monitor compliance</p>
            </div>
            <Button onClick={() => navigate('/admin/monitoring')} variant="secondary">
              📊 View Monitoring Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Alerts */}
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

        {/* Current Setting */}
        <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Current Deadline Setting</h2>}>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : setting ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#8b5b3d]">Current Value</p>
                  <p className="text-3xl font-bold text-[#103b5b]">
                    {setting.current_value} <span className="text-lg font-normal">business days</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#8b5b3d]">Description</p>
                  <p className="font-medium text-[#103b5b]">{setting.description}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8b5b3d]">Last Updated By</p>
                  <p className="font-medium text-[#103b5b]">{setting.updated_by || 'System Default'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8b5b3d]">Last Updated At</p>
                  <p className="font-medium text-[#103b5b]">{formatDate(setting.updated_at)}</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  <strong>⚠️ Note:</strong> Changes to this setting only affect <strong>NEW</strong> document submissions.
                  Existing documents will keep their original deadlines.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No settings found</div>
          )}
        </Card>

        {/* Update Form */}
        <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Update Deadline</h2>}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#8b5b3d] mb-2">
                Business Days for Review (1-30)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={newBusinessDays}
                onChange={(e) => setNewBusinessDays(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is the number of business days (Mon-Fri, excluding holidays) that compliance officers
                have to review each document.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8b5b3d] mb-2">
                Reason for Change <span className="text-red-500">*</span>
              </label>
              <textarea
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Explain why you're changing the deadline (minimum 10 characters)..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A] focus:border-transparent"
                rows={3}
                minLength={10}
              />
              <p className="text-xs text-gray-500 mt-1">
                This reason will be logged in the audit trail for compliance tracking.
              </p>
            </div>

            <Button
              onClick={handleUpdateClick}
              disabled={saving || newBusinessDays === setting?.current_value}
              loading={saving}
              className="w-full"
            >
              {saving ? 'Updating...' : 'Update Deadline Setting'}
            </Button>
          </div>
        </Card>

        {/* Change History */}
        <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Change History</h2>}>
          {setting && setting.change_history && setting.change_history.length > 0 ? (
            <div className="space-y-3">
              {setting.change_history.map((change, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="info" size="sm">
                        {change.old_value ?? 'N/A'} → {change.new_value ?? 'N/A'} days
                      </Badge>
                      <span className="text-sm text-gray-600">{formatDate(change.changed_at)}</span>
                    </div>
                    <span className="text-sm font-medium text-[#103b5b]">{change.changed_by}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Reason:</strong> {change.reason}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No changes recorded yet</p>
              <p className="text-sm mt-1">This is the default setting</p>
            </div>
          )}
        </Card>

        {/* Quick Links */}
        <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Quick Links</h2>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/compliance/kyc-review')}
              className="p-4 bg-white border border-[#103b5b]/20 rounded-lg hover:bg-gray-50 text-left transition-colors"
            >
              <p className="font-semibold text-[#103b5b]">📋 KYC Review</p>
              <p className="text-sm text-[#8b5b3d] mt-1">Review pending documents</p>
            </button>
            <button
              onClick={() => navigate('/admin/monitoring')}
              className="p-4 bg-white border border-[#103b5b]/20 rounded-lg hover:bg-gray-50 text-left transition-colors"
            >
              <p className="font-semibold text-[#103b5b]">📊 Monitoring Dashboard</p>
              <p className="text-sm text-[#8b5b3d] mt-1">View compliance metrics</p>
            </button>
          </div>
        </Card>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold text-[#103b5b] mb-4">Confirm Deadline Change</h3>
            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-700">
                Are you sure you want to change the KYC review deadline?
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>From:</strong> {setting?.current_value} business days
                </p>
                <p className="text-sm">
                  <strong>To:</strong> {newBusinessDays} business days
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  <strong>Reason:</strong> {changeReason}
                </p>
              </div>
              <p className="text-xs text-amber-600">
                ⚠️ This change will only affect NEW document submissions.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirmModal(false)}
                variant="secondary"
                className="flex-1"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateConfirm}
                className="flex-1"
                loading={saving}
              >
                Confirm Change
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCSettings;
