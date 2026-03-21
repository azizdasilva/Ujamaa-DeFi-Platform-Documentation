"""
Backend Integration Tests - MVP-2

Phase 5: Integration & Testing

@reference 02_MVP_IMPLEMENTATION_PLAN.md Phase 5
@notice MVP-2 TESTNET: This is a testnet deployment. No real funds.
"""

import pytest
from fastapi.testclient import TestClient
from typing import Dict, Any

# Import main app
import sys
sys.path.append('backend')

from main import app
from services.MVP.mock_bank import MockBankService, get_bank_service
from services.MVP.mock_gdiz import MockGDIZService, get_gdiz_service
from services.MVP.yield_calculator import YieldCalculator, calculate_daily_yield
from config.MVP_config import mvp_config

# Test client
client = TestClient(app)


# =============================================================================
# Fixtures
# =============================================================================

@pytest.fixture
def client():
    """FastAPI test client"""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def bank_service():
    """Mock bank service"""
    return MockBankService()


@pytest.fixture
def gdiz_service():
    """Mock GDIZ service"""
    return MockGDIZService()


@pytest.fixture
def yield_calculator():
    """Yield calculator"""
    return YieldCalculator()


# =============================================================================
# API Endpoint Tests
# =============================================================================

class TestRootEndpoints:
    """Test root API endpoints"""
    
    def test_root(self, client):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["is_testnet"] is True
        assert "MVP-2" in data["version"]
    
    def test_health(self, client):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["is_testnet"] is True
    
    def test_config(self, client):
        """Test config endpoint"""
        response = client.get("/config")
        assert response.status_code == 200
        data = response.json()
        assert data["is_mvp"] is True
        assert data["is_testnet"] is True
        assert data["network"]["chain_id"] == 80002


