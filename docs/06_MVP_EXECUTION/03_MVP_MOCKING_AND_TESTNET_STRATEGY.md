# MVP Mocking and Testnet Strategy

## Ujamaa DeFi Platform - Institutional Architecture

**IMPORTANT:** This document defines the comprehensive mocking strategy and testnet deployment approach for MVP. All mock services are designed with production swap interfaces as specified in SRS v2.0 Section 4.3.

**Related Documents:**
- **SRS v2.0:** `docs/01_SPECIFICATIONS/01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md`
- **MVP Implementation Plan:** `docs/06_MVP_EXECUTION/02_MVP_IMPLEMENTATION_PLAN.md`
- **Frontend Specification:** `docs/06_MVP_EXECUTION/05_MVP_FRONTEND_SPECIFICATION.md` ⭐ **NEW**

**Author:** Aziz Da Silva - Lead Architect
**Version:** 2.0 (Integrated Frontend Specification)
**Date:** March 17, 2026
**Classification:** Internal / Engineering
**Audience:** Development Team, DevOps, Security Auditors, Frontend Developers

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Mocking Philosophy](#2-mocking-philosophy)
3. [Mock Service Architecture](#3-mock-service-architecture)
4. [Testnet Deployment Strategy](#4-testnet-deployment-strategy)
5. [Mock Service Specifications](#5-mock-service-specifications)
6. [Frontend Integration for Mock Services](#6-frontend-integration-for-mock-services) ⭐ **NEW**
7. [Production Swap Procedure](#7-production-swap-procedure)
8. [Security Considerations](#8-security-considerations)
9. [Testing Strategy](#9-testing-strategy)
10. [Monitoring and Observability](#10-monitoring-and-observability)
11. [Rollback Procedures](#11-rollback-procedures)
12. [Appendix A: Mock Service API Reference](#appendix-a-mock-service-api-reference)

---

## 1. Executive Summary

### 1.1 Purpose

MVP operates on **testnet only** (Polygon Amoy) with **mock services** simulating real-world integrations (banks, GDIZ, fiat ramps). This document defines:

- ✅ Mock service architecture and interfaces
- ✅ Testnet deployment procedures
- ✅ Production swap methodology
- ✅ Security controls for testnet
- ✅ Testing and validation strategies
- ✅ **NEW:** Frontend integration for mock services (UI components, disclaimers)

### 1.1.1 Frontend Specification Integration

**NEW in v2.0:** This document now integrates with the **MVP Frontend Specification** (`05_MVP_FRONTEND_SPECIFICATION.md`).

**Frontend Specification References:**
- **Section 3.1:** Color palette for mock/testnet indicators
- **Section 6.1:** MVP Banner component
- **Section 6.2:** Testnet Notice component
- **Section 5.4:** Subscribe Flow (mock funding sources)
- **Section 10:** Security requirements for testnet UI

**For Frontend Developers:**
- Use `MVPBanner` and `TestnetNotice` components on all MVP pages
- Display mock data with clear visual indicators (badge, color coding)
- Implement mock/production toggle in settings (for demos)
- Show disclaimers per Frontend Spec Section 3.1

### 1.2 Key Principles

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| **Production Quality** | Mock services use same code quality as production | Same linting, testing, documentation standards |
| **Interface Compatibility** | Mock and real services share identical interfaces | Abstract base classes, TypeScript interfaces |
| **Clear Labeling** | All mock components clearly identified | `Mock` prefix, `MVP_TESTNET` flags, UI banners |
| **Easy Swap** | Mock → Production swap requires minimal changes | Dependency injection, feature flags, config-driven |
| **No Real Value** | Testnet handles zero real money/value | Test tokens only, clear disclaimers |

### 1.3 Mock Service Inventory

| Mock Service | Production Counterpart | SRS v2.0 Reference |
|--------------|------------------------|-------------------|
| **MockEscrow.sol** | BIIC/MCB Escrow Integration | Section 4.3, 5.12 |
| **MockFiatRamp.sol** | Real Fiat On/Off Ramp | Section 4.3 |
| **MockBankService** | BIIC/MCB Bank API | Section 4.3 |
| **MockGDIZService** | GDIZ Industrial Gateway | Section 5.3 |
| **Test Ondo EUROD (EUROD)** | Real Ondo EUROD (EUROD) (Ondo Finance) | Section 4.3 |
| **Mock KYB** | Real KYB Verification | Section 7.3 |

---

## 2. Mocking Philosophy

### 2.1 What We Mock vs What We Don't

**✅ MOCK (Testnet Simulation):**
- Bank escrow accounts (no real money movement)
- Fiat on/off ramps (no real currency exchange)
- Industrial Gateway/GDIZ integration (no real production data)
- KYB verification (simulated approval flow)
- Wire transfers (simulated transactions)

**❌ DON'T MOCK (Real Implementation):**
- Smart contract logic (uLPToken, LiquidityPool)
- Yield calculation mathematics
- ERC-3643 compliance enforcement
- Identity Registry (ONCHAINID integration)
- Cryptographic operations (hashing, signing)

### 2.2 Mock Fidelity Levels

| Fidelity Level | Description | Use Case |
|----------------|-------------|----------|
| **Level 1: Stub** | Hardcoded responses, no state | Unit tests, rapid prototyping |
| **Level 2: Mock** | Simulated logic, in-memory state | MVP testnet, demos |
| **Level 3: Simulation** | Real logic, test data | Integration testing, UAT |
| **Level 4: Production** | Real logic, real data | Mainnet deployment |

**MVP uses Level 2 (Mock) for:**
- Bank services
- Fiat ramps
- GDIZ integration

**MVP uses Level 3 (Simulation) for:**
- Yield calculation (real math, simulated principal)
- NAV calculation (real formula, testnet pool value)

### 2.3 Mock Data Guidelines

**Data Characteristics:**
- ✅ Realistic values (not random)
- ✅ Consistent with real-world scenarios
- ✅ Clearly labeled as test data
- ✅ Reproducible for debugging
- ✅ No PII or sensitive information

**Example Mock Data:**
```typescript
// GOOD: Realistic test data
const mockInvestor = {
  id: 'INV-MVP-001',
  name: 'Logic Capital (Test)',
  investment: 10_000_000, // 10M test Ondo EUROD (EUROD)
  kycStatus: 'APPROVED_MVP',
};

// BAD: Unrealistic or confusing
const badMockInvestor = {
  id: '123',
  name: 'Test User',
  investment: 999999999, // Confusing large number
  kycStatus: 'YES',
};
```

---

## 3. Mock Service Architecture

### 3.1 Architectural Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                     SERVICE INTERFACE LAYER                      │
│                                                                  │
│  ┌──────────────────┐     ┌──────────────────┐                 │
│  │  IBankService    │     │  IGDIZService    │  (Abstract)     │
│  └────────┬─────────┘     └────────┬─────────┘                 │
│           │                        │                            │
│           ├────────────────────────┤                            │
│           │                        │                            │
│  ┌────────▼─────────┐     ┌────────▼─────────┐                 │
│  │ MockBankService  │     │ MockGDIZService  │  (MVP)        │
│  └──────────────────┘     └──────────────────┘                 │
│                                                                  │
│  ┌──────────────────┐     ┌──────────────────┐                 │
│  │ BIICBankService  │     │ GDIZGateway      │  (Production)   │
│  └──────────────────┘     └──────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Dependency Injection

**Python Example:**
```python
# backend/services/MVP/service_registry.py
from abc import ABC, abstractmethod
from typing import Protocol

class BankServiceProtocol(Protocol):
    """Abstract interface for bank services."""
    
    def create_escrow_account(self, investor_id: str) -> str:
        ...
    
    def initiate_wire_transfer(self, from_account: str, to_account: str, amount: int) -> str:
        ...
    
    def get_balance(self, account_id: str) -> int:
        ...

class MockBankService:
    """MVP mock bank implementation."""
    
    def __init__(self):
        self.accounts = {}
        self.transactions = []
    
    def create_escrow_account(self, investor_id: str) -> str:
        account_id = f"MOCK-ESCROW-{investor_id}"
        self.accounts[account_id] = {'balance': 0, 'investor_id': investor_id}
        return account_id
    
    def initiate_wire_transfer(self, from_account: str, to_account: str, amount: int) -> str:
        # Simulate wire transfer (NO REAL MONEY)
        tx_id = f"MOCK-WIRE-{len(self.transactions)}"
        self.transactions.append({
            'id': tx_id,
            'from': from_account,
            'to': to_account,
            'amount': amount,
            'status': 'COMPLETED_MVP',
            'timestamp': datetime.utcnow().isoformat()
        })
        return tx_id
    
    def get_balance(self, account_id: str) -> int:
        return self.accounts.get(account_id, {}).get('balance', 0)

# Production implementation (same interface)
class BIICBankService:
    """Production BIIC bank integration."""
    
    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
    
    def create_escrow_account(self, investor_id: str) -> str:
        # Real BIIC API call
        response = self.session.post(
            f"{self.base_url}/api/v1/escrow/create",
            headers={'Authorization': f'Bearer {self.api_key}'},
            json={'investor_id': investor_id}
        )
        return response.json()['account_id']
    
    # ... other methods with real API calls

# Service registry (configured via environment)
def get_bank_service() -> BankServiceProtocol:
    """Factory function to get appropriate bank service."""
    if settings.MVP_MODE and settings.MOCK_BANK:
        return MockBankService()
    else:
        return BIICBankService(
            api_key=settings.BIIC_API_KEY,
            base_url=settings.BIIC_BASE_URL
        )
```

**TypeScript Example:**
```typescript
// frontend/src/MVP/services/bankService.ts

// Abstract interface
export interface IBankService {
  createEscrowAccount(investorId: string): Promise<string>;
  initiateWireTransfer(from: string, to: string, amount: bigint): Promise<string>;
  getBalance(accountId: string): Promise<bigint>;
}

// MVP mock implementation
export class MockBankService implements IBankService {
  private accounts: Map<string, { balance: bigint; investorId: string }> = new Map();
  private transactions: Array<any> = [];

  async createEscrowAccount(investorId: string): Promise<string> {
    const accountId = `MOCK-ESCROW-${investorId}`;
    this.accounts.set(accountId, { balance: 0n, investorId });
    return accountId;
  }

  async initiateWireTransfer(from: string, to: string, amount: bigint): Promise<string> {
    const txId = `MOCK-WIRE-${this.transactions.length}`;
    this.transactions.push({
      id: txId,
      from,
      to,
      amount: amount.toString(),
      status: 'COMPLETED_MVP',
      timestamp: new Date().toISOString(),
    });
    return txId;
  }

  async getBalance(accountId: string): Promise<bigint> {
    return this.accounts.get(accountId)?.balance || 0n;
  }
}

// Production implementation
export class BIICBankService implements IBankService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async createEscrowAccount(investorId: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/v1/escrow/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ investor_id: investorId }),
    });
    const data = await response.json();
    return data.account_id;
  }

  // ... other methods
}

// Service factory
export function createBankService(): IBankService {
  if (import.meta.env.VITE_MVP_MODE === 'true' && import.meta.env.VITE_MOCK_BANK === 'true') {
    return new MockBankService();
  } else {
    return new BIICBankService(
      import.meta.env.VITE_BIIC_API_KEY!,
      import.meta.env.VITE_BIIC_BASE_URL!
    );
  }
}
```

### 3.3 Configuration Management

**Environment-Based Configuration:**
```python
# backend/config/settings.py
from pydantic import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # MVP Mode
    MVP_MODE: bool = True
    MVP_TESTNET: bool = True
    
    # Mock Service Flags
    MOCK_BANK: bool = True
    MOCK_ESCROW: bool = True
    MOCK_GDIZ: bool = True
    MOCK_FIAT_RAMP: bool = True
    MOCK_KYB: bool = True
    
    # Testnet Configuration
    NETWORK_NAME: str = "polygon-amoy"
    CHAIN_ID: int = 80002
    RPC_URL: str = "https://rpc-amoy.polygon.technology/"
    
    # Contract Addresses (testnet)
    ULPTOKEN_ADDRESS: Optional[str] = None
    LIQUIDITY_POOL_ADDRESS: Optional[str] = None
    MOCK_ESCROW_ADDRESS: Optional[str] = None
    MOCK_FIAT_RAMP_ADDRESS: Optional[str] = None
    
    # Production Configuration (NOT USED in MVP)
    BIIC_API_KEY: Optional[str] = None
    BIIC_BASE_URL: Optional[str] = None
    GDIZ_API_KEY: Optional[str] = None
    
    # Disclaimers
    MVP_DISCLAIMER: str = (
        "🚀 MVP: Institutional Architecture - Testnet Release\n"
        "This is a testnet deployment. No real funds are handled."
    )
    
    class Config:
        env_file = ".env.MVP"
        case_sensitive = True

settings = Settings()
```

---

## 4. Testnet Deployment Strategy

### 4.1 Network Selection

**Primary Network: Polygon Amoy Testnet**

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Network Name** | Polygon Amoy | Official Polygon testnet |
| **Chain ID** | 80002 | Standard testnet identifier |
| **RPC URL** | `https://rpc-amoy.polygon.technology/` | Official RPC endpoint |
| **Block Explorer** | `https://amoy.polygonscan.com/` | Transaction verification |
| **Native Token** | MATIC (test) | Gas fees (free from faucet) |
| **Stablecoin** | Ondo EUROD (EUROD) (test) | Mock euro-backed stablecoin |

**Why Polygon Amoy?**
- ✅ Free testnet MATIC (faucet available)
- ✅ EVM-compatible (same tooling as mainnet)
- ✅ Fast block times (~2 seconds)
- ✅ Low/no gas fees
- ✅ Supported by major wallets (MetaMask, Rainbow)
- ✅ Production-like environment

### 4.2 Testnet Token Strategy

**Test Tokens Required:**
1. **MATIC (test)** - For gas fees
2. **Ondo EUROD (EUROD) (test)** - For deposits/redemptions
3. **uLP (test)** - Yield-bearing pool token

**Acquisition Methods:**
```markdown
## MATIC (test)
- **Faucet:** https://faucet.polygon.technology/
- **Amount:** 100 MATIC per day per address
- **Cost:** FREE

## Ondo EUROD (EUROD) (test)
- **Method 1:** MockFiatRamp mint (unlimited for testing)
- **Method 2:** Testnet swap (if available)
- **Cost:** FREE (testnet only)

## uLP (test)
- **Method:** Deposit test Ondo EUROD (EUROD) into uLPToken contract
- **Rate:** 1:1 at inception (NAV = 1.00)
- **Cost:** Gas only (test MATIC)
```

### 4.3 Deployment Checklist

**Pre-Deployment:**
- [ ] Smart contracts compiled (Solidity 0.8.20+)
- [ ] All tests passing (>90% coverage)
- [ ] Security review completed (Slither, manual)
- [ ] Environment variables configured
- [ ] Testnet MATIC acquired (gas fees)
- [ ] Deployment script tested on local fork

**Deployment:**
- [ ] uLPToken deployed to Amoy
- [ ] LiquidityPool deployed to Amoy
- [ ] MockEscrow deployed to Amoy
- [ ] MockFiatRamp deployed to Amoy
- [ ] Contract addresses saved to config
- [ ] Contracts verified on Polygonscan

**Post-Deployment:**
- [ ] Smoke tests executed
- [ ] Frontend configured with addresses
- [ ] Backend services restarted
- [ ] Monitoring dashboards configured
- [ ] Demo accounts funded
- [ ] Team notified of deployment

### 4.4 Deployment Script

**ApeWorX Deployment Script:**
```python
# scripts/MVP/deploy_MVP.py
from ape import project, accounts, Contract
import json
from datetime import datetime

def main():
    print('🚀 Starting MVP Deployment on Polygon Amoy...')
    
    # Get deployer account
    deployer = accounts.load('deployer')  # Or use accounts[0] for local
    print(f'Deploying with account: {deployer.address}')
    
    # Check balance
    balance = deployer.balance
    print(f'Account balance: {balance / 10**18:.4f} MATIC')
    
    if balance == 0:
        raise Exception('❌ Insufficient MATIC. Get testnet MATIC from faucet.')
    
    # Deploy Mock EUROD (testnet only)
    print('\n🪙 Deploying Mock EUROD...')
    mock_eurc = deployer.deploy(project.MockERC20, "Mock EUROD", "EUROD", 18)
    print(f'✅ Mock EUROD deployed to: {mock_eurc.address}')
    
    # Deploy uLPToken
    print('\n📝 Deploying uLPToken...')
    ulp_token = deployer.deploy(project.uLPToken)
    print(f'✅ uLPToken deployed to: {ulp_token.address}')
    
    # Deploy LiquidityPool
    print('\n🏊 Deploying LiquidityPool...')
    liquidity_pool = deployer.deploy(project.LiquidityPool, ulp_token.address)
    print(f'✅ LiquidityPool deployed to: {liquidity_pool.address}')
    
    # Deploy MockEscrow
    print('\n🏦 Deploying MockEscrow...')
    mock_escrow = deployer.deploy(project.MockEscrow)
    print(f'✅ MockEscrow deployed to: {mock_escrow.address}')
    
    # Deploy MockFiatRamp
    print('\n💱 Deploying MockFiatRamp...')
    mock_fiat_ramp = deployer.deploy(project.MockFiatRamp)
    print(f'✅ MockFiatRamp deployed to: {mock_fiat_ramp.address}')
    
    # Save addresses
    deployment_info = {
        'network': 'polygon-amoy',
        'chain_id': 80002,
        'deployer': deployer.address,
        'timestamp': datetime.utcnow().isoformat(),
        'contracts': {
            'MockEURC': mock_eurc.address,
            'uLPToken': ulp_token.address,
            'LiquidityPool': liquidity_pool.address,
            'MockEscrow': mock_escrow.address,
            'MockFiatRamp': mock_fiat_ramp.address,
        },
    }
    
    deployment_path = 'deployments/MVP-amoy.json'
    with open(deployment_path, 'w') as f:
        json.dump(deployment_info, f, indent=2)
    print(f'\n💾 Deployment info saved to: {deployment_path}')
    
    print('\n✅ MVP Deployment Complete!')
    print(f'📊 View on Polygonscan: https://amoy.polygonscan.com/address/{ulp_token.address}')
    
    return deployment_info

if __name__ == '__main__':
    main()
```

---

## 5. Mock Service Specifications

### 5.1 MockEscrow.sol

**Purpose:** Simulates bank escrow accounts for investor funds.

**Interface:**
```solidity
// contracts/MVP/MockEscrow.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockEscrow
 * @dev Simulates bank escrow accounts for MVP testnet.
 *      Interface designed for easy swap with real BIIC/MCB integration.
 */
contract MockEscrow {
    // Events
    event EscrowAccountCreated(string indexed accountId, address indexed investor, uint256 timestamp);
    event WireTransferSimulated(string indexed txId, string fromAccount, string toAccount, uint256 amount);
    event BalanceUpdated(string indexed accountId, uint256 newBalance);
    
    // State
    mapping(string => EscrowAccount) private accounts;
    mapping(address => string) private investorToAccount;
    string[] private transactionHistory;
    
    struct EscrowAccount {
        string accountId;
        address investor;
        uint256 balance;
        bool isActive;
        uint256 createdAt;
    }
    
    // Functions
    function createEscrowAccount(address investor) external returns (string memory);
    function simulateWireTransfer(string memory fromAccount, string memory toAccount, uint256 amount) external returns (string memory);
    function getBalance(string memory accountId) external view returns (uint256);
    function getTransactionHistory() external view returns (string[] memory);
    
    // MVP Safety
    function IS_MVP_TESTNET() external pure returns (bool) {
        return true;
    }
}
```

**Key Features:**
- ✅ In-memory account balances
- ✅ Simulated wire transfers
- ✅ Transaction history tracking
- ✅ Clear MVP labeling
- ✅ No real value movement

### 5.2 MockFiatRamp.sol

**Purpose:** Simulates fiat on/off ramp (EUR ↔ Ondo EUROD (EUROD) conversion).

**Interface:**
```solidity
// contracts/MVP/MockFiatRamp.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockFiatRamp
 * @dev Simulates fiat on/off ramp for MVP testnet.
 *      Mints test Ondo EUROD (EUROD) for demo purposes.
 */
contract MockFiatRamp {
    // Events
    event FiatOnRamp(address indexed user, uint256 eurcAmount, string mockWireId);
    event FiatOffRamp(address indexed user, uint256 eurcAmount, string mockWireId);
    
    // Mock Ondo EUROD (EUROD) (testnet only)
    IERC20 public testEURC;
    
    // Functions
    function onRamp(uint256 eurcAmount) external returns (string memory);
    function offRamp(uint256 eurcAmount) external returns (string memory);
    function mintTestEURC(address recipient, uint256 amount) external; // Admin only
    
    // MVP Safety
    function IS_MVP_TESTNET() external pure returns (bool) {
        return true;
    }
}
```

**Usage:**
```typescript
// Frontend: Mint test Ondo EUROD (EUROD) for demo
async function getTestEURC(amount: bigint) {
  const contract = getMockFiatRampContract();
  const tx = await contract.mintTestEURC(userAddress, amount);
  await tx.wait();
  console.log(`✅ Minted ${amount} test Ondo EUROD (EUROD)`);
}
```

### 5.3 MockBankService (Backend)

**Purpose:** Simulates bank API for backend services.

**Implementation:**
```python
# backend/services/MVP/mock_bank.py
from typing import Dict, List
from datetime import datetime
import uuid

class MockBankService:
    """
    MVP Mock Bank Service
    
    Simulates BIIC/MCB bank operations for testnet.
    Interface compatible with production BIICBankService.
    """
    
    def __init__(self, initial_balance: int = 10_000_000_000_000):
        """
        Initialize mock bank.
        
        Args:
            initial_balance: Starting balance for demo accounts (10M test Ondo EUROD (EUROD))
        """
        self.accounts: Dict[str, dict] = {}
        self.transactions: List[dict] = []
        self.initial_balance = initial_balance
    
    def create_escrow_account(self, investor_id: str) -> str:
        """Create mock escrow account."""
        account_id = f"MOCK-ESCROW-{investor_id}-{uuid.uuid4().hex[:8]}"
        self.accounts[account_id] = {
            'account_id': account_id,
            'investor_id': investor_id,
            'balance': self.initial_balance,
            'currency': 'EURC_TEST',
            'status': 'ACTIVE_MVP',
            'created_at': datetime.utcnow().isoformat(),
            'bank_name': 'Mock Bank (MVP Testnet)',
        }
        return account_id
    
    def initiate_wire_transfer(
        self,
        from_account: str,
        to_account: str,
        amount: int
    ) -> str:
        """
        Simulate wire transfer (NO REAL MONEY).
        
        Args:
            from_account: Source account ID
            to_account: Destination account ID
            amount: Amount in smallest unit (18 decimals)
        
        Returns:
            Mock wire transfer ID
        """
        if from_account not in self.accounts:
            raise ValueError(f"Account not found: {from_account}")
        
        # Deduct from source
        self.accounts[from_account]['balance'] -= amount
        
        # Add to destination (if exists)
        if to_account in self.accounts:
            self.accounts[to_account]['balance'] += amount
        
        # Record transaction
        tx_id = f"MOCK-WIRE-{uuid.uuid4().hex[:12]}"
        self.transactions.append({
            'tx_id': tx_id,
            'from_account': from_account,
            'to_account': to_account,
            'amount': amount,
            'status': 'COMPLETED_MVP',
            'timestamp': datetime.utcnow().isoformat(),
            'description': 'Mock wire transfer (testnet only)',
        })
        
        return tx_id
    
    def get_balance(self, account_id: str) -> int:
        """Get account balance."""
        if account_id not in self.accounts:
            raise ValueError(f"Account not found: {account_id}")
        return self.accounts[account_id]['balance']
    
    def get_transactions(self, account_id: str) -> List[dict]:
        """Get transaction history for account."""
        return [
            tx for tx in self.transactions
            if tx['from_account'] == account_id or tx['to_account'] == account_id
        ]
    
    def get_account_details(self, account_id: str) -> dict:
        """Get full account details."""
        if account_id not in self.accounts:
            raise ValueError(f"Account not found: {account_id}")
        return self.accounts[account_id].copy()
```

### 5.4 MockGDIZService (Backend)

**Purpose:** Simulates GDIZ industrial gateway integration.

**Implementation:**
```python
# backend/services/MVP/mock_gdiz.py
from typing import List, Dict
from datetime import datetime
import random

class MockGDIZService:
    """
    MVP Mock GDIZ Service
    
    Simulates GDIZ industrial gateway for testnet.
    Interface compatible with production GDIZGateway.
    """
    
    def __init__(self):
        """Initialize mock GDIZ with sample industrial data."""
        self.industrials = self._create_sample_industrials()
        self.productions = []
    
    def _create_sample_industrials(self) -> List[dict]:
        """Create sample industrial partners for demo."""
        return [
            {
                'id': 'GDIZ-MVP-001',
                'name': 'GDIZ Cotton Factory (Test)',
                'industry': 'TEXTILE',
                'location': 'Lomé, Togo (Mock)',
                'capacity': '500 tons/month',
                'rating': 'A',
            },
            {
                'id': 'GDIZ-MVP-002',
                'name': 'GDIZ Soy Processing (Test)',
                'industry': 'AGRICULTURE',
                'location': 'Cotonou, Benin (Mock)',
                'capacity': '1000 tons/month',
                'rating': 'A-',
            },
            {
                'id': 'GDIZ-MVP-003',
                'name': 'GDIZ Coffee Roasters (Test)',
                'industry': 'FOOD_PROCESSING',
                'location': 'Abidjan, Côte d\'Ivoire (Mock)',
                'capacity': '200 tons/month',
                'rating': 'BBB+',
            },
        ]
    
    def get_industrial_list(self) -> List[dict]:
        """Get list of available industrials."""
        return self.industrials
    
    def get_industrial_details(self, industrial_id: str) -> dict:
        """Get detailed industrial information."""
        for ind in self.industrials:
            if ind['id'] == industrial_id:
                return ind.copy()
        raise ValueError(f"Industrial not found: {industrial_id}")
    
    def simulate_production_data(self, industrial_id: str) -> dict:
        """
        Simulate production data from industrial.
        
        Returns realistic mock data for demo.
        """
        industrial = self.get_industrial_details(industrial_id)
        
        # Generate realistic production metrics
        base_capacity = int(industrial['capacity'].split()[0])
        utilization = random.uniform(0.75, 0.95)
        actual_production = base_capacity * utilization
        
        return {
            'industrial_id': industrial_id,
            'timestamp': datetime.utcnow().isoformat(),
            'production_output': actual_production,
            'unit': 'tons',
            'period': 'month',
            'quality_score': random.uniform(0.85, 0.98),
            'efficiency': utilization,
            'status': 'OPERATIONAL_MVP',
            'notes': 'Mock production data (testnet only)',
        }
    
    def simulate_repayment(
        self,
        financing_id: str,
        principal: int,
        annual_rate: float,
        days_elapsed: int
    ) -> dict:
        """
        Simulate industrial repayment with interest.
        
        Args:
            financing_id: Financing identifier
            principal: Principal amount (18 decimals)
            annual_rate: Annual interest rate (e.g., 0.12 for 12%)
            days_elapsed: Days since financing started
        
        Returns:
            Repayment details
        """
        # Calculate interest (real math, simulated data)
        daily_rate = annual_rate / 365
        interest = int(principal * daily_rate * days_elapsed)
        total_repayment = principal + interest
        
        return {
            'financing_id': financing_id,
            'principal': principal,
            'interest': interest,
            'total_repayment': total_repayment,
            'days_elapsed': days_elapsed,
            'effective_apr': annual_rate,
            'status': 'REPAID_MVP',
            'timestamp': datetime.utcnow().isoformat(),
            'note': 'Mock repayment (testnet only)',
        }
```

---

## 6. Frontend Integration for Mock Services ⭐ **NEW**

**Reference:** Frontend Specification Section 5 (Page Specifications), Section 6 (Component Library)

### 6.1 Mock Data Display Components

#### 6.1.1 MVP Banner (Required on All Pages)

**Component:** `MVPBanner.tsx`
**Location:** Top of every MVP page
**Purpose:** Clear testnet disclaimer

```tsx
import { MVPBanner } from '@/MVP/components/MVPBanner';

function DashboardPage() {
  return (
    <>
      <MVPBanner />
      {/* Rest of page content */}
    </>
  );
}
```

**Design:**
- Gradient background (blue to purple)
- Sticky positioning (always visible)
- White text, bold font
- Height: 48px

---

#### 6.1.2 Testnet Notice Modal

**Component:** `TestnetNotice.tsx`
**Trigger:** First-time visitors, settings menu
**Purpose:** Detailed explanation of MVP testnet

**Content:**
```markdown
## 🚀 MVP Testnet Notice

### What is MVP?
- Testnet deployment on Polygon Amoy
- Mock bank services (no real money)
- Simulated escrow accounts
- Real yield calculation math

### What is NOT MVP?
- ❌ Production-ready platform
- ❌ Real bank integration
- ❌ Regulatory approved
- ❌ Mainnet deployed

### For Production
Requires: Mauritius FSC license, BIIC/MCB partnership
```

---

#### 6.1.3 Mock Data Badge

**Component:** `MockDataBadge.tsx`
**Usage:** Next to all mock data displays

```tsx
import { Badge } from '@/components/ui/Badge';

function AccountBalance({ balance }) {
  return (
    <div>
      <span>{formatCurrency(balance)}</span>
      <Badge variant="info" className="ml-2">
        🧪 MOCK
      </Badge>
    </div>
  );
}
```

**Design:**
- Blue background (info variant)
- Test tube emoji (🧪) or "MOCK" text
- Small size
- Tooltip on hover: "This is simulated data for testnet"

---

### 6.2 Mock Funding Source Display

**Reference:** Frontend Spec Section 5.4 (Subscribe Flow - Step 3)

**Component:** `MockFundingSource.tsx`

```tsx
function FundingSourceSelection() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Select Funding Source</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup>
          <RadioItem value="Ondo EUROD (EUROD)-wallet">
            <div className="flex items-center justify-between">
              <div>
                <h4>Ondo EUROD (EUROD) Wallet</h4>
                <p className="text-sm text-gray-500">
                  Balance: €2,450,000 🧪 MOCK
                </p>
              </div>
              <Badge variant="info">Testnet</Badge>
            </div>
          </RadioItem>

          <RadioItem value="bank-escrow">
            <div className="flex items-center justify-between">
              <div>
                <h4>Bank Escrow (BIIC)</h4>
                <p className="text-sm text-gray-500">
                  Simulated wire transfer
                </p>
              </div>
              <Badge variant="info">Mock</Badge>
            </div>
          </RadioItem>
        </RadioGroup>

        <Alert variant="info" className="mt-4">
          <AlertIcon />
          <AlertTitle>Testnet Only</AlertTitle>
          <AlertDescription>
            These are simulated funding sources for demonstration.
            No real money is transferred in MVP.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
```

---

### 6.3 Transaction History with Mock Indicators

**Component:** `MockTransactionList.tsx`

```tsx
function TransactionHistory() {
  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => api.getTransactions(),
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Hash</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell>
              <TransactionTypeIcon type={tx.type} />
              {tx.type}
            </TableCell>
            <TableCell>
              {formatCurrency(tx.amount)}
              {tx.isMock && (
                <Badge variant="info" className="ml-2">
                  MOCK
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <StatusBadge status={tx.status} />
            </TableCell>
            <TableCell>
              <BlockExplorerLink hash={tx.hash} />
              <Badge variant="outline" className="ml-2">
                Testnet
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

### 6.4 Mock/Production Toggle (Demo Mode)

**Component:** `MockProductionToggle.tsx`
**Location:** Settings page, developer tools
**Purpose:** Switch between mock and simulated production data

```tsx
function MockProductionToggle() {
  const [isMockMode, setIsMockMode] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Source</CardTitle>
      </CardHeader>
      <CardContent>
        <Switch
          checked={isMockMode}
          onCheckedChange={setIsMockMode}
        />
        <Label>
          {isMockMode ? '🧪 Mock Data (Testnet)' : '🏦 Production Data'}
        </Label>

        {isMockMode && (
          <Alert variant="info" className="mt-2">
            <AlertDescription>
              Showing simulated data for demonstration.
              Switch to Production for real data.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
```

---

### 6.5 Visual Design for Mock Indicators

**Reference:** Frontend Spec Section 3.1 (Color Palette)

| Element | Color | Usage |
|---------|-------|-------|
| Mock Badge | Blue (info-500) | All mock data indicators |
| Testnet Badge | Purple (primary-500) | Network indicators |
| Warning Border | Yellow (warning-500) | Mock funding sources |
| Info Alert | Blue (info-100 bg) | Testnet disclaimers |

**CSS Classes:**
```css
/* Mock data indicator */
.mock-indicator {
  @apply bg-info-100 text-info-800 dark:bg-info-900 dark:text-info-200;
  @apply px-2 py-1 rounded text-xs font-medium;
}

/* Testnet banner */
.testnet-banner {
  @apply bg-gradient-to-r from-blue-600 to-purple-600;
  @apply text-white text-center py-3 px-4 font-semibold;
  @apply sticky top-0 z-50 shadow-lg;
}

/* Mock data card border */
.mock-data-card {
  @apply border-warning-500 border-dashed border-2;
}
```

---

### 6.6 Disclaimer Placement Guide

**Required Disclaimers by Page:**

| Page | Disclaimer Location | Component |
|------|---------------------|-----------|
| **Dashboard** | Below KPI cards | `TestnetNotice` |
| **Pool Marketplace** | Below pool cards | Inline text |
| **Pool Detail** | Below statistics | Inline text |
| **Subscribe Flow** | Step 3 (Funding) | `Alert` component |
| **Portfolio** | Below holdings table | Inline text |
| **Compliance** | Below KYB status | Inline text |

**Standard Disclaimer Text:**
```
🧪 This is a testnet deployment on Polygon Amoy. No real funds are handled.
Mainnet deployment pending regulatory approval.
```

---

### 6.7 Accessibility for Mock Indicators

**Reference:** Frontend Spec Section 8 (Accessibility Requirements)

**Requirements:**
- ✅ Mock badges have sufficient color contrast (4.5:1)
- ✅ Screen readers announce "Mock" or "Testnet"
- ✅ Tooltips provide additional context
- ✅ Keyboard accessible (focusable, dismissible)

**Example:**
```tsx
<Badge
  variant="info"
  role="status"
  aria-label="Mock data for testnet"
>
  🧪 MOCK
  <span className="sr-only">
    This is simulated data for testnet demonstration
  </span>
</Badge>
```

---

### 6.8 Frontend Mock Service Integration

**API Client Configuration:**

```typescript
// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add mock indicator to responses
api.interceptors.response.use((response) => {
  if (import.meta.env.VITE_MVP_MODE === 'true') {
    response.headers['X-Mock-Mode'] = 'true';
  }
  return response;
});

export default api;
```

**React Query Hook:**

```typescript
// src/hooks/useMockData.ts
import { useQuery } from '@tanstack/react-query';

export function useMockData<T>(
  queryKey: string[],
  queryFn: () => Promise<T>
) {
  const isMockMode = import.meta.env.VITE_MVP_MODE === 'true';

  return useQuery({
    queryKey: [...queryKey, isMockMode],
    queryFn,
    meta: {
      isMock: isMockMode,
    },
  });
}

// Usage
const { data, meta } = useMockData(['balance'], fetchBalance);
console.log('Is mock data:', meta?.isMock);
```

---

## 7. Production Swap Procedure

### 7.1 Swap Readiness Checklist

**Before swapping mock → production:**
- [ ] Legal entity established (Mauritius CIS Manager)
- [ ] Bank partnership signed (BIIC/MCB)
- [ ] Regulatory approval obtained (FSC Mauritius)
- [ ] Compliance framework implemented
- [ ] Security audits completed
- [ ] Production environment ready
- [ ] Mainnet deployment approved
- [ ] Insurance coverage in place
- [ ] **NEW:** Frontend mock indicators removed/disabled
- [ ] **NEW:** Disclaimers updated for production
- [ ] **NEW:** Testnet banners disabled

### 7.2 Frontend Swap Steps

**Step 1: Update Feature Flags**
```typescript
// frontend/src/config/production.ts
export const PRODUCTION_CONFIG = {
  IS_MVP: false,
  SHOW_TESTNET_BANNER: false,
  SHOW_MOCK_INDICATORS: false,
  NETWORK: {
    name: 'Polygon Mainnet',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com/',
  },
};
```

**Step 2: Disable Mock Components**
```tsx
// In all pages, wrap mock components:
{config.IS_MVP && <MVPBanner />}
{config.IS_MVP && <MockDataBadge />}
```

**Step 3: Update API Endpoints**
```typescript
// frontend/src/lib/api.ts
const baseURL = config.IS_MVP
  ? config.MOCK_API_URL
  : config.PRODUCTION_API_URL;
```

**Step 4: Rebuild and Deploy**
```bash
# Frontend
npm run build
vercel --prod

# Verify production
npm run preview
```

---

## 8. Security Considerations

### 8.1 Testnet Security

**Despite being testnet, maintain security:**
- ✅ Access controls on all endpoints
- ✅ Rate limiting (prevent abuse)
- ✅ Input validation (prevent injection)
- ✅ Audit logging (track all actions)
- ✅ No PII in mock data
- ✅ **NEW:** Frontend input validation for mock data
- ✅ **NEW:** XSS protection for mock indicators

### 8.2 Mock Service Boundaries

**Clear separation from production:**
- ✅ Separate databases (test vs prod)
- ✅ Separate API keys
- ✅ Separate deployment environments
- ✅ Feature flags prevent cross-contamination
- ✅ **NEW:** Separate frontend builds (testnet vs production)

### 8.3 Disclaimer Requirements

**Every MVP page must display:**
```
🚀 MVP: Institutional Architecture - Testnet Release

This is a testnet deployment on Polygon Amoy.
No real funds are handled.
Mainnet deployment pending regulatory approval.

For demonstration and testing purposes only.
```

**Frontend Implementation:**
- `MVPBanner` component (sticky top)
- `TestnetNotice` modal (first-time visitors)
- `MockDataBadge` (all mock data)
- Inline disclaimers (funding sources, transactions)

---

## 9. Testing Strategy

### 9.1 Mock Service Tests

**Unit Tests:**
```python
# tests/MVP/test_mock_bank.py
def test_create_escrow_account():
    bank = MockBankService()
    account_id = bank.create_escrow_account("INV-001")
    assert account_id.startswith("MOCK-ESCROW")
    assert bank.get_balance(account_id) > 0

def test_simulate_wire_transfer():
    bank = MockBankService()
    acc1 = bank.create_escrow_account("INV-001")
    acc2 = bank.create_escrow_account("INV-002")

    initial_balance = bank.get_balance(acc1)
    tx_id = bank.initiate_wire_transfer(acc1, acc2, 1000)

    assert tx_id.startswith("MOCK-WIRE")
    assert bank.get_balance(acc1) == initial_balance - 1000
    assert bank.get_balance(acc2) == initial_balance + 1000
```

### 9.2 Frontend Mock Component Tests

**Component Tests (Vitest + Testing Library):**
```tsx
// tests/unit/components/MVPBanner.test.tsx
import { render, screen } from '@testing-library/react';
import { MVPBanner } from '@/MVP/components/MVPBanner';

describe('MVPBanner', () => {
  it('renders testnet disclaimer', () => {
    render(<MVPBanner />);
    expect(screen.getByText(/testnet/i)).toBeInTheDocument();
    expect(screen.getByText(/no real money/i)).toBeInTheDocument();
  });

  it('has correct styling', () => {
    const { container } = render(<MVPBanner />);
    expect(container.firstChild).toHaveClass('bg-gradient-to-r');
  });
});

// tests/unit/components/MockDataBadge.test.tsx
import { render, screen } from '@testing-library/react';
import { MockDataBadge } from '@/MVP/components/MockDataBadge';

describe('MockDataBadge', () => {
  it('displays mock indicator', () => {
    render(<MockDataBadge />);
    expect(screen.getByText('MOCK')).toBeInTheDocument();
  });

  it('has accessible label', () => {
    render(<MockDataBadge />);
    expect(screen.getByRole('status')).toHaveAccessibleName(
      'Mock data for testnet'
    );
  });
});
```

### 9.3 E2E Tests (Playwright)

**Mock Data Display Test:**
```tsx
// tests/e2e/mock-indicators.spec.ts
import { test, expect } from '@playwright/test';

test('mock indicators visible on all pages', async ({ page }) => {
  // Dashboard
  await page.goto('/dashboard');
  await expect(page.getByText('🧪 MOCK')).toBeVisible();
  await expect(page.getByText('Testnet')).toBeVisible();

  // Pool Marketplace
  await page.goto('/pools');
  await expect(page.getByText('Mock Data')).toBeVisible();

  // Subscribe Flow
  await page.goto('/pools/pool-1/subscribe');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByText('Simulated')).toBeVisible();
});

test('disclaimers present on all pages', async ({ page }) => {
  const pages = ['/dashboard', '/pools', '/portfolio', '/compliance'];

  for (const path of pages) {
    await page.goto(path);
    await expect(
      page.getByText(/testnet/i)
    ).toBeVisible();
  }
});
```

---

## 8. Production Swap Procedure

### 8.1 Swap Readiness Checklist

**Before swapping mock → production:**
- [ ] Legal entity established (Mauritius CIS Manager)
- [ ] Bank partnership signed (BIIC/MCB)
- [ ] Regulatory approval obtained (FSC Mauritius)
- [ ] Compliance framework implemented
- [ ] Security audits completed
- [ ] Production environment ready
- [ ] Mainnet deployment approved
- [ ] Insurance coverage in place
- [ ] **NEW:** Frontend mock indicators removed/disabled
- [ ] **NEW:** Disclaimers updated for production
- [ ] **NEW:** Testnet banners disabled

### 8.2 Frontend Swap Steps

**Step 1: Update Configuration**
```python
# backend/config/production_settings.py
MVP_MODE = False  # Disable MVP mode
MOCK_BANK = False  # Use real bank
MOCK_ESCROW = False  # Use real escrow
MOCK_GDIZ = False  # Use real GDIZ
NETWORK_NAME = "polygon-mainnet"
CHAIN_ID = 137
```

**Step 2: Deploy Production Contracts**
```bash
# Deploy to mainnet (NOT testnet)
ape run scripts.production.deploy_production --network ethereum:polygon
```

**Step 3: Update Environment Variables**
```bash
# .env.production
MVP_MODE=false
BIIC_API_KEY=<real-key>
BIIC_BASE_URL=https://api.biic.mu/
GDIZ_API_KEY=<real-key>
```

**Step 4: Restart Services**
```bash
# Backend
systemctl restart ujamaa-backend

# Frontend
npm run build && pm2 restart ujamaa-frontend
```

**Step 5: Verify Production**
```bash
# Run production smoke tests
pytest tests/production/smoke_tests.py
```

### 6.3 Rollback Plan

**If production swap fails:**
1. Revert configuration to MVP mode
2. Restart services
3. Investigate issues on testnet
4. Re-attempt swap after fixes

---

## 7. Security Considerations

### 7.1 Testnet Security

**Despite being testnet, maintain security:**
- ✅ Access controls on all endpoints
- ✅ Rate limiting (prevent abuse)
- ✅ Input validation (prevent injection)
- ✅ Audit logging (track all actions)
- ✅ No PII in mock data

### 7.2 Mock Service Boundaries

**Clear separation from production:**
- ✅ Separate databases (test vs prod)
- ✅ Separate API keys
- ✅ Separate deployment environments
- ✅ Feature flags prevent cross-contamination

### 7.3 Disclaimer Requirements

**Every MVP page must display:**
```
🚀 MVP: Institutional Architecture - Testnet Release

This is a testnet deployment on Polygon Amoy.
No real funds are handled.
Mainnet deployment pending regulatory approval.

For demonstration and testing purposes only.
```

---

## 8. Testing Strategy

### 8.1 Mock Service Tests

**Unit Tests:**
```python
# tests/MVP/test_mock_bank.py
def test_create_escrow_account():
    bank = MockBankService()
    account_id = bank.create_escrow_account("INV-001")
    assert account_id.startswith("MOCK-ESCROW")
    assert bank.get_balance(account_id) > 0

def test_simulate_wire_transfer():
    bank = MockBankService()
    acc1 = bank.create_escrow_account("INV-001")
    acc2 = bank.create_escrow_account("INV-002")
    
    initial_balance = bank.get_balance(acc1)
    tx_id = bank.initiate_wire_transfer(acc1, acc2, 1000)
    
    assert tx_id.startswith("MOCK-WIRE")
    assert bank.get_balance(acc1) == initial_balance - 1000
    assert bank.get_balance(acc2) == initial_balance + 1000
```

### 8.2 Integration Tests

**End-to-End Flow:**
```python
# tests/MVP/test_investment_flow.py
def test_full_investment_flow():
    # 1. Create escrow
    account = mock_bank.create_escrow_account("LOGIC-CAPITAL")
    
    # 2. Deposit Ondo EUROD (EUROD)
    ulp_token.deposit(10_000_000 * 10**18)
    
    # 3. Receive uLP
    assert ulp_token.balance_of(user) == 10_000_000 * 10**18
    
    # 4. Simulate yield
    liquidity_pool.add_yield(1_000_000 * 10**18)
    
    # 5. Check NAV increased
    nav = ulp_token.get_value_per_share()
    assert nav > 1.00 * 10**18
    
    # 6. Redeem
    ulp_token.redeem(10_000_000 * 10**18)
    
    # 7. Verify received principal + yield
    final_balance = mock_bank.get_balance(account)
    assert final_balance > 10_000_000 * 10**18
```

---

## 9. Monitoring and Observability

### 9.1 MVP Dashboards

**Grafana Dashboard Panels:**
- Ujamaa Pool Token (uLP) Supply
- NAV Per Share (real-time)
- Pool TVL
- Mock Bank Balances
- Transaction Volume
- Active Users

### 9.2 Alerting

**Alerts (Testnet Only):**
- ⚠️ Mock balance below threshold
- ⚠️ Contract interaction failures
- ⚠️ Unusual transaction patterns
- ℹ️ Daily deployment summary

---

## 10. Rollback Procedures

### 10.1 Smart Contract Rollback

**If contract bug found:**
1. Pause contract (if pause function exists)
2. Deploy fixed version to new address
3. Update frontend/backend config
4. Notify users of new address
5. Document incident

### 10.2 Backend Rollback

**If backend issue:**
```bash
# Revert to previous version
git checkout <previous-commit>
docker-compose restart backend
```

---

## Appendix A: Mock Service API Reference

### A.1 MockBank Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/MVP/bank/create-account` | POST | Create mock escrow |
| `/api/MVP/bank/wire-transfer` | POST | Simulate wire |
| `/api/MVP/bank/balance` | GET | Get balance |
| `/api/MVP/bank/transactions` | GET | Get history |

### A.2 Response Examples

```json
{
  "account_id": "MOCK-ESCROW-INV-001-abc123",
  "balance": "10000000000000000000000000",
  "currency": "EURC_TEST",
  "status": "ACTIVE_MVP",
  "disclaimer": "This is a mock account for testnet only. No real funds."
}
```

---

**Document End**

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 17, 2026 | Aziz Da Silva | Initial mocking and testnet strategy |
| **2.0** | **March 17, 2026** | **Aziz Da Silva** | **Integrated Frontend Specification v1.0** |

### Changes in v2.0:

**New Section 6: Frontend Integration for Mock Services**
- 6.1: Mock Data Display Components (Banner, Modal, Badge)
- 6.2: Mock Funding Source Display
- 6.3: Transaction History with Mock Indicators
- 6.4: Mock/Production Toggle
- 6.5: Visual Design for Mock Indicators
- 6.6: Disclaimer Placement Guide
- 6.7: Accessibility for Mock Indicators
- 6.8: Frontend Mock Service Integration

**Updated Sections:**
- Section 1: Added Frontend Specification integration
- Section 7: Added frontend swap steps
- Section 8: Added frontend security considerations
- Section 9: Added frontend mock component tests

**Frontend Specification References:**
- Section 3.1: Color palette for mock/testnet indicators
- Section 6.1: MVP Banner component
- Section 6.2: Testnet Notice component
- Section 5.4: Subscribe Flow (mock funding sources)
- Section 8: Accessibility requirements
- Section 10: Security requirements

---

**Next Review:** Week 4 of MVP development
**Owner:** Technical Lead

**Related Documents:**
- `01_MVP_SPECIFICATION.md` - MVP specification
- `02_MVP_IMPLEMENTATION_PLAN.md` - Implementation plan
- `05_MVP_FRONTEND_SPECIFICATION.md` - ⭐ **Frontend Specification v1.0**
- `docs/01_SPECIFICATIONS/01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` - SRS v2.0


