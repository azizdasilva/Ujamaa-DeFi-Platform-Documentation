/**
 * Admin - Settings Page
 * All 4 tabs persist to Neon via API.
 * Route: /admin/settings
 */

import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../api/client';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface Thresholds {
  MIN_DEPOSIT: number; MAX_DEPOSIT: number; DAILY_WITHDRAWAL_LIMIT: number;
  INSTITUTIONAL_MIN: number; RETAIL_MAX: number; KYB_THRESHOLD_EUR: number;
  TXN_FLAG_LARGE: number; TXN_FLAG_VERY_LARGE: number; STRUCTURING_THRESHOLD: number;
  STRUCTURING_TOTAL_THRESHOLD: number; VELOCITY_THRESHOLD_PER_HOUR: number;
  DEFAULT_LOCKUP_DAYS: number; MIN_INVESTMENT_RETURN: number;
}

interface FeeSettings { management_fee: number; performance_fee: number; hurdle_rate: number; }
interface ComplianceSettings { kycRequired: boolean; accreditationRequired: boolean; autoApproveLowRisk: boolean; }
interface GeneralSettings { platform_name: string; support_email: string; network: string; }

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'fees' | 'limits' | 'compliance'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  // State for all tabs
  const [thresholds, setThresholds] = useState<Thresholds>({
    MIN_DEPOSIT: 1000, MAX_DEPOSIT: 1000000, DAILY_WITHDRAWAL_LIMIT: 500000,
    INSTITUTIONAL_MIN: 100000, RETAIL_MAX: 90000, KYB_THRESHOLD_EUR: 100000,
    TXN_FLAG_LARGE: 100000, TXN_FLAG_VERY_LARGE: 500000, STRUCTURING_THRESHOLD: 3000,
    STRUCTURING_TOTAL_THRESHOLD: 10000, VELOCITY_THRESHOLD_PER_HOUR: 10,
    DEFAULT_LOCKUP_DAYS: 365, MIN_INVESTMENT_RETURN: 1000,
  });
  const [thresholdReason, setThresholdReason] = useState('');
  const [general, setGeneral] = useState<GeneralSettings>({ platform_name: '', support_email: '', network: '' });
  const [fees, setFees] = useState<FeeSettings>({ management_fee: 0, performance_fee: 0, hurdle_rate: 0 });
  const [compliance, setCompliance] = useState<ComplianceSettings>({ kycRequired: true, accreditationRequired: true, autoApproveLowRisk: true });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [t, g, f, c] = await Promise.allSettled([
        apiClient.get('/admin/thresholds'),
        apiClient.get('/admin/settings/general'),
        apiClient.get('/admin/settings/fees'),
        apiClient.get('/admin/settings/compliance'),
      ]);
      if (t.status === 'fulfilled' && t.value.data?.thresholds) setThresholds(prev => ({ ...prev, ...t.value.data.thresholds }));
      if (g.status === 'fulfilled' && g.value.data) setGeneral(g.value.data);
      if (f.status === 'fulfilled' && f.value.data) setFees(f.value.data);
      if (c.status === 'fulfilled' && c.value.data) setCompliance(c.value.data);
    } catch (e: any) {
      console.warn('Some settings failed to load:', e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const showStatus = (msg: string, ok: boolean) => {
    setStatusMsg(msg); setStatusType(ok ? 'success' : 'error');
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const saveThresholds = async () => {
    if (!thresholdReason.trim()) { showStatus('Reason required for audit trail', false); return; }
    try {
      setSaving(true);
      await apiClient.post('/admin/thresholds', { thresholds, reason: thresholdReason });
      showStatus('Limits saved to database', true); setThresholdReason('');
    } catch (e: any) { showStatus(e.response?.data?.detail || 'Failed', false); }
    finally { setSaving(false); }
  };

  const saveGeneral = async () => {
    try {
      setSaving(true);
      await apiClient.put('/admin/settings/general', general);
      showStatus('General settings saved to database', true);
    } catch (e: any) { showStatus(e.response?.data?.detail || 'Failed', false); }
    finally { setSaving(false); }
  };

  const saveFees = async () => {
    try {
      setSaving(true);
      await apiClient.put('/admin/settings/fees', fees);
      showStatus('Fee settings saved to database', true);
    } catch (e: any) { showStatus(e.response?.data?.detail || 'Failed', false); }
    finally { setSaving(false); }
  };

  const saveCompliance = async () => {
    try {
      setSaving(true);
      await apiClient.put('/admin/settings/compliance', compliance);
      showStatus('Compliance settings saved to database', true);
    } catch (e: any) { showStatus(e.response?.data?.detail || 'Failed', false); }
    finally { setSaving(false); }
  };

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'general', label: 'General' }, { key: 'fees', label: 'Fees' },
    { key: 'limits', label: 'Limits' }, { key: 'compliance', label: 'Compliance' },
  ];

  const Input = ({ label, value, onChange, type = 'text', placeholder, hint, step }: any) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input type={type} value={value} step={step} onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]" />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );

  const SaveBar = ({ onClick, label }: any) => (
    <div className="pt-4 flex items-center gap-3">
      <Button variant="primary" size="lg" onClick={onClick} disabled={saving}>{saving ? 'Saving...' : label || 'Save'}</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Platform Settings</h1>
              <p className="text-[#8b5b3d] mt-1">Configure platform parameters</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {statusMsg && (
          <div className={`mb-4 px-4 py-3 rounded-lg ${statusType === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {statusMsg}
          </div>
        )}

        <Card className="mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map(t => (
              <button key={t.key} onClick={() => { setActiveTab(t.key); setStatusMsg(null); }}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === t.key ? 'text-[#00A8A8] border-b-2 border-[#00A8A8]' : 'text-gray-500 hover:text-gray-700'
                }`}>{t.label}</button>
            ))}
          </div>
        </Card>

        {loading && <p className="text-center py-8 text-gray-500">Loading settings...</p>}

        {/* ── General ── */}
        {!loading && activeTab === 'general' && (
          <Card>
            <h3 className="text-xl font-bold text-[#103b5b] mb-6">General Settings</h3>
            <div className="space-y-6">
              <Input label="Platform Name" value={general.platform_name} onChange={(v: string) => setGeneral(g => ({ ...g, platform_name: v }))} />
              <Input label="Support Email" type="email" value={general.support_email} onChange={(v: string) => setGeneral(g => ({ ...g, support_email: v }))} />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Network</label>
                <select value={general.network} onChange={e => setGeneral(g => ({ ...g, network: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]">
                  <option value="testnet">Polygon Amoy Testnet</option>
                  <option value="mainnet">Polygon Mainnet</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Current: {general.network === 'testnet' ? 'Testnet Mode' : 'Mainnet Mode'}</p>
              </div>
              <SaveBar onClick={saveGeneral} label="Save General Settings" />
            </div>
          </Card>
        )}

        {/* ── Fees ── */}
        {!loading && activeTab === 'fees' && (
          <Card>
            <h3 className="text-xl font-bold text-[#103b5b] mb-6">Fee Configuration</h3>
            <div className="space-y-6">
              <Input label="Management Fee (%)" type="number" step="0.1" value={fees.management_fee} onChange={(v: number) => setFees(f => ({ ...f, management_fee: v }))} hint="Annual management fee charged on AUM" />
              <Input label="Performance Fee (%)" type="number" step="0.1" value={fees.performance_fee} onChange={(v: number) => setFees(f => ({ ...f, performance_fee: v }))} hint="Performance fee on returns above hurdle rate" />
              <Input label="Hurdle Rate (%)" type="number" step="0.1" value={fees.hurdle_rate} onChange={(v: number) => setFees(f => ({ ...f, hurdle_rate: v }))} hint="Minimum return before performance fee applies" />
              <SaveBar onClick={saveFees} label="Save Fee Settings" />
            </div>
          </Card>
        )}

        {/* ── Limits ── */}
        {!loading && activeTab === 'limits' && (
          <Card>
            <h3 className="text-xl font-bold text-[#103b5b] mb-6">Investment Limits</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Minimum Deposit (€)" type="number" value={thresholds.MIN_DEPOSIT} onChange={(v: number) => setThresholds(t => ({ ...t, MIN_DEPOSIT: v }))} />
                <Input label="Maximum Deposit (€)" type="number" value={thresholds.MAX_DEPOSIT} onChange={(v: number) => setThresholds(t => ({ ...t, MAX_DEPOSIT: v }))} />
                <Input label="Daily Withdrawal Limit (€)" type="number" value={thresholds.DAILY_WITHDRAWAL_LIMIT} onChange={(v: number) => setThresholds(t => ({ ...t, DAILY_WITHDRAWAL_LIMIT: v }))} />
                <Input label="Institutional Minimum (€)" type="number" value={thresholds.INSTITUTIONAL_MIN} onChange={(v: number) => setThresholds(t => ({ ...t, INSTITUTIONAL_MIN: v }))} />
                <Input label="Retail Maximum (€)" type="number" value={thresholds.RETAIL_MAX} onChange={(v: number) => setThresholds(t => ({ ...t, RETAIL_MAX: v }))} />
                <Input label="KYB Threshold (€)" type="number" value={thresholds.KYB_THRESHOLD_EUR} onChange={(v: number) => setThresholds(t => ({ ...t, KYB_THRESHOLD_EUR: v }))} />
                <Input label="Large Transaction Flag (€)" type="number" value={thresholds.TXN_FLAG_LARGE} onChange={(v: number) => setThresholds(t => ({ ...t, TXN_FLAG_LARGE: v }))} />
                <Input label="Very Large Transaction Flag (€)" type="number" value={thresholds.TXN_FLAG_VERY_LARGE} onChange={(v: number) => setThresholds(t => ({ ...t, TXN_FLAG_VERY_LARGE: v }))} />
                <Input label="Structuring Detection (€)" type="number" value={thresholds.STRUCTURING_THRESHOLD} onChange={(v: number) => setThresholds(t => ({ ...t, STRUCTURING_THRESHOLD: v }))} />
                <Input label="Structuring Total (€)" type="number" value={thresholds.STRUCTURING_TOTAL_THRESHOLD} onChange={(v: number) => setThresholds(t => ({ ...t, STRUCTURING_TOTAL_THRESHOLD: v }))} />
                <Input label="Velocity (txns/hour)" type="number" value={thresholds.VELOCITY_THRESHOLD_PER_HOUR} onChange={(v: number) => setThresholds(t => ({ ...t, VELOCITY_THRESHOLD_PER_HOUR: v }))} />
                <Input label="Default Lockup (days)" type="number" value={thresholds.DEFAULT_LOCKUP_DAYS} onChange={(v: number) => setThresholds(t => ({ ...t, DEFAULT_LOCKUP_DAYS: v }))} />
                <Input label="Min Investment Return (€)" type="number" value={thresholds.MIN_INVESTMENT_RETURN} onChange={(v: number) => setThresholds(t => ({ ...t, MIN_INVESTMENT_RETURN: v }))} />
              </div>
              <Input label="Reason for Change *" value={thresholdReason} onChange={setThresholdReason} placeholder="Required for audit trail" />
              <SaveBar onClick={saveThresholds} label="Save Limits" />
            </div>
          </Card>
        )}

        {/* ── Compliance ── */}
        {!loading && activeTab === 'compliance' && (
          <Card>
            <h3 className="text-xl font-bold text-[#103b5b] mb-6">Compliance Settings</h3>
            <div className="space-y-6">
              {[
                { key: 'kycRequired' as const, label: 'KYC Required', desc: 'Require KYC verification for all investors' },
                { key: 'accreditationRequired' as const, label: 'Accreditation Required', desc: 'Require accreditation for institutional investors' },
                { key: 'autoApproveLowRisk' as const, label: 'Auto-approve Low Risk', desc: 'Automatically approve low-risk jurisdictions' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div><p className="font-semibold text-gray-900">{item.label}</p><p className="text-sm text-gray-500">{item.desc}</p></div>
                  <input type="checkbox" checked={Boolean(compliance[item.key])} onChange={e => setCompliance(c => ({ ...c, [item.key]: e.target.checked }))} className="w-5 h-5 text-[#00A8A8]" />
                </div>
              ))}
              <SaveBar onClick={saveCompliance} label="Save Compliance Settings" />
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Settings;
