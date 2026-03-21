/**
 * Investors Room Documentation Portal
 *
 * Document portal with 23 documents across 6 categories.
 * Features: Full-text search, category filtering, featured documents, document modal.
 *
 * @reference 08_DEEP_DIVE_INVESTORS_ROOM.md Section 2
 * @reference 02_MVP_IMPLEMENTATION_PLAN.md Phase 4
 *
 * Route: /investors-room
 *
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';

// Document types
interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  description: string;
  date: string;
  size: string;
  tags: string[];
  isFeatured: boolean;
  downloadUrl?: string;
}

type DocumentCategory = 'onboarding' | 'offerings' | 'reporting' | 'legal' | 'educational' | 'templates';

interface Category {
  id: DocumentCategory;
  name: string;
  icon: React.ReactNode;
  color: string;
}

// Categories configuration
const categories: Category[] = [
  {
    id: 'onboarding',
    name: 'Onboarding',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'blue',
  },
  {
    id: 'offerings',
    name: 'Asset Offerings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'green',
  },
  {
    id: 'reporting',
    name: 'Ongoing Reporting',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'purple',
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    color: 'amber',
  },
  {
    id: 'educational',
    name: 'Educational',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'teal',
  },
  {
    id: 'templates',
    name: 'Templates',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    color: 'pink',
  },
];

// All documents (35 total)
const allDocuments: Document[] = [
  // Executive (8)
  {
    id: 'DOC-026',
    title: 'Investor Pitch Deck',
    category: 'offerings',
    description: 'Investment presentation deck for institutional investors and family offices.',
    date: '2026-03-21',
    size: '4.5 MB',
    tags: ['pitch', 'presentation', 'investment', 'institutional'],
    isFeatured: true,
  },
  {
    id: 'DOC-027',
    title: 'Due Diligence Questionnaire',
    category: 'offerings',
    description: 'Standard DDQ for institutional investors conducting due diligence.',
    date: '2026-03-21',
    size: '3.2 MB',
    tags: ['ddq', 'due-diligence', 'institutional', 'questionnaire'],
    isFeatured: true,
  },
  {
    id: 'DOC-028',
    title: 'Investment Case Studies',
    category: 'offerings',
    description: 'Real-world investment examples and performance case studies.',
    date: '2026-03-21',
    size: '2.4 MB',
    tags: ['case-studies', 'examples', 'performance'],
    isFeatured: false,
  },
  {
    id: 'DOC-029',
    title: 'Impact Report',
    category: 'reporting',
    description: 'Social and economic impact report on African SME financing.',
    date: '2026-03-21',
    size: '5.6 MB',
    tags: ['impact', 'esg', 'social', 'africa'],
    isFeatured: true,
  },
  // Onboarding (5)
  {
    id: 'DOC-001',
    title: 'Investor Information Memorandum',
    category: 'onboarding',
    description: 'Comprehensive guide to investing in Ujamaa DeFi Platform, including pool families, yield mechanics, and risk factors.',
    date: '2026-03-01',
    size: '2.4 MB',
    tags: ['investor', 'overview', 'getting-started'],
    isFeatured: true,
  },
  {
    id: 'DOC-002',
    title: 'KYC/AML Requirements Guide',
    category: 'onboarding',
    description: 'Know Your Customer and Anti-Money Laundering requirements for investor verification.',
    date: '2026-03-01',
    size: '856 KB',
    tags: ['kyc', 'aml', 'compliance', 'verification'],
    isFeatured: false,
  },
  {
    id: 'DOC-003',
    title: 'Accreditation Requirements',
    category: 'onboarding',
    description: 'Criteria for accredited investor status and institutional investment thresholds.',
    date: '2026-03-01',
    size: '432 KB',
    tags: ['accreditation', 'institutional', 'requirements'],
    isFeatured: false,
  },
  {
    id: 'DOC-004',
    title: 'Jurisdiction Eligibility Guide',
    category: 'onboarding',
    description: 'List of allowed and blocked jurisdictions, compliance requirements by country.',
    date: '2026-03-01',
    size: '654 KB',
    tags: ['jurisdiction', 'compliance', 'blocked', 'allowed'],
    isFeatured: true,
  },
  {
    id: 'DOC-005',
    title: 'Fee Schedule',
    category: 'onboarding',
    description: 'Complete fee structure: management fees, performance fees, FX fees, and withdrawal limits.',
    date: '2026-03-01',
    size: '324 KB',
    tags: ['fees', 'pricing', 'schedule'],
    isFeatured: false,
  },
  
  // Asset Offerings (3)
  {
    id: 'DOC-006',
    title: 'Term Sheet Template',
    category: 'offerings',
    description: 'Standard term sheet for industrial financing operations.',
    date: '2026-03-05',
    size: '567 KB',
    tags: ['term-sheet', 'template', 'financing'],
    isFeatured: false,
  },
  {
    id: 'DOC-007',
    title: 'Investment Memorandum',
    category: 'offerings',
    description: 'Standard investment memorandum for asset offerings including terms, risks, and projections.',
    date: '2026-03-05',
    size: '1.2 MB',
    tags: ['offering', 'investment', 'memorandum'],
    isFeatured: false,
  },
  {
    id: 'DOC-008',
    title: 'Risk Disclosure Memorandum',
    category: 'offerings',
    description: 'Comprehensive risk disclosures for all pool families and asset classes.',
    date: '2026-03-05',
    size: '892 KB',
    tags: ['risk', 'disclosure', 'warnings'],
    isFeatured: true,
  },
  
  // Ongoing Reporting (3)
  {
    id: 'DOC-009',
    title: 'Q1 2026 Quarterly Report',
    category: 'reporting',
    description: 'First quarter 2026 performance report including NAV, yield distribution, and portfolio composition.',
    date: '2026-04-15',
    size: '3.2 MB',
    tags: ['quarterly', 'report', 'performance', 'q1-2026'],
    isFeatured: false,
  },
  {
    id: 'DOC-010',
    title: 'Annual Report 2025',
    category: 'reporting',
    description: 'Full year 2025 audited financial statements and performance metrics.',
    date: '2026-02-28',
    size: '5.8 MB',
    tags: ['annual', 'report', 'audited', '2025'],
    isFeatured: true,
  },
  {
    id: 'DOC-011',
    title: 'NAV Statements',
    category: 'reporting',
    description: 'Net Asset Value statements and yield distribution notices.',
    date: '2026-03-01',
    size: '234 KB',
    tags: ['nav', 'yield', 'statements', 'distribution'],
    isFeatured: false,
  },
  
  // Legal & Compliance (4)
  {
    id: 'DOC-012',
    title: 'Terms of Service',
    category: 'legal',
    description: 'Platform terms of service, user obligations, and liability limitations.',
    date: '2026-03-01',
    size: '1.1 MB',
    tags: ['terms', 'legal', 'service'],
    isFeatured: true,
  },
  {
    id: 'DOC-013',
    title: 'Privacy Policy',
    category: 'legal',
    description: 'Data privacy policy compliant with GDPR and applicable regulations.',
    date: '2026-03-01',
    size: '678 KB',
    tags: ['privacy', 'gdpr', 'data-protection'],
    isFeatured: false,
  },
  {
    id: 'DOC-014',
    title: 'Risk Acknowledgment Form',
    category: 'legal',
    description: 'Investor risk acknowledgment and waiver form.',
    date: '2026-03-01',
    size: '445 KB',
    tags: ['risk', 'acknowledgment', 'waiver', 'form'],
    isFeatured: false,
  },
  {
    id: 'DOC-015',
    title: 'Sanctions Declaration',
    category: 'legal',
    description: 'OFAC, UN, EU sanctions compliance declaration form.',
    date: '2026-03-01',
    size: '356 KB',
    tags: ['sanctions', 'ofac', 'compliance', 'declaration'],
    isFeatured: false,
  },
  
  // Educational (10)
  {
    id: 'DOC-016',
    title: 'Tokenization Guide',
    category: 'educational',
    description: 'Educational guide explaining real-world asset tokenization on blockchain.',
    date: '2026-03-10',
    size: '1.5 MB',
    tags: ['tokenization', 'education', 'blockchain', 'how-it-works'],
    isFeatured: false,
  },
  {
    id: 'DOC-017',
    title: 'DeFi Basics',
    category: 'educational',
    description: 'Introduction to decentralized finance and how Ujamaa works.',
    date: '2026-03-10',
    size: '892 KB',
    tags: ['defi', 'basics', 'education', 'introduction'],
    isFeatured: false,
  },
  {
    id: 'DOC-033',
    title: 'Understanding ERC-3643',
    category: 'educational',
    description: 'Technical guide to ERC-3643 token standard for regulated securities.',
    date: '2026-03-21',
    size: '2.1 MB',
    tags: ['erc-3643', 'token-standard', 'compliance', 'technical', 'education'],
    isFeatured: true,
  },
  {
    id: 'DOC-018',
    title: 'Risk Management Guide',
    category: 'educational',
    description: 'Guide to understanding and managing investment risks.',
    date: '2026-03-10',
    size: '2.1 MB',
    tags: ['risk', 'management', 'education', 'guide'],
    isFeatured: true,
  },
  {
    id: 'DOC-019',
    title: 'White Paper',
    category: 'educational',
    description: 'Technical white paper explaining the Ujamaa DeFi Platform.',
    date: '2026-03-10',
    size: '3.5 MB',
    tags: ['whitepaper', 'technical', 'platform'],
    isFeatured: true,
  },
  {
    id: 'DOC-020',
    title: 'Executive Summary',
    category: 'educational',
    description: 'Executive summary of the Ujamaa DeFi Platform and investment opportunity.',
    date: '2026-03-10',
    size: '567 KB',
    tags: ['executive', 'summary', 'overview'],
    isFeatured: false,
  },
  {
    id: 'DOC-024',
    title: 'Token Comparison Guide',
    category: 'educational',
    description: 'Complete comparison of UAT, UPT, and UGT tokens - understand the differences and choose the right token.',
    date: '2026-03-21',
    size: '2.8 MB',
    tags: ['tokens', 'uat', 'upt', 'ugt', 'comparison', 'education'],
    isFeatured: true,
  },
  {
    id: 'DOC-025',
    title: 'Investor FAQ',
    category: 'educational',
    description: 'Frequently asked questions about investing in Ujamaa DeFi Platform.',
    date: '2026-03-21',
    size: '1.2 MB',
    tags: ['faq', 'questions', 'answers', 'investor'],
    isFeatured: true,
  },
  {
    id: 'DOC-031',
    title: 'Documentation Index',
    category: 'educational',
    description: 'Complete index of all investor documents available on the platform.',
    date: '2026-03-21',
    size: '456 KB',
    tags: ['index', 'catalog', 'documents'],
    isFeatured: false,
  },
  {
    id: 'DOC-032',
    title: 'Documentation Navigator',
    category: 'educational',
    description: 'Find the right document for your investment stage and needs.',
    date: '2026-03-21',
    size: '678 KB',
    tags: ['navigator', 'guide', 'decision-tree'],
    isFeatured: false,
  },

  // Templates (3)
  {
    id: 'DOC-021',
    title: 'Term Sheet Template',
    category: 'templates',
    description: 'Standard term sheet template for pool investments.',
    date: '2026-03-15',
    size: '1.8 MB',
    tags: ['term-sheet', 'template', 'investment'],
    isFeatured: false,
  },
  {
    id: 'DOC-022',
    title: 'Investment Agreement Template',
    category: 'templates',
    description: 'Standard investment agreement template for pool subscriptions.',
    date: '2026-03-15',
    size: '956 KB',
    tags: ['investment', 'agreement', 'template', 'subscription'],
    isFeatured: false,
  },
  {
    id: 'DOC-023',
    title: 'Subscription Form',
    category: 'templates',
    description: 'Subscription form for pool investment applications.',
    date: '2026-03-15',
    size: '445 KB',
    tags: ['subscription', 'form', 'application', 'investment'],
    isFeatured: false,
  },
];

const InvestorsRoom: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>(
    urlCategory as DocumentCategory | 'all' || 'all'
  );
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Update selected category when URL changes
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory as DocumentCategory);
    }
  }, [urlCategory]);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return allDocuments.filter((doc) => {
      // Category filter
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(query);
        const matchesDescription = doc.description.toLowerCase().includes(query);
        const matchesTags = doc.tags.some(tag => tag.toLowerCase().includes(query));
        
        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return false;
        }
      }
      
      return true;
    });
  }, [searchQuery, selectedCategory]);

  // Featured documents
  const featuredDocuments = useMemo(() => {
    return allDocuments.filter(doc => doc.isFeatured).slice(0, 6);
  }, []);

  // Document count by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach(cat => {
      counts[cat.id] = allDocuments.filter(doc => doc.category === cat.id).length;
    });
    return counts;
  }, []);

  // Document to route mapping - matches actual document component titles
  const documentRoutes: Record<string, string> = {
    // Executive & Core
    'White Paper': '/investors-room/white-paper',
    'Executive Summary': '/investors-room/executive-summary',
    'Investment Memorandum': '/investors-room/investment-memorandum',
    'Investor Pitch Deck': '/investors-room/investor-pitch-deck',
    'Due Diligence Questionnaire': '/investors-room/due-diligence-questionnaire',
    'Investment Case Studies': '/investors-room/investment-case-studies',
    'Impact Report': '/investors-room/impact-report',
    'Documentation Index': '/investors-room/documentation-index',
    'Documentation Navigator': '/investors-room/investor-documentation-navigator',

    // Legal & Compliance
    'Terms of Service': '/investors-room/terms-of-service',
    'Privacy Policy': '/investors-room/privacy-policy',
    'Investor Information Memorandum': '/investors-room/investor-information-memorandum',
    'KYC/AML Requirements Guide': '/investors-room/kyc-aml-guide',
    'Risk Disclosure Memorandum': '/investors-room/risk-disclosure',
    'Risk Acknowledgment Form': '/investors-room/risk-acknowledgment',
    'Sanctions Declaration': '/investors-room/sanctions-declaration',
    'Accreditation Requirements': '/investors-room/accreditation',
    'Jurisdiction Eligibility Guide': '/investors-room/jurisdiction',

    // Fees & Schedule
    'Fee Schedule': '/investors-room/fees',

    // Educational
    'DeFi Basics': '/investors-room/defi-basics',
    'Tokenization Guide': '/investors-room/tokenization',
    'Understanding ERC-3643': '/investors-room/understanding-erc3643',
    'Risk Management Guide': '/investors-room/risk-management',
    'Token Comparison Guide': '/investors-room/token-comparison-guide',
    'Investor FAQ': '/investors-room/investor-faq',

    // Reports
    'Q1 2026 Quarterly Report': '/investors-room/q1-2026-report',
    'Annual Report 2025': '/investors-room/annual-report-2025',
    'NAV Statements': '/investors-room/nav-statements',

    // Templates & Forms
    'Term Sheet Template': '/investors-room/term-sheet',
    'Investment Agreement Template': '/investors-room/investment-agreement',
    'Subscription Form': '/investors-room/subscription-form',
  };

  const handleDocumentClick = (doc: Document) => {
    const route = documentRoutes[doc.title];
    if (route) {
      navigate(route);
    } else {
      // Fallback to modal for unmapped documents
      setSelectedDocument(doc);
      setShowModal(true);
    }
  };

  const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      amber: 'bg-amber-100 text-amber-700 border-amber-200',
      teal: 'bg-teal-100 text-teal-700 border-teal-200',
      pink: 'bg-pink-100 text-pink-700 border-pink-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* MVP Banner */}
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Investors Room</h1>
              <p className="text-gray-600 mt-1">Document Portal - 35 Documents Across 6 Categories</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Documents */}
        {!searchQuery && selectedCategory === 'all' && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleDocumentClick(doc)}
                  className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="success" size="sm">Featured</Badge>
                    <span className="text-xs text-gray-500">{doc.size}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{doc.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{doc.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{doc.date}</span>
                    <span className="text-green-600 text-sm font-medium">View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category Cards */}
        {!searchQuery && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? 'all' : category.id)}
                  className={`
                    p-4 rounded-xl border-2 transition-all
                    ${
                      selectedCategory === category.id
                        ? getCategoryColor(category.color) + ' border-current'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className={`mb-2 ${selectedCategory === category.id ? '' : 'text-gray-400'}`}>
                    {category.icon}
                  </div>
                  <p className="font-medium text-sm">{category.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{categoryCounts[category.id]} documents</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Documents List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Documents' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredDocuments.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">No documents found</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="mt-4 text-green-600 hover:text-green-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredDocuments.map((doc) => (
                <Card
                  key={doc.id}
                  hover
                  onClick={() => handleDocumentClick(doc)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant={
                        doc.category === 'onboarding' ? 'primary' :
                        doc.category === 'offerings' ? 'success' :
                        doc.category === 'reporting' ? 'info' :
                        doc.category === 'legal' ? 'warning' :
                        'secondary'
                      }
                      size="sm"
                    >
                      {categories.find(c => c.id === doc.category)?.name}
                    </Badge>
                    {doc.isFeatured && <Badge variant="success" size="sm">Featured</Badge>}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{doc.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doc.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{doc.date}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDocumentClick(doc); }}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Document Modal */}
      {showModal && selectedDocument && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <Badge
                    variant={
                      selectedDocument.category === 'onboarding' ? 'primary' :
                      selectedDocument.category === 'offerings' ? 'success' :
                      selectedDocument.category === 'reporting' ? 'info' :
                      selectedDocument.category === 'legal' ? 'warning' :
                      'secondary'
                    }
                    size="sm"
                  >
                    {categories.find(c => c.id === selectedDocument.category)?.name}
                  </Badge>
                  <h2 className="text-2xl font-bold text-gray-900 mt-3">{selectedDocument.title}</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{selectedDocument.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Document ID</h3>
                  <p className="font-mono text-sm text-gray-900">{selectedDocument.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">File Size</h3>
                  <p className="text-sm text-gray-900">{selectedDocument.size}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Date</h3>
                  <p className="text-sm text-gray-900">{selectedDocument.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Category</h3>
                  <p className="text-sm text-gray-900">
                    {categories.find(c => c.id === selectedDocument.category)?.name}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex gap-3">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
                <button className="flex-1 border border-gray-300 hover:bg-gray-100 font-medium py-3 px-4 rounded-lg transition-colors">
                  Preview
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                🚀 MVP TESTNET: Document download is simulated for testnet
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            🚀 MVP: Institutional Architecture - Testnet Release • 22 Documents • 6 Categories
          </p>
        </div>
      </footer>
    </div>
  );
};

export default InvestorsRoom;
