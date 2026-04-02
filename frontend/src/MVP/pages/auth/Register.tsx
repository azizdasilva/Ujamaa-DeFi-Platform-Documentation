/**
 * Registration Page
 * New user signup with email/password and role selection
 *
 * Route: /register
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { InvestorRole } from '../../../types';
import MVPBanner from '../../components/MVPBanner';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    companyName: '',
    jurisdiction: '',
    investorType: 'retail' as 'retail' | 'institutional' | 'operator' | 'compliance' | 'regulator',
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const jurisdictions = [
    { code: 'MU', name: 'Mauritius' },
    { code: 'KE', name: 'Kenya' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'GH', name: 'Ghana' },
    { code: 'BJ', name: 'Benin' },
    { code: 'CI', name: 'Côte d\'Ivoire' },
    { code: 'SN', name: 'Senegal' },
    { code: 'TG', name: 'Togo' },
    { code: 'EU', name: 'European Union' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'UAE', name: 'United Arab Emirates' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    setError('');
    
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
    }
    
    if (step === 2) {
      if (!formData.fullName && !formData.companyName) {
        setError('Please provide your name or company name');
        return;
      }
      if (!formData.jurisdiction) {
        setError('Please select your jurisdiction');
        return;
      }
    }
    
    setStep(prev => Math.min(3, prev + 1) as 1 | 2 | 3);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1) as 1 | 2 | 3);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      setError('You must accept the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);

    // Mock registration
    setTimeout(() => {
      // Determine role based on investor type
      let role: InvestorRole;
      switch (formData.investorType) {
        case 'institutional':
          role = 'INSTITUTIONAL_INVESTOR';
          break;
        case 'operator':
          role = 'INDUSTRIAL_OPERATOR';
          break;
        case 'compliance':
          role = 'COMPLIANCE_OFFICER';
          break;
        case 'regulator':
          role = 'REGULATOR';
          break;
        default:
          role = 'RETAIL_INVESTOR';
      }

      // Auto-login after registration
      login(role);

      // Navigate to appropriate dashboard
      navigate(`/${role.toLowerCase()}/dashboard`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F8FA] to-[#E8F4F8]">
      <MVPBanner />
      
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src="/assets/images/logo-transparent.png"
              alt="Ujamaa DeFi"
              className="h-24 mx-auto"
            />
            <h1 className="text-3xl font-bold text-[#023D7A] mt-4">Create Your Account</h1>
            <p className="text-[#333333] mt-2">Join the Ujamaa DeFi Platform</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {['Account Info', 'Personal Details', 'Review'].map((label, index) => (
                <div key={label} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all ${
                    step > index + 1
                      ? 'bg-green-500 text-white'
                      : step === index + 1
                      ? 'bg-gradient-to-r from-[#00A8A8] to-[#023D7A] text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > index + 1 ? '✓' : index + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium hidden sm:block ${
                    step === index + 1 ? 'text-[#00A8A8]' : 'text-gray-500'
                  }`}>
                    {label}
                  </span>
                  {index < 2 && (
                    <div className={`flex-1 h-1 mx-4 ${
                      step > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Registration Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#48A9F0]/20">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister}>
              {/* Step 1: Account Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-[#023D7A] mb-4">Account Information</h2>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#023D7A] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#023D7A] mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#023D7A] mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Personal/Company Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-[#023D7A] mb-4">Personal Details</h2>

                  {/* Investor Type Selection */}
                  <div>
                    <label className="block text-sm font-bold text-[#023D7A] mb-3">
                      I want to join as
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { value: 'retail', label: 'Retail Investor', icon: '👤', desc: '€1K - €50K' },
                        { value: 'institutional', label: 'Institutional', icon: '🏦', desc: '€100K+' },
                        { value: 'operator', label: 'Industrial Operator', icon: '🏭', desc: 'Seeking Financing' },
                        { value: 'compliance', label: 'Compliance Officer', icon: '✓', desc: 'KYC/KYB Review' },
                        { value: 'regulator', label: 'Regulator', icon: '👁️', desc: 'Oversight Access' },
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, investorType: type.value as any }))}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            formData.investorType === type.value
                              ? 'border-[#00A8A8] bg-[#00A8A8]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-bold text-[#023D7A]">{type.label}</div>
                          <div className="text-xs text-gray-500">{type.desc}</div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Note: Admin accounts are created internally. Contact support for admin access.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#023D7A] mb-2">
                        Full Name {formData.investorType === 'operator' ? '' : '*'}
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#023D7A] mb-2">
                        Company Name {formData.investorType === 'retail' ? '' : '*'}
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Company Ltd"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#023D7A] mb-2">
                      Jurisdiction *
                    </label>
                    <select
                      name="jurisdiction"
                      value={formData.jurisdiction}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                      required
                    >
                      <option value="">Select your jurisdiction</option>
                      {jurisdictions.map((j) => (
                        <option key={j.code} value={j.code}>
                          {j.name} ({j.code})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Your country of residence or incorporation
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Confirm */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-[#023D7A] mb-4">Review & Confirm</h2>

                  {/* Summary Card */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="font-semibold text-[#023D7A]">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Investor Type:</span>
                      <span className="font-semibold text-[#023D7A] capitalize">{formData.investorType}</span>
                    </div>
                    {(formData.fullName || formData.companyName) && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="font-semibold text-[#023D7A]">
                          {formData.fullName || formData.companyName}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Jurisdiction:</span>
                      <span className="font-semibold text-[#023D7A]">{formData.jurisdiction}</span>
                    </div>
                  </div>

                  {/* Terms & Privacy */}
                  <div className="space-y-3 pt-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="mt-1 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        I have read and agree to the{' '}
                        <a href="/investors-room/terms-of-service" target="_blank" className="text-[#00A8A8] font-bold">
                          Terms of Service
                        </a>
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptPrivacy"
                        checked={formData.acceptPrivacy}
                        onChange={handleInputChange}
                        className="mt-1 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        I have read and agree to the{' '}
                        <a href="/investors-room/privacy-policy" target="_blank" className="text-[#00A8A8] font-bold">
                          Privacy Policy
                        </a>
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="accreditation"
                        className="mt-1 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        I confirm that I am an accredited investor (required for institutional investments)
                      </span>
                    </label>
                  </div>

                  {/* Risk Warning */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-xs text-amber-700">
                        <strong>Investment Risk Warning:</strong> Digital asset investments carry inherent risks. 
                        You may lose some or all of your invested capital. Please invest responsibly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold rounded-xl transition-all"
                  >
                    ← Back
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 bg-gradient-to-r from-[#00A8A8] to-[#023D7A] hover:from-[#0D7A7A] hover:to-[#034F9A] text-white font-bold rounded-xl transition-all shadow-lg"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-[#00A8A8] to-[#023D7A] hover:from-[#0D7A7A] hover:to-[#034F9A] text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#00A8A8] hover:text-[#0D7A7A] font-bold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
