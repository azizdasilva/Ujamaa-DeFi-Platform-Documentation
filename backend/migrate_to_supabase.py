"""
SQLite to PostgreSQL Migration Script - Ujamaa DeFi Platform

Migrates all data from local SQLite database to Supabase PostgreSQL.

Usage:
    python migrate_to_supabase.py

Requirements:
    - Supabase DATABASE_URL set in .env
    - Local SQLite database exists at configured path
"""

import os
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import create_engine, inspect, MetaData, Table
from sqlalchemy.orm import sessionmaker
from config.database import get_database_url, DATABASE_TYPE
from config.models import Base
from datetime import datetime


def get_sqlite_engine():
    """Get SQLite database engine"""
    # Temporarily force SQLite for source
    import config.database as db_config
    original_db_type = db_config.DATABASE_TYPE
    
    # Get the SQLite URL directly
    sqlite_url = None
    if db_config.DATABASE_TYPE == 'sqlite':
        sqlite_url = get_database_url()
    else:
        # If currently set to PostgreSQL, construct SQLite URL from config
        _raw_path = os.getenv('SQLITE_DB_PATH', 'data/ujamaa.db')
        if _raw_path.startswith('backend/'):
            _raw_path = _raw_path[len('backend/'):]
        _path = Path(_raw_path)
        if not _path.is_absolute():
            _path = Path(__file__).resolve().parent / _path
        sqlite_url = f"sqlite:///{_path.absolute()}"
    
    print(f"📂 Source SQLite URL: {sqlite_url}")
    engine = create_engine(sqlite_url, echo=False)
    
    # Verify it exists
    try:
        insp = inspect(engine)
        tables = insp.get_table_names()
        print(f"   Found {len(tables)} tables in SQLite")
    except Exception as e:
        print(f"❌ Cannot connect to SQLite: {e}")
        sys.exit(1)
    
    return engine


def get_postgres_engine(database_url):
    """Get PostgreSQL database engine"""
    print(f"\n🌐 Target PostgreSQL URL: {database_url[:30]}...")
    engine = create_engine(database_url, echo=False, pool_pre_ping=True)
    
    # Test connection
    try:
        with engine.connect() as conn:
            conn.execute(__import__('sqlalchemy').text("SELECT 1"))
        print("✅ PostgreSQL connection successful")
    except Exception as e:
        print(f"❌ Cannot connect to PostgreSQL: {e}")
        sys.exit(1)
    
    return engine


def migrate_schema(postgres_engine):
    """Create all tables in PostgreSQL"""
    print("\n📋 Creating schema in PostgreSQL...")
    Base.metadata.create_all(postgres_engine)
    print("✅ Schema created successfully")


