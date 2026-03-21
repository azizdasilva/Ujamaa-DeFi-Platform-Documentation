/**
 * Investor Documentation Navigator
 * Helps users find the right document for their needs
 */

import React from 'react';
import DocPage from './DocPage';

const InvestorDocumentationNavigator: React.FC = () => {
  return (
    <DocPage
      title="Investor Documentation Navigator"
      category="00_EXECUTIVE"
      categoryId="02"
      lastUpdated="March 21, 2026"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-[#023D7A] mb-6">Find the Right Document</h2>
          <p className="text-[#333333] leading-relaxed mb-6">
            Use this navigator to find the perfect document for your investment journey.
          </p>
        </section>

        {/* By Investor Stage */}
        <section className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#48A9F0]/30">
          <h3 className="text-2xl font-bold text-[#023D7A] mb-4">📍 By Investment Stage</h3>
          
          <div className="space-y-6">
            <StageSection 
              stage="1. First-Time Visitor"
              description="Just learning about Ujamaa DeFi"
              documents={[
                { name: 'Executive Summary', href: '/investors-room/executive-summary', time: '10 min' },
                { name: 'Investor Pitch Deck', href: '/investors-room/investor-pitch-deck', time: '15 min' },
                { name: 'How Tokenization Works', href: '/investors-room/tokenization-guide', time: '20 min' },
              ]}
            />
            
            <StageSection 
              stage="2. Evaluating Investment"
              description="Ready to learn more details"
              documents={[
                { name: 'Investment Memorandum', href: '/investors-room/investment-memorandum', time: '30 min' },
                { name: 'White Paper', href: '/investors-room/white-paper', time: '45 min' },
                { name: 'Token Comparison Guide', href: '/investors-room/token-comparison-guide', time: '25 min' },
                { name: 'Due Diligence Questionnaire', href: '/investors-room/due-diligence-questionnaire', time: '40 min' },
              ]}
            />
            
            <StageSection 
              stage="3. Onboarding"
              description="Ready to invest"
              documents={[
                { name: 'Investor Information Memorandum', href: '/investors-room/investor-information-memorandum', time: '30 min' },
                { name: 'KYC/AML Guide', href: '/investors-room/kyc-aml-guide', time: '15 min' },
                { name: 'Accreditation Requirements', href: '/investors-room/accreditation-requirements', time: '10 min' },
                { name: 'Jurisdiction Eligibility', href: '/investors-room/jurisdiction-eligibility', time: '10 min' },
                { name: 'Fee Schedule', href: '/investors-room/fee-schedule', time: '5 min' },
              ]}
            />
            
            <StageSection 
              stage="4. Making Investment"
              description="Completing subscription"
              documents={[
                { name: 'Term Sheet', href: '/investors-room/term-sheet', time: '15 min' },
                { name: 'Subscription Form', href: '/investors-room/subscription-form', time: '20 min' },
                { name: 'Risk Acknowledgment Form', href: '/investors-room/risk-acknowledgment-form', time: '10 min' },
                { name: 'Sanctions Declaration', href: '/investors-room/sanctions-declaration', time: '5 min' },
              ]}
            />
            
            <StageSection 
              stage="5. Active Investor"
              description="Monitoring your investments"
              documents={[
                { name: 'Quarterly Reports', href: '/investors-room/quarterly-report', time: '20 min' },
                { name: 'Annual Report', href: '/investors-room/annual-report-2025', time: '30 min' },
                { name: 'NAV Statements', href: '/investors-room/nav-statements', time: '10 min' },
                { name: 'Distribution Notices', href: '/investors-room/distribution-notice', time: '5 min' },
              ]}
            />
          </div>
        </section>

        {/* By Document Type */}
        <section className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#48A9F0]/30">
          <h3 className="text-2xl font-bold text-[#023D7A] mb-4">📄 By Document Type</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TypeSection 
              type="Educational"
              icon="🎓"
              documents={[
                { name: 'How Tokenization Works', href: '/investors-room/tokenization-guide' },
                { name: 'Understanding ERC-3643', href: '/investors-room/defi-basics' },
                { name: 'Token Comparison Guide', href: '/investors-room/token-comparison-guide' },
                { name: 'Investor FAQ', href: '/investors-room/investor-faq' },
              ]}
            />
            
            <TypeSection 
              type="Legal & Compliance"
              icon="⚖️"
              documents={[
                { name: 'Terms of Service', href: '/investors-room/terms-of-service' },
                { name: 'Privacy Policy', href: '/investors-room/privacy-policy' },
                { name: 'Risk Disclosure Memorandum', href: '/investors-room/risk-disclosure-memorandum' },
                { name: 'Sanctions Declaration', href: '/investors-room/sanctions-declaration' },
              ]}
            />
            
            <TypeSection 
              type="Investment Analysis"
              icon="📊"
              documents={[
                { name: 'Investment Memorandum', href: '/investors-room/investment-memorandum' },
                { name: 'White Paper', href: '/investors-room/white-paper' },
                { name: 'Due Diligence Questionnaire', href: '/investors-room/due-diligence-questionnaire' },
                { name: 'Investment Case Studies', href: '/investors-room/investment-case-studies' },
              ]}
            />
            
            <TypeSection 
              type="Reporting"
              icon="📈"
              documents={[
                { name: 'Quarterly Reports', href: '/investors-room/quarterly-report' },
                { name: 'Annual Report', href: '/investors-room/annual-report-2025' },
                { name: 'Impact Report', href: '/investors-room/impact-report' },
                { name: 'NAV Statements', href: '/investors-room/nav-statements' },
              ]}
            />
          </div>
        </section>

        {/* Quick Decision Tree */}
        <section className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-4">🔍 Quick Decision Tree</h3>
          <div className="space-y-4">
            <DecisionNode 
              question="Are you new to Ujamaa DeFi?"
              yesLink={{ text: 'Start with Executive Summary', href: '/investors-room/executive-summary' }}
              noLink={{ text: 'Go to Documentation Index', href: '/investors-room/documentation-index' }}
            />
            <DecisionNode 
              question="Ready to evaluate investment?"
              yesLink={{ text: 'Read Investment Memorandum', href: '/investors-room/investment-memorandum' }}
              noLink={{ text: 'Browse Educational Materials', href: '/investors-room/tokenization-guide' }}
            />
            <DecisionNode 
              question="Ready to invest?"
              yesLink={{ text: 'Start Onboarding', href: '/investors-room/investor-information-memorandum' }}
              noLink={{ text: 'Review Case Studies', href: '/investors-room/investment-case-studies' }}
            />
          </div>
        </section>
      </div>
    </DocPage>
  );
};

interface StageSectionProps {
  stage: string;
  description: string;
  documents: { name: string; href: string; time: string }[];
}

const StageSection: React.FC<StageSectionProps> = ({ stage, description, documents }) => (
  <div className="border-l-4 border-[#00A8A8] pl-4">
    <h4 className="text-lg font-bold text-[#023D7A]">{stage}</h4>
    <p className="text-sm text-[#333333] mb-3">{description}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {documents.map((doc, idx) => (
        <a key={idx} href={doc.href} className="flex justify-between items-center p-2 bg-[#F3F8FA] rounded hover:bg-[#023D7A]/10 transition-colors">
          <span className="text-sm font-medium text-[#023D7A]">{doc.name}</span>
          <span className="text-xs text-[#333333]/60">{doc.time}</span>
        </a>
      ))}
    </div>
  </div>
);

interface TypeSectionProps {
  type: string;
  icon: string;
  documents: { name: string; href: string }[];
}

const TypeSection: React.FC<TypeSectionProps> = ({ type, icon, documents }) => (
  <div>
    <h4 className="text-lg font-bold text-[#023D7A] mb-3">{icon} {type}</h4>
    <div className="space-y-2">
      {documents.map((doc, idx) => (
        <a key={idx} href={doc.href} className="block p-2 bg-[#F3F8FA] rounded hover:bg-[#023D7A]/10 transition-colors text-sm text-[#023D7A]">
          {doc.name}
        </a>
      ))}
    </div>
  </div>
);

interface DecisionNodeProps {
  question: string;
  yesLink: { text: string; href: string };
  noLink: { text: string; href: string };
}

const DecisionNode: React.FC<DecisionNodeProps> = ({ question, yesLink, noLink }) => (
  <div className="bg-white/10 rounded-lg p-4">
    <p className="font-bold mb-3">{question}</p>
    <div className="flex flex-wrap gap-4">
      <a href={yesLink.href} className="px-4 py-2 bg-white text-[#023D7A] rounded-lg font-bold hover:bg-[#F3F8FA] transition-colors">
        ✅ {yesLink.text}
      </a>
      <a href={noLink.href} className="px-4 py-2 bg-white/20 text-white rounded-lg font-bold hover:bg-white/30 transition-colors">
        ❌ {noLink.text}
      </a>
    </div>
  </div>
);

export default InvestorDocumentationNavigator;
