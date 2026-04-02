/**
 * Regulator - Compliance Reports Page
 *
 * View compliance reports and regulatory filings.
 *
 * Route: /regulator/compliance
 */

import React from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const ComplianceReports: React.FC = () => {
  const reports = [
    { id: 'RPT-2026-001', type: 'Monthly AML Report', period: 'March 2026', status: 'available', generated: '2026-04-01', size: '2.4 MB' },
    { id: 'RPT-2026-002', type: 'Quarterly Compliance Review', period: 'Q1 2026', status: 'available', generated: '2026-04-01', size: '5.1 MB' },
    { id: 'RPT-2026-003', type: 'Investor Verification Report', period: 'March 2026', status: 'available', generated: '2026-03-31', size: '1.8 MB' },
    { id: 'RPT-2026-004', type: 'Transaction Monitoring Summary', period: 'March 2026', status: 'available', generated: '2026-03-31', size: '3.2 MB' },
    { id: 'RPT-2026-005', type: 'Sanctions Screening Report', period: 'March 2026', status: 'pending', generated: 'N/A', size: 'N/A' },
  ];

  const stats = {
    totalReports: reports.length,
    available: reports.filter(r => r.status === 'available').length,
    pending: reports.filter(r => r.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Compliance Reports</h1>
              <p className="text-[#8b5b3d] mt-1">Regulatory filings and compliance documentation</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Total Reports</p>
            <p className="text-2xl font-bold text-[#103b5b]">{stats.totalReports}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Available</p>
            <p className="text-2xl font-bold text-green-600">{stats.available}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-[#103b5b]/20">
            <p className="text-sm text-[#8b5b3d]">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
        </div>

        {/* Reports Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#103b5b]/20">
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Report ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Period</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Generated</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Size</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#103b5b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-[#103b5b]/10 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs">{report.id}</td>
                    <td className="py-3 px-4 font-semibold text-[#103b5b]">{report.type}</td>
                    <td className="py-3 px-4 text-gray-600">{report.period}</td>
                    <td className="py-3 px-4 text-gray-600">{report.generated}</td>
                    <td className="py-3 px-4 text-gray-600">{report.size}</td>
                    <td className="py-3 px-4">
                      <Badge variant={report.status === 'available' ? 'success' : 'warning'} size="sm">
                        {report.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {report.status === 'available' ? (
                        <button
                          onClick={() => alert(`🚀 MVP TESTNET: Download ${report.type}\n\nIn production, this will download the report PDF.`)}
                          className="px-3 py-1 bg-[#023D7A] hover:bg-[#0d3352] text-white text-xs font-bold rounded transition-colors"
                        >
                          Download
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Generating...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Generate New Report */}
        <Card className="mt-6">
          <h3 className="text-lg font-bold text-[#103b5b] mb-4">Generate New Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="primary" size="lg" onClick={() => alert('🚀 MVP TESTNET: Generate AML Report\n\nIn production, this will generate a new AML report.')}>
              📊 Generate AML Report
            </Button>
            <Button variant="secondary" size="lg" onClick={() => alert('🚀 MVP TESTNET: Generate Investor Report\n\nIn production, this will generate an investor verification report.')}>
              👥 Generate Investor Report
            </Button>
            <Button variant="secondary" size="lg" onClick={() => alert('🚀 MVP TESTNET: Generate Transaction Report\n\nIn production, this will generate a transaction monitoring report.')}>
              💱 Generate Transaction Report
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ComplianceReports;
