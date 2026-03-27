# MVP Deployment Runbook

**Version:** 1.0  
**Date:** March 18, 2026  
**Author:** Aziz Da Silva - Lead Architect
**Classification:** Internal / Operations

---

## Table of Contents

1. [Pre-Deployment Checklist](#1-pre-deployment-checklist)
2. [Smart Contract Deployment](#2-smart-contract-deployment)
3. [Backend Deployment](#3-backend-deployment)
4. [Frontend Deployment](#4-frontend-deployment)
5. [Post-Deployment Verification](#5-post-deployment-verification)
6. [Rollback Procedures](#6-rollback-procedures)
7. [Emergency Contacts](#7-emergency-contacts)

---

## 1. Pre-Deployment Checklist

### 1.1 Code Review

- [ ] All PRs merged to `main` branch
- [ ] Code review completed (2 approvals minimum)
- [ ] Security scan passed (0 critical, 0 high findings)
- [ ] All tests passing (unit, integration, E2E)
- [ ] Load tests completed (P95 < 500ms)

### 1.2 Environment Preparation

- [ ] Polygon Amoy RPC endpoint verified
- [ ] Deployer wallet funded (minimum 1 MATIC)
- [ ] Database backup completed
- [ ] Redis cache cleared
- [ ] Environment variables updated

### 1.3 Communication

- [ ] Deployment announcement sent
- [ ] On-call team notified
- [ ] Stakeholders informed

---

## 2. Smart Contract Deployment

### 2.1 Prerequisites

```bash
# Verify Node.js version
node --version  # Should be 18+

# Install dependencies
cd contracts
npm install
```

### 2.2 Set Environment Variables

```bash
# Create .env file
cat > .env << EOF
DEPLOYER_PRIVATE_KEY=${DEPLOYER_PRIVATE_KEY}
RPC_URL=https://rpc-amoy.polygon.technology/
POLYGONSCAN_API_KEY=${POLYGONSCAN_API_KEY}
EOF
```

### 2.3 Deploy Contracts

```bash
# Run deployment script
npm run deploy:amoy

# Expected output:
# ============================================================
# 🚀 MVP Smart Contract Deployment
# ============================================================
# 📝 Deploying with account: 0x...
# 💰 Account balance: X MATIC
# 🌐 Network: polygon-amoy (Chain ID: 80002)
# 
# ✅ uLPToken deployed to: 0x...
# ✅ LiquidityPool deployed to: 0x...
# ✅ MockEscrow deployed to: 0x...
# ✅ MockFiatRamp deployed to: 0x...
```

### 2.4 Verify Contracts

```bash
# Verify on Polygonscan
npm run verify:amoy <CONTRACT_ADDRESS>

# Or manually:
npx hardhat verify \
  --network polygon-amoy \
  <CONTRACT_ADDRESS> \
  <CONSTRUCTOR_ARGS>
```

### 2.5 Record Deployed Addresses

Save deployed addresses to secure location:

```
uLPToken:          0x...
LiquidityPool:     0x...
MockEscrow:        0x...
MockFiatRamp:      0x...
```

### 2.6 Update Frontend Configuration

```bash
# Update frontend/.env.MVP
VITE_uLP_TOKEN_ADDRESS=0x...
VITE_LIQUIDITY_POOL_ADDRESS=0x...
VITE_MOCK_ESCROW_ADDRESS=0x...
VITE_MOCK_FIAT_RAMP_ADDRESS=0x...
```

---

## 3. Backend Deployment

### 3.1 Prerequisites

```bash
# Verify Python version
python --version  # Should be 3.10+

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate  # Windows
```

### 3.2 Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3.3 Database Migration

```bash
# Run migrations
alembic upgrade head

# Verify migration
alembic current
```

### 3.4 Start Backend Service

```bash
# Development
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production (with gunicorn)
gunicorn main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --timeout 120
```

### 3.5 Health Check

```bash
# Verify API is running
curl http://localhost:8000/api/v2/health

# Expected response:
# {"status": "healthy", "service": "ujamaa-MVP", "version": "2.0.0"}
```

---

## 4. Frontend Deployment

### 4.1 Prerequisites

```bash
# Verify Node.js version
node --version  # Should be 18+
npm --version   # Should be 9+
```

### 4.2 Install Dependencies

```bash
cd frontend
npm install
```

### 4.3 Environment Configuration

```bash
# Copy environment template
cp .env.MVP .env.production

# Update with deployed contract addresses
# (See Section 2.6)
```

### 4.4 Build Frontend

```bash
# Run build
npm run build

# Verify build output
ls -la dist/
```

### 4.5 Deploy to CDN/Hosting

```bash
# Example: Deploy to Vercel
vercel --prod

# Example: Deploy to Netlify
netlify deploy --prod --dir=dist

# Example: Deploy to S3 + CloudFront
aws s3 sync dist/ s3://ujamaa-MVP-frontend/
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

### 4.6 Verify Deployment

```bash
# Check homepage loads
curl -I https://testnet.ujamaa-defi.com/

# Expected: HTTP/2 200
```

---

## 5. Post-Deployment Verification

### 5.1 Smart Contract Verification

```bash
# Check contract balances
# (Use ethers.js or web3.py)

# Verify uLPToken total supply
# Expected: 0 (initial)

# Verify LiquidityPool pool count
# Expected: 0 (initial)
```

### 5.2 API Endpoint Verification

```bash
# List pools
curl https://api.testnet.ujamaa-defi.com/api/v2/pools

# Expected: {"pools": [], "total": 0}

# Get bank stats
curl https://api.testnet.ujamaa-defi.com/api/v2/bank/stats

# Expected: {"total_accounts": 0, ...}
```

### 5.3 Frontend Verification

- [ ] Homepage loads without errors
- [ ] MVP banner visible
- [ ] Testnet notice displayed
- [ ] Dashboard accessible
- [ ] Pool marketplace loads
- [ ] Compliance page functional
- [ ] Wallet connection works

### 5.4 Integration Test

```bash
# Run smoke tests
cd tests
npm run smoke-test

# Expected: All tests pass
```

---

## 6. Rollback Procedures

### 6.1 Smart Contract Rollback

**Note:** Smart contracts cannot be rolled back once deployed. In case of critical bug:

1. Pause contracts (if pause mechanism exists)
2. Deploy new contracts with fix
3. Migrate users to new contracts
4. Announce migration plan

### 6.2 Backend Rollback

```bash
# Revert to previous version
git checkout <previous-commit>
pip install -r requirements.txt
alembic downgrade -1
systemctl restart ujamaa-backend
```

### 6.3 Frontend Rollback

```bash
# Revert to previous build
git checkout <previous-commit>
npm install
npm run build
vercel --prod  # or your hosting provider
```

### 6.4 Database Rollback

```bash
# Restore from backup
pg_restore -d ujamaa_MVP backup_20260318.dump

# Or restore from replica
# (Contact DBA)
```

---

## 7. Emergency Contacts

| Role | Name | Contact |
|------|------|---------|
| **On-Call Engineer** | TBD | oncall@ujamaa-defi.com |
| **DevOps Lead** | TBD | devops@ujamaa-defi.com |
| **Security Lead** | TBD | security@ujamaa-defi.com |
| **Product Owner** | TBD | product@ujamaa-defi.com |

### Emergency Procedures

1. **Critical Bug:** Page on-call engineer, create incident channel
2. **Security Issue:** Contact security lead immediately, do not disclose publicly
3. **Performance Degradation:** Scale infrastructure, investigate root cause
4. **Data Loss:** Stop all writes, restore from backup, notify stakeholders

---

## Appendix A: Deployment Checklist Template

```markdown
## Deployment: [DATE]

### Pre-Deployment
- [ ] Code review complete
- [ ] Tests passing
- [ ] Security scan passed
- [ ] Backup completed

### Smart Contracts
- [ ] Deployed to Polygon Amoy
- [ ] Verified on Polygonscan
- [ ] Addresses recorded

### Backend
- [ ] Deployed to production
- [ ] Health check passed
- [ ] Database migrated

### Frontend
- [ ] Built successfully
- [ ] Deployed to CDN
- [ ] Homepage loads

### Post-Deployment
- [ ] Smoke tests passed
- [ ] Monitoring active
- [ ] Stakeholders notified

### Sign-off
- Deployer: ________________
- Reviewer: ________________
- Time: ________________
```

---

## Appendix B: Environment Variables Reference

### Smart Contracts

| Variable | Description | Example |
|----------|-------------|---------|
| `DEPLOYER_PRIVATE_KEY` | Deployer wallet private key | `0x...` |
| `RPC_URL` | Polygon Amoy RPC endpoint | `https://rpc-amoy...` |
| `POLYGONSCAN_API_KEY` | Polygonscan API key | `ABC123...` |

### Backend

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `REDIS_URL` | Redis connection string | `redis://...` |
| `MVP_MODE` | Enable MVP mode | `true` |

### Frontend

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_uLP_TOKEN_ADDRESS` | uLPToken contract address | `0x...` |
| `VITE_RPC_URL` | Polygon Amoy RPC endpoint | `https://rpc-amoy...` |
| `VITE_CHAIN_ID` | Chain ID | `80002` |

---

**END OF RUNBOOK**
