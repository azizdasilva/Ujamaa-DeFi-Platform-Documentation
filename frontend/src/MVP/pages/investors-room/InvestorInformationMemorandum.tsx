/**
 * Investor Information Memorandum
 * Investors Room - Onboarding
 */

import React from 'react';
import DocPage from './DocPage';

const InvestorInformationMemorandum: React.FC = () => {
  const tableOfContents = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'pools', title: 'Pool Families' },
    { id: 'yields', title: 'Yield Mechanics' },
    { id: 'risks', title: 'Risk Factors' },
  ];

  return (
    <DocPage
      title="Investor Information Memorandum"
      category="Onboarding"
      categoryId="onboarding"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="introduction" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Introduction</h2>
          <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
            <p className="text-[#333333] leading-relaxed text-lg">
              Welcome to Ujamaa DeFi Platform. This memorandum provides comprehensive information 
              about investing in our tokenized liquidity pools backed by African real-world assets.
            </p>
          </div>
        </section>

        <section id="pools" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Pool Families</h2>
          <div className="grid grid-cols-1 gap-6">
            {[
              { name: 'Industrial', apy: '10-12%', lockup: '365 days', icon: '🏭', desc: 'Manufacturing and production facilities' },
              { name: 'Agriculture', apy: '12-15%', lockup: '180 days', icon: '🌾', desc: 'Coffee, cocoa, cotton, cashews' },
              { name: 'Trade Finance', apy: '8-10%', lockup: '90 days', icon: '💼', desc: 'Invoice tokenization and receivables' },
              { name: 'Renewable Energy', apy: '9-11%', lockup: '730 days', icon: '⚡', desc: 'Solar, wind, hydroelectric' },
              { name: 'Real Estate', apy: '8-12%', lockup: '1095 days', icon: '🏢', desc: 'Commercial and industrial properties' },
            ].map((pool) => (
              <div key={pool.name} className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6 flex items-start gap-4">
                <span className="text-4xl">{pool.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#023D7A]">{pool.name}</h3>
                  <p className="text-[#333333] mb-3">{pool.desc}</p>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Target APY</p>
                      <p className="text-lg font-bold text-[#00A8A8]">{pool.apy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lock-up</p>
                      <p className="text-lg font-bold text-[#023D7A]">{pool.lockup}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="yields" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Yield Mechanics</h2>
          <div className="bg-[#F3F8FA] border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
            <h3 className="text-xl font-bold text-[#023D7A] mb-4">How Yield is Generated</h3>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-[#023D7A] text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <p className="font-bold text-[#023D7A]">Capital Deployment</p>
                  <p className="text-[#333333]">Pool capital is deployed to finance verified industrial assets</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-[#023D7A] text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <p className="font-bold text-[#023D7A]">Interest Payments</p>
                  <p className="text-[#333333]">Borrowers pay interest on financed assets (typically 12-18% APR)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-[#023D7A] text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <p className="font-bold text-[#023D7A]">Fee Deduction</p>
                  <p className="text-[#333333]">Management fees (2%) and performance fees (20% above 8% hurdle) are deducted</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-[#023D7A] text-white rounded-full flex items-center justify-center font-bold">4</span>
                <div>
                  <p className="font-bold text-[#023D7A]">NAV Increase</p>
                  <p className="text-[#333333]">Net yield increases the NAV (Net Asset Value) of uLP tokens</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section id="risks" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Risk Factors</h2>
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-700 mb-4">⚠️ Important Risk Disclosure</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-xl">•</span>
                <span className="text-[#333333]"><strong>Credit Risk:</strong> Borrowers may default on obligations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-xl">•</span>
                <span className="text-[#333333]"><strong>Liquidity Risk:</strong> Limited secondary market for tokens</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-xl">•</span>
                <span className="text-[#333333]"><strong>Market Risk:</strong> Economic conditions affect performance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-xl">•</span>
                <span className="text-[#333333]"><strong>Technology Risk:</strong> Smart contract or blockchain issues</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default InvestorInformationMemorandum;
