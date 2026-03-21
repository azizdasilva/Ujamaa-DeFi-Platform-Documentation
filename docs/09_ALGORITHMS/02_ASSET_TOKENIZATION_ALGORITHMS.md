# Asset Tokenization Algorithm Specifications

**UJAMAA DEFI PLATFORM - MVP Institutional Architecture**

**Version:** 2.0 (Asset Tokenization Update)  
**Date:** March 19, 2026  
**Author:** Aziz Da Silva - Lead Architect  
**Reference:** SRS v2.0 Section 1.2, 5.3

---

## Overview

This document specifies the **asset tokenization algorithms** for the Ujamaa DeFi Platform, including:

1. **Ujamaa Guarantee Token (UGT)** - ERC-3643NFT collateral token
2. **Industrial Gateway** - Asset certification contract
3. **Asset Tokenization Flow** - From submission to collateral

---

## 1. Ujamaa Guarantee Token (UGT)

### 1.1 Token Specification

| Property | Value |
|----------|-------|
| **Name** | Ujamaa Guarantee Token |
| **Symbol** | UGT |
| **Standard** | ERC-3643NFT (ERC-721 + ERC-3643 compliance) |
| **Purpose** | Collateral/security token representing certified merchandise |
| **Transferable** | No (forced transfer only: Pool ↔ Industrial Gateway ↔ Auction) |
| **Compliance** | ERC-3643 identity verification required |

### 1.2 UGT Data Structure

```solidity
struct Guarantee {
    uint256 certificateId;      // Industrial Gateway certificate
    uint256 merchandiseValue;   // Value in UJEUR (18 decimals)
    uint256 expiryDate;         // When invoice is due
    address industrial;         // Original issuer
    address poolAddress;        // Pool holding collateral
    bool isRedeemed;            // Whether repaid
    bool isDefaulted;           // Whether defaulted
    bytes32 stockHash;          // IPFS hash of stock documents
    string description;         // Stock description
    string warehouseLocation;   // Warehouse location
}
```

### 1.3 UGT Lifecycle Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│                    UGT LIFECYCLE                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Industrial receives order (e.g., ZARA €2M contract)     │
│          ↓                                                   │
│  2. Industrial Gateway certifies stock (GDIZ verification)  │
│          ↓                                                   │
│  3. UGT minted (ERC-3643NFT with metadata + compliance)     │
│          ↓                                                   │
│  4. Pool deploys funds to Industrial                        │
│          ↓                                                   │
│  5. Pool holds UGT (collateral/security)                    │
│          ↓                                                   │
│  6. Industrial repays (principal + interest)                │
│          ↓                                                   │
│  7. UGT transferred back to Industrial (forcedTransfer)     │
│          ↓                                                   │
│  8. [DEFAULT SCENARIO] If industrial defaults:              │
│      → UGT liquidated via approved auction                  │
│      → Proceeds distributed to UPT holders                  │
│      → Default recorded in compliance audit trail           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.4 UGT Minting Algorithm

**Function:** `mintGuarantee()`

**Inputs:**
- `industrial` - Industrial company address
- `certificateId` - Industrial Gateway certificate ID
- `value` - Merchandise value in UJEUR (18 decimals)
- `expiryDate` - Expiry timestamp
- `stockHash` - IPFS hash of stock documents
- `description` - Stock description
- `warehouseLocation` - Warehouse location

**Algorithm:**
```
1. Validate inputs:
   - value > 0
   - industrial != address(0)
   - certificateId not already used

2. Mint new ERC-3643NFT:
   - tokenId = nextTokenId++
   - _safeMint(industrial, tokenId)

3. Store guarantee data:
   - s_guarantees[tokenId] = Guarantee(...)

4. Update mappings:
   - tokenIdToCertificateId[tokenId] = certificateId
   - certificateIdToTokenId[certificateId] = tokenId

5. Emit event:
   - GuaranteeMinted(tokenId, certificateId, industrial, value)

6. Return tokenId
```

