# MVP Frontend Specification: Institutional Dashboard

## Ujamaa DeFi Platform - Next-Generation Institutional Interface

**Author:** Aziz Da Silva - Lead Architect
**Version:** 1.0
**Date:** March 17, 2026
**Classification:** Internal / Development
**Audience:** Frontend Developers, UI/UX Designers, Product Managers, Stakeholders

**Aligned with:** SRS v2.0 Section 4.1 (User Interfaces), Section 2.3 (User Classes)

---

# Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design Philosophy](#2-design-philosophy)
3. [Visual Design System](#3-visual-design-system)
4. [Architecture & Technology Stack](#4-architecture--technology-stack)
5. [Page Specifications](#5-page-specifications)
6. [Component Library](#6-component-library)
7. [User Flows](#7-user-flows)
8. [Accessibility Requirements](#8-accessibility-requirements)
9. [Performance Requirements](#9-performance-requirements)
10. [Security Requirements](#10-security-requirements)
11. [Testing Strategy](#11-testing-strategy)
12. [Implementation Timeline](#12-implementation-timeline)

---

# 1. Executive Summary

## 1.1 Mission Statement

Create an **institutional-grade frontend** that makes investors say **"WOW"** through:

- ✅ **Clarity** - Complex financial data presented simply
- ✅ **Trust** - Every interaction reinforces security and compliance
- ✅ **Speed** - Sub-2-second load times, instant feedback
- ✅ **Beauty** - Modern, professional aesthetics inspired by Stripe, BlackRock, and leading DeFi platforms
- ✅ **Accessibility** - WCAG 2.2 AA compliant, usable by everyone

## 1.2 Target Users

| User Type | Investment Range | Needs |
|-----------|------------------|-------|
| **Institutional Investor** | €100K - €10M+ | Portfolio tracking, yield statements, compliance docs, proof of reserve |
| **Retail Investor** | €1K - €100K | Simple investment flows, educational content, portfolio overview |
| **Pool Manager** | N/A | Pool management, investor oversight, yield distribution |
| **Compliance Officer** | N/A | KYB/KYC tracking, document management, audit trails |
| **Administrator** | N/A | System oversight, user management, fraud monitoring |

## 1.3 Key Improvements Over MVP-1

| Aspect | MVP-1 | MVP (Target) |
|--------|-------|----------------|
| **Visual Design** | Basic Bootstrap | Custom design system (Stripe-inspired) |
| **Dashboard** | Static tables | Interactive charts, real-time updates |
| **Yield Display** | Simple percentage | Live accrual counter, projection simulator |
| **Navigation** | Top nav only | Top nav + sidebar + command palette (⌘K) |
| **Mobile** | Responsive | Mobile-first, PWA with offline support |
| **Performance** | ~3s load | <1.5s FCP, <3.5s TTI |
| **Accessibility** | Basic | WCAG 2.2 AA compliant |
| **Trust Signals** | Minimal | Integrated throughout (badges, status, audits) |

---

# 2. Design Philosophy

## 2.1 Core Principles

### Principle 1: Clarity Over Complexity

**Problem:** Institutional finance dashboards are often overwhelming (Bloomberg Terminal, legacy platforms).

**Solution:** Progressive disclosure - show essentials first, allow drill-down.

```
┌─────────────────────────────────────────┐
│  What users see FIRST (3-second rule):  │
│  • Total portfolio value                │
│  • 24h change                           │
│  • Active positions count               │
├─────────────────────────────────────────┤
│  What users can EXPLORE:                │
│  • Individual pool performance          │
│  • Asset allocation breakdown           │
│  • Transaction history                  │
│  • Yield projections                    │
└─────────────────────────────────────────┘
```

### Principle 2: Trust Through Transparency

**Every screen should answer:**
- ✅ Where is my money?
- ✅ Is it secure?
- ✅ What is it earning?
- ✅ How do I verify this?

**Implementation:**
- Real-time "All systems operational" status indicator
- Proof of Reserve display on every pool card
- One-click access to on-chain verification
- Compliance badges visible (FSC Mauritius, MiCA, FATF)

### Principle 3: Performance is a Feature

**Target Metrics:**
| Metric | Target | Why It Matters |
|--------|--------|----------------|
| First Contentful Paint | <1.5s | First impression |
| Time to Interactive | <3.5s | Can actually use the app |
| API Response (P95) | <500ms | Perceived speed |
| WebSocket Latency | <100ms | Real-time feel |

### Principle 4: Mobile-First, Not Mobile-Afterthought

**Reality:** 60%+ of African users access via mobile.

**Approach:**
- Design for 320px width first
- Thumb-friendly zones (primary actions at bottom)
- Touch targets: 48x48px minimum
- Offline support for low-connectivity areas

### Principle 5: Accessibility is Non-Negotiable

**Compliance:** WCAG 2.2 AA (legally required for institutional products).

**Benefits:**
- Usable by people with disabilities
- Better SEO
- Improved mobile UX
- Legal protection

---

## 2.2 Design Inspiration

| Platform | What We're Borrowing |
|----------|---------------------|
| **Stripe Dashboard** | Clean typography, card-based layout, micro-interactions |
| **BlackRock Aladdin** | Institutional data visualization, risk metrics display |
| **Lido Finance** | Live yield accrual visualization, staking UX |
| **Coinbase Advanced** | Dual-mode interface (simple/advanced), order flow |
| **Betterment** | Portfolio allocation charts, goal-based investing UI |
| **Rainbow Wallet** | Playful micro-interactions, color usage |
| **Linear** | Command palette (⌘K), keyboard-first navigation |
| **Notion** | Clean documentation, block-based editing patterns |

---

# 3. Visual Design System

## 3.1 Color Palette

### Heritage & Trust Theme 🆕

**Design Philosophy:** This color scheme emphasizes energy and reliability, echoing the elephant's strength and the logo's existing palette.

| Role | Color | Hex Code | Usage |
|------|-------|----------|-------|
| **Primary** | Vibrant Orange | `#F58220` | CTAs, key actions, brand identity |
| **Secondary** | Deep Blue | `#1D3557` | Headers, navigation, trust elements |
| **Accent** | Light Gray | `#E5E5E5` | Backgrounds, borders, subtle dividers |

```css
:root {
  /* =========================================
     HERITAGE & TRUST THEME
     Emphasizes energy (orange) and reliability (blue)
     Echoing elephant strength & logo palette
     ========================================= */

  /* Primary: Vibrant Orange (#F58220) - Energy, Action, Brand */
  --color-primary-50: #FFF5F0;
  --color-primary-100: #FFE8D9;
  --color-primary-200: #FFD0B3;
  --color-primary-300: #FFB78C;
  --color-primary-400: #F89E59;
  --color-primary-500: #F58220;   /* ✅ Primary buttons, CTAs, brand elements */
  --color-primary-600: #E06B15;   /* Hover states */
  --color-primary-700: #C9550A;   /* Active states */
  --color-primary-800: #B24000;
  --color-primary-900: #9B2A00;   /* Important accents */

  /* Secondary: Deep Blue (#1D3557) - Trust, Stability, Heritage */
  --color-secondary-50: #F0F4F8;
  --color-secondary-100: #D9E2EC;
  --color-secondary-200: #BCCCDC;
  --color-secondary-300: #9FB3C8;
  --color-secondary-400: #829AB1;
  --color-secondary-500: #627D98;
  --color-secondary-600: #486581;
  --color-secondary-700: #334E68;
  --color-secondary-800: #243B53;
  --color-secondary-900: #1D3557;   /* ✅ Headers, navigation, trust elements */

  /* Accent: Light Gray (#E5E5E5) - Neutral, Balance */
  --color-accent-50: #FAFAFA;
  --color-accent-100: #F5F5F5;
  --color-accent-200: #E5E5E5;   /* ✅ Borders, subtle dividers */
  --color-accent-300: #D4D4D4;
  --color-accent-400: #A3A3A3;
  --color-accent-500: #737373;
  --color-accent-600: #525252;
  --color-accent-700: #404040;
  --color-accent-800: #262626;
  --color-accent-900: #171717;

  /* Usage Guidelines:
     - primary-500 (#F58220): Primary CTAs, key actions, brand highlights
     - primary-100 (#FFE8D9): Background tints for orange-themed sections
     - secondary-900 (#1D3557): Headers, navigation bars, trust badges
     - secondary-700 (#334E68): Secondary text, subtitles
     - accent-200 (#E5E5E5): Borders, dividers, card backgrounds
     - accent-100 (#F5F5F5): Page backgrounds, subtle sections
  */
}
```

### Semantic Colors (Updated for Heritage Theme)

```css
:root {
  /* Success - Yields, positive changes, verified status */
  --color-success-50: #ECFDF5;
  --color-success-100: #D1FAE5;
  --color-success-500: #10B981;
  --color-success-600: #059669;
  --color-success-700: #047857;

  /* Warning - Pending states, attention needed (aligns with orange theme) */
  --color-warning-50: #FFF5F0;
  --color-warning-100: #FFE8D9;
  --color-warning-500: #F58220;   /* Matches primary orange */
  --color-warning-600: #E06B15;
  --color-warning-700: #C9550A;

  /* Danger - Errors, negative changes, critical alerts */
  --color-danger-50: #FEF2F2;
  --color-danger-100: #FEE2E2;
  --color-danger-500: #EF4444;
  --color-danger-600: #DC2626;
  --color-danger-700: #B91C1C;

  /* Info - Neutral information, tips (aligns with blue theme) */
  --color-info-50: #F0F4F8;
  --color-info-100: #D9E2EC;
  --color-info-500: #627D98;
  --color-info-600: #486581;
  --color-info-700: #334E68;
}
```

### Neutral Colors (Updated)

```css
:root {
  /* Grays - Text, borders, backgrounds */
  --color-gray-50: #FAFAFA;
  --color-gray-100: #F5F5F5;
  --color-gray-200: #E5E5E5;   /* Matches accent-200 */
  --color-gray-300: #D4D4D4;
  --color-gray-400: #A3A3A3;
  --color-gray-500: #737373;
  --color-gray-600: #525252;
  --color-gray-700: #404040;
  --color-gray-800: #262626;
  --color-gray-900: #171717;
}
```

### Asset Class Colors (Updated for Heritage Theme)

```css
:root {
  /* Pool Industrie - Deep Blue (heritage, industry) */
  --color-pool-industrie: #1D3557;

  /* Pool Agriculture - Green (growth, nature) */
  --color-pool-agriculture: #10B981;

  /* Pool Trade Finance - Secondary Blue (commerce, trust) */
  --color-pool-trade: #334E68;

  /* Pool Renewable Energy - Vibrant Orange (energy, innovation) */
  --color-pool-energy: #F58220;

  /* Pool Real Estate - Teal (stability, property) */
  --color-pool-realestate: #14B8A6;
}
```

## 3.2 Typography

### Font Families

```css
:root {
  /* Primary font - Inter (free, Google Fonts, excellent readability) */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
               Roboto, Helvetica, Arial, sans-serif;
  
  /* Monospace - For numbers, addresses, code */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
}
```

### Type Scale

```css
:root {
  /* Display - Hero sections, major headlines */
  --text-display: 2.25rem;      /* 36px */
  --line-height-display: 2.5rem; /* 40px */
  
  /* H1 - Page titles */
  --text-h1: 1.875rem;          /* 30px */
  --line-height-h1: 2.25rem;    /* 36px */
  
  /* H2 - Section headers */
  --text-h2: 1.5rem;            /* 24px */
  --line-height-h2: 2rem;       /* 32px */
  
  /* H3 - Card titles, subsections */
  --text-h3: 1.25rem;           /* 20px */
  --line-height-h3: 1.75rem;    /* 28px */
  
  /* Body Large - Lead paragraphs */
  --text-lg: 1.125rem;          /* 18px */
  --line-height-lg: 1.75rem;    /* 28px */
  
  /* Body - Default text */
  --text-base: 1rem;            /* 16px */
  --line-height-base: 1.5rem;   /* 24px */
  
  /* Small - Secondary text, captions */
  --text-sm: 0.875rem;          /* 14px */
  --line-height-sm: 1.25rem;    /* 20px */
  
  /* Extra Small - Footnotes, legal */
  --text-xs: 0.75rem;           /* 12px */
  --line-height-xs: 1rem;       /* 16px */
}
```

### Font Weights

```css
:root {
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Usage Guidelines

| Element | Font Size | Weight | Color |
|---------|-----------|--------|-------|
| Page Title | H1 | Bold | gray-900 |
| Section Header | H2 | Semibold | gray-900 |
| Card Title | H3 | Medium | gray-800 |
| Body Text | Base | Normal | gray-700 |
| Secondary Text | Small | Normal | gray-500 |
| Captions | XS | Normal | gray-400 |
| Numbers (currency) | Mono | Medium | gray-900 |

## 3.3 Spacing System

**Based on 8px grid** (industry standard, divisible by most numbers):

```css
:root {
  --space-1: 0.25rem;   /* 4px - Tight spacing */
  --space-2: 0.5rem;    /* 8px - Base unit */
  --space-3: 0.75rem;   /* 12px - Form elements */
  --space-4: 1rem;      /* 16px - Card padding */
  --space-6: 1.5rem;    /* 24px - Section spacing */
  --space-8: 2rem;      /* 32px - Large sections */
  --space-12: 3rem;     /* 48px - Page sections */
  --space-16: 4rem;     /* 64px - Major divisions */
  --space-20: 5rem;     /* 80px - Hero spacing */
  --space-24: 6rem;     /* 96px - Page margins */
}
```

### Spacing Patterns

```
Card Internal Spacing:
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │ ← space-4 (16px) from edge
│  │  Card Title (H3)          │  │
│  │  space-2 (8px)            │  │
│  │  Card content...          │  │
│  │  space-4 (16px)           │  │
│  │  [Action Button]          │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
  ↑
  space-6 (24px) between cards
```

## 3.4 Border Radius

```css
:root {
  --radius-sm: 0.25rem;   /* 4px - Small buttons, tags */
  --radius-md: 0.375rem;  /* 6px - Default */
  --radius-lg: 0.5rem;    /* 8px - Cards, modals */
  --radius-xl: 0.75rem;   /* 12px - Large containers */
  --radius-2xl: 1rem;     /* 16px - Hero sections */
  --radius-full: 9999px;  /* Pills, avatars */
}
```

## 3.5 Shadows (Elevation System)

```css
:root {
  /* Subtle - Default card elevation */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  
  /* Medium - Hover states, dropdowns */
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 
               0 2px 4px -2px rgb(0 0 0 / 0.1);
  
  /* Large - Modals, popovers */
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 
               0 4px 6px -4px rgb(0 0 0 / 0.1);
  
  /* Extra Large - Floating elements */
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 
               0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  /* Focus Ring - Accessibility */
  --shadow-focus: 0 0 0 3px rgba(0, 102, 184, 0.5);
}
```

## 3.6 Iconography

### Icon Library

**Primary:** [Lucide Icons](https://lucide.dev/) (open-source, consistent, 2000+ icons)

**Alternative:** Heroicons (Tailwind CSS creators)

### Icon Sizes

```css
:root {
  --icon-xs: 0.875rem;   /* 14px - Inline with small text */
  --icon-sm: 1rem;       /* 16px - Inline with body text */
  --icon-md: 1.25rem;    /* 20px - Default */
  --icon-lg: 1.5rem;     /* 24px - Buttons, navigation */
  --icon-xl: 2rem;       /* 32px - Feature icons */
  --icon-2xl: 3rem;      /* 48px - Hero icons */
}
```

### Icon Usage

| Context | Icon Size | Color |
|---------|-----------|-------|
| Inline with text | sm | Match text color |
| Buttons | md | Inherit or primary |
| Navigation | lg | Current: primary-500, Default: gray-400 |
| Status indicators | sm | Semantic colors |
| Feature illustrations | 2xl | Brand colors |

---

## 3.7 Logo & Branding 🆕

### Logo Files

**Location:** `docs/10_DESIGN/`

| File | Background | Usage | Format |
|------|------------|-------|--------|
| **Ujamaa_DeFi_logo.png** | White background | Light backgrounds, documents, print | PNG |
| **Ujamaa_DeFi_logo_transparent.png** | Transparent | Dark backgrounds, overlays, web | PNG |

### Logo Usage Guidelines

#### Primary Logo (White Background)

**File:** `docs/10_DESIGN/Ujamaa_DeFi_logo.png`

**Usage:**
- ✅ Light backgrounds (white, light gray)
- ✅ Printed documents (PDFs, reports)
- ✅ Email signatures
- ✅ Presentations (light slides)
- ✅ Marketing materials

**Example:**
```tsx
// Light background sections
<img 
  src="/assets/logos/Ujamaa_DeFi_logo.png" 
  alt="UJAMAA DEFI PLATFORM"
  className="h-12 w-auto"
/>
```

#### Transparent Logo

**File:** `docs/10_DESIGN/Ujamaa_DeFi_logo_transparent.png`

**Usage:**
- ✅ Dark backgrounds (Deep Blue #1D3557)
- ✅ Overlays on images
- ✅ Navigation headers (dark mode)
- ✅ Presentations (dark slides)
- ✅ Web headers with colored backgrounds

**Example:**
```tsx
// Dark background sections (navigation, headers)
<img 
  src="/assets/logos/Ujamaa_DeFi_logo_transparent.png" 
  alt="UJAMAA DEFI PLATFORM"
  className="h-12 w-auto"
/>
```

### Logo Clear Space

**Minimum Clear Space:** Equal to the height of the elephant icon

```
┌─────────────────────────────────────────┐
│                                         │
│         ← Elephant Height →             │
│         ┌───────────┐                   │
│         │           │                   │
│         │   LOGO    │                   │
│         │           │                   │
│         └───────────┘                   │
│                                         │
│         Minimum clear space             │
└─────────────────────────────────────────┘
```

**CSS Implementation:**
```css
.logo-container {
  padding: calc(var(--logo-height) / 2);
}

.logo {
  height: 48px;  /* Default header size */
  width: auto;
  display: block;
}
```

### Logo Sizes

| Context | Height | Usage |
|---------|--------|-------|
| **Navigation Header** | 48px | Default header logo |
| **Mobile Header** | 40px | Mobile navigation |
| **Footer** | 32px | Footer logo |
| **Hero Section** | 80px | Landing page hero |
| **Email Signature** | 24px | Email footer |
| **Favicon** | 32px | Browser tab icon |
| **Social Media** | 120px | Profile pictures |

**Responsive Logo Sizes:**
```css
/* Navigation Logo */
.header-logo {
  height: 48px;
  width: auto;
}

@media (max-width: 768px) {
  .header-logo {
    height: 40px;  /* Smaller on mobile */
  }
}

/* Footer Logo */
.footer-logo {
  height: 32px;
  width: auto;
}

/* Hero Logo */
.hero-logo {
  height: 80px;
  width: auto;
}
```

### Logo Color Variations

**For Heritage & Trust Theme:**

| Background | Logo Version | Text Color |
|------------|--------------|------------|
| **White (#FFFFFF)** | White background logo | Deep Blue (#1D3557) |
| **Light Gray (#F5F5F5)** | White background logo | Deep Blue (#1D3557) |
| **Deep Blue (#1D3557)** | Transparent logo | White (#FFFFFF) |
| **Vibrant Orange (#F58220)** | Transparent logo | White (#FFFFFF) |
| **Image Overlay** | Transparent logo | White (#FFFFFF) |

### Logo Don'ts

❌ **DO NOT:**
- Stretch or distort the logo
- Change logo colors (except approved variations)
- Add effects (shadows, gradients, outlines)
- Place on busy backgrounds without clear space
- Use low-resolution versions
- Rotate or flip the logo
- Crop the logo improperly

✅ **DO:**
- Use approved logo files from `docs/10_DESIGN/`
- Maintain clear space around logo
- Use appropriate version for background
- Scale proportionally
- Ensure high resolution (minimum 150 DPI for print)

### Asset Import Path

**Frontend Project Structure:**
```
frontend/
├── public/
│   └── assets/
│       └── logos/
│           ├── Ujamaa_DeFi_logo.png              # White background
│           ├── Ujamaa_DeFi_logo_transparent.png  # Transparent
│           └── favicon.ico                        # Browser favicon
├── src/
│   └── components/
│       └── layout/
│           └── Header.tsx  # Logo usage example
```

**Import Examples:**
```tsx
// React Component
import logo from '@/assets/logos/Ujamaa_DeFi_logo.png';
import logoTransparent from '@/assets/logos/Ujamaa_DeFi_logo_transparent.png';

function Header() {
  return (
    <header className="bg-secondary-900">
      <img 
        src={logoTransparent} 
        alt="UJAMAA DEFI PLATFORM"
        className="h-12 w-auto"
      />
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-100">
      <img 
        src={logo} 
        alt="UJAMAA DEFI PLATFORM"
        className="h-8 w-auto"
      />
    </footer>
  );
}
```

### Brand Colors in Logo

**Logo Color Palette:**

| Element | Color | Hex Code |
|---------|-------|----------|
| **Elephant** | Vibrant Orange | `#F58220` |
| **Text** | Deep Blue | `#1D3557` |
| **Background** | White / Transparent | `#FFFFFF` / `transparent` |

**Consistency:**
- Logo orange matches Primary-500 (`#F58220`)
- Logo blue matches Secondary-900 (`#1D3557`)
- Ensures brand consistency across all touchpoints

### Favicon & App Icons

**Files to Generate:**
```
frontend/public/
├── favicon.ico          # 32x32, 16x16 (browser tab)
├── apple-touch-icon.png # 180x180 (iOS home screen)
├── android-chrome-192x192.png
├── android-chrome-512x512.png
└── manifest.json        # PWA manifest
```

**HTML Head:**
```html
<head>
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/assets/logos/favicon.ico" />
  <link rel="apple-touch-icon" href="/assets/logos/apple-touch-icon.png" />
  
  <!-- PWA Manifest -->
  <link rel="manifest" href="/manifest.json" />
  
  <!-- Theme Color -->
  <meta name="theme-color" content="#F58220" />
  <meta name="msapplication-TileColor" content="#1D3557" />
</head>
```

---

# 4. Architecture & Technology Stack

## 4.1 Technology Choices

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| **Framework** | React | 19.x | React Compiler for auto-optimization, latest features |
| **Language** | TypeScript | 6.0+ | Type safety, better DX, required for Web3 |
| **Build Tool** | Vite | 7.x | Fastest HMR, optimized builds, ESM native |
| **Styling** | Tailwind CSS | 4.x | Utility-first, consistent design system |
| **UI Primitives** | Radix UI | Latest | Accessible, unstyled components |
| **Charts** | Recharts | 2.x | React-native, accessible, customizable |
| **Animations** | Framer Motion | 10.x | GPU-accelerated, reduced-motion support |
| **State (Server)** | TanStack Query | 5.x | Caching, background updates, optimistic UI |
| **State (Client)** | Zustand | 4.x | Minimal, TypeScript-first |
| **Forms** | React Hook Form | 7.x | Performance, easy validation |
| **Validation** | Zod | 3.x | TypeScript-first schema validation |
| **Tables** | TanStack Table | 8.x | Virtualization, sorting, filtering |
| **Wallet** | Wagmi | Latest | React hooks for Web3 |
| **Web3** | Viem | Latest | Type-safe, 10x smaller than ethers.js |
| **HTTP Client** | Axios | 1.x | Interceptors, cancel requests |
| **Testing** | Playwright + Vitest | Latest | E2E + unit testing |

## 4.2 Project Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── manifest.json          # PWA manifest
│   └── robots.txt
│
├── src/
│   ├── assets/                # Images, SVGs, fonts
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Base components (Button, Card, Input)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── charts/            # Chart components
│   │   │   ├── LineChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── tables/            # Table components
│   │   │   ├── DataTable.tsx
│   │   │   ├── TransactionTable.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── web3/              # Web3-specific components
│   │       ├── WalletConnect.tsx
│   │       ├── TransactionStatus.tsx
│   │       └── index.ts
│   │
│   ├── config/                # Configuration files
│   │   ├── constants.ts
│   │   ├── contracts.ts       # Contract addresses & ABIs
│   │   └── env.ts             # Environment variables
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useWallet.ts
│   │   ├── useYield.ts
│   │   ├── usePools.ts
│   │   └── index.ts
│   │
│   ├── layouts/               # Page layouts
│   │   ├── DashboardLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── MarketingLayout.tsx
│   │
│   ├── lib/                   # Utility libraries
│   │   ├── api.ts             # Axios instance
│   │   ├── queryClient.ts     # TanStack Query config
│   │   └── utils.ts           # Helper functions
│   │
│   ├── pages/                 # Page components (routes)
│   │   ├── index.tsx          # Homepage
│   │   ├── dashboard/
│   │   │   ├── index.tsx      # Dashboard overview
│   │   │   ├── pools.tsx      # Pool marketplace
│   │   │   ├── portfolio.tsx  # Portfolio view
│   │   │   └── compliance.tsx # Compliance dashboard
│   │   ├── pools/
│   │   │   ├── [id].tsx       # Pool detail page
│   │   │   └── subscribe.tsx  # Subscribe flow
│   │   ├── onboarding/
│   │   │   ├── investor.tsx
│   │   │   └── originator.tsx
│   │   └── auth/
│   │       ├── login.tsx
│   │       └── register.tsx
│   │
│   ├── services/              # API & Web3 services
│   │   ├── api/
│   │   │   ├── pools.ts
│   │   │   ├── investors.ts
│   │   │   └── transactions.ts
│   │   └── web3/
│   │       ├── contracts.ts
│   │       └── transactions.ts
│   │
│   ├── store/                 # Zustand stores
│   │   ├── walletStore.ts
│   │   ├── uiStore.ts
│   │   └── index.ts
│   │
│   ├── styles/                # Global styles
│   │   ├── globals.css
│   │   └── variables.css
│   │
│   ├── types/                 # TypeScript types
│   │   ├── api.ts
│   │   ├── pool.ts
│   │   ├── investor.ts
│   │   └── index.ts
│   │
│   ├── utils/                 # Utility functions
│   │   ├── formatters.ts      # Currency, date, number formatting
│   │   ├── validators.ts      # Validation functions
│   │   └── helpers.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── tests/
│   ├── e2e/                   # Playwright E2E tests
│   ├── unit/                  # Vitest unit tests
│   └── fixtures/              # Test data
│
├── .env.example
├── .env.MVP
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 4.3 Environment Configuration

```env
# .env.MVP (Vite requires VITE_ prefix)

# API Configuration
VITE_API_URL=https://api.mvp.ujamaa-defi.com
VITE_API_TIMEOUT=30000

# Blockchain Configuration
VITE_POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
VITE_POLYGON_CHAIN_ID=80002
VITE_EXPLORER_URL=https://amoy.polygonscan.com

# Contract Addresses (MVP Testnet)
VITE_ULP_TOKEN_ADDRESS=0x...
VITE_LIQUIDITY_POOL_ADDRESS=0x...
VITE_MOCK_ESCROW_ADDRESS=0x...
VITE_MOCK_FIAT_RAMP_ADDRESS=0x...

# Feature Flags
VITE_ENABLE_MVP=true
VITE_ENABLE_SECONDARY_MARKET=false
VITE_ENABLE_MOBILE_APPS=false

# Analytics (optional)
VITE_ANALYTICS_ID=
VITE_SENTRY_DSN=

# CDN (optional)
VITE_CDN_URL=https://cdn.ujamaa-defi.com
```

---

# 5. Page Specifications

## 5.1 Dashboard Overview (Institutional)

### Route: `/dashboard`

### Purpose
Primary landing page for institutional investors after login. Shows portfolio summary, active positions, and key metrics.

### Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  UJAMAA    Dashboard  Pools  Portfolio  Compliance    [🔔] [👤 Admin▼] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Welcome back, Logic Capital Management                    [🔄 Refresh] │
│  Last updated: 2 minutes ago                                             │
│                                                                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐            │
│  │ Total Value     │ │ Total Yield     │ │ Active Pools    │            │
│  │ €2,450,000      │ │ €187,432        │ │ 5               │            │
│  │ ▲ +2.3% (24h)   │ │ ▲ +8.5% (APY)   │ │ 3 pending      │            │
│  │ 🟢 Live         │ │ 🟢 On Target    │ │ 🟡 2 attention │            │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘            │
│                                                                          │
│  ┌───────────────────────────────────┐ ┌───────────────────────────────┐│
│  │  Portfolio Allocation             │ │  Yield Accrual (30 days)      ││
│  │                                   │ │                               ││
│  │     [Interactive Pie Chart]       │ │  [Line Chart with trend]      ││
│  │                                   │ │                               ││
│  │  🏭 Industrie  45%  €1,102,500    │ │  €187,432                     ││
│  │  🌾 Agriculture 30%  €735,000     │ │  ▲ +12.3% vs previous         ││
│  │  📦 Trade Fin  25%  €612,500      │ │                               ││
│  │                                   │ │  [View Detailed Report →]     ││
│  └───────────────────────────────────┘ └───────────────────────────────┘│
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  Active Pool Positions                                              ││
│  │                                                                     ││
│  │  Pool Name        Invested    uLP Balance   NAV      Yield (APY)   ││
│  │  ─────────────────────────────────────────────────────────────────  ││
│  │  🏭 Pool Industrie                                                  ││
│  │     €1,000,000   980,000 uLP  €1.0234      8.5%    🟢 On Target    ││
│  │     [View Details] [Subscribe More] [Redeem]                        ││
│  │                                                                     ││
│  │  🌾 Pool Agriculture                                                ││
│  │     €750,000     740,000 uLP  €1.0135      7.8%    🟢 On Target    ││
│  │     [View Details] [Subscribe More] [Redeem]                        ││
│  │                                                                     ││
│  │  📦 Pool Trade Finance                                              ││
│  │     €700,000     700,000 uLP  €1.0089      7.2%    🟡 Below Target ││
│  │     [View Details] [Subscribe More] [Redeem]                        ││
│  │                                                                     ││
│  │  [View All Positions →]                                             ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  ┌───────────────────────────────────┐ ┌───────────────────────────────┐│
│  │  Recent Transactions              │ │  Compliance Status            ││
│  │                                   │ │                               ││
│  │  📥 €500K subscribed (Mar 17)     │ │  🟢 KYB Verified              ││
│  │  📤 €200K redeemed (Mar 15)       │ │  🟢 Documents Current         ││
│  │  💰 €12,432 yield distributed     │ │  🟡 3 renewals in 30 days     ││
│  │  💰 €8,234 yield accrued (today)  │ │                               ││
│  │                                   │ │  [Manage Compliance →]        ││
│  │  [View All →]                    │ │                               ││
│  └───────────────────────────────────┘ └───────────────────────────────┘│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Components Required

| Component | Priority | Description |
|-----------|----------|-------------|
| `KPICard` | P0 | Displays key metrics with trend indicators |
| `PortfolioPieChart` | P0 | Interactive allocation chart |
| `YieldLineChart` | P0 | 30-day yield accrual trend |
| `PoolPositionTable` | P0 | Active positions with actions |
| `TransactionList` | P0 | Recent transactions |
| `ComplianceStatusCard` | P0 | KYB/document status |
| `LiveValueCounter` | P1 | Real-time portfolio value |
| `QuickActionsBar` | P1 | Subscribe, Redeem, Transfer shortcuts |

### Data Requirements

```typescript
interface DashboardData {
  // KPIs
  totalValue: {
    amount: number;
    currency: string;
    change24h: number; // percentage
    lastUpdated: string; // ISO 8601
  };
  
  totalYield: {
    amount: number;
    currency: string;
    apy: number; // percentage
    status: 'on-target' | 'below-target' | 'above-target';
  };
  
  activePools: {
    count: number;
    pending: number;
    attention: number;
  };
  
  // Allocation
  allocation: Array<{
    poolId: string;
    poolName: string;
    poolClass: AssetClass;
    percentage: number;
    value: number;
    color: string;
  }>;
  
  // Positions
  positions: Array<{
    poolId: string;
    poolName: string;
    invested: number;
    ulpBalance: number;
    nav: number;
    apy: number;
    status: 'on-target' | 'below-target' | 'above-target';
  }>;
  
  // Transactions
  recentTransactions: Array<{
    id: string;
    type: 'subscribe' | 'redeem' | 'yield' | 'transfer';
    amount: number;
    currency: string;
    timestamp: string;
    status: 'pending' | 'completed' | 'failed';
    txHash?: string;
  }>;
  
  // Compliance
  compliance: {
    kybStatus: 'verified' | 'pending' | 'expired';
    documentsStatus: 'current' | 'expiring' | 'expired';
    renewalsDue: number;
    renewalsDueDays: number;
  };
}
```

### API Endpoints

```typescript
// GET /api/v1/investors/{investor_id}/dashboard
// Returns complete dashboard data

// GET /api/v1/investors/{investor_id}/portfolio
// Returns detailed portfolio with positions

// GET /api/v1/investors/{investor_id}/transactions?limit=10
// Returns recent transactions

// GET /api/v1/investors/{investor_id}/compliance/status
// Returns compliance status
```

### Web3 Integration

```typescript
// Real-time NAV updates via WebSocket
// Subscribe to uLPToken Transfer events
// Listen to LiquidityPool YieldAccrued events
```

---

## 5.2 Pool Marketplace

### Route: `/pools`

### Purpose
Browse and filter available liquidity pools for investment.

### Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  UJAMAA    Dashboard  Pools  Portfolio  Compliance    [🔔] [👤 Admin▼] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Liquidity Pool Marketplace                                              │
│  Discover institutional-grade investment opportunities                   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  [Search pools...                          ] [🔍 Advanced Filters▼]││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  Quick Filters:                                                          │
│  [All Pools ▼] [Performance ▼] [Risk ▼] [Region ▼] [Clear All]          │
│                                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ 🏭 Pool      │ │ 🌾 Pool      │ │ 📦 Pool      │ │ ⚡ Pool       │   │
│  │  Industrie   │ │  Agriculture │ │  Trade Fin   │ │  Renewable    │   │
│  │              │ │              │ │              │ │               │   │
│  │  Target:     │ │  Target:     │ │  Target:     │ │  Target:      │   │
│  │  €50M        │ │  €30M        │ │  €40M        │ │  €25M         │   │
│  │  Raised:     │ │  Raised:     │ │  Raised:     │ │  Raised:      │   │
│  │  €42.5M      │ │  €18.2M      │ │  €35.1M      │ │  €12.8M       │   │
│  │              │ │              │ │              │ │               │   │
│  │  ████████░░  │ │  ██████░░░░  │ │  █████████░  │ │  █████░░░░░  │   │
│  │  85%         │ │  61%         │ │  88%         │ │  51%          │   │
│  │              │ │              │ │              │ │               │   │
│  │  APY: 8.5%   │ │  APY: 7.8%   │ │  APY: 7.2%   │ │  APY: 9.2%    │   │
│  │  🟢 On Target│ │  🟢 On Target│ │  🟡 Below    │ │  🟢 Above     │   │
│  │              │ │              │ │              │ │               │   │
│  │  Min: €100K  │ │  Min: €100K  │ │  Min: €100K  │ │  Min: €100K   │   │
│  │  Risk: A     │ │  Risk: A     │ │  Risk: BBB   │ │  Risk: A      │   │
│  │              │ │              │ │              │ │               │   │
│  │  [View Pool] │ │  [View Pool] │ │  [View Pool] │ │  [View Pool]  │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  Pool Comparison                                                      ││
│  │  [Add pools to compare]                                               ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  Showing 6 of 12 pools                                                   │
│  [Load More]                                                             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Components Required

| Component | Priority | Description |
|-----------|----------|-------------|
| `PoolCard` | P0 | Displays pool key metrics |
| `SearchBar` | P0 | Text search with autocomplete |
| `FilterBar` | P0 | Quick filter chips |
| `AdvancedFilters` | P1 | Sidebar with detailed filters |
| `ProgressBar` | P0 | Fundraising progress |
| `PoolComparison` | P1 | Side-by-side comparison |
| `StatusBadge` | P0 | Risk/performance status |

---

## 5.3 Pool Detail Page

### Route: `/pools/:id`

### Purpose
Detailed view of a single liquidity pool with full transparency.

### Key Sections

1. **Header** - Pool name, class, risk rating, status
2. **Quick Stats** - TVL, APY, NAV, min investment
3. **Performance Chart** - Historical NAV and yield
4. **Asset Allocation** - Underlying assets breakdown
5. **Documents** - Offering memorandum, audits, legal
6. **Investors** - Cap table (for authorized users)
7. **Actions** - Subscribe, Redeem buttons

---

## 5.4 Subscribe Flow

### Route: `/pools/:id/subscribe`

### Multi-Step Flow

```
Step 1: Amount Selection
┌─────────────────────────────────────────┐
│  How much would you like to invest?     │
│                                         │
│  [€100,000 ──────────●───────── €10M]  │
│                                         │
│  Minimum: €100,000 (institutional)      │
│  Maximum: €10,000,000 per investor      │
│                                         │
│  Your Investment: €500,000              │
│  uLP You'll Receive: ~500,000 uLP       │
│  Current NAV: €1.0234/uLP               │
│                                         │
│  [Continue →]                           │
└─────────────────────────────────────────┘

Step 2: Review Terms
┌─────────────────────────────────────────┐
│  Review Investment Terms                │
│                                         │
│  ✓ Lock-up Period: 365 days             │
│  ✓ Expected APY: 8.5%                   │
│  ✓ Management Fee: 2.0% annually        │
│  ✓ Performance Fee: 20% of yield        │
│  ✓ Redemption Notice: 30 days           │
│                                         │
│  [I Agree to Terms]                     │
│  [Continue →]                           │
└─────────────────────────────────────────┘

Step 3: Funding Source
┌─────────────────────────────────────────┐
│  Select Funding Source                  │
│                                         │
│  ○ Ondo EUROD (EUROD) Wallet (0x1234...5678)          │
│    Balance: €2,450,000                  │
│                                         │
│  ○ Bank Escrow (BIIC)                   │
│    Wire transfer instructions           │
│                                         │
│  [Continue →]                           │
└─────────────────────────────────────────┘

Step 4: Confirmation
┌─────────────────────────────────────────┐
│  Confirm Investment                     │
│                                         │
│  Pool: Pool Industrie                   │
│  Amount: €500,000                       │
│  uLP: ~500,000 tokens                   │
│  NAV: €1.0234                           │
│                                         │
│  [Sign Transaction]                     │
│                                         │
│  After signing:                         │
│  1. Funds transferred from wallet       │
│  2. uLP tokens minted to your address   │
│  3. Transaction recorded on-chain       │
└─────────────────────────────────────────┘

Step 5: Progress Tracking
┌─────────────────────────────────────────┐
│  Investment In Progress                 │
│                                         │
│  ┌─────────┬─────────┬─────────┬─────┐ │
│  │Initiated│  KYB    │  Funds  │Done │ │
│  │   ✓     │   ✓     │   ●     │  ─  │ │
│  └─────────┴─────────┴─────────┴─────┘ │
│                                         │
│  "Waiting for blockchain confirmation"  │
│  Block confirmations: 2/12              │
│                                         │
│  Estimated completion: 2-3 minutes      │
└─────────────────────────────────────────┘
```

---

## 5.5 Portfolio Page

### Route: `/portfolio`

### Purpose
Detailed view of all investments with performance analytics.

### Key Sections

1. **Portfolio Summary** - Total value, cost basis, gains/losses
2. **Position Details** - Each pool position with actions
3. **Performance Charts** - Value over time, vs. benchmarks
4. **Yield Statements** - Downloadable PDF statements
5. **Transaction History** - Complete history with filters

---

## 5.6 Compliance Dashboard

### Route: `/compliance`

### Purpose
Manage KYB/KYC, documents, and regulatory compliance.

### Key Sections

1. **Compliance Status** - Overall compliance health
2. **KYB/KYC Status** - Verification status, expiry dates
3. **Document Vault** - Upload, track, manage documents
4. **Investor List** - For pool managers (authorized only)
5. **Audit Trail** - On-chain compliance events

---

# 5.7 Wallet Integration ⭐ **NEW**

**Reference:** `04_MVP_MOCKING_AND_TESTNET_STRATEGY.md` Section 6 (Frontend Integration)

## 5.7.1 Wallet Connection Architecture

### Supported Wallets

| Wallet | Type | Priority | Use Case |
|--------|------|----------|----------|
| **MetaMask** | Browser Extension | P0 | Primary wallet for desktop |
| **WalletConnect** | Protocol | P0 | Mobile wallet connectivity |
| **Rainbow** | Mobile App | P1 | iOS/Android mobile users |
| **Safe (Gnosis)** | Smart Contract | P2 | Institutional multi-sig |

### Wallet Connection Flow

```
1. User clicks "Connect Wallet" button
   └─ RainbowKit modal opens

2. User selects wallet provider
   └─ MetaMask: Extension popup
   └─ WalletConnect: QR code displayed
   └─ Rainbow: Mobile app redirect

3. User approves connection
   └─ Wallet signs challenge message
   └─ Frontend verifies signature
   └─ Wallet address linked to user account

4. Connection established
   └─ Wallet address displayed in header
   └─ User menu shows balance
   └─ Can now interact with smart contracts
```

---

## 5.7.2 Wallet Connect Component

**Component:** `WalletConnect.tsx`

```tsx
// src/components/web3/WalletConnect.tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export function WalletConnect() {
  const { address, isConnected } = useAccount();

  return (
    <ConnectButton
      accountStatus={{
        smallScreen: 'avatar',
        largeScreen: 'full',
      }}
      chainStatus={{
        smallScreen: 'icon',
        largeScreen: 'name',
      }}
      showBalance={{
        smallScreen: false,
        largeScreen: true,
      }}
    />
  );
}
```

**Custom Wallet Button:**

```tsx
// src/components/web3/ConnectWalletButton.tsx
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/Button';

export function ConnectWalletButton() {
  const { openConnectModal } = useConnectModal();

  return (
    <Button onClick={openConnectModal}>
      Connect Wallet
    </Button>
  );
}
```

---

## 5.7.3 Wallet Verification

**Component:** `WalletVerification.tsx`

```tsx
// src/components/web3/WalletVerification.tsx
import { useSignMessage } from 'wagmi';
import { useState } from 'react';

export function WalletVerification({ 
  investorId,
  onVerified 
}: { 
  investorId: string;
  onVerified: (signature: string) => void;
}) {
  const [isVerifying, setIsVerifying] = useState(false);
  const { signMessage } = useSignMessage();

  const handleVerify = async () => {
    setIsVerifying(true);
    
    try {
      // Create challenge message
      const message = `Verify wallet ownership for investor ${investorId}\n\nNonce: ${Date.now()}`;
      
      // Request signature
      const signature = await signMessageAsync({ message });
      
      // Send to backend for verification
      await api.post('/investors/verify-wallet', {
        investor_id: investorId,
        signature,
        message,
      });
      
      onVerified(signature);
    } catch (error) {
      console.error('Wallet verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Button onClick={handleVerify} disabled={isVerifying}>
      {isVerifying ? 'Verifying...' : 'Verify Wallet Ownership'}
    </Button>
  );
}
```

---

## 5.7.4 Wallet Display Component

**Component:** `WalletDisplay.tsx`

```tsx
// src/components/web3/WalletDisplay.tsx
import { useAccount, useBalance } from 'wagmi';
import { formatAddress } from '@/utils/formatters';

export function WalletDisplay() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
  });

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Wallet Address */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
          <WalletIcon className="w-4 h-4 text-primary-700" />
        </div>
        <span className="text-sm font-mono text-gray-700">
          {formatAddress(address)}
        </span>
        <CopyButton text={address} />
      </div>

      {/* Balance */}
      {balance && (
        <div className="text-sm text-gray-600">
          {balance.formatted} {balance.symbol}
        </div>
      )}
    </div>
  );
}
```

---

## 5.7.5 Wallet Store (Zustand)

**Store:** `walletStore.ts`

```typescript
// src/store/walletStore.ts
import { create } from 'zustand';
import { Address } from 'viem';

interface WalletState {
  // State
  address: Address | null;
  isConnected: boolean;
  isConnecting: boolean;
  lastConnected: number | null;
  
  // Actions
  setConnected: (address: Address) => void;
  setDisconnected: () => void;
  setConnecting: (isConnecting: boolean) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  // Initial state
  address: null,
  isConnected: false,
  isConnecting: false,
  lastConnected: null,
  
  // Actions
  setConnected: (address) =>
    set({
      address,
      isConnected: true,
      isConnecting: false,
      lastConnected: Date.now(),
    }),
  
  setDisconnected: () =>
    set({
      address: null,
      isConnected: false,
      isConnecting: false,
      lastConnected: null,
    }),
  
  setConnecting: (isConnecting) =>
    set({ isConnecting }),
}));
```

---

## 5.7.6 Wallet Hook

**Hook:** `useWallet.ts`

```typescript
// src/hooks/useWallet.ts
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useWalletStore } from '@/store/walletStore';

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, disconnect } = useConnect();
  const { setConnected, setDisconnected } = useWalletStore();

  const handleConnect = async () => {
    connect({ connector: new InjectedConnector() });
  };

  const handleDisconnect = async () => {
    await disconnect();
    setDisconnected();
  };

  return {
    // State
    address,
    isConnected,
    isConnecting,
    
    // Actions
    connect: handleConnect,
    disconnect: handleDisconnect,
    
    // Utilities
    formatAddress: () => address ? formatAddress(address) : '',
    isContract: async () => {
      // Check if wallet is a smart contract
      const code = await publicClient.getCode({ address: address! });
      return code !== undefined;
    },
  };
}
```

---

## 5.7.7 Wallet Integration in Pages

### Dashboard Header

```tsx
// src/components/layout/Header.tsx
import { WalletConnect } from '@/components/web3/WalletConnect';
import { WalletDisplay } from '@/components/web3/WalletDisplay';

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <Logo />
        <nav>
          {/* Navigation links */}
        </nav>
        <div className="flex items-center space-x-4">
          <NotificationsBell />
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
```

### Onboarding Flow

```tsx
// src/pages/onboarding/investor.tsx
import { WalletVerification } from '@/components/web3/WalletVerification';

function InvestorOnboarding() {
  const [walletVerified, setWalletVerified] = useState(false);

  return (
    <div>
      <Step1>
        <h3>Step 1: Connect Wallet</h3>
        <WalletVerification
          investorId={investorId}
          onVerified={() => setWalletVerified(true)}
        />
        {walletVerified && (
          <Badge variant="success">✓ Wallet Verified</Badge>
        )}
      </Step1>
      
      <Step2 disabled={!walletVerified}>
        <h3>Step 2: Enter Details</h3>
        {/* Email, jurisdiction, etc. */}
      </Step2>
    </div>
  );
}
```

---

## 5.7.8 Wallet Testing

**Unit Tests:**

```tsx
// tests/unit/components/WalletConnect.test.tsx
import { render, screen } from '@testing-library/react';
import { WalletConnect } from '@/components/web3/WalletConnect';

describe('WalletConnect', () => {
  it('renders connect button when disconnected', () => {
    render(<WalletConnect />);
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('renders wallet address when connected', () => {
    render(<WalletConnect />, {
      wrapper: ({ children }) => (
        <WagmiConfig config={testConfig}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </WagmiConfig>
      ),
    });
    
    // Simulate connection
    fireEvent.click(screen.getByText('Connect Wallet'));
    
    expect(screen.getByText(/0x[a-fA-F0-9]{4}...[a-fA-F0-9]{4}/))
      .toBeInTheDocument();
  });
});
```

**E2E Tests:**

```tsx
// tests/e2e/wallet-connection.spec.ts
import { test, expect } from '@playwright/test';

test('user can connect wallet', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Click connect wallet
  await page.getByRole('button', { name: 'Connect Wallet' }).click();
  
  // MetaMask popup would appear (mocked in test)
  // For E2E, we'd use a test wallet
  
  // Verify wallet address displayed
  await expect(page.getByText(/0x[a-fA-F0-9]{4}...[a-fA-F0-9]{4}/))
    .toBeVisible();
});

test('wallet verification works', async ({ page }) => {
  await page.goto('/onboarding/investor');
  
  // Connect wallet
  await page.getByRole('button', { name: 'Connect Wallet' }).click();
  
  // Verify ownership
  await page.getByRole('button', { name: 'Verify Wallet' }).click();
  
  // Wait for verification
  await expect(page.getByText('Wallet Verified'))
    .toBeVisible({ timeout: 10000 });
});
```

---

## 5.7.9 Wallet Security Considerations

### Best Practices

| Practice | Implementation |
|----------|----------------|
| **Never store private keys** | Keys stay in wallet, never in frontend code |
| **Signature verification** | Always verify wallet ownership via signature |
| **Chain validation** | Check user is on correct network (Polygon Amoy) |
| **Network switching** | Prompt user to switch if wrong network |
| **Transaction preview** | Show full transaction details before signing |
| **Error handling** | Graceful handling of user rejections |

### Web3 Architecture Compliance ⭐ **NEW**

**Reference:** `docs/02_TECHNICAL_GUIDES/08_WEB3_ARCHITECTURE_GUIDE.md`

**MVP follows the Non-Custodial Web3 Model:**

✅ **Self-Custody:**
- Users hold their own private keys (in MetaMask, WalletConnect, etc.)
- Frontend NEVER accesses private keys
- Backend NEVER accesses private keys
- Keys never leave user's device

✅ **User Signs Transactions:**
- All transactions signed by user's wallet (MetaMask popup)
- User reviews transaction details before signing
- User can reject transactions
- Backend cannot sign on behalf of users

✅ **Non-Custodial Architecture:**
- Backend does NOT hold user funds
- Backend does NOT have signing authority
- Backend provides off-chain services only (fraud detection, indexing, metadata)
- Smart contracts enforce rules on-chain (not backend)

✅ **Regulatory Compliance:**
- Non-custodial = Lower regulatory burden
- No Money Service Business (MSB) license required
- No BitLicense required
- No money transmitter licenses required

**What Backend DOES (Off-Chain):**
- ✅ Fraud detection and validation (warnings only)
- ✅ Indexing and querying blockchain data
- ✅ Storing off-chain metadata (user profiles, investment records)
- ✅ Providing portfolio analytics
- ✅ Generating reports and statements

**What Backend CANNOT Do:**
- ❌ Sign transactions for users
- ❌ Hold user funds
- ❌ Access private keys
- ❌ Stop or reverse transactions
- ❌ Act as custodian

**Code Example - Correct Flow:**

```typescript
// ✅ CORRECT: Frontend wallet interaction
// src/components/web3/WalletConnect.tsx
import { useConnectModal } from '@rainbow-me/rainbowkit';

export function WalletConnect() {
  const { openConnectModal } = useConnectModal();
  
  // User controls keys through RainbowKit/MetaMask
  // Frontend NEVER sees private keys
  return (
    <Button onClick={openConnectModal}>
      Connect Wallet
    </Button>
  );
}

// ✅ CORRECT: User signs transaction
// src/hooks/useuLPToken.ts
import { useWriteContract } from 'wagmi';

export function useuLPToken() {
  const { writeContract } = useWriteContract();
  
  const deposit = (amount: bigint) => {
    // This triggers MetaMask popup
    // User reviews and signs
    // Backend has NO access to signing
    writeContract({
      address: ULPTOKEN_ADDRESS,
      abi: ULPTOKEN_ABI,
      functionName: 'deposit',
      args: [amount],
    });
  };
  
  return { deposit };
}

// ✅ CORRECT: Backend records transaction (off-chain only)
// backend/api/investments.py
@router.post("/api/v1/investments")
async def record_investment(investment: InvestmentData):
    """
    Record investment in database (off-chain)
    
    This does NOT move funds - just tracks it for:
    - Portfolio tracking
    - Tax reporting
    - Analytics
    
    Backend CANNOT modify or reverse transaction.
    """
    # Store in PostgreSQL (read-only record)
    await db.execute(
        """
        INSERT INTO investments (wallet, amount, tx_hash, created_at)
        VALUES ($1, $2, $3, NOW())
        """,
        investment.wallet,
        investment.amount,
        investment.tx_hash
    )
    
    return {"status": "recorded"}
```

**Inconsistencies to Avoid:**

```typescript
// ❌ WRONG: Backend should NEVER hold keys
// backend/services/wallet.py
# 🚨 NEVER DO THIS - CUSTODIAL MODEL
private_key = os.getenv("USER_PRIVATE_KEY")
wallet = Account.from_key(private_key)

// ❌ WRONG: Backend should NEVER sign for users
// backend/api/invest.py
# 🚨 NEVER DO THIS - REQUIRES MSB LICENSE
@app.post("/api/v1/invest")
async def invest_for_user(wallet: str, amount: int):
    private_key = os.getenv("MASTER_PRIVATE_KEY")
    account = Account.from_key(private_key)
    tx = await contract.functions.mint(account.address, amount)
    return {"tx_hash": tx.hash}
```

**Document Consistency:**

| Document | Section | Consistency Status |
|----------|---------|-------------------|
| **Web3 Architecture Guide** | All | ✅ Source of truth |
| **Frontend Spec v1.0** | Section 5.7 (Wallet) | ✅ Fully aligned |
| **MVP Implementation Plan** | Phase 4.11 | ✅ Fully aligned |
| **Mocking Strategy v2.0** | Section 6 | ✅ Fully aligned |
| **SRS v2.0** | Section 1.2 (Scope) | ✅ Non-custodial stated |

---

### Error Messages

```typescript
// src/utils/walletErrors.ts
const walletErrorMessages: Record<number, string> = {
  4001: 'Transaction rejected by user',
  4100: 'Wallet not connected',
  4200: 'Wallet not authorized',
  4900: 'Wallet disconnected',
  4901: 'Chain not supported',
  4902: 'RPC method not supported',
};

export function getWalletErrorMessage(code: number): string {
  return walletErrorMessages[code] || 'Unknown wallet error';
}
```

---

## 5.7.10 Wallet Configuration

**Environment Variables:**

```env
# .env.MVP
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
VITE_POLYGON_AMOY_CHAIN_ID=80002
VITE_POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
VITE_POLYGON_AMOY_EXPLORER=https://amoy.polygonscan.com/
```

**Wagmi Configuration:**

```typescript
// src/lib/wagmi.ts
import { configureChains, createConfig } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const { chains, publicClient } = configureChains(
  [polygonAmoy],
  [publicProvider()]
);

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: {
        projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
        showQrModal: true,
      },
    }),
    // Add more connectors (MetaMask, Rainbow, etc.)
  ],
  publicClient,
});
```

---

# 5.6 Compliance Dashboard

### Route: `/compliance`

### Purpose
Manage KYB/KYC, documents, and regulatory compliance.

### Key Sections

1. **Compliance Status** - Overall compliance health
2. **KYB/KYC Status** - Verification status, expiry dates
3. **Document Vault** - Upload, track, manage documents
4. **Investor List** - For pool managers (authorized only)
5. **Audit Trail** - On-chain compliance events

---

# 5.8 Proof of Reserve Dashboard ⭐ **NEW**

**Reference:** SRS v2.0 Section 1.2, 3.158, 5.12; Chainlink Proof of Reserve

## 5.8.1 Overview

**Purpose:** Provide institutional-grade transparency with real-time on-chain attestation of pool reserves backing uLP tokens.

**Key Metrics:**
- Total uLP Supply (tokens outstanding)
- Total Backing Assets (Ondo EUROD (EUROD) held in pool)
- Reserve Ratio (Backing Assets / uLP Supply Value)
- Last Audit Timestamp
- On-chain Proof Link

**Target:** Display on every pool card and dashboard

---

## 5.8.2 Proof of Reserve Component

**Component:** `ProofOfReserveDisplay.tsx`

```tsx
// src/components/pools/ProofOfReserveDisplay.tsx
import { useContractRead } from 'wagmi';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface ProofOfReserveProps {
  poolAddress: string;
  ulpTokenAddress: string;
}

export function ProofOfReserveDisplay({ 
  poolAddress, 
  ulpTokenAddress 
}: ProofOfReserveProps) {
  // Read on-chain data
  const { data: totalSupply } = useContractRead({
    address: ulpTokenAddress,
    abi: ULPTOKEN_ABI,
    functionName: 'totalSupply',
  });

  const { data: backingAssets } = useContractRead({
    address: poolAddress,
    abi: LIQUIDITYPOOL_ABI,
    functionName: 'getTotalBackingAssets',
  });

  const { data: lastAudit } = useContractRead({
    address: poolAddress,
    abi: LIQUIDITYPOOL_ABI,
    functionName: 'lastReserveAudit',
  });

  // Calculate reserve ratio
  const reserveRatio = backingAssets && totalSupply
    ? (backingAssets / totalSupply) * 100
    : 100;

  const isFullyBacked = reserveRatio >= 100;

  return (
    <Card variant="elevated" className="border-primary-200">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheckIcon className="w-5 h-5 mr-2 text-primary-700" />
          Proof of Reserve
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Reserve Ratio Badge */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Reserve Ratio</span>
            <Badge 
              variant={isFullyBacked ? 'success' : 'danger'}
              className="text-sm"
            >
              {isFullyBacked ? '✅ Fully Backed' : '⚠️ Under-Collateralized'}
            </Badge>
          </div>
          <div className="text-3xl font-bold text-primary-900">
            {formatPercentage(reserveRatio / 100)}
          </div>
        </div>

        {/* Reserve Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total uLP Supply:</span>
            <span className="font-mono font-semibold">
              {formatCurrency(totalSupply || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Backing Assets:</span>
            <span className="font-mono font-semibold text-success-700">
              {formatCurrency(backingAssets || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Surplus/Deficit:</span>
            <span className={`font-mono font-semibold ${
              backingAssets >= totalSupply 
                ? 'text-success-700' 
                : 'text-danger-700'
            }`}>
              {formatCurrency((backingAssets || 0) - (totalSupply || 0))}
            </span>
          </div>
        </div>

        {/* Last Audit */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Last On-Chain Audit:</span>
            <span className="text-xs font-mono">
              {lastAudit 
                ? new Date(Number(lastAudit) * 1000).toLocaleString()
                : 'Never'}
            </span>
          </div>
        </div>

        {/* On-Chain Verification */}
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => {
              window.open(
                `${BLOCK_EXPLORER}/address/${poolAddress}#readContract`,
                '_blank'
              );
            }}
          >
            <ExternalLinkIcon className="w-4 h-4 mr-2" />
            Verify on Polygonscan
          </Button>
        </div>

        {/* Alert if under-collateralized */}
        {!isFullyBacked && (
          <Alert variant="danger" className="mt-4">
            <AlertIcon />
            <AlertTitle>Reserve Alert</AlertTitle>
            <AlertDescription>
              Pool reserves are below 100%. Redemptions may be affected.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 5.8.3 Reserve Ratio Chart

**Component:** `ReserveRatioChart.tsx`

```tsx
// src/components/pools/ReserveRatioChart.tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ReserveRatioChartProps {
  data: Array<{
    date: string;
    ratio: number;
  }>;
}

export function ReserveRatioChart({ data }: ReserveRatioChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reserve Ratio History (30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis 
              domain={[90, 110]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Reserve Ratio']}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Area 
              type="monotone" 
              dataKey="ratio" 
              stroke="#10B981" 
              fillOpacity={1} 
              fill="url(#colorRatio)" 
            />
            {/* 100% line */}
            <ReferenceLine 
              y={100} 
              stroke="#DC2626" 
              strokeDasharray="3 3"
              label="100% (Fully Backed)"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success-500 rounded-full mr-2" />
            <span className="text-sm text-gray-600">Above 100%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-danger-500 rounded-full mr-2" />
            <span className="text-sm text-gray-600">Below 100%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 5.8.4 Pool Card with Reserve Indicator

**Component:** `PoolCardWithReserve.tsx`

```tsx
// src/components/pools/PoolCard.tsx
import { ProofOfReserveBadge } from './ProofOfReserveBadge';

interface PoolCardProps {
  pool: Pool;
}

export function PoolCard({ pool }: PoolCardProps) {
  return (
    <Card variant="interactive">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{pool.name}</CardTitle>
            <p className="text-sm text-gray-500">{pool.assetClass}</p>
          </div>
          {/* Reserve Badge */}
          <ProofOfReserveBadge reserveRatio={pool.reserveRatio} />
        </div>
      </CardHeader>
      <CardContent>
        {/* Other pool metrics... */}
        
        {/* Reserve Info */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Reserve Ratio</span>
            <span className="font-semibold">
              {(pool.reserveRatio * 100).toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">Last Audit</span>
            <span className="text-xs font-mono">
              {new Date(pool.lastAudit).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Badge Component:**

```tsx
// src/components/pools/ProofOfReserveBadge.tsx
interface ProofOfReserveBadgeProps {
  reserveRatio: number; // 0.0 to 2.0+
}

export function ProofOfReserveBadge({ reserveRatio }: ProofOfReserveBadgeProps) {
  const isFullyBacked = reserveRatio >= 1.0;
  const isWellBacked = reserveRatio >= 1.05;

  return (
    <Badge 
      variant={isFullyBacked ? 'success' : 'danger'}
      className="flex items-center"
    >
      {isWellBacked ? (
        <>
          <ShieldCheckIcon className="w-3 h-3 mr-1" />
          {((reserveRatio - 1) * 100).toFixed(1)}% Surplus
        </>
      ) : isFullyBacked ? (
        <>
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          100% Backed
        </>
      ) : (
        <>
          <AlertTriangleIcon className="w-3 h-3 mr-1" />
          {((1 - reserveRatio) * 100).toFixed(1)}% Deficit
        </>
      )}
    </Badge>
  );
}
```

---

## 5.8.5 Dashboard Reserve Widget

**Component:** `ReserveWidget.tsx`

```tsx
// src/components/dashboard/ReserveWidget.tsx
import { useQuery } from '@tanstack/react-query';

export function ReserveWidget() {
  const { data: reserves } = useQuery({
    queryKey: ['reserves'],
    queryFn: () => api.get('/api/v1/pools/reserves'),
    refetchInterval: 60000, // Update every minute
  });

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Proof of Reserve</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Reserves</p>
            <p className="text-2xl font-bold text-success-700">
              {formatCurrency(reserves?.totalReserves || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">uLP Supply</p>
            <p className="text-2xl font-bold">
              {formatCurrency(reserves?.ulpSupply || 0)}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Reserve Ratio</span>
            <span className="font-semibold">
              {(reserves?.reserveRatio * 100).toFixed(2)}%
            </span>
          </div>
          <ProgressBar 
            value={Math.min(reserves?.reserveRatio * 100 || 0, 100)} 
            max={100}
            color={reserves?.reserveRatio >= 1 ? 'success' : 'danger'}
          />
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Last updated: {new Date(reserves?.timestamp).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 5.8.6 API Integration

**Endpoint:** `GET /api/v1/pools/reserves`

```typescript
// src/services/api/reserves.ts
import { api } from '@/lib/api';

export interface ReserveData {
  totalReserves: number;      // Total backing assets (Ondo EUROD (EUROD))
  ulpSupply: number;          // Total uLP tokens outstanding
  reserveRatio: number;       // Ratio (1.0 = 100% backed)
  surplus: number;            // Surplus/deficit amount
  lastAudit: string;          // ISO 8601 timestamp
  pools: Array<{
    poolId: string;
    poolName: string;
    reserves: number;
    ulpSupply: number;
    ratio: number;
  }>;
}

export async function getReserves(): Promise<ReserveData> {
  const response = await api.get('/api/v1/pools/reserves');
  return response.data;
}

export async function getPoolReserves(poolId: string): Promise<ReserveData> {
  const response = await api.get(`/api/v1/pools/${poolId}/reserves`);
  return response.data;
}
```

**Backend Endpoint:**

```python
# backend/api/reserves.py
from fastapi import APIRouter
from web3 import Web3

router = APIRouter()

@router.get("/api/v1/pools/reserves")
async def get_reserves():
    """
    Get proof of reserve data for all pools.
    
    Returns on-chain attested reserve data.
    """
    pools = await db.fetch_all("SELECT * FROM liquidity_pools")
    
    total_reserves = 0
    total_ulp_supply = 0
    pool_data = []
    
    for pool in pools:
        # Get on-chain data
        ulp_supply = await ulp_contract.functions.totalSupply().call()
        backing_assets = await pool_contract.functions.getTotalBackingAssets().call()
        
        ratio = backing_assets / ulp_supply if ulp_supply > 0 else 1.0
        
        total_reserves += backing_assets
        total_ulp_supply += ulp_supply
        
        pool_data.append({
            'poolId': pool['id'],
            'poolName': pool['name'],
            'reserves': backing_assets,
            'ulpSupply': ulp_supply,
            'ratio': ratio,
        })
    
    overall_ratio = total_reserves / total_ulp_supply if total_ulp_supply > 0 else 1.0
    
    return {
        'totalReserves': total_reserves,
        'ulpSupply': total_ulp_supply,
        'reserveRatio': overall_ratio,
        'surplus': total_reserves - total_ulp_supply,
        'lastAudit': datetime.utcnow().isoformat(),
        'pools': pool_data,
    }
```

---

## 5.8.7 Placement Guide

**Where to Display Proof of Reserve:**

| Location | Component | Priority |
|----------|-----------|----------|
| **Dashboard** | Reserve Widget | P0 |
| **Pool Marketplace** | Reserve Badge on Cards | P0 |
| **Pool Detail** | Full Reserve Display | P0 |
| **Pool Detail** | Reserve Ratio Chart | P1 |
| **Institutional Dashboard** | Reserve Summary | P0 |
| **Compliance Dashboard** | Reserve Audit Trail | P1 |

---

## 5.8.8 Testing

**Unit Tests:**

```tsx
// tests/unit/components/ProofOfReserveDisplay.test.tsx
import { render, screen } from '@testing-library/react';
import { ProofOfReserveDisplay } from '@/components/pools/ProofOfReserveDisplay';

describe('ProofOfReserveDisplay', () => {
  it('shows fully backed status when ratio >= 100%', () => {
    render(<ProofOfReserveDisplay poolAddress="0x..." ulpTokenAddress="0x..." />);
    
    expect(screen.getByText('✅ Fully Backed')).toBeInTheDocument();
  });

  it('shows alert when under-collateralized', () => {
    // Mock contract to return ratio < 100%
    render(<ProofOfReserveDisplay poolAddress="0x..." ulpTokenAddress="0x..." />);
    
    expect(screen.getByText('Reserve Alert')).toBeInTheDocument();
  });

  it('displays reserve ratio correctly', () => {
    render(<ProofOfReserveDisplay poolAddress="0x..." ulpTokenAddress="0x..." />);
    
    expect(screen.getByText(/100\.00%/)).toBeInTheDocument();
  });
});
```

---

## 5.8.9 Chainlink Integration (Future)

**For Production:**

```typescript
// src/lib/chainlink.ts
import { Contract } from 'ethers';

const CHAINLINK_ORACLE_ABI = [
  'function latestAnswer() view returns (int256)',
  'function latestTimestamp() view returns (uint256)',
  'function latestRound() view returns (uint256)',
];

export async function getChainlinkProofOfReserves(
  oracleAddress: string
): Promise<{
  reserves: bigint;
  timestamp: number;
  roundId: number;
}> {
  const oracle = new Contract(oracleAddress, CHAINLINK_ORACLE_ABI, provider);
  
  const [reserves, timestamp, roundId] = await Promise.all([
    oracle.latestAnswer(),
    oracle.latestTimestamp(),
    oracle.latestRound(),
  ]);
  
  return {
    reserves: BigInt(reserves.toString()),
    timestamp: Number(timestamp),
    roundId: Number(roundId),
  };
}
```

---

# 6. Component Library

## 6.1 Base Components

### Button

```tsx
// src/components/ui/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary-700 text-white hover:bg-primary-600',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
        ghost: 'hover:bg-gray-100',
        link: 'text-primary-700 underline-offset-4 hover:underline',
        destructive: 'bg-danger-600 text-white hover:bg-danger-700',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-11 px-8 text-lg',
        
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

### Usage Examples

```tsx
// Primary action
<Button onClick={handleSubscribe}>
  Subscribe to Pool
</Button>

// Secondary action
<Button variant="secondary" onClick={handleCancel}>
  Cancel
</Button>

// With icon
<Button>
  <DownloadIcon className="mr-2 h-4 w-4" />
  Download Statement
</Button>

// Loading state
<Button disabled={isLoading}>
  {isLoading ? <Spinner className="mr-2" /> : null}
  Processing...
</Button>
```

---

### Card

```tsx
// src/components/ui/Card.tsx
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-white',
        variant === 'default' && 'border-gray-200 shadow-sm',
        variant === 'elevated' && 'border-gray-200 shadow-md',
        variant === 'interactive' && 'border-gray-200 shadow-sm hover:shadow-lg transition-shadow cursor-pointer',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props} />
  );
}
```

---

### Input

```tsx
// src/components/ui/Input.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, prefix, suffix, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {prefix}
            </div>
          )}
          <input
            className={cn(
              'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
              'placeholder:text-gray-400',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-danger-500 focus-visible:ring-danger-500',
              prefix && 'pl-10',
              suffix && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-danger-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
```

### Usage Example

```tsx
<Input
  label="Investment Amount"
  type="number"
  placeholder="€100,000"
  prefix="€"
  error={errors.amount?.message}
  helperText="Minimum investment: €100,000"
  {...register('amount')}
/>
```

---

## 6.2 Complex Components

### KPICard

```tsx
// src/components/dashboard/KPICard.tsx
interface KPICardProps {
  title: string;
  value: string;
  change?: {
    value: number;
    period: string;
  };
  status?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  live?: boolean;
}

export function KPICard({
  title,
  value,
  change,
  status = 'neutral',
  icon,
  live,
}: KPICardProps) {
  return (
    <Card variant="elevated">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        {icon && <div className="h-4 w-4 text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="flex items-center mt-2 space-x-2">
          {change && (
            <span
              className={cn(
                'text-sm font-medium',
                change.value >= 0 ? 'text-success-600' : 'text-danger-600'
              )}
            >
              {change.value >= 0 ? '▲' : '▼'} {Math.abs(change.value)}%
            </span>
          )}
          {change && (
            <span className="text-sm text-gray-500">({change.period})</span>
          )}
          {live && (
            <span className="flex items-center text-sm text-success-600">
              <span className="w-2 h-2 mr-1 bg-success-600 rounded-full animate-pulse" />
              Live
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### PoolCard

```tsx
// src/components/pools/PoolCard.tsx
interface PoolCardProps {
  pool: Pool;
  onViewDetails: (poolId: string) => void;
  onSubscribe: (poolId: string) => void;
}

export function PoolCard({ pool, onViewDetails, onSubscribe }: PoolCardProps) {
  const progressPercentage = (pool.raised / pool.target) * 100;
  
  return (
    <Card variant="interactive" onClick={() => onViewDetails(pool.id)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PoolIcon assetClass={pool.assetClass} className="h-8 w-8" />
            <div>
              <CardTitle>{pool.name}</CardTitle>
              <p className="text-sm text-gray-500">{pool.assetClass}</p>
            </div>
          </div>
          <StatusBadge status={pool.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Raised</span>
            <span className="font-medium">
              {formatCurrency(pool.raised)} / {formatCurrency(pool.target)}
            </span>
          </div>
          <ProgressBar value={progressPercentage} />
          <p className="text-xs text-gray-500">{progressPercentage.toFixed(0)}% funded</p>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Metric label="APY" value={`${pool.apy}%`} status={pool.performanceStatus} />
          <Metric label="Risk" value={pool.riskRating} />
          <Metric label="Min Investment" value={formatCurrency(pool.minInvestment)} />
          <Metric label="NAV" value={formatCurrency(pool.navPerShare)} />
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2 pt-4">
          <Button
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onSubscribe(pool.id);
            }}
          >
            Subscribe
          </Button>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(pool.id);
            }}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

# 7. User Flows

## 7.1 First-Time Institutional Investor

```
1. Landing Page
   └─ Clicks "Get Started" or "Contact Sales"
   
2. Onboarding Initiation
   └─ Selects "Institutional Investor"
   └─ Enters email, company name
   └─ Receives verification email
   
3. Account Creation
   └─ Sets password
   └─ Connects wallet (MetaMask, WalletConnect)
   └─ Verifies wallet ownership (signature)
   
4. KYB Submission (Enhanced Due Diligence)
   └─ Uploads company documents:
      - Certificate of Incorporation
      - Memorandum & Articles of Association
      - Board Resolution authorizing investment
      - Beneficial Owner Declaration
      - Proof of Address
   └─ Completes company information:
      - Legal name, registration number
      - Registered address
      - Industry sector
      - AUM range
      - Investment mandate
   
5. Compliance Review
   └─ Automated AML screening (ComplyAdvantage)
   └─ PEP/sanctions check
   └─ Manual review by compliance officer (if required)
   └─ ONCHAINID claim issued upon approval
   
6. Guided Platform Tour
   └─ Interactive walkthrough of dashboard
   └─ Explanation of uLP tokens, yield mechanics
   └─ Link to educational resources
   
7. First Investment
   └─ Browses pool marketplace
   └─ Views pool details
   └─ Clicks "Subscribe"
   └─ Enters amount (≥€100,000)
   └─ Reviews terms
   └─ Selects funding source
   └─ Signs transaction
   └─ Tracks progress
   
8. Post-Investment
   └─ Receives confirmation email
   └─ uLP tokens appear in wallet
   └─ Position visible in portfolio
   └─ Can download yield statement
```

---

## 7.2 Repeat Investment Flow

```
1. Login
   └─ Connect wallet
   └─ Signature authentication
   
2. Dashboard
   └─ Views portfolio performance
   └─ Checks yield accrual
   
3. Browse Pools
   └─ Filters by preferred criteria
   └─ Views pool details
   
4. Subscribe
   └─ Enters amount
   └─ Quick confirm (KYB already verified)
   └─ Signs transaction
   
5. Confirmation
   └─ Real-time progress tracking
   └─ Email notification
```

---

## 7.3 Redemption Flow

```
1. Navigate to Portfolio
   └─ Selects pool position
   └─ Clicks "Redeem"
   
2. Enter Redemption Amount
   └─ Specifies uLP amount or Ondo EUROD (EUROD) value
   └─ Sees estimated proceeds
   └─ Acknowledges redemption notice period (30 days)
   
3. Submit Redemption Request
   └─ Signs transaction
   └─ Request queued for processing
   
4. Processing Period (30 days)
   └─ Status: "Redemption Pending"
   └─ Yield continues to accrue
   └─ Can cancel redemption (if pool allows)
   
5. Redemption Complete
   └─ uLP tokens burned
   └─ Ondo EUROD (EUROD) transferred to wallet
   └─ Transaction recorded on-chain
   └─ Email confirmation
```

---

# 8. Accessibility Requirements

## 8.1 WCAG 2.2 AA Compliance

### Perceivable

| Requirement | Implementation |
|-------------|----------------|
| **Text Alternatives** | All images have alt text, icons have aria-labels |
| **Time-Based Media** | Captions for videos, transcripts for audio |
| **Adaptable Content** | Semantic HTML, proper heading hierarchy |
| **Distinguishable** | 4.5:1 contrast ratio, resizable text (200%) |

### Operable

| Requirement | Implementation |
|-------------|----------------|
| **Keyboard Accessible** | All interactive elements focusable via Tab |
| **Enough Time** | No time limits, or ability to extend |
| **Seizures** | No flashing content (>3 times/second) |
| **Navigable** | Breadcrumbs, skip links, focus indicators |

### Understandable

| Requirement | Implementation |
|-------------|----------------|
| **Readable** | Plain language (8th grade level), glossary for jargon |
| **Predictable** | Consistent navigation, clear labels |
| **Input Assistance** | Inline validation, clear error messages |

### Robust

| Requirement | Implementation |
|-------------|----------------|
| **Compatible** | Valid HTML, ARIA where needed, tested with screen readers |

---

## 8.2 Keyboard Navigation

```
Tab Order:
1. Skip to main content link
2. Logo
3. Navigation links
4. Search bar
5. Main content
6. Footer links

Focus Indicators:
- 3px solid outline
- 3:1 contrast ratio
- Visible on all interactive elements
```

---

## 8.3 Screen Reader Support

```tsx
// Accessible chart example
<div
  role="img"
  aria-label={`Portfolio allocation: ${allocation.map(a => `${a.name} ${a.percentage}%`).join(', ')}`}
>
  <PieChart data={allocation} />
  
  {/* Hidden table for screen readers */}
  <table className="sr-only">
    <caption>Portfolio Allocation Details</caption>
    <thead>
      <tr>
        <th scope="col">Pool</th>
        <th scope="col">Percentage</th>
        <th scope="col">Value (Ondo EUROD (EUROD))</th>
      </tr>
    </thead>
    <tbody>
      {allocation.map(item => (
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>{item.percentage}%</td>
          <td>{formatCurrency(item.value)}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

# 9. Performance Requirements

## 9.1 Core Web Vitals

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Largest Contentful Paint (LCP)** | <2.5s | 75th percentile |
| **First Input Delay (FID)** | <100ms | 75th percentile |
| **Cumulative Layout Shift (CLS)** | <0.1 | 75th percentile |
| **First Contentful Paint (FCP)** | <1.5s | 75th percentile |
| **Time to Interactive (TTI)** | <3.5s | 75th percentile |

---

## 9.2 Optimization Strategies

### Code Splitting

```tsx
// Route-based splitting
const Dashboard = lazy(() => import('@/pages/dashboard'));
const Pools = lazy(() => import('@/pages/pools'));
const Portfolio = lazy(() => import('@/pages/portfolio'));

// In App.tsx
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/pools" element={<Pools />} />
    <Route path="/portfolio" element={<Portfolio />} />
  </Routes>
</Suspense>
```

### Image Optimization

```tsx
// Use WebP/AVIF formats
<picture>
  <source srcSet="/hero.avif" type="image/avif" />
  <source srcSet="/hero.webp" type="image/webp" />
  <img src="/hero.jpg" alt="Hero" loading="lazy" />
</picture>
```

### Data Fetching

```tsx
// TanStack Query with caching
const { data, isLoading } = useQuery({
  queryKey: ['dashboard', investorId],
  queryFn: () => fetchDashboard(investorId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  refetchInterval: 30 * 1000, // 30 seconds for real-time feel
});
```

---

# 10. Security Requirements

## 10.1 Frontend Security Checklist

| Security Measure | Implementation |
|------------------|----------------|
| **HTTPS Only** | All API calls over HTTPS |
| **CSP Headers** | Content-Security-Policy configured |
| **XSS Protection** | React auto-escapes, no dangerouslySetInnerHTML |
| **CSRF Protection** | Double-submit cookie pattern |
| **Input Validation** | Client + server-side validation |
| **Secret Management** | No secrets in frontend code |
| **Dependency Scanning** | npm audit, Snyk integration |
| **Error Handling** | Generic error messages, detailed logging |

---

## 10.2 Web3 Security

```tsx
// Always verify contract addresses
const CONTRACT_ADDRESSES = Object.freeze({
  uLPToken: import.meta.env.VITE_ULP_TOKEN_ADDRESS,
  LiquidityPool: import.meta.env.VITE_LIQUIDITY_POOL_ADDRESS,
} as const);

// Validate transaction parameters before signing
async function validateAndSign(transaction: Transaction) {
  // Verify recipient address
  if (!isValidAddress(transaction.to)) {
    throw new Error('Invalid recipient address');
  }
  
  // Verify amount
  if (transaction.amount <= 0) {
    throw new Error('Invalid amount');
  }
  
  // Show user clear transaction details
  await showTransactionConfirmation(transaction);
  
  // Request signature
  return await signTransaction(transaction);
}
```

---

# 11. Testing Strategy

## 11.1 Testing Pyramid

```
        /\
       /  \      E2E Tests (Playwright)
      /----\     Critical user flows
     /      \    
    /--------\   Integration Tests (Vitest + Testing Library)
   /          \  Component interactions
  /------------\ 
 /              \ Unit Tests (Vitest)
/________________\ Utilities, hooks, formatters
```

---

## 11.2 Test Coverage Targets

| Test Type | Coverage Target |
|-----------|-----------------|
| Unit Tests | >90% |
| Integration Tests | >80% |
| E2E Tests | Critical flows only |

---

## 11.3 Example Tests

```tsx
// Unit test example
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/utils/formatters';

describe('formatCurrency', () => {
  it('formats EUR correctly', () => {
    expect(formatCurrency(1234567.89, 'EUR')).toBe('€1,234,567.89');
  });
  
  it('handles small amounts', () => {
    expect(formatCurrency(0.0042, 'EUR')).toBe('€0.0042');
  });
});

// Component test example
import { render, screen } from '@testing-library/react';
import { KPICard } from '@/components/dashboard/KPICard';

describe('KPICard', () => {
  it('renders title and value', () => {
    render(
      <KPICard
        title="Total Value"
        value="€2,450,000"
        change={{ value: 2.3, period: '24h' }}
      />
    );
    
    expect(screen.getByText('Total Value')).toBeInTheDocument();
    expect(screen.getByText('€2,450,000')).toBeInTheDocument();
  });
});

// E2E test example (Playwright)
import { test, expect } from '@playwright/test';

test('investor can subscribe to pool', async ({ page }) => {
  // Login
  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Connect Wallet' }).click();
  
  // Navigate to pools
  await page.getByRole('link', { name: 'Pools' }).click();
  
  // Select pool
  await page.getByRole('button', { name: 'Subscribe' }).first().click();
  
  // Enter amount
  await page.getByLabel('Investment Amount').fill('500000');
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // Confirm
  await page.getByRole('button', { name: 'Sign Transaction' }).click();
  
  // Wait for confirmation
  await expect(page.getByText('Investment Complete')).toBeVisible();
});
```

---

# 12. Implementation Timeline

## 12.1 Phase 1: Foundation (Week 1-2)

| Task | Duration | Owner |
|------|----------|-------|
| Project setup (Vite, TypeScript, Tailwind) | 1 day | Lead Dev |
| Design system implementation | 3 days | Frontend Team |
| Base components (Button, Card, Input, etc.) | 3 days | Frontend Team |
| Layout components (Header, Sidebar, Footer) | 2 days | Frontend Team |
| Routing setup | 1 day | Lead Dev |

**Deliverable:** Component library v1.0, design system documented

---

## 12.2 Phase 2: Dashboard (Week 3-4)

| Task | Duration | Owner |
|------|----------|-------|
| Dashboard layout | 2 days | Frontend Team |
| KPI cards with live data | 3 days | Frontend Team |
| Charts integration (Recharts) | 3 days | Frontend Team |
| API integration (TanStack Query) | 3 days | Backend + Frontend |
| Web3 integration (wagmi/viem) | 3 days | Frontend Team |

**Deliverable:** Functional dashboard with mock data

---

## 12.3 Phase 3: Pool Features (Week 5-6)

| Task | Duration | Owner |
|------|----------|-------|
| Pool marketplace page | 3 days | Frontend Team |
| Pool detail page | 3 days | Frontend Team |
| Subscribe flow (multi-step) | 4 days | Frontend Team |
| Filter/search functionality | 2 days | Frontend Team |

**Deliverable:** Complete pool browsing and subscription

---

## 12.4 Phase 4: Portfolio & Compliance (Week 7-8)

| Task | Duration | Owner |
|------|----------|-------|
| Portfolio page | 3 days | Frontend Team |
| Yield statement generation | 2 days | Frontend Team |
| Compliance dashboard | 3 days | Frontend Team |
| Document upload/management | 2 days | Frontend Team |

**Deliverable:** Complete investor experience

---

## 12.5 Phase 5: Polish & Testing (Week 9-10)

| Task | Duration | Owner |
|------|----------|-------|
| Accessibility audit | 2 days | QA Team |
| Performance optimization | 3 days | Frontend Team |
| E2E testing | 3 days | QA Team |
| Bug fixes | 2 days | Frontend Team |
| Documentation | 2 days | Technical Writer |

**Deliverable:** Production-ready MVP frontend

---

# Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Ujamaa Pool Token (uLP)** | Ujamaa Liquidity Provider token; yield-bearing ERC-3643 token |
| **NAV** | Net Asset Value; value per Ujamaa Pool Token (uLP) |
| **APY** | Annual Percentage Yield; expected annual return |
| **TVL** | Total Value Locked; total assets in pool |
| **KYB** | Know Your Business; enhanced due diligence for institutions |
| **ERC-3643** | Token standard for permissioned securities |
| **ONCHAINID** | Decentralized identity protocol |

---

# Appendix B: References

- [React 19 Documentation](https://react.dev/)
- [TypeScript 6.0 Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Wagmi Documentation](https://wagmi.sh/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

---

**Document Control:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 17, 2026 | Aziz Da Silva | Initial Frontend Specification |
| 1.1 | March 17, 2026 | Aziz Da Silva | 🆕 Updated Color Palette (Heritage & Trust Theme) |
| **1.2** | **March 17, 2026** | **Aziz Da Silva** | **🆕 Added Logo & Branding (Section 3.7)** |

### Changes in v1.2:

**🆕 NEW: Section 3.7 - Logo & Branding**

**Logo Files (docs/10_DESIGN/):**
- ✅ `Ujamaa_DeFi_logo.png` - White background version
- ✅ `Ujamaa_DeFi_logo_transparent.png` - Transparent background version

**Logo Usage Guidelines:**
| Logo Version | Background | Usage |
|--------------|------------|-------|
| White Background | Light backgrounds | Documents, print, light web sections |
| Transparent | Dark backgrounds | Navigation headers, overlays, dark mode |

**Logo Sizes:**
| Context | Height |
|---------|--------|
| Navigation Header | 48px |
| Mobile Header | 40px |
| Footer | 32px |
| Hero Section | 80px |
| Email Signature | 24px |
| Favicon | 32px |
| Social Media | 120px |

**Logo Clear Space:**
- Minimum clear space = Height of elephant icon
- CSS padding implementation provided

**Logo Color Variations:**
| Background | Logo Version | Text Color |
|------------|--------------|------------|
| White (#FFFFFF) | White background | Deep Blue (#1D3557) |
| Light Gray (#F5F5F5) | White background | Deep Blue (#1D3557) |
| Deep Blue (#1D3557) | Transparent | White (#FFFFFF) |
| Vibrant Orange (#F58220) | Transparent | White (#FFFFFF) |
| Image Overlay | Transparent | White (#FFFFFF) |

**Logo Don'ts:**
- ❌ Stretch or distort
- ❌ Change colors (except approved)
- ❌ Add effects (shadows, gradients)
- ❌ Place on busy backgrounds
- ❌ Use low-resolution
- ❌ Rotate or flip

**Asset Import Path:**
```
frontend/public/assets/logos/
├── Ujamaa_DeFi_logo.png
├── Ujamaa_DeFi_logo_transparent.png
└── favicon.ico
```

**React Component Examples:**
```tsx
// Header (dark background)
<img src={logoTransparent} className="h-12 w-auto" />

// Footer (light background)
<img src={logo} className="h-8 w-auto" />
```

**Brand Colors in Logo:**
| Element | Color | Hex |
|---------|-------|-----|
| Elephant | Vibrant Orange | #F58220 |
| Text | Deep Blue | #1D3557 |
| Background | White/Transparent | #FFFFFF/transparent |

**Favicon & App Icons:**
- favicon.ico (32x32, 16x16)
- apple-touch-icon.png (180x180)
- android-chrome-192x192.png
- android-chrome-512x512.png
- manifest.json (PWA manifest)

**Approval Required:** Proceed with frontend implementation

**Next Step:** Begin Week 5, Day 1 tasks (Design System Setup)

---

*UJAMAA DEFI PLATFORM - Tokenize African Real-World Assets*
*Heritage & Trust Theme - Emphasizing Energy & Reliability*
*Institutional-Grade Frontend Specification for MVP*


