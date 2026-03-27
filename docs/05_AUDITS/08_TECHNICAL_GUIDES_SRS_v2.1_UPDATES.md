# Technical Guides - SRS v2.1 Updates

**Date:** March 25, 2026  
**Phase:** P1 Technical Guides  
**Status:** Complete  

---

## Summary

This document provides complete updates for all 5 Technical Guides to align with SRS v2.1. Each section can be merged into the respective guide.

---

# 1. Deployment Guide Updates 🆕

**Target:** `docs/02_TECHNICAL_GUIDES/01_DEPLOYMENT_GUIDE.md`  
**Version Update:** v2.0 → v2.1  

## 1.1 New Section: Fireblocks Deployment

**Add after Section 4 (Terraform Infrastructure as Code):**

### 4.5 Fireblocks Integration Deployment

**Fireblocks Setup:**

1. **Create Fireblocks Account**
   ```
   - Sign up at https://www.fireblocks.com/
   - Complete FSC Mauritius compliance verification
   - Receive API credentials
   ```

2. **Configure Fireblocks Vault**
   ```bash
   # Environment variables
   FIREBLOCKS_API_KEY="your_api_key"
   FIREBLOCKS_SECRET_KEY="your_secret_key"  # Store in HSM
   FIREBLOCKS_BASE_URL="https://api.fireblocks.io"  # Production
   FIREBLOCKS_VAULT_ID="platform_treasury_001"
   ```

3. **Deploy Fireblocks Integration Service**
   ```yaml
   # kubernetes/fireblocks-deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: fireblocks-service
   spec:
     replicas: 2
     selector:
       matchLabels:
         app: fireblocks-service
     template:
       metadata:
         labels:
           app: fireblocks-service
       spec:
         containers:
         - name: fireblocks-service
           image: ujamaa-defi/fireblocks-service:v2.1
           env:
           - name: FIREBLOCKS_API_KEY
             valueFrom:
               secretKeyRef:
                 name: fireblocks-secrets
                 key: api-key
           - name: FIREBLOCKS_SECRET_KEY
             valueFrom:
               secretKeyRef:
                 name: fireblocks-secrets
                 key: secret-key
           ports:
           - containerPort: 8008
   ```

4. **Configure Multisig Policy**
   ```
   Policy: Platform Treasury Withdrawals
   - Required Approvers: 3-of-5
   - Approvers:
     * CEO
     * CFO
     * Compliance Officer
     * Platform Admin
     * Security Officer
   - Velocity Limits:
     * Daily: €5,000,000
     * Per Transaction: €2,000,000
   - Time Lock: 4 hours for transactions >€500,000
   ```

**Scope Note:** Fireblocks is for **platform treasury and pool assets only**, NOT for end-user custody.

## 1.2 New Section: Bank Escrow Deployment

### 4.6 Bank Escrow Deployment

**MVP (Testnet) - Mock Bank Escrow:**

1. **Deploy MockEscrow Contract**
   ```bash
   # Deploy to Polygon Amoy
   ape run scripts/mvp/deploy_mock_escrow.py --network polygon-amoy
   ```

2. **Configure Mock Bank Service**
   ```yaml
   # config/mock_bank.yaml
   mock_bank:
     enabled: true
     initial_balance: "10000000.00"  # €10M test balance
     currency: EUR
     supported_operations:
       - wire_transfer
       - balance_inquiry
       - mobile_money
   ```

**Production - Real Bank Integration:**

1. **BIIC/MCB API Credentials**
   ```bash
   # Environment variables (production)
   BIIC_API_URL="https://api.biic.mu/corporate"
   BIIC_CLIENT_ID="ujamaa_defi_client"
   BIIC_CLIENT_SECRET="store_in_hsm"
   
   MCB_API_URL="https://api.mcb.mu/corporate"
   MCB_USERNAME="ujamaa_escrow"
   MCB_PASSWORD="store_in_hsm"
   ```

2. **Deploy Bank Integration Service**
   ```yaml
   # kubernetes/bank-integration-deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: bank-integration-service
   spec:
     replicas: 2  # High availability
     selector:
       matchLabels:
         app: bank-integration-service
     template:
       spec:
         containers:
         - name: bank-integration-service
           image: ujamaa-defi/bank-integration-service:v2.1
           env:
           - name: BIIC_API_URL
             valueFrom:
               configMapKeyRef:
                 name: bank-config
                 key: biic-url
           - name: BIIC_CLIENT_ID
             valueFrom:
               secretKeyRef:
                 name: bank-secrets
                 key: biic-client-id
   ```

