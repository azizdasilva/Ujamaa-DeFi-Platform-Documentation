/**
 * Admin - Threshold Management Page
 *
 * Manage all investment and compliance thresholds dynamically.
 * Changes are applied immediately without server restart.
 *
 * Route: /admin/thresholds
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import apiClient from '../../../api/client';

interface Thresholds {
  MIN_DEPOSIT: number;
  MAX_DEPOSIT: number;
  DAILY_WITHDRAWAL_LIMIT: number;
  INSTITUTIONAL_MIN: number;
  RETAIL_MAX: number;
  KYB_THRESHOLD_EUR: number;
  TXN_FLAG_LARGE: number;
  TXN_FLAG_VERY_LARGE: number;
  STRUCTURING_THRESHOLD: number;
  STRUCTURING_TOTAL_THRESHOLD: number;
  VELOCITY_THRESHOLD_PER_HOUR: number;
  DEFAULT_LOCKUP_DAYS: number;
  MIN_INVESTMENT_RETURN: number;
}

const ThresholdManagement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [thresholds, setThresholds] = useState<Thresholds>({
    MIN_DEPOSIT: 1000,
    MAX_DEPOSIT: 1000000,
    DAILY_WITHDRAWAL_LIMIT: 500000,
    INSTITUTIONAL_MIN: 100000,
    RETAIL_MAX: 90000,
    KYB_THRESHOLD_EUR: 100000,
    TXN_FLAG_LARGE: 100000,
    TXN_FLAG_VERY_LARGE: 500000,
    STRUCTURING_THRESHOLD: 3000,
    STRUCTURING_TOTAL_THRESHOLD: 10000,
    VELOCITY_THRESHOLD_PER_HOUR: 10,
    DEFAULT_LOCKUP_DAYS: 365,
    MIN_INVESTMENT_RETURN: 1000,
  });
  const [reason, setReason] = useState('');
  const [validation, setValidation] = useState<any>(null);

  useEffect(() => {
    fetchThresholds();
  }, []);

  const fetchThresholds = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/thresholds', {
        headers: {
          'Authorization': 'Bearer admin-token-mvp'
        }
      });
      setThresholds(response.data.thresholds);
    } catch (error) {
      console.error('Error fetching thresholds:', error);
      alert('Failed to load thresholds. Admin access required.');
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    try {
      const response = await apiClient.get('/admin/thresholds/validate', {
        headers: {
          'Authorization': 'Bearer admin-token-mvp'
        }
      });
      setValidation(response.data);
      
      if (response.data.errors.length > 0) {
        alert(`❌ Validation Errors:\n${response.data.errors.join('\n')}`);
      } else if (response.data.warnings.length > 0) {
        alert(`⚠️ Warnings:\n${response.data.warnings.join('\n')}`);
      } else {
        alert('✅ All thresholds are valid!');
      }
    } catch (error) {
      console.error('Error validating thresholds:', error);
      alert('Failed to validate thresholds');
    }
  };

  const handleSave = async () => {
    if (!reason.trim()) {
      alert('⚠️ Please provide a reason for this change (required for audit trail)');
      return;
    }

    if (!window.confirm('⚠️ Confirm Threshold Update\n\nThese changes will take effect immediately for all new transactions.\n\nAre you sure?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await apiClient.post('/admin/thresholds', {
        thresholds,
        reason
      }, {
        headers: {
          'Authorization': 'Bearer admin-token-mvp'
        }
      });

      alert(`✅ Thresholds Updated Successfully!\n\n${response.data.message}\n\nAudit Log ID: ${response.data.audit_log.changed_at}`);
      setReason('');
      setValidation(null);
    } catch (error: any) {
      console.error('Error updating thresholds:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to update thresholds';
      alert(`❌ Error: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all thresholds to default values?')) {
      setThresholds({
        MIN_DEPOSIT: 1000,
        MAX_DEPOSIT: 1000000,
        DAILY_WITHDRAWAL_LIMIT: 500000,
        INSTITUTIONAL_MIN: 100000,
        RETAIL_MAX: 90000,
        KYB_THRESHOLD_EUR: 100000,
        TXN_FLAG_LARGE: 100000,
        TXN_FLAG_VERY_LARGE: 500000,
        STRUCTURING_THRESHOLD: 3000,
        STRUCTURING_TOTAL_THRESHOLD: 10000,
        VELOCITY_THRESHOLD_PER_HOUR: 10,
        DEFAULT_LOCKUP_DAYS: 365,
        MIN_INVESTMENT_RETURN: 1000,
      });
      setReason('Reset to default values');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const ThresholdInput = ({ 
    label, 
    key: thresholdKey, 
    description,
    icon 
  }: { 
    label: string; 
    key: keyof Thresholds; 
    description: string;
    icon: string;
  }) => (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-start gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-900 mb-1">
            {label}
          </label>
          <p className="text-xs text-gray-600 mb-2">{description}</p>
          <input
            type="number"
            value={thresholds[thresholdKey]}
            onChange={(e) => setThresholds({
              ...thresholds,
              [thresholdKey]: parseInt(e.target.value) || 0
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Current: {formatCurrency(thresholds[thresholdKey])}
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#023D7A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#023D7A] font-bold">Loading thresholds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Threshold Management</h1>
              <p className="text-[#8b5b3d] mt-1">Configure investment limits and compliance thresholds</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="info" size="md">Admin Portal</Badge>
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Action Bar */}
        <Card className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="md"
                onClick={handleValidate}
              >
                ✓ Validate
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={handleReset}
                disabled={saving}
              >
                🔄 Reset Defaults
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/admin/dashboard')}
              >
                ← Back to Admin
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-green-600 to-green-700"
              >
                {saving ? '💾 Saving...' : '💾 Save Changes'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Change Reason */}
        <Card className="mb-8">
          <h3 className="text-lg font-bold text-[#103b5b] mb-3">
            📝 Change Reason (Required for Audit Trail)
          </h3>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why you're making these changes (e.g., 'Adjusting limits for Q2 2026', 'Responding to new regulatory requirements', etc.)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A] focus:border-transparent"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-2">
            ⚠️ All changes are logged with timestamp and admin email for compliance audit.
          </p>
        </Card>

        {/* Investment Limits */}
        <Card className="mb-8">
          <h3 className="text-xl font-bold text-[#103b5b] mb-4">
            💰 Investment Limits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ThresholdInput
              label="Minimum Deposit"
              key="MIN_DEPOSIT"
              description="Minimum amount per investment"
              icon="📉"
            />
            <ThresholdInput
              label="Maximum Deposit"
              key="MAX_DEPOSIT"
              description="Maximum amount per transaction"
              icon="📈"
            />
            <ThresholdInput
              label="Daily Withdrawal Limit"
              key="DAILY_WITHDRAWAL_LIMIT"
              description="Maximum withdrawal per day"
              icon="💸"
            />
            <ThresholdInput
              label="Institutional Minimum"
              key="INSTITUTIONAL_MIN"
              description="Minimum for institutional investors"
              icon="🏢"
            />
            <ThresholdInput
              label="Retail Maximum"
              key="RETAIL_MAX"
              description="Maximum for retail investors"
              icon="👤"
            />
          </div>
        </Card>

        {/* Compliance Thresholds */}
        <Card className="mb-8">
          <h3 className="text-xl font-bold text-[#103b5b] mb-4">
            🛡️ Compliance Thresholds
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ThresholdInput
              label="KYB Threshold"
              key="KYB_THRESHOLD_EUR"
              description="Investment amount requiring KYB"
              icon="📋"
            />
            <ThresholdInput
              label="Large Transaction Flag"
              key="TXN_FLAG_LARGE"
              description="Auto-flag transactions above this"
              icon="🚩"
            />
            <ThresholdInput
              label="Very Large Transaction Flag"
              key="TXN_FLAG_VERY_LARGE"
              description="High-risk flag threshold"
              icon="🚨"
            />
          </div>
        </Card>

        {/* Fraud Detection */}
        <Card className="mb-8">
          <h3 className="text-xl font-bold text-[#103b5b] mb-4">
            🔍 Fraud Detection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ThresholdInput
              label="Structuring Threshold"
              key="STRUCTURING_THRESHOLD"
              description="Per-transaction structuring detection"
              icon="🔎"
            />
            <ThresholdInput
              label="Structuring Total"
              key="STRUCTURING_TOTAL_THRESHOLD"
              description="Cumulative structuring threshold"
              icon="📊"
            />
            <ThresholdInput
              label="Velocity Threshold"
              key="VELOCITY_THRESHOLD_PER_HOUR"
              description="Transactions per hour limit"
              icon="⚡"
            />
          </div>
        </Card>

        {/* Validation Results */}
        {validation && (
          <Card className="mb-8">
            <h3 className="text-xl font-bold text-[#103b5b] mb-4">
              📋 Validation Results
            </h3>
            {validation.valid ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-bold">✅ All thresholds are valid!</p>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-bold mb-2">❌ Validation Errors:</p>
                <ul className="list-disc list-inside text-red-700 text-sm">
                  {validation.errors.map((error: string, idx: number) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            {validation.warnings.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mt-4">
                <p className="text-amber-800 font-bold mb-2">⚠️ Warnings:</p>
                <ul className="list-disc list-inside text-amber-700 text-sm">
                  {validation.warnings.map((warning: string, idx: number) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>⚠️ Changes take effect immediately for all new transactions</p>
            <p className="mt-1">All changes are logged for compliance audit</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ThresholdManagement;
