/**
 * Role-based Navigation Configuration
 * Defines which menu items are visible for each role
 *
 * Role Hierarchy:
 *   ADMIN            → Full access (read + write everywhere)
 *   COMPLIANCE_OFFICER → View everything + compliance write operations
 *   REGULATOR        → View everything (read-only global access)
 *   INVESTOR/OPERATOR → Access their own areas only
 */

import { InvestorRole } from '../../types';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: InvestorRole[]; // Which roles can see this item
  category?: string;
}

// Helper: all roles
const ALL: InvestorRole[] = ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'INDUSTRIAL_OPERATOR', 'COMPLIANCE_OFFICER', 'ADMIN', 'REGULATOR'];
// Global viewers (can see everything but not write-admin pages)
const GLOBAL_VIEW: InvestorRole[] = ['COMPLIANCE_OFFICER', 'ADMIN', 'REGULATOR'];

// COMPLIANCE_OFFICER specific: ONLY compliance workflow items (not global view)
const COMPLIANCE_ONLY: InvestorRole[] = ['COMPLIANCE_OFFICER'];

/**
 * Get the correct dashboard/pools path based on user role
 */
export function getRolePath(role: InvestorRole, pathType: 'dashboard' | 'pools'): string {
  switch (role) {
    case 'RETAIL_INVESTOR':
      return pathType === 'dashboard' ? '/retail/dashboard' : '/retail/pools';
    case 'INDUSTRIAL_OPERATOR':
      return pathType === 'dashboard' ? '/originator/dashboard' : '/originator/assets/submit';
    case 'COMPLIANCE_OFFICER':
      return pathType === 'dashboard' ? '/compliance/dashboard' : '/compliance/kyc-review';
    case 'REGULATOR':
      return pathType === 'dashboard' ? '/regulator/dashboard' : '/regulator/compliance';
    case 'ADMIN':
      return pathType === 'dashboard' ? '/admin/dashboard' : '/admin/pools';
    case 'INSTITUTIONAL_INVESTOR':
    default:
      return pathType === 'dashboard' ? '/institutional/dashboard' : '/institutional/pools';
  }
}

