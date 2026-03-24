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
import TestnetNotice from './TestnetNotice';

const Navigation: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Search results - all searchable pages
  const searchResults = [
    { title: 'Pool Marketplace', href: '/institutional/pools', category: 'Invest', tags: ['pools', 'invest', 'marketplace'] },
    { title: 'Pool Dashboard', href: '/pool/dashboard', category: 'Invest', tags: ['pool', 'kpi', 'dashboard', 'metrics'] },
    { title: 'Deep Dive Documentation', href: '/deep-dive', category: 'Learn', tags: ['technical', 'docs', 'documentation'] },
    { title: 'Investors Room', href: '/investors-room', category: 'Documents', tags: ['documents', 'investor', 'reports'] },
    { title: 'Token Comparison Guide', href: '/investors-room/token-comparison-guide', category: 'Documents', tags: ['tokens', 'uat', 'upt', 'ugt', 'comparison'] },
    { title: 'Investor FAQ', href: '/investors-room/investor-faq', category: 'Documents', tags: ['faq', 'questions', 'help'] },
    { title: 'White Paper', href: '/investors-room/white-paper', category: 'Documents', tags: ['whitepaper', 'technical'] },
    { title: 'Documentation Index', href: '/investors-room/documentation-index', category: 'Documents', tags: ['index', 'catalog'] },
    { title: 'Submit Asset', href: '/originator/assets/submit', category: 'Originator', tags: ['asset', 'tokenize', 'submit'] },
    { title: 'View Certificates', href: '/originator/assets/certificates', category: 'Originator', tags: ['certificates', 'view'] },
    { title: 'Glossary', href: '/docs/glossary', category: 'Learn', tags: ['glossary', 'terms', 'definitions'] },
    { title: 'Investor Onboarding', href: '/investor/onboarding', category: 'Account', tags: ['onboarding', 'signup', 'register', 'investor'] },
    { title: 'Industrial Operator Onboarding', href: '/industrial-operator/onboarding', category: 'Account', tags: ['onboarding', 'signup', 'operator', 'industrial'] },
  ];

  // Filter search results based on query
  const filteredResults = searchResults.filter(result => {
    const query = searchQuery.toLowerCase();
    return (
      result.title.toLowerCase().includes(query) ||
      result.tags.some(tag => tag.toLowerCase().includes(query)) ||
      result.category.toLowerCase().includes(query)
    );
  });

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
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#48A9F0]/30 py-2 z-[10000] animate-scaleIn">
                      <div className="px-4 py-3 border-b border-[#48A9F0]/30 bg-[#F3F8FA]">
                        <p className="text-sm font-bold text-[#023D7A]">Quick Actions</p>
                        <p className="text-xs text-[#333333] mt-1">Access key platform features</p>
                      </div>
                      <div className="p-4">
                        {/* Clear Demo Data - TOP of menu */}
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
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-700 font-bold hover:bg-red-50 rounded-lg transition-colors border border-red-200 bg-red-50 mb-2"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Clear Demo Data
                        </button>
                        
                        <a href="/pool/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm text-[#023D7A] font-bold hover:bg-[#F3F8FA] rounded-lg transition-colors bg-gradient-to-r from-[#00A8A8]/10 to-[#023D7A]/10 border border-[#00A8A8]/30">
                          <svg className="w-4 h-4 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Pool Dashboard (KPIs)
                        </a>
                        <a href="/investor/onboarding" className="flex items-center gap-3 px-3 py-2 text-sm text-[#023D7A] font-bold hover:bg-[#F3F8FA] rounded-lg transition-colors mt-2">
                          <svg className="w-4 h-4 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          Investor Onboarding
                        </a>
                        <a href="/industrial-operator/onboarding" className="flex items-center gap-3 px-3 py-2 text-sm text-[#023D7A] font-bold hover:bg-[#F3F8FA] rounded-lg transition-colors mt-2">
                          <svg className="w-4 h-4 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Industrial Operator Onboarding
                        </a>
                        <a href="/originator/assets/submit" className="flex items-center gap-3 px-3 py-2 text-sm text-[#023D7A] font-bold hover:bg-[#F3F8FA] rounded-lg transition-colors mt-2">
                          <svg className="w-4 h-4 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Submit Asset
                        </a>
                        <a href="/originator/assets/certificates" className="flex items-center gap-3 px-3 py-2 text-sm text-[#023D7A] font-bold hover:bg-[#F3F8FA] rounded-lg transition-colors mt-1">
                          <svg className="w-4 h-4 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          View Certificates
                        </a>
                        <a href="/institutional/pools" className="flex items-center gap-3 px-3 py-2 text-sm text-[#023D7A] font-bold hover:bg-[#F3F8FA] rounded-lg transition-colors mt-1">
                          <svg className="w-4 h-4 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Pool Marketplace
                        </a>
                        <a href="/deep-dive" className="flex items-center gap-3 px-3 py-2 text-sm text-[#023D7A] font-bold hover:bg-[#F3F8FA] rounded-lg transition-colors mt-1">
                          <svg className="w-4 h-4 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253" />
                          </svg>
                          Deep Dive
                        </a>
                        <a href="/docs/glossary" className="flex items-center gap-3 px-3 py-2 text-sm text-[#023D7A] font-bold hover:bg-[#F3F8FA] rounded-lg transition-colors mt-1">
                          <svg className="w-4 h-4 text-[#00A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253" />
                          </svg>
                          Glossary
                        </a>
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

              {/* Testnet Badge */}
              <TestnetNotice variant="badge" />

              {/* Role Selector / Dashboard Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40"
                  title="Select Role / Dashboard"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-white font-bold text-sm hidden sm:block">Choose Role</span>
                  </div>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-[9999]" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#48A9F0]/30 py-2 z-[10000] animate-scaleIn">
                      <div className="px-4 py-3 border-b border-[#48A9F0]/30 bg-[#F3F8FA]">
                        <p className="text-sm font-bold text-[#023D7A]">Select Your Role</p>
                        <p className="text-xs text-[#333333] mt-1">Choose a dashboard or switch roles</p>
                      </div>
                      
                      {/* Quick Access */}
                      <div className="px-4 py-3 border-b border-[#48A9F0]/30">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quick Access</p>
                        <a href="/originator/dashboard" className="block px-3 py-2 text-sm text-[#023D7A] font-bold hover:bg-[#F3F8FA] rounded-lg transition-colors">
                          📊 My Dashboard
                        </a>
                        <a href="/investors-room" className="block px-3 py-2 text-sm text-[#023D7A] font-bold hover:bg-[#F3F8FA] rounded-lg transition-colors mt-1">
                          📚 Investors Room
                        </a>
                      </div>
                      
                      {/* Switch Role */}
                      <div className="px-4 py-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Switch Role</p>
                        <a href="/select-role" className="block px-3 py-2 text-sm text-[#00A8A8] font-bold hover:bg-[#F3F8FA] rounded-lg transition-colors">
                          🔄 Choose Different Role
                        </a>
                      </div>
                      
                      {/* Sign Out */}
                      <div className="border-t border-[#48A9F0]/30 mt-2 pt-2">
                        <button 
                          onClick={() => {
                            setProfileOpen(false);
                            alert('🚀 MVP TESTNET: Sign out functionality will be connected to wallet disconnection in production.');
                          }} 
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50"
                        >
                          🚪 Sign Out
                        </button>
                      </div>
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
                      <a href="/institutional/pools" className="flex items-center gap-3 px-3 py-2 text-sm text-[#023D7A] hover:bg-[#F3F8FA] rounded-lg">
                        <svg className="w-4 h-4 text-[#333333]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Pool Marketplace
                      </a>
                      <a href="/investors-room" className="flex items-center gap-3 px-3 py-2 text-sm text-[#023D7A] hover:bg-[#F3F8FA] rounded-lg">
                        <svg className="w-4 h-4 text-[#333333]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Investors Room (35 docs)
                      </a>
                      <a href="/originator/assets/submit" className="flex items-center gap-3 px-3 py-2 text-sm text-[#023D7A] hover:bg-[#F3F8FA] rounded-lg">
                        <svg className="w-4 h-4 text-[#333333]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Submit Asset for Tokenization
                      </a>
                      <a href="/docs/glossary" className="flex items-center gap-3 px-3 py-2 text-sm text-[#023D7A] hover:bg-[#F3F8FA] rounded-lg">
                        <svg className="w-4 h-4 text-[#333333]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253" />
                        </svg>
                        📖 Glossary
                      </a>
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
