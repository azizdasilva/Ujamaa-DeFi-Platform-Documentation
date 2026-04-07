/**
 * Reinvestment Settings Page
 * Allows investors to configure yield distribution preferences
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

type ReinvestmentOption = 'all' | 'partial' | 'cash';

interface ReinvestmentSettings {
  option: ReinvestmentOption;
  percentage: number;
  autoCompound: boolean;
}

const ReinvestmentSettings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<ReinvestmentSettings>({
    option: 'all',
    percentage: 100,
    autoCompound: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const projectedReturns = calculateProjectedReturns(settings);

  return (
    <div className="min-h-screen bg-gray-50">
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reinvestment Settings</h1>
              <p className="text-gray-600 mt-1">Configure yield distributions</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header Card */}
          <Card className="bg-gradient-to-r from-green-600 to-teal-600 border-0">
            <div className="text-white p-8">
              <h1 className="text-3xl font-bold mb-4">💰 Reinvestment Settings</h1>
              <p className="opacity-90">
                Configure how your yield distributions are handled. Choose to reinvest for compound growth or receive cash distributions.
              </p>
            </div>
          </Card>

          {/* Reinvestment Option */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Distribution Preference</h2>
          
            <div className="space-y-4">
              <ReinvestmentCard
                title="Reinvest All"
                description="Automatically reinvest 100% of yield for maximum compound growth"
                icon="🚀"
                selected={settings.option === 'all'}
                onSelect={() => setSettings({ ...settings, option: 'all', percentage: 100 })}
                recommended
              />
              <ReinvestmentCard
                title="Partial Reinvestment"
                description="Reinvest a portion and receive the rest as cash distribution"
                icon="⚖️"
                selected={settings.option === 'partial'}
                onSelect={() => setSettings({ ...settings, option: 'partial' })}
              />
              <ReinvestmentCard
                title="Take Cash"
                description="Receive all yield as cash distribution to your wallet"
                icon="💵"
                selected={settings.option === 'cash'}
                onSelect={() => setSettings({ ...settings, option: 'cash' })}
              />
            </div>

            {/* Partial Reinvestment Slider */}
            {settings.option === 'partial' && (
              <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  Reinvestment Percentage: {settings.percentage}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.percentage}
                  onChange={(e) => setSettings({ ...settings, percentage: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>0% Cash</span>
                  <span>50%</span>
                  <span>100% Reinvest</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center border border-green-200">
                    <p className="text-sm text-gray-600">Reinvested</p>
                    <p className="text-2xl font-bold text-green-600">{settings.percentage}%</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border border-blue-200">
                    <p className="text-sm text-gray-600">Cash Distribution</p>
                    <p className="text-2xl font-bold text-blue-600">{100 - settings.percentage}%</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Compound Frequency */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Compound Frequency</h2>

            <div className="p-6 bg-green-50 rounded-xl border-2 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-lg">Quarterly</p>
                  <p className="text-sm text-gray-600">4 compoundings per year</p>
                </div>
                <Badge variant="success" size="md">✓ Active</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Yield is reinvested quarterly, and reinvested yield starts earning additional yield from the next quarter.
              </p>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="autoCompound"
                  checked={settings.autoCompound}
                  onChange={(e) => setSettings({ ...settings, autoCompound: e.target.checked })}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="autoCompound" className="text-gray-700 font-bold">
                  Enable automatic compounding
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-2 ml-8">
                When enabled, yield is automatically reinvested quarterly
              </p>
            </div>
          </Card>

          {/* Projected Returns */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Projected Returns</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Year</th>
                    <th className="px-6 py-4 text-left">With Reinvestment</th>
                    <th className="px-6 py-4 text-left">Cash Distribution</th>
                    <th className="px-6 py-4 text-left">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {projectedReturns.map((year) => (
                    <tr key={year.year} className={`border-b ${year.year % 2 === 0 ? 'bg-gray-50' : ''}`}>
                      <td className="px-6 py-4 font-bold text-gray-900">Year {year.year}</td>
                      <td className="px-6 py-4 text-green-600 font-bold">€{year.withReinvestment.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-700">€{year.cashDistribution.toLocaleString()}</td>
                      <td className="px-6 py-4 text-teal-600 font-bold">+€{year.difference.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              * Based on €10,000 investment at 10% APY. Actual returns may vary.
            </p>
          </Card>

          {/* Current Holdings */}
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Current Holdings</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow">
                <p className="text-sm text-gray-600 mb-2">uLP Balance</p>
                <p className="text-3xl font-bold text-gray-900">10,000</p>
                <p className="text-sm text-gray-600">uLP tokens</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow">
                <p className="text-sm text-gray-600 mb-2">Current Value</p>
                <p className="text-3xl font-bold text-green-600">€10,850</p>
                <p className="text-sm text-green-600">+8.5% this year</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow">
                <p className="text-sm text-gray-600 mb-2">Yield Earned</p>
                <p className="text-3xl font-bold text-gray-900">€850</p>
                <p className="text-sm text-gray-600">Accrued to date</p>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
            >
              {saved ? '✓ Settings Saved!' : 'Save Settings'}
            </Button>
          </div>

          {/* Info Box */}
          <Card className="bg-blue-50 border-blue-200">
            <h3 className="font-bold text-blue-900 mb-2">ℹ️ How Reinvestment Works</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• <strong>Reinvest All:</strong> 100% of yield is reinvested into the pool, increasing your pool share</li>
              <li>• <strong>Partial:</strong> Selected percentage reinvested, rest distributed to wallet</li>
              <li>• <strong>Cash:</strong> All yield distributed to your connected wallet</li>
              <li>• <strong>Compound Frequency:</strong> Reinvested yield starts earning additional yield each quarter</li>
              <li>• <strong>No Fees:</strong> Reinvestment is always free on Ujamaa DeFi Platform</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
};

// Sub-components

interface ReinvestmentCardProps {
  title: string;
  description: string;
  icon: string;
  selected: boolean;
  onSelect: () => void;
  recommended?: boolean;
}

const ReinvestmentCard: React.FC<ReinvestmentCardProps> = ({
  title,
  description,
  icon,
  selected,
  onSelect,
  recommended,
}) => (
  <button
    onClick={onSelect}
    className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
      selected
        ? 'border-green-600 bg-green-50 shadow-lg'
        : 'border-gray-200 hover:border-gray-300 hover:shadow'
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <span className="text-4xl">{icon}</span>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">{title}</h3>
            {recommended && (
              <Badge variant="success" size="sm">Recommended</Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          selected ? 'border-green-600 bg-green-600' : 'border-gray-300'
        }`}
      >
        {selected && <div className="w-3 h-3 bg-white rounded-full" />}
      </div>
    </div>
  </button>
);

// Helper function
function calculateProjectedReturns(settings: ReinvestmentSettings) {
  const principal = 10000;
  const rate = 0.10; // 10% APY
  const compoundingsPerYear = 4; // Always quarterly

  const reinvestmentRate = settings.option === 'cash' ? 0 : settings.percentage / 100;

  return [1, 2, 3, 4, 5].map((year) => {
    // With compound reinvestment
    const withReinvestment = Math.round(
      principal * Math.pow(1 + rate / compoundingsPerYear, compoundingsPerYear * year * reinvestmentRate)
    );

    // Simple cash distribution (no compounding)
    const cashDistribution = Math.round(principal + (principal * rate * year * (1 - reinvestmentRate)));

    return {
      year,
      withReinvestment,
      cashDistribution,
      difference: withReinvestment - cashDistribution,
    };
  });
}

export default ReinvestmentSettings;
