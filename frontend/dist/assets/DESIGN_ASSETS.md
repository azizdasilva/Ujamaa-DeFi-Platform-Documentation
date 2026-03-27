# Design Assets - Ujamaa DeFi Platform

**Source:** `docs/10_DESIGN/`  
**Destination:** `frontend/public/assets/`  
**Status:** ✅ Complete

---

## Logo Files

### Primary Logo
- **File:** `Ujamaa_DeFi_logo.png`
- **Location:** `frontend/public/assets/images/logo.png`
- **Usage:** Navigation bar, headers
- **Size:** 40px height (navigation), 96px height (hero)

### Transparent Logo
- **File:** `Ujamaa_DeFi_logo_transparent.png`
- **Location:** `frontend/public/assets/images/logo-transparent.png`
- **Usage:** Hero sections, overlays, dark backgrounds
- **Size:** 96px height (hero with backdrop)

---

## Logo Usage Guidelines

### Navigation Bar
```tsx
<img
  src="/assets/images/logo.png"
  alt="Ujamaa DeFi Logo"
  className="h-10 w-auto"
/>
```

### Hero Section
```tsx
<img
  src="/assets/images/logo-transparent.png"
  alt="Ujamaa DeFi Logo"
  className="h-24 w-auto bg-white/10 rounded-xl p-4 backdrop-blur-sm"
/>
```

### Minimum Size
- **Print:** 1 inch width
- **Digital:** 120px width
- **Favicon:** 32px × 32px (icon version)

### Clear Space
- Minimum clear space: 1x logo height on all sides

### Color Variations
- **Primary:** Orange (#E87722) + Navy (#1B3B6F)
- **Monochrome:** Available for single-color applications

---

## Brand Colors

### Primary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Ujamaa Orange | `#E87722` | Primary brand color |
| Navy Blue | `#1B3B6F` | Secondary brand color |
| Green | `#16A34A` | Success, growth (DeFi) |
| Teal | `#0D9488` | Supporting color |

### Application
- Logo: Orange + Navy
- UI: Green + Teal (DeFi theme)
- Accents: Orange (brand highlights)

---

## Typography

### Primary Font
- **Plus Jakarta Sans** - Modern, professional
- **Fallback:** Inter, system-ui

### Heading Font
- **Poppins** - Bold, impactful
- **Fallback:** system-ui

---

## File Structure

```
frontend/public/
└── assets/
    └── images/
        ├── logo.png              # Primary logo
        ├── logo-transparent.png  # Transparent background version
        └── icons/                # Icon files (future)
```

---

## Implementation

### In React Components
```tsx
// Navigation
<img src="/assets/images/logo.png" alt="Ujamaa DeFi Logo" className="h-10 w-auto" />

// Hero
<img src="/assets/images/logo-transparent.png" alt="Ujamaa DeFi Logo" className="h-24 w-auto" />
```

### In CSS
```css
.logo {
  background-image: url('/assets/images/logo.png');
  background-size: contain;
  background-repeat: no-repeat;
}
```

---

## Logo Files Source

All logo files are sourced from:
`docs/10_DESIGN/Ujamaa_DeFi_logo.png`
`docs/10_DESIGN/Ujamaa_DeFi_logo_transparent.png`

---

**Last Updated:** March 19, 2026  
**Owner:** Design Team
