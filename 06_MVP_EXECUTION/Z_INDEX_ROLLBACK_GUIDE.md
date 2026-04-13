# Quick Rollback Guide

## Instant Rollback (If Something Breaks)

### Option 1: Change Import (Recommended)
In `frontend/src/App.tsx`, change line ~22:
```typescript
// FROM:
import './styles/z-index.css';

// TO (rollback):
import './styles/z-index-legacy.css';
```

This instantly restores ALL original z-index values.

### Option 2: Git Rollback
```bash
# Rollback only z-index changes
git checkout HEAD -- frontend/src/styles/z-index.css
git checkout HEAD -- frontend/src/MVP/components/Navigation.tsx
git checkout HEAD -- frontend/src/MVP/components/WalletModal.tsx
# ... etc for other modified files

# Or full rollback
git revert HEAD
```

### Option 3: PowerShell Quick Rollback
Run this in the project root:
```powershell
powershell -Command "(Get-Content frontend\src\App.tsx) -replace 'z-index\.css','z-index-legacy.css' | Set-Content frontend\src\App.tsx"
```

## What Was Migrated

### Files Modified (19 total):
1. `frontend/src/styles/z-index.css` ✨ NEW
2. `frontend/src/styles/z-index-legacy.css` ✨ NEW (rollback safety net)
3. `frontend/src/App.tsx`
4. `frontend/src/MVP/components/Navigation.tsx`
5. `frontend/src/MVP/components/WalletModal.tsx`
6. `frontend/src/MVP/components/wallet/ConnectWallet.tsx`
7. `frontend/src/MVP/components/UnauthorizedWalletModal.tsx`
8. `frontend/src/MVP/components/PersistentTransactionModal.tsx`
9. `frontend/src/MVP/components/TransactionPreviewModal.tsx`
10. `frontend/src/MVP/components/MVPBanner.tsx`
11. `frontend/src/MVP/components/FinancingRequestModal.tsx`
12. `frontend/src/MVP/components/UgtPostRepaymentModal.tsx`
13. `frontend/src/MVP/components/TestnetNotice.tsx`
14. `frontend/src/MVP/pages/originator/AssetSubmission.tsx`
15. `frontend/src/MVP/pages/originator/AssetCertificates.tsx`
16. `frontend/src/MVP/pages/institutional/PoolMarketplace.tsx`
17. `frontend/src/MVP/pages/institutional/InvestorsRoom.tsx`
18. `frontend/src/MVP/pages/compliance/Jurisdictions.tsx`
19. `frontend/src/MVP/pages/admin/BankAccountManagement.tsx`
20. `frontend/src/MVP/pages/admin/UserManagement.tsx`
21. `frontend/src/MVP/pages/admin/KYCSettings.tsx`
22. `frontend/src/MVP/pages/investors-room/DocPage.tsx`

### Z-Index Changes Summary:

| Component | Old Value | New Value | Layer |
|-----------|-----------|-----------|-------|
| Navigation Rail | `z-50` | `z-layer-nav` | 100 |
| Nav Expanded Panel | `z-[9998]` | `z-layer-nav` | 100 |
| Nav Top Bar | `z-30` | `z-layer-nav` | 100 |
| Nav Dropdowns | `z-[100]` | `z-layer-nav-dropdown` | 150 |
| Sticky Headers | `z-40`, `z-50` | `z-layer-sticky` | 200 |
| Search Overlay | `z-[100]` | `z-layer-overlay` | 300 |
| Wallet Modals | `z-[9998]` to `z-[10001]` | `z-layer-modal` | 400 |
| Transaction Modals | `z-[10000]` | `z-layer-modal` | 400 |
| MVP Banner | `z-[100]` | `z-layer-nav` | 100 |

## Testing Checklist

After rollback, verify:
- [ ] Navigation menu works and stays visible
- [ ] Wallet modals open and close correctly
- [ ] Transaction modals display properly
- [ ] No overlapping UI elements
- [ ] Page headers don't cover content

## Support

If rollback doesn't work:
1. Check browser console for errors
2. Verify `z-index-legacy.css` exists in `frontend/src/styles/`
3. Clear browser cache (Ctrl+Shift+R)
4. Restart dev server

## Prevention

To prevent future z-index conflicts:
1. Always use semantic classes from `z-index.css`
2. Never use arbitrary `z-[xxxx]` values
3. Add new layers to `z-index.css` with documentation
4. Review z-index usage in PRs
