/**
 * Onboarding Flow - Step 5: Complete
 * 
 * Success page after onboarding submission.
 * 
 * Route: /onboarding/:type/complete
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

const OnboardingComplete: React.FC = () => {
  const { type } = useParams<{ type: 'retail' | 'institutional' | 'originator' }>();
  const navigate = useNavigate();
  const [submitTime, setSubmitTime] = useState<string>('');
  const [referenceId, setReferenceId] = useState<string>('');

  useEffect(() => {
    const time = sessionStorage.getItem('onboardingSubmitTime');
    if (time) {
      setSubmitTime(new Date(time).toLocaleString());
    }
    setReferenceId(`ONB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  }, []);

  const getReviewTime = () => {
    switch (type) {
      case 'retail':
        return '24 hours';
      case 'institutional':
        return '24 hours';
      case 'originator':
        return '24 hours';
      default:
        return '24 hours';
    }
  };

  const getNextSteps = () => {
    switch (type) {
      case 'retail':
        return [
          'Compliance team reviews your documents',
          'Email notification upon approval',
          'Connect your wallet',
          'Start investing in pools',
        ];
      case 'institutional':
        return [
          'Enhanced KYB verification',
          'UBO verification call scheduled',
          'Source of funds verification',
          'Custom investment terms discussion',
          'Account activation',
        ];
      case 'originator':
        return [
          'Business verification',
          'Asset certification review',
          'Credit assessment',
          'Investment terms negotiation',
          'Capital access granted',
        ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Onboarding Complete</h1>
              <p className="text-gray-600 mt-1">Step 5 of 5: Application Submitted</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">✓</div>
              <span className="text-sm text-gray-500">Welcome</span>
            </div>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">✓</div>
              <span className="text-sm text-gray-500">Personal Info</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">✓</div>
              <span className="text-sm text-gray-500">Documents</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">✓</div>
              <span className="text-sm text-gray-500">Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">5</div>
              <span className="text-sm font-medium text-gray-900">Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600">
            Thank you for completing your onboarding. Our compliance team will review your application.
          </p>
        </div>

        {/* Reference Information */}
        <Card className="mb-6 bg-green-50 border-green-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Reference ID</p>
              <p className="font-mono font-bold text-green-900">{referenceId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Submitted At</p>
              <p className="font-medium text-green-900">{submitTime || 'Just now'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Investor Type</p>
              <Badge variant={type === 'institutional' ? 'secondary' : 'primary'} size="sm">
                {type === 'retail' ? 'Retail' : type === 'institutional' ? 'Institutional' : 'Originator'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expected Review Time</p>
              <p className="font-medium text-green-900">{getReviewTime()}</p>
            </div>
          </div>
        </Card>

        {/* What Happens Next */}
        <Card className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">What Happens Next?</h3>
          <div className="space-y-4">
            {getNextSteps()?.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-600">{index + 1}</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-900">{step}</p>
                </div>
                {index < (getNextSteps()?.length || 0) - 1 && (
                  <div className="w-0.5 bg-gray-200 h-8 mt-2" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Important Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Check Your Email</h4>
              <p className="text-sm text-blue-700">
                We'll send you email notifications at each step of the review process. 
                Please add <strong>noreply@ujamaa-defi.test</strong> to your safe senders list.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Mode Notice (MVP) */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">🚀 MVP Testnet Demo</h4>
              <p className="text-sm text-amber-700">
                This is a testnet onboarding demonstration. In production, actual document verification 
                and compliance checks would be performed. Your demo account will be activated immediately 
                for testing purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(`/${type}/dashboard`)}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/select-role')}
          >
            Select Different Role
          </Button>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Have questions? Contact our support team at{' '}
            <a href="mailto:support@ujamaa-defi.test" className="text-green-600 hover:underline">
              support@ujamaa-defi.test
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            🚀 MVP: Onboarding Flow Complete - Testnet Release • Polygon Amoy (Chain ID: 80002)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingComplete;
