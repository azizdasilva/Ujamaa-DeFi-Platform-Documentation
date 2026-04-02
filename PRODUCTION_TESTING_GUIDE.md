# 🧪 Production Testing Guide

## Current Configuration

**File:** `backend/.env`
```bash
DEMO_MODE=False  # ✅ Production mode enabled
PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE  # ⚠️ Need to add your key
```

---

## ⚠️ IMPORTANT: Before Testing

### You MUST Add Your Private Key

**Without a private key, transactions will fail!**

### How to Add Private Key

1. **Open MetaMask**
2. **Click account → Account Details**
3. **Click "Export Private Key"**
4. **Enter password**
5. **Copy the key** (looks like: `a1b2c3d4...`)
6. **Edit `backend/.env`:**
   ```bash
   PRIVATE_KEY=a1b2c3d4e5f6...  # Paste your key (NO 0x prefix)
   ```

### Get Test POL

1. **Visit:** https://faucet.polygon.technology/
2. **Connect wallet**
3. **Request 0.5 POL**
4. **Wait 1-2 minutes**

---

## Test 1: Backend with DEMO_MODE=False

### Run Test Script

```bash
cd backend
python test_blockchain.py
```

### Expected Output (With Private Key)

```
======================================================================
  🧪 BLOCKCHAIN INTEGRATION TESTS
======================================================================

Network: Polygon Amoy (Chain ID: 80002)
DEMO_MODE: False  ← Production mode

✅ Connected to Polygon Amoy RPC
   Chain ID: 80002

✅ ULP_TOKEN: Deployed
✅ LIQUIDITY_POOL: Deployed
✅ GUARANTEE_TOKEN: Deployed

✅ Contracts loaded successfully
   - ULP_TOKEN
   - LIQUIDITY_POOL

✅ Balance query successful
Wallet: 0x742d35Cc6634C0532925...
ULP Balance: 0.00 UPT

✅ Minting successful!  ← Real blockchain transaction
   TX Hash: 0x123abc456def789...
   Block: 35998503

Total: 5/5 tests passed
🎉 All tests passed! Blockchain integration is working!
```

### Expected Output (WITHOUT Private Key)

```
⚠️  PRIVATE_KEY not configured in .env
❌ Minting failed with exception: Missing private key

Total: 4/5 tests failed
⚠️  Please add PRIVATE_KEY to backend/.env
```

---

## Test 2: Start Backend Server

### Start Server

```bash
cd backend
python main.py
```

### Expected Output

```
============================================================
🚀 Ujamaa DeFi Platform - MVP API
============================================================
Network: polygon-amoy (Chain ID: 80002)
Block Explorer: https://amoy.polygonscan.com/
Mode: MVP Testnet
Mock Services:
   - Bank: True
   - Escrow: True
   - GDIZ: True
   - Fiat Ramp: True
   - KYB: True
API Docs: http://localhost:8000/docs
============================================================
✅ Connected to Polygon Amoy RPC
Blockchain: PRODUCTION MODE (real transactions)
⚠️  DISCLAIMER: This is a testnet deployment. No real funds.
============================================================
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Verify Blockchain Connection

**Look for:**
- ✅ `Connected to Polygon Amoy RPC`
- ✅ `PRODUCTION MODE (real transactions)`

**If you see:**
- ❌ `Failed to connect` → Check RPC URL
- ❌ `DEMO MODE` → Check DEMO_MODE=False in .env

---

## Test 3: Frontend Integration

### Start Frontend

```bash
cd frontend
npm run dev
```

### In Browser (http://localhost:5173)

1. **Click "Connect Wallet"** (top right)
2. **MetaMask popup appears**
3. **Approve connection**
4. **Navigate to:** Institutional Dashboard

### What You Should See

**If Wallet Connected:**
- ✅ "ULP Token Balance: 0.00 UPT" (or actual balance)
- ✅ "Total Portfolio Value: €0.00" (or actual value)
- ✅ Wallet address shown in top right

**If Wallet NOT Connected:**
- ⚠️ Blue banner: "🔗 Connect Your Wallet"
- ⚠️ Shows mock data as fallback

---

## Test 4: Real Investment Flow

### Prerequisites

- [ ] Private key added to `.env`
- [ ] Test POL in wallet (0.5+ POL)
- [ ] Backend running with DEMO_MODE=False
- [ ] Frontend running
- [ ] Wallet connected in browser

### Steps

1. **Navigate to:** Pool Marketplace
2. **Click "Invest"** on Pool Industrie
3. **Enter amount:** €10,000
4. **Click "Confirm Investment"**
5. **MetaMask popup appears**
6. **Review transaction:**
   - To: LiquidityPool contract
   - From: Your wallet
   - Gas: ~0.001 POL
7. **Click "Confirm"**
8. **Wait 15-30 seconds**
9. **Success message appears**
10. **Click "View on Explorer"**

### Verify on Block Explorer

1. **Click transaction hash** or visit:
   https://amoy.polygonscan.com/
2. **Search your wallet address**
3. **Find the transaction**
4. **Verify:**
   - Status: Success ✅
   - Method: invest
   - Amount: Correct

---

## Troubleshooting

### Error: "Insufficient funds for gas"

**Cause:** No test POL in wallet

**Fix:**
1. Visit https://faucet.polygon.technology/
2. Request 0.5 POL
3. Wait 1-2 minutes
4. Try again

### Error: "invalid private key"

**Cause:** Wrong format in .env

**Fix:**
```bash
# WRONG:
PRIVATE_KEY=0xa1b2c3d4...  # Has 0x prefix
PRIVATE_KEY="a1b2c3d4..."  # Has quotes

# RIGHT:
PRIVATE_KEY=a1b2c3d4e5f6...  # No 0x, no quotes
```

### Error: "Transaction stuck pending"

**Cause:** Network congestion or low gas

**Fix:**
1. Wait 2-3 minutes
2. If still pending, transaction may have failed
3. Check on block explorer
4. Try again with higher gas (if needed)

### Error: "Contract not deployed"

**Cause:** Wrong contract address in .env

**Fix:**
1. Verify addresses on block explorer
2. Update .env with correct addresses
3. Restart backend

---

## ✅ Production Checklist

- [ ] Private key added to `.env`
- [ ] DEMO_MODE=False
- [ ] Test POL in wallet (0.5+ POL)
- [ ] Backend tests passing (5/5)
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Wallet connected
- [ ] Transaction verified on explorer

---

## 📊 Test Results Template

```
## Test Results - [DATE]

### Backend Configuration
- DEMO_MODE: False ✅
- PRIVATE_KEY: [CONFIGURED] ✅
- Test POL: [BALANCE] POL ✅

### Test Script Results
- Web3 Connection: ✅ PASS
- Contract Deployment: ✅ PASS
- BlockchainService: ✅ PASS
- Token Balance: ✅ PASS
- Token Minting: ✅ PASS

### Frontend Tests
- Wallet Connection: ✅ PASS
- Balance Display: ✅ PASS
- Investment Flow: ✅ PASS / ⏳ PENDING

### Block Explorer Verification
- TX Hash: [HASH]
- Status: Success ✅
- Block: [NUMBER]
- Gas Used: [AMOUNT] POL

### Notes
[Any issues or observations]
```

---

**Testing Guide Created:** April 2, 2026  
**Status:** ✅ Ready for production testing
