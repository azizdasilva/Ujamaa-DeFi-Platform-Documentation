/**
 * Compliance - KYC/KYB Review Page
 * 
 * Review and approve KYC/KYB submissions.
 * 
 * Route: /compliance/kyc-review
 */

import React, { useState } from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const ComplianceKYCReview: React.FC = () => {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);

  // Mock KYC/KYB applications
  const applications = [
    {
      id: 'KYC-001',
      type: 'KYC',
      name: 'John Doe',
      email: 'john.doe@email.com',
      nationality: 'MU',
      submittedDate: '2026-03-20',
      status: 'pending',
      riskLevel: 'low',
      documents: [
        { name: 'National ID', status: 'verified', type: 'id' },
        { name: 'Proof of Address', status: 'pending', type: 'address' },
        { name: 'Selfie with ID', status: 'verified', type: 'selfie' },
      ],
      investmentAmount: 25000,
      sourceOfFunds: 'Employment Income',
    },
    {
      id: 'KYB-001',
      type: 'KYB',
      name: 'Logic Capital Ltd',
      email: 'compliance@logiccapital.com',
      jurisdiction: 'MU',
      submittedDate: '2026-03-19',
      status: 'pending',
      riskLevel: 'medium',
      documents: [
        { name: 'Certificate of Incorporation', status: 'verified', type: 'incorporation' },
        { name: 'Tax Registration', status: 'verified', type: 'tax' },
        { name: 'UBO Declaration', status: 'pending', type: 'ubo' },
        { name: 'Board Resolution', status: 'pending', type: 'resolution' },
      ],
      investmentAmount: 500000,
      sourceOfFunds: 'Corporate Treasury',
    },
    {
      id: 'KYC-002',
      type: 'KYC',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      nationality: 'KE',
      submittedDate: '2026-03-18',
      status: 'pending',
      riskLevel: 'low',
      documents: [
        { name: 'National ID', status: 'verified', type: 'id' },
        { name: 'Proof of Address', status: 'verified', type: 'address' },
        { name: 'Bank Statement', status: 'verified', type: 'bank' },
      ],
      investmentAmount: 50000,
      sourceOfFunds: 'Business Profits',
    },
    {
      id: 'KYB-002',
      type: 'KYB',
      name: 'Green Energy Fund',
      email: 'legal@greenenergyfund.com',
      jurisdiction: 'ZA',
      submittedDate: '2026-03-17',
      status: 'pending',
      riskLevel: 'high',
      documents: [
        { name: 'Certificate of Incorporation', status: 'verified', type: 'incorporation' },
        { name: 'Fund License', status: 'pending', type: 'license' },
        { name: 'UBO Declaration', status: 'pending', type: 'ubo' },
        { name: 'AML Policy', status: 'pending', type: 'aml' },
      ],
      investmentAmount: 1000000,
      sourceOfFunds: 'Fund Capital',
    },
  ];

  const handleApprove = (id: string) => {
    alert(`Application ${id} approved (mock action)`);
  };

  const handleReject = (id: string) => {
    alert(`Application ${id} rejected (mock action)`);
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
            <p className="text-2xl font-bold text-[#103b5b]">{applications.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Low Risk</p>
            <p className="text-2xl font-bold text-green-600">{applications.filter(a => a.riskLevel === 'low').length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Medium Risk</p>
            <p className="text-2xl font-bold text-amber-600">{applications.filter(a => a.riskLevel === 'medium').length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">High Risk</p>
            <p className="text-2xl font-bold text-red-600">{applications.filter(a => a.riskLevel === 'high').length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Applications</h2>}>
              <div className="space-y-2">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApplication(app.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedApplication === app.id
                        ? 'bg-[#023D7A] text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-semibold text-sm ${
                        selectedApplication === app.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {app.id}
                      </p>
                      <Badge 
                        variant={
                          app.riskLevel === 'low' ? 'success' :
                          app.riskLevel === 'medium' ? 'warning' :
                          'danger'
                        }
                        size="sm"
                      >
                        {app.riskLevel}
                      </Badge>
                    </div>
                    <p className={`text-xs ${
                      selectedApplication === app.id ? 'text-white/80' : 'text-gray-600'
                    }`}>
                      {app.name}
                    </p>
                    <p className={`text-xs ${
                      selectedApplication === app.id ? 'text-white/60' : 'text-gray-500'
                    }`}>
                      {app.submittedDate}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Application Details */}
          <div className="lg:col-span-2">
            {selectedApplication ? (
              <Card header={<h2 className="text-xl font-bold text-[#103b5b]">Application Details</h2>}>
                {(() => {
                  const app = applications.find(a => a.id === selectedApplication);
                  if (!app) return null;

                  return (
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <div>
                          <h3 className="text-lg font-bold text-[#103b5b]">{app.name}</h3>
                          <p className="text-sm text-[#8b5b3d]">{app.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="info" size="lg">{app.type}</Badge>
                          <p className="text-xs text-gray-500 mt-1">Submitted: {app.submittedDate}</p>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#8b5b3d]">Nationality / Jurisdiction</p>
                          <p className="font-semibold text-[#103b5b]">{app.nationality || app.jurisdiction}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8b5b3d]">Investment Amount</p>
                          <p className="font-semibold text-[#103b5b]">€{app.investmentAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8b5b3d]">Source of Funds</p>
                          <p className="font-medium text-[#103b5b]">{app.sourceOfFunds}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8b5b3d]">Risk Level</p>
                          <Badge 
                            variant={
                              app.riskLevel === 'low' ? 'success' :
                              app.riskLevel === 'medium' ? 'warning' :
                              'danger'
                            }
                            size="sm"
                          >
                            {app.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      {/* Documents */}
                      <div>
                        <h4 className="font-semibold text-[#103b5b] mb-3">Documents</h4>
                        <div className="space-y-2">
                          {app.documents.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                              </div>
                              <Badge 
                                variant={doc.status === 'verified' ? 'success' : 'warning'} 
                                size="sm"
                              >
                                {doc.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => handleApprove(app.id)}
                          className="flex-1"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve Application
                        </Button>
                        <Button
                          variant="secondary"
                          size="lg"
                          onClick={() => handleReject(app.id)}
                          className="flex-1"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </Button>
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
                              Ensure all documents are verified before approval. High-risk applications require enhanced due diligence.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </Card>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">Select an application to review</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplianceKYCReview;
