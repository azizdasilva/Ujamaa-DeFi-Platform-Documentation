// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ujamaa DeFi Platform
// Author: Aziz Da Silva - Lead Architect

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./GuaranteeToken.sol";

/**
 * @title IndustrialGateway
 * @notice Certifies industrial assets/stock and mints Guarantee Tokens (UGT)
 * @dev Formerly known as AssetProof (SRS v2.0 Section 1.3)
 *
 * Industrial Gateway Functions (SRS v2.0 Section 5.3):
 * - Certify stock/merchandise existence
 * - Verify production data
 * - Mint Guarantee Tokens (UGT) as collateral
 * - Track certificate lifecycle
 *


 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */
contract IndustrialGateway is AccessControl, ReentrancyGuard {
    // =========================================================================
    // CONSTANTS
    // =========================================================================

    /**
     * @notice Role for certifiers (GDIZ/SIPI verifiers)
     */
    bytes32 public constant CERTIFIER_ROLE = keccak256("CERTIFIER_ROLE");

    /**
     * @notice Role for pool managers
     */
    bytes32 public constant POOL_MANAGER_ROLE = keccak256("POOL_MANAGER_ROLE");

    /**
     * @notice MVP Testnet flag
     */
    bool public constant IS_MVP_TESTNET = true;

    // =========================================================================
    // STRUCTS
    // =========================================================================

    /**
     * @notice Certificate data structure
     * @param certificateId Unique certificate ID
     * @param industrial Industrial company address
     * @param assetType Type of asset (INVOICE, INVENTORY, PRODUCTION, etc.)
     * @param value Value in UJEUR (18 decimals)
     * @param quantity Quantity of items
     * @param unit Unit of measure (e.g., "bales", "tons", "units")
     * @param warehouseLocation Warehouse location
     * @param certificationDate Certification timestamp
     * @param expiryDate Expiry timestamp
     * @param stockHash IPFS hash of stock documents
     * @param description Asset description
     * @param isVerified Whether certificate is verified
     * @param isRevoked Whether certificate is revoked
     * @param guaranteeTokenId Associated UGT token ID (0 if not minted)
     */
    struct Certificate {
        uint256 certificateId;
        address industrial;
        string assetType;
        uint256 value;
        uint256 quantity;
        string unit;
        string warehouseLocation;
        uint256 certificationDate;
        uint256 expiryDate;
        bytes32 stockHash;
        string description;
        bool isVerified;
        bool isRevoked;
        uint256 guaranteeTokenId;
    }

    // =========================================================================
    // STATE VARIABLES
    // =========================================================================

    /**
     * @notice Guarantee Token contract
     */
    GuaranteeToken public guaranteeToken;

    /**
     * @notice All certificates by ID
     */
    mapping(uint256 => Certificate) public certificates;

    /**
     * @notice Next certificate ID
     */
    uint256 public nextCertificateId;

    /**
     * @notice Certificates by industrial address
     */
    mapping(address => uint256[]) public industrialCertificates;

    // =========================================================================
    // EVENTS
    // =========================================================================

    /**
     * @notice Emitted when a new certificate is created
     */
    event CertificateCreated(
        uint256 indexed certificateId,
        address indexed industrial,
        string assetType,
        uint256 value
    );

    /**
     * @notice Emitted when certificate is verified
     */
    event CertificateVerified(uint256 indexed certificateId, address verifier);

    /**
     * @notice Emitted when guarantee token is minted
     */
    event GuaranteeTokenMinted(
        uint256 indexed certificateId,
        uint256 indexed tokenId
    );

    /**
     * @notice Emitted when certificate is revoked
     */
    event CertificateRevoked(uint256 indexed certificateId, string reason);

    // =========================================================================
    // ERRORS
    // =========================================================================

    error ZeroValue();
    error InvalidIndustrial();
    error CertificateNotFound();
    error AlreadyVerified();
    error AlreadyRevoked();
    error NotVerified();
    error GuaranteeTokenNotSet();

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    /**
     * @notice Initialize IndustrialGateway
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CERTIFIER_ROLE, msg.sender); // GDIZ/SIPI
        _grantRole(POOL_MANAGER_ROLE, msg.sender);
    }

    /**
     * @notice Set Guarantee Token contract address
     * @param _guaranteeToken Guarantee Token contract
     */
    function setGuaranteeToken(address _guaranteeToken) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_guaranteeToken == address(0)) revert InvalidIndustrial();
        guaranteeToken = GuaranteeToken(_guaranteeToken);
    }

    // =========================================================================
    // CORE FUNCTIONS - CERTIFICATION
    // =========================================================================

    /**
     * @notice Create and verify a new certificate
     * @param industrial Industrial company address
     * @param assetType Asset type (INVOICE, INVENTORY, PRODUCTION, SHIPMENT, CONTRACT)
     * @param value Value in UJEUR (18 decimals)
     * @param quantity Quantity
     * @param unit Unit of measure
     * @param warehouseLocation Warehouse location
     * @param stockHash IPFS hash of stock documents
     * @param description Asset description
     * @param validityDays Certificate validity in days
     * @return certificateId New certificate ID
     * 
     * Requirements:
     * - Caller must have CERTIFIER_ROLE (GDIZ/SIPI)
     * - Value must be > 0
     * - Industrial must not be zero address
     */
    function certifyAsset(
        address industrial,
        string calldata assetType,
        uint256 value,
        uint256 quantity,
        string calldata unit,
        string calldata warehouseLocation,
        bytes32 stockHash,
        string calldata description,
        uint256 validityDays
    ) external onlyRole(CERTIFIER_ROLE) nonReentrant returns (uint256) {
        if (value == 0) revert ZeroValue();
        if (industrial == address(0)) revert InvalidIndustrial();

        uint256 certificateId = nextCertificateId++;

        certificates[certificateId] = Certificate({
            certificateId: certificateId,
            industrial: industrial,
            assetType: assetType,
            value: value,
            quantity: quantity,
            unit: unit,
            warehouseLocation: warehouseLocation,
            certificationDate: block.timestamp,
            expiryDate: block.timestamp + (validityDays * 1 days),
            stockHash: stockHash,
            description: description,
            isVerified: true, // Auto-verified by certifier
            isRevoked: false,
            guaranteeTokenId: 0 // Will be set when UGT is minted
        });

        // Add to industrial's certificates
        industrialCertificates[industrial].push(certificateId);

        emit CertificateCreated(certificateId, industrial, assetType, value);
        emit CertificateVerified(certificateId, msg.sender);

        return certificateId;
    }

    // =========================================================================
    // CORE FUNCTIONS - GUARANTEE TOKEN MINTING
    // =========================================================================

    /**
     * @notice Mint Guarantee Token (UGT) for verified certificate
     * @param certificateId Certificate ID
     * @return tokenId Guarantee Token ID
     * 
     * Requirements:
     * - Certificate must exist
     * - Certificate must be verified
     * - Certificate must not be revoked
     * - Guarantee Token must not already be minted
     */
    function mintGuaranteeToken(uint256 certificateId) external nonReentrant returns (uint256) {
        Certificate storage cert = certificates[certificateId];
        if (cert.certificateId == 0) revert CertificateNotFound();
        if (!cert.isVerified) revert NotVerified();
        if (cert.isRevoked) revert AlreadyRevoked();
        if (cert.guaranteeTokenId != 0) revert AlreadyVerified(); // Already minted
        if (address(guaranteeToken) == address(0)) revert GuaranteeTokenNotSet();

        // Mint Guarantee Token
        uint256 tokenId = guaranteeToken.mintGuarantee(
            cert.industrial,
            certificateId,
            cert.value,
            cert.expiryDate,
            cert.stockHash,
            cert.description,
            cert.warehouseLocation
        );

        // Update certificate
        cert.guaranteeTokenId = tokenId;

        // Assign guarantee to pool
        guaranteeToken.assignToPool(tokenId, msg.sender);

        emit GuaranteeTokenMinted(certificateId, tokenId);

        return tokenId;
    }

    // =========================================================================
    // VIEW FUNCTIONS
    // =========================================================================

    /**
     * @notice Get certificate details
     * @param certificateId Certificate ID
     * @return Certificate struct
     */
    function getCertificate(uint256 certificateId) external view returns (Certificate memory) {
        if (certificates[certificateId].certificateId == 0) revert CertificateNotFound();
        return certificates[certificateId];
    }

    /**
     * @notice Get certificates for an industrial
     * @param industrial Industrial address
     * @return Array of certificate IDs
     */
    function getCertificatesForIndustrial(address industrial) external view returns (uint256[] memory) {
        return industrialCertificates[industrial];
    }

    /**
     * @notice Get certificate count for an industrial
     * @param industrial Industrial address
     * @return Count
     */
    function getCertificateCount(address industrial) external view returns (uint256) {
        return industrialCertificates[industrial].length;
    }

    /**
     * @notice Get total certificates
     * @return Total count
     */
    function getTotalCertificates() external view returns (uint256) {
        return nextCertificateId;
    }

    /**
     * @notice Check if certificate is active (verified, not revoked, not expired)
     * @param certificateId Certificate ID
     * @return isActive Whether certificate is active
     */
    function isCertificateActive(uint256 certificateId) external view returns (bool) {
        Certificate memory cert = certificates[certificateId];
        if (cert.certificateId == 0) return false;
        if (!cert.isVerified) return false;
        if (cert.isRevoked) return false;
        if (block.timestamp > cert.expiryDate) return false;
        return true;
    }

    // =========================================================================
    // ADMIN FUNCTIONS
    // =========================================================================

    /**
     * @notice Revoke a certificate
     * @param certificateId Certificate ID
     * @param reason Revocation reason
     */
    function revokeCertificate(uint256 certificateId, string calldata reason) external onlyRole(CERTIFIER_ROLE) {
        Certificate storage cert = certificates[certificateId];
        if (cert.certificateId == 0) revert CertificateNotFound();
        if (cert.isRevoked) revert AlreadyRevoked();

        cert.isRevoked = true;

        emit CertificateRevoked(certificateId, reason);
    }

    // =========================================================================
    // MVP TESTNET UTILITIES
    // =========================================================================

    /**
     * @notice Create test certificate for demo (TESTNET ONLY)
     */
    function createTestCertificate(
        address industrial,
        string calldata assetType,
        uint256 value,
        string calldata description
    ) external returns (uint256) {
        require(IS_MVP_TESTNET, "Only on testnet");
        
        return this.certifyAsset(
            industrial,
            assetType,
            value,
            1000, // quantity
            "units", // unit
            "MVP Test Warehouse",
            keccak256(abi.encodePacked("test-", block.timestamp)),
            description,
            365 // validity days
        );
    }
}
