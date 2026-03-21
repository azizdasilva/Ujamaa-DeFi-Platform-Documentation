/**
 * Onboarding Flow - Step 1: Welcome & Role Selection
 * 
 * First step of the onboarding wizard where users select their investor type.
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
  const [selectedRole, setSelectedRole] = useState<'retail' | 'institutional' | 'originator' | null>(null);

  const investorTypes = [
    {
      id: 'retail',
      title: 'Retail Investor',
      description: 'Individual investor',
      investmentRange: '€1,000 - €50,000',
      kycLevel: 'Standard KYC',
      features: [
        'Basic identity verification',
        'National ID required',
        'Quick approval (24-48 hours)',
        'Access to all pools',
      ],
      icon: '👤',
      color: 'from-blue-500 to-purple-500',
    },
    {
      id: 'institutional',
      title: 'Institutional Investor',
      description: 'Company, fund, or organization',
      investmentRange: '€100,000+',
      kycLevel: 'Enhanced KYB',
      features: [
        'Enhanced due diligence',
        'UBO identification required',
        'Source of funds verification',
        'Dedicated support',
        'Custom terms available',
      ],
      icon: '🏦',
      color: 'from-[#023D7A] to-[#00A8A8]',
    },
    {
      id: 'originator',
      title: 'Asset Originator',
      description: 'Industrial company seeking financing',
      investmentRange: 'N/A (Borrower)',
      kycLevel: 'Enhanced KYB',
      features: [
        'Business verification',
        'GDIZ certification (optional)',
        'Asset certification',
        'Access to capital',
        'Flexible terms',
      ],
      icon: '🏭',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/onboarding/${selectedRole}/personal`);
    }
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
              <h1 className="text-3xl font-bold text-[#103b5b]">Investor Onboarding</h1>
              <p className="text-[#8b5b3d] mt-1">Step 1 of 5: Select Your Investor Type</p>
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
              <span className="text-sm font-medium text-[#103b5b]">Welcome</span>
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
              <span className="text-sm text-[#8b5b3d]">Personal Info</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#103b5b]/10 text-[#8b5b3d] rounded-full flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <span className="text-sm text-[#8b5b3d]">Documents</span>
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
              <span className="text-sm text-[#8b5b3d]">Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#103b5b] mb-2">
            Welcome to Ujamaa DeFi Platform
          </h2>
          <p className="text-[#8b5b3d] max-w-2xl mx-auto">
            Start your investment journey in African real-world assets.
            Select your investor type below to begin the onboarding process.
          </p>
        </div>

        {/* Investor Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {investorTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => setSelectedRole(type.id as any)}
              className={`
                cursor-pointer transition-all duration-300
                ${selectedRole === type.id
                  ? 'ring-2 ring-[#103b5b] shadow-lg scale-105'
                  : 'hover:shadow-md hover:scale-102'
                }
              `}
            >
              <Card className="h-full">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center text-2xl mb-4`}>
                  {type.icon}
                </div>

                <h3 className="text-xl font-bold text-[#103b5b] mb-2">
                  {type.title}
                </h3>
                <p className="text-[#8b5b3d] mb-3">{type.description}</p>
                
                <div className="mb-4">
                  <Badge variant="primary" size="sm">
                    {type.investmentRange}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <Badge 
                    variant={type.kycLevel === 'Standard KYC' ? 'success' : 'warning'} 
                    size="sm"
                  >
                    {type.kycLevel}
                  </Badge>
                </div>
                
                <ul className="space-y-2">
                  {type.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-[#00A8A8] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
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
                <li>• Processing time: 24-48 hours for Retail, 3-5 days for Institutional</li>
                <li>• MVP Testnet: This is a demo onboarding with mock verification</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <a
            href="/select-role"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back to Role Selection
          </a>
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={!selectedRole}
          >
            Continue to Personal Information →
          </Button>
        </div>
      </main>
    </div>
  );
};

export default OnboardingWelcome;
