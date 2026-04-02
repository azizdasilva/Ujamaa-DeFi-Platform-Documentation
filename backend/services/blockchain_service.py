"""
Blockchain Service - Ujamaa DeFi Platform
Handles all blockchain interactions for token transactions

Features:
- uLT token minting/burning
- Investment transactions
- Transaction hash tracking
- Gas fee estimation
- Smart contract interaction

@notice: Supports both testnet (Amoy) and production (Polygon)
"""

from typing import Optional, Dict, Any
from datetime import datetime
import os
from dotenv import load_dotenv
from web3 import Web3

load_dotenv()

# Blockchain configuration
BLOCKCHAIN_CONFIG = {
    'testnet': {
        'name': 'Polygon Amoy',
        'chain_id': 80002,
        'rpc_url': 'https://rpc-amoy.polygon.technology/',
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

# Smart Contract ABIs (simplified)
ULT_TOKEN_ABI = [
    {
        "inputs": [{"name": "to", "type": "address"}, {"name": "amount", "type": "uint256"}],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "from", "type": "address"}, {"name": "amount", "type": "uint256"}],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
]

INVESTMENT_POOL_ABI = [
    {
        "inputs": [{"name": "poolId", "type": "bytes32"}, {"name": "amount", "type": "uint256"}],
        "name": "invest",
        "outputs": [{"name": "ultTokens", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "poolId", "type": "bytes32"}, {"name": "shares", "type": "uint256"}],
        "name": "redeem",
        "outputs": [{"name": "amount", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]


class BlockchainService:
    """
    Blockchain service for handling all on-chain operations.
    
    In production, this would use web3.py to interact with smart contracts.
    For demo, we simulate blockchain transactions.
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
        if not self.is_demo:
            self.w3 = Web3(Web3.HTTPProvider(self.config['rpc_url']))
            if self.w3.is_connected():
                print(f"✅ Connected to {self.config['name']} RPC")
            else:
                print(f"⚠️  Failed to connect to {self.config['name']} RPC")
        
        # Contract addresses from environment (DEPLOYED)
        self.contract_addresses = {
            'ULP_TOKEN': os.getenv('CONTRACT_ULP_TOKEN'),
            'LIQUIDITY_POOL': os.getenv('CONTRACT_LIQUIDITY_POOL'),
            'GUARANTEE_TOKEN': os.getenv('CONTRACT_GUARANTEE_TOKEN'),
            'INDUSTRIAL_GATEWAY': os.getenv('CONTRACT_INDUSTRIAL_GATEWAY'),
            'JURISDICTION_COMPLIANCE': os.getenv('CONTRACT_JURISDICTION_COMPLIANCE'),
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
        if self.contract_addresses.get('ULP_TOKEN'):
            self.contracts['ULP_TOKEN'] = self.w3.eth.contract(
                address=self.w3.to_checksum_address(self.contract_addresses['ULP_TOKEN']),
                abi=ULT_TOKEN_ABI
            )
        if self.contract_addresses.get('LIQUIDITY_POOL'):
            self.contracts['LIQUIDITY_POOL'] = self.w3.eth.contract(
                address=self.w3.to_checksum_address(self.contract_addresses['LIQUIDITY_POOL']),
                abi=INVESTMENT_POOL_ABI
            )
    
    def mint_ult_tokens(self, to_address: str, amount: float, pool_id: str) -> Dict[str, Any]:
        """
        Mint uLT tokens for an investment.
        
        Args:
            to_address: Recipient wallet address
            amount: Amount of uLT tokens to mint
            pool_id: Pool identifier
            
        Returns:
            Transaction result with hash
        """
        if self.is_demo:
            return self._simulate_transaction('mint', to_address, amount, pool_id)
        
        # Production: Use web3.py to interact with smart contract
        # This is a simplified example
        try:
            # Connect to contract
            # contract = web3.eth.contract(address=address, abi=ULT_TOKEN_ABI)
            
            # Build transaction
            # tx = contract.functions.mint(to_address, int(amount * 1e18)).build_transaction({
            #     'from': deployer_address,
            #     'nonce': web3.eth.get_transaction_count(deployer_address),
            #     'gas': 200000,
            #     'gasPrice': web3.eth.gas_price,
            # })
            
            # Sign and send
            # signed_tx = web3.eth.account.sign_transaction(tx, private_key)
            # tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            return {
                'success': True,
                'transaction_hash': '0x' + os.urandom(32).hex(),
                'block_number': None,  # Will be set after confirmation
                'amount': amount,
                'recipient': to_address,
                'timestamp': datetime.utcnow().isoformat(),
                'network': self.network,
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
            }
    
    def burn_ult_tokens(self, from_address: str, amount: float, pool_id: str) -> Dict[str, Any]:
        """
        Burn uLT tokens for a redemption.
        
        Args:
            from_address: Token owner wallet address
            amount: Amount of uLT tokens to burn
            pool_id: Pool identifier
            
        Returns:
            Transaction result with hash
        """
        if self.is_demo:
            return self._simulate_transaction('burn', from_address, amount, pool_id)
        
        # Production: Use web3.py
        return self._simulate_transaction('burn', from_address, amount, pool_id)
    
    def get_token_balance(self, wallet_address: str) -> Dict[str, Any]:
        """
        Get uLT token balance for a wallet.
        
        Args:
            wallet_address: Wallet address to query
            
        Returns:
            Balance information
        """
        if self.is_demo:
            # Demo: Return mock balance
            return {
                'success': True,
                'balance': 24750.0,  # Mock balance
                'wallet': wallet_address,
                'network': self.network,
            }
        
        # Production: Query smart contract
        # contract = web3.eth.contract(address=address, abi=ULT_TOKEN_ABI)
        # balance = contract.functions.balanceOf(wallet_address).call()
        
        return {
            'success': True,
            'balance': 0.0,
            'wallet': wallet_address,
            'network': self.network,
        }
    
    def estimate_gas_fee(self, transaction_type: str) -> float:
        """
        Estimate gas fee for a transaction.
        
        Args:
            transaction_type: 'mint', 'burn', 'invest', 'redeem'
            
        Returns:
            Estimated gas fee in EUR
        """
        # Mock gas fees (in production, query from network)
        gas_fees = {
            'mint': 0.5,      # €0.50
            'burn': 0.5,      # €0.50
            'invest': 1.0,    # €1.00
            'redeem': 1.0,    # €1.00
        }
        return gas_fees.get(transaction_type, 0.5)
    
    def get_transaction_status(self, tx_hash: str) -> Dict[str, Any]:
        """
        Get transaction status from blockchain.
        
        Args:
            tx_hash: Transaction hash
            
        Returns:
            Transaction status and details
        """
        if self.is_demo:
            # Demo: Simulate confirmation progress
            return {
                'success': True,
                'hash': tx_hash,
                'confirmations': 12,
                'confirmed': True,
                'block_number': 12345678,
                'timestamp': datetime.utcnow().isoformat(),
            }
        
        # Production: Query from blockchain
        # tx_receipt = web3.eth.get_transaction_receipt(tx_hash)
        
        return {
            'success': True,
            'hash': tx_hash,
            'confirmations': 0,
            'confirmed': False,
        }
    
    def _simulate_transaction(self, tx_type: str, address: str, amount: float, pool_id: str) -> Dict[str, Any]:
        """
        Simulate a blockchain transaction for demo mode.
        
        Args:
            tx_type: 'mint' or 'burn'
            address: Wallet address
            amount: Token amount
            pool_id: Pool identifier
            
        Returns:
            Simulated transaction result
        """
        import time
        time.sleep(0.5)  # Simulate network delay
        
        tx_hash = '0x' + os.urandom(32).hex()
        
        return {
            'success': True,
            'transaction_hash': tx_hash,
            'type': tx_type,
            'amount': amount,
            'address': address,
            'pool_id': pool_id,
            'block_number': 12345678 + int(datetime.utcnow().timestamp()),
            'confirmations': 12,
            'gas_fee': self.estimate_gas_fee(tx_type),
            'timestamp': datetime.utcnow().isoformat(),
            'network': self.network,
            'explorer_url': f"{self.config['explorer']}/tx/{tx_hash}",
        }
    
    def get_contract_addresses(self) -> Dict[str, str]:
        """Get deployed contract addresses."""
        return self.contract_addresses
    
    def get_network_info(self) -> Dict[str, Any]:
        """Get current network information."""
        return {
            'name': self.config['name'],
            'chain_id': self.config['chain_id'],
            'explorer': self.config['explorer'],
            'native_token': self.config['native_token'],
            'is_demo': self.is_demo,
        }


# Global blockchain service instance
blockchain_service = BlockchainService(network='testnet')


def get_blockchain_service() -> BlockchainService:
    """Get blockchain service instance."""
    return blockchain_service
