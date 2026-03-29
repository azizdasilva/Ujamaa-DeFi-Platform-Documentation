# Smart Contract Deployment Guide - Polygon Amoy Testnet

**Version:** 1.0  
**Last Updated:** March 29, 2026  
**Author:** Ujamaa DeFi Platform Team  
**Network:** Polygon Amoy Testnet (Chain ID: 80002)

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step 1: Install Foundry](#2-step-1-install-foundry)
3. [Step 2: Set Up Your Project](#3-step-2-set-up-your-project)
4. [Step 3: Install Dependencies](#4-step-3-install-dependencies)
5. [Step 4: Configure Your Private Key](#5-step-4-configure-your-private-key)
6. [Step 5: Get Test POL Tokens](#6-step-5-get-test-pol-tokens)
7. [Step 6: Deploy Smart Contracts](#7-step-6-deploy-smart-contracts)
8. [Step 7: Verify Deployment](#8-step-7-verify-deployment)
9. [Step 8: Update Frontend Configuration](#9-step-8-update-frontend-configuration)
10. [Troubleshooting](#10-troubleshooting)
11. [Deployed Contract Addresses](#11-deployed-contract-addresses)

---

## 1. Prerequisites

Before starting the deployment process, ensure you have the following:

- **Windows 10/11** (or macOS/Linux with equivalent commands)
- **Node.js 18+** installed
- **Git** installed and configured
- **MetaMask** browser extension installed
- **Basic knowledge** of command line operations

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18+ | Frontend build tools |
| Git | Latest | Version control |
| Foundry | Latest | Smart contract deployment |
| MetaMask | Latest | Wallet for testnet |

---

## 2. Step 1: Install Foundry

Foundry is a blazing fast, portable and modular toolkit for Ethereum application development.

### Windows Installation

#### Option A: Using Winget (Recommended)

```powershell
# Open PowerShell as Administrator
winget install foundry
```

#### Option B: Using FoundryUp Script

```powershell
# Download and run foundryup
powershell -Command "iwr https://foundry.paradigm.xyz -useb | iex"

# Then run foundryup
foundryup
```

#### Option C: Using Cargo (if Rust is installed)

```bash
cargo install --git https://github.com/foundry-rs/foundry --locked forge
```

### Verify Installation

After installation, verify Foundry is working:

```bash
forge --version
```

**Expected Output:**
```
forge Version: 1.x.x-nightly
Commit SHA: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Add Foundry to PATH (if needed)

If `forge` command is not recognized, add it to your PATH:

**Windows:**
1. Open System Properties → Environment Variables
2. Add to User PATH: `C:\Users\YourUsername\.foundry\bin`
3. Restart your terminal

---

## 3. Step 2: Set Up Your Project

### Navigate to Project Root

```bash
cd "C:\Users\aziz_\PycharmProjects\2026\INTELLI_BRIDGE_ANALYTICS\UJAMAA DeFi PlatForm"
```

### Verify Project Structure

Ensure your project has the following structure:

```
UJAMAA DeFi PlatForm/
├── contracts/
│   └── MVP/
│       ├── ULPToken.sol
│       ├── LiquidityPool.sol
│       ├── GuaranteeToken.sol
│       ├── IndustrialGateway.sol
│       ├── JurisdictionCompliance.sol
│       ├── MockEscrow.sol
│       ├── MockFiatRamp.sol
│       ├── MockEUROD.sol
│       └── NavGateway.sol
├── script/
│   └── DeployMVP.s.sol
├── foundry.toml
└── .env (create this in Step 4)
```

---

## 4. Step 3: Install Dependencies

### Install OpenZeppelin Contracts

```bash
forge install OpenZeppelin/openzeppelin-contracts --no-git
```

### Install Forge Standard Library

```bash
forge install foundry-rs/forge-std --no-git
```

### Verify Dependencies

Check that dependencies are installed:

```bash
ls lib/
```

**Expected Output:**
```
openzeppelin-contracts/
forge-std/
```

---

## 5. Step 4: Configure Your Private Key

### Create Environment File

Create a `.env` file in the project root:

```bash
# Create .env file
copy .env.example .env  # If example exists
# OR create manually
```

### Add Private Key

Edit `.env` file and add your private key:

```env
# DEPLOYMENT ENVIRONMENT VARIABLES
# ⚠️ NEVER COMMIT THIS FILE TO GIT! ⚠️

# Your deployer wallet private key (WITH 0x prefix)
PRIVATE_KEY=0x1527497b8bef01f06d78b6c96bf3d47d4f1a7f03be94c13526727a897d9e23e7

# PolygonScan API key (optional, for contract verification)
POLYGONSCAN_API_KEY=YOUR_POLYGONSCAN_API_KEY
```

### ⚠️ Security Warnings

1. **NEVER commit `.env` to Git** - It's already in `.gitignore`
2. **Use a dedicated deployer wallet** - Don't use your main wallet
3. **Keep private keys secure** - Never share them
4. **Testnet only** - This key is for testnet only, not mainnet

### Get Your Private Key from MetaMask

1. Open MetaMask
2. Click the three dots (⋮) next to your account
3. Select "Account Details"
4. Click "Export Private Key"
5. Enter your password
6. Copy the private key (starts with `0x`)

---

## 6. Step 5: Get Test POL Tokens

You need POL tokens on Polygon Amoy testnet to pay for gas fees.

### Get Test POL from Faucet

**Official Polygon Faucet:**
1. Visit: https://faucet.polygon.technology/
2. Connect your MetaMask wallet
3. Select "Amoy" network
4. Request test tokens

**Alternative Faucets:**
- https://www.alchemy.com/faucets/polygon-amoy
- https://thirdweb.com/polygon-amoy-testnet/faucet

### Verify Your Balance

1. Copy your wallet address from MetaMask
2. Visit: https://amoy.polygonscan.com/address/YOUR_ADDRESS
3. Check POL balance (should be > 0.1 POL for deployment)

### Add Polygon Amoy to MetaMask

If not already added:

1. Visit: https://www.polygon.technology/solutions
2. Click "Add Polygon Amoy to MetaMask"
3. Confirm network addition

**Network Details:**
- **Network Name:** Polygon Amoy
- **RPC URL:** https://rpc-amoy.polygon.technology/
- **Chain ID:** 80002
- **Currency Symbol:** POL
- **Block Explorer:** https://amoy.polygonscan.com/

---

## 7. Step 6: Deploy Smart Contracts

### Run Deployment Script

Execute the deployment script:

```bash
# Windows PowerShell
$env:Path += ';C:\Users\aziz_\.foundry\bin'
forge script script/DeployMVP.s.sol:DeployMVP --rpc-url https://rpc-amoy.polygon.technology/ --broadcast -vvvv
```

**Or using bash:**
```bash
export PATH="$PATH:$HOME/.foundry/bin"
forge script script/DeployMVP.s.sol:DeployMVP --rpc-url polygon_amoy --broadcast -vvvv
```

### Deployment Output

Successful deployment will show:

```
========================================
       DEPLOYMENT COMPLETE
========================================
Network: Polygon Amoy (80002)
Deployer: 0xYourDeployerAddress
----------------------------------------
ALL Contract Addresses:
MockEUROD:            0x787C5c0365829ABF88a3D8404E9488d1e307eD43
ULPToken:             0xb6062a6e63a07c3598629a65ed19021445fb3b26
GuaranteeToken:       0x83e20A9516B82f0B1bd0ee57882ef35F9553B469
LiquidityPool:        0x36e27C0b63103863a8a31a6EadEad0a0cDc2cfec
IndustrialGateway:    0x882071de6689eC1716BD7e162Acf50707AC68930
JurisdictionCompliance: 0x4eB4c7F57E62A342aC7F322B87a31a7cd54D453C
MockEscrow:           0x8d446994fcD9906c573500959cDc8A8271a9485F
MockFiatRamp:         0xDC4eFb44fED26593b54cBEEEE9F8b359BAA75A9a
NavGateway:           0x99712f923e3519B4305CEDAd40290428299F29A0
========================================
```

### Save Contract Addresses

**IMPORTANT:** Copy all contract addresses to a safe location. You'll need them for:
- Frontend configuration
- Monitor dashboard
- Contract verification
- Testing

### Deployment Cost

Typical deployment costs:
- **Gas Used:** ~24,000,000 gas
- **Gas Price:** ~30-100 gwei
- **Total Cost:** ~0.7-2.5 POL

---

## 8. Step 7: Verify Deployment

### Check on Block Explorer

Visit each contract on Polygon Amoy block explorer:

```
https://amoy.polygonscan.com/address/CONTRACT_ADDRESS
```

### Verify Contract Interactions

Check that contracts were initialized correctly:

1. **ULPToken:** Check total supply, NAV per share
2. **LiquidityPool:** Check pool families initialized
3. **GuaranteeToken:** Check total supply (should be 0 initially)
4. **IndustrialGateway:** Check registered industrials count

### Test Contract Reads

Using Foundry:

```bash
# Check ULPToken name
cast call 0xb6062a6e63a07c3598629a65ed19021445fb3b26 "name()"

# Check LiquidityPool total value
cast call 0x36e27C0b63103863a8a31a6EadEad0a0cDc2cfec "totalPoolValue()"
```

---

## 9. Step 8: Update Frontend Configuration

### Update Monitor Configuration

Edit `frontend/src/config/monitor.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  ulpToken: '0xb6062a6e63a07c3598629a65ed19021445fb3b26',
  liquidityPool: '0x36e27C0b63103863a8a31a6EadEad0a0cDc2cfec',
  guaranteeToken: '0x83e20A9516B82f0B1bd0ee57882ef35F9553B469',
  industrialGateway: '0x882071de6689eC1716BD7e162Acf50707AC68930',
  jurisdictionCompliance: '0x4eB4c7F57E62A342aC7F322B87a31a7cd54D453C',
  mockEscrow: '0x8d446994fcD9906c573500959cDc8A8271a9485F',
  mockFiatRamp: '0xDC4eFb44fED26593b54cBEEEE9F8b359BAA75A9a',
  navGateway: '0x99712f923e3519B4305CEDAd40290428299F29A0',
  mockEUROD: '0x787C5c0365829ABF88a3D8404E9488d1e307eD43',
} as const;

// Set to false to use live data
export const MONITOR_FEATURES = {
  USE_MOCK_DATA: false,
  DEBUG: true,
  ENABLE_TOASTS: true,
} as const;
```

### Update Contract Test Dashboard

Edit `frontend/src/MVP/pages/ContractTestDashboard.tsx`:

```typescript
export const DEPLOYED_CONTRACTS = [
  {
    name: 'Mock EUROD',
    symbol: 'EUROD',
    address: '0x787C5c0365829ABF88a3D8404E9488d1e307eD43',
    // ... other fields
  },
  // ... other contracts
] as const;
```

### Build and Test Frontend

```bash
cd frontend
npm install
npm run build
npm run dev
```

Visit:
- Monitor Dashboard: http://localhost:5173/monitor
- Contract Test: http://localhost:5173/contract-test

---

## 10. Troubleshooting

### Common Issues

#### "forge: command not found"

**Solution:** Add Foundry to PATH:
```powershell
$env:Path += ';C:\Users\aziz_\.foundry\bin'
```

#### "Private key invalid"

**Solution:** Ensure private key has `0x` prefix:
```env
PRIVATE_KEY=0x1527497b8bef01f06d78b6c96bf3d47d4f1a7f03be94c13526727a897d9e23e7
```

#### "Insufficient funds for gas"

**Solution:** Get more test POL from faucet:
- https://faucet.polygon.technology/

#### "Contract not deployed"

**Solution:** Check deployment output for errors. Common causes:
- Missing dependencies (run `forge install`)
- Invalid Solidity version (check `foundry.toml`)
- Network issues (retry with `--resume` flag)

#### "Address is invalid"

**Solution:** Ensure addresses are 40 hex characters (20 bytes):
```
✅ Correct: 0xb6062a6e63a07c3598629a65ed19021445fb3b26
❌ Wrong: 0x8b0715695C21853838781d4a367B8067360F84A8 (39 chars)
```

### Getting Help

1. Check Foundry documentation: https://book.getfoundry.sh/
2. Check Polygon documentation: https://docs.polygon.technology/
3. Review deployment logs for specific error messages

---

## 11. Deployed Contract Addresses

### Current Deployment (March 29, 2026)

| Contract | Address | Standard |
|----------|---------|----------|
| **MockEUROD** | `0x787C5c0365829ABF88a3D8404E9488d1e307eD43` | ERC-20 |
| **ULPToken** | `0xb6062a6e63a07c3598629a65ed19021445fb3b26` | ERC-3643 |
| **GuaranteeToken** | `0x83e20A9516B82f0B1bd0ee57882ef35F9553B469` | ERC-3643NFT |
| **LiquidityPool** | `0x36e27C0b63103863a8a31a6EadEad0a0cDc2cfec` | Custom |
| **IndustrialGateway** | `0x882071de6689eC1716BD7e162Acf50707AC68930` | Custom |
| **JurisdictionCompliance** | `0x4eB4c7F57E62A342aC7F322B87a31a7cd54D453C` | Custom |
| **MockEscrow** | `0x8d446994fcD9906c573500959cDc8A8271a9485F` | Custom |
| **MockFiatRamp** | `0xDC4eFb44fED26593b54cBEEEE9F8b359BAA75A9a` | Custom |
| **NavGateway** | `0x99712f923e3519B4305CEDAd40290428299F29A0` | Custom |

### Network Information

- **Network:** Polygon Amoy Testnet
- **Chain ID:** 80002
- **RPC URL:** https://rpc-amoy.polygon.technology/
- **Block Explorer:** https://amoy.polygonscan.com/
- **Deployer:** `0xb9a4401B8240f1E45FE45649962F297d56ADB0e3`

### Verify Contracts

All contracts can be verified on Polygon Amoy block explorer:
```
https://amoy.polygonscan.com/address/CONTRACT_ADDRESS
```

---

## Additional Resources

- **Foundry Book:** https://book.getfoundry.sh/
- **Solidity Docs:** https://docs.soliditylang.org/
- **OpenZeppelin Contracts:** https://docs.openzeppelin.com/contracts/
- **Polygon Docs:** https://docs.polygon.technology/
- **Ujamaa Documentation:** `/docs` folder in project root

---

**Last Updated:** March 29, 2026  
**Document Version:** 1.0  
**Maintained By:** Ujamaa DeFi Platform Team
