# Compliance Framework - SRS v2.1 Updates

**Date:** March 25, 2026  
**Source:** SRS v2.1 Section 1.2 (Institutional Features), Section 10 (Compliance Requirements)  
**Target:** `docs/01_SPECIFICATIONS/10_COMPLIANCE_FRAMEWORK.md`  

---

## Summary

This document provides the complete updates needed for the Compliance Framework to align with SRS v2.1. These updates should be merged into the existing Compliance Framework document.

---

## 1. New Section: KYB Requirements 🆕

### 1.1 Know Your Business (KYB) Specification

**KYB Trigger Threshold:** €100,000 (regulatory requirement)

**When KYB is Required:**
- Institutional investment ≥€100,000
- Enterprise partner onboarding
- Pool Manager role assignment
- Any transaction exceeding €100,000 cumulative (30-day rolling window)

**KYB Documentation Requirements:**

| Document Type | Description | Validity |
|---------------|-------------|----------|
| **Certificate of Incorporation** | Official registration document | Unlimited |
| **Memorandum & Articles of Association** | Corporate governance documents | Unlimited |
| **Register of Directors** | Current board members | Updated annually |
| **Register of Shareholders** | All shareholders with >25% ownership (UBO) | Updated quarterly |
| **Proof of Registered Address** | Utility bill or bank statement (<3 months) | 3 months |
| **Tax Identification Number** | TIN or equivalent | Unlimited |
| **Source of Funds Declaration** | Notarized declaration of fund origin | 12 months |
| **Audited Financial Statements** | Last 2 years (if available) | 24 months |

**UBO (Ultimate Beneficial Owner) Identification:**
- Any natural person owning or controlling >25% of shares/voting rights
- If no individual meets 25% threshold, identify senior managing officials
- UBO verification requires:
  - Government-issued ID (passport, national ID)
  - Proof of address (<3 months)
  - PEP (Politically Exposed Person) screening
  - Sanctions list screening (OFAC, UN, EU)

**KYB Approval Workflow:**

```
Investment Amount          Approval Required
─────────────────────────────────────────────────
€100,000 - €999,999   →   Senior Compliance Officer
≥€1,000,000           →   Compliance Officer + CEO
≥€5,000,000           →   Board Approval
```

**KYB Review Frequency:**
- **Annual Review:** Standard institutional investors
- **Semi-Annual Review:** High-risk jurisdictions, PEP involvement
- **Event-Driven Review:** Change in UBO, adverse media, sanctions listing

### 1.2 Enhanced Due Diligence (EDD)

**EDD Triggers:**
- Investment ≥€1,000,000
- High-risk jurisdiction (FATF grey list)
- PEP (Politically Exposed Person) involvement
- Complex ownership structures (>3 layers)
- Cash-intensive businesses
- Cryptocurrency/nirtual asset businesses

**EDD Additional Requirements:**
- Enhanced source of wealth verification
- Independent verification of business activities
- Site visit (physical or virtual)
- Enhanced ongoing monitoring (quarterly vs annual)
- Senior management approval required

---

## 2. Updated Section: Jurisdiction Controls 🆕

### 2.1 Strictest Jurisdiction List

**Blocked Jurisdictions:** Combined OFAC + UN + EU + FATF High-Risk

**Implementation:**
```python
STRICTEST_JURISDICTION_LIST = {
    # OFAC Sanctioned Countries
    "CU",  # Cuba
    "IR",  # Iran
    "KP",  # North Korea
    "SY",  # Syria
    "UA-43",  # Crimea (region code)
    "UA-14",  # Donetsk (region code)
    "UA-09",  # Luhansk (region code)
    
    # FATF High-Risk Jurisdictions (per public statement)
    "YE",  # Yemen
    "MM",  # Myanmar
    # ... (updated per FATF public statements)
    
    # UN Sanctioned Entities
    # (Dynamic list, updated via UN Security Council resolutions)
    
    # EU Sanctioned Countries
    # (Dynamic list, updated via EU Council decisions)
}

def is_jurisdiction_allowed(country_code: str) -> bool:
    """
    Check if jurisdiction is allowed for platform participation.
    
    Args:
        country_code: ISO 3166-1 alpha-2 country code
        
    Returns:
        bool: True if allowed, False if blocked
    """
    return country_code.upper() not in STRICTEST_JURISDICTION_LIST
```

