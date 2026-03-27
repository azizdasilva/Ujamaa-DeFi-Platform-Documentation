# API Specification - SRS v2.1 Updates

**Date:** March 25, 2026  
**Source:** SRS v2.1 Section 1.2.1 (Authentication), Section 1.2.2 (Authorization)  
**Target:** `docs/01_SPECIFICATIONS/06_API_SPECIFICATION.md`  

---

## Summary

This document provides the complete updates needed for the API Specification to align with SRS v2.1. Due to the size of the original file (1900+ lines), these updates should be merged into the existing document.

---

## 1. New Service: Authentication Service 🆕

**Base Path:** `/api/v1/auth`  
**Protocol:** REST + JSON  
**Port:** 8005  

### 1.1 SIWE Authentication Endpoints

**GET /api/v1/auth/nonce**
```yaml
Description: Request nonce for SIWE authentication
Rate Limit: 10 requests/minute
Parameters:
  - wallet: string (query, required) - 0x-prefixed, 42 characters
Response:
  nonce: string (UUID v4)
  expiresAt: string (ISO 8601, 5 minutes from now)
  message: string (SIWE message template)
Example Request:
  GET /api/v1/auth/nonce?wallet=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Example Response:
  {
    "nonce": "550e8400-e29b-41d4-a716-446655440000",
    "expiresAt": "2026-03-25T10:05:00Z",
    "message": "Sign this message to authenticate with UJAMAA DeFi"
  }
```

**POST /api/v1/auth/login**
```yaml
Description: SIWE login (signature verification + JWT issuance)
Rate Limit: 5 requests/hour (prevent brute force)
Request Body:
  wallet: string (0x-prefixed, 42 characters)
  signature: string (hex-encoded, recovered address must match wallet)
  nonce: string (UUID v4, must match Redis value)
Response:
  accessToken: string (JWT, 30 days expiry)
  refreshToken: string (JWT, 7 days expiry)
  expiresAt: string (ISO 8601)
  user:
    wallet: string
    role: string (INSTITUTIONAL_INVESTOR, etc.)
    kycStatus: string (VERIFIED, PENDING, REJECTED)
Example Request:
  POST /api/v1/auth/login
  {
    "wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "signature": "0x1234567890abcdef...",
    "nonce": "550e8400-e29b-41d4-a716-446655440000"
  }
Example Response:
  {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2026-04-24T10:00:00Z",
    "user": {
      "wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "role": "INSTITUTIONAL_INVESTOR",
      "kycStatus": "VERIFIED"
    }
  }
```

**POST /api/v1/auth/refresh**
```yaml
Description: Refresh JWT token (rotate refresh token)
Authentication: Refresh token required in Authorization header
Request Body:
  refreshToken: string (valid, non-revoked refresh token)
Response:
  accessToken: string (new access token)
  refreshToken: string (rotated refresh token - old one invalidated)
Security:
  - Refresh token rotation (new token issued on each refresh)
  - Old refresh token immediately invalidated
```

**POST /api/v1/auth/logout**
```yaml
Description: Invalidate all sessions (blacklist JWT jti in Redis)
Authentication: Access token required
Response:
  success: boolean
  message: string
Side Effects:
  - All active sessions for user invalidated
  - JWT jti added to Redis blacklist (TTL: until expiry)
  - Refresh tokens deleted from database
```

### 1.2 SIWE Message Format

```
uri: https://ujamaa.defi
version: 1
chain_id: 80002 (Polygon Amoy testnet)
nonce: {uuid-v4}
issued_at: {ISO8601}
expiration_time: {ISO8601, 5 minutes from issued_at}
resources:
  - ipfs://bafybeigdyrzt5sfp7udm7hu77uh7zzt2pu9hryrgqwpq5jrp7t6vu3
```

---

## 2. New Service: Liquidity Pools Service 🆕

**Base Path:** `/api/v1/pools`  
**Protocol:** REST + JSON  
**Port:** 8006  
**Authentication:** JWT required  
**Authorization:** Institutional Investor, Pool Manager  

### 2.1 Pool Management Endpoints

