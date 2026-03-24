/**
 * White Paper Document
 * Investors Room - Ujamaa DeFi Platform
 */

import React from 'react';
import DocPage from './DocPage';

const WhitePaper: React.FC = () => {
  const tableOfContents = [
    { id: 'executive-summary', title: 'Executive Summary' },
    { id: 'mission', title: 'Mission' },
    { id: 'key-features', title: 'Key Features' },
    { id: 'investment-opportunity', title: 'Investment Opportunity' },
    { id: 'african-market', title: 'African Market Focus' },
    { id: 'compliance', title: 'Compliance & Security' },
  ];

  return (
    <DocPage
      title="White Paper"
      category="Investor Resources"
      categoryId="all"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        {/* Executive Summary */}
        <section id="executive-summary" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Executive Summary</h2>
          <div className="bg-[#F3F8FA] border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
            <p className="text-[#333333] leading-relaxed text-lg">
              Ujamaa DeFi Platform is an institutional-grade blockchain platform for tokenizing African real-world assets (RWA). 
              Built on ERC-3643 (T-REX protocol), we enable compliant, transparent, and efficient financing for African SMEs 
              through liquidity pools and yield-bearing tokens.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section id="mission" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Mission</h2>
          <p className="text-[#333333] leading-relaxed text-lg">
            Bridge global institutional capital with African industrial growth through blockchain technology.
          </p>
        </section>

        {/* Key Features */}
        <section id="key-features" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-3">🏦 Ujamaa Liquidity Provider Token (uLP)</h3>
              <p className="text-[#333333]">Yield-bearing ERC-3643 token representing pool ownership with automatic yield distribution.</p>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-3">📊 Liquidity Pool Management</h3>
              <p className="text-[#333333]">Diversified pools across Industrial, Agriculture, Trade, Green, and Property sectors.</p>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-3">🔐 Institutional Security</h3>
              <p className="text-[#333333]">Fireblocks MPC custody with institutional-grade security and compliance.</p>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-3">⚖️ Regulatory Compliance</h3>
              <p className="text-[#333333]">Mauritius FSC CIS Manager License with full KYC/KYB and AML compliance.</p>
            </div>
          </div>
        </section>

        {/* Investment Opportunity */}
        <section id="investment-opportunity" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Investment Opportunity</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl overflow-hidden shadow-lg">
              <thead className="bg-[#023D7A] text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Parameter</th>
                  <th className="px-6 py-4 text-left font-bold">Detail</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#48A9F0]/20">
                  <td className="px-6 py-4 font-semibold text-[#023D7A]">Security Type</td>
                  <td className="px-6 py-4 text-[#333333]">uLP Token (Yield-Bearing ERC-3643)</td>
                </tr>
                <tr className="border-b border-[#48A9F0]/20 bg-[#F3F8FA]">
                  <td className="px-6 py-4 font-semibold text-[#023D7A]">Target Raise</td>
                  <td className="px-6 py-4 text-[#333333]">€50,000,000</td>
                </tr>
                <tr className="border-b border-[#48A9F0]/20">
                  <td className="px-6 py-4 font-semibold text-[#023D7A]">Minimum Investment</td>
                  <td className="px-6 py-4 text-[#333333]">€100,000 (Institutional Tier)</td>
                </tr>
                <tr className="border-b border-[#48A9F0]/20 bg-[#F3F8FA]">
                  <td className="px-6 py-4 font-semibold text-[#023D7A]">Expected Yield</td>
                  <td className="px-6 py-4 text-[#333333]">10-15% APR (EURC-denominated)</td>
                </tr>
                <tr className="border-b border-[#48A9F0]/20">
                  <td className="px-6 py-4 font-semibold text-[#023D7A]">Lock-up Period</td>
                  <td className="px-6 py-4 text-[#333333]">180-365 days</td>
                </tr>
                <tr className="border-b border-[#48A9F0]/20 bg-[#F3F8FA]">
                  <td className="px-6 py-4 font-semibold text-[#023D7A]">Management Fee</td>
                  <td className="px-6 py-4 text-[#333333]">2.0% per annum</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-[#023D7A]">Performance Fee</td>
                  <td className="px-6 py-4 text-[#333333]">20% (8% hurdle rate)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* African Market Focus */}
        <section id="african-market" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">African Market Focus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">Target Regions</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">✓</span>
                  <div>
                    <span className="font-semibold text-[#023D7A]">West Africa: </span>
                    <span className="text-[#333333]">Côte d'Ivoire, Benin, Togo - Cotton, cocoa, cashew financing</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">✓</span>
                  <div>
                    <span className="font-semibold text-[#023D7A]">East Africa: </span>
                    <span className="text-[#333333]">Kenya, Tanzania - Coffee, tea, horticulture</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">✓</span>
                  <div>
                    <span className="font-semibold text-[#023D7A]">Southern Africa: </span>
                    <span className="text-[#333333]">Zambia, Zimbabwe - Copper, tobacco, maize</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">✓</span>
                  <div>
                    <span className="font-semibold text-[#023D7A]">North Africa: </span>
                    <span className="text-[#333333]">Egypt, Morocco - Textiles, automotive parts</span>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">Impact Targets (5 Years)</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-4 rounded-r-lg">
                  <p className="text-3xl font-extrabold text-[#023D7A]">$500M</p>
                  <p className="text-[#333333]">GDP contribution</p>
                </div>
                <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-4 rounded-r-lg">
                  <p className="text-3xl font-extrabold text-[#023D7A]">5,000+</p>
                  <p className="text-[#333333]">Jobs created</p>
                </div>
                <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-4 rounded-r-lg">
                  <p className="text-3xl font-extrabold text-[#023D7A]">200+</p>
                  <p className="text-[#333333]">SMEs financed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance & Security */}
        <section id="compliance" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Compliance & Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-[#023D7A]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">🛡️ Regulatory Compliance</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#00A8A8] font-bold mt-1">•</span>
                  <span className="text-[#333333]">Mauritius FSC CIS Manager License (Category 1)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00A8A8] font-bold mt-1">•</span>
                  <span className="text-[#333333]">ERC-3643 (T-REX Protocol) - Transfer restrictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00A8A8] font-bold mt-1">•</span>
                  <span className="text-[#333333]">ONCHAINID - Identity verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00A8A8] font-bold mt-1">•</span>
                  <span className="text-[#333333]">FATF Travel Rule compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00A8A8] font-bold mt-1">•</span>
                  <span className="text-[#333333]">GDPR data protection</span>
                </li>
              </ul>
            </div>
            <div className="bg-white border-2 border-[#023D7A]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">🔐 Security Measures</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#00A8A8] font-bold mt-1">•</span>
                  <span className="text-[#333333]">Fireblocks MPC Custody ($1B+ insurance)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00A8A8] font-bold mt-1">•</span>
                  <span className="text-[#333333]">Smart Contract Audits (CertiK/OpenZeppelin)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00A8A8] font-bold mt-1">•</span>
                  <span className="text-[#333333]">Immutable Audit Logs (Merkle tree proofs)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00A8A8] font-bold mt-1">•</span>
                  <span className="text-[#333333]">Multi-Sig Governance (3/5 threshold)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00A8A8] font-bold mt-1">•</span>
                  <span className="text-[#333333]">Rate Limiting & DDoS Protection</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default WhitePaper;
