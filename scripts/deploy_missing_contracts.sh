# Deploy All Missing Contracts Script
# Ujamaa DeFi Platform - Polygon Amoy Testnet
# Run this to deploy any missing contracts

#!/bin/bash

echo "=========================================="
echo "Ujamaa DeFi Platform - Contract Deployment"
echo "Polygon Amoy Testnet (Chain ID: 80002)"
echo "=========================================="
echo ""

# Load environment variables
source .env

# Check if PRIVATE_KEY is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not found in .env file"
    exit 1
fi

echo "✅ Private key loaded from .env"
echo ""

# Deploy ULP Token if not deployed
if [ "$CONTRACT_ULP_TOKEN" == "0x0000000000000000000000000000000000000000" ] || [ -z "$CONTRACT_ULP_TOKEN" ]; then
    echo "📝 Deploying ULPToken..."
    forge create contracts/MVP/ULPToken.sol:ULPToken \
        --rpc-url https://rpc-amoy.polygon.technology/ \
        --private-key $PRIVATE_KEY \
        --constructor-args \
            0x0000000000000000000000000000000000000000 \
            200 \
            2000 \
            500 \
            0x0000000000000000000000000000000000000000 \
            0x0000000000000000000000000000000000000000 \
        --verify \
        --etherscan-api-key $POLYGONSCAN_API_KEY
    
    if [ $? -eq 0 ]; then
        echo "✅ ULPToken deployed successfully"
    else
        echo "❌ ULPToken deployment failed"
    fi
else
    echo "⏭️  ULPToken already deployed at: $CONTRACT_ULP_TOKEN"
fi

echo ""

# Deploy LiquidityPool if not deployed
if [ "$CONTRACT_LIQUIDITY_POOL" == "0x0000000000000000000000000000000000000000" ] || [ -z "$CONTRACT_LIQUIDITY_POOL" ]; then
    echo "📝 Deploying LiquidityPool..."
    forge create contracts/MVP/LiquidityPool.sol:LiquidityPool \
        --rpc-url https://rpc-amoy.polygon.technology/ \
        --private-key $PRIVATE_KEY \
        --constructor-args \
            $CONTRACT_ULP_TOKEN \
            $CONTRACT_GUARANTEE_TOKEN \
        --verify \
        --etherscan-api-key $POLYGONSCAN_API_KEY
    
    if [ $? -eq 0 ]; then
        echo "✅ LiquidityPool deployed successfully"
    else
        echo "❌ LiquidityPool deployment failed"
    fi
else
    echo "⏭️  LiquidityPool already deployed at: $CONTRACT_LIQUIDITY_POOL"
fi

echo ""

# Deploy MockEscrow if not deployed
if [ "$CONTRACT_MOCK_ESCROW" == "0x0000000000000000000000000000000000000000" ] || [ -z "$CONTRACT_MOCK_ESCROW" ]; then
    echo "📝 Deploying MockEscrow..."
    forge create contracts/MVP/MockEscrow.sol:MockEscrow \
        --rpc-url https://rpc-amoy.polygon.technology/ \
        --private-key $PRIVATE_KEY \
        --verify \
        --etherscan-api-key $POLYGONSCAN_API_KEY
    
    if [ $? -eq 0 ]; then
        echo "✅ MockEscrow deployed successfully"
    else
        echo "❌ MockEscrow deployment failed"
    fi
else
    echo "⏭️  MockEscrow already deployed at: $CONTRACT_MOCK_ESCROW"
fi

echo ""

# Deploy NavGateway if not deployed
if [ "$CONTRACT_NAV_GATEWAY" == "0x0000000000000000000000000000000000000000" ] || [ -z "$CONTRACT_NAV_GATEWAY" ]; then
    echo "📝 Deploying NavGateway..."
    forge create contracts/MVP/NavGateway.sol:NavGateway \
        --rpc-url https://rpc-amoy.polygon.technology/ \
        --private-key $PRIVATE_KEY \
        --constructor-args \
            $CONTRACT_LIQUIDITY_POOL \
        --verify \
        --etherscan-api-key $POLYGONSCAN_API_KEY
    
    if [ $? -eq 0 ]; then
        echo "✅ NavGateway deployed successfully"
    else
        echo "❌ NavGateway deployment failed"
    fi
else
    echo "⏭️  NavGateway already deployed at: $CONTRACT_NAV_GATEWAY"
fi

echo ""
echo "=========================================="
echo "Deployment Summary"
echo "=========================================="
echo ""
echo "Contract Addresses (Update these in .env):"
echo "-------------------------------------------"
echo "ULP_TOKEN=$CONTRACT_ULP_TOKEN"
echo "GUARANTEE_TOKEN=$CONTRACT_GUARANTEE_TOKEN"
echo "LIQUIDITY_POOL=$CONTRACT_LIQUIDITY_POOL"
echo "INDUSTRIAL_GATEWAY=$CONTRACT_INDUSTRIAL_GATEWAY"
echo "JURISDICTION_COMPLIANCE=$CONTRACT_JURISDICTION_COMPLIANCE"
echo "MOCK_ESCROW=$CONTRACT_MOCK_ESCROW"
echo "MOCK_FIAT_RAMP=$CONTRACT_MOCK_FIAT_RAMP"
echo "NAV_GATEWAY=$CONTRACT_NAV_GATEWAY"
echo "MOCK_EUROD=$CONTRACT_MOCK_EUROD"
echo ""
echo "=========================================="
echo "Next Steps:"
echo "1. Update .env file with new addresses"
echo "2. Update frontend/src/config/web3.ts"
echo "3. Update backend/config/MVP_config.py"
echo "4. Verify contracts on Polygon Amoy Scan"
echo "=========================================="
