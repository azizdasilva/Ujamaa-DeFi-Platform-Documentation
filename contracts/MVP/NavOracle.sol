// SPDX-License-Identifier: MIT
// Ujamaa DeFi Platform - NAV Oracle for Testnet
// Network: Polygon Amoy (Chain ID: 80002)

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title NavOracle
 * @notice NAV (Net Asset Value) price oracle for Ujamaa Pool Token
 * @dev Provides NAV per share data for the monitor dashboard
 *
 * Features:
 * - NAV per share updates
 * - Total pool value tracking
 * - Yield accrual tracking
 * - Authorized updater roles
 *
 * @notice MVP TESTNET: This is a testnet deployment.
 */
contract NavOracle is AccessControl {
    // =========================================================================
    // ROLES
    // =========================================================================

    /**
     * @notice Role for NAV updaters (Pool Manager)
     */
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    // =========================================================================
    // STATE VARIABLES
    // =========================================================================

    /**
     * @notice NAV per share (18 decimals)
     */
    uint256 public navPerShare;

    /**
     * @notice Total pool value (18 decimals)
     */
    uint256 public totalPoolValue;

    /**
     * @notice Total yield accrued (18 decimals)
     */
    uint256 public totalYieldAccrued;

    /**
     * @notice Last update timestamp
     */
    uint256 public lastUpdateTime;

    /**
     * @notice NAV history for monitoring
     */
    struct NavHistory {
        uint256 nav;
        uint256 timestamp;
        address updater;
    }

    NavHistory[] public navHistory;

    // =========================================================================
    // EVENTS
    // =========================================================================

    /**
     * @notice Emitted when NAV is updated
     */
    event NavUpdated(uint256 navPerShare, uint256 totalPoolValue, uint256 timestamp);

    /**
     * @notice Emitted when yield is accrued
     */
    event YieldAccrued(uint256 yieldAmount, uint256 totalYield, uint256 timestamp);

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    /**
     * @notice Initialize NavOracle
     * @param initialNav Initial NAV per share (18 decimals, e.g., 1e18 = €1.00)
     */
    constructor(uint256 initialNav) {
        if (initialNav == 0) {
            revert("Initial NAV must be > 0");
        }

        navPerShare = initialNav;
        totalPoolValue = 0;
        totalYieldAccrued = 0;
        lastUpdateTime = block.timestamp;

        // Grant roles to deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);

        // Record initial NAV
        navHistory.push(NavHistory({
            nav: initialNav,
            timestamp: block.timestamp,
            updater: msg.sender
        }));

        emit NavUpdated(initialNav, 0, block.timestamp);
    }

    // =========================================================================
    // CORE FUNCTIONS
    // =========================================================================

    /**
     * @notice Update NAV per share
     * @param _navPerShare New NAV per share (18 decimals)
     * @param _totalPoolValue New total pool value (18 decimals)
     */
    function updateNav(uint256 _navPerShare, uint256 _totalPoolValue) external onlyRole(UPDATER_ROLE) {
        if (_navPerShare == 0) {
            revert("NAV must be > 0");
        }

        navPerShare = _navPerShare;
        totalPoolValue = _totalPoolValue;
        lastUpdateTime = block.timestamp;

        navHistory.push(NavHistory({
            nav: _navPerShare,
            timestamp: block.timestamp,
            updater: msg.sender
        }));

        emit NavUpdated(_navPerShare, _totalPoolValue, block.timestamp);
    }

    /**
     * @notice Record yield accrual
     * @param yieldAmount Yield amount accrued (18 decimals)
     */
    function accrueYield(uint256 yieldAmount) external onlyRole(UPDATER_ROLE) {
        totalYieldAccrued += yieldAmount;
        lastUpdateTime = block.timestamp;

        emit YieldAccrued(yieldAmount, totalYieldAccrued, block.timestamp);
    }

    /**
     * @notice Get NAV history count
     * @return Number of NAV history entries
     */
    function getNavHistoryCount() external view returns (uint256) {
        return navHistory.length;
    }

    /**
     * @notice Get NAV history entry
     * @param index History entry index
     * @return nav NAV per share
     * @return timestamp Update timestamp
     * @return updater Address that updated
     */
    function getNavHistory(uint256 index) external view returns (
        uint256 nav,
        uint256 timestamp,
        address updater
    ) {
        require(index < navHistory.length, "Index out of bounds");
        NavHistory memory entry = navHistory[index];
        return (entry.nav, entry.timestamp, entry.updater);
    }

    /**
     * @notice Get latest NAV history entries
     * @param count Number of entries to return
     * @return navs Array of NAV values
     * @return timestamps Array of timestamps
     */
    function getLatestNavHistory(uint256 count) external view returns (
        uint256[] memory navs,
        uint256[] memory timestamps
    ) {
        uint256 historyLength = navHistory.length;
        if (count > historyLength) {
            count = historyLength;
        }

        navs = new uint256[](count);
        timestamps = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 index = historyLength - count + i;
            navs[i] = navHistory[index].nav;
            timestamps[i] = navHistory[index].timestamp;
        }

        return (navs, timestamps);
    }

    /**
     * @notice Check if updater is authorized
     * @param updater Address to check
     * @return Whether address has updater role
     */
    function isUpdater(address updater) external view returns (bool) {
        return hasRole(UPDATER_ROLE, updater);
    }
}
