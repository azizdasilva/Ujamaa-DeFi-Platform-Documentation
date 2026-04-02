# 🔐 Role-Based Access Control (RBAC) Guide

## Overview

The Ujamaa DeFi Platform now has **strict role-based access control**. Each role can only access their own dashboard and features.

---

## 🎯 Role Access Matrix

| Page/Feature | Institutional | Retail | Operator | Compliance | Admin | Regulator |
|--------------|---------------|--------|----------|------------|-------|-----------|
| **Dashboard** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Pool Marketplace** | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Pool Dashboard** | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| **Submit Asset** | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| **View Certificates** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **KYC Review** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Blockchain Monitoring** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Smart Contracts Test** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Deep Dive** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Investors Room** | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |

---

## 🚀 What Happens Now

### Scenario 1: Retail Investor Logs In
```
✅ CAN ACCESS:
- /retail/dashboard (Their dashboard)
- /retail/pools (Pool marketplace)
- /pool/dashboard (View KPIs)
- /deep-dive (Documentation)
- /docs/glossary

❌ CANNOT ACCESS:
- /institutional/dashboard → Redirects to /unauthorized
- /compliance/dashboard → Redirects to /unauthorized
- /admin/dashboard → Redirects to /unauthorized
- /originator/assets/submit → Redirects to /unauthorized
```

### Scenario 2: Compliance Officer Logs In
```
✅ CAN ACCESS:
- /compliance/dashboard (Their dashboard)
- /compliance/kyc-review (Document review)
- /originator/assets/certificates (View certificates)
- /monitor (Blockchain monitoring)

❌ CANNOT ACCESS:
- /retail/dashboard → Redirects to /unauthorized
- /institutional/pools → Redirects to /unauthorized
```

### Scenario 3: Admin Logs In
```
✅ CAN ACCESS:
- EVERYTHING! (Full platform access)
- All dashboards
- All features
- Smart contracts test
```

---

## 🔧 Technical Implementation

### 1. ProtectedRoute Component

```typescript
// Usage in App.tsx
<Route 
  path="/compliance/dashboard" 
  element={
    <ProtectedRoute requiredRoles={['COMPLIANCE_OFFICER', 'ADMIN']}>
      <ComplianceDashboard />
    </ProtectedRoute>
  } 
/>
```

**How it works:**
1. Checks if user is authenticated
2. Checks if user has required role
3. If yes → Shows component
4. If no → Redirects to `/unauthorized`

### 2. Navigation Configuration

```typescript
// src/config/navigation.ts
export const navigationItems: NavItem[] = [
  {
    label: 'KYC Review',
    href: '/compliance/kyc-review',
    icon: '✓',
    roles: ['COMPLIANCE_OFFICER', 'ADMIN'], // Only these roles see it
  },
  // ... more items
];
```

**Menu Filtering:**
- Navigation menu shows only items for user's role
- Quick access links are role-specific
- Dashboard link points to correct role dashboard

### 3. Unauthorized Page

When a user tries to access a restricted page:
- Shows "Access Denied" message
- Displays user's current role
- Provides link to their dashboard
- Option to try different demo account

---

## 🎨 User Experience

### Logged In as Retail Investor

**Navigation Menu Shows:**
```
Menu
├── Logged In As
│   ├── John Doe
│   ├── retail@ujamaa-defi.com
│   └── Role: Retail Investor
├── Quick Access
│   ├── 📊 My Dashboard (→ /retail/dashboard)
│   ├── 🏛️ Pool Marketplace
│   └── 📈 Pool Dashboard
├── Switch Role
│   ├── 🔄 Choose Different Role
│   └── 🎯 Try Demo Accounts
└── Sign Out
```

### Logged In as Compliance Officer

**Navigation Menu Shows:**
```
Menu
├── Logged In As
│   ├── Sarah Johnson
│   ├── compliance@ujamaa-defi.com
│   └── Role: Compliance Officer
├── Quick Access
│   ├── 📊 My Dashboard (→ /compliance/dashboard)
│   ├── ✓ KYC Review
│   └── 📜 View Certificates
├── Switch Role
│   ├── 🔄 Choose Different Role
│   └── 🎯 Try Demo Accounts
└── Sign Out
```

---

## 🧪 Testing Scenarios

### Test 1: Retail Investor Access Control
```
1. Login as Retail Investor (demo account)
2. Try to access: /compliance/dashboard
3. Expected: Redirect to /unauthorized
4. Click: "Go to Your Dashboard"
5. Expected: Redirect to /retail/dashboard ✅
```

