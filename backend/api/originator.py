"""
Originator API - Asset Certification & Guarantee Endpoints

Handles asset submission for industrial operators, uGT NFT lifecycle,
and fund deployment. Calls IndustrialGateway.certifyAsset() on-chain.

@notice MVP Testnet: Polygon Amoy
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Optional
from datetime import datetime
from pydantic import BaseModel, Field
import uuid

from config.database import get_db
from config.models import (
    InvestorProfile, BlockchainTransaction, BlockchainActionEnum, TransactionStatusEnum,
    GDIZFinancing, FinancingStatusEnum, AssetClassEnum
)
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


# =============================================================================
# GUARANTEE & FINANCING ENDPOINTS (uGT NFT Lifecycle)
# =============================================================================

class CreateFinancingRequest(BaseModel):
    """Create a financing deal referencing a certified asset"""
    certificate_id: str
    pool_family: str
    amount: int
    interest_rate: float
    duration_days: int
    investor_id: int


@router.post("/financings/create")
async def create_financing(
    request: CreateFinancingRequest,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Create a financing deal backed by a certified asset (uGT NFT).

    Steps:
    1. Verify the asset certificate exists (BlockchainTransaction)
    2. Create GDIZFinancing DB record
    3. Mint uGT NFT via GuaranteeTokenizer.mintGuarantee()
    4. Link financing to certificate
    """
    # Verify investor exists
    investor = db.query(InvestorProfile).filter(InvestorProfile.id == request.investor_id).first()
    if not investor:
        raise HTTPException(status_code=404, detail=f"Investor not found: {request.investor_id}")

    # Verify certificate exists
    cert_tx = db.query(BlockchainTransaction).filter(
        BlockchainTransaction.action == BlockchainActionEnum.CERTIFY_ASSET,
        BlockchainTransaction.investor_id == request.investor_id,
        BlockchainTransaction.status != TransactionStatusEnum.FAILED
    ).order_by(BlockchainTransaction.id.desc()).first()
    if not cert_tx:
        raise HTTPException(status_code=400, detail="No valid asset certificate found for this investor")

    # Create GDIZ Financing record
    gdiz_ref = f"GDIZ-{uuid.uuid4().hex[:8].upper()}"
    financing = GDIZFinancing(
        gdiz_reference=gdiz_ref,
        industrial_name=investor.full_name or investor.company_name or f"Investor #{request.investor_id}",
        industrial_sector=request.pool_family,
        pool_family=request.pool_family,
        asset_class=AssetClassEnum.OTHER,
        requested_amount=request.amount,
        approved_amount=request.amount,
        interest_rate=request.interest_rate,
        duration_days=request.duration_days,
        status=FinancingStatusEnum.PENDING,
        gdiz_status='certified',
        industrial_id=request.investor_id,
        certificate_tx_hash=cert_tx.simulated_tx_hash or cert_tx.real_tx_hash or '',
    )
    db.add(financing)

    # Mint uGT NFT via blockchain service
    from services.blockchain_service import get_blockchain_service

    blockchain = get_blockchain_service()
    token_id = None
    tx_hash = None
    explorer_url = None

    try:
        if not blockchain.is_demo and investor.wallet_address:
            tx_result = blockchain.mint_guarantee(
                industrial=investor.wallet_address,
                certificate_id=int(request.certificate_id) if request.certificate_id.isdigit() else 0,
                value=request.amount,
                expiry_days=request.duration_days,
                stock_hash=uuid.uuid4().hex[:64],
                description=financing.industrial_name,
                warehouse_location=cert_tx.parameters.get('warehouse_location', 'Unknown'),
            )
            token_id = tx_result.get('token_id')
            tx_hash = tx_result.get('transaction_hash')
            explorer_url = tx_result.get('explorer_url')
        else:
            # Demo mode
            token_id = int(uuid.uuid4().int & (1<<64) - 1)  # Random 64-bit int
            tx_hash = '0x' + uuid.uuid4().hex[:62]
            explorer_url = f"{blockchain.config.get('explorer', 'https://amoy.polygonscan.com')}/tx/{tx_hash}"

        # Record blockchain tx
        blockchain_tx = BlockchainTransaction(
            action=BlockchainActionEnum.MINT_GUARANTEE,
            contract_name="GuaranteeTokenizer",
            function_name="mintGuarantee",
            parameters={
                "financing_id": financing.id,
                "certificate_id": request.certificate_id,
                "token_id": str(token_id),
                "value": request.amount,
            },
            simulated_tx_hash=tx_hash if blockchain.is_demo else None,
            real_tx_hash=tx_hash if not blockchain.is_demo else None,
            status=TransactionStatusEnum.SIMULATED if blockchain.is_demo else TransactionStatusEnum.CONFIRMED,
            investor_id=request.investor_id,
            description=f"uGT NFT minted for financing {gdiz_ref}",
            explorer_url=explorer_url,
        )
        db.add(blockchain_tx)
        db.commit()

    except Exception as e:
        print(f"⚠️  uGT mint failed: {e}")
        financing.status = FinancingStatusEnum.FAILED
        db.commit()
        raise HTTPException(status_code=500, detail=f"uGT NFT minting failed: {str(e)}")

    return {
        "success": True,
        "financing_id": financing.id,
        "gdiz_reference": gdiz_ref,
        "ugt_token_id": token_id,
        "transaction_hash": tx_hash,
        "explorer_url": explorer_url,
        "on_chain": not blockchain.is_demo,
        "timestamp": datetime.utcnow().isoformat(),
    }


