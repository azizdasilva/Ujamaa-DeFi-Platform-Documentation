/**
 * Terms of Service Document
 * Investors Room - Ujamaa DeFi Platform
 */

import React from 'react';
import DocPage from './DocPage';

const TermsOfService: React.FC = () => {
  const tableOfContents = [
    { id: 'acceptance', title: 'Acceptance of Terms' },
    { id: 'eligibility', title: 'Investor Eligibility' },
    { id: 'services', title: 'Platform Services' },
    { id: 'fees', title: 'Fees & Payment' },
    { id: 'risks', title: 'Risk Acknowledgment' },
    { id: 'liability', title: 'Limitation of Liability' },
  ];

  return (
    <DocPage
      title="Terms of Service"
      category="Legal & Compliance"
      categoryId="legal"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        {/* Acceptance of Terms */}
        <section id="acceptance" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">1. Acceptance of Terms</h2>
          <div className="bg-[#F3F8FA] border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
            <p className="text-[#333333] leading-relaxed">
              By accessing or using the Ujamaa DeFi Platform, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, you are 
              prohibited from using or accessing this site.
            </p>
          </div>
        </section>

        {/* Investor Eligibility */}
        <section id="eligibility" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">2. Investor Eligibility</h2>
          <div className="space-y-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">Minimum Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Minimum investment of €100,000 (institutional tier)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Accredited or institutional investor status</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Completion of KYC/AML verification</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                  <span className="text-[#333333]">Residence in an allowed jurisdiction</span>
                </li>
              </ul>
            </div>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-bold text-amber-700 mb-3">⚠️ Blocked Jurisdictions</h3>
              <p className="text-[#333333] mb-4">
                Investors from the following jurisdictions are prohibited from using the platform:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['North Korea', 'Iran', 'Syria', 'Cuba', 'Crimea', 'Donetsk', 'Luhansk', 'Sevastopol'].map((country) => (
                  <span key={country} className="px-3 py-2 bg-white text-red-600 text-sm font-bold rounded border border-red-200">
                    {country}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Platform Services */}
        <section id="services" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">3. Platform Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-3">📊 Investment Services</h3>
              <p className="text-[#333333]">Access to diversified liquidity pools investing in African real-world assets with automatic yield distribution.</p>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-3">🔐 Custody Services</h3>
              <p className="text-[#333333]">Institutional-grade custody through Fireblocks MPC with $1B+ insurance coverage.</p>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-3">📈 Reporting Services</h3>
              <p className="text-[#333333]">Real-time portfolio tracking, NAV updates, and monthly performance reports.</p>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-3">⚖️ Compliance Services</h3>
              <p className="text-[#333333]">KYC/AML verification, jurisdiction screening, and regulatory reporting.</p>
            </div>
          </div>
        </section>

        {/* Fees & Payment */}
        <section id="fees" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">4. Fees & Payment</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#023D7A] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Fee Type</th>
                    <th className="px-6 py-4 text-left font-bold">Amount</th>
                    <th className="px-6 py-4 text-left font-bold">Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#48A9F0]/20">
                    <td className="px-6 py-4 font-semibold text-[#023D7A]">Management Fee</td>
                    <td className="px-6 py-4 text-[#333333]">2.0% of NAV</td>
                    <td className="px-6 py-4 text-[#333333]">Annual (accrued daily)</td>
                  </tr>
                  <tr className="border-b border-[#48A9F0]/20 bg-[#F3F8FA]">
                    <td className="px-6 py-4 font-semibold text-[#023D7A]">Performance Fee</td>
                    <td className="px-6 py-4 text-[#333333]">20% of returns above 8% hurdle</td>
                    <td className="px-6 py-4 text-[#333333]">Annual</td>
                  </tr>
                  <tr className="border-b border-[#48A9F0]/20">
                    <td className="px-6 py-4 font-semibold text-[#023D7A]">Withdrawal Fee</td>
                    <td className="px-6 py-4 text-[#333333]">None</td>
                    <td className="px-6 py-4 text-[#333333]">-</td>
                  </tr>
                  <tr className="border-b border-[#48A9F0]/20 bg-[#F3F8FA]">
                    <td className="px-6 py-4 font-semibold text-[#023D7A]">Gas Fees</td>
                    <td className="px-6 py-4 text-[#333333]">Network fees apply</td>
                    <td className="px-6 py-4 text-[#333333]">Per transaction</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Risk Acknowledgment */}
        <section id="risks" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">5. Risk Acknowledgment</h2>
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-700 mb-4">⚠️ IMPORTANT RISK DISCLOSURE</h3>
            <p className="text-[#333333] mb-4 leading-relaxed">
              BY USING THIS PLATFORM, YOU ACKNOWLEDGE AND AGREE THAT:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-xl">•</span>
                <span className="text-[#333333]">Investment in digital assets involves substantial risk of loss</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-xl">•</span>
                <span className="text-[#333333]">You may lose some or all of your invested capital</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-xl">•</span>
                <span className="text-[#333333]">Past performance does not guarantee future results</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-xl">•</span>
                <span className="text-[#333333]">This investment is suitable only for sophisticated investors who can bear the loss of their entire investment</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section id="liability" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">6. Limitation of Liability</h2>
          <div className="bg-[#F3F8FA] border-l-4 border-[#023D7A] p-6 rounded-r-lg">
            <p className="text-[#333333] leading-relaxed">
              Ujamaa DeFi Platform, its directors, employees, and agents shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues, 
              whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, 
              resulting from your access to or use of or inability to access or use the platform.
            </p>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default TermsOfService;