## 1.3 New Section: uLP/UJG Contract Deployment

### 5.5 Institutional Contract Deployment

**Deploy uLP Token Contract:**

```bash
# 1. Compile contracts
ape compile

# 2. Deploy to Polygon Amoy (testnet)
ape run scripts/institutional/deploy_ulp.py \
  --network polygon-amoy \
  --pool-id pool_industrie_001 \
  --nav-oracle 0x1234567890abcdef \
  --liquidity-pool 0xabcdef1234567890

# 3. Verify on Etherscan
ape etherscan-verify UjamaaPoolToken \
  --address 0xNewContractAddress \
  --network polygon-amoy
```

**Deploy UJG Token Contract:**

```bash
# Deploy GuaranteeToken
ape run scripts/institutional/deploy_ujg.py \
  --network polygon-amoy \
  --pool-address 0xLiquidityPoolAddress \
  --gateway-address 0xIndustrialGatewayAddress

# Expected output:
# GuaranteeToken deployed at: 0xUJGContractAddress
```

**Deploy LiquidityPool Contract:**

```bash
# Deploy LiquidityPool
ape run scripts/institutional/deploy_pool.py \
  --network polygon-amoy \
  --pool-family POOL_INDUSTRIE \
  --target-size 10000000 \
  --min-investment 100000 \
  --management-fee-bps 200 \
  --performance-fee-bps 2000
```

**Configuration:**

```python
# scripts/institutional/config.py
POOL_CONFIG = {
    "POOL_INDUSTRIE": {
        "target_size": "10000000.00",  # €10M
        "min_investment": "100000.00",  # €100K
        "max_single_asset_pct": 10,  # Max 10% per industrial
        "min_assets": 5,  # Min 5 assets for diversification
        "management_fee_bps": 200,  # 2% annual
        "performance_fee_bps": 2000,  # 20% of yield
    },
    "POOL_AGRICULTURE": {
        "target_size": "5000000.00",  # €5M
        "min_investment": "100000.00",
        # ... similar config
    }
}
```

## 1.4 Updated: Environment Configuration

**Add to Section 6:**

### 6.4 Institutional Architecture Environment Variables

```bash
# .env.production (institutional features)

# uLP Token Configuration
ULP_TOKEN_ADDRESS="0x..."
ULP_NAV_ORACLE_ADDRESS="0x..."
ULP_LIQUIDITY_POOL_ADDRESS="0x..."

# UJG Token Configuration
UJG_TOKEN_ADDRESS="0x..."
UJG_INDUSTRIAL_GATEWAY_ADDRESS="0x..."

# Fireblocks Configuration
FIREBLOCKS_ENABLED=true
FIREBLOCKS_API_KEY="..."
FIREBLOCKS_VAULT_ID="platform_treasury_001"

# Bank Escrow Configuration
BANK_ESCROW_ENABLED=true
BANK_ESCROW_PROVIDER="BIIC"  # or "MCB"
BANK_ESCROW_ACCOUNT_ID="..."

# Mobile Money Configuration
MOBILE_MONEY_ENABLED=true
MOBILE_MONEY_PROVIDERS="M-PESA,MTN,AIRTEL"

# SIWE Authentication
SIWE_DOMAIN="ujamaa.defi"
SIWE_CHAIN_ID=137  # Polygon mainnet
SIWE_NONCE_TTL=300  # 5 minutes

# JWT Configuration
JWT_PUBLIC_KEY_PATH="/secrets/jwt/public.pem"
JWT_PRIVATE_KEY_PATH="/secrets/jwt/private.pem"  # HSM-stored
JWT_ACCESS_EXPIRY=2592000  # 30 days
JWT_REFRESH_EXPIRY=604800  # 7 days

# Session Management
SESSION_IDLE_TIMEOUT=900  # 15 minutes
SESSION_ABSOLUTE_TIMEOUT=28800  # 8 hours
SESSION_MAX_CONCURRENT=5

# Compliance Configuration
KYB_THRESHOLD=100000  # €100K
INSTITUTIONAL_MINIMUM=1000000  # €1M
STRICTEST_JURISDICTION_LIST="CU,IR,KP,SY,YE,MM"
```

