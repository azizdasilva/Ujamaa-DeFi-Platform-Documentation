# Ujamaa DeFi Platform

**Institutional-Grade African Real-World Asset Tokenization**

**Version:** 3.1.0 - Full Stack Monitoring & Admin
**Last Updated:** April 7, 2026
**Status:** MVP Testnet | 100% Contracts Deployed & Integrated

---

## ?? Overview

Ujamaa DeFi Platform is an institutional-grade blockchain platform for tokenizing African real-world assets (RWA). Built on **ERC-3643 (T-REX protocol)**, we enable compliant, transparent, and efficient financing for African SMEs through liquidity pools and yield-bearing tokens.

**Mission:** Bridge global institutional capital with African industrial growth through blockchain technology.

**Network:** Polygon Amoy Testnet (Chain ID: 80002)

---

## ? Key Features

### Smart Contracts (Deployed on Polygon Amoy)

| Contract | Address | Status | Description |
|----------|---------|--------|-------------|
| **ULPTokenizer** | `0x8F8615bc8ebD885Ee5212d9F3faEC2C9A560C4c8` | ? Deployed | ERC-3643 yield-bearing pool token (uLP) |
| **GuaranteeTokenizer** | `0x7600C0b36F73028f866081823Fa691fF4688CeE0` | ? Deployed | ERC-721 collateral NFT (uGT) |
| **LiquidityPool** | `0x465CCDe6d2B228278eEB5c36606058D03859F67A` | ? Deployed | Multi-asset pool management |
| **IndustrialGateway** | `0xf1119462800d2f038aF0c61D874B52521bF22459` | ? Deployed | Asset certification & uGT minting |
| **IdentityRegistry** | `0x085a788194625e95f8060f9B561f4358aD1b3Ed7` | ? Deployed | ERC-3643 identity verification |
| **Compliance** | `0x11a4c694e07e14F5231cf4Db0b483B65018b2583` | ? Deployed | Transfer compliance module |
| **MockEUROD** | `0xAf5904C33723026a5D79a1879A8455047916bd1B` | ? Deployed | Testnet EUR stablecoin |
| **JurisdictionCompliance** | `0xB4885b421Bef3112eD15e625581bA03CA0419e4e` | ? Deployed | Sanctions & jurisdiction checks |
| **MockEscrow** | Deployed | ? | Testnet escrow simulation |
| **MockFiatRamp** | Deployed | ? | Testnet fiat on/off ramp |
| **NavGateway** | Deployed | ? | NAV per share computation |

### Backend Integration (Complete)

| Feature | Status | Details |
|---------|--------|---------|
| **Invest ? ULPTokenizer.deposit()** | ? Integrated | Real on-chain transactions with Polygonscan verification |
| **Redeem ? ULPTokenizer.redeem()** | ? Integrated | Burn uLP, receive EUROD on-chain |
| **Financing ? LiquidityPool.createFinancing()** | ? Integrated | On-chain financing + uGT minting |
| **Repayment ? LiquidityPool.recordRepayment()** | ? Integrated | On-chain repayment + yield distribution |
| **Compliance (Database-Backed)** | ? Integrated | KYC/KYB, document review, configurable SLA |
| **Blockchain Audit Trail** | ? Complete | All on-chain actions tracked in database |
| **Demo Mode** | ? Available | `DEMO_MODE=True` for testing without blockchain |

### Frontend (Functional)

| Page | Access | Details |
|------|--------|---------|
| **Subscription Form** | Investors | Multi-step form with API submission, Polygonscan links |
| **Investor Portfolio** | Investors | Real data from database + blockchain |
| **Investor Returns** | Investors | Real yield data, per-pool breakdown, upcoming distributions |
| **Industrial Financings** | Operators | Real API integration, repayment flow |
| **Compliance Dashboard** | Compliance Officers | KYC review, document management |
| **Pool Marketplace** | Investors | Browse pools, initiate investments |
| **Pool Management** | Admin | Configure pools, adjust NAV per share, APY |
| **User Management** | Admin | Full CRUD: create, edit, delete users, reset passwords |
| **KYC/KYB Monitoring** | Admin + Compliance | Per-period stats (daily/weekly/monthly/yearly), officer performance tracking |
| **Compliance Monitoring** | Admin + Compliance | SLA metrics, overdue documents, officer leaderboard, trends |
| **KYC Settings** | Admin | Configure review deadlines, view change history |
| **Contract Management** | Admin | Dynamic contract registry with add/edit/delete |
| **Bank Accounts** | Admin | Investor bank account management |
| **Threshold Management** | Admin | Pool threshold configuration |
| **Settings** | Admin | Platform-wide configuration |
| **UGT Collateral** | Operators + Admin | NFT collateral monitoring |
| **uLP Monitoring** | Investors + Admin | Liquidity pool token holdings |

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

## ?? Quick Start

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

**Documentation:** See [`documentation/08_INVESTORS_ROOM/`](documentation/08_INVESTORS_ROOM/)

**Key Documents:**
- [Executive Summary](documentation/08_INVESTORS_ROOM/00_EXECUTIVE_SUMMARY.html)
- [Investor Pitch Deck](documentation/08_INVESTORS_ROOM/03_INVESTOR_PITCH_DECK.html)
- [Investment Memorandum](documentation/08_INVESTORS_ROOM/04_INVESTMENT_MEMORANDUM.html)
- [White Paper](documentation/08_INVESTORS_ROOM/05_WHITE_PAPER.html)

