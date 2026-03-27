# UJAMAA DeFi Platform - Design & Technology Specification

**Author:** Aziz Da Silva - Lead Architect
**Version:** 2.0 (Design-Only)
**Last Updated:** March 19, 2026
**Purpose:** Reusable design system and technology blueprint for future projects

---

## Executive Summary

This document defines the **design system, technology stack, and architectural patterns** for building modern Web3 applications. It is **content-agnostic** and can be adapted to any project requiring:

- Institutional-grade UI/UX
- Web3/blockchain integration
- Multi-role user dashboards
- Real-time data visualization
- Internationalization support

---

## 1. Technology Stack

### 1.1 Core Framework

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | React | 19.x | UI framework |
| **Language** | TypeScript | 5.9.x | Type safety |
| **Routing** | React Router | 7.x | Client-side routing |
| **Build Tool** | Vite | 7.x | Development & bundling |

### 1.2 Styling & UI

| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | 4.x | Utility-first CSS framework |
| Lucide React | Latest | Icon library |
| Framer Motion | Latest | Animation library |
| Recharts | Latest | Data visualization |
| Class Variance Authority | Latest | Component variants |
| clsx + tailwind-merge | Latest | Conditional class utilities |

### 1.3 Web3 Integration

| Technology | Version | Purpose |
|------------|---------|---------|
| Wagmi | 2.x | React hooks for Ethereum |
| Viem | 2.x | TypeScript Ethereum interface |
| RainbowKit | 2.x | Wallet connection UI |
| TanStack React Query | 5.x | Data fetching & caching |

### 1.4 Supporting Libraries

| Technology | Version | Purpose |
|------------|---------|---------|
| Axios | 1.x | HTTP client |
| i18next | 25.x | Internationalization |
| React i18next | 16.x | React i18n bindings |

### 1.5 Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | 9.x | Code linting |
| Vitest | 4.x | Testing framework |
| Testing Library | 6.x | Component testing |

---

## 2. Design System

### 2.1 Color Palette

```javascript
colors: {
  // Primary brand colors
  primary: '#16A34A',      // Main brand color
  secondary: '#0D9488',    // Supporting brand color
  accent: '#F59E0B',       // Highlight/emphasis color
  
  // Neutrals
  dark: '#1F2937',         // Dark text/background
  light: '#F9FAFB',        // Light background
  
  // Semantic colors
  success: '#10B981',      // Success states
  warning: '#F59E0B',      // Warning states
  error: '#EF4444',        // Error states
  info: '#3B82F6',         // Information states
}
```

**Customization:** Replace hex values to match your brand identity.

### 2.2 Typography

```javascript
fontFamily: {
  sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
  heading: ['Plus Jakarta Sans', 'Poppins', 'system-ui', 'sans-serif'],
}
```

**Font Size Scale (Responsive):**
```css
h1: clamp(2.5rem, 5vw, 4.5rem)
h2: clamp(2rem, 4vw, 3.5rem)
h3: clamp(1.5rem, 3vw, 2rem)
```

### 2.3 Shadows

```javascript
boxShadow: {
  'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
  'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.05)',
  'glow-primary': '0 0 20px rgba(22, 163, 74, 0.3)',
  'glow-secondary': '0 0 20px rgba(13, 148, 136, 0.3)',
}
```

### 2.4 Animations

| Name | Duration | Effect | Use Case |
|------|----------|--------|----------|
| `float` | 6s | Vertical floating | Floating badges, decorative elements |
| `pulse-slow` | 4s | Slow pulse | Loading states, attention |
| `fadeIn` | 0.6s | Fade in + slide up | Page transitions, content reveal |
| `gradient-x` | 20s | Horizontal gradient | Background animations |
| `gradient-y` | 25s | Vertical gradient | Background animations |
| `carousel` | 30s | Horizontal scroll | Logo carousels |

### 2.5 Component Variants

#### Button
```typescript
variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white'
size: 'sm' | 'md' | 'lg' | 'xl'
```

#### Badge
```typescript
variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
size: 'sm' | 'md' | 'lg'
```

#### Card
```typescript
padding: 'sm' | 'md' | 'lg'
hover: boolean  // Enables hover effects
```

---

## 3. Architecture Patterns

### 3.1 Project Structure

