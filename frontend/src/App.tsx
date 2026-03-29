/**
 * Ujamaa DeFi Platform - Main Application
 * MVP Testnet Release
 *
 * @reference 04_DESIGN_SYSTEM_SPECIFICATION.md
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

// Wagmi Configuration
import { config as wagmiConfig } from './lib/wagmi';

// MVP Components
import { MVPBanner } from './MVP/components';
import Navigation from './MVP/components/Navigation';
import Footer from './MVP/components/Footer';

// Institutional Pages
import DeepDive from './MVP/pages/institutional/DeepDive';
import InvestorsRoom from './MVP/pages/institutional/InvestorsRoom';
import InstitutionalDashboard from './MVP/pages/institutional/Dashboard';
import PoolMarketplace from './MVP/pages/institutional/PoolMarketplace';

// Landing Page
import LandingPage from './MVP/pages/LandingPage';

// Role-Specific Dashboards
import RetailDashboard from './MVP/pages/retail/Dashboard';
import OriginatorDashboard from './MVP/pages/originator/Dashboard';
import ComplianceDashboard from './MVP/pages/compliance/Dashboard';
import AdminDashboard from './MVP/pages/admin/Dashboard';
import RegulatorDashboard from './MVP/pages/regulator/Dashboard';

// Onboarding Flow
import OnboardingWelcome from './MVP/pages/onboarding/Welcome';
import OnboardingPersonal from './MVP/pages/onboarding/Personal';
import OnboardingDocuments from './MVP/pages/onboarding/Documents';
import OnboardingReview from './MVP/pages/onboarding/Review';
import OnboardingComplete from './MVP/pages/onboarding/Complete';

// Industrial Operator Pages
import IndustrialOperatorWelcome from './MVP/pages/industrial-operator/OnboardingWelcome';
import IndustrialOperatorFinancings from './MVP/pages/industrial-operator/Financings';

// Asset Tokenization (Originator)
import AssetSubmission from './MVP/pages/originator/AssetSubmission';
import AssetCertificates from './MVP/pages/originator/AssetCertificates';

// Compliance Pages
import ComplianceKYCReview from './MVP/pages/compliance/KYCReview';

// Pool Dashboard
import PoolDashboard from './MVP/pages/pool/Dashboard';

// Documentation Pages
import DocsHome from './MVP/pages/docs/DocsHome';
import WhitePaper from './MVP/pages/docs/WhitePaper';
import Glossary from './MVP/pages/docs/Glossary';

// Investors Room Pages
import IRWhitePaper from './MVP/pages/investors-room/WhitePaper';
import IRExecutiveSummary from './MVP/pages/investors-room/ExecutiveSummary';
import IRInvestmentMemorandum from './MVP/pages/investors-room/InvestmentMemorandum';
import IRTermsOfService from './MVP/pages/investors-room/TermsOfService';
import IRPrivacyPolicy from './MVP/pages/investors-room/PrivacyPolicy';
import IRInvestorInformationMemorandum from './MVP/pages/investors-room/InvestorInformationMemorandum';
import IRKYCAMLGuide from './MVP/pages/investors-room/KYCAMLGuide';
import IRRiskDisclosureMemorandum from './MVP/pages/investors-room/RiskDisclosureMemorandum';
import IRRiskAcknowledgmentForm from './MVP/pages/investors-room/RiskAcknowledgmentForm';
import IRSanctionsDeclaration from './MVP/pages/investors-room/SanctionsDeclaration';
import IRAccreditationRequirements from './MVP/pages/investors-room/AccreditationRequirements';
import IRJurisdictionEligibilityGuide from './MVP/pages/investors-room/JurisdictionEligibilityGuide';
import IRFeeSchedule from './MVP/pages/investors-room/FeeSchedule';
import IRDeFiBasics from './MVP/pages/investors-room/DeFiBasics';
import IRTokenizationGuide from './MVP/pages/investors-room/TokenizationGuide';
import IRRiskManagementGuide from './MVP/pages/investors-room/RiskManagementGuide';
import IRQ12026QuarterlyReport from './MVP/pages/investors-room/Q12026QuarterlyReport';
import IRAnnualReport2025 from './MVP/pages/investors-room/AnnualReport2025';
import IRNAVStatements from './MVP/pages/investors-room/NAVStatements';
import IRTermSheetTemplate from './MVP/pages/investors-room/TermSheetTemplate';
import IRInvestmentAgreement from './MVP/pages/investors-room/InvestmentAgreement';
import IRSubscriptionForm from './MVP/pages/investors-room/SubscriptionForm';
// New Investors Room Pages
import IRDocumentationIndex from './MVP/pages/investors-room/DocumentationIndex';
import IRDocumentationNavigator from './MVP/pages/investors-room/InvestorDocumentationNavigator';
import IRPitchDeck from './MVP/pages/investors-room/InvestorPitchDeck';
import IRDDQ from './MVP/pages/investors-room/DueDiligenceQuestionnaire';
import IRCaseStudies from './MVP/pages/investors-room/InvestmentCaseStudies';
import IRImpactReport from './MVP/pages/investors-room/ImpactReport';
import IRFAQ from './MVP/pages/investors-room/InvestorFAQ';
import IRTokenComparison from './MVP/pages/investors-room/TokenComparisonGuide';
import IREthereumERC3643 from './MVP/pages/investors-room/UnderstandingERC3643';
import IRReinvestmentSettings from './MVP/pages/investors-room/ReinvestmentSettings';

// Investor Pages
import InvestorPortfolio from './MVP/pages/investor/Portfolio';
import InvestorReturns from './MVP/pages/investor/Returns';
import InvestorRecurringInvestment from './MVP/pages/investor/RecurringInvestment';
import TestnetGuide from './MVP/pages/TestnetGuide';

// Contract Test Dashboard
import ContractTestDashboard from './MVP/pages/ContractTestDashboard';

// Ujamaa Monitor Dashboard
import MonitorDashboard from './pages/monitor';

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * Main App Component
 */
