# 🎯 Investment Thresholds - Complete Guide

**Date:** April 2, 2026  
**Status:** ✅ CONFIGURED

---

## 📊 Who Handles Thresholds?

### **Answer: Configuration File (`MVP_config.py`)**

All investment thresholds are defined in:
```
backend/config/MVP_config.py
```

**Controlled by:** Platform Administrator / Compliance Officer

---

## 💰 Investment Limits

### **Defined in:** `backend/config/MVP_config.py` (Lines 136-150)

```python
# INVESTMENT LIMITS (Testnet)

MAX_DEPOSIT: int = 1_000_000 * 10 ** 18  # 1M UJEUR
"""Maximum deposit per transaction"""

MIN_DEPOSIT: int = 1_000 * 10 ** 18  # 1K UJEUR
"""Minimum deposit per transaction"""

DAILY_WITHDRAWAL_LIMIT: int = 500_000 * 10 ** 18  # 500K UJEUR
"""Maximum daily withdrawal"""

INSTITUTIONAL_MIN: int = 100_000 * 10 ** 18  # 100K UJEUR
"""Minimum for institutional investors (KYB threshold)"""

RETAIL_MAX: int = 90_000 * 10 ** 18  # 90,000 UJEUR
"""Maximum for retail investors (€90,000 limit)"""
```

---

## 📋 Threshold Summary Table

| Threshold | Amount | Enforced By | Purpose |
|-----------|--------|-------------|---------|
| **MIN_DEPOSIT** | €1,000 | Backend API | Minimum investment amount |
| **MAX_DEPOSIT** | €1,000,000 | Backend API | Maximum per transaction |
| **DAILY_WITHDRAWAL** | €500,000 | Backend API | Daily withdrawal limit |
| **INSTITUTIONAL_MIN** | €100,000 | Backend API | KYB requirement threshold |
| **RETAIL_MAX** | €90,000 | Frontend/Backend | Retail investor cap |
| **KYB_THRESHOLD** | €100,000 | Compliance | Enhanced KYB trigger |
| **TXN_FLAG_LARGE** | €100,000 | Compliance | Auto-flag transaction |
| **TXN_FLAG_VERY_LARGE** | €500,000 | Compliance | High-risk flag |

---

## 🔍 Compliance Thresholds

### **Transaction Monitoring**

**File:** `backend/api/database_api.py` (Lines 1115-1125)

```python
# Auto-flag based on amount
if request.amount > 500000:
    is_flagged = True
    risk_level = "high"
    flag_reason = f"Very large transaction: €{amount} exceeds €500,000 threshold"
    
elif request.amount > 100000:
    is_flagged = True
    risk_level = "medium"
    flag_reason = f"Large transaction: €{amount} exceeds €100,000 threshold"
```

### **KYB Threshold**

**File:** `backend/config/MVP_config.py` (Line 266)

```python
KYB_THRESHOLD_EUR: int = 100_000
"""€100K investment threshold triggers enhanced KYB"""
```

**Enforcement:**
- Investments ≥€100,000 require institutional (KYB) approval
- Retail investors (KYC only) cannot invest ≥€100,000

---

## 🛡️ Fraud Detection Thresholds

### **File:** `backend/services/MVP/fraud_detector.py`

```python
# Structuring Detection
STRUCTURING_THRESHOLD = 3000  # Below CTR threshold
STRUCTURING_TOTAL_THRESHOLD = 10000  # Total structuring amount

# Velocity Detection
VELOCITY_THRESHOLD_PER_HOUR = 10  # Transactions per hour
```

**What it detects:**
- Multiple transactions just below reporting threshold
- Rapid succession of transactions (velocity)
- Total structuring amount exceeds threshold

---

## 📍 Where Thresholds Are Enforced

### **1. Investment Endpoint**

**File:** `backend/api/pools.py` (Lines 460-475)

```python
# Check minimum investment
min_deposit = float(mvp_config.MIN_DEPOSIT) / (10 ** 18)
if request.amount < min_deposit:
    raise HTTPException(
        status_code=400,
        detail=f"Minimum deposit is {format_token_amount(min_deposit)}"
    )

# Check maximum investment
max_deposit = float(mvp_config.MAX_DEPOSIT) / (10 ** 18)
if request.amount > max_deposit:
    raise HTTPException(
        status_code=400,
        detail=f"Maximum deposit is {format_token_amount(max_deposit)}"
    )
```

