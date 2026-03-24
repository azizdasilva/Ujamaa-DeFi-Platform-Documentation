/**
 * Accreditation Requirements
 * Investors Room - Onboarding
 */

import React from 'react';
import DocPage from './DocPage';

const AccreditationRequirements: React.FC = () => {
  const tableOfContents = [
    { id: 'overview', title: 'Accreditation Overview' },
    { id: 'individual', title: 'Individual Criteria' },
    { id: 'institutional', title: 'Institutional Criteria' },
    { id: 'verification', title: 'Verification Process' },
  ];

  return (
    <DocPage
      title="Accreditation Requirements"
      category="Onboarding"
      categoryId="onboarding"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="overview" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Accreditation Overview</h2>
          <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
            <p className="text-[#333333] leading-relaxed text-lg">
              Ujamaa DeFi Platform is available only to accredited and institutional investors. 
              This document outlines the criteria and verification process for accreditation.
            </p>
          </div>
        </section>

        <section id="individual" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Individual Investor Criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">💰 Income Test</h3>
              <p className="text-[#333333] mb-4">
                Individual income exceeding <strong>€200,000</strong> (or €300,000 joint with spouse) 
                in each of the two most recent years.
              </p>
              <div className="bg-[#F3F8FA] p-4 rounded-lg">
                <p className="text-sm text-gray-600">Required Documentation:</p>
                <ul className="text-sm text-[#333333] mt-2 space-y-1">
                  <li>• Tax returns (2 years)</li>
                  <li>• Employment verification letter</li>
                  <li>• Pay stubs or income statements</li>
                </ul>
              </div>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">🏦 Net Worth Test</h3>
              <p className="text-[#333333] mb-4">
                Individual or joint net worth with spouse exceeding <strong>€1,000,000</strong>, 
                excluding primary residence.
              </p>
              <div className="bg-[#F3F8FA] p-4 rounded-lg">
                <p className="text-sm text-gray-600">Required Documentation:</p>
                <ul className="text-sm text-[#333333] mt-2 space-y-1">
                  <li>• Bank statements</li>
                  <li>• Investment account statements</li>
                  <li>• Asset valuations</li>
                  <li>• Liability statements</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="institutional" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Institutional Investor Criteria</h2>
          <div className="space-y-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">🏢 Qualified Institutions</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Banks, insurance companies, registered investment companies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Business development corporations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Pension funds with assets &gt;€5,000,000</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Corporations, partnerships, trusts with assets &gt;€5,000,000</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Family offices with &gt;€5,000,000 AUM</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#F3F8FA] border-l-4 border-[#023D7A] p-6 rounded-r-lg">
              <h3 className="text-lg font-bold text-[#023D7A] mb-3">Minimum Investment</h3>
              <p className="text-[#333333]">
                All institutional investors must meet the minimum investment threshold of 
                <strong className="text-[#023D7A]"> €100,000</strong> for initial investment.
              </p>
            </div>
          </div>
        </section>

        <section id="verification" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Verification Process</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Submit Application', desc: 'Complete accreditation questionnaire and upload supporting documents', time: '15-20 minutes' },
              { step: '2', title: 'Document Review', desc: 'Compliance team reviews submitted documentation', time: '24 hours' },
              { step: '3', title: 'Third-Party Verification', desc: 'Independent verification of income/net worth by licensed professional', time: '2-5 business days' },
              { step: '4', title: 'Approval Notification', desc: 'Receive accreditation approval and account activation', time: 'Immediate' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00A8A8] text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {item.step}
                </div>
                <div className="flex-1 bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#023D7A] mb-2">{item.title}</h3>
                  <p className="text-[#333333] mb-3">{item.desc}</p>
                  <p className="text-sm text-gray-500">Estimated Time: <span className="font-semibold text-[#00A8A8]">{item.time}</span></p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default AccreditationRequirements;
