// SPDX-License-Identifier: MIT
// Ujamaa DeFi Platform - MVP Testnet Deployment Script
// Network: Polygon Amoy (Chain ID: 80002)
// Deploys ALL contracts including Oracle

pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/MVP/MockEUROD.sol";
import "../contracts/MVP/ULPToken.sol";
import "../contracts/MVP/GuaranteeToken.sol";
import "../contracts/MVP/LiquidityPool.sol";
import "../contracts/MVP/IndustrialGateway.sol";
import "../contracts/MVP/JurisdictionCompliance.sol";
import "../contracts/MVP/MockEscrow.sol";
import "../contracts/MVP/MockFiatRamp.sol";
import "../contracts/MVP/NavGateway.sol";

/**
 * MVP Testnet Deployment Script - DEPLOYS ALL CONTRACTS
 *
 * Usage:
 * 1. Set environment variables:
 *    export PRIVATE_KEY=your_deployer_private_key
 *
 * 2. Run deployment:
 *    forge script script/DeployMVP.s.sol:DeployMVP --rpc-url polygon_amoy --broadcast -vvvv
 *
 * Deployment Order:
 * 1. MockUJEUR (no deps)
 * 2. JurisdictionCompliance (no deps)
 * 3. MockEscrow (no deps)
 * 4. NavOracle (no deps)
 * 5. ULPToken (needs ujeurToken)
 * 6. GuaranteeToken (no deps)
 * 7. IndustrialGateway (needs GuaranteeToken)
 * 8. LiquidityPool (needs ulpToken, ujeurToken, guaranteeToken)
 * 9. MockFiatRamp (needs ujeurToken)
 */
