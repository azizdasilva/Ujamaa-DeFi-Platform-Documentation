/**
 * Admin - Contract Management Page
 *
 * View and manage smart contract addresses and configurations.
 *
 * Route: /admin/contracts
 */

import React from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const ContractManagement: React.FC = () => {
  const contracts = [
    { name: 'UPT Token', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', type: 'ERC-3643', status: 'deployed', network: 'Polygon Amoy' },
    { name: 'Liquidity Pool', address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', type: 'Pool', status: 'deployed', network: 'Polygon Amoy' },
    { name: 'Jurisdiction Compliance', address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', type: 'Compliance', status: 'deployed', network: 'Polygon Amoy' },
    { name: 'Identity Registry', address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30', type: 'Identity', status: 'deployed', network: 'Polygon Amoy' },
    { name: 'Mock Escrow', address: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', type: 'Escrow', status: 'deployed', network: 'Polygon Amoy' },
    { name: 'Mock Fiat Ramp', address: '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0', type: 'Fiat', status: 'deployed', network: 'Polygon Amoy' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Smart Contract Management</h1>
              <p className="text-[#8b5b3d] mt-1">View and manage deployed contracts</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="md">
                🔍 Verify on Explorer
              </Button>
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Network Info */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#103b5b]">Current Network</h3>
              <p className="text-sm text-gray-600">Polygon Amoy Testnet</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="info" size="lg">Chain ID: 80002</Badge>
              <Badge variant="success" size="lg">Connected</Badge>
            </div>
          </div>
        </Card>

        {/* Contracts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contracts.map((contract, idx) => (
            <Card key={idx}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#103b5b]">{contract.name}</h3>
                  <p className="text-sm text-gray-600">{contract.type} Contract</p>
                </div>
                <Badge variant="success" size="md">{contract.status.toUpperCase()}</Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Contract Address</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{contract.address}</code>
                    <button
                      onClick={() => navigator.clipboard.writeText(contract.address)}
                      className="p-1 text-[#00A8A8] hover:text-[#0D7A7A]"
                      title="Copy address"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Network</p>
                  <p className="text-sm font-semibold text-gray-700">{contract.network}</p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <a
                    href={`https://amoy.polygonscan.com/address/${contract.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-[#023D7A] hover:bg-[#0d3352] text-white text-sm font-bold rounded transition-colors text-center"
                  >
                    View on Explorer
                  </a>
                  <button className="flex-1 px-3 py-2 border border-[#48A9F0]/30 hover:bg-[#F3F8FA] text-[#023D7A] text-sm font-bold rounded transition-colors">
                    Read Contract
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Contract Actions */}
        <Card className="mt-6">
          <h3 className="text-lg font-bold text-[#103b5b] mb-4">Contract Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="primary" size="lg" onClick={() => alert('🚀 MVP TESTNET: Upgrade Contract\n\nIn production, this will open the contract upgrade interface.')}>
              ⬆️ Upgrade Contract
            </Button>
            <Button variant="secondary" size="lg" onClick={() => alert('🚀 MVP TESTNET: Pause Contract\n\nIn production, this will pause contract operations.')}>
              ⏸️ Pause Contract
            </Button>
            <Button variant="secondary" size="lg" onClick={() => alert('🚀 MVP TESTNET: Emergency Stop\n\nIn production, this will trigger emergency stop procedures.')}>
              🛑 Emergency Stop
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ContractManagement;
