# 🔍 Investor & Operator Pages - Mock Data Audit

**Date:** April 2, 2026  
**Status:** Audit Complete - Fixes Required

---

## Pages Using Mock Data

### 1. Institutional Dashboard ✅ NEEDS FIX
**File:** `frontend/src/MVP/pages/institutional/Dashboard.tsx`

**Mock Data Used:**
```typescript
import { USER_PROFILES } from '../../../data/mockData';
const user = USER_PROFILES.INSTITUTIONAL_INVESTOR;
const portfolioValue = ulpBalance ? ... : user.portfolioValue;
const totalYield = user.totalYield;
const positions = user.positions;
const recentActivity = [...]; // Hardcoded
```

**Should Use:**
- `/api/v2/db/investors/{id}` - Investor profile
- `/api/v2/db/pools/portfolio/{id}` - Pool positions
- `/api/v2/db/transactions?investor_id={id}` - Transaction history

---

### 2. Retail Dashboard ✅ NEEDS FIX
**File:** `frontend/src/MVP/pages/retail/Dashboard.tsx`

**Mock Data Used:**
```typescript
import { USER_PROFILES } from '../../../data/mockData';
const user = USER_PROFILES.RETAIL_INVESTOR;
const portfolioValue = user.portfolioValue;
const totalYield = user.totalYield;
const positions = user.positions;
```

**Should Use:**
- Same as institutional dashboard

---

### 3. Industrial Operator Dashboard ✅ NEEDS FIX
**File:** `frontend/src/MVP/pages/originator/Dashboard.tsx`

**Mock Data Used:**
```typescript
import { USER_PROFILES } from '../../../data/mockData';
const company = USER_PROFILES.INDUSTRIAL_OPERATOR;
const financings = company.financings;
const certifiedAssets = company.certifiedAssets;
const creditLimit = company.creditLimit;
const outstanding = company.outstanding;
```

**Should Use:**
- `/api/v2/db/investors/{id}` - Operator profile
- `/api/v2/pools/{pool_id}/financings` - Financings by pool
- `/api/v2/db/financings?industrial_id={id}` - Operator's financings

---

### 4. Pool Dashboard ✅ NEEDS FIX
**File:** `frontend/src/MVP/pages/pool/Dashboard.tsx`

**Mock Data Used:**
```typescript
import { POOLS as MOCK_POOLS, getPoolKPIs as getMockPoolKPIs } from '../../../data/mockData';
```

**Should Use:**
- `/api/v2/db/pools` - All pools
- `/api/v2/pools/{pool_id}/stats` - Pool statistics
- `/api/v1/pool/kpis?pool_id={id}` - 18 KPIs

---

### 5. Admin Pool Management ✅ NEEDS FIX
**File:** `frontend/src/MVP/pages/admin/PoolManagement.tsx`

**Mock Data Used:**
```typescript
import { POOLS } from '../../../data/mockData';
```

**Should Use:**
- `/api/v2/db/pools` - All pools from database

---

### 6. Investor Portfolio ✅ NEEDS CHECK
**File:** `frontend/src/MVP/pages/investor/Portfolio.tsx`

**Status:** Need to check for mock data

---

### 7. Asset Submission ✅ NEEDS FIX
**File:** `frontend/src/MVP/pages/originator/AssetSubmission.tsx`

**Status:** Need to check for mock data

---

## Required Backend Endpoints

### Investor Endpoints (Missing)
```
GET /api/v2/db/investors/{id} - Get investor profile
GET /api/v2/db/investors/{id}/positions - Get pool positions
GET /api/v2/db/investors/{id}/transactions - Get transaction history
```

### Operator Endpoints (Missing)
```
GET /api/v2/db/financings?industrial_id={id} - Get operator's financings
POST /api/v2/pools/{pool_id}/financings - Create financing (already exists)
```

### Pool Endpoints (Already Exist ✅)
```
GET /api/v2/db/pools - List all pools
GET /api/v2/db/pools/{id} - Get specific pool
GET /api/v2/pools/{id}/stats - Pool statistics
GET /api/v1/pool/kpis - 18 KPIs
```

---

## Priority Order

1. **Institutional Dashboard** - High priority (main investor view)
2. **Retail Dashboard** - High priority (retail investor view)
3. **Operator Dashboard** - High priority (operator view)
4. **Pool Dashboard** - Medium priority (analytics view)
5. **Admin Pool Management** - Medium priority (admin view)
6. **Investor Portfolio** - Medium priority (detailed view)
7. **Asset Submission** - Low priority (already has form)

---

## Implementation Plan

### Phase 1: Investor Dashboards
1. Create `/api/v2/db/investors/{id}` endpoint
2. Create `/api/v2/db/investors/{id}/positions` endpoint
3. Update Institutional Dashboard to use API
4. Update Retail Dashboard to use API

### Phase 2: Operator Dashboard
1. Create `/api/v2/db/financings` endpoint with industrial_id filter
2. Update Operator Dashboard to use API

### Phase 3: Pool Dashboards
1. Update Pool Dashboard to use real API
2. Update Admin Pool Management to use real API

---

## Data Mapping

### Investor Profile Response
```json
{
  "id": 1,
  "email": "institutional@ujamaa-defi.com",
  "role": "INSTITUTIONAL_INVESTOR",
  "wallet_address": "0x742d35Cc...",
  "full_name": "Logic Capital Ltd",
  "jurisdiction": "MU",
  "kyc_status": "approved",
  "kyb_status": "approved",
  "total_invested": 500000,
  "ult_tokens": 495000,
  "pool_positions": [
    {
      "pool_id": "POOL_INDUSTRIE",
      "pool_name": "Pool Industrie",
      "shares": 500000,
      "average_nav": 1.0
    }
  ]
}
```

### Operator Profile Response
```json
{
  "id": 3,
  "company_name": "Green Cotton SA",
  "jurisdiction": "BJ",
  "kyc_status": "approved",
  "kyb_status": "approved",
  "financings": [
    {
      "id": 1,
      "pool_family": "industrie",
      "asset_class": "EQUIPMENT",
      "principal": 5000000,
      "interest_rate": 12.0,
      "status": "repaying"
    }
  ]
}
```

---

**Ready to implement fixes!**
