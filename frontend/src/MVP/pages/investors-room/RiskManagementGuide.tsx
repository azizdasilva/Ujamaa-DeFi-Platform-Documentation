/**
 * Risk Management Guide - Educational Document
 */

import React from 'react';
import DocPage from './DocPage';

const RiskManagementGuide: React.FC = () => {
  const tableOfContents = [
    { id: 'types', title: 'Types of Risk' },
    { id: 'mitigation', title: 'Risk Mitigation' },
    { id: 'diversification', title: 'Diversification Strategy' },
    { id: 'monitoring', title: 'Ongoing Monitoring' },
  ];

  return (
    <DocPage
      title="Risk Management Guide"
      category="Educational"
      categoryId="educational"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="types" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Types of Investment Risk</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Credit Risk', icon: '📉', desc: 'Borrower default on payment obligations', level: 'Medium' },
              { title: 'Market Risk', icon: '📊', desc: 'Economic conditions affecting asset performance', level: 'Medium' },
              { title: 'Liquidity Risk', icon: '💧', desc: 'Difficulty exiting positions before maturity', level: 'Low' },
              { title: 'Technology Risk', icon: '🔐', desc: 'Smart contract or blockchain vulnerabilities', level: 'Low' },
              { title: 'Regulatory Risk', icon: '⚖️', desc: 'Changes in laws affecting operations', level: 'Medium' },
              { title: 'Currency Risk', icon: '💱', desc: 'FX fluctuations affecting returns', level: 'Low' },
            ].map((item) => (
              <div key={item.title} className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.level === 'Low' ? 'bg-green-100 text-green-700' :
                    item.level === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.level} Risk
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#023D7A] mb-3">{item.title}</h3>
                <p className="text-[#333333]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="mitigation" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Risk Mitigation Strategies</h2>
          <div className="space-y-6">
            {[
              { title: 'Due Diligence', desc: 'Comprehensive borrower vetting including financial analysis, business verification, and track record assessment', icon: '🔍' },
              { title: 'Collateral Requirements', desc: 'Assets backed by physical collateral (inventory, equipment, receivables) with regular valuation', icon: '🏦' },
              { title: 'Insurance Coverage', desc: 'Fireblocks custody insurance ($1B+) and asset-specific insurance policies', icon: '🛡️' },
              { title: 'Smart Contract Audits', desc: 'All contracts audited by CertiK and OpenZeppelin with ongoing monitoring', icon: '🔐' },
              { title: 'Regulatory Compliance', desc: 'Mauritius FSC licensing, KYC/AML procedures, and sanctions screening', icon: '⚖️' },
            ].map((item) => (
              <div key={item.title} className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6 flex items-start gap-4">
                <span className="text-4xl">{item.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-[#023D7A] mb-2">{item.title}</h3>
                  <p className="text-[#333333]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="diversification" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Diversification Strategy</h2>
          <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-6 rounded-r-lg mb-6">
            <p className="text-[#333333] leading-relaxed text-lg">
              "Don't put all your eggs in one basket" - Diversification is the most effective 
              way to reduce risk without sacrificing returns.
            </p>
          </div>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-[#023D7A] mb-4">Our Diversification Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#F3F8FA] p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Maximum Per Borrower</p>
                <p className="text-3xl font-extrabold text-[#023D7A]">20%</p>
                <p className="text-xs text-gray-500 mt-2">No single borrower can exceed 20% of pool value</p>
              </div>
              <div className="bg-[#F3F8FA] p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Maximum Per Sector</p>
                <p className="text-3xl font-extrabold text-[#023D7A]">40%</p>
                <p className="text-xs text-gray-500 mt-2">No single sector can exceed 40% of pool value</p>
              </div>
            </div>
          </div>
        </section>

        <section id="monitoring" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Ongoing Monitoring</h2>
          <div className="space-y-4">
            {[
              { title: 'Real-Time NAV Tracking', desc: 'Net Asset Value updated daily based on pool performance' },
              { title: 'Monthly Performance Reports', desc: 'Detailed reports on yield, distributions, and portfolio composition' },
              { title: 'Borrower Monitoring', desc: 'Regular financial health checks on all borrowers' },
              { title: 'Early Warning System', desc: 'Automated alerts for potential defaults or underperformance' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                <div>
                  <h4 className="font-bold text-[#023D7A]">{item.title}</h4>
                  <p className="text-[#333333]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default RiskManagementGuide;
