"""
Ujamaa DeFi Platform - MVP Backend API

Main FastAPI application entry point.

@reference SRS v2.0 Section 4
@reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md

@notice MVP TESTNET: This is a testnet deployment. No real funds.
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.docs import get_swagger_ui_html
from datetime import datetime
import time

from config.MVP_config import mvp_config
from api.pools import router as pools_router
from api.compliance import router as compliance_router
from api.compliance_documents import router as compliance_documents_router
from api.database_api import router as database_router
from api.admin import router as admin_router
from api.originator import router as originator_router
from api.kpis import router as kpis_router
from api.monitoring import router as monitoring_router
from api.ulp_monitoring import router as ulp_monitoring_router

# =============================================================================
# APPLICATION INITIALIZATION
# =============================================================================

app = FastAPI(
    title="Ujamaa DeFi Platform - MVP API",
    description="""
## 🚀 MVP: Institutional Architecture - Testnet Release

**This is a testnet deployment. No real funds are handled.**

### Network
- **Network:** Polygon Amoy Testnet
- **Chain ID:** 80002
- **Block Explorer:** https://amoy.polygonscan.com/

### Features
- **Liquidity Pools:** 5 pool families (Industrie, Agriculture, Trade Finance, Renewable Energy, Real Estate)
- **Yield-Bearing Tokens:** uLP (Ujamaa Pool Token) with value-accrual model
- **Compliance:** Jurisdiction verification (12 blocked countries)
- **Mock Services:** Bank escrow, GDIZ integration, fiat ramps

### Rate Limits
- **Public endpoints:** 100 requests/minute
- **Authenticated endpoints:** 1000 requests/hour

### Base URL
```
http://localhost:8000/api/v2
```
    """,
    version="2.0.0-mvp-testnet",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# =============================================================================
# MIDDLEWARE
# =============================================================================

# CORS Middleware - Configure for production deployment
CORS_ORIGINS = [
    # Local Development
    "http://localhost:5173",      # Vite (React)
    "http://localhost:3000",      # Next.js/React
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",

    # Vercel Production
    "https://ujamaa-de-fi-platform.vercel.app",  # Your Vercel frontend
    "https://ujamaa-mvp.vercel.app",             # Alternative URL

    # Add more production URLs as needed
    # "https://your-custom-domain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,      # IMPORTANT: Allow cookies/auth headers
    allow_methods=["*"],         # All HTTP methods
    allow_headers=["*"],         # All headers
    expose_headers=["*"],        # Expose all headers to frontend
    max_age=600,                 # Cache preflight for 10 minutes
)

# Add CORS headers to ALL responses including errors
@app.middleware("http")
async def add_cors_to_errors(request: Request, call_next):
    """Ensure CORS headers are present even on errors"""
    try:
        response = await call_next(request)
        return response
    except Exception as exc:
        # On exception, return 500 with CORS headers
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(exc)},
            headers={
                "Access-Control-Allow-Origin": request.headers.get("origin", "http://localhost:5173"),
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": "true",
            }
        )


@app.middleware("http")
async def add_disclaimer_header(request: Request, call_next):
    """Add testnet disclaimer to all responses"""
    response = await call_next(request)
    response.headers["X-MVP-Testnet"] = "true"
    response.headers["X-Disclaimer"] = "MVP: No real funds handled"
    return response


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests for debugging"""
    start_time = time.time()
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    response.headers["X-Process-Time"] = str(duration)
    
    if mvp_config.DEBUG if hasattr(mvp_config, 'DEBUG') else True:
        print(f"{request.method} {request.url.path} - {response.status_code} - {duration:.3f}s")
    
    return response


# =============================================================================
# EXCEPTION HANDLERS
# =============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "path": request.url.path,
            "timestamp": datetime.utcnow().isoformat(),
            "is_testnet": mvp_config.IS_MVP
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc),
            "path": request.url.path,
            "timestamp": datetime.utcnow().isoformat(),
            "is_testnet": mvp_config.IS_MVP
        }
    )


# =============================================================================
# ROUTES
# =============================================================================

# Include API routers
app.include_router(pools_router)
app.include_router(compliance_router)
app.include_router(compliance_documents_router)
app.include_router(database_router)
app.include_router(admin_router)
app.include_router(originator_router)
app.include_router(kpis_router)
app.include_router(monitoring_router)
app.include_router(ulp_monitoring_router)


