"""
Neon Database Audit Script
Comprehensive data consistency and integrity check
"""

import json
from sqlalchemy import create_engine, text
from datetime import datetime

NEON_URL = 'postgresql://neondb_owner:npg_rcdLBmN3eD2I@ep-flat-violet-adszjxii.c-2.us-east-1.aws.neon.tech/ujamaa?sslmode=require'

engine = create_engine(NEON_URL, echo=False, pool_pre_ping=True)

issues = []
warnings = []
passes = []

def check(name, condition, detail="", severity="issue"):
    if condition:
        passes.append(f"  ✅ {name}")
    else:
        msg = f"  ❌ {name}: {detail}" if detail else f"  ❌ {name}"
        if severity == "warning":
            warnings.append(msg)
        else:
            issues.append(msg)

print("=" * 80)
print("NEON DATABASE COMPREHENSIVE AUDIT")
print(f"Timestamp: {datetime.now().isoformat()}")
print("=" * 80)

# ============================================================
# 1. TABLE ROW COUNTS
# ============================================================
print("\n📊 SECTION 1: TABLE ROW COUNTS")
print("-" * 40)

with engine.connect() as conn:
    tables = [
        'users', 'investor_profiles', 'pools', 'bank_accounts',
        'bank_transactions', 'documents', 'compliance_activities',
        'investments', 'ult_transactions', 'transactions',
        'pool_positions', 'financings', 'risk_metrics',
        'compliance_metrics', 'impact_metrics', 'whitelisted_wallets',
        'yield_statements', 'gdiz_financings'
    ]
    
    for table in tables:
        result = conn.execute(text(f'SELECT COUNT(*) FROM "{table}"'))
        count = result.scalar()
        print(f"   {table:30s}: {count}")

# ============================================================
# 2. USERS TABLE AUDIT
# ============================================================
print("\n👤 SECTION 2: USERS TABLE")
print("-" * 40)

with engine.connect() as conn:
    result = conn.execute(text('SELECT * FROM users ORDER BY id'))
    users = [dict(row._mapping) for row in result]
    
    check("Users table has data", len(users) > 0, f"Found {len(users)} users")
    
    # Check for unique emails
    emails = [u['email'] for u in users]
    check("All emails unique", len(emails) == len(set(emails)), f"Duplicate emails: {[e for e in emails if emails.count(e) > 1]}")
    
    # Check for unique wallet addresses
    wallets = [u['wallet_address'] for u in users if u['wallet_address']]
    check("All wallet addresses unique", len(wallets) == len(set(wallets)), f"Duplicate wallets: {[w for w in wallets if wallets.count(w) > 1]}")
    
    # Check wallet address format (0x + 40 hex chars)
    bad_wallets = [u['wallet_address'] for u in users if u['wallet_address'] and (not u['wallet_address'].startswith('0x') or len(u['wallet_address']) != 42)]
    check("Wallet addresses valid format (0x + 40 chars)", len(bad_wallets) == 0, f"Invalid: {bad_wallets}")
    
    # Check roles are valid
    valid_roles = ['INSTITUTIONAL_INVESTOR', 'RETAIL_INVESTOR', 'INDUSTRIAL_OPERATOR', 'COMPLIANCE_OFFICER', 'ADMIN']
    bad_roles = [u for u in users if u['role'] not in valid_roles]
    check("All roles valid", len(bad_roles) == 0, f"Invalid roles: {[u['role'] for u in bad_roles]}")
    
    # Check is_active is boolean
    check("is_active is boolean", all(isinstance(u['is_active'], bool) for u in users), f"Non-boolean values found")
    
    # Check password_hash for users without it
    no_password = [u['email'] for u in users if not u['password_hash']]
    if no_password:
        warnings.append(f"  ⚠️  Users without password_hash (may be OK for demo): {no_password}")
    else:
        passes.append("  ✅ All users have password_hash")
    
    for u in users:
        print(f"   [{u['id']}] {u['email']:40s} Role: {u['role']:25s} Active: {u['is_active']} Wallet: {u['wallet_address']}")

# ============================================================
# 3. INVESTOR PROFILES AUDIT
# ============================================================
print("\n💼 SECTION 3: INVESTOR PROFILES")
print("-" * 40)

