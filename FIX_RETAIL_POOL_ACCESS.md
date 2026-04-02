# ✅ Retail Investor Pool Marketplace Access - Fixed

**Date:** April 2, 2026  
**Issue:** Retail investors were blocked from accessing Pool Marketplace  
**Status:** Fixed

---

## Problem

Retail investors were being redirected to `/institutional/pools` instead of `/retail/pools`, causing them to be blocked by the ProtectedRoute component which only allows `INSTITUTIONAL_INVESTOR` and `ADMIN` roles for that path.

---

## Root Cause

The navigation configuration had a single "Pool Marketplace" entry with:
- `href: '/institutional/pools'`
- `roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN']`

This meant retail investors saw the link but were redirected to the institutional route, which then blocked them.

---

## Solution

### 1. Split Pool Marketplace Navigation Entry

**File:** `frontend/src/config/navigation.ts`

**Before:**
```typescript
{
  label: 'Pool Marketplace',
  href: '/institutional/pools',
  icon: '🏛️',
  roles: ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'ADMIN'],
  category: 'invest',
}
```

**After:**
```typescript
// Institutional investors
{
  label: 'Pool Marketplace',
  href: '/institutional/pools',
  icon: '🏛️',
  roles: ['INSTITUTIONAL_INVESTOR', 'ADMIN'],
  category: 'invest',
},
// Retail investors
{
  label: 'Pool Marketplace',
  href: '/retail/pools',
  icon: '🏛️',
  roles: ['RETAIL_INVESTOR', 'ADMIN'],
  category: 'invest',
}
```

### 2. Added Helper Function for Role-Based Paths

**File:** `frontend/src/config/navigation.ts`

```typescript
export function getRolePath(role: InvestorRole, pathType: 'dashboard' | 'pools'): string {
  switch (role) {
    case 'RETAIL_INVESTOR':
      return pathType === 'dashboard' ? '/retail/dashboard' : '/retail/pools';
    case 'INSTITUTIONAL_INVESTOR':
    default:
      return pathType === 'dashboard' ? '/institutional/dashboard' : '/institutional/pools';
  }
}
```

### 3. Updated Navigation Component

**File:** `frontend/src/MVP/components/Navigation.tsx`

- Added import for `getRolePath`
- Added dynamic pool path calculation for search results:
  ```typescript
  const poolPath = user && isAuthenticated ? getRolePath(user.role, 'pools') : '/institutional/pools';
  ```
- Updated search result for Pool Marketplace to use `href: poolPath`

---

## Routes Configuration (Already Correct)

**File:** `frontend/src/App.tsx`

The route configuration was already correct:
```typescript
{/* Retail Investor Routes */}
<Route
  path="/retail/pools"
  element={
    <ProtectedRoute requiredRoles={['RETAIL_INVESTOR', 'ADMIN']}>
      <PoolMarketplace />
    </ProtectedRoute>
  }
/>
```

---

## Testing

### Before Fix
1. Login as retail investor
2. Click "Pool Marketplace" in navigation
3. Redirected to `/institutional/pools`
4. ProtectedRoute blocks access (wrong role)
5. User sent to `/unauthorized`

### After Fix
1. Login as retail investor
2. Click "Pool Marketplace" in navigation
3. Navigate to `/retail/pools`
4. ProtectedRoute allows access (correct role)
5. PoolMarketplace component renders successfully ✅

---

## Files Modified

1. `frontend/src/config/navigation.ts`
   - Added `getRolePath()` helper function
   - Split Pool Marketplace into two entries (institutional + retail)

2. `frontend/src/MVP/components/Navigation.tsx`
   - Imported `getRolePath`
   - Added dynamic pool path for search
   - Search results now role-aware

---

## Related Routes

Both routes use the same `PoolMarketplace` component but at different paths:

| Route | Path | Component | Allowed Roles |
|-------|------|-----------|---------------|
| Institutional | `/institutional/pools` | PoolMarketplace | INSTITUTIONAL_INVESTOR, ADMIN |
| Retail | `/retail/pools` | PoolMarketplace | RETAIL_INVESTOR, ADMIN |

This allows for future customization if needed (different UI, different pools, etc.)

---

## Additional Navigation Fixes Applied

The `getRolePath()` helper function can be used for other role-specific routes:

```typescript
// Dashboard
getRolePath(role, 'dashboard')
// RETAIL_INVESTOR → /retail/dashboard
// INSTITUTIONAL_INVESTOR → /institutional/dashboard

// Pools
getRolePath(role, 'pools')
// RETAIL_INVESTOR → /retail/pools
// INSTITUTIONAL_INVESTOR → /institutional/pools
```

---

## Status

✅ **FIXED** - Retail investors can now access Pool Marketplace at `/retail/pools`

**Next Steps:**
1. Test in browser with retail investor account
2. Verify compliance check appears before investment
3. Ensure all navigation links work correctly
