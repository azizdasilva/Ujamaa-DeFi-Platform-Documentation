# 📡 Frontend-Backend API Mapping

**Date:** April 2, 2026  
**Status:** ⚠️ **PARTIAL - Some endpoints missing**

---

## ✅ Available Backend Endpoints

### Database API (`/api/v2/db/`)

| Endpoint | Method | Frontend Function | Status |
|----------|--------|-------------------|--------|
| `/db/pools` | GET | `poolsAPI.getAllPools()` | ✅ Available |
| `/db/pools/{id}` | GET | `poolsAPI.getPoolById()` | ✅ Available |
| `/db/pools/{id}/stats` | GET | `poolsAPI.getPoolStats()` | ✅ Available |
| `/db/stats/overview` | GET | - | ✅ Available |
| `/db/stats/compliance` | GET | - | ✅ Available |
| `/db/documents` | GET | `complianceAPI.getDocuments()` | ✅ Available |
| `/db/documents/{id}` | GET | `complianceAPI.getDocument()` | ✅ Available |
| `/db/users/{id}/profile` | GET | `authAPI.getProfile()` | ✅ Available |
| `/db/investments` | GET/POST | `investmentsAPI.*()` | ✅ Available |
| `/db/ult/{id}/balance` | GET | `investmentsAPI.getULTBalance()` | ✅ Available |

### Compliance API (`/api/v2/compliance/`)

| Endpoint | Method | Frontend Function | Status |
|----------|--------|-------------------|--------|
| `/compliance/documents` | GET | `complianceAPI.getDocuments()` | ✅ Available |
| `/compliance/documents/{id}/review` | POST | `complianceAPI.reviewDocument()` | ✅ Available |
| `/compliance/check-jurisdiction` | POST | - | ✅ Available |
| `/compliance/stats` | GET | - | ✅ Available |

### Pools API (`/api/v2/pools/`)

| Endpoint | Method | Frontend Function | Status |
|----------|--------|-------------------|--------|
| `/pools` | GET | `poolsAPI.getAllPools()` | ✅ Available (Mock) |
| `/pools/{id}/invest` | POST | `investmentsAPI.createInvestment()` | ✅ Available (Mock) |
| `/pools/{id}/redeem` | POST | - | ✅ Available (Mock) |

---

## ❌ Missing Backend Endpoints

### Authentication (NOT YET IMPLEMENTED)

| Endpoint | Method | Frontend Function | Status |
|----------|--------|-------------------|--------|
| `/auth/login` | POST | `authAPI.login()` | ❌ Missing |
| `/auth/register` | POST | `authAPI.register()` | ❌ Missing |
| `/auth/logout` | POST | `authAPI.logout()` | ❌ Not needed (client-side) |

### Assets/Financings (PARTIAL)

| Endpoint | Method | Frontend Function | Status |
|----------|--------|-------------------|--------|
| `/assets/submit` | POST | `assetsAPI.submitAsset()` | ❌ Missing |
| `/assets/industrial/{id}` | GET | `assetsAPI.getOperatorAssets()` | ❌ Missing |
| `/financings/industrial/{id}` | GET | `assetsAPI.getFinancings()` | ❌ Missing |

---

## 🔧 Frontend API Configuration

### Environment Variables

Create `frontend/.env`:
```bash
# Backend API URL
REACT_APP_API_URL=http://localhost:8000/api/v2

# Feature Flags
REACT_APP_USE_MOCK_DATA=true
REACT_APP_ENABLE_WALLET_CONNECT=true
```

### Current API Client Setup

```typescript
// frontend/src/api/client.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v2';
```

✅ **Correctly configured!**

---

## 📋 Frontend Components Using API

### 1. Dashboards (Should use API)

**Current Status:** Using mock data from `data/mockData.ts`

**To Update:**
```typescript
// frontend/src/MVP/pages/retail/Dashboard.tsx
import { poolsAPI } from '../../api';

const RetailDashboard = () => {
  const [pools, setPools] = useState([]);
  
  useEffect(() => {
    // Use API in production, mock for demo
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      setPools(POOLS);
    } else {
      poolsAPI.getAllPools().then(setPools);
    }
  }, []);
  
  // ...
};
```

### 2. Authentication Pages (Need Backend)

**Current Status:** Using sessionStorage only

