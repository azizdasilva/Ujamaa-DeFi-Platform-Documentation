/**
 * Risk Disclosure Memorandum
 * Investors Room - Asset Offerings
 */

import React from 'react';
import DocPage from './DocPage';

const RiskDisclosureMemorandum: React.FC = () => {
  const tableOfContents = [
    { id: 'general', title: 'General Risks' },
    { id: 'pool', title: 'Pool-Specific Risks' },
    { id: 'technology', title: 'Technology Risks' },
    { id: 'regulatory', title: 'Regulatory Risks' },
  ];

  return (
    <DocPage
      title="Risk Disclosure Memorandum"
      category="Asset Offerings"
      categoryId="offerings"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="general" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">1. General Risks</h2>
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-red-700 mb-4">⚠️ HIGH RISK INVESTMENT WARNING</h3>
            <p className="text-[#333333] leading-relaxed mb-4">
              Investment in digital assets and emerging market financing carries a high level of risk 
              and may not be suitable for all investors. You should carefully consider your investment 
              objectives, level of experience, and risk appetite before making an investment decision.
            </p>
            <p className="text-[#333333] leading-relaxed font-bold text-red-700">
              You could lose some or all of your invested capital.
            </p>
          </div>
        </section>

        <section id="pool" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">2. Pool-Specific Risks</h2>
          <div className="grid grid-cols-1 gap-6">
            {[
              { title: 'Credit Risk', desc: 'Borrowers may default on their payment obligations, resulting in loss of capital and expected yield.' },
              { title: 'Concentration Risk', desc: 'Pools may have significant exposure to single borrowers, sectors, or geographic regions.' },
              { title: 'Liquidity Risk', desc: 'Limited secondary market for uLP tokens may make it difficult to exit positions before maturity.' },
              { title: 'Interest Rate Risk', desc: 'Changes in market interest rates may affect the value of pool holdings and yield distributions.' },
              { title: 'Currency Risk', desc: 'FX fluctuations between EURC and local currencies may affect returns.' },
            ].map((risk) => (
              <div key={risk.title} className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#023D7A] mb-3">{risk.title}</h3>
                <p className="text-[#333333]">{risk.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="technology" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">3. Technology Risks</h2>
          <div className="space-y-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">🔐 Smart Contract Risk</h3>
              <p className="text-[#333333] mb-4">
                The platform relies on smart contracts deployed on the Polygon blockchain. 
                Bugs, vulnerabilities, or exploits in smart contract code could result in loss of funds.
              </p>
              <div className="bg-[#F3F8FA] border-l-4 border-[#00A8A8] p-4 rounded-r-lg">
                <p className="text-sm text-[#333333]">
                  <strong>Mitigation:</strong> All contracts are audited by CertiK and OpenZeppelin. 
                  Bug bounty program in place. Multi-sig governance for critical functions.
                </p>
              </div>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">⛓️ Blockchain Risk</h3>
              <p className="text-[#333333] mb-4">
                The platform depends on the Polygon blockchain. Network congestion, forks, 
                or consensus failures could affect platform operations.
              </p>
              <div className="bg-[#F3F8FA] border-l-4 border-[#00A8A8] p-4 rounded-r-lg">
                <p className="text-sm text-[#333333]">
                  <strong>Mitigation:</strong> Polygon is a proven Layer 2 with strong security. 
                  Emergency pause mechanisms in place.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="regulatory" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">4. Regulatory Risks</h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
            <h3 className="text-lg font-bold text-amber-700 mb-3">⚖️ Changing Regulatory Landscape</h3>
            <p className="text-[#333333] mb-4">
              The regulatory environment for digital assets and DeFi is evolving rapidly. 
              Changes in laws or regulations could affect platform operations or token value.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">•</span>
                <span className="text-[#333333]">New regulations may restrict platform operations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">•</span>
                <span className="text-[#333333]">Tax treatment of digital assets may change</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">•</span>
                <span className="text-[#333333]">Cross-border regulations may affect international investors</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default RiskDisclosureMemorandum;
