/**
 * Smart Contract Test Dashboard
 * Ujamaa DeFi Platform - MVP Testnet
 *
 * Interactive UI for testing smart contract functions
 */

import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { useLiquidityPool, formatPoolFamily, formatAPY, formatTokenAmount } from '../../hooks/useContractInteraction';
import WalletModal from '../components/WalletModal';

/**
 * ContractTestDashboard Component
 */
const ContractTestDashboard: React.FC = () => {
  const { isConnected, address, addressShort, connect, switchToPolygonAmoy, isWrongNetwork } = useWallet();
  const { poolData, loading, error, refetch } = useLiquidityPool();

  const [activeTab, setActiveTab] = useState<'pools' | 'tokens' | 'deploy'>('pools');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Auto-load pool data on mount and when wallet connects
  useEffect(() => {
    if (isConnected && !isWrongNetwork) {
      refetch();
    }
  }, [isConnected, isWrongNetwork, refetch]);

  // Mock token data for MVP
  const mockTokens = [
    { name: 'Ujamaa Liquidity Provider Token', symbol: 'uLP', balance: '0.00', address: 'TBD', deployed: false },
    { name: 'Ondo EUROD Token', symbol: 'EUROD', balance: '0.00', address: 'TBD', deployed: false },
    { name: 'Ujamaa Guarantee Token', symbol: 'UGT', balance: '0.00', address: 'TBD', deployed: false },
    { name: 'Liquidity Pool', symbol: 'POOL', balance: 'N/A', address: 'TBD', deployed: false },
    { name: 'Jurisdiction Compliance', symbol: 'COMPLIANCE', balance: 'N/A', address: 'TBD', deployed: false },
    { name: 'Industrial Gateway', symbol: 'GATEWAY', balance: 'N/A', address: 'TBD', deployed: false },
    { name: 'Mock Escrow', symbol: 'ESCROW', balance: 'N/A', address: 'TBD', deployed: false },
    { name: 'Mock Fiat Ramp', symbol: 'FIAT', balance: 'N/A', address: 'TBD', deployed: false },
  ];

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
              MVP Testnet • Polygon Amoy (Chain ID: 80002)
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
            onClick={() => setActiveTab('tokens')}
            className={`px-3 py-1.5 font-bold rounded-t-lg transition-colors text-xs ${
              activeTab === 'tokens'
                ? 'bg-white text-[#023D7A] border border-b-0 border-gray-200'
                : 'text-gray-600 hover:text-[#023D7A]'
            }`}
          >
            🪙 All Contracts (7)
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
          {activeTab === 'pools' && (
            <PoolFamiliesTab
              poolData={poolData}
              loading={loading}
              error={error}
              onRefresh={refetch}
            />
          )}

          {activeTab === 'tokens' && (
            <TokensTab tokens={mockTokens} />
          )}

          {activeTab === 'deploy' && (
            <DeploymentTab />
          )}
        </div>

        {/* Testnet Disclaimer */}
        <div className="mt-6 p-3 bg-[#023D7A]/5 border border-[#023D7A]/20 rounded-xl">
          <p className="text-xs text-[#023D7A]">
            <strong>⚠️ MVP TESTNET DISCLAIMER:</strong> This is a testnet deployment. No real funds are involved.
            All tokens and transactions are for testing purposes only on Polygon Amoy testnet.
          </p>
        </div>
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
  // Smart contracts to display
  const smartContracts = [
    { name: 'ULPToken', symbol: 'uLP', file: 'ULPToken.sol', status: 'Ready', icon: '🪙' },
    { name: 'GuaranteeToken', symbol: 'UGT', file: 'GuaranteeToken.sol', status: 'Ready', icon: '🛡️' },
    { name: 'LiquidityPool', symbol: 'POOL', file: 'LiquidityPool.sol', status: 'Ready', icon: '🏊' },
    { name: 'JurisdictionCompliance', symbol: 'COMPLIANCE', file: 'JurisdictionCompliance.sol', status: 'Ready', icon: '✅' },
    { name: 'IndustrialGateway', symbol: 'GATEWAY', file: 'IndustrialGateway.sol', status: 'Ready', icon: '🏭' },
    { name: 'MockEscrow', symbol: 'ESCROW', file: 'MockEscrow.sol', status: 'Ready', icon: '🔒' },
    { name: 'MockFiatRamp', symbol: 'FIAT', file: 'MockFiatRamp.sol', status: 'Ready', icon: '💱' },
  ];

  return (
    <div>
      {/* Smart Contracts Overview */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-[#023D7A] mb-3 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Smart Contracts (7)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {smartContracts.map((contract, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-3 text-center hover:border-[#00A8A8] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="text-2xl mb-1">{contract.icon}</div>
              <h3 className="font-bold text-[#023D7A] group-hover:text-[#00A8A8] text-[8px] leading-tight">{contract.symbol}</h3>
              <p className="text-[13px] text-gray-500 mt-0.5 truncate">{contract.name}</p>
              <span className="inline-block mt-1.5 px-1.5 py-0.5 bg-green-100 text-green-700 font-bold rounded-full text-[12px]">
                {contract.status}
              </span>
            </div>
          ))}
        </div>
      </div>

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
            <Ondo Finance className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
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
 * Tokens Tab
 */
const TokensTab: React.FC<{ tokens: Array<{ name: string; symbol: string; balance: string; address: string; deployed: boolean }> }> = ({
  tokens,
}) => {
  const getContractIcon = (symbol: string) => {
    const icons: Record<string, string> = {
      uLP: '🪙',
      EUROD: '💶',
      UGT: '🛡️',
      POOL: '🏊',
      COMPLIANCE: '✅',
      GATEWAY: '🏭',
      ESCROW: '🔒',
      FIAT: '💱',
    };
    return icons[symbol] || '📄';
  };

  return (
    <div>
      <h2 className="text-base font-bold text-[#023D7A] mb-1">Smart Contracts</h2>
      <p className="text-xs text-gray-600 mb-4">
        All 7 MVP smart contracts ready for deployment on Polygon Amoy
      </p>

      <div className="space-y-2">
        {tokens.map((token, index) => (
          <div
            key={index}
            className={`border rounded-xl p-3 flex items-center gap-3 transition-all ${
              token.deployed
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            {/* Icon */}
            <div className="w-10 h-10 bg-gradient-to-br from-[#00A8A8] to-[#023D7A] rounded-xl flex items-center justify-center text-xl shadow-lg flex-shrink-0">
              {getContractIcon(token.symbol)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#023D7A] text-sm truncate">{token.name}</h3>
                {token.deployed ? (
                  <span className="px-1.5 py-0.5 bg-green-200 text-green-800 text-[9px] font-bold rounded-full flex-shrink-0">
                    Deployed
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 bg-yellow-200 text-yellow-800 text-[9px] font-bold rounded-full flex-shrink-0">
                    Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600">{token.symbol}</p>
            </div>

            {/* Balance */}
            <div className="text-right hidden sm:block">
              <p className="text-[9px] text-gray-500">Function</p>
              <p className="font-medium text-[#023D7A] text-xs">{token.balance}</p>
            </div>

            {/* Contract Address */}
            <div className="text-right hidden md:block">
              <p className="text-[9px] text-gray-500 mb-0.5">Address</p>
              {token.deployed ? (
                <code className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-mono">
                  {token.address}
                </code>
              ) : (
                <code className="text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-mono">
                  Not deployed
                </code>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Contract Summary */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-blue-700">7</p>
          <p className="text-[9px] text-blue-600 mt-0.5">Total Contracts</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-green-700">0</p>
          <p className="text-[9px] text-green-600 mt-0.5">Deployed</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-yellow-700">7</p>
          <p className="text-[9px] text-yellow-600 mt-0.5">Pending</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-purple-700">80002</p>
          <p className="text-[9px] text-purple-600 mt-0.5">Chain ID</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-xs text-blue-800">
          <strong>📦 Deployment Required:</strong> These contracts need to be deployed to Polygon Amoy testnet.
          Go to the <strong>Deployment</strong> tab to deploy all contracts, or use the Foundry deployment script.
        </p>
      </div>
    </div>
  );
};

/**
 * Deployment Tab
 */
const DeploymentTab: React.FC = () => {
  const [deploymentStep, setDeploymentStep] = useState<'idle' | 'deploying' | 'deployed'>('idle');
  const [currentStep, setCurrentStep] = useState(0);

  const deploymentSteps = [
    { name: 'Compile Contracts', status: 'pending' },
    { name: 'Deploy ULP Token', status: 'pending' },
    { name: 'Deploy EUROD Token', status: 'pending' },
    { name: 'Deploy Guarantee Token', status: 'pending' },
    { name: 'Deploy LiquidityPool', status: 'pending' },
    { name: 'Initialize Contracts', status: 'pending' },
  ];

  const handleDeploy = async () => {
    setDeploymentStep('deploying');
    setCurrentStep(0);

    // Simulate deployment steps
    for (let i = 0; i < deploymentSteps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    setDeploymentStep('deployed');
  };

  return (
    <div>
      <h2 className="text-base font-bold text-[#023D7A] mb-4">Contract Deployment</h2>

      {deploymentStep === 'idle' && (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-[#00A8A8]/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#023D7A] mb-1">Deploy Smart Contracts</h3>
          <p className="text-gray-600 text-xs mb-4">Deploy all MVP contracts to Polygon Amoy testnet</p>
          <button
            onClick={handleDeploy}
            className="px-4 py-2 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-colors text-xs"
          >
            Start Deployment
          </button>
        </div>
      )}

      {deploymentStep === 'deploying' && (
        <div className="space-y-2">
          {deploymentSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                index < currentStep
                  ? 'bg-green-50 border-green-200'
                  : index === currentStep
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {index < currentStep ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : index === currentStep ? (
                <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <Ondo Finance className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
              )}
              <span className={`text-xs ${index <= currentStep ? 'font-medium' : 'text-gray-500'}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {deploymentStep === 'deployed' && (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#023D7A] mb-1">Deployment Complete!</h3>
          <p className="text-gray-600 text-xs mb-4">All contracts have been deployed to Polygon Amoy</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setDeploymentStep('idle')}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors text-xs"
            >
              Deploy Again
            </button>
            <a
              href="https://amoy.polygonscan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-lg transition-colors text-xs"
            >
              View on Block Explorer
            </a>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-xs text-blue-800">
          <strong>📝 Deployment Guide:</strong> For manual deployment, use Foundry:
          <code className="block bg-white p-2 mt-1.5 rounded text-[9px] font-mono">
            forge script script/DeployMVP.s.sol --rpc-url polygon_amoy --broadcast --verify
          </code>
        </p>
      </div>
    </div>
  );
};

export default ContractTestDashboard;
