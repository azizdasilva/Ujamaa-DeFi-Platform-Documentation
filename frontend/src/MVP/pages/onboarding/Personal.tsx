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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countries with phone codes and flag images (using flagcdn.com for reliable display)
  const countries = [
    { code: 'MU', name: 'Mauritius', phoneCode: '+230', flag: 'https://flagcdn.com/w40/mu.png' },
    { code: 'NG', name: 'Nigeria', phoneCode: '+234', flag: 'https://flagcdn.com/w40/ng.png' },
    { code: 'KE', name: 'Kenya', phoneCode: '+254', flag: 'https://flagcdn.com/w40/ke.png' },
    { code: 'ZA', name: 'South Africa', phoneCode: '+27', flag: 'https://flagcdn.com/w40/za.png' },
    { code: 'GH', name: 'Ghana', phoneCode: '+233', flag: 'https://flagcdn.com/w40/gh.png' },
    { code: 'CI', name: 'Côte d\'Ivoire', phoneCode: '+225', flag: 'https://flagcdn.com/w40/ci.png' },
    { code: 'SN', name: 'Senegal', phoneCode: '+221', flag: 'https://flagcdn.com/w40/sn.png' },
    { code: 'TG', name: 'Togo', phoneCode: '+228', flag: 'https://flagcdn.com/w40/tg.png' },
    { code: 'BJ', name: 'Benin', phoneCode: '+229', flag: 'https://flagcdn.com/w40/bj.png' },
    { code: 'UAE', name: 'United Arab Emirates', phoneCode: '+971', flag: 'https://flagcdn.com/w40/ae.png' },
    { code: 'UK', name: 'United Kingdom', phoneCode: '+44', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'EU', name: 'European Union', phoneCode: '+33', flag: 'https://flagcdn.com/w40/eu.png' },
    { code: 'SG', name: 'Singapore', phoneCode: '+65', flag: 'https://flagcdn.com/w40/sg.png' },
    { code: 'US', name: 'United States', phoneCode: '+1', flag: 'https://flagcdn.com/w40/us.png' },
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

  // Get country by code
  const getCountry = (code: string) => countries.find(c => c.code === code);

  // Get phone code for selected nationality
  const getPhoneCode = () => {
    const country = getCountry(formData.nationality);
    return country?.phoneCode || '+230';
  };

  // Get flag for nationality
  const getFlag = (code: string) => {
    const country = getCountry(code);
    return country?.flag || 'https://flagcdn.com/w40/mu.png'; // Default to Mauritius flag
  };

  // Postal code patterns by country - relaxed validation for African countries
  const postalPatterns: Record<string, { pattern: RegExp; minDigits: number }> = {
    MU: { pattern: /^[0-9]{2,5}$/, minDigits: 2 },
    NG: { pattern: /^[0-9]{2,6}$/, minDigits: 2 },
    KE: { pattern: /^[0-9]{2,5}$/, minDigits: 2 },
    ZA: { pattern: /^[0-9]{2,4}$/, minDigits: 2 },
    GH: { pattern: /^[A-Z0-9\-]{2,15}$/, minDigits: 2 },
    CI: { pattern: /^[0-9A-Z]{2,15}$/, minDigits: 2 },
    SN: { pattern: /^[0-9]{2,5}$/, minDigits: 2 },
    TG: { pattern: /^[0-9A-Z]{2,15}$/, minDigits: 2 },
    BJ: { pattern: /^[0-9A-Z]{2,15}$/, minDigits: 2 },
    UAE: { pattern: /^[0-9]{2,5}$/, minDigits: 2 },
    UK: { pattern: /^[A-Z0-9\s]{2,10}$/, minDigits: 2 },
    EU: { pattern: /^[0-9]{2,5}$/, minDigits: 2 },
    SG: { pattern: /^[0-9]{2,6}$/, minDigits: 2 },
    US: { pattern: /^[0-9]{2,10}$/, minDigits: 2 },
  };

  // Industry dropdown options
  const industries = [
    { code: 'MFG', name: 'Manufacturing' },
    { code: 'AGR', name: 'Agriculture & Agribusiness' },
    { code: 'TEXT', name: 'Textiles & Garments' },
    { code: 'FOOD', name: 'Food Processing' },
    { code: 'CHEM', name: 'Chemicals & Pharmaceuticals' },
    { code: 'ENERGY', name: 'Energy & Utilities' },
    { code: 'CONST', name: 'Construction & Materials' },
    { code: 'TECH', name: 'Technology & Electronics' },
    { code: 'AUTO', name: 'Automotive' },
    { code: 'LOGIS', name: 'Logistics & Transportation' },
    { code: 'TRADE', name: 'Trading & Distribution' },
    { code: 'MINING', name: 'Mining & Natural Resources' },
    { code: 'HEALTH', name: 'Healthcare & Medical' },
    { code: 'EDU', name: 'Education & Training' },
    { code: 'FIN', name: 'Financial Services' },
    { code: 'REAL', name: 'Real Estate & Property' },
    { code: 'TOURISM', name: 'Tourism & Hospitality' },
    { code: 'OTHER', name: 'Other' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nationality change - auto-update phone country code
    if (name === 'nationality' && value) {
      const country = getCountry(value);
      if (country) {
        // Remove old country code from phone, keep only the number
        let newPhone = formData.phone.replace(/^\+?\d{1,4}/, '');
        setFormData(prev => ({
          ...prev,
          nationality: value,
          phone: newPhone
        }));
        return;
      }
    }
    
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

  // Get full phone number for database storage (country code + number)
  const getFullPhoneNumber = () => {
    const code = getPhoneCode();
    const number = formData.phone.replace(/^\+?\d{1,4}/, '');
    return `${code}${number}`;
  };

  // Validate phone number format (numbers only, 7-15 digits)
  const validatePhone = (phone: string): boolean => {
    const phonePattern = /^[0-9]{7,15}$/;
    return phonePattern.test(phone);
  };

  // Validate postal code by country - relaxed validation
  const validatePostalCode = (postalCode: string, countryCode: string): boolean => {
    const config = postalPatterns[countryCode];
    if (!config) return postalCode.length >= 2;
    const digits = postalCode.replace(/\D/g, '').length;
    return digits >= config.minDigits && config.pattern.test(postalCode);
  };

  // Validate user is at least 18 years old
  const validateAge = (dateOfBirth: string): boolean => {
    if (!dateOfBirth) return false;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Personal info validation - different for retail vs institutional/originator
    if (type === 'retail') {
      // Retail: require firstName and lastName
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    } else {
      // Institutional/Originator: require companyName instead
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number (7-15 digits required)';
    }
    
    // Retail-specific: Date of Birth validation
    if (type === 'retail') {
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      } else if (!validateAge(formData.dateOfBirth)) {
        newErrors.dateOfBirth = 'You must be at least 18 years old to invest';
      }
    }
    
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';

    // Check if nationality is blocked
    const isBlocked = blockedCountries.some(c => c.code === formData.nationality);
    if (isBlocked) {
      newErrors.nationality = 'Unfortunately, we cannot accept investors from this jurisdiction';
    }

    // Address validation
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!validatePostalCode(formData.postalCode, formData.country)) {
      const examples: Record<string, string> = {
        MU: 'e.g., 72201',
        NG: 'e.g., 100001',
        KE: 'e.g., 00100',
        ZA: 'e.g., 8001',
        UK: 'e.g., SW1A 1AA',
        US: 'e.g., 10001 or 10001-1234',
        EU: 'e.g., 75001',
        SG: 'e.g., 018956',
      };
      newErrors.postalCode = `Invalid postal code format ${examples[formData.country] || ''}`;
    }
    if (!formData.country) newErrors.country = 'Country is required';

    // Additional business info for institutional/originator
    if (type === 'institutional' || type === 'originator') {
      if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
      if (!formData.taxId.trim()) newErrors.taxId = 'Tax ID is required';
      if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
    }

    // Investment info
    if (!formData.investmentAmount.trim()) {
      newErrors.investmentAmount = 'Investment amount is required';
    } else {
      const amount = parseFloat(formData.investmentAmount.replace(/,/g, ''));
      if (type === 'retail' && (amount < 1000 || amount > 99999)) {
        newErrors.investmentAmount = 'Retail investment must be between €1,000 and €99,999';
      }
      if (type === 'institutional' && amount < 100000) {
        newErrors.investmentAmount = 'Institutional investment minimum is €100,000';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};

    // Personal info validation - different for retail vs institutional/originator
    if (type === 'retail') {
      // Retail: require firstName and lastName
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    } else {
      // Institutional/Originator: require companyName instead
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number (7-15 digits required)';
    }
    
    // Retail-specific: Date of Birth validation
    if (type === 'retail') {
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      } else if (!validateAge(formData.dateOfBirth)) {
        newErrors.dateOfBirth = 'You must be at least 18 years old to invest';
      }
    }
    
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';

    // Check if nationality is blocked
    const isBlocked = blockedCountries.some(c => c.code === formData.nationality);
    if (isBlocked) {
      newErrors.nationality = 'Unfortunately, we cannot accept investors from this jurisdiction';
    }

    // Address validation
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!validatePostalCode(formData.postalCode, formData.country)) {
      const examples: Record<string, string> = {
        MU: 'e.g., 72201',
        NG: 'e.g., 100001',
        KE: 'e.g., 00100',
        ZA: 'e.g., 8001',
        UK: 'e.g., SW1A 1AA',
        US: 'e.g., 10001 or 10001-1234',
        EU: 'e.g., 75001',
        SG: 'e.g., 018956',
      };
      newErrors.postalCode = `Invalid postal code format ${examples[formData.country] || ''}`;
    }
    if (!formData.country) newErrors.country = 'Country is required';

    // Additional business info for institutional/originator
    if (type === 'institutional' || type === 'originator') {
      if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
      if (!formData.taxId.trim()) newErrors.taxId = 'Tax ID is required';
      if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
    }

    // Investment info
    if (!formData.investmentAmount.trim()) {
      newErrors.investmentAmount = 'Investment amount is required';
    } else {
      const amount = parseFloat(formData.investmentAmount.replace(/,/g, ''));
      if (type === 'retail' && (amount < 1000 || amount > 99999)) {
        newErrors.investmentAmount = 'Retail investment must be between €1,000 and €99,999';
      }
      if (type === 'institutional' && amount < 100000) {
        newErrors.investmentAmount = 'Institutional investment minimum is €100,000';
      }
    }

    setErrors(newErrors);

    console.log('=== FORM VALIDATION DEBUG ===');
    console.log('Type:', type);
    console.log('Form Data:', formData);
    console.log('Errors:', newErrors);
    console.log('Error count:', Object.keys(newErrors).length);
    console.log('=============================');

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // Store data with full phone number (country code + number) for database
        const formDataWithFullPhone = {
          ...formData,
          phone: getFullPhoneNumber() // Store as +2301234567 format
        };
        sessionStorage.setItem('onboardingData', JSON.stringify(formDataWithFullPhone));
        console.log('Navigating to documents step with full phone:', formDataWithFullPhone.phone);
        navigate(`/onboarding/${type}/documents`);
      } catch (error) {
        console.error('Error during navigation:', error);
        setIsSubmitting(false);
      }
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Focus the element if it's an input
          if (element instanceof HTMLElement) {
            element.focus();
          }
        }
      }
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

      {/* Validation Error Banner */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg mx-4 mt-6 p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-red-900">Please fix {Object.keys(errors).length} error(s)</h4>
              <ul className="text-sm text-red-700 mt-2 space-y-1">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>• {message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Industry *
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select industry</option>
                      {industries.map(ind => (
                        <option key={ind.code} value={ind.code}>{ind.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Email - Full Width Row */}
              <div className="md:col-span-2">
                <Input
                  label="Email Address *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  fullWidth
                />
              </div>

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

              {/* Nationality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nationality / Country of Incorporation *
                </label>
                <div className="relative">
                  <select
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className={`block w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-offset-0 appearance-none bg-white ${
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
                  {/* Flag Display */}
                  {formData.nationality && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
                      <img
                        src={countries.find(c => c.code === formData.nationality)?.flag}
                        alt={formData.nationality}
                        className="w-5 h-3.5 object-cover"
                        style={{ display: 'inline-block' }}
                      />
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.nationality && (
                  <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number *
                </label>
                <div className="flex items-stretch">
                  {/* Country Code Display */}
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border-2 border-r-0 border-gray-300 rounded-l-lg min-w-[110px] flex-shrink-0">
                    <img
                      src={getFlag(formData.nationality)}
                      alt={formData.nationality || 'flag'}
                      className="w-5 h-3.5 object-cover"
                      style={{ display: 'inline-block' }}
                    />
                    <span className="text-sm font-semibold text-gray-700">{getPhoneCode()}</span>
                  </div>
                  {/* Phone Input */}
                  <input
                    name="phone"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData(prev => ({ ...prev, phone: value }));
                    }}
                    placeholder="1234567"
                    maxLength={15}
                    className="flex-1 block min-w-[150px] px-4 py-2.5 border-2 border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 focus:outline-none"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Code: {getPhoneCode()} | Full: {getFullPhoneNumber()}
                </p>
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
                      ? 'Minimum: €1,000 • Maximum: €99,999 • Daily withdrawal limit: €500,000'
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
              disabled={isSubmitting}
            >
              ← Back
            </button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Continue to Documents →'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default OnboardingPersonal;
