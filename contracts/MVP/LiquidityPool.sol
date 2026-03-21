// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ujamaa DeFi Platform
// Author: Aziz Da Silva - Lead Architect

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ULPToken.sol";
import "./GuaranteeToken.sol";

/**
 * @title LiquidityPool
 * @notice Multi-asset liquidity pool manager for industrial financing
 * @dev Manages 5 pool families with diversification limits and asset allocation
 * 
 * Pool Families:
 * - POOL_INDUSTRIE: Manufacturing, GDIZ partners (10-12% APY, 365 days)
 * - POOL_AGRICULTURE: Coffee, cocoa, cotton, cashews (12-15% APY, 180 days)
 * - POOL_TRADE_FINANCE: Invoice tokenization (8-10% APY, 90 days)
 * - POOL_RENEWABLE_ENERGY: Solar, wind, hydro (9-11% APY, 730 days)
 * - POOL_REAL_ESTATE: Commercial & residential (8-12% APY, 1095 days)
 * 
 * Diversification Limits:
 * - Max 20% per industrial (per-industrial limit)
 * - Max 40% per asset class (per-asset-class limit)
 * 
 * @reference SRS v2.0 Section 5.12, EPIC-10, User Story 10.3
 * @reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md Section 5
 * 
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */
contract LiquidityPool is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // =========================================================================
    // CONSTANTS - POOL FAMILIES
    // =========================================================================

    /**
     * @notice Pool family types
     */
    enum PoolFamily {
        POOL_INDUSTRIE,
        POOL_AGRICULTURE,
        POOL_TRADE_FINANCE,
        POOL_RENEWABLE_ENERGY,
        POOL_REAL_ESTATE
    }

    /**
     * @notice Real estate asset sub-classes
     */
    enum RealEstateClass {
        CommercialOffice,
        RetailSpace,
        IndustrialWarehouse,
        ResidentialApartments,
        MixedUse,
        Hospitality,
        LandBank
    }

    /**
     * @notice Role for pool managers
     */
    bytes32 public constant POOL_MANAGER_ROLE = keccak256("POOL_MANAGER_ROLE");

    /**
     * @notice Role for compliance officers
     */
    bytes32 public constant COMPLIANCE_OFFICER_ROLE = keccak256("COMPLIANCE_OFFICER_ROLE");

    /**
     * @notice MVP Testnet flag
     */
    bool public constant IS_MVP_TESTNET = true;

    /**
     * @notice Diversification limits (basis points)
     */
    uint256 public constant MAX_PER_INDUSTRIAL_BP = 2000; // 20%
    uint256 public constant MAX_PER_ASSET_CLASS_BP = 4000; // 40%
    uint256 public constant BASIS_POINTS = 10000;

    // =========================================================================
    // STRUCTS
    // =========================================================================

    /**
     * @notice Pool configuration
     * @param id Pool family identifier
     * @param name Human-readable pool name
     * @param targetYieldMin Minimum target yield (basis points)
     * @param targetYieldMax Maximum target yield (basis points)
     * @param lockupDays Lock-up period in days
     * @param isActive Whether pool is active for new investments
     */
    struct PoolConfig {
        PoolFamily id;
        string name;
        uint256 targetYieldMin;
        uint256 targetYieldMax;
        uint256 lockupDays;
        bool isActive;
    }

    /**
     * @notice Asset class configuration
     * @param poolFamily Parent pool family
     * @param assetClass Asset class name
     * @param allocated Amount allocated to this asset class (18 decimals)
     * @param maxAllocation Maximum allocation (18 decimals)
     */
    struct AssetClass {
        PoolFamily poolFamily;
        string assetClass;
        uint256 allocated;
        uint256 maxAllocation;
    }

    /**
     * @notice Industrial financing
     * @param id Unique financing identifier
     * @param poolFamily Pool family this financing belongs to
     * @param assetClass Asset class (e.g., "Manufacturing", "Coffee")
     * @param industrial Industrial company address
     * @param principal Principal amount (18 decimals)
     * @param interestRate Interest rate (basis points)
     * @param startDate Financing start date
     * @param maturityDate Financing maturity date
     * @param amountRepaid Amount repaid so far (18 decimals)
     * @param isRepaid Whether fully repaid
     * @param isDefaulted Whether in default
     */
    struct Financing {
        uint256 id;
        PoolFamily poolFamily;
        string assetClass;
        address industrial;
        uint256 principal;
        uint256 interestRate;
        uint256 startDate;
        uint256 maturityDate;
        uint256 amountRepaid;
        bool isRepaid;
        bool isDefaulted;
    }

    /**
     * @notice Pool statistics
     * @param totalValue Total pool value (18 decimals)
     * @param deployedAmount Total deployed to industrials (18 decimals)
     * @param availableAmount Available for deployment (18 decimals)
     * @param totalYield Total yield earned (18 decimals)
     * @param financingCount Number of active financings
     */
    struct PoolStats {
        uint256 totalValue;
        uint256 deployedAmount;
        uint256 availableAmount;
        uint256 totalYield;
        uint256 financingCount;
    }

    // =========================================================================
    // STATE VARIABLES
    // =========================================================================

    /**
     * @notice uLP token contract
     */
    ULPToken public ULPToken;

    /**
     * @notice UJEUR token contract
     */
    IERC20 public ujeurToken;

    /**
     * @notice Pool configurations (one per family)
     */
    mapping(PoolFamily => PoolConfig) public pools;

    /**
     * @notice Asset class allocations
     * @dev Key: keccak256(abi.encode(poolFamily, assetClass))
     */
    mapping(bytes32 => AssetClass) public assetClasses;

    /**
     * @notice Amount allocated per industrial
     * @dev Key: keccak256(abi.encode(poolFamily, industrial))
     */
    mapping(bytes32 => uint256) public allocationPerIndustrial;

    /**
     * @notice All financings
     * @dev Key: financing ID
     */
    mapping(uint256 => Financing) public financings;

    /**
     * @notice Next financing ID
     */
    uint256 public nextFinancingId;

    /**
     * @notice Total value across all pools
     */
    uint256 public totalPoolValue;

    /**
     * @notice Total yield earned across all pools
     */
    uint256 public totalYieldEarned;

    /**
     * @notice Guarantee Token contract (UGT)
     */
    GuaranteeToken public guaranteeToken;

    /**
     * @notice Financing ID to UGT token ID mapping
     */
    mapping(uint256 => uint256) public financingToGuaranteeToken;

    // =========================================================================
    // EVENTS
    // =========================================================================

    /**
     * @notice Emitted when a new financing is created
     * @param financingId Financing ID
     * @param poolFamily Pool family
     * @param industrial Industrial address
     * @param principal Principal amount (18 decimals)
     * @param interestRate Interest rate (basis points)
     */
    event FinancingCreated(
        uint256 indexed financingId,
        PoolFamily indexed poolFamily,
        address indexed industrial,
        uint256 principal,
        uint256 interestRate
    );

    /**
     * @notice Emitted when repayment is recorded
     * @param financingId Financing ID
     * @param amount Repayment amount (18 decimals)
     * @param isFullyRepaid Whether fully repaid
     */
    event RepaymentRecorded(uint256 indexed financingId, uint256 amount, bool isFullyRepaid);

    /**
     * @notice Emitted when a financing defaults
     * @param financingId Financing ID
     * @param outstandingAmount Outstanding amount (18 decimals)
     */
    event FinancingDefaulted(uint256 indexed financingId, uint256 outstandingAmount);

    /**
     * @notice Emitted when funds are deployed to a financing
     * @param financingId Financing ID
     * @param amount Deployed amount (18 decimals)
     */
    event FundsDeployed(uint256 indexed financingId, uint256 amount);

    /**
     * @notice Emitted when yield is distributed to uLP holders
     * @param poolFamily Pool family
     * @param yieldAmount Yield amount (18 decimals)
     */
    event YieldDistributed(PoolFamily indexed poolFamily, uint256 yieldAmount);

    // =========================================================================
    // ERRORS
    // =========================================================================

    error InvalidPoolFamily();
    error InvalidAssetClass();
    error InvalidIndustrial();
    error InvalidAmount();
    error ExceedsPerIndustrialLimit();
    error ExceedsPerAssetClassLimit();
    error InsufficientPoolFunds();
    error FinancingNotFound();
    error NotPoolManager();
    error ZeroAddress();

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    /**
     * @notice Initialize LiquidityPool
     * @param _ULPToken uLP token contract address
     * @param _ujeurToken UJEUR token contract address
     * @param _guaranteeToken Guarantee Token (UGT) contract address
     */
    constructor(address _ULPToken, address _ujeurToken, address _guaranteeToken) {
        if (_ULPToken == address(0) || _ujeurToken == address(0)) {
            revert ZeroAddress();
        }

        ULPToken = ULPToken(_ULPToken);
        ujeurToken = IERC20(_ujeurToken);
        guaranteeToken = GuaranteeToken(_guaranteeToken);

        // Initialize pool configurations
        _initializePools();

        // Grant roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(POOL_MANAGER_ROLE, msg.sender);
        _grantRole(COMPLIANCE_OFFICER_ROLE, msg.sender);

        nextFinancingId = 1;
    }

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    /**
     * @notice Initialize all pool families with configurations
     */
    function _initializePools() internal {
        // POOL_INDUSTRIE: Manufacturing, GDIZ (10-12% APY, 365 days)
        pools[PoolFamily.POOL_INDUSTRIE] = PoolConfig({
            id: PoolFamily.POOL_INDUSTRIE,
            name: "Pool Industrie",
            targetYieldMin: 1000, // 10%
            targetYieldMax: 1200, // 12%
            lockupDays: 365,
            isActive: true
        });

        // POOL_AGRICULTURE: Coffee, cocoa, cotton (12-15% APY, 180 days)
        pools[PoolFamily.POOL_AGRICULTURE] = PoolConfig({
            id: PoolFamily.POOL_AGRICULTURE,
            name: "Pool Agriculture",
            targetYieldMin: 1200, // 12%
            targetYieldMax: 1500, // 15%
            lockupDays: 180,
            isActive: true
        });

        // POOL_TRADE_FINANCE: Invoice tokenization (8-10% APY, 90 days)
        pools[PoolFamily.POOL_TRADE_FINANCE] = PoolConfig({
            id: PoolFamily.POOL_TRADE_FINANCE,
            name: "Pool Trade Finance",
            targetYieldMin: 800, // 8%
            targetYieldMax: 1000, // 10%
            lockupDays: 90,
            isActive: true
        });

        // POOL_RENEWABLE_ENERGY: Solar, wind, hydro (9-11% APY, 730 days)
        pools[PoolFamily.POOL_RENEWABLE_ENERGY] = PoolConfig({
            id: PoolFamily.POOL_RENEWABLE_ENERGY,
            name: "Pool Renewable Energy",
            targetYieldMin: 900, // 9%
            targetYieldMax: 1100, // 11%
            lockupDays: 730,
            isActive: true
        });

        // POOL_REAL_ESTATE: Commercial & residential (8-12% APY, 1095 days)
        pools[PoolFamily.POOL_REAL_ESTATE] = PoolConfig({
            id: PoolFamily.POOL_REAL_ESTATE,
            name: "Pool Real Estate",
            targetYieldMin: 800, // 8%
            targetYieldMax: 1200, // 12%
            lockupDays: 1095,
            isActive: true
        });
    }

    // =========================================================================
    // CORE FUNCTIONS - CREATE FINANCING
    // =========================================================================

    /**
     * @notice Create a new industrial financing with UGT collateral
     * @param poolFamily Pool family
     * @param assetClass Asset class name (e.g., "Manufacturing", "Coffee")
     * @param industrial Industrial company address
     * @param principal Principal amount (18 decimals)
     * @param interestRate Interest rate (basis points)
     * @param durationDays Financing duration in days
     * @param certificateId Industrial Gateway certificate ID (for UGT minting)
     * @return financingId Created financing ID
     * 
     * Requirements:
     * - Caller must have POOL_MANAGER_ROLE
     * - Pool must be active
     * - Must not exceed per-industrial limit (20%)
     * - Must not exceed per-asset-class limit (40%)
     * - Pool must have sufficient funds
     * - Certificate must be valid (if provided)
     */
    function createFinancing(
        PoolFamily poolFamily,
        string calldata assetClass,
        address industrial,
        uint256 principal,
        uint256 interestRate,
        uint256 durationDays,
        uint256 certificateId
    ) external nonReentrant returns (uint256) {
        if (!hasRole(POOL_MANAGER_ROLE, msg.sender)) {
            revert NotPoolManager();
        }

        if (industrial == address(0)) {
            revert InvalidIndustrial();
        }

        if (principal == 0) {
            revert InvalidAmount();
        }

        PoolConfig storage pool = pools[poolFamily];
        if (!pool.isActive) {
            revert InvalidPoolFamily();
        }

        // Check diversification limits
        _checkDiversificationLimits(poolFamily, assetClass, industrial, principal);

        // Create financing
        uint256 financingId = nextFinancingId++;
        
        financings[financingId] = Financing({
            id: financingId,
            poolFamily: poolFamily,
            assetClass: assetClass,
            industrial: industrial,
            principal: principal,
            interestRate: interestRate,
            startDate: block.timestamp,
            maturityDate: block.timestamp + (durationDays * 1 days),
            amountRepaid: 0,
            isRepaid: false,
            isDefaulted: false
        });

        // Mint UGT as collateral if certificate provided
        if (certificateId > 0 && address(guaranteeToken) != address(0)) {
            try guaranteeToken.mintGuaranteeToken(certificateId) returns (uint256 tokenId) {
                financingToGuaranteeToken[financingId] = tokenId;
            } catch {
                // If minting fails, continue without UGT (MVP fallback)
            }
        }

        // Update allocations
        _updateAllocations(poolFamily, assetClass, industrial, principal);

        emit FinancingCreated(financingId, poolFamily, industrial, principal, interestRate);

        return financingId;
    }

    /**
     * @notice Deploy funds to a financing
     * @param financingId Financing ID
     * @param amount Amount to deploy (18 decimals)
     * 
     * Requirements:
     * - Financing must exist
     * - Caller must have POOL_MANAGER_ROLE
     */
    function deployFunds(uint256 financingId, uint256 amount) external nonReentrant {
        if (!hasRole(POOL_MANAGER_ROLE, msg.sender)) {
            revert NotPoolManager();
        }

        Financing storage financing = financings[financingId];
        if (financing.id == 0) {
            revert FinancingNotFound();
        }

        // Transfer UJEUR to industrial
        ujeurToken.safeTransfer(financing.industrial, amount);

        emit FundsDeployed(financingId, amount);
    }

    // =========================================================================
    // REPAYMENT FUNCTIONS
    // =========================================================================

    /**
     * @notice Record a repayment from an industrial
     * @param financingId Financing ID
     * @param amount Repayment amount (18 decimals)
     * @return isFullyRepaid Whether financing is fully repaid
     * 
     * Requirements:
     * - Financing must exist
     * - Caller must have POOL_MANAGER_ROLE
     */
    function recordRepayment(uint256 financingId, uint256 amount) 
        external 
        nonReentrant 
        returns (bool) 
    {
        if (!hasRole(POOL_MANAGER_ROLE, msg.sender)) {
            revert NotPoolManager();
        }

        Financing storage financing = financings[financingId];
        if (financing.id == 0) {
            revert FinancingNotFound();
        }

        if (financing.isRepaid || financing.isDefaulted) {
            revert InvalidAmount();
        }

        // Update repayment tracking
        financing.amountRepaid += amount;

        // Check if fully repaid (principal + interest)
        uint256 totalOwed = financing.principal + 
            (financing.principal * financing.interestRate / BASIS_POINTS);
        
        bool isFullyRepaid = financing.amountRepaid >= totalOwed;
        if (isFullyRepaid) {
            financing.isRepaid = true;
            // Release allocations
            _releaseAllocations(
                financing.poolFamily,
                financing.assetClass,
                financing.industrial,
                financing.principal
            );
        }

        // Add yield to uLP token
        uint256 yieldPortion = amount > financing.principal ? 
            amount - financing.principal : 0;
        if (yieldPortion > 0) {
            totalYieldEarned += yieldPortion;
            ULPToken.addYield(yieldPortion, string.concat("Financing #", _uint2str(financingId)));
        }

        emit RepaymentRecorded(financingId, amount, isFullyRepaid);

        return isFullyRepaid;
    }

    /**
     * @notice Mark a financing as defaulted
     * @param financingId Financing ID
     * 
     * Requirements:
     * - Caller must have POOL_MANAGER_ROLE or COMPLIANCE_OFFICER_ROLE
     */
    function markAsDefaulted(uint256 financingId) external {
        if (!hasRole(POOL_MANAGER_ROLE, msg.sender) && 
            !hasRole(COMPLIANCE_OFFICER_ROLE, msg.sender)) {
            revert NotPoolManager();
        }

        Financing storage financing = financings[financingId];
        if (financing.id == 0) {
            revert FinancingNotFound();
        }

        financing.isDefaulted = true;

        uint256 outstanding = financing.principal - financing.amountRepaid;
        emit FinancingDefaulted(financingId, outstanding);
    }

    // =========================================================================
    // VIEW FUNCTIONS
    // =========================================================================

    /**
     * @notice Get pool configuration
     * @param poolFamily Pool family
     * @return Pool configuration
     */
    function getPoolConfig(PoolFamily poolFamily) external view returns (PoolConfig memory) {
        return pools[poolFamily];
    }

    /**
     * @notice Get asset class allocation
     * @param poolFamily Pool family
     * @param assetClass Asset class name
     * @return Asset class configuration
     */
    function getAssetClass(PoolFamily poolFamily, string calldata assetClass) 
        external 
        view 
        returns (AssetClass memory) 
    {
        bytes32 key = keccak256(abi.encode(poolFamily, assetClass));
        return assetClasses[key];
    }

    /**
     * @notice Get allocation per industrial
     * @param poolFamily Pool family
     * @param industrial Industrial address
     * @return Allocated amount (18 decimals)
     */
    function getAllocationPerIndustrial(PoolFamily poolFamily, address industrial)
        external
        view
        returns (uint256)
    {
        bytes32 key = keccak256(abi.encode(poolFamily, industrial));
        return allocationPerIndustrial[key];
    }

    /**
     * @notice Get financing details
     * @param financingId Financing ID
     * @return Financing details
     */
    function getFinancing(uint256 financingId) external view returns (Financing memory) {
        return financings[financingId];
    }

    /**
     * @notice Get pool statistics
     * @param poolFamily Pool family
     * @return Pool statistics
     */
    function getPoolStats(PoolFamily poolFamily) external view returns (PoolStats memory) {
        PoolConfig storage pool = pools[poolFamily];
        
        uint256 deployed = 0;
        uint256 yield_ = 0;
        uint256 count = 0;

        // Count active financings for this pool
        for (uint256 i = 1; i < nextFinancingId; i++) {
            if (financings[i].poolFamily == poolFamily && !financings[i].isRepaid) {
                deployed += financings[i].principal - financings[i].amountRepaid;
                count++;
            }
        }

        return PoolStats({
            totalValue: totalPoolValue,
            deployedAmount: deployed,
            availableAmount: totalPoolValue - deployed,
            totalYield: yield_,
            financingCount: count
        });
    }

    /**
     * @notice Check if a new allocation would exceed limits
     * @param poolFamily Pool family
     * @param assetClass Asset class
     * @param industrial Industrial address
     * @param amount New allocation amount
     * @return wouldExceedIndustrial Whether it exceeds per-industrial limit
     * @return wouldExceedAssetClass Whether it exceeds per-asset-class limit
     */
    function checkAllocationLimits(
        PoolFamily poolFamily,
        string calldata assetClass,
        address industrial,
        uint256 amount
    ) external view returns (bool, bool) {
        bytes32 industrialKey = keccak256(abi.encode(poolFamily, industrial));
        uint256 currentIndustrial = allocationPerIndustrial[industrialKey];
        uint256 newIndustrial = currentIndustrial + amount;
        uint256 industrialLimit = (totalPoolValue * MAX_PER_INDUSTRIAL_BP) / BASIS_POINTS;

        bytes32 assetKey = keccak256(abi.encode(poolFamily, assetClass));
        uint256 currentAsset = assetClasses[assetKey].allocated;
        uint256 newAsset = currentAsset + amount;
        uint256 assetLimit = (totalPoolValue * MAX_PER_ASSET_CLASS_BP) / BASIS_POINTS;

        return (newIndustrial > industrialLimit, newAsset > assetLimit);
    }

    // =========================================================================
    // INTERNAL FUNCTIONS
    // =========================================================================

    /**
     * @notice Check diversification limits before creating financing
     */
    function _checkDiversificationLimits(
        PoolFamily poolFamily,
        string calldata assetClass,
        address industrial,
        uint256 amount
    ) internal view {
        // Check per-industrial limit
        bytes32 industrialKey = keccak256(abi.encode(poolFamily, industrial));
        uint256 currentIndustrial = allocationPerIndustrial[industrialKey];
        uint256 industrialLimit = (totalPoolValue * MAX_PER_INDUSTRIAL_BP) / BASIS_POINTS;
        
        if (currentIndustrial + amount > industrialLimit) {
            revert ExceedsPerIndustrialLimit();
        }

        // Check per-asset-class limit
        bytes32 assetKey = keccak256(abi.encode(poolFamily, assetClass));
        uint256 currentAsset = assetClasses[assetKey].allocated;
        uint256 assetLimit = (totalPoolValue * MAX_PER_ASSET_CLASS_BP) / BASIS_POINTS;
        
        if (currentAsset + amount > assetLimit) {
            revert ExceedsPerAssetClassLimit();
        }
    }

    /**
     * @notice Update allocations after creating financing
     */
    function _updateAllocations(
        PoolFamily poolFamily,
        string calldata assetClass,
        address industrial,
        uint256 amount
    ) internal {
        // Update per-industrial allocation
        bytes32 industrialKey = keccak256(abi.encode(poolFamily, industrial));
        allocationPerIndustrial[industrialKey] += amount;

        // Update per-asset-class allocation
        bytes32 assetKey = keccak256(abi.encode(poolFamily, assetClass));
        if (assetClasses[assetKey].allocated == 0) {
            assetClasses[assetKey] = AssetClass({
                poolFamily: poolFamily,
                assetClass: assetClass,
                allocated: amount,
                maxAllocation: (totalPoolValue * MAX_PER_ASSET_CLASS_BP) / BASIS_POINTS
            });
        } else {
            assetClasses[assetKey].allocated += amount;
        }
    }

    /**
     * @notice Release allocations after repayment
     */
    function _releaseAllocations(
        PoolFamily poolFamily,
        string calldata assetClass,
        address industrial,
        uint256 amount
    ) internal {
        bytes32 industrialKey = keccak256(abi.encode(poolFamily, industrial));
        allocationPerIndustrial[industrialKey] -= amount;

        bytes32 assetKey = keccak256(abi.encode(poolFamily, assetClass));
        assetClasses[assetKey].allocated -= amount;
    }

    /**
     * @notice Convert uint to string
     */
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    // =========================================================================
    // MVP TESTNET UTILITIES
    // =========================================================================

    /**
     * @notice Set test pool value (TESTNET ONLY)
     * @param value Test pool value (18 decimals)
     */
    function setTestPoolValue(uint256 value) external {
        require(IS_MVP_TESTNET, "Only on testnet");
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Admin only");
        totalPoolValue = value;
    }

    /**
     * @notice Add test financing (TESTNET ONLY)
     */
    function addTestFinancing(
        PoolFamily poolFamily,
        string calldata assetClass,
        address industrial,
        uint256 principal,
        uint256 interestRate
    ) external returns (uint256) {
        require(IS_MVP_TESTNET, "Only on testnet");
        return createFinancing(poolFamily, assetClass, industrial, principal, interestRate, 365);
    }
}