with engine.connect() as conn:
    result = conn.execute(text('SELECT * FROM investor_profiles ORDER BY id'))
    investors = [dict(row._mapping) for row in result]
    
    check("Investor profiles exist", len(investors) > 0, f"Found {len(investors)} profiles")
    
    # Check all investor user_ids exist in users
    user_ids = [u['id'] for u in users]
    orphan_investors = [i for i in investors if i['user_id'] not in user_ids]
    check("All investor user_ids reference valid users", len(orphan_investors) == 0, f"Orphan investors: {[i['id'] for i in orphan_investors]}")
    
    # Check wallet addresses are unique
    inv_wallets = [i['wallet_address'] for i in investors if i['wallet_address']]
    check("Investor wallet addresses unique", len(inv_wallets) == len(set(inv_wallets)), f"Duplicates: {inv_wallets}")
    
    # Check wallet addresses match their user's wallet
    for inv in investors:
        user = next((u for u in users if u['id'] == inv['user_id']), None)
        if user and inv['wallet_address'] and user['wallet_address']:
            match = inv['wallet_address'].lower() == user['wallet_address'].lower()
            check(f"Investor {inv['id']} wallet matches user {inv['user_id']}", match,
                  f"Investor: {inv['wallet_address']} vs User: {user['wallet_address']}")
    
    # Check KYC/KYB status values
    valid_kyc = ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW', None]
    valid_kyb = ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW', None]
    for inv in investors:
        check(f"Investor {inv['id']} KYC status valid", inv['kyc_status'] in valid_kyc, f"Status: {inv['kyc_status']}")
        check(f"Investor {inv['id']} KYB status valid", inv['kyb_status'] in valid_kyb, f"Status: {inv['kyb_status']}")
    
    for i in investors:
        print(f"   [{i['id']}] User: {i['user_id']:3d} Name: {str(i['full_name']):20s} KYC: {str(i['kyc_status']):12s} Wallet: {i['wallet_address']}")

# ============================================================
# 4. BANK ACCOUNTS AUDIT
# ============================================================
print("\n🏦 SECTION 4: BANK ACCOUNTS")
print("-" * 40)

with engine.connect() as conn:
    result = conn.execute(text('SELECT * FROM bank_accounts ORDER BY account_id'))
    bank_accounts = [dict(row._mapping) for row in result]
    
    check("Bank accounts exist", len(bank_accounts) > 0, f"Found {len(bank_accounts)} accounts")
    
    # Check all user_ids exist
    for ba in bank_accounts:
        if ba['user_id']:
            exists = ba['user_id'] in user_ids
            check(f"Bank account {ba['account_id']} user_id {ba['user_id']} exists", exists, "User not found")
        else:
            warnings.append(f"  ⚠️  Bank account {ba['account_id']} has NULL user_id")
    
    # Check balance consistency
    for ba in bank_accounts:
        # balance should equal escrow_balance + available_balance (or similar logic)
        total = ba['available_balance'] + ba['locked_amount']
        bal_matches = abs(ba['balance'] - total) < 0.01
        check(f"Bank account {ba['account_id']} balance consistency", bal_matches,
              f"balance={ba['balance']} vs available+locked={total}")
        
        # Check no negative balances
        check(f"Bank account {ba['account_id']} non-negative balance", ba['balance'] >= 0, f"Balance: {ba['balance']}")
        check(f"Bank account {ba['account_id']} non-negative available", ba['available_balance'] >= 0, f"Available: {ba['available_balance']}")
        check(f"Bank account {ba['account_id']} non-negative locked", ba['locked_amount'] >= 0, f"Locked: {ba['locked_amount']}")
        check(f"Bank account {ba['account_id']} non-negative escrow", ba['escrow_balance'] >= 0, f"Escrow: {ba['escrow_balance']}")
    
    # Check IBAN format if present
    for ba in bank_accounts:
        if ba.get('iban'):
            valid_iban = ba['iban'][:2].isalpha() and len(ba['iban']) >= 15
            check(f"Bank account {ba['account_id']} IBAN format", valid_iban, f"IBAN: {ba['iban']}")
    
    # Check currency
    valid_currencies = ['EUR', 'USD', 'GBP', 'XOF', 'NGN', 'KES']
    for ba in bank_accounts:
        check(f"Bank account {ba['account_id']} currency valid", ba['currency'] in valid_currencies, f"Currency: {ba['currency']}")
    
    for ba in bank_accounts:
        uid = str(ba['user_id']) if ba['user_id'] else 'NULL'
        print(f"   [{ba['account_id']}] User: {uid:3s} Bank: {ba['bank_name']:20s} Balance: {ba['balance']:>12.2f} {ba['currency']} Available: {ba['available_balance']:>12.2f} Locked: {ba['locked_amount']:>10.2f}")