class DeployFundsRequest(BaseModel):
    """Deploy pool funds to a financing"""
    financing_id: int
    amount: int


@router.post("/financings/{financing_id}/deploy")
async def deploy_funds(
    financing_id: int,
    request: Optional[DeployFundsRequest] = None,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Deploy pool funds to an approved financing.

    Transfers EUROD from pool to industrial operator.
    """
    financing = db.query(GDIZFinancing).filter(GDIZFinancing.id == financing_id).first()
    if not financing:
        raise HTTPException(status_code=404, detail=f"Financing not found: {financing_id}")

    if financing.status not in (FinancingStatusEnum.APPROVED, FinancingStatusEnum.ACTIVE):
        raise HTTPException(status_code=400, detail=f"Financing status is {financing.status.value}, must be APPROVED or ACTIVE")

    deploy_amount = request.amount if request else int(financing.approved_amount)

    # Call blockchain deployFunds
    from services.blockchain_service import get_blockchain_service
    blockchain = get_blockchain_service()
    tx_hash = None
    explorer_url = None

    investor = db.query(InvestorProfile).filter(InvestorProfile.id == financing.industrial_id).first()

    try:
        if not blockchain.is_demo and investor and investor.wallet_address:
            tx_result = blockchain.deploy_funds(
                financing_id=financing_id,
                amount=deploy_amount,
                industrial=investor.wallet_address,
            )
            tx_hash = tx_result.get('transaction_hash')
            explorer_url = tx_result.get('explorer_url')
        else:
            tx_hash = '0x' + uuid.uuid4().hex[:62]
            explorer_url = f"{blockchain.config.get('explorer', 'https://amoy.polygonscan.com')}/tx/{tx_hash}"

        financing.status = FinancingStatusEnum.ACTIVE
        db.commit()

        # Record blockchain tx
        blockchain_tx = BlockchainTransaction(
            action=BlockchainActionEnum.DEPLOY_FUNDS,
            contract_name="LiquidityPool",
            function_name="deployFunds",
            parameters={"financing_id": financing_id, "amount": deploy_amount},
            simulated_tx_hash=tx_hash if blockchain.is_demo else None,
            real_tx_hash=tx_hash if not blockchain.is_demo else None,
            status=TransactionStatusEnum.SIMULATED if blockchain.is_demo else TransactionStatusEnum.CONFIRMED,
            investor_id=financing.industrial_id,
            description=f"Funds deployed for financing {financing.gdiz_reference}",
            explorer_url=explorer_url,
        )
        db.add(blockchain_tx)
        db.commit()

    except Exception as e:
        print(f"⚠️  Fund deployment failed: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Fund deployment failed: {str(e)}")

    return {
        "success": True,
        "financing_id": financing_id,
        "amount_deployed": deploy_amount,
        "transaction_hash": tx_hash,
        "explorer_url": explorer_url,
        "timestamp": datetime.utcnow().isoformat(),
    }


class RedeemGuaranteeRequest(BaseModel):
    """Redeem uGT NFT after repayment"""
    financing_id: int
    ugt_token_id: int


@router.post("/guarantees/redeem")
async def redeem_guarantee(
    request: RedeemGuaranteeRequest,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Redeem uGT NFT after financing is fully repaid.

    Transfers the guarantee NFT back to the industrial operator.
    """
    financing = db.query(GDIZFinancing).filter(GDIZFinancing.id == request.financing_id).first()
    if not financing:
        raise HTTPException(status_code=404, detail=f"Financing not found: {request.financing_id}")

    if financing.status != FinancingStatusEnum.REPAID:
        raise HTTPException(status_code=400, detail=f"Financing must be REPAID, current status: {financing.status.value}")

    from services.blockchain_service import get_blockchain_service
    blockchain = get_blockchain_service()
    tx_hash = None
    explorer_url = None

    investor = db.query(InvestorProfile).filter(InvestorProfile.id == financing.industrial_id).first()

    try:
        if not blockchain.is_demo and investor and investor.wallet_address:
            tx_result = blockchain.redeem_guarantee(
                token_id=request.ugt_token_id,
                industrial=investor.wallet_address,
            )
            tx_hash = tx_result.get('transaction_hash')
            explorer_url = tx_result.get('explorer_url')
        else:
            tx_hash = '0x' + uuid.uuid4().hex[:62]
            explorer_url = f"{blockchain.config.get('explorer', 'https://amoy.polygonscan.com')}/tx/{tx_hash}"

        # Record blockchain tx
        blockchain_tx = BlockchainTransaction(
            action=BlockchainActionEnum.REDEEM_GUARANTEE,
            contract_name="GuaranteeTokenizer",
            function_name="redeemGuarantee",
            parameters={"financing_id": request.financing_id, "token_id": request.ugt_token_id},
            simulated_tx_hash=tx_hash if blockchain.is_demo else None,
            real_tx_hash=tx_hash if not blockchain.is_demo else None,
            status=TransactionStatusEnum.SIMULATED if blockchain.is_demo else TransactionStatusEnum.CONFIRMED,
            investor_id=financing.industrial_id,
            description=f"uGT NFT redeemed for financing {financing.gdiz_reference}",
            explorer_url=explorer_url,
        )
        db.add(blockchain_tx)
        db.commit()

    except Exception as e:
        print(f"⚠️  Guarantee redemption failed: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Guarantee redemption failed: {str(e)}")

    return {
        "success": True,
        "financing_id": request.financing_id,
        "ugt_token_id": request.ugt_token_id,
        "transaction_hash": tx_hash,
        "explorer_url": explorer_url,
        "timestamp": datetime.utcnow().isoformat(),
    }
