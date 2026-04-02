# 🎯 Quick Start - Authentication

## Fastest Way to Test (30 seconds!)

### Method 1: Demo Accounts (Recommended for First Time)

```
1. Go to: http://localhost:5173
2. Click: "🎯 Try Demo Accounts"
3. Select: Any account (e.g., "Retail Investor")
4. Done! You're logged in ✅
```

**Available Demo Accounts:**
- 🏦 **Institutional Investor** - €10M balance, large investments
- 👤 **Retail Investor** - €50K balance, individual investments  
- 🏭 **Industrial Operator** - Asset tokenization
- ✓ **Compliance Officer** - Document review
- ⚙️ **Admin** - Full platform access
- 👁️ **Regulator** - Read-only oversight

---

### Method 2: Register New Account (1 minute)

```
1. Go to: http://localhost:5173
2. Click: "✨ Create Account"
3. Step 1: Enter email & password
4. Step 2: Select investor type & details
5. Step 3: Accept terms & confirm
6. Done! Auto-logged in ✅
```

---

### Method 3: Login (10 seconds)

```
1. Go to: http://localhost:5173/login
2. Choose: Email or Wallet
3. Enter credentials or connect wallet
4. Click: "Sign In"
5. Done! ✅
```

---

## 🧪 What to Test

### Authentication Flow
```
✓ Register → Auto-login → Dashboard
✓ Login → Dashboard
✓ Demo Account → Dashboard
✓ Logout → Login page
✓ Session persists on refresh
```

### Navigation
```
✓ User avatar shows when logged in
✓ User name in dropdown
✓ User info (email, role) visible
✓ Logout button works
✓ Wallet only visible when logged in
```

### Features by Role

#### Retail Investor
```
✓ View pools
✓ Make investments (€1K-€50K)
✓ Track portfolio
✓ View returns
```

#### Institutional Investor
```
✓ View pools
✓ Make investments (€100K+)
✓ Custom terms
✓ Dedicated support
```

#### Industrial Operator
```
✓ Submit assets
✓ View certificates
✓ Track financings
✓ GDIZ certification
```

#### Compliance Officer
```
✓ Review KYC/KYB documents
✓ 24h deadline tracking
✓ Approve/Reject documents
✓ Transaction monitoring
```

#### Admin
```
✓ User management
✓ Pool management
✓ System settings
✓ All permissions
```

#### Regulator
```
✓ Read-only access
✓ Compliance reports
✓ Audit trails
✓ Export data
```

---

## 🎨 Pages Overview

### Login Page (`/login`)
```
┌─────────────────────────────────┐
│     🏛️ Ujamaa DeFi Logo        │
│     Welcome Back                │
│  [📧 Email] [👛 Wallet] tabs   │
│  Email: [____________]          │
│  Password: [____________]       │
│  [ ] Remember me                │
│  [  Sign In  ]                  │
│  --- or ---                     │
│  [🎯 Try Demo Accounts]         │
│  Don't have account? [Sign Up]  │
└─────────────────────────────────┘
```

### Registration Page (`/register`)
```
┌─────────────────────────────────┐
│     ① ── ② ── ③               │
│   Account  Personal  Review     │
│                                 │
│ Step 1: Account Info           │
│ Email: [____________]           │
│ Password: [____________]        │
│ Confirm: [____________]         │
│ [  Next →  ]                    │
└─────────────────────────────────┘
```

### Demo Accounts Page (`/demo-accounts`)
```
┌─────────────────────────────────┐
│  🎯 Try Demo Accounts           │
│  Instant access, no signup!     │
│                                 │
│ ┌───────────┬───────────┐      │
│ │🏦         │👤         │      │
│ │Institution│Retail     │      │
│ │€10M       │€50K       │      │
│ │[Use This] │[Use This] │      │
│ └───────────┴───────────┘      │
│  (6 accounts total)             │
└─────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### "Can't login"
```
✓ Check console for errors (F12)
✓ Verify backend is running
✓ Clear browser cache
✓ Try demo accounts first
```

### "Page not found"
```
✓ Verify URL is correct
✓ Check frontend is running
✓ Try: http://localhost:5173
```

### "Session lost"
```
✓ Session clears on browser close (by design)
✓ Use "Remember me" for persistence
✓ Check sessionStorage enabled
```

---

## 📱 Mobile Testing

All pages are responsive:
```
✓ Mobile (320px+)
✓ Tablet (768px+)
✓ Desktop (1024px+)
```

---

## ✅ Success Criteria

You'll know it's working when:
- ✅ Can login with demo account
- ✅ User name shows in navigation
- ✅ Can logout successfully
- ✅ Session persists on refresh
- ✅ Can access role-specific dashboard
- ✅ Wallet button only shows when logged in

---

## 🚀 Quick Commands

### Start Everything
```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
python init_db.py
python main.py

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### Test Build
```bash
cd frontend
npm run build
# Should show: ✓ built in X.XXs
```

---

## 📞 Need Help?

1. Check `AUTHENTICATION_GUIDE.md` for detailed docs
2. Check `COMPLETE_SUMMARY.md` for all features
3. Check browser console for errors
4. Try different demo account

---

**🎉 Everything is working! Enjoy testing!**

**Demo Credentials:**
- Email: `retail@ujamaa-defi.com`
- Password: Any (mock auth)
- Or use demo accounts for instant access!
