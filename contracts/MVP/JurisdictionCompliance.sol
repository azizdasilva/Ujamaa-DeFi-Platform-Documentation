// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ujamaa DeFi Platform
// Author: Aziz Da Silva - Lead Architect

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title JurisdictionCompliance
 * @notice Jurisdiction compliance module for investor verification
 * @dev Implements strictest combined list: OFAC + UN + EU + FATF High-Risk
 * 
 * Blocked Jurisdictions (12):
 * - KP (North Korea): OFAC, UN, EU sanctions
 * - IR (Iran): OFAC, UN, EU sanctions
 * - SY (Syria): OFAC, UN, EU sanctions
 * - CU (Cuba): OFAC sanctions
 * - MM (Myanmar): OFAC, EU sanctions
 * - BY (Belarus): OFAC, EU sanctions
 * - RU (Russia): OFAC, EU sanctions
 * - VE (Venezuela): OFAC sanctions
 * - SD (Sudan): OFAC sanctions
 * - YE (Yemen): UN arms embargo
 * - ML (Mali): FATF High-Risk
 * - BF (Burkina Faso): FATF High-Risk
 * 
 * Allowed African Markets:
 * NG, KE, ZA, GH, MU, CI, SN, TG, BJ
 * 
 * Allowed International:
 * EU, UK, UAE, SG, US (accredited only)
 * 
 * @reference SRS v2.0 Sections 1.2, 1.3, 10
 * @reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md Section 5.3
 * 
 * @notice MVP-2 TESTNET: This is a testnet deployment. No real funds.
 */
