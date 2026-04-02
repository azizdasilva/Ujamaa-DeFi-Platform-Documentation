"""
Database Initialization Script
Ujamaa DeFi Platform

Initializes the database with all tables and seed data.
Supports both SQLite (development) and PostgreSQL (production).

Usage:
    python init_db.py
    
To reset database (WARNING: Deletes all data):
    python init_db.py --reset
"""

import os
import sys
import argparse
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import create_engine, text
from config.database import get_database_url, DATABASE_TYPE
from config.models import Base, init_db
from datetime import datetime, timedelta

def create_database():
    """Create database and all tables"""
    print("=" * 60)
    print("📊 Ujamaa DeFi Platform - Database Initialization")
    print("=" * 60)
    
    # Get database URL
    db_url = get_database_url()
    print(f"\n🔧 Database Type: {DATABASE_TYPE}")
    print(f"📍 Database URL: {db_url}")
    
    # Create engine
    print("\n⚙️  Creating database engine...")
    engine = create_engine(
        db_url,
        echo=True,  # Show SQL queries
        pool_pre_ping=True,  # Verify connections
    )
    
    # Create all tables
    print("\n📋 Creating tables...")
    try:
        Base.metadata.create_all(engine)
        print("✅ Tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False
    
    # Seed initial data
    print("\n🌱 Seeding initial data...")
    seed_data(engine)
    
    print("\n" + "=" * 60)
    print("✅ Database initialization complete!")
    print("=" * 60)
    
    return True


def seed_data(engine):
    """Seed database with initial demo data"""
    from sqlalchemy.orm import sessionmaker
    from config.models import User, InvestorProfile, Pool, Document, ComplianceStatusEnum, InvestorRoleEnum
    
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Check if data already exists
        if session.query(User).count() > 0:
            print("⚠️  Database already has data. Skipping seed.")
            session.close()
            return
        
        print("Creating demo users...")
        
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
        
        print("Creating investor profiles...")
        
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
        
        print("Creating investment pools...")
        
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
        
        session.commit()
        
        print("✅ Seed data created successfully!")
        print(f"   - {len(users)} users")
        print(f"   - {len(profiles)} investor profiles")
        print(f"   - {len(pools_data)} pools")
        
    except Exception as e:
        session.rollback()
        print(f"❌ Error seeding data: {e}")
        raise
    finally:
        session.close()


def reset_database():
    """Drop all tables and recreate"""
    print("\n⚠️  WARNING: This will DELETE ALL DATA!")
    confirm = input("Are you sure? Type 'yes' to confirm: ")
    
    if confirm.lower() != 'yes':
        print("❌ Operation cancelled.")
        return False
    
    db_url = get_database_url()
    engine = create_engine(db_url)
    
    print("\n🗑️  Dropping all tables...")
    Base.metadata.drop_all(engine)
    
    print("✅ Database reset. Run init again to recreate.")
    return True


def main():
    parser = argparse.ArgumentParser(description='Initialize Ujamaa DeFi database')
    parser.add_argument('--reset', action='store_true', help='Reset database (DELETE ALL DATA)')
    args = parser.parse_args()
    
    if args.reset:
        reset_database()
    else:
        create_database()


if __name__ == '__main__':
    main()
