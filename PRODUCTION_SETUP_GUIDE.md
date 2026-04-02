# 🔐 Production Setup Guide

## Step 1: Get Your Private Key from MetaMask

### Instructions

1. **Open MetaMask** browser extension
2. **Click on your account** (top left circle with icon)
3. **Click "Account Details"**
4. **Click "Export Private Key"**
5. **Enter your MetaMask password**
6. **Copy the private key** (it looks like: `a1b2c3d4e5f6...`)
7. **DO NOT share this key with anyone!**

### ⚠️ Security Warnings

- ❌ **NEVER** commit `.env` file to Git
- ❌ **NEVER** share your private key
- ❌ **NEVER** use mainnet key for testnet
- ✅ **DO** create a separate testnet wallet
- ✅ **DO** use small amounts of test POL only

---

## Step 2: Get Test POL (Gas Tokens)

### Option 1: Polygon Faucet (Recommended)

1. **Visit:** https://faucet.polygon.technology/
2. **Connect your wallet**
3. **Select "Amoy" network**
4. **Click "Request 0.5 POL"**
5. **Wait 1-2 minutes**
6. **Check balance in MetaMask**

### Option 2: Alternative Faucets

- https://amoyfaucet.com/
- https://faucet.polygon.technology/
- https://stakely.io/en/faucet/polygon-matic

### How Much Do You Need?

| Action | Gas Cost (approx) |
|--------|-------------------|
| Mint tokens | 0.001 POL |
| Invest in pool | 0.002 POL |
| Redeem tokens | 0.002 POL |

**Recommended:** Start with 0.5 POL (enough for 100+ transactions)

---

## Step 3: Update .env File

**File:** `backend/.env`

```bash
# Replace these lines:
PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
DEPLOYER_ADDRESS=YOUR_WALLET_ADDRESS_HERE

# With your actual values:
PRIVATE_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
DEPLOYER_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1
```

### Format Notes

- **PRIVATE_KEY:** WITHOUT `0x` prefix
- **DEPLOYER_ADDRESS:** WITH `0x` prefix
- **No quotes** around values

---

## Step 4: Test Configuration

### Run Test Script

```bash
cd backend
python test_blockchain.py
```

### Expected Output (DEMO_MODE=False)

```
======================================================================
  🧪 BLOCKCHAIN INTEGRATION TESTS
======================================================================

Network: Polygon Amoy (Chain ID: 80002)
DEMO_MODE: False

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

✅ Minting successful!
   TX Hash: 0x123abc456def...
   Block: 35998503

Total: 5/5 tests passed
🎉 All tests passed! Blockchain integration is working!
```

### If You See Errors

**Error:** `Insufficient funds for gas`
- **Fix:** Get more test POL from faucet

**Error:** `invalid private key`
- **Fix:** Check PRIVATE_KEY format (no 0x, no spaces)

**Error:** `contract not deployed`
- **Fix:** Verify contract addresses in .env

---

## Step 5: Verify on Block Explorer

### After Successful Test

1. **Copy transaction hash** from test output
2. **Visit:** https://amoy.polygonscan.com/
3. **Paste hash in search box**
4. **Press Enter**
5. **Verify:**
   - Status: Success ✅
   - Method: mint
   - From: Your wallet address
   - To: ULP Token contract

---

## Step 6: Start Backend in Production Mode

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
Mode: MVP Testnet
✅ Connected to Polygon Amoy RPC
Blockchain: PRODUCTION MODE (real transactions)
============================================================
```

---

## ✅ Production Checklist

- [ ] Private key added to `.env`
- [ ] Wallet address added to `.env`
- [ ] DEMO_MODE=False
- [ ] Test POL in wallet (0.5+ POL)
- [ ] Tests passing (5/5)
- [ ] Transaction verified on explorer
- [ ] Backend started successfully

---

## 🚨 Emergency Procedures

### If Something Goes Wrong

1. **Stop backend:** Press `Ctrl+C`
2. **Set DEMO_MODE=True** in `.env`
3. **Restart backend**
4. **Investigate error logs**

### If Private Key Compromised

1. **Create new MetaMask wallet**
2. **Transfer any funds** to new wallet
3. **Update .env** with new key
4. **Never use compromised key again**

---

## 📞 Need Help?

### Common Issues

**Q: How do I know if I'm on testnet?**
- A: Check MetaMask network selector - should say "Polygon Amoy"

**Q: Can I lose real money?**
- A: No, Amoy is testnet only. But never share your private key!

**Q: Transaction stuck pending?**
- A: Wait 2-3 minutes. If still pending, check gas price.

**Q: "Insufficient funds" but I have POL?**
- A: Make sure you're on Polygon Amoy, not mainnet.

---

**Setup Completed:** April 2, 2026  
**Status:** ✅ Ready for production testing
