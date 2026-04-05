// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ujamaa DeFi Platform
// Author: Aziz Da Silva - Lead Architect

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GuaranteeTokenizer (UGT - Ujamaa Guarantee Token Token)
 * @notice ERC-3643NFT (ERC-721 + ERC-3643 compliance) representing certified merchandise/collateral
 * @dev Represents certified stock/merchandise backing a financing operation
 *
 * UGT Lifecycle (SRS v2.0 Section 1.2):
 * 1. Industrial receives order (e.g., ZARA €2M contract)
 * 2. Industrial Gateway certifies stock (SIPI/GDIZ verification)
 * 3. UGT minted (ERC-3643NFT with metadata + compliance)
 * 4. Pool deploys funds to Industrial
 * 5. Pool holds UGT (collateral/security)
 * 6. Industrial repays (principal + interest)
 * 7. UGT transferred back to Industrial (via forcedTransfer)
 * 8. [DEFAULT] If industrial defaults: UGT liquidated via auction
 *

 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */
contract GuaranteeTokenizer is ERC721, AccessControl, ReentrancyGuard {
    // =========================================================================
    // CONSTANTS
    // =========================================================================

    /**
     * @notice Role for minters (Industrial Gateway)
     */
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /**
     * @notice Role for pool managers (can redeem/liquidate)
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
     * @notice Guarantee (collateral) data structure
     * @param certificateId Industrial Gateway certificate ID
     * @param merchandiseValue Value of merchandise in UJEUR (18 decimals)
     * @param expiryDate When invoice/contract is due
     * @param industrial Industrial company address (original issuer)
     * @param poolAddress Liquidity Pool address holding the collateral
     * @param isRedeemed Whether financing was repaid
     * @param isDefaulted Whether industrial defaulted
     * @param stockHash IPFS hash of stock documents
     * @param description Stock description (e.g., "1000 cotton bales, Grade A")
     * @param warehouseLocation Warehouse location (e.g., "GDIZ Warehouse A, Lomé")
     */
    struct Guarantee {
        uint256 certificateId;
        uint256 merchandiseValue;
        uint256 expiryDate;
        address industrial;
        address poolAddress;
        bool isRedeemed;
        bool isDefaulted;
        bytes32 stockHash;
        string description;
        string warehouseLocation;
    }

    // =========================================================================
    // STATE VARIABLES
    // =========================================================================

    /**
     * @notice All guarantees by token ID
     */
    mapping(uint256 => Guarantee) private s_guarantees;

    /**
     * @notice Next token ID to mint
     */
    uint256 private s_nextTokenId;

    /**
     * @notice Token ID to certificate ID mapping
     */
    mapping(uint256 => uint256) public tokenIdToCertificateId;

    /**
     * @notice Certificate ID to token ID mapping
     */
    mapping(uint256 => uint256) public certificateIdToTokenId;

    // =========================================================================
    // EVENTS
    // =========================================================================

    /**
     * @notice Emitted when a new guarantee is minted
     * @param tokenId Guarantee token ID
     * @param certificateId Industrial Gateway certificate ID
     * @param industrial Industrial company address
     * @param poolAddress Pool address holding collateral
     * @param value Merchandise value in UJEUR
     */
    event GuaranteeMinted(
        uint256 indexed tokenId,
        uint256 indexed certificateId,
        address indexed industrial,
        address poolAddress,
        uint256 value
    );

    /**
     * @notice Emitted when guarantee is redeemed (financing repaid)
     * @param tokenId Guarantee token ID
     * @param industrial Industrial address receiving back collateral
     */
    event GuaranteeRedeemed(uint256 indexed tokenId, address indexed industrial);

    /**
     * @notice Emitted when guarantee is liquidated (default scenario)
     * @param tokenId Guarantee token ID
     * @param auctionWinner Address that won the auction
     * @param liquidationAmount Amount received from liquidation
     */
    event GuaranteeLiquidated(
        uint256 indexed tokenId,
        address indexed auctionWinner,
        uint256 liquidationAmount
    );

    // =========================================================================
    // ERRORS
    // =========================================================================

    error ZeroValue();
    error InvalidIndustrial();
    error InvalidPool();
    error TokenNotFound();
    error NotRedeemable();
    error NotLiquidatable();
    error AlreadyRedeemed();
    error AlreadyDefaulted();

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    /**
     * @notice Initialize GuaranteeToken contract
     */
    constructor() ERC721("Ujamaa Guarantee Token Token", "UGT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender); // Industrial Gateway
        _grantRole(POOL_MANAGER_ROLE, msg.sender); // Pool manager
    }

    // =========================================================================
    // CORE FUNCTIONS - MINTING
    // =========================================================================

    /**
     * @notice Mint a new guarantee token (collateral NFT)
     * @param industrial Industrial company address
     * @param certificateId Industrial Gateway certificate ID
     * @param value Merchandise value in UJEUR (18 decimals)
     * @param expiryDate Expiry timestamp
     * @param stockHash IPFS hash of stock documents
     * @param description Stock description
     * @param warehouseLocation Warehouse location
     * @return tokenId New token ID
     * 
     * Requirements:
     * - Caller must have MINTER_ROLE (Industrial Gateway)
     * - Value must be > 0
     * - Industrial must not be zero address
     */
    function mintGuarantee(
        address industrial,
        uint256 certificateId,
        uint256 value,
        uint256 expiryDate,
        bytes32 stockHash,
        string calldata description,
        string calldata warehouseLocation
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        if (value == 0) revert ZeroValue();
        if (industrial == address(0)) revert InvalidIndustrial();

        // Check if certificate already exists
        if (certificateIdToTokenId[certificateId] != 0) {
            return certificateIdToTokenId[certificateId];
        }

        // Mint new token
        uint256 tokenId = s_nextTokenId++;
        _safeMint(industrial, tokenId);

        // Store guarantee data
        s_guarantees[tokenId] = Guarantee({
            certificateId: certificateId,
            merchandiseValue: value,
            expiryDate: expiryDate,
            industrial: industrial,
            poolAddress: address(0), // Will be set when pool deploys funds
            isRedeemed: false,
            isDefaulted: false,
            stockHash: stockHash,
            description: description,
            warehouseLocation: warehouseLocation
        });

        // Update mappings
        tokenIdToCertificateId[tokenId] = certificateId;
        certificateIdToTokenId[certificateId] = tokenId;

        emit GuaranteeMinted(tokenId, certificateId, industrial, address(0), value);

        return tokenId;
    }

    // =========================================================================
    // CORE FUNCTIONS - REDEMPTION & LIQUIDATION
    // =========================================================================

    /**
     * @notice Redeem guarantee (transfer back to industrial after repayment)
     * @param tokenId Guarantee token ID
     * 
     * Requirements:
     * - Caller must have POOL_MANAGER_ROLE
     * - Token must exist
     * - Token must not be already redeemed
     */
    function redeemGuarantee(uint256 tokenId) external onlyRole(POOL_MANAGER_ROLE) {
        if (_ownerOf(tokenId) == address(0)) revert TokenNotFound();
        
        Guarantee storage guarantee = s_guarantees[tokenId];
        if (guarantee.isRedeemed) revert AlreadyRedeemed();

        // Mark as redeemed
        guarantee.isRedeemed = true;

        // Transfer back to industrial
        _safeTransfer(msg.sender, guarantee.industrial, tokenId);

        emit GuaranteeRedeemed(tokenId, guarantee.industrial);
    }

    /**
     * @notice Liquidate guarantee (default scenario - auction)
     * @param tokenId Guarantee token ID
     * @param auctionWinner Auction winner address
     * @param liquidationAmount Amount received from liquidation
     * 
     * Requirements:
     * - Caller must have POOL_MANAGER_ROLE
     * - Token must exist
     * - Token must be marked as defaulted
     */
    function liquidateGuarantee(
        uint256 tokenId,
        address auctionWinner,
        uint256 liquidationAmount
    ) external onlyRole(POOL_MANAGER_ROLE) {
        if (_ownerOf(tokenId) == address(0)) revert TokenNotFound();
        
        Guarantee storage guarantee = s_guarantees[tokenId];
        if (!guarantee.isDefaulted) revert NotLiquidatable();

        // Transfer to auction winner
        _safeTransfer(msg.sender, auctionWinner, tokenId);

        emit GuaranteeLiquidated(tokenId, auctionWinner, liquidationAmount);
    }

    /**
     * @notice Mark guarantee as defaulted
     * @param tokenId Guarantee token ID
     */
    function markAsDefaulted(uint256 tokenId) external onlyRole(POOL_MANAGER_ROLE) {
        if (_ownerOf(tokenId) == address(0)) revert TokenNotFound();
        s_guarantees[tokenId].isDefaulted = true;
    }

    /**
     * @notice Assign guarantee to pool (when funds are deployed)
     * @param tokenId Guarantee token ID
     * @param poolAddress Pool address
     */
    function assignToPool(uint256 tokenId, address poolAddress) external {
        if (_ownerOf(tokenId) == address(0)) revert TokenNotFound();
        if (poolAddress == address(0)) revert InvalidPool();
        
        Guarantee storage guarantee = s_guarantees[tokenId];
        guarantee.poolAddress = poolAddress;
    }

    // =========================================================================
    // VIEW FUNCTIONS
    // =========================================================================

    /**
     * @notice Get guarantee details
     * @param tokenId Token ID
     * @return Guarantee struct
     */
    function getGuarantee(uint256 tokenId) external view returns (Guarantee memory) {
        if (_ownerOf(tokenId) == address(0)) revert TokenNotFound();
        return s_guarantees[tokenId];
    }

    /**
     * @notice Get guarantee by certificate ID
     * @param certificateId Certificate ID
     * @return tokenId Token ID (0 if not found)
     */
    function getTokenIdByCertificateId(uint256 certificateId) external view returns (uint256) {
        return certificateIdToTokenId[certificateId];
    }

    /**
     * @notice Get certificate ID by token ID
     * @param tokenId Token ID
     * @return certificateId Certificate ID
     */
    function getCertificateIdByTokenId(uint256 tokenId) external view returns (uint256) {
        if (_ownerOf(tokenId) == address(0)) revert TokenNotFound();
        return tokenIdToCertificateId[tokenId];
    }

    /**
     * @notice Get total guarantees minted
     * @return Total count
     */
    function getTotalGuarantees() external view returns (uint256) {
        return s_nextTokenId;
    }

    /**
     * @notice Get total supply of NFTs (ERC721 compatibility)
     * @return Total count of minted tokens
     */
    function totalSupply() external view returns (uint256) {
        return s_nextTokenId;
    }

    /**
     * @notice Check if guarantee is active (not redeemed, not defaulted)
     * @param tokenId Token ID
     * @return isActive Whether guarantee is active
     */
    function isGuaranteeActive(uint256 tokenId) external view returns (bool) {
        if (_ownerOf(tokenId) == address(0)) return false;
        Guarantee memory guarantee = s_guarantees[tokenId];
        return !guarantee.isRedeemed && !guarantee.isDefaulted;
    }

    // =========================================================================
    // ERC-3643 COMPLIANCE (Simplified for MVP)
    // =========================================================================

    /**
     * @notice Check if address is verified (MVP simplified)
     * @param addr Address to check
     * @return isVerified Always true for testnet
     */
    function isVerified(address addr) external pure returns (bool) {
        return IS_MVP_TESTNET; // Always verified on testnet
    }

    /**
     * @notice Override transfer to enforce compliance (MVP simplified)
     * @dev Only Pool and Industrial Gateway can transfer
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting
        if (from == address(0)) {
            return super._update(to, tokenId, auth);
        }

        // Allow transfers to/from Pool or Industrial Gateway (simplified for MVP)
        Guarantee memory guarantee = s_guarantees[tokenId];
        if (
            to == guarantee.poolAddress ||
            to == guarantee.industrial ||
            hasRole(POOL_MANAGER_ROLE, to)
        ) {
            return super._update(to, tokenId, auth);
        }

        // Revert for unauthorized transfers
        revert("UGT: Transfer not allowed - compliance restriction");
    }

    // =========================================================================
    // ERC165 INTERFACE
    // =========================================================================

    /**
     * @notice Check if interface is supported
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // =========================================================================
    // MVP TESTNET UTILITIES
    // =========================================================================

    /**
     * @notice Mint test guarantee for demo (TESTNET ONLY)
     */
    function mintTestGuarantee(
        address industrial,
        uint256 value,
        string calldata description
    ) external returns (uint256) {
        require(IS_MVP_TESTNET, "Only on testnet");
        require(hasRole(MINTER_ROLE, msg.sender), "Minter role required");
        
        return this.mintGuarantee(
            industrial,
            s_nextTokenId, // Use next ID as certificate ID
            value,
            block.timestamp + (365 days), // 1 year expiry
            keccak256(abi.encodePacked("test-stock-", s_nextTokenId)),
            description,
            "MVP Test Warehouse"
        );
    }
}
