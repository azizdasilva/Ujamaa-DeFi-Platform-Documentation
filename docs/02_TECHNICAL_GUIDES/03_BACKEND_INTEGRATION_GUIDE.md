# Backend Integration Guide - UJAMAA DEFI PLATFORM Frontend

**Author:** Aziz Da Silva - Lead Architect
**Date:** March 17, 2026
**Version:** 2.0 (SRS v2.0 Aligned)
**Status:** Ready for Backend Integration

**Aligned with:** SRS v2.0 Section 4 (External Interface Requirements)

---

## Overview

This document provides backend developers with all necessary information to integrate the UJAMAA DEFI PLATFORM frontend with backend APIs.

---

## Current Frontend Architecture

### Technology Stack

| Layer | Technology | Version | SRS v2.0 Ref |
|-------|------------|---------|--------------|
| **Framework** | React | 19.1+ | Section 10.49 |
| **Routing** | React Router DOM | 7.x | Section 10.49 |
| **HTTP Client** | Axios | 1.x | Section 10.49 |
| **State Management** | React Context + Query | Latest | Section 10.49 |
| **TypeScript** | TypeScript | 6.0+ | Section 10.49 |

---

## API Integration Points

### 1. **Authentication & User Management**

#### Current State
- Mock wallet connection in `Header.tsx`
- Mock role selection in `RoleSelector.tsx`
- Local state management

#### Required Endpoints

```typescript
// User Authentication
POST /api/v1/auth/wallet
{
  "wallet": "0x...",
  "signature": "0x...",
  "message": "Sign to authenticate"
}

Response: {
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "wallet": "0x...",
    "role": "INVESTOR | ORIGINATOR | ADMIN",
    "kycLevel": 0 | 1 | 2,
    "status": "pending | approved | rejected"
  }
}

// Get User Profile
GET /api/v1/users/:walletAddress
Headers: Authorization: Bearer {token}

Response: {
  "id": "uuid",
  "wallet": "0x...",
  "email": "user@example.com",
  "role": "INVESTOR",
  "kycLevel": 2,
  "jurisdiction": "CI",
  "createdAt": "2026-03-02T10:00:00Z"
}

// Update User Profile
PUT /api/v1/users/:walletAddress
{
  "email": "user@example.com",
  "jurisdiction": "CI"
}
```

#### Files to Update
- `src/components/layout/Header.tsx` - Wallet connection
- `src/components/ui/RoleSelector.tsx` - Role assignment
- `src/contexts/AuthContext.tsx` - Create new file

---

### 2. **KYC/KYB Onboarding**

#### Current State
- Forms in `InvestorOnboarding.tsx` and `IndustrialOnboarding.tsx`
- Mock file uploads
- No backend submission

#### Required Endpoints

```typescript
// KYC Submission (Individual)
POST /api/v1/kyc/submit
Headers: Authorization: Bearer {token}
{
  "userId": "uuid",
  "kycLevel": 1 | 2,
  "documents": [
    {
      "type": "passport | id_card | drivers_license",
      "url": "https://storage.example.com/doc.pdf",
      "expiryDate": "2030-01-01"
    },
    {
      "type": "proof_of_address",
      "url": "https://storage.example.com/address.pdf"
    }
  ],
  "selfie": "https://storage.example.com/selfie.jpg"
}

Response: {
  "submissionId": "uuid",
  "status": "pending",
  "submittedAt": "2026-03-02T10:00:00Z"
}

// KYB Submission (Company)
POST /api/v1/kyb/submit
Headers: Authorization: Bearer {token}
{
  "companyId": "uuid",
  "companyName": "GDIZ Industries",
  "registrationNumber": "CI-2024-12345",
  "industry": "MANUFACTURING",
  "documents": [
    {
      "type": "registration_certificate",
      "url": "https://storage.example.com/reg.pdf"
    },
    {
      "type": "proof_of_address",
      "url": "https://storage.example.com/address.pdf"
    }
  ]
}

Response: {
  "submissionId": "uuid",
  "status": "pending",
  "submittedAt": "2026-03-02T10:00:00Z"
}

// Check KYC/KYB Status
GET /api/v1/kyc/status
GET /api/v1/kyb/status

Response: {
  "status": "pending | approved | rejected",
  "level": 1 | 2,
  "reviewedAt": "2026-03-03T10:00:00Z",
  "reviewedBy": "admin_id"
}
```

#### Files to Update
- `src/pages/onboarding/InvestorOnboarding.tsx`
- `src/pages/onboarding/IndustrialOnboarding.tsx`
- `src/utils/api.ts` - Create new file

---

### 3. **Asset Marketplace**

#### Current State
- Mock data in `AssetBrowse.tsx`
- Static asset cards
- Client-side filtering

#### Required Endpoints