contract JurisdictionCompliance is AccessControl {
    // =========================================================================
    // CONSTANTS
    // =========================================================================

    /**
     * @notice Role for compliance officers
     */
    bytes32 public constant COMPLIANCE_OFFICER_ROLE = keccak256("COMPLIANCE_OFFICER_ROLE");

    /**
     * @notice Role for adding/removing jurisdictions
     */
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /**
     * @notice MVP-2 Testnet flag
     */
    bool public constant IS_MVP_TESTNET = true;

    /**
     * @notice Compliance status enum
     */
    enum ComplianceStatus {
        ALLOWED,
        BLOCKED,
        REVIEW_REQUIRED
    }

    // =========================================================================
    // STRUCTS
    // =========================================================================

    /**
     * @notice Jurisdiction information
     * @param code ISO 3166-1 alpha-2 country code
     * @param name Country name
     * @param isBlocked Whether jurisdiction is blocked
     * @param reason Reason for block (if applicable)
     * @param sanctionsList Sanctions list (OFAC, UN, EU, FATF)
     */
    struct Jurisdiction {
        string code;
        string name;
        bool isBlocked;
        string reason;
        string sanctionsList;
    }

    // =========================================================================
    // STATE VARIABLES
    // =========================================================================

    /**
     * @notice All jurisdictions by code
     */
    mapping(string => Jurisdiction) public jurisdictions;

    /**
     * @notice List of blocked jurisdiction codes
     */
    string[] public blockedJurisdictions;

    /**
     * @notice List of allowed African market codes
     */
    string[] public allowedAfricanMarkets;

    /**
     * @notice List of allowed international codes
     */
    string[] public allowedInternational;

    /**
     * @notice Investor jurisdiction mapping
     * @dev Key: investor address, Value: jurisdiction code
     */
    mapping(address => string) public investorJurisdiction;

    /**
     * @notice Investor compliance status
     * @dev Key: investor address, Value: is approved
     */
    mapping(address => bool) public investorApproval;

    /**
     * @notice Jurisdiction requiring enhanced review
     */
    mapping(string => bool) public reviewRequiredJurisdictions;

    // =========================================================================
    // EVENTS
    // =========================================================================

    /**
     * @notice Emitted when jurisdiction is added to blocked list
     * @param code Jurisdiction code
     * @param name Jurisdiction name
     * @param reason Reason for blocking
     */
    event JurisdictionBlocked(string indexed code, string name, string reason);

    /**
     * @notice Emitted when jurisdiction is removed from blocked list
     * @param code Jurisdiction code
     */
    event JurisdictionUnblocked(string indexed code);

    /**
     * @notice Emitted when investor jurisdiction is registered
     * @param investor Investor address
     * @param jurisdiction Jurisdiction code
     * @param status Compliance status
     */
    event InvestorJurisdictionRegistered(
        address indexed investor,
        string jurisdiction,
        ComplianceStatus status
    );

    /**
     * @notice Emitted when investor is approved
     * @param investor Investor address
     * @param approvedBy Compliance officer address
     */
    event InvestorApproved(address indexed investor, address indexed approvedBy);

    /**
     * @notice Emitted when investor approval is revoked
     * @param investor Investor address
     * @param revokedBy Compliance officer address
     */
    event InvestorApprovalRevoked(address indexed investor, address indexed revokedBy);

    // =========================================================================
    // ERRORS
    // =========================================================================

    error JurisdictionBlockedError(string code, string reason);
    error JurisdictionReviewRequired(string code);
    error InvalidJurisdictionCode();
    error DuplicateJurisdiction();
    error NotComplianceOfficer();

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    /**
     * @notice Initialize JurisdictionCompliance
     * @dev Populates blocked jurisdictions and allowed markets
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COMPLIANCE_OFFICER_ROLE, msg.sender);

        // Initialize blocked jurisdictions (strictest list)
        _initializeBlockedJurisdictions();

        // Initialize allowed markets
        _initializeAllowedMarkets();
    }

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    /**
     * @notice Initialize blocked jurisdictions list
     */
    function _initializeBlockedJurisdictions() internal {
        // OFAC + UN + EU + FATF High-Risk (12 jurisdictions)
        _blockJurisdiction("KP", "North Korea", "OFAC, UN, EU sanctions", "OFAC+UN+EU");
        _blockJurisdiction("IR", "Iran", "OFAC, UN, EU sanctions", "OFAC+UN+EU");
        _blockJurisdiction("SY", "Syria", "OFAC, UN, EU sanctions", "OFAC+UN+EU");
        _blockJurisdiction("CU", "Cuba", "OFAC sanctions", "OFAC");
        _blockJurisdiction("MM", "Myanmar", "OFAC, EU sanctions", "OFAC+EU");
        _blockJurisdiction("BY", "Belarus", "OFAC, EU sanctions", "OFAC+EU");
        _blockJurisdiction("RU", "Russia", "OFAC, EU sanctions", "OFAC+EU");
        _blockJurisdiction("VE", "Venezuela", "OFAC sanctions", "OFAC");
        _blockJurisdiction("SD", "Sudan", "OFAC sanctions", "OFAC");
        _blockJurisdiction("YE", "Yemen", "UN arms embargo", "UN");
        _blockJurisdiction("ML", "Mali", "FATF High-Risk Jurisdiction", "FATF");
        _blockJurisdiction("BF", "Burkina Faso", "FATF High-Risk Jurisdiction", "FATF");
    }

    /**
     * @notice Initialize allowed markets
     */
    function _initializeAllowedMarkets() internal {
        // African markets
        allowedAfricanMarkets.push("NG"); // Nigeria
        allowedAfricanMarkets.push("KE"); // Kenya
        allowedAfricanMarkets.push("ZA"); // South Africa
        allowedAfricanMarkets.push("GH"); // Ghana
        allowedAfricanMarkets.push("MU"); // Mauritius
        allowedAfricanMarkets.push("CI"); // Côte d'Ivoire
        allowedAfricanMarkets.push("SN"); // Senegal
        allowedAfricanMarkets.push("TG"); // Togo
        allowedAfricanMarkets.push("BJ"); // Benin

        // International
        allowedInternational.push("EU"); // European Union
        allowedInternational.push("UK"); // United Kingdom
        allowedInternational.push("UAE"); // United Arab Emirates
        allowedInternational.push("SG"); // Singapore
        allowedInternational.push("US"); // United States
    }

    // =========================================================================
    // CORE FUNCTIONS - JURISDICTION MANAGEMENT
    // =========================================================================

    /**
     * @notice Block a jurisdiction
     * @param code Jurisdiction code (ISO 3166-1 alpha-2)
     * @param name Jurisdiction name
     * @param reason Reason for blocking
     * @param sanctionsList Sanctions list (OFAC, UN, EU, FATF)
     * 
     * Requirements:
     * - Caller must have ADMIN_ROLE
     */
    function blockJurisdiction(
        string calldata code,
        string calldata name,
        string calldata reason,
        string calldata sanctionsList
    ) external onlyRole(ADMIN_ROLE) {
        _blockJurisdiction(code, name, reason, sanctionsList);
    }

    /**
     * @notice Unblock a jurisdiction
     * @param code Jurisdiction code
     * 
     * Requirements:
     * - Caller must have ADMIN_ROLE
     */
    function unblockJurisdiction(string calldata code) external onlyRole(ADMIN_ROLE) {
        Jurisdiction storage jurisdiction = jurisdictions[code];
        if (bytes(jurisdiction.code).length == 0) {
            revert InvalidJurisdictionCode();
        }

        jurisdiction.isBlocked = false;

        // Remove from blocked list
        for (uint256 i = 0; i < blockedJurisdictions.length; i++) {
            if (keccak256(bytes(blockedJurisdictions[i])) == keccak256(bytes(code))) {
                blockedJurisdictions[i] = blockedJurisdictions[blockedJurisdictions.length - 1];
                blockedJurisdictions.pop();
                break;
            }
        }

        emit JurisdictionUnblocked(code);
    }

    /**
     * @notice Mark jurisdiction as requiring enhanced review
     * @param code Jurisdiction code
     * @param requiresReview Whether review is required
     * 
     * Requirements:
     * - Caller must have ADMIN_ROLE
     */
    function setReviewRequired(string calldata code, bool requiresReview) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        reviewRequiredJurisdictions[code] = requiresReview;
    }

    // =========================================================================
    // CORE FUNCTIONS - INVESTOR COMPLIANCE
    // =========================================================================

    /**
     * @notice Register investor jurisdiction and check compliance
     * @param investor Investor address
     * @param jurisdictionCode Jurisdiction code (ISO 3166-1 alpha-2)
     * @return status Compliance status (ALLOWED, BLOCKED, REVIEW_REQUIRED)
     * 
     * Requirements:
     * - Caller must have COMPLIANCE_OFFICER_ROLE or be the investor
     */
    function registerInvestorJurisdiction(address investor, string calldata jurisdictionCode)
        external
        returns (ComplianceStatus)
    {
        if (!hasRole(COMPLIANCE_OFFICER_ROLE, msg.sender) && msg.sender != investor) {
            revert NotComplianceOfficer();
        }

        Jurisdiction storage jurisdiction = jurisdictions[jurisdictionCode];
        if (bytes(jurisdiction.code).length == 0) {
            revert InvalidJurisdictionCode();
        }

        investorJurisdiction[investor] = jurisdictionCode;

        ComplianceStatus status;
        if (jurisdiction.isBlocked) {
            status = ComplianceStatus.BLOCKED;
        } else if (reviewRequiredJurisdictions[jurisdictionCode]) {
            status = ComplianceStatus.REVIEW_REQUIRED;
        } else {
            status = ComplianceStatus.ALLOWED;
            investorApproval[investor] = true;
        }

        emit InvestorJurisdictionRegistered(investor, jurisdictionCode, status);

        return status;
    }

    /**
     * @notice Approve an investor
     * @param investor Investor address
     * 
     * Requirements:
     * - Caller must have COMPLIANCE_OFFICER_ROLE
     * - Investor jurisdiction must not be blocked
     */
    function approveInvestor(address investor) external onlyRole(COMPLIANCE_OFFICER_ROLE) {
        string memory jurisdictionCode = investorJurisdiction[investor];
        if (bytes(jurisdictionCode).length > 0) {
            Jurisdiction storage jurisdiction = jurisdictions[jurisdictionCode];
            if (jurisdiction.isBlocked) {
                revert JurisdictionBlockedError(jurisdictionCode, jurisdiction.reason);
            }
        }

        investorApproval[investor] = true;
        emit InvestorApproved(investor, msg.sender);
    }

    /**
     * @notice Revoke investor approval
     * @param investor Investor address
     * 
     * Requirements:
     * - Caller must have COMPLIANCE_OFFICER_ROLE
     */
    function revokeInvestorApproval(address investor) external onlyRole(COMPLIANCE_OFFICER_ROLE) {
        investorApproval[investor] = false;
        emit InvestorApprovalRevoked(investor, msg.sender);
    }

    // =========================================================================
    // VIEW FUNCTIONS
    // =========================================================================

    /**
     * @notice Check if jurisdiction is blocked
     * @param code Jurisdiction code
     * @return isBlocked Whether jurisdiction is blocked
     */
    function isJurisdictionBlocked(string calldata code) external view returns (bool) {
        Jurisdiction storage jurisdiction = jurisdictions[code];
        return jurisdiction.isBlocked;
    }

    /**
     * @notice Check if jurisdiction is allowed
     * @param code Jurisdiction code
     * @return isAllowed Whether jurisdiction is allowed
     */
    function isJurisdictionAllowed(string calldata code) external view returns (bool) {
        Jurisdiction storage jurisdiction = jurisdictions[code];
        if (jurisdiction.isBlocked) {
            return false;
        }
        return !reviewRequiredJurisdictions[code];
    }

    /**
     * @notice Check investor compliance status
     * @param investor Investor address
     * @return isApproved Whether investor is approved
     * @return jurisdiction Investor's jurisdiction code
     * @return status Compliance status
     */
    function checkInvestorCompliance(address investor)
        external
        view
        returns (bool, string memory, ComplianceStatus)
    {
        string memory jurisdictionCode = investorJurisdiction[investor];
        bool approved = investorApproval[investor];
        
        ComplianceStatus status;
        if (bytes(jurisdictionCode).length > 0) {
            Jurisdiction storage jurisdiction = jurisdictions[jurisdictionCode];
            if (jurisdiction.isBlocked) {
                status = ComplianceStatus.BLOCKED;
            } else if (reviewRequiredJurisdictions[jurisdictionCode]) {
                status = ComplianceStatus.REVIEW_REQUIRED;
            } else {
                status = ComplianceStatus.ALLOWED;
            }
        } else {
            status = ComplianceStatus.REVIEW_REQUIRED;
        }

        return (approved, jurisdictionCode, status);
    }

    /**
     * @notice Get jurisdiction details
     * @param code Jurisdiction code
     * @return Jurisdiction details
     */
    function getJurisdiction(string calldata code) external view returns (Jurisdiction memory) {
        return jurisdictions[code];
    }

    /**
     * @notice Get all blocked jurisdiction codes
     * @return Array of blocked jurisdiction codes
     */
    function getBlockedJurisdictions() external view returns (string[] memory) {
        return blockedJurisdictions;
    }

    /**
     * @notice Get all allowed African markets
     * @return Array of allowed African market codes
     */
    function getAllowedAfricanMarkets() external view returns (string[] memory) {
        return allowedAfricanMarkets;
    }

    /**
     * @notice Get all allowed international jurisdictions
     * @return Array of allowed international codes
     */
    function getAllowedInternational() external view returns (string[] memory) {
        return allowedInternational;
    }

    /**
     * @notice Get count of blocked jurisdictions
     * @return Number of blocked jurisdictions
     */
    function getBlockedJurisdictionsCount() external view returns (uint256) {
        return blockedJurisdictions.length;
    }

    // =========================================================================
    // INTERNAL FUNCTIONS
    // =========================================================================

    /**
     * @notice Internal function to block a jurisdiction
     */
    function _blockJurisdiction(
        string memory code,
        string memory name,
        string memory reason,
        string memory sanctionsList
    ) internal {
        jurisdictions[code] = Jurisdiction({
            code: code,
            name: name,
            isBlocked: true,
            reason: reason,
            sanctionsList: sanctionsList
        });
        blockedJurisdictions.push(code);

        emit JurisdictionBlocked(code, name, reason);
    }

    // =========================================================================
    // MVP-2 TESTNET UTILITIES
    // =========================================================================

    /**
     * @notice Get all jurisdiction codes (TESTNET DEBUG)
     * @return Array of all jurisdiction codes
     */
    function getAllJurisdictionCodes() external view returns (string[] memory) {
        require(IS_MVP_TESTNET, "Only on testnet");
        
        string[] memory allCodes = new string[](blockedJurisdictions.length + 
                                                allowedAfricanMarkets.length + 
                                                allowedInternational.length);
        
        uint256 index = 0;
        for (uint256 i = 0; i < blockedJurisdictions.length; i++) {
            allCodes[index] = blockedJurisdictions[i];
            index++;
        }
        for (uint256 i = 0; i < allowedAfricanMarkets.length; i++) {
            allCodes[index] = allowedAfricanMarkets[i];
            index++;
        }
        for (uint256 i = 0; i < allowedInternational.length; i++) {
            allCodes[index] = allowedInternational[i];
            index++;
        }
        
        return allCodes;
    }

    /**
     * @notice Test compliance check (TESTNET ONLY)
     * @param jurisdictionCode Jurisdiction code to test
     * @return isBlocked Whether blocked
     * @return isAllowed Whether allowed
     */
    function testCompliance(string calldata jurisdictionCode) 
        external 
        view 
        returns (bool, bool) 
    {
        require(IS_MVP_TESTNET, "Only on testnet");
        return (!isJurisdictionAllowed(jurisdictionCode), isJurisdictionAllowed(jurisdictionCode));
    }
}
