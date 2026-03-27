# KYC/AML Guide

## Investor Identity Verification & Anti-Money Laundering Compliance

**Author:** Aziz Da Silva - Lead Architect
**Version:** 1.0
**Date:** March 12, 2026
**Classification:** Investor Document
**Document ID:** UJAMAA-KYC-001

---

# Document Control

| Version | Date | Author | Changes | Approved By |
|---------|------|--------|---------|-------------|
| 1.0 | March 12, 2026 | UJAMAA Compliance | Initial Release | Chief Compliance Officer |

---

# Important Notice

**All investors must complete KYC (Know Your Customer) verification before investing in any UJAMAA DEFI PLATFORM offering.** This requirement is mandated by international anti-money laundering (AML) regulations and securities laws in all jurisdictions where we operate.

**Failure to complete KYC verification will result in:**
- Inability to subscribe to token offerings
- Inability to receive or hold ERC-3643 tokens
- Potential freezing of funds pending verification
- Account suspension or termination

---

# Table of Contents

1. [Overview](#1-overview)
2. [KYC Verification Levels](#2-kyc-verification-levels)
3. [Required Documents by Investor Type](#3-required-documents-by-investor-type)
4. [Verification Process](#4-verification-process)
5. [AML Screening](#5-aml-screening)
6. [Ongoing Compliance](#6-ongoing-compliance)
7. [Data Privacy & Protection](#7-data-privacy--protection)
8. [Frequently Asked Questions](#8-frequently-asked-questions)

---

# 1. Overview

## 1.1 Why KYC/AML Verification is Required

UJAMAA DEFI PLATFORM operates as a regulated securities platform. We are legally required to verify the identity of all investors under:

| Regulation | Requirement |
|------------|-------------|
| **FATF Recommendations** | Customer Due Diligence (CDD) for all financial transactions |
| **EU AMLD5/6** | Enhanced due diligence for crypto-asset services |
| **US Bank Secrecy Act** | KYC for securities intermediaries |
| **Nigeria Money Laundering Act** | Customer identification for financial services |
| **Kenya Proceeds of Crime Act** | Due diligence for investment services |
| **South Africa FICA** | Customer verification for financial institutions |
| **Mauritius FIAMLA** | KYC for CIS managers and dealers |

## 1.2 What Information We Collect

| Category | Data Points |
|----------|-------------|
| **Identity** | Full legal name, date of birth, nationality, government ID number |
| **Contact** | Residential address, email, phone number |
| **Financial** | Source of funds, occupation/employer, estimated net worth |
| **Tax** | Tax identification number, tax residency jurisdiction |
| **Investment** | Investment experience, risk tolerance, investment objectives |

## 1.3 How Information is Stored

**GDPR Compliance:** UJAMAA DEFI PLATFORM follows GDPR data protection principles:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA STORAGE ARCHITECTURE                     │
│                                                                  │
│  ON-CHAIN (Blockchain)          OFF-CHAIN (Secure Database)      │
│  ┌─────────────────────────┐    ┌─────────────────────────────┐ │
│  │ • Wallet address        │    │ • Full name                 │ │
│  │ • Identity claim hash   │    │ • ID document copies        │ │
│  │ • Verification status   │    │ • Address proof             │ │
│  │ • KYC level (1-3)       │    │ • Source of funds docs      │ │
│  │ • Jurisdiction code     │    │ • Tax information           │ │
│  │                         │    │ • AML screening results     │ │
│  │ NO PII STORED ON-CHAIN  │    │ ENCRYPTED (AES-256)         │ │
│  └─────────────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Data Retention:**
- Active investors: Duration of relationship + 5 years
- Inactive accounts: 5 years from last activity
- AML records: Minimum 5 years per FATF requirements

---

# 2. KYC Verification Levels

## 2.1 KYC Level 1 — Basic Verification

**Required for:** Browse offerings, view documents (no investment)

| Requirement | Details |
|-------------|---------|
| **Email Verification** | Valid email with confirmation link |
| **Phone Verification** | SMS OTP verification |
| **Basic Identity** | Full name, date of birth, nationality |
| **Wallet Connection** | Connect Web3 wallet (MetaMask, WalletConnect) |

**Processing Time:** Instant (automated)

**Validity:** 12 months

## 2.2 KYC Level 2 — Enhanced Verification

**Required for:** Retail investments up to $50,000 annually

| Requirement | Details |
|-------------|---------|
| **All Level 1 Requirements** | Plus the following: |
| **Government ID** | Valid passport, national ID, or driver's license |
| **Proof of Address** | Utility bill, bank statement (< 3 months old) |
| **Selfie Verification** | Live photo matching ID document |
| **Source of Funds** | Declaration of income source (employment, business, investments) |
| **PEP Screening** | Politically Exposed Person screening |
| **Sanctions Screening** | OFAC, UN, EU sanctions list check |

**Processing Time:** 1–3 business days

**Validity:** 24 months

## 2.3 KYC Level 3 — Institutional/Accredited Verification

**Required for:** Accredited investor status, investments >$50,000, institutional investors

| Requirement | Details |
|-------------|---------|
| **All Level 2 Requirements** | Plus the following: |
| **Accreditation Proof** | Financial statements, tax returns, or advisor letter |
| **Corporate Documents** (entities) | Certificate of incorporation, memorandum & articles, register of directors |
| **UBO Identification** | Ultimate Beneficial Owners (>25% ownership) must complete KYC |
| **Authorized Signatories** | Board resolution, power of attorney for account operators |
| **Enhanced Due Diligence** | Source of wealth documentation, business activity verification |

**Processing Time:** 3–5 business days

**Validity:** 24 months (annual re-certification for accreditation)

---

# 3. Required Documents by Investor Type

## 3.1 Individual Investors — Acceptable ID Documents

| Document Type | Countries Accepted | Requirements |
|---------------|-------------------|--------------|
| **Passport** | All countries | Valid, unexpired; photo page clearly visible |
| **National ID Card** | Nigeria, Kenya, Ghana, South Africa, EU member states | Both sides; valid, unexpired |
| **Driver's License** | US, UK, Canada, Australia, EU | Both sides; valid, unexpired |

**Specific National IDs Accepted:**

| Country | ID Name | Notes |
|---------|---------|-------|
| Nigeria | National Identity Number (NIN) slip + BVN | Must have photo ID |
| Kenya | Huduma Namba / National ID | Both sides required |
| Ghana | Ghana Card | Front and back |
| South Africa | Smart ID Card / Green Book ID | Both sides |
| Côte d'Ivoire | Carte Nationale d'Identité | Valid only |
| Senegal | Carte Nationale d'Identité Biométrique | Valid only |

## 3.2 Proof of Address Documents

**Accepted Documents (must be < 3 months old):**

| Document Type | Requirements |
|---------------|--------------|
| **Utility Bill** | Electricity, water, gas, internet; must show name and address |
| **Bank Statement** | Official bank letterhead; stamped if printed online |
| **Tax Assessment** | Government-issued tax document |
| **Lease Agreement** | Signed rental contract with landlord details |
| **Government Letter** | Official correspondence from government agency |

**Not Accepted:**
- Mobile phone bills
- Handwritten letters
- Documents with white-out or alterations
- PO Box addresses (must be physical address)

## 3.3 Corporate/Entity Investors

| Document | Description |
|----------|-------------|
| **Certificate of Incorporation** | Proof of legal entity existence |
| **Memorandum & Articles of Association** | Constitutional documents |
| **Register of Directors** | Current list of board members |
| **Register of Shareholders** | Ownership structure |
| **Certificate of Good Standing** | < 6 months old |
| **Tax Registration Certificate** | Proof of tax ID registration |
| **Board Resolution** | Authorizing investment and signatories |
| **Power of Attorney** | If applicable for account operators |

**Ultimate Beneficial Owner (UBO) Requirements:**

All individuals with >25% ownership must complete individual KYC:

```
Corporate Structure Example:
┌─────────────────────────────────────────────────────────────┐
│  ABC Investment Fund Ltd.                                   │
│  ├── Shareholder 1: 40% → Full KYC Level 3 required        │
│  ├── Shareholder 2: 35% → Full KYC Level 3 required        │
│  └── Shareholder 3: 25% → Full KYC Level 3 required        │
│                                                              │
│  All directors must also complete KYC Level 2               │
└─────────────────────────────────────────────────────────────┘
```

## 3.4 Accreditation Documentation

### United States (Reg D 506(c))

| Method | Acceptable Documents |
|--------|---------------------|
| **Income Test** | IRS Form W-2 (2 years), tax returns (2 years), employment verification letter |
| **Net Worth Test** | Bank/brokerage statements, real estate appraisal, credit report |
| **Professional Credentials** | Series 7, 65, 82 licenses; attorney/CPA license |
| **Entity Test** | Entity formation documents, investment advisor verification |

### Nigeria

| Category | Requirements |
|----------|--------------|
| **High Net Worth Individual** | Bank statement showing ₦100M+ net worth; or annual income >₦25M |
| **Institutional** | audited financial statements; regulatory license |

### Kenya

| Category | Requirements |
|----------|--------------|
| **Accredited Investor** | Annual income >KES 10M; or net worth >KES 50M |
| **Institutional** | CMA license; audited financials |

### European Union (MiFID II Professional Client)

| Category | Requirements |
|----------|--------------|
| **Per Se Professional** | Authorized entity (bank, insurance, UCITS, pension fund) |
| **Elective Professional** | 2 of 3: (1) €500K+ portfolio, (2) 10+ transactions/quarter, (3) 1 year financial sector experience |

---

# 4. Verification Process

## 4.1 Step-by-Step KYC Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    KYC VERIFICATION FLOW                         │
│                                                                  │
│  STEP 1: CREATE ACCOUNT                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. Enter email address                                   │    │
│  │ 2. Create password (min 12 chars, special chars)         │    │
│  │ 3. Verify email via confirmation link                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  STEP 2: COMPLETE PROFILE                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. Enter personal details (name, DOB, nationality)       │    │
│  │ 2. Enter residential address                             │    │
│  │ 3. Enter tax information (TIN, residency)                │    │
│  │ 4. Connect Web3 wallet (MetaMask, WalletConnect)         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  STEP 3: UPLOAD DOCUMENTS                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. Upload government ID (front & back)                   │    │
│  │ 2. Upload proof of address                               │    │
│  │ 3. Take live selfie (liveness check)                     │    │
│  │ 4. Upload accreditation docs (if applicable)             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  STEP 4: AML SCREENING                                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. Sanctions list check (OFAC, UN, EU)                   │    │
│  │ 2. PEP (Politically Exposed Person) screening            │    │
│  │ 3. Adverse media search                                  │    │
│  │ 4. Watchlist screening                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  STEP 5: VERIFICATION REVIEW                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. Automated document validation (AI-powered)            │    │
│  │ 2. Manual review by compliance team (if needed)          │    │
│  │ 3. Approval/rejection notification via email             │    │
│  │ 4. On-chain identity claim issued (ERC-3643)             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  STEP 6: VERIFICATION COMPLETE                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ✓ KYC Level assigned (1, 2, or 3)                        │    │
│  │ ✓ ERC-3643 identity claim minted to wallet               │    │
│  │ ✓ Eligible to invest per jurisdiction rules              │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## 4.2 Processing Times

| KYC Level | Standard Processing | Expedited (if available) |
|-----------|--------------------|-------------------------|
| **Level 1** | Instant | N/A |
| **Level 2** | 1–3 business days | Same day (+$50 fee) |
| **Level 3** | 3–5 business days | 24 hours (+$200 fee) |

**Peak Periods:** Processing may take longer during:
- Token offering launch periods
- Regulatory deadline rushes
- System maintenance windows

## 4.3 Common Rejection Reasons

| Issue | Resolution |
|-------|------------|
| **Expired ID** | Renew ID and resubmit |
| **Blurry Document** | Retake photo in good lighting; ensure all corners visible |
| **Address Mismatch** | Submit document with exact address matching profile |
| **Name Mismatch** | Provide marriage certificate, deed poll, or legal name change document |
| **Incomplete Upload** | Ensure both sides of ID are uploaded |
| **Selfie Mismatch** | Remove glasses, hats; ensure good lighting |
| **PEP Match** | Provide additional source of wealth documentation |
| **Sanctions Match** | Contact compliance@ujamaa-defi.com for manual review |

---

# 5. AML Screening

## 5.1 Screening Databases

UJAMAA DEFI PLATFORM screens all investors against:

| Database | Provider | Update Frequency |
|----------|----------|------------------|
| **OFAC SDN List** | US Treasury | Daily |
| **UN Consolidated List** | United Nations | Daily |
| **EU Sanctions Map** | European Union | Daily |
| **UK HMT Sanctions** | HM Treasury | Daily |
| **World-Check** | Refinitiv | Real-time |
| **Dow Jones Watchlist** | Dow Jones | Real-time |
| **PEP Database** | Multiple sources | Weekly |
| **Adverse Media** | Multiple sources | Real-time |

## 5.2 Risk Scoring

Each investor is assigned a risk score:

| Risk Level | Score Range | Enhanced Measures |
|------------|-------------|-------------------|
| **Low Risk** | 0–30 | Standard monitoring |
| **Medium Risk** | 31–60 | Enhanced transaction monitoring |
| **High Risk** | 61–100 | Enhanced Due Diligence (EDD) required |

**High Risk Factors:**
- PEP status (current or former)
- High-risk jurisdiction (FATF grey/black list)
- Cash-intensive business
- Complex ownership structures
- Adverse media mentions

## 5.3 Enhanced Due Diligence (EDD)

For high-risk investors, additional requirements apply:

| Requirement | Description |
|-------------|-------------|
| **Senior Management Approval** | CCO or CEO must approve onboarding |
| **Source of Wealth** | Detailed documentation of wealth origin |
| **Enhanced Monitoring** | Transaction monitoring threshold lowered |
| **Annual Re-verification** | KYC must be renewed annually |
| **On-Site Visit** | May require physical meeting (for institutional) |

---

# 6. Ongoing Compliance

## 6.1 Periodic Re-verification

| KYC Level | Re-verification Frequency |
|-----------|---------------------------|
| **Level 1** | 12 months |
| **Level 2** | 24 months |
| **Level 3** | 24 months (accreditation: 12 months) |

**Re-verification Process:**
1. Email notification 30 days before expiry
2. Update profile information
3. Re-upload expired documents
4. Re-certify accreditation (if applicable)
5. Re-screening against AML databases

## 6.2 Event-Driven Re-verification

KYC must be updated immediately upon:

| Event | Action Required |
|-------|-----------------|
| **Change of Name** | Submit legal name change document |
| **Change of Address** | Submit new proof of address |
| **Change of Nationality** | Submit new passport/ID |
| **Change in UBO** (entities) | Submit updated corporate documents |
| **Change in Accreditation** | Re-submit accreditation evidence |
| **Material Change in Source of Funds** | Submit updated financial documentation |

## 6.3 Transaction Monitoring

All investor transactions are monitored for:

| Red Flag | Example |
|----------|---------|
| **Structuring** | Multiple investments just below reporting thresholds |
| **Rapid Movement** | Quick subscription followed by redemption request |
| **Third-Party Payments** | Funds from unrelated third parties |
| **High-Risk Jurisdictions** | Transactions linked to FATF blacklisted countries |
| **Unusual Patterns** | Activity inconsistent with investor profile |

---

# 7. Data Privacy & Protection

## 7.1 GDPR Rights (EU Investors)

| Right | Description |
|-------|-------------|
| **Right to Access** | Request copy of personal data held |
| **Right to Rectification** | Correct inaccurate data |
| **Right to Erasure** | Request deletion (subject to legal retention requirements) |
| **Right to Portability** | Receive data in machine-readable format |
| **Right to Object** | Object to certain processing activities |
| **Right to Restriction** | Request limitation of processing |

**To Exercise Rights:** Contact dpo@ujamaa-defi.com

## 7.2 Data Security Measures

| Measure | Implementation |
|---------|----------------|
| **Encryption at Rest** | AES-256 encryption for all stored data |
| **Encryption in Transit** | TLS 1.3 for all data transmission |
| **Access Controls** | Role-based access; MFA required |
| **Audit Logging** | All data access logged and monitored |
| **Data Minimization** | Only necessary data collected |
| **Pseudonymization** | Wallet addresses pseudonymized where possible |

## 7.3 Data Sharing

**We DO share data with:**

| Recipient | Purpose |
|-----------|---------|
| **KYC Providers** | Identity verification (Smile Identity, YouVerify) |
| **AML Screening Providers** | Sanctions/PEP screening (ComplyAdvantage, Chainalysis) |
| **Regulators** | Regulatory reporting requirements |
| **Auditors** | Annual compliance audits |
| **Legal Advisors** | Legal compliance matters |

**We DO NOT share data with:**
- Third-party marketers
- Data brokers
- Unaffiliated financial institutions
- Government agencies (without legal requirement)

---

# 8. Frequently Asked Questions

## 8.1 General Questions

**Q: How long does KYC verification take?**

A: Level 1 is instant. Level 2 typically takes 1–3 business days. Level 3 takes 3–5 business days.

**Q: Can I invest before KYC is complete?**

A: No. KYC verification is required before any investment can be made.

**Q: What happens if my KYC expires?**

A: You will not be able to make new investments or transfer tokens until re-verification is complete. Existing holdings are not affected.

**Q: Can I update my KYC information?**

A: Yes. Log in to your account and navigate to Settings → KYC Profile to update information.

## 8.2 Document Questions

**Q: My ID is in a language other than English. Is this acceptable?**

A: IDs from official government authorities are accepted in their original language. However, a certified translation may be requested for non-Latin scripts.

**Q: Can I use a digital ID?**

A: Yes, digital IDs from government-verified apps (e.g., Nigeria NIN app, Kenya eCitizen) are accepted if they contain a photo and can be verified.

**Q: My address document is in my spouse's name. Is this acceptable?**

A: Yes, if accompanied by a marriage certificate and a letter from your spouse confirming your residence.

## 8.3 Accreditation Questions

**Q: How often do I need to re-certify my accredited investor status?**

A: Accreditation must be re-certified annually, or whenever your financial situation materially changes.

**Q: Can I invest as both retail and accredited?**

A: Your account is classified at the highest verified level. If accredited, you may invest in both retail and accredited offerings.

**Q: What if my accreditation expires mid-investment?**

A: Existing investments are not affected. However, you cannot make new accredited-only investments until re-certification.

## 8.4 Troubleshooting

**Q: My KYC was rejected. What should I do?**

A: You will receive an email explaining the rejection reason. Address the issue and resubmit. If you believe this is an error, contact support@ujamaa-defi.com.

**Q: I'm a PEP. Can I still invest?**

A: Yes, but Enhanced Due Diligence (EDD) will be required. Contact compliance@ujamaa-defi.com to initiate the EDD process.

**Q: I lost access to my wallet. What happens to my KYC?**

A: KYC is tied to your wallet address. You will need to complete KYC verification for your new wallet address.

---

# Appendix A: Country-Specific Requirements

## Nigeria

| Requirement | Details |
|-------------|---------|
| **Primary ID** | National ID (NIN), International Passport, or Driver's License |
| **Secondary ID** | Voter's Card (PVC), Bank Verification Number (BVN) |
| **Proof of Address** | Utility bill, tenancy agreement, or bank statement |
| **Minimum Investment** | ₦50,000 for retail; ₦10M for accredited |

## Kenya

| Requirement | Details |
|-------------|---------|
| **Primary ID** | National ID or Passport |
| **Secondary ID** | KRA PIN Certificate, Huduma Namba |
| **Proof of Address** | Utility bill, bank statement, or letter from chief |
| **Minimum Investment** | KES 10,000 for retail; KES 10M for accredited |

## South Africa

| Requirement | Details |
|-------------|---------|
| **Primary ID** | Smart ID Card or Green Barcoded ID Book |
| **Secondary ID** | Passport or Driver's License |
| **Proof of Address** | Utility bill, bank statement (< 3 months) |
| **FICA Compliance** | Required per Financial Intelligence Centre Act |
| **Minimum Investment** | ZAR 5,000 for retail; ZAR 5M for accredited |

## Ghana

| Requirement | Details |
|-------------|---------|
| **Primary ID** | Ghana Card (mandatory) |
| **Secondary ID** | Passport or Driver's License |
| **Proof of Address** | Utility bill, bank statement, or landlord letter |
| **Minimum Investment** | GHS 2,000 for retail |

---

# Appendix B: Contact Information

| Department | Contact | Response Time |
|------------|---------|---------------|
| **KYC Support** | kyc@ujamaa-defi.com | 24 hours |
| **Compliance** | compliance@ujamaa-defi.com | 48 hours |
| **Data Protection Officer** | dpo@ujamaa-defi.com | 72 hours |
| **General Support** | support@ujamaa-defi.com | 24 hours |

**Office Hours:** Monday–Friday, 8:00 AM – 6:00 PM WAT (Lagos time)

**Emergency Contact:** For urgent AML/sanctions matters, call +234-XXX-XXX-XXXX

---

**Last Updated:** March 12, 2026  
**Next Review:** June 12, 2026  
**Document Owner:** Chief Compliance Officer

---

*This document is confidential and intended solely for the use of prospective and current investors of UJAMAA DEFI PLATFORM. Distribution to third parties is prohibited without prior written consent.*
