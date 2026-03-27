# Ujamaa DeFi Platform Architecture

## Technical Architecture Deep Dive

**Author:** Aziz Da Silva - Lead Architect  
**Version:** 2.1 (SRS v2.1 Institutional Architecture)  
**Date:** March 25, 2026  
**Classification:** Public  
**Audience:** Technical Teams, System Architects, Engineering Leaders  

---

## Architecture Updates Summary (v2.1)

### Institutional Architecture Additions

| Component | Previous Version | Updated Version | Rationale |
|-----------|-----------------|-----------------|-----------|
| **Token Model** | Ujamaa Asset Token (UAT) only | **uLP (Ujamaa Pool Token)** + **UJG (Ujamaa Guarantee)** + UAT | Institutional liquidity pool architecture |
| **Yield Model** | Distribution-based | **Value-accrual** (uLP) + Distribution (UAT) | Tax-efficient yield compounding |
| **Authentication** | Wallet signature | **SIWE + JWT** with session management | Institutional security requirements |
| **Authorization** | Basic role checks | **RBAC** with explicit permission matrix | Multi-role institutional access |
| **Custody** | Self-custody only | **Fireblocks MPC** (platform treasury) | FSC Mauritius compliance |
| **Bank Integration** | None | **BIIC/MCB escrow** (Production) | Regulatory requirement |
| **Collateral** | Asset-specific | **UJG (ERC-3643NFT)** | Tokenized merchandise collateral |

### New Architecture Components

**Added:**
- Liquidity Pool layer with multi-asset financing
- uLP Token (yield-bearing ERC-3643)
- UJG Token (non-transferable collateral ERC-3643NFT)
- SIWE authentication service
- RBAC middleware
- Fireblocks custody integration
- Bank escrow integration (BIIC/MCB)
- NAV calculation engine
- Yield accrual system

**Updated:**
- Smart contract architecture (uLP, UJG, LiquidityPool contracts)
- API authentication (SIWE + JWT replacing ad-hoc wallet signature)
- Authorization model (RBAC with 10+ roles)
- Compliance framework (KYB threshold €100K, strictest jurisdiction list)

---

**SRS Reference:** This architecture implements **SRS v2.1** (Software Requirements Specification). All components must be traceable to SRS v2.1 requirements.

---

# Technology Updates Summary (v1.1)

## Updated Technology Stack (March 2026)

| Component | Previous Version | Updated Version | Rationale |
|-----------|-----------------|-----------------|-----------|
| **React** | 18.x | 19.x | React 19 stable released January 2026 with React Compiler |
| **TypeScript** | 5.x | 6.0+ | TypeScript 6.0 released early 2026 with strict mode by default |
| **Vite** | 5.x | 7.x (or 8.0 beta) | Vite 7 stable, 8.0 beta available with performance improvements |
| **Python** | 3.11 | 3.11-3.13 | ApeWorX supports Python 3.10-3.13 |
| **PostgreSQL** | 15 | 18.x (or 17.x) | PostgreSQL 18.2 latest stable (Feb 2026), 15.x still supported |
| **Redis** | 7 | 8.x | Redis 8.6 latest (Feb 2026) with performance improvements |
| **Kubernetes** | 1.28 | 1.34-1.35 | EKS 1.35 "Timbernetes" latest (2026) |
| **Solidity** | 0.8.20 | 0.8.31-0.8.33 | Latest stable with EVM features (note: 0.8.28-0.8.33 has IR bug) |
| **Kafka** | 3.x | 4.2.x | Apache Kafka 4.2.0 released February 2026 |
| **Flink** | 1.x | 2.x (or latest 1.x) | Flink Agents 0.2.0 available (Feb 2026) |
| **Prometheus** | 2.x | 3.x | Prometheus 3.x latest (v3 EOL Feb 2026, upgrade to newer 3.x) |
| **Grafana** | 10.x | 12.x | Grafana 12.x latest (2026) |
| **ApeWorX** | Latest | Latest (supports Python 3.10-3.13) | Actively maintained |
| **OpenZeppelin** | 5.0 | 5.4.0 | OpenZeppelin Contracts 5.4.0 latest |
| **Chainlink** | 2.0 | Node v2.31.0+ | Latest stable node version |
| **Gnosis Safe** | Safe | Safe Wallet (formerly Gnosis Safe) | Rebranded to "Safe" |

## Key Technology Notes

### Critical Security Notice
- **Solidity 0.8.28-0.8.33**: Bug reported in IR pipeline (Feb 11, 2026). Use 0.8.34+ or disable IR.
- **React 19**: Stable since January 2026, includes React Compiler for automatic memoization.
- **TypeScript 6.0**: Strict mode enabled by default, module defaults to `esnext`.

### Deprecation Notices
- **PostgreSQL 14.x**: End of life November 2026. Migrate to 18.x or 17.x.
- **Kubernetes 1.26**: Ending maintenance soon. Upgrade to 1.34+ recommended.
- **Gnosis Safe**: Now called "Safe Wallet" or "Safe". Update documentation references.

### Migration Recommendations
1. **React 18 → 19**: Safe upgrade, automatic with React Compiler benefits
2. **TypeScript 5 → 6**: Review strict mode changes, update tsconfig
3. **Redis 7 → 8**: Performance improvements, check compatibility
4. **Kafka 3 → 4**: Review KIPs for breaking changes
5. **Prometheus 2 → 3**: Check metric compatibility

---

# Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Principles](#2-architecture-principles)
3. [System Overview](#3-system-overview)
4. [Layer-by-Layer Architecture](#4-layer-by-layer-architecture)
   - [4.1 Blockchain Layer](#41-blockchain-layer)
   - [4.2 Smart Contract Layer](#42-smart-contract-layer)
   - [4.3 Gateway Layer](#43-gateway-layer)
   - [4.4 Backend Services Layer](#44-backend-services-layer)
   - [4.5 Data Layer](#45-data-layer)
   - [4.6 Frontend Layer](#46-frontend-layer)
   - [4.7 Security Layer](#47-security-layer)
   - [4.8 DevOps & Infrastructure Layer](#48-devops--infrastructure-layer)
5. [Data Flow Walkthrough](#5-data-flow-walkthrough)
6. [Scaling Strategy](#6-scaling-strategy)
7. [Failure Modes & Recovery](#7-failure-modes--recovery)
8. [Technology Decision Matrix](#8-technology-decision-matrix)
9. [Appendices](#9-appendices)

---

# 1. Executive Summary

## 1.1 Platform Mission

UJAMAA DEFI PLATFORM is a **multi-asset securitization and tokenization platform** that enables institutional-grade tokenization of real-world assets (RWAs) on public blockchains while maintaining full regulatory compliance across African and international jurisdictions.

## 1.2 Core Technical Challenge

The platform must solve three fundamental tensions:

| Tension | Description | Resolution Strategy |
|---------|-------------|---------------------|
| **Compliance vs. Decentralization** | Securities regulations require identity verification and transfer restrictions; blockchains are permissionless by default | ERC-3643 (T-REX) protocol embeds compliance at token contract level with on-chain identity verification via ONCHAINID |
| **Immutability vs. GDPR** | Blockchain data cannot be deleted; GDPR Article 17 requires right to erasure | Cryptographic erasure pattern: PII stored off-chain (encrypted), on-chain stores only hash references; erasure = key destruction |
| **Security vs. Cost** | Ethereum provides maximum security but high gas costs; African retail investors need low-cost transactions | Dual-chain architecture: Ethereum for settlement/high-value, Polygon for execution/retail; cross-chain bridge preserves compliance state |

## 1.3 Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           USER ACCESS LAYER                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   React     │  │   Mobile    │  │   USSD      │  │   Regulator             │ │
│  │   Web App   │  │   Wallets   │  │   Gateway   │  │   Portal                │ │
│  │   (TS)      │  │   (WC v2)   │  │   (SMS)     │  │   (SAML SSO)            │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ HTTPS/WSS (TLS 1.3)
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY LAYER                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │  Kong/Nginx: Rate Limiting │ Authentication │ Routing │ DDoS Protection    ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         MICROSERVICES LAYER (FastAPI)                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │  Assets  │ │Investors │ │  Trades  │ │Compliance│ │Reporting │ │  Gateway  │ │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │ │ Service  │ │  Service │ │
│  │          │ │          │ │          │ │          │ │          │ │          │ │
│  │  ┌────┐  │ │  ┌────┐  │ │  ┌────┐  │ │  ┌────┐  │ │  ┌────┐  │ │  ┌────┐  │ │
│  │  │REST│  │ │  │REST│  │ │  │REST│  │ │  │REST│  │ │  │REST│  │ │  │gRPC│  │ │
│  │  └────┘  │ │  └────┘  │ │  └────┘  │ │  └────┘  │ │  └────┘  │ │  └────┘  │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                    Message Bus: Apache Kafka                                 │ │
│  │  Topics: transactions | blocks | identity_claims | alerts | user_events     │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │  PostgreSQL  │ │    Redis     │ │    Kafka     │
            │  (Primary)   │ │   (Cache)    │ │  (Streaming) │
            │  Partitioned │ │   TTL+LRU    │ │  30-day ret. │
            └──────────────┘ └──────────────┘ └──────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      BLOCKCHAIN INTEGRATION LAYER                                │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐                │
│  │   Web3.py        │ │   T-REX/ERC-3643 │ │   Chainlink      │                │
│  │   (RPC Client)   │ │   (Compliance)   │ │   (Gateways)      │                │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────────┐   ┌──────────────────┐
│   Ethereum       │◄──│   Polygon        │
│   Mainnet        │   │   PoS Chain      │
│   (Settlement)   │   │   (Execution)    │
│                  │   │                  │
│  • High-value    │   │  • Retail trades │
│  • Initial mint  │   │  • Compliance    │
│  • Bridge lock   │   │  • Distributions │
│  • Treasury      │   │  • Secondary mkt │
└──────────────────┘   └──────────────────┘
        │                       │
        └───────────┬───────────┘
                    ▼
        ┌───────────────────────┐
        │  Cross-Chain Gateway   │
        │  • Lock & Mint        │
        │  • Compliance Sync    │
        │  • 5-of-9 Multisig    │
        └───────────────────────┘
```

---

# 2. Architecture Principles

## 2.1 Guiding Principles

These principles drove every technical decision in the architecture:

### Principle 1: Compliance by Design
**Statement:** Regulatory compliance is not an afterthought—it is embedded at every layer of the architecture.

**Implementation:**
- ERC-3643 tokens enforce transfer restrictions at the smart contract level
- ONCHAINID identity verification is required before any token acquisition
- All transactions are logged with immutable audit trails
- PII is never stored on-chain (cryptographic erasure pattern)

**Trade-off Accepted:** Slightly higher complexity in smart contract deployment; marginally slower user onboarding (KYC required before first trade).

### Principle 2: Defense in Depth
**Statement:** Security is layered; no single point of failure can compromise the system.

**Implementation:**
- 5-layer security: Network → Application → Smart Contract → Data → Operational
- Multi-signature wallets (Safe, formerly Gnosis Safe) for all treasury operations
- Hardware Security Modules (HSM) for key management
- Regular third-party audits (smart contracts, infrastructure, penetration testing)

**Trade-off Accepted:** Additional operational overhead for key management; slower transaction approval (multisig requires multiple signers).

### Principle 3: Progressive Decentralization
**Statement:** Start with centralized components where necessary for compliance and performance; decentralize where it adds value.

**Implementation:**
- Centralized: User onboarding (KYC), fiat on-ramps (via partners), customer support
- Decentralized: Token custody (self-custody wallets), settlement (blockchain), identity verification (ONCHAINID)
- Hybrid: Gateway networks (Chainlink—decentralized but curated), bridge relayers (permissioned multisig)

**Trade-off Accepted:** Some centralization risk in early stages; clear roadmap for progressive decentralization.

### Principle 4: African-First Design
**Statement:** The architecture is optimized for African market realities: mobile-first, low-bandwidth, multi-language, local payment integration.

**Implementation:**
- React PWA with offline caching and <500KB initial load
- USSD gateway for feature phone users
- M-Pesa, MTN Mobile Money, Airtel Money integration
- Multi-language support (English, French, Portuguese, Arabic, Swahili, Hausa, Yoruba, Zulu)
- African data centers (Teraco, MainOne) for low-latency access

**Trade-off Accepted:** Additional development effort for USSD/USSD integration; maintaining multiple language versions.

### Principle 5: Horizontal Scalability
**Statement:** Every component must scale horizontally; vertical scaling is a temporary measure only.

**Implementation:**
- Stateless microservices (FastAPI) with Kubernetes HPA
- Database partitioning (PostgreSQL by month/asset_id)
- Read replicas for query scaling
- Kafka for async event processing
- Redis for caching (85%+ hit rate target)

**Trade-off Accepted:** Increased operational complexity (distributed systems); eventual consistency for some operations.

---

# 3. System Overview

## 3.1 Component Inventory

| Component | Technology | Purpose | Scale Target |
|-----------|------------|---------|--------------|
| **Frontend** | React 19 + TypeScript 6.0+ + Vite 7.x | User interface for investors, originators, compliance officers | 100,000 concurrent users |
| **API Gateway** | Kong + Nginx | Rate limiting, authentication, routing | 50,000 req/sec |
| **Backend Services** | FastAPI (Python 3.11-3.13) | Business logic, data processing | 10,000 req/sec per service |
| **Primary Database** | PostgreSQL 18.x (or 17.x) | Persistent data storage | 100M+ transactions |
| **Cache** | Redis 8.x | Session, query, computed data caching | 85%+ hit rate |
| **Event Streaming** | Apache Kafka 4.2.x | Real-time event processing | 10,000 events/sec |
| **Stream Processing** | Apache Flink | Complex event processing (fraud detection) | <5 min alert latency |
| **Blockchain** | Ethereum + Polygon | Token settlement, compliance enforcement | 50 TPS combined |
| **Smart Contracts** | Solidity 0.8.31+ + ApeWorX | ERC-3643 tokens, compliance modules | <500K gas/transfer |
| **Gateways** | Chainlink Gateway Node v2.31.0+ + Custom | Price feeds, KYC verification | <1 min update latency |
| **Monitoring** | Prometheus 3.x + Grafana 12.x | Metrics, alerting, dashboards | 1M+ metrics/sec |
| **Container Orchestration** | Kubernetes 1.34-1.35 (EKS/GKE) | Deployment, scaling, health management | 500+ pods |

**Note:** See Technology Updates Summary (Section 1) for version rationale and migration recommendations.

## 3.2 Deployment Topology

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         AWS (Primary Region)                             │
│                        Cape Town (af-south-1)                            │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                     VPC (Private Subnets)                           │ │
│  │                                                                     │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │
│  │  │              EKS Cluster (Kubernetes)                         │  │ │
│  │  │                                                               │  │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │  │ │
│  │  │  │   FastAPI   │  │   FastAPI   │  │   FastAPI   │  ...     │  │ │
│  │  │  │   Pods (3)  │  │   Pods (3)  │  │   Pods (3)  │          │  │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘          │  │ │
│  │  │                                                               │  │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │  │ │
│  │  │  │   Kafka     │  │   Kafka     │  │   Kafka     │          │  │ │
│  │  │  │   Broker    │  │   Broker    │  │   Broker    │          │  │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘          │  │ │
│  │  │                                                               │  │ │
│  │  │  ┌─────────────────────────────────────────────────────────┐ │  │ │
│  │  │  │              RDS PostgreSQL (Primary)                    │ │  │ │
│  │  │  │              Multi-AZ Deployment                         │ │  │ │
│  │  │  └─────────────────────────────────────────────────────────┘ │  │ │
│  │  │                                                               │  │ │
│  │  │  ┌─────────────────────────────────────────────────────────┐ │  │ │
│  │  │  │              ElastiCache Redis (Cluster)                 │ │  │ │
│  │  │  └─────────────────────────────────────────────────────────┘ │  │ │
│  │  └──────────────────────────────────────────────────────────────┘  │ │
│  │                                                                     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │              CloudFront CDN (Edge Locations)                        │ │
│  │         (50+ locations globally, 10+ in Africa)                     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         GCP (DR Region)                                  │
│                        Johannesburg (africa-south1)                      │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                   GKE Cluster (Standby)                             │ │
│  │                   Hot standby for failover                          │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

## 3.3 Network Architecture

```
                              Internet
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   AWS CloudFront CDN    │
                    │   (Static Assets, PWA)  │
                    └─────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   AWS Application LB    │
                    │   (Layer 7, SSL Term)   │
                    └─────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   Kong API Gateway      │
                    │   (Auth, Rate Limit)    │
                    └─────────────────────────┘
                                  │
            ┌─────────────────────┼─────────────────────┐
            │                     │                     │
            ▼                     ▼                     ▼
    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │   Public     │      │   Private    │      │   Private    │
    │   Subnet     │      │   Subnet A   │      │   Subnet B   │
    │              │      │              │      │              │
    │  ┌────────┐  │      │  ┌────────┐  │      │  ┌────────┐  │
    │  │  NAT   │  │      │  │  EKS   │  │      │  │  EKS   │  │
    │  │Gateway │  │      │  │ Nodes  │  │      │  │ Nodes  │  │
    │  └────────┘  │      │  └────────┘  │      │  └────────┘  │
    │              │      │              │      │              │
    └──────────────┘      └──────────────┘      └──────────────┘
                                  │                     │
                                  └──────────┬──────────┘
                                             │
                                             ▼
                                  ┌──────────────────┐
                                  │   RDS PostgreSQL │
                                  │   (Private Only) │
                                  └──────────────────┘
```

**Security Groups:**
- **ALB SG:** Allow 443 from 0.0.0.0/0
- **Kong SG:** Allow 8000 from ALB SG only
- **EKS Node SG:** Allow 443, 8000 from Kong SG; allow 5432 from RDS SG
- **RDS SG:** Allow 5432 from EKS Node SG only
- **Redis SG:** Allow 6379 from EKS Node SG only

**Network ACLs:**
- Deny all inbound from public internet except ALB
- Deny all outbound except to specific AWS services (S3, CloudWatch, KMS)

---

# 4. Layer-by-Layer Architecture

## 4.1 Blockchain Layer

### 4.1.1 Dual-Chain Architecture: Ethereum + Polygon

```
┌─────────────────────────────────────────────────────────────────┐
│                     BLOCKCHAIN LAYER                             │
│                                                                  │
│  ┌─────────────────────────────┐    ┌─────────────────────────┐ │
│  │      ETHEREUM MAINNET       │    │      POLYGON PoS        │ │
│  │                             │    │                         │ │
│  │  Purpose: Settlement Layer  │    │  Purpose: Execution     │ │
│  │                             │    │  Layer                  │ │
│  │  • Initial token minting    │    │  • Secondary trading    │ │
│  │  • High-value transfers     │    │  • Compliance checks    │ │
│  │    (>$100,000)              │    │  • Distributions        │ │
│  │  • Bridge lock/unlock       │    │  • Retail subscriptions │ │
│  │  • Treasury operations      │    │  • Frequent operations  │ │
│  │  • Smart contract upgrades  │    │                         │ │
│  │                             │    │                         │ │
│  │  Security: 128-bit (PoS)    │    │  Security: 100-bit+     │ │
│  │  Finality: ~15 min          │    │  Finality: ~5 min       │ │
│  │  Gas Cost: $5–$50/tx        │    │  Gas Cost: $0.001–$0.01 │ │
│  │  TPS: 15–30                 │    │  TPS: 30–50             │ │
│  └─────────────────────────────┘    └─────────────────────────┘ │
│                                                                  │
│              ┌──────────────────────────────────────┐           │
│              │     CROSS-CHAIN BRIDGE               │           │
│              │                                      │           │
│              │  • Lock-and-mint pattern             │           │
│              │  • 5-of-9 multisig relayers          │           │
│              │  • Compliance state synchronization  │           │
│              │  • Finality: <15 min (ETH→POLY)      │           │
│              └──────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### Technical Choice: Why Two Chains?

**Problem Solved:**
1. **Cost vs. Security Trade-off:** Ethereum provides maximum security (decentralization, finality) but gas costs ($5–$50/transaction) are prohibitive for retail investors. Polygon offers 100–1000x lower costs but with slightly reduced security.

2. **African Market Reality:** Average transaction size for African retail investors may be $10–$100. A $5 gas fee represents 5–50% of the transaction—economically unviable.

3. **Use Case Segregation:** Not all operations require Ethereum-level security. Secondary market trades, compliance checks, and distributions can safely execute on Polygon.

**Use Cases Handled:**

| Use Case | Chain | Rationale |
|----------|-------|-----------|
| Initial token minting | Ethereum | One-time operation, high value, security critical |
| Secondary market trades | Polygon | Frequent operations, cost-sensitive |
| Compliance verification | Polygon | Frequent checks, low security risk |
| Distributions to investors | Polygon | Batch operations, cost efficiency |
| Bridge operations | Ethereum → Polygon | Security critical, one-time per bridge |
| Treasury movements (>$1M) | Ethereum | High value, security critical |
| Smart contract upgrades | Ethereum | Security critical, infrequent |

**Scaling Efficiency:**
- **Horizontal Scaling:** Polygon can handle 30–50 TPS vs. Ethereum's 15–30 TPS
- **Cost Scaling:** Polygon gas costs remain stable under load; Ethereum gas spikes during congestion
- **Geographic Scaling:** Polygon nodes deployed in African data centers (Teraco, MainOne) for <50ms latency

### Technical Choice: Why ERC-3643 (T-REX)?

**Problem Solved:**
1. **Securities Compliance:** Traditional ERC-20 tokens cannot enforce transfer restrictions. Securities laws require that tokens only be transferred to verified, eligible investors.

2. **Identity Verification:** KYC/AML regulations require identity verification before token acquisition. ERC-20 has no identity layer.

3. **Regulatory Audit Trail:** Regulators require transaction logs with identity resolution. ERC-20 events only show wallet addresses.

**How ERC-3643 Works:**

```solidity
// Simplified ERC-3643 transfer flow
function transferWithCompliance(address to, uint256 amount) external returns (bool) {
    // Step 1: Verify sender identity
    require(identityRegistry.isVerified(msg.sender), "Sender not verified");
    
    // Step 2: Verify recipient identity
    require(identityRegistry.isVerified(to), "Recipient not verified");
    
    // Step 3: Check compliance rules
    require(complianceModule.canTransfer(msg.sender, to, amount), "Transfer violates rules");
    
    // Step 4: Execute transfer
    _transfer(msg.sender, to, amount);
    return true;
}
```

**Key Components:**
- **Identity Registry:** Maps wallet addresses to ONCHAINID identity contracts
- **Compliance Module:** Enforces transfer rules (jurisdiction, investor caps, lock-up periods)
- **Trusted Issuers Registry:** Manages authorized Claim Issuers who can issue identity claims

**Use Cases Handled:**
- Private placements (Reg D 506(b), 506(c))
- Retail offerings with investor caps
- Jurisdiction-restricted offerings
- Lock-up period enforcement
- Accredited investor verification

**Scaling Efficiency:**
- **Compliance at Token Level:** No need for off-chain compliance checks; enforcement is automatic
- **Reduced Legal Overhead:** Smart contracts encode regulatory requirements; less manual review
- **Audit Trail:** Every transfer includes compliance status in event logs; regulator queries are trivial

### Technical Choice: Why Cross-Chain Bridge?

**Problem Solved:**
1. **Liquidity Fragmentation:** Tokens minted on Ethereum cannot be traded on Polygon without a bridge.
2. **Compliance State Preservation:** When tokens move between chains, compliance status (KYC verification, transfer restrictions) must be preserved.
3. **User Experience:** Investors should not need to manage separate token positions on different chains.

**Bridge Architecture:**

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CROSS-CHAIN BRIDGE                             │
│                                                                       │
│  ETHEREUM                          POLYGON                            │
│  ┌──────────────────┐              ┌──────────────────┐              │
│  │  Bridge Contract │              │  Bridge Contract │              │
│  │  (Lock/Unlock)   │              │  (Lock/Unlock)   │              │
│  └────────┬─────────┘              └────────┬─────────┘              │
│           │                                 │                         │
│           │ 1. Lock tokens on Ethereum      │                         │
│           │────────────────────────────────>│                         │
│           │                                 │                         │
│           │ 2. Emit Lock event              │                         │
│           │────────────────────────────────>│ (observed by relayers)  │
│           │                                 │                         │
│           │ 3. Relayers sign attestation    │                         │
│           │<────────────────────────────────│ (5-of-9 multisig)       │
│           │                                 │                         │
│           │ 4. Verify signatures + mint     │                         │
│           │────────────────────────────────>│ wrapped tokens on Poly  │
│           │                                 │                         │
│           │ 5. Sync Identity Registry state │                         │
│           │────────────────────────────────>│ Merkle proof of claims  │
│           │                                 │                         │
└──────────────────────────────────────────────────────────────────────┘
```

**Use Cases Handled:**
- Investor moves tokens from Ethereum (long-term hold) to Polygon (active trading)
- Arbitrage between Ethereum and Polygon liquidity pools
- Cost optimization: mint on Ethereum, trade on Polygon

**Scaling Efficiency:**
- **Load Distribution:** High-value operations on Ethereum, high-frequency on Polygon
- **Geographic Distribution:** Polygon nodes in Africa for low-latency access
- **Compliance Scaling:** Identity Registry sync via Merkle proofs (O(log n) verification)

**Risk Mitigation:**
- **Relayer Security:** 5-of-9 multisig prevents single point of compromise
- **Compliance Sync:** Identity Registry state synced with every bridge operation
- **Emergency Brake:** Compliance Officer can pause bridge if sync lag exceeds 4 hours

---

## 4.2 Liquidity Pool Layer 🆕 (SRS v2.1)

### 4.2.1 Institutional Architecture Overview

The Liquidity Pool layer enables **multi-asset securitization** with diversified financing pools represented by yield-bearing uLP tokens.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                      LIQUIDITY POOL ARCHITECTURE                              │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                    LIQUIDITY POOL FAMILY                                 │  │
│  │                                                                         │  │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │  │
│  │  │  POOL_INDUSTRIE  │  │  POOL_AGRICULTURE│  │  POOL_TRADE      │     │  │
│  │  │                  │  │                  │  │  FINANCE         │     │  │
│  │  │  • Factories     │  │  • Coffee        │  │  • Invoices      │     │  │
│  │  │  • Assembly      │  │  • Cocoa         │  │  • Receivables   │     │  │
│  │  │  • Production    │  │  • Cotton        │  │                  │     │  │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘     │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                    SINGLE LIQUIDITY POOL                                 │  │
│  │                                                                         │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │  │
│  │  │  LiquidityPool Smart Contract                                     │  │  │
│  │  │                                                                   │  │  │
│  │  │  • Pool Configuration (family, risk parameters)                  │  │  │
│  │  │  • Asset Allocation (max 10% per industrial)                     │  │  │
│  │  │  • Diversification (min 5 assets)                                │  │  │
│  │  │  • NAV Calculation (real-time)                                   │  │  │
│  │  │  • Yield Accrual (automatic)                                     │  │  │
│  │  └──────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                         │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │  │
│  │  │  uLP Token (ERC-3643 Fungible, Yield-Bearing)                    │  │  │
│  │  │                                                                   │  │  │
│  │  │  • Represents ownership share in pool                            │  │  │
│  │  │  • Value-accrual model (balance constant, NAV increases)         │  │  │
│  │  │  • ERC-3643 compliance (identity verification)                   │  │  │
│  │  │  • Deposit EUROD → mint uLP                                      │  │  │
│  │  │  • Redeem uLP → receive EUROD + yield                            │  │  │
│  │  └──────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                         │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │  │
│  │  │  UJG Tokens (ERC-3643NFT, Collateral)                            │  │  │
│  │  │                                                                   │  │  │
│  │  │  • Token represents certified merchandise                        │  │  │
│  │  │  • Non-transferable (except forced transfer)                     │  │  │
│  │  │  • Held by pool as security until repayment                      │  │  │
│  │  │  • Liquidated on default (auction)                               │  │  │
│  │  └──────────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  Example: POOL_INDUSTRIE with 5 Financings                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                        │  │
│  │  Total Pool Value: €10,000,000                                         │  │
│  │  Total uLP Shares: 10,000,000                                          │  │
│  │  NAV per Share: €1.00 (at inception)                                   │  │
│  │                                                                        │  │
│  │  Asset Allocation:                                                     │  │
│  │  ├─ Factory A (Côte d'Ivoire): €2,000,000 (20%) ──→ UJG #1           │  │
│  │  ├─ Factory B (Benin): €2,000,000 (20%) ──→ UJG #2                   │  │
│  │  ├─ Factory C (Senegal): €2,000,000 (20%) ──→ UJG #3                 │  │
│  │  ├─ Factory D (Togo): €2,000,000 (20%) ──→ UJG #4                    │  │
│  │  └─ Factory E (Mali): €2,000,000 (20%) ──→ UJG #5                    │  │
│  │                                                                        │  │
│  │  Yield Accrual (after 30 days, 12% APR):                              │  │
│  │  ├─ Interest Earned: €100,000                                          │  │
│  │  ├─ New Pool Value: €10,100,000                                        │  │
│  │  ├─ New NAV per Share: €1.01                                           │  │
│  │  └─ Investor Return: +1% (compounded automatically)                   │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 4.2.2 uLP Token Mechanics (Yield-Bearing ERC-3643)

**Value-Accrual Model:**

Unlike traditional distribution-based yield (where tokens are minted and distributed), uLP uses a **value-accrual model**:

```
NAV Calculation:
─────────────────────────────────────────────
NAV_per_share(t) = Total_Pool_Value(t) / Total_uLP_Shares

Investor Value:
─────────────────────────────────────────────
Investor_Value(t) = uLP_Balance × NAV_per_share(t)

Yield Compounding:
─────────────────────────────────────────────
Yield compounds automatically (no distribution required)
Token balance remains constant
NAV per token increases with pool value
```

**Example Flow:**
```
Day 0 (Inception):
├─ Pool Value: €10,000,000
├─ uLP Shares: 10,000,000
├─ NAV per Share: €1.00
└─ Investor A deposits €1,000,000 → receives 1,000,000 uLP

Day 30 (12% APR, 1 month):
├─ Interest Earned: €100,000
├─ Pool Value: €10,100,000
├─ uLP Shares: 10,000,000 (unchanged)
├─ NAV per Share: €1.01
└─ Investor A value: 1,000,000 × €1.01 = €1,010,000 (+1%)

Day 365 (12% APR, 1 year):
├─ Interest Earned: €1,200,000
├─ Pool Value: €11,200,000
├─ uLP Shares: 10,000,000 (unchanged)
├─ NAV per Share: €1.12
└─ Investor A value: 1,000,000 × €1.12 = €1,120,000 (+12%)
```

**Technical Implementation:**
```solidity
// UjamaaPoolToken.sol - Yield-Bearing ERC-3643
contract UjamaaPoolToken is ERC3643 {
    // Value-accrual: balance constant, NAV increases
    function balanceOf(address account) external view returns (uint256) {
        return s_balances[account]; // Constant balance
    }

    function getNAVPerShare() external view returns (uint256) {
        uint256 totalValue = liquidityPool.getTotalPoolValue();
        uint256 totalShares = s_totalSupply;
        return (totalValue * 1e18) / totalShares; // 18 decimals
    }

    function getInvestorValue(address account) external view returns (uint256) {
        uint256 navPerShare = getNAVPerShare();
        uint256 balance = s_balances[account];
        return (balance * navPerShare) / 1e18;
    }

    function deposit(uint256 amountUJUR) external returns (uint256 uLPMinted) {
        uint256 navPerShare = getNAVPerShare();
        uLPMinted = (amountUJUR * 1e18) / navPerShare;
        _mint(msg.sender, uLPMinted);
        liquidityPool.addLiquidity(amountUJUR);
    }

    function redeem(uint256 uLPAmount) external returns (uint256 amountUJUR) {
        uint256 navPerShare = getNAVPerShare();
        amountUJUR = (uLPAmount * navPerShare) / 1e18;
        _burn(msg.sender, uLPAmount);
        liquidityPool.removeLiquidity(amountUJUR);
    }
}
```

### 4.2.3 UJG Token Mechanics (Collateral ERC-3643NFT)

**Purpose:**
The Ujamaa Guarantee (UJG) token represents **certified merchandise** held as collateral by the liquidity pool.

**Lifecycle:**
```
1. Industrial receives order (e.g., ZARA €2M contract)
2. Industrial Gateway certifies stock (SIPI/GDIZ verification)
3. UJG minted (ERC-3643NFT with metadata + compliance)
4. Pool deploys funds to Industrial
5. Pool holds UJG (collateral/security)
6. Industrial repays (principal + interest)
7. UJG transferred back to Industrial (via ERC-3643 forcedTransfer)
8. [DEFAULT SCENARIO] If industrial defaults:
   → UJG liquidated via approved auction
   → Proceeds distributed to uLP holders
   → Default recorded in compliance audit trail
```

**Technical Implementation:**
```solidity
// GuaranteeToken.sol - ERC-3643NFT (ERC-721 + ERC-3643 compliance)
contract GuaranteeToken is ERC3643NFT {
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

    function mintGuarantee(
        address industrial,
        uint256 certificateId,
        uint256 value,
        uint256 expiryDate,
        bytes32 stockHash
    ) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        tokenId = s_nextTokenId++;
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
    }

    // Override transfer to prevent unauthorized transfers
    function transfer(address to, uint256 tokenId) 
        public override returns (bool) 
    {
        revert("UJG is non-transferable; use forcedTransfer");
    }

    function forcedTransfer(address from, address to, uint256 tokenId)
        external override onlyRole(POOL_MANAGER_ROLE) returns (bool)
    {
        // Only Pool, Industrial Gateway, or approved auction winner can receive
        require(
            to == poolAddress || to == gatewayAddress || approvedAuctionWinners[to],
            "Invalid recipient"
        );
        _transfer(from, to, tokenId);
        return true;
    }
}
```

### 4.2.4 Pool Risk Management

**Diversification Rules:**
```solidity
// LiquidityPool.sol - Risk Management
contract LiquidityPool {
    // Diversification constraints
    uint256 public constant MAX_SINGLE_ASSET_PCT = 10; // Max 10% per industrial
    uint256 public constant MIN_ASSETS = 5;             // Min 5 assets for diversification
    uint256 public constant MAX_CONCENTRATION_PCT = 25; // Max 25% in single geography

    function deployCapital(address industrial, uint256 amount) external {
        // Check diversification
        uint256 currentAllocation = getAllocationByIndustrial(industrial);
        uint256 totalValue = getTotalPoolValue();
        
        require(
            (currentAllocation + amount) * 100 / totalValue <= MAX_SINGLE_ASSET_PCT,
            "Would exceed 10% per industrial"
        );

        // Deploy capital, mint UJG as collateral
        guaranteeToken.mintGuarantee(industrial, certificateId, amount, expiryDate, stockHash);
    }
}
```

**NAV Update Frequency:**
- **Real-time:** Deposits, redemptions, new financings
- **Daily:** Yield accrual (interest calculation)
- **Event-triggered:** Default events, liquidations

---

## 4.3 Smart Contract Layer

### 4.3.1 Contract Architecture (SRS v2.1)

```
┌──────────────────────────────────────────────────────────────────────┐
│                     SMART CONTRACT LAYER (SRS v2.1)                   │
│                                                                       │
│  INSTITUTIONAL CONTRACTS (NEW in v2.1):                              │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │  │
│  │  │  LiquidityPool   │  │  UjamaaPoolToken │  │ GuaranteeToken│ │  │
│  │  │                  │  │  (uLP)           │  │  (UJG)       │ │  │
│  │  │  • Pool mgmt     │  │  • Yield-bearing │  │  • Collateral│ │  │
│  │  │  • Asset alloc   │  │  • ERC-3643      │  │  • ERC-3643NFT│ │  │
│  │  │  • NAV calc      │  │  • Value-accrual │  │  • Non-xfer  │ │  │
│  │  └──────────────────┘  └──────────────────┘  └──────────────┘ │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  RETAIL CONTRACTS (MVP-1, unchanged):                                │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │  │
│  │  │  UjamaaToken     │  │  IdentityReg     │  │ Compliance   │ │  │
│  │  │  (UAT)           │  │                  │  │ Module       │ │  │
│  │  │  • ERC-3643      │  │  • KYC claims    │  │  • Rules     │ │  │
│  │  │  • Asset-specific│  │  • Verification  │  │  • Caps      │ │  │
│  │  └──────────────────┘  └──────────────────┘  └──────────────┘ │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  TREX Token Contract (Base ERC-3643 Implementation):                  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │
│  │  │  ERC-20      │  │  ERC-3643    │  │  Compliance  │         │  │
│  │  │  Base        │  │  Extensions  │  │  Module      │         │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```
│  │                                                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │
│  │  │  ERC-20      │  │  ERC-3643    │  │  Compliance  │         │  │
│  │  │  Base        │  │  Extensions  │  │  Module      │         │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                  Identity Registry Contract                     │  │
│  │                  (Maps wallets to ONCHAINID)                    │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │              Trusted Issuers Registry Contract                  │  │
│  │              (Manages authorized Claim Issuers)                 │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                  Compliance Module Contract                     │  │
│  │                  (Transfer rules, investor caps)                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                  Upgradeable Proxy (UUPS Pattern)               │  │
│  │                  (Timelock + Multisig governance)               │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Technical Choice: Why Upgradeable Proxies (UUPS)?

**Problem Solved:**
1. **Smart Contract Immutability:** Deployed contracts cannot be modified. Bugs or regulatory changes require upgradeability.
2. **Security Patches:** Critical vulnerabilities must be patchable without migrating all token holders.
3. **Regulatory Changes:** Compliance rules may change; contracts must adapt without redeployment.

**UUPS Pattern (Universal Upgradeable Proxy Standard):**

```
┌──────────────────────────────────────────────────────────────────────┐
│                    UUPS PROXY PATTERN                                 │
│                                                                       │
│  User Call                                                            │
│      │                                                                │
│      ▼                                                                │
│  ┌─────────────────┐                                                  │
│  │  Proxy Contract │  (Storage)                                       │
│  │                 │  • Token balances                                │
│  │  • delegatecall │  • Allowances                                    │
│  │    ─────────────┼───────────────────────────────────────┐          │
│  └─────────────────┘                                       │          │
│                                                            │          │
│                                                            ▼          │
│                                                  ┌─────────────────┐  │
│                                                  │  Implementation │  │
│                                                  │  Contract       │  │
│                                                  │                 │  │
│                                                  │  • Logic        │  │
│                                                  │  • Functions    │  │
│                                                  │  • Upgradeable  │  │
│                                                  └─────────────────┘  │
│                                                            │          │
│                                                            ▼          │
│                                                  ┌─────────────────┐  │
│                                                  │  Timelock       │  │
│                                                  │  (48-hour delay)│  │
│                                                  └─────────────────┘  │
│                                                            │          │
│                                                            ▼          │
│                                                  ┌─────────────────┐  │
│                                                  │  Multisig       │  │
│                                                  │  (3-of-5)       │  │
│                                                  └─────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

**Use Cases Handled:**
- Security patch deployment (e.g., reentrancy fix)
- Compliance rule updates (e.g., new jurisdiction restrictions)
- Gas optimization (new implementation with optimized code)
- Feature additions (e.g., new distribution mechanisms)

**Scaling Efficiency:**
- **Zero Downtime Upgrades:** Users continue holding tokens during upgrade
- **No State Migration:** Storage remains in proxy; only logic changes
- **Gas Efficiency:** UUPS is more gas-efficient than Transparent Proxy pattern

**Security Controls:**
- **48-Hour Timelock:** Community can review upgrade before execution
- **3-of-5 Multisig:** Prevents single actor from upgrading
- **Emergency Pause:** 2-of-3 security multisig can pause contracts

### Technical Choice: Why ApeWorX (not Hardhat/Truffle)?

**Problem Solved:**
1. **Python Integration:** Backend team uses Python (FastAPI); ApeWorX enables unified language across stack.
2. **Testing Framework:** Pytest integration for familiar testing patterns.
3. **Plugin Ecosystem:** Vyper, Foundry, Solidity support in single framework.

**Use Cases Handled:**
- Smart contract compilation and deployment
- Forked mainnet testing (Ganache replacement)
- Gas reporting and optimization
- Contract verification on Etherscan

**Scaling Efficiency:**
- **Developer Productivity:** Unified Python stack reduces context switching
- **CI/CD Integration:** Pytest integrates with existing Python CI/CD pipelines
- **Gas Optimization:** Built-in gas reporting identifies optimization opportunities

---

## 4.3 Gateway Layer

### 4.3.1 Gateway Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                       GATEWAY LAYER                                    │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   Chainlink Price Feeds                        │  │
│  │                                                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │
│  │  │  ETH/USD     │  │  MATIC/USD   │  │  USDC/USD    │         │  │
│  │  │  <1 min      │  │  <1 min      │  │  <1 min      │         │  │
│  │  │  <1% dev     │  │  <1% dev     │  │  <0.1% dev   │         │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │              Custom Gateway: KYC Verification                    │  │
│  │                                                                 │  │
│  │  Smart Contract Request → Chainlink Functions → FastAPI        │  │
│  │                              │                                  │  │
│  │                              ▼                                  │  │
│  │                       ONCHAINID Contract                        │  │
│  │                       (Claim Verification)                      │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │              Fallback Gateway Architecture                       │  │
│  │                                                                 │  │
│  │  Primary: Chainlink                                             │  │
│  │      │                                                          │  │
│  │      ▼ (if Chainlink unavailable)                               │  │
│  │  Secondary: Pyth Network                                        │  │
│  │      │                                                          │  │
│  │      ▼ (if Pyth unavailable)                                    │  │
│  │  Tertiary: Custom FastAPI Gateway                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Technical Choice: Why Chainlink?

**Problem Solved:**
1. **Price Feeds:** Tokenized assets need real-time valuation for NAV calculation, margin calls, and regulatory reporting.
2. **Decentralization:** Centralized price feeds introduce single point of failure and manipulation risk.
3. **Cross-Chain Support:** Chainlink operates on both Ethereum and Polygon.

**Use Cases Handled:**
- Asset valuation for tokenized real estate, private equity
- Stablecoin peg verification (USDC, USDT)
- Collateralization ratio monitoring for lending protocols
- Circuit breaker triggers (price deviation >5%)

**Scaling Efficiency:**
- **Off-Chain Computation:** Price aggregation happens off-chain; only final value posted on-chain
- **Gas Efficiency:** Updates only when price changes >threshold (reduces update frequency)
- **Parallel Updates:** Multiple price feeds update independently (no serialization)

**Fallback Strategy:**
- **Primary:** Chainlink (decentralized, curated node operators)
- **Secondary:** Pyth Network (alternative decentralized Gateway)
- **Tertiary:** Custom FastAPI Gateway (centralized but controlled)
- **Circuit Breaker:** If all Gateways fail, pause trading until resolved

### Technical Choice: Why Custom KYC Gateway?

**Problem Solved:**
1. **On-Chain Privacy:** Smart contracts cannot access off-chain KYC data directly without exposing PII.
2. **Compliance Verification:** ERC-3643 needs to verify identity claims before transfers.
3. **Gas Efficiency:** On-chain KYC verification would be prohibitively expensive.

**Architecture:**

```
┌──────────────────────────────────────────────────────────────────────┐
│                    KYC VERIFICATION FLOW                              │
│                                                                       │
│  1. User initiates transfer                                           │
│           │                                                           │
│           ▼                                                           │
│  2. ERC-3643 contract requests Gateway verification                    │
│           │                                                           │
│           ▼                                                           │
│  3. Chainlink Functions triggers off-chain computation                │
│           │                                                           │
│           ▼                                                           │
│  4. FastAPI Gateway queries ONCHAINID contract                         │
│           │                                                           │
│           ▼                                                           │
│  5. ONCHAINID returns claim validity (boolean, no PII)                │
│           │                                                           │
│           ▼                                                           │
│  6. Gateway returns result to smart contract                           │
│           │                                                           │
│           ▼                                                           │
│  7. Transfer proceeds or reverts based on result                      │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Use Cases Handled:**
- Real-time KYC verification before token transfers
- Claim expiration checking (expired KYC blocks transfers)
- Accreditation status verification
- Jurisdiction restriction enforcement

**Scaling Efficiency:**
- **Caching:** Gateway responses cached for 24 hours (reduces repeat queries)
- **Batch Verification:** Multiple KYC checks batched in single Gateway call
- **Gas Efficiency:** Only boolean result posted on-chain (minimal gas)

---

---

## 4.4 Authentication & Authorization Layer 🆕 (SRS v2.1)

### 4.4.1 SIWE Authentication Architecture

**Authentication Method:** Sign-In with Ethereum (SIWE) + JWT (JSON Web Tokens)

**Authentication Flow:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         SIWE AUTHENTICATION FLOW                              │
│                                                                               │
│  1. User clicks "Connect Wallet" (MetaMask/WalletConnect)                    │
│           │                                                                   │
│           ▼                                                                   │
│  2. Frontend requests nonce from backend                                     │
│     GET /api/v1/auth/nonce?wallet=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb  │
│           │                                                                   │
│           ▼                                                                   │
│  3. Backend generates cryptographically random nonce (UUID v4)               │
│     - Stores in Redis with TTL: 5 minutes                                    │
│     - Returns: { nonce: "uuid-v4", expiresAt: "ISO8601" }                    │
│           │                                                                   │
│           ▼                                                                   │
│  4. Frontend prompts user to sign SIWE message with wallet                   │
│     SIWE Message Format:                                                     │
│     ┌───────────────────────────────────────────────────────────────────┐   │
│     │ uri: https://ujamaa.defi                                          │   │
│     │ version: 1                                                        │   │
│     │ chain_id: 80002 (Polygon Amoy)                                    │   │
│     │ nonce: uuid-v4                                                    │   │
│     │ issued_at: 2026-03-25T10:00:00Z                                   │   │
│     │ expiration_time: 2026-03-25T10:05:00Z                             │   │
│     │ resources:                                                        │   │
│     │   - ipfs://bafybeigdyrzt5sfp7udm7hu77uh7zzt2pu9hryrgqwpq5jrp7t6vu3  │   │
│     └───────────────────────────────────────────────────────────────────┘   │
│           │                                                                   │
│           ▼                                                                   │
│  5. Frontend submits signature to backend                                    │
│     POST /api/v1/auth/login                                                   │
│     Body: { wallet, signature, nonce }                                        │
│           │                                                                   │
│           ▼                                                                   │
│  6. Backend verifies:                                                        │
│     - Signature recovers wallet address (ecrecover)                          │
│     - Nonce is valid (exists in Redis, not expired)                          │
│     - SIWE message format is valid                                           │
│           │                                                                   │
│           ▼                                                                   │
│  7. Backend generates JWT tokens:                                            │
│     - Access Token (30 days, stored in memory)                               │
│     - Refresh Token (7 days, stored in localStorage encrypted)               │
│           │                                                                   │
│           ▼                                                                   │
│  8. Frontend stores tokens and includes in subsequent requests              │
│     Authorization: Bearer <access_token>                                     │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

**JWT Token Structure:**
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
| Refresh Token | 7 days | localStorage (encrypted) | Via /auth/refresh endpoint |

**Session Management:**
- **Idle Timeout:** 15 minutes of inactivity → force re-authentication
- **Absolute Timeout:** 8 hours max session duration → force logout
- **Concurrent Sessions:** Max 5 active sessions per wallet; oldest evicted on 6th login
- **Session Revocation:** POST /api/v1/auth/logout invalidates all sessions (blacklists JWT `jti` in Redis)
- **Re-authentication Required:**
  - Redemption >€1M
  - PII decryption
  - Compliance rule change
  - Requires: wallet signature + MFA

**Security Measures:**
- Nonce expires in 5 minutes (prevent replay attacks)
- SIWE message includes domain, issued-at, expiration-time (prevent phishing)
- JWT signed with RS256 (asymmetric, HSM-stored private key)
- Refresh token rotation (new refresh token issued on each refresh)
- Rate limiting: 5 failed logins/hour → temporary lockout

### 4.4.2 RBAC Authorization Matrix

**Role-Based Access Control (RBAC) Specification:**

| Role | Resource | Create | Read | Update | Delete | Conditions |
|------|----------|--------|------|--------|--------|------------|
| **Enterprise Partner** | assets | ✓ (own) | ✓ (own) | ✓ (own, pending only) | - | KYB verified |
| **Enterprise Partner** | industrial_certificates | ✓ (own) | ✓ (own) | - | - | ORIGINATOR_ROLE |
| **Investor (Retail)** | investor_holdings | - | ✓ (own) | - | - | KYC verified |
| **Investor (Retail)** | transactions | - | ✓ (own) | - | - | KYC verified |
| **Institutional Investor** | liquidity_pools | - | ✓ (all) | - | - | KYB verified, min €100K |
| **Institutional Investor** | uLP_positions | - | ✓ (own) | - | - | KYB verified |
| **Institutional Investor** | fireblocks_vault | - | ✓ (own) | - | - | KYB verified |
| **Pool Manager** | liquidity_pools | ✓ | ✓ | ✓ | - | POOL_MANAGER_ROLE |
| **Pool Manager** | yield_distributions | ✓ | ✓ | - | - | POOL_MANAGER_ROLE |
| **Compliance Officer** | audit_logs | - | ✓ | - | - | MFA required |
| **Compliance Officer** | PII | - | ✓ (decrypt) | - | - | MFA + justification logged |
| **Compliance Officer** | kyc_claims | ✓ | ✓ | ✓ (revoke) | - | CLAIM_ISSUER_ROLE |
| **Compliance Officer** | regulatory_holds | ✓ | ✓ | ✓ | ✓ | MFA required |
| **Regulator** | transaction_logs | - | ✓ (pseudonymized) | - | - | Read-only portal, SSO |
| **Regulator** | investor_register | - | ✓ (aggregated) | - | - | Judicial authorization for PII |
| **Auditor** | smart_contract_events | - | ✓ | - | - | Time-bound credentials (max 90 days) |
| **Auditor** | nav_calculations | - | ✓ | - | - | Time-bound credentials |
| **DevOps Engineer** | kubernetes_cluster | ✓ | ✓ | ✓ | ✓ | Production: approval required |
| **DevOps Engineer** | secrets_vault | ✓ | ✓ | ✓ | ✓ | MFA + justification |
| **Developer** | smart_contracts | ✓ (staging) | ✓ | ✓ (staging) | - | CI/CD pipeline only |
| **Developer** | api_services | ✓ (staging) | ✓ | ✓ (staging) | - | CI/CD pipeline only |

**Permission Enforcement:**
- API Gateway validates JWT role claims before routing
- Service-layer RBAC middleware enforces fine-grained permissions
- Database row-level security (RLS) for multi-tenant data isolation
- All permission denials logged to audit_logs

**Implementation Example:**
```python
# FastAPI RBAC Middleware
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
    
    # Log permission check for audit
    await audit_log.log(
        event="permission_check",
        wallet=current_user.get("sub"),
        role=user_role,
        resource=required_role,
        granted=user_role == required_role
    )
    
    return current_user

# Usage in route
@app.get("/api/v1/pools")
async def list_pools(user: dict = Depends(require_role("INSTITUTIONAL_INVESTOR"))):
    return await pool_service.list_pools()
```

### 4.4.3 OWASP Top 10 (2025) Mitigations

| OWASP Top 10 (2025) | Mitigation Strategy | Implementation |
|---------------------|---------------------|----------------|
| **A01: Broken Access Control** | RBAC at API gateway + service layer; Database RLS | FastAPI Depends() for role checks; PostgreSQL RLS policies |
| **A03: Injection** | Parameterized queries only; Pydantic validators | SQLAlchemy ORM (no raw SQL); Pydantic schema validation for all inputs |
| **A05: Security Misconfiguration** | CIS benchmarks for Kubernetes; Terraform validation | CIS Kubernetes Benchmark v1.8; tfsec/checkov in CI/CD |
| **A07: Identification/Authentication Failures** | SIWE + JWT; Rate limiting on auth endpoints | 5 failed logins/hour → temporary lockout; MFA for sensitive actions |
| **A08: Software and Data Integrity Failures** | Signed smart contract upgrades; HSM-stored keys | UUPS proxy with timelock; Gnosis Safe 3-of-5 multisig |
| **A09: Security Logging and Monitoring Failures** | Centralized logging (Prometheus/Loki); Alert thresholds | All auth events logged; PagerDuty integration for critical alerts |
| **A10: SSRF** | Egress filtering; Allowlist for oracle calls | Kubernetes NetworkPolicies; HTTP allowlist for Chainlink adapters |

**Input Validation Specification:**
| Field | Type | Validation Rules |
|-------|------|------------------|
| Text (names, descriptions) | String | Max 500 characters; Unicode letters + spaces + basic punctuation (. , - ' ( )) |
| Email | String | RFC 5322 compliant; Max 254 characters; Verified via confirmation email |
| Investment Amount | Decimal | Min €100,000 (institutional), Min €1,000 (retail); Max €1B; 2 decimal places |
| Wallet Address | String | 0x-prefixed; 42 characters; Hex validation (regex: `^0x[a-fA-F0-9]{40}$`) |
| National ID | String | Country-specific regex (e.g., Nigeria NIN: `^\d{11}$`, Ghana Card: `^[A-Z0-9]{9}\d{2}$`) |
| File Upload | Binary | PDF only; Max 10MB; Virus scan (ClamAV) required before processing |
| Date | Date | ISO 8601 format (YYYY-MM-DD); Not in future (for DOB); Not in past (for expiry) |

### 4.4.4 Fireblocks Custody Integration 🆕

**Purpose:** Institutional-grade digital asset custody for platform treasury and pool assets (NOT for end-user custody).

**Integration Architecture:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│                      FIREBLOCKS CUSTODY INTEGRATION                           │
│                                                                               │
│  Platform Treasury (3-of-5 Multisig)                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  Fireblocks Vault                                                      │  │
│  │                                                                        │  │
│  │  • MPC (Multi-Party Computation) Technology                           │  │
│  │  • FSC Mauritius Compliant                                            │  │
│  │  • $1B+ Insurance Coverage                                            │  │
│  │                                                                        │  │
│  │  Assets Held:                                                         │  │
│  │  ├─ Ondo EUROD (EUROD) (treasury reserves)                                          │  │
│  │  ├─ USDC/USDT (operating capital)                                     │  │
│  │  └─ uLP (platform-owned pool shares)                                  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  Transaction Flow:                                                            │
│  1. Platform initiates withdrawal request                                     │
│  2. Fireblocks policy engine validates (KYC/AML, velocity limits)            │
│  3. 3-of-5 signers approve via Fireblocks mobile app                         │
│  4. Transaction signed with MPC (no single private key)                      │
│  5. Broadcast to blockchain                                                   │
│                                                                               │
│  API Integration:                                                             │
│  - Fireblocks API v1                                                          │
│  - Webhook notifications for transaction status                              │
│  - Vault account management per pool                                          │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Scope:**
- ✅ Platform treasury and pool assets
- ✅ FSC Mauritius compliance
- ✅ MPC technology with $1B+ insurance
- ❌ NOT for end-user custody (users retain self-custody via MetaMask/WalletConnect)

### 4.4.5 Bank Escrow Integration 🆕

**Production Banks:**
- **BIIC** (Banque Internationale pour l'Industrie et le Commerce, Mauritius)
- **MCB** (Mauritius Commercial Bank)

**Integration Architecture:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│                       BANK ESCROW INTEGRATION                                 │
│                                                                               │
│  MVP (Testnet):                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  MockEscrow Contract (Polygon Amoy)                                    │  │
│  │  MockFiatRamp Contract (simulates wire transfers)                      │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  Production:                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  Real Escrow Accounts at BIIC/MCB                                      │  │
│  │                                                                        │  │
│  │  Account Structure:                                                    │  │
│  │  ├─ Investor Escrow Account ( segregated per pool)                    │  │
│  │  ├─ Industrial Repayment Account (segregated per industrial)          │  │
│  │  └─ Platform Operating Account (fees, expenses)                       │  │
│  │                                                                        │  │
│  │  Bank API Integration:                                                 │  │
│  │  ├─ Wire transfer initiation (investor deposits)                      │  │
│  │  ├─ Payment processing (industrial disbursements)                     │  │
│  │  ├─ Balance inquiries (real-time)                                     │  │
│  │  └─ Transaction notifications (webhooks)                              │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  Mobile Money Integration (Production):                                      │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  M-Pesa, MTN Mobile Money, Airtel Money                                │  │
│  │                                                                        │  │
│  │  Use Cases:                                                            │  │
│  │  ├─ Retail investor on-ramp (<€10K)                                   │  │
│  │  ├─ Industrial repayment collection                                   │  │
│  │  └─ Yield distribution to mobile wallets                              │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

**MVP vs Production:**
| Feature | MVP (Testnet) | Production |
|---------|--------------|------------|
| Escrow | MockEscrow contract | BIIC/MCB real escrow |
| Fiat Ramp | MockFiatRamp (faucet) | Bank wire + Mobile Money |
| Blockchain | Polygon Amoy only | Polygon mainnet + Ethereum |
| Compliance | Mock KYC/KYB | Real ONCHAINID + KYB |

---

## 4.5 Backend Services Layer

### 4.4.1 Microservices Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                   BACKEND SERVICES LAYER                               │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    FastAPI Microservices                        │  │
│  │                    (Python 3.11, Async)                         │  │
│  │                                                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │
│  │  │  Assets      │  │  Investors   │  │  Trades      │         │  │
│  │  │  Service     │  │  Service     │  │  Service     │         │  │
│  │  │              │  │              │  │              │         │  │
│  │  │  • CRUD      │  │  • KYC       │  │  • Order     │         │  │
│  │  │  • Metadata  │  │  • Profile   │  │    Matching  │         │  │
│  │  │  • Compliance│  │  • Portfolio │  │  • Execution │         │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │  │
│  │                                                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │
│  │  │  Compliance  │  │  Reporting   │  │  Gateway      │         │  │
│  │  │  Service     │  │  Service     │  │  Service     │         │  │
│  │  │              │  │              │  │              │         │  │
│  │  │  • Rules     │  │  • Dashboards│  │  • Prices    │         │  │
│  │  │  • Alerts    │  │  • Exports   │  │  • KYC       │         │  │
│  │  │  • STR filing│  │  • Regulator │  │  • Feeds     │         │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │              Inter-Service Communication                        │  │
│  │                                                                 │  │
│  │  Synchronous: REST API (HTTP/2)                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐                            │  │
│  │  │  Service A   │──│  Service B   │                            │  │
│  │  └──────────────┘  └──────────────┘                            │  │
│  │                                                                 │  │
│  │  Asynchronous: Apache Kafka                                     │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │
│  │  │  Service A   │──│    Kafka     │──│  Service B   │         │  │
│  │  │  (Producer)  │  │   (Topics)   │  │  (Consumer)  │         │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Technical Choice: Why FastAPI (not Django/Flask)?

**Problem Solved:**
1. **Performance:** Async/await support for high-throughput I/O-bound operations (database queries, blockchain RPC calls).
2. **Type Safety:** Pydantic models for request/response validation; automatic OpenAPI schema generation.
3. **Developer Productivity:** Modern Python (3.11+) with type hints; auto-completion in IDEs.

**Performance Comparison:**

| Framework | Requests/sec | Latency p99 | Async Support |
|-----------|-------------|-------------|---------------|
| FastAPI | 20,000+ | <50ms | Native (async/await) |
| Flask | 5,000 | <200ms | No (requires extensions) |
| Django | 3,000 | <300ms | Limited (ASGI) |

**Use Cases Handled:**
- High-throughput API endpoints (10,000 req/sec target)
- Real-time WebSocket connections (portfolio updates, trade confirmations)
- Async blockchain RPC calls (non-blocking Web3.py operations)
- Automatic API documentation (Swagger UI, ReDoc)

**Scaling Efficiency:**
- **Async I/O:** Single worker can handle multiple concurrent requests
- **Horizontal Scaling:** Stateless services scale horizontally via Kubernetes HPA
- **Connection Pooling:** Async database connection pooling (asyncpg, aioredis)

### Technical Choice: Why Microservices (not Monolith)?

**Problem Solved:**
1. **Independent Scaling:** Different services have different scaling requirements (e.g., Trades service needs more replicas than Reporting service).
2. **Fault Isolation:** Failure in one service does not cascade to others.
3. **Team Autonomy:** Different teams can own different services with independent deployment cycles.

**Service Boundaries:**

| Service | Responsibility | Scaling Factor | Database Schema |
|---------|---------------|----------------|-----------------|
| Assets | Asset metadata, tokenization | 3 replicas | `assets`, `token_contracts` |
| Investors | KYC, profiles, portfolios | 5 replicas | `investors`, `kyc_claims` |
| Trades | Order matching, execution | 10 replicas | `orders`, `trades` |
| Compliance | Rules, alerts, STR filing | 3 replicas | `compliance_rules`, `alerts` |
| Reporting | Dashboards, exports | 2 replicas | `reports`, `exports` |
| Gateway | Price feeds, KYC verification | 3 replicas | `Gateway_prices`, `cache` |

**Scaling Efficiency:**
- **Targeted Scaling:** Scale only services under load (not entire application)
- **Resource Optimization:** Allocate more CPU/memory to high-load services
- **Deployment Flexibility:** Deploy updates to individual services without full redeployment

**Trade-offs Accepted:**
- **Distributed System Complexity:** Service discovery, circuit breakers, retry logic required
- **Data Consistency:** Eventual consistency for cross-service operations
- **Operational Overhead:** More services to monitor, deploy, and maintain

### Technical Choice: Why Apache Kafka?

**Problem Solved:**
1. **Event Streaming:** Real-time propagation of blockchain events (transfers, mints, burns) to backend services.
2. **Decoupling:** Producers (blockchain indexers) decoupled from consumers (fraud detection, reporting).
3. **Replayability:** Events can be reprocessed for debugging, backfilling, or new feature development.

**Kafka Topic Design:**

| Topic | Partitions | Retention | Producer | Consumers |
|-------|------------|-----------|----------|-----------|
| `transactions` | 32 | 30 days | Blockchain Indexer | Fraud Detection, Reporting, Analytics |
| `blocks` | 16 | 7 days | Blockchain Indexer | Reporting, Analytics |
| `identity_claims` | 16 | 90 days | ONCHAINID Indexer | Compliance, Reporting |
| `Gateway_prices` | 8 | 7 days | Gateway Service | Trading, Risk Management |
| `alerts` | 16 | 90 days | Fraud Detection | Compliance Dashboard, Email/SMS |
| `user_events` | 32 | 30 days | Frontend | Analytics, Personalization |

**Scaling Efficiency:**
- **Partition Parallelism:** 32 partitions allow 32 concurrent consumers
- **Consumer Groups:** Multiple consumer groups can process same events independently
- **Backpressure Handling:** Kafka buffers events if consumers fall behind

**Use Cases Handled:**
- Real-time fraud detection (transactions → Kafka → Flink → Alerts)
- Portfolio updates (transfers → Kafka → WebSocket → Frontend)
- Regulatory reporting (all events → Kafka → Batch Aggregation → Reports)
- Audit trail (all events → Kafka → PostgreSQL → Immutable logs)

---

## 4.5 Data Layer

### 4.5.1 Database Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   PostgreSQL 15 (Primary)                       │  │
│  │                   (Relational Data)                             │  │
│  │                                                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │
│  │  │  Assets      │  │  Investors   │  │  Transactions│         │  │
│  │  │  (partitioned│  │  (encrypted  │  │  (partitioned│         │  │
│  │  │   by type)   │  │   PII)       │  │   by month)  │         │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │  │
│  │                                                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │
│  │  │  Audit Logs  │  │  Identity    │  │  Compliance  │         │  │
│  │  │  (append-    │  │  Registry    │  │  Rules       │         │  │
│  │  │   only)      │  │  (mirror)    │  │              │         │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   Redis 7 (Cache)                               │  │
│  │                   (In-Memory Data)                              │  │
│  │                                                                 │  │
│  │  Cache Keys:                                                    │  │
│  │  • asset:{asset_id} (5 min TTL)                                 │  │
│  │  • investor:{wallet_hash} (10 min TTL)                          │  │
│  │  • kyc:{wallet_hash} (24 hour TTL)                              │  │
│  │  • price:{symbol} (30 sec TTL)                                  │  │
│  │  • session:{jwt_id} (30 day TTL)                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   Apache Kafka (Streaming)                      │  │
│  │                   (Event Data)                                  │  │
│  │                                                                 │  │
│  │  Topics: transactions, blocks, identity_claims, alerts          │  │
│  │  Retention: 7–90 days (configurable per topic)                  │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Technical Choice: Why PostgreSQL (not MySQL/MongoDB)?

**Problem Solved:**
1. **ACID Compliance:** Financial transactions require atomicity, consistency, isolation, durability.
2. **Complex Queries:** Regulatory reporting requires complex joins, aggregations, window functions.
3. **JSONB Support:** Semi-structured data (asset metadata, compliance rules) stored as JSON with indexing.

**Use Cases Handled:**
- Transactional data (investors, assets, trades)
- Audit logs (immutable, hash-chained)
- Identity registry mirror (off-chain KYC state)
- Compliance rules (JSONB for flexible rule definitions)

**Scaling Efficiency:**
- **Table Partitioning:** `transactions` table partitioned by month (100M+ rows)
- **Read Replicas:** 3 read replicas for query scaling
- **Connection Pooling:** PgBouncer reduces connection overhead (10,000 client connections → 500 database connections)
- **Indexing:** Composite indexes, partial indexes, covering indexes for common queries

**Partitioning Strategy:**

```sql
-- Transactions table partitioned by month
CREATE TABLE transactions_2026_02 PARTITION OF transactions
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

CREATE TABLE transactions_2026_03 PARTITION OF transactions
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');

-- Benefits:
-- • Queries scan only relevant partitions (not full table)
-- • Old partitions can be archived to cold storage
-- • Indexes are smaller (per-partition)
```

### Technical Choice: Why Redis (not Memcached)?

**Problem Solved:**
1. **Caching:** Reduce database load for frequently accessed data (asset metadata, KYC status).
2. **Session Storage:** JWT token blacklist, user session data.
3. **Pub/Sub:** Real-time event broadcasting (WebSocket updates).

**Use Cases Handled:**
- Asset metadata caching (5 min TTL)
- KYC claim validity caching (24 hour TTL)
- Gateway price caching (30 sec TTL)
- User session storage (30 day TTL)
- WebSocket pub/sub (real-time portfolio updates)

**Scaling Efficiency:**
- **LRU Eviction:** Automatic eviction of least-recently-used keys when memory limit reached
- **Cluster Mode:** Redis Cluster with 6 nodes (3 masters, 3 replicas) for horizontal scaling
- **Persistence:** RDB snapshots (5 min) + AOF (append-only file) for durability

**Cache Strategy:**

```python
# Cache-aside pattern with fallback
async def get_asset(asset_id: UUID):
    # Step 1: Try cache
    cached = await redis.get(f"asset:{asset_id}")
    if cached:
        return json.loads(cached)
    
    # Step 2: Cache miss, query database
    asset = await db.assets.get_by_id(asset_id)
    
    # Step 3: Populate cache
    await redis.setex(
        f"asset:{asset_id}",
        ttl=300,  # 5 minutes
        value=json.dumps(asset.dict())
    )
    
    return asset
```

### Technical Choice: Why Cryptographic Erasure for GDPR?

**Problem Solved:**
1. **GDPR vs. Blockchain:** GDPR Article 17 requires right to erasure; blockchain is immutable.
2. **PII Protection:** Personally identifiable information must never be stored on-chain.
3. **Regulatory Compliance:** Platform must satisfy both GDPR and securities regulations (which require identity verification).

**Cryptographic Erasure Pattern:**

```
┌──────────────────────────────────────────────────────────────────────┐
│                  GDPR COMPLIANCE ARCHITECTURE                         │
│                                                                       │
│  ON-CHAIN (Ethereum/Polygon)         OFF-CHAIN (PostgreSQL + Vault)  │
│  ┌────────────────────────┐           ┌────────────────────────┐     │
│  │  ONCHAINID Contract    │           │  investors Table       │     │
│  │                        │           │                        │     │
│  │  • claim_hash          │◄─────────►│  • full_name_encrypted │     │
│  │    (SHA-256)           │           │  • email_encrypted     │     │
│  │                        │           │  • national_id_encrypted│    │
│  │  • claim_issuer        │           │  • encryption_key_id   │     │
│  │                        │           │                        │     │
│  │  NO PII STORED         │           │  PII ENCRYPTED         │     │
│  └────────────────────────┘           │  (AES-256)             │     │
│                                       │                        │     │
│                                       │  ┌────────────────┐   │     │
│                                       │  │  HashiCorp     │   │     │
│                                       │  │  Vault         │   │     │
│                                       │  │                │   │     │
│                                       │  │  encryption    │   │     │
│                                       │  │  keys          │   │     │
│                                       │  └────────────────┘   │     │
│                                       └────────────────────────┘     │
│                                                                       │
│  ERASURE PROCESS (GDPR Article 17):                                   │
│  1. Delete encryption key from Vault                                  │
│  2. Mark investor record as deleted (soft delete)                     │
│  3. Revoke ONCHAINID claims (Claim Issuer action)                     │
│                                                                       │
│  Result: On-chain hash points to unrecoverable data                   │
│          (cryptographic erasure satisfies Article 17)                 │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Use Cases Handled:**
- Investor requests data erasure (GDPR Article 17)
- Data portability (GDPR Article 20) - export decrypted PII
- Privacy by design (GDPR Article 25) - PII never on-chain

**Scaling Efficiency:**
- **Key Management:** Per-investor encryption keys enable granular erasure
- **No Blockchain Mutation:** Erasure does not require blockchain transaction (no gas cost)
- **Audit Trail:** Key deletion logged for regulatory verification

---

## 4.6 Frontend Layer

### 4.6.1 Frontend Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                                    │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   React 18 SPA                                  │  │
│  │                   (TypeScript, Vite)                            │  │
│  │                                                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │
│  │  │  Marketplace │  │  Portfolio   │  │  Compliance  │         │  │
│  │  │  (Asset      │  │  Dashboard   │  │  Dashboard   │         │  │
│  │  │   Discovery) │  │              │  │              │         │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │  │
│  │                                                                 │  │
│  │  Tech Stack:                                                    │  │
│  │  • React 18 (Concurrent Rendering)                              │  │
│  │  • TypeScript (Type Safety)                                     │  │
│  │  • Vite (Build Tool, HMR)                                       │  │
│  │  • MUI (Component Library)                                      │  │
│  │  • TanStack Query (Server State)                                │  │
│  │  • Zustand (Client State)                                       │  │
│  │  • React Router v6 (Routing)                                    │  │
│  │  • Plotly.js (Charts)                                           │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │              Wallet Integration                                 │  │
│  │                                                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │
│  │  │  MetaMask    │  │  WalletConnect│  │  Mobile      │         │  │
│  │  │  (Browser    │  │  v2 (Mobile   │  │  Wallets     │         │  │
│  │  │   Extension) │  │   Wallets)    │  │  (Rainbow,   │         │  │
│  │  │              │  │               │  │   Trust)     │         │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │              Mobile Optimization                                │  │
│  │                                                                 │  │
│  │  • Progressive Web App (PWA) - Offline caching                  │  │
│  │  • Low-Bandwidth Mode - <500KB initial load                     │  │
│  │  • USSD Gateway - Feature phone support                         │  │
│  │  • Multi-language - English, French, Portuguese, Arabic,        │  │
│  │    Swahili, Hausa, Yoruba, Zulu, Afrikaans                      │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Technical Choice: Why React (not Vue/Angular)?

**Problem Solved:**
1. **Component Reusability:** React's component model enables reusable UI components (asset cards, order forms, portfolio charts).
2. **Ecosystem:** Largest ecosystem of third-party libraries (charts, forms, tables).
3. **Developer Availability:** Largest pool of React developers in Africa and globally.

**Use Cases Handled:**
- Marketplace (asset discovery, filtering, search)
- Portfolio dashboard (holdings, performance, distributions)
- Compliance dashboard (alerts, investigations, regulatory reports)
- Regulator portal (read-only access, exportable reports)

**Scaling Efficiency:**
- **Code Splitting:** React.lazy + Suspense for route-based code splitting
- **Concurrent Rendering:** React 18 concurrent features for smooth UX under load
- **Server-Side Rendering (SSR):** Optional SSR for faster initial page load

### Technical Choice: Why TypeScript (not JavaScript)?

**Problem Solved:**
1. **Type Safety:** Catch type errors at compile time (not runtime).
2. **Developer Productivity:** Auto-completion, refactoring, navigation in IDEs.
3. **Documentation:** Types serve as living documentation.

**Scaling Efficiency:**
- **Refactoring Safety:** Large codebase refactoring with confidence
- **Onboarding:** New developers understand code structure from types
- **Bug Prevention:** Type errors caught before deployment

### Technical Choice: Why PWA (Progressive Web App)?

**Problem Solved:**
1. **Offline Access:** African users may have intermittent connectivity.
2. **Installation Friction:** No app store download required.
3. **Performance:** Service workers cache assets for fast subsequent loads.

**Use Cases Handled:**
- Offline portfolio viewing (cached data)
- Slow network optimization (service worker intercepts requests)
- Push notifications (trade confirmations, compliance alerts)

**Scaling Efficiency:**
- **CDN Caching:** Static assets cached at edge (CloudFront 50+ locations)
- **Service Worker:** Repeat visits load from cache (no network request)
- **Lazy Loading:** Images and components loaded on demand

---

## 4.7 Security Layer

### 4.7.1 Security Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYER                                   │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   Network Security                              │  │
│  │                                                                 │  │
│  │  • AWS WAF (DDoS Protection)                                    │  │
│  │  • Security Groups (Micro-segmentation)                         │  │
│  │  • Network ACLs (Subnet-level filtering)                        │  │
│  │  • TLS 1.3 (Encryption in transit)                              │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   Application Security                          │  │
│  │                                                                 │  │
│  │  • JWT Authentication (30-day expiry)                           │  │
│  │  • MFA for PII access                                           │  │
│  │  • RBAC (Role-Based Access Control)                             │  │
│  │  • CSP Headers (XSS prevention)                                 │  │
│  │  • CSRF Tokens (Form submissions)                               │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   Smart Contract Security                       │  │
│  │                                                                 │  │
│  │  • Third-party audits (Trail of Bits, OpenZeppelin)             │  │
│  │  • Bug bounty program (Immunefi, $10K–$1M rewards)              │  │
│  │  • Upgradeable proxies (UUPS pattern)                           │  │
│  │  • Timelock + Multisig governance                               │  │
│  │  • Emergency pause function                                     │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   Key Management                                │  │
│  │                                                                 │  │
│  │  • HashiCorp Vault (Secrets management)                         │  │
│  │  • AWS KMS (Encryption keys)                                    │  │
│  │  • HSM (Hardware Security Module) for Claim Issuer keys         │  │
│  │  • Per-investor encryption keys (GDPR erasure)                  │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Technical Choice: Why HashiCorp Vault (not AWS Secrets Manager)?

**Problem Solved:**
1. **Multi-Cloud:** Vault works across AWS, GCP, Azure (not vendor-locked).
2. **Dynamic Secrets:** Database credentials rotated automatically.
3. **Audit Logging:** All secret access logged for compliance.

**Use Cases Handled:**
- Database credentials (PostgreSQL, Redis)
- API keys (Chainlink, Infura, Alchemy)
- PII encryption keys (per-investor)
- Smart contract deployer keys

**Scaling Efficiency:**
- **Lease-Based Secrets:** Short-lived credentials reduce exposure window
- **Auto-Rotation:** Credentials rotated automatically (no manual intervention)
- **Access Control:** Fine-grained policies (e.g., service can only read specific secrets)

### Technical Choice: Why Safe (formerly Gnosis Safe)?

**Problem Solved:**
1. **Treasury Security:** Platform funds require multiple approvers for withdrawals.
2. **Governance:** Smart contract upgrades require multisig approval.
3. **Audit Trail:** All multisig transactions logged on-chain.

**Use Cases Handled:**
- Treasury withdrawals (3-of-5 for <$100K, 4-of-5 for $100K–$1M, 5-of-5 for >$1M)
- Smart contract upgrades (3-of-5 with 48-hour timelock)
- Emergency pause (2-of-3 security multisig)

**Scaling Efficiency:**
- **Programmable:** Safe SDK enables automated transaction building
- **Integration:** Integrates with existing DeFi protocols (Aave, Compound, Uniswap)
- **Recovery:** Social recovery options (guardians can recover lost keys)

**Note:** Gnosis Safe rebranded to "Safe" in 2025. Documentation may reference either name.

---

## 4.8 DevOps & Infrastructure Layer

### 4.8.1 DevOps Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                   DEVOPS & INFRASTRUCTURE LAYER                       │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   CI/CD Pipeline                                │  │
│  │                   (GitHub Actions)                              │  │
│  │                                                                 │  │
│  │  Code Commit → Lint → Test → Security Scan → Build → Deploy    │  │
│  │                                                                 │  │
│  │  • Lint: ruff, mypy (Python), eslint (TypeScript)               │  │
│  │  • Test: pytest (90% coverage), jest (React)                    │  │
│  │  • Security: bandit, semgrep, Snyk                              │  │
│  │  • Build: Docker images, Helm charts                            │  │
│  │  • Deploy: ArgoCD (GitOps) to Kubernetes                        │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   Kubernetes (EKS/GKE)                          │  │
│  │                                                                 │  │
│  │  • Horizontal Pod Autoscaler (HPA)                              │  │
│  │  • Cluster Autoscaler (add nodes when pods pending)             │  │
│  │  • Pod DisruLPion Budgets (high availability)                   │  │
│  │  • Network Policies (micro-segmentation)                        │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   Infrastructure as Code                        │  │
│  │                   (Terraform)                                   │  │
│  │                                                                 │  │
│  │  • VPC, Subnets, Security Groups                                │  │
│  │  • EKS Cluster, Node Groups                                     │  │
│  │  • RDS PostgreSQL, ElastiCache Redis                            │  │
│  │  • S3 Buckets, CloudFront Distributions                         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   Monitoring & Alerting                         │  │
│  │                   (Prometheus + Grafana)                        │  │
│  │                                                                 │  │
│  │  • Metrics: CPU, Memory, Disk, Network, Request Latency         │  │
│  │  • Logs: Loki (aggregated logging)                              │  │
│  │  • Tracing: Jaeger (distributed tracing)                        │  │
│  │  • Alerts: PagerDuty integration (critical alerts page on-call) │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Technical Choice: Why Kubernetes (not ECS/Lambda)?

**Problem Solved:**
1. **Portability:** Kubernetes works across AWS, GCP, Azure, on-premise (not vendor-locked).
2. **Scaling:** Horizontal Pod Autoscaler scales based on CPU, memory, custom metrics.
3. **Self-Healing:** Failed pods automatically restarted; failed nodes replaced.

**Use Cases Handled:**
- Microservices deployment (FastAPI services)
- Batch processing (reporting, data aggregation)
- Stream processing (Kafka consumers, Flink jobs)

**Scaling Efficiency:**
- **HPA:** Scale pods based on CPU (>70%), memory (>80%), or custom metrics (requests/sec)
- **Cluster Autoscaler:** Add nodes when pods pending due to resource constraints
- **Pod Anti-Affinity:** Spread pods across nodes/availability zones for high availability

### Technical Choice: Why Terraform (not CloudFormation/Pulumi)?

**Problem Solved:**
1. **Multi-Cloud:** Terraform supports AWS, GCP, Azure, Kubernetes (not vendor-locked).
2. **State Management:** Remote state (S3 + DynamoDB locking) enables team collaboration.
3. **Module Ecosystem:** Reusable modules for common patterns (EKS, RDS, VPC).

**Use Cases Handled:**
- VPC and networking (subnets, route tables, security groups)
- EKS cluster and node groups
- RDS PostgreSQL and ElastiCache Redis
- S3 buckets and CloudFront distributions

**Scaling Efficiency:**
- **Workspaces:** Separate environments (dev, staging, production) with same code
- **Modules:** Reusable infrastructure components (e.g., "eks-cluster" module)
- **State Locking:** Prevents concurrent modifications (DynamoDB locking)

### Technical Choice: Why Prometheus + Grafana (not CloudWatch)?

**Problem Solved:**
1. **Multi-Cloud:** Prometheus works across AWS, GCP, Azure, on-premise.
2. **Custom Metrics:** Application-specific metrics (request latency, cache hit rate).
3. **Alerting:** Prometheus Alertmanager routes alerts to PagerDuty, Slack, email.

**Use Cases Handled:**
- Infrastructure metrics (CPU, memory, disk, network)
- Application metrics (request latency, error rate, throughput)
- Business metrics (transaction volume, active users, AUM)

**Scaling Efficiency:**
- **Federation:** Multiple Prometheus servers for large-scale deployments
- **Recording Rules:** Pre-computed aggregations reduce query load
- **Alertmanager:** Deduplication, grouping, silencing of alerts

---

# 5. Data Flow Walkthrough

## 5.1 User Onboarding Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                    USER ONBOARDING FLOW                               │
│                                                                       │
│  1. User visits React marketplace                                     │
│           │                                                           │
│           ▼                                                           │
│  2. Connect wallet (MetaMask/WalletConnect)                           │
│           │                                                           │
│           ▼                                                           │
│  3. Complete KYC form (name, email, national ID, address)             │
│           │                                                           │
│           ▼                                                           │
│  4. FastAPI Investors Service encrypts PII                            │
│           │                                                           │
│           ▼                                                           │
│  5. PII stored in PostgreSQL (AES-256 encrypted)                      │
│           │                                                           │
│           ▼                                                           │
│  6. Encryption key stored in HashiCorp Vault                          │
│           │                                                           │
│           ▼                                                           │
│  7. FastAPI Gateway Service submits KYC to Claim Issuer                │
│           │                                                           │
│           ▼                                                           │
│  8. Claim Issuer verifies identity (off-chain)                        │
│           │                                                           │
│           ▼                                                           │
│  9. Claim Issuer signs ONCHAINID claim                                │
│           │                                                           │
│           ▼                                                           │
│  10. Claim hash stored on-chain (ONCHAINID contract)                  │
│           │                                                           │
│           ▼                                                           │
│  11. FastAPI updates investor.kyc_status = "verified"                 │
│           │                                                           │
│           ▼                                                           │
│  12. User can now subscribe to tokenized assets                       │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Technical Choices:**
- **PII Encryption:** AES-256-GCM with per-investor keys (Vault)
- **ONCHAINID:** Decentralized identity (claim hash on-chain, PII off-chain)
- **Claim Issuer:** Licensed KYC provider (Sumsub, Onfido, Jumio)

**Scaling Considerations:**
- **Async Processing:** KYC verification happens asynchronously (user notified when complete)
- **Caching:** KYC status cached in Redis (24-hour TTL)
- **Rate Limiting:** KYC submissions rate-limited (10 per minute per IP)

## 5.2 Token Subscription Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                   TOKEN SUBSCRIPTION FLOW                             │
│                                                                       │
│  1. User selects asset in React marketplace                           │
│           │                                                           │
│           ▼                                                           │
│  2. FastAPI Assets Service fetches asset metadata (cached in Redis)   │
│           │                                                           │
│           ▼                                                           │
│  3. User enters subscription amount (in USDC)                         │
│           │                                                           │
│           ▼                                                           │
│  4. FastAPI Compliance Service checks:                                │
│      • User KYC status (verified?)                                    │
│      • Jurisdiction whitelist (allowed?)                              │
│      • Investor cap (not exceeded?)                                   │
│      • Minimum investment (met?)                                      │
│           │                                                           │
│           ▼                                                           │
│  5. If compliant, React prompts wallet signature                      │
│           │                                                           │
│           ▼                                                           │
│  6. User signs USDC transfer transaction                              │
│           │                                                           │
│           ▼                                                           │
│  7. Smart contract receives USDC, mints ERC-3643 tokens               │
│           │                                                           │
│           ▼                                                           │
│  8. Transfer event emitted (captured by blockchain indexer)           │
│           │                                                           │
│           ▼                                                           │
│  9. Indexer publishes event to Kafka (topic: transactions)            │
│           │                                                           │
│           ▼                                                           │
│  10. FastAPI Trades Service consumes Kafka event                      │
│           │                                                           │
│           ▼                                                           │
│  11. PostgreSQL updated (user token balance)                          │
│           │                                                           │
│           ▼                                                           │
│  12. Redis cache invalidated (user portfolio)                         │
│           │                                                           │
│           ▼                                                           │
│  13. WebSocket pushes update to React frontend                        │
│           │                                                           │
│           ▼                                                           │
│  14. User sees updated portfolio balance                              │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Technical Choices:**
- **Compliance Check:** FastAPI pre-validates before blockchain transaction (saves gas on failed transactions)
- **Event Indexing:** Blockchain indexer captures events (The Graph or custom indexer)
- **WebSocket:** Real-time portfolio updates (no page refresh required)

**Scaling Considerations:**
- **Batch Processing:** Multiple subscriptions batched in single blockchain transaction (gas efficiency)
- **Kafka Buffering:** Events buffered in Kafka if backend services fall behind
- **Cache Invalidation:** Selective cache invalidation (only affected user's portfolio)

## 5.3 Cross-Chain Bridge Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                    CROSS-CHAIN BRIDGE FLOW                            │
│                 (Ethereum → Polygon)                                  │
│                                                                       │
│  1. User initiates bridge in React (select tokens to bridge)          │
│           │                                                           │
│           ▼                                                           │
│  2. FastAPI Bridge Service checks compliance (KYC valid?)             │
│           │                                                           │
│           ▼                                                           │
│  3. React prompts wallet signature (Ethereum)                         │
│           │                                                           │
│           ▼                                                           │
│  4. User approves ERC-3643 token transfer to bridge contract          │
│           │                                                           │
│           ▼                                                           │
│  5. Bridge contract locks tokens on Ethereum                          │
│           │                                                           │
│           ▼                                                           │
│  6. Lock event emitted (captured by relayers)                         │
│           │                                                           │
│           ▼                                                           │
│  7. Relayers (5-of-9 multisig) observe event                          │
│           │                                                           │
│           ▼                                                           │
│  8. Relayers sign attestation (Merkle proof of lock)                  │
│           │                                                           │
│           ▼                                                           │
│  9. Relayers submit attestation to Polygon bridge contract            │
│           │                                                           │
│           ▼                                                           │
│  10. Polygon bridge contract verifies signatures (5-of-9)             │
│           │                                                           │
│           ▼                                                           │
│  11. Polygon bridge contract mints wrapped ERC-3643 tokens            │
│           │                                                           │
│           ▼                                                           │
│  12. Identity Registry state synced (Merkle proof of KYC claims)      │
│           │                                                           │
│           ▼                                                           │
│  13. Compliance Module rules replicated on Polygon                    │
│           │                                                           │
│           ▼                                                           │
│  14. User receives wrapped tokens on Polygon wallet                   │
│           │                                                           │
│           ▼                                                           │
│  15. User can now trade on Polygon (low gas costs)                    │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Technical Choices:**
- **Lock-and-Mint:** Tokens locked on source chain, wrapped tokens minted on destination
- **Relayer Network:** 5-of-9 multisig prevents single point of compromise
- **Compliance Sync:** Identity Registry state synced via Merkle proofs (O(log n) verification)

**Scaling Considerations:**
- **Relayer Redundancy:** 9 relayers in geographically distributed locations
- **Rate Limiting:** Bridge volume limited ($10M/day) to prevent exploit drain
- **Emergency Brake:** Compliance Officer can pause bridge if sync lag >4 hours

---

# 6. Scaling Strategy

## 6.1 Horizontal Scaling Per Layer

### Frontend Scaling

```
┌──────────────────────────────────────────────────────────────────────┐
│                    FRONTEND SCALING                                   │
│                                                                       │
│  CloudFront CDN (50+ edge locations)                                  │
│           │                                                           │
│           ▼                                                           │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  React SPA (Static Assets)                                      │  │
│  │                                                                 │  │
│  │  • Cached at edge for 1 year (versioned filenames)              │  │
│  │  • HTML cached for 5 minutes (stale-while-revalidate)           │  │
│  │  • Gzip/Brotli compression                                      │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Scaling Triggers:                                                    │
│  • Traffic spike → CloudFront auto-scales (no action needed)          │
│  • Cache miss rate >20% → Review caching strategy                     │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Scaling Limit:** Unlimited (CDN scales automatically)

### Backend Services Scaling

```
┌──────────────────────────────────────────────────────────────────────┐
│                  BACKEND SERVICES SCALING                             │
│                                                                       │
│  Kubernetes HPA (Horizontal Pod Autoscaler)                           │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │  Pod 1      │  │  Pod 2      │  │  Pod N      │                  │
│  │  (FastAPI)  │  │  (FastAPI)  │  │  (FastAPI)  │                  │
│  │             │  │             │  │             │                  │
│  │  CPU: 70%   │  │  CPU: 75%   │  │  CPU: 68%   │                  │
│  │  Mem: 80%   │  │  Mem: 82%   │  │  Mem: 79%   │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
│           ▲                                                           │
│           │                                                           │
│  HPA Configuration:                                                   │
│  • Min replicas: 3 (high availability)                                │
│  • Max replicas: 50 (cost control)                                    │
│  • Target CPU: 70%                                                    │
│  • Target Memory: 80%                                                 │
│  • Scale-up cooldown: 3 minutes                                       │
│  • Scale-down cooldown: 10 minutes                                    │
│                                                                       │
│  Scaling Triggers:                                                    │
│  • CPU >70% for 3 minutes → Add pods (up to 50)                       │
│  • Memory >80% for 3 minutes → Add pods (up to 50)                    │
│  • Requests/sec >1000 per pod → Add pods (up to 50)                   │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Scaling Limit:** 50 pods × 10,000 req/sec = 500,000 req/sec

### Database Scaling

```
┌──────────────────────────────────────────────────────────────────────┐
│                    DATABASE SCALING                                   │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Primary (Read-Write)                                │  │
│  │  • 8 vCPU, 64GB RAM, 1TB NVMe                                   │  │
│  │  • Multi-AZ deployment (synchronous replication)                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│           │                                                           │
│           ▼ (Async Replication)                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Read Replica 1 (Read-Only)                          │  │
│  │  • 4 vCPU, 32GB RAM, 1TB NVMe                                   │  │
│  └────────────────────────────────────────────────────────────────┘  │
│           │                                                           │
│           ▼ (Async Replication)                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Read Replica 2 (Read-Only)                          │  │
│  │  • 4 vCPU, 32GB RAM, 1TB NVMe                                   │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Scaling Triggers:                                                    │
│  • Primary CPU >80% → Add read replica                                │
│  • Storage >80% → Add Citus worker node (sharding)                    │
│  • Write throughput >10,000/sec → Consider sharding                   │
│                                                                       │
│  Partitioning Strategy:                                               │
│  • transactions: partitioned by month (100M+ rows)                    │
│  • audit_logs: partitioned by month                                   │
│  • assets: partitioned by asset_type                                  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Scaling Limit:**
- Read scaling: Unlimited (add read replicas)
- Write scaling: ~10,000 writes/sec (single primary); shard with Citus for more

### Cache Scaling

```
┌──────────────────────────────────────────────────────────────────────┐
│                      CACHE SCALING                                    │
│                                                                       │
│  Redis Cluster (6 nodes: 3 masters, 3 replicas)                       │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │  Master 1   │  │  Master 2   │  │  Master 3   │                  │
│  │  (5,461     │  │  (5,461     │  │  (5,461     │                  │
│  │   slots)    │  │   slots)    │  │   slots)    │                  │
│  │             │  │             │  │             │                  │
│  │  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │                  │
│  │  │Replica│  │  │  │Replica│  │  │  │Replica│  │                  │
│  │  └───────┘  │  │  └───────┘  │  │  └───────┘  │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
│                                                                       │
│  Scaling Triggers:                                                    │
│  • Memory >80% → Add new master node (rebalance slots)                │
│  • CPU >80% → Add replica for read scaling                            │
│  • Connections >10,000 → Add proxy (Twemproxy/Codis)                  │
│                                                                       │
│  Hit Rate Target: >85%                                                │
│  Alert: Hit rate <80% for 10 minutes                                  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Scaling Limit:** 16,384 hash slots × 3 masters = ~50GB data, 100,000+ ops/sec

---

## 6.2 Scaling Bottlenecks & Mitigation

| Bottleneck | Symptom | Mitigation |
|------------|---------|------------|
| **Database Write Throughput** | Write latency >100ms, connection queue | Add read replicas, partition tables, shard with Citus |
| **Kafka Consumer Lag** | Consumer lag >10,000 messages | Add consumer instances, increase partitions |
| **Blockchain Gas Spikes** | Transaction failures, high gas costs | Shift load to Polygon, batch transactions |
| **Cache Miss Rate** | Cache hit rate <80%, database load spikes | Review TTLs, warm cache on deployment |
| **API Rate Limiting** | 429 Too Many Requests errors | Increase rate limits, add caching |
| **WebSocket Connections** | Connection drops, high memory usage | Add WebSocket proxy (Socket.IO with Redis adapter) |

---

# 7. Failure Modes & Recovery

## 7.1 Failure Mode Analysis

### Failure Mode 1: PostgreSQL Primary Failure

**Detection:**
- Prometheus alert: `postgres_primary_unreachable`
- Application logs: Database connection errors

**Automatic Recovery:**
1. Kubernetes detects pod failure, restarts pod
2. If node failure, Kubernetes schedules pod on healthy node
3. RDS Multi-AZ fails over to standby (60–120 seconds)

**Manual Recovery:**
1. Promote read replica to primary (`ALTER SYSTEM SET primary_standby_mode = off`)
2. Update application connection string
3. Investigate root cause

**Data Loss Risk:** Minimal (synchronous replication to standby)

### Failure Mode 2: Kafka Broker Failure

**Detection:**
- Prometheus alert: `kafka_broker_down`
- Consumer lag increasing

**Automatic Recovery:**
1. Kafka replicates partitions across 3 brokers (replication factor = 3)
2. If broker fails, partitions fail over to replicas
3. Kubernetes restarts failed broker pod

**Manual Recovery:**
1. Add new broker if cluster under-replicated
2. Rebalance partitions if needed

**Data Loss Risk:** None (replication factor = 3, min.insync.replicas = 2)

### Failure Mode 3: Blockchain Gateway Failure

**Detection:**
- Prometheus alert: `gateway_price_stale` (no update >1 hour)
- Circuit breaker triggered (price deviation >5%)

**Automatic Recovery:**
1. Fallback to secondary Gateway (Pyth Network)
2. If secondary fails, use custom FastAPI Gateway
3. If all fail, pause trading (circuit breaker)

**Manual Recovery:**
1. Investigate Gateway provider status
2. Switch to backup Gateway provider
3. Resume trading when Gateway healthy

**Data Loss Risk:** None (Gateway data is ephemeral, can be re-fetched)

### Failure Mode 4: Smart Contract Vulnerability

**Detection:**
- Bug bounty report (Immunefi)
- Unusual transaction patterns (fraud detection)
- Third-party audit finding

**Automatic Recovery:**
1. Emergency pause function (2-of-3 security multisig)
2. Trading halted, withdrawals paused

**Manual Recovery:**
1. Deploy patched smart contract (via upgradeable proxy)
2. Migrate state to new implementation
3. Resume trading after verification

**Data Loss Risk:** Depends on vulnerability severity (pause prevents further loss)

---

# 8. Technology Decision Matrix

## 8.1 Technology Selection Criteria

| Technology | Alternatives Considered | Selection Rationale |
|------------|------------------------|---------------------|
| **Blockchain** | Ethereum, Solana, Avalanche, Polygon | Ethereum (security) + Polygon (cost) dual-chain optimal for compliance + retail |
| **Token Standard** | ERC-20, ERC-721, ERC-1155, ERC-3643 | ERC-3643 only standard with built-in compliance (KYC, transfer restrictions) |
| **Smart Contract Framework** | Hardhat, Truffle, Foundry, ApeWorX | ApeWorX (Python integration, pytest, unified stack with backend) |
| **Backend Framework** | Django, Flask, FastAPI, Node.js | FastAPI (async, type safety, performance, Python ecosystem) |
| **Database** | MySQL, PostgreSQL, MongoDB, CockroachDB | PostgreSQL (ACID, JSONB, partitioning, mature ecosystem) |
| **Cache** | Memcached, Redis, Hazelcast | Redis (data structures, pub/sub, persistence, cluster mode) |
| **Event Streaming** | RabbitMQ, Apache Kafka, AWS Kinesis | Kafka (throughput, partitioning, replayability, ecosystem) |
| **Frontend** | Vue, Angular, React, Svelte | React (ecosystem, developer availability, component model) |
| **Container Orchestration** | Docker Swarm, Kubernetes, ECS | Kubernetes (portability, ecosystem, auto-scaling) |
| **Infrastructure as Code** | CloudFormation, Pulumi, Terraform | Terraform (multi-cloud, modules, state management) |
| **Monitoring** | CloudWatch, Datadog, Prometheus | Prometheus (open-source, multi-cloud, custom metrics) |
| **Secrets Management** | AWS Secrets Manager, Azure Key Vault, HashiCorp Vault | Vault (multi-cloud, dynamic secrets, audit logging) |

---

# 9. Appendices

## 9.1 Glossary

| Term | Definition |
|------|------------|
| **ERC-3643** | Ethereum token standard for permissioned tokens with on-chain identity verification |
| **T-REX** | Token for Regulated Exchanges; reference implementation of ERC-3643 |
| **ONCHAINID** | Decentralized identity protocol for KYC/AML claims |
| **UUPS** | Universal Upgradeable Proxy Standard (gas-efficient proxy pattern) |
| **HPA** | Horizontal Pod Autoscaler (Kubernetes scaling mechanism) |
| **BCEAO** | Banque Centrale des États de l'Afrique de l'Ouest (regional central bank) |
| **AMF-UEMOA** | Autorité des Marchés Financiers de l'UEMOA (regional securities regulator) |
| **BRVM** | Bourse Régionale des Valeurs Mobilières (regional stock exchange) |
| **GIABA** | West Africa Inter-Governmental Action Group against Money Laundering |

## 9.2 Architecture Decision Records (ADRs)

Architecture Decision Records are maintained in the `/docs/adr` directory:
- ADR-001: Dual-Chain Architecture (Ethereum + Polygon)
- ADR-002: ERC-3643 Token Standard Selection
- ADR-003: Cryptographic Erasure for GDPR Compliance
- ADR-004: Microservices vs. Monolith
- ADR-005: Apache Kafka for Event Streaming

## 9.3 Related Documents

- `01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` — Software Requirements Specification
- `10_COMPLIANCE_FRAMEWORK.md` — Regulatory Compliance Documentation
- `06_DEPLOYMENT_GUIDE.md` — Deployment Guide and Runbooks
- `07_MONITORING_SPECIFICATION.md` — Monitoring and Observability

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | February 26, 2026 | UJAMAA DEFI PLATFORM Architecture Team | Initial release |
| 1.1 | March 1, 2026 | UJAMAA DEFI PLATFORM Architecture Team | Technology stack updates for March 2026: React 19, TypeScript 6.0, PostgreSQL 18.x, Redis 8.x, Kafka 4.2.x, Kubernetes 1.35, Solidity 0.8.31+, Grafana 12.x, Safe (Gnosis Safe rebrand), security notices |

---

*This document is classified as Public and may be shared with technical teams, auditors, and engineering candidates.*


