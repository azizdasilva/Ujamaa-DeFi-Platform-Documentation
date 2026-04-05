# Ujamaa DeFi Platform

**Institutional-Grade African Real-World Asset Tokenization**

**Version:** 3.0.0 - Full Blockchain Integration
**Last Updated:** April 5, 2026
**Status:** MVP Testnet | 100% Contracts Deployed & Integrated

---

## ? Overview

Ujamaa DeFi Platform is an institutional-grade blockchain platform for tokenizing African real-world assets (RWA). Built on **ERC-3643 (T-REX protocol)**, we enable compliant, transparent, and efficient financing for African SMEs through liquidity pools and yield-bearing tokens.

**Mission:** Bridge global institutional capital with African industrial growth through blockchain technology.

**Network:** Polygon Amoy Testnet (Chain ID: 80002)

---

## ? Key Features

### Smart Contracts (Deployed on Polygon Amoy)

| Contract | Address | Status | Description |
|----------|---------|--------|-------------|
| **ULPTokenizer** | `0xe69569DCc219c518673318a7a34D56202CF92DE2` | ? Deployed | ERC-3643 yield-bearing pool token (uLP) |
| **GuaranteeTokenizer** | `0x83e20a9516b82f0b1bd0ee57882ef35f9553b469` | ? Deployed | ERC-721 collateral NFT (UGT) |
| **LiquidityPool** | `0x36e27C0b63103863a8a31a6EadEad0a0cDc2cfec` | ? Deployed | Multi-asset pool management |
| **IndustrialGateway** | `0x882071de6689ec1716bd7e162acf50707ac68930` | ? Deployed | Asset certification & UGT minting |
| **IdentityRegistry** | `0xB3fb5AB654FC270d10338A64fDBC1E151c223283` | ? Deployed | ERC-3643 identity verification |
| **Compliance** | `0xb303dFf92f56bFE72eeD3b5F8682E4Cf6260C8F2` | ? Deployed | Transfer compliance module |
| **MockEUROD** | `0x787c5c0365829abf88a3d8404e9488d1e307ed43` | ? Deployed | Testnet EUR stablecoin |
| **JurisdictionCompliance** | `0x4eb4c7f57e62a342ac7f322b87a31a7cd54d453c` | ? Deployed | Sanctions & jurisdiction checks |

### Backend Integration (Complete)

| Feature | Status | Details |
|---------|--------|---------|
| **Invest ? ULPTokenizer.deposit()** | ? Integrated | Real on-chain transactions with Polygonscan verification |
| **Redeem ? ULPTokenizer.redeem()** | ? Integrated | Burn uLP, receive EUROD on-chain |
| **Financing ? LiquidityPool.createFinancing()** | ? Integrated | On-chain financing + UGT minting |
| **Repayment ? LiquidityPool.recordRepayment()** | ? Integrated | On-chain repayment + yield distribution |
| **Compliance (Database-Backed)** | ? Integrated | KYC/KYB, document review, 24h SLA |
| **Blockchain Audit Trail** | ? Complete | All on-chain actions tracked in database |
| **Demo Mode** | ? Available | `DEMO_MODE=True` for testing without blockchain |

### Frontend (Functional)

| Page | Status | Details |
|------|--------|---------|
| **Subscription Form** | ? Functional | Multi-step form with API submission, Polygonscan links |
| **Investor Portfolio** | ? Functional | Real data from database + blockchain |
| **Industrial Financings** | ? Functional | Real API integration, repayment flow |
| **Compliance Dashboard** | ? Functional | KYC review, document management |
| **Pool Marketplace** | ? Ready | Browse pools, initiate investments |

---

## ??? Platform Architecture

```
+-----------------------------------------------------------------+
¦                    UJAMAA DEFI PLATFORM                          ¦
¦                  ERC-3643 Production Ready                       ¦
+-----------------------------------------------------------------¦
¦  Layer 1:  User Interface (React 19 + TypeScript 6.0+)          ¦
¦  Layer 2:  API Gateway (FastAPI + REST)                         ¦
¦  Layer 3:  Oracles (Chainlink + Custom Gateways)                ¦
¦  Layer 4:  Business Logic (Python Backend)                      ¦
¦  Layer 5:  Blockchain (Polygon Amoy Testnet)                    ¦
¦  Layer 6:  Smart Contracts (Solidity 0.8.20 + ERC-3643)         ¦
¦  Layer 7:  Identity (IdentityRegistry + KYC/AML)                ¦
¦  Layer 8:  Compliance (Transfer restrictions, Sanctions)        ¦
¦  Layer 9:  DevOps (Docker + Monitoring)                         ¦
¦  Layer 10: Security (Multi-sig + HSM)                           ¦
¦  Layer 11: Audit (Immutable logs + Merkle proofs)               ¦
¦  Layer 12: Liquidity Pool (ULP Token + NAV calculation)         ¦
+-----------------------------------------------------------------+
```