**GET /api/v1/pools**
```yaml
Description: List all liquidity pools
Auth: JWT (Institutional Investor, Pool Manager)
Query Parameters:
  - family: string (optional) - POOL_INDUSTRIE, POOL_AGRICULTURE, etc.
  - status: string (optional) - ACTIVE, CLOSED
Response:
  pools:
    - id: string (UUID)
      name: string
      family: string
      totalValueLocked: string (EUR, 2 decimals)
      navPerShare: string (EUR, 8 decimals)
      totalShares: string (8 decimals)
      apr: string (annual percentage yield)
      status: string
Example:
  GET /api/v1/pools?family=POOL_INDUSTRIE
  {
    "pools": [
      {
        "id": "pool_industrie_001",
        "name": "Pool Industrie - Tranche 1",
        "family": "POOL_INDUSTRIE",
        "totalValueLocked": "10000000.00",
        "navPerShare": "1.05234567",
        "totalShares": "10000000.00000000",
        "apr": "0.1234",
        "status": "ACTIVE"
      }
    ]
  }
```

**GET /api/v1/pools/{poolId}**
```yaml
Description: Get detailed pool information
Auth: JWT (Institutional Investor, Pool Manager)
Response:
  id: string
  name: string
  family: string
  description: string
  totalValueLocked: string
  navPerShare: string
  totalShares: string
  apr: string
  assetAllocation:
    byIndustrial:
      - industrialId: string
        name: string
        amount: string
        percentage: number
    byGeography:
      - country: string
        amount: string
        percentage: number
    byAssetClass:
      - assetClass: string
        amount: string
        percentage: number
  performance:
    inceptionDate: string
    totalYield: string
    yield30d: string
    yield90d: string
    yieldYtd: string
  riskMetrics:
    diversificationRatio: number
    concentrationRisk: string (LOW, MEDIUM, HIGH)
    defaultRate: string
```

**POST /api/v1/pools**
```yaml
Description: Create new liquidity pool
Auth: JWT (Pool Manager only)
Request:
  name: string
  family: string (POOL_INDUSTRIE, POOL_AGRICULTURE, etc.)
  targetSize: string (EUR)
  minInvestment: string (EUR, default €100K)
  managementFeeBps: number (basis points)
  performanceFeeBps: number
Response:
  poolId: string (UUID)
  status: string (CREATED, PENDING_APPROVAL)
```

### 2.2 uLP Deposit/Redeem Endpoints

**POST /api/v1/pools/{poolId}/deposit**
```yaml
Description: Deposit EUROD to mint uLP tokens
Auth: JWT (Institutional Investor, min €100K)
Request:
  amount: string (EUR, min €100K for institutional)
  uJPAddress: string (investor's wallet address)
Response:
  transactionId: string (UUID)
  ulpMinted: string (calculated as amount / navPerShare)
  navPerShare: string (at time of deposit)
  status: string (PENDING, COMPLETED, FAILED)
  blockchainTxHash: string (once confirmed)
Example:
  POST /api/v1/pools/pool_industrie_001/deposit
  {
    "amount": "1000000.00",
    "uJPAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }
  Response:
  {
    "transactionId": "tx_deposit_001",
    "ulpMinted": "950226.21742112",
    "navPerShare": "1.05234567",
    "status": "PENDING",
    "blockchainTxHash": null
  }
```

**POST /api/v1/pools/{poolId}/redeem**
```yaml
Description: Redeem uLP tokens for EUROD + yield
Auth: JWT (Institutional Investor, uLP holder)
Request:
  ulpAmount: string (tokens to redeem)
  recipientAddress: string (wallet to receive EUROD)
Response:
  transactionId: string
  uJPBurned: string
  amountReceived: string (EUROD, principal + yield)
  navPerShare: string (at time of redemption)
  yieldEarned: string (accrued yield)
  status: string
  blockchainTxHash: string
Example:
  POST /api/v1/pools/pool_industrie_001/redeem
  {
    "ulpAmount": "100000.00000000",
    "recipientAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }
  Response:
  {
    "transactionId": "tx_redeem_001",
    "uJPBurned": "100000.00000000",
    "amountReceived": "105234.57",
    "navPerShare": "1.05234567",
    "yieldEarned": "5234.57",
    "status": "PENDING",
    "blockchainTxHash": null
  }
```

### 2.3 NAV Endpoints

