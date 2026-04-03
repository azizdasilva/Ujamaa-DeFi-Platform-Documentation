/**
 * Admin - Contract Management Page
 *
 * View and manage smart contract addresses and configurations.
 *
 * Route: /admin/contracts
 *
 * @notice All contracts deployed on Polygon Amoy Testnet (Chain ID: 80002)
 * @notice Updated: 2026-04-03
 */

import React from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { web3Config } from '../../../config/web3';

const ContractManagement: React.FC = () => {
  // All deployed contracts with latest addresses from web3Config
  const contracts = [
    {
      name: 'ULPTokenizer (uLP)',
      address: web3Config.CONTRACTS.ULP_TOKEN,
      type: 'ERC-3643-style Token (ERC-20 + compliance)',
      status: 'deployed',
      network: 'Polygon Amoy',
      description: 'Yield-bearing liquidity pool token with identity verification. Implements ERC-3643-style compliance via custom checks.'
    },
    {
      name: 'GuaranteeTokenizer (uGT)',
      address: web3Config.CONTRACTS.UGT_TOKEN,
      type: 'ERC-721 NFT + Compliance',
      status: 'deployed',
      network: 'Polygon Amoy',
      description: 'NFT collateral token for industrial operator commitments. Represents certified merchandise/collateral.'
    },
    {
      name: 'MockEUROD',
      address: web3Config.CONTRACTS.MOCK_EUROD,
      type: 'ERC-20 Stablecoin',
      status: 'deployed',
      network: 'Polygon Amoy',
      description: 'Mock Euro stablecoin for testnet. Represents EUROD in production.'
    },
    {
      name: 'LiquidityPool',
      address: web3Config.CONTRACTS.LIQUIDITY_POOL,
      type: 'Pool Management',
      status: 'deployed',
      network: 'Polygon Amoy',
      description: 'Multi-asset liquidity pool manager for industrial financing with NAV-based yield distribution.'
    },
    {
      name: 'IndustrialGateway',
      address: web3Config.CONTRACTS.INDUSTRIAL_GATEWAY,
      type: 'Gateway',
      status: 'deployed',
      network: 'Polygon Amoy',
      description: 'Certifies industrial assets/stock and mints GuaranteeTokens (uGT) as collateral.'
    },
    {
      name: 'JurisdictionCompliance',
      address: web3Config.CONTRACTS.JURISDICTION_COMPLIANCE,
      type: 'Compliance',
      status: 'deployed',
      network: 'Polygon Amoy',
      description: 'Jurisdiction-based compliance with OFAC/UN/EU/FATF sanctions list enforcement.'
    },
    {
      name: 'NavGateway',
      address: web3Config.CONTRACTS.NAV_GATEWAY,
      type: 'NAV Oracle',
      status: 'deployed',
      network: 'Polygon Amoy',
      description: 'Net Asset Value oracle for uLP token pricing and yield calculation.'
    },
    {
      name: 'MockEscrow',
      address: web3Config.CONTRACTS.MOCK_ESCROW,
      type: 'Escrow',
      status: 'deployed',
      network: 'Polygon Amoy',
      description: 'Mock escrow for fund holding during investor transactions (testnet simulation).'
    },
    {
      name: 'MockFiatRamp',
      address: web3Config.CONTRACTS.MOCK_FIAT_RAMP,
      type: 'Fiat Gateway',
      status: 'deployed',
      network: 'Polygon Amoy',
      description: 'Mock fiat on/off ramp for testnet. Simulates bank transfers in production.'
    },
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
              <a
                href="https://amoy.polygonscan.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#023D7A] hover:bg-[#0d3352] font-bold rounded-lg transition-colors text-sm flex items-center gap-2"
                style={{ color: '#ffffff' }}
              >
                🔍 View on Explorer
              </a>
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
                  <p className="text-sm text-gray-600">{contract.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{contract.description}</p>
                </div>
                <Badge variant="success" size="md">{contract.status.toUpperCase()}</Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Contract Address</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded break-all">{contract.address}</code>
                    <button
                      onClick={() => navigator.clipboard.writeText(contract.address)}
                      className="p-1 text-[#00A8A8] hover:text-[#0D7A7A] flex-shrink-0"
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
                    className="flex-1 px-3 py-2 bg-[#023D7A] hover:bg-[#0d3352] text-sm font-bold rounded transition-colors text-center"
                    style={{ color: '#ffffff' }}
                  >
                    View on Explorer
                  </a>
                  <button 
                    onClick={() => alert(`🚀 MVP TESTNET: Read Contract\n\nIn production, this will open the contract read interface for ${contract.name}.`)}
                    className="flex-1 px-3 py-2 border border-[#48A9F0]/30 hover:bg-[#F3F8FA] text-[#023D7A] text-sm font-bold rounded transition-colors"
                  >
                    Read Contract
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Contract Summary */}
        <Card className="mt-6 bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Total Contracts Deployed</h3>
              <p className="text-sm text-white/80">All contracts verified on Polygon Amoy</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{contracts.length}</p>
              <p className="text-xs text-white/80">Smart Contracts</p>
            </div>
          </div>
        </Card>

        {/* Contract Actions */}
        <Card className="mt-6">
          <h3 className="text-lg font-bold text-[#103b5b] mb-4">Contract Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => alert('🚀 MVP TESTNET: Upgrade Contract\n\nIn production, this will open the contract upgrade interface with proxy pattern support.')}
            >
              ⬆️ Upgrade Contract
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => alert('🚀 MVP TESTNET: Pause Contract\n\nIn production, this will pause contract operations using Ownable/Pausable pattern.')}
            >
              ⏸️ Pause Contract
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => alert('🚀 MVP TESTNET: Emergency Stop\n\nIn production, this will trigger emergency stop procedures and circuit breaker.')}
            >
              🛑 Emergency Stop
            </Button>
          </div>
        </Card>

        {/* Deployment Info */}
        <Card className="mt-6">
          <h3 className="text-lg font-bold text-[#103b5b] mb-4">Deployment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-2 font-semibold">Deployment Tool</p>
              <p className="text-gray-700">Foundry (forge)</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2 font-semibold">Verification</p>
              <p className="text-gray-700">Polygon Amoy Scan (verified)</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2 font-semibold">Last Updated</p>
              <p className="text-gray-700">2026-04-02</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2 font-semibold">Network</p>
              <p className="text-gray-700">Polygon Amoy Testnet (80002)</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ContractManagement;
