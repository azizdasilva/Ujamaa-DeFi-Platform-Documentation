"""
Blockchain Service - Ujamaa DeFi Platform

Handles all blockchain interactions for token transactions.

Features:
- ULPTokenizer deposit/redeem
- LiquidityPool financing management
- GuaranteeTokenizer minting/redemption
- IndustrialGateway certification
- IdentityRegistry management
- Transaction hash tracking
- Gas fee estimation
- Smart contract interaction

@notice Supports both testnet (Amoy) and production (Polygon)
@notice DEMO_MODE=False enables real blockchain calls
"""

from typing import Optional, Dict, Any, List
from datetime import datetime
import os
from dotenv import load_dotenv
from web3 import Web3
from web3.middleware import geth_poa_middleware

load_dotenv()

# Blockchain configuration
BLOCKCHAIN_CONFIG = {
    'testnet': {
        'name': 'Polygon Amoy',
        'chain_id': 80002,
        'rpc_url': os.getenv('RPC_URL', 'https://rpc-amoy.polygon.technology/'),
        'explorer': 'https://amoy.polygonscan.com',
        'native_token': 'MATIC',
    },
    'mainnet': {
        'name': 'Polygon Mainnet',
        'chain_id': 137,
        'rpc_url': 'https://polygon-rpc.com',
        'explorer': 'https://polygonscan.com',
        'native_token': 'MATIC',
    }
}

# =============================================================================
# SMART CONTRACT ABIS - Match deployed contracts exactly
# =============================================================================

ULP_TOKENIZER_ABI = [
    # Core functions
    {
        "inputs": [{"name": "ujeurAmount", "type": "uint256"}],
        "name": "deposit",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "uptAmount", "type": "uint256"}],
        "name": "redeem",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    # Yield functions
    {
        "inputs": [
            {"name": "yieldAmount", "type": "uint256"},
            {"name": "source", "type": "string"}
        ],
        "name": "addYield",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "accrueFees",
        "outputs": [
            {"name": "", "type": "uint256"},
            {"name": "", "type": "uint256"},
            {"name": "", "type": "uint256"}
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    # View functions
    {
        "inputs": [],
        "name": "getNAV",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "investor", "type": "address"}],
        "name": "getValue",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalPoolValue",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPoolStats",
        "outputs": [
            {"name": "totalPoolValue", "type": "uint256"},
            {"name": "totalShares", "type": "uint256"},
            {"name": "navPerShare", "type": "uint256"},
            {"name": "accumulatedYield", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    # ERC20 standard
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
    },
    # Events
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "investor", "type": "address"},
            {"indexed": False, "name": "ujeurAmount", "type": "uint256"},
            {"indexed": False, "name": "uptMinted", "type": "uint256"},
            {"indexed": False, "name": "nav", "type": "uint256"}
        ],
        "name": "Deposit",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "investor", "type": "address"},
            {"indexed": False, "name": "uptBurned", "type": "uint256"},
            {"indexed": False, "name": "ujeurAmount", "type": "uint256"},
            {"indexed": False, "name": "nav", "type": "uint256"}
        ],
        "name": "Redemption",
        "type": "event"
    },
]