**GET /api/v1/pools/{poolId}/nav**
```yaml
Description: Get current NAV per share
Auth: Public (no authentication required)
Response:
  poolId: string
  navPerShare: string (8 decimals)
  totalPoolValue: string (2 decimals)
  totalShares: string (8 decimals)
  timestamp: string (ISO 8601)
  dataHash: string (IPFS hash of supporting data)
Example:
  GET /api/v1/pools/pool_industrie_001/nav
  {
    "poolId": "pool_industrie_001",
    "navPerShare": "1.05234567",
    "totalPoolValue": "10523456.70",
    "totalShares": "10000000.00000000",
    "timestamp": "2026-03-25T14:00:00Z",
    "dataHash": "QmX1Y2Z3..."
  }
```

**GET /api/v1/pools/{poolId}/nav/history**
```yaml
Description: Get NAV history
Auth: JWT (Institutional Investor)
Query Parameters:
  - days: number (default 30, max 365)
Response:
  history:
    - date: string
      navPerShare: string
      totalPoolValue: string
      dailyYield: string
```

---

## 3. New Service: Guarantee Tokens Service 🆕

**Base Path:** `/api/v1/guarantees`  
**Protocol:** REST + JSON  
**Port:** 8007  
**Authentication:** JWT required  
**Authorization:** Pool Manager, Industrial Gateway  

### 3.1 UJG Management Endpoints

**GET /api/v1/guarantees**
```yaml
Description: List Guarantee Tokens (UJG)
Auth: JWT (Pool Manager, Compliance Officer)
Query Parameters:
  - poolId: string (optional)
  - industrialId: string (optional)
  - status: string (optional) - ACTIVE, REDEEMED, DEFAULTED
Response:
  guarantees:
    - tokenId: string (NFT token ID)
      poolId: string
      industrialId: string
      certificateId: string
      merchandiseValue: string (EUR)
      expiryDate: string (ISO 8601)
      isRedeemed: boolean
      isDefaulted: boolean
      stockHash: string (IPFS hash)
      mintedAt: string
```

**POST /api/v1/guarantees**
```yaml
Description: Mint Guarantee Token (UJG) for certified merchandise
Auth: JWT (Industrial Gateway only - ORIGINATOR_ROLE)
Request:
  industrial: string (wallet address)
  certificateId: string (Industrial Gateway certificate)
  value: string (EUR, merchandise value)
  expiryDate: string (ISO 8601, invoice due date)
  stockHash: string (IPFS hash of stock documents)
Response:
  tokenId: string
  transactionHash: string
  status: string (MINTED, PENDING)
```

**POST /api/v1/guarantees/{tokenId}/redeem**
```yaml
Description: Redeem UJG upon full repayment
Auth: JWT (Pool Manager only)
Response:
  transactionId: string
  status: string (REDEEMED, PENDING)
  redeemedAt: string
```

**POST /api/v1/guarantees/{tokenId}/liquidate**
```yaml
Description: Liquidate defaulted UJG via auction
Auth: JWT (Pool Manager only)
Request:
  auctionWinner: string (wallet address)
  liquidationAmount: string (EUR)
Response:
  transactionId: string
  status: string (LIQUIDATED, PENDING)
  auctionWinner: string
  liquidationAmount: string
```

---

## 4. Updated: Authentication & Authorization Section

### Replace existing Section 9 with:

**9.1 SIWE Authentication Flow**
- 8-step flow diagram (see Architecture Spec Section 4.4.1)
- SIWE message format
- Nonce generation (UUID v4, Redis TTL 5 min)
- Signature verification (ecrecover)
- JWT issuance (RS256, HSM-stored key)

