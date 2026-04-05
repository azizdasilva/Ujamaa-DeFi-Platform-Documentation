"""
Originator API - Asset Certification Endpoints

Handles asset submission for industrial operators.
Calls IndustrialGateway.certifyAsset() on-chain.

@notice MVP Testnet: Polygon Amoy
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Optional
from datetime import datetime
from pydantic import BaseModel, Field
import uuid

from config.database import get_db
from config.models import InvestorProfile, BlockchainTransaction, BlockchainActionEnum, TransactionStatusEnum
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v2/originator", tags=["Originator"])


class AssetCertifyRequest(BaseModel):
    """Asset certification request"""
    investor_id: int
    asset_type: str  # INVOICE, INVENTORY, PRODUCTION, SHIPMENT, CONTRACT
    value: int  # 18 decimals
    quantity: int
    unit: str = "units"
    warehouse_location: str
    description: str
    validity_days: int = 365


@router.post("/assets/certify")
async def certify_asset(
    request: AssetCertifyRequest,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Submit asset for certification by Industrial Gateway.

    Calls IndustrialGateway.certifyAsset() on Polygon Amoy.
    Returns transaction hash and Polygonscan URL.
    """
    # Verify investor exists
    investor = db.query(InvestorProfile).filter(InvestorProfile.id == request.investor_id).first()
    if not investor:
        raise HTTPException(status_code=404, detail=f"Investor profile not found: {request.investor_id}")

    # Validate asset type
    valid_types = ['INVOICE', 'INVENTORY', 'PRODUCTION', 'SHIPMENT', 'CONTRACT', 'RECEIVABLE']
    if request.asset_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid asset type. Must be one of: {valid_types}")

    # Call blockchain service
    from services.blockchain_service import get_blockchain_service

    blockchain = get_blockchain_service()
    tx_hash = None
    explorer_url = None
    certificate_id = None

    try:
        if not blockchain.is_demo and investor.wallet_address:
            # Real blockchain: call certifyAsset()
            # Note: This requires CERTIFIER_ROLE - in production would be called by GDIZ/SIPI
            # For MVP, we simulate the certification flow
            tx_result = blockchain.certify_asset(
                industrial=investor.wallet_address,
                asset_type=request.asset_type,
                value=request.value,
                quantity=request.quantity,
                unit=request.unit,
                warehouse_location=request.warehouse_location,
                stock_hash=uuid.uuid4().hex[:64],  # Mock IPFS hash
                description=request.description,
                validity_days=request.validity_days,
            )

            tx_hash = tx_result['transaction_hash']
            explorer_url = tx_result.get('explorer_url')

            # Record in audit trail
            blockchain_tx = BlockchainTransaction(
                action=BlockchainActionEnum.CERTIFY_ASSET,
                contract_name="IndustrialGateway",
                function_name="certifyAsset",
                parameters={
                    "asset_type": request.asset_type,
                    "value": request.value,
                    "quantity": request.quantity,
                    "warehouse_location": request.warehouse_location,
                    "description": request.description,
                },
                real_tx_hash=tx_hash,
                status=TransactionStatusEnum.CONFIRMED if tx_result['success'] else TransactionStatusEnum.FAILED,
                investor_id=request.investor_id,
                description=f"Asset certification: {request.asset_type} - {request.description}",
                explorer_url=explorer_url,
            )
            db.add(blockchain_tx)
        else:
            # Demo mode
            import os
            tx_hash = '0x' + os.urandom(32).hex()
            explorer_url = f"{blockchain.config['explorer']}/tx/{tx_hash}"
            certificate_id = f"CERT-{uuid.uuid4().hex[:8].upper()}"

            blockchain_tx = BlockchainTransaction(
                action=BlockchainActionEnum.CERTIFY_ASSET,
                contract_name="IndustrialGateway",
                function_name="certifyAsset",
                parameters={
                    "asset_type": request.asset_type,
                    "value": request.value,
                    "quantity": request.quantity,
                    "warehouse_location": request.warehouse_location,
                    "description": request.description,
                },
                simulated_tx_hash=tx_hash,
                status=TransactionStatusEnum.SIMULATED,
                investor_id=request.investor_id,
                description=f"Asset certification (demo): {request.asset_type} - {request.description}",
                explorer_url=explorer_url,
            )
            db.add(blockchain_tx)

    except Exception as e:
        print(f"⚠️  Asset certification failed: {e}")
        tx_hash = f"0xERROR-{uuid.uuid4().hex[:58]}"
        explorer_url = None

        blockchain_tx = BlockchainTransaction(
            action=BlockchainActionEnum.CERTIFY_ASSET,
            contract_name="IndustrialGateway",
            function_name="certifyAsset",
            parameters={"asset_type": request.asset_type, "value": request.value},
            simulated_tx_hash=tx_hash,
            status=TransactionStatusEnum.FAILED,
            investor_id=request.investor_id,
            error_message=str(e),
            description=f"Asset certification FAILED: {request.asset_type}",
        )
        db.add(blockchain_tx)

    db.commit()

    return {
        "success": True,
        "certificate_id": certificate_id,
        "asset_type": request.asset_type,
        "value": request.value,
        "transaction_id": tx_hash,
        "explorer_url": explorer_url,
        "on_chain": not blockchain.is_demo,
        "timestamp": datetime.utcnow().isoformat(),
    }