```
src/
├── api/                  # API client & types
│   ├── client.ts         # HTTP client configuration
│   └── types.ts          # API response types
├── assets/               # Static assets (images, fonts)
├── components/           # React components
│   ├── features/         # Feature-specific components
│   ├── layout/           # Layout components (Header, Footer, etc.)
│   ├── ui/               # Reusable UI components
│   └── [domain]/         # Domain-specific components (e.g., web3)
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   ├── DataContext.tsx   # Application data
│   └── ThemeContext.tsx  # Theme state
├── hooks/                # Custom hooks
│   ├── contracts/        # Smart contract hooks
│   └── [domain]/         # Domain-specific hooks
├── i18n/                 # Internationalization
│   ├── locales/          # Translation files
│   │   ├── en/
│   │   └── [lang]/
│   └── config.ts         # i18n configuration
├── lib/                  # Utility libraries
│   └── utils.ts          # Helper functions
├── pages/                # Page components
│   ├── [module]/         # Module-specific pages
│   └── [page].tsx
├── types/                # TypeScript type definitions
│   └── [domain].ts
├── utils/                # Helper functions
│   └── [utility].ts
├── [domain]/             # Domain-specific modules
│   ├── config.ts
│   ├── providers.tsx
│   └── [domain-specific]/
├── App.tsx               # Main application
├── App.css               # App-specific styles
├── index.css             # Global styles
└── main.tsx              # Entry point
```

### 3.2 Context Hierarchy

```
<RootProvider>              // Theme, i18n
  └── <DomainProvider>      // Domain-specific providers (e.g., Web3)
        └── <AuthProvider>  // Authentication & authorization
              └── <DataProvider>  // Application data
                    └── <App>     // Routes & pages
```

### 3.3 State Management Strategy

| State Type | Solution | Location |
|------------|----------|----------|
| **Domain State** | Domain-specific provider | `domain/providers.tsx` |
| **Authentication** | React Context | `contexts/AuthContext.tsx` |
| **Remote Data** | React Query | Via domain hooks |
| **UI State** | React `useState` | Component-level |
| **Theme** | Context + localStorage | `contexts/ThemeContext.tsx` |

### 3.4 Routing Pattern

```typescript
// Route categories
{
  public: '/', '/about', '/contact',
  auth: '/dashboard', '/profile',
  role: {
    '[ROLE_A]': '/module-a',
    '[ROLE_B]': '/module-b',
  }
}

// Route protection
<Layout requireAuth allowedRoles={['ROLE_A', 'ROLE_B']}>
  <ProtectedPage />
</Layout>
```

---

## 4. Component Library

### 4.1 Base UI Components

#### Button
```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
}
```

**Features:**
- Loading state with spinner
- Disabled state handling
- Focus ring styles
- Active scale animation
- Icon support

#### Badge
```typescript
interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}
```

#### Card
```typescript
interface CardProps {
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

**Features:**
- Consistent padding options
- Optional hover effects
- Dark mode support

#### Input
```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}
```

#### Status Badge
```typescript
interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  size?: 'sm' | 'md';
}
```

### 4.2 Layout Components

#### Header
```typescript
interface HeaderProps {
  isConnected?: boolean;
  role?: string;
  isLoading?: boolean;
  needsOnboarding?: boolean;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  logo?: React.ReactNode;
  navigation?: NavItem[];
}

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  roles?: string[];  // Role-based visibility
}
```

**Features:**
- Logo/branding area
- Navigation links (role-based)
- Action buttons (wallet, settings, etc.)
- Dark mode toggle
- Mobile-responsive menu

#### Layout
```typescript
interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
}
```

**Features:**
- Header + Footer wrapper
- Route protection
- Role-based access control
- Theme persistence

#### Footer
```typescript
interface FooterProps {
  links?: FooterLink[];
  socialLinks?: SocialLink[];
  copyright?: string;
}
```

### 4.3 Feature Components

#### DataTable
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  isLoading?: boolean;
}
```

**Features:**
- Sortable columns
- Search functionality
- Pagination
- Row actions
- Empty state

#### StatsCard
```typescript
interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}
```

#### Chart Panel
```typescript
interface ChartPanelProps {
  title: string;
  data: any[];
  chartType: 'bar' | 'line' | 'pie' | 'area';
  height?: number;
}
```

#### ActivityFeed
```typescript
interface ActivityFeedProps {
  activities: Activity[];
  onLoadMore?: () => void;
}

interface Activity {
  id: string;
  type: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
  color: string;
}
```

---

## 5. Page Templates

### 5.1 Landing Page Template

