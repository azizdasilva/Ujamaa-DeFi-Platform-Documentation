/**
 * Smart Contract Test Dashboard
 * Ujamaa DeFi Platform - MVP Testnet
 *
 * Interactive UI for testing smart contract functions
 * All 11 contracts deployed on Polygon Amoy testnet
 */

import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { useLiquidityPool, formatPoolFamily, formatAPY, formatTokenAmount } from '../../hooks/useContractInteraction';
import WalletModal from '../components/WalletModal';

// All deployed contract addresses (Polygon Amoy - Chain ID: 80002)
// Deployed: April 5, 2026 - ERC-3643 Compliant + UGT Minting Enabled
export const DEPLOYED_CONTRACTS = [
  {
    name: 'Mock EUROD',
    symbol: 'EUROD',
    address: '0xF07938b598F6BC1C88d52197d36F68b20E955604',
    role: 'Euro-pegged stablecoin (Ondo)',
    standard: 'ERC-20',
    icon: '💶',
    category: 'Token',
    status: 'Deployed',
    description: 'Mock EUROD token for testnet. Represents Euro-pegged stablecoin for the platform.',
    functions: ['mint', 'transfer', 'approve', 'balanceOf'],
  },
  {
    name: 'ULPTokenizer',
    symbol: 'uLP',
    address: '0x84fD03fF851c04D890F709BD26276eD12D62a763',
    role: 'Yield-bearing pool token (ERC-3643)',
    standard: 'ERC-3643',
    icon: '🪙',
    category: 'Token',
    status: 'Deployed',
    description: 'Ujamaa Liquidity Provider Token. Yield-bearing ERC-3643 token representing pool shares.',
    functions: ['deposit', 'redeem', 'transfer', 'getNAV', 'navPerShare'],
  },
  {
    name: 'IdentityRegistry',
    symbol: 'ID-REG',
    address: '0x986B87102b8b0419d814840473859999E2cDa6FA',
    role: 'ERC-3643 identity verification',
    standard: 'ERC-3643',
    icon: '🆔',
    category: 'Compliance',
    status: 'Deployed',
    description: 'Manages investor identity verification for ERC-3643 permissioned tokens.',
    functions: ['registerIdentity', 'verifyIdentity', 'isVerified', 'getIdentity'],
  },
  {
    name: 'Compliance',
    symbol: 'COMPLIANCE',
    address: '0x68eEAeA566C5B17475e68Fd625844e2Acc8c2241',
    role: 'Transfer compliance module',
    standard: 'ERC-3643',
    icon: '✅',
    category: 'Compliance',
    status: 'Deployed',
    description: 'Enforces transfer restrictions and compliance checks for ERC-3643 tokens.',
    functions: ['canTransfer', 'getComplianceReason', 'checkInvestorCompliance'],
  },
  {
    name: 'GuaranteeTokenizer',
    symbol: 'UJG',
    address: '0xAF4eAe210d20373D2C4BCdAe43aD0b9478852eb1',
    role: 'Collateral NFT (ERC-3643NFT)',
    standard: 'ERC-3643NFT',
    icon: '🛡️',
    category: 'NFT',
    status: 'Deployed',
    description: 'Ujamaa Guarantee Token. NFT representing certified merchandise/collateral backing financing.',
    functions: ['mintGuarantee', 'redeemGuarantee', 'transfer', 'totalSupply'],
  },
  {
    name: 'Liquidity Pool',
    symbol: 'POOL',
    address: '0x7C666e8F82F09BAeAD68D5e6588DE89d28a4805B',
    role: 'Multi-asset pool manager',
    standard: 'Custom',
    icon: '🏊',
    category: 'Pool',
    status: 'Deployed',
    description: 'Manages 5 pool families with diversification limits and asset allocation.',
    functions: ['createFinancing', 'deployFunds', 'repayFinancing', 'getUtilizationRate'],
  },
  {
    name: 'Industrial Gateway',
    symbol: 'GATEWAY',
    address: '0x842254e5aBCc3dBF402979683BB8345624fEA416',
    role: 'Asset certification & UGT minting',
    standard: 'Custom',
    icon: '🏭',
    category: 'Gateway',
    status: 'Deployed',
    description: 'Certifies industrial assets/stock and mints Guarantee Tokens (UGT).',
    functions: ['createCertificate', 'mintGuarantee', 'getRegisteredIndustrialsCount', 'getPendingApprovalsCount'],
  },
  {
    name: 'Jurisdiction Compliance',
    symbol: 'COMPLIANCE',
    address: '0x6B48A85E2E54224BF7C165F5f463f502fB7453B7',
    role: 'Investor jurisdiction verification',
    standard: 'Custom',
    icon: '🌍',
    category: 'Compliance',
    status: 'Deployed',
    description: 'Manages jurisdiction compliance with strictest combined list (OFAC + UN + EU + FATF).',
    functions: ['isJurisdictionAllowed', 'testCompliance'],
  },
  {
    name: 'Mock Escrow',
    symbol: 'ESCROW',
    address: '0xBfa58aad4b1b1648cDE4C74e4a5E84b352382523',
    role: 'Bank escrow simulation',
    standard: 'Custom',
    icon: '🔒',
    category: 'Escrow',
    status: 'Deployed',
    description: 'Simulates bank escrow accounts for investor funds (MVP testnet only).',
    functions: ['createEscrowAccount', 'deposit', 'withdraw', 'getBalance'],
  },
  {
    name: 'Mock Fiat Ramp',
    symbol: 'FIAT',
    address: '0x2180f53Dce716c196D6a1fA86aF7dc5BBdF0d854',
    role: 'Fiat on/off ramp',
    standard: 'Custom',
    icon: '💱',
    category: 'Ramp',
    status: 'Deployed',
    description: 'Simulates fiat ↔ stablecoin conversion (MVP testnet only).',
    functions: ['onRamp', 'offRamp', 'mintTestUJEURSelf'],
  },
  {
    name: 'NAV Gateway',
    symbol: 'GATEWAY',
    address: '0x8cf44a92b679e587d92C25bB5739cb4e850103A4',
    role: 'NAV price feed',
    standard: 'Custom',
    icon: '📊',
    category: 'Gateway',
    status: 'Deployed',
    description: 'Provides NAV (Net Asset Value) per share data for the monitor dashboard.',
    functions: ['updateNav', 'accrueYield', 'getNAV', 'getNavHistory'],
  },
] as const;

