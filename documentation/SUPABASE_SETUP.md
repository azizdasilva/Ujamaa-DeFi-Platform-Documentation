# Supabase Setup & Migration Guide - Ujamaa DeFi Platform

## Quick Setup (5 Minutes)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click **"New Project"**
3. Fill in:
   - **Organization**: Your org name
   - **Project name**: `ujamaa-defi`
   - **Database Password**: Click **"Generate a new password"** (SAVE IT!)
   - **Region**: Choose closest to your users (e.g., `East US (North Virginia)`)
4. Click **"Create new project"**
5. Wait ~2 minutes for provisioning

### Step 2: Get Database Connection String

1. In Supabase dashboard, go to **Project Settings** (gear icon)
2. Click **Database** in left sidebar
3. Under **Connection string**, select **URI** tab
4. Copy the connection string (looks like):
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@db.[project-ref].supabase.co:5432/postgres
   ```

### Step 3: Update Local .env

In `backend/.env`, update these lines:

```env
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@db.[project-ref].supabase.co:5432/postgres
```

Replace `[project-ref]` and `[YOUR-PASSWORD]` with your actual values.

### Step 4: Run Migration Script

```bash
cd backend
python migrate_to_supabase.py
```

This will:
- ✅ Create all tables in Supabase PostgreSQL
- ✅ Copy all your local SQLite data to Supabase
- ✅ Verify data integrity

### Step 5: Set Vercel Environment Variables

1. Go to https://vercel.com → Your backend project → **Settings**
2. Click **Environment Variables**
3. Add these variables:

| Variable | Value |
|----------|-------|
| `DATABASE_TYPE` | `postgresql` |
| `DATABASE_URL` | `postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres` |

4. Click **Save**
5. **Redeploy** your backend

### Step 6: Verify Deployment

After redeployment:
1. Open your Vercel backend URL
2. Navigate to `/docs` (Swagger UI)
3. Test endpoints - they should now use persistent PostgreSQL
4. Check bank accounts - data should persist between cold starts

---

## Troubleshooting

### Migration Fails with "Cannot connect to PostgreSQL"

- Verify DATABASE_URL format is correct
- Check password doesn't contain unescaped special characters
- Ensure Supabase project is fully provisioned (wait 2-3 min after creation)

### "Table already exists" Error During Migration

The migration script handles this. If it persists:
```bash
# In Supabase dashboard → SQL Editor, run:
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
Then run migration again.

### Vercel Still Shows Empty Data After Deploy

1. Verify environment variables are set in Vercel dashboard
2. Check Vercel deployment logs for database connection errors
3. Ensure `DATABASE_TYPE=postgresql` is set (not sqlite)

### Local Development Still Uses SQLite

This is **intentional**. Keep `DATABASE_TYPE=sqlite` in local `.env` for development.
Only Vercel deployment uses PostgreSQL.

---

## Architecture After Migration

```
Local Development:
  └─ SQLite (data/ujamaa.db) - Fast, no setup

Vercel Production:
  └─ Supabase PostgreSQL - Persistent, reliable
```

Both environments work identically from the application perspective.

---

## Future: Switching Local Dev to PostgreSQL

If you want local dev to also use Supabase (for testing):

```env
# In backend/.env
DATABASE_TYPE=postgresql
DATABASE_URL=your-supabase-url
```

Then restart your backend.

---

## Backup Strategy

### Backup from Supabase
1. Supabase Dashboard → **Database** → **Backups**
2. Click **"Create backup"**
3. Download when ready

### Restore to Local SQLite
```bash
# Export from Supabase
pg_dump [DATABASE_URL] > backup.sql

# Import to SQLite (requires manual schema adjustment)
# Or use the migration script in reverse (future feature)
```
