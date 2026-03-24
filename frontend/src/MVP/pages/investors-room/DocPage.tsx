/**
 * Investors Room - Document Page Template
 * Reusable template for all investor documents with PDF download, print, TOC, and sidebar
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Card from '../../components/Card';

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
    { id: 'all', name: 'All Documents', link: '/investors-room', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    )},
    { id: 'onboarding', name: 'Onboarding', link: '/investors-room?category=onboarding', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { id: 'offerings', name: 'Asset Offerings', link: '/investors-room?category=offerings', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { id: 'reporting', name: 'Ongoing Reporting', link: '/investors-room?category=reporting', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { id: 'legal', name: 'Legal & Compliance', link: '/investors-room?category=legal', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    )},
    { id: 'educational', name: 'Educational', link: '/investors-room?category=educational', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { id: 'templates', name: 'Templates', link: '/investors-room?category=templates', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    )},
  ];

  const getCategoryColor = (id: string) => {
    const colors: Record<string, string> = {
      all: 'bg-green-100 text-green-700',
      onboarding: 'bg-blue-100 text-blue-700',
      offerings: 'bg-green-100 text-green-700',
      reporting: 'bg-purple-100 text-purple-700',
      legal: 'bg-amber-100 text-amber-700',
      educational: 'bg-teal-100 text-teal-700',
      templates: 'bg-pink-100 text-pink-700',
    };
    return colors[id] || colors.all;
  };

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
      <div className="no-print bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <a href="/investors-room" className="text-gray-600 hover:text-green-600 font-medium">
                Investors Room
              </a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 font-medium">{category}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-bold">{title}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-green-600 hover:text-white text-gray-700 font-medium rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all"
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
        <aside className="sidebar no-print hidden lg:block w-64 flex-shrink-0 sticky top-32">
          <div className="sticky top-8">
            <Card className="p-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Categories
              </h3>
              <nav className="space-y-2">
                {categories.map((cat) => {
                  const isActive = categoryId === cat.id || (categoryId === 'all' && cat.id === 'all');
                  const colorClass = getCategoryColor(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => navigate(cat.link)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? colorClass
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={isActive ? '' : 'text-gray-400'}>
                          {cat.icon}
                        </span>
                        <span>{cat.name}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="sidebar no-print lg:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="w-64 bg-white h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Categories
                  </h3>
                  <button onClick={() => setSidebarOpen(false)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <nav className="space-y-2">
                  {categories.map((cat) => {
                    const isActive = categoryId === cat.id || (categoryId === 'all' && cat.id === 'all');
                    const colorClass = getCategoryColor(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { navigate(cat.link); setSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? colorClass
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={isActive ? '' : 'text-gray-400'}>
                            {cat.icon}
                          </span>
                          <span>{cat.name}</span>
                        </div>
                      </button>
                    );
                  })}
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
              <div className="border-b-2 border-gray-200 pb-8 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
                    {category}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">Updated: {lastUpdated}</span>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                  {title}
                </h1>
              </div>

              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="bg-gray-50 border-l-4 border-green-600 p-6 rounded-r-lg mb-8">
                  <h2 className="text-lg font-extrabold text-gray-900 mb-4">Table of Contents</h2>
                  <nav className="space-y-2">
                    {tableOfContents.map((toc) => (
                      <a
                        key={toc.id}
                        href={`#${toc.id}`}
                        className="block text-gray-700 hover:text-green-600 font-medium transition-colors"
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
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Investors Room
              </a>
              <a
                href="/select-role"
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all"
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
