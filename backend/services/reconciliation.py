"""
DB ↔ Chain Reconciliation System

Compares database state vs on-chain state for all investors and flags discrepancies.
Run this periodically to ensure data integrity.

@notice Essential for production - catches sync issues between DB and blockchain.
"""

import sys
import os
from datetime import datetime
from decimal import Decimal

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.database import get_db, SessionLocal
from config.models import (
    InvestorProfile, Investment, PoolPosition, Pool,
    BlockchainTransaction, BlockchainActionEnum, TransactionStatusEnum
)
from services.blockchain_service import get_blockchain_service
from sqlalchemy.orm import Session


class ReconciliationReport:
    """Reconciliation report for a single investor"""
    def __init__(self, investor_id: int):
        self.investor_id = investor_id
        self.db_ulps = Decimal('0')
        self.on_chain_ulps = Decimal('0')
        self.db_value = Decimal('0')
        self.on_chain_value = Decimal('0')
        self.identity_db_verified = False
        self.identity_chain_verified = False
        self.discrepancies = []
        self.status = "OK"

    def add_discrepancy(self, field: str, db_value, chain_value):
        self.discrepancies.append({
            "field": field,
            "db_value": db_value,
            "chain_value": chain_value,
        })
        self.status = "DISCREPANCY"


def reconcile_investor(db: Session, investor: InvestorProfile, blockchain) -> ReconciliationReport:
    """Reconcile a single investor's state"""
    report = ReconciliationReport(investor.id)

    # 1. uLP Token Balance
    db_positions = db.query(PoolPosition).filter(
        PoolPosition.investor_id == investor.id,
        PoolPosition.is_active == True
    ).all()

    report.db_ulps = sum(Decimal(str(pos.shares)) for pos in db_positions)

    if investor.wallet_address:
        try:
            on_chain_balance = blockchain.get_balance(investor.wallet_address)
            report.on_chain_ulps = Decimal(str(on_chain_balance)) / Decimal('1e18')

            if abs(report.db_ulps - report.on_chain_ulps) > Decimal('0.01'):
                report.add_discrepancy("uLP Balance", float(report.db_ulps), float(report.on_chain_ulps))
        except Exception as e:
            report.add_discrepancy("uLP Balance Query Error", "OK", str(e))

    # 2. Investor Value
    report.db_value = sum(
        Decimal(str(pos.shares)) * Decimal(str(pos.average_nav))
        for pos in db_positions
    )

    if investor.wallet_address:
        try:
            on_chain_value = blockchain.get_investor_value(investor.wallet_address)
            report.on_chain_value = Decimal(str(on_chain_value)) / Decimal('1e18')

            if report.db_value > 0:
                variance_pct = abs(report.db_value - report.on_chain_value) / report.db_value * 100
                if variance_pct > 1:  # 1% tolerance
                    report.add_discrepancy("Portfolio Value", float(report.db_value), float(report.on_chain_value))
        except Exception as e:
            report.add_discrepancy("Value Query Error", "OK", str(e))

    # 3. Identity Verification
    report.identity_db_verified = investor.kyc_status.value == 'approved' if investor.kyc_status else False

    if investor.wallet_address:
        try:
            report.identity_chain_verified = blockchain.is_verified(investor.wallet_address)

            if report.identity_db_verified != report.identity_chain_verified:
                report.add_discrepancy(
                    "Identity Verified",
                    report.identity_db_verified,
                    report.identity_chain_verified
                )
        except Exception as e:
            report.add_discrepancy("Identity Query Error", "OK", str(e))

    return report


def run_reconciliation() -> dict:
    """Run full reconciliation"""
    db: Session = SessionLocal()
    blockchain = get_blockchain_service()

    try:
        investors = db.query(InvestorProfile).all()
        reports = []
        total_discrepancies = 0

        for investor in investors:
            report = reconcile_investor(db, investor, blockchain)
            reports.append(report)
            if report.status == "DISCREPANCY":
                total_discrepancies += 1

        # Summary
        summary = {
            "timestamp": datetime.utcnow().isoformat(),
            "total_investors": len(investors),
            "investors_checked": len(reports),
            "discrepancies_found": total_discrepancies,
            "is_demo_mode": blockchain.is_demo,
            "reports": [
                {
                    "investor_id": r.investor_id,
                    "status": r.status,
                    "db_ulps": float(r.db_ulps),
                    "on_chain_ulps": float(r.on_chain_ulps),
                    "db_value": float(r.db_value),
                    "on_chain_value": float(r.on_chain_value),
                    "identity_db_verified": r.identity_db_verified,
                    "identity_chain_verified": r.identity_chain_verified,
                    "discrepancies": r.discrepancies,
                }
                for r in reports
            ]
        }

        return summary

    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 60)
    print("  UJAMAA DEFI - DB ↔ CHAIN RECONCILIATION")
    print("=" * 60)

    result = run_reconciliation()

    print(f"\n Timestamp: {result['timestamp']}")
    print(f" Network: {'Demo Mode' if result['is_demo_mode'] else 'Live Blockchain'}")
    print(f" Investors Checked: {result['investors_checked']}")
    print(f" Discrepancies Found: {result['discrepancies_found']}")
    print(f"\n{'=' * 60}")

    for report in result['reports']:
        status_icon = "✓" if report['status'] == "OK" else "⚠️"
        print(f"\n{status_icon} Investor #{report['investor_id']}: {report['status']}")
        if report['db_ulps'] != report['on_chain_ulps']:
            print(f"   uLP: DB={report['db_ulps']:.2f} Chain={report['on_chain_ulps']:.2f}")
        if report['db_value'] != report['on_chain_value']:
            print(f"   Value: DB=€{report['db_value']:,.2f} Chain=€{report['on_chain_value']:,.2f}")
        if report['identity_db_verified'] != report['identity_chain_verified']:
            print(f"   Identity: DB={'✓' if report['identity_db_verified'] else '✗'} Chain={'✓' if report['identity_chain_verified'] else '✗'}")
        for d in report['discrepancies']:
            print(f"   ❌ {d['field']}: {d['db_value']} vs {d['chain_value']}")

    print(f"\n{'=' * 60}")
    if result['discrepancies_found'] == 0:
        print("  ✅ ALL CLEAR - Database matches blockchain state")
    else:
        print(f"  ⚠️  {result['discrepancies_found']} INVESTOR(S) WITH DISCREPANCIES")
    print(f"{'=' * 60}\n")