/**
 * ContractTestDashboard Component
 */
const ContractTestDashboard: React.FC = () => {
  const { isConnected, address, addressShort, connect, switchToPolygonAmoy, isWrongNetwork } = useWallet();
  const { poolData, loading, error, refetch } = useLiquidityPool();

  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'pools' | 'deploy'>('overview');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Auto-load pool data on mount and when wallet connects
  useEffect(() => {
    if (isConnected && !isWrongNetwork) {
      refetch();
    }
  }, [isConnected, isWrongNetwork, refetch]);

  return (
    <div className="min-h-screen bg-[#F3F8FA] py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Wallet Modal */}
        <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#023D7A] mb-1">
              🔧 Smart Contract Test Dashboard
            </h1>
            <p className="text-xs text-[#333333]">
              MVP Testnet • Polygon Amoy (Chain ID: 80002) • 11 Contracts Deployed
            </p>
          </div>

          {/* Wallet Status Button */}
          {!isConnected ? (
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#00A8A8] to-[#023D7A] hover:from-[#0D7A7A] hover:to-[#034F9A] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 text-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Connect Wallet
            </button>
          ) : isWrongNetwork ? (
            <button
              onClick={switchToPolygonAmoy}
              className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 text-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Switch Network
            </button>
          ) : (
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-xs"
            >
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
              <span>{addressShort}</span>
              <span className="opacity-75">•</span>
              <span className="opacity-90">Amoy</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 font-bold rounded-t-lg transition-colors text-xs ${
              activeTab === 'overview'
                ? 'bg-white text-[#023D7A] border border-b-0 border-gray-200'
                : 'text-gray-600 hover:text-[#023D7A]'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-3 py-1.5 font-bold rounded-t-lg transition-colors text-xs ${
              activeTab === 'contracts'
                ? 'bg-white text-[#023D7A] border border-b-0 border-gray-200'
                : 'text-gray-600 hover:text-[#023D7A]'
            }`}
          >
            📦 All Contracts (11)
          </button>
          <button
            onClick={() => setActiveTab('pools')}
            className={`px-3 py-1.5 font-bold rounded-t-lg transition-colors text-xs ${
              activeTab === 'pools'
                ? 'bg-white text-[#023D7A] border border-b-0 border-gray-200'
                : 'text-gray-600 hover:text-[#023D7A]'
            }`}
          >
            🏊 Pool Families
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-3 py-1.5 font-bold rounded-t-lg transition-colors text-xs ${
              activeTab === 'deploy'
                ? 'bg-white text-[#023D7A] border border-b-0 border-gray-200'
                : 'text-gray-600 hover:text-[#023D7A]'
            }`}
          >
            📦 Deployment
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          {activeTab === 'overview' && (
            <OverviewTab
              poolData={poolData}
              loading={loading}
              error={error}
              onRefresh={refetch}
            />
          )}

          {activeTab === 'contracts' && (
            <ContractsTab contracts={DEPLOYED_CONTRACTS} />
          )}

          {activeTab === 'pools' && (
            <PoolFamiliesTab
              poolData={poolData}
              loading={loading}
              error={error}
              onRefresh={refetch}
            />
          )}

          {activeTab === 'deploy' && (
            <DeploymentTab />
          )}
        </div>

        {/* Testnet Disclaimer */}
        <div className="mt-6 p-3 bg-[#023D7A]/5 border border-[#023D7A]/20 rounded-xl">
          <p className="text-xs text-[#023D7A]">
            <strong>⚠️ MVP TESTNET DISCLAIMER:</strong> This is a testnet deployment on Polygon Amoy. No real funds are involved.
            All tokens and transactions are for testing purposes only. Contract addresses are provided for each contract above.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Overview Tab
 */
const OverviewTab: React.FC<{
  poolData: any;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}> = ({ poolData, loading, error, onRefresh }) => {
  return (
    <div>
      <h2 className="text-base font-bold text-[#023D7A] mb-4">Deployed Contracts Overview</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">11</p>
          <p className="text-[10px] text-blue-600 mt-0.5">Total Contracts</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-700">11</p>
          <p className="text-[10px] text-green-600 mt-0.5">Deployed</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-purple-700">80002</p>
          <p className="text-[10px] text-purple-600 mt-0.5">Chain ID</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-700">Amoy</p>
          <p className="text-[10px] text-amber-600 mt-0.5">Network</p>
        </div>
      </div>

      {/* Contract Categories */}
      <h3 className="text-sm font-bold text-[#023D7A] mb-3">Contract Categories</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="border border-gray-200 rounded-xl p-3">
          <div className="text-2xl mb-1">💶🪙</div>
          <p className="text-xs font-bold text-[#023D7A]">Tokens (2)</p>
          <p className="text-[10px] text-gray-600">EUROD, uLP</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-3">
          <div className="text-2xl mb-1">🛡️</div>
          <p className="text-xs font-bold text-[#023D7A]">NFTs (1)</p>
          <p className="text-[10px] text-gray-600">UJG (Guarantee)</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-3">
          <div className="text-2xl mb-1">🏊</div>
          <p className="text-xs font-bold text-[#023D7A]">Pool (1)</p>
          <p className="text-[10px] text-gray-600">LiquidityPool</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-3">
          <div className="text-2xl mb-1">🏭📊</div>
          <p className="text-xs font-bold text-[#023D7A]">Gateways (2)</p>
          <p className="text-[10px] text-gray-600">Industrial, NAV</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-3">
          <div className="text-2xl mb-1">🆔✅🌍</div>
          <p className="text-xs font-bold text-[#023D7A]">Compliance (3)</p>
          <p className="text-[10px] text-gray-600">IdentityRegistry, Compliance, Jurisdiction</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-3">
          <div className="text-2xl mb-1">🔒💱</div>
          <p className="text-xs font-bold text-[#023D7A]">Mock (2)</p>
          <p className="text-[10px] text-gray-600">Escrow, FiatRamp</p>
        </div>
      </div>

      {/* Quick Stats */}
      <h3 className="text-sm font-bold text-[#023D7A] mb-3">Pool Statistics</h3>
      {loading && (
        <div className="text-center py-4">
          <svg className="animate-spin h-5 w-5 text-[#00A8A8] mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600 text-xs mt-2">Loading pool data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-800 font-medium text-xs">Error: {error}</p>
        </div>
      )}

      {!loading && !error && poolData && (
        <div className="grid grid-cols-2 gap-3">
          {poolData.poolFamilies.slice(0, 4).map((pool: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-lg">
                  {index === 0 ? '🏭' : index === 1 ? '🌾' : index === 2 ? '💼' : '⚡'}
                </span>
                <h4 className="font-bold text-[#023D7A] text-xs">{formatPoolFamily(index)}</h4>
              </div>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-gray-600">APY:</span>
                  <span className="font-bold text-green-600">{formatAPY(pool.targetAPY)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Term:</span>
                  <span className="font-medium text-[#023D7A]">{pool.termDays}d</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onRefresh}
        disabled={loading}
        className="mt-4 w-full px-3 py-2 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-colors disabled:opacity-50 text-xs"
      >
        🔄 Refresh Data
      </button>
    </div>
  );
};

/**
 * Contracts Tab - All 11 Deployed Contracts
 */
const ContractsTab: React.FC<{ contracts: typeof DEPLOYED_CONTRACTS }> = ({ contracts }) => {
  const [selectedContract, setSelectedContract] = useState<number | null>(null);

  return (
    <div>
      <h2 className="text-base font-bold text-[#023D7A] mb-1">✅ All Smart Contracts Deployed</h2>
      <p className="text-xs text-gray-600 mb-4">
        All 11 MVP smart contracts deployed on Polygon Amoy (Chain ID: 80002)
      </p>

      <div className="space-y-2">
        {contracts.map((contract, index) => (
          <div
            key={index}
            className="border border-green-200 bg-green-50 rounded-xl p-3 transition-all hover:shadow-md cursor-pointer"
            onClick={() => setSelectedContract(selectedContract === index ? null : index)}
          >
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="w-10 h-10 bg-gradient-to-br from-[#00A8A8] to-[#023D7A] rounded-xl flex items-center justify-center text-xl shadow-lg flex-shrink-0">
                {contract.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#023D7A] text-sm truncate">{contract.name}</h3>
                  <span className="px-1.5 py-0.5 bg-green-200 text-green-800 text-[9px] font-bold rounded-full flex-shrink-0">
                    {contract.status}
                  </span>
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold rounded-full flex-shrink-0">
                    {contract.symbol}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">{contract.role}</p>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5 truncate">{contract.address}</p>
              </div>

              {/* View on Explorer */}
              <div className="text-right flex-shrink-0">
                <a
                  href={`https://amoy.polygonscan.com/address/${contract.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded text-[9px] transition-colors inline-flex items-center gap-1"
                >
                  View ↗
                </a>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedContract === index && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-gray-600">Standard:</span>
                    <span className="ml-1 font-medium text-[#023D7A]">{contract.standard}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-1 font-medium text-[#023D7A]">{contract.category}</span>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-gray-700">{contract.description}</p>
                <div className="mt-2">
                  <p className="text-[10px] text-gray-600 mb-1">Key Functions:</p>
                  <div className="flex flex-wrap gap-1">
                    {contract.functions.map((fn, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[9px] font-mono text-[#023D7A]">
                        {fn}()
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Pool Families Tab
 */
const PoolFamiliesTab: React.FC<{
  poolData: any;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}> = ({ poolData, loading, error, onRefresh }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-[#023D7A]">Pool Families Overview</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-3 py-1.5 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1 text-xs"
        >
          <svg className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.058M5.058 13.5a8 8 0 0113.884-4.442M19 20v-5h-.058M18.942 10.5a8 8 0 01-13.884 4.442M4 4a8 8 0 0113.884 4.442m-5.058 9.058A8 8 0 014 20v-5h.058M19 20a8 8 0 01-13.884-4.442M5.058 10.5A8 8 0 0119 4v5h-.058" />
          </svg>
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <svg className="animate-spin h-6 w-6 text-[#00A8A8] mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600 text-xs mt-2">Loading pool data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-800 font-medium text-xs">Error: {error}</p>
        </div>
      )}

      {!loading && !error && poolData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {poolData.poolFamilies.map((pool: any, index: number) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-3 hover:border-[#00A8A8] transition-colors"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xl">
                  {index === 0 ? '🏭' : index === 1 ? '🌾' : index === 2 ? '💼' : index === 3 ? '⚡' : '🏢'}
                </span>
                <h3 className="font-bold text-[#023D7A] text-sm">{formatPoolFamily(index)}</h3>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Target APY:</span>
                  <span className="font-bold text-green-600">{formatAPY(pool.targetAPY)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Term:</span>
                  <span className="font-medium text-[#023D7A]">{pool.termDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-medium text-[#023D7A]">
                    €{formatTokenAmount(pool.totalValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Utilization:</span>
                  <span className="font-medium text-blue-600">
                    {formatAPY(pool.utilizationRate)}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <button className="w-full px-2 py-1.5 bg-[#00A8A8]/10 hover:bg-[#00A8A8]/20 text-[#00A8A8] font-bold rounded-lg transition-colors text-xs">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !poolData && (
        <div className="text-center py-8">
          <p className="text-gray-600 text-xs mb-3">No pool data available</p>
          <button
            onClick={onRefresh}
            className="px-3 py-1.5 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-colors text-xs"
          >
            Load Pool Data
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Deployment Tab
 */
const DeploymentTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-base font-bold text-[#023D7A] mb-4">Contract Deployment Information</h2>
      
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-bold text-green-800 text-sm">All Contracts Deployed Successfully</h3>
        </div>
        <p className="text-xs text-green-700">
          All 9 smart contracts have been deployed to Polygon Amoy testnet. 
          View contract addresses in the "All Contracts" tab.
        </p>
      </div>

      <div className="space-y-3">
        <div className="border border-gray-200 rounded-xl p-3">
          <h4 className="font-bold text-[#023D7A] text-xs mb-2">📋 Deployment Command</h4>
          <code className="block bg-gray-100 p-2 rounded text-[10px] font-mono text-gray-800 overflow-x-auto">
            forge script script/DeployMVP.s.sol:DeployMVP --rpc-url polygon_amoy --broadcast -vvvv
          </code>
        </div>

        <div className="border border-gray-200 rounded-xl p-3">
          <h4 className="font-bold text-[#023D7A] text-xs mb-2">🔗 Network Information</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Network:</span>
              <span className="font-medium text-[#023D7A]">Polygon Amoy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chain ID:</span>
              <span className="font-medium text-[#023D7A]">80002</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">RPC URL:</span>
              <span className="font-medium text-[#023D7A] text-[10px]">https://rpc-amoy.polygon.technology/</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Block Explorer:</span>
              <a href="https://amoy.polygonscan.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-[#00A8A8] hover:underline">
                amoy.polygonscan.com ↗
              </a>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-3">
          <h4 className="font-bold text-[#023D7A] text-xs mb-2">📚 Documentation</h4>
          <ul className="space-y-1 text-xs">
            <li>
              <a href="/deep-dive" className="text-[#00A8A8] hover:underline">📖 Deep Dive Documentation</a>
            </li>
            <li>
              <a href="/docs/glossary" className="text-[#00A8A8] hover:underline">📖 Smart Contract Glossary</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContractTestDashboard;
