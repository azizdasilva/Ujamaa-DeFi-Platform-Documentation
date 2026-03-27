/**
 * Asset Submission Page - Submit Assets for Tokenization
 *
 * Industrial operators can submit assets (INVOICE, INVENTORY, PRODUCTION, SHIPMENT, CONTRACT)
 * for certification by Industrial Gateway (GDIZ/SIPI).
 *
 * Benchmark: Coinbase, Stripe, Airbnb Host, Shopify
 *
 * Route: /originator/assets/submit
 *
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Badge from '../../components/Badge';

type AssetType = 'INVOICE' | 'INVENTORY' | 'PRODUCTION' | 'SHIPMENT' | 'CONTRACT' | 'RECEIVABLE';

const AssetSubmission: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    assetType: '' as AssetType,
    currency: 'EUR' as 'EUR' | 'XOF',
    value: '',
    quantity: '',
    unit: 'units',
    warehouseLocation: '',
    description: '',
    ipfsHash: '',
    validityDays: '365',
  });

  // Asset types with full details
  const assetTypes = [
    {
      value: 'INVOICE',
      label: 'Invoice / Receivable',
      icon: '📄',
      gradient: 'from-blue-500 via-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Trade finance receivables, commercial invoices',
      bestFor: 'Trading companies, exporters',
      avgFinancing: '€50K - €500K',
      turnaround: '90 days',
      apr: '8-10%',
    },
    {
      value: 'INVENTORY',
      label: 'Inventory / Stock',
      icon: '📦',
      gradient: 'from-green-500 via-green-600 to-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Warehouse inventory, commodity stocks',
      bestFor: 'Manufacturers, distributors',
      avgFinancing: '€100K - €1M',
      turnaround: '180 days',
      apr: '10-12%',
    },
    {
      value: 'PRODUCTION',
      label: 'Production Output',
      icon: '🏭',
      gradient: 'from-amber-500 via-amber-600 to-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      description: 'Manufacturing output, production metrics',
      bestFor: 'Factories, producers',
      avgFinancing: '€200K - €2M',
      turnaround: '365 days',
      apr: '10-12%',
    },
    {
      value: 'SHIPMENT',
      label: 'Shipment / Logistics',
      icon: '🚢',
      gradient: 'from-cyan-500 via-cyan-600 to-cyan-700',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      description: 'Logistics data, bill of lading',
      bestFor: 'Import/export companies',
      avgFinancing: '€100K - €1M',
      turnaround: '120 days',
      apr: '9-11%',
    },
    {
      value: 'CONTRACT',
      label: 'Service Contract',
      icon: '📋',
      gradient: 'from-purple-500 via-purple-600 to-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Service contracts, revenue-based financing',
      bestFor: 'Service providers, contractors',
      avgFinancing: '€50K - €500K',
      turnaround: '180 days',
      apr: '8-10%',
    },
    {
      value: 'RECEIVABLE',
      label: 'Receivables Pool',
      icon: '💰',
      gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      description: 'Pool of accounts receivable, revenue streams',
      bestFor: 'Companies with recurring revenue',
      avgFinancing: '€200K - €3M',
      turnaround: '365 days',
      apr: '9-11%',
    },
  ];

  // Currency options
  const currencies = [
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 1 },
    { code: 'XOF', symbol: 'CFA', name: 'West African CFA Franc', flag: '🌍', rate: 655.957 },
  ];

  // Unit options by asset type
  const unitOptions: Record<AssetType, string[]> = {
    INVOICE: ['invoices', 'documents', 'contracts'],
    INVENTORY: ['units', 'tons', 'kg', 'bales', 'boxes', 'pallets', 'containers'],
    PRODUCTION: ['units', 'tons', 'liters', 'kWh', 'items'],
    SHIPMENT: ['containers', 'pallets', 'tons', 'shipments'],
    CONTRACT: ['contracts', 'agreements', 'projects'],
    RECEIVABLE: ['accounts', 'invoices', 'receivables'],
  };

  const getConvertedValue = () => {
    if (!formData.value || formData.currency === 'EUR') return null;
    const eurValue = parseFloat(formData.value) / 655.957;
    return eurValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate asset submission (MVP testnet)
    await new Promise(resolve => setTimeout(resolve, 2000));

    sessionStorage.setItem('submittedAsset', JSON.stringify({
      ...formData,
      certificateId: `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending_certification',
    }));

    setShowSuccess(true);
    setIsSubmitting(false);

    setTimeout(() => {
      navigate('/originator/assets/certificates');
    }, 2000);
  };

  const canContinue = () => {
    if (step === 1) return formData.assetType;
    if (step === 2) return formData.value && formData.quantity && formData.warehouseLocation && formData.description;
    if (step === 3) return true;
    return false;
  };

  const getProgress = () => {
    return (step / 3) * 100;
  };

  const selectedAsset = assetTypes.find(a => a.value === formData.assetType);

  // Success Animation Component
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center py-12">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Submission Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your asset has been submitted for certification. You'll receive a confirmation email shortly.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              <strong>Next:</strong> GDIZ/SIPI will review your asset within 24 hours
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={() => navigate('/originator/assets/certificates')}>
            View Certificates →
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <MVPBanner />

      {/* Sticky Header with Progress */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#023D7A] to-[#00A8A8] bg-clip-text text-transparent">
                Submit Asset for Tokenization
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                {step === 1 && 'Choose your asset type'}
                {step === 2 && 'Enter asset details'}
                {step === 3 && 'Review and submit'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="p-2 text-gray-600 hover:text-[#023D7A] hover:bg-gray-100 rounded-lg transition-colors"
                title="Print"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>
              <TestnetNotice variant="badge" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pb-4">
            <div className="flex items-center justify-between mb-2">
              {[
                { num: 1, label: 'Asset Type', icon: '📊' },
                { num: 2, label: 'Details', icon: '📝' },
                { num: 3, label: 'Review', icon: '✓' },
              ].map((s, idx) => (
                <div key={s.num} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                    step >= s.num ? 'bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                      {step > s.num ? '✓' : s.num}
                    </div>
                    <span className="text-xs font-medium hidden sm:block">{s.label}</span>
                  </div>
                  {idx < 2 && (
                    <div className={`w-12 sm:w-20 h-1 mx-2 rounded-full transition-all ${
                      step > s.num + 1 ? 'bg-gradient-to-r from-[#023D7A] to-[#00A8A8]' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            {/* Overall Progress */}
            <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#023D7A] via-[#00A8A8] to-emerald-500 transition-all duration-500"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Step 1: Asset Type Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-br from-[#023D7A] via-[#00A8A8] to-cyan-600 text-white border-none shadow-xl">
              <div className="flex items-start gap-4">
                <div className="text-5xl">💡</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">Choose Your Asset Type</h2>
                  <p className="text-white/90 mb-4">
                    Select the type of asset you want to tokenize. Each type has different financing terms, rates, and certification requirements.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-2xl mb-1">⚡</div>
                      <div className="font-semibold">24h</div>
                      <div className="text-white/70 text-xs">Certification</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-2xl mb-1">🔒</div>
                      <div className="font-semibold">100%</div>
                      <div className="text-white/70 text-xs">Blockchain</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-2xl mb-1">💰</div>
                      <div className="font-semibold">€50M+</div>
                      <div className="text-white/70 text-xs">Available</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-2xl mb-1">🏢</div>
                      <div className="font-semibold">50+</div>
                      <div className="text-white/70 text-xs">Operators</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Asset Type Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assetTypes.map((type) => (
                <div
                  key={type.value}
                  onClick={() => setFormData(prev => ({ ...prev, assetType: type.value }))}
                  className={`
                    group cursor-pointer transition-all duration-300
                    ${formData.assetType === type.value
                      ? 'scale-105'
                      : 'hover:scale-[1.02]'
                    }
                  `}
                >
                  <Card className={`
                    h-full relative overflow-hidden border-2 transition-all duration-300
                    ${formData.assetType === type.value
                      ? `${type.borderColor} shadow-xl ring-2 ring-offset-2 ${type.borderColor.replace('border-', 'ring-')}`
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                    }
                    ${type.bgColor}
                  `}>
                    {/* Gradient Background on Select */}
                    {formData.assetType === type.value && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-5`} />
                    )}

                    {/* Content */}
                    <div className="relative">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        {type.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{type.label}</h3>
                      <p className="text-sm text-gray-600 mb-3">{type.description}</p>

                      {/* Quick Stats */}
                      <div className="space-y-2 text-xs mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Best for</span>
                          <span className="font-medium text-gray-900 text-right">{type.bestFor}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Financing</span>
                          <span className="font-medium text-green-600">{type.avgFinancing}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium text-gray-900">{type.turnaround}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">APR</span>
                          <span className="font-medium text-blue-600">{type.apr}</span>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {formData.assetType === type.value ? (
                        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 rounded-xl font-semibold shadow-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Selected
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-2.5 text-sm font-medium group-hover:text-gray-700">
                          Click to select
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Asset Details */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Selected Asset Banner */}
            {selectedAsset && (
              <Card className={`bg-gradient-to-r ${selectedAsset.gradient} text-white border-none shadow-xl`}>
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedAsset.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{selectedAsset.label}</h2>
                    <p className="text-white/90">{selectedAsset.description}</p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="text-3xl font-bold">{selectedAsset.apr}</div>
                    <div className="text-white/80 text-sm">Target APR</div>
                  </div>
                </div>
              </Card>
            )}

            {/* Financial Details Section */}
            <Card>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-xl">💰</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Financial Details</h2>
                  <p className="text-sm text-gray-600">Specify the value and quantity of your asset</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Currency Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Currency *</label>
                  <div className="grid grid-cols-2 gap-4">
                    {currencies.map((curr) => (
                      <div
                        key={curr.code}
                        onClick={() => setFormData(prev => ({ ...prev, currency: curr.code as 'EUR' | 'XOF' }))}
                        className={`
                          p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                          ${formData.currency === curr.code
                            ? 'border-green-500 bg-green-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{curr.flag}</span>
                            <div>
                              <p className="font-semibold text-gray-900">{curr.name}</p>
                              <p className="text-sm text-gray-600">{curr.symbol} ({curr.code})</p>
                            </div>
                          </div>
                          {formData.currency === curr.code && (
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Value & Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label={`Asset Value (${formData.currency}) *`}
                      name="value"
                      type="number"
                      value={formData.value}
                      onChange={handleChange}
                      placeholder={formData.currency === 'EUR' ? '100,000' : '65,595,700'}
                      fullWidth
                      leftAddon={<span className="text-gray-500 font-semibold">{currencies.find(c => c.code === formData.currency)?.symbol}</span>}
                    />
                    {getConvertedValue() && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                        <span>💱</span>
                        <span>≈ <strong>€{getConvertedValue()} EUR</strong></span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Input
                      label="Quantity *"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="1000"
                      fullWidth
                    />
                  </div>
                </div>

                {/* Unit Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unit of Measure *</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-medium"
                  >
                    {unitOptions[formData.assetType || 'INVOICE'].map((unit) => (
                      <option key={unit} value={unit}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</option>
                    ))}
                  </select>
                </div>

                {/* Validity Period */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Certificate Validity</label>
                  <div className="relative">
                    <Input
                      name="validityDays"
                      type="number"
                      value={formData.validityDays}
                      onChange={handleChange}
                      placeholder="365"
                      fullWidth
                      rightAddon={<span className="text-gray-500 font-medium">days</span>}
                    />
                    <div className="mt-2 flex gap-2">
                      {[90, 180, 365, 730].map((days) => (
                        <button
                          key={days}
                          onClick={() => setFormData(prev => ({ ...prev, validityDays: days.toString() }))}
                          className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                            formData.validityDays === days.toString()
                              ? 'bg-[#023D7A] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {days >= 365 ? `${days/365} year` : `${days} days`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Location & Description Section */}
            <Card>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-xl">📍</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Location & Description</h2>
                  <p className="text-sm text-gray-600">Where is your asset stored and what is it?</p>
                </div>
              </div>

              <div className="space-y-6">
                <Input
                  label="Warehouse/Storage Location *"
                  name="warehouseLocation"
                  value={formData.warehouseLocation}
                  onChange={handleChange}
                  placeholder="e.g., GDIZ Warehouse A, Zone Industrielle, Lomé, Togo"
                  fullWidth
                  helperText="Provide the complete address where the asset is stored"
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Detailed Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-medium resize-none"
                    placeholder="e.g., 1000 cotton bales, Grade A, harvested 2026, stored in climate-controlled facility with humidity control. Each bale weighs approximately 200kg and is wrapped in protective packaging."
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">Be as detailed as possible for accurate certification</p>
                    <p className="text-xs text-gray-500">{formData.description.length} characters</p>
                  </div>
                </div>

                <Input
                  label="IPFS Hash (Optional)"
                  name="ipfsHash"
                  value={formData.ipfsHash}
                  onChange={handleChange}
                  placeholder="QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
                  fullWidth
                  helperText="Upload documents to IPFS and paste the hash for decentralized storage"
                />
              </div>
            </Card>

            {/* Requirements Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📋</div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#103b5b] mb-3">Required Documents for Certification</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { icon: '📄', text: 'Proof of ownership or title' },
                      { icon: '✓', text: 'Quality certificates (if applicable)' },
                      { icon: '🛡️', text: 'Insurance documents' },
                      { icon: '📸', text: 'Photos or inspection reports' },
                    ].map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-blue-700">
                        <span>{req.icon}</span>
                        <span>{req.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 bg-blue-100 px-3 py-2 rounded-lg">
                    <span>ℹ️</span>
                    <span><strong>MVP Testnet:</strong> Mock documents are accepted for testing</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Summary Banner */}
            {selectedAsset && (
              <Card className={`bg-gradient-to-r ${selectedAsset.gradient} text-white border-none shadow-xl`}>
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedAsset.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedAsset.label}</h2>
                    <p className="text-white/90">Ready for certification</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Review Grid */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-2xl">📋</span>
                Review Your Submission
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Asset Type */}
                <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Asset Type</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedAsset?.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900">{selectedAsset?.label}</p>
                      <p className="text-xs text-gray-600">{formData.assetType}</p>
                    </div>
                  </div>
                </div>

                {/* Value */}
                <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Asset Value</p>
                  <p className="text-3xl font-bold text-green-600">
                    {currencies.find(c => c.code === formData.currency)?.symbol}{Number(formData.value || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{formData.currency}</p>
                </div>

                {/* Quantity */}
                <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl border border-blue-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quantity</p>
                  <p className="text-3xl font-bold text-blue-600">{formData.quantity || 0}</p>
                  <p className="text-xs text-gray-600 mt-1">{formData.unit}</p>
                </div>

                {/* Validity */}
                <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Certificate Validity</p>
                  <p className="text-3xl font-bold text-purple-600">{formData.validityDays}</p>
                  <p className="text-xs text-gray-600 mt-1">days</p>
                </div>
              </div>

              {/* Location */}
              <div className="mt-4 p-5 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl border border-amber-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">📍 Warehouse Location</p>
                <p className="font-semibold text-gray-900">{formData.warehouseLocation || 'Not specified'}</p>
              </div>

              {/* Description */}
              <div className="mt-4 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">📝 Description</p>
                <p className="font-medium text-gray-900 whitespace-pre-wrap">{formData.description || 'Not specified'}</p>
              </div>
            </Card>

            {/* Process Timeline */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <h3 className="font-bold text-[#103b5b] mb-6 flex items-center gap-3">
                <span className="text-2xl">🔄</span>
                Certification Process Timeline
              </h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Submit Application', desc: 'Your asset submission is sent to Industrial Gateway', icon: '📤' },
                  { step: 2, title: 'GDIZ/SIPI Review', desc: 'Asset is reviewed and verified (24 hours)', icon: '🔍' },
                  { step: 3, title: 'Certificate Issued', desc: 'Unique certificate ID is generated', icon: '📜' },
                  { step: 4, title: 'UGT Token Minted', desc: 'Guarantee Token created as collateral', icon: '🪙' },
                  { step: 5, title: 'Access Financing', desc: 'Use UGT to secure financing from liquidity pools', icon: '💰' },
                ].map((item, idx) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                        {item.icon}
                      </div>
                      {idx < 4 && <div className="absolute left-1/2 top-10 w-0.5 h-8 -ml-px bg-amber-300" />}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-semibold text-[#103b5b]">{item.step}. {item.title}</p>
                      <p className="text-sm text-amber-700">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Declaration */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-green-900 mb-2">Declaration & Terms</h4>
                  <p className="text-sm text-green-700 mb-3">
                    By submitting, you confirm that:
                  </p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• All information provided is accurate and complete</li>
                    <li>• You have legal ownership of the asset</li>
                    <li>• The asset is free from existing liens or encumbrances</li>
                    <li>• You agree to the certification terms and conditions</li>
                  </ul>
                  <p className="text-xs text-green-600 mt-3 italic">
                    False declarations may result in certification revocation and legal action.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 sticky bottom-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pb-4">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="px-6"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              variant="primary"
              size="lg"
              onClick={() => setStep(step + 1)}
              disabled={!canContinue()}
              className="px-8 bg-gradient-to-r from-[#023D7A] to-[#00A8A8] hover:from-[#0d3352] hover:to-[#0D7A7A]"
            >
              Continue
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={!canContinue() || isSubmitting}
              isLoading={isSubmitting}
              className="px-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <Ondo Finance className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit for Certification
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div className="flex-1">
              <h4 className="font-bold text-[#103b5b] mb-2 text-lg">What is Asset Tokenization?</h4>
              <p className="text-sm text-blue-700 mb-4 leading-relaxed">
                Asset tokenization converts your physical assets (inventory, invoices, production) into digital certificates on the blockchain. These certificates can be used as collateral to access financing without selling your assets. This unlocks working capital while you retain ownership.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-blue-600">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                  <span className="text-lg">⚡</span>
                  <span className="font-semibold">24h certification</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                  <span className="text-lg">🔒</span>
                  <span className="font-semibold">Blockchain secured</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                  <span className="text-lg">💰</span>
                  <span className="font-semibold">Access to capital</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                  <span className="text-lg">🌍</span>
                  <span className="font-semibold">Global investors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AssetSubmission;
