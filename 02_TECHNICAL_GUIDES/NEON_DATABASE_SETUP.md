# Neon Database Setup Guide

This guide will help you set up and configure Neon database for the Ujamaa DeFi Platform.

## Prerequisites

- A Neon account (free tier available): https://console.neon.tech
- Python 3.8+ installed
- Backend dependencies installed (`pip install -r backend/requirements.txt`)

## Step 1: Create a Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Sign up or log in
3. Click **"Create Project"**
4. Choose a project name (e.g., `ujamaa-defi`)
5. Select a region close to you
6. Click **"Create Project"**

## Step 2: Get Your Connection String

1. In your Neon project dashboard, click **"Connection Details"**
2. Copy the connection string. It should look like:
   ```
   postgresql://neondb_owner:npg_xxxxxxxx@ep-xxxxxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. **Important**: Replace `neondb` with `ujamaa_defi` at the end of the URL

## Step 3: Configure Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Update the following variables in `.env`:
   ```env
   DATABASE_TYPE=postgresql
   DATABASE_URL=postgresql://neondb_owner:npg_xxxxxxxx@ep-xxxxxx.region.aws.neon.tech/ujamaa_defi?sslmode=require
   ```

   Replace the connection string with your actual Neon connection string.

## Step 4: Initialize the Database

Run the database initialization script to create tables and seed demo data:

```bash
cd backend
python setup_database.py
```

This will:
- Create all necessary tables
- Seed demo users (institutional, retail, admin, etc.)
- Create 5 investment pools
- Add sample positions and financings

## Step 5: Verify the Connection

Start the backend server:

```bash
cd backend
python -m uvicorn main:app --reload
```

Visit `http://localhost:8000/api/v2/db/pools` in your browser or use:

```bash
curl http://localhost:8000/api/v2/db/pools
```

You should see a JSON response with the pool data.

## Troubleshooting

### Connection Error: "could not translate host name"

**Issue**: Backend cannot connect to the Neon database

**Solutions**:
1. Verify your `.env` file has the correct `DATABASE_URL`
2. Ensure `DATABASE_TYPE=postgresql` is set
3. Check that your Neon project is active
4. Verify your IP is not blocked by Neon firewall settings
5. Test the connection string with `psql`:
   ```bash
   psql "postgresql://neondb_owner:PASSWORD@ep-xxxx.region.aws.neon.tech/ujamaa_defi?sslmode=require"
   ```

### SSL Mode Issues

If you encounter SSL errors, ensure your connection string includes `?sslmode=require` at the end.

### Table Already Exists Errors

If tables already exist but schema is outdated, run:

```bash
python backend/init_db.py --reset
```

**Warning**: This will drop all existing data!

### No Data in Pools

If the pools endpoint returns an empty array:

```bash
python backend/setup_database.py
```

## Useful Commands

### Check Database Status
```bash
python backend/check_counts.py
```

### Sync Local Data to Neon
Open Neon SQL Editor at https://console.neon.tech and run the `backend/neon_sync.sql` file.

### Fix Schema Issues
```bash
python backend/sync_neon_direct.py
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_TYPE` | `sqlite` or `postgresql` | `sqlite` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `DB_POOL_SIZE` | Connection pool size | `5` |
| `DB_MAX_OVERFLOW` | Max overflow connections | `10` |
| `DB_POOL_TIMEOUT` | Pool timeout (seconds) | `30` |
| `DB_POOL_RECYCLE` | Connection recycle time (seconds) | `1800` |

## Next Steps

After setting up Neon database:

1. Test all API endpoints
2. Verify the frontend can load pools
3. Run the application in demo mode
4. Configure proper user authentication

## Support

For issues or questions:
- Check the main documentation: `/documentation`
- Review backend logs for detailed error messages
- Visit Neon docs: https://neon.tech/docs
