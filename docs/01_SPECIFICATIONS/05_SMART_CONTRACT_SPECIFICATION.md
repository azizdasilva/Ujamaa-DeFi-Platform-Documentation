# Smart Contract Specification

## UJAMAA DEFI PLATFORM Tokenization Contracts

**Author:** Aziz Da Silva - Lead Architect  
**Version:** 2.1 (SRS v2.1 Institutional Architecture)  
**Date:** March 25, 2026  
**Classification:** Technical  
**Audience:** Smart Contract Developers, Security Auditors  

---

## Document Updates Summary (v2.1)

### Institutional Architecture Additions

**New Contracts (SRS v2.1):**
- **UjamaaPoolToken (uLP)**: Yield-bearing ERC-3643 token for liquidity pool shares
- **GuaranteeToken (UJG)**: ERC-3643NFT (ERC-721 + compliance) for collateral representation
- **LiquidityPool**: Pool management with multi-asset financing
- **NavOracle**: NAV price feed for yield calculation

**Updated Contracts:**
- Contract inventory expanded to include institutional architecture
- Token standards updated with ERC-3643NFT specification
- Compliance modules extended for uLP/UJG

**SRS Reference:** This specification implements **SRS v2.1** Section 5 (System Architecture) and Section 7 (Security Requirements).

---

# Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Token Standards](#2-token-standards)
3. [Contract Architecture](#3-contract-architecture)
4. [ERC-3643 Fungible Token](#4-erc-3643-fungible-token)
5. [ERC-3643 NFT](#5-erc-3643-nft)
6. [Compliance Modules](#6-compliance-modules)
7. [Upgrade Mechanism](#7-upgrade-mechanism)
8. [Gas Optimization](#8-gas-optimization)
9. [Security Considerations](#9-security-considerations)
10. [Deployment Configuration](#10-deployment-configuration)

---

# 1. Executive Summary

## 1.1 Purpose

This specification defines the smart contract architecture for UJAMAA DEFI PLATFORM's tokenization system. All contracts implement **ERC-3643 (T-REX protocol)** for regulated securities, enabling:

- On-chain identity verification via ONCHAINID
- Transfer restrictions enforced at contract level
- Jurisdiction-specific compliance rules
- Automated regulatory audit trails

## 1.2 Contract Inventory (SRS v2.1)

**Institutional Contracts (NEW in v2.1):**

| Contract | Standard | Chain | Purpose | Priority |
|----------|----------|-------|---------|----------|
| `UjamaaPoolToken (uLP)` | ERC-3643 + ERC-20 | Ethereum, Polygon | **Yield-bearing** LP token 🆕 | P0 |
| `GuaranteeToken (UJG)` | ERC-3643NFT (ERC-721 + compliance) | Ethereum, Polygon | **Collateral NFT** 🆕 | P0 |
| `LiquidityPool` | Custom | Polygon | **Pool management** (multi-asset financing) 🆕 | P0 |
| `NavOracle` | Custom | Polygon | **NAV price feed** for yield calculation 🆕 | P1 |

**Retail Contracts (MVP-1, unchanged):**

| Contract | Standard | Chain | Purpose |
|----------|----------|-------|---------|
| `UjamaaToken (UAT)` | ERC-3643 + ERC-20 | Ethereum, Polygon | Fungible security tokens (asset-specific) |
| `UjamaaDeed (UJDEED)` | ERC-3643 + ERC-721 | Ethereum, Polygon | Unique asset tokens (single properties, artwork) |
| `IdentityRegistry` | Custom | Ethereum, Polygon | Maps wallets to ONCHAINID identities |
| `ComplianceModule` | Custom | Ethereum, Polygon | Enforces transfer rules per asset class |
| `TrustedIssuersRegistry` | Custom | Ethereum, Polygon | Manages authorized Claim Issuers |
| `UjamaaBridge` | Custom | Ethereum, Polygon | Cross-chain token bridge |
| `TreasurySafe` | Gnosis Safe | Ethereum, Polygon | Multi-sig treasury management |
| `DistributionManager` | Custom | Polygon | Automated repayment distribution |

## 1.3 Development Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Framework** | ApeWorX | 0.7+ |
| **Language** | Solidity | 0.8.20+ |
| **Testing** | ApeWorX + Pytest | Python 3.11 |
| **Coverage** | ApeWorX Coverage | 95%+ required |
| **Static Analysis** | Slither, Mythril | Latest |
| **Formal Verification** | Certora | Critical paths |

---

# 2. Token Standards

## 2.1 ERC-3643 (T-REX) Overview

ERC-3643 extends ERC-20/ERC-721 with compliance primitives:

```solidity
interface IERC3643 {
    // Identity registry reference
    function identityRegistry() external view returns (address);
    
    // Compliance module reference
    function complianceModule() external view returns (address);
    
    // Transfer with compliance check
    function transfer(address to, uint256 value) external returns (bool);
    
    // Forced transfer (admin only, for regulatory actions)
    function forcedTransfer(address from, address to, uint256 value) external returns (bool);
}
```

**Key Properties:**
- Every transfer validates sender AND recipient identity
- Compliance rules enforced before transfer execution
- Admin can freeze tokens or force transfers (regulatory compliance)
- All events include identity claim references for audit trails

## 2.2 ONCHAINID Integration

```solidity
interface IONCHAINID {
    // Issue a claim (KYC approval, accreditation, etc.)
    function issueClaim(
        address claimTopic,
        uint256 scheme,
        address issuer,
        bytes calldata signature,
        bytes calldata data,
        uint256 expiration
    ) external returns (uint256 claimId);
    
    // Verify a claim exists and is valid
    function hasClaim(
        address topic,
        uint256 scheme,
        address issuer
    ) external view returns (bool);
    
    // Get all claims for an identity
    function getClaimsByTopic(uint256 topic) external view returns (Claim[] memory);
}
```

**Claim Topics Used:**

| Topic ID | Claim Type | Issuer | Expiration |
|----------|------------|--------|------------|
| 1 | KYC Verified | Licensed KYC Provider | 12 months |
| 2 | Accredited Investor | Licensed Financial Advisor | 24 months |
| 3 | Jurisdiction: Nigeria | National ID Commission | 60 months |
| 4 | Jurisdiction: Kenya | Huduma Centre | 60 months |
| 5 | Jurisdiction: South Africa | Home Affairs | 60 months |
| 6 | Jurisdiction: Ghana | National Identification Authority | 60 months |
| 7 | AML Screening Passed | Compliance Provider | 30 days |
| 8 | Sanctions Check Passed | Compliance Provider | 30 days |
| 9 | Investment Cap Verified | Platform Admin | Per-offering |
| 10 | Lock-up Period Active | Platform Admin | Per-offering |

---

# 3. Contract Architecture

## 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SMART CONTRACT LAYER                                 │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                      TOKEN CONTRACTS                                      ││
│  │  ┌──────────────────────────┐  ┌──────────────────────────┐             ││
│  │  │   Ujamaa Pool Token (uLP)            │  │   Ujamaa Deed (UJDEED)              │             ││
│  │  │   (ERC-3643 + ERC-20)    │  │   (ERC-3643 + ERC-721)   │             ││
│  │  └───────────┬──────────────┘  └───────────┬──────────────┘             ││
│  └──────────────┼─────────────────────────────┼──────────────────────────────┘│
│                 │                             │                               │
│  ┌──────────────▼─────────────────────────────▼──────────────────────────────┐│
│  │                    COMPLIANCE LAYER                                        ││
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐              ││
│  │  │ Identity       │  │ Compliance     │  │ Trusted        │              ││
│  │  │ Registry       │  │ Module         │  │ Issuers Reg    │              ││
│  │  └────────────────┘  └────────────────┘  └────────────────┘              ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                 │                             │                               │
│  ┌──────────────▼─────────────────────────────▼──────────────────────────────┐│
│  │                    SUPPORTING CONTRACTS                                    ││
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐              ││
│  │  │ UjamaaBridge   │  │ Distribution   │  │ TreasurySafe   │              ││
│  │  │ (Cross-chain)  │  │ Manager        │  │ (Gnosis Safe)  │              ││
│  │  └────────────────┘  └────────────────┘  └────────────────┘              ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Inheritance Structure

```
Ujamaa Pool Token (uLP)
├── ERC3643 (Tokeny)
│   ├── ERC20 (OpenZeppelin)
│   ├── IERC3643 (Tokeny)
│   └── Pausable (OpenZeppelin)
├── UUPSUpgradeable (OpenZeppelin)
└── AccessControlEnumerable (OpenZeppelin)

Ujamaa Deed (UJDEED)
├── ERC3643NFT (Tokeny)
│   ├── ERC721 (OpenZeppelin)
│   ├── IERC3643 (Tokeny)
│   └── Pausable (OpenZeppelin)
├── UUPSUpgradeable (OpenZeppelin)
└── AccessControlEnumerable (OpenZeppelin)

IdentityRegistry
├── IIdentityRegistry (Tokeny)
├── UUPSUpgradeable (OpenZeppelin)
└── AccessControlEnumerable (OpenZeppelin)

ComplianceModule
├── ICompliance (Tokeny)
├── UUPSUpgradeable (OpenZeppelin)
└── AccessControlEnumerable (OpenZeppelin)
```

---

# 4. ERC-3643 Fungible Token

## 4.1 Contract Specification

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@tokeny/erc3643/contracts/ERC3643.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

/**
 * @title Ujamaa Pool Token (uLP)
 * @notice ERC-3643 compliant fungible security token for asset pool tokenization
 * @dev Supports fractional ownership with compliance-enforced transfers
 */
contract Ujamaa Pool Token (uLP) is ERC3643, UUPSUpgradeable, AccessControlEnumerableUpgradeable {
    
    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant COMPLIANCE_ADMIN = keccak256("COMPLIANCE_ADMIN");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // Asset metadata
    string private s_assetName;      // e.g., "Lagos Commercial REIT Class A"
    string private s_assetClass;     // e.g., "REAL_ESTATE", "AGRICULTURE"
    uint256 private s_totalShares;   // Total shares in underlying asset pool
    uint256 private s_navPerShare;   // Net Asset Value per share (18 decimals)
    uint256 private s_lastNavUpdate; // Timestamp of last NAV update
    
    // Compliance configuration
    struct ComplianceConfig {
        uint256 minInvestment;       // Minimum tokens per transaction
        uint256 maxInvestment;       // Maximum tokens per investor
        uint256 lockupPeriod;        // Seconds before tokens can be transferred
        bool onlyAccredited;         // Require accredited investor status
        string[] allowedJurisdictions; // ISO 3166-1 alpha-2 country codes
        uint256 distributionFeeBps;  // Basis points fee on distributions
    }
    
    mapping(bytes32 => ComplianceConfig) private s_assetConfigs;
    mapping(address => uint256) private s_firstPurchaseTime;
    
    // Events
    event AssetConfigSet(bytes32 indexed assetId, ComplianceConfig config);
    event NAVUpdated(uint256 navPerShare, uint256 timestamp);
    event DistributionPaid(bytes32 indexed assetId, uint256 amountPerShare);
    event TokensMinted(address indexed to, uint256 amount, bytes32 indexed assetId);
    event TokensBurned(address indexed from, uint256 amount, bytes32 indexed assetId);
    
    /**
     * @notice Initialize token contract
     * @param name Token name
     * @param symbol Token symbol
     * @param identityRegistry_ Identity registry address
     * @param complianceModule_ Compliance module address
     * @param admin_ Admin address (will have DEFAULT_ADMIN_ROLE)
     */
    function initialize(
        string calldata name,
        string calldata symbol,
        address identityRegistry_,
        address complianceModule_,
        address admin_
    ) external initializer {
        __ERC3643_init(name, symbol, 18, identityRegistry_, complianceModule_);
        __UUPSUpgradeable_init();
        __AccessControlEnumerable_init();
        
        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(MINTER_ROLE, admin_);
        _grantRole(BURNER_ROLE, admin_);
        _grantRole(COMPLIANCE_ADMIN, admin_);
        _grantRole(PAUSER_ROLE, admin_);
    }
    
    /**
     * @notice Mint new tokens (compliance-gated)
     * @dev Only callable by MINTER_ROLE, recipient must pass identity verification
     * @param to Recipient address
     * @param amount Amount to mint
     * @param assetId Asset pool identifier
     */
    function mint(
        address to,
        uint256 amount,
        bytes32 assetId
    ) external onlyRole(MINTER_ROLE) {
        require(to != address(0), "Zero address");
        require(_canTransfer(msg.sender, to, amount), "Compliance check failed");
        
        _mint(to, amount);
        emit TokensMinted(to, amount, assetId);
    }
    
    /**
     * @notice Burn tokens (for redemptions or regulatory actions)
     * @param from Address to burn from
     * @param amount Amount to burn
     * @param assetId Asset pool identifier
     */
    function burn(
        address from,
        uint256 amount,
        bytes32 assetId
    ) external onlyRole(BURNER_ROLE) {
        _burn(from, amount);
        emit TokensBurned(from, amount, assetId);
    }
    
    /**
     * @notice Set compliance configuration for an asset
     * @param assetId Asset pool identifier
     * @param config Compliance configuration struct
     */
    function setComplianceConfig(
        bytes32 assetId,
        ComplianceConfig calldata config
    ) external onlyRole(COMPLIANCE_ADMIN) {
        s_assetConfigs[assetId] = config;
        emit AssetConfigSet(assetId, config);
    }
    
    /**
     * @notice Update NAV per share
     * @param navPerShare New NAV (18 decimals)
     */
    function updateNAV(uint256 navPerShare) external onlyRole(COMPLIANCE_ADMIN) {
        s_navPerShare = navPerShare;
        s_lastNavUpdate = block.timestamp;
        emit NAVUpdated(navPerShare, block.timestamp);
    }
    
    /**
     * @notice Check if transfer is allowed under compliance rules
     * @dev Called automatically by ERC-3643 before every transfer
     */
    function _canTransfer(
        address from,
        address to,
        uint256 amount
    ) internal view override returns (bool) {
        // Check identity verification
        require(identityRegistry().isVerified(from), "Sender not verified");
        require(identityRegistry().isVerified(to), "Recipient not verified");
        
        // Check lock-up period for new investors
        if (s_firstPurchaseTime[to] == 0) {
            s_firstPurchaseTime[to] = block.timestamp;
        }
        
        // Additional compliance checks delegated to ComplianceModule
        return true;
    }
    
    // ... additional functions (getters, admin functions, distribution logic)
}
```

## 4.2 State Variables

| Variable | Type | Visibility | Description |
|----------|------|------------|-------------|
| `s_assetName` | string | private | Human-readable asset name |
| `s_assetClass` | string | private | Asset classification code |
| `s_totalShares` | uint256 | private | Total shares in asset pool |
| `s_navPerShare` | uint256 | private | Current NAV per token (18 decimals) |
| `s_lastNavUpdate` | uint256 | private | Timestamp of last NAV update |
| `s_assetConfigs` | mapping | private | Compliance config per asset |
| `s_firstPurchaseTime` | mapping | private | Track lock-up periods |

## 4.3 Functions

### Core Functions

| Function | Visibility | Gas Estimate | Description |
|----------|------------|--------------|-------------|
| `initialize()` | external | ~150,000 | Contract initialization |
| `mint()` | external | ~85,000 | Mint new tokens |
| `burn()` | external | ~45,000 | Burn tokens |
| `transfer()` | external | ~65,000 | Transfer tokens (with compliance) |
| `balanceOf()` | external view | ~2,500 | Get balance |

### Admin Functions

| Function | Visibility | Gas Estimate | Description |
|----------|------------|--------------|-------------|
| `setComplianceConfig()` | external | ~50,000 | Set asset compliance rules |
| `updateNAV()` | external | ~25,000 | Update NAV per share |
| `pause()` | external | ~20,000 | Pause all transfers |
| `unpause()` | external | ~20,000 | Resume transfers |
| `forcedTransfer()` | external | ~70,000 | Regulatory forced transfer |

### Gas Limits (Maximum Allowed)

| Function | Gas Limit | Rationale |
|----------|-----------|-----------|
| `deposit()` | <100,000 | Must complete within block gas limit |
| `redeem()` | <80,000 | Burn + transfer logic |
| `addYield()` | <50,000 | Simple state update |
| `transfer()` | <70,000 | ERC-3643 compliance checks |
| `mint()` | <90,000 | Identity verification + minting |
| `burn()` | <50,000 | Simple burn operation |

**Note:** All functions must be optimized to stay well below Ethereum block gas limit (30M gas) and Polygon block gas limit (15M gas). Functions exceeding limits require refactoring.

## 4.4 Events

```solidity
event AssetConfigSet(bytes32 indexed assetId, ComplianceConfig config);
event NAVUpdated(uint256 navPerShare, uint256 timestamp);
event DistributionPaid(bytes32 indexed assetId, uint256 amountPerShare);
event TokensMinted(address indexed to, uint256 amount, bytes32 indexed assetId);
event TokensBurned(address indexed from, uint256 amount, bytes32 indexed assetId);
event TransferWithCompliance(
    address indexed from,
    address indexed to,
    uint256 amount,
    bytes32 indexed assetId,
    bool compliancePassed
);
```

---

## 4.5 Yield-Bearing uLP Token Specification 🆕 (SRS v2.1)

### 4.5.1 Value-Accrual Model

The Ujamaa Pool Token (uLP) implements a **value-accrual model** where:
- Token balance remains constant
- NAV (Net Asset Value) per token increases with pool yield
- No manual distribution required (automatic compounding)

**NAV Calculation:**
```solidity
function getNAVPerShare() public view returns (uint256) {
    uint256 totalPoolValue = liquidityPool.getTotalPoolValue();
    uint256 totalShares = s_totalSupply;
    return (totalPoolValue * 1e18) / totalShares; // 18 decimals
}

function getInvestorValue(address account) public view returns (uint256) {
    uint256 navPerShare = getNAVPerShare();
    uint256 balance = s_balances[account];
    return (balance * navPerShare) / 1e18;
}
```

**Example:**
```
Day 0 (Inception):
- Pool Value: €10,000,000
- uLP Shares: 10,000,000
- NAV per Share: €1.00
- Investor deposits €1,000,000 → receives 1,000,000 uLP

Day 30 (12% APR):
- Interest Earned: €100,000
- Pool Value: €10,100,000
- uLP Shares: 10,000,000 (unchanged)
- NAV per Share: €1.01
- Investor value: 1,000,000 × €1.01 = €1,010,000 (+1%)
```

### 4.5.2 Deposit/Redeem Mechanism

```solidity
/**
 * @notice Deposit Ondo EUROD (EUROD) to mint uLP tokens
 * @param amountUJUR Amount of Ondo EUROD (EUROD) to deposit
 * @return uLPMinted Amount of uLP tokens minted
 */
function deposit(uint256 amountUJUR) external returns (uint256) {
    require(amountUJUR > 0, "Amount must be > 0");
    
    uint256 navPerShare = getNAVPerShare();
    uint256 uLPMinted = (amountUJUR * 1e18) / navPerShare;
    
    // Transfer EUROD from user to pool
    require(
        UJEURToken.transferFrom(msg.sender, poolAddress, amountUJUR),
        "EUROD transfer failed"
    );
    
    // Mint uLP to user
    _mint(msg.sender, uLPMinted);
    
    // Notify pool of new liquidity
    liquidityPool.addLiquidity(amountUJUR);
    
    emit Deposit(msg.sender, amountUJUR, uLPMinted);
    return uLPMinted;
}

/**
 * @notice Redeem uLP tokens for Ondo EUROD (EUROD) + yield
 * @param uLPAmount Amount of uLP tokens to burn
 * @return amountUJUR Amount of EUROD received (principal + yield)
 */
function redeem(uint256 uLPAmount) external returns (uint256) {
    require(uLPAmount > 0 && uLPAmount <= s_balances[msg.sender], "Invalid amount");
    
    uint256 navPerShare = getNAVPerShare();
    uint256 amountUJUR = (uLPAmount * navPerShare) / 1e18;
    
    // Burn uLP tokens
    _burn(msg.sender, uLPAmount);
    
    // Transfer EUROD from pool to user
    require(
        UJEURToken.transfer(msg.sender, amountUJUR),
        "EUROD transfer failed"
    );
    
    // Notify pool of removed liquidity
    liquidityPool.removeLiquidity(amountUJUR);
    
    emit Redemption(msg.sender, uLPAmount, amountUJUR);
    return amountUJUR;
}
```

### 4.5.3 NAV Update Frequency

| Trigger | Frequency | Description |
|---------|-----------|-------------|
| **Real-time** | On-chain event | Deposits, redemptions, new financings |
| **Daily** | Automated | Yield accrual (interest calculation) |
| **Event-triggered** | On-chain event | Default events, liquidations |

**NAV Update Oracle:**
```solidity
// NavOracle.sol
contract NavOracle {
    struct NavUpdate {
        uint256 navPerShare;
        uint256 totalPoolValue;
        uint256 totalShares;
        uint256 timestamp;
        bytes32 dataHash; // IPFS hash of supporting data
    }
    
    mapping(uint256 => NavUpdate) private s_navHistory;
    uint256 private s_updateCount;
    
    function updateNAV(
        uint256 navPerShare,
        uint256 totalPoolValue,
        uint256 totalShares,
        bytes32 dataHash
    ) external onlyRole(POOL_MANAGER_ROLE) {
        s_updateCount++;
        s_navHistory[s_updateCount] = NavUpdate({
            navPerShare: navPerShare,
            totalPoolValue: totalPoolValue,
            totalShares: totalShares,
            timestamp: block.timestamp,
            dataHash: dataHash
        });
        
        emit NAVUpdated(navPerShare, block.timestamp);
    }
    
    function getLatestNAV() external view returns (NavUpdate memory) {
        return s_navHistory[s_updateCount];
    }
    
    function getNAVHistory(uint256 count) external view returns (NavUpdate[] memory) {
        NavUpdate[] memory history = new NavUpdate[](count);
        for (uint256 i = 0; i < count; i++) {
            history[i] = s_navHistory[s_updateCount - i];
        }
        return history;
    }
}
```

---

## 4.6 Guarantee Token (UJG) Specification 🆕 (SRS v2.1)

### 4.6.1 Purpose and Design

The Ujamaa Guarantee (UJG) is a **non-transferable ERC-3643NFT** (ERC-721 base + ERC-3643 compliance) that represents certified merchandise/collateral backing a financing operation.

**Key Properties:**
- ✅ **ERC-721 Base**: Standard NFT for unique asset representation
- ✅ **ERC-3643 Compliance**: Identity registry and transfer validation
- ✅ **Non-Transferable**: Cannot be transferred by holder (only forced transfer)
- ✅ **Collateral Representation**: Token represents physical stock in warehouse
- ✅ **Forced Transfer**: Pool Manager can force transfer for redemption/liquidation

### 4.6.2 Contract Specification

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@tokeny/erc3643/contracts/ERC3643NFT.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

/**
 * @title GuaranteeToken (UJG)
 * @notice ERC-3643NFT representing certified merchandise collateral
 * @dev Non-transferable except via forcedTransfer (Pool Manager only)
 */
contract GuaranteeToken is ERC3643NFT, AccessControlEnumerableUpgradeable {
    
    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant POOL_MANAGER_ROLE = keccak256("POOL_MANAGER_ROLE");
    
    // Guarantee structure
    struct Guarantee {
        uint256 certificateId;      // Industrial Gateway certificate
        uint256 merchandiseValue;   // Value in Ondo EUROD (EUROD)
        uint256 expiryDate;         // When invoice is due
        address industrial;         // Original issuer
        bool isRedeemed;            // Whether repaid
        bool isDefaulted;           // Whether defaulted
        bytes32 stockHash;          // IPFS hash of stock documents
    }
    
    mapping(uint256 => Guarantee) private s_guarantees;
    uint256 private s_nextTokenId;
    
    address public poolAddress;
    address public gatewayAddress;
    mapping(address => bool) public approvedAuctionWinners;
    
    // Events
    event GuaranteeMinted(
        uint256 indexed tokenId,
        address indexed industrial,
        uint256 merchandiseValue,
        uint256 expiryDate
    );
    event GuaranteeRedeemed(uint256 indexed tokenId);
    event GuaranteeLiquidated(
        uint256 indexed tokenId,
        address indexed winner,
        uint256 liquidationAmount
    );
    
    /**
     * @notice Mint Guarantee Token (UJG) for certified merchandise
     * @param industrial Address of industrial (must be verified)
     * @param certificateId Industrial Gateway certificate ID
     * @param value Merchandise value in EUROD
     * @param expiryDate Invoice due date
     * @param stockHash IPFS hash of stock documents
     * @return tokenId Minted token ID
     */
    function mintGuarantee(
        address industrial,
        uint256 certificateId,
        uint256 value,
        uint256 expiryDate,
        bytes32 stockHash
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(industrial != address(0), "Invalid industrial");
        require(value > 0, "Value must be > 0");
        require(expiryDate > block.timestamp, "Expiry must be in future");
        
        uint256 tokenId = s_nextTokenId++;
        s_guarantees[tokenId] = Guarantee({
            certificateId: certificateId,
            merchandiseValue: value,
            expiryDate: expiryDate,
            industrial: industrial,
            isRedeemed: false,
            isDefaulted: false,
            stockHash: stockHash
        });
        
        _safeMint(industrial, tokenId);
        
        emit GuaranteeMinted(tokenId, industrial, value, expiryDate);
        return tokenId;
    }
    
    /**
     * @notice Redeem Guarantee Token (UJG) upon full repayment
     * @param tokenId Token ID to redeem
     */
    function redeemGuarantee(uint256 tokenId) external onlyRole(POOL_MANAGER_ROLE) {
        Guarantee storage guarantee = s_guarantees[tokenId];
        require(!guarantee.isRedeemed, "Already redeemed");
        require(!guarantee.isDefaulted, "Already defaulted");
        
        guarantee.isRedeemed = true;
        
        // Force transfer back to industrial
        _forcedTransfer(tokenId, guarantee.industrial);
        
        emit GuaranteeRedeemed(tokenId);
    }
    
    /**
     * @notice Liquidate defaulted Guarantee Token (UJG) via auction
     * @param tokenId Token ID to liquidate
     * @param auctionWinner Auction winner address
     */
    function liquidateGuarantee(
        uint256 tokenId,
        address auctionWinner
    ) external onlyRole(POOL_MANAGER_ROLE) {
        Guarantee storage guarantee = s_guarantees[tokenId];
        require(!guarantee.isRedeemed, "Already redeemed");
        require(!guarantee.isDefaulted, "Already defaulted");
        require(auctionWinner != address(0), "Invalid winner");
        
        guarantee.isDefaulted = true;
        approvedAuctionWinners[auctionWinner] = true;
        
        // Force transfer to auction winner
        _forcedTransfer(tokenId, auctionWinner);
        
        emit GuaranteeLiquidated(tokenId, auctionWinner, guarantee.merchandiseValue);
    }
    
    /**
     * @notice Override transfer to prevent unauthorized transfers
     * @dev UJG is non-transferable except via forcedTransfer
     */
    function transfer(address, uint256) public pure override returns (bool) {
        revert("UJG is non-transferable; use forcedTransfer");
    }
    
    /**
     * @notice Override safeTransferFrom to prevent unauthorized transfers
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        revert("UJG is non-transferable; use forcedTransfer");
    }
    
    /**
     * @notice Forced transfer (Pool Manager only)
     * @dev Only Pool, Industrial Gateway, or approved auction winner can receive
     */
    function _forcedTransfer(uint256 tokenId, address to) internal {
        require(
            to == poolAddress || 
            to == gatewayAddress || 
            approvedAuctionWinners[to],
            "Invalid recipient"
        );
        
        address owner = ownerOf(tokenId);
        _transfer(owner, to, tokenId);
    }
    
    /**
     * @notice Get Guarantee details
     * @param tokenId Token ID
     * @return guarantee Guarantee struct
     */
    function getGuarantee(uint256 tokenId) 
        external view returns (Guarantee memory) 
    {
        return s_guarantees[tokenId];
    }
    
    /**
     * @notice Check if token is verified (ERC-3643 compliance)
     * @dev Override to enforce identity verification
     */
    function _canTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal view override returns (bool) {
        require(
            identityRegistry().isVerified(from),
            "Sender not verified"
        );
        require(
            identityRegistry().isVerified(to),
            "Recipient not verified"
        );
        // Only Pool, Industrial Gateway, or approved auction winner can receive
        require(
            to == poolAddress || 
            to == gatewayAddress || 
            approvedAuctionWinners[to],
            "Invalid recipient"
        );
        return true;
    }
}
```

### 4.6.3 UJG Lifecycle

```
1. Industrial receives order (e.g., ZARA €2M contract)
2. Industrial Gateway certifies stock (SIPI/GDIZ verification)
3. UJG minted (ERC-3643NFT with metadata + compliance)
4. Pool deploys funds to Industrial
5. Pool holds UJG (collateral/security)
6. Industrial repays (principal + interest)
7. UJG redeemed → transferred back to Industrial
8. [DEFAULT SCENARIO] If industrial defaults:
   → UJG liquidated via approved auction
   → Proceeds distributed to uLP holders
   → Default recorded in compliance audit trail
```

---

# 5. ERC-3643 NFT

## 5.1 Contract Specification

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@tokeny/erc3643/contracts/ERC3643NFT.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

/**
 * @title Ujamaa Deed (UJDEED)
 * @notice ERC-3643 compliant NFT for unique asset tokenization
 * @dev Each NFT represents ownership of a single unique asset
 *      (real estate deed, artwork, single invoice)
 */
contract Ujamaa Deed (UJDEED) is ERC3643NFT, UUPSUpgradeable, AccessControlEnumerableUpgradeable {
    
    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant METADATA_ADMIN = keccak256("METADATA_ADMIN");
    
    // Asset metadata structure
    struct AssetMetadata {
        string assetType;        // "REAL_ESTATE", "ARTWORK", "INVOICE"
        string jurisdiction;     // ISO country code
        string legalDescription; // Legal description of asset
        uint256 appraisedValue;  // Appraised value (18 decimals, USD)
        uint256 appraisalDate;   // Timestamp of appraisal
        string documentHash;     // IPFS hash of legal documents
        address originator;      // Asset originator address
        bool isIncomeGenerating; // Whether asset produces cash flow
        uint256 lastDistribution;// Timestamp of last distribution
    }
    
    mapping(uint256 => AssetMetadata) private s_assetMetadata;
    mapping(string => uint256[]) private s_assetsByType;
    mapping(address => uint256[]) private s_assetsByOriginator;
    
    uint256 private s_nextTokenId;
    
    // Events
    event AssetMinted(
        uint256 indexed tokenId,
        address indexed owner,
        AssetMetadata metadata
    );
    event AssetMetadataUpdated(uint256 indexed tokenId, AssetMetadata metadata);
    event AppraisalUpdated(uint256 indexed tokenId, uint256 newValue, uint256 date);
    event DistributionRecorded(uint256 indexed tokenId, uint256 amount, uint256 timestamp);
    
    /**
     * @notice Initialize NFT contract
     */
    function initialize(
        string calldata name,
        string calldata symbol,
        address identityRegistry_,
        address complianceModule_,
        address admin_
    ) external initializer {
        __ERC3643NFT_init(name, symbol, identityRegistry_, complianceModule_);
        __UUPSUpgradeable_init();
        __AccessControlEnumerable_init();
        
        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(MINTER_ROLE, admin_);
        _grantRole(BURNER_ROLE, admin_);
        _grantRole(METADATA_ADMIN, admin_);
    }
    
    /**
     * @notice Mint new NFT representing unique asset
     * @param to Owner address
     * @param metadata Asset metadata
     * @return tokenId New token ID
     */
    function mintAsset(
        address to,
        AssetMetadata calldata metadata
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(to != address(0), "Zero address");
        require(_canTransfer(msg.sender, to, 1), "Compliance check failed");
        
        uint256 tokenId = s_nextTokenId++;
        _safeMint(to, tokenId);
        s_assetMetadata[tokenId] = metadata;
        
        s_assetsByType[metadata.assetType].push(tokenId);
        s_assetsByOriginator[metadata.originator].push(tokenId);
        
        emit AssetMinted(tokenId, to, metadata);
        return tokenId;
    }
    
    /**
     * @notice Update asset appraisal value
     * @param tokenId Token ID
     * @param newValue New appraised value
     */
    function updateAppraisal(
        uint256 tokenId,
        uint256 newValue
    ) external onlyRole(METADATA_ADMIN) {
        require(_exists(tokenId), "Token does not exist");
        s_assetMetadata[tokenId].appraisedValue = newValue;
        s_assetMetadata[tokenId].appraisalDate = block.timestamp;
        
        emit AppraisalUpdated(tokenId, newValue, block.timestamp);
    }
    
    /**
     * @notice Get asset metadata
     * @param tokenId Token ID
     * @return metadata Asset metadata struct
     */
    function getAssetMetadata(
        uint256 tokenId
    ) external view returns (AssetMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return s_assetMetadata[tokenId];
    }
    
    /**
     * @notice Get all token IDs by asset type
     * @param assetType Asset type string
     * @return tokenIds Array of token IDs
     */
    function getAssetsByType(
        string calldata assetType
    ) external view returns (uint256[] memory) {
        return s_assetsByType[assetType];
    }
    
    // ... additional functions
}
```

## 5.2 NFT Use Cases

| Use Case | Metadata Fields | Special Handling |
|----------|-----------------|------------------|
| **Real Estate Deed** | `assetType=REAL_ESTATE`, `legalDescription=property deed`, `documentHash=title registry` | Requires land registry verification, jurisdiction-specific compliance |
| **Artwork** | `assetType=ARTWORK`, `legalDescription=provenance chain`, `documentHash=authenticity certificate` | Requires expert appraisal, insurance documentation |
| **Single Invoice** | `assetType=INVOICE`, `legalDescription=invoice terms`, `documentHash=invoice PDF` | Requires debtor verification, payment terms tracking |
| **Commodity Lot** | `assetType=COMMODITY`, `legalDescription=warehouse receipt`, `documentHash=quality certificate` | Requires warehouse attestation, quality verification |

---

# 6. Compliance Modules

## 6.1 Compliance Module Specification

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@tokeny/erc3643/contracts/modules/Compliance.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title UjamaaComplianceModule
 * @notice Enforces transfer restrictions per asset class and jurisdiction
 */
contract UjamaaComplianceModule is Compliance, UUPSUpgradeable {
    
    // Transfer rules per asset class
    struct TransferRule {
        uint256 maxInvestors;           // Maximum number of token holders
        uint256 minHoldingPeriod;       // Seconds before tokens can be sold
        uint256 maxConcentration;       // Max % any single investor can hold
        bool requireAccreditation;      // Require accredited investor status
        string[] restrictedJurisdictions; // Blocked jurisdictions
        uint256 minInvestmentUSD;       // Minimum investment in USD
        uint256 maxInvestmentUSD;       // Maximum investment in USD
    }
    
    mapping(bytes32 => TransferRule) private s_transferRules;
    mapping(address => uint256) private s_investorCount;
    mapping(bytes32 => mapping(address => uint256)) private s_investorHoldings;
    
    // Events
    event TransferRuleSet(bytes32 indexed assetId, TransferRule rule);
    event TransferBlocked(
        address indexed from,
        address indexed to,
        bytes32 indexed assetId,
        string reason
    );
    
    function initialize(address admin_) external initializer {
        __UUPSUpgradeable_init();
        // Initialize parent Compliance contract
    }
    
    /**
     * @notice Check if transfer complies with all rules
     * @dev Called automatically by ERC-3643 token before every transfer
     */
    function canTransfer(
        address from,
        address to,
        uint256 value,
        bytes calldata data
    ) external view override returns (bool) {
        bytes32 assetId = bytes32(data);
        
        TransferRule memory rule = s_transferRules[assetId];
        
        // Check holding period
        if (rule.minHoldingPeriod > 0) {
            // Implementation checks first purchase time
        }
        
        // Check concentration limits
        if (rule.maxConcentration > 0) {
            // Implementation checks investor's % of total supply
        }
        
        // Check restricted jurisdictions
        for (uint256 i = 0; i < rule.restrictedJurisdictions.length; i++) {
            // Implementation checks investor's jurisdiction claim
        }
        
        // Check accreditation requirement
        if (rule.requireAccreditation) {
            // Implementation checks accredited investor claim
        }
        
        return true;
    }
    
    /**
     * @notice Set transfer rules for an asset
     */
    function setTransferRule(
        bytes32 assetId,
        TransferRule calldata rule
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        s_transferRules[assetId] = rule;
        emit TransferRuleSet(assetId, rule);
    }
}
```

## 6.2 Compliance Rule Matrix

| Rule | Real Estate | Agriculture | Trade Finance | Private Equity |
|------|-------------|-------------|---------------|----------------|
| Max Investors | 200 | 500 | 100 | 99 (Reg D) |
| Min Holding Period | 365 days | 180 days | 90 days | 730 days |
| Max Concentration | 25% | 20% | 15% | 30% |
| Require Accreditation | Yes | No (retail allowed) | Yes | Yes |
| Restricted Jurisdictions | OFAC list | OFAC list | OFAC + high-risk | OFAC list |
| Min Investment | $1,000 | $100 | $5,000 | $50,000 |
| Max Investment | $1M | $500K | $2M | $5M |

---

# 7. Upgrade Mechanism

## 7.1 UUPS Proxy Pattern

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

/**
 * @title UjamaaTokenV2 (Example Upgrade)
 * @notice Demonstrates upgrade pattern with new functionality
 */
contract UjamaaTokenV2 is Ujamaa Pool Token (uLP) {
    
    // New state variable (storage gap respected)
    uint256 private s_distributionYield;
    
    /**
     * @notice Version 2 initializer (called after upgrade)
     */
    function initializeV2() external reinitializer(2) {
        s_distributionYield = 0;
    }
    
    /**
     * @notice New function in V2
     */
    function setDistributionYield(uint256 yield_) external onlyRole(COMPLIANCE_ADMIN) {
        s_distributionYield = yield_;
    }
    
    /**
     * @notice Override _authorizeUpgrade for access control
     */
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
```

## 7.2 Upgrade Process

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         UPGRADE WORKFLOW                                      │
│                                                                              │
│  1. Development                                                              │
│     └─> Write new contract version                                           │
│     └─> Unit tests (100% coverage on changed code)                           │
│     └─> Fork test on mainnet                                                 │
│                                                                              │
│  2. Security Review                                                          │
│     └─> Internal security review                                             │
│     └─> External audit (if breaking changes)                                 │
│     └─> Slither/Mythril analysis                                             │
│                                                                              │
│  3. Governance Approval                                                      │
│     └─> Submit upgrade proposal to multisig                                  │
│     └─> 5-of-9 multisig approval required                                    │
│     └─> 48-hour timelock before execution                                    │
│                                                                              │
│  4. Deployment                                                               │
│     └─> Deploy new implementation contract                                   │
│     └─> Verify on Etherscan/Polygonscan                                      │
│     └─> Execute upgrade via proxy                                            │
│     └─> Run post-upgrade validation tests                                    │
│                                                                              │
│  5. Monitoring                                                               │
│     └─> Monitor for unexpected behavior                                      │
│     └─> Alert on any failed transactions                                     │
│     └─> Document upgrade in changelog                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 7.3 Storage Layout

```solidity
// Storage layout must be preserved across upgrades
// Use storage gaps for future expansion

contract UjamaaTokenV1 {
    // Slot 0: string private s_assetName;
    // Slot 1-2: string private s_assetClass;
    // Slot 3: uint256 private s_totalShares;
    // Slot 4: uint256 private s_navPerShare;
    // Slot 5: uint256 private s_lastNavUpdate;
    // ...
    
    // Storage gap for future variables
    uint256[50] private __gap;
}
```

---

# 8. Gas Optimization

## 8.1 Optimization Techniques

| Technique | Gas Savings | Implementation |
|-----------|-------------|----------------|
| **Packed Storage** | 40% on state vars | Pack bools and uints < 256 bits |
| **Calldata vs Memory** | 2,000-5,000 per param | Use `calldata` for external function arrays |
| **Short-Circuit Logic** | Variable | Order conditions by failure likelihood |
| **Event vs Storage** | 15,000+ per write | Log to events, reconstruct off-chain |
| **Batch Operations** | 50% per operation | Batch mint, batch transfer |
| **Immutable Variables** | 2,000 per access | Use `immutable` for constants set at deploy |

## 8.2 Gas Limits

| Operation | Target Gas | Max Gas |
|-----------|------------|---------|
| Token Transfer | 65,000 | 100,000 |
| Token Mint | 85,000 | 150,000 |
| Token Burn | 45,000 | 75,000 |
| Compliance Check | 50,000 | 100,000 |
| NFT Mint | 150,000 | 250,000 |
| Bridge Lock | 120,000 | 200,000 |
| Distribution | 80,000 | 150,000 |

## 8.3 Batch Operations

```solidity
/**
 * @notice Batch mint tokens to multiple recipients
 * @param recipients Array of recipient addresses
 * @param amounts Array of amounts
 * @param assetId Asset pool identifier
 * @return success Boolean array indicating success per recipient
 */
function batchMint(
    address[] calldata recipients,
    uint256[] calldata amounts,
    bytes32 assetId
) external onlyRole(MINTER_ROLE) returns (bool[] memory success) {
    require(recipients.length == amounts.length, "Length mismatch");
    
    success = new bool[](recipients.length);
    for (uint256 i = 0; i < recipients.length; i++) {
        if (_canTransfer(msg.sender, recipients[i], amounts[i])) {
            _mint(recipients[i], amounts[i]);
            success[i] = true;
        }
    }
}
```

---

# 9. Security Considerations

## 9.1 Threat Model

| Threat | Mitigation | Status |
|--------|------------|--------|
| **Reentrancy** | Checks-Effects-Interactions pattern, ReentrancyGuard | Mitigated |
| **Integer Overflow** | Solidity 0.8+ built-in checks | Mitigated |
| **Access Control Bypass** | OpenZeppelin AccessControl, multisig for admin | Mitigated |
| **Oracle Manipulation** | Chainlink decentralized Gateways, time-weighted prices | Mitigated |
| **Front-Running** | Commit-reveal patterns for sensitive operations | Partial |
| **Upgrade Attack** | Timelock + multisig, audit before upgrade | Mitigated |
| **Identity Spoofing** | ONCHAINID with trusted Claim Issuers | Mitigated |

## 9.2 Critical Security Functions

```solidity
// Emergency pause - stops all transfers
function pause() external onlyRole(PAUSER_ROLE) {
    _pause();
}

// Forced transfer for regulatory compliance
function forcedTransfer(
    address from,
    address to,
    uint256 amount
) external onlyRole(DEFAULT_ADMIN_ROLE) returns (bool) {
    require(paused(), "Only when paused");
    // Regulatory authority can force transfer
    _transfer(from, to, amount);
    return true;
}

// Freeze specific address (court order, sanctions)
function freezeAddress(address addr) external onlyRole(COMPLIANCE_ADMIN) {
    identityRegistry().freezeIdentity(addr);
}
```

## 9.3 Audit Checklist

- [ ] All external calls follow CEI pattern
- [ ] Access control on all admin functions
- [ ] Events emitted for all state changes
- [ ] Zero address checks on all transfers
- [ ] Reentrancy guards on value-transfer functions
- [ ] Upgrade mechanism tested on testnet
- [ ] Gas limits within acceptable ranges
- [ ] Storage layout documented and preserved
- [ ] Slither analysis passes with no high/medium issues
- [ ] Formal verification on critical paths (Certora)

---

# 10. Deployment Configuration

## 10.1 Network Configuration

| Network | Chain ID | RPC URL | Explorer | Gas Token |
|---------|----------|---------|----------|-----------|
| Ethereum Mainnet | 1 | https://mainnet.infura.io | Etherscan | ETH |
| Polygon Mainnet | 137 | https://polygon-rpc.com | Polygonscan | MATIC |
| Ethereum Sepolia | 11155111 | https://sepolia.infura.io | Etherscan | ETH |
| Polygon Mumbai | 80001 | https://rpc-mumbai.maticvigil.com | Polygonscan | MATIC |

## 10.2 Deployment Order

```
1. Deploy IdentityRegistry (Ethereum + Polygon)
2. Deploy TrustedIssuersRegistry (Ethereum + Polygon)
3. Deploy ComplianceModule (Ethereum + Polygon)
4. Deploy Ujamaa Pool Token (uLP) implementation (Ethereum + Polygon)
5. Deploy Ujamaa Pool Token (uLP) proxy (Ethereum + Polygon)
6. Deploy Ujamaa Deed (UJDEED) implementation (Ethereum + Polygon)
7. Deploy Ujamaa Deed (UJDEED) proxy (Ethereum + Polygon)
8. Deploy UjamaaBridge (Ethereum + Polygon)
9. Deploy DistributionManager (Polygon only)
10. Configure Gnosis Safe multisigs
11. Initialize all contracts
12. Link contracts (set registry addresses in tokens)
13. Register trusted Claim Issuers
14. Deploy frontend contracts (if any)
```

## 10.3 Configuration Files

```python
# ape-config.yaml
name: ujamaa-defi
version: 1.0.0

default_ecosystem: ethereum

plugins:
  - name: solidity
  - name: vyper
  - name: etherscan

ethereum:
  default_network: sepolia
  sepolia:
    default_provider: infura
  mainnet:
    default_provider: infura

polygon:
  default_network: mumbai
  mumbai:
    default_provider: alchemy
  mainnet:
    default_provider: alchemy

solidity:
  version: 0.8.20
  evm_version: paris
```

---

# Appendix A: Complete ABI Exports

See `contracts/abi/` directory for complete JSON ABI files for all contracts.

# Appendix B: Test Coverage Report

See `reports/coverage/` for detailed coverage reports (target: 95%+).

# Appendix C: Gas Report

See `reports/gas/` for detailed gas consumption analysis per function.

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-27 | System Architect | Initial release |

**Related Documents**

- `01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` - Requirements specification
- `02_ARCHITECTURE_SPECIFICATION.md` - System architecture
- `06_API_SPECIFICATION.md` - Backend API for blockchain integration
- `10_COMPLIANCE_FRAMEWORK.md` - Regulatory compliance requirements for smart contracts
- `06_DEPLOYMENT_GUIDE.md` - Smart contract deployment procedures
- `07_MONITORING_SPECIFICATION.md` - Blockchain and smart contract monitoring


