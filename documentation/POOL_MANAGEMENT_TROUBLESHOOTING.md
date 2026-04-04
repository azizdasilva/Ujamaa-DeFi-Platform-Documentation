# Pool Management Page - Blank Page Troubleshooting

## Issue
When clicking on "Pool Management" from the admin dropdown menu, the page appears blank.

## Root Cause
The Pool Management page was previously using mock data from `frontend/src/data/mockData.ts`, but the platform has been updated to fetch data from the backend API. The page now correctly fetches from the backend, but if the backend database is not properly configured or accessible, the page will show an error or appear blank.

## Solution

### 1. Database Configuration (Most Common Issue)

The backend needs to be connected to a Neon database. Follow these steps:

#### Step 1: Create a `.env` file
```bash
# In the project root directory
cp .env.example .env
```

#### Step 2: Update Database Configuration
Open `.env` and update these values:

```env
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-your-instance.region.aws.neon.tech/ujamaa_defi?sslmode=require
```

**Get your Neon connection string from:**
1. Go to https://console.neon.tech
2. Select your project
3. Click "Connection Details"
4. Copy the connection string and replace `neondb` with `ujamaa_defi`

#### Step 3: Initialize the Database
```bash
# Option A: Use the automated setup script (Recommended)
.\setup_database.ps1

# Option B: Manual setup
cd backend
python setup_database.py
```

### 2. Verify Backend is Running

The backend server must be running for the frontend to fetch data:

```bash
cd backend
python -m uvicorn main:app --reload
```

You should see:
```
📊 Using PostgreSQL (Neon) - persistent database
✅ Database schema verified
```

### 3. Test the API Endpoint

Open your browser or use curl to test:

```bash
curl http://localhost:8000/api/v2/db/pools
```

**Expected Response:**
```json
[
  {
    "id": "POOL_INDUSTRIE",
    "name": "Pool Industrie",
    "family": "industrie",
    "apy": 11.0,
    "total_value": 15000000,
    "target_yield_min": 10.0,
    "target_yield_max": 12.0,
    "lockup_days": 365
  },
  ...more pools
]
```

**Common API Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| `Internal server error` | Database connection failed | Check DATABASE_URL in `.env` |
| `could not translate host name` | Cannot reach Neon | Verify Neon is accessible |
| Empty array `[]` | No data in database | Run `python backend/setup_database.py` |
| Connection refused | Backend not running | Start backend with `uvicorn` |

### 4. Check Browser Console

Open browser DevTools (F12) and check the Console tab for errors:

**Common Console Errors:**

| Error | Meaning | Solution |
|-------|---------|----------|
| `Failed to load pools` | API call failed | Check backend is running |
| `Network Error` | Cannot reach backend | Verify backend URL and CORS |
| `401 Unauthorized` | Auth issue | Should not affect pool data |

### 5. Frontend Configuration

The frontend is already configured to:
- ✅ Fetch from `http://localhost:8000/api/v2/db/pools` (development)
- ✅ Show loading state while fetching
- ✅ Display error messages if fetch fails
- ✅ Handle empty pool lists

### 6. Complete Setup Checklist

- [ ] Neon database created at https://console.neon.tech
- [ ] `.env` file created with correct `DATABASE_URL`
- [ ] `DATABASE_TYPE=postgresql` set in `.env`
- [ ] Database initialized (`python setup_database.py`)
- [ ] Backend server running (`python -m uvicorn main:app --reload`)
- [ ] API endpoint tested (`curl http://localhost:8000/api/v2/db/pools`)
- [ ] Frontend running (`npm run dev` in frontend directory)

## What Changed

### Before (Mock Data)
```typescript
import { POOLS } from '../../../data/mockData';
const poolList = Object.values(POOLS);
```

### After (Backend API)
```typescript
import { poolsAPI } from '../../../api/pools';
const poolData = await poolsAPI.getAllPools();
```

The Pool Management page now:
1. Fetches real data from the Neon database via the backend API
2. Shows a loading spinner while fetching
3. Displays error messages with retry capability
4. Handles empty states gracefully

## Still Having Issues?

If the page is still blank after following all steps:

1. **Check backend logs** - Look for database connection errors
2. **Check browser console** - Look for failed API calls
3. **Verify network** - Ensure Neon is accessible from your location
4. **Test with SQLite** - Temporarily set `DATABASE_TYPE=sqlite` in `.env` to isolate the issue

## Quick Test with SQLite

To quickly test if the issue is with PostgreSQL connection:

```env
# In .env file
DATABASE_TYPE=sqlite
SQLITE_DB_PATH=data/ujamaa.db
```

Then restart the backend:
```bash
cd backend
python -m uvicorn main:app --reload
```

If pools load with SQLite, the issue is with your Neon connection string.

## Additional Resources

- [Neon Database Setup Guide](./NEON_DATABASE_SETUP.md)
- [Backend Configuration](./backend/config/database.py)
- [Pool API Endpoint](./backend/api/database_api.py)
- [Pool Management Component](./frontend/src/MVP/pages/admin/PoolManagement.tsx)