class TestPoolEndpoints:
    """Test pool API endpoints"""
    
    def test_list_pools(self, client):
        """Test list all pools"""
        response = client.get("/api/v2/pools")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 5  # 5 pool families
    
    def test_get_pool(self, client):
        """Test get pool details"""
        response = client.get("/api/v2/pools/POOL_INDUSTRIE")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "POOL_INDUSTRIE"
        assert data["family"] == "INDUSTRIE"
    
    def test_get_pool_not_found(self, client):
        """Test get non-existent pool"""
        response = client.get("/api/v2/pools/INVALID_POOL")
        assert response.status_code == 404
    
    def test_get_pool_stats(self, client):
        """Test pool statistics"""
        response = client.get("/api/v2/pools/POOL_AGRICULTURE/stats")
        assert response.status_code == 200
        data = response.json()
        assert "pool_id" in data
        assert "total_value" in data
    
    def test_invest_in_pool(self, client):
        """Test investment in pool"""
        payload = {
            "pool_id": "POOL_INDUSTRIE",
            "amount": "1000000000000000000000",  # 1K UJEUR (18 decimals)
            "investor_id": "TEST-INVESTOR-001"
        }
        response = client.post(
            "/api/v2/pools/POOL_INDUSTRIE/invest",
            json=payload
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "shares_minted" in data
    
    def test_invest_below_minimum(self, client):
        """Test investment below minimum"""
        payload = {
            "pool_id": "POOL_INDUSTRIE",
            "amount": "100000000000000000000",  # 100 UJEUR (below 1K min)
            "investor_id": "TEST-INVESTOR-001"
        }
        response = client.post(
            "/api/v2/pools/POOL_INDUSTRIE/invest",
            json=payload
        )
        assert response.status_code == 400
    
    def test_get_portfolio(self, client):
        """Test investor portfolio"""
        response = client.get("/api/v2/pools/portfolio/TEST-INVESTOR-001")
        assert response.status_code == 200
        data = response.json()
        assert "investor_id" in data
        assert "positions" in data


class TestComplianceEndpoints:
    """Test compliance API endpoints"""
    
    def test_check_jurisdiction_allowed(self, client):
        """Test jurisdiction check - allowed"""
        payload = {"jurisdiction": "US"}
        response = client.post(
            "/api/v2/compliance/check-jurisdiction",
            json=payload
        )
        assert response.status_code == 200
        data = response.json()
        assert data["is_blocked"] is False
        assert data["is_allowed"] is True
    
    def test_check_jurisdiction_blocked(self, client):
        """Test jurisdiction check - blocked"""
        payload = {"jurisdiction": "KP"}
        response = client.post(
            "/api/v2/compliance/check-jurisdiction",
            json=payload
        )
        assert response.status_code == 200
        data = response.json()
        assert data["is_blocked"] is True
        assert data["is_allowed"] is False
        assert "OFAC" in data["sanctions_list"]
    
    def test_get_blocked_jurisdictions(self, client):
        """Test get blocked jurisdictions list"""
        response = client.get("/api/v2/compliance/blocked-jurisdictions")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 12  # 12 blocked jurisdictions
    
    def test_get_allowed_jurisdictions(self, client):
        """Test get allowed jurisdictions"""
        response = client.get("/api/v2/compliance/allowed-jurisdictions")
        assert response.status_code == 200
        data = response.json()
        assert "african_markets" in data
        assert "international" in data
        assert len(data["african_markets"]) == 9
        assert len(data["international"]) == 5
    
    def test_register_investor(self, client):
        """Test investor registration"""
        payload = {
            "investor_id": "TEST-INVESTOR-001",
            "jurisdiction": "US",
            "name": "Test Investor",
            "entity_type": "INDIVIDUAL"
        }
        response = client.post(
            "/api/v2/compliance/investors/register",
            json=payload
        )
        assert response.status_code == 200
        data = response.json()
        assert data["investor_id"] == "TEST-INVESTOR-001"
        assert data["is_approved"] is True
    
    def test_register_blocked_investor(self, client):
        """Test registering investor from blocked jurisdiction"""
        payload = {
            "investor_id": "TEST-INVESTOR-BLOCKED",
            "jurisdiction": "IR",  # Iran - blocked
            "name": "Blocked Investor",
            "entity_type": "INDIVIDUAL"
        }
        response = client.post(
            "/api/v2/compliance/investors/register",
            json=payload
        )
        assert response.status_code == 400


# =============================================================================
# Service Tests
# =============================================================================

class TestMockBankService:
    """Test Mock Bank Service"""
    
    def test_create_escrow_account(self, bank_service):
        """Test creating escrow account"""
        account_id = bank_service.create_escrow_account("INVESTOR-001")
        assert account_id.startswith("MOCK-ESCROW-")
        
        balance = bank_service.get_balance(account_id)
        assert balance == bank_service.initial_balance
    
    def test_deposit(self, bank_service):
        """Test deposit to account"""
        account_id = bank_service.create_escrow_account("INVESTOR-001")
        initial_balance = bank_service.get_balance(account_id)
        
        deposit_amount = 100_000 * 10**18
        tx = bank_service.deposit(account_id, deposit_amount)
        
        new_balance = bank_service.get_balance(account_id)
        assert new_balance == initial_balance + deposit_amount
        assert tx.status.value == "COMPLETED_MVP2"
    
    def test_withdraw(self, bank_service):
        """Test withdrawal from account"""
        account_id = bank_service.create_escrow_account("INVESTOR-001")
        initial_balance = bank_service.get_balance(account_id)
        
        withdraw_amount = 50_000 * 10**18
        tx = bank_service.withdraw(account_id, withdraw_amount)
        
        new_balance = bank_service.get_balance(account_id)
        assert new_balance == initial_balance - withdraw_amount
    
    def test_wire_transfer(self, bank_service):
        """Test wire transfer between accounts"""
        account1 = bank_service.create_escrow_account("INVESTOR-001")
        account2 = bank_service.create_escrow_account("INVESTOR-002")
        
        balance1_before = bank_service.get_balance(account1)
        balance2_before = bank_service.get_balance(account2)
        
        transfer_amount = 100_000 * 10**18
        tx_id = bank_service.simulate_wire_transfer(
            account1, account2, transfer_amount, "Test transfer"
        )
        
        assert tx_id.startswith("MOCK-WIRE-")
        assert bank_service.get_balance(account1) == balance1_before - transfer_amount
        assert bank_service.get_balance(account2) == balance2_before + transfer_amount
    
    def test_get_stats(self, bank_service):
        """Test bank statistics"""
        bank_service.create_escrow_account("INVESTOR-001")
        bank_service.create_escrow_account("INVESTOR-002")
        
        stats = bank_service.get_stats()
        assert stats["total_accounts"] == 2
        assert stats["is_testnet"] is True


class TestMockGDIZService:
    """Test Mock GDIZ Service"""
    
    def test_demo_partners_exist(self, gdiz_service):
        """Test that demo partners are created"""
        stats = gdiz_service.get_stats()
        assert stats["total_partners"] >= 3
    
    def test_certify_stock(self, gdiz_service):
        """Test stock certification"""
        certificate_data = {
            "partner_id": "GDIZ-DEMO-001",
            "asset_class": "MANUFACTURING",
            "description": "1000 cotton bales",
            "quantity": 1000,
            "unit": "bales",
            "value": 1_000_000 * 10**18,
            "warehouse_location": "GDIZ Warehouse A"
        }
        
        certificate_id = gdiz_service.certify_stock(certificate_data)
        assert certificate_id.startswith("CERT-")
        
        certificate = gdiz_service.get_certificate(certificate_id)
        assert certificate.partner_id == "GDIZ-DEMO-001"
        assert certificate.status.value == "VERIFIED"
    
    def test_financing_request(self, gdiz_service):
        """Test financing request submission"""
        request_data = {
            "partner_id": "GDIZ-DEMO-001",
            "certificate_id": "CERT-TEST-001",
            "amount": 2_000_000 * 10**18,
            "duration_days": 365,
            "interest_rate": 1000,  # 10%
            "purpose": "Working capital"
        }
        
        request_id = gdiz_service.submit_financing_request(request_data)
        assert request_id.startswith("FIN-REQ-")
    
    def test_yield_report(self, gdiz_service):
        """Test yield report submission"""
        report_data = {
            "partner_id": "GDIZ-DEMO-001",
            "financing_id": "FIN-001",
            "period_start": "2026-03-01",
            "period_end": "2026-03-31",
            "revenue": 150_000 * 10**18,
            "expenses": 50_000 * 10**18,
            "principal": 1_000_000 * 10**18
        }
        
        report_id = gdiz_service.submit_yield_report(report_data)
        assert report_id.startswith("YIELD-RPT-")


class TestYieldCalculator:
    """Test Yield Calculator (Real Math)"""
    
    def test_daily_yield_calculation(self, yield_calculator):
        """Test daily yield calculation"""
        principal = 1_000_000 * 10**18  # 1M UJEUR
        apy = 0.10  # 10%
        
        daily_yield = yield_calculator.calculate_daily_yield(principal, apy)
        
        # Expected: 1M * (0.10 / 365) = 273,972.60... UJEUR
        expected = int(principal * (apy / 365))
        assert abs(daily_yield - expected) < 10**12  # Allow small rounding difference
    
    def test_period_yield(self, yield_calculator):
        """Test period yield calculation"""
        principal = 1_000_000 * 10**18
        apy = 0.10
        days = 30
        
        period_yield = yield_calculator.calculate_period_yield(principal, apy, days)
        
        # Expected: 1M * 0.10 * (30/365) = 8,219.17... UJEUR
        expected = int(principal * apy * days / 365)
        assert abs(period_yield - expected) < 10**12
    
    def test_nav_per_share(self, yield_calculator):
        """Test NAV per share calculation"""
        total_value = 10_000_000 * 10**18
        total_shares = 10_000_000 * 10**18
        
        nav = yield_calculator.calculate_nav_per_share(total_value, total_shares)
        assert nav == 10**18  # NAV = 1.00
    
    def test_management_fee(self, yield_calculator):
        """Test management fee calculation"""
        principal = 1_000_000 * 10**18
        days = 365
        fee_rate = 0.02  # 2%
        
        fee = yield_calculator.calculate_management_fee(principal, days, fee_rate)
        
        # Expected: 1M * 0.02 = 20,000 UJEUR
        expected = int(principal * fee_rate)
        assert abs(fee - expected) < 10**12
    
    def test_performance_fee(self, yield_calculator):
        """Test performance fee calculation"""
        yield_earned = 100_000 * 10**18
        principal = 1_000_000 * 10**18
        days = 365
        
        fee = yield_calculator.calculate_performance_fee(
            yield_earned, principal, days
        )
        
        # With 20% performance fee and 5% hurdle
        # Excess yield = 100K - 50K (hurdle) = 50K
        # Fee = 50K * 0.20 = 10K
        assert fee > 0
    
    def test_net_yield(self, yield_calculator):
        """Test net yield calculation"""
        gross_yield = 100_000 * 10**18
        principal = 1_000_000 * 10**18
        days = 365
        
        mgmt_fee, perf_fee, net_yield = yield_calculator.calculate_net_yield(
            gross_yield, principal, days
        )
        
        assert mgmt_fee > 0
        assert perf_fee >= 0
        assert net_yield = gross_yield - mgmt_fee - perf_fee
    
    def test_apy_calculation(self, yield_calculator):
        """Test APY calculation from actual returns"""
        principal = 1_000_000 * 10**18
        yield_earned = 100_000 * 10**18
        days = 365
        
        apy = yield_calculator.calculate_apy(principal, yield_earned, days)
        
        # Expected: (100K / 1M) * (365/365) = 0.10 = 10%
        assert abs(apy - 0.10) < 0.001


# =============================================================================
# Integration Tests
# =============================================================================

class TestEndToEndInvestmentFlow:
    """Test complete investment flow"""
    
    def test_full_investment_flow(self, client, bank_service):
        """Test complete investment flow"""
        investor_id = "E2E-INVESTOR-001"
        
        # 1. Check jurisdiction
        response = client.post(
            "/api/v2/compliance/check-jurisdiction",
            json={"jurisdiction": "MU"}
        )
        assert response.status_code == 200
        assert response.json()["is_allowed"] is True
        
        # 2. Register investor
        response = client.post(
            "/api/v2/compliance/investors/register",
            json={
                "investor_id": investor_id,
                "jurisdiction": "MU",
                "name": "E2E Test Investor",
                "entity_type": "INDIVIDUAL"
            }
        )
        assert response.status_code == 200
        
        # 3. Create bank escrow account
        account_id = bank_service.create_escrow_account(investor_id)
        assert account_id.startswith("MOCK-ESCROW-")
        
        # 4. Invest in pool
        response = client.post(
            "/api/v2/pools/POOL_INDUSTRIE/invest",
            json={
                "pool_id": "POOL_INDUSTRIE",
                "amount": "1000000000000000000000",  # 1K UJEUR
                "investor_id": investor_id
            }
        )
        assert response.status_code == 200
        assert response.json()["success"] is True
        
        # 5. Check portfolio
        response = client.get(f"/api/v2/pools/portfolio/{investor_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["investor_id"] == investor_id


# =============================================================================
# Run Tests
# =============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
