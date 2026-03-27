# Wallet Setup Guide

## Complete Guide to Setting Up Your Crypto Wallet for UJAMAA DEFI PLATFORM

**Author:** Aziz Da Silva - Lead Architect
**Document ID:** UJAMAA-EDU-003
**Version:** 1.0
**Date:** March 12, 2026

---

# WALLET SETUP GUIDE

**This step-by-step guide will help you set up a secure crypto wallet for investing in tokenized securities on the Ujamaa DeFi Platform.**

---

# TABLE OF CONTENTS

1. [Understanding Crypto Wallets](#1-understanding-crypto-wallets)
2. [Choosing a Wallet](#2-choosing-a-wallet)
3. [Setting Up MetaMask](#3-setting-up-metamask)
4. [Configuring for Polygon](#4-configuring-for-polygon)
5. [Securing Your Wallet](#5-securing-your-wallet)
6. [Funding Your Wallet](#6-funding-your-wallet)
7. [Connecting to UJAMAA DEFI PLATFORM](#7-connecting-to-ujamaa-defi)
8. [Troubleshooting](#8-troubleshooting)

---

# 1. UNDERSTANDING CRYPTO WALLETS

## 1.1 What is a Crypto Wallet?

A crypto wallet is a tool that allows you to:
- **Store** your cryptocurrency and tokens
- **Send** and **receive** digital assets
- **Interact** with blockchain applications (like UJAMAA DEFI PLATFORM)

## 1.2 Key Concepts

| Term | Definition |
|------|------------|
| **Public Key/Address** | Your wallet's "account number" - safe to share |
| **Private Key** | Your wallet's "password" - NEVER share this |
| **Seed Phrase** | 12-24 word backup phrase - protects your wallet |
| **Self-Custody** | You control your keys (vs. exchange custody) |

## 1.3 Wallet Types

| Type | Pros | Cons | Best For |
|------|------|------|----------|
| **Browser Extension** (MetaMask) | Easy to use, free | Connected to internet | Regular users |
| **Mobile Wallet** (Trust, Coinbase) | Convenient, QR support | Phone security risks | Mobile users |
| **Hardware Wallet** (Ledger, Trezor) | Maximum security | Cost ($50-200), less convenient | Large holdings |

---

# 2. CHOOSING A WALLET

## 2.1 Recommended Wallets for UJAMAA DEFI PLATFORM

### For Beginners: MetaMask (Browser Extension)
- **Platform:** Chrome, Firefox, Brave, Edge
- **Cost:** Free
- **Security:** Good (with proper setup)
- **Ease of Use:** Easy

### For Mobile Users: MetaMask Mobile or Trust Wallet
- **Platform:** iOS, Android
- **Cost:** Free
- **Security:** Good
- **Ease of Use:** Very Easy

### For Large Holdings: Ledger or Trezor (Hardware Wallet)
- **Platform:** Hardware device + software
- **Cost:** $50-200
- **Security:** Excellent
- **Ease of Use:** Moderate

## 2.2 Wallet Requirements

Your wallet must support:
- ✓ **Polygon Network** (where UJAMAA tokens are issued)
- ✓ **ERC-3643 Tokens** (our token standard)
- ✓ **WalletConnect** (for mobile connection)

---

# 3. SETTING UP METAMASK

## 3.1 Installation (Desktop)

### Step 1: Download MetaMask
1. Go to **metamask.io** (official website only!)
2. Click "Download"
3. Select your browser (Chrome, Firefox, Brave, Edge)
4. Click "Add to Browser"
5. Confirm installation

**⚠️ WARNING:** Only download from metamask.io. Fake extensions exist!

### Step 2: Create Your Wallet
1. Click "Get Started"
2. Click "Create a New Wallet"
3. Create a strong password (12+ characters, mix of letters, numbers, symbols)
4. Click "Create"

### Step 3: Backup Your Seed Phrase
1. **IMPORTANT:** Click to reveal your Secret Recovery Phrase
2. **Write down all 12 words** in order on paper
3. **Store in a safe place** (fireproof safe, safety deposit box)
4. Click "Next"
5. **Confirm your seed phrase** by selecting words in order
6. Click "Confirm"

**⚠️ CRITICAL SECURITY:**
- NEVER share your seed phrase with anyone
- NEVER store it digitally (no photos, no cloud, no email)
- NEVER enter it on any website except wallet recovery
- UJAMAA DEFI PLATFORM will NEVER ask for your seed phrase

### Step 4: Wallet Created!
Your wallet is now ready. You'll see your wallet address (starting with 0x...).

---

# 4. CONFIGURING FOR POLYGON

## 4.1 Add Polygon Network to MetaMask

### Method 1: One-Click Add (Recommended)
1. Go to **chainlist.org**
2. Connect your wallet
3. Search for "Polygon"
4. Click "Add to MetaMask"
5. Approve the network addition in MetaMask

### Method 2: Manual Addition
1. Open MetaMask
2. Click network dropdown (top of window)
3. Click "Add Network"
4. Enter the following details:

| Field | Value |
|-------|-------|
| **Network Name** | Polygon Mainnet |
| **RPC URL** | https://polygon-rpc.com |
| **Chain ID** | 137 |
| **Currency Symbol** | MATIC |
| **Block Explorer** | https://polygonscan.com |

5. Click "Save"

## 4.2 Verify Configuration

1. Switch to Polygon network in MetaMask
2. You should see "MATIC" as your currency
3. Your balance should show MATIC (may be 0 initially)

---

# 5. SECURING YOUR WALLET

## 5.1 Essential Security Practices

### DO:
✓ Use a strong, unique password  
✓ Write down seed phrase on paper (not digital)  
✓ Store seed phrase in multiple secure locations  
✓ Enable all available security features  
✓ Use hardware wallet for large amounts  
✓ Verify URLs before connecting wallet  
✓ Keep software updated  

### DON'T:
✗ Share your seed phrase with anyone  
✗ Store seed phrase digitally (photos, cloud, email)  
✗ Connect to suspicious websites  
✗ Click on unsolicited links  
✗ Share your screen while wallet is open  
✗ Use public Wi-Fi for transactions  

## 5.2 Additional Security Measures

### Enable MetaMask Security Features:
1. Open MetaMask Settings
2. Go to "Security & Privacy"
3. Enable:
   - Auto-lock timer (5 minutes recommended)
   - Phishing detection
   - Enhanced token detection (optional)

### Consider a Hardware Wallet:
For investments over $10,000, consider:
- **Ledger Nano X/S** (~$60-150)
- **Trezor Model T/One** (~$60-200)

Hardware wallets store keys offline, providing maximum security.

---

# 6. FUNDING YOUR WALLET

## 6.1 Getting MATIC (for Gas Fees)

You'll need MATIC tokens to pay for transaction fees on Polygon.

### Option 1: Buy on Exchange and Transfer
1. Create account on exchange (Binance, Coinbase, Kraken, etc.)
2. Buy MATIC tokens
3. Withdraw to your wallet address on Polygon network
4. Wait for confirmation (~5 minutes)

### Option 2: Buy Directly in MetaMask
1. Click "Buy" in MetaMask
2. Select MATIC
3. Choose payment method
4. Complete purchase (fees apply)

### Option 3: Use a Bridge
1. Go to **wallet.polygon.technology/bridge**
2. Connect your wallet
3. Transfer ETH from Ethereum to Polygon
4. Receive MATIC on Polygon

## 6.2 Getting USDC/USDT (for Investments)

### Option 1: Exchange Transfer
1. Buy USDC or USDT on exchange
2. Withdraw to your wallet on **Polygon network**
3. ⚠️ Make sure to select Polygon network, not Ethereum!

### Option 2: Fiat On-Ramp
1. Use services like MoonPay, Ramp, Transak
2. Buy USDC directly to your wallet
3. Higher fees but convenient

## 6.3 Recommended Amounts

| Purpose | Recommended Amount |
|---------|-------------------|
| **Gas Reserve** | 50-100 MATIC (~$40-80) |
| **Minimum Investment** | Varies by offering (typically $500-$10,000) |

---

# 7. CONNECTING TO UJAMAA DEFI PLATFORM

## 7.1 Connecting Your Wallet

### Step 1: Go to UJAMAA DEFI PLATFORM
1. Navigate to **app.ujamaa-defi.com** (official website)
2. Click "Connect Wallet" (top right)

### Step 2: Select Wallet Type
1. Choose your wallet (MetaMask, WalletConnect, etc.)
2. Follow the prompts

### Step 3: Approve Connection
1. MetaMask popup will appear
2. Review the permissions
3. Click "Connect"

### Step 4: Verify Connection
1. Your wallet address should appear in top right
2. You're now connected!

## 7.2 First Investment

### Step 1: Complete KYC
1. Go to your profile
2. Complete identity verification
3. Wait for approval (1-3 business days)

### Step 2: Browse Offerings
1. Go to "Marketplace" or "Invest"
2. Review available offerings
3. Click on an offering to see details

### Step 3: Subscribe
1. Click "Invest Now"
2. Enter investment amount
3. Review and sign Subscription Agreement
4. Confirm transaction in wallet
5. Wait for confirmation

### Step 4: Receive Tokens
1. After offering closes, tokens are minted
2. Tokens appear in your wallet
3. You can view them in your dashboard

---

# 8. TROUBLESHOOTING

## 8.1 Common Issues

### "Wrong Network" Error
**Solution:** Switch to Polygon network in MetaMask

### Transaction Failed
**Possible causes:**
- Insufficient MATIC for gas
- Slippage too low
- Network congestion

**Solutions:**
- Add more MATIC to wallet
- Increase slippage tolerance
- Wait and retry

### Can't See Tokens in Wallet
**Solution:** Add custom token:
1. Open MetaMask
2. Click "Import Tokens"
3. Enter token contract address (from UJAMAA DEFI PLATFORM)
4. Token should appear

### Wallet Not Connecting
**Solutions:**
- Refresh the page
- Disconnect and reconnect
- Clear browser cache
- Try different browser

## 8.2 Getting Help

| Issue | Contact |
|-------|---------|
| **Technical Support** | support@ujamaa-defi.com |
| **Wallet Issues** | support@metamask.io |
| **Transaction Issues** | polygonscan.com support |

---

# SECURITY CHECKLIST

Before investing, verify:

- [ ] I have written down my seed phrase on paper
- [ ] My seed phrase is stored securely (not digital)
- [ ] I have enabled auto-lock on my wallet
- [ ] I am on the official UJAMAA DEFI PLATFORM website
- [ ] I am connected to Polygon network
- [ ] I have enough MATIC for gas fees
- [ ] I understand that lost keys = lost funds

---

# QUICK REFERENCE

## Important Addresses

| Item | Address/URL |
|------|-------------|
| **MetaMask Official** | metamask.io |
| **UJAMAA DEFI PLATFORM** | app.ujamaa-defi.com |
| **Polygon Bridge** | wallet.polygon.technology/bridge |
| **Polygon Explorer** | polygonscan.com |
| **Chainlist** | chainlist.org |

## Support Contacts

| Service | Contact |
|---------|---------|
| **UJAMAA Support** | support@ujamaa-defi.com |
| **MetaMask Support** | support.metamask.io |
| **Polygon Support** | support.polygon.technology |

---

**Document ID:** UJAMAA-EDU-003  
**Version:** 1.0  
**Last Updated:** March 12, 2026

---

*This guide is for educational purposes. Always verify URLs and never share your private keys or seed phrase.*