LIQUIDITY_POOL_ABI = [
    # Core functions
    {
        "inputs": [
            {"name": "poolFamily", "type": "uint8"},
            {"name": "assetClass", "type": "string"},
            {"name": "industrial", "type": "address"},
            {"name": "principal", "type": "uint256"},
            {"name": "interestRate", "type": "uint256"},
            {"name": "durationDays", "type": "uint256"},
            {"name": "certificateId", "type": "uint256"}
        ],
        "name": "createFinancing",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "financingId", "type": "uint256"},
            {"name": "amount", "type": "uint256"}
        ],
        "name": "deployFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "financingId", "type": "uint256"},
            {"name": "amount", "type": "uint256"}
        ],
        "name": "recordRepayment",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "financingId", "type": "uint256"}],
        "name": "markAsDefaulted",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    # View functions
    {
        "inputs": [{"name": "financingId", "type": "uint256"}],
        "name": "getFinancing",
        "outputs": [
            {"name": "id", "type": "uint256"},
            {"name": "poolFamily", "type": "uint8"},
            {"name": "assetClass", "type": "string"},
            {"name": "industrial", "type": "address"},
            {"name": "principal", "type": "uint256"},
            {"name": "interestRate", "type": "uint256"},
            {"name": "startDate", "type": "uint256"},
            {"name": "maturityDate", "type": "uint256"},
            {"name": "amountRepaid", "type": "uint256"},
            {"name": "isRepaid", "type": "bool"},
            {"name": "isDefaulted", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "poolFamily", "type": "uint8"}],
        "name": "getPoolStats",
        "outputs": [
            {"name": "totalValue", "type": "uint256"},
            {"name": "deployedAmount", "type": "uint256"},
            {"name": "availableAmount", "type": "uint256"},
            {"name": "totalYield", "type": "uint256"},
            {"name": "financingCount", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    # Events
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "financingId", "type": "uint256"},
            {"indexed": True, "name": "poolFamily", "type": "uint8"},
            {"indexed": True, "name": "industrial", "type": "address"},
            {"indexed": False, "name": "principal", "type": "uint256"},
            {"indexed": False, "name": "interestRate", "type": "uint256"}
        ],
        "name": "FinancingCreated",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "financingId", "type": "uint256"},
            {"indexed": False, "name": "amount", "type": "uint256"},
            {"indexed": False, "name": "isFullyRepaid", "type": "bool"}
        ],
        "name": "RepaymentRecorded",
        "type": "event"
    },
]

GUARANTEE_TOKENIZER_ABI = [
    # Core functions
    {
        "inputs": [
            {"name": "industrial", "type": "address"},
            {"name": "certificateId", "type": "uint256"},
            {"name": "value", "type": "uint256"},
            {"name": "expiryDate", "type": "uint256"},
            {"name": "stockHash", "type": "bytes32"},
            {"name": "description", "type": "string"},
            {"name": "warehouseLocation", "type": "string"}
        ],
        "name": "mintGuarantee",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "redeemGuarantee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "tokenId", "type": "uint256"},
            {"name": "auctionWinner", "type": "address"},
            {"name": "liquidationAmount", "type": "uint256"}
        ],
        "name": "liquidateGuarantee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "tokenId", "type": "uint256"},
            {"name": "poolAddress", "type": "address"}
        ],
        "name": "assignToPool",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    # View functions
    {
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "getGuarantee",
        "outputs": [
            {"name": "certificateId", "type": "uint256"},
            {"name": "merchandiseValue", "type": "uint256"},
            {"name": "expiryDate", "type": "uint256"},
            {"name": "industrial", "type": "address"},
            {"name": "poolAddress", "type": "address"},
            {"name": "isRedeemed", "type": "bool"},
            {"name": "isDefaulted", "type": "bool"},
            {"name": "stockHash", "type": "bytes32"},
            {"name": "description", "type": "string"},
            {"name": "warehouseLocation", "type": "string"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "isGuaranteeActive",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    # ERC721 standard
    {
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "ownerOf",
        "outputs": [{"name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    # Events
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "tokenId", "type": "uint256"},
            {"indexed": True, "name": "certificateId", "type": "uint256"},
            {"indexed": True, "name": "industrial", "type": "address"},
            {"indexed": False, "name": "poolAddress", "type": "address"},
            {"indexed": False, "name": "value", "type": "uint256"}
        ],
        "name": "GuaranteeMinted",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "tokenId", "type": "uint256"},
            {"indexed": True, "name": "industrial", "type": "address"}
        ],
        "name": "GuaranteeRedeemed",
        "type": "event"
    },
]