# ============================================================
# 5. USER <-> BANK ACCOUNT RELATIONSHIP
# ============================================================
print("\n🔗 SECTION 5: USER <-> BANK ACCOUNT RELATIONSHIPS")
print("-" * 40)

with engine.connect() as conn:
    # Count bank accounts per user
    result = conn.execute(text('''
        SELECT u.id, u.email, u.role, COUNT(ba.account_id) as account_count
        FROM users u
        LEFT JOIN bank_accounts ba ON u.id = ba.user_id
        GROUP BY u.id, u.email, u.role
        ORDER BY u.id
    '''))
    user_bank_counts = [dict(row._mapping) for row in result]
    
    for ub in user_bank_counts:
        print(f"   User {ub['id']:3d} ({ub['role']:25s}) {ub['email']:40s} → {ub['account_count']} bank account(s)")
    
    # Users with no bank accounts
    no_bank = [ub for ub in user_bank_counts if ub['account_count'] == 0]
    if no_bank:
        warnings.append(f"  ⚠️  Users without bank accounts: {[ub['email'] for ub in no_bank]}")
    else:
        passes.append("  ✅ All users have at least one bank account")
    
    # Investors should have bank accounts
    investor_users = [u for u in users if 'INVESTOR' in u['role']]
    investors_without_banks = [iu for iu in user_bank_counts if iu['role'] == 'RETAIL_INVESTOR' and iu['account_count'] == 0]
    if investors_without_banks:
        issues.append(f"  ❌ Investor users without bank accounts: {[iu['email'] for iu in investors_without_banks]}")
    else:
        passes.append("  ✅ All investor users have bank accounts")

# ============================================================
# 6. POOLS AUDIT
# ============================================================
print("\n🏊 SECTION 6: POOLS")
print("-" * 40)

with engine.connect() as conn:
    result = conn.execute(text('SELECT * FROM pools ORDER BY id'))
    pools = [dict(row._mapping) for row in result]
    
    check("Pools exist", len(pools) > 0, f"Found {len(pools)} pools")
    
    # Check pool IDs are unique
    pool_ids = [p['id'] for p in pools]
    check("Pool IDs unique", len(pool_ids) == len(set(pool_ids)))
    
    # Check yield ranges make sense
    for p in pools:
        check(f"Pool {p['id']} min_yield < max_yield", p['target_yield_min'] < p['target_yield_max'],
              f"Min: {p['target_yield_min']} vs Max: {p['target_yield_max']}")
        check(f"Pool {p['id']} APY reasonable (0-100%)", 0 < p['apy'] < 100, f"APY: {p['apy']}%")
        check(f"Pool {p['id']} lockup_days positive", p['lockup_days'] > 0, f"Days: {p['lockup_days']}")
        check(f"Pool {p['id']} total_value non-negative", p['total_value'] >= 0, f"Value: {p['total_value']}")
    
    # Check families are valid
    valid_families = ['industrie', 'agriculture', 'trade_finance', 'infrastructure', 'energy']
    for p in pools:
        check(f"Pool {p['id']} family valid", p['family'] in valid_families, f"Family: {p['family']}")
    
    for p in pools:
        print(f"   [{p['id']}] Family: {p['family']:15s} APY: {p['apy']:6.2f}% Yield: {p['target_yield_min']}-{p['target_yield_max']}% TVL: {p['total_value']:>14.2f}")