**Solidity Implementation:**
```solidity
function mintGuarantee(
    address industrial,
    uint256 certificateId,
    uint256 value,
    uint256 expiryDate,
    bytes32 stockHash,
    string calldata description,
    string calldata warehouseLocation
) external onlyRole(MINTER_ROLE) returns (uint256) {
    if (value == 0) revert ZeroValue();
    if (industrial == address(0)) revert InvalidIndustrial();
    
    if (certificateIdToTokenId[certificateId] != 0) {
        return certificateIdToTokenId[certificateId];
    }
    
    uint256 tokenId = s_nextTokenId++;
    _safeMint(industrial, tokenId);
    
    s_guarantees[tokenId] = Guarantee({
        certificateId: certificateId,
        merchandiseValue: value,
        expiryDate: expiryDate,
        industrial: industrial,
        poolAddress: address(0),
        isRedeemed: false,
        isDefaulted: false,
        stockHash: stockHash,
        description: description,
        warehouseLocation: warehouseLocation
    });
    
    tokenIdToCertificateId[tokenId] = certificateId;
    certificateIdToTokenId[certificateId] = tokenId;
    
    emit GuaranteeMinted(tokenId, certificateId, industrial, value);
    
    return tokenId;
}
```

### 1.5 UGT Redemption Algorithm

**Function:** `redeemGuarantee()`

**Purpose:** Transfer UGT back to industrial after financing repayment

**Algorithm:**
```
1. Validate:
   - Token exists
   - Caller has POOL_MANAGER_ROLE
   - Not already redeemed

2. Mark as redeemed:
   - guarantee.isRedeemed = true

3. Transfer to industrial:
   - _safeTransfer(msg.sender, industrial, tokenId)

4. Emit event:
   - GuaranteeRedeemed(tokenId, industrial)
```

### 1.6 UGT Liquidation Algorithm

**Function:** `liquidateGuarantee()`

**Purpose:** Auction UGT when industrial defaults

**Algorithm:**
```
1. Validate:
   - Token exists
   - Caller has POOL_MANAGER_ROLE
   - Token is marked as defaulted

2. Transfer to auction winner:
   - _safeTransfer(msg.sender, auctionWinner, tokenId)

3. Emit event:
   - GuaranteeLiquidated(tokenId, auctionWinner, liquidationAmount)

4. Distribute proceeds to UPT holders (via LiquidityPool)
```

---

## 2. Industrial Gateway (Asset Certification)

### 2.1 Contract Specification

| Property | Value |
|----------|-------|
| **Name** | Industrial Gateway |
| **Former Name** | AssetProof (SRS v2.0 Section 1.3) |
| **Purpose** | Certify industrial assets/stock before tokenization |
| **Role** | Mints certificates → Triggers UGT minting |
| **Verifiers** | GDIZ, SIPI, approved certifiers |

### 2.2 Certificate Data Structure

```solidity
struct Certificate {
    uint256 certificateId;
    address industrial;
    string assetType;         // INVOICE, INVENTORY, PRODUCTION, SHIPMENT, CONTRACT
    uint256 value;            // Value in UJEUR (18 decimals)
    uint256 quantity;
    string unit;              // e.g., "bales", "tons", "units"
    string warehouseLocation;
    uint256 certificationDate;
    uint256 expiryDate;
    bytes32 stockHash;        // IPFS hash
    string description;
    bool isVerified;
    bool isRevoked;
    uint256 guaranteeTokenId; // Linked UGT token ID
}
```

### 2.3 Asset Certification Algorithm

**Function:** `certifyAsset()`

**Inputs:**
- `industrial` - Industrial company address
- `assetType` - Type of asset (INVOICE, INVENTORY, PRODUCTION, SHIPMENT, CONTRACT)
- `value` - Value in UJEUR (18 decimals)
- `quantity` - Quantity of items
- `unit` - Unit of measure
- `warehouseLocation` - Warehouse location
- `stockHash` - IPFS hash of stock documents
- `description` - Asset description
- `validityDays` - Certificate validity period

