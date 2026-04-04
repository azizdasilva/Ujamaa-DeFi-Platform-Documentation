"""
Direct Neon Database Sync Script
Connects to Neon and mirrors local SQLite data 100%
"""

import json
import sqlite3
import sys
from pathlib import Path
from sqlalchemy import create_engine, text, MetaData, Table, Column, Integer, String, Float, Boolean, Numeric, DateTime, Text, JSON
from sqlalchemy.orm import sessionmaker

# Local SQLite
SQLITE_PATH = Path(__file__).parent / 'data' / 'ujamaa.db'

# Neon PostgreSQL
NEON_URL = 'postgresql://neondb_owner:npg_rcdLBmN3eD2I@ep-flat-violet-adszjxii.c-2.us-east-1.aws.neon.tech/ujamaa?sslmode=require'

print("=" * 70)
print("NEON DATABASE SYNC")
print("=" * 70)

# Connect to Neon
print("\n1. Connecting to Neon...")
neon_engine = create_engine(NEON_URL, echo=False, pool_pre_ping=True)
with neon_engine.connect() as conn:
    result = conn.execute(text("SELECT current_database(), current_user"))
    db, user = result.fetchone()
    print(f"   Connected to: {db} as {user}")
    print("   Connection: OK")

# Drop all existing tables
print("\n2. Dropping all existing tables...")
with neon_engine.begin() as conn:
    # Drop tables
    conn.execute(text("""
        DO $$ DECLARE r RECORD; BEGIN
            FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                EXECUTE 'DROP TABLE IF EXISTS "' || r.tablename || '" CASCADE';
            END LOOP;
        END $$;
    """))
    # Drop types
    conn.execute(text("""
        DO $$ DECLARE r RECORD; BEGIN
            FOR r IN (SELECT typname FROM pg_type WHERE typtype = 'e' AND typnamespace = 'public'::regnamespace) LOOP
                EXECUTE 'DROP TYPE IF EXISTS "' || r.typname || '" CASCADE';
            END LOOP;
        END $$;
    """))
    print("   All tables and types dropped")

# Read SQLite data
print("\n3. Reading local SQLite data...")
sqlite_conn = sqlite3.connect(str(SQLITE_PATH))
sqlite_conn.row_factory = sqlite3.Row
sqlite_cursor = sqlite_conn.cursor()

sqlite_cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
tables = [row['name'] for row in sqlite_cursor.fetchall()]
print(f"   Found {len(tables)} tables")

# Get data from each table
all_data = {}
for table in tables:
    sqlite_cursor.execute(f"SELECT * FROM {table}")
    rows = sqlite_cursor.fetchall()
    columns = [desc[0] for desc in sqlite_cursor.description]
    all_data[table] = {'columns': columns, 'rows': [dict(row) for row in rows]}
    print(f"   {table}: {len(rows)} rows")

sqlite_conn.close()

# Create tables in Neon based on SQLite schema
print("\n4. Creating tables in Neon...")

