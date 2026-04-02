// SPDX-License-Identifier: MIT
// Deploy ERC-3643 Infrastructure and all MVP contracts

pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/ERC3643/IdentityRegistry.sol";
import "../contracts/ERC3643/Compliance.sol";
import "../contracts/MVP/ULPToken.sol";
import "../contracts/MVP/LiquidityPool.sol";
import "../contracts/MVP/MockEscrow.sol";

contract DeployERC3643AndMVP is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address deployer = vm.addr(deployerPrivateKey);
        console.log("Deployer:", deployer);

        // =====================================================================
        // STEP 1: Deploy ERC-3643 Infrastructure
        // =====================================================================
        console.log("\n=== Deploying ERC-3643 Infrastructure ===");

        // Deploy Identity Registry
        IdentityRegistry identityRegistry = new IdentityRegistry();
        console.log("IdentityRegistry deployed:", address(identityRegistry));

        // Deploy Compliance Module
        Compliance compliance = new Compliance(address(identityRegistry));
        console.log("Compliance deployed:", address(compliance));

        // =====================================================================
        // STEP 2: Deploy MVP Contracts
        // =====================================================================
        console.log("\n=== Deploying MVP Contracts ===");

        // Deploy Mock EUROD (test stablecoin)
        // Note: Assuming MockEUROD exists, if not skip this
        // MockEUROD eurod = new MockEUROD();
        // console.log("MockEUROD deployed:", address(eurod));

        // Deploy ULPToken with ERC-3643
        // Note: Using address(0) for UJEUR on testnet (will be replaced with real token)
        ULPToken ulpToken = new ULPToken(
            address(0x0000000000000000000000000000000000000000), // UJEUR token (testnet placeholder)
            200, // 2% management fee
            2000, // 20% performance fee
            500, // 5% hurdle rate
            address(identityRegistry),
            address(compliance)
        );
        console.log("ULPToken deployed:", address(ulpToken));

        // Deploy LiquidityPool
        // LiquidityPool pool = new LiquidityPool(address(ulpToken));
        // console.log("LiquidityPool deployed:", address(pool));

        // Deploy MockEscrow (the missing contract!)
        MockEscrow mockEscrow = new MockEscrow();
        console.log("MockEscrow deployed:", address(mockEscrow));

        // =====================================================================
        // STEP 3: Configure Roles
        // =====================================================================
        console.log("\n=== Configuring Roles ===");

        // Grant compliance officer role to deployer
        identityRegistry.grantRole(identityRegistry.COMPLIANCE_OFFICER_ROLE(), deployer);
        console.log("Deployer granted COMPLIANCE_OFFICER_ROLE");

        compliance.grantRole(compliance.COMPLIANCE_OFFICER_ROLE(), deployer);
        console.log("Deployer granted COMPLIANCE_OFFICER_ROLE");

        // =====================================================================
        // STEP 4: Output Addresses
        // =====================================================================
        console.log("\n=== Deployment Summary ===");
        console.log("IdentityRegistry:", address(identityRegistry));
        console.log("Compliance:", address(compliance));
        console.log("ULPToken:", address(ulpToken));
        console.log("MockEscrow:", address(mockEscrow));

        vm.stopBroadcast();
    }
}
