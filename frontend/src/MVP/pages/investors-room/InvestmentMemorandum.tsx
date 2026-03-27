/**
 * Investment Memorandum Document
 * Investors Room - Ujamaa DeFi Platform
 */

import React from 'react';
import DocPage from './DocPage';

const InvestmentMemorandum: React.FC = () => {
  const tableOfContents = [
    { id: 'terms', title: 'Investment Terms' },
    { id: 'structure', title: 'Investment Structure' },
    { id: 'fees', title: 'Fees & Expenses' },
    { id: 'risks', title: 'Risk Factors' },
  ];

  return (
    <DocPage
      title="Investment Memorandum"
      category="Asset Offerings"
      categoryId="offerings"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        {/* Investment Terms */}
        <section id="terms" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Investment Terms</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl overflow-hidden shadow-lg border-2 border-[#48A9F0]/30">
              <thead className="bg-[#023D7A] text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Term</th>
                  <th className="px-6 py-4 text-left font-bold">Specification</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#48A9F0]/20">
                  <td className="px-6 py-4 font-semibold text-[#023D7A]">Security Type</td>
                  <td className="px-6 py-4 text-[#333333]">Ujamaa Liquidity Pool Token (uLP)</td>
                </tr>
                <tr className="border-b border-[#48A9F0]/20 bg-[#F3F8FA]">
                  <td className="px-6 py-4 font-semibold text-[#023D7A]">Token Standard</td>
                  <td className="px-6 py-4 text-[#333333]">ERC-3643 (T-REX Protocol)</td>
                </tr>
                <tr className="border-b border-[#48A9F0]/20">
                  <td className="px-6 py-4 font-semibold text-[#023D7A]">Blockchain</td>
                  <td className="px-6 py-4 text-[#333333]">Polygon (MATIC)</td>
                </tr>
                <tr className="border-b border-[#48A9F0]/20 bg-[#F3F8FA]">
                  <td className="px-6 py-4 font-semibold text-[#023D7A]">Minimum Investment</td>
                  <td className="px-6 py-4 text-[#333333]">€100,000 (Institutional)</td>
                </tr>
                <tr className="border-b border-[#48A9F0]/20">
                  <td className="px-6 py-4 font-semibold text-[#023D7A]">Investment Currency</td>
                  <td className="px-6 py-4 text-[#333333]">EUROD (Euro Coin)</td>
                </tr>
                <tr className="border-b border-[#48A9F0]/20 bg-[#F3F8FA]">
                  <td className="px-6 py-4 font-semibold text-[#023D7A]">Distribution Frequency</td>
                  <td className="px-6 py-4 text-[#333333]">Monthly</td>
                </tr>
                <tr className="border-b border-[#48A9F0]/20">
                  <td className="px-6 py-4 font-semibold text-[#023D7A]">Redemption Notice</td>
                  <td className="px-6 py-4 text-[#333333]">30 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Investment Structure */}
        <section id="structure" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Investment Structure</h2>
          <div className="bg-[#F3F8FA] border-l-4 border-[#00A8A8] p-6 rounded-r-lg mb-6">
            <h3 className="text-xl font-bold text-[#023D7A] mb-3">How It Works</h3>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-[#023D7A] text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <p className="font-bold text-[#023D7A]">Investor Deposits EUROD</p>
                  <p className="text-[#333333]">Investor transfers EUROD to the pool smart contract</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-[#023D7A] text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <p className="font-bold text-[#023D7A]">Receives uLP Tokens</p>
                  <p className="text-[#333333]">Mints uLP tokens representing proportional pool ownership</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-[#023D7A] text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <p className="font-bold text-[#023D7A]">Pool Deploys Capital</p>
                  <p className="text-[#333333]">Capital is deployed to finance African industrial assets</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-[#023D7A] text-white rounded-full flex items-center justify-center font-bold">4</span>
                <div>
                  <p className="font-bold text-[#023D7A]">Yield Accrues</p>
                  <p className="text-[#333333]">Interest payments increase NAV of uLP tokens</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-[#023D7A] text-white rounded-full flex items-center justify-center font-bold">5</span>
                <div>
                  <p className="font-bold text-[#023D7A]">Redeem for Principal + Yield</p>
                  <p className="text-[#333333]">Burn uLP tokens to receive original investment plus accrued yield</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Fees & Expenses */}
        <section id="fees" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Fees & Expenses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">Management Fees</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-600">Annual Management Fee</span>
                  <span className="text-2xl font-extrabold text-[#023D7A]">2.0%</span>
                </div>
                <p className="text-sm text-gray-600">Calculated daily on NAV, accrued monthly</p>
              </div>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">Performance Fees</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-600">Performance Fee</span>
                  <span className="text-2xl font-extrabold text-[#023D7A]">20%</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-600">Hurdle Rate</span>
                  <span className="text-lg font-bold text-[#00A8A8]">8% APR</span>
                </div>
                <p className="text-sm text-gray-600">High-water mark applies</p>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Factors */}
        <section id="risks" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Risk Factors</h2>
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-bold text-red-700 mb-3">⚠️ High Risk Investment</h3>
              <p className="text-[#333333]">
                Investment in digital assets and emerging market financing carries significant risk. 
                You may lose some or all of your invested capital. This investment is suitable only 
                for sophisticated investors who can bear the loss of their entire investment.
              </p>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">Key Risks</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">•</span>
                  <span className="text-[#333333]"><strong>Credit Risk:</strong> Borrowers may default on their obligations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">•</span>
                  <span className="text-[#333333]"><strong>Market Risk:</strong> Economic conditions may affect asset performance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">•</span>
                  <span className="text-[#333333]"><strong>Liquidity Risk:</strong> Limited secondary market for uLP tokens</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">•</span>
                  <span className="text-[#333333]"><strong>Regulatory Risk:</strong> Changes in regulations may affect operations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">•</span>
                  <span className="text-[#333333]"><strong>Technology Risk:</strong> Smart contract vulnerabilities or blockchain issues</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default InvestmentMemorandum;
