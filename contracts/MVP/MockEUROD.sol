// SPDX-License-Identifier: MIT
// Mock EUROD Token for MVP Testnet Deployment
// EUROD = Ondo EUROD (Euro-pegged stablecoin)

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title MockEUROD
 * @notice Mock EUROD token for testnet deployment
 * @dev Simple ERC20 with minting for testing
 *      EUROD is the primary stablecoin for Ujamaa platform
 */
contract MockEUROD is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("Ondo EUROD Token", "EUROD") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
