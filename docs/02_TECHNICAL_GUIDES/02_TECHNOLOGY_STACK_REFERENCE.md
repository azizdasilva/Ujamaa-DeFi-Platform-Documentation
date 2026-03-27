# Technology Stack Reference

**Document ID:** UJAMAA-TECH-002  
**Version:** 2.0  
**Date:** March 18, 2026  
**Author:** Aziz Da Silva - Lead Architect  
**Status:** ✅ Active  
**Aligned With:** SRS v2.0 Section 10.46

---

## **1. Executive Summary**

This document defines the complete technology stack for the UJAMAA DeFi Platform, aligned with SRS v2.0 and MVP specifications.

---

## **2. Technology Updates Summary (March 2026)**

### **Updated Technology Stack**

| Component | Previous Version | Current Version | Rationale |
|-----------|-----------------|-----------------|-----------|
| **React** | 18.x | 19.x | React 19 stable with React Compiler |
| **TypeScript** | 5.x | 6.0+ | Strict mode by default |
| **Vite** | 5.x | 7.x | Performance improvements |
| **Python** | 3.11 | 3.11-3.13 | ApeWorX supports 3.10-3.13 |
| **PostgreSQL** | 15 | 17.x/18.x | 14.x EOL November 2026 |
| **Redis** | 7 | 8.x | Performance improvements |
| **Kubernetes** | 1.28 | 1.34-1.35 | EKS 1.35 latest |
| **Solidity** | 0.8.20 | 0.8.31+ | Latest stable (avoid 0.8.28-0.8.33 IR bug) |
| **Kafka** | 3.x | 4.2.x | Apache Kafka 4.2.0 |
| **Prometheus** | 2.x | 3.x | Prometheus 3.x latest |
| **Grafana** | 10.x | 12.x | Grafana 12.x latest |
| **OpenZeppelin** | 5.0 | 5.4.0 | Latest stable |
| **Chainlink** | 2.0 | Node v2.31.0+ | Latest stable |

### **Critical Security Notice**
- **Solidity 0.8.28-0.8.33:** Bug reported in IR pipeline. Use 0.8.34+ or disable IR.

### **Deprecation Notices**
- **PostgreSQL 14.x:** EOL November 2026. Migrate to 17.x or 18.x.
- **Kubernetes 1.26:** Ending maintenance. Upgrade to 1.34+ recommended.

---

## **3. Complete Technology Stack**

### **3.1 Blockchain Layer**

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Primary Blockchain** | Polygon PoS | Latest | Low-cost execution |
| **Settlement Blockchain** | Ethereum Mainnet | Latest | High-value settlement |
| **Testnet** | Polygon Amoy | Chain ID: 80002 | MVP testing |
| **Smart Contract Framework** | ApeWorX | 0.7+ | Python-based development |
| **Smart Contract Language** | Solidity | 0.8.31+ | Contract implementation |
| **Token Standard** | ERC-3643 (T-REX) | Latest | Permissioned tokens |
| **NFT Standard** | ERC-3643NFT | Latest | Permissioned NFTs |

### **3.2 Smart Contract Layer**

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Development Framework** | ApeWorX | 0.7+ | Smart contract development |
| **Testing Framework** | ApeWorX + Pytest | - | Contract testing |
| **Coverage Tool** | ApeWorX Coverage | - | >95% coverage required |
| **Static Analysis** | Slither, Mythril | Latest | Security scanning |
| **Formal Verification** | Certora | Critical paths | Mathematical verification |
| **Library** | OpenZeppelin Contracts | 5.4.0 | Secure contract library |

### **3.3 Gateway/Oracle Layer**

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Price Feeds** | Chainlink | Node v2.31.0+ | Asset price data |
| **KYC Verification** | ONCHAINID Gateway | Custom | Identity verification |
| **Reserve Proof** | ReserveGateway.sol | Custom | Bank reserve attestation |
| **NAV Calculation** | NAVGateway.sol | Custom | Net Asset Value feeds |
| **Yield Calculation** | YieldGateway.sol | Custom | Yield data feeds |

### **3.4 Backend Services Layer**

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | FastAPI | 0.109+ | Modern Python web framework |
| **Language** | Python | 3.11-3.13 | Backend development |
| **Serialization** | Pydantic v2 | 2.5+ | Data validation |
| **Documentation** | OpenAPI 3.1 | Auto-generated | API documentation |
| **gRPC** | grpcio + grpc-tools | 1.60+ | High-performance RPC |
| **Message Bus** | Apache Kafka | 4.2.x | Event streaming |
| **Stream Processing** | Apache Flink | 2.x | Complex event processing |

### **3.5 Data Layer**

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Primary Database** | PostgreSQL | 17.x/18.x | Persistent data storage |
| **Cache** | Redis | 8.x | Session, query caching |
| **Event Streaming** | Apache Kafka | 4.2.x | Real-time event processing |
| **GDPR Compliance** | Cryptographic Erasure | - | PII protection |

