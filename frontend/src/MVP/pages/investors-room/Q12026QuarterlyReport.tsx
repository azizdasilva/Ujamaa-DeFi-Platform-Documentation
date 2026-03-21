/**
 * Q1 2026 Quarterly Report
 */

import React from 'react';
import DocPage from './DocPage';

const Q12026QuarterlyReport: React.FC = () => {
  const tableOfContents = [
    { id: 'highlights', title: 'Quarter Highlights' },
    { id: 'performance', title: 'Performance Metrics' },
    { id: 'portfolio', title: 'Portfolio Composition' },
    { id: 'outlook', title: 'Q2 Outlook' },
  ];

  return (
    <DocPage
      title="Q1 2026 Quarterly Report"
      category="Ongoing Reporting"
      categoryId="reporting"
      lastUpdated="April 15, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="highlights" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Quarter Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total AUM', value: '€45.2M', change: '+12%' },
              { label: 'Avg Yield', value: '11.8%', change: '+0.5%' },
              { label: 'Active Pools', value: '5', change: '0' },
              { label: 'Investors', value: '127', change: '+34' },
            ].map((item) => (
              <div key={item.label} className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-2">{item.label}</p>
                <p className="text-4xl font-extrabold text-[#023D7A] mb-2">{item.value}</p>
                <p className={`text-sm font-bold ${item.change.startsWith('+') ? 'text-green-600' : 'text-gray-500'}`}>
                  {item.change} vs Q4 2025
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="performance" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Performance by Pool</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#023D7A] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Pool</th>
                    <th className="px-6 py-4 text-left font-bold">Q1 Yield</th>
                    <th className="px-6 py-4 text-left font-bold">Target</th>
                    <th className="px-6 py-4 text-left font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Industrial', yield: '11.2%', target: '10-12%', status: 'On Track' },
                    { name: 'Agriculture', yield: '13.8%', target: '12-15%', status: 'On Track' },
                    { name: 'Trade Finance', yield: '9.5%', target: '8-10%', status: 'On Track' },
                    { name: 'Renewable Energy', yield: '10.8%', target: '9-11%', status: 'On Track' },
                    { name: 'Real Estate', yield: '9.2%', target: '8-12%', status: 'On Track' },
                  ].map((pool) => (
                    <tr key={pool.name} className="border-b border-[#48A9F0]/20">
                      <td className="px-6 py-4 font-semibold text-[#023D7A]">{pool.name}</td>
                      <td className="px-6 py-4 text-[#00A8A8] font-bold">{pool.yield}</td>
                      <td className="px-6 py-4 text-[#333333]">{pool.target}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                          {pool.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="portfolio" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Portfolio Composition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">By Sector</h3>
              <div className="space-y-3">
                {[
                  { sector: 'Manufacturing', pct: '35%' },
                  { sector: 'Agriculture', pct: '28%' },
                  { sector: 'Trade', pct: '18%' },
                  { sector: 'Energy', pct: '12%' },
                  { sector: 'Real Estate', pct: '7%' },
                ].map((item) => (
                  <div key={item.sector}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-[#023D7A]">{item.sector}</span>
                      <span className="text-sm font-bold text-[#00A8A8]">{item.pct}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#00A8A8] h-2 rounded-full" style={{ width: item.pct }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">By Region</h3>
              <div className="space-y-3">
                {[
                  { region: 'West Africa', pct: '42%' },
                  { region: 'East Africa', pct: '31%' },
                  { region: 'North Africa', pct: '15%' },
                  { region: 'Southern Africa', pct: '12%' },
                ].map((item) => (
                  <div key={item.region}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-[#023D7A]">{item.region}</span>
                      <span className="text-sm font-bold text-[#00A8A8]">{item.pct}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#023D7A] h-2 rounded-full" style={{ width: item.pct }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="outlook" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Q2 2026 Outlook</h2>
          <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
            <h3 className="text-xl font-bold text-[#023D7A] mb-4">Key Priorities</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#00A8A8] font-bold text-xl">→</span>
                <span className="text-[#333333]">Expand Agricultural pool capacity by €10M</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00A8A8] font-bold text-xl">→</span>
                <span className="text-[#333333]">Launch new Renewable Energy initiatives</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00A8A8] font-bold text-xl">→</span>
                <span className="text-[#333333]">Enhance risk management systems</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00A8A8] font-bold text-xl">→</span>
                <span className="text-[#333333]">Target AUM: €60M by end of Q2</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default Q12026QuarterlyReport;