const App: React.FC = () => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-[#F3F8FA] flex flex-col">
            {/* Global MVP Banner - Shows once for 10 seconds */}
            <MVPBanner />

            {/* Modern Navigation */}
            <Navigation />

            {/* Routes */}
            <Routes>
            {/* Default - Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Role Selection Page */}
            <Route path="/select-role" element={<RoleSelection />} />

            {/* Institutional Investor Routes */}
            <Route path="/institutional/dashboard" element={<InstitutionalDashboard />} />
            <Route path="/institutional/pools" element={<PoolMarketplace />} />
            
            {/* Retail Investor Routes */}
            <Route path="/retail/dashboard" element={<RetailDashboard />} />
            <Route path="/retail/pools" element={<PoolMarketplace />} />
            
            {/* Industrial Operator Routes */}
            <Route path="/originator/dashboard" element={<OriginatorDashboard />} />
            <Route path="/originator/assets/submit" element={<AssetSubmission />} />
            <Route path="/originator/assets/certificates" element={<AssetCertificates />} />
            
            {/* Compliance Officer Routes */}
            <Route path="/compliance/dashboard" element={<ComplianceDashboard />} />
            <Route path="/compliance/kyc-review" element={<ComplianceKYCReview />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Regulator Routes (Read-Only) */}
            <Route path="/regulator/dashboard" element={<RegulatorDashboard />} />

            {/* Investor Routes */}
            <Route path="/investor/portfolio" element={<InvestorPortfolio />} />
            <Route path="/investor/returns" element={<InvestorReturns />} />
            <Route path="/investor/recurring-investment" element={<InvestorRecurringInvestment />} />
            <Route path="/pool/dashboard" element={<PoolDashboard />} />

            {/* Industrial Operator Routes */}
            <Route path="/industrial-operator/onboarding" element={<IndustrialOperatorWelcome />} />
            <Route path="/industrial-operator/financings" element={<IndustrialOperatorFinancings />} />

            {/* P1 Features - Deep Dive & Investors Room */}
            <Route path="/deep-dive" element={<DeepDive />} />
            <Route path="/investors-room" element={<InvestorsRoom />} />
            
            {/* Onboarding Flow (5 steps) */}
            <Route path="/onboarding" element={<OnboardingWelcome />} />
            <Route path="/investor/onboarding" element={<OnboardingWelcome />} />
            <Route path="/investor/onboarding/:type/personal" element={<OnboardingPersonal />} />
            <Route path="/investor/onboarding/:type/documents" element={<OnboardingDocuments />} />
            <Route path="/investor/onboarding/:type/review" element={<OnboardingReview />} />
            <Route path="/investor/onboarding/:type/complete" element={<OnboardingComplete />} />
            <Route path="/industrial-operator/onboarding/:type/company" element={<OnboardingPersonal />} />
            <Route path="/industrial-operator/onboarding/:type/documents" element={<OnboardingDocuments />} />
            <Route path="/industrial-operator/onboarding/:type/review" element={<OnboardingReview />} />
            <Route path="/industrial-operator/onboarding/:type/complete" element={<OnboardingComplete />} />
            <Route path="/onboarding/:type/personal" element={<OnboardingPersonal />} />
            <Route path="/onboarding/:type/documents" element={<OnboardingDocuments />} />
            <Route path="/onboarding/:type/review" element={<OnboardingReview />} />
            <Route path="/onboarding/:type/complete" element={<OnboardingComplete />} />

            {/* Catch all - redirect to role selection */}
            <Route path="*" element={<Navigate to="/select-role" replace />} />

            {/* Documentation Routes */}
            <Route path="/docs/README.md" element={<DocsHome />} />
            <Route path="/docs/white-paper" element={<WhitePaper />} />
            <Route path="/docs/glossary" element={<Glossary />} />

            {/* Investors Room Routes */}
            <Route path="/investors-room" element={<InvestorsRoom />} />
            <Route path="/investors-room/white-paper" element={<IRWhitePaper />} />
            <Route path="/investors-room/executive-summary" element={<IRExecutiveSummary />} />
            <Route path="/investors-room/documentation-index" element={<IRDocumentationIndex />} />
            <Route path="/investors-room/investor-documentation-navigator" element={<IRDocumentationNavigator />} />
            <Route path="/investors-room/investor-pitch-deck" element={<IRPitchDeck />} />
            <Route path="/investors-room/investment-memorandum" element={<IRInvestmentMemorandum />} />
            <Route path="/investors-room/due-diligence-questionnaire" element={<IRDDQ />} />
            <Route path="/investors-room/investment-case-studies" element={<IRCaseStudies />} />
            <Route path="/investors-room/impact-report" element={<IRImpactReport />} />
            <Route path="/investors-room/investor-faq" element={<IRFAQ />} />
            <Route path="/investors-room/token-comparison-guide" element={<IRTokenComparison />} />
            <Route path="/investors-room/terms-of-service" element={<IRTermsOfService />} />
            <Route path="/investors-room/privacy-policy" element={<IRPrivacyPolicy />} />
            <Route path="/investors-room/investor-information-memorandum" element={<IRInvestorInformationMemorandum />} />
            <Route path="/investors-room/kyc-aml-guide" element={<IRKYCAMLGuide />} />
            <Route path="/investors-room/risk-disclosure" element={<IRRiskDisclosureMemorandum />} />
            <Route path="/investors-room/risk-acknowledgment" element={<IRRiskAcknowledgmentForm />} />
            <Route path="/investors-room/sanctions-declaration" element={<IRSanctionsDeclaration />} />
            <Route path="/investors-room/accreditation" element={<IRAccreditationRequirements />} />
            <Route path="/investors-room/jurisdiction" element={<IRJurisdictionEligibilityGuide />} />
            <Route path="/investors-room/fees" element={<IRFeeSchedule />} />
            <Route path="/investors-room/defi-basics" element={<IRDeFiBasics />} />
            <Route path="/investors-room/tokenization" element={<IRTokenizationGuide />} />
            <Route path="/investors-room/understanding-erc3643" element={<IREthereumERC3643 />} />
            <Route path="/investors-room/reinvestment-settings" element={<IRReinvestmentSettings />} />
            <Route path="/investors-room/risk-management" element={<IRRiskManagementGuide />} />
            <Route path="/investors-room/q1-2026-report" element={<IRQ12026QuarterlyReport />} />
            <Route path="/investors-room/annual-report-2025" element={<IRAnnualReport2025 />} />
            <Route path="/investors-room/nav-statements" element={<IRNAVStatements />} />
            <Route path="/investors-room/term-sheet" element={<IRTermSheetTemplate />} />
            <Route path="/investors-room/investment-agreement" element={<IRInvestmentAgreement />} />
            <Route path="/investors-room/subscription-form" element={<IRSubscriptionForm />} />
            
            {/* Testnet Guide */}
            <Route path="/testnet-guide" element={<TestnetGuide />} />

            {/* Contract Test Dashboard */}
            <Route path="/contract-test" element={<ContractTestDashboard />} />

            {/* Ujamaa Monitor Dashboard */}
            <Route path="/monitor" element={<MonitorDashboard />} />
          </Routes>

          {/* Global Footer */}
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  </WagmiProvider>
  );
};

