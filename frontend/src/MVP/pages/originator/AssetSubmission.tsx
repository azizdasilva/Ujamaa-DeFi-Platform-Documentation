/**
 * Asset Submission Page - Submit Assets for Tokenization
 * 
 * Asset originators can submit assets (INVOICE, INVENTORY, PRODUCTION, SHIPMENT, CONTRACT)
 * for certification by Industrial Gateway (GDIZ/SIPI).
 * 
 * Route: /originator/assets/submit
 * 
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React, { useState } from 'react';
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

  const [formData, setFormData] = useState({
    assetType: 'INVOICE' as AssetType,
    value: '',
    quantity: '',
    unit: 'units',
    warehouseLocation: '',
    description: '',
    ipfsHash: '',
    validityDays: '365',
  });

  const assetTypes: { value: AssetType; label: string; description: string }[] = [
    {
      value: 'INVOICE',
      label: 'Invoice / Receivable',
      description: 'Trade finance receivables, commercial invoices',
    },
    {
      value: 'INVENTORY',
      label: 'Inventory / Stock',
      description: 'Warehouse inventory, commodity stocks',
    },
    {
      value: 'PRODUCTION',
      label: 'Production Output',
      description: 'Manufacturing output, production metrics',
    },
    {
      value: 'SHIPMENT',
      label: 'Shipment / Logistics',
      description: 'Logistics data, bill of lading',
    },
    {
      value: 'CONTRACT',
      label: 'Service Contract',
      description: 'Service contracts, revenue-based financing',
    },
    {
      value: 'RECEIVABLE',
      label: 'Receivables Pool',
      description: 'Pool of accounts receivable, revenue streams',
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate asset submission (MVP testnet)
    setTimeout(() => {
      // Store in session for demo
      sessionStorage.setItem('submittedAsset', JSON.stringify({
        ...formData,
        certificateId: `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        submittedAt: new Date().toISOString(),
        status: 'pending_certification',
      }));
      
      setIsSubmitting(false);
      navigate('/originator/assets/certificates');
    }, 2000);
  };

  const canContinue = () => {
    if (step === 1) return formData.assetType && formData.value && formData.quantity;
    if (step === 2) return formData.warehouseLocation && formData.description;
    if (step === 3) return true; // Review step
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Submit Asset for Tokenization</h1>
              <p className="text-gray-600 mt-1">
                Step {step} of 3: {step === 1 ? 'Asset Details' : step === 2 ? 'Location & Documentation' : 'Review'}
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
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    s <= step
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s < step ? '✓' : s}
                </div>
                <span className={`text-sm ${s <= step ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {s === 1 ? 'Asset Details' : s === 2 ? 'Documentation' : 'Review'}
                </span>
                {s < 3 && <div className={`w-16 h-0.5 ${s < step ? 'bg-green-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          {/* Step 1: Asset Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Select Asset Type</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Choose the type of asset you want to tokenize
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assetTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => setFormData(prev => ({ ...prev, assetType: type.value }))}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.assetType === type.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="primary" size="sm">{type.value}</Badge>
                      {formData.assetType === type.value && (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Input
                  label="Asset Value (EUR) *"
                  name="value"
                  type="number"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder="€100,000"
                  fullWidth
                  leftAddon={<span className="text-gray-500">€</span>}
                />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Unit of Measure *
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="units">Units</option>
                    <option value="tons">Tons</option>
                    <option value="kg">Kilograms</option>
                    <option value="bales">Bales</option>
                    <option value="boxes">Boxes</option>
                    <option value="pallets">Pallets</option>
                    <option value="containers">Containers</option>
                  </select>
                </div>
                <Input
                  label="Certificate Validity (Days)"
                  name="validityDays"
                  type="number"
                  value={formData.validityDays}
                  onChange={handleChange}
                  placeholder="365"
                  fullWidth
                />
              </div>
            </div>
          )}

          {/* Step 2: Location & Documentation */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Warehouse Location</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Where is the asset stored?
                </p>
              </div>

              <Input
                label="Warehouse Location *"
                name="warehouseLocation"
                value={formData.warehouseLocation}
                onChange={handleChange}
                placeholder="e.g., GDIZ Warehouse A, Lomé, Togo"
                fullWidth
              />

              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Asset Description</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Provide detailed information about the asset
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., 1000 cotton bales, Grade A, harvested 2026"
                />
              </div>

              <Input
                label="IPFS Hash (Stock Documents)"
                name="ipfsHash"
                value={formData.ipfsHash}
                onChange={handleChange}
                placeholder="QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
                fullWidth
                helperText="Upload documents to IPFS and paste the hash (optional for MVP)"
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Document Requirements</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Proof of ownership or title</li>
                      <li>• Quality certificates (if applicable)</li>
                      <li>• Insurance documents</li>
                      <li>• Photos or inspection reports</li>
                      <li>• <strong>MVP Testnet:</strong> Mock documents accepted</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Review Asset Submission</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Please verify all information before submitting
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Asset Type</span>
                  <Badge variant="primary" size="sm">{formData.assetType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Value</span>
                  <span className="font-semibold">€{Number(formData.value).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quantity</span>
                  <span className="font-semibold">{formData.quantity} {formData.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Warehouse</span>
                  <span className="font-semibold">{formData.warehouseLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Validity</span>
                  <span className="font-semibold">{formData.validityDays} days</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Description</span>
                  <p className="text-sm font-medium mt-1">{formData.description}</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Submission Process</h4>
                    <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                      <li>Asset submitted to Industrial Gateway</li>
                      <li>GDIZ/SIPI certifies the asset (1-2 business days)</li>
                      <li>Certificate created with unique ID</li>
                      <li>Mint UGT (Ujamaa Guarantee Token) as collateral</li>
                      <li>Use UGT to secure financing from Liquidity Pool</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                ← Back
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
              >
                Continue →
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={!canContinue() || isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Certification →'}
              </Button>
            )}
          </div>
        </Card>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Need Help?</h4>
              <p className="text-sm text-blue-700">
                Asset tokenization allows you to unlock capital from your assets. After certification, you can mint UGT tokens as collateral and access financing from our liquidity pools.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            🚀 MVP: Asset Tokenization - Testnet Release • Polygon Amoy (Chain ID: 80002)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AssetSubmission;