### **2. Transaction Flagging**

**File:** `backend/api/database_api.py` (Lines 1115-1125)

```python
# Auto-flag large transactions
if amount > 500000:  # €500K
    risk_level = "high"
    is_flagged = True
elif amount > 100000:  # €100K
    risk_level = "medium"
    is_flagged = True
```

### **3. Compliance Check**

**File:** `backend/api/pools.py` (Compliance validation)

```python
# Check if institutional minimum met (for KYB requirement)
if investor.role == "INSTITUTIONAL_INVESTOR":
    if request.amount < INSTITUTIONAL_MIN:
        # Warning: Below institutional minimum
```

---

## 🎛️ How to Change Thresholds

### **Method 1: Edit Config File**

**File:** `backend/config/MVP_config.py`

```python
# Change minimum deposit from €1,000 to €500
MIN_DEPOSIT: int = 500 * 10 ** 18

# Change maximum deposit from €1M to €2M
MAX_DEPOSIT: int = 2_000_000 * 10 ** 18
```

**Then restart backend:**
```bash
# Stop backend (Ctrl+C)
# Restart
cd backend
python main.py
```

### **Method 2: Environment Variables (Production)**

```bash
# .env file
MIN_DEPOSIT=500000000000000000000  # €500 in wei (18 decimals)
MAX_DEPOSIT=2000000000000000000000000  # €2M in wei
```

**Load in config:**
```python
import os
MIN_DEPOSIT = int(os.getenv('MIN_DEPOSIT', 1000 * 10**18))
```

---

## 🧪 Test Thresholds

### **Test 1: Below Minimum**
```
Investment: €500
Expected: ❌ ERROR "Minimum deposit is €1,000"
```

### **Test 2: Above Maximum**
```
Investment: €1,500,000
Expected: ❌ ERROR "Maximum deposit is €1,000,000"
```

### **Test 3: Retail Investor Large Amount**
```
Investor: John Doe (Retail, KYC only)
Investment: €150,000
Expected: ❌ ERROR "Retail investors limited to €90,000"
```

### **Test 4: Transaction Flagging**
```
Investment: €250,000
Expected: ✅ Success + 🚩 Flagged for compliance review
Reason: "Large transaction exceeds €100,000 threshold"
```

---

## 📊 Current Threshold Values

### **Investment Limits**
```
Minimum Deposit:        €1,000
Maximum Deposit:        €1,000,000
Daily Withdrawal:       €500,000
Institutional Minimum:  €100,000
Retail Maximum:         €90,000
```

### **Compliance Flags**
```
Large Transaction:      >€100,000 (Medium Risk)
Very Large Transaction: >€500,000 (High Risk)
KYB Threshold:          €100,000
```

### **Fraud Detection**
```
Structuring Amount:     €3,000 per transaction
Structuring Total:      €10,000 cumulative
Velocity Limit:         10 transactions per hour
```

---

## 🔐 Who Can Change Thresholds?

### **Production Environment:**

1. **Platform Administrator**
   - Can modify `MVP_config.py`
   - Can set environment variables
   - Requires deployment approval

2. **Compliance Officer**
   - Can request threshold changes
   - Reviews flagging thresholds
   - Cannot directly modify code

3. **Smart Contract (Future)**
   - On-chain governance for pool limits
   - DAO voting for major changes
   - Timelock for security

---

## 📝 Summary

**Thresholds are handled by:**
- ✅ **Configuration file** (`MVP_config.py`)
- ✅ **Backend API** (enforcement)
- ✅ **Compliance system** (flagging)
- ✅ **Fraud detector** (monitoring)

**Controlled by:**
- Platform Administrator (code changes)
- Compliance Officer (recommendations)
- Smart Contract (future on-chain governance)

**Current limits:**
- Min: €1,000
- Max: €1,000,000
- Flag: >€100,000
- KYB: ≥€100,000

---

**All thresholds are configurable and enforced at multiple layers!** 🎯
