# MVP Fund Flow Specification

## uLPToken, MockEscrow & BIIC/MCB Simulation

**Author:** Aziz Da Silva - Lead Architect
**Version:** 1.0
**Date:** March 17, 2026
**Classification:** Internal / Engineering
**Audience:** Smart Contract Developers, Backend Engineers, Frontend Developers

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [uLPToken.sol Specification](#2-uLPToken-sol-specification)
3. [MockEscrow.sol Specification](#3-mockescrow-sol-specification)
4. [Fund Flow Simulation](#4-fund-flow-simulation)
5. [BIIC/MCB Production Swap](#5-biicmcb-production-swap)
6. [Testing Guide](#6-testing-guide)
7. [Security Considerations](#7-security-considerations)

---

## 1. Executive Summary

### 1.1 Purpose

This document specifies how MVP handles:
- **uLPToken.sol** - Yield-bearing LP token smart contract
- **MockEscrow.sol** - Simulated bank escrow for testnet
- **Fund Flow Simulation** - BIIC/MCB bank integration mock

### 1.2 Key Components

| Component | Type | Purpose | Status |
|-----------|------|---------|--------|
| **uLPToken.sol** | Smart Contract | Yield-bearing ERC-3643 token | ✅ Specified |
| **MockEscrow.sol** | Smart Contract | Simulated escrow accounts | ✅ Specified |
| **MockBankService** | Backend Service | Bank API simulation | ✅ Specified |
| **BIICBankService** | Backend Service | Production bank integration | 📅 Future |

### 1.3 Document Relationship

```
┌─────────────────────────────────────────────────────────┐
│         MVP FUND FLOW SPECIFICATION                    │
│              (This Document)                             │
│                                                          │
│  Detailed specification for:                             │
│  • uLPToken (yield-bearing token)                        │
│  • MockEscrow (bank simulation)                          │
│  • Fund flow (deposit → invest → yield → redeem)         │
└─────────────────────────────────────────────────────────┘
         │                        │
         │ references             │ references
         ▼                        ▼
┌──────────────────┐    ┌────────────────────────┐
│ uLPToken.sol     │    │ MockEscrow.sol         │
│ (Smart Contract) │    │ (Smart Contract)       │
│                  │    │                        │
│ • Yield-bearing  │    │ • Escrow accounts      │
│ • ERC-3643       │    │ • Wire simulation      │
│ • NAV tracking   │    │ • Balance tracking     │
└──────────────────┘    └────────────────────────┘
```

---

## 2. uLPToken.sol Specification

### 2.1 Overview

**File:** `contracts/MVP/uLPToken.sol`

**Purpose:** ERC-3643 compliant yield-bearing token representing ownership in liquidity pool.

**Token Standard:** ERC-3643 (T-REX protocol for permissioned tokens)

**Pool Family Support:** Each uLPToken is associated with a specific Pool Family (POOL_INDUSTRIE, POOL_AGRICULTURE, etc.)

### 2.2 Token Mechanics

#### Value-Accrual Model

Unlike traditional tokens where balance increases, uLP uses **value-accrual**:

```
┌─────────────────────────────────────────────────────────┐
│              VALUE-ACCRUAL MODEL                         │
│                                                          │
│  Example: Pool Industrie                                 │
│  Initial State:                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Investor Balance: 10,000,000 uLP-INDUSTRIE       │   │
│  │ NAV per uLP:     €1.00                           │   │
│  │ Total Value:     €10,000,000                     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  After 1 Year (10% yield):                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Investor Balance: 10,000,000 uLP-INDUSTRIE       │   │
│  │            (UNCHANGED!)                          │   │
│  │ NAV per uLP:     €1.10 (+10%)                    │   │
│  │ Total Value:     €11,000,000 (+10%)              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Key Benefit:                                            │
│  • No need to claim/restake rewards                     │
│  • Yield automatically accrues                          │
│  • Tax-efficient (accrual, not distribution)            │
│  • Pool Family specific (uLP-INDUSTRIE ≠ uLP-AGRI)      │
└─────────────────────────────────────────────────────────┘
```

#### Pool Families (per SRS v2.0 Section 1.2)

**Four Pool Families supported:**

| Pool Family | Token Symbol | Asset Classes | Target Yield |
|-------------|--------------|---------------|--------------|
| **POOL_INDUSTRIE** | uLP-INDUSTRIE | Manufacturing, factories, production (GDIZ) | 10-12% |
| **POOL_AGRICULTURE** | uLP-AGRI | Coffee, cocoa, cotton, cashews, food crops | 12-15% |
| **POOL_TRADE_FINANCE** | uLP-TRADE | Invoice tokenization, receivables pools | 8-10% |
| **POOL_RENEWABLE_ENERGY** | uLP-ENERGY | Solar, wind, hydroelectric projects | 9-11% |

**Important:** Each pool family has its own separate uLPToken contract:
- `ULPTokenIndustrie.sol` - For Pool Industrie
- `ULPTokenAgriculture.sol` - For Pool Agriculture
- `ULPTokenTradeFinance.sol` - For Pool Trade Finance
- `ULPTokenRenewableEnergy.sol` - For Pool Renewable Energy

#### NAV Calculation

```solidity
// Simplified NAV calculation (per pool family)
function getValuePerShare() external view returns (uint256) {
    uint256 totalPoolValue = liquidityPool.getTotalValue();
    uint256 totalSupply = this.totalSupply();
    
    if (totalSupply == 0) {
        return 1e18; // Initial NAV: 1.0 (18 decimals)
    }
    
    return (totalPoolValue * 1e18) / totalSupply;
}

function getValue(address account) external view returns (uint256) {
    uint256 balance = this.balanceOf(account);
    uint256 navPerShare = this.getValuePerShare();
    
    return (balance * navPerShare) / 1e18;
}
```

### 2.3 Smart Contract Interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@tokeny/erc3643/contracts/ERC3643.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title uLPToken
 * @notice Yield-bearing ERC-3643 token for liquidity pool ownership
 * @dev Value-accrual model: balance constant, NAV increases
 */
contract uLPToken is ERC3643, UUPSUpgradeable {
    
    // State variables
    address public liquidityPool;
    uint256 public totalValueAccrued;
    uint256 public lastYieldUpdate;
    bool public IS_MVP_TESTNET = true;
    
    // Events
    event YieldAccrued(uint256 amount, uint256 newNavPerShare);
    event Deposited(address indexed investor, uint256 eurcAmount, uint256 ulpAmount);
    event Redeemed(address indexed investor, uint256 ulpAmount, uint256 eurcAmount);
    
    /**
     * @notice Initialize token
     * @param name Token name (e.g., "Ujamaa Ujamaa Pool Token (uLP)")
     * @param symbol Token symbol (e.g., "uLP")
     * @param identityRegistry_ Identity registry address
     * @param complianceModule_ Compliance module address
     * @param liquidityPool_ Liquidity pool address
     */
    function initialize(
        string calldata name,
        string calldata symbol,
        address identityRegistry_,
        address complianceModule_,
        address liquidityPool_
    ) external initializer {
        __ERC3643_init(name, symbol, 18, identityRegistry_, complianceModule_);
        __UUPSUpgradeable_init();
        
        liquidityPool = liquidityPool_;
        totalValueAccrued = 0;
        lastYieldUpdate = block.timestamp;
    }
    
    /**
     * @notice Deposit Ondo EUROD (EUROD) → mint uLP
     * @param eurcAmount Amount of Ondo EUROD (EUROD) to deposit
     * @return ulpAmount uLP tokens minted
     */
    function deposit(uint256 eurcAmount) external returns (uint256) {
        require(eurcAmount > 0, "Amount must be > 0");
        require(eurcAmount <= 1_000_000e18, "Exceeds MVP limit (1M Ondo EUROD (EUROD))");
        
        uint256 navPerShare = getValuePerShare();
        uint256 ulpAmount = (eurcAmount * 1e18) / navPerShare;
        
        // Transfer Ondo EUROD (EUROD) from investor to pool
        IERC20(eurcAddress).transferFrom(msg.sender, liquidityPool, eurcAmount);
        
        // Mint uLP to investor
        _mint(msg.sender, ulpAmount);
        
        emit Deposited(msg.sender, eurcAmount, ulpAmount);
        
        return ulpAmount;
    }
    
    /**
     * @notice Redeem uLP → receive Ondo EUROD (EUROD)
     * @param ulpAmount uLP tokens to burn
     * @return eurcAmount Ondo EUROD (EUROD) received
     */
    function redeem(uint256 ulpAmount) external returns (uint256) {
        require(ulpAmount > 0, "Amount must be > 0");
        require(this.balanceOf(msg.sender) >= ulpAmount, "Insufficient balance");
        
        uint256 navPerShare = getValuePerShare();
        uint256 eurcAmount = (ulpAmount * navPerShare) / 1e18;
        
        // Burn uLP tokens
        _burn(msg.sender, ulpAmount);
        
        // Transfer Ondo EUROD (EUROD) from pool to investor
        IERC20(eurcAddress).transferFrom(liquidityPool, msg.sender, eurcAmount);
        
        emit Redeemed(msg.sender, ulpAmount, eurcAmount);
        
        return eurcAmount;
    }
    
    /**
     * @notice Get current NAV per Ujamaa Pool Token (uLP)
     * @return NAV per share (18 decimals)
     */
    function getValuePerShare() public view returns (uint256) {
        uint256 totalPoolValue = ILiquidityPool(liquidityPool).getTotalValue();
        uint256 totalSupply = this.totalSupply();
        
        if (totalSupply == 0) {
            return 1e18; // Initial NAV: 1.0
        }
        
        return (totalPoolValue * 1e18) / totalSupply;
    }
    
    /**
     * @notice Get current value of investor's holdings
     * @param account Investor address
     * @return Value in Ondo EUROD (EUROD) (18 decimals)
     */
    function getValue(address account) external view returns (uint256) {
        uint256 balance = this.balanceOf(account);
        uint256 navPerShare = this.getValuePerShare();
        
        return (balance * navPerShare) / 1e18;
    }
    
    /**
     * @notice Add yield to pool (admin only)
     * @param amount Yield amount in Ondo EUROD (EUROD)
     */
    function addYield(uint256 amount) external onlyRole(POOL_MANAGER_ROLE) {
        require(amount > 0, "Amount must be > 0");
        
        totalValueAccrued += amount;
        lastYieldUpdate = block.timestamp;
        
        uint256 newNav = getValuePerShare();
        
        emit YieldAccrued(amount, newNav);
    }
    
    // ... additional functions (transfers, compliance, etc.)
}
```

### 2.4 Deployment Configuration

```python
# scripts/MVP/deploy_uLP_token.py
from ape import project, accounts
import json
from datetime import datetime

def main():
    deployer = accounts.load('deployer')
    
    print(f'Deploying uLPToken with account: {deployer.address}')
    
    # Deploy uLPToken
    ulp_token = deployer.deploy(project.uLPToken)
    ulp_address = ulp_token.address
    print(f'uLPToken deployed to: {ulp_address}')
    
    # Initialize
    ulp_token.initialize(
        'Ujamaa Ujamaa Pool Token (uLP)',
        'uLP',
        identity_registry_address,
        compliance_module_address,
        liquidity_pool_address
    )
    
    print('uLPToken initialized')
    
    # Save deployment info
    deployment_info = {
        'network': 'polygon-amoy',
        'contract': 'uLPToken',
        'address': ulp_address,
        'deployer': deployer.address,
        'timestamp': datetime.utcnow().isoformat(),
    }
    
    # Write to file
    with open('deployments/MVP/uLP-token.json', 'w') as f:
        json.dump(deployment_info, f, indent=2)

if __name__ == '__main__':
    main()
```

---

## 3. LiquidityPool.sol Specification

### 3.1 Overview

**File:** `contracts/MVP/LiquidityPool.sol`

**Purpose:** Manages liquidity pools with **Pool Family support** for industrial financing with diversification and risk tracking.

**Pool Families Supported:**
- POOL_INDUSTRIE (Manufacturing, GDIZ partners)
- POOL_AGRICULTURE (Coffee, cocoa, cotton, cashews)
- POOL_TRADE_FINANCE (Invoice tokenization, receivables)
- POOL_RENEWABLE_ENERGY (Solar, wind, hydroelectric)

### 3.2 Pool Family Architecture

```
┌─────────────────────────────────────────────────────────┐
│              POOL FAMILY STRUCTURE                       │
│                                                          │
│  LiquidityPool (Main Contract)                          │
│  │                                                        │
│  ├── Pool #1: "Ujamaa Industrial Finance Pool I"        │
│  │   └── Family: POOL_INDUSTRIE                         │
│  │   └── Assets: GDIZ Cotton, GDIZ Soy, GDIZ Coffee     │
│  │   └── Target Yield: 10-12%                           │
│  │   └── Risk Limits: 20% per industrial, 40% per class │
│  │                                                        │
│  ├── Pool #2: "Ujamaa Agriculture Pool I"               │
│  │   └── Family: POOL_AGRICULTURE                       │
│  │   └── Assets: Coffee Coop, Cocoa Farm, Cotton Co.    │
│  │   └── Target Yield: 12-15%                           │
│  │   └── Risk Limits: 20% per industrial, 40% per class │
│  │                                                        │
│  ├── Pool #3: "Ujamaa Trade Finance Pool I"             │
│  │   └── Family: POOL_TRADE_FINANCE                     │
│  │   └── Assets: Invoice #1, Invoice #2, Receivables    │
│  │   └── Target Yield: 8-10%                            │
│  │   └── Risk Limits: 20% per industrial, 40% per class │
│  │                                                        │
│  └── Pool #4: "Ujamaa Renewable Energy Pool I"          │
│      └── Family: POOL_RENEWABLE_ENERGY                  │
│      └── Assets: Solar Farm A, Wind Farm B, Hydro C     │
│      └── Target Yield: 9-11%                            │
│      └── Risk Limits: 20% per industrial, 40% per class │
└─────────────────────────────────────────────────────────┘

Key Points:
• Each pool belongs to ONE family (set at creation)
• Each family has separate uLPToken contract
• Cross-family investment allowed for institutions
• Family-level risk limits enforced
• Separate NAV per pool family
```

### 3.3 Smart Contract Interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./uLPToken.sol";

/**
 * @title LiquidityPool
 * @notice Manages liquidity pools with Pool Family support
 * @dev Supports POOL_INDUSTRIE, POOL_AGRICULTURE, POOL_TRADE_FINANCE, POOL_RENEWABLE_ENERGY
 */
contract LiquidityPool {
    
    // Pool Family enum (per SRS v2.0 Section 1.2)
    enum PoolFamily {
        INDUSTRIE,           // Manufacturing, GDIZ partners
        AGRICULTURE,         // Coffee, cocoa, cotton, cashews
        TRADE_FINANCE,       // Invoice tokenization, receivables
        RENEWABLE_ENERGY     // Solar, wind, hydroelectric
    }
    
    // Pool configuration
    struct PoolConfig {
        PoolFamily family;
        uint256 maxExposurePerIndustrial; // 20% = 2000 (basis points)
        uint256 maxExposurePerAssetClass; // 40% = 4000 (basis points)
        uint256 minimumInvestment; // €100,000
        uint256 managementFeeBps; // 200 = 2% annual
        uint256 performanceFeeBps; // 2000 = 20% of yield
    }
    
    // Financing details
    struct Financing {
        uint256 poolId;
        address industrial;
        uint256 amount;
        uint256 interestRate; // Basis points (12% = 1200)
        uint256 dueDate;
        bool isRepaid;
        uint256 repaidAmount;
    }
    
    // Pool statistics
    struct PoolStats {
        string name;
        PoolFamily family;
        uint256 totalValue;
        uint256 deployedValue;
        uint256 availableValue;
        uint256 financingCount;
        uint256 navPerShare;
    }
    
    // State variables
    mapping(uint256 => PoolConfig) public poolConfigs;
    mapping(uint256 => Financing[]) public poolFinancings;
    mapping(uint256 => address) public poolULPToken; // uLPToken per pool
    uint256 public nextPoolId;
    
    /**
     * @notice Create new pool with family
     * @param name Pool name
     * @param family Pool family (cannot be changed)
     * @return poolId New pool ID
     */
    function createPool(
        string memory name,
        PoolFamily family
    ) external returns (uint256) {
        uint256 poolId = nextPoolId++;
        
        // Set pool configuration
        poolConfigs[poolId] = PoolConfig({
            family: family,
            maxExposurePerIndustrial: 2000, // 20%
            maxExposurePerAssetClass: 4000, // 40%
            minimumInvestment: 100_000e18, // €100K
            managementFeeBps: 200, // 2%
            performanceFeeBps: 2000 // 20%
        });
        
        // Deploy uLPToken for this pool family
        uLPToken uLPToken = new uLPToken();
        uLPToken.initialize(
            string(abi.encodePacked("Ujamaa uLP ", _poolFamilyToString(family))),
            string(abi.encodePacked("uLP-", _poolFamilyToSymbol(family))),
            identityRegistry,
            complianceModule,
            address(this)
        );
        
        poolULPToken[poolId] = address(uLPToken);
        
        emit PoolCreated(poolId, name, family);
        
        return poolId;
    }
    
    /**
     * @notice Deploy funds to industrial
     * @param poolId Pool ID
     * @param industrial Industrial address
     * @param amount Amount to deploy
     * @param interestRate Interest rate (basis points)
     * @param duration Duration in days
     * @return financingId Financing ID
     */
    function deployToIndustrial(
        uint256 poolId,
        address industrial,
        uint256 amount,
        uint256 interestRate,
        uint256 duration
    ) external returns (uint256) {
        require(poolConfigs[poolId].family != PoolFamily.UNDEFINED, "Invalid pool");
        
        // Check diversification limits
        uint256 totalDeployed = _getPoolDeployedValue(poolId);
        uint256 maxPerIndustrial = (totalDeployed * poolConfigs[poolId].maxExposurePerIndustrial) / 10000;
        require(amount <= maxPerIndustrial, "Exceeds 20% per industrial limit");
        
        // Create financing
        uint256 financingId = poolFinancings[poolId].length;
        poolFinancings[poolId].push(Financing({
            poolId: poolId,
            industrial: industrial,
            amount: amount,
            interestRate: interestRate,
            dueDate: block.timestamp + (duration * 1 days),
            isRepaid: false,
            repaidAmount: 0
        }));
        
        // Transfer Ondo EUROD (EUROD) to industrial
        IERC20(eurcAddress).transferFrom(address(this), industrial, amount);
        
        emit FinancingCreated(financingId, poolId, industrial, amount);
        
        return financingId;
    }
    
    /**
     * @notice Record repayment from industrial
     * @param financingId Financing ID
     * @param amount Repayment amount
     */
    function recordRepayment(
        uint256 financingId,
        uint256 amount
    ) external {
        // Update financing record
        // Add yield to pool
        // Update NAV
    }
    
    /**
     * @notice Get pool statistics
     * @param poolId Pool ID
     * @return Pool statistics
     */
    function getPoolStats(uint256 poolId) external view returns (PoolStats memory) {
        // Calculate and return pool stats
    }
    
    /**
     * @notice Get pool family
     * @param poolId Pool ID
     * @return Pool family
     */
    function getPoolFamily(uint256 poolId) external view returns (PoolFamily) {
        return poolConfigs[poolId].family;
    }
    
    // Helper function to convert PoolFamily to string
    function _poolFamilyToString(PoolFamily family) internal pure returns (string memory) {
        if (family == PoolFamily.INDUSTRIE) return "Industrie";
        if (family == PoolFamily.AGRICULTURE) return "Agriculture";
        if (family == PoolFamily.TRADE_FINANCE) return "Trade Finance";
        if (family == PoolFamily.RENEWABLE_ENERGY) return "Renewable Energy";
        return "Unknown";
    }
    
    // Helper function to convert PoolFamily to symbol
    function _poolFamilyToSymbol(PoolFamily family) internal pure returns (string memory) {
        if (family == PoolFamily.INDUSTRIE) return "INDUSTRIE";
        if (family == PoolFamily.AGRICULTURE) return "AGRI";
        if (family == PoolFamily.TRADE_FINANCE) return "TRADE";
        if (family == PoolFamily.RENEWABLE_ENERGY) return "ENERGY";
        return "UNK";
    }
}
```

### 3.1 Overview

**File:** `contracts/MVP/MockEscrow.sol`

**Purpose:** Simulates bank escrow accounts for investor funds on testnet.

**Design Principle:** Interface-compatible with production BIIC/MCB integration.

### 3.2 Smart Contract Interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockEscrow
 * @notice Simulates bank escrow accounts for MVP testnet
 * @dev Interface designed for easy swap with real BIIC/MCB integration
 */
contract MockEscrow {
    
    // Events
    event EscrowAccountCreated(
        string indexed accountId,
        address indexed investor,
        uint256 timestamp
    );
    
    event WireTransferSimulated(
        string indexed txId,
        string fromAccount,
        string toAccount,
        uint256 amount,
        uint256 timestamp
    );
    
    event BalanceUpdated(
        string indexed accountId,
        uint256 newBalance,
        uint256 timestamp
    );
    
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
        string bankName; // "Mock Bank (MVP Testnet)"
    }
    
    /**
     * @notice Create escrow account for investor
     * @param investor Investor address
     * @return accountId Unique account identifier
     */
    function createEscrowAccount(address investor) 
        external 
        returns (string memory) 
    {
        require(investor != address(0), "Invalid address");
        require(investorToAccount[investor] == "", "Account exists");
        
        // Generate unique account ID
        string memory accountId = string(
            abi.encodePacked(
                "MOCK-ESCROW-",
                vm.toString(investor),
                "-",
                vm.toString(block.timestamp)
            )
        );
        
        // Create account with initial balance (10M test Ondo EUROD (EUROD))
        accounts[accountId] = EscrowAccount({
            accountId: accountId,
            investor: investor,
            balance: 10_000_000e18, // 10M test Ondo EUROD (EUROD)
            isActive: true,
            createdAt: block.timestamp,
            bankName: "Mock Bank (MVP Testnet)"
        });
        
        investorToAccount[investor] = accountId;
        transactionHistory.push(accountId);
        
        emit EscrowAccountCreated(accountId, investor, block.timestamp);
        
        return accountId;
    }
    
    /**
     * @notice Simulate wire transfer between accounts
     * @param fromAccount Source account ID
     * @param toAccount Destination account ID
     * @param amount Amount to transfer
     * @return txId Transaction identifier
     */
    function simulateWireTransfer(
        string memory fromAccount,
        string memory toAccount,
        uint256 amount
    ) external returns (string memory) {
        require(accounts[fromAccount].isActive, "Invalid fromAccount");
        require(accounts[toAccount].isActive, "Invalid toAccount");
        require(accounts[fromAccount].balance >= amount, "Insufficient balance");
        
        // Execute transfer
        accounts[fromAccount].balance -= amount;
        accounts[toAccount].balance += amount;
        
        // Generate transaction ID
        string memory txId = string(
            abi.encodePacked(
                "MOCK-WIRE-",
                vm.toString(block.timestamp)
            )
        );
        
        transactionHistory.push(txId);
        
        emit WireTransferSimulated(
            txId,
            fromAccount,
            toAccount,
            amount,
            block.timestamp
        );
        
        emit BalanceUpdated(fromAccount, accounts[fromAccount].balance, block.timestamp);
        emit BalanceUpdated(toAccount, accounts[toAccount].balance, block.timestamp);
        
        return txId;
    }
    
    /**
     * @notice Get account balance
     * @param accountId Account ID
     * @return Balance in test Ondo EUROD (EUROD) (18 decimals)
     */
    function getBalance(string memory accountId) 
        external 
        view 
        returns (uint256) 
    {
        require(accounts[accountId].isActive, "Invalid account");
        return accounts[accountId].balance;
    }
    
    /**
     * @notice Get transaction history
     * @return Array of transaction IDs
     */
    function getTransactionHistory() 
        external 
        view 
        returns (string[] memory) 
    {
        return transactionHistory;
    }
    
    /**
     * @notice Get account details
     * @param accountId Account ID
     * @return accountId, investor, balance, isActive, createdAt, bankName
     */
    function getAccountDetails(string memory accountId)
        external
        view
        returns (
            string memory,
            address,
            uint256,
            bool,
            uint256,
            string memory
        )
    {
        EscrowAccount memory account = accounts[accountId];
        return (
            account.accountId,
            account.investor,
            account.balance,
            account.isActive,
            account.createdAt,
            account.bankName
        );
    }
    
    /**
     * @notice MVP safety flag
     * @return true (always testnet)
     */
    function IS_MVP_TESTNET() external pure returns (bool) {
        return true;
    }
}
```

### 3.3 Backend Service Integration

```python
# backend/services/MVP/mock_bank.py
from typing import Dict, List, Optional
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
        """
        Create mock escrow account.
        
        Args:
            investor_id: Investor identifier
            
        Returns:
            Account ID (format: MOCK-ESCROW-{investor_id}-{uuid})
        """
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
        Simulate wire transfer.
        
        Args:
            from_account: Source account ID
            to_account: Destination account ID
            amount: Amount to transfer (18 decimals)
            
        Returns:
            Transaction ID
        """
        if from_account not in self.accounts:
            raise ValueError(f"Account not found: {from_account}")
        if to_account not in self.accounts:
            raise ValueError(f"Account not found: {to_account}")
        if self.accounts[from_account]['balance'] < amount:
            raise ValueError("Insufficient balance")
        
        # Execute transfer
        self.accounts[from_account]['balance'] -= amount
        self.accounts[to_account]['balance'] += amount
        
        # Create transaction record
        tx_id = f"MOCK-WIRE-{uuid.uuid4().hex[:12]}"
        self.transactions.append({
            'tx_id': tx_id,
            'from_account': from_account,
            'to_account': to_account,
            'amount': amount,
            'timestamp': datetime.utcnow().isoformat(),
            'status': 'COMPLETED_MVP',
        })
        
        return tx_id
    
    def get_balance(self, account_id: str) -> int:
        """Get account balance."""
        if account_id not in self.accounts:
            raise ValueError(f"Account not found: {account_id}")
        return self.accounts[account_id]['balance']
    
    def get_account_details(self, account_id: str) -> dict:
        """Get full account details."""
        if account_id not in self.accounts:
            raise ValueError(f"Account not found: {account_id}")
        return self.accounts[account_id].copy()
    
    def get_transactions(self, account_id: str) -> List[dict]:
        """Get transaction history for account."""
        return [
            tx for tx in self.transactions
            if tx['from_account'] == account_id or tx['to_account'] == account_id
        ]
```

---

## 4. Fund Flow Simulation

### 4.1 Complete Investment Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MVP FUND FLOW (TESTNET)                             │
│                                                                          │
│  Step 1: Investor Onboarding                                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 1. Investor connects wallet (MetaMask)                           │  │
│  │ 2. Completes KYB verification (mock for MVP)                   │  │
│  │ 3. MockEscrow.createEscrowAccount(investor)                      │  │
│  │    → Account ID: MOCK-ESCROW-0x1234...-abc123                    │  │
│  │    → Initial Balance: 10M test Ondo EUROD (EUROD)                              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│  Step 2: Deposit Ondo EUROD (EUROD) → Mint uLP                                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 4. Investor calls uLPToken.deposit(10_000_000e18)                │  │
│  │ 5. Ondo EUROD (EUROD) transferred from investor → LiquidityPool                │  │
│  │ 6. uLP tokens minted to investor                                 │  │
│  │    → uLP Balance: 10,000,000 uLP                                 │  │
│  │    → NAV: €1.00/uLP                                              │  │
│  │    → Total Value: €10,000,000                                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│  Step 3: Pool Deploys to Industrials                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 7. LiquidityPool.deployToIndustrial(...)                         │  │
│  │    → GDIZ Cotton #1: €3M @ 12% (90 days)                         │  │
│  │    → GDIZ Soy #1: €4M @ 11% (120 days)                           │  │
│  │    → GDIZ Coffee #1: €3M @ 13% (60 days)                         │  │
│  │ 8. Ondo EUROD (EUROD) transferred from Pool → Industrial escrow                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│  Step 4: Yield Accrual (Real Math, Simulated Data)                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 9. MockGDIZ.simulateRepayment(...)                               │  │
│  │    → Principal: €3M                                              │  │
│  │    → Interest: €3M × 12% × (90/365) = €88,767                   │  │
│  │    → Total Repayment: €3,088,767                                 │  │
│  │ 10. LiquidityPool.addYield(€88,767)                              │  │
│  │ 11. uLPToken NAV increases:                                      │  │
│  │     → New NAV: €1.0089/uLP (+0.89%)                              │  │
│  │     → Investor Value: €10,089,000 (+€89,000)                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│  Step 5: Redeem uLP → Receive Ondo EUROD (EUROD) + Yield                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 12. Investor calls uLPToken.redeem(10_000_000e18)                │  │
│  │ 13. uLP tokens burned                                            │  │
│  │ 14. Ondo EUROD (EUROD) transferred from Pool → Investor                        │  │
│  │     → Principal: €10,000,000                                     │  │
│  │     → Yield: €89,000                                             │  │
│  │     → Total: €10,089,000                                         │  │
│  │ 15. MockFiatRamp.offRamp() → Bank account                        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Smart Contract Interaction Sequence

```typescript
// Frontend: Complete investment flow
async function executeInvestmentFlow() {
  // Step 1: Connect wallet
  const { address } = await connectWallet();
  
  // Step 2: Create escrow account (mock)
  const mockEscrow = getMockEscrowContract();
  const createTx = await mockEscrow.createEscrowAccount(address);
  await createTx.wait();
  
  const accountId = await mockEscrow.investorToAccount(address);
  console.log('Escrow account created:', accountId);
  
  // Step 3: Get test Ondo EUROD (EUROD) (mock faucet)
  const mockFiatRamp = getMockFiatRampContract();
  const mintTx = await mockFiatRamp.mintTestEURC(address, 10_000_000e18);
  await mintTx.wait();
  
  // Step 4: Approve Ondo EUROD (EUROD) spend
  const eurcContract = getEURCContract();
  const approveTx = await eurcContract.approve(
    ULPTOKEN_ADDRESS,
    10_000_000e18
  );
  await approveTx.wait();
  
  // Step 5: Deposit Ondo EUROD (EUROD) → mint uLP
  const uLPToken = getULPTokenContract();
  const depositTx = await uLPToken.deposit(10_000_000e18);
  await depositTx.wait();
  
  const ulpBalance = await uLPToken.balanceOf(address);
  console.log('uLP minted:', ethers.formatEther(ulpBalance));
  
  // Step 6: Check NAV (should be 1.0 initially)
  const nav = await uLPToken.getValuePerShare();
  console.log('NAV per uLP:', ethers.formatEther(nav));
  
  // ... wait for yield accrual ...
  
  // Step 7: Redeem uLP → receive Ondo EUROD (EUROD) + yield
  const redeemTx = await uLPToken.redeem(ulpBalance);
  await redeemTx.wait();
  
  const eurcBalance = await eurcContract.balanceOf(address);
  console.log('Ondo EUROD (EUROD) received:', ethers.formatEther(eurcBalance));
}
```

---

## 5. BIIC/MCB Production Swap

### 5.1 Interface Compatibility

**MVP (Mock) → Production (Real)**

```python
# Same interface, different implementation
class IBankService(ABC):
    @abstractmethod
    def create_escrow_account(self, investor_id: str) -> str:
        pass
    
    @abstractmethod
    def initiate_wire_transfer(
        self,
        from_account: str,
        to_account: str,
        amount: int
    ) -> str:
        pass
    
    @abstractmethod
    def get_balance(self, account_id: str) -> int:
        pass

# MVP Implementation
class MockBankService(IBankService):
    def create_escrow_account(self, investor_id: str) -> str:
        # Mock implementation (in-memory)
        pass

# Production Implementation
class BIICBankService(IBankService):
    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url
    
    def create_escrow_account(self, investor_id: str) -> str:
        # Real BIIC API call
        response = requests.post(
            f"{self.base_url}/api/v1/escrow/create",
            headers={'Authorization': f'Bearer {self.api_key}'},
            json={'investor_id': investor_id}
        )
        return response.json()['account_id']
```

### 5.2 Configuration Swap

```python
# backend/config/settings.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # MVP Mode
    MVP_MODE: bool = True
    MOCK_BANK: bool = True
    
    # Production Bank (BIIC/MCB)
    BIIC_API_KEY: Optional[str] = None
    BIIC_BASE_URL: Optional[str] = None
    MCB_API_KEY: Optional[str] = None
    MCB_BASE_URL: Optional[str] = None

settings = Settings()

# Factory function
def get_bank_service() -> IBankService:
    if settings.MVP_MODE and settings.MOCK_BANK:
        return MockBankService()
    else:
        return BIICBankService(
            api_key=settings.BIIC_API_KEY,
            base_url=settings.BIIC_BASE_URL
        )
```

### 5.3 Production Readiness Checklist

**Before swapping mock → production:**

- [ ] Legal entity established (Mauritius CIS Manager License)
- [ ] Bank partnership signed (BIIC or MCB)
- [ ] Regulatory approval obtained (FSC Mauritius)
- [ ] Compliance framework implemented
- [ ] Security audits completed (smart contracts + backend)
- [ ] Production environment ready
- [ ] Mainnet deployment approved
- [ ] Insurance coverage in place
- [ ] Mock services disabled
- [ ] Real bank API credentials configured

---

## 6. Testing Guide

### 6.1 Smart Contract Tests

```python
# tests/MVP/test_uLP_token.py
from ape import project, accounts
import pytest

@pytest.fixture
def deployer(accounts):
    return accounts[0]

@pytest.fixture
def investor(accounts):
    return accounts[1]

@pytest.fixture
def ulp_token(deployer, identity_registry, compliance_module, liquidity_pool):
    ulp = deployer.deploy(project.uLPToken)
    ulp.initialize(
        'Ujamaa Ujamaa Pool Token (uLP)',
        'uLP',
        identity_registry,
        compliance_module,
        liquidity_pool
    )
    return ulp

@pytest.fixture
def liquidity_pool(deployer, ulp_token):
    return deployer.deploy(project.LiquidityPool, ulp_token)

def test_deposit_mints_tokens(ulp_token, mock_eurc, investor):
    """Should mint uLP tokens on deposit"""
    # Approve Ondo EUROD (EUROD) spend
    mock_eurc.approve(ulp_token, 10_000_000 * 10**18, sender=investor)
    
    # Deposit
    ulp_token.deposit(10_000_000 * 10**18, sender=investor)
    
    # Check balance
    balance = ulp_token.balanceOf(investor)
    assert balance == 10_000_000 * 10**18

def test_yield_increases_nav(ulp_token, liquidity_pool, pool_manager):
    """Should increase NAV on yield"""
    # Initial NAV
    initial_nav = ulp_token.getValuePerShare()
    assert initial_nav == 10**18  # 1.0
    
    # Add yield
    liquidity_pool.addYield(100_000 * 10**18, sender=pool_manager)  # 100K Ondo EUROD (EUROD)
    
    # New NAV
    new_nav = ulp_token.getValuePerShare()
    assert new_nav > initial_nav

def test_redeem_burns_tokens(ulp_token, mock_eurc, investor):
    """Should burn uLP on redeem"""
    # Deposit first
    mock_eurc.approve(ulp_token, 10_000_000 * 10**18, sender=investor)
    ulp_token.deposit(10_000_000 * 10**18, sender=investor)
    
    # Redeem
    ulp_token.redeem(10_000_000 * 10**18, sender=investor)
    
    # Check balance (should be 0)
    balance = ulp_token.balanceOf(investor)
    assert balance == 0
```

### 6.2 Backend Tests

```python
# tests/MVP/test_mock_bank.py
import pytest
from backend.services.MVP.mock_bank import MockBankService

def test_create_escrow_account():
    bank = MockBankService()
    account_id = bank.create_escrow_account("INV-001")
    
    assert account_id.startswith("MOCK-ESCROW")
    assert bank.get_balance(account_id) == 10_000_000_000_000

def test_wire_transfer():
    bank = MockBankService()
    acc1 = bank.create_escrow_account("INV-001")
    acc2 = bank.create_escrow_account("INV-002")
    
    initial_balance = bank.get_balance(acc1)
    tx_id = bank.initiate_wire_transfer(acc1, acc2, 1_000_000_000_000)
    
    assert tx_id.startswith("MOCK-WIRE")
    assert bank.get_balance(acc1) == initial_balance - 1_000_000_000_000
    assert bank.get_balance(acc2) == initial_balance + 1_000_000_000_000

def test_insufficient_balance():
    bank = MockBankService()
    acc1 = bank.create_escrow_account("INV-001")
    acc2 = bank.create_escrow_account("INV-002")
    
    with pytest.raises(ValueError, match="Insufficient balance"):
        bank.initiate_wire_transfer(acc1, acc2, 100_000_000_000_000)
```

---

## 7. Security Considerations

### 7.1 Testnet Safety

**MVP is TESTNET ONLY:**
- ✅ No real money handled
- ✅ Clear disclaimers on all UI
- ✅ `IS_MVP_TESTNET = true` flag in contracts
- ✅ Max deposit limits (1M Ondo EUROD (EUROD) for demo)
- ✅ Mock data clearly labeled

### 7.2 Private Key Security

**NEVER store private keys in:**
- ❌ Frontend code
- ❌ Backend environment variables (for user keys)
- ❌ Database
- ❌ Version control

**ALWAYS use:**
- ✅ User's wallet (MetaMask, WalletConnect)
- ✅ HSM for platform keys (production only)
- ✅ Gnosis Safe for treasury

### 7.3 Production Swap Security

**Before enabling production:**
- [ ] All mock services disabled
- [ ] Real bank API credentials in secrets manager
- [ ] Smart contracts audited
- [ ] Mainnet deployment verified
- [ ] Legal/regulatory approval obtained

---

**Document Control:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 17, 2026 | Aziz Da Silva | Initial specification |

**Related Documents:**
- `01_MVP_SPECIFICATION.md` - MVP overview
- `04_MVP_MOCKING_AND_TESTNET_STRATEGY.md` - Mocking strategy
- `05_MVP_FRONTEND_SPECIFICATION.md` - Frontend integration


