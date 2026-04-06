"""
Migration: Create contracts table for smart contract registry.
Run: python migrate_add_contracts_table.py
"""
import os
from sqlalchemy import create_engine, text, inspect
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("⚠️  No DATABASE_URL set. Using local SQLite fallback.")
    DATABASE_URL = "sqlite:///./ujamaa.db"

print(f"🔗 Connecting to: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'local'}")
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    inspector = inspect(engine)
    if 'contracts' in inspector.get_table_names():
        print("✅ contracts table already exists")
    else:
        print("📝 Creating contracts table...")
        conn.execute(text("""
            CREATE TABLE contracts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100) UNIQUE NOT NULL,
                address VARCHAR(42) NOT NULL,
                contract_type VARCHAR(50) NOT NULL,
                network VARCHAR(50) DEFAULT 'Polygon Amoy',
                chain_id INTEGER DEFAULT 80002,
                description TEXT,
                status VARCHAR(20) DEFAULT 'deployed',
                tx_hash VARCHAR(66),
                block_number INTEGER,
                abi_path VARCHAR(255),
                explorer_url VARCHAR(255),
                verified BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """))
        conn.commit()
        print("✅ contracts table created successfully")

print("🎉 Migration complete.")