@app.get("/")
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "name": "Ujamaa DeFi Platform - MVP API",
        "version": "2.0.0-mvp-testnet",
        "status": "running",
        "is_testnet": True,
        "testnet_notice": "🚀 MVP: Institutional Architecture - Testnet Release",
        "disclaimer": "This is a testnet deployment. No real funds are handled.",
        "network": {
            "name": "Polygon Amoy",
            "chain_id": mvp_config.CHAIN_ID,
            "rpc_url": mvp_config.RPC_URL,
            "block_explorer": mvp_config.BLOCK_EXPLORER
        },
        "docs": {
            "swagger": "/docs",
            "redoc": "/redoc",
            "openapi": "/openapi.json"
        },
        "endpoints": {
            "pools": "/api/v2/pools",
            "compliance": "/api/v2/compliance"
        },
        "rate_limits": {
            "public": f"{mvp_config.RATE_LIMIT_PUBLIC} requests/minute",
            "authenticated": f"{mvp_config.RATE_LIMIT_AUTHENTICATED} requests/hour"
        }
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "is_testnet": True,
        "mvp_mode": mvp_config.IS_MVP,
        "mock_services": {
            "bank": mvp_config.MOCK_BANK,
            "escrow": mvp_config.MOCK_ESCROW,
            "gdiz": mvp_config.MOCK_GDIZ,
            "fiat_ramp": mvp_config.MOCK_FIAT_RAMP,
            "kyb": mvp_config.MOCK_KYB
        }
    }


@app.get("/config")
async def get_config():
    """
    Get MVP configuration (public, non-sensitive).
    """
    return {
        "is_mvp": mvp_config.IS_MVP,
        "is_testnet": mvp_config.MVP_TESTNET,
        "network": {
            "name": mvp_config.NETWORK_NAME,
            "chain_id": mvp_config.CHAIN_ID,
        },
        "mock_services": {
            "bank": mvp_config.MOCK_BANK,
            "escrow": mvp_config.MOCK_ESCROW,
            "gdiz": mvp_config.MOCK_GDIZ,
            "fiat_ramp": mvp_config.MOCK_FIAT_RAMP,
            "kyb": mvp_config.MOCK_KYB
        },
        "limits": {
            "max_deposit": f"{mvp_config.MAX_DEPOSIT / 10**18:,.0f} UJEUR",
            "min_deposit": f"{mvp_config.MIN_DEPOSIT / 10**18:,.0f} UJEUR",
            "daily_withdrawal": f"{mvp_config.DAILY_WITHDRAWAL_LIMIT / 10**18:,.0f} UJEUR",
            "institutional_min": f"{mvp_config.INSTITUTIONAL_MIN / 10**18:,.0f} UJEUR",
            "retail_max": f"{mvp_config.RETAIL_MAX / 10**18:,.0f} UJEUR"
        },
        "fees": {
            "management_fee": f"{mvp_config.YIELD_MANAGEMENT_FEE * 100:.1f}%",
            "performance_fee": f"{mvp_config.YIELD_PERFORMANCE_FEE * 100:.1f}%",
            "hurdle_rate": f"{mvp_config.YIELD_HURDLE_RATE * 100:.1f}%",
            "fx_fee": f"{mvp_config.FX_FEE_INVESTMENT * 100:.1f}%"
        },
        "compliance": {
            "blocked_jurisdictions_count": len(mvp_config.BLOCKED_JURISDICTIONS),
            "allowed_african_markets": mvp_config.ALLOWED_AFRICAN_MARKETS,
            "allowed_international": mvp_config.ALLOWED_INTERNATIONAL,
            "kyb_threshold": f"€{mvp_config.KYB_THRESHOLD_EUR:,}"
        },
        "pools": {
            "families": list(mvp_config.POOLS.keys()),
            "count": len(mvp_config.POOLS)
        },
        "disclaimer": mvp_config.DISCLAIMER_FOOTER
    }


