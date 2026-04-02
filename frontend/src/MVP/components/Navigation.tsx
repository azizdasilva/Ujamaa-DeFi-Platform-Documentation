/**
 * Modern Navigation Bar
 * Features:
 * - Global search with keyboard shortcut (Cmd/Ctrl+K)
 * - Quick actions dropdown
 * - Notifications with badge
 * - User profile menu
 * - Responsive design
 * - Smooth animations
 */

import React, { useState, useEffect } from 'react';
import { ConnectWallet } from './wallet';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LogoutButton from './LogoutButton';
import { getNavItemsForRole, getDashboardForRole, canAccessPath } from '../../config/navigation';
import { InvestorRole } from '../../types';

const Navigation: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  // Search results - filtered by user role
  const allSearchResults = [
    { title: 'Pool Marketplace', href: '/institutional/pools', category: 'Invest', tags: ['pools', 'invest', 'marketplace'], roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN'] as InvestorRole[] },
    { title: 'Pool Dashboard', href: '/pool/dashboard', category: 'Invest', tags: ['pool', 'kpi', 'dashboard', 'metrics'], roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN', 'REGULATOR'] as InvestorRole[] },
    { title: 'Blockchain Monitoring', href: '/monitor', category: 'Analytics', tags: ['blockchain', 'monitor', 'analytics', 'kpi', 'polygon', 'contracts'], roles: ['ADMIN', 'REGULATOR', 'COMPLIANCE_OFFICER'] as InvestorRole[] },
    { title: 'Contract Test Dashboard', href: '/contract-test', category: 'Developer', tags: ['contracts', 'test', 'blockchain', 'developer', 'addresses'], roles: ['ADMIN'] as InvestorRole[] },
    { title: 'Deep Dive Documentation', href: '/deep-dive', category: 'Learn', tags: ['technical', 'docs', 'documentation'], roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'INDUSTRIAL_OPERATOR', 'COMPLIANCE_OFFICER', 'ADMIN', 'REGULATOR'] as InvestorRole[] },
    { title: 'Investors Room', href: '/investors-room', category: 'Documents', tags: ['documents', 'investor', 'reports'], roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN'] as InvestorRole[] },
    { title: 'Token Comparison Guide', href: '/investors-room/token-comparison-guide', category: 'Documents', tags: ['tokens', 'uat', 'upt', 'ugt', 'comparison'], roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN'] as InvestorRole[] },
    { title: 'Investor FAQ', href: '/investors-room/investor-faq', category: 'Documents', tags: ['faq', 'questions', 'help'], roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN'] as InvestorRole[] },
    { title: 'White Paper', href: '/investors-room/white-paper', category: 'Documents', tags: ['whitepaper', 'technical'], roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'INDUSTRIAL_OPERATOR', 'COMPLIANCE_OFFICER', 'ADMIN', 'REGULATOR'] as InvestorRole[] },
    { title: 'Documentation Index', href: '/investors-room/documentation-index', category: 'Documents', tags: ['index', 'catalog'], roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN'] as InvestorRole[] },
    { title: 'Submit Asset', href: '/originator/assets/submit', category: 'Originator', tags: ['asset', 'tokenize', 'submit'], roles: ['INDUSTRIAL_OPERATOR', 'ADMIN'] as InvestorRole[] },
    { title: 'View Certificates', href: '/originator/assets/certificates', category: 'Originator', tags: ['certificates', 'view'], roles: ['INDUSTRIAL_OPERATOR', 'COMPLIANCE_OFFICER', 'REGULATOR', 'ADMIN'] as InvestorRole[] },
    { title: 'Glossary', href: '/docs/glossary', category: 'Learn', tags: ['glossary', 'terms', 'definitions'], roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'INDUSTRIAL_OPERATOR', 'COMPLIANCE_OFFICER', 'ADMIN', 'REGULATOR'] as InvestorRole[] },
    { title: 'Investor Onboarding', href: '/investor/onboarding', category: 'Account', tags: ['onboarding', 'signup', 'register', 'investor'], roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN'] as InvestorRole[] },
    { title: 'Industrial Operator Onboarding', href: '/industrial-operator/onboarding', category: 'Account', tags: ['onboarding', 'signup', 'operator', 'industrial'], roles: ['INDUSTRIAL_OPERATOR', 'ADMIN'] as InvestorRole[] },
    { title: 'KYC Review', href: '/compliance/kyc-review', category: 'Compliance', tags: ['kyc', 'review', 'compliance'], roles: ['COMPLIANCE_OFFICER', 'ADMIN'] as InvestorRole[] },
    { title: 'My Dashboard', href: '/institutional/dashboard', category: 'Dashboard', tags: ['dashboard', 'institutional'], roles: ['INSTITUTIONAL_INVESTOR', 'ADMIN'] as InvestorRole[] },
    { title: 'My Dashboard', href: '/retail/dashboard', category: 'Dashboard', tags: ['dashboard', 'retail'], roles: ['RETAIL_INVESTOR', 'ADMIN'] as InvestorRole[] },
    { title: 'My Dashboard', href: '/originator/dashboard', category: 'Dashboard', tags: ['dashboard', 'operator'], roles: ['INDUSTRIAL_OPERATOR', 'ADMIN'] as InvestorRole[] },
    { title: 'My Dashboard', href: '/compliance/dashboard', category: 'Dashboard', tags: ['dashboard', 'compliance'], roles: ['COMPLIANCE_OFFICER', 'ADMIN'] as InvestorRole[] },
    { title: 'My Dashboard', href: '/admin/dashboard', category: 'Dashboard', tags: ['dashboard', 'admin'], roles: ['ADMIN'] as InvestorRole[] },
    { title: 'My Dashboard', href: '/regulator/dashboard', category: 'Dashboard', tags: ['dashboard', 'regulator'], roles: ['REGULATOR', 'ADMIN'] as InvestorRole[] },
  ];

  // Filter search results based on query AND user role
  const filteredResults = allSearchResults.filter(result => {
    const query = searchQuery.toLowerCase();
    // Check role access
    const hasAccess = !isAuthenticated || !user || result.roles.includes(user.role) || user.role === 'ADMIN';
    // Check search query match
    const matchesQuery = (
      result.title.toLowerCase().includes(query) ||
      result.tags.some(tag => tag.toLowerCase().includes(query)) ||
      result.category.toLowerCase().includes(query)
    );
    return hasAccess && matchesQuery;
  });

  // Get role-specific quick actions
  const getQuickActionsForRole = () => {
    if (!isAuthenticated || !user) {
      // Show all actions for non-authenticated users (with highlights)
      return allSearchResults.filter(r => 
        ['Dashboard', 'Invest', 'Originator', 'Compliance'].includes(r.category)
      ).slice(0, 8);
    }
    
    // Filter by user role
    return allSearchResults.filter(result => {
      const hasAccess = result.roles.includes(user.role) || user.role === 'ADMIN';
      // Prioritize certain categories for quick actions
      const isQuickAction = ['Dashboard', 'Invest', 'Originator', 'Compliance', 'Account'].includes(result.category);
      return hasAccess && isQuickAction;
    }).slice(0, 10);
  };

  const quickActions = getQuickActionsForRole();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setQuickActionsOpen(false);
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mock notifications
  const notifications = [
    { id: 1, title: 'Asset Certified', message: 'Your cotton bales certificate is ready', time: '2m ago', unread: true },
    { id: 2, title: 'Financing Approved', message: 'Pool Industry approved €2M financing', time: '1h ago', unread: true },
    { id: 3, title: 'Yield Distributed', message: '€12,500 yield distributed to your account', time: '3h ago', unread: false },
  ];

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50
          bg-[#023D7A] border-b border-[#48A9F0]/30
          transition-all duration-300
          ${scrolled ? 'shadow-xl' : 'shadow-lg'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <img
                src="/assets/images/logo-transparent.png"
                alt="Ujamaa DeFi Logo"
                className="h-48 w-auto group-hover:scale-105 transition-transform duration-300"
              />
            </a>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-xl mx-8 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search pools, assets, documents... (⌘K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  className="
                    w-full px-4 py-2.5 pl-11
                    bg-[#F3F8FA]/90 hover:bg-[#F3F8FA] focus:bg-white
                    border border-transparent focus:border-[#00A8A8]
                    rounded-xl
                    text-sm
                    text-[#023D7A]
                    placeholder-[#333333]/60
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#00A8A8]/30
                  "
                />
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#333333]/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-[#F3F8FA]/70 bg-[#023D7A]/50 rounded border border-[#023D7A]/30">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden p-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Quick Actions */}
              <div className="relative">
                <button
                  onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40"
                  title="Quick Actions - Access key features"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-white font-bold text-sm hidden sm:block">Quick Actions</span>
                  </div>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {quickActionsOpen && (
                  <>
                    <div className="fixed inset-0 z-[9999]" onClick={() => setQuickActionsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#48A9F0]/30 py-2 z-[10000] animate-scaleIn max-h-[80vh] overflow-y-auto">
                      <div className="px-4 py-3 border-b border-[#48A9F0]/30 bg-[#F3F8FA]">
                        <p className="text-sm font-bold text-[#023D7A]">Quick Actions</p>
                        <p className="text-xs text-[#333333] mt-1">
                          {isAuthenticated && user ? 'Access key features for your role' : 'Access key platform features'}
                        </p>
                      </div>
                      <div className="p-4">
                        {/* Clear Demo Data - Show to all */}
                        <button
                          onClick={() => {
                            if (confirm('Clear ALL demo data? This will remove:\n\n• All submitted assets & certificates\n• All onboarding data (investor & operator)\n• All uploaded documents\n• All form submissions\n\nThis cannot be undone.')) {
                              sessionStorage.removeItem('submittedAsset');
                              sessionStorage.removeItem('onboardingData');
                              sessionStorage.removeItem('onboardingDocs');
                              sessionStorage.removeItem('onboardingSubmitted');
                              sessionStorage.removeItem('onboardingSubmitTime');
                              alert('✓ All demo data cleared!\n\n• Submitted assets: CLEARED\n• Onboarding data: CLEARED\n• Uploaded documents: CLEARED\n• Form submissions: CLEARED\n\nRefreshing page...');
                              window.location.reload();
                            }
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-700 font-bold hover:bg-red-50 rounded-lg transition-colors border border-red-200 bg-red-50 mb-3"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Clear Demo Data
                        </button>

                        {/* Role-Specific Quick Actions */}
                        {quickActions.map((action, idx) => {
                          // Special styling for admin-only features
                          const isAdminOnly = action.roles.length === 1 && action.roles[0] === 'ADMIN';
                          const isHighlighted = isAdminOnly || action.category === 'Dashboard';
                          
                          return (
                            <a
                              key={idx}
                              href={action.href}
                              className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-bold rounded-lg transition-colors mb-2 ${
                                isHighlighted
                                  ? 'text-[#00A8A8] bg-gradient-to-r from-[#00A8A8]/10 to-[#023D7A]/10 border border-[#00A8A8]/30'
                                  : 'text-[#023D7A] hover:bg-[#F3F8FA]'
                              }`}
                            >
                              {action.category === 'Dashboard' && '📊'}
                              {action.category === 'Invest' && '🏛️'}
                              {action.category === 'Originator' && '📝'}
                              {action.category === 'Compliance' && '✓'}
                              {action.category === 'Analytics' && '📈'}
                              {action.category === 'Developer' && '🔧'}
                              {action.category === 'Account' && '👤'}
                              {action.title}
                              {isAdminOnly && <span className="ml-auto text-xs px-2 py-0.5 bg-[#00A8A8]/20 text-[#00A8A8] rounded">Admin</span>}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Notifications"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                  )}
                </button>

                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-[9999]" onClick={() => setNotificationsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#48A9F0]/30 z-[10000] animate-scaleIn">
                      <div className="px-4 py-3 border-b border-[#48A9F0]/30">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[#023D7A]">Notifications</h3>
                          <button className="text-xs text-[#00A8A8] hover:text-[#008f8f]">Mark all read</button>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 border-b border-[#48A9F0]/20 hover:bg-[#F3F8FA] cursor-pointer ${notification.unread ? 'bg-[#023D7A]/5' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 mt-2 rounded-full ${notification.unread ? 'bg-[#00A8A8]' : 'bg-gray-300'}`} />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-[#023D7A]">{notification.title}</p>
                                <p className="text-sm text-[#333333] mt-0.5">{notification.message}</p>
                                <p className="text-xs text-[#333333]/60 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-3 border-t border-[#48A9F0]/30 text-center">
                        <button
                          onClick={() => {
                            setNotificationsOpen(false);
                            alert('🚀 MVP TESTNET: Full notifications center coming in production. All notifications are shown above.');
                          }}
                          className="text-sm text-[#023D7A] hover:text-[#012d5c] font-medium"
                        >
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Language Switch */}
              <div className="relative">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40"
                  title="Switch Language"
                >
                  <span className="text-white font-bold text-sm">🌐 {language.toUpperCase()}</span>
                </button>
              </div>

              {/* Connect Wallet - Only visible for authenticated users */}
              {isAuthenticated && <ConnectWallet size="sm" variant="ghost" />}

              {/* Role Selector / Dashboard Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40"
                  title="Select Role / Dashboard"
                >
                  <div className="flex items-center gap-2">
                    {isAuthenticated ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    <span className="text-white font-bold text-sm hidden sm:block">
                      {isAuthenticated ? user?.name?.split(' ')[0] || 'User' : 'Choose Role'}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-[9999]" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#48A9F0]/30 py-2 z-[10000] animate-scaleIn max-h-[70vh] overflow-y-auto">
                      <div className="px-4 py-3 border-b border-[#48A9F0]/30 bg-[#F3F8FA]">
                        <p className="text-sm font-bold text-[#023D7A]">Menu</p>
                        <p className="text-xs text-[#333333] mt-1">
                          {isAuthenticated ? `Logged in as ${user?.name}` : 'Choose a dashboard'}
                        </p>
                      </div>

                      {/* User Info (when logged in) */}
                      {isAuthenticated && user && (
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Logged In As</p>
                          <p className="text-sm font-bold text-[#023D7A] truncate">{user.name}</p>
                          <p className="text-xs text-gray-600 truncate">{user.email}</p>
                          <p className="text-xs text-gray-500 mt-1">Role: {user.role.replace(/_/g, ' ')}</p>
                        </div>
                      )}

                      {/* Role-Specific Quick Access */}
                      {isAuthenticated && user && (
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quick Access</p>
                          <a 
                            href={getDashboardForRole(user.role)} 
                            className="block px-3 py-2 text-sm text-[#023D7A] font-bold hover:bg-[#F3F8FA] rounded-lg transition-colors mb-2"
                          >
                            📊 My Dashboard
                          </a>
                          {/* Show role-specific menu items */}
                          {getNavItemsForRole(user.role)
                            .filter(item => item.category && !['dashboard', 'test'].includes(item.category))
                            .slice(0, 4)
                            .map((item, idx) => (
                              <a
                                key={idx}
                                href={item.href}
                                className="block px-3 py-2 text-sm text-[#023D7A] hover:bg-[#F3F8FA] rounded-lg transition-colors"
                              >
                                {item.icon} {item.label}
                              </a>
                            ))
                          }
                        </div>
                      )}

                      {/* Switch Role */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Switch Role</p>
                        <a href="/select-role" className="block px-3 py-2 text-sm text-[#00A8A8] font-bold hover:bg-[#F3F8FA] rounded-lg transition-colors">
                          🔄 Choose Different Role
                        </a>
                        <a href="/demo-accounts" className="block px-3 py-2 text-sm text-[#00A8A8] font-bold hover:bg-[#F3F8FA] rounded-lg transition-colors mt-1">
                          🎯 Try Demo Accounts
                        </a>
                      </div>

                      {/* Sign Out */}
                      {isAuthenticated && (
                        <div className="px-4 py-3">
                          <LogoutButton variant="menu-item" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[10001]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn max-h-[70vh] flex flex-col">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#48A9F0]/30 flex-shrink-0">
                <svg className="w-5 h-5 text-[#333333]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search pages, documents, features... (⌘K)"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-base focus:outline-none text-[#023D7A]"
                />
                <kbd className="px-2 py-1 text-xs text-[#333333]/60 bg-[#F3F8FA] rounded">ESC</kbd>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                {searchQuery === '' ? (
                  <>
                    <p className="text-xs text-[#333333] mb-2">Quick Links</p>
                    <div className="space-y-1">
                      {/* Show role-filtered quick links */}
                      {allSearchResults
                        .filter(r => {
                          if (!isAuthenticated || !user) return true; // Show all for non-authenticated
                          return r.roles.includes(user.role) || user.role === 'ADMIN';
                        })
                        .filter(r => ['Dashboard', 'Invest', 'Documents'].includes(r.category))
                        .slice(0, 6)
                        .map((result, idx) => (
                          <a
                            key={idx}
                            href={result.href}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-[#023D7A] hover:bg-[#F3F8FA] rounded-lg"
                          >
                            <svg className="w-4 h-4 text-[#333333]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {result.title}
                          </a>
                        ))
                      }
                    </div>
                  </>
                ) : filteredResults.length > 0 ? (
                  <>
                    <p className="text-xs text-[#333333] mb-2">Search Results ({filteredResults.length})</p>
                    <div className="space-y-1">
                      {filteredResults.map((result, idx) => (
                        <a key={idx} href={result.href} className="flex items-center gap-3 px-3 py-2 text-sm text-[#023D7A] hover:bg-[#F3F8FA] rounded-lg">
                          <span className="text-xs px-2 py-0.5 bg-[#00A8A8]/10 text-[#00A8A8] rounded font-medium">{result.category}</span>
                          <span className="flex-1">{result.title}</span>
                        </a>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#333333]">No results found for "<span className="font-bold">{searchQuery}</span>"</p>
                    <p className="text-xs text-[#333333]/60 mt-2">Try different keywords or browse quick links</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed nav with gap */}
      <div className="h-24" />
    </>
  );
};

export default Navigation;
