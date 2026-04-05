/**
 * Subscription Form - Investor Investment Flow
 * 
 * Multi-step form for investors to subscribe to liquidity pools.
 * Includes compliance checks, balance validation, and API submission.
 *
 * Route: /investors-room/subscription-form
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { investmentsAPI } from '../../../api/investments';
import apiClient from '../../../api/client';

interface FormData {
  fullName: string;
  dateOfBirth: string;
  jurisdiction: string;
  address: string;
  email: string;
  phone: string;
  taxId: string;
  selectedPool: string;
  investmentAmount: string;
  investorType: string;
  agreeToTerms: boolean;
}

interface ComplianceCheck {
  is_allowed: boolean;
  is_blocked: boolean;
  requires_review: boolean;
  reason?: string;
}

interface PoolOption {
  id: string;
  name: string;
  family: string;
  apy: number;
  minInvestment: number;
  lockupDays: number;
}

const POOLS: PoolOption[] = [
  { id: 'POOL_INDUSTRIE', name: 'Pool Industrie', family: 'INDUSTRIE', apy: 11.0, minInvestment: 10000, lockupDays: 365 },
  { id: 'POOL_AGRICULTURE', name: 'Pool Agriculture', family: 'AGRICULTURE', apy: 13.5, minInvestment: 10000, lockupDays: 180 },
  { id: 'POOL_TRADE_FINANCE', name: 'Pool Trade Finance', family: 'TRADE_FINANCE', apy: 9.0, minInvestment: 10000, lockupDays: 90 },
  { id: 'POOL_RENEWABLE_ENERGY', name: 'Pool Renewable Energy', family: 'RENEWABLE_ENERGY', apy: 10.0, minInvestment: 10000, lockupDays: 730 },
  { id: 'POOL_REAL_ESTATE', name: 'Pool Real Estate', family: 'REAL_ESTATE', apy: 10.0, minInvestment: 50000, lockupDays: 1095 },
];

const JURISDICTIONS = [
  { code: 'TG', name: 'Togo' },
  { code: 'BJ', name: 'Benin' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'SN', name: 'Senegal' },
  { code: 'GH', name: 'Ghana' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'AE', name: 'UAE' },
  { code: 'SG', name: 'Singapore' },
];

const SubscriptionForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [explorerUrl, setExplorerUrl] = useState<string | null>(null);
  const [complianceCheck, setComplianceCheck] = useState<ComplianceCheck | null>(null);
  const [bankBalance, setBankBalance] = useState<number>(0);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    jurisdiction: searchParams.get('jurisdiction') || '',
    address: '',
    email: '',
    phone: '',
    taxId: '',
    selectedPool: searchParams.get('pool') || '',
    investmentAmount: '',
    investorType: user?.role === 'INSTITUTIONAL_INVESTOR' ? 'Corporate/Institutional Investor' : 'Individual Accredited Investor',
    agreeToTerms: false,
  });

  const selectedPool = POOLS.find(p => p.id === formData.selectedPool);

  // Load investor profile and bank balance
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const investorId = user.id.includes('retail') ? 2 : user.id.includes('inst') ? 1 : 1;
        
        // Load investor profile
        const profileRes = await apiClient.get(`/db/investors/${investorId}`);
        const profile = profileRes.data;
        
        if (profile) {
          setFormData(prev => ({
            ...prev,
            fullName: profile.full_name || prev.fullName,
            jurisdiction: profile.jurisdiction || prev.jurisdiction,
          }));
          
          // Check compliance
          if (profile.jurisdiction) {
            const complianceRes = await apiClient.get(`/compliance/investors/${investorId}/compliance`);
            setComplianceCheck({
              is_allowed: complianceRes.data.is_approved,
              is_blocked: !complianceRes.data.is_approved,
              requires_review: false,
            });
          }
        }
        
        // Load bank balance
        const bankRes = await apiClient.get(`/db/bank-accounts?user_id=${investorId}`);
        if (bankRes.data?.[0]) {
          setBankBalance(parseFloat(bankRes.data[0].balance) || 0);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user?.id]);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep1 = (): boolean => {
    if (!formData.fullName.trim()) { setError('Full name is required'); return false; }
    if (!formData.dateOfBirth.trim()) { setError('Date of birth is required'); return false; }
    if (!formData.jurisdiction) { setError('Jurisdiction is required'); return false; }
    if (!formData.address.trim()) { setError('Address is required'); return false; }
    if (!formData.email.includes('@')) { setError('Valid email is required'); return false; }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!formData.selectedPool) { setError('Please select a pool'); return false; }
    const amount = parseFloat(formData.investmentAmount);
    if (isNaN(amount) || amount <= 0) { setError('Enter a valid investment amount'); return false; }
    if (selectedPool && amount < selectedPool.minInvestment) {
      setError(`Minimum investment for ${selectedPool.name} is €${selectedPool.minInvestment.toLocaleString()}`);
      return false;
    }
    if (amount > bankBalance) {
      setError(`Insufficient funds. Available balance: €${bankBalance.toLocaleString()}`);
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    if (!formData.agreeToTerms) { setError('You must agree to the terms and conditions'); return false; }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep(s => Math.min(s + 1, 4));
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const investorId = user.id.includes('retail') ? 2 : user.id.includes('inst') ? 1 : 1;
      const amount = parseFloat(formData.investmentAmount);
      
      // Submit investment
      const result = await investmentsAPI.createInvestment({
        pool_id: formData.selectedPool,
        investor_id: investorId,
        amount: amount,
      });
      
      setTxHash(result.transaction_id || null);
      setExplorerUrl(result.explorer_url || null);
      setSuccess(true);
      setStep(4);
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Investment failed. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6ED] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#023D7A] mx-auto mb-4"></div>
          <p className="text-[#8b5b3d]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-[#103b5b]">Investment Subscription</h1>
          <p className="text-[#8b5b3d] mt-1">Subscribe to a liquidity pool</p>
          
          {/* Progress Steps */}
          <div className="flex items-center mt-6 gap-2">
            {['Your Information', 'Investment Details', 'Terms & Submit', 'Confirmation'].map((label, i) => (
              <React.Fragment key={label}>
                <div className={`flex items-center gap-2 ${i + 1 <= step ? 'text-[#023D7A]' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i + 1 < step ? 'bg-green-500 text-white' :
                    i + 1 === step ? 'bg-[#023D7A] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {i + 1 < step ? '✓' : i + 1}
                  </div>
                  <span className="hidden md:inline text-sm font-medium">{label}</span>
                </div>
                {i < 3 && <div className={`flex-1 h-0.5 ${i + 1 < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">✓</div>
              <h2 className="text-xl font-bold text-green-800">Investment Successful!</h2>
            </div>
            <p className="text-green-700 mb-4">
              Your investment of <strong>€{parseFloat(formData.investmentAmount).toLocaleString()}</strong> in{' '}
              <strong>{selectedPool?.name}</strong> has been processed.
            </p>
            {txHash && (
              <div className="bg-white rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-600 mb-1">Transaction Hash:</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">{txHash}</code>
                {explorerUrl && (
                  <a href={explorerUrl} target="_blank" rel="noopener noreferrer" 
                     className="inline-flex items-center gap-2 mt-3 text-[#023D7A] hover:underline">
                    View on Polygonscan →
                  </a>
                )}
              </div>
            )}
            <button onClick={() => navigate('/investor/portfolio')}
                    className="mt-4 px-6 py-2 bg-[#023D7A] text-white rounded-lg hover:bg-[#0d3352]">
              View Portfolio
            </button>
          </div>
        )}

        {/* Step 1: Investor Information */}
        {step === 1 && !success && (
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-[#103b5b] mb-6">Investor Information</h2>
            
            {complianceCheck && (
              <div className={`mb-6 p-4 rounded-lg ${complianceCheck.is_allowed ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <p className={`font-medium ${complianceCheck.is_allowed ? 'text-green-700' : 'text-amber-700'}`}>
                  {complianceCheck.is_allowed ? '✅ KYC Approved - You can invest' : '⚠️ Compliance review in progress'}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', field: 'fullName', type: 'text', placeholder: 'As shown on ID' },
                { label: 'Date of Birth', field: 'dateOfBirth', type: 'date', placeholder: '' },
                { label: 'Email Address', field: 'email', type: 'email', placeholder: 'your@email.com' },
                { label: 'Phone Number', field: 'phone', type: 'tel', placeholder: '+228 XX XX XX XX' },
                { label: 'Tax ID / VAT Number', field: 'taxId', type: 'text', placeholder: 'Optional' },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={(formData as any)[field]}
                         onChange={(e) => handleChange(field as keyof FormData, e.target.value)}
                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A] focus:border-transparent"
                         placeholder={placeholder} />
                </div>
              ))}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
                <select value={formData.jurisdiction}
                        onChange={(e) => handleChange('jurisdiction', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A]">
                  <option value="">Select country</option>
                  {JURISDICTIONS.map(j => (
                    <option key={j.code} value={j.code}>{j.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                <textarea value={formData.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A]"
                          rows={2} placeholder="Full address" />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button onClick={handleNext}
                      className="px-8 py-3 bg-[#023D7A] text-white rounded-lg hover:bg-[#0d3352] font-medium">
                Next: Investment Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Investment Details */}
        {step === 2 && !success && (
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-[#103b5b] mb-6">Investment Details</h2>
            
            {/* Pool Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Pool</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {POOLS.map(pool => (
                  <button key={pool.id}
                          onClick={() => handleChange('selectedPool', pool.id)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.selectedPool === pool.id
                              ? 'border-[#023D7A] bg-[#023D7A]/5'
                              : 'border-gray-200 hover:border-[#48A9F0]'
                          }`}>
                    <p className="font-bold text-[#103b5b]">{pool.name}</p>
                    <p className="text-sm text-green-600 font-medium">{pool.apy}% APY</p>
                    <p className="text-xs text-gray-500 mt-1">Min: €{pool.minInvestment.toLocaleString()} • {pool.lockupDays} days</p>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Investment Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount (EUR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-bold">€</span>
                <input type="number" value={formData.investmentAmount}
                       onChange={(e) => handleChange('investmentAmount', e.target.value)}
                       className="w-full pl-10 pr-4 py-3 text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A] focus:border-transparent"
                       placeholder="100,000" min="0" />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-500">Available balance: <strong className="text-[#103b5b]">€{bankBalance.toLocaleString()}</strong></span>
                {selectedPool && (
                  <span className="text-gray-500">Min: €{selectedPool.minInvestment.toLocaleString()}</span>
                )}
              </div>
            </div>
            
            {/* Investor Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Investor Type</label>
              <div className="space-y-2">
                {['Individual Accredited Investor', 'Corporate/Institutional Investor', 'Family Office', 'Trust'].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                    <input type="radio" name="investorType" value={type}
                           checked={formData.investorType === type}
                           onChange={(e) => handleChange('investorType', e.target.value)}
                           className="w-4 h-4 text-[#023D7A]" />
                    <span className="text-[#333333]">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Projected Returns */}
            {selectedPool && formData.investmentAmount && (
              <div className="bg-[#F3F8FA] rounded-lg p-6 mb-6">
                <h3 className="font-bold text-[#103b5b] mb-3">Projected Returns</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">1 Year</p>
                    <p className="text-xl font-bold text-green-600">
                      €{(parseFloat(formData.investmentAmount) * (1 + selectedPool.apy / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">3 Years</p>
                    <p className="text-xl font-bold text-green-600">
                      €{(parseFloat(formData.investmentAmount) * Math.pow(1 + selectedPool.apy / 100, 3)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">5 Years</p>
                    <p className="text-xl font-bold text-green-600">
                      €{(parseFloat(formData.investmentAmount) * Math.pow(1 + selectedPool.apy / 100, 5)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <button onClick={() => setStep(1)}
                      className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
                ← Back
              </button>
              <button onClick={handleNext}
                      className="px-8 py-3 bg-[#023D7A] text-white rounded-lg hover:bg-[#0d3352] font-medium">
                Next: Review & Submit →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Terms & Submit */}
        {step === 3 && !success && (
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-[#103b5b] mb-6">Review & Submit</h2>
            
            {/* Summary */}
            <div className="bg-[#F3F8FA] rounded-lg p-6 mb-6">
              <h3 className="font-bold text-[#103b5b] mb-4">Investment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pool</span>
                  <span className="font-medium text-[#103b5b]">{selectedPool?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-[#103b5b]">€{parseFloat(formData.investmentAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target APY</span>
                  <span className="font-medium text-green-600">{selectedPool?.apy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lockup Period</span>
                  <span className="font-medium">{selectedPool?.lockupDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Investor Type</span>
                  <span className="font-medium">{formData.investorType}</span>
                </div>
              </div>
            </div>
            
            {/* Terms Agreement */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.agreeToTerms}
                       onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                       className="w-5 h-5 mt-0.5 text-[#023D7A]" />
                <div>
                  <p className="text-[#333333] font-medium">I agree to the Investment Terms</p>
                  <p className="text-sm text-gray-500 mt-1">
                    I declare that all information provided is true and accurate. I have read and understood 
                    the Investment Memorandum, Risk Disclosure, and Terms of Service. I acknowledge that this 
                    investment involves substantial risk and I may lose some or all of my invested capital.
                  </p>
                </div>
              </label>
            </div>
            
            <div className="flex justify-between">
              <button onClick={() => setStep(2)}
                      className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
                ← Back
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                      className={`px-8 py-3 rounded-lg font-medium text-white ${
                        submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#023D7A] hover:bg-[#0d3352]'
                      }`}>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </span>
                ) : 'Submit Investment →'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubscriptionForm;