## 1.5 Updated: Deployment Checklist

**Add to Section 1.3:**

### Institutional Architecture Checklist

- [ ] Fireblocks API credentials configured
- [ ] Fireblocks vault created (platform treasury)
- [ ] Fireblocks multisig policy set (3-of-5)
- [ ] Bank escrow accounts opened (BIIC/MCB)
- [ ] MockEscrow contract deployed (MVP testnet)
- [ ] uLP token contract deployed
- [ ] UJG token contract deployed
- [ ] LiquidityPool contract deployed
- [ ] NAV oracle configured
- [ ] SIWE authentication tested
- [ ] RBAC permissions verified
- [ ] KYB threshold enforced (€100K)
- [ ] Strictest jurisdiction list loaded
- [ ] Smoke tests passed (uLP deposit/redeem)
- [ ] Security audit completed

---

# 2. Technology Stack Reference Updates 🆕

**Target:** `docs/02_TECHNICAL_GUIDES/02_TECHNOLOGY_STACK_REFERENCE.md`  
**Version Update:** v1.0 → v2.1  

## 2.1 New Section: Institutional Architecture Technologies

### Add to Technology Stack Table:

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **SIWE** | @spruceid/siwe | 2.x | Sign-In with Ethereum |
| **JWT** | python-jose | 3.x | JWT encoding/decoding (backend) |
| **JWT** | @panva/jose | 5.x | JWT handling (frontend) |
| **Fireblocks SDK** | fireblocks-sdk | 3.x | Institutional custody integration |
| **Redis** | redis-py | 5.x | Session storage |
| **SIWE (Python)** | siwe | 2.x | SIWE verification (backend) |

### 2.1.1 SIWE Libraries

**Frontend (TypeScript):**
```json
{
  "dependencies": {
    "@spruceid/siwe": "^2.3.0",
    "ethers": "^6.11.0",
    "wagmi": "^1.4.0"
  }
}
```

**Usage Example:**
```typescript
import { SiweMessage } from 'siwe';

async function login(wallet: string, signer: ethers.Signer) {
  // 1. Request nonce from backend
  const response = await fetch(`/api/v1/auth/nonce?wallet=${wallet}`);
  const { nonce, message } = await response.json();
  
  // 2. Create SIWE message
  const siweMessage = new SiweMessage({
    domain: 'ujamaa.defi',
    address: wallet,
    statement: 'Sign in to UJAMAA DeFi',
    uri: 'https://ujamaa.defi',
    version: '1',
    chainId: 80002,  // Polygon Amoy
    nonce: nonce,
  });
  
  // 3. Sign message
  const signature = await signer.signMessage(siweMessage.toMessage());
  
  // 4. Submit to backend
  const loginResponse = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallet, signature, nonce }),
  });
  
  return loginResponse.json();
}
```

**Backend (Python):**
```python
# requirements.txt
siwe==2.1.0
python-jose[cryptography]==3.3.0
eth-account==0.10.0
```

**Usage Example:**
```python
from siwe import SiweMessage
from jose import jwt

async def verify_siwe(wallet: str, signature: str, message: str):
    """Verify SIWE signature and return authenticated address"""
    siwe_message = SiweMessage(message)
    
    # Verify signature recovers correct address
    verified_address = siwe_message.verify(signature=signature)
    
    if verified_address.lower() != wallet.lower():
        raise HTTPException(401, "Signature verification failed")
    
    return verified_address

def generate_jwt(wallet: str, role: str, kyc_status: str):
    """Generate JWT access token"""
    payload = {
        "sub": wallet,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(days=30),
        "jti": str(uuid.uuid4()),
        "role": role,
        "kyc_status": kyc_status,
        "wallet": wallet
    }
    
    with open(settings.JWT_PRIVATE_KEY_PATH, 'r') as f:
        private_key = f.read()
    
    token = jwt.encode(payload, private_key, algorithm='RS256')
    return token
```

### 2.1.2 Fireblocks SDK

**Installation:**
```bash
pip install fireblocks-sdk
```

