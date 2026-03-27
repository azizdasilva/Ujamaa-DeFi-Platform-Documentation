# Web3 Architecture Guide: Why Wallet & Web3 Are Frontend-Only

## Understanding the Fundamental Difference Between Web2 and Web3

**Author:** Aziz Da Silva - Lead Architect
**Version:** 1.0
**Date:** March 15, 2026
**Audience:** Developers, Architects, Stakeholders

---

## 📋 Table of Contents

1. [Core Principle: Self-Custody](#core-principle-self-custody)
2. [Why Wallet Must Be Frontend](#why-wallet-must-be-frontend)
3. [Architecture Breakdown](#architecture-breakdown)
4. [Security Comparison](#security-comparison)
5. [What Backend DOES Do](#what-backend-does-do)
6. [What Backend CANNOT Do](#what-backend-cannot-do)
7. [Correct Flow: Ujamaa DeFi Platform](#correct-flow-ujamaa-defi)
8. [Summary Table](#summary-table)
9. [Key Takeaway](#key-takeaway)

---

## 🔑 Core Principle: Self-Custody

### Web2 Architecture (Traditional)

```
┌─────────────┐         ┌─────────────┐
│   User      │  ────►  │   Backend   │
│  (Browser)  │         │   (Server)  │
│             │         │             │
│ ❌ No keys  │         │ ✅ Holds    │
│ ❌ No sign  │         │    keys     │
│             │         │ ✅ Signs    │
└─────────────┘         └─────────────┘
```

**In Web2:**
- Backend holds all credentials
- Backend signs all transactions
- Users trust the server

### Web3 Architecture (Decentralized)

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   User      │  ────►  │   Backend   │  ────►  │  Blockchain │
│  (Wallet)   │         │   (API)     │         │             │
│             │         │             │         │             │
│ ✅ Holds    │         │ ❌ No keys  │         │ ✅ Verifies │
│    keys     │         │ ❌ Can't    │         │    signatures│
│ ✅ Signs    │         │    sign     │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
```

**In Web3:**
- **Users hold their own keys** (self-custody)
- **Users sign transactions** (not the backend)
- **Backend cannot access user funds**

---

## 🎯 Why Wallet Must Be Frontend

### 1. Security - Private Keys Never Leave User's Device

#### ❌ WRONG: Backend Should NEVER Have Private Keys

```python
# backend/services/wallet.py
# 🚨 SECURITY RISK - NEVER DO THIS
private_key = os.getenv("USER_PRIVATE_KEY")
wallet = Account.from_key(private_key)
```

**Why?**
- If backend holds keys → **honeypot for hackers**
- If backend is compromised → **all user funds stolen**
- Single point of failure

#### ✅ CORRECT: User Signs in Their Own Wallet

```typescript
// frontend/src/components/web3/WalletConnection.tsx
import { useAccount } from 'wagmi';

function WalletComponent() {
  const { address, signMessage } = useAccount();
  
  // User controls keys through MetaMask
  // Frontend NEVER sees private keys
  return <div>Connected: {address}</div>;
}
```

**Benefits:**
- ✅ Decentralized risk (each user controls their own keys)
- ✅ No central honeypot for attackers
- ✅ User sovereignty over assets

---

### 2. User Sovereignty - Users Control Their Assets

| Traditional Finance (Web2) | DeFi (Web3) |
|---------------------------|-------------|
| Bank holds your money | You hold your keys |
| Bank signs transactions | You sign transactions |
| Bank can freeze account | Non-custodial (can't freeze) |
| Trust required | Trustless |
| Custodial | Self-custody |

---

### 3. Regulatory Compliance

| Scenario | Backend Holds Keys (Custodial) | Frontend Holds Keys (Non-Custodial) |
|----------|-------------------------------|-------------------------------------|
| **Legal Classification** | Money Service Business (MSB) | Software Provider |
| **Licenses Required** | BitLicense, Money Transmitter | None (typically) |
| **KYC/AML Burden** | Full compliance required | Limited |
| **Liability** | High (custodial) | Low (non-custodial) |
| **Insurance Required** | Yes | No |
| **Audit Requirements** | Annual SOC 2 | Optional |

**Ujamaa DeFi Platform is non-custodial** → Users hold keys → Lower regulatory burden

---

## 🏗️ Architecture Breakdown

### What Happens Where

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Browser)                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  RainbowKit / Wagmi                                      │  │
│  │  • Connects to MetaMask/WalletConnect                    │  │
│  │  • Displays wallet UI                                    │  │
│  │  • Requests signatures from user                         │  │
│  │  • NEVER sees private keys                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              │ User approves in MetaMask        │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Smart Contract Call                                      │  │
│  │  • mint() - Create tokens                                │  │
│  │  • transfer() - Send tokens                              │  │
│  │  • notarize() - Hash notarization                        │  │
│  │  • Signed by USER's wallet                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Broadcasts to blockchain
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND (FastAPI)                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Fraud Detection                                         │  │
│  │  • Validates investment amount                           │  │
│  │  • Checks fraud rules                                    │  │
│  │  • Stores alerts in database                             │  │
│  │  • ❌ CANNOT sign blockchain transactions                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Database (PostgreSQL)                                    │  │
│  │  • User profiles                                         │  │
│  │  • Investment records                                    │  │
│  │  • Fraud alerts                                          │  │
│  │  • ❌ NO private keys stored                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Comparison

### Scenario: Investment Transaction

| Step | Frontend Web3 (Correct) | Backend Web3 (Wrong) |
|------|------------------------|---------------------|
| **1. User clicks "Invest"** | ✅ MetaMask popup appears | ❌ Backend processes silently |
| **2. User reviews tx** | ✅ User sees all details | ❌ User must trust backend |
| **3. User signs** | ✅ User's private key signs | ❌ Backend's private key signs |
| **4. Transaction sent** | ✅ From user's wallet | ❌ From backend wallet |
| **5. Funds movement** | ✅ User → Contract | ❌ Backend → Contract |
| **6. Security risk** | ✅ User controls funds | ❌ Backend controls ALL funds |
| **7. If compromised** | ✅ Only affected user | ❌ ALL user funds stolen |
| **8. Regulatory status** | ✅ Non-custodial | ❌ Custodial (MSB license required) |

---

## 💡 What Backend DOES Do

The backend is **not useless** - it has critical off-chain roles:

### 1. Off-Chain Data Storage

```python
# backend/api/investments.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class InvestmentData(BaseModel):
    wallet: str
    amount: float
    asset_id: str
    tx_hash: str

@router.post("/api/v1/investments")
async def record_investment(investment: InvestmentData):
    """
    Record investment in database (off-chain)
    
    This does NOT move funds - just tracks it for:
    - Portfolio tracking
    - Tax reporting
    - Analytics
    """
    # Store in PostgreSQL
    await db.execute(
        """
        INSERT INTO investments (wallet, amount, asset_id, tx_hash, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        """,
        investment.wallet,
        investment.amount,
        investment.asset_id,
        investment.tx_hash
    )
    
    return {"status": "recorded"}
```

**Purpose:** Track investments off-chain for better UX and analytics

---

### 2. Fraud Detection & Validation

```python
# backend/services/fraud_detection.py
from typing import List, Dict, Any
from enum import Enum

class Severity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class FraudDetectionEngine:
    """
    Validate transaction BEFORE user signs
    Returns warnings/alerts for user to review
    
    Backend CANNOT stop transaction - only warn
    """
    
    RULES = {
        'LARGE_TRANSACTION': {
            'threshold': 50_000,  # USD
            'severity': Severity.HIGH,
            'message': 'Transaction > $50,000 without KYC Level 2'
        },
        'HIGH_VELOCITY': {
            'threshold': 5,  # transactions per hour
            'severity': Severity.MEDIUM,
            'message': 'More than 5 transactions in 1 hour'
        },
    }
    
    async def check_transaction(
        self,
        tx_data: Dict[str, Any],
        user_data: Dict[str, Any]
    ) -> List[Dict]:
        alerts = []
        
        # Check large transaction rule
        if tx_data['amount_usd'] > self.RULES['LARGE_TRANSACTION']['threshold']:
            if user_data.get('kyc_level', 0) < 2:
                alerts.append({
                    'rule': 'LARGE_TRANSACTION',
                    'severity': 'HIGH',
                    'message': self.RULES['LARGE_TRANSACTION']['message']
                })
        
        return alerts
```

**Purpose:** Protect users with off-chain validation before they sign

---

### 3. Indexing & Querying

```python
# backend/api/portfolio.py
from fastapi import APIRouter
from web3 import Web3

router = APIRouter()

@router.get("/api/v1/portfolio/{wallet}")
async def get_portfolio(wallet: str):
    """
    Query blockchain events + database
    Return aggregated portfolio view
    
    This is read-only - cannot modify state
    """
    # Get on-chain data (read-only)
    web3 = Web3(Web3.HTTPProvider(rpc_url))
    token_balance = await token_contract.functions.balanceOf(wallet).call()
    
    # Get off-chain data
    investment_history = await db.fetch_all(
        "SELECT * FROM investments WHERE wallet = $1",
        wallet
    )
    
    # Aggregate
    return {
        'wallet': wallet,
        'token_balance': token_balance,
        'total_invested': sum(inv['amount'] for inv in investment_history),
        'investment_count': len(investment_history),
        'investments': investment_history
    }
```

**Purpose:** Provide rich portfolio data that's expensive to query on-chain

---

### 4. User Experience & Metadata

```python
# backend/api/users.py
from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.get("/api/v1/users/{wallet}/role")
async def get_user_role(wallet: str):
    """
    Return user's role (Investor, Admin, etc.)
    
    Used for UI rendering - NOT for authorization
    On-chain verification happens in smart contracts
    """
    user = await db.get_user(wallet)
    
    if not user:
        # User needs onboarding
        return {
            'exists': False,
            'needs_onboarding': True
        }
    
    return {
        'exists': True,
        'role': user.role,
        'kyc_level': user.kyc_level,
        'jurisdiction': user.jurisdiction
    }
```

**Purpose:** Improve UX with off-chain metadata

---

## 🚫 What Backend CANNOT Do

### 1. Cannot Sign Transactions for Users

```python
# ❌ WRONG - Backend should NEVER do this
@app.post("/api/v1/invest")
async def invest_for_user(wallet: str, amount: int):
    """
    🚨 SECURITY RISK: Backend signing for user
    🚨 CUSTODIAL MODEL: Requires MSB license
    🚨 SINGLE POINT OF FAILURE: All funds at risk
    """
    # 🚨 NEVER DO THIS
    private_key = os.getenv("MASTER_PRIVATE_KEY")
    account = Account.from_key(private_key)
    
    tx = await contract.functions.mint(
        account.address,
        amount
    )
    
    return {"tx_hash": tx.hash}
```

**Why Wrong?**
- ❌ Backend holds private keys (custodial)
- ❌ Users don't control their funds
- ❌ Requires money transmitter license
- ❌ Single point of failure

---

### 2. Cannot Hold User Funds

```python
# ❌ WRONG - Custodial model
@app.post("/api/v1/deposit")
async def deposit_funds(wallet: str, amount: int):
    """
    🚨 REGULATORY RISK: Backend holding funds
    🚨 REQUIRES: BitLicense, Money Transmitter licenses
    """
    # 🚨 NEVER DO THIS
    await backend_wallet.transfer(amount)
```

**Why Wrong?**
- ❌ Custodial model (like a bank)
- ❌ Requires extensive licensing
- ❌ High regulatory burden
- ❌ Insurance requirements

---

### 3. Cannot Access Private Keys

```python
# ❌ WRONG - Keys should never be in backend
# environment variables, database, anywhere
PRIVATE_KEY = "0x1234..."  # 🚨 NEVER DO THIS
MNEMONIC_PHRASE = "witch collapse practice..."  # 🚨 NEVER DO THIS
```

**Why Wrong?**
- ❌ If server is compromised → all keys stolen
- ❌ If logged → keys exposed forever
- ❌ If in environment → accessible via process list

---

## ✅ Correct Flow: Ujamaa DeFi Platform

### Step-by-Step Investment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: User Connects Wallet (Frontend)                        │
│                                                                  │
│  • RainbowKit shows "Connect Wallet" button                    │
│  • User clicks MetaMask                                        │
│  • MetaMask popup: "Connect to Ujamaa DeFi Platform?"                   │
│  • User approves                                               │
│  • Frontend receives: address = "0x1234..."                    │
│  • Backend NEVER sees private key                              │
│  • Backend only knows: user connected                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: User Initiates Investment (Frontend)                   │
│                                                                  │
│  • User enters amount: 5000 USDC                               │
│  • Frontend calls backend: POST /api/v1/fraud/validate         │
│  • Backend checks fraud rules (off-chain)                      │
│  • Backend returns: {"valid": true, "alerts": []}              │
│  • Backend CANNOT stop transaction - only warn                 │
│  • User sees warnings and decides                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: User Signs Transaction (Frontend + MetaMask)           │
│                                                                  │
│  • Frontend calls: wagmi.mint({ args: [address, amount] })     │
│  • MetaMask popup: "Sign Transaction?"                         │
│  • Shows: Contract address, amount, gas fee                    │
│  • User reviews details                                        │
│  • User clicks "Confirm"                                       │
│  • MetaMask signs with USER'S private key                      │
│  • Transaction broadcast to Polygon Amoy                       │
│  • Backend has NO access to signing process                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: Backend Records Transaction (Database)                 │
│                                                                  │
│  • Frontend notifies backend: tx_hash = "0xabc..."             │
│  • Backend verifies tx on-chain (read-only)                    │
│  • Backend stores in PostgreSQL:                               │
│    INSERT INTO investments (wallet, amount, tx_hash)           │
│  • Backend CANNOT modify or reverse transaction                │
│  • Backend CANNOT access user funds                            │
│  • Backend only tracks what happened (off-chain record)        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Summary Table

| Component | Location | Why? | Can Backend Access? |
|-----------|----------|------|---------------------|
| **Wallet Connection** | Frontend | User controls keys | ❌ No |
| **Private Keys** | User's device (MetaMask) | Self-custody | ❌ Never |
| **Transaction Signing** | Frontend (MetaMask) | User approves txs | ❌ No |
| **Transaction Broadcasting** | Frontend (MetaMask) | User-signed | ❌ No |
| **Blockchain Calls** | Frontend (Wagmi) | User-initiated | ❌ No |
| **Fraud Detection** | Backend | Off-chain validation | ✅ Yes (read-only) |
| **Database** | Backend | Off-chain storage | ✅ Yes |
| **User Profiles** | Backend | Off-chain metadata | ✅ Yes |
| **Investment Records** | Backend | Off-chain tracking | ✅ Yes |
| **Smart Contract State** | Blockchain | On-chain truth | ✅ Read-only |

---

## 🎯 Key Takeaway

> ### **"Not your keys, not your crypto"**
>
> In Web3, the frontend is the **user's agent**, not the backend.  
> The backend is a **service provider**, not a custodian.

### The Fundamental Shift

| Aspect | Web2 | Web3 |
|--------|------|------|
| **Trust Model** | Trust backend | Trust code (smart contracts) |
| **Custody** | Backend holds assets | User holds assets |
| **Authorization** | Backend decides | Smart contracts enforce |
| **Frontend Role** | UI for backend | User's sovereign agent |
| **Backend Role** | Trusted intermediary | Service provider |

### UJAMAA DEFI PLATFORM Architecture

UJAMAA DEFI PLATFORM follows the **non-custodial Web3 model** where:

✅ **Users hold their own keys**  
✅ **Users sign their own transactions**  
✅ **Backend cannot access user funds**  
✅ **Backend provides off-chain services only**  
✅ **Smart contracts enforce rules on-chain**  

This is **by design** for:
- 🔐 **Security** - No central honeypot
- 🗽 **Sovereignty** - Users control their assets
- ⚖️ **Compliance** - Non-custodial (lower regulatory burden)
- 🎯 **Trustlessness** - Code enforces rules, not people

---

## 📚 Additional Resources

### Internal Documentation
- [Web3 Configuration Guide](05_SMART_CONTRACT_INTEGRATION_GUIDE.md)
- [Backend Integration Guide](03_BACKEND_INTEGRATION_GUIDE.md)
- [Technology Stack Reference](02_TECHNOLOGY_STACK_REFERENCE.md)

### External Resources
- [Wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/)
- [Ethereum.org - Wallets](https://ethereum.org/en/wallets/)
- [Self-Custody Explained](https://www.coinbase.com/learn/crypto-basics/what-is-self-custody)

---

**Document Version:** 1.0
**Last Updated:** March 18, 2026
**Maintained By:** Development Team