contract DeployMVP is Script {
    // Deployed contract addresses
    struct DeploymentOutput {
        address mockEUROD;
        address ulpToken;
        address guaranteeToken;
        address liquidityPool;
        address industrialGateway;
        address jurisdictionCompliance;
        address mockEscrow;
        address mockFiatRamp;
        address navGateway;
    }

    function run() external returns (DeploymentOutput memory) {
        // Load deployer private key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcast
        vm.startBroadcast(deployerPrivateKey);

        address deployer = vm.addr(deployerPrivateKey);
        console.log("Deployer address:", deployer);

        // =====================================================================
        // 1. Deploy MockEUROD (no dependencies)
        // =====================================================================
        MockEUROD mockEUROD = new MockEUROD();
        console.log("MockEUROD deployed:", address(mockEUROD));

        // =====================================================================
        // 2. Deploy JurisdictionCompliance (no dependencies)
        // =====================================================================
        JurisdictionCompliance jurisdictionCompliance = new JurisdictionCompliance();
        console.log("JurisdictionCompliance deployed:", address(jurisdictionCompliance));

        // =====================================================================
        // 3. Deploy MockEscrow (no dependencies)
        // =====================================================================
        MockEscrow mockEscrow = new MockEscrow();
        console.log("MockEscrow deployed:", address(mockEscrow));

        // =====================================================================
        // 4. Deploy NavGateway (no dependencies)
        // =====================================================================
        NavGateway navGateway = new NavGateway(1e18); // Initial NAV = €1.00
        console.log("NavGateway deployed:", address(navGateway));

        // =====================================================================
        // 5. Deploy ULPToken (needs eurodToken)
        // =====================================================================
        ULPToken ulpToken = new ULPToken(
            address(mockEUROD),      // eurodToken
            200,                     // managementFeeRate (2%)
            2000,                    // performanceFeeRate (20%)
            500                      // hurdleRate (5%)
        );
        console.log("ULPToken deployed:", address(ulpToken));

        // =====================================================================
        // 6. Deploy GuaranteeToken (no dependencies)
        // =====================================================================
        GuaranteeToken guaranteeToken = new GuaranteeToken();
        console.log("GuaranteeToken deployed:", address(guaranteeToken));

        // =====================================================================
        // 7. Deploy IndustrialGateway (needs GuaranteeToken reference)
        // =====================================================================
        IndustrialGateway industrialGateway = new IndustrialGateway();
        console.log("IndustrialGateway deployed:", address(industrialGateway));

        // =====================================================================
        // 8. Deploy LiquidityPool (needs ulpToken, eurodToken, guaranteeToken)
        // =====================================================================
        LiquidityPool liquidityPool = new LiquidityPool(
            address(ulpToken),       // ulpToken
            address(mockEUROD),      // eurodToken
            address(guaranteeToken)  // guaranteeToken
        );
        console.log("LiquidityPool deployed:", address(liquidityPool));

        // =====================================================================
        // 9. Deploy MockFiatRamp (needs eurodToken)
        // =====================================================================
        MockFiatRamp mockFiatRamp = new MockFiatRamp(address(mockEUROD));
        console.log("MockFiatRamp deployed:", address(mockFiatRamp));

        // =====================================================================
        // Initialize Contracts & Grant Roles
        // =====================================================================

        // Grant roles for ULPToken
        ulpToken.grantRole(ulpToken.MINTER_ROLE(), deployer);
        ulpToken.grantRole(ulpToken.REDEEMER_ROLE(), deployer);
        ulpToken.grantRole(ulpToken.POOL_MANAGER_ROLE(), deployer);

        // Grant roles for GuaranteeToken
        guaranteeToken.grantRole(guaranteeToken.MINTER_ROLE(), deployer);
        guaranteeToken.grantRole(guaranteeToken.POOL_MANAGER_ROLE(), deployer);

        // Grant roles for IndustrialGateway
        industrialGateway.grantRole(industrialGateway.CERTIFIER_ROLE(), deployer);
        industrialGateway.grantRole(industrialGateway.POOL_MANAGER_ROLE(), deployer);

        // Grant roles for LiquidityPool
        liquidityPool.grantRole(liquidityPool.POOL_MANAGER_ROLE(), deployer);
        liquidityPool.grantRole(liquidityPool.COMPLIANCE_OFFICER_ROLE(), deployer);

        // Grant roles for MockEscrow
        mockEscrow.grantRole(mockEscrow.DEFAULT_ADMIN_ROLE(), deployer);
        mockEscrow.grantRole(mockEscrow.BANK_OPERATOR_ROLE(), deployer);

        // Grant roles for MockFiatRamp
        mockFiatRamp.grantRole(mockFiatRamp.RAMP_OPERATOR_ROLE(), deployer);

        // Grant roles for NavGateway
        navGateway.grantRole(navGateway.UPDATER_ROLE(), deployer);

        // Pool families are initialized in LiquidityPool constructor

        // =====================================================================
        // Summary
        // =====================================================================
        vm.stopBroadcast();

        DeploymentOutput memory output = DeploymentOutput({
            mockEUROD: address(mockEUROD),
            ulpToken: address(ulpToken),
            guaranteeToken: address(guaranteeToken),
            liquidityPool: address(liquidityPool),
            industrialGateway: address(industrialGateway),
            jurisdictionCompliance: address(jurisdictionCompliance),
            mockEscrow: address(mockEscrow),
            mockFiatRamp: address(mockFiatRamp),
            navGateway: address(navGateway)
        });

        // Log deployment summary
        console.log("\n========================================");
        console.log("       DEPLOYMENT COMPLETE");
        console.log("========================================");
        console.log("Network: Polygon Amoy (80002)");
        console.log("Deployer:", deployer);
        console.log("----------------------------------------");
        console.log("ALL Contract Addresses:");
        console.log("MockEUROD:           ", address(mockEUROD));
        console.log("ULPToken:            ", address(ulpToken));
        console.log("GuaranteeToken:      ", address(guaranteeToken));
        console.log("LiquidityPool:       ", address(liquidityPool));
        console.log("IndustrialGateway:   ", address(industrialGateway));
        console.log("JurisdictionCompliance:", address(jurisdictionCompliance));
        console.log("MockEscrow:          ", address(mockEscrow));
        console.log("MockFiatRamp:        ", address(mockFiatRamp));
        console.log("NavGateway:          ", address(navGateway));
        console.log("========================================\n");

        console.log("Copy these addresses to:");
        console.log("1. frontend/src/config/monitor.ts");
        console.log("2. frontend/src/MVP/pages/ContractTestDashboard.tsx");
        console.log("Then set USE_MOCK_DATA: false");

        return output;
    }
}
