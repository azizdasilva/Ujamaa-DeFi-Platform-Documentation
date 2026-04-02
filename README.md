# Ujamaa DeFi Platform

**Institutional-Grade African Real-World Asset Tokenization**

**Version:** 2.0.0 - ERC-3643 Production Ready
**Last Updated:** April 2, 2026
**Status:** ? Production Ready | 100% Contracts Deployed

---

## ?? Overview

Ujamaa DeFi Platform is an institutional-grade blockchain platform for tokenizing African real-world assets (RWA). Built on **ERC-3643 (T-REX protocol)**, we enable compliant, transparent, and efficient financing for African SMEs through liquidity pools and yield-bearing tokens.

**Mission:** Bridge global institutional capital with African industrial growth through blockchain technology.

**Network:** Polygon Amoy Testnet (Chain ID: 80002)

---

## ?? Key Features

### MVP Institutional Architecture

| Feature | Description | Status |
|---------|-------------|--------|
| **ULP Token** | Yield-bearing ERC-3643 token with identity verification | ? Deployed |
| **ERC-3643 Compliance** | Identity registry + transfer compliance module | ? Deployed |
| **Liquidity Pool Management** | Diversified pools (Industrial, Agriculture, Trade, Renewable, Real Estate) | ? Deployed |
| **Mock Banking** | Testnet bank simulation (swappable for BIIC/MCB production) | ? Deployed |
| **Institutional Dashboard** | Real-time portfolio tracking, yield statements | ? Complete |
| **Identity Registry** | On-chain identity verification for all investors | ? Deployed |
| **Compliance Module** | Transfer validation, jurisdiction checks, investment limits | ? Deployed |

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
| **Last Update** | March 30, 2026 |
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

**Last Updated:** March 30, 2026
**Total Documentation:** 207 HTML files + 123 MD sources
**SRS Version:** v2.1 (MVP Institutional)
**Status:** ?? MVP Development Complete | Production Ready
