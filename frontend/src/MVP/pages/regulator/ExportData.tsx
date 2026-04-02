/**
 * Regulator - Export Data Page
 *
 * Export regulatory data in various formats.
 *
 * Route: /regulator/export/:type
 */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Button from '../../components/Button';

const ExportData: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [format, setFormat] = useState<'csv' | 'pdf' | 'json' | 'xml'>('csv');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');

  const exportTypes: Record<string, { title: string; description: string }> = {
    transactions: { title: 'Transaction Export', description: 'Export all transaction data' },
    compliance: { title: 'Compliance Export', description: 'Export compliance and KYC data' },
    investors: { title: 'Investor Export', description: 'Export investor information' },
  };

  const currentExport = exportTypes[type || 'transactions'];

  const handleExport = () => {
    alert(`🚀 MVP TESTNET: Export ${currentExport?.title}\n\nFormat: ${format.toUpperCase()}\nDate Range: ${dateRange}\n\nIn production, this will download the requested data.`);
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">{currentExport?.title}</h1>
              <p className="text-[#8b5b3d] mt-1">{currentExport?.description}</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Export Configuration */}
          <Card>
            <h3 className="text-lg font-bold text-[#103b5b] mb-6">Export Configuration</h3>
            
            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Export Format</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormat('csv')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      format === 'csv'
                        ? 'border-[#00A8A8] bg-[#00A8A8]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-bold text-gray-900">CSV</p>
                    <p className="text-xs text-gray-500">Spreadsheet format</p>
                  </button>
                  <button
                    onClick={() => setFormat('pdf')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      format === 'pdf'
                        ? 'border-[#00A8A8] bg-[#00A8A8]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-bold text-gray-900">PDF</p>
                    <p className="text-xs text-gray-500">Document format</p>
                  </button>
                  <button
                    onClick={() => setFormat('json')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      format === 'json'
                        ? 'border-[#00A8A8] bg-[#00A8A8]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-bold text-gray-900">JSON</p>
                    <p className="text-xs text-gray-500">Data interchange</p>
                  </button>
                  <button
                    onClick={() => setFormat('xml')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      format === 'xml'
                        ? 'border-[#00A8A8] bg-[#00A8A8]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-bold text-gray-900">XML</p>
                    <p className="text-xs text-gray-500">Structured data</p>
                  </button>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Date Range</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDateRange('7d')}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      dateRange === '7d'
                        ? 'bg-[#023D7A] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => setDateRange('30d')}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      dateRange === '30d'
                        ? 'bg-[#023D7A] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Last 30 Days
                  </button>
                  <button
                    onClick={() => setDateRange('90d')}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      dateRange === '90d'
                        ? 'bg-[#023D7A] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Last 90 Days
                  </button>
                  <button
                    onClick={() => setDateRange('custom')}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      dateRange === 'custom'
                        ? 'bg-[#023D7A] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {/* Export Button */}
              <Button variant="primary" size="xl" onClick={handleExport} className="w-full">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Data ({format.toUpperCase()})
              </Button>
            </div>
          </Card>

          {/* Export Info */}
          <Card>
            <h3 className="text-lg font-bold text-[#103b5b] mb-6">Export Information</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">📊 Data Included</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• All {type} records within date range</li>
                  <li>• Metadata and timestamps</li>
                  <li>• Related entity references</li>
                  <li>• Compliance flags and status</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-semibold text-amber-900 mb-2">⚠️ Important Notes</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Large exports may take several minutes</li>
                  <li>• PII data is encrypted in exports</li>
                  <li>• Export files are watermarked</li>
                  <li>• Download link expires after 24 hours</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">✓ Format Support</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• CSV: Excel, Google Sheets compatible</li>
                  <li>• PDF: Print-ready with formatting</li>
                  <li>• JSON: Machine-readable, API format</li>
                  <li>• XML: XBRL-ready for regulatory filing</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ExportData;
