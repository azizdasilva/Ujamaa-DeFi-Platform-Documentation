/**
 * KYC/AML Guide
 * Investors Room - Onboarding
 */

import React from 'react';
import DocPage from './DocPage';

const KYCAMLGuide: React.FC = () => {
  const tableOfContents = [
    { id: 'requirements', title: 'KYC Requirements' },
    { id: 'aml', title: 'AML Procedures' },
    { id: 'documents', title: 'Required Documents' },
    { id: 'process', title: 'Verification Process' },
  ];

  return (
    <DocPage
      title="KYC/AML Requirements Guide"
      category="Onboarding"
      categoryId="onboarding"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        <section id="requirements" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">KYC Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">Individual Investors</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">✓</span>
                  <span className="text-[#333333]">Valid government-issued ID (passport or national ID)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">✓</span>
                  <span className="text-[#333333]">Proof of address (utility bill, bank statement &lt;3 months)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">✓</span>
                  <span className="text-[#333333]">Selfie with ID document</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">✓</span>
                  <span className="text-[#333333]">Source of wealth declaration</span>
                </li>
              </ul>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">Corporate Investors</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">✓</span>
                  <span className="text-[#333333]">Certificate of incorporation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">✓</span>
                  <span className="text-[#333333]">Memorandum & Articles of Association</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">✓</span>
                  <span className="text-[#333333]">Register of directors and shareholders</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">✓</span>
                  <span className="text-[#333333]">UBO (Ultimate Beneficial Owner) identification</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="aml" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">AML Procedures</h2>
          <div className="bg-[#F3F8FA] border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
            <h3 className="text-xl font-bold text-[#023D7A] mb-4">Anti-Money Laundering Checks</h3>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-[#023D7A] text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <p className="font-bold text-[#023D7A]">Sanctions Screening</p>
                  <p className="text-[#333333]">Check against OFAC, UN, EU sanctions lists</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-[#023D7A] text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <p className="font-bold text-[#023D7A]">PEP Screening</p>
                  <p className="text-[#333333]">Politically Exposed Persons database check</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-[#023D7A] text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <p className="font-bold text-[#023D7A]">Adverse Media Check</p>
                  <p className="text-[#333333]">Global news and enforcement database screening</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-[#023D7A] text-white rounded-full flex items-center justify-center font-bold">4</span>
                <div>
                  <p className="font-bold text-[#023D7A]">Transaction Monitoring</p>
                  <p className="text-[#333333]">Ongoing monitoring for suspicious activity</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section id="documents" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Required Documents</h2>
          <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#023D7A] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Document Type</th>
                    <th className="px-6 py-4 text-left font-bold">Acceptable Forms</th>
                    <th className="px-6 py-4 text-left font-bold">Validity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#48A9F0]/20">
                    <td className="px-6 py-4 font-semibold text-[#023D7A]">Identity</td>
                    <td className="px-6 py-4 text-[#333333]">Passport, National ID, Driver's License</td>
                    <td className="px-6 py-4 text-[#333333]">Must be valid</td>
                  </tr>
                  <tr className="border-b border-[#48A9F0]/20 bg-[#F3F8FA]">
                    <td className="px-6 py-4 font-semibold text-[#023D7A]">Address</td>
                    <td className="px-6 py-4 text-[#333333]">Utility bill, Bank statement, Tax notice</td>
                    <td className="px-6 py-4 text-[#333333]">&lt; 3 months old</td>
                  </tr>
                  <tr className="border-b border-[#48A9F0]/20">
                    <td className="px-6 py-4 font-semibold text-[#023D7A]">Source of Wealth</td>
                    <td className="px-6 py-4 text-[#333333]">Employment letter, Business docs, Investment statements</td>
                    <td className="px-6 py-4 text-[#333333]">Recent documentation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="process" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Verification Process</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#00A8A8] text-white rounded-full flex items-center justify-center font-bold text-xl">1</div>
              <div className="flex-1 bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#023D7A] mb-2">Submit Application</h3>
                <p className="text-[#333333]">Complete online KYC form and upload required documents</p>
                <p className="text-sm text-gray-500 mt-2">Time: 10-15 minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#00A8A8] text-white rounded-full flex items-center justify-center font-bold text-xl">2</div>
              <div className="flex-1 bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#023D7A] mb-2">Automated Verification</h3>
                <p className="text-[#333333]">AI-powered document verification and facial recognition</p>
                <p className="text-sm text-gray-500 mt-2">Time: 2-5 minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#00A8A8] text-white rounded-full flex items-center justify-center font-bold text-xl">3</div>
              <div className="flex-1 bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#023D7A] mb-2">Compliance Review</h3>
                <p className="text-[#333333]">Manual review by compliance team if required</p>
                <p className="text-sm text-gray-500 mt-2">Time: 24-48 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#00A8A8] text-white rounded-full flex items-center justify-center font-bold text-xl">4</div>
              <div className="flex-1 bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#023D7A] mb-2">Account Activation</h3>
                <p className="text-[#333333]">Receive approval notification and activate trading account</p>
                <p className="text-sm text-gray-500 mt-2">Time: Immediate</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default KYCAMLGuide;
