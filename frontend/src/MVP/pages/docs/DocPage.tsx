/**
 * Documentation Page Template
 * Displays markdown documentation with PDF download and print functionality
 */

import React from 'react';
import Navigation from '../../components/Navigation';

interface DocPageProps {
  title: string;
  category: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const DocPage: React.FC<DocPageProps> = ({ title, category, lastUpdated, children }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Trigger print dialog which allows "Save as PDF"
    window.print();
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
          }
        }
      `}</style>

      {/* Action Bar - Hidden on Print */}
      <div className="no-print bg-white border-b border-[#48A9F0]/30 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <a href="/docs/README.md" className="text-[#023D7A] hover:text-[#00A8A8] font-medium">
                Docs
              </a>
              <span className="text-gray-400">/</span>
              <a href={`/docs/${category}/README.md`} className="text-[#023D7A] hover:text-[#00A8A8] font-medium">
                {category.replace(/_/g, ' ')}
              </a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 font-medium">{title}</span>
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

      {/* Main Content */}
      <div className="print-container max-w-5xl mx-auto px-8 py-12">
        <div className="print-content bg-white rounded-2xl shadow-lg p-12">
          {/* Header */}
          <div className="border-b-2 border-[#023D7A] pb-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#023D7A]/10 text-[#023D7A] text-xs font-bold uppercase tracking-wider rounded-full">
                {category.replace(/_/g, ' ')}
              </span>
              <span className="text-gray-500 text-sm">Last updated: {lastUpdated}</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[#023D7A] mb-4">
              {title}
            </h1>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {children}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 flex items-center justify-between">
          <a
            href="/docs/README.md"
            className="flex items-center gap-2 text-[#023D7A] hover:text-[#00A8A8] font-bold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Documentation
          </a>
          <a
            href="/demo-accounts"
            className="flex items-center gap-2 px-6 py-3 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-all duration-300"
          >
            Get Started
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocPage;
