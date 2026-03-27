# Understanding ERC-3643 Tokens

## Technical Guide for Investors

**Author:** Aziz Da Silva - Lead Architect
**Document ID:** UJAMAA-EDU-002
**Version:** 1.0
**Date:** March 12, 2026

---

# UNDERSTANDING ERC-3643 TOKENS

**This guide provides a technical overview of ERC-3643 tokens for investors who want to understand the underlying technology.**

---

# TABLE OF CONTENTS

1. [Introduction to Token Standards](#1-introduction-to-token-standards)
2. [What Makes ERC-3643 Different](#2-what-makes-erc-3643-different)
3. [Key Components](#3-key-components)
4. [How Transfers Work](#4-how-transfers-work)
5. [Compliance Features](#5-compliance-features)
6. [Security Considerations](#6-security-considerations)
7. [Comparison with Other Standards](#7-comparison-with-other-standards)

---

# 1. INTRODUCTION TO TOKEN STANDARDS

## 1.1 What is a Token Standard?

A **token standard** is a set of rules that defines how a token behaves on a blockchain. It specifies:
- How tokens are created (minted)
- How tokens are transferred
- How balances are tracked
- What events are emitted

## 1.2 Common Token Standards

| Standard | Purpose | Key Feature |
|----------|---------|-------------|
| **ERC-20** | Fungible tokens | Anyone can hold and transfer |
| **ERC-721** | Non-fungible tokens (NFTs) | Unique tokens, one-of-a-kind |
| **ERC-1155** | Multi-token standard | Both fungible and non-fungible |
| **ERC-3643** | Regulated securities | Permissioned transfers with identity verification |

---

# 2. WHAT MAKES ERC-3643 DIFFERENT

## 2.1 Permissioned vs. Permissionless

| Feature | ERC-20 (Permissionless) | ERC-3643 (Permissioned) |
|---------|------------------------|------------------------|
| **Who can hold?** | Anyone with a wallet | Only verified investors |
| **Who can transfer?** | Anyone | Only verified investors |
| **Compliance** | None built-in | Built-in compliance checks |
| **Use Case** | Cryptocurrencies, utilities | Securities, regulated assets |

## 2.2 Key Innovations

1. **Identity Registry:** On-chain verification status
2. **Compliance Module:** Rule enforcement at token level
3. **Transfer Validation:** Every transfer checked before execution
4. **Forced Transfer:** Admin can transfer for regulatory compliance
5. **Pause Mechanism:** Emergency stop functionality

---

# 3. KEY COMPONENTS

## 3.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERC-3643 ECOSYSTEM                             │
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   TOKEN     │───▶│  IDENTITY   │───▶│ COMPLIANCE  │         │
│  │  CONTRACT   │    │  REGISTRY   │    │   MODULE    │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│       │                   │                   │                 │
│       │                   │                   │                 │
│       ▼                   ▼                   ▼                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  Balance    │    │   KYC       │    │   Rules     │         │
│  │  Tracking   │    │  Status     │    │  Engine     │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## 3.2 Identity Registry

The Identity Registry stores:
- **Verification Status:** Is this wallet verified?
- **KYC Level:** What level of verification (1, 2, or 3)?
- **Jurisdiction:** What country is the investor in?
- **Identity ID:** Reference to off-chain KYC data

**Important:** No PII (Personally Identifiable Information) is stored on-chain.

## 3.3 Compliance Module

The Compliance Module enforces:
- **Holding Periods:** Time-based transfer restrictions
- **Jurisdiction Rules:** Geographic restrictions
- **Investment Limits:** Min/max transfer amounts
- **Investor Types:** Accredited/institutional only modes

---

# 4. HOW TRANSFERS WORK

## 4.1 Transfer Process

```solidity
// Simplified ERC-3643 transfer logic
function transfer(address to, uint256 amount) public returns (bool) {
    // Step 1: Check sender is verified
    require(identityRegistry.isVerified(msg.sender), "Sender not verified");
    
    // Step 2: Check recipient is verified
    require(identityRegistry.isVerified(to), "Recipient not verified");
    
    // Step 3: Run compliance checks
    require(complianceModule.canTransfer(msg.sender, to, amount), "Compliance check failed");
    
    // Step 4: Execute transfer
    _transfer(msg.sender, to, amount);
    
    return true;
}
```

## 4.2 Transfer Scenarios

| Scenario | Result |
|----------|--------|
| Verified → Verified, rules met | ✓ Transfer succeeds |
| Unverified → Verified | ✗ Fails: "Sender not verified" |
| Verified → Unverified | ✗ Fails: "Recipient not verified" |
| Verified → Verified, holding period not met | ✗ Fails: "Holding period not met" |
| Verified → Verified, jurisdiction restricted | ✗ Fails: "Jurisdiction restricted" |

---

# 5. COMPLIANCE FEATURES

## 5.1 Built-in Compliance

| Feature | Description |
|---------|-------------|
| **KYC Enforcement** | Only verified wallets can hold tokens |
| **Transfer Restrictions** | Rules enforced at smart contract level |
| **Jurisdiction Controls** | Blocked countries cannot receive tokens |
| **Holding Periods** | Time-based lockups enforced automatically |
| **Investor Caps** | Maximum ownership limits enforced |

## 5.2 Rule Types

| Rule Type | Purpose | Example |
|-----------|---------|---------|
| **JURISDICTION_RESTRICTION** | Block specific countries | No US investors |
| **HOLDING_PERIOD** | Minimum holding time | 12-month lockup |
| **MIN_TRANSFER_AMOUNT** | Minimum transaction size | Min $1,000 transfer |
| **MAX_TRANSFER_AMOUNT** | Maximum transaction size | Max $1M per transfer |
| **ACCREDITED_INVESTOR_ONLY** | Require accreditation | Accredited investors only |
| **INSTITUTIONAL_ONLY** | Require institutional status | Institutions only |

---

# 6. SECURITY CONSIDERATIONS

## 6.1 Smart Contract Security

| Measure | Description |
|---------|-------------|
| **Audits** | Third-party security audits before deployment |
| **Formal Verification** | Mathematical proof of contract correctness |
| **Bug Bounties** | Rewards for finding vulnerabilities |
| **Upgrade Mechanism** | UUPS proxy for secure upgrades |

## 6.2 Access Control

| Role | Permissions |
|------|-------------|
| **DEFAULT_ADMIN** | Full administrative access |
| **MINTER_ROLE** | Can mint new tokens |
| **COMPLIANCE_ADMIN** | Can update compliance rules |
| **PAUSER_ROLE** | Can pause transfers in emergency |

## 6.3 Upgrade Pattern

ERC-3643 tokens use **UUPS (Universal Upgradeable Proxy Standard)**:
- Logic can be upgraded while preserving state
- Requires admin approval
- Timelock for security
- Backwards compatible

---

# 7. COMPARISON WITH OTHER STANDARDS

## 7.1 Feature Comparison

| Feature | ERC-20 | ERC-721 | ERC-3643 |
|---------|--------|---------|----------|
| **Fungibility** | Fungible | Non-fungible | Fungible |
| **Permissioned** | No | No | Yes |
| **Identity Required** | No | No | Yes |
| **Compliance Built-in** | No | No | Yes |
| **Transfer Restrictions** | No | No | Yes |
| **Regulatory Focus** | No | No | Yes |
| **Best For** | Cryptocurrencies | NFTs | Securities |

## 7.2 When to Use ERC-3643

**Use ERC-3643 when:**
- Token represents a security
- Regulatory compliance is required
- Investor verification is needed
- Transfer restrictions are necessary

**Use ERC-20 when:**
- Token is a utility token
- No regulatory restrictions
- Open access is desired

**Use ERC-721 when:**
- Each token is unique
- Representing collectibles or unique assets

---

# GLOSSARY

| Term | Definition |
|------|------------|
| **Smart Contract** | Self-executing code on blockchain |
| **Proxy Pattern** | Upgradeable contract architecture |
| **UUPS** | Universal Upgradeable Proxy Standard |
| **KYC** | Know Your Customer verification |
| **PII** | Personally Identifiable Information |
| **On-chain** | Data stored on blockchain |
| **Off-chain** | Data stored outside blockchain |

---

**Document ID:** UJAMAA-EDU-002  
**Version:** 1.0  
**Last Updated:** March 12, 2026

---

*This educational material is for informational purposes only and does not constitute technical or investment advice.*