---

## ?? Project Structure

```
Ujamaa DeFi Platform/
??? documentation/                  # HTML documentation (222 files)
?   ??? index.html                  # Documentation portal
?   ??? assets/                     # CSS, JS, design system
?   ??? 01_SPECIFICATIONS/          # SRS v2.1 + technical specs (16 docs)
?   ??? 02_TECHNICAL_GUIDES/        # Implementation guides (28 docs)
?   ??? 03_OPERATIONS/              # Operations & monitoring (20 docs)
?   ??? 04_TEAM_PLAYBOOKS/          # Team workflows (42 docs)
?   ??? 05_AUDITS/                  # Audit reports (14 docs)
?   ??? 06_MVP_EXECUTION/           # MVP specifications (12 docs)
?   ??? 07_PRESENTATION/            # Educational materials (3 docs)
?   ??? 08_INVESTORS_ROOM/          # Investor docs (14 + subfolders)
?   ??? 09_ALGORITHMS/              # Algorithm specs (7 docs)
?   ??? 10_DESIGN/                  # Brand assets (3 docs)
?   ??? 11_FUTURE_ENHANCEMENTS/     # Future roadmap (5 docs)
?   ??? 12_SPRINT_REPORTS/          # Sprint reports (9 docs)
??? backend/                        # Python FastAPI backend
?   ??? api/                        # REST API endpoints
?   ?   ??? admin.py                # User & system management
?   ?   ??? compliance.py           # KYC/KYB compliance
?   ?   ??? compliance_documents.py # Document review
?   ?   ??? database_api.py         # Database CRUD
?   ?   ??? monitoring.py           # SLA & officer monitoring
?   ?   ??? pools.py                # Pool & yield management
?   ?   ??? ulp_monitoring.py       # uLP token monitoring
?   ??? config/                     # Configuration & models
?   ??? services/                   # Business logic services
?   ??? migrations/                 # Database migrations
??? frontend/                       # React 19 + TypeScript frontend
?   ??? src/
?   ?   ??? api/                    # API client layer
?   ?   ??? abis/                   # Contract ABIs
?   ?   ??? config/                 # Frontend config
?   ?   ??? contexts/               # React contexts
?   ?   ??? hooks/                  # Custom hooks
?   ?   ??? MVP/                    # MVP pages & components
?   ?   ?   ??? pages/
?   ?   ?   ?   ??? admin/          # Admin dashboards & tools
?   ?   ?   ?   ??? compliance/     # Compliance officer pages
?   ?   ?   ?   ??? invest/         # Investment monitoring
?   ?   ?   ?   ??? investor/       # Investor pages
?   ?   ?   ?   ??? operator/       # Industrial operator pages
?   ?   ?   ?   ??? pool/           # Pool dashboards
?   ?   ?   ??? components/         # Shared components
?   ??? package.json
??? contracts/                      # Solidity smart contracts
?   ??? ERC3643/                    # ERC-3643 infrastructure
?   ??? MVP/                        # MVP contracts (11 contracts)
?       ??? ULPTokenizer.sol        # ERC-3643 token
?       ??? LiquidityPool.sol       # Pool management
?       ??? GuaranteeTokenizer.sol  # uGT NFTs
?       ??? IndustrialGateway.sol   # Asset certification
?       ??? ...
??? script/                         # Deployment scripts
?   ??? DeployMVP.s.sol             # MVP deployment
?   ??? DeployERC3643.s.sol         # ERC-3643 deployment
??? README.md                       # This file
```

---

## ?? Security

- ? **Role-Based Access Control** (ADMIN, COMPLIANCE_OFFICER, REGULATOR, INVESTOR, OPERATOR)
- ? **ERC-3643 Identity Verification** (On-chain KYC/AML)
- ? **Transfer Compliance** (Pre/post-transfer checks)
- ? **Audit Trail** (Database-logged compliance activities)
- ? **Smart Contract Verification** (Polygonscan verified)
- ? **Database Authentication** (PostgreSQL with SSL)
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
| **GDIZ** (Glo-Djigbé Industrial Zone) | Industrial network, offtake agreements | ?? In discussion |
| **BIIC** (Banque Internationale pour l'Industrie et le Commerce) | Banking escrow, fiat on/off ramp | ?? Specified |
| **MCB** (Mauritius Commercial Bank) | Banking escrow, fiat on/off ramp | ?? Specified |
| **Fireblocks** | Institutional custody | ?? Specified |
| **Ondo Finance** | EUROD tokenized Euro fund | ?? Integration planned |

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
| **Documentation Files** | 222 HTML files |
| **Last Update** | April 7, 2026 |
| **SRS Version** | v2.1 (MVP Institutional) |
| **Status** | ? MVP Development Complete |
| **Design System** | Professional 2026 (Responsive) |
| **Search** | ?? Live search (Ctrl+K) |
| **Branding** | ? Consistent (Ujamaa DeFi Platform) |
| **Currency** | ?? EUROD (Ondo Finance) |
| **Bank Partner** | ?? BIIC (Benin) |
| **Smart Contracts** | ? 11 contracts deployed (Polygon Amoy) |
| **Wallet Integration** | ?? wagmi v3.6.0 + SIWE |

---

**Last Updated:** April 7, 2026
**Total Documentation:** 222 HTML files
**SRS Version:** v2.1 (MVP Institutional)
**Status:** ? MVP Development Complete | Monitoring & Admin Fully Operational
