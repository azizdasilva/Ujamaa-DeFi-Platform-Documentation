# 🚀 Quick Start Guide - Ujamaa DeFi Platform

## New Features Overview

This guide helps you quickly test all the newly implemented features.

---

## 📋 What's New

### 1. **Role-Based Access Control (RBAC)**
- 6 distinct user roles with specific permissions
- Mock authentication for demo purposes
- Session persistence

### 2. **Compliance Officer Dashboard**
- KYC/KYB document review
- 24-hour review window enforcement
- Document approval/rejection workflow

### 3. **Enhanced UX**
- Transaction preview modal with 4-step flow
- Real-time transaction status tracker
- Pool allocation pie chart
- Language switcher (EN/FR)
- Wallet visibility restricted to logged-in users

### 4. **Database Flexibility**
- SQLite for development (default)
- PostgreSQL for production
- Easy switch via `.env` file

### 5. **uLT Token Monitoring**
- Per-investor uLT token tracking
- Portfolio-level summaries
- Transaction history

---

## 🛠️ Setup Instructions

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Initialize database (creates SQLite DB)
python init_db.py

# Start the server
python main.py
```

Backend will start at: `http://localhost:8000`

### Step 2: Frontend Setup

```bash
# Navigate to frontend (new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start at: `http://localhost:5173`

---

## 🎯 Testing the Features

### 1. Test RBAC System

1. Navigate to: `http://localhost:5173/select-role`
2. Choose a role to login:
   - **Institutional Investor** - Large investments
   - **Retail Investor** - Individual investments
   - **Industrial Operator** - Asset tokenization
   - **Compliance Officer** - Document review
   - **Admin** - Platform management
   - **Regulator** - Read-only oversight

3. Verify:
   - ✅ Wallet button appears only after login
   - ✅ Role-specific dashboard loads
   - ✅ Session persists on refresh

### 2. Test Compliance Workflow (24h Window)

1. Login as **Compliance Officer**
2. Navigate to: `/compliance/kyc-review`
3. Review pending documents
4. Click "Approve" or "Reject"
5. Verify:
   - ✅ 24h deadline shown for each document
   - ✅ Time remaining displayed
   - ✅ Review notes can be added
   - ✅ Activity logged in audit trail

**API Test:**
```bash
# Get all pending documents
curl http://localhost:8000/api/v2/compliance/documents?status=pending

# Review a document
curl -X POST http://localhost:8000/api/v2/compliance/documents/doc-001/review \
  -H "Content-Type: application/json" \
  -d '{"action": "approve", "notes": "All documents verified"}'
```

### 3. Test Transaction Flow

1. Login as **Retail Investor** or **Institutional Investor**
2. Navigate to: `/pool/dashboard`
3. Click "Invest" on any pool
4. Verify transaction modal:
   - ✅ Step 1: Input (amount, pool)
   - ✅ Step 2: Review (fees breakdown)
   - ✅ Step 3: Signing (wallet signature)
   - ✅ Step 4: Confirmation (success message)
   - ✅ "View on Explorer" link appears

### 4. Test Pie Chart

1. Navigate to: `/pool/dashboard?pool=all`
2. Verify:
   - ✅ Pie chart displays pool allocation
   - ✅ Hover shows tooltip with values
   - ✅ Legend at bottom
   - ✅ Color-coded by pool
   - ✅ Percentage labels visible

### 5. Test Language Switch

1. Look for 🌐 EN button in top navigation
2. Click to switch to 🌐 FR
3. Verify:
   - ✅ Button text changes
   - ✅ Preference saved (refresh page)
   - ✅ Click again to switch back to English

### 6. Test Wallet Visibility

1. Logout (if logged in)
2. Verify:
   - ✅ Wallet button NOT visible
   - ✅ Role selector still visible
3. Login with any role
4. Verify:
   - ✅ Wallet button appears
   - ✅ Can connect wallet

---

## 📊 Demo Accounts

All accounts are pre-configured for testing:

| Role | Email | Wallet Address |
|------|-------|----------------|
| Institutional Investor | institutional@ujamaa-defi.com | 0x742d35Cc...f0bEb1 |
| Retail Investor | retail@ujamaa-defi.com | 0x8626f694...2C9C1199 |
| Industrial Operator | operator@ujamaa-defi.com | 0xdD2FD458...Bf44C0 |
| Compliance Officer | compliance@ujamaa-defi.com | 0xbDA5747b...e51B197E |
| Admin | admin@ujamaa-defi.com | 0x2546BcD3...77ECEc30 |
| Regulator | regulator@ujamaa-defi.com | 0x976EA740...C3a0aa9 |

---

## 🔧 Configuration

### Database Switch

**Use SQLite (Development):**
```env
DATABASE_TYPE=sqlite
SQLITE_DB_PATH=backend/data/ujamaa.db
```

**Use PostgreSQL (Production):**
```env
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://user:password@localhost:5432/ujamaa_defi
```

### Feature Flags

```env
# Enable demo mode
DEMO_MODE=True

# Simulate transactions (no real blockchain)
TRANSACTION_SIMULATION=True

# Enforce 24h compliance window
COMPLIANCE_24H_WINDOW=True
```

---

## 📚 API Endpoints

### Compliance Documents

```
GET    /api/v2/compliance/documents          # List all documents
GET    /api/v2/compliance/documents/{id}     # Get document details
POST   /api/v2/compliance/documents/{id}/review  # Review document
GET    /api/v2/compliance/stats              # Get compliance stats
GET    /api/v2/compliance/activities         # Get activity log
POST   /api/v2/compliance/demo/upload-document  # Demo upload
```

### Pools

```
GET    /api/v2/pools              # List all pools
GET    /api/v2/pools/{id}         # Get pool details
GET    /api/v2/pools/{id}/stats   # Get pool statistics
```

### API Documentation

Swagger UI: `http://localhost:8000/docs`

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version (need 3.9+)
python --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database errors
```bash
# Reset database
python init_db.py --reset

# Reinitialize
python init_db.py
```

### Wallet connection issues
- Ensure MetaMask is installed
- Switch to Polygon Amoy testnet
- Get test POL from faucet

---

## 📝 Next Steps

1. **Production Deployment**
   - Switch to PostgreSQL
   - Disable demo mode
   - Configure production RPC
   - Set up SSL/TLS

2. **Real Wallet Integration**
   - Implement SIWE (Sign-In with Ethereum)
   - Replace mock authentication

3. **Enhanced Features**
   - Email notifications for compliance deadlines
   - WebSocket for real-time updates
   - Advanced analytics dashboard

---

## 📖 Documentation

- **Full Implementation Guide**: `IMPLEMENTATION_SUMMARY.md`
- **API Documentation**: `http://localhost:8000/docs`
- **Backend Code**: `backend/` directory
- **Frontend Code**: `frontend/src/` directory

---

## ✅ Testing Checklist

- [ ] RBAC working for all 6 roles
- [ ] Wallet button only visible when logged in
- [ ] Compliance officer can review documents
- [ ] 24h deadline displayed correctly
- [ ] Transaction modal shows all 4 steps
- [ ] Pie chart displays on pool dashboard
- [ ] Language switch works (EN ↔ FR)
- [ ] uLT tokens tracked in portfolio
- [ ] View on Explorer link functional
- [ ] Data consistent across roles

---

**Need Help?** Check `IMPLEMENTATION_SUMMARY.md` for detailed documentation.

**Version**: 2.0.0-mvp-testnet  
**Last Updated**: April 2, 2026
