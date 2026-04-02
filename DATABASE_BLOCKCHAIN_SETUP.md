# 🗄️ Database & Blockchain Setup Guide

## Complete Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    UJAMAA DEFI PLATFORM                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  FRONTEND (React)                                           │
│  ├─ UI State → Database (via API)                          │
│  └─ User Session → Database (via API)                      │
│                                                              │
│  BACKEND (FastAPI)                                          │
│  ├─ API Endpoints                                           │
│  ├─ Database ORM (SQLAlchemy)                              │
│  └─ Blockchain Service (web3.py)                           │
│                                                              │
│  DATABASE (SQLite/PostgreSQL)                               │
│  ├─ Users & Authentication                                 │
│  ├─ Investor Profiles                                       │
│  ├─ KYC/KYB Documents                                       │
│  ├─ Investments & Pools                                     │
│  ├─ uLT Token Transactions                                  │
│  └─ Compliance Activities                                   │
│                                                              │
│  BLOCKCHAIN (Polygon)                                       │
│  ├─ uLT Token Smart Contract                                │
│  ├─ Investment Pool Contracts                               │
│  └─ Transaction Verification                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Setup Database

```bash
# Create SQLite database with all tables and seed data
python setup_database.py
```

**Expected output:**
```
======================================================================
🗄️  UJAMAA DEFI PLATFORM - DATABASE SETUP
======================================================================

📊 Database Type: sqlite
📍 Database URL: sqlite:///backend/data/ujamaa.db

⚙️  Creating database engine...
📋 Creating tables...
✅ Tables created successfully!

   Tables created:
   - users
   - investor_profiles
   - pools
   - investments
   - documents (KYC/KYB)
   - ult_transactions
   - transactions
   - compliance_activities

🌱 Seeding initial data...
   ✓ Created 6 users
   ✓ Created 3 investor profiles
   ✓ Created 5 pools
   ✓ Created 3 sample documents

✅ DATABASE SETUP COMPLETE!
======================================================================

📁 Database file: backend/data/ujamaa.db
   Size: 48.00 KB
```

### Step 3: Start Backend

```bash
python main.py
```

Backend starts at: `http://localhost:8000`

### Step 4: Test API

Open Swagger docs: `http://localhost:8000/docs`

Test endpoints:
- `GET /api/v2/db/pools` - Get all pools
- `GET /api/v2/db/documents` - Get KYC/KYB documents
- `GET /api/v2/db/stats/overview` - Get platform stats

---

## 📊 Database Schema

### Tables Created

```sql
-- Users table (authentication)
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    wallet_address VARCHAR(42) UNIQUE,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

-- Investor profiles (KYC/KYB data)
CREATE TABLE investor_profiles (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    full_name VARCHAR(255),
    company_name VARCHAR(255),
    jurisdiction VARCHAR(2) NOT NULL,
    kyc_status VARCHAR(50),
    kyb_status VARCHAR(50),
    accreditation_status VARCHAR(50),
    wallet_address VARCHAR(42),
    total_invested DECIMAL(18,2) DEFAULT 0,
    ult_tokens DECIMAL(18,6) DEFAULT 0,
    created_at DATETIME,
    updated_at DATETIME
);

-- Investment pools
CREATE TABLE pools (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    family VARCHAR(100) NOT NULL,
    target_yield_min FLOAT NOT NULL,
    target_yield_max FLOAT NOT NULL,
    lockup_days INTEGER NOT NULL,
    total_value DECIMAL(18,2) DEFAULT 0,
    apy FLOAT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME,
    updated_at DATETIME
);

-- KYC/KYB Documents (with 24h deadline tracking)
CREATE TABLE documents (
    id INTEGER PRIMARY KEY,
    investor_id INTEGER REFERENCES investor_profiles(id),
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_hash VARCHAR(64),
    upload_status VARCHAR(50) DEFAULT 'uploaded',
    verification_status VARCHAR(50) DEFAULT 'pending',
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at DATETIME,
    review_notes TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deadline_at DATETIME,  -- submitted_at + 24 hours
    created_at DATETIME
);

-- Investments
CREATE TABLE investments (
    id INTEGER PRIMARY KEY,
    pool_id VARCHAR(50) REFERENCES pools(id),
    investor_id INTEGER REFERENCES investor_profiles(id),
    amount DECIMAL(18,2) NOT NULL,
    shares DECIMAL(18,6) NOT NULL,
    nav DECIMAL(18,6) NOT NULL,
    ult_tokens DECIMAL(18,6) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'completed',
    transaction_hash VARCHAR(66),
    created_at DATETIME
);

-- uLT Token Transactions
CREATE TABLE ult_transactions (
    id INTEGER PRIMARY KEY,
    investor_id INTEGER REFERENCES investor_profiles(id),
    transaction_type VARCHAR(50) NOT NULL,  -- MINT, BURN, TRANSFER
    amount DECIMAL(18,6) NOT NULL,
    balance_before DECIMAL(18,6) NOT NULL,
    balance_after DECIMAL(18,6) NOT NULL,
    transaction_hash VARCHAR(66),
    block_number INTEGER,
    status VARCHAR(50) DEFAULT 'pending',
    created_at DATETIME
);

-- Compliance Activities (Audit Trail)
CREATE TABLE compliance_activities (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    activity_type VARCHAR(100) NOT NULL,
    target_id INTEGER,
    target_type VARCHAR(50),
    details JSON,
    ip_address VARCHAR(45),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔗 Blockchain Integration

### Smart Contracts

**uLT Token Contract** (ERC-20 with value accrual)
```solidity
// Functions available:
function mint(address to, uint256 amount) external
function burn(address from, uint256 amount) external
function balanceOf(address account) external view returns (uint256)
```

**Investment Pool Contract**
```solidity
// Functions available:
function invest(bytes32 poolId, uint256 amount) external returns (uint256 ultTokens)
function redeem(bytes32 poolId, uint256 shares) external returns (uint256 amount)
```

### Transaction Flow

```
1. User initiates investment (Frontend)
        ↓
