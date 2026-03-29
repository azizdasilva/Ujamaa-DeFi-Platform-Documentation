/**
 * Due Diligence Questionnaire (DDQ)
 * Standard due diligence questionnaire for institutional investors
 */

import React from 'react';
import DocPage from './DocPage';

const DueDiligenceQuestionnaire: React.FC = () => {
  return (
    <DocPage
      title="Due Diligence Questionnaire"
      category="00_EXECUTIVE"
      categoryId="06"
      lastUpdated="March 21, 2026"
      tableOfContents={[
        { id: 'company', title: 'Company Information' },
        { id: 'team', title: 'Team & Governance' },
        { id: 'technology', title: 'Technology' },
        { id: 'compliance', title: 'Compliance & Regulatory' },
        { id: 'financial', title: 'Financial Information' },
        { id: 'risk', title: 'Risk Management' },
      ]}
    >
      <div className="space-y-8">
        <section>
          <p className="text-[#333333] leading-relaxed">
            This Due Diligence Questionnaire (DDQ) provides comprehensive information for institutional investors, family offices, and qualified investors evaluating an investment in Ujamaa DeFi Platform.
          </p>
        </section>

        {/* Company Information */}
        <section id="company" className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">1. Company Information</h2>
          <DDQTable rows={[
            { q: 'Legal Name', a: 'Ujamaa DeFi Platform Ltd' },
            { q: 'Jurisdiction', a: 'Mauritius' },
            { q: 'Registration Number', a: 'C184XXX' },
            { q: 'Date of Incorporation', a: 'January 2026' },
            { q: 'Registered Office', a: 'Port Louis, Mauritius' },
            { q: 'Business Activity', a: 'Tokenized real-world asset financing platform' },
            { q: 'Website', a: 'ujamaa.io' },
            { q: 'Licenses', a: 'Mauritius FSC CIS Manager License (pending)' },
          ]} />
        </section>

        {/* Team & Governance */}
        <section id="team" className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">2. Team & Governance</h2>
          <DDQTable rows={[
            { q: 'Number of Employees', a: '5 (core team) + advisors' },
            { q: 'Key Management', a: 'CEO, CTO, CFO, CCO, COO' },
            { q: 'Board Composition', a: '3 directors (2 independent)' },
            { q: 'Advisory Board', a: '5 members (finance, blockchain, African markets)' },
            { q: 'Equity Ownership', a: 'Founders 60%, ESOP 15%, Investors 25%' },
          ]} />
          
          <h3 className="text-2xl font-bold text-[#023D7A] mt-6 mb-4">Key Personnel</h3>
          <div className="space-y-4">
            <KeyPerson name="Lead Architect" role="10+ years blockchain" background="Former major financial institution" />
            <KeyPerson name="Chief Financial Officer" role="Ex-investment banker" background="Emerging markets expert" />
            <KeyPerson name="Chief Compliance Officer" role="Former regulator" background="Mauritius FSC licensed" />
          </div>
        </section>

        {/* Technology */}
        <section id="technology" className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">3. Technology</h2>
          <DDQTable rows={[
            { q: 'Blockchain', a: 'Polygon (EVM-compatible)' },
            { q: 'Token Standard', a: 'ERC-3643 (T-REX Protocol)' },
            { q: 'Smart Contracts', a: 'Solidity 0.8.20+' },
            { q: 'Frontend', a: 'React, TypeScript, Vite' },
            { q: 'Backend', a: 'Python, FastAPI' },
            { q: 'Custody', a: 'Fireblocks (institutional MPC)' },
            { q: 'Security Audits', a: 'CertiK (scheduled Q2 2026)' },
          ]} />
          
          <h3 className="text-2xl font-bold text-[#023D7A] mt-6 mb-4">Smart Contract Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContractCard name="UPTToken.sol" purpose="Yield-bearing pool token" standard="ERC-3643" />
            <ContractCard name="UATToken.sol" purpose="Single asset token" standard="ERC-3643" />
            <ContractCard name="UGTToken.sol" purpose="Collateral NFT" standard="ERC-721 + ERC-3643" />
            <ContractCard name="LiquidityPool.sol" purpose="Pool management" standard="Custom" />
            <ContractCard name="IndustrialGateway.sol" purpose="Asset certification" standard="Custom" />
            <ContractCard name="JurisdictionCompliance.sol" purpose="Geographic controls" standard="Custom" />
          </div>
        </section>

        {/* Compliance & Regulatory */}
        <section id="compliance" className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">4. Compliance & Regulatory</h2>
          <DDQTable rows={[
            { q: 'Primary Regulator', a: 'Mauritius Financial Services Commission (FSC)' },
            { q: 'License Type', a: 'CIS Manager License' },
            { q: 'AML/CFT Policy', a: 'Full KYC/KYB, transaction monitoring' },
            { q: 'Sanctions Screening', a: 'OFAC, UN, EU, FATF lists' },
            { q: 'Investor Restrictions', a: 'No US persons, sanctioned jurisdictions' },
            { q: 'Data Protection', a: 'GDPR compliant' },
            { q: 'Travel Rule', a: 'Compliant via Fireblocks' },
          ]} />
          
          <h3 className="text-2xl font-bold text-[#023D7A] mt-6 mb-4">Compliance Framework</h3>
          <div className="space-y-4">
            <ComplianceItem title="KYC/KYB" description="All investors verified before participation" />
            <ComplianceItem title="Accreditation" description="Verification for investments ≥€100,000" />
            <ComplianceItem title="Jurisdiction Controls" description="Smart contract-level geographic restrictions" />
            <ComplianceItem title="Transaction Monitoring" description="Real-time AML monitoring via Fireblocks" />
            <ComplianceItem title="Reporting" description="Regular reports to FSC and investors" />
          </div>
        </section>

        {/* Financial Information */}
        <section id="financial" className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">5. Financial Information</h2>
          <DDQTable rows={[
            { q: 'Current AUM', a: '€0 (MVP testnet)' },
            { q: 'Target AUM (Year 1)', a: '€100M' },
            { q: 'Revenue Model', a: '2% management fee + 20% performance fee' },
            { q: 'Projected Revenue (Year 1)', a: '€3.3M (at €100M AUM)' },
            { q: 'Burn Rate', a: '€100K/month' },
            { q: 'Runway', a: '18 months (current raise)' },
            { q: 'Auditor', a: '[TBD - Big 4 firm]' },
          ]} />
          
          <h3 className="text-2xl font-bold text-[#023D7A] mt-6 mb-4">Financial Projections</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#023D7A] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Metric</th>
                  <th className="px-4 py-3 text-left">Year 1</th>
                  <th className="px-4 py-3 text-left">Year 2</th>
                  <th className="px-4 py-3 text-left">Year 3</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="px-4 py-3">AUM</td><td className="px-4 py-3">€100M</td><td className="px-4 py-3">€500M</td><td className="px-4 py-3">€1.5B</td></tr>
                <tr className="border-b bg-[#F3F8FA]"><td className="px-4 py-3">Revenue</td><td className="px-4 py-3">€3.3M</td><td className="px-4 py-3">€16.5M</td><td className="px-4 py-3">€49.5M</td></tr>
                <tr className="border-b"><td className="px-4 py-3">Operating Costs</td><td className="px-4 py-3">€1.2M</td><td className="px-4 py-3">€4M</td><td className="px-4 py-3">€10M</td></tr>
                <tr className="border-b bg-[#F3F8FA]"><td className="px-4 py-3">Net Income</td><td className="px-4 py-3">€2.1M</td><td className="px-4 py-3">€12.5M</td><td className="px-4 py-3">€39.5M</td></tr>
                <tr className="border-b"><td className="px-4 py-3">Investors</td><td className="px-4 py-3">50+</td><td className="px-4 py-3">200+</td><td className="px-4 py-3">500+</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Risk Management */}
        <section id="risk" className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">6. Risk Management</h2>
          
          <h3 className="text-2xl font-bold text-[#023D7A] mb-4">Risk Categories</h3>
          <div className="space-y-4">
            <RiskItem category="Credit Risk" level="Medium" mitigation="Diversification, collateral (UGT), rigorous due diligence" />
            <RiskItem category="Smart Contract Risk" level="Medium" mitigation="CertiK audit, bug bounty, upgradeable contracts" />
            <RiskItem category="Regulatory Risk" level="Low" mitigation="FSC licensed, compliance-first design, legal opinions" />
            <RiskItem category="Liquidity Risk" level="Medium" mitigation="180-day lock-up, secondary market development" />
            <RiskItem category="FX Risk" level="Medium" mitigation="EUROD-denominated, hedging strategies" />
            <RiskItem category="Operational Risk" level="Low" mitigation="Multi-sig, Fireblocks custody, insurance" />
          </div>
          
          <h3 className="text-2xl font-bold text-[#023D7A] mt-6 mb-4">Risk Committee</h3>
          <div className="p-6 bg-[#F3F8FA] rounded-lg">
            <p className="text-[#333333] mb-4"><strong>Composition:</strong> CCO (Chair), CFO, External Risk Advisor</p>
            <p className="text-[#333333] mb-4"><strong>Meeting Frequency:</strong> Monthly (quarterly in Year 1)</p>
            <p className="text-[#333333]"><strong>Responsibilities:</strong> Risk assessment, limit monitoring, incident response, regulatory updates</p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Contact for Due Diligence</h2>
          <div className="space-y-2">
            <p><strong>Investor Relations:</strong> investors@ujamaa.io</p>
            <p><strong>Compliance:</strong> compliance@ujamaa.io</p>
            <p><strong>Data Room:</strong> Available under NDA</p>
          </div>
        </section>
      </div>
    </DocPage>
  );
};

