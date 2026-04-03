"""
Database Configuration - SQLite/PostgreSQL Switch

This module handles database configuration and allows easy switching between
SQLite (development) and PostgreSQL (production) via environment variables.

@notice: Change DATABASE_TYPE in .env to switch databases
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database type from environment (default: sqlite)
DATABASE_TYPE = os.getenv('DATABASE_TYPE', 'sqlite')

# Detect Vercel serverless environment
IS_VERCEL = os.getenv('VERCEL', '0') == '1'

# SQLite configuration
# On Vercel, use /tmp directory (only writable path in serverless)
if IS_VERCEL:
    SQLITE_DB_PATH = '/tmp/ujamaa.db'
else:
    SQLITE_DB_PATH = os.getenv('SQLITE_DB_PATH', 'backend/data/ujamaa.db')

# PostgreSQL configuration
DATABASE_URL = os.getenv(
    'DATABASE_URL',
    'postgresql://user:password@localhost:5432/ujamaa_defi'
)

# Pool settings
DB_POOL_SIZE = int(os.getenv('DB_POOL_SIZE', '5'))
DB_MAX_OVERFLOW = int(os.getenv('DB_MAX_OVERFLOW', '10'))
DB_POOL_TIMEOUT = int(os.getenv('DB_POOL_TIMEOUT', '30'))
DB_POOL_RECYCLE = int(os.getenv('DB_POOL_RECYCLE', '1800'))


def get_database_url() -> str:
    """
    Get the appropriate database URL based on configuration.

    Returns:
        str: Database connection URL
    """
    if DATABASE_TYPE == 'sqlite':
        # Ensure the data directory exists
        db_path = Path(SQLITE_DB_PATH)
        db_path.parent.mkdir(parents=True, exist_ok=True)
        # Use absolute path for SQLite
        if IS_VERCEL:
            return f"sqlite:////{SQLITE_DB_PATH}"
        return f"sqlite:///{db_path.absolute()}"
    else:
        return DATABASE_URL


def get_database_config() -> dict:
    """
    Get complete database configuration.
    
    Returns:
        dict: Database configuration dictionary
    """
    return {
        'type': DATABASE_TYPE,
        'url': get_database_url(),
        'pool_size': DB_POOL_SIZE,
        'max_overflow': DB_MAX_OVERFLOW,
        'pool_timeout': DB_POOL_TIMEOUT,
        'pool_recycle': DB_POOL_RECYCLE,
    }


# Database URL for SQLAlchemy
DATABASE_URL = get_database_url()

# Shared session dependency for FastAPI
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Session:
    """
    FastAPI dependency that provides a database session.
    Yields a session and ensures it's closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Print configuration on import (for debugging)
if os.getenv('DEBUG', 'False').lower() == 'true':
    print(f"📊 Database Type: {DATABASE_TYPE}")
    print(f"📊 Database URL: {get_database_url()}")
