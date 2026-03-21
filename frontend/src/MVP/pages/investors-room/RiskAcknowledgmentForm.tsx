/**
 * Risk Acknowledgment Form
 * Investors Room - Legal & Compliance
 */

import React from 'react';
import DocPage from './DocPage';

const RiskAcknowledgmentForm: React.FC = () => {
  const tableOfContents = [
    { id: 'acknowledgment', title: 'Risk Acknowledgment' },
    { id: 'investor', title: 'Investor Representations' },
    { id: 'declaration', title: 'Declaration' },
  ];

  return (
    <DocPage
      title="Risk Acknowledgment Form"
      category="Legal & Compliance"
      categoryId="legal"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="acknowledgment" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Risk Acknowledgment</h2>
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-red-700 mb-6 text-center">⚠️ IMPORTANT NOTICE</h3>
            <div className="space-y-4">
              <p className="text-[#333333] leading-relaxed">
                I hereby acknowledge that I have read and understood the <strong className="text-red-700">Risk Disclosure Memorandum</strong> and 
                understand that investment in Ujamaa DeFi Platform involves substantial risk, including:
              </p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-xl">•</span>
                  <span className="text-[#333333]">The possibility of losing some or all of my invested capital</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-xl">•</span>
                  <span className="text-[#333333]">Limited liquidity and no guaranteed secondary market</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-xl">•</span>
                  <span className="text-[#333333]">Technology risks including smart contract vulnerabilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-xl">•</span>
                  <span className="text-[#333333]">Regulatory uncertainty in the digital asset space</span>
                </li>
              </ul>
              <p className="text-[#333333] leading-relaxed mt-6">
                I understand that past performance does not guarantee future results and that 
                yield projections are targets, not guarantees.
              </p>
            </div>
          </div>
        </section>

        <section id="investor" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Investor Representations</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-8">
            <p className="text-[#333333] mb-6">
              By signing this form, I represent and warrant that:
            </p>
            <ol className="space-y-4">
              {[
                'I am an accredited or institutional investor as defined by applicable regulations',
                'I have the financial ability to bear the economic risk of this investment',
                'I am investing for my own account and not for the benefit of others',
                'I have received and reviewed all offering documents',
                'I understand this investment is not FDIC insured or bank guaranteed',
                'I am not a resident of a blocked or sanctioned jurisdiction',
                'All information provided in my application is true and complete',
              ].map((rep, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#023D7A] text-white rounded flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-[#333333]">{rep}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="declaration" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Declaration</h2>
          <div className="bg-[#F3F8FA] border-l-4 border-[#023D7A] p-8 rounded-r-lg">
            <p className="text-[#333333] leading-relaxed mb-8">
              I hereby declare that I have read this Risk Acknowledgment Form in its entirety, 
              understand its contents, and voluntarily accept all risks associated with investing 
              in Ujamaa DeFi Platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="border-b-2 border-[#023D7A] pb-4">
                <p className="text-sm text-gray-500 mb-8">Investor Signature</p>
                <p className="text-xs text-gray-400">By proceeding with investment, you electronically sign this document</p>
              </div>
              <div className="border-b-2 border-[#023D7A] pb-4">
                <p className="text-sm text-gray-500 mb-8">Date</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-8">
              This electronic acknowledgment has the same legal validity as a handwritten signature.
            </p>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default RiskAcknowledgmentForm;