// Sub-components
const DDQTable: React.FC<{ rows: { q: string; a: string }[] }> = ({ rows }) => (
  <div className="space-y-3">
    {rows.map((row, idx) => (
      <div key={idx} className={`flex flex-col md:flex-row md:justify-between p-4 rounded-lg ${idx % 2 === 0 ? 'bg-[#F3F8FA]' : 'bg-white'}`}>
        <span className="font-bold text-[#023D7A] md:w-1/3 mb-2 md:mb-0">{row.q}</span>
        <span className="text-[#333333] md:w-2/3">{row.a}</span>
      </div>
    ))}
  </div>
);

const KeyPerson: React.FC<{ name: string; role: string; background: string }> = ({ name, role, background }) => (
  <div className="flex items-center gap-4 p-4 bg-[#F3F8FA] rounded-lg">
    <div className="w-12 h-12 bg-[#023D7A] rounded-full flex items-center justify-center text-white font-bold">
      {name.charAt(0)}
    </div>
    <div>
      <p className="font-bold text-[#023D7A]">{name}</p>
      <p className="text-sm text-[#00A8A8]">{role}</p>
      <p className="text-xs text-[#333333]">{background}</p>
    </div>
  </div>
);

const ContractCard: React.FC<{ name: string; purpose: string; standard: string }> = ({ name, purpose, standard }) => (
  <div className="p-4 bg-[#F3F8FA] rounded-lg border-l-4 border-[#00A8A8]">
    <p className="font-bold text-[#023D7A] font-mono text-sm">{name}</p>
    <p className="text-xs text-[#333333] mt-1">{purpose}</p>
    <p className="text-xs text-[#00A8A8] mt-2">{standard}</p>
  </div>
);

const ComplianceItem: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="flex gap-4 p-4 bg-[#F3F8FA] rounded-lg">
    <div className="w-8 h-8 bg-[#00A8A8] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">✓</div>
    <div>
      <p className="font-bold text-[#023D7A]">{title}</p>
      <p className="text-sm text-[#333333]">{description}</p>
    </div>
  </div>
);

const RiskItem: React.FC<{ category: string; level: string; mitigation: string }> = ({ category, level, mitigation }) => (
  <div className="p-4 bg-[#F3F8FA] rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <p className="font-bold text-[#023D7A]">{category}</p>
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
        level === 'Low' ? 'bg-green-100 text-green-700' :
        level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>{level}</span>
    </div>
    <p className="text-sm text-[#333333]">{mitigation}</p>
  </div>
);

export default DueDiligenceQuestionnaire;
