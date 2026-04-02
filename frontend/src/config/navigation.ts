/**
 * Role-based Navigation Configuration
 * Defines which menu items are visible for each role
 */

import { InvestorRole } from '../../types';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: InvestorRole[]; // Which roles can see this item
  category?: string;
}

export const navigationItems: NavItem[] = [
  // Dashboard Links
  {
    label: 'My Dashboard',
    href: '/institutional/dashboard',
    icon: '📊',
    roles: ['INSTITUTIONAL_INVESTOR'],
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
    roles: ['REGULATOR'],
    category: 'dashboard',
  },

  // Pool & Investment Links
  {
    label: 'Pool Marketplace',
    href: '/institutional/pools',
    icon: '🏛️',
    roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN'],
    category: 'invest',
  },
  {
    label: 'Pool Dashboard',
    href: '/pool/dashboard',
    icon: '📈',
    roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN', 'REGULATOR'],
    category: 'invest',
  },

  // Operator Links
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
    roles: ['INDUSTRIAL_OPERATOR', 'COMPLIANCE_OFFICER', 'REGULATOR', 'ADMIN'],
    category: 'operator',
  },
  {
    label: 'Financings',
    href: '/industrial-operator/financings',
    icon: '💰',
    roles: ['INDUSTRIAL_OPERATOR', 'ADMIN'],
    category: 'operator',
  },

  // Compliance Links
  {
    label: 'KYC Review',
    href: '/compliance/kyc-review',
    icon: '✓',
    roles: ['COMPLIANCE_OFFICER', 'ADMIN'],
    category: 'compliance',
  },
  {
    label: 'Transaction Monitor',
    href: '/compliance/transactions',
    icon: '🔍',
    roles: ['COMPLIANCE_OFFICER', 'ADMIN'],
    category: 'compliance',
  },
  {
    label: 'Jurisdictions',
    href: '/compliance/jurisdictions',
    icon: '🌍',
    roles: ['COMPLIANCE_OFFICER', 'ADMIN'],
    category: 'compliance',
  },

  // Admin Links
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
    label: 'Settings',
    href: '/admin/settings',
    icon: '⚙️',
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
    label: 'Monitoring',
    href: '/admin/monitoring',
    icon: '📊',
    roles: ['ADMIN'],
    category: 'admin',
  },

  // Regulator Links
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

  // Documentation Links (All roles)
  {
    label: 'Deep Dive',
    href: '/deep-dive',
    icon: '📚',
    roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'INDUSTRIAL_OPERATOR', 'COMPLIANCE_OFFICER', 'ADMIN', 'REGULATOR'],
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
    roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'INDUSTRIAL_OPERATOR', 'COMPLIANCE_OFFICER', 'ADMIN', 'REGULATOR'],
    category: 'docs',
  },

  // Blockchain & Test Links
  {
    label: 'Blockchain Monitoring',
    href: '/monitor',
    icon: '🔗',
    roles: ['ADMIN', 'REGULATOR', 'COMPLIANCE_OFFICER'],
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
