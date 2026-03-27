# Smart Contract Integration Guide

## Connecting Smart Contracts to Backend & Frontend

**Author:** Aziz Da Silva - Lead Architect
**Version:** 1.0
**Date:** March 9, 2026
**Audience:** Full-Stack Developers, Smart Contract Engineers

---

# Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Smart Contracts (Week 2)](#2-smart-contracts-week-2)
3. [Backend Integration](#3-backend-integration)
4. [Frontend Integration](#4-frontend-integration)
5. [Data Flow Examples](#5-data-flow-examples)
6. [Security Considerations](#6-security-considerations)

---

# 1. Architecture Overview

## 1.1 Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + TypeScript)                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │  wagmi/viem     │  │  React Query    │  │  Axios HTTP     │         │
│  │  (Direct SC)    │  │  (State Mgmt)   │  │  (Backend API)  │         │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘         │
│           │                     │                     │                  │
│           │ Web3 Calls          │ State Sync          │ REST API         │
│           │ (Read/Write)        │ (Polling)           │ (CRUD)           │
└───────────┼─────────────────────┼─────────────────────┼──────────────────┘
            │                     │                     │
            ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (FastAPI + Python)                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │  Web3.py        │  │  PostgreSQL     │  │  Business Logic │         │
│  │  (SC Listener)  │  │  (Data Store)   │  │  (Validation)   │         │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘         │
│           │                     │                     │                  │
│           │ Blockchain Events   │ Persistent Data     │ API Endpoints    │
│           │ Indexing            │ + Indexing          │ + Auth           │
└───────────┼─────────────────────┼─────────────────────┼──────────────────┘
            │                     │                     │
            ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      BLOCKCHAIN LAYER (Polygon Amoy)                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │  UjamaaToken    │  │ IdentityReg.    │  │ ComplianceMod.  │         │
│  │  (ERC-3643)     │  │  (KYC Status)   │  │  (Rules)        │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│  ┌─────────────────┐                                                    │
│  │  AssetProof     │                                                    │
│  │  (Notarization) │                                                    │
│  └─────────────────┘                                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

## 1.2 Connection Strategies

| Strategy | Use Case | Example |
|----------|----------|---------|
| **Direct Web3** | Wallet connection, transactions | Frontend → Contract (mint, transfer) |
| **Backend API** | Data queries, business logic | Frontend → Backend → DB |
| **Hybrid** | Complex flows | Frontend → Backend → Contract → Frontend |

---

# 2. Smart Contracts (Week 2)

## 2.1 Contract Addresses (After Deployment)

```typescript
// frontend/src/web3/addresses.ts
export const CONTRACT_ADDRESSES = {
  UjamaaToken: '0x...',           // Deployed Week 2 Day 5
  IdentityRegistry: '0x...',       // Deployed Week 2 Day 5
  ComplianceModule: '0x...',       // Deployed Week 2 Day 5
  AssetProof: '0x...',             // Deployed Week 2 Day 5
} as const;

export const CHAIN_ID = 80002; // Polygon Amoy
```

## 2.2 Contract ABIs

After Week 2 deployment, ABIs are generated:

```bash
# ApeWorX generates these automatically
contracts/artifacts/
├── UjamaaToken.json
├── IdentityRegistry.json
├── ComplianceModule.json
└── AssetProof.json
```

Copy to frontend:
```bash
cp artifacts/*.json frontend/src/web3/abi/
```

## 2.3 Key Contract Functions

### UjamaaToken (ERC-3643)

```solidity
// Read functions (free, no gas)
function balanceOf(address account) view returns (uint256)
function totalSupply() view returns (uint256)
function getNavPerShare() view returns (uint256)

// Write functions (require gas)
function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE)
function burn(uint256 amount) external
function transfer(address to, uint256 amount) external override
```

### IdentityRegistry

```solidity
// Read
function isVerified(address user) external view returns (bool)
function getKycLevel(address user) external view returns (uint8)

// Write
function verifyIdentity(address user, uint256 identityId, uint8 kycLevel, string calldata jurisdiction) external onlyRole(ADMIN_ROLE)
function revokeIdentity(address user) external onlyRole(ADMIN_ROLE)
```

### AssetProof

```solidity
// Read
function verify(bytes32 dataHash) external view returns (bool)
function getTimestamp(bytes32 dataHash) external view returns (uint256)
function getSubmitter(bytes32 dataHash) external view returns (address)

// Write
function notarize(bytes32 dataHash) external onlyRole(ORIGINATOR_ROLE) returns (bool)
```

---

# 3. Backend Integration

## 3.1 Backend Setup

### Install Dependencies

```bash
# backend/requirements.txt
web3>=6.0.0
eth-ape>=0.7.0
pydantic>=2.0.0
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
asyncpg>=0.29.0
```

### Environment Variables

```bash
# backend/.env
# Blockchain
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
POLYGON_CHAIN_ID=80002

# Contract Addresses (from Week 2 deployment)
UJAMAA_TOKEN_ADDRESS=0x...
IDENTITY_REGISTRY_ADDRESS=0x...
COMPLIANCE_MODULE_ADDRESS=0x...
ASSET_PROOF_ADDRESS=0x...

# Admin
ADMIN_PRIVATE_KEY=0x...  # Store in secrets manager!
ADMIN_WALLET_ADDRESS=0x...
```

## 3.2 Web3.py Service Layer

### File: `backend/services/blockchain.py`

```python
from web3 import Web3
from web3.middleware import geth_poa_middleware
import json
import os
from typing import Optional

class BlockchainService:
    def __init__(self):
        # Connect to Polygon Amoy
        self.w3 = Web3(Web3.HTTPProvider(os.getenv('POLYGON_AMOY_RPC')))
        self.w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        
        # Load contract ABIs
        with open('artifacts/UjamaaToken.json') as f:
            self.token_abi = json.load(f)['abi']
        
        with open('artifacts/IdentityRegistry.json') as f:
            self.identity_abi = json.load(f)['abi']
        
        with open('artifacts/AssetProof.json') as f:
            self.asset_proof_abi = json.load(f)['abi']
        
        # Initialize contract instances
        self.token_contract = self.w3.eth.contract(
            address=os.getenv('UJAMAA_TOKEN_ADDRESS'),
            abi=self.token_abi
        )
        
        self.identity_contract = self.w3.eth.contract(
            address=os.getenv('IDENTITY_REGISTRY_ADDRESS'),
            abi=self.identity_abi
        )
        
        self.asset_proof_contract = self.w3.eth.contract(
            address=os.getenv('ASSET_PROOF_ADDRESS'),
            abi=self.asset_proof_abi
        )
    
    # === READ OPERATIONS (No gas) ===
    
    def get_token_balance(self, wallet_address: str) -> int:
        """Get token balance for a wallet"""
        return self.token_contract.functions.balanceOf(wallet_address).call()
    
    def is_identity_verified(self, wallet_address: str) -> bool:
        """Check if wallet is KYC verified"""
        return self.identity_contract.functions.isVerified(wallet_address).call()
    
    def get_kyc_level(self, wallet_address: str) -> int:
        """Get KYC level (1, 2, or 3)"""
        return self.identity_contract.functions.getKycLevel(wallet_address).call()
    
    def verify_production_hash(self, data_hash: str) -> bool:
        """Verify if production data hash exists on-chain"""
        return self.asset_proof_contract.functions.verify(data_hash).call()
    
    def get_notarization_timestamp(self, data_hash: str) -> int:
        """Get timestamp when hash was notarized"""
        return self.asset_proof_contract.functions.getTimestamp(data_hash).call()
    
    # === WRITE OPERATIONS (Require gas + private key) ===
    
    def mint_tokens(self, to_address: str, amount: int) -> str:
        """
        Mint tokens to an address
        Returns transaction hash
        """
        admin_key = os.getenv('ADMIN_PRIVATE_KEY')
        admin_address = os.getenv('ADMIN_WALLET_ADDRESS')
        
        # Build transaction
        tx = self.token_contract.functions.mint(
            to_address,
            amount
        ).build_transaction({
            'from': admin_address,
            'nonce': self.w3.eth.get_transaction_count(admin_address),
            'maxFeePerGas': self.w3.eth.gas_price,
            'maxPriorityFeePerGas': self.w3.eth.gas_price,
        })
        
        # Sign and send
        signed_tx = self.w3.eth.account.sign_transaction(tx, admin_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        # Wait for confirmation
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        if receipt['status'] == 1:
            return tx_hash.hex()
        else:
            raise Exception("Transaction failed")
    
    def notarize_production_data(self, data_hash: str, originator_key: str) -> str:
        """
        Notarize production data hash on-chain
        Returns transaction hash
        """
        originator_address = self.w3.eth.account.from_key(originator_key).address
        
        tx = self.asset_proof_contract.functions.notarize(data_hash).build_transaction({
            'from': originator_address,
            'nonce': self.w3.eth.get_transaction_count(originator_address),
            'maxFeePerGas': self.w3.eth.gas_price,
            'maxPriorityFeePerGas': self.w3.eth.gas_price,
        })
        
        signed_tx = self.w3.eth.account.sign_transaction(tx, originator_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        if receipt['status'] == 1:
            return tx_hash.hex()
        else:
            raise Exception("Notarization failed")
    
    # === EVENT LISTENERS ===
    
    def listen_to_mint_events(self, from_block: int = 'latest'):
        """Listen for mint events (for indexing)"""
        mint_event = self.token_contract.events.TokensMinted()
        
        # Get events
        events = mint_event.get_logs(fromBlock=from_block)
        
        for event in events:
            yield {
                'to': event['args']['to'],
                'amount': event['args']['amount'],
                'tx_hash': event['transactionHash'].hex(),
                'block_number': event['blockNumber'],
                'timestamp': self.w3.eth.get_block(event['blockNumber'])['timestamp']
            }
    
    def listen_to_notarization_events(self, from_block: int = 'latest'):
        """Listen for notarization events (for indexing)"""
        proof_event = self.asset_proof_contract.events.ProofNotarized()
        
        events = proof_event.get_logs(fromBlock=from_block)
        
        for event in events:
            yield {
                'data_hash': event['args']['dataHash'].hex(),
                'submitter': event['args']['submitter'],
                'timestamp': event['args']['timestamp'],
                'tx_hash': event['transactionHash'].hex(),
                'block_number': event['blockNumber']
            }
```

## 3.3 API Endpoints

### File: `backend/api/investments.py`

```python
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from backend.services.blockchain import BlockchainService
from backend.database import db

router = APIRouter()
blockchain = BlockchainService()

class InvestmentRequest(BaseModel):
    asset_id: str
    amount: float  # In USD
    wallet_address: str

class InvestmentResponse(BaseModel):
    success: bool
    tx_hash: Optional[str]
    tokens_minted: int
    message: str

@router.post("/api/v1/investments", response_model=InvestmentResponse)
async def create_investment(
    request: InvestmentRequest,
    current_user = Depends(get_current_user)  # Auth middleware
):
    """
    Create an investment:
    1. Verify user KYC status on-chain
    2. Mint tokens to user wallet
    3. Record investment in database
    """
    
    # Step 1: Check KYC on blockchain
    is_verified = blockchain.is_identity_verified(request.wallet_address)
    if not is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Wallet not KYC verified. Please complete onboarding."
        )
    
    # Step 2: Check KYC level for investment limit
    kyc_level = blockchain.get_kyc_level(request.wallet_address)
    max_investment = get_max_investment_for_kyc_level(kyc_level)
    
    if request.amount > max_investment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Investment exceeds KYC level {kyc_level} limit of ${max_investment}"
        )
    
    # Step 3: Mint tokens (backend manages MINTER_ROLE)
    try:
        tokens_to_mint = int(request.amount * 10**18)  # Convert to wei
        tx_hash = blockchain.mint_tokens(request.wallet_address, tokens_to_mint)
        
        # Step 4: Record in database
        await db.execute("""
            INSERT INTO investments 
            (user_id, asset_id, amount_usd, tokens, tx_hash, status)
            VALUES ($1, $2, $3, $4, $5, 'confirmed')
        """, current_user.id, request.asset_id, request.amount, tokens_to_mint, tx_hash)
        
        return InvestmentResponse(
            success=True,
            tx_hash=tx_hash,
            tokens_minted=tokens_to_mint,
            message="Investment successful"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Blockchain transaction failed: {str(e)}"
        )

@router.get("/api/v1/investments/{wallet_address}/balance")
async def get_token_balance(wallet_address: str):
    """Get token balance from blockchain"""
    balance = blockchain.get_token_balance(wallet_address)
    return {
        "balance": balance,
        "balance_formatted": balance / 10**18,  # Convert from wei
        "wallet": wallet_address
    }

@router.get("/api/v1/investments/{wallet_address}/verified")
async def check_kyc_status(wallet_address: str):
    """Check KYC verification status from blockchain"""
    is_verified = blockchain.is_identity_verified(wallet_address)
    kyc_level = blockchain.get_kyc_level(wallet_address)
    
    return {
        "verified": is_verified,
        "kyc_level": kyc_level,
        "wallet": wallet_address
    }
```

### File: `backend/api/industrial.py`

```python
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any
from backend.services.blockchain import BlockchainService
from backend.database import db
import hashlib
import json

router = APIRouter()
blockchain = BlockchainService()

class ProductionData(BaseModel):
    factory_id: str
    output: int
    date: str
    metadata: Optional[Dict[str, Any]] = None

class NotarizationResponse(BaseModel):
    success: bool
    data_hash: str
    tx_hash: str
    timestamp: int
    message: str

@router.post("/api/v1/industrial/notarize", response_model=NotarizationResponse)
async def notarize_production(
    data: ProductionData,
    current_user = Depends(get_current_user)
):
    """
    Notarize production data:
    1. Calculate SHA-256 hash
    2. Submit to AssetProof contract
    3. Store encrypted data in database
    """
    
    # Verify user has ORIGINATOR role
    if current_user.role != 'ORIGINATOR':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only originators can notarize production data"
        )
    
    # Step 1: Calculate hash
    data_dict = data.dict(sort_keys=True)
    data_json = json.dumps(data_dict)
    data_hash = hashlib.sha256(data_json.encode()).hexdigest()
    
    # Step 2: Check if already notarized
    exists = blockchain.verify_production_hash(f"0x{data_hash}")
    if exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Data hash already notarized"
        )
    
    # Step 3: Notarize on blockchain
    try:
        originator_key = get_originator_private_key(current_user.id)  # From secure vault
        tx_hash = blockchain.notarize_production_data(data_hash, originator_key)
        
        # Get timestamp from contract
        timestamp = blockchain.get_notarization_timestamp(f"0x{data_hash}")
        
        # Step 4: Store in database (encrypted)
        encrypted_data = encrypt_production_data(data_dict)
        await db.execute("""
            INSERT INTO industrial_proofs 
            (factory_id, data_hash, transaction_hash, data_encrypted, submitted_by, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
        """, data.factory_id, f"0x{data_hash}", tx_hash, encrypted_data, current_user.id)
        
        return NotarizationResponse(
            success=True,
            data_hash=f"0x{data_hash}",
            tx_hash=tx_hash,
            timestamp=timestamp,
            message="Production data notarized successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Notarization failed: {str(e)}"
        )

@router.get("/api/v1/industrial/verify/{data_hash}")
async def verify_notarization(data_hash: str):
    """Verify production data notarization"""
    exists = blockchain.verify_production_hash(data_hash)
    
    if not exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hash not found on blockchain"
        )
    
    timestamp = blockchain.get_notarization_timestamp(data_hash)
    submitter = blockchain.asset_proof_contract.functions.getSubmitter(data_hash).call()
    
    return {
        "exists": exists,
        "timestamp": timestamp,
        "submitter": submitter,
        "data_hash": data_hash
    }

@router.get("/api/v1/industrial/proofs/{user_id}")
async def get_user_proofs(user_id: str):
    """Get all notarized proofs for a user (from database)"""
    proofs = await db.fetch_all("""
        SELECT data_hash, transaction_hash, factory_id, created_at
        FROM industrial_proofs
        WHERE submitted_by = $1
        ORDER BY created_at DESC
    """, user_id)
    
    return {"proofs": proofs}
```

## 3.4 Database Schema

### File: `backend/database/schema.sql`

```sql
-- Investments table (tracks token minting)
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    asset_id UUID REFERENCES assets(id),
    amount_usd DECIMAL(18, 2) NOT NULL,
    tokens BIGINT NOT NULL,  -- Token amount in wei
    tx_hash VARCHAR(66) NOT NULL,  -- Blockchain transaction hash
    status VARCHAR(20) NOT NULL,  -- pending, confirmed, failed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_investments_user ON investments(user_id);
CREATE INDEX idx_investments_tx ON investments(tx_hash);

-- Industrial proofs table (tracks notarizations)
CREATE TABLE industrial_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factory_id VARCHAR(100) NOT NULL,
    data_hash VARCHAR(66) NOT NULL UNIQUE,  -- SHA-256 hash
    transaction_hash VARCHAR(66) NOT NULL,  -- Blockchain tx hash
    data_encrypted TEXT NOT NULL,  -- Encrypted production data
    submitted_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_proofs_hash ON industrial_proofs(data_hash);
CREATE INDEX idx_proofs_submitter ON industrial_proofs(submitted_by);

-- Blockchain events log (for indexing)
CREATE TABLE blockchain_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,  -- TokensMinted, ProofNotarized, etc.
    contract_address VARCHAR(42) NOT NULL,
    tx_hash VARCHAR(66) NOT NULL,
    block_number BIGINT NOT NULL,
    event_data JSONB NOT NULL,
    indexed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_type ON blockchain_events(event_type);
CREATE INDEX idx_events_tx ON blockchain_events(tx_hash);
```

---

# 4. Frontend Integration

## 4.1 Web3 Configuration

### File: `frontend/src/web3/config.ts`

```typescript
import { configureChains, createConfig } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonAmoy],
  [publicProvider()]
);

export const config = createConfig({
  autoConnect: true,
  publicClient,
  chains,
});
```

### File: `frontend/src/web3/addresses.ts`

```typescript
export const CONTRACT_ADDRESSES = {
  UjamaaToken: '0x1234567890abcdef1234567890abcdef12345678',
  IdentityRegistry: '0x2345678901abcdef2345678901abcdef23456789',
  ComplianceModule: '0x3456789012abcdef3456789012abcdef34567890',
  AssetProof: '0x4567890123abcdef4567890123abcdef45678901',
} as const;

export const EXPLORER_URL = 'https://amoy.polygonscan.com/tx/';
```

## 4.2 Custom Hooks

### File: `frontend/src/hooks/useUjamaaToken.ts`

```typescript
import { useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import UJAMAA_TOKEN_ABI from '../abi/UjamaaToken.json';
import { CONTRACT_ADDRESSES } from '../web3/addresses';

export function useUjamaaToken() {
  const queryClient = useQueryClient();

  // === READ OPERATIONS ===
  
  const { data: balance, refetch: refetchBalance } = useContractRead({
    address: CONTRACT_ADDRESSES.UjamaaToken,
    abi: UJAMAA_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [userAddress], // From useAccount()
    watch: true, // Auto-refetch on block change
  });

  const { data: totalSupply } = useContractRead({
    address: CONTRACT_ADDRESSES.UjamaaToken,
    abi: UJAMAA_TOKEN_ABI,
    functionName: 'totalSupply',
  });

  const { data: navPerShare } = useContractRead({
    address: CONTRACT_ADDRESSES.UjamaaToken,
    abi: UJAMAA_TOKEN_ABI,
    functionName: 'getNavPerShare',
  });

  // === WRITE OPERATIONS ===
  
  const {
    write: mint,
    data: mintTx,
    isLoading: isMintLoading,
    error: mintError,
  } = useContractWrite({
    address: CONTRACT_ADDRESSES.UjamaaToken,
    abi: UJAMAA_TOKEN_ABI,
    functionName: 'mint',
  });

  const {
    isLoading: isConfirming,
    isSuccess: isMintSuccess,
    data: mintReceipt,
  } = useWaitForTransaction({
    hash: mintTx?.hash,
  });

  // === HELPER FUNCTIONS ===
  
  const handleMint = async (toAddress: string, amount: number) => {
    try {
      const tokens = BigInt(amount * 1e18); // Convert to wei
      await mint({ args: [toAddress, tokens] });
      
      // Wait for confirmation
      if (mintReceipt) {
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['balance'] });
        queryClient.invalidateQueries({ queryKey: ['totalSupply'] });
        
        // Call backend to record investment
        await fetch('/api/v1/investments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toAddress,
            amount,
            txHash: mintReceipt.transactionHash,
          }),
        });
      }
      
      return { success: true, hash: mintReceipt?.transactionHash };
    } catch (error) {
      console.error('Mint failed:', error);
      return { success: false, error };
    }
  };

  return {
    // Read
    balance,
    totalSupply,
    navPerShare,
    
    // Write
    mint: handleMint,
    isMintLoading,
    isConfirming,
    isMintSuccess,
    mintError,
    
    // Helpers
    refetchBalance,
  };
}
```

### File: `frontend/src/hooks/useIdentity.ts`

```typescript
import { useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import IDENTITY_REGISTRY_ABI from '../abi/IdentityRegistry.json';
import { CONTRACT_ADDRESSES } from '../web3/addresses';

export function useIdentity() {
  // Check if wallet is verified
  const { data: isVerified } = useContractRead({
    address: CONTRACT_ADDRESSES.IdentityRegistry,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: 'isVerified',
    args: [userAddress],
  });

  // Get KYC level
  const { data: kycLevel } = useContractRead({
    address: CONTRACT_ADDRESSES.IdentityRegistry,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: 'getKycLevel',
    args: [userAddress],
  });

  // Get jurisdiction
  const { data: jurisdiction } = useContractRead({
    address: CONTRACT_ADDRESSES.IdentityRegistry,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: 'getJurisdiction',
    args: [userAddress],
  });

  return {
    isVerified: isVerified ?? false,
    kycLevel: kycLevel ?? 0,
    jurisdiction: jurisdiction ?? 'Unknown',
    isLoading: !isVerified && !kycLevel,
  };
}
```

### File: `frontend/src/hooks/useAssetProof.ts`

```typescript
import { useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import ASSET_PROOF_ABI from '../abi/AssetProof.json';
import { CONTRACT_ADDRESSES } from '../web3/addresses';

export function useAssetProof() {
  // Verify hash
  const { data: isVerified } = useContractRead({
    address: CONTRACT_ADDRESSES.AssetProof,
    abi: ASSET_PROOF_ABI,
    functionName: 'verify',
    args: [dataHash],
  });

  // Get timestamp
  const { data: timestamp } = useContractRead({
    address: CONTRACT_ADDRESSES.AssetProof,
    abi: ASSET_PROOF_ABI,
    functionName: 'getTimestamp',
    args: [dataHash],
  });

  // Notarize
  const {
    write: notarize,
    data: notarizeTx,
    isLoading: isNotarizeLoading,
  } = useContractWrite({
    address: CONTRACT_ADDRESSES.AssetProof,
    abi: ASSET_PROOF_ABI,
    functionName: 'notarize',
  });

  const {
    isLoading: isConfirming,
    isSuccess: isNotarizeSuccess,
  } = useWaitForTransaction({
    hash: notarizeTx?.hash,
  });

  return {
    isVerified: isVerified ?? false,
    timestamp,
    notarize,
    isNotarizeLoading,
    isConfirming,
    isNotarizeSuccess,
    txHash: notarizeTx?.hash,
  };
}
```

## 4.3 React Components

### Investment Flow Component

### File: `frontend/src/components/invest/InvestForm.tsx`

```typescript
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useUjamaaToken } from '../../hooks/useUjamaaToken';
import { useIdentity } from '../../hooks/useIdentity';
import { Button, Input, Card } from '../ui';
import { getExplorerUrl } from '../../utils/web3';

interface InvestFormProps {
  assetId: string;
  assetName: string;
  onSuccess?: () => void;
}

export function InvestForm({ assetId, assetName, onSuccess }: InvestFormProps) {
  const { address, isConnected } = useAccount();
  const { mint, isMintLoading, isConfirming, isMintSuccess, mintError } = useUjamaaToken();
  const { isVerified, kycLevel } = useIdentity();
  const [amount, setAmount] = useState('');

  const handleInvest = async () => {
    if (!isConnected) {
      alert('Please connect wallet first');
      return;
    }

    if (!isVerified) {
      alert('Please complete KYC verification first');
      return;
    }

    const result = await mint(address!, parseFloat(amount));
    
    if (result.success) {
      onSuccess?.();
      setAmount('');
    }
  };

  // Check investment limits based on KYC level
  const getMaxInvestment = () => {
    switch (kycLevel) {
      case 1: return 10000;
      case 2: return 100000;
      case 3: return Infinity;
      default: return 0;
    }
  };

  const maxInvestment = getMaxInvestment();

  return (
    <Card padding="lg">
      <h3 className="text-lg font-bold mb-4">Invest in {assetName}</h3>
      
      {!isConnected && (
        <div className="text-center py-4">
          <p className="text-gray-600 mb-4">Connect wallet to invest</p>
          <ConnectButton />
        </div>
      )}

      {!isVerified && isConnected && (
        <div className="text-center py-4">
          <p className="text-orange-600 mb-4">KYC verification required</p>
          <Button onClick={() => navigate('/onboarding/investor')}>
            Complete KYC
          </Button>
        </div>
      )}

      {isVerified && isConnected && (
        <div className="space-y-4">
          <Input
            label="Investment Amount (USD)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
            max={maxInvestment}
            helperText={kycLevel < 3 ? `Max: $${maxInvestment.toLocaleString()} (KYC Level ${kycLevel})` : 'No limit'}
          />

          <Button
            onClick={handleInvest}
            loading={isMintLoading || isConfirming}
            disabled={!amount || parseFloat(amount) > maxInvestment}
            fullWidth
          >
            {isConfirming ? 'Confirming on Blockchain...' : 'Invest Now'}
          </Button>

          {mintError && (
            <div className="text-red-600 text-sm">
              Error: {mintError.message}
            </div>
          )}

          {isMintSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 p-4 rounded">
              <p className="text-green-800 font-semibold">✓ Investment Successful!</p>
              <a
                href={getExplorerUrl(mintTxHash!)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline text-sm"
              >
                View on Polygonscan →
              </a>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
```

### Notarization Component

### File: `frontend/src/components/industrial/NotarizeForm.tsx`

```typescript
import { useState } from 'react';
import { useAssetProof } from '../../hooks/useAssetProof';
import { Button, Card, Input } from '../ui';
import { calculateSHA256, getExplorerUrl } from '../../utils/web3';

export function NotarizeForm() {
  const { notarize, isNotarizeLoading, isConfirming, isNotarizeSuccess, txHash } = useAssetProof();
  const [data, setData] = useState('');
  const [hash, setHash] = useState('');
  const [step, setStep] = useState<'input' | 'review' | 'submit'>('input');

  const handleCalculateHash = async () => {
    const calculatedHash = await calculateSHA256(data);
    setHash(calculatedHash);
    setStep('review');
  };

  const handleSubmit = async () => {
    try {
      // Call backend API first
      const response = await fetch('/api/v1/industrial/notarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: JSON.parse(data) }),
      });

      const result = await response.json();

      if (result.success) {
        setStep('submit');
      }
    } catch (error) {
      console.error('Notarization failed:', error);
    }
  };

  return (
    <Card padding="lg">
      <h3 className="text-lg font-bold mb-4">Notarize Production Data</h3>

      {step === 'input' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Production Data (JSON)
            </label>
            <textarea
              className="w-full p-3 border rounded-lg font-mono text-sm"
              rows={8}
              placeholder='{"factory_id": "GDIZ-001", "output": 1000, "date": "2026-03-09"}'
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>

          <Button onClick={handleCalculateHash} disabled={!data} fullWidth>
            Calculate Hash
          </Button>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <label className="block text-sm font-medium mb-2">SHA-256 Hash</label>
            <code className="block p-2 bg-white dark:bg-gray-900 rounded text-xs break-all">
              {hash}
            </code>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep('input')}>
              Back
            </Button>
            <Button onClick={handleSubmit} loading={isNotarizeLoading} fullWidth>
              Notarize on Blockchain
            </Button>
          </div>
        </div>
      )}

      {step === 'submit' && txHash && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="text-xl font-bold mb-2">Notarization Successful!</h4>
          <p className="text-gray-600 mb-4">Your production data has been recorded on Polygon Amoy</p>
          <a
            href={getExplorerUrl(txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ujamaa-primary hover:underline"
          >
            View Transaction →
          </a>
        </div>
      )}
    </Card>
  );
}
```

---

# 5. Data Flow Examples

## 5.1 Investment Flow (Complete)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         INVESTMENT FLOW                                   │
│                                                                           │
│  1. User connects wallet (MetaMask)                                      │
│     Frontend: useAccount() → address                                     │
│                                                                           │
│  2. User clicks "Invest" ($1000)                                         │
│     Frontend: InvestForm.tsx                                             │
│                                                                           │
│  3. Check KYC on-chain                                                   │
│     Frontend → Blockchain: isVerified(address)                           │
│     Result: true (KYC Level 2)                                           │
│                                                                           │
│  4. Mint tokens (backend has MINTER_ROLE)                                │
│     Frontend → Backend API: POST /api/v1/investments                     │
│     Backend → Blockchain: token.mint(address, 1000 * 1e18)               │
│     Blockchain: Transaction submitted (tx_hash: 0x...)                   │
│     Backend → PostgreSQL: INSERT investment record                       │
│     Backend → Frontend: { success: true, tx_hash: "0x..." }              │
│                                                                           │
│  5. Wait for confirmation                                                │
│     Frontend: useWaitForTransaction({ hash })                            │
│     Blockchain: Block confirmed (~2-5 seconds on Amoy)                   │
│                                                                           │
│  6. Update UI                                                            │
│     Frontend: Query invalidation → refresh balance                       │
│     Frontend: Show success message with Polygonscan link                 │
│                                                                           │
│  7. User sees tokens in dashboard                                        │
│     Frontend → Blockchain: token.balanceOf(address)                      │
│     Display: 1000 tokens                                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

## 5.2 Notarization Flow (Complete)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       NOTARIZATION FLOW                                   │
│                                                                           │
│  1. Industrial user enters production data                               │
│     Frontend: NotarizeForm.tsx                                           │
│     Input: {"factory_id": "GDIZ-001", "output": 1000}                    │
│                                                                           │
│  2. Calculate SHA-256 hash                                               │
│     Frontend: calculateSHA256(data) → "0x7d8f..."                        │
│                                                                           │
│  3. Submit to backend                                                    │
│     Frontend → Backend: POST /api/v1/industrial/notarize                 │
│     Body: { data: {...} }                                                │
│                                                                           │
│  4. Backend notarizes on-chain                                           │
│     Backend → Blockchain: assetProof.notarize("0x7d8f...")               │
│     Blockchain: Transaction submitted                                    │
│     Backend → PostgreSQL: INSERT proof record (encrypted data)           │
│     Backend → Frontend: { success: true, tx_hash: "0x...", hash: "0x..." }│
│                                                                           │
│  5. Wait for confirmation                                                │
│     Frontend: useWaitForTransaction()                                    │
│     Blockchain: Block confirmed                                          │
│                                                                           │
│  6. Display success                                                      │
│     Frontend: Show success with Polygonscan link                         │
│     Frontend: Add to notarization history                                │
│                                                                           │
│  7. Anyone can verify later                                              │
│     Frontend → Backend: GET /api/v1/industrial/verify/0x7d8f...          │
│     Backend → Blockchain: assetProof.verify("0x7d8f...") → true          │
│     Backend → Frontend: { exists: true, timestamp: 1234567890 }          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 6. Security Considerations

## 6.1 Private Key Management

**NEVER store private keys in:**
- ❌ Frontend code
- ❌ Environment variables (in production)
- ❌ Database
- ❌ Git repository

**DO store private keys in:**
- ✅ HashiCorp Vault
- ✅ AWS Secrets Manager
- ✅ Azure Key Vault
- ✅ GCP Secret Manager

## 6.2 Transaction Signing

**Backend Signing (for MINTER_ROLE):**
```python
# Use secure key management
from azure.keyvault.keys import KeyClient
from web3 import Account

# Get key from vault (not environment!)
vault_client = KeyClient(vault_url=os.getenv('VAULT_URL'))
private_key = vault_client.get_secret('admin-signing-key')

# Sign transaction
signed_tx = w3.eth.account.sign_transaction(tx, private_key)
```

**Frontend Signing (user transactions):**
```typescript
// Users sign with their own wallets (MetaMask)
// Backend never sees user private keys
const { write } = useContractWrite({
  // wagmi handles signing via browser wallet
});
```

## 6.3 Access Control

| Function | Role | Who Has It |
|----------|------|------------|
| `mint()` | MINTER_ROLE | Backend service |
| `verifyIdentity()` | ADMIN_ROLE | Admin users |
| `notarize()` | ORIGINATOR_ROLE | Industrial partners |
| `transfer()` | Any verified user | Investors |

## 6.4 Rate Limiting

```python
# backend/middleware/rate_limit.py
from fastapi import Request, HTTPException
from slowapi import Limiter

limiter = Limiter(key_func=get_remote_address)

@router.post("/api/v1/investments")
@limiter.limit("10/minute")  # Max 10 investments per minute
async def create_investment(request: Request, ...):
    ...
```

---

**Document Version:** 1.0  
**Last Updated:** March 9, 2026  
**Next Review:** After Week 2 deployment