**Structure:**
```tsx
<LandingLayout>
  <HeroSection>
    - Headline
    - Subheadline
    - CTA buttons
    - Trust badges
  </HeroSection>
  
  <ProductPreview>
    - Dashboard mockup
    - Feature highlights
  </ProductPreview>
  
  <TrustSignals>
    - Animated counters
    - Partner logos
  </TrustSignals>
  
  <FeaturesGrid>
    - Feature cards (4-6 items)
  </FeaturesGrid>
  
  <HowItWorks>
    - Step-by-step process
  </HowItWorks>
  
  <CTASection>
    - Final CTA
  </CTASection>
</LandingLayout>
```

**Design Patterns:**
- Animated gradient backgrounds
- Glassmorphism effects
- Floating badges with CSS animations
- Counter animations on scroll
- Logo carousel

### 5.2 Dashboard Template

**Structure:**
```tsx
<DashboardLayout>
  <DashboardHeader>
    - Page title
    - Subtitle
    - Action buttons
  </DashboardHeader>
  
  <StatsGrid>
    - StatsCard × 4
  </StatsGrid>
  
  <MainContent>
    <ChartSection>
      - Primary data visualization
    </ChartSection>
    
    <DataTableSection>
      - Primary data table
    </DataTableSection>
    
    <ActivityFeedSection>
      - Recent activity
    </ActivityFeedSection>
  </MainContent>
  
  <SidePanel>
    - Secondary information
    - Quick actions
  </SidePanel>
</DashboardLayout>
```

**Design Patterns:**
- Responsive grid layouts
- Card-based content organization
- Sticky headers
- Collapsible side panels

### 5.3 Detail Page Template

**Structure:**
```tsx
<DetailLayout>
  <DetailHeader>
    - Breadcrumb
    - Title
    - Action buttons
    - Status badge
  </DetailHeader>
  
  <DetailContent>
    <InfoSection>
      - Key information cards
    </InfoSection>
    
    <TabsSection>
      - Tabbed content areas
    </TabsSection>
    
    <RelatedSection>
      - Related items
    </RelatedSection>
  </DetailContent>
  
  <DetailSidebar>
    - Summary card
    - Quick actions
    - Metadata
  </DetailSidebar>
</DetailLayout>
```

### 5.4 Form/Multi-step Template

**Structure:**
```tsx
<FormLayout>
  <FormHeader>
    - Title
    - Description
    - Progress indicator
  </FormHeader>
  
  <FormSteps>
    <Step1>
      - Step title
      - Step description
      - Form fields
    </Step1>
    
    <Step2>
      - ...
    </Step2>
  </FormSteps>
  
  <FormNavigation>
    - Back button
    - Next/Submit button
  </FormNavigation>
</FormLayout>
```

**Design Patterns:**
- Progress indicator
- Step validation
- Summary review before submit
- Draft auto-save

---

## 6. Web3 Integration Pattern

### 6.1 Provider Setup

```typescript
// providers.tsx
<DomainProvider>  // e.g., WagmiProvider
  <QueryClientProvider>
    <UIProvider>  // e.g., RainbowKit
      {children}
    </UIProvider>
  </QueryClientProvider>
</DomainProvider>
```

### 6.2 Contract Hooks Pattern

```typescript
// useDomainContract.ts
export function useDomainContract() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  
  // Read
  const { data: readData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'readFunction',
    args: [arguments],
  });
  
  // Write
  const writeFunction = async ({ args }: { args: any[] }) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'writeFunction',
      args,
    });
  };
  
  return {
    data: readData,
    writeFunction,
    // ... additional utilities
  };
}
```

### 6.3 Wallet Connection Pattern

```typescript
// WalletConnection.tsx
export function WalletConnection({ variant = 'full' }) {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  
  if (isConnected) {
    return <ConnectedView />;
  }
  
  return <ConnectButton onClick={openConnectModal} />;
}
```

---

## 7. Authentication Pattern

### 7.1 Auth Context