**Usage Example:**
```python
from fireblocks_sdk import FireblocksSDK

# Initialize SDK
fb_sdk = FireblocksSDK(
    private_key=settings.FIREBLOCKS_SECRET_KEY,
    api_key=settings.FIREBLOCKS_API_KEY,
    base_url=settings.FIREBLOCKS_BASE_URL
)

# Get vault balance
vault_accounts = fb_sdk.get_vault_accounts()
treasury = vault_accounts[0]  # Platform treasury

# Initiate transfer (requires 3-of-5 multisig)
transaction = fb_sdk.create_transaction(
    vault_account_id="platform_treasury_001",
    asset_id="EUROD",  # Euro Coin on Fireblocks
    amount="100000.00",
    destination_address="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    note="Pool deployment - Factory A financing"
)
```

### 2.1.3 Redis for Session Management

**Installation:**
```bash
pip install redis
```

**Usage Example:**
```python
import redis
import json
from datetime import timedelta

redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    decode_responses=True
)

def store_nonce(wallet: str, nonce: str, ttl_seconds: int = 300):
    """Store SIWE nonce in Redis"""
    key = f"auth:nonce:{wallet}"
    redis_client.setex(key, timedelta(seconds=ttl_seconds), nonce)

def get_nonce(wallet: str) -> str:
    """Retrieve SIWE nonce"""
    key = f"auth:nonce:{wallet}"
    return redis_client.get(key)

def store_session(wallet: str, session_data: dict, ttl_seconds: int = 28800):
    """Store user session"""
    key = f"auth:session:{wallet}:{session_data['session_id']}"
    redis_client.setex(key, timedelta(seconds=ttl_seconds), json.dumps(session_data))

def blacklist_jwt(jti: str, expiry_seconds: int):
    """Blacklist JWT token (revocation)"""
    key = f"auth:blacklist:{jti}"
    redis_client.setex(key, timedelta(seconds=expiry_seconds), "1")

def is_jwt_blacklisted(jti: str) -> bool:
    """Check if JWT is blacklisted"""
    key = f"auth:blacklist:{jti}"
    return redis_client.exists(key) > 0
```

## 2.2 Updated: Smart Contract Technologies

**Add to Smart Contract section:**

| Contract Type | Standard | Library | Version |
|---------------|----------|---------|---------|
| **uLP Token** | ERC-3643 + ERC-20 | @tokeny/erc3643 | 3.x |
| **UJG Token** | ERC-3643NFT (ERC-721 + compliance) | @tokeny/erc3643 | 3.x |
| **LiquidityPool** | Custom | OpenZeppelin | 5.4.0 |
| **NavOracle** | Custom | Chainlink | 2.x |

---

# 3. Backend Integration Guide Updates 🆕

**Target:** `docs/02_TECHNICAL_GUIDES/03_BACKEND_INTEGRATION_GUIDE.md`  
**Version Update:** v1.0 → v2.1  

## 3.1 New Section: SIWE Authentication Implementation

### Add as Section 4.5:

### 4.5 SIWE Authentication Implementation

**Step 1: Create Auth Service**

```python
# services/auth_service.py
from siwe import SiweMessage
from jose import jwt
import uuid
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends
from redis import Redis

class AuthService:
    def __init__(self, redis_client: Redis):
        self.redis = redis_client
        self.jwt_private_key = settings.JWT_PRIVATE_KEY
        self.jwt_public_key = settings.JWT_PUBLIC_KEY
    
    def generate_nonce(self, wallet: str) -> dict:
        """Generate cryptographically random nonce"""
        nonce = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(minutes=5)
        
        # Store in Redis with 5-minute TTL
        self.redis.setex(
            f"auth:nonce:{wallet}",
            timedelta(minutes=5),
            nonce
        )
        
        return {
            "nonce": nonce,
            "expiresAt": expires_at.isoformat() + "Z"
        }
    
    async def verify_and_login(
        self,
        wallet: str,
        signature: str,
        nonce: str,
        message: str
    ) -> dict:
        """Verify SIWE signature and generate JWT"""
        # 1. Verify nonce exists and matches
        stored_nonce = self.redis.get(f"auth:nonce:{wallet}")
        if not stored_nonce or stored_nonce != nonce:
            raise HTTPException(401, "Invalid or expired nonce")
        
        # 2. Verify SIWE signature
        try:
            siwe_message = SiweMessage(message)
            verified_address = siwe_message.verify(signature=signature)
            
            if verified_address.lower() != wallet.lower():
                raise HTTPException(401, "Signature verification failed")
        except Exception as e:
            raise HTTPException(401, f"SIWE verification failed: {str(e)}")
        
        # 3. Get user role and KYC status from database
        user = await self._get_user_by_wallet(wallet)
        if not user:
            raise HTTPException(401, "User not found")
        
        # 4. Generate JWT
        access_token = self._generate_jwt(
            wallet=wallet,
            role=user.role,
            kyc_status=user.kyc_status
        )
        refresh_token = self._generate_jwt(
            wallet=wallet,
            role=user.role,
            kyc_status=user.kyc_status,
            token_type="refresh"
        )
        
        # 5. Store session in Redis
        session_id = str(uuid.uuid4())
        session_data = {
            "wallet": wallet,
            "jti": session_id,
            "expires_at": datetime.utcnow() + timedelta(hours=8)
        }
        self.redis.setex(
            f"auth:session:{wallet}:{session_id}",
            timedelta(hours=8),
            json.dumps(session_data)
        )
        
        return {
            "accessToken": access_token,
            "refreshToken": refresh_token,
            "expiresAt": session_data["expires_at"].isoformat() + "Z"
        }
    
    def _generate_jwt(
        self,
        wallet: str,
        role: str,
        kyc_status: str,
        token_type: str = "access"
    ) -> str:
        """Generate JWT token"""
        expiry = timedelta(days=30) if token_type == "access" else timedelta(days=7)
        
        payload = {
            "sub": wallet,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + expiry,
            "jti": str(uuid.uuid4()),
            "role": role,
            "kyc_status": kyc_status,
            "wallet": wallet
        }
        
        return jwt.encode(payload, self.jwt_private_key, algorithm='RS256')
```

