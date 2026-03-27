# API Specification

## UJAMAA DEFI PLATFORM REST & gRPC APIs

**Author:** Aziz Da Silva - Lead Architect  
**Version:** 2.1 (SRS v2.1 Institutional Architecture)  
**Date:** March 25, 2026  
**Classification:** Technical  
**Audience:** Backend Engineers, Frontend Engineers, Integration Partners  

---

## Document Updates Summary (v2.1)

### Institutional Architecture Additions

**New Services (SRS v2.1):**
- **Authentication Service**: SIWE (Sign-In with Ethereum) + JWT token management
- **Liquidity Pools Service**: Pool management, uLP deposit/redeem, NAV tracking
- **Guarantee Tokens Service**: UJG lifecycle (mint, redeem, liquidate)

**Updated Services:**
- Authentication & Authorization section completely rewritten (SIWE + JWT)
- RBAC middleware for all institutional endpoints
- Session management (Redis-backed)
- Fireblocks custody integration endpoints
- Bank escrow integration endpoints (BIIC/MCB)

**New Endpoints:**
- `/api/v1/auth/*` - SIWE authentication (nonce, login, refresh, logout)
- `/api/v1/pools/*` - Liquidity pool operations
- `/api/v1/guarantees/*` - Guarantee token (UJG) operations
- `/api/v1/fireblocks/*` - Fireblocks custody operations (platform treasury)

**SRS Reference:** This specification implements **SRS v2.1** Section 1.2.1 (Authentication), Section 1.2.2 (Authorization), and Section 4 (External Interface Requirements).

---

# Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [API Gateway Configuration](#2-api-gateway-configuration)
3. [Assets Service](#3-assets-service)
4. [Investors Service](#4-investors-service)
5. [Trades Service](#5-trades-service)
6. [Compliance Service](#6-compliance-service)
7. [Reporting Service](#7-reporting-service)
8. [Gateway Service (gRPC)](#8-gateway-service-grpc)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Error Handling](#10-error-handling)
11. [Rate Limiting](#11-rate-limiting)
12. [Webhooks & Events](#12-webhooks--events)

---

# 1. Executive Summary

## 1.1 API Architecture

UJAMAA DEFI PLATFORM exposes functionality through two API paradigms:

| API Type | Protocol | Use Case | Services |
|----------|----------|----------|----------|
| **REST** | HTTP/1.1 + JSON | CRUD operations, user-facing endpoints | Assets, Investors, Trades, Compliance, Reporting |
| **gRPC** | HTTP/2 + Protobuf | High-throughput, low-latency, streaming | Gateway, Real-time analytics, Blockchain events |

## 1.2 Service Inventory

| Service | Base Path | Protocol | Port | Description |
|---------|-----------|----------|------|-------------|
| Assets Service | `/api/v1/assets` | REST | 8000 | Asset origination, tokenization, management |
| Investors Service | `/api/v1/investors` | REST | 8001 | Investor onboarding, KYC, portfolio |
| Trades Service | `/api/v1/trades` | REST | 8002 | Primary issuance, secondary trading |
| Compliance Service | `/api/v1/compliance` | REST | 8003 | KYC/AML, transfer restrictions, audit |
| Reporting Service | `/api/v1/reports` | REST | 8004 | Regulatory reports, analytics, exports |
| Gateway Service | `gateway.v1.Gateway` | gRPC | 9000 | Price feeds, blockchain events, off-chain data |

## 1.3 Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Framework** | FastAPI | 0.109+ |
| **Serialization** | Pydantic v2 | 2.5+ |
| **Documentation** | OpenAPI 3.1 | Auto-generated |
| **gRPC** | grpcio + grpc-tools | 1.60+ |
| **Validation** | Pydantic + custom validators | - |
| **Authentication** | JWT + OAuth2 + API Keys | - |

---

# 2. API Gateway Configuration

## 2.1 Kong Gateway Routes

```yaml
# kong.yaml
_format_version: "3.0"

services:
  - name: assets-service
    url: http://assets-service:8000
    routes:
      - name: assets-route
        paths:
          - /api/v1/assets
        strip_path: false
        protocols:
          - http
          - https

  - name: investors-service
    url: http://investors-service:8001
    routes:
      - name: investors-route
        paths:
          - /api/v1/investors
        strip_path: false

  - name: trades-service
    url: http://trades-service:8002
    routes:
      - name: trades-route
        paths:
          - /api/v1/trades
        strip_path: false

  - name: compliance-service
    url: http://compliance-service:8003
    routes:
      - name: compliance-route
        paths:
          - /api/v1/compliance
        strip_path: false

  - name: reporting-service
    url: http://reporting-service:8004
    routes:
      - name: reporting-route
        paths:
          - /api/v1/reports
        strip_path: false

  - name: oracle-service
    protocol: grpc
    url: http://oracle-service:9000
    routes:
      - name: oracle-route
        paths:
          - /oracle.v1.Oracle
        strip_path: false

plugins:
  - name: rate-limiting
    config:
      minute: 100
      hour: 1000
      policy: redis
      redis_host: redis
      redis_port: 6379

  - name: jwt
    config:
      key_claim_name: iss
      secret_is_base64: false
      claims_to_verify:
        - exp

  - name: cors
    config:
      origins:
        - https://ujamaa-defi.com
        - https://app.ujamaa-defi.com
      methods:
        - GET
        - POST
        - PUT
        - DELETE
        - OPTIONS
      headers:
        - Accept
        - Content-Type
        - Authorization
      exposed_headers:
        - X-Request-Id
      credentials: true
      max_age: 86400

  - name: request-transformer
    config:
      add:
        headers:
          - X-Forwarded-Proto:https
```

## 2.2 TLS Configuration

```
Minimum TLS Version: TLS 1.3
Cipher Suites:
  - TLS_AES_256_GCM_SHA384
  - TLS_CHACHA20_POLY1305_SHA256
  - TLS_AES_128_GCM_SHA256

Certificate: Let's Encrypt or AWS ACM
HSTS: max-age=31536000; includeSubDomains; preload
```

---

# 3. Assets Service

## 3.1 Overview

**Base URL:** `https://api.ujamaa-defi.com/api/v1/assets`  
**Port:** 8000  
**Description:** Asset origination, tokenization, and lifecycle management

## 3.2 Endpoints

### 3.2.1 Create Asset

```http
POST /api/v1/assets
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "name": "Lagos Commercial Property Portfolio",
  "asset_class": "REAL_ESTATE",
  "jurisdiction": "NG",
  "description": "Prime commercial real estate portfolio in Lagos CBD",
  "originator_id": "orig_123456",
  "legal_structure": "SPV",
  "target_raise": {
    "amount": 10000000,
    "currency": "USD"
  },
  "minimum_investment": {
    "amount": 1000,
    "currency": "USD"
  },
  "maximum_investment": {
    "amount": 1000000,
    "currency": "USD"
  },
  "expected_yield_bps": 1200,
  "investment_period_months": 60,
  "compliance_config": {
    "only_accredited": true,
    "allowed_jurisdictions": ["NG", "KE", "ZA", "GH", "MU"],
    "restricted_jurisdictions": ["KP", "IR", "SY", "CU"],
    "lockup_period_days": 365,
    "max_concentration_bps": 2500
  },
  "documents": [
    {
      "type": "OFFERING_MEMORANDUM",
      "ipfs_hash": "QmX7Kz9...",
      "hash": "0xabc123..."
    },
    {
      "type": "TITLE_DEED",
      "ipfs_hash": "QmY8La0...",
      "hash": "0xdef456..."
    }
  ],
  "metadata": {
    "property_count": 5,
    "total_area_sqm": 15000,
    "occupancy_rate_bps": 9200,
    "valuation_date": "2026-01-15",
    "appraiser": "Knight Frank Nigeria"
  }
}
```

**Response (201 Created):**
```json
{
  "id": "asset_789xyz",
  "name": "Lagos Commercial Property Portfolio",
  "asset_class": "REAL_ESTATE",
  "status": "PENDING_APPROVAL",
  "created_at": "2026-02-27T10:30:00Z",
  "updated_at": "2026-02-27T10:30:00Z",
  "token_contract": null,
  "token_symbol": null,
  "blockchain": null,
  "_links": {
    "self": "/api/v1/assets/asset_789xyz",
    "documents": "/api/v1/assets/asset_789xyz/documents",
    "submit_for_approval": "/api/v1/assets/asset_789xyz/approval/submit"
  }
}
```

### 3.2.2 Get Asset

```http
GET /api/v1/assets/{asset_id}
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "id": "asset_789xyz",
  "name": "Lagos Commercial Property Portfolio",
  "asset_class": "REAL_ESTATE",
  "jurisdiction": "NG",
  "description": "Prime commercial real estate portfolio in Lagos CBD",
  "originator_id": "orig_123456",
  "status": "ACTIVE",
  "legal_structure": "SPV",
  "target_raise": {
    "amount": 10000000,
    "currency": "USD"
  },
  "raised_amount": {
    "amount": 7500000,
    "currency": "USD"
  },
  "progress_bps": 7500,
  "minimum_investment": {
    "amount": 1000,
    "currency": "USD"
  },
  "maximum_investment": {
    "amount": 1000000,
    "currency": "USD"
  },
  "expected_yield_bps": 1200,
  "investment_period_months": 60,
  "compliance_config": {
    "only_accredited": true,
    "allowed_jurisdictions": ["NG", "KE", "ZA", "GH", "MU"],
    "restricted_jurisdictions": ["KP", "IR", "SY", "CU"],
    "lockup_period_days": 365,
    "max_concentration_bps": 2500
  },
  "token_contract": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "token_symbol": "LCREIT",
  "blockchain": "POLYGON",
  "total_shares": 10000000,
  "shares_outstanding": 7500000,
  "nav_per_share": {
    "amount": 1.05,
    "currency": "USD"
  },
  "last_nav_update": "2026-02-25T00:00:00Z",
  "created_at": "2026-02-27T10:30:00Z",
  "updated_at": "2026-02-27T14:45:00Z",
  "_links": {
    "self": "/api/v1/assets/asset_789xyz",
    "documents": "/api/v1/assets/asset_789xyz/documents",
    "investors": "/api/v1/assets/asset_789xyz/investors",
    "trades": "/api/v1/assets/asset_789xyz/trades",
    "distributions": "/api/v1/assets/asset_789xyz/distributions"
  }
}
```

### 3.2.3 List Assets

```http
GET /api/v1/assets
Authorization: Bearer {jwt_token}
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `asset_class` | string | - | Filter by asset class |
| `jurisdiction` | string | - | Filter by jurisdiction (ISO code) |
| `status` | string | - | Filter by status (PENDING, ACTIVE, CLOSED) |
| `originator_id` | string | - | Filter by originator |
| `blockchain` | string | - | Filter by blockchain (ETHEREUM, POLYGON) |
| `min_yield_bps` | integer | - | Minimum expected yield |
| `sort_by` | string | `created_at` | Sort field |
| `sort_order` | string | `desc` | Sort order (asc, desc) |
| `page` | integer | 1 | Page number |
| `page_size` | integer | 20 | Items per page |

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "asset_789xyz",
      "name": "Lagos Commercial Property Portfolio",
      "asset_class": "REAL_ESTATE",
      "status": "ACTIVE",
      "raised_amount": { "amount": 7500000, "currency": "USD" },
      "target_raise": { "amount": 10000000, "currency": "USD" },
      "progress_bps": 7500,
      "expected_yield_bps": 1200,
      "token_symbol": "LCREIT",
      "blockchain": "POLYGON",
      "_links": {
        "self": "/api/v1/assets/asset_789xyz"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_items": 47,
    "total_pages": 3,
    "_links": {
      "self": "/api/v1/assets?page=1",
      "next": "/api/v1/assets?page=2",
      "last": "/api/v1/assets?page=3"
    }
  }
}
```

### 3.2.4 Update Asset

```http
PUT /api/v1/assets/{asset_id}
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

**Request Body:** (partial update, same schema as Create)
```json
{
  "description": "Updated description...",
  "metadata": {
    "occupancy_rate_bps": 9500
  }
}
```

### 3.2.5 Submit Asset for Approval

```http
POST /api/v1/assets/{asset_id}/approval/submit
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "asset_id": "asset_789xyz",
  "status": "UNDER_REVIEW",
  "submitted_at": "2026-02-27T15:00:00Z",
  "estimated_review_completion": "2026-03-03T15:00:00Z",
  "reviewer_id": "compliance_officer_456",
  "_links": {
    "self": "/api/v1/assets/asset_789xyz",
    "approval_status": "/api/v1/assets/asset_789xyz/approval/status"
  }
}
```

### 3.2.6 Get Asset Documents

```http
GET /api/v1/assets/{asset_id}/documents
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "asset_id": "asset_789xyz",
  "documents": [
    {
      "id": "doc_001",
      "type": "OFFERING_MEMORANDUM",
      "filename": "offering_memorandum.pdf",
      "ipfs_hash": "QmX7Kz9...",
      "hash": "0xabc123...",
      "size_bytes": 2500000,
      "uploaded_at": "2026-02-27T10:30:00Z",
      "verified": true,
      "verified_at": "2026-02-27T11:00:00Z",
      "_links": {
        "download": "/api/v1/assets/asset_789xyz/documents/doc_001/download"
      }
    }
  ]
}
```

### 3.2.7 Get Asset Investors (Cap Table)

```http
GET /api/v1/assets/{asset_id}/investors
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "asset_id": "asset_789xyz",
  "token_symbol": "LCREIT",
  "total_shares": 10000000,
  "shares_outstanding": 7500000,
  "investor_count": 145,
  "investors": [
    {
      "investor_id": "inv_001",
      "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "shares_held": 500000,
      "percentage_bps": 500,
      "first_purchase_date": "2026-01-15T09:00:00Z",
      "last_transaction_date": "2026-02-20T14:30:00Z",
      "jurisdiction": "NG",
      "investor_type": "INSTITUTIONAL",
      "lockup_expires": "2027-01-15T09:00:00Z"
    }
  ],
  "concentration": {
    "top_10_bps": 3500,
    "herfindahl_index": 0.08
  },
  "pagination": {
    "page": 1,
    "page_size": 50,
    "total_items": 145
  }
}
```

### 3.2.8 Record Distribution

```http
POST /api/v1/assets/{asset_id}/distributions
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "distribution_type": "DIVIDEND",
  "amount_per_share": {
    "amount": 0.025,
    "currency": "USD"
  },
  "total_amount": {
    "amount": 187500,
    "currency": "USD"
  },
  "record_date": "2026-03-15",
  "payment_date": "2026-03-30",
  "payment_token": "USDC",
  "description": "Q1 2026 dividend distribution"
}
```

**Response (201 Created):**
```json
{
  "distribution_id": "dist_456abc",
  "asset_id": "asset_789xyz",
  "status": "SCHEDULED",
  "distribution_type": "DIVIDEND",
  "amount_per_share": { "amount": 0.025, "currency": "USD" },
  "total_amount": { "amount": 187500, "currency": "USD" },
  "record_date": "2026-03-15",
  "payment_date": "2026-03-30",
  "eligible_investors": 145,
  "created_at": "2026-02-27T16:00:00Z",
  "_links": {
    "self": "/api/v1/assets/asset_789xyz/distributions/dist_456abc",
    "execute": "/api/v1/assets/asset_789xyz/distributions/dist_456abc/execute"
  }
}
```

## 3.3 Data Models

### AssetClass Enum
```python
class AssetClass(str, Enum):
    REAL_ESTATE = "REAL_ESTATE"
    AGRICULTURE = "AGRICULTURE"
    MINING = "MINING"
    RENEWABLE_ENERGY = "RENEWABLE_ENERGY"
    INFRASTRUCTURE = "INFRASTRUCTURE"
    OIL_AND_GAS = "OIL_AND_GAS"
    TRADE_FINANCE = "TRADE_FINANCE"
    PRIVATE_EQUITY = "PRIVATE_EQUITY"
    ART_AND_CULTURE = "ART_AND_CULTURE"
```

### AssetStatus Enum
```python
class AssetStatus(str, Enum):
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"
    CLOSED = "CLOSED"
    LIQUIDATED = "LIQUIDATED"
```

### Blockchain Enum
```python
class Blockchain(str, Enum):
    ETHEREUM = "ETHEREUM"
    POLYGON = "POLYGON"
```

---

# 4. Investors Service

## 4.1 Overview

**Base URL:** `https://api.ujamaa-defi.com/api/v1/investors`  
**Port:** 8001  
**Description:** Investor onboarding, KYC/AML verification, portfolio management

## 4.2 Endpoints

### 4.2.1 Create Investor (Onboard)

```http
POST /api/v1/investors
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "type": "INDIVIDUAL",
  "email": "investor@example.com",
  "phone": "+2348012345678",
  "personal_details": {
    "first_name": "Chukwu",
    "last_name": "Okafor",
    "date_of_birth": "1985-06-15",
    "nationality": "NG",
    "tax_id": "12345678-0001",
    "occupation": "Business Owner"
  },
  "address": {
    "street": "15 Victoria Island Way",
    "city": "Lagos",
    "state": "Lagos",
    "postal_code": "101241",
    "country": "NG"
  },
  "investment_profile": {
    "investor_type": "RETAIL",
    "accreditation_status": "NOT_ACCREDITED",
    "risk_tolerance": "MODERATE",
    "investment_experience_years": 5,
    "annual_income_range": "100K_500K",
    "net_worth_range": "500K_1M",
    "source_of_funds": "BUSINESS_INCOME",
    "preferred_asset_classes": ["REAL_ESTATE", "AGRICULTURE"],
    "target_allocation_bps": {
      "REAL_ESTATE": 5000,
      "AGRICULTURE": 3000,
      "TRADE_FINANCE": 2000
    }
  },
  "wallet_addresses": [
    {
      "blockchain": "POLYGON",
      "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "is_primary": true
    }
  ],
  "kyc_consent": {
    "consent_given": true,
    "consent_timestamp": "2026-02-27T10:00:00Z",
    "ip_address": "197.210.57.123",
    "user_agent": "Mozilla/5.0..."
  }
}
```

**Response (201 Created):**
```json
{
  "id": "inv_001",
  "type": "INDIVIDUAL",
  "email": "investor@example.com",
  "status": "PENDING_KYC",
  "kyc_status": "NOT_STARTED",
  "aml_status": "NOT_STARTED",
  "created_at": "2026-02-27T10:00:00Z",
  "_links": {
    "self": "/api/v1/investors/inv_001",
    "submit_kyc": "/api/v1/investors/inv_001/kyc/submit",
    "wallets": "/api/v1/investors/inv_001/wallets"
  }
}
```

### 4.2.2 Submit KYC Documents

```http
POST /api/v1/investors/{investor_id}/kyc/submit
Content-Type: multipart/form-data
Authorization: Bearer {jwt_token}
```

**Request Body (multipart):**
```
investor_id: inv_001
document_type: NATIONAL_ID
document_front: [file upload]
document_back: [file upload]
selfie: [file upload]
proof_of_address: [file upload]
```

**Response (200 OK):**
```json
{
  "investor_id": "inv_001",
  "kyc_status": "UNDER_REVIEW",
  "submitted_at": "2026-02-27T10:30:00Z",
  "documents": [
    {
      "id": "kyc_doc_001",
      "type": "NATIONAL_ID",
      "status": "UPLOADED",
      "uploaded_at": "2026-02-27T10:30:00Z"
    }
  ],
  "estimated_review_time_hours": 48,
  "_links": {
    "self": "/api/v1/investors/inv_001",
    "kyc_status": "/api/v1/investors/inv_001/kyc/status"
  }
}
```

### 4.2.3 Get KYC Status

```http
GET /api/v1/investors/{investor_id}/kyc/status
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "investor_id": "inv_001",
  "kyc_status": "APPROVED",
  "kyc_provider": "SMILE_IDENTITY",
  "approved_at": "2026-02-28T14:00:00Z",
  "approved_by": "kyc_officer_123",
  "onchainid_claim_id": "claim_789xyz",
  "expiry_date": "2027-02-28",
  "verified_claims": [
    {
      "claim_type": "KYC_VERIFIED",
      "claim_topic": 1,
      "issuer": "0xClaimIssuerAddress...",
      "issued_at": "2026-02-28T14:00:00Z",
      "expires_at": "2027-02-28T14:00:00Z"
    },
    {
      "claim_type": "JURISDICTION",
      "claim_topic": 3,
      "value": "NG",
      "issuer": "0xClaimIssuerAddress...",
      "issued_at": "2026-02-28T14:00:00Z"
    }
  ],
  "_links": {
    "investor": "/api/v1/investors/inv_001"
  }
}
```

### 4.2.4 Get Investor Portfolio

```http
GET /api/v1/investors/{investor_id}/portfolio
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "investor_id": "inv_001",
  "total_value_usd": 125750.50,
  "total_invested_usd": 120000.00,
  "total_gain_loss_usd": 5750.50,
  "total_gain_loss_bps": 479,
  "holdings": [
    {
      "asset_id": "asset_789xyz",
      "asset_name": "Lagos Commercial Property Portfolio",
      "token_symbol": "LCREIT",
      "shares_held": 50000,
      "average_cost_per_share": 1.00,
      "current_nav_per_share": 1.05,
      "market_value_usd": 52500.00,
      "cost_basis_usd": 50000.00,
      "gain_loss_usd": 2500.00,
      "gain_loss_bps": 500,
      "percentage_of_portfolio_bps": 4175,
      "first_purchase_date": "2026-01-15T09:00:00Z",
      "lockup_expires": "2027-01-15T09:00:00Z",
      "pending_distributions_usd": 1250.00
    }
  ],
  "allocation_by_asset_class": [
    {
      "asset_class": "REAL_ESTATE",
      "value_usd": 52500.00,
      "percentage_bps": 4175
    },
    {
      "asset_class": "AGRICULTURE",
      "value_usd": 45000.00,
      "percentage_bps": 3578
    },
    {
      "asset_class": "TRADE_FINANCE",
      "value_usd": 28250.50,
      "percentage_bps": 2247
    }
  ],
  "performance": {
    "daily_change_bps": 12,
    "weekly_change_bps": 45,
    "monthly_change_bps": 120,
    "ytd_change_bps": 479
  },
  "_links": {
    "self": "/api/v1/investors/inv_001/portfolio",
    "transactions": "/api/v1/investors/inv_001/transactions",
    "distributions": "/api/v1/investors/inv_001/distributions"
  }
}
```

### 4.2.5 Get Investor Transactions

```http
GET /api/v1/investors/{investor_id}/transactions
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `asset_id` | string | Filter by asset |
| `transaction_type` | string | PURCHASE, REDEMPTION, TRANSFER, DISTRIBUTION |
| `start_date` | date | Filter from date |
| `end_date` | date | Filter to date |
| `page` | integer | Page number |
| `page_size` | integer | Page size |

**Response (200 OK):**
```json
{
  "investor_id": "inv_001",
  "transactions": [
    {
      "id": "txn_001",
      "type": "PURCHASE",
      "asset_id": "asset_789xyz",
      "asset_name": "Lagos Commercial Property Portfolio",
      "shares": 50000,
      "price_per_share": { "amount": 1.00, "currency": "USD" },
      "total_amount": { "amount": 50000.00, "currency": "USD" },
      "payment_token": "USDC",
      "blockchain": "POLYGON",
      "transaction_hash": "0xabc123...",
      "status": "COMPLETED",
      "timestamp": "2026-01-15T09:00:00Z",
      "compliance_status": "VERIFIED",
      "_links": {
        "asset": "/api/v1/assets/asset_789xyz",
        "blockchain_tx": "https://polygonscan.com/tx/0xabc123..."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_items": 15
  }
}
```

### 4.2.6 Add Wallet Address

```http
POST /api/v1/investors/{investor_id}/wallets
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "blockchain": "POLYGON",
  "address": "0xNewWalletAddress...",
  "is_primary": false
}
```

**Response (201 Created):**
```json
{
  "wallet_id": "wallet_002",
  "investor_id": "inv_001",
  "blockchain": "POLYGON",
  "address": "0xNewWalletAddress...",
  "is_primary": false,
  "verified": false,
  "verification_required": true,
  "_links": {
    "verify": "/api/v1/investors/inv_001/wallets/wallet_002/verify"
  }
}
```

### 4.2.7 Verify Wallet Ownership

```http
POST /api/v1/investors/{investor_id}/wallets/{wallet_id}/verify
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "signature": "0xSignatureOfChallengeMessage..."
}
```

**Response (200 OK):**
```json
{
  "wallet_id": "wallet_002",
  "investor_id": "inv_001",
  "verified": true,
  "verified_at": "2026-02-27T11:00:00Z",
  "_links": {
    "wallet": "/api/v1/investors/inv_001/wallets/wallet_002"
  }
}
```

---

# 5. Trades Service

## 5.1 Overview

**Base URL:** `https://api.ujamaa-defi.com/api/v1/trades`  
**Port:** 8002  
**Description:** Primary market issuance and secondary market trading

## 5.2 Endpoints

### 5.2.1 Create Purchase Order (Primary Market)

```http
POST /api/v1/trades/purchase
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "investor_id": "inv_001",
  "asset_id": "asset_789xyz",
  "order_type": "MARKET",
  "amount_usd": 10000.00,
  "payment_token": "USDC",
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "blockchain": "POLYGON"
}
```

**Response (201 Created):**
```json
{
  "order_id": "order_123abc",
  "investor_id": "inv_001",
  "asset_id": "asset_789xyz",
  "order_type": "PURCHASE",
  "market_type": "PRIMARY",
  "status": "PENDING_COMPLIANCE",
  "amount_usd": 10000.00,
  "estimated_shares": 9523.81,
  "price_per_share": { "amount": 1.05, "currency": "USD" },
  "payment_token": "USDC",
  "payment_address": "0xPaymentEscrowAddress...",
  "payment_amount": "10000.00",
  "compliance_checks": {
    "kyc_verified": true,
    "jurisdiction_allowed": true,
    "investment_limit_ok": true,
    "lockup_period_ok": true,
    "accreditation_ok": true
  },
  "expires_at": "2026-02-27T12:00:00Z",
  "created_at": "2026-02-27T11:00:00Z",
  "_links": {
    "self": "/api/v1/trades/purchase/order_123abc",
    "pay": "/api/v1/trades/purchase/order_123abc/pay",
    "status": "/api/v1/trades/purchase/order_123abc/status"
  }
}
```

### 5.2.2 Execute Payment

```http
POST /api/v1/trades/purchase/{order_id}/pay
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "transaction_hash": "0xPaymentTransactionHash..."
}
```

**Response (200 OK):**
```json
{
  "order_id": "order_123abc",
  "status": "PAYMENT_CONFIRMED",
  "payment_verified_at": "2026-02-27T11:05:00Z",
  "blockchain_confirmations": 1,
  "required_confirmations": 3,
  "estimated_completion": "2026-02-27T11:20:00Z",
  "_links": {
    "self": "/api/v1/trades/purchase/order_123abc",
    "status": "/api/v1/trades/purchase/order_123abc/status"
  }
}
```

### 5.2.3 Create Sell Order (Secondary Market)

```http
POST /api/v1/trades/sell
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "investor_id": "inv_001",
  "asset_id": "asset_789xyz",
  "order_type": "LIMIT",
  "shares": 5000,
  "limit_price": {
    "amount": 1.10,
    "currency": "USD"
  },
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "blockchain": "POLYGON",
  "time_in_force": "GTC"
}
```

**Response (201 Created):**
```json
{
  "order_id": "order_456def",
  "investor_id": "inv_001",
  "asset_id": "asset_789xyz",
  "order_type": "SELL",
  "market_type": "SECONDARY",
  "status": "OPEN",
  "shares": 5000,
  "limit_price": { "amount": 1.10, "currency": "USD" },
  "filled_shares": 0,
  "remaining_shares": 5000,
  "average_fill_price": null,
  "time_in_force": "GTC",
  "compliance_checks": {
    "lockup_period_ok": true,
    "transfer_allowed": true
  },
  "created_at": "2026-02-27T11:30:00Z",
  "expires_at": null,
  "_links": {
    "self": "/api/v1/trades/sell/order_456def",
    "cancel": "/api/v1/trades/sell/order_456def/cancel",
    "order_book": "/api/v1/trades/orderbook?asset_id=asset_789xyz"
  }
}
```

### 5.2.4 Get Order Book

```http
GET /api/v1/trades/orderbook?asset_id={asset_id}
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "asset_id": "asset_789xyz",
  "token_symbol": "LCREIT",
  "last_price": { "amount": 1.05, "currency": "USD" },
  "spread_bps": 200,
  "bids": [
    {
      "price": { "amount": 1.04, "currency": "USD" },
      "shares": 10000,
      "order_count": 3
    },
    {
      "price": { "amount": 1.03, "currency": "USD" },
      "shares": 25000,
      "order_count": 7
    }
  ],
  "asks": [
    {
      "price": { "amount": 1.06, "currency": "USD" },
      "shares": 8000,
      "order_count": 2
    },
    {
      "price": { "amount": 1.07, "currency": "USD" },
      "shares": 15000,
      "order_count": 5
    }
  ],
  "updated_at": "2026-02-27T11:35:00Z"
}
```

### 5.2.5 Get Order Status

```http
GET /api/v1/trades/{order_id}/status
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "order_id": "order_123abc",
  "status": "COMPLETED",
  "fills": [
    {
      "fill_id": "fill_001",
      "shares": 9523.81,
      "price_per_share": { "amount": 1.05, "currency": "USD" },
      "total_amount": { "amount": 10000.00, "currency": "USD" },
      "counterparty": "0xLiquidityProvider...",
      "transaction_hash": "0xMintTransactionHash...",
      "timestamp": "2026-02-27T11:15:00Z"
    }
  ],
  "completed_at": "2026-02-27T11:15:00Z",
  "_links": {
    "order": "/api/v1/trades/order_123abc",
    "blockchain_tx": "https://polygonscan.com/tx/0xMintTransactionHash..."
  }
}
```

### 5.2.6 Cancel Order

```http
POST /api/v1/trades/{order_id}/cancel
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "order_id": "order_456def",
  "status": "CANCELLED",
  "cancelled_at": "2026-02-27T11:45:00Z",
  "reason": "USER_REQUESTED",
  "refunded_shares": 5000,
  "_links": {
    "self": "/api/v1/trades/order_456def"
  }
}
```

---

# 6. Compliance Service

## 6.1 Overview

**Base URL:** `https://api.ujamaa-defi.com/api/v1/compliance`  
**Port:** 8003  
**Description:** KYC/AML verification, transfer restrictions, regulatory audit

## 6.2 Endpoints

### 6.2.1 Verify Transfer Eligibility

```http
POST /api/v1/compliance/transfers/verify
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "asset_id": "asset_789xyz",
  "from_address": "0xSenderAddress...",
  "to_address": "0xRecipientAddress...",
  "amount": 5000
}
```

**Response (200 OK):**
```json
{
  "eligible": true,
  "asset_id": "asset_789xyz",
  "from_address": "0xSenderAddress...",
  "to_address": "0xRecipientAddress...",
  "amount": 5000,
  "checks_performed": [
    {
      "check_type": "SENDER_IDENTITY_VERIFIED",
      "passed": true,
      "details": "ONCHAINID claim verified"
    },
    {
      "check_type": "RECIPIENT_IDENTITY_VERIFIED",
      "passed": true,
      "details": "ONCHAINID claim verified"
    },
    {
      "check_type": "JURISDICTION_ALLOWED",
      "passed": true,
      "details": "Recipient jurisdiction NG is allowed"
    },
    {
      "check_type": "LOCKUP_PERIOD",
      "passed": true,
      "details": "Lockup period expired"
    },
    {
      "check_type": "INVESTMENT_LIMIT",
      "passed": true,
      "details": "Within maximum investment limit"
    },
    {
      "check_type": "CONCENTRATION_LIMIT",
      "passed": true,
      "details": "Below 25% concentration threshold"
    }
  ],
  "verified_at": "2026-02-27T12:00:00Z",
  "valid_until": "2026-02-27T12:05:00Z"
}
```

### 6.2.2 Get Compliance Report for Investor

```http
GET /api/v1/compliance/investors/{investor_id}/report
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "investor_id": "inv_001",
  "kyc_status": "APPROVED",
  "kyc_expiry": "2027-02-28",
  "aml_status": "CLEARED",
  "aml_last_screening": "2026-02-27T00:00:00Z",
  "sanctions_status": "CLEARED",
  "pep_status": "NOT_PEP",
  "adverse_media_status": "CLEARED",
  "risk_score": 25,
  "risk_level": "LOW",
  "allowed_jurisdictions": ["NG", "KE", "ZA", "GH", "MU"],
  "investment_limits": {
    "daily_limit_usd": 50000,
    "monthly_limit_usd": 200000,
    "per_asset_limit_usd": 100000,
    "remaining_daily_usd": 40000,
    "remaining_monthly_usd": 150000
  },
  "restrictions": [],
  "last_review_date": "2026-02-27",
  "next_review_date": "2027-02-27",
  "_links": {
    "investor": "/api/v1/investors/inv_001",
    "screening_history": "/api/v1/compliance/investors/inv_001/screenings"
  }
}
```

### 6.2.3 Run AML Screening

```http
POST /api/v1/compliance/investors/{investor_id}/aml/screen
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "investor_id": "inv_001",
  "screening_id": "aml_screen_001",
  "status": "COMPLETED",
  "screening_timestamp": "2026-02-27T12:30:00Z",
  "results": {
    "sanctions_match": false,
    "pep_match": false,
    "adverse_media_match": false,
    "watchlist_match": false,
    "risk_indicators": []
  },
  "risk_score": 20,
  "risk_level": "LOW",
  "cleared_for_trading": true,
  "next_screening_due": "2026-03-27T00:00:00Z",
  "_links": {
    "report": "/api/v1/compliance/investors/inv_001/report"
  }
}
```

### 6.2.4 Get Audit Trail

```http
GET /api/v1/compliance/audit-trail
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `asset_id` | string | Filter by asset |
| `investor_id` | string | Filter by investor |
| `event_type` | string | KYC_SUBMITTED, TRANSFER, DISTRIBUTION, etc. |
| `start_date` | date | Filter from date |
| `end_date` | date | Filter to date |
| `page` | integer | Page number |
| `page_size` | integer | Page size |

**Response (200 OK):**
```json
{
  "events": [
    {
      "event_id": "audit_001",
      "event_type": "TRANSFER",
      "timestamp": "2026-02-27T12:00:00Z",
      "asset_id": "asset_789xyz",
      "investor_id": "inv_001",
      "details": {
        "from_address": "0xSenderAddress...",
        "to_address": "0xRecipientAddress...",
        "amount": 5000,
        "transaction_hash": "0xTransferTxHash...",
        "compliance_checks_passed": 6
      },
      "blockchain": "POLYGON",
      "block_number": 52847561,
      "auditor": "SYSTEM"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 50,
    "total_items": 1247
  }
}
```

### 6.2.5 Export Audit Trail (Regulatory)

```http
POST /api/v1/compliance/audit-trail/export
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "export_format": "PDF",
  "date_range": {
    "start_date": "2026-01-01",
    "end_date": "2026-01-31"
  },
  "asset_id": "asset_789xyz",
  "report_type": "REGULATORY_FILING",
  "jurisdiction": "NG",
  "regulator": "SEC_NIGERIA"
}
```

**Response (202 Accepted):**
```json
{
  "export_id": "export_001",
  "status": "PROCESSING",
  "estimated_completion": "2026-02-27T12:35:00Z",
  "_links": {
    "status": "/api/v1/compliance/audit-trail/export/export_001/status",
    "download": "/api/v1/compliance/audit-trail/export/export_001/download"
  }
}
```

---

# 7. Reporting Service

## 7.1 Overview

**Base URL:** `https://api.ujamaa-defi.com/api/v1/reports`  
**Port:** 8004  
**Description:** Regulatory reports, analytics dashboards, data exports

## 7.2 Endpoints

### 7.2.1 Get Platform Analytics

```http
GET /api/v1/reports/analytics/platform
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "as_of_date": "2026-02-27",
  "summary": {
    "total_assets": 47,
    "active_assets": 35,
    "total_aum_usd": 125000000,
    "total_investors": 2847,
    "verified_investors": 2654,
    "total_transactions_24h": 342,
    "volume_24h_usd": 1250000
  },
  "assets_by_class": [
    { "class": "REAL_ESTATE", "count": 15, "aum_usd": 45000000 },
    { "class": "AGRICULTURE", "count": 12, "aum_usd": 28000000 },
    { "class": "TRADE_FINANCE", "count": 10, "aum_usd": 32000000 },
    { "class": "RENEWABLE_ENERGY", "count": 5, "aum_usd": 12000000 },
    { "class": "PRIVATE_EQUITY", "count": 5, "aum_usd": 8000000 }
  ],
  "investors_by_jurisdiction": [
    { "jurisdiction": "NG", "count": 1245 },
    { "jurisdiction": "KE", "count": 567 },
    { "jurisdiction": "ZA", "count": 423 },
    { "jurisdiction": "GH", "count": 312 },
    { "jurisdiction": "MU", "count": 189 }
  ],
  "performance": {
    "average_yield_bps": 1150,
    "median_yield_bps": 1100,
    "total_distributions_ytd_usd": 4250000,
    "average_nav_change_bps": 350
  },
  "compliance": {
    "kyc_approval_rate_bps": 9200,
    "average_kyc_time_hours": 36,
    "aml_alerts_24h": 3,
    "transfers_blocked_24h": 12
  }
}
```

### 7.2.2 Get Asset Performance Report

```http
GET /api/v1/reports/assets/{asset_id}/performance
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `period` | string | 1M, 3M, 6M, YTD, 1Y, ALL |
| `granularity` | string | DAILY, WEEKLY, MONTHLY |

**Response (200 OK):**
```json
{
  "asset_id": "asset_789xyz",
  "asset_name": "Lagos Commercial Property Portfolio",
  "token_symbol": "LCREIT",
  "period": "YTD",
  "as_of_date": "2026-02-27",
  "performance": {
    "nav_start": { "amount": 1.00, "currency": "USD" },
    "nav_end": { "amount": 1.05, "currency": "USD" },
    "nav_change": { "amount": 0.05, "currency": "USD" },
    "nav_change_bps": 500,
    "distributions_paid": { "amount": 0.025, "currency": "USD" },
    "total_return_bps": 750,
    "annualized_return_bps": 1800
  },
  "nav_history": [
    { "date": "2026-01-31", "nav": 1.01 },
    { "date": "2026-02-28", "nav": 1.05 }
  ],
  "investor_metrics": {
    "investor_count": 145,
    "investor_change": 23,
    "concentration_top_10_bps": 3500,
    "average_holding_usd": 51724
  },
  "trading_metrics": {
    "volume_ytd_usd": 2500000,
    "transaction_count_ytd": 456,
    "average_spread_bps": 150,
    "liquidity_ratio_bps": 1500
  }
}
```

### 7.2.3 Generate Regulatory Report

```http
POST /api/v1/reports/regulatory/generate
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "report_type": "MICA_ARTICLE_22",
  "jurisdiction": "EU",
  "period": {
    "start_date": "2026-01-01",
    "end_date": "2026-01-31"
  },
  "format": "XML",
  "include_annexes": true
}
```

**Response (202 Accepted):**
```json
{
  "report_id": "reg_report_001",
  "report_type": "MICA_ARTICLE_22",
  "status": "GENERATING",
  "estimated_completion": "2026-02-27T13:00:00Z",
  "_links": {
    "status": "/api/v1/reports/regulatory/reg_report_001/status",
    "download": "/api/v1/reports/regulatory/reg_report_001/download"
  }
}
```

### 7.2.4 Get Investor Tax Report

```http
GET /api/v1/reports/investors/{investor_id}/tax
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `tax_year` | integer | Tax year (e.g., 2026) |
| `jurisdiction` | string | Tax jurisdiction (ISO code) |
| `format` | string | PDF, CSV, JSON |

**Response (200 OK):**
```json
{
  "investor_id": "inv_001",
  "tax_year": 2026,
  "jurisdiction": "NG",
  "generated_at": "2026-02-27T13:00:00Z",
  "summary": {
    "total_invested_usd": 120000,
    "total_distributions_usd": 4500,
    "dividend_income_usd": 3200,
    "capital_gains_realized_usd": 1300,
    "capital_losses_realized_usd": 0,
    "withholding_tax_paid_usd": 450
  },
  "transactions": [
    {
      "date": "2026-01-15",
      "type": "PURCHASE",
      "asset": "LCREIT",
      "amount_usd": 50000,
      "shares": 50000,
      "cost_basis_per_share": 1.00
    },
    {
      "date": "2026-02-15",
      "type": "DISTRIBUTION",
      "asset": "LCREIT",
      "amount_usd": 1250,
      "shares": 50000,
      "distribution_type": "DIVIDEND",
      "withholding_tax_usd": 125
    }
  ],
  "_links": {
    "download_pdf": "/api/v1/reports/investors/inv_001/tax?format=PDF",
    "download_csv": "/api/v1/reports/investors/inv_001/tax?format=CSV"
  }
}
```

---

# 8. Gateway Service (gRPC)

## 8.1 Protocol Buffer Definition

```protobuf
// gateway/v1/gateway.proto
syntax = "proto3";

package gateway.v1;

option go_package = "github.com/ujamaa-defi/gateway/pkg/proto";

// Gateway Service
service Gateway {
  // Get latest price for an asset
  rpc GetPrice(PriceRequest) returns (PriceResponse);
  
  // Stream price updates
  rpc StreamPrices(PriceStreamRequest) returns (stream PriceResponse);
  
  // Get blockchain events
  rpc GetBlockchainEvents(BlockchainEventsRequest) returns (BlockchainEventsResponse);
  
  // Stream blockchain events
  rpc StreamBlockchainEvents(BlockchainEventsRequest) returns (stream BlockchainEvent);
  
  // Get NAV for an asset
  rpc GetNAV(NavRequest) returns (NavResponse);
  
  // Submit price (Gateway nodes only)
  rpc SubmitPrice(SubmitPriceRequest) returns (SubmitPriceResponse);
}

message PriceRequest {
  string asset_id = 1;
  string base_currency = 2;  // e.g., "USD"
  string quote_currency = 3; // e.g., "USDC"
}

message PriceResponse {
  string asset_id = 1;
  string base_currency = 2;
  string quote_currency = 3;
  string price = 4;          // Decimal string
  uint64 timestamp = 5;
  uint64 block_number = 6;
  string source = 7;         // "CHAINLINK", "INTERNAL", "MANUAL"
  uint32 confidence_bps = 8; // Confidence interval in basis points
}

message PriceStreamRequest {
  repeated string asset_ids = 1;
  uint32 heartbeat_seconds = 2;
}

message BlockchainEventsRequest {
  string blockchain = 1;     // "ETHEREUM", "POLYGON"
  string contract_address = 2;
  string event_type = 3;     // "TRANSFER", "MINT", "BURN"
  uint64 from_block = 4;
  uint64 to_block = 5;
}

message BlockchainEventsResponse {
  repeated BlockchainEvent events = 1;
  uint64 last_block = 2;
}

message BlockchainEvent {
  string event_id = 1;
  string blockchain = 2;
  string contract_address = 3;
  string event_type = 4;
  uint64 block_number = 5;
  uint64 timestamp = 6;
  string transaction_hash = 7;
  map<string, string> data = 8;
}

message NavRequest {
  string asset_id = 1;
}

message NavResponse {
  string asset_id = 1;
  string nav_per_share = 2;  // Decimal string
  uint64 timestamp = 3;
  string currency = 4;
  uint64 total_shares = 5;
  uint64 shares_outstanding = 6;
  string total_aum = 7;      // Decimal string
}

message SubmitPriceRequest {
  string asset_id = 1;
  string price = 2;
  bytes signature = 3;
  uint64 timestamp = 4;
}

message SubmitPriceResponse {
  bool accepted = 1;
  string submission_id = 2;
}
```

## 8.2 gRPC Service Configuration

```yaml
# grpc_config.yaml
server:
  port: 9000
  max_message_size: 4194304  # 4MB
  keepalive:
    time: 300s
    timeout: 20s
    max_age: 120s

clients:
  chainlink:
    enabled: true
    eth_rpc: "https://mainnet.infura.io/v3/..."
    polygon_rpc: "https://polygon-rpc.com"
    price_feed_addresses:
      ETH_USD: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
      MATIC_USD: "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c1a9730e"
      USDC_USD: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6"

  internal:
    enabled: true
    update_interval_seconds: 60
    deviation_threshold_bps: 500  # 5%
```

---

## 8.7 Fireblocks Custody Service 🆕 (SRS v2.1)

**Base Path:** `/api/v1/fireblocks`  
**Authentication:** JWT + MFA required  
**Authorization:** DevOps Engineer, Platform Admin only  

### 8.7.1 Vault Account Management

**GET /api/v1/fireblocks/vaults**
```
Description: List all Fireblocks vault accounts (platform treasury)
Auth: JWT (DevOps Engineer role)
Response:
{
  "vaults": [
    {
      "id": "vault_001",
      "name": "Platform Treasury",
      "assets": [
        {"asset": "EUROD", "balance": "5000000.00", "locked": "0"},
        {"asset": "USDC", "balance": "2000000.00", "locked": "0"},
        {"asset": "uLP", "balance": "1000000.00", "locked": "0"}
      ]
    }
  ]
}
```

**POST /api/v1/fireblocks/vaults/{vaultId}/transfer**
```
Description: Initiate transfer from Fireblocks vault (requires 3-of-5 multisig)
Auth: JWT + MFA (DevOps Engineer + Platform Admin)
Request:
{
  "asset": "EUROD",
  "amount": "100000.00",
  "destinationAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "note": "Pool deployment - Factory A financing"
}
Response:
{
  "transactionId": "tx_fireblocks_001",
  "status": "PENDING_APPROVAL",
  "requiredApprovals": 3,
  "currentApprovals": 1,
  "approvers": ["admin_001"]
}
```

### 8.7.2 Transaction Management

**GET /api/v1/fireblocks/transactions/{txId}**
```
Description: Get Fireblocks transaction status
Response:
{
  "txId": "tx_fireblocks_001",
  "status": "COMPLETED",
  "asset": "EUROD",
  "amount": "100000.00",
  "destinationAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "txHash": "0xabc123...",
  "completedAt": "2026-03-25T14:30:00Z"
}
```

**Scope Note:** Fireblocks integration is for **platform treasury and pool assets only**, NOT for end-user custody. Users retain self-custody via MetaMask/WalletConnect.

---

## 8.8 Bank Escrow Service 🆕 (SRS v2.1)

**Base Path:** `/api/v1/bank-escrow`  
**Authentication:** JWT + Service Account  
**Authorization:** Pool Manager, Compliance Officer  

### 8.8.1 Escrow Account Management

**GET /api/v1/bank-escrow/accounts**
```
Description: List escrow accounts (BIIC/MCB)
Auth: JWT (Pool Manager, Compliance Officer)
Response:
{
  "accounts": [
    {
      "accountId": "escrow_001",
      "bank": "BIIC",
      "accountNumber": "MU23BIIC01234567890123456",
      "type": "INVESTOR_ESCROW",
      "poolId": "pool_industrie_001",
      "balance": "10000000.00",
      "currency": "EUR"
    },
    {
      "accountId": "escrow_002",
      "bank": "MCB",
      "accountNumber": "MU45MCB09876543210987654",
      "type": "INDUSTRIAL_REPAYMENT",
      "industrialId": "ind_factory_a",
      "balance": "2000000.00",
      "currency": "EUR"
    }
  ]
}
```

### 8.8.2 Wire Transfer Operations

**POST /api/v1/bank-escrow/wire-transfers**
```
Description: Initiate wire transfer (investor deposit or industrial disbursement)
Auth: JWT + MFA (Pool Manager)
Request:
{
  "accountId": "escrow_001",
  "type": "INVESTOR_DEPOSIT",
  "amount": "1000000.00",
  "currency": "EUR",
  "counterparty": {
    "name": "Logic Capital",
    "accountNumber": "LU1234567890",
    "bankCode": "BCEELULL",
    "reference": "uLP Deposit - Pool Industrie 001"
  }
}
Response:
{
  "wireTransferId": "wire_001",
  "status": "PENDING",
  "estimatedArrival": "2026-03-26T10:00:00Z"
}
```

**GET /api/v1/bank-escrow/wire-transfers/{wireId}**
```
Description: Get wire transfer status
Response:
{
  "wireTransferId": "wire_001",
  "status": "COMPLETED",
  "amount": "1000000.00",
  "currency": "EUR",
  "completedAt": "2026-03-26T09:45:00Z",
  "bankReference": "BIIC-REF-20260326-001"
}
```

### 8.8.3 Mobile Money Integration (Production)

**POST /api/v1/bank-escrow/mobile-money/deposit**
```
Description: Initiate Mobile Money deposit (M-Pesa, MTN, Airtel)
Request:
{
  "provider": "M-PESA",
  "phoneNumber": "+254700123456",
  "amount": "50000",
  "currency": "KES",
  "investorWallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
Response:
{
  "transactionId": "mm_001",
  "status": "PENDING_USSD_CONFIRMATION",
  "ussdCode": "*123*456789#",
  "expiresAt": "2026-03-25T15:05:00Z"
}
```

**MVP vs Production:**
- **MVP (Testnet):** MockBankEscrowService simulates wire transfers
- **Production:** Real BIIC/MCB API integration + Mobile Money providers

---

# 9. Authentication & Authorization (SRS v2.1)

## 9.1 Authentication Methods

| Method | Use Case | Token Type | Expiry |
|--------|----------|------------|--------|
| **JWT** | User sessions, API access | Bearer token | 1 hour (access), 7 days (refresh) |
| **API Key** | Server-to-server, partners | X-API-Key header | 1 year (revocable) |
| **OAuth2** | Third-party integrations | Bearer token | Per provider |
| **Wallet Signature** | Web3 authentication | SIWE message | 24 hours |

## 9.2 JWT Token Structure

```json
{
  "iss": "ujamaa-defi-auth",
  "sub": "inv_001",
  "aud": "ujamaa-defi-api",
  "exp": 1709049600,
  "iat": 1709046000,
  "jti": "jwt_abc123",
  "email": "investor@example.com",
  "roles": ["INVESTOR"],
  "permissions": [
    "assets:read",
    "portfolio:read",
    "trades:create",
    "trades:read"
  ],
  "kyc_status": "APPROVED",
  "jurisdiction": "NG"
}
```

## 9.3 Permission Matrix

| Role | Assets | Investors | Trades | Compliance | Reporting |
|------|--------|-----------|--------|------------|-----------|
| **INVESTOR** | R | Self R/W | CRUD | Self R | Self R |
| **ORIGINATOR** | CRUD | - | R | R | Limited R |
| **COMPLIANCE_OFFICER** | R | R/W | R | CRUD | R/W |
| **ADMIN** | CRUD | CRUD | CRUD | CRUD | CRUD |
| **REGULATOR** | R | R | R | CRUD | CRUD |
| **AUDITOR** | R | R | R | R | CRUD |

---

# 10. Error Handling

## 10.1 Error Response Format

```json
{
  "error": {
    "code": "COMPLIANCE_CHECK_FAILED",
    "message": "Transfer violates compliance rules",
    "details": {
      "failed_checks": [
        {
          "check": "LOCKUP_PERIOD",
          "reason": "Tokens are locked until 2027-01-15"
        }
      ]
    },
    "request_id": "req_abc123",
    "timestamp": "2026-02-27T12:00:00Z",
    "_links": {
      "documentation": "https://docs.ujamaa-defi.com/errors/COMPLIANCE_CHECK_FAILED"
    }
  }
}
```

## 10.2 Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `AUTHENTICATION_REQUIRED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `COMPLIANCE_CHECK_FAILED` | 422 | Transfer blocked by compliance |
| `INSUFFICIENT_LIQUIDITY` | 422 | Not enough liquidity for trade |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

---

# 11. Rate Limiting

## 11.1 Rate Limits by Tier

| Tier | Requests/min | Requests/hour | Burst | Use Case |
|------|--------------|---------------|-------|----------|
| **FREE** | 30 | 500 | 10 | Public endpoints, unauthenticated |
| **AUTHENTICATED** | 100 | 1000 | 30 | Logged-in users |
| **PREMIUM** | 500 | 5000 | 100 | High-volume traders |
| **PARTNER** | 1000 | 10000 | 200 | API partners, integrations |
| **INTERNAL** | 10000 | 100000 | 500 | Internal services |

## 11.2 Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1709049660
Retry-After: 60  (when limit exceeded)
```

---

# 12. Webhooks & Events

## 12.1 Webhook Event Types

| Event | Payload | Use Case |
|-------|---------|----------|
| `asset.created` | Asset object | Notify originators |
| `asset.approved` | Asset object | Notify investors |
| `trade.completed` | Trade object | Update portfolios |
| `distribution.scheduled` | Distribution object | Notify investors |
| `distribution.paid` | Distribution object | Confirm payment |
| `kyc.approved` | KYC status | Enable trading |
| `kyc.rejected` | KYC status + reason | Request resubmission |
| `compliance.alert` | Alert object | Notify compliance team |

## 12.2 Webhook Payload Example

```json
{
  "id": "evt_abc123",
  "type": "trade.completed",
  "created_at": "2026-02-27T12:00:00Z",
  "data": {
    "trade_id": "trade_xyz789",
    "investor_id": "inv_001",
    "asset_id": "asset_789xyz",
    "type": "PURCHASE",
    "shares": 9523.81,
    "price_per_share": { "amount": 1.05, "currency": "USD" },
    "total_amount": { "amount": 10000.00, "currency": "USD" },
    "transaction_hash": "0x..."
  },
  "_links": {
    "trade": "/api/v1/trades/trade_xyz789"
  }
}
```

## 12.3 Webhook Signature Verification

```
X-Webhook-Signature: sha256=abc123...
X-Webhook-Timestamp: 1709049600
X-Webhook-ID: evt_abc123
```

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-27 | System Architect | Initial release |

**Related Documents**

- `01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` - Requirements specification
- `02_ARCHITECTURE_SPECIFICATION.md` - System architecture
- `05_SMART_CONTRACT_SPECIFICATION.md` - Smart contract event integration
- `10_COMPLIANCE_FRAMEWORK.md` - Compliance API requirements
- `06_DEPLOYMENT_GUIDE.md` - API deployment configuration
- `07_MONITORING_SPECIFICATION.md` - API monitoring and alerting
- `08_OPERATIONAL_RUNBOOKS.md` - API incident response procedures