def migrate_data(sqlite_engine, postgres_engine):
    """Migrate all data from SQLite to PostgreSQL"""
    print("\n🔄 Starting data migration...")
    
    # Create sessions
    SQLiteSession = sessionmaker(bind=sqlite_engine)
    PostgresSession = sessionmaker(bind=postgres_engine)
    
    sqlite_session = SQLiteSession()
    postgres_session = PostgresSession()
    
    try:
        # Get all tables from SQLite
        inspector = inspect(sqlite_engine)
        tables = inspector.get_table_names()
        
        # Skip SQLAlchemy internal tables
        tables = [t for t in tables if not t.startswith('alembic')]
        
        total_migrated = 0
        
        for table_name in tables:
            print(f"\n   Migrating table: {table_name}...", end=" ")
            
            # Get table metadata
            metadata = MetaData()
            table = Table(table_name, metadata, autoload_with=sqlite_engine)
            
            # Get all rows
            with sqlite_engine.connect() as conn:
                result = conn.execute(table.select())
                rows = result.fetchall()
                columns = result.keys()
            
            if not rows:
                print("⏭️  (empty, skipping)")
                continue
            
            # Get PostgreSQL table
            pg_metadata = MetaData()
            try:
                pg_table = Table(table_name, pg_metadata, autoload_with=postgres_engine)
            except Exception as e:
                print(f"⚠️  Table not found in PostgreSQL: {e}")
                continue
            
            # Insert rows into PostgreSQL
            row_count = 0
            for row in rows:
                row_dict = dict(zip(columns, row))
                
                # Handle enum columns - convert string values back to enum objects if needed
                # This is handled automatically by SQLAlchemy in most cases
                
                try:
                    with postgres_engine.begin() as conn:
                        conn.execute(pg_table.insert().values(**row_dict))
                    row_count += 1
                except Exception as e:
                    # Handle duplicate keys or constraint violations
                    if "duplicate key" in str(e) or "unique constraint" in str(e).lower():
                        print(f"\n      ⚠️  Skipping duplicate row in {table_name}")
                        continue
                    else:
                        print(f"\n      ❌ Error inserting row in {table_name}: {e}")
                        raise
            
            print(f"✅ {row_count} rows migrated")
            total_migrated += row_count
        
        print(f"\n{'=' * 60}")
        print(f"✅ Migration complete! Total rows migrated: {total_migrated}")
        print(f"{'=' * 60}")
        
        # Verify migration
        verify_migration(sqlite_engine, postgres_engine)
        
        return True
        
    except Exception as e:
        postgres_session.rollback()
        print(f"\n❌ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        sqlite_session.close()
        postgres_session.close()


def verify_migration(sqlite_engine, postgres_engine):
    """Verify that data was migrated correctly"""
    print("\n🔍 Verifying migration...")
    
    inspector = inspect(sqlite_engine)
    sqlite_tables = set(inspector.get_table_names())
    
    pg_inspector = inspect(postgres_engine)
    pg_tables = set(pg_inspector.get_table_names())
    
    # Compare row counts
    common_tables = sqlite_tables.intersection(pg_tables)
    
    mismatches = []
    for table in sorted(common_tables):
        if table.startswith('alembic'):
            continue
            
        with sqlite_engine.connect() as conn:
            sqlite_count = conn.execute(__import__('sqlalchemy').text(f"SELECT COUNT(*) FROM {table}")).scalar()
        
        with postgres_engine.connect() as conn:
            pg_count = conn.execute(__import__('sqlalchemy').text(f"SELECT COUNT(*) FROM {table}")).scalar()
        
        status = "✅" if sqlite_count == pg_count else "⚠️"
        print(f"   {status} {table}: SQLite={sqlite_count}, PostgreSQL={pg_count}")
        
        if sqlite_count != pg_count:
            mismatches.append(table)
    
    if mismatches:
        print(f"\n⚠️  Row count mismatches in: {', '.join(mismatches)}")
        print("   (This may be normal if some tables have different constraints)")
    else:
        print("\n✅ All tables verified successfully!")


def main():
    """Main migration function"""
    print("=" * 70)
    print("🗄️  UJAMAA DEFI PLATFORM - SQLITE TO POSTGRESQL MIGRATION")
    print("=" * 70)
    print()
    
    # Get PostgreSQL URL from environment
    import config.database as db_config
    postgres_url = os.getenv('DATABASE_URL')
    
    # If DATABASE_TYPE is postgresql, use the DATABASE_URL from .env
    if db_config.DATABASE_TYPE == 'postgresql' and postgres_url and 'user:password@localhost' not in postgres_url:
        postgres_url = postgres_url
    else:
        # Force direct read from .env for migration
        from dotenv import dotenv_values
        env_vars = dotenv_values(Path(__file__).parent / '.env')
        postgres_url = env_vars.get('DATABASE_URL', '')
    if not postgres_url or 'user:password@localhost' in postgres_url:
        print("❌ DATABASE_URL not configured properly in .env")
        print()
        print("Please set your Supabase DATABASE_URL in .env:")
        print("  DATABASE_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres")
        print()
        print("Then run this script again.")
        sys.exit(1)
    
    # Check if user wants to proceed
    print("⚠️  This will migrate all data from your local SQLite to Supabase.")
    print("⚠️  Make sure you've created the Supabase project and set DATABASE_URL in .env")
    print()
    
    # Auto-confirm if --yes flag is passed
    if '--yes' in sys.argv:
        print("✅ Auto-confirming migration (--yes flag provided)")
    else:
        response = input("Continue with migration? (yes/no): ").strip().lower()
        if response not in ['yes', 'y']:
            print("❌ Migration cancelled")
            sys.exit(0)
    
    print()
    
    # Get engines
    sqlite_engine = get_sqlite_engine()
    postgres_engine = get_postgres_engine(postgres_url)
    
    # Create schema
    migrate_schema(postgres_engine)
    
    # Migrate data
    success = migrate_data(sqlite_engine, postgres_engine)
    
    if success:
        print("\n" + "=" * 70)
        print("✅ MIGRATION COMPLETE!")
        print("=" * 70)
        print()
        print("Next steps:")
        print("1. Set DATABASE_TYPE=postgresql in .env")
        print("2. Set DATABASE_URL to your Supabase connection string")
        print("3. Deploy to Vercel with these environment variables")
        print("4. Test the application")
        print()
        print("Your local SQLite database remains unchanged for development.")
    else:
        print("\n❌ Migration failed. Check the errors above.")
        sys.exit(1)


if __name__ == '__main__':
    main()
