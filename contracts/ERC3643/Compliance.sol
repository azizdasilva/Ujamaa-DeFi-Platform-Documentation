// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ujamaa DeFi Platform
// ERC-3643 Compliance Module for Transfer Validation

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IdentityRegistry.sol";

/**
 * @title ICompliance
 * @notice Interface for ERC-3643 compliance checks
 * @dev Validates transfers based on identity and regulations
 */
interface ICompliance {
    /**
     * @notice Check if transfer is compliant
     * @param from Sender address
     * @param to Recipient address
     * @param amount Transfer amount
     * @return true if compliant
     */
    function canTransfer(address from, address to, uint256 amount) external view returns (bool);

    /**
     * @notice Get compliance reason if transfer blocked
     * @param from Sender address
     * @param to Recipient address
     * @param amount Transfer amount
     * @return Reason string
     */
    function getComplianceReason(address from, address to, uint256 amount) external view returns (string memory);
}

/**
 * @title Compliance
 * @notice ERC-3643 compliant transfer validation module
 * @dev Implements transfer restrictions based on identity and regulations
 */
contract Compliance is ICompliance, AccessControl {
    // =========================================================================
    // ROLES
    // =========================================================================

    /**
     * @notice Role for compliance officers
     */
    bytes32 public constant COMPLIANCE_OFFICER_ROLE = keccak256("COMPLIANCE_OFFICER_ROLE");

    // =========================================================================
    // STATE
    // =========================================================================

    /**
     * @notice Identity registry reference
     */
    IdentityRegistry public immutable IDENTITY_REGISTRY;

    /**
     * @notice Minimum investment amount (18 decimals)
     */
    uint256 public MIN_INVESTMENT = 1000 * 1e18; // €1,000 minimum

    /**
     * @notice Maximum investment amount (18 decimals)
     */
    uint256 public MAX_INVESTMENT = 50000 * 1e18; // €50,000 maximum for retail

    /**
     * @notice Mapping of blocked addresses
     */
    mapping(address => bool) private s_blocked;

    /**
     * @notice Mapping of investment limits by address
     */
    mapping(address => uint256) private s_investmentLimits;

    // =========================================================================
    // EVENTS
    // =========================================================================

    /**
     * @notice Emitted when address is blocked
     */
    event AddressBlocked(address indexed addr, string reason);

    /**
     * @notice Emitted when address is unblocked
     */
    event AddressUnblocked(address indexed addr);

    /**
     * @notice Emitted when investment limit is updated
     */
    event InvestmentLimitUpdated(address indexed addr, uint256 limit);

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    constructor(address identityRegistry) {
        require(identityRegistry != address(0), "Compliance: Zero address");
        IDENTITY_REGISTRY = IdentityRegistry(identityRegistry);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COMPLIANCE_OFFICER_ROLE, msg.sender);
    }

    // =========================================================================
    // COMPLIANCE CHECKS
    // =========================================================================

    /**
     * @notice Check if transfer is compliant
     * @param from Sender address
     * @param to Recipient address
     * @param amount Transfer amount
     * @return true if compliant
     */
    function canTransfer(address from, address to, uint256 amount) external view override returns (bool) {
        // Check if addresses are blocked
        if (s_blocked[from] || s_blocked[to]) {
            return false;
        }

        // Check identity verification
        if (!IDENTITY_REGISTRY.isVerified(from) || !IDENTITY_REGISTRY.isVerified(to)) {
            return false;
        }

        // Check jurisdiction restrictions
        IdentityRegistry.Identity memory fromIdentity = IDENTITY_REGISTRY.getIdentity(from);
        IdentityRegistry.Identity memory toIdentity = IDENTITY_REGISTRY.getIdentity(to);

        if (!IDENTITY_REGISTRY.isJurisdictionAllowed(fromIdentity.jurisdiction) ||
            !IDENTITY_REGISTRY.isJurisdictionAllowed(toIdentity.jurisdiction)) {
            return false;
        }

        // Check investment limits
        if (amount > s_investmentLimits[from] && s_investmentLimits[from] > 0) {
            return false;
        }

        return true;
    }

    /**
     * @notice Get compliance reason if transfer blocked
     * @param from Sender address
     * @param to Recipient address
     * @param amount Transfer amount
     * @return Reason string
     */
    function getComplianceReason(address from, address to, uint256 amount) external view override returns (string memory) {
        if (s_blocked[from]) {
            return "Sender address is blocked";
        }

        if (s_blocked[to]) {
            return "Recipient address is blocked";
        }

        if (!IDENTITY_REGISTRY.isVerified(from)) {
            return "Sender identity not verified";
        }

        if (!IDENTITY_REGISTRY.isVerified(to)) {
            return "Recipient identity not verified";
        }

        IdentityRegistry.Identity memory fromIdentity = IDENTITY_REGISTRY.getIdentity(from);
        if (!IDENTITY_REGISTRY.isJurisdictionAllowed(fromIdentity.jurisdiction)) {
            return string(abi.encodePacked("Blocked jurisdiction: ", fromIdentity.jurisdiction));
        }

        IdentityRegistry.Identity memory toIdentity = IDENTITY_REGISTRY.getIdentity(to);
        if (!IDENTITY_REGISTRY.isJurisdictionAllowed(toIdentity.jurisdiction)) {
            return string(abi.encodePacked("Blocked jurisdiction: ", toIdentity.jurisdiction));
        }

        if (s_investmentLimits[from] > 0 && amount > s_investmentLimits[from]) {
            return "Amount exceeds investment limit";
        }

        return "";
    }

    // =========================================================================
    // ADMIN FUNCTIONS
    // =========================================================================

    /**
     * @notice Block an address
     * @param addr Address to block
     * @param reason Blocking reason
     */
    function blockAddress(address addr, string calldata reason) external {
        require(hasRole(COMPLIANCE_OFFICER_ROLE, msg.sender), "Compliance: Not authorized");
        require(addr != address(0), "Compliance: Zero address");

        s_blocked[addr] = true;

        emit AddressBlocked(addr, reason);
    }

    /**
     * @notice Unblock an address
     * @param addr Address to unblock
     */
    function unblockAddress(address addr) external {
        require(hasRole(COMPLIANCE_OFFICER_ROLE, msg.sender), "Compliance: Not authorized");

        s_blocked[addr] = false;

        emit AddressUnblocked(addr);
    }

    /**
     * @notice Set investment limit for an address
     * @param addr Address
     * @param limit Investment limit (18 decimals)
     */
    function setInvestmentLimit(address addr, uint256 limit) external {
        require(hasRole(COMPLIANCE_OFFICER_ROLE, msg.sender), "Compliance: Not authorized");

        s_investmentLimits[addr] = limit;

        emit InvestmentLimitUpdated(addr, limit);
    }

    /**
     * @notice Update minimum investment amount
     * @param amount New minimum (18 decimals)
     */
    function setMinInvestment(uint256 amount) external {
        require(hasRole(COMPLIANCE_OFFICER_ROLE, msg.sender), "Compliance: Not authorized");
        MIN_INVESTMENT = amount;
    }

    /**
     * @notice Update maximum investment amount
     * @param amount New maximum (18 decimals)
     */
    function setMaxInvestment(uint256 amount) external {
        require(hasRole(COMPLIANCE_OFFICER_ROLE, msg.sender), "Compliance: Not authorized");
        MAX_INVESTMENT = amount;
    }

    // =========================================================================
    // VIEW FUNCTIONS
    // =========================================================================

    /**
     * @notice Check if address is blocked
     * @param addr Address to check
     * @return true if blocked
     */
    function isBlocked(address addr) external view returns (bool) {
        return s_blocked[addr];
    }

    /**
     * @notice Get investment limit for address
     * @param addr Address to check
     * @return Investment limit
     */
    function getInvestmentLimit(address addr) external view returns (uint256) {
        return s_investmentLimits[addr];
    }
}
