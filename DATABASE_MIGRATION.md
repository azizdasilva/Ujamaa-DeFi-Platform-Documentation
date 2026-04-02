# Database Migration Guide
## SQLite → PostgreSQL Migration

This guide helps you migrate from SQLite (development) to PostgreSQL (production).

---

## 📋 Prerequisites

1. **PostgreSQL Installed** (version 12+)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS (Homebrew)
   brew install postgresql
   
   # Windows
   # Download from: https://www.postgresql.org/download/windows/
   ```

2. **PostgreSQL Python Adapter**
   ```bash
   pip install psycopg2-binary
   ```

3. **Database Created**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE ujamaa_defi;
   
   # Create user (optional)
   CREATE USER ujamaa_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE ujamaa_defi TO ujamaa_user;
   
   # Exit
   \q
   ```

---

## 🔧 Migration Steps

### Step 1: Update .env File

**Before (SQLite):**
```env
DATABASE_TYPE=sqlite
SQLITE_DB_PATH=backend/data/ujamaa.db
```

**After (PostgreSQL):**
```env
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://ujamaa_user:your_secure_password@localhost:5432/ujamaa_defi
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20
DB_POOL_TIMEOUT=30
DB_POOL_RECYCLE=1800
```

### Step 2: Install PostgreSQL Dependencies

```bash
cd backend
pip install psycopg2-binary sqlalchemy
```

### Step 3: Update Database Schema

The schema is already defined in `backend/config/models.py`. SQLAlchemy will create tables automatically.

```bash
# Run database initialization
python init_db.py
```

### Step 4: Migrate Data (Optional)

If you have existing data in SQLite that needs to be migrated:

#### Option A: Manual Export/Import

1. **Export from SQLite:**
   ```bash
   cd backend/data
   sqlite3 ujamaa.db ".mode csv" ".output users.csv" "SELECT * FROM users;"
   sqlite3 ujamaa.db ".mode csv" ".output investor_profiles.csv" "SELECT * FROM investor_profiles;"
   sqlite3 ujamaa.db ".mode csv" ".output pools.csv" "SELECT * FROM pools;"
   sqlite3 ujamaa.db ".mode csv" ".output documents.csv" "SELECT * FROM documents;"
   ```

2. **Import to PostgreSQL:**
   ```bash
   psql -U ujamaa_user -d ujamaa_defi
   \copy users FROM '/path/to/users.csv' WITH CSV HEADER;
   \copy investor_profiles FROM '/path/to/investor_profiles.csv' WITH CSV HEADER;
   \copy pools FROM '/path/to/pools.csv' WITH CSV HEADER;
   \copy documents FROM '/path/to/documents.csv' WITH CSV HEADER;
   ```

#### Option B: Use Migration Tool

```bash
# Install pgloader
sudo apt-get install pgloader  # Ubuntu/Debian
brew install pgloader          # macOS

# Run migration
pgloader sqlite:///backend/data/ujamaa.db postgresql://ujamaa_user:password@localhost/ujamaa_defi
```

### Step 5: Test Connection

```bash
# Test backend with PostgreSQL
python -c "from config.database import get_database_url; print(get_database_url())"
```

### Step 6: Update Production Settings

In production `.env`:

```env
# Production settings
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=<generate-strong-random-key>

# Disable demo features
DEMO_MODE=False
TRANSACTION_SIMULATION=False

# Production database
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://user:password@prod-db-host:5432/ujamaa_defi

# Production RPC
RPC_URL=https://polygon-rpc.com/
```

---

## 🔍 Verification

### Check Tables Created

```bash
psql -U ujamaa_user -d ujamaa_defi

# List all tables
\dt

# Should see:
# - users
# - investor_profiles
# - pools
# - investments
# - documents
# - ult_transactions
# - transactions
# - compliance_activities
```

### Test Backend API

```bash
# Start backend
python main.py

# Test compliance endpoint
curl http://localhost:8000/api/v2/compliance/documents

# Test pools endpoint
curl http://localhost:8000/api/v2/pools
```

---

## 🚀 Production Deployment

### Docker Deployment

```dockerfile
FROM python:3.11-slim

# Install PostgreSQL dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY backend/ ./backend/

# Set environment variables
ENV DATABASE_TYPE=postgresql
ENV PYTHONPATH=/app

CMD ["python", "backend/main.py"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ujamaa_defi
      POSTGRES_USER: ujamaa_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: .
    environment:
      DATABASE_URL: postgresql://ujamaa_user:${DB_PASSWORD}@postgres:5432/ujamaa_defi
    depends_on:
      - postgres
    ports:
      - "8000:8000"

volumes:
  postgres_data:
```

---

## 🔧 Troubleshooting

### Connection Refused

**Error:** `could not connect to server: Connection refused`

**Solution:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Enable on boot
sudo systemctl enable postgresql
```

### Authentication Failed

**Error:** `FATAL: password authentication failed for user`

**Solution:**
```bash
# Reset password
psql -U postgres
ALTER USER ujamaa_user WITH PASSWORD 'new_password';
```

### Database Does Not Exist

**Error:** `database "ujamaa_defi" does not exist`

**Solution:**
```bash
psql -U postgres
CREATE DATABASE ujamaa_defi;
```

### Permission Denied

**Error:** `permission denied for table`

**Solution:**
```bash
psql -U postgres -d ujamaa_defi
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ujamaa_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ujamaa_user;
```

---

## 📊 Performance Optimization

### PostgreSQL Configuration

Edit `postgresql.conf`:

```conf
# Memory Settings
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 16MB
maintenance_work_mem = 128MB

# Connection Settings
max_connections = 100

# WAL Settings
wal_buffers = 16MB
checkpoint_completion_target = 0.9

# Logging
log_min_duration_statement = 1000
```

### Index Optimization

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_investor_kyc_status ON investor_profiles(kyc_status);
CREATE INDEX idx_documents_verification ON documents(verification_status);
CREATE INDEX idx_transactions_created ON transactions(created_at);
CREATE INDEX idx_compliance_activities_created ON compliance_activities(created_at);
```

---

## 📝 Rollback Plan

If you need to rollback to SQLite:

1. **Update .env:**
   ```env
   DATABASE_TYPE=sqlite
   ```

2. **Restart backend:**
   ```bash
   python main.py
   ```

3. **Data preserved:** SQLite database file remains untouched

---

## ✅ Migration Checklist

- [ ] PostgreSQL installed and running
- [ ] Database created
- [ ] User created with proper permissions
- [ ] `.env` file updated
- [ ] Dependencies installed (`psycopg2-binary`)
- [ ] Tables created successfully
- [ ] Data migrated (if applicable)
- [ ] Backend API tested
- [ ] Frontend connection verified
- [ ] Performance optimized
- [ ] Backup strategy in place

---

## 📚 Additional Resources

- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **SQLAlchemy Documentation**: https://docs.sqlalchemy.org/
- **Pgloader**: https://pgloader.io/

---

**Need Help?** Refer to `IMPLEMENTATION_SUMMARY.md` or contact the development team.

**Version**: 2.0.0-mvp-testnet  
**Last Updated**: April 2, 2026
