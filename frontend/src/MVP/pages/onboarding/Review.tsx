/**
 * Onboarding Flow - Step 4: Review & Submit
 * 
 * Users review all their information before final submission.
 * 
 * Route: /onboarding/:type/review
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

const OnboardingReview: React.FC = () => {
  const { type } = useParams<{ type: 'retail' | 'institutional' | 'originator' }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [personalData, setPersonalData] = useState<any>({});
  const [documents, setDocuments] = useState<any>({});

  useEffect(() => {
    const savedData = sessionStorage.getItem('onboardingData');
    const savedDocs = sessionStorage.getItem('onboardingDocs');
    if (savedData) setPersonalData(JSON.parse(savedData));
    if (savedDocs) setDocuments(JSON.parse(savedDocs));
  }, []);

  const handleSubmit = () => {
    if (!agreed) return;
    
    setIsSubmitting(true);
    // Simulate submission (MVP testnet)
    setTimeout(() => {
      sessionStorage.setItem('onboardingSubmitted', 'true');
      sessionStorage.setItem('onboardingSubmitTime', new Date().toISOString());
      navigate(`/onboarding/${type}/complete`);
    }, 2000);
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''));
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Investor Onboarding</h1>
              <p className="text-gray-600 mt-1">Step 4 of 5: Review & Submit</p>
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
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }} />
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
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">4</div>
              <span className="text-sm font-medium text-gray-900">Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-semibold text-sm">5</div>
              <span className="text-sm text-gray-500">Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Review Summary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-green-900">Ready to Submit</h3>
              <p className="text-sm text-green-700 mt-1">
                Please review all your information carefully before submitting. 
                Once submitted, our compliance team will review your application within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information Review */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {type === 'retail' ? 'Personal Information' : 'Business Information'}
            </h2>
            <button
              onClick={() => navigate(`/onboarding/${type}/personal`)}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Edit →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {type === 'retail' ? (
              <>
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{personalData.firstName || 'N/A'} {personalData.lastName || ''}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{personalData.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{personalData.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Nationality</p>
                  <p className="font-medium text-gray-900">{personalData.nationality || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-900">{personalData.dateOfBirth || 'N/A'}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-gray-500">Company Name</p>
                  <p className="font-medium text-gray-900">{personalData.companyName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Registration Number</p>
                  <p className="font-medium text-gray-900">{personalData.registrationNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tax ID</p>
                  <p className="font-medium text-gray-900">{personalData.taxId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Industry</p>
                  <p className="font-medium text-gray-900">{personalData.industry || 'N/A'}</p>
                </div>
              </>
            )}
            <div className="col-span-2">
              <p className="text-gray-500">Address</p>
              <p className="font-medium text-gray-900">
                {[personalData.address, personalData.city, personalData.postalCode, personalData.country]
                  .filter(Boolean)
                  .join(', ') || 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        {/* Investment Information Review */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Investment Information</h2>
            <button
              onClick={() => navigate(`/onboarding/${type}/personal`)}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Edit →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Investment Amount</p>
              <p className="font-medium text-gray-900 text-lg">
                {personalData.investmentAmount ? formatCurrency(personalData.investmentAmount) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Source of Funds</p>
              <p className="font-medium text-gray-900 capitalize">
                {personalData.investmentSource ? personalData.investmentSource.replace(/_/g, ' ') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Investor Type</p>
              <Badge variant={type === 'institutional' ? 'secondary' : 'primary'} size="sm">
                {type === 'retail' ? 'Retail' : type === 'institutional' ? 'Institutional' : 'Originator'}
              </Badge>
            </div>
            <div>
              <p className="text-gray-500">Verification Level</p>
              <Badge variant={type === 'retail' ? 'success' : 'warning'} size="sm">
                {type === 'retail' ? 'KYC' : 'KYB'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Documents Review */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Uploaded Documents</h2>
            <button
              onClick={() => navigate(`/onboarding/${type}/documents`)}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Edit →
            </button>
          </div>

          <div className="space-y-2">
            {Object.keys(documents).length > 0 ? (
              Object.entries(documents).map(([docId, doc]: [string, any]) => (
                <div key={docId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.size}</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">Uploaded</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No documents uploaded</p>
            )}
          </div>
        </Card>

        {/* Terms & Conditions */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Terms & Declarations</h2>
          
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">
                I declare that all information provided is accurate and complete to the best of my knowledge. 
                I understand that false information may result in rejection of my application.
              </span>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">
                I agree to the <a href="/investors-room/terms-of-service" className="text-green-600 hover:underline">Terms of Service</a> and <a href="/investors-room/privacy-policy" className="text-green-600 hover:underline">Privacy Policy</a>.
              </span>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">
                I confirm that I am not a resident of any blocked jurisdiction and my funds are from legitimate sources.
              </span>
            </label>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(`/onboarding/${type}/documents`)}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back
          </button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={!agreed || isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'} →
          </Button>
        </div>
      </main>
    </div>
  );
};

export default OnboardingReview;
