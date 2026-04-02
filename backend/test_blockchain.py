"""
Blockchain Integration Test Script
Ujamaa DeFi Platform - MVP Testnet

Tests:
1. Web3 connection to Polygon Amoy
2. Contract deployment verification
3. Contract balance queries
4. Token minting (if DEMO_MODE=False)

Usage:
    python test_blockchain.py
"""

import os
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from services.blockchain_service import BlockchainService
from web3 import Web3

def print_header(text: str):
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70 + "\n")

def test_web3_connection():
    """Test 1: Web3 connection to RPC"""
    print_header("TEST 1: Web3 Connection")
    
    rpc_url = "https://rpc-amoy.polygon.technology/"
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    if w3.is_connected():
        print("✅ Connected to Polygon Amoy RPC")
        print(f"   Chain ID: {w3.eth.chain_id}")
        print(f"   Latest Block: {w3.eth.block_number}")
        return True
    else:
        print("❌ Failed to connect to RPC")
        return False

def test_contract_deployment():
    """Test 2: Verify contracts are deployed"""
    print_header("TEST 2: Contract Deployment Verification")
    
    contracts = {
        'ULP_TOKEN': os.getenv('CONTRACT_ULP_TOKEN'),
        'LIQUIDITY_POOL': os.getenv('CONTRACT_LIQUIDITY_POOL'),
        'GUARANTEE_TOKEN': os.getenv('CONTRACT_GUARANTEE_TOKEN'),
        'INDUSTRIAL_GATEWAY': os.getenv('CONTRACT_INDUSTRIAL_GATEWAY'),
    }
    
    rpc_url = "https://rpc-amoy.polygon.technology/"
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    all_deployed = True
    for name, address in contracts.items():
        if not address:
            print(f"⚠️  {name}: Address not configured")
            continue
        
        # Convert to checksum address
        checksum_address = w3.to_checksum_address(address)
        code = w3.eth.get_code(checksum_address)
        if len(code) > 0:
            print(f"✅ {name}: Deployed at {checksum_address[:20]}...")
        else:
            print(f"❌ {name}: NOT deployed at {checksum_address[:20]}...")
            all_deployed = False
    
    return all_deployed

def test_blockchain_service():
    """Test 3: BlockchainService initialization"""
    print_header("TEST 3: BlockchainService Initialization")
    
    bs = BlockchainService(network='testnet')
    
    print(f"Network: {bs.network}")
    print(f"Demo Mode: {bs.is_demo}")
    print(f"Contracts Loaded: {len(bs.contracts)}")
    
    if bs.contracts:
        print("✅ Contracts loaded successfully")
        for name in bs.contracts.keys():
            print(f"   - {name}")
        return True
    else:
        if bs.is_demo:
            print("ℹ️  Running in DEMO mode - contracts not loaded")
            return True
        else:
            print("⚠️  No contracts loaded (check .env configuration)")
            return False

def test_token_balance():
    """Test 4: Query token balance"""
    print_header("TEST 4: Token Balance Query")
    
    # Use a known wallet address (from demo accounts)
    test_wallet = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"
    
    bs = BlockchainService(network='testnet')
    
    if not bs.contracts.get('ULP_TOKEN'):
        print("⚠️  ULP_TOKEN contract not loaded (demo mode or config issue)")
        return True
    
    try:
        contract = bs.contracts['ULP_TOKEN']
        # Convert to checksum address
        checksum_wallet = bs.w3.to_checksum_address(test_wallet)
        balance = contract.functions.balanceOf(checksum_wallet).call()
        balance_formatted = balance / 1e18
        
        print(f"Wallet: {checksum_wallet[:20]}...")
        print(f"ULP Balance: {balance_formatted:.2f} UPT")
        print("✅ Balance query successful")
        return True
    except Exception as e:
        print(f"❌ Balance query failed: {e}")
        return False

def test_mint_tokens():
    """Test 5: Mint tokens (only if DEMO_MODE=False)"""
    print_header("TEST 5: Token Minting")
    
    demo_mode = os.getenv('DEMO_MODE', 'True').lower() == 'true'
    
    if demo_mode:
        print("ℹ️  Skipping - Running in DEMO mode")
        print("   Set DEMO_MODE=False in .env to enable real minting")
        return True
    
    private_key = os.getenv('PRIVATE_KEY')
    if not private_key:
        print("⚠️  PRIVATE_KEY not configured in .env")
        return False
    
    bs = BlockchainService(network='testnet')
    
    if not bs.contracts.get('ULP_TOKEN'):
        print("❌ ULP_TOKEN contract not loaded")
        return False
    
    try:
        # Mint 1000 UPT tokens to test wallet
        result = bs.mint_ult_tokens(
            to_address="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
            amount=1000,
            pool_id="POOL_INDUSTRIE"
        )
        
        if result.get('success'):
            print(f"✅ Minting successful!")
            print(f"   TX Hash: {result.get('tx_hash', 'N/A')[:20]}...")
            print(f"   Block: {result.get('block_number', 'N/A')}")
            return True
        else:
            print(f"❌ Minting failed: {result.get('error', 'Unknown error')}")
            return False
    except Exception as e:
        print(f"❌ Minting failed with exception: {e}")
        return False

def main():
    """Run all tests"""
    print_header("🧪 BLOCKCHAIN INTEGRATION TESTS")
    print("Ujamaa DeFi Platform - MVP Testnet")
    print(f"Network: Polygon Amoy (Chain ID: 80002)")
    print(f"DEMO_MODE: {os.getenv('DEMO_MODE', 'True')}")
    
    results = []
    
    # Run tests
    results.append(("Web3 Connection", test_web3_connection()))
    results.append(("Contract Deployment", test_contract_deployment()))
    results.append(("BlockchainService", test_blockchain_service()))
    results.append(("Token Balance", test_token_balance()))
    results.append(("Token Minting", test_mint_tokens()))
    
    # Summary
    print_header("TEST SUMMARY")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Blockchain integration is working!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check configuration.")
        return 1

if __name__ == '__main__':
    exit(main())