```typescript
// Get All Assets
GET /api/v1/assets?class=Invoice&status=active&sort=yield

Response: {
  "assets": [
    {
      "id": "uuid",
      "name": "GDIZ Factory Invoice #001",
      "class": "Invoice | Factory | Production",
      "originator": "GDIZ Industries",
      "targetRaise": 50000,
      "currentRaise": 35000,
      "expectedYield": 8.5,
      "minInvestment": 100,
      "jurisdiction": "CI",
      "status": "active | pending | completed",
      "imageUrl": "https://storage.example.com/asset.jpg"
    }
  ],
  "total": 24,
  "page": 1,
  "pageSize": 20
}

// Get Asset Details
GET /api/v1/assets/:assetId

Response: {
  "id": "uuid",
  "name": "GDIZ Factory Invoice #001",
  "description": "Short description",
  "class": "Invoice",
  "originator": {
    "id": "uuid",
    "name": "GDIZ Industries",
    "verified": true
  },
  "targetRaise": 50000,
  "currentRaise": 35000,
  "investorCount": 15,
  "expectedYield": 8.5,
  "term": 12,
  "minInvestment": 100,
  "jurisdiction": "Côte d'Ivoire",
  "documents": [
    {
      "type": "prospectus",
      "url": "https://storage.example.com/prospectus.pdf"
    }
  ],
  "performance": {
    "totalRaised": 35000,
    "percentage": 70,
    "daysRemaining": 15
  }
}

// Search Assets
GET /api/v1/assets/search?q=GDIZ&class=Invoice

// Filter Assets
GET /api/v1/assets/filter?class=Invoice&minYield=5&maxYield=10&minInvestment=100
```

#### Files to Update
- `src/pages/marketplace/AssetBrowse.tsx`
- `src/hooks/useAssets.ts` - Create new file

---

### 4. **Investment Flow**

#### Current State
- Mock investment in `InvestorDashboard.tsx`
- No actual transactions

#### Required Endpoints

```typescript
// Create Investment
POST /api/v1/investments
Headers: Authorization: Bearer {token}
{
  "assetId": "uuid",
  "amount": 1000,
  "paymentMethod": "USDC",
  "walletAddress": "0x..."
}

Response: {
  "investmentId": "uuid",
  "status": "pending | confirmed",
  "txHash": "0x...",
  "shares": 100,
  "timestamp": "2026-03-02T10:00:00Z"
}

// Get User Investments
GET /api/v1/investments?userId=:userId

Response: {
  "investments": [
    {
      "id": "uuid",
      "assetId": "uuid",
      "assetName": "GDIZ Factory Invoice #001",
      "amount": 1000,
      "shares": 100,
      "currentValue": 1050,
      "returns": 5.0,
      "status": "active",
      "investedAt": "2026-03-02T10:00:00Z"
    }
  ],
  "total": 5
}

// Get Investment Details
GET /api/v1/investments/:investmentId
```

#### Files to Update
- `src/pages/dashboard/InvestorDashboard.tsx`
- `src/hooks/useInvestments.ts` - Create new file

---

### 5. **Industrial Asset Management**

#### Current State
- Mock data in `IndustrialDashboard.tsx`
- No actual asset creation

#### Required Endpoints

```typescript
// Create Asset
POST /api/v1/assets
Headers: Authorization: Bearer {token}
{
  "name": "Factory Invoice #001",
  "class": "Invoice | Factory | Production",
  "targetRaise": 50000,
  "expectedYield": 8.5,
  "minInvestment": 100,
  "term": 12,
  "description": "Asset description",
  "metadata": {
    "invoiceNumber": "INV-2026-001",
    "dueDate": "2026-06-01"
  }
}

Response: {
  "assetId": "uuid",
  "status": "draft | pending_approval",
  "createdAt": "2026-03-02T10:00:00Z"
}

// Get Originator Assets
GET /api/v1/originator/assets

// Update Asset
PUT /api/v1/assets/:assetId

// Delete Asset
DELETE /api/v1/assets/:assetId
```

#### Files to Update
- `src/pages/dashboard/IndustrialDashboard.tsx`
- `src/hooks/useOriginatorAssets.ts` - Create new file

---

### 6. **Notarization (Production Data)**

#### Current State
- Mock notarization in `IndustrialDashboard.tsx`
- No blockchain interaction

#### Required Endpoints

```typescript
// Notarize Production Data
POST /api/v1/notarize
Headers: Authorization: Bearer {token}
{
  "assetId": "uuid",
  "dataType": "production | invoice | shipment",
  "data": {
    "productionVolume": 1000,
    "timestamp": "2026-03-02T10:00:00Z"
  },
  "dataHash": "0x..." // SHA-256 hash
}

Response: {
  "proofId": "uuid",
  "txHash": "0x...",
  "timestamp": "2026-03-02T10:00:00Z",
  "blockNumber": 12345678,
  "status": "confirmed"
}

// Verify Notarization
GET /api/v1/notarize/verify/:dataHash

Response: {
  "exists": true,
  "timestamp": "2026-03-02T10:00:00Z",
  "submitter": "0x...",
  "blockNumber": 12345678
}

// Get Notarization History
GET /api/v1/notarize/history?assetId=:assetId
```