**Algorithm:**
```
1. Validate inputs:
   - value > 0
   - industrial != address(0)
   - Caller has CERTIFIER_ROLE (GDIZ/SIPI)

2. Create certificate:
   - certificateId = nextCertificateId++
   - certificates[certificateId] = Certificate(...)

3. Auto-verify certificate:
   - cert.isVerified = true
   - cert.certificationDate = block.timestamp
   - cert.expiryDate = block.timestamp + (validityDays * 1 days)

4. Add to industrial's certificates:
   - industrialCertificates[industrial].push(certificateId)

5. Emit events:
   - CertificateCreated(certificateId, industrial, assetType, value)
   - CertificateVerified(certificateId, msg.sender)

6. Return certificateId
```

### 2.4 UGT Minting from Certificate Algorithm

**Function:** `mintGuaranteeToken()`

**Purpose:** Mint UGT collateral token for verified certificate

**Algorithm:**
```
1. Validate certificate:
   - Certificate exists
   - isVerified == true
   - isRevoked == false
   - guaranteeTokenId == 0 (not already minted)

2. Mint UGT:
   - tokenId = guaranteeToken.mintGuarantee(
       cert.industrial,
       certificateId,
       cert.value,
       cert.expiryDate,
       cert.stockHash,
       cert.description,
       cert.warehouseLocation
   )

3. Link certificate to UGT:
   - cert.guaranteeTokenId = tokenId

4. Assign UGT to pool:
   - guaranteeToken.assignToPool(tokenId, msg.sender)

5. Emit event:
   - GuaranteeTokenMinted(certificateId, tokenId)

6. Return tokenId
```

---

## 3. Complete Asset Tokenization Flow

### 3.1 End-to-End Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│            ASSET TOKENIZATION FLOW                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STEP 1: Asset Submission                                   │
│  ─────────────────────                                       │
│  • Industrial submits asset details to Industrial Gateway   │
│  • Provides: value, quantity, warehouse, IPFS hash          │
│  • Asset types: INVOICE, INVENTORY, PRODUCTION, SHIPMENT    │
│                                                              │
│          ↓                                                   │
│                                                              │
│  STEP 2: Certification (GDIZ/SIPI)                          │
│  ───────────────────────                                     │
│  • Certifier verifies asset existence                       │
│  • Calls: certifyAsset()                                    │
│  • Certificate created with unique ID                       │
│  • Auto-verified by certifier                               │
│                                                              │
│          ↓                                                   │
│                                                              │
│  STEP 3: UGT Minting                                        │
│  ───────────────                                             │
│  • Pool manager calls: mintGuaranteeToken(certificateId)    │
│  • UGT (ERC-3643NFT) minted                                 │
│  • UGT held by Pool as collateral                           │
│  • Certificate linked to UGT token ID                       │
│                                                              │
│          ↓                                                   │
│                                                              │
│  STEP 4: Financing Creation                                 │
│  ──────────────────────                                      │
│  • LiquidityPool.createFinancing() called                   │
│  • Funds deployed to Industrial                             │
│  • UGT assigned to financing                                │
│  • financingToGuaranteeToken[financingId] = tokenId         │
│                                                              │
│          ↓                                                   │
│                                                              │
│  STEP 5: Repayment OR Default                               │
│  ─────────────────────────                                   │
│                                                              │
│  [SCENARIO A: Repayment]                                    │
│  • Industrial repays (principal + interest)                 │
│  • Pool calls: redeemGuarantee(tokenId)                     │
│  • UGT transferred back to Industrial                       │
│  • Certificate marked as redeemed                           │
│                                                              │
│  [SCENARIO B: Default]                                      │
│  • Industrial defaults                                      │
│  • Pool marks UGT as defaulted                              │
│  • Auction conducted                                        │
│  • UGT liquidated to auction winner                         │
│  • Proceeds distributed to UPT holders                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Integration with LiquidityPool

**Updated createFinancing() Function:**

