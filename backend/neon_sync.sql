-- =============================================================================
-- FULL NEON DATABASE SYNC - 100% Mirror of Current Local SQLite
-- Total: 37 rows across 18 tables
-- =============================================================================

-- 1. DROP EVERYTHING
DO $$ DECLARE r RECORD; BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS "' || r.tablename || '" CASCADE';
    END LOOP;
END $$;

DO $$ DECLARE r RECORD; BEGIN
    FOR r IN (SELECT typname FROM pg_type WHERE typtype = 'e' AND typnamespace = 'public'::regnamespace) LOOP
        EXECUTE 'DROP TYPE IF EXISTS "' || r.typname || '" CASCADE';
    END LOOP;
END $$;

-- 2. CREATE ALL TABLES
CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255), wallet_address VARCHAR(42), role VARCHAR NOT NULL, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());

CREATE TABLE investor_profiles (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), full_name VARCHAR(255), company_name VARCHAR(255), jurisdiction VARCHAR(2), kyc_status VARCHAR, kyb_status VARCHAR, accreditation_status VARCHAR, wallet_address VARCHAR(42), total_invested NUMERIC(26, 18) DEFAULT 0, ult_tokens NUMERIC(26, 18) DEFAULT 0, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());

CREATE TABLE pools (id VARCHAR(50) PRIMARY KEY, name VARCHAR(255) NOT NULL, family VARCHAR(100) NOT NULL, target_yield_min FLOAT NOT NULL, target_yield_max FLOAT NOT NULL, lockup_days INTEGER NOT NULL, total_value NUMERIC(26, 18) DEFAULT 0, apy FLOAT NOT NULL, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());

CREATE TABLE bank_accounts (account_id VARCHAR(50) PRIMARY KEY, user_id INTEGER REFERENCES users(id), escrow_balance NUMERIC(18,2) DEFAULT 0 NOT NULL, available_balance NUMERIC(18,2) DEFAULT 0 NOT NULL, locked_amount NUMERIC(18,2) DEFAULT 0 NOT NULL, balance NUMERIC(18,2) DEFAULT 0 NOT NULL, currency VARCHAR(3) DEFAULT 'EUR', status VARCHAR, bank_name VARCHAR(255) DEFAULT 'Mock Bank', account_number VARCHAR(50), iban VARCHAR(34), swift_code VARCHAR(11), created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW(), last_transaction_at TIMESTAMP);

CREATE TABLE bank_transactions (tx_id VARCHAR(50) PRIMARY KEY, account_id VARCHAR(50) REFERENCES bank_accounts(account_id), transaction_type VARCHAR, amount NUMERIC(18,2), currency VARCHAR(3) DEFAULT 'EUR', status VARCHAR DEFAULT 'PENDING', counterparty_account VARCHAR(50), counterparty_name VARCHAR(255), counterparty_bank VARCHAR(255), description TEXT, reference VARCHAR(100), wire_details JSON, timestamp TIMESTAMP DEFAULT NOW(), settled_at TIMESTAMP, on_chain_tx_hash VARCHAR(66));

CREATE TABLE documents (id SERIAL PRIMARY KEY, investor_id INTEGER REFERENCES investor_profiles(id) ON DELETE CASCADE, document_type VARCHAR NOT NULL, document_name VARCHAR(255) NOT NULL, file_path VARCHAR(500) NOT NULL, file_hash VARCHAR(256), upload_status VARCHAR DEFAULT 'uploaded', verification_status VARCHAR, reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL, reviewed_at TIMESTAMP, review_notes TEXT, submitted_at TIMESTAMP DEFAULT NOW(), deadline_at TIMESTAMP, created_at TIMESTAMP DEFAULT NOW());

CREATE TABLE compliance_activities (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), activity_type VARCHAR(100) NOT NULL, target_id INTEGER, target_type VARCHAR(50), details JSON, ip_address VARCHAR(45), created_at TIMESTAMP DEFAULT NOW());