with neon_engine.begin() as conn:
    # Users
    conn.execute(text("""
        CREATE TABLE users (
            id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255), wallet_address VARCHAR(42),
            role VARCHAR NOT NULL, is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
        )
    """))

    # Investor Profiles
    conn.execute(text("""
        CREATE TABLE investor_profiles (
            id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id),
            full_name VARCHAR(255), company_name VARCHAR(255), jurisdiction VARCHAR(2),
            kyc_status VARCHAR, kyb_status VARCHAR, accreditation_status VARCHAR,
            wallet_address VARCHAR(42), total_invested NUMERIC(26, 18) DEFAULT 0,
            ult_tokens NUMERIC(26, 18) DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
        )
    """))

    # Pools
    conn.execute(text("""
        CREATE TABLE pools (
            id VARCHAR(50) PRIMARY KEY, name VARCHAR(255) NOT NULL, family VARCHAR(100) NOT NULL,
            target_yield_min FLOAT NOT NULL, target_yield_max FLOAT NOT NULL, lockup_days INTEGER NOT NULL,
            total_value NUMERIC(26, 18) DEFAULT 0, apy FLOAT NOT NULL, is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
        )
    """))

    # Bank Accounts
    conn.execute(text("""
        CREATE TABLE bank_accounts (
            account_id VARCHAR(50) PRIMARY KEY, user_id INTEGER REFERENCES users(id),
            escrow_balance NUMERIC(18,2) DEFAULT 0 NOT NULL, available_balance NUMERIC(18,2) DEFAULT 0 NOT NULL,
            locked_amount NUMERIC(18,2) DEFAULT 0 NOT NULL, balance NUMERIC(18,2) DEFAULT 0 NOT NULL,
            currency VARCHAR(3) DEFAULT 'EUR', status VARCHAR, bank_name VARCHAR(255) DEFAULT 'Mock Bank',
            account_number VARCHAR(50), iban VARCHAR(34), swift_code VARCHAR(11),
            created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW(), last_transaction_at TIMESTAMP
        )
    """))

    # Bank Transactions
    conn.execute(text("""
        CREATE TABLE bank_transactions (
            tx_id VARCHAR(50) PRIMARY KEY, account_id VARCHAR(50) REFERENCES bank_accounts(account_id),
            transaction_type VARCHAR, amount NUMERIC(18,2), currency VARCHAR(3) DEFAULT 'EUR',
            status VARCHAR DEFAULT 'PENDING', counterparty_account VARCHAR(50), counterparty_name VARCHAR(255),
            counterparty_bank VARCHAR(255), description TEXT, reference VARCHAR(100), wire_details TEXT,
            timestamp TIMESTAMP DEFAULT NOW(), settled_at TIMESTAMP, on_chain_tx_hash VARCHAR(66)
        )
    """))

    # Documents
    conn.execute(text("""
        CREATE TABLE documents (
            id SERIAL PRIMARY KEY, investor_id INTEGER REFERENCES investor_profiles(id) ON DELETE CASCADE,
            document_type VARCHAR NOT NULL, document_name VARCHAR(255) NOT NULL, file_path VARCHAR(500) NOT NULL,
            file_hash VARCHAR(128), upload_status VARCHAR DEFAULT 'uploaded', verification_status VARCHAR,
            reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL, reviewed_at TIMESTAMP,
            review_notes TEXT, submitted_at TIMESTAMP DEFAULT NOW(), deadline_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW()
        )
    """))
    
    # Compliance Activities
    conn.execute(text("""
        CREATE TABLE compliance_activities (
            id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id),
            activity_type VARCHAR(100) NOT NULL, target_id INTEGER, target_type VARCHAR(50),
            details JSON, ip_address VARCHAR(45), created_at TIMESTAMP DEFAULT NOW()
        )
    """))
    
    # Investments
    conn.execute(text("""
        CREATE TABLE investments (
            id SERIAL PRIMARY KEY, pool_id VARCHAR(50) REFERENCES pools(id),
            investor_id INTEGER REFERENCES investor_profiles(id), amount NUMERIC(26, 18) NOT NULL,
            shares NUMERIC(26, 18) NOT NULL, nav NUMERIC(26, 18) NOT NULL,
            ult_tokens NUMERIC(26, 18) DEFAULT 0, status VARCHAR DEFAULT 'completed',
            transaction_hash VARCHAR(66), created_at TIMESTAMP DEFAULT NOW()
        )
    """))
    
    # Pool Positions
    conn.execute(text("""
        CREATE TABLE pool_positions (
            id SERIAL PRIMARY KEY, investor_id INTEGER REFERENCES investor_profiles(id),
            pool_id VARCHAR(50) REFERENCES pools(id), shares NUMERIC(26, 18) DEFAULT 0 NOT NULL,
            average_nav NUMERIC(26, 18), total_yield_earned NUMERIC(26, 18) DEFAULT 0,
            last_yield_distribution TIMESTAMP, is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(investor_id, pool_id)
        )
    """))
    
    # Financings
    conn.execute(text("""
        CREATE TABLE financings (
            id SERIAL PRIMARY KEY, pool_family VARCHAR(100) NOT NULL, pool_id VARCHAR(50) REFERENCES pools(id),
            asset_class VARCHAR NOT NULL, industrial VARCHAR(255) NOT NULL,
            industrial_id INTEGER REFERENCES investor_profiles(id), principal NUMERIC(18, 2) NOT NULL,
            interest_rate NUMERIC(5, 2) NOT NULL, duration_days INTEGER NOT NULL,
            start_date TIMESTAMP NOT NULL, maturity_date TIMESTAMP NOT NULL,
            amount_repaid NUMERIC(18, 2) DEFAULT 0, is_repaid BOOLEAN DEFAULT FALSE,
            is_defaulted BOOLEAN DEFAULT FALSE, status VARCHAR, description TEXT,
            collateral JSON, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
        )
    """))
    
    # Risk Metrics
    conn.execute(text("""
        CREATE TABLE risk_metrics (
            id SERIAL PRIMARY KEY, pool_id VARCHAR(50) REFERENCES pools(id),
            default_rate NUMERIC(5, 4) NOT NULL, concentration_risk NUMERIC(5, 4) NOT NULL,
            credit_score INTEGER NOT NULL, credit_rating VARCHAR(10) NOT NULL,
            collateralization_ratio NUMERIC(5, 2) NOT NULL, risk_score INTEGER NOT NULL,
            risk_grade VARCHAR NOT NULL, is_healthy BOOLEAN DEFAULT TRUE,
            calculation_method VARCHAR(50) DEFAULT 'standard', data_points INTEGER,
            period_start TIMESTAMP NOT NULL, period_end TIMESTAMP NOT NULL,
            calculated_at TIMESTAMP DEFAULT NOW()
        )
    """))
    
    # Compliance Metrics
    conn.execute(text("""
        CREATE TABLE compliance_metrics (
            id SERIAL PRIMARY KEY, pool_id VARCHAR(50) REFERENCES pools(id),
            kyc_coverage NUMERIC(5, 2) NOT NULL, whitelisted_wallets INTEGER NOT NULL,
            jurisdiction_count INTEGER NOT NULL, jurisdiction_distribution JSON,
            compliance_score INTEGER NOT NULL, is_compliant BOOLEAN DEFAULT TRUE,
            pending_reviews INTEGER DEFAULT 0, overdue_reviews INTEGER DEFAULT 0,
            sanctions_hits INTEGER DEFAULT 0, pep_exposures INTEGER DEFAULT 0,
            period_start TIMESTAMP NOT NULL, period_end TIMESTAMP NOT NULL,
            calculated_at TIMESTAMP DEFAULT NOW()
        )
    """))
    
    # Impact Metrics
    conn.execute(text("""
        CREATE TABLE impact_metrics (
            id SERIAL PRIMARY KEY, pool_id VARCHAR(50) REFERENCES pools(id),
            avg_capacity_increase NUMERIC(5, 2) NOT NULL, value_add_ratio NUMERIC(5, 2) NOT NULL,
            jobs_per_million NUMERIC(10, 2) NOT NULL, total_direct_jobs INTEGER NOT NULL,
            total_indirect_jobs INTEGER NOT NULL, women_employment_rate NUMERIC(5, 2) NOT NULL,
            youth_employment_rate NUMERIC(5, 2) NOT NULL, co2_reduction_tons NUMERIC(12, 2) NOT NULL,
            renewable_energy_kwh NUMERIC(15, 2) NOT NULL, primary_sdg VARCHAR(50), sdg_coverage JSON,
            impact_score INTEGER NOT NULL, impact_grade VARCHAR(10) NOT NULL,
            period_start TIMESTAMP NOT NULL, period_end TIMESTAMP NOT NULL,
            calculated_at TIMESTAMP DEFAULT NOW()
        )
    """))
    
    # Whitelisted Wallets
    conn.execute(text("""
        CREATE TABLE whitelisted_wallets (
            id SERIAL PRIMARY KEY, investor_id INTEGER REFERENCES investor_profiles(id),
            wallet_address VARCHAR(42) UNIQUE NOT NULL, label VARCHAR(100),
            jurisdiction VARCHAR(2) NOT NULL, jurisdiction_verified BOOLEAN DEFAULT FALSE,
            is_approved BOOLEAN DEFAULT FALSE, approved_by INTEGER REFERENCES users(id),
            approved_at TIMESTAMP, risk_score INTEGER, risk_level VARCHAR(20) DEFAULT 'unknown',
            sanctions_checked BOOLEAN DEFAULT FALSE, sanctions_checked_at TIMESTAMP,
            pep_checked BOOLEAN DEFAULT FALSE, pep_checked_at TIMESTAMP,
            first_transaction_at TIMESTAMP, last_transaction_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
        )
    """))
    
    # Transactions
    conn.execute(text("""
        CREATE TABLE transactions (
            id SERIAL PRIMARY KEY, investor_id INTEGER REFERENCES investor_profiles(id),
            transaction_type VARCHAR(50) NOT NULL, amount NUMERIC(26, 18) NOT NULL,
            currency VARCHAR(10) DEFAULT 'EUR', is_on_chain BOOLEAN DEFAULT FALSE,
            transaction_hash VARCHAR(66), block_number INTEGER, gas_fee NUMERIC(26, 18),
            status VARCHAR DEFAULT 'PENDING', status_history JSON, is_flagged BOOLEAN DEFAULT FALSE,
            risk_level VARCHAR(20), flag_reason TEXT, flagged_at TIMESTAMP, flagged_by VARCHAR(50),
            reviewed_by INTEGER REFERENCES users(id), reviewed_at TIMESTAMP, review_notes TEXT,
            review_action VARCHAR(20), description TEXT, tx_metadata JSON,
            created_at TIMESTAMP DEFAULT NOW(), confirmed_at TIMESTAMP
        )
    """))
    
    # ULT Transactions
    conn.execute(text("""
        CREATE TABLE ult_transactions (
            id SERIAL PRIMARY KEY, investor_id INTEGER REFERENCES investor_profiles(id),
            transaction_type VARCHAR(50) NOT NULL, amount NUMERIC(26, 18) NOT NULL,
            balance_before NUMERIC(26, 18) NOT NULL, balance_after NUMERIC(26, 18) NOT NULL,
            transaction_hash VARCHAR(66), block_number INTEGER, status VARCHAR DEFAULT 'PENDING',
            created_at TIMESTAMP DEFAULT NOW()
        )
    """))
    
    # ULP Transactions
    conn.execute(text("""
        CREATE TABLE ulp_transactions (
            id SERIAL PRIMARY KEY, investor_id INTEGER, transaction_type VARCHAR(50),
            amount NUMERIC(26, 18), balance_before NUMERIC(26, 18), balance_after NUMERIC(26, 18),
            transaction_hash VARCHAR(66), block_number INTEGER, status VARCHAR DEFAULT 'PENDING',
            created_at TIMESTAMP DEFAULT NOW()
        )
    """))
    
    # Yield Statements
    conn.execute(text("""
        CREATE TABLE yield_statements (
            id SERIAL PRIMARY KEY, statement_id VARCHAR(50) UNIQUE NOT NULL,
            investor_id INTEGER REFERENCES investor_profiles(id), pool_id VARCHAR(50) REFERENCES pools(id),
            pool_position_id INTEGER, period_start TIMESTAMP NOT NULL, period_end TIMESTAMP NOT NULL,
            principal NUMERIC(26, 18) NOT NULL, shares_held NUMERIC(26, 18) NOT NULL,
            yield_earned NUMERIC(26, 18) NOT NULL, management_fee NUMERIC(26, 18) DEFAULT 0,
            performance_fee NUMERIC(26, 18) DEFAULT 0, net_yield NUMERIC(26, 18) NOT NULL,
            nav_start NUMERIC(26, 18) NOT NULL, nav_end NUMERIC(26, 18) NOT NULL,
            status VARCHAR DEFAULT 'generated', created_at TIMESTAMP DEFAULT NOW()
        )
    """))
    
    # GDIZ Financings
    conn.execute(text("""
        CREATE TABLE gdiz_financings (
            id SERIAL PRIMARY KEY, gdiz_reference VARCHAR(50) UNIQUE NOT NULL,
            industrial_id INTEGER REFERENCES investor_profiles(id), industrial_name VARCHAR(255) NOT NULL,
            industrial_sector VARCHAR(100) NOT NULL, pool_family VARCHAR(100) NOT NULL,
            asset_class VARCHAR NOT NULL, requested_amount NUMERIC(18, 2) NOT NULL,
            approved_amount NUMERIC(18, 2), interest_rate NUMERIC(5, 2), duration_days INTEGER,
            status VARCHAR, gdiz_status VARCHAR, submitted_at TIMESTAMP DEFAULT NOW(),
            approved_at TIMESTAMP, funded_at TIMESTAMP, application_doc VARCHAR(500),
            approval_doc VARCHAR(500), financing_id INTEGER, created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    """))
    
    print("   Created 19 tables")

