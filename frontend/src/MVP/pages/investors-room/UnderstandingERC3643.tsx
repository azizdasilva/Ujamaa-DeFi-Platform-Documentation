/**
 * Understanding ERC-3643 - Technical Guide
 * Educational document explaining ERC-3643 token standard
 */

import React from 'react';
import DocPage from './DocPage';

const UnderstandingERC3643: React.FC = () => {
  const tableOfContents = [
    { id: 'intro', title: 'Introduction to Token Standards' },
    { id: 'difference', title: 'What Makes ERC-3643 Different' },
    { id: 'components', title: 'Key Components' },
    { id: 'transfers', title: 'How Transfers Work' },
    { id: 'compliance', title: 'Compliance Features' },
    { id: 'comparison', title: 'Token Standards Comparison' },
  ];

  return (
    <DocPage
      title="Understanding ERC-3643"
      category="14_EDUCATIONAL"
      categoryId="02"
      lastUpdated="March 21, 2026"
      tableOfContents={tableOfContents}
    >
      <div className="space-y-12">
        {/* Introduction */}
        <section id="intro" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Introduction to Token Standards</h2>
          
          <div className="bg-gradient-to-r from-[#023D7A]/10 to-[#00A8A8]/10 border-l-4 border-[#00A8A8] p-6 rounded-r-lg mb-6">
            <p className="text-[#333333] leading-relaxed text-lg">
              A <strong>token standard</strong> is a set of rules that defines how a token behaves on a blockchain.
              ERC-3643 is specifically designed for <strong>regulated securities</strong> with built-in compliance.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-[#023D7A] mb-4">Common Token Standards</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg">
              <thead className="bg-[#023D7A] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Standard</th>
                  <th className="px-6 py-4 text-left">Purpose</th>
                  <th className="px-6 py-4 text-left">Key Feature</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#48A9F0]/20">
                  <td className="px-6 py-4 font-bold text-[#023D7A]">ERC-20</td>
                  <td className="px-6 py-4 text-[#333333]">Fungible tokens</td>
                  <td className="px-6 py-4 text-[#333333]">Anyone can hold and transfer</td>
                </tr>
                <tr className="border-b border-[#48A9F0]/20 bg-[#F3F8FA]">
                  <td className="px-6 py-4 font-bold text-[#023D7A]">ERC-721</td>
                  <td className="px-6 py-4 text-[#333333]">Non-fungible tokens (NFTs)</td>
                  <td className="px-6 py-4 text-[#333333]">Unique tokens, one-of-a-kind</td>
                </tr>
                <tr className="border-b border-[#48A9F0]/20">
                  <td className="px-6 py-4 font-bold text-[#023D7A]">ERC-1155</td>
                  <td className="px-6 py-4 text-[#333333]">Multi-token standard</td>
                  <td className="px-6 py-4 text-[#333333]">Both fungible and non-fungible</td>
                </tr>
                <tr className="border-b border-[#48A9F0]/20 bg-[#F3F8FA]">
                  <td className="px-6 py-4 font-bold text-[#023D7A]">ERC-3643</td>
                  <td className="px-6 py-4 text-[#333333]">Regulated securities</td>
                  <td className="px-6 py-4 text-[#333333]">Permissioned transfers with KYC</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* What Makes ERC-3643 Different */}
        <section id="difference" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">What Makes ERC-3643 Different</h2>
          
          <h3 className="text-2xl font-bold text-[#023D7A] mb-4">Permissioned vs. Permissionless</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500">
              <h4 className="font-bold text-[#023D7A] mb-4">ERC-20 (Permissionless)</h4>
              <ul className="space-y-2 text-[#333333]">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">❌</span>
                  <span>Anyone with a wallet can hold</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">❌</span>
                  <span>No identity verification required</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">❌</span>
                  <span>No compliance checks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">❌</span>
                  <span>Use case: Cryptocurrencies, utilities</span>
                </li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
              <h4 className="font-bold text-[#023D7A] mb-4">ERC-3643 (Permissioned)</h4>
              <ul className="space-y-2 text-[#333333]">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✅</span>
                  <span>Only verified investors can hold</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✅</span>
                  <span>KYC/KYB verification required</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✅</span>
                  <span>Built-in compliance checks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✅</span>
                  <span>Use case: Securities, regulated assets</span>
                </li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-[#023D7A] mb-4">Key Innovations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🆔', title: 'Identity Registry', desc: 'On-chain verification status' },
              { icon: '⚖️', title: 'Compliance Module', desc: 'Rule enforcement at token level' },
              { icon: '✓', title: 'Transfer Validation', desc: 'Every transfer checked before execution' },
              { icon: '🔒', title: 'Forced Transfer', desc: 'Admin can transfer for regulatory compliance' },
              { icon: '⏸️', title: 'Pause Mechanism', desc: 'Emergency stop functionality' },
              { icon: '🌍', title: 'Jurisdiction Controls', desc: 'Geographic restrictions enforced' },
            ].map((item) => (
              <div key={item.title} className="bg-white border-2 border-[#48A9F0]/30 rounded-xl p-6 text-center">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h4 className="font-bold text-[#023D7A] mb-2">{item.title}</h4>
                <p className="text-sm text-[#333333]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Components */}
        <section id="components" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Key Components</h2>
          
          <div className="bg-gradient-to-br from-[#023D7A] to-[#00A8A8] text-white rounded-xl p-8 mb-6">
            <h3 className="text-xl font-bold mb-4">ERC-3643 Ecosystem Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="font-bold mb-2">🪙 Token Contract</p>
                <p className="text-sm opacity-90">Balance Tracking</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="font-bold mb-2">🆔 Identity Registry</p>
                <p className="text-sm opacity-90">KYC Status</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="font-bold mb-2">⚖️ Compliance Module</p>
                <p className="text-sm opacity-90">Rules Engine</p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-[#023D7A] mb-4">Identity Registry Stores</h3>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <ul className="space-y-3">
              {[
                { label: 'Verification Status', desc: 'Is this wallet verified?' },
                { label: 'KYC Level', desc: 'What level of verification (1, 2, or 3)?' },
                { label: 'Jurisdiction', desc: 'What country is the investor in?' },
                { label: 'Identity ID', desc: 'Reference to off-chain KYC data' },
                { label: 'Accreditation Status', desc: 'Is the investor accredited?' },
              ].map((item) => (
                <li key={item.label} className="flex justify-between items-center py-3 border-b border-[#48A9F0]/20 last:border-0">
                  <span className="font-bold text-[#023D7A]">{item.label}</span>
                  <span className="text-[#333333]">{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How Transfers Work */}
        <section id="transfers" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">How Transfers Work</h2>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-4">
              {[
                { step: '1', title: 'Transfer Initiated', desc: 'User A attempts to send tokens to User B' },
                { step: '2', title: 'Identity Check', desc: 'Contract checks if User B is in Identity Registry' },
                { step: '3', title: 'Compliance Validation', desc: 'Compliance Module verifies transfer rules' },
                { step: '4', title: 'Jurisdiction Check', desc: 'Verify User B is not in a blocked country' },
                { step: '5', title: 'Transfer Executed', desc: 'If all checks pass, tokens are transferred' },
                { step: '6', title: 'Event Emitted', desc: 'Transfer event logged for tracking' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#00A8A8] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1 bg-[#F3F8FA] rounded-lg p-4">
                    <h4 className="font-bold text-[#023D7A]">{item.title}</h4>
                    <p className="text-sm text-[#333333]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Features */}
        <section id="compliance" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Compliance Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">🛡️ Built-in Compliance</h3>
              <ul className="space-y-3">
                {[
                  'KYC/KYB verification at token level',
                  'Transfer restrictions by jurisdiction',
                  'Investor type restrictions (retail/institutional)',
                  'Investment limit enforcement',
                  'Sanctions list screening (OFAC, UN, EU)',
                  'Accreditation verification',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#00A8A8] mt-1">✓</span>
                    <span className="text-[#333333]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-[#023D7A] mb-4">📋 Regulatory Alignment</h3>
              <ul className="space-y-3">
                {[
                  'EU MiCA compliant',
                  'SEC Regulation D (Rule 506c)',
                  'Mauritius FSC licensed',
                  'GDPR data protection',
                  'FATF Travel Rule compliant',
                  'AML/CFT policies enforced',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#00A8A8] mt-1">✓</span>
                    <span className="text-[#333333]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Token Standards Comparison */}
        <section id="comparison" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Token Standards Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg">
              <thead className="bg-[#023D7A] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Feature</th>
                  <th className="px-6 py-4 text-left">ERC-20</th>
                  <th className="px-6 py-4 text-left">ERC-721</th>
                  <th className="px-6 py-4 text-left">ERC-3643</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Token Type', erc20: 'Fungible', erc721: 'Non-fungible', erc3643: 'Fungible or NFT' },
                  { feature: 'Who Can Hold', erc20: 'Anyone', erc721: 'Anyone', erc3643: 'Verified only' },
                  { feature: 'Transfer Rules', erc20: 'Unrestricted', erc721: 'Unrestricted', erc3643: 'Compliance-gated' },
                  { feature: 'Identity Check', erc20: 'No', erc721: 'No', erc3643: 'Yes (required)' },
                  { feature: 'Jurisdiction Controls', erc20: 'No', erc721: 'No', erc3643: 'Yes (on-chain)' },
                  { feature: 'Forced Transfer', erc20: 'No', erc721: 'No', erc3643: 'Yes (admin)' },
                  { feature: 'Use Case', erc20: 'Crypto, Utilities', erc721: 'Collectibles, Art', erc3643: 'Securities, RWAs' },
                ].map((row, idx) => (
                  <tr key={idx} className={`border-b border-[#48A9F0]/20 ${idx % 2 === 1 ? 'bg-[#F3F8FA]' : ''}`}>
                    <td className="px-6 py-4 font-bold text-[#023D7A]">{row.feature}</td>
                    <td className="px-6 py-4 text-[#333333]">{row.erc20}</td>
                    <td className="px-6 py-4 text-[#333333]">{row.erc721}</td>
                    <td className="px-6 py-4 font-bold text-[#00A8A8]">{row.erc3643}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Why ERC-3643 for Ujamaa DeFi Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold mb-2">🔐 Security</h3>
              <p className="text-sm opacity-90">Only verified investors can hold tokens, preventing unauthorized access</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">⚖️ Compliance</h3>
              <p className="text-sm opacity-90">Built-in regulatory compliance at the token level</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">🌍 Global</h3>
              <p className="text-sm opacity-90">Jurisdiction controls allow global deployment with local compliance</p>
            </div>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

export default UnderstandingERC3643;