INDUSTRIAL_GATEWAY_ABI = [
    # Core functions
    {
        "inputs": [
            {"name": "industrial", "type": "address"},
            {"name": "assetType", "type": "string"},
            {"name": "value", "type": "uint256"},
            {"name": "quantity", "type": "uint256"},
            {"name": "unit", "type": "string"},
            {"name": "warehouseLocation", "type": "string"},
            {"name": "stockHash", "type": "bytes32"},
            {"name": "description", "type": "string"},
            {"name": "validityDays", "type": "uint256"}
        ],
        "name": "certifyAsset",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "certificateId", "type": "uint256"}],
        "name": "mintGuaranteeToken",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "certificateId", "type": "uint256"},
            {"name": "reason", "type": "string"}
        ],
        "name": "revokeCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    # View functions
    {
        "inputs": [{"name": "certificateId", "type": "uint256"}],
        "name": "getCertificate",
        "outputs": [
            {"name": "certificateId", "type": "uint256"},
            {"name": "industrial", "type": "address"},
            {"name": "assetType", "type": "string"},
            {"name": "value", "type": "uint256"},
            {"name": "quantity", "type": "uint256"},
            {"name": "unit", "type": "string"},
            {"name": "warehouseLocation", "type": "string"},
            {"name": "certificationDate", "type": "uint256"},
            {"name": "expiryDate", "type": "uint256"},
            {"name": "stockHash", "type": "bytes32"},
            {"name": "description", "type": "string"},
            {"name": "isVerified", "type": "bool"},
            {"name": "isRevoked", "type": "bool"},
            {"name": "guaranteeTokenId", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "industrial", "type": "address"}],
        "name": "getCertificatesForIndustrial",
        "outputs": [{"name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "certificateId", "type": "uint256"}],
        "name": "isCertificateActive",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    # Events
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "certificateId", "type": "uint256"},
            {"indexed": True, "name": "industrial", "type": "address"},
            {"indexed": False, "name": "assetType", "type": "string"},
            {"indexed": False, "name": "value", "type": "uint256"}
        ],
        "name": "CertificateCreated",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "certificateId", "type": "uint256"},
            {"indexed": True, "name": "tokenId", "type": "uint256"}
        ],
        "name": "GuaranteeTokenMinted",
        "type": "event"
    },
]

IDENTITY_REGISTRY_ABI = [
    # Core functions
    {
        "inputs": [
            {"name": "investor", "type": "address"},
            {"name": "jurisdiction", "type": "string"},
            {"name": "investorType", "type": "string"}
        ],
        "name": "registerIdentity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "investor", "type": "address"}],
        "name": "verifyIdentity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "investor", "type": "address"},
            {"name": "reason", "type": "string"}
        ],
        "name": "rejectIdentity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "investor", "type": "address"}],
        "name": "revokeIdentity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    # View functions
    {
        "inputs": [{"name": "investor", "type": "address"}],
        "name": "isVerified",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "investor", "type": "address"}],
        "name": "getIdentity",
        "outputs": [
            {"name": "status", "type": "uint8"},
            {"name": "verifiedAt", "type": "uint256"},
            {"name": "jurisdiction", "type": "string"},
            {"name": "investorType", "type": "string"},
            {"name": "verifier", "type": "address"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getVerifiedCount",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    # Events
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "investor", "type": "address"},
            {"indexed": False, "name": "jurisdiction", "type": "string"},
            {"indexed": False, "name": "investorType", "type": "string"}
        ],
        "name": "IdentityRegistered",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "investor", "type": "address"}
        ],
        "name": "IdentityVerified",
        "type": "event"
    },
]

MOCK_EUROD_ABI = [
    # ERC20 standard functions
    {
        "inputs": [
            {"name": "to", "type": "address"},
            {"name": "amount", "type": "uint256"}
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "spender", "type": "address"},
            {"name": "amount", "type": "uint256"}
        ],
        "name": "approve",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "from", "type": "address"},
            {"name": "to", "type": "address"},
            {"name": "amount", "type": "uint256"}
        ],
        "name": "transferFrom",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
    },
]