export const navigationItems: NavItem[] = [
  // ── Dashboard Links (each role's own dashboard) ──
  {
    label: 'My Dashboard',
    href: '/institutional/dashboard',
    icon: '📊',
    roles: ['INSTITUTIONAL_INVESTOR', 'ADMIN', 'REGULATOR'],
    category: 'dashboard',
  },
  {
    label: 'My Dashboard',
    href: '/retail/dashboard',
    icon: '📊',
    roles: ['RETAIL_INVESTOR'],
    category: 'dashboard',
  },
  {
    label: 'My Dashboard',
    href: '/originator/dashboard',
    icon: '📊',
    roles: ['INDUSTRIAL_OPERATOR'],
    category: 'dashboard',
  },
  {
    label: 'My Dashboard',
    href: '/compliance/dashboard',
    icon: '📊',
    roles: ['COMPLIANCE_OFFICER'],
    category: 'dashboard',
  },
  {
    label: 'My Dashboard',
    href: '/admin/dashboard',
    icon: '📊',
    roles: ['ADMIN'],
    category: 'dashboard',
  },
  {
    label: 'My Dashboard',
    href: '/regulator/dashboard',
    icon: '📊',
    roles: ['REGULATOR', 'ADMIN'],
    category: 'dashboard',
  },

  // ── uLP/uGT Monitoring (separate pages for different audiences) ──
  {
    label: 'uLP Monitoring',
    href: '/invest/ulp-monitoring',
    icon: '🪙',
    roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN', 'COMPLIANCE_OFFICER'],
    category: 'invest',
  },
  {
    label: 'uGT Collateral',
    href: '/invest/ugt-monitoring',
    icon: '🛡️',
    roles: ['INDUSTRIAL_OPERATOR', 'ADMIN', 'COMPLIANCE_OFFICER'],
    category: 'invest',
  },

  // ── Pool & Investment Links ──
  {
    label: 'Pool Marketplace',
    href: '/institutional/pools',
    icon: '🏛️',
    roles: ['INSTITUTIONAL_INVESTOR', 'ADMIN', 'REGULATOR'],
    category: 'invest',
  },
  {
    label: 'Pool Marketplace',
    href: '/retail/pools',
    icon: '🏛️',
    roles: ['RETAIL_INVESTOR'],
    category: 'invest',
  },
  {
    label: 'Pool Dashboard',
    href: '/pool/dashboard',
    icon: '📈',
    roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN', 'REGULATOR'],
    category: 'invest',
  },
  {
    label: 'My Portfolio',
    href: '/investor/portfolio',
    icon: '💼',
    roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN', 'REGULATOR'],
    category: 'invest',
  },
  {
    label: 'Returns',
    href: '/investor/returns',
    icon: '💰',
    roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN', 'REGULATOR'],
    category: 'invest',
  },
  {
    label: 'Investor Onboarding',
    href: '/onboarding',
    icon: '🚀',
    roles: ALL,
    category: 'onboarding',
  },

  // ── Operator Links ──
  {
    label: 'Submit Asset',
    href: '/originator/assets/submit',
    icon: '➕',
    roles: ['INDUSTRIAL_OPERATOR'],
    category: 'operator',
  },
  {
    label: 'View Certificates',
    href: '/originator/assets/certificates',
    icon: '📜',
    roles: ['INDUSTRIAL_OPERATOR'],
    category: 'operator',
  },
  {
    label: 'Financings',
    href: '/industrial-operator/financings',
    icon: '💰',
    roles: ['INDUSTRIAL_OPERATOR'],
    category: 'operator',
  },

  // ── Compliance Links ──
  {
    label: 'KYC Review',
    href: '/compliance/kyc-review',
    icon: '✓',
    roles: COMPLIANCE_ONLY,
    category: 'compliance',
  },
  {
    label: 'Approval Review',
    href: '/compliance/approval-review',
    icon: '✅',
    roles: COMPLIANCE_ONLY,
    category: 'compliance',
  },
  {
    label: 'Asset Review',
    href: '/compliance/asset-review',
    icon: '🔍',
    roles: COMPLIANCE_ONLY,
    category: 'compliance',
  },
  {
    label: 'Transaction Monitor',
    href: '/compliance/transactions',
    icon: '📊',
    roles: COMPLIANCE_ONLY,
    category: 'compliance',
  },
  {
    label: 'Jurisdictions',
    href: '/compliance/jurisdictions',
    icon: '🌍',
    roles: COMPLIANCE_ONLY,
    category: 'compliance',
  },

  // ── Admin Links (write-only, ADMIN only) ──
  {
    label: 'User Management',
    href: '/admin/users',
    icon: '👥',
    roles: ['ADMIN'],
    category: 'admin',
  },
  {
    label: 'Pool Management',
    href: '/admin/pools',
    icon: '🏦',
    roles: ['ADMIN'],
    category: 'admin',
  },
  {
    label: 'Asset Management',
    href: '/admin/assets',
    icon: '📦',
    roles: ['ADMIN'],
    category: 'admin',
  },
  {
    label: 'Bank Accounts',
    href: '/admin/bank-accounts',
    icon: '🏛️',
    roles: ['ADMIN'],
    category: 'admin',
  },
  {
    label: 'Threshold Management',
    href: '/admin/thresholds',
    icon: '🎯',
    roles: ['ADMIN'],
    category: 'admin',
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: '⚙️',
    roles: ['ADMIN'],
    category: 'admin',
  },
  {
    label: 'KYC Settings',
    href: '/admin/kyc-settings',
    icon: '🔒',
    roles: ['ADMIN'],
    category: 'admin',
  },
  {
    label: 'Contracts',
    href: '/admin/contracts',
    icon: '📝',
    roles: ['ADMIN'],
    category: 'admin',
  },
  {
    label: 'Compliance Monitoring',
    href: '/admin/monitoring',
    icon: '📊',
    roles: ['ADMIN', 'COMPLIANCE_OFFICER'],
    category: 'admin',
  },
  {
    label: 'KYC/KYB Monitoring',
    href: '/admin/kyc-kyb-monitoring',
    icon: '🔍',
    roles: ['ADMIN', 'COMPLIANCE_OFFICER'],
    category: 'admin',
  },

  // ── Regulator Links ──
  {
    label: 'Compliance Reports',
    href: '/regulator/compliance',
    icon: '📋',
    roles: ['REGULATOR', 'ADMIN'],
    category: 'regulator',
  },
  {
    label: 'Activity Log',
    href: '/regulator/activity',
    icon: '📜',
    roles: ['REGULATOR', 'ADMIN'],
    category: 'regulator',
  },
  {
    label: 'Jurisdictions',
    href: '/regulator/jurisdictions',
    icon: '🗺️',
    roles: ['REGULATOR', 'ADMIN'],
    category: 'regulator',
  },
  {
    label: 'Export Data',
    href: '/regulator/export/transactions',
    icon: '📥',
    roles: ['REGULATOR', 'ADMIN'],
    category: 'regulator',
  },
  {
    label: 'Contact',
    href: '/regulator/contact',
    icon: '📧',
    roles: ['REGULATOR', 'ADMIN'],
    category: 'regulator',
  },

  // ── Documentation Links ──
  {
    label: 'Deep Dive',
    href: '/deep-dive',
    icon: '📚',
    roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN'],
    category: 'docs',
  },
  {
    label: 'Investors Room',
    href: '/investors-room',
    icon: '📄',
    roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN'],
    category: 'docs',
  },
  {
    label: 'Glossary',
    href: '/docs/glossary',
    icon: '📖',
    roles: ALL,
    category: 'docs',
  },

  // ── Blockchain & Test Links ──
  {
    label: 'Blockchain Monitoring',
    href: '/monitor',
    icon: '🔗',
    roles: ['ADMIN'],
    category: 'test',
  },
  {
    label: 'Smart Contracts Test',
    href: '/contract-test',
    icon: '🔧',
    roles: ['ADMIN'],
    category: 'test',
  },
];

