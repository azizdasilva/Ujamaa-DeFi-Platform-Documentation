"""
Database Migration Script - Add Compliance Columns to Transactions

This script adds the new compliance tracking columns to the transactions table.

Usage:
    python migrate_add_compliance_columns.py
"""

import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / 'backend'))

from sqlalchemy import create_engine, text, inspect, MetaData
from config.database import get_database_url

def migrate():
    """Add compliance columns to transactions table"""
    print("=" * 70)
    print("🔄 MIGRATING DATABASE - ADD COMPLIANCE COLUMNS")
    print("=" * 70)
    
    db_url = get_database_url()
    print(f"\n📊 Database URL: {db_url}")
    
    engine = create_engine(db_url)
    
    # Check if columns already exist
    try:
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('transactions')]
        print(f"\n📋 Existing columns in 'transactions' table: {len(columns)}")
    except Exception as e:
        print(f"\n⚠️  Could not inspect transactions table: {e}")
        print("   Table may not exist yet - will be created with new schema on next run")
        return
    
    # New columns to add
    new_columns = [
        ('is_flagged', 'BOOLEAN DEFAULT 0'),
        ('risk_level', 'VARCHAR(20)'),
        ('flag_reason', 'TEXT'),
        ('flagged_at', 'DATETIME'),
        ('flagged_by', 'VARCHAR(50)'),
        ('reviewed_by', 'INTEGER'),
        ('reviewed_at', 'DATETIME'),
        ('review_notes', 'TEXT'),
        ('review_action', 'VARCHAR(20)'),
    ]
    
    with engine.connect() as conn:
        columns_added = 0
        columns_skipped = 0
        
        for col_name, col_type in new_columns:
            if col_name in columns:
                print(f"  ⚠️  Column '{col_name}' already exists - skipping")
                columns_skipped += 1
            else:
                print(f"  ➕ Adding column '{col_name}'...")
                try:
                    conn.execute(text(f"ALTER TABLE transactions ADD COLUMN {col_name} {col_type}"))
                    conn.commit()
                    print(f"     ✅ Added '{col_name}'")
                    columns_added += 1
                except Exception as e:
                    print(f"     ❌ Error adding '{col_name}': {e}")
        
        print(f"\n✅ Migration complete!")
        print(f"   - Columns added: {columns_added}")
        print(f"   - Columns skipped: {columns_skipped}")
    
    print("\n" + "=" * 70)

if __name__ == '__main__':
    try:
        migrate()
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
