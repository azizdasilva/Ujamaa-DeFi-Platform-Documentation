"""
Seed Database with Demo Users

Adds demo users including John Doe to the database for testing.

Run: python seed_demo_users.py
"""

from sqlalchemy import create_engine, text
from config.database import get_database_url
from datetime import datetime
import hashlib

def hash_password(password: str) -> str:
    """Simple password hash for demo purposes."""
    return hashlib.sha256(password.encode()).hexdigest()

def seed_users():
    engine = create_engine(get_database_url())
    
    # Demo users to add
    users = [
        {
            'email': 'john.doe@email.com',
            'password': 'password123',
            'role': 'RETAIL_INVESTOR',
            'full_name': 'John Doe',
            'wallet_address': '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1190',  # Changed last digit
            'jurisdiction': 'KE'
        },
        {
            'email': 'alice.retail@example.com',
            'password': 'password123',
            'role': 'RETAIL_INVESTOR',
            'full_name': 'Alice Retail Investor',
            'wallet_address': '0x1234567890123456789012345678901234567891',
            'jurisdiction': 'MU'
        },
        {
            'email': 'bob.institutional@example.com',
            'password': 'password123',
            'role': 'INSTITUTIONAL_INVESTOR',
            'full_name': 'Bob Institutional Investor',
            'wallet_address': '0x2345678901234567890123456789012345678902',
            'jurisdiction': 'GB'
        },
        {
            'email': 'charlie.operator@example.com',
            'password': 'password123',
            'role': 'INDUSTRIAL_OPERATOR',
            'full_name': 'Charlie Industrial Operator',
            'wallet_address': '0x3456789012345678901234567890123456789013',
            'jurisdiction': 'BJ'
        },
    ]
    
    with engine.connect() as conn:
        for user in users:
            # Check if user already exists
            result = conn.execute(
                text("SELECT id FROM users WHERE email = :email"),
                {"email": user['email']}
            ).fetchone()
            
            if result:
                print(f"⏭️  User {user['email']} already exists")
                continue
            
            # Insert user
            conn.execute(
                text("""
                    INSERT INTO users (email, password_hash, role, wallet_address, is_active, created_at, updated_at)
                    VALUES (:email, :password_hash, :role, :wallet_address, 1, :created_at, :updated_at)
                """),
                {
                    "email": user['email'],
                    "password_hash": hash_password(user['password']),
                    "role": user['role'],
                    "wallet_address": user['wallet_address'],
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            )
            
            # Get the user ID
            result = conn.execute(
                text("SELECT id FROM users WHERE email = :email"),
                {"email": user['email']}
            ).fetchone()
            user_id = result[0]
            
            # Create investor profile
            conn.execute(
                text("""
                    INSERT INTO investor_profiles (user_id, full_name, jurisdiction, kyc_status, kyb_status, accreditation_status, wallet_address, created_at, updated_at)
                    VALUES (:user_id, :full_name, :jurisdiction, 'APPROVED', 'APPROVED', 'APPROVED', :wallet_address, :created_at, :updated_at)
                """),
                {
                    "user_id": user_id,
                    "full_name": user['full_name'],
                    "jurisdiction": user['jurisdiction'],
                    "wallet_address": user['wallet_address'],
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            )
            
            # Get the investor profile ID
            investor_result = conn.execute(
                text("SELECT id FROM investor_profiles WHERE user_id = :user_id"),
                {"user_id": user_id}
            ).fetchone()
            investor_id = investor_result[0] if investor_result else None
            
            # Create bank account with some initial balances
            conn.execute(
                text("""
                    INSERT INTO bank_accounts (account_id, investor_id, user_id, account_number, bank_name, balance, escrow_balance, available_balance, locked_amount, currency, status, created_at, updated_at)
                    VALUES (:account_id, :investor_id, :user_id, :account_number, :bank_name, :balance, :escrow_balance, :available_balance, :locked_amount, 'EUR', 'ACTIVE', :created_at, :updated_at)
                """),
                {
                    "account_id": f"ESC-{user_id:03d}-2026",
                    "investor_id": investor_id,
                    "user_id": user_id,
                    "account_number": f"{user['jurisdiction']}{user_id:08d}",
                    "bank_name": "BIIC Bank",
                    "balance": 0,
                    "escrow_balance": 0,
                    "available_balance": 0,
                    "locked_amount": 0,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            )
            
            print(f"✅ Added user: {user['email']} ({user['full_name']})")
        
        conn.commit()
    
    print("\n🎉 Demo users seeded successfully!")
    print("\nLogin credentials for all users:")
    print("  Password: password123")

if __name__ == "__main__":
    seed_users()