**Step 2: Create Auth Routes**

```python
# api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException
from services.auth_service import AuthService
from redis import get_redis_client

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/nonce")
async def get_nonce(wallet: str, auth_service: AuthService = Depends()):
    """Request nonce for SIWE authentication"""
    return auth_service.generate_nonce(wallet)

@router.post("/login")
async def login(
    wallet: str,
    signature: str,
    nonce: str,
    message: str,
    auth_service: AuthService = Depends()
):
    """SIWE login"""
    return await auth_service.verify_and_login(wallet, signature, nonce, message)

@router.post("/refresh")
async def refresh_token(refresh_token: str, auth_service: AuthService = Depends()):
    """Refresh JWT token"""
    return auth_service.refresh_access_token(refresh_token)

@router.post("/logout")
async def logout(
    current_user: dict = Depends(get_current_user),
    auth_service: AuthService = Depends()
):
    """Logout and invalidate all sessions"""
    auth_service.invalidate_sessions(current_user["wallet"])
    return {"success": True, "message": "All sessions invalidated"}
```

**Step 3: Create RBAC Middleware**

```python
# middleware/rbac.py
from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Validate JWT and extract user claims"""
    try:
        # Check if token is blacklisted
        payload = jwt.decode(token, settings.JWT_PUBLIC_KEY, algorithms=["RS256"])
        jti = payload.get("jti")
        
        if is_jwt_blacklisted(jti):
            raise HTTPException(401, "Token has been revoked")
        
        wallet = payload.get("sub")
        if wallet is None:
            raise HTTPException(401, "Invalid token")
        
        return payload
    except JWTError:
        raise HTTPException(401, "Token validation failed")

async def require_role(required_role: str):
    """Enforce role-based access control"""
    async def role_checker(current_user: dict = Depends(get_current_user)):
        user_role = current_user.get("role")
        
        if user_role != required_role and not is_admin(user_role):
            # Log permission denial
            await audit_log.log(
                event="permission_denied",
                wallet=current_user.get("sub"),
                role=user_role,
                required_role=required_role
            )
            
            raise HTTPException(403, "Insufficient permissions")
        
        return current_user
    
    return role_checker

# Usage in routes
@router.get("/pools")
async def list_pools(
    user: dict = Depends(require_role("INSTITUTIONAL_INVESTOR"))
):
    return await pool_service.list_pools()
```

## 3.2 New Section: Liquidity Pool Service

### Add as Section 5.5:

### 5.5 Liquidity Pool Service Implementation

**Pool Service:**