# Insert data
print("\n5. Inserting data...")
NeonSession = sessionmaker(bind=neon_engine)
neon_session = NeonSession()

total_inserted = 0

for table_name, data in all_data.items():
    if not data['rows']:
        print(f"   {table_name}: 0 rows (skipping)")
        continue
    
    columns = data['columns']
    rows = data['rows']
    
    for row in rows:
        # Clean data for PostgreSQL
        clean_row = {}
        for col, val in row.items():
            if val is None:
                clean_row[col] = None
            elif isinstance(val, bytes):
                clean_row[col] = val.decode('utf-8', errors='ignore')
            elif isinstance(val, int) and val in (0, 1):
                # Guess boolean columns by name
                bool_names = ['is_active', 'is_approved', 'is_repaid', 'is_defaulted', 'is_healthy',
                              'is_compliant', 'is_on_chain', 'is_flagged', 'jurisdiction_verified',
                              'sanctions_checked', 'pep_checked']
                if col in bool_names:
                    clean_row[col] = bool(val)
                else:
                    clean_row[col] = val
            elif isinstance(val, (dict, list)):
                # Already-parsed JSON from SQLite — serialize to string for raw SQL
                clean_row[col] = json.dumps(val)
            elif isinstance(val, str):
                # Check if it looks like a JSON object/array (sqlite3 stores JSON as text)
                stripped = val.strip()
                if (stripped.startswith('{') and stripped.endswith('}')) or \
                   (stripped.startswith('[') and stripped.endswith(']')):
                    try:
                        parsed = json.loads(val)
                        # Re-serialize to ensure proper JSON format for PostgreSQL
                        clean_row[col] = json.dumps(parsed)
                    except (json.JSONDecodeError, TypeError):
                        clean_row[col] = val
                else:
                    clean_row[col] = val
            else:
                clean_row[col] = val
        
        # Build INSERT statement
        cols_str = ', '.join([f'"{c}"' for c in columns])
        placeholders = ', '.join([f':{c}' for c in columns])
        
        try:
            neon_session.execute(
                text(f'INSERT INTO "{table_name}" ({cols_str}) VALUES ({placeholders})'),
                clean_row
            )
            total_inserted += 1
        except Exception as e:
            print(f"   Error in {table_name}: {e}")
            neon_session.rollback()
            continue
    
    neon_session.commit()
    print(f"   {table_name}: {len(rows)} rows")

neon_session.close()

# Verify
print("\n6. Verifying data...")
with neon_engine.connect() as conn:
    for table in sorted(all_data.keys()):
        if not all_data[table]['rows']:
            continue
        result = conn.execute(text(f'SELECT COUNT(*) FROM "{table}"'))
        count = result.scalar()
        expected = len(all_data[table]['rows'])
        status = '✅' if count == expected else '❌'
        print(f"   {status} {table:30s} Neon: {count:3d} | Expected: {expected:3d}")

print("\n" + "=" * 70)
print(f"SYNC COMPLETE! Total rows inserted: {total_inserted}")
print("=" * 70)
