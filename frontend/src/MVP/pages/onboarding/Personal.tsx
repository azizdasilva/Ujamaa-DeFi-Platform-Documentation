/**
 * Onboarding Flow - Step 2: Personal/Business Information
 * 
 * Collects personal information for retail or business details for institutional.
 * 
 * Route: /onboarding/:type/personal
 * 
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

const OnboardingPersonal: React.FC = () => {
  const { type } = useParams<{ type: 'retail' | 'institutional' | 'originator' }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    
    // Address
    address: '',
    city: '',
    postalCode: '',
    country: '',
    
    // Business Info (for institutional/originator)
    companyName: '',
    registrationNumber: '',
    taxId: '',
    businessAddress: '',
    website: '',
    industry: '',
    
    // Investment Info
    investmentAmount: '',
    investmentSource: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const countries = [
    { code: 'MU', name: 'Mauritius' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'KE', name: 'Kenya' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'GH', name: 'Ghana' },
    { code: 'CI', name: 'Côte d\'Ivoire' },
    { code: 'SN', name: 'Senegal' },
    { code: 'TG', name: 'Togo' },
    { code: 'BJ', name: 'Benin' },
    { code: 'UAE', name: 'United Arab Emirates' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'EU', name: 'European Union' },
    { code: 'SG', name: 'Singapore' },
    { code: 'US', name: 'United States' },
  ];

  const blockedCountries = [
    { code: 'KP', name: 'North Korea' },
    { code: 'IR', name: 'Iran' },
    { code: 'SY', name: 'Syria' },
    { code: 'CU', name: 'Cuba' },
    { code: 'MM', name: 'Myanmar' },
    { code: 'BY', name: 'Belarus' },
    { code: 'RU', name: 'Russia' },
    { code: 'VE', name: 'Venezuela' },
    { code: 'SD', name: 'Sudan' },
    { code: 'YE', name: 'Yemen' },
    { code: 'ML', name: 'Mali' },
    { code: 'BF', name: 'Burkina Faso' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Personal info validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';

    // Check if nationality is blocked
    const isBlocked = blockedCountries.some(c => c.code === formData.nationality);
    if (isBlocked) {
      newErrors.nationality = 'Unfortunately, we cannot accept investors from this jurisdiction';
    }

    // Address validation
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.country) newErrors.country = 'Country is required';

    // Business info for institutional/originator
    if (type === 'institutional' || type === 'originator') {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
      if (!formData.taxId.trim()) newErrors.taxId = 'Tax ID is required';
    }

    // Investment info
    if (!formData.investmentAmount.trim()) {
      newErrors.investmentAmount = 'Investment amount is required';
    } else {
      const amount = parseFloat(formData.investmentAmount.replace(/,/g, ''));
      if (type === 'retail' && (amount < 1000 || amount > 50000)) {
        newErrors.investmentAmount = 'Retail investment must be between €1,000 and €50,000';
      }
      if (type === 'institutional' && amount < 100000) {
        newErrors.investmentAmount = 'Institutional investment minimum is €100,000';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Store data in sessionStorage for later steps
      sessionStorage.setItem('onboardingData', JSON.stringify(formData));
      navigate(`/onboarding/${type}/documents`);
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
              <h1 className="text-3xl font-bold text-gray-900">Investor Onboarding</h1>
              <p className="text-gray-600 mt-1">
                Step 2 of 5: {type === 'retail' ? 'Personal' : 'Business'} Information
              </p>
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
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                ✓
              </div>
              <span className="text-sm text-gray-500">Welcome</span>
            </div>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <span className="text-sm font-medium text-gray-900">Personal Info</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <span className="text-sm text-gray-500">Documents</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-semibold text-sm">
                4
              </div>
              <span className="text-sm text-gray-500">Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-semibold text-sm">
                5
              </div>
              <span className="text-sm text-gray-500">Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
          {/* Personal Information Section */}
          <Card className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {type === 'retail' ? 'Personal Information' : 'Business Information'}
                </h2>
                <p className="text-sm text-gray-500">
                  {type === 'retail' ? 'Tell us about yourself' : 'Tell us about your company'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {type === 'retail' ? (
                <>
                  <Input
                    label="First Name *"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    fullWidth
                  />
                  <Input
                    label="Last Name *"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    fullWidth
                  />
                </>
              ) : (
                <>
                  <Input
                    label="Company Name *"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    error={errors.companyName}
                    fullWidth
                  />
                  <Input
                    label="Registration Number *"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    error={errors.registrationNumber}
                    fullWidth
                  />
                  <Input
                    label="Tax ID / VAT Number *"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    error={errors.taxId}
                    fullWidth
                  />
                  <Input
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    fullWidth
                  />
                </>
              )}

              <Input
                label="Email Address *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                fullWidth
              />
              <Input
                label="Phone Number *"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                fullWidth
              />

              {type === 'retail' && (
                <Input
                  label="Date of Birth *"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  error={errors.dateOfBirth}
                  fullWidth
                />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nationality / Country of Incorporation *
                </label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-0 ${
                    errors.nationality
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                  }`}
                >
                  <option value="">Select country</option>
                  <optgroup label="Allowed African Markets">
                    {countries.filter(c => ['MU', 'NG', 'KE', 'ZA', 'GH', 'CI', 'SN', 'TG', 'BJ'].includes(c.code)).map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Allowed International">
                    {countries.filter(c => ['UAE', 'UK', 'EU', 'SG', 'US'].includes(c.code)).map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Blocked Jurisdictions">
                    {blockedCountries.map(c => (
                      <option key={c.code} value={c.code} disabled>{c.name} (Blocked)</option>
                    ))}
                  </optgroup>
                </select>
                {errors.nationality && (
                  <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Address Section */}
          <Card className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Address Information</h2>
                <p className="text-sm text-gray-500">Your registered address</p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Street Address *"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                fullWidth
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City *"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  fullWidth
                />
                <Input
                  label="Postal Code *"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  error={errors.postalCode}
                  fullWidth
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-0 ${
                      errors.country
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                    }`}
                  >
                    <option value="">Select country</option>
                    {countries.map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Investment Information */}
          <Card className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Investment Information</h2>
                <p className="text-sm text-gray-500">Your investment plans</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={`Investment Amount (EUR) *`}
                name="investmentAmount"
                type="text"
                value={formData.investmentAmount}
                onChange={handleChange}
                error={errors.investmentAmount}
                placeholder="€10,000"
                fullWidth
                leftAddon={<span className="text-gray-500">€</span>}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Source of Funds *
                </label>
                <select
                  name="investmentSource"
                  value={formData.investmentSource}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select source</option>
                  <option value="salary">Employment Income / Salary</option>
                  <option value="business">Business Profits</option>
                  <option value="investments">Investment Returns</option>
                  <option value="inheritance">Inheritance</option>
                  <option value="savings">Personal Savings</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Investment Limits Notice */}
            <div className={`mt-4 p-4 rounded-lg ${
              type === 'retail' ? 'bg-blue-50 border border-blue-200' :
              'bg-green-50 border border-green-200'
            }`}>
              <div className="flex items-start gap-2">
                <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  type === 'retail' ? 'text-blue-600' : 'text-green-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className={`text-sm font-semibold ${
                    type === 'retail' ? 'text-blue-900' : 'text-green-900'
                  }`}>
                    {type === 'retail' ? 'Retail Investor Limits' : 'Institutional Investor Minimum'}
                  </p>
                  <p className={`text-xs ${
                    type === 'retail' ? 'text-blue-700' : 'text-green-700'
                  } mt-1`}>
                    {type === 'retail' 
                      ? 'Minimum: €1,000 • Maximum: €50,000 • Daily withdrawal limit: €500,000'
                      : 'Minimum: €100,000 • No maximum limit • Enhanced KYB required'
                    }
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(`/onboarding`)}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back
            </button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
            >
              Continue to Documents →
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default OnboardingPersonal;
