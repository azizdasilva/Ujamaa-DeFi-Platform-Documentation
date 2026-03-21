/**
 * Term Sheet Template
 * Investors Room - Asset Offerings
 */

import React from 'react';
import DocPage from './DocPage';

const TermSheetTemplate: React.FC = () => {
  const tableOfContents = [
    { id: 'overview', title: 'Transaction Overview' },
    { id: 'terms', title: 'Key Terms' },
    { id: 'conditions', title: 'Conditions' },
    { id: 'timeline', title: 'Timeline' },
  ];

  return (
    <DocPage
      title="Term Sheet Template"
      category="Asset Offerings"
      categoryId="offerings"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="overview" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Transaction Overview</h2>
          <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
            <p className="text-[#333333] leading-relaxed text-lg">
              This term sheet outlines the proposed terms for industrial financing through 
              Ujamaa DeFi Platform's liquidity pools.
            </p>
          </div>
        </section>

        <section id="terms" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Key Terms</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Borrower', value: '[Company Name]' },
                { label: 'Financing Amount', value: '€[Amount]' },
                { label: 'Interest Rate', value: '[X]% per annum' },
                { label: 'Term', value: '[X] months' },
                { label: 'Collateral', value: '[Asset Description]' },
                { label: 'Purpose', value: '[Working Capital / Equipment / etc.]' },
                { label: 'Repayment', value: 'Monthly / Bullet' },
                { label: 'Grace Period', value: '[X] months' },
              ].map((item) => (
                <div key={item.label} className="border-b border-gray-200 pb-4">
                  <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-[#023D7A]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="conditions" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Conditions Precedent</h2>
          <div className="space-y-4">
            {[
              'Execution of definitive financing agreement',
              'Completion of KYC/AML verification',
              'Perfection of security interest in collateral',
              'Insurance coverage maintained',
              'No material adverse change in borrower\'s financial condition',
              'Board approval from both parties',
            ].map((condition, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#023D7A] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="text-[#333333]">{condition}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="timeline" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Indicative Timeline</h2>
          <div className="space-y-4">
            {[
              { step: 'Term Sheet Signing', time: 'Day 0' },
              { step: 'Due Diligence', time: 'Days 1-14' },
              { step: 'Documentation', time: 'Days 15-21' },
              { step: 'Closing & Funding', time: 'Days 22-30' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#00A8A8] text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 bg-white border-2 border-[#48A9F0]/30 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-[#023D7A]">{item.step}</h4>
                    <span className="text-sm font-bold text-[#00A8A8]">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default TermSheetTemplate;
