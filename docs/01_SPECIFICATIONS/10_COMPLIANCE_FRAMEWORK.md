# Compliance Framework

## UJAMAA DEFI PLATFORM Regulatory Compliance Specification

**Author:** Aziz Da Silva - Lead Architect
**Version:** 1.0
**Date:** February 27, 2026
**Classification:** Regulatory / Legal
**Audience:** Compliance Officers, Legal Counsel, Regulators, Auditors

---

# Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Regulatory Landscape](#2-regulatory-landscape)
3. [ERC-3643 Compliance Enforcement](#3-erc-3643-compliance-enforcement)
4. [KYC/AML Framework](#4-kycaml-framework)
5. [GDPR Data Protection](#5-gdpr-data-protection)
6. [MiCA Compliance](#6-mica-compliance)
7. [SEC/CFTC Considerations](#7-seccftc-considerations)
8. [African Regulatory Alignment](#8-african-regulatory-alignment)
9. [FATF Travel Rule](#9-fatf-travel-rule)
10. [Regulator Audit Trails](#10-regulator-audit-trails)
11. [Compliance Governance](#11-compliance-governance)

---

# 1. Executive Summary

## 1.1 Compliance Mission

UJAMAA DEFI PLATFORM is designed as a **compliance-first** tokenization platform that embeds regulatory requirements at every layer of the architecture. This framework documents how the platform achieves and maintains compliance with:

- **Securities Regulations** (MiCA, SEC, African securities laws)
- **AML/CFT Requirements** (FATF, ESAAMLG, GIABA)
- **Data Protection** (GDPR, African data protection laws)
- **Tax Compliance** (Withholding tax, VAT, cross-border reporting)

## 1.2 Compliance by Design Principles

| Principle | Implementation | Verification |
|-----------|----------------|--------------|
| **Identity Verification** | ONCHAINID with licensed Claim Issuers | On-chain claim verification |
| **Transfer Restrictions** | ERC-3643 smart contract enforcement | Blockchain transaction validation |
| **Investor Limits** | Compliance module rules | Pre-transfer checks |
| **Jurisdiction Controls** | Allow/block lists per asset | Smart contract + off-chain |
| **Audit Trail** | Immutable blockchain + off-chain logs | Regulator portal access |
| **Data Minimization** | PII off-chain, hashes on-chain | Cryptographic erasure |
| **Real-time Monitoring** | Kafka/Flink streaming analytics | Automated alerts |

## 1.3 Regulatory Coverage Matrix

| Regulation | Jurisdiction | Status | Implementation |
|------------|--------------|--------|----------------|
| **MiCA** | European Union | Compliant | ERC-3643, Article 22 reporting |
| **SEC Reg D** | United States | Compliant | 506(b), 506(c) offerings |
| **SEC Reg S** | Offshore (non-US) | Compliant | Non-US investor restrictions |
| **FATF Recommendations** | International | Compliant | Travel Rule, AML screening |
| **GDPR** | EU/EEA | Compliant | Cryptographic erasure, Article 17 |
| **Nigeria ISA 2007** | Nigeria | Compliant | SEC Nigeria registration |
| **Kenya Capital Markets Act** | Kenya | Compliant | CMA licensing |
| **South Africa FAIS Act** | South Africa | Compliant | FSCA compliance |
| **AMF-UEMOA** | West Africa (8 states) | Compliant | Regional authorization |
| **OHADA Uniform Acts** | 17 African states | Compliant | Harmonized corporate law |

---

# 2. Regulatory Landscape

## 2.1 Token Classification

### Security Token Definition

UJAMAA tokens are classified as **security tokens** under the following frameworks:

| Framework | Classification | Rationale |
|-----------|----------------|-----------|
| **US (Howey Test)** | Investment Contract | (1) Investment of money, (2) in common enterprise, (3) with expectation of profit, (4) derived from efforts of others |
| **EU (MiCA)** | Asset-Referenced Token / E-Money Token | Tokens represent claims on underlying real-world assets |
| **Nigeria (SEC Rules)** | Digital Token Offering | Subject to SEC Nigeria Rules on Digital Tokens |
| **Kenya (CMA)** | Security | Capital Markets Act definition |
| **South Africa (FSCA)** | Financial Product | FAIS Act Category II |

### Excluded Classifications

UJAMAA tokens are **NOT**:
- Utility tokens (no consumption utility)
- Payment tokens (not designed as currency)
- Collectibles/NFTs for speculative purposes (ERC-3643 NFTs represent real assets)

## 2.2 Licensing Requirements

| Jurisdiction | License Type | Issuing Authority | Status |
|--------------|--------------|-------------------|--------|
| **EU (MiCA)** | CASP (Crypto-Asset Service Provider) | National Competent Authority | Required |
| **Nigeria** | Digital Token Issuer | SEC Nigeria | Required |
| **Kenya** | Capital Markets Dealer | CMA Kenya | Required |
| **South Africa** | FSP (Financial Services Provider) | FSCA | Required |
| **Ghana** | Capital Markets Intermediary | SEC Ghana | Required |
| **Mauritius** | CIS Manager/Advisor | FSC Mauritius | Required |
| **UEMOA** | Prestataire de Services | AMF-UEMOA | Required (regional) |

## 2.3 Offering Types Supported

### Reg D 506(b) - US Private Placement

| Requirement | Implementation |
|-------------|----------------|
| Max investors | 200 accredited + unlimited accredited |
| General solicitation | Prohibited (platform enforces) |
| Accredited investors only | ONCHAINID accreditation claims |
| Restricted securities | ERC-3643 transfer locks (1 year) |
| Form D filing | Automated generation for originators |

### Reg D 506(c) - US Private Placement with Solicitation

| Requirement | Implementation |
|-------------|----------------|
| All investors accredited | Mandatory verification |
| General solicitation | Permitted |
| Reasonable verification | Third-party verification required |
| Restricted securities | ERC-3643 transfer locks |

### Reg S - Offshore Offering

| Requirement | Implementation |
|-------------|----------------|
| Non-US persons only | Jurisdiction restrictions (no US) |
| Offshore transaction | Platform operates outside US |
| No directed selling efforts | Marketing restrictions enforced |
| Category 1-3 compliance | Holding periods enforced (40 days - 1 year) |

### EU Private Placement

| Requirement | Implementation |
|-------------|----------------|
| Professional clients only | MiFID II classification |
| Eligible counterparties | Institutional investors |
| Retail restrictions | Per-member state rules |
| KID/KIID | Automated generation |

---

# 3. ERC-3643 Compliance Enforcement

## 3.1 On-Chain Compliance Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ERC-3643 COMPLIANCE STACK                               │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                    TOKEN LAYER (ERC-3643)                                ││
│  │  • Transfer validation on every transaction                              ││
│  │  • Identity registry integration                                         ││
│  │  • Compliance module hooks                                               ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                    │                                        │
│  ┌─────────────────────────────────▼────────────────────────────────────────┐│
│  │                    IDENTITY REGISTRY                                     ││
│  │  • Maps wallet addresses → ONCHAINID identities                          ││
│  │  • Verifies claim validity (KYC, accreditation, jurisdiction)            ││
│  │  • Maintains issuer trust registry                                       ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                    │                                        │
│  ┌─────────────────────────────────▼────────────────────────────────────────┐│
│  │                    COMPLIANCE MODULE                                     ││
│  │  • Asset-specific transfer rules                                         ││
│  │  • Investor concentration limits                                         ││
│  │  • Lock-up period enforcement                                            ││
│  │  • Jurisdiction allow/block lists                                        ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                    │                                        │
│  ┌─────────────────────────────────▼────────────────────────────────────────┐│
│  │                    TRUSTED ISSUERS REGISTRY                              ││
│  │  • Licensed KYC providers (Smile Identity, YouVerify)                    ││
│  │  • National ID authorities                                               ││
│  │  • Financial advisors (accreditation verification)                       ││
│  │  • Compliance screening providers                                        ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Transfer Validation Flow

```solidity
/**
 * @notice ERC-3643 transfer validation (simplified)
 */
function _update(
    address from,
    address to,
    uint256 amount
) internal override {
    // Step 1: Verify sender identity exists
    require(
        identityRegistry.isVerified(from),
        "ERC3643: Sender not verified"
    );
    
    // Step 2: Verify recipient identity exists
    require(
        identityRegistry.isVerified(to),
        "ERC3643: Recipient not verified"
    );
    
    // Step 3: Check compliance rules
    (bool canTransfer, string memory reason) = complianceModule.canTransfer(
        from,
        to,
        amount,
        ""
    );
    require(canTransfer, reason);
    
    // Step 4: Execute transfer
    super._update(from, to, amount);
    
    // Step 5: Emit compliance event for audit
    emit TransferWithCompliance(
        from,
        to,
        amount,
        block.timestamp,
        msg.sender
    );
}
```

## 3.3 Compliance Rules per Asset Class

### Real Estate Tokens

| Rule | Value | Rationale |
|------|-------|-----------|
| Max investors | 200 (Reg D) / 500 (Reg A+) | Securities law limits |
| Min investment | $1,000 | Retail accessibility |
| Max investment | $1,000,000 | Concentration risk |
| Lock-up period | 365 days | Liquidity management |
| Accreditation required | No (Reg A+) / Yes (Reg D) | Offering type |
| Allowed jurisdictions | NG, KE, ZA, GH, MU | Approved markets |
| Blocked jurisdictions | US (Reg S), KP, IR, SY, CU | Sanctions |

### Agriculture Tokens

| Rule | Value | Rationale |
|------|-------|-----------|
| Max investors | 500 | Cooperative structure |
| Min investment | $100 | Smallholder inclusion |
| Max investment | $500,000 | Concentration risk |
| Lock-up period | 180 days | Seasonal cycle |
| Accreditation required | No | Retail allowed |
| Allowed jurisdictions | All African + MU | Pan-African focus |

### Trade Finance Tokens

| Rule | Value | Rationale |
|------|-------|-----------|
| Max investors | 100 | Institutional focus |
| Min investment | $5,000 | Sophisticated investors |
| Max investment | $2,000,000 | Invoice value limits |
| Lock-up period | 90 days | Invoice terms |
| Accreditation required | Yes | Complexity |
| Allowed jurisdictions | NG, KE, ZA, GH, MU, AE | Trade corridors |

### Private Equity Tokens

| Rule | Value | Rationale |
|------|-------|-----------|
| Max investors | 99 (Reg D) | Securities law |
| Min investment | $50,000 | Institutional |
| Max investment | $5,000,000 | Fund limits |
| Lock-up period | 730 days | Fund lifecycle |
| Accreditation required | Yes | Reg D |
| Allowed jurisdictions | NG, KE, ZA, MU, UK, EU | Investor base |

## 3.4 Compliance Event Log

All compliance-related events are logged for audit:

```solidity
event IdentityVerified(
    address indexed wallet,
    uint256 indexed identityId,
    address issuer,
    uint256 timestamp
);

event TransferValidated(
    address indexed from,
    address indexed to,
    uint256 amount,
    bool passed,
    string reason,
    uint256 timestamp
);

event ComplianceRuleUpdated(
    bytes32 indexed assetId,
    string ruleType,
    string oldValue,
    string newValue,
    address updater,
    uint256 timestamp
);

event JurisdictionBlocked(
    address indexed wallet,
    string jurisdiction,
    uint256 timestamp
);

event InvestmentLimitExceeded(
    address indexed investor,
    bytes32 indexed assetId,
    uint256 requested,
    uint256 limit,
    uint256 timestamp
);
```

---

# 4. KYC/AML Framework

## 4.1 KYC Verification Process

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KYC VERIFICATION FLOW                                │
│                                                                              │
│  1. User Onboarding                                                          │
│     └─> User creates account on platform                                     │
│     └─> Provides email, phone, basic info                                    │
│                                                                              │
│  2. Document Collection                                                      │
│     └─> Upload government-issued ID (National ID, Passport, Driver's License)│
│     └─> Upload proof of address (utility bill, bank statement < 3 months)    │
│     └─> Take live selfie for liveness detection                              │
│                                                                              │
│  3. Automated Verification (Smile Identity / YouVerify)                       │
│     └─> OCR extraction from ID documents                                     │
│     └─> Document authenticity check (security features, tampering detection) │
│     └─> Facial recognition (selfie vs. ID photo)                             │
│     └─> Liveness detection (prevent spoofing)                                │
│     └─> Database verification (where available)                              │
│                                                                              │
│  4. AML Screening                                                            │
│     └─> Sanctions list check (OFAC, UN, EU, HMT)                             │
│     └─> PEP (Politically Exposed Person) check                               │
│     └─> Adverse media screening                                              │
│     └─> Watchlist check (Interpol, national databases)                       │
│                                                                              │
│  5. Risk Scoring                                                             │
│     └─> Calculate risk score (0-100)                                         │
│     └─> Assign risk level (LOW, MEDIUM, HIGH)                                │
│     └─> Determine enhanced due diligence requirements                        │
│                                                                              │
│  6. Manual Review (if required)                                              │
│     └─> Compliance officer review for MEDIUM/HIGH risk                       │
│     └─> Additional documentation request if needed                           │
│     └─> Senior compliance approval for HIGH risk                             │
│                                                                              │
│  7. ONCHAINID Claim Issuance                                                 │
│     └─> Claim Issuer signs KYC verification claim                            │
│     └─> Claim stored in ONCHAINID contract                                   │
│     └─> Wallet address linked to identity                                    │
│     └─> Claim expiry set (typically 12 months)                               │
│                                                                              │
│  8. Ongoing Monitoring                                                         │
│     └─> Monthly AML re-screening                                             │
│     └─> Transaction monitoring for suspicious patterns                       │
│     └─> Annual KYC refresh                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4.2 KYC Data Fields

| Field | Type | Required | Storage | Retention |
|-------|------|----------|---------|-----------|
| Full Name | String | Yes | Off-chain (encrypted) | 5 years post-exit |
| Date of Birth | Date | Yes | Off-chain (encrypted) | 5 years post-exit |
| Nationality | String | Yes | Off-chain + On-chain hash | 5 years post-exit |
| Tax ID | String | Yes | Off-chain (encrypted) | 5 years post-exit |
| Residential Address | String | Yes | Off-chain (encrypted) | 5 years post-exit |
| ID Document Number | String | Yes | Off-chain (encrypted) | 5 years post-exit |
| ID Document Type | Enum | Yes | Off-chain | 5 years post-exit |
| ID Document Expiry | Date | Yes | Off-chain | 5 years post-exit |
| ID Document Front | Image | Yes | IPFS (encrypted) | 5 years post-exit |
| ID Document Back | Image | Conditional | IPFS (encrypted) | 5 years post-exit |
| Selfie | Image | Yes | IPFS (encrypted) | 5 years post-exit |
| Proof of Address | Image | Yes | IPFS (encrypted) | 5 years post-exit |
| Phone Number | String | Yes | Off-chain (encrypted) | 5 years post-exit |
| Email | String | Yes | Off-chain (encrypted) | 5 years post-exit |
| Wallet Address | Address | Yes | On-chain | Indefinite |
| KYC Status | Enum | Yes | On-chain | Indefinite |
| KYC Expiry | Date | Yes | On-chain | Indefinite |
| Risk Score | Integer | Yes | Off-chain | 5 years post-exit |
| Risk Level | Enum | Yes | Off-chain | 5 years post-exit |
| PEP Status | Boolean | Yes | Off-chain | 5 years post-exit |
| Sanctions Status | Boolean | Yes | Off-chain | 5 years post-exit |

## 4.3 AML Screening Providers

| Provider | Coverage | Integration | Use Case |
|----------|----------|-------------|----------|
| **ComplyAdvantage** | Global | API | Primary screening |
| **Refinitiv World-Check** | Global | API | Secondary screening |
| **Dow Jones Risk Center** | Global | API | Enhanced due diligence |
| **Smile Identity AML** | Africa-focused | API | African PEP/sanctions |
| **YouVerify AML** | Africa-focused | API | Nigerian/KE/GH specific |

## 4.4 Risk Scoring Model

```python
def calculate_risk_score(investor: Investor) -> int:
    """
    Calculate AML risk score (0-100, higher = more risk)
    """
    score = 0
    
    # Jurisdiction risk (0-30)
    jurisdiction_risk = JURISDICTION_RISK.get(investor.nationality, 15)
    score += jurisdiction_risk
    
    # PEP status (0-25)
    if investor.is_pep:
        score += 25
    elif investor.is_pep_associate:
        score += 15
    
    # Occupation risk (0-20)
    occupation_risk = OCCUPATION_RISK.get(investor.occupation, 5)
    score += occupation_risk
    
    # Transaction patterns (0-15)
    if investor.transaction_velocity > THRESHOLD:
        score += 10
    if investor.uses_multiple_wallets:
        score += 5
    
    # Source of funds (0-10)
    if investor.source_of_funds == "UNKNOWN":
        score += 10
    elif investor.source_of_funds == "CASH_INTENSIVE":
        score += 5
    
    return min(score, 100)

# Risk levels
LOW_RISK = 0-25
MEDIUM_RISK = 26-50
HIGH_RISK = 51-75
CRITICAL_RISK = 76-100
```

## 4.5 Enhanced Due Diligence (EDD)

EDD is required for:

| Trigger | Additional Requirements |
|---------|------------------------|
| PEP status | Source of wealth documentation, senior management approval |
| High-risk jurisdiction | Enhanced background check, additional documentation |
| High-risk occupation | Source of funds verification, business documentation |
| Large transactions (>$500K) | Enhanced source of funds, ongoing monitoring |
| Complex ownership structures | Beneficial owner identification, corporate documents |
| Adverse media findings | Investigation report, risk mitigation plan |

## 4.6 Ongoing Monitoring

| Activity | Frequency | Trigger |
|----------|-----------|---------|
| AML re-screening | Monthly | Scheduled |
| Transaction monitoring | Real-time | Every transaction |
| KYC refresh | Annual | KYC expiry |
| Risk score recalculation | Quarterly | Scheduled |
| Sanctions list update | Daily | Provider update |

---

# 5. GDPR Data Protection

## 5.1 Data Classification

| Category | Examples | Legal Basis | Storage |
|----------|----------|-------------|---------|
| **Personal Data** | Name, email, phone, address | Contract performance | Off-chain (encrypted) |
| **Special Category** | Biometric (selfie), political (PEP) | Explicit consent | Off-chain (encrypted) |
| **Financial Data** | Bank details, tax ID, holdings | Contract performance | Off-chain (encrypted) |
| **Transaction Data** | Wallet address, tx hash | Legal obligation | On-chain (immutable) |
| **Identity Claims** | KYC status, accreditation | Legal obligation | On-chain (hash only) |

## 5.2 Cryptographic Erasure Pattern

### Problem
Blockchain data is immutable, but GDPR Article 17 requires the "right to erasure" (right to be forgotten).

### Solution
**Never store PII on-chain.** Store only cryptographic hashes that reference off-chain encrypted data. Erasure = destruction of decryption keys.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CRYPTOGRAPHIC ERASURE ARCHITECTURE                        │
│                                                                              │
│  OFF-CHAIN (Encrypted Storage)        ON-CHAIN (Immutable)                  │
│  ┌─────────────────────────┐          ┌─────────────────────────┐           │
│  │                         │          │                         │           │
│  │  PII Data (Encrypted)   │          │  Claim Hash             │           │
│  │  - Name                 │          │  - SHA256(claim_data)   │           │
│  │  - DOB                  │          │  - No recoverable PII   │           │
│  │  - Address              │          │                         │           │
│  │  - ID documents         │          │  Identity Registry      │           │
│  │                         │          │  - Wallet → Claim Hash  │           │
│  │  Encryption: AES-256    │          │  - Hash only, no PII    │           │
│  │  Key: KMS/HSM managed   │          │                         │           │
│  │                         │          │                         │           │
│  └───────────┬─────────────┘          └─────────────────────────┘           │
│              │                                                               │
│              │  Reference (hash pointer)                                     │
│              └──────────────────────────────────────────────────────────────►│
│                                                                              │
│  ERASURE PROCESS:                                                            │
│  1. User requests erasure (Article 17)                                       │
│  2. Destroy encryption key K in KMS/HSM                                      │
│  3. Encrypted PII becomes unrecoverable                                      │
│  4. On-chain hash remains but references nothing                             │
│  5. Erasure logged for compliance                                            │
│                                                                              │
│  GDPR COMPLIANCE:                                                            │
│  • Data is effectively "erased" (cannot be reconstructed)                    │
│  • On-chain hash is not personal data (no recoverable information)           │
│  • Audit trail preserved for regulatory requirements                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation

```python
import hashlib
from cryptography.fernet import Fernet

class GDPRCompliantStorage:
    def __init__(self, kms: KeyManagementService):
        self.kms = kms
    
    def store_pii(self, investor_id: str, pii_data: dict) -> str:
        """
        Store PII off-chain with encryption, return hash for on-chain storage.
        """
        # Generate data encryption key
        key = self.kms.generate_key()
        cipher = Fernet(key)
        
        # Serialize and encrypt PII
        pii_json = json.dumps(pii_data, sort_keys=True)
        encrypted_pii = cipher.encrypt(pii_json.encode())
        
        # Store encrypted data in secure database
        storage_id = self.database.store({
            'investor_id': investor_id,
            'encrypted_data': encrypted_pii,
            'key_id': key.id,
            'created_at': datetime.utcnow()
        })
        
        # Compute hash for on-chain reference
        claim_data = f"{investor_id}:{pii_json}"
        claim_hash = hashlib.sha256(claim_data.encode()).hexdigest()
        
        # Store hash on-chain (via smart contract)
        self.identity_registry.add_claim_hash(investor_id, claim_hash)
        
        return claim_hash
    
    def retrieve_pii(self, investor_id: str) -> dict:
        """
        Retrieve and decrypt PII (requires valid key).
        """
        record = self.database.get(investor_id)
        key = self.kms.get_key(record['key_id'])
        cipher = Fernet(key)
        
        decrypted = cipher.decrypt(record['encrypted_data'])
        return json.loads(decrypted.decode())
    
    def erase_pii(self, investor_id: str) -> bool:
        """
        Cryptographic erasure: destroy encryption key.
        """
        record = self.database.get(investor_id)
        
        # Destroy encryption key (irreversible)
        self.kms.destroy_key(record['key_id'])
        
        # Mark record as erased (encrypted data is now useless)
        self.database.update(investor_id, {
            'erased_at': datetime.utcnow(),
            'status': 'ERASED'
        })
        
        # Log erasure for audit
        self.audit_log.log('PII_ERASED', investor_id)
        
        return True
```

## 5.3 GDPR Rights Implementation

| Right (Article) | Implementation | Limitations |
|-----------------|----------------|-------------|
| **Access (15)** | API endpoint to export all personal data | On-chain data (hashes) cannot be modified |
| **Rectification (16)** | Update off-chain encrypted data | On-chain hashes updated via new claims |
| **Erasure (17)** | Cryptographic erasure (key destruction) | Blockchain data immutable (hashes remain) |
| **Restriction (18)** | Flag data as restricted, halt processing | Legal obligations may override |
| **Portability (20)** | JSON/CSV export of all data | Standardized format provided |
| **Object (21)** | Opt-out of marketing, profiling | Legal obligations cannot be opted out |
| **Consent Withdrawal** | Revoke consent via dashboard | Past processing remains lawful |

## 5.4 Data Retention Schedule

| Data Type | Retention Period | Legal Basis |
|-----------|------------------|-------------|
| KYC documents | 5 years post-exit | AML regulations |
| Transaction records | 5 years minimum | AML, tax regulations |
| Account data | 5 years post-closure | Contract, legal obligations |
| Audit logs | 10 years | Regulatory requirements |
| Marketing consent | Until withdrawal | Consent-based |
| Analytics (anonymized) | Indefinite | Not personal data |

## 5.5 Data Processing Register

| Processing Activity | Data Categories | Purpose | Legal Basis | Recipients |
|---------------------|-----------------|---------|-------------|------------|
| KYC verification | Personal, biometric | Regulatory compliance | Legal obligation | KYC providers, regulators |
| Transaction processing | Financial, transaction | Contract performance | Contract | Blockchain, payment processors |
| AML screening | Personal, financial | Regulatory compliance | Legal obligation | AML providers, regulators |
| Investor communications | Contact data | Contract performance | Contract | Email providers |
| Analytics | Anonymized transaction | Legitimate interest | Legitimate interest | Internal only |
| Regulatory reporting | All categories | Regulatory compliance | Legal obligation | Regulators |

---

# 6. MiCA Compliance

## 6.1 MiCA Classification

Under Regulation (EU) 2023/1114 (MiCA), UJAMAA tokens are classified as:

| Token Type | MiCA Classification | Requirements |
|------------|---------------------|--------------|
| **ERC-3643 Fungible** | Asset-Referenced Token (ART) | Title II, Articles 36-57 |
| **ERC-3643 NFT** | Not covered by MiCA (unique) | National securities laws apply |

## 6.2 MiCA Article 22 Reporting

**Requirement:** CASPs must publish quarterly reports on reserve assets, transaction volumes, and complaints.

### Automated Report Generation

```python
def generate_mica_article_22_report(quarter: str, year: int) -> dict:
    """
    Generate MiCA Article 22 quarterly report.
    """
    report = {
        'reporting_period': f"Q{quarter} {year}",
        'issuer': 'UJAMAA DEFI PLATFORM Limited',
        'lei_code': '549300XXXXXXXXXXXXXX',
        'contact': 'compliance@ujamaa-defi.com',
        
        # Reserve assets backing tokens
        'reserve_assets': {
            'total_value_eur': get_total_reserves(),
            'composition': [
                {'asset': 'USDC', 'percentage': 60.5},
                {'asset': 'USDT', 'percentage': 25.3},
                {'asset': 'Ondo EUROD (EUROD)', 'percentage': 14.2}
            ],
            'custodian': 'Licensed EU Custodian',
            'audit_firm': 'Big Four Auditor'
        },
        
        # Transaction volumes
        'transaction_volumes': {
            'total_transactions': get_transaction_count(quarter, year),
            'total_volume_eur': get_transaction_volume(quarter, year),
            'average_transaction_eur': get_average_transaction(quarter, year),
            'unique_holders': get_unique_holders(quarter, year)
        },
        
        # Complaints
        'complaints': {
            'total_received': get_complaint_count(quarter, year),
            'resolved': get_resolved_complaints(quarter, year),
            'pending': get_pending_complaints(quarter, year),
            'categories': [
                {'category': 'Technical', 'count': 5},
                {'category': 'Compliance', 'count': 2},
                {'category': 'Commercial', 'count': 3}
            ]
        },
        
        # Own funds
        'own_funds': {
            'capital_eur': get_capital(),
            'requirement_eur': get_capital_requirement(),
            'compliant': True
        }
    }
    
    return report
```

## 6.3 MiCA Operational Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Capital Requirements** | €125,000 minimum own funds maintained |
| **Safeguarding** | Client assets segregated, held with licensed custodians |
| **Complaints Handling** | Formal procedure, 15-day response SLA |
| **Conflict of Interest** | Policy documented, disclosures made |
| **Outsourcing** | Critical functions identified, oversight maintained |
| **Business Continuity** | DR plan tested annually, RTO < 4 hours |
| **Security** | ISO 27001 certification, regular penetration testing |

## 6.4 MiCA Whitepaper Requirements

For public offerings, a crypto-asset whitepaper must include:

1. **Issuer Information** - Legal name, LEI, registered office
2. **Token Details** - ISIN, blockchain, token standard
3. **Rights Attached** - Economic rights, governance rights, redemption
4. **Underlying Assets** - Description, valuation methodology, custody
5. **Technology** - Blockchain, smart contract audits, upgrade mechanism
6. **Risks** - Investment risks, technology risks, regulatory risks
7. **Fees** - All fees charged to investors
8. **Environmental Impact** - Energy consumption of blockchain

---

# 7. SEC/CFTC Considerations

## 7.1 SEC Registration Exemptions

| Exemption | Use Case | Requirements |
|-----------|----------|--------------|
| **Regulation D 506(b)** | Private placement to accredited investors | No general solicitation, 200 max non-accredited |
| **Regulation D 506(c)** | Private placement with solicitation | All investors must be accredited, verified |
| **Regulation A+** | Mini-IPO (up to $75M) | Tier 2 requires audited financials, ongoing reporting |
| **Regulation S** | Offshore (non-US persons) | No US investors, offshore transactions only |
| **Rule 144A** | Qualified Institutional Buyers (QIBs) | $100M+ threshold, institutional only |

## 7.2 CFTC Commodity Pool Considerations

If tokens represent interests in commodity pools (e.g., agricultural commodities):

| Requirement | Threshold | Implementation |
|-------------|-----------|----------------|
| **CPO Registration** | > de minimis trading | File Form 7-R with NFA |
| **AP Registration** | Soliciting investors | File Form 8-R, pass Series 3 exam |
| **Disclosure Document** | Required for all pools | Include risk disclosures, fees, performance |
| **Periodic Reporting** | Monthly/quarterly/annual | Account statements, annual report |
| **Recordkeeping** | 5 years | Trade records, investor communications |

## 7.3 Blue Sky Laws

State-level securities registration may be required:

| State | Exemption | Requirements |
|-------|-----------|--------------|
| **Delaware** | § 703(k) | Issuer notice filing, consent to service |
| **California** | § 25102(n) | Notice filing for Reg D offerings |
| **New York** | § 359-e | Form D filing, fee payment |
| **Florida** | § 517.061 | Notice filing for Reg D |

---

# 8. African Regulatory Alignment

## 8.1 Nigeria

| Regulation | Authority | Requirements |
|------------|-----------|--------------|
| **SEC Rules on Digital Tokens (2022)** | SEC Nigeria | Registration of digital token offerings, issuer disclosure |
| **Investments and Securities Act (2007)** | SEC Nigeria | Securities registration, intermediary licensing |
| **AML/CFT Act (2022)** | NFIU | KYC, transaction monitoring, suspicious transaction reporting |
| **NDPR (2019)** | NDPC | Data protection, consent, data subject rights |

### Nigeria Compliance Checklist
- [ ] Register digital token offering with SEC Nigeria
- [ ] Obtain dealing license for platform operations
- [ ] Implement NFIU-compliant AML/KYC
- [ ] Appoint local compliance officer
- [ ] File quarterly reports with SEC Nigeria

## 8.2 Kenya

| Regulation | Authority | Requirements |
|------------|-----------|--------------|
| **Capital Markets Act** | CMA Kenya | Securities licensing, offering registration |
| **Virtual Asset Service Providers Act (2025)** | CMA Kenya | VASP licensing, AML compliance |
| **Data Protection Act (2019)** | ODPC | GDPR-aligned data protection |

### Kenya Compliance Checklist
- [ ] Obtain VASP license from CMA
- [ ] Register offerings under Capital Markets Act
- [ ] Comply with ODPC data protection requirements
- [ ] File annual returns with CMA

## 8.3 South Africa

| Regulation | Authority | Requirements |
|------------|-----------|--------------|
| **FAIS Act** | FSCA | FSP licensing, fit and proper requirements |
| **Financial Sector Regulation Act** | Prudential Authority | Systemic risk oversight |
| **POPIA** | Information Regulator | Data protection (GDPR-equivalent) |
| **FICA** | FIC | AML/CFT compliance |

### South Africa Compliance Checklist
- [ ] Obtain FSP license (Category II) from FSCA
- [ ] Register as accountable institution under FICA
- [ ] Comply with POPIA data protection
- [ ] Submit compliance reports to FSCA

## 8.4 UEMOA (West African Economic and Monetary Union)

| Regulation | Authority | Requirements |
|------------|-----------|--------------|
| **Règlement AMF-UEMOA n°02/2020** | AMF-UEMOA | Digital asset service provider authorization |
| **Directives BCEAO** | BCEAO | Payment services, e-money |
| **OHADA Uniform Acts** | OHADA | Corporate law harmonization (17 states) |

### UEMOA Member States
Benin, Burkina Faso, Côte d'Ivoire, Guinea-Bissau, Mali, Niger, Senegal, Togo

### UEMOA Compliance Checklist
- [ ] Obtain regional authorization from AMF-UEMOA
- [ ] Comply with BCEAO payment regulations
- [ ] Align with OHADA corporate law requirements
- [ ] File consolidated reports with AMF-UEMOA

## 8.5 Ghana

| Regulation | Authority | Requirements |
|------------|-----------|--------------|
| **Securities Industry Act (2016)** | SEC Ghana | Capital markets licensing |
| **Data Protection Act (2012)** | Data Protection Commission | Data protection compliance |

---

# 9. FATF Travel Rule

## 9.1 Travel Rule Requirements

FATF Recommendation 16 requires VASPs to:

1. **Obtain originator information:**
   - Name
   - Account number (wallet address)
   - Address, national ID, or date/place of birth

2. **Transmit to beneficiary VASP:**
   - Same information for beneficiary
   - For cross-border transfers > USD/EUR 1,000

3. **Retain records:**
   - Minimum 5 years

## 9.2 Travel Rule Implementation

```python
class TravelRuleCompliance:
    def __init__(self, vasps_registry: VASPsRegistry):
        self.vasps = vasps_registry
    
    def prepare_transfer(
        self,
        originator: Investor,
        beneficiary: Investor,
        amount: Decimal,
        asset: str
    ) -> TravelRuleMessage:
        """
        Prepare Travel Rule message for cross-border transfer.
        """
        # Check if transfer is subject to Travel Rule
        if amount < 1000:  # USD threshold
            return None
        
        # Determine if beneficiary VASP is known
        beneficiary_vasp = self.vasps.lookup(beneficiary.wallet_address)
        
        # Build Travel Rule message (IVMS101 format)
        message = {
            'originator': {
                'name': originator.full_name,
                'account': originator.wallet_address,
                'identification': {
                    'type': 'NATIONAL_ID',
                    'number': originator.national_id,
                    'country': originator.nationality
                },
                'address': originator.address
            },
            'beneficiary': {
                'name': beneficiary.full_name,
                'account': beneficiary.wallet_address,
                'identification': {
                    'type': 'NATIONAL_ID',
                    'number': beneficiary.national_id,
                    'country': beneficiary.nationality
                },
                'address': beneficiary.address
            },
            'transfer_info': {
                'amount': str(amount),
                'asset': asset,
                'timestamp': datetime.utcnow().isoformat()
            }
        }
        
        # Send to beneficiary VASP (if known)
        if beneficiary_vasp:
            self.send_to_vasp(beneficiary_vasp, message)
        
        # Store for recordkeeping
        self.record_store.store(message, retention_years=5)
        
        return message
```

## 9.3 Travel Rule Thresholds by Jurisdiction

| Jurisdiction | Threshold | Notes |
|--------------|-----------|-------|
| **FATF Standard** | USD/EUR 1,000 | International standard |
| **EU (TFR)** | EUR 1,000 | All transfers (no threshold for intra-EU) |
| **UK** | GBP 1,000 | Aligned with EU TFR |
| **Nigeria** | USD 1,000 | CBN guidelines |
| **South Africa** | ZAR 25,000 | FIC requirements |

---

# 10. Regulator Audit Trails

## 10.1 Audit Trail Components

| Component | Description | Retention |
|-----------|-------------|-----------|
| **Identity Events** | KYC submissions, approvals, rejections | 5 years |
| **Transfer Events** | All token transfers with compliance checks | Indefinite (on-chain) |
| **Trade Events** | Orders, fills, cancellations | 5 years |
| **Distribution Events** | Dividend payments, redemptions | 5 years |
| **Compliance Events** | AML screenings, alerts, investigations | 5 years |
| **System Events** | Logins, configuration changes, upgrades | 5 years |

## 10.2 Regulator Portal Access

Regulators are provided with dedicated portal access:

| Feature | Description |
|---------|-------------|
| **Real-time Dashboard** | Platform metrics, transaction volumes, investor counts |
| **Search & Query** | Search by investor, asset, transaction, date range |
| **Export Functions** | PDF, CSV, XML exports for offline analysis |
| **Alert Notifications** | Real-time alerts for suspicious activity |
| **Audit Trail Viewer** | Complete audit log with filtering |
| **Report Generator** | Pre-built regulatory reports (MiCA, SEC, local) |

## 10.3 Audit Trail Schema

```sql
-- Audit events table
CREATE TABLE audit_events (
    event_id UUID PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    event_category VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    
    -- Actor information
    actor_id UUID,
    actor_type VARCHAR(50),  -- USER, SYSTEM, ADMIN
    actor_wallet_address BYTEA,
    
    -- Resource information
    resource_type VARCHAR(50),
    resource_id UUID,
    
    -- Event data (JSONB for flexibility)
    event_data JSONB NOT NULL,
    
    -- Compliance metadata
    compliance_status VARCHAR(50),
    risk_score INTEGER,
    
    -- Blockchain reference (if applicable)
    blockchain VARCHAR(20),
    transaction_hash BYTEA,
    block_number BIGINT,
    
    -- System metadata
    ip_address INET,
    user_agent TEXT,
    session_id UUID,
    
    -- Indexes for querying
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partition by month for performance
CREATE TABLE audit_events_2026_02 PARTITION OF audit_events
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- Indexes
CREATE INDEX idx_audit_events_type ON audit_events(event_type);
CREATE INDEX idx_audit_events_timestamp ON audit_events(timestamp);
CREATE INDEX idx_audit_events_actor ON audit_events(actor_id);
CREATE INDEX idx_audit_events_resource ON audit_events(resource_type, resource_id);
CREATE INDEX idx_audit_events_data ON audit_events USING GIN(event_data);
```

---

# 11. Compliance Governance

## 11.1 Compliance Organization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLIANCE GOVERNANCE STRUCTURE                           │
│                                                                              │
│                              Board of Directors                              │
│                                     │                                        │
│                                     ▼                                        │
│                          Compliance Committee                                │
│                         (Board-level oversight)                              │
│                                     │                                        │
│                                     ▼                                        │
│                          Chief Compliance Officer                            │
│                                 (CCO)                                        │
│                                     │                                        │
│              ┌──────────────────────┼──────────────────────┐                │
│              │                      │                      │                │
│              ▼                      ▼                      ▼                │
│     ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐        │
│     │   KYC/AML       │   │   Regulatory    │   │   Data          │        │
│     │   Manager       │   │   Reporting     │   │   Protection    │        │
│     │                 │   │   Manager       │   │   Officer       │        │
│     │  • KYC ops      │   │  • MiCA reports │   │  • GDPR         │        │
│     │  • AML screening│   │  • SEC filings  │   │  • NDPR/POPIA   │        │
│     │  • Investigations│  │  • Local filings│   │  • Data requests│        │
│     └─────────────────┘   └─────────────────┘   └─────────────────┘        │
│                                                                              │
│     ┌─────────────────┐   ┌─────────────────┐                               │
│     │   Smart Contract│   │   Regional      │                               │
│     │   Compliance    │   │   Compliance    │                               │
│     │   Officer       │   │   Officers      │                               │
│     │                 │   │  • Nigeria      │                               │
│     │  • ERC-3643     │   │  • Kenya        │                               │
│     │  • Transfer rules│  │  • South Africa │                               │
│     │  • Upgrade review│  │  • UEMOA        │                               │
│     └─────────────────┘   └─────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 11.2 Compliance Policies

| Policy | Review Frequency | Owner |
|--------|------------------|-------|
| **AML/CFT Policy** | Annual | CCO |
| **KYC Policy** | Annual | KYC/AML Manager |
| **Sanctions Policy** | Annual | KYC/AML Manager |
| **Data Protection Policy** | Annual | DPO |
| **Conflicts of Interest Policy** | Annual | CCO |
| **Whistleblowing Policy** | Annual | CCO |
| **Record Retention Policy** | Annual | Regulatory Reporting |
| **Complaints Handling Policy** | Annual | CCO |
| **Business Continuity Plan** | Annual (test biannual) | COO |

## 11.3 Compliance Training

| Role | Training | Frequency |
|------|----------|-----------|
| **All Employees** | AML/CFT awareness | Annual |
| **All Employees** | Data protection | Annual |
| **Compliance Team** | Advanced AML/CFT | Biannual |
| **Compliance Team** | Regulatory updates | Quarterly |
| **Smart Contract Team** | Compliance by design | Per project |
| **Customer-Facing** | Sanctions screening | Annual |
| **Senior Management** | Regulatory obligations | Annual |

## 11.4 Compliance Metrics (KPIs)

| Metric | Target | Measurement |
|--------|--------|-------------|
| KYC approval rate | > 90% | Approved / Submitted |
| Average KYC processing time | < 48 hours | Submission to approval |
| AML alert resolution time | < 24 hours | Alert to resolution |
| False positive rate (AML) | < 5% | False alerts / Total alerts |
| Regulatory filing timeliness | 100% on-time | On-time / Total filings |
| Data subject request SLA | < 30 days | GDPR Article 12 |
| Compliance training completion | 100% | Completed / Required |
| Audit findings remediation | < 90 days | Finding to closure |

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-27 | Chief Compliance Officer | Initial release |

**Related Documents**

- `01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` - Requirements specification
- `02_ARCHITECTURE_SPECIFICATION.md` - System architecture
- `05_SMART_CONTRACT_SPECIFICATION.md` - ERC-3643 compliance enforcement
- `06_API_SPECIFICATION.md` - Compliance service APIs
- `06_DEPLOYMENT_GUIDE.md` - Compliance infrastructure
- `07_MONITORING_SPECIFICATION.md` - Compliance monitoring and alerts
- `08_OPERATIONAL_RUNBOOKS.md` - Compliance incident response

**Approvals**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Chief Compliance Officer | | | |
| General Counsel | | | |
| Chief Executive Officer | | | |
| Board Compliance Committee Chair | | | |