```typescript
// AuthContext.tsx
interface AuthContextType {
  address: string | undefined;
  isConnected: boolean;
  role: string | null;  // Defined by inheriting project
  isLoading: boolean;
  error: Error | null;
  refreshRole: () => void;
}

export function AuthProvider({ children }) {
  const { address, isConnected } = useDomainAccount();
  const [role, setRole] = useState<string | null>(null);
  
  // Fetch role from API
  const { data: userData, refetch } = useQuery({
    queryKey: ['user', address],
    queryFn: async () => {
      if (!address) return null;
      const response = await api.get(`/users/${address}`);
      return response.data;
    },
    enabled: !!address,
  });
  
  // Sync role state
  useEffect(() => {
    setRole(userData?.role || null);
  }, [userData]);
  
  return (
    <AuthContext.Provider value={{ address, isConnected, role, ... }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 7.2 Role-Based Access Control

```typescript
// Layout.tsx
export function Layout({ requireAuth, allowedRoles, children }) {
  const { isConnected, role, isLoading } = useAuth();
  
  // Check authentication
  if (requireAuth && !isConnected) {
    return <AuthRequired />;
  }
  
  // Check role authorization
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Unauthorized />;
  }
  
  return (
    <div className="layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
```

### 7.3 Onboarding Detection

```typescript
// Hook to detect incomplete onboarding
export function useOnboardingRequired() {
  const { address, role, isLoading } = useAuth();
  return !isLoading && !!address && !role;
}
```

---

## 8. Internationalization

### 8.1 Configuration

```typescript
// i18n/config.ts
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      // Add more languages as needed
    },
    fallbackLng: 'en',
    lng: 'en',
    interpolation: {
      escapeValue: false,  // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
    initImmediate: true,
  });
```

### 8.2 Translation File Structure

```json
{
  "nav": { ... },
  "common": { ... },
  "[module]": {
    "[feature]": {
      "title": "...",
      "description": "...",
      "actions": { ... }
    }
  }
}
```

### 8.3 Usage Pattern

```typescript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('[module].[feature].title')}</h1>
      <button onClick={() => i18n.changeLanguage('fr')}>
        FR
      </button>
    </div>
  );
}
```

---

## 9. API Integration

### 9.1 API Client

```typescript
// api/client.ts
const api = axios.create({
  baseURL: `${API_URL}/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

### 9.2 Query Pattern

```typescript
// Using React Query with API
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', param],
  queryFn: async () => {
    const response = await api.get(`/resource/${param}`);
    return response.data;
  },
  enabled: !!param,
  staleTime: 5 * 60 * 1000,  // 5 minutes
  retry: 2,
});
```

### 9.3 Mutation Pattern

```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    const response = await api.post('/resource', data);
    return response.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries(['resource']);
  },
});
```

---

## 10. Build Configuration

### 10.1 Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          'framework': ['react', 'react-dom', 'react-router-dom'],
          'i18n': ['i18next', 'react-i18next'],
          'ui': ['lucide-react', 'class-variance-authority', 'clsx'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
```

### 10.2 Tailwind Configuration

```javascript
// tailwind.config.js
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16A34A',
        secondary: '#0D9488',
        accent: '#F59E0B',
        // ... semantic colors
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'Poppins', 'system-ui'],
      },
      boxShadow: {
        'soft': '...',
        'soft-lg': '...',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.6s ease-out',
      },
    },
  },
  plugins: [],
};
```

### 10.3 TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
    }
  }
}
```

---

## 11. Accessibility

### 11.1 Implementation Checklist

- [ ] Skip to main content link
- [ ] Semantic HTML elements (`<main>`, `<nav>`, `<header>`, `<footer>`)
- [ ] ARIA labels on interactive elements
- [ ] Focus management (visible focus states)
- [ ] Keyboard navigation support
- [ ] Screen reader announcements
- [ ] Color contrast compliance (WCAG AA)
- [ ] Form label associations
- [ ] Error message announcements

### 11.2 Key Patterns

```tsx
// Skip link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

// Semantic structure
<main id="main-content" role="main" aria-label="Page title">
  <nav aria-label="Main navigation">...</nav>
  <section aria-labelledby="section-title">
    <h2 id="section-title">Section Title</h2>
  </section>
</main>

// Interactive elements
<button aria-label="Toggle dark mode">
<input aria-label="Search" />
```

---

## 12. Performance Optimizations

### 12.1 Code Splitting

```typescript
// Route-based lazy loading
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

### 12.2 React Query Optimization

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,  // 24 hours
      staleTime: 1000 * 60 * 5,     // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 12.3 Image Optimization

```tsx
// Use modern formats
<img src="/image.webp" alt="..." loading="lazy" />

// Responsive images
<picture>
  <source srcSet="/image.avif" type="image/avif" />
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.jpg" alt="..." />
</picture>
```

### 12.4 Bundle Targets