CREATE TABLE investments (id SERIAL PRIMARY KEY, pool_id VARCHAR(50) REFERENCES pools(id), investor_id INTEGER REFERENCES investor_profiles(id), amount NUMERIC(26, 18) NOT NULL, shares NUMERIC(26, 18) NOT NULL, nav NUMERIC(26, 18) NOT NULL, ult_tokens NUMERIC(26, 18) DEFAULT 0, status VARCHAR DEFAULT 'completed', transaction_hash VARCHAR(66), created_at TIMESTAMP DEFAULT NOW());

CREATE TABLE pool_positions (id SERIAL PRIMARY KEY, investor_id INTEGER REFERENCES investor_profiles(id), pool_id VARCHAR(50) REFERENCES pools(id), shares NUMERIC(26, 18) DEFAULT 0 NOT NULL, average_nav NUMERIC(26, 18), total_yield_earned NUMERIC(26, 18) DEFAULT 0, last_yield_distribution TIMESTAMP, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW(), UNIQUE(investor_id, pool_id));

CREATE TABLE financings (id SERIAL PRIMARY KEY, pool_family VARCHAR(100) NOT NULL, pool_id VARCHAR(50) REFERENCES pools(id), asset_class VARCHAR NOT NULL, industrial VARCHAR(255) NOT NULL, industrial_id INTEGER REFERENCES investor_profiles(id), principal NUMERIC(18, 2) NOT NULL, interest_rate NUMERIC(5, 2) NOT NULL, duration_days INTEGER NOT NULL, start_date TIMESTAMP NOT NULL, maturity_date TIMESTAMP NOT NULL, amount_repaid NUMERIC(18, 2) DEFAULT 0, is_repaid BOOLEAN DEFAULT FALSE, is_defaulted BOOLEAN DEFAULT FALSE, status VARCHAR, description TEXT, collateral JSON, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());

CREATE TABLE risk_metrics (id SERIAL PRIMARY KEY, pool_id VARCHAR(50) REFERENCES pools(id), default_rate NUMERIC(5, 4) NOT NULL, concentration_risk NUMERIC(5, 4) NOT NULL, credit_score INTEGER NOT NULL, credit_rating VARCHAR(10) NOT NULL, collateralization_ratio NUMERIC(5, 2) NOT NULL, risk_score INTEGER NOT NULL, risk_grade VARCHAR NOT NULL, is_healthy BOOLEAN DEFAULT TRUE, calculation_method VARCHAR(50) DEFAULT 'standard', data_points INTEGER, period_start TIMESTAMP NOT NULL, period_end TIMESTAMP NOT NULL, calculated_at TIMESTAMP DEFAULT NOW());

CREATE TABLE compliance_metrics (id SERIAL PRIMARY KEY, pool_id VARCHAR(50) REFERENCES pools(id), kyc_coverage NUMERIC(5, 2) NOT NULL, whitelisted_wallets INTEGER NOT NULL, jurisdiction_count INTEGER NOT NULL, jurisdiction_distribution JSON, compliance_score INTEGER NOT NULL, is_compliant BOOLEAN DEFAULT TRUE, pending_reviews INTEGER DEFAULT 0, overdue_reviews INTEGER DEFAULT 0, sanctions_hits INTEGER DEFAULT 0, pep_exposures INTEGER DEFAULT 0, period_start TIMESTAMP NOT NULL, period_end TIMESTAMP NOT NULL, calculated_at TIMESTAMP DEFAULT NOW());

