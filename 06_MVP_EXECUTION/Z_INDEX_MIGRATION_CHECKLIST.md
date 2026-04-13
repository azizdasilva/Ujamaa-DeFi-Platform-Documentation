# Z-Index Migration Checklist

## What Happened
On April 12, 2026, the navigation submenu broke because arbitrary z-index values (`z-40`, `z-[9998]`) conflicted with other components using very high z-index values (`z-[10000]`, `z-[10001]`).

## Solution
We created a **Z-Index Design System** (`src/styles/z-index.css`) with 8 predefined layers to prevent future conflicts.

## Migration Steps

### Phase 1: Critical (Done ✅)
- [x] Navigation rail: `z-50` → `z-layer-nav (100)`
- [x] Nav expanded panel: `z-[9998]` → `z-layer-nav (100)`
- [x] Nav top bar: `z-30` → `z-layer-nav (100)`

### Phase 2: High Priority (Done ✅)
- [x] Wallet modals: `z-[9998]` to `z-[10001]` → `z-layer-modal (400)`
- [x] Transaction modals: `z-[10000]` → `z-layer-modal (400)`
- [x] Sticky page headers: `z-40`, `z-50` → `z-layer-sticky (200)`
- [x] Search overlay: `z-[100]` → `z-layer-overlay (300)`
- [x] Dropdown menus: `z-[100]` → `z-layer-nav-dropdown (150)`

### Phase 3: Cleanup (Done ✅)
- [x] Search for all remaining `z-[...]` arbitrary values
- [x] Replace with semantic classes from `z-index.css`
- [ ] Add ESLint rule to prevent arbitrary z-index values
- [x] Update team documentation

## Files to Update
```
frontend/src/MVP/components/wallet/ConnectWallet.tsx (z-[10001])
frontend/src/MVP/components/WalletModal.tsx (z-[9998], z-[9999])
frontend/src/MVP/components/UnauthorizedWalletModal.tsx (z-[10000])
frontend/src/MVP/components/PersistentTransactionModal.tsx (z-[10000])
frontend/src/MVP/components/TransactionPreviewModal.tsx (z-[9998], z-[9999])
frontend/src/MVP/components/Navigation.tsx (z-[100], z-[99])
frontend/src/MVP/components/MVPBanner.tsx (z-[100])
frontend/src/MVP/pages/originator/AssetSubmission.tsx (z-40)
frontend/src/MVP/pages/originator/AssetCertificates.tsx (z-50)
frontend/src/MVP/pages/institutional/PoolMarketplace.tsx (z-50, multiple)
```

## How to Use

### In your components:
```tsx
// ❌ Don't do this
<div className="z-[9998]">...</div>

// ✅ Do this
import '../../styles/z-index.css';
<div className="z-layer-modal">...</div>
```

### When adding new overlays:
1. Check `z-index.css` for the appropriate layer
2. Use the semantic class (e.g., `z-layer-modal`)
3. If you need a new layer, add it to `z-index.css` and document why

## Why This Works

The z-index design system provides:
1. **Predictable stacking** - Each layer has a clear purpose and range
2. **No arbitrary values** - Prevents "z-index wars" where components compete
3. **Easy maintenance** - Clear hierarchy makes debugging easier
4. **Future-proof** - 100-point ranges per layer allow for sub-component adjustments

## Testing

After migration, test these scenarios:
- [ ] Navigation menu stays above page content
- [ ] Modals appear above navigation
- [ ] Dropdowns don't get covered by sticky headers
- [ ] Toast notifications appear above everything except modals
- [ ] Search overlay works correctly

## Questions?
See `frontend/src/styles/z-index.css` for the complete layer hierarchy and documentation.