# ============================================================
# 7. POOL POSITIONS AUDIT
# ============================================================
print("\n📈 SECTION 7: POOL POSITIONS")
print("-" * 40)

with engine.connect() as conn:
    result = conn.execute(text('SELECT * FROM pool_positions ORDER BY id'))
    positions = [dict(row._mapping) for row in result]
    
    check("Pool positions exist", len(positions) > 0, f"Found {len(positions)} positions")
    
    # Check investor_ids reference valid investors
    investor_ids = [i['id'] for i in investors]
    orphan_positions = [p for p in positions if p['investor_id'] not in investor_ids]
    check("All positions reference valid investors", len(orphan_positions) == 0, f"Orphans: {[p['id'] for p in orphan_positions]}")
    
    # Check pool_ids reference valid pools
    orphan_pool_positions = [p for p in positions if p['pool_id'] not in pool_ids]
    check("All positions reference valid pools", len(orphan_pool_positions) == 0, f"Orphans: {[p['id'] for p in orphan_pool_positions]}")
    
    # Check shares are positive
    for pos in positions:
        check(f"Position {pos['id']} shares positive", pos['shares'] > 0, f"Shares: {pos['shares']}")
        check(f"Position {pos['id']} NAV reasonable", pos['average_nav'] > 0, f"NAV: {pos['average_nav']}")
    
    # Check unique investor-pool combinations
    combos = [(p['investor_id'], p['pool_id']) for p in positions]
    check("Unique investor-pool combinations", len(combos) == len(set(combos)), f"Duplicates: {[c for c in combos if combos.count(c) > 1]}")
    
    for pos in positions:
        investor = next((i for i in investors if i['id'] == pos['investor_id']), None)
        pool = next((p for p in pools if p['id'] == pos['pool_id']), None)
        inv_name = str(investor['full_name']) if investor else 'UNKNOWN'
        pool_name = pool['name'] if pool else 'UNKNOWN'
        print(f"   [{pos['id']}] Investor: {inv_name:20s} Pool: {pool_name:25s} Shares: {pos['shares']:>12.2f} Yield: {pos['total_yield_earned']:>10.2f}")

# ============================================================
# 8. DOCUMENTS AUDIT
# ============================================================
print("\n📄 SECTION 8: DOCUMENTS")
print("-" * 40)

with engine.connect() as conn:
    result = conn.execute(text('SELECT * FROM documents ORDER BY id'))
    documents = [dict(row._mapping) for row in result]
    
    check("Documents exist", len(documents) > 0, f"Found {len(documents)} documents")
    
    # Check investor_ids reference valid investors
    orphan_docs = [d for d in documents if d['investor_id'] not in investor_ids]
    check("All documents reference valid investors", len(orphan_docs) == 0, f"Orphans: {[d['id'] for d in orphan_docs]}")
    
    # Check valid document types
    valid_doc_types = ['KYC_ID', 'KYC_ADDRESS', 'KYC_SELFIE', 'KYB_INCORPORATION', 'KYB_MEMORANDUM', 
                       'KYB_SHAREHOLDER', 'KYB_DIRECTOR', 'COMPLIANCE_CERT', 'OTHER']
    for d in documents:
        check(f"Document {d['id']} type valid", d['document_type'] in valid_doc_types, f"Type: {d['document_type']}")
    
    # Check upload_status values
    valid_statuses = ['uploaded', 'processing', 'verified', 'rejected', 'PENDING']
    for d in documents:
        check(f"Document {d['id']} status valid", d['upload_status'] in valid_statuses, f"Status: {d['upload_status']}")
    
    # Check file_hash format (if present, should be hex)
    for d in documents:
        if d.get('file_hash'):
            clean_hash = d['file_hash'].replace('0x', '')
            valid_hash = all(c in '0123456789abcdefABCDEF' for c in clean_hash) and len(clean_hash) >= 32
            check(f"Document {d['id']} file_hash valid hex", valid_hash, f"Hash: {d['file_hash'][:20]}...")
    
    # Check deadline is after submitted_at
    for d in documents:
        if d['deadline_at'] and d['submitted_at']:
            check(f"Document {d['id']} deadline after submission", d['deadline_at'] > d['submitted_at'],
                  f"Submitted: {d['submitted_at']} Deadline: {d['deadline_at']}")
    
    for d in documents:
        investor = next((i for i in investors if i['id'] == d['investor_id']), None)
        inv_name = str(investor['full_name']) if investor else 'UNKNOWN'
        print(f"   [{d['id']}] Investor: {inv_name:20s} Type: {d['document_type']:20s} Status: {d['upload_status']:12s}")

