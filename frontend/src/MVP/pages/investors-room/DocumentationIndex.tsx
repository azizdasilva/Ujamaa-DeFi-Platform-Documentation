/**
 * Investor Documentation Index
 * Complete index of all investor documents
 */

import React from 'react';
import DocPage from './DocPage';

const DocumentationIndex: React.FC = () => {
  return (
    <DocPage
      title="Investor Documentation Index"
      category="00_EXECUTIVE"
      categoryId="01"
      lastUpdated="March 21, 2026"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Complete Document Catalog</h2>
          <p className="text-[#333333] leading-relaxed mb-6">
            This index provides a comprehensive list of all investor documents available in the Ujamaa DeFi Platform Investors Room.
          </p>
        </section>

        {/* Executive Documents */}
        <section className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#48A9F0]/30">
          <h3 className="text-2xl font-bold text-[#023D7A] mb-4">📋 Executive Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentLink href="/investors-room/executive-summary" title="Executive Summary" desc="Platform overview & investment highlights" />
            <DocumentLink href="/investors-room/investor-documentation-navigator" title="Documentation Navigator" desc="Find the right document for your needs" />
            <DocumentLink href="/investors-room/investor-pitch-deck" title="Investor Pitch Deck" desc="Investment presentation" />
            <DocumentLink href="/investors-room/investment-memorandum" title="Investment Memorandum" desc="Detailed investment analysis" />
            <DocumentLink href="/investors-room/white-paper" title="White Paper" desc="Technical & economic framework" />
            <DocumentLink href="/investors-room/due-diligence-questionnaire" title="Due Diligence Questionnaire" desc="DDQ for institutional investors" />
            <DocumentLink href="/investors-room/risk-disclosure-memorandum" title="Risk Disclosure Memorandum" desc="Comprehensive risk factors" />
            <DocumentLink href="/investors-room/term-sheet" title="Term Sheet" desc="Investment terms summary" />
            <DocumentLink href="/investors-room/investment-case-studies" title="Investment Case Studies" desc="Real-world examples" />
            <DocumentLink href="/investors-room/impact-report" title="Impact Report" desc="Social & economic impact" />
            <DocumentLink href="/investors-room/investor-faq" title="Investor FAQ" desc="Frequently asked questions" />
          </div>
        </section>

        {/* Onboarding Documents */}
        <section className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#48A9F0]/30">
          <h3 className="text-2xl font-bold text-[#023D7A] mb-4">📝 Onboarding (10)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentLink href="/investors-room/investor-information-memorandum" title="Investor Information Memorandum" desc="Know before you invest" />
            <DocumentLink href="/investors-room/kyc-aml-guide" title="KYC/AML Guide" desc="Identity verification process" />
            <DocumentLink href="/investors-room/accreditation-requirements" title="Accreditation Requirements" desc="Investor eligibility criteria" />
            <DocumentLink href="/investors-room/jurisdiction-eligibility" title="Jurisdiction Eligibility" desc="Country-specific rules" />
            <DocumentLink href="/investors-room/fee-schedule" title="Fee Schedule" desc="All fees explained" />
          </div>
        </section>

        {/* Asset Offerings */}
        <section className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#48A9F0]/30">
          <h3 className="text-2xl font-bold text-[#023D7A] mb-4">📊 Asset Offerings (11)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentLink href="/investors-room/investment-memorandum" title="Offering Memorandum Template" desc="Standard offering document" />
            <DocumentLink href="/investors-room/term-sheet" title="Term Sheet Template" desc="Investment terms template" />
            <DocumentLink href="/investors-room/risk-disclosure" title="Risk Disclosure Statement" desc="Asset-specific risks" />
            <DocumentLink href="/investors-room/subscription-form" title="Subscription Agreement" desc="Investment subscription" />
            <DocumentLink href="/investors-room/investor-faq" title="Investor Questionnaire" desc="Suitability assessment" />
          </div>
        </section>

        {/* Ongoing Reporting */}
        <section className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#48A9F0]/30">
          <h3 className="text-2xl font-bold text-[#023D7A] mb-4">📈 Ongoing Reporting (12)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentLink href="/investors-room/q1-2026-report" title="Quarterly Report" desc="Quarterly performance" />
            <DocumentLink href="/investors-room/annual-report-2025" title="Annual Report 2025" desc="Annual performance review" />
            <DocumentLink href="/investors-room/nav-statements" title="Distribution Notice" desc="Yield distribution info" />
            <DocumentLink href="/investors-room/nav-statements" title="NAV Statements" desc="Net asset value reports" />
          </div>
        </section>

        {/* Legal & Compliance */}
        <section className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#48A9F0]/30">
          <h3 className="text-2xl font-bold text-[#023D7A] mb-4">⚖️ Legal & Compliance (13)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentLink href="/investors-room/terms-of-service" title="Terms of Service" desc="Platform terms" />
            <DocumentLink href="/investors-room/privacy-policy" title="Privacy Policy" desc="Data protection" />
            <DocumentLink href="/investors-room/risk-acknowledgment-form" title="Risk Acknowledgment Form" desc="Risk acknowledgment" />
            <DocumentLink href="/investors-room/sanctions-declaration" title="Sanctions Declaration" desc="Compliance declaration" />
          </div>
        </section>

        {/* Educational */}
        <section className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#48A9F0]/30">
          <h3 className="text-2xl font-bold text-[#023D7A] mb-4">🎓 Educational (14)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentLink href="/investors-room/tokenization-guide" title="How Tokenization Works" desc="Tokenization basics" />
            <DocumentLink href="/investors-room/defi-basics" title="Understanding ERC-3643" desc="Compliance token standard" />
            <DocumentLink href="/investors-room/token-comparison-guide" title="Token Comparison Guide" desc="UAT vs uLP vs UGT" />
          </div>
        </section>

        {/* Templates */}
        <section className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#48A9F0]/30">
          <h3 className="text-2xl font-bold text-[#023D7A] mb-4">📄 Templates (15)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentLink href="/investors-room/investment-memorandum" title="PPM Template" desc="Private Placement Memo" />
            <DocumentLink href="/investors-room/investment-agreement" title="Subscription Agreement" desc="Investment agreement" />
            <DocumentLink href="/investors-room/term-sheet" title="Term Sheet Template" desc="Terms template" />
          </div>
        </section>
      </div>
    </DocPage>
  );
};

interface DocumentLinkProps {
  href: string;
  title: string;
  desc: string;
}

const DocumentLink: React.FC<DocumentLinkProps> = ({ href, title, desc }) => (
  <a href={href} className="block p-4 bg-[#F3F8FA] rounded-lg hover:bg-[#023D7A]/10 transition-colors border border-[#48A9F0]/20">
    <h4 className="font-bold text-[#023D7A]">{title}</h4>
    <p className="text-sm text-[#333333] mt-1">{desc}</p>
  </a>
);

export default DocumentationIndex;