### **3.6 Frontend Layer**

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | React | 19.x | User interface |
| **Language** | TypeScript | 6.0+ | Type-safe development |
| **Build Tool** | Vite | 7.x | Fast builds, HMR |
| **Component Library** | MUI (Material-UI) | v5 | UI components |
| **State Management** | Zustand | Latest | Client state |
| **Server State** | TanStack Query | Latest | Server state management |
| **Routing** | React Router v6 | Latest | Client-side routing |
| **Forms** | React Hook Form + Zod | Latest | Form handling |
| **Charts** | Plotly.js / Recharts | Latest | Financial visualizations |
| **Tables** | TanStack Table | Latest | Data tables |
| **Web3 Integration** | Wagmi + Viem | Latest | Blockchain interaction |
| **Wallet UI** | RainbowKit | Latest | Wallet connection |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |

### **3.7 Security Layer**

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Secrets Management** | HashiCorp Vault | Latest | Secret storage |
| **Multi-Sig Wallet** | Safe (Gnosis Safe) | Latest | Treasury management |
| **HSM** | AWS KMS / Cloud HSM | - | Key storage |
| **Identity Verification** | ONCHAINID | Latest | KYC/AML enforcement |
| **Compliance** | ERC-3643 T-REX | Latest | Transfer restrictions |

### **3.8 DevOps & Infrastructure Layer**

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Container Orchestration** | Kubernetes | 1.34-1.35 | Container management |
| **Infrastructure as Code** | Terraform | Latest | Infrastructure provisioning |
| **CI/CD** | GitHub Actions / GitLab CI | Latest | Automated pipelines |
| **Monitoring** | Prometheus | 3.x | Metrics collection |
| **Visualization** | Grafana | 12.x | Dashboards, alerting |
| **Logging** | ELK Stack / Loki | Latest | Log aggregation |
| **CDN** | CloudFront | Latest | Static asset delivery |
| **Cloud Provider** | AWS / GCP | - | Cloud infrastructure |

---

## **4. Technology Decision Rationale**

### **4.1 Why PostgreSQL (not MySQL/MongoDB)?**

| Criterion | PostgreSQL | MySQL | MongoDB | Winner |
|-----------|------------|-------|---------|--------|
| **ACID Compliance** | ✅ Full | ✅ Full | ⚠️ Limited | PostgreSQL |
| **JSON Support** | ✅ Excellent | ⚠️ Basic | ✅ Excellent | PostgreSQL |
| **Partitioning** | ✅ Native | ⚠️ Limited | ✅ Native | PostgreSQL |
| **Full-Text Search** | ✅ Native | ⚠️ Basic | ✅ Native | PostgreSQL |
| **Regulatory Compliance** | ✅ Excellent | ✅ Good | ⚠️ Limited | PostgreSQL |

**Decision:** PostgreSQL chosen for ACID compliance, advanced features, and regulatory compliance.

---

### **4.2 Why FastAPI (not Django/Flask)?**

| Criterion | FastAPI | Django | Flask | Winner |
|-----------|---------|--------|-------|--------|
| **Performance** | ✅ Excellent (async) | ⚠️ Good | ⚠️ Good | FastAPI |
| **Auto Documentation** | ✅ OpenAPI auto-gen | ⚠️ Manual | ⚠️ Manual | FastAPI |
| **Type Safety** | ✅ Pydantic v2 | ⚠️ Optional | ⚠️ Optional | FastAPI |
| **Learning Curve** | ✅ Low | ⚠️ Medium | ✅ Low | FastAPI |
| **Async Support** | ✅ Native | ⚠️ Added later | ⚠️ Added later | FastAPI |

**Decision:** FastAPI chosen for performance, auto-documentation, and type safety.

---

### **4.3 Why React (not Vue/Angular)?**

| Criterion | React | Vue | Angular | Winner |
|-----------|-------|-----|---------|--------|
| **Ecosystem** | ✅ Largest | ⚠️ Growing | ✅ Large | React |
| **Talent Pool** | ✅ Largest | ⚠️ Medium | ✅ Large | React |
| **Web3 Libraries** | ✅ Best (wagmi, ethers) | ⚠️ Limited | ⚠️ Limited | React |
| **Performance** | ✅ Excellent (v19) | ✅ Excellent | ⚠️ Good | React |
| **Flexibility** | ✅ High | ✅ High | ⚠️ Opinionated | React |

**Decision:** React chosen for Web3 ecosystem, talent availability, and performance.

---

### **4.4 Why ERC-3643 (not ERC-20/ERC-721)?**

| Criterion | ERC-3643 | ERC-20 | ERC-721 | Winner |
|-----------|----------|--------|---------|--------|
| **Identity Verification** | ✅ Built-in | ❌ None | ❌ None | ERC-3643 |
| **Transfer Restrictions** | ✅ Built-in | ❌ None | ❌ None | ERC-3643 |
| **Regulatory Compliance** | ✅ Full | ❌ None | ❌ None | ERC-3643 |
| **Audit Trail** | ✅ Identity-linked | ⚠️ Address only | ⚠️ Address only | ERC-3643 |
| **Securities Compliance** | ✅ Full | ❌ None | ❌ None | ERC-3643 |

