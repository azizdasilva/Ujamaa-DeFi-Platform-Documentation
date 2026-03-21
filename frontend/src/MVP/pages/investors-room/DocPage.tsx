/**
 * Investors Room - Document Page Template
 * Reusable template for all investor documents with PDF download, print, TOC, and sidebar
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';

interface DocPageProps {
  title: string;
  category: string;
  categoryId: string;
  lastUpdated: string;
  children: React.ReactNode;
  tableOfContents?: { id: string; title: string }[];
}

const DocPage: React.FC<DocPageProps> = ({
  title,
  category,
  categoryId,
  lastUpdated,
  children,
  tableOfContents = []
}) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print(); // Browser will offer "Save as PDF" option
  };

  // Document categories for sidebar navigation
  const categories = [
    { id: 'all', name: 'All Documents', icon: '📚', link: '/investors-room' },
    { id: 'onboarding', name: 'Onboarding', icon: '📋', link: '/investors-room?category=onboarding' },
    { id: 'offerings', name: 'Asset Offerings', icon: '📊', link: '/investors-room?category=offerings' },
    { id: 'reporting', name: 'Ongoing Reporting', icon: '📈', link: '/investors-room?category=reporting' },
    { id: 'legal', name: 'Legal & Compliance', icon: '⚖️', link: '/investors-room?category=legal' },
    { id: 'educational', name: 'Educational', icon: '🎓', link: '/investors-room?category=educational' },
    { id: 'templates', name: 'Templates', icon: '📄', link: '/investors-room?category=templates' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F8FA]">
      <Navigation />

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 2cm;
            size: A4;
          }
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .print-content {
            color: #000 !important;
            background: white !important;
            box-shadow: none !important;
          }
          .sidebar {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Action Bar - Hidden on Print */}
      <div className="no-print bg-white border-b border-[#48A9F0]/30 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-[#F3F8FA] rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <a href="/investors-room" className="text-[#023D7A] hover:text-[#00A8A8] font-bold">
                Investors Room
              </a>
              <span className="text-gray-400">/</span>
              <a href={`/investors-room#${categoryId}`} className="text-[#023D7A] hover:text-[#00A8A8] font-bold">
                {category}
              </a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 font-bold">{title}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-[#F3F8FA] hover:bg-[#023D7A] hover:text-white text-[#023D7A] font-bold rounded-lg transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation - Hidden on Print & Mobile */}
        <aside className="sidebar no-print hidden lg:block w-72 bg-white border-r border-[#48A9F0]/30 min-h-screen sticky top-32">
          <div className="p-6">
            <h3 className="text-sm font-extrabold text-[#023D7A] uppercase tracking-wider mb-4">
              Categories
            </h3>
            <nav className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(cat.link)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    categoryId === cat.id || (categoryId === 'all' && cat.id === 'all')
                      ? 'bg-[#023D7A] text-white font-bold'
                      : 'text-[#023D7A] hover:bg-[#F3F8FA] font-bold'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="sidebar no-print lg:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setSidebarOpen(false)}
          >
            <div 
              className="w-72 bg-white h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-extrabold text-[#023D7A]">Categories</h3>
                  <button onClick={() => setSidebarOpen(false)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <nav className="space-y-2">
                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={cat.link}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#023D7A] font-bold hover:bg-[#F3F8FA]"
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 print-container">
          <div className="max-w-5xl mx-auto px-8 py-12">
            <div className="print-content bg-white rounded-2xl shadow-lg p-12">
              {/* Document Header */}
              <div className="border-b-2 border-[#023D7A] pb-8 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#023D7A]/10 text-[#023D7A] text-xs font-bold uppercase tracking-wider rounded-full">
                    {category}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">Updated: {lastUpdated}</span>
                </div>
                <h1 className="text-4xl font-extrabold text-[#023D7A] mb-4">
                  {title}
                </h1>
              </div>

              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="bg-[#F3F8FA] border-l-4 border-[#00A8A8] p-6 rounded-r-lg mb-8">
                  <h2 className="text-lg font-extrabold text-[#023D7A] mb-4">Table of Contents</h2>
                  <nav className="space-y-2">
                    {tableOfContents.map((toc) => (
                      <a
                        key={toc.id}
                        href={`#${toc.id}`}
                        className="block text-[#023D7A] hover:text-[#00A8A8] font-bold transition-colors"
                      >
                        {toc.title}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Document Content */}
              <div className="prose prose-lg max-w-none">
                {children}
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="mt-12 flex items-center justify-between">
              <a
                href="/investors-room"
                className="flex items-center gap-2 text-[#023D7A] hover:text-[#00A8A8] font-bold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Investors Room
              </a>
              <a
                href="/select-role"
                className="flex items-center gap-2 px-6 py-3 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-all duration-300"
              >
                Get Started
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocPage;