CREATE TABLE impact_metrics (id SERIAL PRIMARY KEY, pool_id VARCHAR(50) REFERENCES pools(id), avg_capacity_increase NUMERIC(5, 2) NOT NULL, value_add_ratio NUMERIC(5, 2) NOT NULL, jobs_per_million NUMERIC(10, 2) NOT NULL, total_direct_jobs INTEGER NOT NULL, total_indirect_jobs INTEGER NOT NULL, women_employment_rate NUMERIC(5, 2) NOT NULL, youth_employment_rate NUMERIC(5, 2) NOT NULL, co2_reduction_tons NUMERIC(12, 2) NOT NULL, renewable_energy_kwh NUMERIC(15, 2) NOT NULL, primary_sdg VARCHAR(50), sdg_coverage JSON, impact_score INTEGER NOT NULL, impact_grade VARCHAR(10) NOT NULL, period_start TIMESTAMP NOT NULL, period_end TIMESTAMP NOT NULL, calculated_at TIMESTAMP DEFAULT NOW());

CREATE TABLE whitelisted_wallets (id SERIAL PRIMARY KEY, investor_id INTEGER REFERENCES investor_profiles(id), wallet_address VARCHAR(42) UNIQUE NOT NULL, label VARCHAR(100), jurisdiction VARCHAR(2) NOT NULL, jurisdiction_verified BOOLEAN DEFAULT FALSE, is_approved BOOLEAN DEFAULT FALSE, approved_by INTEGER REFERENCES users(id), approved_at TIMESTAMP, risk_score INTEGER, risk_level VARCHAR(20) DEFAULT 'unknown', sanctions_checked BOOLEAN DEFAULT FALSE, sanctions_checked_at TIMESTAMP, pep_checked BOOLEAN DEFAULT FALSE, pep_checked_at TIMESTAMP, first_transaction_at TIMESTAMP, last_transaction_at TIMESTAMP, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());

CREATE TABLE transactions (id SERIAL PRIMARY KEY, investor_id INTEGER REFERENCES investor_profiles(id), transaction_type VARCHAR(50) NOT NULL, amount NUMERIC(26, 18) NOT NULL, currency VARCHAR(10) DEFAULT 'EUR', is_on_chain BOOLEAN DEFAULT FALSE, transaction_hash VARCHAR(66), block_number INTEGER, gas_fee NUMERIC(26, 18), status VARCHAR DEFAULT 'PENDING', status_history JSON, is_flagged BOOLEAN DEFAULT FALSE, risk_level VARCHAR(20), flag_reason TEXT, flagged_at TIMESTAMP, flagged_by VARCHAR(50), reviewed_by INTEGER REFERENCES users(id), reviewed_at TIMESTAMP, review_notes TEXT, review_action VARCHAR(20), description TEXT, tx_metadata JSON, created_at TIMESTAMP DEFAULT NOW(), confirmed_at TIMESTAMP);

CREATE TABLE ult_transactions (id SERIAL PRIMARY KEY, investor_id INTEGER REFERENCES investor_profiles(id), transaction_type VARCHAR(50) NOT NULL, amount NUMERIC(26, 18) NOT NULL, balance_before NUMERIC(26, 18) NOT NULL, balance_after NUMERIC(26, 18) NOT NULL, transaction_hash VARCHAR(66), block_number INTEGER, status VARCHAR DEFAULT 'PENDING', created_at TIMESTAMP DEFAULT NOW());

CREATE TABLE yield_statements (id SERIAL PRIMARY KEY, statement_id VARCHAR(50) UNIQUE NOT NULL, investor_id INTEGER REFERENCES investor_profiles(id), pool_id VARCHAR(50) REFERENCES pools(id), pool_position_id INTEGER, period_start TIMESTAMP NOT NULL, period_end TIMESTAMP NOT NULL, principal NUMERIC(26, 18) NOT NULL, shares_held NUMERIC(26, 18) NOT NULL, yield_earned NUMERIC(26, 18) NOT NULL, management_fee NUMERIC(26, 18) DEFAULT 0, performance_fee NUMERIC(26, 18) DEFAULT 0, net_yield NUMERIC(26, 18) NOT NULL, nav_start NUMERIC(26, 18) NOT NULL, nav_end NUMERIC(26, 18) NOT NULL, status VARCHAR DEFAULT 'generated', created_at TIMESTAMP DEFAULT NOW());