**Decision:** ERC-3643 chosen for regulatory compliance and identity verification.

---

### **4.5 Why Chainlink (not other oracles)?**

| Criterion | Chainlink | Pyth | API3 | Winner |
|-----------|-----------|------|------|--------|
| **Decentralization** | ✅ High | ⚠️ Medium | ⚠️ Medium | Chainlink |
| **Data Sources** | ✅ Multiple | ⚠️ Limited | ⚠️ Limited | Chainlink |
| **Security Track Record** | ✅ Proven | ⚠️ Newer | ⚠️ Newer | Chainlink |
| **African Coverage** | ✅ Growing | ⚠️ Limited | ⚠️ Limited | Chainlink |
| **Custom Gateway Support** | ✅ Functions | ⚠️ Limited | ⚠️ Limited | Chainlink |

**Decision:** Chainlink chosen for security, decentralization, and custom gateway support.

---

### **4.6 Why Kubernetes (not ECS/Lambda)?**

| Criterion | Kubernetes | ECS | Lambda | Winner |
|-----------|------------|-----|--------|--------|
| **Portability** | ✅ Multi-cloud | ⚠️ AWS-only | ⚠️ AWS-only | Kubernetes |
| **Fine-Grained Control** | ✅ Full | ⚠️ Limited | ❌ None | Kubernetes |
| **Cost at Scale** | ✅ Lower | ⚠️ Medium | ❌ Higher | Kubernetes |
| **Custom Scheduling** | ✅ Full | ⚠️ Limited | ❌ None | Kubernetes |
| **African Data Centers** | ✅ Deployable | ⚠️ Limited regions | ❌ Limited regions | Kubernetes |

**Decision:** Kubernetes chosen for portability, control, and African deployment flexibility.

---

## **5. Version Compatibility Matrix**

### **5.1 Compatible Version Combinations**

| Component | Minimum Version | Recommended | Maximum Tested |
|-----------|-----------------|-------------|----------------|
| **Python** | 3.10 | 3.11 | 3.13 |
| **PostgreSQL** | 15 | 17.x | 18.x |
| **Redis** | 7 | 8.x | 8.x |
| **Kubernetes** | 1.28 | 1.34 | 1.35 |
| **Node.js** | 18 | 20 | 22 |
| **Solidity** | 0.8.20 | 0.8.31+ | 0.8.34+ |

### **5.2 Known Incompatible Combinations**

| Component | Incompatible Version | Issue | Workaround |
|-----------|---------------------|-------|------------|
| **Solidity** | 0.8.28-0.8.33 | IR pipeline bug | Use 0.8.34+ or disable IR |
| **PostgreSQL** | 14.x | EOL November 2026 | Migrate to 17.x+ |
| **Kubernetes** | <1.26 | Ending maintenance | Upgrade to 1.34+ |

---

## **6. Technology Migration Guide**

### **6.1 PostgreSQL 15 → 17/18**

```bash
# Backup existing database
pg_dumpall -U postgres > backup.sql

# Install new version
sudo apt-get install postgresql-17

# Restore
psql -U postgres -f backup.sql

# Verify
psql -U postgres -c "SELECT version();"
```

### **6.2 React 18 → 19**

```bash
# Update package.json
npm install react@19 react-dom@19

# Update TypeScript
npm install typescript@6 --save-dev

# Run migration checks
npx react-codemod@latest
```

### **6.3 Kubernetes 1.28 → 1.34**

```bash
# Update EKS cluster
aws eks update-cluster-version \
  --name ujamaa-cluster \
  --kubernetes-version 1.34

# Update node groups
aws eks update-nodegroup-version \
  --cluster-name ujamaa-cluster \
  --nodegroup-name main-nodes \
  --kubernetes-version 1.34
```

---

## **7. Related Documents**

| Document | Location | Purpose |
|----------|----------|---------|
| **SRS v2.0** | `docs/01_SPECIFICATIONS/01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` | Requirements specification |
| **Architecture Spec** | `docs/01_SPECIFICATIONS/02_ARCHITECTURE_SPECIFICATION.md` | System architecture |
| **Deployment Guide** | `docs/02_TECHNICAL_GUIDES/01_DEPLOYMENT_GUIDE.md` | Deployment procedures |
| **Smart Contract Naming** | `docs/02_TECHNICAL_GUIDES/10_SMART_CONTRACT_NAMING_CONVENTION.md` | Contract naming conventions |

---

## **8. Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | February 27, 2026 | Aziz Da Silva | Initial version |
| 1.1 | March 1, 2026 | Aziz Da Silva | Technology updates |
| 2.0 | March 18, 2026 | System Architect | SRS v2.0 alignment |

---

**Last Updated:** March 18, 2026  
**Maintained By:** System Architect  
**Next Review:** April 18, 2026

---

*UJAMAA DEFI PLATFORM - Technology Stack Reference v2.0*
