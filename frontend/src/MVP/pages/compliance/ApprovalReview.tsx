/**
 * Compliance - Approval Review Page
 *
 * Detailed review page for individual KYC/KYB applications.
 *
 * Route: /compliance/approvals/:id/review
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const ApprovalReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'documents' | 'identity' | 'risk'>('documents');
  const [notes, setNotes] = useState('');

  // Mock application data - in production, fetch from API
  const application = {
    id: id || 'KYC-001',
    type: id?.startsWith('KYB') ? 'KYB' : 'KYC',
    name: id?.startsWith('KYB') ? 'Logic Capital Ltd' : 'John Doe',
    email: id?.startsWith('KYB') ? 'compliance@logiccapital.com' : 'john.doe@email.com',
    jurisdiction: 'MU',
    submittedDate: '2026-03-20',
    status: 'pending',
    riskLevel: 'low',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    documents: [
      { name: 'National ID / Certificate of Incorporation', status: 'verified', type: 'id', url: '#' },
      { name: 'Proof of Address / Tax Registration', status: 'verified', type: 'address', url: '#' },
      { name: 'Selfie with ID / UBO Declaration', status: 'pending', type: 'selfie', url: '#' },
      { name: 'Bank Statement / Board Resolution', status: 'pending', type: 'bank', url: '#' },
    ],
    investmentAmount: id?.startsWith('KYB') ? 500000 : 25000,
    sourceOfFunds: id?.startsWith('KYB') ? 'Corporate Treasury' : 'Employment Income',
    occupation: id?.startsWith('KYB') ? 'Investment Fund' : 'Software Engineer',
    phone: '+230 5XXX XXXX',
    dateOfBirth: id?.startsWith('KYB') ? 'N/A' : '1990-05-15',
    pep: false,
    sanctions: false,
    adverseMedia: false,
  };

  const handleApprove = () => {
    if (confirm(`Approve application ${application.id}?`)) {
      alert(`✓ Application ${application.id} approved!\n\nIn production, this will:\n• Update IdentityRegistry smart contract\n• Grant investor permissions\n• Send confirmation email\n• Log compliance event`);
      navigate('/compliance/kyc-review');
    }
  };

  const handleReject = () => {
    const reason = prompt('Please provide a rejection reason:');
    if (reason) {
      alert(`✗ Application ${application.id} rejected.\n\nReason: ${reason}\n\nIn production, this will:\n• Update database status\n• Send rejection email\n• Log compliance event`);
      navigate('/compliance/kyc-review');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate('/compliance/kyc-review')}
                  className="text-[#8b5b3d] hover:text-[#103b5b] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h1 className="text-3xl font-bold text-[#103b5b]">Review Application: {application.id}</h1>
              </div>
              <p className="text-[#8b5b3d] mt-1">{application.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={application.riskLevel === 'low' ? 'success' : application.riskLevel === 'medium' ? 'warning' : 'error'} size="lg">
                {application.riskLevel.toUpperCase()} RISK
              </Badge>
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Review Area */}
          <div className="lg:col-span-2">
            <Card>
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setSelectedTab('documents')}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    selectedTab === 'documents'
                      ? 'text-[#00A8A8] border-b-2 border-[#00A8A8]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📄 Documents
                </button>
                <button
                  onClick={() => setSelectedTab('identity')}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    selectedTab === 'identity'
                      ? 'text-[#00A8A8] border-b-2 border-[#00A8A8]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  👤 Identity & Information
                </button>
                <button
                  onClick={() => setSelectedTab('risk')}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    selectedTab === 'risk'
                      ? 'text-[#00A8A8] border-b-2 border-[#00A8A8]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ⚠️ Risk Assessment
                </button>
              </div>

              {/* Tab Content */}
              {selectedTab === 'documents' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#103b5b] mb-4">Submitted Documents</h3>
                  {application.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#023D7A]/10 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-[#023D7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-[#103b5b]">{doc.name}</p>
                          <p className="text-sm text-gray-500">Type: {doc.type.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={doc.status === 'verified' ? 'success' : 'warning'} size="md">
                          {doc.status.toUpperCase()}
                        </Badge>
                        <button className="px-3 py-1.5 bg-[#023D7A] hover:bg-[#0d3352] text-white text-sm font-bold rounded transition-colors">
                          View
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Document Verification Actions */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Document Verification Checklist</p>
                        <ul className="text-xs text-blue-700 mt-2 space-y-1">
                          <li>✓ Check document authenticity and validity</li>
                          <li>✓ Verify names match across all documents</li>
                          <li>✓ Confirm addresses are current and complete</li>
                          <li>✓ Review for signs of tampering or alteration</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'identity' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-semibold text-[#103b5b]">{application.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-semibold text-[#103b5b]">{application.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Jurisdiction</p>
                      <p className="font-semibold text-[#103b5b]">{application.jurisdiction}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Wallet Address</p>
                      <p className="font-mono text-xs text-[#103b5b]">{application.walletAddress}</p>
                    </div>
                    {!application.type.startsWith('KYB') && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Date of Birth</p>
                          <p className="font-semibold text-[#103b5b]">{application.dateOfBirth}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Occupation</p>
                          <p className="font-semibold text-[#103b5b]">{application.occupation}</p>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Investment Amount</p>
                      <p className="font-semibold text-[#103b5b]">€{application.investmentAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Source of Funds</p>
                      <p className="font-semibold text-[#103b5b]">{application.sourceOfFunds}</p>
                    </div>
                  </div>

                  {/* Compliance Checks */}
                  <div className="mt-6">
                    <h4 className="font-bold text-[#103b5b] mb-3">Compliance Screening</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-sm font-medium text-green-900">PEP (Politically Exposed Person) Check</span>
                        <Badge variant="success" size="sm">CLEAR ✓</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-sm font-medium text-green-900">Sanctions List Check</span>
                        <Badge variant="success" size="sm">CLEAR ✓</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-sm font-medium text-green-900">Adverse Media Check</span>
                        <Badge variant="success" size="sm">CLEAR ✓</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'risk' && (
                <div className="space-y-6">
                  {/* Risk Score */}
                  <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-green-900">Overall Risk Assessment</p>
                        <p className="text-3xl font-bold text-green-800 mt-2">{application.riskLevel.toUpperCase()}</p>
                      </div>
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div>
                    <h4 className="font-bold text-[#103b5b] mb-3">Risk Factors Analysis</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Jurisdiction Risk</span>
                        <Badge variant="success" size="sm">LOW</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Investment Amount Risk</span>
                        <Badge variant={application.investmentAmount > 100000 ? 'warning' : 'success'} size="sm">
                          {application.investmentAmount > 100000 ? 'MEDIUM' : 'LOW'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Source of Funds Risk</span>
                        <Badge variant="success" size="sm">LOW</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">PEP/Sanctions Risk</span>
                        <Badge variant="success" size="sm">CLEAR</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Due Diligence */}
                  {application.riskLevel === 'high' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-red-900">Enhanced Due Diligence Required</p>
                          <p className="text-xs text-red-700 mt-1">
                            High-risk applications require additional verification steps and senior compliance officer approval.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Compliance Officer Notes */}
            <Card className="mt-6">
              <h3 className="font-bold text-[#103b5b] mb-3">Compliance Officer Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes or observations about this application..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8] focus:border-transparent min-h-[120px]"
              />
              <p className="text-xs text-gray-500 mt-2">Notes will be attached to the compliance record.</p>
            </Card>
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-6">
            {/* Decision Card */}
            <Card>
              <h3 className="font-bold text-[#103b5b] mb-4">Review Decision</h3>
              
              <div className="space-y-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleApprove}
                  className="w-full"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve Application
                </Button>
                
                <Button
                  variant="danger"
                  size="lg"
                  onClick={handleReject}
                  className="w-full"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject Application
                </Button>
              </div>

              {/* Notice */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Important</p>
                    <p className="text-xs text-amber-700 mt-1">
                      This action cannot be undone. Ensure all documents have been verified before making a decision.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Application Summary */}
            <Card>
              <h3 className="font-bold text-[#103b5b] mb-4">Application Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Application ID</span>
                  <span className="font-mono text-[#103b5b]">{application.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <Badge variant={application.type === 'KYB' ? 'primary' : 'info'} size="sm">{application.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted</span>
                  <span className="text-[#103b5b]">{application.submittedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <Badge variant="warning" size="sm">PENDING</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Risk Level</span>
                  <Badge variant={application.riskLevel === 'low' ? 'success' : 'warning'} size="sm">
                    {application.riskLevel.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card>
              <h3 className="font-bold text-[#103b5b] mb-4">Review Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Application Submitted</p>
                    <p className="text-xs text-gray-500">{application.submittedDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Under Review</p>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2" />
                  <div>
                    <p className="text-sm text-gray-500">Decision Pending</p>
                    <p className="text-xs text-gray-400">Awaiting compliance officer</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApprovalReview;