# ============================================================
# 9. FINANCINGS AUDIT
# ============================================================
print("\n💰 SECTION 9: FINANCINGS")
print("-" * 40)

with engine.connect() as conn:
    result = conn.execute(text('SELECT * FROM financings ORDER BY id'))
    financings_data = [dict(row._mapping) for row in result]
    
    check("Financings exist", len(financings_data) > 0, f"Found {len(financings_data)} financings")
    
    for f in financings_data:
        # Check pool_id valid
        check(f"Financing {f['id']} pool_id valid", f['pool_id'] in pool_ids, f"Pool: {f['pool_id']}")
        
        # Check interest rate reasonable (0-30%)
        check(f"Financing {f['id']} interest rate reasonable", 0 < f['interest_rate'] <= 30, f"Rate: {f['interest_rate']}%")
        
        # Check duration positive
        check(f"Financing {f['id']} duration positive", f['duration_days'] > 0, f"Days: {f['duration_days']}")
        
        # Check principal positive
        check(f"Financing {f['id']} principal positive", f['principal'] > 0, f"Amount: {f['principal']}")
        
        # Check amount_repaid <= principal
        check(f"Financing {f['id']} amount_repaid <= principal", f['amount_repaid'] <= f['principal'],
              f"Repaid: {f['amount_repaid']} vs Principal: {f['principal']}")
        
        # Check maturity after start
        check(f"Financing {f['id']} maturity after start", f['maturity_date'] > f['start_date'],
              f"Start: {f['start_date']} Maturity: {f['maturity_date']}")
        
        # Check is_repaid consistency
        if f['is_repaid']:
            check(f"Financing {f['id']} fully repaid means amount_repaid = principal",
                  abs(f['amount_repaid'] - f['principal']) < 0.01,
                  f"Repaid: {f['amount_repaid']} vs Principal: {f['principal']}")
        
        # Check is_defaulted and is_repaid can't both be true
        check(f"Financing {f['id']} not both repaid and defaulted", not (f['is_repaid'] and f['is_defaulted']),
              f"Repaid: {f['is_repaid']}, Defaulted: {f['is_defaulted']}")
        
        pool = next((p for p in pools if p['id'] == f['pool_id']), None)
        pool_name = pool['name'] if pool else 'UNKNOWN'
        print(f"   [{f['id']}] {f['industrial']:30s} Pool: {pool_name:25s} Amount: {f['principal']:>12.2f} Rate: {f['interest_rate']:5.1f}% Repaid: {f['amount_repaid']:>12.2f} Status: {f['status']}")

# ============================================================
# 10. RISK METRICS AUDIT
# ============================================================
print("\n⚠️  SECTION 10: RISK METRICS")
print("-" * 40)