**Jurisdiction Risk Tiers:**

| Tier | Risk Level | Jurisdictions | Requirements |
|------|------------|---------------|--------------|
| **Tier 1** | Low | EU, US, UK, Canada, Australia, Japan, Singapore | Standard KYC |
| **Tier 2** | Medium | Most emerging markets, OECD countries | Enhanced KYC |
| **Tier 3** | High | FATF grey list, weak AML regimes | EDD + Senior approval |
| **Tier 4** | Prohibited | OFAC/UN/EU sanctions, FATF high-risk | BLOCKED |

**Geographic Restrictions by Product:**

| Product | Restricted Jurisdictions |
|---------|-------------------------|
| **uLP Tokens (Institutional)** | Tier 3 + Tier 4 |
| **UAT Tokens (Retail)** | Tier 4 only |
| **Pool Manager Role** | Tier 1 + Tier 2 only |

---

## 3. New Section: uLP Token Compliance 🆕

### 3.1 Regulatory Classification

**uLP Token Classification:**

| Jurisdiction | Classification | Regulatory Framework |
|--------------|----------------|---------------------|
| **EU (MiCA)** | Asset-Referenced Token (ART) | Article 22 reporting required |
| **US (SEC)** | Investment Contract (Howey Test) | Reg D 506(b) or 506(c) |
| **Mauritius** | CIS (Collective Investment Scheme) | FSC CIS Manager License |
| **Nigeria** | Digital Token (Security) | SEC Nigeria Rules |
| **Kenya** | Security | Capital Markets Act |

**MiCA Compliance (Article 22):**
- Whitepaper requirement (unless exempt)
- Ongoing disclosure obligations
- NAV attestation by approved auditor
- Quarterly reserve composition reports
- Annual audit of pool assets

**SEC Reg D Compliance:**
- 506(b): No general solicitation, accredited investors only
- 506(c): General solicitation permitted, verified accredited investors
- Form D filing within 15 days of first sale
- Blue sky filings (state-level)

### 3.2 Investor Suitability

**uLP Token Investor Requirements:**

| Requirement | Retail | Institutional |
|-------------|--------|---------------|
| **Minimum Investment** | Not applicable (use UAT) | €100,000 |
| **KYC/KYB** | Standard KYC | Enhanced KYB |
| **Accreditation** | Not required | Required (Reg D) |
| **Jurisdiction** | Tier 4 blocked | Tier 3+4 blocked |
| **Lock-up Period** | N/A | 12 months (configurable) |
| **Transfer Restrictions** | ERC-3643 enforced | ERC-3643 enforced |

**Accredited Investor Definition (Reg D):**

Natural person qualifies if:
- Individual net worth >$1M (excluding primary residence), OR
- Individual income >$200K in each of last 2 years ($300K joint), OR
- Professional credentials (Series 7, 65, 82 licenses)

Entity qualifies if:
- Total assets >$5M, OR
- All equity owners are accredited investors

---

## 4. New Section: UJG Token Compliance 🆕

### 4.1 Collateral Token Regulatory Treatment

**UJG Token Classification:**
- **NOT a security** (no investment contract, no expectation of profit)
- **Digital warehouse receipt** representing certified merchandise
- **Non-transferable** by design (except forced transfer)

**Regulatory Rationale:**
- UJG represents physical collateral, not investment
- No yield or profit expectation
- Non-transferable prevents secondary market trading
- Forced transfer only for redemption/liquidation (contractual, not market)

### 4.2 Collateral Management Compliance

**Collateral Requirements:**
- **Existence Verification:** Industrial Gateway certification (SIPI/GDIZ (Benin))
- **Valuation:** Independent appraiser, updated quarterly
- **Insurance:** Collateral must be insured (fire, theft, damage)
- **Storage:** Approved warehouse with regular inspections
- **Lien Perfection:** Security interest filed per local law

**Default & Liquidation:**
- **Default Trigger:** 90 days past due (configurable)
- **Liquidation Process:** Approved auction, transparent bidding
- **Proceeds Distribution:** uLP holders pro-rata
- **Deficiency Handling:** Legal recourse against industrial

