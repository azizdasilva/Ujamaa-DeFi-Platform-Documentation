"""
Migration: Add escrow_balance, available_balance, locked_amount to bank_accounts
Also change investor_id to user_id

Run: python migrate_add_bank_account_fields.py
"""

from sqlalchemy import create_engine, text, inspect
from config.database import get_database_url

def migrate():
    engine = create_engine(get_database_url())
    
    with engine.connect() as conn:
        # Check if columns already exist
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('bank_accounts')]
        
        print("Current bank_accounts columns:", columns)
        
        # Add escrow_balance if not exists
        if 'escrow_balance' not in columns:
            print("Adding escrow_balance column...")
            conn.execute(text(
                "ALTER TABLE bank_accounts ADD COLUMN escrow_balance DECIMAL(18,2) DEFAULT 0 NOT NULL"
            ))
        
        # Add available_balance if not exists
        if 'available_balance' not in columns:
            print("Adding available_balance column...")
            conn.execute(text(
                "ALTER TABLE bank_accounts ADD COLUMN available_balance DECIMAL(18,2) DEFAULT 0 NOT NULL"
            ))
        
        # Add locked_amount if not exists
        if 'locked_amount' not in columns:
            print("Adding locked_amount column...")
            conn.execute(text(
                "ALTER TABLE bank_accounts ADD COLUMN locked_amount DECIMAL(18,2) DEFAULT 0 NOT NULL"
            ))
        
        # SQLite doesn't support CHANGE COLUMN, so we'll just add user_id as new column
        # and keep investor_id for backwards compatibility
        if 'user_id' not in columns:
            print("Adding user_id column (SQLite doesn't support renaming columns)...")
            conn.execute(text(
                "ALTER TABLE bank_accounts ADD COLUMN user_id INT"
            ))
            # Copy investor_id to user_id
            conn.execute(text(
                "UPDATE bank_accounts SET user_id = investor_id WHERE user_id IS NULL"
            ))
        
        conn.commit()
        
    print("✅ Migration completed successfully!")

if __name__ == "__main__":
    migrate()
