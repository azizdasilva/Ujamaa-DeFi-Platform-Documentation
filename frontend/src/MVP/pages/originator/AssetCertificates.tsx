/**
 * Asset Certificates Page - View & Mint UGT
 * 
 * View all certified assets and mint Ujamaa Guarantee Token (UGT) tokens as collateral.
 * 
 * Route: /originator/assets/certificates
 * 
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import StatsCard from '../../components/StatsCard';

interface Certificate {
  certificateId: string;
  assetType: string;
  value: number;
  quantity: number;
  unit: string;
  warehouseLocation: string;
  description: string;
  status: 'pending' | 'verified' | 'revoked';
  submittedAt: string;
  ugtTokenId?: string;
  financingId?: string;
}

const AssetCertificates: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'revoked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mintingId, setMintingId] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const toggleCert = (cert: Certificate) => {
    const next = selectedCert?.certificateId === cert.certificateId ? null : cert;
    setSelectedCert(next);
    if (next) {
      setTimeout(() => {
        document.getElementById('cert-detail-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Mock certificates (MVP testnet)
  const certificates: Certificate[] = useMemo(() => {
    const saved = sessionStorage.getItem('submittedAsset');
    const mockCerts: Certificate[] = [
      {
        certificateId: 'CERT-DEMO-001',
        assetType: 'INVENTORY',
        value: 500000,
        quantity: 1000,
        unit: 'bales',
        warehouseLocation: 'GDIZ warehouse (Benin) A, Lomé, Togo',
        description: '1000 cotton bales, Grade A, harvested 2026',
        status: 'verified',
        submittedAt: '2026-03-15T10:30:00Z',
        ugtTokenId: 'UGT-001',
        financingId: 'FIN-001',
      },
      {
        certificateId: 'CERT-DEMO-002',
        assetType: 'INVOICE',
        value: 2000000,
        quantity: 1,
        unit: 'contract',
        warehouseLocation: 'ZARA Contract, Morocco',
        description: 'ZARA textile order Q2 2026',
        status: 'verified',
        submittedAt: '2026-03-10T14:20:00Z',
        ugtTokenId: 'UGT-002',
        financingId: 'FIN-002',
      },
    ];

    if (saved) {
      const submitted = JSON.parse(saved);
      mockCerts.unshift({
        certificateId: submitted.certificateId,
        assetType: submitted.assetType,
        value: Number(submitted.value),
        quantity: Number(submitted.quantity),
        unit: submitted.unit,
        warehouseLocation: submitted.warehouseLocation,
        description: submitted.description,
        status: 'pending' as const,
        submittedAt: submitted.submittedAt,
      });
    }

    return mockCerts;
  }, []);

  const filteredCerts = useMemo(() => {
    return certificates.filter((cert) => {
      if (filter !== 'all' && cert.status !== filter) return false;
      if (searchQuery && !cert.certificateId.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !cert.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [certificates, filter, searchQuery]);

  const stats = useMemo(() => ({
    total: certificates.length,
    pending: certificates.filter(c => c.status === 'pending').length,
    verified: certificates.filter(c => c.status === 'verified').length,
    totalValue: certificates.filter(c => c.status === 'verified').reduce((sum, c) => sum + c.value, 0),
  }), [certificates]);

  const handleMintUJG = (certificateId: string) => {
    setMintingId(certificateId);

    // Simulate UGT minting (MVP testnet)
    setTimeout(() => {
      setMintingId(null);
      alert(`UGT minted successfully for certificate ${certificateId}!`);
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Asset Certificates</h1>
              <p className="text-gray-600 mt-1">View certified assets and mint UGT collateral</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                onClick={() => navigate('/originator/assets/submit')}
              >
                + Submit New Asset
              </Button>
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            label="Total Certificates"
            value={stats.total}
            color="blue"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Pending Certification"
            value={stats.pending}
            color="amber"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Verified"
            value={stats.verified}
            color="green"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Total Value"
            value={formatCurrency(stats.totalValue)}
            color="purple"
          />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['all', 'pending', 'verified', 'revoked'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === f
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Certificates List */}
        <div className="space-y-4">
          {filteredCerts.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 mb-4">No certificates found</p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/originator/assets/submit')}
                >
                  Submit Your First Asset
                </Button>
              </div>
            </Card>
          ) : (
            filteredCerts.map((cert) => (
              <Card key={cert.certificateId}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="primary" size="sm">{cert.assetType}</Badge>
                      <Badge
                        variant={cert.status === 'verified' ? 'success' : cert.status === 'pending' ? 'warning' : 'error'}
                        size="sm"
                      >
                        {cert.status.toUpperCase()}
                      </Badge>
                      {cert.ugtTokenId && (
                        <Badge variant="info" size="sm">UGT: {cert.ugtTokenId}</Badge>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {cert.description}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Certificate ID</p>
                        <p className="font-mono text-sm font-medium">{cert.certificateId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Value</p>
                        <p className="font-semibold">{formatCurrency(cert.value)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Quantity</p>
                        <p className="font-semibold">{cert.quantity} {cert.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Submitted</p>
                        <p className="text-sm">{new Date(cert.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-600">Warehouse</p>
                      <p className="text-sm font-medium">{cert.warehouseLocation}</p>
                    </div>

                    {cert.financingId && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          <span className="font-semibold">✓ Financing Active:</span> {cert.financingId}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col gap-2">
                    {cert.status === 'verified' && !cert.ugtTokenId && (
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => handleMintUJG(cert.certificateId)}
                        isLoading={mintingId === cert.certificateId}
                      >
                        Mint UGT
                      </Button>
                    )}

                    {cert.ugtTokenId ? (
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => navigate('/industrial-operator/financings')}
                      >
                        View Financing
                      </Button>
                    ) : cert.status === 'pending' ? (
                      <Button variant="outline" size="md" disabled>
                        Pending Review
                      </Button>
                    ) : null}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCert(cert)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Detail Panel */}
        {selectedCert && (
          <Card className="mt-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-[#103b5b]">Certificate Details: {selectedCert.certificateId}</h3>
              <button onClick={() => setSelectedCert(null)} className="text-gray-500 hover:text-gray-700 text-lg font-bold">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-[#103b5b] mb-3">Asset Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="text-[#103b5b]">{selectedCert.assetType}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Value</span><span className="font-semibold text-[#103b5b]">€{selectedCert.value.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Quantity</span><span className="text-[#103b5b]">{selectedCert.quantity} {selectedCert.unit}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Warehouse</span><span className="text-[#103b5b]">{selectedCert.warehouseLocation}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Submitted</span><span className="text-[#103b5b]">{selectedCert.submittedAt}</span></div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-[#103b5b] mb-3">Description</h4>
                <p className="text-sm text-gray-700">{selectedCert.description}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Status</span><Badge variant={selectedCert.status === 'verified' ? 'success' : selectedCert.status === 'revoked' ? 'error' : 'warning'} size="sm">{selectedCert.status.toUpperCase()}</Badge></div>
                  {selectedCert.ugtTokenId && <div className="flex justify-between"><span className="text-gray-500">UGT Token</span><span className="font-mono text-[#103b5b]">{selectedCert.ugtTokenId}</span></div>}
                  {selectedCert.financingId && <div className="flex justify-between"><span className="text-gray-500">Financing</span><span className="font-mono text-[#103b5b]">{selectedCert.financingId}</span></div>}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">How Asset Tokenization Works</h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Submit asset details for certification</li>
                <li>GDIZ (Benin)/SIPI verifies and certifies the asset (1-2 days)</li>
                <li>Certificate created with unique ID</li>
                <li>Mint UGT (Ujamaa Guarantee Token) token as collateral</li>
                <li>Use UGT to secure financing from Liquidity Pool</li>
                <li>Repay financing → UGT returned to you</li>
              </ol>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            🚀 MVP: Asset Tokenization - Testnet Release • Polygon Amoy (Chain ID: 80002)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AssetCertificates;
