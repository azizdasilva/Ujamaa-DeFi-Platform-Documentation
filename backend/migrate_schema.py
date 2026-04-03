"""
Database Schema Migration Script
Compares SQLAlchemy models with actual SQLite database and adds missing columns.
Run this after any model changes to keep the database in sync.
"""

import sqlite3
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from config.models import (
    User, InvestorProfile, Pool, Investment, Document,
    ULTTransaction, Transaction, PoolPosition, Financing,
    YieldStatement, BankAccount, BankTransaction, GDIZFinancing,
    RiskMetrics, ComplianceMetrics, ImpactMetrics, WhitelistedWallet,
    ComplianceActivity
)
from sqlalchemy import Column, Numeric, String, Integer, Float, Boolean, DateTime, Text, JSON

DB_PATH = Path(__file__).parent / 'data' / 'ujamaa.db'

# Map SQLAlchemy types to SQLite types
TYPE_MAP = {
    'Numeric': 'NUMERIC(26,18)',
    'String': 'VARCHAR(255)',
    'Integer': 'INTEGER',
    'Float': 'FLOAT',
    'Boolean': 'BOOLEAN',
    'DateTime': 'DATETIME',
    'Text': 'TEXT',
    'JSON': 'JSON',
}

def get_db_columns():
    """Get existing columns from SQLite database."""
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    tables = [row[0] for row in cursor.fetchall()]
    
    db_columns = {}
    for table in tables:
        cursor.execute(f'PRAGMA table_info({table})')
        db_columns[table] = {row[1]: row[2] for row in cursor.fetchall()}
    conn.close()
    return db_columns

def get_model_columns():
    """Get columns from SQLAlchemy models."""
    models = {
        'users': User,
        'investor_profiles': InvestorProfile,
        'pools': Pool,
        'investments': Investment,
        'documents': Document,
        'ult_transactions': ULTTransaction,
        'transactions': Transaction,
        'pool_positions': PoolPosition,
        'financings': Financing,
        'yield_statements': YieldStatement,
        'bank_accounts': BankAccount,
        'bank_transactions': BankTransaction,
        'gdiz_financings': GDIZFinancing,
        'risk_metrics': RiskMetrics,
        'compliance_metrics': ComplianceMetrics,
        'impact_metrics': ImpactMetrics,
        'whitelisted_wallets': WhitelistedWallet,
        'compliance_activities': ComplianceActivity,
    }
    
    model_columns = {}
    for table_name, model in models.items():
        cols = {}
        for col in model.__table__.columns:
            col_type = str(col.type).upper()
            sqlite_type = 'VARCHAR(255)'  # default
            for py_type, sqlite_t in TYPE_MAP.items():
                if py_type.upper() in col_type:
                    sqlite_type = sqlite_t
                    break
            cols[col.name] = {
                'type': sqlite_type,
                'nullable': col.nullable,
                'default': col.default.arg if col.default else None,
            }
        model_columns[table_name] = cols
    
    return model_columns

def add_missing_columns():
    """Add any missing columns to the database."""
    db_cols = get_db_columns()
    model_cols = get_model_columns()
    
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    
    total_added = 0
    
    for table_name in sorted(model_cols.keys()):
        if table_name not in db_cols:
            print(f"⚠️  Table '{table_name}' doesn't exist in database")
            continue
            
        missing = set(model_cols[table_name].keys()) - set(db_cols[table_name].keys())
        
        if missing:
            print(f"\n📋 {table_name}: Adding {len(missing)} missing column(s)")
            for col_name in sorted(missing):
                col_info = model_cols[table_name][col_name]
                col_type = col_info['type']
                default = col_info['default']
                
                # Build ALTER TABLE statement
                sql = f"ALTER TABLE {table_name} ADD COLUMN {col_name} {col_type}"
                
                # Add default value
                if default is not None:
                    if isinstance(default, bool):
                        sql += f" DEFAULT {str(default).upper()}"
                    elif isinstance(default, (int, float)):
                        sql += f" DEFAULT {default}"
                    elif isinstance(default, str):
                        sql += f" DEFAULT '{default}'"
                elif col_info['nullable']:
                    sql += " DEFAULT NULL"
                
                try:
                    cursor.execute(sql)
                    print(f"   ✅ {col_name} ({col_type})")
                    total_added += 1
                except sqlite3.OperationalError as e:
                    if "duplicate column" in str(e).lower():
                        print(f"   ⏭️  {col_name} already exists")
                    else:
                        print(f"   ❌ {col_name}: {e}")
    
    conn.commit()
    conn.close()
    
    print(f"\n{'='*60}")
    print(f"✅ Migration complete: {total_added} column(s) added")
    print(f"{'='*60}")

if __name__ == '__main__':
    print("🔍 Checking database schema consistency...")
    print(f"📁 Database: {DB_PATH}")
    print()
    add_missing_columns()
