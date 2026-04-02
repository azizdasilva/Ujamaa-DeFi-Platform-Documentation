"""
Update Escrow Balances for Demo Users

Sets specific escrow balances for testing purposes.

Run: python update_escrow_balances.py
"""

from sqlalchemy import create_engine, text
from config.database import get_database_url
from datetime import datetime

def update_balances():
    engine = create_engine(get_database_url())
    
    # User email -> escrow balance mapping
    balances = {
        'institutional@ujamaa-defi.com': 10_000,
        'retail@ujamaa-defi.com': 50_000,
        'operator@ujamaa-defi.com': 100_000,
        'john.doe@email.com': 2_000_000,
        'alice.retail@example.com': 3_000_000,
        'bob.institutional@example.com': 5_000_000,
        'charlie.operator@example.com': 10_000_000,
    }
    
    with engine.connect() as conn:
        for email, escrow_balance in balances.items():
            # Get user ID
            user_result = conn.execute(
                text("SELECT id FROM users WHERE email = :email"),
                {"email": email}
            ).fetchone()
            
            if not user_result:
                print(f"❌ User {email} not found")
                continue
            
            user_id = user_result[0]
            
            # Update bank account
            conn.execute(
                text("""
                    UPDATE bank_accounts 
                    SET escrow_balance = :escrow_balance,
                        available_balance = :escrow_balance,
                        locked_amount = 0,
                        updated_at = :updated_at
                    WHERE user_id = :user_id
                """),
                {
                    "escrow_balance": escrow_balance,
                    "user_id": user_id,
                    "updated_at": datetime.utcnow()
                }
            )
            
            print(f"✅ {email}: Escrow balance set to €{escrow_balance:,}")
        
        conn.commit()
    
    print("\n🎉 All escrow balances updated successfully!")

if __name__ == "__main__":
    update_balances()
