/**
 * Pool Marketplace - Premium Redesign
 *
 * Browse and invest in liquidity pools with institutional-grade UX.
 * Benchmark: Aave, Compound, Coinbase, Bloomberg Terminal
 *
 * Route: /institutional/pools
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { databaseAPI } from '../../../api/database';
import { investmentsAPI } from '../../../api/investments';
import apiClient from '../../../api/client';

interface Pool {
  id: string;
  name: string;
  family: string;
  icon: string;
  targetYieldMin: number;
  targetYieldMax: number;
  lockupDays: number;
  totalValue: number;
  apy: number;
  assetClasses: string[];
  riskLevel: 'low' | 'medium' | 'high';
  minInvestment: number;
  maxInvestment: number;
  description: string;
  featured?: boolean;
}

const pools: Pool[] = [
  {
    id: 'POOL_INDUSTRIE',
    name: 'Pool Industrie',
    family: 'Industrie',
    icon: '🏭',
    targetYieldMin: 10,
    targetYieldMax: 12,
    lockupDays: 365,
    totalValue: 50_000_000,
    apy: 11,
    assetClasses: ['Manufacturing', 'GDIZ (Benin) Partners', 'Production'],
    riskLevel: 'medium',
    minInvestment: 100_000,
    maxInvestment: 5_000_000,
    description: 'Financing for African manufacturing companies and GDIZ (Benin)-certified industrial partners.',
    featured: true,
  },
  {
    id: 'POOL_AGRICULTURE',
    name: 'Pool Agriculture',
    family: 'Agriculture',
    icon: '🌱',
    targetYieldMin: 12,
    targetYieldMax: 15,
    lockupDays: 180,
    totalValue: 30_000_000,
    apy: 13.5,
    assetClasses: ['Coffee', 'Cocoa', 'Cotton', 'Cashews'],
    riskLevel: 'medium',
    minInvestment: 50_000,
    maxInvestment: 3_000_000,
    description: 'Support African agribusiness with financing for coffee, cocoa, and cotton producers.',
  },
  {
    id: 'POOL_TRADE_FINANCE',
    name: 'Pool Trade Finance',
    family: 'Trade Finance',
    icon: '📦',
    targetYieldMin: 8,
    targetYieldMax: 10,
    lockupDays: 90,
    totalValue: 25_000_000,
    apy: 9,
    assetClasses: ['Invoice Tokenization', 'Receivables'],
    riskLevel: 'low',
    minInvestment: 25_000,
    maxInvestment: 2_000_000,
    description: 'Short-term trade finance through invoice tokenization and commercial receivables.',
  },
  {
    id: 'POOL_RENEWABLE_ENERGY',
    name: 'Pool Renewable Energy',
    family: 'Renewable Energy',
    icon: '⚡',
    targetYieldMin: 9,
    targetYieldMax: 11,
    lockupDays: 730,
    totalValue: 40_000_000,
    apy: 10,
    assetClasses: ['Solar', 'Wind', 'Hydroelectric'],
    riskLevel: 'low',
    minInvestment: 100_000,
    maxInvestment: 4_000_000,
    description: 'Finance renewable energy projects across Africa including solar, wind, and hydro.',
  },
  {
    id: 'POOL_REAL_ESTATE',
    name: 'Pool Real Estate',
    family: 'Real Estate',
    icon: '🏢',
    targetYieldMin: 8,
    targetYieldMax: 12,
    lockupDays: 1095,
    totalValue: 60_000_000,
    apy: 10,
    assetClasses: ['Commercial', 'Retail', 'Industrial', 'Residential'],
    riskLevel: 'medium',
    minInvestment: 100_000,
    maxInvestment: 5_000_000,
    description: 'Diversified real estate exposure across commercial, retail, and residential properties.',
  },
];

interface FilterState {
  searchQuery: string;
  selectedFamily: string;
  riskLevels: string[];
  sortBy: 'apy' | 'yield' | 'lockup' | 'value';
  viewMode: 'grid' | 'table';
}

const PoolMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { address: walletAddress, isConnected } = useAccount();
  const { user: authUser } = useAuth();
  const [investor, setInvestor] = useState<any>(null);
  const [complianceStatus, setComplianceStatus] = useState<any>(null);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentSuccess, setInvestmentSuccess] = useState(false);
  const [isInvesting, setIsInvesting] = useState(false);
  
  // Redeem state
  const [redeemAmount, setRedeemAmount] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<any>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(50000);

  // Set default deposit amount based on role
  useEffect(() => {
    if (authUser?.role) {
      if (authUser.role === 'RETAIL_INVESTOR') {
        setDepositAmount(50000);
      } else if (authUser.role === 'INSTITUTIONAL_INVESTOR') {
        setDepositAmount(500000);
      } else {
        setDepositAmount(50000);
      }
    }
  }, [authUser]);

  const handleMockDeposit = async () => {
    if (!investor?.id || depositAmount <= 0) return;
    try {
      await apiClient.post('/db/bank/deposit', {
        investor_id: investor.id,
        amount: depositAmount,
      });
      // Refresh investor profile
      const data = await databaseAPI.getInvestorProfile(investor.id);
      setInvestor(data);
      setShowDepositModal(false);
      alert(`✅ Successfully deposited ${formatFullCurrency(depositAmount)} virtual funds!`);
    } catch (error) {
      console.error('Deposit failed:', error);
      alert('❌ Failed to simulate deposit. Ensure backend is running.');
    }
  };

  // Check compliance status and fetch investor profile on mount
  useEffect(() => {
    const checkCompliance = async () => {
      if (!authUser?.id) return;

      try {
        // Map auth user to investor profile ID
        // Auth uses string IDs like 'retail-001', but database uses numeric IDs
        let investorId: number;

        if (authUser.id.includes('retail')) {
          investorId = 2; // John Doe - Retail Investor
        } else if (authUser.id.includes('inst')) {
          investorId = 1; // Logic Capital - Institutional
        } else if (authUser.id.includes('originator')) {
          investorId = 3; // Green Cotton - Operator
        } else if (authUser.id.includes('compliance')) {
          investorId = 4; // Compliance Officer
        } else if (authUser.id.includes('admin')) {
          investorId = 5; // Admin
        } else if (authUser.id.includes('regulator')) {
          investorId = 6; // Regulator
        } else {
          investorId = parseInt(authUser.id) || 1; // Fallback to parsing or default
        }

        const data = await databaseAPI.getInvestorProfile(investorId);

        // Set investor data with bank balance
        setInvestor(data);

        // Check if KYC or KYB is approved (case-insensitive)
        const isCompliant = data.kyc_status?.toLowerCase() === 'approved' || data.kyb_status?.toLowerCase() === 'approved';

        setComplianceStatus({
          isCompliant,
          kycStatus: data.kyc_status,
          kybStatus: data.kyb_status,
          investorId: data.id,
          availableBalance: data.available_to_invest || 0
        });
      } catch (error) {
        console.error('Error checking compliance:', error);
      }
    };

    checkCompliance();
  }, [authUser?.id]);

  // Get pool filter from URL
  const urlPool = searchParams.get('pool');

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedFamily: urlPool || 'all',
    riskLevels: [],
    sortBy: 'apy',
    viewMode: 'grid',
  });

  // Update URL when filter changes
  useEffect(() => {
    if (filters.selectedFamily !== 'all') {
      setSearchParams({ pool: filters.selectedFamily });
    } else {
      setSearchParams({});
    }
  }, [filters.selectedFamily, setSearchParams]);

  // Handle action=redeem query param from dashboard links
  useEffect(() => {
    const action = searchParams.get('action');
    const poolParam = searchParams.get('pool');
    
    if (action === 'redeem' && poolParam) {
      // Find the pool by ID or family
      const matchingPool = pools.find(p => 
        p.id === poolParam || 
        p.family.toLowerCase() === poolParam.toLowerCase() ||
        p.id.toLowerCase().includes(poolParam.toLowerCase())
      );
      
      if (matchingPool) {
        setSelectedPool(matchingPool);
        fetchUserPosition(matchingPool.id);
        setShowRedeemModal(true);
        
        // Clear the action param from URL
        setSearchParams({ pool: filters.selectedFamily !== 'all' ? filters.selectedFamily : '' });
      }
    }
  }, []);

  const filteredPools = useMemo(() => {
    return pools
      .filter((pool) => {
        if (filters.selectedFamily !== 'all') {
          // Handle both exact match and case-insensitive match for family
          const selectedFamily = filters.selectedFamily.toLowerCase();
          const poolFamily = pool.family.toLowerCase();
          // Also check if selectedFamily matches pool.id (for cross-page navigation)
          const poolIdMatch = pool.id.toLowerCase().includes(selectedFamily) || selectedFamily.includes('industrie');
          if (!poolFamily.includes(selectedFamily) && !poolIdMatch) return false;
        }
        if (filters.searchQuery && !pool.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
            !pool.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
        if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(pool.riskLevel)) return false;
        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'apy': return b.apy - a.apy;
          case 'yield': return b.targetYieldMax - a.targetYieldMax;
          case 'lockup': return a.lockupDays - b.lockupDays;
          case 'value': return b.totalValue - a.totalValue;
          default: return 0;
        }
      });
  }, [filters]);

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
    return `€${(value / 1_000).toFixed(0)}K`;
  };

  const formatFullCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const toggleRiskLevel = (level: string) => {
    setFilters(prev => ({
      ...prev,
      riskLevels: prev.riskLevels.includes(level)
        ? prev.riskLevels.filter(l => l !== level)
        : [...prev.riskLevels, level],
    }));
  };

  const clearFilters = () => {
    setFilters({ searchQuery: '', selectedFamily: 'all', riskLevels: [], sortBy: 'apy', viewMode: 'grid' });
  };

  const handleConfirmInvestment = () => {
    // Check 1: Wallet must be connected
    if (!isConnected || !walletAddress) {
      alert('🔗 Wallet Required: Please connect your MetaMask wallet to invest.\n\nClick the "Connect Wallet" button in the navigation bar.');
      return;
    }

    // Check 2: Investment amount must be valid
    if (!investmentAmount || Number(investmentAmount) < selectedPool!.minInvestment) {
      alert(`Minimum investment is €${selectedPool!.minInvestment.toLocaleString()}`);
      return;
    }

    // Check 3: Compliance check - KYC/KYB must be approved
    if (!complianceStatus) {
      alert('⏳ Please wait: Checking compliance status...');
      return;
    }

    if (!complianceStatus.isCompliant) {
      if (complianceStatus.kycStatus === 'pending' || complianceStatus.kybStatus === 'pending') {
        alert('⏳ Compliance Review Pending: Your KYC/KYB documents are under review.\n\nPlease wait for approval before investing.\n\nYou can check the status in your profile.');
        navigate('/investor/portfolio');
        return;
      } else {
        alert('📋 Compliance Required: Please complete KYC/KYB verification before investing.\n\nGo to your profile to upload required documents.');
        navigate('/investor/portfolio');
        return;
      }
    }

    // Check 4: Sufficient balance
    const investAmount = Number(investmentAmount);
    if (investAmount > (investor?.available_to_invest || 0)) {
      alert(`❌ Insufficient Funds\n\nAvailable: €${(investor?.available_to_invest || 0).toLocaleString()}\nRequested: €${investAmount.toLocaleString()}\n\nPlease fund your escrow account before investing.`);
      return;
    }

    // All checks passed - proceed with investment
    setIsInvesting(true);
    // Simulate investment submission
    setTimeout(() => {
      setIsInvesting(false);
      setInvestmentSuccess(true);
      // Close modal after success
      setTimeout(() => {
        setShowInvestModal(false);
        setInvestmentSuccess(false);
        setInvestmentAmount('');
      }, 2000);
    }, 1500);
  };

  const isAmountValid = () => {
    return investmentAmount && Number(investmentAmount) >= selectedPool!.minInvestment;
  };

  // Fetch user position when redeem modal opens
  const fetchUserPosition = async (poolId: string) => {
    if (!authUser?.id) return;
    
    try {
      let investorId: number;
      if (authUser.id.includes('retail')) {
        investorId = 2;
      } else if (authUser.id.includes('inst')) {
        investorId = 1;
      } else if (authUser.id.includes('originator')) {
        investorId = 3;
      } else if (authUser.id.includes('admin')) {
        investorId = 5;
      } else {
        investorId = parseInt(authUser.id) || 1;
      }

      const positions = await investmentsAPI.getInvestorPositions(investorId);
      const position = positions.find(p => p.pool_id === poolId && p.is_active);
      setUserPosition(position || null);
    } catch (error) {
      console.error('Error fetching position:', error);
      setUserPosition(null);
    }
  };

  const handleConfirmRedemption = async () => {
    // Check 1: Wallet must be connected
    if (!isConnected || !walletAddress) {
      alert('🔗 Wallet Required: Please connect your MetaMask wallet to redeem.\n\nClick the "Connect Wallet" button in the navigation bar.');
      return;
    }

    // Check 2: Must have a position in this pool
    if (!userPosition || userPosition.shares <= 0) {
      alert('❌ No Position: You don\'t have any shares to redeem in this pool.\n\nPlease invest first before redeeming.');
      return;
    }

    // Check 3: Redeem amount must be valid
    const redeemSharesAmount = Number(redeemAmount);
    if (!redeemAmount || redeemSharesAmount <= 0) {
      alert('Please enter a valid amount to redeem');
      return;
    }

    if (redeemSharesAmount > userPosition.shares) {
      alert(`❌ Insufficient Shares\n\nAvailable: ${userPosition.shares.toLocaleString()} shares\nRequested: ${redeemSharesAmount.toLocaleString()} shares\n\nPlease enter a valid amount.`);
      return;
    }

    // All checks passed - proceed with redemption
    setIsRedeeming(true);
    setRedeemError(null);

    try {
      let investorId: number;
      if (authUser.id.includes('retail')) {
        investorId = 2;
      } else if (authUser.id.includes('inst')) {
        investorId = 1;
      } else if (authUser.id.includes('originator')) {
        investorId = 3;
      } else if (authUser.id.includes('admin')) {
        investorId = 5;
      } else {
        investorId = parseInt(authUser.id) || 1;
      }

      const result = await investmentsAPI.redeemShares({
        pool_id: selectedPool!.id,
        shares: redeemSharesAmount,
        investor_id: investorId,
      });

      if (result.success) {
        setIsRedeeming(false);
        setRedeemSuccess(true);
        
        // Refresh position
        await fetchUserPosition(selectedPool!.id);
        
        // Close modal after success
        setTimeout(() => {
          setShowRedeemModal(false);
          setRedeemSuccess(false);
          setRedeemAmount('');
          setUserPosition(null);
        }, 2500);
      }
    } catch (error: any) {
      setIsRedeeming(false);
      const errorMsg = error?.response?.data?.error || error?.message || 'Redemption failed';
      setRedeemError(errorMsg);
      alert(`❌ Redemption Failed: ${errorMsg}`);
    }
  };

  const isRedeemValid = () => {
    return redeemAmount && Number(redeemAmount) > 0 && userPosition && Number(redeemAmount) <= userPosition.shares;
  };

  const totalTVL = pools.reduce((sum, pool) => sum + pool.totalValue, 0);
  const avgAPY = (pools.reduce((sum, pool) => sum + pool.apy, 0) / pools.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <MVPBanner />

      {/* Hero Header */}
      <header className="bg-gradient-to-r from-[#023D7A] via-[#00A8A8] to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Pool Marketplace</h1>
              <p className="text-white/90 text-lg">
                Browse {filteredPools.length} institutional-grade liquidity pools
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDepositModal(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-bold transition-colors border border-white/30"
              >
                🏦 Add Test Funds
              </button>
              <TestnetNotice variant="badge" />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm text-white/80 mb-1">Total Value Locked</div>
              <div className="text-3xl font-bold">{formatCurrency(totalTVL)}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm text-white/80 mb-1">Average APY</div>
              <div className="text-3xl font-bold">{avgAPY}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm text-white/80 mb-1">Active Pools</div>
              <div className="text-3xl font-bold">{pools.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm text-white/80 mb-1">Min Investment</div>
              <div className="text-3xl font-bold">€25K</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters Bar */}
        <Card className="mb-8">
          <div className="p-6 space-y-6">
            {/* Search and View Toggle */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search pools by name or description..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A8A8] focus:border-transparent transition-all"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, viewMode: 'grid' }))}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    filters.viewMode === 'grid' ? 'bg-white shadow text-[#023D7A]' : 'text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, viewMode: 'table' }))}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    filters.viewMode === 'table' ? 'bg-white shadow text-[#023D7A]' : 'text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Pool Family */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pool Family</label>
                <select
                  value={filters.selectedFamily}
                  onChange={(e) => setFilters(prev => ({ ...prev, selectedFamily: e.target.value }))}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A8A8] bg-white"
                >
                  <option value="all">All Families</option>
                  {pools.map(pool => (
                    <option key={pool.id} value={pool.family}>{pool.icon} {pool.family}</option>
                  ))}
                </select>
              </div>

              {/* Risk Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Risk Level</label>
                <div className="space-y-2">
                  {['low', 'medium', 'high'].map(level => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.riskLevels.includes(level)}
                        onChange={() => toggleRiskLevel(level)}
                        className="w-4 h-4 accent-[#00A8A8]"
                      />
                      <span className={`text-sm font-medium capitalize ${
                        level === 'low' ? 'text-green-600' : level === 'medium' ? 'text-amber-600' : 'text-red-600'
                      }`}>{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A8A8] bg-white"
                >
                  <option value="apy">Highest APY</option>
                  <option value="yield">Highest Yield Range</option>
                  <option value="lockup">Shortest Lockup</option>
                  <option value="value">Largest Pool</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button variant="outline" fullWidth onClick={clearFilters}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Pool Grid */}
        {filteredPools.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-semibold text-gray-900 mb-2">No pools found</p>
              <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
              <Button variant="primary" onClick={clearFilters}>Clear All Filters</Button>
            </div>
          </Card>
        ) : filters.viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPools.map((pool) => (
              <Card
                key={pool.id}
                hover
                className={`cursor-pointer transition-all duration-300 ${
                  pool.featured ? 'ring-2 ring-[#00A8A8] shadow-lg' : ''
                }`}
                onClick={() => { setSelectedPool(pool); setShowDetailsModal(true); }}
              >
                {pool.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="primary" size="sm">⭐ Featured</Badge>
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-5xl">{pool.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{pool.name}</h3>
                    <p className="text-sm text-gray-600">{pool.description}</p>
                  </div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="text-xs text-green-600 font-semibold mb-1">APY</div>
                    <div className="text-2xl font-bold text-green-700">{pool.apy}%</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-xs text-blue-600 font-semibold mb-1">Yield</div>
                    <div className="text-2xl font-bold text-blue-700">{pool.targetYieldMin}-{pool.targetYieldMax}%</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="text-xs text-purple-600 font-semibold mb-1">Lockup</div>
                    <div className="text-2xl font-bold text-purple-700">{pool.lockupDays}d</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                    <div className="text-xs text-amber-600 font-semibold mb-1">TVL</div>
                    <div className="text-2xl font-bold text-amber-700">{formatCurrency(pool.totalValue)}</div>
                  </div>
                </div>

                {/* Asset Classes */}
                <div className="mb-6">
                  <div className="text-xs font-semibold text-gray-700 mb-3">Asset Classes</div>
                  <div className="flex flex-wrap gap-2">
                    {pool.assetClasses.map((assetClass) => (
                      <span key={assetClass} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                        {assetClass}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Risk and Min Investment */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                  <div className={`px-4 py-2 rounded-lg font-semibold ${getRiskColor(pool.riskLevel)}`}>
                    {pool.riskLevel === 'low' && '🟢'}
                    {pool.riskLevel === 'medium' && '🟡'}
                    {pool.riskLevel === 'high' && '🔴'}
                    {' '}{pool.riskLevel.toUpperCase()} RISK
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">Min Investment</div>
                    <div className="text-lg font-bold text-gray-900">{formatCurrency(pool.minInvestment)}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={(e) => { e.stopPropagation(); setSelectedPool(pool); setShowInvestModal(true); }}
                    className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] hover:from-[#0d3352] hover:to-[#0D7A7A]"
                  >
                    Invest Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setSelectedPool(pool); 
                      fetchUserPosition(pool.id);
                      setShowRedeemModal(true); 
                    }}
                    className="border-[#00A8A8] text-[#00A8A8] hover:bg-[#00A8A8]/10"
                  >
                    Redeem
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => { e.stopPropagation(); setSelectedPool(pool); setShowDetailsModal(true); }}
                  >
                    Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Table View */
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Pool</th>
                    <th className="px-6 py-4 text-left font-semibold">APY</th>
                    <th className="px-6 py-4 text-left font-semibold">Yield Range</th>
                    <th className="px-6 py-4 text-left font-semibold">Lockup</th>
                    <th className="px-6 py-4 text-left font-semibold">TVL</th>
                    <th className="px-6 py-4 text-left font-semibold">Risk</th>
                    <th className="px-6 py-4 text-left font-semibold">Min</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPools.map((pool, idx) => (
                    <tr key={pool.id} className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{pool.icon}</span>
                          <div>
                            <div className="font-bold text-gray-900">{pool.name}</div>
                            <div className="text-sm text-gray-600">{pool.assetClasses.length} assets</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="success" size="lg">{pool.apy}%</Badge>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{pool.targetYieldMin}-{pool.targetYieldMax}%</td>
                      <td className="px-6 py-4 text-gray-700">{pool.lockupDays} days</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(pool.totalValue)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getRiskColor(pool.riskLevel)}`}>
                          {pool.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(pool.minInvestment)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedPool(pool); setShowInvestModal(true); }}>Invest</Button>
                          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedPool(pool); fetchUserPosition(pool.id); setShowRedeemModal(true); }}>Redeem</Button>
                          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedPool(pool); setShowDetailsModal(true); }}>Details</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>

      {/* Investment Modal */}
      {selectedPool && showInvestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowInvestModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {investmentSuccess ? (
              /* Success State */
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Investment Successful!</h2>
                <p className="text-gray-600 mb-6">
                  You've invested <strong className="text-green-600">{formatFullCurrency(Number(investmentAmount))}</strong> in {selectedPool.name}
                </p>
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-700">🚀 MVP TESTNET: This was a simulation</p>
                </div>
              </div>
            ) : (
              /* Investment Form */
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-4xl mb-2">{selectedPool.icon}</div>
                    <h2 className="text-2xl font-bold text-gray-900">Invest in {selectedPool.name}</h2>
                  </div>
                  <button onClick={() => setShowInvestModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {!investmentSuccess && (
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Investment Amount (EUR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 font-semibold text-lg">€</span>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A8A8] text-lg font-semibold"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className={Number(investmentAmount) < selectedPool.minInvestment ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      Min: {formatFullCurrency(selectedPool.minInvestment)}
                    </span>
                    <span className="text-gray-600">Max: {formatFullCurrency(selectedPool.maxInvestment)}</span>
                  </div>
                  {!investmentAmount && (
                    <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Please enter an amount to continue
                    </p>
                  )}
                  {investmentAmount && Number(investmentAmount) < selectedPool.minInvestment && (
                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Minimum investment is {formatFullCurrency(selectedPool.minInvestment)}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {[100_000, 250_000, 500_000, 1_000_000].map(amount => {
                    const isBelowMin = amount < selectedPool.minInvestment;
                    return (
                      <button
                        key={amount}
                        onClick={() => setInvestmentAmount(amount.toString())}
                        disabled={isBelowMin}
                        className={`flex-1 px-3 py-3 border-2 rounded-xl text-sm font-bold transition-all ${
                          isBelowMin
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : investmentAmount === amount.toString()
                            ? 'bg-[#00A8A8]/10 border-[#00A8A8] text-[#00A8A8]'
                            : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-[#00A8A8]/10 hover:border-[#00A8A8] hover:text-[#00A8A8]'
                        }`}
                      >
                        +€{amount >= 1_000_000 ? '1M' : `${amount/1000}K`}
                      </button>
                    );
                  })}
                </div>

                {investmentAmount && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                    <h3 className="text-sm font-bold text-green-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Expected Returns (1 Year)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Conservative ({selectedPool.targetYieldMin}%)</p>
                        <p className="text-xl font-bold text-green-700">{formatFullCurrency(Number(investmentAmount) * (1 + selectedPool.targetYieldMin / 100))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Target ({selectedPool.targetYieldMax}%)</p>
                        <p className="text-xl font-bold text-green-700">{formatFullCurrency(Number(investmentAmount) * (1 + selectedPool.targetYieldMax / 100))}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Investment Terms</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Lock-up period: <strong>{selectedPool.lockupDays} days</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Expected APY: <strong>{selectedPool.apy}%</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Yield distributed: <strong>Monthly</strong>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {!investmentSuccess && (
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={handleConfirmInvestment}
                  disabled={!isAmountValid() || isInvesting}
                  className={`bg-gradient-to-r from-[#023D7A] to-[#00A8A8] hover:from-[#0d3352] hover:to-[#0D7A7A] ${
                    !isAmountValid() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isInvesting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Confirm Investment'
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  🚀 MVP TESTNET: Investment is simulated
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Redemption Modal */}
      {selectedPool && showRedeemModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowRedeemModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {redeemSuccess ? (
              /* Success State */
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Redemption Successful!</h2>
                <p className="text-gray-600 mb-6">
                  You've redeemed <strong className="text-green-600">{Number(redeemAmount).toLocaleString()} shares</strong> from {selectedPool.name}
                </p>
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-700">🚀 MVP TESTNET: This was a simulation</p>
                  <p className="text-xs text-green-600 mt-2">EUROD will be transferred to your wallet shortly</p>
                </div>
              </div>
            ) : (
              /* Redemption Form */
              <div>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-4xl mb-2">{selectedPool.icon}</div>
                      <h2 className="text-2xl font-bold text-gray-900">Redeem from {selectedPool.name}</h2>
                    </div>
                    <button onClick={() => setShowRedeemModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Position Info */}
                  {userPosition ? (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-[#00A8A8]/20">
                      <h3 className="text-sm font-bold text-[#023D7A] mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Your Position
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Shares Owned</p>
                          <p className="text-2xl font-bold text-[#023D7A]">{userPosition.shares.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Avg NAV/Share</p>
                          <p className="text-2xl font-bold text-[#00A8A8]">€{userPosition.average_nav.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Total Value</p>
                          <p className="text-xl font-bold text-green-700">€{(userPosition.shares * userPosition.average_nav).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Yield Earned</p>
                          <p className="text-xl font-bold text-green-600">+€{userPosition.total_yield_earned.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
                      <p className="text-sm text-amber-800 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        No active position in this pool
                      </p>
                    </div>
                  )}

                  {/* Redeem Amount Input */}
                  {userPosition && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Shares to Redeem</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={redeemAmount}
                            onChange={(e) => setRedeemAmount(e.target.value)}
                            placeholder="Enter number of shares"
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A8A8] text-lg font-semibold"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">uLP</span>
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                          <span className="text-gray-600">
                            Available: <strong>{userPosition.shares.toLocaleString()} shares</strong>
                          </span>
                          <span className="text-gray-600">
                            Value: <strong>€{redeemAmount ? (Number(redeemAmount) * userPosition.average_nav).toLocaleString() : '0'}</strong>
                          </span>
                        </div>
                        {!redeemAmount && (
                          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Enter shares to redeem
                          </p>
                        )}
                        {redeemAmount && Number(redeemAmount) > userPosition.shares && (
                          <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Insufficient shares (max: {userPosition.shares.toLocaleString()})
                          </p>
                        )}
                      </div>

                      {/* Quick Amount Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setRedeemAmount((userPosition.shares * 0.25).toString())}
                          disabled={userPosition.shares * 0.25 <= 0}
                          className={`flex-1 px-3 py-3 border-2 rounded-xl text-sm font-bold transition-all ${
                            redeemAmount === (userPosition.shares * 0.25).toString()
                              ? 'bg-[#00A8A8]/10 border-[#00A8A8] text-[#00A8A8]'
                              : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-[#00A8A8]/10 hover:border-[#00A8A8] hover:text-[#00A8A8]'
                          }`}
                        >
                          25%
                        </button>
                        <button
                          onClick={() => setRedeemAmount((userPosition.shares * 0.5).toString())}
                          disabled={userPosition.shares * 0.5 <= 0}
                          className={`flex-1 px-3 py-3 border-2 rounded-xl text-sm font-bold transition-all ${
                            redeemAmount === (userPosition.shares * 0.5).toString()
                              ? 'bg-[#00A8A8]/10 border-[#00A8A8] text-[#00A8A8]'
                              : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-[#00A8A8]/10 hover:border-[#00A8A8] hover:text-[#00A8A8]'
                          }`}
                        >
                          50%
                        </button>
                        <button
                          onClick={() => setRedeemAmount((userPosition.shares * 0.75).toString())}
                          disabled={userPosition.shares * 0.75 <= 0}
                          className={`flex-1 px-3 py-3 border-2 rounded-xl text-sm font-bold transition-all ${
                            redeemAmount === (userPosition.shares * 0.75).toString()
                              ? 'bg-[#00A8A8]/10 border-[#00A8A8] text-[#00A8A8]'
                              : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-[#00A8A8]/10 hover:border-[#00A8A8] hover:text-[#00A8A8]'
                          }`}
                        >
                          75%
                        </button>
                        <button
                          onClick={() => setRedeemAmount(userPosition.shares.toString())}
                          disabled={userPosition.shares <= 0}
                          className={`flex-1 px-3 py-3 border-2 rounded-xl text-sm font-bold transition-all ${
                            redeemAmount === userPosition.shares.toString()
                              ? 'bg-[#00A8A8]/10 border-[#00A8A8] text-[#00A8A8]'
                              : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-[#00A8A8]/10 hover:border-[#00A8A8] hover:text-[#00A8A8]'
                          }`}
                        >
                          100%
                        </button>
                      </div>

                      {/* Redemption Summary */}
                      {redeemAmount && Number(redeemAmount) > 0 && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                          <h3 className="text-sm font-bold text-green-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Redemption Summary
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Shares Redeemed</span>
                              <span className="font-bold text-gray-900">{Number(redeemAmount).toLocaleString()} uLP</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">NAV per Share</span>
                              <span className="font-bold text-gray-900">€{userPosition.average_nav.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Gross Amount</span>
                              <span className="font-bold text-gray-900">€{(Number(redeemAmount) * userPosition.average_nav).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Est. Management Fee (1%)</span>
                              <span className="font-bold text-red-600">-€{(Number(redeemAmount) * userPosition.average_nav * 0.01).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-green-200 pt-3 flex justify-between">
                              <span className="font-bold text-green-900">You Receive</span>
                              <span className="text-xl font-bold text-green-700">
                                €{(Number(redeemAmount) * userPosition.average_nav * 0.99).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Redemption Terms */}
                      <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Redemption Terms</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Lock-up period: <strong>{selectedPool.lockupDays} days</strong>
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Early redemption fee: <strong>0.5% (within 90 days)</strong>
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Processing time: <strong>1-3 business days</strong>
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Payout: <strong>EUROD to your wallet</strong>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>

                {/* Footer with Button */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={handleConfirmRedemption}
                    disabled={!isRedeemValid() || isRedeeming || !userPosition}
                    className={`bg-gradient-to-r from-[#023D7A] to-[#00A8A8] hover:from-[#0d3352] hover:to-[#0D7A7A] ${
                      !isRedeemValid() || !userPosition ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isRedeeming ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing Redemption...
                      </span>
                    ) : (
                      `Confirm Redemption${userPosition ? ` (€${redeemAmount ? (Number(redeemAmount) * userPosition.average_nav * 0.99).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'})` : ''}`
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    🚀 MVP TESTNET: Redemption is simulated
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pool Details Modal */}
      {selectedPool && showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedPool.icon}</div>
                  <div>
                    <Badge variant="primary" size="sm">{selectedPool.family}</Badge>
                    <h2 className="text-2xl font-bold text-gray-900 mt-2">{selectedPool.name}</h2>
                  </div>
                </div>
                <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-gray-700 text-lg">{selectedPool.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <p className="text-xs text-green-600 font-bold mb-1">TARGET YIELD</p>
                  <p className="text-2xl font-bold text-green-700">{selectedPool.targetYieldMin}-{selectedPool.targetYieldMax}%</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <p className="text-xs text-blue-600 font-bold mb-1">LOCK-UP</p>
                  <p className="text-2xl font-bold text-blue-700">{selectedPool.lockupDays} days</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <p className="text-xs text-purple-600 font-bold mb-1">POOL VALUE</p>
                  <p className="text-2xl font-bold text-purple-700">{formatCurrency(selectedPool.totalValue)}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
                  <p className="text-xs text-amber-600 font-bold mb-1">CURRENT APY</p>
                  <p className="text-2xl font-bold text-amber-700">{selectedPool.apy}%</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Asset Classes</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPool.assetClasses.map((assetClass) => (
                    <span key={assetClass} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                      {assetClass}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Minimum Investment</p>
                  <p className="text-xl font-bold text-gray-900">{formatFullCurrency(selectedPool.minInvestment)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Maximum Investment</p>
                  <p className="text-xl font-bold text-gray-900">{formatFullCurrency(selectedPool.maxInvestment)}</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border-2 ${getRiskColor(selectedPool.riskLevel)}`}>
                <p className="text-sm font-bold mb-1">RISK LEVEL</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedPool.riskLevel === 'low' ? '🟢' : selectedPool.riskLevel === 'medium' ? '🟡' : '🔴'}</span>
                  <span className="text-xl font-bold">{selectedPool.riskLevel.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 p-6 border-t border-gray-200 bg-white rounded-b-2xl">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={() => { setShowDetailsModal(false); setShowInvestModal(true); }}
                className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] hover:from-[#0d3352] hover:to-[#0D7A7A]"
              >
                Proceed to Invest
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">🏦 Testnet Deposit</h3>
                <button onClick={() => setShowDepositModal(false)} className="text-white/80 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Deposit Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">€</span>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 text-xl font-bold text-[#023D7A] border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A8A8] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Presets */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Quick Select</label>
                <div className="grid grid-cols-3 gap-2">
                  {(authUser?.role === 'INSTITUTIONAL_INVESTOR' 
                    ? [100000, 500000, 1000000] 
                    : [10000, 50000, 100000]
                  ).map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setDepositAmount(amt)}
                      className={`py-2 rounded-lg text-sm font-bold transition-colors ${
                        depositAmount === amt
                          ? 'bg-[#023D7A] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {formatFullCurrency(amt)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMockDeposit}
                  className="flex-1 py-3 bg-[#023D7A] hover:bg-[#0d3352] text-white font-bold rounded-xl transition-colors"
                >
                  Confirm Deposit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolMarketplace;