2. Backend creates database record (status: pending)
        ↓
3. Blockchain service mints uLT tokens
        ↓
4. Transaction confirmed on-chain
        ↓
5. Backend updates database (status: completed)
        ↓
6. User sees updated balance
```

---

## 📁 Data Storage Locations

| Data Type | Storage | Location |
|-----------|---------|----------|
| **User Accounts** | Database | `users` table |
| **Investor Profiles** | Database | `investor_profiles` table |
| **KYC/KYB Documents** | Database + File System | `documents` table + `/uploads/` |
| **Pools** | Database | `pools` table |
| **Investments** | Database + Blockchain | `investments` table + Smart Contract |
| **uLT Tokens** | Database + Blockchain | `ult_transactions` + Token Contract |
| **Compliance Logs** | Database | `compliance_activities` table |
| **UI State** | Database | Via API endpoints |

---

## 🧪 Testing the Setup

### Test 1: Database Connection
```bash
# Run setup script
python setup_database.py

# Should show: ✅ DATABASE SETUP COMPLETE!
```

### Test 2: API Endpoints
```bash
# Get all pools
curl http://localhost:8000/api/v2/db/pools

# Get documents
curl http://localhost:8000/api/v2/db/documents

# Get stats
curl http://localhost:8000/api/v2/db/stats/overview
```

### Test 3: Swagger UI
```
1. Open: http://localhost:8000/docs
2. Try: GET /api/v2/db/pools
3. Execute and see response
```

### Test 4: Database File
```bash
# Check database file exists
ls -lh backend/data/ujamaa.db

# Should be ~48 KB with seed data
```

---

## 🔄 Migration from Mock Data

### Before (Mock Data)
```python
# ❌ In-memory data (lost on restart)
documents_db = {
    "doc-001": {...}
}
```

### After (Database)
```python
# ✅ Persistent database storage
db = SessionLocal()
documents = db.query(Document).all()
```

### API Changes

**Old Endpoint (Mock):**
```python
@router.get("/documents")
async def get_documents():
    return list(documents_db.values())  # Mock data
```

**New Endpoint (Database):**
```python
@router.get("/documents")
async def get_documents(db: Session = Depends(get_db)):
    documents = db.query(Document).all()
    return documents  # Database data
```

---

## 🎯 Production Deployment

### Switch to PostgreSQL

**1. Update .env:**
```env
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://user:password@host:5432/ujamaa_defi
```

**2. Install PostgreSQL adapter:**
```bash
pip install psycopg2-binary
```

**3. Run setup:**
```bash
python setup_database.py
```

**4. Deploy contracts to mainnet:**
```bash
# Update contract addresses in .env
CONTRACT_ULT_TOKEN=0x...
CONTRACT_INVESTMENT_POOL=0x...
```

---

## 📊 Database vs Blockchain Usage

### What Goes in Database:
- ✅ User accounts & profiles
- ✅ KYC/KYB documents
- ✅ Investment records
- ✅ uLT token balances (cached)
- ✅ Compliance activities
- ✅ Pool statistics
- ✅ UI state & preferences

### What Goes on Blockchain:
- ✅ uLT token minting/burning
- ✅ Investment transactions
- ✅ Token transfers
- ✅ Smart contract events

### Why Both?
```
Database: Fast queries, rich data, compliance
Blockchain: Trustless, verifiable, decentralized

Together: Best of both worlds!
```

---

## 🔒 Security Considerations

### Database Security
- ✅ SQL injection protection (SQLAlchemy ORM)
- ✅ Password hashing (bcrypt)
- ✅ Input validation (Pydantic)
- ✅ Access control (Role-based)

### Blockchain Security
- ✅ Transaction verification
- ✅ Smart contract audits
- ✅ Multi-sig for admin functions
- ✅ Gas optimization

### Best Practices
- Never store private keys in code
- Use environment variables
- Enable HTTPS in production
- Regular security audits

---

## ✅ Setup Checklist

- [ ] Install dependencies
- [ ] Run `setup_database.py`
- [ ] Verify database file created
- [ ] Start backend server
- [ ] Test API endpoints
- [ ] Check Swagger docs
- [ ] Verify seed data loaded
- [ ] Test blockchain service (demo mode)

---

## 📞 Troubleshooting

### "Database not found"
```bash
# Run setup script
python setup_database.py

# Check file exists
ls backend/data/ujamaa.db
```

### "Table doesn't exist"
```bash
# Drop and recreate database
rm backend/data/ujamaa.db
python setup_database.py
```

### "API endpoints not working"
```bash
# Check backend is running
python main.py

# Test health endpoint
curl http://localhost:8000/health
```

---

**🎉 Database + Blockchain architecture is now active!**

**Version**: 2.0.0-mvp-testnet  
**Last Updated**: April 2, 2026  
**Status**: ✅ Ready for Production
