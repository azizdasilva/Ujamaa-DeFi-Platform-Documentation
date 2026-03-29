# Ujamaa Monitor - Contract Deployment Guide

## Prerequisites

1. **Foundry installed**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Polygon Amoy MATIC tokens** (for gas)
   - Get test MATIC from: https://faucet.polygon.technology/
   - Send to your deployer wallet

3. **Private key ready** (never share this!)

---

## Step 1: Deploy Contracts

```bash
# Navigate to project root
cd "C:\Users\aziz_\PycharmProjects\2026\INTELLI_BRIDGE_ANALYTICS\UJAMAA DeFi PlatForm"

# Set environment variables
export PRIVATE_KEY=your_deployer_private_key_here

# Deploy to Polygon Amoy
forge script script/DeployMVP.s.sol:DeployMVP \
  --rpc-url https://rpc-amoy.polygon.technology/ \
  --broadcast \
  --verify \
  -vvvv
```

### Save the Output!

The deployment will output addresses like:
```
========================================
       DEPLOYMENT COMPLETE
========================================
ULPToken:             0x1234...abcd
GuaranteeToken:       0x2345...bcde
LiquidityPool:        0x3456...cdef
JurisdictionCompliance: 0x4567...defg
MockEscrow:           0x5678...efgh
MockFiatRamp:         0x6789...fghi
========================================
```

**Copy these addresses!**

---

## Step 2: Update Monitor Configuration

Open: `frontend/src/config/monitor.ts`

Replace the placeholder addresses:

```typescript
export const CONTRACT_ADDRESSES = {
  ulpToken: '0x1234...abcd', // From deployment output
  liquidityPool: '0x3456...cdef',
  guaranteeToken: '0x2345...bcde',
  industrialGateway: '0x4567...defg', // Using JurisdictionCompliance
  mockEscrow: '0x5678...efgh',
  mockFiatRamp: '0x6789...fghi',
} as const;
```

**Disable mock data:**

```typescript
export const MONITOR_FEATURES = {
  USE_MOCK_DATA: false, // ← Change this to false
  DEBUG: true,
  ENABLE_TOASTS: true,
} as const;
```

---

## Step 3: Rebuild and Deploy Frontend

```bash
cd frontend

# Build
npm run build

# Test locally (optional)
npm run dev

# Deploy to Vercel
vercel --prod
```

---

## Step 4: Verify on Monitor Dashboard

1. Navigate to: `https://your-app.vercel.app/monitor`
2. You should see **live data** from Polygon Amoy
3. The "Mock Data Mode" banner should be gone

---

## Troubleshooting

### "Insufficient funds for gas"
- Get more test MATIC from the faucet
- Check your deployer wallet balance: https://amoy.polygonscan.com/address/YOUR_ADDRESS

### "Contract not deployed" error
- Make sure contracts deployed successfully
- Verify addresses on Polygonscan Amoy: https://amoy.polygonscan.com/

### "RPC call failed"
- Check RPC endpoint is working: https://rpc-amoy.polygon.technology/
- Try alternative RPC: https://rpc.ankr.com/polygon_amoy

### Monitor shows "0" for all values
- Contracts might not be initialized yet
- Check if `USE_MOCK_DATA: false` is set
- Verify contract addresses are correct

---

## Contract Addresses Reference

| Contract | Purpose | Address |
|----------|---------|---------|
| ULPToken | Yield-bearing pool token | `0x...` |
| GuaranteeToken | Collateral NFT (UJG) | `0x...` |
| LiquidityPool | Pool management | `0x...` |
| JurisdictionCompliance | Compliance enforcement | `0x...` |
| MockEscrow | Bank escrow simulation | `0x...` |
| MockFiatRamp | Fiat on/off ramp | `0x...` |

**Fill these in after deployment!**

---

## Next Steps After Deployment

1. **Test with small transactions** - Mint some uLP, create a financing
2. **Monitor events** - Check the activity feed shows real transactions
3. **Share dashboard** - Send `/monitor` link to stakeholders

---

**Questions?** Check the strategy doc:
`documentation/11_FUTURE_ENHANCEMENTS/UJAMAA_MONITOR_STRATEGY.html`
