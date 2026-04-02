// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ujamaa DeFi Platform
// ERC-3643 Identity Registry for T-REX Token Standard

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title IIdentityRegistry
 * @notice Interface for ERC-3643 identity registry
 * @dev Manages investor identity verification for permissioned tokens
 */
interface IIdentityRegistry {
    /**
     * @notice Identity status enum
     */
    enum IdentityStatus {
        NONE,
        PENDING,
        VERIFIED,
        REJECTED,
        REVOKED
    }

    /**
     * @notice Identity information structure
     */
    struct Identity {
        IdentityStatus status;
        uint256 verifiedAt;
        string jurisdiction;
        string investorType;
        address verifier;
    }

    /**
     * @notice Register identity for an address
     * @param investor Investor address
     * @param jurisdiction Investor jurisdiction (2-letter country code)
     * @param investorType Type of investor (RETAIL, INSTITUTIONAL, etc.)
     */
    function registerIdentity(
        address investor,
        string calldata jurisdiction,
        string calldata investorType
    ) external;

    /**
     * @notice Verify identity (compliance officer only)
     * @param investor Investor address
     */
    function verifyIdentity(address investor) external;

    /**
     * @notice Reject identity verification
     * @param investor Investor address
     * @param reason Rejection reason
     */
    function rejectIdentity(address investor, string calldata reason) external;

    /**
     * @notice Revoke verified identity
     * @param investor Investor address
     */
    function revokeIdentity(address investor) external;

    /**
     * @notice Check if address has verified identity
     * @param investor Investor address
     * @return true if verified
     */
    function isVerified(address investor) external view returns (bool);

    /**
     * @notice Get identity information
     * @param investor Investor address
     * @return Identity struct
     */
    function getIdentity(address investor) external view returns (Identity memory);
}

/**
 * @title IdentityRegistry
 * @notice ERC-3643 compliant identity registry implementation
 * @dev Manages investor verification for Ujamaa DeFi Platform
 */
contract IdentityRegistry is IIdentityRegistry, AccessControl {
    // =========================================================================
    // ROLES
    // =========================================================================

    /**
     * @notice Role for compliance officers
     */
    bytes32 public constant COMPLIANCE_OFFICER_ROLE = keccak256("COMPLIANCE_OFFICER_ROLE");

    /**
     * @notice Role for identity administrators
     */
    bytes32 public constant IDENTITY_ADMIN_ROLE = keccak256("IDENTITY_ADMIN_ROLE");

    // =========================================================================
    // STATE
    // =========================================================================

    /**
     * @notice Mapping of investor addresses to their identities
     */
    mapping(address => Identity) private s_identities;

    /**
     * @notice Count of verified identities
     */
    uint256 private s_verifiedCount;

    // =========================================================================
    // EVENTS
    // =========================================================================

    /**
     * @notice Emitted when identity is registered
     */
    event IdentityRegistered(address indexed investor, string jurisdiction, string investorType);

    /**
     * @notice Emitted when identity is verified
     */
    event IdentityVerified(address indexed investor);

    /**
     * @notice Emitted when identity is rejected
     */
    event IdentityRejected(address indexed investor, string reason);

    /**
     * @notice Emitted when identity is revoked
     */
    event IdentityRevoked(address indexed investor);

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(IDENTITY_ADMIN_ROLE, msg.sender);
    }

    // =========================================================================
    // IDENTITY MANAGEMENT
    // =========================================================================

    /**
     * @notice Register identity for an investor
     * @param investor Investor address
     * @param jurisdiction Investor jurisdiction (2-letter country code)
     * @param investorType Type of investor (RETAIL, INSTITUTIONAL, etc.)
     */
    function registerIdentity(
        address investor,
        string calldata jurisdiction,
        string calldata investorType
    ) external override {
        require(investor != address(0), "IdentityRegistry: Zero address");
        require(bytes(jurisdiction).length == 2, "IdentityRegistry: Invalid jurisdiction code");

        Identity storage identity = s_identities[investor];
        require(identity.status == IdentityStatus.NONE, "IdentityRegistry: Already registered");

        identity.status = IdentityStatus.PENDING;
        identity.jurisdiction = jurisdiction;
        identity.investorType = investorType;

        emit IdentityRegistered(investor, jurisdiction, investorType);
    }

    /**
     * @notice Verify identity (compliance officer only)
     * @param investor Investor address
     */
    function verifyIdentity(address investor) external override {
        require(hasRole(COMPLIANCE_OFFICER_ROLE, msg.sender), "IdentityRegistry: Not compliance officer");

        Identity storage identity = s_identities[investor];
        require(identity.status == IdentityStatus.PENDING, "IdentityRegistry: Not pending");

        identity.status = IdentityStatus.VERIFIED;
        identity.verifiedAt = block.timestamp;
        identity.verifier = msg.sender;

        s_verifiedCount++;

        emit IdentityVerified(investor);
    }

    /**
     * @notice Reject identity verification
     * @param investor Investor address
     * @param reason Rejection reason
     */
    function rejectIdentity(address investor, string calldata reason) external override {
        require(hasRole(COMPLIANCE_OFFICER_ROLE, msg.sender), "IdentityRegistry: Not compliance officer");

        Identity storage identity = s_identities[investor];
        require(identity.status == IdentityStatus.PENDING, "IdentityRegistry: Not pending");

        identity.status = IdentityStatus.REJECTED;
        identity.verifier = msg.sender;

        emit IdentityRejected(investor, reason);
    }

    /**
     * @notice Revoke verified identity
     * @param investor Investor address
     */
    function revokeIdentity(address investor) external override {
        require(
            hasRole(COMPLIANCE_OFFICER_ROLE, msg.sender) || hasRole(IDENTITY_ADMIN_ROLE, msg.sender),
            "IdentityRegistry: Not authorized"
        );

        Identity storage identity = s_identities[investor];
        require(identity.status == IdentityStatus.VERIFIED, "IdentityRegistry: Not verified");

        identity.status = IdentityStatus.REVOKED;
        identity.verifier = msg.sender;

        s_verifiedCount--;

        emit IdentityRevoked(investor);
    }

    // =========================================================================
    // VIEW FUNCTIONS
    // =========================================================================

    /**
     * @notice Check if address has verified identity
     * @param investor Investor address
     * @return true if verified
     */
    function isVerified(address investor) external view override returns (bool) {
        return s_identities[investor].status == IdentityStatus.VERIFIED;
    }

    /**
     * @notice Get identity information
     * @param investor Investor address
     * @return Identity struct
     */
    function getIdentity(address investor) external view override returns (Identity memory) {
        return s_identities[investor];
    }

    /**
     * @notice Get count of verified identities
     * @return Number of verified identities
     */
    function getVerifiedCount() external view returns (uint256) {
        return s_verifiedCount;
    }

    /**
     * @notice Check if jurisdiction is allowed
     * @param jurisdiction 2-letter country code
     * @return true if allowed
     */
    function isJurisdictionAllowed(string calldata jurisdiction) external pure returns (bool) {
        // Blocked jurisdictions (sanctions)
        string[12] memory blocked = [
            "KP", // North Korea
            "IR", // Iran
            "SY", // Syria
            "CU", // Cuba
            "MM", // Myanmar
            "BY", // Belarus
            "RU", // Russia
            "VE", // Venezuela
            "SD", // Sudan
            "YE", // Yemen
            "ML", // Mali
            "BF"  // Burkina Faso
        ];

        for (uint256 i = 0; i < blocked.length; i++) {
            if (keccak256(bytes(blocked[i])) == keccak256(bytes(jurisdiction))) {
                return false;
            }
        }

        return true;
    }
}
