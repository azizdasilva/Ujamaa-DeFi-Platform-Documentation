# Vercel Deployment Instructions - Supabase PostgreSQL

## Current Status

✅ **Everything is configured and ready to deploy!**
- Supabase connection string configured
- Database migration script prepared
- Vercel configuration updated
- PostgreSQL drivers installed (psycopg2-binary, asyncpg)

## ⚠️ Local Migration Issue

Your current network cannot resolve the Supabase database host (`db.ydpoamufwyyfxejmahxu.supabase.co`). This is a DNS/firewall issue blocking port 5432.

**The REST API is reachable** (HTTP works), so your Supabase project is active.

## Solution: Deploy to Vercel First

Vercel's servers can reach Supabase without issues. Here's the deployment process:

### Step 1: Set Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Select your backend project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Variable | Value |
|----------|-------|
| `DATABASE_TYPE` | `postgresql` |
| `DATABASE_URL` | `postgresql://postgres:4%3C%3D%5EJ%3EDms%3D9@db.ydpoamufwyyfxejmahxu.supabase.co:5432/postgres` |

5. Save both variables

### Step 2: Commit and Push

```bash
git add backend/
git commit -m "feat: configure Supabase PostgreSQL for persistent storage"
git push
```

Vercel will automatically deploy with the new configuration.

### Step 3: Verify Deployment

Once deployed, test your backend:

1. Open: `https://your-backend-url.vercel.app/docs`
2. Check the health endpoint
3. Test the bank accounts endpoint - data should persist!

### Step 4: Migrate Data (Optional)

If you want to migrate your local SQLite data to Supabase:

**Option A**: Try migration from a different network (home internet, mobile hotspot)
```bash
cd backend
python migrate_to_supabase.py
```

**Option B**: Use Supabase SQL Editor to run seed data directly
- Open Supabase Dashboard → SQL Editor
- Run the seed data manually

**Option C**: Deploy and accept that Vercel will seed fresh data on first startup
- The backend auto-seeds if the database is empty
- You'll have all demo users and sample data

## Expected Behavior After Deployment

✅ **Data persists between cold starts**
✅ **Bank accounts show correct data**
✅ **All user information is retained**
✅ **No more empty /tmp database issues**

## Local Development

Your local environment can still use SQLite for development:

```env
# In backend/.env (for local dev only)
DATABASE_TYPE=sqlite
```

Or if you want local to also use Supabase (when network allows):
```env
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://postgres:4%3C%3D%5EJ%3EDms%3D9@db.ydpoamufwyyfxejmahxu.supabase.co:5432/postgres
```

## Troubleshooting

### If Vercel Can't Connect to Supabase

1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Ensure Supabase project is active

### If Database is Empty After Deployment

The backend will auto-seed on first startup with demo data. This is expected behavior.

## Next Steps After Deployment

1. Test all admin endpoints
2. Verify bank accounts display correctly
3. Create a test user and ensure data persists
4. Set up Supabase backups (Dashboard → Database → Backups)
