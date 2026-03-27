# 🚀 Ujamaa DeFi Platform - MetaMask & Testnet Integration Guide

**Version:** 2.0.0-mvp  
**Network:** Polygon Amoy Testnet  
**Chain ID:** 80002  
**Status:** ✅ Production Ready for Testnet

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Network Configuration](#network-configuration)
3. [MetaMask Setup](#metamask-setup)
4. [Web3 Integration](#web3-integration)
5. [Component Usage](#component-usage)
6. [Testing Guide](#testing-guide)
7. [Troubleshooting](#troubleshooting)
8. [File Structure](#file-structure)

---

## 📖 Overview

The Ujamaa DeFi Platform is now fully integrated with MetaMask and configured for the **Polygon Amoy Testnet**. This integration allows users to:

- Connect their MetaMask wallet
- Switch to Polygon Amoy network automatically
- View POL token balances
- Sign messages and transactions
- Interact with smart contracts (when deployed)

**Important:** This is a **TESTNET** deployment. No real money is involved.

---

## 🌐 Network Configuration

### Polygon Amoy Testnet Parameters

| Parameter | Value |
|-----------|-------|
| **Network Name** | Polygon Amoy Testnet |
| **Chain ID** | 80002 (0x13882 in hex) |
| **RPC URL** | https://rpc-amoy.polygon.technology/ |
| **Block Explorer** | https://amoy.polygonscan.com/ |
| **Native Token** | POL |
| **Token Decimals** | 18 |

### Manual Network Setup in MetaMask

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Enter the following:
   - **Network Name:** Polygon Amoy Testnet
   - **RPC URL:** https://rpc-amoy.polygon.technology/
   - **Chain ID:** 80002
   - **Currency Symbol:** POL
   - **Block Explorer:** https://amoy.polygonscan.com/

---

## 🦊 MetaMask Setup

### Step 1: Install MetaMask

**Download:** https://metamask.io/download/

- Available for Chrome, Firefox, Brave, Edge
- Mobile apps for iOS and Android
- **⚠️ Warning:** Only download from official website!

### Step 2: Create a Wallet

1. Click "Create a Wallet"
2. Set a strong password
3. **Securely store your seed phrase** (12-24 words)
4. Never share your seed phrase with anyone!

### Step 3: Add Polygon Amoy Network

The platform will automatically prompt to switch networks when you connect. Or follow manual setup above.

### Step 4: Get Test POL Tokens

**Faucet:** https://faucet.polygon.technology/

1. Copy your MetaMask address
2. Paste into faucet
3. Request test tokens
4. Wait ~15 seconds for confirmation

**Alternative Faucets:**
- https://amoyfaucet.com/
- https://faucet.quicknode.com/polygon/amoy

---

## 🔗 Web3 Integration

### Configuration File

**Location:** `frontend/src/config/web3.ts`

```typescript
export const web3Config = {
  NETWORK: {
    NAME: 'Polygon Amoy Testnet',
    CHAIN_ID: '0x13882',
    CHAIN_ID_DECIMAL: 80002,
    RPC_URL: 'https://rpc-amoy.polygon.technology/',
    BLOCK_EXPLORER: 'https://amoy.polygonscan.com/',
  },
  CONTRACTS: {
    ULP_TOKEN: '0x0000000000000000000000000000000000000000', // TODO: Deploy
    UAT_TOKEN: '0x0000000000000000000000000000000000000000', // TODO: Deploy
    // ... add deployed contract addresses
  },
}
```

### useWallet Hook

**Location:** `frontend/src/MVP/hooks/useWallet.ts`

**Usage:**

```typescript
import { useWallet } from './hooks/useWallet';

function MyComponent() {
  const {
    isConnected,
    address,
    chainId,
    balance,
    connect,
    disconnect,
    switchNetwork,
    signMessage,
    sendTransaction,
  } = useWallet();

  return (
    <div>
      {isConnected ? (
        <p>Connected: {address}</p>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}
```

**Available Methods:**

| Method | Description | Returns |
|--------|-------------|---------|
| `connect()` | Connect MetaMask wallet | Promise<void> |
| `disconnect()` | Disconnect wallet | void |
| `switchNetwork()` | Switch to Polygon Amoy | Promise<void> |
| `signMessage(msg)` | Sign a message | Promise<string> |
| `sendTransaction(tx)` | Send transaction | Promise<string> (tx hash) |
| `refreshBalance()` | Refresh balance | Promise<void> |

---

## 🧩 Component Usage

### WalletConnect Component

**Location:** `frontend/src/MVP/components/WalletConnect.tsx`

**Features:**
- One-click MetaMask connection
- Automatic network switching
- Balance display
- Network status indicator
- Error handling

**Usage:**

```typescript
import WalletConnect from './components/WalletConnect';

function Header() {
  return (
    <header>
      <WalletConnect 
        onConnect={() => console.log('Wallet connected')}
        onDisconnect={() => console.log('Wallet disconnected')}
      />
    </header>
  );
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onConnect` | () => void | - | Callback on wallet connect |
| `onDisconnect` | () => void | - | Callback on wallet disconnect |
| `className` | string | '' | Additional CSS classes |

---

## 🧪 Testing Guide

### 1. Access Testnet Guide

Navigate to: `http://localhost:5173/testnet-guide`

This page provides:
- Complete setup tutorial
- Network configuration details
- Test POL faucet links
- FAQ section

### 2. Test Wallet Connection

1. Click "Connect MetaMask" button
2. Approve connection in MetaMask popup
3. Verify address displays correctly
4. Check POL balance shows

### 3. Test Network Switching

1. If on wrong network, amber "Switch Network" button appears
2. Click to switch to Polygon Amoy
3. MetaMask will prompt for approval
4. Page reloads automatically on success

### 4. Test Transactions

```typescript
// Example transaction
const txHash = await sendTransaction(
  '0xRecipientAddress',
  '0x01', // Value in wei (hex)
  '0x'    // Data (optional)
);
console.log('Transaction sent:', txHash);
```

### 5. Test Message Signing

```typescript
// Example message signing
const signature = await signMessage('Hello, Ujamaa DeFi!');
console.log('Signature:', signature);
```

---

## 🔧 Troubleshooting

### MetaMask Not Detected

**Error:** "MetaMask not installed"

**Solutions:**
1. Install MetaMask from https://metamask.io
2. Refresh the page
3. Check browser console for errors
4. Try a different browser

### Wrong Network

**Error:** "Wrong network. Please switch to Polygon Amoy Testnet."

**Solutions:**
1. Click "Switch Network" button
2. Approve in MetaMask
3. If fails, manually add network (see Network Configuration)

### Transaction Fails

**Error:** "Transaction rejected" or "Insufficient balance"

**Solutions:**
1. Ensure you have test POL for gas fees
2. Check you're on Polygon Amoy network
3. Verify contract addresses are correct
4. Check Polygonscan for transaction details

### Balance Not Showing

**Solutions:**
1. Refresh balance: `refreshBalance()`
2. Disconnect and reconnect wallet
3. Check RPC URL is accessible
4. Verify you're on correct network

### Connection Lost on Refresh

**Expected Behavior:** Wallet should auto-reconnect

**If not:**
1. Check MetaMask is unlocked
2. Ensure site has permission
3. Re-approve connection when prompted

---

## 📁 File Structure

```
frontend/src/
├── config/
│   ├── index.ts
│   └── web3.ts                          # ✅ Web3 configuration
│
├── MVP/
│   ├── components/
│   │   ├── index.ts
│   │   └── WalletConnect.tsx            # ✅ MetaMask connection UI
│   │
│   ├── hooks/
│   │   ├── index.ts                     # ✅ Updated exports
│   │   └── useWallet.ts                 # ✅ Wallet connection hook
│   │
│   └── pages/
│       ├── TestnetGuide.tsx             # ✅ User guide page
│       └── ...
│
└── App.tsx                              # ✅ Routes updated
```

---

## 📝 Contract Deployment Checklist

When ready to deploy smart contracts:

1. **Deploy to Polygon Amoy:**
   ```bash
   npx hardhat run scripts/deploy.ts --network polygonAmoy
   ```

2. **Update Contract Addresses:**
   - Edit `frontend/src/config/web3.ts`
   - Replace placeholder addresses with deployed addresses

3. **Verify on Polygonscan:**
   ```bash
   npx hardhat verify --network polygonAmoy <CONTRACT_ADDRESS>
   ```

4. **Test Integration:**
   - Connect wallet
   - Test each contract function
   - Verify transactions on Polygonscan

---

## 🔐 Security Best Practices

### For Users:
- ✅ Never share seed phrase
- ✅ Only download MetaMask from official site
- ✅ Verify URLs before connecting
- ✅ Use hardware wallet for large amounts (production)
- ✅ Enable MetaMask phishing detection

### For Developers:
- ✅ Validate all user inputs
- ✅ Use environment variables for sensitive data
- ✅ Implement rate limiting
- ✅ Add transaction confirmation modals
- ✅ Log all wallet interactions

---

## 📞 Support & Resources

### Documentation:
- **MetaMask Docs:** https://docs.metamask.io/
- **Polygon Docs:** https://docs.polygon.technology/
- **Ethers.js:** https://docs.ethers.org/

### Community:
- **MetaMask Support:** https://support.metamask.io/
- **Polygon Discord:** https://discord.gg/polygon
- **Ujamaa Support:** [Add support contact]

### Testnet Resources:
- **Faucet:** https://faucet.polygon.technology/
- **Explorer:** https://amoy.polygonscan.com/
- **RPC Status:** https://polygon.status.io/

---

## 🚀 Next Steps

1. **Deploy Smart Contracts** to Polygon Amoy
2. **Update Contract Addresses** in `web3.ts`
3. **Test All Features** with testnet tokens
4. **Security Audit** before mainnet deployment
5. **Mainnet Deployment** (Polygon Chain ID: 137)

---

## ⚠️ Disclaimer

**THIS IS A TESTNET DEPLOYMENT**

- No real money is involved
- All tokens are test tokens with no value
- For testing and development purposes only
- Production deployment will use real stablecoins and bank integrations

---

**Last Updated:** March 24, 2026  
**Version:** 2.0.0-mvp  
**Network:** Polygon Amoy Testnet (80002)

---

**📄 Save this guide for reference during development and testing.**
