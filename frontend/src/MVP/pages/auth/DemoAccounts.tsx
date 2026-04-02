/**
 * Demo Accounts Page
 * Allows users to quickly try the platform with pre-configured demo accounts
 *
 * Route: /demo-accounts
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { InvestorRole } from '../../../types';
import MVPBanner from '../../components/MVPBanner';

interface DemoAccount {
  id: string;
  role: InvestorRole;
  title: string;
  description: string;
  features: string[];
  color: string;
  icon: string;
  email: string;
  wallet: string;  // Display format (truncated)
  fullWalletAddress: string;  // Full address for login
  balance?: string;
  jurisdiction: string;
}

const DemoAccounts: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const demoAccounts: DemoAccount[] = [
    {
      id: 'institutional',
      role: 'INSTITUTIONAL_INVESTOR',
      title: 'Institutional Investor',
      description: 'Large-scale investment firm',
      features: [
        '€10M demo balance',
        'KYB Approved',
        'Access to all pools',
        'Custom terms available',
      ],
      color: 'from-[#023D7A] to-[#00A8A8]',
      icon: '🏦',
      email: 'institutional@ujamaa-defi.com',
      wallet: '0x742d...bEb1',
      fullWalletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      balance: '€10,000,000',
      jurisdiction: 'Mauritius (MU)',
    },
    {
      id: 'retail',
      role: 'RETAIL_INVESTOR',
      title: 'Retail Investor',
      description: 'Individual investor',
      features: [
        '€50K demo balance',
        'KYC Approved',
        'Low minimum (€1K)',
        'Educational content',
      ],
      color: 'from-blue-500 to-purple-500',
      icon: '👤',
      email: 'retail@ujamaa-defi.com',
      wallet: '0x8626...1199',
      fullWalletAddress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      balance: '€50,000',
      jurisdiction: 'Kenya (KE)',
    },
    {
      id: 'operator',
      role: 'INDUSTRIAL_OPERATOR',
      title: 'Industrial Operator',
      description: 'Company seeking financing',
      features: [
        'Submit assets',
        'GDIZ Certified',
        'Track financings',
        'View certificates',
      ],
      color: 'from-amber-500 to-orange-500',
      icon: '🏭',
      email: 'operator@ujamaa-defi.com',
      wallet: '0xdD2F...44C0',
      fullWalletAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
      jurisdiction: 'Benin (BJ)',
    },
    {
      id: 'compliance',
      role: 'COMPLIANCE_OFFICER',
      title: 'Compliance Officer',
      description: 'Platform compliance manager',
      features: [
        'Review KYC/KYB',
        '24h approval window',
        'Transaction monitoring',
        'Generate reports',
      ],
      color: 'from-purple-500 to-pink-500',
      icon: '✓',
      email: 'compliance@ujamaa-defi.com',
      wallet: '0xbDA5...197E',
      fullWalletAddress: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
      jurisdiction: 'European Union (EU)',
    },
    {
      id: 'admin',
      role: 'ADMIN',
      title: 'Platform Admin',
      description: 'Full platform access',
      features: [
        'User management',
        'Pool management',
        'System settings',
        'All permissions',
      ],
      color: 'from-red-500 to-rose-500',
      icon: '⚙️',
      email: 'admin@ujamaa-defi.com',
      wallet: '0x2546...Ec30',
      fullWalletAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
      jurisdiction: 'European Union (EU)',
    },
    {
      id: 'regulator',
      role: 'REGULATOR',
      title: 'Regulator',
      description: 'Regulatory oversight',
      features: [
        'Read-only access',
        'Compliance reports',
        'Audit trails',
        'Export data',
      ],
      color: 'from-gray-600 to-gray-800',
      icon: '👁️',
      email: 'regulator@ujamaa-defi.com',
      wallet: '0x976E...0aa9',
      fullWalletAddress: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
      jurisdiction: 'European Union (EU)',
    },
  ];

  const handleSelectDemo = (account: DemoAccount) => {
    // Use full wallet address from demo account
    login(account.role, account.fullWalletAddress);

    // Navigate to role-specific dashboard
    const dashboardRoutes: Record<InvestorRole, string> = {
      INSTITUTIONAL_INVESTOR: '/institutional/dashboard',
      RETAIL_INVESTOR: '/retail/dashboard',
      INDUSTRIAL_OPERATOR: '/originator/dashboard',
      COMPLIANCE_OFFICER: '/compliance/dashboard',
      ADMIN: '/admin/dashboard',
      REGULATOR: '/regulator/dashboard',
    };

    navigate(dashboardRoutes[account.role]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F8FA] to-[#E8F4F8]">
      <MVPBanner />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎯 Try Demo Accounts
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Experience the full platform with pre-configured demo accounts.
            No registration required - instant access to all features!
          </p>
        </div>
      </div>

      {/* Demo Accounts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#48A9F0]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#023D7A]">Safe & Secure</h3>
            </div>
            <p className="text-sm text-gray-600">
              Demo accounts use test data only. No real funds or personal information required.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#48A9F0]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#023D7A]">Instant Access</h3>
            </div>
            <p className="text-sm text-gray-600">
              Click any account to login instantly. No email verification or waiting required.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#48A9F0]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#023D7A]">All Features</h3>
            </div>
            <p className="text-sm text-gray-600">
              Explore every feature from each role's perspective. Full platform access.
            </p>
          </div>
        </div>

        {/* Investor Accounts */}
        <h2 className="text-2xl font-bold text-[#023D7A] mb-6">📈 Investor Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {demoAccounts.filter(a => ['institutional', 'retail'].includes(a.id)).map((account) => (
            <DemoCard key={account.id} account={account} onSelect={handleSelectDemo} />
          ))}
        </div>

        {/* Operator Account */}
        <h2 className="text-2xl font-bold text-[#023D7A] mb-6">🏭 Operator Account</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {demoAccounts.filter(a => a.id === 'operator').map((account) => (
            <DemoCard key={account.id} account={account} onSelect={handleSelectDemo} />
          ))}
        </div>

        {/* Admin & Compliance */}
        <h2 className="text-2xl font-bold text-[#023D7A] mb-6">⚙️ Admin & Compliance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {demoAccounts.filter(a => ['compliance', 'admin', 'regulator'].includes(a.id)).map((account) => (
            <DemoCard key={account.id} account={account} onSelect={handleSelectDemo} />
          ))}
        </div>

        {/* Back to Registration */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Want to create your own account instead?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-[#00A8A8] to-[#023D7A] hover:from-[#0D7A7A] hover:to-[#034F9A] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              ✨ Create Account
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white border-2 border-[#023D7A] text-[#023D7A] font-bold rounded-xl transition-all hover:bg-[#023D7A] hover:text-white"
            >
              🔐 Sign In
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Account Card Component
interface DemoCardProps {
  account: DemoAccount;
  onSelect: (account: DemoAccount) => void;
}

const DemoCard: React.FC<DemoCardProps> = ({ account, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[#48A9F0]/20 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      {/* Header */}
      <div className={`bg-gradient-to-r ${account.color} p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-4xl">{account.icon}</div>
          <div className="text-right">
            <p className="text-xs text-white/80">Demo Balance</p>
            <p className="text-xl font-bold">{account.balance || 'N/A'}</p>
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-1">{account.title}</h3>
        <p className="text-sm text-white/90">{account.description}</p>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Account Details */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Email:</span>
            <span className="font-mono text-[#023D7A]">{account.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Wallet:</span>
            <span className="font-mono text-[#023D7A]">{account.wallet}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Jurisdiction:</span>
            <span className="font-semibold text-[#023D7A]">{account.jurisdiction}</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {account.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {/* Select Button */}
        <button
          onClick={() => onSelect(account)}
          className="w-full py-3 bg-gradient-to-r from-[#00A8A8] to-[#023D7A] hover:from-[#0D7A7A] hover:to-[#034F9A] text-white font-bold rounded-xl transition-all shadow-lg group-hover:shadow-xl flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Use This Account
        </button>
      </div>
    </div>
  );
};

export default DemoAccounts;
