/**
 * Investment Case Studies
 * Real-world examples of Ujamaa investments
 */

import React from 'react';
import DocPage from './DocPage';

const InvestmentCaseStudies: React.FC = () => {
  return (
    <DocPage
      title="Investment Case Studies"
      category="00_EXECUTIVE"
      categoryId="09"
      lastUpdated="March 21, 2026"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Real-World Investment Examples</h2>
          <p className="text-[#333333] leading-relaxed">
            Explore actual investment scenarios and their outcomes on the Ujamaa DeFi Platform.
          </p>
        </section>

        {/* Case Study 1 */}
        <section className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] p-6 text-white">
            <h3 className="text-2xl font-bold">Case Study #1: Cotton Exporter Financing</h3>
            <p className="opacity-90">uLP-IND Pool Investment | Q1 2026</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-[#023D7A] mb-2">Investment Details</h4>
                <CaseStudyDetail label="Asset" value="€2M cotton inventory" />
                <CaseStudyDetail label="Pool" value="uLP-IND (Industrial)" />
                <CaseStudyDetail label="Tenor" value="180 days" />
                <CaseStudyDetail label="Interest Rate" value="10% APR" />
              </div>
              <div>
                <h4 className="font-bold text-[#023D7A] mb-2">Outcome</h4>
                <CaseStudyDetail label="Actual Return" value="10.2% APR" />
                <CaseStudyDetail label="Default Rate" value="0%" />
                <CaseStudyDetail label="Investor Satisfaction" value="4.8/5" />
              </div>
            </div>
            <div className="p-4 bg-[#F3F8FA] rounded-lg">
              <h4 className="font-bold text-[#023D7A] mb-2">Key Takeaways</h4>
              <ul className="space-y-2 text-[#333333]">
                <li>• Diversification across 50+ factories reduced individual asset risk</li>
                <li>• UGT collateral provided 120% coverage</li>
                <li>• Quarterly distributions met investor expectations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Case Study 2 */}
        <section className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] p-6 text-white">
            <h3 className="text-2xl font-bold">Case Study #2: Cocoa Farm Investment</h3>
            <p className="opacity-90">UAT-COCOA Single Asset | Q2 2026</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-[#023D7A] mb-2">Investment Details</h4>
                <CaseStudyDetail label="Asset" value="Ivory Coast cocoa farm" />
                <CaseStudyDetail label="Token" value="UAT-COCOA" />
                <CaseStudyDetail label="Investment" value="€500,000" />
                <CaseStudyDetail label="Expected Return" value="12% APR" />
              </div>
              <div>
                <h4 className="font-bold text-[#023D7A] mb-2">Outcome</h4>
                <CaseStudyDetail label="Actual Return" value="14% APR" />
                <CaseStudyDetail label="Harvest" value="Above average" />
                <CaseStudyDetail label="Early Redemption" value="No" />
              </div>
            </div>
            <div className="p-4 bg-[#F3F8FA] rounded-lg">
              <h4 className="font-bold text-[#023D7A] mb-2">Key Takeaways</h4>
              <ul className="space-y-2 text-[#333333]">
                <li>• Single-asset investment offered higher returns (14% vs 10%)</li>
                <li>• Weather risk was the primary concern</li>
                <li>• Investor had local market knowledge, reducing due diligence risk</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-[#023D7A] mb-6">uLP vs UAT Performance Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#023D7A] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Metric</th>
                  <th className="px-4 py-3 text-left">uLP (Pool)</th>
                  <th className="px-4 py-3 text-left">UAT (Single)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 font-bold text-[#023D7A]">Average Return</td>
                  <td className="px-4 py-3">10.2%</td>
                  <td className="px-4 py-3">14%</td>
                </tr>
                <tr className="border-b bg-[#F3F8FA]">
                  <td className="px-4 py-3 font-bold text-[#023D7A]">Volatility</td>
                  <td className="px-4 py-3">Low (σ=2%)</td>
                  <td className="px-4 py-3">Medium (σ=8%)</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-bold text-[#023D7A]">Default Rate</td>
                  <td className="px-4 py-3">0%</td>
                  <td className="px-4 py-3">N/A</td>
                </tr>
                <tr className="border-b bg-[#F3F8FA]">
                  <td className="px-4 py-3 font-bold text-[#023D7A]">Min Investment</td>
                  <td className="px-4 py-3">€1,000</td>
                  <td className="px-4 py-3">€50,000</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-bold text-[#023D7A]">Investor Satisfaction</td>
                  <td className="px-4 py-3">4.7/5</td>
                  <td className="px-4 py-3">4.5/5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">Investor Testimonials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Testimonial
              quote="uLP provides steady returns with peace of mind. The diversification across 50+ assets means I sleep well at night."
              author="Family Office, Switzerland"
              investment="€250,000 in uLP-IND"
            />
            <Testimonial 
              quote="I invested in UAT-COCOA because I know the Ivory Coast cocoa market. Higher returns for my expertise."
              author="HNW Individual, London"
              investment="€100,000 in UAT-COCOA"
            />
          </div>
        </section>
      </div>
    </DocPage>
  );
};

const CaseStudyDetail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-[#48A9F0]/20">
    <span className="text-sm text-[#333333]">{label}</span>
    <span className="font-bold text-[#023D7A]">{value}</span>
  </div>
);

const Testimonial: React.FC<{ quote: string; author: string; investment: string }> = ({ quote, author, investment }) => (
  <div className="bg-white/10 rounded-lg p-6">
    <p className="text-lg italic mb-4">"{quote}"</p>
    <p className="font-bold">— {author}</p>
    <p className="text-sm opacity-80">{investment}</p>
  </div>
);

export default InvestmentCaseStudies;