---

## ?? Investment Opportunity

| Parameter | Detail |
|-----------|--------|
| **Security Type** | ULP Token (Yield-Bearing ERC-3643) |
| **Target Raise** | €50,000,000 |
| **Minimum Investment** | €1,000 (Retail) / €100,000 (Institutional) |
| **Expected Yield** | 10-15% APR |
| **Lock-up Period** | 90-365 days (pool dependent) |
| **Management Fee** | 2.0% per annum |
| **Performance Fee** | 20% (5% hurdle rate) |
| **Compliance** | ERC-3643 (Identity verification required) |
| **Jurisdiction** | Mauritius FSC Compliant |

---

## ? Quick Start

### For Developers

```bash
# 1. Clone the repository
git clone <repository-url>
cd "Ujamaa DeFi Platform"

# 2. Install dependencies
cd backend && pip install -r requirements.txt
cd ../frontend && npm install

# 3. Set up environment
cp backend/.env.example backend/.env
# Edit .env with your configuration

# 4. Run database setup
cd backend && python setup_database.py

# 5. Start development servers
cd backend && python main.py
cd ../frontend && npm run dev
```

### For Investors

**Documentation:** See [`docs/08_INVESTORS_ROOM/`](docs/08_INVESTORS_ROOM/)

**Key Documents:**
- [Executive Summary](docs/08_INVESTORS_ROOM/00_EXECUTIVE_SUMMARY.md)
- [Investor Pitch Deck](docs/08_INVESTORS_ROOM/03_INVESTOR_PITCH_DECK.md)
- [Investment Memorandum](docs/08_INVESTORS_ROOM/04_INVESTMENT_MEMORANDUM.md)
- [White Paper](docs/08_INVESTORS_ROOM/05_WHITE_PAPER.md)

---

## ?? Project Structure

```
Ujamaa DeFi Platform/
??? docs/                           # Complete documentation (MD sources)
?   ??? 01_SPECIFICATIONS/          # SRS v2.1 + technical specs (13 docs)
?   ??? 02_TECHNICAL_GUIDES/        # Implementation guides (17 docs)
?   ??? 03_OPERATIONS/              # Operations & monitoring (16 docs)
?   ??? 04_TEAM_PLAYBOOKS/          # Team workflows (41 docs)
?   ??? 05_AUDITS/                  # Audit reports (13 docs)
?   ??? 06_MVP_EXECUTION/           # MVP specifications (11 docs)
?   ??? 07_PRESENTATION/            # Educational materials (2 docs)
?   ??? 08_INVESTORS_ROOM/          # Investor docs (47 docs)
?   ??? 09_ALGORITHMS/              # Algorithm specs (6 docs)
?   ??? 10_DESIGN/                  # Brand assets (3 docs)
?   ??? 11_FUTURE_ENHANCEMENTS/     # Future roadmap (2 docs)
?   ??? 12_SPRINT_REPORTS/          # Sprint reports (8 docs)
??? documentation/                  # HTML documentation (205 files)
?   ??? index.html                  # Documentation portal
?   ??? assets/                     # CSS, JS, design system
?   ??? [All folders mirror docs/]
??? backend/                        # Python FastAPI backend
?   ??? api/                        # REST API endpoints
?   ??? config/                     # Configuration & models
?   ??? services/                   # Business logic services
?   ??? tests/                      # Backend tests
??? frontend/                       # React 19 + TypeScript frontend
?   ??? src/
?   ?   ??? api/                    # API client layer
?   ?   ??? abis/                   # Contract ABIs
?   ?   ??? config/                 # Frontend config
?   ?   ??? contexts/               # React contexts
?   ?   ??? hooks/                  # Custom hooks
?   ?   ??? MVP/                    # MVP pages & components
?   ??? package.json
??? contracts/                      # Solidity smart contracts
?   ??? ERC3643/                    # ERC-3643 infrastructure
?   ?   ??? IdentityRegistry.sol    # Identity management
?   ?   ??? Compliance.sol          # Transfer compliance
?   ??? MVP/                        # MVP contracts
?       ??? ULPToken.sol            # ERC-3643 token
?       ??? LiquidityPool.sol       # Pool management
?       ??? [More contracts...]
??? script/                         # Deployment scripts
?   ??? DeployMVP.s.sol             # MVP deployment
?   ??? DeployERC3643.s.sol         # ERC-3643 deployment
??? README.md                       # This file
??? 100_PERCENT_DEPLOYMENT_COMPLETE.md  # Deployment report
```
- ? **Rate Limiting & DDoS Protection** (Cloudflare + Nginx)

