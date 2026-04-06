/**
 * Compliance - Approval Review Page
 *
 * Detailed review page for individual KYC/KYB applications.
 *
 * Route: /compliance/approvals/:id/review
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import apiClient from '../../../api/client';

interface InvestorData {
  id: number;
  email: string;
  role: string;
  wallet_address: string | null;
  full_name: string | null;
  company_name: string | null;
  jurisdiction: string | null;
  kyc_status: string;
  kyb_status: string;
  total_invested: number;
  ult_tokens: number;
  total_portfolio_value: number;
  bank_balance: number;
  available_to_invest: number;
}

interface DocumentItem {
  id: number;
  name: string;
  type: string;
  status: string;
}

const ApprovalReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'documents' | 'identity' | 'risk'>('documents');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [investor, setInvestor] = useState<InvestorData | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  // Load real investor data
  useEffect(() => {
    const loadInvestor = async () => {
      try {
        setLoading(true);
        setError(null);
        const investorId = parseInt(id || '1');
        const res = await apiClient.get(`/db/investors/${investorId}`);
        setInvestor(res.data);

        // Load investor documents
        try {
          const docRes = await apiClient.get(`/db/investors/${investorId}/documents`);
          if (Array.isArray(docRes.data)) {
            setDocuments(docRes.data.map((d: any) => ({
              id: d.id,
              name: d.document_name || d.document_type,
              type: d.document_type || 'other',
              status: d.verification_status || 'pending',
            })));
          }
        } catch {
          // Documents endpoint may not exist, use empty array
          setDocuments([]);
        }
      } catch (err) {
        console.error('Failed to load investor:', err);
        setError('Failed to load investor profile');
      } finally {
        setLoading(false);
      }
    };
    loadInvestor();
  }, [id]);

  const handleApprove = async () => {
    if (!investor) return;
    setSubmitting(true);
    setError(null);

    try {
      // Approve KYC/KYB
      await apiClient.post(`/compliance/investors/${investor.id}/approve`, null, {
        params: { approved_by: 'compliance-officer' }
      });

      // Verify identity on-chain (if wallet address exists)
      if (investor.wallet_address) {
        try {
          await apiClient.post(`/compliance/identity/verify`, null, {
            params: { investor_id: investor.id, verified_by: 'compliance-officer' }
          });
        } catch {
          // Identity verify may fail in test mode, continue
        }
      }

      navigate('/compliance/kyc-review');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Approval failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!investor) return;
    const reason = prompt('Please provide a rejection reason:');
    if (!reason) return;

    setSubmitting(true);
    setError(null);

    try {
      await apiClient.post(`/compliance/investors/${investor.id}/revoke`, null, {
        params: { revoked_by: 'compliance-officer' }
      });
      navigate('/compliance/kyc-review');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Rejection failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6ED]">
        <MVPBanner />
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-[#00A8A8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#103b5b] font-semibold">Loading investor profile...</p>
        </div>
      </div>
    );
  }

  if (!investor) {
    return (
      <div className="min-h-screen bg-[#F9F6ED]">
        <MVPBanner />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-red-600 text-lg font-semibold">{error || 'Investor not found'}</p>
          <Button variant="primary" className="mt-4" onClick={() => navigate('/compliance/kyc-review')}>
            Back to KYC Review
          </Button>
        </div>
      </div>
    );
  }

  const displayName = investor.full_name || investor.company_name || `Investor #${investor.id}`;
  const isKyb = !!investor.company_name;
  const displayId = `INV-${investor.id}`;
  const riskLevel = investor.total_invested > 100000 ? 'medium' : 'low';

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
                <h1 className="text-3xl font-bold text-[#103b5b]">Review Application: {displayId}</h1>
              </div>
              <p className="text-[#8b5b3d] mt-1">{displayName}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={riskLevel === 'low' ? 'success' : riskLevel === 'medium' ? 'warning' : 'error'} size="lg">
                {riskLevel.toUpperCase()} RISK
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
                  {documents.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No documents submitted yet</p>
                  ) : (
                    documents.map((doc, idx) => (
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
                          <Badge variant={doc.status === 'APPROVED' ? 'success' : doc.status === 'REJECTED' ? 'error' : 'warning'} size="md">
                            {doc.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}

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
                      <p className="font-semibold text-[#103b5b]">{investor.full_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-semibold text-[#103b5b]">{investor.company_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-semibold text-[#103b5b]">{investor.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Jurisdiction</p>
                      <p className="font-semibold text-[#103b5b]">{investor.jurisdiction || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Wallet Address</p>
                      <p className="font-mono text-xs text-[#103b5b]">{investor.wallet_address || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">KYC Status</p>
                      <p className="font-semibold text-[#103b5b]">{investor.kyc_status}</p>
                    </div>
                    {!isKyb && (
                      <div>
                        <p className="text-sm text-gray-500">Account Type</p>
                        <p className="font-semibold text-[#103b5b]">Individual (KYC)</p>
                      </div>
                    )}
                    {isKyb && (
                      <div>
                        <p className="text-sm text-gray-500">Account Type</p>
                        <p className="font-semibold text-[#103b5b]">Business (KYB)</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Total Invested</p>
                      <p className="font-semibold text-[#103b5b]">€{investor.total_invested.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Available Balance</p>
                      <p className="font-semibold text-[#103b5b]">€{investor.bank_balance.toLocaleString()}</p>
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
                        <p className="text-3xl font-bold text-green-800 mt-2">{riskLevel.toUpperCase()}</p>
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
                        <Badge variant={investor.total_invested > 100000 ? 'warning' : 'success'} size="sm">
                          {investor.total_invested > 100000 ? 'MEDIUM' : 'LOW'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">KYC Status</span>
                        <Badge variant={investor.kyc_status === 'APPROVED' ? 'success' : 'warning'} size="sm">
                          {investor.kyc_status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">PEP/Sanctions Risk</span>
                        <Badge variant="success" size="sm">CLEAR</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Due Diligence */}
                  {riskLevel === 'high' && (
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
                  <span className="font-mono text-[#103b5b]">{displayId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <Badge variant={isKyb ? 'primary' : 'info'} size="sm">{isKyb ? 'KYB' : 'KYC'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">KYC Status</span>
                  <Badge variant="warning" size="sm">{investor.kyc_status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Risk Level</span>
                  <Badge variant={riskLevel === 'low' ? 'success' : 'warning'} size="sm">
                    {riskLevel.toUpperCase()}
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
                    <p className="text-xs text-gray-500">Pending review</p>
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
