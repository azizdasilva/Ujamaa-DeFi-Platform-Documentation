/**
 * Investment Agreement Template
 * Investors Room - Templates
 */

import React from 'react';
import DocPage from './DocPage';

const InvestmentAgreement: React.FC = () => {
  const tableOfContents = [
    { id: 'parties', title: 'Parties' },
    { id: 'investment', title: 'Investment Terms' },
    { id: 'representations', title: 'Representations' },
    { id: 'covenants', title: 'Covenants' },
  ];

  return (
    <DocPage
      title="Investment Agreement Template"
      category="Templates"
      categoryId="templates"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="parties" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">1. Parties</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-8">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">INVESTOR:</p>
                <p className="text-lg font-bold text-[#023D7A]">[Investor Name]</p>
                <p className="text-[#333333]">[Address]</p>
                <p className="text-[#333333]">[Jurisdiction]</p>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 mb-2">PLATFORM:</p>
                <p className="text-lg font-bold text-[#023D7A]">Ujamaa DeFi Platform</p>
                <p className="text-[#333333]">Ebène Cybercity, Mauritius</p>
                <p className="text-[#333333]">FSC License No: [License Number]</p>
              </div>
            </div>
          </div>
        </section>

        <section id="investment" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">2. Investment Terms</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Investment Amount', value: '€[Amount]' },
                { label: 'Pool Selection', value: '[Pool Name]' },
                { label: 'Token Type', value: 'uLP (ERC-3643)' },
                { label: 'Lock-up Period', value: '[X] days' },
                { label: 'Expected Yield', value: '[X-X]% APR' },
                { label: 'Management Fee', value: '2.0% per annum' },
                { label: 'Performance Fee', value: '20% above 8% hurdle' },
                { label: 'Distribution', value: 'Monthly' },
              ].map((item) => (
                <div key={item.label} className="border-b border-gray-200 pb-4">
                  <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-[#023D7A]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="representations" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">3. Investor Representations</h2>
          <div className="bg-[#F3F8FA] border-l-4 border-[#023D7A] p-6 rounded-r-lg">
            <p className="text-[#333333] mb-4">
              The Investor represents and warrants that:
            </p>
            <ol className="space-y-3">
              {[
                'Investor is an accredited/institutional investor as defined by applicable regulations',
                'Investor has the financial ability to bear the economic risk of this investment',
                'Investor is investing for own account and not for distribution',
                'Investor has received and reviewed all offering documents',
                'Investor understands this investment is not FDIC insured or bank guaranteed',
                'Investor is not a resident of a blocked or sanctioned jurisdiction',
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

        <section id="covenants" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">4. Covenants</h2>
          <div className="space-y-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">Platform Covenants</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Maintain regulatory compliance and licensing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Provide monthly NAV statements and performance reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Maintain institutional-grade custody and security</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Conduct thorough due diligence on all borrowers</span>
                </li>
              </ul>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">Investor Covenants</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Maintain accredited investor status throughout investment period</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Notify platform of any change in sanctions status</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Comply with transfer restrictions on uLP tokens</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Maintain confidentiality of proprietary information</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default InvestmentAgreement;