/**
 * Role Selection Landing Page
 * Allows users to select which role dashboard to view
 */
const RoleSelection: React.FC = () => {
  const roles = [
    {
      id: 'institutional',
      title: 'Institutional Investor',
      description: 'Large-scale investments (€100K+)',
      features: ['KYB Required', 'Dedicated Support', 'Custom Terms'],
      color: 'from-[#023D7A] to-[#00A8A8]',
      icon: '🏦',
      link: '/institutional/dashboard',
    },
    {
      id: 'retail',
      title: 'Retail Investor',
      description: 'Individual investments (€1K - €50K)',
      features: ['Easy Onboarding', 'Educational Content', 'Low Minimum'],
      color: 'from-blue-500 to-purple-500',
      icon: '👤',
      link: '/retail/dashboard',
    },
    {
      id: 'originator',
      title: 'Industrial Operator',
      description: 'Industrial companies seeking financing',
      features: ['Access Capital', 'GDIZ (Benin) Certified', 'Flexible Terms'],
      color: 'from-amber-500 to-orange-500',
      icon: '🏭',
      link: '/originator/dashboard',
    },
    {
      id: 'compliance',
      title: 'Compliance Officer',
      description: 'KYC/KYB approvals and monitoring',
      features: ['KYC Management', 'Transaction Monitoring', 'Reports'],
      color: 'from-purple-500 to-pink-500',
      icon: '✓',
      link: '/compliance/dashboard',
    },
    {
      id: 'admin',
      title: 'Platform Admin',
      description: 'Full platform management',
      features: ['User Management', 'Pool Management', 'Settings'],
      color: 'from-red-500 to-rose-500',
      icon: '⚙️',
      link: '/admin/dashboard',
    },
    {
      id: 'regulator',
      title: 'Regulator',
      description: 'Read-only regulatory oversight',
      features: ['Read-Only Access', 'Compliance Reports', 'Export Data'],
      color: 'from-gray-600 to-gray-800',
      icon: '👁️',
      link: '/regulator/dashboard',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F8FA] to-[#F3F8FA]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ujamaa DeFi Platform
          </h1>
          <p className="text-xl text-white/90 mb-2">
            Institutional DeFi for African Real-World Assets
          </p>
          <p className="text-sm text-white/80">
            🚀 MVP Testnet • No Real Funds
          </p>
        </div>
      </div>

      {/* Role Selection */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#023D7A] mb-4">
            Select Your Role
          </h2>
          <p className="text-[#333333] max-w-2xl mx-auto">
            Choose a role to experience the corresponding dashboard and workflow.
            All roles are fully functional for demonstration purposes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <a
              key={role.id}
              href={role.link}
              className="group block"
            >
              <div className="bg-[#F3F8FA] rounded-2xl p-6 border border-[#48A9F0]/30 shadow-soft hover:shadow-soft-lg hover:border-[#48A9F0]/60 transition-all duration-300 h-full">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {role.icon}
                </div>
                <h3 className="text-xl font-bold text-[#023D7A] mb-2 group-hover:text-[#00A8A8] transition-colors">
                  {role.title}
                </h3>
                <p className="text-[#333333] mb-4">{role.description}</p>
                <ul className="space-y-2">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#023D7A]">
                      <svg className="w-4 h-4 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center text-[#00A8A8] font-medium group-hover:text-[#023D7A]">
                  View Dashboard
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-[#023D7A] mb-4">
            Also Available
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/originator/assets/submit"
              className="px-6 py-3 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              🏭 Asset Tokenization
            </a>
            <a
              href="/originator/assets/certificates"
              className="px-6 py-3 bg-[#F3F8FA] border border-[#48A9F0]/30 rounded-lg text-[#023D7A] font-bold hover:bg-[#023D7A]/5 transition-colors"
            >
              📜 View Certificates
            </a>
            <a
              href="/onboarding"
              className="px-6 py-3 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              🚀 Start Onboarding
            </a>
            <a
              href="/deep-dive"
              className="px-6 py-3 bg-[#F3F8FA] border border-[#48A9F0]/30 rounded-lg text-[#023D7A] font-bold hover:bg-[#023D7A]/5 transition-colors"
            >
              📚 Deep Dive Documentation
            </a>
            <a
              href="/investors-room"
              className="px-6 py-3 bg-[#F3F8FA] border border-[#48A9F0]/30 rounded-lg text-[#023D7A] font-bold hover:bg-[#023D7A]/5 transition-colors"
            >
              📄 Investors Room (30+ Docs)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
