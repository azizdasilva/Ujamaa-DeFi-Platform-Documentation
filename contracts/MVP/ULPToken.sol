// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ujamaa DeFi Platform
// Author: Aziz Da Silva - Lead Architect

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../ERC3643/IdentityRegistry.sol";
import "../ERC3643/Compliance.sol";

/**
 * @title ULPToken (Ujamaa Liquidity Provider Token)
 * @notice ERC-3643 compliant yield-bearing liquidity pool token
 * @dev Value-accrual model: balance remains constant, NAV per share increases with yield
 *
 * This contract implements a yield-bearing token where:
 * - Users deposit UJEUR and receive uLP shares at current NAV
 * - Users redeem uLP shares and receive UJEUR at current NAV
 * - Yield accrues to the pool, increasing NAV per share
 * - Token balance remains constant; value grows via NAV appreciation
 *
 * ERC-3643 Compliance:
 * - Only verified identities can hold tokens
 * - Transfers require compliance validation
 * - Jurisdiction restrictions enforced
 * - Investment limits enforced
 *
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 * @notice Network: Polygon Amoy (Chain ID: 80002)
 */
contract ULPToken is ERC20, AccessControl, ReentrancyGuard {
    // =========================================================================
    // CONSTANTS
    // =========================================================================

    /**
     * @notice Role for pool managers (can add yield, update NAV)
     */
    bytes32 public constant POOL_MANAGER_ROLE = keccak256("POOL_MANAGER_ROLE");

    /**
     * @notice Role for minters (can mint uLP on deposit)
     */
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /**
     * @notice Role for redeemers (can burn uLP on redemption)
     */
    bytes32 public constant REDEEMER_ROLE = keccak256("REDEEMER_ROLE");

    /**
     * @notice MVP Testnet flag
     * @dev Always returns true for testnet deployment
     */
    bool public constant IS_MVP_TESTNET = true;

    /**
     * @notice Initial NAV per share (1.00 with 18 decimals)
     */
    uint256 public constant INITIAL_NAV = 1e18;

    // =========================================================================
    // STATE VARIABLES
    // =========================================================================

    /**
     * @notice Total pool value in UJEUR (18 decimals)
     * @dev Increases with deposits and yield, decreases with redemptions
     */
    uint256 private s_totalPoolValue;

    /**
     * @notice NAV (Net Asset Value) per share (18 decimals)
     * @dev Updated on deposits, redemptions, and yield accrual
     */
    uint256 private s_navPerShare;

    /**
     * @notice Timestamp of last NAV update
     * @dev Updated on deposits, redemptions, and yield accrual
     */
    uint256 private s_lastNavUpdate;

    /**
     * @notice Identity registry for ERC-3643 compliance
     */
    IdentityRegistry public immutable IDENTITY_REGISTRY;

    /**
     * @notice Compliance module for transfer validation
     */
    Compliance public immutable COMPLIANCE_MODULE;

    /**
     * @notice Accumulated yield (18 decimals)
     * @dev Total yield accrued since inception
     */
    uint256 private s_accumulatedYield;

    /**
     * @notice Management fee rate (basis points)
     * @dev 200 = 2.00% annual fee
     */
    uint256 private s_managementFeeRate;

    /**
     * @notice Performance fee rate (basis points)
     * @dev 2000 = 20.00% of yield above hurdle
     */
    uint256 private s_performanceFeeRate;

    /**
     * @notice Hurdle rate (basis points)
     * @dev 500 = 5.00% minimum return before performance fee
     */
    uint256 private s_hurdleRate;

    /**
     * @notice Last fee calculation timestamp
     */
    uint256 private s_lastFeeCalculation;

    /**
     * @notice Pending yield (not yet accrued)
     */
    uint256 private s_pendingYield;

    /**
     * @notice UJEUR token address (ERC20)
     */
    address public ujeurToken;

    // =========================================================================
    // EVENTS
    // =========================================================================

    /**
     * @notice Emitted when UJEUR is deposited and uLP minted
     * @param investor Investor address
     * @param ujeurAmount Amount of UJEUR deposited (18 decimals)
     * @param uptMinted Amount of uLP minted (18 decimals)
     * @param nav NAV per share at time of deposit
     */
    event Deposit(
        address indexed investor,
        uint256 ujeurAmount,
        uint256 uptMinted,
        uint256 nav
    );

    /**
     * @notice Emitted when uLP is redeemed and UJEUR withdrawn
     * @param investor Investor address
     * @param uptBurned Amount of uLP burned (18 decimals)
     * @param ujeurAmount Amount of UJEUR withdrawn (18 decimals)
     * @param nav NAV per share at time of redemption
     */
    event Redemption(
        address indexed investor,
        uint256 uptBurned,
        uint256 ujeurAmount,
        uint256 nav
    );

    /**
     * @notice Emitted when yield is added to the pool
     * @param yieldAmount Yield amount added (18 decimals)
     * @param newNav New NAV per share after yield
     * @param source Yield source (e.g., industrial repayment, fee)
     */
    event YieldAdded(uint256 yieldAmount, uint256 newNav, string source);

    /**
     * @notice Emitted when fees are calculated and accrued
     * @param managementFee Management fee amount (18 decimals)
     * @param performanceFee Performance fee amount (18 decimals)
     * @param netYield Net yield after fees (18 decimals)
     */
    event FeesAccrued(uint256 managementFee, uint256 performanceFee, uint256 netYield);

    /**
     * @notice Emitted when fee rates are updated
     * @param managementFeeRate New management fee rate (basis points)
     * @param performanceFeeRate New performance fee rate (basis points)
     * @param hurdleRate New hurdle rate (basis points)
     */
    event FeeRatesUpdated(
        uint256 managementFeeRate,
        uint256 performanceFeeRate,
        uint256 hurdleRate
    );

    /**
     * @notice Emitted when UJEUR token is set
     * @param ujeurToken UJEUR token address
     */
    event UJEURTokenSet(address indexed ujeurToken);

    // =========================================================================
    // ERRORS
    // =========================================================================

    /**
     * @notice Error when deposit amount is zero
     */
    error ZeroDeposit();

    /**
     * @notice Error when redemption amount is zero
     */
    error ZeroRedemption();

    /**
     * @notice Error when insufficient uLP for redemption
     */
    error InsufficientULP();

    /**
     * @notice Error when insufficient UJEUR in pool
     */
    error InsufficientPoolValue();

    /**
     * @notice Error when caller is not a pool manager
     */
    error NotPoolManager();

    /**
     * @notice Error when UJEUR token not set
     */
    error UJEURTokenNotSet();

    /**
     * @notice Error when transfer fails
     */
    error TransferFailed();

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    /**
     * @notice Initialize UPTToken contract
     * @param _ujeurToken UJEUR token address (ERC20)
     * @param _managementFeeRate Management fee rate in basis points (e.g., 200 = 2%)
     * @param _performanceFeeRate Performance fee rate in basis points (e.g., 2000 = 20%)
     * @param _hurdleRate Hurdle rate in basis points (e.g., 500 = 5%)
     * @param _identityRegistry Identity registry address for ERC-3643
     * @param _compliance Compliance module address for ERC-3643
     */
    constructor(
        address _ujeurToken,
        uint256 _managementFeeRate,
        uint256 _performanceFeeRate,
        uint256 _hurdleRate,
        address _identityRegistry,
        address _compliance
    ) ERC20("Ujamaa Liquidity Provider Token", "uLP") {
        // Allow address(0) for testnet deployment
        if (_ujeurToken != address(0)) {
            ujeurToken = _ujeurToken;
        }
        // else: UJEUR token will be set later for testnet
        if (_identityRegistry == address(0)) {
            revert("ULPToken: Zero identity registry");
        }
        if (_compliance == address(0)) {
            revert("ULPToken: Zero compliance");
        }

        ujeurToken = _ujeurToken;
        IDENTITY_REGISTRY = IdentityRegistry(_identityRegistry);
        COMPLIANCE_MODULE = Compliance(_compliance);
        s_navPerShare = INITIAL_NAV;
        s_lastNavUpdate = block.timestamp;
        s_totalPoolValue = 0;
        s_accumulatedYield = 0;
        s_pendingYield = 0;

        s_managementFeeRate = _managementFeeRate;
        s_performanceFeeRate = _performanceFeeRate;
        s_hurdleRate = _hurdleRate;
        s_lastFeeCalculation = block.timestamp;

        // Grant admin role to deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(POOL_MANAGER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(REDEEMER_ROLE, msg.sender);

        emit UJEURTokenSet(_ujeurToken);
    }

    // =========================================================================
    // CORE FUNCTIONS - DEPOSIT & REDEMPTION
    // =========================================================================

    /**
     * @notice Deposit UJEUR and mint uLP shares
     * @dev Calculates uLP amount based on current NAV
     *      New shares = ujeurAmount / NAV_per_share
     * @param ujeurAmount Amount of UJEUR to deposit (18 decimals)
     * @return uptMinted Amount of uLP shares minted (18 decimals)
     * 
     * Requirements:
     * - Caller must have MINTER_ROLE
     * - ujeurAmount must be > 0
     * - UJEUR transfer must succeed
     */
    function deposit(uint256 ujeurAmount) external nonReentrant returns (uint256) {
        if (ujeurAmount == 0) {
            revert ZeroDeposit();
        }

        // Calculate uLP to mint based on current NAV
        uint256 uptMinted = ujeurAmount / s_navPerShare;

        // Handle first deposit (NAV = 1.00)
        if (totalSupply() == 0) {
            uptMinted = ujeurAmount; // 1:1 at inception
        }

        // Update pool state
        s_totalPoolValue += ujeurAmount;

        // Mint uLP to investor
        _mint(msg.sender, uptMinted);

        // Transfer UJEUR from investor to pool
        _transferUJEURFrom(msg.sender, address(this), ujeurAmount);

        emit Deposit(msg.sender, ujeurAmount, uptMinted, s_navPerShare);

        return uptMinted;
    }

    /**
     * @notice Redeem uLP shares for UJEUR
     * @dev Calculates UJEUR amount based on current NAV
     *      ujeurAmount = uptAmount * NAV_per_share
     * @param uptAmount Amount of uLP to redeem (18 decimals)
     * @return ujeurAmount Amount of UJEUR received (18 decimals)
     * 
     * Requirements:
     * - Caller must have REDEEMER_ROLE
     * - uptAmount must be > 0
     * - Caller must have sufficient uLP balance
     * - Pool must have sufficient UJEUR
     */
    function redeem(uint256 uptAmount) external nonReentrant returns (uint256) {
        if (uptAmount == 0) {
            revert ZeroRedemption();
        }

        if (balanceOf(msg.sender) < uptAmount) {
            revert InsufficientULP();
        }

        // Calculate UJEUR to return based on current NAV
        uint256 ujeurAmount = (uptAmount * s_navPerShare) / 1e18;

        if (s_totalPoolValue < ujeurAmount) {
            revert InsufficientPoolValue();
        }

        // Update pool state
        s_totalPoolValue -= ujeurAmount;

        // Burn uLP from investor
        _burn(msg.sender, uptAmount);

        // Transfer UJEUR from pool to investor
        _transferUJEUR(msg.sender, ujeurAmount);

        emit Redemption(msg.sender, uptAmount, ujeurAmount, s_navPerShare);

        return ujeurAmount;
    }

    // =========================================================================
    // YIELD ACCRUAL FUNCTIONS
    // =========================================================================

    /**
     * @notice Add yield to the pool (increases NAV)
     * @dev Called by pool manager when industrial repayments or other yield received
     *      New NAV = (totalPoolValue + yield) / totalShares
     * @param yieldAmount Yield amount to add (18 decimals)
     * @param source Description of yield source (e.g., "Industrial Repayment #123")
     * @return newNav New NAV per share after yield
     * 
     * Requirements:
     * - Caller must have POOL_MANAGER_ROLE
     * - yieldAmount must be > 0
     */
    function addYield(uint256 yieldAmount, string calldata source) external returns (uint256) {
        if (!hasRole(POOL_MANAGER_ROLE, msg.sender)) {
            revert NotPoolManager();
        }

        if (yieldAmount == 0) {
            revert ZeroDeposit();
        }

        // Add yield to pool value
        s_totalPoolValue += yieldAmount;
        s_pendingYield += yieldAmount;

        // Recalculate NAV
        uint256 newNav = calculateNAV();
        s_navPerShare = newNav;

        emit YieldAdded(yieldAmount, newNav, source);

        return newNav;
    }

    /**
     * @notice Accrue fees and add net yield to pool
     * @dev Calculates management fee (time-based) and performance fee (yield-based)
     *      Net yield = pendingYield - managementFee - performanceFee
     * @return managementFee Management fee amount (18 decimals)
     * @return performanceFee Performance fee amount (18 decimals)
     * @return netYield Net yield after fees (18 decimals)
     */
    function accrueFees() public returns (uint256, uint256, uint256) {
        if (!hasRole(POOL_MANAGER_ROLE, msg.sender)) {
            revert NotPoolManager();
        }

        uint256 timeElapsed = block.timestamp - s_lastFeeCalculation;
        uint256 yearInSeconds = 365 days;

        // Calculate management fee (annual fee, pro-rated)
        // managementFee = totalPoolValue * (feeRate / 10000) * (timeElapsed / year)
        uint256 managementFee = (s_totalPoolValue * s_managementFeeRate * timeElapsed) / 
                                (10000 * yearInSeconds);

        // Calculate performance fee (on yield above hurdle)
        // Simplified: performanceFee = pendingYield * (performanceFeeRate / 10000)
        // In production, this would compare actual yield vs hurdle rate
        uint256 performanceFee = (s_pendingYield * s_performanceFeeRate) / 10000;

        // Net yield to investors
        uint256 netYield = s_pendingYield - managementFee - performanceFee;

        // Reset pending yield
        s_pendingYield = 0;
        s_lastFeeCalculation = block.timestamp;

        // Track accumulated yield (net)
        s_accumulatedYield += netYield;

        emit FeesAccrued(managementFee, performanceFee, netYield);

        return (managementFee, performanceFee, netYield);
    }

    // =========================================================================
    // VIEW FUNCTIONS
    // =========================================================================

    /**
     * @notice Get current NAV per share
     * @return NAV per share (18 decimals)
     *
     * Formula: NAV = totalPoolValue / totalShares
     * Returns INITIAL_NAV (1.00) if no shares exist
     */
    function getNAV() external view returns (uint256) {
        return s_navPerShare;
    }

    /**
     * @notice Get NAV per share (alias for getNAV)
     * @return NAV per share (18 decimals)
     */
    function navPerShare() external view returns (uint256) {
        return s_navPerShare;
    }

    /**
     * @notice Get last NAV update timestamp
     * @return Timestamp of last NAV update
     */
    function lastNavUpdate() external view returns (uint256) {
        return s_lastNavUpdate;
    }

    /**
     * @notice Calculate current NAV per share
     * @return NAV per share (18 decimals)
     */
    function calculateNAV() public view returns (uint256) {
        uint256 totalShares = totalSupply();
        if (totalShares == 0) {
            return INITIAL_NAV;
        }
        return s_totalPoolValue / totalShares;
    }

    /**
     * @notice Get total pool value in UJEUR
     * @return Total pool value (18 decimals)
     */
    function getTotalPoolValue() external view returns (uint256) {
        return s_totalPoolValue;
    }

    /**
     * @notice Get accumulated yield
     * @return Accumulated yield (18 decimals)
     */
    function getAccumulatedYield() external view returns (uint256) {
        return s_accumulatedYield;
    }

    /**
     * @notice Get pending yield (not yet accrued)
     * @return Pending yield (18 decimals)
     */
    function getPendingYield() external view returns (uint256) {
        return s_pendingYield;
    }

    /**
     * @notice Calculate investor's share value in UJEUR
     * @param investor Investor address
     * @return Value in UJEUR (18 decimals)
     * 
     * Formula: Value = balance * NAV
     */
    function getValue(address investor) external view returns (uint256) {
        uint256 balance = balanceOf(investor);
        return (balance * s_navPerShare) / 1e18;
    }

    /**
     * @notice Get value per share (alias for getNAV)
     * @return Value per share in UJEUR (18 decimals)
     */
    function getValuePerShare() external view returns (uint256) {
        return s_navPerShare;
    }

    /**
     * @notice Get fee rates
     * @return managementFeeRate Management fee rate (basis points)
     * @return performanceFeeRate Performance fee rate (basis points)
     * @return hurdleRate Hurdle rate (basis points)
     */
    function getFeeRates() external view returns (uint256, uint256, uint256) {
        return (s_managementFeeRate, s_performanceFeeRate, s_hurdleRate);
    }

    /**
     * @notice Get pool statistics
     * @return totalPoolValue Total pool value in UJEUR (18 decimals)
     * @return totalShares Total uLP shares outstanding (18 decimals)
     * @return navPerShare NAV per share (18 decimals)
     * @return accumulatedYield Accumulated yield (18 decimals)
     */
    function getPoolStats() external view returns (
        uint256 totalPoolValue,
        uint256 totalShares,
        uint256 navPerShare,
        uint256 accumulatedYield
    ) {
        return (s_totalPoolValue, totalSupply(), s_navPerShare, s_accumulatedYield);
    }

    // =========================================================================
    // ADMIN FUNCTIONS
    // =========================================================================

    /**
     * @notice Update fee rates
     * @dev Only admin can update fee rates
     * @param _managementFeeRate New management fee rate (basis points)
     * @param _performanceFeeRate New performance fee rate (basis points)
     * @param _hurdleRate New hurdle rate (basis points)
     */
    function setFeeRates(
        uint256 _managementFeeRate,
        uint256 _performanceFeeRate,
        uint256 _hurdleRate
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        s_managementFeeRate = _managementFeeRate;
        s_performanceFeeRate = _performanceFeeRate;
        s_hurdleRate = _hurdleRate;

        emit FeeRatesUpdated(_managementFeeRate, _performanceFeeRate, _hurdleRate);
    }

    /**
     * @notice Set UJEUR token address (emergency recovery)
     * @dev Only admin, for emergency recovery only
     * @param _ujeurToken New UJEUR token address
     */
    function setUJEURToken(address _ujeurToken) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_ujeurToken == address(0)) {
            revert UJEURTokenNotSet();
        }
        ujeurToken = _ujeurToken;
        emit UJEURTokenSet(_ujeurToken);
    }

    // =========================================================================
    // INTERNAL FUNCTIONS
    // =========================================================================

    /**
     * @notice Transfer UJEUR from sender to recipient
     * @param from Sender address
     * @param to Recipient address
     * @param amount Amount to transfer (18 decimals)
     */
    function _transferUJEURFrom(address from, address to, uint256 amount) internal {
        (bool success, ) = ujeurToken.call(
            abi.encodeWithSignature(
                "transferFrom(address,address,uint256)",
                from,
                to,
                amount
            )
        );
        if (!success) {
            revert TransferFailed();
        }
    }

    /**
     * @notice Transfer UJEUR to recipient
     * @param to Recipient address
     * @param amount Amount to transfer (18 decimals)
     */
    function _transferUJEUR(address to, uint256 amount) internal {
        (bool success, ) = ujeurToken.call(
            abi.encodeWithSignature(
                "transfer(address,uint256)",
                to,
                amount
            )
        );
        if (!success) {
            revert TransferFailed();
        }
    }

    // =========================================================================
    // MVP TESTNET UTILITIES
    // =========================================================================

    /**
     * @notice Mint test uLP for demo purposes (TESTNET ONLY)
     * @dev Only available on testnet, for demo accounts
     * @param to Recipient address
     * @param amount Amount to mint (18 decimals)
     */
    function mintTestULP(address to, uint256 amount) external {
        require(IS_MVP_TESTNET, "Only on testnet");
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Admin only");
        // ERC-3643: Check recipient identity
        require(IDENTITY_REGISTRY.isVerified(to), "ULPToken: Recipient not verified");
        _mint(to, amount);
    }

    /**
     * @notice Set test pool value for demo (TESTNET ONLY)
     * @dev Only available on testnet, for demo purposes
     * @param value Test pool value (18 decimals)
     */
    function setTestPoolValue(uint256 value) external {
        require(IS_MVP_TESTNET, "Only on testnet");
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Admin only");
        s_totalPoolValue = value;
    }

    // =========================================================================
    // ERC-3643 COMPLIANCE OVERRIDES
    // =========================================================================

    /**
     * @notice Override transfer to add ERC-3643 compliance check
     * @param to Recipient address
     * @param amount Transfer amount
     * @return Success status
     */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        // ERC-3643: Check compliance
        require(
            COMPLIANCE_MODULE.canTransfer(msg.sender, to, amount),
            string(abi.encodePacked(
                "ULPToken: Transfer blocked - ",
                COMPLIANCE_MODULE.getComplianceReason(msg.sender, to, amount)
            ))
        );
        return super.transfer(to, amount);
    }

    /**
     * @notice Override transferFrom to add ERC-3643 compliance check
     * @param from Sender address
     * @param to Recipient address
     * @param amount Transfer amount
     * @return Success status
     */
    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        // ERC-3643: Check compliance
        require(
            COMPLIANCE_MODULE.canTransfer(from, to, amount),
            string(abi.encodePacked(
                "ULPToken: Transfer blocked - ",
                COMPLIANCE_MODULE.getComplianceReason(from, to, amount)
            ))
        );
        return super.transferFrom(from, to, amount);
    }
}
