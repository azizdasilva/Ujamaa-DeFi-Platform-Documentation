/**
 * NAV Statements
 * Investors Room - Ongoing Reporting
 */

import React from 'react';
import DocPage from './DocPage';

const NAVStatements: React.FC = () => {
  const tableOfContents = [
    { id: 'overview', title: 'NAV Overview' },
    { id: 'current', title: 'Current NAV' },
    { id: 'history', title: 'NAV History' },
    { id: 'methodology', title: 'Calculation Methodology' },
  ];

  return (
    <DocPage
      title="NAV Statements"
      category="Ongoing Reporting"
      categoryId="reporting"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="overview" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">NAV Overview</h2>
          <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
            <p className="text-[#333333] leading-relaxed text-lg">
              Net Asset Value (NAV) represents the per-token value of each liquidity pool, 
              calculated daily based on the total value of pool assets divided by the number 
              of outstanding uLP tokens.
            </p>
          </div>
        </section>

        <section id="current" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Current NAV by Pool</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#023D7A] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Pool</th>
                    <th className="px-6 py-4 text-left font-bold">NAV per Token</th>
                    <th className="px-6 py-4 text-left font-bold">Change (24h)</th>
                    <th className="px-6 py-4 text-left font-bold">Change (30d)</th>
                    <th className="px-6 py-4 text-left font-bold">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Industrial', nav: '€1.0524', d1: '+0.03%', d30: '+0.92%', date: 'Mar 20, 2026' },
                    { name: 'Agriculture', nav: '€1.0891', d1: '+0.04%', d30: '+1.15%', date: 'Mar 20, 2026' },
                    { name: 'Trade Finance', nav: '€1.0312', d1: '+0.02%', d30: '+0.68%', date: 'Mar 20, 2026' },
                    { name: 'Renewable Energy', nav: '€1.0678', d1: '+0.03%', d30: '+0.87%', date: 'Mar 20, 2026' },
                    { name: 'Real Estate', nav: '€1.0445', d1: '+0.02%', d30: '+0.74%', date: 'Mar 20, 2026' },
                  ].map((pool) => (
                    <tr key={pool.name} className="border-b border-[#48A9F0]/20">
                      <td className="px-6 py-4 font-semibold text-[#023D7A]">{pool.name}</td>
                      <td className="px-6 py-4 text-lg font-bold text-[#023D7A]">{pool.nav}</td>
                      <td className="px-6 py-4 text-green-600 font-bold">{pool.d1}</td>
                      <td className="px-6 py-4 text-green-600 font-bold">{pool.d30}</td>
                      <td className="px-6 py-4 text-[#333333]">{pool.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="history" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">NAV History (6 Months)</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
            <div className="h-64 flex items-end justify-between gap-2">
              {[
                { month: 'Oct', value: '1.00' },
                { month: 'Nov', value: '1.02' },
                { month: 'Dec', value: '1.03' },
                { month: 'Jan', value: '1.04' },
                { month: 'Feb', value: '1.05' },
                { month: 'Mar', value: '1.06' },
              ].map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-[#023D7A] to-[#00A8A8] rounded-t-lg transition-all duration-300"
                    style={{ height: `${(parseFloat(item.value) - 0.98) * 400}px` }}
                  ></div>
                  <p className="text-sm font-bold text-[#023D7A] mt-2">{item.month}</p>
                  <p className="text-xs text-gray-500">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="methodology" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Calculation Methodology</h2>
          <div className="space-y-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">NAV Formula</h3>
              <div className="bg-[#F3F8FA] p-6 rounded-lg font-mono text-center">
                <p className="text-lg text-[#023D7A]">
                  NAV = (Total Pool Assets - Accrued Fees) ÷ Total uLP Tokens Outstanding
                </p>
              </div>
            </div>
            <div className="bg-[#F3F8FA] border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
              <h3 className="text-lg font-bold text-[#023D7A] mb-3">Key Components</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">•</span>
                  <span className="text-[#333333]"><strong>Principal:</strong> Original capital invested plus accrued interest</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">•</span>
                  <span className="text-[#333333]"><strong>Accrued Yield:</strong> Interest earned but not yet distributed</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">•</span>
                  <span className="text-[#333333]"><strong>Accrued Fees:</strong> Management and performance fees owed</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold text-xl">•</span>
                  <span className="text-[#333333]"><strong>Outstanding Tokens:</strong> Total uLP tokens in circulation</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default NAVStatements;