with engine.connect() as conn:
    result = conn.execute(text('SELECT * FROM risk_metrics ORDER BY id'))
    risk_metrics = [dict(row._mapping) for row in result]
    
    check("Risk metrics exist", len(risk_metrics) > 0, f"Found {len(risk_metrics)} metrics")
    
    # Check pool_ids valid
    for rm in risk_metrics:
        check(f"Risk metric {rm['id']} pool_id valid", rm['pool_id'] in pool_ids, f"Pool: {rm['pool_id']}")
        
        # Check default_rate 0-1
        check(f"Risk metric {rm['id']} default_rate 0-1", 0 <= rm['default_rate'] <= 1, f"Rate: {rm['default_rate']}")
        
        # Check concentration_risk 0-1
        check(f"Risk metric {rm['id']} concentration_risk 0-1", 0 <= rm['concentration_risk'] <= 1, f"Risk: {rm['concentration_risk']}")
        
        # Check credit_score 300-850
        check(f"Risk metric {rm['id']} credit_score 300-850", 300 <= rm['credit_score'] <= 850, f"Score: {rm['credit_score']}")
        
        # Check risk_score 0-100
        check(f"Risk metric {rm['id']} risk_score 0-100", 0 <= rm['risk_score'] <= 100, f"Score: {rm['risk_score']}")
        
        # Check credit_rating valid
        valid_ratings = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-', 'BB+', 'BB', 'BB-', 'B+', 'B', 'B-', 'CCC', 'CC', 'C', 'D']
        check(f"Risk metric {rm['id']} credit_rating valid", rm['credit_rating'] in valid_ratings, f"Rating: {rm['credit_rating']}")
        
        # Check risk_grade valid
        valid_grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D']
        check(f"Risk metric {rm['id']} risk_grade valid", rm['risk_grade'] in valid_grades, f"Grade: {rm['risk_grade']}")
        
        # Check collateralization_ratio reasonable
        check(f"Risk metric {rm['id']} collateralization_ratio positive", rm['collateralization_ratio'] >= 0, f"Ratio: {rm['collateralization_ratio']}")
    
    for rm in risk_metrics:
        pool = next((p for p in pools if p['id'] == rm['pool_id']), None)
        pool_name = pool['name'] if pool else 'UNKNOWN'
        print(f"   [{rm['id']}] Pool: {pool_name:25s} Credit: {rm['credit_score']:4d} ({rm['credit_rating']}) Risk: {rm['risk_grade']} Default: {rm['default_rate']:.4f}")

# ============================================================
# 11. COMPLIANCE METRICS AUDIT
# ============================================================
print("\n🛡️  SECTION 11: COMPLIANCE METRICS")
print("-" * 40)

with engine.connect() as conn:
    result = conn.execute(text('SELECT * FROM compliance_metrics ORDER BY id'))
    compliance_metrics = [dict(row._mapping) for row in result]
    
    check("Compliance metrics exist", len(compliance_metrics) > 0, f"Found {len(compliance_metrics)} metrics")
    
    for cm in compliance_metrics:
        check(f"Compliance metric {cm['id']} pool_id valid", cm['pool_id'] in pool_ids, f"Pool: {cm['pool_id']}")
        check(f"Compliance metric {cm['id']} KYC coverage 0-100", 0 <= cm['kyc_coverage'] <= 100, f"Coverage: {cm['kyc_coverage']}")
        check(f"Compliance metric {cm['id']} compliance_score 0-100", 0 <= cm['compliance_score'] <= 100, f"Score: {cm['compliance_score']}")
        check(f"Compliance metric {cm['id']} whitelisted_wallets non-negative", cm['whitelisted_wallets'] >= 0, f"Count: {cm['whitelisted_wallets']}")
        check(f"Compliance metric {cm['id']} jurisdiction_count positive", cm['jurisdiction_count'] > 0, f"Count: {cm['jurisdiction_count']}")
        
        # Check jurisdiction_distribution is valid JSON dict
        if isinstance(cm['jurisdiction_distribution'], str):
            try:
                jd = json.loads(cm['jurisdiction_distribution'])
                check(f"Compliance metric {cm['id']} jurisdiction_distribution valid JSON", True)
            except:
                check(f"Compliance metric {cm['id']} jurisdiction_distribution valid JSON", False, f"Value: {cm['jurisdiction_distribution'][:50]}")
    
    for cm in compliance_metrics:
        pool = next((p for p in pools if p['id'] == cm['pool_id']), None)
        pool_name = pool['name'] if pool else 'UNKNOWN'
        print(f"   [{cm['id']}] Pool: {pool_name:25s} KYC: {cm['kyc_coverage']:5.1f}% Score: {cm['compliance_score']:3d} Wallets: {cm['whitelisted_wallets']}")

# ============================================================
# 12. IMPACT METRICS AUDIT
# ============================================================
print("\n🌍 SECTION 12: IMPACT METRICS")
print("-" * 40)

