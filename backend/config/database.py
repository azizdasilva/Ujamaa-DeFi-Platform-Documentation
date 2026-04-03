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

# Detect Vercel/serverless environment (multiple detection methods)
IS_VERCEL = (
    os.getenv('VERCEL', '') == '1' or
    os.getenv('VERCEL_ENV') is not None or
    os.getenv('AWS_LAMBDA_FUNCTION_NAME') is not None or
    os.getenv('LAMBDA_TASK_ROOT') is not None or
    os.getenv('FUNCTION_TARGET') is not None
)

# SQLite configuration
# On Vercel/serverless, use /tmp directory (only writable path)
if IS_VERCEL:
    _SQLITE_DB_PATH = '/tmp/ujamaa.db'
else:
    # Get path from env, resolve relative to project root
    _raw_path = os.getenv('SQLITE_DB_PATH', 'data/ujamaa.db')
    # Strip 'backend/' prefix if present (since we're already in backend/)
    if _raw_path.startswith('backend/'):
        _raw_path = _raw_path[len('backend/'):]
    _path = Path(_raw_path)
    if not _path.is_absolute():
        # Resolve relative to backend/ directory (grandparent of this file)
        _path = Path(__file__).resolve().parent.parent / _raw_path
    _SQLITE_DB_PATH = str(_path)

# PostgreSQL configuration
_DATABASE_URL_ENV = os.getenv(
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
        db_path = Path(_SQLITE_DB_PATH)
        
        # Try to create directory, fallback to /tmp or memory if read-only
        try:
            db_path.parent.mkdir(parents=True, exist_ok=True)
        except (OSError, PermissionError):
            # Filesystem is read-only (Vercel/serverless)
            # Use /tmp as fallback
            fallback_path = '/tmp/ujamaa.db'
            db_path = Path(fallback_path)
            try:
                db_path.parent.mkdir(parents=True, exist_ok=True)
            except (OSError, PermissionError):
                # Ultimate fallback: in-memory database
                return "sqlite:///:memory:"
            return f"sqlite:////{fallback_path}"
        
        # Use absolute path for SQLite
        if IS_VERCEL or str(db_path).startswith('/tmp'):
            return f"sqlite:////{_SQLITE_DB_PATH}"
        return f"sqlite:///{db_path.absolute()}"
    else:
        return _DATABASE_URL_ENV


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
    print(f"📊 Is Vercel: {IS_VERCEL}")