```python
# services/pool_service.py
from decimal import Decimal
from typing import List, Optional

class PoolService:
    async def create_pool(
        self,
        name: str,
        family: str,
        target_size: Decimal,
        min_investment: Decimal = Decimal("100000.00"),
        management_fee_bps: int = 200,
        performance_fee_bps: int = 2000
    ) -> Pool:
        """Create new liquidity pool"""
        pool = Pool(
            id=str(uuid.uuid4()),
            name=name,
            family=family,
            target_size=target_size,
            min_investment=min_investment,
            management_fee_bps=management_fee_bps,
            performance_fee_bps=performance_fee_bps,
            total_value_locked=Decimal("0"),
            nav_per_share=Decimal("1.00000000"),  # Start at €1.00
            total_shares=Decimal("0")
        )
        
        await self.db.pools.insert(pool)
        
        # Deploy smart contract
        contract_address = await self._deploy_pool_contract(pool)
        pool.contract_address = contract_address
        
        return pool
    
    async def deposit(
        self,
        pool_id: str,
        amount: Decimal,
        investor_wallet: str
    ) -> dict:
        """Deposit EUROD and mint uLP tokens"""
        pool = await self.get_pool(pool_id)
        
        # Check minimum investment
        if amount < pool.min_investment:
            raise HTTPException(
                422,
                f"Minimum investment is €{pool.min_investment}"
            )
        
        # Calculate uLP to mint
        nav_per_share = pool.nav_per_share
        ulp_minted = (amount * Decimal("1e18")) / nav_per_share
        
        # Call smart contract
        tx_hash = await self._call_deposit_contract(
            pool.contract_address,
            amount,
            investor_wallet
        )
        
        # Update pool state
        pool.total_value_locked += amount
        pool.total_shares += ulp_minted / Decimal("1e18")
        # NAV remains the same (new shares minted at current NAV)
        
        await self.db.pools.update(pool)
        
        return {
            "transactionId": str(uuid.uuid4()),
            "ulpMinted": str(ulp_minted),
            "navPerShare": str(nav_per_share),
            "status": "PENDING",
            "blockchainTxHash": tx_hash
        }
    
    async def redeem(
        self,
        pool_id: str,
        ulp_amount: Decimal,
        investor_wallet: str
    ) -> dict:
        """Redeem uLP tokens for EUROD + yield"""
        pool = await self.get_pool(pool_id)
        
        # Calculate redemption value
        nav_per_share = pool.nav_per_share
        redemption_value = (ulp_amount * nav_per_share) / Decimal("1e18")
        
        # Call smart contract
        tx_hash = await self._call_redeem_contract(
            pool.contract_address,
            ulp_amount,
            investor_wallet
        )
        
        # Update pool state
        pool.total_value_locked -= redemption_value
        pool.total_shares -= ulp_amount / Decimal("1e18")
        
        await self.db.pools.update(pool)
        
        return {
            "transactionId": str(uuid.uuid4()),
            "uJPBurned": str(ulp_amount),
            "amountReceived": str(redemption_value),
            "navPerShare": str(nav_per_share),
            "yieldEarned": str(redemption_value - (ulp_amount / Decimal("1e18"))),
            "status": "PENDING",
            "blockchainTxHash": tx_hash
        }
    
    def calculate_nav(self, pool: Pool) -> Decimal:
        """Calculate NAV per share"""
        if pool.total_shares == 0:
            return Decimal("1.00000000")
        
        return pool.total_value_locked / pool.total_shares
```

---

# 4. Frontend Quick Start Updates 🆕

**Target:** `docs/02_TECHNICAL_GUIDES/04_FRONTEND_QUICK_START.md`  
**Version Update:** v1.0 → v2.1  

## 4.1 New Section: SIWE Login Component

### Add as Section 3.5:

### 3.5 SIWE Authentication Component

**Login Component:**

```typescript
// components/auth/SIWESigner.tsx
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { useState } from 'react';

export function SIWESigner() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Request nonce from backend
      const nonceResponse = await fetch(`/api/v1/auth/nonce?wallet=${address}`);
      const { nonce, message } = await nonceResponse.json();
      
      // 2. Create SIWE message
      const siweMessage = new SiweMessage({
        domain: 'ujamaa.defi',
        address: address,
        statement: 'Sign in to UJAMAA DeFi',
        uri: 'https://ujamaa.defi',
        version: '1',
        chainId: 80002,  // Polygon Amoy
        nonce: nonce,
      });
      
      // 3. Sign message
      const signature = await signMessageAsync({
        message: siweMessage.toMessage(),
      });
      
      // 4. Submit to backend
      const loginResponse = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: address,
          signature,
          nonce,
          message: siweMessage.toMessage(),
        }),
      });
      
      if (!loginResponse.ok) {
        throw new Error('Login failed');
      }
      
      const { accessToken, refreshToken } = await loginResponse.json();
      
      // 5. Store tokens
      localStorage.setItem('refreshToken', refreshToken);
      // Store access token in memory (React context)
      setAccessToken(accessToken);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={isLoading || !address}>
        {isLoading ? 'Signing...' : 'Sign In with Ethereum'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

## 4.2 New Section: uLP Deposit/Redeem Components

### Add as Section 5.5:

### 5.5 uLP Investment Components

**Deposit Component:**

```typescript
// components/pools/ULPDeposit.tsx
import { useState } from 'react';
import { useContractWrite } from 'wagmi';

