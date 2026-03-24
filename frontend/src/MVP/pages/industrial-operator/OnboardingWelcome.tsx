/**
 * Industrial Operator Onboarding Flow - Step 1: Welcome
 *
 * First step of the Industrial Operator onboarding wizard.
 * Industrial Operators are companies seeking financing through asset tokenization.
 *
 * Route: /industrial-operator/onboarding
 *
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

const IndustrialOperatorWelcome: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'manufacturer' | 'agricultural' | 'trader' | null>(null);

  const operatorTypes = [
    {
      id: 'manufacturer',
      title: 'Manufacturing Company',
      subtitle: 'Industrial Production',
      description: 'Industrial manufacturing, production facilities',
      icon: '🏭',
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      selectedBorderColor: 'border-blue-500',
      features: [
        'Factory/production assets',
        'Equipment financing',
        'Working capital',
        'GDIZ certification available',
      ],
      financingRange: '€100K - €5M',
      targetApy: '10-12%',
      lockup: '365 days',
      bestFor: 'Factories, manufacturers, producers',
    },
    {
      id: 'agricultural',
      title: 'Agricultural Producer',
      subtitle: 'Agribusiness & Farming',
      description: 'Coffee, cocoa, cotton, cashew producers',
      icon: '🌱',
      color: 'from-green-600 to-emerald-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      selectedBorderColor: 'border-green-500',
      features: [
        'Crop financing',
        'Equipment & storage',
        'Export facilitation',
        'Seasonal terms available',
      ],
      financingRange: '€50K - €2M',
      targetApy: '12-15%',
      lockup: '180 days',
      bestFor: 'Farmers, cooperatives, agribusiness',
      popular: true,
    },
    {
      id: 'trader',
      title: 'Trading Company',
      subtitle: 'Import/Export',
      description: 'Import/export, trade finance',
      icon: '📦',
      color: 'from-amber-600 to-orange-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      selectedBorderColor: 'border-amber-500',
      features: [
        'Invoice financing',
        'Receivables tokenization',
        'Trade credit',
        'Quick turnaround (90 days)',
      ],
      financingRange: '€50K - €3M',
      targetApy: '8-10%',
      lockup: '90 days',
      bestFor: 'Traders, distributors, exporters',
    },
  ];

  const handleContinue = () => {
    if (selectedType) {
      navigate(`/industrial-operator/onboarding/${selectedType}/company`);
    }
  };

  const handleQuickStart = (typeId: string) => {
    setSelectedType(typeId as any);
    setTimeout(() => {
      navigate(`/industrial-operator/onboarding/${typeId}/company`);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      {/* MVP Banner */}
      <MVPBanner />

      {/* Header */}
      <header className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Industrial Operator Onboarding</h1>
              <p className="text-white/80 mt-1">Step 1 of 5: Select Your Business Type</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Print/Export"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <TestnetNotice variant="badge" />
            </div>
          </div>

          {/* Hero Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Total Financing</span>
                <span className="text-2xl">💰</span>
              </div>
              <div className="text-3xl font-bold">€50M+</div>
              <div className="text-xs text-white/70 mt-1">Available capital</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Avg. Rate</span>
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-3xl font-bold">8-15%</div>
              <div className="text-xs text-white/70 mt-1">APR based on pool</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Approval Time</span>
                <span className="text-2xl">⚡</span>
              </div>
              <div className="text-3xl font-bold">24h</div>
              <div className="text-xs text-white/70 mt-1">KYB verification</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Operators</span>
                <span className="text-2xl">🏢</span>
              </div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-xs text-white/70 mt-1">Financed companies</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#103b5b] mb-2">
            Choose Your Business Type
          </h2>
          <p className="text-[#8b5b3d] max-w-2xl mx-auto">
            Select the option that best describes your business. Each type has tailored financing terms and requirements.
          </p>
        </div>

        {/* Business Type Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto mb-8 pb-2">
          {operatorTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id as any)}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all shadow-sm
                ${selectedType === type.id
                  ? `bg-gradient-to-r ${type.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              <span className="text-xl">{type.icon}</span>
              <span>{type.title}</span>
            </button>
          ))}
        </div>

        {/* Business Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {operatorTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => setSelectedType(type.id as any)}
              className={`
                cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
                ${selectedType === type.id
                  ? `ring-3 ${type.selectedBorderColor} shadow-xl scale-[1.02]`
                  : `hover:shadow-lg border ${type.borderColor}`
                }
                ${type.bgColor}
                rounded-2xl overflow-hidden
              `}
            >
              <Card className="h-full relative">
                {/* Popular Badge */}
                {type.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="primary" size="sm">Most Popular</Badge>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                  {type.icon}
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-2xl font-bold text-[#103b5b] mb-1">
                  {type.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 font-medium">{type.subtitle}</p>
                <p className="text-[#8b5b3d] mb-4">{type.description}</p>

                {/* Financing Range */}
                <div className="mb-4">
                  <Badge variant="primary" size="lg">
                    {type.financingRange}
                  </Badge>
                </div>

                {/* Quick Info */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{type.targetApy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">{type.lockup}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-4">
                  {type.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-[#00A8A8] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Best For */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Best for:</p>
                  <p className="text-sm font-medium text-[#103b5b]">{type.bestFor}</p>
                </div>

                {/* Selection Indicator */}
                <div className={`mt-4 text-center py-2 rounded-lg transition-all ${
                  selectedType === type.id
                    ? 'bg-green-100 text-green-700 font-semibold'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {selectedType === type.id ? '✓ Selected' : 'Click to select'}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mb-8">
          <Card>
            <h3 className="text-xl font-bold text-[#103b5b] mb-4 text-center">Quick Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-[#103b5b]">Feature</th>
                    <th className="text-center py-3 px-4 text-blue-600">Manufacturing</th>
                    <th className="text-center py-3 px-4 text-green-600">Agricultural</th>
                    <th className="text-center py-3 px-4 text-amber-600">Trading</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700 font-medium">Financing Range</td>
                    <td className="text-center py-3 px-4">€100K - €5M</td>
                    <td className="text-center py-3 px-4">€50K - €2M</td>
                    <td className="text-center py-3 px-4">€50K - €3M</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700 font-medium">Target APY</td>
                    <td className="text-center py-3 px-4">10-12%</td>
                    <td className="text-center py-3 px-4">12-15%</td>
                    <td className="text-center py-3 px-4">8-10%</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700 font-medium">Lock-up Period</td>
                    <td className="text-center py-3 px-4">365 days</td>
                    <td className="text-center py-3 px-4">180 days</td>
                    <td className="text-center py-3 px-4">90 days</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700 font-medium">Asset Types</td>
                    <td className="text-center py-3 px-4">Factory, Equipment</td>
                    <td className="text-center py-3 px-4">Crops, Inventory</td>
                    <td className="text-center py-3 px-4">Invoices, Receivables</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700 font-medium">Approval Time</td>
                    <td className="text-center py-3 px-4">24 hours</td>
                    <td className="text-center py-3 px-4">24 hours</td>
                    <td className="text-center py-3 px-4">24 hours</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-700 font-medium">Purpose</td>
                    <td className="text-center py-3 px-4">Borrow</td>
                    <td className="text-center py-3 px-4">Borrow</td>
                    <td className="text-center py-3 px-4">Borrow</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card header={<h2 className="text-xl font-bold text-[#103b5b]">⚡ Quick Stats</h2>}>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="text-sm text-green-700 mb-1">Highest APY</div>
                <div className="text-2xl font-bold text-green-900">🌱 Agricultural</div>
                <div className="text-sm text-green-700 mt-1">12-15% APR</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-sm text-blue-700 mb-1">Largest Financing</div>
                <div className="text-2xl font-bold text-blue-900">🏭 Manufacturing</div>
                <div className="text-sm text-blue-700 mt-1">Up to €5M</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="text-sm text-purple-700 mb-1">Fastest Turnaround</div>
                <div className="text-2xl font-bold text-purple-900">📦 Trading</div>
                <div className="text-sm text-purple-700 mt-1">90 days</div>
              </div>
            </div>
          </Card>

          {/* Requirements */}
          <Card className="lg:col-span-2" header={<h2 className="text-xl font-bold text-[#103b5b]">📋 Requirements</h2>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-[#103b5b] mb-3">Required Documents</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Valid business registration</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Tax compliance certificate</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Audited financial statements (2 years)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Asset documentation for collateral</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#103b5b] mb-3">Process Timeline</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-[#00A8A8] mt-0.5">→</span>
                    <span>Application submission</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-[#00A8A8] mt-0.5">→</span>
                    <span>KYB verification (24 hours)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-[#00A8A8] mt-0.5">→</span>
                    <span>Asset certification</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-[#00A8A8] mt-0.5">→</span>
                    <span>Capital deployment</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Important Information</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• All information provided must be accurate and up-to-date</li>
                <li>• Documents will be verified by our compliance team</li>
                <li>• Processing time: 24 hours for KYB verification</li>
                <li>• MVP Testnet: This is a demo onboarding with mock verification</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <a
            href="/select-role"
            className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Role Selection
          </a>
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              disabled={!selectedType}
              className={!selectedType ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Continue to Company Information
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Quick Start Buttons */}
        {!selectedType && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-3">Not sure? Try these quick starts:</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleQuickStart('manufacturer')}
                className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              >
                🏭 Manufacturing
              </button>
              <button
                onClick={() => handleQuickStart('agricultural')}
                className="px-4 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
              >
                🌱 Agricultural
              </button>
              <button
                onClick={() => handleQuickStart('trader')}
                className="px-4 py-2 text-sm bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors"
              >
                📦 Trading
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default IndustrialOperatorWelcome;