**Compliance Documentation:**
- Certificate of Existence (Industrial Gateway)
- Certificate of Valuation (Independent Appraiser)
- Insurance Policy (Licensed Insurer)
- Warehouse Receipt (Approved Facility)
- Security Agreement (Legal Counsel)

---

## 5. Updated Section: Licensing Requirements 🆕

### 5.1 Mauritius FSC CIS Manager License

**License Type:** Category 1 CIS Manager License  
**Issuing Authority:** Financial Services Commission (FSC) Mauritius  
**Status:** Required for Production  

**License Requirements:**
- Minimum share capital: MUR 5,000,000 (~€100,000)
- Fit and proper test for directors/officers
- Compliance officer (resident in Mauritius)
- Physical office in Mauritius
- Professional indemnity insurance
- Audited financial statements (annual)

**Ongoing Obligations:**
- Quarterly regulatory filings
- Annual license fee
- AML/CFT reporting
- Client asset safeguarding (segregated accounts)
- Risk management framework

### 5.2 Additional Licenses by Jurisdiction

| Jurisdiction | License Type | Status |
|--------------|--------------|--------|
| **EU (MiCA)** | CASP (Crypto-Asset Service Provider) | Required |
| **Nigeria** | Digital Token Issuer | Required |
| **Kenya** | Capital Markets Dealer | Required |
| **South Africa** | FSP (Financial Services Provider) | Required |
| **Ghana** | Capital Markets Intermediary | Required |

---

## 6. Updated Section: AML/CFT Framework 🆕

### 6.1 Transaction Monitoring

**Thresholds for Reporting:**

| Transaction Type | Threshold | Report Type |
|-----------------|-----------|-------------|
| **Cash Transaction** | €10,000+ | CTR (Cash Transaction Report) |
| **Wire Transfer** | €1,000+ (cross-border) | Travel Rule |
| **Suspicious Activity** | Any amount | STR (Suspicious Transaction Report) |
| **Structured Transactions** | Pattern <€10,000 | STR (Structuring) |

**Red Flags for uLP Tokens:**
- Rapid deposit/redemption cycles (potential layering)
- Multiple small deposits just below KYB threshold (structuring)
- Redemption to different wallet than deposit (potential money laundering)
- Investment from high-risk jurisdiction without EDD
- Unusual redemption patterns (e.g., immediate redemption after deposit)

### 6.2 Sanctions Screening

**Screening Requirements:**
- **Pre-Transaction:** All investors screened before onboarding
- **Ongoing:** Daily screening of existing investors
- **Event-Driven:** Ad-hoc screening on sanctions list updates

**Screening Lists:**
- OFAC SDN (Specially Designated Nationals)
- UN Security Council Consolidated List
- EU Consolidated List of Sanctions
- World Bank Debarred Entities
- PEP (Politically Exposed Persons) database

**Match Handling:**
1. **True Positive:** Block transaction, file STR, escalate to Compliance Officer
2. **False Positive:** Document rationale, retain evidence
3. **Potential Match:** Enhanced due diligence, escalate for review

---

## 7. Updated Section: GDPR Data Protection 🆕

### 7.1 Data Classification

**PII (Personal Identifiable Information):**
- Name, address, date of birth
- National ID numbers
- Email, phone number
- Wallet addresses (pseudonymized)
- KYC/KYB documentation

**Special Category Data:**
- Political opinions (PEP status)
- Biometric data (ID verification)

### 7.2 Data Processing Lawful Basis

| Processing Activity | Lawful Basis |
|---------------------|--------------|
| KYC/KYB verification | Legal obligation (AML/CFT) |
| Transaction monitoring | Legal obligation (AML/CFT) |
| Regulatory reporting | Legal obligation (securities laws) |
| Service provision | Contract performance |
| Marketing | Consent (opt-in) |

### 7.3 Data Subject Rights

**Rights Implementation:**
- **Right to Access:** Investor portal with downloadable data export
- **Right to Rectification:** Update profile via portal, re-verify if needed
- **Right to Erasure:** Limited by AML retention requirements (5-10 years)
- **Right to Portability:** JSON/CSV export of all data
- **Right to Object:** Opt-out of marketing, not regulatory processing

**Cryptographic Erasure:**
- PII encrypted with AES-256
- Encryption key stored in HSM
- Erasure request → destroy key → data irrecoverable
- On-chain hashes remain but reference unrecoverable data