export function ULPDeposit({ poolId }: { poolId: string }) {
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const { write: deposit } = useContractWrite({
    address: ULP_TOKEN_ADDRESS,
    abi: ULP_TOKEN_ABI,
    functionName: 'deposit',
  });

  const handleDeposit = async () => {
    setIsLoading(true);
    
    try {
      // 1. Approve EUROD spending
      await approveUJEUR(amount);
      
      // 2. Call deposit
      const tx = await deposit({
        args: [parseEther(amount)],
      });
      
      // 3. Wait for confirmation
      await tx.wait();
      
      // 4. Update UI
      alert('Deposit successful!');
      
    } catch (err) {
      console.error('Deposit failed:', err);
      alert('Deposit failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="deposit-form">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount (min €100K)"
        min="100000"
      />
      <button onClick={handleDeposit} disabled={isLoading}>
        {isLoading ? 'Depositing...' : 'Deposit EUROD'}
      </button>
    </div>
  );
}
```

---

# 5. Smart Contract Integration Guide Updates 🆕

**Target:** `docs/02_TECHNICAL_GUIDES/05_SMART_CONTRACT_INTEGRATION_GUIDE.md`  
**Version Update:** v1.0 → v2.1  

## 5.1 New Section: uLP Token Integration

### Add as Section 4.5:

### 4.5 uLP Token Integration

**Interacting with uLP Token:**

```typescript
// hooks/useULPToken.ts
import { useContractRead, useContractWrite } from 'wagmi';
import { parseEther, formatEther } from 'viem';

export function useULPToken(contractAddress: string) {
  // Read NAV per share
  const { data: navPerShare } = useContractRead({
    address: contractAddress,
    abi: ULP_TOKEN_ABI,
    functionName: 'getNAVPerShare',
  });

  // Read investor value
  const { data: investorValue } = useContractRead({
    address: contractAddress,
    abi: ULP_TOKEN_ABI,
    functionName: 'getInvestorValue',
    args: [walletAddress],
  });

  // Deposit
  const { write: deposit } = useContractWrite({
    address: contractAddress,
    abi: ULP_TOKEN_ABI,
    functionName: 'deposit',
  });

  // Redeem
  const { write: redeem } = useContractWrite({
    address: contractAddress,
    abi: ULP_TOKEN_ABI,
    functionName: 'redeem',
  });

  return {
    navPerShare: navPerShare ? formatEther(navPerShare) : '0',
    investorValue: investorValue ? formatEther(investorValue) : '0',
    deposit,
    redeem,
  };
}
```

## 5.2 New Section: UJG Token Integration

### Add as Section 4.6:

### 4.6 UJG Token Integration

**Minting UJG:**

```typescript
// hooks/useUJGToken.ts
import { useContractWrite } from 'wagmi';

export function useUJGToken(contractAddress: string) {
  const { write: mintGuarantee } = useContractWrite({
    address: contractAddress,
    abi: GUARANTEE_TOKEN_ABI,
    functionName: 'mintGuarantee',
  });

  const handleMint = async (
    industrial: string,
    certificateId: number,
    value: bigint,
    expiryDate: number,
    stockHash: string
  ) => {
    const tx = await mintGuarantee({
      args: [industrial, certificateId, value, expiryDate, stockHash],
    });
    
    await tx.wait();
    return tx;
  };

  return { mintGuarantee: handleMint };
}
```

---

**Document End**

**Merge Instructions:**
1. Add new sections to respective guides
2. Update version numbers (v2.1)
3. Update dates (March 25, 2026)
4. Test all code examples
5. Verify cross-references
