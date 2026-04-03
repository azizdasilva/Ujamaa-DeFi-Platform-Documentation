
-- =============================================================================
-- COMPLETE DATABASE RESET - Drops ALL tables, types, sequences, functions
-- =============================================================================

-- Drop all tables dynamically
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS "' || r.tablename || '" CASCADE';
    END LOOP;
END $$;

-- Drop all custom types/enums dynamically
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT typname FROM pg_type WHERE typtype = 'e' AND typnamespace = 'public'::regnamespace) LOOP
        EXECUTE 'DROP TYPE IF EXISTS "' || r.typname || '" CASCADE';
    END LOOP;
END $$;

-- Drop all sequences
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT sequencename FROM pg_sequences WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS "' || r.sequencename || '" CASCADE';
    END LOOP;
END $$;

-- Drop all functions
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION') LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS "' || r.routine_name || '" CASCADE';
    END LOOP;
END $$;

-- =============================================================================
-- CREATE FRESH SCHEMA
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    wallet_address VARCHAR(42),
    role VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pools (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    family VARCHAR(100) NOT NULL,
    target_yield_min FLOAT NOT NULL,
    target_yield_max FLOAT NOT NULL,
    lockup_days INTEGER NOT NULL,
    total_value NUMERIC(26, 18) DEFAULT 0,
    apy FLOAT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS investor_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    company_name VARCHAR(255),
    jurisdiction VARCHAR(2) NOT NULL,
    kyc_status VARCHAR,
    kyb_status VARCHAR,
    accreditation_status VARCHAR,
    wallet_address VARCHAR(42),
    total_invested NUMERIC(26, 18) DEFAULT 0,
    ult_tokens NUMERIC(26, 18) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bank_accounts (
    account_id VARCHAR(50) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    escrow_balance NUMERIC(18, 2) DEFAULT 0 NOT NULL,
    available_balance NUMERIC(18, 2) DEFAULT 0 NOT NULL,
    locked_amount NUMERIC(18, 2) DEFAULT 0 NOT NULL,
    balance NUMERIC(18, 2) DEFAULT 0 NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR,
    bank_name VARCHAR(255) DEFAULT 'Mock Bank',
    account_number VARCHAR(50),
    iban VARCHAR(34),
    swift_code VARCHAR(11),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_transaction_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS whitelisted_wallets (
    id SERIAL PRIMARY KEY,
    investor_id INTEGER REFERENCES investor_profiles(id) ON DELETE CASCADE,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    label VARCHAR(100),
    jurisdiction VARCHAR(2) NOT NULL,
    jurisdiction_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    risk_score INTEGER,
    risk_level VARCHAR(20) DEFAULT 'unknown',
    sanctions_checked BOOLEAN DEFAULT FALSE,
    sanctions_checked_at TIMESTAMP,
    pep_checked BOOLEAN DEFAULT FALSE,
    pep_checked_at TIMESTAMP,
    first_transaction_at TIMESTAMP,
    last_transaction_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    investor_id INTEGER REFERENCES investor_profiles(id) ON DELETE CASCADE,
    document_type VARCHAR NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_hash VARCHAR(64),
    upload_status VARCHAR DEFAULT 'uploaded',
    verification_status VARCHAR,
    reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP,
    review_notes TEXT,
    submitted_at TIMESTAMP DEFAULT NOW(),
    deadline_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pool_positions (
    id SERIAL PRIMARY KEY,
    investor_id INTEGER REFERENCES investor_profiles(id) ON DELETE CASCADE,
    pool_id VARCHAR(50) REFERENCES pools(id) ON DELETE CASCADE,
    shares NUMERIC(26, 18) DEFAULT 0 NOT NULL,
    average_nav NUMERIC(26, 18),
    total_yield_earned NUMERIC(26, 18) DEFAULT 0,
    last_yield_distribution TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(investor_id, pool_id)
);

CREATE TABLE IF NOT EXISTS financings (
    id SERIAL PRIMARY KEY,
    pool_family VARCHAR(100) NOT NULL,
    pool_id VARCHAR(50) REFERENCES pools(id),
    asset_class VARCHAR NOT NULL,
    industrial VARCHAR(255) NOT NULL,
    industrial_id INTEGER REFERENCES investor_profiles(id),
    principal NUMERIC(18, 2) NOT NULL,
    interest_rate NUMERIC(5, 2) NOT NULL,
    duration_days INTEGER NOT NULL,
    start_date TIMESTAMP NOT NULL,
    maturity_date TIMESTAMP NOT NULL,
    amount_repaid NUMERIC(18, 2) DEFAULT 0,
    is_repaid BOOLEAN DEFAULT FALSE,
    is_defaulted BOOLEAN DEFAULT FALSE,
    status VARCHAR,
    description TEXT,
    collateral JSON,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risk_metrics (
    id SERIAL PRIMARY KEY,
    pool_id VARCHAR(50) REFERENCES pools(id),
    default_rate NUMERIC(5, 4) NOT NULL,
    concentration_risk NUMERIC(5, 4) NOT NULL,
    credit_score INTEGER NOT NULL,
    credit_rating VARCHAR(10) NOT NULL,
    collateralization_ratio NUMERIC(5, 2) NOT NULL,
    risk_score INTEGER NOT NULL,
    risk_grade VARCHAR NOT NULL,
    is_healthy BOOLEAN DEFAULT TRUE,
    calculation_method VARCHAR(50) DEFAULT 'standard',
    data_points INTEGER,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    calculated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compliance_metrics (
    id SERIAL PRIMARY KEY,
    pool_id VARCHAR(50) REFERENCES pools(id),
    kyc_coverage NUMERIC(5, 2) NOT NULL,
    whitelisted_wallets INTEGER NOT NULL,
    jurisdiction_count INTEGER NOT NULL,
    jurisdiction_distribution JSON,
    compliance_score INTEGER NOT NULL,
    is_compliant BOOLEAN DEFAULT TRUE,
    pending_reviews INTEGER DEFAULT 0,
    overdue_reviews INTEGER DEFAULT 0,
    sanctions_hits INTEGER DEFAULT 0,
    pep_exposures INTEGER DEFAULT 0,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    calculated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS impact_metrics (
    id SERIAL PRIMARY KEY,
    pool_id VARCHAR(50) REFERENCES pools(id),
    avg_capacity_increase NUMERIC(5, 2) NOT NULL,
    value_add_ratio NUMERIC(5, 2) NOT NULL,
    jobs_per_million NUMERIC(10, 2) NOT NULL,
    total_direct_jobs INTEGER NOT NULL,
    total_indirect_jobs INTEGER NOT NULL,
    women_employment_rate NUMERIC(5, 2) NOT NULL,
    youth_employment_rate NUMERIC(5, 2) NOT NULL,
    co2_reduction_tons NUMERIC(12, 2) NOT NULL,
    renewable_energy_kwh NUMERIC(15, 2) NOT NULL,
    primary_sdg VARCHAR(50),
    sdg_coverage JSON,
    impact_score INTEGER NOT NULL,
    impact_grade VARCHAR(10) NOT NULL,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    calculated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compliance_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    activity_type VARCHAR(100) NOT NULL,
    target_id INTEGER,
    target_type VARCHAR(50),
    details JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Now insert data
INSERT INTO users (id, email, password_hash, wallet_address, role, is_active, created_at, updated_at) VALUES (1, 'institutional@ujamaa-defi.com', NULL, '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1', 'INSTITUTIONAL_INVESTOR', 1, '2026-04-02 16:07:22.663221', '2026-04-02 16:07:22.663228') ON CONFLICT DO NOTHING;
INSERT INTO users (id, email, password_hash, wallet_address, role, is_active, created_at, updated_at) VALUES (2, 'retail@ujamaa-defi.com', NULL, '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', 'RETAIL_INVESTOR', 1, '2026-04-02 16:07:22.663230', '2026-04-02 16:07:22.663232') ON CONFLICT DO NOTHING;
INSERT INTO users (id, email, password_hash, wallet_address, role, is_active, created_at, updated_at) VALUES (3, 'operator@ujamaa-defi.com', NULL, '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', 'INDUSTRIAL_OPERATOR', 1, '2026-04-02 16:07:22.663233', '2026-04-02 16:07:22.663235') ON CONFLICT DO NOTHING;
INSERT INTO users (id, email, password_hash, wallet_address, role, is_active, created_at, updated_at) VALUES (4, 'compliance@ujamaa-defi.com', NULL, '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', 'COMPLIANCE_OFFICER', 1, '2026-04-02 16:07:22.663236', '2026-04-02 16:07:22.663237') ON CONFLICT DO NOTHING;
INSERT INTO users (id, email, password_hash, wallet_address, role, is_active, created_at, updated_at) VALUES (5, 'admin@ujamaa-defi.com', NULL, '0x2546BcD3c84621e976D8185a91A922aE77ECEc30', 'ADMIN', 1, '2026-04-02 16:07:22.663239', '2026-04-02 16:07:22.663240') ON CONFLICT DO NOTHING;
INSERT INTO users (id, email, password_hash, wallet_address, role, is_active, created_at, updated_at) VALUES (6, 'regulator@ujamaa-defi.com', NULL, '0x976EA74026E726554dB657fA54763abd0C3a0aa9', 'REGULATOR', 1, '2026-04-02 16:07:22.663242', '2026-04-02 16:07:22.663243') ON CONFLICT DO NOTHING;
INSERT INTO users (id, email, password_hash, wallet_address, role, is_active, created_at, updated_at) VALUES (7, 'john.doe@email.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1190', 'RETAIL_INVESTOR', 1, '2026-04-02 20:49:59.664961', '2026-04-02 20:49:59.665133') ON CONFLICT DO NOTHING;
INSERT INTO users (id, email, password_hash, wallet_address, role, is_active, created_at, updated_at) VALUES (8, 'alice.retail@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', '0x1234567890123456789012345678901234567891', 'RETAIL_INVESTOR', 1, '2026-04-02 20:49:59.670277', '2026-04-02 20:49:59.670281') ON CONFLICT DO NOTHING;
INSERT INTO users (id, email, password_hash, wallet_address, role, is_active, created_at, updated_at) VALUES (9, 'bob.institutional@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', '0x2345678901234567890123456789012345678902', 'INSTITUTIONAL_INVESTOR', 1, '2026-04-02 20:49:59.671134', '2026-04-02 20:49:59.671136') ON CONFLICT DO NOTHING;
INSERT INTO users (id, email, password_hash, wallet_address, role, is_active, created_at, updated_at) VALUES (10, 'charlie.operator@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', '0x3456789012345678901234567890123456789013', 'INDUSTRIAL_OPERATOR', 1, '2026-04-02 20:49:59.671915', '2026-04-02 20:49:59.671917') ON CONFLICT DO NOTHING;

-- Data for pools
INSERT INTO pools (id, name, family, target_yield_min, target_yield_max, lockup_days, total_value, apy, is_active, created_at, updated_at) VALUES ('POOL_INDUSTRIE', 'Pool Industrie', 'industrie', 10.0, 12.0, 365, 15000000, 11.0, 1, '2026-04-02 16:07:22.686838', '2026-04-02 16:07:22.686842') ON CONFLICT DO NOTHING;
INSERT INTO pools (id, name, family, target_yield_min, target_yield_max, lockup_days, total_value, apy, is_active, created_at, updated_at) VALUES ('POOL_AGRICULTURE', 'Pool Agriculture', 'agriculture', 12.0, 15.0, 180, 12000000, 13.2, 1, '2026-04-02 16:07:22.686844', '2026-04-02 16:07:22.686846') ON CONFLICT DO NOTHING;
INSERT INTO pools (id, name, family, target_yield_min, target_yield_max, lockup_days, total_value, apy, is_active, created_at, updated_at) VALUES ('POOL_TRADE_FINANCE', 'Pool Trade Finance', 'trade_finance', 8.0, 10.0, 90, 10000000, 9.2, 1, '2026-04-02 16:07:22.686847', '2026-04-02 16:07:22.686848') ON CONFLICT DO NOTHING;
INSERT INTO pools (id, name, family, target_yield_min, target_yield_max, lockup_days, total_value, apy, is_active, created_at, updated_at) VALUES ('POOL_RENEWABLE_ENERGY', 'Pool Renewable Energy', 'renewable_energy', 9.0, 11.0, 730, 8000000, 10.1, 1, '2026-04-02 16:07:22.686850', '2026-04-02 16:07:22.686851') ON CONFLICT DO NOTHING;
INSERT INTO pools (id, name, family, target_yield_min, target_yield_max, lockup_days, total_value, apy, is_active, created_at, updated_at) VALUES ('POOL_REAL_ESTATE', 'Pool Real Estate', 'real_estate', 8.0, 12.0, 1095, 5000000, 9.8, 1, '2026-04-02 16:07:22.686853', '2026-04-02 16:07:22.686854') ON CONFLICT DO NOTHING;

-- Data for investor_profiles
INSERT INTO investor_profiles (id, user_id, full_name, company_name, jurisdiction, kyc_status, kyb_status, accreditation_status, wallet_address, total_invested, ulp_tokens, created_at, updated_at, ult_tokens) VALUES (1, 1, 'Logic Capital Ltd', NULL, 'MU', 'APPROVED', 'APPROVED', 'PENDING', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1', 500000, 495000, '2026-04-02 16:07:22.670198', '2026-04-02 16:07:22.670203', 0) ON CONFLICT DO NOTHING;
INSERT INTO investor_profiles (id, user_id, full_name, company_name, jurisdiction, kyc_status, kyb_status, accreditation_status, wallet_address, total_invested, ulp_tokens, created_at, updated_at, ult_tokens) VALUES (2, 2, 'John Doe', NULL, 'KE', 'APPROVED', 'PENDING', 'PENDING', '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', 25000, 24750, '2026-04-02 16:07:22.671867', '2026-04-02 16:07:22.671872', 0) ON CONFLICT DO NOTHING;
INSERT INTO investor_profiles (id, user_id, full_name, company_name, jurisdiction, kyc_status, kyb_status, accreditation_status, wallet_address, total_invested, ulp_tokens, created_at, updated_at, ult_tokens) VALUES (3, 3, NULL, 'Green Cotton SA', 'BJ', 'APPROVED', 'APPROVED', 'PENDING', '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', 0, 0, '2026-04-02 16:07:22.672469', '2026-04-02 16:07:22.672472', 0) ON CONFLICT DO NOTHING;
INSERT INTO investor_profiles (id, user_id, full_name, company_name, jurisdiction, kyc_status, kyb_status, accreditation_status, wallet_address, total_invested, ulp_tokens, created_at, updated_at, ult_tokens) VALUES (4, 7, 'John Doe', NULL, 'KE', 'APPROVED', 'APPROVED', 'APPROVED', '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1190', NULL, NULL, '2026-04-02 20:49:59.668109', '2026-04-02 20:49:59.668183', 0) ON CONFLICT DO NOTHING;
INSERT INTO investor_profiles (id, user_id, full_name, company_name, jurisdiction, kyc_status, kyb_status, accreditation_status, wallet_address, total_invested, ulp_tokens, created_at, updated_at, ult_tokens) VALUES (5, 8, 'Alice Retail Investor', NULL, 'MU', 'APPROVED', 'APPROVED', 'APPROVED', '0x1234567890123456789012345678901234567891', NULL, NULL, '2026-04-02 20:49:59.670511', '2026-04-02 20:49:59.670514', 0) ON CONFLICT DO NOTHING;
INSERT INTO investor_profiles (id, user_id, full_name, company_name, jurisdiction, kyc_status, kyb_status, accreditation_status, wallet_address, total_invested, ulp_tokens, created_at, updated_at, ult_tokens) VALUES (6, 9, 'Bob Institutional Investor', NULL, 'GB', 'APPROVED', 'APPROVED', 'APPROVED', '0x2345678901234567890123456789012345678902', NULL, NULL, '2026-04-02 20:49:59.671343', '2026-04-02 20:49:59.671346', 0) ON CONFLICT DO NOTHING;
INSERT INTO investor_profiles (id, user_id, full_name, company_name, jurisdiction, kyc_status, kyb_status, accreditation_status, wallet_address, total_invested, ulp_tokens, created_at, updated_at, ult_tokens) VALUES (7, 10, 'Charlie Industrial Operator', NULL, 'BJ', 'APPROVED', 'APPROVED', 'APPROVED', '0x3456789012345678901234567890123456789013', NULL, NULL, '2026-04-02 20:49:59.672125', '2026-04-02 20:49:59.672128', 0) ON CONFLICT DO NOTHING;

-- Data for compliance_activities
INSERT INTO compliance_activities (id, user_id, activity_type, target_id, target_type, details, ip_address, created_at) VALUES (1, 4, 'DOCUMENT_APPROVE', 2, 'DOCUMENT', '{"action": "approve", "notes": "", "document_type": "kyc_address", "investor_id": 2, "is_overdue": false}', NULL, '2026-04-02 17:40:36.470235') ON CONFLICT DO NOTHING;
INSERT INTO compliance_activities (id, user_id, activity_type, target_id, target_type, details, ip_address, created_at) VALUES (2, 4, 'DOCUMENT_APPROVE', 1, 'DOCUMENT', '{"action": "approve", "notes": "Test from curl", "document_type": "kyc_id", "investor_id": 2, "is_overdue": false}', NULL, '2026-04-02 17:45:26.802759') ON CONFLICT DO NOTHING;

-- Data for risk_metrics
INSERT INTO risk_metrics (id, pool_id, default_rate, concentration_risk, credit_score, credit_rating, collateralization_ratio, risk_score, risk_grade, is_healthy, calculation_method, data_points, period_start, period_end, calculated_at) VALUES (1, 'POOL_INDUSTRIE', 0.015, 0.12, 720, 'BBB+', 1.35, 75, 'BBB', 1, 'standard', NULL, '2026-03-03 16:07:22.676460', '2026-04-02 16:07:22.676460', '2026-04-02 16:07:22.701778') ON CONFLICT DO NOTHING;
INSERT INTO risk_metrics (id, pool_id, default_rate, concentration_risk, credit_score, credit_rating, collateralization_ratio, risk_score, risk_grade, is_healthy, calculation_method, data_points, period_start, period_end, calculated_at) VALUES (2, 'POOL_AGRICULTURE', 0.022, 0.18, 680, 'BB+', 1.25, 68, 'BB', 1, 'standard', NULL, '2026-03-03 16:07:22.676460', '2026-04-02 16:07:22.676460', '2026-04-02 16:07:22.701783') ON CONFLICT DO NOTHING;
INSERT INTO risk_metrics (id, pool_id, default_rate, concentration_risk, credit_score, credit_rating, collateralization_ratio, risk_score, risk_grade, is_healthy, calculation_method, data_points, period_start, period_end, calculated_at) VALUES (3, 'POOL_TRADE_FINANCE', 0.008, 0.08, 760, 'A-', 1.45, 82, 'A', 1, 'standard', NULL, '2026-03-03 16:07:22.676460', '2026-04-02 16:07:22.676460', '2026-04-02 16:07:22.701785') ON CONFLICT DO NOTHING;

-- Data for compliance_metrics
INSERT INTO compliance_metrics (id, pool_id, kyc_coverage, whitelisted_wallets, jurisdiction_count, jurisdiction_distribution, compliance_score, is_compliant, pending_reviews, overdue_reviews, sanctions_hits, pep_exposures, period_start, period_end, calculated_at) VALUES (1, 'POOL_INDUSTRIE', 100, 25, 8, '{"MU": 5, "KE": 8, "NG": 4, "ZA": 3, "BJ": 3, "CI": 2}', 95, 1, 2, 0, 0, 1, '2026-03-03 16:07:22.676460', '2026-04-02 16:07:22.676460', '2026-04-02 16:07:22.691724') ON CONFLICT DO NOTHING;
INSERT INTO compliance_metrics (id, pool_id, kyc_coverage, whitelisted_wallets, jurisdiction_count, jurisdiction_distribution, compliance_score, is_compliant, pending_reviews, overdue_reviews, sanctions_hits, pep_exposures, period_start, period_end, calculated_at) VALUES (2, 'POOL_AGRICULTURE', 100, 18, 6, '{"CI": 6, "SN": 4, "BJ": 3, "TG": 2, "KE": 2, "GH": 1}', 92, 1, 3, 0, 0, 0, '2026-03-03 16:07:22.676460', '2026-04-02 16:07:22.676460', '2026-04-02 16:07:22.691728') ON CONFLICT DO NOTHING;
INSERT INTO compliance_metrics (id, pool_id, kyc_coverage, whitelisted_wallets, jurisdiction_count, jurisdiction_distribution, compliance_score, is_compliant, pending_reviews, overdue_reviews, sanctions_hits, pep_exposures, period_start, period_end, calculated_at) VALUES (3, 'POOL_TRADE_FINANCE', 100, 30, 10, '{"NG": 8, "KE": 6, "ZA": 5, "MU": 4, "GH": 3, "EU": 2, "UK": 2}', 98, 1, 1, 0, 0, 2, '2026-03-03 16:07:22.676460', '2026-04-02 16:07:22.676460', '2026-04-02 16:07:22.691730') ON CONFLICT DO NOTHING;

-- Data for impact_metrics
INSERT INTO impact_metrics (id, pool_id, avg_capacity_increase, value_add_ratio, jobs_per_million, total_direct_jobs, total_indirect_jobs, women_employment_rate, youth_employment_rate, co2_reduction_tons, renewable_energy_kwh, primary_sdg, sdg_coverage, impact_score, impact_grade, period_start, period_end, calculated_at) VALUES (1, 'POOL_INDUSTRIE', 28.5, 2.8, 85, 425, 1275, 42.5, 38.2, 15000, 2500000, 'SDG 9: Industry, Innovation and Infrastructure', '{"SDG 9": 1.0, "SDG 8": 0.8, "SDG 5": 0.6}', 78, 'B+', '2026-01-02 16:07:22.676460', '2026-04-02 16:07:22.676460', '2026-04-02 16:07:22.697170') ON CONFLICT DO NOTHING;
INSERT INTO impact_metrics (id, pool_id, avg_capacity_increase, value_add_ratio, jobs_per_million, total_direct_jobs, total_indirect_jobs, women_employment_rate, youth_employment_rate, co2_reduction_tons, renewable_energy_kwh, primary_sdg, sdg_coverage, impact_score, impact_grade, period_start, period_end, calculated_at) VALUES (2, 'POOL_AGRICULTURE', 35.2, 3.2, 120, 360, 1080, 55.8, 45.5, 8000, 1200000, 'SDG 2: Zero Hunger', '{"SDG 2": 1.0, "SDG 8": 0.9, "SDG 5": 0.7, "SDG 13": 0.5}', 82, 'A-', '2026-01-02 16:07:22.676460', '2026-04-02 16:07:22.676460', '2026-04-02 16:07:22.697176') ON CONFLICT DO NOTHING;
INSERT INTO impact_metrics (id, pool_id, avg_capacity_increase, value_add_ratio, jobs_per_million, total_direct_jobs, total_indirect_jobs, women_employment_rate, youth_employment_rate, co2_reduction_tons, renewable_energy_kwh, primary_sdg, sdg_coverage, impact_score, impact_grade, period_start, period_end, calculated_at) VALUES (3, 'POOL_TRADE_FINANCE', 18.5, 2.2, 65, 195, 585, 38.5, 42, 3000, 500000, 'SDG 8: Decent Work and Economic Growth', '{"SDG 8": 1.0, "SDG 9": 0.7, "SDG 17": 0.8}', 72, 'B', '2026-01-02 16:07:22.676460', '2026-04-02 16:07:22.676460', '2026-04-02 16:07:22.697178') ON CONFLICT DO NOTHING;

-- Data for documents
INSERT INTO documents (id, investor_id, document_type, document_name, file_path, file_hash, upload_status, verification_status, reviewed_by, reviewed_at, review_notes, submitted_at, deadline_at, created_at) VALUES (1, 2, 'KYC_ID', 'National ID', '/uploads/kyc/john_doe_id.pdf', '0x088c8fa792a7c7762129b8cc7c8fd49e311687891a68b310f9df640bf7cd70c0', 'uploaded', 'APPROVED', 4, '2026-04-02 17:45:26.799218', 'Test from curl', '2026-04-02 16:07:22.675178', '2026-04-03 16:07:22.675178', '2026-04-02 16:07:22.684909') ON CONFLICT DO NOTHING;
INSERT INTO documents (id, investor_id, document_type, document_name, file_path, file_hash, upload_status, verification_status, reviewed_by, reviewed_at, review_notes, submitted_at, deadline_at, created_at) VALUES (2, 2, 'KYC_ADDRESS', 'Proof of Address', '/uploads/kyc/john_doe_address.pdf', '0x646b8cabcccf28b83f98e00aad63c5fd8e03891880290eeb1264eccb9dcd4eaf', 'uploaded', 'APPROVED', 4, '2026-04-02 17:40:36.465068', '', '2026-04-02 04:07:22.675178', '2026-04-03 04:07:22.675178', '2026-04-02 16:07:22.684913') ON CONFLICT DO NOTHING;
INSERT INTO documents (id, investor_id, document_type, document_name, file_path, file_hash, upload_status, verification_status, reviewed_by, reviewed_at, review_notes, submitted_at, deadline_at, created_at) VALUES (3, 1, 'KYB_INCORPORATION', 'Certificate of Incorporation', '/uploads/kyb/logic_capital_incorporation.pdf', '0x8c109eef75cf25155aa9c743afd6032f7d9befcb570f3db26f68a4e4802519b2', 'uploaded', 'PENDING', NULL, NULL, NULL, '2026-04-02 10:07:22.675178', '2026-04-03 10:07:22.675178', '2026-04-02 16:07:22.684915') ON CONFLICT DO NOTHING;

-- Data for pool_positions
INSERT INTO pool_positions (id, investor_id, pool_id, shares, average_nav, total_yield_earned, last_yield_distribution, is_active, created_at, updated_at) VALUES (1, 1, 'POOL_INDUSTRIE', 500000, 1, 55000, NULL, 1, '2026-04-02 16:07:22.699259', '2026-04-02 16:07:22.699263') ON CONFLICT DO NOTHING;
INSERT INTO pool_positions (id, investor_id, pool_id, shares, average_nav, total_yield_earned, last_yield_distribution, is_active, created_at, updated_at) VALUES (2, 1, 'POOL_AGRICULTURE', 300000, 1, 39600, NULL, 1, '2026-04-02 16:07:22.699265', '2026-04-02 16:07:22.699266') ON CONFLICT DO NOTHING;
INSERT INTO pool_positions (id, investor_id, pool_id, shares, average_nav, total_yield_earned, last_yield_distribution, is_active, created_at, updated_at) VALUES (3, 2, 'POOL_TRADE_FINANCE', 25000, 1, 2300, NULL, 1, '2026-04-02 16:07:22.699268', '2026-04-02 16:07:22.699269') ON CONFLICT DO NOTHING;

-- Data for financings
INSERT INTO financings (id, pool_family, pool_id, asset_class, industrial, industrial_id, principal, interest_rate, duration_days, start_date, maturity_date, amount_repaid, is_repaid, is_defaulted, status, description, collateral, created_at, updated_at) VALUES (1, 'industrie', 'POOL_INDUSTRIE', 'EQUIPMENT', 'GDIZ Partner SA', 3, 5000000, 12, 365, '2025-10-04 16:07:22.676460', '2026-10-04 16:07:22.676460', 2500000, 0, 0, 'REPAYING', 'Equipment financing for textile factory expansion', NULL, '2026-04-02 16:07:22.694812', '2026-04-02 16:07:22.694817') ON CONFLICT DO NOTHING;
INSERT INTO financings (id, pool_family, pool_id, asset_class, industrial, industrial_id, principal, interest_rate, duration_days, start_date, maturity_date, amount_repaid, is_repaid, is_defaulted, status, description, collateral, created_at, updated_at) VALUES (2, 'agriculture', 'POOL_AGRICULTURE', 'INVENTORY', 'Café de Côte d''Ivoire', NULL, 3000000, 13.5, 180, '2026-01-02 16:07:22.676460', '2026-07-01 16:07:22.676460', 1500000, 0, 0, 'REPAYING', 'Coffee harvest inventory financing', NULL, '2026-04-02 16:07:22.694819', '2026-04-02 16:07:22.694820') ON CONFLICT DO NOTHING;
INSERT INTO financings (id, pool_family, pool_id, asset_class, industrial, industrial_id, principal, interest_rate, duration_days, start_date, maturity_date, amount_repaid, is_repaid, is_defaulted, status, description, collateral, created_at, updated_at) VALUES (3, 'trade_finance', 'POOL_TRADE_FINANCE', 'RECEIVABLES', 'West Africa Trade Ltd', NULL, 2000000, 9.5, 90, '2026-02-16 16:07:22.676460', '2026-05-17 16:07:22.676460', 1000000, 0, 0, 'REPAYING', 'Invoice tokenization for export receivables', NULL, '2026-04-02 16:07:22.694822', '2026-04-02 16:07:22.694823') ON CONFLICT DO NOTHING;

-- Data for bank_accounts
INSERT INTO bank_accounts (account_id, user_id, balance, currency, status, bank_name, account_number, iban, swift_code, created_at, updated_at, last_transaction_at, escrow_balance, available_balance, locked_amount) VALUES ('ESC-B7ABED3D', 1, 500000, 'EUR', 'ACTIVE', 'BIIC Bank', 'BJ3743882502', NULL, 'BIICBJBJ', '2026-04-02 16:07:22.682806', '2026-04-02 20:54:15.625773', NULL, 10000, 10000, 0) ON CONFLICT DO NOTHING;
INSERT INTO bank_accounts (account_id, user_id, balance, currency, status, bank_name, account_number, iban, swift_code, created_at, updated_at, last_transaction_at, escrow_balance, available_balance, locked_amount) VALUES ('ESC-B56EFCE6', 2, 0, 'EUR', 'ACTIVE', 'BIIC Bank', 'KE3396271357', NULL, 'BIICKENA', '2026-04-02 16:07:22.682813', '2026-04-02 20:54:15.631126', NULL, 50000, 50000, 0) ON CONFLICT DO NOTHING;
INSERT INTO bank_accounts (account_id, user_id, balance, currency, status, bank_name, account_number, iban, swift_code, created_at, updated_at, last_transaction_at, escrow_balance, available_balance, locked_amount) VALUES ('ESC-007-2026', 7, 0, 'EUR', 'ACTIVE', 'BIIC Bank', 'KE00000007', NULL, NULL, '2026-04-02 20:49:59.669165', '2026-04-02 20:54:15.632188', NULL, 2000000, 2000000, 0) ON CONFLICT DO NOTHING;
INSERT INTO bank_accounts (account_id, user_id, balance, currency, status, bank_name, account_number, iban, swift_code, created_at, updated_at, last_transaction_at, escrow_balance, available_balance, locked_amount) VALUES ('ESC-008-2026', 8, 0, 'EUR', 'ACTIVE', 'BIIC Bank', 'MU00000008', NULL, NULL, '2026-04-02 20:49:59.670724', '2026-04-02 20:54:15.632718', NULL, 3000000, 3000000, 0) ON CONFLICT DO NOTHING;
INSERT INTO bank_accounts (account_id, user_id, balance, currency, status, bank_name, account_number, iban, swift_code, created_at, updated_at, last_transaction_at, escrow_balance, available_balance, locked_amount) VALUES ('ESC-009-2026', 9, 0, 'EUR', 'ACTIVE', 'BIIC Bank', 'GB00000009', NULL, NULL, '2026-04-02 20:49:59.671546', '2026-04-02 20:54:15.633279', NULL, 5000000, 5000000, 0) ON CONFLICT DO NOTHING;
INSERT INTO bank_accounts (account_id, user_id, balance, currency, status, bank_name, account_number, iban, swift_code, created_at, updated_at, last_transaction_at, escrow_balance, available_balance, locked_amount) VALUES ('ESC-010-2026', 10, 0, 'EUR', 'ACTIVE', 'BIIC Bank', 'BJ00000010', NULL, NULL, '2026-04-02 20:49:59.672330', '2026-04-02 20:54:15.633799', NULL, 10000000, 10000000, 0) ON CONFLICT DO NOTHING;

-- Data for whitelisted_wallets
INSERT INTO whitelisted_wallets (id, investor_id, wallet_address, label, jurisdiction, jurisdiction_verified, is_approved, approved_by, approved_at, risk_score, risk_level, sanctions_checked, sanctions_checked_at, pep_checked, pep_checked_at, first_transaction_at, last_transaction_at, created_at, updated_at) VALUES (1, 1, '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1', 'Main Wallet', 'MU', 1, 1, NULL, NULL, 15, 'low', 1, '2026-03-03 16:07:22.676460', 1, '2026-03-03 16:07:22.676460', NULL, NULL, '2026-04-02 16:07:22.688971', '2026-04-02 16:07:22.688975') ON CONFLICT DO NOTHING;
INSERT INTO whitelisted_wallets (id, investor_id, wallet_address, label, jurisdiction, jurisdiction_verified, is_approved, approved_by, approved_at, risk_score, risk_level, sanctions_checked, sanctions_checked_at, pep_checked, pep_checked_at, first_transaction_at, last_transaction_at, created_at, updated_at) VALUES (2, 2, '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', 'Main Wallet', 'KE', 1, 1, NULL, NULL, 20, 'low', 1, '2026-03-18 16:07:22.676460', 1, '2026-03-18 16:07:22.676460', NULL, NULL, '2026-04-02 16:07:22.688977', '2026-04-02 16:07:22.688979') ON CONFLICT DO NOTHING;
INSERT INTO whitelisted_wallets (id, investor_id, wallet_address, label, jurisdiction, jurisdiction_verified, is_approved, approved_by, approved_at, risk_score, risk_level, sanctions_checked, sanctions_checked_at, pep_checked, pep_checked_at, first_transaction_at, last_transaction_at, created_at, updated_at) VALUES (3, 3, '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', 'Business Wallet', 'BJ', 1, 1, NULL, NULL, 25, 'low', 1, '2026-03-13 16:07:22.676460', 1, '2026-03-13 16:07:22.676460', NULL, NULL, '2026-04-02 16:07:22.688980', '2026-04-02 16:07:22.688981') ON CONFLICT DO NOTHING;