---

## 8. Updated Section: Regulatory Reporting 🆕

### 8.1 Reporting Schedule

| Report | Frequency | Recipient | Deadline |
|--------|-----------|-----------|----------|
| **MiCA Article 22 Report** | Quarterly | National Competent Authority | 30 days after quarter-end |
| **Form D (SEC)** | One-time + Annual | SEC | 15 days after first sale |
| **AML/CFT Report** | Quarterly | FIU (Financial Intelligence Unit) | 30 days after quarter-end |
| **Suspicious Activity Report** | Event-driven | FIU | Within 24 hours of detection |
| **Large Transaction Report** | Monthly | Central Bank | 15 days after month-end |
| **Audited Financial Statements** | Annual | FSC Mauritius + Investors | 6 months after year-end |

### 8.2 Report Content

**MiCA Article 22 Report:**
- Total pool value (TVL)
- NAV per share
- Asset allocation (by class, geography, industrial)
- Reserve composition
- Risk metrics (diversification ratio, concentration)
- Performance (yield, APR, historical NAV)
- Material events (defaults, liquidations)

**AML/CFT Report:**
- Total transactions by volume/value
- CTRs filed (cash transactions >€10K)
- STRs filed (suspicious activities)
- Sanctions screening results
- High-risk customer count
- Training completion rates

---

## 9. Implementation Checklist

### KYB Implementation

- [ ] KYB workflow engine (approval routing)
- [ ] UBO identification and verification
- [ ] PEP screening integration
- [ ] Sanctions list screening (OFAC, UN, EU)
- [ ] Document management system
- [ ] KYB review scheduling (annual, semi-annual)
- [ ] EDD workflow for high-risk cases

### Jurisdiction Controls

- [ ] Strictest jurisdiction list in database
- [ ] Real-time jurisdiction validation on onboarding
- [ ] Geolocation IP checks (secondary verification)
- [ ] Automated blocking of prohibited jurisdictions
- [ ] Jurisdiction risk tier assignment

### uLP Compliance

- [ ] Accredited investor verification (Reg D)
- [ ] Investment minimum enforcement (€100K)
- [ ] Lock-up period tracking
- [ ] Transfer restriction enforcement (ERC-3643)
- [ ] MiCA Article 22 report generation

### UJG Compliance

- [ ] Industrial Gateway certification validation
- [ ] Collateral valuation tracking
- [ ] Insurance policy expiry monitoring
- [ ] Default trigger detection (90 days past due)
- [ ] Auction process documentation

### AML/CFT

- [ ] Transaction monitoring rules engine
- [ ] Red flag detection algorithms
- [ ] STR generation workflow
- [ ] Sanctions screening integration
- [ ] PEP database integration

### GDPR

- [ ] PII encryption (AES-256)
- [ ] HSM key management
- [ ] Data subject rights portal
- [ ] Cryptographic erasure implementation
- [ ] Data retention policy enforcement

---

## 10. Testing Requirements

### KYB Tests

- [ ] KYB trigger at €100K threshold
- [ ] UBO identification (>25% ownership)
- [ ] PEP screening (positive and negative matches)
- [ ] Sanctions list screening (all lists)
- [ ] Approval workflow (tiered by amount)
- [ ] KYB review scheduling

### Jurisdiction Tests

- [ ] Blocked jurisdiction enforcement
- [ ] Tier assignment (1-4)
- [ ] Geolocation IP verification
- [ ] Product restrictions by jurisdiction

### AML/CFT Tests

- [ ] Transaction threshold detection
- [ ] Structuring detection (pattern recognition)
- [ ] Red flag alerts
- [ ] STR generation
- [ ] Sanctions match handling

---

**Document End**

**Merge Instructions:**
1. Add Section 4.3 (KYB Requirements) after existing KYC section
2. Add Section 2.2 (Strictest Jurisdiction List) to Regulatory Landscape
3. Add Section 6.5 (uLP Token Compliance) to MiCA Compliance
4. Add Section 6.6 (UJG Token Compliance) to MiCA Compliance
5. Update Section 2.2 (Licensing) with Mauritius FSC CIS Manager
6. Add Section 9.5 (Regulatory Reporting) to Regulator Audit Trails