CREATE TABLE gdiz_financings (id SERIAL PRIMARY KEY, gdiz_reference VARCHAR(50) UNIQUE NOT NULL, industrial_id INTEGER REFERENCES investor_profiles(id), industrial_name VARCHAR(255) NOT NULL, industrial_sector VARCHAR(100) NOT NULL, pool_family VARCHAR(100) NOT NULL, asset_class VARCHAR NOT NULL, requested_amount NUMERIC(18, 2) NOT NULL, approved_amount NUMERIC(18, 2), interest_rate NUMERIC(5, 2), duration_days INTEGER, status VARCHAR, gdiz_status VARCHAR, submitted_at TIMESTAMP DEFAULT NOW(), approved_at TIMESTAMP, funded_at TIMESTAMP, application_doc VARCHAR(500), approval_doc VARCHAR(500), financing_id INTEGER, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());

-- =============================================================================
-- INSERT DATA (37 rows total - exact match with current SQLite)
-- =============================================================================

-- Users: 6 rows
INSERT INTO users (id, email, password_hash, wallet_address, role, is_active) VALUES
(1, 'institutional@ujamaa-defi.com', NULL, '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1', 'INSTITUTIONAL_INVESTOR', TRUE),
(2, 'retail@ujamaa-defi.com', NULL, '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', 'RETAIL_INVESTOR', TRUE),
(3, 'operator@ujamaa-defi.com', NULL, '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', 'INDUSTRIAL_OPERATOR', TRUE),
(4, 'compliance@ujamaa-defi.com', NULL, '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', 'COMPLIANCE_OFFICER', TRUE),
(5, 'admin@ujamaa-defi.com', NULL, '0x2546BcD3c84621e976D8185a91A922aE77ECEc30', 'ADMIN', TRUE),
(6, 'regulator@ujamaa-defi.com', NULL, '0x976EA74026E726554dB657fA54763abd0C3a0aa9', 'REGULATOR', TRUE);

-- Pools: 5 rows
INSERT INTO pools (id, name, family, target_yield_min, target_yield_max, lockup_days, total_value, apy, is_active) VALUES
('POOL_INDUSTRIE', 'Pool Industrie', 'industrie', 10.0, 12.0, 365, 15000000, 11.0, TRUE),
('POOL_AGRICULTURE', 'Pool Agriculture', 'agriculture', 12.0, 15.0, 180, 12000000, 13.2, TRUE),
('POOL_TRADE_FINANCE', 'Pool Trade Finance', 'trade_finance', 8.0, 10.0, 90, 10000000, 9.2, TRUE),
('POOL_RENEWABLE_ENERGY', 'Pool Renewable Energy', 'renewable_energy', 9.0, 11.0, 730, 8000000, 10.1, TRUE),
('POOL_REAL_ESTATE', 'Pool Real Estate', 'real_estate', 8.0, 12.0, 1095, 5000000, 9.8, TRUE);