| Metric | Target |
|--------|--------|
| Initial JS | < 150KB |
| Total JS | < 500KB |
| First Paint | < 1.5s |
| LCP | < 2.5s |

---

## 13. CSS Utilities

### 13.1 Custom Animations

```css
/* Fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

/* Float */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Gradient movement */
@keyframes gradient-x {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 0) scale(1.1); }
}

.animate-gradient-x {
  animation: gradient-x 20s linear infinite;
}
```

### 13.2 Glassmorphism

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .glass {
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 13.3 Screen Reader Only

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## 14. Deployment

### 14.1 Environment Variables

```env
# API Configuration
VITE_API_URL=https://api.example.com
VITE_API_VERSION=v1

# Domain Configuration
VITE_CHAIN_ID=1  # Ethereum Mainnet
VITE_APP_NAME="My App"
```

### 14.2 Build Commands

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

### 14.3 Hosting Options

| Provider | Best For |
|----------|----------|
| Vercel | Auto-deploy, Edge functions |
| Netlify | Simple deployment, Forms |
| Cloudflare Pages | Fast CDN, Edge compute |
| AWS S3 + CloudFront | Full control, Cost-effective |

---

## 15. Reproduction Checklist

### Phase 1: Setup (1 hour)
- [ ] Create Vite + React + TypeScript project
- [ ] Install core dependencies
- [ ] Install Web3 dependencies (if needed)
- [ ] Install styling dependencies
- [ ] Install i18n dependencies

### Phase 2: Configuration (1 hour)
- [ ] Initialize Tailwind CSS
- [ ] Configure design tokens (colors, fonts, shadows)
- [ ] Configure Vite build optimization
- [ ] Configure TypeScript paths

### Phase 3: Core Setup (2 hours)
- [ ] Create folder structure
- [ ] Set up domain providers
- [ ] Set up contexts (Auth, Theme, Data)
- [ ] Set up i18n

### Phase 4: Component Library (4 hours)
- [ ] Build base UI components (Button, Badge, Card, Input)
- [ ] Build layout components (Header, Footer, Layout)
- [ ] Build feature components (DataTable, StatsCard, Charts)

### Phase 5: Pages (4 hours)
- [ ] Build landing page template
- [ ] Build dashboard template
- [ ] Build detail page template
- [ ] Build form/multi-step template

### Phase 6: Integration (2 hours)
- [ ] Connect domain providers
- [ ] Connect API
- [ ] Set up routing with guards

### Phase 7: Polish (2 hours)
- [ ] Add animations
- [ ] Implement dark mode
- [ ] Ensure responsive design
- [ ] Accessibility audit
- [ ] Performance optimization

**Total Estimated Time:** 16 hours

---

## 16. Customization Guide

### 16.1 Brand Customization

1. **Update colors** in `tailwind.config.js`
2. **Update fonts** in `tailwind.config.js`
3. **Update logo** in Header component
4. **Update animations** to match brand personality

### 16.2 Role System

The role system is **project-defined**. To customize:

```typescript
// Define your roles
type UserRole = 'ROLE_A' | 'ROLE_B' | 'ROLE_C' | null;

// Update AuthContext
const [role, setRole] = useState<UserRole>(null);

// Update route protection
<Layout allowedRoles={['ROLE_A', 'ROLE_B']}>
```

### 16.3 Domain Integration

Replace Web3 domain with your domain:

```typescript
// Instead of web3/providers.tsx
// Create your domain provider

// domain/providers.tsx
export function DomainProvider({ children }) {
  const [state, setState] = useState();
  
  return (
    <DomainContext.Provider value={state}>
      {children}
    </DomainContext.Provider>
  );
}
```

---

## Appendix: Quick Reference

### Color Palette
```
Primary:   #16A34A  (Green)
Secondary: #0D9488  (Teal)
Accent:    #F59E0B  (Amber)
Success:   #10B981  (Green)
Warning:   #F59E0B  (Amber)
Error:     #EF4444  (Red)
Info:      #3B82F6  (Blue)
```

### Spacing Scale
```
1:  4px   (px-1)
2:  8px   (px-2)
3:  12px  (px-3)
4:  16px  (px-4)
6:  24px  (px-6)
8:  32px  (px-8)
10: 40px  (px-10)
12: 48px  (px-12)
```

### Breakpoints
```
sm:  640px   (Mobile landscape)
md:  768px   (Tablets)
lg:  1024px  (Desktops)
xl:  1280px  (Large screens)
```

---

**End of Design & Technology Specification**