with engine.connect() as conn:
    result = conn.execute(text('SELECT * FROM impact_metrics ORDER BY id'))
    impact_metrics = [dict(row._mapping) for row in result]
    
    check("Impact metrics exist", len(impact_metrics) > 0, f"Found {len(impact_metrics)} metrics")
    
    for im in impact_metrics:
        check(f"Impact metric {im['id']} pool_id valid", im['pool_id'] in pool_ids, f"Pool: {im['pool_id']}")
        check(f"Impact metric {im['id']} impact_score 0-100", 0 <= im['impact_score'] <= 100, f"Score: {im['impact_score']}")
        check(f"Impact metric {im['id']} impact_grade valid", im['impact_grade'] in ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D'], f"Grade: {im['impact_grade']}")
        check(f"Impact metric {im['id']} jobs_per_million positive", im['jobs_per_million'] > 0, f"Jobs: {im['jobs_per_million']}")
        check(f"Impact metric {im['id']} total_direct_jobs positive", im['total_direct_jobs'] > 0, f"Jobs: {im['total_direct_jobs']}")
        
        # Check women_employment_rate 0-100
        check(f"Impact metric {im['id']} women_employment 0-100", 0 <= im['women_employment_rate'] <= 100, f"Rate: {im['women_employment_rate']}")
        check(f"Impact metric {im['id']} youth_employment 0-100", 0 <= im['youth_employment_rate'] <= 100, f"Rate: {im['youth_employment_rate']}")
        
        # Check SDG coverage JSON
        if isinstance(im['sdg_coverage'], str):
            try:
                json.loads(im['sdg_coverage'])
                check(f"Impact metric {im['id']} sdg_coverage valid JSON", True)
            except:
                check(f"Impact metric {im['id']} sdg_coverage valid JSON", False, f"Value: {im['sdg_coverage'][:50]}")
    
    for im in impact_metrics:
        pool = next((p for p in pools if p['id'] == im['pool_id']), None)
        pool_name = pool['name'] if pool else 'UNKNOWN'
        print(f"   [{im['id']}] Pool: {pool_name:25s} Score: {im['impact_score']:3d} Grade: {im['impact_grade']} Jobs: {im['total_direct_jobs']}")

# ============================================================
# 13. WHITELISTED WALLETS AUDIT
# ============================================================
print("\n✅ SECTION 13: WHITELISTED WALLETS")
print("-" * 40)

with engine.connect() as conn:
    result = conn.execute(text('SELECT * FROM whitelisted_wallets ORDER BY id'))
    whitelisted = [dict(row._mapping) for row in result]
    
    check("Whitelisted wallets exist", len(whitelisted) > 0, f"Found {len(whitelisted)} wallets")
    
    # Check investor_ids reference valid investors
    orphan_wallets = [w for w in whitelisted if w['investor_id'] not in investor_ids]
    check("All whitelisted wallets reference valid investors", len(orphan_wallets) == 0, f"Orphans: {[w['id'] for w in orphan_wallets]}")
    
    # Check wallet address format
    for w in whitelisted:
        valid = w['wallet_address'].startswith('0x') and len(w['wallet_address']) == 42
        check(f"Wallet {w['id']} format valid", valid, f"Address: {w['wallet_address']}")
    
    # Check unique wallet addresses
    wl_wallets = [w['wallet_address'] for w in whitelisted]
    check("Whitelisted wallet addresses unique", len(wl_wallets) == len(set(wl_wallets)), f"Duplicates: {wl_wallets}")
    
    # Check approved wallets have approved_at
    for w in whitelisted:
        if w['is_approved']:
            check(f"Wallet {w['id']} approved has approved_at", w['approved_at'] is not None, "Missing approved_at")
    
    for w in whitelisted:
        investor = next((i for i in investors if i['id'] == w['investor_id']), None)
        inv_name = str(investor['full_name']) if investor else 'UNKNOWN'
        print(f"   [{w['id']}] Investor: {inv_name:20s} Wallet: {w['wallet_address']} Jurisdiction: {w['jurisdiction']} Approved: {w['is_approved']}")

# ============================================================
# 14. INVESTMENTS AUDIT
# ============================================================
print("\n💸 SECTION 14: INVESTMENTS")
print("-" * 40)

with engine.connect() as conn:
    result = conn.execute(text('SELECT COUNT(*) FROM investments'))
    inv_count = result.scalar()
    
    if inv_count == 0:
        warnings.append("  ⚠️  No investments found - may be expected for new platform")
    else:
        result = conn.execute(text('SELECT * FROM investments ORDER BY id'))
        investments = [dict(row._mapping) for row in result]
        
        for inv in investments:
            check(f"Investment {inv['id']} pool_id valid", inv['pool_id'] in pool_ids, f"Pool: {inv['pool_id']}")
            check(f"Investment {inv['id']} investor_id valid", inv['investor_id'] in investor_ids, f"Investor: {inv['investor_id']}")
            check(f"Investment {inv['id']} amount positive", inv['amount'] > 0, f"Amount: {inv['amount']}")
            check(f"Investment {inv['id']} shares positive", inv['shares'] > 0, f"Shares: {inv['shares']}")
        
        print(f"   Found {inv_count} investments")

# ============================================================
# 15. TRANSACTIONS AUDIT
# ============================================================
print("\n🔄 SECTION 15: TRANSACTIONS")
print("-" * 40)

with engine.connect() as conn:
    result = conn.execute(text('SELECT COUNT(*) FROM transactions'))
    tx_count = result.scalar()
    if tx_count == 0:
        warnings.append("  ⚠️  No transactions found")
    else:
        print(f"   Found {tx_count} transactions")
        result = conn.execute(text('SELECT * FROM transactions ORDER BY id'))
        transactions = [dict(row._mapping) for row in result]
        
        for tx in transactions:
            check(f"Transaction {tx['id']} investor valid", tx['investor_id'] in investor_ids, f"Investor: {tx['investor_id']}")
            check(f"Transaction {tx['id']} amount positive", tx['amount'] > 0, f"Amount: {tx['amount']}")

# ============================================================
# 16. CROSS-TABLE CONSISTENCY
# ============================================================
print("\n🔍 SECTION 16: CROSS-TABLE CONSISTENCY")
print("-" * 40)

with engine.connect() as conn:
    # Pool total_value should roughly match sum of positions
    for p in pools:
        result = conn.execute(text(f"SELECT COALESCE(SUM(shares), 0) as total FROM pool_positions WHERE pool_id = '{p['id']}'"))
        pos_total = result.scalar()
        
        # Shares don't necessarily equal TVL (NAV-based), so this is informational
        print(f"   Pool {p['id']}: TVL={p['total_value']:>12.2f} | Position shares sum={pos_total:>12.2f}")
    
    # Number of whitelisted wallets vs compliance_metrics count
    result = conn.execute(text('SELECT COUNT(*) FROM whitelisted_wallets WHERE is_approved = true'))
    approved_count = result.scalar()
    print(f"\n   Approved whitelisted wallets: {approved_count}")
    
    # Check each pool has matching risk/compliance/impact metrics
    for p in pools:
        result = conn.execute(text(f"SELECT COUNT(*) FROM risk_metrics WHERE pool_id = '{p['id']}'"))
        rm_count = result.scalar()
        result = conn.execute(text(f"SELECT COUNT(*) FROM compliance_metrics WHERE pool_id = '{p['id']}'"))
        cm_count = result.scalar()
        result = conn.execute(text(f"SELECT COUNT(*) FROM impact_metrics WHERE pool_id = '{p['id']}'"))
        im_count = result.scalar()
        
        check(f"Pool {p['id']} has risk metrics", rm_count > 0, f"Missing risk metrics")
        check(f"Pool {p['id']} has compliance metrics", cm_count > 0, f"Missing compliance metrics")
        check(f"Pool {p['id']} has impact metrics", im_count > 0, f"Missing impact metrics")

# ============================================================
# SUMMARY
# ============================================================
print("\n" + "=" * 80)
print("AUDIT SUMMARY")
print("=" * 80)

print(f"\n  ✅ PASSED:  {len(passes)}")
for p in passes:
    print(p)

if warnings:
    print(f"\n  ⚠️  WARNINGS: {len(warnings)}")
    for w in warnings:
        print(w)

if issues:
    print(f"\n  ❌ ISSUES:  {len(issues)}")
    for i in issues:
        print(i)
else:
    print(f"\n  🎉 No critical issues found!")

print(f"\n{'=' * 80}")
