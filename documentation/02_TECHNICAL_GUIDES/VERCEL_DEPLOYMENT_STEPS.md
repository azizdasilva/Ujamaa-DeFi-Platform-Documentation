# Vercel Deployment Instructions - Neon PostgreSQL

## Overview

This guide covers deploying the Ujamaa DeFi Platform backend to Vercel with Neon PostgreSQL for persistent, reliable data storage.

**Problem Solved**: SQLite on Vercel stores data in `/tmp`, which is wiped on every cold start, causing:
- ❌ Data loss between server restarts
- ❌ Inconsistent bank account information
- ❌ Missing user-created data

**Solution**: Neon PostgreSQL provides persistent storage that survives cold starts.

---

## Database Configuration

### Local Development
- Uses **Neon PostgreSQL** (same as production)
- Both local and Vercel share the same Neon database
- Ensures 100% data consistency

### Vercel Production
- Uses **Neon PostgreSQL** (persistent)
- Environment variables set in Vercel dashboard
- Survives cold starts

---

## Step-by-Step Deployment

### 1. Set Vercel Environment Variables

1. Go to **Vercel Dashboard** → Your backend project
2. Click **Settings** → **Environment Variables**
3. Add these variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_TYPE` | `postgresql` | Production, Preview, Development |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_rcdLBmN3eD2I@ep-flat-violet-adszjxii.c-2.us-east-1.aws.neon.tech/ujamaa?sslmode=require` | Production, Preview, Development |

4. Click **Save** for each variable

### 2. Deploy to Vercel

Vercel will automatically deploy with the new database configuration.

### 3. Verify Deployment

1. Open your deployed backend URL
2. Navigate to `/docs` (Swagger UI)
3. Test the health endpoint:
   ```bash
   curl https://your-backend.vercel.app/health
   ```

4. Test the bank accounts endpoint:
   ```bash
   curl https://your-backend.vercel.app/api/v2/db/pools
   ```

### 4. Test Cold Start Persistence

1. Make a change via API (e.g., create a new bank account)
2. Wait for Vercel cold start (or trigger a new deployment)
3. Query the data again - it should still be there!

---

## Architecture After Migration

```
┌─────────────────────────────────────────────────────────┐
│                    Local Development                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  DATABASE_TYPE=postgresql                          │   │
│  │  Neon PostgreSQL (persistent)                     │   │
│  │  Same database as Vercel                          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Vercel Production                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  DATABASE_TYPE=postgresql                          │   │
│  │  Neon PostgreSQL (persistent)                     │   │
│  │  Same database as local                           │   │
│  │  Survives cold starts                              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Key Point**: Both environments use the **same Neon database** for 100% consistency.

---

## Troubleshooting

### Issue: "Cannot connect to PostgreSQL" on Vercel

**Solutions**:
1. Verify `DATABASE_URL` is set correctly in Vercel environment variables
2. Check for typos in the connection string
3. Ensure Neon project is active

### Issue: Data still disappears after cold start

**Solutions**:
1. Verify `DATABASE_TYPE=postgresql` is set in Vercel (not sqlite)
2. Check Vercel deployment logs for database type being used

---

## Cost Analysis

### Neon Free Tier
- **Database size**: 5 GB (plenty for MVP)
- **Bandwidth**: Unlimited
- **API requests**: Unlimited
- **Compute**: Auto-scales to zero when idle

### Vercel Free Tier
- **Serverless functions**: 100 GB-hours/month
- **Executions**: 1M/month
- **Cold starts**: ~3-5 seconds (acceptable for MVP)

---

## Next Steps

After successful deployment:

1. **Monitor Usage**: Check Neon dashboard for database size
2. **Set Up Backups**: Neon Dashboard → Settings → Backups
3. **Add Monitoring**: Set up Vercel alerts for deployment failures
