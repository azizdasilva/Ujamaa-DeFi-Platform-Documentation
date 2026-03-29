// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ujamaa DeFi Platform
// Author: Aziz Da Silva - Lead Architect

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MockFiatRamp
 * @notice Simulated fiat on/off ramp for MVP testnet
 * @dev Mints test UJEUR for demo purposes, simulates EUR ↔ UJEUR conversion
 * 
 * Features:
 * - Mint test UJEUR (unlimited for testing)
 * - Simulate EUR → UJEUR conversion (on-ramp)
 * - Simulate UJEUR → EUR conversion (off-ramp)
 * - 2% FX fee on conversions
 * - Mock wire transfer tracking
 * 
 * Production Swap:
 * - Replace with real Circle UJEUR integration
 * - Replace with real bank fiat rails (BIIC/MCB)
 * - Same interface: onRamp, offRamp
 * - Factory pattern handles swap
 * 


 * 
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 * @notice All tokens minted are TEST TOKENS only.
 */
contract MockFiatRamp is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // =========================================================================
    // CONSTANTS
    // =========================================================================

    /**
     * @notice Role for ramp operators
     */
    bytes32 public constant RAMP_OPERATOR_ROLE = keccak256("RAMP_OPERATOR_ROLE");

    /**
     * @notice Role for fee managers
     */
    bytes32 public constant FEE_MANAGER_ROLE = keccak256("FEE_MANAGER_ROLE");

    /**
     * @notice MVP Testnet flag
     */
    bool public constant IS_MVP_TESTNET = true;

    /**
     * @notice FX fee rate (basis points)
     * @dev 200 = 2.00%
     */
    uint256 public constant FX_FEE_BP = 200;

    /**
     * @notice Basis points denominator
     */
    uint256 public constant BASIS_POINTS = 10000;

    /**
     * @notice EUR decimals (2 for fiat representation)
     */
    uint8 public constant EUR_DECIMALS = 2;

    /**
     * @notice UJEUR decimals (18 for ERC20)
     */
    uint8 public constant UJEUR_DECIMALS = 18;

    /**
     * @notice EUR to UJEUR parity (1:1)
     */
    uint256 public constant EUR_UJEUR_PARITY = 1e16; // 1 EUR = 1 UJEUR (adjusted for decimals)

    // =========================================================================
    // STRUCTS
    // =========================================================================

    /**
     * @notice Fiat ramp transaction
     * @param txId Unique transaction identifier
     * @param user User address
     * @param eurAmount EUR amount (2 decimals)
     * @param ujeurAmount UJEUR amount (18 decimals)
     * @param fee Fee amount (18 decimals)
     * @param timestamp Transaction timestamp
     * @param isOnRamp Whether on-ramp (true) or off-ramp (false)
     * @param status Transaction status
     * @param wireReference Mock wire transfer reference
     */
    struct FiatRampTransaction {
        string txId;
        address user;
        uint256 eurAmount;
        uint256 ujeurAmount;
        uint256 fee;
        uint256 timestamp;
        bool isOnRamp;
        string status;
        string wireReference;
    }

    // =========================================================================
    // STATE VARIABLES
    // =========================================================================

    /**
     * @notice Test UJEUR token address
     */
    IERC20 public testUJEUR;

    /**
     * @notice All fiat ramp transactions
     */
    FiatRampTransaction[] public transactions;

    /**
     * @notice Total on-ramp volume (UJEUR)
     */
    uint256 public totalOnRampVolume;

    /**
     * @notice Total off-ramp volume (UJEUR)
     */
    uint256 public totalOffRampVolume;

    /**
     * @notice Total fees collected
     */
    uint256 public totalFeesCollected;

    /**
     * @notice Per-user on-ramp limits (18 decimals)
     */
    mapping(address => uint256) public userDailyOnRampLimit;

    /**
     * @notice Per-user daily on-ramp tracking
     */
    mapping(address => mapping(uint256 => uint256)) public userDailyOnRamp;

    // =========================================================================
    // EVENTS
    // =========================================================================

    /**
     * @notice Emitted when test UJEUR is minted
     * @param to Recipient address
     * @param amount Amount minted (18 decimals)
     */
    event TestUJEURMinted(address indexed to, uint256 amount);

    /**
     * @notice Emitted when EUR → UJEUR on-ramp occurs
     * @param user User address
     * @param eurAmount EUR amount (2 decimals)
     * @param ujeurAmount UJEUR amount received (18 decimals)
     * @param fee Fee amount (18 decimals)
     * @param txId Transaction ID
     */
    event FiatOnRamp(
        address indexed user,
        uint256 eurAmount,
        uint256 ujeurAmount,
        uint256 fee,
        string txId
    );

    /**
     * @notice Emitted when UJEUR → EUR off-ramp occurs
     * @param user User address
     * @param ujeurAmount UJEUR amount burned (18 decimals)
     * @param eurAmount EUR amount received (2 decimals)
     * @param fee Fee amount (18 decimals)
     * @param txId Transaction ID
     */
    event FiatOffRamp(
        address indexed user,
        uint256 ujeurAmount,
        uint256 eurAmount,
        uint256 fee,
        string txId
    );

    /**
     * @notice Emitted when fee rate is updated
     * @param oldFee Old fee rate (basis points)
     * @param newFee New fee rate (basis points)
     */
    event FeeRateUpdated(uint256 oldFee, uint256 newFee);

    /**
     * @notice Emitted when daily limit is updated
     * @param user User address
     * @param limit New daily limit (18 decimals)
     */
    event DailyLimitUpdated(address indexed user, uint256 limit);

    // =========================================================================
    // ERRORS
    // =========================================================================

    error ZeroAmount();
    error InsufficientBalance();
    error ExceedsDailyLimit();
    error TestnetOnly();
    error NotRampOperator();
    error InvalidToken();

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    /**
     * @notice Initialize MockFiatRamp
     * @param _testUJEUR Test UJEUR token address
     */
    constructor(address _testUJEUR) {
        if (_testUJEUR == address(0)) {
            revert InvalidToken();
        }

        testUJEUR = IERC20(_testUJEUR);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(RAMP_OPERATOR_ROLE, msg.sender);
        _grantRole(FEE_MANAGER_ROLE, msg.sender);

        // Set default daily limits (1M UJEUR for testnet)
        userDailyOnRampLimit[msg.sender] = 1_000_000 * 1e18;
    }

    // =========================================================================
    // CORE FUNCTIONS - TESTNET MINTING
    // =========================================================================

    /**
     * @notice Mint test UJEUR for demo purposes
     * @dev Only available on testnet, for demo accounts
     * @param recipient Recipient address
     * @param amount Amount to mint (18 decimals)
     * 
     * Requirements:
     * - Only on testnet
     * - Caller must have DEFAULT_ADMIN_ROLE or RAMP_OPERATOR_ROLE
     */
    function mintTestUJEUR(address recipient, uint256 amount) external nonReentrant {
        require(IS_MVP_TESTNET, "Only on testnet");
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || 
            hasRole(RAMP_OPERATOR_ROLE, msg.sender),
            "Not authorized"
        );

        if (recipient == address(0) || amount == 0) {
            revert ZeroAmount();
        }

        // Mint test UJEUR (mock token)
        (bool success, ) = address(testUJEUR).call(
            abi.encodeWithSignature(
                "mint(address,uint256)",
                recipient,
                amount
            )
        );
        
        require(success, "Mint failed");

        emit TestUJEURMinted(recipient, amount);
    }

    /**
     * @notice Mint test UJEUR for caller (convenience function)
     * @param amount Amount to mint (18 decimals)
     */
    function mintTestUJEURSelf(uint256 amount) external {
        this.mintTestUJEUR(msg.sender, amount);
    }

    // =========================================================================
    // CORE FUNCTIONS - ON-RAMP (EUR → UJEUR)
    // =========================================================================

    /**
     * @notice Simulate EUR → UJEUR conversion (on-ramp)
     * @dev Mints UJEUR to user, simulates receiving EUR
     * @param eurAmount EUR amount to convert (2 decimals)
     * @param wireReference Mock wire transfer reference
     * @return ujeurAmount UJEUR amount received (18 decimals)
     * @return txId Transaction ID
     * 
     * Requirements:
     * - Only on testnet
     * - Caller must have RAMP_OPERATOR_ROLE
     * - Must not exceed daily limit
     */
    function onRamp(uint256 eurAmount, string calldata wireReference)
        external
        nonReentrant
        returns (uint256, string memory)
    {
        require(IS_MVP_TESTNET, "Only on testnet");
        
        if (!hasRole(RAMP_OPERATOR_ROLE, msg.sender)) {
            revert NotRampOperator();
        }

        if (eurAmount == 0) {
            revert ZeroAmount();
        }

        // Check daily limit
        uint256 today = block.timestamp / 1 days;
        uint256 currentDaily = userDailyOnRamp[msg.sender][today];
        uint256 limit = userDailyOnRampLimit[msg.sender];
        
        if (currentDaily + eurAmount > limit) {
            revert ExceedsDailyLimit();
        }

        // Calculate UJEUR amount (1:1 parity, adjusted for decimals)
        uint256 ujeurAmount = (eurAmount * 1e16); // 2 decimals → 18 decimals

        // Calculate fee (2%)
        uint256 fee = (ujeurAmount * FX_FEE_BP) / BASIS_POINTS;
        uint256 netAmount = ujeurAmount - fee;

        // Mint UJEUR to user
        (bool success, ) = address(testUJEUR).call(
            abi.encodeWithSignature(
                "mint(address,uint256)",
                msg.sender,
                netAmount
            )
        );
        require(success, "Mint failed");

        // Update tracking
        userDailyOnRamp[msg.sender][today] += eurAmount;
        totalOnRampVolume += netAmount;
        totalFeesCollected += fee;

        // Generate transaction ID
        string memory txId = string.concat(
            "MOCK-ONRAMP-",
            _uint2str(transactions.length)
        );

        // Record transaction
        transactions.push(FiatRampTransaction({
            txId: txId,
            user: msg.sender,
            eurAmount: eurAmount,
            ujeurAmount: netAmount,
            fee: fee,
            timestamp: block.timestamp,
            isOnRamp: true,
            status: "COMPLETED_MVP",
            wireReference: wireReference
        }));

        emit FiatOnRamp(msg.sender, eurAmount, netAmount, fee, txId);

        return (netAmount, txId);
    }

    // =========================================================================
    // CORE FUNCTIONS - OFF-RAMP (UJEUR → EUR)
    // =========================================================================

    /**
     * @notice Simulate UJEUR → EUR conversion (off-ramp)
     * @dev Burns UJEUR from user, simulates sending EUR
     * @param ujeurAmount UJEUR amount to convert (18 decimals)
     * @param wireReference Mock wire transfer reference
     * @return eurAmount EUR amount received (2 decimals)
     * @return txId Transaction ID
     * 
     * Requirements:
     * - Only on testnet
     * - Caller must have RAMP_OPERATOR_ROLE
     * - User must have sufficient UJEUR balance
     */
    function offRamp(uint256 ujeurAmount, string calldata wireReference)
        external
        nonReentrant
        returns (uint256, string memory)
    {
        require(IS_MVP_TESTNET, "Only on testnet");
        
        if (!hasRole(RAMP_OPERATOR_ROLE, msg.sender)) {
            revert NotRampOperator();
        }

        if (ujeurAmount == 0) {
            revert ZeroAmount();
        }

        // Check balance
        uint256 balance = testUJEUR.balanceOf(msg.sender);
        if (balance < ujeurAmount) {
            revert InsufficientBalance();
        }

        // Calculate fee (2%)
        uint256 fee = (ujeurAmount * FX_FEE_BP) / BASIS_POINTS;
        uint256 netAmount = ujeurAmount - fee;

        // Burn UJEUR from user
        (bool success, ) = address(testUJEUR).call(
            abi.encodeWithSignature(
                "burn(address,uint256)",
                msg.sender,
                ujeurAmount
            )
        );
        require(success, "Burn failed");

        // Calculate EUR amount (18 decimals → 2 decimals)
        uint256 eurAmount = netAmount / 1e16;

        // Update tracking
        totalOffRampVolume += netAmount;
        totalFeesCollected += fee;

        // Generate transaction ID
        string memory txId = string.concat(
            "MOCK-OFFRAMP-",
            _uint2str(transactions.length)
        );

        // Record transaction
        transactions.push(FiatRampTransaction({
            txId: txId,
            user: msg.sender,
            eurAmount: eurAmount,
            ujeurAmount: ujeurAmount,
            fee: fee,
            timestamp: block.timestamp,
            isOnRamp: false,
            status: "COMPLETED_MVP",
            wireReference: wireReference
        }));

        emit FiatOffRamp(msg.sender, ujeurAmount, eurAmount, fee, txId);

        return (eurAmount, txId);
    }

    // =========================================================================
    // VIEW FUNCTIONS
    // =========================================================================

    /**
     * @notice Calculate on-ramp output
     * @param eurAmount EUR amount (2 decimals)
     * @return ujeurAmount UJEUR amount after fee (18 decimals)
     * @return fee Fee amount (18 decimals)
     */
    function calculateOnRampOutput(uint256 eurAmount)
        external
        pure
        returns (uint256, uint256)
    {
        uint256 grossUJEUR = eurAmount * 1e16;
        uint256 fee = (grossUJEUR * FX_FEE_BP) / BASIS_POINTS;
        return (grossUJEUR - fee, fee);
    }

    /**
     * @notice Calculate off-ramp output
     * @param ujeurAmount UJEUR amount (18 decimals)
     * @return eurAmount EUR amount after fee (2 decimals)
     * @return fee Fee amount (18 decimals)
     */
    function calculateOffRampOutput(uint256 ujeurAmount)
        external
        pure
        returns (uint256, uint256)
    {
        uint256 fee = (ujeurAmount * FX_FEE_BP) / BASIS_POINTS;
        uint256 netUJEUR = ujeurAmount - fee;
        return (netUJEUR / 1e16, fee);
    }

    /**
     * @notice Get transaction by index
     * @param index Transaction index
     * @return txId Transaction ID
     * @return user User address
     * @return eurAmount EUR amount
     * @return ujeurAmount UJEUR amount
     * @return fee Fee amount
     * @return isOnRamp Whether on-ramp
     * @return status Transaction status
     */
    function getTransaction(uint256 index)
        external
        view
        returns (
            string memory,
            address,
            uint256,
            uint256,
            uint256,
            bool,
            string memory
        )
    {
        FiatRampTransaction storage tx = transactions[index];
        return (
            tx.txId,
            tx.user,
            tx.eurAmount,
            tx.ujeurAmount,
            tx.fee,
            tx.isOnRamp,
            tx.status
        );
    }

    /**
     * @notice Get transaction count
     * @return Number of transactions
     */
    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }

    /**
     * @notice Get user's daily on-ramp usage
     * @param user User address
     * @param day Day (unix timestamp / 1 days)
     * @return amount On-ramp amount for the day
     */
    function getUserDailyOnRamp(address user, uint256 day)
        external
        view
        returns (uint256)
    {
        return userDailyOnRamp[user][day];
    }

    /**
     * @notice Get user's daily on-ramp limit
     * @param user User address
     * @return limit Daily limit (18 decimals)
     */
    function getUserDailyOnRampLimit(address user) external view returns (uint256) {
        return userDailyOnRampLimit[user];
    }

    /**
     * @notice Get ramp statistics
     * @return totalOnRamp Total on-ramp volume
     * @return totalOffRamp Total off-ramp volume
     * @return totalFees Total fees collected
     * @return transactionCount Total transactions
     */
    function getRampStats() external view returns (
        uint256,
        uint256,
        uint256,
        uint256
    ) {
        return (
            totalOnRampVolume,
            totalOffRampVolume,
            totalFeesCollected,
            transactions.length
        );
    }

    // =========================================================================
    // ADMIN FUNCTIONS
    // =========================================================================

    /**
     * @notice Set user's daily on-ramp limit
     * @param user User address
     * @param limit New daily limit (18 decimals)
     */
    function setDailyLimit(address user, uint256 limit) external onlyRole(FEE_MANAGER_ROLE) {
        userDailyOnRampLimit[user] = limit;
        emit DailyLimitUpdated(user, limit);
    }

    /**
     * @notice Reset user's daily on-ramp tracking
     * @param user User address
     * @param day Day to reset
     */
    function resetDailyOnRamp(address user, uint256 day) external onlyRole(FEE_MANAGER_ROLE) {
        userDailyOnRamp[user][day] = 0;
    }

    // =========================================================================
    // INTERNAL FUNCTIONS
    // =========================================================================

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
     * @notice Get mock ramp info (TESTNET DEBUG)
     */
    function getMockRampInfo() external pure returns (
        string memory rampName,
        bool isTestnet,
        uint256 feeRate,
        string memory currency
    ) {
        return (
            "Mock Fiat Ramp (MVP Testnet)",
            IS_MVP_TESTNET,
            FX_FEE_BP,
            "UJEUR_TEST"
        );
    }

    /**
     * @notice Emergency withdraw fees (TESTNET ONLY)
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function withdrawFees(address to, uint256 amount) external {
        require(IS_MVP_TESTNET, "Only on testnet");
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Admin only");
        testUJEUR.safeTransfer(to, amount);
    }
}
