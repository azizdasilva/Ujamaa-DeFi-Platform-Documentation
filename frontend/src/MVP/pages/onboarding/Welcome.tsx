/**
 * Onboarding Flow - Step 1: Welcome & Role Selection
 *
 * First step of the onboarding wizard where users select their investor type.
 * Improved UX with intuitive card selection and clear CTAs.
 *
 * Route: /onboarding
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

const OnboardingWelcome: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'retail' | 'institutional' | null>(null);

  const investorTypes = [
    {
      id: 'retail',
      title: 'Retail Investor',
      subtitle: 'Individual Investor',
      description: 'Start your investment journey with as little as €1,000',
      investmentRange: '€1,000 - €99,999',
      kycLevel: 'Standard KYC',
      approvalTime: '24 hours',
      features: [
        'Quick online application',
        'National ID verification',
        'Access to all investment pools',
        'Quarterly yield distributions',
      ],
      icon: '👤',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      selectedBorderColor: 'border-blue-500',
      bestFor: 'First-time investors, individuals',
    },
    {
      id: 'institutional',
      title: 'Institutional Investor',
      subtitle: 'Company, Fund, or Organization',
      description: 'Deploy significant capital with dedicated support and custom terms',
      investmentRange: '€100,000+',
      kycLevel: 'Enhanced KYB',
      approvalTime: '24 hours',
      features: [
        'Enhanced due diligence process',
        'UBO identification required',
        'Source of funds verification',
        'Dedicated relationship manager',
        'Custom investment structures',
        'Bulk investment capabilities',
      ],
      icon: '🏦',
      color: 'from-[#023D7A] to-[#00A8A8]',
      bgColor: 'bg-[#F3F8FA]',
      borderColor: 'border-[#023D7A]/20',
      selectedBorderColor: 'border-[#023D7A]',
      bestFor: 'Pension funds, family offices, HNWIs',
      popular: true,
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/onboarding/${selectedRole}/personal`);
    }
  };

  const handleQuickStart = (roleId: string) => {
    setSelectedRole(roleId as any);
    setTimeout(() => {
      navigate(`/onboarding/${roleId}/personal`);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      {/* MVP Banner */}
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Welcome to Ujamaa</h1>
              <p className="text-[#8b5b3d] mt-1">Step 1 of 5: Choose Your Path</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#103b5b] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <span className="text-sm font-medium text-[#103b5b]">Select Type</span>
            </div>
            <div className="flex-1 mx-4">
              <div className="w-full bg-[#103b5b]/10 rounded-full h-2">
                <div className="bg-[#d57028] h-2 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#103b5b]/10 text-[#8b5b3d] rounded-full flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <span className="text-sm text-[#8b5b3d]">Info</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#103b5b]/10 text-[#8b5b3d] rounded-full flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <span className="text-sm text-[#8b5b3d]">Docs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#103b5b]/10 text-[#8b5b3d] rounded-full flex items-center justify-center font-semibold text-sm">
                4
              </div>
              <span className="text-sm text-[#8b5b3d]">Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#103b5b]/10 text-[#8b5b3d] rounded-full flex items-center justify-center font-semibold text-sm">
                5
              </div>
              <span className="text-sm text-[#8b5b3d]">Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#103b5b] mb-3">
            How would you like to participate?
          </h2>
          <p className="text-lg text-[#8b5b3d] max-w-3xl mx-auto">
            Choose the option that best describes your goals. You can always add more details in the next steps.
          </p>
        </div>

        {/* Quick Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {investorTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => setSelectedRole(type.id as any)}
              className={`
                cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
                ${selectedRole === type.id
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

                {/* Investment Range */}
                <div className="mb-4">
                  <Badge variant="primary" size="lg">
                    {type.investmentRange}
                  </Badge>
                </div>

                {/* Quick Info */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{type.approvalTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{type.kycLevel}</span>
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
                  selectedRole === type.id
                    ? 'bg-green-100 text-green-700 font-semibold'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {selectedRole === type.id ? '✓ Selected' : 'Click to select'}
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
                    <th className="text-center py-3 px-4 text-blue-600">Retail</th>
                    <th className="text-center py-3 px-4 text-[#023D7A]">Institutional</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700 font-medium">Minimum Investment</td>
                    <td className="text-center py-3 px-4">€1,000</td>
                    <td className="text-center py-3 px-4">€100,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700 font-medium">Maximum Investment</td>
                    <td className="text-center py-3 px-4">€99,999</td>
                    <td className="text-center py-3 px-4">No limit</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700 font-medium">Verification</td>
                    <td className="text-center py-3 px-4">National ID</td>
                    <td className="text-center py-3 px-4">KYB + UBO</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700 font-medium">Approval Time</td>
                    <td className="text-center py-3 px-4">24 hours</td>
                    <td className="text-center py-3 px-4">24 hours</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700 font-medium">Support</td>
                    <td className="text-center py-3 px-4">Email</td>
                    <td className="text-center py-3 px-4">Dedicated</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-700 font-medium">Purpose</td>
                    <td className="text-center py-3 px-4">Invest</td>
                    <td className="text-center py-3 px-4">Invest</td>
                  </tr>
                </tbody>
              </table>
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
                <li>• Processing time: 24 hours for all submissions</li>
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
              disabled={!selectedRole}
              className={!selectedRole ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Continue to Personal Information
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Quick Start Buttons */}
        {!selectedRole && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-3">Not sure? Try these quick starts:</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleQuickStart('retail')}
                className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              >
                👤 Individual Investor
              </button>
              <button
                onClick={() => handleQuickStart('institutional')}
                className="px-4 py-2 text-sm bg-[#F3F8FA] hover:bg-[#E8F1F8] text-[#023D7A] rounded-lg transition-colors border border-[#023D7A]/20"
              >
                🏦 Company/Organization
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Looking to raise capital? Visit our{' '}
              <a href="/industrial-operator/onboarding" className="text-[#00A8A8] hover:underline font-medium">
                Industrial Operator onboarding
              </a>
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default OnboardingWelcome;