class BlockchainService:
    """
    Blockchain service for handling all on-chain operations.

    When DEMO_MODE=True: Simulates blockchain transactions
    When DEMO_MODE=False: Makes real Web3 calls to Polygon Amoy/Mainnet
    """

    def __init__(self, network: str = 'testnet'):
        """
        Initialize blockchain service.

        Args:
            network: 'testnet' or 'mainnet'
        """
        self.network = network
        self.config = BLOCKCHAIN_CONFIG[network]
        self.is_demo = os.getenv('DEMO_MODE', 'True').lower() == 'true'

        # Initialize Web3 connection
        self.w3 = None
        self.deployer_address = None
        self.private_key = None

        if not self.is_demo:
            self.w3 = Web3(Web3.HTTPProvider(self.config['rpc_url']))

            # Add PoA middleware for Polygon
            if self.network == 'testnet':
                self.w3.middleware_onion.inject(geth_poa_middleware, layer=0)

            if self.w3.is_connected():
                print(f"✅ Connected to {self.config['name']} RPC")
            else:
                print(f"⚠️  Failed to connect to {self.config['name']} RPC")

            # Load deployer credentials
            self.private_key = os.getenv('PRIVATE_KEY')
            deployer_addr = os.getenv('DEPLOYER_ADDRESS')
            if self.private_key and deployer_addr:
                self.deployer_address = self.w3.to_checksum_address(deployer_addr)
            elif self.private_key:
                account = self.w3.eth.account.from_key(self.private_key)
                self.deployer_address = account.address

        # Contract addresses from environment
        self.contract_addresses = {
            'ULP_TOKENIZER': os.getenv('CONTRACT_ULP_TOKENIZER') or os.getenv('CONTRACT_ULP_TOKEN'),
            'LIQUIDITY_POOL': os.getenv('CONTRACT_LIQUIDITY_POOL'),
            'GUARANTEE_TOKENIZER': os.getenv('CONTRACT_GUARANTEE_TOKENIZER') or os.getenv('CONTRACT_GUARANTEE_TOKEN'),
            'INDUSTRIAL_GATEWAY': os.getenv('CONTRACT_INDUSTRIAL_GATEWAY'),
            'IDENTITY_REGISTRY': os.getenv('CONTRACT_IDENTITY_REGISTRY'),
            'COMPLIANCE': os.getenv('CONTRACT_COMPLIANCE'),
            'MOCK_ESCROW': os.getenv('CONTRACT_MOCK_ESCROW'),
            'MOCK_FIAT_RAMP': os.getenv('CONTRACT_MOCK_FIAT_RAMP'),
            'NAV_GATEWAY': os.getenv('CONTRACT_NAV_GATEWAY'),
            'MOCK_EUROD': os.getenv('CONTRACT_MOCK_EUROD'),
        }

        # Load contract instances if not in demo mode
        self.contracts = {}
        if not self.is_demo and self.w3 and self.w3.is_connected():
            self._load_contracts()

    def _load_contracts(self):
        """Load smart contract instances"""
        contract_configs = [
            ('ULP_TOKENIZER', self.contract_addresses.get('ULP_TOKENIZER'), ULP_TOKENIZER_ABI),
            ('LIQUIDITY_POOL', self.contract_addresses.get('LIQUIDITY_POOL'), LIQUIDITY_POOL_ABI),
            ('GUARANTEE_TOKENIZER', self.contract_addresses.get('GUARANTEE_TOKENIZER'), GUARANTEE_TOKENIZER_ABI),
            ('INDUSTRIAL_GATEWAY', self.contract_addresses.get('INDUSTRIAL_GATEWAY'), INDUSTRIAL_GATEWAY_ABI),
            ('IDENTITY_REGISTRY', self.contract_addresses.get('IDENTITY_REGISTRY'), IDENTITY_REGISTRY_ABI),
            ('MOCK_EUROD', self.contract_addresses.get('MOCK_EUROD'), MOCK_EUROD_ABI),
        ]

        for name, address, abi in contract_configs:
            if address and address != 'None' and address != '':
                try:
                    self.contracts[name] = self.w3.eth.contract(
                        address=self.w3.to_checksum_address(address),
                        abi=abi
                    )
                except Exception as e:
                    print(f"⚠️  Failed to load contract {name}: {e}")

    def _build_and_send_tx(self, contract_func, tx_params=None) -> Dict[str, Any]:
        """
        Build, sign, and send a transaction.

        Args:
            contract_func: Web3 contract function call
            tx_params: Optional transaction parameters

        Returns:
            Transaction receipt dict
        """
        if not self.w3 or not self.private_key or not self.deployer_address:
            raise ValueError("Web3 not configured. Check PRIVATE_KEY and DEPLOYER_ADDRESS env vars.")

        # Build transaction
        nonce = self.w3.eth.get_transaction_count(self.deployer_address)
        gas_estimate = contract_func.estimate_gas({'from': self.deployer_address})
        gas_price = self.w3.eth.gas_price

        tx = contract_func.build_transaction({
            'from': self.deployer_address,
            'nonce': nonce,
            'gas': int(gas_estimate * 1.2),  # 20% buffer
            'gasPrice': gas_price,
            'chainId': self.config['chain_id'],
        })

        if tx_params:
            tx.update(tx_params)

        # Sign transaction
        signed_tx = self.w3.eth.account.sign_transaction(tx, private_key=self.private_key)

        # Send transaction
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        # Wait for receipt
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)

        return {
            'success': receipt.status == 1,
            'transaction_hash': self.w3.to_hex(tx_hash),
            'block_number': receipt.blockNumber,
            'gas_used': receipt.gasUsed,
            'status': receipt.status,
            'logs': receipt.logs,
        }

    # =============================================================================
    # ULP TOKENIZER FUNCTIONS
    # =============================================================================

    def deposit(self, investor_address: str, ujeur_amount: int) -> Dict[str, Any]:
        """
        Deposit EUROD and mint uLP shares.

        Args:
            investor_address: Investor wallet address
            ujeur_amount: Amount in smallest unit (18 decimals)

        Returns:
            Transaction result
        """
        if self.is_demo:
            return self._simulate_transaction('deposit', investor_address, ujeur_amount, 'ULP_TOKENIZER')

        contract = self.contracts.get('ULP_TOKENIZER')
        if not contract:
            raise ValueError("ULP_TOKENIZER contract not loaded")

        tx_result = self._build_and_send_tx(contract.functions.deposit(ujeur_amount))

        return {
            'success': tx_result['success'],
            'transaction_hash': tx_result['transaction_hash'],
            'block_number': tx_result['block_number'],
            'gas_used': tx_result['gas_used'],
            'amount': ujeur_amount,
            'investor': investor_address,
            'timestamp': datetime.utcnow().isoformat(),
            'network': self.network,
            'explorer_url': f"{self.config['explorer']}/tx/{tx_result['transaction_hash']}",
        }

    def redeem(self, investor_address: str, shares: int) -> Dict[str, Any]:
        """
        Redeem uLP shares for EUROD.

        Args:
            investor_address: Investor wallet address
            shares: Amount of shares to burn (18 decimals)

        Returns:
            Transaction result
        """
        if self.is_demo:
            return self._simulate_transaction('redeem', investor_address, shares, 'ULP_TOKENIZER')

        contract = self.contracts.get('ULP_TOKENIZER')
        if not contract:
            raise ValueError("ULP_TOKENIZER contract not loaded")

        tx_result = self._build_and_send_tx(contract.functions.redeem(shares))

        return {
            'success': tx_result['success'],
            'transaction_hash': tx_result['transaction_hash'],
            'block_number': tx_result['block_number'],
            'gas_used': tx_result['gas_used'],
            'shares': shares,
            'investor': investor_address,
            'timestamp': datetime.utcnow().isoformat(),
            'network': self.network,
            'explorer_url': f"{self.config['explorer']}/tx/{tx_result['transaction_hash']}",
        }

    def get_nav(self) -> int:
        """Get current NAV per share"""
        if self.is_demo:
            return 10**18  # 1.00

        contract = self.contracts.get('ULP_TOKENIZER')
        if not contract:
            return 10**18

        return contract.functions.getNAV().call()

    def get_pool_stats(self) -> Dict[str, Any]:
        """Get pool statistics"""
        if self.is_demo:
            return {
                'totalPoolValue': 0,
                'totalShares': 0,
                'navPerShare': 10**18,
                'accumulatedYield': 0
            }

        contract = self.contracts.get('ULP_TOKENIZER')
        if not contract:
            return {}

        stats = contract.functions.getPoolStats().call()
        return {
            'totalPoolValue': stats[0],
            'totalShares': stats[1],
            'navPerShare': stats[2],
            'accumulatedYield': stats[3],
        }

    def get_investor_value(self, investor_address: str) -> int:
        """Get investor's share value in EUROD"""
        if self.is_demo:
            return 0

        contract = self.contracts.get('ULP_TOKENIZER')
        if not contract:
            return 0

        return contract.functions.getValue(investor_address).call()

    def get_balance(self, investor_address: str) -> int:
        """Get investor's uLP balance"""
        if self.is_demo:
            return 0

        contract = self.contracts.get('ULP_TOKENIZER')
        if not contract:
            return 0

        return contract.functions.balanceOf(investor_address).call()

    def add_yield(self, yield_amount: int, source: str) -> Dict[str, Any]:
        """Add yield to the pool (pool manager only)"""
        if self.is_demo:
            return self._simulate_transaction('addYield', '0x0', yield_amount, 'ULP_TOKENIZER')

        contract = self.contracts.get('ULP_TOKENIZER')
        if not contract:
            raise ValueError("ULP_TOKENIZER contract not loaded")

        tx_result = self._build_and_send_tx(contract.functions.addYield(yield_amount, source))

        return {
            'success': tx_result['success'],
            'transaction_hash': tx_result['transaction_hash'],
            'block_number': tx_result['block_number'],
            'yield_amount': yield_amount,
            'source': source,
        }

    # =============================================================================
    # LIQUIDITY POOL FUNCTIONS
    # =============================================================================

    def create_financing(
        self,
        pool_family: int,
        asset_class: str,
        industrial: str,
        principal: int,
        interest_rate: int,
        duration_days: int,
        certificate_id: int
    ) -> Dict[str, Any]:
        """Create industrial financing"""
        if self.is_demo:
            return self._simulate_transaction('createFinancing', industrial, principal, 'LIQUIDITY_POOL')

        contract = self.contracts.get('LIQUIDITY_POOL')
        if not contract:
            raise ValueError("LIQUIDITY_POOL contract not loaded")

        tx_result = self._build_and_send_tx(
            contract.functions.createFinancing(
                pool_family, asset_class, industrial,
                principal, interest_rate, duration_days, certificate_id
            )
        )

        return {
            'success': tx_result['success'],
            'transaction_hash': tx_result['transaction_hash'],
            'block_number': tx_result['block_number'],
            'gas_used': tx_result['gas_used'],
            'industrial': industrial,
            'principal': principal,
        }

    def deploy_funds(self, financing_id: int, amount: int) -> Dict[str, Any]:
        """Deploy funds to financing"""
        if self.is_demo:
            return self._simulate_transaction('deployFunds', '0x0', amount, 'LIQUIDITY_POOL')

        contract = self.contracts.get('LIQUIDITY_POOL')
        if not contract:
            raise ValueError("LIQUIDITY_POOL contract not loaded")

        tx_result = self._build_and_send_tx(
            contract.functions.deployFunds(financing_id, amount)
        )

        return {
            'success': tx_result['success'],
            'transaction_hash': tx_result['transaction_hash'],
            'block_number': tx_result['block_number'],
            'gas_used': tx_result['gas_used'],
            'financing_id': financing_id,
            'amount': amount,
        }

    def record_repayment(self, financing_id: int, amount: int) -> Dict[str, Any]:
        """Record industrial repayment"""
        if self.is_demo:
            return self._simulate_transaction('recordRepayment', '0x0', amount, 'LIQUIDITY_POOL')

        contract = self.contracts.get('LIQUIDITY_POOL')
        if not contract:
            raise ValueError("LIQUIDITY_POOL contract not loaded")

        tx_result = self._build_and_send_tx(
            contract.functions.recordRepayment(financing_id, amount)
        )

        return {
            'success': tx_result['success'],
            'transaction_hash': tx_result['transaction_hash'],
            'block_number': tx_result['block_number'],
            'gas_used': tx_result['gas_used'],
            'financing_id': financing_id,
            'amount': amount,
        }

    # =============================================================================
    # GUARANTEE TOKENIZER FUNCTIONS
    # =============================================================================

    def mint_guarantee(
        self,
        industrial: str,
        certificate_id: int,
        value: int,
        expiry_date: int,
        stock_hash: bytes,
        description: str,
        warehouse_location: str
    ) -> Dict[str, Any]:
        """Mint Guarantee Token (uGT)"""
        if self.is_demo:
            return self._simulate_transaction('mintGuarantee', industrial, value, 'GUARANTEE_TOKENIZER')

        contract = self.contracts.get('GUARANTEE_TOKENIZER')
        if not contract:
            raise ValueError("GUARANTEE_TOKENIZER contract not loaded")

        tx_result = self._build_and_send_tx(
            contract.functions.mintGuarantee(
                industrial, certificate_id, value,
                expiry_date, stock_hash, description, warehouse_location
            )
        )

        return {
            'success': tx_result['success'],
            'transaction_hash': tx_result['transaction_hash'],
            'block_number': tx_result['block_number'],
            'gas_used': tx_result['gas_used'],
            'industrial': industrial,
            'certificate_id': certificate_id,
        }

    def redeem_guarantee(self, token_id: int) -> Dict[str, Any]:
        """Redeem Guarantee Token"""
        if self.is_demo:
            return self._simulate_transaction('redeemGuarantee', '0x0', token_id, 'GUARANTEE_TOKENIZER')

        contract = self.contracts.get('GUARANTEE_TOKENIZER')
        if not contract:
            raise ValueError("GUARANTEE_TOKENIZER contract not loaded")

        tx_result = self._build_and_send_tx(
            contract.functions.redeemGuarantee(token_id)
        )

        return {
            'success': tx_result['success'],
            'transaction_hash': tx_result['transaction_hash'],
            'block_number': tx_result['block_number'],
            'gas_used': tx_result['gas_used'],
            'token_id': token_id,
        }

    # =============================================================================
    # IDENTITY REGISTRY FUNCTIONS
    # =============================================================================

    def register_identity(
        self,
        investor_address: str,
        jurisdiction: str,
        investor_type: str
    ) -> Dict[str, Any]:
        """Register investor identity"""
        if self.is_demo:
            return self._simulate_transaction('registerIdentity', investor_address, 0, 'IDENTITY_REGISTRY')

        contract = self.contracts.get('IDENTITY_REGISTRY')
        if not contract:
            raise ValueError("IDENTITY_REGISTRY contract not loaded")

        tx_result = self._build_and_send_tx(
            contract.functions.registerIdentity(investor_address, jurisdiction, investor_type)
        )

        return {
            'success': tx_result['success'],
            'transaction_hash': tx_result['transaction_hash'],
            'block_number': tx_result['block_number'],
            'investor': investor_address,
            'jurisdiction': jurisdiction,
        }

    def verify_identity(self, investor_address: str) -> Dict[str, Any]:
        """Verify investor identity (compliance officer only)"""
        if self.is_demo:
            return self._simulate_transaction('verifyIdentity', investor_address, 0, 'IDENTITY_REGISTRY')

        contract = self.contracts.get('IDENTITY_REGISTRY')
        if not contract:
            raise ValueError("IDENTITY_REGISTRY contract not loaded")

        tx_result = self._build_and_send_tx(
            contract.functions.verifyIdentity(investor_address)
        )

        return {
            'success': tx_result['success'],
            'transaction_hash': tx_result['transaction_hash'],
            'block_number': tx_result['block_number'],
            'investor': investor_address,
        }

    def is_verified(self, investor_address: str) -> bool:
        """Check if investor identity is verified"""
        if self.is_demo:
            return True  # Always verified on testnet

        contract = self.contracts.get('IDENTITY_REGISTRY')
        if not contract:
            return True

        return contract.functions.isVerified(investor_address).call()

    # =============================================================================
    # UTILITY FUNCTIONS
    # =============================================================================

    def estimate_gas_fee(self, transaction_type: str) -> float:
        """Estimate gas fee for a transaction (in EUR)"""
        gas_fees = {
            'deposit': 0.50,
            'redeem': 0.50,
            'createFinancing': 1.00,
            'recordRepayment': 0.75,
            'mintGuarantee': 1.50,
            'registerIdentity': 0.30,
            'verifyIdentity': 0.30,
        }
        return gas_fees.get(transaction_type, 0.50)

    def get_transaction_status(self, tx_hash: str) -> Dict[str, Any]:
        """Get transaction status from blockchain"""
        if self.is_demo:
            return {
                'success': True,
                'hash': tx_hash,
                'confirmations': 12,
                'confirmed': True,
                'block_number': 12345678,
                'timestamp': datetime.utcnow().isoformat(),
            }

        if not self.w3:
            return {'success': False, 'error': 'Web3 not connected'}

        try:
            receipt = self.w3.eth.get_transaction_receipt(tx_hash)
            block = self.w3.eth.get_block(receipt.blockNumber)
            return {
                'success': receipt.status == 1,
                'hash': tx_hash,
                'confirmations': self.w3.eth.block_number - receipt.blockNumber,
                'confirmed': receipt.status == 1,
                'block_number': receipt.blockNumber,
                'gas_used': receipt.gasUsed,
                'timestamp': datetime.fromtimestamp(block.timestamp).isoformat(),
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def _simulate_transaction(self, tx_type: str, address: str, amount: int, contract: str) -> Dict[str, Any]:
        """Simulate a blockchain transaction for demo mode"""
        import time
        time.sleep(0.3)  # Simulate network delay

        tx_hash = '0x' + os.urandom(32).hex()

        return {
            'success': True,
            'transaction_hash': tx_hash,
            'type': tx_type,
            'amount': amount,
            'address': address,
            'contract': contract,
            'block_number': 12345678 + int(datetime.utcnow().timestamp()),
            'confirmations': 12,
            'gas_used': 150000,
            'gas_fee': self.estimate_gas_fee(tx_type),
            'timestamp': datetime.utcnow().isoformat(),
            'network': self.network,
            'explorer_url': f"{self.config['explorer']}/tx/{tx_hash}",
        }

    def get_contract_addresses(self) -> Dict[str, str]:
        """Get deployed contract addresses"""
        return self.contract_addresses

    def get_network_info(self) -> Dict[str, Any]:
        """Get current network information"""
        return {
            'name': self.config['name'],
            'chain_id': self.config['chain_id'],
            'explorer': self.config['explorer'],
            'native_token': self.config['native_token'],
            'is_demo': self.is_demo,
            'deployer': self.deployer_address,
        }


# Global blockchain service instance
blockchain_service = BlockchainService(network='testnet')


def get_blockchain_service() -> BlockchainService:
    """Get blockchain service instance"""
    return blockchain_service