---

## ?? African Market Focus

### Target Markets

| Region | Focus | Use Cases |
|--------|-------|-----------|
| **West Africa** | Benin, Côte d'Ivoire, Togo | Cotton, cocoa, cashew financing |
| **East Africa** | Kenya, Tanzania | Coffee, tea, horticulture |
| **Southern Africa** | Zambia, Zimbabwe | Copper, tobacco, maize |
| **North Africa** | Egypt, Morocco | Textiles, automotive parts |

### Impact Targets (5 Years)

- ?? **$500M GDP contribution**
- ?? **5,000+ jobs created**
- ?? **200+ SMEs financed**
- ?? **UN SDG alignment** (SDG 1, 5, 8, 9, 10, 13)

---

## ?? Partnerships

### Strategic Partners

| Partner | Role | Status |
|---------|------|--------|
| **GDIZ** (Glo-Djigbé Industrial Zone) | Industrial network, offtake agreements | ? In discussion |
| **BIIC** (Banque Internationale pour l'Industrie et le Commerce) | Banking escrow, fiat on/off ramp | ? Specified |
| **MCB** (Mauritius Commercial Bank) | Banking escrow, fiat on/off ramp | ? Specified |
| **Fireblocks** | Institutional custody | ? Specified |
| **Ondo Finance** | EUROD tokenized Euro fund | ? Integration planned |

---

## ?? Contact & Locations

| Department | Email | Purpose |
|------------|-------|---------|
| **General** | info@ujamaa.io | General inquiries |
| **Investors** | investors@ujamaa.io | Investor relations |
| **Technical** | tech@ujamaa.io | Technical support |
| **Compliance** | compliance@ujamaa.io | Compliance inquiries |

### Headquarters

```
Ujamaa DeFi Platform
Ebène Cybercity
Mauritius
```

### Operating Office

```
Ujamaa DeFi Platform
GLO-DJIGBÉ INDUSTRIAL ZONE (GDIZ)
Block: C/SB
District: Tangbo-Djèvié
Plot: F-1
Benin State
```

---

## ?? Disclaimers

**Testnet Development:**
- MVP is currently in testnet development (not production)
- No real money or assets are handled
- Smart contracts are pending audit
- Regulatory approvals pending (Mauritius FSC)

**Investment Risks:**
- Investment in uLP Tokens involves significant risks
- Potential loss of principal
- Not available to retail investors (<€100K)
- Restricted in sanctioned jurisdictions

**Forward-Looking Statements:**
- Yield projections (10-15% APR) are targets, not guarantees
- AUM targets ($500M in 5 years) are aspirational
- Actual results may differ materially

---

## ?? License

**Copyright © 2026 Ujamaa DeFi Platform. All Rights Reserved.**

This repository contains proprietary technology and confidential information. Access does not grant usage rights.

---

## ?? Repository Status

| Metric | Value |
|--------|-------|
| **Documentation Files** | 207 HTML + 123 MD |
| **Last Update** | April 5, 2026 |
| **SRS Version** | v2.1 (MVP Institutional) |
| **Status** | ?? MVP Development Complete |
| **Design System** | Professional 2026 (Responsive) |
| **Search** | ? Live search (Ctrl+K) |
| **Branding** | ? Consistent (Ujamaa DeFi Platform) |
| **Currency** | ? EUROD (Ondo Finance) |
| **Bank Partner** | ? BIIC (Benin) |
| **Smart Contracts** | ? 9 contracts deployed (Polygon Amoy) |
| **Test Coverage** | ? 93% (367 tests) |
| **Wallet Integration** | ? wagmi v3.6.0 + SIWE |

---

**Last Updated:** April 5, 2026
**Total Documentation:** 207 HTML files + 123 MD sources
**SRS Version:** v2.1 (MVP Institutional)
**Status:** ?? MVP Development Complete | 54 Algorithms Documented