### Test 2: Compliance Officer Access Control
```
1. Login as Compliance Officer (demo account)
2. Try to access: /retail/dashboard
3. Expected: Redirect to /unauthorized
4. Click: "Go to Your Dashboard"
5. Expected: Redirect to /compliance/dashboard ✅
```

### Test 3: Admin Full Access
```
1. Login as Admin (demo account)
2. Try to access: /institutional/dashboard
3. Expected: Page loads ✅
4. Try to access: /compliance/dashboard
5. Expected: Page loads ✅
6. Try to access: /originator/assets/submit
7. Expected: Page loads ✅
```

### Test 4: Navigation Menu Filtering
```
1. Login as Retail Investor
2. Open navigation menu
3. Verify: Only retail-relevant items shown ✅
4. Logout and login as Compliance Officer
5. Open navigation menu
6. Verify: Only compliance-relevant items shown ✅
```

---

## 📋 Role Permissions Detail

### INSTITUTIONAL_INVESTOR
```
Dashboard: ✅ /institutional/dashboard
Pools: ✅ /institutional/pools, /pool/dashboard
Invest: ✅ Can invest €100K+
Docs: ✅ Deep Dive, Investors Room
Features: Custom terms, dedicated support
```

### RETAIL_INVESTOR
```
Dashboard: ✅ /retail/dashboard
Pools: ✅ /retail/pools, /pool/dashboard
Invest: ✅ Can invest €1K - €50K
Docs: ✅ Deep Dive, Investors Room
Features: Educational content, low minimum
```

### INDUSTRIAL_OPERATOR
```
Dashboard: ✅ /originator/dashboard
Assets: ✅ /originator/assets/submit
Certificates: ✅ /originator/assets/certificates
Docs: ✅ Deep Dive, Glossary
Features: GDIZ certification, financing access
```

### COMPLIANCE_OFFICER
```
Dashboard: ✅ /compliance/dashboard
KYC/KYB: ✅ /compliance/kyc-review
Certificates: ✅ /originator/assets/certificates (view only)
Monitoring: ✅ /monitor (blockchain)
Features: 24h review window, transaction monitoring
```

### ADMIN
```
Dashboard: ✅ /admin/dashboard
ALL PAGES: ✅ Full access to everything
Features: User management, pool management, settings
Test: ✅ Smart contracts test page
```

### REGULATOR
```
Dashboard: ✅ /regulator/dashboard
Certificates: ✅ /originator/assets/certificates (view only)
Monitoring: ✅ /monitor (blockchain)
Docs: ✅ Deep Dive, Glossary
Features: Read-only access, audit trails, export data
```

---

## 🚨 Unauthorized Access Flow

```
User clicks wrong link
        ↓
ProtectedRoute checks role
        ↓
Role doesn't match?
        ↓
Redirect to /unauthorized
        ↓
Show error page with:
- "Access Denied" message
- User's current role
- Button to their dashboard
- Link to try different account
```

---

## 🔍 Debugging Tips

### Check User's Role
```javascript
// In browser console
const user = JSON.parse(sessionStorage.getItem('ujamaa_user'));
console.log('Current role:', user.role);
```

### Check Available Routes
```javascript
// See which routes are accessible
import { getNavItemsForRole } from './config/navigation';
console.log('My routes:', getNavItemsForRole('RETAIL_INVESTOR'));
```

### Test ProtectedRoute
```javascript
// Manually test protection
<ProtectedRoute requiredRoles={['ADMIN']}>
  <div>Only admins see this</div>
</ProtectedRoute>
```

---

## ✅ Checklist

### For Each Role, Verify:
- [ ] Can access own dashboard
- [ ] Cannot access other roles' dashboards
- [ ] Navigation shows only relevant items
- [ ] Quick access links work correctly
- [ ] Unauthorized page shows when needed
- [ ] "Go to Your Dashboard" button works
- [ ] Session persists after redirect

---

## 🎯 Summary

**Before:** Any logged-in user could access any dashboard  
**After:** Users can ONLY access their role's features

**Benefits:**
- ✅ Security: Users can't access unauthorized features
- ✅ UX: Cleaner navigation with relevant items only
- ✅ Clarity: Each role has clear, focused interface
- ✅ Compliance: Proper separation of duties

---

**Version**: 2.0.0-mvp-testnet  
**Last Updated**: April 2, 2026  
**Status**: ✅ Role-Based Access Control Active
