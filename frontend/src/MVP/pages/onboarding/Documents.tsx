/**
 * Onboarding Flow - Step 3: Document Upload (KYC/KYB)
 * 
 * Users upload identity documents for verification.
 * Different documents for Retail (KYC) vs Institutional (KYB).
 * 
 * Route: /onboarding/:type/documents
 * 
 * @notice MVP TESTNET: This is a testnet deployment. Documents are for demo only.
 */

import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

interface UploadedDocument {
  name: string;
  size: string;
  type: string;
  uploaded: boolean;
}

const OnboardingDocuments: React.FC = () => {
  const { type } = useParams<{ type: 'retail' | 'institutional' | 'originator' }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedDocument>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Document requirements by investor type
  const documentRequirements = {
    retail: [
      { id: 'passport', name: 'Passport / National ID', required: true, description: 'Valid government-issued ID' },
      { id: 'proof_address', name: 'Proof of Address', required: true, description: 'Utility bill or bank statement (< 3 months)' },
      { id: 'selfie', name: 'Selfie with ID', required: true, description: 'Photo holding your ID next to your face' },
      { id: 'source_funds', name: 'Source of Funds', required: false, description: 'Bank statement or employment letter' },
    ],
    institutional: [
      { id: 'certificate_inc', name: 'Certificate of Incorporation', required: true, description: 'Official registration document' },
      { id: 'memorandum', name: 'Memorandum & Articles', required: true, description: 'Company constitution' },
      { id: 'ubo_id', name: 'UBO Passports/IDs', required: true, description: 'IDs of all Ultimate Beneficial Owners (>25%)' },
      { id: 'ubo_proof', name: 'UBO Proof of Address', required: true, description: 'Proof of address for all UBOs' },
      { id: 'company_bank', name: 'Company Bank Statement', required: true, description: 'Recent bank statement (< 3 months)' },
      { id: 'source_wealth', name: 'Source of Wealth', required: true, description: 'Documentation showing company wealth source' },
      { id: 'board_resolution', name: 'Board Resolution', required: false, description: 'Resolution authorizing this investment' },
    ],
    originator: [
      { id: 'certificate_inc', name: 'Certificate of Incorporation', required: true, description: 'Official registration document' },
      { id: 'tax_clearance', name: 'Tax Clearance Certificate', required: true, description: 'Valid tax clearance' },
      { id: 'financial_statements', name: 'Financial Statements', required: true, description: 'Last 2 years audited statements' },
      { id: 'business_plan', name: 'Business Plan', required: true, description: 'Detailed business plan with projections' },
      { id: 'asset_docs', name: 'Asset Documentation', required: false, description: 'Documents for assets to be financed' },
      { id: 'gdiz_cert', name: 'GDIZ (Benin) Certificate', required: false, description: 'GDIZ (Benin) certification (if applicable)' },
    ],
  };

  const handleFileUpload = (docId: string, file: File) => {
    setUploading(docId);
    
    // Simulate upload (MVP testnet - no actual upload)
    setTimeout(() => {
      setUploadedDocs(prev => ({
        ...prev,
        [docId]: {
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type,
          uploaded: true,
        },
      }));
      setUploading(null);
    }, 1000);
  };

  const handleRemoveDocument = (docId: string) => {
    setUploadedDocs(prev => {
      const newDocs = { ...prev };
      delete newDocs[docId];
      return newDocs;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const allRequiredUploaded = () => {
    const requirements = documentRequirements[type as keyof typeof documentRequirements];
    return requirements
      .filter(doc => doc.required)
      .every(doc => uploadedDocs[doc.id]?.uploaded);
  };

  const getMissingDocuments = () => {
    const requirements = documentRequirements[type as keyof typeof documentRequirements];
    return requirements
      .filter(doc => doc.required && !uploadedDocs[doc.id]?.uploaded)
      .map(doc => doc.name);
  };

  const handleContinue = () => {
    setValidationError(null);
    
    if (!allRequiredUploaded()) {
      const missingDocs = getMissingDocuments();
      setValidationError(`Missing required documents: ${missingDocs.join(', ')}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    sessionStorage.setItem('onboardingDocs', JSON.stringify(uploadedDocs));
    navigate(`/onboarding/${type}/review`);
  };

  const requirements = documentRequirements[type as keyof typeof documentRequirements];
  const uploadedCount = Object.keys(uploadedDocs).length;
  const requiredCount = requirements.filter(d => d.required).length;
  const progress = (uploadedCount / requirements.length) * 100;

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
                Step 3 of 5: Document Upload ({type === 'retail' ? 'KYC' : 'KYB'})
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
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                ✓
              </div>
              <span className="text-sm text-gray-500">Personal Info</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <span className="text-sm font-medium text-gray-900">Documents</span>
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
        {/* Validation Error Banner */}
        {validationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-red-900">Missing Required Documents</h4>
                <p className="text-sm text-red-700 mt-1">{validationError}</p>
                <p className="text-sm text-red-700 mt-2">Please upload all required documents before continuing.</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Document Upload Progress</h2>
            <Badge variant={allRequiredUploaded() ? 'success' : 'warning'} size="md">
              {uploadedCount}/{requirements.length} Documents
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className={`h-3 rounded-full transition-all ${
                allRequiredUploaded() ? 'bg-green-600' : 'bg-amber-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {requiredCount - Object.keys(uploadedDocs).filter(k => requirements.find(r => r.id === k)).length} more required document(s) to upload
          </p>
        </Card>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">
                {type === 'retail' ? 'KYC Document Requirements' : 'KYB Document Requirements'}
              </h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• All documents must be clear, color scans (PDF, JPG, or PNG)</li>
                <li>• Maximum file size: 10MB per document</li>
                <li>• Documents must be valid and not expired</li>
                <li>• Non-English documents require certified translation</li>
                <li>• <strong>MVP Testnet:</strong> Upload any sample documents for demo purposes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Document Upload List */}
        <div className="space-y-4">
          {requirements.map((doc) => {
            const uploaded = uploadedDocs[doc.id];
            const isUploading = uploading === doc.id;

            return (
              <Card key={doc.id} className={uploaded ? 'border-green-300 bg-green-50' : ''}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                      {doc.required && (
                        <Badge variant="error" size="sm">Required</Badge>
                      )}
                      {!doc.required && (
                        <Badge variant="info" size="sm">Optional</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{doc.description}</p>

                    {uploaded ? (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{uploaded.name}</p>
                          <p className="text-sm text-gray-500">{uploaded.size}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          id={`file-${doc.id}`}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(doc.id, file);
                          }}
                        />
                        <label
                          htmlFor={`file-${doc.id}`}
                          className={`px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                            isUploading
                              ? 'border-amber-300 bg-amber-50'
                              : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                          }`}
                        >
                          {isUploading ? (
                            <span className="flex items-center gap-2 text-amber-600">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <Ondo Finance className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Uploading...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-gray-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Choose File
                            </span>
                          )}
                        </label>
                        <span className="text-sm text-gray-500">PDF, JPG, PNG (max 10MB)</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Document Tips */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold text-blue-900 mb-3">📋 Document Tips</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>Ensure documents are well-lit and all corners are visible</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>For ID documents, both front and back sides are required</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>Proof of address must show your full name and address</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>For KYB: UBO documents required for all shareholders with &gt;25% ownership</span>
            </li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={() => navigate(`/onboarding/${type}/personal`)}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back
          </button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={!allRequiredUploaded()}
          >
            Continue to Review →
          </Button>
        </div>
      </main>
    </div>
  );
};

export default OnboardingDocuments;