#### Files to Update
- `src/pages/dashboard/IndustrialDashboard.tsx`
- `src/hooks/useNotarization.ts` - Create new file

---

### 7. **Admin Dashboard**

#### Current State
- Mock data in `AdminDashboard.tsx`
- No actual approvals

#### Required Endpoints

```typescript
// Get Pending Users
GET /api/v1/admin/pending-users

Response: {
  "users": [
    {
      "id": "uuid",
      "name": "GDIZ Industries",
      "email": "contact@gdiz.ci",
      "role": "ORIGINATOR",
      "kycLevel": 2,
      "submittedAt": "2026-03-01T10:00:00Z"
    }
  ]
}

// Approve User
POST /api/v1/admin/approve-user
{
  "userId": "uuid",
  "action": "approve | reject",
  "reason": "Optional rejection reason"
}

// Get Pending Assets
GET /api/v1/admin/pending-assets

// Approve Asset
POST /api/v1/admin/approve-asset
{
  "assetId": "uuid",
  "action": "approve | reject"
}

// Get Fraud Alerts
GET /api/v1/admin/fraud-alerts?severity=high&status=unresolved

Response: {
  "alerts": [
    {
      "id": "uuid",
      "severity": "high | medium | low | critical",
      "rule": "LARGE_TRANSACTION",
      "wallet": "0x...",
      "amount": 75000,
      "timestamp": "2026-03-02T10:00:00Z",
      "status": "unresolved | resolved | escalated"
    }
  ]
}

// Resolve Alert
POST /api/v1/admin/resolve-alert
{
  "alertId": "uuid",
  "action": "resolve | escalate",
  "notes": "Resolution notes"
}
```

#### Files to Update
- `src/pages/dashboard/AdminDashboard.tsx`
- `src/hooks/useAdmin.ts` - Create new file

---

## Utility Files to Create

### 1. **API Client** (`src/utils/api.ts`)

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. **Auth Context** (`src/contexts/AuthContext.tsx`)

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

type Role = 'INVESTOR' | 'ORIGINATOR' | 'ADMIN' | null;

interface User {
  id: string;
  wallet: string;
  role: Role;
  kycLevel: number;
  status: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (wallet: string, signature: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('auth_token');
    if (token) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  async function loadUser() {
    try {
      const response = await api.get('/api/v1/users/me');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  }

  async function login(wallet: string, signature: string) {
    const response = await api.post('/api/v1/auth/wallet', {
      wallet,
      signature,
    });
    
    localStorage.setItem('auth_token', response.data.token);
    setUser(response.data.user);
  }

  function logout() {
    localStorage.removeItem('auth_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 3. **Custom Hooks**

Create these hooks in `src/hooks/`:
- `useAssets.ts` - Asset marketplace data
- `useInvestments.ts` - Investment management
- `useOriginatorAssets.ts` - Industrial asset management
- `useNotarization.ts` - Production notarization
- `useAdmin.ts` - Admin dashboard data

---

## Environment Variables

Create `.env` file:

```env
# API Configuration
VITE_API_URL=https://api.ujamaa-defi.io
VITE_WS_URL=wss://api.ujamaa-defi.io/ws

# Blockchain Configuration
VITE_POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
VITE_CHAIN_ID=80002
VITE_USDC_CONTRACT_ADDRESS=0x...
VITE_UJAMAA_TOKEN_ADDRESS=0x...
VITE_ASSET_PROOF_ADDRESS=0x...

# Feature Flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_FRAUD_DETECTION=true
```

---

## Integration Checklist

### Phase 1: Authentication (Week 3)
- [ ] Create AuthContext
- [ ] Implement wallet connection
- [ ] Add JWT token management
- [ ] Update Header component
- [ ] Test login/logout flow

### Phase 2: User Management (Week 3)
- [ ] Create API client
- [ ] Implement KYC/KYB submission
- [ ] Add file upload to storage
- [ ] Update onboarding pages
- [ ] Test approval flow

### Phase 3: Marketplace (Week 3)
- [ ] Connect asset API
- [ ] Implement real-time filtering
- [ ] Add asset details page
- [ ] Test search functionality

### Phase 4: Investments (Week 4)
- [ ] Connect investment API
- [ ] Implement Web3 transactions
- [ ] Add portfolio tracking
- [ ] Test investment flow

### Phase 5: Admin Features (Week 4)
- [ ] Connect admin APIs
- [ ] Implement approval workflows
- [ ] Add fraud alert management
- [ ] Test admin dashboard

---

## Testing Strategy

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests (Future)
```bash
npm run test:e2e
```

---

## Support & Contact

For questions or issues during integration:
- Check this documentation first
- Review API Swagger docs (when available)
- Contact frontend development team

---

**Document Control:**
- **Version:** 1.0
- **Created:** March 2, 2026
- **Status:** Ready for Implementation
- **Next Review:** Backend API availability

---

*UJAMAA DEFI PLATFORM - Tokenize African Real-World Assets*
