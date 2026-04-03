# 🔧 Database Migration Guide

## Problem
When SQLAlchemy models are updated (new columns added), the existing SQLite database **is not automatically updated**. This causes `OperationalError: no such column` errors at runtime.

## Solution: Run Migration Script

**After any model change**, run:

```cmd
cd backend
python migrate_schema.py
```

This script:
1. Compares SQLAlchemy model columns vs actual SQLite schema
2. Identifies missing columns
3. Adds them automatically with correct types and defaults
4. Reports what was changed

## When to Run

- ✅ After adding a new column to any model
- ✅ After pulling code that includes model changes
- ✅ Before deploying to production
- ✅ When you see `no such column` errors

## Files

| File | Purpose |
|------|---------|
| `backend/migrate_schema.py` | Migration script (run this) |
| `backend/config/models.py` | SQLAlchemy model definitions (source of truth) |
| `backend/data/ujamaa.db` | SQLite database (gets updated) |

## Alternative: Recreate Database

If you don't care about existing data:

```cmd
del backend\data\ujamaa.db
python backend\setup_database.py
```

This creates a fresh database with the current schema.

## Current Status

**Last migration:** April 3, 2026  
**Missing columns:** 0  
**Status:** ✅ Database schema is in sync with models
