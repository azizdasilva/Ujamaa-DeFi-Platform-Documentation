/**
 * Compliance - KYC/KYB Review Page
 *
 * Review and approve KYC/KYB submissions.
 *
 * Route: /compliance/kyc-review
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import complianceAPI, { Document } from '../../../api/compliance';

const KYCReview: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Current user (compliance officer) - in production get from auth context
  const complianceOfficerId = 4; // Default compliance officer ID

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);
      const pending = await complianceAPI.getPendingDocuments();
      setDocuments(pending);
    } catch (error) {
      console.error('Error fetching pending documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (action: 'approve' | 'reject') => {
    if (!selectedDoc) return;

    try {
      await complianceAPI.reviewDocument(selectedDoc.id, {
        action,
        notes: reviewNotes || `Document ${action}ed via compliance review`,
        reviewer_id: complianceOfficerId
      });

      alert(`✓ Document ${action}ed successfully!`);
      setShowReviewModal(false);
      setReviewNotes('');
      setSelectedDoc(null);
      
      // Refresh the list
      fetchPendingDocuments();
      
      // Navigate back to dashboard to show updated stats
      navigate('/compliance/dashboard');
    } catch (error: any) {
      console.error('Error reviewing document:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to review document';
      alert(`✗ Error: ${errorMsg}`);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'kyc_id': '🆔 National ID',
      'kyc_address': '📄 Proof of Address',
      'kyc_selfie': '🤳 Selfie with ID',
      'kyb_incorporation': '📜 Certificate of Incorporation',
      'kyb_tax': '💰 Tax Registration',
      'kyb_ubo': '👥 UBO Declaration',
      'kyb_resolution': '📋 Board Resolution',
      'kyb_aml': '🛡️ AML Policy',
      'kyb_license': '📇 Business License',
    };
    return labels[type] || type;
  };

  const getRiskBadgeColor = (jurisdiction: string) => {
    // Simple risk assessment based on jurisdiction
    const highRisk = ['NG', 'KE', 'ZA']; // Example high-risk jurisdictions
    return highRisk.includes(jurisdiction) ? 'amber' : 'info';
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">KYC/KYB Review</h1>
              <p className="text-[#8b5b3d] mt-1">Review and approve investor applications</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Pending Review</p>
            <p className="text-2xl font-bold text-[#103b5b]">{loading ? '-' : documents.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">KYC Documents</p>
            <p className="text-2xl font-bold text-green-600">{loading ? '-' : documents.filter(d => d.document_type.startsWith('kyc')).length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">KYB Documents</p>
            <p className="text-2xl font-bold text-amber-600">{loading ? '-' : documents.filter(d => d.document_type.startsWith('kyb')).length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Overdue</p>
            <p className="text-2xl font-bold text-red-600">{loading ? '-' : documents.filter(d => d.is_overdue).length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Documents List */}
          <div className="lg:col-span-1">
            <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Pending Documents</h2>}>
              <div className="space-y-2">
                {loading ? (
                  <p className="text-center text-gray-500 py-8">Loading...</p>
                ) : documents.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No pending documents 🎉</p>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedDoc?.id === doc.id
                          ? 'bg-[#023D7A] text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-semibold text-sm ${
                          selectedDoc?.id === doc.id ? 'text-white' : 'text-gray-900'
                        }`}>
                          #{doc.id}
                        </p>
                        <Badge
                          variant={
                            doc.is_overdue ? 'danger' :
                            (doc.time_remaining_hours || 24) < 4 ? 'warning' : 'success'
                          }
                          size="sm"
                        >
                          {doc.is_overdue ? '⚠️ Overdue' : `${Math.round(doc.time_remaining_hours || 24)}h`}
                        </Badge>
                      </div>
                      <p className={`text-xs ${
                        selectedDoc?.id === doc.id ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        {doc.investor_name || `Investor #${doc.investor_id}`}
                      </p>
                      <p className={`text-xs ${
                        selectedDoc?.id === doc.id ? 'text-white/60' : 'text-gray-500'
                      }`}>
                        {getDocumentTypeLabel(doc.document_type)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Document Details */}
          <div className="lg:col-span-2">
            {selectedDoc ? (
              <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Document Details</h2>}>
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-lg font-bold text-[#103b5b]">{selectedDoc.investor_name || `Investor #${selectedDoc.investor_id}`}</h3>
                      <p className="text-sm text-[#8b5b3d]">Jurisdiction: {selectedDoc.investor_jurisdiction || 'Unknown'}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={selectedDoc.is_overdue ? 'danger' : 'info'} size="lg">
                        {selectedDoc.is_overdue ? '⚠️ OVERDUE' : `${Math.round(selectedDoc.time_remaining_hours || 24)}h remaining`}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">Submitted: {new Date(selectedDoc.submitted_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#8b5b3d]">Document Type</p>
                      <p className="font-semibold text-[#103b5b]">{getDocumentTypeLabel(selectedDoc.document_type)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#8b5b3d]">Document Name</p>
                      <p className="font-semibold text-[#103b5b]">{selectedDoc.document_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#8b5b3d]">Status</p>
                      <Badge variant="warning" size="sm">PENDING REVIEW</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-[#8b5b3d]">Risk Level</p>
                      <Badge variant={getRiskBadgeColor(selectedDoc.investor_jurisdiction || '')} size="sm">
                        {selectedDoc.investor_jurisdiction || 'Unknown'}
                      </Badge>
                    </div>
                  </div>

                  {/* Document Preview Placeholder */}
                  <div>
                    <h4 className="font-semibold text-[#103b5b] mb-3">Document</h4>
                    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500 font-medium">{selectedDoc.document_name}</p>
                        <p className="text-sm text-gray-400 mt-1">{selectedDoc.file_path || 'File path not available'}</p>
                        <p className="text-xs text-amber-600 mt-2">⚠️ File viewer not implemented in MVP</p>
                      </div>
                    </div>
                  </div>

                  {/* Review Notes Input */}
                  <div>
                    <h4 className="font-semibold text-[#103b5b] mb-3">Review Notes <span className="text-gray-400 font-normal">(optional)</span></h4>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Enter your review notes here (optional)..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023D7A] focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleReview('approve')}
                      className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                    >
                      ✓ Approve Document
                    </button>
                    <button
                      onClick={() => handleReview('reject')}
                      className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                    >
                      ✗ Reject Document
                    </button>
                  </div>

                  {/* Notice */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-amber-900">Compliance Notice</p>
                        <p className="text-xs text-amber-700 mt-1">
                          This document must be reviewed within 24 hours of submission. Overdue reviews will be flagged in the compliance report.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">Select a document to review</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default KYCReview;
