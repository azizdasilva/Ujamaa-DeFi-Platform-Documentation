// SPDX-License-Identifier: MIT
// Ujamaa DeFi Platform - MVP Testnet Deployment Script
// Network: Polygon Amoy (Chain ID: 80002)
// Deploys ALL contracts including ERC-3643 infrastructure

pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/MVP/MockEUROD.sol";
import "../contracts/MVP/ULPTokenizer.sol";
import "../contracts/MVP/GuaranteeTokenizer.sol";
import "../contracts/MVP/LiquidityPool.sol";
import "../contracts/MVP/IndustrialGateway.sol";
import "../contracts/MVP/JurisdictionCompliance.sol";
import "../contracts/MVP/MockEscrow.sol";
import "../contracts/MVP/MockFiatRamp.sol";
import "../contracts/MVP/NavGateway.sol";
import "../contracts/ERC3643/IdentityRegistry.sol";
import "../contracts/ERC3643/Compliance.sol";

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
 * 1. MockEUROD (no deps)
 * 2. JurisdictionCompliance (no deps)
 * 3. IdentityRegistry (no deps)
 * 4. Compliance (no deps)
 * 5. MockEscrow (no deps)
 * 6. NavGateway (no deps)
 * 7. ULPTokenizer (needs eurodToken, identityRegistry, compliance)
 * 8. GuaranteeTokenizer (no deps)
 * 9. IndustrialGateway (needs GuaranteeTokenizer set later)
 * 10. LiquidityPool (needs ulpToken, eurodToken, guaranteeToken)
 * 11. MockFiatRamp (needs eurodToken)
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
        address identityRegistry;
        address compliance;
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
        // 3. Deploy IdentityRegistry (ERC-3643)
        // =====================================================================
        IdentityRegistry identityRegistry = new IdentityRegistry();
        console.log("IdentityRegistry deployed:", address(identityRegistry));

        // =====================================================================
        // 4. Deploy Compliance (needs identityRegistry address)
        // =====================================================================
        Compliance compliance = new Compliance(address(identityRegistry));
        console.log("Compliance deployed:", address(compliance));
        console.log("Compliance -> IdentityRegistry linked");

        // =====================================================================
        // 5. Deploy MockEscrow (no dependencies)
        // =====================================================================
        MockEscrow mockEscrow = new MockEscrow();
        console.log("MockEscrow deployed:", address(mockEscrow));

        // =====================================================================
        // 6. Deploy NavGateway (no dependencies)
        // =====================================================================
        NavGateway navGateway = new NavGateway(1e18); // Initial NAV = €1.00
        console.log("NavGateway deployed:", address(navGateway));

        // =====================================================================
        // 7. Deploy ULPTokenizer (needs eurodToken, identityRegistry, compliance)
        // =====================================================================
        ULPTokenizer ulpToken = new ULPTokenizer(
            address(mockEUROD),          // _ujeurToken
            200,                         // _managementFeeRate (2%)
            2000,                        // _performanceFeeRate (20%)
            500,                         // _hurdleRate (5%)
            address(identityRegistry),   // _identityRegistry (ERC-3643)
            address(compliance)          // _compliance (ERC-3643)
        );
        console.log("ULPTokenizer deployed:", address(ulpToken));

        // =====================================================================
        // 8. Deploy GuaranteeTokenizer (no dependencies)
        // =====================================================================
        GuaranteeTokenizer guaranteeToken = new GuaranteeTokenizer();
        console.log("GuaranteeTokenizer deployed:", address(guaranteeToken));

        // =====================================================================
        // 9. Deploy IndustrialGateway (needs GuaranteeToken reference set later)
        // =====================================================================
        IndustrialGateway industrialGateway = new IndustrialGateway();
        console.log("IndustrialGateway deployed:", address(industrialGateway));

        // =====================================================================
        // 10. Deploy LiquidityPool (needs ulpToken, eurodToken, guaranteeToken)
        // =====================================================================
        LiquidityPool liquidityPool = new LiquidityPool(
            address(ulpToken),          // ulpToken
            address(mockEUROD),         // eurodToken
            address(guaranteeToken)     // guaranteeToken
        );
        console.log("LiquidityPool deployed:", address(liquidityPool));

        // =====================================================================
        // 11. Deploy MockFiatRamp (needs eurodToken)
        // =====================================================================
        MockFiatRamp mockFiatRamp = new MockFiatRamp(address(mockEUROD));
        console.log("MockFiatRamp deployed:", address(mockFiatRamp));

        // =====================================================================
        // Initialize Contracts & Grant Roles
        // =====================================================================

        // Grant roles for ULPTokenizer
        ulpToken.grantRole(ulpToken.MINTER_ROLE(), deployer);
        ulpToken.grantRole(ulpToken.REDEEMER_ROLE(), deployer);
        ulpToken.grantRole(ulpToken.POOL_MANAGER_ROLE(), deployer);

        // Grant roles for IdentityRegistry
        identityRegistry.grantRole(identityRegistry.COMPLIANCE_OFFICER_ROLE(), deployer);
        identityRegistry.grantRole(identityRegistry.IDENTITY_ADMIN_ROLE(), deployer);

        // Grant roles for Compliance
        compliance.grantRole(compliance.COMPLIANCE_OFFICER_ROLE(), deployer);

        // Wire IdentityRegistry + Compliance into Compliance module
        // (if Compliance needs IdentityRegistry reference)

        // Wire GuaranteeTokenizer into IndustrialGateway
        industrialGateway.setGuaranteeToken(address(guaranteeToken));
        console.log("IndustrialGateway -> GuaranteeTokenizer linked");

        // Grant roles for GuaranteeTokenizer
        guaranteeToken.grantRole(guaranteeToken.MINTER_ROLE(), deployer);
        guaranteeToken.grantRole(guaranteeToken.POOL_MANAGER_ROLE(), deployer);
        guaranteeToken.grantRole(guaranteeToken.COMPLIANCE_OFFICER_ROLE(), deployer);

        // Configure ERC-3643 compliance for GuaranteeTokenizer
        guaranteeToken.setIdentityRegistry(address(identityRegistry));
        guaranteeToken.setComplianceModule(address(compliance));
        console.log("GuaranteeTokenizer -> IdentityRegistry + Compliance linked (ERC-3643NFT)");

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
            navGateway: address(navGateway),
            identityRegistry: address(identityRegistry),
            compliance: address(compliance)
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
        console.log("ULPTokenizer:        ", address(ulpToken));
        console.log("GuaranteeTokenizer:  ", address(guaranteeToken));
        console.log("LiquidityPool:       ", address(liquidityPool));
        console.log("IndustrialGateway:   ", address(industrialGateway));
        console.log("JurisdictionCompliance:", address(jurisdictionCompliance));
        console.log("IdentityRegistry:    ", address(identityRegistry));
        console.log("Compliance:          ", address(compliance));
        console.log("MockEscrow:          ", address(mockEscrow));
        console.log("MockFiatRamp:        ", address(mockFiatRamp));
        console.log("NavGateway:          ", address(navGateway));
        console.log("========================================\n");

        console.log("Copy these addresses to:");
        console.log("1. backend/.env");
        console.log("2. frontend/src/config/monitor.ts");
        console.log("3. frontend/src/MVP/pages/ContractTestDashboard.tsx");
        console.log("Then set DEMO_MODE=False for real blockchain calls");

        return output;
    }
}
