/**
 * Annual Report 2025
 * Investors Room - Ongoing Reporting
 */

import React from 'react';
import DocPage from './DocPage';

const AnnualReport2025: React.FC = () => {
  const tableOfContents = [
    { id: 'letter', title: 'CEO Letter' },
    { id: 'performance', title: 'Annual Performance' },
    { id: 'milestones', title: 'Key Milestones' },
    { id: 'financials', title: 'Financial Highlights' },
  ];

  return (
    <DocPage
      title="Annual Report 2025"
      category="Ongoing Reporting"
      categoryId="reporting"
      lastUpdated="January 31, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="letter" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">CEO Letter to Investors</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-8">
            <p className="text-[#333333] leading-relaxed mb-6">
              Dear Valued Investors,
            </p>
            <p className="text-[#333333] leading-relaxed mb-6">
              2025 was a transformative year for Ujamaa DeFi Platform. We successfully launched 
              our institutional-grade platform, secured Mauritius FSC licensing, and deployed 
              over €40M in financing to African SMEs across 5 pool families.
            </p>
            <p className="text-[#333333] leading-relaxed mb-6">
              Our investors earned an average yield of 11.2% while maintaining a 0% default rate, 
              demonstrating the strength of our risk management framework and due diligence processes.
            </p>
            <p className="text-[#333333] leading-relaxed mb-8">
              Looking ahead to 2026, we are targeting €150M in AUM and expanding our pool offerings 
              to include new asset classes. Thank you for your continued trust and support.
            </p>
            <div className="border-t border-gray-200 pt-6">
              <p className="font-bold text-[#023D7A]">Aziz Da Silva</p>
              <p className="text-sm text-gray-600">Chief Executive Officer</p>
              <p className="text-xs text-gray-500 mt-2">March 20, 2026</p>
            </div>
          </div>
        </section>

        <section id="performance" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Annual Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total AUM', value: '€40.5M', sub: 'Year-End 2025' },
              { label: 'Avg Yield', value: '11.2%', sub: 'Weighted Average' },
              { label: 'Active Pools', value: '5', sub: 'All Performing' },
              { label: 'Default Rate', value: '0%', sub: '0 Defaults' },
            ].map((item) => (
              <div key={item.label} className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-2">{item.label}</p>
                <p className="text-4xl font-extrabold text-[#023D7A] mb-2">{item.value}</p>
                <p className="text-sm text-gray-500">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="milestones" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Key Milestones 2025</h2>
          <div className="space-y-4">
            {[
              { quarter: 'Q1 2025', event: 'Platform launch on Polygon testnet', icon: '🚀' },
              { quarter: 'Q2 2025', event: 'Mauritius FSC license obtained', icon: '📜' },
              { quarter: 'Q3 2025', event: '€25M AUM milestone reached', icon: '💰' },
              { quarter: 'Q4 2025', event: 'All 5 pool families launched', icon: '🏆' },
            ].map((item) => (
              <div key={item.quarter} className="flex items-start gap-4">
                <span className="text-3xl">{item.icon}</span>
                <div className="flex-1 bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
                  <p className="text-sm font-bold text-[#00A8A8] mb-2">{item.quarter}</p>
                  <p className="text-lg font-bold text-[#023D7A]">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="financials" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Financial Highlights</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#023D7A] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Metric</th>
                    <th className="px-6 py-4 text-left font-bold">2025</th>
                    <th className="px-6 py-4 text-left font-bold">Target</th>
                    <th className="px-6 py-4 text-left font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: 'Total Yield Distributed', value: '€4.5M', target: '€4M', status: 'Exceeded' },
                    { metric: 'Management Fees', value: '€810K', target: '€800K', status: 'On Track' },
                    { metric: 'Active Investors', value: '127', target: '100', status: 'Exceeded' },
                    { metric: 'Financed SMEs', value: '42', target: '40', status: 'Exceeded' },
                    { metric: 'Jobs Supported', value: '3,200', target: '3,000', status: 'Exceeded' },
                  ].map((row) => (
                    <tr key={row.metric} className="border-b border-[#48A9F0]/20">
                      <td className="px-6 py-4 font-semibold text-[#023D7A]">{row.metric}</td>
                      <td className="px-6 py-4 text-[#00A8A8] font-bold">{row.value}</td>
                      <td className="px-6 py-4 text-[#333333]">{row.target}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          row.status === 'Exceeded' ? 'bg-green-100 text-green-700' :
                          row.status === 'On Track' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default AnnualReport2025;
