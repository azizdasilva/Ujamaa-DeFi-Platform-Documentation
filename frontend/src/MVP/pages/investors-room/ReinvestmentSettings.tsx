/**
 * Reinvestment Settings Page
 * Allows investors to configure yield distribution preferences
 */

import React, { useState } from 'react';
import DocPage from './DocPage';
import { useNavigate } from 'react-router-dom';

type ReinvestmentOption = 'all' | 'partial' | 'cash';
type Frequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

interface ReinvestmentSettings {
  option: ReinvestmentOption;
  percentage: number;
  frequency: Frequency;
  autoCompound: boolean;
}

const ReinvestmentSettings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<ReinvestmentSettings>({
    option: 'all',
    percentage: 100,
    frequency: 'quarterly',
    autoCompound: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In production, this would save to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const projectedReturns = calculateProjectedReturns(settings);

  return (
    <DocPage
      title="Reinvestment Settings"
      category="Account Settings"
      categoryId="settings"
      lastUpdated="March 21, 2026"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <section className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] rounded-xl shadow-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-4">💰 Reinvestment Settings</h1>
          <p className="opacity-90">
            Configure how your yield distributions are handled. Choose to reinvest for compound growth or receive cash distributions.
          </p>
        </section>

        {/* Reinvestment Option */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#023D7A] mb-6">Distribution Preference</h2>
          
          <div className="space-y-4">
            <ReinvestmentCard
              id="all"
              title="Reinvest All"
              description="Automatically reinvest 100% of yield for maximum compound growth"
              icon="🚀"
              selected={settings.option === 'all'}
              onSelect={() => setSettings({ ...settings, option: 'all', percentage: 100 })}
              recommended
            />
            <ReinvestmentCard
              id="partial"
              title="Partial Reinvestment"
              description="Reinvest a portion and receive the rest as cash distribution"
              icon="⚖️"
              selected={settings.option === 'partial'}
              onSelect={() => setSettings({ ...settings, option: 'partial' })}
            />
            <ReinvestmentCard
              id="cash"
              title="Take Cash"
              description="Receive all yield as cash distribution to your wallet"
              icon="💵"
              selected={settings.option === 'cash'}
              onSelect={() => setSettings({ ...settings, option: 'cash' })}
            />
          </div>

          {/* Partial Reinvestment Slider */}
          {settings.option === 'partial' && (
            <div className="mt-6 p-6 bg-[#F3F8FA] rounded-xl">
              <label className="block text-sm font-bold text-[#023D7A] mb-4">
                Reinvestment Percentage: {settings.percentage}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.percentage}
                onChange={(e) => setSettings({ ...settings, percentage: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00A8A8]"
              />
              <div className="flex justify-between mt-2 text-sm text-[#333333]">
                <span>0% Cash</span>
                <span>50%</span>
                <span>100% Reinvest</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-[#333333]">Reinvested</p>
                  <p className="text-2xl font-bold text-[#00A8A8]">{settings.percentage}%</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-[#333333]">Cash Distribution</p>
                  <p className="text-2xl font-bold text-[#023D7A]">{100 - settings.percentage}%</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Compound Frequency */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#023D7A] mb-6">Compound Frequency</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'daily', label: 'Daily', compoundings: 365 },
              { id: 'weekly', label: 'Weekly', compoundings: 52 },
              { id: 'monthly', label: 'Monthly', compoundings: 12 },
              { id: 'quarterly', label: 'Quarterly', compoundings: 4 },
            ].map((freq) => (
              <button
                key={freq.id}
                onClick={() => setSettings({ ...settings, frequency: freq.id as Frequency })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  settings.frequency === freq.id
                    ? 'border-[#00A8A8] bg-[#00A8A8]/10'
                    : 'border-gray-200 hover:border-[#00A8A8]/50'
                }`}
              >
                <p className="font-bold text-[#023D7A]">{freq.label}</p>
                <p className="text-xs text-[#333333]">{freq.compoundings}x/year</p>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-[#F3F8FA] rounded-lg">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoCompound"
                checked={settings.autoCompound}
                onChange={(e) => setSettings({ ...settings, autoCompound: e.target.checked })}
                className="w-5 h-5 text-[#00A8A8] rounded focus:ring-[#00A8A8]"
              />
              <label htmlFor="autoCompound" className="text-[#023D7A] font-bold">
                Enable automatic compounding
              </label>
            </div>
            <p className="text-sm text-[#333333] mt-2 ml-8">
              When enabled, yield is automatically reinvested at your selected frequency
            </p>
          </div>
        </section>

        {/* Projected Returns */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#023D7A] mb-6">📈 Projected Returns</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#023D7A] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Year</th>
                  <th className="px-6 py-4 text-left">With Reinvestment</th>
                  <th className="px-6 py-4 text-left">Cash Distribution</th>
                  <th className="px-6 py-4 text-left">Difference</th>
                </tr>
              </thead>
              <tbody>
                {projectedReturns.map((year) => (
                  <tr key={year.year} className={`border-b ${year.year % 2 === 0 ? 'bg-[#F3F8FA]' : ''}`}>
                    <td className="px-6 py-4 font-bold text-[#023D7A]">Year {year.year}</td>
                    <td className="px-6 py-4 text-green-600 font-bold">€{year.withReinvestment.toLocaleString()}</td>
                    <td className="px-6 py-4 text-[#333333]">€{year.cashDistribution.toLocaleString()}</td>
                    <td className="px-6 py-4 text-[#00A8A8] font-bold">+€{year.difference.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#333333] mt-4">
            * Based on €10,000 investment at 10% APY. Actual returns may vary.
          </p>
        </section>

        {/* Current Holdings */}
        <section className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 rounded-xl border-2 border-[#00A8A8]/30 p-8">
          <h2 className="text-2xl font-bold text-[#023D7A] mb-6">Your Current Holdings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <p className="text-sm text-[#333333] mb-2">uLP Balance</p>
              <p className="text-3xl font-bold text-[#023D7A]">10,000</p>
              <p className="text-sm text-[#333333]">uLP tokens</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <p className="text-sm text-[#333333] mb-2">Current Value</p>
              <p className="text-3xl font-bold text-[#00A8A8]">€10,850</p>
              <p className="text-sm text-green-600">+8.5% this year</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <p className="text-sm text-[#333333] mb-2">Yield Earned</p>
              <p className="text-3xl font-bold text-[#023D7A]">€850</p>
              <p className="text-sm text-[#333333]">Accrued to date</p>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <section className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/investors-room')}
            className="px-6 py-3 bg-white border-2 border-[#48A9F0]/30 text-[#023D7A] font-bold rounded-lg hover:bg-[#F3F8FA] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-8 py-3 rounded-lg font-bold text-white transition-all ${
              saved
                ? 'bg-green-500'
                : 'bg-gradient-to-r from-[#023D7A] to-[#00A8A8] hover:shadow-lg'
            }`}
          >
            {saved ? '✓ Settings Saved!' : 'Save Settings'}
          </button>
        </section>

        {/* Info Box */}
        <section className="bg-[#F3F8FA] rounded-xl p-6 border-l-4 border-[#00A8A8]">
          <h3 className="font-bold text-[#023D7A] mb-2">ℹ️ How Reinvestment Works</h3>
          <ul className="space-y-2 text-sm text-[#333333]">
            <li>• <strong>Reinvest All:</strong> 100% of yield buys more uLP tokens at current NAV</li>
            <li>• <strong>Partial:</strong> Selected percentage reinvested, rest distributed to wallet</li>
            <li>• <strong>Cash:</strong> All yield distributed to your connected wallet</li>
            <li>• <strong>Compound Frequency:</strong> How often reinvested yield starts earning more yield</li>
            <li>• <strong>No Fees:</strong> Reinvestment is always free on Ujamaa Platform</li>
          </ul>
        </section>
      </div>
    </DocPage>
  );
};

// Sub-components

interface ReinvestmentCardProps {
  id: ReinvestmentOption;
  title: string;
  description: string;
  icon: string;
  selected: boolean;
  onSelect: () => void;
  recommended?: boolean;
}

const ReinvestmentCard: React.FC<ReinvestmentCardProps> = ({
  id,
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
        ? 'border-[#00A8A8] bg-[#00A8A8]/10 shadow-lg'
        : 'border-gray-200 hover:border-[#00A8A8]/50 hover:shadow'
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <span className="text-4xl">{icon}</span>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#023D7A]">{title}</h3>
            {recommended && (
              <span className="px-2 py-0.5 bg-[#00A8A8] text-white text-xs font-bold rounded">
                Recommended
              </span>
            )}
          </div>
          <p className="text-sm text-[#333333] mt-1">{description}</p>
        </div>
      </div>
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          selected ? 'border-[#00A8A8] bg-[#00A8A8]' : 'border-gray-300'
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
  const compoundingsPerYear = {
    daily: 365,
    weekly: 52,
    monthly: 12,
    quarterly: 4,
  }[settings.frequency];

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
