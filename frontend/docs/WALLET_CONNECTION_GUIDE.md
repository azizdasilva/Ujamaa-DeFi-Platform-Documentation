# Wallet Connection Guide - UJAMAA DeFi Frontend

**Document Version:** 1.0  
**Date:** March 25, 2026  
**Network:** Polygon Amoy Testnet (Chain ID: 80002)  
**Wallet:** MetaMask (recommended) or WalletConnect-compatible wallets  

---

## Quick Start

### 1. Install MetaMask

**Download:** https://metamask.io/download/

**Supported Browsers:**
- ✅ Chrome/Brave (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari (iOS/macOS)

---

## 2. Connect Wallet to Frontend

### Option A: Using WalletConnect Component (Recommended)

The frontend provides a ready-to-use `WalletConnect` component:

```tsx
// Example: Add to Navigation.tsx or Header
import WalletConnect from './MVP/components/WalletConnect';

function Navigation() {
  return (
    <nav>
      {/* Other nav items */}
      <WalletConnect 
        onConnect={() => console.log('Wallet connected!')}
        onDisconnect={() => console.log('Wallet disconnected')}
      />
    </nav>
  );
}
```

### Option B: Using useWallet Hook Directly

```tsx
import { useWallet } from './MVP/hooks/useWallet';

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
  } = useWallet();

  return (
    <div>
      {!isConnected ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {address}</p>
          <p>Balance: {balance} POL</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
```

---

## 3. Step-by-Step Connection Process

### Step 1: Navigate to Platform

```
URL: http://localhost:5173 (development)
     https://your-domain.com (production)
```

### Step 2: Click "Connect MetaMask" Button

Located in the navigation bar (top-right corner).

### Step 3: MetaMask Popup

1. MetaMask will open automatically
2. Select your account
3. Click "Connect"

### Step 4: Switch to Polygon Amoy

If not already on Polygon Amoy:

1. MetaMask will show "Switch Network" prompt
2. Click "Switch Network" or "Add Network"
3. Network will be added automatically:
   - **Network Name:** Polygon Amoy Testnet
   - **Chain ID:** 80002 (0x13882)
   - **RPC URL:** https://rpc-amoy.polygon.technology/
   - **Block Explorer:** https://amoy.polygonscan.com/
   - **Native Token:** POL

### Step 5: Get Test POL (Required for Transactions)

**Faucet:** https://faucet.polygon.technology/

1. Connect your MetaMask wallet
2. Request test POL tokens
3. Wait ~15 seconds for confirmation
4. Check balance in MetaMask

---

## 4. Wallet Features

### Available Methods

```typescript
interface UseWalletReturn {
  // State
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  isConnecting: boolean;
  error: string | null;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (to: string, value: string, data?: string) => Promise<string>;
  refreshBalance: () => Promise<void>;
}
```

### Example: Sign Message

```tsx
const { signMessage, address } = useWallet();

const handleSign = async () => {
  try {
    const signature = await signMessage('Hello UJAMAA DeFi!');
    console.log('Signature:', signature);
    console.log('Signed by:', address);
  } catch (error) {
    console.error('Signing failed:', error);
  }
};
```

### Example: Send Transaction

```tsx
const { sendTransaction, address } = useWallet();

const handleSend = async () => {
  try {
    const txHash = await sendTransaction(
      '0xRecipientAddress',
      '1000000000000000000', // 1 POL in wei
      '0x' // Optional data
    );
    console.log('Transaction sent:', txHash);
    
    // Wait for confirmation
    const receipt = await window.ethereum.request({
      method: 'eth_waitForTransactionReceipt',
      params: [txHash],
    });
    console.log('Confirmed:', receipt);
  } catch (error) {
    console.error('Transaction failed:', error);
  }
};
```

---

## 5. Network Configuration

### Manual Network Setup (if auto-switch fails)

Add Polygon Amoy manually to MetaMask:

| Field | Value |
|-------|-------|
| **Network Name** | Polygon Amoy Testnet |
| **New RPC URL** | `https://rpc-amoy.polygon.technology/` |
| **Chain ID** | `80002` |
| **Currency Symbol** | `POL` |
| **Block Explorer URL** | `https://amoy.polygonscan.com/` |

### Config File Location

```
frontend/src/config/web3.ts
```

```typescript
export const web3Config = {
  NETWORK: {
    NAME: 'Polygon Amoy Testnet',
    CHAIN_ID: '0x13882',
    CHAIN_ID_DECIMAL: 80002,
    RPC_URL: 'https://rpc-amoy.polygon.technology/',
    BLOCK_EXPLORER: 'https://amoy.polygonscan.com/',
    NATIVE_TOKEN: {
      SYMBOL: 'POL',
      NAME: 'Polygon',
      DECIMALS: 18,
    },
  },
  // ... more config
};
```

---

## 6. Component Files

### WalletConnect Component

**Location:** `frontend/src/MVP/components/WalletConnect.tsx`

**Features:**
- ✅ Connect/Disconnect button
- ✅ Network status indicator
- ✅ Balance display
- ✅ Auto network switching
- ✅ Error handling with MetaMask install link
- ✅ Formatted address display (0x1234...5678)

**Props:**
```typescript
interface WalletConnectProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  className?: string;
}
```

### useWallet Hook

**Location:** `frontend/src/MVP/hooks/useWallet.ts`

**Features:**
- ✅ MetaMask connection management
- ✅ Automatic network switching
- ✅ Balance fetching
- ✅ Account change listeners
- ✅ Network change listeners
- ✅ Message signing
- ✅ Transaction sending

---

## 7. Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `MetaMask not installed` | User doesn't have MetaMask | Show install link: https://metamask.io/download/ |
| `Wrong network` | User on wrong chain | Call `switchNetwork()` method |
| `User rejected` | User declined prompt | Ask user to try again |
| `Insufficient balance` | No POL for gas | Direct to faucet: https://faucet.polygon.technology/ |

### Error Display Example

```tsx
const { error, connect } = useWallet();

{error && (
  <div className="error-banner">
    <p>{error}</p>
    {!isMetaMaskInstalled && (
      <a href="https://metamask.io/download/" target="_blank">
        Install MetaMask
      </a>
    )}
  </div>
)}
```

---

## 8. Best Practices

### 1. Always Check Network

```tsx
const isCorrectNetwork = chainId === web3Config.NETWORK.CHAIN_ID_DECIMAL;

if (!isCorrectNetwork) {
  return <button onClick={switchNetwork}>Switch to Polygon Amoy</button>;
}
```

### 2. Handle Disconnection

```tsx
useEffect(() => {
  if (!isConnected) {
    // Clear sensitive data
    setFormData({});
    // Redirect to home
    navigate('/');
  }
}, [isConnected]);
```

### 3. Show Loading States

```tsx
{isConnecting ? (
  <button disabled>
    <Spinner /> Connecting...
  </button>
) : (
  <button onClick={connect}>Connect Wallet</button>
)}
```

### 4. Refresh Balance After Transactions

```tsx
const handleTransaction = async () => {
  await sendTransaction(to, value, data);
  await refreshBalance(); // Update balance display
};
```

---

## 9. Testing Checklist

### Pre-Deployment

- [ ] MetaMask detected on page load
- [ ] Connect button triggers MetaMask popup
- [ ] Network switches to Polygon Amoy automatically
- [ ] Balance displays correctly (in POL, 4 decimals)
- [ ] Address formats correctly (0x1234...5678)
- [ ] Disconnect clears all wallet state
- [ ] Account changes update UI (MetaMask account switch)
- [ ] Network changes reload page (MetaMask best practice)
- [ ] Error messages show for failed connections
- [ ] Faucet link works for test POL

### User Flow Testing

1. **First-time user:**
   - No MetaMask → Show install link
   - MetaMask installed → Connect flow
   
2. **Returning user:**
   - Auto-connect on page load
   - Show connected state immediately

3. **Wrong network:**
   - Show "Switch Network" button
   - Auto-prompt network switch

4. **No POL:**
   - Show faucet link prominently
   - Disable transaction buttons

---

## 10. Integration Examples

### Add to Existing Navigation

```tsx
// Navigation.tsx
import WalletConnect from './MVP/components/WalletConnect';

function Navigation() {
  return (
    <nav className="navbar">
      <Logo />
      <MenuItems />
      <WalletConnect className="ml-4" />
    </nav>
  );
}
```

### Protected Route (Requires Wallet)

```tsx
import { useWallet } from './MVP/hooks/useWallet';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isConnected, isCorrectNetwork } = useWallet();

  if (!isConnected || !isCorrectNetwork) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Usage
<Route
  path="/investor/portfolio"
  element={
    <ProtectedRoute>
      <InvestorPortfolio />
    </ProtectedRoute>
  }
/>
```

### Transaction Button

```tsx
function InvestButton({ amount }) {
  const { isConnected, switchNetwork, sendTransaction } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInvest = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    setIsProcessing(true);
    try {
      const txHash = await sendTransaction(
        CONTRACT_ADDRESS,
        amount,
        encodeFunctionData('invest', [amount])
      );
      await waitForConfirmation(txHash);
      alert('Investment successful!');
    } catch (error) {
      alert('Transaction failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleInvest}
      disabled={isProcessing || !isConnected}
      className="btn-primary"
    >
      {isProcessing ? 'Processing...' : isConnected ? 'Invest' : 'Connect Wallet'}
    </button>
  );
}
```

---

## 11. File Structure

```
frontend/src/
├── config/
│   └── web3.ts                    # Network & contract configuration
├── MVP/
│   ├── components/
│   │   └── WalletConnect.tsx      # Reusable wallet button component
│   ├── hooks/
│   │   └── useWallet.ts           # Wallet connection hook
│   └── utils/
│       └── MVPConfig.ts           # MVP-specific config
└── App.tsx                        # Main app (add WalletConnect here)
```

---

## 12. Production Considerations

### Multi-Wallet Support

Currently only MetaMask is supported. For production, consider:

```bash
npm install @web3-react/core @web3-react/injected-connector @walletconnect/ethereum-provider
```

**Supported Wallets:**
- MetaMask
- WalletConnect (Mobile wallets: Trust Wallet, Rainbow, etc.)
- Coinbase Wallet
- Ledger (via WalletConnect)

### SIWE Authentication

For backend authentication (SRS v2.1 Section 1.2.1):

```tsx
import { useWallet } from './MVP/hooks/useWallet';

const handleSIWELogin = async () => {
  const { address, signMessage } = useWallet();
  
  // 1. Get nonce from backend
  const { nonce } = await fetch('/api/auth/nonce', {
    method: 'POST',
    body: JSON.stringify({ wallet: address }),
  }).then(res => res.json());
  
  // 2. Create SIWE message
  const message = `Sign in to UJAMAA DeFi\n\nNonce: ${nonce}`;
  
  // 3. Sign with wallet
  const signature = await signMessage(message);
  
  // 4. Send to backend
  const { token } = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ wallet: address, signature, nonce }),
  }).then(res => res.json());
  
  // 5. Store JWT token
  localStorage.setItem('access_token', token);
};
```

---

## 13. Troubleshooting

### Wallet Not Connecting

1. Check console for errors
2. Ensure MetaMask is unlocked
3. Clear browser cache
4. Try incognito mode

### Network Switch Fails

1. Manually add Polygon Amoy to MetaMask
2. Check RPC URL is accessible
3. Try alternative RPC: `https://rpc-amoy.polygon.technology/`

### Balance Not Showing

1. Check if on correct network (Chain ID: 80002)
2. Verify RPC connection
3. Refresh page

### Transaction Stuck

1. Check Polygon Amoy explorer: https://amoy.polygonscan.com/
2. Increase gas price in MetaMask settings
3. Wait for network congestion to clear

---

## 14. References

- **MetaMask Docs:** https://docs.metamask.io/
- **Polygon Amoy Docs:** https://docs.polygon.technology/amoy/
- **EIP-1193 (Provider API):** https://eips.ethereum.org/EIPS/eip-1193
- **SIWE (Sign-In with Ethereum):** https://login.xyz/
- **SRS v2.1 Section 1.2.1:** Authentication Specification

---

## 15. Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│  UJAMAA Wallet Connection - Quick Reference        │
├─────────────────────────────────────────────────────┤
│  Network:    Polygon Amoy Testnet                  │
│  Chain ID:   80002 (0x13882)                       │
│  RPC URL:    https://rpc-amoy.polygon.technology/  │
│  Explorer:   https://amoy.polygonscan.com/         │
│  Token:      POL (18 decimals)                     │
├─────────────────────────────────────────────────────┤
│  Faucet:     https://faucet.polygon.technology/    │
│  MetaMask:   https://metamask.io/download/         │
├─────────────────────────────────────────────────────┤
│  Component:  <WalletConnect />                     │
│  Hook:       useWallet()                           │
│  Config:     src/config/web3.ts                    │
└─────────────────────────────────────────────────────┘
```

---

**Last Updated:** March 25, 2026  
**Maintained By:** UJAMAA DeFi Platform Development Team  
**License:** MIT
