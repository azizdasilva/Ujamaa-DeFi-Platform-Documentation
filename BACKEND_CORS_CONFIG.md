# 🔐 CORS Configuration Guide - Ujamaa DeFi Platform

**File:** `backend/main.py` (Lines 63-94)  
**Status:** ✅ **CONFIGURED FOR VERCEL**

---

## 📍 Where CORS is Configured

**File:** `backend/main.py`

```python
# CORS Middleware - Configure for production deployment
CORS_ORIGINS = [
    # Local Development
    "http://localhost:5173",      # Vite (React)
    "http://localhost:3000",      # Next.js/React
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    
    # Vercel Production
    "https://ujamaa-defi-platform.vercel.app",
    "https://ujamaa-mvp.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)
```

---

## 🚀 Update for Your Production URLs

### **Step 1: Get Your Vercel URLs**

After deploying to Vercel, you'll get URLs like:
- `https://your-project.vercel.app` (Frontend)
- `https://your-api.vercel.app` (Backend)

### **Step 2: Update CORS_ORIGINS**

Edit `backend/main.py`:

```python
CORS_ORIGINS = [
    # Local Development
    "http://localhost:5173",
    "http://localhost:3000",
    
    # YOUR Production URLs
    "https://your-frontend.vercel.app",     # ← Update this!
    "https://your-backend.vercel.app",      # ← Update this!
]
```

### **Step 3: Deploy to Vercel**

```bash
cd backend
vercel --prod
```

---

## 🔧 CORS Settings Explained

| Setting | Value | Purpose |
|---------|-------|---------|
| `allow_origins` | List of URLs | Which domains can access API |
| `allow_credentials` | `True` | Allow cookies/auth headers |
| `allow_methods` | `["*"]` | All HTTP methods (GET, POST, etc.) |
| `allow_headers` | `["*"]` | All headers allowed |
| `expose_headers` | `["*"]` | Expose all headers to frontend |
| `max_age` | `600` | Cache preflight for 10 minutes |

---

## 🧪 Test CORS Configuration

### **Test 1: Local Development**

```bash
# From frontend (localhost:5173)
curl http://localhost:8000/api/v2/db/pools \
  -H "Origin: http://localhost:5173" \
  -v
```

**Expected:**
```
< Access-Control-Allow-Origin: http://localhost:5173
< Access-Control-Allow-Credentials: true
```

### **Test 2: Production**

```bash
# From production frontend
curl https://your-backend.vercel.app/api/v2/db/pools \
  -H "Origin: https://your-frontend.vercel.app" \
  -v
```

**Expected:**
```
< Access-Control-Allow-Origin: https://your-frontend.vercel.app
< Access-Control-Allow-Credentials: true
```

---

## ⚠️ Common CORS Issues

### **Issue 1: "CORS policy blocked"**

**Cause:** Frontend URL not in `CORS_ORIGINS`

**Fix:** Add your frontend URL to the list:
```python
CORS_ORIGINS.append("https://your-frontend.vercel.app")
```

### **Issue 2: "Credentials not allowed"**

**Cause:** `allow_credentials=False`

**Fix:** Ensure `allow_credentials=True`

### **Issue 3: "Preflight request failed"**

**Cause:** Missing `allow_methods` or `allow_headers`

**Fix:** Use `["*"]` for development, or specify explicitly:
```python
allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
allow_headers=["Authorization", "Content-Type"]
```

---

## 🔐 Security Best Practices

### **For Production:**

1. **Use specific URLs** (not `*`):
   ```python
   # ❌ Don't do this in production
   allow_origins=["*"]
   
   # ✅ Do this instead
   allow_origins=[
       "https://your-frontend.vercel.app"
   ]
   ```

2. **Limit methods if possible**:
   ```python
   allow_methods=["GET", "POST", "PUT", "DELETE"]
   ```

3. **Limit headers**:
   ```python
   allow_headers=["Authorization", "Content-Type"]
   ```

4. **Use environment variables**:
   ```python
   import os
   CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
   ```

---

## 📁 Files Modified

- ✅ `backend/main.py` (Lines 63-94)
  - Updated CORS configuration
  - Added production URLs
  - Added comments for customization

---

## 🎯 Quick Reference

**To update CORS for your deployment:**

1. **Edit:** `backend/main.py`
2. **Find:** `CORS_ORIGINS` list (line 68)
3. **Add:** Your production frontend URL
4. **Deploy:** `vercel --prod`
5. **Test:** Check browser console for CORS errors

---

## ✅ Current Configuration

**Allowed Origins:**
- ✅ `http://localhost:5173` (Vite dev)
- ✅ `http://localhost:3000` (Next.js dev)
- ✅ `http://127.0.0.1:5173`
- ✅ `http://127.0.0.1:3000`
- ✅ `https://ujamaa-defi-platform.vercel.app` (Production)
- ✅ `https://ujamaa-mvp.vercel.app` (Alternative)

**Settings:**
- ✅ Credentials: Enabled
- ✅ Methods: All (GET, POST, PUT, DELETE, OPTIONS)
- ✅ Headers: All
- ✅ Exposed Headers: All
- ✅ Preflight Cache: 10 minutes

---

**CORS is now properly configured for both local development and Vercel production deployment!** 🔐
