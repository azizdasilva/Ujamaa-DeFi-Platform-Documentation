/**
 * Hybrid Compact Rail Navigation - Ujamaa DeFi Platform
 * 
 * Features:
 * - Slim icon rail on left (always visible)
 * - Expanded panel on hover/click with real routes
 * - Clean top bar for search, notifications, profile
 * - Role-aware: shows only routes the user can access
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ConnectWallet } from './wallet';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getNavItemsForRole, getDashboardForRole } from '../../config/navigation';

interface NavGroup {
  id: string;
  icon: string;
  label: string;
  items: { label: string; href: string; active?: boolean }[];
}

const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [pinnedGroup, setPinnedGroup] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Mock notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'KYC Approved', message: 'Your identity verification has been approved.', time: '2h ago', unread: true },
    { id: 2, title: 'Pool Yield Update', message: 'Pool Industrie NAV increased to €1.05', time: '5h ago', unread: true },
    { id: 3, title: 'Investment Confirmed', message: 'Your €10,000 investment in Pool Agriculture is confirmed.', time: '1d ago', unread: false },
    { id: 4, title: 'Document Reminder', message: 'Please upload your proof of address document.', time: '2d ago', unread: false },
  ]);

  const role = user?.role || 'ADMIN';
  const myDashboard = isAuthenticated ? getDashboardForRole(role) : '/';
  const navItems = getNavItemsForRole(role);

  // Filter: show only ONE dashboard link (user's own)
  const filteredNavItems = navItems.filter(item => {
    if (item.category === 'dashboard') {
      // Only show the user's own dashboard
      return item.href === myDashboard;
    }
    return true;
  });

  // Safety: if no dashboard matched, add the first one from navItems
  if (!filteredNavItems.some(item => item.category === 'dashboard')) {
    const firstDash = navItems.find(item => item.category === 'dashboard');
    if (firstDash) filteredNavItems.push(firstDash);
  }

  // Group nav items by category
  const categoryConfig: Record<string, { icon: string; label: string; order: number }> = {
    dashboard: { icon: '🏠', label: 'Dashboard', order: 0 },
    invest: { icon: '💰', label: 'Invest', order: 1 },
    operator: { icon: '🏭', label: 'Operations', order: 2 },
    compliance: { icon: '🛡️', label: 'Compliance', order: 3 },
    admin: { icon: '⚙️', label: 'Admin', order: 4 },
    regulator: { icon: '📋', label: 'Regulator', order: 5 },
    docs: { icon: '📚', label: 'Resources', order: 6 },
    test: { icon: '🔗', label: 'Tools', order: 7 },
    onboarding: { icon: '🚀', label: 'Onboarding', order: 8 },
  };

  const grouped: Record<string, NavGroup> = {};
  for (const item of filteredNavItems) {
    const cat = item.category || 'other';
    if (!grouped[cat]) {
      const cfg = categoryConfig[cat] || { icon: '📌', label: cat, order: 99 };
      grouped[cat] = { id: cat, icon: cfg.icon, label: cfg.label, items: [] };
    }
    grouped[cat].items.push({
      label: item.label,
      href: item.href,
      active: location.pathname === item.href || location.pathname.startsWith(item.href + '/'),
    });
  }

  const groups = Object.values(grouped).sort((a, b) => {
    const ao = categoryConfig[a.id]?.order ?? 99;
    const bo = categoryConfig[b.id]?.order ?? 99;
    return ao - bo;
  });

  const activeGroup = pinnedGroup || hoveredGroup;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(s => !s); }
      if (e.key === 'Escape') { setSearchOpen(false); setProfileOpen(false); setNotificationsOpen(false); setPinnedGroup(null); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Search results
  const allSearchResults = filteredNavItems.map(item => ({ title: item.label, href: item.href, icon: item.icon }));
  const filteredResults = searchQuery
    ? allSearchResults.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const currentPageLabel = navItems.find(n =>
    location.pathname === n.href || location.pathname.startsWith(n.href + '/')
  )?.label || 'Ujamaa DeFi';

  return (
    <>
      {/* ─── Slim Icon Rail ─── */}
      <aside className="fixed left-0 top-0 bottom-0 w-16 bg-[#1e293b] z-50 flex flex-col items-center py-3">
        {/* Logo */}
        <Link to={isAuthenticated ? getDashboardForRole(role) : '/'} className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A8A8] to-[#0D7A7A] flex items-center justify-center text-white font-bold text-lg mb-4 hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-[#00A8A8]/20">
          U
        </Link>

        {/* Nav Groups */}
        <nav className="flex-1 flex flex-col items-center gap-1 w-full px-2">
          {groups.map(group => {
            const isActive = activeGroup === group.id;
            const hasActive = group.items.some(i => i.active);
            return (
              <div key={group.id} className="relative w-full">
                <button
                  onClick={() => setPinnedGroup(pinnedGroup === group.id ? null : group.id)}
                  onMouseEnter={() => setHoveredGroup(group.id)}
                  className={`w-full h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                    isActive ? 'bg-[#00A8A8]/30 text-white shadow-lg' : hasActive ? 'text-white/90 bg-white/15' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  title={group.label}
                >
                  {group.icon}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-1 w-full px-2 pb-2">
          {/* Search */}
          <button onClick={() => setSearchOpen(s => !s)} className="w-10 h-10 rounded-lg flex items-center justify-center text-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors" title="Search (⌘K)">🔍</button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="w-10 h-10 rounded-lg flex items-center justify-center text-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors" title="Notifications">
              🔔
              {notifications.filter(n => n.unread).length > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1e293b]" />}
            </button>
            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-[99]" onClick={() => setNotificationsOpen(false)} />
                <div className="absolute bottom-12 left-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[100]">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button
                      onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                      className="text-xs text-[#00A8A8] hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-400 text-sm">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-gray-50 ${n.unread ? 'bg-blue-50/50' : ''}`}>
                        <p className="text-sm font-medium text-gray-900">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Language */}
          <div ref={langRef} className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 px-2 h-10 rounded-lg text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white transition-colors" title="Switch Language">
              🌐
              <span className={`uppercase ${language === 'en' ? 'text-blue-400' : 'text-red-400'}`}>{language}</span>
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-[99]" onClick={() => setLangOpen(false)} />
                <div className="absolute bottom-12 left-0 w-44 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[100]">
                  <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">Select Language</p>
                  <button
                    onClick={() => { setLanguage('en'); setLangOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors ${language === 'en' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {/* UK Flag SVG */}
                    <svg viewBox="0 0 60 30" className="w-8 h-5 rounded-sm border border-gray-200 flex-shrink-0">
                      <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
                      <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
                      <g clipPath="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/><path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/></g>
                    </svg>
                    <div>
                      <p className="font-medium">English</p>
                      <p className="text-[10px] text-gray-400">MVP</p>
                    </div>
                    {language === 'en' && <span className="ml-auto text-blue-600">✓</span>}
                  </button>
                  <button
                    onClick={() => { setLanguage('fr'); setLangOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors ${language === 'fr' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {/* France Flag SVG */}
                    <svg viewBox="0 0 45 30" className="w-8 h-5 rounded-sm border border-gray-200 flex-shrink-0">
                      <path d="M0,0 h15 v30 h-15 z" fill="#002395"/>
                      <path d="M15,0 h15 v30 h-15 z" fill="#FFFFFF"/>
                      <path d="M30,0 h15 v30 h-15 z" fill="#ED2939"/>
                    </svg>
                    <div>
                      <p className="font-medium">Français</p>
                      <p className="text-[10px] text-gray-400">Production</p>
                    </div>
                    {language === 'fr' && <span className="ml-auto text-blue-600">✓</span>}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative w-full">
            <button onClick={() => setProfileOpen(!profileOpen)} className="w-10 h-10 rounded-lg flex items-center justify-center text-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors" title="Profile">👤</button>
            {profileOpen && (
              <div className="absolute bottom-12 left-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[100]">
                <div className="p-4 bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white">
                  <p className="font-semibold">{user?.name || 'User'}</p>
                  <p className="text-xs text-white/60">{user?.email || ''}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-semibold">{role.replace(/_/g, ' ')}</span>
                </div>
                <div className="p-2">
                  <Link to={getDashboardForRole(role)} onClick={() => setProfileOpen(false)} className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2">
                    📊 My Dashboard
                  </Link>
                  <button onClick={() => { logout(); navigate('/login'); setProfileOpen(false); }} className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ─── Expanded Panel ─── */}
      {activeGroup && (
        <>
          {/* Invisible bridge to prevent hover gap */}
          <div className="fixed left-14 top-0 bottom-0 w-4 z-30" 
            onMouseEnter={() => setHoveredGroup(activeGroup)}
            onMouseLeave={() => { if (!pinnedGroup) setHoveredGroup(null); }} />
          <div className="fixed left-16 top-0 bottom-0 w-60 bg-white border-r border-gray-200 z-40 shadow-lg overflow-hidden"
          onMouseEnter={() => setHoveredGroup(activeGroup)}
          onMouseLeave={() => { if (!pinnedGroup) setHoveredGroup(null); }}>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{groups.find(g => g.id === activeGroup)?.label}</h3>
            {pinnedGroup === activeGroup && (
              <button onClick={() => setPinnedGroup(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
            )}
          </div>
          <nav className="p-2 space-y-0.5 overflow-y-auto h-[calc(100%-3rem)]">
            {groups.find(g => g.id === activeGroup)?.items.map(item => (
              <Link key={item.href} to={item.href} onClick={() => setPinnedGroup(null)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${item.active ? 'bg-[#00A8A8]/10 text-[#00A8A8] font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-[#00A8A8]' : 'bg-gray-300'}`} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        </>
      )}

      {/* ─── Top Bar ─── */}
      <header className="fixed top-0 left-16 right-0 h-[120px] bg-white border-b border-gray-200 z-30 flex items-center px-6 justify-between">
        {/* Left: Logo */}
        <div className="flex flex-col items-start gap-1">
          <img src="/assets/images/logo-transparent.png" alt="Ujamaa DeFi" className="h-[80px] w-auto" />
          <p className="text-xs text-gray-500 font-medium tracking-wide">Institutional-Grade African Real-World Asset Tokenization</p>
        </div>

        {/* Center: Connected Wallet */}
        <div className="flex-1 flex justify-center">
          {isAuthenticated && <ConnectWallet size="md" variant="primary" showBalance={true} />}
        </div>

        {/* Right: Network + User */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Polygon Amoy Testnet
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00A8A8] to-[#023D7A] flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-gray-700 leading-none">{user?.name?.split(' ')[0] || 'User'}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{role.replace(/_/g, ' ')}</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ─── Search Overlay ─── */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-20" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
              <span className="text-lg">🔍</span>
              <input type="text" autoFocus placeholder="Search pages..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 text-sm outline-none text-gray-900 placeholder-gray-400" />
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 rounded text-gray-500">ESC</kbd>
            </div>
            {filteredResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {filteredResults.map(r => (
                  <Link key={r.href} to={r.href} onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <span className="text-lg">{r.icon}</span>
                    <span className="text-sm text-gray-900">{r.title}</span>
                  </Link>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="p-8 text-center text-gray-500 text-sm">No results for "{searchQuery}"</div>
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">Start typing to search...</div>
            )}
          </div>
        </div>
      )}

      {/* ─── Spacer for content ─── */}
      <div className="w-16" />
      <div className="fixed top-14 left-16 right-0 h-px bg-transparent pointer-events-none" />
    </>
  );
};

export default Navigation;