/**
 * Get navigation items for a specific role
 */
export const getNavItemsForRole = (role: InvestorRole): NavItem[] => {
  return navigationItems.filter(item => item.roles.includes(role));
};

/**
 * Check if a role can access a specific path
 */
export const canAccessPath = (role: InvestorRole, path: string): boolean => {
  // Allow root and auth paths for all
  if (['/', '/login', '/register', '/demo-accounts', '/select-role'].includes(path)) {
    return true;
  }

  // ADMIN and REGULATOR can access everything (except compliance-specific pages for REGULATOR)
  if (role === 'ADMIN') {
    return true;
  }
  if (role === 'REGULATOR') {
    // Regulators can't access compliance workflow pages
    if (path.startsWith('/compliance/')) {
      return false;
    }
    return true;
  }

  // COMPLIANCE_OFFICER can only access compliance-specific pages
  if (role === 'COMPLIANCE_OFFICER') {
    const allowedPaths = [
      '/compliance/dashboard',
      '/compliance/kyc-review',
      '/compliance/approval-review',
      '/compliance/asset-review',
      '/compliance/transactions',
      '/compliance/jurisdictions',
      '/admin/monitoring',  // Compliance officers can view monitoring dashboard
      '/invest/ulp-monitoring',  // Can view uLP/uGT monitoring
      '/docs/glossary',
    ];
    return allowedPaths.some(allowedPath => path === allowedPath || path.startsWith(allowedPath + '/'));
  }

  // INVESTORS can access uLP monitoring
  if (role === 'INSTITUTIONAL_INVESTOR' || role === 'RETAIL_INVESTOR') {
    if (path.startsWith('/invest/ulp-monitoring')) {
      return true;
    }
  }

  // INDUSTRIAL_OPERATOR can access uGT monitoring
  if (role === 'INDUSTRIAL_OPERATOR') {
    if (path.startsWith('/invest/ugt-monitoring')) {
      return true;
    }
  }

  // Check if any nav item matches this path for this role
  return navigationItems.some(item =>
    item.roles.includes(role) && (item.href === path || path.startsWith(item.href.split('/')[1]))
  );
};

/**
 * Get dashboard path for a role
 */
export const getDashboardForRole = (role: InvestorRole): string => {
  const dashboards: Record<InvestorRole, string> = {
    INSTITUTIONAL_INVESTOR: '/institutional/dashboard',
    RETAIL_INVESTOR: '/retail/dashboard',
    INDUSTRIAL_OPERATOR: '/originator/dashboard',
    COMPLIANCE_OFFICER: '/compliance/dashboard',
    ADMIN: '/admin/dashboard',
    REGULATOR: '/regulator/dashboard',
  };
  return dashboards[role];
};
