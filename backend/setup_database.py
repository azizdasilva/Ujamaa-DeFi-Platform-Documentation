"""
Database Setup Script - Ujamaa DeFi Platform
Creates SQLite database with all tables and seed data

Usage:
    python setup_database.py
"""

import os
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import create_engine
from config.database import get_database_url, DATABASE_TYPE
from config.models import Base, init_db
from datetime import datetime, timedelta

def setup_database():
    """Create database and all tables"""
    print("=" * 70)
    print("🗄️  UJAMAA DEFI PLATFORM - DATABASE SETUP")
    print("=" * 70)
    
    # Get database URL
    db_url = get_database_url()
    print(f"\n📊 Database Type: {DATABASE_TYPE}")
    print(f"📍 Database URL: {db_url}")
    
    # Create engine
    print("\n⚙️  Creating database engine...")
    engine = create_engine(
        db_url,
        echo=False,  # Set to True to see SQL queries
        pool_pre_ping=True,
    )
    
    # Create all tables
    print("\n📋 Creating tables...")
    try:
        Base.metadata.create_all(engine)
        print("✅ Tables created successfully!")
        print("\n   Tables created:")
        print("   - users")
        print("   - investor_profiles")
        print("   - pools")
        print("   - investments")
        print("   - pool_positions (NEW)")
        print("   - financings (NEW)")
        print("   - documents (KYC/KYB)")
        print("   - yield_statements (NEW)")
        print("   - bank_accounts (NEW)")
        print("   - bank_transactions (NEW)")
        print("   - gdiz_financings (NEW)")
        print("   - risk_metrics (NEW)")
        print("   - compliance_metrics (NEW)")
        print("   - impact_metrics (NEW)")
        print("   - whitelisted_wallets (NEW)")
        print("   - ult_transactions")
        print("   - transactions")
        print("   - compliance_activities")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False
    
    # Seed initial data
    print("\n🌱 Seeding initial data...")
    seed_data(engine)
    
    print("\n" + "=" * 70)
    print("✅ DATABASE SETUP COMPLETE!")
    print("=" * 70)
    
    # Show database file location for SQLite
    if DATABASE_TYPE == 'sqlite':
        db_path = db_url.replace('sqlite:///', '')
        print(f"\n📁 Database file: {db_path}")
        print(f"   Size: {os.path.getsize(db_path) / 1024:.2f} KB")
    
    print("\n🎯 Next steps:")
    print("   1. Start backend: python main.py")
    print("   2. Test API: http://localhost:8000/docs")
    print("   3. Frontend will now use database instead of mock data")
    
    return True