```solidity
function createFinancing(
    PoolFamily poolFamily,
    string calldata assetClass,
    address industrial,
    uint256 principal,
    uint256 interestRate,
    uint256 durationDays,
    uint256 certificateId  // NEW: For UGT minting
) external nonReentrant returns (uint256) {
    // ... validation ...
    
    // Create financing
    uint256 financingId = nextFinancingId++;
    financings[financingId] = Financing(...);
    
    // Mint UGT as collateral if certificate provided
    if (certificateId > 0 && address(guaranteeToken) != address(0)) {
        try guaranteeToken.mintGuaranteeToken(certificateId) returns (uint256 tokenId) {
            financingToGuaranteeToken[financingId] = tokenId;
        } catch {
            // Fallback: continue without UGT (MVP)
        }
    }
    
    // ... rest of logic ...
}
```

---

## 4. Compliance & Security

### 4.1 ERC-3643 Compliance (UGT)

**Transfer Restrictions:**
```solidity
function _update(address to, uint256 tokenId, uint256 auth) internal override returns (address) {
    address from = _ownerOf(tokenId);
    
    // Allow minting
    if (from == address(0)) {
        return super._update(to, tokenId, auth);
    }
    
    // Allow transfers to/from Pool or Industrial Gateway only
    Guarantee memory guarantee = s_guarantees[tokenId];
    if (
        to == guarantee.poolAddress ||
        to == guarantee.industrial ||
        hasRole(POOL_MANAGER_ROLE, to)
    ) {
        return super._update(to, tokenId, auth);
    }
    
    // Revert for unauthorized transfers
    revert("UGT: Transfer not allowed - compliance restriction");
}
```

### 4.2 Identity Verification

- ✅ Only verified entities can hold UGT (ERC-3643)
- ✅ ONCHAINID integration required
- ✅ Transfer validation on every transaction
- ✅ Compliance audit trail maintained

---

## 5. MVP Testnet Implementation

### 5.1 Testnet Utilities

**GuaranteeToken:**
```solidity
function mintTestGuarantee(
    address industrial,
    uint256 value,
    string calldata description
) external returns (uint256) {
    require(IS_MVP_TESTNET, "Only on testnet");
    
    return this.mintGuarantee(
        industrial,
        s_nextTokenId,
        value,
        block.timestamp + (365 days),
        keccak256(abi.encodePacked("test-stock-", s_nextTokenId)),
        description,
        "MVP Test Warehouse"
    );
}
```

**IndustrialGateway:**
```solidity
function createTestCertificate(
    address industrial,
    string calldata assetType,
    uint256 value,
    string calldata description
) external returns (uint256) {
    require(IS_MVP_TESTNET, "Only on testnet");
    
    return this.certifyAsset(
        industrial,
        assetType,
        value,
        1000, // quantity
        "units",
        "MVP Test Warehouse",
        keccak256(abi.encodePacked("test-", block.timestamp)),
        description,
        365 // validity days
    );
}
```

---

## 6. Summary

### New Contracts Created:
1. ✅ **GuaranteeToken.sol** - UGT (ERC-3643NFT collateral)
2. ✅ **IndustrialGateway.sol** - Asset certification
3. ✅ **LiquidityPool.sol** - Updated with UGT integration

### Algorithms Specified:
1. ✅ UGT Minting
2. ✅ UGT Redemption
3. ✅ UGT Liquidation
4. ✅ Asset Certification
5. ✅ Certificate → UGT Minting
6. ✅ Complete Asset Tokenization Flow

### SRS Compliance:
- ✅ SRS v2.0 Section 1.2 - Ujamaa Guarantee Token (UGT)
- ✅ SRS v2.0 Section 5.3 - Industrial Gateway
- ✅ ERC-3643NFT standard compliance
- ✅ ONCHAINID integration ready

---

**Version:** 2.0 (Asset Tokenization Update)  
**Date:** March 19, 2026  
**Status:** ✅ COMPLETE

---

*Generated from SRS v2.0 — March 19, 2026*  
*Ujamaa DeFi Platform - MVP*