**To Update:**
```typescript
// frontend/src/MVP/pages/auth/Register.tsx
import { authAPI } from '../../../api';

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
    // Demo mode - use sessionStorage
    login(role);
    navigate(`/${role.toLowerCase()}/dashboard`);
  } else {
    // Production mode - use API
    try {
      const response = await authAPI.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        role: role,
        jurisdiction: formData.jurisdiction,
      });
      
      sessionStorage.setItem('ujamaa_user', JSON.stringify(response.user));
      navigate(`/${response.user.role.toLowerCase()}/dashboard`);
    } catch (error) {
      setError(error.message);
    }
  }
};
```

### 3. Pool Investment (Partially Implemented)

**Current Status:** Mock backend in `backend/api/pools.py`

**Working Endpoints:**
- ✅ `POST /api/v2/pools/{id}/invest` - Mock investment
- ✅ `GET /api/v2/db/pools` - Real database pools

---

## 🎯 Recommended Integration Strategy

### Phase 1: Use Available Endpoints (NOW)

**What works:**
1. ✅ Get pools from database: `GET /api/v2/db/pools`
2. ✅ Get pool stats: `GET /api/v2/db/pools/{id}/stats`
3. ✅ Get documents: `GET /api/v2/db/documents`
4. ✅ Get overview stats: `GET /api/v2/db/stats/overview`

**Update these components:**
- `frontend/src/MVP/pages/pool/Dashboard.tsx`
- `frontend/src/MVP/pages/institutional/PoolMarketplace.tsx`
- `frontend/src/MVP/pages/compliance/KYCReview.tsx`

### Phase 2: Hybrid Mode (Demo + API)

**Implementation:**
```typescript
// frontend/src/config/api.ts
export const API_CONFIG = {
  USE_MOCK: process.env.REACT_APP_USE_MOCK_DATA === 'true',
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v2',
};

// Usage in components
const [pools, setPools] = useState([]);

useEffect(() => {
  const fetchPools = async () => {
    if (API_CONFIG.USE_MOCK) {
      setPools(POOLS); // From mockData.ts
    } else {
      const data = await poolsAPI.getAllPools();
      setPools(data);
    }
  };
  fetchPools();
}, []);
```

### Phase 3: Full API Integration (Production)

**Requires:**
1. Backend auth endpoints (login/register)
2. Backend investment endpoints
3. Backend asset submission endpoints

**Then update:**
- All dashboards to use live API
- Remove mock data dependency
- Add loading states and error handling

---

## ✅ Action Items

### Immediate (Done)
- [x] API client configured correctly
- [x] API functions created for all endpoints
- [x] Mock data synced with database

### Short-term (TODO)
- [ ] Update Pool Dashboard to use `GET /api/v2/db/pools`
- [ ] Update Compliance pages to use `GET /api/v2/db/documents`
- [ ] Add hybrid mode toggle (mock vs API)
- [ ] Test all available endpoints from frontend

### Long-term (Backend Required)
- [ ] Implement auth endpoints (login/register)
- [ ] Implement asset submission endpoints
- [ ] Update frontend to use auth endpoints
- [ ] Remove mock data completely

---

## 🧪 Testing Frontend-Backend Integration

### Test 1: Pools Endpoint
```typescript
// In browser console (with dev tools)
import { poolsAPI } from './api/pools';

const pools = await poolsAPI.getAllPools();
console.log('Pools from backend:', pools);
// Should return 5 pools with €50M total TVL
```

### Test 2: Stats Endpoint
```typescript
// Test stats overview
const response = await fetch('http://localhost:8000/api/v2/db/stats/overview');
const data = await response.json();
console.log('Stats:', data);
// Should return: total_users: 6, total_pools: 5, total_value_locked: 50000000
```

### Test 3: Documents Endpoint
```typescript
// Test documents
const response = await fetch('http://localhost:8000/api/v2/db/documents');
const data = await response.json();
console.log('Documents:', data);
// Should return 3 documents with time_remaining_hours
```

---

## 📊 Summary

| Category | Status | Notes |
|----------|--------|-------|
| **API Client** | ✅ Ready | Correctly configured |
| **API Functions** | ✅ Created | All endpoints mapped |
| **Mock Data** | ✅ Synced | Matches database |
| **Backend Endpoints** | ⚠️ Partial | Auth missing |
| **Frontend Integration** | ⚠️ Hybrid | Can use mock or API |

**Frontend is ready to call backend APIs for available endpoints!**

---

**Mapping Completed:** April 2, 2026  
**Status:** ✅ **READY FOR HYBRID MODE**