def seed_data(engine):
    """Seed database with initial demo data"""
    from sqlalchemy.orm import sessionmaker
    from config.models import (
        User, InvestorProfile, Pool, Document, Investment,
        ComplianceStatusEnum, InvestorRoleEnum, DocumentTypeEnum,
        PoolPosition, Financing, AssetClassEnum, FinancingStatusEnum,
        BankAccount, AccountStatusEnum, WhitelistedWallet,
        RiskMetrics, ComplianceMetrics, ImpactMetrics, RiskGradeEnum
    )
    from datetime import timedelta
    import uuid

    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Check if data already exists
        if session.query(User).count() > 0:
            print("⚠️  Database already has data. Skipping seed.")
            session.close()
            return
        
        print("   Creating demo users...")
        
        # Create demo users for each role
        demo_users = [
            {
                'email': 'institutional@ujamaa-defi.com',
                'role': InvestorRoleEnum.INSTITUTIONAL_INVESTOR,
                'wallet_address': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
            },
            {
                'email': 'retail@ujamaa-defi.com',
                'role': InvestorRoleEnum.RETAIL_INVESTOR,
                'wallet_address': '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
            },
            {
                'email': 'operator@ujamaa-defi.com',
                'role': InvestorRoleEnum.INDUSTRIAL_OPERATOR,
                'wallet_address': '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
            },
            {
                'email': 'compliance@ujamaa-defi.com',
                'role': InvestorRoleEnum.COMPLIANCE_OFFICER,
                'wallet_address': '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
            },
            {
                'email': 'admin@ujamaa-defi.com',
                'role': InvestorRoleEnum.ADMIN,
                'wallet_address': '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
            },
            {
                'email': 'regulator@ujamaa-defi.com',
                'role': InvestorRoleEnum.REGULATOR,
                'wallet_address': '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
            },
        ]
        
        users = []
        for user_data in demo_users:
            user = User(**user_data)
            session.add(user)
            users.append(user)
        
        session.flush()  # Get user IDs
        
        print(f"   ✓ Created {len(users)} users")
        print("   Creating investor profiles...")
        
        # Create investor profiles
        profiles_data = [
            {
                'user_id': users[0].id,
                'full_name': 'Logic Capital Ltd',
                'jurisdiction': 'MU',
                'kyc_status': ComplianceStatusEnum.APPROVED,
                'kyb_status': ComplianceStatusEnum.APPROVED,
                'wallet_address': users[0].wallet_address,
                'total_invested': 500000,
                'ult_tokens': 495000,
            },
            {
                'user_id': users[1].id,
                'full_name': 'John Doe',
                'jurisdiction': 'KE',
                'kyc_status': ComplianceStatusEnum.APPROVED,
                'wallet_address': users[1].wallet_address,
                'total_invested': 25000,
                'ult_tokens': 24750,
            },
            {
                'user_id': users[2].id,
                'company_name': 'Green Cotton SA',
                'jurisdiction': 'BJ',
                'kyc_status': ComplianceStatusEnum.APPROVED,
                'kyb_status': ComplianceStatusEnum.APPROVED,
                'wallet_address': users[2].wallet_address,
            },
        ]
        
        profiles = []
        for profile_data in profiles_data:
            profile = InvestorProfile(**profile_data)
            session.add(profile)
            profiles.append(profile)
        
        session.flush()
        print(f"   ✓ Created {len(profiles)} investor profiles")
        print("   Creating investment pools...")
        
        # Create pools
        pools_data = [
            {
                'id': 'POOL_INDUSTRIE',
                'name': 'Pool Industrie',
                'family': 'industrie',
                'target_yield_min': 10.0,
                'target_yield_max': 12.0,
                'lockup_days': 365,
                'total_value': 15000000,
                'apy': 11.0,
            },
            {
                'id': 'POOL_AGRICULTURE',
                'name': 'Pool Agriculture',
                'family': 'agriculture',
                'target_yield_min': 12.0,
                'target_yield_max': 15.0,
                'lockup_days': 180,
                'total_value': 12000000,
                'apy': 13.2,
            },
            {
                'id': 'POOL_TRADE_FINANCE',
                'name': 'Pool Trade Finance',
                'family': 'trade_finance',
                'target_yield_min': 8.0,
                'target_yield_max': 10.0,
                'lockup_days': 90,
                'total_value': 10000000,
                'apy': 9.2,
            },
            {
                'id': 'POOL_RENEWABLE_ENERGY',
                'name': 'Pool Renewable Energy',
                'family': 'renewable_energy',
                'target_yield_min': 9.0,
                'target_yield_max': 11.0,
                'lockup_days': 730,
                'total_value': 8000000,
                'apy': 10.1,
            },
            {
                'id': 'POOL_REAL_ESTATE',
                'name': 'Pool Real Estate',
                'family': 'real_estate',
                'target_yield_min': 8.0,
                'target_yield_max': 12.0,
                'lockup_days': 1095,
                'total_value': 5000000,
                'apy': 9.8,
            },
        ]
        
        for pool_data in pools_data:
            pool = Pool(**pool_data)
            session.add(pool)
        
        print(f"   ✓ Created {len(pools_data)} pools")
        print("   Creating sample KYC/KYB documents...")
        
        # Create sample documents with 24h deadlines
        now = datetime.utcnow()
        documents_data = [
            {
                'investor_id': profiles[1].id,
                'document_type': DocumentTypeEnum.KYC_ID,
                'document_name': 'National ID',
                'file_path': '/uploads/kyc/john_doe_id.pdf',
                'file_hash': '0x' + os.urandom(32).hex(),
                'verification_status': ComplianceStatusEnum.PENDING,
                'submitted_at': now,
                'deadline_at': now + timedelta(hours=24),
            },
            {
                'investor_id': profiles[1].id,
                'document_type': DocumentTypeEnum.KYC_ADDRESS,
                'document_name': 'Proof of Address',
                'file_path': '/uploads/kyc/john_doe_address.pdf',
                'file_hash': '0x' + os.urandom(32).hex(),
                'verification_status': ComplianceStatusEnum.PENDING,
                'submitted_at': now - timedelta(hours=12),
                'deadline_at': now + timedelta(hours=12),
            },
            {
                'investor_id': profiles[0].id,
                'document_type': DocumentTypeEnum.KYB_INCORPORATION,
                'document_name': 'Certificate of Incorporation',
                'file_path': '/uploads/kyb/logic_capital_incorporation.pdf',
                'file_hash': '0x' + os.urandom(32).hex(),
                'verification_status': ComplianceStatusEnum.PENDING,
                'submitted_at': now - timedelta(hours=6),
                'deadline_at': now + timedelta(hours=18),
            },
        ]
        
        for doc_data in documents_data:
            doc = Document(**doc_data)
            session.add(doc)

        print(f"   ✓ Created {len(documents_data)} sample documents")
        print("   Creating pool positions...")

        # Create pool positions (investor shares in pools)
        positions_data = [
            {
                'investor_id': profiles[0].id,
                'pool_id': 'POOL_INDUSTRIE',
                'shares': 500000,
                'average_nav': 1.0,
                'total_yield_earned': 55000,
                'is_active': True,
            },
            {
                'investor_id': profiles[0].id,
                'pool_id': 'POOL_AGRICULTURE',
                'shares': 300000,
                'average_nav': 1.0,
                'total_yield_earned': 39600,
                'is_active': True,
            },
            {
                'investor_id': profiles[1].id,
                'pool_id': 'POOL_TRADE_FINANCE',
                'shares': 25000,
                'average_nav': 1.0,
                'total_yield_earned': 2300,
                'is_active': True,
            },
        ]

        for pos_data in positions_data:
            position = PoolPosition(**pos_data)
            session.add(position)

        print(f"   ✓ Created {len(positions_data)} pool positions")
        print("   Creating financings...")

        # Create financings (loans/assets in pools)
        from datetime import timedelta
        now = datetime.utcnow()
        financings_data = [
            {
                'pool_family': 'industrie',
                'pool_id': 'POOL_INDUSTRIE',
                'asset_class': AssetClassEnum.EQUIPMENT,
                'industrial': 'GDIZ Partner SA',
                'industrial_id': profiles[2].id,
                'principal': 5000000,
                'interest_rate': 12.0,
                'duration_days': 365,
                'start_date': now - timedelta(days=180),
                'maturity_date': now + timedelta(days=185),
                'amount_repaid': 2500000,
                'is_repaid': False,
                'is_defaulted': False,
                'status': FinancingStatusEnum.REPAYING,
                'description': 'Equipment financing for textile factory expansion',
            },
            {
                'pool_family': 'agriculture',
                'pool_id': 'POOL_AGRICULTURE',
                'asset_class': AssetClassEnum.INVENTORY,
                'industrial': "Café de Côte d'Ivoire",
                'principal': 3000000,
                'interest_rate': 13.5,
                'duration_days': 180,
                'start_date': now - timedelta(days=90),
                'maturity_date': now + timedelta(days=90),
                'amount_repaid': 1500000,
                'is_repaid': False,
                'is_defaulted': False,
                'status': FinancingStatusEnum.REPAYING,
                'description': 'Coffee harvest inventory financing',
            },
            {
                'pool_family': 'trade_finance',
                'pool_id': 'POOL_TRADE_FINANCE',
                'asset_class': AssetClassEnum.RECEIVABLES,
                'industrial': 'West Africa Trade Ltd',
                'principal': 2000000,
                'interest_rate': 9.5,
                'duration_days': 90,
                'start_date': now - timedelta(days=45),
                'maturity_date': now + timedelta(days=45),
                'amount_repaid': 1000000,
                'is_repaid': False,
                'is_defaulted': False,
                'status': FinancingStatusEnum.REPAYING,
                'description': 'Invoice tokenization for export receivables',
            },
        ]

        for fin_data in financings_data:
            financing = Financing(**fin_data)
            session.add(financing)

        print(f"   ✓ Created {len(financings_data)} financings")
        print("   Creating bank accounts...")

        # Create bank accounts
        bank_accounts_data = [
            {
                'account_id': f'ESC-{str(uuid.uuid4())[:8].upper()}',
                'user_id': profiles[0].id,
                'balance': 500000,
                'currency': 'EUR',
                'status': AccountStatusEnum.ACTIVE,
                'bank_name': 'BIIC Bank',
                'account_number': 'BJ' + str(uuid.uuid4().int)[:10],
                'swift_code': 'BIICBJBJ',
            },
            {
                'account_id': f'ESC-{str(uuid.uuid4())[:8].upper()}',
                'user_id': profiles[1].id,
                'balance': 25000,
                'currency': 'EUR',
                'status': AccountStatusEnum.ACTIVE,
                'bank_name': 'BIIC Bank',
                'account_number': 'KE' + str(uuid.uuid4().int)[:10],
                'swift_code': 'BIICKENA',
            },
        ]

        for acc_data in bank_accounts_data:
            account = BankAccount(**acc_data)
            session.add(account)

        print(f"   ✓ Created {len(bank_accounts_data)} bank accounts")
        print("   Creating whitelisted wallets...")

        # Create whitelisted wallets
        wallets_data = [
            {
                'investor_id': profiles[0].id,
                'wallet_address': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
                'label': 'Main Wallet',
                'jurisdiction': 'MU',
                'jurisdiction_verified': True,
                'is_approved': True,
                'risk_score': 15,
                'risk_level': 'low',
                'sanctions_checked': True,
                'sanctions_checked_at': now - timedelta(days=30),
                'pep_checked': True,
                'pep_checked_at': now - timedelta(days=30),
            },
            {
                'investor_id': profiles[1].id,
                'wallet_address': '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
                'label': 'Main Wallet',
                'jurisdiction': 'KE',
                'jurisdiction_verified': True,
                'is_approved': True,
                'risk_score': 20,
                'risk_level': 'low',
                'sanctions_checked': True,
                'sanctions_checked_at': now - timedelta(days=15),
                'pep_checked': True,
                'pep_checked_at': now - timedelta(days=15),
            },
            {
                'investor_id': profiles[2].id,
                'wallet_address': '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
                'label': 'Business Wallet',
                'jurisdiction': 'BJ',
                'jurisdiction_verified': True,
                'is_approved': True,
                'risk_score': 25,
                'risk_level': 'low',
                'sanctions_checked': True,
                'sanctions_checked_at': now - timedelta(days=20),
                'pep_checked': True,
                'pep_checked_at': now - timedelta(days=20),
            },
        ]

        for wallet_data in wallets_data:
            wallet = WhitelistedWallet(**wallet_data)
            session.add(wallet)

        print(f"   ✓ Created {len(wallets_data)} whitelisted wallets")
        print("   Creating risk metrics...")

        # Create risk metrics (latest snapshot per pool)
        risk_metrics_data = [
            {
                'pool_id': 'POOL_INDUSTRIE',
                'default_rate': 0.015,
                'concentration_risk': 0.12,
                'credit_score': 720,
                'credit_rating': 'BBB+',
                'collateralization_ratio': 1.35,
                'risk_score': 75,
                'risk_grade': RiskGradeEnum.BBB,
                'is_healthy': True,
                'period_start': now - timedelta(days=30),
                'period_end': now,
            },
            {
                'pool_id': 'POOL_AGRICULTURE',
                'default_rate': 0.022,
                'concentration_risk': 0.18,
                'credit_score': 680,
                'credit_rating': 'BB+',
                'collateralization_ratio': 1.25,
                'risk_score': 68,
                'risk_grade': RiskGradeEnum.BB,
                'is_healthy': True,
                'period_start': now - timedelta(days=30),
                'period_end': now,
            },
            {
                'pool_id': 'POOL_TRADE_FINANCE',
                'default_rate': 0.008,
                'concentration_risk': 0.08,
                'credit_score': 760,
                'credit_rating': 'A-',
                'collateralization_ratio': 1.45,
                'risk_score': 82,
                'risk_grade': RiskGradeEnum.A,
                'is_healthy': True,
                'period_start': now - timedelta(days=30),
                'period_end': now,
            },
        ]

        for risk_data in risk_metrics_data:
            metric = RiskMetrics(**risk_data)
            session.add(metric)

        print(f"   ✓ Created {len(risk_metrics_data)} risk metrics records")
        print("   Creating compliance metrics...")

        # Create compliance metrics
        compliance_metrics_data = [
            {
                'pool_id': 'POOL_INDUSTRIE',
                'kyc_coverage': 100.0,
                'whitelisted_wallets': 25,
                'jurisdiction_count': 8,
                'jurisdiction_distribution': {'MU': 5, 'KE': 8, 'NG': 4, 'ZA': 3, 'BJ': 3, 'CI': 2},
                'compliance_score': 95,
                'is_compliant': True,
                'pending_reviews': 2,
                'overdue_reviews': 0,
                'sanctions_hits': 0,
                'pep_exposures': 1,
                'period_start': now - timedelta(days=30),
                'period_end': now,
            },
            {
                'pool_id': 'POOL_AGRICULTURE',
                'kyc_coverage': 100.0,
                'whitelisted_wallets': 18,
                'jurisdiction_count': 6,
                'jurisdiction_distribution': {'CI': 6, 'SN': 4, 'BJ': 3, 'TG': 2, 'KE': 2, 'GH': 1},
                'compliance_score': 92,
                'is_compliant': True,
                'pending_reviews': 3,
                'overdue_reviews': 0,
                'sanctions_hits': 0,
                'pep_exposures': 0,
                'period_start': now - timedelta(days=30),
                'period_end': now,
            },
            {
                'pool_id': 'POOL_TRADE_FINANCE',
                'kyc_coverage': 100.0,
                'whitelisted_wallets': 30,
                'jurisdiction_count': 10,
                'jurisdiction_distribution': {'NG': 8, 'KE': 6, 'ZA': 5, 'MU': 4, 'GH': 3, 'EU': 2, 'UK': 2},
                'compliance_score': 98,
                'is_compliant': True,
                'pending_reviews': 1,
                'overdue_reviews': 0,
                'sanctions_hits': 0,
                'pep_exposures': 2,
                'period_start': now - timedelta(days=30),
                'period_end': now,
            },
        ]

        for comp_data in compliance_metrics_data:
            metric = ComplianceMetrics(**comp_data)
            session.add(metric)

        print(f"   ✓ Created {len(compliance_metrics_data)} compliance metrics records")
        print("   Creating impact metrics...")

        # Create impact metrics
        impact_metrics_data = [
            {
                'pool_id': 'POOL_INDUSTRIE',
                'avg_capacity_increase': 28.5,
                'value_add_ratio': 2.8,
                'jobs_per_million': 85.0,
                'total_direct_jobs': 425,
                'total_indirect_jobs': 1275,
                'women_employment_rate': 42.5,
                'youth_employment_rate': 38.2,
                'co2_reduction_tons': 15000,
                'renewable_energy_kwh': 2500000,
                'primary_sdg': 'SDG 9: Industry, Innovation and Infrastructure',
                'sdg_coverage': {'SDG 9': 1.0, 'SDG 8': 0.8, 'SDG 5': 0.6},
                'impact_score': 78,
                'impact_grade': 'B+',
                'period_start': now - timedelta(days=90),
                'period_end': now,
            },
            {
                'pool_id': 'POOL_AGRICULTURE',
                'avg_capacity_increase': 35.2,
                'value_add_ratio': 3.2,
                'jobs_per_million': 120.0,
                'total_direct_jobs': 360,
                'total_indirect_jobs': 1080,
                'women_employment_rate': 55.8,
                'youth_employment_rate': 45.5,
                'co2_reduction_tons': 8000,
                'renewable_energy_kwh': 1200000,
                'primary_sdg': 'SDG 2: Zero Hunger',
                'sdg_coverage': {'SDG 2': 1.0, 'SDG 8': 0.9, 'SDG 5': 0.7, 'SDG 13': 0.5},
                'impact_score': 82,
                'impact_grade': 'A-',
                'period_start': now - timedelta(days=90),
                'period_end': now,
            },
            {
                'pool_id': 'POOL_TRADE_FINANCE',
                'avg_capacity_increase': 18.5,
                'value_add_ratio': 2.2,
                'jobs_per_million': 65.0,
                'total_direct_jobs': 195,
                'total_indirect_jobs': 585,
                'women_employment_rate': 38.5,
                'youth_employment_rate': 42.0,
                'co2_reduction_tons': 3000,
                'renewable_energy_kwh': 500000,
                'primary_sdg': 'SDG 8: Decent Work and Economic Growth',
                'sdg_coverage': {'SDG 8': 1.0, 'SDG 9': 0.7, 'SDG 17': 0.8},
                'impact_score': 72,
                'impact_grade': 'B',
                'period_start': now - timedelta(days=90),
                'period_end': now,
            },
        ]

        for impact_data in impact_metrics_data:
            metric = ImpactMetrics(**impact_data)
            session.add(metric)

        print(f"   ✓ Created {len(impact_metrics_data)} impact metrics records")

        # Commit all changes
        session.commit()
        
        print("\n✅ Seed data created successfully!")
        
    except Exception as e:
        session.rollback()
        print(f"❌ Error seeding data: {e}")
        raise
    finally:
        session.close()


if __name__ == '__main__':
    success = setup_database()
    sys.exit(0 if success else 1)
