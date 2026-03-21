/**
 * Fee Schedule
 * Investors Room - Onboarding
 */

import React from 'react';
import DocPage from './DocPage';

const FeeSchedule: React.FC = () => {
  const tableOfContents = [
    { id: 'management', title: 'Management Fees' },
    { id: 'performance', title: 'Performance Fees' },
    { id: 'transaction', title: 'Transaction Fees' },
    { id: 'example', title: 'Fee Example' },
  ];

  return (
    <DocPage
      title="Fee Schedule"
      category="Onboarding"
      categoryId="onboarding"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="management" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Management Fees</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600 mb-2">Annual Management Fee</p>
                <p className="text-5xl font-extrabold text-[#023D7A]">2.0%</p>
              </div>
              <div className="w-24 h-24 bg-[#023D7A]/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">💼</span>
              </div>
            </div>
            <div className="bg-[#F3F8FA] border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
              <h3 className="text-lg font-bold text-[#023D7A] mb-3">Fee Calculation</h3>
              <p className="text-[#333333] mb-4">
                Management fees are calculated daily based on the Net Asset Value (NAV) of your 
                investment and accrued monthly.
              </p>
              <div className="bg-white p-4 rounded-lg font-mono text-sm">
                <p className="text-gray-600">Daily Fee = (NAV × 2.0%) ÷ 365</p>
              </div>
            </div>
          </div>
        </section>

        <section id="performance" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Performance Fees</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#023D7A]">Performance Fee</h3>
                <span className="text-4xl font-extrabold text-[#00A8A8]">20%</span>
              </div>
              <p className="text-[#333333] mb-4">
                Applied to returns exceeding the annual hurdle rate.
              </p>
              <div className="bg-[#F3F8FA] p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Hurdle Rate (Annual)</p>
                <p className="text-2xl font-bold text-[#023D7A]">8% APR</p>
              </div>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">High-Water Mark</h3>
              <p className="text-[#333333] mb-4">
                Performance fees are only charged on new profits above the previous high-water mark, 
                ensuring you never pay twice on the same gains.
              </p>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>✓ Investor Protection:</strong> No performance fee on recovered losses
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="transaction" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Transaction Fees</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#023D7A] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Transaction Type</th>
                    <th className="px-6 py-4 text-left font-bold">Fee</th>
                    <th className="px-6 py-4 text-left font-bold">Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#48A9F0]/20">
                    <td className="px-6 py-4 font-semibold text-[#023D7A]">Investment (Deposit)</td>
                    <td className="px-6 py-4 text-[#00A8A8] font-bold">FREE</td>
                    <td className="px-6 py-4 text-[#333333]">-</td>
                  </tr>
                  <tr className="border-b border-[#48A9F0]/20 bg-[#F3F8FA]">
                    <td className="px-6 py-4 font-semibold text-[#023D7A]">Withdrawal (Redemption)</td>
                    <td className="px-6 py-4 text-[#00A8A8] font-bold">FREE</td>
                    <td className="px-6 py-4 text-[#333333]">-</td>
                  </tr>
                  <tr className="border-b border-[#48A9F0]/20">
                    <td className="px-6 py-4 font-semibold text-[#023D7A]">Token Transfer</td>
                    <td className="px-6 py-4 text-[#333333]">Network Gas Fee</td>
                    <td className="px-6 py-4 text-[#333333]">Per transaction</td>
                  </tr>
                  <tr className="border-b border-[#48A9F0]/20 bg-[#F3F8FA]">
                    <td className="px-6 py-4 font-semibold text-[#023D7A]">Early Redemption (&lt;90 days)</td>
                    <td className="px-6 py-4 text-red-600 font-bold">2% Penalty</td>
                    <td className="px-6 py-4 text-[#333333]">If applicable</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-[#023D7A]">Account Maintenance</td>
                    <td className="px-6 py-4 text-[#00A8A8] font-bold">FREE</td>
                    <td className="px-6 py-4 text-[#333333]">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="example" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Fee Example</h2>
          <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-2 border-[#48A9F0]/30 rounded-xl p-8">
            <h3 className="text-xl font-bold text-[#023D7A] mb-6">Investment Scenario: €1,000,000</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-2">Initial Investment</p>
                <p className="text-3xl font-extrabold text-[#023D7A]">€1,000,000</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-2">Annual Return (12%)</p>
                <p className="text-3xl font-extrabold text-[#00A8A8]">€120,000</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-2">Gross Value</p>
                <p className="text-3xl font-extrabold text-[#023D7A]">€1,120,000</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-[#023D7A] mb-4">Fee Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-600">Management Fee (2%)</span>
                  <span className="font-bold text-red-600">-€20,000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-600">Performance Fee (20% on €40,000 above 8% hurdle)</span>
                  <span className="font-bold text-red-600">-€8,000</span>
                </div>
                <div className="flex justify-between items-center bg-[#F3F8FA] p-4 rounded-lg mt-4">
                  <span className="text-lg font-bold text-gray-700">Net Return to Investor</span>
                  <span className="text-2xl font-extrabold text-[#00A8A8]">€92,000 (9.2% net)</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default FeeSchedule;