-- Investor Profiles: 3 rows
INSERT INTO investor_profiles (id, user_id, full_name, company_name, jurisdiction, kyc_status, kyb_status, wallet_address, total_invested, ult_tokens) VALUES
(1, 1, 'Logic Capital Ltd', NULL, 'MU', 'APPROVED', 'APPROVED', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1', 500000, 495000),
(2, 2, 'John Doe', NULL, 'KE', 'APPROVED', 'PENDING', '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', 25000, 24750),
(3, 3, NULL, 'Green Cotton SA', 'BJ', 'APPROVED', 'APPROVED', '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', 0, 0);

-- Bank Accounts: 2 rows
INSERT INTO bank_accounts (account_id, user_id, balance, currency, status, bank_name, account_number, escrow_balance, available_balance, locked_amount) VALUES
('ESC-B7ABED3D', 1, 500000, 'EUR', 'ACTIVE', 'BIIC Bank', 'BJ3743882502', 10000, 10000, 0),
('ESC-B56EFCE6', 2, 0, 'EUR', 'ACTIVE', 'BIIC Bank', 'KE3396271357', 50000, 50000, 0);

-- Documents: 3 rows
INSERT INTO documents (id, investor_id, document_type, document_name, file_path, file_hash, upload_status, verification_status, submitted_at, deadline_at) VALUES
(1, 2, 'KYC_ID', 'National ID', '/uploads/kyc/john_doe_id.pdf', '0x9a7e391ad8321ec01390fe835c1ba0e0d6d226d2d1ac306b143f9010a52011f6', 'uploaded', 'PENDING', NOW(), NOW() + INTERVAL '24 hours'),
(2, 2, 'KYC_ADDRESS', 'Proof of Address', '/uploads/kyc/john_doe_address.pdf', '0x0e9bfdc115b82dd105664920ab06a69cbcf60e761ab93f2c44198dca95bd96e1', 'uploaded', 'PENDING', NOW() - INTERVAL '12 hours', NOW() + INTERVAL '12 hours'),
(3, 1, 'KYB_INCORPORATION', 'Certificate of Incorporation', '/uploads/kyb/logic_capital_incorporation.pdf', '0xf06e931ce92e22b21e93b68d05cda2cf6840c3d5aa5643e31cae3d48bf1e0488', 'uploaded', 'PENDING', NOW() - INTERVAL '6 hours', NOW() + INTERVAL '18 hours');

-- Pool Positions: 3 rows
INSERT INTO pool_positions (id, investor_id, pool_id, shares, average_nav, total_yield_earned, is_active) VALUES
(1, 1, 'POOL_INDUSTRIE', 500000, 1.0, 55000, TRUE),
(2, 1, 'POOL_AGRICULTURE', 300000, 1.0, 39600, TRUE),
(3, 2, 'POOL_TRADE_FINANCE', 25000, 1.0, 2300, TRUE);

-- Financings: 3 rows
INSERT INTO financings (id, pool_family, pool_id, asset_class, industrial, industrial_id, principal, interest_rate, duration_days, start_date, maturity_date, amount_repaid, is_repaid, is_defaulted, status, description) VALUES
(1, 'industrie', 'POOL_INDUSTRIE', 'EQUIPMENT', 'GDIZ Partner SA', 3, 5000000, 12.0, 365, NOW() - INTERVAL '180 days', NOW() + INTERVAL '185 days', 2500000, FALSE, FALSE, 'REPAYING', 'Equipment financing for textile factory expansion'),
(2, 'agriculture', 'POOL_AGRICULTURE', 'INVENTORY', 'Cafe de Cote d Ivoire', NULL, 3000000, 13.5, 180, NOW() - INTERVAL '90 days', NOW() + INTERVAL '90 days', 1500000, FALSE, FALSE, 'REPAYING', 'Coffee harvest inventory financing'),
(3, 'trade_finance', 'POOL_TRADE_FINANCE', 'RECEIVABLES', 'West Africa Trade Ltd', NULL, 2000000, 9.5, 90, NOW() - INTERVAL '45 days', NOW() + INTERVAL '45 days', 1000000, FALSE, FALSE, 'REPAYING', 'Invoice tokenization for export receivables');

-- Risk Metrics: 3 rows
INSERT INTO risk_metrics (id, pool_id, default_rate, concentration_risk, credit_score, credit_rating, collateralization_ratio, risk_score, risk_grade, is_healthy, period_start, period_end) VALUES
(1, 'POOL_INDUSTRIE', 0.015, 0.12, 720, 'BBB+', 1.35, 75, 'BBB', TRUE, NOW() - INTERVAL '30 days', NOW()),
(2, 'POOL_AGRICULTURE', 0.022, 0.18, 680, 'BB+', 1.25, 68, 'BB', TRUE, NOW() - INTERVAL '30 days', NOW()),
(3, 'POOL_TRADE_FINANCE', 0.008, 0.08, 760, 'A-', 1.45, 82, 'A', TRUE, NOW() - INTERVAL '30 days', NOW());

-- Compliance Metrics: 3 rows
INSERT INTO compliance_metrics (id, pool_id, kyc_coverage, whitelisted_wallets, jurisdiction_count, compliance_score, is_compliant, pending_reviews, overdue_reviews, sanctions_hits, pep_exposures, period_start, period_end) VALUES
(1, 'POOL_INDUSTRIE', 100, 25, 8, 95, TRUE, 2, 0, 0, 1, NOW() - INTERVAL '30 days', NOW()),
(2, 'POOL_AGRICULTURE', 100, 18, 6, 92, TRUE, 3, 0, 0, 0, NOW() - INTERVAL '30 days', NOW()),
(3, 'POOL_TRADE_FINANCE', 100, 30, 10, 98, TRUE, 1, 0, 0, 2, NOW() - INTERVAL '30 days', NOW());

-- Impact Metrics: 3 rows
INSERT INTO impact_metrics (id, pool_id, avg_capacity_increase, value_add_ratio, jobs_per_million, total_direct_jobs, total_indirect_jobs, women_employment_rate, youth_employment_rate, co2_reduction_tons, renewable_energy_kwh, primary_sdg, impact_score, impact_grade, period_start, period_end) VALUES
(1, 'POOL_INDUSTRIE', 28.5, 2.8, 85, 425, 1275, 42.5, 38.2, 15000, 2500000, 'SDG 9', 78, 'B+', NOW() - INTERVAL '90 days', NOW()),
(2, 'POOL_AGRICULTURE', 35.2, 3.2, 120, 360, 1080, 55.8, 45.5, 8000, 1200000, 'SDG 2', 82, 'A-', NOW() - INTERVAL '90 days', NOW()),
(3, 'POOL_TRADE_FINANCE', 18.5, 2.2, 65, 195, 585, 38.5, 42, 3000, 500000, 'SDG 8', 72, 'B', NOW() - INTERVAL '90 days', NOW());

-- Whitelisted Wallets: 3 rows
INSERT INTO whitelisted_wallets (id, investor_id, wallet_address, label, jurisdiction, jurisdiction_verified, is_approved, risk_score, risk_level, sanctions_checked, pep_checked) VALUES
(1, 1, '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1', 'Main Wallet', 'MU', TRUE, TRUE, 15, 'low', TRUE, TRUE),
(2, 2, '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', 'Main Wallet', 'KE', TRUE, TRUE, 20, 'low', TRUE, TRUE),
(3, 3, '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', 'Business Wallet', 'BJ', TRUE, TRUE, 25, 'low', TRUE, TRUE);

-- =============================================================================
-- VERIFICATION - Should show exact match with SQLite
-- =============================================================================
SELECT 'users' as tbl, COUNT(*) FROM users
UNION ALL SELECT 'pools', COUNT(*) FROM pools
UNION ALL SELECT 'investor_profiles', COUNT(*) FROM investor_profiles
UNION ALL SELECT 'bank_accounts', COUNT(*) FROM bank_accounts
UNION ALL SELECT 'documents', COUNT(*) FROM documents
UNION ALL SELECT 'pool_positions', COUNT(*) FROM pool_positions
UNION ALL SELECT 'financings', COUNT(*) FROM financings
UNION ALL SELECT 'risk_metrics', COUNT(*) FROM risk_metrics
UNION ALL SELECT 'compliance_metrics', COUNT(*) FROM compliance_metrics
UNION ALL SELECT 'impact_metrics', COUNT(*) FROM impact_metrics
UNION ALL SELECT 'whitelisted_wallets', COUNT(*) FROM whitelisted_wallets;