**9.2 JWT Token Structure**
```json
{
  "sub": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "iat": 1711382400,
  "exp": 1713974400,
  "jti": "550e8400-e29b-41d4-a716-446655440000",
  "role": "INSTITUTIONAL_INVESTOR",
  "kyc_status": "VERIFIED",
  "kyc_expires": 1742918400,
  "wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Token Specifications:**
| Token Type | Expiry | Storage | Refresh |
|------------|--------|---------|---------|
| Access Token | 30 days | Memory (React state) | Via refresh token |
| Refresh Token | 7 days | localStorage (encrypted) | Via /auth/refresh |

**Session Management:**
- Idle Timeout: 15 minutes
- Absolute Timeout: 8 hours
- Max Concurrent Sessions: 5
- Session Revocation: POST /auth/logout

**9.3 RBAC Authorization Matrix**
- Complete 10+ role table (see Architecture Spec Section 4.4.2)
- Permission enforcement mechanisms
- FastAPI RBAC middleware example

---

## 5. Updated: Error Handling Section

### Add new error codes:

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `AUTHENTICATION_REQUIRED` | 401 | Missing or invalid JWT |
| `INVALID_SIGNATURE` | 401 | SIWE signature verification failed |
| `NONCE_EXPIRED` | 401 | SIWE nonce expired (5 min TTL) |
| `SESSION_EXPIRED` | 401 | JWT expired or revoked |
| `INSUFFICIENT_PERMISSIONS` | 403 | RBAC check failed |
| `SESSION_LIMIT_EXCEEDED` | 403 | Max 5 concurrent sessions |
| `MFA_REQUIRED` | 403 | Sensitive action requires MFA |
| `NAV_STALE` | 422 | NAV data older than 24 hours |
| `MIN_INVESTMENT_NOT_MET` | 422 | Investment < €100K (institutional) |
| `POOL_CAPACITY_EXCEEDED` | 422 | Pool at max capacity |

---

## 6. Updated: Rate Limiting Section

### Add authentication-specific rate limits:

| Endpoint | Limit | Action on Exceed |
|----------|-------|-----------------|
| /auth/nonce | 10/min | 429 Too Many Requests |
| /auth/login | 5/hour | 429 + temporary lockout (15 min) |
| /auth/refresh | 10/min | 429 Too Many Requests |
| /auth/logout | 10/min | 429 Too Many Requests |
| /pools/*/deposit | 20/min | 429 Too Many Requests |
| /pools/*/redeem | 20/min | 429 Too Many Requests |

---

## 7. Implementation Notes

### Redis Schema for Session Management

```python
# Nonce storage
Key: "auth:nonce:{wallet}"
Value: "{uuid-v4}"
TTL: 300 seconds (5 minutes)

# Session tracking
Key: "auth:session:{wallet}:{session_id}"
Value: JSON({ jti, expires_at, last_activity })
TTL: 28800 seconds (8 hours)

# JWT blacklist (revocation)
Key: "auth:blacklist:{jti}"
Value: "1"
TTL: until JWT expiry
```

### FastAPI Middleware Example

```python
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Validate JWT and extract user claims"""
    try:
        payload = jwt.decode(token, settings.JWT_PUBLIC_KEY, algorithms=["RS256"])
        wallet = payload.get("sub")
        if wallet is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Token validation failed")

async def require_role(required_role: str, current_user: dict = Depends(get_current_user)):
    """Enforce role-based access control"""
    user_role = current_user.get("role")
    if user_role != required_role and not is_admin(user_role):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    return current_user
```

---

## 8. Testing Requirements

### Authentication Tests

- [ ] SIWE signature verification (valid/invalid signatures)
- [ ] Nonce expiry (5 minute TTL)
- [ ] JWT generation/validation
- [ ] Refresh token rotation
- [ ] Session timeout (idle 15min, absolute 8hr)
- [ ] Concurrent session limit (max 5)
- [ ] Session revocation (logout)
- [ ] Rate limiting (5 failed logins/hour)

### Pool Service Tests

- [ ] Pool creation (Pool Manager only)
- [ ] NAV calculation accuracy (8 decimals)
- [ ] uLP deposit (min €100K enforcement)
- [ ] uLP redemption (yield calculation)
- [ ] Asset allocation limits (max 10% per industrial)
- [ ] Diversification checks (min 5 assets)

### Guarantee Token Tests

- [ ] UJG minting (Industrial Gateway only)
- [ ] UJG transfer restrictions (non-transferable)
- [ ] UJG redemption (Pool Manager only)
- [ ] UJG liquidation (auction flow)

---

## 9. Migration Checklist

- [ ] Add /auth/* endpoints to API Gateway routes
- [ ] Implement SIWE verification library (@spruceid/siwe)
- [ ] Set up Redis for session storage
- [ ] Generate RS256 key pair (HSM-stored private key)
- [ ] Implement RBAC middleware
- [ ] Update OpenAPI schema
- [ ] Add rate limiting configuration
- [ ] Write integration tests
- [ ] Update frontend authentication flow
- [ ] Deploy to staging
- [ ] Security audit (penetration testing)

---

**Document End**

**Merge Instructions:**
1. Add Section 2.7 (Fireblocks), Section 2.8 (Bank Escrow) to existing Section 2
2. Replace Section 9 (Authentication) with complete SIWE + JWT spec
3. Add new error codes to Section 10
4. Add rate limits to Section 11
5. Add new services to Section 1.2 (Service Inventory)
