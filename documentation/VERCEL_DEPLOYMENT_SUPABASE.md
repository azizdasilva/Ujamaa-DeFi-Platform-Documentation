# Vercel Deployment Guide - Supabase PostgreSQL

## Overview

This guide covers deploying the Ujamaa DeFi Platform backend to Vercel with Supabase PostgreSQL for persistent, reliable data storage.

**Problem Solved**: SQLite on Vercel stores data in `/tmp`, which is wiped on every cold start, causing:
- ❌ Data loss between server restarts
- ❌ Inconsistent bank account information
- ❌ Missing user-created data

**Solution**: Supabase PostgreSQL provides persistent storage that survives cold starts.

---

## Prerequisites

- ✅ Supabase project created (5 min setup)
- ✅ Supabase DATABASE_URL copied
- ✅ Local SQLite database with your data (optional, for migration)

---

## Step-by-Step Deployment

### 1. Migrate Local Data to Supabase

If you have existing data in your local SQLite database:

```bash
cd backend
python migrate_to_supabase.py
```

**What this does:**
- Creates all tables in Supabase PostgreSQL
- Copies all data from SQLite → PostgreSQL
- Verifies data integrity
- Keeps your local SQLite unchanged

**Expected output:**
```
📂 Source SQLite URL: sqlite:////path/to/data/ujamaa.db
   Found 18 tables in SQLite

🌐 Target PostgreSQL URL: postgresql://postgres.xxxxx...
✅ PostgreSQL connection successful

📋 Creating schema in PostgreSQL...
✅ Schema created successfully

🔄 Starting data migration...
   Migrating table: users... ✅ 6 rows migrated
   Migrating table: investor_profiles... ✅ 3 rows migrated
   Migrating table: bank_accounts... ✅ 2 rows migrated
   ...
   
✅ Migration complete! Total rows migrated: 47
```

### 2. Update Vercel Environment Variables

1. Go to **Vercel Dashboard** → Your backend project
2. Click **Settings** → **Environment Variables**
3. Add these variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_TYPE` | `postgresql` | Production, Preview, Development |
| `DATABASE_URL` | `postgresql://postgres.xxxxx:xxxxx@db.xxxxx.supabase.co:5432/postgres` | Production, Preview, Development |

4. Click **Save** for each variable

**⚠️ Important**: Do NOT commit DATABASE_URL to Git. Only set it in Vercel dashboard.

### 3. Deploy to Vercel

#### Option A: Deploy via Git Push (Recommended)

```bash
git add backend/
git commit -m "feat: configure Supabase PostgreSQL for persistent storage"
git push
```

Vercel will automatically deploy with the new database configuration.

#### Option B: Deploy via Vercel CLI

```bash
cd backend
vercel --prod
```

### 4. Verify Deployment

1. Open your deployed backend URL
2. Navigate to `/docs` (Swagger UI)
3. Test these endpoints:

**Check database connection:**
```bash
curl https://your-backend.vercel.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "postgresql",
  "version": "1.0.0"
}
```

**Check bank accounts persist:**
```bash
curl https://your-backend.vercel.app/api/admin/bank-accounts
```

This should return your migrated bank account data.

### 5. Test Cold Start Persistence

1. Make a change via API (e.g., create a new bank account)
2. Wait for Vercel cold start (or trigger a new deployment)
3. Query the data again - it should still be there!

---

## Architecture After Migration

```
┌─────────────────────────────────────────────────────────┐
│                    Local Development                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  DATABASE_TYPE=sqlite                             │   │
│  │  SQLite: data/ujamaa.db                           │   │
│  │  Fast, no setup, isolated                          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Vercel Production                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  DATABASE_TYPE=postgresql                          │   │
│  │  Supabase PostgreSQL (persistent)                  │   │
│  │  Survives cold starts                              │   │
│  │  Reliable, scalable                                │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Key Point**: Both environments work identically from the application perspective. SQLAlchemy handles the database differences automatically.

---

## Troubleshooting

### Issue: "Cannot connect to PostgreSQL" on Vercel

**Symptoms**:
```
❌ Database initialization note: (psycopg2.OperationalError) connection refused
```

**Solutions**:
1. Verify `DATABASE_URL` is set correctly in Vercel environment variables
2. Check for typos in the connection string
3. Ensure Supabase project is active (check Supabase dashboard)
4. Verify password doesn't contain unescaped special characters

### Issue: Data still disappears after cold start

**Symptoms**: Bank accounts show empty data after Vercel restarts

**Solutions**:
1. Verify `DATABASE_TYPE=postgresql` is set in Vercel (not sqlite)
2. Check Vercel deployment logs for database type being used
3. Ensure environment variables are applied to the correct environment (Production)

### Issue: Migration script fails

**Symptoms**:
```
❌ Migration failed: (psycopg2.errors.UniqueViolation) duplicate key
```

**Solutions**:
1. If Supabase already has tables, drop them first:
   ```sql
   -- In Supabase SQL Editor
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   ```
2. Run migration script again

### Issue: Local development broken after changes

**Symptoms**: Local backend won't start

**Solutions**:
1. Ensure `backend/.env` has `DATABASE_TYPE=sqlite` for local dev
2. Restart your local backend
3. Local SQLite should be unaffected by Supabase changes

---

## Rollback Plan

If you need to revert to SQLite on Vercel (not recommended):

1. Remove `DATABASE_TYPE` and `DATABASE_URL` from Vercel environment variables
2. Deploy again - Vercel will fallback to SQLite at `/tmp`
3. **Warning**: Data will be lost on cold starts

---

## Cost Analysis

### Supabase Free Tier
- **Database size**: 500 MB (plenty for MVP)
- **Bandwidth**: 5 GB/month
- **API requests**: Unlimited
- **Real-time connections**: 200 concurrent

**Your usage**: ~47 rows currently, well within free tier limits.

### Vercel Free Tier
- **Serverless functions**: 100 GB-hours/month
- **Executions**: 1M/month
- **Cold starts**: ~3-5 seconds (acceptable for MVP)

---

## Next Steps

After successful deployment:

1. **Monitor Usage**: Check Supabase dashboard for database size
2. **Set Up Backups**: Supabase → Database → Backups → Enable automated backups
3. **Add Monitoring**: Set up Vercel alerts for deployment failures
4. **Update Frontend**: Ensure frontend API calls point to correct backend URL

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Python**: https://vercel.com/docs/functions/serverless-functions/runtimes/python
- **SQLAlchemy**: https://docs.sqlalchemy.org/

For issues, check:
1. Vercel deployment logs
2. Supabase database logs
3. Environment variable configuration
4. Network connectivity between Vercel and Supabase