@app.get("/disclaimer")
async def get_disclaimer():
    """
    Get full testnet disclaimer.
    """
    return {
        "header": mvp_config.DISCLAIMER_HEADER,
        "footer": mvp_config.DISCLAIMER_FOOTER,
        "modal": mvp_config.DISCLAIMER_MODAL,
        "network": {
            "testnet": "Polygon Amoy",
            "chain_id": 80002,
            "production": "Polygon Mainnet (Chain ID: 137)"
        },
        "mock_services": [
            "Bank Escrow (BIIC/MCB production)",
            "Fiat Ramp (Circle UJEUR production)",
            "GDIZ Gateway (Industrial production)",
            "KYB Provider (Sumsub/Onfido production)"
        ],
        "production_swap": "Factory pattern enables mock → production swap with zero code changes"
    }


# =============================================================================
# STARTUP EVENTS
# =============================================================================

@app.on_event("startup")
async def startup_event():
    """
    Application startup event.
    On Vercel/serverless, seed the database on every cold start.
    """
    print("=" * 60)
    print("Ujamaa DeFi Platform - MVP API")
    print("=" * 60)
    print(f"Network: {mvp_config.NETWORK_NAME} (Chain ID: {mvp_config.CHAIN_ID})")
    print(f"Block Explorer: {mvp_config.BLOCK_EXPLORER}")
    print(f"Mode: MVP Testnet")
    print(f"Mock Services:")
    print(f"   - Bank: {mvp_config.MOCK_BANK}")
    print(f"   - Escrow: {mvp_config.MOCK_ESCROW}")
    print(f"   - GDIZ: {mvp_config.MOCK_GDIZ}")
    print(f"   - Fiat Ramp: {mvp_config.MOCK_FIAT_RAMP}")
    print(f"   - KYB: {mvp_config.MOCK_KYB}")
    print(f"API Docs: http://localhost:{mvp_config.API_PORT if hasattr(mvp_config, 'API_PORT') else 8000}/docs")
    print("=" * 60)
    print("DISCLAIMER: This is a testnet deployment. No real funds.")
    print("=" * 60)

    # Auto-initialize database on startup
    import os
    from config.database import DATABASE_TYPE, SessionLocal, engine
    from config.models import Base

    is_vercel = os.getenv('VERCEL', '') == '1' or os.getenv('VERCEL_ENV') is not None

    # For PostgreSQL (Neon), only create tables if they don't exist
    # For SQLite on Vercel (/tmp), seed with demo data (ephemeral storage)
    if DATABASE_TYPE == 'postgresql':
        print(f"\n📊 Using PostgreSQL (Neon) - persistent database")
        try:
            # Create tables if they don't exist (safe for PostgreSQL)
            Base.metadata.create_all(bind=engine)
            print("✅ Database schema verified")

            # Check if database is empty (fresh Neon instance)
            from sqlalchemy import text
            with engine.connect() as conn:
                result = conn.execute(text("SELECT COUNT(*) FROM users"))
                user_count = result.scalar()

            if user_count == 0:
                print("🌱 Fresh PostgreSQL instance - seeding demo data...")
                from setup_database import seed_all
                seed_all()
                print("✅ Database seeded successfully")
            else:
                print(f"✅ Database already contains data ({user_count} users) - skipping seed")
        except Exception as e:
            print(f"⚠️  Database initialization note: {e}")
    elif is_vercel:
        # SQLite on Vercel uses /tmp (ephemeral) - always seed
        print(f"\n🌱 Vercel + SQLite detected - ephemeral /tmp storage")
        try:
            Base.metadata.create_all(bind=engine)
            from setup_database import seed_all
            seed_all()
            print("✅ Database seeded successfully")
        except Exception as e:
            print(f"⚠️  Seed failed (may already be seeded): {e}")

    # Load thresholds from database into memory
    try:
        from api.admin import load_thresholds_from_db
        db = SessionLocal()
        load_thresholds_from_db(db)
        db.close()
        print("✅ Thresholds loaded from database")
    except Exception as e:
        print(f"⚠️  Threshold load from DB (using defaults): {e}")


# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=mvp_config.API_HOST if hasattr(mvp_config, 'API_HOST') else "0.0.0.0",
        port=mvp_config.API_PORT if hasattr(mvp_config, 'API_PORT') else 8001,
        reload=mvp_config.DEBUG if hasattr(mvp_config, 'DEBUG') else True,
        log_level="info"
    )
