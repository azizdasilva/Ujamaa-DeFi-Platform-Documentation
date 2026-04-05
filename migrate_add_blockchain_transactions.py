"""
Migration: Add blockchain_transactions table

Adds audit trail table for tracking all on-chain and simulated blockchain actions.
Enables DB ↔ Chain reconciliation.

@notice Run this migration before enabling smart contract integration.
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text, inspect
from config.database import DATABASE_URL


def run_migration():
    """Run the migration"""
    engine = create_engine(DATABASE_URL)

    with engine.connect() as conn:
        inspector = inspect(engine)

        # Check if table already exists
        if 'blockchain_transactions' in inspector.get_table_names():
            print("⏭️  blockchain_transactions table already exists, skipping")
            return

        print("📝 Creating blockchain_transactions table...")

        conn.execute(text("""
            CREATE TABLE blockchain_transactions (
                id SERIAL PRIMARY KEY,

                -- Action identification
                action VARCHAR(50) NOT NULL,
                contract_name VARCHAR(100) NOT NULL,
                function_name VARCHAR(100) NOT NULL,
                parameters JSON,

                -- Transaction hashes
                simulated_tx_hash VARCHAR(66),
                real_tx_hash VARCHAR(66),

                -- Blockchain metadata
                block_number INTEGER,
                gas_used NUMERIC(18, 2),
                gas_fee NUMERIC(18, 2),

                -- Status tracking
                status VARCHAR(50) DEFAULT 'simulated',
                confirmation_count INTEGER DEFAULT 0,

                -- Linked entities
                investor_id INTEGER REFERENCES investor_profiles(id) ON DELETE SET NULL,
                pool_id VARCHAR(50),
                financing_id INTEGER,

                -- Error handling
                error_message TEXT,
                retry_count INTEGER DEFAULT 0,

                -- Metadata
                description TEXT,
                explorer_url VARCHAR(500),

                -- Timestamps
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                confirmed_at TIMESTAMP,

                -- Constraints
                CONSTRAINT uq_simulated_tx_hash UNIQUE(simulated_tx_hash),
                CONSTRAINT uq_real_tx_hash UNIQUE(real_tx_hash)
            );
        """))

        # Create indexes for performance
        conn.execute(text("CREATE INDEX idx_blockchain_tx_investor ON blockchain_transactions(investor_id);"))
        conn.execute(text("CREATE INDEX idx_blockchain_tx_submitted ON blockchain_transactions(submitted_at);"))
        conn.execute(text("CREATE INDEX idx_blockchain_tx_action ON blockchain_transactions(action);"))
        conn.execute(text("CREATE INDEX idx_blockchain_tx_contract ON blockchain_transactions(contract_name);"))

        conn.commit()
        print("✅ blockchain_transactions table created successfully")


if __name__ == "__main__":
    run_migration()
