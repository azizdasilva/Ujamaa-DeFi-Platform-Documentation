/**
 * Recurring Investment Setup Page
 *
 * Allows investors to set up automated recurring investments (DCA - Dollar Cost Averaging)
 *
 * Route: /investor/recurring-investment
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

type Frequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly';

interface RecurringInvestment {
  enabled: boolean;
  amount: number;
  frequency: Frequency;
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  startDate: string;
  endDate?: string;
  paymentMethod: 'bank' | 'wallet' | 'balance';
  selectedPools: string[]; // Pool IDs to invest in
  distributionStrategy: 'equal' | 'custom';
}

const RecurringInvestment: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<RecurringInvestment>({
    enabled: false,
    amount: 1000,
    frequency: 'monthly',
    dayOfMonth: 1,
    startDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'bank',
    selectedPools: [],
    distributionStrategy: 'equal',
  });
  const [saved, setSaved] = useState(false);

  const frequencies = [
    { id: 'weekly', label: 'Weekly', icon: '📅', description: 'Every week' },
    { id: 'biweekly', label: 'Bi-Weekly', icon: '📆', description: 'Every 2 weeks' },
    { id: 'monthly', label: 'Monthly', icon: '🗓️', description: 'Every month' },
    { id: 'quarterly', label: 'Quarterly', icon: '📊', description: 'Every 3 months' },
  ];

  const paymentMethods = [
    { id: 'bank', label: 'Bank Transfer', icon: '🏦', description: 'Direct debit from your bank account', fee: 'Free' },
    { id: 'wallet', label: 'Crypto Wallet', icon: '🦊', description: 'Automatic debit from connected wallet', fee: 'Gas fees apply' },
    { id: 'balance', label: 'Platform Balance', icon: '💼', description: 'From your available balance', fee: 'Free' },
  ];

  const availablePools = [
    { id: '1', name: 'Pool Industry - Manufacturing #12', apy: 11.5, risk: 'Medium', minInvestment: 1000 },
    { id: '2', name: 'Pool Agriculture - Coffee Export #8', apy: 13.2, risk: 'Medium-High', minInvestment: 1000 },
    { id: '3', name: 'Pool Trade Finance - Invoice Pool #5', apy: 9.5, risk: 'Low', minInvestment: 500 },
    { id: '4', name: 'Pool Renewable Energy - Solar #3', apy: 10.2, risk: 'Low-Medium', minInvestment: 2000 },
  ];

  const handleSave = () => {
    // In production, this would save to backend
    setSettings({ ...settings, enabled: true });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setSettings({
      ...settings,
      enabled: false,
    });
  };

  const togglePoolSelection = (poolId: string) => {
    setSettings(prev => ({
      ...prev,
      selectedPools: prev.selectedPools.includes(poolId)
        ? prev.selectedPools.filter(id => id !== poolId)
        : [...prev.selectedPools, poolId],
    }));
  };

  const calculateProjection = () => {
    const monthlyAmount = settings.frequency === 'weekly' ? settings.amount * 4
      : settings.frequency === 'biweekly' ? settings.amount * 2
      : settings.frequency === 'monthly' ? settings.amount
      : settings.amount / 3;

    const yearlyInvestment = monthlyAmount * 12;
    const projectedValue5Years = Math.round(yearlyInvestment * 5 * 1.10); // 10% APY

    return {
      monthlyInvestment: monthlyAmount,
      yearlyInvestment,
      projectedValue5Years,
    };
  };

  const projection = calculateProjection();

  return (
    <div className="min-h-screen bg-gray-50">
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recurring Investment</h1>
              <p className="text-gray-600 mt-1">Set up automated investments (DCA)</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Status Banner */}
        {settings.enabled ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-green-900">Recurring Investment is Active</h3>
                <p className="text-sm text-green-700 mt-1">
                  €{settings.amount.toLocaleString()} will be invested {settings.frequency} on the {settings.dayOfMonth}th
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Cancel Plan
                  </button>
                  <button
                    onClick={() => {}}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Edit Settings
                  </button>
                </div>
              </div>
              <Badge variant="success" size="sm">ACTIVE</Badge>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900">Set Up Automated Investing</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Dollar-cost averaging (DCA) helps you invest consistently regardless of market conditions.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Investment Amount */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">💰 Investment Amount</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount per Investment (EUR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">€</span>
                    <input
                      type="number"
                      value={settings.amount}
                      onChange={(e) => setSettings({ ...settings, amount: parseInt(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold"
                      min="100"
                      step="100"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Minimum: €100 per investment</p>
                </div>

                {/* Quick Amount Buttons */}
                <div className="flex gap-2">
                  {[500, 1000, 2500, 5000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setSettings({ ...settings, amount })}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        settings.amount === amount
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      €{amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Frequency */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Investment Frequency</h2>
              <div className="grid grid-cols-2 gap-4">
                {frequencies.map((freq) => (
                  <button
                    key={freq.id}
                    onClick={() => setSettings({ ...settings, frequency: freq.id as Frequency })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      settings.frequency === freq.id
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-3xl mb-2 block">{freq.icon}</span>
                    <p className="font-semibold text-gray-900">{freq.label}</p>
                    <p className="text-sm text-gray-600">{freq.description}</p>
                  </button>
                ))}
              </div>

              {/* Day Selection */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Investment Day
                </label>
                <select
                  value={settings.dayOfMonth}
                  onChange={(e) => setSettings({ ...settings, dayOfMonth: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of each month
                    </option>
                  ))}
                </select>
              </div>
            </Card>

            {/* Payment Method */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">💳 Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSettings({ ...settings, paymentMethod: method.id as 'bank' | 'wallet' | 'balance' })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      settings.paymentMethod === method.id
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{method.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{method.label}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={method.fee === 'Free' ? 'success' : 'warning'} size="sm">
                          {method.fee}
                        </Badge>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          settings.paymentMethod === method.id
                            ? 'border-green-600 bg-green-600'
                            : 'border-gray-300'
                        }`}>
                          {settings.paymentMethod === method.id && (
                            <div className="w-2.5 h-2.5 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Pool Selection */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Select Pools</h2>
              <div className="mb-4">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setSettings({ ...settings, distributionStrategy: 'equal' })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      settings.distributionStrategy === 'equal'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Equal Distribution
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, distributionStrategy: 'custom' })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      settings.distributionStrategy === 'custom'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Custom Allocation
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {availablePools.map((pool) => {
                  const isSelected = settings.selectedPools.includes(pool.id);
                  return (
                    <button
                      key={pool.id}
                      onClick={() => togglePoolSelection(pool.id)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-semibold text-gray-900">{pool.name}</p>
                            <Badge variant="success" size="sm">{pool.apy}% APY</Badge>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <span className="text-gray-600">Risk: <span className="font-medium">{pool.risk}</span></span>
                            <span className="text-gray-600">Min: <span className="font-medium">€{pool.minInvestment.toLocaleString()}</span></span>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-green-600 bg-green-600' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Investment Summary */}
            <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
              <h3 className="font-bold text-gray-900 mb-4">📊 Investment Summary</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Per Investment</p>
                  <p className="text-2xl font-bold text-gray-900">€{settings.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Frequency</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{settings.frequency}</p>
                </div>
                <div className="pt-4 border-t border-green-200">
                  <p className="text-sm text-gray-600">Monthly Investment</p>
                  <p className="text-2xl font-bold text-green-600">€{projection.monthlyInvestment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Yearly Investment</p>
                  <p className="text-2xl font-bold text-green-600">€{projection.yearlyInvestment.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            {/* 5-Year Projection */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">📈 5-Year Projection</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Invested</p>
                  <p className="text-xl font-bold text-gray-900">€{(projection.yearlyInvestment * 5).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">Projected Value (10% APY)</p>
                  <p className="text-xl font-bold text-green-600">€{projection.projectedValue5Years.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">Estimated Returns</p>
                  <p className="text-xl font-bold text-blue-600">+€{(projection.projectedValue5Years - (projection.yearlyInvestment * 5)).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                * Projections are estimates based on 10% APY. Actual returns may vary.
              </p>
            </Card>

            {/* Benefits */}
            <Card className="bg-blue-50 border-blue-200">
              <h3 className="font-bold text-blue-900 mb-3">✨ Benefits of DCA</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold">✓</span>
                  <span>Reduces impact of market volatility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">✓</span>
                  <span>No need to time the market</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">✓</span>
                  <span>Builds disciplined investing habits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">✓</span>
                  <span>Compound returns over time</span>
                </li>
              </ul>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSave}
                disabled={settings.selectedPools.length === 0 || settings.amount < 100}
                className="w-full"
              >
                {saved ? '✓ Settings Saved!' : settings.enabled ? 'Update Plan' : 'Start Recurring Investment'}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/investor/portfolio')}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecurringInvestment;
