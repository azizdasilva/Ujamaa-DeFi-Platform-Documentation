/**
 * Executive Summary Document
 * Investors Room - Ujamaa DeFi Platform
 */

import React from 'react';
import DocPage from './DocPage';

const ExecutiveSummary: React.FC = () => {
  const tableOfContents = [
    { id: 'overview', title: 'Platform Overview' },
    { id: 'opportunity', title: 'Investment Opportunity' },
    { id: 'market', title: 'Market Opportunity' },
    { id: 'traction', title: 'Traction & Milestones' },
  ];

  return (
    <DocPage
      title="Executive Summary"
      category="Investor Resources"
      categoryId="all"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        {/* Platform Overview */}
        <section id="overview" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Platform Overview</h2>
          <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-6 rounded-r-lg mb-6">
            <p className="text-[#333333] leading-relaxed text-lg font-medium">
              Ujamaa DeFi Platform bridges global institutional capital with African industrial growth through blockchain-based asset tokenization.
            </p>
          </div>
          <p className="text-[#333333] leading-relaxed mb-4">
            Our institutional-grade platform enables compliant, transparent, and efficient financing for African SMEs through:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#00A8A8] font-bold text-xl">✓</span>
              <span className="text-[#333333]"><strong>Liquidity Pools:</strong> 5 diversified pool families targeting 8-15% APY</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00A8A8] font-bold text-xl">✓</span>
              <span className="text-[#333333]"><strong>Yield-Bearing Tokens:</strong> UPT tokens with automatic yield distribution</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00A8A8] font-bold text-xl">✓</span>
              <span className="text-[#333333]"><strong>Regulatory Compliance:</strong> Mauritius FSC licensed, ERC-3643 compliant</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00A8A8] font-bold text-xl">✓</span>
              <span className="text-[#333333]"><strong>Institutional Security:</strong> Fireblocks MPC custody with $1B+ insurance</span>
            </li>
          </ul>
        </section>

        {/* Investment Opportunity */}
        <section id="opportunity" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Investment Opportunity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">Key Terms</h3>
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Minimum Investment</span>
                  <span className="font-bold text-[#023D7A]">€100,000</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Target Raise</span>
                  <span className="font-bold text-[#023D7A]">€50M</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Expected Yield</span>
                  <span className="font-bold text-[#023D7A]">10-15% APR</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Lock-up Period</span>
                  <span className="font-bold text-[#023D7A]">180-365 days</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Management Fee</span>
                  <span className="font-bold text-[#023D7A]">2.0% p.a.</span>
                </li>
              </ul>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">Pool Families</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">🏭</span>
                  <div>
                    <p className="font-bold text-[#023D7A]">Industrial</p>
                    <p className="text-sm text-gray-600">10-12% APY • 365 days</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">🌾</span>
                  <div>
                    <p className="font-bold text-[#023D7A]">Agriculture</p>
                    <p className="text-sm text-gray-600">12-15% APY • 180 days</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">💼</span>
                  <div>
                    <p className="font-bold text-[#023D7A]">Trade Finance</p>
                    <p className="text-sm text-gray-600">8-10% APY • 90 days</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">⚡</span>
                  <div>
                    <p className="font-bold text-[#023D7A]">Renewable Energy</p>
                    <p className="text-sm text-gray-600">9-11% APY • 730 days</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">🏢</span>
                  <div>
                    <p className="font-bold text-[#023D7A]">Real Estate</p>
                    <p className="text-sm text-gray-600">8-12% APY • 1095 days</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section id="market" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Market Opportunity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#023D7A]/10 to-[#00A8A8]/10 rounded-xl p-6 text-center">
              <p className="text-4xl font-extrabold text-[#023D7A] mb-2">$500B+</p>
              <p className="text-[#333333] font-medium">African SME Financing Gap</p>
            </div>
            <div className="bg-gradient-to-br from-[#023D7A]/10 to-[#00A8A8]/10 rounded-xl p-6 text-center">
              <p className="text-4xl font-extrabold text-[#023D7A] mb-2">15%</p>
              <p className="text-[#333333] font-medium">Average Annual Yield</p>
            </div>
            <div className="bg-gradient-to-br from-[#023D7A]/10 to-[#00A8A8]/10 rounded-xl p-6 text-center">
              <p className="text-4xl font-extrabold text-[#023D7A] mb-2">0%</p>
              <p className="text-[#333333] font-medium">Correlation to Traditional Markets</p>
            </div>
          </div>
        </section>

        {/* Traction & Milestones */}
        <section id="traction" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Traction & Milestones</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-[#00A8A8] rounded-full mt-2"></div>
                <div>
                  <p className="font-bold text-[#023D7A]">Q1 2026</p>
                  <p className="text-[#333333]">Platform launch on Polygon Amoy testnet</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-[#00A8A8] rounded-full mt-2"></div>
                <div>
                  <p className="font-bold text-[#023D7A]">Q2 2026</p>
                  <p className="text-[#333333]">Mauritius FSC licensing completion</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-[#00A8A8] rounded-full mt-2"></div>
                <div>
                  <p className="font-bold text-[#023D7A]">Q3 2026</p>
                  <p className="text-[#333333]">Production launch with 5 pool families</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-[#00A8A8] rounded-full mt-2"></div>
                <div>
                  <p className="font-bold text-[#023D7A]">Q4 2026</p>
                  <p className="text-[#333333]">Target: €50M AUM across all pools</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default ExecutiveSummary;
