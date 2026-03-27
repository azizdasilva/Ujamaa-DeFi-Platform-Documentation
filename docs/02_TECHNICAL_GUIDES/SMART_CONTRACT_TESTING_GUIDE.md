# Smart Contract Testing Guide
## Ujamaa DeFi Platform - MVP Testnet

**Network:** Polygon Amoy Testnet (Chain ID: 80002)

---

## 📋 Prerequisites

### 1. Install MetaMask
- Download from [metamask.io](https://metamask.io/)
- Create a new wallet or import existing
- **⚠️ Use a test wallet only - never use mainnet private keys on testnet**

### 2. Add Polygon Amoy Network

Add to MetaMask:
- **Network Name:** Polygon Amoy Testnet
- **RPC URL:** `https://rpc-amoy.polygon.technology/`
- **Chain ID:** `80002`
- **Currency Symbol:** `POL`
- **Block Explorer:** `https://amoy.polygonscan.com/`

Or use [Chainlist](https://chainlist.org/) to add automatically.

### 3. Get Test POL Tokens

Get test tokens from faucets:
- **Official Faucet:** https://faucet.polygon.technology/
- **Alternative:** https://amoyfaucet.com/

You'll need ~0.1 POL for testing.

---

## 🚀 Quick Start

### Option 1: Frontend Testing (Recommended for UI)

1. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open browser:** `http://localhost:5173`

3. **Connect wallet:**
   - Click "Connect Wallet" in navigation
   - Approve MetaMask connection
   - Switch to Polygon Amoy if prompted

4. **Access Contract Dashboard:**
   - Navigate to `/contract-test`
   - Or go to http://localhost:5173/contract-test

5. **Test contracts:**
   - View pool families
   - Check token balances
   - Interact with deployed contracts

---

### Option 2: Foundry Testing (Recommended for Development)

#### Install Foundry

```bash
# Install foundryup
curl -L https://foundry.paradigm.xyz | bash

# Install foundry
foundryup
```

#### Install Dependencies

```bash
npm install
```

#### Compile Contracts

```bash
forge build
```

#### Run Tests

```bash
# Run all tests
forge test

# Run with gas report
forge test --gas-report

# Run specific test
forge test --match-test testDeposit

# Run with verbosity
forge test -vvv
```

#### Deploy to Testnet

1. **Set environment variables:**
   ```bash
   export PRIVATE_KEY=your_deployer_private_key
   export RPC_URL=https://rpc-amoy.polygon.technology/
   export POLYGONSCAN_API_KEY=your_api_key  # Optional, for verification
   ```

2. **Deploy:**
   ```bash
   forge script script/DeployMVP.s.sol:DeployMVP \
     --rpc-url polygon_amoy \
     --broadcast \
     --verify \
     -vvvv
   ```

3. **Save contract addresses:**
   - Copy deployed addresses from output
   - Update `frontend/src/config/web3.ts`
   - Update `frontend/src/hooks/useContractInteraction.ts`

---

## 📊 Contract Overview

### Deployed Contracts

| Contract | Description | Test Address |
|----------|-------------|--------------|
| **ULPToken** | Yield-bearing LP token (ERC-3643) | TBD |
| **GuaranteeToken** | Collateral-backed guarantee token | TBD |
| **LiquidityPool** | Multi-asset pool manager | TBD |
| **JurisdictionCompliance** | KYC/AML compliance checker | TBD |
| **MockEscrow** | Mock escrow service (testnet) | TBD |
| **MockFiatRamp** | Mock fiat on/off ramp | TBD |

### Pool Families

| Pool | Target APY | Term | Focus |
|------|------------|------|-------|
| **POOL_INDUSTRIE** | 10-12% | 365 days | Manufacturing, GDIZ (Benin) partners |
| **POOL_AGRICULTURE** | 12-15% | 180 days | Coffee, cocoa, cotton |
| **POOL_TRADE_FINANCE** | 8-10% | 90 days | Invoice tokenization |
| **POOL_RENEWABLE_ENERGY** | 9-11% | 730 days | Solar, wind, hydro |
| **POOL_REAL_ESTATE** | 8-12% | 1095 days | Commercial & residential |

---

## 🧪 Testing Scenarios

### 1. Token Operations

```bash
# Test uLP token minting
forge test --match-test testMint

# Test uLP token burning
forge test --match-test testBurn

# Test NAV calculation
forge test --match-test testNAVCalculation
```

### 2. Pool Operations

```bash
# Test deposit
forge test --match-test testDeposit

# Test redemption
forge test --match-test testRedeem

# Test yield distribution
forge test --match-test testYieldDistribution
```

### 3. Compliance

```bash
# Test jurisdiction check
forge test --match-test testJurisdictionCheck

# Test blocked jurisdictions
forge test --match-test testBlockedJurisdictions
```

---

## 🔍 Frontend Integration

### Update Contract Addresses

After deployment, update these files:

**`frontend/src/config/web3.ts`:**
```typescript
CONTRACTS: {
  ULP_TOKEN: '0x...', // Your deployed address
  UAT_TOKEN: '0x...',
  UGT_TOKEN: '0x...',
  LIQUIDITY_POOL: '0x...',
  // ...
}
```

**`frontend/src/hooks/useContractInteraction.ts`:**
```typescript
const CONTRACT_ADDRESSES = {
  ULP_TOKEN: '0x...',
  UJEUR_TOKEN: '0x...',
  LIQUIDITY_POOL: '0x...',
  // ...
} as const;
```

### Test Contract Interaction

1. **Connect wallet** in the frontend
2. **Navigate to** `/contract-test`
3. **Click "Refresh"** to load pool data
4. **View contract addresses** in Tokens tab
5. **Test deployment** in Deployment tab

---

## 🛠️ Troubleshooting

### "User rejected the request"
- User denied MetaMask popup
- Click "Connect Wallet" again and approve

### "Wrong network"
- MetaMask is on a different network
- Click "Switch Network" or manually switch to Polygon Amoy

### "Insufficient funds for gas"
- Need test POL tokens
- Get from faucet: https://faucet.polygon.technology/

### "Contract not deployed"
- Contracts show `0x0000...0000` addresses
- Deploy contracts using Foundry script
- Update addresses in config files

### "Transaction reverted"
- Check MetaMask for error details
- Verify contract is deployed correctly
- Check you have correct roles/permissions

---

## 📚 Additional Resources

### Documentation
- [White Paper](/investors-room/white-paper)
- [Deep Dive](/deep-dive)
- [Technical Specs](/docs/02_TECHNICAL_GUIDES/)

### External Links
- [Polygon Amoy Explorer](https://amoy.polygonscan.com/)
- [Polygon Docs](https://docs.polygon.technology/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Wagmi Docs](https://wagmi.sh/)
- [Viem Docs](https://viem.sh/)

---

## ⚠️ Important Notices

### MVP TESTNET
- **This is a TESTNET deployment**
- **NO REAL MONEY is involved**
- All tokens are TEST TOKENS only
- For testing and development purposes only

### Security
- Never use mainnet private keys on testnet
- Use a dedicated test wallet
- Do not share your private keys
- Keep test and production environments separate

---

## 📞 Support

For issues or questions:
- Check the [README.md](../README.md)
- Review [03_MVP_MOCKING_AND_TESTNET_STRATEGY.md](../docs/03_MVP_MOCKING_AND_TESTNET_STRATEGY.md)
- Contact: Lead Architect - Aziz Da Silva

---

**Last Updated:** March 2026
**Version:** 2.0.0-MVP
