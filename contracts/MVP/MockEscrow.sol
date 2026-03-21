// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ujamaa DeFi Platform
// Author: Aziz Da Silva - Lead Architect

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MockEscrow
 * @notice Simulated bank escrow accounts for MVP testnet
 * @dev Interface designed for easy swap with real BIIC/MCB bank integration
 * 
 * Features:
 * - Create escrow accounts for investors
 * - Simulate wire transfers (NO REAL MONEY)
 * - Track transaction history
 * - Mock account balances
 * 
 * Production Swap:
 * - Replace with BIICBankService or MCB bank integration
 * - Same interface: createEscrowAccount, deposit, withdraw
 * - Factory pattern handles swap (no code changes)
 * 
 * @reference SRS v2.0 Section 4.3, 5.12
 * @reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md Section 5.1
 * 
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 * @notice All balances and transfers are SIMULATED only.
 */
contract MockEscrow is AccessControl, ReentrancyGuard {
    // =========================================================================
    // CONSTANTS
    // =========================================================================

    /**
     * @notice Role for escrow administrators
     */
    bytes32 public constant ESCROW_ADMIN_ROLE = keccak256("ESCROW_ADMIN_ROLE");

    /**
     * @notice Role for bank operators (can process transfers)
     */
    bytes32 public constant BANK_OPERATOR_ROLE = keccak256("BANK_OPERATOR_ROLE");

    /**
     * @notice MVP Testnet flag
     */
    bool public constant IS_MVP_TESTNET = true;

    /**
     * @notice Mock bank name
     */
    string public constant BANK_NAME = "Mock Bank (MVP Testnet)";

    /**
     * @notice Initial balance for demo accounts (10M UJEUR)
     */
    uint256 public constant INITIAL_DEMO_BALANCE = 10_000_000 * 1e18;

    // =========================================================================
    // STRUCTS
    // =========================================================================

    /**
     * @notice Escrow account structure
     * @param accountId Unique account identifier
     * @param investor Investor address
     * @param balance Account balance (18 decimals)
     * @param isActive Whether account is active
     * @param createdAt Account creation timestamp
     * @param currency Account currency (e.g., "UJEUR_TEST")
     */
    struct EscrowAccount {
        string accountId;
        address investor;
        uint256 balance;
        bool isActive;
        uint256 createdAt;
        string currency;
    }

    /**
     * @notice Wire transfer structure
     * @param txId Unique transaction identifier
     * @param fromAccount Source account ID
     * @param toAccount Destination account ID
     * @param amount Transfer amount (18 decimals)
     * @param timestamp Transaction timestamp
     * @param status Transaction status
     * @param description Transaction description
     */
    struct WireTransfer {
        string txId;
        string fromAccount;
        string toAccount;
        uint256 amount;
        uint256 timestamp;
        string status;
        string description;
    }

    // =========================================================================
    // STATE VARIABLES
    // =========================================================================

    /**
     * @notice All escrow accounts by ID
     */
    mapping(string => EscrowAccount) public accounts;

    /**
     * @notice Investor to account ID mapping
     */
    mapping(address => string) public investorToAccount;

    /**
     * @notice All wire transfers
     */
    WireTransfer[] public transactions;

    /**
     * @notice Next account number suffix
     */
    uint256 public nextAccountNumber;

    /**
     * @notice Total deposits processed
     */
    uint256 public totalDeposits;

    /**
     * @notice Total withdrawals processed
     */
    uint256 public totalWithdrawals;

    // =========================================================================
    // EVENTS
    // =========================================================================

    /**
     * @notice Emitted when escrow account is created
     * @param accountId Account ID
     * @param investor Investor address
     * @param initialBalance Initial balance (18 decimals)
     */
    event EscrowAccountCreated(
        string indexed accountId,
        address indexed investor,
        uint256 initialBalance
    );

    /**
     * @notice Emitted when deposit is made
     * @param accountId Account ID
     * @param amount Deposit amount (18 decimals)
     * @param newBalance New balance after deposit
     */
    event DepositMade(string indexed accountId, uint256 amount, uint256 newBalance);

    /**
     * @notice Emitted when withdrawal is made
     * @param accountId Account ID
     * @param amount Withdrawal amount (18 decimals)
     * @param newBalance New balance after withdrawal
     */
    event WithdrawalMade(string indexed accountId, uint256 amount, uint256 newBalance);

    /**
     * @notice Emitted when wire transfer is simulated
     * @param txId Transaction ID
     * @param fromAccount Source account
     * @param toAccount Destination account
     * @param amount Transfer amount
     */
    event WireTransferSimulated(
        string indexed txId,
        string fromAccount,
        string toAccount,
        uint256 amount
    );

    /**
     * @notice Emitted when account is activated
     * @param accountId Account ID
     */
    event AccountActivated(string indexed accountId);

    /**
     * @notice Emitted when account is deactivated
     * @param accountId Account ID
     */
    event AccountDeactivated(string indexed accountId);

    // =========================================================================
    // ERRORS
    // =========================================================================

    error AccountNotFound();
    error AccountNotActive();
    error InsufficientBalance();
    error InvalidAmount();
    error InvalidAccount();
    error DuplicateAccount();
    error NotBankOperator();

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    /**
     * @notice Initialize MockEscrow
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ESCROW_ADMIN_ROLE, msg.sender);
        _grantRole(BANK_OPERATOR_ROLE, msg.sender);

        nextAccountNumber = 1;
        totalDeposits = 0;
        totalWithdrawals = 0;
    }

    // =========================================================================
    // CORE FUNCTIONS - ACCOUNT MANAGEMENT
    // =========================================================================

    /**
     * @notice Create escrow account for investor
     * @param investor Investor address
     * @param initialDeposit Initial deposit amount (18 decimals)
     * @return accountId Created account ID (format: MOCK-ESCROW-{number})
     * 
     * Requirements:
     * - Caller must have ESCROW_ADMIN_ROLE or BANK_OPERATOR_ROLE
     * - Investor must not have existing account
     */
    function createEscrowAccount(address investor, uint256 initialDeposit)
        external
        returns (string memory)
    {
        if (!hasRole(ESCROW_ADMIN_ROLE, msg.sender) && 
            !hasRole(BANK_OPERATOR_ROLE, msg.sender)) {
            revert NotBankOperator();
        }

        if (investor == address(0)) {
            revert InvalidAccount();
        }

        if (bytes(investorToAccount[investor]).length > 0) {
            revert DuplicateAccount();
        }

        // Generate account ID
        string memory accountId = string.concat(
            "MOCK-ESCROW-",
            _uint2str(nextAccountNumber++)
        );

        // Create account
        accounts[accountId] = EscrowAccount({
            accountId: accountId,
            investor: investor,
            balance: initialDeposit,
            isActive: true,
            createdAt: block.timestamp,
            currency: "UJEUR_TEST"
        });

        investorToAccount[investor] = accountId;

        if (initialDeposit > 0) {
            totalDeposits += initialDeposit;
        }

        emit EscrowAccountCreated(accountId, investor, initialDeposit);

        return accountId;
    }

    /**
     * @notice Create demo escrow account with initial balance
     * @param investor Investor address
     * @return accountId Created account ID
     * 
     * Requirements:
     * - Only on testnet
     * - Caller must have DEFAULT_ADMIN_ROLE
     */
    function createDemoAccount(address investor) external returns (string memory) {
        require(IS_MVP_TESTNET, "Only on testnet");
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Admin only");
        
        return createEscrowAccount(investor, INITIAL_DEMO_BALANCE);
    }

    /**
     * @notice Deposit funds into escrow account
     * @param accountId Account ID
     * @param amount Deposit amount (18 decimals)
     * @return newBalance New balance after deposit
     * 
     * Requirements:
     * - Account must exist and be active
     * - Caller must have BANK_OPERATOR_ROLE
     */
    function deposit(string calldata accountId, uint256 amount)
        external
        nonReentrant
        returns (uint256)
    {
        if (!hasRole(BANK_OPERATOR_ROLE, msg.sender)) {
            revert NotBankOperator();
        }

        EscrowAccount storage account = accounts[accountId];
        if (bytes(account.accountId).length == 0) {
            revert AccountNotFound();
        }

        if (!account.isActive) {
            revert AccountNotActive();
        }

        if (amount == 0) {
            revert InvalidAmount();
        }

        account.balance += amount;
        totalDeposits += amount;

        emit DepositMade(accountId, amount, account.balance);

        return account.balance;
    }

    /**
     * @notice Withdraw funds from escrow account
     * @param accountId Account ID
     * @param amount Withdrawal amount (18 decimals)
     * @return newBalance New balance after withdrawal
     * 
     * Requirements:
     * - Account must exist and be active
     * - Sufficient balance required
     * - Caller must have BANK_OPERATOR_ROLE
     */
    function withdraw(string calldata accountId, uint256 amount)
        external
        nonReentrant
        returns (uint256)
    {
        if (!hasRole(BANK_OPERATOR_ROLE, msg.sender)) {
            revert NotBankOperator();
        }

        EscrowAccount storage account = accounts[accountId];
        if (bytes(account.accountId).length == 0) {
            revert AccountNotFound();
        }

        if (!account.isActive) {
            revert AccountNotActive();
        }

        if (amount == 0 || amount > account.balance) {
            revert InsufficientBalance();
        }

        account.balance -= amount;
        totalWithdrawals += amount;

        emit WithdrawalMade(accountId, amount, account.balance);

        return account.balance;
    }

    // =========================================================================
    // WIRE TRANSFER FUNCTIONS
    // =========================================================================

    /**
     * @notice Simulate wire transfer between accounts
     * @dev NO REAL MONEY - simulation only
     * @param fromAccount Source account ID
     * @param toAccount Destination account ID
     * @param amount Transfer amount (18 decimals)
     * @param description Transfer description
     * @return txId Transaction ID
     * 
     * Requirements:
     * - Both accounts must exist and be active
     * - Source account must have sufficient balance
     * - Caller must have BANK_OPERATOR_ROLE
     */
    function simulateWireTransfer(
        string calldata fromAccount,
        string calldata toAccount,
        uint256 amount,
        string calldata description
    ) external nonReentrant returns (string memory) {
        if (!hasRole(BANK_OPERATOR_ROLE, msg.sender)) {
            revert NotBankOperator();
        }

        EscrowAccount storage fromAcc = accounts[fromAccount];
        EscrowAccount storage toAcc = accounts[toAccount];

        if (bytes(fromAcc.accountId).length == 0 || 
            bytes(toAcc.accountId).length == 0) {
            revert AccountNotFound();
        }

        if (!fromAcc.isActive || !toAcc.isActive) {
            revert AccountNotActive();
        }

        if (amount == 0 || amount > fromAcc.balance) {
            revert InsufficientBalance();
        }

        // Transfer funds (simulation)
        fromAcc.balance -= amount;
        toAcc.balance += amount;

        // Generate transaction ID
        string memory txId = string.concat(
            "MOCK-WIRE-",
            _uint2str(transactions.length)
        );

        // Record transaction
        transactions.push(WireTransfer({
            txId: txId,
            fromAccount: fromAccount,
            toAccount: toAccount,
            amount: amount,
            timestamp: block.timestamp,
            status: "COMPLETED_MVP",
            description: description
        }));

        emit WireTransferSimulated(txId, fromAccount, toAccount, amount);

        return txId;
    }

    /**
     * @notice Simulate incoming wire transfer (external source)
     * @param toAccount Destination account ID
     * @param amount Transfer amount (18 decimals)
     * @param description Transfer description
     * @return txId Transaction ID
     */
    function simulateIncomingWire(
        string calldata toAccount,
        uint256 amount,
        string calldata description
    ) external nonReentrant returns (string memory) {
        if (!hasRole(BANK_OPERATOR_ROLE, msg.sender)) {
            revert NotBankOperator();
        }

        EscrowAccount storage toAcc = accounts[toAccount];
        if (bytes(toAcc.accountId).length == 0) {
            revert AccountNotFound();
        }

        if (!toAcc.isActive) {
            revert AccountNotActive();
        }

        // Add funds (simulation - external source)
        toAcc.balance += amount;
        totalDeposits += amount;

        // Generate transaction ID
        string memory txId = string.concat(
            "MOCK-WIRE-IN-",
            _uint2str(transactions.length)
        );

        transactions.push(WireTransfer({
            txId: txId,
            fromAccount: "EXTERNAL",
            toAccount: toAccount,
            amount: amount,
            timestamp: block.timestamp,
            status: "COMPLETED_MVP",
            description: description
        }));

        emit DepositMade(toAccount, amount, toAcc.balance);

        return txId;
    }

    /**
     * @notice Simulate outgoing wire transfer (external destination)
     * @param fromAccount Source account ID
     * @param amount Transfer amount (18 decimals)
     * @param description Transfer description
     * @return txId Transaction ID
     */
    function simulateOutgoingWire(
        string calldata fromAccount,
        uint256 amount,
        string calldata description
    ) external nonReentrant returns (string memory) {
        if (!hasRole(BANK_OPERATOR_ROLE, msg.sender)) {
            revert NotBankOperator();
        }

        EscrowAccount storage fromAcc = accounts[fromAccount];
        if (bytes(fromAcc.accountId).length == 0) {
            revert AccountNotFound();
        }

        if (!fromAcc.isActive) {
            revert AccountNotActive();
        }

        if (amount == 0 || amount > fromAcc.balance) {
            revert InsufficientBalance();
        }

        // Remove funds (simulation - external destination)
        fromAcc.balance -= amount;
        totalWithdrawals += amount;

        // Generate transaction ID
        string memory txId = string.concat(
            "MOCK-WIRE-OUT-",
            _uint2str(transactions.length)
        );

        transactions.push(WireTransfer({
            txId: txId,
            fromAccount: fromAccount,
            toAccount: "EXTERNAL",
            amount: amount,
            timestamp: block.timestamp,
            status: "COMPLETED_MVP",
            description: description
        }));

        emit WithdrawalMade(fromAccount, amount, fromAcc.balance);

        return txId;
    }

    // =========================================================================
    // VIEW FUNCTIONS
    // =========================================================================

    /**
     * @notice Get escrow account details
     * @param accountId Account ID
     * @return accountId Account ID
     * @return investor Investor address
     * @return balance Account balance (18 decimals)
     * @return isActive Whether account is active
     * @return createdAt Creation timestamp
     * @return currency Account currency
     */
    function getAccount(string calldata accountId)
        external
        view
        returns (
            string memory,
            address,
            uint256,
            bool,
            uint256,
            string memory
        )
    {
        EscrowAccount storage account = accounts[accountId];
        return (
            account.accountId,
            account.investor,
            account.balance,
            account.isActive,
            account.createdAt,
            account.currency
        );
    }

    /**
     * @notice Get balance for account
     * @param accountId Account ID
     * @return Balance (18 decimals)
     */
    function getBalance(string calldata accountId) external view returns (uint256) {
        return accounts[accountId].balance;
    }

    /**
     * @notice Get account for investor
     * @param investor Investor address
     * @return accountId Account ID
     * @return balance Account balance
     */
    function getAccountByInvestor(address investor)
        external
        view
        returns (string memory, uint256)
    {
        string memory accountId = investorToAccount[investor];
        return (accountId, accounts[accountId].balance);
    }

    /**
     * @notice Get transaction count
     * @return Number of transactions
     */
    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }

    /**
     * @notice Get transaction by index
     * @param index Transaction index
     * @return txId Transaction ID
     * @return fromAccount Source account
     * @return toAccount Destination account
     * @return amount Transfer amount
     * @return timestamp Transaction timestamp
     * @return status Transaction status
     */
    function getTransaction(uint256 index)
        external
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            uint256,
            string memory
        )
    {
        WireTransfer storage tx = transactions[index];
        return (
            tx.txId,
            tx.fromAccount,
            tx.toAccount,
            tx.amount,
            tx.timestamp,
            tx.status
        );
    }

    /**
     * @notice Get transactions for account
     * @param accountId Account ID
     * @return Array of transaction indices
     */
    function getTransactionsForAccount(string calldata accountId)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory result = new uint256[](transactions.length);
        uint256 count = 0;

        for (uint256 i = 0; i < transactions.length; i++) {
            if (keccak256(bytes(transactions[i].fromAccount)) == keccak256(bytes(accountId)) ||
                keccak256(bytes(transactions[i].toAccount)) == keccak256(bytes(accountId))) {
                result[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        assembly {
            mstore(result, count)
        }

        return result;
    }

    /**
     * @notice Get escrow statistics
     * @return totalAccounts Total number of accounts
     * @return totalDeposits Total deposits processed
     * @return totalWithdrawals Total withdrawals processed
     * @return totalTransactions Total transactions
     */
    function getEscrowStats() external view returns (
        uint256,
        uint256,
        uint256,
        uint256
    ) {
        return (
            nextAccountNumber - 1,
            totalDeposits,
            totalWithdrawals,
            transactions.length
        );
    }

    // =========================================================================
    // ADMIN FUNCTIONS
    // =========================================================================

    /**
     * @notice Activate escrow account
     * @param accountId Account ID
     */
    function activateAccount(string calldata accountId) external onlyRole(ESCROW_ADMIN_ROLE) {
        accounts[accountId].isActive = true;
        emit AccountActivated(accountId);
    }

    /**
     * @notice Deactivate escrow account
     * @param accountId Account ID
     */
    function deactivateAccount(string calldata accountId) external onlyRole(ESCROW_ADMIN_ROLE) {
        accounts[accountId].isActive = false;
        emit AccountDeactivated(accountId);
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
     * @notice Set test balance (TESTNET ONLY)
     * @param accountId Account ID
     * @param balance Test balance (18 decimals)
     */
    function setTestBalance(string calldata accountId, uint256 balance) external {
        require(IS_MVP_TESTNET, "Only on testnet");
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Admin only");
        accounts[accountId].balance = balance;
    }

    /**
     * @notice Get mock bank info (TESTNET DEBUG)
     */
    function getMockBankInfo() external pure returns (
        string memory bankName,
        bool isTestnet,
        string memory currency
    ) {
        return (BANK_NAME, IS_MVP_TESTNET, "UJEUR_TEST");
    }
}
