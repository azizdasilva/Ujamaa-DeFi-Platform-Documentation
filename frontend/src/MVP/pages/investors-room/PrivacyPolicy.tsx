/**
 * Privacy Policy Document
 * Investors Room - Ujamaa DeFi Platform
 */

import React from 'react';
import DocPage from './DocPage';

const PrivacyPolicy: React.FC = () => {
  const tableOfContents = [
    { id: 'collection', title: 'Information Collection' },
    { id: 'usage', title: 'How We Use Information' },
    { id: 'protection', title: 'Data Protection' },
    { id: 'sharing', title: 'Information Sharing' },
    { id: 'rights', title: 'Your Rights' },
  ];

  return (
    <DocPage
      title="Privacy Policy"
      category="Legal & Compliance"
      categoryId="legal"
      lastUpdated="March 20, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        {/* Information Collection */}
        <section id="collection" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">1. Information Collection</h2>
          <div className="space-y-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">Personal Information</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">📋</span>
                  <span className="text-[#333333]">Name, date of birth, and nationality</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">📋</span>
                  <span className="text-[#333333]">Government-issued identification (passport, national ID)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">📋</span>
                  <span className="text-[#333333]">Proof of address (utility bill, bank statement)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">📋</span>
                  <span className="text-[#333333]">Source of wealth documentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">📋</span>
                  <span className="text-[#333333]">Wallet addresses and blockchain transaction history</span>
                </li>
              </ul>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">Technical Information</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">💻</span>
                  <span className="text-[#333333]">IP address and device information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">💻</span>
                  <span className="text-[#333333]">Browser type and version</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">💻</span>
                  <span className="text-[#333333]">Operating system and platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">💻</span>
                  <span className="text-[#333333]">Login times and session information</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        <section id="usage" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">2. How We Use Information</h2>
          <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-6 rounded-r-lg">
            <p className="text-[#333333] leading-relaxed mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                <span className="text-[#333333]"><strong>Identity Verification:</strong> KYC/AML compliance and investor accreditation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                <span className="text-[#333333]"><strong>Transaction Processing:</strong> Facilitating investments and withdrawals</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                <span className="text-[#333333]"><strong>Regulatory Compliance:</strong> Meeting legal and regulatory obligations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                <span className="text-[#333333]"><strong>Security:</strong> Fraud prevention and platform security</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                <span className="text-[#333333]"><strong>Communication:</strong> Sending important updates and notifications</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00A8A8] font-bold text-xl">✓</span>
                <span className="text-[#333333]"><strong>Reporting:</strong> Generating performance reports and statements</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Data Protection */}
        <section id="protection" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">3. Data Protection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">🔐 Security Measures</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">🛡️</span>
                  <span className="text-[#333333]">256-bit SSL encryption for data transmission</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">🛡️</span>
                  <span className="text-[#333333]">AES-256 encryption for data at rest</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">🛡️</span>
                  <span className="text-[#333333]">Multi-signature access controls</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">🛡️</span>
                  <span className="text-[#333333]">Regular security audits and penetration testing</span>
                </li>
              </ul>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">📍 Data Storage</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">☁️</span>
                  <span className="text-[#333333]">Primary: Mauritius (FSC-compliant data centers)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">☁️</span>
                  <span className="text-[#333333]">Backup: Encrypted off-site backups</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">☁️</span>
                  <span className="text-[#333333]">Retention: 7 years post-account closure</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">☁️</span>
                  <span className="text-[#333333]">GDPR compliant data handling</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Information Sharing */}
        <section id="sharing" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">4. Information Sharing</h2>
          <div className="space-y-6">
            <div className="bg-[#F3F8FA] border-l-4 border-[#023D7A] p-6 rounded-r-lg">
              <h3 className="text-lg font-bold text-[#023D7A] mb-3">We Do NOT Sell Your Data</h3>
              <p className="text-[#333333]">
                We do not sell, trade, or rent your personal information to third parties. 
                Your data is only shared when required by law or necessary for platform operations.
              </p>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">Permitted Sharing</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">📤</span>
                  <div>
                    <p className="font-bold text-[#023D7A]">Regulatory Authorities</p>
                    <p className="text-sm text-gray-600">Mauritius FSC, financial intelligence units (as required by law)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">📤</span>
                  <div>
                    <p className="font-bold text-[#023D7A]">Service Providers</p>
                    <p className="text-sm text-gray-600">Fireblocks (custody), identity verification providers (under NDA)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00A8A8] font-bold">📤</span>
                  <div>
                    <p className="font-bold text-[#023D7A]">Legal Requirements</p>
                    <p className="text-sm text-gray-600">Court orders, subpoenas, legal obligations</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section id="rights" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">5. Your Rights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-4">
              <h4 className="font-bold text-[#023D7A] mb-2">👁️ Right to Access</h4>
              <p className="text-sm text-[#333333]">Request a copy of your personal data</p>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-4">
              <h4 className="font-bold text-[#023D7A] mb-2">✏️ Right to Rectification</h4>
              <p className="text-sm text-[#333333]">Correct inaccurate or incomplete data</p>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-4">
              <h4 className="font-bold text-[#023D7A] mb-2">🗑️ Right to Erasure</h4>
              <p className="text-sm text-[#333333]">Request deletion of your data (subject to legal retention)</p>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-4">
              <h4 className="font-bold text-[#023D7A] mb-2">📦 Right to Portability</h4>
              <p className="text-sm text-[#333333]">Receive your data in a structured, machine-readable format</p>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-4">
              <h4 className="font-bold text-[#023D7A] mb-2">🚫 Right to Object</h4>
              <p className="text-sm text-[#333333]">Object to processing of your personal data</p>
            </div>
            <div className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-4">
              <h4 className="font-bold text-[#023D7A] mb-2">⏸️ Right to Restriction</h4>
              <p className="text-sm text-[#333333]">Request restriction of processing your data</p>
            </div>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default PrivacyPolicy;
